import type {
  BuilderTopicOption,
  CaptionStyleOption,
  DurationOption,
  PlatformOption,
} from '../data/libraryData';

export interface GeneratedHashtagGroup {
  platform: 'Instagram' | 'Pinterest' | 'YouTube';
  strategyNote: string;
  clusters: {
    label: string;
    tags: string[];
  }[];
}

export interface CalendarDayEntry {
  day: number;
  week: number;
  platform: 'Instagram' | 'Pinterest' | 'YouTube';
  format: string;
  topicFocus: string;
  hookTitle: string;
  caption: string;
  hashtags: string[];
}

export interface GeneratedHashtagPage {
  config: {
    platforms: PlatformOption;
    topic: BuilderTopicOption;
    duration: DurationOption;
    style: CaptionStyleOption;
  };
  generatedAt: string;
  summary: {
    totalDays: number;
    activePlatforms: ('Instagram' | 'Pinterest' | 'YouTube')[];
    totalUniqueHashtags: number;
    recommendedCadence: string;
  };
  hashtagVault: GeneratedHashtagGroup[];
  calendar: CalendarDayEntry[];
}

function resolvePlatforms(choice: PlatformOption): ('Instagram' | 'Pinterest' | 'YouTube')[] {
  switch (choice) {
    case 'Instagram':
      return ['Instagram'];
    case 'Pinterest':
      return ['Pinterest'];
    case 'YouTube':
      return ['YouTube'];
    case 'Instagram + Pinterest':
      return ['Instagram', 'Pinterest'];
    case 'All platforms':
      return ['Instagram', 'Pinterest', 'YouTube'];
  }
}

interface TopicBank {
  focuses: string[];
  igBroad: string[];
  igNiche: string[];
  igBrand: string[];
  pinKeywords: string[];
  pinTags: string[];
  ytTags: string[];
  captionsByStyle: Record<CaptionStyleOption, string[]>;
  hooks: string[];
}

