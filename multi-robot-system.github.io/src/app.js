const transformation = require("./transformation");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser")
var routes = require("./routes/routes");
let LOC = {
  "start":"",
  "exchange":"",
  "end":""
}
const time = 20;



const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require("fs");
const { stringify } = require("querystring");


var app = express();
var users

app.set("port", process.env.PORT || 8080);
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(routes);

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));






app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
    
})

app.post('/clicked', upload.none(), function (req, res, next) {
    console.log(req.body)
    var pageid_temp;
    console.log(stringify(transformation(10,10,true,true,true)));
  pageid_temp = req.body.url;
  pageid_temp = pageid_temp.substring(0, pageid_temp.length-6);
  pageid_temp = pageid_temp.charAt(pageid_temp.length-1);
  console.log(pageid_temp);
  buttonid = req.body.button;
  res.send()
  switch (pageid_temp) {
    case 't': 
    LOC.start = buttonid;
    let datas = JSON.stringify(LOC);
    fs.writeFileSync("src/location.json", datas);
    console.log("start:" + buttonid);
    
      break;
    case 'e': 
    LOC.exchange = buttonid;
    let datae = JSON.stringify(LOC);
    fs.writeFileSync("src/location.json", datae);
    console.log("exchange:" + buttonid);
        break;
    case 'd': 
    LOC.end = buttonid;
    let datad = JSON.stringify(LOC);
    fs.writeFileSync("src/location.json", datad);
    console.log("end:" + buttonid);
      break;
  }
})






app.get('/istart', (req, res) => {
    let data = fs.readFileSync("src/location.json");
    data = JSON.parse(data);
    res.send(JSON.stringify(data.start));
    
    
});
app.get('/iexchange', (req, res) => {
  let data = fs.readFileSync("src/location.json");
    data = JSON.parse(data);
    res.send(JSON.stringify(data.exchange));
    
});
app.get('/iend', (req, res) => {
  let data = fs.readFileSync("src/location.json");
    data = JSON.parse(data);
    res.send(JSON.stringify(data.end));
      
    
});
app.get('/time', (req, res) => {
  
    res.send(JSON.stringify(time));
    
});

app.get('/errorcheck', (req, res) => {
  let code = 0;
  let data = fs.readFileSync("src/location.json");
  data = JSON.parse(data);
  if(data.start != "" && data.exchange != "" && data.end != ""){
    if(data.start === data.exchange && data.end === data.exchange){
      code = 3;
    
    }
    else if(data.start === data.exchange && data.end != data.exchange){
      code = 1;
    
    }
    else if(data.end === data.exchange && data.exchange != data.start){
      code = 2;
    
    
    }
  res.send(JSON.stringify(code));
}

 
  
});

app.post('/reset', (req, res) => {
   LOC = {
    "start":"",
    "exchange":"",
    "end":""
  }
  fs.writeFileSync("src/location.json", JSON.stringify(LOC));
  console.log("data recieved");
  
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%[RESET]
  
});
app.post('/execute', (req, res) => {
  
 console.log("executed");
 
 
 //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%[RESET]
 
});


  