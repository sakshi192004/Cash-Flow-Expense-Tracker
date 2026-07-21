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

// console.log(salaryForm);
// console.log(salaryInput);
// console.log(expenseForm);
// console.log(expenseName);
// console.log(expenseAmount);

let salary = 0;
let totalExpenses = 0;
let expenses = [];



function saveData(){
  localStorage.setItem("salary",salary);
  localStorage.setItem("expenses",JSON.stringify(expenses));
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

    expenses.forEach(function(expense) {
        totalExpenses += expense.amount;
    });

    // Update summary cards
    salaryDisplay.textContent = `₹${salary}`;
    expenseDisplay.textContent = `₹${totalExpenses}`;
    balanceDisplay.textContent = `₹${salary - totalExpenses}`;
    transactionCount.textContent = expenses.length;

    // Render expense table
    renderExpenses();

}





salaryForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const enteredSalary = Number(salaryInput.value);
  if (enteredSalary <= 0) {
    alert("Please enter a valid salary.");
    return;
  }
  salary = enteredSalary;
  saveData();
  salaryDisplay.textContent = `₹${salary}`;
  balanceDisplay.textContent = `₹${salary}`;
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
  };

  expenses.push(expense);
  
  totalExpenses += amount;
  saveData();
  expenseDisplay.textContent = `₹${totalExpenses}`;
  balanceDisplay.textContent = `₹${salary - totalExpenses}`;
  transactionCount.textContent = expenses.length;
  renderExpenses();
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
    const date = new Date().toLocaleDateString();
    const row = `
      <tr>

            <td>${expense.name}</td>

            <td>₹${expense.amount}</td>

            <td>${date}</td>

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

  expenseDisplay.textContent = `₹${totalExpenses}`;

  balanceDisplay.textContent = `₹${salary - totalExpenses}`;

  transactionCount.textContent = expenses.length;

  renderExpenses();
  
}


window.addEventListener("DOMContentLoaded", function () {

    loadData();

});



