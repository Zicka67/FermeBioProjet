document.addEventListener('DOMContentLoaded', function() {
    var cartSidebar = document.getElementById('cartSidebar');
    var pageOverlay = document.getElementById('pageOverlay');
    var pickupDetailsPage = document.querySelector('.pickup-details-page');
    var cartTotalElement = document.getElementById('cart-total');
    var calendarCartTotalElement = document.getElementById('calendar-cart-total');
    var pickupOption = document.getElementById('pickupOption');
    var resetButton = document.getElementById('reset-button');
    var cartTotal = cartTotalElement ? parseFloat(cartTotalElement.textContent.replace(',', '.')) : 0;

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
                cartTotal = data.cartTotal;
                var formattedTotal = cartTotal.toFixed(2).replace('.', ',') + ' €';
                if (cartTotalElement) {
                    cartTotalElement.innerText = formattedTotal;
                }
                if (calendarCartTotalElement) {
                    calendarCartTotalElement.innerText = formattedTotal;
                }
                updatePickupButtonState();
            } else {
                console.error('Erreur lors de la mise à jour du total du panier:', data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    function updatePickupButtonState() {
        if (cartTotal > 0) {
            pickupOption.classList.remove('button-disabled');
        } else {
            pickupOption.classList.add('button-disabled');
        }
    }

    function resetCart() {
        fetch('/reset-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Mettre à jour l'interface utilisateur après la réinitialisation du panier
                document.querySelector('.empty-cart-message').style.display = 'block';
                cartTotal = 0; // Mise à jour de la variable cartTotal
                cartTotalElement.innerText = '0,00 €';
                if (calendarCartTotalElement) {
                    calendarCartTotalElement.innerText = '0,00 €';
                }
                updatePickupButtonState();
            } else {
                console.error('Erreur lors de la réinitialisation du panier:', data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    window.toggleCart = function() {
        var isOpen = cartSidebar.classList.toggle('open');
        if (isOpen) {
            pageOverlay.classList.add('open');
        } else {
            pageOverlay.classList.remove('open');
        }
    }

    var toggleCartButtons = document.querySelectorAll('.toggle-cart');
    toggleCartButtons.forEach(function(button) {
        button.addEventListener('click', toggleCart);
    });

    pageOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
        pageOverlay.classList.remove('open');
        if (pickupDetailsPage) {
            pickupDetailsPage.classList.remove('open');
        }
    });

    document.querySelectorAll('.quantity-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            setTimeout(updateCartTotal, 100);
        });
    });

    if (resetButton) {
        resetButton.addEventListener('click', function() {
            resetCart();
        });
    }

    updateCartTotal();
});
