import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { AIAdvisor } from './AIAdvisor';

describe('AIAdvisor Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with welcome message', () => {
    render(<AIAdvisor />);
    expect(screen.getByText(/Hello! I am your Eco-Advisor AI/)).toBeInTheDocument();
  });

  it('sends user message and displays simulated bot response', () => {
    render(<AIAdvisor />);
    
    // Get chat input via accessibility label
    const input = screen.getByLabelText(/Ask our virtual carbon consultant/i);
    fireEvent.change(input, { target: { value: 'How to reduce car emissions?' } });
    
    // Click send button
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    fireEvent.click(sendBtn);

    // Assert user message is visible in screen
    expect(screen.getByText('How to reduce car emissions?')).toBeInTheDocument();

    // Trigger timers inside act to run simulated AI reply delay and flush React updates
    act(() => {
      vi.runAllTimers();
    });

    // Bot response should contain transport advice
    expect(screen.getByText(/Transportation Tips:/i)).toBeInTheDocument();
  });

  it('triggers bot advice when clicking on preset query chips', () => {
    render(<AIAdvisor />);

    // Click on preset query chip for Energy
    const chipBtn = screen.getByText('Eco Energy Tips');
    fireEvent.click(chipBtn);

    // Assert user message is visible on screen to flush React microtasks
    expect(screen.getByText('Tips for reducing home electricity carbon')).toBeInTheDocument();

    // Trigger timer inside act to run simulated AI reply delay and flush React updates
    act(() => {
      vi.runAllTimers();
    });

    // Bot response should contain home energy advice
    expect(screen.getByText(/Home Energy Tips:/i)).toBeInTheDocument();
  });
});
