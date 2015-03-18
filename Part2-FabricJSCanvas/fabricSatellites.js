/**
 * Created by Douglas Callaway on 3/18/15.
 */
const FULL_CIRCLE = 2 * Math.PI;
const REFRESH_RATE = 10;

var outerCircle = new fabric.Circle({
    strokeWidth: 5,
    fill: "white",
    radius: "300",
    stroke: "lightGrey"
});
var satellites = [],
    numberSatellites = 5,
    canvas = null,
    timer = null;

window.onload = function () {
    // Get document objects
    canvas = new fabric.Canvas('canvas');

    if (canvas) {

        outerCircle.setRadius(Math.min(canvas.getWidth(), canvas.getHeight()) / 2 - outerCircle.strokeWidth);

        // Initialize satellites
        for (var i = 0; i < numberSatellites; i++) {

            var newSatellite = new fabric.Circle({
                fill: "blue",
                left: 100,
                top: 100,
                radius: 20
            });

            newSatellite.setRadius(20);
            satellites.push(newSatellite);
            canvas.add(outerCircle, newSatellite);
        }

        //startAnimation();
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