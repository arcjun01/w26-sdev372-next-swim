import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Resources from '../resources';
import * as api from '../../services/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Resources page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and displays resource items', async () => {
    const mockData = [
      { id: 1, title: 'R1', resource_type: 'Video', difficulty_level: 2, description: 'd1', url: 'https://a' },
    ];

    vi.spyOn(api, 'getResources').mockResolvedValue(mockData as any);

    render(<Resources />);
    expect(screen.getByText(/Loading resources.../i)).toBeTruthy();

    await waitFor(() => {
    
      expect(screen.getByText('R1')).toBeTruthy();
      expect(screen.getByText(/Type:/i)).toBeTruthy();
    });
  });
});