import React, { useMemo, lazy} from 'react';
import DashboardService from '@/data/services/dashboard/DashboardService';
import Skeleton from '@/skeleton/Skeleton';
import ErrorBoundary from 'mf_mesacyc_dashboards_common/ErrorBoundary';
import DSReloadBtn from 'mf_mesacyc_dashboards_common/DSReloadBtn';
import useFetchCriticalData from '@/hooks/dashboard/useFetchCriticalData';
import useFetchData from '@/hooks/dashboard/useFetchData';

const DSCardFunnelRequests = lazy(() => import('mf_mesacyc_dashboards_common/DSCardFunnelRequests'));
const DSCardTotalsByDay = lazy(() => import('mf_mesacyc_dashboards_common/DSCardTotalsByDay'));
const DSCardGroupDonout = lazy(() => import('mf_mesacyc_dashboards_common/DSCardGroupDonout'));
const DSFilters = lazy(() => import('mf_mesacyc_dashboards_common/DSFilters'));
const DSCardTotals = lazy(() => import('mf_mesacyc_dashboards_common/DSCardTotals'));
const DSChartLine = lazy(() => import('mf_mesacyc_dashboards_common/DSChartLine'));
const DSCardRequestsStatistics = lazy(() => import('mf_mesacyc_dashboards_common/DSCardRequestsStatistics'));
const DSErrorBoundaryTemplate = lazy(() => import('mf_mesacyc_dashboards_common/DSErrorBoundaryTemplate'));
import  useAuthStore  from 'mf_mesacyc_dashboards_common/useAuthStore';
import  { useGlobalStore }  from 'mf_mesacyc_dashboards_common/GlobalStore';
import  { useRequestStore }  from 'mf_mesacyc_dashboards_common/RequestStore';

const Dashboard: React.FC = () => {
  const service = useMemo(() => new DashboardService(), []);
  const { geographies, weeks, canReload, updateGlobalStore, geographyLevel } = useGlobalStore();
  const {
    updateRequestStore,
    funnels,
    completedRequests,
    reencauseWekly,
    comparativeReencauses,
    requestSheduledToday,
    summary
  } = useRequestStore();

  const { token } = useAuthStore()
  console.log("NIVEL DE GEO: ", geographyLevel)

  useFetchCriticalData(service, token)

  useFetchData(service, token)

  const changeTimestamp = () => {
    // al cambiar reload a true se ejecutan los fetch
    updateRequestStore({ reload: true})
    updateGlobalStore({timestamp: Date.now(), canReload: false})
  }
  
  return (
    <div className='row g-5 gx-xl-10 mb-5 mb-xl-10'>
      <div className='d-flex flex-row justify-content-between align-items-end mt-4 '>
        <ErrorBoundary statusCodes={[geographies.statusCode, weeks.statusCode]} loader={<Skeleton height={50} />} fallback={<DSErrorBoundaryTemplate height={50} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
          <DSFilters geographies={geographies.data} weeks={weeks.data}/>
        </ErrorBoundary>
        <div>
          <DSReloadBtn disabled={!canReload} handleClick={changeTimestamp}></DSReloadBtn>
        </div>
      </div>

      <div className='col-md-7 col-lg-7 col-xl-7 col-xxl-7' >
        <ErrorBoundary statusCodes={[summary.statusCode]} loader={<Skeleton height={300}/>} fallback={<DSErrorBoundaryTemplate height={300} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
          <DSCardTotals
            total={summary.data?.value}
            title={summary.data?.description}
            link='/detalle'
            caption={`${summary.data?.comparative_text}`}
            badge={`${summary.data?.percentage.value}`}
            type={summary.data?.type}
          />
        </ErrorBoundary>
          <ErrorBoundary statusCodes={[completedRequests.statusCode]} loader={<Skeleton height={300} />} fallback={<DSErrorBoundaryTemplate height={300} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
            <DSCardRequestsStatistics
              title='Solicitudes finalizadas esta semana'
              contabilityStats={completedRequests.data.contabilityStats}
              subStatistics={completedRequests.data.subStatistics}
              statistics={completedRequests.data.statistics}
            />
          </ErrorBoundary>

          <ErrorBoundary statusCodes={[comparativeReencauses.statusCode]} loader={<Skeleton height={300} />} fallback={<DSErrorBoundaryTemplate height={300} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
            <DSChartLine
              series={comparativeReencauses.data}
              title='Solicitudes reencauzadas esta semana'
              className="h-10 mb-3 mb-xl-6"
            />
          </ErrorBoundary>

        <div className='row'>
          <div className='col-md-8 col-lg-8 col-xl-8 col-xxl-8'>

            <ErrorBoundary statusCodes={[reencauseWekly.statusCode]} loader={<Skeleton height={200} />} fallback={<DSErrorBoundaryTemplate height={200} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
              <DSCardGroupDonout
                title='Reencauces esta semana'
                donouts={reencauseWekly.data?.details}
                total={reencauseWekly.data?.value}
              />
            </ErrorBoundary>

          </div>
          <div className='col-md-4 col-lg-4 col-xl-4 col-xxl-4' data-testid={'skeleton'}>
              <ErrorBoundary statusCodes={[requestSheduledToday.statusCode]} loader={<Skeleton height={200} />} fallback={<DSErrorBoundaryTemplate height={200} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
                  <DSCardTotalsByDay
                    title='El día de hoy tienes '
                    caption={`${requestSheduledToday.data?.value} solicitudes agendadas`}
                    link=''
                  />
              </ErrorBoundary>
          </div>
        </div>
      </div>
      <div className='col-md-5 col-lg-5 col-xl-5 col-xxl-5'>
        <ErrorBoundary statusCodes={[funnels.statusCode, summary.statusCode]} loader={<Skeleton height={700} />} fallback={<DSErrorBoundaryTemplate height={700} title={'Esta funcion no se encuentra disponible en este momento.'}/>}>
          <DSCardFunnelRequests
            title='Detalle de solicitudes totales esta semana'
            data={funnels.data}
            weeklySummary={summary.data}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Dashboard;

