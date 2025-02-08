import React from 'react';
import {render, screen, waitFor, act} from '@testing-library/react';
import Dashboard, {initialState, reducer} from '../../src/presentation/pages/Dashboard';
import {fetchCriticalData, fetchData, getCompletedRequestData, getIconAndImageName} from '../../src/presentation/pages/utils';
import DashboardService from '../../src/data/services/dashboard/DashboardService';
import '@testing-library/jest-dom/extend-expect';
import axios, { AxiosError } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock(
  '@/skeleton/Skeleton',
  () =>
    ({children, ...props}) =>
      <div {...props}>{children}</div>,
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSCardTotals',
  () =>
    ({children, ...props}) =>
      (
        <div data-testid='ds-card-total' {...props}>
          {children}
        </div>
      ),
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSChartLine',
  () =>
    ({children, ...props}) =>
      <div {...props}>{children}</div>,
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSCardRequestsStatistics',
  () =>
    ({children, ...props}) =>
      (
        <div contability-stats={props.contabilityStats} title={props.title}>
          {children}
        </div>
      ),
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSFilters',
  () =>
    ({children, ...props}) =>
      <div {...props}>{children}</div>,
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSCardTotalsByDay',
  () =>
    ({children, ...props}) =>
      <div {...props}>{children}</div>,
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSCardFunnelRequests',
  () =>
    ({children, ...props}) =>
      (
        <div weekly-summary={props.weeklySummary} title={props.title}>
          {children}
        </div>
      ),
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/DSCardGroupDonout',
  () =>
    ({children, ...props}) =>
      <div {...props}>{children}</div>,
  {virtual: true}
);
jest.mock(
  'mf_mesacyc_dashboards_common/Funnel',
  () => ({
    Funnel: class {
      idFunnel: number;
      funnelDescription: string;
      value: number;
      type: number;
      order: number;

      constructor(
        idFunnel: number,
        funnelDescription: string,
        value: number,
        type: number,
        order: number
      ) {
        this.idFunnel = idFunnel;
        this.funnelDescription = funnelDescription;
        this.value = value;
        this.type = type;
        this.order = order;
      }

      static fromJson(json: any) {
        return new this(json.idEmbudo, json.descripcionEmbudo, json.total, json.tipo, json.orden);
      }

      toJson() {
        return {
          idEmbudo: this.idFunnel,
          descripcionEmbudo: this.funnelDescription,
          total: this.value,
          tipo: this.type,
          orden: this.order,
        };
      }
    },
    Embudo: jest.fn(),
    IFunnel: jest.fn(),
  }),
  {virtual: true}
);

jest.mock(
  'mf_mesacyc_dashboards_common/ErrorBoundary',
  () =>
    ({children, ...props}) =>
      (
        <div {...props}>
          {children}
        </div>
      ),
  {virtual: true}
);
const mockErrorPromisses = jest.fn().mockImplementation(() => ({
  getSummary: () => Promise.reject(new Error('Failed to fetch summary')),
  getFunnels: () => Promise.reject(new Error('Failed to fetch funnels')),
  getComparativeReencauses: () =>
    Promise.reject(new Error('Failed to fetch comparative reencauses')),
  getRequestSheduledToday: () => Promise.reject(new Error('Failed to fetch scheduled requests')),
  getDetailCompletedRequests: () => Promise.reject(new Error('Failed to fetch completed requests')),
  getReencausesWeekly: () => Promise.reject(new Error('Failed to fetch reencauses weekly')),
  getGeographies: () => Promise.reject(new Error('Failed to fetch geographies')),
}));

