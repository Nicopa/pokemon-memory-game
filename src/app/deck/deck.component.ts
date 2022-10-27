import { Component, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Card } from './card/card.component';
import pokemons from 'src/assets/pokemon-list.json';

@Component({
	selector: 'app-deck',
	templateUrl: './deck.component.html',
	styleUrls: ['./deck.component.scss'],
})
export class DeckComponent {
	cards: Array<Card> = pokemons.list.map((pokemon) => ({
		...pokemon,
		faceUp: true,
		scored: false,
	}));
	selectedPokemons: Array<number> = [];
	canPlay: boolean = false;
	flipCardAudio = new Audio('../../assets/sounds/flip_card.mp3');
	@Output() failEvent = new EventEmitter();
	@Output() scoreEvent = new EventEmitter();

	constructor() {}

	clearSelections() {
		this.selectedPokemons = [];
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

		/* this.cards.forEach((card) => {
			card.faceUp = true;
			card.scored = false;
		}); */

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[this.cards[currentIndex], this.cards[randomIndex]] = [
				this.cards[randomIndex],
				this.cards[currentIndex],
			];
		}
	}

	handleCardClick(index: number) {
		if (this.canPlay && !this.cards[index].scored) {
			this.cards[index].faceUp = true;
			this.flipCardAudio.play();
			if (!this.selectedPokemons.includes(this.cards[index].number))
				this.selectedPokemons.push(this.cards[index].number);
			this.checkEvolution();
		}
	}

	flipDownRevealedCards() {
		this.failEvent.emit();
		this.canPlay = false;
		setTimeout(() => {
			this.cards.forEach((card) => {
				if (!card.scored) card.faceUp = false;
			});
			this.canPlay = true;
		}, 2000);
	}

	flipDownAllCards() {
		this.cards.forEach((card) => {
			card.faceUp = false;
		});
	}

	/* flipUpCards() {
		this.cards.forEach((card) => {
			card.faceUp = true;
		});
	} */

	scoreCards() {
		this.cards.forEach((card) => {
			if (card.faceUp && !card.scored) card.scored = true;
		});
		this.canPlay = true;
		this.scoreEvent.emit();
	}

	checkEvolution() {
		if (this.selectedPokemons.length > 0) {
			for (let i = 0; i < pokemons.evolutions.length; i++) {
				if (pokemons.evolutions[i].includes(this.selectedPokemons[0])) {
					for (let j = 1; j < this.selectedPokemons.length; j++) {
						if (!pokemons.evolutions[i].includes(this.selectedPokemons[j])) {
							this.flipDownRevealedCards();
							this.clearSelections();
						}
					}
					if (pokemons.evolutions[i].length == this.selectedPokemons.length) {
						this.scoreCards();
						this.clearSelections();
					}
					return;
				}
			}
		}
	}
}
