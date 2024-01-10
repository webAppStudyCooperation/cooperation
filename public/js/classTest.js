"use strict";
class Person {
    constructor(name, lover) {
        this.name = name;
        this.lover = lover;
        this.food = new Food();
        this.yell = this.loveYou();
    }
    loveYou() {
        console.log(`I love you! ${this.lover}`);
        return `I love you! ${this.lover}`;
    }
}
class Food {
    constructor() {
        this.lunch = "salad";
        this.dinner = "pork";
    }
}
let Person1 = new Person("A", "B");
console.log(Person1);
console.log(JSON.parse(JSON.stringify(Person1)));
// Person1.loveYou();
