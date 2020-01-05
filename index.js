const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require('html-pdf');

// -------------- Prompting user for Github username and a color ---------------

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

promptUser()

// --------------------- Setting API URL and Setting colors variables for result HTML ----

.then(function(answers) {
  const queryUrl = `https://api.github.com/users/${answers.github}`;
  const htmlColors = {
    Green: {
      backGround: "#bae0b8", 
      borderColor: "#00c851",
    },
    Black: {
      backGround: "#bfbfbf",
      borderColor: "black",
    },
    Blue: {
      backGround: "#9999ff",
      borderColor: "#0000ff",
    },
    Purple: {
      backGround: "#b65dc4",
      borderColor: "#e600e6",
    },
  };

  // -------------------- Pulling Github Info back --------------------------

  axios.get(queryUrl)
  .then(function(res) {
  
  // -------------------- Generating result.html -------------------------
    
    function generateHTML() {
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
        <title>${[res.data.name]}</title>
      </head>
      
      <style type="text/css">
      
       body {
        background-image: url("./assets/images/cubes.png");
       }
      
       .container-lg {
      
        border: thin ${htmlColors[answers.color].borderColor} solid;
        box-shadow: ${htmlColors[answers.color].borderColor} 1px 1px 5px 1px;
        margin-top: 50px;
        background-color: ${htmlColors[answers.color].backGround};
       
       }
      
       .jumbotron {
        margin-top: 32px;
        border: thin ${htmlColors[answers.color].borderColor} solid;
        box-shadow: ${htmlColors[answers.color].borderColor} 1px 1px 5px 1px;
        background-image: url("./assets/images/cubes.png");
       }
      
      .jumbotron img {
        float: left;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        object-fit: cover;
        margin-top: -80px;
        border: 4px solid black;
        box-shadow: rgba(0, 0, 0, .5) 5px 1px 20px 4px;
        /* text-align: center; */
        }

      .container {
        width: 100%;
        text-align: left;
        padding: 20px 0 0 0;
      }

      .link {
        display: inline-block;
        margin: 5px 10px 0px 10px;
      }
      
      .card {
        margin: 15px;
        border: thin ${htmlColors[answers.color].borderColor} solid;
        box-shadow: ${htmlColors[answers.color].borderColor} 1px 1px 5px 1px;
        background-color: ${htmlColors[answers.color].backGround};      
      }
      
      #mainHi {
        margin-left: 50px;
        float: right;
      }
      
      .card-title {
        text-align: center;
      } 
      
      a, a:hover {
        text-decoration: none;
        color: inherit;
      }

      .nameBlock {
        margin-left: 80px;
        margin-right: 11px;
      }
        
      </style>
      
      <body>       
        <div class="container-lg col-md-8 offset-md-2">
        <div class="jumbotron col-md-12 offset-md-0">
          <img src="${[res.data.avatar_url]}">          
          <div class = "nameBlock">
          <h1 id mainHi class="display-4 col-md-10 offset-md-3">Hi!</h1>
          <h1 class="display-4 col-md-10 offset-md-3">My Name is ${[res.data.name]}!</h1>
          </div>
          <br>
          <br>      
          <p class="lead">Currently @ ${[res.data.company]} </p>
          <p class="lead">${[res.data.bio]} </p>
          <div class = "container">
            <div class = "link">
              <p class = "lead"><a href = "https://www.google.com/maps/place/${[res.data.location]}" target="blank" title = "https://www.google.com/maps/place/${[res.data.location]}"><i class="fas fa-map-pin"></i> ${[res.data.location]}</a></p>
            </div>
            <div class = "link">
              <p class = "lead"><a href = "${[res.data.html_url]}" target="blank" title = "${[res.data.html_url]}"><i class="fab fa-github-square"></i> GitHub</a></p>
            </div>
            <div class = "link">
              <p class = "lead"><a href = "${[res.data.blog]}" target="blank" title = "${[res.data.blog]}"><i class="fas fa-rss-square"></i> Blog</a></p>
            </div>
          </div>          
        <hr class="my-4">      
          <div class="row justify-content-lg-center ">      
            <div class="card card-title" style="width: 20rem;">
              <div class="card-title card-body ">
                <h5>Public Repositories</h5>
                <h5>${[res.data.public_repos]}</h5>
              </div>
            </div>
          <div class="card card-title" style="width: 20rem;">
            <div class="card-title card-body">
              <h5>Followers</h5>
              <h5>${[res.data.followers]}</h5>
            </div>
          </div>
          <div class="card card-title" style="width: 20rem;">
            <div class="card-title card-body">
              <h5>Public Gists</h5>
              <h5>${[res.data.public_gists]}</h5>
            </div>
          </div>
          <div class="card card-title" style="width: 20rem;">
            <div class="card-title card-body">
             <h5>Following</h5>
             <h5>${[res.data.following]}</h5>
             <h5></h5>
            </div>
          </div>
          </div>
        </div>
      </div>     
      </body>
      </html>`;
    }

  const html = generateHTML();  

// ----------------------------- Generates Results.html and Results.pdf -----------------------------------

  var options = { format: 'Letter',"renderDelay": 3000, };
  fs.writeFileSync("result.html", html);
  pdf.create(html,options).toFile("result.pdf", function(err, res) {
    if (err) return console.log(err);
    console.log(res);
  })
  console.log("Successfully wrote to result.html");
  })
})