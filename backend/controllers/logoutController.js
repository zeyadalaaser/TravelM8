
// Dummy storage to keep track of invalidated tokens
const invalidatedTokens = new Set();

// Logout function to handle invalidating the token
export const logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    invalidatedTokens.add(token); // Add token to the invalidated set
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.status(400).json({ error: 'Token not provided' });
  }
};

// Export invalidated tokens for reference if needed
export { invalidatedTokens };