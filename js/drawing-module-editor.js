/**
 * Created by abhijit on 8/6/16.
 */
$(document).ready(function(){

    var uploadImage = new Image();
    var attachedImage = new Image();
    var attachmentId = 0;

    function Attachment(name, type, data) {
        this.id = attachmentId++;
        this.name = name;
        this.type = type;
        this.data = data;
    }

    // Attachments related
    var attachmentImage;
    var attachmentVideo;
    var attachmentAudio;
    var attachmentNotes;
    var attachmentFiles;
    var attachments = [];

    var lc = LC.init(document.getElementsByClassName('drawing-module-canvas')[0], {
        backgroundColor: '#fff',
        keyboardShortcuts: true
    });

    // Tools
    var select = new LC.tools.SelectShape(lc);

    lc.setColor('secondary', 'transparent');

    $("body").on("click", ".attachmentFileRemove", removeFile);
    $("body").on("click", ".attachmentFilePreview", previewAttachment);

    // $("#test-shapes").click(function (e) {
    //     console.info(lc.shapes);
    // });
    //
    // $("#test-selected-shape").click(function (e) {
    //     console.info(lc.currentShape);
    // });

    // Disable right click on canvas
    $(".drawing-module-canvas").contextmenu(function (e) {
        e.preventDefault();
    });

    // to save canvas content as JPEG image
    $("#save-image").click(function () {
        window.open(lc.getImage().toDataURL());
    });

    $("#capture").click(function () {
        Webcam.snap(function (data_uri) {
            document.getElementById('front-cam').innerHTML = '<img src="' + data_uri + '"/>';
            uploadImage = data_uri;
        });
    });

    // Attachment->Image button click
    $("#attachImage").click(function () {
        // $("#attachmentInput").click();
        $("#dialog-attach-image").dialog("open");
    });

    // Attachment->Video button click
    $("#attachVideo").click(function () {
        // $("#attachmentInput").click();
        $("#dialog-attach-video").dialog("open");
    });

    // Attachment->Audio button click
    $("#attachAudio").click(function () {
        $("#dialog-attach-audio").dialog("open");
    });

    // Attachment->Note button click
    $("#attachNote").click(function () {
        $("#dialog-attach-note").dialog("open");
    });

    // Attachment->Note button click
    $("#attachFile").click(function () {
        $("#attachmentFiles").click();
    });

    // Attachment Video dialog -> Upload Button
    $("#upload-video").click(function () {
        $("#attachment-preview-video").hide();
        $("#capture-video-preview").show();
        $("#uploaded-video-preview").hide();

        videoPlayer.recorder.reset();

        $("#attachmentVideo").click();
    });

    // Attachment Audio dialog -> Upload Button
    $("#upload-audio").click(function () {
        $("#attachment-preview-audio").hide();
        $("#capture-audio-preview").show();
        $("#uploaded-audio-preview").hide();

        audioPlayer.recorder.reset();

        $("#attachmentAudio").click();
    });

    // Attachment Image dialog -> Upload Button
    $("#upload-image").click(function () {
        $("#attachment-preview-image").hide();
        $("#capture-image-preview").show();
        $("#uploaded-image-preview").hide();

        imagePlayer.recorder.reset();
        $("#attachmentImage").click();
    });

    // Attachment Image dialog -> Upload Button
    $("#upload-note").click(function () {
        $("#attachment-preview-note").hide();
        $("#note-preview").hide();
        $("#attachmentNotes").click();
    });

    // Attachment Video dialog -> Capture Button
    $("#capture-video").click(function () {
        $("#attachment-preview-video").show();
        $("#capture-video-preview").show();
        $("#uploaded-video-preview").hide();
        $("#uploaded-video-preview").get(0).pause();
    });

    // Attachment Audio dialog -> Capture Button
    $("#capture-audio").click(function () {
        $("#attachment-preview-audio").show();
        $("#capture-audio-preview").show();
        $("#uploaded-audio-preview").hide();
        $("#uploaded-audio-preview").get(0).pause();
    });

    // Attachment Image dialog -> Capture Button
    $("#capture-image").click(function () {
        $("#attachment-preview-image").show();
        $("#capture-image-preview").show();
        $("#uploaded-image-preview").hide();
    });

    // Attachment Notes dialog -> New Note Button
    $("#capture-note").click(function () {
        $("#attachment-preview-note").show();
        var preview =  $("#note-preview");
        preview.show();
        preview.attr("enable", "enable");
        preview.val("");
    });

    var videoPlayer
        = videojs("capture-video-preview",
        {
            controls: true,
            width: 400,
            height: 300,
            plugins: {
                record: {
                    audio: true,
                    video: true,
                    maxLength: 10,
                    debug: true
                }
            }
        });

    videoPlayer.on('startRecord', function() {
        console.log('started recording!');
    });

    videoPlayer.on('finishRecord', function() {
        // the blob object contains the image data that
        // can be downloaded by the user, stored on server etc.
        console.log('snapshot ready: ', videoPlayer.recordedData);
        attachmentVideo = new Attachment("video_"+getTimeStamp()+".webm", "video", videoPlayer.recordedData.video );
    });

    var audioPlayer =
        videojs("capture-audio-preview",
        {
            controls: true,
            width: 400,
            height: 300,
            plugins: {
                wavesurfer: {
                    src: "live",
                    waveColor: "black",
                    progressColor: "#2E732D",
                    cursorWidth: 1,
                    msDisplayMax: 20,
                    hideScrollbar: true
                },
                record: {
                    audio: true,
                    video: false,
                    maxLength: 20,
                    debug: true
                }
            }
        });

    audioPlayer.on('startRecord', function() {
        console.log('started recording!');
    });

    audioPlayer.on('finishRecord', function() {
        // the blob object contains the image data that
        // can be downloaded by the user, stored on server etc.
        // console.log('snapshot ready: ', audioPlayer.recordedData);
        attachmentAudio = new Attachment("audio_"+getTimeStamp()+".wav", "audio", audioPlayer.recordedData );
    });

    var imagePlayer =
        videojs("capture-image-preview",
        {
            controls: true,
            width: 400,
            height: 300,
            controlBar: {
                volumeMenuButton: false,
                fullscreenToggle: false
            },
            plugins: {
                record: {
                    image: true,
                    debug: true
                }
            }
        });

    imagePlayer.on('startRecord', function() {
        console.log('started recording!');
    });

    imagePlayer.on('finishRecord', function() {
        // the blob object contains the image data that
        // can be downloaded by the user, stored on server etc.
        // console.log('snapshot ready: ', imagePlayer.recordedData);
        attachmentImage = new Attachment("image_"+getTimeStamp()+".png", "image", imagePlayer.recordedData );
    });

    var currentPreviewFile;

    function removeFile() {
        var file = $(this).data("file");
        console.info(file + " removed.");
        for (var i = 0; i < attachments.length; i++) {
            if (attachments[i].id === file) {
                attachments.splice(i, 1);
                break;
            }
        }
        $(this).parent().remove();

        if(currentPreviewFile == file){
            var preview = $("#attachment-preview");
            preview.empty();
            preview.append(
                '<p> Click item for preview </p>'
            );
        }

        if(attachments.length == 0){
            $("#attachment-preview").hide();
            $("#attachments-not-empty").hide();
            $("#attachments-empty").show();
        }
    }

    function previewAttachment() {
        var id = $(this).data("file");
        currentPreviewFile = id;
        console.info(id + " clicked.");

        var preview = $("#attachment-preview");

        for (var i = 0, attachment; i < attachments.length; i++) {
            attachment = attachments[i];
            if (attachment.id === id) {
                console.info(attachment.type);
                switch (attachment.type){
                    case "image":
                        console.info("Image file");
                        preview.empty();
                        preview.append(
                            '<img class="previewWindow" src='+ attachment.data +'>'
                        );
                        break;
                    case "video":
                        console.info("Video file");
                        preview.empty();
                        if(attachment.data instanceof Blob) {
                            var videoReader = new FileReader();
                            videoReader.onloadend = (function (e) {
                                preview.append(
                                      '<video class="video-js vjs-default-skin previewWindow" controls autoplay>'
                                    +   '<source src=' + e.target.result + '>'
                                    + '</video>');
                            });
                            videoReader.readAsDataURL(attachment.data);
                        } else {
                            preview.append(
                                  '<video class="video-js vjs-default-skin previewWindow" controls autoplay>'
                                +   '<source src=' + attachment.data + '>'
                                + '</video>'
                            );
                        }

                        console.info("Video data-> "+attachment.data);
                        break;
                    case "audio":
                        console.info("Audio file");
                        preview.empty();
                        if(attachment.data instanceof Blob){
                            var audioReader = new FileReader();
                            audioReader.onloadend = (function (e) {
                                preview.append(
                                    '<audio class="video-js vjs-default-skin previewWindow" controls autoplay>' +
                                        '<source src='+ e.target.result +'>' +
                                    '</audio>'
                                );
                            });
                            audioReader.readAsDataURL(attachment.data);
                        } else {
                            preview.append(
                                '<audio class="video-js vjs-default-skin previewWindow" controls autoplay>' +
                                '<source src='+ attachment.data +'>' +
                                '</audio>'
                            );
                        }

                        console.info("Audio data-> "+attachment.data);
                        break;
                    case "note":
                        console.info("Text file");
                        var fileReader = new FileReader();
                        fileReader.onloadend = (function (e) {
                            preview.empty();
                            preview.append(
                                '<textarea class="previewWindow" title="Preview Text" disabled>' +
                                    e.target.result +
                                '</textarea>'
                            );
                        });
                        fileReader.readAsText(attachment.data);
                        break;
                    default:
                        console.info("File attachment");
                        preview.empty();
                        preview.append(
                            '<div class="previewWindow" title="Preview Text" >' +
                                '<p style="text-align: center;">' + attachment.name + '</p>' +
                                '<p style="text-align: center;">No preview available.</p>' +
                            '</div>');
                        break;

                }
            }
        }
    }

    function generateAttachmentsList() {

        console.info("Total attachments->" + attachments.length + " files");
        console.info("Attachments->" + attachments);

        if(attachments.length != 0){
            $("#attachments-empty").hide();
            $("#attachment-preview").show();
            $("#attachments-not-empty").show();

            var listContainer = $("#attachments-list");

            listContainer.empty();

            for (var i = 0; i < attachments.length; i++) {
                var a = attachments[i];

                console.info("Attachment " + a.id + "-> Name: " + a.name + " | Type: " + a.type);

                listContainer.append(
                    "<div id='attachmentBlock' style='margin: 5px'>"
                    + "<img src='./images/remove1.png' class='attachmentFileRemove' data-file='" + a.id + "' height='12px' width='12px' />"
                    + "<a class='attachmentFilePreview' data-file='" + a.id + "'>" + a.name + "</a>"
                    + "</div>"
                );
            }
        } else {
            $("#attachment-preview").hide();
            $("#attachments-not-empty").hide();
            $("#attachments-empty").show();
        }

    }

    $("#attachmentVideo").on("change", function (e) {

        var video = e.target.files[0];
        console.info("Video selected ->" + video.name);

        var reader = new FileReader();

        reader.onload = (function (e) {
            var previewVideo = e.target.result;
            $("#attachment-preview-video").show();
            $("#capture-video-preview").hide();
            $("#uploaded-video-preview").show();
            $("#uploaded-video-preview").attr('src', previewVideo);
            $("#uploaded-video-preview").get(0).play();

            attachmentVideo = new Attachment(video.name, "video", previewVideo );

            console.info("new attachment created->" + attachmentVideo);
        });
        reader.readAsDataURL(video);
    });

    $("#attachmentAudio").on("change", function (e) {

        var audio = e.target.files[0];
        console.info("Audio selected ->" + audio.name);

        var reader = new FileReader();

        reader.onload = (function (e) {
            var previewAudio = e.target.result;
            $("#attachment-preview-audio").show();
            $("#capture-audio-preview").hide();
            $("#uploaded-audio-preview").show();
            $("#uploaded-audio-preview").attr('src', previewAudio);
            $("#uploaded-audio-preview").get(0).play();

            attachmentAudio = new Attachment(audio.name, "audio", previewAudio );
        });
        reader.readAsDataURL(audio);
    });

    $("#attachmentImage").on("change", function (e) {

        var image = e.target.files[0];
        console.info("Image selected ->" + image.name);

        var reader = new FileReader();
        reader.onload = (function (e) {
            var previewImage = e.target.result;
            $("#attachment-preview-image").show();
            $("#capture-image-preview").hide();
            $("#uploaded-image-preview").show();
            $("#uploaded-image-preview").attr('src', previewImage);

            attachmentImage = new Attachment(image.name, "image", previewImage );
        });
        reader.readAsDataURL(image);

        $("#attachment-preview-image").show();

    });

    $("#attachmentNotes").on("change", function (e) {

        var note = e.target.files[0];
        console.info("Note selected ->" + note.name);

        var reader = new FileReader();

        reader.onload = (function (note) {
            var previewNote = note.target.result;
            $("#attachment-preview-note").show();
            $("#note-preview").show();
            // $("#note-preview").attr("disabled", "disabled");
            $("#note-preview").val(previewNote);
        });
        reader.readAsText(note);
    });

    $("#attachmentFiles").on("change", function (e) {

        var file = e.target.files[0];
        console.info("File selected ->" + file.name);

        var reader = new FileReader();

        reader.onload = (function (e) {
            var previewFile = e.target.result;
            var attachmentNewFile = new Attachment(file.name, "file", previewFile );
            attachments.push(attachmentNewFile);
        });
        reader.readAsText(file);
    });

    // Dialog
    // Creates dialog to show attachments
    $("#dialog-attachment").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        open: function () {
            console.info("Notes dialog opened");
            $("#attachment-preview").hide();
            generateAttachmentsList();
        },
        close: function () {
        },
        modal: true,
        autoOpen: false,
        buttons: {
            // "Add more attachments": function() {
            //     $("#attachmentInput").click();
            // },
            "OK": function () {
                $(this).dialog("close");
            }
        }
    });

    function getTimeStamp() {
        var currentDate = new Date();
        return currentDate.getDate() + "-"
            + (currentDate.getMonth()+1)  + "-"
            + currentDate.getFullYear() + "."
            + currentDate.getHours() + ":"
            + currentDate.getMinutes() + ":"
            + currentDate.getSeconds();
    }

    // Dialog
    // Creates dialog to attach video
    $("#dialog-attach-video").dialog({
        resizable: true,
        position: {my: 'top', at: 'top+200'},
        open: function () {
            console.info("Video dialog opened");
            $("#attachment-preview-video").hide();
            attachmentVideo = null;
        },
        close: function () {
            console.info("Video dialog closed");
            $("#uploaded-video-preview").get(0).pause();
            videoPlayer.recorder.reset();
            attachmentVideo = null;
        },
        modal: true,
        autoOpen: false,
        buttons: {
            "Cancel": function () {
                $(this).dialog("close");
                videoPlayer.recorder.reset();
                attachmentVideo = null;
            },
            "Attach": function () {
                console.info( "Attaching -> " + attachmentVideo);
                attachments.push(attachmentVideo);
                $(this).dialog("close");
            }
        },
        height: "auto",
        width: "auto"
    });

    // Dialog
    // Creates dialog to attach audio
    $("#dialog-attach-audio").dialog({
        resizable: false,
        position: {my: 'top', at: 'top+200'},
        open: function () {
            console.info("Audio dialog opened");
            $("#attachment-preview-audio").hide();
            audioPlayer.recorder.reset();
            attachmentAudio = null;
        },
        close: function () {
            console.info("Audio dialog closed");
            $("#uploaded-audio-preview").get(0).pause();
            audioPlayer.recorder.reset();
            attachmentAudio = null;
        },
        modal: true,
        autoOpen: false,
        buttons: {
            "Cancel": function () {
                $(this).dialog("close");
            },
            "Attach": function () {
                console.info( "Attaching -> " + attachmentAudio);
                attachments.push(attachmentAudio);
                $(this).dialog("close");
            }
        },
        height: "auto",
        width: "auto"
    });

    // Dialog
    // Creates dialog to attach image
    $("#dialog-attach-image").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        position: {my: 'top', at: 'top+200'},
        open: function () {
            console.info("Image dialog opened");
            $("#attachment-preview-image").hide();
            imagePlayer.recorder.reset();
            attachmentImage = null;
        },
        close: function () {
            console.info("Image dialog closed");
            imagePlayer.recorder.reset();
            attachmentImage = null;
        },
        modal: true,
        autoOpen: false,
        buttons: {
            "Cancel": function () {
                $(this).dialog("close");
                imagePlayer.recorder.reset();
                attachmentImage = null;
            },
            "Attach": function () {
                console.info( "Attaching -> " + attachmentImage);
                imagePlayer.recorder.reset();
                attachments.push(attachmentImage);
                $(this).dialog("close");
            }
        }
    });

    // Dialog
    // Creates dialog to attach notes
    $("#dialog-attach-note").dialog({
        resizable: false,
        height: "auto",
        width: "auto",
        position: {my: 'top', at: 'top+200'},
        open: function () {
            console.info("Notes dialog opened");
            $("#attachment-preview-note").hide();
            $("#note-preview").val("");
            attachmentNotes = null;
        },
        close: function () {
            console.info("Notes dialog closed");
            attachmentNotes = null;
        },
        modal: true,
        autoOpen: false,
        buttons: {
            "Cancel": function () {
                $(this).dialog("close");
            },
            "Attach": function () {
                var textToWrite = $("#note-preview").val();
                var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
                attachmentNotes = new Attachment(getTimeStamp()+".txt", "note", textFileAsBlob );
                console.info( "Attaching -> " + attachmentNotes);
                attachments.push(attachmentNotes);
                $(this).dialog("close");
            }
        }
    });

    // Dialog
    // WebCam
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
            "OK": function () {
                $(this).dialog("close");
                Webcam.reset();
                var newImage = new Image();
                newImage.src = uploadImage;
                lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
            },
            "Cancel": function () {
                $(this).dialog("close");
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
                $("#preview-image").attr('src', uploadImage);
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
            "Use selected image": function () {
                $(this).dialog("close");
                var newImage = new Image();
                newImage.src = uploadImage;
                lc.saveShape(LC.createShape('Image', {x: 10, y: 10, image: newImage}));
                lc.setTool(select);
            },
            "Cancel": function () {
                $(this).dialog("close");
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
            ["#000", "#444", "#666", "#999", "#ccc", "#eee", "#f3f3f3", "#fff"],
            ["#f00", "#f90", "#ff0", "#0f0", "#0ff", "#00f", "#90f", "#f0f"],
            ["#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#cfe2f3", "#d9d2e9", "#ead1dc"],
            ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
            ["#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6fa8dc", "#8e7cc3", "#c27ba0"],
            ["#c00", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3d85c6", "#674ea7", "#a64d79"],
            ["#900", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#0b5394", "#351c75", "#741b47"],
            ["#600", "#783f04", "#7f6000", "#274e13", "#0c343d", "#073763", "#20124d", "#4c1130"]
        ],
        change: function (color) {
            lc.setColor('primary', color);
        }
    });

    $("#black").click(function () {
        $("#colorpicker").spectrum("show");
    });

    $("#template-select").change(function () {
        var imagePath = "./images/templates/" + $(this).val() + ".jpg";
        console.info(imagePath);
        $("#preview-image").attr('src', imagePath);

        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", imagePath);
        xhr.responseType = "blob";
        xhr.onload = function () {
            blob = xhr.response;
            uploadImage = URL.createObjectURL(this.response);
        };
        xhr.send();
    });

    $("#print").click(function () {
        var imgData = lc.getImage().toDataURL("image/jpeg");
        var pdf = new jsPDF('landscape');
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("download.pdf");
    });

    // create dialog on click of camera button
    $("#camera").click(function () {
        $("#dialog-webcam").dialog("open");
        Webcam.attach("#front-cam");
    });

    $("#upload").click(function () {
        $("#dialog-upload").dialog("open");
    });

    // Button
    // Show list of attachments on click
    $("#showAttachments").click(function () {
        $("#dialog-attachment").dialog("open");
    });

    $("#clear").click(function () {
        lc.clear();
    });

    $("#redo").click(function () {
        lc.redo();
    });
    $("#undo").click(function () {
        lc.undo();
    });

    $("#shape").on('input', function () {

        var toolName = $("#shape").val();
        // alert(toolName);
        if (toolName == 'line') {
            var line = new LC.tools.Line(lc);
            lc.setTool(line);
        } else if (toolName == 'arrow') {
            var arrow = new LC.tools.Line(lc);
            arrow.hasEndArrow = true;
            lc.setTool(arrow);
        } else if (toolName == 'rectangle') {
            var rectangle = new LC.tools.Rectangle(lc);
            lc.setTool(rectangle);
        } else if (toolName == 'circle') {
            var circle = new LC.tools.Ellipse(lc);
            lc.setTool(circle);
        } else if (toolName == 'polygon') {
            var polygon = new LC.tools.Polygon(lc);
            lc.setTool(polygon);
        } else {
            var pen = new LC.tools.Pencil(lc);
            lc.setTool(pen);
        }
    });

    $("#pencil").on('click', function () {
        var pencil = new LC.tools.Pencil(lc);
        lc.setTool(pencil);
    });

    $("#eraser").on('click', function () {
        var eraser = new LC.tools.Eraser(lc);
        lc.setTool(eraser);
    });

    $("#select").on('click', function () {
        lc.setTool(select);
    });

    $("#text").on('click', function () {
        var text = new LC.tools.Text(lc);
        lc.setTool(text);
    });

    // var tools = [
    //     {
    //         name: 'pencil',
    //         el: document.getElementById('pencil'),
    //         tool: new LC.tools.Pencil(lc)
    //     },
    //     {
    //         name: 'eraser',
    //         el: document.getElementById('eraser'),
    //         tool: new LC.tools.Eraser(lc)
    //     },
    //     {
    //         name: 'text',
    //         el: document.getElementById('text'),
    //         tool: new LC.tools.Text(lc)
    //     },
    //     {
    //         name: 'clear',
    //         el: document.getElementById('clear'),
    //         tool: function () {
    //             lc.clear();
    //         }()
    //     }, {
    //         name: 'select',
    //         el: document.getElementById('select'),
    //         tool: new LC.tools.SelectShape(lc)
    //     }
    // ];
    //
    // var activateTool = function (t) {
    //     lc.setTool(t.tool);
    //     tools.forEach(function (t2) {
    //         if (t == t2) {
    //             t2.el.style.backgroundColor = 'yellow';
    //         } else {
    //             t2.el.style.backgroundColor = '';
    //         }
    //     });
    // };
    //
    // tools.forEach(function (t) {
    //     t.el.style.cursor = "pointer";
    //     t.el.onclick = function (e) {
    //         e.preventDefault();
    //         activateTool(t);
    //     };
    // });

    // activateTool(tools[0]);

    var colors = [
        {
            name: 'blue',
            el: document.getElementById('blue'),
            color: 'blue'
        }, {
            name: 'red',
            el: document.getElementById('red'),
            color: 'red'
        }, {
            name: 'green',
            el: document.getElementById('green'),
            color: 'green'
        }, {
            name: 'yellow',
            el: document.getElementById('yellow'),
            color: 'yellow'
        }
    ];

    var activateColors = function (c) {
        lc.setColor('primary', c.color);
        colors.forEach(function (t2) {
            if (c == t2) {
                t2.el.style.backgroundColor = c.color;
            } else {
                t2.el.style.backgroundColor = '';
            }
        });
    };

    colors.forEach(function (t) {
        t.el.style.cursor = "pointer";
        t.el.onclick = function (e) {
            e.preventDefault();
            activateColors(t);
        };
    });

    // activateColors(colors[0]);

    $("#size").change(function (e) {
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