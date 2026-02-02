import { GenerationResult } from "@/lib/types";

// In-memory stores (use a persistent database in production)
export const resultsStore = new Map<string, GenerationResult>();

// Slides store structure kept flexible for webhook updates
export type SlideEntry = {
  manusTaskId?: string;
  slides?: any[];
  status?: string;
  [key: string]: any;
};

export const slidesStore = new Map<string, SlideEntry>();
