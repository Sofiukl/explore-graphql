"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(user) {
    console.log(`generating token ${JSON.stringify(user)}`);
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
    }, "my_secret_key", { expiresIn: "3h" });
}
function login(_, { username, password }) {
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
exports.login = login;
