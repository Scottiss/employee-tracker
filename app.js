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

function viewAllEmployees() {
  const sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(e.first_name, ' ', e.last_name) as manager"
            + " FROM employee" +
            " inner join role ON (employee.role_id = role.id)" + 
            " inner join department on role.department_id = department.id" +
            " left join employee as e on employee.manager_id = e.id";
  connection.query(sql, [], (err, res, fields) => {
    if (err) throw err;
    console.table(res); 
    startPrompt();
  });
}

// dpt employees
async function viewEmployeesByDepartment() {
  let answer;
  let departments;
  try {
    departments = await querySync(connection, "SELECT name FROM department");
    departments = departments.map(elem => elem.name);
    answer = await inquirer.prompt(
      {
        type: "list",
        message: "Department Name: ",
        name: "department",
        choices: departments
      }
    )
  } catch(err) {
    throw err;
  }

  // db query
  const sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(e.first_name, ' ', e.last_name) as manager"
            + " FROM employee" +
            " inner join role ON (employee.role_id = role.id)" + 
            " inner join department on role.department_id = department.id" +
            " left join employee as e on employee.manager_id = e.id" +
            " WHERE department.name = ?";
  connection.query(sql, [answer.department], (err, res, fields) => {
    if (err) throw err;
    console.table(res); 
    startPrompt();
  });
}