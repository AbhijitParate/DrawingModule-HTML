/**
 * Created by abhijit on 8/6/16.
 */
$(document).ready(function(){

    var lc = LC.init(document.getElementsByClassName('drawing-module-canvas')[0], {backgroundColor : '#fff'});

    // This is to disable right click on canvas
    $(".drawing-module-canvas").contextmenu(function (e) {
        e.preventDefault();
    });

    // to save canvas content as JPEG image
    $("#save-image").click(function () {
        window.open(lc.getImage().toDataURL());
    });




    // $("#template").click(function () {
    //     Webcam.reset();
    // });


    var uploadImage = new Image() ;

    $("#capture").click(function () {
        Webcam.snap( function(data_uri) {
            document.getElementById('front-cam').innerHTML = '<img src="'+data_uri+'"/>';
            uploadImage = data_uri;
        } );
    });



    // $("#tabs").tabs({
    //     select: function() {
    //         alert("PRESSED TAB!");
    //     }
    // });

    // creates dialog on click of webcam button
    $("#dialog-webcam").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        close: function () {
            Webcam.reset();
        },
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                $( this ).dialog( "close" );
                Webcam.reset();
                var newImage = new Image();
                newImage.src = uploadImage;
                lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
                Webcam.reset();
            }
        }
    });

    // on click of file input button un upload dialog
    $("#fileupload").change(function () {

        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('#blah').attr('src', e.target.result);
                // uploadImage = new Image();
                uploadImage = e.target.result;
                $("#preview-image").attr('src',uploadImage);
                // lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
            };

            reader.readAsDataURL(this.files[0]);
        }

    });



    // creates dialog on click of upload button
    $("#dialog-upload").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                $( this ).dialog( "close" );
                var newImage = new Image();
                newImage.src = uploadImage;
                lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });

    // Color pallet
    $("#colorpicker").spectrum({
        showPaletteOnly: true,
        togglePaletteOnly: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        color: 'black',
        palette: [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ],
        change: function(color) {
            lc.setColor('primary', color);
        }
    });

    $("#black").click(function () {
        $("#colorpicker").spectrum("show");
    });


    $("#template-select").change(function () {
        $("#preview-image").attr('src',"images/templates/"+$(this).val()+".jpg");
    });

    $("#print").click(function () {
        var imgData = lc.getImage().toDataURL("image/jpeg");
        var pdf = new jsPDF('landscape');
        pdf.addImage( imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
    });

    // create dialog on click of camera button
    $("#camera").click(function () {
        $("#dialog-webcam").dialog( "open" );
        Webcam.attach("#front-cam");
    });

    $("#upload").click(function () {
        $("#dialog-upload").dialog( "open" );
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

    // activateColors(colors[0]);

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