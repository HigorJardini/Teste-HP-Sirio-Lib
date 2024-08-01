-- Create Tables
CREATE TABLE Countries (
    country_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL,
    iso_code VARCHAR(20) NOT NULL
);

CREATE TABLE States (
    state_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_name VARCHAR(255) NOT NULL,
    country_id BIGINT NOT NULL,
    iso_code VARCHAR(20) NOT NULL,
    FOREIGN KEY (country_id) REFERENCES Countries(country_id)
);

CREATE TABLE Cities (
    city_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    state_id BIGINT NOT NULL,
    FOREIGN KEY (state_id) REFERENCES States(state_id)
);

CREATE TABLE Addresses (
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    street TEXT NOT NULL,
    house_number VARCHAR(255) NOT NULL,
    complement TEXT,
    neighborhood TEXT,
    city_id BIGINT NOT NULL,
    postal_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (city_id) REFERENCES Cities(city_id)
);

CREATE TABLE UserLogins (
    login_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status BOOL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    address_id BIGINT UNIQUE,
    is_active BOOL NOT NULL,
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id)
);

CREATE TABLE ActionTypes (
    action_type_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('create', 'update', 'delete'))
);

CREATE TABLE UserAuditLogs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action_type_id BIGINT NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (action_type_id) REFERENCES ActionTypes(action_type_id),
    FOREIGN KEY (login_id) REFERENCES UserLogins(login_id)
);
