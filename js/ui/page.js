/**
 * Created by Cubla on 01.11.2017.
 */

(function (_export) {
    var name = "js/ui/page";

    var libs = [
        "js/ui/ui",
        "js/tools/tools"
    ];

    define(name, libs, function () {
        var UI = require("js/ui/ui");
        var tools = require("js/tools/tools");

        var Page = UI.inherit({
            constructor: function page(_options) {
                var base = tools.merge({

                }, _options);

                UI.prototype.constructor.call(this, "div", "fs zero-margin zero-padding us-none relative");

                this._popups = [];
                this._handlers = {
                    on_mouse_down: this._on_mouse_down.bind(this)
                };

                this._create_popup_content();
            },
            destructor: function () {
                this._popups = [];
                this._popups_container.destructor();
                UI.prototype.destructor.call(this);
            },
            init: function () {
                window.addEventListener("mousedown", this._handlers.on_mouse_down);
            },
            deinit: function(){
                window.removeEventListener("mousedown", this._handlers.on_mouse_down);
            },
            _create_popup_content: function () {
                this._popups_container = new UI("div");
                this._popups_container.css({
                    "z-index": "10",
                    width: "0px",
                    height: "0px",
                    top: "0",
                    left: "0",
                    position: "absolute"
                });
                this.append(this._popups_container);
            },
            _on_mouse_down: function () {
                for (var a = 0; a < this._popups.length; a++)
                    this._popups[a].hide();
            },
            add_popup: function (_popup) {
                this._popups.push(_popup);
                this._popups_container.append(_popup);
            }
        });
        return Page;
    })
})(window);