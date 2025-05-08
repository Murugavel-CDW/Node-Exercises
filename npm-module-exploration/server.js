import http from 'http';

const users = [
    {
        "id": "100",
        "name": "user1",
        "password": "test@123"
    },
    {
        "id": "101",
        "name": "user2",
        "password": "test@124"
    }
]

const server = http.createServer((request, response) => {
    if (request.url == '/users' && request.method == 'GET') {
        response.write(JSON.stringify(users));
        response.end();
    } else if (request.url == '/users' && request.method == 'POST') {
        let body = '';
        request.on("data", (chunk) => {
            body += chunk;
        });
        request.on("end", () => {
            const parsedBody = JSON.parse(body);
            users.push(parsedBody);
            response.write("User added");
            response.end();
        });
    }
});

server.listen(3000);