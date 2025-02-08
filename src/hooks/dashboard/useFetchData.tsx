import {useRequestStore} from 'mf_mesacyc_dashboards_common/RequestStore';
import DashboardService from '@/data/services/dashboard/DashboardService';
import {useEffect} from 'react';
import {IFilter} from 'mf_mesacyc_dashboards_common/IFilter';
import {useGlobalStore} from 'mf_mesacyc_dashboards_common/GlobalStore';

const useFetchData = (service: DashboardService, token: string) => {
  const updateRequestStore = useRequestStore((state) => state.updateRequestStore);
  const criticalDashboardData = useRequestStore((state) => state.criticalDashboardData);
  const {filtroFecha, filtroGeografia, updateGlobalStore} = useGlobalStore();
  const filters: IFilter = {filtroFecha, filtroGeografia};

  useEffect(() => {
    if (criticalDashboardData) {
      const fetchData = async () => {
        try {
          const promises = await Promise.allSettled([
            service.getDetailCompletedRequests(token, filters),
            service.getReencausesWeekly(token, filters),
          ]);

          const promisesKeys = [
            {key: 'completedRequests', default: {status: null, data: []}},
            {key: 'reencauseWekly', default: {status: null, data: []}},
          ];

          // Iterar sobre las respuestas y actualizar el store
          promisesKeys.forEach((item, index) => {
            const response =
              promises[index].status === 'fulfilled' ? promises[index].value : item.default;
            updateRequestStore({
              [item.key]: {
                statusCode: response.status,
                data: response.data,
              },
            });
          });

          const today = new Date().toLocaleDateString().slice(0, 10);
          const currentTime = Date.now();

          updateRequestStore({
            timestamp: currentTime,
            lastUpdate: today,
            criticalDashboardData: false,
          });
        } catch (error) {
          updateGlobalStore({timestamp: Date.now(), canReload: true});
          throw new Error('no funciona useFetchData');
        }
      };

      fetchData();
    }
  }, [criticalDashboardData]);
};

export default useFetchData;
