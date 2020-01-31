// arrays of cells to access in google sheet
const APIRanges = { // in A1 notation
  // propsList: "Standings!1:1",
  // propResults: "Standings!2:2",
  personalInfo: "Standings!A3:G500",
};

// reduces ranges to single string and formats for API URL
const ranges = Object.values(APIRanges).map(range => {
  return "ranges=" + range + "&"
}).reduce((accumulator, nextVal) => {
  return accumulator + nextVal
});

// combines elements of API URL together
const APIURL =
  "https://sheets.googleapis.com/v4/spreadsheets/" +
  spreadsheetID +
  "/values:batchGet?" +
  ranges +
  "valueRenderOption=FORMATTED_VALUE&key=" +
  APIKey;

// TODO: function that determines the number of points someone has
function Participant(rank, name, handle, points, percentCorrect) {
  this.rank = rank;
  this.name = name;
  this.handle = handle;
  this.points = points;
  this.percentCorrect = percentCorrect;

  this.HTMLTableRow = () => {

    const tableRow = document.createElement('tr');

    const rowHeader = document.createElement('th');
    rowHeader.setAttribute('scope', 'row');
    rowHeader.innerHTML = this.rank;
    tableRow.appendChild(rowHeader);

    const dataToAdd = [this.name, this.handle, this.points, this.percentCorrect];

    for (let data of dataToAdd) {
      const cell = document.createElement('td');
      if (data === this.percentCorrect) {
        cell.classList.add("d-none");
        cell.classList.add("d-sm-table-cell");
      }
      cell.innerHTML = data;


      tableRow.appendChild(cell);
    };

    return tableRow;

  };
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    data = JSON.parse(xhttp.responseText);

    data.valueRanges.forEach(rangeGroup => {

      // rank, name, handle, points, % correct table
      if (rangeGroup.range === APIRanges.personalInfo) {
        rangeGroup.values.forEach((data) => {
          const p = new Participant(data[0], data[1], data[2], data[3], data[5]);
          document.getElementById('participant-data').appendChild(p.HTMLTableRow())
        });
      }
    });

  }
};

xhttp.open("GET", APIURL, true);
xhttp.send();
