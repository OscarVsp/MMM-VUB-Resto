/*
 * Magic Mirror module for displaying VUB Restaurant menu
 * By Oscar Van Slijpe
 * MIT Licensed
 */

Module.register("MMM-VUB-Resto", {
  // Default module config.
  defaults: {
    headerIcon: "fa-utensils",
    updateInterval: 1000 * 60 * 60, // 1 hour
    hides: []
  },

  start: function () {
    console.log("Starting module: " + this.name);
    this.weekFetched = false;
    this.firstFetch = false;
    this.dataFectedError = false;
    this.loaded = false;

    var self = this;
    self.updateData();
    // Schedule updates
    setInterval(function () {
      self.updateData();
    }, this.config.updateInterval);
  },

  // Contact node helper for data
  getDataRequest: function () {
    this.sendSocketNotification("GET_DATA", {
      identifier: this.identifier
    });
  },

  // Contact node helper for data
  getData: function () {
    if (this.firstFetch) {
      this.sendSocketNotification("LOAD_DATA", {
        config: this.config,
        identifier: this.identifier
      });
    }
  },

  updateData: function(){
    if (!this.firstFetch){
      this.getDataRequest();
      console.log("Scraping the vub menu for the first time...");
    } 
    else {
      const d = new Date();
      let day = d.getDay();
      if  (day == 0 && !this.weekFetched){
        this.getDataRequest();
        console.log("Scraping the new vub menu because it Sunday...");
      } 
      else {
        if (day != 0 && this.weekFetched){
          this.weekFetched = false;   //Reset the value for the next Sunday
        }
        this.getData();
        this.updateDom();
      }
    }
  },

  // Import additional CSS Styles
  getStyles: function () {
    return ["mmm-VUB-Resto.css"];
  },

  


  
  // Override socket notification handler.
  socketNotificationReceived: function (notification, payload) {
    if (
      notification === "DATA_FETCHED" &&
      payload.identifier == this.identifier
    ) {
      if (payload.error){
        this.dataFectedError = true
        console.error("Error scraping the vub menu.");
        this.updateDom(1000);
      } else {
        console.info("Vub menu get scraped without error.");
        this.dataFectedError = false;
        if (!this.firstFetch){
          this.firstFetch = true;
          this.weekFetched = true;}
        const d = new Date();
        let day = d.getDay();
        if (day == 0) {
          this.weekFetched = true;
        }
        this.updateDom(1000);
        this.getData();
      }
    } else if (
      notification == "DATA_LOADED" &&
      payload.identifier == this.identifier
    ) {
      console.info("Vub menu of the day updated");
      this.loaded = true;
      this.response = payload.data;
      this.updateDom(100);
    }
  },

  // Override the Header generator
  getHeader: function () {
    // If an Icon should be displayed we need our own header
    if (this.config.headerIcon) {
      return "";
    } else {
      return this.data.header || "";
    }
  },

  // Override dom generator.
  getDom: function () {
    var wrapper = document.createElement("div");

    // Display error message if scraping went wrong
    if (this.dataFectedError) {
      wrapper.innerHTML = "Error scraping the data !";
      return wrapper;
    }

    // Display loading while waiting for API response
    if (!this.firstFetch) {
      wrapper.innerHTML = "Scraping the VUB menu...";
      return wrapper;
    }

    // Display loading while waiting for API response
    if (!this.loaded) {
      wrapper.innerHTML = "Loading the VUB menu...";
      return wrapper;
    }

    // If no menu today, it mean that the restaurent is closed
    if (this.response == null) {
      wrapper.innerHTML = "Restaurant is closed today.";
      return wrapper;
    }

    var tb = document.createElement("table");

    // Display our own header if we want an icon
    if (this.config.headerIcon) {
      var imgDiv = document.createElement("div");

      var sTitle = document.createElement("p");
      sTitle.innerHTML = this.data.header || "";
      sTitle.className += "normal";

      var icon = document.createElement("i");
      icon.className = "fas " + this.config.headerIcon;
      sTitle.style = "margin: 0px 0px 0px 15px;";
      imgDiv.appendChild(icon);
      imgDiv.appendChild(sTitle);

      var divider = document.createElement("hr");
      divider.className += " dimmed";
      wrapper.appendChild(imgDiv);
      wrapper.appendChild(divider);
    }

    for (var i = 0; i < this.response.length; i++) {
      var row = document.createElement("tr");

      var titleTr = document.createElement("td");
      var dataTr = document.createElement("td");

      titleTr.innerHTML = this.response[i].title + ":";
      dataTr.innerHTML =
        (this.response[i].prefix ? this.response[i].prefix : "") +
        " " +
        this.response[i].value +
        " " +
        (this.response[i].suffix ? this.response[i].suffix : "");

      titleTr.className += " small regular bright";
      dataTr.className += " small light bright";

      row.appendChild(titleTr);
      row.appendChild(dataTr);

      tb.appendChild(row);
    }
    wrapper.appendChild(tb);
    return wrapper;
  }
});
