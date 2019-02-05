/**
 * Created by Cubla on 01.11.2017.
 */
(function (_export) {
    var name = "js/ui/ui";

    var libs = [
        "js/tools/base",
        "js/tools/tools",
    ];

    define(name, libs, function () {
        var base = require("js/tools/base");
        var tools = require("js/tools/tools");

        var id = 0;
        var ui = base.inherit({
            constructor: function ui(_tag, _classes) {

                base.prototype.constructor.call(this);

                this._children = [];
                this._listeners = {};

                window.addEventListener("resize", this.refresh.bind(this));

                this._create_dom_wrapper(_tag, _classes);
            },

            // private
            _create_dom_wrapper: function(_tag, _classes){
                if(_tag instanceof Element) {
                    this.wrapper = _tag;
                } else {
                    this.wrapper = document.createElement(_tag);
                }

                this.add_class(_classes);
            },
            _set_style: function (_k, _v) {
                this.wrapper.style[_k] = _v;
            },

            // public
            add_child: function (_child) {
                this._children.push(_child);
            },
            add_class: function (_classes) {
                if(_classes && _classes !== "") {
                    var arr = _classes.split(" ");
                    for (var a = 0; a < arr.length; a++) {
                        if(arr[a] !== "") this.wrapper.classList.add(arr[a]);
                    }
                }
            },
            add_event: function (_type, _callback) {
                var lid = id++;
                this._listeners[lid] = {
                    type: _type, callback: _callback
                };
                this.wrapper.addEventListener(_type, _callback, false);
                return lid;
            },
            append: function (_lay) {
                this.wrapper.appendChild(_lay.wrapper);
                this.add_child(_lay);
            },
            attrs: function (_key, _value) {
                if(_value === undefined){
                    if (_key.toString() === "[object Object]") {
                        for (var k in _key) {
                            if (_key.hasOwnProperty(k)) {
                                this.wrapper.setAttribute(k, _key[k]);
                            }
                        }
                    } else {
                        return this.wrapper.getAttribute(_key);
                    }
                    return;
                }
                this.wrapper.setAttribute(_key, _value);
            },
            css: function (_key, _value) {
                if(_value === undefined) {
                    if (_key.toString() === "[object Object]") {
                        for (var k in _key) {
                            if (_key.hasOwnProperty(k)) {
                                this._set_style(k, _key[k]);
                            }
                        }
                    } else {
                        return this.wrapper.style[_key];
                    }
                }
                this._set_style(_key, _value);
            },
            inner_text: function(_text){
                this.wrapper.innerText = _text;
            },
            prepend: function(_lay, _index){
                if(_index === undefined) _index = 0;

                var children = this.wrapper.children;
                if(children && children.length && children.length > _index){
                    var child = children[_index];
                    _lay.wrapper.insertBefore(child);
                }
                this.wrapper.appendChild(_lay.wrapper);
                this.add_child(_lay)
            },
            refresh: function (_event) {
                var a = 0;
                while( a < this._children.length){
                    this._children[a].refresh && this._children[a].refresh(_event);
                    a++;
                }
            },
            remove: function (_lay) {
                this.wrapper.removeChild(_lay.wrapper);
                this.remove_child(_lay);
            },
            remove_child: function (_child) {
                var index = this._children.indexOf(_child);
                this._children.splice(index, 1);
            },
            remove_class: function (_classes) {
                var arr = _classes.split(" ");
                for(var a = 0; a < arr.length; a++){
                    this.wrapper.classList.remove(arr[a]);
                }
            },
            remove_event: function (_lid) {
                var data = this._listeners[_lid];
                this.wrapper.removeEventListener(data.type, data.callback);
                delete this._listeners[_lid];
            },
            html: function (_html) {
                this.wrapper.innerHTML = _html;
            }
        });

        tools.merge(ui, {
            from_html: function (_string, _classes) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(_string, 'text/html');
                if(doc.body.children.length > 0){
                    return new ui(doc.body.children[0], _classes);
                } else {
                    return false;
                }
            } 
        });

        return ui;
    })
})(window);