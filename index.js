'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./tg-i18n.cjs.production.js');
} else {
    module.exports = require('./tg-i18n.cjs.development.js');
}
