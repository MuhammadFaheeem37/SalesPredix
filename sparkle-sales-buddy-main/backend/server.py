"""
Backend server for login data logging
Run: python server.py
"""
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os
from datetime import datetime
import threading
import time

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Store logs in memory
login_activity_logs = []
USER_CREDENTIALS = {
    "admin@sparklesales.com": "admin123",
    "user@example.com": "password123",
    "nazeem@uosahiwal.edu.pk": "nazeem123"
}

@app.route('/')
def index():
    """Display server status"""
    return jsonify({
        "status": "running",
        "service": "Login Logger API",
        "timestamp": datetime.now().isoformat(),
        "log_count": len(login_activity_logs)
    })

@app.route('/api/log-login', methods=['POST'])
def log_login_attempt():
    """API endpoint to receive login attempts"""
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('email'):
            return jsonify({"success": False, "error": "Email required"}), 400
        
        # Create log entry
        log_entry = {
            "log_id": f"#LOG{int(time.time() * 1000)}",
            "action": "LOGIN_ATTEMPT",
            "user": data.get('email', 'unknown'),
            "username": data.get('email', '').split('@')[0],
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "ip_address": request.remote_addr,
            "user_agent": request.user_agent.string,
            "status": "PENDING",
            "server_received": True,
            "received_at": datetime.now().isoformat()
        }
        
        # Check credentials
        email = data.get('email')
        password = data.get('password', '')
        
        if email in USER_CREDENTIALS and password == USER_CREDENTIALS[email]:
            log_entry["status"] = "SUCCESS"
            log_entry["action"] = "LOGIN_SUCCESS"
            success = True
            message = "Login successful"
        else:
            log_entry["status"] = "FAILED"
            log_entry["action"] = "LOGIN_FAILED"
            success = False
            message = "Invalid credentials"
        
        # Add to logs
        login_activity_logs.append(log_entry)
        
        # Save to file
        save_log_to_file(log_entry)
        
        return jsonify({
            "success": success,
            "message": message,
            "log_id": log_entry["log_id"],
            "user": log_entry["username"],
            "status": log_entry["status"],
            "timestamp": log_entry["timestamp"],
            "server_time": datetime.now().isoformat()
        })
        
    except Exception as e:
        error_log = {
            "log_id": f"#ERR{int(time.time() * 1000)}",
            "action": "SERVER_ERROR",
            "user": "system",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "error": str(e),
            "status": "ERROR"
        }
        login_activity_logs.append(error_log)
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/get-all-logs', methods=['GET'])
def get_all_logs():
    """Retrieve all login logs"""
    return jsonify({
        "logs": login_activity_logs,
        "total": len(login_activity_logs),
        "server": "Sparkle Sales Buddy v1.0.0",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

@app.route('/api/get-recent-logs', methods=['GET'])
def get_recent_logs():
    """Get recent 20 logs"""
    recent = login_activity_logs[-20:] if login_activity_logs else []
    return jsonify({
        "recent_logs": recent,
        "count": len(recent)
    })

@app.route('/api/clear-logs', methods=['DELETE'])
def clear_logs():
    """Clear all logs (for testing)"""
    global login_activity_logs
    count = len(login_activity_logs)
    login_activity_logs = []
    return jsonify({
        "success": True,
        "message": f"Cleared {count} logs",
        "remaining": 0
    })

def save_log_to_file(log_entry):
    """Save log to JSON file for persistence"""
    try:
        filename = "login_logs.json"
        
        # Create directory if not exists
        os.makedirs("data", exist_ok=True)
        filepath = os.path.join("data", filename)
        
        # Read existing logs
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                try:
                    logs = json.load(f)
                except:
                    logs = []
        else:
            logs = []
        
        # Add new log
        logs.append(log_entry)
        
        # Keep only last 1000 entries
        if len(logs) > 1000:
            logs = logs[-1000:]
        
        # Save to file
        with open(filepath, 'w') as f:
            json.dump(logs, f, indent=2)
            
        print(f"[LOG SAVED] {log_entry['log_id']} - {log_entry['user']} - {log_entry['status']}")
        
    except Exception as e:
        print(f"[ERROR] Failed to save log: {e}")

if __name__ == '__main__':
    print("=" * 60)
    print("LOGIN LOGGER SERVER STARTING...")
    print(f"Server Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print("\nAvailable endpoints:")
    print("  • GET  /              - Server status")
    print("  • POST /api/log-login - Submit login attempt")
    print("  • GET  /api/get-all-logs - Get all logs")
    print("  • GET  /api/get-recent-logs - Get recent logs")
    print("  • DELETE /api/clear-logs - Clear logs")
    print("\nDefault users:")
    for email, password in USER_CREDENTIALS.items():
        print(f"  • {email}:{password}")
    print("=" * 60)
    print("\nStarting server on http://localhost:5000")
    
    app.run(debug=True, port=5000, host='0.0.0.0')
