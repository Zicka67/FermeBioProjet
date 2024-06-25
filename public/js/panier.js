document.addEventListener('DOMContentLoaded', function() {
    var cartSidebar = document.getElementById('cartSidebar');
    var pageOverlay = document.getElementById('pageOverlay');
    var pickupOption = document.getElementById('pickupOption');
    var pickupDetailsPage = document.querySelector('.pickup-details-page');
    var closeCalendarButton = document.querySelector('.close-calendar');
    var calendarContainer = document.getElementById('calendarContainer');
    var selectedDate = null;
    var selectedPeriod = null;

    var cartTotalElement = document.getElementById('cart-total');
    var cartTotal = cartTotalElement ? cartTotalElement.getAttribute('data-total') : 0;

    window.toggleCart = function() {
        var isOpen = cartSidebar.classList.toggle('open');
        if (isOpen) {
            pageOverlay.classList.add('open');
        } else {
            pageOverlay.classList.remove('open');
            pickupDetailsPage.classList.remove('open');
        }
    }

    var toggleCartButtons = document.querySelectorAll('.toggle-cart');
    toggleCartButtons.forEach(function(button) {
        button.addEventListener('click', toggleCart);
    });

    pageOverlay.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
        pageOverlay.classList.remove('open');
        pickupDetailsPage.classList.remove('open');
    });

    pickupOption.addEventListener('click', function() {
        pickupDetailsPage.classList.toggle('open');
        if (pickupDetailsPage.classList.contains('open')) {
            calendarContainer.innerHTML = `
                <h2>${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Lun</th>
                            <th>Mar</th>
                            <th>Mer</th>
                            <th>Jeu</th>
                            <th>Ven</th>
                            <th>Sam</th>
                            <th>Dim</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateCalendar(new Date())}
                    </tbody>
                </table>
                <div class="cart-total">
                    <span>Vous devrez payez : </span><span>${cartTotal}0 €</span>
                </div>
                <button id="validateOrderButton" class="validate-order-button">Valider la commande</button>
            `;

            document.querySelectorAll('.time-slot-button').forEach(button => {
                button.addEventListener('click', function() {
                    selectedDate = this.dataset.date;
                    selectedPeriod = this.dataset.period;

                    document.getElementById('validateOrderButton').classList.add('show');
                });
            });

            document.getElementById('validateOrderButton').addEventListener('click', function() {
                if (selectedDate && selectedPeriod) {
                    fetch('/reserve-slot', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            date: selectedDate,
                            period: selectedPeriod,
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            // Redirection vers la page de succès
                            window.location.href = data.redirectUrl;
                        } else {
                            alert('Erreur lors de la réservation : ' + (data.message || 'undefined'));
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Une erreur est survenue lors de la réservation.');
                    });
                }
            });
        }
    });

    closeCalendarButton.addEventListener('click', function() {
        pickupDetailsPage.classList.remove('open');
    });

    function generateCalendar(currentDate) {
        let daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        firstDayOfMonth = (firstDayOfMonth + 6) % 7; // Commencer la semaine le lundi

        let calendarHTML = '';
        let day = 1;
        for (let i = 0; i < 6; i++) { // 6 semaines affichées en calendrier
            calendarHTML += '<tr>';
            for (let j = 0; j < 7; j++) { // 7 jours par semaine
                if (i === 0 && j < firstDayOfMonth) {
                    calendarHTML += '<td></td>';
                } else if (day <= daysInMonth) {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);  // Ajout du +1 pour "contrer" le bug

                    calendarHTML += `
                        <td class="${currentDate.getDate() === day ? 'today' : ''} td-hover">
                            <div class="date">${day}</div>
                            <div class="slots">
                                <button class="slot morning time-slot-button" data-date="${date.toISOString().split('T')[0]}" data-period="Matin">Matin</button>
                                <button class="slot afternoon time-slot-button" data-date="${date.toISOString().split('T')[0]}" data-period="Après-midi">Après-midi</button>
                            </div>
                        </td>`;
                    day++;
                } else {
                    calendarHTML += '<td></td>';
                }
            }
            calendarHTML += '</tr>';
        }
        return calendarHTML;
    }
});
