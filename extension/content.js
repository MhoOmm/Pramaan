chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "verify_advanced") {
    showPramaanOverlay(request.type, request.content);
  }
});

async function showPramaanOverlay(type, content) {
  const existing = document.getElementById("pramaan-overlay-container");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "pramaan-overlay-container";
  
  Object.assign(container.style, {
    position: "fixed", top: "20px", right: "20px", width: "400px",
    background: "#0a0a0a", color: "#fff", padding: "20px", borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.8)", zIndex: 2147483647,
    border: "1px solid rgba(255,255,255,0.1)",
    fontFamily: "'Space Grotesk', -apple-system, sans-serif"
  });

  const shortText = content.length > 55 ? content.substring(0, 55) + "..." : content;
  
  const typeTitles = {
    "news": "Fake News Detection",
    "ai": "AI Text Analysis",
    "sms": "SMS Fraud Detection",
    "email": "Phishing Email Scanner",
    "link": "Malicious Link Scanner",
    "image": "Deepfake Image Detection"
  };

  const logoUrl = chrome.runtime.getURL("assets/logo.jpeg");

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:12px">
      <img src="${logoUrl}" style="width:36px; height:36px; border-radius:50%; border:2px solid #C8A97E; box-shadow:0 0 10px rgba(200, 169, 126, 0.3)" />
      <div style="flex-grow:1">
        <h3 style="margin:0; font-size:16px; font-weight:700; color:#fff; letter-spacing:1px; text-transform:uppercase">Pramaan</h3>
        <p style="margin:2px 0 0 0; font-size:10px; color:#C8A97E; text-transform:uppercase; letter-spacing:1px">${typeTitles[type]}</p>
      </div>
      <button id="pramaan-close-btn" style="background:transparent; border:none; color:#777; cursor:pointer; font-size:18px; padding:4px">✖</button>
    </div>
    
    <div style="font-size:12px; color:#aaa; margin-bottom:15px; line-height:1.4">
      <span style="color:#C8A97E; font-weight:600; text-transform:uppercase; font-size:10px; letter-spacing:1px">Target: </span> 
      <span style="color:#ddd">"${shortText}"</span>
    </div>
    
    <div id="pramaan-result-box" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:8px; font-size:14px; min-height:80px">
      <div style="display:flex; align-items:center; justify-content:center; gap:10px; color:#C8A97E; height:50px">
        <div style="width:16px; height:16px; border:2px solid rgba(200,169,126,0.2); border-top-color:#C8A97E; border-radius:50%; animation:pramaan-spin 1s linear infinite"></div>
        <span style="font-size:13px; letter-spacing:1px; text-transform:uppercase">Analyzing...</span>
      </div>
    </div>
    
    <style>
      @keyframes pramaan-spin { 100% { transform: rotate(360deg); } }
      #pramaan-close-btn:hover { color: #fff !important; }
    </style>
  `;
  document.body.appendChild(container);
  document.getElementById("pramaan-close-btn").onclick = () => container.remove();

  try {
    // Delegate the actual fetch to the background script to bypass webpage CSP/CORS
    chrome.runtime.sendMessage(
      { action: "fetch_api", type: type, content: content },
      (response) => {
        if (!response || response.error) {
          document.getElementById("pramaan-result-box").innerHTML = `<div style="color:#ef4444">❌ Error: ${response?.error || 'Could not connect to AI'}</div>`;
          return;
        }

        const data = response.data;
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
        } else if (type === "image") {
          const isFake = data.prediction === "FAKE";
          resultHTML = `<strong style="color:${isFake ? '#ef4444' : '#10b981'}">${data.prediction} IMAGE</strong><br/>
          <span style="color:#aaa;font-size:12px">Confidence: ${data.confidence}%</span>`;
        }

        document.getElementById("pramaan-result-box").innerHTML = `<div style="font-size:16px">${resultHTML}</div>`;
      }
    );
  } catch (err) {
    document.getElementById("pramaan-result-box").innerHTML = `<div style="color:#ef4444">❌ Error completing analysis. Model may be sleeping.</div>`;
  }
}
