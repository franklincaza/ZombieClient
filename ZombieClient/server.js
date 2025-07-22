const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = path.join(process.cwd(), 'dist/ZombieClient/browser');
const { AppServerModuleNgFactory, ngExpressEngine } = require('./dist/ZombieClient/server/main');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y'
}));

app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});