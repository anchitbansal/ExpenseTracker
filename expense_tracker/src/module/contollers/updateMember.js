const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.updateMember = async (req, res) =>
{
    let db = null;

    try
    {
        /* ================= REQUEST DATA ================= */

        const payload = req.body.data || {};

        const missingField = lib.validateRequiredParameters(
            payload,
            [
                'mid',
                'member_name',
                'relation'
            ]
        );

        if (missingField.length > 0)
        {
            lib.throwError(
                'EM001',
                'Some details are missing'
            );
        }

        const {
            mid,
            member_name,
            relation
        } = payload;

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

        /* ================= CHECK MEMBER ================= */

        const members = await db.query(
            `
            SELECT mid
            FROM members
            WHERE mid = ? AND user_id = ?
            `,
            [
                Number(mid),
                user_id
            ]
        );

        if (members.length === 0)
        {
            lib.throwError(
                'E404',
                'Member not found'
            );
        }

        /* ================= UPDATE MEMBER ================= */

        const updateMember = await db.query(
            `
            UPDATE members
            SET
                member_name = ?,
                relation = ?
            WHERE mid = ? AND user_id = ?
            `,
            [
                member_name,
                relation,
                Number(mid),
                user_id
            ]
        );

        if (updateMember.affectedRows === 0)
        {
            lib.throwError(
                'E404',
                'Unable to update member'
            );
        }

        /* ================= SUCCESS RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Member updated successfully',
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