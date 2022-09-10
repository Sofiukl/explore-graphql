import { User } from "../generated/schema";
import { UserPayloay } from "../models/user.interface";
import jwt from "jsonwebtoken";
import { IAnyObject } from "../models/common.interface";

function generateToken(user: UserPayloay) {
  console.log(`generating token ${JSON.stringify(user)}`);
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    "my_secret_key",
    { expiresIn: "3h" }
  );
}

export function login(_: unknown, { username, password }: IAnyObject): User {
  const user = {
    id: "u1",
    email: "smallick@email.com",
    username: "sofikul",
    createdAt: new Date().toDateString(),
    role: "ADMIN",
  };
  const token = generateToken(user);
  console.log(`token :::: getting token ${token}`);

  return {
    ...user,
    token,
  };
}
