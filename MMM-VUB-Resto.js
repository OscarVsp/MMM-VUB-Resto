/*
 * Magic Mirror module for displaying VUB Restaurant menu
 * By Oscar Van Slijpe
 * MIT Licensed
 */

Module.register("MMM-VUB-Resto", {
  // Default module config.
  defaults: {
    url: "http://call-cc.be/files/vub-resto/etterbeek.en.json",
		headerIcon: "fa-utensils",
    refreshInterval: 1000 * 60 * 60, // 1 hour
    hide: []
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.loaded = false;
    this.getData();

    var self = this;
    // Schedule updates
    setInterval(function () {
      self.getData();
      self.updateDom();
    }, this.config.refreshInterval);
  },

  // Import additional CSS Styles
  getStyles: function () {
    return ["mmm-VUB-Resto.css"];
  },

  // Contact node helper for data
  getData: function () {
    Log.info("MMM-VUB-Resto: getting data");

    this.sendSocketNotification("MMM_VUB_Resto_GET_REQUEST", {
      config: this.config,
      identifier: this.identifier
    });
  },

  // Handle node helper response
  socketNotificationReceived: function (notification, payload) {
    if (
      notification === "MMM_VUB_Resto_GET_RESPONSE" &&
      payload.identifier == this.identifier
    ) {
      if (payload.error === true) {
        console.error(
          "MMM-VUB-Resto: An Error occured while fetching your response. Please have a look at the server log."
        );
        this.loaded = false;
      } else {
        this.loaded = true;
        this.response = payload.data;
      }
      this.updateDom(1000);
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
    if (this.config.url === "") {
      wrapper.innerHTML = "Please configure url...";
      return wrapper;
    }

    // Display loading while waiting for API response
    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      return wrapper;
    }

    if (this.response == null){
      wrapper.innerHTML = "Restaurant is closed.";
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