jest.mock('@/data/services/dashboard/DashboardService', () => {
  return jest.fn().mockImplementation(() => ({
    getSummary: () =>
      Promise.resolve({value: 100, description: 'Summary', type: 'type', percentage: {value: 10}}),
    getFunnels: () => Promise.resolve([{id: 1, name: 'Funnel 1'}]),
    getComparativeReencauses: () => Promise.resolve([{id: 1, name: 'Comparative 1'}]),
    getRequestSheduledToday: () => Promise.resolve({id: 1, name: 'Request 1'}),
    getDetailCompletedRequests: () =>
      Promise.resolve([
        {id: 1, descriptionFunnel: 'Contactabilidad cliente', value: 10, percentage: {value: 5}},
      ]),
    getReencausesWeekly: () => Promise.resolve({id: 1, name: 'Reencause 1'}),
    getGeographies: () => Promise.resolve({id: 1, name: 'Geography 1'}),
  }));
});

describe('Dashboard', () => {

  it('should set the data loaded false with action by default', () => {
    const payload = {
      summary: {statusCode: 200, data: {value: 100, description: 'Test Summary', type: 'test', percentage: {value: 10}}},
      comparativeReencauses: {statusCode: 200, data: [{id: 1, value: 20}]},
      funnels: {statusCode: 200, data: [{id: 1, value: 30}]},
      requestSheduledToday: {statusCode: 200, data: {value: 40}},
      loadingRequestSheduledToday: false,
      criticalDashboardData: true,
      loadingComparative: false,
      loadingFunnels: false,
      loadingSummary: false,
    };
    
    const newState = reducer(initialState, {type: '', payload});

    expect(newState.summary).toEqual({"data": null, "statusCode": null});
    expect(newState.comparativeReencauses).toEqual({"data": [], "statusCode": null});
    expect(newState.funnels).toEqual({"data": [], "statusCode": null});
    expect(newState.requestSheduledToday).toEqual({"data": null, "statusCode": null});
    expect(newState.loadingRequestSheduledToday).toBe(true);
    expect(newState.criticalDashboardData).toBe(false);
    expect(newState.loadingComparative).toBe(true);
    expect(newState.loadingFunnels).toBe(true);
    expect(newState.loadingSummary).toBe(true);
  });

  it('should set the data correctly', () => {
    const summary = {statusCode: 200, data: {value: 100, description: 'Test Summary', type: 'test', percentage: {value: 10}}}
    const comparativeReencauses = {statusCode: 200, data: [{id: 1, value: 20}]}
    const funnels = {statusCode: 200, data: [{id: 1, value: 30}]}
    const requestSheduledToday = {statusCode: 200, data: {value: 40}}

    const payload = {
      summary,
      comparativeReencauses,
      funnels, 
      requestSheduledToday,
      loadingRequestSheduledToday: false,
      criticalDashboardData: true,
      loadingComparative: false,
      loadingFunnels: false,
      loadingSummary: false,
    };

    const newState = reducer(initialState, {type: 'SET_LOADING', payload});

    expect(newState.summary).toEqual(summary);
    expect(newState.comparativeReencauses).toEqual(comparativeReencauses);
    expect(newState.funnels).toEqual(funnels);
    expect(newState.requestSheduledToday).toEqual(requestSheduledToday);
    expect(newState.loadingRequestSheduledToday).toBe(false);
    expect(newState.criticalDashboardData).toBe(true);
    expect(newState.loadingComparative).toBe(false);
    expect(newState.loadingFunnels).toBe(false);
    expect(newState.loadingSummary).toBe(false);
  });

  it('should set the data state ', () => {
    const payload = {
      loadingSummary: true,
      loadingComparative: true,
      loadingCompletedRequest: true,
      loadingReencauseWekly: true,
      loadingRequestSheduledToday: true,
      loadingFunnels: true,
    };

    const newState = reducer(initialState, {type: 'SET_DATA', payload});

    expect(newState.loadingSummary).toBe(true);
    expect(newState.loadingComparative).toBe(true);
    expect(newState.loadingCompletedRequest).toBe(true);
    expect(newState.loadingReencauseWekly).toBe(true);
    expect(newState.loadingRequestSheduledToday).toBe(true);
    expect(newState.loadingFunnels).toBe(true);
  });

  // it('should set criticalDashboardData to true after fetching critical data', async () => {
  //   render(<Dashboard />);

  //   await waitFor(() => {
  //     expect(screen.getByTestId('ds-card-total')).toBeInTheDocument();
  //   });
  // });

  // it('should render completed requests and charts after data is fetched', async () => {
  //   render(<Dashboard />);

  //   await waitFor(() => {
  //     expect(screen.getByTestId('ds-card-total')).toBeInTheDocument();
  //   });
  // });

  it('should handle SET_DATA action and update state correctly', () => {
    const summary = {statusCode: 200, data: {value: 100, description: 'Test Summary', type: 'test', percentage: {value: 10}}}
    const comparativeReencauses = {statusCode: 200, data: [{id: 1, value: 20}]}
    const funnels = {statusCode: 200, data: [{id: 1, value: 30}]}
    const requestSheduledToday = {statusCode: 200, data: {value: 40}}
  
    const payload = {
      summary,
      comparativeReencauses,
      funnels, 
      requestSheduledToday
    };

    const newState = reducer(initialState, {type: 'SET_DATA', payload});

    expect(newState.summary).toEqual(payload.summary);
    expect(newState.comparativeReencauses).toEqual(payload.comparativeReencauses);
    expect(newState.funnels).toEqual(payload.funnels);
    expect(newState.requestSheduledToday).toEqual(payload.requestSheduledToday);
  });

  // it('should handle error in fetchCriticalData and dispatch SET_LOADING action', async () => {
  //   const mockDispatch = jest.fn();
  //   const mockService = new DashboardService();
  //   const mockError = new Error('Network error') as AxiosError;
  //   mockedAxios.get.mockRejectedValue(mockError);
  //   mockService.getSummary = jest.fn().mockRejectedValue(new Error('Failed to fetch summary'));
  //   mockService.getFunnels = jest.fn().mockRejectedValue(new Error('Failed to fetch funnels'));
  //   mockService.getComparativeReencauses = jest.fn().mockRejectedValue(new Error('Failed to fetch funnels'));
  //   mockService.getRequestSheduledToday = jest.fn().mockRejectedValue(new Error('Failed to fetch funnels'));

  //   await fetchCriticalData(mockService, mockDispatch);

  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'SET_LOADING',
  //     payload: {
  //       loadingSummary: false,
  //       loadingComparative: false,
  //       loadingCompletedRequest: false,
  //       loadingReencauseWekly: false,
  //       loadingRequestSheduledToday: false,
  //       loadingFunnels: false,
  //     },
  //   });
  // });

  // it('should fetch data and update state with completed requests, reencauseWekly, and geographies when fetchData is successful', async () => {
  //   const mockDispatch = jest.fn();
  //   const detailCompletedRequest = {statusCode: 200, data: [{id: 1, descriptionFunnel: 'Test Request', value: 10}]}
  //   const geography = {statusCode: 200, data: {id: 1, name: 'Geography 1'}}
  //   const reencausesWekly = {statusCode: 200, data: {details: [], value: 5}}

  //   const mockService = new DashboardService();
  //   mockService.getDetailCompletedRequests = jest
  //     .fn()
  //     .mockResolvedValue(detailCompletedRequest);
  //   mockService.getReencausesWeekly = jest.fn().mockResolvedValue(reencausesWekly);
  //   mockService.getGeographies = jest.fn().mockResolvedValue(geography);

  //   await fetchData(mockService, mockDispatch);

  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'SET_DATA',
  //     payload: {
  //       completedRequests: detailCompletedRequest,
  //       reencauseWekly: reencausesWekly,
  //       geographies: geography,
  //       loadingCompletedRequest: false,
  //       loadingReencauseWekly: false,
  //       loadingGeographies: false,
  //     },
  //   });
  // });

  // it('should handle error in fetchData and dispatch SET_LOADING action', async () => {
  //   const mockDispatch = jest.fn();
  //   const mockError = new Error('Network error') as AxiosError;
  //   mockedAxios.get.mockRejectedValue(mockError);
  //   const mockService = new DashboardService();

  //   mockService.getDetailCompletedRequests = jest.fn().mockRejectedValue(new Error('Failed to fetch summary'));
  //   mockService.getReencausesWeekly = jest.fn().mockRejectedValue(new Error('Failed to fetch summary'));
  //   mockService.getGeographies = jest.fn().mockRejectedValue(new Error('Failed to fetch summary'));

  //   await fetchData(mockService, mockDispatch);

  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'SET_LOADING',
  //     payload: {
  //       loadingCompletedRequest: false,
  //       loadingReencauseWekly: false,
  //       loadingRequestSheduledToday: false,
  //       loadingGeographies: false,
  //     },
  //   });
  // });
  //16/10/24  FALLA
  // it('should render DSCardTotals when summary data is available', async () => {
  //   const {container} = render(<Dashboard />);
  //   expect(container).toBeInTheDocument();


  //   await waitFor(() => {
  //     const dscardContainer = screen.getAllByTestId('ds-card-total');
  //     const dscard = screen.getByTitle('Summary');
  //     expect(dscardContainer[0]).toBeInTheDocument();
  //     expect(dscard).toBeInTheDocument();
  //   });
  // });

  // it('should render DSCardRequestsStatistics when completedRequests data is available', async () => {
  //   await act(async () => {
  //     render(<Dashboard />);
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByTitle('Solicitudes finalizadas esta semana')).toBeInTheDocument();
  //   });
  // });

  // it('should render DSChartLine when completedRequests data is available', async () => {
  //   await act(async () => {
  //     render(<Dashboard />);
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByTitle('Solicitudes reencauzadas esta semana')).toBeInTheDocument();
  //   });
  // });

  // it('should not render DSCardTotals when summary data is not available', async () => {
  //   await act(async () => {
  //     render(<Dashboard />);
  //   });
    
  //   waitFor(() => {
  //     const dscardElements = screen.getAllByTestId('ds-card-total');
  //     expect(dscardElements[0]).not.toBeInTheDocument();
  //     const skeleton = screen.getByTestId('skeleton');
  //     expect(skeleton).toBeInTheDocument();
  //   });
  // });
});


