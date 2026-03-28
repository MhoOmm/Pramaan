# 🚀 Hackathon Submission – API_Smiths

## 👥 Team Information

**Team Name:** API_Smiths  

**Team Members:**
- **Hamza Patel** – 2305215 *(Team Lead)* 
- **Omm Tripathi** – 23051606  
- **Aniket Dhar** – 23051570
- **Asmit Sahu** – 23052231  

- Deployment Link:- https://pramaanf.vercel.app

---

## 📌 Problem Statement -  AI-Powered Misinformation Detection

### 🔍 **The Challenge**

The rapid growth of AI-generated content and misinformation has made it increasingly difficult to distinguish between authentic and manipulated information online.

Deepfake images, fake news articles, phishing messages, and AI-generated text are spreading rapidly across digital platforms. This surge of misleading content leads to:

- **Widespread misinformation**  
- **Online scams and phishing attacks**  
- **Loss of public trust in digital content**  

---

### ⚠️ **Current Limitations**

Most existing solutions:

- Focus on a **single type of threat** (e.g., only fake news or only phishing detection)  
- Lack **community-driven validation mechanisms**  
- Fail to provide a **comprehensive, unified platform**  

---

### 💡 **Our Objective**

To address these challenges, there is a need for a **unified platform** that:

- Detects **AI-generated and suspicious content** using advanced models such as RoBERTa, NLP techniques, MobileNetV2, and other state-of-the-art machine learning approaches.
- Incorporates **community verification** for higher reliability  
- Flags **potentially harmful or misleading information** in real-time  

---

## 💡 Our Solution

To overcome the above challenges, we propose:

### 🔐 **“PRAMAAN” – A Community-Driven Ethical AI Platform for Detecting and Verifying Fake Digital Content**

Using **PRAMAAN**, users can upload **images, text, emails, or links** to check whether they are **fake, AI-generated, or malicious** using machine learning models.

The platform also functions as a **social media-style community**, where users can post suspected fake news or manipulated media, and other users can **review, upvote, or downvote** its authenticity.

A **karma-based reputation system** rewards users who consistently identify misinformation accurately. By combining **AI-based detection** with **community moderation**, the platform improves **reliability, transparency, and trust** in identifying fake content.

---

### 🎯 **Target Users**

- **Everyday internet users**  
- **Journalists and media organizations**  
- **Businesses and institutions**  
- **Policymakers and regulatory bodies**  

---

## 🏗️ Our Architecture

- **User Layer**  
  - Guest users can access AI detection tools  
  - Detect:
    - DeepFake Images  
    - Phishing Messages & Emails  
    - AI-generated Text  
    - Fake News  

- **Authentication**  
  - Secure login system  
  - Required for:
    - Posting content  
    - Voting  
    - Karma participation
  - Logged-in users can:
    - Create posts  
    - Validate content via **upvotes/downvotes**  

- **AI Processing**  
  - Inputs (image/text/email) are analyzed using ML models  
  - Detects:
    - Deepfakes  
    - AI-generated content  
    - Phishing attempts  

- **Threshold Trigger**  
  - Posts crossing a predefined vote limit are automatically sent for **AI verification**  

- **Data Management**  
  - Stores:
    - Users  
    - Posts  
    - Votes  
    - Karma scores  
    - ML results  

- **Dashboard**  
  - Displays:
    - AI analysis  
    - Community validation  
  - Provides **final credibility score**

---

## 🌍 Impact

- **✔️ Reduces Misinformation Spread**  
  Helps identify fake news, deepfakes, and misleading content before it goes viral  
- **✔️ Enhances Digital Trust**  
  Combines AI detection with community validation  
- **✔️ Prevents Financial & Cyber Fraud**  
  Detects phishing emails and SMS  
- **✔️ Promotes Responsible AI Usage**  
  Identifies AI-generated or manipulated content  
- **✔️ Empowers Users**  
  Encourages independent verification and improves digital literacy  

---

## 🌐 Real-World Applications

- **📱 Social Media Platforms**  
  - Flag fake news and deepfakes in real-time  

- **🛡️ Cybersecurity & Fraud Detection**  
  - Detect phishing and prevent scams  

- **📰 Journalism & Fact-Checking**  
  - Verify authenticity of news  

- **🎓 Education Sector**  
  - Teach identification of AI-generated content  

- **🏢 Corporate & Enterprise Use**  
  - Verify emails and internal communication  

- **🏛️ Government & Public Safety**  
  - Monitor and control misleading information  

---

## ⚙️ Setup & Usage

### 🛠️ Run Locally

```bash
# Clone the repository
git clone https://github.com/MhoOmm/Pramaan.git
cd pramaan

# Install backend dependencies
cd backend
npm install
nodemon server.js

# Install ML services
cd ../ml_service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Install frontend dependencies
cd ../frontend
npm install
npm run dev

```

## 🧩 Browser Extension Setup

Follow these steps to install and use the PRAMAAN browser extension:

### 🌐 Steps to Install

1. Open **Google Chrome**
2. Navigate to: chrome://extensions/
3. Enable **Developer Mode** (toggle on the top-right corner)
4. Click on **Load unpacked**
5. Select the `extension` folder from the cloned repository
6. The extension will now be added to your browser
7. Ensure the extension is **enabled**

---

### 🚀 How to Use

- Click on the extension icon in the Chrome toolbar  
- Upload or scan content directly from your browser  
- Instantly analyze:
- Get **real-time AI-based detection results**
- Fake news and images 
- Text content  
- Web links  
- Suspicious pages

---

### ⚠️ Notes

- Make sure Developer Mode remains enabled  
- Reload the extension if you make any changes to the code  
- Works best on the latest version of Google Chrome  

---
