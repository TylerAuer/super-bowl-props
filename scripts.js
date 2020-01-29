// API Request in Batches
// https://sheets.googleapis.com/v4/spreadsheets/1bn9txDh7oo2UaWmM65i2SZuqyYhuG4hlXn-B76Ov4V0/values:batchGet?ranges=Standings!A1%3AA5&ranges=Standings!B1%3AB5&ranges=Standings!C1%3AC5&valueRenderOption=FORMATTED_VALUE&key=[YOUR_API_KEY]

const APIrange = "Standings!3:500"; // in A1 notation
const APIURL =
  "https://sheets.googleapis.com/v4/spreadsheets/" +
  spreadsheetID +
  "/values/" +
  APIrange +
  "?key=" +
  APIKey;

function Participant(name, handle, points) {
  this.name = name;
  this.handle = handle;
  this.points = points;
  this.html = (name, handle, points) => {
    const h2 = document.createElement('h2');
    h2.innerHTML = this.name;

    const text = document.createElement('p');
    text.innerHTML = this.handle + " has " + this.points + " points.";

    const div = document.createElement('div');
    div.appendChild(h2);
    div.appendChild(text);

    return div
  };
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    data = JSON.parse(xhttp.responseText);

    // document.getElementById("dump-here").innerHTML = data.values

    data.values.forEach(row => {
      const x = new Participant(row[1], row[2], row[3])
      document.getElementById("dump-here").appendChild(x.html())
    });
  }
};

xhttp.open("GET", APIURL, true);
xhttp.send();
