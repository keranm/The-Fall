//
//   SETUP THE GAME ENGINE
//     Keran McKenzie 2013
//

// the VARIABLES
var width = window.innerWidth
var height = window.innerHeight // use native JS not any plugin to get the right sizes
var loadingOffset = 1000


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
		var audio = new Audio()
		audio.setAttribute("src","assets/audio/button_click.mp3")
		audio.load() // required for 'older' browsers

		// show the screen
		$('#init').css('display', 'block')

		// set elements
		$('#init .footer').css('top', height - $('#init .footer').height())
		var heightOfInit = $('#init .init_screen').height()
		var heightOfButtonStage =  $('#init .play_button_stage button').height()
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
		// clear any intervals
		window.clearInterval()

		$('#init').css('display', 'none')
		$('#theGame').css('display', 'none')

		// reset the game screen
		$('#theGame').html('')

		// make sure the buttons hare idden
		$('#init .play_button_stage button').css('opacity', 0)
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
		$('#theGame').append( '<p id="accelerometer">Waiting for accelerometer...</p><i id="theBall" class="icon-isight icon2x"></i>' )
		$('#theBall').css('left', ( (width/2) - $('#theBall').width() ))
		$('#theBall').css('top', 10 )

		// launch countdown window & then start game

		theGame.startGame()
		
	},

	theBall : function() {

		// where am I?
		var myHeight = $('#theBall').height()
		var myTop = parseInt($('#theBall').css('top'), 10)

		// am I at the bottom?
		if( myTop >= ( height - myHeight) ) {
			// game over
			console.log('Game over')
			clearInterval(ballInterval)
			ballInterval = 0

			appEngine.hideAll()
			appEngine.showInitScreen()
			return true
		} else {
			// move me
			console.log("move")
			console.log(myTop + ' height '+ (height - myTop))
			$('#theBall').css('top', myTop + 1)
		}
		
	},

	startGame : function() {
    	console.log('start game')
    	var watchID = null;
  		var watchMove = null;
    	
        var options = { frequency: 1 };
       watchMove = navigator.accelerometer.watchAcceleration(theGame.moveBall, theGame.onError, options); 

        ballInterval = setInterval(function() { theGame.theBall() }, ballMilliSeconds) 

	},
 
    // moveObject
    moveBall : function(acceleration) {
    	var myObj = $('#theBall');
    	var wall = $('#theGame');
    	var objPosition = myObj.position();
    	var leftBoundary = 0;
    	var topBoundary = 0;
    	var rightBoundary = wall.width() - myObj.width() - 10; // 10 represents the 10px for the margin
    	var bottomBoundary = wall.height() - myObj.height() - 10; // 10 represents the 10px for the margin

    	var element = document.getElementById('accelerometer');
        element.innerHTML = 'Acceleration X: ' + acceleration.x + '<br />' +
                            'Acceleration Y: ' + acceleration.y + '<br />' +
                            'Acceleration Z: ' + acceleration.z + '<br />' + 
                            'Timestamp: '      + acceleration.timestamp + '<br />';

    	/*
    	
    	if( acceleration.x < 0 && objPosition.left <= rightBoundary ) {
    		myObj.animate({
    			left:'+=2'
    		},3);
    	} else if( acceleration.x > 0 && objPosition.left > leftBoundary ) {
    		myObj.animate({
    			left:'-=2'
    		},3);
    	}
    	if( acceleration.y < 0 && objPosition.top > topBoundary ) {
    		myObj.animate({
    			top:'-=2'
    		},3);
    	} else if(acceleration.y > 0 && objPosition.top <= bottomBoundary ) {
    		myObj.animate({
    			top:'+=2'
    		},3);
    	}

    	*/
    },

    onError : function() {
        alert('onError!');
    }


} // end the ball

