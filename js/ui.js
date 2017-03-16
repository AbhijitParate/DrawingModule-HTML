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
        title: 'Line-width',
        url: '#slider-container',
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