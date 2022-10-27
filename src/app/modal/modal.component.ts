import { Component, Input } from '@angular/core';

export interface ModalButton {
	label: string;
	callback: () => void;
}

@Component({
	selector: 'app-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
	@Input() title: string | null = null;
	@Input() content: any = null;
	@Input() buttons: Array<ModalButton> = [];
}
