//Load the NPM Package inquirer
var userSearchID;
var customerDemand;
var customerItemID;
var customerDeptName;
var customerProdName;
var customerPrice;
var customerTotal;
var inquirer = require("inquirer");
var mysql = require ("mysql");
var connection = mysql.createConnection({
                  host: "localhost",
                  port: 3306,
                  user: "root",
                  password: "",
                  database: "bamazon"
                });
connection.connect(function(err) {
  if (err) {throw err};
  searchProduct()
});

function searchProduct() {// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    {
      type: "input",
      message: "Key in the product ID",
      name: "productID"
    },
   {
      type: "input",
      message: "How many would you like?",
      name: "customerDemand"
    },
  ])
  .then(function(inquirerResponse) {
    userSearchID = inquirerResponse.productID;
    customerDemand = inquirerResponse.customerDemand;
 
    connection.query("SELECT * FROM products WHERE?",
      [
        {
          item_id: userSearchID,
        }
      ], 
      function (err, res) {
      if (err) throw err 
        itemID = res[0].item_id;
        deptName = res[0].department_name;
        productName = res[0].product_name;
        priceperUnit = res[0].price;
        totalCost = priceperUnit*customerDemand;
        newQuantity = res[0].stock_quantity-customerDemand;
        currentRevenue = res[0].product_sales;
        newRevenue = currentRevenue + totalCost;

        if (customerDemand <= res[0].stock_quantity) {
          connection.query("UPDATE products SET? WHERE?",
            [
              {
                stock_quantity: newQuantity,
                product_sales: newRevenue

              },
              {
                item_id: itemID
              }
            ],
            function(err, res) {
              if (err) throw err;
          });//end of the UPDATE connection.query
          placeOrder();
        }//end of if atatement
        else {
          console.log("We are sorry, we don't have enough supply of this product. We only have " +res[0].stock_quantity+ " units left.  Try a different quantity.");
          searchProduct()
        };//end of else statement
      });//end of SELECT query callback function
  });//end of .then inqurierResponse function
};//end of searchProduct()


function placeOrder () {
  console.log('------------------------')
  console.log('Product ID: ' + itemID)
  console.log('Product Department: ' + deptName)
  console.log('Product Name: ' + productName)
  console.log('Price per Unit: $' + priceperUnit)
  console.log('TOTAL: $' + totalCost)
  console.log('------------------------')
  searchProduct()
};
