/**
 * 一个超级mini的snap库
 */
(function() {

    var xlink = "http://www.w3.org/1999/xlink";
    var xmlns = "http://www.w3.org/2000/svg";

    var attr_map = {  
        "className": "class",  
        "svgHref"  : "href"  
    };

    var ns_map = {  
        "svgHref": xlink
    };
    // $.extend
    function extend() {
        var args  = Array.prototype.slice.call(arguments);
        if (!args.length) {
            return;
        }
        var first = args[0];
        for (var i = 0, item; item = args[++i];) {
            for (var prop in item) {
                if (item.hasOwnProperty(prop)) {
                    first[prop] = item[prop];
                }
            }
        }
        return first;
    }

    function create(obj) {
        if (Object.create) {
            return Object.create(obj);
        }
        var f = function() {};
        f.prototype = obj;
        return new f();
    }

    function slice(from, to, f) {
        return function(arr) {
            var res = arr.slice(from, to);
            if (res.length == 1) {
                res = res[0];
            }
            return f ? f(res) : res;
        };
    }
    // 一个很挫的实现方式
    function transformLetter(str) {
        var res = [];
        for (var i = 0, l = str.length; i < l; i ++) {
            if (!isNaN(+str[i])) {
                res.push(str[i]);
                continue;
            }
            var idx = str.charCodeAt(i);
            if (idx >= 97) {
                res.push(str[i]);
            } else {
                var c = String.fromCharCode(idx + 32);
                res.push('-' + c);
            }
        }
        return res.join('');
    }

    function make(tag) {
        // 创建元素
        return new Snap(document.createElementNS(xmlns, tag));
    }

    function Snap(container) {
        if (!(this instanceof Snap)) {
            return new Snap(container);
        }
        this.node = container;
    }
    // 类数组
    Snap.Set = function() {
        var array = extend(new Array(), {
            attr: function(opts) {
                var arr = this;
                for (var i = 0,l = arr.length; i < l; i ++) {
                    arr[i].attr(opts);
                }
            },
            // remove
            remove: function() {
                var arr = this;
                for (var i = 0, l = arr.length; i < l; i ++) {
                    arr[i].remove();
                }
            }
        });
        return create(array);
    }

    var pt = {
        attr: function(opts) {
            var node = this.node;
            for (var i in opts) {
                if (!opts.hasOwnProperty(i)) {
                    continue;
                }
                var name;
                if (i in attr_map) {
                    name = attr_map[i];
                } else {
                    name = i;
                }
                var value = opts[i];
                if (i in ns_map) {
                    node.setAttributeNS(ns_map[i], name, value);  
                } else {
                    name = transformLetter(name);
                    // console.log(name, transformLetter(name))
                    // i.replace(/[A-Z]/g, );
                    node.setAttribute(name, value);
                }
            }
            return this;
        },

        selectAll: function(query) {
            var nodes = this.node.querySelectorAll(query);
            var res   = Snap.Set();
            for (var i = 0; i < nodes.length; i++) {
                res.push(new Snap(nodes[i]));
            }
            return res;
        },

        select: function(query) {
            var node = this.node.querySelectorAll(query);
            return new Snap(node);
        },

        group: function() {
            var group = make('g');
            this.node.appendChild(group.node);
            return group;
        },

        circle: function(cx, cy, r) {
            var circle = make('circle');
            circle.attr({
                cx: cx,
                cy: cy,
                r : r
            });
            this.node.appendChild(circle.node);
            return circle;
        },
        line: function(x1, y1, x2, y2) {
            var path = make('line');
            path.attr({
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            });
            this.node.appendChild(path.node);
            return path;
        },
        remove: function() {
            if (this.node) {
                this.node.parentNode.removeChild(this.node);
                this.node = null;
            }
        },
        
        animate: function(attrs, ms) {
            // 只变了透明度和半径
            // to do...
        }
    };

    ['start', 'move', 'end'].forEach(function(ent) {
        ent = 'touch' + ent;
        pt[ent] = function(cb) {
            this.node.addEventListener(ent, cb, false);
        }
    });
    extend(Snap.prototype, pt);

    window.Snap = Snap;
})();