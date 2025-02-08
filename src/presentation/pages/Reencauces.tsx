import React,{lazy} from 'react';
import DSChartLine from 'mf_mesacyc_dashboards_common/DSChartLine';
import DSTopsWithTabs from 'mf_mesacyc_dashboards_common/DSTopsWithTabs';
import DSCardByGeography from 'mf_mesacyc_dashboards_common/DSCardByGeography';
import DSCardTotalsByAppointment from 'mf_mesacyc_dashboards_common/DSCardTotalsByAppointment';
import DSCardWithDetails from 'mf_mesacyc_dashboards_common/DSCardWithDetails';
import DSReencauceWeeklyDetail from 'mf_mesacyc_dashboards_common/DSReencauceWeeklyDetail';
import ReencauceService from '../../data/services/reencauce/ReencaucesService';
import Skeleton from '@/skeleton/Skeleton';
import ErrorBoundary from 'mf_mesacyc_dashboards_common/ErrorBoundary';
import DSErrorBoundaryTemplate from 'mf_mesacyc_dashboards_common/DSErrorBoundaryTemplate';
import DSTableReencauces from 'mf_mesacyc_dashboards_common/DSTableReencauces';
import {useMemo, useReducer} from 'react';
import useFetchReencauceData from '@/hooks/reencaucesModule/useFetchReencauceData';
import {useReencauceRequestStore} from 'mf_mesacyc_dashboards_common/ReencauceRequestStore';
import  { useGlobalStore }  from 'mf_mesacyc_dashboards_common/GlobalStore';
import  useAuthStore  from 'mf_mesacyc_dashboards_common/useAuthStore';




const Reencauces = () => {
  const { geographyLevel } = useGlobalStore();
  const service = useMemo(() => new ReencauceService(), []);
  
  const { token } = useAuthStore()
  useFetchReencauceData(service, token)
  const {weeklyAppointment, topsWithTabs, reencauceByMotive, reencauceByGeography, chartline, doughnuts, totalRequestReencauzadas} = useReencauceRequestStore()
  const ErrorBoundaryTitle = 'Esta función no se encuentra disponible en este momento.'

  return (
    // gap-6
    <div className='d-flex flex-column'>
        
        
      <section className='row mb-3 mb-xl-6'>
        <div className='col-4'>
          <ErrorBoundary
            statusCodes={[weeklyAppointment.statusCode]}
            loader={<Skeleton height={400} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={400}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSCardTotalsByAppointment
              total={weeklyAppointment.data?.totalValue}
              title={weeklyAppointment.data?.title}
              badgeCaption={weeklyAppointment.data?.description}
              subtitle={`100% de ${weeklyAppointment.data?.totalValue}`}
              badge={weeklyAppointment.data?.badgeValue}
              type={weeklyAppointment.data?.type}
            />
          </ErrorBoundary>
        </div>
        <div className='col-8 mb-0 mb-xl-0'>
          <ErrorBoundary
            statusCodes={[chartline.statusCode]}
            loader={<Skeleton height={400} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={400}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSChartLine series={chartline?.data} title='Solicitudes reencauzadas esta semana' className="h-100"/>
          </ErrorBoundary>
        </div>
      </section>

      <section className='row mb-3 mb-xl-6'>
        <div className='col-8'>
          <ErrorBoundary
            statusCodes={[reencauceByGeography.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSCardByGeography
              title={reencauceByGeography.data?.title}
              link='/solicitudes/reencauces/reencauzadas/geografias-detalle'
              items={reencauceByGeography.data?.items}
              styleType={reencauceByGeography.data?.styleType}
              maxNumberItems={3}// Este valor determina el numero de elementos que se renderizaran en este componente
            />
          </ErrorBoundary>
        </div>

        <div className='col-4'>
          <ErrorBoundary
            statusCodes={[topsWithTabs.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSTopsWithTabs
              title='Solicitudes reencauzadas esta semana por territorio'
              tabsInfo={topsWithTabs.data}
            />
          </ErrorBoundary>
        </div>
      </section>

      <section className='row mb-3 mb-xl-6'>
        <div className='col'>
          <ErrorBoundary
            statusCodes={[reencauceByMotive.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSCardWithDetails
              title={reencauceByMotive.data[0]?.title}
              subtitle={reencauceByMotive.data[0]?.subtitle}
              total={reencauceByMotive.data[0]?.total}
              caption="El motivo que más reencauces causo fue:"
              type={reencauceByMotive.data[0]?.type}
              captionMotive={reencauceByMotive.data[0]?.captionMotive}
              comparativeText={reencauceByMotive.data[0]?.text}
              badgeValue={reencauceByMotive.data[0]?.badgeValue}
              className=""
            />
          </ErrorBoundary>
        </div>
        <div className='col'>
          <ErrorBoundary
            statusCodes={[reencauceByMotive.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSCardWithDetails
              title={reencauceByMotive.data[1]?.title}
              subtitle={reencauceByMotive.data[1]?.subtitle}
              total={reencauceByMotive.data[1]?.total}
              caption="El motivo que más reencauces causo fue:"
              type={reencauceByMotive.data[1]?.type}
              captionMotive={reencauceByMotive.data[1]?.captionMotive}
              comparativeText={reencauceByMotive.data[1]?.text}
              badgeValue={reencauceByMotive.data[1]?.badgeValue}
              className=""
            />
          </ErrorBoundary>
        </div>
        <div className='col-5'>
          <ErrorBoundary
            statusCodes={[doughnuts.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={ErrorBoundaryTitle}
              />
            }
          >
            <DSReencauceWeeklyDetail
              title='Reencauces esta semana'
              donouts={doughnuts.data?.donuts}
              total={doughnuts.data?.total}
              link='#'
              className='h-100 '
            />
          </ErrorBoundary>
        </div>
      </section>
    </div>
  );
};

export default Reencauces;
