const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
          console.err(err);
          return;
        } else {
            const parsedNotes = JSON.parse(data);
            res.json(parsedNotes);
        }
    })
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required' });
    }

    const newNote = {
        title,
        text,
        note_id: randomUUID(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to read notes from file' });
        }

        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);
        const notesString = JSON.stringify(parsedNotes, null, 2);

        fs.writeFile(`./db/db.json`, notesString, (err) => {
            err
            ? console.error(err)
            : console.log(
                `Note for ${newNote.title} has been written to JSON file`
            )
        });
        const response = {
            status: "success",
            body: newNote,
        };

        res.status(201).json(response);
    });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));