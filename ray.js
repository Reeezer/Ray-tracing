// Meyer Luca, Girardin Jarod, Boegli Lenny, Muller Léon
// Version 20/05

/**
 * A ray
 * @param pos : position where the ray starts
 * @param angle : angle taken by the ray, in degree
 * @param color : color of the ray
 */
class Ray {
	constructor(pos, angle, color) {
		this.pos = pos;
		this.dir = p5.Vector.fromAngle(angle);
		this.angle = angle;
		this.color = color;
	}

	/**
	 * @return : the color
	 * Get the color
	 */
	getColor() {
		return this.color;
	}

	/**
	 * Adjust the vector displaying the direction of the ray
	 */
	lookAt(x, y) {
		this.dir.x = x - this.pos.x;
		this.dir.y = y - this.pos.y;
		this.dir.normalize();
	}

	/**
	 * @param angle : angle (in degree) the ray has to rotate
	 * Rotate the ray
	 */
	rotate(angle) {
		this.dir = p5.Vector.fromAngle(angle);
		this.angle = angle;
	}

	/**
	 * @return : the position
	 * Get the position
	 */
	getPos() {
		return this.pos;
	}

	/**
	 * @return : the angle
	 * Get the angle
	 */
	getAngle() {
		return this.angle;
	}

	/**
	 * @return a normalized vector displaying the direction of the ray
	 */
	getDir() {
		return this.dir;
	}

	/**
	 * Display the ray
	 */
	show() {
		stroke(255, 255, 255);
		push();
		translate(this.pos.x, this.pos.y);
		line(0, 0, this.dir.x * 10, this.dir.y * 10);
		pop();
	}

	/**
	 * @param wall : the wall to be verified with
	 * @return : a point where the ray meets the wall, else null
	 * Verify if the ray meets the wall
	 */
	cast(wall) {
		const x1 = wall.a.x;
		const y1 = wall.a.y;
		const x2 = wall.b.x;
		const y2 = wall.b.y;

		const x3 = this.pos.x;
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return;
		}

		// formula taken here https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

		if (t > 0 && t < 1 && u > 0) {
			const pt = createVector();
			pt.x = x1 + t * (x2 - x1);
			pt.y = y1 + t * (y2 - y1);
			return pt;
		} else {
			return;
		}
	}
}
