document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const restartButton = document.getElementById('restartButton');

    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameRunning = true;

    function drawSnakePart(x, y) {
        ctx.fillStyle = '#00F';
        ctx.fillRect(x * 20, y * 20, 20, 20);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(x * 20, y * 20, 20, 20);
    }

    function drawFood(x, y) {
        ctx.fillStyle = '#F00';
        ctx.fillRect(x * 20, y * 20, 20, 20);
        ctx.strokeStyle = '#FFF';
        ctx.strokeRect(x * 20, y * 20, 20, 20);
    }

    function drawBoundary() {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBoundary();
        snake.forEach(segment => drawSnakePart(segment.x, segment.y));
        drawFood(food.x, food.y);
        scoreDisplay.innerText = `Score: ${score}`;
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            generateNewFood();
            score += 10;
        } else {
            snake.pop();
        }
    }

    function generateNewFood() {
        const maxX = Math.floor(canvas.width / 20);
        const maxY = Math.floor(canvas.height / 20);
        food = {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 || head.y < 0 ||
            head.x >= canvas.width / 20 || head.y >= canvas.height / 20 ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function gameLoop() {
        if (gameRunning) {
            moveSnake();
            if (checkCollision()) {
                alert(`Game Over! Your score is ${score}`);
                gameRunning = false;
                restartButton.style.display = 'block';
                return;
            }
            draw();
            setTimeout(gameLoop, 100); // Adjust speed here (100ms for 0.1 second)
        }
    }

    document.addEventListener('keydown', function(e) {
        if (!gameRunning) return;
        switch(e.keyCode) {
            case 37: // Left Arrow
                if (dx !== 1) { // Prevent moving into opposite direction
                    dx = -1;
                    dy = 0;
                }
                break;
            case 38: // Up Arrow
                if (dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case 39: // Right Arrow
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
            case 40: // Down Arrow
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
        }
    });

    restartButton.addEventListener('click', function() {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        dx = 0;
        dy = 0;
        score = 0;
        gameRunning = true;
        restartButton.style.display = 'none';
        generateNewFood();
        gameLoop();
    });

    generateNewFood();
    gameLoop();
});
