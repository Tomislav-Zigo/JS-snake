//DOM variables

const gameArea = document.querySelector('.game-area')
const score = document.querySelector('.score')
const difficultySwitch = document.querySelector('.difficulty') 
const difficultyIcon = document.querySelector('#difficulty-icon') 
const speedSwitch = document.querySelector('#speed-icon') 
const speedIcon = document.querySelector('#speed-icon') 

var gameAreaHeight = gameArea.getBoundingClientRect().height
var gameAreaWidth = gameArea.getBoundingClientRect().width

//Internal variables

var direction = []
var headX;
var headY;
var running = false;
var gameEnded = false;
var justAte = false;

var board;
var snakeList;

var difficulty = "easy"
var isFast = true

window.addEventListener('resize',()=>{
    updateGameAreaSize()
    initializePosition()
})

difficultySwitch.addEventListener('mousedown',()=>{

    toggleDifficultyIcon() 
    toggleDifficulty()
    initializePosition()

})

speedSwitch.addEventListener('mousedown',()=>{

    toggleSpeedIcon()
    toggleSpeed()  
    initializePosition()

})

document.addEventListener('keydown',(event)=>{

    event.preventDefault()
switch(event.key) {
    
    case "w": case "ArrowUp":
        directionUp()
    break;
    
    case "s": case "ArrowDown":
        directionDown()
    break;
    
    case "a": case "ArrowLeft":
        directionLeft()
    break;
    
    case "d": case "ArrowRight":
        directionRight()
    break;

    case "p":
        pause()
        displayPause()
    break;
    
    case "r":
      restart()
    break;

  }
})

//=================================INTERNAL FUNCTIONS========================================

function directionUp(){
    if(direction[0] === 'd' && snakeList.length>1 || gameEnded){return}
    direction.push("u") 
    running = true
}

function directionDown(){
    if(direction[0] === 'u'&& snakeList.length>1 || gameEnded){return}
    direction.push("d") 
    running = true
}

function directionLeft(){
    if(direction[0] === 'r'&& snakeList.length>1 || gameEnded){return}
    direction.push("l") 
    running = true
}

function directionRight(){
    if(direction[0] === 'l'&& snakeList.length>1 || gameEnded){return}
    direction.push("r") 
    running = true
}

function randomInt(){
    return Math.floor(Math.random()*10)
}

function moveForward(){
    
    if(direction.length>=2){
        direction.shift()
    }

    switch(direction[0]){
        case "u":
            headY--
        break;
        case "d":
            headY++
        break;
        case "l":
            headX--
        break;
        case "r":
            headX++
        break;
    }

    if(difficulty === "hard"){
    if(headY> 9 || headY < 0 || headX > 9 || headX < 0){
        endGame()
        return
    }
    }

    if(difficulty === "easy"){
        if(headY > 9){
            headY = 0
        }

        if(headY < 0){
            headY = 9
        }

        if(headX > 9){
            headX = 0
        }

        if(headX < 0){
            headX = 9
        }
    }

    if(board[headY][headX]==="body"){
        endGame()
        return
    }

    if(board[headY][headX]==="food"){
        eraseFoodPiece()
        board[headY][headX] = "empty"
        justAte = true
    }

    drawSnake(headX,headY)
    board[headY][headX] = 'body'
    snakeList.push({"xValue":headX,"yValue":headY,"lifetime":snakeList.length+1})

    updateBoardAndList()
    updateScoreBoard()
    if(justAte){
        generateFood();
        justAte = false;
    }

}

function endGame(){
    running = false;
    gameEnded = true;
    drawGameOver()
}

function sendTick(){
    if(running===true && isFast){
        moveForward()
    }
}

function sendTickSlow(){
    if(running===true && !isFast){
        moveForward()
    }
}

function generateFood(){

    var foodGenerated = false
    
    while(!foodGenerated){
        x = randomInt()
        y = randomInt()

        if(board[y][x] === "empty"){
            board[y][x] = "food"
            foodGenerated = true
            drawFoodPiece(x,y)
        }
    }


}

function updateBoardAndList(){
    snakeList.forEach((item)=>{
        if(!justAte){
            item.lifetime--
        }
    })


    if(snakeList[0].lifetime<=0){
        var y = snakeList[0].yValue
        var x = snakeList[0].xValue
        board[y][x]='empty'
        eraseSnake(x,y)
        snakeList.shift()
    }
}  

function toggleDifficulty(){
    if(difficulty == "easy"){
        difficulty = "hard";

        
    }else if(difficulty == "hard"){
        difficulty = "easy";

    }
}

function toggleSpeed(){
    if(isFast){
        isFast = false
    }else if(!isFast){
        isFast = true
    }
}

function restart(){
    if(!running){
        initializePosition()
        gameEnded = false;
    }    
}

function pause(){
    running = false;
}

//=========================================DOM FUNCTIONS==========================================

function drawSnake(x,y){
    gameArea.innerHTML +=`<div class = 'snake-piece' id = '${x}${y}' style = '
        left : ${x*gameAreaWidth/10}px;
        top : ${y*gameAreaHeight/10}px;
    '></div>`;
}

function eraseSnake(x,y){
    var removeThisElementId =  x.toString() + y.toString()    
    document.getElementById(removeThisElementId).remove()
}

function updateGameAreaSize(){
    gameAreaHeight = gameArea.getBoundingClientRect().height
    gameAreaWidth = gameArea.getBoundingClientRect().width
}

function drawFoodPiece(x,y){
    gameArea.innerHTML =`<div class = 'food-piece' style = '
    left : ${x*gameAreaWidth/10}px;
    top : ${y*gameAreaHeight/10}px;
    '></div>` + gameArea.innerHTML ; 
}

function eraseFoodPiece(){
    document.querySelector('.food-piece').remove()
}

function drawGameOver(){
    gameArea.innerHTML += `<div class = "game-over" style = "
        top:${0}px;
        left:${0}px;
    ">GAME OVER<br>
      press 'R' to restart</div>`
}

function updateScoreBoard(){
    score.innerHTML = "<b>" + snakeList.length + "</b>"
}

function toggleDifficultyIcon(){
    if(difficulty == "easy"){
        difficultySwitch.style.backgroundColor = "rgb(216, 79, 79)";
        difficultyIcon.src = "icons/skull.png"    
    }else if(difficulty == "hard"){
        difficultySwitch.style.backgroundColor = "rgb(118, 201, 70)";  
        difficultyIcon.src = "icons/door.png"   
    }
}

function toggleSpeedIcon(){
    if(isFast){
        speedIcon.src = "icons/snail.png"    
    }else if(!isFast){
        speedIcon.src = "icons/rabbit.png"
    }
}

function displayPause(){
    score.innerHTML = "<b>PAUSED</b>"  
}

//=======================================FUNCTIONS========================================

function initializePosition(){
    gameArea.innerHTML = ""
    score.innerHTML = '<b>SCORE</b>' 
    direction = []
    snakeList = []
    board = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
        ]

    for(i=0;i<10;i++){
        for(j=0;j<10;j++){
            board[i][j] = "empty"
        }
    }    

    var randomX = randomInt()
    var randomY = randomInt()

    headX = randomX
    headY = randomY



    board[randomY][randomX] = "body"
    snakeList.push({"xValue":randomX,"yValue":randomY,"lifetime":snakeList.length+1})
    drawSnake(randomX,randomY)

    generateFood()

}

initializePosition()

setInterval(()=>{sendTick()},100)
setInterval(()=>{sendTickSlow()},125)