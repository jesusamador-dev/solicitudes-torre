//import { IFunnel } from 'mf_mesacyc_dashboards_common/Funnel';
// import { IReencauce } from 'mf_mesacyc_dashboards_common/Reencauce';
// import { IReencauceComparativeData } from 'mf_mesacyc_dashboards_common/ReencauceComparative';
// import { IRequest } from 'mf_mesacyc_dashboards_common/Request';
// import { IRequestSheduledDetail } from 'mf_mesacyc_dashboards_common/RequestSheduledDetail';
// import { ISummary } from 'mf_mesacyc_dashboards_common/Summary';
// import { IGeography } from 'mf_mesacyc_dashboards_common/Geography';
// import { IWeek } from 'mf_mesacyc_dashboards_common/Week';
import { IFilter } from 'mf_mesacyc_dashboards_common/IFilter';
import { ITotalRequestReencauzadas } from 'mf_mesacyc_dashboards_common/ReencauceTotalRequestReencauzadas';
import { IReencauceAppointment  } from 'mf_mesacyc_dashboards_common/ReencauceAppointment';
import { ITransformedTab } from 'mf_mesacyc_dashboards_common/ReencauceRanking'
import { IReencauceMotive, ReencauceMotive, ReencauceMotiveModel } from 'mf_mesacyc_dashboards_common/ReencauceMotive';
import { IReencauceTerritoryData, ReencauceTerritories, ReencauceTerritoryModel } from 'mf_mesacyc_dashboards_common/ReencauceTerritory';
import { IReencauceComparativeData } from 'mf_mesacyc_dashboards_common/ReencauceComparative';
import { IDonout, ReencauceDetailChart, ReencauceDetailChartModel } from 'mf_mesacyc_dashboards_common/ReencauceDetailChart'
import { IReencauceAppointment, ReencauceAppointment, ReencauceAppointmentModel } from 'mf_mesacyc_dashboards_common/ReencauceAppointment';
import { WeeklyDoughnutsReencauce, IWeeklyDoughnutsReencauce, WeeklyDoughnutsReencauceModel } from 'mf_mesacyc_dashboards_common/ReencauceWeeklyDoughnutsReencauce';
import { TocaronReencauceModel,TocaronReencauceApiResponse, ITocaronReencauce, } from  'mf_mesacyc_dashboards_common/ReencauceTocaronReencauce'


export interface IReencauceService {      
    getTotalRequestReencauzadas(token: string, filters: IFilter): Promise<{status: number, data: ITotalRequestReencauzadas}>;
    getWeeklyReencaucesByAppointment(token: string, filters: IFilter): Promise<{status: number, data: IReencauceAppointment}>;
    getTopsWithTabs(token: string, filters: IFilter, geographyLevel: number): Promise<{status: number, data: ITransformedTab}>;
    getReencauceByMotive(token: string, filters: IFilter): Promise<{status: number, data: IReencauceMotive}>;
    getReencauceByGeography(token: string, filters: IFilter, geographyLevel: number): Promise<{status: number, data: IReencauceTerritoryData}>;
    getChartline(token: string, filters: IFilter): Promise<{status: number, data: IReencauceComparativeData}>;
    getDoughnuts(token: string, filters: IFilter): Promise<{status: number, data: IDonout}>;
    getWeeklyAppointmentReencauce(token: string, filters: IFilter): Promise<{status: number, data: IReencauceAppointment}>;
    getTocaronReencauce(token: string, filters: IFilter): Promise<{status: number, data: ITocaronReencauce}>;
    getWeeklyDoughtnutsReencauce(token: string, filters: IFilter): Promise<{status: number, data: IWeeklyDoughnutsReencauce}>;
}
