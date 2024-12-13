const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]
    }

    type AuthorizationData {
        token: String!
        userId: String!
    }
    
    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    type UserStatus {
        status: String!
    }

    input UserInputData {
        email: String
        name: String
        password: String
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }
    
    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInputData: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): String!
        updateStatus(updatedStatus: String!): String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthorizationData
        posts(page: Int, limit: Int): PostData!
        post(id: ID!): Post!
        status: UserStatus!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
