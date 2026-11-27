export type PlatformOption =
  | 'Instagram'
  | 'Pinterest'
  | 'YouTube'
  | 'Instagram + Pinterest'
  | 'All platforms';

export type BuilderTopicOption =
  | 'Aesthetic designs'
  | 'Quotes & motivation'
  | 'Fashion & beauty'
  | 'Travel & nature'
  | 'Mixed topics';

export type DurationOption = 7 | 30 | 90;

export type CaptionStyleOption =
  | 'Viral & trendy'
  | 'Professional'
  | 'Cute & aesthetic';

export interface ReadySet {
  id: string;
  index: string;
  title: string;
  category: 'Aesthetic & Design' | 'Beach & Summer' | 'Quotes & Motivation' | 'Travel & Nature';
  caption: string;
  hashtags: string[];
  platforms: ('Instagram' | 'Pinterest' | 'YouTube')[];
  bestFormat: string;
  imageUrl: string;
  imageAlt: string;
  pinterestTip: string;
  youtubeTip: string;
}

export interface TopicCategory {
  id: string;
  topic: string;
  captionStyle: string;
  builderTopicMatch: BuilderTopicOption;
  sampleCaptions: {
    platform: 'Instagram' | 'Pinterest' | 'YouTube';
    format: string;
    text: string;
  }[];
  hashtags: string[];
  keywords: string[];
}

export interface SavedCollectionItem {
  id: string;
  title: string;
  topic: string;
  platformNote: string;
  caption: string;
  hashtags: string[];
  createdAt: string;
}

export const HERO_IMAGE = {
  src: '/src/assets/images/hero_ink_isles_1795749288218.jpg',
  alt: 'Coastal studio flatlay of a cotton paper notebook, fountain pen, linen cloth, and sea glass in sunlit shadows',
  caption: 'Editorial Desk Study — Coastal Stationery & Caption Workbook',
};

