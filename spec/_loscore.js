const _ = require("../src/loscore");
const { expect } = require("chai");
const { spy } = require("sinon");

const disallowedMethods = [
  "map",
  "indexOf",
  "forEach",
  "filter",
  "reduce",
  "every",
  "some",
];
const spyOnNativeMethods = () => {
  for (let method of disallowedMethods) {
    spy(Array.prototype, method);
  }
};

const spyReport = () => {
  // DO NOT CHANGE TO USE NATIVE METHODS HERE!!!
  let hasBeenCalled = false;
  for (let method of disallowedMethods) {
    if (Array.prototype[method].called) {
      hasBeenCalled = true;
    }
  }

  return hasBeenCalled;
};

const releaseSpies = () => {
  disallowedMethods.forEach((value) => {
    Array.prototype[value].restore();
  });
};

const isEven = (num) => {
  return num % 2 === 0;
};

const isOdd = (num) => {
  return !isEven(num);
};

describe("LoScore", () => {
  describe("Basics", () => {
    beforeEach(() => {
      spyOnNativeMethods();
    });

    afterEach(() => {
      releaseSpies();
    });
    describe("identity", () => {
      it("should not use native methods", () => {
        _.identity(1);
        expect(spyReport()).to.be.false;
      });
      it("should return the value passed to it", () => {
        const obj = {};
        const arr = [];
        expect(_.identity(1)).to.eql(1);
        expect(_.identity("string")).to.eql("string");
        expect(_.identity(true)).to.be.true;
        expect(_.identity(obj)).to.eql(obj);
        expect(_.identity(arr)).to.eql(arr);
      });
    });
  });

  describe("Arrays", () => {
    beforeEach(() => {
      spyOnNativeMethods();
    });

    afterEach(() => {
      releaseSpies();
    });

    describe("uniq", () => {
      it("should not use native methods", () => {
        const input = [1, 2, 3, 4, 5];
        _.uniq(input);
        expect(spyReport()).to.be.false;
      });

      it("should not mutate the input array", () => {
        const input = [1, 2, 3, 4, 5];
        _.uniq(input);

        /*
            We should avoid mutation of inputs/arguments in general unless
            you have a VERY good reason. Mutating inputs makes it a lot harder
            to debug your code and find bugs and it can also just be downright confusing
            to read!
          */

        expect(input).to.eql([1, 2, 3, 4, 5]);
      });

      it("should not alter arguments", () => {
        expect(() => _.uniq(Object.freeze([1, 2, 3, 3, 3, 3, 2, 2, 4]))).not.to
          .throw;
      });

      it("should return all unique values contained in an unsorted array", () => {
        const numbers = [5, 3, 2, 1, 5, 6, 1, 3];
        expect(_.uniq(numbers)).to.eql([5, 3, 2, 1, 6]);
      });
    });
  });

  describe("Collections", () => {
    beforeEach(() => {
      spyOnNativeMethods();
    });

    afterEach(() => {
      releaseSpies();
    });
    describe("each", () => {
      it("should not use native methods", () => {
        _.each([1, 2, 3, 4], () => {});
        expect(spyReport()).to.be.false;
      });

      it("should not return anything", () => {
        const returnValue = _.each([], () => {});
        expect(returnValue).to.be.undefined;
      });

      it("should not mutate the input array", () => {
        const input = [1, 2, 3, 4, 5];
        _.each(input, () => {});

        /*
            We should avoid mutation of inputs/arguments in general unless
            you have a VERY good reason. Mutating inputs makes it a lot harder
            to debug your code and find bugs and it can also just be downright confusing
            to read!
          */

        expect(input).to.eql([1, 2, 3, 4, 5]);
      });

      it("should iterate over arrays and provide access to each value", () => {
        const array = ["a", "b", "c"];
        const iterations = [];

        _.each(array, (l) => {
          iterations.push(l);
        });

        expect(iterations).to.eql(["a", "b", "c"]);
      });

      it("should iterate over arrays and provide access to each index", () => {
        const array = ["a", "b", "c"];
        const iterations = [];

        _.each(array, (l, i) => {
          iterations.push(i);
        });

        expect(iterations).to.eql([0, 1, 2]);
      });

      it("should iterate over arrays and provide access to the original collection", () => {
        const array = ["a", "b", "c"];
        const iterations = [];

        _.each(array, (l, i, collection) => {
          iterations.push(collection);
        });

        expect(iterations).to.eql([array, array, array]);
      });

      it("should only iterate over numeric keys of an array, not all properties", () => {
        const array = ["a", "b", "c"];
        const iterations = {};
        array.testFoo = "OH NO!";

        _.each(array, (l, i) => {
          iterations[l] = i;
        });

        expect(iterations["OH NO!"]).to.be.undefined;
      });

      it("should iterate over objects and provide access to each value", () => {
        const obj = {
          z: "a",
          x: "b",
          y: "c",
        };
        const iterations = [];

        _.each(obj, (value) => {
          iterations.push(value);
        });

        expect(iterations).to.eql(["a", "b", "c"]);
      });

      it("should iterate over objects and provide access to each key", () => {
        const obj = {
          z: "a",
          x: "b",
          y: "c",
        };
        const iterations = [];

        _.each(obj, (value, key) => {
          iterations.push(key);
        });

        expect(iterations).to.eql(["z", "x", "y"]);
      });

      it("should iterate over objects and provide access to the original object", () => {
        const obj = {
          z: "a",
          x: "b",
          y: "c",
        };
        const iterations = [];

        _.each(obj, (value, key, object) => {
          iterations.push(object);
        });

        expect(iterations).to.eql([obj, obj, obj]);
      });

      it("should not confuse an object with a length property for an array", () => {
        const person = {
          height: 170,
          weight: 57,
          length: 80,
        };
        const iterations = [];

        _.each(person, (value, key, object) => {
          iterations.push([value, key, object]);
        });

        expect(iterations).to.eql([
          [170, "height", person],
          [57, "weight", person],
          [80, "length", person],
        ]);
      });
    });

    describe("map", () => {
      beforeEach(() => {
        spy(_, "each");
      });

      afterEach(() => {
        _.each.restore();
      });

      it("should not use native methods", () => {
        _.map([1, 2, 3, 4], () => {});
        expect(spyReport()).to.be.false;
      });

      it("should not mutate the input array", () => {
        const input = [1, 2, 3, 4, 5];
        _.map(input, _.identity);
        expect(input).to.eql([1, 2, 3, 4, 5]);
      });

      it("should run a function through every given element in array", () => {
        const result = _.map([1, 2, 3], (num) => {
          return num + 2;
        });

        expect(result).to.eql([3, 4, 5]);
      });

      it("should use each in its code", () => {
        _.map([1, 2, 3], _.identity);
        expect(_.each.called).to.be.true;
      });

      it("should produce a brand new array", () => {
        const numbers = [1, 2, 3];
        const result = _.map(numbers, _.identity);
        expect(result === numbers).to.be.false;
      });
    });

    describe("filter", () => {
      beforeEach(() => {
        spy(_, "each");
      });

      afterEach(() => {
        _.each.restore();
      });

      it("should not use native methods", () => {
        _.filter([1, 2, 3, 4], isEven);
        expect(spyReport()).to.be.false;
      });

      it("should return all even numbers in an array", () => {
        const evens = _.filter([1, 2, 3, 4, 5, 6], isEven);
        expect(evens).to.eql([2, 4, 6]);
      });

      it("should return all odd numbers in an array", () => {
        const odds = _.filter([1, 2, 3, 4, 5, 6], isOdd);
        expect(odds).to.eql([1, 3, 5]);
      });

      it("should use each in its solution", () => {
        _.filter([1, 2, 3], isEven);
        expect(_.each.called).to.be.true;
      });

      it("should produce a brand new array", () => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const evens = _.filter(numbers, isOdd);
        expect(evens).not.to.eql(numbers);
      });
    });

    describe("reject", () => {
      beforeEach(() => {
        spy(_, "filter");
      });

      afterEach(() => {
        _.filter.restore();
      });

      it("should not use native methods", () => {
        _.reject([1, 2, 3, 4], isEven);
        expect(spyReport()).to.be.false;
      });

      it("should reject all even numbers", () => {
        const odds = _.reject([1, 2, 3, 4, 5, 6], isEven);
        expect(odds).to.eql([1, 3, 5]);
      });

      it("should reject all odd numbers", () => {
        const evens = _.reject([1, 2, 3, 4, 5, 6], isOdd);
        expect(evens).to.eql([2, 4, 6]);
      });

      it("should use filter in its solution", () => {
        _.reject([1, 2, 3], isEven);
        expect(_.filter.called).to.be.true;
      });

      it("should produce a brand new array", () => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const odds = _.reject(numbers, isOdd);
        expect(odds).not.to.eql(numbers);
      });
    });

    describe("reduce", () => {
      beforeEach(() => {
        spy(_, "each");
      });

      afterEach(() => {
        _.each.restore();
      });

      it("should not use native methods", () => {
        _.reduce([1, 2, 3, 4], (memo, item) => {
          return item;
        });
        expect(spyReport()).to.be.false;
      });

      it("should return one value", () => {
        const result = _.reduce([1, 2, 3], (memo, item) => {
          return item;
        });

        expect(result).to.not.be.undefined;
      });

      it("should not mutate the original array", () => {
        const input = [1, 2, 3, 4, 5];
        _.reduce(input, (memo, item) => {
          return item;
        });

        expect(input).to.eql([1, 2, 3, 4, 5]);
      });

      it("should call the iterator function with arguments memo and item in that order", () => {
        let givenMemo, givenItem;
        _.reduce(
          ["item"],
          (memo, item) => {
            givenMemo = memo;
            givenItem = item;
          },
          "memo"
        );

        expect(givenMemo).to.eql("memo");
        expect(givenItem).to.eql("item");
      });

      it("should pass in items from left to right through iterator", () => {
        const orderedResult = [];

        _.reduce(
          [1, 2, 3, 4],
          (memo, item) => {
            orderedResult.push(item);
            return memo;
          },
          10
        );

        expect(orderedResult).to.eql([1, 2, 3, 4]);
      });

      it("should call iterator even if iterator returns undefined", () => {
        let callCount = 0;
        const returnFalsy = (total, item) => {
          callCount++;
          if (callCount === 1) {
            return undefined;
          }
          return item + 1;
        };

        const total = _.reduce([1, 1, 2], returnFalsy);
        expect(total).to.eql(3);
      });

      it("should pass every item of the array through the iterator if a memo is passed in", () => {
        const result = _.reduce(
          [1, 2, 3],
          (memo, item) => {
            return memo - item;
          },
          10
        );

        expect(result).to.eql(4);
      });

      it("should accept falsy values as a valid memo", () => {
        const result = _.reduce(
          [1, 2, 3],
          (memo, item) => {
            return memo * item;
          },
          0
        );

        expect(result).to.eql(0);
      });

      it("should set memo to be first item of the array if no memo is given", () => {
        const result = _.reduce([1, 2, 3], _.identity);

        expect(result).to.eql(1);
      });

      it("should pass the second item of the array into the iterator first if no memo is given", () => {
        const result = _.reduce([3, 2, 1], (memo, item) => {
          return memo - item;
        });

        expect(result).to.eql(0);
      });

      it("should use _.each in the solution", () => {
        _.reduce([3, 2, 1], _.identity);
        expect(_.each.called).to.be.true;
      });
    });

    describe("every", () => {
      beforeEach(() => {
        spy(_, "reduce");
      });

      afterEach(() => {
        _.reduce.restore();
      });

      it("should not use native methods", () => {
        _.every([1, 2, 3, 4], _.identity);
        expect(spyReport()).to.be.false;
      });

      it("should use _.reduce", () => {
        _.every([1, 2, 3], _.identity);
      });

      it("should return true if every value passes test", () => {
        const array = [1, 2, 3, 4, 5];
        const test = (number) => number < 6;
        expect(_.every(array, test)).to.be.true;
      });

      it("should return false if something does not pass", () => {
        const array = [1, 2, 3, 4, 5];
        const test = (number) => !(number === 3);
        expect(_.every(array, test)).to.be.false;
      });

      it("should pass by default for an empty collection", () => {
        expect(_.every([], _.identity)).to.be.true;
      });

      it("passes for a collection of all-truthy results", () => {
        expect(_.every([true, {}, 1], _.identity)).to.be.true;
      });

      it("fails for a collection of all-falsy results", () => {
        expect(_.every([null, 0, undefined], _.identity)).to.be.false;
      });

      it("treats each item as as a callback result when no callback is provided", () => {
        expect(_.every([true, true, true])).to.be.true;
      });

      it("works when provded a collection containing undefined values", () => {
        expect(_.every([undefined, undefined, undefined], _.identity)).to.be
          .false;
      });
    });
  });

  describe("Objects", () => {
    beforeEach(() => {
      spyOnNativeMethods();
    });

    afterEach(() => {
      releaseSpies();
    });
    describe("extend", () => {
      beforeEach(() => {
        spy(_, "each");
      });

      afterEach(() => {
        _.each.restore();
      });

      it("should not use native methods", () => {
        _.extend({}, {});
        expect(spyReport()).to.be.false;
      });

      it("should use each", () => {
        _.extend({}, {});
        expect(_.each.called).to.be.true;
      });

      it("should shallowly copy one object to another", () => {
        const objA = {
          name: "moe",
        };
        const objB = {
          age: 50,
          favoriteThings: [
            "raindrops on roses",
            "whiskers on kittens",
            "bright copper kettles",
            "warm woolen mittens",
            "brown paper packages tied up with strings",
          ],
        };
        // Extend objA to have all of objB's properties.
        const extendedObjA = _.extend(objA, objB);
        expect(extendedObjA).to.eql({
          name: "moe",
          age: 50,
          favoriteThings: [
            "raindrops on roses",
            "whiskers on kittens",
            "bright copper kettles",
            "warm woolen mittens",
            "brown paper packages tied up with strings",
          ],
        });

        // Manipulate favoriteThings in objB's reference and expect the result to appear in extendedObjA's reference.
        objB.favoriteThings.pop();
        expect(extendedObjA.favoriteThings).to.eql(objB.favoriteThings);

        expect(_.extend({}, objA).age).to.eql(50);
      });

      it("should return the first argument", () => {
        const objA = {};
        const objB = {};
        expect(_.extend(objA, objB)).to.eql(objA);
      });

      it("should override properties found in the source", () => {
        const objA = {
          name: "moe",
        };
        const objB = {
          name: "joe",
        };
        expect(_.extend(objA, objB).name).to.eql("joe");
      });

      it("should use the last source property in case of conflict", () => {
        const objA = {
          name: "moe",
        };
        const objB = {
          name: "joe",
        };
        const objC = {
          name: "yan",
        };
        expect(_.extend(objA, objB, objC).name).to.eql("yan");
      });
    });
  });

  describe("Functions", () => {
    beforeEach(() => {
      spyOnNativeMethods();
    });

    afterEach(() => {
      releaseSpies();
    });
    describe("once", () => {
      it("should not use native methods", () => {
        _.once(() => {});
        expect(spyReport()).to.be.false;
      });

      it("should execute the given function only once", () => {
        let num = 0;
        const increment = _.once(() => {
          num += 1;
        });
        increment();
        increment();
        increment();
        expect(num).to.eql(1);
      });

      it("should return the previously returned value if a function has been called before", () => {
        const getNumber = _.once((n) => ++n);
        const initialNumber = getNumber(0);
        const secondNumber = getNumber(99);
        expect(secondNumber).to.eql(initialNumber);
      });
    });

    describe("memoize", () => {
      it("should not use native methods", () => {
        _.memoize(() => {});
        expect(spyReport()).to.be.false;
      });

      let fib, memoizedFib;
      beforeEach(() => {
        fib = (n) => {
          if (n < 2) {
            return n;
          }
          return fib(n - 1) + fib(n - 2);
        };
        memoizedFib = _.memoize(fib);
      });

      it("should create memoized functions that produce the same result when called with the same arguments", () => {
        expect(memoizedFib(8)).to.eql(fib(8));
      });

      it("should give different results for different arguments", () => {
        expect(memoizedFib(11)).to.eql(89);
        expect(memoizedFib(8)).to.eql(21);
      });

      it("should not run the same function twice for a given argument", () => {
        const count = {};
        const foo = (n) => {
          count[n] = count[n] + 1 || 1;
          return n;
        };
        const memoizedFoo = _.memoize(foo);
        memoizedFoo(2);
        memoizedFoo(2);
        expect(count[2]).to.eql(1);
      });

      it("should be able to handle more than one argument", () => {
        let key;
        const count = {};
        const foo = function(a, b) {
          key = JSON.stringify([a, b]);
          count[key] = count[key] + 1 || 1;
          return a + b;
        };
        const memoizedFoo = _.memoize(foo);
        memoizedFoo(1, 2);
        memoizedFoo(1, 2);
        expect(count[key]).to.eql(1);
      });
    });

    describe("invoke", () => {
      it("should not use native methods", () => {
        _.invoke([1, 2, 3], () => {});
        expect(spyReport()).to.be.false;
      });

      let array, arrayOfStrings;

      beforeEach(() => {
        array = [[5, 1, 7], [3, 2, 1]];
        arrayOfStrings = ["yan", "kani"];
      });

      it("should be able to invoke methods on values and return in an array", () => {
        const sorted = _.invoke(array, "sort");
        expect(sorted).to.eql([[1, 5, 7], [1, 2, 3]]);
        expect(_.invoke(arrayOfStrings, "toUpperCase")).to.eql(["YAN", "KANI"]);
      });

      it("should be able to take a function", () => {
        const reverse = function() {
          return this.split("")
            .reverse()
            .join("");
        };

        const reversedStrings = _.invoke(["yan", "fan"], reverse);
        expect(reversedStrings).to.eql(["nay", "naf"]);
      });
    });
  });
});
