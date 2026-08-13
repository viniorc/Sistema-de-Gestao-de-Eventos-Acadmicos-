export type ApiError = { statusCode: number; code: string; message: string; details?: unknown[] };
export type User = { id: string; name: string; email: string; roles: string[] };
export type EventSummary = { id: string; name: string; year: number; status: 'DRAFT' | 'ACTIVE' | 'CLOSED' };
type RequestOptions = { retryAfterRefresh?: boolean; skipRefresh?: boolean };

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async parseError(response: Response): Promise<ApiError> {
    if (response.headers.get('content-type')?.includes('application/json')) return response.json() as Promise<ApiError>;
    return { statusCode: response.status, code: 'REQUEST_FAILED', message: 'Não foi possível concluir a solicitação.' };
  }

  async request<T>(path: string, init: RequestInit = {}, options: RequestOptions = {}): Promise<T | undefined> {
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, credentials: 'include', headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers } });
    const canRefresh = !options.skipRefresh && !options.retryAfterRefresh && !['/auth/login', '/auth/refresh', '/auth/forgot-password'].includes(path);
    if (response.status === 401 && canRefresh) {
      try { await this.request('/auth/refresh', { method: 'POST' }, { skipRefresh: true }); return this.request<T>(path, init, { retryAfterRefresh: true }); } catch { throw await this.parseError(response); }
    }
    if (!response.ok) throw await this.parseError(response);
    if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) return undefined;
    return response.json() as Promise<T>;
  }

  async login(email: string, password: string) { return this.request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }, { skipRefresh: true }); }
  async me() { return this.request<User>('/auth/me'); }
  async logout() { await this.request<void>('/auth/logout', { method: 'POST' }); }
  async refresh() { return this.request<User>('/auth/refresh', { method: 'POST' }, { skipRefresh: true }); }
  async forgotPassword(email: string) { return this.request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }, { skipRefresh: true }); }
  async events() { return (await this.request<EventSummary[]>('/events')) ?? []; }
}
