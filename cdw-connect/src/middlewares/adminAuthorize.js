// Middleware function to verify if the role of the user is admin
export const verifyAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== 'admin') {
        return response.status(401).json({
            error: "Permission to access this route is denied"
        });
    }
    next();
}