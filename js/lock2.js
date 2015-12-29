(function() {

    function getOffset(element) {
        var top  = 0;
        var left = 0;
        while (!!element) {
            top  += element.offsetTop;
            left += element.offsetLeft;
            element = element.offsetParent;
        }
        return {
            top : top,
            left: left
        };
    }
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

    var options = {
        // 矩阵大小
        count: 3,
        // 圆点大小
        pointSize: 50,
        // 容器大小
        containerSize: 300
    };

    function Lock(container, opts) {
        this.opts = extend(options, opts);
        // 经过的点
        this.path   = [];
        // 创建画布
        this.svg = Snap(container).attr({
            width : this.opts.containerSize,
            height: this.opts.containerSize
        });

        this.offset = getOffset(container);
        // console.log(this.offset);
        this.radius = this.opts.pointSize / 2;
        this.margin = (this.opts.containerSize-this.opts.count*this.opts.pointSize) / (this.opts.count*2);
    }

    var pt = {
        init: function() {
            // this.
            this.matrix = this.getMatrix();
            this.draw();

            var svg  = this.svg;
            var self = this;
            var line = null;

            var touchFlag = false;
            // touchstart
            svg.touchstart(function(e) {
                if (self.path.length) {
                    return;
                }
                touchFlag = true;
            });

            // touchmove
            var offsetLeft = this.offset.left;
            var offsetTop  = this.offset.top;

            svg.touchmove(function(e) {
                e.preventDefault();
                if (!touchFlag) {
                    return;
                }

                var x = e.touches[0].pageX - offsetLeft;
                var y = e.touches[0].pageY - offsetTop;
                
                var point = self.getPoint(x, y);
                var path  = self.path;

                var circles = self.circles;
                var points  = self.points;
                // console.log(point);
                if (path.length > 0) {
                    // 最后一条线跟着手指移动
                    line.attr({
                        x2: x,
                        y2: y
                    });
                }
                if (!!point) {
                    // 滑入了数字范围内
                    var idx = point.idx;
                    if (!~path.indexOf(idx)) {
                        // 该点没有被换
                        points
                            .selectAll('circle')[idx - 1]
                            .attr({
                                'class': 'hovered'
                            });
                        circles
                            .selectAll('circle')[idx - 1]
                            .attr({
                                stroke : 'rgba(255,255,255, 1)',
                                'class': 'hovered',
                                r      : self.radius
                            })
                            /*.animate({
                                r: self.radius,
                                stroke: 'rgba(255,255,255,1)'
                            }, 300);*/
                        // 加入已划过组
                        path.push(idx);
                        // 已经有点被加入了，有线需要闭合
                        if (path.length != 1) {
                            line.attr({
                                x2: point.x,
                                y2: point.y,
                                stroke: '#fff'
                            });
                        }
                        line = svg/*.paper*/.line(point.x, point.y, x, y).attr({
                            stroke: "rgba(255,255,255,.75)",
                            strokeWidth: 5,
                            'class': 'line'
                        });

                    }
                }
            });
            // touchend
            svg.touchend(function(e) {
                // end.call(self, e);
                // 删除最后的尾巴
                touchFlag = false;
                line.remove();
                console.log(self.path);
            });

        },
        // 画圆和圆心
        draw: function() {
            var svg    = this.svg;
            var count  = this.opts.count;
            var matrix = this.matrix;
            var radius = this.radius;

            var points  = this.points  = svg.group();
            var circles = this.circles = svg.group();

            for (var i = 0; i < count; i ++) {
                for (var j = 0; j < count; j ++) {
                    var item = matrix[i][j];
                    circles
                        .circle(item.x, item.y, radius - 2)
                        .attr({
                            fill  : 'rgba(255,255,255,0)',
                            stroke: 'rgba(255,255,255,0)',
                            strokeWidth: 2
                        });

                    points
                        .circle(item.x, item.y, 5)
                        .attr({
                            fill: '#fff'
                        });
                }
            }
        },
        // 获取每个点的坐标信息
        getMatrix: function() {
            var margin = this.margin;
            var radius = this.radius;
            var idx    = 0;
            var count  = this.opts.count;
            var matrix = [];

            for (var i = 0; i < count; i ++) {
                matrix[i] = [];
                for (var j = 0; j < count; j ++) {
                    matrix[i][j] = {
                        idx: ++idx,
                        x  : (margin + radius) * (j * 2 + 1),
                        y  : (margin + radius) * (i * 2 + 1)
                    };
                }
            }
            return matrix;    
        },

        // 判断当前点是否进入了圈内
        getPoint: function(x, y) {
            var count  = this.opts.count;
            var matrix = this.matrix;
            var radius = this.radius;
            // 遍历寻找点
            for (var i = 0; i < count; i ++) {
                for (var j = 0; j < count; j ++) {
                    var item = matrix[i][j];
                    // 严格的算法开销太大，改成近似算法
                    if (Math.abs(x - item.x) < radius &&
                        Math.abs(y - item.y) < radius) {
                        return item;
                    }
                }
            }
            return null;
        },
        // 重置
        reset: function() {
            this
                .circles
                .selectAll('circle')
                .attr({
                    fill   : 'rgba(255,255,255,0)',
                    stroke : 'rgba(255,255,255,0)',
                    'class': ''
                });

            this
                .points
                .selectAll('circle')
                .arrt({
                    'class': ''
                });
            this.svg
                .selectAll('.line')
                .remove();
        }
    };

    extend(Lock.prototype, pt);

    window.Lock = Lock;
})();