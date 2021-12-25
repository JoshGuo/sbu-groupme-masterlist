const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

var majorCodes;
try {
  majorCodes = JSON.parse(fs.readFileSync('./majorsData.json').toString()).majorCodes;
} catch (err) {
  console.log('Major Codes failed to load');
  exit(-1);
}

const badCodes = [
  475, 476, 487, 488, 495, 496
];

majorCodes.forEach((major) => {
  axios(`https://www.stonybrook.edu/sb/bulletin/current/courses/${major}/`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      const courses = $('.course');
      var courseNums = [];
      courses.each((i) => {
        courseNums.push(parseInt(courses[i].attribs.id));
      }); 
      courseNums = courseNums.filter((num) => !badCodes.includes(num));
      try {
        fs.writeFileSync(`./coursesByMajor/${major}.json`, JSON.stringify({courses: courseNums}))
      } catch (ex) {
        console.log(ex);
      }
    });
});