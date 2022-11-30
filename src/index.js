const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const fs = require('fs');
const morganMiddleware = require('./middlewares/morgan.middleware');
const logger = require('./utils/logger');

// Initialiations
const app = express();

// Settings
app.set('HTTPS_PORT', process.env.HTTPS_PORT || 8443);
app.set('HTTP_PORT', process.env.HTTP_PORT || 8080);

// Middlewares
app.use(morganMiddleware);
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
    cert: fs.readFileSync(__dirname + '/ssl/server.crt'),
    key: fs.readFileSync(__dirname + '/ssl/server.key')
}, app);

const httpServer = http.createServer(app);

// Routes10:36 AM10:36 AM10:36 AM
app.use('/api/employee', require('./routes/employee.routes'));
app.use('/api/product', require('./routes/product.routes'));
app.use('/api/ingredient', require('./routes/ingredient.routes'));
app.use('/api/supplier', require('./routes/supplier.routes'));
app.use('/api/iva', require('./routes/iva.routes'));
app.use('/api/sale', require('./routes/sale.routes'));
app.use('/api/purchase', require('./routes/purchase.routes'));
app.use('/api/product-ingredient', require('./routes/productIngredient.routes'));

// Public
app.use(require('./routes/index.routes.js'));

// Starting servers
httpsServer.listen(app.get('HTTPS_PORT'), () => {
    logger.info('HTTPS Server status -> UP!');
    logger.info(`Listening on port: ${app.get('HTTPS_PORT')}`);
});

httpServer.listen(app.get('HTTP_PORT'), () => {
    logger.info('HTTP Server status  -> UP!');
    logger.info(`Listening on port: ${app.get('HTTP_PORT')}`);
});