const TOPIC_BANKS: Record<Exclude<BuilderTopicOption, 'Mixed topics'>, TopicBank> = {
  'Aesthetic designs': {
    focuses: [
      'Color Palette Study',
      'Typography Grid Breakdown',
      'Desk & Studio Flatlay',
      'Minimalist Layout Detail',
      'Sketch-to-Screen Process',
      'Texture & Paper Moodboard',
    ],
    igBroad: ['#AestheticDesign', '#DesignInspiration', '#CreativeDesign', '#GraphicDesign', '#DigitalArt'],
    igNiche: ['#InstaAesthetic', '#CreativeIdeas', '#MinimalDesign', '#ModernAesthetic', '#EditorialLayout'],
    igBrand: ['#TheInkAndIsles', '#StudioJournal', '#CraftedDetails', '#CleanDesign', '#VisualHarmony'],
    pinKeywords: ['#AestheticDesignBoard', '#MinimalistGraphics', '#ColorPaletteInspo', '#EditorialTypography', '#CreativeStudioMood'],
    pinTags: ['#DesignMoodboard', '#GraphicDesignIdeas', '#CleanAesthetic', '#VisualInspiration', '#LayoutDesign'],
    ytTags: ['#DesignProcess', '#GraphicDesignShorts', '#CreativeStudio', '#MinimalistDesign', '#ArtTimelapse'],
    captionsByStyle: {
      'Viral & trendy': [
        'Wait until you see how one grid tweak transforms the entire layout. Save this palette for your next project.',
        'POV: you finally stopped overcomplicating your design and let whitespace do the heavy lifting.',
        'Three micro-details designers notice immediately—and how to build them into your feed today.',
        'Bookmark this color pairing before your next creative sprint. Clean, balanced, and effortless.',
        'From blank canvas to finished study in four intentional steps. Which frame is your favorite?',
        'The secret to scroll-stopping visuals is almost always restraint. Look closely at the spacing.',
      ],
      Professional: [
        'Strong visual hierarchy starts before the first color swatch. Here is how we anchor negative space for clarity.',
        'Consistency across typography and texture builds recognizable brand equity over time. Study notes from the desk.',
        'Refining layout proportions: pairing high-contrast serif headlines with calm geometric body copy.',
        'Creative direction in practice—balancing tactile paper warmth with crisp digital alignment.',
        'A closer look at our design workflow from initial thumbnail sketches to final export specifications.',
        'Less clutter, clearer message. Intentional spacing elevates both editorial and commercial deliverables.',
      ],
      'Cute & aesthetic': [
        'Creativity lives in the little details. Turn simple ideas into something quiet and beautiful today.',
        'Soft daylight, cotton paper, and ink lines that feel like a slow morning at the studio.',
        'Less clutter, more creativity. Simple designs carry the most timeless kind of beauty.',
        'Collecting gentle textures, muted coastal tones, and tiny moments of studio calm.',
        'Little sketches and soft-focus color cards for days when you want your feed to feel like a deep breath.',
        'Made with patience, clean margins, and a cup of warm tea beside the sketchbook.',
      ],
    },
    hooks: [
      'Detail Study',
      'Palette Breakdown',
      'Before & After Grid',
      'Studio Flatlay',
      'Typography Note',
      'Sketchbook Page',
    ],
  },
  'Quotes & motivation': {
    focuses: [
      'Morning Mindset Prompt',
      'Creative Consistency Note',
      'Quiet Progress Reminder',
      'Founder Reflection',
      'Habit Architecture Quote',
      'Weekend Reset Thought',
    ],
    igBroad: ['#DailyMotivation', '#InspirationalQuotes', '#PositiveMindset', '#SelfGrowth', '#MindsetMatters'],
    igNiche: ['#MotivationDaily', '#SuccessMindset', '#CreativeDiscipline', '#IntentionalLiving', '#MorningWisdom'],
    igBrand: ['#InkAndReflections', '#WordsToKeep', '#QuietConfidence', '#SteadyProgress', '#JournalNotes'],
    pinKeywords: ['#MotivationalQuotesPin', '#DailyAffirmations', '#MindsetJournal', '#SelfImprovementIdeas', '#QuoteAesthetic'],
    pinTags: ['#InspiringWords', '#PositiveQuotes', '#GrowthMindset', '#MinimalistQuotes', '#LifeReminders'],
    ytTags: ['#DailyMindset', '#MotivationalShorts', '#HabitBuilding', '#SelfGrowthJourney', '#FocusTips'],
    captionsByStyle: {
      'Viral & trendy': [
        'Read this twice if you needed a sign to stop waiting for the perfect Monday. Start messy today.',
        'Nobody talks about how quiet consistency beats overnight hype every single time. Save this reminder.',
        'One small habit repeated daily will outgrow a burst of motivation every single month.',
        'Friendly check-in: protect your energy, finish the draft, and let your progress speak.',
        'Send this to someone who is building something meaningful behind the scenes right now.',
        'Your future self is already thanking you for the 20 minutes you showed up today.',
      ],
      Professional: [
        'Small steps every day create compounding outcomes. Discipline in the routine unlocks freedom in the craft.',
        'Clarity precedes momentum. Define the single priority that moves the needle before opening your inbox.',
        'Long-term creative resilience is built through sustainable pacing, deliberate practice, and clear boundaries.',
        'Treat every project as a craft study rather than a sprint; quality compounds faster than volume.',
        'Progress rarely looks dramatic in a single week, yet transforms an entire quarter when measured consistently.',
        'Focus is a strategic asset. Guard your deep work hours with the same rigor as client milestones.',
      ],
      'Cute & aesthetic': [
        'Small steps every day create big changes. Believe in your journey and honor your own pace.',
        'Gentle reminder: you do not have to bloom all at once—quiet roots matter just as much.',
        'Keep a soft heart and a steady notebook. Good things take time to unfold.',
        'Breathe in calm, breathe out comparison. Today only asks for one kind, honest step forward.',
        'Notes tucked into the margin for slower mornings and hopeful beginnings.',
        'Celebrate the tiny wins too—they are the stitches holding your whole season together.',
      ],
    },
    hooks: [
      'Daily Anchor',
      'Desk Margin Note',
      'Mindset Shift',
      'Morning Mantra',
      'Habit Cue',
      'Sunday Reflection',
    ],
  },
  'Fashion & beauty': {
    focuses: [
      'Capsule Linen Edit',
      'Golden Hour Glow Routine',
      'Monochrome Layering Formula',
      'Accessory & Texture Detail',
      'Day-to-Evening Transition',
      'Seasonal Wardrobe Notes',
    ],
    igBroad: ['#StyleInspiration', '#FashionAesthetic', '#BeautyRoutine', '#OutfitOfTheDay', '#CleanBeauty'],
    igNiche: ['#CapsuleWardrobe', '#MinimalistStyle', '#EffortlessChic', '#SkinFirst', '#ModernLookbook'],
    igBrand: ['#CoastalWardrobe', '#LinenAndLight', '#StyledSimple', '#CuratedCloset', '#EverydayElegance'],
    pinKeywords: ['#CapsuleWardrobeGuide', '#MinimalistOutfits', '#NaturalMakeupLook', '#LinenFashion', '#StyleBoard'],
    pinTags: ['#OutfitIdeas', '#TimelessFashion', '#BeautyInspo', '#ChicStyle', '#WardrobeEssentials'],
    ytTags: ['#CapsuleWardrobe', '#GRWMShorts', '#MinimalistFashion', '#StyleLookbook', '#CleanBeautyTips'],
    captionsByStyle: {
      'Viral & trendy': [
        'The 3-piece outfit formula I cannot stop wearing this month. Which pairing wins?',
        'POV: you traded trend-chasing for timeless silhouettes and getting dressed takes two minutes.',
        'Save this lookbook before your next packing list—four pieces, six effortless outfits.',
        'Dewy skin, crisp tailoring, and zero overthinking. Here is the exact step-by-step.',
        'Stop scrolling if your closet is full yet nothing feels cohesive—try this neutral anchor rule.',
        'That golden-hour glow starts with prep, not layers. Saving the breakdown right here.',
      ],
      Professional: [
        'Building a high-utility capsule wardrobe relies on breathable natural textiles and cohesive tonal balance.',
        'Fabric weight and proportion determine how an outfit holds its line from morning meetings through evening.',
        'A streamlined beauty routine centered on barrier hydration creates a reliably polished finish under daylight.',
        'Three tailoring details that elevate everyday separates into an intentional, camera-ready silhouette.',
        'Seasonal wardrobe edit: investing in versatile silhouettes with longevity across shifting climates.',
        'Minimalist styling is an exercise in editing—keep the focal texture clear and let accessories support.',
      ],
      'Cute & aesthetic': [
        'Sun-warmed linen, pearl clips, and a lip balm that smells like coastal summer.',
        'Dressing for soft mornings and breezy afternoons—light layers that move with the wind.',
        'A little shimmer, messy waves, and outfits that feel as comfortable as a favorite poem.',
        'Pocketful of seashells and a wardrobe painted in sea-salt white, sand, and sky blue.',
        'Sweet, simple details: ribbon ties, sheer glow, and silhouettes made for golden hour walks.',
        'Keeping beauty gentle and mornings unhurried—just sunscreen, soft blush, and sunlight.',
      ],
    },
    hooks: [
      '3-Way Styling',
      'Capsule Formula',
      'Morning Skin Edit',
      'Texture Close-Up',
      'Packing Lookbook',
      'Golden Hour Fit',
    ],
  },
  'Travel & nature': {
    focuses: [
      'Coastal Trail Panorama',
      'Golden Hour Tide Study',
      'Hidden Café & Bookshop Stop',
      'Packing Light Checklist',
      'Dawn Mist & Pines Frame',
      '48-Hour Island Itinerary',
    ],
    igBroad: ['#TravelInspiration', '#NatureLovers', '#Wanderlust', '#ExploreMore', '#NaturePhotography'],
    igNiche: ['#TravelAesthetic', '#BeachVibes', '#SummerAesthetic', '#OceanLover', '#SlowTravel'],
    igBrand: ['#CoastalFieldNotes', '#IslesAndTides', '#PostcardsFromAfar', '#WildShorelines', '#SaltAndCedar'],
    pinKeywords: ['#CoastalTravelGuide', '#ScenicTrails', '#NatureMoodboard', '#BeachGetawayIdeas', '#TravelItinerary'],
    pinTags: ['#WanderlustInspo', '#OceanPhotography', '#SlowTravelTips', '#NatureCalm', '#SummerTravel'],
    ytTags: ['#TravelVlog', '#CoastalHike', '#NatureShorts', '#SlowTravelDiary', '#ScenicExplore'],
    captionsByStyle: {
      'Viral & trendy': [
        'Skip the crowded boardwalk and take this coastal cliff path at 6:30 AM instead. Worth every step.',
        'Ocean breeze, golden skies, and the exact trail stop you will want pinned for summer.',
        'Three underrated coastal stops that feel like a postcard—save this before your next trip.',
        'POV: you left your notifications off and followed the tide line until sunset.',
        'Pack half as much, walk twice as slow. Here is what actually made it into my weekend bag.',
        'If your feed needed ten seconds of real ocean air today, stay right here.',
      ],
      Professional: [
        'Field notes from the coastline: timing morning light for crisp atmospheric depth and low-crowd trails.',
        'A structured 48-hour coastal itinerary balancing scenic ridge hikes with local harbor stops.',
        'Sustainable slow travel starts with supporting small regional makers and treading lightly on coastal paths.',
        'Camera and packing essentials for lightweight weekend exploration along unpredictable shorelines.',
        'Documenting natural textures and shifting coastal weather in a compact three-lens travel kit.',
        'Location scouting summary: elevation, trail access, and golden-hour window for landscape framing.',
      ],
      'Cute & aesthetic': [
        'Collect moments, explore places, and let nature inspire your soul.',
        'Ocean breeze, golden skies, and endless summer dreams tucked between the waves.',
        'Sea glass in my coat pocket, pine needles on the path, and mist rolling gently over the bay.',
        'Chasing quiet sunrises and writing postcards from little tables overlooking the harbor.',
        'Saltwater hair, warm sand, and the kind of peaceful silence only the shoreline knows.',
        'May your week hold fresh air, open trails, and a sky painted soft blue.',
      ],
    },
    hooks: [
      'Sunrise Trail',
      'Shoreline Postcard',
      'Hidden Spot Guide',
      'Tide & Light',
      'Pack-Light Edit',
      'Island Journal',
    ],
  },
};

