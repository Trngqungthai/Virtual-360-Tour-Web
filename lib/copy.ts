import {
  categories,
  type CategorySlug,
  siteConfig,
  whyChooseUs
} from "@/lib/constants";
import type { Locale } from "@/lib/locale";

const categoryTranslations: Record<
  CategorySlug,
  {
    en: { label: string; eyebrow: string; description: string };
    vi: { label: string; eyebrow: string; description: string };
  }
> = {
  education: {
    en: {
      label: "Education",
      eyebrow: "Schools",
      description:
        "Guide families and students through classrooms, libraries, labs, and signature campus moments."
    },
    vi: {
      label: "Trường học",
      eyebrow: "Giáo dục",
      description:
        "Giúp phụ huynh và học sinh khám phá lớp học, thư viện, phòng lab và những điểm nổi bật của khuôn viên."
    }
  },
  hotels: {
    en: {
      label: "Hotels",
      eyebrow: "Hospitality",
      description:
        "Show room types, amenities, and atmosphere with an experience that feels trustworthy before check-in."
    },
    vi: {
      label: "Khách sạn",
      eyebrow: "Lưu trú",
      description:
        "Giới thiệu hạng phòng, tiện ích và không khí lưu trú bằng trải nghiệm trực quan trước khi đặt phòng."
    }
  },
  "serviced-apartments": {
    en: {
      label: "Serviced Apartments",
      eyebrow: "Long Stay",
      description:
        "Help guests compare layouts, finishes, and lifestyle fit with elegant, always-available viewing."
    },
    vi: {
      label: "Căn hộ dịch vụ",
      eyebrow: "Lưu trú dài hạn",
      description:
        "Giúp khách hàng so sánh mặt bằng, nội thất và phong cách sống qua trải nghiệm xem mọi lúc."
    }
  },
  resorts: {
    en: {
      label: "Resorts",
      eyebrow: "Destinations",
      description:
        "Turn premium experiences into premium intent with panoramic previews of villas, pools, and landscapes."
    },
    vi: {
      label: "Khu nghỉ dưỡng",
      eyebrow: "Điểm đến",
      description:
        "Biến không gian nghỉ dưỡng cao cấp thành mong muốn đặt chỗ với góc nhìn toàn cảnh về villa, hồ bơi và cảnh quan."
    }
  },
  "real-estate": {
    en: {
      label: "Real Estate",
      eyebrow: "Sales Gallery",
      description:
        "Give buyers a clear understanding of space, flow, and finish quality before they ever visit in person."
    },
    vi: {
      label: "Bất động sản",
      eyebrow: "Dự án bán hàng",
      description:
        "Giúp người mua hiểu rõ không gian, công năng và chất lượng hoàn thiện trước khi đến xem trực tiếp."
    }
  }
};

const whyChooseUsTranslations = [
  {
    en: {
      title: "Modern Technology",
      description:
        "High-resolution capture, smooth embeds, and polished viewer presentation."
    },
    vi: {
      title: "Công nghệ hiện đại",
      description:
        "Hình ảnh sắc nét, nhúng mượt mà và giao diện xem tour chỉn chu."
    }
  },
  {
    en: {
      title: "Flexible Customization",
      description:
        "Brand-first styling, hotspots, and layouts tailored to your business."
    },
    vi: {
      title: "Tùy chỉnh linh hoạt",
      description:
        "Thiết kế theo nhận diện thương hiệu, hotspot và bố cục phù hợp từng mô hình."
    }
  },
  {
    en: {
      title: "Easy Sharing",
      description: "Launch tours across websites, ads, sales decks, and social in minutes."
    },
    vi: {
      title: "Dễ dàng chia sẻ",
      description:
        "Triển khai tour nhanh trên website, quảng cáo, hồ sơ bán hàng và mạng xã hội."
    }
  },
  {
    en: {
      title: "High Engagement",
      description:
        "Keep audiences exploring longer with immersive storytelling that converts."
    },
    vi: {
      title: "Tăng tương tác",
      description:
        "Giữ người xem ở lại lâu hơn với hành trình trải nghiệm hấp dẫn và dễ chuyển đổi."
    }
  },
  {
    en: {
      title: "Dedicated Support",
      description:
        "A hands-on team that helps from setup to rollout and ongoing updates."
    },
    vi: {
      title: "Hỗ trợ tận tâm",
      description:
        "Đồng hành từ lúc triển khai, vận hành đến cập nhật nội dung sau này."
    }
  }
] as const;

