import type { z } from 'zod';

export function createAPIClient() {
  async function _fetch<T extends z.ZodTypeAny>(
    url: string,
    init: RequestInit,
    type: T,
  ): Promise<z.infer<T>> {
    const headers = new Headers(init?.headers);

    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      const result = data.map((item) => type.parse(item));
      return { success: true, data: result };
    } else {
      const result = type.safeParse(data);

      if (!result.success) {
        throw new Error(result.error.message);
      }
      return { success: true, data: result.data };
    }
  }
  return {
    fetch: _fetch,
  };
}
