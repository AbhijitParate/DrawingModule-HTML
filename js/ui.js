$(document).ready(function() {

    // Accordion for editor actions
    $("#controls" ).accordion({
        heightStyle: "content",
        icons: false
    });

    // Pencil
    let pencil = $("#pencil");
    pencil.webuiPopover({
        placement: 'bottom-right',
        title: 'Pencil thickness',
        type: 'html',
        url: "#pencil-slider-container",
        width: 150,
        trigger: 'hover',
        dismissible:true,
    });

    let eraser = $("#erase");
    eraser.webuiPopover({
        placement: 'bottom-right',
        title: 'Pencil thickness',
        type: 'html',
        url: "#eraser-slider-container",
        width: 150,
        trigger: 'hover',
        dismissible:true,
    });

    // Shapes
    let shapeButton = $("#shape");
    shapeButton.webuiPopover({
        placement: 'right',
        title: 'Shapes',
        url: '#shapes-container',
        width: 130,
        trigger: 'hover',
        dismissible:true,
    });

    // Slider for pencil
    $( "#slider-1" ).slider(10);

});