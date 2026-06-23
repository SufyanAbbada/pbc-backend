import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    error: [
      {
        path: "request Limit",
        msg: "Too many requests, please try again later",
      },
    ],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default apiLimiter;
