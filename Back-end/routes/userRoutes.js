import express from "express";
import UserControllers from "../controllers/userControllers.js";
import protectAdmin from "../middlewares/adminProtectMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
const userRoute = express.Router();

//signup
userRoute.post("/signup", UserControllers.signupUser);

//login
userRoute.post("/login", UserControllers.loginUser);

//get all
userRoute.get("/",protectAdmin ,UserControllers.getAllUsers);

//get by id
userRoute.get("/:id", protectAdmin,UserControllers.getUserById);

//update
userRoute.patch("/:id", protect,UserControllers.updateUserById);

//delete
userRoute.delete("/:id",protect, UserControllers.deleteUser);

export default userRoute;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWMwYjg3NzE1NTI1YjgxMTQwOGZiM2MiLCJpYXQiOjE3MDcxMjg5NTEsImV4cCI6MTcwNzIxNTM1MX0.ppKnOd59m-yUFGCkwuQexO1uFsgSut5xL7IrnquXcF4
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWMwYjQyODUxMzI0YmY3OGMxN2Q1ODEiLCJpYXQiOjE3MDcxMjg5OTQsImV4cCI6MTcwNzIxNTM5NH0.ohHdEJ3AkPpkvdoA3w0b_GcZjRMZsfNUHpS7RAAjGnA