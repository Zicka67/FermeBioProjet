-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour fermbio
CREATE DATABASE IF NOT EXISTS `fermbio` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fermbio`;

-- Listage de la structure de table fermbio. cart
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_BA388B7A76ED395` (`user_id`),
  CONSTRAINT `FK_BA388B7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.cart : ~0 rows (environ)

-- Listage de la structure de table fermbio. cart_item
CREATE TABLE IF NOT EXISTS `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_F0FE25271AD5CDBF` (`cart_id`),
  KEY `IDX_F0FE25274584665A` (`product_id`),
  CONSTRAINT `FK_F0FE25271AD5CDBF` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_F0FE25274584665A` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=239 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.cart_item : ~0 rows (environ)

-- Listage de la structure de table fermbio. category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.category : ~2 rows (environ)
INSERT INTO `category` (`id`, `name`, `description`) VALUES
	(1, 'Fruits', 'Les fruits'),
	(2, 'Légumes', 'Les légumes');

-- Listage de la structure de table fermbio. product
CREATE TABLE IF NOT EXISTS `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D34A04AD12469DE2` (`category_id`),
  CONSTRAINT `FK_D34A04AD12469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.product : ~5 rows (environ)
INSERT INTO `product` (`id`, `name`, `product_price`, `stock_quantity`, `description`, `is_active`, `category_id`) VALUES
	(2, 'Carottes', 0.80, 10, 'Carottes à l\'unité', 1, 2),
	(3, 'Pommes', 0.80, 12, 'Pommes à l\'unité', 1, 1),
	(4, 'Salades', 1.20, 10, 'Salades à l\'unité', 1, 2),
	(5, 'Tomates', 0.70, 10, 'Tomates à l\'unité', 1, 1),
	(6, 'Fraises', 0.40, 10, 'Fraises à l\'unité', 1, 1);

-- Listage de la structure de table fermbio. reservation
CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `cart_id` int NOT NULL,
  `time_slot_id` int NOT NULL,
  `reservation_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_42C84955A76ED395` (`user_id`),
  KEY `IDX_42C849551AD5CDBF` (`cart_id`),
  KEY `IDX_42C84955D62B0FA` (`time_slot_id`),
  CONSTRAINT `FK_42C849551AD5CDBF` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_42C84955A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_42C84955D62B0FA` FOREIGN KEY (`time_slot_id`) REFERENCES `time_slot` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.reservation : ~0 rows (environ)

-- Listage de la structure de table fermbio. time_slot
CREATE TABLE IF NOT EXISTS `time_slot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `period` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `available` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.time_slot : ~0 rows (environ)

-- Listage de la structure de table fermbio. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table fermbio.user : ~1 rows (environ)
INSERT INTO `user` (`id`, `email`, `roles`, `password`, `is_verified`) VALUES
	(1, 'test@gmail.com', '["ROLE_USER"]', '$2y$13$tXtlVwHO.0E8pMcl2/kgR.fLM7yio8YkshXiswOu10WfNGbO/I.C6', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
