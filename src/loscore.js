// Let's make an object and start adding methods to it!
class LoScore {
  identity(val) {
    return val;
  }

  /**
  | ARRAYS
  |~~~~~~~~~~
  * */

  uniq(array) {
    let result = [];
    let test = false;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < result.length; j++) {
        if (array[i] === result[j]) {
          test = true;
        }
      }
      if (test === false) {
        result.push(array[i]);
      }
      test = false;
    }
    return result;
  }

  /**
  | COLLECTIONS
  |~~~~~~~~~~
  * */
  each(collection, iterator) {
    if (collection instanceof Array) {
      for (let i = 0; i < collection.length; i += 1) {
        iterator(collection[i], i, collection);
      }
    } else {
      const keys = Object.keys(collection);
      for (let i = 0; i < keys.length; i += 1) {
        iterator(collection[keys[i]], keys[i], collection);
      }
    }
  }

  map(collection, iteratee) {
    let result = [];
    this.each(collection, (val) => result.push(iteratee(val)));
    return result;
  }

  filter(collection, test) {
    const result = [];
    this.each(collection, (val) => test(val) && result.push(val));
    return result;
  }

  reject(collection, test) {
    let result = [];
    this.filter(collection, (val) => {
      if (!test(val)) {
        result.push(val);
      }
    });
    return result;
  }

  reduce(collection, iterator, accumulator) {
    let result = accumulator;
    if (typeof accumulator === "undefined") {
      result = collection[0];
      collection = collection.slice(1);
    }
    this.each(collection, (val) => {
      result = iterator(result, val);
    });
    return result;
  }

  every(collection, iterator) {
    if (typeof iterator === "undefined") {
      return true;
    }
    return this.reduce(
      collection,
      (acc, val) => {
        if (!acc) {
          return false;
        } else return iterator(val);
      },
      true
    );
  }

  /**
  | OBJECTS
  |~~~~~~~~~~
  * */
  extend(objA, ...objB) {
    for (let item of objB) {
      this.each(item, (val, key) => {
        objA[key] = val;
      });
    }
    return objA;
  }

  /**
  | FUNCTIONS
  |~~~~~~~~~~
  * */

  once(func) {
    let wasCalled = false;
    let result = 0;
    return function() {
      if (wasCalled === false) {
        result = func();
        wasCalled = true;
      }
      return result;
    };
  }

  memoize(func) {
    let cache = {};
    return function(...args) {
      if (cache[args]) {
        return cache[args];
      } else {
        let val = func(args);
        cache[args] = val;
        return val;
      }
    };
  }

  invoke(collection, functionOrKey) {
    let result = [];
    if (typeof functionOrKey !== "function") {
      this.each(collection, (val, index) => {
        result.push(collection[index][functionOrKey].apply(val));
      });
    } else {
      this.each(collection, (val) => {
        result.push(functionOrKey.apply(val));
      });
    }
    return result;
  }

  /**  
  | ADVANCED REQUIREMENTS
  |~~~~~~~~~~~~~
  * */

  sortBy() {
    // YOUR CODE HERE
  }

  zip() {
    // YOUR CODE HREE
  }

  delay() {
    // YOUR CODE HERE
  }

  defaults() {
    // YOUR CODE HERE
  }

  throttle() {
    // YOUR CODE HERE
  }
}

module.exports = new LoScore();
