var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "192.168.99.100",
  user: "root",
  port: 3306,
  password: "docker",
  database: "bamazon"
});

connection.connect();
generateTable();
function generateTable() {
  connection.query(
    "SELECT item_id, product_name, price FROM bamazon.products;",
    function(err, rows, fields) {
      if (!err) {
        //console.log(rows);
        for (var i = 0; i < rows.length; i++) {
          console.log(
            rows[i].item_id +
              " | " +
              rows[i].product_name +
              " | " +
              rows[i].price
          );
        }
      } else console.log(err);

      getinput();
    }
  );
}

// Create a "Prompt" with a series of questions.
function getinput() {
  inquirer
    .prompt([
      {
        name: "itemId",
        message: "What item id do you want ?"
      },
      {
        name: "quantity",
        message: "How many items do you want?"
      }
    ])
    .then(function(response, error) {
      var user_input_item_id = response.itemId;
      var user_input_quantity = response.quantity;

      //[TBD] Get these two values from console
      // user_input_item_id = 2;
      // user_input_quantity = 100;

      var product_query =
        "SELECT price, stock_quantity FROM bamazon.products where item_id = " +
        user_input_item_id +
        ";";

      var product_quantity_update_query =
        "Update bamazon.products set stock_quantity = stock_quantity - " +
        user_input_quantity +
        " where item_id = " +
        user_input_item_id +
        ";";

      connection.query(product_query, function(err, rows, fields) {
        if (!err) {
          //Check of returned data has a row
          if (rows.length > 0) {
            //First get the value of stock_quantity and price
            //Check if stock_quantity is greater than or equal to user input value
            if (rows[0].stock_quantity < user_input_quantity) {
              //If less, show a message
              console.log("Sorry, insufficient Quantity.");
              getinput();
            } else {
              //Otherwise calculate and show the total cost
              console.log(
                "Your total price is $" +
                  (rows[0].price * user_input_quantity).toFixed(2)
              );
              // and also update inventory
              connection.query(product_quantity_update_query, function(
                err1,
                rows1,
                fields1
              ) {
                if (!err1) console.log("Success! Your order has been placed!");
                process.exit(0);
              });
            }
          } else {
            console.log("Item not found");
          }
        } else console.log(err);
      });
    });
}
