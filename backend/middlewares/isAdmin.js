export default function isAdmin(req, res, next) {
    if (!req.user.is_admin) {
        res.status(401).json('Sem Autorização');
    }

    next();
}