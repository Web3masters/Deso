const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require('uuid')
require('dotenv').config()
const log4js = require('log4js');
const ethers = require('ethers');
const postContractAbi = require('../../contracts/build/contracts/PostFactory.json');

const loggerPost = log4js.getLogger('post');

const prisma = new PrismaClient()

class Post {
    async Create(description, id, ipfsLink, createNft) {

        if (!createNft) console.log("createNft is false, user doesnt wnat nft... skipping")

        else {
            if (!ipfsLink) {
                ipfsLink = ""
            }
            try {
                const user = await prisma.user.findUnique({where: {id: id}})
                const userWallet = user.address
                let provider = await new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
                let wallet =  new ethers.Wallet(process.env.PRIVATE_KEY, provider);
                const contract = new ethers.Contract(process.env.POST_FACTORY_CONTRACT_ADDRESS, postContractAbi.abi, wallet);
                await contract.createPost(description, ipfsLink, userWallet);
            } catch (e) {
                console.log(e)
                throw new Error('Error making post nft2')
            }

        }

        //Create post on database
        try {
            const post = await prisma.post.create({
                data: {
                    id: uuid(),
                    description: description,
                    authorId: id,
                    address: "0x000000000000000000",
                    isNFT: createNft,
                }
            })
            loggerPost.info(`Post ${post.id} created successfully`)
            return post
        } catch (error) {
            loggerPost.error(`Problems on server: ${error}`)
            throw new Error('Error creating post')
        }
    }

    async GetPosts(userId) {

        let qntLikes = 0
        let qntDislikes = 0
        
        try { 
            let posts = await prisma.post.findMany({
                include: {
                    author: true,
                    comments: true,
                    likes: true,
                },
            })

            posts.forEach(post => {
                if(post.likes.length > 0) {
                    post.likes.forEach(like => {
                        if(like.type === 'like') {
                            qntLikes++
                        } else if (like.type === 'dislike') {
                            qntDislikes++
                        }

                        if(like.authorId === userId) {
                            if(like.type === 'like') {
                                post.likedByUser = true
                                post.dislikedByUser = false
                            } else if (like.type === 'dislike') {
                                post.dislikedByUser = true
                                post.likedByUser = false
                            }
                        } else {
                            post.likedByUser = false
                            post.dislikedByUser = false
                        }
                    })
                } else {
                    post.likedByUser = false
                    post.dislikedByUser = false
                }

                post.qntDislikes = qntDislikes
                post.qntLikes = qntLikes

                qntLikes = 0
                qntDislikes = 0
            })

            return posts
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`)
            throw new Error('Error getting posts')
        }
    }

    async GetPostById(id, userId) {
        let post;

        const postExists = await prisma.post.findUnique({
            where: {
                id: id
            }
        })

        if (!postExists) {
            loggerPost.error(`Post ${id} not found`)
            throw new Error('Post not found')
        }

        try {
            post = await prisma.post.findUnique({
                where: {
                    id: id
                },
                include: {
                    author: true,
                    comments: {
                        include: {
                            author: true,
                        }
                    },
                    likes: true,
                },
            })

            let qntLikes = 0
            let qntDislikes = 0
            let likedByUser = false
            let dislikedByUser = false

            if(post.likes.length > 0) {
                post.likes.forEach(like => {
                    if(like.type === 'like') {
                        qntLikes++
                    } else if (like.type === 'dislike') {
                        qntDislikes++
                    }

                    if(like.authorId === userId) {
                        if(like.type === 'like') {
                            likedByUser = true
                            dislikedByUser = false
                        } else if (like.type === 'dislike') {
                            dislikedByUser = true
                            likedByUser = false
                        }
                    }
                })
            }

            post.qntDislikes = qntDislikes
            post.qntLikes = qntLikes
            post.likedByUser = likedByUser
            post.dislikedByUser = dislikedByUser
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`)
            throw new Error('Error getting post')
        }

        if (!post) {
            throw new Error('Post not found')
        }

