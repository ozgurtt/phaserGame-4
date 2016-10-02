var Player = (function(){
	function Player(game, x, y){
		Phaser.Sprite.call(this, game, x, y,'billy_sheet');

		game.physics.arcade.enable(this);
		this.playerDeltaVelocity = 60;
		//this.scale.setTo(1.1, 1.1);

		//define player's input keys
		
		this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.punchKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
		this.cursors = game.input.keyboard.createCursorKeys();
		
		//define player's animations
		this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 3, '', 1), 3, true);
		this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 0, 2, '', 1), 15, false);
		this.animations.add('walkForward', Phaser.Animation.generateFrameNames('walk_forward/', 0, 5, '', 1), 8, true);
		this.animations.add('walkBackward', Phaser.Animation.generateFrameNames('walk_backward/', 0, 5, '', 1), 8, true);
		this.animations.add('punchLeft', Phaser.Animation.generateFrameNames('punch_left/', 0, 5, '', 1), 8, false);
		this.animations.add('punchRight', Phaser.Animation.generateFrameNames('punch_right/', 0, 4, '', 1), 8, false);

		//Define player's states
		var self = this;
		this.stateMachine = new StateMachine(this, {debug:true});
		this.stateMachine.add('idle', {
			enter: function(){},
			update: function(){},
			exit: function(){}
		});
		this.stateMachine.add('jump', {
			enter: function(){},
			update: function(){},
			exit: function(){}
		});
		this.stateMachine.add('punchRight', {
			enter: function(){},
			update: function(){},
			exit: function(){}
		});
		this.stateMachine.add('punchLeft', {
			enter: function(){},
			update: function(){

			},
			exit: function(){}
		});
		this.stateMachine.add('walkForward', {
			enter: function(){},
			update: function(){
				self.body.velocity.setTo(0,0);
				if(self.cursors.right.isDown){
					self.scale.x = 1;
					self.body.velocity.x = self.playerDeltaVelocity;
				}
				if(self.cursors.left.isDown){
					self.scale.x = -1;
					self.body.velocity.x = -self.playerDeltaVelocity;
				}
				if(self.cursors.up.isDown){
					if(self.body.y + self.body.width <= 150){
						self.body.y = 150 - self.body.width;
					}else
						self.body.velocity.y = -self.playerDeltaVelocity;
				}
				if(self.cursors.down.isDown){
					self.body.velocity.y = self.playerDeltaVelocity;
				}
			},
			exit: function(){
				//  Reset the players velocity (movement)
				self.body.velocity.setTo(0,0);
			}
		});
		//define player's transitions between states
		this.stateMachine.transition('', 'idle', 'walkForward', function(){
			return (self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown);
		});
		this.stateMachine.transition('', 'walkForward', 'idle', function(){
			return(!(self.cursors.down.isDown || self.cursors.up.isDown || self.cursors.left.isDown || self.cursors.right.isDown));
		});

		this.stateMachine.transition('', 'idle', 'jump', function(){
			return (self.jumpKey.isDown);
		});
		this.stateMachine.transition('', 'jump', 'idle', function(){
			return (!self.animations.currentAnim.isPlaying);
		});

		this.stateMachine.transition('', 'walkForward', 'punchLeft', function(){
			return(self.punchKey.downDuration(200));
		});
		this.stateMachine.transition('', 'idle', 'punchLeft', function(){
			return(self.punchKey.downDuration(200));
		});
		this.stateMachine.transition('', 'punchLeft', 'idle', function(){
			return(!self.animations.currentAnim.isPlaying);
		});
		this.animations.play(this.stateMachine.initialState);

		this.body.collideWorldBounds = true;
		
		this.game.add.existing(this);

		//set camera to follow player;
		game.camera.follow(this);
	}
	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.update = function(){
		
		
		this.stateMachine.update();

		/*
		var playerDeltaVelocity = 70;
		//check if Hitting NOTE: REDO !
		if(this.game.input.keyboard.isDown(Phaser.KeyCode.F)){
			this.animations.play('punchLeft', 10);
		}else{  // else check if walking
			var isMoving = false;
			if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)){   //  Move to the left
			//prevent from tracing back and keep the player 2 px from the left screen border
			if(this.body.x <= this.game.camera.x + 2){
				this.body.x = this.game.camera.x + 2;
			}else{
				this.body.velocity.x = -playerDeltaVelocity;
			}
				isMoving = true;
			}else if (this.game.input.keyboard.isDown(Phaser.KeyCode.D)){   //  Move to the right
				this.body.velocity.x = playerDeltaVelocity;

				this.animations.play('walkForward', 8);
				isMoving = true;
			}

			if (this.game.input.keyboard.isDown(Phaser.KeyCode.W)){
			if(this.body.y + this.body.width <= 142){
				this.body.y = 142 - this.body.width;
			}else{
				this.body.velocity.y = -playerDeltaVelocity;
			}
				isMoving = true;
			}else if( this.game.input.keyboard.isDown(Phaser.KeyCode.S)){
				this.body.velocity.y = playerDeltaVelocity;

				this.animations.play('walkForward', 8);
				isMoving = true;
			}
			//Play idle animation
			if(!isMoving){
				this.play('idle', 3);
			}
		}*/
	};
	return Player;
})();