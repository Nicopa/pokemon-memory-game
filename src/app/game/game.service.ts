import { EventEmitter, Injectable } from "@angular/core";
import { Card } from "./card";
import pokemons from 'src/assets/pokemon-list.json';
import { TimerService } from "../timer/timer.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    cards: Array<Card> = pokemons.list.map((pokemon) => ({
		...pokemon,
		faceUp: true,
		scored: false,
	}));
    selectedPokemons: Array<{ index: number; pokemonNumber: number; }> = [];
	canPlay: boolean = false;
    fails = 0;
	duration: string = '';
	isPlaying: boolean = false;
    readonly newGameStartedEvent = new EventEmitter();
    readonly cardFlippedUpEvent = new EventEmitter<number>();
    readonly failedEvent = new EventEmitter();
    readonly scoredEvent = new EventEmitter();
    readonly wonEvent = new EventEmitter();
    constructor(
        private readonly timerService: TimerService
    ) {}
    flipUpCard(index: number) {
        this.cards[index].faceUp = true;
        this.cardFlippedUpEvent.emit(index);
        if (!this.selectedPokemons.find((pokemon) => pokemon.index === index))
            this.selectedPokemons.push({
            index,
            pokemonNumber: this.cards[index].number
        });
        this.checkEvolution();
    }
    onCardClick(index: number) {
		if (this.canPlay && !this.cards[index].scored) {
			this.flipUpCard(index);
		}
	}
    flipDownRevealedCards(indexes: number[]) {
		this.canPlay = false;
		setTimeout(() => {
			indexes.forEach((index) => {
				if (!this.cards[index].scored)
					this.cards[index].faceUp = false;
			});
			this.canPlay = true;
		}, 2000);
	}
    flipDownAllCards() {
		this.cards.forEach((card) => {
			card.faceUp = false;
		});
	}
	checkEndGame() {
		for (let i = 0; i < this.cards.length; i++) {
			if (!this.cards[i].scored) return false;
		}
		this.isPlaying = false;
		this.timerService.stop();
		this.duration = this.timerService.getTime();
		return true;
	}
    scoreCards() {
		this.cards.forEach((card) => {
			if (card.faceUp && !card.scored) card.scored = true;
		});
		this.canPlay = true;
		this.scoredEvent.emit();
		if (this.checkEndGame()) {
			this.wonEvent.emit();
			this.canPlay = false;
		}
	}
	checkEvolution() {
		if (!this.selectedPokemons.length) return;
		for (const evolution of pokemons.evolutions) {
			if (evolution.includes(this.selectedPokemons[0].pokemonNumber)) {
				for (let j = 1; j < this.selectedPokemons.length; j++) {
					if (!evolution.includes(this.selectedPokemons[j].pokemonNumber)) {
                        this.failedEvent.emit();
						this.flipDownRevealedCards(this.selectedPokemons.map((pokemon) => pokemon.index));
						this.clearSelections();
						return;
					}
				}
				if (evolution.length === this.selectedPokemons.length) {
					this.scoreCards();
					this.clearSelections();
				}
				return;
			}
		}
	}
    setRandomCards(quantity: number) {
		this.cards = [];
		let randomIndex: number;
		while (this.cards.length != quantity) {
			randomIndex = Math.floor(Math.random() * pokemons.evolutions.length);
			if (
				pokemons.evolutions[randomIndex].length === 1 &&
				this.cards.length <= quantity - 8
			)
				continue;
			if (pokemons.evolutions[randomIndex].length + this.cards.length > quantity)
				continue;
			if (
				this.cards.filter(
					(pokemon) => pokemon.number == pokemons.evolutions[randomIndex][0]
				).length === 0
			) {
				for (const number of pokemons.evolutions[randomIndex]) {
					const pokemon = pokemons.list.find((pokemon) => pokemon.number === number);
					if (pokemon)
						this.cards.push({
							...pokemon,
							faceUp: true,
							scored: false,
						} as Card);
				}
			}
		}
	}
    shuffleCards() {
		let currentIndex = this.cards.length;
		let randomIndex;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[this.cards[currentIndex], this.cards[randomIndex]] = [
				this.cards[randomIndex],
				this.cards[currentIndex],
			];
		}
	}
    clearSelections() {
		this.selectedPokemons = [];
	}
    onFail() {
		this.fails++;
	}
    startNewGame() {
		this.isPlaying = true;
		this.setRandomCards(30);
		this.shuffleCards();
		this.fails = 0;
		if (this.timerService) {
			this.timerService.stop();
			this.timerService.reset();
		}
		this.newGameStartedEvent.emit();
		setTimeout(() => {
			this.flipDownAllCards();
			this.canPlay = true;
			if (this.timerService) this.timerService.start();
		}, 4000);
	}
}