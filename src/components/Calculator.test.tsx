import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from './Calculator';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Calculator', () => {
  const mockRouter = { push: vi.fn() };

  beforeEach(() => {
    (useRouter as unknown as { mockReturnValue: (val: unknown) => void }).mockReturnValue(mockRouter);
    (useSession as unknown as { mockReturnValue: (val: unknown) => void }).mockReturnValue({ data: null });
  });

  it('renders the first step correctly', () => {
    render(<Calculator />);
    expect(screen.getAllByText('Transportation')[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Weekly car miles driven/i)).toBeInTheDocument();
  });

  it('navigates to next step on next click', async () => {
    render(<Calculator />);
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);
    expect(await screen.findByText('Home Energy')).toBeInTheDocument();
  });
});
