function PlayGround(selector_ch1,x,y,action,default_action)
{
	var ch1 = new Character(selector_ch1,x,y,action,default_action);

	this.initialize = function() {
		$(document).keydown(function(e) {
			if(e.keyCode == 39) {
				ch1.updateAction("RIGHT");
			}
			else if(e.keyCode == 37) {
				ch1.updateAction("LEFT");
			}
			else if(e.keyCode == 38) {
				ch1.updateAction("UP");
			}
			else if(e.keyCode == 40) {
				ch1.updateAction("DOWN");
			}
			else if(e.keyCode == 32) {
				ch1.updateAction("INTERACT");
			}

		});
	}

	this.mainLoop = function()
	{
		ch1.drawCharacter();
		this.character = ch1;
	}

	this.character = ch1;
};

function Character(selector,x,y,action,default_action)
{

	var selector = selector;

	var constants = {
		'DEFAULT' : { 'x' : 0 , 'y' : [0] },
		'DOWN' : { 'x' : 0, 'y' : [0,1,2,0] },
		'LEFT' : { 'x' : 1, 'y' : [0,1,2,0] },
		'UP' : { 'x' : 2, 'y' : [0,1,2,0] },
		'RIGHT' : { 'x' : 3, 'y' : [0,1,2,0] },
	}

	var counter = 2;
	this.action = action
	this.ch_x = x; //x coord
	this.ch_y = y; //y coord
	var default_action = default_action;

	this.drawSprite = function()
	{

		if (default_action == true){
			if (this.action =="DOWN"){
				$('#'+selector).css('background', "url('../images/" + selector + "/standing_down.png')")
			}
			if (this.action =="UP"){
				$('#'+selector).css('background', "url('../images/" + selector + "/standing_up.png')")
			}
			if (this.action =="LEFT"){
				$('#'+selector).css('background', "url('../images/" + selector + "/standing_left.png')")
			}
			if (this.action =="RIGHT"){
				$('#'+selector).css('background', "url('../images/" + selector + "/standing_right.png')")
			}
			default_action = false;
		}
		if (this.action=='UP' && counter == 0){ 
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_up1.png')").css('top',this.ch_y+"px");
		}
		else if (this.action=='UP' && counter == 1){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_up2.png')").css('top',this.ch_y+"px");
		}
		else if (this.action=='UP' && counter == 2){
			$('#'+selector).css('background', "url('../images/" + selector + "/standing_up.png')").css('top',this.ch_y+"px");
		}


		else if (this.action=='DOWN' && counter == 0){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_down1.png')").css('top',this.ch_y+"px");
		}
		else if (this.action=='DOWN' && counter == 1){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_down2.png')").css('top',this.ch_y+"px");
		}
		else if (this.action=='DOWN' && counter == 2){
			$('#'+selector).css('background', "url('../images/" + selector + "/standing_down.png')").css('top',this.ch_y+"px");
		}

		
		else if (this.action=='LEFT' && counter == 0){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_left1.png')").css('left',this.ch_x+"px");
		}
		else if (this.action=='LEFT' && counter == 1){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_left2.png')").css('left',this.ch_x+"px");
		}
		else if (this.action=='LEFT' && counter == 2){
			$('#'+selector).css('background', "url('../images/" + selector + "/standing_left.png')").css('left',this.ch_x+"px");
		}

		else if (this.action=='RIGHT' && counter == 0){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_right1.png')").css('left',this.ch_x+"px");
		}
		else if (this.action=='RIGHT' && counter == 1){
			$('#'+selector).css('background', "url('../images/" + selector + "/walking_right2.png')").css('left',this.ch_x+"px");
		}
		else if (this.action=='RIGHT' && counter == 2){
			$('#'+selector).css('background', "url('../images/" + selector + "/standing_right.png')").css('left',this.ch_x+"px");
		}


	}

	this.updateAction = function(action)
	{
		counter=0;
		this.action = action;
	}

	this.updateCoordinate = function()
	{
		if(counter>2)
		{
			//stop
		}


		else if(this.action == 'LEFT' && this.ch_x > 120) 
		{
			this.ch_x = this.ch_x-5;
			counter += 1;
		}
		else if(this.action == 'RIGHT' && this.ch_x < 940)
		{
			this.ch_x = this.ch_x+5;
			counter += 1;
		}
		else if(this.action == 'UP' && this.ch_y > 70)
		{
			this.ch_y = this.ch_y-5;
			counter += 1;
		}
		else if(this.action == 'DOWN' && this.ch_y < 215)
		{
			this.ch_y = this.ch_y+5;
			counter += 1;
		}
	}

	this.drawCharacter = function()
	{
		this.updateCoordinate();
		this.drawSprite();
	}



}
