import { User } from "./user";

export class BoardComment {
  commentId: number;
  content: string;
  user: User;

  constructor(commentId: number, content: string, user: User) {
    this.commentId = commentId;
    this.content = content;
    this.user = user;
  }
}
