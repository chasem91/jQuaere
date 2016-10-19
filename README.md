## jQuaere

### Overview

A lightweight library for DOM manipulation.

### Examples

### Public API

#### constructor(htmlElements)

#### html(string)
If string is given, set innerHTML of all nodes in selection. If no string is given, return value of current innerHTML.

#### empty()
Set innerHTML value to empty string for all nodes in selection.

#### append(child)
Append outerHTML of child element to innerHTML of each node in selection.

#### attr(attribute, value)
If attribute and value is given, set value of attribute to passed in value. If only attribute is given, return value of attribute.

#### addClass(className)
Append className to existing class name of each node in selection.

#### removeClass(className)
Remove all instances of passed in class name in each of the nodes in selection.

#### children()
Returns new DOMNodeCollection containing all children of each node in current selection.

#### parent()
Returns new DOMNodeCollection containing a unique set of parents of nodes from current selection.

#### find(selector)

#### remove(selector)

#### on(eventType, callback)

#### off(eventType)
