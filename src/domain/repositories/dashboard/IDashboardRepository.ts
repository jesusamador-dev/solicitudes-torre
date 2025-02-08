import { IFunnel } from 'mf_mesacyc_dashboards_common/Funnel';
import { IReencauce } from 'mf_mesacyc_dashboards_common/Reencauce';
import { IReencauceComparativeData } from 'mf_mesacyc_dashboards_common/ReencauceComparative';
import { IRequest } from 'mf_mesacyc_dashboards_common/Request';
import { IRequestSheduledDetail } from 'mf_mesacyc_dashboards_common/RequestSheduledDetail';
import { ISummary } from 'mf_mesacyc_dashboards_common/Summary';
import { IGeography } from 'mf_mesacyc_dashboards_common/Geography';
import { IWeek } from 'mf_mesacyc_dashboards_common/Week';
import { IFilter } from 'mf_mesacyc_dashboards_common/IFilter';

export interface IDashboardRepository {      
    getFunnels(token: string, filters: IFilter): Promise<{status: number, data: IFunnel[]}>; // embudos
    getDetailCompletedRequests(token: string, filters: IFilter): Promise<{status: number, data: IRequest[]}>; // detalle-solicitudes-finalizadas
    getReencausesWeekly(token: string, filters: IFilter): Promise<{status: number, data: IReencauce}>; // reencauses-semanal
    getComparativeReencauses(token: string, filters: IFilter): Promise<{status: number, data: IReencauceComparativeData[]}>; // comparativo-reencauses
    getRequestSheduledToday(token: string, filters: IFilter): Promise<{status: number, data: IRequestSheduledDetail}>; // agenda-hoy
    getSummary(token: string, filters: IFilter): Promise<{status: number, data: ISummary}>; // resumen
}