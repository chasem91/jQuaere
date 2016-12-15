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
        if (element.attributes["class"] === undefined) {
          element.setAttribute("class", className);
        } else {
          if (element.attributes["class"].nodeValue === ""){
            element.attributes["class"].nodeValue += `${className}`;
          } else {
            element.attributes["class"].nodeValue += ` ${className}`;
          }
        }
      }
    });

    return this.htmlElements;
  }

  removeClass(className) {
    const classNames = this.attr('class').split(" ");
    this.attr('class', '');
    classNames.forEach( (name) => {
      if (name !== className) {
        this.addClass(name);
      }
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
      const eventKey = `jqliteEvents-${eventType}`;
      if (typeof element[eventKey] === "undefined") {
        element[eventKey] = [];
      }
      element[eventKey].push(callback);
    });
  }

  off(eventType) {
    this.htmlElements.forEach(element => {
      const eventKey = `jqliteEvents-${eventType}`;
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
