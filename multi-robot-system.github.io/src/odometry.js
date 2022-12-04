//for possible odometric transformations from and to the tugger train --- currently not necess

var Matrix = require("matrix_transformer"); //transformation tool
var qte = require("quaternion-to-euler"); //transform quaternion to euler

function transform(value, x, y) {
  let coords = new Matrix({ x: x, y: y, z: 0 }); //create transformation Matrix
  var quaternion = [
    //index quaternion
    value.rotation.x,
    value.rotation.y,
    value.rotation.z,
    value.rotation.w,
  ];

  var euler = qte(quaternion);
  rotationz = euler[2];
  let results = coords
    .translateX(value.translation.x) //Add translation
    .translateY(value.translation.y)
    .rotateZ(rotationz); //Add rotation
  console.log(results.x + " " + results.y);

  return { x: results.x, y: results.y };
}

module.exports = function (value, x, y) {
  return transform(value, x, y);
};
