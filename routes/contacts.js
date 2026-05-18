const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /contacts
// #swagger.tags = ['Contacts']
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get a single contact by ID
// @route   GET /contacts/:id
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.status(200).json(contact);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Create a new contact
// @route   POST /contacts
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        // Validate all fields are present
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({
                message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
            });
        }

        const contact = new Contact({
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday
        });

        const savedContact = await contact.save();
        res.status(201).json({ id: savedContact._id });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update a contact
// @route   PUT /contacts/:id
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        // Validate all fields are present
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({
                message: 'All fields are required: firstName, lastName, email, favoriteColor, birthday'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { firstName, lastName, email, favoriteColor, birthday },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(204).send();
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Delete a contact
// @route   DELETE /contacts/:id
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid contact ID format' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
