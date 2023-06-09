
DROP DATABASE IF EXISTS track_db;
CREATE DATABASE track_db;
USE track_db;

-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

-- Create the employee table
CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);