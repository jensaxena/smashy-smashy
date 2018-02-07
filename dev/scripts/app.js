// NAMESPACE
const smash = {};

// CREATE & ACCESS CANVAS
smash.canvas = document.getElementById('canvas');
smash.context = smash.canvas.getContext('2d');

// SET & RESET DEFAULT GAME STATE
smash.x = undefined;
smash.y = undefined;

smash.dx = undefined;
smash.dy = undefined;

smash.default = function() {
  smash.x = smash.canvas.width / 2;
  smash.y = smash.canvas.height - 30;
  smash.dx = 2;
  smash.dy = -2;
};

// CREATE BALL
smash.ballRadius = 10;

smash.drawBall = function() {
  smash.context.beginPath();
  smash.context.arc(smash.x, smash.y, smash.ballRadius, 0, Math.PI * 2);
  smash.context.fillStyle = 'white';
  smash.context.fill();
  smash.context.closePath();
};

// ACTION!
smash.draw = function() {

  // CLEAR CANVAS
  smash.context.clearRect(0, 0, smash.canvas.width, smash.canvas.height);

  smash.drawBall();

  // MOVE
  smash.x += smash.dx;
  smash.y += smash.dy;

  requestAnimationFrame(smash.draw);
};

// INIT
smash.init = function() {
  smash.default();
  smash.draw();
};

// DOCREADY
$(smash.init);
