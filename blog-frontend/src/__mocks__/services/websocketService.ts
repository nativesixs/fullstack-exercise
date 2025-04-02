// Mock websocket service for tests
const websocketService = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  subscribeToComments: jest.fn(),
  unsubscribeFromComments: jest.fn(),
  send: jest.fn()
};

export default websocketService;
