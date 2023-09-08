const { parse } = require("csv-parse/sync");
const fs = require("fs");
const path = require("path");

const fp = path.join(__dirname, "../csv/wnl.csv");

const map1 = {
  正月: 1,
  二月: 2,
  三月: 3,
  四月: 4,
  五月: 5,
  六月: 6,
  七月: 7,
  八月: 8,
  九月: 9,
  十月: 10,
  冬月: 11,
  腊月: 12,
  闰二月: 2,
  闰三月: 3,
  闰四月: 4,
  闰五月: 5,
  闰六月: 6,
  闰七月: 7,
  闰八月: 8,
  闰九月: 9,
  闰十月: 10,
  闰冬月: 11,
};
const map2 = {
  初一: 1,
  初二: 2,
  初三: 3,
  初四: 4,
  初五: 5,
  初六: 6,
  初七: 7,
  初八: 8,
  初九: 9,
  初十: 10,
  十一: 11,
  十二: 12,
  十三: 13,
  十四: 14,
  十五: 15,
  十六: 16,
  十七: 17,
  十八: 18,
  十九: 19,
  二十: 20,
  廿一: 21,
  廿二: 22,
  廿三: 23,
  廿四: 24,
  廿五: 25,
  廿六: 26,
  廿七: 27,
  廿八: 28,
  廿九: 29,
  三十: 30,
};

const trimString = (str) => {
  if (typeof str === "string") {
    return str.trim();
  } else {
    return str;
  }
};

const THREADHOLD_START = 20230908;
const THREADHOLD_END = 20260908;

const preprocess = (data) => {
  data = trimString(data);
  const dt = data.split("/");
  const year = parseInt(dt[0]);
  const month = parseInt(dt[1]);
  const day = parseInt(dt[2]);
  const v = year * 10000 + month * 100 + day;
  if (v < THREADHOLD_START || v > THREADHOLD_END) {
    console.log(v);
    return true;
  }
  return false;
};

const processDate = (data) => {
  data = trimString(data);
  const dt = data.split("/");
  return {
    year: parseInt(dt[0]),
    month: parseInt(dt[1]),
    day: parseInt(dt[2]),
  };
};

const processLunarYear = (data) => {
  data = trimString(data);
  return parseInt(data);
};

const processLunarMonth = (data) => {
  data = trimString(data);
  const ret = map1[data];
  if (!ret) {
    console.error("月份", data);
  }
  return ret;
};

const processLunarDay = (data) => {
  data = trimString(data);
  const ret = map2[data];
  if (!ret) {
    console.error("日期", data);
  }
  return ret;
};

const processData = (record) => {
  const yearMonthDayObject = processDate(record["公历日期"]);
  const lunar_year = processLunarYear(record["农历年"]);
  const lunar_month = processLunarMonth(record["农历月"]);
  const lunar_day = processLunarDay(record["农历日"]);
  const lunar_year_chinese = record["农历年"];
  const lunar_month_chinese = record["农历月"];
  const lunar_day_chinese = record["农历日"];
  const ganzhi_year = record["年干支"];
  const ganzhi_month = record["月干支"];
  const ganzhi_day = record["日干支"];
  return Object.assign(yearMonthDayObject, {
    lunar_year,
    lunar_month,
    lunar_day,
    lunar_year_chinese,
    lunar_month_chinese,
    lunar_day_chinese,
    ganzhi_year,
    ganzhi_month,
    ganzhi_day,
  });
};

const contents = fs.readFileSync(fp, { encoding: "utf-8" });
const records = parse(contents, {
  columns: true,
  skip_empty_lines: true,
});

let opt_records = [];

for (let record of records) {
  if (preprocess(record["公历日期"])) {
    continue;
  }
  const opt_record = processData(record);
  opt_records.push(opt_record);
}

fs.writeFileSync(
  path.join(__dirname, "../data_outputs/data.json"),
  JSON.stringify(opt_records, null, 2),
  { encoding: "utf-8" }
);
