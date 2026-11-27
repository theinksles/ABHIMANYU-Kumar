import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Check,
  CheckSquare,
  Download,
  Pencil,
  RotateCcw,
  Square,
} from 'lucide-react';
import type {
  BuilderTopicOption,
  CaptionStyleOption,
  DurationOption,
  PlatformOption,
  SavedCollectionItem,
} from '../data/libraryData';
import {
  buildHashtagPage,
  formatCalendarAsCsv,
  formatPageAsMarkdown,
  type CalendarDayEntry,
  type GeneratedHashtagPage,
} from '../utils/pageBuilder';
import { CopyButton } from './CopyButton';

const PLATFORM_OPTIONS: PlatformOption[] = [
  'Instagram',
  'Pinterest',
  'YouTube',
  'Instagram + Pinterest',
  'All platforms',
];

const TOPIC_OPTIONS: BuilderTopicOption[] = [
  'Aesthetic designs',
  'Quotes & motivation',
  'Fashion & beauty',
  'Travel & nature',
  'Mixed topics',
];

const DURATION_OPTIONS: { value: DurationOption; label: string }[] = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
];

const STYLE_OPTIONS: CaptionStyleOption[] = [
  'Viral & trendy',
  'Professional',
  'Cute & aesthetic',
];

interface HashtagPageBuilderProps {
  externalTopic: BuilderTopicOption | null;
  savedIds: Set<string>;
  onToggleSave: (item: Omit<SavedCollectionItem, 'createdAt'>) => void;
  onNotify: (message: string) => void;
}

