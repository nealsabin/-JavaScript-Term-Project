$(function() {
    var animation;

    //dom objects to variables
    var container = $('#container');
    var mower = $('#mower');
    var grass = $('#grass');
    var rock1 = $('#rock1');
    var rock2 = $('#rock2');
    var rock3 = $('#rock3');
    var rock4 = $('#rock4');
    var grass1 = $('#grass1');
    var grass2 = $('#grass2');
    var grass3 = $('#grass3');
    var grass4 = $('#grass4');
    var restartDiv = $('#restartDiv');
    var restartButton = $('#restart');
    var score = $('#score');
    var highScore = localStorage.getItem('highScore');
    $('#highScore').text(highScore);

    //some setup
    var container_left = parseInt(container.css('left'));
    var containerWidth = parseInt(container.width());
    var containerHeight = parseInt(container.height());
    var mowerWidth = parseInt(mower.width());
    var mowerHeight = parseInt(mower.height());
    // var grass_width = parseInt(grass.width());
    // var grass_height = parseInt(grass.height());

    // game not over to start
    var gameOver = false

    var scoreCounter = 1;

    // speed variables
    var speed = 2;
    var grassSpeed = 3;

    // mower stationary to start
    var move_right = false;
    var move_left = false;
    var move_up = false;
    var move_down = false;
    
    // Move the mower
    $(document).on('keydown', function(e){
        if(gameOver === false){
            var key = e.keyCode;
            if(key === 37 && move_left === false){
                move_left = requestAnimationFrame(left);
            }else if(key === 39 && move_right === false){
                move_right = requestAnimationFrame(right);
            }else if(key === 38 && move_up === false){
                move_up = requestAnimationFrame(up);
            }else if(key === 40 && move_down === false){
                move_down = requestAnimationFrame(down);
            }
        }
    });

    // stoping the mower when the key is released
    $(document).on('keyup', function(e){
        if(gameOver === false){
            var key = e.keyCode;
            if(key === 37){
                cancelAnimationFrame(move_left);
                move_left = false;
            }else if(key === 39){
                cancelAnimationFrame(move_right);
                move_right = false;
            }else if(key === 38){
                cancelAnimationFrame(move_up);
                move_up = false;
            }else if(key === 40){
                cancelAnimationFrame(move_down);
                move_down = false;
            }

        }
    });

    // move mower left, not beyond container
    function left(){
        if(gameOver === false && parseInt(mower.css('left'))>0){
            mower.css('left', parseInt(mower.css('left')) -5);
            move_left = requestAnimationFrame(left);
        }
    }

    // move mower right, not beyond container
    function right(){
        if(gameOver === false && parseInt(mower.css('left')) < containerWidth - mowerWidth){
            mower.css('left', parseInt(mower.css('left')) +5);
            move_right = requestAnimationFrame(right);
        }
    }

    // move mower up, not beyond container
    function up(){
        if(gameOver === false && parseInt(mower.css('top')) > 0){
            mower.css('top', parseInt(mower.css('top')) -3);
            move_up = requestAnimationFrame(up);
        }
    }

    // move mower down, not beyond container
    function down(){
        if(gameOver === false && parseInt(mower.css('top')) < containerHeight - mowerHeight){
            mower.css('top', parseInt(mower.css('top')) +3);
            move_down = requestAnimationFrame(down);
        }
    }

    animation = requestAnimationFrame(repeat);

    function repeat(){
        if(gameOver === false){

            // hit with rocks, end game
            if(hit(mower, rock1) || hit(mower, rock2) || hit(mower, rock3) || hit(mower, rock4)){
                $('audio#crash')[0].play()
                stop_the_game();
                return;
            }

            // hit with grass, increase score
            if(hit(mower, grass1) || hit(mower,grass2) || hit(mower, grass3) || hit(mower,grass4)){
                score.text(parseInt(score.text()) + 1);
                $('audio#beep')[0].play()
            }

            // increase score
            scoreCounter++;

            // increase score as you progress
            if(scoreCounter % 50 == 0){
                score.text(parseInt(score.text()) +1);
            }

            // increase speed based off score
            if(scoreCounter % 200 == 0){
                speed++;
                grassSpeed++;
            }

            rock_down(rock1);
            rock_down(rock2);
            rock_down(rock3);
            rock_down(rock4);

            grass_down(grass1);
            grass_down(grass2);
            grass_down(grass3);
            grass_down(grass4);

            animation = requestAnimationFrame(repeat);
        }
    }

    // move the rocks down the screen
    function rock_down(mower){
        var current_top = parseInt(mower.css('top'));
        if(current_top > containerHeight){
            current_top = -200;
            var mower_left = parseInt(Math.random() *(containerWidth - mowerWidth));
            mower.css('left', mower_left);
        }
        mower.css('top', current_top + speed);
    }

    // move the grass down the screen
    function grass_down(grass){
        var grass_top = parseInt(grass.css('top'));
        if(grass_top > containerHeight){
            grass_top = -200;
            var grass_left = parseInt(Math.random() *(containerWidth - 40));
            grass.css('left', grass_left);
        }
        grass.css('top', grass_top + grassSpeed);
    }

    // restart button
    restartButton.click(function() {
        location.reload();
    });     

    // stop the game, restart button appears
    function stop_the_game(){
        gameOver = true;
        cancelAnimationFrame(animation);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
        restartDiv.slideDown();
        restartButton.focus();
        setHighScore();
    }
    
    // saves highscore to local storage
    function setHighScore() {
        if(highScore < parseInt(score.text())){
            highScore = parseInt(score.text());
            localStorage.setItem('highScore',parseInt(score.text()));
        }
        $('#highScore').text(highScore);
        
    }

    // hit function
    function hit($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

});

// Read Me
// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("create");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}