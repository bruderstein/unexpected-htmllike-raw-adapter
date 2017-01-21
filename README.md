# unexpected-htmllike-raw-adapter

This is the raw JSON adapter for [unexpected-htmllike](https://github.com/bruderstein/unexpected-htmllike)

If expects and creates objects with `type`, `props` and `children` keys.

`type` is the element type name

`props` is an object with key-value of the properties of the element

`children` is always an array (even for a single child or no children) of the sub-elements, also objects in the same format. 

# Usage

You need to instantiate a new instance of the adapter in order to use it.  With the instance, you can set
options (using `setOptions({ ... })`) to influence how certain things are returned to 
[unexpected-htmllike](https://github.com/bruderstein/unexpected-htmllike). 

```js
var UnexpectedHtmlLike = require('unexpected-htmllike');
var RawAdapter = require('unexpected-htmllike-raw-adapter');

var adapter = new RawAdapter();

var rawHtmlLike = new UnexpectedHtmlLike(adapter);

// Now you can use rawHtmlLike.diff(...) etc

```

# Options

## setOptions(object)

Available options: 
* concatTextContent - (default `false`) set this to true, to concatenate text content items.
* convertToString - (default `false`) converts the content to strings. This is useful when comparing against a rendered
  result, where only strings are available, but you want to maintain the separate items
* convertMultipleRawToStrings - (default: `false`) - converts content to strings, when there is more than one content item.
  This is done specifically for comparing with rendered react elements, where the type is the original for single children,
  but is already converted to a string when there are multiple raw siblings

For example, with the following JSX, when rendered with the [`react-test-renderer`](https://www.npmjs.com/package/react-test-renderer)
```xml
<button>
  Button was clicked {this.state.clickCount} times
</button>
```

The `<button>` will have 3 content items:

(Let's say `this.state.clickCount === 10`)

`[ 'Button was clicked ', 10, ' times' ]`

If you're diffing with `unexpected-htmllike`, these 3 content items must match exactly. When setting `concatTextContent` 
to true, this would result in a single string content item

`[ 'Button was clicked 10 times' ]`

If the `convertToString` option is true, the following is returned 

`[ 'Button was clicked ', '10', ' times' ]`

The options take immediate effect, and can be changed per instance of the adapter (hence, you could, although not recommended),
set the options differently for the `actualAdapter` and the `expectedAdapter` for `unexpected-htmllike`

# License

MIT