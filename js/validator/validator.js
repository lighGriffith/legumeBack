let Validator = require("fastest-validator");
var v={};

const schemaUser = {
    password: { type: "string", min: 8, max: 255 },
    username: { type: "string", min: 3, max: 255 },
    email: { type: "email" },
    lat     : {type: "string", min: 1, max: 9},
    lng    :{type: "string", min: 1, max: 9},
    telephone    : {type: "string", min: 10, max: 10},
    isFermier:{ type: "boolean" }
};

v.validateUser=function(userJson){
  let validator = new Validator();
  var a=validator.validate(userJson, schemaUser);
  console.log(a);
  return a;
}


module.exports = v;
