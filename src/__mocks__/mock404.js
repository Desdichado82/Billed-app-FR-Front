// __mocks__/mock404.js
const mock404 = jest.fn(() => {
    return Promise.reject(new Error("Erreur 404"));
  });
  
  export default mock404;

  