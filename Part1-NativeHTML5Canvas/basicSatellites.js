/**
 * Created by Douglas Callaway on 3/16/15.
 */

var satelliteCanvas = function () {
    const FULL_CIRCLE = 2 * Math.PI;
    const REFRESH_RATE = 50;

    var outerCircle = {
        borderWidth: 10,
        background: "white",
        borderColor: "rgb(214,214,214)"
    };

    var satellite = {
        size: 30,
        color: "rgb(0,102,204)",
        position: Math.PI,
        orbit: 0,
        orbitSpeed: Math.PI / 80
    };
    var satellites = [],
        satelliteCount = 5,
        context = null,
        playTimer = null,
        control = {};

    window.onload = function () {

        // Get document objects
        context = document.getElementById("canvas").getContext("2d");
        if (context) {

            // Initialize canvas
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            outerCircle.radius = Math.min(context.canvas.width, context.canvas.height) / 2 - outerCircle.borderWidth - satellite.size;

            // Initialize satellites
            for (var i = 0; i < satelliteCount; i++) {

                var newSatellite = Object.create(satellite);
                newSatellite.orbit = getRandomInteger(0, outerCircle.radius);
                newSatellite.position = Math.random() * FULL_CIRCLE;
                satellites.push(newSatellite);
            }
            control.startAnimation();
        }
    };

    function drawSatellites() {
        clearCanvas();
        satellites.forEach(function (satellite) {

            // Draw orbit
            //context.restore();
            //context.strokeStyle = "blue";
            //context.lineWidth = 1;
            //context.beginPath();
            //context.arc(0, 0, satellite.orbit, 0, FULL_CIRCLE);
            //context.stroke();

            // Draw Dot
            context.fillStyle = satellite.color;
            context.beginPath();
            context.arc(satellite.orbit * Math.cos(satellite.position),
                satellite.orbit * Math.sin(satellite.position),
                satellite.size, 0, FULL_CIRCLE);
            context.fill();
            satellite.position += satellite.orbitSpeed;
        })
    }

    function clearCanvas() {
        // Clear Background
        context.translate(context.canvas.width / -2, context.canvas.height / -2);
        context.fillStyle = "white";
        context.rect(0, 0, context.canvas.width, context.canvas.height);
        context.fill();

        // Re-draw outerCircle
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        context.fillStyle = outerCircle.background;
        context.strokeStyle = outerCircle.borderColor;
        context.lineWidth = outerCircle.borderWidth;
        context.beginPath();
        context.arc(0, 0, outerCircle.radius, 0, FULL_CIRCLE);
        context.fill();
        context.stroke();
    }

    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    control = {
        startAnimation: function () {
            if (!playTimer) {
                playTimer = setInterval(drawSatellites, REFRESH_RATE);
                document.getElementById('play').disabled = true;
                document.getElementById('pause').disabled = false;
            }
        },

        stopAnimation: function () {
            clearInterval(playTimer);
            playTimer = null;
            document.getElementById('play').disabled = false;
            document.getElementById('pause').disabled = true;
        },

        reverse: function () {
            satellites.forEach(function (satellite) {
                satellite.orbitSpeed *= -1;
            });

            if (!playTimer) {
                control.startAnimation();
            }
        }
    };

    return control;
}();