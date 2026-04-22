const { Router } = require("express");
const linkService = require("../services/linkService");
const rateLimit = require("../middleware/rateLimit");

const router = Router();

router.post(
  "/",
  rateLimit({ keyPrefix: "rl:shorten", max: 10, windowSeconds: 60 }),
  async (req, res, next) => {
    try {
      const link = await linkService.createShortLink(
        req.body?.url,
        req.body?.customSlug
      );
      res.status(201).json(link);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
