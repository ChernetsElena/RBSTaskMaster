CREATE DATABASE taskmaster;

CREATE SCHEMA taskmaster;

CREATE TABLE taskmaster.ref_urgently (
    pk_id serial PRIMARY KEY,
    c_value varchar(20)
);

COMMENT ON TABLE taskmaster.ref_urgently IS 'справочник типов срочности';

COMMENT ON COLUMN taskmaster.ref_urgently.c_value IS 'строковое представление типа срочности';

CREATE TABLE taskmaster.ref_statuses (
    pk_id serial PRIMARY KEY,
    c_value varchar(20)
);

COMMENT ON TABLE taskmaster.ref_statuses IS 'справочник статусов задач';

COMMENT ON COLUMN taskmaster.ref_statuses.c_value IS 'строковое представление статусов задач';

CREATE TABLE taskmaster.ref_positions (
    pk_id serial PRIMARY KEY,
    c_value varchar(100)
);

COMMENT ON TABLE taskmaster.ref_positions IS 'справочник должностей';

CREATE TABLE taskmaster.t_employees (
    pk_id serial PRIMARY KEY,
    fk_position int NOT NULL REFERENCES taskmaster.ref_positions, 
    c_name varchar(50) NOT NULL,
    c_lastname varchar(50) NOT NULL,
    c_middlename varchar(50),
    c_email varchar(50),
    c_date_of_birth date
);

COMMENT ON TABLE taskmaster.t_employees IS 'таблица сотрудников';

CREATE TABLE taskmaster.t_users (
    pk_id serial PRIMARY KEY,
    fk_employee int NOT NULL REFERENCES taskmaster.t_employees,
    c_login varchar(50) NOT NULL,
    c_password bytea NOT NULL
);

COMMENT ON TABLE taskmaster.t_users IS 'таблица пользователей';

CREATE TABLE taskmaster.t_projects (
    pk_id serial PRIMARY KEY,
    fk_teamlead int REFERENCES taskmaster.t_employees,
    c_name varchar(50) NOT NULL,
    c_description text,
    c_color_one varchar(7) NOT NULL,
    c_color_two varchar(7) NOT NULL
);

COMMENT ON TABLE taskmaster.t_projects IS 'таблица проектов';

CREATE TABLE taskmaster.t_tasks (
    pk_id serial PRIMARY KEY,
    fk_performer int REFERENCES taskmaster.t_employees,
    fk_project int NOT NULL REFERENCES taskmaster.t_projects ON DELETE CASCADE,
    fk_status int NOT NULL REFERENCES taskmaster.ref_statuses,
    fk_urgently int NOT NULL REFERENCES taskmaster.ref_urgently,
    c_name varchar(50) NOT NULL,
    c_description text,
    c_plan_time time without time zone,
    c_fact_time time without time zone
);

COMMENT ON TABLE taskmaster.t_tasks IS 'таблица задач';


INSERT INTO taskmaster.ref_urgently (pk_id, c_value) VALUES (1, 'Нормально');
INSERT INTO taskmaster.ref_urgently (pk_id, c_value) VALUES (2, 'Срочно');
INSERT INTO taskmaster.ref_urgently (pk_id, c_value) VALUES (3, 'Очень срочно');


INSERT INTO taskmaster.ref_statuses (pk_id, c_value) VALUES (1, 'Новая');
INSERT INTO taskmaster.ref_statuses (pk_id, c_value) VALUES (2, 'Назначена');
INSERT INTO taskmaster.ref_statuses (pk_id, c_value) VALUES (3, 'В работе');
INSERT INTO taskmaster.ref_statuses (pk_id, c_value) VALUES (4, 'Пауза');
INSERT INTO taskmaster.ref_statuses (pk_id, c_value) VALUES (5, 'Согласование');
INSERT INTO taskmaster.ref_statuses (pk_id, c_value) VALUES (6, 'Решена');


INSERT INTO taskmaster.ref_positions (pk_id, c_value) VALUES (1, 'Инженер-программист');
INSERT INTO taskmaster.ref_positions (pk_id, c_value) VALUES (2, 'Инженер');
INSERT INTO taskmaster.ref_positions (pk_id, c_value) VALUES (3, 'Программист');


INSERT INTO taskmaster.t_employees (pk_id, fk_position, c_name, c_lastname, c_middlename, c_email, c_date_of_birth) 
VALUES (1, 1, 'Иван', 'Иванов','Иванович', 'i.ivanov@mail.ru', '1995-10-16');

