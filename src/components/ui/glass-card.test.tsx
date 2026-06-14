import { render, screen } from '@testing-library/react';
import { GlassCard } from './glass-card';
import { describe, it, expect } from 'vitest';

describe('GlassCard', () => {
  it('renders children content', () => {
    render(<GlassCard>Card content</GlassCard>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<GlassCard>Default</GlassCard>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain('glass');
    expect(card.className).toContain('rounded-2xl');
    expect(card.className).toContain('p-6');
  });

  it('applies dark variant classes', () => {
    const { container } = render(<GlassCard variant="dark">Dark</GlassCard>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain('glass-dark');
  });

  it('applies light variant classes', () => {
    const { container } = render(<GlassCard variant="light">Light</GlassCard>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain('glass');
    expect(card.className).toContain('text-slate-900');
  });

  it('forwards custom className', () => {
    const { container } = render(
      <GlassCard className="custom-test">Custom</GlassCard>
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain('custom-test');
  });

  it('forwards other HTML attributes', () => {
    render(<GlassCard data-testid="my-card" id="test-card">Content</GlassCard>);
    const card = screen.getByTestId('my-card');
    expect(card).toHaveAttribute('id', 'test-card');
  });
});
