/**
 * Created by abhij on 3/12/2017.
 */

$(document).ready(function($) {

    //Attach -> image
    $("#attachImage").click(function () {
        // $("#attachmentInput").click();
        createDialog();

    });

    function createDialog() {
        let dialog = $("<div/>");
        dialog.attr("title", "Attach Image");
        let input = $("<input/>");
        input.attr("type", "file");
        input.attr("hidden","");
        input.attr("name","images[]");
        input.attr("accept","image/*");
        input.on("change", function (e) {
            let temp = e.target.files[0];
            // console.info("Image selected ->");
            // console.info(temp);
            createUploadImageDialog(temp);
            dialog.dialog("destroy");
        });
        input.appendTo(dialog);
        $("<button />").text("Upload from device").button().on("click", function () {
            input.click();
        }).appendTo(dialog);
        $("<p />").appendTo(dialog);
        $("<button />").text("Capture using web-cam").button().on("click", function () {
            createWebcamDialog();
            dialog.dialog("destroy");
        }).appendTo(dialog);
        dialog.dialog({
            modal:true,
            resizable: true,
            position: {
                of: "#canvasWrapper",
                at: "center center",
                my: "center center"
            },
            height: "auto",
            width: "auto",
            open: function () {
                console.info("Image dialog opened");
            },
            close: function () {
                console.info("Image dialog closed");
            },
            autoOpen: false,
            buttons: {
                "Cancel": function () {
                    $(this).dialog("destroy");
                }
            }
        });

        dialog.dialog("open");
    }

    function createUploadImageDialog(image) {
        // console.info("createUploadImageDialog ->");
        // console.info(image);
        let dialog = $("<div/>");
        dialog.attr("title", "Upload image from system");
        let input = $("<input/>");
        input.attr("type", "file");
        input.attr("hidden","");
        input.attr("name","images[]");
        input.attr("accept","image/*");
        input.on("change", function (e) {
            let image = e.target.files[0];
            console.info("Image selected ->");
            console.info(image);
            createUploadImageDialog(image);
            dialog.dialog("destroy");
        });
        input.appendTo(dialog);
        let imageTag = $("<img />");
        imageTag.css("max-width","600px");
        imageTag.css("max-height","600px");
        let previewImage;
        let reader = new FileReader();
        reader.onload = (function (e) {
            previewImage = e.target.result;
            imageTag.attr("src",previewImage);
        });
        reader.readAsDataURL(image);

        imageTag.appendTo(dialog);
        dialog.dialog({
            modal:true,
            resizable: true,
            position: {
                of: "#canvasWrapper",
                at: "center center",
                my: "center center"
            },
            height: "auto",
            width: "auto",
            open: function () {
                console.info("Upload image dialog opened");
            },
            close: function () {
                console.info("Upload image dialog closed");
            },
            autoOpen: false,
            buttons: {
                "Web-cam": function () {
                    createWebcamDialog();
                    $(this).dialog("destroy");
                },
                "Reselect": function () {
                    input.click();
                },
                "Attach": function () {
                    console.info("Attach file code here");
                    let attachmentImage = new Attachment(image.name, "image", previewImage );
                    attachments.push(attachmentImage);
                    $(this).dialog("destroy");
                },
                "Cancel": function () {
                    $(this).dialog("destroy");
                },
            }
        });
        dialog.dialog("open");
    }

    function createWebcamDialog() {
        let dialog = $("<div/>");
        dialog.attr("title", "Capture image from camera");
        let input = $("<input/>");
        input.attr("type", "file");
        input.attr("hidden","");
        input.attr("name","images[]");
        input.attr("accept","image/*");
        input.on("change", function (e) {
            let image = e.target.files[0];
            console.info("Image selected ->");
            console.info(image);
            createUploadImageDialog(image);
            dialog.dialog("destroy");
        });
        input.appendTo(dialog);

        let selectDiv = $("<div/>").css("height", "25px").appendTo(dialog);
        let select = $("<select/>").css("float","right").appendTo(selectDiv);
        // $("<option/>").attr("value", "1").text("320×240").appendTo(select);
        $("<option/>").attr("value", "2").text("640×480").appendTo(select);
        // $("<option/>").attr("value", "3").text("320×240").appendTo(select);
        $("<option/>").attr("value", "4").text("1280×720").appendTo(select);
        let label = $("<label/>").css("float","right");
        label.text("Image size : ");
        label.appendTo(selectDiv);
        let imageDiv = $("<div/>").appendTo(dialog);
        let video = $("<video/>").addClass("video-js vjs-default-skin");
        video.attr("id","myVideo");
        video.appendTo(imageDiv);
        let attachmentImage;
        let player;
        var attachBtn, retryBtn, uploadBtn;
        dialog.dialog({
            modal:true,
            resizable: true,
            position: {
                of: "#canvasWrapper",
                at: "center center",
                my: "center center"
            },
            height: "auto",
            width: "auto",
            open: function () {
                console.info("Webcam dialog opened");
                player = videojs("myVideo", {
                    controls: true,
                    width: 640,
                    height: 480,
                    controlBar: {
                        volumeMenuButton: false,
                        fullscreenToggle: false
                    },
                    plugins: {
                        record: {
                            image: true
                        }
                    }
                });
                attachBtn = $(".ui-dialog-buttonpane button:contains('Attach')");
                retryBtn = $(".ui-dialog-buttonpane button:contains('Retry')");
                uploadBtn = $(".ui-dialog-buttonpane button:contains('Upload')");

                // error handling
                player.on('deviceError', function() {
                    console.warn('device error:', player.deviceErrorCode);
                });
                player.on('error', function(error) {
                    console.log('error:', error);
                });
                // snapshot is available
                player.on('finishRecord', function() {
                    // the blob object contains the image data that
                    // can be downloaded by the user, stored on server etc.
                    // console.log('snapshot ready: ', player.recordedData);
                    // attachBtn.text('Capture');
                    let data = player.recordedData;
                    attachmentImage = new Attachment("image_"+getTimeStamp()+".png", "image", data);
                    attachBtn.button("enable");
                    retryBtn.button("enable")
                });

                attachBtn.button("disable");
                retryBtn.button("disable");
            },
            close: function () {
                destroyCam();
            },
            autoOpen: false,
            buttons: {
                upload :{
                    text : "Upload from system",
                    click : function () {
                        console.info("Upload clicked");
                        input.click();
                        $(this).dialog("destroy");
                        destroyCam();
                    }
                },
                "Retry": function () {
                    console.info("Retry clicked");
                    $(".vjs-icon-photo-retry").click();
                    retryBtn.button("disable");
                    attachBtn.button("disable");
                },
                "Attach": function () {
                    console.info("Attach clicked");
                    saveAttachment();
                    destroyCam();
                    $(this).dialog("destroy");
                },
                "Cancel": function () {
                    console.info("Camera dialog closed");
                    destroyCam();
                    $(this).dialog("destroy");
                },
            }
        });

        function destroyCam() {
            player.recorder.reset();
            imageDiv.remove();
        }

        function saveAttachment() {
            console.info("Save attachment code here");
            attachments.push(attachmentImage);
        }

        dialog.dialog("open");

        select.on("change", function () {
            let newVideo;
            let size = $(this).val();
            switch (size){
                case "1":
                    console.info("1");
                    player.recorder.destroy();
                    newVideo = $("<video/>").addClass("video-js vjs-default-skin");
                    newVideo.appendTo(imageDiv);
                    newVideo.attr("id", "myVideo");
                    player = videojs("myVideo", {
                        controls: true,
                        loop: false,
                        // dimensions of video.js player
                        width: 320,
                        height: 240,
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
                    break;
                case "2":
                    console.info("2");
                    player.recorder.destroy();
                    newVideo = $("<video/>").addClass("video-js vjs-default-skin");
                    newVideo.appendTo(imageDiv);
                    newVideo.attr("id", "myVideo");
                    player = videojs("myVideo", {
                        controls: true,
                        loop: false,
                        // dimensions of video.js player
                        width: 640,
                        height: 480,
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
                    break;
                case "3":
                    console.info("3");
                    player.recorder.destroy();
                    newVideo = $("<video/>").addClass("video-js vjs-default-skin");
                    newVideo.appendTo(imageDiv);
                    newVideo.attr("id", "myVideo");
                    player = videojs("myVideo", {
                        controls: true,
                        loop: false,
                        // dimensions of video.js player
                        width: 1024,
                        height: 768,
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
                    break;
                case "4":
                    console.info("4");
                    player.recorder.destroy();
                    newVideo = $("<video/>").addClass("video-js vjs-default-skin");
                    newVideo.appendTo(imageDiv);
                    newVideo.attr("id", "myVideo");
                    player = videojs("myVideo", {
                        controls: true,
                        loop: false,
                        // dimensions of video.js player
                        width: 1280,
                        height: 720,
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
                    player.reset();
                    break;
            }
            $(".vjs-device-button.vjs-control.vjs-icon-device-perm").click();
        });
        $(".vjs-device-button.vjs-control.vjs-icon-device-perm").click();
    }

});