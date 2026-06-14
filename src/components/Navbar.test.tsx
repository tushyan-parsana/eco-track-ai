import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';
import { useSession, signIn, signOut } from 'next-auth/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when unauthenticated', () => {
    beforeEach(() => {
      (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ data: null });
    });

    it('renders the logo and brand name', () => {
      render(<Navbar />);
      expect(screen.getByText('EcoTrack AI')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<Navbar />);
      expect(screen.getByRole('menuitem', { name: 'Calculator' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Dashboard' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Community' })).toBeInTheDocument();
    });

    it('renders Sign In and Get Started buttons', () => {
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
    });

    it('calls signIn when Get Started is clicked', () => {
      render(<Navbar />);
      fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
      expect(signIn).toHaveBeenCalled();
    });

    it('has correct ARIA labels on navigation', () => {
      render(<Navbar />);
      expect(screen.getByRole('navigation', { name: /Main navigation/i })).toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      (useSession as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: { user: { id: '1', name: 'Jane Doe', email: 'jane@test.com' } },
      });
    });

    it('displays the user name', () => {
      render(<Navbar />);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('renders Sign Out button', () => {
      render(<Navbar />);
      expect(screen.getByRole('button', { name: /Sign out/i })).toBeInTheDocument();
    });

    it('calls signOut when Sign Out is clicked', () => {
      render(<Navbar />);
      fireEvent.click(screen.getByRole('button', { name: /Sign out/i }));
      expect(signOut).toHaveBeenCalled();
    });

    it('does not show Sign In or Get Started buttons', () => {
      render(<Navbar />);
      expect(screen.queryByRole('button', { name: /Get Started/i })).not.toBeInTheDocument();
    });
  });
});
