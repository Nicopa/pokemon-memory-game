import { Component } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
	selector: 'app-deck',
	templateUrl: './deck.component.html',
	styleUrls: ['./deck.component.scss'],
})
export class DeckComponent {
	constructor(readonly gameService: GameService) {}
}
