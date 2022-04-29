var NodeHelper = require("node_helper");
var exec = require('child_process').exec;

function filter_day(data) {
  const d = new Date();
  let day = d.getDay();
  // check if this is weekend
  if (day > 0 && day < 6){
    menu = data[day-1]["menus"];
  } else {
    menu = null;
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

    if (notification === "GET_DATA") {
      exec('python3 modules/MMM-VUB-Resto/scraper/main.py --version 1 --output ./modules/MMM-VUB-Resto/',
      function (error, stdout, stderr) {
        if (error !== null) {
            console.warn('Error while fetching vub resto data: ' + error);
            self.sendSocketNotification("DATA_FETCHED",{
              identifier: payload.identifier,
              error:true
            })
        } else {
          self.sendSocketNotification("DATA_FETCHED",{
            identifier: payload.identifier,
            error:false
          });
        }
      });
    } else if (notification === "LOAD_DATA") {
      const jsonData = require('./etterbeek.en.json');

      menu = filter_day(jsonData);

      //Check if the resto is open and return null if closed
      if (menu == null){
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
      self.sendSocketNotification("DATA_LOADED", responseObject);
    }
  }   
});
