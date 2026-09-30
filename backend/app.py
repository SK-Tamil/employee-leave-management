from flask import Flask, jsonify
from flask_cors import CORS

from extensions import db


# =====================================================
# CREATE FLASK APPLICATION
# =====================================================

app = Flask(__name__)

CORS(app)


# =====================================================
# MYSQL DATABASE CONFIGURATION
# =====================================================

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://leaveuser:leavepassword@mysql:3306/leave_management"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# =====================================================
# INITIALIZE DATABASE
# =====================================================

db.init_app(app)


# =====================================================
# IMPORT MODELS
# =====================================================

from models import User, LeaveRequest


# =====================================================
# IMPORT ROUTES
# =====================================================

from routes import api


app.register_blueprint(
    api,
    url_prefix="/api"
)


# =====================================================
# HOME API
# =====================================================

@app.route("/")
def home():

    return jsonify({

        "message":
        "Employee Leave Management API is running"

    })


# =====================================================
# HEALTH CHECK
# =====================================================

@app.route("/health")
def health():

    return jsonify({

        "status": "healthy"

    })


# =====================================================
# DATABASE CONNECTION TEST
# =====================================================

@app.route("/api/db-test")
def db_test():

    try:

        db.session.execute(
            db.text("SELECT 1")
        )

        return jsonify({

            "status": "success",

            "message":
            "Flask connected to MySQL successfully"

        })

    except Exception as e:

        return jsonify({

            "status": "error",

            "message": str(e)

        }), 500


# =====================================================
# CREATE DEFAULT USERS
# =====================================================

def create_default_users():

    with app.app_context():

        employee = User.query.filter_by(
            username="john"
        ).first()

        if not employee:

            employee = User(

                username="john",

                password="john123",

                role="employee"

            )

            db.session.add(employee)


        admin = User.query.filter_by(
            username="admin"
        ).first()

        if not admin:

            admin = User(

                username="admin",

                password="admin123",

                role="admin"

            )

            db.session.add(admin)


        db.session.commit()


# =====================================================
# START APPLICATION
# =====================================================

if __name__ == "__main__":

    create_default_users()

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )
