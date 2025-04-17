import express from 'express'

const app = express();
app.use(express.static("public"));

app.get('/health', (req, res) => {
    res.send('Hello!!');
});

app.listen(4000, '0.0.0.0', () => {
    console.log('Backend running on port 4000');
});
  