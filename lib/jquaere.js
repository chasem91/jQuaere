/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	const callbacks = [];
	let docReady = false;

	window.$l = selector => {
	  if(typeof selector === "string") {
	    return new DOMNodeCollection(Array.from(document.querySelectorAll(selector)));
	  } else if (typeof selector === "function") {
	    if (docReady) selector(); else callbacks.push(selector);
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
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class DOMNodeCollection {
	  constructor(htmlElements){
	    this.htmlElements = htmlElements;
	  }

	  html(string) {
	    if(arguments.length === 0){
	      return this.htmlElements[0].innerHTML;
	    } else {
	      this.htmlElements[0].innerHTML = string;
	      return string;
	    }
	  }

	  empty() {
	    for (let i = 0; i < this.htmlElements.length; i++) {
	      this.htmlElements[i].innerHTML = "";
	    }
	  }

	  append(child) {
	    this.htmlElements.forEach((el) => {
	      if (child instanceof DOMNodeCollection) {
	        child.htmlElements.forEach((childEl) => {
	          el.innerHTML += childEl.outerHTML;
	        });
	      } else if (child instanceof HTMLElement) {
	        el.innerHTML += child.outerHTML;
	      } else if (typeof child === "string") {
	        el.innerHTML += child;
	      }
	    });
	  }

	  attr(attribute, value) {
	    for (var i = 0; i < this.htmlElements.length; i++) {
	      const element = this.htmlElements[i];
	      if (arguments.length === 1) {
	        return element.attributes[attribute].nodeValue;
	      } else if (arguments.length >= 2 && typeof value === 'string') {
	        if (element.attributes[attribute] === undefined) {
	          element.setAttribute(attribute, value);
	        } else {
	          element.attributes[attribute].nodeValue = value;
	        }
	      }
	    }

	    return this.htmlElements;
	  }

	  addClass(className) {
	    this.htmlElements.forEach((element) => {
	      if (typeof className === 'string') {
	        element.classList.push(className);
	      }
	    });
	    return this.htmlElements;
	  }

	  removeClass(className) {
	    this.htmlElements.forEach( element => {
	      element.classList = element.classList.filter( existingClass => {
	        return existingClass === className;
	      });
	    });
	    return this.htmlElements;
	  }

	  children() {
	    let children = [];

	    this.htmlElements.forEach((element) => {
	      children = children.concat(Array.from(element.children));
	    });

	    return new DOMNodeCollection(children);
	  }

	  parent() {
	    let parents = [];

	    this.htmlElements.forEach((element) => {
	      const parent = element.parentElement;

	      if (!(parents.includes(parent))) {
	        parents.push(parent);
	      }
	    });

	    return new DOMNodeCollection(parents);
	  }

	  find(selector) {
	    let foundChildren = [];

	    this.htmlElements.forEach((element) => {
	      let children = [];
	      children = children.concat(Array.from(element.children));
	      children.forEach((child) => {

	        if (typeof selector === 'string' &&
	          child.tagName === selector.toUpperCase()) {

	          foundChildren.push(child);
	        }
	      });
	    });

	    return new DOMNodeCollection(foundChildren);
	  }

	  remove(selector) {
	    const elements = this.find(selector).htmlElements;

	    elements.forEach((element) => {
	      element.remove();
	      for (let i = 0; i < this.htmlElements.length; i++) {
	        if (this.htmlElements[i] === element) {
	          this.htmlElements.splice(i, 1);
	        }
	      }
	    });
	  }

	  on(eventType, callback) {
	    this.htmlElements.forEach(element => {
	      element.addEventListener(eventType, callback);
	      const eventKey = `jQuaereEvents-${eventType}`;
	      if (typeof element[eventKey] === "undefined") {
	        element[eventKey] = [];
	      }
	      element[eventKey].push(callback);
	    });
	  }

	  off(eventType) {
	    this.htmlElements.forEach(element => {
	      const eventKey = `jQuaereEvents-${eventType}`;
	      if (element[eventKey]) {
	        element[eventKey].forEach(callback => {
	          element.removeEventListener(eventType, callback);
	        });
	      }
	      element[eventKey] = [];
	    });
	  }
	}

	module.exports = DOMNodeCollection;


/***/ }
/******/ ]);