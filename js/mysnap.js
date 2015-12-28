/**
 * 一个超级mini的snap库
 */
(function() {

    function Snap(container) {
        this.node = container;
    }

    Snap.prototype.attr = function(params, value) {
        var el   = this;
        var node = el.node;
        if (!params) {
            if (node.nodeType != 1) {
                return {
                    text: node.nodeValue
                };
            }
            var attr = node.attributes;
            var out  = {};
            for (var i = 0, ii = attr.length; i < ii; i++) {
                out[attr[i].nodeName] = attr[i].nodeValue;
            }
            return out;
        }
        // 如果是string类型
        if (typeof params === "string") {
            if (arguments.length <= 1) {
                // arguments error
                return;
            }
            var json = {};
            json[params] = value;
            params = json;
        }
        for (var att in params) {
            el.node.setAttribute(att, params[att]);

        }
        return el;
    };

    // group

    Snap.prototype.group = function() {
        // 创建一个g标签，塞到svg里
        
    };
    // touchstart
    Snap.prototype.touchstart = function(cb) {
        this.node.addEventListener('touchstart', cb, false);
    };

    // touchmove
    Snap.prototype.touchmove = function(cb) {
        this.node.addEventListener('touchmove', cb, false);
    };

    // touchend
    Snap.prototype.touchend = function(cb) {
        this.node.addEventListener('touchend', cb, false);
    }

    window.Snap = Snap;
})();