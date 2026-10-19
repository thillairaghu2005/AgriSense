import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageHeader, Badge, InfoBanner, DemoLabel, EmptyState } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { SearchInput, Select } from '@/components/forms/FormComponents';
import { ARTICLES } from '@/data/articles';
import type { ArticleCategory } from '@/types';
import { storageGet, storageSet, STORAGE_KEYS } from '@/lib/storage';
import { formatDate } from '@/lib/formatters';
import {
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Tag,
} from 'lucide-react';

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  seasonal_guide: 'Seasonal Advisory',
  best_practice: 'Agronomic Best Practice',
  pest_management: 'Integrated Pest Management',
  soil_health: 'Soil Health & Fertility',
  water_management: 'Micro-Irrigation & Water',
  market_tips: 'Post-Harvest & Mandi Insights',
  scheme_guide: 'Scheme Implementation Guide',
};

export default function KnowledgePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarksOnly, setBookmarksOnly] = useState(false);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    storageGet(STORAGE_KEYS.BOOKMARKED_ARTICLES, [])
  );

  function toggleBookmark(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const next = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(b => b !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(next);
    storageSet(STORAGE_KEYS.BOOKMARKED_ARTICLES, next);
  }

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter(art => {
      // Category filter
      if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;

      // Bookmarks filter
      if (bookmarksOnly && !bookmarkedIds.includes(art.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesSummary = art.summary.toLowerCase().includes(q);
        const matchesTag = art.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesTag) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, bookmarksOnly, bookmarkedIds]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Knowledge Centre & Field Guides"
        subtitle="Practical guides, crop protection techniques, and seasonal advisories"
        badge={<DemoLabel label="Extension library" />}
      />

      <InfoBanner variant="info">
        <strong>Practical farmer knowledge:</strong> Articles provide field-tested techniques aligned with Indian agricultural practices. Consult your district KVK for hyper-local micro-climate advice.
      </InfoBanner>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search guides, topics, crops…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            className="text-xs py-1.5"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>

          <button
            onClick={() => setBookmarksOnly(!bookmarksOnly)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-all ${
              bookmarksOnly
                ? 'bg-[var(--color-primary-600)] border-[var(--color-primary-600)] text-white'
                : 'bg-white border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]'
            }`}
          >
            {bookmarksOnly ? <BookmarkCheck className="w-3.5 h-3.5 text-white" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>Saved ({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Article Grid */}
      {filteredArticles.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-[var(--color-text-muted)]" />}
            title="No articles match your criteria"
            description="Try relaxing your search terms or unchecking the saved filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setBookmarksOnly(false);
                }}
              >
                Reset Search Filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map(article => {
            const isSaved = bookmarkedIds.includes(article.id);

            return (
              <Card
                key={article.id}
                onClick={() => navigate(`/knowledge/${article.id}`)}
                className="transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge>
                      {CATEGORY_LABELS[article.category] || article.category}
                    </Badge>
                    <button
                      onClick={e => toggleBookmark(e, article.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-[var(--color-primary-600)]'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                      }`}
                      aria-label={isSaved ? 'Remove bookmark' : 'Bookmark article'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-text-primary)] leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[var(--color-text-secondary)] mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap mt-3">
                    {article.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTimeMinutes} min read
                    </span>
                    <span>{formatDate(article.publishedDate)}</span>
                  </div>

                  <span className="text-xs font-semibold text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)] flex items-center gap-0.5">
                    Read guide <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
