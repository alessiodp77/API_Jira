const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const PORT = process.env.PORT || 3000;
//const ENVIRONMENT = process.env.url;
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/submit') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const data = JSON.parse(body);
            const nome = data.name;
            const cognome = data.surname;
            const email = data.email;

            console.log(nome,cognome,email);

            axios.post('http://localhost:4000/api/entry-point-jira', {                
                method : "createticket",
                projectKey : "AT",
                summary : data.summary,
                description : data.description,
                issueType : "Task",
                Email_creatore_ticket : email,
                Nome_creatore_ticket : nome,
                Cognome_creatore_ticket : cognome
            })
            .then(response => {
                console.log('Risposta dal servizio esterno:', response.data);
                // Invio una risposta al client
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('Dati inviati con successo al servizio esterno!');
            })
            .catch(error => {
                console.error('Errore nella chiamata al servizio esterno:', error);
                // Invia una risposta al client
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Errore nell\'invio dei dati al servizio esterno!');
            });
            // Invia una risposta al client
            //res.writeHead(200, {'Content-Type': 'text/plain'});
            //res.end('Dati ricevuti con successo!');
        });
    } else if (req.method === 'GET' && req.url === '/CreaTicket') {
        // Servo la pagina CreaTicket.html
        fs.readFile(path.join(__dirname, 'CreaTicket.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found!!!!!");
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            //console.log("data:" + data);
            res.write(data);
            res.end();
        });
    } else {
        // Servo la pagina principale
        fs.readFile(path.join(__dirname, 'CreaTicket.html'), (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found!");
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
});

//const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
