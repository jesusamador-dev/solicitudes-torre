import axios, { AxiosError } from 'axios';
import { DashboardRepository, cleanObjetc, validateFilters, encodeBase64 } from '../../src/data/repositories/dashboard/DashboardRepository';





jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DashboardRepository', () => {
  let repository: DashboardRepository;

  beforeEach(() => {
    repository = new DashboardRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  const API_URL = "http://localhost:8000"

  it('should fetch funnels correctly', async () => {
    const mockData = [
      { idEmbudo: 1, descripcionEmbudo: 'Funnel 1', total: 10, tipo: 1, orden: 1 },
      { idEmbudo: 2, descripcionEmbudo: 'Funnel 2', total: 10, tipo: 2, orden: 2 },

    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await repository.getFunnels();
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
      { descripcionEmbudo: 'Request 1', valor: 10, tipo: 1, porcentaje: { valor: 5, tipo: 1, orientacion: 2 } },
      { descripcionEmbudo: 'Request 2', valor: 20, tipo: 2, porcentaje: { valor: 10, tipo: 2, orientacion: 2 } },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await repository.getDetailCompletedRequests();
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
      { total: 10, detalle: [{ descripcion: 'data 1', subtotal: 10, tipo: 1 }, { descripcion: 'data 2', subtotal: 20, tipo: 2 }] },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await repository.getReencausesWeekly();
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

    const response = await repository.getComparativeReencauses();
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

    const response = await repository.getRequestSheduledToday();
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

    const response = await repository.getSummary();
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


    await repository.getGeographies();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/solicitudes/geographies`);

  });

  it('should return an empty array with a 500 status if there is no response status', async () => {

    const mockError = new Error('Network error') as AxiosError;
    mockedAxios.get.mockRejectedValue(mockError);

    const result = await repository.getFunnels();
    const result2 = await repository.getComparativeReencauses();
    const result3 = await repository.getDetailCompletedRequests();
    const result4 = await repository.getGeographies();
    const result5 = await repository.getReencausesWeekly();
    const result6 = await repository.getRequestSheduledToday();
    const result7 = await repository.getSummary();

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

    const mockError = {
      response: { status: 404 },
    } as AxiosError;
    mockedAxios.get.mockRejectedValue(mockError);


    const result = await repository.getFunnels();
    const result2 = await repository.getComparativeReencauses();
    const result3 = await repository.getDetailCompletedRequests();
    const result4 = await repository.getGeographies();
    const result5 = await repository.getReencausesWeekly();
    const result6 = await repository.getRequestSheduledToday();
    const result7 = await repository.getSummary();


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


  it('should fetch funnels with filters correctly', async () => {
    const mockData = [
      { idEmbudo: 1, descripcionEmbudo: 'Funnel 1', total: 10, tipo: 1, orden: 1 },
      { idEmbudo: 2, descripcionEmbudo: 'Funnel 2', total: 10, tipo: 2, orden: 2 },
    ];
    const filters = { filtroFecha: { numSemana: 12 }, filtroGeografia: { territorios: [1] } };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const response = await repository.getFunnels(validateFilters(filters));
    const funnels = response.data;

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:8000/solicitudes/embudos',
      
    );
    expect(funnels).toHaveLength(2);
    expect(funnels[0].idFunnel).toBe(1);
    expect(funnels[1].funnelDescription).toBe('Funnel 2');
  });

  it('should handle AxiosError without response correctly', async () => {

    const mockError = new Error('Network error') as AxiosError;
    mockError.response = undefined;
    mockedAxios.get.mockRejectedValue(mockError);

    const result = await repository.getFunnels();

    expect(result.status).toBe(500);
    expect(result.data).toEqual([]);
  });
});


describe('cleanObjetc', () => {
  it('should return an object with only non-null and non-empty values', () => {
    const input = {
      a: 'value',
      b: null,
      c: '',
      d: 'anotherValue',
    };

    const expectedOutput = {
      a: 'value',
      d: 'anotherValue',
    };

    const result = cleanObjetc(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should return null if all values are null or empty', () => {
    const input = {
      a: null,
      b: null,
      c: '',
    };

    const result = cleanObjetc(input);
    expect(result).toBeNull();
  });

  it('should return the same object if no values are null or empty', () => {
    const input = {
      a: 'value',
      b: 'anotherValue',
    };

    const result = cleanObjetc(input);
    expect(result).toEqual(input);
  });
});


describe('validateFilters', () => {
  it('should return a Base64 encoded string with valid filters', () => {
    const filters = {
      filtroFecha: {
        numSemana: null,
        anioSemana: 2024,
        fechaFinSemanas: null,
        fechaFinAnio: null,
      },
      filtroGeografia: {
        Cuadrillas: null,
        Cuarteles: null,
        Empleados: null,
        Gerencias: 'Sales',
        Regiones: null,
        Territorios: null,
        Todos: null,
      },
    };

    const result = validateFilters(filters);

    const expectedOutput = encodeBase64(JSON.stringify({
      filtroFecha: { anioSemana: 2024 },
      filtroGeografia: { Gerencias: 'Sales' },
    }))
    expect(result).toEqual(expectedOutput);

  });

  it('should return null if all filters are empty or null', () => {
    const filters = {
      filtroFecha: {
        numSemana: null,
        anioSemana: null,
        fechaFinSemanas: null,
        fechaFinAnio: null,
      },
      filtroGeografia: {
        Cuadrillas: null,
        Cuarteles: null,
        Empleados: null,
        Gerencias: null,
        Regiones: null,
        Territorios: null,
        Todos: null,
      },
    };

    const result = validateFilters(filters);
    expect(result).toBeNull();
  });

  it('should return a Base64 encoded string with only filtroFecha if filtroGeografia is null', () => {
    const filters = {
      filtroFecha: {
        numSemana: 42,
        anioSemana: 2024,
        fechaFinSemanas: null,
        fechaFinAnio: null,
      },

    };

    const result = validateFilters(filters);
    const expectedOutput = encodeBase64(JSON.stringify({
      filtroFecha: {
        numSemana: 42,
        anioSemana: 2024,
      },
    }))

    expect(result).toEqual(expectedOutput);
  });

  it('should return a Base64 encoded string with only filtroGeografia if filtroFecha is null', () => {
    const filters = {
      filtroFecha: null,
      filtroGeografia: {
        Cuadrillas: null,
        Cuarteles: null,
        Empleados: 'John Doe',
        Gerencias: null,
        Regiones: null,
        Territorios: null,
        Todos: null,
      },
    };

    const result = validateFilters(filters);
    const expectedOutput = encodeBase64(JSON.stringify({
      filtroGeografia: {
        Empleados: 'John Doe',
      },
    }))

    expect(result).toEqual(expectedOutput);
  });
});