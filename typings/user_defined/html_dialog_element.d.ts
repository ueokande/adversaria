interface HTMLDialogElement extends HTMLElement {
  show(): void;
  showModal(): void;
  close(): void;
}

declare var HTMLDialogElement: {
  prototype: HTMLDialogElement;
  new(): HTMLDialogElement;
}
