/**
 * This is a dummy adapter for testing the `convertFromOther` method
 * The structure is identical to the raw format, except all properties are prefixed with `X_`
 * Calling makeDummy(element) returns a dummy-fied tree, including dummyfying the children
 */

class DummyAdapter {
  
  getName(element) {

    return element.X_type;
  }
  
  getAttributes(element) {
    
    return element.X_props;
  }
  
  getChildren(element) {
    
    return element.X_children || [];
  }
  
  /**
   * Takes a raw format element, and turns it and all it's children into dummy elements (with the X_ prefix)
   * @param element
   */
  makeDummy(element) {
    if (typeof element === 'object') {
      return {
        X_type: element.type,
        X_props: element.props,
        X_children: (element.children || []).map(child => this.makeDummy(child))
      }
    }
    // All other types are just native, and are not modified
    return element;
  }
  
}

export default DummyAdapter;

