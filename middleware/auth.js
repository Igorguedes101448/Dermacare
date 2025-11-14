const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Obter token do header
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Acesso negado. Token não fornecido.' 
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token inválido ou expirado.' 
        });
    }
};

// Middleware para verificar papel (role) do utilizador
const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Não autenticado.' 
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Acesso negado. Permissões insuficientes.' 
            });
        }

        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
