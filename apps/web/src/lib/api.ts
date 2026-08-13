import { ApiClient } from '@conexao/api-client'; export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1');
