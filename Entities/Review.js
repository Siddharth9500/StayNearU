// Review entity placeholder
export class Review {
  constructor(data = {}) {
    this.id = data.id
    this.userId = data.userId
    this.propertyId = data.propertyId
    this.rating = data.rating
    this.comment = data.comment
  }
}
