import axios, { AxiosError } from 'axios';
import DashboardService from '../../src/data/services/dashboard/DashboardService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const API_URL = "http://localhost:8000"


describe('DashboardService', () => {
  let dashboardService: DashboardService;

  beforeEach(() => {
    dashboardService = new DashboardService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch funnels correctly', async () => {
    const mockData = [
      { idEmbudo: 1, descripcionEmbudo: 'Funnel 1', total: 10, tipo: 1, orden: 1 },
      { idEmbudo: 2, descripcionEmbudo: 'Funnel 2', total: 10, tipo: 2, orden: 2 },

    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await dashboardService.getFunnels();
    const funnels = response.data;
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/embudos`, );
    expect(funnels).toHaveLength(2);
    expect(funnels[0].idFunnel).toBe(1);
    expect(funnels[0].funnelDescription).toBe('Funnel 1');
    expect(funnels[1].idFunnel).toBe(2);
    expect(funnels[1].funnelDescription).toBe('Funnel 2');
  });

  it('should fetch detail completed requests correctly', async () => {
    const mockData = [
      { descripcionEmbudo: 'Request 1', valor: 10, tipo: 1, porcentaje: { valor: 5, tipo: 1, orientacion: 2} },
      { descripcionEmbudo: 'Request 2', valor: 20, tipo: 2, porcentaje: { valor: 10, tipo: 2, orientacion: 2 } },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await dashboardService.getDetailCompletedRequests();
    const requests = response.data;
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/detalle-solicitudes-finalizadas`, );
    expect(requests).toHaveLength(2);
    expect(requests[0].type).toBe(1);
    expect(requests[0].descriptionFunnel).toBe('Request 1');
    expect(requests[0].value).toBe(10);
    expect(requests[1].type).toBe(2);
    expect(requests[1].descriptionFunnel).toBe('Request 2');
    expect(requests[1].value).toBe(20);
    expect(requests[1].percentage.value).toBe(10);
  });

  it('should fetch detail reencauses weekly correctly', async () => {
    const mockData = [
      { total: 10, detalle: [{ descripcion: 'data 1', subtotal: 10, tipo: 1}, { descripcion: 'data 2', subtotal: 20, tipo: 2} ]},
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await dashboardService.getReencausesWeekly();
    const requests = response.data;
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/reencauses-semanal`, );
    expect(requests.details).toHaveLength(2);
    expect(requests.value).toBe(10);
    expect(requests.details[0].description).toBe('data 1');
    expect(requests.details[1].description).toBe('data 2');
  });

  it('should fetch detail comparative reencauses correctly', async () => {
    const mockData = [
      {
        "descripcion": "Semana 16",
        "total": 1000,
        "detalle": [
          {
            "segmento": "Lunes",
            "valor": 73683
          },
          {
            "segmento": "Martes",
            "valor": 80882
          },
          {
            "segmento": "Miercoles",
            "valor": 37509
          },
          {
            "segmento": "Jueves",
            "valor": 96000
          },
          {
            "segmento": "Viernes",
            "valor": 67520
          },
          {
            "segmento": "Sabado",
            "valor": null
          },
          {
            "segmento": "Domingo",
            "valor": null
          }
        ],
        "tipo": 1
      },
      {
        "descripcion": "Semana 15",
        "total": 2000,
        "detalle": [
          {
            "segmento": "Lunes",
            "valor": 57419
          },
          {
            "segmento": "Martes",
            "valor": 1527
          },
          {
            "segmento": "Miercoles",
            "valor": 29612
          },
          {
            "segmento": "Jueves",
            "valor": 74206
          },
          {
            "segmento": "Viernes",
            "valor": 12838
          },
          {
            "segmento": "Sabado",
            "valor": 68205
          },
          {
            "segmento": "Domingo",
            "valor": 48989
          }
        ],
        "tipo": 1
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await dashboardService.getComparativeReencauses();
    const requests = response.data;
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/comparativo-reencauses`, );
    expect(requests).toHaveLength(2);
    expect(requests[0].name).toBe("Semana 16");
    expect(requests[1].name).toBe('Semana 15');
  });
  
  it('should fetch detail request scheduled today correctly', async () => {
    const mockData = [
      {
        "texto": "El dia de hoy tienes 200 solicitudes agendadas*",
        "numSolicitudes": 200,
        "tipo": 1
      }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
  
    const response = await dashboardService.getRequestSheduledToday();
    const requests = response.data;
  
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/agenda-hoy`, );
    expect(requests.value).toBe(200);
    expect(requests.description).toBe('El dia de hoy tienes 200 solicitudes agendadas*');
    expect(requests.type).toBe(1);
  });

    
  it('should fetch summary correctly', async () => {
    const mockData = [
      {
        "comparacion": "0",
        "texto": "versus semana 15  (del 8 al 12 de Abril) ",
        "totalActual": 10000,
        "totalAnterior": 9000,
        "semanaComparacion": 15,
        "rangoComparacion": "del 8 abril del 2024 al 12 de abril del 2024"
      }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
  
    const response = await dashboardService.getSummary();
    const requests = response.data;
  
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/resumen`, );
    expect(requests.description).toBe("Total de solicitudes esta semana");
    expect(requests.value).toBe(10000);
  });

  it('should fetch geographies correctly', async () => {
    const mockData = [
      {
        "texto": "El dia de hoy tienes 200 solicitudes agendadas*",
        "numSolicitudes": 200,
        "tipo": 1
      }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
  
    await dashboardService.getGeographies();
    
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/geographies`);

  });

  it('should return an empty array with a 500 status if there is no response status', async () => {
    // Arrange
    const mockError = new Error('Network error') as AxiosError;
    mockedAxios.get.mockRejectedValue(mockError);
    // Act
    const result = await dashboardService.getFunnels();
    const result2 = await dashboardService.getComparativeReencauses();
    const result3 = await dashboardService.getDetailCompletedRequests();
    const result4 = await dashboardService.getGeographies();
    const result5 = await dashboardService.getReencausesWeekly();
    const result6 = await dashboardService.getRequestSheduledToday();
    const result7 = await dashboardService.getSummary();

    // Assert
    expect(result.status).toBe(500);
    expect(result.data).toEqual([]);
    expect(result2.status).toBe(500);
    expect(result2.data).toEqual([]);
    expect(result3.status).toBe(500);
    expect(result3.data).toEqual([]);
    expect(result4.status).toBe(500);
    expect(result4.data).toEqual(null);
    expect(result5.status).toBe(500);
    expect(result5.data).toEqual(null);
    expect(result6.status).toBe(500);
    expect(result6.data).toEqual(null);
    expect(result7.status).toBe(500);
    expect(result7.data).toEqual(null);
  });

  it('should return an empty array with the correct status code on AxiosError', async () => {
    // Arrange
    const mockError = {
      response: { status: 404 },
    } as AxiosError;
    mockedAxios.get.mockRejectedValue(mockError);

    // Act
    const result = await dashboardService.getFunnels();
    const result2 = await dashboardService.getComparativeReencauses();
    const result3 = await dashboardService.getDetailCompletedRequests();
    const result4 = await dashboardService.getGeographies();
    const result5 = await dashboardService.getReencausesWeekly();
    const result6 = await dashboardService.getRequestSheduledToday();
    const result7 = await dashboardService.getSummary();

    // Assert
    expect(result.status).toBe(404);
    expect(result.data).toEqual([]);
    expect(result2.status).toBe(404);
    expect(result2.data).toEqual([]);
    expect(result3.status).toBe(404);
    expect(result3.data).toEqual([]);
    expect(result4.status).toBe(404);
    expect(result4.data).toEqual(null);
    expect(result5.status).toBe(404);
    expect(result5.data).toEqual(null);
    expect(result6.status).toBe(404);
    expect(result6.data).toEqual(null);
    expect(result7.status).toBe(404);
    expect(result7.data).toEqual(null);
  });

  
});


