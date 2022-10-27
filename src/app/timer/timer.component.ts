import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-timer',
	templateUrl: './timer.component.html',
	styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
	private _isPlaying: boolean = false;
	private _startTime!: Date;
	hours: number = 0;
	minutes: number = 0;
	seconds: number = 0;

	constructor() {}

	private clock() {
		setTimeout(() => {
			const diff = new Date().getTime() - this._startTime.getTime();
			this.setTime(diff);
			if (this._isPlaying) this.clock();
		});
	}

	private setTime(miliseconds: number) {
		this.hours = Math.floor(miliseconds / 1000 / 60 / 60);
		this.minutes = Math.floor((miliseconds / 1000 / 60) % 60);
		this.seconds = Math.floor(((miliseconds / 1000) % 60) % 60);
	}

	start() {
		this._isPlaying = true;
		this._startTime = new Date();
		this.clock();
	}

	stop() {
		this._isPlaying = false;
	}

	reset() {
		this._startTime = new Date();
	}

	getTime() {
		let time = '';
		if (this.hours) time += this.hours.toString() + ' hours, ';
		if (this.minutes) time += this.minutes.toString() + ' minutes and ';
		time += this.seconds.toString() + ' seconds';
		return time;
	}
}
