import { PUBLIC_ENV } from '@/config/public.env.config';

import { IRequestOptions, TRequest } from './request.types';
import requestCreator from './request-creator';

const forwardClientRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: unknown,
  options?: IRequestOptions,
): Promise<T> => {
  const isServer = typeof window === 'undefined';
  const headers: Record<string, string> = { ...(options?.headers as any) };

  if (isServer) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      headers['Cookie'] = cookieStore.toString();
    } catch (e) {
      // Not in a request context, skip cookie forwarding
    }
  }

  const fullUrl = `${PUBLIC_ENV.NEXT_PUBLIC_API_URL}${url}`;

  return requestCreator<T>({
    method,
    url: fullUrl,
    body,
    options: {
      ...options,
      headers,
    },
  });
};

export const appRequest: TRequest = {
  get: <T>(url: string, options?: IRequestOptions) =>
    forwardClientRequest<T>('GET', url, undefined, options),

  post: <T>(url: string, body: unknown, options?: IRequestOptions) =>
    forwardClientRequest<T>('POST', url, body, options),

  put: <T>(url: string, body: unknown, options?: IRequestOptions) =>
    forwardClientRequest<T>('PUT', url, body, options),

  patch: <T>(url: string, body: unknown, options?: IRequestOptions) =>
    forwardClientRequest<T>('PATCH', url, body, options),

  delete: <T>(url: string, options?: IRequestOptions) =>
    forwardClientRequest<T>('DELETE', url, undefined, options),
};
