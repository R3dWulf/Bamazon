DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products;

CREATE TABLE products (
  item_id INT auto_increment NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("10w-30, Synthetic Motor, Oil 1qt", "Motor-Oil", 9.95, 18 ),
	   ("Ceramic Brake Pads", "Brakes", 42.99, 4),
	   ("Car Wash", "Chemicals", 5.99, 6),
	   ("Platnium Spark Plugs", "Ignition", 19.99, 22),
	   ("Cabin Filter", "Filters", 24.99, 2),
	   ("26 inch, Wiper Blade", "Wiper Blades", 14.95, 8),
	   ("Alternator", "Alternator", 139.99, 1),
	   ("Platnium Series, Cold Start Battery", "Batteries", 122.95, 2),
	   ("AC Refrigerent", "Air Conditioning", 63.99, 7),
	   ("Fuel Pump", "Fuel", 239.99, 3);
       
