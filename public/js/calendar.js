document.addEventListener('DOMContentLoaded', function() {
    var pickupOption = document.getElementById('pickupOption');
    var pickupDetailsPage = document.querySelector('.pickup-details-page');
    var closeCalendarButton = document.querySelector('.close-calendar');
    var calendarContainer = document.getElementById('calendarContainer');
    var validateOrderButton = document.getElementById('validateOrderButton');
    var selectedDate = null;
    var selectedPeriod = null;
    var pickupTotalElement = document.getElementById('pickupTotal');
    var currentDate = new Date();

    // Utilise un MutationObserver pour détecter les changements dans le DOM
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Réattache les événements dès qu'un changement est détecté dans le DOM
                attachEventListeners();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Attache les événements nécessaires aux éléments du DOM
    function attachEventListeners() {
        if (pickupOption) {
            // Supprime tout ancien événement avant de les réattacher
            pickupOption.removeEventListener('click', handlePickupOptionClick);
            pickupOption.addEventListener('click', handlePickupOptionClick);
        }

        if (closeCalendarButton) {
            closeCalendarButton.removeEventListener('click', handleCloseCalendar);
            closeCalendarButton.addEventListener('click', handleCloseCalendar);
        }

        if (validateOrderButton) {
            validateOrderButton.removeEventListener('click', handleValidateOrder);
            validateOrderButton.addEventListener('click', handleValidateOrder);
        }
    }

    // Gère l'ouverture de la section des détails de récupération et affiche le calendrier
    function handlePickupOptionClick() {
        pickupDetailsPage.classList.toggle('open');
        if (pickupDetailsPage.classList.contains('open')) {
            renderCalendar(currentDate);
            updatePickupTotal();
        }
    }

    // Gère la fermeture de la section des détails de récupération
    function handleCloseCalendar() {
        pickupDetailsPage.classList.remove('open');
    }

    // Gère la validation de la commande
    function handleValidateOrder() {
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
    }

    // Met à jour le total de récupération en récupérant les données du serveur
    function updatePickupTotal() {
        fetch('/get-cart-total', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                var formattedTotal = data.cartTotal.toFixed(2).replace('.', ',') + ' €';
                if (pickupTotalElement) {
                    pickupTotalElement.innerText = formattedTotal;
                }
            } else {
                console.error('Erreur lors de la mise à jour du total du panier:', data.message);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    // Génère et affiche le calendrier pour le mois donné
    function renderCalendar(date) {
        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button id="prevMonth">&lt;</button>
                <h2>${date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button id="nextMonth">&gt;</button>
            </div>
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
                    ${generateCalendar(date)}
                </tbody>
            </table>
        `;

        document.getElementById('prevMonth').addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });

        document.getElementById('nextMonth').addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });

        document.querySelectorAll('.time-slot-button').forEach(button => {
            button.addEventListener('click', function() {
                selectedDate = this.dataset.date;
                selectedPeriod = this.dataset.period;
                if (validateOrderButton) {
                    validateOrderButton.classList.add('show');
                }
            });
        });
    }

    // Génère le HTML pour le calendrier d'un mois donné
    function generateCalendar(date) {
        let daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        firstDayOfMonth = (firstDayOfMonth + 6) % 7;

        let calendarHTML = '';
        let day = 1;
        for (let i = 0; i < 6; i++) {
            calendarHTML += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDayOfMonth) {
                    calendarHTML += '<td></td>';
                } else if (day <= daysInMonth) {
                    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
                    calendarHTML += `
                        <td class="${date.getDate() === day ? 'today' : ''} td-hover">
                            <div class="date">${day}</div>
                            <div class="slots">
                                <button class="slot morning time-slot-button" data-date="${dayDate.toISOString().split('T')[0]}" data-period="Matin">Matin</button>
                                <button class="slot afternoon time-slot-button" data-date="${dayDate.toISOString().split('T')[0]}" data-period="Après-midi">Après-midi</button>
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

    // Initialise les événements et les états au chargement de la page
    attachEventListeners();
});
