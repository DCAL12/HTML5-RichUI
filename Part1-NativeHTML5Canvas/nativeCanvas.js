/**
 * Created by Douglas Callaway on 3/16/15.
 */

const FULL_CIRCLE = 2 * Math.PI;
const OUTER_CIRCLE = {
    borderWidth: 5,
    background: "white",
    borderColor: "lightGrey"
};
const DOT = {
    count: 5,
    radius: 20,
    color: "blue",
    orbitSpeed: Math.PI / 500
};
var dots = [];
var context = null;

window.onload = function () {
    context = document.getElementById("circle").getContext("2d");
    OUTER_CIRCLE.radius = Math.min(context.canvas.width, context.canvas.height) / 2 - OUTER_CIRCLE.borderWidth;

    if (context) {
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        clearCanvas();

        // Initialize dots
        for (var i = 0; i < DOT.count; i++) {
            dots[i] = Object.create(DOT);

            // Ensure orbit is not smaller than dot radius
            dots[i].orbit = Math.max(DOT.radius, ((OUTER_CIRCLE.radius - DOT.radius) / DOT.count) * i+1);
            dots[i].position = Math.random() * 2 * Math.PI;
            dots[i].orbitSpeed *= Math.random();
        }

        // Start Animation
        setInterval(drawDots, 10);
    }
};

function drawDots() {
    clearCanvas();
    dots.forEach(function (dot) {

        // Draw orbit
        //context.restore();
        //context.strokeStyle = "lightGrey";
        //context.lineWidth = 1;
        //context.beginPath();
        //context.arc(0, 0, dot.orbit, 0, FULL_CIRCLE);
        //context.stroke();

        // Draw Dot
        context.restore();
        context.fillStyle = dot.color;
        context.beginPath();
        context.arc(dot.orbit * Math.cos(dot.position),
            dot.orbit * Math.sin(dot.position),
            dot.radius, 0, FULL_CIRCLE);
        context.fill();
        dot.position += dot.orbitSpeed;
    })
}

function clearCanvas() {
    context.restore();
    context.fillStyle = OUTER_CIRCLE.background;
    context.strokeStyle = OUTER_CIRCLE.borderColor;
    context.lineWidth = 5;
    context.beginPath();
    context.arc(0, 0, OUTER_CIRCLE.radius, 0, FULL_CIRCLE);
    context.fill();
    context.stroke();
}

function reverse() {
    dots.forEach(function (dot) {
        dot.orbitSpeed *= -1;
    })
}

function pause() {
    // Dots are moving
    if (dots.some(function (dot) {
            return dot.orbitSpeed != 0;
        })) {
        dots.forEach(function (dot) {
            dot.savedSpeed = dot.orbitSpeed;
            dot.orbitSpeed = 0;
        })
    }
    // Save the dot speeds for resume
    else {
        dots.forEach(function (dot) {
            dot.orbitSpeed = dot.savedSpeed;
            dot.savedSpeed = null;
        })
    }
}