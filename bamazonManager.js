var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
	host : "localhost",
	port : 3306,
	user :  "root",
	password : "root",
	database : "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  menuOptions();
});

function menuOptions(){
	inquirer.prompt(
		{
			name : "listOptions",
			type: "list",
			message : "Please select an option",
			choices: [
				"1) View Products for Sale",
				"2) View Low Inventory",
				"3) Add to Inventory",
				"4) Add New Product"
			]
		}
	).then(function(answer){
		if(answer.listOptions === "1) View Products for Sale"){
			//Debug to see if inquirer is working
			console.log("\n" + "Items for sell:" + "\n");
			var query = "SELECT * FROM products";
			connection.query(query, function(err, res){
				if(err) throw err;
				for (var i = 0; i < res.length; i++){
					console.log(
						res[i].item_id + " |*| " +
						res[i].product_name + " |*| " + 
						res[i].department_name + " |*| " + 
						res[i].price + " |*| " + 
						res[i].quantity
					);
				}
				console.log("\n");
				menuOptions();
			});
		}

		if(answer.listOptions === "2) View Low Inventory"){
			console.log("\n" + "Items with inventory less than 5:" + "\n");
			var query = "SELECT product_name FROM products WHERE quantity < 5";
			connection.query(query, function(err, res){
				if(err) throw err;
				for (var i = 0; i < res.length; i++){
					console.log(res[i].product_name);
				}
				console.log("\n");
				menuOptions();
			});
		} 
		if(answer.listOptions === "3) Add to Inventory"){
			addInventory();
		}

		if(answer.listOptions === "4) Add New Product"){
			addNewProduct();
		}
	});
}

function addInventory(){
	inquirer.prompt(
	[
		{
			name : "productName",
			type : "list",
			message : "Select product to add:",
			choices : [
				"10w-30, Synthetic Motor",
	   			"Ceramic Brake Pads", 
	   			"Car Wash",
	     		"Platnium Spark Plugs", 
	     		"Cabin Filter", 
	    			"26 inch, Wiper Blade",
	     		"Alternator",
	     		"Platnium Series, Cold Start Battery", 
	     		"AC Refrigerent",
	     		"Fuel Pump"
			],
			//Prevent list from looping
			pageSize: 10
		},
		{
			name : "quantity",
			type : "input",
			message : "Enter quantity",
			validate : function (value){
				if (isNaN(value) === false){
					return true;
				} else {
					return false;
				}
			}
		}
	]).then(function(answer){
		var query = "SELECT product_name, quantity FROM products WHERE product_name = ?";
		connection.query(query, answer.productName, function(err, res){
			if(err) throw err;
			for(var i = 0; i < res.length; i++){
				var inStock = res[i].quantity;
				//console.log(">>>>>Quantity Instock: " +  res[i].quantity);
				var addToStock = answer.quantity;
				//console.log("<<<<<Quantity Added to Stock: " + addToStock);
				//Add + infront of variables so they are numbers not strings
				var newStock = +inStock + +addToStock;
				//console.log("<<<>>>>New Stock: " + newStock);
				connection.query(
					"UPDATE products SET ? WHERE ?",
					[
						{
							quantity : newStock
						},
						{
							product_name: answer.productName
						}
					],					
					function(err, res){
						if(err) throw err;
						console.log("Stock updated!");
						console.log("\n");
						menuOptions();		
					}
				);
			}

		});

	});

}

function addNewProduct(){
	inquirer.prompt(
		[
			{
				name : "addProduct",
				type : "input",
				message : "Enter the name of the product you would like to enter"
			},
			{
				name : "departmentName",
				type : "input",
				message : "Enter the department name"
			},
			{
				name : "productPrice",
				type : "input",
				message : "Enter price of product",
				validate : function (value){
					if (isNaN(value) === false){
						return true;
					} else {
						return false;
					}
				}
			},
			{
				name : "productQuantity",
				type : "input",
				message : "Enter product quantity",
				validate : function (value){
					if (isNaN(value) === false){
						return true;
					} else {
						return false;
					}
				}
			}
		]
	).then(function(answer){
		connection.query(
			"INSERT INTO products SET ?",
			{
				product_name : answer.addProduct,
				department_name : answer.departmentName,
				price : answer.productPrice,
				quantity :  answer.productQuantity
			},
			function(err, res){
				if(err) throw err;
				console.log("Product added to database");
				console.log("\n");
				menuOptions();				
			}
		);
	});
}