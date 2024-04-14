// Initialize Bootstrap tooltips
const errorIcons = document.querySelectorAll('.error-icon');
errorIcons.forEach((icon) => {
    new bootstrap.Tooltip(icon);
});

// for tooltip displaying

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
document.addEventListener("DOMContentLoaded", function() {
    const tooltips = document.querySelectorAll('.tooltip');
    const tooltipBox = document.getElementById('tooltipBox');

    tooltips.forEach((tooltip) => {
        tooltip.addEventListener('mousemove', (event) => {
            const tooltipContent = tooltip.getAttribute('data-tooltip');
            tooltipBox.textContent = tooltipContent;
            tooltipBox.style.top = event.pageY + 'px';
            tooltipBox.style.left = event.pageX + 'px';
        });
        tooltip.addEventListener('mouseout', () => {
            tooltipBox.textContent = '';
        });
    });
});

//->*****************************                 *******************<-
function displayError(inputElement, errorId, errorMessage) {
    const errorIcon = document.getElementById(errorId);
    errorIcon.dataset.title = errorMessage;
    errorIcon.style.display = 'inline-block';

    // Position error tooltip near the input field
    // Adjust the positioning as needed
    const rect = inputElement.getBoundingClientRect();
    // errorIcon.style.top = ${rect.top}px;
    // errorIcon.style.left = ${rect.right + 10}px;
}

// Function to hide error message and icon for a specific input field
function hideError(errorId) {
    const errorIcon = document.getElementById(errorId);
    errorIcon.dataset.title = '';
    errorIcon.style.display = 'none';
}

//*************************************************************

// Function to validate input fields
function validateInput() {
    let isValid = true;
    // Validate gross annual income
    var errorIcon = document.getElementById('error-grossIncome');
    const grossIncomeInput = document.getElementById('grossIncome');
    const grossIncomeValue = parseFloat(grossIncomeInput.value);
    if (isNaN(grossIncomeValue) || grossIncomeValue <= 0) {
        errorIcon.style.display = 'inline';
        isValid = false;
    } else {
        errorIcon.style.display = 'none'; 
    }

    // Validate extra income
    const extraIncomeInput = document.getElementById('extraIncome');
    const extraIncomeValue = parseFloat(extraIncomeInput.value);
    if (isNaN(extraIncomeValue) || extraIncomeValue < 0) {
        displayError(extraIncomeInput, 'error-extraIncome', 'Extra income must be a non-negative numeric value');
        isValid = false;
    } else {
        hideError('error-extraIncome');
    }
     // Validate age group
     const ageGroupSelect = document.getElementById('ageGroup');
     const ageGroupValue = ageGroupSelect.value;
     if (ageGroupValue === '') {
         displayError(ageGroupSelect, 'error-ageGroup', 'Please select an age group.');
         isValid = false;
     } else {
         hideError('error-ageGroup');
     }

    // Validate applicable deductions
    const deductionsInput = document.getElementById('applicableDeductions');
    const deductionsValue = parseFloat(deductionsInput.value);
    if (isNaN(deductionsValue) || deductionsValue < 0) {
        displayError(deductionsInput, 'error-applicableDeductions', 'Applicable deductions must be a non-negative numeric value');
        isValid = false;
    } else {
        hideError('error-applicableDeductions');
    }
    return isValid;
}



// Function to calculate tax amount
function calculateTax(grossIncome, extraIncome, ageGroup, applicableDeductions) {
    const totalIncome = grossIncome + extraIncome - applicableDeductions;

    // Check if total income is under 8 Lakhs
    if (totalIncome <= 800000) {
        return 0; // No tax
    }

    let taxAmount = 0;

    // Calculate taxable income (income over 8 Lakhs)
    const taxableIncome = totalIncome - 800000;

    // Apply tax rates based on age group
    switch (ageGroup) {
        case 'below40':
            taxAmount = 0.3 * taxableIncome; // 30% tax rate for age < 40
            break;
        case '40to60':
            taxAmount = 0.4 * taxableIncome; // 40% tax rate for age >= 40 but < 60
            break;
        case 'above60':
            taxAmount = 0.1 * taxableIncome; // 10% tax rate for age >= 60
            break;
        default:
            break;
    }

    return taxAmount;
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ",");
}
// Function to display tax amount in the container
function displayTaxAmount(taxAmount) {
    const formattedTaxAmount = numberWithCommas(Math.round(taxAmount)); // Rounding taxAmount before formatting

    const taxAmountContainer = document.getElementById('taxAmount');
    taxAmountContainer.innerHTML =`<h3>Your overall income will be<br> ${formattedTaxAmount}</h3><P> after tax deductions</P>`;
    const taxResultContainer = document.getElementById('taxResultContainer');
    taxResultContainer.style.display = 'block';
   
}

 // Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Validate input fields
    const isValid = validateInput();

    if (isValid) {
        // Get input values
        const grossIncome = parseFloat(document.getElementById('grossIncome').value);
        const extraIncome = parseFloat(document.getElementById('extraIncome').value);
        const ageGroup = document.getElementById('ageGroup').value;
        const applicableDeductions = parseFloat(document.getElementById('applicableDeductions').value);

        // Calculate tax amount
        const taxAmount = calculateTax(grossIncome, extraIncome, ageGroup, applicableDeductions);

        // Display the calculated tax amount in the container
        displayTaxAmount(taxAmount);
}
}
// Add event listener to the submit button
const submitButton = document.getElementById('calculateBtn');
submitButton.addEventListener('click', handleSubmit);

//*close button */
// Function to close the tax result container
function closeTaxResultContainer() {
    const taxResultContainer = document.getElementById('taxResultContainer');
    taxResultContainer.style.display = 'none';
}

// Add event listener to the close button
const closeButton = document.getElementById('closeButton');
closeButton.addEventListener('click', closeTaxResultContainer);
