# 🎂 Birthday Website — Tapswi

A visually stunning, interactive birthday website built with love.

## 🚀 How to Run

**Option 1 — Python (already installed)**
```bash
cd "d:\Proejcts\Tapswi_Birthday"
python -m http.server 5500
```
Then open: **http://localhost:5500**

**Option 2 — VS Code Live Server**
Right-click `index.html` → Open with Live Server

**Option 3 — Just open the file**
Double-click `index.html` (note: music may not work due to CORS)

---

## 🎨 Customization Guide

### 1. Change the Name / Date
Edit `index.html` — find and replace "My Love" with her name, and update the date in the hero badge.

### 2. Update Timeline Events
In `index.html`, find `<!-- TIMELINE -->` and edit the `.timeline-item` divs with your real dates and memories.

### 3. Add Real Photos to Gallery
Replace the gradient memory cards with actual images:
```html
<!-- Replace the memory-gradient div content with: -->
<img src="your-photo.jpg" alt="Memory caption" style="width:100%;height:100%;object-fit:cover;" />
```

### 4. Update "Reasons I Love You" Text
In `index.html`, find each `<div class="reason-back">` and edit the `<p>` text.

### 5. Add Background Music
Place your music file (e.g., `music.mp3`) in the project folder, then edit `script.js`:
```js
// Find this line:
const musicSrc = 'https://...wikimedia...';
// Replace with:
const musicSrc = 'music.mp3';
```

### 6. Customize the Final Letter
In `index.html`, find `<!-- FINAL LETTER -->` section and update all paragraph text with your personal message.

---

## 📁 File Structure
```
Tapswi_Birthday/
├── index.html    ← Main HTML structure
├── style.css     ← All styling & animations  
├── script.js     ← All interactions & effects
└── README.md     ← This file
```

---

*Made with ❤️ and a whole lot of love.*
