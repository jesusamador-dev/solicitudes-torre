import {useRequestStore} from 'mf_mesacyc_dashboards_common/RequestStore';
import DashboardService from '@/data/services/dashboard/DashboardService';
import {useEffect} from 'react';
import {initializeCriticalData} from '@/utils/dashboard/initializeCriticalData';
import {useGlobalStore} from 'mf_mesacyc_dashboards_common/GlobalStore';
import {initializeData} from '@/utils/dashboard/initializeData';

const useFetchCriticalData = async (service: DashboardService, token: string) => {
  const {filtroFecha, filtroGeografia, updateGlobalStore, hydrated: globalHydrated} = useGlobalStore();
  const {
    updateRequestStore,
    lastFilterNumWeek,
    lastFilterDate,
    hydrated,
    reload,
    timestamp: timestampRequest,
    lastFilterGerencias
  } = useRequestStore();

  useEffect(() => {

    const waitForRehydration = async () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (useGlobalStore.getState().hydrated) {
            clearInterval(interval);
            resolve(useGlobalStore.getState());
          }
        }, 0);
      });
    };
    waitForRehydration();
    
    const today = new Date().toLocaleDateString().slice(0, 10);
    const FIVE_MINUTES_IN_MS = 5 * 60 * 1000; // 5 minutos en milisegundos
    const currentTime = Date.now();
    const isTimeToReload = currentTime - timestampRequest >= FIVE_MINUTES_IN_MS;
    const hasFilterChanged = lastFilterNumWeek !== filtroFecha.numSemana || lastFilterDate !== filtroFecha.fechaFinSemanas;
    const hasGeographiesChanged = lastFilterGerencias?.length !== filtroGeografia.Gerencias?.length;

    if (globalHydrated && hydrated && (reload || isTimeToReload || hasFilterChanged || hasGeographiesChanged)) {
      initializeCriticalData(updateRequestStore);
      initializeData(updateRequestStore);
      const fetchCriticalData = async () => {
        try {
          const promises = await Promise.allSettled([
            service.getSummary(token, {filtroFecha, filtroGeografia}),
            service.getFunnels(token, {filtroFecha, filtroGeografia}),
            service.getComparativeReencauses(token, {filtroFecha, filtroGeografia}),
            service.getRequestSheduledToday(token, {filtroFecha, filtroGeografia}),
          ]);
   
          const promisesKeys = [
            { key: "summary", default: { status: null, data: null } },
            { key: "funnels", default: { status: null, data: [] } },
            { key: "comparativeReencauses", default: { status: null, data: [] } },
            { key: "requestSheduledToday", default: { status: null, data: null } },
          ];
          
          // Iterar sobre las respuestas de Promise.allSettled y actualizar el store
          promises.forEach((result, index) => {
            const { key, default: defaultValue } = promisesKeys[index];
            const response = result.status === "fulfilled" ? result.value : defaultValue;

            updateRequestStore({
              [key]: {
                statusCode: response.status,
                data: response.data,
              },
            });
          });

          updateRequestStore({
            criticalDashboardData: true,
            timestamp: currentTime,
            lastUpdate: today,
            lastFilterNumWeek: filtroFecha.numSemana,
            lastFilterDate: filtroFecha.fechaFinSemanas,
            reload: false,
            lastFilterGerencias: filtroGeografia.Gerencias,
          });
          updateGlobalStore({timestamp: currentTime, canReload: false});
        } catch (error) {
          updateGlobalStore({timestamp: currentTime, canReload: true});
          throw new Error('no funciona useFetchCriticalData');
        }
      };

      fetchCriticalData();
    }
  }, [filtroFecha, filtroGeografia, hydrated, globalHydrated, reload]);
};

export default useFetchCriticalData;
