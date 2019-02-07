var deps = [
    "js/libs/client.dev",
    "js/tools/log",
    "js/config",

    "js/tools/navigation"
];

require(deps, function () {
    var log = require("js/tools/log");
    var config = require("js/config");
    var Dispatcher = require("js/libs/client.dev");

    var navigation = require("js/tools/navigation");
    window.nav = new navigation();

    var _process_navigation = function () {
        var page = location.hash !== undefined && (location.hash).slice(1);

        var query = nav.parse_query();
        if(query.state) {
            sessionStorage.setItem("code", query.code);
            location.href = location.origin + location.pathname + "#" + query.state;
            return;
        }
        window.nav.open( page || "main" );
    };

    var _entry = function (_data) {
        _process_navigation();
    };

    window.dispatcher = new Dispatcher({
        protocol: config.connection.socket.proto,
        host: config.connection.socket.host,
        port: config.connection.socket.port
    });
    dispatcher.on("ready", _entry);


    /**
     * Example for add handler from server and get response
        var rid = window.dispatcher.add(function (_data) { console.log("test") });
        window.dispatcher.send(rid, ["api", "test"], {
            test: "test string"
        })
     */

});