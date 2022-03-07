var http = require("http");
var fs = require("fs");
var url = require("url");

var app = http.createServer(function (req, res) {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    if (pathName === "/") {
        if (queryData.id === undefined) {
            fs.readdir("./data", function (err, filelist) {
                var title = "Welcome";
                var descripttion = "Hello, Node.js";
                var list = "<ul>";
                var i = 0;

                while (i < filelist.length) {
                    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }

                list += "</ul>";

                var template = `<!DOCTYPE html>
                    <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="utf-8" />
                        </head>
                        <body>
                            <h1><a href="/">WEB</a></h1>
                            ${list}
                            <h2>${title}</h2>
                            <p>${descripttion}</p>
                        </body>
                    </html>
                    `;
                res.writeHead(200);
                res.end(template);
            });
        } else {
            fs.readdir("./data", function (err, filelist) {
                var list = "<ul>";
                var i = 0;

                while (i < filelist.length) {
                    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }

                list += "</ul>";

                fs.readFile(
                    `data/${queryData.id}`,
                    "utf-8",
                    (err, descripttion) => {
                        var title = queryData.id;
                        var template = `<!DOCTYPE html>
                <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8" />
                    </head>
                    <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <p>${descripttion}</p>
                    </body>
                </html>
                `;
                        res.writeHead(200);
                        res.end(template);
                    }
                );
            });
        }
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

app.listen(3000);
