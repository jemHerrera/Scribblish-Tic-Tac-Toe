$('document').ready(function(){

  //GLOBAL VARIABLES
  let character = '';
  let victoryArr = [
    ['1','2','3'],
    ['4','5','6'],
    ['7','8','9'],
    ['1','4','7'],
    ['2','5','8'],
    ['3','6','9'],
    ['1','5','9'],
    ['3','5','7']
  ];
  let targets = ['1','2','3','4','5','6','7','8','9'];
  let playerArr = [];
  let robotArr = [];
  let gameCount = 0;
  let endGame = false;

  // CHANGE COLOR EVENT
  $('.colors').on('click', function(event){
    let color = $(event.target).css('background-color');
    $(':root').css('--theme-color', color);
    $(':root').css('--text-color', '#ffffff');
    $('section').children().css('border', 'none');
    if (color == 'rgb(255, 255, 255)'){
      $(':root').css('--text-color', 'rgb(0,0,0)');
      $('section').children().css('color', 'rgb(0,0,0)');
      $('section').children().css('border', '1px solid #000');
    }
  });
  // CHOOSING WHETHER X OR O
  $('.char').on('mouseover', function(char){
    $('.char').css('opacity', '0.5');
    $(char.target).css('opacity','1');
  });
  $('.char').on('mouseout', function(char){
    $('.char').css('opacity', '1');
  });
  $('.char').on('click', function(char){
    character = $(char.target).text();
    $('.xo').css('display', 'none');
    $('section').css('display', 'grid');
    $('#your').hide().fadeIn(300).css('display', 'block');
  });

  //MAIN LOGIC SEQUENCE
    $('section').on('click', function(event){

      //check if the spot is not yet occupied
      let id = event.target.id;
      if(targets.indexOf(id) != -1 && playerArr.length <= robotArr.length && your.style.display == 'block'){

        //display "opponents turn!"
        $('#your').css('display', 'none');
        $('#opponent').hide().fadeIn(300).css('display', 'block');

        //display X or O
        let block = $(event.target);
        block.text(character);
        playerArr.push(targets.splice(targets.indexOf(id), 1)[0]);
        victoryCheck(playerArr, victoryArr, targets);

        //robot moves
        if(endGame == false) setTimeout(function(){robot();}, 1000);

      }
    });

  //FUNCTIONS
  //MAIN AI
  function robot(){
    let robotChar = 'X'
    if(character == 'X') robotChar = 'O';

    //smart robot choices
    let robotChoice = '';
    //if beginning of the match, take middle or edges randomly
    if(robotArr.length == 0){
      while(['2','4','6','8',''].indexOf(robotChoice)!= -1){
        robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
      }
      //if player's turn first, and player did not choose middle, choose middle
      if(playerArr.length == 1 && playerArr[0] !=5) robotChoice = '5';
    }

    //if in the middle of the match
    else{
      //check if robot has 2 consecutive, and finish if necessary
      robotChoice = complete(robotArr, victoryArr, targets);
      //check if player has 2 consecutive, and deny the player victory
      if(!robotChoice) {
        robotChoice = complete(playerArr, victoryArr, targets);
      }
      //if there are no 2 consecutives, pick a spot at random
      if(!robotChoice){
          robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
      }
    }

    robotArr.push(targets.splice(targets.indexOf(robotChoice), 1)[0]);
    $('#'+robotChoice).text(robotChar);

    //display "your turn!"
    $('#opponent').delay(300).css('display', 'none');
    $('#your').hide().fadeIn(300).css('display', 'block');

    victoryCheck(robotArr, victoryArr, targets);
  }

  //SMART AI FUNCTION
  function complete(playerArray, victoryArray, targets){
    for(let element of victoryArray){
      let count = 0;
      element.forEach(h => {
        for(let i of playerArray){if(i==h) count++;}
      });
      if (count == 2){
        for(let j of element){
          if(playerArray.indexOf(j) == -1 && targets.indexOf(j) != -1)return j;
        }
      }
    }
  }

  //VICTORY CHECK FUNCTION
  function victoryCheck(playerArray, victoryArray, targets){
    if(targets.length == 0) {
      $('h2').css('display', 'none');
      $('#draw').hide().fadeIn(300).css('display', 'block');
      reset();
    }
    for(let element of victoryArray){
      let count = 0;
      element.forEach(h => {
        for(let i of playerArray){if(i==h) count++;}
      });
      if (count == 3){
        $('h2').css('display', 'none');
        $('#defeat').hide().fadeIn(300).css('display', 'block');
        reset();
      }
    }
  }
  //RESET FUNCTION
  function reset(){
    endGame = true;
    gameCount++;
    setTimeout(function(){
      $('section').children().text('')
      playerArr = [];
      robotArr = [];
      targets = ['1','2','3','4','5','6','7','8','9'];
      $('h2').css('display', 'none');
      if(gameCount%2 != 0){
        $('#opponent').hide().fadeIn(300).css('display', 'block');
        setTimeout(function(){robot();}, 1000);
      }
      else $('#your').hide().fadeIn(300).css('display', 'block');
      endGame = false;
    },3000);
  }
});




