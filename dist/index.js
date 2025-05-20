"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const UserSchema_1 = require("./schema/UserSchema");
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express_1.default.json());
const signupSchema = zod_1.z
    .object({
    username: zod_1.z.string().min(5).max(20),
    email: zod_1.z.string().min(5).max(30).email(),
    password: zod_1.z.string().min(6).max(20),
})
    .strict();
const signInSchema = zod_1.z
    .object({
    email: zod_1.z.string().min(5).max(30).email(),
    password: zod_1.z.string().min(6).max(20),
})
    .strict();
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userdata = req.body;
    try {
        const { success, error } = signupSchema.safeParse(userdata);
        if (success) {
            const hashedPassword = yield bcrypt_1.default.hash(userdata.password, 5);
            //save to db
            yield UserSchema_1.User.create({
                username: userdata.username,
                password: hashedPassword,
                email: userdata.email,
            });
            //generate jwt and send
            const token = jsonwebtoken_1.default.sign({ username: userdata.username }, JWT_SECRET);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000),
            });
            res.json({ message: "Signed Up Succesfully" });
        }
        else {
            res.status(400).json({ message: error.issues[0].message });
        }
    }
    catch (error) {
        res.status(400).json({ message: "something went wrong!", error });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    try {
        const { success, error } = signInSchema.safeParse(userData);
        if (success) {
            //find user in db
            const user = yield UserSchema_1.User.findOne({
                email: userData.email,
            });
            if (!user) {
                throw new Error("User not found!");
            }
            const isPasswordCorrect = yield bcrypt_1.default.compare(userData.password, user.password);
            if (!isPasswordCorrect) {
                throw new Error("Password is wrong!");
            }
            //generate jwt and send
            const token = jsonwebtoken_1.default.sign({ username: userData.username }, JWT_SECRET);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 900000),
            });
            res.json({ message: "Signed In Succesfully" });
        }
        else {
            res.status(400).json({ message: error.issues[0].message });
        }
    }
    catch (error) {
        res.status(400).json({ message: "something went wrong!", error });
    }
}));
(0, db_1.default)()
    .then((res) => {
    app.listen(PORT, () => {
        console.log(`Server Listening on PORT : http://localhost:${PORT}`);
    });
})
    .catch((err) => console.error("Error : ", err));
