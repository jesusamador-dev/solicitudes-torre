const useAuthStore = jest.fn(() => ({
  setToken: jest.fn(),
}));

export default useAuthStore;