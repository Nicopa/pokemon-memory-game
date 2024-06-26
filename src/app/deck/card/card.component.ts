import { Component, Input } from '@angular/core';
import { Card } from 'src/app/game/card';

@Component({
	selector: 'app-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss'],
})
export class CardComponent {
	@Input() card: Card | null = null;
}
