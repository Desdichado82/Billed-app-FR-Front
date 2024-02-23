import { fireEvent, screen, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("fetches bills from mock API GET", async () => {
      console.log("Setting up localStorage mock...");
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }));
    
      console.log("Creating root div...");
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
    
      console.log("Setting up router...");
      router();
    
      console.log("Navigating to NewBill page...");
      window.onNavigate(ROUTES_PATH.NewBill);
    
      console.log("Waiting for 'Envoyer' button to be rendered...");
      await waitFor(() => screen.getByText("Envoyer"));
    
      console.log("Fetching NewBill component...");
      const newBillComponent = await screen.getByTestId("form-new-bill");
    
      console.log("Asserting NewBill component...");
      expect(newBillComponent).toBeTruthy();
    });

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        
        window.localStorage.setItem("user", JSON.stringify({
          type: "Employee"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })

      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick);
        await waitFor(() => expect(screen.queryByText(/Erreur 404/)).toBeInTheDocument());
        expect(message).toBeTruthy()
      })

      test("fetches bills from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            create: () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})
        window.onNavigate(ROUTES_PATH.NewBill)
        await new Promise(process.nextTick);
        await waitFor(() => expect(screen.queryByText(/Erreur 500/)).toBeInTheDocument());
        expect(message).toBeTruthy()
      })
    })
  });
});



