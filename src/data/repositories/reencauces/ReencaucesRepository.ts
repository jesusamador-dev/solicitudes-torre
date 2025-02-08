import {axiosGlobal, AxiosError} from 'mf_mesacyc_dashboards_common/axios';
import {IReencauceService} from '@/domain/repositories/reencauce/IReencauceService';
import {jwtDecode} from 'jwt-decode';
import {IFilter} from 'mf_mesacyc_dashboards_common/IFilter';
//modelos
import { ITotalRequestReencauzadas, TotalRequestReencauzadasApiResponse, TotalRequestReencauzadasModel } from 'mf_mesacyc_dashboards_common/ReencauceTotalRequestReencauzadas';
import { IReencauceAppointment, ReencauceAppointment, ReencauceAppointmentModel, } from 'mf_mesacyc_dashboards_common/ReencauceAppointment';
import { IReencauceMotive, ReencauceMotive, ReencauceMotiveModel } from 'mf_mesacyc_dashboards_common/ReencauceMotive';
import { ITransformedTab, TerritoryRankingRequest, TerritoryTopModel } from 'mf_mesacyc_dashboards_common/ReencauceRanking'
import { IReencauceTerritoryData, ReencauceTerritories, ReencauceTerritoryModel } from 'mf_mesacyc_dashboards_common/ReencauceTerritory';
import { IDonout, ReencauceDetailChart, ReencauceDetailChartModel } from 'mf_mesacyc_dashboards_common/ReencauceDetailChart'
import { TocaronReencauceModel,TocaronReencauceApiResponse, ITocaronReencauce, } from  'mf_mesacyc_dashboards_common/ReencauceTocaronReencauce'
import { processParams, cleanObject } from '../dashboard/DashboardRepository';
import { IReencauceComparativeData, ReencauceComparativaData, ReencauceComparative } from 'mf_mesacyc_dashboards_common/ReencauceComparative';
// import { IReencauceAppointment, ReencauceAppointment, ReencauceAppointmentModel } from 'mf_mesacyc_dashboards_common/ReencauceAppointment';
import { WeeklyDoughnutsReencauce, IWeeklyDoughnutsReencauce, WeeklyDoughnutsReencauceModel } from 'mf_mesacyc_dashboards_common/ReencauceWeeklyDoughnutsReencauce';

export const encodeBase64 = (data: any): string => {
  return btoa(data);
};

const proxyUrl = `${process.env.REACT_APP_MIDDLEWARE}cobranza-credito/investigacion-cobranza/ffm/lbd-middleware-seguridadffm/torrecontrol`;
const URL = 'https://674f92d0bb559617b26f8b57.mockapi.io/prete';

// async function unathorized()  {
//   const dataBases = await 
//     window.indexedDB.databases();
//     dataBases.forEach((db) => {
//       if(db.name){
//         window.indexedDB.deleteDatabase(db.name)
//       }
//     })
//     localStorage.removeItem('authStore');
//     window.indexedDB.databases().then((r:IDBDatabaseInfo[]) => {
//       for (var i = 0; i < r.length; i++){
//         const db = r[i]
//         if(db.name){
//           window.indexedDB.deleteDatabase(db.name)
//         }
//       };
//     })
//   window.history.replaceState(null, '', '/dashboards/v1/error/');
//   window.location.href = '/error/';
// }

export async function unauthorized() {
  try {
    const dataBases = await window.indexedDB.databases();

    await Promise.all(
      dataBases.map((db) => {
        if (db.name) {
          return new Promise<void>((resolve) => {
            const deleteRequest = window.indexedDB.deleteDatabase(db.name!);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => resolve(); // No queremos que la función falle si hay un error
            deleteRequest.onblocked = () => resolve(); // En caso de que otra pestaña esté bloqueando el borrado
          });
        }
      })
    );

    // Limpiar localStorage
    localStorage.removeItem('authStore');

    // Redirección
    window.location.href = '/error/';
  } catch (error) {
    console.error('Error al eliminar bases de datos:', error);
  }
}
const errorStatusActions = [{401: () => unauthorized()}];

export class ReencauceRepository implements IReencauceService {
  private readonly apiUrl = URL;
  private readonly BASE__URL = proxyUrl;


