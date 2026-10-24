const SuccessResponse = (req, res, response) => 
{
    res.json(
        {
            status: response.status,
            message: response.message,
            data: response.data,
            token: response.token,
            api: req.body?.api || req.path || req.originalUrl,
            // api: req.originalUrl,
            timestamp: Date.now()
        }
    )
}

const ErrorResponse = (req, res, err) => 
{
    res.json(
        {
            status: err.status || "E999",
            message: err.message || "Something Went Wrong",
            data: null,
            timestamp: Date.now()
        }
    )
}

module.exports = {
    SuccessResponse,
    ErrorResponse
}