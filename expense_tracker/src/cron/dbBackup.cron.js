const cron = require("node-cron");

cron.schedule("0 0 * * *", async () =>
{
    let con;

    try
    {
        dbBackup();   
    }
    catch (err)
    {
        console.error("Cron Error:", err);
    }
    finally
    {
        if (con) endConn(con);
    }
});


const util = require('util');
const { exec } = require('child_process');
const execAsync = util.promisify(exec);
const {getDb} = require(`${PATHS.configs}/db`);
const lib = require(`${PATHS.utils}/logger.utils`);
const path = require('path')
const fs = require('fs')

const dbBackup = async (req = {}) => 
{
  let db;
  try 
  {
    const backupDate = new Date().toISOString().slice(0, 10);
    const backupFilename = `backup-${backupDate}.sql`;
    const backupDirectory = path.join(PATHS.files, 'db_backup');
    const backupPath = path.join(backupDirectory, backupFilename);

    if (!fs.existsSync(backupDirectory)) 
    {
      fs.mkdirSync(backupDirectory, { recursive: true });
    }
    // Use managed connection
    db = await getDb(req);

    const {
      DB_HOST,
      DB_USER,
      DB_PASSWORD,
      DB_NAME
    } = process.env;

    const backupCommand = [
      'mysqldump',
      '--single-transaction',
      `--host=${DB_HOST}`,
      `--user=${DB_USER}`,
      `--password=${DB_PASSWORD}`,
      DB_NAME,
      `> "${backupPath}"`
    ].join(' ');

    await execAsync(backupCommand);

    // Retain only last 7 backups (mtime based)
    const files = fs.readdirSync(backupDirectory)
      .filter(f => f.endsWith('.sql'))
      .map(file => ({
        file,
        time: fs.statSync(path.join(backupDirectory, file)).mtime.getTime()
      }))
      .sort((a, b) => a.time - b.time);

    if (files.length > 7) {
      files.slice(0, files.length - 7).forEach(f =>
        fs.unlinkSync(path.join(backupDirectory, f.file))
      );
    }

  } catch (err) {
    lib.writeErrorLog("DB backup Failed", err);
  } finally {
    if (db) db.close()
  }
};


module.exports = { dbBackup }
