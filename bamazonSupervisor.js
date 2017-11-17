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
  supervisorWork();
});

function supervisorWork() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: 
      [
        "View List of Departments",
        "View Product Sales by Department",
        "Create New Department"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View List of Departments":
          viewlistofDepts();
          break;
        case "View Product Sales by Department":
          viewSalesbyDept();
          break;
        case "Create New Department":
          createNewDept();
          break;
      };//end of switch statement
    });//end of .then functio 
};//end of supervisorWork()

function viewlistofDepts () {
  var query = "SELECT * FROM departments";
  connection.query(query, function (err, res) {
    if (err) throw (err);
    //for (var i=0; i<res.length; i++) {
      //console.log('Dept ID: ' + res[i].department_id, ' || Dept Name: '+ res[i].department_name, ' || Dept Overhead Costs: ' + res[i].over_head_costs)
      console.table(res)
    //};//end of for loop
  supervisorWork();
  });//end of query callback function
};//end of viewlistofDepts()

function viewSalesbyDept () {
  var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) as product_sales, SUM(products.product_sales) - departments.over_head_costs as total_profit FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id";
    connection.query(query, function (err, res) {
      console.table(res)
      supervisorWork()
    });//end of query callback function
};//end of viewSalesbyDept()

function createNewDept () {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Enter Department Name"
      },
      {
        name: "over_head_costs",
        type: "input",
        message: "Overhead Costs"
      },
    ])
    .then(function(answer) {
      connection.query("INSERT INTO departments SET ?",
        {
          department_name: answer.name,
          over_head_costs: answer.over_head_costs
        },
        function(err) {
          if (err) throw err;
          console.log("----------------------")
          console.log("The department has been added");
          console.log("----------------------")
          supervisorWork();
        });//end of query callback function
    });//end of .then function
};//end of createNewDept()