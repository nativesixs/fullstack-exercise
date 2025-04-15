const axiosMock = {
  get: jest.fn(() =>
    Promise.resolve({
      data: {},
      headers: { 'content-type': 'application/json' },
    })
  ),
  post: jest.fn(() =>
    Promise.resolve({
      data: {},
      headers: { 'content-type': 'application/json' },
    })
  ),
  put: jest.fn(() =>
    Promise.resolve({
      data: {},
      headers: { 'content-type': 'application/json' },
    })
  ),
  patch: jest.fn(() =>
    Promise.resolve({
      data: {},
      headers: { 'content-type': 'application/json' },
    })
  ),
  delete: jest.fn(() =>
    Promise.resolve({
      data: {},
      headers: { 'content-type': 'application/json' },
    })
  ),
  create: jest.fn(function () {
    return this;
  }),
  defaults: {
    baseURL: '',
    headers: {
      common: {
        'Content-Type': 'application/json',
      },
    },
  },
  interceptors: {
    request: {
      use: jest.fn(),
      eject: jest.fn(),
    },
    response: {
      use: jest.fn(),
      eject: jest.fn(),
    },
  },
};

axiosMock.mockResolvedValue = function (value) {
  this.get.mockResolvedValue(value);
  this.post.mockResolvedValue(value);
  this.put.mockResolvedValue(value);
  this.delete.mockResolvedValue(value);
  return this;
};

axiosMock.mockRejectedValue = function (error) {
  this.get.mockRejectedValue(error);
  this.post.mockRejectedValue(error);
  this.put.mockRejectedValue(error);
  this.delete.mockRejectedValue(error);
  return this;
};

module.exports = axiosMock;
