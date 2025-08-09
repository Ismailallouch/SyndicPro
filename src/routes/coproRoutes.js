import express from "express";
import prisma from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Récupérer tous les copropriétaires (pour l'admin connecté)
router.get("/", async (req, res) => {
  try {
    const coproprietaires = await prisma.coproprietaire.findMany({
      where: { idAdmin: req.userId },
    });
    res.json(coproprietaires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer un nouveau copropriétaire
router.post("/", async (req, res) => {
  try {
    const { nom, email, telephone } = req.body;

    // Validation des données
    if (!nom || !email || !telephone) {
      return res
        .status(400)
        .json({ error: "Nom, telephone et email sont obligatoires" });
    }

    const newCoproprietaire = await prisma.coproprietaire.create({
      data: {
        nom,
        email,
        phone: telephone,
        idAdmin: req.userId,
      },
    });

    res.status(201).json({
      id: newCoproprietaire.idCopro,
      nom,
      email,
    });
  } catch (err) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Cet email est déjà utilisé" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Modifier un copropriétaire
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, email, telephone } = req.body;

    // Vérifier que le copropriétaire appartient à l'admin
    const existingCoproprietaire = await prisma.coproprietaire.findFirst({
      where: {
        idCopro: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingCoproprietaire) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await prisma.coproprietaire.update({
      where: { idCopro: Number(id) },
      data: {
        nom,
        email,
        phone: telephone,
      },
    });

    res.json({ message: "Copropriétaire modifié avec succès" });
  } catch (err) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "Cet email est déjà utilisé" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Supprimer un copropriétaire
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification de l'appartenance
    const existingCoproprietaire = await prisma.coproprietaire.findFirst({
      where: {
        idCopro: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingCoproprietaire) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await prisma.coproprietaire.delete({
      where: { idCopro: Number(id) },
    });

    res.json({ message: "Copropriétaire supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
