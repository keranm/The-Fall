//
//   SETUP THE GAME ENGINE
//     Keran McKenzie 2013
//

// the VARIABLES
var width = window.innerWidth
var height = window.innerHeight // use native JS not any plugin to get the right sizes
var loadingOffset = 1000

var firstTime = true
var debug = false
var debug_local = false

var btn_audio = new Audio()
//btn_audio.setAttribute("src","assets/audio/button_click.mp3")
//var heightOfInit = ''
//var heightOfButtonStage = ''

var watchID = null
var watchMove = null
var playGame = null

var itemAdded = 0
var itemsOnStage = new Array()
var canAdd = true

var ballInterval = 0
var ballMilliSeconds = 65
var ballMoveDistance = 1

$(document).ready(function(){

	// okay lets go
	appEngine.init()

}) // end of the get ready

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	appEngine.init()  
}

var appEngine = {

	// the initialisation function
	init : function() {
		// lets make sure everything is hidden
		appEngine.hideAll()

		// lets set the size of the pages & the body
		$('body').css('width, max-width', width)
		$('body').css('height, max-height', height)

		$('.page').css('width', width)
		$('.page').css('height', height)

		appEngine.showInitScreen()

	},

	showInitScreen : function() {

		if(firstTime) {
			// this is the first time
			// setup the messages for the init screen
			$('#init .title').html( messages.init_title )
			$('#init .subtitle').html( messages.init_subtitle )
			$('#init .footer p').html( messages.init_footer )

			// show the screen
			$('#init').css('display', 'block')

			// set elements
			$('#init .footer').css('top', height - $('#init .footer').height())
			var heightOfInit = $('#init .init_screen').height()
			var heightOfButtonStage =  $('#init .play_button_stage button').height()
			$('#init .init_screen').css('top', (height/2) - ( heightOfInit ) )
			$('#init .play_button_stage button').css('width', width - 40 )

			// add listeners to the buttons
			$('#init .play_button_stage button').on('click', function() { btn_audio.play() })//document.getElementById('appAudio').play() })
			$('#init .play_button_stage button.play').on('click', function(){ appEngine.showTheGame() })

			// animate the heading up and show the play button
			/*
			setTimeout(function() { 
				console.log('show')
				$('#init .init_screen').animate({
				    top: (height/1.8) - ( heightOfInit )
				  }, 300, "ease-out", function() {
				    // Animation complete show the button
				    $('#init .play_button_stage button').animate({
					    opacity: 1
					  }, 300, "ease-out")
				  });
			}, loadingOffset)
			*/
			setTimeout(function() { 
				$('#init .play_button_stage button').animate({
					    opacity: 1
					  }, 500, "ease-out")
			}, 800)

			firstTime = false

		} else {
			// this is the later times - the page is built, just show it
			$('#init').css('display', 'block')
		}

		
	},

	// function to hide every screen
	hideAll : function() {

		$('#init').css('display', 'none')
		$('#theGame').css('display', 'none')

		// reset vars
		//audio = setAttribute("src", ' ')
		heightOfInit = ''
		heightOfButtonStage = ''
		watchMove = null
		playGame = null
	},

	showTheGame : function() {
		// make sure everything is hidden
		appEngine.hideAll()

		// set the game screen to show
		$('#theGame').css('display', 'block')

		playGame = theGame.init()
		// slide out the initScreen

		// reveal the game screen


	}, // the game
	
} // this is the appEngine

