import { searchRecords } from "../services/search.service.js";

export const searchGlobally = async (request, response, next) => {
    try {
        const { searchQuery } = request.query;
        const searchResults = await searchRecords(searchQuery);
        response.status(200).json({ searchResults });
    } catch (error) {
        next(error);
    }
}