const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const PORT = 4000;

// Configurazione delle credenziali di accesso a Jira
const JIRA_BASE_URL = 'https://alfabes.atlassian.net';
//const JIRA_USERNAME = 'your-jira-username';
//const JIRA_API_TOKEN = 'your-jira-api-token';
console.log("step1");
// Middleware per il parsing del body delle richieste in formato JSON

// Rotta per la creazione di un ticket su Jira
app.post('/api/entry-point-jira', async (req, res) => {
    console.log("dentro api entry point jira");
    try {
        const { method,creatore_ticket_email,summary, description, projectKey, issueType } = req.body;
        console.log(method,creatore_ticket_email,summary, description, projectKey, issueType )
        // Costruisci l'URL per l'API di creazione ticket di Jira
        const url = `${JIRA_BASE_URL}/rest/api/3/issue`;
        console.log("url:" + url);
        // Costruisci il corpo della richiesta per la creazione del ticket
        if(method =="createticket"){
            const requestBody = {
                fields: {
                    project: {
                        key: projectKey
                    },
                    summary: summary,
                    description: {
                        "type": "doc",
                        "version": 1,
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": description
                                    }
                                ]
                            }
                        ]
                    },    
                    issuetype: {
                        name: issueType
                    },
                    customfield_10063: creatore_ticket_email
                }
            };

            // Effettua la richiesta POST all'API di Jira per la creazione del ticket
            const response = await axios.post(url, requestBody, {
                auth: {
                    /*username: JIRA_USERNAME,
                    password: JIRA_API_TOKEN */
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Se la richiesta ha avuto successo, restituisci i dati del ticket creato
            res.json(response.data);
        }
    } catch (error) {
        // Se si verifica un errore, restituisci un messaggio di errore
        console.error('Errore durante la creazione del ticket su Jira:', error.message);
        res.status(500).json({ error: 'Errore durante la creazione del ticket su Jira' });
    }
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


