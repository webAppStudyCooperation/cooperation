export class User {
    id: string
    name: string
    nickName: string

    constructor(
        id: string,
        name: string,
        nickname: string
    ) {
        this.id = id
        this.name = name
        this.nickName = nickname
    }
}