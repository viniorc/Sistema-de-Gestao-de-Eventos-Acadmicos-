import { render, screen } from '@testing-library/react'; import { describe, expect, it } from 'vitest'; import { Button } from './button';
describe('Button', () => { it('renders a disabled loading state', () => { render(<Button loading>Salvar</Button>); expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled(); }); });
