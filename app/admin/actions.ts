"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  requireAdminSession,
  verifyAdminCredentials
} from "@/lib/auth";
import {
  createTour,
  deleteTour,
  getTourById,
  normaliseTourInput,
  saveUploadedThumbnail,
  updateTour
} from "@/lib/tours";
import {
  normaliseSiteSettingsInput,
  updateSiteSettings
} from "@/lib/site-settings";

async function resolveAsset(
  formData: FormData,
  {
    fileField,
    urlField,
    fallback = ""
  }: {
    fileField: string;
    urlField: string;
    fallback?: string;
  }
) {
  const file = formData.get(fileField);

  if (file instanceof File && file.size > 0) {
    const uploadedPath = await saveUploadedThumbnail(file);
    if (uploadedPath) {
      return uploadedPath;
    }
  }

  const assetUrl = `${formData.get(urlField) ?? ""}`.trim();
  return assetUrl || fallback;
}

async function resolveThumbnail(formData: FormData, fallbackThumbnail = "") {
  return resolveAsset(formData, {
    fileField: "thumbnailFile",
    urlField: "thumbnail",
    fallback: fallbackThumbnail
  });
}

export async function loginAction(formData: FormData) {
  const email = `${formData.get("email") ?? ""}`.trim();
  const password = `${formData.get("password") ?? ""}`.trim();

  if (!verifyAdminCredentials(email, password)) {
    redirect("/admin/login?error=invalid");
  }

  await createAdminSession();
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login?status=logged-out");
}

export async function createTourAction(formData: FormData) {
  await requireAdminSession();

  let parsedInput;
  try {
    parsedInput = normaliseTourInput({
      title: formData.get("title"),
      category: formData.get("category"),
      location: formData.get("location"),
      thumbnail: formData.get("thumbnail"),
      embedUrl: formData.get("embedUrl"),
      projectUrl: formData.get("projectUrl"),
      projectDetailOne: formData.get("projectDetailOne"),
      projectDetailTwo: formData.get("projectDetailTwo"),
      mapEmbedUrl: formData.get("mapEmbedUrl"),
      description: formData.get("description")
    });
  } catch {
    redirect("/admin/dashboard/new?error=missing-fields");
  }

  const thumbnail = await resolveThumbnail(formData);

  if (!thumbnail) {
    redirect("/admin/dashboard/new?error=thumbnail-required");
  }

  await createTour({
    ...parsedInput,
    thumbnail
  });

  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath("/tours");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/categories/${parsedInput.category}`);
  redirect("/admin/dashboard?status=created");
}

export async function updateTourAction(id: string, formData: FormData) {
  await requireAdminSession();
  const currentTour = await getTourById(id);

  if (!currentTour) {
    redirect("/admin/dashboard?error=not-found");
  }

  let parsedInput;
  try {
    parsedInput = normaliseTourInput({
      title: formData.get("title"),
      category: formData.get("category"),
      location: formData.get("location"),
      thumbnail: formData.get("thumbnail"),
      embedUrl: formData.get("embedUrl"),
      projectUrl: formData.get("projectUrl"),
      projectDetailOne: formData.get("projectDetailOne"),
      projectDetailTwo: formData.get("projectDetailTwo"),
      mapEmbedUrl: formData.get("mapEmbedUrl"),
      description: formData.get("description")
    });
  } catch {
    redirect(`/admin/dashboard/${id}/edit?error=missing-fields`);
  }

  const thumbnail = await resolveThumbnail(formData, currentTour.thumbnail);

  if (!thumbnail) {
    redirect(`/admin/dashboard/${id}/edit?error=thumbnail-required`);
  }

  const updatedTour = await updateTour(id, {
    ...parsedInput,
    thumbnail,
    gallery: currentTour.gallery ?? []
  });

  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath("/tours");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/categories/${currentTour.category}`);
  revalidatePath(`/categories/${parsedInput.category}`);
  revalidatePath(`/tours/${currentTour.slug}`);

  if (updatedTour) {
    revalidatePath(`/tours/${updatedTour.slug}`);
  }

  redirect("/admin/dashboard?status=updated");
}

export async function deleteTourAction(id: string) {
  await requireAdminSession();
  const currentTour = await getTourById(id);

  if (!currentTour) {
    redirect("/admin/dashboard?error=not-found");
  }

  await deleteTour(id);

  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath("/tours");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/categories/${currentTour.category}`);
  revalidatePath(`/tours/${currentTour.slug}`);

  redirect("/admin/dashboard?status=deleted");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdminSession();

  let settings;
  try {
    settings = normaliseSiteSettingsInput(formData);
  } catch {
    redirect("/admin/settings?error=missing-fields");
  }

  const brandLogo = await resolveAsset(formData, {
    fileField: "brandLogoFile",
    urlField: "brandLogo",
    fallback: `${formData.get("existingBrandLogo") ?? ""}`.trim()
  });

  await updateSiteSettings({
    ...settings,
    brandLogo
  });

  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath("/tours");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?status=updated");
}