export const READY_TO_USE_SETS: ReadySet[] = [
  {
    id: 'aesthetic-creative-designs',
    index: '01',
    title: 'Aesthetic & Creative Designs',
    category: 'Aesthetic & Design',
    caption: 'Creativity lives in the little details. ✨ Turn simple ideas into something beautiful.',
    hashtags: [
      '#AestheticDesign',
      '#CreativeDesign',
      '#DesignInspiration',
      '#DigitalArt',
      '#InstaAesthetic',
      '#CreativeIdeas',
      '#GraphicDesign',
    ],
    platforms: ['Instagram', 'Pinterest', 'YouTube'],
    bestFormat: 'Carousel & Idea Pin',
    imageUrl: '/src/assets/images/theme_aesthetic_design_1795749290020.jpg',
    imageAlt: 'Studio flatlay with color swatch cards, fine ink illustration pad, ceramic palette, and eucalyptus stem',
    pinterestTip: 'Pair with a vertical 2:3 process breakdown pin titled "Micro-Details That Elevate Minimalist Layouts".',
    youtubeTip: 'Use as a Shorts hook for 15-second sketchbook-to-vector timelapses.',
  },
  {
    id: 'beach-summer-vibes',
    index: '02',
    title: 'Beach & Summer Vibes',
    category: 'Beach & Summer',
    caption: 'Ocean breeze, golden skies and endless summer dreams. 🌊☀️',
    hashtags: [
      '#BeachVibes',
      '#SummerAesthetic',
      '#OceanLover',
      '#BeachDesign',
      '#TropicalVibes',
      '#SummerMood',
      '#RetroAesthetic',
    ],
    platforms: ['Instagram', 'Pinterest', 'YouTube'],
    bestFormat: 'Reel & Travel Pin',
    imageUrl: '/src/assets/images/theme_beach_summer_1795749289060.jpg',
    imageAlt: 'Turquoise ocean waves meeting pale sand at golden hour with sunlit sea foam',
    pinterestTip: 'Save to coastal moodboards with location keywords and warm summer color palette tags.',
    youtubeTip: 'Ideal for ambient coastal B-roll Shorts or golden-hour vlog intros.',
  },
  {
    id: 'quotes-motivation',
    index: '03',
    title: 'Quotes & Motivation',
    category: 'Quotes & Motivation',
    caption: 'Small steps every day create big changes. Believe in your journey. 💫',
    hashtags: [
      '#DailyMotivation',
      '#PositiveMindset',
      '#InspirationalQuotes',
      '#SuccessMindset',
      '#SelfGrowth',
      '#MotivationDaily',
    ],
    platforms: ['Instagram', 'Pinterest', 'YouTube'],
    bestFormat: 'Typography Post & Quote Pin',
    imageUrl: '/src/assets/images/hero_ink_isles_1795749288218.jpg',
    imageAlt: 'Handwritten coastal study notebook with fountain pen and brass ruler on marble desk',
    pinterestTip: 'Typography pins with 4:5 or 2:3 clean serif quotes drive high outbound saves.',
    youtubeTip: 'Pin as a community tab prompt or opening title card for habit-building videos.',
  },
  {
    id: 'minimal-modern-design',
    index: '04',
    title: 'Minimal & Modern Design',
    category: 'Aesthetic & Design',
    caption: 'Less clutter, more creativity. Simple designs, timeless beauty. 🤍',
    hashtags: [
      '#MinimalDesign',
      '#ModernAesthetic',
      '#CleanDesign',
      '#GraphicDesigner',
      '#DesignInspiration',
      '#CreativeStudio',
    ],
    platforms: ['Instagram', 'Pinterest', 'YouTube'],
    bestFormat: 'Portfolio Grid & Studio Short',
    imageUrl: '/src/assets/images/theme_minimal_modern_1795749289642.jpg',
    imageAlt: 'Minimalist plaster alcove with travertine bookends, ceramic vase, and geometric sunlight shadows',
    pinterestTip: 'Add architecture and interior minimalism board descriptors for evergreen discovery.',
    youtubeTip: 'Works well as a clean studio tour or desk setup description anchor.',
  },
  {
    id: 'travel-nature',
    index: '05',
    title: 'Travel & Nature',
    category: 'Travel & Nature',
    caption: 'Collect moments, explore places and let nature inspire your soul. 🌿',
    hashtags: [
      '#TravelInspiration',
      '#NatureLovers',
      '#Wanderlust',
      '#ExploreMore',
      '#NaturePhotography',
      '#TravelAesthetic',
    ],
    platforms: ['Instagram', 'Pinterest', 'YouTube'],
    bestFormat: 'Photo Dump & Trail Guide',
    imageUrl: '/src/assets/images/theme_travel_nature_1795749290747.jpg',
    imageAlt: 'Quiet coastal cliff trail lined with wild grasses overlooking misty sea at sunrise',
    pinterestTip: 'Include trail names, season, and packing checklist keywords in your pin summary.',
    youtubeTip: 'Pair with chapter timestamps in your travel vlog description for search reach.',
  },
];

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'aesthetic',
    topic: 'Aesthetic',
    captionStyle: 'Elegant & dreamy',
    builderTopicMatch: 'Aesthetic designs',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Carousel',
        text: 'Soft morning light, quiet corners, and textures that feel like a deep breath.',
      },
      {
        platform: 'Pinterest',
        format: 'Moodboard Pin',
        text: 'Curated neutral tones and soft-focus editorial details for calm creative spaces.',
      },
      {
        platform: 'YouTube',
        format: 'Shorts',
        text: 'Three quiet visual rituals that transform an ordinary morning into an aesthetic frame.',
      },
    ],
    hashtags: [
      '#AestheticVibes',
      '#DreamyAesthetic',
      '#SoftMinimalism',
      '#VisualPoetry',
      '#CuratedFeed',
      '#EditorialMood',
      '#QuietLuxury',
    ],
    keywords: ['minimalist moodboard', 'soft aesthetic', 'neutral color palette', 'slow living'],
  },
  {
    id: 'beach',
    topic: 'Beach',
    captionStyle: 'Relaxing & tropical',
    builderTopicMatch: 'Travel & nature',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Reel',
        text: 'Salt on the breeze, warm sand underfoot, and nowhere to rush until sunset.',
      },
      {
        platform: 'Pinterest',
        format: 'Idea Pin',
        text: 'Coastal escape packing notes, linen silhouettes, and sunlit shoreline frames.',
      },
      {
        platform: 'YouTube',
        format: 'Vlog',
        text: 'A slow afternoon by the tide: ambient waves, film frames, and golden hour light.',
      },
    ],
    hashtags: [
      '#BeachVibes',
      '#CoastalLiving',
      '#TropicalEscape',
      '#OceanBreeze',
      '#GoldenHourShore',
      '#IslandMood',
      '#SummerDiary',
    ],
    keywords: ['coastal getaway', 'beach aesthetic', 'summer shoreline', 'tropical escape'],
  },
  {
    id: 'fashion',
    topic: 'Fashion',
    captionStyle: 'Stylish & trendy',
    builderTopicMatch: 'Fashion & beauty',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Outfit Carousel',
        text: 'Tailored linen, effortless proportions, and accessories that carry the whole look.',
      },
      {
        platform: 'Pinterest',
        format: 'Lookbook Pin',
        text: 'Capsule wardrobe formulas for warm-weather layering and understated street style.',
      },
      {
        platform: 'YouTube',
        format: 'Shorts',
        text: 'One crisp silhouette styled three ways from studio morning to dinner by the coast.',
      },
    ],
    hashtags: [
      '#EffortlessStyle',
      '#CapsuleWardrobe',
      '#StreetStyleEdit',
      '#ModernWardrobe',
      '#OutfitInspiration',
      '#MinimalFashion',
      '#StyleNotes',
    ],
    keywords: ['capsule wardrobe', 'minimalist outfit', 'summer linen lookbook', 'clean style'],
  },
  {
    id: 'motivation',
    topic: 'Motivation',
    captionStyle: 'Inspiring',
    builderTopicMatch: 'Quotes & motivation',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Quote Card',
        text: 'Consistency outperforms intensity every single season. Keep showing up for the craft.',
      },
      {
        platform: 'Pinterest',
        format: 'Typography Pin',
        text: 'Daily reminder to protect your focus, honor your pace, and build things that last.',
      },
      {
        platform: 'YouTube',
        format: 'Community & Shorts',
        text: 'How twenty focused minutes every morning quietly reshapes an entire year of work.',
      },
    ],
    hashtags: [
      '#DailyMotivation',
      '#CreativeDiscipline',
      '#SelfGrowth',
      '#MindfulProgress',
      '#BuildInSilence',
      '#PositiveMindset',
      '#PurposeDriven',
    ],
    keywords: ['daily mindset', 'creative habits', 'encouraging quotes', 'goal clarity'],
  },
  {
    id: 'love',
    topic: 'Love',
    captionStyle: 'Emotional & romantic',
    builderTopicMatch: 'Mixed topics',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Photo Story',
        text: 'In the quiet moments between big milestones, the smallest gestures say everything.',
      },
      {
        platform: 'Pinterest',
        format: 'Editorial Quote Pin',
        text: 'Timeless notes on presence, shared mornings, and letters worth keeping.',
      },
      {
        platform: 'YouTube',
        format: 'Shorts',
        text: 'Little moments caught on 35mm film that feel like home every time you replay them.',
      },
    ],
    hashtags: [
      '#QuietRomance',
      '#LoveNotes',
      '#HeartfeltMoments',
      '#SharedMornings',
      '#RomanticAesthetic',
      '#WrittenWithLove',
      '#TimelessStories',
    ],
    keywords: ['romantic captions', 'heartfelt quotes', 'love letters', 'couple aesthetic'],
  },
  {
    id: 'nature',
    topic: 'Nature',
    captionStyle: 'Peaceful',
    builderTopicMatch: 'Travel & nature',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Single Frame',
        text: 'Morning mist over coastal pines—proof that stillness is its own kind of art.',
      },
      {
        platform: 'Pinterest',
        format: 'Landscape Pin',
        text: 'Serene botanical trails, wild meadow palettes, and quiet outdoor sanctuaries.',
      },
      {
        platform: 'YouTube',
        format: 'Ambient Short',
        text: 'Sixty seconds of wind through coastal grass and early tide—no rush, just breathe.',
      },
    ],
    hashtags: [
      '#NatureLovers',
      '#PeacefulMoments',
      '#IntoTheWild',
      '#EarthTones',
      '#BotanicalCalm',
      '#SlowNature',
      '#OutdoorDiary',
    ],
    keywords: ['nature calm', 'botanical photography', 'morning mist', 'earth palette'],
  },
  {
    id: 'business',
    topic: 'Business',
    captionStyle: 'Professional',
    builderTopicMatch: 'Mixed topics',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Insight Carousel',
        text: 'Clear positioning beats loud marketing. Three studio systems that saved us 8 hours a week.',
      },
      {
        platform: 'Pinterest',
        format: 'Infographic Pin',
        text: 'Brand strategy checklist for creative founders building memorable visual identities.',
      },
      {
        platform: 'YouTube',
        format: 'Tutorial',
        text: 'Behind our client workflow: how we structure briefs, timelines, and deliverables cleanly.',
      },
    ],
    hashtags: [
      '#CreativeStudio',
      '#BrandStrategy',
      '#FounderNotes',
      '#SmallBusinessTips',
      '#DesignBusiness',
      '#WorkflowDesign',
      '#StudioLife',
    ],
    keywords: ['brand workflow', 'creative entrepreneurship', 'studio checklist', 'client systems'],
  },
  {
    id: 'festival',
    topic: 'Festival',
    captionStyle: 'Fun & engaging',
    builderTopicMatch: 'Fashion & beauty',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Reel',
        text: 'Warm string lights, lively playlists, and memories worth framing before midnight.',
      },
      {
        platform: 'Pinterest',
        format: 'Event Board Pin',
        text: 'Festive table styling, vibrant color stories, and effortless celebration looks.',
      },
      {
        platform: 'YouTube',
        format: 'Shorts',
        text: 'Golden dusk to lantern glow—our favorite highlights from this weekend’s celebration.',
      },
    ],
    hashtags: [
      '#FestivalSeason',
      '#CelebrationMood',
      '#FestiveVibes',
      '#GoldenLights',
      '#WeekendHighlights',
      '#JoyfulMoments',
      '#EventStyling',
    ],
    keywords: ['festive celebration', 'event moodboard', 'party styling', 'seasonal highlights'],
  },
  {
    id: 'art-design',
    topic: 'Art & Design',
    captionStyle: 'Creative',
    builderTopicMatch: 'Aesthetic designs',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Process Reel',
        text: 'From rough graphite lines to final ink—every mark teaches the eye what to refine.',
      },
      {
        platform: 'Pinterest',
        format: 'Process Pin',
        text: 'Color swatch pairings, typography hierarchy, and sketchbook studies for graphic designers.',
      },
      {
        platform: 'YouTube',
        format: 'Studio Log',
        text: 'Designing a complete visual identity from scratch: paper, ink, grid, and digital polish.',
      },
    ],
    hashtags: [
      '#ArtAndDesign',
      '#GraphicDesign',
      '#IllustrationDaily',
      '#SketchbookStudy',
      '#TypographyLove',
      '#CreativeProcess',
      '#StudioJournal',
    ],
    keywords: ['graphic design process', 'illustration sketchbook', 'brand identity', 'typography'],
  },
  {
    id: 'travel',
    topic: 'Travel',
    captionStyle: 'Adventurous',
    builderTopicMatch: 'Travel & nature',
    sampleCaptions: [
      {
        platform: 'Instagram',
        format: 'Photo Dump',
        text: 'Early ferries, coastal ridge trails, and postcards written from quiet harbor cafés.',
      },
      {
        platform: 'Pinterest',
        format: 'Itinerary Pin',
        text: '48-hour coastal itinerary: scenic overlooks, hidden bookstores, and sunrise trails.',
      },
      {
        platform: 'YouTube',
        format: 'Travel Film',
        text: 'Exploring sea cliffs and island backroads with a single camera and an open map.',
      },
    ],
    hashtags: [
      '#TravelInspiration',
      '#Wanderlust',
      '#ExploreMore',
      '#CoastalItinerary',
      '#TravelJournal',
      '#AdventureAwaits',
      '#ScenicRoutes',
    ],
    keywords: ['coastal itinerary', 'slow travel guide', 'weekend getaway', 'scenic trails'],
  },
];
