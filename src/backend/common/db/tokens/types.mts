export const enum tokenType {
    RefreshToken = "refreshToken",
    AccessToken = "accessToken",
    UserId = "userId"
}

export interface Token {
    TokenType: tokenType,
    value: string,
    expiresIn: number,
    createdAt: number
}