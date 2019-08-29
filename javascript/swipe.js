//A function for swiping the drawer
function swipeDrawer() {
    var drawer = document.getElementById("sideDrawer");
    var layout = document.querySelector('.mdl-layout');
    var requiredDistance = 50;
    var xPosStart;
    var xPosEnd;
    var movedDistance;
    var i = 0;
    var close = false;

    //Gets X Position on Touch Start
    drawer.addEventListener('touchstart', function (e) {
        xPosStart = e.changedTouches[0].pageX;
    });

    //Slides the drawer to the left when you Touch Move
    drawer.addEventListener('touchmove', function (e) {
        var oldI = i;
        if (xPosStart - e.changedTouches[0].pageX > 0) {
            i = xPosStart - e.changedTouches[0].pageX;
            drawer.style.left = "-" + i + "px";
        }

        // if last move was to the left
        if (i > oldI) {
            close = true;
        }

        // if last move was 0 or to the right
        else {
            close = false;
        }
    });

    //If the required Distance is met, the drawer closes and gets resetted after 200ms (so it doesnt snap back instantly),
    //If this is not the case, the drawer bounces back
    drawer.addEventListener('touchend', function (e) {
        xPosEnd = e.changedTouches[0].pageX;
        movedDistance = xPosStart - xPosEnd;

        if (movedDistance >= requiredDistance && close == true) {
            layout.MaterialLayout.toggleDrawer();
            setTimeout(() => {
                drawer.style.left = "0px";
            }, 200);
        }

        else {
            $("#sideDrawer").animate({ left: "0px" }, "fast");
        }
    });
}