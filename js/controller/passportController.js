var controller={};

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

controller.checkToken=function(headers) {
    var token = getToken(headers);
    if (token) {
      return true;
    } else {
      return false;
    }
};

module.exports = controller;
