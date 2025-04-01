import { DMCThread, DMC_THREADS } from '../constants/threads';

export function findThreadByID(id: string): DMCThread | undefined {
  return DMC_THREADS.find(
    (thread) => thread.id.toLowerCase() === id.toLowerCase()
  );
}
