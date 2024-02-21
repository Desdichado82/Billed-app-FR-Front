// __mocks__/mock500.js
const mock500 = jest.fn(() => {
    return Promise.reject(new Error("Erreur 500"));
  });