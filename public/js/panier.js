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
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length > 0) {
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
                updateCartUI([], 0);
            } else {
                console.error('Erreur lors de la réinitialisation du panier:', data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    function updateCartUI(cart, cartTotal) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartTotalElements = document.querySelectorAll('#cart-total, #calendar-cart-total');
    
        // Efface les articles actuels du panier
        const cartItems = cartSidebar.querySelectorAll('.cart-item');
        cartItems.forEach(item => item.remove());
    
        // Supprime les messages de panier vide existants
        const emptyCartMessages = cartSidebar.querySelectorAll('.empty-cart-message');
        emptyCartMessages.forEach(message => message.remove());
    
        // Met à jour les articles du panier
        if (cart.length > 0) {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <div>
                            <strong>${item.product.name}</strong><br>
                            ${item.product.productPrice} €
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrement" data-product-id="${item.product.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increment" data-product-id="${item.product.id}">+</button>
                        <span class="total-price-for-item">${(item.product.productPrice * item.quantity).toFixed(2)} €</span>
                    </div>
                `;
                cartSidebar.insertBefore(cartItem, cartSidebar.querySelector('.cart-footer'));
            });
    
            // Met à jour tous les éléments affichant le total du panier
            cartTotalElements.forEach(element => {
                if (element) {
                    element.innerText = `${cartTotal.toFixed(2).replace('.', ',')} €`;
                }
            });
        } else {
            // Affiche le message de panier vide
            const emptyMessage = document.createElement('p');
            emptyMessage.classList.add('empty-cart-message');
            emptyMessage.innerText = 'Votre panier est vide.';
            cartSidebar.insertBefore(emptyMessage, cartSidebar.querySelector('.cart-footer'));
    
            // Réinitialise le total du panier à 0 lorsque le panier est vide
            cartTotalElements.forEach(element => {
                if (element) {
                    element.innerText = '0,00 €';
                }
            });
        }
        // Réattache les écouteurs d'événements
        attachEventListeners();
        updatePickupButtonState();
    }

    function addToCart(productId) {
        fetch(`/add-to-cart/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                updateCartUI(data.cart, data.cartTotal);
            } else {
                console.error('Erreur lors de l\'ajout au panier:', data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }

    function updateQuantity(productId, action) {
        const url = action === 'increment'
            ? `/increment-quantity/${productId}`
            : `/decrement-quantity/${productId}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                updateCartUI(data.cart, data.cartTotal);
            } else {
                console.error('Erreur lors de la mise à jour de la quantité:', data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    function attachEventListeners() {
        // Nettoye les anciens écouteurs d'événements pour éviter les doublons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.removeEventListener('click', handleQuantityButtonClick);
            button.addEventListener('click', handleQuantityButtonClick);
        });

        if (resetButton) {
            resetButton.removeEventListener('click', handleResetButtonClick);
            resetButton.addEventListener('click', handleResetButtonClick);
        }
    }

    function handleQuantityButtonClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const productId = button.dataset.productId;
        const action = button.classList.contains('increment') ? 'increment' : 'decrement';
        updateQuantity(productId, action);
    }

    function handleResetButtonClick(event) {
        event.preventDefault();
        resetCart();
    }

    window.toggleCart = function() {
        var isOpen = cartSidebar.classList.toggle('open');
        if (isOpen) {
            pageOverlay.classList.add('open');
        } else {
            pageOverlay.classList.remove('open');
        }
    }

    document.querySelectorAll('.toggle-cart').forEach(function(button) {
        button.addEventListener('click', toggleCart);
    });

    pageOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
        pageOverlay.classList.remove('open');
        if (pickupDetailsPage) {
            pickupDetailsPage.classList.remove('open');
        }
    });

    document.querySelectorAll('.add-to-cart').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const productId = this.dataset.productId;
            addToCart(productId);
        });
    });

    updateCartTotal();
    attachEventListeners();
});
