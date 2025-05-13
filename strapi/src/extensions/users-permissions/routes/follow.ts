export default {
    routes: [
        {
            method: 'POST' ,
            path: 'users/:id/follow',
            handler: 'follow.follow',
        },
        {
            method: 'DELETE' , 
            path: 'users/:id/follow' ,
            handler:'follow.unfollow' ,
        }
    ]
}