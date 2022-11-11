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
        choices: ['View all departments', 'View all Roles','View all employees','Add a department', 'Add a role', 'Add an employee','Update an employee role', "I'm Finished"]
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
        } else if(results.action === "I'm finished"){
            endPrompt();
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

mainMenu();