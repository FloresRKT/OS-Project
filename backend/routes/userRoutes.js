const express = require("express");
const router = express.Router();

const {
    getUsers,
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/users");

// User management routes
router
  .route("/users")
  .get(getUsers) // GET /users
  .post(createUser); // POST /users
router.post("/users/login", loginUser); // POST /users/login
router
  .route("/users/:id")
  .get(getUserById) // GET /users/123
  .put(updateUser) // PUT /users/123
  .delete(deleteUser); // DELETE /users/123

module.exports = router;