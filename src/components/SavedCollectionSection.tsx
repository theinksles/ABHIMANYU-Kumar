import { useState, type FormEvent } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import type { SavedCollectionItem } from '../data/libraryData';
import { CopyButton } from './CopyButton';

interface SavedCollectionSectionProps {
  savedItems: SavedCollectionItem[];
  onAddCustom: (item: Omit<SavedCollectionItem, 'id' | 'createdAt'>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onNotify: (message: string) => void;
}

export function SavedCollectionSection({
  savedItems,
  onAddCustom,
  onRemoveItem,
  onClearAll,
  onNotify,
}: SavedCollectionSectionProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Aesthetic');
  const [platformNote, setPlatformNote] = useState('Instagram · Pinterest');
  const [caption, setCaption] = useState('');
  const [hashtagsRaw, setHashtagsRaw] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedCaption = caption.trim();
    if (!trimmedCaption) return;

    const parsedHashtags = hashtagsRaw
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    onAddCustom({
      title: title.trim() || `${topic} Custom Note`,
      topic: topic.trim() || 'Custom',
      platformNote: platformNote.trim() || 'All platforms',
      caption: trimmedCaption,
      hashtags:
        parsedHashtags.length > 0
          ? parsedHashtags
          : ['#TheInkAndIsles', '#CreativeStudio'],
    });

    setTitle('');
    setCaption('');
    setHashtagsRaw('');
    setComposerOpen(false);
  };

  const allSavedText = savedItems
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.title} (${item.platformNote})\n"${item.caption}"\n${item.hashtags.join(' ')}`
    )
    .join('\n\n---\n\n');

  const handleDownloadSaved = () => {
    const blob = new Blob([allSavedText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'the-ink-and-isles-saved-sets.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify('Downloaded your saved caption sheet');
  };

  return (
    <section id="saved" className="py-16 md:py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-blue-700 mb-2">
              Personal workspace
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Saved Sets &amp; Custom Scratchpad
            </h2>
            <p className="mt-2.5 text-base text-slate-600 max-w-2xl">
              Bookmark any caption from the library or write your own custom post pairings here. Everything stays saved in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setComposerOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{composerOpen ? 'Close Composer' : 'Add Custom Set'}</span>
            </button>

            {savedItems.length > 0 && (
              <>
                <CopyButton
                  text={allSavedText}
                  label="Copy All Saved"
                  variant="secondary"
                  onCopied={() => onNotify(`Copied ${savedItems.length} saved sets`)}
                />
                <button
                  type="button"
                  onClick={handleDownloadSaved}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Export .TXT</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Custom Composer Form */}
        {composerOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-7 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                Compose a Custom Caption &amp; Hashtag Set
              </h3>
              <span className="text-xs text-slate-500">Saved locally</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="custom-title"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Set Title
                </label>
                <input
                  id="custom-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Coastal Studio"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-topic"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Topic
                </label>
                <input
                  id="custom-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Aesthetic, Travel, Business..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                />
              </div>

              <div>
                <label
                  htmlFor="custom-platform"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Target Platforms
                </label>
                <input
                  id="custom-platform"
                  type="text"
                  value={platformNote}
                  onChange={(e) => setPlatformNote(e.target.value)}
                  placeholder="Instagram · Pinterest"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="custom-caption"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Caption
              </label>
              <textarea
                id="custom-caption"
                required
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here..."
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label
                htmlFor="custom-hashtags"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Hashtags (space or comma separated)
              </label>
              <input
                id="custom-hashtags"
                type="text"
                value={hashtagsRaw}
                onChange={(e) => setHashtagsRaw(e.target.value)}
                placeholder="#AestheticDesign #CreativeStudio #MinimalAesthetic"
                className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                Save to Collection
              </button>
            </div>
          </form>
        )}

        {/* Saved List */}
        {savedItems.length === 0 ? (
          <div className="border border-slate-200 rounded-xl p-10 text-center bg-slate-50/50">
            <p className="font-display text-lg font-medium text-slate-900">
              Your saved collection is empty
            </p>
            <p className="text-sm text-slate-500 mt-1.5 mb-5 max-w-md mx-auto">
              Bookmark any ready-to-use set, topic caption, or calendar day above—or add your own custom caption set.
            </p>
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write First Custom Set</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <span>{item.topic}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.platformNote}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-slate-900">
                          {item.title}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-800 mt-3">
                      &ldquo;{item.caption}&rdquo;
                    </p>

                    <p className="mt-3 font-mono text-xs leading-relaxed text-slate-600">
                      {item.hashtags.join(' ')}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">{item.createdAt}</span>
                    <CopyButton
                      text={`${item.caption}\n\n${item.hashtags.join(' ')}`}
                      label="Copy Set"
                      variant="secondary"
                      onCopied={() => onNotify(`Copied "${item.title}"`)}
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-medium text-slate-500 hover:text-red-700 transition-colors cursor-pointer"
              >
                Clear all saved sets
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
