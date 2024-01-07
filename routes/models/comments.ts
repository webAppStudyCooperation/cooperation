import { User } from "./user"

export class BoardComment {
    commentId: number
    contnet: string
    user: User

    constructor(
        commentId: number,
        contnet: string,
        user: User 
    ) {
        this.commentId = commentId
        this.contnet = contnet
        this.user = user
    }
}