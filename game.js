/***Created By Jessica Ingraham****/

/**Generate the dice blocks based on the dice number**/
function generateOne(block){
	block.classList.add('one');
	const span = document.createElement('span');
	span.classList.add('dot');
	block.appendChild(span);
}

function generateTwo(block){
	block.classList.add('two');
	for(let i=0; i < 2; i++){
		const span = document.createElement('span');
		span.classList.add('dot');
		block.appendChild(span);
	}

}

function generateThree(block){
	block.classList.add('three');
	for(let i=0; i < 3; i++){
		const span = document.createElement('span');
		span.classList.add('dot');
		block.appendChild(span);
	}
}

function generateFour(block){
	block.classList.add('four');
	//create 2 column divs with 2 dots each
	for(let i=0; i < 2; i++){
		const column = document.createElement('div');
		column.classList.add('column');
		block.appendChild(column);
		for(let j = 0; j < 2; j++){
			const dot = document.createElement('span');
			dot.classList.add('dot');
			column.appendChild(dot);
		}
		
	}
}

function generateFive(block){
	block.classList.add('five');
	//create 2 columns with 2 dots each, the second will have a special id so a third column can be inserted before it
	for(let i=0; i < 2; i++){
		const column = document.createElement('div');
		column.classList.add('column');
		for(let j = 0; j < 2; j++){
			const dot = document.createElement('span');
			dot.classList.add('dot');
			column.appendChild(dot);
		}
		column.id = i===1 ? 'second' : '';
		block.appendChild(column);
	}

	const column = document.createElement('div');
	column.classList.add('column');
	const dot = document.createElement('span');
	dot.classList.add('dot');
	column.appendChild(dot);

	block.insertBefore(column, block.querySelector('#second'));
}

function generateSix(block){
	block.classList.add('six');
	//create 2 column divs with 3 dots each
	for(let i=0; i < 2; i++){
		const column = document.createElement('div');
		column.classList.add('column');
		for(let j = 0; j < 3; j++){
			const dot = document.createElement('span');
			dot.classList.add('dot');
			column.appendChild(dot);
		}

		block.appendChild(column);
	}
}

/******************************Game functions*****************************/

//global variables
const rollValues = {
	//maps the rolled number to the value, class, and layout generator for the dice block
	'1':{'value':1, layout:(block) => generateOne(block)}, 
	'2':{'value':2, layout:(block) => generateTwo(block)}, 
	'3':{'value':0, layout:(block) => generateThree(block)}, 
	'4':{'value':4, layout:(block) => generateFour(block)},
	'5':{'value':5, layout:(block) => generateFive(block)},
	'6':{'value':6, layout:(block) => generateSix(block)}
};
let playerScore = 0;
let computerScore = 0;
let computerDice = [];
let predefinedRolls = [];


function rollDice(){
	//rolls and returns one die
	return Math.floor(Math.random()*6) + 1;
}

function rollManyDice(numOfDice){
	//returns an array of random numbers 1-6 of length numOfDice - 5 initally and then set to however many aren't pinned for player, or however many aren't picked for computer
	const dice = [];
	for(let i = 0; i< numOfDice; i++){
		const roll = rollDice();
		dice.push(roll);
	}
	return dice;
}

function generateGameLayout(){

	//create the score element
	const player = document.createElement('h3');
	player.id = 'playerScore';
	player.appendChild(document.createTextNode(`Your Score: ${playerScore}`));

	//create an element for the computer score, this has no text yet and does not need to show
	const compScore = document.createElement('h3');
	compScore.id = 'computerScore';
	compScore.classList.add('hidden');


	//set the boxes
	const innerGame = document.createElement('div');
	innerGame.classList.add('dice');

	for(let i=0; i<5; i++){ //create 5 of the diceblock divs
		const divElement = document.createElement('div');
		divElement.id = 'diceBlock';
		innerGame.appendChild(divElement);
	}

	//set the buttons

	const buttons = document.createElement('div');
	buttons.classList.add('buttons');

	const buttonText = ['Start', 'Roll', 'Pin', 'Restart'];
	buttonText.forEach((text) =>{
		const btn = document.createElement('button');
		btn.id = text.toLowerCase();
		btn.appendChild(document.createTextNode(text));
		if(text !== 'Start'){
			btn.disabled = true; //disable roll and pin buttons
		}
		if(text === 'Restart'){
			btn.classList.add('hidden');
			btn.disabled = false;

		}
		buttons.appendChild(btn);

	});

	//append both divs and the score h2
	const gameDiv = document.querySelector('#game');
	gameDiv.appendChild(compScore);
	gameDiv.appendChild(player);
	gameDiv.appendChild(innerGame);
	gameDiv.appendChild(buttons);

}

function setPredefined(nums){
	//If there were numbers passed into the box at the beginning of the game
	if(nums){
		predefinedRolls = nums.split(',');
		for(let i= 0; i< predefinedRolls.length; i++){
			predefinedRolls[i] = parseInt(predefinedRolls[i]);
		}
	}

}


