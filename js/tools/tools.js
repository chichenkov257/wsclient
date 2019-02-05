/**
 * Created by Aleksey Chichenkov <a.chichenkov@initi.ru> on 12/11/18.
 */

(function () {
    var _mpath = "js/tools/tools";
    define(_mpath, [], function () {
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

        tools.printf = function () {
            var text = arguments[0];
            var out = "";
            var counter = 1;
            for(var a = 0; a < text.length; a++) {
                var symbol = text[a];
                if(symbol === "%") {
                    var type_symbol = text[a++];
                    switch (type_symbol) {
                        case "s":
                            out += arguments[counter++];
                            break;
                        case "i":
                            out += arguments[counter++].toString();
                            break;
                        case " ":
                            out += " ";
                            break;
                        default:
                            out += arguments[counter++];
                    }
                } else {
                    out += symbol;
                }
            }

            return out;
        };

        return tools;
    })
})();

