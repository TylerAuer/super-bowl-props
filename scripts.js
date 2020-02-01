// arrays of cells to access in google sheet
const APIRanges = {
  // in A1 notation
  propsList: "Rulings!D1:BE1",
  propsResults: "Rulings!D2:BE2",
  personalInfo: "Rulings!A4:BE500"
};

// QUESTION: is this the best way to do this?
// reduces ranges to single string and formats for API URL
const ranges = Object.values(APIRanges)
  .map(range => {
    return "ranges=" + range + "&";
  })
  .reduce((accumulator, nextVal) => {
    return accumulator + nextVal;
  });

// combines elements of API URL together
const APIURL =
  "https://sheets.googleapis.com/v4/spreadsheets/" +
  spreadsheetID +
  "/values:batchGet?" +
  ranges +
  "valueRenderOption=FORMATTED_VALUE&key=" +
  APIKey;

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    data = JSON.parse(xhttp.responseText);
    processJSONData(data);
  }
};

xhttp.open("GET", APIURL, true);
xhttp.send();

let participantList;
let propsList;
let propsResults;

// process the ranges from APIRanges
function processJSONData(data) {
  propsList = data.valueRanges[0].values[0];
  propsResults = data.valueRanges[1].values[0];

  // Clears list for reloading API Data
  participantList = [];
  data.valueRanges[2].values.forEach((data, index) => {
    const p = new Participant(data[0], data[1], data.slice(3, 57));
    participantList.push(p);
  });

  // sorts participants from most to fewest points
  participantList.sort((a, b) => {
    return b.stats.points - a.stats.points;
  });

  // generates participant table after determining rank
  participantList.forEach((participant, index) => {
    // assigns rank
    participant.stats.rank = 1 + index; // makes first place 1 not 0

    const participantTable = document.getElementById("participant-data");

    // adds main row of data
    participantTable.appendChild(makeTrMain(participant));

    // adds hidden details row
    participantTable.appendChild(makeTrDetails(participant));
  });
}

function Participant(name, handle, picksArray) {
  this.name = name;
  this.handle = handle;
  this.picksArray = picksArray;
  this.stats = calculateStats(this.picksArray);
}

// Determines values of stats for participants (rank is added later after sorting)
function calculateStats(picksArray) {
  let points = 0;
  let numCorrect = 0;
  let numWrong = 0;
  let maxScoreAddOn = 0;

  for (let i = 0; i < picksArray.length; i++) {
    if (picksArray[i] === propsResults[i]) {
      // regex needed because some results are worth different numbers of digits
      points += parseInt(picksArray[i].match(/\((\d+)\s/)[1]);
      numCorrect += 1;
    } else if (propsResults[i] !== "null") {
      numWrong += 1;
    } else {
      maxScoreAddOn += parseInt(picksArray[i].match(/\((\d+)\s/)[1]);
    }
  }

  const stats = {
    points: points,
    numCorrect: numCorrect,
    numWrong: numWrong,
    percentCorrect: Math.round((1000 * numCorrect) / picksArray.length) / 10,
    pointsPerCorrect: Math.round((10 * points) / numCorrect) / 10,
    maxScore: points + maxScoreAddOn
  };
  return stats;
}

// TODO: finish generateTableHTML function
function makeTrMain(participant) {
  const tableRowMain = document.createElement("tr");

  const rowHeader = document.createElement("th");
  rowHeader.setAttribute("scope", "row");
  rowHeader.innerHTML = participant.stats.rank;
  tableRowMain.appendChild(rowHeader);

  const dataToAdd = [
    participant.name,
    participant.handle,
    participant.stats.points,
    participant.stats.percentCorrect
  ];

  for (data of dataToAdd) {
    const cell = document.createElement("td");
    if (data === participant.stats.percentCorrect) {
      cell.classList.add("d-none");
      cell.classList.add("d-sm-table-cell");
    }
    cell.innerHTML = data;

    tableRowMain.appendChild(cell);
  }

  return tableRowMain;
}

function makeTrDetails(participant) {
  const tableRowDetails = document.createElement("tr");
  tableRowDetails.classList.add("collapse");

  const cell = document.createElement("td");
  cell.setAttribute("colspan", "5");
  tableRowDetails.appendChild(cell);
  return tableRowDetails;
}

{
  /* 
<p>
  <a class="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
    Link with href
  </a>
  <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Button with data-target
  </button>
</p>
<div class="collapse" id="collapseExample">
  <div class="card card-body">
    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
  </div>
</div> 
*/
}
