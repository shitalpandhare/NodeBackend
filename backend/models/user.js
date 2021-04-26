const db = require("../util/database");

module.exports = class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  save() {
    console.log("in save");
    return db.execute("INSERT INTO user(id,email,password) VALUES(?,?,?)", [
      this.id,
      this.email,
      this.password,
    ]);
  }

  static findByEmail(email) {
    return db.execute("SELECT * FROM user WHERE email=?", [email]);
  }
};
