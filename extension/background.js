chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "pramaan-parent",
    title: "Verify with Pramaan",
    contexts: ["selection", "link", "image"]
  });

  const menus = [
    { id: "pramaan-news", title: "Verify Fake News", contexts: ["selection"] },
    { id: "pramaan-ai", title: "Detect AI Text", contexts: ["selection"] },
    { id: "pramaan-sms", title: "Check SMS Fraud", contexts: ["selection"] },
    { id: "pramaan-email", title: "Check Phishing Email", contexts: ["selection"] },
    { id: "pramaan-link", title: "Check Phishing Link", contexts: ["link", "selection"] },
    { id: "pramaan-image", title: "Detect Deepfake Image", contexts: ["image"] },
  ];

  menus.forEach(m => {
    chrome.contextMenus.create({
      id: m.id,
      parentId: "pramaan-parent",
      title: m.title,
      contexts: m.contexts
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const typeMap = {
    "pramaan-news": "news",
    "pramaan-ai": "ai",
    "pramaan-sms": "sms",
    "pramaan-email": "email",
    "pramaan-link": "link",
    "pramaan-image": "image"
  };

  const verifyType = typeMap[info.menuItemId];
  if (!verifyType) return;

  let contentToVerify = info.selectionText;
  if (verifyType === "link" && info.linkUrl) contentToVerify = info.linkUrl;
  if (verifyType === "image" && info.srcUrl) contentToVerify = info.srcUrl;

  if (contentToVerify) {
    chrome.tabs.sendMessage(tab.id, {
      action: "verify_advanced",
      type: verifyType,
      content: contentToVerify.trim()
    });
  }
});

// Listener for background fetches
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetch_api") {
    (async () => {
      try {
        let url, bodyData;
        const BASE_BACKEND = "https://pramaan-omega.vercel.app";

        if (request.type === "news") {
          url = `${BASE_BACKEND}/api/ml/analyze/fakenews`;
          bodyData = { text: request.content };
        } else if (request.type === "ai") {
          url = `${BASE_BACKEND}/api/ml/analyze/ai-gen-hum-text`;
          bodyData = { text: request.content };
        } else if (request.type === "sms") {
          url = `${BASE_BACKEND}/api/ml/analyze/sms`;
          bodyData = { text: request.content };
        } else if (request.type === "link") {
          url = `${BASE_BACKEND}/api/hf/detect-link`;
          bodyData = { url: request.content };
        } else if (request.type === "email") {
          url = `${BASE_BACKEND}/api/hf/detect-email`;
          bodyData = { text: request.content };
        } else if (request.type === "image") {
          url = "https://animan0810-pramaan-ml.hf.space/predict-image";
          bodyData = { image_url: request.content };
        }

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData)
        });

        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        sendResponse({ data });
      } catch (error) {
        sendResponse({ error: error.message });
      }
    })();
    return true; // Indicates an async response
  }
});
