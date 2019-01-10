function Cue(helpEnabled) {
    this.begin = new p5.Vector();
    this.direction = new p5.Vector(0, 0);
    this.helpEnabled = helpEnabled;

    this.move = function(whiteBall, mouseX, mouseY) {
        // To move the cur we set its position to the
        // one of the white ball.
        // Its direction is set according to the position
        // of the mouse and its magnitude is capped
        this.begin = whiteBall.pos.copy();
        var end = new p5.Vector(mouseX, mouseY);
        this.direction = end.sub(this.begin);

        if (this.direction.mag() > MAX_STRIKE) {
            this.direction.setMag(MAX_STRIKE);
        }
    }

    this.show = function() {
        // To represent the cur draw a line from its position
        // following its direction
        // If needed show the helper in the opposite way
        line(this.begin.x, this.begin.y, this.begin.x + this.direction.x, this.begin.y + this.direction.y);

        if (this.helpEnabled) {
            line(this.begin.x, this.begin.y, this.begin.x - this.direction.x, this.begin.y - this.direction.y);
        }
    }

    this.strike = function(ball) {
        // To strike we take the direction of the cue
        // convert it to the corresponding force in the game
        // and add this vector to the velocity of the ball
        var direction = this.direction.copy();
        direction.mult(-1);
        direction.div(STRIKE_FACTOR);

        if (direction.mag() > MAX_STRIKE) {
            direction.setMag(MAX_STRIKE);
        }

        ball.vel.add(direction);
    }
}
