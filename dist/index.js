"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const courseRouter_1 = __importDefault(require("./routes/courseRouter"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use("/user", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.use("/course", courseRouter_1.default);
(0, db_1.default)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server Listening on : http://localhost:${PORT}`);
    });
})
    .catch((err) => console.error("Error : ", err));
