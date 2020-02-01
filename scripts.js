// arrays of cells to access in google sheet
const APIRanges = { // in A1 notation
  personalInfo: "Rulings!A4:BE500",
  propsList: "Rulings!D1:BE1",
  propsResults: "Rulings!D2:BE2",
};

// QUESTION: is this the best way to do this?
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

// TODO: add method to calculate points
// TODO: add method to determine percent correct
// TODO: add method to determine max score
function Participant(name, handle, picksArray) {
  this.name = name;
  this.handle = handle;
  this.picksArray = picksArray;
  // this.points = points;
  // this.percentCorrect = percentCorrect;
  // this.rank = rank;
  // TODO: Move this method to function outside of Participant object
  // this.HTMLTableRow = () => {

  //   const tableRow = document.createElement('tr');

  //   const rowHeader = document.createElement('th');
  //   rowHeader.setAttribute('scope', 'row');
  //   rowHeader.innerHTML = this.rank;
  //   tableRow.appendChild(rowHeader);

  //   const dataToAdd = [this.name, this.handle, this.points, this.percentCorrect];

  //   for (let data of dataToAdd) {
  //     const cell = document.createElement('td');
  //     if (data === this.percentCorrect) {
  //       cell.classList.add("d-none");
  //       cell.classList.add("d-sm-table-cell");
  //     }
  //     cell.innerHTML = data;


  //     tableRow.appendChild(cell);
  //   };

  //   return tableRow;

  // };
}

let participantList = [];
let propsList = [];
let propsResults = [];

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {

    data = JSON.parse(xhttp.responseText);

    // processes the rows for each participant
    data.valueRanges.forEach(rangeGroup => {
      if (rangeGroup.range === APIRanges.personalInfo) {
        rangeGroup.values.forEach((data, index) => {
          const p = new Participant(data[0], data[1], data.slice(3, 57));
          participantList.push(p);
          //document.getElementById('participant-data').appendChild(p.HTMLTableRow())
        });

        // collects all of the prop titles
      } else if (rangeGroup.range === APIRanges.propsList) {
        rangeGroup.values.forEach(data => {
          propsList.push(data);
        });

        // collects all of the prop results
      } else if (rangeGroup.range === APIRanges.propsResults) {
        rangeGroup.values.forEach(data => {
          propsResults.push(data);
        });
      }
    });
  }
};

xhttp.open("GET", APIURL, true);
xhttp.send();

console.log(participantList);
console.log(propsList);
console.log(propsResults);