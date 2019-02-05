/**
 * Created by pham on 8/8/17.
 */
(function () {
    var _mpath = "js/utils/client/dispatcher";

    var deps = [
        "js/tools/tools",
        "js/tools/log",
        "js/tools/base",
        "js/utils/client/connector"
    ];

    define(_mpath, deps, function () {
        var tools = require("js/tools/tools");
        var log = require("js/tools/log");
        var Base = require("js/tools/base");
        var Connector = require("js/utils/client/connector");

        var counter = 0;
        var Dispatcher = Base.inherit({
            constructor: function dispatcher(_options) {
                var base = tools.merge({
                    protocol: null,
                    host: null,
                    port: null
                }, _options);

                Base.prototype.constructor.call(this);

                this._connector = null;
                this._subscribers = Object.create(null);

                this._protocol = base.protocol;
                this._host = base.host;
                this._port = base.port;

                this._connection_id = -1;

                this.start_connector();
            },
            start_connector: function () {
                this._connector = new Connector({
                    protocol: this._protocol,
                    host: this._host,
                    port: this._port
                });
                this._connector.on("data", this._on_data.bind(this));
                this._connector.on("closed", this._on_closed.bind(this));
            },
            _on_data: function (_event) {
                if(_event.event_type === "new_connection"){
                    this._connection_id = _event.subscriber_id;
                    log(log.INFO, "Client Ready");
                    this.trigger("ready", _event);
                } else {
                    var info = this._subscribers[_event.response_id];
                    if(info){
                        info.callback(_event);
                    } else {
                        log(log.WARN, "Default event handler (%s)", _event.route.join("."));
                    }
                }
            },
            _on_closed: function(_data){
                log(log.INFO, "Socket closed");
                this.trigger("closed", _data);
            },
            add: function (_callback) {
                var id = counter++;
                this._subscribers[id] = new _data(null, _callback);
                return id;
            },
            remove: function (_sid) {
                delete this._subscribers[_sid];
            },
            send: function(_response_id, _route, _data){
                this._connector.send({
                    response_id: _response_id,
                    subscriber_id: this._connection_id,
                    route: _route,
                    data: _data
                });
            }
        });

        var _data = function _data(_data, _callback){
            this.data = _data;
            this.callback = _callback;
        };

        return Dispatcher;
    })
})();