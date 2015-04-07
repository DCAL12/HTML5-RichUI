/**
 * Created by Douglas Callaway on 3/18/15.
 */
var satelliteFabric = (function () {
    const FULL_CIRCLE = 2 * Math.PI;
    var outerCircle = new fabric.Ellipse({
            selectable: false,
            stroke: 'lightGrey',
            strokeWidth: 5,
            fill: 'black'
        }),
        satellitePrototype = new fabric.Circle({
            hasBorders: false,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            radius: 20,
            orbit: {}
        }),
        orbit = new fabric.Ellipse({
            selectable: false,
            originX: 'center',
            originY: 'center',
            stroke: 'orange',
            strokeWidth: 1,
            fill: 0,
            position: FULL_CIRCLE,
            speed: Math.PI / 80
        }),
        star = new fabric.Circle({
            radius: 40
        }),
        satellites = [],
        numberSatellites = 5,
        minOrbitSpeed = 1,
        maxOrbitSpeed = 10,
        playTimer = null,
        refreshRate = 100,
        canvas = null,
        control = {};

    window.onload = function () {
        var orbitSpacingX,
            orbitSpacingY;

        // Get document objects
        canvas = new fabric.Canvas('canvas');
        if (canvas) {

            // Initialize outerCircle
            outerCircle.set({
                rx: canvas.getCenter().left - outerCircle.strokeWidth,
                ry: canvas.getCenter().top - outerCircle.strokeWidth
            });
            canvas.add(outerCircle);
            outerCircle.center();

            // Initialize orbit spacing and size
            orbit.minRadius = (2 * satellitePrototype.radius) + star.radius;
            orbitSpacingX = (outerCircle.rx - orbit.minRadius) / numberSatellites;
            orbitSpacingY = (outerCircle.ry - orbit.minRadius) / numberSatellites;

            // Initialize satellites
            for (var i = 0; i < numberSatellites; i++) {

                var newSatellite = Object.create(satellitePrototype),
                    newOrbit = Object.create(orbit);

                newSatellite.orbit = newOrbit;
                newOrbit.set({
                    left: canvas.getCenter().left,
                    top: canvas.getCenter().top,
                    rx: (orbitSpacingX * i) + orbit.minRadius,
                    ry: (orbitSpacingY * i) + orbit.minRadius,
                    position: fabric.util.getRandomInt(-FULL_CIRCLE, FULL_CIRCLE)
                });

                newSatellite.set(getCoordinatesFromPosition(newSatellite.orbit.rx, newSatellite.orbit.ry, newSatellite.orbit.position));
                drawShadow(newSatellite);

                satellites.push(newSatellite);
                canvas.add(newOrbit);
            }
            satellites.forEach(function (satellite) {
                canvas.add(satellite);
            });

            // Initialize star
            star.setGradient('fill', {
                type: 'radial',
                x1: star.width / 2,
                y1: star.height / 2,
                x2: star.width / 2,
                y2: star.width / 2,
                r1: star.width / 2,
                r2: star.width / 8,
                colorStops: {
                    0: 'yellow',
                    1: 'white'
                }
            });
            canvas.add(star);
            star.center();

            control.startAnimation();
        }

        // Event Listeners
        canvas.on({
            'mouse:over': onMouseOver,
            'mouse:out': onMouseOut,
            'object:moving': onObjectMoving
        })
    };

    function onMouseOver(event) {
        // Allow user to select satellites
        var target = event.target;
        if (satellites.some(function (satellite) {
                target = satellite;
                return satellite === event.target;
            })) {

            highlight(target, true);
            clearInterval(playTimer);
            target.savedOrbitPoint = {
                x: target.left,
                y: target.top
            }
        }
    }

    function onMouseOut(event) {
        // Re-animate satellites after moving mouse
        var target = event.target;
        if (satellites.some(function (satellite) {
                target = satellite;
                return satellite === event.target;
            })) {

            highlight(target, false);
            playTimer = setInterval(animate, refreshRate);
        }
    }

    function onObjectMoving(event) {
        // Dynamically resize orbits
        var satellite = event.target;
        resizeOrbit(satellite);
    }

    function highlight(satellite, enable) {
        if (enable) {
            satellite.set({
                stroke: 'lightBlue',
                strokeWidth: 2,
                opacity: .75
            })
        }
        else {
            satellite.set({
                strokeWidth: 0,
                opacity: 1
            })
        }
    }

    function drawShadow(satellite) {
        satellite.setGradient('fill', {
            type: 'linear',
            x1: satellite.getWidth() / 2,
            y1: 0,
            x2: satellite.getWidth() / 2,
            y2: satellite.getHeight() / 1.5,
            colorStops: {
                0: 'blue',
                1: 'black'
            }
        });
    }

    function resizeOrbit(satellite) {
        // New radius = abs(old radius + change in distance from origin (canvas center)), not to exceed outerCircle bounds or be less than minimumOrbit
        satellite.orbit.rx = Math.max(orbit.minRadius,
            Math.min(outerCircle.getRx() - satellite.radius,
                Math.abs(Math.abs(satellite.left - canvas.getCenter().left) //new orbit left coordinate
                - Math.abs(satellite.savedOrbitPoint.x - canvas.getCenter().left)))); //old orbit left coordinate

        satellite.orbit.ry = Math.max(orbit.minRadius,
            Math.min(outerCircle.getRy() - satellite.radius,
                Math.abs(Math.abs(satellite.top - canvas.getCenter().top) //new orbit top coordinate
                - Math.abs(satellite.savedOrbitPoint.y - canvas.getCenter().top)))); //old orbit top coordinate
    }

    function animate() {
        satellites.forEach(function (satellite) {
            var nextCoordinate = getCoordinatesFromPosition(satellite.orbit.rx, satellite.orbit.ry, satellite.orbit.position += satellite.orbit.speed);

            satellite.animate({left: nextCoordinate.left}, {
                duration: refreshRate
            });

            satellite.animate({top: nextCoordinate.top}, {
                duration: refreshRate
            });

            satellite.animate(getAngleToStar(satellite), {
                duration: refreshRate,
                onChange: renderCanvas(satellite)
            });
        });

        function renderCanvas(satellite) {
            if (satellite === satellites[satellites.length - 1]) {
                return canvas.renderAll.bind(canvas);
            }
        }

        function getAngleToStar(satellite) {
            var starAngle = fabric.util.radiansToDegrees(satellite.orbit.position - (Math.PI / 2));
            return {angle: starAngle}
        }
    }

    function getCoordinatesFromPosition(orbitRadiusX, orbitRadiusY, angularPosition) {
        return {
            left: orbitRadiusX * Math.cos(angularPosition) + canvas.getCenter().left,
            top: orbitRadiusY * Math.sin(angularPosition) + canvas.getCenter().top
        }
    }

    control = {
        startAnimation: function () {
            if (!playTimer) {
                playTimer = setInterval(animate, refreshRate);
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
                satellite.orbit.speed *= -1;
            });

            if (!playTimer) {
                control.startAnimation();
            }
        }
    };

    return control;
}());