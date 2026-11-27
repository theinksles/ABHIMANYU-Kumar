import { useState } from 'react';
import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import {
  TOPIC_CATEGORIES,
  type BuilderTopicOption,
  type SavedCollectionItem,
  type TopicCategory,
} from '../data/libraryData';
import { CopyButton } from './CopyButton';

interface TopicCategoriesSectionProps {
  savedIds: Set<string>;
  onToggleSave: (item: Omit<SavedCollectionItem, 'createdAt'>) => void;
  onSelectTopicForBuilder: (topic: BuilderTopicOption) => void;
  onNotify: (message: string) => void;
}

export function TopicCategoriesSection({
  savedIds,
  onToggleSave,
  onSelectTopicForBuilder,
  onNotify,
}: TopicCategoriesSectionProps) {
  const [activeTopicId, setActiveTopicId] = useState<string>(TOPIC_CATEGORIES[0].id);

  const selectedTopic: TopicCategory =
    TOPIC_CATEGORIES.find((t) => t.id === activeTopicId) || TOPIC_CATEGORIES[0];

  const handleSaveSample = (platformLabel: string, captionText: string) => {
    const id = `topic-${selectedTopic.id}-${platformLabel.toLowerCase()}`;
    onToggleSave({
      id,
      title: `${selectedTopic.topic} (${platformLabel})`,
      topic: selectedTopic.topic,
      platformNote: `${platformLabel} · ${selectedTopic.captionStyle}`,
      caption: captionText,
      hashtags: selectedTopic.hashtags,
    });
  };

  return (
    <section id="categories" className="py-16 md:py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-blue-700 mb-2">
            Topic-wise caption categories
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance">
            Ten Editorial Voices Matched to Every Content Pillar
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            Select any topic row to inspect platform-tailored captions for Instagram, Pinterest, and YouTube along with matching hashtags.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Clean Topic & Style Table */}
          <div className="lg:col-span-5 border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600">
                    Topic
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600">
                    Caption style
                  </th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-600 text-right">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TOPIC_CATEGORIES.map((row) => {
                  const isActive = row.id === selectedTopic.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setActiveTopicId(row.id)}
                      className={`transition-colors cursor-pointer ${
                        isActive ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-sm font-medium text-slate-900">
                        <button
                          type="button"
                          onClick={() => setActiveTopicId(row.id)}
                          className="text-left w-full flex items-center justify-between gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
                        >
                          <span className={isActive ? 'text-blue-700 font-semibold' : ''}>
                            {row.topic}
                          </span>
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-600">
                        {row.captionStyle}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-mono-tabular text-right">
                        {row.hashtags.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right: Selected Topic Studio Inspector */}
          <div className="lg:col-span-7 border border-slate-200 rounded-xl p-6 md:p-8 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <span>{selectedTopic.captionStyle}</span>
                  <span aria-hidden="true">·</span>
                  <span>Instagram / Pinterest / YouTube</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  {selectedTopic.topic} Caption &amp; Hashtag Kit
                </h3>
              </div>

              <button
                type="button"
                onClick={() => onSelectTopicForBuilder(selectedTopic.builderTopicMatch)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Build {selectedTopic.topic} Page</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Platform Captions */}
            <div className="divide-y divide-slate-200">
              {selectedTopic.sampleCaptions.map((sample) => {
                const saveKey = `topic-${selectedTopic.id}-${sample.platform.toLowerCase()}`;
                const isSaved = savedIds.has(saveKey);
                return (
                  <div key={sample.platform} className="py-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-900">
                          {sample.platform}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{sample.format}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CopyButton
                          text={`${sample.text}\n\n${selectedTopic.hashtags.join(' ')}`}
                          label="Copy Post"
                          variant="ghost"
                          onCopied={() =>
                            onNotify(`Copied ${selectedTopic.topic} ${sample.platform} post`)
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSample(sample.platform, sample.text)}
                          aria-label={isSaved ? 'Remove saved caption' : 'Save caption'}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            isSaved
                              ? 'text-blue-700 bg-blue-50'
                              : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4" strokeWidth={1.75} />
                          ) : (
                            <Bookmark className="w-4 h-4" strokeWidth={1.75} />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-[15px] leading-relaxed text-slate-800">
                      &ldquo;{sample.text}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Shared Hashtag Block + Pinterest Keywords */}
            <div className="pt-5 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="text-xs font-medium text-slate-600">
                  Curated {selectedTopic.topic} Hashtag Set
                </span>
                <CopyButton
                  text={selectedTopic.hashtags.join(' ')}
                  label="Copy All Hashtags"
                  variant="secondary"
                  onCopied={() =>
                    onNotify(`Copied ${selectedTopic.topic} hashtag set`)
                  }
                />
              </div>
              <p className="font-mono text-[13px] leading-relaxed text-slate-700 bg-white border border-slate-200 rounded-lg p-3.5">
                {selectedTopic.hashtags.join(' ')}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Search keywords:</span>
                <span>{selectedTopic.keywords.join(' · ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