const navTranslations = {
  en: [
    { href: "/", label: "Home" },
    { href: "/tours", label: "360 Tours" },
    { href: "/#industries", label: "Industries" },
    { href: "/#featured", label: "Featured" },
    { href: "/#contact", label: "Contact" }
  ],
  vi: [
    { href: "/", label: "Trang chủ" },
    { href: "/tours", label: "Tour 360" },
    { href: "/#industries", label: "Lĩnh vực" },
    { href: "/#featured", label: "Nổi bật" },
    { href: "/#contact", label: "Liên hệ" }
  ]
} as const;

type CopyShape = {
  brandSubtitle: string;
  header: {
    consultation: string;
    language: string;
    openMenu: string;
    closeMenu: string;
  };
  footer: {
    headline: string;
    description: string;
    navigation: string;
    industries: string;
    contact: string;
    rights: string;
    legal: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    viewTours: string;
    consultation: string;
    stats: Array<{ label: string; value: string }>;
    livePreview: string;
    previewTitle: string;
    arVr: string;
    previewBullets: string[];
    industriesKicker: string;
    industriesTitle: string;
    industriesDescription: string;
    categoryCountLabel: string;
    explore: string;
    featuredKicker: string;
    featuredTitle: string;
    browseAllTours: string;
    whyChooseUsKicker: string;
    whyChooseUsTitle: string;
    ctaKicker: string;
    ctaTitle: string;
    ctaDescription: string;
    contactNow: string;
    viewPortfolio: string;
  };
  toursPage: {
    kicker: string;
    title: string;
    description: string;
    all: string;
    browseAllCategories: string;
    noToursTitle: string;
    noToursDescription: string;
    showing: (shown: number, total: number) => string;
  };
  categoryPage: {
    notFoundTitle: string;
    titleSuffix: string;
    countLabel: (count: number, label: string) => string;
    viewAllCategories: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  tourDetail: {
    notFoundTitle: string;
    backToTours: string;
    kicker: string;
    highlightOne: string;
    highlightTwo: string;
    exploreCategory: (label: string) => string;
    openEmbed: string;
    embeddedViewer: string;
    embeddedViewerTitle: string;
    gallery: string;
    galleryTitle: string;
    relatedTours: string;
    relatedTitle: string;
    viewCategory: string;
    locationMap: string;
    locationMapTitle: string;
    previewFrameTitle: string;
  };
  search: {
    placeholder: string;
    allCategories: string;
    submit: string;
  };
  pagination: {
    previous: string;
    next: string;
  };
  tourCard: {
    viewTour: string;
    quickPreview: string;
  };
  modal: {
    livePreview: string;
    closePreview: string;
    previewTitle: string;
  };
};

const copy: Record<Locale, CopyShape> = {
  en: {
    brandSubtitle: "Immersive tour service",
    header: {
      consultation: "Get Consultation",
      language: "Language",
      openMenu: "Open menu",
      closeMenu: "Close menu"
    },
    footer: {
      headline: "Bring your physical space online with confidence.",
      description:
        "We design premium 360 tour experiences for hospitality, education, real-estate, and destination brands that want richer discovery and better conversions.",
      navigation: "Navigation",
      industries: "Industries",
      contact: "Contact",
      rights: "All rights reserved.",
      legal: "Immersive tour experiences designed for modern sales and marketing teams."
    },
    home: {
      heroBadge: "Premium 360 experiences for hospitality, property, and education",
      heroTitle: "Explore Spaces in 360°",
      heroDescription:
        "Immersive virtual tours for real-world locations. Turn first impressions into confident decisions with cinematic walkthroughs, branded storytelling, and frictionless sharing.",
      viewTours: "View 360 Tours",
      consultation: "Get Consultation",
      stats: [
        { label: "Captured spaces", value: "120+" },
        { label: "Industries served", value: "5" },
        { label: "Average engagement", value: "4.8x" }
      ],
      livePreview: "Live Preview",
      previewTitle: "Resort experience demo",
      arVr: "AR / VR Ready",
      previewBullets: [
        "Embeddable tours for websites and landing pages",
        "Custom branding, hotspots, analytics, and support"
      ],
      industriesKicker: "Industry Solutions",
      industriesTitle: "Five categories built for real customer journeys",
      industriesDescription:
        "Every experience is tailored for how your audience evaluates a space, whether they are booking a stay, choosing a school, or comparing a property.",
      categoryCountLabel: "tours",
      explore: "Explore",
      featuredKicker: "Featured Tours",
      featuredTitle: "Immersive showcases ready to explore",
      browseAllTours: "Browse all tours",
      whyChooseUsKicker: "Why Choose Us",
      whyChooseUsTitle: "A modern 360 partner for ambitious brands",
      ctaKicker: "Ready to launch",
      ctaTitle: "Ready to bring your space to life in 360°?",
      ctaDescription:
        "From concept to deployment, we help teams present places in a way that feels premium, understandable, and easy to share.",
      contactNow: "Contact Now",
      viewPortfolio: "View portfolio"
    },
    toursPage: {
      kicker: "360 Tour Library",
      title: "Find the right virtual experience for every space",
      description:
        "Browse featured work, search by location, or filter by category to see how a modern 360 presentation can support discovery and conversion.",
      all: "All",
      browseAllCategories: "Browse all tours",
      noToursTitle: "No tours found",
      noToursDescription:
        "Try adjusting the category or search keyword to explore more results.",
      showing: (shown, total) => `Showing ${shown} of ${total} tours`
    },
    categoryPage: {
      notFoundTitle: "Category Not Found",
      titleSuffix: "virtual tours",
      countLabel: (count, label) => `${count} tours in ${label}`,
      viewAllCategories: "View all categories",
      emptyTitle: "No tours in this category yet",
      emptyDescription:
        "Add a new tour from the admin dashboard or broaden the search keyword."
    },
    tourDetail: {
      notFoundTitle: "Tour Not Found",
      backToTours: "Back to tours",
      kicker: "Tour Detail",
      highlightOne: "Responsive embed ready for websites, ads, and sales decks",
      highlightTwo: "Custom hotspots, branding, and cross-platform sharing support",
      exploreCategory: (label) => `Explore ${label}`,
      openEmbed: "View Panorama Tour",
      embeddedViewer: "Tour Preview",
      embeddedViewerTitle: "Experience the space inside the page",
      gallery: "Gallery",
      galleryTitle: "Supporting stills and brand imagery",
      relatedTours: "Related Tours",
      relatedTitle: "More spaces in this category",
      viewCategory: "View category",
      locationMap: "Location Map",
      locationMapTitle: "See where this tour is located",
      previewFrameTitle: "360 viewer"
    },
    search: {
      placeholder: "Search tours by title, location, or keyword",
      allCategories: "All categories",
      submit: "Search tours"
    },
    pagination: {
      previous: "Previous",
      next: "Next"
    },
    tourCard: {
      viewTour: "View Tour",
      quickPreview: "Quick Preview"
    },
    modal: {
      livePreview: "Live 360 Preview",
      closePreview: "Close preview",
      previewTitle: "preview"
    }
  },
  vi: {
    brandSubtitle: "Dịch vụ tour 360 chân thực",
    header: {
      consultation: "Nhận tư vấn",
      language: "Ngôn ngữ",
      openMenu: "Mở menu",
      closeMenu: "Đóng menu"
    },
    footer: {
      headline: "Đưa không gian thực của bạn lên online một cách thuyết phục.",
      description:
        "Chúng tôi thiết kế trải nghiệm tour 360 cao cấp cho khách sạn, trường học, bất động sản và các điểm đến cần tăng khám phá và chuyển đổi.",
      navigation: "Điều hướng",
      industries: "Lĩnh vực",
      contact: "Liên hệ",
      rights: "Bảo lưu mọi quyền.",
      legal: "Trải nghiệm tour 360 hiện đại dành cho đội ngũ marketing và bán hàng."
    },
    home: {
      heroBadge: "Giải pháp 360 cao cấp cho khách sạn, bất động sản và giáo dục",
      heroTitle: "Khám phá không gian trong 360°",
      heroDescription:
        "Tour ảo sống động cho các địa điểm thực tế. Biến ấn tượng đầu tiên thành quyết định tự tin với trải nghiệm xem chân thực, kể chuyện bằng không gian và chia sẻ liền mạch.",
      viewTours: "Xem tour 360",
      consultation: "Nhận tư vấn",
      stats: [
        { label: "Không gian đã số hóa", value: "120+" },
        { label: "Lĩnh vực triển khai", value: "5" },
        { label: "Mức độ tương tác", value: "4.8x" }
      ],
      livePreview: "Xem trước trực tiếp",
      previewTitle: "Demo trải nghiệm resort",
      arVr: "Sẵn sàng AR / VR",
      previewBullets: [
        "Dễ dàng nhúng tour lên website và landing page",
        "Tùy biến thương hiệu, hotspot, analytics và hỗ trợ triển khai"
      ],
      industriesKicker: "Giải pháp theo ngành",
      industriesTitle: "Năm nhóm dịch vụ được thiết kế theo hành trình khách hàng",
      industriesDescription:
        "Mỗi trải nghiệm đều được tối ưu theo cách khách hàng đánh giá không gian, từ đặt phòng, chọn trường đến so sánh dự án bất động sản.",
      categoryCountLabel: "tour",
      explore: "Khám phá",
      featuredKicker: "Tour nổi bật",
      featuredTitle: "Các showcase 360 sống động sẵn sàng để trải nghiệm",
      browseAllTours: "Xem tất cả tour",
      whyChooseUsKicker: "Vì sao chọn chúng tôi",
      whyChooseUsTitle: "Đối tác 360 hiện đại cho những thương hiệu nhiều tham vọng",
      ctaKicker: "Sẵn sàng triển khai",
      ctaTitle: "Sẵn sàng đưa không gian của bạn lên 360°?",
      ctaDescription:
        "Từ ý tưởng đến triển khai, chúng tôi giúp doanh nghiệp trình bày không gian theo cách cao cấp, dễ hiểu và dễ chia sẻ.",
      contactNow: "Liên hệ ngay",
      viewPortfolio: "Xem dự án"
    },
    toursPage: {
      kicker: "Thư viện tour 360",
      title: "Tìm trải nghiệm ảo phù hợp cho từng không gian",
      description:
        "Khám phá các dự án nổi bật, tìm theo địa điểm hoặc lọc theo ngành để xem tour 360 hiện đại có thể hỗ trợ khám phá và chuyển đổi như thế nào.",
      all: "Tất cả",
      browseAllCategories: "Xem toàn bộ tour",
      noToursTitle: "Không tìm thấy tour phù hợp",
      noToursDescription:
        "Hãy thử đổi danh mục hoặc từ khóa tìm kiếm để xem thêm kết quả.",
      showing: (shown, total) => `Hiển thị ${shown} trên ${total} tour`
    },
    categoryPage: {
      notFoundTitle: "Không tìm thấy danh mục",
      titleSuffix: "tour ảo",
      countLabel: (count, label) => `${count} tour trong mục ${label}`,
      viewAllCategories: "Xem tất cả danh mục",
      emptyTitle: "Chưa có tour nào trong danh mục này",
      emptyDescription:
        "Bạn có thể thêm tour mới trong trang quản trị hoặc mở rộng từ khóa tìm kiếm."
    },
    tourDetail: {
      notFoundTitle: "Không tìm thấy tour",
      backToTours: "Quay lại danh sách tour",
      kicker: "Chi tiết tour",
      highlightOne: "Iframe responsive sẵn sàng cho website, quảng cáo và tài liệu bán hàng",
      highlightTwo: "Hỗ trợ hotspot, branding và chia sẻ đa nền tảng",
      exploreCategory: (label) => `Khám phá ${label}`,
      openEmbed: "Xem Tour Toàn Cảnh",
      embeddedViewer: "Xem Trước Tour",
      embeddedViewerTitle: "Trải nghiệm không gian ngay trong trang",
      gallery: "Thư viện ảnh",
      galleryTitle: "Hình ảnh hỗ trợ và chất liệu thương hiệu",
      relatedTours: "Tour liên quan",
      relatedTitle: "Thêm không gian cùng danh mục",
      viewCategory: "Xem danh mục",
      locationMap: "Bản đồ vị trí",
      locationMapTitle: "Xem tour này nằm ở đâu",
      previewFrameTitle: "trình xem 360"
    },
    search: {
      placeholder: "Tìm theo tên tour, địa điểm hoặc từ khóa",
      allCategories: "Tất cả danh mục",
      submit: "Tìm tour"
    },
    pagination: {
      previous: "Trước",
      next: "Sau"
    },
    tourCard: {
      viewTour: "Xem tour",
      quickPreview: "Xem nhanh"
    },
    modal: {
      livePreview: "Xem trước 360",
      closePreview: "Đóng xem trước",
      previewTitle: "xem trước"
    }
  }
};

export function getTranslations(locale: Locale) {
  return copy[locale];
}

export function getLocalizedNavLinks(locale: Locale) {
  return navTranslations[locale];
}

export function getLocalizedCategories(locale: Locale) {
  return categories.map((category) => ({
    ...category,
    ...categoryTranslations[category.value][locale]
  }));
}

export function getLocalizedCategory(slug: string, locale: Locale) {
  const category = categories.find((item) => item.value === slug);

  if (!category) {
    return undefined;
  }

  return {
    ...category,
    ...categoryTranslations[category.value][locale]
  };
}

export function getLocalizedCategoryLabel(slug: string, locale: Locale) {
  return getLocalizedCategory(slug, locale)?.label ?? slug;
}

export function getLocalizedWhyChooseUs(locale: Locale) {
  return whyChooseUs.map((item, index) => ({
    ...item,
    ...whyChooseUsTranslations[index][locale]
  }));
}

export function getLocalizedSiteDescription(locale: Locale) {
  if (locale === "vi") {
    return "Virtual 360 tạo ra trải nghiệm tour 360 sống động, tập trung chuyển đổi cho khách sạn, giáo dục, căn hộ và bất động sản.";
  }

  return siteConfig.description;
}
