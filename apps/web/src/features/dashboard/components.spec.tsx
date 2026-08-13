import { render, screen } from '@testing-library/react'; import { describe, expect, it } from 'vitest'; import { KpiCard } from './components';
describe('KpiCard', () => { it('renders a KPI label and value', () => { render(<KpiCard label="Aprovados" value="156" tone="success"/>); expect(screen.getByText('156')).toBeInTheDocument(); }); });
