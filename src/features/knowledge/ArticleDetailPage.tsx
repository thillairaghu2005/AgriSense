import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ARTICLES } from '@/data/articles';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import { formatDate } from '@/lib/formatters';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Bookmark,
  BookmarkCheck,
  Tag,
  Share2,
  Sparkles,
  Info,
} from 'lucide-react';

// Helper to format inline markdown like **bold** text
function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-[var(--color-text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    storageGet(STORAGE_KEYS.BOOKMARKED_ARTICLES, [])
  );
  const [copied, setCopied] = useState(false);

  const article = ARTICLES.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="py-16 text-center space-y-6">
        <Info className="w-12 h-12 text-neutral-400 mx-auto" />
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Article Not Found
          </h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1.5 max-w-sm mx-auto">
            The requested educational guide or advisory article could not be located.
          </p>
        </div>
        <Button variant="outline" size="md" onClick={() => navigate('/knowledge')}>
          Back to Knowledge Centre
        </Button>
      </div>
    );
  }

  const isSaved = bookmarkedIds.includes(article.id);

  function toggleBookmark() {
    const next = isSaved
      ? bookmarkedIds.filter(b => b !== article!.id)
      : [...bookmarkedIds, article!.id];
    setBookmarkedIds(next);
    storageSet(STORAGE_KEYS.BOOKMARKED_ARTICLES, next);
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const relatedArticles = ARTICLES.filter(a => a.id !== article.id).slice(0, 3);

  // Parse markdown body into structured sections based on ## headers without losing paragraph breaks
  const normalizedBody = article.body.replace(/\r\n/g, '\n');
  const rawSections = normalizedBody.split(/\n(?=## )/);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-10 animate-fade-in">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-4">
        <button
          onClick={() => navigate('/knowledge')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 hover:text-[var(--color-primary-700)] transition-colors py-2 px-3 rounded-lg hover:bg-[var(--color-surface-2)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Centre</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleBookmark}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border flex items-center gap-2 transition-all ${
              isSaved
                ? 'bg-[var(--color-primary-600)] text-white border-[var(--color-primary-600)] shadow-xs'
                : 'bg-white text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4" />}
            <span>{isSaved ? 'Saved in My Library' : 'Save Article'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-xl border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-2)] transition-colors relative"
            title="Copy article link"
            aria-label="Share article"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-xs text-[var(--color-primary-700)] font-semibold animate-fade-in">
              Link copied!
            </span>
          )}
        </div>
      </div>

      {/* Main Article Card with Generous Whitespace */}
      <article className="card p-8 sm:p-12 md:p-14 shadow-sm rounded-2xl">
        {/* Article Meta Header */}
        <header className="space-y-6 pb-10">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className="px-3.5 py-1 text-xs uppercase font-bold tracking-wider">
              {article.category.replace('_', ' ')}
            </Badge>
            {article.sourceLabel && (
              <span className="text-xs text-[var(--color-text-muted)] font-medium">
                Source: {article.sourceLabel}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight mt-3 mb-5">
            {article.title}
          </h1>

          <div className="flex items-center gap-6 text-xs sm:text-sm text-[var(--color-text-muted)] flex-wrap pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[var(--color-text-muted)]" />
              Published: {formatDate(article.publishedDate)}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
              {article.readingTimeMinutes} min read
            </span>
          </div>

          {/* Key Summary Callout Box */}
          <div className="mt-8 p-6 sm:p-7 bg-[var(--color-primary-50)] rounded-2xl border border-[var(--color-primary-200)]">
            <p className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary-900)] mb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-primary-700)]" /> Executive Summary
            </p>
            <p className="text-base sm:text-lg text-[var(--color-primary-900)] font-medium leading-relaxed sm:leading-8">
              {article.summary}
            </p>
          </div>
        </header>

        {/* Structured Article Body */}
        <div className="pt-10 space-y-12 text-[var(--color-text-secondary)]">
          {rawSections.map((sectionText, sIdx) => {
            let headerTitle = '';
            let bodyContent = sectionText.trim();

            if (bodyContent.startsWith('## ')) {
              const firstNewline = bodyContent.indexOf('\n');
              if (firstNewline !== -1) {
                headerTitle = bodyContent.slice(3, firstNewline).trim();
                bodyContent = bodyContent.slice(firstNewline).trim();
              } else {
                headerTitle = bodyContent.slice(3).trim();
                bodyContent = '';
              }
            }

            // Split body content by double newline to preserve distinct paragraphs
            const paragraphs = bodyContent.split(/\n{2,}/).filter(p => p.trim());

            return (
              <section key={sIdx} className="space-y-6 pt-8 first:pt-0">
                {headerTitle && (
                  <div className="pb-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
                      {headerTitle}
                    </h2>
                  </div>
                )}

                {/* Paragraphs and items within this section */}
                <div className="space-y-6">
                  {paragraphs.map((block, bIdx) => {
                    const trimmed = block.trim();
                    if (!trimmed) return null;

                    // Blockquote
                    if (trimmed.startsWith('> ')) {
                      return (
                        <div
                          key={bIdx}
                          className="my-8 p-6 sm:p-7 bg-neutral-50 rounded-2xl border border-neutral-200 text-neutral-800 text-base leading-relaxed sm:leading-8 flex items-start gap-4 shadow-xs"
                        >
                          <Info className="w-5 h-5 text-neutral-700 flex-shrink-0 mt-1" />
                          <div className="italic">
                            {formatInlineMarkdown(trimmed.replace(/^>\s*/, ''))}
                          </div>
                        </div>
                      );
                    }

                    // Bullet List
                    if (trimmed.startsWith('- ') || trimmed.includes('\n- ')) {
                      const listItems = trimmed
                        .split('\n')
                        .filter(l => l.trim().startsWith('- '))
                        .map(l => l.trim().replace(/^- /, ''));

                      return (
                        <ul key={bIdx} className="my-6 space-y-3.5 pl-2">
                          {listItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-3.5 text-base sm:text-[17px] text-[var(--color-text-secondary)] leading-relaxed sm:leading-8">
                              <span className="text-neutral-500 mt-0.5 flex-shrink-0">—</span>
                              <span>{formatInlineMarkdown(item)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    // Numbered List
                    if (/^\d+\.\s/.test(trimmed) || /\n\d+\.\s/.test(trimmed)) {
                      const listItems = trimmed
                        .split('\n')
                        .filter(l => /^\d+\.\s/.test(l.trim()))
                        .map(l => {
                          const match = l.trim().match(/^(\d+)\.\s*(.*)/);
                          return {
                            num: match ? match[1] : '-',
                            text: match ? match[2] : l.trim(),
                          };
                        });

                      return (
                        <ol key={bIdx} className="my-6 space-y-4 pl-2">
                          {listItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-4 text-base sm:text-[17px] text-[var(--color-text-secondary)] leading-relaxed sm:leading-8">
                              <span className="text-sm font-bold text-neutral-800 mt-1 flex-shrink-0 min-w-[20px]">
                                {item.num}.
                              </span>
                              <span>{formatInlineMarkdown(item.text)}</span>
                            </li>
                          ))}
                        </ol>
                      );
                    }

                    // Standard Paragraph with clear spacing and comfortable line-height
                    return (
                      <p
                        key={bIdx}
                        className="text-base sm:text-[17px] text-[var(--color-text-secondary)] leading-relaxed sm:leading-8"
                      >
                        {formatInlineMarkdown(trimmed)}
                      </p>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Article Tags Footer */}
        <footer className="mt-14 pt-8 flex items-center gap-2.5 flex-wrap">
          <span className="text-xs sm:text-sm text-[var(--color-text-muted)] font-semibold flex items-center gap-1.5 mr-1">
            <Tag className="w-4 h-4" /> Topics:
          </span>
          {article.tags.map(t => (
            <span
              key={t}
              className="text-xs bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] px-3 py-1.5 rounded-full font-medium"
            >
              #{t}
            </span>
          ))}
        </footer>
      </article>

      {/* Recommended Related Reading */}
      <section className="space-y-5 pt-6">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
          Recommended Reading in Knowledge Centre
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {relatedArticles.map(rel => (
            <Card
              key={rel.id}
              onClick={() => navigate(`/knowledge/${rel.id}`)}
              className="transition-all cursor-pointer p-6 flex flex-col justify-between group bg-white"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-600 block mb-2 tracking-wide">
                  {rel.category.replace('_', ' ')}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] line-clamp-2 transition-colors leading-snug">
                  {rel.title}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2.5 line-clamp-2 leading-relaxed">
                  {rel.summary}
                </p>
              </div>
              <div className="mt-5 pt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {rel.readingTimeMinutes} min
                </span>
                <span className="font-semibold text-neutral-900 group-hover:underline">
                  Read Guide →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
