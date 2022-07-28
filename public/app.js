const http = require('http');
const https = require("https");
const fs = require('fs');
const path = require('path');
const file=fs.readFileSync("index.html",'utf-8');
const requests = require('requests');
let options = {json: true};

var replaceVAL=(val)=>{//to replace all the {%...} things with the JSON things
  try{ 
  let tempval=file.replace("{%tempval}",val.main.feels_like)
  tempval=tempval.replace("{%cityname}",val.name)
  tempval=tempval.replace("{%weather}",val.weather[0].main)
  tempval=tempval.replace("{%city}",val.name)
  tempval=tempval.replace("{%max}",val.main.temp_max)
  tempval=tempval.replace("{%humidity}",val.main.humidity)
  tempval=tempval.replace("{%description}",val.weather[0].description)
   tempval=tempval.replace("{%icon}",val.weather[0].icon+".png")
    return tempval;//returning the html file 
  }
  catch(Exception){
    let alert = require('alert'); 
    console.log(Exception);
    alert("Some Error! Occured Please check city name");
    return " ";
  }
  }
fs.readFile("index.html", (err, html) => {
  if (err)
    throw err
    
  http.createServer((req, res) => {
    if (req.url == "/") {//if user uses index.html
      res.writeHeader(200, {'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    }
    else if (req.url.match("\.css$")) {//to render the css in the http server which mostly render static webpages
      var fileStream = fs.createReadStream("./css/style.css", "UTF-8");
      var fileStream2 = fs.createReadStream("./css/responsive.css", "UTF-8");   
      res.writeHead(200, { "Content-Type": "text/css" });
      fileStream.pipe(res);
      fileStream2.pipe(res);
    }
    else if (req.url.match("/submit")) { //When user submits the cityname 
      var q = require('url').parse(req.url, true).query;//getting cityname from url
      var cityname = q.cityname;
      var url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&appid=b6e80bc8c85496996ef7132978a18e5c&units=metric";
      var real_time="";
     
      requests(url)
      .on("data",(chunk)=>{//getting JSON data in chunks
          data = JSON.parse(chunk);
          let arr = [data]; //con catination of JSON into array for easy computation
          real_time = arr.map((val) => {
            var replaceVALOut=replaceVAL(val);
            if(replaceVALOut==" "){
              res.writeHeader(200, {'Content-Type': 'text/html' });
              res.write(html);
              res.end();
            } 
            else
            res.write(replaceVALOut)//writing the html as a response from function 
          })
            .join(""); //sice we have decalared real_time as a string to conver to string we using join
          res.end();    
        })
        .on("end",(err)=>{
          if(err)
            console.log("SOME ERROR OCCURED:",err);
        });
      }
  }).listen(8888)
})