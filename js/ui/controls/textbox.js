/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/ui/controls/textbox";
    var libs = [
        "js/ui/ui",
        "js/tools/tools"
    ];

    load_css("css/ui/input");
    define(name, libs, function () {
        var UI = require("js/ui/ui");
        var tools = require("js/tools/tools");

        var Input = UI.inherit({
            constructor: function input(_options) {
                var base = tools.merge({
                    value: "",
                    placeholder: ""
                }, _options);

                UI.prototype.constructor.call(this, "input", "input1 bg-grid border1 fg2 fg-size-m padding-l tac wf");

                this._value = base.value;
                this._placeholder = base.placeholder;

                this.attrs({
                    value: this._value,
                    placeholder: this._placeholder
                });
            }
        });

        return Input;
    })
})(window);