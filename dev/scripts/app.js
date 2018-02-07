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

smash.paddleX = undefined;

smash.leftKey = false;
smash.rightKey = false;

smash.default = function() {
  smash.x = smash.canvas.width / 2;
  smash.y = smash.canvas.height - 30;
  smash.dx = 2;
  smash.dy = -2;
  smash.paddleX = (smash.canvas.width - smash.paddleWidth) / 2;
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

// CREATE PADDLE
smash.paddleHeight = 10;
smash.paddleWidth = 75;

smash.drawPaddle = function() {
  smash.context.beginPath();
  smash.context.rect(smash.paddleX, (smash.canvas.height - smash.paddleHeight), smash.paddleWidth, smash.paddleHeight);
  smash.context.fillStyle = 'white';
  smash.context.fill();
  smash.context.closePath();
}

// BOUNCE OFF THE WALLS
smash.reverseX = function() {
  return smash.dx = -smash.dx;
};
smash.reverseY = function() {
  return smash.dy = -smash.dy;
};

smash.hitY = function() {
  return (smash.y + smash.dy) < smash.ballRadius || (smash.y + smash.dy) > (smash.canvas.height - smash.ballRadius);
};
smash.hitX = function() {
  return (smash.x + smash.dx) < smash.ballRadius || (smash.x + smash.dx) > (smash.canvas.width - smash.ballRadius);
};

// MOVE IT BACK AND FORTH
$(document).on('keydown', function(e) {
  if (e.keyCode === 37) {
    smash.leftKey = true;
  }
  else if (e.keyCode === 39) {
    smash.rightKey = true;
  }
});
$(document).on('keyup', function(e) {
  if (e.keyCode === 37) {
    smash.leftKey = false;
  }
  else if (e.keyCode === 39) {
    smash.rightKey = false;
  }
});

smash.marginLeft = function() {
  return smash.paddleX > 0;
};
smash.marginRight = function() {
  return smash.paddleX < (smash.canvas.width - smash.paddleWidth);
};

smash.moveLeft = function() {
  return smash.paddleX -= 7;
};
smash.moveRight = function() {
  return smash.paddleX += 7;
};

// ACTION!
smash.draw = function() {

  // CLEAR CANVAS
  smash.context.clearRect(0, 0, smash.canvas.width, smash.canvas.height);

  // DRAW IT OUT
  smash.drawBall();
  smash.drawPaddle();

  // WALLBALL
  if (smash.hitX()) {
    smash.reverseX();
  };
  if (smash.hitY()) {
    smash.reverseY();
  };

  // ELECTRIC SLIDE
  if (smash.leftKey && smash.marginLeft()) {
    smash.moveLeft();
  };
  if (smash.rightKey && smash.marginRight()) {
    smash.moveRight();
  };

  // POSITION += NEW POSITION
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
