export const siteConfig = {
  name: "Virtual 360",
  tagline: "Immersive virtual tours for real-world locations",
  description:
    "Virtual 360 creates immersive, conversion-focused tour experiences for hospitality, education, residential, and destination brands.",
  url: "https://virtual360.example",
  phone: "+84 1900 1234",
  email: "info@virtual360.vn",
  address: "153 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam"
};

export const categories = [
  {
    value: "education",
    label: "Education",
    eyebrow: "Schools",
    description:
      "Guide families and students through classrooms, libraries, labs, and signature campus moments.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    value: "hotels",
    label: "Hotels",
    eyebrow: "Hospitality",
    description:
      "Show room types, amenities, and atmosphere with an experience that feels trustworthy before check-in.",
    image:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    value: "serviced-apartments",
    label: "Serviced Apartments",
    eyebrow: "Long Stay",
    description:
      "Help guests compare layouts, finishes, and lifestyle fit with elegant, always-available viewing.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80"
  },
  {
    value: "resorts",
    label: "Resorts",
    eyebrow: "Destinations",
    description:
      "Turn premium experiences into premium intent with panoramic previews of villas, pools, and landscapes.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"
  },
  {
    value: "real-estate",
    label: "Real Estate",
    eyebrow: "Sales Gallery",
    description:
      "Give buyers a clear understanding of space, flow, and finish quality before they ever visit in person.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
  }
] as const;

export type CategorySlug = (typeof categories)[number]["value"];

export const whyChooseUs = [
  {
    title: "Modern Technology",
    description: "High-resolution capture, smooth embeds, and polished viewer presentation."
  },
  {
    title: "Flexible Customization",
    description: "Brand-first styling, hotspots, and layouts tailored to your business."
  },
  {
    title: "Easy Sharing",
    description: "Launch tours across websites, ads, sales decks, and social in minutes."
  },
  {
    title: "High Engagement",
    description: "Keep audiences exploring longer with immersive storytelling that converts."
  },
  {
    title: "Dedicated Support",
    description: "A hands-on team that helps from setup to rollout and ongoing updates."
  }
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tours", label: "360 Tours" },
  { href: "/#industries", label: "Industries" },
  { href: "/#featured", label: "Featured" },
  { href: "/#contact", label: "Contact" }
] as const;

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.value === slug);
}

export function getCategoryLabel(slug: string) {
  return getCategoryBySlug(slug)?.label ?? slug;
}

export function buildHref(
  pathname: string,
  params: Record<string, string | number | undefined | null>
) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim() !== "") {
      searchParams.set(key, `${value}`);
    }
  });

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}
