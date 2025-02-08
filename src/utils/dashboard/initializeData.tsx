export const initializeData = (updateRequestStore) => {
    updateRequestStore({
      criticalDashboardData: false,
      completedRequests: {
        statusCode: null,
        data: []
      },
      reencauseWekly: {
        statusCode: null,
        data: null
      },
    })
    
};