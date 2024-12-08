const BASE_URL = 'http://localhost:5001/api/button-actions';

export const buttonActionService = {
    async toggleAction(itemId, itemType, actionType, token) {
        try {
            // Debug request details
            console.log('Making API request with:', {
                url: `${BASE_URL}/toggle`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`.substring(0, 30) + '...' // Log partial token
                },
                body: {
                    itemId,
                    itemType,
                    actionType
                }
            });

            const response = await fetch(`${BASE_URL}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId,
                    itemType,
                    actionType
                })
            });

            const data = await response.json();
            console.log('Response:', {
                status: response.status,
                data
            });
            
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to toggle action');
            }

            return data;
        } catch (error) {
            console.error(`Error toggling ${actionType}:`, {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

        async checkStatus(itemId, actionType, token) {
            try {
                console.log('Checking status for:', { itemId, actionType });
                
                const response = await fetch(
                    `${BASE_URL}/status/${itemId}?actionType=${actionType}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                const data = await response.json();
                console.log('Status check response:', data);
    
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to check status');
                }
    
                return {
                    status: Boolean(data.status) // Ensure boolean value
                };
            } catch (error) {
                console.error('Status check error:', error);
                throw error;
            }
        },async toggleAction(itemId, itemType, actionType, token) {
            try {
                console.log('Toggling action:', { itemId, itemType, actionType });
                
                const response = await fetch(`${BASE_URL}/toggle`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        itemId,
                        itemType,
                        actionType
                    })
                });
    
                const data = await response.json();
                console.log('Toggle response:', data);
    
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to toggle action');
                }
    
                return {
                    status: Boolean(data.status),
                    message: data.message
                };
            } catch (error) {
                console.error('Toggle error:', error);
                throw error;
            }
        }
    };