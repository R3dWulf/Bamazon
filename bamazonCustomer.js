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
  readProducts();
});


//===================================Functions============================================================================
function readProducts() {
  console.log("Selecting all...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++){
    		console.log(
    			"Item ID: " + res[i].item_id + " |*| " +
    			"Product Name: " + res[i].product_name + " |*| " +
    			"Price: " + res[i].price + "\n"
    		);
	}
    //connection.end();
    twoMessages();
  });
}

function twoMessages(){
	inquirer.prompt(
	[
		{
			name : "id",
			type: "input",
			message : "What is the id of the product you would like to buy?",
			choices : ["1","2","3","4","5","6","7","8","9","10"]
		},
		{
			name : "quantity",
			type : "input",
			message : "How many would you like to buy?",
			validate : function (value){
				if (isNaN(value) === false){
					return true;
				} else {
					return false;
				}
			}
		}
	]).then(function(answer){
		//console.log("ID Picked: " + answer.id + "\n" + "Quantity Picked: " + answer.quantity);
		var query = "SELECT quantity FROM products WHERE item_id = ?";
		connection.query(
			query,  
			answer.id, 
			function(err, res){
				if (err) throw err;
				for(var i = 0; i < res.length; i++){
					//console.log(res[i].quantity);
					// Check to see if quantity ordered is greater than stock inventory
					if(res[i].quantity < answer.quantity){
						console.log("The quantity requested is not in stock, canceling order.");
					} else {
						//Substract user purchase quantity from stock
						var updateStock = res[i].quantity - answer.quantity;
						// Update the stock
						connection.query("UPDATE products SET ? WHERE ?",
							[
								{
									quantity : updateStock
								},
								{
									item_id : answer.id
								}
							],
							function(err, res){
								if(err) throw err;
								console.log( " products updated!\n");
							}
						);
						//Get purchase total
						connection.query(
							"SELECT price FROM products WHERE ?",
							 answer.id,
							 function(err, res){
							 	if (err) throw err;
							 	var purchasePrice = res[i].price * answer.quantity;
							 	var tax = parseInt(purchasePrice * .07);
							 	var shipping = 8.99;
							 	var total = parseInt(purchasePrice + tax + shipping);
							 	var orderNumber = Math.floor(Math.random() * 999999) + 100000;
							 	console.log(
							 		"Purchase Price: " + purchasePrice + "\n" +
							 		"Tax: " + tax + "\n" +
							 		"Shipping: " + shipping + "\n" +
							 		"Total: " + total+ "\n" +
							 		"Thank you for your order!" + "\n" +
							 		"Your Order number is: #" + orderNumber
							 	);
							 }
						);
					}

				}
			}
		);
	});
}


//=========================================================================================================================

