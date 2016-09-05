/**
 * Created by abhijit on 8/6/16.
 */
$(document).ready(function(){

    var lc = LC.init(document.getElementsByClassName('drawing-module-canvas')[0], {backgroundColor : '#fff'});

    $(".drawing-module-canvas").contextmenu(function (e) {
        e.preventDefault();
    });

    $("#save-image").click(function () {
        window.open(lc.getImage().toDataURL());
    });

    $("#camera").click(function () {
        $("#dialog-insert").dialog( "open" );
        Webcam.attach("#front-cam");
    });

    $("#template").click(function () {
        Webcam.reset();
    });

    var webcamImage ;

    $("#capture").click(function () {
        Webcam.snap( function(data_uri) {
            document.getElementById('front-cam').innerHTML = '<img src="'+data_uri+'"/>';
            webcamImage = data_uri;
        } );
    });

    $("#tabs").tabs({
        select: function() {
            alert("PRESSED TAB!");
        }
    });

    $("#dialog-insert").dialog({
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                $( this ).dialog( "close" );
                Webcam.reset();
                var newImage = new Image();
                newImage.src = webcamImage;
                lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
                Webcam.reset();
            }
        }
    });

    $("#print").click(function () {
        var imgData = lc.getImage().toDataURL("image/jpeg");
        var pdf = new jsPDF('landscape');
        pdf.addImage( imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
    });

    $("#upload").click(function () {
        $("#imagefile").click();
    });


    $("#imagefile").change(function () {

        if (this.files && this.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // $('#blah').attr('src', e.target.result);
                var newImage = new Image();
                newImage.src = e.target.result;
                lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
            };

            reader.readAsDataURL(this.files[0]);
        }

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

    $("#size").change(function(e) {
        lc.trigger('setStrokeWidth', parseInt($(e.currentTarget).val(), 10));
        // parseInt($(e.currentTarget).val(), 10);
    });

    var oldZoom = 0;

    $("#zoom").change(function (e) {

        lc.zoom(-1 * oldZoom);

        lc.zoom(($(e.currentTarget).val() - 1));

        oldZoom = $(e.currentTarget).val();
    });
    


});