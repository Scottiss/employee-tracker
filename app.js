const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const questions = require("./questions");

let connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.mysqlUsername,
  password: process.env.mysqlPassword,
  database: 'management_db'
})

connection.connect(err => {
  if (err) {
    return console.error('error: ' + err.message);
  } 
  startPrompt();
})

// func to ask what user wants to do
async function startPrompt() {
  const answers = await inquirer.prompt(questions);

  // answer determination
  switch (answers.action) {
    case "View All Employees":
      viewAllEmployees();
      break;
    case "View All Employees By Department":
      viewEmployeesByDepartment();
      break;
    case "View All Employees By Manager":
      viewEmployeesByManager();
      break;
    case "View Departments":
      viewDepartments();
      break;
    case "View Roles":
      viewRoles();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Add Role":
      addRole();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Remove Employee":
      removeEmployee();
      break;
    case "Remove Role":
      removeRole();
      break;
    case "Remove Department":
      removeDepartment();
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "Update Employee Manager":
      updateEmployeeManager();
      break;
    case "Quit":
      connection.end(err => {
        if (err) throw err;
        console.log("Goodbye");
      });   
  }
}