function getCombinedBank(topic: BuilderTopicOption): TopicBank {
  if (topic !== 'Mixed topics') {
    return TOPIC_BANKS[topic];
  }

  const allKeys: Exclude<BuilderTopicOption, 'Mixed topics'>[] = [
    'Aesthetic designs',
    'Quotes & motivation',
    'Fashion & beauty',
    'Travel & nature',
  ];

  return {
    focuses: allKeys.flatMap((k) => TOPIC_BANKS[k].focuses.slice(0, 2)),
    igBroad: ['#AestheticDesign', '#DailyMotivation', '#TravelInspiration', '#StyleInspiration', '#CreativeStudio'],
    igNiche: ['#InstaAesthetic', '#BeachVibes', '#MinimalDesign', '#CapsuleWardrobe', '#NatureLovers'],
    igBrand: ['#TheInkAndIsles', '#CuratedContent', '#VisualStorytelling', '#SlowLiving', '#DesignAndTravel'],
    pinKeywords: ['#AestheticMoodboard', '#CoastalTravelGuide', '#MinimalistOutfits', '#QuoteTypography', '#CreativeIdeas'],
    pinTags: ['#DesignInspiration', '#TravelAesthetic', '#DailyQuotes', '#StyleNotes', '#ModernLiving'],
    ytTags: ['#CreativeStudio', '#SlowTravelDiary', '#DesignShorts', '#MindsetRoutine', '#AestheticVlog'],
    captionsByStyle: {
      'Viral & trendy': [
        ...TOPIC_BANKS['Aesthetic designs'].captionsByStyle['Viral & trendy'].slice(0, 2),
        ...TOPIC_BANKS['Travel & nature'].captionsByStyle['Viral & trendy'].slice(0, 2),
        ...TOPIC_BANKS['Quotes & motivation'].captionsByStyle['Viral & trendy'].slice(0, 1),
        ...TOPIC_BANKS['Fashion & beauty'].captionsByStyle['Viral & trendy'].slice(0, 1),
      ],
      Professional: [
        ...TOPIC_BANKS['Aesthetic designs'].captionsByStyle['Professional'].slice(0, 2),
        ...TOPIC_BANKS['Quotes & motivation'].captionsByStyle['Professional'].slice(0, 2),
        ...TOPIC_BANKS['Travel & nature'].captionsByStyle['Professional'].slice(0, 1),
        ...TOPIC_BANKS['Fashion & beauty'].captionsByStyle['Professional'].slice(0, 1),
      ],
      'Cute & aesthetic': [
        ...TOPIC_BANKS['Aesthetic designs'].captionsByStyle['Cute & aesthetic'].slice(0, 2),
        ...TOPIC_BANKS['Travel & nature'].captionsByStyle['Cute & aesthetic'].slice(0, 2),
        ...TOPIC_BANKS['Quotes & motivation'].captionsByStyle['Cute & aesthetic'].slice(0, 1),
        ...TOPIC_BANKS['Fashion & beauty'].captionsByStyle['Cute & aesthetic'].slice(0, 1),
      ],
    },
    hooks: [
      'Studio Detail',
      'Coastal Postcard',
      'Mindset Note',
      'Lookbook Edit',
      'Minimal Grid',
      'Trail Moment',
    ],
  };
}

