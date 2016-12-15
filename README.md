## jQuaere
A lightweight library for DOM manipulation.

### How To Use

To use jQuaere, simply add this to the top of your html:

```html
<script src="https://cdn.rawgit.com/chasem91/jQuaere/master/lib/jquaere.js"></script>
```

Alternatively, you may save 'jquaere.js'(found in the 'lib' folder) to your project and access it directly from your html.

### Overview

#### $l(selector)

$l accepts a string, callback or HTMLElement as an argument. In the case of a string or HTMLElement, an instance of DOMNodeCollection is returned. A DOMNodeCollection allows the user to manipulate a collection of HTML elements in various ways(The DOMNodeCollection API is described in further detail below). If a callback is passed in, the callback will be added to a queue of callbacks to be invoked once the DOM has fully loaded. If the DOM has already loaded, the callback will not be queued and will instead be invoked immediately.

```javascript
    const DOMNodeCollection = require('./dom_node_collection');

    const callbacks = [];
    let docReady = false;

    document.addEventListener("DOMContentLoaded", () => {
      docReady = true;
      callbacks.forEach( callback => callback() );
    });

    window.$l = selector => {
      if(typeof selector === "string") {
        return new DOMNodeCollection(Array.from(document.querySelectorAll(selector)));
      } else if (typeof selector === "function") {
        if (docReady) selector(); else callbacks.push(selector);
      } else if (selector instanceof HTMLElement) {
        return new DOMNodeCollection([selector]);
      }
    };
```

#### $l.ajax(options)
Opens and sends an XHR(XML Http Request) supplied with default parameters where are defined as an object which may be overwritten by passing in a custom `options` object.

```javascript
$l.extend = (firstObj, ...otherObjs) => {
  otherObjs.forEach( obj => {
    for (const key in obj) firstObj[key] = obj[key];
  });
  return firstObj;
};

toQueryString = obj => {
  let result = "";
  for(const key in obj) {
    if (obj.hasOwnProperty(key)) result += `${key}=${obj[key]}&`;
  }
  return result.substring(0, result.length - 1);
};

$l.ajax = options => {
  const request = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {}
  };
  options = $l.extend(defaults, options);
  options.method = options.method.toUpperCase();

  if (options.method === "GET") {
    options.url += `?${toQueryString(options.data)}`;
  }

  request.open(options.method, options.url, true);
  request.onload = e => {
    if (request.status === 200) {
      options.success(request.response);
    } else {
      options.error(request.response);
    }
  };

  request.send(JSON.stringify(options.data));
};
```




#### DOMNodeCollection

- ##### constructor(htmlElements)
The constuctor function simply sets `htmlElements` as an instance variable.

- ##### .html(string)
If string is given, set innerHTML of all nodes in `htmlElements`. If no string is given, return value of current innerHTML.

- ##### .empty()
Set innerHTML value to empty string for all nodes in `htmlElements`.

- ##### .append(child)
Append outerHTML of child element to innerHTML of each node in `htmlElements`.

- ##### .attr(attribute, value)
If attribute and value is given, set value of attribute to passed in value. If only attribute is given, return value of attribute.

- ##### .addClass(className)
Append className to existing class name of each node in `htmlElements`.

- ##### .removeClass(className)
Remove all instances of passed in class name in each of the nodes in `htmlElements`.

- ##### .children()
Returns new DOMNodeCollection containing all children of each node in current `htmlElements`.

- ##### .parent()
Returns new DOMNodeCollection containing a unique set of parents of nodes from current `htmlElements`.

- ##### .find(selector)
Returns all descendants of the current `htmlElements` filtered by the passed in selector.

- ##### .remove(selector)
Removes `htmlElements` from the DOM. Accepts an optional selector as a filter.

- ##### .on(eventType, callback)
Attaches an event handler to given event type (such as 'click') on each node in `htmlElements`.

- ##### .off(eventType)
Removes all event handlers for given event type from all nodes in `htmlElements`.
