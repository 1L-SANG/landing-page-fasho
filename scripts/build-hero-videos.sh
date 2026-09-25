#!/usr/bin/env bash
# 목적: 휴대폰과 PC 첫 화면용 짧은 편집본을 원본 고화질 영상에서 함께 만든다.
# 재료: video/wearless.mp4 (1920x1080, 30fps)
# 출력: public/video/optimized/wearless-mobile.mp4 (1080x810, 무음)
#       public/video/optimized/wearless-mobile-poster.jpg (출력 영상 첫 프레임)
#       public/video/optimized/wearless-desktop.mp4 (1920x1080, 무음)
#       public/video/optimized/wearless-desktop-poster.jpg (출력 영상 첫 프레임)
# 장면 표: 순서 | 내용 | 원본 구간(초) | 휴대폰 자르기 x,y,폭,높이 | PC 자르기 x,y,폭,높이 | 정지
# 1 | 사진 올린 화면 | 3.80 한 프레임 | 140,0,1360,1020 | 0,0,1808,1017 | 1.0초
# 2 | 모델과 매칭 의류 고르기 | 16.20~18.00 | 480,0,1440,1080 | 320,0,1600,900
# 3 | 콘티보드 제목 | 22.50~23.90 | 420,0,1080,810 | 240,0,1440,810
# 4 | 모델 사진 세트 | 32.00~34.60 | 560,90,1080,810 | 330,90,1440,810
# 5 | 마네킹 조정 | 52.50~56.50 | 680,120,1120,840 | 427,120,1488,837
# 6 | MD'S PICK | 86.25 한 프레임 | 655,230,840,630 | 515,230,1120,630 | 1.6초
# 7 | SUMMER MOOD | 86.40 한 프레임 | 655,230,840,630 | 515,230,1120,630 | 1.1초
# 8 | LOOK 01 | 86.10 한 프레임 | 655,230,840,630 | 515,230,1120,630 | 1.1초
# 9 | DETAIL CHECK | 86.00 한 프레임 | 655,230,840,630 | 515,230,1120,630 | 1.1초
# 10 | SIZE INFO | 86.50 한 프레임 | 655,230,840,630 | 515,230,1120,630 | 1.5초 (영상 끝)
# 1~6번 장면 사이는 0.25초 fade를 다섯 번 겹친다.
# 6~10번 장면 사이는 0.35초 slideup을 네 번 겹친다.

set -euo pipefail
export LC_ALL=C
cd "${BASH_SOURCE[0]%/*}/.."

input='video/wearless.mp4'

# 외부 계산 도구 없이 마이크로초 단위 정수로 길이와 offset을 계산한다.
source_duration=$(ffprobe -v error -select_streams v:0 \
    -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 "$input")
