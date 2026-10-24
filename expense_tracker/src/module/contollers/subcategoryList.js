const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.subcategoryList = async (req, res) =>
{
    let db = null;

    try
    {
        const { category_id } = req.body.data || {};

        db = await getDb(req);

        let sql = `
            SELECT
                esc.id,
                esc.category_id,
                ec.name AS category_name,
                esc.name,
                esc.status
            FROM exp_sub_categories esc
            INNER JOIN exp_categories ec
                ON ec.id = esc.category_id
            WHERE esc.status = ?
            AND ec.status = ?
        `;

        const params = [1, 1];

        /* ================= OPTIONAL CATEGORY FILTER ================= */

        if (
            category_id !== undefined &&
            category_id !== null &&
            category_id !== ''
        )
        {
            if (
                !Number.isInteger(Number(category_id)) ||
                Number(category_id) <= 0
            )
            {
                lib.throwError(
                    'E400',
                    'Invalid category_id'
                );
            }

            sql += ` AND esc.category_id = ?`;
            params.push(Number(category_id));
        }

        /* ================= ORDER ================= */

        sql += ` ORDER BY esc.category_id ASC, esc.name ASC`;

        /* ================= FETCH ================= */

        const subCategories = await db.query(
            sql,
            params
        );

        /* ================= RESPONSE ================= */

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Subcategories fetched successfully',
                data: subCategories
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