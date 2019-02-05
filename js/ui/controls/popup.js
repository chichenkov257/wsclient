/**
 * Created by Cubla on 04.01.2019.
 */
(function () {
    var name = "js/ui/controls/popup";
    var libs = [
        "js/client/ui/lay"
    ];

    define(name, libs, function () {
        var Lay = require("js/client/ui/lay");

        var popup = Lay.inherit({
            constructor: function popup(_options) {
                var base = {
                    width: "10px",
                    height: "10px",
                    elem_type: "div",
                    /** элемент на который будет прикреплен попап */
                    target: null,
                    /** содержимое попапа */
                    content: null,
                    left: true,
                    top: true,
                    out_left: true,
                    out_top: true
                };
                Object.extend(base, _options);
                Lay.prototype.constructor.call(this, base);

                this._target = base.target;
                this._content = base.content;
                this._left = base.left;
                this._top = base.top;
                this._out_left = base.out_left;
                this._out_top = base.out_top;
                this._create_content();

                this._show = false;
                this.add_class("dn absolute bg-grid bg1-50 border3 shadow1 oh");

                this.css({
                    width: base.width,
                    height: base.height
                });

                this._slot_on_mouse_down = this.add_event("mousedown", this._on_mouse_down.bind(this));
            },
            destructor: function () {
                this.remove_event(this._slot_on_mouse_down);
            },
            _create_content: function () {
                this.append(this._content);
            },
            show: function () {
                this._show = true;
                this.remove_class("dn");
                this._position();
            },
            hide: function () {
                this._show = false;
                this.add_class("dn");
            },
            _on_mouse_down: function (_event) {
                _event.stopPropagation();
                _event.preventDefault();
            },
            _position: function() {
                var bounds_target = this._target.__wrapper.getBoundingClientRect();
                var bounds_popup = this.__wrapper.getBoundingClientRect();

                if (!this._left) {
                    this.css({left: (bounds_target.left - bounds_popup.width + (this._out_left ? 0 : bounds_target.width)) + "px"});
                } else {
                    this.css({left: (bounds_target.left + (this._out_left ? bounds_target.width : 0)) + "px"});
                }

                if (!this._top) {
                    this.css({top: (bounds_target.top - bounds_popup.height + (this._out_top ? 0 : bounds_target.height)) + "px"});
                } else {
                    this.css({top: (bounds_target.top + (this._out_top ? bounds_target.height : 0)) + "px"});
                }
            },
            refresh: function () {
                Lay.prototype.refresh.call(this);
                this._position();
            }
        });

        return popup;
    })
})();