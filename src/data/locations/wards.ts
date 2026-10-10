import type { AdminLocation } from "@/data/types";

/**
 * No ward list has been imported.
 *
 * Wards must come from an official urban-local-body directory with stable
 * codes and parent mappings. The user-supplied starter PDF mixes towns,
 * mandals, and localities and does not identify wards.
 */
export const wards: AdminLocation[] = [];
