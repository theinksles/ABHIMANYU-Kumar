import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { EditorialImage } from './components/EditorialImage';
import { HashtagPageBuilder } from './components/HashtagPageBuilder';
import { ReadyToUseLibrary } from './components/ReadyToUseLibrary';
import { SavedCollectionSection } from './components/SavedCollectionSection';
import { TopicCategoriesSection } from './components/TopicCategoriesSection';
import {
  HERO_IMAGE,
  type BuilderTopicOption,
  type SavedCollectionItem,
} from './data/libraryData';

const SAVED_STORAGE_KEY = 'ink-isles-saved-sets-v1';

export default function App() {
  const [savedItems, setSavedItems] = useState<SavedCollectionItem[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [builderTopicTrigger, setBuilderTopicTrigger] =
    useState<BuilderTopicOption | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
    } catch {
      // Ignore storage errors
    }
  }, [savedItems]);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const savedIds = useMemo(
    () => new Set(savedItems.map((item) => item.id)),
    [savedItems]
  );

  const handleToggleSave = (item: Omit<SavedCollectionItem, 'createdAt'>) => {
    setSavedItems((prev) => {
      const exists = prev.some((existing) => existing.id === item.id);
      if (exists) {
        showToast(`Removed "${item.title}" from saved sets`);
        return prev.filter((existing) => existing.id !== item.id);
      }
      const createdAt = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      showToast(`Saved "${item.title}"`);
      return [{ ...item, createdAt }, ...prev];
    });
  };

  const handleAddCustom = (
    item: Omit<SavedCollectionItem, 'id' | 'createdAt'>
  ) => {
    const id = `custom-${Date.now()}`;
    const createdAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    setSavedItems((prev) => [{ ...item, id, createdAt }, ...prev]);
    showToast(`Added "${item.title}" to saved sets`);
  };

  const handleRemoveSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed saved set');
  };

  const handleClearSaved = () => {
    setSavedItems([]);
    showToast('Cleared all saved sets');
  };

  const handleSelectTopicForBuilder = (topic: BuilderTopicOption) => {
    setBuilderTopicTrigger(null);
    window.setTimeout(() => {
      setBuilderTopicTrigger(topic);
      const el = document.getElementById('builder');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="font-display text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            The Ink &amp; Isles
          </a>

          {/* Zone 2: 4 Single-line Nav Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#library"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Library
            </a>
            <a
              href="#categories"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Categories
            </a>
            <a
              href="#builder"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Page Builder
            </a>
            <a
              href="#saved"
              className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Saved Sets ({savedItems.length})
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('builder')}
              className="px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Create Hashtag Page
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Section — 2-Column Editorial Split */}
        <section className="bg-white pt-12 pb-14 md:pt-16 md:pb-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Typographic Hierarchy */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-4">
                  <span className="text-blue-700">Hashtag &amp; Caption Library</span>
                  <span aria-hidden="true">·</span>
                  <span>Instagram</span>
                  <span aria-hidden="true">·</span>
                  <span>Pinterest</span>
                  <span aria-hidden="true">·</span>
                  <span>YouTube</span>
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[52px] font-semibold tracking-tight leading-[1.08] text-slate-900 text-balance">
                  The Ink &amp; Isles Caption &amp; Hashtag Collection
                </h1>

                <p className="mt-5 text-base md:text-lg leading-relaxed text-slate-600 max-w-xl">
                  Ready-to-use captions, viral hashtag clusters, and an interactive content calendar studio crafted for creative brands, coastal storytellers, and visual designers.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => scrollToSection('builder')}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Build your hashtag page</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('library')}
                    className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Browse ready-to-use sets</span>
                    <ArrowDown className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* Right Column: Matching-Height Studio Visual */}
              <div className="lg:col-span-6">
                <figure className="h-full flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <div className="flex-1 min-h-[280px] aspect-[4/3] lg:aspect-auto">
                    <EditorialImage
                      src={HERO_IMAGE.src}
                      alt={HERO_IMAGE.alt}
                      title="The Ink & Isles Studio"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between gap-4">
                    <span>{HERO_IMAGE.caption}</span>
                    <span className="font-mono-tabular text-slate-400">Vol. 01</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* Full-Width 4-Column Summary Strip Below Hero Split */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div>
                <p className="font-display text-2xl md:text-3xl font-semibold text-slate-900 tabular-nums">
                  05
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Ready-to-use caption &amp; hashtag packs
                </p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-semibold text-slate-900 tabular-nums">
                  10
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Topic-wise editorial caption voices
                </p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-semibold text-slate-900 tabular-nums">
                  03
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Tailored platforms: IG, Pinterest &amp; YT
                </p>
              </div>
              <div>
                <p className="font-display text-2xl md:text-3xl font-semibold text-slate-900 tabular-nums">
                  90 Days
                </p>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Exportable content calendar sprints
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Ready-to-Use Content Library */}
        <ReadyToUseLibrary
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onNotify={showToast}
        />

        {/* Section 2: Topic-Wise Caption Categories */}
        <TopicCategoriesSection
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onSelectTopicForBuilder={handleSelectTopicForBuilder}
          onNotify={showToast}
        />

        {/* Section 3: Interactive Hashtag Page & Calendar Builder */}
        <HashtagPageBuilder
          externalTopic={builderTopicTrigger}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onNotify={showToast}
        />

        {/* Section 4: Saved Sets & Custom Composer */}
        <SavedCollectionSection
          savedItems={savedItems}
          onAddCustom={handleAddCustom}
          onRemoveItem={handleRemoveSaved}
          onClearAll={handleClearSaved}
          onNotify={showToast}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-semibold text-slate-900">
              The Ink &amp; Isles
            </span>
            <span aria-hidden="true">·</span>
            <span>Social Media Caption &amp; Hashtag Collection</span>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#library" className="hover:text-slate-900 transition-colors">
              Ready-to-Use Library
            </a>
            <a href="#categories" className="hover:text-slate-900 transition-colors">
              Topic Categories
            </a>
            <a href="#builder" className="hover:text-slate-900 transition-colors">
              Page Builder
            </a>
            <a href="#saved" className="hover:text-slate-900 transition-colors">
              Saved Sets
            </a>
          </div>
        </div>
      </footer>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
