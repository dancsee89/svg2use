const fs = require('fs');
const xmldom = require('xmldom');

const xlinkNS = 'http://www.w3.org/1999/xlink';

async function svg2use(source = './source', target = './target') {
    try {
        if (fs.existsSync(source)) {
            fs.readdir(source, (err, files) => {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.search('.svg') !== -1) {
                        const fileStream = fs.readFileSync(source + '/' + file, {encoding: 'utf8'});
                        const parsedFile = replaceUseTags(fileStream);

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

function replaceUseTags(fileStream) {
    try {
        let document = new xmldom.DOMParser().parseFromString(fileStream);
        const useTags = Array.from(document.getElementsByTagName('use'));

        useTags.forEach(tag => {
            const referencedId = tag.getAttributeNS(xlinkNS, 'href').split('#')[1];
            let referencedElement = document.getElementById(referencedId).cloneNode();

            const useTagAttributes = Array.from(tag.attributes);

            useTagAttributes.forEach(attribute => {
                if (attribute.namespaceURI !== xlinkNS && attribute.localName !== 'href') {
                    referencedElement.setAttribute(attribute.name, attribute.value);
                }
            });

            document.replaceChild(referencedElement, tag);
        });

        return new xmldom.XMLSerializer().serializeToString(document);
    } catch (error) {
        console.error(`Couldn't replace use tags inside svg.`);
        throw error;
    }
}

module.exports = svg2use;
