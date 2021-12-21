const express = require('express');
const path = require('path');
const fs = require('fs');
const GEOCODER_PROVIDER = 'mapquest'
const GEOCODER_API_KEY = '7gPTjAsoANqmIkkKG4EXrXFrvwLhyUY9'
const NodeGeocoder = require('node-geocoder');
const options = {
  provider: GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: GEOCODER_API_KEY,
  formatter: null
};
const geocoder = NodeGeocoder(options);
const jsonObj = [];

app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// sendFile will go here
app.get('/', function(req, res) {
    res.render('index')
});

// sendFile will go here
app.get('/data', function(req, res) {
  res.send({data:jsonObj})
});

csvHandler()
async function csvHandler(req, res){
  fs.readFile('./XXXXXXXXXXXX.csv',async function (err,data) {
  if (err) {
    csvHandler()
  }
  bufferString = data.toString(); 
  total_rr = bufferString.split('\r')

  for (var i = 1 ; i < 50 ; i++){
    var arrObj = []
    total_rr[i] = total_rr[i].split(",")
    for (var j = 0 ; j < total_rr[i].length ; j++){
      total_rr[i][j] = total_rr[i][j].replaceAll("\n", "")
      total_rr[i][j] = total_rr[i][j].replaceAll("//", ",")
      arrObj[arrObj.length] = total_rr[i][j].trim();
      if (j == total_rr[i].length - 1 && i < 40 && (arrObj[2] && arrObj[2].toString().length > 8)){
        const res = await geocoder.geocode(arrObj[2]);        
        arrObj[arrObj.length] = res[0].latitude;
        arrObj[arrObj.length] = res[0].longitude;
      } 
      if (j == total_rr[i].length - 1 && i>=40){
          arrObj[arrObj.length] = ""
          arrObj[arrObj.length] = ""
      }
    }
    if (arrObj[2] && arrObj[2].toString().length > 40)
    jsonObj[jsonObj.length] = arrObj;
  }
  console.log(jsonObj)
  console.log(jsonObj.length)

  console.log(jsonObj[0])

  // var jsonObj = [];
  // for(var i = 1; i < arr.length; i++) {
  //   var data = arr[i].split(',');
  //   var obj = {};
  //   for(var j = 0; j < data.length; j++) {
  //      obj[headers[j]] = data[j].trim();
  //   }
  //   jsonObj.push(obj);
  // }
  // JSON.stringify(jsonObj);
  // console.log(jsonObj)

});
}

app.listen(process.env.PORT || 3370, () => console.log('Server is listening.'));