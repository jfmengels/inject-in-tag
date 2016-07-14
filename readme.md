# inject-in-tag [![Build Status](https://travis-ci.org/jfmengels/inject-in-tag.svg?branch=master)](https://travis-ci.org/jfmengels/inject-in-tag)

> Inject content into Markdown files


## Install

```
$ npm install --save inject-in-tag
```

In Markdown, you can create comment tags of the form `<!-- foo bar -->` that will not appear to the user when rendered.
Using this system, we can use start and end tags to delimit sections and replace the content in between by new content.

## Programmatic usage

In the following example, we want to inject the contents of `resource` into `markDownContent`, some markdown file content.
We will inject the value of each key between tags that contain the key in the tag. Here, we will inject:
- `'\nSome new and better content\n'` between `<!-- SOME-TAG:START -->` and `<!-- SOME-TAG:END -->`
- `'Other content` between `<!-- SOME-OTHER-TAG:START -->` and `<!-- SOME-OTHER-TAG:END -->`

```js
const inject = require('inject-in-tag');

const resource = {
  'SOME-TAG': '\nSome new and better content\n',
  'SOME-OTHER-TAG': 'Other content'
}

const markDownContent = `
# Title

Lorem ipsum

## Sub-title

<!-- SOME-TAG:START -->
  Some content
<!-- SOME-TAG:END -->

<!-- SOME-OTHER-TAG:START -->Foo<!-- SOME-OTHER-TAG:END -->

Lorem ipsum
`;

const result = inject(resource, markDownContent);
result === `
# Title

Lorem ipsum

## Sub-title

<!-- SOME-TAG:START -->
  Some new and better content
<!-- SOME-TAG:END -->

<!-- SOME-OTHER-TAG:START -->Other content<!-- SOME-OTHER-TAG:END -->

Lorem ipsum
`
```


## API

### inject(resource, content)

Injects the contents of `resource` into `content`.

#### resource

Object with tag-name and content to inject pairs.

#### content

String content, that will be updated using `resource`


## CLI

```shell
inject-in-tag path/to/resource path/to/file/to/inject/in-1 path/to/file/to/inject/in-2 ...
```

`path/to/resource` must be a JavaScript file that exports a resource object, either directly (like `module.exports = {'SOME-TAG': 'content'};`) or through a Promise (like `module.exports = Promise.resolve({'SOME-TAG': 'content'});`). The CLI will then inject the contents in the tags of each of the following files.


## License

MIT © [Jeroen Engels](https://github.com/jfmengels)
