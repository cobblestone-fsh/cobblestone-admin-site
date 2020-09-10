
require('./config');

const app = require('./router');

app.listen(parseInt(process.env.SERVER_PORT), () => {
  console.log(`Admin app listening on port ${process.env.SERVER_PORT}`);
});