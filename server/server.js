const app = require('./index');
const PORT = process.env.PORT;
const HOST = process.env.HOST;
app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
