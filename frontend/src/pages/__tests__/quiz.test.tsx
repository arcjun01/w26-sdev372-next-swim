import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Quiz from '../quiz';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Quiz page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('changes selects and triggers download', () => {
    const createObjectURLSpy = vi.fn(() => 'blob:mock');
    Object.defineProperty(window, 'URL', { value: { createObjectURL: createObjectURLSpy } });
    const clickSpy = vi.fn();
    // mock anchor click
    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = origCreateElement(tagName as any);
      if (tagName === 'a') {
        // @ts-ignore
        el.click = clickSpy;
      }
      return el;
    });

    render(<Quiz />);

    const levelSelect = screen.getAllByRole('combobox')[0];
    const downloadBtn = screen.getByRole('button', { name: /Download Results to View/i });

    fireEvent.change(levelSelect, { target: { value: 'Advanced' } });
    fireEvent.click(downloadBtn);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});
