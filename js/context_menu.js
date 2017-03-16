$(document).ready(function() {

    let clickPoint;

    canvas.on("object:selected", function (e) {
        console.log('object:selected');
        var object = e.target;
        if(object.tag === "media") {
            object.show();
        }
    });

    canvas.on("mouse:up", function (event) {
        console.log(event);
        console.log('canvas:mouse:up - X: ' + event.e.offsetX + ' Y: ' + event.e.offsetY);
    });

    canvas.on("mouse:down", function (event) {
        console.log(event);
        console.log('canvas:mouse:down - X: ' + event.e.offsetX + ' Y: ' + event.e.offsetY);
    });

    $(document).contextmenu({
        delegate: ".upper-canvas",
        autoFocus: true,
        preventContextMenuForPopup: true,
        preventSelect: true,
        taphold: true,
        menu: [
            {
                title: "Add image",
                cmd: "add-image"
            },
            {
                title: "Add audio clip",
                cmd: "add-audio"
            },
            {
                title: "Add video clip",
                cmd: "add-video"
            }
        ],
        // Implement the beforeOpen callback to dynamically change the entries
        beforeOpen: function (event, ui) {

            clickPoint = new fabric.Point(event.offsetX, event.offsetY);

            // Optionally return false, to prevent opening the menu now
        },
        // Handle menu selection to implement a fake-clipboard
        select: function (event, ui) {
            // var clickPoint = new fabric.Point(event.offsetX, event.offsetY);
            let input;
            switch (ui.cmd) {
                case "add-image":
                    console.log("add-image : " + clickPoint);
                    input = $("<input />").attr("type", "file").attr("accept","image/*");
                    input.on("change", function (e) {
                        let image = e.target.files[0];
                        let reader = new FileReader();
                        reader.onload = (function (e) {
                            let imageData = e.target.result;
                            let options = {top: clickPoint.y, left: clickPoint.x};
                            let media = new Media(imageData, options);
                            console.log("here");
                            canvas.add(media);
                            console.log("here");
                            media.on('image:loaded', canvas.renderAll.bind(canvas));
                        });
                        reader.readAsDataURL(image);
                    });
                    input.click();
                    break;
                case "add-audio":
                    console.log("add-audio : " + clickPoint);
                    input = $("<input />").attr("type", "file").attr("accept","audio/*");
                    input.on("change", function (e) {
                        let image = e.target.files[0];
                        let reader = new FileReader();
                        reader.onload = (function (e) {
                            let imageData = e.target.result;
                            let options = {top: clickPoint.y, left: clickPoint.x};
                            let media = new Media(imageData, options);
                            console.log("here");
                            canvas.add(media);
                            console.log("here");
                            media.on('image:loaded', canvas.renderAll.bind(canvas));
                        });
                        reader.readAsDataURL(image);
                    });
                    input.click();
                    break;
                case "add-video":
                    console.log("add-video : " + clickPoint);
                    input = $("<input />").attr("type", "file").attr("accept","video/*");
                    input.on("change", function (e) {
                        let image = e.target.files[0];
                        let reader = new FileReader();
                        reader.onload = (function (e) {
                            let imageData = e.target.result;
                            let options = {top: clickPoint.y, left: clickPoint.x};
                            let media = new Media(imageData, options);
                            console.log("here");
                            canvas.add(media);
                            console.log("here");
                            media.on('image:loaded', canvas.renderAll.bind(canvas));
                        });
                        reader.readAsDataURL(image);
                    });
                    input.click();
                    break;
            }

            // Optionally return false, to prevent closing the menu now
        },
    });

});

