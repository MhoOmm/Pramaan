import torch
import torch.nn.functional as F
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_ID = "animan0810/pramaan-ai-detector"

class AITextDetector:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.tok    = AutoTokenizer.from_pretrained(MODEL_ID)
        self.model  = AutoModelForSequenceClassification.from_pretrained(
            MODEL_ID).to(self.device).eval()

    def _chunks(self, text, max_tok=510, stride=64):
        ids = self.tok.encode(text, add_special_tokens=False)
        if len(ids) <= max_tok: return [text]
        out = []
        for s in range(0, len(ids), max_tok - stride):
            c = ids[s: s + max_tok]
            if len(c) < 20: break
            out.append(self.tok.decode(c, skip_special_tokens=True))
            if s + max_tok >= len(ids): break
        return out or [text]

    @torch.no_grad()
    def predict(self, text):
        probs = []
        for chunk in self._chunks(text):
            enc = self.tok(chunk, return_tensors="pt",
                           max_length=512, truncation=True, padding=True
                           ).to(self.device)
            p = F.softmax(self.model(**enc).logits, dim=-1).cpu().numpy()[0]
            probs.append(p)
        avg = np.mean(probs, axis=0)
        ai  = float(avg[1])
        if   ai >= 0.85: verdict = "AI-generated"
        elif ai <= 0.15: verdict = "Human-written"
        elif ai >= 0.60: verdict = "Likely AI"
        elif ai <= 0.40: verdict = "Likely Human"
        else:            verdict = "Uncertain"
        return {
            "label":      "AI" if ai > 0.5 else "Human",
            "verdict":    verdict,
            "ai_score":   round(ai, 4),
            "confidence": round(max(ai, 1 - ai), 4)
        }