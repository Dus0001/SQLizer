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
            viewAllEmployees
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
            return;
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
        return
     }

     console.table(row)
   });
   return mainMenu();
};


mainMenu();