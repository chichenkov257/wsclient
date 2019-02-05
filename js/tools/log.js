(function () {
    var _mpath = "js/tools/log";

    define(_mpath, [], function () {

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
    });
})();

