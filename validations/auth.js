import { body } from 'express-validator'

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min:4}),
    body('fullName').isLength({min:3}),
    body('avatarUrl').optional().isString(),
];

export const editUser = [
    body('email').optional().isEmail(),
    body('fullName').optional().isLength({min:3}),
    body('avatarUrl').optional().isString(),
]

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min:5}),
];

export const postCreateValidations = [
    body('title', 'Enter the title of the post').isLength({min:3}).isString(),
    body('text', 'Enter the text of the post').isLength({min:3}).isString(),
    body('tags', 'Incorrect tag format (specify array)').optional().isString(),
    body('imageUrl', 'Incorrect image link').optional().isString(),
];

export const commentsCreateValidations = [
    body('comment', 'Enter the text of the comment').isLength({min:3}).isString(),
];
