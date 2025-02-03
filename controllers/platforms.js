import { TryCatch } from "../middlewares/error.js";
import Scrap from "../utils/scrap.js";

export const gfg = TryCatch(async (req, res) => {
  const { username } = req.params;
  const scrapper = new Scrap(username);
  const response = await scrapper.fetchResponse();
  res.json(response);
});
