import { IDashboardService } from '@/domain/services/IDashboardService';
import { IFunnel } from 'mf_mesacyc_dashboards_common/Funnel';
import { IRequest } from 'mf_mesacyc_dashboards_common/Request';
import { IReencauce } from 'mf_mesacyc_dashboards_common/Reencauce';
import { IReencauceComparativeData } from 'mf_mesacyc_dashboards_common/ReencauceComparative';
import { IRequestSheduledDetail,
  RequestSheduledDetail,
  SolicitudAgendada,
 } from 'mf_mesacyc_dashboards_common/RequestSheduledDetail';
import { ISummary } from 'mf_mesacyc_dashboards_common/Summary';
import { IGeography } from 'mf_mesacyc_dashboards_common/Geography';
import { DashboardRepository } from '@/data/repositories/dashboard/DashboardRepository';
import { IFilter } from 'mf_mesacyc_dashboards_common/IFilter';
import { IWeek } from 'mf_mesacyc_dashboards_common/Week';


export default class DashboardService implements IDashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getFunnels(token: string, filters: IFilter): Promise<{status: number, data: IFunnel[]}> {
    return this.dashboardRepository.getFunnels(token, filters);
  }

  async getDetailCompletedRequests(token: string, filters: IFilter): Promise<{status: number, data: IRequest[]}> {
    return this.dashboardRepository.getDetailCompletedRequests(token, filters);
  }

  async getReencausesWeekly(token: string, filters: IFilter): Promise<{status: number, data: IReencauce}> {
    return this.dashboardRepository.getReencausesWeekly(token, filters);
  }

  async getComparativeReencauses(token: string, filters: IFilter): Promise<{status: number, data: IReencauceComparativeData[]}> {
    return this.dashboardRepository.getComparativeReencauses(token, filters);
  }

  async getRequestSheduledToday(token: string, filters: IFilter): Promise<{ status: number, data: IRequestSheduledDetail }> {
    const { status, data } = await this.dashboardRepository.getRequestSheduledToday(token, filters);
    data.description = data.description.replace('%numSolicitudes', data.value);
    return {
        status: status,
        data: data
    };
  }

  async getSummary(token: string, filters: IFilter): Promise<{status: number, data: ISummary}> {
    return this.dashboardRepository.getSummary(token, filters);
  }

  async getGeographies(token:string): Promise<{status: number, data: IGeography}> {
    return this.dashboardRepository.getGeographies(token);
  }

  async getWeeks(token:string): Promise<{status: number, data: IWeek}>{
    return this.dashboardRepository.getWeeks(token);
  }

}
