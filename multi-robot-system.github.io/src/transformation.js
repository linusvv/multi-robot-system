//Transformation

//WorldMap-Size
let xMap = 803;
let yMap = 1043;

//Transformation-Array BMW:
//Ursprung: links unten
let xShiftBMW = -139;
let yShiftBMW = -318;
//  7.79, 9.93
//  156 199
//  295 517
//  517, 747
let rotationBMW = 1.55334; //radians!!!!!!
let scaleBMW = 1; //multiplication
let xMapBMW = 741;
let yMapBMW = 605;

//Transformation-Array Tugger:
//Ursprung: Mitte
let xShiftTugger = 572;
let yShiftTugger = 453;
let rotationTugger = 1.55334;
let xMapTugger = 1984;
let yMapTugger = 1984;
let scale = 0.05;

//Transformation-Array Tugger Odometric -- not needed!!!
let xMove;
let yMove;
let rotationMove;
//requires transformation from quaternion to euler
//const qte = require("quaternion-to-euler");
//                                      -- not needed!!!

//Direction
//For true: Server --> Robot
//For false: Robot --> Server

//vehicle
//For true: BMW
//For false: Tugger

//--- not needed --- decide if odometric
//For true: true
//For false: false
//only needed for tugger Train
//For BMW: false
//--- not needed --- decide if odometric

function a(x, y) {
  //For BMW - Server --> Robot DONE

  //shift
  let xresult1 = x + xShiftBMW;
  let yresult1 = y + yShiftBMW;

  //shift center to (0|0)
  let xresult2 = xresult1 - xMapBMW / 2;
  let yresult2 = yresult1 - yMapBMW / 2;

  //rotate
  let xresult3 =
    xresult2 * Math.cos(rotationBMW) - yresult2 * Math.sin(rotationBMW);
  let yresult3 =
    xresult2 * Math.sin(rotationBMW) - yresult2 * Math.cos(rotationBMW);

  //shift to original
  let xresult4 = xresult3 + xMapBMW / 2;
  let yresult4 = yresult3 + yMapBMW / 2;

  //round
  let xresult5 = Math.round(xresult4);
  let yresult5 = Math.round(yresult4);

  return { x: xresult5, y: yresult5 };
}
function b(x, y) {
  //For BMW - Robot --> Server DONE
  //shift
  let xresult1 = x - xShiftBMW;
  let yresult1 = y - yShiftBMW;

  //shift center to (0|0)
  let xresult2 = xresult1 - xMap / 2;
  let yresult2 = yresult1 - yMap / 2;

  //rotate
  let xresult3 =
    xresult2 * Math.cos(-rotationBMW) - yresult2 * Math.sin(-rotationBMW);
  let yresult3 =
    xresult2 * Math.sin(-rotationBMW) - yresult2 * Math.cos(-rotationBMW);

  //shift to original
  let xresult4 = xresult3 + xMap / 2;
  let yresult4 = yresult3 + yMap / 2;

  //round
  let xresult5 = Math.round(xresult4);
  let yresult5 = Math.round(yresult4);

  return { x: xresult5, y: yresult5 };
}
function c(x, y) {
  //For Tugger - Server --> Robot

  //shift
  /*let xresult1= x + xShiftTugger;
    let yresult1 = y + yShiftTugger;
    
    
    //shift center to (0|0)
    let xresult2 = xresult1 - xMapTugger / 2;
    let yresult2 = yresult1 - yMapTugger / 2;

    //rotate
    let xresult3 = xresult2 * Math.cos(rotationTugger) - yresult2 * Math.sin(rotationTugger);
    let yresult3 = xresult2 * Math.sin(rotationTugger) - yresult2 * Math.cos(rotationTugger);
   
    /* --- not needed --- Map is already in the right position
    //shift to original
    let xresult4 = xresult3 + xMapTugger / 2;
    let yresult4 = yresult3 + yMapTugger / 2;
    */

  //shift
  let xresult2 = x + (xShiftTugger - xMapTugger / 2);
  let yresult2 = y + (yShiftTugger - yMapTugger / 2);
  //shift center to (0|0)

  //change coordinates
  let xresult3 = yresult2;
  let yresult3 = xresult2;

  //scale
  let xresult4 = xresult3 * -0.05;
  let yresult4 = yresult3 * -0.05;

  return { x: xresult4, y: yresult4 };
}
function d(x, y) {
  //For Tugger - Robot --> Server

  /* --- not needed --- map is already centered
    //shift center to (0|0)
    let xresult2 = xresult - xMap / 2;
    let yresult2 = yresult - yMap / 2;
    
    
    let xresult = x / 0.05;
    let yresult = y / 0.05;

    //rotate
    let xresult1 = xresult * Math.cos(-rotationTugger) - yresult * Math.sin(-rotationTugger);
    let yresult1 = xresult * Math.sin(-rotationTugger) - yresult * Math.cos(-rotationTugger);

    //move (0|0) to the border of the map
    let xresult2 = xresult1 + xMapTugger / 2;
    let yresult2 = yresult1 + yMapTugger / 2;

     //shift
     let xresult3 = xresult2 - xShiftTugger;
     let yresult3 = yresult2 - yShiftTugger;
     */
  //scale
  let xresult = x / -0.05;
  let yresult = y / -0.05;

  //change coordinates
  let xresult2 = yresult;
  let yresult2 = xresult;

  let xresult3 = xresult2 + xMapTugger / 2;
  let yresult3 = yresult2 + yMapTugger / 2;

  //shift
  let xresult4 = xresult3 - xShiftTugger;
  let yresult4 = yresult3 - yShiftTugger;
  //shift center to (0|0)

  //round
  let xresult5 = Math.round(xresult4);
  let yresult5 = Math.round(yresult4);

  return { x: xresult5, y: yresult5 };
}

module.exports = function (x, y, direction, vehicle) {
  if (vehicle == true) {
    if (direction == true) {
      return a(x, y);
    } else if (direction == false) {
      return b(x, y);
    }
  } else if (vehicle == false) {
    if (direction == true) {
      return c(x, y);
    } else if (direction == false) {
      return d(x, y);
    }
  }
};
