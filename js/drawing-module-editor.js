/**
 * Created by abhijit on 8/6/16.
 */
$(document).ready(function(){
    var lc = LC.init(document.getElementsByClassName('drawing-module-canvas')[0]);

    $(".drawing-module-canvas").contextmenu(function (e) {
        e.preventDefault();
    });



    $("#clear").click(function() {
        lc.clear();
    });

    $("#redo").click(function() {
        lc.redo();
    });
    $("#undo").click(function() {
        lc.undo();
    });

    $("#zoom-in").click(function () {
        lc.zoom(0.1);
    });
    $("#zoom-out").click(function () {
        lc.zoom(-0.1);
    });

    $("#shape").on('input', function () {

        var toolName = $("#shape").val();
        // alert(toolName);
        if(toolName == 'line'){
            var line = new LC.tools.Line(lc);
            lc.setTool(line);
        } else if(toolName == 'arrow'){
            var arrow = new LC.tools.Line(lc);
            arrow.hasEndArrow = true;
            lc.setTool(arrow);
        } else if(toolName == 'rectangle'){
            var rectangle = new LC.tools.Rectangle(lc);
            lc.setTool(rectangle);
        } else if(toolName == 'circle'){
            var circle = new LC.tools.Ellipse(lc);
            lc.setTool(circle);
        } else if(toolName == 'polygon'){
            var polygon = new LC.tools.Polygon(lc);
            lc.setTool(polygon);
        } else {
            var pen = new LC.tools.Pencil(lc);
            lc.setTool(pen);
        }
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
            name: 'text',
            el: document.getElementById('text'),
            tool: new LC.tools.Text(lc)
        },
        {
            name: 'clear',
            el: document.getElementById('clear'),
            tool: function() {
                lc.clear();
            }()
        },{
            name: 'select',
            el: document.getElementById('select'),
            tool: new LC.tools.SelectShape(lc)
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

    $("#size").change(function() {
        // alert($("#size").val());
        lc.trigger('setStrokeWidth',$("#size").val());
    });


});