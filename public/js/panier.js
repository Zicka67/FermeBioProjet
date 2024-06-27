document.addEventListener('DOMContentLoaded', function() {
    // Sélectionne les éléments du DOM nécessaires pour le panier
    var cartSidebar = document.getElementById('cartSidebar');
    var pageOverlay = document.getElementById('pageOverlay');
    var pickupDetailsPage = document.querySelector('.pickup-details-page'); // Ajouté
    var cartTotalElement = document.getElementById('cart-total');
    var calendarCartTotalElement = document.getElementById('calendar-cart-total');
    var cartTotal = cartTotalElement ? cartTotalElement.getAttribute('data-total') : 0;

    // Fonction pour mettre à jour le total du panier
    function updateCartTotal() {
        fetch('/get-cart-total', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                cartTotal = data.cartTotal;  // Mettre à jour la variable
                var formattedTotal = cartTotal.toFixed(2).replace('.', ',') + ' €';
                // Met à jour les éléments du DOM avec le nouveau total
                if (cartTotalElement) {
                    cartTotalElement.innerText = formattedTotal;
                }
                if (calendarCartTotalElement) {
                    calendarCartTotalElement.innerText = formattedTotal;
                }
            } else {
                console.error('Erreur lors de la mise à jour du total du panier:', data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    // Fonction pour ouvrir/fermer le panier
    window.toggleCart = function() {
        var isOpen = cartSidebar.classList.toggle('open');
        if (isOpen) {
            pageOverlay.classList.add('open');
        } else {
            pageOverlay.classList.remove('open');
        }
    }

    // Ajoute des écouteurs d'événements pour ouvrir/fermer le panier
    var toggleCartButtons = document.querySelectorAll('.toggle-cart');
    toggleCartButtons.forEach(function(button) {
        button.addEventListener('click', toggleCart);
    });

    // Ferme le panier et le calendrier lorsqu'on clique en dehors
    pageOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
        pageOverlay.classList.remove('open');
        if (pickupDetailsPage) { // Ajouté
            pickupDetailsPage.classList.remove('open');
        }
    });

    // Met à jour le total du panier après modification des quantités
    document.querySelectorAll('.quantity-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            setTimeout(updateCartTotal, 100);  // Délai pour attendre la mise à jour de l'interface
        });
    });

    // Met à jour le total du panier à l'ouverture de la page
    updateCartTotal();
});
