class Person {
  name: string;
  lover: string;
  food: Food;
  yell: string;
  constructor(name: string, lover: string) {
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
  lunch: string;
  dinner: string;

  constructor() {
    this.lunch = "salad";
    this.dinner = "pork";
  }
}

let Person1 = new Person("A", "B");

console.log(Person1);

console.log(JSON.parse(JSON.stringify(Person1)));

// Person1.loveYou();
