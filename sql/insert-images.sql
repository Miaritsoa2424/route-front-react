-- Insertion d'images pour le signalement 1
INSERT INTO image (date_ajout, description, id_firestore, lien, id_signalement) VALUES
(NOW(), 'Nid de poule profond', NULL, 'https://picsum.photos/800/600?random=1', 1),
(NOW(), 'Vue rapprochée des dégâts', NULL, 'https://picsum.photos/800/600?random=2', 1),
(NOW(), 'Vue d''ensemble de la zone', NULL, 'https://picsum.photos/800/600?random=3', 1);

-- Insertion d'images pour le signalement 2
INSERT INTO image (date_ajout, description, id_firestore, lien, id_signalement) VALUES
(NOW(), 'Fissure sur la chaussée', NULL, 'https://picsum.photos/800/600?random=4', 2),
(NOW(), 'Détail de la fissure', NULL, 'https://picsum.photos/800/600?random=5', 2);

-- Insertion d'images pour le signalement 3
INSERT INTO image (date_ajout, description, id_firestore, lien, id_signalement) VALUES
(NOW(), 'Dégradation du revêtement', NULL, 'https://picsum.photos/800/600?random=6', 3),
(NOW(), 'Affaissement visible', NULL, 'https://picsum.photos/800/600?random=7', 3),
(NOW(), 'Photo panoramique', NULL, 'https://picsum.photos/800/600?random=8', 3),
(NOW(), 'Bordure endommagée', NULL, 'https://picsum.photos/800/600?random=9', 3);

-- Insertion d'images pour le signalement 4
INSERT INTO image (date_ajout, description, id_firestore, lien, id_signalement) VALUES
(NOW(), 'Cratère dans la route', NULL, 'https://picsum.photos/800/600?random=10', 4),
(NOW(), 'Vue latérale', NULL, 'https://picsum.photos/800/600?random=11', 4),
(NOW(), 'Mesure des dimensions', NULL, 'https://picsum.photos/800/600?random=12', 4);