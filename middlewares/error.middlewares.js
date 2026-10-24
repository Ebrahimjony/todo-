export const errorHandler = (err, req, res, next) => {
    console.error('Error', err.message);
    const statusCode = res.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error"
    });
};