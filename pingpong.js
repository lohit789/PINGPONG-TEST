var KEY = { UP: 38, DOWN: 40, W: 87, S: 83 };
var pressedKeys = [];
var ball = { speed: 3, x: 290, y: 140, directionX: 1, directionY: 1 };
var pauseBall = false;

$(function() {
	// Store in buffer keyboard events
	$(document).keydown(function(e) {
		pressedKeys[e.which] = true;
	});
	$(document).keyup(function(e) {
		pressedKeys[e.which] = false;
	});

	// Set main loop to be called on the desired frame rate
	setInterval(gameLoop, 1000 / 60);
});

// Main loop of the game
function gameLoop() {
	moveBall();
	movePaddles();
}

// Control movement of paddles based on keyboard events
function movePaddles() {
	var paddleSpeed = 5;

	// Check keyboard events
	if (pressedKeys[KEY.W]) {
		// Move the paddle A up
		var top = parseInt($("#paddleA").css("top"));
		if (top >= -parseInt($("#paddleA").css("height"))/2) {
			$("#paddleA").css("top", top - paddleSpeed);
		}
	}
	if (pressedKeys[KEY.S]) {
		// Move the paddle B down
		var top = parseInt($("#paddleA").css("top"));
		if (top <= (parseInt($("#game").css("height")) - (parseInt($("#paddleA").css("height")))/2)) {
			$("#paddleA").css("top", top + paddleSpeed);
		}
	}
	if (pressedKeys[KEY.UP]) {
		// Move the paddle B up
		var top = parseInt($("#paddleB").css("top"));
		if (top >= -parseInt($("#paddleB").css("height"))/2) {
			$("#paddleB").css("top", top - paddleSpeed);
		}
	}
	if (pressedKeys[KEY.DOWN]) {
		// Move the paddle B down
		var top = parseInt($("#paddleB").css("top"));
		if (top <= (parseInt($("#game").css("height")) - (parseInt($("#paddleB").css("height")))/2)) {
			$("#paddleB").css("top", top + paddleSpeed);
		}
	}
}

// Control movement of the ball doing collision checking
function moveBall() {
	var gameWidth = parseInt($("#game").width());
	var gameHeight = parseInt($("#game").height());

	if (pauseBall) return;

	// Check collision to the bottom border and change the moving orientation on Y axis
	if (ball.y + ball.speed * ball.directionY > (gameHeight - parseInt($("#ball").height()))) {
		ball.directionY = -1
	}
	
	// Check collision to the top border and change the moving orientation on Y axis
	if (ball.y + ball.speed * ball.directionY < 0) {
		ball.directionY = 1
	}
	
	// Check collision to the right border and re-initialize ball position
	if (ball.x + ball.speed * ball.directionX > gameWidth ) {
		ball.x = 290;
		ball.y = 140;
		pauseBall = true;
		$("#ball").animate({ "left": ball.x, "top": ball.y }, 2000, function() { pauseBall = false; });
		ball.directionX = -1;
		return;
	}

	// Check collision to the left border and re-initialize ball position
	if (ball.x + ball.speed * ball.directionX < 0) {
		ball.x = 290;
		ball.y = 140;
		pauseBall = true;
		$("#ball").animate({ "left": ball.x, "top": ball.y }, 2000, function() { pauseBall = false; });
		ball.directionX = 1;
		return;
	}

	// Update ball position on X and Y axes based on speed and orientation
	ball.x += ball.speed * ball.directionX;
	ball.y += ball.speed * ball.directionY;

	// Check collision to the paddle A and change the moving orientation on X axis
	var paddleAX = parseInt($("#paddleA").css("left")) + parseInt($("#paddleA").css("width"));
	if (ball.x + ball.speed * ball.directionX < paddleAX) {
		var paddleAYBottom = parseInt($("#paddleA").css("top")) + parseInt($("#paddleA").css("height"));
		var paddleAYTop = parseInt($("#paddleA").css("top"));

		if ((ball.y + ball.speed * ball.directionY <= paddleAYBottom) && (ball.y + ball.speed * ball.directionY >= paddleAYTop)) {
			ball.directionX = 1
		}
	}

	// Check collision to the paddle B and change the moving orientation on X axis
	var paddleBX = parseInt($("#paddleB").css("left")) - parseInt($("#paddleB").css("width"));
	if (ball.x + ball.speed * ball.directionX >= paddleBX) {
		var paddleBYBottom = parseInt($("#paddleB").css("top")) + parseInt($("#paddleB").css("height"));
		var paddleBYTop = parseInt($("#paddleB").css("top"));

		if ((ball.y + ball.speed * ball.directionY <= paddleBYBottom) && (ball.y + ball.speed * ball.directionY >= paddleBYTop)) {
			ball.directionX = -1
		}
	}

	// Render the updated ball position
	$("#ball").css({ "left": ball.x, "top": ball.y });
};