const express = require('express');

const app = express();

app.get('/api/test', (req, res) => {
    const test = { id : "oui"};

    res.json(test);
})

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));