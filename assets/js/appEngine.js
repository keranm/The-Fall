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

		// place the footer
		$('#init .footer').css('top', height - $('#init .footer').height())

		// place the init_screen
		$('#init .init_screen').css('top', (height/2) - $('#init .init_screen').height())
	},

	// function to hide every screen
	hideAll : function() {
		$('#init').css('display', 'none')
	},
	
} // this is the appEngine

