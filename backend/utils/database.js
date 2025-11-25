// Mock Database
// In a real app, use MongoDB, PostgreSQL, etc.

const users = new Map(); // address -> user data
const contents = new Map(); // contentHash -> metadata
const accessRequests = []; // list of requests

module.exports = {
    users,
    contents,
    accessRequests
};
