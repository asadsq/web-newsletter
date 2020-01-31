const express = require ('express');
const bodyParser = require ('body-parser');
const request = require ('request');        // you don't need anything else actually, to use this. 

// this is how you use the express module
const app = express();

// we need to use the method below to show our static files
// aka our local custom css file and our locally saved image
// we're gonna our folder "public" - that holds our static files
app.use(express.static("public"));

// this is how you use body-parser module
app.use( bodyParser.urlencoded( {extended : true} ) );

// get method for home route
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

// post method for handling the sign up stuff - name, email etc
app.post("/", function(req, res) {    
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    //console.log(firstName, lastName, email);

    // *** mail chimp stuff begins ***

    // you create a javascript object that will contain your data, that needs to be posted
    var data = {
        // members will be an array of objects, as advised by mail chimp
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    // convert the javascript object "data" above to a JSON object
    var jsonData = JSON.stringify(data);

    // let's create an object called options that will be passed to the request method below
    var options  = {
        url: "https://us5.api.mailchimp.com/3.0/lists/fe359c43a6",
        method: "POST",
        headers: {
                                // any string, then a space, then the API key
            "Authorization" : "asad1 35b3fac787a5ee2395c39bb4c081df18-us5"    // this is how you use basic http auth
        },
        body: jsonData
    };

    // let's use our request module, that we imported at the top
    request(options, function(error, response, body){
        if (error) {
            //res.send("There was an error while signing up, please try again");
            res.sendFile(__dirname + "/failure.html");
        }
        else {
            // mailchimp's server sends a response
            // and we can use the status code to see what's going on
            console.log("The response status code is: " + response.statusCode);
            
            // playing around with body -- we don't actually use it 
            //console.log(body.new_members.email_address);

            if (response.statusCode === 200) {
                //res.send("Successfully subscribed!");
                res.sendFile(__dirname + "/success.html");
            }
            else {
                //res.send("There was an error while signing up, please try again");
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });
});

// this post method handles the case, when we want our user to try again
// if they failed to sign up...
app.post("/failure", function(req, res){
    res.redirect("/");
});

// the listen method for app
// takes in 2 inputs, as you can see
// now making a small change - for heroku, we add the process.env.port line
// so it can assign a port for our website dynamically
// or we give an option to run locally on port 3000 for our testing
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on assigned port or 3000");
});

// api key from mail chimp
// 35b3fac787a5ee2395c39bb4c081df18-us5

// list/audience id
// fe359c43a6