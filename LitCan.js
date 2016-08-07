//noinspection JSUnresolvedFunction
/**
 * Created by abhijit on 8/6/16.
 */
// $(document).ready(function(){
    var lc = LC.init(document.getElementsByClassName('literally core')[0]);

    $("#clear").click(function() {
        lc.clear();
    });

    // var strokeSize = document.getElementById('size');
    // strokeSize.addEventListener("input", function(){
    //     lc.trigger('setStrokeWidth', strokeSize.value);
    // }, false);

    $("#size").on("change", function() {
        // alert(this.value);
        lc.trigger('setStrokeWidth', this.value);
        // lc.trigger('setStrokeWidth', $(this).val());
    });

    $("#redo").click(function() {
        lc.redo();
    });
    $("#undo").click(function() {
        lc.undo();
    });

    var tools = [
        {
            name: 'pencil',
            el: document.getElementById('pencil'),
            tool: new LC.tools.Pencil(lc)
        },
        {
            name: 'eraser',
            el: document.getElementById('eraser'),
            tool: new LC.tools.Eraser(lc)
        },
        {
            name: 'rectangle',
            el: document.getElementById('shape'),
            tool: new LC.tools.Rectangle(lc)
        },
        {
            name: 'line',
            el: document.getElementById('line'),
            tool: new LC.tools.Line(lc)
        },
        {
            name: 'text',
            el: document.getElementById('text'),
            tool: new LC.tools.Text(lc)
        },
        {
            name: 'arrow',
            el: document.getElementById('arrow'),
            tool: function() {
                arrow = new LC.tools.Line(lc);
                arrow.hasEndArrow = true;
                return arrow;
            }()
        },
        {
            name: 'clear',
            el: document.getElementById('clear'),
            tool: function() {
                lc.clear();
            }()
        }
    ];

    var activateTool = function(t) {
        lc.setTool(t.tool);

        tools.forEach(function(t2) {
            if (t == t2) {
                t2.el.style.backgroundColor = 'yellow';
            } else {
                t2.el.style.backgroundColor = '';
            }
        });
    };

    tools.forEach(function(t) {
        t.el.style.cursor = "pointer";
        t.el.onclick = function(e) {
            e.preventDefault();
            activateTool(t);
        };
    });
    activateTool(tools[0]);


    var colors = [
        {
            name: 'black',
                el: document.getElementById('black'),
            color: 'black'
        },{
            name: 'blue',
                el: document.getElementById('blue'),
                color: 'blue'
        },{
            name: 'red',
                el: document.getElementById('red'),
                color: 'red'
        },{
            name: 'green',
                el: document.getElementById('green'),
                color: 'green'
        },{
            name: 'yellow',
                el: document.getElementById('yellow'),
                color: 'yellow'
        }
    ];

    var activateColors = function(c) {
        lc.setColor('primary', c.color);
        colors.forEach(function(t2) {
            if (c == t2) {
                t2.el.style.backgroundColor = c.color;
            } else {
                t2.el.style.backgroundColor = '';
            }
        });
    };

    colors.forEach(function(t) {
        t.el.style.cursor = "pointer";
        t.el.onclick = function(e) {
            e.preventDefault();
            activateColors(t);
        };
    });
    activateColors(colors[0]);

/*
    var slider = [
        {
            name: 'size',
            el: document.getElementById('size'),
            slide: $("#size").val()
        }
    ];

    var activateSlider = function(s) {
        lc.trigger('setStrokeWidth', s.slide);
    };

    slider.forEach(function(s) {
        s.el.style.cursor = "pointer";
        s.el.onclick = function(e) {
            e.preventDefault();
            activateSlider(s);
        };
    });
    activateSlider(slider[0]);
    */
// });