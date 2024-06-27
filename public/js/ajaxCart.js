document.addEventListener('DOMContentLoaded', function() {
    console.log('Script chargé');

    // Fonction pour mettre à jour l'interface utilisateur du panier
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
    }

    // Fonction pour mettre à jour la quantité d'un produit
    function updateQuantity(productId, action) {
        console.log('updateQuantity appelé:', productId, action);
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
                // Met à jour l'interface utilisateur du panier après modification
                updateCartUI(data.cart, data.cartTotal);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Fonction pour réinitialiser le panier
    function resetCart() {
        console.log('Réinitialisation du panier');
        fetch('/reset-cart', {
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
                // Met à jour l'interface utilisateur du panier après réinitialisation
                updateCartUI([], 0);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Fonction pour attacher les écouteurs d'événements aux boutons de quantité et de réinitialisation
    function attachEventListeners() {
        console.log('Attaching event listeners');
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const productId = this.dataset.productId;
                const action = this.classList.contains('increment') ? 'increment' : 'decrement';
                console.log('Button clicked:', productId, action);
                updateQuantity(productId, action);
            });
        });

        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', function(event) {
                event.preventDefault();
                resetCart();
            });
        }
    }

    // Attache les écouteurs d'événements au chargement de la page
    attachEventListeners();
});
