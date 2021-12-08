var request = require("request");
var jp = require("jsonpath");
const { jq } = require("jq.node");
var NodeHelper = require("node_helper");

function asPromise(context, callbackFunction, ...args) {
  return new Promise((resolve, reject) => {
    args.push((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
    if (context) {
      callbackFunction.call(context, ...args);
    } else {
      callbackFunction(...args);
    }
  });
}


function filter_day(data) {
  const d = new Date();
  let day = d.getDay();
  // check if this is weekend
  if (day > 0 && day < 6){
    menu = data[day-1]["menus"];
  } else {
    menu = null;
    console.debug("MMM-VUB-Resto: No data because it is weekend.");
  }
  return menu;
}

function filter_hide(data,hide){
  menu = [];
  data.forEach(function(meal, index, myArray){
    if(!hide.includes(meal.name)){
      menu.push({title: meal.name, value: meal.dish});
    }
  });
  return menu;
}

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper: " + this.name);
  },

  socketNotificationReceived: function (notification, payload) {
    var self = this;
    console.log("Notification: " + notification + " Payload:", payload);

    if (notification === "MMM_VUB_Resto_GET_REQUEST") {
      req_params = {
        url: payload.config.url,
        json: true,
        ...payload.config.request
      };
      console.debug(self.name + " req_params:", req_params);
      request(req_params, async function (error, response, jsonData) {
        if (!error && Math.floor(response.statusCode / 100) === 2) {
          var responseObject;

          menu = filter_day(jsonData);

          //Check if the resto is open and return null if closed
          if (menu == null){
            console.debug("Resto is closed.");
            responseObject = {
              identifier: payload.identifier,
              data: null
            }
          } else {
            //Remove menu that should be hiden
            menu_formatted = filter_hide(menu,payload.config.hide)
            responseObject = {
              identifier: payload.identifier,
              data: menu_formatted
            };
          }
          self.sendSocketNotification("MMM_VUB_Resto_GET_RESPONSE", responseObject);
        } else {
          self.sendSocketNotification("MMM_VUB_Resto_GET_RESPONSE", {
            identifier: payload.identifier,
            error: true
          });
          console.error(
            self.name + " error:",
            error,
            "statusCode:",
            response && response.statusCode,
            "statusMessage:",
            response && response.statusMessage
          );
        }
      });
    }
  }
});
