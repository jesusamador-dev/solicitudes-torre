import { ReencauceRepository } from "@/data/repositories/reencauces/ReencaucesRepository";
import { IReencauceService } from "@/domain/repositories/reencauce/IReencauceService";
import { IFilter } from 'mf_mesacyc_dashboards_common/IFilter';

//modelos de las requests 
import { ITotalRequestReencauzadas, TotalRequestReencauzadasApiResponse, TotalRequestReencauzadasModel } from 'mf_mesacyc_dashboards_common/ReencauceTotalRequestReencauzadas';
import { IReencauceAppointment, ReencauceAppointment, ReencauceAppointmentModel } from 'mf_mesacyc_dashboards_common/ReencauceAppointment';
import { IReencauceMotive } from 'mf_mesacyc_dashboards_common/ReencauceMotive';
// import { ITerritoryRankingRequest } from 'mf_mesacyc_dashboards_common/ReencauceRanking'
import { ITransformedTab } from 'mf_mesacyc_dashboards_common/ReencauceRanking'
import { IReencauceTerritories } from 'mf_mesacyc_dashboards_common/ReencauceTerritory';
import { IReencauceDetailChartApiResponse } from 'mf_mesacyc_dashboards_common/ReencauceDetailChart'
import { IWeeklyDoughnutsReencauce } from "mf_mesacyc_dashboards_common/ReencauceWeeklyDoughnutsReencauce"
import { ITocaronReencauce } from  'mf_mesacyc_dashboards_common/ReencauceTocaronReencauce'
import { IReencauceComparativeData, ReencauceComparativaData, ReencauceComparative } from 'mf_mesacyc_dashboards_common/ReencauceComparative';


export default class ReencauceService implements IReencauceService {
  private reencauceRepository: ReencauceRepository;

  constructor() {
    this.reencauceRepository = new ReencauceRepository();
  }
  
  async getTotalRequestReencauzadas(token: string, filters: IFilter): Promise<{status: number, data: []}> {

    return this.reencauceRepository.getTotalRequestReencauzadas(token, filters);
  }

  async getWeeklyReencaucesByAppointment(token: string, filters: IFilter): Promise<{ status: number, data: IReencauceAppointment }> {
    const { status, data } = await this.reencauceRepository.getWeeklyReencaucesByAppointment(token, filters);
    data.description = data.description.replace('(%rangoComparacion)', ` (${data.comparativeText})`);
    return {
        status: status,
        data: data
    };
  }
  
  // async getReprogrammedRequests(token: string, filters: IFilter): Promise<{status: number, data: []}> {
  //   return this.reencauceRepository.getReprogrammedRequests(token, filters);
  // }
  
  async getTopsWithTabs(token: string, filters: IFilter, geographyLevel: number): Promise<{status: number, data: ITransformedTab }> {
    return this.reencauceRepository.getTopsWithTabs(token, filters, geographyLevel);
  }

  async getReencauceByMotive(token: string, filters: IFilter): Promise<{ status: number, data: IReencauceMotive }> {
    const { status, data } = await this.reencauceRepository.getReencauceByMotive(token, filters);
    data[0].text = data[0].text.replace('(%rangoComparacion)', data[0].comparativeText);
    data[1].text = data[1].text.replace('(%rangoComparacion)', data[1].comparativeText);

    return {
        status: status,
        data: data
    };
  }

  async getReencauceByGeography(token: string, filters: IFilter, geographyLevel:number): Promise<{status: number, data: IReencauceTerritories}> {
    return this.reencauceRepository.getReencauceByGeography(token, filters, geographyLevel);
  }
 
  async getChartline(token: string, filters: IFilter): Promise<{status: number, data: IReencauceComparativeData}> {
    return this.reencauceRepository.getChartline(token, filters);
  }

  async getDoughnuts(token: string, filters: IFilter): Promise<{status: number, data: IReencauceDetailChartApiResponse}> {
    return this.reencauceRepository.getDoughnuts(token, filters);
  }
  
  async getWeeklyAppointmentReencauce(token: string, filters: IFilter): Promise<{status: number, data: IReencauceAppointment }> {
    const { status, data } = await this.reencauceRepository.getWeeklyAppointmentReencauce(token, filters);
    data.description = data.description.replace('(%rangoComparacion)', ` (${data.comparativeText})`);
    return {
      status: status,
      data: data
  };
  }

  async getWeeklyDoughtnutsReencauce(token: string, filters: IFilter): Promise<{status: number, data: IWeeklyDoughnutsReencauce}> {
    return this.reencauceRepository.getWeeklyDoughtnutsReencauce(token, filters);
  }

  async getTocaronReencauce(token: string, filters: IFilter): Promise<{status: number, data: ITocaronReencauce}> {
    return this.reencauceRepository.getTocaronReencauce(token, filters);
  }
}