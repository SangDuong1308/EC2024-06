const app = require('./src/app');

const PORT = process.env.PORT || 8888;

const server = app.listen(PORT, () => {
    console.log(`Web service started on port ${PORT}`);
});
