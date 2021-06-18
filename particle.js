// Meyer Luca, Girardin Jarod, Boegli Lenny, Muller Léon
// Version 20/05

/**
 * A particle
 * Represents a source for rays that will be cast and considered in the simulation.
 */
class Particle {
	constructor() {
		this.pos = createVector(width / 2, height / 2);
		this.rays = [];
	}

	/**
	 * @param n : number of rays to be created
	 * Create the array that will contain all n rays emanating from our particle
	 */
	createvectors(n) {
		this.rays = [];
		for (let i = 0; i < n; i += 1) {
			this.rays.push(
				new Ray(this.pos, radians((360 / n) * i), [255, 255, 255, 150])
			);
		}
	}

	/**
	 * @param x : x position
	 * @param y : y position
	 * Update the particle position
	 */
	update(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	}

	/**
	 * @param angle : angle (in degree) the rays have to rotate
	 * Rotate all rays by the specified angle in degrees
	 * */
	rotate(angle) {
		for (let ray of this.rays) {
			ray.rotate(ray.getAngle() + radians(angle));
		}
	}

	/**
	 * @param walls : all the boundary to check
	 * Attempts to cast all the rays emanating from the particle to all boundaries present and stop there. If the boundary reflects or refracts, spawn a new ray from the impact point.
	 */
	look(walls) {
		for (let ray of this.rays) {
			let closestWall = null;
			let closest = null;
			let record = Infinity;
			for (let wall of walls) {
				const pt = ray.cast(wall);
				if (pt) {
					const d = p5.Vector.dist(this.pos, pt);
					if (d < record) {
						record = d;
						closest = pt;
						closestWall = wall;
					}
				}
			}
			if (closest) {
				stroke(ray.getColor());
				line(this.pos.x, this.pos.y, closest.x, closest.y);

				let rRay = closestWall.castRay(closest, ray); // the wall's castRay method is not the same as the one in this class
				if (rRay) {
					this.castRay(rRay, walls, closestWall, 10);
				}
			}
		}
	}

	/**
	 * @param ray : a new ray to cast
	 * @param walls : all the boundary to check
	 * @param wallFrom : the wall the ray comes from
	 * @param life : the remaining life of the ray
	 * Handle a ray that was spawned from a reflection or refraction. The life argument defines how many times it can still reflect or refract. Called recursively
	 */
	castRay(ray, walls, wallFrom, life) {
		if (life <= 0) {
			return;
		}
		let rayStartPos = ray.getPos();
		let closestWall = null;
		let closest = null;
		let record = Infinity;
		for (let wall of walls) {
			if (wall == wallFrom) {
				continue;
			}
			const pt = ray.cast(wall);
			if (pt) {
				const d = p5.Vector.dist(rayStartPos, pt);
				if (d < record) {
					record = d;
					closest = pt;
					closestWall = wall;
				}
			}
		}
		if (closest) {
			stroke(ray.getColor());
			line(rayStartPos.x, rayStartPos.y, closest.x, closest.y);

			let rRay = closestWall.castRay(closest, ray); // the wall's castRay method is not the same as this one
			if (rRay) {
				this.castRay(rRay, walls, closestWall, life - 1);
			}
		}
	}

	/**
	 * Displays a small circle at the particle position as well as all of the rays that emanate from it
	 */
	show() {
		fill(0);
		ellipse(this.pos.x, this.pos.y, 4);
		for (let ray of this.rays) {
			ray.show();
		}
	}
}