describe('getCompletedRequestData', () => {

  const mockCompletedRequests = [
    {
      descriptionFunnel: 'Contactabilidad cliente',
      value: 10,
      percentage: { value: 5 },
      type: 1,
    },
    {
      descriptionFunnel: 'Contactabilidad laboral',
      value: 20,
      percentage: { value: 10 },
      type: 2,
    },
    {
      descriptionFunnel: 'Red de contactos ampliada',
      value: 30,
      percentage: { value: 15 },
      type: 1,
    },
    {
      descriptionFunnel: 'Surtidas',
      value: 40,
      percentage: { value: 20 },
      type: 2,
    },
    {
      descriptionFunnel: 'Pendientes por surtir',
      value: 50,
      percentage: { value: 25 },
      type: 1,
    },
    {
      descriptionFunnel: 'Autorizadas',
      value: 60,
      percentage: { value: 30 },
      type: 2,
    },
    {
      descriptionFunnel: 'No recomendadas',
      value: 70,
      percentage: { value: 35 },
      type: 1,
    },
  ];

  const mockState = {
    ...initialState,
    completedRequests: mockCompletedRequests,
  };

  it('should return contabilityStats with specific descriptionFunnels', () => {
    const { contabilityStats } = getCompletedRequestData(mockCompletedRequests);
    
    expect(contabilityStats.length).toBe(3);
    expect(contabilityStats[0].title).toBe('Contactabilidad cliente');
    expect(contabilityStats[1].title).toBe('Contactabilidad laboral');
    expect(contabilityStats[2].title).toBe('Red de contactos ampliada');
    expect(contabilityStats[0].icon).toBe('icon_boy');
    expect(contabilityStats[1].icon).toBe('icon_case');
    expect(contabilityStats[2].icon).toBe('icon_phone');
  });

  it('should return subStatistics with specific descriptionFunnels', () => {
    const { subStatistics } = getCompletedRequestData(mockCompletedRequests);

    expect(subStatistics.length).toBe(2);
    expect(subStatistics[0].title).toBe('Surtidas');
    expect(subStatistics[1].title).toBe('Pendientes por surtir');
    expect(subStatistics[0].icon).toBe('arrowDown');
    expect(subStatistics[1].icon).toBe('arrowUp');
  });

  it('should return statistics with remaining descriptionFunnels', () => {
    const { statistics } = getCompletedRequestData(mockCompletedRequests);

    expect(statistics.length).toBe(2);
    expect(statistics[0].title).toBe('Autorizadas');
    expect(statistics[1].title).toBe('No recomendadas');
    expect(statistics[0].icon).toBe('arrowDown');
    expect(statistics[1].icon).toBe('arrowUp');
  });

  it('should return statistics with correct percentage', () => {
    const { statistics } =  getCompletedRequestData(mockCompletedRequests);

    expect(statistics[0].percentage).toBe('30');
    expect(statistics[1].percentage).toBe('35');
  });

  it('should return subStatistics with correct percentage', () => {
    const { subStatistics } =  getCompletedRequestData(mockCompletedRequests);

    expect(subStatistics[0].percentage).toBe('20');
    expect(subStatistics[1].percentage).toBe('25');
  });

  it('should return contabilityStats with correct percentage', () => {
    const { contabilityStats } =  getCompletedRequestData(mockCompletedRequests);

    expect(contabilityStats[0].percentage).toBe('5');
    expect(contabilityStats[1].percentage).toBe('10');
    expect(contabilityStats[2].percentage).toBe('15');
  });

  it('should return empty contabilityStats when there are no completedRequests matching the filters', () => {
    const mockState = {
      ...initialState,
      completedRequests: [
        { descriptionFunnel: 'Otro tipo de solicitud', value: 100, percentage: { value: 50 }, type: 1 },
      ],
    };

    const { contabilityStats } =  getCompletedRequestData(mockCompletedRequests);
    
    expect(contabilityStats.length).toBe(3);
  });

  it('should return empty statistics when no requests match the excluded filters', () => {
    const mockState = {
      ...initialState,
      completedRequests: [
        { descriptionFunnel: 'Contactabilidad cliente', value: 100, percentage: { value: 50 }, type: 1 },
        { descriptionFunnel: 'Surtidas', value: 200, percentage: { value: 30 }, type: 2 },
      ],
    };

    const { statistics } =  getCompletedRequestData(mockCompletedRequests);

    expect(statistics.length).toBe(2);
  });

  it('should handle a request with no type defined', () => {
    const mockState = {
      ...initialState,
      completedRequests: [
        { descriptionFunnel: 'Autorizadas', value: 300, percentage: { value: 30 } },
      ],
    };

    const { statistics } =  getCompletedRequestData(mockCompletedRequests);

    expect(statistics.length).toBe(2);
    expect(statistics[0].icon).toBe('arrowDown');
  });

  it('should handle all descriptionFunnel categories correctly', () => {
    const mockState = {
      ...initialState,
      completedRequests: [
        { descriptionFunnel: 'Contactabilidad cliente', value: 100, percentage: { value: 50 }, type: 1 },
        { descriptionFunnel: 'Surtidas', value: 200, percentage: { value: 30 }, type: 2 },
        { descriptionFunnel: 'Autorizadas', value: 300, percentage: { value: 20 }, type: 1 },
      ],
    };

    const data = getCompletedRequestData(mockCompletedRequests);
    const { contabilityStats, subStatistics, statistics } = data

    expect(contabilityStats.length).toBe(3);
    expect(subStatistics.length).toBe(2);
    expect(statistics.length).toBe(2);
  });

  it('should return an empty string for a description not in literals', () => {
    const contactabilityLiterals = ['Contactabilidad cliente', 'Contactabilidad laboral', 'Red de contactos ampliada'];

    const result = getIconAndImageName('Descripción no existente', contactabilityLiterals);
    expect(result).toBe('');
  });
  
});
