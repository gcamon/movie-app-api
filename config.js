const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const movieRoute = require('./routes/movies')
const listRoute = require('./routes/lists')

module.exports = (app,express) => {
    app.use(express.json())
    app.use('/api/auth',authRoute)
    app.use('/api/users',userRoute)
    app.use('/api/movies',movieRoute)
    app.use('/api/lists',listRoute)
}