document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById('reservationModal');
    const closeBtn = document.querySelector('.close');
    const selectedDateSpan = document.getElementById('selectedDate');
    const morningSlotBtn = document.getElementById('morningSlot');
    const afternoonSlotBtn = document.getElementById('afternoonSlot');

    if (!modal || !closeBtn || !selectedDateSpan || !morningSlotBtn || !afternoonSlotBtn) {
        console.error('Required elements are missing in the DOM.');
        return;
    }

    function showModal(date, period) {
        selectedDateSpan.textContent = `${date} - ${period}`;
        modal.style.display = 'block';
    }

    function hideModal() {
        modal.style.display = 'none';
    }

    function reserveSlot(date, period) {
        fetch('/reserve-slot', {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, period }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Réservation réussie !');
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                }
            } else {
                alert('Erreur lors de la réservation : ' + (data.message || 'undefined'));
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la réservation.');
        });
    }

    // Event listeners for calendar cells and time slot buttons
    document.querySelectorAll('.calendar td, .time-slot-button').forEach(element => {
        element.addEventListener('click', function(e) {
            let date, period;
            if (this.classList.contains('time-slot-button')) {
                date = this.dataset.date;
                period = this.dataset.period;
            } else {
                const dateElement = this.querySelector('.date');
                if (dateElement) {
                    const year = "{{ currentDate|date('Y') }}";
                    const month = "{{ currentDate|date('m') }}";
                    date = `${year}-${month}-${dateElement.textContent.padStart(2, '0')}`;
                    period = null; // Will be selected in the modal
                }
            }
            if (date) {
                showModal(date, period || 'Choisissez une période');
            }
        });
    });

    // Event listeners for modal buttons
    closeBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            hideModal();
        }
    });

    morningSlotBtn.addEventListener('click', function() {
        const [date] = selectedDateSpan.textContent.split(' - ');
        reserveSlot(date, 'Matin');
        hideModal();
    });

    afternoonSlotBtn.addEventListener('click', function() {
        const [date] = selectedDateSpan.textContent.split(' - ');
        reserveSlot(date, 'Après-midi');
        hideModal();
    });
});