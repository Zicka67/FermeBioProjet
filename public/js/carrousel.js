let currentImageIndex = 0;
const images = document.querySelectorAll('.carousel img');
const dynamicTitle = document.getElementById('dynamicTitle');
const dynamicDescription = document.getElementById('dynamicDescription');
const dynamicButton = document.getElementById('dynamicButton');

function updateDynamicText() {
    const currentImage = images[currentImageIndex];
    const textId = currentImage.dataset.id;
    const text = dynamicTexts.find(t => t.id == textId);
    
    if (text) {
        dynamicTitle.textContent = text.blurredSectionTitle;
        dynamicDescription.textContent = text.blurredSectionText;
        dynamicButton.textContent = text.buttonText;
    }
}

function showNextImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
    updateDynamicText();
}

function showPrevImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    images[currentImageIndex].classList.add('active');
    updateDynamicText();
}

function nextImage() {
    clearInterval(autoSlideInterval);
    showNextImage();
    autoSlideInterval = setInterval(showNextImage, 5000);
}

function prevImage() {
    clearInterval(autoSlideInterval);
    showPrevImage();
    autoSlideInterval = setInterval(showNextImage, 5000);
}

let autoSlideInterval = setInterval(showNextImage, 5000);

// Initialize dynamic text on page load
updateDynamicText();