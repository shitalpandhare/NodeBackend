const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const db = require("../util/database");

exports.userSignup = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    id = new Date().toISOString();
    firstname = req.body.firstname;
    lastname = req.body.lastname;
    email = req.body.email;
    address = req.body.address;
    role = req.body.role;
    gender = req.body.gender;

    const user = new User(
      id,
      firstname,
      lastname,
      email,
      address,
      role,
      gender,
      hash
    );

    const result = await user.save();

    res.status(201).json({
      info: {
        status: "success",
        code: 201,
      },
      data: {
        responseMsg: "User created Successfully",
        // email: user.email,
        // userId: user.id,
        // role: user.role,
        // accessToken: null,
        // expiresIn: null,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.userLogin = async (req, res, next) => {
  let fetchedUser;
  let result;

  try {
    const user = await User.findByEmail(req.body.email);
    if (!user[0].length) {
      return res.status(401).json({ message: "Auth fail !" });
    } else {
      fetchedUser = user[0][0];

      result = await bcrypt.compare(req.body.password, fetchedUser.password);
    }

    if (!result) {
      return res.status(401).json({ message: "Auth fail" });
    } else {
      //

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser.id },
        process.env.SECRET_KEY,
        { expiresIn: 3600 }
      );

      res.status(200).json({
        info: {
          status: "success",
          code: 200,
        },
        data: {
          responseMsg: "User login Successfully",
          email: fetchedUser.email,
          userId: fetchedUser.id,
          role: fetchedUser.role,
          accessToken: token,
          expiresIn: 3600,
        },
        error: null,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Auth fail" });
  }
};

//fetch user accoridng to role
exports.getAllUsers = async (req, res, next) => {
  const role = req.params.role;
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let limit = 0;
  let offset = 0;
  let users;
  let count = 0;

  // const users = await User.findAllByRole(role);
  try {
    const de = await db.execute("SELECT * FROM user where role='admin'");
    if (de) {
      count = de[0].length;
    }
    if (pageSize && currentPage) {
      limit = pageSize;
      offset = pageSize * (currentPage - 1);
      users = await User.findAllByRole(role, limit, offset);
    }

    if (users[0].length == 0) {
      res.status(404).json({
        message: "user is not found with role :" + role,
      });
    } else {
      res.status(200).json({
        message: "user fetched successfully",
        users: users[0],
        maxAdmins: count,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getAdminById = async (req, res, next) => {
  const id = req.params.id;
  const users = await User.findAdminById(id);
  try {
    if (users[0].length == 0) {
      res.status(404).json({
        message: "user is not found with id :" + id,
      });
    } else {
      res.status(200).json({
        message: "admin fetched successfully",
        admin: users[0][0],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.updateAdmin = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    id = req.params.id;
    firstname = req.body.firstname;
    lastname = req.body.lastname;
    email = req.body.email;
    address = req.body.address;
    role = req.body.role;
    gender = req.body.gender;

    const user = new User(
      id,
      firstname,
      lastname,
      email,
      address,
      role,
      gender,
      hash
    );

    const result = await user.updateAdmin();
    if (result[0].affectedRows == 1) {
      res.status(201).json({
        info: {
          status: "success",
          code: 201,
        },
        data: {
          responseMsg: "Admin updated Successfully",
        },
        error: null,
      });
    } else {
      res.status(400).json({
        info: {
          status: "failed",
          code: 201,
        },
        data: {
          responseMsg: "Admin is not  updated ",
        },
        error: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.searchAdmins = async (req, res, next) => {
  const searchText = req.params.searchText;
  const pageIndex = +req.query.page;
  let pageSize = +req.query.pageSize;
  let users;
  let count = 0;
  try {
    const de = await db.execute(
      " SELECT COUNT(*) as count FROM user WHERE role='admin' AND (firstname LIKE '%" +
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

    if (de) {
      count = de[0][count].count;
    }
    if (pageSize && pageIndex) {
      limit = pageSize;
      offset = pageSize * (pageIndex - 1);
      users = await User.searchAdmins(searchText, limit, offset);
    }
    if (users[0].length == 0) {
      res.status(204).json({
        message: "user is not found with searchText :" + searchText,
      });
    } else {
      res.status(200).json({
        message: "user fetched successfully",
        users: users[0],
        maxSearchedAdmin: count,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.sortAdmins = async (req, res, next) => {
  const active = req.body.active;
  const direction = req.body.direction;
  const pageIndex = req.body.pageIndex;
  let pageSize = req.body.pageSize;
  let users;
  let count = 0;

  const de = await db.execute("SELECT * FROM user where role='admin'");
  if (de) {
    count = de[0].length;
  }
  try {
    if (pageSize && pageIndex) {
      limit = pageSize;
      offset = pageSize * (pageIndex - 1);
      users = await User.sortAdmins(active, direction, limit, offset);
    }
    if (users[0].length == 0) {
      res.status(204).json({
        message: "data  is not found ",
      });
    } else {
      res.status(200).json({
        message: "user fetched successfully",
        users: users[0],
        maxAdmins: count,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.searchSortAdmins = async (req, res, next) => {
  const searchText = req.params.searchText;
  const active = req.query.active;
  const direction = req.query.direction;
  const pageIndex = +req.query.page;
  let pageSize = +req.query.pageSize;
  let users;
  let count = 0;
  try {
    const de = await db.execute(
      " SELECT COUNT(*) as count FROM user WHERE role='admin' AND (firstname LIKE '%" +
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

    if (de) {
      count = de[0][count].count;
    }
    if (pageSize && pageIndex) {
      limit = pageSize;
      offset = pageSize * (pageIndex - 1);
      users = await User.searchSortAdmins(
        searchText,
        active,
        direction,
        limit,
        offset
      );
    }
    if (users[0].length == 0) {
      res.status(204).json({
        message: "user is not found with searchText :" + searchText,
      });
    } else {
      res.status(200).json({
        message: "user fetched successfully",
        users: users[0],
        maxSearchedAdmin: count,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
