/**
 * Created by Abhijit on 6/15/16.
 */




(function($) {

    // Invoke function once the document is fully loaded
    window.addEventListener('load', init, false);

    function init() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        // flag for mouse down or up
        var down = false;

        // flag for maintaining tool in use currently
        var toolInUse = null;

        context.strokeStyle = 'black';
        context.strokeStyle = 'round';

        // onClick listeners
        // Group DRAW
        document.querySelector('#pen').onclick = function () {
            toolInUse = 'pen';
            // alert(toolInUse);
        };
        document.querySelector('#erase').onclick = function () {
            toolInUse = 'erase';
        };

        // onClick listeners for clear Canvas
        // Group COLOR
        document.querySelector('#black').onclick = function () {
            context.strokeStyle = "black";
        };
        document.querySelector('#red').onclick = function () {
            context.strokeStyle = "red";
        };
        document.querySelector('#green').onclick = function () {
            context.strokeStyle = "green";
        };
        document.querySelector('#blue').onclick = function () {
            context.strokeStyle = "blue";
        };
        document.querySelector('#yellow').onclick = function () {
            context.strokeStyle = "yellow";
        };

        // onClick listeners
        // Group EDIT

        document.querySelector('#clear').onclick = function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
        };
        document.querySelector('#hide').onclick = function () {

        };
        // onClick listeners
        // Group SIZE
        document.querySelector('#size').onclick = function () {
            context.lineWidth = document.getElementById('size').value;
        };


        canvas.addEventListener('mousemove', draw);

        function draw(event) {
            // x = event.clientX - canvas.getBoundingClientRect().left;
            // y = event.clientY - canvas.getBoundingClientRect().top;
            var x = event.clientX - canvas.offsetLeft;
            var y = event.clientY - canvas.offsetTop;

            if (toolInUse == 'pen') {
                if (down == true) {
                    context.lineTo(x, y);
                    context.stroke();
                }
            }
            if (toolInUse == 'shape') {
                
            }


        }

        // function changeToolInUse(tool) {
        //     toolInUse = tool;
        //     // alert(toolInUse);
        // }
        //
        // function changeColor(color) {
        //     context.strokeStyle = color;
        // }

        // onClick listeners to change color in use
        canvas.addEventListener('mousedown', function () {
            down = true;
            context.beginPath();
            context.moveTo(x, y);
            canvas.addEventListener("mousemove", draw);
        });

        canvas.addEventListener('mouseup', function () {
            down = false;
        });

        // var history = {
        //     redo_list: [],
        //     undo_list: [],
        //     saveState: function(canvas, list, keep_redo) {
        //         keep_redo = keep_redo || false;
        //         if(!keep_redo) {
        //             this.redo_list = [];
        //         }
        //
        //         (list || this.undo_list).push(canvas.toDataURL());
        //     },
        //     undo: function(canvas, ctx) {
        //         this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
        //     },
        //     redo: function(canvas, ctx) {
        //         this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
        //     },
        //     restoreState: function(canvas, ctx,  pop, push) {
        //         if(pop.length) {
        //             this.saveState(canvas, push, true);
        //             var restore_state = pop.pop();
        //             var img = new Element('img', {'src':restore_state});
        //             img.onload = function() {
        //                 ctx.clearRect(0, 0, 600, 400);
        //                 ctx.drawImage(img, 0, 0, 600, 400, 0, 0, 600, 400);
        //             }
        //         }
        //     }
        // }

        // function setMousePosition(e) {
        //     var ev = e || window.event; //Moz || IE
        //     if (ev.pageX) { //Moz
        //         mouse.x = ev.pageX + window.pageXOffset;
        //         mouse.y = ev.pageY + window.pageYOffset;
        //     } else if (ev.clientX) { //IE
        //         mouse.x = ev.clientX + document.body.scrollLeft;
        //         mouse.y = ev.clientY + document.body.scrollTop;
        //     }
        // }
        //
        // var mouse = {
        //     x: 0,
        //     y: 0,
        //     startX: 0,
        //     startY: 0
        // };
        // var element = null;
        //
        // canvas.onmousemove = function (e) {
        //     setMousePosition(e);
        //     if (element !== null) {
        //         element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
        //         element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
        //         element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x + 'px' : mouse.startX + 'px';
        //         element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y + 'px' : mouse.startY + 'px';
        //     }
        // };
        //
        // canvas.onclick = function (e) {
        //     if (element !== null) {
        //         element = null;
        //         canvas.style.cursor = "default";
        //         console.log("finished.");
        //     } else {
        //         console.log("begun.");
        //         mouse.startX = mouse.x;
        //         mouse.startY = mouse.y;
        //         element = document.createElement('div');
        //         element.className = 'rectangle';
        //         element.style.left = mouse.x + 'px';
        //         element.style.top = mouse.y + 'px';
        //         canvas.appendChild(element);
        //     }
        // };
    }

}); // Self invoking function

