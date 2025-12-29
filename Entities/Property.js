// Property entity placeholder
export class Property {
  constructor(data = {}) {
    this.id = data.id
    this.name = data.name
    this.location = data.location
    this.price = data.price
    this.image = data.image
  }
}
