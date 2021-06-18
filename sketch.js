// Meyer Luca, Girardin Jarod, Boegli Lenny, Muller Léon
// Version 20/05

let walls = [];
let ray;
let particle;
let water;
let ruby;

/**
 * Auto called function by p5 librairie to setup the particle and different walls
 */
function setup() {
	// deactivate contextual menu to be able to right click freely
	window.addEventListener("contextmenu", (e) => e.preventDefault());

	// create a canvas
	createCanvas(1000, 700).parent("canvas");
	document.getElementById("slider").style = "width: 1000px;";

	// create external walls
	walls.push(new Boundary(0, 0, width, 0));
	walls.push(new Boundary(0, 0, 0, height));
	walls.push(new Boundary(width, 0, width, height));
	walls.push(new Boundary(0, height, width, height));

	// create random walls
	for (let i = 0; i < 3; i++) {
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);
		walls.push(new Boundary(x1, x2, y1, y2));
	}

	// create random mirror
	for (let i = 0; i < 3; i++) {
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);
		walls.push(new Mirror(x1, x2, y1, y2));
	}

	// create water medium
	water = new Medium(400, 400, 200, 200, 1.33, [42, 241, 249, 152]);
	for (let wall of water.getWalls()) {
		walls.push(wall);
	}

	// create ruby medium
	ruby = new Medium(700, 300, 200, 150, 1.76, [220, 80, 79, 156]);
	for (let wall of ruby.getWalls()) {
		walls.push(wall);
	}

	// create particle
	particle = new Particle();

	changeNbRays();
}

/**
 * Auto called function by p5 librairie to update/redraw the canva
 */
function draw() {
	background(50, 50, 50);

	// update particle on mouse position
	particle.update(mouseX, mouseY);

	// show all the walls
	particle.show();
	for (let w of walls) {
		w.show();
	}

	// show mediums
	water.show();
	ruby.show();

	// generate rays
	particle.look(walls);
}

/**
 * Called on slider value change, to modify number of rays going out from the particle
 */
function changeNbRays() {
	let nbRays = document.getElementById("slider").value;
	particle.createvectors(nbRays);

	let text = "Nombre de rayons: " + nbRays;
	document.getElementById("slider_value").innerText = text;
}

let interval;
let value = 0;

/**
 * @return : default static speed
 */
function defaultStaticSpeed() {
	return 0.1;
}
let staticSpeed = defaultStaticSpeed();

/**
 * Called on mouse pressed, makes the particle rotate
 */
function mousePressed() {
	let spacing = 0.0005;
	if (mouseButton == RIGHT) {
		spacing *= -1;
		staticSpeed *= -1;
	}

	if (document.getElementById("cbx_shouldSpeedUp").checked) {
		interval = setInterval(function () {
			particle.rotate((value += spacing)), 100;
		});
	} else {
		interval = setInterval(function () {
			particle.rotate(staticSpeed), 100;
		});
	}
}

/**
 * Called on mouse released, makes the particle stop rotating
 */
function mouseReleased() {
	value = 0;
	staticSpeed = defaultStaticSpeed();
	clearInterval(interval);
}
