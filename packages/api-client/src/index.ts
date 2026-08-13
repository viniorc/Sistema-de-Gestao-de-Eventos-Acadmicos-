export type ApiError = { statusCode: number; code: string; message: string; details?: unknown[] };
export type User = { id: string; name: string; email: string; roles: string[] };
export type EventSummary = { id: string; name: string; year: number; status: 'DRAFT' | 'ACTIVE' | 'CLOSED' };

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...init.headers },
    });
    if (!response.ok) throw (await response.json()) as ApiError;
    return response.json() as Promise<T>;
  }
  login(email: string, password: string) { return this.request<User>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); }
  me() { return this.request<User>('/auth/me'); }
  logout() { return this.request<void>('/auth/logout', { method: 'POST' }); }
  forgotPassword(email: string) { return this.request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }); }
  events() { return this.request<EventSummary[]>('/events'); }
}
