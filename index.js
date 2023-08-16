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
  const { choice } = await inquirer.prompt({
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

    case 'Add a department':
      try {
        const answer = await inquirer.prompt({
        type: 'input',
        name: 'addDepartment',
        message: 'What is the name of the department you would like to add?'
      });
      await db.query('INSERT INTO department (name) VALUES (?)', [answer.addDepartment]);
      console.log(`${answer.addDepartment} department added successfully!`);
    } catch (err) {
      console.error('Error adding department: ', err.message);
    }
      break;

    case 'Add a role':
      // TODO:
      try {
        const [departments] = await db.query('SELECT id, name FROM department');

        const departmentChoices = departments.map(dept => ({
          name: dept.name,
          value: dept.id
      }));

        const answers = await inquirer.prompt([
          {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role you would like to add?'
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'What is the salary of the role?'
      },
      {
        type: 'list',
        name: 'roleDepartment',
        message: 'Which department does the role belong to?',
        choices: departmentChoices
      }
    ]);
      await db.query('INSERT INTO role (title, salary, department_id) VALUES (?)', [answers.roleName, answers.roleSalary, answers.roleDepartment]);
      console.log(`${answers.roleName} added successfully!`);
    } catch (err) {
      console.error('Error adding role: ', err.message);
    }
      break;

    case 'Add an employee':
      // TODO:
      try {
        const [roles] = await db.query('SELECT id, title FROM role');
        const roleOptions = roles.map(role => ({
          name: role.title,
          value: role.id
        }));

        const [managers] = await db.query('SELECT id, first_name, last_name FROM employee');
  
        const managerOptions = managers.map(manager => ({
          name: `${manager.firstname} ${manager.lastname}`,
          value: manager.id
        }));
  
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee\'s first name?'
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?'
          },
          {
            type: 'list',
            name: 'employeeRole',
            message: 'What is the employee\'s role?',
            choices: roleOptions
          },
          {
            type: 'list',
            name: 'employeeManager',
            message: 'Who is the emploayee\s manager?',
            choices: managerOptions
          }
        ]);
        await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.employeeRole, answers.employeeManager]);
        console.log(`Employee, ${answers.firstName} ${answers.lastName}, added successfully!`);
      } catch (err) {
        console.error('Error adding employee: ', err.message);
      }
      break;

    case 'Update an employee role':
      // TODO:
      try {
        const [employees] = await db.query('SELECT id, first_name last_name FROM employee');
        const employeeOptions = employees.map(employee => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id
        }));

        const [roles] = await db.query('SELECT id, title FROM role');
        const roleOptions = roles.map(role => ({
          name: role.title,
          value: role.id
        }));
  
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'employees',
            message: 'Which employee\'s role would you like to update?',
            choices: employeeOptions
          },
          {
            type: 'list',
            name: 'updatedRole',
            message: 'Which role would you like to assign to the selected employee?',
            choices: roleOptions
          }
        ]);
        await db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.updatedRole, answers.employees]);
        console.log(`${answers.employeeOptions.name}'s role to $${answers.roleOptions.title}, successfully!`);
      } catch (err) {
        console.error('Error updating employee: ', err.message);
      }
      break;
    case 'Quit':
      db.end();
      return;
  }
  mainMenu();
};

mainMenu();