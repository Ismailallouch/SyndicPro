import express from 'express';
import prisma from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Récupérer tous les lots avec les emails des copropriétaires
router.get('/', async (req, res) => {
    try {
        const lots = await prisma.lot.findMany({
            where: {
                OR: [
                    { coproprietaire: { idAdmin: req.userId } },
                    { idCopro: null }
                ]
            },
            include: {
                coproprietaire: {
                    select: {
                        email: true
                    }
                }
            }
        });

        const formattedLots = lots.map(lot => ({
            idLot: lot.idLot,
            numeroLot: lot.numeroLot,
            etage: lot.etage,
            taille: lot.taille,
            type: lot.type,
            idCopro: lot.idCopro,
            coproprietaire_email: lot.coproprietaire?.email || null
        }));

        res.json(formattedLots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Créer un nouveau lot (tous les champs obligatoires)
router.post('/', async (req, res) => {
    try {
        const { numeroLot, etage, taille, type, emailCoproprietaire } = req.body;
        
        // Validation des données
        if (!numeroLot || !etage || !taille || !type || !emailCoproprietaire) {
            return res.status(400).json({ 
                error: 'Tous les champs sont obligatoires (numeroLot, etage, taille, type, emailCoproprietaire)' 
            });
        }

        // Vérifier que le copropriétaire existe et appartient à l'admin
        const coproprietaire = await prisma.coproprietaire.findFirst({
            where: {
                email: emailCoproprietaire,
                idAdmin: req.userId
            }
        });

        if (!coproprietaire) {
            return res.status(404).json({ 
                error: 'Copropriétaire non trouvé ou ne vous appartenant pas' 
            });
        }

        const newLot = await prisma.lot.create({
            data: {
                numeroLot,
                etage,
                taille,
                type,
                idCopro: coproprietaire.idCopro
            },
            include: {
                coproprietaire: {
                    select: {
                        email: true
                    }
                }
            }
        });

        res.status(201).json({ 
            id: newLot.idLot,
            numeroLot,
            etage,
            taille,
            type,
            coproprietaire_email: newLot.coproprietaire.email
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'Ce numéro de lot existe déjà' });
        } else if (err.code === 'P2003') {
            res.status(400).json({ error: 'Copropriétaire invalide' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Modifier un lot (tous les champs obligatoires)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { numeroLot, etage, taille, type, emailCoproprietaire } = req.body;

        // Validation des données
        if (!numeroLot || !etage || !taille || !type || !emailCoproprietaire) {
            return res.status(400).json({ 
                error: 'Tous les champs sont obligatoires (numeroLot, etage, taille, type, emailCoproprietaire)' 
            });
        }

        // Vérifier que le lot existe
        const existingLot = await prisma.lot.findUnique({
            where: { idLot: Number(id) }
        });

        if (!existingLot) {
            return res.status(404).json({ error: 'Lot non trouvé' });
        }

        // Vérifier que le nouveau copropriétaire existe et appartient à l'admin
        const coproprietaire = await prisma.coproprietaire.findFirst({
            where: {
                email: emailCoproprietaire,
                idAdmin: req.userId
            }
        });

        if (!coproprietaire) {
            return res.status(404).json({ 
                error: 'Copropriétaire non trouvé ou ne vous appartenant pas' 
            });
        }

        const updatedLot = await prisma.lot.update({
            where: { idLot: Number(id) },
            data: {
                numeroLot,
                etage,
                taille,
                type,
                idCopro: coproprietaire.idCopro
            },
            include: {
                coproprietaire: {
                    select: {
                        email: true
                    }
                }
            }
        });

        res.json({ 
            message: "Lot modifié avec succès",
            coproprietaire_email: updatedLot.coproprietaire.email
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'Ce numéro de lot existe déjà' });
        } else if (err.code === 'P2003') {
            res.status(400).json({ error: 'Copropriétaire invalide' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Supprimer un lot
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que le lot existe et appartient à un de nos copropriétaires
        const lotWithOwner = await prisma.lot.findFirst({
            where: { idLot: Number(id) },
            include: {
                coproprietaire: {
                    select: {
                        idAdmin: true,
                        email: true
                    }
                }
            }
        });

        if (!lotWithOwner) {
            return res.status(404).json({ error: 'Lot non trouvé' });
        }

        if (lotWithOwner.coproprietaire?.idAdmin !== req.userId) {
            return res.status(403).json({ error: 'Non autorisé' });
        }

        await prisma.lot.delete({
            where: { idLot: Number(id) }
        });

        res.json({ 
            message: "Lot supprimé avec succès",
            coproprietaire_email: lotWithOwner.coproprietaire?.email || null
        });
    } catch (err) {
        if (err.code === 'P2003') {
            res.status(400).json({ error: 'Impossible de supprimer - des dépendances existent' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Récupérer les lots d'un copropriétaire spécifique (par email)
router.get('/par-coproprietaire/:emailCoproprietaire', async (req, res) => {
    try {
        const { emailCoproprietaire } = req.params;

        // Vérifier que le copropriétaire appartient à l'admin
        const coproprietaire = await prisma.coproprietaire.findFirst({
            where: {
                email: emailCoproprietaire,
                idAdmin: req.userId
            }
        });

        if (!coproprietaire) {
            return res.status(404).json({ error: 'Copropriétaire non trouvé ou ne vous appartenant pas' });
        }

        const lots = await prisma.lot.findMany({
            where: { idCopro: coproprietaire.idCopro },
            include: {
                coproprietaire: {
                    select: {
                        email: true
                    }
                }
            }
        });

        res.json({
            coproprietaire: {
                id: coproprietaire.idCopro,
                email: coproprietaire.email
            },
            lots: lots.map(lot => ({
                ...lot,
                coproprietaire_email: lot.coproprietaire.email
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;