import express from "express";
import prisma from "../db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Helper function to verify lots
const verifyLots = async (lotIds, adminId) => {
  try {
    const validLots = await prisma.lot.findMany({
      where: {
        idLot: { in: lotIds.map((id) => Number(id)) },
        OR: [{ coproprietaire: { idAdmin: adminId } }, { idCopro: null }],
      },
      select: { idLot: true },
    });

    return validLots.length === lotIds.length;
  } catch (err) {
    console.error("Error verifying lots:", err);
    return false;
  }
};

// Get all maintenances with associated lots
router.get("/", async (req, res) => {
  try {
    const maintenances = await prisma.maintenance.findMany({
      where: { idAdmin: req.userId },
      include: {
        lots: {
          select: {
            lot: {
              select: {
                numeroLot: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const formattedMaintenances = maintenances.map((m) => ({
      idMaintenance: m.idMaintenance,
      probleme: m.probleme,
      date: m.date,
      priorite: m.priorite,
      statut: m.statut,
      lots: m.lots.map((l) => l.lot.numeroLot).join(", "),
    }));

    res.json(formattedMaintenances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create maintenance
router.post("/", async (req, res) => {
  try {
    const { probleme, date, priorite, statut, lots } = req.body;

    // Validation
    if (!probleme || !date || !priorite || !statut || !lots?.length) {
      return res.status(400).json({
        error: "Tous les champs sont obligatoires",
      });
    }

    // Verify lots
    const lotsAreValid = await verifyLots(lots, req.userId);
    if (!lotsAreValid) {
      return res.status(404).json({
        error: "Un ou plusieurs lots invalides",
      });
    }

    // Create maintenance with relations in a transaction
    const newMaintenance = await prisma.$transaction(async (tx) => {
      // Create maintenance
      const maintenance = await tx.maintenance.create({
        data: {
          probleme,
          date: new Date(date),
          priorite,
          statut,
          idAdmin: req.userId,
        },
      });

      // Create relations
      await tx.maintenir.createMany({
        data: lots.map((lotId) => ({
          idLot: Number(lotId),
          idMaintenance: maintenance.idMaintenance,
        })),
      });

      return maintenance;
    });

    res.status(201).json({
      id: newMaintenance.idMaintenance,
      probleme,
      date,
      priorite,
      statut,
      lots,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: err.message || "Erreur serveur",
    });
  }
});

// Update maintenance and its associated lots
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { probleme, date, priorite, statut, lots } = req.body;

    // Validation
    if (!probleme || !date || !priorite || !statut || !lots?.length) {
      return res.status(400).json({
        error:
          "Tous les champs sont obligatoires (probleme, date, priorite, statut, lots)",
      });
    }

    // Check maintenance exists and belongs to admin
    const existingMaintenance = await prisma.maintenance.findFirst({
      where: {
        idMaintenance: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingMaintenance) {
      return res
        .status(404)
        .json({ error: "Maintenance non trouvée ou non autorisée" });
    }

    // Verify lots
    const lotsAreValid = await verifyLots(lots, req.userId);
    if (!lotsAreValid) {
      return res.status(404).json({
        error: "Un ou plusieurs lots non trouvés ou ne vous appartenant pas",
      });
    }

    // Update in transaction
    await prisma.$transaction(async (tx) => {
      // Update maintenance
      await tx.maintenance.update({
        where: { idMaintenance: Number(id) },
        data: {
          probleme,
          date: new Date(date),
          priorite,
          statut,
        },
      });

      // Delete existing relations
      await tx.maintenir.deleteMany({
        where: { idMaintenance: Number(id) },
      });

      // Create new relations
      await tx.maintenir.createMany({
        data: lots.map((lotId) => ({
          idLot: Number(lotId),
          idMaintenance: Number(id),
        })),
      });
    });

    res.json({
      message: "Maintenance modifiée avec succès",
      id,
      lots,
    });
  } catch (err) {
    if (err.code === "P2003") {
      res.status(400).json({ error: "Lot invalide" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// Delete maintenance
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check maintenance exists and belongs to admin
    const existingMaintenance = await prisma.maintenance.findFirst({
      where: {
        idMaintenance: Number(id),
        idAdmin: req.userId,
      },
    });

    if (!existingMaintenance) {
      return res
        .status(404)
        .json({ error: "Maintenance non trouvée ou non autorisée" });
    }

    // Delete in transaction
    await prisma.$transaction([
      prisma.maintenir.deleteMany({
        where: { idMaintenance: Number(id) },
      }),
      prisma.maintenance.delete({
        where: { idMaintenance: Number(id) },
      }),
    ]);

    res.json({ message: "Maintenance supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific maintenance with its lots
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const maintenance = await prisma.maintenance.findFirst({
      where: {
        idMaintenance: Number(id),
        idAdmin: req.userId,
      },
      include: {
        lots: {
          select: {
            lot: {
              select: {
                idLot: true,
                numeroLot: true,
              },
            },
          },
        },
      },
    });

    if (!maintenance) {
      return res
        .status(404)
        .json({ error: "Maintenance non trouvée ou non autorisée" });
    }

    res.json({
      idMaintenance: maintenance.idMaintenance,
      probleme: maintenance.probleme,
      date: maintenance.date,
      priorite: maintenance.priorite,
      statut: maintenance.statut,
      lots: maintenance.lots.map((l) => ({
        id: l.lot.idLot,
        numeroLot: l.lot.numeroLot,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
