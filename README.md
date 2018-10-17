# svg2use
A simple lightweight nodejs library that replaces &lt;use&gt; tags in svg files with the referenced element. It's quite useful when having issues with polyfills in IE.

## Usage

This library will read svg files from the source directory, and saves the transformed ones to the target directory. By default, it's set to `source` and `target` directories of this repository.

Alternatively, you can add your own directories as a parameter:

```javascript
const svg2use = require('./svg2use');

svg2use('./source', './target')
    .then(
        console.log('All files transformed successfully.')
    )
    .catch(e => {
        console.log(e);
    });
```

## Before

```xml
<defs>
  <path id="a" d="M15.031 23.185V.76H.65v22.424H15.03z"></path>
</defs>
[...]
<mask id="b" fill="#fff">
  <use xlink:href="#a"></use>
</mask>
```

## After 

```xml
<defs>
  <path id="a" d="M15.031 23.185V.76H.65v22.424H15.03z"></path>
</defs>
[...]
<mask id="b" fill="#fff">
  <path id="a" d="M15.031 23.185V.76H.65v22.424H15.03z"/>
</mask>
```