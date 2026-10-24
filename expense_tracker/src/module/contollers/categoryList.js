const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");

exports.categoryList = async (req, res) =>
{
    let db = null;

    try
    {
        db = await getDb(req);

        const categories = await db.query(
            "SELECT id, name, status FROM exp_categories WHERE status = ? ORDER BY name ASC",
            [1]
        );

        return lib.SuccessResponse(
            req,
            res,
            {
                status: '0000',
                message: 'Categories fetched successfully',
                data: categories
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