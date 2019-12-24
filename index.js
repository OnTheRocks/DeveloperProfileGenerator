const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "What is your GitHub Username?"
    },
    {
      type: "list",
      name: "color",
      message: "Pick a color.",
      choices: ["Green", "Black", "Blue", "Purple"]
    }
  ]);
}



function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">My GitHub Username is ${answers.github}</h1>
    <p class="lead">I am from ${answers.location}.</p>
    <h3>Want to meet me? <span class="badge badge-success">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.github}</li>
      <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
}

promptUser()

.then(function(answers) {
  const html = generateHTML(answers);
  // const queryUrl = `https://api.github.com/users/${answers.github}`;
  // const queryUrl = `https://api.github.com/users/${answers.github}/starred`;
  const queryUrl = `https://api.github.com/users/${answers.github}/starred{${answers.github}`;

  
  


  axios
  .get(queryUrl)
  .then(function(res) {
    console.log(res.data);

    console.log()

  return writeFileAsync("result.html", html);
})
.then(function() {
  console.log("Successfully wrote to result.html");
})
.catch(function(err) {
  console.log(err);
});


})