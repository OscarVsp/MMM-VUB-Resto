# MMM-VUB-Resto

A Module for [MagicMirror](https://github.com/MichMich/MagicMirror) designed to
display the menu of the restaurant at the Vrije Universiteit Brussel.

The data of the menu of the week need to be in a json file on the directory of the module.
To get the data, as there is no API, the scrapper made by m1dnight (https://github.com/m1dnight/vub-resto-scraper) is used.

## Sample

![alt text](https://github.com/OscarVsp/MMM-VUB-Resto/raw/main/sample.png "Example")

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
| `updateInterval` | *Optional* | The interval of the update from the file. <br /> **Type:** int <br /> **Default:** `60*60*1000` (1 hour)
| `headerIcon` | *Optional* | The icon to use for the header. **Type:** <a href="https://fontawesome.com/icons?d=gallery">Any FontAwesome Icon</a>. <br /> **Default:** "fa-utensils"
| `hides` | *Optional* | The list of the menu name to hide. <br /> **Type:** `list`<br />**possible elements:** ( `Soup`, `Menu 1`, `Menu 2`, `Fish`, `Veggie`, `Pasta` and `Wok`) <br /> **Default:** `[]` (none)


## Attribution

Based on MMM-Json from Daniel Habenicht
https://github.com/DanielHabenicht/MMM-json for the part that display the json content.

Use the scraper made by m1dnight (https://github.com/m1dnight/vub-resto-scraper) to get the data.
