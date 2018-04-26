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
    $('body').css('background-color', color);
    $('body').css('color', '#fff');
    $('section').children().css('color', color);
    $('section').children().css('border', 'none');
    if (color == 'rgb(255, 255, 255)'){
      $('body').css('color', 'rgb(0,0,0)');
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
        console.log(endGame);
        if(endGame == false) setTimeout(function(){robot();}, 1000);

      }
    });

  //FUNCTIONS
  //MAIN AI
  function robot(){
    let robotChar = 'X'
    if(character == 'X') robotChar = 'O';

    let robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
    robotArr.push(targets.splice(targets.indexOf(robotChoice), 1)[0]);
    $('#'+robotChoice).text(robotChar);

    //display "your turn!"
    $('#opponent').delay(300).css('display', 'none');
    $('#your').hide().fadeIn(300).css('display', 'block');

    victoryCheck(robotArr, victoryArr, targets);
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
        for(let i of playerArray){
          if(i==h) count++;}
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




