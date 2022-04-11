//Constantes que declaran si el juego esta corriendo y si perdio eljugador
const STATE_RUNNING= 1;
const STATE_LOSING = 2;

//DESPLAZAMIENTO DE LA SERPIENTE EN MS
const TICK = 80;
const SQUARE_SIZE = 10; //TAMAÑO DE LOS CUADROS QUE SE VANA DIBUJAR EN EL AREA
//ESPACIO DEL TABLERO
const BOARD_WIDTH = 50;
const BOARD_HEIGHT = 50;
//CRECIMIENTO DE LA SERPIENTE CADA VEZ QUE SE ALIMENTA
const GROW_SCALE = 1;
//TECLAS DE DIRECCION DEL JUEGO
const DIRECTIONS_MAPS = {
  'A': [-1, 0],
  'D': [1, 0],
  'S': [0, 1],
  'W': [0, -1],
  'a': [-1, 0],
  'd': [1, 0],
  's': [0, 1],
  'w': [0, -1],
}

  //VARIABLES DE ESTADO DEL juego
  let score = 0;

  let state = {
    canvas: null,
    context : null,
    snake: [{x:0, y:0}],
    direction: {x:1 , y:0},
    prey: {x:0 , y:0},
    growing: 0,
    runState : STATE_RUNNING,
  };




  //Esta funcion nos va a devolver valores aleatorios de X e Y
  function randomXY(){
    return{
      x: parseInt(Math.random() * BOARD_WIDTH), //SE MULTIPLICA UN NUMERO ALEATORIO POR EL ANCHO
      y: parseInt(Math.random() * BOARD_HEIGHT)//SE MULTIPLICA UN NUMERO ALEATORIO POR EL ALTO

    }
  }

  function tick(){

    document.getElementById('h3Restante').innerText = score 
  /*document.getElementById('h3Mejor').innerText = bestScore*/
    
    const headS = state.snake[0];
    const dx = state.direction.x;
    const dy = state.direction.y;
    const highestIndex = state.snake.length-1;
    let tail = {};
    let interval = TICK;

    Object.assign(tail,state.snake[state.snake.length -1]);

   let didScore = (
      headS.x === state.prey.x && headS.y === state.prey.y
    );

    //DESPLAZAMIENTO DE LA SERPIENTE
    if(state.runState === STATE_RUNNING){
      for( let idx = highestIndex; idx > -1; idx--){
        const sq = state.snake[idx];
        if(idx === 0){
          sq.x += dx;
          sq.y += dy;
        }else{
          sq.x = state.snake[idx-1].x;
          sq.y = state.snake[idx-1].y;

        }
      }
    }else if(state.runState === STATE_LOSING){
      interval = 10;

      if(state.snake.length > 0){
        state.snake.splice(0,1)
      }

      if(state.snake.length === 0){
        state.runState = STATE_RUNNING;
        state.snake.push(randomXY());
        state.prey = randomXY();
      }
    }

    if(detectCollision()){
      state.runState = STATE_LOSING;
      state.growing = 0;
      score = 0;
    }

    if(didScore){
    //CRECIMIENTO DE LA SERPIENTE
     state.growing += GROW_SCALE;
      state.prey = randomXY();
      score++;
      
    }


  
    //CRECIMIENTO DE LA SERPIENTE

    if(state.growing > 0){
      state.snake.push(tail);
      state.growing-=1;
    
    }

    requestAnimationFrame(draw);
    setTimeout(tick, interval);

  }

  function detectCollision(){
    const head = state.snake[0];
    if(head.x <0
      || head.x >= BOARD_WIDTH
      || head.y >= BOARD_HEIGHT
      || head.y < 0){
        return true;
      }

      for(var idx = 1; idx < state.snake.length; idx++){
        const sq = state.snake[idx];

        if(sq.x === head.x && sq.y === head.y){
          return true;
        }
      }
      score= score;
      return false;
  }
  //DIBUJAMOS A LA PRESA Y A LA SERPIENTE
  function draw(){
    state.context.clearRect(0 ,0 , 500 , 500);

    for(var idx = 0; idx< state.snake.length; idx++){
      const{x,y} = state.snake[idx];
      drawPixel('#22dd22', x, y)
    }
    const{x,y} = state.prey;
    drawPixel('yellow', x, y)

  }
//DIBUJAMOS UN PIXEL PARA PODER LOGRAR DIBUJAR AL RESTO DE PERSONAJES
  function drawPixel(color, x, y){
    state.context.fillStyle = color;
    state.context.fillRect(
      x * SQUARE_SIZE,
      y* SQUARE_SIZE,
      SQUARE_SIZE,
      SQUARE_SIZE
    )
  }
  window.onload = function(){
    state.canvas = document.querySelector('canvas');
    state.context = state.canvas.getContext('2d');

    window.onkeydown = function(e){
      const direction = DIRECTIONS_MAPS[e.key]

      if(direction){
        const[x,y] = direction;
        if(-x !== state.direction.x 
          && -y !== state.direction.y){
          state.direction.x = x;
          state.direction.y = y;
        }
      }
    }
    tick();
  }
