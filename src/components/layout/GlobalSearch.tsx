import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Leaf, BookOpen, Bug, Library } from 'lucide-react';
import { CROPS } from '@/data/crops';
import { SCHEMES } from '@/data/schemes';
import { PESTS_DISEASES } from '@/data/pestsDiseases';
import { ARTICLES } from '@/data/articles';

interface SearchResult {
  type: 'crop' | 'scheme' | 'pest' | 'article';
  id: string;
  title: string;
  subtitle?: string;
  route: string;
}

interface GlobalSearchProps {
  onClose: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q) { setResults([]); return; }

    const cropResults: SearchResult[] = CROPS
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: 'crop', id: c.id, title: c.name, subtitle: c.category, route: `/crops/${c.id}` }));

    const schemeResults: SearchResult[] = SCHEMES
      .filter(s => s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q))
      .slice(0, 3)
      .map(s => ({ type: 'scheme', id: s.id, title: s.name, subtitle: s.level, route: `/schemes` }));

    const pestResults: SearchResult[] = PESTS_DISEASES
      .filter(p => p.name.toLowerCase().includes(q))
      .slice(0, 2)
      .map(p => ({ type: 'pest', id: p.id, title: p.name, subtitle: p.type, route: `/pests-diseases` }));

    const articleResults: SearchResult[] = ARTICLES
      .filter(a => a.title.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)))
      .slice(0, 2)
      .map(a => ({ type: 'article', id: a.id, title: a.title, subtitle: a.category, route: `/knowledge/${a.id}` }));

    setResults([...cropResults, ...schemeResults, ...pestResults, ...articleResults]);
  }, [query]);

  const TypeIcon = {
    crop: Leaf,
    scheme: BookOpen,
    pest: Bug,
    article: Library,
  };

  function handleSelect(result: SearchResult) {
    navigate(result.route);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] p-2 animate-scale-up" onClick={e => e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-3 py-2.5 border-b border-[var(--color-border)]">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search crops, schemes, pests, articles…"
            className="flex-1 text-sm bg-transparent outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
            aria-label="Global search"
          />
          <button onClick={onClose} className="flex items-center justify-center w-6 h-6 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map(r => {
              const Icon = TypeIcon[r.type];
              return (
                <li key={`${r.type}-${r.id}`}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-surface-1)] rounded-lg transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0 text-[var(--color-text-secondary)]" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{r.title}</p>
                      {r.subtitle && <p className="text-xs text-[var(--color-text-muted)] capitalize">{r.subtitle.replace(/_/g, ' ')}</p>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : query.trim() ? (
          <div className="py-8 text-center text-xs text-[var(--color-text-muted)]">No results for &quot;{query}&quot;</div>
        ) : (
          <div className="py-6 text-center text-xs text-[var(--color-text-muted)]">Search across crops, schemes, pests &amp; diseases, and articles.</div>
        )}
      </div>
    </div>
  );
}
