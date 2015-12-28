(function() {

    function getElementLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualLeft;
　　}

　　function getElementTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　return actualTop;
　　}

    var opts = {
        count: 3,
        containerSize: 300,
        gridSize: 50
    };

    var wrap = document.getElementById('lock');

    var offsetLeft = getElementLeft(wrap);
    var offsetTop  = getElementTop(wrap);
    // 经过的点
    var passedList = [];

    var container = Snap(wrap);

    var radius    = opts.gridSize / 2;
    var margin    = (opts.containerSize-opts.count*opts.gridSize) / (opts.count*2);


    function getMatrix() {
        var idx    = 0;
        var count  = opts.count;
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
    }

    var matrix = getMatrix();


    function getPoint(x, y) {
        var count  = opts.count;
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
    }
    // 画点
    function draw() {
        var count  = opts.count;
        var point  = container.group();
        var circle = container.group();

        var line   = null;

        for (var i = 0; i < count; i ++) {
            for (var j = 0; j < count; j ++) {
                var item = matrix[i][j];
                var c = circle.circle(item.x, item.y, radius);
                var p = point.circle(item.x, item.y, 5);
                c.attr({
                    fill: 'rgba(0,0,0,0)',
                    stroke: 'rgba(0,0,0,0)',
                    strokeWidth: 2
                });
                p.attr({
                    fill: '#fff'
                });
            }
        }

        container.touchmove(function(e) {
            // console.log(e);
            e.preventDefault();
            var x = e.touches[0].pageX - offsetLeft,
                y = e.touches[0].pageY - offsetTop;
            // console.log(x, y)

            // 计算手指进入了哪个圈内
            var point = getPoint(x, y);
            // console.log(point);
            if (passedList.length > 0) {
                // 最后一条线跟着手指移动
                line.attr({
                    x2: x,
                    y2: y
                });
            }
            if (!!point) {
                // 滑入了数字范围内
                var idx = point.idx;
                if (!~passedList.indexOf(idx)) {
                    // 该点没有被换
                    // 找到对应的点
                    circle.selectAll('circle')[idx - 1].attr({
                        stroke: '#fff',
                    });
                    // $content.find('li').eq(index - 1).addClass('hovered');
                    // 加入已划过组
                    passedList.push(idx);
                    // 已经有点被加入了，有线需要闭合
                    if (passedList.length != 1) {
                        line.attr({
                            x2: point.x,
                            y2: point.y
                        });
                    }
                    line = container.paper.line(point.x, point.y, x, y).attr({
                        stroke: "#fff",
                        strokeWidth: 5  
                    });

                }
            }

        });
    }
    // 画线
    draw();
})();
