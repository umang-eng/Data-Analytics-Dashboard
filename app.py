from flask import Flask, jsonify
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) to allow the frontend to fetch data
CORS(app)

# --- Mock Data ---
# This data would typically come from a database in a real application.
def get_dashboard_data():
    """
    Returns a dictionary containing all the data needed for the dashboard.
    """
    return {
        "kpi": {
            "total_revenue": {
                "value": 45231.89,
                "change": 20.1
            },
            "subscriptions": {
                "value": 2350,
                "change": 180.1
            },
            "sales": {
                "value": 12234,
                "change": -2.5
            },
            "active_now": {
                "value": 573,
                "change_label": "+201 since last hour"
            }
        },
        "revenue_overview": [
            { "name": 'Jan', "revenue": 4000, "profit": 2400 },
            { "name": 'Feb', "revenue": 3000, "profit": 1398 },
            { "name": 'Mar', "revenue": 5000, "profit": 9800 },
            { "name": 'Apr', "revenue": 4780, "profit": 3908 },
            { "name": 'May', "revenue": 5890, "profit": 4800 },
            { "name": 'Jun', "revenue": 4390, "profit": 3800 },
            { "name": 'Jul', "revenue": 5490, "profit": 4300 },
        ],
        "recent_sales": [
            { "id": '1', "name": 'John Doe', "email": 'john.doe@example.com', "amount": '$2,500.00', "status": 'Paid' },
            { "id": '2', "name": 'Jane Smith', "email": 'jane.smith@example.com', "amount": '$1,200.50', "status": 'Paid' },
            { "id": '3', "name": 'Sam Wilson', "email": 'sam.wilson@example.com', "amount": '$800.00', "status": 'Pending' },
            { "id": '4', "name": 'Emily Brown', "email": 'emily.brown@example.com', "amount": '$4,150.75', "status": 'Paid' },
            { "id": '5', "name": 'Michael Johnson', "email": 'michael.j@example.com', "amount": '$500.00', "status": 'Failed' },
        ],
        "sales_by_country": [
            { "name": 'USA', "sales": 400 },
            { "name": 'Canada', "sales": 300 },
            { "name": 'Mexico', "sales": 200 },
            { "name": 'Germany', "sales": 278 },
            { "name": 'UK', "sales": 189 },
            { "name": 'France', "sales": 239 },
        ],
        "user_activity_by_age": [
            { "name": '18-24', "uv": 31.47, "fill": '#8884d8' },
            { "name": '25-29', "uv": 26.69, "fill": '#83a6ed' },
            { "name": '30-34', "uv": 15.69, "fill": '#8dd1e1' },
            { "name": '35-39', "uv": 8.22, "fill": '#82ca9d' },
            { "name": '40-49', "uv": 8.63, "fill": '#a4de6c' },
            { "name": '50+', "uv": 2.63, "fill": '#d0ed57' },
        ]
    }

# Define an API endpoint at /api/data
@app.route('/api/data')
def data_endpoint():
    """
    This function is triggered when a GET request is made to /api/data.
    It returns the dashboard data in JSON format.
    """
    data = get_dashboard_data()
    return jsonify(data)

# --- Main execution block ---
if __name__ == '__main__':
    # Run the Flask app on localhost, port 5000
    # The debug=True argument allows for auto-reloading when the code changes.
    app.run(debug=True, port=5000)
