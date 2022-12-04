#!/usr/bin/env node

const computation = require("./computation");
const transform = require("./transformation"); //include transformation
const odometryTransform = require("./odometry.js");

const rosnodejs = require("rosnodejs");
const nav_msgs = rosnodejs.require("nav_msgs").msg;
const move_base_msgs = rosnodejs.require("move_base_msgs").msg;

const tf = require("tf-rosnodejs");

const EventEmitter = require("node:events");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

const superagent = require("superagent");

const pickUpTimeTugger = 60;
const pickUpTimeBMW = 60; //in seconds -> estimated time needed for pickup or unloading
let timeToExchange;
let executionTime; //default should be deleted

const express = require("express"); // utility tool for hosting a webserver
const app = express();

var path = require("path"); // utility tool for shortening path names
var bodyParser = require("body-parser"); //utility tool for transfering data
var routes = require("./routes/routes"); //include routes for rendering pages
const multer = require("multer"); //makes it possivle to send URLs and ButtonIDs
const upload = multer({ dest: "uploads/" });
const fs = require("fs"); //enables the writing and reading function for json-Files

let LOC = {
  //template for location.json
  start: "",
  exchange: "",
  end: "",
};

//setup starts Webserver
app.set("port", process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(routes);

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
//setup complete

//Time the whole process takes in seconds

//Communication GUI
//Feedback from Webserver
app.listen(app.get("port"), function () {
  console.log("Server started on port " + app.get("port"));
  fs.writeFileSync("./location.json", JSON.stringify(LOC));
});
//recieve Buttonclick from Selection Pages
app.post("/clicked", upload.none(), function (req, res, next) {
  console.log(req.body);
  var pageid_temp;
  pageid_temp = req.body.url; //Get URL from Selected Page
  pageid_temp = pageid_temp.substring(0, pageid_temp.length - 6); //trim URL to get last character
  pageid_temp = pageid_temp.charAt(pageid_temp.length - 1);
  console.log(pageid_temp);
  buttonid = req.body.button; //get ButtonID
  res.send();
  switch (
    pageid_temp //switch between states with last character of URL
  ) {
    case "t":
      LOC.start = buttonid;
      let datas = JSON.stringify(LOC); //Write ButtonID to location.json
      fs.writeFileSync("./location.json", datas);
      console.log("start:" + buttonid);

      break;
    case "e":
      LOC.exchange = buttonid;
      let datae = JSON.stringify(LOC);
      fs.writeFileSync("./location.json", datae);
      console.log("exchange:" + buttonid);
      break;
    case "d":
      LOC.end = buttonid;
      let datad = JSON.stringify(LOC);
      fs.writeFileSync("./location.json", datad);
      console.log("end:" + buttonid);
      break;
  }
});

// Return selected Data to Client
app.get("/istart", (req, res) => {
  let data = fs.readFileSync("./location.json");
  data = JSON.parse(data);
  res.send(JSON.stringify(data.start));
});
app.get("/iexchange", (req, res) => {
  let data = fs.readFileSync("./location.json");
  data = JSON.parse(data);
  res.send(JSON.stringify(data.exchange));
});
app.get("/iend", (req, res) => {
  let data = fs.readFileSync("./location.json");
  data = JSON.parse(data);
  res.send(JSON.stringify(data.end));
});
//Send Execution Time to Client
app.get("/time", async (req, res) => {
  res.send(JSON.stringify(executionTime));
});

//Errorcheck within summary.ejs --> Data checked in Server
app.get("/errorcheck", (req, res) => {
  let code = 0;
  let data = fs.readFileSync("./location.json");
  data = JSON.parse(data);
  if (data.start != "" && data.exchange != "" && data.end != "") {
    //if construction to check for errors
    if (data.start === data.exchange && data.end === data.exchange) {
      code = 3;
    } else if (data.start === data.exchange && data.end != data.exchange) {
      code = 1;
    } else if (data.end === data.exchange && data.exchange != data.start) {
      code = 2;
    }
  } else {
    code = 3;
  }
  res.send(JSON.stringify(code));
});

//method called for possible Errormessages
app.get("/errormessage", async (req, res) => {
  errormessageGUI = 0; //temporary value
  res.send(JSON.stringify(errormessageGUI));
});

//reset request to set back location.json
app.post("/reset", (req, res) => {
  LOC = {
    start: "",
    exchange: "",
    end: "",
  };
  fs.writeFileSync("./location.json", JSON.stringify(LOC));
  console.log("data received");
});

// start computation
app.post("/execute", (req, res) => {
  console.log("executing");

  rosnodejs
    .initNode("rosNode")
    .then(() => {
      const nh = rosnodejs.nh;
      tf.init(nh);
      let sub = nh.subscribe("/odom", nav_msgs.Odometry, (data) => {
        let tuggerX = data.pose.pose.position.x;
        let tuggerY = data.pose.pose.position.y;
        const transformToMap = tf.getTF("map", data.header.frame_id);

        if (
          tuggerX !== undefined &&
          tuggerY !== undefined &&
          transformToMap !== undefined
        ) {
          myEmitter.emit("trigger", transformToMap, tuggerX, tuggerY); //add parameters
        }
      });

      const ac = rosnodejs.getActionClient({
        actionServer: "/move_base",
        type: "move_base_msgs/MoveBase",
      });

      function sendToTugger(goal1, goal2, drivingTime) {
        //driving time in seconds

        ac.sendGoal(goal1);
        console.log("first goal to tugger");
        console.log(drivingTime);
        setTimeout(() => {
          ac.sendGoal(goal2);
          console.log("second goal to tugger");
        }, drivingTime);
      }

      myEmitter.once("trigger", (transformToMap, tuggerX, tuggerY) => {
        const goal1 = new move_base_msgs.MoveBaseActionGoal();
        const goal2 = new move_base_msgs.MoveBaseActionGoal();

        let tuggerInMap = odometryTransform(transformToMap, tuggerX, tuggerY);
        let coordinates = getCoordinates(
          LOC.start,
          LOC.exchange,
          LOC.end,
          tuggerInMap
        );

        let tuggerPosTransformed = transform(
          coordinates.tuggerX,
          coordinates.tuggerY,
          false,
          false
        );
        //let bmwPosTransformed = transform(coordinates.bmwX, coordinates.tuggerY, false, true);

        /*Put in comments as we do not actually receive the iw.hub robot's position 
        -> added for completeness and in case API offers such functionality*/

        coordinates.tuggerX = tuggerPosTransformed.x;
        coordinates.tuggerY = tuggerPosTransformed.y;

        //coordinates.bmwX = bmwPosTransformed.x;
        //coordinates.bmwY = bmwPosTransformed.y;

        let results = computation(coordinates);
        let boolVehicles = results[0];
        let cache = results[1];
        console.log("Logging time cache: " + String(cache.times));

        try {
          if (boolVehicles === true) {
            //tugger train goes to start, bmw to exchange

            let timeToExchange =
              cache.times.tugger_to_start +
              cache.times.start_tugger_to_exchange +
              pickUpTimeTugger;
            console.log(
              "For the iw.hub to get to the exchange it takes approx. " +
                String(timeToExchange) +
                "s"
            );

            executionTime =
              timeToExchange +
              cache.times.exchange_bmw_to_end +
              2 * pickUpTimeBMW +
              pickUpTimeTugger;
            console.log("Total execution time: " + String(executionTime) + "s");

            let start = transform(
              coordinates.startX,
              coordinates.startY,
              true,
              false
            );
            let exchange = transform(
              coordinates.exchangeX,
              coordinates.exchangeY,
              true,
              false
            );

            goal1.goal.target_pose.pose.position.x = start.x;
            goal1.goal.target_pose.pose.position.y = start.y;
            goal1.goal.target_pose.pose.orientation.w = 1;
            goal1.header.frame_id = "map";
            goal1.goal.target_pose.header.frame_id = "map";

            goal2.goal.target_pose.pose.position.x = exchange.x;
            goal2.goal.target_pose.pose.position.y = exchange.y;
            goal2.goal.target_pose.pose.orientation.w = 1;
            goal2.header.frame_id = "map";
            goal2.goal.target_pose.header.frame_id = "map";

            ac.waitForActionServerToStart();
            sendToTugger(
              goal1,
              goal2,
              Math.imul(cache.times.tugger_to_exchange + pickUpTimeTugger, 1000)
            );
            setTimeout(
              sendtoCloud,
              Math.imul(
                timeToExchange - cache.times.bmw_to_exchange + pickUpTimeTugger,
                1000
              ),
              LOC.exchange,
              LOC.end
            );
          } else if (boolVehicles === false) {
            //send order to bmw cloud first to go to start
            //bmw goes to start tugger to exchange

            timeToExchange =
              cache.times.bmw_to_start +
              cache.times.start_bmw_to_exchange +
              pickUpTimeBMW;
            console.log(
              "For the iw.hub to get to the exchange it takes approx. " +
                String(timeToExchange) +
                "s"
            );

            executionTime =
              timeToExchange +
              cache.times.exchange_tugger_to_end +
              2 * pickUpTimeTugger +
              pickUpTimeBMW; //constant to be changed to more accurate value
            console.log("Total execution time: " + String(executionTime) + "s");

            let exchange = transform(
              coordinates.exchangeX,
              coordinates.exchangeY,
              true,
              false
            );
            let end = transform(
              coordinates.endX,
              coordinates.endY,
              true,
              false
            );

            goal1.goal.target_pose.pose.position.x = exchange.x;
            goal1.goal.target_pose.pose.position.y = exchange.y;
            goal1.goal.target_pose.pose.orientation.w = 1;
            goal1.header.frame_id = "map";
            goal1.goal.target_pose.header.frame_id = "map";

            goal2.goal.target_pose.pose.position.x = end.x;
            goal2.goal.target_pose.pose.position.y = end.y;
            goal2.goal.target_pose.pose.orientation.w = 1;
            goal2.header.frame_id = "map";
            goal2.goal.target_pose.header.frame_id = "map";

            ac.waitForActionServerToStart();
            sendtoCloud(LOC.start, LOC.exchange);
            setTimeout(
              sendToTugger,
              Math.imul(
                timeToExchange + pickUpTimeBMW - cache.times.tugger_to_exchange,
                1000
              ),
              goal1,
              goal2,
              cache.times.tugger_to_exchange * 1000
            ); //convert to ms
          }
        } catch (error) {
          console.error(error);
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
});
//GUI Communication completed

function getCoordinates(start, exchange, destination, tuggerPos) {
  let coordinates = {};
  const a_x = 333;
  const a_y = 316;
  const b_x = 344;
  const b_y = 543;
  const c_x = 473;
  const c_y = 755;
  const d_x = 532;
  const d_y = 687;

  switch (start) {
    case "A":
      coordinates.startX = a_x;
      coordinates.startY = a_y;
      break;
    case "B":
      coordinates.startX = b_x;
      coordinates.startY = b_y;
      break;
    case "C":
      coordinates.startX = c_x;
      coordinates.startY = c_y;
      break;
    case "D":
      coordinates.startX = d_x;
      coordinates.startY = d_y;
      break;
  }
  switch (exchange) {
    case "A":
      coordinates.exchangeX = a_x;
      coordinates.exchangeY = a_y;
      break;
    case "B":
      coordinates.exchangeX = b_x;
      coordinates.exchangeY = b_y;
      break;
    case "C":
      coordinates.exchangeX = c_x;
      coordinates.exchangeY = c_y;
      break;
    case "D":
      coordinates.exchangeX = d_x;
      coordinates.exchangeY = d_y;
      break;
  }
  switch (destination) {
    case "A":
      coordinates.endX = a_x;
      coordinates.endY = a_y;
      break;
    case "B":
      coordinates.endX = b_x;
      coordinates.endY = b_y;
      break;
    case "C":
      coordinates.endX = c_x;
      coordinates.endY = c_y;
      break;
    case "D":
      coordinates.endX = d_x;
      coordinates.endY = d_y;
      break;
  }

  coordinates.tuggerX = tuggerPos.x;
  coordinates.tuggerY = tuggerPos.y;

  coordinates.bmwX = 300; //default values for iw.hub robot as position cannot be requested over API
  coordinates.bmwY = 300;

  return coordinates;
}

function sendtoCloud(firstPOI, secondPOI) {
  let task;

  console.log("sent to cloud -> empty method");

  let order = firstPOI + secondPOI;
  switch (order) {
    case "AB":
      task = "";
      break;
    case "AC":
      task = "";
      break;
    case "AD":
      task = "";
      break;
    case "BA":
      task = "";
      break;
    case "BC":
      task = "";
      break;
    case "BD":
      task = "";
      break;
    case "CA":
      task = "";
      break;
    case "CB":
      task = "";
      break;
    case "CD":
      task = "";
      break;
    case "DA":
      task = "";
      break;
    case "DB":
      task = "";
      break;
    case "DC":
      task = "";
      break;
  }

  superagent
    .get("https://staging.api.anyfleet.idealworks.com/externaltask/trigger")
    .set({
      "x-api-key": "",
      "key-id": "",
    })
    .query({ taskID: task })
    .end(function (err, res) {
      if (res.ok) {
        console.log(
          "Sent successfully to cloud with status code: " + String(res.status)
        );
      } else console.error(err);
    });
}
