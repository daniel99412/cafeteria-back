const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const morgan = require('morgan');

// Initialiations
const app = express();

// Settings
app.set('HTTPS_PORT', process.env.HTTPS_PORT || 8443);
app.set('HTTP_PORT', process.env.HTTP_PORT || 8080);

// Middlewares
app.use(morgan('dev'));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT']
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.enable('trust proxy');

// Global variables
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    const location = req.headers.host.split(':')[0];

    // Redirect HTTP trafic to HTTPS
    if(!req.secure) {
        return res.redirect(307, 'https://' + location + ':' + app.get('HTTPS_PORT') + req.url)
    };

    next();
});

// Config HTTPS and HTTP servers
const httpsServer = https.createServer({
    key: fs.readFileSync(__dirname + '/ssl/server.key'),
    cert: fs.readFileSync(__dirname + '/ssl/server.crt')
}, app);

const httpServer = http.createServer(app);

// Routes
app.use(require('./routes/index.routes.js'));
app.use('/api/employee', require('./routes/employee.routes'));
app.use('/api/product', require('./routes/product.routes'));
app.use('/api/ingredient', require('./routes/ingredient.routes'));

// Public

// Starting servers
httpsServer.listen(app.get('HTTPS_PORT'), () => {
    console.info('HTTPS Server status -> UP!');
    console.info(`Listening on port   -> ${app.get('HTTPS_PORT')}`);
});

httpServer.listen(app.get('HTTP_PORT'), () => {
    console.info('HTTP Server status  -> UP!');
    console.info(`Listening on port   -> ${app.get('HTTP_PORT')}`);
});
