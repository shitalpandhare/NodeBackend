const db = require("../util/database");

module.exports = class Post {
  constructor(id, title, content, userId) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.userId = userId;
  }

  save() {
    return db.execute("INSERT INTO posts(title,content,userId) VALUES(?,?,?)", [
      this.title,
      this.content,
      this.userId,
    ]);
  }

  static fetchAll() {
    return db.execute("SELECT * FROM posts");
  }

  static findById(id) {
    return db.execute("SELECT * FROM posts where id=?", [id]);
  }

  static deletePost(id, userId) {
    return db.execute("DELETE FROM posts where id=? AND userId=?", [
      id,
      userId,
    ]);
  }

  updatePost() {
    return db.execute(
      "UPDATE  posts SET title=?,content=? where id=? AND userId=?",
      [this.title, this.content, this.id, this.userId]
    );
  }
};
