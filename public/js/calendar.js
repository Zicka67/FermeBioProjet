document.addEventListener('DOMContentLoaded', function() {
    // Sélectionne les éléments du DOM nécessaires pour le calendrier
    var pickupOption = document.getElementById('pickupOption');
    var pickupDetailsPage = document.querySelector('.pickup-details-page');
    var closeCalendarButton = document.querySelector('.close-calendar');
    var calendarContainer = document.getElementById('calendarContainer');
    var selectedDate = null;
    var selectedPeriod = null;
    var pickupTotalElement = document.getElementById('pickupTotal');

    // Fonction pour mettre à jour le total à récupérer
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

    // Ouvre/ferme la page des détails de récupération
    if (pickupOption && !pickupOption.classList.contains('button-disabled')) {
        pickupOption.addEventListener('click', function () {
            pickupDetailsPage.classList.toggle('open');
            if (pickupDetailsPage.classList.contains('open')) {
                // Génère le calendrier à l'ouverture
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
                `;

                // Ajoute des écouteurs d'événements aux boutons de créneaux horaires
                document.querySelectorAll('.time-slot-button').forEach(button => {
                    button.addEventListener('click', function() {
                        selectedDate = this.dataset.date;
                        selectedPeriod = this.dataset.period;
            
                        document.getElementById('validateOrderButton').classList.add('show');
                    });
                });

                // Valide la commande avec le créneau sélectionné
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
            updatePickupTotal();  // Met à jour le total du panier lors de l'ouverture de la section calendrier
        });
    }

    // Ferme la page des détails de récupération
    closeCalendarButton.addEventListener('click', function() {
        pickupDetailsPage.classList.remove('open');
    });

    // Génère le calendrier pour le mois actuel
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
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
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
