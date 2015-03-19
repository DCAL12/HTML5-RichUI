/**
 * Created by Douglas Callaway on 3/18/15.
 */
const FULL_CIRCLE = 2 * Math.PI;

var outerCircle = new fabric.Circle({
    strokeWidth: 5,
    fill: 0,
    stroke: "lightGrey",
    selectable: false
}),
    satellite = new fabric.Circle({
    radius: 20,
    fill: "blue",
    position: Math.PI,
    orbit: 0,
    orbitSpeed: Math.PI / 50
}),
    satellites = [],
    numberSatellites = 5,
    canvas = null,
    timer = null,
    minOrbitSpeed = 1,
    maxOrbitSpeed = 10;

window.onload = function () {
    var orbitSpacing;

    // Get document objects
    canvas = new fabric.Canvas("canvas");
    if (canvas) {

        outerCircle.setRadius(Math.min(canvas.getWidth(), canvas.getHeight()) / 2 - outerCircle.strokeWidth);
        canvas.add(outerCircle);
        outerCircle.center();
        orbitSpacing = outerCircle.getRadiusX() / numberSatellites;

        // Initialize satellites
        for (var i = 0; i < numberSatellites; i++) {

            var newSatellite = Object.create(satellite);
            newSatellite.orbit = orbitSpacing * i + satellite.getRadiusX();
            //newSatellite.position = Math.random() * FULL_CIRCLE;
            //newSatellite.orbitSpeed *= 1 / getRandomInteger(minOrbitSpeed, maxOrbitSpeed);
            newSatellite.orbitSpeed = Math.PI / 50;
            newSatellite.set({
                left: newSatellite.orbit * Math.cos(newSatellite.position) + canvas.getWidth() / 2,
                top: newSatellite.orbit * Math.sin(newSatellite.position) + canvas.getHeight() / 2
            });
            satellites.push(newSatellite);
            canvas.add(newSatellite);
        }
        setTimeout(animate(), 0);
    }
};

function animate() {
    satellites.forEach(function (satellite) {
        var newLeft,
            newTop;
        satellite.position += satellite.orbitSpeed;
        newLeft = satellite.orbit * Math.cos(satellite.position) + canvas.getWidth() / 2;
        newTop = satellite.orbit * Math.sin(satellite.position) + canvas.getHeight() / 2;
        satellite.animate({
            left: newLeft,
            top: newTop
        },{
            duration: 1000,
            onChange: canvas.renderAll.bind(canvas)
                //if (satellite === satellites[satellites.length - 1]){

                //}

        });
    });

}

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