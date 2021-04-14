const mysql = require('mysql')

// Get the connection url

const dbString = process.env.CLEARDB_DATABASE_URL

if(dbString == null || !dbString.includes('mysql://')){
    console.log("There is something wrong with the database config. Please check that ClearDB database add-on has been installed correctly and that the config var CLEARDB_DATABASE_URL is present within the config vars.")
    process.exit(1)
}

// Assuming the dbString is now correct, extract the credentials

function extractCredentials(firstDelimiter, secondDelimiter){
    const firstArray = dbString.split(firstDelimiter)
    const secondArray = firstArray[1].split(secondDelimiter)
    return secondArray[0]
}

const USERNAME = extractCredentials("://", ":")
const PASSWORD = extractCredentials(":", "@")
const HOST = extractCredentials("@", "/")
const DATABASE = extractCredentials("/", "?")

// Now create the connection to the database

const conn = mysql.createConnection({
    host: HOST,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE
})

// Create tables if they don't exist

conn.connect((err) => {

    if(err) throw err;

    console.log("Successfully connected to database..")

    const videoTableQuery = "CREATE TABLE IF NOT EXISTS video (" + 
        "id int NOT NULL AUTO_INCREMENT " +
        "title VARCHAR(100) NOT NULL " +
        "seasonNo int " +
        "episodeNo int " +
        "isTVShow bit" + 
        "PRIMARY KEY (id)" +
        ")"
    conn.query(videoTableQuery, (err, result) => {
        if(err) throw err
        console.log("Video table created")
    })

    const audioTableQuery = "CREATE TABLE IF NOT EXISTS audio (" + 
        "id int NOT NULL AUTO_INCREMENT " +
        "videoId int NOT NULL" +
        "url VARCHAR(255) " +
        "PRIMARY KEY (id)" +
        "FOREIGN KEY (videoId) REFERENCES video (id)" +
        ")"
    conn.query(audioTableQuery, (err, result) => {
        if(err) throw err
        console.log("Audio table created")
    })

    const subtitleTableQuery = "CREATE TABLE IF NOT EXISTS subtitles (" + 
        "id int NOT NULL AUTO_INCREMENT " +
        "videoId int NOT NULL" +
        "url VARCHAR(255) " +
        "PRIMARY KEY (id)" +
        ")"
        "PRIMARY KEY (id)" +
        "FOREIGN KEY (videoId) REFERENCES video (id)" +
        ")"
    conn.query(subtitleTableQuery, (err, result) => {
        if(err) throw err
        console.log("Subtitle table created")
    })

    process.exit(0)

})
