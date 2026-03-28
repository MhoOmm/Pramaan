const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");

const token = jwt.sign({ email: "test@test.com", id: "000000000000000000000000" }, "674dc5a625ae4b42ceb7d728fedf262659e91852cf580d4986c9a3a7932e7516", { expiresIn: "10h" });

async function run() {
  try {
    console.log("Sending text payload...");
    const res1 = await axios.post("http://localhost:5000/api/chat/post", {
      text: "hello world!",
      analysisType: "fake_news"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Success text:", res1.data);
  } catch(e) {
    console.error("Text Error:", e.response?.data || e.message);
  }

  try {
    console.log("Sending formData with dummy image...");
    const form = new FormData();
    form.append("analysisType", "image");
    form.append("image", Buffer.from("dummy"), { filename: "dummy.jpg", contentType: "image/jpeg" });
    const res2 = await axios.post("http://localhost:5000/api/chat/post", form, {
      headers: { 
        Authorization: `Bearer ${token}`,
        ...form.getHeaders()
      }
    });
    console.log("Success image:", res2.data);
  } catch(e) {
    console.error("Image Error:", e.response?.data || e.message);
  }
}
run();
