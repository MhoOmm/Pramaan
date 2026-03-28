const phishingDictionary = {
  credit_card_scam: [
    "credit card",
    "cvv",
    "card number",
    "payment declined",
    "billing information"
  ],

  account_verification: [
    "verify your account",
    "confirm identity",
    "account suspended",
    "security alert"
  ],

  password_reset: [
    "reset your password",
    "change password",
    "password expired"
  ],

  lottery_prize: [
    "won lottery",
    "claim prize",
    "congratulations winner",
    "you have won"
  ],

  honey_trap: [
    "dear friend",
    "romance",
    "my dear",
    "trust you",
    "lonely",
    "hot",
    "horny",
    "toy"
  ]
};

function classifyPhishingType(text) {

  const lowerText = text.toLowerCase();

  for (const type in phishingDictionary) {
    for (const keyword of phishingDictionary[type]) {
      if (lowerText.includes(keyword)) {
        return type;
      }
    }
  }

  return "unknown";
}

module.exports = { classifyPhishingType };