whole=${source_duration%.*}
fraction=${source_duration#*.}000000
source_us=$((10#$whole * 1000000 + 10#${fraction:0:6}))
if ((source_us <= 86500000)); then
    printf '오류: 원본 영상은 86.50초보다 길어야 합니다.\n' >&2
    exit 1
fi

seconds() {
    printf '%d.%06d' "$(($1 / 1000000))" "$(($1 % 1000000))"
}

durations=(1000000 1800000 1400000 2600000 4000000 1600000 1100000 1100000 1100000 1500000)
transition_durations=(250000 250000 250000 250000 250000 350000 350000 350000 350000)
total_us=${durations[0]}
offsets=()
for ((i = 1; i < ${#durations[@]}; i++)); do
    transition_us=${transition_durations[i - 1]}
    offsets+=("$(seconds "$((total_us - transition_us))")")
    total_us=$((total_us + durations[i] - transition_us))
done
total=$(seconds "$total_us")
printf '원본 길이: %s초\n계산한 편집 길이: %s초\n' "$source_duration" "$total"
printf '전환 offset(초): %s\n' "${offsets[*]}"

build_video() {
    local variant=$1
    local width=$2
    local height=$3
    local maxrate=$4
    local bufsize=$5
    shift 5
    # 자르기 배열은 ffmpeg 순서인 폭:높이:x:y로 전달한다.
    local crops=("$@")
    local output="public/video/optimized/wearless-${variant}.mp4"
    local poster="public/video/optimized/wearless-${variant}-poster.jpg"
    local normalize="scale=${width}:${height}:flags=lanczos,setsar=1,fps=30,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS"
    local filters
    printf '\n%s판 생성: %sx%s, 계산 길이 %s초\n' "$variant" "$width" "$height" "$total"
filters="
[0:v]trim=end_frame=1,crop=${crops[0]}:exact=1,${normalize},tpad=stop_mode=clone:stop_duration=1,trim=duration=1[s0];
[1:v]trim=duration=1.8,crop=${crops[1]}:exact=1,${normalize}[s1];
[2:v]trim=duration=1.4,crop=${crops[2]}:exact=1,${normalize}[s2];
[3:v]trim=duration=2.6,crop=${crops[3]}:exact=1,${normalize}[s3];
[4:v]trim=duration=4,crop=${crops[4]}:exact=1,${normalize}[s4];
[5:v]trim=end_frame=1,crop=${crops[5]}:exact=1,${normalize},tpad=stop_mode=clone:stop_duration=1.6,trim=duration=1.6[s5];
[6:v]trim=end_frame=1,crop=${crops[5]}:exact=1,${normalize},tpad=stop_mode=clone:stop_duration=1.1,trim=duration=1.1[s6];
[7:v]trim=end_frame=1,crop=${crops[5]}:exact=1,${normalize},tpad=stop_mode=clone:stop_duration=1.1,trim=duration=1.1[s7];
[8:v]trim=end_frame=1,crop=${crops[5]}:exact=1,${normalize},tpad=stop_mode=clone:stop_duration=1.1,trim=duration=1.1[s8];
[9:v]trim=end_frame=1,crop=${crops[5]}:exact=1,${normalize},tpad=stop_mode=clone:stop_duration=1.5,trim=duration=1.5[s9];
[s0][s1]xfade=transition=fade:duration=0.25:offset=${offsets[0]}[x1];
[x1][s2]xfade=transition=fade:duration=0.25:offset=${offsets[1]}[x2];
[x2][s3]xfade=transition=fade:duration=0.25:offset=${offsets[2]}[x3];
[x3][s4]xfade=transition=fade:duration=0.25:offset=${offsets[3]}[x4];
[x4][s5]xfade=transition=fade:duration=0.25:offset=${offsets[4]}[x5];
[x5][s6]xfade=transition=slideup:duration=0.35:offset=${offsets[5]}[x6];
[x6][s7]xfade=transition=slideup:duration=0.35:offset=${offsets[6]}[x7];
[x7][s8]xfade=transition=slideup:duration=0.35:offset=${offsets[7]}[x8];
[x8][s9]xfade=transition=slideup:duration=0.35:offset=${offsets[8]},format=yuv420p[out]
"

ffmpeg -hide_banner -y \
    -ss 3.80 -t 0.10 -i "$input" \
    -ss 16.20 -t 1.80 -i "$input" \
    -ss 22.50 -t 1.40 -i "$input" \
    -ss 32.00 -t 2.60 -i "$input" \
    -ss 52.50 -t 4.00 -i "$input" \
    -ss 86.25 -t 0.10 -i "$input" \
    -ss 86.40 -t 0.10 -i "$input" \
    -ss 86.10 -t 0.10 -i "$input" \
    -ss 86.00 -t 0.10 -i "$input" \
    -ss 86.50 -t 0.10 -i "$input" \
    -filter_complex "$filters" -map '[out]' -t "$total" -an \
    -c:v libx264 -preset slow -crf 23 -profile:v high -level 4.0 \
    -pix_fmt yuv420p -maxrate "$maxrate" -bufsize "$bufsize" -movflags +faststart "$output"

ffmpeg -hide_banner -y -i "$output" -frames:v 1 -an -q:v 3 -update 1 "$poster"
}

build_video mobile 1080 810 2M 4M \
    1360:1020:140:0 1440:1080:480:0 1080:810:420:0 \
    1080:810:560:90 1120:840:680:120 840:630:655:230
build_video desktop 1920 1080 4M 8M \
    1808:1017:0:0 1600:900:320:0 1440:810:240:0 \
    1440:810:330:90 1488:837:427:120 1120:630:515:230

for file in \
    public/video/optimized/wearless-mobile.mp4 \
    public/video/optimized/wearless-mobile-poster.jpg \
    public/video/optimized/wearless-desktop.mp4 \
    public/video/optimized/wearless-desktop-poster.jpg; do
    printf '\nffprobe 요약: %s\n' "$file"
    ffprobe -v error -select_streams v:0 \
        -show_entries stream=width,height,r_frame_rate,duration:format=duration,size \
        -of json "$file"
done
