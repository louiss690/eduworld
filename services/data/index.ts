import { isDemoDataMode } from "@/lib/env";
import type { DataStore } from "./types";
import { getLocalStore } from "./localStore";
import { getSupabaseStore } from "./supabaseStore";

/**
 * Returns the active data store.
 *  - No Supabase credentials → LocalStore (demo mode)
 *  - Supabase configured     → SupabaseStore (production backend)
 */
export function getDataStore(): DataStore {
  return isDemoDataMode() ? getLocalStore() : getSupabaseStore();
}

/** Shortcut used by many pages/APIs. */
export const store = getDataStore();
