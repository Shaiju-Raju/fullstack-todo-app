import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;

        //2. Check token exists
        if (!authHeader) {
         return res.status(401).json({ error: "No token provided" });
        }

        //3. Format: "Bearer TOKEN"
        const token = authHeader.split(" ")[1];

        //4. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //5. Attach user info to request
        req.user = decoded;

        //6. Allow request to continue
        next();

        } catch (err) {
            return res.status(401).json({error: "Invalid or expired token"});
        }
    };


export default authMiddleware;