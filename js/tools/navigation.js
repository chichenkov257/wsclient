/**
 * Created by pham on 8/8/17.
 */
(function (_export) {
    var name = "js/tools/navigation";
    var libs = [
        "js/tools/base",
        "js/tools/pages_list",
        "js/tools/tools"
    ];
    define(name, libs, function () {
        var Basic = require("js/tools/base");
        var pages_map = require("js/tools/pages_list");
        var tools = require("js/tools/tools");

        var navigation = Basic.inherit({
            constructor: function navigation(_options) {
                var base = tools.merge({
                    redirect_error_page: "main"
                    redirect_error_page: "main"
                }, _options);

                Basic.prototype.constructor.call(this, base);

                this._redirect_error_page = base.redirect_error_page;
                this._history = [];

                window.addEventListener("hashchange", function (_event) {
                    var page_id = _event.newURL.split("/").pop().split("#").pop();
                    if (this._history[this._history.length - 1] !== page_id) {
                        this.open(page_id);
                    }
                }.bind(this));
            },
            open: function (_id, _options) {
                console.log("open");

                var is_break = this.trigger("before_open");
                if(is_break){
                    return;
                }
                var arr = _id.split("?");
                var clear_page_id = arr[0];
                var query = arr[1];

                var is_error_page = false;
                if (!pages_map[clear_page_id]) {
                    clear_page_id = this._redirect_error_page;
                    is_error_page = true;
                }
                var _page = new pages_map[clear_page_id](_options, query);

                if(!window.constructed) debugger;

                window.location = "#" + _id;
                document.body.appendChild(_page.wrapper);
                _page.init();
                _page.refresh();

                this._history.push(_id);
                if(this.page) {
                    this.page.deinit();
                    this.page.destructor();
                    document.body.removeChild(this.page.wrapper);
                }

                this.page = _page;
            },
            parse_query: function () {
                var query = {};
                var keys = [];

                if (location.search.length > 0) {
                    location.search.slice(1).split("&").forEach(function (val) {
                        var arr = val.split("=");
                        keys.push(arr[0]);
                        query[arr[0]] = arr[1].replace(/%2F/g, "/").replace(/%3A/g, ":").replace(/%2C/g, ",").replace(/%3D/g, "=").replace(/%2B/g, "+").replace(/%3F/g, "?");
                    });
                }

                return query;
            },
            back: function(){
                this._history.pop();
                if(this._history.length !== 0) this.open(this._history.pop());
            }
        });
        return navigation;
    })
})(window);