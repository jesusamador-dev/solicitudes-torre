export const initializeCriticalData = (updateRequestStore) => {
    updateRequestStore({
      criticalDashboardData: false,
      summary: {
        statusCode: null,
        data: null
      },
      comparativeReencauses: {
        statusCode: null,
        data: []
      },
      funnels: {
        statusCode: null,
        data: []
      },
      requestSheduledToday: {
        statusCode: null,
        data: []
      },
    })
};