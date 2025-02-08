import React, {Suspense} from 'react';
import '@testing-library/jest-dom';
import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import RouterSolicitudes from '../../src/router/router';

const mockedSuspense = Suspense as jest.Mocked<typeof Suspense>;

jest.mock(
  'mf_mesacyc_dashboards_common/ErrorLayout',
  () =>
    ({children, ...props}) =>
      (
        <div data-testid='ds-route-error' {...props}>
          Error
        </div>
      ),
  {virtual: true}
);
jest.mock(
  '../../src/presentation/pages/Dashboard',
  () =>
    ({children, ...props}) =>
      (
        <div data-testid='ds-route-dashboard' {...props}>
          Dashboard
        </div>
      ),
  {virtual: true}
);

describe('RouterSolicitudes', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/dashboards/v1/');
  });

  afterEach(() => {
    window.history.pushState({}, '', '/dashboards/v1/');
  });

  it('should render the Dashboard component when the path is "/"', async () => {
    window.history.pushState({}, '', '/dashboards/v1/solicitudes/');
    render(
      <MemoryRouter initialEntries={[`/`]}>
        <RouterSolicitudes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
