import axios from "axios";

const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3000/users');
    return response.data;
}

const addUser = async (user) => {
    const response = await axios.post('http://localhost:3000/users', user);
    return response.data;
}

const newUser = {
    id: 103,
    name: 'user3',
    password: 'test@125'
}

fetchUsers().then(data => console.log(data));

addUser(newUser).then(data => console.log(data));

fetchUsers().then(data => console.log(data));

