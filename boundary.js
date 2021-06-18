// Meyer Luca, Girardin Jarod, Boegli Lenny, Muller Léon
// Version 20/05

/**
 * Parent class that represents a wall on the canvas
 * @param x1 : x coordinate of the first point
 * @param y1 : y coordinate of the first point
 * @param x2 : x coordinate of the second point
 * @param y2 : y coordinate of the second point
 */
class Boundary {
	constructor(x1, y1, x2, y2) {
		this.a = createVector(x1, y1);
		this.b = createVector(x2, y2);
		this.color = [0, 0, 0, 255];
	}

	/**
	 * @param color : color to set
	 * Changes the color
	 */
	setColor(color) {
		this.color = color;
	}

	/**
	 * Called to show the boundary
	 */
	show() {
		stroke(this.color[0], this.color[1], this.color[2], this.color[3]);
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}

	/**
	 * @return : aboslute angle of the boundary
	 * Returns the angle of this boundary
	 */
	angle() {
		let dx = this.b.x - this.a.x;
		let dy = this.b.y - this.a.y;
		let theta = Math.atan2(dy, dx); // range ]-PI, PI]
		theta *= 180 / Math.PI; // rads to degs, range ]-180, 180]
		if (theta < 0) {
			// range [0, 360[
			theta = 360 + theta;
		}
		return theta;
	}

	/**
	 * Called when a ray hits this boundary, to stop the ray
	 */
	castRay() {
		// do nothing
	}
}

/**
 * Class inheriting the class Boundary
 * override the method castRay, allowing a ray to be reflected
 * @param x1 : x coordinate of the first point
 * @param y1 : y coordinate of the first point
 * @param x2 : x coordinate of the second point
 * @param y2 : y coordinate of the second point
 */
class Mirror extends Boundary {
	constructor(x1, y1, x2, y2) {
		super(x1, y1, x2, y2);
		this.color = [255, 255, 255, 255];
	}

	/**
	 * @param point : point where the ray smashes into the mirror
	 * @param ray : ray smashing into the mirror
	 * @return : the new ray reflected
	 * Called when a ray hits this boundary, reflecting the ray, creating a new ray
	 */
	castRay(point, ray) {
		// Get the vector that has the same size and direction as the mirror
		let lineVector = createVector(this.b.x - this.a.x, this.b.y - this.a.y);

		// Calculate the angle of attack of the ray
		let incident = (lineVector.angleBetween(ray.getDir()) * 180) / Math.PI;

		// Calulate the angle of the leaving ray
		let a = this.angle() - incident;
		a = a >= 360 ? a - 360 : a < 0 ? a + 360 : a;

		// Send the new ray back
		return new Ray(point, radians(a), [113, 238, 55, 200]);
	}

	/**
	 * Called to show the boundary
	 */
	show() {
		stroke(this.color[0], this.color[1], this.color[2], this.color[3]);
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
}

/**
 * Class inheriting the class Boundary
 * override the method castRay, allowing a ray to be refracted
 * @param x1 : x coordinate of the first point
 * @param y1 : y coordinate of the first point
 * @param x2 : x coordinate of the second point
 * @param y2 : y coordinate of the second point
 */
class MediumBoundary extends Boundary {
	constructor(x1, y1, x2, y2, medium) {
		super(x1, y1, x2, y2);

		// reference to the medium that contains the boudary
		this.medium = medium;
		this.color = [0, 0, 255, 255];
	}

	/**
	 * @param point : point where the ray smashes into the mirror
	 * @param ray : ray smashing into the mirror
	 * @return : the new ray refraced
	 * Called when a ray hits this boundary, refracting the ray, creating a new ray
	 */
	castRay(point, ray) {
		//Get the vector that has the same size and direction as the boundary
		let boundaryVector = createVector(this.a.x - this.b.x, this.a.y - this.b.y);
		//Find a vector that is 90° from the boundary
		let normalVector1 = createVector(-boundaryVector.y, boundaryVector.x);

		//Get the angle between the ray and the normal vector
		let incident = (normalVector1.angleBetween(ray.getDir()) * 180) / Math.PI;
		//If the angle is not [-90;90] that means we got the wrong normal vector
		if (Math.abs(incident) >= 90) {
			normalVector1 = createVector(boundaryVector.y, -boundaryVector.x);
			incident = (normalVector1.angleBetween(ray.getDir()) * 180) / Math.PI;
		}

		let n1 = 1;
		let n2 = this.medium.diffConst;

		// Check which is n1 and which is n2
		if (boundaryVector.angleBetween(ray.getDir()) < 0) {
			let tmp = n1;
			n1 = n2;
			n2 = tmp;
		}

		let a = degrees(asin((n1 / n2) * sin(radians(incident))));
		//Send the new ray back
		return new Ray(point, normalVector1.heading() + radians(a), [
			this.color[0],
			this.color[1],
			this.color[2],
		]);
	}

	/**
	 * Called to show the boundary
	 */
	show() {
		stroke(this.color[0], this.color[1], this.color[2], this.color[3]);
		line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
}

/**
 * class representing a medium than void
 * @param x : x coordinate of the top-left point
 * @param y : y coordinate of the top-left point
 * @param w : width of the medium
 * @param h : height of the medium
 * @param diffractionConst : constant diffraction value of the medium
 * @param color : color of the medium
 */
class Medium {
	constructor(x, y, w, h, diffractionConst, color = [243, 169, 0, 50]) {
		this.walls = [
			new MediumBoundary(x, y, x, y + h, this), //Top
			new MediumBoundary(x, y + h, x + w, y + h, this), //Right
			new MediumBoundary(x + w, y + h, x + w, y, this), //Bottom
			new MediumBoundary(x + w, y, x, y, this), //Left
		];
		this.diffConst = diffractionConst;
		this.r = color[0];
		this.g = color[1];
		this.b = color[2];
		this.a = color[3];

		for (let w of this.walls) {
			w.setColor(color);
		}
	}

	/**
	 * @return : the walls that makes the medium
	 * Returns the walls that makes the medium
	 */
	getWalls() {
		return this.walls;
	}

	/**
	 * Called to show the boundary
	 */
	show() {
		fill(this.r, this.g, this.b, this.a);
		this.walls[0].show();
		this.walls[1].show();
		this.walls[2].show();
		this.walls[3].show();

		rect(
			this.walls[1].a.x,
			this.walls[1].a.y,
			this.walls[3].a.x - this.walls[1].a.x,
			this.walls[3].a.y - this.walls[1].a.y
		);
	}
}
