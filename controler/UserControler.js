import * as dotenv from 'dotenv'
dotenv.config()
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarImg,
            passwordHash: hash,
        });

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id,
            },

            process.env.DB_TOKEN_PASSWORD,

            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Couldn't register",
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })


        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        console.log(isValidPass, 'isValidPass')

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Invalid login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            process.env.DB_TOKEN_PASSWORD
            ,
            {
                expiresIn: '30d',
            }
        );

        const { passwordHash, ...userData } = user._doc

        res.json({
            ...userData,
            token,
        });

    } catch (err) {
        res.status(500)({
            message: "Couldn't log in",
        })
    }
}

export const getUser = async  (req, res) => {
        try {
        const user = await UserModel.findById(req.userId).populate('post');

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
            const { passwordHash, ...userData } = user._doc

            res.json(userData);
  }catch (err) {

  }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(req)



        UserModel.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "User not found",
                    })
                }

                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'User not found',
                    })
                }

                res.json(doc);
            }

        )

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't create user",
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const { passwordHash, ...userData } = user._doc

        res.json(userData);

    } catch (err) {
        console.log(err)
        res.status(500)({
            message: 'No access',
        })
    }
};

export const update = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
            await UserModel.updateOne(
                {
                    _id: req.userId
                },
                {
                    email: req.body.email,
                    fullName: req.body.fullName,
                    avatarUrl: req.body.avatarImg,

                }

            )

            const {...userData} = user._doc

        res.json(userData);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Could not change the user',
        })
    }
}