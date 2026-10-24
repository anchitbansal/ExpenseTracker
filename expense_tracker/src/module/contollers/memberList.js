const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.memberList = async (req, res) =>
{
    let db = null;

    try
    {
        /* ================= AUTHENTICATED USER ================= */

        const user_id = req.user.userId;

        if (!user_id)
        {
            lib.throwError(
                'E401',
                'Invalid user session'
            );
        }

        /* ================= DATABASE CONNECTION ================= */

        db = await getDb(req);

        /* ================= GET MEMBERS ================= */

        const members = await db.query(
            `
            SELECT
                mid,
                member_name,
                relation,
                status,
                created_at
            FROM members
            WHERE user_id = ? AND status = ?
            ORDER BY created_at DESC
            `,
            [
                user_id,
                1
            ]
        );

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Members fetched successfully',
                data: members
            }
        );
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
};