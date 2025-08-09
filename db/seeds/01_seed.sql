-- Seed file for SyndicPro database
-- This file runs automatically when PostgreSQL container starts for the first time

-- Admin (Utilisateur principal)
INSERT INTO "Admin" (username, email, phone, password)
VALUES (
  'user1',
  'user1@gmail.com',
  '+212612345678',
  '$2b$10$q4bVsngMi1AJTKAZ9Q12WeB8kZOin/qHdRzND0Y0Nujz3v8KZVcY2'
) ON CONFLICT (email) DO NOTHING;

-- Copropriétaires (20 noms arabes en script latin)
INSERT INTO "Coproprietaire" (nom, email, phone, "idAdmin")
VALUES
  ('Mohamed El Amrani', 'mohamed@example.com', '+212600000001', 1),
  ('Fatima Zahraoui', 'fatima@example.com', '+212600000002', 1),
  ('Ali Rachid', 'ali@example.com', '+212600000003', 1),
  ('Nour Houda Bennani', 'nour@example.com', '+212600000004', 1),
  ('Youssef El Alami', 'youssef@example.com', '+212600000005', 1),
  ('Leila Cherkaoui', 'leila@example.com', '+212600000006', 1),
  ('Ahmed Barrada', 'ahmed@example.com', '+212600000007', 1),
  ('Samira El Fassi', 'samira@example.com', '+212600000008', 1),
  ('Khalid Belfqih', 'khaled@example.com', '+212600000009', 1),
  ('Houda El Ouaragli', 'houda@example.com', '+212600000010', 1),
  ('Hassan Benjelloun', 'hassan@example.com', '+212600000011', 1),
  ('Amina Toumi', 'amina@example.com', '+212600000012', 1),
  ('Omar El Khatib', 'omar@example.com', '+212600000013', 1),
  ('Zineb El Mansouri', 'zineb@example.com', '+212600000014', 1),
  ('Mehdi Berrada', 'mehdi@example.com', '+212600000015', 1),
  ('Nadia El Omari', 'nadia@example.com', '+212600000016', 1),
  ('Karim Chraibi', 'karim@example.com', '+212600000017', 1),
  ('Sanaa El Kadi', 'sanaa@example.com', '+212600000018', 1),
  ('Rachid Benkirane', 'rachid@example.com', '+212600000019', 1),
  ('Imane El Haddad', 'imane@example.com', '+212600000020', 1);

-- Lots (20 unités avec types en français)
INSERT INTO "Lot" ("numeroLot", etage, taille, type, "idCopro")
VALUES
  ('A101', '1', 85.5, 'Appartement', 1),
  ('A102', '1', 90.0, 'Appartement', 2),
  ('B201', '2', 75.0, 'Bureau', 3),
  ('B202', '2', 110.0, 'Appartement', 4),
  ('C301', '3', 65.0, 'Studio', 5),
  ('C302', '3', 95.0, 'Appartement', 6),
  ('D401', '4', 120.0, 'Penthouse', 7),
  ('D402', '4', 80.0, 'Appartement', 8),
  ('E501', '5', 100.0, 'Bureau', 9),
  ('E502', '5', 70.0, 'Studio', 10),
  ('F601', '6', 85.0, 'Appartement', 11),
  ('F602', '6', 105.0, 'Appartement', 12),
  ('G701', '7', 115.0, 'Penthouse', 13),
  ('G702', '7', 90.0, 'Appartement', 14),
  ('H801', '8', 75.0, 'Bureau', 15),
  ('H802', '8', 95.0, 'Appartement', 16),
  ('I901', '9', 110.0, 'Appartement', 17),
  ('I902', '9', 65.0, 'Studio', 18),
  ('J1001', '10', 125.0, 'Penthouse', 19),
  ('J1002', '10', 85.0, 'Appartement', 20);

-- Charges (10 charges avec statuts exacts)
INSERT INTO "Charge" ("typeCharge", montant, statut, echeance, "idAdmin")
VALUES
  ('Maintenance', 2500.00, 'À payer', '2023-06-15', 1),
  ('Nettoyage', 1800.00, 'Payé', '2023-05-10', 1),
  ('Réparations', 3500.00, 'En retard', '2023-07-05', 1),
  ('Électricité', 4200.00, 'Payé', '2023-04-20', 1),
  ('Eau', 1500.00, 'À payer', '2023-06-30', 1),
  ('Assurance', 3200.00, 'Payé', '2023-03-15', 1),
  ('Sécurité', 2800.00, 'En retard', '2023-07-20', 1),
  ('Jardinage', 900.00, 'Payé', '2023-05-05', 1),
  ('Déchets', 600.00, 'À payer', '2023-06-10', 1),
  ('Ascenseur', 5000.00, 'Payé', '2023-04-25', 1);

-- Paiements (15 paiements)
INSERT INTO "Payer" ("idCharge", "idCopro", "datePaiement", "montantPaye")
VALUES
  (2, 1, '2023-05-01', 1800.00),
  (4, 2, '2023-04-15', 4200.00),
  (6, 3, '2023-03-10', 3200.00),
  (8, 4, '2023-05-01', 900.00),
  (10, 5, '2023-04-20', 5000.00),
  (2, 6, '2023-05-02', 1800.00),
  (4, 7, '2023-04-16', 4200.00),
  (6, 8, '2023-03-11', 3200.00),
  (8, 9, '2023-05-02', 900.00),
  (10, 10, '2023-04-21', 5000.00),
  (1, NULL, '2023-06-01', 1000.00),
  (3, NULL, '2023-06-20', 1500.00),
  (5, NULL, '2023-06-15', 800.00),
  (7, NULL, '2023-07-01', 1200.00),
  (9, NULL, '2023-06-05', 600.00);

-- Événements (5 événements)
INSERT INTO "Evenement" ("nomEvent", date, lieu, "idAdmin")
VALUES
  ('Assemblée générale', '2023-06-15 10:00:00', 'Hall principal', 1),
  ('Exercice incendie', '2023-07-01 09:30:00', 'Tous les étages', 1),
  ('Fête de l''Aïd', '2023-04-22 18:00:00', 'Toit-terrasse', 1),
  ('Réunion maintenance', '2023-05-10 17:00:00', 'Salle de conférence', 1),
  ('Fête du Nouvel An', '2023-12-31 20:00:00', 'Jardin de l''immeuble', 1);

-- Maintenances (8 interventions avec priorités et statuts exacts)
INSERT INTO "Maintenance" (probleme, date, priorite, statut, "idAdmin")
VALUES
  ('Ascenseur en panne', '2023-01-15', 'Critique', 'Résolu', 1),
  ('Tuyau qui fuit', '2023-02-10', 'Haute', 'En cours', 1),
  ('Vitre cassée', '2023-03-05', 'Moyenne', 'En attente', 1),
  ('Problème électrique', '2023-04-20', 'Haute', 'Résolu', 1),
  ('Porte de parking cassée', '2023-05-15', 'Moyenne', 'En cours', 1),
  ('Fuite toiture', '2023-06-01', 'Critique', 'En attente', 1),
  ('Climatisation en panne', '2023-06-10', 'Basse', 'Résolu', 1),
  ('Interphone hors service', '2023-06-20', 'Moyenne', 'En attente', 1);

-- Assignations de maintenance (15 assignations)
INSERT INTO "Maintenir" ("idLot", "idMaintenance")
VALUES
  (1, 1), (2, 1), (3, 2), (4, 2), (5, 3),
  (6, 3), (7, 4), (8, 4), (9, 5), (10, 5),
  (11, 6), (12, 6), (13, 7), (14, 7), (15, 8);