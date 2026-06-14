import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Calculator from './Calculator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/actions', () => ({
  saveFootprint: vi.fn().mockResolvedValue({ success: true, data: { recordId: '123' } }),
}));

// Framer Motion is problematic in test environments — replace with a passthrough
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

/**
 * Helper: waits for a heading with specific text to appear.
 * This avoids the "multiple elements found" issue caused by the sidebar tabs
 * also containing the same step title text.
 */
async function waitForStepHeading(text: string | RegExp) {
  await waitFor(() => {
    const heading = screen.getByRole('heading', { level: 2, name: text });
    expect(heading).toBeInTheDocument();
  });
}

describe('Calculator', () => {
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockRouter);
    (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: null });
  });

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  it('renders the first step (Transportation) correctly', () => {
    render(<Calculator />);
    expect(screen.getByRole('heading', { level: 2, name: /Transportation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Weekly car miles driven/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Flights per year/i)).toBeInTheDocument();
  });

  it('renders a progress bar with correct ARIA attributes', () => {
    render(<Calculator />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------

  it('navigates to the next step on Next click', async () => {
    render(<Calculator />);
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    await waitForStepHeading(/Home Energy/i);
  });

  it('navigates back on Back click', async () => {
    render(<Calculator />);

    // Go to step 2
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Home Energy/i);

    // Go back
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    await waitForStepHeading(/Transportation/i);
  });

  it('disables the Back button on the first step', () => {
    render(<Calculator />);
    const backButton = screen.getByRole('button', { name: /Back/i });
    expect(backButton).toBeDisabled();
  });

  it('navigates through all input steps', async () => {
    render(<Calculator />);

    // Step 0: Transportation
    expect(screen.getByRole('heading', { level: 2, name: /Transportation/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 1: Energy
    await waitForStepHeading(/Home Energy/i);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 2: Food
    await waitForStepHeading(/Diet & Food/i);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Step 3: Lifestyle
    await waitForStepHeading(/Lifestyle/i);
  });

  // -------------------------------------------------------------------------
  // Form Inputs
  // -------------------------------------------------------------------------

  it('updates car miles input value', () => {
    render(<Calculator />);
    const input = screen.getByLabelText(/Weekly car miles driven/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '150' } });
    expect(input.value).toBe('150');
  });

  it('updates flights input value', () => {
    render(<Calculator />);
    const input = screen.getByLabelText(/Flights per year/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '3' } });
    expect(input.value).toBe('3');
  });

  it('updates electricity input on energy step', async () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Home Energy/i);

    const input = screen.getByLabelText(/Monthly electricity bill/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '100' } });
    expect(input.value).toBe('100');
  });

  it('updates diet type on food step', async () => {
    render(<Calculator />);
    // Navigate to food step
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Home Energy/i);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Diet & Food/i);

    const select = screen.getByLabelText(/Select your primary diet type/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'vegan' } });
    expect(select.value).toBe('vegan');
  });

  // -------------------------------------------------------------------------
  // Results
  // -------------------------------------------------------------------------

  it('shows results with "Sign In to Save" for unauthenticated users', async () => {
    render(<Calculator />);

    // Navigate through all steps using headings
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Home Energy/i);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Diet & Food/i);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Lifestyle/i);

    // Click Calculate Result (step 3 → 4)
    const calcBtn = screen.getByRole('button', { name: /Calculate Result/i });
    fireEvent.click(calcBtn);

    // Results should appear
    await waitFor(() => {
      expect(screen.getByText(/kg CO2e per year/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /Sign In to Save/i })).toBeInTheDocument();
  });

  it('shows "Go to Dashboard" button for authenticated users', async () => {
    (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { user: { id: '1', name: 'Test', email: 'test@test.com' } },
    });

    render(<Calculator />);

    // Navigate through all steps
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Home Energy/i);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Diet & Food/i);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitForStepHeading(/Lifestyle/i);

    // Click Calculate Result
    fireEvent.click(screen.getByRole('button', { name: /Calculate Result/i }));

    // Should show dashboard button
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Go to Dashboard/i })).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Sidebar steps
  // -------------------------------------------------------------------------

  it('renders sidebar step indicators with correct ARIA roles', () => {
    render(<Calculator />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });
});
