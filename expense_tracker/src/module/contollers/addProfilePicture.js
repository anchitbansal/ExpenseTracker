const { getDb } = require("../../config/db");
const lib = require("../../utils/index.utils");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.addProfilePicture = async (req, res) => {
    let db = null;

    try {
        /* ================= AUTHENTICATED USER ================= */
        const user_id = req.user?.userId;

        if (!user_id) {
            lib.throwError("E401", "Invalid user session");
        }

        /* ================= CHECK FILE ================= */
        if (!req.files || !req.files.profile_picture) {
            lib.throwError("E400", "Profile picture is required");
        }

        const file = req.files.profile_picture;

        /* ================= CHECK FILE TYPE ================= */
        const allowedFormats = ["jpeg", "png", "webp", "jpg"];
        let format = null;

        try {
            const metadata = await sharp(file.data).metadata();
            format = metadata.format;
        } catch (e) {
            format = null;
        }

        if (!allowedFormats.includes(format)) {
            lib.throwError("E400", "Only JPG, JPEG, PNG and WEBP images are allowed");
        }

        /* ================= FILE NAME ================= */
        const fileName = `${user_id}.webp`;

        /* ================= FILE PATH SETUP ================= */
        // Resolve absolute directory path relative to this file location
        const targetDir = path.resolve(__dirname, "../../../files/profile_pictures");

        // Ensure target directory exists (creates folders recursively if missing)
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const uploadPath = path.join(targetDir, fileName);

        /* ================= CONVERT & SAVE TO WEBP ================= */
        await sharp(file.data)
            .webp({ quality: 80 })
            .toFile(uploadPath);

        /* ================= DATABASE UPDATE ================= */
        db = await getDb(req);

        await db.query(
            `
            UPDATE user
            SET profile_picture = ?
            WHERE user_id = ?
            `,
            [fileName, user_id]
        );

        /* ================= SUCCESS RESPONSE ================= */
        return lib.SuccessResponse(req, res, {
            status: "0000",
            message: "Profile picture uploaded successfully",
            data: {
                profile_picture: fileName
            }
        });

    } catch (err) {
        console.log(err);
        lib.ErrorResponse(req, res, err);
    } finally {
        if (db) {
            await db.close();
        }
    }
};