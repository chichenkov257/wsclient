(function (_export) {
    var name = "js/ui/pages/public/main";
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

        var Auth = Page.inherit({
            constructor: function auth(_options) {
                var base = tools.merge({}, _options);

                Page.prototype.constructor.call(this, base);

                this._handlers = {
                    // on_key_down: this._on_key_down.bind(this)
                };

                // this._create_vk_async_loader();
                // this._create_background();
                console.log("Auth page constructor");
                window.constructed = true;

                this._check();
            },
            destructor: function () {
                // window.removeEventListener("keydown", this._handlers.on_key_down);

            },
            _check: function () {
                console.log("Auth page _check");

                if(sessionStorage.getItem("requestToken") !== null){

                    console.log("now you are request_token");

                    var rid = window.dispatcher.add(function (_e) {
                        if(_e.success) {
                            window.dispatcher.remove(rid);
                            var info = ui.from_html("<div>now you are logged and get account info</div>");
                            this.append(info);
                        } else {
                            sessionStorage.clear();
                            location.href = "";
                        }

                    }.bind(this));
                    window.dispatcher.send(rid, ["api", "user", "get_user_info"], {
                        request_token: sessionStorage.getItem("requestToken")
                    });

                    return;
                }

                var q = nav.parse_query();
                if (q["openid.ns"]) {
                    console.log("Auth page get login");

                    var auth_token = q["auth_token"];

                    var rid = window.dispatcher.add(function (_data) {
                        sessionStorage.setItem("requestToken", _data.request_token);
                        location.href = location.href.split("?")[0];
                    });
                    window.dispatcher.send(rid, ["api", "user", "auth"], {
                        options: q,
                        auth_token: auth_token
                    })

                } else {
                    this._create_button();
                }
            },
            request_auth_token: function (_cbk) {
                var rid = window.dispatcher.add(function (_e) {
                    window.dispatcher.remove(rid);
                    _cbk(_e);
                });
                window.dispatcher.send(rid, ["api", "user", "get_auth_token"]);
            },
            _create_button: function () {
                console.log("Auth page create button");

                var button = ui.from_html("<div>authorize</div>");
                this.append(button);
                button.add_event("click", this._start_steam_auth.bind(this));
            },
            _start_steam_auth: function () {
                this.request_auth_token(function (_data) {
                    var auth_token = _data.auth_token;

                    debugger;
                    var options = {
                        "openid.ns": "http://specs.openid.net/auth/2.0",
                        "openid.mode": "checkid_setup",
                        "openid.return_to": "http://" + location.host + location.pathname + "?auth_token=" + auth_token,
                        "openid.realm": "http://" + location.host,
                        "openid.ns.sreg": "http://openid.net/extensions/sreg/1.1",
                        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
                        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
                    };
                    var res = [];
                    for (var key in options) {
                        res.push(key + "=" + options[key]);
                    }
                    var q = res.join("&");

                    var uri = "https://steamcommunity.com/openid/login?" + q;

                    window.location = uri;

                });

            }

        });

        var get_options = function (_options) {
            var arr = [];
            for(var k in _options) arr.push(k + "=" + _options[k]);
            return arr.join("&");
        };



        return Auth;
    });
})(window);