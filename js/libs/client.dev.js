(function () {
    var _mpath = "js/libs/client.dev";
    var deps = [];
    define(_mpath, deps, function () {

        var log = (function () {
            var log_level = 0;
            var color_default = "color: none";
            var color_green = "color: #060";
            var log = function () {
                var args = Array.prototype.slice.call(arguments);
                var level = args.shift();
                if (level < log_level) return;
                var status = "";
                var command = "";
                var color = "";
                var offset = "";
                var offset_right = "";
                switch (level) {
                    case log.TRACE:
                        offset_right = "  ";
                        status = "TRACE";
                        command = "trace";
                        color = "color:magenta";
                        break;
                    case log.ERR:
                        offset_right = "  ";
                        status = "ERROR";
                        command = "error";
                        color = "color:red";
                        break;
                    case log.WARN:
                        status = "WARNING";
                        command = "warn";
                        color = "color:orange";
                        break;
                    case log.INFO:
                        offset = "  ";
                        offset_right = "   ";
                        status = "INFO";
                        command = "info";
                        color = "color:#05f";
                        break;
                    case log.DEBUG:
                        offset = "  ";
                        offset_right = "  ";
                        status = "DEBUG";
                        command = "log";
                        color = "color:none";
                        break;
                }
                var time = new Date();

                var h = convert(2, time.getHours());
                var m = convert(2, time.getMinutes());
                var s = convert(2, time.getSeconds());
                var ms = convert(4, time.getMilliseconds());

                var time_string = h + ":" + m + ":" + s + ":" + ms;
                var space = "  ";

                var log_arr = [color_default, color_green, time_string, color_default, color, status, color_default];
                var firt_el = "%c[%c%s%c](%c%s%c)" + offset_right + space + args.shift();
                var result_args = Array.prototype.concat.call([firt_el], log_arr, args);

                console[command].apply(console, result_args);
            };

            var convert = function (_count, _num) {
                var result = _num.toString();
                var diff = _count - result.length;
                if (diff === 0) return result;
                var a = 0;
                while (a++ < diff) result = "0" + result;
                return result;
            };

            log.TRACE = 0;
            log.ERR = 1;
            log.WARN = 2;
            log.INFO = 3;
            log.DEBUG = 4;

            return log;
        })();

        var tools = (function () {
            var tools = {};

            tools.merge = function () {
                var target = arguments[0] || {};
                var index = 1;
                var length = arguments.length;
                var deep = false;

                if (typeof target === "boolean") {
                    deep = target;
                    target = arguments[1] || {};
                    index = 2;
                }

                if (typeof target !== "object" && typeof target !== "function") {
                    target = {};
                }

                if (length === index) {
                    target = this;
                    --index;
                }

                var options, src, copy, is_arr, clone;
                for (; index < length; index++) {
                    if ((options = arguments[index]) !== undefined) {
                        for (var name in options) {
                            src = target[name];
                            copy = options[name];

                            if (target === copy) {
                                continue;
                            }

                            if (deep && copy && (Object.isObject(copy) || (is_arr = Array.isArray(copy)))) {
                                if (is_arr) {
                                    is_arr = false;
                                    clone = src && Array.isArray(src) ? src : [];

                                } else {
                                    clone = src && Object.isObject(src) ? src : {};
                                }

                                target[name] = Object.extend(deep, clone, copy);
                            } else {
                                if (copy !== undefined) {
                                    target[name] = copy;
                                }
                            }
                        }
                    }
                }
                return target;
            };

            return tools;
        })();

        var Base = (function () {
            var common_class = function () {};
            common_class.class = function (_class) {
                var that = this;
                var base = function () {};
                var newclass = _class && _class.constructor ? _class.constructor : function () {
                    that.apply(this, arguments);
                };

                base.prototype = this.prototype;
                var fn = newclass.prototype = new base();

                for (var k in _class) {
                    if (typeof _class[k] === "object" && !(_class[k] instanceof Array) && _class[k] !== undefined) {
                        fn[k] = tools.merge(true, {}, base.prototype[k], _class[k]);
                    } else {
                        fn[k] = _class[k];
                    }
                }

                for (var method in this) {
                    if (this.hasOwnProperty(method) && this[method] instanceof Function) {
                        newclass[method] = this[method]
                    }
                }

                fn.constructor = newclass;
                newclass.class = this.class;
                return newclass;
            };

            var __base = common_class.class({
                constructor: function () {
                    if (!(this instanceof common_class)) {
                        throw new Error("new not found");
                    }
                    common_class.call(this);
                    this.uncyclic = [];
                },
                destructor: function () {
                    for (var i = 0; i < this.uncyclic.length; ++i) {
                        this.uncyclic[i].call();
                    }
                    for (var k in this) {
                        if (this.hasOwnProperty(k)) {
                            this[k] = undefined;
                            delete this[k];
                        }
                    }
                }
            });

            var Base = __base.class({
                constructor: function () {
                    __base.prototype.constructor.call(this);
                    this._events = [];
                },
                on: function (_eventName, _callback, _context) {
                    if (_eventName == undefined || _callback == undefined)
                        return false;

                    if (typeof(_callback) != "function" || typeof(_eventName) != "string" || _eventName == "")
                        return false;

                    var lEvent = {
                        name: _eventName,
                        callback: _callback,
                        context: _context || null
                    };
                    this._events.push(lEvent);
                    return true;
                },
                off: function (_eventName, _callback) {
                    var a = 0;
                    if (_eventName == undefined)
                        this._events = [];

                    while (a < this._events.length) {
                        if (this._events[a].name == _eventName) {
                            if (_callback != undefined) {
                                if (this._events[a].callback == _callback) {
                                    this._events.splice(a, 1);
                                }
                            } else {
                                this._events.splice(a, 1);
                            }
                        }
                        a++;
                    }
                },
                trigger: function (_eventName, _params) {
                    var a = 0;
                    if (this._events) {
                        while (a < this._events.length) {
                            if (this._events[a].name == _eventName)
                                if (_params != undefined) {
                                    if (this._events[a].context != undefined) {
                                        return this._events[a].callback.call(this._events[a].context, _params);
                                    } else {
                                        return this._events[a].callback.call(this, _params);
                                    }
                                } else {
                                    return this._events[a].callback.call(this);
                                }
                            a++;
                        }
                    }
                }
            });

            return Base;
        })();

        var Connector = Base.class({
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

        var Dispatcher = (function () {
            var counter = 0;
            var Dispatcher = Base.class({
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
        })();

        return Dispatcher;
    });
})();