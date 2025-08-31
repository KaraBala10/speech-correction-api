#!/usr/bin/env python3
"""
Flask API for Gemma2 Chat Integration
This runs outside Docker and connects to Ollama directly
"""

import json
import os
from datetime import datetime

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gemma2"


@app.route("/api/gemma2-chat/", methods=["POST"])
def gemma2_chat():
    """Handle Gemma2 chat requests"""
    try:
        # Get request data
        data = request.get_json()
        user_message = data.get("message", "").strip()
        conversation_history = data.get("history", [])

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Build prompt/context for the model
        context = "You are Sayar, an AI assistant for Arabic speech therapy and pronunciation learning. You help users with:\n"
        context += "- Arabic pronunciation questions\n"
        context += "- Speech therapy guidance\n"
        context += "- Learning tips and techniques\n"
        context += "- General support for the Sayar platform\n"
        context += "Always respond in Arabic unless the user asks in English. Be helpful, encouraging, and educational.\n\n"

        if conversation_history:
            context += "Previous conversation:\n"
            for msg in conversation_history[-5:]:  # Keep last 5 messages for context
                context += f"{msg['role']}: {msg['content']}\n"
            context += "\n"

        context += f"User: {user_message}\nSayar:"

        # Call Ollama API
        try:
            payload = {
                "model": MODEL_NAME,
                "prompt": context,
                "stream": False,
                "options": {"temperature": 0.7, "top_p": 0.9, "max_tokens": 500},
            }

            response = requests.post(OLLAMA_URL, json=payload, timeout=60)
            response.raise_for_status()

            result = response.json()
            ai_response = result.get("response", "").strip()

            # Remove any assistant prefix
            if ai_response.startswith("Sayar:"):
                ai_response = ai_response[6:].strip()

            return jsonify(
                {
                    "response": ai_response,
                    "model": MODEL_NAME,
                    "timestamp": datetime.now().isoformat(),
                }
            )

        except requests.exceptions.RequestException as e:
            return (
                jsonify(
                    {
                        "error": f"Ollama service error: {str(e)}",
                        "fallback_response": "عذراً، الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً أو التواصل مع فريق الدعم.",
                    }
                ),
                503,
            )

    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON data"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route("/api/health/", methods=["GET"])
def health_check():
    """Health check endpoint"""
    try:
        # Test Ollama connection
        response = requests.get("http://localhost:11434/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            gemma2_available = any(
                "gemma2" in model.get("name", "").lower() for model in models
            )

            return jsonify(
                {
                    "status": "healthy",
                    "ollama_connected": True,
                    "gemma2_available": gemma2_available,
                    "timestamp": datetime.now().isoformat(),
                }
            )
        else:
            return (
                jsonify(
                    {
                        "status": "unhealthy",
                        "ollama_connected": False,
                        "error": "Ollama not responding",
                    }
                ),
                503,
            )
    except Exception as e:
        return (
            jsonify(
                {"status": "unhealthy", "ollama_connected": False, "error": str(e)}
            ),
            503,
        )


@app.route("/", methods=["GET"])
def index():
    """Root endpoint"""
    return jsonify(
        {
            "message": "Sayar Gemma2 API",
            "version": "1.0.0",
            "endpoints": {"chat": "/api/gemma2-chat/", "health": "/api/health/"},
        }
    )


if __name__ == "__main__":
    print("🚀 Starting Sayar Gemma2 API...")
    print("📍 API will be available at: http://localhost:5000")
    print("🔗 Chat endpoint: http://localhost:5000/api/gemma2-chat/")
    print("💚 Health check: http://localhost:5000/api/health/")
    print("=" * 50)

    app.run(host="0.0.0.0", port=5000, debug=True)
