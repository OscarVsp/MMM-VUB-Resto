# MMM-VUB-Resto

A Module for [MagicMirror](https://github.com/MichMich/MagicMirror) designed to
display the menu of the restaurant at the Vrije Universiteit Brussel.

The data of the menu of the week need to be in a json file on the directory of the module.
To get the data, as there is no API, you can use the scrapper made by m1dnight (https://github.com/m1dnight/vub-resto-scraper)
## Sample

![alt text](https://github.com/OscarVsp/MMM-VUB-Resto/raw/main/sample.jpg "Example")

## Module installation

**Clone the repository into MagicMirror/modules directory**
```bash
cd ~/MagicMirror/modules
git clone https://github.com/OscarVsp/MMM-VUB-Resto.git
```

**Install the dependencies**
```
cd /MMM-VUB-Resto
npm install
```

### Configuration

**Basic Example:**

```jsonc
{
  module: 'MMM-VUB-Resto',
  position: 'bottom_left',
},
```
**Hide some meal:**

```jsonc
{
  module: 'MMM-VUB-Resto',
  position: 'bottom_left',
  config: {
    hide: ["Veggie"]
  }
},
```

## Parameters

 
| Option           | Type  | Description
|----------------- |----------- |-----------
| `updateInterval` | *Optional* | The interval of the update from the file. **Default:** `60*60*1000` (1 hour)
| `scraperInterval` | *Optional* | The interval of the update for the scraper. **Default:** `24*60*60*1000` (1 day)
| `headerIcon` | *Optional* | The icon to use for the header (<a href="https://fontawesome.com/icons?d=gallery">any FontAwesome Icon</a>). **Default:** "fa-utensils"
| `hides` | *Optional* | The list of the menu name to hide. **Default:** `[]` (none)


## Scrapper configuration

To automaticlly get the data at the beginning of the week, add the following lines to the crontab service using `crontab -e`:

```
6 * * 1 python3 /PathToScraperDir/main.py -- version 1 --output /PathToModule/MMM-VUB-Resto
@reboot python3 /PathToScraperDir/main.py -- version 1 --output /PathToModule/MMM-VUB-Resto
```

This will execute the scraper every first day of the week, at 6:00 a.m. as well as each time the raspberry pi starts.

## Attribution

Based on MMM-Json from Daniel Habenicht
https://github.com/DanielHabenicht/MMM-json
