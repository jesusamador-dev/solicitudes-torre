import { axiosGlobal, AxiosError } from 'mf_mesacyc_dashboards_common/axios';
import { Embudo, Funnel, IFunnel } from 'mf_mesacyc_dashboards_common/Funnel';
import { IDashboardRepository } from '@/domain/repositories/dashboard/IDashboardRepository';
import { IRequest, Request, Solicitud } from 'mf_mesacyc_dashboards_common/Request';
import { IReencauce, Reencauce, ReencauceRaw } from 'mf_mesacyc_dashboards_common/Reencauce';
import {
  IReencauceComparativeData,
  ReencauceComparativaData,
  ReencauceComparative,
} from 'mf_mesacyc_dashboards_common/ReencauceComparative';
import {
  IRequestSheduledDetail,
  RequestSheduledDetail,
  SolicitudAgendada,
} from 'mf_mesacyc_dashboards_common/RequestSheduledDetail';
import { ISummary, Resumen, Summary } from 'mf_mesacyc_dashboards_common/Summary';
import  {jwtDecode}  from "jwt-decode";
import { IFilter } from 'mf_mesacyc_dashboards_common/IFilter';


export const encodeBase64 = (data: any): string => {
  return btoa(data);
}

export const cleanObject = (obj: IFilter) => {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== '') {
      result[key] = obj[key];
    }
  }
  return Object.keys(result).length > 0 ? result : null;
};


export const processParams = (authToken: string, useNumeroEmpleado: boolean,  filters?: any, geographyLevel?: number) => {
  const cleanDateFilter = cleanObject(filters?.filtroFecha);
  const cleanGeographiesFilter = cleanObject(filters?.filtroGeografia);

  const decodedToken = jwtDecode(authToken)
  //Cuando esto sea true pues voy a usar el numeroEmpleado. O sea cuando use esta funcion en geografia
  const empleadoKey = useNumeroEmpleado ? "numeroEmpleado" : "numEmpleado";
  const empleadoValue = decodedToken.numEmpleado

  const cleanParams: { [key: string]: any, filtroFecha?: any, filtroGeografia?: any } = { [empleadoKey]: empleadoValue }


  if (cleanDateFilter) {
    cleanParams.filtroFecha = cleanDateFilter
  }

  if (cleanGeographiesFilter) {
    let filtro;
    if(cleanGeographiesFilter.Gerencias) {
      filtro = geographyLevel ? { Gerencias: cleanGeographiesFilter.Gerencias,  nivelGeografia: geographyLevel} : { Gerencias: cleanGeographiesFilter.Gerencias}
    } else {
      filtro = geographyLevel ? { Todos: 1, nivelGeografia: geographyLevel} : { Todos: 1 }
    }
    cleanParams.filtroGeografia = filtro;
  }

  if (Object.keys(cleanParams).length === 0) {
    return null
  }
  const paramsJson = JSON.stringify(cleanParams)
  const paramsWithOutSlashes = paramsJson.replace(/\\/g, '');  

  return encodeBase64(paramsWithOutSlashes);
}

const proxyUrl =(`${process.env.REACT_APP_MIDDLEWARE}cobranza-credito/investigacion-cobranza/ffm/lbd-middleware-seguridadffm/torrecontrol`);

function unathorized() {
  localStorage.removeItem('authStore');
  window.history.replaceState(null, "", "/dashboards/v1/error/");
  window.location.href = '/error/'
}

const errorStatusActions = [
  {401: () => unathorized()}
]

export class DashboardRepository implements IDashboardRepository {
  private readonly apiUrl = proxyUrl

  async getFunnels(token: string, filters: IFilter): Promise<{ status: number; data: IFunnel[] }> {
    try {

      const params = processParams(token, false, filters)
      const baseUrl = `${this.apiUrl}/solicitudes/funnel/`
      const body = {
        data: params
      }
      const response: { status: number; data: {resultado: Embudo[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );

      return { status: response.status, data: response.data.resultado.map(Funnel.fromJson) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: [] };
      }
      errorStatusActions[error.response.status];
      return { status: error.response.status, data: [] };
    }
  }

  async getDetailCompletedRequests(token: string, filters: IFilter): Promise<{ status: number; data: IRequest[] }> {
    try {

      const params = processParams(token, false,  filters)
      const baseUrl = `${this.apiUrl}/solicitudes/detalle-solicitudes-finalizadas/`;
      const body = {
        data: params
      }
      const response: { status: number; data: {resultado: Solicitud[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: Request.fromJson(response.data.resultado) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: [] };
      }
      errorStatusActions[error.response.status];
      return { status: error.response.status, data: [] };
    }
  }

  async getReencausesWeekly(token: string, filters: IFilter): Promise<{ status: number; data: IReencauce }> {
    try {

      const params = processParams(token, false, filters)
      const baseUrl = `${this.apiUrl}/solicitudes/reencauses-semanal/`;
      const body = {
        data: params
      }
      const response: { status: number; data: {resultado: ReencauceRaw[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: Reencauce.fromJson(response.data.resultado) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: null };
      }
      errorStatusActions[error.response.status];
      return { status: error.response.status, data: null };
    }
  }

  async getComparativeReencauses(token: string, filters: IFilter): Promise<{ status: number; data: IReencauceComparativeData[] }> {
    try {

      const params = processParams(token, false, filters)
      const baseUrl = `${this.apiUrl}/solicitudes/comparativo-reencauses/`;
      const body = {
        data: params
      }
      const response: { status: number; data: {resultado: ReencauceComparativaData[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: ReencauceComparative.fromJson(response.data.resultado) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: [] };
      }
      errorStatusActions[error.response.status];
      return { status: error.response.status, data: [] };
    }
  }

  async getRequestSheduledToday(token: string, filters: IFilter): Promise<{ status: number; data: IRequestSheduledDetail }> {
    try {

      const params = processParams(token, false, filters);
      const baseUrl = `${this.apiUrl}/solicitudes/solicitudes-dia/`;
      const body = {
        data: params
      }
      const response: { status: number; data: {resultado: SolicitudAgendada[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: RequestSheduledDetail.fromJson(response.data.resultado) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: null };
      }
      errorStatusActions[error.response.status];
      return { status: error.response.status, data: null };
    }
  }

  async getSummary(token: string, filters: IFilter): Promise<{ status: number; data: ISummary }> {
    try {
      const params = processParams(token, false, filters)

      const baseUrl = `${this.apiUrl}/solicitudes/resumen/`;
      const body = {
        data: params
      }
      const response: { status: number; data: {resultado: Resumen[]} } = await axiosGlobal.post(
        `${baseUrl}`, body, { headers: { Authorization: `Bearer ${token}` } }
      );
      return { status: response.status, data: Summary.fromJson(response.data.resultado) };
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return { status: 500, data: null };
      }
      errorStatusActions[error.response.status];
      return { status: error.response.status, data: null };
    }
  }
}
