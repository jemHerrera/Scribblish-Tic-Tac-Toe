$('document').ready(function(){
  $('body').hide().fadeIn(2000);
  //GLOBAL VARIABLES
  let character = '',
  victoryArr = [
    ['1','2','3'],
    ['4','5','-4'],
    ['-3','-2','-1'],
    ['1','4','-3'],
    ['2','5','-2'],
    ['3','6','-1'],
    ['1','5','-1'],
    ['3','5','-3']
  ],
  targets = ['1','2','3','4','5','-4','-3','-2','-1'],
  playerArr = [],
  robotArr = [],
  gameCount = 0,
  endGame = false;

  // CHOOSING WHETHER X OR O
  $('.char').on('mouseover', function(char){
    $('.char').css('opacity', '0.2');
    $(char.target).css('opacity','1');
  });
  $('.char').on('mouseout', function(char){
    $('.char').css('opacity', '1');
  });
  $('.char').on('click', function(char){
    character = $(char.target).text();
    $('.xo').css('display', 'none');
    $('section').css('display', 'grid').hide().fadeIn(2000);
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

  // CHANGE COLOR EVENT
  $('.colors').on('click', (event) => $(':root').css('--theme-color', $(event.target).css('background-color')));

  //FUNCTIONS
  //MAIN AI
  function robot(){
    let robotChar = 'X'
    if(character == 'X') robotChar = 'O';

    //smart robot choices
    let robotChoice = '';


    //if beginning of the match, robot will target either corners or center
    if(robotArr.length == 0){
      while(['2','4','-4','-2',''].indexOf(robotChoice)!= -1){
        robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
      }
      if(playerArr.length == 1 && playerArr[0] !=5) robotChoice = '5';
    }

    // second turn
    // offense
    if(playerArr.length == 1 && robotArr.length == 1){
      if(['2','4','-4','-2'].indexOf(playerArr[0]) > -1){
        if(robotArr[0]== 5){
          while(['2','4','-4','-2','5'].indexOf(robotChoice)!= -1){
            robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
          }
        }
      }
    }

    //if not the beginning of the match
    else{
      //check if robot has 2 consecutive, and finish if necessary
      robotChoice = complete(robotArr, victoryArr, targets);
      //check if player has 2 consecutive, and deny the player of victory
      if(!robotChoice) {
        robotChoice = complete(playerArr, victoryArr, targets);
      }

      //prioritize edges if there are no 2 consecutives
      if(!robotChoice ){
        let limitLoop = 0;
        while(['2','4','-4','-2',''].indexOf(robotChoice) > -1 || !robotChoice){
          robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
          if(limitLoop > 1000) break;
          limitLoop++;
        }
      }
      //if there are neither 2 consecutives nor edges left, pick a spot at random
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
      targets = ['1','2','3','4','5','-4','-3','-2','-1'];
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




