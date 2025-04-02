import { DMCThread, DMC_THREADS } from '../constants/threads';
import type { PatternThreadEntry } from '@schemas/CrossStitchPattern';

/**
 * Find a DMC thread from the master list by its string ID.
 * @param id The DMC thread ID (e.g. "310", "B5200", "Blanc")
 */
export function findThreadByID(id: string): DMCThread | undefined {
  return DMC_THREADS.find((thread) => thread.id === id);
}

/**
 * Find a pattern-specific thread entry by its symbol.
 * This looks up the thread definition in the pattern's key.
 * @param symbol The symbol used in the pattern grid
 * @param key The key array from a CrossStitchPattern
 */
export function findThreadBySymbol(
  symbol: string,
  key: PatternThreadEntry[]
): PatternThreadEntry | undefined {
  return key.find((entry) => entry.symbol === symbol);
}
