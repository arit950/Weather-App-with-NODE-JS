const http = require("http");
const fs = require("fs");
var requests = require("requests");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempMin%}",
    (orgVal.main.temp_min - 273).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempMax%}",
    (orgVal.main.temp_max - 273).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace(
    "{%status%}",
    orgVal.weather[0].description
  );
  return temperature;
};

const homefile = fs.readFileSync("home.html", "utf-8");

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=4737555839f29a311b172d23af820fb5"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arr = [objData];
        const realTimeData = arr
          .map((val) => replaceVal(homefile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(5000, "127.0.0.1");
