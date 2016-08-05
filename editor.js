/**
 * Created by Abhijit on 6/15/16.
 */

// (function() {

    // Invoke function once the document is fully loaded
    window.addEventListener('load', init, false);

    function init() {
        var canvas = document.getElementById('canvas');
        var c = canvas.getContext('2d');

        // flag for mouse down or up
        var down = false;

        // flag for maintaining tool in use currently
        var toolInUse = null;

        // onClick listeners for button to change mode
        document.querySelector('#pen').onclick = function() {
            toolInUse = 'pen';
            alert(toolInUse);
        };
        document.querySelector('#erase').onclick = function() {
            toolInUse = 'erase';
        };

        // onClick listeners for clear Canvas
        document.querySelector('#clear').onclick = function() {
            c.clearRect(0,0,canvas.width, canvas.height);
        };

        // onClick listeners to change Color
        document.querySelector('#black').onclick = function() {
            c.strokeStyle = "black";
        };
        document.querySelector('#red').onclick = function() {
            c.strokeStyle = "red";
        };
        document.querySelector('#green').onclick = function() {
            c.strokeStyle = "green";
        };
        document.querySelector('#blue').onclick = function() {
            c.strokeStyle = "blue";
        };
        document.querySelector('#yellow').onclick = function() {
            c.strokeStyle = "yellow";
        };


        canvas.addEventListener('mousemove', draw);

        function draw(event) {

            // x = event.clientX - canvas.getBoundingClientRect().left;
            // y = event.clientY - canvas.getBoundingClientRect().top;
            x = event.clientX - canvas.offsetLeft;
            y = event.clientY - canvas.offsetTop;


            if (toolInUse ==  'pen'){
                if (down == true) {
                    c.lineTo(x, y);
                    c.stroke();
                }
            }
        }

        canvas.addEventListener('mousedown', function(){
            down = true;
            c.beginPath();
            c.moveTo(x,y);
            canvas.addEventListenser("mousemove",draw);
        });

        canvas.addEventListener('mouseup', function() {
            down = false;
        });



    }

// }()); // Self invoking function