function computerTurn(){ 

	if(predefinedRolls.length > 0){
		for(let i = 5; i > 0; i--){
			const diceRolls = predefinedRolls.splice(0, i); //returns and removes i elements from predefined starting at 0
			if(diceRolls.length < i){ 
				//if the number of predefined dice rolls is less than the number of rolls that turn, pick random numbers to fill the array
				//if dice rolls has 2 and we need 5 rolls
				//then we choose 5-2 = 3 (i - diceRolls.length)
				const newRolls = rollManyDice(i-diceRolls.length);
				newRolls.forEach((roll) => diceRolls.push(roll));
			}
			//get the values of the rolls
			const values = diceRolls.map((roll) =>{
				return rollValues[roll].value;
			});
			//return the lowest of the values
			const keep = Math.min(...values);
			computerDice.push(keep);
			computerScore += keep;

		}

	}
	else{
		for(let i = 5; i > 0; i--){
			//choose i number of dice, choose the lowest value and add it to the computer dice array
			const diceRolls = rollManyDice(i);
			const values = diceRolls.map((roll) =>{

				return rollValues[roll].value;
			});

			const keep = Math.min(...values);
			computerDice.push(keep);
			computerScore += keep;
		}
	}
}

function printCompScore(){
	const compScore = document.querySelector('#computerScore');
	// let scoreString = computerDice.join(' + ');
	// console.log(scoreString);
	
	const nums = computerDice.map((die) => {
		if(die === 0){
			die += ' (3)';
		}
		else{
			die += '';
		}
		return die;
	});


	const scoreString = nums.join(' + ');
	compScore.appendChild(document.createTextNode(`Computer Score: ${scoreString} = ${computerScore}`));
	compScore.classList.remove('hidden');
}

function showOverlay(header, messageText){
	//show the modal with an error message
	const overlay = document.querySelector('.overlay');
	const closebtn = document.querySelector('.closeButton');
	const modalp = document.querySelector('.modal p');
	const modal = document.querySelector('.modal');


	//const message = document.createTextNode(messageText);
	//modalp.appendChild(message);
	modalp.innerHTML = messageText

	const modalheader = document.createElement('h2');
	modalheader.appendChild(document.createTextNode(header));

	modal.insertBefore(modalheader, document.querySelector('.modal p')); //add the header first
	overlay.classList.remove('hidden');

	//close
	closebtn.addEventListener('click', function(){
		overlay.classList.add('hidden');
		modalp.innerHTML = '';
		modal.removeChild(modalheader);
	});

}

function notRolled(){
	//if the user hasn't rolled yet
	showOverlay('Opps', "Those dice haven't been rolled yet! Be patient");
}

function startGame(){
	//computer completes all of it's rolls at the start
	computerTurn();
	printCompScore();
	document.querySelectorAll('#diceBlock').forEach((block)=>{
		block.addEventListener('click', notRolled); //add the event listener to all dice
	});

	//remove the start button and activate the roll button, pin should still be disabled
	document.querySelector('#start').classList.add('hidden');
	document.querySelector('#roll').disabled = false;

}
/*Player Functions*/


function togglePin(event){
	//this checks where ever the user clicks and finds the parent diceblock where they clicked
	let block;
	if(event.target.parentNode.id === 'diceBlock'){
		//they clicked on a column when dice => 4 or on a dot for dice <= 3
		block = event.target.parentNode;
		//event.target.parentNode.classList.toggle('toPin');
	}
	else if(event.target.parentNode.classList.contains('column')){
		//they clicked on a dot when dice => 4
		block = event.target.parentNode.parentNode;
	}
	else{
		//they clicked on the diceblock itself
		block = event.target;
	}

	block.classList.toggle('toPin');

}

function checkEndGame(){
	if(document.querySelectorAll('.pinned').length === 5){
		//if all 5 dice have been pinned
		//check for winner and loser or tie

		const paragraph = document.createElement('p');
		paragraph.id = 'result';

		if(playerScore < computerScore){
			paragraph.appendChild(document.createTextNode('Congratulations! You Won!'));
			paragraph.classList.add('win');

		}
		else if(playerScore > computerScore){
			paragraph.appendChild(document.createTextNode('You Lost! Too Bad.'));
			paragraph.classList.add('lose');

		}
		else{
			paragraph.appendChild(document.createTextNode('Tie! Good job.'));
			paragraph.classList.add('tie');
		}

		document.querySelector('#game').insertBefore(paragraph, document.querySelector('.dice')); //insert the paragraph between the dice blocks and the score
		document.querySelector('#roll', '#pin').disabled = true;
		document.querySelector('#game #restart').classList.remove('hidden');

	}
}



