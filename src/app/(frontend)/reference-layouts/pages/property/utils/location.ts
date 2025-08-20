/**
 * Location utilities for suburb and region data
 * Handles safe extraction of names and images from location objects
 */

import { getImageUrl } from './media';

// Helper functions to safely extract names from suburb/region objects
export const getSuburbName = (suburb: string | null | { name: string } | undefined): string | null => {
  if (!suburb) return null;
  if (typeof suburb === 'string') return suburb;
  if (typeof suburb === 'object' && 'name' in suburb) return suburb.name;
  return null;
};

export const getRegionName = (region: string | null | { name: string } | undefined): string | null => {
  if (!region) return null;
  if (typeof region === 'string') return region;
  if (typeof region === 'object' && 'name' in region) return region.name;
  return null;
};

// Helper functions to get suburb/region images
export const getSuburbImage = (suburb: string | null | { heroImage?: { url: string } } | undefined): string => {
  if (!suburb) return '/img/generic-suburb.webp';
  if (typeof suburb === 'string') return '/img/generic-suburb.webp';
  if (typeof suburb === 'object' && suburb.heroImage?.url) {
    return getImageUrl(suburb.heroImage.url);
  }
  return '/img/generic-suburb.webp';
};

export const getRegionImage = (region: string | null | { heroImage?: { url: string } } | undefined): string => {
  if (!region) return '/img/generic-region.webp';
  if (typeof region === 'string') return '/img/generic-region.webp';
  if (typeof region === 'object' && region.heroImage?.url) {
    return getImageUrl(region.heroImage.url);
  }
  return '/img/generic-region.webp';
};
