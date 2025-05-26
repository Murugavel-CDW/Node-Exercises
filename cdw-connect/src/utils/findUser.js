import axios from "axios";

export const fetchUserInWallet = async (email) => {
    const response = await axios.get('http://localhost:5000/users');
    const users = response.data;
    const userData = users.find((user) => user.email === email);
    return userData;
}