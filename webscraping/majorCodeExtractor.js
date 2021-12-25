const fs = require('fs');

const INPUT = 'majors.txt';
const OUTPUT = 'majorsData.json';

// Read majors list
var majorList;
try {
  majorList = fs.readFileSync(INPUT).toString();
} catch (err) {
  exit(-1);
}

// Extract all the major codes
majorCodesList = majorList.split('\n')
  .filter((line) => line.length > 0)
  .map((major) => {
    return major.substring(0,3).toUpperCase();
  });

// Write to file
try {
  fs.writeFileSync(OUTPUT, JSON.stringify({majorCodes: majorCodesList}));
} catch (err) {
  console.log(err);
}
