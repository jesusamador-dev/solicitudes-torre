export const initializeTocaronReencauceData = (updateTocaronRequestStore) => {
    updateTocaronRequestStore({
      //criticalReencauceData: false,
      
      weeklyAppointmentReencauce: {
        statusCode: null,
        data: [],
      },
      weeklyDoughnutsReencauce: {
        statusCode: null,
        data: [],
      },
      tocaronReencauce: {
        statusCode: null,
        data: [],
      },
    });
  };
  