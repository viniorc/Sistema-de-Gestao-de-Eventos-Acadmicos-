'use client';
import type { EventSummary } from '@conexao/api-client';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../../lib/api';

type EventContextValue = { events: EventSummary[]; selectedEvent?: EventSummary; isLoading: boolean; selectEvent: (event: EventSummary) => void };
const EventContext = createContext<EventContextValue | undefined>(undefined);
const cookieName = 'conexao-event-id';
function cookieValue() { if (typeof document === 'undefined') return undefined; return document.cookie.split('; ').find((item) => item.startsWith(`${cookieName}=`))?.split('=')[1]; }
function chooseInitial(events: EventSummary[]) { const stored = cookieValue(); return events.find((event) => event.id === stored) ?? events.find((event) => event.status === 'ACTIVE') ?? events[0]; }
export function EventProvider({ children }: { children: React.ReactNode }) {
  const { data: events = [], isLoading } = useQuery({ queryKey: ['events'], queryFn: () => api.events(), retry: false });
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(() => cookieValue());
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? chooseInitial(events);
  const selectEvent = (event: EventSummary) => { setSelectedEventId(event.id); document.cookie = `${cookieName}=${encodeURIComponent(event.id)}; path=/; max-age=31536000; samesite=lax`; };
  const value = useMemo(() => ({ events, selectedEvent, isLoading, selectEvent }), [events, selectedEvent, isLoading]);
  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}
export function useSelectedEvent() { const value = useContext(EventContext); if (!value) throw new Error('useSelectedEvent must be used within EventProvider'); return value; }
