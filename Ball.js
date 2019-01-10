function Ball(x, y, id, color) {
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(0, 0);
    this.r = 10;
    this.id = id;
    this.color = color;
    this.collided=false;
    this.potted=false;

    this.move = function() {
        // Add friction
        var coefficientOfFriction = 0.99;
        this.vel.mult(coefficientOfFriction);

        // Move the ball
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Check the limits
        if (this.pos.x - this.r < 0 || this.pos.x + this.r > W - this.r) {
            this.vel.x *= - coefficientOfFriction;
        }
        if (this.pos.y - this.r < 0 || this.pos.y + this.r > L - this.r) {
            this.vel.y *= - coefficientOfFriction;
        }
    }

    this.isColliding = function(otherBall) {
        // Get the distance between the center of the two balls
        var dx = otherBall.pos.x - this.pos.x;
        var dy = otherBall.pos.y - this.pos.y;
        var distance = sqrt(dx * dx + dy * dy);

        // The balls touch if their distance is less than the sum of their radiuses
        var minDist = otherBall.r + this.r;
        if (distance < minDist) {
            this.collided = true;
            otherBall.collided = true;
            return true;
        }
        return false;
    }

    this.collideWithOtherBall = function(otherBall) {
        /*
         * The collision algorithm is inspired by this SO question
         * https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling
         */
        // get the minimum translation distance
        var delta = this.pos.copy();
        delta.sub(otherBall.pos);

        var d = delta.mag();
        if (d == 0) {
            d = 1;
        }
        // minimum translation distance to push balls apart after intersecting
        var minimumTranslationDistance = delta;
        //minimumTranslationDistance.mult((this.r + otherBall.r -d) / d);
        minimumTranslationDistance.mult(( this.r + otherBall.r )/d);


        // resolve intersection --
        // inverse mass quantities
        /*
         *var im1 = 1 / this.mass; 
         *var im2 = 1 / otherBall.mass;
         */
        var im1 = 1;
        var im2 = 1;

        // push-pull them apart based off their mass
        this.pos = this.pos.add(minimumTranslationDistance.copy().mult(im1 / (im1 + im2)));
        otherBall.pos = otherBall.pos.sub(minimumTranslationDistance.copy().mult(im2 / (im1 + im2)))

        // Respect the borders
        if (this.pos.x < this.r) {
            this.pos.x = this.r;
        } else if (this.pos.x > W - this.r) {
            this.pos.x = W - this.r;
        }
        if (this.pos.y < this.r) {
            this.pos.y = this.r;
        } else if (this.pos.y > L - this.r) {
            this.pos.y = W - this.r;
        }
        if (otherBall.pos.x < otherBall.r) {
            otherBall.pos.x = otherBall.r;
        } else if (otherBall.pos.x > W - otherBall.r) {
            otherBall.pos.x = W - otherBall.r;
        }
        if (otherBall.pos.y < otherBall.r) {
            otherBall.pos.y = otherBall.r;
        } else if (otherBall.pos.y > L - otherBall.r) {
            otherBall.pos.y = W - otherBall.r;
        }

        // impact speed
        var v = this.vel.copy().sub(otherBall.vel);
        var vn = v.dot(minimumTranslationDistance.copy().normalize());

        if (vn > 0) {
            return;
        }
        var coefficientOfRestitution = 0.5;
        var i =  (-(1 + coefficientOfRestitution) * vn) / (im1 + im2);

        // Adding the normalization because of this comment which seems to be working
        //https://stackoverflow.com/questions/345838/ball-to-ball-collision-detection-and-handling#comment18597945_345838
        var impulse = minimumTranslationDistance.copy().normalize().mult(i);

        // change in momentum
        this.vel = this.vel.add(impulse.copy().mult(im1));
        otherBall.vel = otherBall.vel.sub(impulse.copy().mult(im2));
    }

    this.show = function() {
        // Don't show the potted balls
        if (this.potted) {
            return;
        }
        if (this.collided) {
            // When they it's colliding give a visual clue
            fill(255, 0, 255);
        } else {
            // Add an alpha value when the ball is stripped
            // TODO: find a better way to show stripped balls
            if (this.color.stripped) {
                fill(this.color.color[0], this.color.color[1], this.color.color[2], 100);
            } else {
                fill(this.color.color[0], this.color.color[1], this.color.color[2]);
            }
        }
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    }

    this.isPotted = function(pockets) {
        for (pocket of pockets) {
            // A ball is in the pocket if 75% of its radius is in the pocket radius
            if (pocket.pos.dist(this.pos) < pocket.r + this.r * 0.75) {
                this.potted = true;
                return true;
            }
        }
        return false;
    }
}