  async getTotalRequestReencauzadas(token: string, filters: IFilter): Promise<{status: number; data: ITotalRequestReencauzadas}> {
    try {
      // solicitudes/reencauces/total-solicitudes-reencauzadas
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/total-solicitudes-reencauzadas/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }

      const response: {status: number; data: TotalRequestReencauzadasApiResponse } = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });

      return {status: response.status, data:TotalRequestReencauzadasModel.fromJson(response.data)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getWeeklyReencaucesByAppointment(
    token: string,
    filters: IFilter
  ): Promise<{status: number; data: IReencauceAppointment}> {
    try {
      // const baseUrl = `${this.apiUrl}/reencauce-appointment`;
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/total-reencauce-semanal/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }
      const response: {status: number; data: ReencauceAppointment} = await axiosGlobal.post(
        `${baseUrl}`,
        body,
        {headers: {Authorization: `Bearer ${token}`}}
      );

      return {status: response.status, data: ReencauceAppointmentModel.fromJson(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getTopsWithTabs(token: string, filters: IFilter, geographyLevel: number): Promise<{status: number; data: ITransformedTab}> {
    try {
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/reencauce-ranking/`;
      const params = processParams(token, false, filters, geographyLevel)
      const body = {
        data: params
      }

      const response: {status: number; data: TerritoryRankingRequest} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });

      return {status: response.status, data: TerritoryTopModel.fromJsonArray(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getReencauceByMotive(
    token: string,
    filters: IFilter
  ): Promise<{status: number; data: IReencauceMotive[]}> {
    try {
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/reencauce-motivo/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }

      const response: {status: number; data: ReencauceMotive} = await axiosGlobal.post(baseUrl, body, {
        headers: {Authorization: `Bearer ${token}`},
      });

      return {status: response.status, data: ReencauceMotiveModel.fromJsonArray(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error('Error en getReencauceByMotive:', error.message);

      if (!error?.response?.status) {
        return {status: 500, data: []};
      }

      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getReencauceByGeography(
    token: string,
    filters: IFilter,
    geographyLevel:number
  ): Promise<{status: number; data: IReencauceTerritoryData}> {
    try {
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/reencauce-por-territorio/`;
      const params = processParams(token, false, filters, geographyLevel)
      const body = {
        data: params
      }
      const response: {status: number; data: ReencauceTerritories} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return {status: response.status, data: ReencauceTerritoryModel.fromJson(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getChartline(token: string, filters: IFilter): Promise<{status: number; data: IReencauceComparativeData}> {
    try {

      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/comparativo-solicitudes-reencauzadas/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }
      const response: {status: number; data: []} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });

      return {status: response.status, data: ReencauceComparative.fromJson(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getDoughnuts(token: string, filters: IFilter): Promise<{status: number; data: IDonout}> {
    try {
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauses-semanal/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }
      const response: {status: number; data: ReencauceDetailChart} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });
      console.log(response)
      return {status: response.status, data: ReencauceDetailChartModel.fromJsonArray(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  // TOCAN REENCAUCE PAGE

  
  async getWeeklyAppointmentReencauce(token: string, filters: IFilter): Promise<{status: number; data: IReencauceAppointment}> {
    try {
      //solicitudes/reencauces/total-pasaron-reencauce-semanal
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/total-pasaron-reencauce-semanal/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }

      const response: {status: number; data: ReencauceAppointment} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });

      return {status: response.status, data:ReencauceAppointmentModel.fromJson(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }
  
  async getWeeklyDoughtnutsReencauce(token: string, filters: IFilter): Promise<{status: number; data: IWeeklyDoughnutsReencauce}> {
    try {
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/detalle-solicitudes-reencauzadas/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }
      const response: {status: number; data: WeeklyDoughnutsReencauce} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });

      return {status: response.status, data:WeeklyDoughnutsReencauceModel.fromJson(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }

  async getTocaronReencauce(token: string, filters: IFilter): Promise<{status: number; data: ITocaronReencauce}> {
    try {
      const baseUrl = `${this.BASE__URL}/solicitudes/reencauces/solicitudes-tocaron-reencauce/`;
      const params = processParams(token, false, filters)
      const body = {
        data: params
      }
      const response: {status: number; data: []} = await axiosGlobal.post(`${baseUrl}`, body, {
        headers: {Authorization: `Bearer ${token}`},
      });
      return {status: response.status, data: TocaronReencauceModel.fromJsonArray(response.data.resultado)};
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (!error?.response?.status) {
        return {status: 500, data: []};
      }
      errorStatusActions[error.response.status];
      return {status: error.response.status, data: []};
    }
  }
}
