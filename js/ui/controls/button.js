/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/ui/controls/button";

    var libs = [
        "js/ui/ui",
        "js/tools/tools"
    ];

    define(name, libs, function () {
        var UI = require("js/ui/ui");
        var tools = require("js/tools/tools");

        var Button = UI.inherit({
            constructor: function button(_options) {
                var base = tools.merge({
                    text: "test"
                }, _options);

                UI.prototype.constructor.call(this, "div", "button1 bs relative wf border1 bg-grid fg1 fg-shadow fg-size-m cp no-select padding-l");

                this._text = base.text;
                this._init();
            },
            _init: function () {
                UI.prototype._init.call(this);

                this._button_text = new UI("div", "bs wf tac uppercase dib");
                this.append(this._button_text);

                this._button_text.inner_text(this._text);
            },
            _set_style: function (_k, _v) {
                UI.prototype._set_style.call(this, _k, _v);

                switch (_k){
                    case "width":
                    case "height":
                        this._button_text.css(_k, _v);
                        break;
                }
            }
        });

        return Button;
    })
})(window);