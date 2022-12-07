export default class Modal {
    constructor({ container }) {
        this.container = container;

        this.container.addEventListener('click', this.handleClickOpen.bind(this));
    }

    render() {
        this.renderLayout();

        this.addEventListeners();
    }

    onOpenModal() {

    }

    getRefs(modalEl) {
        this.contentContainerEl = modalEl.querySelector(".modal__content");
        this.closeEl = modalEl.querySelector(".modal__close-button");
        this.overlayEl = modalEl.querySelector(".modal__overlay");
    }

    renderLayout() {
        this.modalEl = document.createElement("div");
        this.modalEl.classList.add("modal");

        const layout = `
            <div class="modal__overlay"></div>
            <div class="modal__content-container">
                <div class="modal__close-button">
                    x
                </div>
                <div class="modal__content">
                
                </div>
            </div> 
        `;

        this.modalEl.insertAdjacentHTML("beforeend", layout);
        document.body.append(this.modalEl);

        const contenEl = this.renderContent();

        this.getRefs(this.modalEl);
        this.contentContainerEl.append(contenEl);

        setTimeout(() => {
            this.modalEl.classList.add("open");
        },0)
    }

    renderContent() {
        return document.createElement("div");
    }

    handleClickOpen() {
        this.onOpenModal();
        this.render();
    }

    onCloseModal() {
        this.modalEl.classList.remove("open");

        setTimeout(() => {
            this.modalEl.remove();
        }, 400);
    }

    addEventListeners() {
        this.closeEl.addEventListener('click', this.onCloseModal.bind(this));
        this.overlayEl.addEventListener('click', this.onCloseModal.bind(this))
    }
}

// import Modal from "./modal";

// export class ModalTrailer extends Modal {
//     renderContent() {
//         const el = document.createElement("div");

//         el.classList.add("trailer-content");
//         el.innerHTML = "Some trailer";

//         return el;
//     }
// }

// const studentsEl = document.querySelector('#studens');

// new ModalTrailer({ container: studentsEl });