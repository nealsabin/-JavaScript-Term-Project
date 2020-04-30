document.addEventListener("DOMContentLoaded",startGame);
var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;

// function restartGame() {
//     document.getElementById("myfilter").style.display = "none";
//     document.getElementById("myrestartbutton").style.display = "none";
//     myGameArea.stop();
//     myGameArea.clear();
//     myGameArea = {};
//     myGamePiece = {};
//     myObstacles = [];
//     myscore = {};
//     document.getElementById("canvascontainer").innerHTML = "";
//     startGame()
// }

// start game
function startGame() {
    document.getElementById("play").addEventListener("click",function(){
    myGamePiece = new component(70, 37, "media/submarine.png", 10, 230, "image");
    myBackground = new component(720, 480, "media/underwater.jpg", 0, 0, "background");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    document.getElementById("thumbnail").style.display = "none";
    myGameArea.start();
});
}

// setting game area
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 720;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[12]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);

        // checks if key pressed
        window.addEventListener('keydown', function(e){
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e){
            myGameArea.keys[e.keyCode] = false;
        })

        },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

// component position, setting boundaries, crash
function component(width, height, color, x, y, type, rockBottom, hitSurface, sternBoundary) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;   
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "image" || type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
            if(type == "background"){
                ctx.drawImage(this.image, this.x+this.width,this.y,this.width,this.height);
            }
        }  
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitSurface();
        this.rockBottom();
        this.sternBoundary();
        
        if(this.type === "background"){
            if(this.x == -(this.width)){
                this.x = 0;
                this.y = 0;
            }
        }
   
    }
    this.rockBottom = function(){
        rockBottom = 480-37;
        if (this.y >= rockBottom){
            this.y = rockBottom;
        }
    }
    this.hitSurface = function(){
        hitSurface = 0;
        if(this.y <= hitSurface){
            this.y = hitSurface;
        }
    }
    this.sternBoundary = function(){
        sternBoundary = 0;
        if(this.x <= sternBoundary){
            this.x = sternBoundary;
        }
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

// updating game
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            myBackground.update();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();

    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "red", x, 0));
        myObstacles.push(new component(10, x - height - gap, "red", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();    
    myGamePiece.update();

    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
    if(myGameArea.keys && myGameArea.keys[37]){myGamePiece.speedX = -3;} //move left
    if(myGameArea.keys && myGameArea.keys[39]){myGamePiece.speedX = 3;} // move right
    if(myGameArea.keys && myGameArea.keys[38]){myGamePiece.speedY = -3;} // move up
    if(myGameArea.keys && myGameArea.keys[40]){myGamePiece.speedY = 3;} // move down
    myGamePiece.newPos();
    myGamePiece.update();

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

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
