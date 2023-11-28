// import express from 'express';
// import jwt from 'jsonwebtoken';
// const router = express.Router();
// router.get('/verify', async (req, res) => {
//     try {
//         let token = req.headers.token
//         req.payload = jwt.verify(token, 'codeforindia');
//         if (req.payload) {
//             return res.json(req.payload)
//         }
//     } catch (error) {
//         return res.status(401).json({ error: 'Session Expired, please login' });
//     }

// })
// export default router;
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        const decoded = jwt.verify(token, 'codeforindia');

        if (decoded) {
            return res.json(decoded);
        }
    } catch (error) {
        // Check if the error is due to token expiration
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        return res.status(401).json({ error: 'Session Expired, please login' });
    }
});

export default router;
