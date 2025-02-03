import axios from "axios";
import * as cheerio from "cheerio";  // Updated import for ESM

class Scrap {
  constructor(username) {
    this.username = username;
    this.BASE_URL = `https://auth.geeksforgeeks.org/user/${username}/practice/`;
  }

  async fetchResponse() {
    try {
      const { data } = await axios.get(this.BASE_URL);
      const $ = cheerio.load(data); // Cheerio's $ function

      const extractText = (selector) => $(selector).text().trim() || "";

      const generalInfo = {
        userName: this.username,
        profilePicture: $("img.profile_pic").attr("src") || "",
        instituteRank: extractText("span.rankNum"),
        currentStreak: extractText("div.streakCnt")?.split("/")[0] || "00",
        maxStreak: extractText("div.streakCnt")?.split("/")[1] || "00",
        institution: extractText(".basic_details_data:nth-child(1)"),
        languagesUsed: extractText(".basic_details_data:nth-child(2)"),
        campusAmbassador: extractText(".basic_details_data:nth-child(3)"),
        codingScore: extractText(".score_card_value:nth-child(1)"),
        totalProblemsSolved: extractText(".score_card_value:nth-child(2)"),
        monthlyCodingScore: extractText(".score_card_value:nth-child(3)"),
        articlesPublished: extractText(".score_card_value:nth-child(4)"),
      };

      const difficulties = ["#school", "#basic", "#easy", "#medium", "#hard"];
      const solvedStats = {};

      difficulties.forEach((difficulty) => {
        const questions = [];
        $(`${difficulty} a`).each((_, element) => {
          questions.push({
            question: $(element).text().trim(),
            questionUrl: $(element).attr("href"),
          });
        });

        solvedStats[difficulty.replace("#", "")] = {
          count: questions.length,
          questions: questions,
        };
      });

      return { info: generalInfo, solvedStats };
    } catch (error) {
      return {
        error: "Profile Not Found or Request Failed",
        details: error.message,
      };
    }
  }
}

export default Scrap;
