import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { validate } from "class-validator";
import { LoginData, SignupData } from "../utils/validations";

/**
 * validate inputs, err if invalid |
 * check if a user with that email already exists, err if does |
 * hash password, create user |
 * generate jwt |
 * return user and jwt |
 */
const signUp = async (req: Request, res: Response) => {
  try {
    const signupData: SignupData = new SignupData();
    signupData.email = req.body.email;
    signupData.password = req.body.password;

    const errors = await validate(signupData);
    if (errors.length > 0) {
      return res.status(400).json({
        error: true,
        message: "Invalid input",
        data: errors,
      });
    }

    const user = await AuthService.getUserByEmail(signupData.email);

    if (user) {
      return res.status(400).json({
        error: true,
        message: "An account is already registered with this email",
      });
    }

    const newUser = await AuthService.createUser(signupData);

    const jwtToken = AuthService.getToken(newUser.id);

    return res.status(201).json({
      error: false,
      message: "Signup successful",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

/**
 * validate inputs, err if invalid |
 * check if a user with that email exists, err if doesn't |
 * compare passwords, err if don't match |
 * generate jwt |
 * return user and jwt |
 */
const login = async (req: Request, res: Response) => {
  try {
    const loginData: LoginData = new LoginData();
    loginData.email = req.body.email;
    loginData.password = req.body.password;

    const errors = await validate(loginData);
    if (errors.length > 0) {
      return res.status(400).json({
        error: true,
        message: "Invalid input",
        data: errors,
      });
    }

    const user = await AuthService.getUserByEmail(loginData.email, true);

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Incorrect email",
      });
    }

    const isPasswordVerified = await AuthService.verifyPassword(
      loginData.password,
      user.password
    );

    if (!isPasswordVerified) {
      return res.status(400).json({
        error: true,
        message: "Incorrect password",
      });
    }

    const jwtToken = AuthService.getToken(user.id);

    return res.status(200).json({
      error: false,
      message: "Login in successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        token: jwtToken,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUserById(req.body.userId);
    if (user) {
      return res.status(200).json({
        error: false,
        message: "User found successfully",
        data: user,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "No user found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};

export default {
  signUp,
  login,
  getUser,
};
