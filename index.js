// SECtION: Import Packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
// const Sequelize = require('sequelize');
// require('dotenv').config();

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
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Quit'
    ]
  });

  switch (action) {
   
    case 'View all departments':
      db.query('SELECT * FROM department', function (err, results) {
        if (err) {
          console.error('Error selecting departments:', err.message);
          return;
        }
        console.table(results);
        mainMenu();
      });
      break;
     
    case 'View all roles':
        db.query('SELECT role.id, role.title, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id ORDER BY department.name', function (err, results) { 
        if (err) {
        console.error('Error selecting roles:', err.message);
        return;
      }
        console.table(results);
        mainMenu();
      });
      break;

    case 'View all employees':
      db.query('SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY department', function (err, results) {
        if (err) {
          console.error('Error selecting roles:', err.message);
          return;
        }
        console.table(results);
        mainMenu();
      });
      break;

    case 'Add a department':
      try {
        const answer = await inquirer.prompt({
        type: 'input',
        name: 'addDepartment',
        message: 'What is the name of the department you would like to add?'
      });
     db.query('INSERT INTO department (name) VALUES (?)', [answer.addDepartment]);
      console.log(`${answer.addDepartment} department added successfully to the database!`);
    } catch (err) {
      console.error('Error adding department: ', err.message);
    }   mainMenu();
      break;

    case 'Add a role':
      try {
        db.query('SELECT id, name FROM department', (err, departments) => {
          if (err) {
            console.error('Error fetching departments: ', err.message);
            return
          }
          const departmentChoices = departments.map(dept => ({
            name: dept.name,
            value: dept.id
          }));
          inquirer.prompt([
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
          ]).then(answers => {
            db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleName, answers.roleSalary, answers.roleDepartment], (err, result) => {
              if (err) {
                console.error('Error adding role:', err.message);
                return;
              }
              console.log(`${answers.roleName} added successfully!`);
              mainMenu();
            });
          });
        });
    } catch (err) {
      console.error('Error: ', err.message);
    } 
      break;

    case 'Add an employee':
        db.query('SELECT id, title FROM role', (err, roles) => {
          if (err) {
            console.error('Error fetching roles:', err.message);
            return;
          }
          const roleOptions = roles.map(role => ({
            name: role.title,
            value: role.id
          }));
        db.query('SELECT id, first_name, last_name FROM employee', (err, managers) => {
          if (err) {
            console.error('Error fetching managers:', err.message);
            return;
          }
          const managerOptions = managers.map(manager => ({
            name: `${manager.first_name} ${manager.last_name}`,
            value: manager.id
        }));
        managerOptions.push({ name: 'None', value: null });
        inquirer.prompt([
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
            message: 'Who is the employee\'s manager?',
            choices: managerOptions
          }
        ]).then(answers => {
        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.employeeRole, answers.employeeManager], (err, result) => {
          if (err) {
            console.error('Error adding employee:', err.message);
            return;
          }
          console.log(`Employee, ${answers.firstName} ${answers.lastName}, added successfully!`);
          mainMenu();
        });
      });
    });
  });
      break;
    case 'Update an employee role':
      // TODO:
      // try {
      //   const [employees] = db.query('SELECT id, first_name last_name FROM employee');
        db.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
          if (err) {
            console.error('Error fetching employees:', err.message);
            return;
          }
          const employeeOptions = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }));
          db.query('SELECT id, title FROM role', (err, roles) => {
            if (err) {
              console.error('Error fetching roles:', err.message);
              return;
            }
            const roleOptions = roles.map(role => ({
              name: role.title,
              value: role.id
            }));
            inquirer.prompt([
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
            ]).then(answers => {
              db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.updatedRole, answers.employees], (err, results) => {
                if (err) {
                  console.error('Error updating employee:', err.message);
                  return;
                }
                const selectedEmployee = employeeOptions.find(emp => emp.value === answers.employees);
const selectedRole = roleOptions.find(role => role.value === answers.updatedRole);

console.log(`Updated ${selectedEmployee.name}'s role to ${selectedRole.name}, successfully!`);
                mainMenu();
              });
            });
          });
        });
        // const [roles] = db.query('SELECT id, title FROM role')
        // const answers = await inquirer.prompt([
      break;
    case 'Quit':
      db.end();
      return;
  }
  // mainMenu();
};

mainMenu();