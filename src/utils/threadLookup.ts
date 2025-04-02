import { DMCThread, DMC_THREADS } from '../constants/threads';

/**
 * Finds a thread by its numeric DMC ID.
 * @param id The numeric string or number of the thread (e.g., "310" or 310)
 */
export function findThreadByID(id: string | number): DMCThread | undefined {
  const idStr = String(id).trim();
  return DMC_THREADS.find((thread) => String(thread.id) === idStr);
}

/**
 * Finds a thread by its symbol from a runtime key array.
 * @param symbol The symbol character used in the pattern grid
 * @param key The key array from the pattern JSON
 */
export function findThreadBySymbol(
  symbol: string,
  key: { symbol: string; id: number; strands: number }[]
): { symbol: string; id: number; strands: number } | undefined {
  return key.find((entry) => entry.symbol === symbol);
}
