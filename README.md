# 📸 Mini Image Gallery

A simple full-stack application for uploading, viewing, and deleting images.

---

## 🚀 Features

- Upload images (JPEG, PNG) up to **3 MB**
- Real-time **upload progress bar**
- Responsive **image grid gallery**
- One-click image deletion
- Images stored in **backend memory** (no database)

---

## 🛠️ Tech Stack

### **Backend**
- Node.js  
- Express.js  
- Multer  

### **Frontend**
- React  
- Axios  

### **Storage**
- In-memory (using `Map()`)

---

## 📂 Project Structure

image-gallery/
├── backend/
│ ├── server.js
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── App.js
│ │ └── App.css
│ └── package.json
└── README.md

yaml
Copy code

---

## 📦 Prerequisites

Make sure you have **Node.js** installed:

```bash
node --version
If not installed, download from: https://nodejs.org
```
## 🖥️ Backend Setup
1. Navigate to backend folder
```bash
Copy code
cd backend
```
2. Install dependencies
```bash
Copy code
npm install
```
3. Start the backend server
```bash
Copy code
node server.js
```
You should see:
```bash
nginx
Copy code
```
Backend server running on http://localhost:5000
## 🌐 Frontend Setup
1. Navigate to frontend folder
```bash
Copy code
cd frontend
```
2. Install dependencies
```bash
Copy code
npm install
```
3. Start React app
```bash
Copy code
npm start
```
Your browser will open at:

arduino
Copy code
http://localhost:3000
## 📤 How to Use
Click "Upload Image"

Select a JPEG or PNG image (max 3MB)

Watch the upload progress bar

Image appears instantly in the gallery

Click Delete to remove an image

## 🧩 Design Choices
Backend
Express.js for simple REST APIs

Multer for handling file uploads

Map() in-memory storage (as per assignment requirement)

CORS enabled for frontend-backend communication

Frontend
React for component-based UI

Axios for HTTP requests + upload progress

CSS Grid for responsive layout

Real-time updates without page refresh

## 🔌 API Endpoints
Upload Image
http
Copy code
POST /upload
Get All Images
http
Copy code
GET /images
Get Image by ID
http
Copy code
GET /images/:id
Delete Image
http
Copy code
DELETE /images/:id
### ✔️ Validation Rules
Allowed types: JPEG, PNG

Max size: 3 MB

Upload: Single image at a time

###🚧 Future Improvements
Persistent storage (MongoDB / PostgreSQL)

Image compression

Drag-and-drop upload

Multiple image upload

Image preview before upload

User authentication
