const Pool = require('pg').Pool;
const bayern = require('./webScraping')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

console.log(process.env,'<-----process.ENV')

pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            'Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release()
        if (err) {
            return console.error(
                'Error executing query', err.stack)
        }
        console.log("Connected to Database !")
    })
})


const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC',(error, results) => {
        if(error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getUserById = (request,response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error,results) => {
        if (error){
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request,response)=>{
    const { name , email } = request.body
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',[name,email],(error,results)=>{
       if (error){
           throw error
       } 
       response.status(201).send(`USER added with ID: ${results.rows[0].id}`)
    })

}

const updateUser = (request,response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name,email,id],
        (error,results) => {
            if(error){
                throw error
            }
            response.status(200).send(`USER modified with ID: ${id}`)
        }
    )
}

const deleteUser = (request,response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM users WHERE id = $1', [id], (error,results)=>{
        if(error){
            throw error
        }else{
            response.status(200).send(`User deleted with ID: $id`)
        }
    })
}

const getBayernScore = async (request,response)=> {
    const getScore = await bayern.getBayernScores()
    response.status(200).send(getScore)
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getBayernScore
}