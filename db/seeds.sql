INSERT INTO department (name)
VALUES ('Human Resources'),
      ('Private Client'),
      ('Client Development'),
      ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES ('People Partner', 70000, 1),
       ('Head of People Partnering', 90000, 1),
       ('Stylist', 70000, 2),
       ('Regional Sales Manager', 95000, 2),
       ('Client Development Executive', 65000, 3),
       ('Client Development Manager', 95000, 3),
       ('Operations Executive', 60000, 4),
       ('Operations Manager', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Bruce', 'Wayne', 2),
       ('Natasha', 'Romanoff', 4),
       ('Black', 'Panther', 6),
       ('Tony', 'Stark', 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alfred', 'Pennyworth', 1, 1),
       ('Yelena', 'Belova', 3, 2),
       ('Erik', 'Killmonger', 5, 3),
       ('Happy', 'Hogan', 7, 4);