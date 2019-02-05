/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/ui/controls/img_button";
    var libs = [
        "js/ui/ui",
        "js/tools/tools"
    ];

    define(name, libs, function () {
        var UI = require("js/ui/ui");
        var tools = require("js/tools/tools");

        var img_button = UI.inherit({
            constructor: function button(_options) {
                var base = tools.merge({
                    elem_type: "div",
                    image: ""
                }, _options);
                UI.prototype.constructor.call(this, "div", "button1 bs relative bg-grid fg-shadow fg-size-m cp no-select padding-l bg-pos-middle bg-fs bg-no-repeat");

                this._image = base.image;
                this._set_image();
            },
            _set_image: function () {
                this.css({
                    "background-image": "url(" + this._image + ")"
                });
            }
        });

        return img_button;
    })
})(window);