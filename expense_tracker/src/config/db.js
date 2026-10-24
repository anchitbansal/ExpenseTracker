// db.js

require("dotenv").config();
const mysql = require("mysql2")
const util = require("util");
const { throwError } = require("../utils/core.utils");

const getDb = async (req) =>
{
    let conn = null;
    conn = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DATABASE
    });

    await util.promisify(conn.connect).call(conn);
    const rawQuerry = await util.promisify(conn.query).bind(conn);

    const query = async (sql , params= []) => {
        const result = await rawQuerry(sql, params);
        return result;
    }

    const startTrans = async() => 
    {
        try
        {
            await query('start transaction');
        }catch(err){
            throwError("EDB01", "Unable to Start Transaction")
        }
    };

    const commitTrans = async() => 
    {
        try
        {
            await query('commit');
        }catch(err){
            throwError("EDB01", "Unable to Commit Transaction");
        }
    };

    const rollBackTrans = async() => 
    {
        try
        {
            await query('rollback transaction');
        }catch(err){
            throwError("EDB01", "Unable to Rollback Transaction");
        }
    }



    const close = async () => {
        await util.promisify(conn.end).call(conn);
    }

    return {
        query,
        startTrans,
        commitTrans,
        rollBackTrans,
        close
    }
}

module.exports = {
    getDb
};