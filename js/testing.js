/**
 * Created by abhijit on 6/22/16.
 */

(function() {

    // Invoke function once the document is fully loaded
    window.addEventListener('load', init, false);

    function init() {
        var canvas = document.getElementById("canvas");
        var c = canvas.getContext("2d");

        c.fillRect(0,0,canvas.width, canvas.height);

        function draw() {
            c.fillStyle = 'hsl(' + 360 * Math.random() + ', 100%, 50%)';
            c.beginPath();

            for (var i = 0; i < 10; i++) {
                c.arc(canvas.width * Math.random()
                    , canvas.height * Math.random()
                    , 50 * Math.random()
                    , 0, 2 * Math.PI);
                c.fill();
                c.closePath();
            }

        }

        function reDraw(event) {

            var x = event.clientX - canvas.getBoundingClientRect().left;
            var y = event.clientY - canvas.getBoundingClientRect().top;

           if (c.isPointInPath(x,y)){
               c.fillStyle = 'black';
               c.fillRect(0,0,canvas.width, canvas.height);
               draw();
           }

        }

        // canvas.addEventListener('mousemove', draw, false);
        canvas.addEventListener('mousemove', reDraw, false);
        // canvas.addEventListener('mousemove', draw, false);

        draw();

    }

    window.addEventListener('load', init, false);

}()); // Self invoking function