import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/locale";

export interface HeroStat {
  value: string;
  labelEn: string;
  labelVi: string;
}

export interface SiteSettings {
  brandName: string;
  brandLogo: string;
  heroPreviewUrl: string;
  heroStats: HeroStat[];
  contact: {
    phone: string;
    zalo: string;
    email: string;
    address: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

const settingsFilePath = path.join(process.cwd(), "data", "site-settings.json");

export const defaultSiteSettings: SiteSettings = {
  brandName: "Virtual 360",
  brandLogo: "",
  heroPreviewUrl: "https://trngqungthai.github.io/Tour_Demo_2/",
  heroStats: [
    {
      value: "120+",
      labelEn: "Captured spaces",
      labelVi: "Không gian đã số hoá"
    },
    {
      value: "5",
      labelEn: "Industries served",
      labelVi: "Lĩnh vực triển khai"
    },
    {
      value: "4.8x",
      labelEn: "Average engagement",
      labelVi: "Mức độ tương tác"
    }
  ],
  contact: {
    phone: "+84 1900 1234",
    zalo: "0768040229",
    email: "info@virtual360.vn",
    address: "153 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam"
  },
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: ""
  }
};

function cleanValue(value: FormDataEntryValue | null) {
  return `${value ?? ""}`.trim();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const file = await readFile(settingsFilePath, "utf8");
    const parsed = JSON.parse(file) as Partial<SiteSettings>;

    return {
      brandName: parsed.brandName?.trim() || defaultSiteSettings.brandName,
      brandLogo: parsed.brandLogo?.trim() || defaultSiteSettings.brandLogo,
      heroPreviewUrl: parsed.heroPreviewUrl?.trim() || defaultSiteSettings.heroPreviewUrl,
      heroStats:
        parsed.heroStats?.length === 3
          ? parsed.heroStats.map((stat, index) => ({
              value: stat.value?.trim() || defaultSiteSettings.heroStats[index].value,
              labelEn: stat.labelEn?.trim() || defaultSiteSettings.heroStats[index].labelEn,
              labelVi: stat.labelVi?.trim() || defaultSiteSettings.heroStats[index].labelVi
            }))
          : defaultSiteSettings.heroStats,
      contact: {
        phone: parsed.contact?.phone?.trim() || defaultSiteSettings.contact.phone,
        zalo: parsed.contact?.zalo?.trim() || defaultSiteSettings.contact.zalo,
        email: parsed.contact?.email?.trim() || defaultSiteSettings.contact.email,
        address: parsed.contact?.address?.trim() || defaultSiteSettings.contact.address
      },
      socialLinks: {
        facebook: parsed.socialLinks?.facebook?.trim() || "",
        instagram: parsed.socialLinks?.instagram?.trim() || "",
        linkedin: parsed.socialLinks?.linkedin?.trim() || ""
      }
    };
  } catch {
    return defaultSiteSettings;
  }
}

export async function updateSiteSettings(settings: SiteSettings) {
  await mkdir(path.dirname(settingsFilePath), { recursive: true });
  await writeFile(settingsFilePath, JSON.stringify(settings, null, 2), "utf8");
}

export function normaliseSiteSettingsInput(formData: FormData): SiteSettings {
  const heroStats: HeroStat[] = [0, 1, 2].map((index) => ({
    value: cleanValue(formData.get(`heroStats.${index}.value`)),
    labelEn: cleanValue(formData.get(`heroStats.${index}.labelEn`)),
    labelVi: cleanValue(formData.get(`heroStats.${index}.labelVi`))
  }));

  if (heroStats.some((stat) => !stat.value || !stat.labelEn || !stat.labelVi)) {
    throw new Error("Missing hero stats");
  }

  const brandName = cleanValue(formData.get("brandName"));
  const brandLogo = cleanValue(formData.get("brandLogo"));
  const heroPreviewUrl = cleanValue(formData.get("heroPreviewUrl"));
  const phone = cleanValue(formData.get("contact.phone"));
  const zalo = cleanValue(formData.get("contact.zalo"));
  const email = cleanValue(formData.get("contact.email"));
  const address = cleanValue(formData.get("contact.address"));

  if (!brandName || !heroPreviewUrl || !phone || !zalo || !email || !address) {
    throw new Error("Missing site settings");
  }

  return {
    brandName,
    brandLogo,
    heroPreviewUrl,
    heroStats,
    contact: {
      phone,
      zalo,
      email,
      address
    },
    socialLinks: {
      facebook: cleanValue(formData.get("social.facebook")),
      instagram: cleanValue(formData.get("social.instagram")),
      linkedin: cleanValue(formData.get("social.linkedin"))
    }
  };
}

export function getLocalizedHeroStats(settings: SiteSettings, locale: Locale) {
  return settings.heroStats.map((stat) => ({
    value: stat.value,
    label: locale === "vi" ? stat.labelVi : stat.labelEn
  }));
}

export function buildZaloUrl(zalo: string) {
  const cleaned = zalo.replace(/[^\d]/g, "");
  return cleaned ? `https://zalo.me/${cleaned}` : "#";
}
