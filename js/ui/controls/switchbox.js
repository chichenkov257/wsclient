/**
 * Created by Cubla on 16.09.2017.
 */
(function (_export) {
    var name = "js/ui/controls/switchbox";
    var libs = [
        "js/ui/ui"
    ];

    define(name, libs, function () {
        var Lay = require("js/ui/ui");

        var switchbox = Lay.inherit({
            constructor: function switchbox(_options) {
                var base = {
                    elem_type: "div",
                    enable: false
                };
                Object.extend(base, _options);
                Lay.prototype.constructor.call(this, base);

                this._enable = base.enable;

                this.add_class("ui-switch-box sb-enable border-radius-l bg2 relative");
                this._slot = this.add_event("click", this._on_click.bind(this));
                this._apply();
            },
            destructor: function () {
                this.remove_event(this._slot);
                Lay.prototype.destructor.call(this);
            },
            _init: function () {
                Lay.prototype._init.call(this);
                this.add_class("bs");

            },
            enable: function(_bool){
                this._enable = _bool;
                this._apply();
            },
            switch: function () {
                this._enable = !this._enable;
                this._apply();
            },
            _apply: function() {
                this._enable ? this._set_enable() : this._set_disable();
            },
            _set_enable: function () {
                this.remove_class("bg2");
                this.add_class("sb-false bg3");
            },
            _set_disable: function () {
                this.remove_class("sb-false bg3");
                this.add_class("bg2");
            },
            _on_click: function () {
                this.switch();
            }
        });

        return switchbox;
    })
})(window);