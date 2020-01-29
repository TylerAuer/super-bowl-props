// arrays of cells to access in google sheet
const APIRanges = { // in A1 notation
  personalInfo: "Standings!3:500",
  propsList: "Standings!1:1",
  propResults: "Standings!2:2",
};

// reduces ranges to single string and formats for API URL
const ranges = Object.values(APIRanges).map(range => {
  return "ranges=" + range + "&"
}).reduce((accumulator, nextVal) => {
  return accumulator + nextVal
})

// combines elements of API URL together
const APIURL =
  "https://sheets.googleapis.com/v4/spreadsheets/" +
  spreadsheetID +
  "/values:batchGet?" +
  ranges +
  "valueRenderOption=FORMATTED_VALUE&key=" +
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
