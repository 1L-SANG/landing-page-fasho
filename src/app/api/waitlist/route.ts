import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const NOTIFY_EMAIL = 'dlftkd3269@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json().catch(() => ({}))) as { email?: unknown };
        const email = typeof body.email === 'string' ? body.email.trim() : '';

        if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
            return NextResponse.json(
                { error: '올바른 이메일 주소를 입력해주세요.' },
                { status: 400 }
            );
        }

        const entry = {
            email,
            notify: NOTIFY_EMAIL,
            submittedAt: new Date().toISOString(),
            userAgent: req.headers.get('user-agent') ?? null,
        };

        try {
            const dataDir = path.join(process.cwd(), 'data');
            await fs.mkdir(dataDir, { recursive: true });
            const file = path.join(dataDir, 'waitlist.jsonl');
            await fs.appendFile(file, JSON.stringify(entry) + '\n', 'utf8');
        } catch (writeErr) {
            console.error('[waitlist] failed to write file:', writeErr);
        }

        console.log('[waitlist] new entry:', JSON.stringify(entry));

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error('[waitlist] error:', err);
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
            { status: 500 }
        );
    }
}
