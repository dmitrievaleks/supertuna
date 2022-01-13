let canvas = document.querySelector('.canvas')
let ctx = canvas.getContext('2d')
let menu = document.querySelector('.menu')
let NG = document.querySelector('.newGame')
let RG = document.querySelector('.resumeGame')
let EX = document.querySelector('.exit')
let POINT = document.querySelector('.point')
let LVL = document.querySelector('.lvl')

let cell = 50
let step = cell
let speed = 100
let points = 0
let level = 1

var jin = new Image()
jin.src = 'jin.png'
var crab = new Image()
crab.src = 'crab.png'
var tuna = new Image()
tuna.src = 'tuna.png'
var backG1 = new Image()
backG1.src = 'frame1.png'
var backG2 = new Image()
backG2.src = 'frame2.png'
var backG3 = new Image()
backG3.src = 'frame3.png'
var backG4 = new Image()
backG4.src = 'frame4.png'
var backG5 = new Image()
backG5.src = 'frame5.png'

let backG = backG1
let character = {
    x: 0,
    y: 0
}
let bonus = {
    x: Math.floor(Math.random()*10)*cell,
    y: Math.floor(Math.random()*10)*cell
}
let enemy1 = {
    x: canvas.width-cell,
    y: canvas.height-cell
}
let enemy2 = {
    x: canvas.width-cell,
    y: 0
}

function nextLevel(){
    POINT.innerHTML = `POINTS: ${points}`
    LVL.innerHTML = `LEVEL : ${level}`
    character = {
        x: 0,
        y: 0
    }
    enemy1 = {
        x: canvas.width-cell,
        y: canvas.height-cell
    }
    enemy2 = {
        x: canvas.width-cell,
        y: 0
    }
    switch (level){
        case 2:
            backG = backG2
            break
        case 3:
            backG = backG3
            break
        case 4:
            backG = backG4
            break
        case 5:
            backG = backG5
            break
    }
}

function stopHere(x,y){
    var myImageData = ctx.getImageData(x, y, cell, cell)
    var pixel = myImageData.data;
    for (var i = 0; i < pixel.length; i += 4){
        var red = myImageData.data[i];
        var green = myImageData.data[i+1];
        var blue = myImageData.data[i+2];
        if (red == 0 && green == 0 && blue == 0) {
            return true
        }
    }
    return false
}

function bonusCheck(){
    if (stopHere(bonus.x,bonus.y)){
        bonus = {
            x: Math.floor(Math.random()*10)*cell,
            y: Math.floor(Math.random()*10)*cell
        }
        bonusCheck()
    }
}

function walk(vector, object){
    if(vector == 'KeyW'){
        object.y -= step
        if(stopHere(object.x,object.y)==true){
            object.y += step}
    }
    if(vector == 'KeyS'){
        object.y += step
        if(stopHere(object.x, object.y)==true){
            object.y -= step}
    }
    if(vector == 'KeyA'){
        object.x -= step
        if(stopHere(object.x, object.y)==true){
            object.x += step}
    }
    if(vector == 'KeyD'){
        object.x += step
        if(stopHere(object.x, object.y)==true){
            object.x -= step}
    }
    return {x: object.x, y: object.y}
}

document.addEventListener('keydown', function(e){
    character = walk(e.code,character)
})

function enemyGoing(enemy){
    let vector
    switch (index=Math.floor(Math.random() * 4)){
        case 0:
            vector='KeyW'
            break
        case 1:
            vector='KeyA'
            break
        case 2:
            vector='KeyS'
            break
        case 3:
            vector='KeyD'
            break
    }
    enemy = walk(vector,enemy)
}

function death(x,y){
    var myImageData = ctx.getImageData(x, y, cell, cell)
    var pixel = myImageData.data;
    for (var i = 0; i < pixel.length; i += 4){
        var red = myImageData.data[i];
        var green = myImageData.data[i+1];
        var blue = myImageData.data[i+2];
        if (red == 255 && green == 0 && blue == 0) {
            return true
        }
    }
    return false
}

function callMenu(){
    clearTimeout(timerId)
    menu.style.display = "block"
}
document.addEventListener('keydown',function(e){
    if (e.key == 'Escape') callMenu()
})
NG.addEventListener('click', function(){
    location.reload()
})
RG.addEventListener('click', function(){
    menu.style.display = "none"
    gameStart()
})
EX.addEventListener('click', function(){
    window.close()
})

function gameStart(){
timerId = setTimeout(function game(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    //ctx.fillStyle = "aqua"
    //ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.drawImage(backG, 0, 0)

    bonusCheck()
    //ctx.fillStyle = "blue"
    //ctx.fillRect(bonus.x, bonus.y, cell, cell)
    ctx.drawImage(tuna, bonus.x, bonus.y, cell, cell)

    //ctx.fillStyle = "green"
    //ctx.fillRect(character.x, character.y, cell, cell)
    ctx.drawImage(jin, character.x, character.y, cell, cell)
    
    enemyGoing(enemy1)
    //ctx.fillStyle = "red"
    //ctx.fillRect(enemy1.x, enemy1.y, cell, cell)
    ctx.drawImage(crab, enemy1.x, enemy1.y, cell, cell)

    enemyGoing(enemy2)
    //ctx.fillStyle = "red"
    //ctx.fillRect(enemy2.x, enemy2.y, cell, cell)
    ctx.drawImage(crab, enemy2.x, enemy2.y, cell, cell)

    if (character.x==bonus.x && character.y==bonus.y){
        points += 10
        bonus = {
            x: Math.floor(Math.random()*40)*cell,
            y: Math.floor(Math.random()*40)*cell
        }
        POINT.innerHTML = `POINTS: ${points}`
    }

    if (death(character.x,character.y)){
        alert("GAME OVER")
        location.reload()
    }
    
    if (points==20&&level==1){
        level += 1
        nextLevel()
    } else if (points==40&&level==2) {
        level += 1
        nextLevel()
    } else if (points==60&&level==3) {
        level += 1
        nextLevel()
    } else if (points==80&&level==4) {
        level += 1
        nextLevel()
    } else if (points==100) {
        alert("YOU WIN!!")
        location.reload()
    }

    timerId = setTimeout(game, speed)
}, speed)}
gameStart()