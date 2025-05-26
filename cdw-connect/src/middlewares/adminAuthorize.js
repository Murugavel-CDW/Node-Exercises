export const verifyAdmin = (request, response, next) => {
    const { role } = request.user;
    if (role !== 'admin') {
        return response.status(401).send("Permission to access this route is denied");
    }
    next();
}