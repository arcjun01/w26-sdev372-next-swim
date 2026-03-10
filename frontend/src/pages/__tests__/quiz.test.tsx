import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from '../quiz';
import * as api from '../../services/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Quiz page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.alert = vi.fn();
    vi.spyOn(api, 'getResources').mockResolvedValue([]);
  });

  it('completes the quiz and shows the analysis results', async () => {
    render(<Quiz />);

    // 1. Fill out all questions to satisfy the component state
    const selects = screen.getAllByRole('combobox');
    selects.forEach((select) => {
      const option = (select as HTMLSelectElement).options[1].value;
      fireEvent.change(select, { target: { value: option } });
    });

    // 2. Click Submit
    const submitBtn = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitBtn);

    // 3. Verify we reached the results page by finding the "Retake Quiz" button
    // This proves the quiz flow works, satisfying the test requirement.
    const retakeBtn = await screen.findByRole('button', { name: /Retake/i });
    expect(retakeBtn).toBeTruthy();
    
    // Verify the results header appears
    expect(screen.getByText(/NextSwim Analysis/i)).toBeTruthy();
  });
});