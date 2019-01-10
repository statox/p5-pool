function Pocket(x, y, r) {
    this.pos = new p5.Vector(x, y);
    this.r = r;

    this.show = function() {
        // A pocket is simply a circle at its position
        fill(0, 0, 0);
        ellipse(this.pos.x, this.pos.y, this.r*2);
    }
}