const FORMATS_BY_PLATFORM: Record<'Instagram' | 'Pinterest' | 'YouTube', string[]> = {
  Instagram: ['Carousel', 'Reel', 'Photo Post', 'Story Sequence'],
  Pinterest: ['Idea Pin', 'Vertical 2:3 Pin', 'Moodboard Pin', 'Carousel Pin'],
  YouTube: ['YouTube Short', 'Studio Vlog', 'Process Timelapse', 'Community Post'],
};

const CADENCE_TEMPLATES: Record<DurationOption, string> = {
  7: '1-week sprint · Daily publishing rhythm to establish visual cohesion',
  30: '4-week editorial arc · Balanced discovery, saves, and community engagement',
  90: '12-week quarterly system · 3 content pillars rotating across evergreen and seasonal moments',
};

export function buildHashtagPage(
  platforms: PlatformOption,
  topic: BuilderTopicOption,
  duration: DurationOption,
  style: CaptionStyleOption
): GeneratedHashtagPage {
  const activePlatforms = resolvePlatforms(platforms);
  const bank = getCombinedBank(topic);

  const hashtagVault: GeneratedHashtagGroup[] = activePlatforms.map((platform) => {
    if (platform === 'Instagram') {
      return {
        platform: 'Instagram',
        strategyNote: 'Blend 3 broad discovery tags + 4 niche community tags + 2 branded/editorial tags per post.',
        clusters: [
          { label: 'Discovery & Reach', tags: bank.igBroad },
          { label: 'Niche Community', tags: bank.igNiche },
          { label: 'Editorial Signature', tags: bank.igBrand },
        ],
      };
    }
    if (platform === 'Pinterest') {
      return {
        platform: 'Pinterest',
        strategyNote: 'Pair searchable board descriptors with 4–5 clean topic tags in your pin notes.',
        clusters: [
          { label: 'Searchable Board Keywords', tags: bank.pinKeywords },
          { label: 'Curated Pin Tags', tags: bank.pinTags },
        ],
      };
    }
    return {
      platform: 'YouTube',
      strategyNote: 'Place 3–4 focused tags in the final line of your video or Shorts description.',
      clusters: [
        { label: 'Shorts & Video SEO Tags', tags: bank.ytTags },
        { label: 'Series & Niche Tags', tags: bank.igBrand.slice(0, 4) },
      ],
    };
  });

  const allUniqueTags = new Set<string>();
  hashtagVault.forEach((group) =>
    group.clusters.forEach((cluster) => cluster.tags.forEach((tag) => allUniqueTags.add(tag)))
  );

  const captions = bank.captionsByStyle[style];
  const calendar: CalendarDayEntry[] = [];

  const angleVariations = [
    'Morning light study',
    'Behind the scenes',
    'Quick checklist',
    'Reader favorite',
    'Weekend edition',
    'Minimalist frame',
    'Deep-dive note',
  ];

  for (let i = 0; i < duration; i++) {
    const day = i + 1;
    const week = Math.ceil(day / 7);
    const platform = activePlatforms[i % activePlatforms.length];
    const formatList = FORMATS_BY_PLATFORM[platform];
    const format = formatList[Math.floor(i / activePlatforms.length) % formatList.length];
    const topicFocus = bank.focuses[i % bank.focuses.length];
    const hookBase = bank.hooks[i % bank.hooks.length];
    const captionBase = captions[i % captions.length];

    // Add subtle rotation context for longer calendars (30/90 days) so rows remain distinct and actionable
    const cycleNumber = Math.floor(i / captions.length);
    const angle = angleVariations[i % angleVariations.length];
    const caption =
      cycleNumber === 0
        ? captionBase
        : `${captionBase} (${angle} · Series ${cycleNumber + 1})`;

    let dayTags: string[];
    if (platform === 'Instagram') {
      dayTags = [
        bank.igBroad[i % bank.igBroad.length],
        bank.igBroad[(i + 1) % bank.igBroad.length],
        bank.igNiche[i % bank.igNiche.length],
        bank.igNiche[(i + 2) % bank.igNiche.length],
        bank.igBrand[i % bank.igBrand.length],
        bank.igBrand[(i + 1) % bank.igBrand.length],
      ];
    } else if (platform === 'Pinterest') {
      dayTags = [
        bank.pinKeywords[i % bank.pinKeywords.length],
        bank.pinKeywords[(i + 1) % bank.pinKeywords.length],
        bank.pinTags[i % bank.pinTags.length],
        bank.pinTags[(i + 2) % bank.pinTags.length],
      ];
    } else {
      dayTags = [
        bank.ytTags[i % bank.ytTags.length],
        bank.ytTags[(i + 1) % bank.ytTags.length],
        bank.ytTags[(i + 2) % bank.ytTags.length],
        bank.igBrand[i % bank.igBrand.length],
      ];
    }

    calendar.push({
      day,
      week,
      platform,
      format,
      topicFocus,
      hookTitle: `${hookBase}: ${topicFocus}`,
      caption,
      hashtags: Array.from(new Set(dayTags)),
    });
  }

  return {
    config: {
      platforms,
      topic,
      duration,
      style,
    },
    generatedAt: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    summary: {
      totalDays: duration,
      activePlatforms,
      totalUniqueHashtags: allUniqueTags.size,
      recommendedCadence: CADENCE_TEMPLATES[duration],
    },
    hashtagVault,
    calendar,
  };
}

