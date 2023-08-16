const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const results = [];

const fp = path.join(__dirname, "../csv/wnl.csv");

console.log(fp);

fs.createReadStream(fp)
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(results);
  });
