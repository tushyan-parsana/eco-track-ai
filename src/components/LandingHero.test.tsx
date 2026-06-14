import { render, screen } from '@testing-library/react';
import LandingHero from './LandingHero';
import { vi, describe, it, expect } from 'vitest';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, ...validProps } = props;
      void initial; void animate; void exit; void transition;
      return <div {...validProps}>{children}</div>;
    },
    h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, ...validProps } = props;
      void initial; void animate; void exit; void transition;
      return <h1 {...validProps}>{children}</h1>;
    },
    p: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, ...validProps } = props;
      void initial; void animate; void exit; void transition;
      return <p {...validProps}>{children}</p>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('LandingHero', () => {
  it('renders the main heading', () => {
    render(<LandingHero />);
    expect(screen.getByText(/Track Your Carbon Footprint with/i)).toBeInTheDocument();
    expect(screen.getByText(/AI-Powered Insights/i)).toBeInTheDocument();
  });

  it('renders the subtitle text', () => {
    render(<LandingHero />);
    expect(
      screen.getByText(/Measure your environmental impact/i)
    ).toBeInTheDocument();
  });

  it('renders the CTA button linking to /calculator', () => {
    render(<LandingHero />);
    const ctaLink = screen.getByRole('link', { name: /Start Tracking/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute('href', '/calculator');
  });

  it('renders all three feature cards', () => {
    render(<LandingHero />);
    expect(screen.getByText('Instant Calculation')).toBeInTheDocument();
    expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Goal Tracking')).toBeInTheDocument();
  });

  it('renders feature card descriptions', () => {
    render(<LandingHero />);
    expect(screen.getByText(/real-time footprint analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalized, actionable steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Set targets, earn badges/i)).toBeInTheDocument();
  });

  it('renders the version badge', () => {
    render(<LandingHero />);
    expect(screen.getByText(/EcoTrack AI v2.0 is now live/i)).toBeInTheDocument();
  });
});
