import React, {useEffect, useState, useMemo, useReducer, lazy} from 'react';
import DSCardTotalsByAppointment from 'mf_mesacyc_dashboards_common/DSCardTotalsByAppointment';
import DSReencauceWeeklyDetail from 'mf_mesacyc_dashboards_common/DSReencauceWeeklyDetail';
import Skeleton from '@/skeleton/Skeleton';
import ErrorBoundary from 'mf_mesacyc_dashboards_common/ErrorBoundary';
import DSErrorBoundaryTemplate from 'mf_mesacyc_dashboards_common/DSErrorBoundaryTemplate';
import ReencauceService from '@/data/services/reencauce/ReencaucesService';
import DSReencausesCardsList from 'mf_mesacyc_dashboards_common/DSReencausesCardsList';
import {useReencauceRequestStore} from 'mf_mesacyc_dashboards_common/ReencauceRequestStore';
import  useAuthStore  from 'mf_mesacyc_dashboards_common/useAuthStore';
import useFetchTocaronReencauceData from '@/hooks/reencaucesModule/TocanReencauce/useFetchTocaronReencauceData';

import {useTocaronReencauceRequestStore} from 'mf_mesacyc_dashboards_common/TocaronReencauceRequestStore';


const DSCardGroupDonout = lazy(() => import('mf_mesacyc_dashboards_common/DSCardGroupDonout'));

const TocanReencauce = () => {
    const service = useMemo(() => new ReencauceService(), []);
    const {token} = useAuthStore()  
    useFetchTocaronReencauceData(service, token)

    const {
    weeklyAppointmentReencauce,
    weeklyDoughnutsReencauce,
    tocaronReencauce,
  } = useTocaronReencauceRequestStore();

  console.log("Tocaron Reencauce props:", {
    weeklyAppointmentReencauce,
    weeklyDoughnutsReencauce,
    tocaronReencauce,
  })

  
 
  return (
    <div className='d-flex flex-column'>
    <section className='mb-3 mb-xl-6'>
      <div className='d-flex w-100'>
        <div style={{width: "35%", marginRight: "1.5rem", overflow: "hidden"}}>
          <ErrorBoundary
            statusCodes={[weeklyAppointmentReencauce.statusCode]}
            loader={<Skeleton height={300} />}
            fallback={
              <DSErrorBoundaryTemplate
                height={300}
                title={'Esta funcion no se encuentra disponible en este momento.'}
              />
            }
          >
            <DSCardTotalsByAppointment
              total={weeklyAppointmentReencauce.data?.totalValue}
              title={weeklyAppointmentReencauce.data?.title}
              badgeCaption={weeklyAppointmentReencauce.data?.description}
              subtitle={`100% de ${weeklyAppointmentReencauce.data?.totalValue}`}
              badge={weeklyAppointmentReencauce.data?.badgeValue}
              type={weeklyAppointmentReencauce.data?.type}
            />
          </ErrorBoundary>
        </div>
      
        <div style={{width: "65%"}}>
            <ErrorBoundary
              statusCodes={[weeklyDoughnutsReencauce.statusCode]}
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
      </div>  
      
      <div>
        <DSReencausesCardsList
          data={tocaronReencauce.data}
        />
      </div>

    </section>

  </div>
  );
}
export default TocanReencauce;
