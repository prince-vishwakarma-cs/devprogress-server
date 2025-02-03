export const errorMiddleware = (err, req, res, next) => {
    const { message = "Internal Server Error", statusCode = 500 } = err;
  
    return res.status(statusCode).json({
      success: false,
      message: err.message
    });
  };
  
  export const TryCatch = (passFunc) => async (req, res, next) => {
    try {
      await passFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };
  