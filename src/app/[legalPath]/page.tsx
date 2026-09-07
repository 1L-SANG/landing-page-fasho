import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import documents from '../../../content/legal/manifest.json';
import styles from './legal.module.css';

type Props = { params: Promise<{ legalPath: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
    return documents.map((document) => ({ legalPath: document.path.slice(1) }));
}

function getDocument(legalPath: string) {
    const document = documents.find((item) => item.path === `/${legalPath}`);
    if (!document) notFound();
    return document;
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { legalPath } = await params;
    const document = getDocument(legalPath);
    const inherited = await parent;
    const title = `${document.title} | Wearless`;
    return {
        title,
        alternates: { canonical: document.canonicalUrl },
        openGraph: {
            ...inherited.openGraph,
            title,
            url: document.canonicalUrl,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            images: inherited.twitter?.images,
        },
    };
}

export default async function LegalPage({ params }: Props) {
    const { legalPath } = await params;
    const document = getDocument(legalPath);
    const markdown = await readFile(path.join(process.cwd(), 'content/legal', `${document.slug}.md`), 'utf8');
    // Only the versioned, repository-owned legal Markdown is rendered here.
    const html = marked.parse(markdown, { gfm: true, async: false })
        .replace(/^<h1>[\s\S]*?<\/h1>\s*/, '')
        .replaceAll('<table>', `<div class="${styles.tableWrap}" role="region" aria-label="법적 고지 표" tabindex="0"><table>`)
        .replaceAll('</table>', '</table></div>');
    const [year, month, day] = document.effectiveDate.split('-').map(Number);

    return (
        <div className={styles.page}>
            <article className={styles.article}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>법적 고지</p>
                    <h1>{document.title}</h1>
                    <p className={styles.meta}>
                        시행일 <time dateTime={document.effectiveDate}>{year}년 {month}월 {day}일</time> · {document.version}
                    </p>
                    <nav className={styles.related} aria-label="다른 법적 고지">
                        {documents.filter((item) => item.slug !== document.slug).map((item) => (
                            <Link key={item.slug} href={item.path}>{item.label}</Link>
                        ))}
                    </nav>
                </header>
                <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
            </article>
        </div>
    );
}
