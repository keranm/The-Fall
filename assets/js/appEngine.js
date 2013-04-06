//
//   SETUP THE GAME ENGINE
//     Keran McKenzie 2013
//

// the VARIABLES
var width = window.innerWidth
var height = window.innerHeight // use native JS not any plugin to get the right sizes
var loadingOffset = 1000


$(document).ready(function(){

	// okay lets go
	appEngine.init()

}) // end of the get ready


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
		$('#init .init_screen').css('top', (height/2) - ( heightOfInit - heightOfButtonStage ) )
		$('#init .play_button_stage button').css('width', width - 40 )

		// animate the heading up and show the play button
		setTimeout(function() { 
			console.log('show')
			$('#init .init_screen').animate({
			    top: (height/2) - ( heightOfInit )
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
	},
	
} // this is the appEngine

