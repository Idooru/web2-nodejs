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
});
