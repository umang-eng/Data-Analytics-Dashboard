# Data Analytics Dashboard

This is a full-stack web application that displays business intelligence data. It features a Python Flask backend that serves data to a dynamic frontend built with HTML, Tailwind CSS, and Chart.js.

---

## 🚀 Features

* **Full-Stack Architecture:** A clear separation between the Python backend (data) and the HTML/JS frontend (presentation).
* **Dynamic Charts:** Visualizes data using line charts, bar charts, and doughnut charts powered by Chart.js.
* **Responsive Design:** The interface is fully responsive and works seamlessly on desktop, tablet, and mobile devices.
* **Modern UI:** A clean, dark-themed user interface that is easy to read and visually appealing.
* **REST API:** A simple Flask-based API endpoint (`/api/data`) that provides all necessary data in JSON format.

---

## 🛠️ Technologies Used

* **Backend:** Python, Flask, Flask-CORS
* **Frontend:** HTML5, Tailwind CSS, Chart.js

---

## ⚙️ Setup and Installation

To run this project locally, you will need to set up both the backend server and the frontend client.

### **1. Backend Setup (Python Server)**

First, ensure you have **Python 3** and **pip** installed on your machine.

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```

2.  **Install Dependencies**
    Open your terminal in the project directory and install the required Python packages.
    ```bash
    pip install Flask Flask-Cors
    ```

3.  **Run the Flask Server**
    Start the backend server.
    ```bash
    python app.py
    ```
    The server should now be running on `http://127.0.0.1:5000`.

### **2. Frontend Setup (HTML/JS Client)**

1.  **Ensure the Backend is Running**
    The frontend needs to fetch data from the backend server, so make sure the server from the previous step is active.

2.  **Open the HTML File**
    Simply open the `index.html` file in your preferred web browser (e.g., Chrome, Firefox, Safari).

The dashboard should load and display all the data and charts. If it doesn't load, check the browser's developer console for any errors.

