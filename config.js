/**
 * ====================================================================
 * BIRTHDAY WEBSITE CONFIGURATION (BLACK & WHITE MINIMALIST)
 * ====================================================================
 */

const BIRTHDAY_CONFIG = {
  // Recipient Name
  recipientName: "Jie",

  // Greetings
  koreanGreeting: "생일 축하해요!",
  titleGreeting: "Happy Birthday, Jie.",
  subtitleGreeting: "Wishing you the happiest and sweetest birthday.",

  // Audio / Video Source (YouTube Short: tSzsjx-i5vY)
  youtube: {
    videoId: "tSzsjx-i5vY",
    watchUrl: "https://www.youtube.com/shorts/tSzsjx-i5vY"
  },

  // Synced Lyrics (Synchronized with 22-second Korean birthday song)
  lyrics: [
    { start: 0, end: 5.5, kor: "생일 축하합니다", rom: "Saeng-il chukha hamnida", eng: "Happy birthday to you" },
    { start: 5.5, end: 11.0, kor: "생일 축하합니다", rom: "Saeng-il chukha hamnida", eng: "Happy birthday to you" },
    { start: 11.0, end: 16.5, kor: "사랑하는 Jie의", rom: "Saranghaneun Jie-ui", eng: "Happy birthday dear Jie" },
    { start: 16.5, end: 22.0, kor: "생일 축하합니다", rom: "Saeng-il chukha hamnida", eng: "Happy birthday to you" }
  ],

  // Balloon Prompts (Guides for Jie when writing her wishes)
  balloonPrompts: [
    {
      id: 1,
      tag: "Wish 01",
      title: "First Birthday Wish",
      placeholder: "Write your wish for yourself and peace of mind here, Jie..."
    },
    {
      id: 2,
      tag: "Wish 02",
      title: "Second Birthday Wish",
      placeholder: "Write your goals, dreams, or career wish for this year..."
    },
    {
      id: 3,
      tag: "Wish 03",
      title: "Third Birthday Wish",
      placeholder: "A secret birthday wish from your heart—make it yours!"
    }
  ],

  // Personal Birthday Letter for Jie
  letter: {
    tag: "Personal Letter",
    salutation: "himluee, jieeee!",
    paragraphs: [
      "late q na nasend since i’m doing my pendings while also vibe coding this website. anyways, happy birthday! sa imyueee. i’ve put some balloons for u to make a wish, and if ever u need someone para mag-unwind and let out those thoughts during those breakdowns, i’ll try my best to make u feel at ease.",
      "don’t pressure urself sa academics, okie? u got this, and i know u’re trying ur best. u did well sa defense niyo pala, and i know u can do well pa sa upcoming pendings mo and face the fears na mararamdaman mo.",
      "always prioritize urself, okie dokie? if u think na u’ve done enough, give urself some rest, or maybe do ur usual thing, lumabas and find something to eat. if it doesn’t work na, try exploring another interest, okie?"
    ],
    closing: "",
    signature: ""
  }
};
