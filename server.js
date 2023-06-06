const inquirer = require('inquirer')
const mysql = require('mysql')
require("dotenv").config()

// Create a connection to the MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'track_db',
})

// Connect to the database
connection.connect((err) => {
  if (err) throw err
  console.log('Connected to the database.')
  // Start the application
  start()
})

// Seed the database
function seedDatabase() {
  const fs = require('fs')
  const path = require('path')

  const seedFilePath = path.join(__dirname, 'seeds.sql')
  const seedSQL = fs.readFileSync(seedFilePath, 'utf8')

  connection.query(seedSQL, (err) => {
    if (err) throw err
    console.log('Database seeded successfully!')
    start()
  })
}

// Start the application
function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Seed the database',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments()
          break
        case 'View all roles':
          viewRoles()
          break
        case 'View all employees':
          viewEmployees()
          break
        case 'Add a department':
          addDepartment()
          break
        case 'Add a role':
          addRole()
          break
        case 'Add an employee':
          addEmployee()
          break
        case 'Update an employee role':
          updateEmployeeRole()
          break
        case 'Seed the database':
          seedDatabase()
          break
        case 'Exit':
          connection.end()
          break
      }
    })
}

// View all departments
function viewDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err
    console.table(res)
    start()
  });
}

// View all roles
function viewRoles() {
  connection.query(
    'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id',
    (err, res) => {
      if (err) throw err
      console.table(res)
      start()
    }
  )
}

// View all employees
function viewEmployees() {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id',
    (err, res) => {
      if (err) throw err
      console.table(res)
      start()
    }
  )
}

// Add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'What is the name of the department?',
    })
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        { name: answer.name },
        (err) => {
          if (err) throw err
          console.log('Department added successfully!')
          start()
        }
      )
    })
}

// Add a role
function addRole() {
  inquirer
    .prompt([
      {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for the role?',
      },
      {
        name: 'department',
        type: 'input',
        message: 'What is the department ID for the role?',
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department,
        },
        (err) => {
          if (err) throw err;
          console.log('Role added successfully!')
          start()
        }
      )
    })
}

// Add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'first_name',
        type: 'input',
        message: "What is the employee's first name? ",
      },
      {
        name: 'last_name',
        type: 'input',
        message: "What is the employee's last name? ",
      },
      {
        name: 'role',
        type: 'input',
        message: "What is the employee's role ID?",
      },
      {
        name: 'manager',
        type: 'input',
        message: "What is the employee's manager ID? ",
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role,
          manager_id: answer.manager,
        },
        (err) => {
          if (err) throw err
          console.log('Employee added successfully!')
          start()
        }
      )
    })
}

// Update an employee role
function updateEmployeeRole() {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err
    inquirer
      .prompt([
        {
          name: 'employee',
          type: 'list',
          message: 'Select an employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          name: 'role',
          type: 'input',
          message: 'Enter the new role ID:',
        },
      ])
      .then((answer) => {
        connection.query(
          'UPDATE employee SET ? WHERE ?',
          [
            { role_id: answer.role },
            { id: answer.employee },
          ],
          (err) => {
            if (err) throw err
            console.log('Employee role updated successfully!')
            start();
          }
        )
      })
  })
}