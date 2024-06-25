import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TimerService {
    private _isPlaying: boolean = false;
	private _startTime!: Date;
	hours: number = 0;
	minutes: number = 0;
	seconds: number = 0;
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
		if (this.hours) time += this.hours.toString() + ` hours${this.hours > 1 ? 's' : ''} `;
		if (this.minutes) time += this.minutes.toString() + ` minute${this.minutes > 1 ? 's' : ''} and `;
		if (this.seconds || (!this.hours && !this.minutes)) time += this.seconds.toString() + ` second${this.seconds > 1 ? 's' : ''}`;
		return time;
	}
}