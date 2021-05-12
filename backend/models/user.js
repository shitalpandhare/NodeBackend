const db = require("../util/database");

module.exports = class User {
  constructor(id, firstname, lastname, email, address, role, gender, password) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.address = address;
    this.role = role;
    this.gender = gender;
    this.password = password;
  }

  save() {
    return db.execute(
      "INSERT INTO user(id, firstname, lastname, email, address, role, gender, password) VALUES(?,?,?,?,?,?,?,?)",
      [
        this.id,
        this.firstname,
        this.lastname,
        this.email,
        this.address,
        this.role,
        this.gender,
        this.password,
      ]
    );
  }

  static findByEmail(email) {
    return db.execute("SELECT * FROM user WHERE email=?", [email]);
  }

  static saveRefreshToken(refreshToken, userId) {
    return db.execute("UPDATE user SET refreshToken=? where id=?", [
      refreshToken,
      userId,
    ]);
  }

  static findAllByRole(role, limit, offset) {
    return db.execute(
      "SELECT * FROM user WHERE role=? limit " + limit + " OFFSET " + offset,
      [role]
    );
  }

  static findAdminById(id) {
    return db.execute("SELECT * FROM user WHERE id=?", [id]);
  }

  updateAdmin() {
    return db.execute(
      "UPDATE  user SET  firstname=?, lastname=?, email=?, address=?, role=?, gender=?, password=? WHERE id=?",
      [
        this.firstname,
        this.lastname,
        this.email,
        this.address,
        this.role,
        this.gender,
        this.password,
        this.id,
      ]
    );
  }

  static searchAdmins(searchText) {
    return db.execute(
      "SELECT * FROM user WHERE role='admin' AND (firstname LIKE '%" +
        searchText +
        "%' OR  lastname LIKE '%" +
        searchText +
        "%' OR email LIKE '%" +
        searchText +
        "%' OR gender LIKE '%" +
        searchText +
        "%' OR address LIKE '%" +
        searchText +
        "%')"
    );
  }

  static sortAdmins(active, direction) {
    return db.execute(
      "SELECT * FROM user WHERE  role='admin' ORDER BY " +
        active +
        " " +
        direction
    );
  }
};
