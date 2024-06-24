import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalButton } from '../modal/modal.component';
import { DeckComponent } from '../deck/deck.component';
import { TimerComponent } from '../timer/timer.component';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
	@ViewChild(DeckComponent) deck!: DeckComponent;
	private _timer!: TimerComponent;
	@ViewChild('timer') set timer(value: TimerComponent) {
		if (value) {
			this._timer = value;
			this._timer.start();
		}
	}
	fails!: number;
	duration!: string;
	isPlaying: boolean = false;
	showEndGameModal: boolean = false;
	newGameAudio = new Audio('./assets/sounds/new_game.mp3');
	winAudio = new Audio('./assets/sounds/win.mp3');
	endGameModalButtons: Array<ModalButton> = [
		{
			label: 'Close',
			callback: () => {
				this.showEndGameModal = false;
			},
		},
	];
	constructor(private activatedRoute: ActivatedRoute) {}
	ngOnInit(): void {
		console.log(this.activatedRoute.snapshot.data);
		setTimeout(
			() => console.log(this.activatedRoute.snapshot.data['sounds']),
			3000
		);
		// this.audio.src = this.activatedRoute.snapshot.data['sounds'].newGame;
	}
	newGame() {
		this.deck.setRandomCards(30);
		this.deck.shuffleCards();
		this.fails = 0;
		if (this._timer) {
			this._timer.stop();
			this._timer.reset();
		}
		this.newGameAudio.play();
		setTimeout(() => {
			this.deck.flipDownAllCards();
			this.deck.canPlay = true;
			this.isPlaying = true;
			if (this._timer) this._timer.start();
		}, 4000);
	}

	onFail() {
		this.fails++;
	}

	onWin() {
		if (this.checkEndGame()) {
			this.winAudio.play();
			this.showEndGameModal = true;
			this.deck.canPlay = false;
		}
	}

	checkEndGame() {
		for (let i = 0; i < this.deck.cards.length; i++) {
			if (!this.deck.cards[i].scored) return false;
		}
		this.isPlaying = false;
		this._timer.stop();
		this.duration = this._timer.getTime();
		return true;
	}
}
