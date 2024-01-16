export class User {
    id: string
    name: string
    nickName: string
    familyId: number

    constructor(
        id: string,
        name: string,
        nickname: string,
        familyId: number
    ) {
        this.id = id
        this.name = name
        this.nickName = nickname
        this.familyId = familyId
    }
}