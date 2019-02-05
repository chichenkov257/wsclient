(function (_export) {
    var name = "js/ui/pages/public/winbox";
    var libs = [
        "js/ui/page",
        "js/tools/tools",
        // "js/client/ui/button",
        "js/ui/ui",
        // "js/client/ui/input",
        // "js/client/requests/api/auth/auth",
        // "js/client/utils/md5"
    ];

    define(name, libs, function () {
        var Page = require("js/ui/page");
        var ui = require("js/ui/ui");
        var tools = require("js/tools/tools");

        // var Button = require("js/client/ui/button");
        // var Input = require("js/client/ui/input");
        // var Lay = require("js/client/ui/lay");
        // var request_auth = require("js/client/requests/api/auth/auth");
        // var md5 = require("js/client/utils/md5");

        var winbox = Page.inherit({
            constructor: function winbox(_options) {
                var base = tools.merge({

                }, _options);

                Page.prototype.constructor.call(this, base);

                this._handlers = {
                    // on_key_down: this._on_key_down.bind(this)
                };
                // window.addEventListener("keydown", this._handlers.on_key_down)

                // console.log(tools.printf("_%s__%s_", "[aas]", "[sfs]"));


                this._create_vk_async_loader();
            },
            destructor: function () {
                // window.removeEventListener("keydown", this._handlers.on_key_down);

            },
            _create_vk_async_loader: function(){

                var el = document.getElementById("vk_api_transport");

                if(!el) {
                    this._vk_api_tr = ui.from_html('<div id="vk_api_transport"></div>');
                    new ui(document.body).prepend(this._vk_api_tr);
                }

                window.vkAsyncInit = function() {
                    VK.init({
                        apiId: 6814461
                    });
                };

                var el = new ui("script");
                el.wrapper.type = "text/javascript";
                el.wrapper.src = "https://vk.com/js/api/openapi.js?160";
                el.wrapper.async = true;
                this._vk_api_tr.append(el);
            },
            init: function () {
                Page.prototype.init.call(this);
            },

        });

        return winbox;
    });
})(window);