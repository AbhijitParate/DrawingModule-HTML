/**
 * Created by abhij on 3/15/2017.
 */
fabric.Media = fabric.util.createClass(fabric.Object, /** @lends fabric.Media.prototype */ {

    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'media',

    /**
     * crossOrigin value (one of "", "anonymous", "use-credentials")
     * @see https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes
     * @type String
     * @default
     */
    crossOrigin: '',

    /**
     * AlignX value, part of preserveAspectRatio (one of "none", "mid", "min", "max")
     * @see http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
     * This parameter defines how the picture is aligned to its viewport when image element width differs from image width.
     * @type String
     * @default
     */
    alignX: 'none',

    /**
     * AlignY value, part of preserveAspectRatio (one of "none", "mid", "min", "max")
     * @see http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
     * This parameter defines how the picture is aligned to its viewport when image element height differs from image height.
     * @type String
     * @default
     */
    alignY: 'none',

    /**
     * meetOrSlice value, part of preserveAspectRatio  (one of "meet", "slice").
     * if meet the image is always fully visibile, if slice the viewport is always filled with image.
     * @see http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
     * @type String
     * @default
     */
    meetOrSlice: 'meet',

    /**
     * Width of a stroke.
     * For image quality a stroke multiple of 2 gives better results.
     * @type Number
     * @default
     */
    strokeWidth: 0,

    /**
     * private
     * contains last value of scaleX to detect
     * if the Image got resized after the last Render
     * @type Number
     */
    _lastScaleX: 1,

    /**
     * private
     * contains last value of scaleY to detect
     * if the Image got resized after the last Render
     * @type Number
     */
    _lastScaleY: 1,

    /**
     * minimum scale factor under which any resizeFilter is triggered to resize the image
     * 0 will disable the automatic resize. 1 will trigger automatically always.
     * number bigger than 1 can be used in case we want to scale with some filter above
     * the natural image dimensions
     * @type Number
     */
    minimumScaleTrigger: 0.5,

    /**
     * List of properties to consider when checking if
     * state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties: null,

    /**
     * When `true`, object is cached on an additional canvas.
     * default to false for images
     * since 1.7.0
     * @type Boolean
     * @default
     */
    objectCaching: false,

    /**
     * Constructor
     * @param {HTMLImageElement | String} mediaDataUrl Image element
     * @param {Object} [options] Options object
     * @param {function} [callback] callback function to call after eventual filters applied.
     * @return {fabric.Image} thisArg
     */
    initialize: function(mediaDataUrl, options, callback) {
        options || (options = { });
        this.callSuper('initialize', options);
        this._initElement(mediaDataUrl, options, callback);
    },

    /**
     * Returns image element which this instance if based on
     * @return {HTMLImageElement} Image element
     */
    getElement: function() {
        return this._element;
    },

    /**
     * Sets image element for this instance to a specified one.
     * If filters defined they are applied to new image.
     * You might need to call `canvas.renderAll` and `object.setCoords` after replacing, to render new image and update controls area.
     * @param {HTMLImageElement} element
     * @param {Function} [callback] Callback is invoked when all filters have been applied and new image is generated
     * @param {Object} [options] Options object
     * @return {fabric.Media} thisArg
     * @chainable
     */
    setElement: function(element, callback, options) {

        var _callback;

        this._element = element;
        this._originalElement = element;
        this._initConfig(options);

        _callback = callback;

        if (_callback) {
            _callback(this);
        }

        return this;
    },

    /**
     * Sets crossOrigin value (on an instance and corresponding image element)
     * @return {fabric.Media} thisArg
     * @chainable
     */
    setCrossOrigin: function(value) {
        this.crossOrigin = value;
        this._element.crossOrigin = value;

        return this;
    },

    /**
     * Returns original size of an image
     * @return {Object} Object with "width" and "height" properties
     */
    getOriginalSize: function() {
        var element = this.getElement();
        return {
            width: element.width,
            height: element.height
        };
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _stroke: function(ctx) {
        if (!this.stroke || this.strokeWidth === 0) {
            return;
        }
        var w = this.width / 2, h = this.height / 2;
        ctx.beginPath();
        ctx.moveTo(-w, -h);
        ctx.lineTo(w, -h);
        ctx.lineTo(w, h);
        ctx.lineTo(-w, h);
        ctx.lineTo(-w, -h);
        ctx.closePath();
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _renderDashedStroke: function(ctx) {
        var x = -this.width / 2,
            y = -this.height / 2,
            w = this.width,
            h = this.height;

        ctx.save();
        this._setStrokeStyles(ctx);

        ctx.beginPath();
        fabric.util.drawDashedLine(ctx, x, y, x + w, y, this.strokeDashArray);
        fabric.util.drawDashedLine(ctx, x + w, y, x + w, y + h, this.strokeDashArray);
        fabric.util.drawDashedLine(ctx, x + w, y + h, x, y + h, this.strokeDashArray);
        fabric.util.drawDashedLine(ctx, x, y + h, x, y, this.strokeDashArray);
        ctx.closePath();
        ctx.restore();
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function(propertiesToInclude) {
        var filters = [], resizeFilters = [],
            scaleX = 1, scaleY = 1;

        var object = fabric.util.object.extend(
            this.callSuper(
                'toObject',
                ['crossOrigin', 'alignX', 'alignY', 'meetOrSlice'].concat(propertiesToInclude)
            ), {
                src: this.getSrc(),
                filters: filters,
                resizeFilters: resizeFilters,
            });

        object.width /= scaleX;
        object.height /= scaleY;

        return object;
    },

    /* _TO_SVG_START_ */
    /**
     * Returns SVG representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG: function(reviver) {
        var markup = this._createBaseSVGMarkup(), x = -this.width / 2, y = -this.height / 2,
            preserveAspectRatio = 'none', filtered = true;
        if (this.group && this.group.type === 'path-group') {
            x = this.left;
            y = this.top;
        }
        if (this.alignX !== 'none' && this.alignY !== 'none') {
            preserveAspectRatio = 'x' + this.alignX + 'Y' + this.alignY + ' ' + this.meetOrSlice;
        }
        markup.push(
            '<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n',
            '<image ', this.getSvgId(), 'xlink:href="', this.getSvgSrc(filtered),
            '" x="', x, '" y="', y,
            '" style="', this.getSvgStyles(),
            // we're essentially moving origin of transformation from top/left corner to the center of the shape
            // by wrapping it in container <g> element with actual transformation, then offsetting object to the top/left
            // so that object's center aligns with container's left/top
            '" width="', this.width,
            '" height="', this.height,
            '" preserveAspectRatio="', preserveAspectRatio, '"',
            '></image>\n'
        );

        if (this.stroke || this.strokeDashArray) {
            var origFill = this.fill;
            this.fill = null;
            markup.push(
                '<rect ',
                'x="', x, '" y="', y,
                '" width="', this.width, '" height="', this.height,
                '" style="', this.getSvgStyles(),
                '"/>\n'
            );
            this.fill = origFill;
        }

        markup.push('</g>\n');

        return reviver ? reviver(markup.join('')) : markup.join('');
    },
    /* _TO_SVG_END_ */

    /**
     * Returns source of an image
     * @param {Boolean} filtered indicates if the src is needed for svg
     * @return {String} Source of an image
     */
    getSrc: function(filtered) {
        var element = filtered ? this._element : this._originalElement;
        if (element) {
            return fabric.isLikelyNode ? element._src : element.src;
        }
        else {
            return this.src || '';
        }
    },

    /**
     * Sets source of an image
     * @param {String} src Source string (URL)
     * @param {Function} [callback] Callback is invoked when image has been loaded (and all filters have been applied)
     * @param {Object} [options] Options object
     * @return {fabric.Image} thisArg
     * @chainable
     */
    setSrc: function(src, callback, options) {
        fabric.util.loadImage(src, function(img) {
            return this.setElement(img, callback, options);
        }, this, options && options.crossOrigin);
    },

    /**
     * Returns string representation of an instance
     * @return {String} String representation of an instance
     */
    toString: function() {
        return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
    },

    /**
     * Applies filters assigned to this image (from "filters" array)
     * @method applyFilters
     * @param {Function} callback Callback is invoked when all filters have been applied and new image is generated
     * @param {Array} filters to be applied
     * @param {fabric.Image} imgElement image to filter ( default to this._element )
     * @param {Boolean} forResizing
     * @return {CanvasElement} canvasEl to be drawn immediately
     * @chainable
     */
    applyFilters: function(callback, filters, imgElement, forResizing) {

        filters = filters || this.filters;
        imgElement = imgElement || this._originalElement;

        if (!imgElement) {
            return;
        }

        var replacement = fabric.util.createImage(),
            retinaScaling = this.canvas ? this.canvas.getRetinaScaling() : fabric.devicePixelRatio,
            minimumScale = this.minimumScaleTrigger / retinaScaling,
            _this = this, scaleX, scaleY;

        if (filters.length === 0) {
            this._element = imgElement;
            callback && callback(this);
            return imgElement;
        }

        var canvasEl = fabric.util.createCanvasElement();
        canvasEl.width = imgElement.width;
        canvasEl.height = imgElement.height;
        canvasEl.getContext('2d').drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

        filters.forEach(function(filter) {
            if (!filter) {
                return;
            }
            if (forResizing) {
                scaleX = _this.scaleX < minimumScale ? _this.scaleX : 1;
                scaleY = _this.scaleY < minimumScale ? _this.scaleY : 1;
                if (scaleX * retinaScaling < 1) {
                    scaleX *= retinaScaling;
                }
                if (scaleY * retinaScaling < 1) {
                    scaleY *= retinaScaling;
                }
            }
            else {
                scaleX = filter.scaleX;
                scaleY = filter.scaleY;
            }
            filter.applyTo(canvasEl, scaleX, scaleY);
            if (!forResizing && filter.type === 'Resize') {
                _this.width *= filter.scaleX;
                _this.height *= filter.scaleY;
            }
        });

        /** @ignore */
        replacement.width = canvasEl.width;
        replacement.height = canvasEl.height;
        replacement.onload = function() {
            _this._element = replacement;
            !forResizing && (_this._filteredEl = replacement);
            callback && callback(_this);
            replacement.onload = canvasEl = null;
        };
        replacement.src = canvasEl.toDataURL('image/png');
        return canvasEl;
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     * @param {Boolean} noTransform
     */
    _render: function(ctx, noTransform) {
        var x, y, imageMargins = this._findMargins(), elementToDraw;

        x = (noTransform ? this.left : -this.width / 2);
        y = (noTransform ? this.top : -this.height / 2);

        if (this.meetOrSlice === 'slice') {
            ctx.beginPath();
            ctx.rect(x, y, this.width, this.height);
            ctx.clip();
        }

        if (this.isMoving === false && this.resizeFilters.length && this._needsResize()) {
            this._lastScaleX = this.scaleX;
            this._lastScaleY = this.scaleY;
            elementToDraw = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, true);
        }
        else {
            elementToDraw = this._element;
        }
        elementToDraw && ctx.drawImage(elementToDraw,
            x + imageMargins.marginX,
            y + imageMargins.marginY,
            imageMargins.width,
            imageMargins.height
        );

        this._stroke(ctx);
        this._renderStroke(ctx);
    },

    /**
     * @private, needed to check if image needs resize
     */
    _needsResize: function() {
        return (this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY);
    },

    /**
     * @private
     */
    _findMargins: function() {
        var width = this.width, height = this.height, scales,
            scale, marginX = 0, marginY = 0;

        if (this.alignX !== 'none' || this.alignY !== 'none') {
            scales = [this.width / this._element.width, this.height / this._element.height];
            scale = this.meetOrSlice === 'meet'
                ? Math.min.apply(null, scales) : Math.max.apply(null, scales);
            width = this._element.width * scale;
            height = this._element.height * scale;
            if (this.alignX === 'Mid') {
                marginX = (this.width - width) / 2;
            }
            if (this.alignX === 'Max') {
                marginX = this.width - width;
            }
            if (this.alignY === 'Mid') {
                marginY = (this.height - height) / 2;
            }
            if (this.alignY === 'Max') {
                marginY = this.height - height;
            }
        }
        return {
            width:  width,
            height: height,
            marginX: marginX,
            marginY: marginY
        };
    },

    /**
     * @private
     */
    _resetWidthHeight: function() {
        var element = this.getElement();

        this.set('width', element.width);
        this.set('height', element.height);
    },

    /**
     * The Image class's initialization method. This method is automatically
     * called by the constructor.
     * @private
     * @param {HTMLImageElement|String} mediaDataUrl The element representing the image
     * @param {Object} [options] Options object
     */
    _initElement: function(mediaDataUrl, options, callback) {
        this.setElement(mediaDataUrl, callback, options);
        fabric.util.addClass(this.getElement(), fabric.Media.CSS_CANVAS);
    },

    /**
     * @private
     * @param {Object} [options] Options object
     */
    _initConfig: function(options) {
        options || (options = { });
        this.setOptions(options);
        this._setWidthHeight(options);
        if (this._element && this.crossOrigin) {
            this._element.crossOrigin = this.crossOrigin;
        }
    },

    /**
     * @private
     * @param {Array} filters to be initialized
     * @param {Function} callback Callback to invoke when all fabric.Image.filters instances are created
     */
    _initFilters: function(filters, callback) {
        if (filters && filters.length) {
            fabric.util.enlivenObjects(filters, function(enlivenedObjects) {
                callback && callback(enlivenedObjects);
            }, 'fabric.Image.filters');
        }
        else {
            callback && callback();
        }
    },

    /**
     * @private
     * @param {Object} [options] Object with width/height properties
     */
    _setWidthHeight: function(options) {
        this.width = 'width' in options
            ? options.width
            : (this.getElement()
                ? this.getElement().width || 0
                : 0);

        this.height = 'height' in options
            ? options.height
            : (this.getElement()
                ? this.getElement().height || 0
                : 0);
    },
});

fabric.Media.CSS_CANVAS = 'canvas-media';