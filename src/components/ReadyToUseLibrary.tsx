import { useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, Search } from 'lucide-react';
import { READY_TO_USE_SETS, type ReadySet, type SavedCollectionItem } from '../data/libraryData';
import { CopyButton, copyToClipboard } from './CopyButton';
import { EditorialImage } from './EditorialImage';

interface ReadyToUseLibraryProps {
  savedIds: Set<string>;
  onToggleSave: (item: Omit<SavedCollectionItem, 'createdAt'>) => void;
  onNotify: (message: string) => void;
}

const FILTER_CATEGORIES = [
  'All',
  'Aesthetic & Design',
  'Beach & Summer',
  'Quotes & Motivation',
  'Travel & Nature',
] as const;

export function ReadyToUseLibrary({
  savedIds,
  onToggleSave,
  onNotify,
}: ReadyToUseLibraryProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof FILTER_CATEGORIES)[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTipsId, setExpandedTipsId] = useState<string | null>(null);
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);

  const filteredSets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return READY_TO_USE_SETS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.caption.toLowerCase().includes(query) ||
        item.hashtags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleSingleTagClick = async (tag: string, cardId: string) => {
    const ok = await copyToClipboard(tag);
    if (ok) {
      const key = `${cardId}:${tag}`;
      setCopiedSingleTag(key);
      onNotify(`Copied ${tag}`);
      window.setTimeout(() => {
        setCopiedSingleTag((prev) => (prev === key ? null : prev));
      }, 1500);
    }
  };

  const handleSaveCard = (item: ReadySet) => {
    onToggleSave({
      id: `ready-${item.id}`,
      title: item.title,
      topic: item.category,
      platformNote: item.platforms.join(' · '),
      caption: item.caption,
      hashtags: item.hashtags,
    });
  };

  return (
    <section id="library" className="py-16 md:py-20 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-blue-700 mb-2">
              Ready-to-use content
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance">
              Curated Captions &amp; Viral Hashtag Packs
            </h2>
            <p className="mt-2.5 text-base text-slate-600 max-w-2xl">
              Copy an entire post in one click, grab just the caption, or click any individual hashtag to copy it to your clipboard.
            </p>
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search captions or #tags..."
              aria-label="Search ready-to-use captions or hashtags"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/10"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto mb-10 w-fit max-w-full"
          role="tablist"
          aria-label="Filter ready-to-use collections"
        >
          {FILTER_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        {filteredSets.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <p className="font-display text-lg font-medium text-slate-900">
              No matching collections found
            </p>
            <p className="text-sm text-slate-500 mt-1.5 mb-5">
              Try clearing your search term or switching back to all collections.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSets.map((item, idx) => {
              const isSaved = savedIds.has(`ready-${item.id}`);
              const tipsOpen = expandedTipsId === item.id;
              const fullPostText = `${item.caption}\n\n${item.hashtags.join(' ')}`;
              const isFullWidthFeatured = filteredSets.length === 5 && idx === 0;

              return (
                <article
                  key={item.id}
                  className={`bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col ${
                    isFullWidthFeatured ? 'lg:col-span-2 lg:grid lg:grid-cols-12' : ''
                  }`}
                >
                  {/* Visual Frame */}
                  <div
                    className={`bg-slate-100 overflow-hidden ${
                      isFullWidthFeatured ? 'lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/3]'
                    }`}
                  >
                    <EditorialImage
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      title={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Editorial Body */}
                  <div
                    className={`p-6 md:p-7 flex flex-col justify-between gap-6 ${
                      isFullWidthFeatured ? 'lg:col-span-7' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                            <span>{item.bestFormat}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.platforms.join(' / ')}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono-tabular">
                              {item.hashtags.length} tags
                            </span>
                          </div>
                          <h3 className="font-display text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
                            {item.index}. {item.title}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveCard(item)}
                          aria-label={isSaved ? `Remove ${item.title} from saved sets` : `Save ${item.title}`}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                            isSaved
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4" strokeWidth={1.75} />
                          ) : (
                            <Bookmark className="w-4 h-4" strokeWidth={1.75} />
                          )}
                        </button>
                      </div>

                      {/* Caption Block */}
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-medium text-slate-500">
                            Caption
                          </span>
                          <span className="text-xs text-slate-400 font-mono-tabular">
                            {item.caption.length} chars
                          </span>
                        </div>
                        <p className="text-base md:text-[17px] leading-relaxed text-slate-900 font-normal">
                          &ldquo;{item.caption}&rdquo;
                        </p>
                      </div>

                      {/* Hashtags Block */}
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="text-xs font-medium text-slate-500">
                            Hashtags (click any tag to copy)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 font-mono text-[13px] leading-relaxed text-slate-700">
                          {item.hashtags.map((tag) => {
                            const isTagCopied = copiedSingleTag === `${item.id}:${tag}`;
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleSingleTagClick(tag, item.id)}
                                className={`px-1 -mx-1 rounded transition-colors cursor-pointer ${
                                  isTagCopied
                                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                                    : 'hover:bg-blue-50 hover:text-blue-700'
                                }`}
                              >
                                {isTagCopied ? `${tag} ✓` : tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Optional Platform Notes */}
                      {tipsOpen && (
                        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 leading-relaxed">
                          <p>
                            <span className="font-semibold text-slate-800">Pinterest:</span>{' '}
                            {item.pinterestTip}
                          </p>
                          <p>
                            <span className="font-semibold text-slate-800">YouTube:</span>{' '}
                            {item.youtubeTip}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Row */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <CopyButton
                          text={fullPostText}
                          label="Copy Caption & Tags"
                          variant="primary"
                          onCopied={() => onNotify(`Copied "${item.title}" full post`)}
                        />
                        <CopyButton
                          text={item.caption}
                          label="Copy Caption"
                          variant="secondary"
                          onCopied={() => onNotify(`Copied caption from "${item.title}"`)}
                        />
                        <CopyButton
                          text={item.hashtags.join(' ')}
                          label="Copy Hashtags"
                          variant="secondary"
                          onCopied={() => onNotify(`Copied ${item.hashtags.length} hashtags`)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedTipsId(tipsOpen ? null : item.id)}
                        className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        {tipsOpen ? 'Hide platform notes' : 'Pinterest & YouTube notes'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
