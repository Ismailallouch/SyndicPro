import express from 'express';
import prisma from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Récupérer tous les événements pour l'admin connecté
router.get('/', async (req, res) => {
    try {
        const events = await prisma.evenement.findMany({
            where: { idAdmin: req.userId },
            select: {
                idEvent: true,
                nomEvent: true,
                date: true,
                lieu: true
            },
            orderBy: {
                date: 'desc'
            }
        });
        
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Créer un nouvel événement
router.post('/', async (req, res) => {
    try {
        const { nom, date, lieu } = req.body;
        
        // Validation des données
        if (!nom || !date || !lieu) {
            return res.status(400).json({ 
                error: 'Tous les champs sont obligatoires (nom, date, lieu)' 
            });
        }

        // Créer l'événement
        const newEvent = await prisma.evenement.create({
            data: {
                nomEvent: nom,
                date: new Date(date),
                lieu,
                idAdmin: req.userId
            }
        });

        res.status(201).json({ 
            id: newEvent.idEvent,
            nom,
            date,
            lieu
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400).json({ error: 'Un événement similaire existe déjà' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Récupérer un événement spécifique
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const event = await prisma.evenement.findFirst({
            where: {
                idEvent: Number(id),
                idAdmin: req.userId
            },
            select: {
                idEvent: true,
                nomEvent: true,
                date: true,
                lieu: true
            }
        });

        if (!event) {
            return res.status(404).json({ error: 'Événement non trouvé ou non autorisé' });
        }

        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, date, lieu } = req.body;

        // Validation des données
        if (!nom || !date || !lieu) {
            return res.status(400).json({ 
                error: 'Tous les champs sont obligatoires (nom, date, lieu)' 
            });
        }

        // Vérifier que l'événement existe et appartient à l'admin
        const existingEvent = await prisma.evenement.findFirst({
            where: {
                idEvent: Number(id),
                idAdmin: req.userId
            }
        });

        if (!existingEvent) {
            return res.status(404).json({ error: 'Événement non trouvé ou non autorisé' });
        }

        // Mettre à jour l'événement
        const updatedEvent = await prisma.evenement.update({
            where: { idEvent: Number(id) },
            data: {
                nomEvent: nom,
                date: new Date(date),
                lieu
            }
        });

        res.json({ 
            message: "Événement mis à jour avec succès",
            id,
            nom,
            date,
            lieu
        });
    } catch (err) {
        if (err.code === 'P2002') {
            res.status(400).json({ error: 'Un événement similaire existe déjà' });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que l'événement existe et appartient à l'admin
        const existingEvent = await prisma.evenement.findFirst({
            where: {
                idEvent: Number(id),
                idAdmin: req.userId
            }
        });

        if (!existingEvent) {
            return res.status(404).json({ error: 'Événement non trouvé ou non autorisé' });
        }

        // Supprimer l'événement
        await prisma.evenement.delete({
            where: { idEvent: Number(id) }
        });

        res.json({ message: "Événement supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;