/**
 * Created by Douglas Callaway on 3/16/15.
 */
const FULL_CIRCLE = 2 * Math.PI;
const REFRESH_RATE = 10;

var outerCircle = {
    borderWidth: 5,
    background: "white",
    borderColor: "lightGrey"
};
var satellite = {
    size: 20,
    color: "blue",
    orbitSpeed: Math.PI / 500
};

var satellites = [],
    numberSatellites = 5,
    context = null,
    timer = null;

window.onload = function () {
    // Get document objects
    context = document.getElementById("canvas").getContext("2d");

    if (context) {

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        outerCircle.radius = Math.min(context.canvas.width, context.canvas.height) / 2 - outerCircle.borderWidth;

        // Initialize satellites
        for (var i = 0; i < numberSatellites; i++) {

            var newSatellite = Object.create(satellite);

            // First orbit size = satellite.size
            newSatellite.orbit = Math.max(satellite.size, ((outerCircle.radius - satellite.size) / numberSatellites) * i + 1);
            newSatellite.position = Math.random() * FULL_CIRCLE;
            newSatellite.orbitSpeed *= Math.random();
            satellites.push(newSatellite);
        }

        startAnimation();
    }
};

function startAnimation() {
    timer = setInterval(drawSatellites, REFRESH_RATE);
    document.getElementById("play").disabled = true;
    document.getElementById("pause").disabled = false;
}

function stopAnimation() {
    clearInterval(timer);
    document.getElementById("play").disabled = false;
    document.getElementById("pause").disabled = true;
}

function reverse() {
    satellites.forEach(function (satellite) {
        satellite.orbitSpeed *= -1;
    })
}

function drawSatellites() {
    clearCanvas();
    satellites.forEach(function (satellite) {

        // Draw orbit
        /*context.restore();
         context.strokeStyle = "lightGrey";
         context.lineWidth = 1;
         context.beginPath();
         context.arc(0, 0, satellite.orbit, 0, FULL_CIRCLE);
         context.stroke();*/

        // Draw Dot
        context.restore();
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
    context.restore();
    context.fillStyle = outerCircle.background;
    context.strokeStyle = outerCircle.borderColor;
    context.lineWidth = 5;
    context.beginPath();
    context.arc(0, 0, outerCircle.radius, 0, FULL_CIRCLE);
    context.fill();
    context.stroke();
}