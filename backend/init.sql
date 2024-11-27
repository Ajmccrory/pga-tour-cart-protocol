-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cart_management;
USE cart_management;

-- Create tables
CREATE TABLE IF NOT EXISTS person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    battery_level INT,
    checkout_time DATETIME,
    return_by_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create association table for cart assignments
CREATE TABLE IF NOT EXISTS cart_assignments (
    cart_id INT,
    person_id INT,
    PRIMARY KEY (cart_id, person_id),
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES person(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_cart_status ON cart(status);
CREATE INDEX idx_person_role ON person(role);