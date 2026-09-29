from flask import Blueprint, request, jsonify
from datetime import datetime

from extensions import db
from models import User, LeaveRequest


api = Blueprint("api", __name__)


# =====================================================
# LOGIN
# =====================================================

@api.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:

        return jsonify({
            "message": "Username and password are required"
        }), 400

    user = User.query.filter_by(
        username=username
    ).first()

    if not user:

        return jsonify({
            "message": "Invalid username or password"
        }), 401

    if user.password != password:

        return jsonify({
            "message": "Invalid username or password"
        }), 401

    return jsonify({

        "message": "Login successful",

        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }

    }), 200


# =====================================================
# APPLY LEAVE
# =====================================================

@api.route("/leaves", methods=["POST"])
def apply_leave():

    data = request.get_json()

    user_id = data.get("user_id")
    leave_type = data.get("leave_type")
    start_date = data.get("start_date")
    end_date = data.get("end_date")
    reason = data.get("reason")

    if not all([
        user_id,
        leave_type,
        start_date,
        end_date
    ]):

        return jsonify({
            "message": "Required fields are missing"
        }), 400

    user = User.query.get(user_id)

    if not user:

        return jsonify({
            "message": "User not found"
        }), 404

    try:

        start = datetime.strptime(
            start_date,
            "%Y-%m-%d"
        ).date()

        end = datetime.strptime(
            end_date,
            "%Y-%m-%d"
        ).date()

    except ValueError:

        return jsonify({
            "message": "Date must be YYYY-MM-DD"
        }), 400

    if end < start:

        return jsonify({
            "message": "End date cannot be before start date"
        }), 400

    leave = LeaveRequest(

        user_id=user_id,

        leave_type=leave_type,

        start_date=start,

        end_date=end,

        reason=reason,

        status="Pending"
    )

    db.session.add(leave)

    db.session.commit()

    return jsonify({

        "message": "Leave request submitted successfully",

        "leave_id": leave.id

    }), 201


# =====================================================
# GET ALL LEAVE REQUESTS
# =====================================================

@api.route("/leaves", methods=["GET"])
def get_leaves():

    leaves = LeaveRequest.query.all()

    result = []

    for leave in leaves:

        result.append({

            "id": leave.id,

            "user_id": leave.user_id,

            "leave_type": leave.leave_type,

            "start_date": str(
                leave.start_date
            ),

            "end_date": str(
                leave.end_date
            ),

            "reason": leave.reason,

            "status": leave.status,

            "created_at": str(
                leave.created_at
            )

        })

    return jsonify(result), 200


# =====================================================
# GET SINGLE LEAVE
# =====================================================

@api.route("/leaves/<int:leave_id>", methods=["GET"])
def get_leave(leave_id):

    leave = LeaveRequest.query.get(
        leave_id
    )

    if not leave:

        return jsonify({
            "message": "Leave request not found"
        }), 404

    return jsonify({

        "id": leave.id,

        "user_id": leave.user_id,

        "leave_type": leave.leave_type,

        "start_date": str(
            leave.start_date
        ),

        "end_date": str(
            leave.end_date
        ),

        "reason": leave.reason,

        "status": leave.status

    }), 200


# =====================================================
# APPROVE LEAVE
# =====================================================

@api.route(
    "/leaves/<int:leave_id>/approve",
    methods=["PUT"]
)
def approve_leave(leave_id):

    leave = LeaveRequest.query.get(
        leave_id
    )

    if not leave:

        return jsonify({
            "message": "Leave request not found"
        }), 404

    leave.status = "Approved"

    db.session.commit()

    return jsonify({

        "message": "Leave request approved successfully",

        "leave_id": leave.id,

        "status": leave.status

    }), 200


# =====================================================
# REJECT LEAVE
# =====================================================

@api.route(
    "/leaves/<int:leave_id>/reject",
    methods=["PUT"]
)
def reject_leave(leave_id):

    leave = LeaveRequest.query.get(
        leave_id
    )

    if not leave:

        return jsonify({
            "message": "Leave request not found"
        }), 404

    leave.status = "Rejected"

    db.session.commit()

    return jsonify({

        "message": "Leave request rejected successfully",

        "leave_id": leave.id,

        "status": leave.status

    }), 200
