const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.deleteMember = async (req, res) =>
{
    let db = null;

    try
    {
        const payload = req.body.data || {};

        const missingField = lib.validateRequiredParameters(
            payload,
            ['mid']
        );

        if(missingField.length > 0)
        {
            lib.throwError(
                "EM001",
                "Member ID is required"
            );
        }

        const { mid } = payload;

        /* ================= VALIDATE MID ================= */

        if (
            !Number.isInteger(Number(mid)) ||
            Number(mid) <= 0
        )
        {
            lib.throwError(
                'E400',
                'Invalid member id'
            );
        }

        const user_id = req.user.userId;

        if (!user_id)
        {
            lib.throwError(
                'E401',
                'Invalid user session'
            );
        }

        db = await getDb(req);

        /* ================= CHECK MEMBER ================= */

        const members = await db.query(
            "SELECT mid FROM members WHERE mid = ? AND user_id = ? AND status = ?",
            [
                Number(mid),
                user_id,
                1
            ]
        );

        if(members.length === 0)
        {
            lib.throwError(
                'E404',
                'Member not found'
            );
        }

        /* ================= SOFT DELETE ================= */

        const deleteMember = await db.query(
            "UPDATE members SET status = ? WHERE mid = ? AND user_id = ?",
            [
                0,
                Number(mid),
                user_id
            ]
        );

        if(deleteMember.affectedRows === 0)
        {
            lib.throwError(
                'E404',
                'Unable to delete member'
            );
        }

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Member deleted successfully',
                data:
                {
                    mid: Number(mid)
                }
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