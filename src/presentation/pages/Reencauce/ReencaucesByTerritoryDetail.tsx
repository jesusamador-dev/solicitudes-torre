import React, {lazy} from 'react';
import DSChartLine from 'mf_mesacyc_dashboards_common/DSChartLine';
import DSTopsWithTabs from 'mf_mesacyc_dashboards_common/DSTopsWithTabs';
import DSCardByGeography from 'mf_mesacyc_dashboards_common/DSCardByGeography';
import DSCardTotalsByAppointment from 'mf_mesacyc_dashboards_common/DSCardTotalsByAppointment';
import DSCardWithDetails from 'mf_mesacyc_dashboards_common/DSCardWithDetails';
import DSReencauceWeeklyDetail from 'mf_mesacyc_dashboards_common/DSReencauceWeeklyDetail';
import DSReencaucesByTerritoryCount from 'mf_mesacyc_dashboards_common/DSReencaucesByTerritoryCount';
import ReencauceService from '@/data/services/reencauce/ReencaucesService';
import Skeleton from '@/skeleton/Skeleton';
import ErrorBoundary from 'mf_mesacyc_dashboards_common/ErrorBoundary';
import DSErrorBoundaryTemplate from 'mf_mesacyc_dashboards_common/DSErrorBoundaryTemplate';
import DSTableReencauces from 'mf_mesacyc_dashboards_common/DSTableReencauces';
import {useMemo, useReducer} from 'react';
import useFetchReencauceData from '@/hooks/reencaucesModule/useFetchReencauceData';
import {useReencauceRequestStore} from 'mf_mesacyc_dashboards_common/ReencauceRequestStore';
import {useGlobalStore} from 'mf_mesacyc_dashboards_common/GlobalStore';
import useAuthStore from 'mf_mesacyc_dashboards_common/useAuthStore';
import DSRequestsByInvestigation from 'mf_mesacyc_dashboards_common/DSRequestsByInvestigation';
import DSReencauceSemanal from 'mf_mesacyc_dashboards_common/DSReencauceSemanal';
import DSRankingByTerritory from 'mf_mesacyc_dashboards_common/DSRankingByTerritory';
import {useTocaronReencauceRequestStore} from 'mf_mesacyc_dashboards_common/TocaronReencauceRequestStore';
const DSCardGroupDonout = lazy(() => import('mf_mesacyc_dashboards_common/DSCardGroupDonout'));



const Reencauces = () => {
  const service = useMemo(() => new ReencauceService(), []);

  const {token} = useAuthStore();
  useFetchReencauceData(service, token);
  const {
    reprogrammedRequests,
    weeklyAppointment,
    topsWithTabs,
    reencauceByMotive,
    reencauceByGeography,
    chartline,
    doughnuts,
  } = useReencauceRequestStore();
  const ErrorBoundaryTitle = 'Esta función no se encuentra disponible en este momento.';

  const {
      weeklyAppointmentReencauce,
      weeklyDoughnutsReencauce,
      tocaronReencauce,
    } = useTocaronReencauceRequestStore();

  return (
    // gap-6
    <div className=''>
      <section className='row mb-3 mb-xl-6'>
        <div className='col-4'>
          <ErrorBoundary
            statusCodes={[weeklyAppointment.statusCode]}
            loader={<Skeleton height={400} />}
            fallback={<DSErrorBoundaryTemplate height={400} title={ErrorBoundaryTitle} />}
          >
            <DSCardTotalsByAppointment
              total={weeklyAppointment.data?.totalValue}
              title={weeklyAppointment.data?.title}
              badgeCaption={weeklyAppointment.data?.description}
              subtitle={`100% de ${weeklyAppointment.data?.totalValue}`}
              badge={weeklyAppointment.data?.badgeValue}
              type={weeklyAppointment.data?.type}
              styleType='reencaucesByTerritoryDetailPage'
            />
          </ErrorBoundary>
        </div>

        <div className='col-8'>
          <ErrorBoundary
            statusCodes={[reencauceByMotive.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={'Esta funcion no se encuentra disponible en este momento.'}
              />
            }
          >
            <DSCardGroupDonout
                title='Reencauces esta semana'
                donouts={weeklyDoughnutsReencauce.data?.doughnuts}
                total={weeklyDoughnutsReencauce.data?.total}
                link='#'
                // className='h-100'
                needBottomBadge={true}
                styleType="tocanReencaucePage"
              />
          </ErrorBoundary>
        </div>
      </section>

      <section className={'row mb-3 mb-xl-6'}>
        <div className={"col-4"}>
          <ErrorBoundary
            statusCodes={[weeklyAppointment.statusCode]}
            loader={<Skeleton height={400} />}
            fallback={<DSErrorBoundaryTemplate height={400} title={ErrorBoundaryTitle} />}
          >
            <DSRequestsByInvestigation />
          </ErrorBoundary>
        </div>

        
        <div className={"col-6"}>
          <DSReencauceSemanal />

        </div>

        <div className={"col-2"}>
          <DSRankingByTerritory />
        </div>
      </section>

      <section className={"row mb-3 mb-xl-6"}>
              <div className="col">
                <DSTableReencauces 
                // data={mockDataTableReencauces.data}
                // text={mockDataTableReencauces.text}
                // type={mockDataTableReencauces.type}
                // total={mockDataTableReencauces.total}
                // reencauce={mockDataTableReencauces.reencauce}
                />
              </div>
      </section>
      
      <h1>Hello World!</h1>

      {/* <div>
        <DSTableReencauces 
        data={mockDataTableReencauces.data}
        text={mockDataTableReencauces.text}
        type={mockDataTableReencauces.type}
        total={mockDataTableReencauces.total}
        reencauce={mockDataTableReencauces.reencauce}
        />
        </div> */}
    </div>
  );
};

export default Reencauces;
