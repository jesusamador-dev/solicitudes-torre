import {useTocaronReencauceRequestStore} from 'mf_mesacyc_dashboards_common/TocaronReencauceRequestStore';
import ReencauceService from '@/data/services/reencauce/ReencaucesService';
import {useEffect} from 'react';
import { initializeTocaronReencauceData } from '@/utils/reencauce/initializeTocaronReencauceData';
import {useGlobalStore} from 'mf_mesacyc_dashboards_common/GlobalStore';

const useFetchTocaronReencauceData = async (service: ReencauceService, token: string) => {
  const {filtroFecha, filtroGeografia, updateGlobalStore, hydrated: globalHydrated} = useGlobalStore();
  const {
    updateTocaronReencauceRequestStore,
    lastFilterNumWeek,
    lastFilterDate,
    hydrated,
    reload,
    timestamp: timestampRequest,
    lastFilterGerencias
  } = useTocaronReencauceRequestStore();

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
        initializeTocaronReencauceData(updateTocaronReencauceRequestStore);
      const fetchData = async () => {
        try {
          const promises = await Promise.allSettled([
            service.getTotalRequestReencauzadas(token, {filtroFecha, filtroGeografia}),
            service.getWeeklyAppointmentReencauce(token, {filtroFecha, filtroGeografia}),
            service.getWeeklyDoughtnutsReencauce(token, {filtroFecha, filtroGeografia}),
            service.getTocaronReencauce(token, {filtroFecha, filtroGeografia})
          ]);
   
          const promisesKeys = [
            { key: "totalRequestReencauzadas", default: { status: null, data: [] } },
            { key: "weeklyAppointmentReencauce", default: { status: null, data: [] } },
            { key: "weeklyDoughnutsReencauce", default: { status: null, data: [] } },
            { key: "tocaronReencauce", default: { status: null, data: [] } },
          ];
          
          // Iterar sobre las respuestas de Promise.allSettled y actualizar el store
          promises.forEach((result, index) => {
            const { key, default: defaultValue } = promisesKeys[index];
            const response = result.status === "fulfilled" ? result.value : defaultValue;
            console.log({"key": key, valueDefault: defaultValue, respuesta: response })

            updateTocaronReencauceRequestStore({
              [key]: {
                statusCode: response.status,
                data: response.data,
              },
            });
          });

          updateTocaronReencauceRequestStore({
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
          throw new Error('no funciona useFetchTocaronReencauceData');
        }
      };

      fetchData();
    }
  }, [filtroFecha, filtroGeografia, hydrated, globalHydrated, reload]);
};

export default useFetchTocaronReencauceData;