const SCHEDULED_STORAGE_KEY = 'ink-isles-scheduled-days-v1';

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function HashtagPageBuilder({
  externalTopic,
  savedIds,
  onToggleSave,
  onNotify,
}: HashtagPageBuilderProps) {
  const [platforms, setPlatforms] = useState<PlatformOption>('All platforms');
  const [topic, setTopic] = useState<BuilderTopicOption>('Aesthetic designs');
  const [duration, setDuration] = useState<DurationOption>(30);
  const [style, setStyle] = useState<CaptionStyleOption>('Cute & aesthetic');

  const [generatedPage, setGeneratedPage] = useState<GeneratedHashtagPage>(() =>
    buildHashtagPage('All platforms', 'Aesthetic designs', 30, 'Cute & aesthetic')
  );

  const [platformFilter, setPlatformFilter] = useState<'All' | 'Instagram' | 'Pinterest' | 'YouTube'>('All');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>(1);
  const [scheduledDays, setScheduledDays] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(SCHEDULED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [customCaptions, setCustomCaptions] = useState<Record<number, string>>({});

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SCHEDULED_STORAGE_KEY, JSON.stringify(scheduledDays));
    } catch {
      // Ignore storage quota errors
    }
  }, [scheduledDays]);

  useEffect(() => {
    if (externalTopic) {
      setTopic(externalTopic);
      const next = buildHashtagPage(platforms, externalTopic, duration, style);
      setGeneratedPage(next);
      setPlatformFilter('All');
      setSelectedWeek(duration === 7 ? 'all' : 1);
      setCustomCaptions({});
      setEditingDay(null);
      onNotify(`Loaded "${externalTopic}" into your hashtag page`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalTopic]);

  const handleCreatePage = () => {
    const next = buildHashtagPage(platforms, topic, duration, style);
    setGeneratedPage(next);
    setPlatformFilter('All');
    setSelectedWeek(duration === 7 ? 'all' : 1);
    setCustomCaptions({});
    setEditingDay(null);
    onNotify(`Created ${duration}-day ${topic} hashtag page`);
    window.setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleResetBuilder = () => {
    setPlatforms('All platforms');
    setTopic('Aesthetic designs');
    setDuration(30);
    setStyle('Cute & aesthetic');
    setGeneratedPage(buildHashtagPage('All platforms', 'Aesthetic designs', 30, 'Cute & aesthetic'));
    setPlatformFilter('All');
    setSelectedWeek(1);
    setCustomCaptions({});
    setEditingDay(null);
    onNotify('Reset builder to default studio settings');
  };

  const pageSignature = `${generatedPage.config.platforms}|${generatedPage.config.topic}|${generatedPage.config.duration}|${generatedPage.config.style}`;

  const totalWeeks = Math.ceil(generatedPage.calendar.length / 7);

  const visibleEntries = useMemo(() => {
    return generatedPage.calendar.filter((entry) => {
      const matchesPlatform =
        platformFilter === 'All' || entry.platform === platformFilter;
      const matchesWeek = selectedWeek === 'all' || entry.week === selectedWeek;
      return matchesPlatform && matchesWeek;
    });
  }, [generatedPage.calendar, platformFilter, selectedWeek]);

  const scheduledCount = useMemo(() => {
    return generatedPage.calendar.filter(
      (entry) => scheduledDays[`${pageSignature}:${entry.day}`]
    ).length;
  }, [generatedPage.calendar, pageSignature, scheduledDays]);

  const toggleScheduled = (day: number) => {
    const key = `${pageSignature}:${day}`;
    setScheduledDays((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getEffectiveCaption = (entry: CalendarDayEntry) =>
    customCaptions[entry.day] ?? entry.caption;

  const startEditing = (entry: CalendarDayEntry) => {
    setEditingDay(entry.day);
    setEditDraft(getEffectiveCaption(entry));
  };

  const saveEdit = (day: number) => {
    const trimmed = editDraft.trim();
    if (trimmed) {
      setCustomCaptions((prev) => ({ ...prev, [day]: trimmed }));
      onNotify(`Updated Day ${String(day).padStart(2, '0')} caption`);
    }
    setEditingDay(null);
  };

  const mergedPageForExport: GeneratedHashtagPage = useMemo(() => {
    return {
      ...generatedPage,
      calendar: generatedPage.calendar.map((entry) => ({
        ...entry,
        caption: customCaptions[entry.day] ?? entry.caption,
      })),
    };
  }, [generatedPage, customCaptions]);

  return (
    <section id="builder" className="py-16 md:py-20 border-t border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Builder Header */}
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-blue-700 mb-2">
            Interactive page &amp; calendar studio
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 text-balance">
            Let&rsquo;s build your complete hashtag page
          </h2>
          <p className="mt-2.5 text-base text-slate-600">
            Choose your target platforms, primary topic, calendar length, and caption voice to generate a ready-to-publish hashtag vault and day-by-day posting schedule.
          </p>
        </div>

        {/* Configurator Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Which platforms? */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                1. Which platforms?
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((option) => {
                  const active = platforms === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPlatforms(option)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Your main content topic */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                2. Your main content topic
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPIC_OPTIONS.map((option) => {
                  const active = topic === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTopic(option)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Content calendar duration */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                3. Content calendar duration
              </label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((option) => {
                  const active = duration === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setDuration(option.value)}
                      aria-pressed={active}
                      className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Caption style */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                4. Caption style
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((option) => {
                  const active = style === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStyle(option)}
                      aria-pressed={active}
                      className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Selected setup:{' '}
              <span className="font-medium text-slate-800">
                {platforms} · {topic} · {duration} days · {style}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetBuilder}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleCreatePage}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
                <span>Create my hashtag page</span>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Output Sheet */}
        <div
          ref={outputRef}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden scroll-mt-24"
        >
          {/* Output Header */}
          <div className="p-6 md:p-8 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{generatedPage.config.platforms}</span>
                <span aria-hidden="true">·</span>
                <span>{generatedPage.config.topic}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  {generatedPage.config.duration} days
                </span>
                <span aria-hidden="true">·</span>
                <span>{generatedPage.config.style}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                Your Custom Hashtag Page &amp; {generatedPage.config.duration}-Day Schedule
              </h3>
              <p className="mt-1.5 text-sm text-slate-600">
                {generatedPage.summary.recommendedCadence}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <CopyButton
                text={formatPageAsMarkdown(mergedPageForExport)}
                label="Copy Full Page"
                variant="primary"
                onCopied={() => onNotify('Copied complete hashtag page to clipboard')}
              />
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(
                    `ink-and-isles-${generatedPage.config.duration}-day-calendar.csv`,
                    formatCalendarAsCsv(mergedPageForExport),
                    'text/csv;charset=utf-8;'
                  );
                  onNotify('Downloaded CSV content calendar');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Download CSV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(
                    `ink-and-isles-hashtag-page.md`,
                    formatPageAsMarkdown(mergedPageForExport),
                    'text/markdown;charset=utf-8;'
                  );
                  onNotify('Downloaded Markdown hashtag sheet');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Download Sheet</span>
              </button>
            </div>
          </div>

          {/* Platform Hashtag Vault */}
          <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50/40">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
              <h4 className="font-display text-lg font-semibold text-slate-900">
                Platform Hashtag Vault
              </h4>
              <span className="text-xs text-slate-500 font-mono-tabular">
                {generatedPage.summary.totalUniqueHashtags} unique tags organized by role
              </span>
            </div>

            <div
              className={`grid grid-cols-1 ${
                generatedPage.hashtagVault.length === 2
                  ? 'lg:grid-cols-2'
                  : generatedPage.hashtagVault.length >= 3
                  ? 'lg:grid-cols-3'
                  : ''
              } gap-6`}
            >
              {generatedPage.hashtagVault.map((group) => {
                const allGroupTags = group.clusters.flatMap((c) => c.tags).join(' ');
                return (
                  <div
                    key={group.platform}
                    className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h5 className="text-sm font-semibold text-slate-900">
                          {group.platform}
                        </h5>
                        <CopyButton
                          text={allGroupTags}
                          label="Copy All"
                          variant="ghost"
                          onCopied={() =>
                            onNotify(`Copied all ${group.platform} tags`)
                          }
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {group.strategyNote}
                      </p>

                      <div className="space-y-4 divide-y divide-slate-100">
                        {group.clusters.map((cluster) => (
                          <div key={cluster.label} className="pt-3 first:pt-0">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-xs font-medium text-slate-700">
                                {cluster.label}
                              </span>
                              <CopyButton
                                text={cluster.tags.join(' ')}
                                label="Copy"
                                variant="ghost"
                                className="text-[11px] px-2 py-1"
                                onCopied={() =>
                                  onNotify(`Copied ${cluster.label} tags`)
                                }
                              />
                            </div>
                            <p className="font-mono text-xs leading-relaxed text-slate-600">
                              {cluster.tags.join(' ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Calendar Section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="font-display text-lg font-semibold text-slate-900">
                  {generatedPage.config.duration}-Day Content Calendar
                </h4>
                <p className="text-xs text-slate-500 mt-1 font-mono-tabular">
                  {scheduledCount} / {generatedPage.calendar.length} posts marked scheduled
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Platform Filter */}
                {generatedPage.summary.activePlatforms.length > 1 && (
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['All', ...generatedPage.summary.activePlatforms] as const).map(
                      (plat) => (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => setPlatformFilter(plat)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                            platformFilter === plat
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {plat}
                        </button>
                      )
                    )}
                  </div>
                )}

                {/* Week Selector for 30 / 90 day calendars */}
                {totalWeeks > 1 && (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="week-select"
                      className="text-xs font-medium text-slate-600 whitespace-nowrap"
                    >
                      View:
                    </label>
                    <select
                      id="week-select"
                      value={selectedWeek}
                      onChange={(e) =>
                        setSelectedWeek(
                          e.target.value === 'all' ? 'all' : Number(e.target.value)
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue-700 cursor-pointer"
                    >
                      {Array.from({ length: totalWeeks }, (_, i) => i + 1).map(
                        (wk) => (
                          <option key={wk} value={wk}>
                            Week {wk} (Days {(wk - 1) * 7 + 1}–
                            {Math.min(wk * 7, generatedPage.calendar.length)})
                          </option>
                        )
                      )}
                      <option value="all">
                        All {generatedPage.calendar.length} Days
                      </option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Entries List */}
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {visibleEntries.map((entry) => {
                const dayKey = `${pageSignature}:${entry.day}`;
                const isScheduled = Boolean(scheduledDays[dayKey]);
                const effectiveCaption = getEffectiveCaption(entry);
                const saveKey = `cal-${generatedPage.config.topic}-${entry.day}`;
                const isSaved = savedIds.has(saveKey);
                const isEditing = editingDay === entry.day;

                return (
                  <div
                    key={entry.day}
                    className={`p-5 transition-colors ${
                      isScheduled ? 'bg-slate-50/70' : 'bg-white'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Day & Content */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleScheduled(entry.day)}
                          aria-label={
                            isScheduled
                              ? `Unmark Day ${entry.day} as scheduled`
                              : `Mark Day ${entry.day} as scheduled`
                          }
                          className={`mt-0.5 p-1 rounded transition-colors cursor-pointer shrink-0 ${
                            isScheduled
                              ? 'text-blue-700'
                              : 'text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {isScheduled ? (
                            <CheckSquare className="w-5 h-5" strokeWidth={1.75} />
                          ) : (
                            <Square className="w-5 h-5" strokeWidth={1.75} />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1.5">
                            <span className="font-mono-tabular font-semibold text-slate-900">
                              Day {String(entry.day).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-medium text-slate-700">
                              {entry.platform}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{entry.format}</span>
                            <span aria-hidden="true">·</span>
                            <span>{entry.topicFocus}</span>
                            {isScheduled && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-700 font-medium">
                                  Scheduled
                                </span>
                              </>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="mt-2 space-y-2.5">
                              <textarea
                                value={editDraft}
                                onChange={(e) => setEditDraft(e.target.value)}
                                rows={2}
                                className="w-full p-3 text-sm text-slate-900 bg-white border border-blue-700 rounded-lg focus:outline-none"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => saveEdit(entry.day)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-md cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Save Caption</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingDay(null)}
                                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p
                              className={`text-[15px] leading-relaxed ${
                                isScheduled ? 'text-slate-600' : 'text-slate-900'
                              }`}
                            >
                              &ldquo;{effectiveCaption}&rdquo;
                            </p>
                          )}

                          <p className="mt-2 font-mono text-xs text-slate-500 break-words">
                            {entry.hashtags.join(' ')}
                          </p>
                        </div>
                      </div>

                      {/* Row Actions */}
                      <div className="flex items-center gap-2 shrink-0 pl-9 lg:pl-0">
                        <CopyButton
                          text={`${effectiveCaption}\n\n${entry.hashtags.join(' ')}`}
                          label="Copy Post"
                          variant="secondary"
                          onCopied={() =>
                            onNotify(
                              `Copied Day ${String(entry.day).padStart(2, '0')} post`
                            )
                          }
                        />
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => startEditing(entry)}
                            aria-label={`Edit Day ${entry.day} caption`}
                            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            onToggleSave({
                              id: saveKey,
                              title: `Day ${String(entry.day).padStart(2, '0')} · ${entry.topicFocus}`,
                              topic: generatedPage.config.topic,
                              platformNote: `${entry.platform} · ${entry.format}`,
                              caption: effectiveCaption,
                              hashtags: entry.hashtags,
                            })
                          }
                          aria-label={isSaved ? 'Remove from saved sets' : 'Save to collection'}
                          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                            isSaved
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5" strokeWidth={1.75} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
