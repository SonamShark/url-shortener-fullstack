const { Router } = require("express");
const linkService = require("../services/linkService");

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const links = await linkService.listRecentLinks(25);
    res.json(links);
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const result = await linkService.resolveSlug(req.params.slug);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
