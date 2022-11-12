const { Console } = require('console');
const express = require('express');
const inquirer = require('inquirer');
const db = require('./db/connections')

//Create prompts for main menu
const mainMenu = () => {
    inquirer.prompt([
        {
        type:'list',
        name:'action',
        message: 'Please choose an action below.',
        choices: ['View all departments', 'View all Roles','View all employees','Add a department', 'Add a role', 'Add an employee','Update an employee role']
        }
    ])
    .then(results => {
        console.log(results.action);
        if(results.action === 'View all departments'){
            console.log('it works')
            viewAllDepartment();
        } else if(results.action === 'View all Roles'){
            viewAllRoles();
        } else if(results.action === 'View all employees'){
            viewAllEmployees();
        } else if (results.action === 'Add a department'){
            addDepartment();
        } else if(results.action === 'Add a role'){
            addRole();
        } else if (results.action === 'Add an employee'){
            addEmployee();
        } else if (results.action ==='Update an employee role'){
            updateEmployeeRole();
        };
    });

    
};

viewAllDepartment = () => {

    const sql = `SELECT departments.id, departments.name AS departments FROM departments`;

    db.query(sql,(err, row) => {
        if(err){
            console.log(err)
            return mainMenu
        }
        console.table(row);
    });
  return mainMenu()
};

viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, role.salary, departments.name AS department FROM role LEFT JOIN departments ON role.department_id = departments.id`;
   db.query(sql, (err, row) => {
     if(err){
        console.log(err);
        return mainMenu
     }

     console.table(row)
   });
   return mainMenu();
};

viewAllEmployees = () => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, departments.name, role.title AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN departments ON role.department_id = departments.id`
        db.query(sql, (err, row) => {
            if(err){
                console.log(err);

                return mainMenu
            }
            console.table(row);
        });
        return mainMenu();
}

addDepartment = () => {

    inquirer.prompt([
        {
            type:'input',
            name: 'name',
            message:'What would you like to name your new department?',
            validate: nameInput => {
                if(!nameInput){
                    return false;
                }
                return true;
            }

        }
    ])
    .then(input => {
        console.log(input.name);
        const sql = `INSERT INTO departments (name) VALUES (?)`;
        const params = input.name;
        
        db.query(sql, params, (err,result) => {
            if(err){
                console.log(err);
                return mainMenu();
            }
            console.log("Added new department" + result + "!");
            return mainMenu();
        })
    });
    
};

addRole = () => {
    
    const sql = `Select name, id FROM departments`
        db.query(sql, (err,row) => {
            if(err){
                console.log(err);
            }

            const departmentsData = row.map(({name, id}) => (({name:name,value:id})));
            console.log(departmentsData);
           
            inquirer.prompt([
        
                {
                    type: 'input',
                    name: 'title',
                    message:'Please enter the name of the role',
                },
                {
                    type:'input',
                    name:'salary',
                    message:"Please enter the role's salary",
                },
                {
                    type:'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: departmentsData,
                }
            ])
            .then(newRole => {
                const sql = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)';
                const params = [newRole.title, newRole.salary, newRole.department];
                db.query(sql,params, (err, results) => {
                    if(err){
                       return console.log(err);
                    }
                    console.log('Added '+ newRole.title + ' to roles!') 
                    return mainMenu();
                });
            });
        })
    
};

addEmployee = () => {
    const sql = `SELECT role.id, role.title FROM role`;
    db.query(sql,(err, result) =>{
        if(err){
            return console.log(err);
        }
        const roleChoices = result.map(({id,title}) => ({name:title, value:id}));
        inquirer.prompt([
            {
                type:'input',
                name:'first_name',
                message: 'Please enter the employee first name.',
                validate: firstNameInput => {
                    if (!firstNameInput){
                        console.log('Please enter a first name!')
                        return false;
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Please enter the employee last name.',
                vazlidate: lastNameInput => {
                    if (!lastNameInput){
                        console.log('Please enter a last name!');
                        return false;
                    }
                    return true;
                }
            },
            {
                type:'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roleChoices,
            },
        ])
        .then(newEmployee => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)`;
            const params = [newEmployee.first_name, newEmployee.last_name, newEmployee.role];
            db.query(sql, params, (err, data) =>{
                if(err){
                    return console.log(err);
                }
                console.log('Added ' + newEmployee.first_name + ' to employee!');
                return mainMenu();
            });

        });
    });
};

updateEmployeeRole = () => {
    const sql = `SELECT * FROM employee`;
    const params = [];
    db.query(sql,(err, data) =>{
        if(err){
            console.log(err);
        }
        const employees = data.map(({id, first_name, last_name}) => ({name: first_name + ' ' + last_name, value: id}));
        inquirer.prompt([
            {
                type:'list',
                name:'employee',
                message: 'Who do you wish to update?',
                choices: employees,
            }
        ])
        .then(employeeSelected => {
            const employeeID = employeeSelected.employee;
            console.log(employeeSelected);
            params.push(employeeID);
            const sql = `SELECT * FROM role`;
            db.query(sql, (err, data) =>{
                if(err){
                    console.log(err);
                }
                const roles = data.map(({id, title}) => ({name:title, value:id}));
                inquirer.prompt({
                    type:'list',
                    name:'role',
                    message:'Please select a new role.',
                    choices: roles,
                })
                .then(roleSelected =>{
                    const newRole = roleSelected.role;
                    params.push(newRole);
                    const sql =`UPDATE employee SET role_id = ? Where id = ?`
                    db.query(sql,params.reverse(), (err, data) => {
                        if(err){
                            console.log(err);
                        }
                        console.log('Updated '  + employeeSelected.name + ' role!');
                        return mainMenu();
                    });
                });
            });
        });
    });
};

endPrompt = () =>{
    prompt.complete();
}

mainMenu();