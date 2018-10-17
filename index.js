const svg2use = require('./svg2use');

svg2use('./source', './target')
    .then(
        console.log('All files transformed successfully.')
    )
    .catch(e => {
        console.log(e);
    });