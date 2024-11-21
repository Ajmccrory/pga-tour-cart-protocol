-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cart_management;
USE cart_management;

-- Create tables
CREATE TABLE IF NOT EXISTS person (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(120) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_number VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    battery_level INT,
    current_location VARCHAR(100),
    checkout_time DATETIME,
    return_by_time DATETIME,
    assigned_to_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_id) REFERENCES person(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX idx_cart_status ON cart(status);
CREATE INDEX idx_cart_assigned ON cart(assigned_to_id);
CREATE INDEX idx_person_role ON person(role); 

-- Add return_by_time column to cart table
ALTER TABLE cart
ADD COLUMN return_by_time DATETIME NULL;