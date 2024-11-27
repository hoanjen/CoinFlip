import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';

export interface IUser extends Document {
    email?: string;
    firstName: string;
    lastName: string;
    username?: string;
    profileImage?: string;
    walletAddress: string;
}

export interface IUserModel extends Model<IUser> {
    isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
    isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean>;
    isEmail(email: string): boolean;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        walletAddress: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: false,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email address is not valid');
                }
            },
        },
        username: {
            unique: true,
            type: String,
            trim: true,
            required: false,
        },
        profileImage: {
            type: String,
            default:
                'https://mmomarket.s3.amazonaws.com/image/1732672665387-16410402-448d-4e49-8e76-142148d12dbf-410999535315211d48fc6e901348ef7d.png',
            required: true,
        },
    },
    { timestamps: true },
);

userSchema.statics.isEmailTaken = async function (
    email: string,
    excludeUserId?: mongoose.Types.ObjectId,
): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isUsernameTaken = async function (
    username: string,
    excludeUserId?: mongoose.Types.ObjectId,
): Promise<boolean> {
    const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isEmail = function (email: string): boolean {
    return validator.isEmail(email);
};

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;
