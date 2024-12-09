import { ButtonAction } from '../models/ButtonAction.js';
import mongoose from 'mongoose';

export const buttonActionController = {
    // Toggle button action status
    toggleAction: async (req, res) => {
        try {
            const { itemId, itemType, actionType } = req.body;
            
            // Verify we have a user
            if (!req.user || !req.user.userId) {
                console.error('No user found in request:', req.user);
                return res.status(401).json({
                    message: "User not authenticated"
                });
            }

            const userId = req.user.userId;

            // Validate the itemId
            if (!mongoose.Types.ObjectId.isValid(itemId)) {
                console.error('Invalid itemId:', itemId);
                return res.status(400).json({
                    message: "Invalid item ID format"
                });
            }

            console.log('Toggle request:', { 
                userId, 
                itemId, 
                itemType, 
                actionType,
                userDetails: req.user 
            });

            const existingAction = await ButtonAction.findOne({
                userId,
                itemId,
                actionType
            });

            console.log('Found existing action:', existingAction);

            if (existingAction) {
                existingAction.status = !existingAction.status;
                await existingAction.save();
                
                return res.status(200).json({
                    status: existingAction.status,
                    message: existingAction.status ? 
                        "Notification set successfully" : 
                        "Notification removed successfully"
                });
            }

            const newAction = new ButtonAction({
                userId,
                itemId,
                itemType,
                actionType,
                status: true
            });

            await newAction.save();
            console.log('Created new action:', newAction);

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

    // Get action status
    checkActionStatus: async (req, res) => {
        try {
            const { itemId } = req.params;
            const { actionType } = req.query;
            const userId = req.user.userId;

            const action = await ButtonAction.findOne({
                userId,
                itemId,
                actionType,
                status: true
            });

            return res.status(200).json({
                status: !!action
            });
        } catch (error) {
            console.error('Error in checkActionStatus:', error);
            return res.status(500).json({
                message: "Error checking status",
                error: error.message
            });
        }
    },

    // Get user actions
    getUserActions: async (req, res) => {
        try {
            const userId = req.user.userId;
            console.log('Getting actions for user:', userId);

            const actions = await ButtonAction.find({ 
                userId,
                actionType: 'NOTIFY',
                status: true
            })
            .populate('itemId')
            .sort({ createdAt: -1 });

            console.log('Found actions:', actions);

            return res.status(200).json({
                actions,
                debug: {
                    userId,
                    totalActions: await ButtonAction.countDocuments(),
                    userActions: actions.length
                }
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