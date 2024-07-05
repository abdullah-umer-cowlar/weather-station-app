import { User } from "../models";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/generateJwtToken";
import { SignupData } from "../utils/validations";

const createUser = async (signupData: SignupData) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(signupData.password, salt);

  return await User.create({
    email: signupData.email,
    password: encryptedPassword,
  });
};

const getUserById = async (userId: string) => {
  return await User.findByPk(userId);
};

const getUserByEmail = async (email: string, withPassword = false) => {
  if (withPassword) {
    return await User.scope("withPassword").findOne({
      where: { email: email },
    });
  }
  return await User.findOne({
    where: { email: email },
  });
};

const verifyPassword = async (passwordInput: string, userPassword: string) => {
  return await bcrypt.compare(passwordInput, userPassword);
};

const getToken = (userId: string) => {
  return generateJwtToken(userId);
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  verifyPassword,
  getToken,
};
