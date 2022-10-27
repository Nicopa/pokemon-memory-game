import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './deck/card/card.component';
import { ModalComponent } from './modal/modal.component';
import { DeckComponent } from './deck/deck.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
	declarations: [
		AppComponent,
		BoardComponent,
		CardComponent,
		ModalComponent,
		DeckComponent,
  TimerComponent,
	],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
