exports.throwError = (status, message) => {
    const err = new Error();
    err.status = status || "9999",
    err.message = message || ""
    throw err;
}