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
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// api/users/register
router.post('/register', [
    (0, express_validator_1.check)('firstName', 'FirstName is required').isString(),
    (0, express_validator_1.check)('lastName', 'LastName is required').isString(),
    (0, express_validator_1.check)('email', "Email is required").isEmail(),
    (0, express_validator_1.check)('password', 'Password with 6 or more characters required').isLength({ min: 6 })
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = yield user_1.default.findOne({
            email: req.body.email,
        });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        user = new user_1.default(req.body);
        yield user.save();
        // const newUser = new User({
        //     email: req.body.email,
        //     password: req.body.password,
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName
        // });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000
        });
        // return res.status(200).json({ message: 'User has been registered' });
        console.log('user.id: ', user.id);
        console.log('user._id: ', user._id);
        return res.status(200).json({ userId: user.id, accessToken: token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;