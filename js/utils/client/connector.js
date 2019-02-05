/**
 * Created by pham on 8/8/17.
 */
(function () {
    var _mpath = "js/utils/client/connector";

    var deps = [
        "js/tools/tools",
        "js/tools/log",
        "js/tools/base"
    ];

    define(_mpath, deps, function () {
        var tools = require("js/tools/tools");
        var log = require("js/tools/log");
        var Base = require("js/tools/base");

        var Connector = Base.inherit({
            constructor: function connector(_options) {
                var base = tools.merge({
                    protocol: null,
                    host: null,
                    port: null
                }, _options);

                Base.prototype.constructor.call(this);

                this._protocol = base.protocol;
                this._host = base.host;
                this._port = base.port;

                this.create_socket();
            },
            create_socket: function () {
                this._socket = new WebSocket(this._protocol + "://" + this._host + ":" + this._port);
                this._socket.addEventListener("open", this._on_open.bind(this));
                this._socket.addEventListener("close", this._on_close.bind(this));
                this._socket.addEventListener("message", this._on_message.bind(this));
                this._socket.addEventListener("error", this._on_error.bind(this));
            },
            close: function () {
                this._socket.close();
            },
            socket: function () {
                return this._socket;
            },
            _on_open: function (_data) {
                log(log.INFO, "Connection [" + this._protocol + "://" + this._host + ":" + this._port + "] opened");
                this.trigger("open", _data.data);
            },
            _on_close: function (_data) {
                if (_data.wasClean) {
                    log(log.INFO, "Closed clean");
                } else {
                    log(log.INFO, "Connection closed by server"); // например, "убит" процесс сервера
                }
                log(log.INFO, "Code: " + _data.code + " reason: " + _data.reason);
                this.trigger("closed", _data);
            },
            _on_message: function (_data) {
                var parsed = JSON.parse(_data.data);
                log(log.INFO, "\n%cIN:\n%s", "color: red", JSON.stringify(parsed, true, 3));
                this.trigger("data", parsed);
            },
            _on_error: function (_error) {
                log(log.INFO, "ERR:\n" + _error.message);
                this.trigger("error", _error);
            },
            send: function(_data){
                var result = JSON.stringify(_data);
                log(log.INFO, "\n%cOUT:\n%s", "color: blue", JSON.stringify(_data, true, 3));
                this._socket.send(result);
            }
        });

        return Connector;
    });
})(window);