const express = require('express');
const app = express();
const fs = require('fs');

const PORT = process.env.PORT || 3001;

app.use(express.static("public"));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
});

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
          console.err(err);
          return;
        } else {
            const parsedNotes = JSON.parse(data);
            return parsedNotes;
            // I am aware this does not work :( I will fix later 
        }
    })
    res.send(parsedNotes)
});

app.post('/api/notes', (req, res) => {

    const { title, text } = req.body;
 
    if (title && text) {
        const newNote = {
            title,
            text,
            // review_id: uuid(), //make work somehow
        };

        fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.err(err);
            return;
        } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            const notesString = JSON.stringify(parsedNotes, null, 2);

            fs.writeFile(`./db/db.json`, notesString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Note for ${newNote.title} has been written to JSON file`
                )
            );
        }
        });

        const response = {
        status: "success",
        body: newReview,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json("Error in posting the note");
    }
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));