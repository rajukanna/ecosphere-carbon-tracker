import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoutePlanner } from './RoutePlanner';

describe('RoutePlanner Component', () => {
  it('renders trip parameter form elements correctly', () => {
    render(<RoutePlanner />);
    expect(screen.getByRole('spinbutton', { name: /Trip Distance/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Frequency/i)).toBeInTheDocument();
  });

  it('updates distance and shows comparison options', () => {
    render(<RoutePlanner />);
    
    const distanceInput = screen.getByRole('spinbutton', { name: /Trip Distance/i });
    fireEvent.change(distanceInput, { target: { value: '250' } });

    // Assert that different transport options are compared and rendered
    expect(screen.getByText('Petrol Car')).toBeInTheDocument();
    expect(screen.getByText('Hybrid Car')).toBeInTheDocument();
    expect(screen.getByText('Electric Car (EV)')).toBeInTheDocument();
    expect(screen.getByText('Bus / Train')).toBeInTheDocument();
    expect(screen.getByText('Bicycle / Walk')).toBeInTheDocument();
    
    // For 250km, Commercial Flight option should be unlocked and displayed
    expect(screen.getByText('Commercial Flight')).toBeInTheDocument();
  });

  it('hides commercial flight option for short distances under 150km', () => {
    render(<RoutePlanner />);
    
    const distanceInput = screen.getByRole('spinbutton', { name: /Trip Distance/i });
    fireEvent.change(distanceInput, { target: { value: '50' } });

    expect(screen.getByText('Petrol Car')).toBeInTheDocument();
    expect(screen.queryByText('Commercial Flight')).not.toBeInTheDocument();
  });
});
