import jwt from 'jsonwebtoken';


// Middleware to protect routes
const login = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded; // Attach the user payload to the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Protect routes using this middleware
app.get('/protected-route', login, (req, res) => {
    res.send(`Hello, user with role ${req.user.role}`);
});
