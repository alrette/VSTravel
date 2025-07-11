# 🌍 VSTravel – Travel Agency Website Prototype

Welcome to the prototype website for **VSTravel**, one of the leading travel agencies in Indonesia! This project was created as part of a `web development assignment` and showcases a clean, functional travel booking interface built using HTML, CSS, and JavaScript.

---

## 🗂️ Project Structure

This prototype website includes **5 main pages** and **1 detail page**:

| Page | File Name | Description |
|------|-----------|-------------|
| 🏠 Home | `home.html` | Displays a slogan, brief info about VSTravel, and top destinations this month. |
| 🧭 Destinations | `destination.html` | Shows all available travel destinations with descriptions, images, and province. |
| 📞 Contact Us | `contact.html` | Lists branch offices in Jakarta, Medan, and Surabaya, along with address, hours, image, and contact. |
| 👥 About Us | `aboutus.html` | Describes VSTravel’s history and mission, complete with images and text. |
| 🧳 Travel Now | `travelnow.html` | Includes benefits and a travel booking form for customer input. |
| 🔍 Destination Details | `destination-details.html` | Dynamically shows more details of each destination using JSON data. |

---

## 💡 How to Use

### ✅ Requirements
- Any modern browser:
  - Chrome, Firefox, Edge, Safari, Opera, etc.
- Internet connection required for Font Awesome icons

### ⚙️ Run the Website Properly (Important!)
This project includes JavaScript that uses `fetch()` to load local JSON files, which is blocked by some browsers for security when run via `file:///`.

To run properly:

1. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) on VS Code
2. Open the project folder in VS Code
3. Right-click on `home.html` → **Open with Live Server**
4. The website will run at `http://127.0.0.1:5500/`
5. Use the navbar to navigate through all pages

---

## ⚠️ Known Limitations

- ❗ JavaScript functionality (e.g. loading JSON) **won’t work with direct file access** (`file:///`) — must use Live Server.
- 📝 The booking form is for **demo purposes only** — no real backend/database.
- 🔒 User authentication (login/register) is **not implemented**.

---

## 🧰 Tech Stack

![HTML](https://img.shields.io/badge/HTML-5-orange?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-3-blue?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript&logoColor=white)

Created for Laboratory Project 2025 – VSTravel – Aldo Oktavianus
