import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })

    this.formats = ["image/png", "image/jpg", "image/jpeg"]
  }

  handleChangeFile(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const acceptedFormats = ['image/jpeg', 'image/png']; // List of supported file formats

    // Check if a file is selected
    if (file) {
        // Check if the selected file format is supported
        if (!acceptedFormats.includes(file.type)) {
            // If the file format is not supported, display an error message
            fileInput.setAttribute('data-error', 'Le fichier n\'est pas une image ou a une extension non autorisée.');
            fileInput.setAttribute('data-error-visible', true);
        } else {
            // If the file format is supported, clear any previous error message
            fileInput.setAttribute('data-error', '');
            fileInput.setAttribute('data-error-visible', false);

            // Optionally, you can update UI to indicate a valid file selection
            // For example, change the border color of the file input to indicate a valid selection
            fileInput.style.borderColor = 'green';
        }
    }
}

  handleSubmit = e => {
    e.preventDefault()
    const fileInput = document.querySelector('[data-testid="file"]');
    const errorVisible = fileInput.getAttribute('data-error-visible')
   // Check if an error message related to file format is visible
   if (errorVisible === 'true') {
    // If an error message is visible, do not proceed with form submission
    console.log('Cannot submit form due to file error');
    return;
}
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.updateBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}