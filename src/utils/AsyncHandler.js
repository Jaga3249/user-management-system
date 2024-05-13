export const asyncHandle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      sucess: false,
      message: error.message,
    });
  }
};

const dsta = () => {
  try {
  } catch (error) {}
};
