/*global $*/
(function () {
    'use strict';
    var dragging,
        offset,
        highestZindex = 0,
        picturesDiv = $('#bodyParts'),
        pictures = [],
        savedPositions = [];

    function touch2Mouse(e) {
        var theTouch = e.changedTouches[0];
        var mouseEv;

        switch (e.type) {
            case "touchstart": mouseEv = "mousedown"; break;
            case "touchend": mouseEv = "mouseup"; break;
            case "touchmove": mouseEv = "mousemove"; break;
            default: return;
        }

        var mouseEvent = document.createEvent("MouseEvent");
        mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
        theTouch.target.dispatchEvent(mouseEvent);

        e.preventDefault();
    }

    function placeParts() {
        var x = 0,
            y = 0;

        pictures.forEach(function (part) {
            part.css({ top: y, left: x });

            x += 110;
            if (x >= 330) {
                x = 0;
                y += 110;
            }
        });
    }




    $.getJSON('picSrc.json', function (pics) {
        /*if(localStorage.savedPositions) {
            savedPositions = JSON.parse(localStorage.savedPositions);
        }*/
        pics.forEach(function (element) {
            var image = $('<img class="draggable" src="' + element.src + '" >');
            console.log(image);
            pictures.push(image);
            $(image).appendTo(picturesDiv);

        });
        placeParts();

        $(document).on('mousedown', '.draggable', function (event) {
            dragging = $(this);
            offset = { top: event.offsetY, left: event.offsetX };
            dragging.css({
                position: "absolute", top: event.clientY - offset.top, left: event.clientX - offset.left,
                zIndex: ++highestZindex
            });
        }).on('mouseup', '.draggable', function () {
            savedPositions.forEach(function (elem, index) {
                if (elem.src === dragging[0].src) {
                    savedPositions.splice(index, 1);
                }
            });
            savedPositions.push({
                src: dragging[0].src,
                top: dragging.css('top'),
                left: dragging.css('left'),
                zIndex: dragging.css('zIndex'),


            });

            localStorage.savedPositions = JSON.stringify(savedPositions);
            localStorage.zIndex = JSON.stringify({ zIndex: highestZindex });

            dragging = null;
        });
        $(document).mousemove(function (event) {
            if (dragging) {
                dragging.css({ top: event.clientY - offset.top, left: event.clientX - offset.left });
            }

            event.preventDefault();
        });

        if (localStorage.savedPositions) {
            savedPositions = JSON.parse(localStorage.savedPositions);

            pictures.forEach(function (image) {
                var cssimg = savedPositions.find(function (element) {

                    if (element.src === image[0].src) {
                        return element;
                    }
                });
                if (cssimg) {
                    image.css({ top: cssimg.top, left: cssimg.left, zIndex: cssimg.zIndex });
                }

                var oldHighestZindex = JSON.parse(localStorage.zIndex);
                if (oldHighestZindex) {
                    highestZindex = oldHighestZindex.zIndex;
                }
            });
        }

        document.addEventListener("touchstart", touch2Mouse, true);
        document.addEventListener("touchmove", touch2Mouse, true);
        document.addEventListener("touchend", touch2Mouse, true);



    });







} ());