require('dotenv').config()

const atlasUrl = process.env.ATLAS_URI
const username = process.env.ATLAS_USERNAME
const password = process.env.ATLAS_PASSWORD

const URL_PRIVATE = `mongodb+srv://${username}:${password}@${atlasUrl}`

module.exports = URL_PRIVATE