var transdata = require("transdata");
var ini = require('ini');
var fs = require('fs');
const express = require('express');
var url = require("url");
var path = require("path");
var qs = require('querystring');
var log4js = require("log4js");
var yargs = require('yargs');



var argv = yargs.reset().option("c", {
  alias: "config_file_path",
  demand: true,
  default: path.resolve(''),
  description: "config file path"
}).option("p", {
  alias: "port",
  demand: true,
  default: '4000',
  description: "port"
}).help("h").alias("h", "help").argv;

var Info = ini.parse(fs.readFileSync(argv.c + "/config.ini", "UTF-8"));

// log
log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    day: {
      type: 'dateFile', filename: argv.c + "/logs/date", alwaysIncludePattern: true, pattern: "-yyyy-MM-dd.log"
    }
  },
  categories: {
    default: { appenders: ['out', 'day'], level: Info.log },
  }
});

var Log = log4js.getLogger();

const app = express();




app.post('*', function (request, response) {
  var pathname = url.parse(request.url).pathname;
  transdata.post({
    req: request,
    url: Info.urlroot + pathname,
    res: response,
    success: function () {
      Log.info(pathname + "-- success");

    },
    error: function (e) {
      Log.error(e);
      Log.info(pathname + "-- error");
    }
  });
});

app.listen(argv.p, function (err, result) {
  if (err) {
    Log.info(err);
  }
  Log.info('Server running on port ' + argv.p);
});