//
// game items
//
var theGame = {

	init : function() {
		$('#theGame').html('')
		if(debug) {
			$('#theGame').append( '<p id="gameStatus">Waiting</p><p id="ballDetails">Ball Details ...</p><p id="accelerometer">Waiting for accelerometer...</p><hr />' )	
		} 

		$('#theGame').append( '<i id="theBall" class="icon-isight icon2x"></i>' )

		theGame.addBar()

		$('#theBall').css('left', ( (width/2) - $('#theBall').width() ))
		$('#theBall').css('top', 10 )
		//$('#theBall').css('top', height/2 )
		
		theGame.showCountdown()
		//theGame.startGame()
	},

	showCountdown : function() {
		console.log('showCountdown')
		// append the content
		$('#overlayMessage').html( messages.countdown )

		// show the overlay
		$('#theOverlay').css('display', 'block')

		// start the counter
		var countdownNum = 4
		var intrvl = setInterval(function(){
			if(countdownNum <= 0) {
				$('#overlayMessage').html( '' )
				$('#theOverlay').css('display', 'none')
				clearInterval(intrvl)
				console.log('start game')
				theGame.startGame()

			} else {
				$('#theCountdown').html(countdownNum)
				countdownNum = countdownNum - 1
			}
		}, 500)

	}, // end show countdown

	showGameOver : function() {
		clearInterval(window.itemAddInt)

		$('#overlayMessage').html( messages.game_over )
		$('#theOverlay').css('display', 'block')
		itemsOnStage = null
		itemsOnStage = new Array()
		$('#overlayMessage button.play_again').on('click', function(){
			// hide the overlay
			$('#overlayMessage').html( '' )
			$('#theOverlay').css('display', 'none')
			theGame.init()
		})
	},

	startGame : function() {
    	console.log('start game')

    	window.itemAddInt = setInterval(function(){
    		if(itemsOnStage.length <= 3) {
    			canAdd = true
    			theGame.addBar()
    		}
    	}, Math.floor((Math.random()*1500)+3000))
    	
        var options = { frequency: 40 } //55 }
        if(debug_local) {
        	bob = setInterval(function() {
        		var myObj = $('#theBall')
    			var objPosition = myObj.position()
	    		$('#theBall').css('top', objPosition.top + 1 )


	    		$(itemsOnStage).each(function(){
		    		var myObj = $(this)
		    		var myID = $(this).attr('id')
	    			var objPosition = myObj.position()
		    		$(this).animate({
					    top: objPosition.top - ballMoveDistance*6
					  }, 100)
		    		// am I off the top of the page?
		    		if( objPosition.top < -10) {
		    			// take it off the stage
		    			$(this).remove() 
		    			// remove the item
						itemsOnStage.splice(0, 1)
		    			
		    		} 	

		    	})

				if( $.collision('#theBall,.bad,.good') ){
					theGame.showGameOver()

					clearInterval(window.bob)
				}
        	}, 40)
        } else {
        	watchMove = navigator.accelerometer.watchAcceleration(theGame.moveBall, theGame.onError, options)
        }
        
        document.getElementById('gameStatus').innerHTML='Playing'
        //ballInterval = setInterval(function() { theGame.theBall() }, ballMilliSeconds) 

	},
 
    // moveObject
    moveBall : function(acceleration) {
    	var myObj = $('#theBall')
    	var objPosition = myObj.position()
    	var leftBoundary = 0
    	var topBoundary = 0
    	var rightBoundary = width - myObj.width() // 10 represents the 10px for the margin
    	var bottomBoundary = height - myObj.height() // 10 represents the 10px for the margin

    	var xMove = Math.round(acceleration.x)
    	var yMove = Math.round(acceleration.y)

    	var element = document.getElementById('accelerometer')
        var theHTML = 'X: ' + xMove + ' '+rightBoundary+'<br />' +
                      'Y: ' + yMove + ' '+bottomBoundary+'<br />'

        // if the game over?
        if( objPosition.top >= bottomBoundary ) {
        	// game over
        	navigator.accelerometer.clearWatch(watchMove)
        	document.getElementById('gameStatus').innerHTML='Game Over'

        	
	        //appEngine.hideAll()
			//appEngine.showInitScreen()
			theGame.showGameOver()

        } else {

        	// the ball needs to move down the screen all the time
	    	$('#theBall').css('top', objPosition.top + ballMoveDistance )
    	
	    	if( xMove < 0 && ( objPosition.left <= rightBoundary ) ) {
	    		$('#theBall').css('left', objPosition.left + (xMove * -1) ) // convert to positive number
	    		theHTML += 'Move to: right '
	    	} else if( xMove > 0 && objPosition.left > leftBoundary ) {
	    		$('#theBall').css('left', objPosition.left - xMove )
	    		theHTML += 'Move to: left '
	    	}
	    	if( yMove < 0 && objPosition.top > topBoundary ) {
	    		$('#theBall').css('top', objPosition.top - (yMove * -1) )
	    		theHTML += 'Move to: top '
	    	} else if(yMove > 0 && objPosition.top <= bottomBoundary ) {
	    		$('#theBall').css('top', objPosition.top + yMove )// convert to positive number
	    		theHTML += 'Move to: bottom '
	    	} else {
	    		theHTML += 'Move to: stay put '
	    	}

	    	// move the items on stage
    		var myObj = $('#theBall')
			var objPosition = myObj.position()
    		$('#theBall').css('top', objPosition.top + 1 )


    		$(itemsOnStage).each(function(){
	    		var myObj = $(this)
	    		var myID = $(this).attr('id')
    			var objPosition = myObj.position()
	    		$(this).animate({
				    top: objPosition.top - ballMoveDistance*6
				  }, 100)
	    		// am I off the top of the page?
	    		if( objPosition.top < -10) {
	    			// take it off the stage
	    			$(this).remove() 
	    			// remove the item
					itemsOnStage.splice(0, 1)
	    			
	    		} 	

	    	})

			if( $.collision('#theBall,.bad,.good') ){
				theGame.showGameOver()
			}

	    	element.innerHTML = theHTML+'<hr />';
	    	
	    } // end if game over
    },



		

    addBar : function() {

    	if(canAdd) {
    		// add one
    		console.log('bar_'+itemAdded)
	    	$('#theGame').append( '<div id="bar_'+itemAdded+'" class="bar bad">&nbsp;</div>' )

	    	// push it into the array
	    	itemsOnStage.push('#bar_'+itemAdded+'')

	    	// start it off the screen
	    	$('#bar_'+itemAdded+'').css('top', height + 55) 

			// how wide is this bar
			randWidth = Math.floor((Math.random()*60)+25)
			randWidth = (width * (randWidth/100))
			console.log('randWidth '+randWidth)
			$('#bar_'+itemAdded+'').css('width', Math.floor(randWidth)) 

	    	// and is it left or right?
	    	leftRight = Math.round(Math.random())
	    	if(leftRight) {
	    		// left
	    		$('#bar_'+itemAdded+'').css('left', -10)
	    	} else {
	    		$('#bar_'+itemAdded+'').css('left', width - randWidth +10)
	    	}
	    	
	    	itemAdded ++
	    	canAdd = false
    	}
    	
		
    },

    onError : function() {
        alert('onError!');
    },



} // end the ball


$.collision = function(selector) {
 
  var data = [];
 
  $(selector).each(function(){
    var elem    = $(this);
    var offset  = elem.offset();
    var width   = elem.width();
    var height  = elem.height();
 
    data.push({
      tl: { x: offset.left, y: offset.top },
      tr: { x: offset.left + width, y: offset.top },
      bl: { x: offset.left, y: offset.top + height },
      br: { x: offset.left + width, y: offset.top + height }
    });
  });
 
  var i, l;
 
  i = data.length;
  while(i--) {
    l = data.length;
    while(l-- && l !== i) {
      if (!( 
        data[l].br.x < data[i].bl.x || 
        data[l].bl.x > data[i].br.x || 
        data[l].bl.y < data[i].tl.y || 
        data[l].tl.y > data[i].bl.y 
      )) {
        return true;
      }
    }
  }   
  return false;
};

