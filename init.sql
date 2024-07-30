-- Create Tables
CREATE TABLE Country (
    country_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL
);

CREATE TABLE State (
    state_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(255) NOT NULL,
    country_id BIGINT NOT NULL,
    FOREIGN KEY (country_id) REFERENCES Country(country_id)
);

CREATE TABLE Citys (
    city_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    state_id BIGINT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES State(state_id)
);

CREATE TABLE Address (
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    street TEXT NOT NULL,
    house_number VARCHAR(255) NOT NULL,
    complement TEXT,
    neighborhood TEXT,
    city_id BIGINT NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES Citys(city_id)
);

CREATE TABLE LoginUsers (
    login_user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status BOOL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    address_id BIGINT UNIQUE,
    active BOOL NOT NULL,
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);

CREATE TABLE ActionType (
    action_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('create', 'update', 'delete'))
);

CREATE TABLE UserAudit (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action_type_id BIGINT NOT NULL,
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (action_type_id) REFERENCES ActionType(action_type_id),
    FOREIGN KEY (login_user_id) REFERENCES LoginUsers(login_user_id)
);

-- Insert Init Data

-- Insert Country
INSERT INTO Country (country_name) VALUES
('Brazil');

-- Insert State
INSERT INTO State (state_name, country_id) VALUES
('São Paulo', 1);

-- Insert City
INSERT INTO Citys (city_name, state_id) VALUES
('São Paulo', 1);

-- Insert Address
INSERT INTO Address (street, house_number, complement, neighborhood, city_id, zip_code) VALUES
('Rua Dona Adma Jafet', '91', '115', 'Bela Vista', 1, '01308050');