INSERT INTO taskmaster.t_employees (pk_id, fk_position, c_name, c_lastname, c_middlename, c_email, c_date_of_birth) 
VALUES (2, 3, 'Петр', 'Петров','Петрович', 'p.petrov@mail.ru', '1990-01-15');

INSERT INTO taskmaster.t_employees (pk_id, fk_position, c_name, c_lastname, c_middlename, c_email, c_date_of_birth) 
VALUES (3, 2, 'Сидр', 'Сидоров','Сидорович', 's.sidorov@mail.ru', '1985-07-11');


INSERT INTO taskmaster.t_users (pk_id, fk_employee, c_login, c_password) 
VALUES (1, 31, 'admin', '\x21232f297a57a5a743894a0e4a801fc3');


INSERT INTO taskmaster.t_projects (pk_id, fk_teamlead, c_name, c_description, c_color_one, c_color_two) 
VALUES (1, 1, 'Название проекта 1', 'Описание проекта 1 Описание проекта 1 Описание проекта 1 Описание проекта 1', '#ff1200', '#ff8383');

INSERT INTO taskmaster.t_projects (pk_id, fk_teamlead, c_name, c_description, c_color_one, c_color_two) 
VALUES (2, 2, 'Название проекта 2', 'Описание проекта 2 Описание проекта 2 Описание проекта 2 Описание проекта 2', '#2e4eff', '#6fb5ff');

INSERT INTO taskmaster.t_projects (pk_id, fk_teamlead, c_name, c_description, c_color_one, c_color_two) 
VALUES (3, 2, 'Название проекта 3', 'Описание проекта 3 Описание проекта 3 Описание проекта 3 Описание проекта 3', '#BF27D9', '#f29cf1');

INSERT INTO taskmaster.t_projects (pk_id, fk_teamlead, c_name, c_description, c_color_one, c_color_two) 
VALUES (4, 1, 'Название проекта 4', 'Описание проекта 4 Описание проекта 4 Описание проекта 4 Описание проекта 4', '#05970B', '#fff345');

INSERT INTO taskmaster.t_projects (pk_id, fk_teamlead, c_name, c_description, c_color_one, c_color_two) 
VALUES (5, 3, 'Название проекта 5', 'Описание проекта 5 Описание проекта 5 Описание проекта 5 Описание проекта 5', '#F70000', '#a59eff');

INSERT INTO taskmaster.t_projects (pk_id, fk_teamlead, c_name, c_description, c_color_one, c_color_two) 
VALUES (6, 1, 'Название проекта 6', 'Описание проекта 6 Описание проекта 6 Описание проекта 6 Описание проекта 6', '#f98c00', '#ff0048');


INSERT INTO taskmaster.t_tasks (pk_id, fk_performer, fk_project, fk_status, fk_urgently, c_name, c_description, c_plan_time, c_fact_time) 
VALUES (1, null, 1, 1, 1, 'Название задачи 1', 'Описание задачи 1 Описание задачи 1 Описание задачи 1', null, null);

INSERT INTO taskmaster.t_tasks (pk_id, fk_performer, fk_project, fk_status, fk_urgently, c_name, c_description, c_plan_time, c_fact_time) 
VALUES (2, 2, 1, 2, 3, 'Название задачи 2', 'Описание задачи 2 Описание задачи 2 Описание задачи 2', null, null);

INSERT INTO taskmaster.t_tasks (pk_id, fk_performer, fk_project, fk_status, fk_urgently, c_name, c_description, c_plan_time, c_fact_time) 
VALUES (3, 3, 1, 3, 1, 'Название задачи 3', 'Описание задачи 3 Описание задачи 3 Описание задачи 3', '01:30:00', null);

INSERT INTO taskmaster.t_tasks (pk_id, fk_performer, fk_project, fk_status, fk_urgently, c_name, c_description, c_plan_time, c_fact_time) 
VALUES (4, 1, 1, 4, 2, 'Название задачи 4', 'Описание задачи 4 Описание задачи 4 Описание задачи 4', '01:30:00', null);

INSERT INTO taskmaster.t_tasks (pk_id, fk_performer, fk_project, fk_status, fk_urgently, c_name, c_description, c_plan_time, c_fact_time) 
VALUES (5, 2, 1, 5, 2, 'Название задачи 5', 'Описание задачи 5 Описание задачи 5 Описание задачи 5', null, null);

INSERT INTO taskmaster.t_tasks (pk_id, fk_performer, fk_project, fk_status, fk_urgently, c_name, c_description, c_plan_time, c_fact_time) 
VALUES (6, 3, 1, 6, 1, 'Название задачи 6', 'Описание задачи 6 Описание задачи 6 Описание задачи 6', '02:30:00', '02:00:00');
