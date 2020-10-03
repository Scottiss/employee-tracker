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