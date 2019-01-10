var balls = [];
var pockets = [];
var cue;
var whiteBall;

// Dimensions of the canvas and the table
var W=300;
var L=600;

// Max length on the line of the cue
var MAX_STRIKE=250;
// Factor to skrink the force of the cue based on
// the line drawn on the screen
var STRIKE_FACTOR=10;

// Colors of the balls
var colors = {
    YELLOW: {
        color: [255, 246, 0],
        stripped: false
    },
    BLUE: {
        color: [0, 29, 255],
        stripped: false
    },
    RED: {
        color: [255, 0, 0],
        stripped: false
    },
    PINK: {
        color: [255, 0, 255],
        stripped: false
    },
    ORANGE: {
        color: [255, 110, 0],
        stripped: false
    },
    GREEN: {
        color: [0, 255, 0],
        stripped: false
    },
    TAN: {
        color: [100, 40, 0],
        stripped: false
    },
    BLACK: {
        color: [0, 0, 0],
        stripped: false
    },
    STRIPPED_YELLOW: {
        color: [255, 246, 0],
        stripped: true
    },
    STRIPPED_BLUE: {
        color: [0, 29, 255],
        stripped: true
    },
    STRIPPED_RED: {
        color: [255, 0, 0],
        stripped: true
    },
    STRIPPED_PINK: {
        color: [255, 0, 255],
        stripped: true
    },
    STRIPPED_ORANGE: {
        color: [255, 110, 0],
        stripped: true
    },
    STRIPPED_GREEN: {
        color: [0, 255, 0],
        stripped: true
    },
    STRIPPED_TAN: {
        color: [100, 40, 0],
        stripped: true
    },
    WHITE: {
        color: [255, 255, 255],
        stripped: false
    }
}

function setup() {
    createCanvas(W, L);

    // Place balls in the initial shape
    balls.push(new Ball(W/2-10, 400, 11, colors["WHITE"]));

    var row = 0;
    var col = 0;
    var cnt = 0
    for (var row=0; row<=5; row++) {
        for (var col=0; col<row; col++) {
            cnt++;
            var x = (W/2 + col*20) - (20*row*0.5)
            var y = 250 - 20*row;
            var colorKey = Object.keys(colors)[cnt-1]
            var color = colors[colorKey];
            balls.push(new Ball(x, y , cnt, color));
        }
    }

    // Place the pockets
    pockets.push(new Pocket(0, 0,   30));
    pockets.push(new Pocket(0, L/2, 30));
    pockets.push(new Pocket(0, L,   30));
    pockets.push(new Pocket(W, 0,   30));
    pockets.push(new Pocket(W, L/2, 30));
    pockets.push(new Pocket(W, L,   30));
    console.log(pockets);

    // The first Ball in the array is the white one
    whiteBall = balls[0];

    // The cue with the helper line enabled
    cue = new Cue(true);
}

function draw() {
    background(0, 100, 20);
    frameRate(30);

    // Reset the balls collisiob state
    for (var i=0; i< balls.length; i++) {
        balls[i].collided = false;
    }

    // Check if the balls collide and move them accordingly
    for (var i=0; i < balls.length - 1; i++) {
        for (var j=i+1; j < balls.length; j++) {
            if (balls[i].isColliding(balls[j])) {
                balls[i].collideWithOtherBall(balls[j]);
            }
        }
    }

    // Move each ball according to its velocity
    // And remove the balls in the pockets
    for (var i=balls.length - 1; i>=0 ; i--) {
        balls[i].move();
        // Don't remove the white ball
        if (i > 0 && balls[i].isPotted(pockets)) {
            balls.splice(i, 1);
        } else {
            balls[i].show();
        }
    }

    // Show the pockets
    for (var i=0; i< pockets.length; i++) {
        pockets[i].show();
    }

    // Handle the cue
    cue.move(whiteBall, mouseX, mouseY);
    cue.show();
}

// Hook for the keys pressed by the user
function keyPressed() {
    switch (keyCode) {
        /*
         *case UP_ARROW:
         *    whiteBall.vel.y = -3;
         *    break;
         *case DOWN_ARROW:
         *    whiteBall.vel.y = 3;
         *    break;
         *case LEFT_ARROW:
         *    cue.direction.rotate(PI / 10)
         *break;
         *case RIGHT_ARROW:
         *    cue.direction.rotate(- PI / 10)
         *break;
         */

        case 32: // SPACE : stop the white ball
            whiteBall.vel.x = 0;
            whiteBall.vel.y = 0;
        break;
        case 78: // n     : replace the white ball at the start position
            whiteBall.vel.x = 0;
            whiteBall.vel.y = 0;
            whiteBall.pos.x = W/2 - 10;
            whiteBall.pos.y = 400;
        default:
            console.log("key code", keyCode);
            break;
    }
}

// Hook for the mouse clicked by the user
function mousePressed() {
    // Strike the white ball with the cue
    cue.strike(whiteBall);
}
