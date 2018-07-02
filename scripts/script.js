$('document').ready(function(){
  $('body').hide().fadeIn(2000);
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
    //if beginning of the match, //robot keeps on choosing targets until it finds an edge
    if(robotArr.length == 0){
      while(['2','4','6','8',''].indexOf(robotChoice)!= -1){
        robotChoice = targets[Math.floor(Math.random()*(targets.length-1))];
      }
      if(playerArr.length == 1 && playerArr[0] !=5) robotChoice = '5';
    }
    //if not the beginning of the match
    else{
      //check if robot has 2 consecutive, and finish if necessary
      robotChoice = complete(robotArr, victoryArr, targets);
      //check if player has 2 consecutive, and deny the player from victory
      if(!robotChoice) {
        robotChoice = complete(playerArr, victoryArr, targets);
      }
      if (!robotChoice && playerArr.indexOf('8') == -1 && robotArr.indexOf('8') == -1) robotChoice = '8';
      //prioritize edges if there are no 2 consecutives
      if(!robotChoice ){
        let limitLoop = 0;
        while(['2','4','6','8',''].indexOf(robotChoice) > -1 || !robotChoice){
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

    //Generate messages
    if (gameCount == 0) $('.spoiler').hide().fadeIn(2000).text("Spoiler alert: One does not simply win in this game");
    else if (gameCount == 1) $('.spoiler').hide().fadeIn(2000).text("But if you actually win... Send me an email (My robot and I will then have a chat)");
    else if (gameCount == 3) $('.spoiler').hide().fadeIn(2000).text("I'm quite impressed with your persistence");
    else if (gameCount == 4) $('.spoiler').hide().fadeIn(2000).text("By the way, my name is Jem, nice to meet you");
    else if (gameCount == 5) $('.spoiler').hide().fadeIn(2000).text("Hopefully you're aware that this is pre-written");
    else if (gameCount == 6) $('.spoiler').hide().fadeIn(2000).text("This is your 7th game with my robot, just fyi");
    else if (gameCount == 7) $('.spoiler').hide().fadeIn(2000).text("Congratulations!, you just wasted minutes of your life.. Reading pre-written text and trying to beat an unbeatable AI");
    else if (gameCount == 8) $('.spoiler').hide().fadeIn(2000).text("No mentally healthy individual will ever get to this point.. Are you sure you don't need any medical attention?");
    else if (gameCount == 9) $('.spoiler').hide().fadeIn(2000).text("How about you play my simon game? For sure that will be worth your time");
    else if (gameCount == 11) $('.spoiler').hide().fadeIn(2000).text("Don't you think this is getting a little boring?");
    else if (gameCount == 12) {
      $('.spoiler').hide().fadeIn(2000).text("Ok I give up, you win, here's your rainbow.");
      setTimeout(function(){
        $('.colors').css('display','grid').hide().fadeIn(2000);
        $('.spoiler').hide();
      }, 5000);
    }
    else if (gameCount == 13){
      $('.colors').hide();
      $('.spoiler').hide().fadeIn(2000).text("Ha! No more rainbows for you!");
    }
    else if (gameCount == 15) {
      $('.spoiler').hide().fadeIn(2000).text("Just kidding! Well, it's been a pleasure, thank you for spending your time here.");
      setTimeout(function(){
        $('.colors').css('display','grid').hide().fadeIn(2000);
        $('.spoiler').hide();
      }, 7000);
    }
    
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




