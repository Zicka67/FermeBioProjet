1-  Utilisation de JSON pour stocker le panier

Utilisation de JSON pour encoder et décoder plutôt que de simplement stocker un tableau PHP sérialisé dans la session ( ne fonctionnait pas sans ) 
- Avant la connexion, le panier est stocké dans cart_before_login
- Après la connexion, le panier est restauré depuis cart_before_login et transféré vers cart dans la session
- ( bien penser à retirer les clés de session temporaires après l'utilisation pour éviter tout comportements inattendus )

2- Stockage de l'url

```php
if ($targetPath = $session->get('target_path')) {
    $session->remove('target_path');
    return new RedirectResponse($targetPath);
}
```

3- Supression du cart et des cart_item
- Bien penser à mettre cascade sur la FK car_id dans cart_item
