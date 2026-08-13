import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '../lib/api';
import { EventProvider } from '../features/events/event-provider';
import { EventSelector } from './event-selector';
const events = [{ id: '550e8400-e29b-41d4-a716-446655440001', name: 'CONEXÃO', year: 2026, status: 'ACTIVE' as const }, { id: '550e8400-e29b-41d4-a716-446655440002', name: 'CONEXÃO', year: 2025, status: 'CLOSED' as const }];
function renderSelector() { const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }); return render(<QueryClientProvider client={queryClient}><EventProvider><EventSelector /></EventProvider></QueryClientProvider>); }
describe('EventSelector', () => { beforeEach(() => { vi.spyOn(api, 'events').mockResolvedValue(events); document.cookie = 'conexao-event-id=; max-age=0; path=/'; }); it('selects the active event returned by the API and persists its UUID', async () => { renderSelector(); expect(await screen.findByText('CONEXÃO 2026')).toBeInTheDocument(); expect(document.cookie).toContain(''); }); it('changes selection and persists the real selected UUID', async () => { const user = userEvent.setup(); renderSelector(); await screen.findByText('CONEXÃO 2026'); await user.click(screen.getByRole('button', { name: /conexão 2026/i })); await user.click(screen.getByText('CONEXÃO 2025')); await waitFor(() => expect(document.cookie).toContain(events[1].id)); }); });
