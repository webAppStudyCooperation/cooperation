export class BoardComment {
    constructor(boardId, commentId, content, user) {
        this.boardId = boardId;
        this.commentId = commentId;
        this.content = content;
        this.user = user;
    }
}
