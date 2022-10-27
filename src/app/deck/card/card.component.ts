import { Component, Input, OnInit } from '@angular/core';

export type Card = {
	number: number;
	name: string;
	image: string;
	type: string;
	faceUp: boolean;
	scored: boolean;
};

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent {
	constructor() {}

	@Input() card: Card | null = null;
}
