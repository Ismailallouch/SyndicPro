import express from "express";
import prisma from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Récupérer toutes les charges pour l'admin connecté
router.get("/", async (req, res) => {
  try {
    const charges = await prisma.charge.findMany({
      where: { idAdmin: req.userId },
      include: {
        paiements: {
          include: {
            coproprietaire: {
              select: { email: true },
            },
          },
        },
      },
    });

    // Format the response to match the original structure
    const formattedCharges = charges.map((charge) => ({
      idCharge: charge.idCharge,
      typeCharge: charge.typeCharge,
      montant: charge.montant,
      statut: charge.statut,
      echeance: charge.echeance,
      paiements: charge.paiements.map((p) => ({
        idPayer: p.idPayer,
        datePaiement: p.datePaiement,
        montantPaye: p.montantPaye,
        coproprietaire_email: p.coproprietaire?.email,
      })),
    }));

    res.json(formattedCharges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Créer une nouvelle charge
router.post("/", async (req, res) => {
  try {
    const { type, montant, echeance, statut, coproprietaire } = req.body;

    // Validation des données
    if (!type || !montant || !echeance || !statut || !coproprietaire) {
      return res.status(400).json({
        error:
          "Tous les champs sont obligatoires (type, montant, echeance, statut, coproprietaire)",
      });
    }

    // Vérifier que le statut est valide
    const validStatus = ["à payer", "en retard", "payé"];
    if (!validStatus.includes(statut)) {
      return res.status(400).json({
        error: 'Statut invalide. Doit être "à payer", "en retard" ou "payé"',
      });
    }

    if (coproprietaire.toLowerCase() === "tous") {
      // Create charge without specific payer
      const newCharge = await prisma.charge.create({
        data: {
          typeCharge: type,
          montant,
          statut,
          echeance: new Date(echeance),
          idAdmin: req.userId,
        },
      });

      return res.status(201).json({
        id: newCharge.idCharge,
        type,
        montant,
        statut,
        echeance,
        coproprietaire: "tous",
        paiements: [],
      });
    } else {
      // Check if coproprietaire exists and belongs to admin
      const copro = await prisma.coproprietaire.findFirst({
        where: {
          email: coproprietaire,
          idAdmin: req.userId,
        },
      });

      if (!copro) {
        return res.status(404).json({
          error:
            'Copropriétaire non trouvé ou ne vous appartenant pas, veuillez vérifier l\'email ou saisir "tous" si vous vouler que tous les copropriétaires aient cette charge',
        });
      }

      // Create charge with payment record
      const newCharge = await prisma.charge.create({
        data: {
          typeCharge: type,
          montant,
          statut,
          echeance: new Date(echeance),
          idAdmin: req.userId,
          paiements: {
            create:
              statut === "payé"
                ? {
                    idCopro: copro.idCopro,
                    datePaiement: new Date(),
                    montantPaye: montant,
                  }
                : {
                    idCopro: copro.idCopro,
                  },
          },
        },
        include: {
          paiements: {
            include: {
              coproprietaire: {
                select: { email: true },
              },
            },
          },
        },
      });

      return res.status(201).json({
        id: newCharge.idCharge,
        type,
        montant,
        statut,
        echeance,
        coproprietaire,
        paiements:
          statut === "payé"
            ? [
                {
                  coproprietaire,
                  datePaiement: newCharge.paiements[0].datePaiement
                    .toISOString()
                    .split("T")[0],
                  montantPaye: newCharge.paiements[0].montantPaye,
                },
              ]
            : [],
      });
    }
  } catch (err) {
    if (err.code === "P2002" || err.message.includes("constraint")) {
      res
        .status(400)
        .json({
          error: "Données invalides (montant négatif ou statut incorrect)",
        });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Mettre à jour une charge
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, montant, echeance, statut, coproprietaire } = req.body;

    // Validation des données
    if (!type || !montant || !echeance || !statut || !coproprietaire) {
      return res.status(400).json({
        error:
          "Tous les champs sont obligatoires (type, montant, echeance, statut, coproprietaire)",
      });
    }

    // Vérifier que la charge existe et appartient à l'admin
    const existingCharge = await prisma.charge.findFirst({
      where: {
        idCharge: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingCharge) {
      return res
        .status(404)
        .json({ error: "Charge non trouvée ou non autorisée" });
    }

    // Mettre à jour la charge
    const updatedCharge = await prisma.charge.update({
      where: { idCharge: Number(id) },
      data: {
        typeCharge: type,
        montant,
        echeance: new Date(echeance),
        statut,
      },
    });

    // Gérer les paiements si copropriétaire spécifique
    if (coproprietaire.toLowerCase() !== "tous") {
      const copro = await prisma.coproprietaire.findFirst({
        where: {
          email: coproprietaire,
          idAdmin: req.userId,
        },
      });

      if (!copro) {
        return res.status(404).json({
          error:
            'Copropriétaire non trouvé ou ne vous appartenant pas, veuillez vérifier l\'email ou saisir "tous" si vous vouler que tous les copropriétaires aient cette charge',
        });
      }

      // Check for existing payment
      const existingPayer = await prisma.payer.findFirst({
        where: {
          idCharge: Number(id),
          idCopro: copro.idCopro,
        },
      });

      if (existingPayer) {
        // Update existing payment
        await prisma.payer.update({
          where: { idPayer: existingPayer.idPayer },
          data:
            statut === "payé"
              ? {
                  datePaiement: new Date(),
                  montantPaye: montant,
                }
              : {
                  datePaiement: null,
                  montantPaye: null,
                },
        });
      } else {
        // Create new payment
        await prisma.payer.create({
          data: {
            idCharge: Number(id),
            idCopro: copro.idCopro,
            ...(statut === "payé"
              ? {
                  datePaiement: new Date(),
                  montantPaye: montant,
                }
              : {}),
          },
        });
      }
    }

    res.json({
      message: "Charge mise à jour avec succès",
      id,
      type,
      montant,
      echeance,
      statut,
      coproprietaire,
    });
  } catch (err) {
    if (err.code === "P2002" || err.message.includes("constraint")) {
      res
        .status(400)
        .json({
          error: "Données invalides (montant négatif ou statut incorrect)",
        });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Supprimer une charge
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que la charge existe et appartient à l'admin
    const existingCharge = await prisma.charge.findFirst({
      where: {
        idCharge: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingCharge) {
      return res
        .status(404)
        .json({ error: "Charge non trouvée ou non autorisée" });
    }

    // Delete in transaction to ensure data integrity
    await prisma.$transaction([
      prisma.payer.deleteMany({
        where: { idCharge: Number(id) },
      }),
      prisma.charge.delete({
        where: { idCharge: Number(id) },
      }),
    ]);

    res.json({ message: "Charge supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Marquer une charge comme payée pour un copropriétaire spécifique
router.post("/:id/payer", async (req, res) => {
  try {
    const { id } = req.params;
    const { coproprietaire, montantPaye } = req.body;

    // Validation
    if (!coproprietaire || !montantPaye) {
      return res.status(400).json({
        error:
          "Tous les champs sont obligatoires (coproprietaire, montantPaye)",
      });
    }

    // Vérifier que la charge existe et appartient à l'admin
    const existingCharge = await prisma.charge.findFirst({
      where: {
        idCharge: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingCharge) {
      return res
        .status(404)
        .json({ error: "Charge non trouvée ou non autorisée" });
    }

    // Vérifier que le copropriétaire existe
    const copro = await prisma.coproprietaire.findFirst({
      where: {
        email: coproprietaire,
        idAdmin: req.userId,
      },
    });

    if (!copro) {
      return res.status(404).json({
        error: "Copropriétaire non trouvé ou ne vous appartenant pas",
      });
    }

    // Check for existing payment
    const existingPayer = await prisma.payer.findFirst({
      where: {
        idCharge: Number(id),
        idCopro: copro.idCopro,
      },
    });

    if (existingPayer) {
      // Update existing payment
      await prisma.payer.update({
        where: { idPayer: existingPayer.idPayer },
        data: {
          datePaiement: new Date(),
          montantPaye,
        },
      });
    } else {
      // Create new payment
      await prisma.payer.create({
        data: {
          idCharge: Number(id),
          idCopro: copro.idCopro,
          datePaiement: new Date(),
          montantPaye,
        },
      });
    }

    // Update charge status to 'payé'
    await prisma.charge.update({
      where: { idCharge: Number(id) },
      data: { statut: "payé" },
    });

    res.json({
      message: "Paiement enregistré avec succès",
      chargeId: id,
      coproprietaire,
      montantPaye,
      datePaiement: new Date().toISOString().split("T")[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
