CREATE DATABASE IF NOT EXISTS superstock_db;
USE superstock_db;

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  min_stock INT NOT NULL DEFAULT 0,
  category_id INT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

INSERT IGNORE INTO categories (name) VALUES ('Lácteos'), ('Abarrotes'), ('Limpieza'), ('Frutas');