import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddResource from '../AddResourceForm';
import * as api from '../../services/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AddResourceForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders form and submits, calling addResource and onSuccess', async () => {
    const mockOnSuccess = vi.fn();
    const addResourceSpy = vi.spyOn(api, 'addResource').mockResolvedValue({
      id: 1,
      title: 'Test',
      resource_type: 'Video',
      difficulty_level: 1,
      description: 'desc',
      url: 'https://example.com',
      created_at: '2026-01-01'
    } as any);

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<AddResource onSuccess={mockOnSuccess} />);

    const titleInput = screen.getByPlaceholderText('Resource Title') as HTMLInputElement;
    const descInput = screen.getByPlaceholderText('Description') as HTMLTextAreaElement;
    const urlInput = screen.getByPlaceholderText('URL (https://...)') as HTMLInputElement;
    const submitBtn = screen.getByRole('button', { name: /Add to NextSwim/i });

    fireEvent.change(titleInput, { target: { value: 'Test' } });
    fireEvent.change(descInput, { target: { value: 'desc' } });
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(addResourceSpy).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('✅'));
    });

    // inputs reset
    expect(titleInput.value).toBe('');
  });
});
