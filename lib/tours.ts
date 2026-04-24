import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { categories, type CategorySlug } from "@/lib/constants";

export interface Tour {
  id: string;
  slug: string;
  title: string;
  category: CategorySlug;
  location: string;
  thumbnail: string;
  embedUrl: string;
  projectUrl: string;
  projectDetails: string[];
  mapEmbedUrl: string;
  description: string;
  createdAt: string;
  gallery?: string[];
}

export interface TourInput {
  title: string;
  category: CategorySlug;
  location: string;
  thumbnail: string;
  embedUrl: string;
  projectUrl: string;
  projectDetails: string[];
  mapEmbedUrl: string;
  description: string;
  gallery?: string[];
}

const toursFilePath = path.join(process.cwd(), "data", "tours.json");

export function buildGoogleMapsEmbedUrl(location: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureValidCategory(category: string): category is CategorySlug {
  return categories.some((item) => item.value === category);
}

function buildProjectDetails(
  details: string[] | undefined,
  description: string,
  location: string
) {
  const normalized = (details ?? []).map((item) => item.trim()).filter(Boolean);

  if (normalized.length >= 2) {
    return normalized.slice(0, 2);
  }

  const fallbacks = [description.trim(), location.trim()].filter(Boolean);
  return [...normalized, ...fallbacks].slice(0, 2);
}

function createUniqueSlug(title: string, tours: Tour[]) {
  const baseSlug = slugify(title) || "tour";
  let candidate = baseSlug;
  let suffix = 1;

  while (tours.some((tour) => tour.slug === candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

async function readToursFile(): Promise<Tour[]> {
  const file = await readFile(toursFilePath, "utf8");
  const parsed = JSON.parse(file) as Tour[];

  return parsed.map((tour) => ({
    ...tour,
    slug: tour.slug || slugify(tour.title),
    projectUrl: tour.projectUrl?.trim() || tour.embedUrl,
    projectDetails: buildProjectDetails(tour.projectDetails, tour.description, tour.location),
    mapEmbedUrl: tour.mapEmbedUrl || buildGoogleMapsEmbedUrl(tour.location),
    gallery: tour.gallery ?? []
  }));
}

async function writeToursFile(tours: Tour[]) {
  await mkdir(path.dirname(toursFilePath), { recursive: true });
  await writeFile(toursFilePath, JSON.stringify(tours, null, 2), "utf8");
}

export async function getAllTours() {
  const tours = await readToursFile();
  return tours.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getFeaturedTours(limit = 4) {
  const tours = await getAllTours();
  return tours.slice(0, limit);
}

export async function getTourBySlug(slug: string) {
  const tours = await getAllTours();
  return tours.find((tour) => tour.slug === slug);
}

export async function getTourById(id: string) {
  const tours = await getAllTours();
  return tours.find((tour) => tour.id === id);
}

export async function createTour(input: TourInput) {
  const tours = await getAllTours();

  const newTour: Tour = {
    id: randomUUID(),
    slug: createUniqueSlug(input.title, tours),
    title: input.title.trim(),
    category: input.category,
    location: input.location.trim(),
    thumbnail: input.thumbnail.trim(),
    embedUrl: input.embedUrl.trim(),
    projectUrl: input.projectUrl.trim() || input.embedUrl.trim(),
    projectDetails: input.projectDetails.map((item) => item.trim()).filter(Boolean).slice(0, 2),
    mapEmbedUrl: input.mapEmbedUrl.trim() || buildGoogleMapsEmbedUrl(input.location),
    description: input.description.trim(),
    createdAt: new Date().toISOString(),
    gallery: input.gallery ?? []
  };

  tours.unshift(newTour);
  await writeToursFile(tours);
  return newTour;
}

export async function updateTour(id: string, input: TourInput) {
  const tours = await getAllTours();
  const currentTour = tours.find((tour) => tour.id === id);

  if (!currentTour) {
    throw new Error("Tour not found");
  }

  const nextSlug =
    currentTour.title.trim().toLowerCase() === input.title.trim().toLowerCase()
      ? currentTour.slug
      : createUniqueSlug(
          input.title,
          tours.filter((tour) => tour.id !== id)
        );

  const updatedTours = tours.map((tour) =>
    tour.id === id
      ? {
          ...tour,
          slug: nextSlug,
          title: input.title.trim(),
          category: input.category,
          location: input.location.trim(),
          thumbnail: input.thumbnail.trim(),
          embedUrl: input.embedUrl.trim(),
          projectUrl: input.projectUrl.trim() || input.embedUrl.trim(),
          projectDetails: input.projectDetails
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 2),
          mapEmbedUrl: input.mapEmbedUrl.trim() || buildGoogleMapsEmbedUrl(input.location),
          description: input.description.trim(),
          gallery: input.gallery ?? tour.gallery ?? []
        }
      : tour
  );

  await writeToursFile(updatedTours);
  return updatedTours.find((tour) => tour.id === id);
}

export async function deleteTour(id: string) {
  const tours = await getAllTours();
  const updatedTours = tours.filter((tour) => tour.id !== id);
  await writeToursFile(updatedTours);
}

export async function saveUploadedThumbnail(file: File) {
  if (!file || file.size === 0) {
    return null;
  }

  const extension = path.extname(file.name || "").toLowerCase() || ".jpg";
  const baseName = slugify(path.basename(file.name, extension) || "tour-thumbnail");
  const fileName = `${Date.now()}-${baseName}${extension}`;
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  const targetFilePath = path.join(uploadDirectory, fileName);

  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(targetFilePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${fileName}`;
}

export function normaliseTourInput(input: {
  title: FormDataEntryValue | null;
  category: FormDataEntryValue | null;
  location: FormDataEntryValue | null;
  thumbnail: FormDataEntryValue | null;
  embedUrl: FormDataEntryValue | null;
  projectUrl: FormDataEntryValue | null;
  projectDetailOne: FormDataEntryValue | null;
  projectDetailTwo: FormDataEntryValue | null;
  mapEmbedUrl: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
}) {
  const title = `${input.title ?? ""}`.trim();
  const category = `${input.category ?? ""}`.trim();
  const location = `${input.location ?? ""}`.trim();
  const thumbnail = `${input.thumbnail ?? ""}`.trim();
  const embedUrl = `${input.embedUrl ?? ""}`.trim();
  const projectUrl = `${input.projectUrl ?? ""}`.trim();
  const projectDetailOne = `${input.projectDetailOne ?? ""}`.trim();
  const projectDetailTwo = `${input.projectDetailTwo ?? ""}`.trim();
  const mapEmbedUrl = `${input.mapEmbedUrl ?? ""}`.trim();
  const description = `${input.description ?? ""}`.trim();

  if (
    !title ||
    !location ||
    !embedUrl ||
    !description ||
    !projectDetailOne ||
    !projectDetailTwo
  ) {
    throw new Error("Missing required fields");
  }

  if (!ensureValidCategory(category)) {
    throw new Error("Invalid category");
  }

  return {
    title,
    category,
    location,
    thumbnail,
    embedUrl,
    projectUrl,
    projectDetails: [projectDetailOne, projectDetailTwo],
    mapEmbedUrl,
    description
  } satisfies TourInput;
}
