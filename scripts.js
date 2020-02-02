// arrays of cells to access in google sheet
const APIRanges = {
  // in A1 notation
  propsList: "Rulings!D1:BE1",
  propsResults: "Rulings!D2:BE2",
  personalInfo: "Rulings!A4:BE500",
  riskyness: "Riskiness!A3:B3"
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
let groupPointsMean;
let groupPointsStdDev;

// process the ranges from APIRanges
function processJSONData(data) {
  propsList = data.valueRanges[0].values[0];
  propsResults = data.valueRanges[1].values[0];
  groupPointsMean = parseFloat(data.valueRanges[3].values[0][0]);
  groupPointsStdDev = parseFloat(data.valueRanges[3].values[0][1]);

  // TODO: Import median points / person and STD Dev

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
  this.id = name.replace(/[^0-9a-z]/gi, ""); // removes all non-alphanumeric characters
  this.name = name;
  this.handle = handle;
  this.picksArray = picksArray;
  this.stats = calculateStats(this.picksArray);
  // points
  // numCorrect
  // numCorrect
  // numWrong,
  // percentCorrect
  // pointsPerCorrect
  // maxScore
}

// Determines values of stats for participants (rank is added later after sorting)
function calculateStats(picksArray) {
  let points = 0;
  let numCorrect = 0;
  let numWrong = 0;
  let maxScoreAddOn = 0;
  let totalPoints = 0;

  for (let i = 0; i < picksArray.length; i++) {
    pointsAtIndex = parseInt(picksArray[i].match(/\((\d+)\s/)[1]);
    totalPoints += pointsAtIndex;
    if (picksArray[i] === propsResults[i]) {
      // regex needed because some results are worth different numbers of digits
      // can't use slice because negative indexes aren't consistent
      points += pointsAtIndex;
      numCorrect += 1;
    } else if (propsResults[i] === "push") {
      // skips props that have no winner or push
    } else if (propsResults[i] !== "null") {
      numWrong += 1;
    } else {
      maxScoreAddOn += pointsAtIndex;
    }
  }

  const stats = {
    points: points,
    numCorrect: numCorrect,
    numWrong: numWrong,
    percentCorrect:
      Math.round((1000 * numCorrect) / (numCorrect + numWrong)) / 10,
    pointsPerCorrect: Math.round((10 * points) / numCorrect) / 10,
    maxScore: points + maxScoreAddOn,
    averagePointsPerProp: totalPoints / picksArray.length,
    zScore:
      (totalPoints / picksArray.length - groupPointsMean) / groupPointsStdDev
  };
  return stats;
}

function makeTrMain(participant) {
  const tableRowMain = document.createElement("tr");
  tableRowMain.id = "main-" + participant.id;

  statsBtn = document.createElement("button");
  statsBtn.innerHTML = participant.stats.rank;
  statsBtn.classList.add("btn");
  statsBtn.classList.add("btn-outline-dark");
  statsBtn.setAttribute("type", "button");
  statsBtn.setAttribute("data-toggle", "collapse");
  statsBtn.setAttribute("data-target", "#details-" + participant.id);

  const rowHeader = document.createElement("th");
  rowHeader.setAttribute("scope", "row");
  rowHeader.appendChild(statsBtn);
  tableRowMain.appendChild(rowHeader);

  const dataToAdd = [
    participant.name,
    participant.handle,
    participant.stats.points
  ];

  for (data of dataToAdd) {
    const cell = document.createElement("td");
    cell.classList.add("align-middle");
    if (data === participant.stats.percentCorrect) {
      cell.classList.add("d-none");
      cell.classList.add("d-sm-table-cell");
    }
    cell.innerHTML = data;

    tableRowMain.appendChild(cell);
  }

  return tableRowMain;
}

// makes the details for each participant
function makeTrDetails(participant) {
  // % correct and Pts / correct
  const row1 = document.createElement("div");
  row1.classList.add("row");
  row1.classList.add("row1");
  row1.classList.add("text-center");
  row1.innerHTML =
    '<div class="col"><h5>Percent Correct</h5><div>' +
    participant.stats.percentCorrect +
    " %</div></div>" +
    '<div class="col"><h5>Points per Correct</h5><div>' +
    participant.stats.pointsPerCorrect +
    " points</div></div>" +
    '<div class="col"><h5>Max Score Possible</h5><div>' +
    participant.stats.maxScore +
    " points</div></div>";

  //TODO: add diagram
  // use z-score
  // Riskyness diagram
  const row2 = document.createElement("div");
  row2.classList.add("row");
  row2.classList.add("row2");
  row2.innerHTML = (
    <div class="risk-bar">
      <div class="risk-bar-marker"></div>
      <div class="risk-bar-safe"></div>
      <div class="risk-bar-risky"></div>
    </div>
  );

  // Picks so far
  const row3 = document.createElement("div");
  row3.classList.add("row");
  row3.classList.add("row3");

  undecidedList = document.createElement("ul");
  correctList = document.createElement("ul");
  wrongList = document.createElement("ul");

  for (let i = 0; i < propsResults.length; i++) {
    // unresolved prop
    if (propsResults[i] === "null") {
      undecidedList.innerHTML +=
        "<li><b>" +
        propsList[i] +
        "</b> - " +
        participant.picksArray[i] +
        "</li>";
      // correct prop
    } else if (propsResults[i] === participant.picksArray[i]) {
      correctList.innerHTML +=
        "<li><b>" +
        propsList[i] +
        "</b> - " +
        participant.picksArray[i] +
        "</li>";
    } else if (propsResults[i] === "push") {
      // pushed props are skipped
    } else {
      wrongList.innerHTML +=
        "<li><b>" +
        propsList[i] +
        "</b> - " +
        participant.picksArray[i] +
        "</li>";
    }
  }
  row3.innerHTML =
    '<div class="col-md"><h5>Correct</h5>' +
    correctList.outerHTML +
    '</div><div class="col-md"><h5>Incorrect</h5>' +
    wrongList.outerHTML +
    '</div><div class="col-md"><h5>Unresolved</h5>' +
    undecidedList.outerHTML +
    "</div></div>";

  // assembles parts
  const cell = document.createElement("td");
  cell.setAttribute("colspan", "5");
  cell.appendChild(row1);
  cell.appendChild(row2);
  cell.appendChild(row3);

  // TODO: move collapse to a div within the tableRow
  const tableRowDetails = document.createElement("tr");
  tableRowDetails.id = "details-" + participant.id;
  tableRowDetails.classList.add("collapse");
  tableRowDetails.appendChild(cell);

  // <div container-fluid>

  //// <div class="row text-center">
  ////// <div class="col-sm">
  //////// <h3>Percent Correct</h3>
  //////// {% Correct}
  ////// </div>
  ////// <div class="col-sm">
  //////// <h3>Points per Correct</h3>
  //////// {Points / correct}
  ////// </div>
  //// </div>

  //// <div class="row text-center">
  ////// {Riskyness diagram}
  //// </div>

  ////// <div class="col-sm">
  //////// <h3>Correct</h3>
  //////// {Prop Name} - {Their Pick}
  ////// </div>
  ////// <div class="col-sm">
  //////// <h3>Incorrect</h3>
  //////// {Prop Name} - {Their Pick}
  ////// </div>
  ////// <div class="col-sm">
  //////// <h3>Unresolved</h3>
  //////// {Prop Name} - {Their Pick}
  ////// </div>
  //// </div>

  // </div>

  return tableRowDetails;
}
