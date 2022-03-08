var fs = require("fs").promises;
var path = require("path");

var text = "Ying Gimorring!";

fs.writeFile("node.js/Idooru.txt", text, "utf8")
    .then(() => {
        console.log("파일 생성 완료!");
    })
    .catch((err) => {
        console.error(err);
    });
