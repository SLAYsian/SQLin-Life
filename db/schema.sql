-- SECTION: CREATE DB -> USE DB
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

-- SECTION: CREATE TABLES
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- NOTES: ROLE TABLE REFERENCES DEPARTMENT
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  -- is_manager BOOLEAN,
  department_id INT,
  -- NOTES: Reference department
  FOREIGN KEY (department_id) 
  REFERENCES department(id)
  ON DELETE SET NULL
);

-- NOTES: EMPLOYEE TABLE REFERENCES ROLE AND MANAGER
CREATE TABLE employee (
 id INT AUTO_INCREMENT PRIMARY KEY,
 first_name VARCHAR(30) NOT NULL,
 last_name VARCHAR(30) NOT NULL,
 role_id INT,
 manager_id INT,
--  NOTES: Reference role
FOREIGN KEY (role_id) 
REFERENCES role(id)
ON DELETE SET NULL,
-- NOTES: Reference manager
FOREIGN KEY (manager_id)
REFERENCES employee(id)
ON DELETE SET NULL
);