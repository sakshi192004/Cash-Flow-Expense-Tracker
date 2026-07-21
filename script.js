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

// console.log(salaryForm);
// console.log(salaryInput);
// console.log(expenseForm);
// console.log(expenseName);
// console.log(expenseAmount);

let salary = 0;
let totalExpenses = 0;
let expenses = [];

salaryForm.addEventListener("submit",function(event){
  event.preventDefault();
  const enteredSalary = Number(salaryInput.value);
  if(enteredSalary<=0){
    alert("Please enter a valid salary.");
    return;
  }
  salary=enteredSalary;
  salaryDisplay.textContent=`₹${salary}`;
  balanceDisplay.textContent= `₹${salary}`;
})


