/**
 * Created by Douglas Callaway on 3/16/15.
 */
const FULL_CIRCLE = 2 * Math.PI;
const REFRESH_RATE = 50;

var outerCircle = {
    borderWidth: 5,
    background: "white",
    borderColor: "lightGrey"
};
var satellite = {
    size: 20,
    color: "blue",
    position: Math.PI,
    orbit: 0,
    orbitSpeed: Math.PI / 50
};

var satellites = [],
    numberSatellites = 5,
    context = null,
    timer = null,
    minOrbitSpeed = 1,
    maxOrbitSpeed = 10;

window.onload = function () {
    var orbitSpacing;

    // Get document objects
    context = document.getElementById("canvas").getContext("2d");
    if (context) {

        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        outerCircle.radius = Math.min(context.canvas.width, context.canvas.height) / 2 - outerCircle.borderWidth;
        orbitSpacing = outerCircle.radius / numberSatellites;

        // Initialize satellites
        for (var i = 0; i < numberSatellites; i++) {

            var newSatellite = Object.create(satellite);
            newSatellite.orbit = orbitSpacing * i + satellite.size;
            newSatellite.position = Math.random() * FULL_CIRCLE;
            newSatellite.orbitSpeed *= 1 / getRandomInteger(minOrbitSpeed, maxOrbitSpeed);
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
        context.restore();
        context.strokeStyle = "blue";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(0, 0, satellite.orbit, 0, FULL_CIRCLE);
        context.stroke();

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

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}