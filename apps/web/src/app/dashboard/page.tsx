'use client';
import { AppShell } from '../../components/app-shell';
import { EmptyState } from '../../components/ui/feedback';
import { useSelectedEvent } from '../../features/events/event-provider';
import { Charts, DashboardLoading, EventProgress, KpiCard, OperationalAlert, Operations } from '../../features/dashboard/components';
import { kpis } from '../../features/dashboard/fixtures';
function DashboardContent() { const { selectedEvent, isLoading } = useSelectedEvent(); if (isLoading) return <div className="mx-auto max-w-[1440px] p-4 lg:p-6"><DashboardLoading /></div>; if (!selectedEvent) return <div className="mx-auto max-w-[1440px] p-4 lg:p-6"><EmptyState title="Nenhum evento selecionado" description="Selecione uma edição do CONEXÃO para visualizar os dados." /></div>; const eventName = `${selectedEvent.name} ${selectedEvent.year}`; return <div className="mx-auto max-w-[1440px] space-y-5 p-4 lg:p-6"><div><p className="text-sm font-semibold text-action">{eventName}</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-primary">Visão geral</h1><p className="mt-2 text-slate-600">Acompanhe a situação atual do {eventName}.</p></div><OperationalAlert/><EventProgress/><section aria-label="Indicadores do evento" className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 xl:grid-cols-3">{kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi}/>)}</section><Charts/><Operations/></div>; }
export default function DashboardPage() { return <AppShell><DashboardContent /></AppShell>; }
