import { Component, HostBinding, OnInit } from '@angular/core';
import { ModalButton } from '../modal/modal.component';
import { GameService } from '../game/game.service';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
	showEndGameModal = false;
	showHeader = true;
	gameIsActive = false;
	@HostBinding('class') class = '';
	readonly audio = {
		flipCard: new Audio('./assets/sounds/flip_card.mp3'),
		newGame: new Audio('./assets/sounds/new_game.mp3'),
		win: new Audio('./assets/sounds/win.mp3'),
	};
	constructor(readonly gameService: GameService) {}
	ngOnInit(): void {
		this.gameService.newGameStartedEvent.subscribe(() => {
			this.audio.newGame.play();
		});
		this.gameService.cardFlippedUpEvent.subscribe(() => {
			this.audio.flipCard.play();
		});
		this.gameService.wonEvent.subscribe(() => {
			this.showEndGameModal = true;
			this.audio.win.play();
		});
	}
	setGameActive() {
		this.gameIsActive = true;
		this.class = 'game-active';
	}
	setGameInactive() {
		this.gameIsActive = false;
		this.class = '';
	}
	endGameModalButtons: Array<ModalButton> = [
		{
			label: 'Close',
			callback: () => {
				this.setGameInactive();
				this.showHeader = true;
				this.showEndGameModal = false;
			},
		},
	];
	onNewGameClick() {
		this.gameService.startNewGame();
		this.setGameActive();
		this.showHeader = false;
		this.showEndGameModal = false;
	}
	onCollapseClick() {
		this.showHeader = !this.showHeader;
	}
}
