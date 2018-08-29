new Vue({
    el: '#app',
    data:{
        gameStart: false,
        playerStart: true,
        playerTurn: true,
        aiDone: true,
        player: {
            character: '',
            arr: [],
            victory: false
        },
        ai: {
            character: '',
            arr: [],
            victory: false
        },
        draw: false,
        spots:[
            {
                x: false,
                o: false,
                relationships: {
                    oppositeCorner: 8,
                    cwCorner: 2,
                    ccwCorner: 6,
                    nearCwSide: 1,
                    nearCcwSide: 3,
                    farCwSide: 5,
                    farCcwSide: 7
                }
            },{
                x: false,
                o: false,
                relationships:{
                    oppositeSide: 7,
                    cwSide: 5,
                    ccwSide: 3,
                    nearCwCorner: 2,
                    nearCcwCorner: 0,
                    farCwCorner: 8,
                    farCcwCorner: 6
                }
            },{
                x: false,
                o: false,
                relationships: {
                    oppositeCorner: 6,
                    cwCorner: 8,
                    ccwCorner: 0,
                    nearCwSide: 5,
                    nearCcwSide: 1,
                    farCwSide: 7,
                    farCcwSide: 3
                }
            },{
                x: false,
                o: false,
                relationships:{
                    oppositeSide: 5,
                    cwSide: 1,
                    ccwSide: 7,
                    nearCwCorner: 0,
                    nearCcwCorner: 6,
                    farCwCorner: 2,
                    farCcwCorner: 8
                }
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
                relationships:{
                    oppositeSide: 3,
                    cwSide: 7,
                    ccwSide: 1,
                    nearCwCorner: 8,
                    nearCcwCorner: 2,
                    farCwCorner: 6,
                    farCcwCorner: 0
                }
            },{
                x: false,
                o: false,
                relationships: {
                    oppositeCorner: 2,
                    cwCorner: 0,
                    ccwCorner: 8,
                    nearCwSide: 3,
                    nearCcwSide: 7,
                    farCwSide: 1,
                    farCcwSide: 5
                }
            },{
                x: false,
                o: false,
                relationships:{
                    oppositeSide: 1,
                    cwSide: 3,
                    ccwSide: 5,
                    nearCwCorner: 6,
                    nearCcwCorner: 8,
                    farCwCorner: 0,
                    farCcwCorner: 2
                }
            },{
                x: false,
                o: false,
                relationships: {
                    oppositeCorner: 0,
                    cwCorner: 6,
                    ccwCorner: 2,
                    nearCwSide: 7,
                    nearCcwSide: 5,
                    farCwSide: 3,
                    farCcwSide: 1
                }
            },
        ],
        victoryConditions: [
            ['0','1','2'],
            ['3','4','5'],
            ['6','7','8'],
            ['0','3','6'],
            ['1','4','7'],
            ['2','5','8'],
            ['0','4','8'],
            ['2','4','6']
        ],
        defense:{
            firstLine1 : false,
            firstLine2 : false,
        },
        offense:{
            ver2center: false,
            ver2corner: false,
        }
    },
    computed:{
        ifEnd: function(){
            return (this.ai.victory || this.player.victory || this.draw);
        }
    },
    methods:{
        // METHOD TO START THE GAME AND DETERMINE THE CHARACTERS FOR BOTH AI AND PLAYER
        start: function(event){
            this.gameStart = true;
            this.player.character = event.target.innerHTML;
            this.ai.character = (this.player.character == 'X') ? 'O' : 'X';
            console.log(`player ${this.player.character}`);
            console.log(`ai ${this.ai.character}`);
        },
        // PLAYER'S MOVE
        playerInput: function(event){
            if(this.playerTurn && !this.ai.victory && !this.draw){
                let playerTarget = event.target.id;
                this.applyInput(playerTarget, this.player);
                this.victoryCheck(this.player);
                if (this.player.victory || this.draw) return;

                // AI REACTIONS
                // OFFENSIVE MOVES

                // if ai's first turn if player chooses sides
                if(!this.playerStart && this.player.arr.length == 1  && ['1', '3', '5', '7'].indexOf(this.player.arr[0]) > -1){
                    this.aiInput('turn3OffenseVer3');
                }
                else if(!this.playerStart && this.player.arr.length == 2  && ['1', '3', '5', '7'].indexOf(this.player.arr[0]) > -1){
                    this.aiInput('turn5OffenseVer3');
                }
                // if ai's first turn if player chooses corner or mid
                if(!this.playerStart && this.player.arr.length == 1  && ['0', '2', '4', '6', '8'].indexOf(this.player.arr[0]) > -1){
                    this.aiInput('turn3OffenseVer2');
                }
                if(this.offense.ver2center) this.aiInput('centerOffenseVer2');
                if(this.offense.ver2corner) this.aiInput('cornerOffenseVer2');

                // DEFENSIVE MOVES
                // if player moves on first turn and did not choose mid, ai chooses mid
                if(this.playerStart && this.player.arr.length == 1 && this.player.arr[0] != 4) this.aiInput('firstLineDefense1');
                else if (this.playerStart && this.player.arr.length == 1 && this.player.arr[0] == 4) this.aiInput('firstLineDefense2');

                // second line of defense
                if(this.defense.firstLine1) this.aiInput('secondLineDefense1');
                if(this.defense.firstLine2) this.aiInput('secondLineDefense2');


                // STOPPER AND FINISHER
                if (this.player.arr.length >= 2 && this.ai.arr.length >=1 || this.player.arr.length >= 1 && this.ai.arr.length >=2){
                    this.aiInput('nearVictory');
                }
                // RANDOM
                this.aiInput('random');
            }
        },
        // METHOD TO APPLY PLAYER/AI MOVE
        applyInput: function(spot, who){
             // if the spot is unoccupied, occupy the spot
            if (!this.spots[spot].x && !this.spots[spot].o){
                if (who == this.player) {
                    this.aiDone = false;
                    this.playerTurn = false;
                }
                if (who.character == 'X') this.spots[spot].x = true;
                else this.spots[spot].o = true;
                who.arr.push(spot);
            }
            else {
                return;
            }
        },
        randomize: function(number){
            return Math.floor(Math.random()*number);
        },
        // AI MOVEsets
        aiInput: function(type){
            let vm = this;
            setTimeout(function(){
                if (!vm.aiDone){
                    let target = 0;
                    let firstPlayerChoice = vm.player.arr[0];
                    let firstAiChoice = vm.ai.arr[0];
                    let secondPlayerChoice = vm.player.arr[1];
                    let secondAiChoice = vm.ai.arr[1];

                    //OFFENSE
                    // random attack pattern
                    if (type == 'random'){
                        console.log('random');
                        target = vm.randomize(9);
                        while (vm.spots[target].x || vm.spots[target].o){
                            target = vm.randomize(9);
                        }
                    }
                    // target edge or center if beginning
                    else if (type == 'beginOffense'){
                        target = [0, 4, 2, 4, 6, 4, 8][vm.randomize(7)];
                        while (vm.spots[target].x || vm.spots[target].o){
                            target = [0, 4, 2, 4, 6, 4, 8][vm.randomize(7)];
                        }
                    }

                    // if ai's first turn and player chooses sides
                    else if (type == 'turn3OffenseVer3'){
                        console.log('Player chooses a side on his second turn. Guaranteed win for AI.');
                        // if ai chooses center in first turn, take the clockwise side of firstPlayerChoice
                        if(firstAiChoice == 4){
                            target = vm.spots[firstPlayerChoice].relationships.cwSide;
                            console.log('AI chooses a side');
                        }
                        // if ai chooses corner in the first turn
                        else{
                            // if player chooses a side that is near the corner ai chose, take opposite corner that is not blocked
                            if (firstPlayerChoice == vm.spots[firstAiChoice].relationships.nearCwSide || firstPlayerChoice == vm.spots[firstAiChoice].relationships.nearCcwSide){
                                console.log('AI chooses far corner')
                                if (vm.spots[firstPlayerChoice].relationships.nearCwCorner == firstAiChoice) {
                                    target = vm.spots[firstPlayerChoice].relationships.farCwCorner;
                                }
                                else if (vm.spots[firstPlayerChoice].relationships.nearCcwCorner == firstAiChoice) {
                                    target = vm.spots[firstPlayerChoice].relationships.farCcwCorner;
                                }
                            }
                            // if player chooses a far side, choose any corner
                            else {
                                target = vm.spots[firstAiChoice].relationships.cwCorner;
                                console.log('Ai chooses any corner');
                            }
                        }
                    }

                    else if (type == 'turn5OffenseVer3'){
                        if(vm.nearVictoryCheck(vm.ai)) target = vm.nearVictoryCheck(vm.ai);
                        else{
                            console.log('Player chooses a side on his second turn. Guaranteed win for AI.')
                            if(firstAiChoice == 4){
                                target = vm.spots[secondAiChoice].relationships.nearCcwCorner;
                            }
                            else target = 4;
                        }            
                    }
                    // if ai's first turn and player chooses corner or center
                    else if (type == 'turn3OffenseVer2'){
                        // if player chooses centre
                        if(firstPlayerChoice == 4){
                            console.log('Player chooses center. AI chooses a opposite corner to confuse player');
                            target = vm.spots[firstAiChoice].relationships.oppositeCorner;
                        }
                        // if player chooses corner
                        else if (['0', '2', '8', '6'].indexOf(firstPlayerChoice) > -1){
                            // if ai's first choice is center
                            if(firstAiChoice == 4){
                                console.log('Player chooses corner. AI chooses a opposite corner to confuse player');
                                target = vm.spots[firstPlayerChoice].relationships.oppositeCorner;
                                vm.offense.ver2center = true;
                            }
                            

                        }
                    }
                    // if player chooses opp corner on second turn
                    else if (type == 'centerOffenseVer2'){
                        if(secondPlayerChoice == vm.spots[firstPlayerChoice].relationships.farCcwSide){
                            target = vm.spots[secondPlayerChoice].relationships.farCcwCorner;
                            console.log('Player chooses a near side. AI chooses far corner');
                        }
                        else if(secondPlayerChoice == vm.spots[firstPlayerChoice].relationships.farCwSide){
                            target = vm.spots[secondPlayerChoice].relationships.farCwCorner;
                            console.log('Player chooses a near side. AI chooses far corner');
                        }
                        else {
                            console.log('Player tries to finish on the second turn, AI destroys player.');
                            vm.offense.ver2center= false;
                            return;
                        }
                        vm.offense.ver2center= false;
                    }

                    // DEFENSE
                    // first line
                    else if (type == 'firstLineDefense1'){
                        console.log('Player did not choose middle on offense. AI chooses middle.');
                        target = 4;
                        vm.defense.firstLine1 = true;
                    }
                    else if (type == 'firstLineDefense2'){
                        console.log('Player chose middle on offense. AI chooses one of the corners.')
                        target = [0, 2, 6, 8][vm.randomize(4)];
                        vm.defense.firstLine2 = true;
                    }
                    // second line
                    else if (type == 'secondLineDefense1'){
                        // if player's first turn is a side
                        if(['1', '3', '5', '7'].indexOf(vm.player.arr[0]) > -1){
                            console.log('Player chooses a side on the first turn');
                            // if player's second turn is far corner(ccw)
                            if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.farCcwCorner){
                                console.log('Player choses the far counter-clockwise corner on the second turn, AI blocks the player');
                                target = vm.spots[vm.player.arr[0]].relationships.cwSide;
                            }
                            // if player's second turn is far corner(cw)
                            else if (vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.farCwCorner){
                                console.log('Player choses the far clockwise corner on the second turn, AI blocks the player');
                                target = vm.spots[vm.player.arr[0]].relationships.ccwSide;
                            }
                            // if player's second turn is a side(ccw)
                            else if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.ccwSide){
                                console.log('Player choses the counter-clockwise side on the second turn, AI blocks the player');
                                target = vm.spots[vm.player.arr[0]].relationships.farCcwCorner;
                            }
                            // if player's second turn is a side(cw)
                            else if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.cwSide){
                                console.log('Player choses the clockwise side on the second turn, AI blocks the player');
                                target = vm.spots[vm.player.arr[0]].relationships.farCwCorner;
                            }
                            // if player's second turn is opp side
                            else if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.oppositeSide){
                                console.log('Player choses the opposite side on the second turn, AI attacks the player');
                                target = vm.spots[vm.player.arr[0]].relationships.farCwCorner;
                            }
                            else {
                                console.log('Player tries to finish on the second turn, AI must block.');
                                vm.defense.firstLine1 = false;
                                return;
                            }
                        }
                        // if player's first turn is corner
                        else if (['0', '2', '6', '8'].indexOf(vm.player.arr[0]) > -1){
                            console.log('Player chooses a corner on the first turn'); 
                            // if player's second turn is far side(ccw)
                            if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.farCcwSide){
                                console.log('Player choses the far counter-clockwise side on the second turn, AI baits the player');
                                target = vm.spots[vm.player.arr[0]].relationships.farCwSide;
                            }
                            // if player's second turn is far side(cw)
                            else if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.farCwSide){
                                console.log('Player choses the far clockwise side on the second turn, AI baits the player');
                                target = vm.spots[vm.player.arr[0]].relationships.farCcwSide;
                            }
                            // if player's second turn is opp corner(cw)
                            else if(vm.player.arr[1] == vm.spots[vm.player.arr[0]].relationships.oppositeCorner){
                                console.log('Player choses the opposite corner on the second turn, AI chooses a side to block');
                                target = vm.spots[vm.player.arr[0]].relationships.farCcwSide;
                            }
                            else {
                                console.log('Player tries to finish on the second turn, AI must block.');
                                vm.defense.firstLine1 = false;
                                return;
                            }
                        }
                        vm.defense.firstLine1 = false;
                    }
                    else if (type == 'secondLineDefense2'){
                        // if player chooses opp corner of ai
                        if(vm.player.arr[1] == vm.spots[vm.ai.arr[0]].relationships.oppositeCorner){
                            console.log('Player choses the opposite corner on the second turn, AI chooses an edge to block');
                            target = vm.spots[vm.ai.arr[0]].relationships.cwCorner;
                        }
                        else {
                            console.log('Player tries to finish on the second turn, AI must block.');
                            vm.defense.firstLine1 = false;
                            return;
                        }
                        vm.defense.firstLine2 = false;
                    }


                    // if at 4th turn and above, check if someone is close to winning
                    else if (type == 'nearVictory'){
                        if(vm.nearVictoryCheck(vm.ai) != null) {
                            console.log('AI is about to win. AI finishes.');
                            target = vm.nearVictoryCheck(vm.ai);
                        }
                        else if (vm.nearVictoryCheck(vm.player) != null) {
                            console.log('Player is about to win. AI stops player.');
                            target = vm.nearVictoryCheck(vm.player);
                        }
                        else {
                            console.log('No near-victory detected. AI chooses at random.');
                            target = vm.randomize(9);
                            while (vm.spots[target].x || vm.spots[target].o){
                                target = vm.randomize(9);
                            }
                        }
                    }

                    console.log('AI chooses ' + target);
                    vm.applyInput(target, vm.ai);
                    vm.victoryCheck(vm.ai);
                    vm.playerTurn = true;
                    vm.aiDone = true;
                }
            }, 1000);
        },
        nearVictoryCheck: function(who){
            for(j of this.victoryConditions){
                let counter = 0;
                for(k of j){
                    for(i of who.arr){
                        if (k == i) counter++;
                    }
                }
                if (counter == 2) {
                    for (num of j){
                        if(who.arr.indexOf(num) < 0 && !this.spots[num].x && !this.spots[num].o)return num;
                    }
                }
            }
        },
        victoryCheck: function(who){
            for(j of this.victoryConditions){
                let counter = 0;
                for(k of who.arr){
                    for(i of j){
                        if (k==i) counter++;
                    }
                }
                if (counter == 3) {
                    who.victory = true;
                    let vm=this;
                    setTimeout(() => {
                        vm.reset();
                    }, 3000);
                }
            }
            if (!who.victory && this.player.arr.length + this.ai.arr.length == 9){
                this.draw = true;
                setTimeout(() => {
                    this.reset();
                }, 3000);
            }
        },
        reset: function(){
            if (this.playerStart){
                this.playerStart = false;
                this.playerTurn = false;
                this.aiDone = false;
                this.aiInput('beginOffense');
            }
            else{
                this.playerStart = true;
                this.aiDone = true;
            }
            this.player.arr = [];
            this.ai.arr = [];
            this.ai.victory = false;
            this.player.victory = false;
            this.draw = false;
            for (spot of this.spots){
                spot.x = false;
                spot.o = false;
            }
            this.defense.firstLine1 = false;
            this.defense.firstLine2 = false;
        }
    }
});