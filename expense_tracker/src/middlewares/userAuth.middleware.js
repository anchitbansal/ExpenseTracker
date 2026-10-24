const { getDb } = require("../config/db");
const lib = require("../utils/index.utils");

exports.userAuth = async (req, res, next) =>
{
    let db = null;

    try
    {
        db = await getDb(req);
		console.log(req.user)
        const userId = req.user.userId;

        const sql = `
            SELECT *
            FROM user
            WHERE user_id = ?
        `;

        const users = await db.query(sql, [userId]);

        if (users.length === 0)
        {
            lib.throwError(
                "E900",
                "User doesnt exists or deactivated"
            );
        }

        const user = users[0];

        if (user.is_deleted === 1)
        {
            lib.throwError(
                "E900",
                "User doesnt exists or deactivated"
            );
        }

        next();
    }
    catch (err)
    {
        lib.ErrorResponse(req, res, err);
    }
    finally
    {
        if (db)
        {
            await db.close();
        }
    }
}

// module.exports = { userAuth };