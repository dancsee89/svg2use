const fs = require('fs');
const domParser = require('xmldom').DOMParser;

async function svg2use(source = './source', target = './target') {
    try {
        if (fs.existsSync(source)) {
            fs.readdir(source, (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.search('.svg') !== -1) {
                        const fileStream = fs.readFileSync(source + '/' + file, {encoding: 'utf8'});
                        const parsedFile = parseSvg(fileStream);

                        fs.writeFile(target + '/' + file, parsedFile, (err) => {
                            if (err)
                                throw new Error(err);
                        });
                    }
                }
            });
        } else {
            throw new Error(`Source directory doesn't exist: ${source}`);
        }
    } catch (e) {
        console.error(e);
    }
}

function parseSvg(fileStream) {
    let document = new domParser().parseFromString(fileStream);
    const useTags = document.getElementsByTagName('use');

    for (let i = 0; i < useTags.length; i++) {
        let tag = useTags.item(i);

        const referencedId = tag.getAttribute('xlink:href').split('#')[1];

        const referencedElement = document.getElementById(referencedId).cloneNode();

        document.replaceChild(referencedElement, tag);
    }

    return document;
}

module.exports = svg2use;