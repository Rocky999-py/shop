import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'aether-headphones',
    name: 'Aether ANC Wireless Headphones',
    tagline: 'Sound isolated in luxury.',
    price: 349,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 42,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'A masterpiece of acoustic engineering and physical comfort. Crafted with soft-grain lambskin leather, robust anodized aluminum arms, and high-density memory foam earcups, the Aether ANC delivers an unparalleled studio-grade listening experience. Featuring our proprietary ultra-responsive active noise cancellation and a refined 40mm beryllium driver configuration.',
    features: [
      'Hybrid Adaptive Active Noise Cancellation with Ambient Mode',
      'Precision-engineered 40mm beryllium dynamic drivers',
      'Up to 45 hours of continuous wireless playback on a single charge',
      'Premium soft-grain lambskin leather and precision-milled aluminum construction',
      'Multipoint Bluetooth 5.2 connectivity for seamless device switching'
    ],
    specs: {
      'Driver Size': '40mm Beryllium dynamic',
      'Frequency Response': '4Hz - 40,000Hz',
      'Impedance': '32 Ohms',
      'Battery Life': '45 hours (ANC off) / 38 hours (ANC on)',
      'Connectivity': 'Bluetooth 5.2 / USB-C / 3.5mm Jack',
      'Weight': '285 grams'
    },
    stock: 14,
    isFeatured: true,
    isSale: true,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Alexander V.',
        rating: 5,
        date: '2026-05-15',
        comment: 'Unbelievable clarity and depth. The materials feel incredibly premium, far superior to plastic headphones. The ANC makes noise completely melt away.'
      },
      {
        id: 'rev-2',
        userName: 'Elena R.',
        rating: 4,
        date: '2026-06-02',
        comment: 'Extremely comfortable for long flights. The bass is clean and tight, not muddy. Only wish the carrying case was a bit smaller.'
      }
    ]
  },
  {
    id: 'kallio-keyboard',
    name: 'Kallio Tactile Mechanical Keyboard',
    tagline: 'Artisanal tactile precision.',
    price: 189,
    rating: 4.9,
    reviewCount: 29,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Designed for deep writing and technical precision. The Kallio is a compact 75% mechanical keyboard enclosed in a hefty, bead-blasted aluminum housing. Outfitted with custom pre-lubricated silent tactile switches and dye-sublimated thick PBT keycaps, it offers a deeply satisfying "thocky" sound profile and crisp actuation without distracting the room.',
    features: [
      'Solid CNC-milled 6063 aluminum chassis with high-density brass weight',
      'Bespoke silent tactile switches (pre-lubed with Krytox GPL 205g0)',
      'Dye-sublimated thick PBT keycaps in archival cream and warm gray',
      'Hot-swappable 5-pin PCB for easy switch customization',
      'Triple-mode connection (2.4Ghz, Bluetooth 5.1, and Wired Type-C)'
    ],
    specs: {
      'Layout': '75% ANSI layout (84 keys)',
      'Case Material': 'CNC Anodized 6063 Aluminum',
      'Switches': 'Kallio Butter Tactile (Silent, 55g actuation)',
      'Keycaps': 'Cherry-profile Dye-sub PBT',
      'Battery': '4000mAh Lithium-Polymer',
      'Mounting Style': 'Gasket mounted with Poron dampening sheets'
    },
    stock: 8,
    isFeatured: false,
    isNew: true,
    reviews: [
      {
        id: 'rev-3',
        userName: 'Soren K.',
        rating: 5,
        date: '2026-06-20',
        comment: 'An absolute dream to type on. The weight of the metal chassis keeps it rock-solid on the desk, and the switches are quiet yet deeply tactile.'
      }
    ]
  },
  {
    id: 'nordic-cashmere-coat',
    name: 'Nordic Double-Breasted Cashmere Overcoat',
    tagline: 'Tailored warmth, woven from clouds.',
    price: 580,
    rating: 5.0,
    reviewCount: 18,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An elegant long coat designed to withstand severe winter chills with refined simplicity. Weaved entirely from hand-combed, grade-A Himalayan cashmere fibers, this double-breasted overcoat features a natural unlined inner structure with fully bound silk-satin sleeve linings for ultimate drape and fluid movement over winter knits.',
    features: [
      '100% hand-combed Himalayan cashmere (420g/sm heavy weave)',
      'Double-breasted silhouette with broad notched lapels',
      'Natural horn buttons and hand-stitched bar-tack welt pockets',
      'Bound inner seams lined with premium Mulberry silk-satin',
      'Relaxed structural tailoring designed for elegant layering'
    ],
    specs: {
      'Material': '100% Himalayan Cashmere',
      'Lining': '100% Mulberry Silk-Satin (sleeves only)',
      'Fit': 'Modern Relaxed Tailoring',
      'Care': 'Professional Dry Clean Only',
      'Country of Origin': 'Hand-crafted in Italy'
    },
    stock: 5,
    isFeatured: true,
    isNew: false,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Marcus L.',
        rating: 5,
        date: '2026-05-10',
        comment: 'This coat is a work of art. The cashmere is incredibly soft and heavy, giving a gorgeous fluid motion when you walk. Well worth the price.'
      }
    ]
  },
  {
    id: 'soma-tote',
    name: 'Soma Full-Grain Leather Tote',
    tagline: 'Sculptural form, structural purpose.',
    price: 290,
    rating: 4.7,
    reviewCount: 31,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An everyday companion of geometric elegance. The Soma Tote is crafted from drum-dyed, full-grain Italian calfskin that will develop a gorgeous golden patina over time. Designed with raw interior edges to celebrate the natural texture of premium leather, and equipped with a floating zippered wallet pouch and solid raw brass sand-cast rivets.',
    features: [
      'Drum-dyed, full-grain vegetable tanned Italian calfskin leather',
      'Hand-burnished raw edges with beeswax sealant',
      'Solid sand-cast brass rivets and double-reinforced structural straps',
      'Floating interior leather zipper pouch for passports and keys',
      'Sized perfectly to hold a 16-inch MacBook Pro plus daily essentials'
    ],
    specs: {
      'Material': 'Full-grain vegetable-tanned calf leather',
      'Hardware': 'Solid Raw Brass',
      'Dimensions': '14.5" W x 12.5" H x 6" D',
      'Strap Drop': '10.5 inches',
      'Weight': '0.9 kg'
    },
    stock: 12,
    isFeatured: false,
    reviews: [
      {
        id: 'rev-5',
        userName: 'Clarissa M.',
        rating: 4,
        date: '2026-06-11',
        comment: 'Stunning leather quality. It smells incredible and stands up on its own. It fits my work laptop, water bottle, and a thin jacket comfortably.'
      },
      {
        id: 'rev-6',
        userName: 'David T.',
        rating: 5,
        date: '2026-06-18',
        comment: 'Minimalism at its absolute best. No loud branding, just excellent materials and impeccable stitching.'
      }
    ]
  },
  {
    id: 'ceramic-vase',
    name: 'Clay & Basalt Sculptured Vase',
    tagline: 'Brutalist clay, hand-thrown character.',
    price: 85,
    rating: 4.6,
    reviewCount: 22,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Celebrating the raw asymmetry of the earth. Hand-thrown on a traditional kickwheel in a small studio in Kyoto, each sculptured vase combines coarse stoneware clay with dynamic black basalt powder. Glazed only on the interior to ensure water-tight utility, while leaving the mineral-rich exterior textured and matte.',
    features: [
      'Each piece is individually wheel-thrown and uniquely hand-formed',
      'Formulated with organic dark stoneware clay and coarse basalt sand',
      'Waterproof interior vitrified glass glaze',
      'Weighted flat bottom with protective wool felt cushion stickers',
      'Exquisite on its own or housing dry botanicals or seasonal stems'
    ],
    specs: {
      'Material': 'Iron-bearing coarse stoneware and basalt sand',
      'Finish': 'Matte raw unglazed exterior, vitrified interior glaze',
      'Height': '9.2 inches (approximate)',
      'Diameter': '5.5 inches (approximate)',
      'Care': 'Hand wash only with mild soap'
    },
    stock: 15,
    isFeatured: true,
    reviews: [
      {
        id: 'rev-7',
        userName: 'Keiko H.',
        rating: 5,
        date: '2026-04-28',
        comment: 'Beautiful natural organic texture. It looks like a sculptured geological specimen on my console table. Truly gorgeous craftsmanship.'
      }
    ]
  },
  {
    id: 'linen-throw',
    name: 'French Flax Linen Bedding Set',
    tagline: 'Breathable stonewashed luxury.',
    price: 120,
    originalPrice: 145,
    rating: 4.9,
    reviewCount: 37,
    category: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Woven from premium organic flax harvested in northern France, this pre-washed linen throw and cushion cover set offers relaxed elegance and superb thermo-regulating performance. Softened with volcanic pumice stones during the final washing cycle, it boasts a deeply tactile waffle texture that gets softer with every home launder.',
    features: [
      'Woven from 100% natural long-staple French flax fibers',
      'Stonewashed with natural volcanic stones for immediate lived-in softness',
      'Highly breathable and moisture-wicking (keeps cool in summer, warm in winter)',
      'Oversized waffle-weave throw blanket plus two envelope-style shams',
      'Oeko-Tex certified (free of harmful synthetics and toxic dyes)'
    ],
    specs: {
      'Material': '100% French Flax Linen',
      'Weave Type': 'Textured waffle blanket, breathable plain-weave shams',
      'Throw Size': '60" x 80" (Oversized)',
      'Sham Size': '20" x 26" (Standard size, pack of 2)',
      'Certification': 'OEKO-TEX® Standard 100'
    },
    stock: 20,
    isFeatured: false,
    isSale: true,
    reviews: [
      {
        id: 'rev-8',
        userName: 'Oliver B.',
        rating: 5,
        date: '2026-05-30',
        comment: 'The texture is insanely beautiful. It has a beautiful, natural, heavy weight that drapes beautifully over the sofa. Ordering another set in charcoal!'
      }
    ]
  },
  {
    id: 'facial-nectar',
    name: 'Aura Botanical Facial Nectar',
    tagline: 'Pure liquid cellular restoration.',
    price: 75,
    rating: 4.8,
    reviewCount: 54,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An active botanical oil designed to restore, feed, and strengthen your skin barrier. Aura Facial Nectar is made from cold-pressed, high-altitude plant seeds. Formulated with rare blue tansy, organic evening primrose, and sugarcane-derived squalane. It melts into the skin instantly, leaving a dewy satin finish with an herbaceous soothing aroma.',
    features: [
      '100% active, cold-pressed plant botanicals with no fillers or silicones',
      'Infused with authentic Moroccan Blue Tansy to reduce redness and calm skin',
      'Sugarcane squalane mimics natural sebum for immediate, deep hydration',
      'Rich in gamma-linolenic acid (GLA) and fat-soluble antioxidants',
      'Packaged in an ultraviolet violet-glass bottle to protect bioactive components'
    ],
    specs: {
      'Volume': '30ml / 1.0 fl. oz',
      'Skin Type': 'All skins, specifically sensitive, dry, or irritated',
      'Aroma': 'Herbaceous, sweet blue chamomile and frankincense',
      'pH Range': 'Anhydrous (neutral oil formula)',
      'Purity': '100% Organic, Cruelty-free, Vegan-certified'
    },
    stock: 25,
    isFeatured: false,
    isNew: true,
    reviews: [
      {
        id: 'rev-9',
        userName: 'Isabella G.',
        rating: 5,
        date: '2026-06-15',
        comment: 'Absolute magic in a bottle. My dry skin is completely plumped, and the redness on my cheeks has visibly cleared up in a week. Smells like a luxury spa.'
      },
      {
        id: 'rev-10',
        userName: 'John P.',
        rating: 4,
        date: '2026-06-25',
        comment: 'Very hydrating and doesn’t cause breakouts. It absorbs faster than other heavy oils. Price is high, but a few drops go a long way.'
      }
    ]
  },
  {
    id: 'ceramic-diffuser',
    name: 'Minimalist Stone Diffuser',
    tagline: 'Ultrasonic vapor, porcelain architectural form.',
    price: 95,
    rating: 4.8,
    reviewCount: 33,
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Transforming your airspace into a serene sanctuary. The Minimalist Stone Diffuser features a heavy, hand-milled cover crafted from premium white porcelain. Emitting a cool, ultrasonic scent mist at 2.5 million vibrations per second, it humidifies the air while preserving the full molecular structure of botanical essential oils.',
    features: [
      'Hand-crafted solid porcelain outer cover with a textured matte finish',
      'Ultrasonic cool-mist technology (vibrates at 2.5 MHz)',
      'Continuous 4-hour or intermittent 8-hour operating cycles',
      'Auto-safety shutoff function when the water reservoir is depleted',
      'Optional warm ambient LED light bar embedded in the solid brass base'
    ],
    specs: {
      'Cover': 'Hand-crafted Matte Porcelain Ceramic',
      'Base': 'Weighted Brushed Brass',
      'Reservoir Volume': '120 ml',
      'Coverage Area': 'Up to 500 sq. ft.',
      'Dimensions': '3.4" W x 7.1" H',
      'Power Source': 'Detachable 5ft braided nylon cable'
    },
    stock: 9,
    isFeatured: true,
    isNew: true,
    reviews: [
      {
        id: 'rev-11',
        userName: 'Aria N.',
        rating: 5,
        date: '2026-06-08',
        comment: 'It looks like a sculptural art piece on my shelf. The mist is super fine, and it runs silent. The warm brass glow is incredibly calming in the evening.'
      }
    ]
  }
];

export const PROMO_CODES: Record<string, any> = {
  'AURA15': { code: 'AURA15', discountType: 'percentage', discountValue: 15 },
  'LUXE50': { code: 'LUXE50', discountType: 'fixed', discountValue: 50, minSubtotal: 250 },
  'WELCOME10': { code: 'WELCOME10', discountType: 'percentage', discountValue: 10 }
};
