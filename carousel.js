class Carousel {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID '${containerId}' not found.`);
            return;
        }
        this.images = images;
        this.currentIndex = 0;

        this.imgElement = this.container.querySelector('.carousel-image');
        this.nextImgElement = this.container.querySelector('.carousel-side-image.next');
        this.prevImgElement = this.container.querySelector('.carousel-side-image.previous');
        this.leftButton = this.container.querySelector('.carousel-button.left');
        this.rightButton = this.container.querySelector('.carousel-button.right');

        if (!this.imgElement || !this.nextImgElement || !this.prevImgElement || !this.leftButton || !this.rightButton) {
            console.error('One or more carousel elements are missing.');
            return;
        }

        this.leftButton.addEventListener('click', () => this.previousImage());
        this.rightButton.addEventListener('click', () => this.nextImage());

        this.updateImages();
    }

    updateImages() {
        this.imgElement.src = this.images[this.currentIndex];
        const nextIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
        this.nextImgElement.src = this.images[nextIndex];
        const prevIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
        this.prevImgElement.src = this.images[prevIndex];
    }

    previousImage() {
        this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
        this.updateImages();
    }

    nextImage() {
        this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
        this.updateImages();
    }
}

// Initialize carousels with different images
const carousel1Images = [
    'Gallery Imgs/FB Purell.png',
    'Gallery Imgs/FB Crix Died.png',
    'Gallery Imgs/FB Scouty and Parker.png',
    'Gallery Imgs/FB Chibi pfp for Iciekun.png',
    'Gallery Imgs/FB Gothfield.png'
];

const carousel2Images = [
    'Gallery Imgs/Em Bobzy Sweep.gif',
    'Gallery Imgs/Em AngelGG Sad.png',
    'Gallery Imgs/Em Jack Point.png',
    'Gallery Imgs/Em Reznoxero Excited.gif'
];

const carousel3Images = [
    'Gallery Imgs/HB darmill animated PNG Tuber.gif',
    'Gallery Imgs/HB Birb eating ramen for Sasha.png',
    'Gallery Imgs/HB Garbodog.png',
    'Gallery Imgs/HB for Hydro.exe.png',
    'Gallery Imgs/HB Tee Surprise.png'
];

const carousel4Images = [
    'Gallery Imgs/Sk Aaliyah This Is Fine.png',
    'Gallery Imgs/Sk Aaliyah Spoopy.gif',
    'Gallery Imgs/Sk SuperDasher Goober.png'
];

const carousel5Images = [
    'Gallery Imgs/HS Speed DCA for mattiethematt.png',
    'Gallery Imgs/HS Jacks Logo.png'
];

const carousel6Images = [
    'Gallery Imgs/HS Speed DCA for mattiethematt.png',
    'Gallery Imgs/FB Purell.png',
    'Gallery Imgs/HB darmill animated PNG Tuber.gif',
    'Gallery Imgs/Em Reznoxero Excited.gif',
    'Gallery Imgs/FB Crix Died.png',
    'Gallery Imgs/Sk Aaliyah Spoopy.gif'
];

document.addEventListener('DOMContentLoaded', () => {
    const carousels = [
        { id: 'carousel1', images: carousel1Images },
        { id: 'carousel2', images: carousel2Images },
        { id: 'carousel3', images: carousel3Images },
        { id: 'carousel4', images: carousel4Images },
        { id: 'carousel5', images: carousel5Images },
        { id: 'carousel6', images: carousel6Images }
    ];

    carousels.forEach(({ id, images }) => {
        const container = document.getElementById(id);
        if (container) {
            new Carousel(id, images);
        } else {
        }
    });
});
