const PF = require('pathfinding');
const {map} = require("./map"); 

 
const finder = new PF.AStarFinder();


const v_tugger_max = 1.0; // m/s
const v_bmw_max = 2.0;
const convertConst = 0.05; /*multiplication constant to convert from number of "map tiles" to meters 
                            -> five centimeters per occupancy block (pixel)*/
                          


function computeDistances(coordinates){
    //compute Distances between each robot and start point and each robot and exchange point; next_step: retrieving distance estimation from robot as well -> more precise (Update: not possible)
    //Instead we will compute the distances using A* or Dijkstra; issue -> will only output path coordinates not distance (Distance computation can become costly)
   
    let distances = {
        tugger_to_start: findDist(coordinates.tuggerX,coordinates.tuggerY, coordinates.startX, coordinates.startY) * convertConst, //multiply by constant for meters
        bmw_to_start: findDist(coordinates.bmwX,coordinates.bmwY, coordinates.startX, coordinates.startY) * convertConst,
        start_to_exchange: findDist(coordinates.startX,coordinates.startY, coordinates.exchangeX, coordinates.exchangeY) * convertConst,
        tugger_to_exchange: findDist(coordinates.tuggerX,coordinates.tuggerY, coordinates.exchangeX, coordinates.exchangeY) * convertConst,
        bmw_to_exchange: findDist(coordinates.bmwX,coordinates.bmwY, coordinates.exchangeX, coordinates.exchangeY) * convertConst,
        exchange_to_end: findDist(coordinates.exchangeX,coordinates.exchangeY, coordinates.endX, coordinates.endY) * convertConst

       };

       return distances;
}

   

 
 function timeEstimation(distances){
   //might need unit conversions
   let times = {
   tugger_to_start:  distances.tugger_to_start / v_tugger_max, //in seconds
   bmw_to_start:  distances.bmw_to_start / v_bmw_max,
   start_tugger_to_exchange: distances.start_to_exchange / v_tugger_max, 
   start_bmw_to_exchange: distances.start_to_exchange / v_bmw_max,
   tugger_to_exchange:  distances.tugger_to_exchange / v_tugger_max,
   bmw_to_exchange: distances.bmw_to_exchange / v_bmw_max,
   exchange_tugger_to_end: distances.exchange_to_end / v_tugger_max,
   exchange_bmw_to_end: distances.exchange_to_end / v_bmw_max
   }
   return times;
 }
 function computeCosts(times){
   let combination1 = times.tugger_to_start + times.start_tugger_to_exchange + times.bmw_to_exchange + times.exchange_bmw_to_end;
   let combination2 = times.bmw_to_start + times.start_bmw_to_exchange + times.tugger_to_exchange + times.exchange_tugger_to_end;
   return [combination1, combination2];
 }
 
 function pickVehicle(costs){ //calculating the combinations (2!) of the system and picking the most effective one.
 
   if(costs[0] <= costs[1]){
     console.log("Tugger to pick up delivery from start"); 
     return true;
      //returns a boolean -> true if tugger is going to start point, false if not (going to exchange directly)
   }else{
     console.log("BMW to pick up delivery from start");
     return false;
     //bmw goes to start first, tugger to exchange
   }
 }


function findDist(x1,y1,x2,y2){
    if(map[y1][x1] == 0 && map[y2][x2]==0){
        let a = finder.findPath(x1,y1,x2,y2,new PF.Grid(map)).length;
        return a;
    }else{
      console.error("coordinates not accesssible at:"+String(x1)+"," + String(y1)+";" + String(x2)+","+ String(y2)); 
    }
}


 

 
 

module.exports = function(initialPos){

    let distances = computeDistances(initialPos);
    let times = timeEstimation(distances);
    let costs = computeCosts(times);
    let cache = {
     distances: distances,
     times: times
    }
 
    return [pickVehicle(costs),cache];
}
