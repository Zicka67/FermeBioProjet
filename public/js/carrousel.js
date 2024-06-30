let currentImageIndex = 0;
const images = document.querySelectorAll('.carousel img');

function showNextImage() {
    images[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}

function showPrevImage() {
    images[currentImageIndex].classList.remove('active');
    // Ajout de la condition pour gérer l'index négatif
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    images[currentImageIndex].classList.add('active');
}

// Fonction pour le bouton "Next"
function nextImage() {
    // Réinitialise le timer pour que l'image suivante s'affiche après 5 secondes après le clic
    clearInterval(autoSlideInterval);
    showNextImage();
    autoSlideInterval = setInterval(showNextImage, 5000);
}

// Fonction pour le bouton "Prev"
function prevImage() {
    // Réinitialise le timer pour que l'image suivante s'affiche après 5 secondes après le clic
    clearInterval(autoSlideInterval);
    showPrevImage();
    autoSlideInterval = setInterval(showNextImage, 5000);
}

// Initialisation de l'intervalle pour changer d'image toutes les 5 secondes
let autoSlideInterval = setInterval(showNextImage, 5000);
