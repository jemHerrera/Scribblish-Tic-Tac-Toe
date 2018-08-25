new Vue({
    el: '#app',
    data:{
        gameStart: false,
        playerStart: true,
        playerTurn: true,
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
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
            },{
                x: false,
                o: false,
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
                this.aiInputRandom();
            }
        },
        // METHOD TO APPLY PLAYER/AI MOVE
        applyInput: function(spot, who){
             // if the spot is unoccupied, occupy the spot
            if (!this.spots[spot].x && !this.spots[spot].o){
                if (who.character == 'X') this.spots[spot].x = true;
                else this.spots[spot].o = true;
                who.arr.push(spot);
            }
        },
        randomize: function(){
            return Math.floor(Math.random()*9);
        },
        // AI MOVE
        aiInputRandom: function(){
            this.playerTurn = false;
            let vm = this;
            setTimeout(function(){
                let randomTarget = Math.floor(Math.random()*9);
                while (vm.spots[randomTarget].x || vm.spots[randomTarget].o){
                    randomTarget = vm.randomize();
                }
                vm.applyInput(randomTarget, vm.ai);
                vm.victoryCheck(vm.ai);
                vm.playerTurn = true;
            }, 1000);
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
                this.aiInputRandom();
            }
            else{
                this.playerStart = true;
            }
            this.player.arr = [];
            this.ai.arr = [];
            this.ai.victory = false;
            this.player.victory = false;
            this.draw = false;
            this.spots = [
                {
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },{
                    x: false,
                    o: false,
                },
            ]
        }
    }
});