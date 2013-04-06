//
//   SETUP THE GAME ENGINE
//     Keran McKenzie 2013
//

// the VARIABLES
var width = window.innerWidth
var height = window.innerHeight // use native JS not any plugin to get the right sizes
var loadingOffset = 1000

var audio = new Audio()
var heightOfInit = ''
var heightOfButtonStage = ''

var ballInterval = 0
var ballMilliSeconds = 65

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

		// setup the messages for the init screen
		$('#init .title').html( messages.init_title )
		$('#init .subtitle').html( messages.init_subtitle )
		$('#init .footer p').html( messages.init_footer )

		// setup the audio
		audio.setAttribute("src","assets/audio/button_click.mp3")
		audio.load() // required for 'older' browsers

		// show the screen
		$('#init').css('display', 'block')

		// set elements
		$('#init .footer').css('top', height - $('#init .footer').height())
		heightOfInit = $('#init .init_screen').height()
		heightOfButtonStage =  $('#init .play_button_stage button').height()
		$('#init .init_screen').css('top', (height/2) - ( heightOfInit - heightOfButtonStage ) )
		$('#init .play_button_stage button').css('width', width - 40 )

		// add listeners to the buttons
		$('#init .play_button_stage button').on('click', function() { audio.play() })//document.getElementById('appAudio').play() })
		$('#init .play_button_stage button.play').on('click', function(){ appEngine.showTheGame() })

		// animate the heading up and show the play button
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
	},

	// function to hide every screen
	hideAll : function() {

		$('#init').css('display', 'none')
		$('#theGame').css('display', 'none')

		// reset the game screen
		$('#theGame').html(' ')

		// make sure the buttons hare idden
		$('#init .play_button_stage button').css('opacity', 0)

		// reset vars
		//audio = setAttribute("src", ' ')
		heightOfInit = ''
		heightOfButtonStage = ''
	},

	showTheGame : function() {
		// make sure everything is hidden
		appEngine.hideAll()

		// set the game screen to show
		$('#theGame').css('display', 'block')

		theGame.init()
		// slide out the initScreen

		// reveal the game screen


	}, // the game
	
} // this is the appEngine

//
// game items
//
var theGame = {

	init : function() {
		$('#theGame').append( '<p id="ballDetails">Ball Details ...</p><p id="accelerometer">Waiting for accelerometer...</p><i id="theBall" class="icon-isight icon2x"></i>' )
		$('#theBall').css('left', ( (width/2) - $('#theBall').width() ))
		$('#theBall').css('top', 10 )
		//$('#theBall').css('top', height/2 )
		// launch countdown window & then start game

		theGame.startGame()
		
	},

	theBall : function() {

		// where am I?
		var myHeight = $('#theBall').height()
		var myPos = myObj.position()

		// am I at the bottom?
		if( myPos.top >= ( height - myHeight) ) {
			// game over
			console.log('Game over')
			//clearInterval(ballInterval)
			$('#theBall').remove() // take the ball off the stage
			myHeight = 0 // reset
			myTop = 0 // reset
			ballInterval = 0

			appEngine.hideAll()
			appEngine.showInitScreen()
			return true
		} else {
			// move me
			console.log("move")
			console.log(myPos.top + ' height '+ (height - myPos.top))
			$('#theBall').css('top', myPos.top + 1)
		}

		var element = document.getElementById('ballDetails')
        var theHTML = 'Ball Height ' + myHeight + '<br />' +
                      'Ball Top ' + myPos.top + ' Ball Left '+myPos.left+'<hr />'
		
	},

	startGame : function() {
    	console.log('start game')
    	var watchID = null
  		var watchMove = null
    	
        var options = { frequency: 10 } //55 }
        watchMove = navigator.accelerometer.watchAcceleration(theGame.moveBall, theGame.onError, options)

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
    	
    	if( xMove < 0 && ( objPosition.left <= rightBoundary ) ) {
    		$('#theBall').css('left', objPosition.left + (xMove*-1) ) // convert to positive number
    		theHTML += 'Move to: right '
    	} else if( xMove > 0 && objPosition.left > leftBoundary ) {
    		$('#theBall').css('left', objPosition.left - xMove )
    		theHTML += 'Move to: left '
    	}
    	if( yMove < 0 && objPosition.top > topBoundary ) {
    		$('#theBall').css('top', objPosition.top - (yMove*-1) )
    		theHTML += 'Move to: top '
    	} else if(yMove > 0 && objPosition.top <= bottomBoundary ) {
    		$('#theBall').css('top', objPosition.top + yMove )// convert to positive number
    		theHTML += 'Move to: bottom '
    	} else {
    		theHTML += 'Move to: stay put '
    	}

    	element.innerHTML = theHTML+'<hr />';
    	
    	// update the ball movement
    	theGame.theBall()
    },

    onError : function() {
        alert('onError!');
    }


} // end the ball

