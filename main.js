var qs = require("querystring");
var http = require("http");
var fs = require("fs");
var url = require("url");

function templateHTML(title, list, body, control) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <title>WEB - ${title}</title>
            <meta charset="utf-8" />
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
    </html>
    `;
}

function templateList(filelist) {
    var list = "<ul>";
    var i = 0;

    while (i < filelist.length) {
        list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i++;
    }

    list += "</ul>";
    return list;
}

var app = http.createServer(function (req, res) {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;

    if (pathName === "/") {
        if (queryData.id === undefined) {
            fs.readdir("./data", function (err, filelist) {
                var title = "Welcome";
                var description = "Hello, Node.js";
                var list = templateList(filelist);
                var template = templateHTML(
                    title,
                    list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`
                );
                res.writeHead(200);
                res.end(template);
            });
        } else {
            fs.readdir("./data", function (err, filelist) {
                fs.readFile(
                    `data/${queryData.id}`,
                    "utf-8",
                    (err, description) => {
                        var title = queryData.id;
                        var list = templateList(filelist);
                        var template = templateHTML(
                            title,
                            list,
                            `<h2>${title}</h2>${description}`,
                            `
                            <a href="/create">create</a> 
                            <a href="/update?id=${title}">update</a>
                            <form action="delete_process" method="post" onsubmit="">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                            </form>
                            `
                        );
                        res.writeHead(200);
                        res.end(template);
                    }
                );
            });
        }
    } else if (pathName === "/create") {
        fs.readdir("./data", function (err, filelist) {
            var title = "WEB - create";
            var list = templateList(filelist);
            var template = templateHTML(
                title,
                list,
                `<form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"/></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit" />
                    </p>
                </form>`,
                ""
            );
            res.writeHead(200);
            res.end(template);
        });
    } else if (pathName === "/create_process") {
        var body = "";

        req.on("data", function (data) {
            body += data;
        });

        req.on("end", function () {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, "utf8", function (err) {
                res.writeHead(302, { Location: `/?id=${title}` });
                res.end();
            });
        });
    } else if (pathName === "/update") {
        fs.readdir("./data", function (err, filelist) {
            fs.readFile(`data/${queryData.id}`, "utf-8", (err, description) => {
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(
                    title,
                    list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit" />
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                res.writeHead(200);
                res.end(template);
            });
        });
    } else if (pathName === "/update_process") {
        var body = "";

        req.on("data", function (data) {
            body += data;
        });

        req.on("end", function () {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            fs.rename(`data/${id}`, `data/${title}`, function (err) {
                fs.writeFile(
                    `data/${title}`,
                    description,
                    "utf8",
                    function (err) {
                        res.writeHead(302, { Location: `/?id=${title}` });
                        res.end();
                    }
                );
            });
        });
    } else if (pathName === "/delete_process") {
        var body = "";

        req.on("data", function (data) {
            body += data;
        });

        req.on("end", function () {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function (err) {
                res.writeHead(302, { Location: `/` });
                res.end();
            });
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

app.listen(3000);
