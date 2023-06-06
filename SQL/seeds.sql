
-- add fake data to show the app off
INSERT INTO department (name)
VALUES ("Accounting"),
       ("Sales"),
       ("Customer Service"),
       ("Supplier Relations")

INSERT INTO role(title, salary, department_id)
VALUES ('Accountant', 70000, 1),
('Sales Person', 95000, 2),
('C.S rep', 65000, 3),
('S.R Staff', 70000, 4)

INSERT INTO employee(first_name, last_name, manager_id, department_id)
VALUES ('Oscar', 'Martinez', 0, 1),
('Angela', 'Martin', 1, 1),
('Kevin', 'Malone', 0, 1),
('Dwight', 'Shrute', 2, 2),
('Jim', 'Halpert', 0, 2),
('Stanley', 'Hudson', 0, 2),
('Maradeth', 'Palmer', 3, 3),
('Creed', 'Bratton', 0, 3),
('Kelly', 'Kapoor', 4, 4),
('Ryan', 'Howard', 0, 4),
