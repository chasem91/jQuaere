const DOMNodeCollection = require('./dom_node_collection');

const callbacks = [];
let docReady = false;

window.$l = selector => {
  if(typeof selector === "string") {
    return new DOMNodeCollection(Array.from(document.querySelectorAll(selector)));
  } else if (typeof selector === "function") {
    if (docReady) func(); else callbacks.push(selector);
  } else if (selector instanceof HTMLElement) {
    return new DOMNodeCollection([selector]);
  }
};

$l.extend = (firstObj, ...otherObjs) => {
  otherObjs.forEach( obj => {
    for (const key in obj) firstObj[key] = obj[key];
  });
  return firstObj;
};

$l.ajax = options => {
  const request = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
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

toQueryString = obj => {
  let result = "";
  for(const key in obj) {
    if (obj.hasOwnProperty(key)) result += `${key}=${obj[key]}&`;
  }
  return result.substring(0, result.length - 1);
};

document.addEventListener("DOMContentLoaded", () => {
  docReady = true;
  callbacks.forEach( callback => callback() );

  $lul = ('ul');
  
});
