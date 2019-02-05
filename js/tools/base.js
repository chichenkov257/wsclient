/**
 * Created by Cubla on 07.08.2017.
 */

(function () {
    var module_path = "js/tools/base";

    var deps = [
        "js/tools/tools"
    ];

    define(module_path, deps, function () {
        var tools = require("js/tools/tools");

        var common_class = function () {};
        common_class.inherit = function (_class) {
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
            newclass.inherit = this.inherit;
            return newclass;
        };

        var Base = common_class.inherit({
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

        var base = Base.inherit({
            constructor: function () {
                Base.prototype.constructor.call(this);
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


        return base;
    });
})();