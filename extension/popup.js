document.getElementById("analyze-btn").addEventListener("click", async () => {
  const type = document.getElementById("scan-type").value;
  const content = document.getElementById("text-input").value.trim();
  const resultDiv = document.getElementById("result");

  if (!content) {
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "Please enter some content.";
    return;
  }

  resultDiv.style.display = "block";
  resultDiv.innerText = "Analyzing with Pramaan AI...";

  try {
    const BASE_BACKEND = "http://localhost:5000";
    let url, bodyData;

    if (type === "news") {
      url = `${BASE_BACKEND}/api/ml/analyze/fakenews`;
      bodyData = { text: content };
    } else if (type === "ai") {
      url = `${BASE_BACKEND}/api/ml/analyze/ai-gen-hum-text`;
      bodyData = { text: content };
    } else if (type === "sms") {
      url = `${BASE_BACKEND}/api/ml/analyze/sms`;
      bodyData = { text: content };
    } else if (type === "link") {
      url = `${BASE_BACKEND}/api/hf/detect-link`;
      bodyData = { url: content };
    } else if (type === "email") {
      url = `${BASE_BACKEND}/api/hf/detect-email`;
      bodyData = { text: content };
    } else if (type === "chatbot") {
      url = `https://no-fake-samacharbackend.vercel.app/api/chatbot/pramaan`;
      bodyData = { text: content };
    }

    const res = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData)
    });
    
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    
    let resultHTML = "";
    if (type === "news") {
      const isFake = data.verdict === "Fake News";
      resultHTML = `<strong style="color:${isFake ? '#ef4444' : '#10b981'}">${data.verdict}</strong> ${data.confidence ? `<br/><span style="color:#aaa;font-size:12px">Confidence: ${data.confidence}%</span>` : ''}`;
    } else if (type === "ai") {
      const isAi = data.label === "AI";
      const score = data.aiScore !== undefined ? data.aiScore : (data.confidence !== undefined ? data.confidence : 0);
      resultHTML = `<strong style="color:${isAi ? '#ef4444' : '#10b981'}">${data.verdict}</strong><br/>
      <span style="color:#aaa;font-size:12px">AI Score: ${Math.round(score * 100)}%</span>`;
    } else if (type === "sms") {
      const isSpam = data.verdict == 1 || String(data.verdict).toLowerCase() === "spam";
      resultHTML = `Verdict: <strong style="color:${isSpam ? '#ef4444' : '#10b981'}">${isSpam ? 'Fraud/Spam' : 'Safe'}</strong>`;
    } else if (type === "link" || type === "email") {
      const isPhishing = data.verdict && data.verdict.toLowerCase().includes("phishing");
      resultHTML = `Verdict: <strong style="color:${isPhishing ? '#ef4444' : '#10b981'}">${isPhishing ? 'Malicious Phishing Attempt' : 'Safe Content'}</strong>`;
    } else if (type === "chatbot") {
        resultHTML = `<div style="text-align:left; font-size:13px; color:#fff">${data.response || data.reply?.message || data.message || "Done"}</div>`;
    }

    resultDiv.innerHTML = resultHTML;

  } catch (err) {
    resultDiv.innerText = "❌ Error connecting to backend.";
    resultDiv.style.color = "#ff4444";
  }
});