        return post
    }

    async GetPostsByAuthorId(id) {

        //Verify if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })

        if (!user) {
            throw new Error('User not found')
        }

        try {
            const posts = await prisma.post.findMany({
                where: {
                    authorId: id
                },
                include: {
                    author: true,
                },
            })
    
            return posts
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`)
            throw new Error('Error getting posts')
        }
        
    }

    async deletePost(id) {
        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        })

        if (!post) {
            throw new Error('Post not found')
        }

        try {
            await prisma.post.update({
                where: {
                    id: id
                },
                data: {
                    unlisted: true
                }
            })
    
            return "Your post is from now hidden from the feed, but it still exists on the blockchain (we advised)."
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`)
            throw new Error('Error deleting post')
        }
       
    }

    async addComment(idPost, idUser, text) {
        const post = await prisma.post.findUnique({
            where: {
                id: idPost
            }
        })

        if (!post) {
            throw new Error('Post not found')
        }

        try {
            const newComment = await prisma.comment.create({
                data: {
                    id: uuid(),
                    text: text,
                    authorId: idUser,
                    postId: idPost,
                }
            })
    
            return newComment
        } catch (err) {
            loggerPost.error(`Error adding comment - Problems on server: ${err}`)
            throw new Error('Error adding comment')
        }
    }

    async deleteComment(idComment) {
        const comment = await prisma.comment.findUnique({
            where: {
                id: idComment
            }
        })

        if (!comment) {
            throw new Error('Comment not found')
        }

        try {
            await prisma.comment.delete({
                where: {
                    id: idComment
                }
            })
    
            return "Comment deleted successfully"
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`)
            throw new Error('Error deleting comment')
        }
    }

    async deleteCommenteEspecific(idPost, idUser) {
        const comment = await prisma.comment.findUnique({
            where: {
                id: idPost,
                authorId: idUser
            }
        })

        if (!comment) {
            throw new Error('Comment not found')
        }

        try {
            await prisma.comment.delete({
                where: {
                    id: idPost,
                    authorId: idUser
                }
            })
    
            return "Comment deleted successfully"
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`)
            throw new Error('Error deleting comment')
        }
    }

    async likePost(idPost, idUser) {
        const alreadyLiked = await prisma.likes.findMany({
            where: {
                postId: idPost,
                authorId: idUser
            }
        })

        if (alreadyLiked[0]) {
            if (alreadyLiked[0].type === "like") {
                try {
                    await prisma.likes.delete({
                        where: {
                            id: alreadyLiked[0].id,
                        }
                    })
                    return "Like removed successfully" 
                } catch (err) {
                    loggerPost.error(`Problems on server: ${err}`)
                    throw new Error('Error removing like')
                }
            } else if (alreadyLiked[0].type === "dislike") {
                try {
                    await prisma.likes.update({
                        where: {
                            id: alreadyLiked[0].id,
                        },
                        data: {
                            type: "like"
                        }
                    })
                    return "Like added successfully"
                } catch (err) {
                    loggerPost.error(`Problems on server: ${err}`)
                    throw new Error('Error adding like')
                }
            }
        } else {
            try {
                await prisma.likes.create({
                    data: {
                        id: uuid(),
                        type: "like",
                        authorId: idUser,
                        postId: idPost,
                    }
                })
        
                return "Like added successfully"
            } catch (err) {
                loggerPost.error(`Problems on server: ${err}`)
                throw new Error('Error adding like')
            }
        }
    }

    async unlikePost(idPost, idUser) {
        const alreadyLiked = await prisma.likes.findMany({
            where: {
                postId: idPost,
                authorId: idUser
            }
        })

        if (alreadyLiked[0]) {
            if (alreadyLiked[0].type === "dislike") {
                try {
                    await prisma.likes.delete({
                        where: {
                            id: alreadyLiked[0].id,
                        }
                    })
                    return "Like removed successfully" 
                } catch (err) {
                    loggerPost.error(`Problems on server: ${err}`)
                    throw new Error('Error removing dislike')
                }
            } else if (alreadyLiked[0].type === "like") {
                try {
                    await prisma.likes.update({
                        where: {
                            id: alreadyLiked[0].id
                        },
                        data: {
                            type: "dislike"
                        }
                    })
                    return "Like added successfully"
                } catch (err) {
                    loggerPost.error(`Problems on server: ${err}`)
                    throw new Error('Error adding dislike')
                }
            }
        } else {
            try {
                await prisma.likes.create({
                    data: {
                        id: uuid(),
                        type: "dislike",
                        authorId: idUser,
                        postId: idPost,
                    }
                })
        
                return "Like added successfully"
            } catch (err) {
                loggerPost.error(`Problems on server: ${err}`)
                throw new Error('Error adding dislike')
            }
        }
    }
}

module.exports = {
    Post,
}