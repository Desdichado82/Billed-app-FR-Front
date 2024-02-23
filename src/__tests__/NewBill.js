import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from '@testing-library/user-event';
import NewBillUI from "../views/NewBillUI.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the NewBill page should render correctly", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      // Assert that the necessary elements are rendered on the NewBill page
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
      // Add assertions for other UI elements as needed
    });

    test("Then I should be able to submit a new bill", async () => {
      // Mock necessary data and API response
      const billData = {
        // Define bill data
      };
      mockStore.bills().create = jest.fn().mockResolvedValueOnce({ fileUrl: "https://example.com/test.jpg", key: "1234" });

      // Populate form fields, trigger form submission, and wait for API call
      // Add your test implementation here

      // Assert navigation to Bills page
      expect(window.location.href).toContain(ROUTES_PATH.Bills);
    });

    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", { value: localStorageMock });
        window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });

      test("Then it should handle 404 error", async () => {
        // Mock API call to return a 404 error
        mockStore.bills().create = jest.fn().mockRejectedValueOnce(new Error("Erreur 404"));

        // Trigger form submission
        const form = screen.getByTestId("form-new-bill");
        fireEvent.submit(form);

        // Wait for the error message to be rendered
        await waitFor(() => expect(screen.getByText(/Erreur 404/)).toBeInTheDocument());
      });

      test("Then it should handle 500 error", async () => {
        // Mock API call to return a 500 error
        mockStore.bills().create = jest.fn().mockRejectedValueOnce(new Error("Erreur 500"));

        // Trigger form submission
        const form = screen.getByTestId("form-new-bill");
        fireEvent.submit(form);

        // Wait for the error message to be rendered
        await waitFor(() => expect(screen.getByText(/Erreur 500/)).toBeInTheDocument());
      });
    });
  });
});
