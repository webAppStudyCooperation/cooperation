import { User } from "./user"

export class BoardComment {
    boardId: number
    commentId: number
    content: string
    user: User

    constructor(
        boardId: number,
        commentId: number,
        contnet: string,
        user: User 
    ) {
        this.boardId = boardId
        this.commentId = commentId
        this.content = contnet
        this.user = user
    }
}