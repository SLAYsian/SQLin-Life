// SECtION: Import Packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
// const Sequelize = require('sequelize');
// require('dotenv').config();

// const PORT = process.env.PORT || 3001;
// SECTION: Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'b@rUc3_w3Ezy',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

// SECTION: Inquirer Prompts
const mainMenu = async () => {
  const { choice } = await inquirer.createPromptModule({
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  });

  switch (choice) {
    case 'View all departments':
      db.query('SELECT * FROM department', function (err, results) {
        console.log(results);
      });
      break;
    case 'View all roles':
      db.query('SELECT * FROM role', function (err, results) {
        console.log(results);
      });
      break;
    case 'View all employees':
      db.query('SELECT * FROM employee', function (err, results) {
        console.log(results);
      });
      break;
    // case 'Add a department':
    //   // TODO:
      
    //   break;
    // case 'Add a role':
    //   // TODO:
    //   break;
    // case 'Add an employee':
    //   // TODO:
    //   break;
    // case 'Update an employee role':
    //   // TODO:
    //   break;
    case 'Exit':
      db.end();
      return;
  }
  mainMenu();
};

mainMenu();