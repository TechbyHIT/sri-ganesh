import { galleryPhotos, type GalleryPhoto } from "./gallery-manifest";

export type { GalleryPhoto };
export { galleryPhotos };

export const galleryFilters = [
  { id: "all", label: "All installations" },
  { id: "invisible-grills", label: "Invisible grills" },
  { id: "balcony-safety-nets", label: "Balcony safety nets" },
  { id: "children-safety-nets", label: "Children safety nets" },
  { id: "pet-safety-nets", label: "Pet and cat nets" },
  { id: "duct-area-nets", label: "Duct area nets" },
  { id: "anti-bird-spikes", label: "Bird spikes" },
  { id: "cloth-hangers", label: "Cloth hangers" },
  { id: "cricket-nets", label: "Sports nets" },
  { id: "mosquito-nets", label: "Mosquito nets" },
] as const;

function rank(seed: string, id: string) {
  let hash = 2166136261;
  const value = `${seed}:${id}`;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function photosForService(service?: string) {
  if (!service) return galleryPhotos;
  const matched = galleryPhotos.filter((photo) => photo.services.includes(service) || photo.category === service);
  return matched.length >= 4 ? matched : galleryPhotos;
}

export function pickPhotos(seed: string, count = 12, service?: string): GalleryPhoto[] {
  const pool = photosForService(service);
  return [...pool].sort((left, right) => rank(seed, left.id) - rank(seed, right.id)).slice(0, Math.min(count, pool.length));
}

export function featuredPhoto(seed: string, service?: string): GalleryPhoto {
  return pickPhotos(seed, 1, service)[0] ?? galleryPhotos[0];
}

const photoId = /-([a-f0-9]{12})\.(?:jpe?g|png|webp|avif)$/i;

export function viewSrc(src: string) {
  const id = src.match(photoId)?.[1];
  return id ? `/gallery/view/${id}.webp` : src;
}

export function displaySrc(src: string) {
  const id = src.match(photoId)?.[1];
  return id ? `/gallery/thumbs/${id}.webp` : src;
}

export type GalleryCard = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  category: string;
};

function toCard(photo: GalleryPhoto): GalleryCard {
  return {
    id: photo.id,
    src: viewSrc(photo.src),
    thumb: displaySrc(photo.src),
    alt: photo.alt,
    category: photo.category,
  };
}

export function galleryCards(seed: string, count = 8, service?: string) {
  return pickPhotos(seed, count, service).map(toCard);
}

export function allGalleryCards() {
  return galleryPhotos.map(toCard);
}

export function heroImage(seed: string, service?: string) {
  return viewSrc(featuredPhoto(seed, service).src);
}

export function cardImage(seed: string, service?: string) {
  return displaySrc(featuredPhoto(seed, service).src);
}

export const photos = {
  hero: featuredPhoto("hero", "invisible-grills").src,
  apartments: featuredPhoto("apartments", "balcony-safety-nets").src,
  homes: featuredPhoto("homes", "invisible-grills").src,
  bright: featuredPhoto("bright", "invisible-grills").src,
  living: featuredPhoto("living", "children-safety-nets").src,
  block: featuredPhoto("block", "balcony-safety-nets").src,
  cricket: featuredPhoto("cricket", "cricket-nets").src,
  room: featuredPhoto("room", "cloth-hangers").src,
};
