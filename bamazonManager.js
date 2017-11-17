var inquirer = require("inquirer");
var mysql = require ("mysql");
var consoletable = require('console.table');
var connection = mysql.createConnection({
                  host: "localhost",
                  port: 3306,
                  user: "root",
                  password: "",
                  database: "bamazon"
                });
connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: 
      [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          availableProducts();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addtoInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;
      };//end of switch statement
    });//end of .then function
};//end of runSearch()

function availableProducts() {
  var query = "SELECT * FROM products";
  connection.query(query, function (err, res) {
    if (err) throw (err);
    console.table(res)
    runSearch();
  });//end of queary callback function
};//end of availableProducts()

function viewLowInventory() {
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity <=5";
  connection.query(query, function(err, res) {
    console.table(res)
    runSearch();
  });//end of query callback function
};// end of viewLowInventory()

function addtoInventory() {
  var productID;
  var currentQuantity;
  var quantityToInvetory;
  var newQuantity;
    inquirer
      .prompt([
        {
          name: "productID",
          type: "input",
          message: "Item ID"
        },
        {
          name: "quantityToInvetory",
          type: "input",
          message: "Enter Quantity to be added to Inventory"
        }
      ])
      .then(function (answer) {
        connection.query(
          "SELECT stock_quantity, item_id FROM products WHERE?",
            [
              {
                item_id: answer.productID
              }
            ],
            function(err, res){
              if (err) throw err;
              productID = answer.productID;
              currentQuantity = res[0].stock_quantity;
              quantityToInvetory = parseInt(answer.quantityToInvetory);
              newQuantity = currentQuantity + quantityToInvetory;
              
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: newQuantity,            
                  },
                  {
                    item_id: productID,
                  }
                ],
                function(err, res) {
                  if (err) throw err; 
                  console.log("----------------------")
                  console.log("Quantity of " +quantityToInvetory+" has been added. Now, we have " + newQuantity + " units of this product.")
                  console.log("----------------------")
                  runSearch();
              });//end of the UPDATE connection.query
        });//end of the SELECT connection.query  
      });//end of the .then function
};//end of addtoInventory()

function addNewProduct() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Product Name"
      },
      {
        name: "category",
        type: "input",
        message: "Department Name"
      },
      {
        name: "price",
        type: "input",
        message: "Price per Unit"
      },
      {
        name: "quantity",
        type: "input",
        message: "Quantity"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.category,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;
          console.log("----------------------");
          console.log("The product has been added");
          console.log("----------------------");
          console.log("Here is the list of avaiable products");
          console.log("----------------------");
          availableProducts();
        });// end of query callback function
    });// end of .then function
};// end of addNewProduct()
