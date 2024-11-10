const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
require("dotenv").config();
const log4js = require("log4js");
const ethers = require("ethers");
const postContractAbi = require("../../contracts/build/contracts/PostFactory.json");

const loggerPost = log4js.getLogger("post");

const prisma = new PrismaClient();

class DAO {
    async Create(
        address,
        authorId,
        title,
        description,
        prLink,
        options,
        open,
        totalVotes,
        executed
    ) {
        //Verify if user already exists
        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                id: authorId,
            },
        });

        if (!userAlreadyExists) {
            loggerPost.warn(
                `User ${userAlreadyExists.id} already exists, and tried to create another one`
            );
            throw new Error("User already exists");
        }

        let post;

        try {
            post = await prisma.proposal.create({
                data: {
                    id: uuid(),
                    address: address,
                    authorId: authorId,
                    title: title,
                    description: description,
                    prLink: prLink,
                    options: {
                        create: options,
                    },
                    open: open,
                    totalVotes: totalVotes,
                    executed: executed,
                },
            });
            loggerPost.info(`Post ${post.id} created successfully`);
        } catch (error) {
            loggerPost.error(`Problems on server: ${error}`);
            throw new Error("Error creating post");
        }

        // try {
        //     const options = await prisma.options.create({
        //         data: {
        //             id: uuid(),
        //             postId: post.id,
        //             title: titleOptions,
        //             votes: votesOption
        //         }
        //     })

        //     loggerPost.info(`Options ${options.id} created successfully`)
        // } catch (error) {
        //     loggerPost.error(`Problems on server: ${error}`)
        //     throw new Error('Error creating options')
        // }

        return post;
    }

    async getAll() {
        try {
            const proposals = await prisma.proposal.findMany({
                include: {
                    options: true,
                    author: true,
                },
            });

            return proposals;
        } catch (err) {
            loggerPost.error(`Problems on server: ${err}`);
            throw new Error("Error getting all proposals");
        }
    }

    async getById(id) {
        const proposal = await prisma.proposal.findUnique({
            where: {
                id: id,
            },
            include: {
                author: true,
                options: true,
            },
        });

        return proposal;
    }

    async getByAddress(address) {
        const proposal = await prisma.proposal.findUnique({
            where: {
                address: address,
            },
        });

        return proposal;
    }

    async deleteById(id) {
        const proposal = await prisma.proposal.delete({
            where: {
                id: id,
            },
        });

        return proposal;
    }

    async closeProposal(id) {
        try {
            const proposal = await prisma.proposal.update({
                where: {
                    id: id,
                },
                data: {
                    open: false,
                },
            });

            return proposal;
        } catch (error) {
            loggerPost.error(`Problems on server: ${error}`);
            throw new Error("Error closing proposal");
        }
    }
}

module.exports = {
    DAO,
};
