import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';
import { describe, it, expect } from 'vitest';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders with the correct type', () => {
    render(<Input type="email" data-testid="email-input" />);
    const input = screen.getByTestId('email-input') as HTMLInputElement;
    expect(input.type).toBe('email');
  });

  it('renders number type', () => {
    render(<Input type="number" data-testid="num-input" />);
    const input = screen.getByTestId('num-input') as HTMLInputElement;
    expect(input.type).toBe('number');
  });

  it('handles value changes', () => {
    render(<Input data-testid="text-input" />);
    const input = screen.getByTestId('text-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'hello' } });
    expect(input.value).toBe('hello');
  });

  it('handles disabled state', () => {
    render(<Input disabled data-testid="disabled-input" />);
    const input = screen.getByTestId('disabled-input');
    expect(input).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="extra-class" data-testid="styled-input" />);
    const input = screen.getByTestId('styled-input');
    expect(input.className).toContain('extra-class');
  });

  it('has correct default styling classes', () => {
    render(<Input data-testid="default-input" />);
    const input = screen.getByTestId('default-input');
    expect(input.className).toContain('rounded-xl');
    expect(input.className).toContain('border');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} data-testid="ref-input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