var Media = fabric.util.createClass(
    fabric.Object,
    {
        type: 'image',
        tag: 'media',
        H_PADDING: 20,
        V_PADDING: 20,
        originX: 'center',
        originY: 'center',
        /**
         *
         * @param data
         * @param mimeType
         * @param options
         */
        initialize: function (data, options) {
            this.callSuper('initialize', options);
            this.image = new Image();
            this.image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTM5jWRgMAAAAVdEVYdENyZWF0aW9uIFRpbWUAMjcvMy8wOeispIwAAAQRdEVYdFhNTDpjb20uYWRvYmUueG1wADw/eHBhY2tldCBiZWdpbj0iICAgIiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDQuMS1jMDM0IDQ2LjI3Mjk3NiwgU2F0IEphbiAyNyAyMDA3IDIyOjExOjQxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4YXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8eGFwOkNyZWF0b3JUb29sPkFkb2JlIEZpcmV3b3JrcyBDUzM8L3hhcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhhcDpDcmVhdGVEYXRlPjIwMDktMDMtMjdUMTU6Mjg6MzFaPC94YXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhhcDpNb2RpZnlEYXRlPjIwMDktMDktMDhUMjM6MTM6MDFaPC94YXA6TW9kaWZ5RGF0ZT4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvcG5nPC9kYzpmb3JtYXQ+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIKUQFf8AAAl5SURBVGjetVp5bFZVFn+1tioFXHHfcAFkxyKFtgiuCLjvcY0aozEx0f/KDIkFxrFGozOOs8QJihGDJlBW27KUiizClFJoqUAHP5aWdmitLYUipciZ3++15+N8t+99ZX3J751zz37eu+/e977WS/U8jyjKzJy0aOTIyOzhw0WRe9tt7XTECLHyOZBTR7nVKW91PjriqI31i0eD4i8cMSKyPCNjktbtn/LS0vLzRo6UbY88Igdee01+f/ttOdqBtjffjPJBY1dGXuHqXdnvb73Vyd6OrYw1Nb/6ql9jwahRRL7fQGF6etYCXKGml1+Wwyj+yPPPS+vjj0vrY4/J4Q565MknO1FXZuWuLMwujNexzX/kqafkyAsvSNvrr8uvL70kc1JTZdmoUVne3NTUSOXDD0srujv8xBPyGzqkI0G+qzHpoUcfjfKWWnuXt9TVa/FuHB/I1fbGG1LxwAMyf/jwiPftsGHSguIPosuWhx7yiyHIK05mrLIwWyt37ePVQNr67LPS9OKL8s3QoeJ9i1Mrbsv+Bx+Ug7gTxH50d8CMrZw4kbEbw9oxh/IWrq+V+UAjrHnWkCHifYPTQcyp5okTpQUBFXZMXsdBdlZnEWQTD9bmAAoNiqV2rHnWkMHifT1woPz2yivSNH687L//fp8q7Ji8wtVbuSsLs9k3YUJcva0jqJ4DmEKs3Zs5YIC0oJt96OrX++7zqfIKlVn5vokTYnxU3oTCSBuRxMaIh7Dcbh0W+7Fasnb/DrAbJvzl3nt92jCunQaBNtQXXXqp1IwdEyNXf9c+nr5h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";
            this.set("data",data);
            let mimeType = data.substring(data.indexOf(':')+1, data.indexOf(';'));
            this.set("mime",mimeType);
            this.image.onload = (function() {
                this.width = this.image.width;
                this.height = this.image.height;
                this.loaded = true;
                this.setCoords();
                this.fire('image:loaded');
            }).bind(this);
        },

        _render: function (ctx) {
            if (this.loaded) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(
                    -(this.width / 2) - this.H_PADDING,
                    -(this.height / 2) - this.H_PADDING,
                    this.width + this.H_PADDING * 2,
                    this.height + this.V_PADDING * 2);
                ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
            }
        },

        show: function () {
            getPreviewDialog(this.data, this.mime)
        },

        toObject: function(propertiesToInclude) {

            return fabric.util.object.extend(
                this.callSuper(
                    'toObject',
                    ['crossOrigin', 'alignX', 'alignY', 'meetOrSlice'].concat(propertiesToInclude)
                ), {
                    src: this.image.src,
                    data: this.data
                });
        },

        toSVG: function(reviver) {
            let markup = this._createBaseSVGMarkup();
            let preserveAspectRatio = 'none';
            // let x = left, y = top;

            markup.push(
                '<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n',
                '<image ', this.getSvgId(), 'xlink:href="', this.image.src,
                '" x="', this.x, '" y="', this.y,
                // '" meetOrSlice="', "media",
                // '" style="', this.getSvgStyles(),
                // we're essentially moving origin of transformation from top/left corner to the center of the shape
                // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
                // so that object's center aligns with container's left/top
                '" width="', this.width,
                '" toBeParsed="', true,
                '" height="', this.height,
                '" preserveAspectRatio="', this.data,
                // '" data="', this.data ,
                '" ></image>\n'
            );

            markup.push('</g>\n');

            return reviver ? reviver(markup.join('')) : markup.join('');
        },

        toString: function() {
            return '#<fabric.Image: { src: "' + this.image.src + '", data:"' + this.data +'"}>';
        },
    }
);

function getPreviewDialog(data, mimeType) {
    let type = mimeType.substring(0, mimeType.indexOf('/'));

    let div = $("<div />");

    switch (type){
        case "image":
            div.attr("title", "Image").appendTo(div);
            let source = $("<img width='500' height='450' />");
            source.attr("src", data).css({width: "100%", height: "100%" }).appendTo(div);
            div.dialog({
                width: 500,
                height: 520,
                close : function () {
                    $(this).dialog('destroy');
                }
            });
            break;

        case "audio":
            div.attr("title", "Audio clip").appendTo(div);
            let audio = $("<audio />").attr("autoplay", true).attr("controls", true).css({width: "100%", height: "50px" }).appendTo(div);
            $("<source />").attr("src", data).appendTo(audio);
            div.dialog({
                width: 500,
                height: 120,
                close : function () {
                    $(this).dialog('destroy');
                }
            });
            break;

        case "video":
            div.attr("title", "Video clip").appendTo(div);
            let video = $("<video />").attr("autoplay", true).attr("controls", true).css({width: "100%", height: "90%" }).appendTo(div);
            $("<source />").attr("src", data).attr("type", mimeType).appendTo(video);
            div.dialog({
                width: 500,
                height: 500,
                close : function () {
                    $(this).dialog('destroy');
                }
            });
            break;
    }
}