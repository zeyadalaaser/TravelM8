import { ButtonAction } from '../models/ButtonAction.js';

export const buttonActionController = {
    // Toggle button action status
    toggleAction: async (req, res) => {
        try {
            const { itemId, itemType, actionType } = req.body;
            const userId = req.user.userId;

            console.log('Toggle request:', { userId, itemId, itemType, actionType });

            const existingAction = await ButtonAction.findOne({
                userId,
                itemId,
                actionType,
                status: true
            });

            if (existingAction) {
                await ButtonAction.findByIdAndUpdate(existingAction._id, { status: false });
                return res.status(200).json({
                    status: false,
                    message: "Notification removed successfully"
                });
            }

            await ButtonAction.create({
                userId,
                itemId,
                itemType,
                actionType,
                status: true
            });

            return res.status(201).json({
                status: true,
                message: "Notification set successfully"
            });
        } catch (error) {
            console.error('Toggle error:', error);
            return res.status(500).json({
                message: "Error processing request",
                error: error.message
            });
        }
    },

    // Check action status
    checkActionStatus: async (req, res) => {
        try {
            const { itemId } = req.params;
            const { actionType } = req.query;
            const userId = req.user.userId; 

            console.log('Checking status for:', { userId, itemId, actionType });

            const action = await ButtonAction.findOne({
                userId,
                itemId,
                actionType,
                status: true // Only find active notifications
            });

            console.log('Found action:', action);

            return res.status(200).json({
                status: !!action // Convert to boolean
            });
        } catch (error) {
            console.error('Error in checkActionStatus:', error);
            return res.status(500).json({
                message: "Error checking status",
                error: error.message
            });
        }
    },

    // Get all actions for a user
    getUserActions: async (req, res) => {
        try {
            const userId = req.user._id;
            const { actionType, itemType } = req.query;

            const query = { userId };
            if (actionType) query.actionType = actionType;
            if (itemType) query.itemType = itemType;

            const actions = await ButtonAction.find(query)
                .populate({
                    path: 'itemId',
                    model: itemType || ['Activity', 'Itinerary']
                })
                .sort({ createdAt: -1 });

            return res.status(200).json({
                actions
            });
        } catch (error) {
            console.error('Error in getUserActions:', error);
            return res.status(500).json({
                message: "Error fetching user actions",
                error: error.message
            });
        }
    }
};