import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

// export type UserType = {
//     _id: string;
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string
// }

// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true},
//     password: { type: String, required: true },
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true }
// })
//
// const User = mongoose.model<UserType>('User', userSchema)

interface IUser {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface UserModelInterface extends mongoose.Model<IUser> {};

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
    if (this?.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next()
})

const User: UserModelInterface = mongoose.model<IUser, UserModelInterface>('User', userSchema);

export default User;