import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body; 

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    try {
        // Check if email already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });
        
        if (existingAdmin) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new admin
        const newAdmin = await prisma.admin.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        // Generate token
        const token = jwt.sign(
            { id: newAdmin.idAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            token,
            user: { id: newAdmin.idAdmin, username, email }
        });

    } catch (err) {
        console.error('Erreur d\'inscription:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Login 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await prisma.admin.findUnique({
            where: { email }
        });
        
        if (!admin) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const validPassword = bcrypt.compareSync(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { id: admin.idAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            token,
            user: { 
                id: admin.idAdmin, 
                username: admin.username, 
                email: admin.email,
                phone: admin.phone 
            }
        });

    } catch (err) {
        console.error('Erreur de connexion:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Update profile
router.put('/profile', async (req, res) => {
    const { id, username, currentPassword, newPassword, phone } = req.body;

    if (!id) {
        return res.status(400).json({ 
            success: false,
            error: "MISSING_ID",
            message: 'User ID is required' 
        });
    }

    try {
        // Get user data
        const admin = await prisma.admin.findUnique({
            where: { idAdmin: Number(id) }
        });
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                error: "USER_NOT_FOUND",
                message: 'User not found'
            });
        }

        // Prepare update data
        const updateData = {};
        
        if (username && username !== admin.username) {
            updateData.username = username;
        }

        if (phone !== undefined && phone !== admin.phone) {
            updateData.phone = phone;
        }

        // Handle password change
        if (currentPassword && newPassword) {
            const valid = bcrypt.compareSync(currentPassword, admin.password);
            if (!valid) {
                return res.status(401).json({
                    success: false,
                    error: "INVALID_PASSWORD",
                    message: 'Current password is incorrect'
                });
            }
            updateData.password = bcrypt.hashSync(newPassword, 10);
        }

        // Perform update
        const updatedAdmin = await prisma.admin.update({
            where: { idAdmin: Number(id) },
            data: updateData,
            select: {
                idAdmin: true,
                username: true,
                email: true,
                phone: true
            }
        });

        res.json({
            success: true,
            user: updatedAdmin
        });

    } catch (err) {
        console.error('Database error:', err);
        
        res.status(500).json({
            success: false,
            error: "DATABASE_ERROR",
            message: 'Database operation failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

export default router;