export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Contact', path: '/contact' },
];

export const navDropdowns = [
  {
    label: 'Learn',
    items: [
      {
        label: 'Solar Buying Guide',
        path: '/learn/solar-buying-guide',
        description: 'Choose the right solar system for your needs',
      },
      {
        label: 'How Solar Systems Work',
        path: '/learn/how-solar-works',
        description: 'Understand panels, inverters and batteries',
      },
      {
        label: 'Solar Subsidy Guide',
        path: '/learn/solar-subsidy-guide',
        description: 'Learn about available government subsidies',
      },
    ],
  },
  {
    label: 'Subsidy',
    items: [
      {
        label: 'PM Surya Ghar Yojana',
        path: '/subsidy/pm-surya-ghar',
        description: 'Residential rooftop solar subsidy scheme',
      },
      {
        label: 'State Subsidy Programs',
        path: '/subsidy/state-programs',
        description: 'State-wise solar incentive details',
      },
      {
        label: 'Subsidy Application Guide',
        path: '/subsidy/application-guide',
        description: 'Step-by-step subsidy application help',
      },
    ],
  },
];

export const trustFeatures = [
  {
    title: 'Premium Solar Panels',
    description:
      'High-efficiency panels engineered for long-lasting performance and maximum energy output.',
    icon: 'Sun',
  },
  {
    title: 'Solar Inverters',
    description:
      'Reliable string and hybrid inverters for residential, commercial and industrial applications.',
    icon: 'Zap',
  },
  {
    title: 'Solar Batteries',
    description:
      'Advanced storage solutions for backup power, load shifting and energy independence.',
    icon: 'BatteryCharging',
  },
  {
    title: 'Complete Solar Solutions',
    description:
      'End-to-end system design, products and support for every scale of solar installation.',
    icon: 'Layers',
  },
];

export const whyChooseBenefits = [
  {
    title: 'High Quality Solar Products',
    description: 'Certified products from trusted manufacturers with proven durability.',
    icon: 'Award',
  },
  {
    title: 'Trusted Solar Solutions',
    description: 'Solutions built for Indian conditions with dependable long-term results.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Expert Technical Support',
    description: 'Guidance from experienced solar professionals at every stage.',
    icon: 'Headphones',
  },
  {
    title: 'Reliable Performance',
    description: 'Systems designed for consistent generation and operational efficiency.',
    icon: 'TrendingUp',
  },
  {
    title: 'Competitive Pricing',
    description: 'Premium quality solar products at transparent and competitive rates.',
    icon: 'IndianRupee',
  },
  {
    title: 'Professional Installation Support',
    description: 'Structured installation assistance for safe and compliant deployments.',
    icon: 'Wrench',
  },
];

export const learnCards = [
  {
    title: 'Solar Buying Guide',
    path: '/learn/solar-buying-guide',
    description:
      'Learn how to evaluate capacity, budget and product quality before buying solar.',
    icon: 'BookOpen',
  },
  {
    title: 'How Solar Systems Work',
    path: '/learn/how-solar-works',
    description:
      'Understand how sunlight becomes usable electricity for your home or business.',
    icon: 'Lightbulb',
  },
  {
    title: 'Solar Subsidy Guide',
    path: '/learn/solar-subsidy-guide',
    description:
      'Explore government schemes and incentives available for solar adoption.',
    icon: 'FileText',
  },
];

export const corporateOffice = {
  address:
    '1st Floor, Balaji Complex, Near Purana Roadways Bus Stand, Opposite Dal Mandi, Sheetal Ganj, Bulandshahr - 203001, Uttar Pradesh',
  mapsQuery:
    'Balaji Complex, Sheetal Ganj, Bulandshahr 203001, Uttar Pradesh',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=1st+Floor,+Balaji+Complex,+Near+Purana+Roadways+Bus+Stand,+Opposite+Dal+Mandi,+Sheetal+Ganj,+Bulandshahr+-+203001,+Uttar+Pradesh',
  embedUrl:
    'https://www.google.com/maps?q=Balaji+Complex,+Sheetal+Ganj,+Bulandshahr+203001,+Uttar+Pradesh&output=embed',
};

export const contactInfo = {
  email: 'hanssolarenergy@gmail.com',
};

export const aboutUsVideo = {
  youtubeId: 'A-RxdvNk2cE',
  url: 'https://youtu.be/A-RxdvNk2cE?si=j7wKNYcN7dcMYfhi',
  title: 'HANS Solar company overview',
};

export const aboutUsContent = {
  title: 'About Us',
  paragraphs: [
    'HANS Solar is a trusted solar energy partner delivering premium panels, inverters, batteries and complete system solutions for homes, businesses and industries.',
    'From our corporate office in Bulandshahr, Uttar Pradesh, we support customers with quality products, subsidy guidance and professional installation assistance. Over 800 families have already benefited from eligible government solar subsidies through HANS Solar installations — helping more households switch to clean, reliable energy every day.',
  ],
};

export const installationGalleryImages = Array.from({ length: 11 }, (_, index) => {
  const localPath = `/s${index + 1}.webp`;

  return {
    src: localPath,
    alt: `HANS Solar subsidy installation ${index + 1}`,
  };
});
