import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { fireEvent, screen } from "@testing-library/dom";

jest.mock("../app/store", () => mockStore);

describe("Given I am a user connected as Employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      // Set up our document body
      document.body.innerHTML = NewBill();
    });

    test("Then bill form should be rendered", () => {
      expect(screen.getByTestId('form-new-bill')).toBeTruthy();
    });

    test("Then it should call the handleChangeFile function on file change", () => {
      // Arrange
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Act
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      const inputFile = screen.getByTestId("file");
      inputFile.addEventListener("change", handleChangeFile);
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["file"], "file.png", { type: "image/png" })],
        },
      });

      // Assert
      expect(handleChangeFile).toHaveBeenCalled();
    });

    test("Then it should call the handleSubmit function on form submission", () => {
      // Arrange
      const onNavigate = jest.fn();
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Act
      const handleSubmit = jest.fn(newBill.handleSubmit);
      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      // Assert
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});

