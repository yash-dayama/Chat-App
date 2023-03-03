const users = []
// addUser, removeUser, getUser, getUserInRoom

const addUser = ({id, username, room}) =>{
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
 
    // validate data
    if(!username || !room){
        return{
            error: 'Username and name are required!'

        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if(existingUser){
        return{
            error: 'Username is in use!'
        }
    }

    // store user
    const user = {id, username, room }
    users.push(user)
    return{user}
}


// remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.if === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room )
}

// // add user 
// addUser({
//     id: 03,
//     username: 'Yash',
//     room: 'India'
// })
// addUser({
//     id: 13,
//     username: 'Prashant',
//     room: 'Ahmedabad'
// })
// addUser({
//     id: 23,
//     username: 'Preeti',
//     room: 'India'
// })

// const user = getUser(23)
// console.log(user);

// const userList = getUsersInRoom('India')
// console.log(userList);

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser
}