function playerRoll(){

	const diceBlocks = document.querySelectorAll('#diceBlock');
	diceBlocks.forEach((dice) =>{
		if(!dice.classList.contains('pinned')){
			dice.removeEventListener('click',notRolled); //remove the event listener since they have been rolled
			dice.classList.add('hover');

			if(predefinedRolls.length > 0){
				//if there is more user input grab the first element for the next roll
				const roll = predefinedRolls.shift();
				rollValues[roll].layout(dice);

			}
			else{
				//otherwise, choose the next random number
				const roll = rollDice();
				rollValues[roll].layout(dice);
			}
		}
	});

}

function pinDice(){
	//this pins dice and removes the number from those that are not pinned
	
	if(document.querySelectorAll('.toPin').length === 0){
		showOverlay('Oh No!','You must select at least one die to keep');
	}
	else{
		const diceBlocks = document.querySelectorAll('#diceBlock');

		diceBlocks.forEach((die) =>{
			die.removeEventListener('click',togglePin);

			if(die.classList.contains('toPin')){

				die.classList.remove('toPin', 'hover');
				die.classList.add('pinned');

				const num = die.querySelectorAll('span.dot').length;

				playerScore += rollValues[num].value;

			}
			else if(!die.classList.contains('pinned')){
				die.classList.remove('hover','one','two','three','four','five','six');
				die.innerText = '';
				die.addEventListener('click', notRolled); //add the event listener back to the non-pinned dice
			}
		});

		document.querySelector("#game #roll").disabled = false;
		document.querySelector("#game #pin").disabled = true;
		document.querySelector('#playerScore').innerText = `Your Score: ${playerScore}`;

		checkEndGame();
	}
	

}

function autoPin(){
	//only one left, it will be automatically pinned since you need to pin at least one die
	const select = document.querySelector('.hover');

	select.classList.add('toPin');
	pinDice();
}

function playerTurn(){
	//all the playerRoll, pin dice and check end game
	document.querySelector('#game #roll').disabled = true;
	document.querySelector('#game #pin').disabled = false;
	
	playerRoll();
	const selectable = document.querySelectorAll('.hover');

	if(selectable.length === 1){ //if there is only one die left, they have to pin it
		window.setTimeout(autoPin,300);
	}
	else{
		selectable.forEach((block) =>{
			//bind so that the child nodes do not also get the event, found here: https://stackoverflow.com/questions/13918441/javascript-addeventlistener-without-selecting-children
			block.addEventListener('click', togglePin);
		});
	}
	
}



function reset(){
	//reset the entire game - does not give the option to enter new predefined rolls
	const gamediv = document.querySelector('#game');
	gamediv.innerText = '';

	playerScore = 0;
	computerScore = 0;
	computerDice = [];
	predefinedRolls = [];

	generateGameLayout();
	startGame();
	
}

function game(){ 
	//wrap everything in a function so that it can be continuously called
	const startButton = document.querySelector('#game #start');
	startButton.addEventListener('click', function(){
		startGame();
	});

	const rollButton = document.querySelector("#game #roll");
	rollButton.addEventListener('click', function(){
		playerTurn();
	});

	const pinButton = document.querySelector('#game #pin');
	pinButton.addEventListener('click', function(){
		pinDice();
	});

	const restartButton = document.querySelector('#restart');
	restartButton.addEventListener('click', function(){
		reset();
		game();
	});
}


//run the full game
document.addEventListener('DOMContentLoaded', function(){

	const rules = "This is a game of rolling dice against the computer. The one with the lowest score wins.<br/><br/>Each die has a value equal to it's face value, except for threes (3) which have a value of zero (0). <br/>To start the game press Start. The computer rolls first and follows a simple algorithm to pick the lowest number it rolled.<br/>To roll your dice select Roll. Click on the die to select that die as one you want to pin (you can deselect before you pin by clicking on the same die). You MUST select at least one (1) die to pin. <br/>Once you are sure about the dice you're keeping, select Pin. <br/>Your current score will be calculated and you can roll again by selecting Roll. Once a die is pinned it cannot be unpinned so choose wisely. </br>If there is only one die left it will be automcatically pinned no matter the value.</br>At the end of the game your final score will be calculated. To play again select Reset.<br/><br/>If you want to use the predefined rolls input, enter a list of comma seperated. Up to the first 15 rolls will be computer rolls and any remaining rolls will be used for player rolls.";
	const info = 'This was created by Jessica Ingraham for a previous class. The layout and dice for this game are all generated with JavaScript and can be found on my github at ';

	document.querySelector('.overlay').classList.add('hidden'); //hide the overlay

	const introbutton = document.querySelector('#intro button');
	const introDiv = document.querySelector('#intro');
	const gameDiv = document.querySelector('#game');

	const rulesbutton = document.querySelector('footer #rules');
	const infobutton = document.querySelector('footer #info');


	rulesbutton.addEventListener('click', () => showOverlay("How To Play", rules));
	infobutton.addEventListener('click', () => showOverlay("About this Game", info))

	introbutton.addEventListener('click', function(){
		

		setPredefined(document.querySelector('#diceValues').value);

		introDiv.classList.add('hidden');
		gameDiv.classList.remove('hidden');

		generateGameLayout();

		game();
		
	});

});