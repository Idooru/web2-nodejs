var readFile = require("fs").readFile;
var path = require("path");

readFile(path.join(__dirname, "sample.txt"), "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
});
