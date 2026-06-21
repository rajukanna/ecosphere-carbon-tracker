import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CarbonCalculator } from './CarbonCalculator';
import { DEFAULT_CARBON_DATA } from '../utils/carbonCalculator';

describe('CarbonCalculator Component', () => {
  it('renders primary vehicle type and mileage inputs by default on transportation tab', () => {
    const handleChange = vi.fn();
    render(<CarbonCalculator data={DEFAULT_CARBON_DATA} onChange={handleChange} />);

    // Verification
    expect(screen.getByLabelText(/Primary Vehicle Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Car Mileage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Motorbike Mileage/i)).toBeInTheDocument();
  });

  it('switches tabs and displays corresponding inputs when clicking tab buttons', () => {
    const handleChange = vi.fn();
    render(<CarbonCalculator data={DEFAULT_CARBON_DATA} onChange={handleChange} />);

    // Switch to Energy tab
    const energyTabBtn = screen.getByRole('tab', { name: /Energy/i });
    fireEvent.click(energyTabBtn);

    // Verification of Energy tab inputs
    expect(screen.getByLabelText(/Electricity Consumption/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Natural Gas/i)).toBeInTheDocument();

    // Switch to Diet tab
    const dietTabBtn = screen.getByRole('tab', { name: /Diet/i });
    fireEvent.click(dietTabBtn);

    // Verification of Diet tab inputs
    expect(screen.getByLabelText(/Diet Classification/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Food Waste Levels/i)).toBeInTheDocument();
  });

  it('triggers onChange callback when updating input values', () => {
    const handleChange = vi.fn();
    render(<CarbonCalculator data={DEFAULT_CARBON_DATA} onChange={handleChange} />);

    // Change vehicle type
    const carTypeSelect = screen.getByLabelText(/Primary Vehicle Type/i);
    fireEvent.change(carTypeSelect, { target: { value: 'electric' } });

    expect(handleChange).toHaveBeenCalled();
    const updatedData = handleChange.mock.calls[0][0];
    expect(updatedData.transport.carType).toBe('electric');
  });

  it('hides car mileage input if primary vehicle type is set to none', () => {
    const handleChange = vi.fn();
    const noCarData = {
      ...DEFAULT_CARBON_DATA,
      transport: { ...DEFAULT_CARBON_DATA.transport, carType: 'none' }
    };
    render(<CarbonCalculator data={noCarData} onChange={handleChange} />);

    expect(screen.getByLabelText(/Primary Vehicle Type/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Car Mileage/i)).not.toBeInTheDocument();
  });
});
