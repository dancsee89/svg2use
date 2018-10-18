const fs = require('fs');
const xmldom = require('xmldom');

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
			const referencedId = tag.getAttribute('xlink:href').split('#')[1];

			const useTagAttributes = tag.attributes;

			let referencedElement = document.getElementById(referencedId).cloneNode();

			for (let j = 0; j < useTagAttributes.length; j++) {
				const attribute = useTagAttributes.item(j);

				if (attribute.name !== 'xlink:href') {
					referencedElement.setAttribute(attribute.name, attribute.value);
				}
			}

			document.replaceChild(referencedElement, tag);
		});

		return new xmldom.XMLSerializer().serializeToString(document);
	} catch (error) {
		console.error(`Couldn't replace use tags inside svg.`);
		throw error;
	}
}

module.exports = svg2use;
