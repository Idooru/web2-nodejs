const { readdir } = require("fs").promises;

readdir("./data")
    .then((result) => {
        console.log(result);
    })
    .catch(console.error);
