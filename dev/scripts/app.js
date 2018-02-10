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
    smash.playSound('hi-perc-5');
  } else if (e.keyCode === 39) {
    smash.rightKey = true;
    smash.playSound('hi-perc-7');
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
        x : (row * (smash.brickWidth + smash.brickPadding)) + smash.brickOffsetLeft,
        y : (col * (smash.brickHeight + smash.brickPadding)) + smash.brickOffsetTop,
        status : 1
      });
    };
  };
};

smash.drawBricks = function() {
  smash.bricks.forEach(function(brick) {
    if (!brick.status) return;

    smash.context.beginPath();
    smash.context.rect(brick.x, brick.y, smash.brickWidth, smash.brickHeight);
    smash.context.fillStyle = 'white';
    smash.context.fill();
    smash.context.closePath();
  });
};

// SETTLE THE SCORE
smash.score = 0;

smash.drawScore = function() {
  smash.context.font = '16px monospace';
  smash.context.fillStyle = 'white';
  smash.context.fillText('score: ' + smash.score, 10, 20);
}

// YOLO
smash.lives = 3;

smash.drawLives = function() {
  smash.context.font = '16px monospace';
  smash.context.fillStyle = 'white';
  smash.context.fillText('lives: ' + smash.lives, (smash.canvas.width - 90), 20);
}

// BREAK STUFF, WIN PRIZES
smash.crash = function() {
  smash.bricks.forEach(function(brick) {
    if (!brick.status) return;

    smash.brickExists = ((
        (smash.x > brick.x) &&
        (smash.x < (brick.x + smash.brickWidth))
      ) && (
        (smash.y > brick.y) &&
        (smash.y < (brick.y + smash.brickHeight))
      ));

    if (smash.brickExists) {
      smash.reverseY();
      smash.playSound('mid-perc-9');

      brick.status = 0;
      smash.score++;

      if (smash.score === smash.brickRows * smash.brickColumns) {
        smash.playSound('loop-3');
        $('#alert').text('WIN');

        setTimeout(function() {
          document.location.reload();
        }, 1000);
      };
    };
  });
};

smash.playSound = function(sound) {
  smash.sound = $(`audio[id="${sound}"]`);
  smash.sound[0].currentTime = 0;
  smash.sound[0].play();
};

// ACTION!
smash.draw = function() {

  // CLEAR CANVAS
  smash.context.clearRect(0, 0, smash.canvas.width, smash.canvas.height);

  // DRAW IT OUT
  smash.drawBricks();
  smash.drawBall();
  smash.drawPaddle();
  smash.drawLives();
  smash.drawScore();
  smash.crash();

  // WALLBALL
  if (smash.hitX()) {
    smash.reverseX();
    smash.playSound('hi-perc-2');
  };
  if (smash.hitPaddle()) {
    smash.reverseY();
    smash.playSound('kick-5');
  };
  if (smash.hitTheRoof()) {
    smash.reverseY();
    smash.playSound('hi-perc-2');
  } else if (smash.hitTheFloor()) {
    smash.playSound('mid-perc-8');
    smash.lives--;
    if (!smash.lives) {
      smash.lives = '💀';

      $('#alert').text('lose');

      setTimeout(function() {
        document.location.reload();
      }, 1000);
    } else {
      smash.default();
    };
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
