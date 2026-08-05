enum Colors {
  red = 10,
  blue = 20,
  white = 30,
  _ = 50
}

class Item {
  public category: string
  public value: number

  constructor(category, value) {
    this.category = category;
    this.value = value;
  }
}

class Collections {
  itemCollection:Array<Item> = []

  constructor() {
    const colors = Object.keys(Colors).filter(key => isNaN(Number(key))).filter(key=>key !== '_')
    const numbers = Object.values(Colors).filter(val => Number(val))

    for (const color of colors) {
      for (const num of numbers) {
        const item = new Item(color, num);
        this.itemCollection.push(item)
      }
    }
  }

  removeItem(remove) {
    this.itemCollection = this.itemCollection.filter(item => !(item.category === remove.category && item.value === remove.value))
  }

}

const result = new Collections()
const oneItem = result.itemCollection[0]
result.removeItem(oneItem)
console.log('%c...result', 'color:gold',oneItem,   result.itemCollection);