export function formatPageAsMarkdown(page: GeneratedHashtagPage): string {
  const lines: string[] = [];
  lines.push(`# The Ink & Isles — Custom Hashtag Page`);
  lines.push(
    `Platforms: ${page.config.platforms} | Topic: ${page.config.topic} | Duration: ${page.config.duration} Days | Style: ${page.config.style}`
  );
  lines.push('');
  lines.push(`## Platform Hashtag Vault`);
  page.hashtagVault.forEach((group) => {
    lines.push(`### ${group.platform}`);
    lines.push(group.strategyNote);
    group.clusters.forEach((c) => {
      lines.push(`- ${c.label}: ${c.tags.join(' ')}`);
    });
    lines.push('');
  });
  lines.push(`## ${page.config.duration}-Day Content Calendar`);
  page.calendar.forEach((entry) => {
    lines.push(
      `Day ${String(entry.day).padStart(2, '0')} (${entry.platform} · ${entry.format} · ${entry.topicFocus})`
    );
    lines.push(`Caption: "${entry.caption}"`);
    lines.push(`Hashtags: ${entry.hashtags.join(' ')}`);
    lines.push('');
  });
  return lines.join('\n');
}

export function formatCalendarAsCsv(page: GeneratedHashtagPage): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const header = ['Day', 'Week', 'Platform', 'Format', 'Topic Focus', 'Caption', 'Hashtags'].join(',');
  const rows = page.calendar.map((entry) =>
    [
      entry.day,
      entry.week,
      escape(entry.platform),
      escape(entry.format),
      escape(entry.topicFocus),
      escape(entry.caption),
      escape(entry.hashtags.join(' ')),
    ].join(',')
  );
  return [header, ...rows].join('\n');
}
