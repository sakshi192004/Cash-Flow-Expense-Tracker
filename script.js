// console.log("JavaScript Connected Successfully");

const salaryForm = document.getElementById("salaryForm");
const salaryInput = document.getElementById("salaryInput");
const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");


const salaryDisplay = document.getElementById("salaryDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");
const transactionCount = document.getElementById("transactionCount");

const expenseTableBody = document.getElementById("expenseTableBody");

const chartCanvas = document.getElementById("expenseChart");

const warningBanner = document.getElementById("warningBanner");

const downloadBtn = document.getElementById("downloadPDF");

const currencySelect = document.getElementById("currency");






// console.log(salaryForm);
// console.log(salaryInput);
// console.log(expenseForm);
// console.log(expenseName);
// console.log(expenseAmount);

let salary = 0;
let totalExpenses = 0;
let expenses = [];
let expenseChart;

let currentCurrency = "INR";
let exchangeRate = 1;


async function convertCurrency() {

  if (currentCurrency === "INR") {

    exchangeRate = 1;

    updateSummaryCards();

     renderExpenses();

    updateChart();


    return;

  }

  try {

    const response = await fetch(
      "https://open.er-api.com/v6/latest/INR"
    );

    const data = await response.json();

    exchangeRate = data.rates[currentCurrency];

    updateSummaryCards();
    renderExpenses();
updateChart();

  }

  catch (error) {

    console.log(error);

    alert("Unable to fetch exchange rates.");

  }

}





currencySelect.addEventListener("change", function () {

  currentCurrency = this.value;

  convertCurrency();

});


function updateSummaryCards() {

  const convertedSalary = salary * exchangeRate;

  const convertedExpense = totalExpenses * exchangeRate;

  const convertedBalance = (salary - totalExpenses) * exchangeRate;

  if (currentCurrency === "INR") {

    salaryDisplay.textContent = `₹${salary}`;

    expenseDisplay.textContent = `₹${totalExpenses}`;

    balanceDisplay.textContent = `₹${salary - totalExpenses}`;

  }

  else {

    salaryDisplay.textContent =
      `${currentCurrency} ${convertedSalary.toFixed(2)}`;

    expenseDisplay.textContent =
      `${currentCurrency} ${convertedExpense.toFixed(2)}`;

    balanceDisplay.textContent =
      `${currentCurrency} ${convertedBalance.toFixed(2)}`;

  }

  transactionCount.textContent = expenses.length;

}

function checkThreshold() {

  const limit = salary * 0.10;

  const balance = salary - totalExpenses;

  if (balance <= limit) {

    balanceDisplay.style.color = "#ef4444";

    warningBanner.classList.remove("hidden");

  }

  else {

    balanceDisplay.style.color = "#22c55e";

    warningBanner.classList.add("hidden");

  }

}




function saveData() {
  localStorage.setItem("salary", salary);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}



function loadData() {

  // Get data from LocalStorage
  const savedSalary = localStorage.getItem("salary");
  const savedExpenses = localStorage.getItem("expenses");

  // Restore salary
  if (savedSalary) {
    salary = Number(savedSalary);
  }

  // Restore expenses
  if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
  }

  // Recalculate total expenses
  totalExpenses = 0;

  expenses.forEach(function (expense) {
    totalExpenses += expense.amount;
  });

  updateSummaryCards();
  checkThreshold();
  renderExpenses();

  updateChart();
}





salaryForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredSalary = Number(salaryInput.value);
  if (enteredSalary <= 0) {
    alert("Please enter a valid salary.");
    return;
  }
  salary = enteredSalary;

  updateSummaryCards();
  checkThreshold();
  updateChart();
  saveData();
})

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);
  if (name == "" || name <= 0) {
    alert("Please enter valid expense details.");
    return;
  }

  const expense = {
    name: name,
    amount: amount,
    date: new Date().toLocaleDateString()
  };

  expenses.push(expense);

  totalExpenses += amount;
  updateSummaryCards();

  checkThreshold();

  renderExpenses();

  updateChart();

  saveData();
  expenseName.value = "";
  expenseAmount.value = "";

})

function renderExpenses() {
  expenseTableBody.innerHTML = "";
  if (expenses.length === 0) {
    expenseTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">
        No expenses added yet.
        </td>
      </tr>  
    `;
    return;
  }

  expenses.forEach(function (expense, idx) {

    const convertedAmount = expense.amount * exchangeRate;
    const date = new Date().toLocaleDateString();
    const row = `
      <tr>

            <td>${expense.name}</td>

            <td>
                ${currentCurrency === "INR"
                    ? `₹${expense.amount}`
                    : `${currentCurrency} ${convertedAmount.toFixed(2)}`
                  }
            </td>

            <td>${expense.date}</td>
            <td>

                <button class="delete-btn"
                onclick="deleteExpense(${idx})">
                🗑
            </button>
            </td>

        </tr>
    `;
    expenseTableBody.innerHTML += row;
  });

  document.getElementById("expenseCounter").textContent = `${expenses.length} Transactions`;

}


function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  totalExpenses = 0;
  expenses.forEach(function (expense) {
    totalExpenses += expense.amount;
  });

  updateSummaryCards();
  checkThreshold();

  renderExpenses();

  updateChart();

  saveData();

}


window.addEventListener("DOMContentLoaded", function () {

  loadData();

});

function updateChart() {


  if (expenseChart) {

    expenseChart.destroy();

  }

  expenseChart = new Chart(chartCanvas, {

    type: "pie",

    data: {

      labels: ["Expenses", "Balance"],

      datasets: [{

        data: [

          totalExpenses,

          salary - totalExpenses

        ],

        backgroundColor: [

          "#EF4444",

          "#22C55E"

        ]

      }]

    },

    options: {

      responsive: true,

      plugins: {

        legend: {

          position: "bottom"

        }

      }

    }

  });
}


function generatePDF() {

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text("Cash Flow Report", 20, 20);

  doc.setFontSize(14);

  doc.text(`Total Salary :  Rs.${salary}`, 20, 40);

  doc.text(`Total Expenses :  Rs.${totalExpenses}`, 20, 50);

  doc.text(`Remaining Balance :  Rs.${salary - totalExpenses}`, 20, 60);

  doc.setFontSize(16);

  doc.text("Expense List", 20, 80);

  let y = 95;

  expenses.forEach(function (expense) {

    doc.text(

      `${expense.name} :  Rs.${expense.amount}`,

      20,

      y

    );

    y += 10;

  });

  doc.text(

    `Generated On : ${new Date().toLocaleDateString()}`,

    20,

    y + 20

  );

  doc.save("CashFlowReport.pdf");

}


downloadBtn.addEventListener("click", generatePDF);





