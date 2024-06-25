// document.addEventListener('DOMContentLoaded', function() {
//     var cartSidebar = document.getElementById('cartSidebar');
//     var pageOverlay = document.getElementById('pageOverlay');

//     window.toggleCart = function() {  
//         var isOpen = cartSidebar.classList.toggle('open');
//         if (isOpen) {
//             pageOverlay.classList.add('open');
//         } else {
//             pageOverlay.classList.remove('open');
//         }
//     }

//     var toggleCartButtons = document.querySelectorAll('.toggle-cart');
//     toggleCartButtons.forEach(function(button) {
//         button.addEventListener('click', toggleCart);
//     });

//     pageOverlay.addEventListener('click', function() {
//         cartSidebar.classList.remove('open');
//         pageOverlay.classList.remove('open');
//     });
// });
