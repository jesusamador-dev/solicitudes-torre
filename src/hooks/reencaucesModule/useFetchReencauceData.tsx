import {useReencauceRequestStore} from 'mf_mesacyc_dashboards_common/ReencauceRequestStore';
import ReencauceService from '@/data/services/reencauce/ReencaucesService';
import {useEffect} from 'react';
import { initializeReencauceData } from '@/utils/reencauce/initializeReencauceData';
import {useGlobalStore} from 'mf_mesacyc_dashboards_common/GlobalStore';

const useFetchReencauceData = async (service: ReencauceService, token: string) => {
  const {filtroFecha, filtroGeografia, updateGlobalStore, hydrated: globalHydrated, geographyLevel} = useGlobalStore();
  
  const {
    updateReencauceRequestStore,
    lastFilterNumWeek,
    lastFilterDate,
    hydrated,
    reload,
    timestamp: timestampRequest,
    lastFilterGerencias
  } = useReencauceRequestStore();

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
        initializeReencauceData(updateReencauceRequestStore);
      const fetchData = async () => {
        try {
          const promises = await Promise.allSettled([
            service.getTotalRequestReencauzadas(token, {filtroFecha, filtroGeografia}),
            service.getWeeklyReencaucesByAppointment(token, {filtroFecha, filtroGeografia}),
            service.getTopsWithTabs(token, {filtroFecha, filtroGeografia}, geographyLevel),
            service.getReencauceByMotive(token, {filtroFecha, filtroGeografia}),
            service.getReencauceByGeography(token, { filtroFecha, filtroGeografia}, geographyLevel),
            service.getChartline(token, {filtroFecha, filtroGeografia}),
            service.getDoughnuts(token, {filtroFecha, filtroGeografia}),
          ]);
   
          const promisesKeys = [
            { key: "totalRequestReencauzadas", default: { status: null, data: [] } },
            { key: "weeklyAppointment", default: { status: null, data: [] } },
            { key: "topsWithTabs", default: { status: null, data: [] } },
            { key: "reencauceByMotive", default: { status: null, data: [] } },
            { key: "reencauceByGeography", default: { status: null, data: [] } },
            { key: "chartline", default: { status: null, data: [] } },
            { key: "doughnuts", default: { status: null, data: [] } },
          ];
          
          // Iterar sobre las respuestas de Promise.allSettled y actualizar el store
          promises.forEach((result, index) => {
            const { key, default: defaultValue } = promisesKeys[index];
            const response = result.status === "fulfilled" ? result.value : defaultValue;

            updateReencauceRequestStore({
              [key]: {
                statusCode: response.status,
                data: response.data,
              },
            });
          });

          updateReencauceRequestStore({
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
          throw new Error('no funciona useFetchReencauceData');
        }
      };

      fetchData();
    }
  }, [filtroFecha, filtroGeografia, hydrated, globalHydrated, reload]);
};

export default useFetchReencauceData;
