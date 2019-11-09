var inquirer = require("inquirer");

// Create a "Prompt" with a series of questions.

inquirer
.prompt([
  {
    name: 'itemId',
    message: 'What item id do you want ?'
  },
  {
      name: "quantity",
      message: "How many items do you want?"
  }
])
.then(function(response, error) {
  console.log(response.itemId);
  console.log(response.quantity);