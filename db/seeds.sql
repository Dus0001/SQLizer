INSERT INTO department (id, name) VALUES 
(1,'Qaulity Assurance'),
(2, 'GMP'),
(3,'Qaulity Control'),
(4, 'Flow Cytometry');

INSERT INTO role (id, title, salary, department_id) VALUES
(1, 'Associate',45000, 1),
(2, 'Specialist', 50000, 3),
(3,'Specialist II', 75000,2),
(4,'Senior', 82000,4);

INSERT INTO employee (id, first_name, last_name, role_id) VALUES 
(1,"David", "Banks",4),
(2,"Amanda","Snyder", 3),
(3,"Lisa","Thompson",2),
(4, "Marissa","Peyton",1);
