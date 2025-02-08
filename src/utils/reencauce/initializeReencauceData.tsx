export const initializeReencauceData = (updateRequestStore) => {
  updateRequestStore({
    //criticalReencauceData: false,

    reprogrammedRequests: {
      statusCode: null,
      data: [],
    },
    weeklyAppointment: {
      statusCode: null,
      data: [],
    },
    topsWithTabs: {
      statusCode: null,
      data: [],
    },
    reencauceByMotive: {
      statusCode: null,
      data: [],
    },
    reencauceByGeography: {
      statusCode: null,
      data: [],
    },
    charline: {
      statusCode: null,
      data: [],
    },
    doughnuts: {
      statusCode: null,
      data: [],
    },
  });
};
