import { render } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../pages/Login';

describe('App', () => {
  it('renders login without crashing', () => {
    const qc = new QueryClient();
    const { getByText } = render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(getByText(/TrendVaulta Admin/i)).toBeTruthy();
  });
});
