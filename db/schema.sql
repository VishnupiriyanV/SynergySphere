-- SynergySphere MySQL Schema
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255)
);

CREATE TABLE project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    summary TEXT,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES user(id)
);

CREATE TABLE project_member (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    project_id INT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
);

CREATE TABLE task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    assignee_id INT,
    project_id INT,
    due_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (assignee_id) REFERENCES user(id),
    FOREIGN KEY (project_id) REFERENCES project(id)
);
