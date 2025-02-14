import pg from 'pg';
import "dotenv/config";
export default class UserDB{
    saltRounds = Number(process.env.SALT_ROUNDS);
    dbPassword = process.env.DATABASE_PASSWORD;
    dbUser = process.env.DATABASE_USER;
    dbName = process.env.DATABASE_NAME;
    constructor(){
        this.db = new pg.Client({
            user: this.dbUser,
            host: "localhost",
            database: this.dbName,
            password: this.dbPassword,
            port: 5432
        });
        this.db.connect();
    };

    async insertUserDB(user){
        try {
            const result = await this.db.query("INSERT INTO USERS (email,password) VALUES($1,$2) RETURNING *",[user.getEmail(),user.getHashedPassword()]);
            return result.rows[0];
        } catch (error) {
            console.log("Error inserting user to DB:",error);
        }
    }

    async existUserDB(email){
        try {
            const result = await this.db.query("SELECT * FROM USERS WHERE email = $1",[email]);
            if(result.rows.length == 0)
                return false;
            else
                return true;
        } catch (error) {
            console.log("Error check for existting user by email from DB:",error);
        }
    }
    
}