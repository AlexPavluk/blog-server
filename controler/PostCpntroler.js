import PostModel from "../models/Post.js";

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't create a post",
        })
    };
}



export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't get the tags",
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').sort({createdAt:-1}).exec();

        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't get the posts",
        })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').filter(items => items.user._id ).exec();

        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't get the posts",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(req)



        PostModel.findByIdAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: "Couldn't get the post",
                    })
                }

                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Post not found',
                    })
                }

                res.json(doc);
            }

        ).populate('user')

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't create a post",
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },

            (err, doc) => {
                if (err) { 
                    console.log(err)
                    return res.status(500).json({
                        message: "Couldn't delete the post",
                    })
                }

                if (!doc) {
                    console.log(err)
                    return res.status(404).json({
                        message: 'Post not found',
                    })
                }

                res.json({
                    success: true,
                })
            },
        )
    } catch (err) {
        console.log(err)
         res.status(500).json({
            message: "Couldn't get the post",
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log(postId, "postId")

        await PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                user: req.userId,  
            },
        )
        res.json({
            success:true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Couldn't update the post",
        })
    }
}