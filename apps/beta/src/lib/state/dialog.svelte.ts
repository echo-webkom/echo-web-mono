export class DialogState {
	isOpen = $state(false);

	open = () => (this.isOpen = true);
	close = () => (this.isOpen = false);
	toggle = () => (this.isOpen = !this.isOpen);
}
