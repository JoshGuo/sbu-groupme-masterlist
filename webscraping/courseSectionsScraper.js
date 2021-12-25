const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

var majorFiles;
try {
  majorFiles = fs.readdirSync('./coursesByMajor');
} catch (ex) {
  console.log(ex);
}

var majors = {};

majorFiles.forEach(file => {
  const major = file.substring(0,3);
  var courseNums;
  try {
    majors[major] = JSON.parse(fs.readFileSync(`./coursesByMajor/${file}`))['courses'];
  } catch (ex) {
    console.log(ex);
  }
})

Object.keys(majors).forEach(major => {
  majors[major].forEach(courseNum => {
    const course = major + courseNum;
    try {
axios(`http://classfind.stonybrook.edu/vufind/Search/Results?lookfor=${course}&type=callnumber&filter%5B%5D=ctrlnum%3A%22Spring+2022%22`)
      .then(res => {
        const $ = cheerio.load(res.data);
        if($('h3')[0]) {
          console.log(`No sessions of ${course}`);
        } else {
          let numClasses = parseInt($('strong')[3].children[0].data);
          console.log(`Found ${numClasses} sections of ${course} on classfind`);

          const courses = $('.span-11');
          const courseTimes = new Set();
          numClasses = numClasses > 10 ? 10 : numClasses;
          for(let i = 0; i < numClasses; i++) {
            if (courses[i * 2 + 1].children.length <= 7) {
              courseTimes.add(courses[i * 2 + 1].children[2].data.trim().substring(1));
            } else {
              courseTimes.add(courses[i * 2 + 1].children[4].data.trim());
            }
          }
          console.log(courseTimes);
        }
      });
    } catch (err) {

    }
    
  })
})


// const course = 'ATM437';

// axios(`http://classfind.stonybrook.edu/vufind/Search/Results?lookfor=${course}&type=callnumber&filter%5B%5D=ctrlnum%3A%22Spring+2022%22`)
//   .then(res => {
//     const $ = cheerio.load(res.data);
//     if($('h3')[0]) {
//       console.log(`No sessions of ${course}`);
//       process.exit(-1);
//     } 
//     let numClasses = parseInt($('strong')[3].children[0].data);
//     console.log(`Found ${numClasses} sections of ${course} on classfind`);

//     const courses = $('.span-11');
//     const courseTimes = new Set();
//     numClasses = numClasses > 10 ? 10 : numClasses;
//     for(let i = 0; i < numClasses; i++) {
//       if (courses[i * 2 + 1].children.length <= 7) {
//         courseTimes.add(courses[i * 2 + 1].children[2].data.trim().substring(1));
//       } else {
//         courseTimes.add(courses[i * 2 + 1].children[4].data.trim());
//       }
//     }
//     console.log(courseTimes);
//   });