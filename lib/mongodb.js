import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI
const MONGO_DB = process.env.MONGO_DB
const MONGO_DB_USER_COLLECTION = process.env.MONGO_DB_USER_COLLECTION

let client = new MongoClient(MONGO_URI)
let clientPromise

if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect()
} else {
    clientPromise = global._mongoClientPromise
}

export default clientPromise

export const getDB = async () => {
    return await global._mongoClientPromise
        .then((client) => {
            return client.db(MONGO_DB)
        })
        .catch((error) => {
            throw new Error(`Failed to get DB connection: ${error}`)
        })
}

export const getCollection = async (collection) => {
    return await getDB()
        .then((db) => db.collection(collection))
        .catch((error) => {
            throw new Error(`Failed to get ${collection} collection: ${error}`)
        })
}

export const getUser = async (filter, options = {}) => {
    return await getCollection(MONGO_DB_USER_COLLECTION).then((collection) => collection.findOne(filter, options))
}

export const updateUser = async (filter, operation, options = {}) => {
    return await getCollection(MONGO_DB_USER_COLLECTION).then((collection) => collection.updateOne(filter, operation, options))
}

export const insertUser = async (data) => {
    return await getCollection(MONGO_DB_USER_COLLECTION).then((collection) => collection.insertOne(data))
}
