export class ResetToken {
  id: string
  token: string
  expiresAt: Date
  userId: string

  constructor(
    id: string,
    token: string,
    expiresAt: Date,
    userId: string,
  ) {
    this.id = id
    this.token = token
    this.expiresAt = expiresAt
    this.userId = userId
  }
}
