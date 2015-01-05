require("colors");
GLOBAL.LOG_ERROR = function(err, kill) {
    if (err) {
        console.log(err.toString().red);
        if (kill) process.exit();
    }
}

GLOBAL.LOG_SUCCESS = function() {
    var messages = "";
    for (var i=0; i<arguments.length; i++) {
        messages += " " + arguments[i].cyan;
    };
    console.log(messages);
}