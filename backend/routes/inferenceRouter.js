const express = require("express");
const hfrouter = express.Router();

const {detectPhishingLink}= require("../controllers/phishingLink");

const {detectPhishingEmail} = require("../controllers/phishingEmail");



hfrouter.post("/detect-link", detectPhishingLink);
hfrouter.post("/detect-email", detectPhishingEmail);

module.exports = hfrouter;