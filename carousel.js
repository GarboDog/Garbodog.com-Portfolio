class Carousel {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        this.images = images;
        this.currentIndex = 0;

        this.imgElement = this.container.querySelector('.carousel-image');
        this.nextImgElement = this.container.querySelector('.carousel-side-image.next');
        this.prevImgElement = this.container.querySelector('.carousel-side-image.previous');
        this.leftButton = this.container.querySelector('.carousel-button.left');
        this.rightButton = this.container.querySelector('.carousel-button.right');

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
    'Gallery Imgs/image1.jpg',
    'Gallery Imgs/image2.jpg',
    'Gallery Imgs/image3.jpg',
    'Gallery Imgs/image4.jpg'
];

const carousel2Images = [
    'Gallery Imgs/image3.jpg',
    'Gallery Imgs/image4.jpg',
    'Gallery Imgs/image1.jpg',
    'Gallery Imgs/image2.jpg',
];

document.addEventListener('DOMContentLoaded', () => {
    new Carousel('carousel1', carousel1Images);
    new Carousel('carousel2', carousel2Images);
});
