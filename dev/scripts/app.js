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
};

// BOUNCE OFF THE WALLS
smash.reverseX = function() {
  return smash.dx = -smash.dx;
};
smash.reverseY = function() {
  return smash.dy = -smash.dy;
};

smash.hitX = function() {
  return ((smash.x + smash.dx) < smash.ballRadius) || ((smash.x + smash.dx) > (smash.canvas.width - smash.ballRadius));
};

smash.hitTheRoof = function() {
  return (smash.y + smash.dy) < smash.ballRadius;
};
smash.hitTheFloor = function() {
  return (smash.y + smash.dy) > (smash.canvas.height - smash.ballRadius);
};

smash.overPaddle = function() {
  return (smash.x > smash.paddleX) && (smash.x < (smash.paddleX + smash.paddleWidth));
};
smash.hitPaddle = function() {
  return smash.overPaddle() && smash.hitTheFloor();
};

// MOVE BACK AND FORTH
$(document).on('keydown', function(e) {
  if (e.keyCode === 37) {
    smash.leftKey = true;
  } else if (e.keyCode === 39) {
    smash.rightKey = true;
  };
});
$(document).on('keyup', function(e) {
  if (e.keyCode === 37) {
    smash.leftKey = false;
  } else if (e.keyCode === 39) {
    smash.rightKey = false;
  };
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

// BRICK IT
smash.brickRows = 5;
smash.brickColumns = 3;
smash.brickWidth = 75;
smash.brickHeight = 20;
smash.brickPadding = 10;
smash.brickOffsetTop = 30;
smash.brickOffsetLeft = 30;

smash.bricks = [];

smash.brickLayer = function() {
  for (let col = 0; col < smash.brickColumns; col++) {
    for (let row = 0; row < smash.brickRows; row++) {
      smash.bricks.push({
        brickX : (row * (smash.brickWidth + smash.brickPadding)) + smash.brickOffsetLeft,
        brickY : (col * (smash.brickHeight + smash.brickPadding)) + smash.brickOffsetTop,
        status : 1
      });
    };
  };
};

smash.drawBricks = function() {
  smash.bricks.forEach(function(brick) {
    if (!brick.status) return;

    smash.context.beginPath();
    smash.context.rect(brick.brickX, brick.brickY, smash.brickWidth, smash.brickHeight);
    smash.context.fillStyle = 'white';
    smash.context.fill();
    smash.context.closePath();
  });
};

// ACTION!
smash.draw = function() {

  // CLEAR CANVAS
  smash.context.clearRect(0, 0, smash.canvas.width, smash.canvas.height);

  // DRAW IT OUT
  smash.drawBricks();
  smash.drawBall();
  smash.drawPaddle();

  // WALLBALL
  if (smash.hitX()) {
    smash.reverseX();
  };
  if (smash.hitTheRoof() || smash.hitPaddle()) {
    smash.reverseY();
  } else if (smash.hitTheFloor()) {
    $('#alert').text('lose');
    setTimeout(function() {
      document.location.reload();
    }, 1000);
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
  smash.brickLayer();
  smash.default();
  smash.draw();
};

// DOCREADY
$(smash.init);
