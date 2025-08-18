#!/bin/bash

echo "Creating server/.env file..."

# create .env file
cat > server/.env << EOF
# database
DATABASE_URL="your_mongodb_connection_string_here"

# GCP
GCP_PROJECT_ID="newsletter-ai-465602"

# app
APP_URL="https://your-web-app-url.com"
NODE_ENV="development"

# email
RESEND_API_KEY="your_resend_api_key_here"
RESEND_SENDER="Your Brand <team@yourdomain.com>"

# AI
OPENAI_API_KEY="your_openai_api_key_here"
EOF

echo "server/.env file created!"
echo "Please update it with your actual values before running the server."
