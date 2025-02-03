import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar:{
      public_id:String,
      url:String
    },
    platform_url: {
      leetcode: {
        type: String,
      },
      gfg: {
        type: String,
      },
      codechef: {
        type: String,
      },
      codeforces: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", schema);
