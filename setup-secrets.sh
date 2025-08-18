#!/bin/bash

PROJECT_ID="newsletter-ai-465602"
SERVICE_ACCOUNT="newsletter-service@$PROJECT_ID.iam.gserviceaccount.com"

echo "Setting up secrets for project: $PROJECT_ID"

# check if service account exists
if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT" >/dev/null 2>&1; then
  echo "Error: Service account $SERVICE_ACCOUNT does not exist"
  echo "Please run ./gcp-setup.sh first"
  exit 1
fi

# create secrets
echo "Creating secrets..."

# function to create secret if it doesn't exist
create_secret() {
    local secret_name=$1
    local description=$2
    
    if gcloud secrets list --filter="name:$secret_name" --format="value(name)" | grep -q "$secret_name"; then
        echo "  -> Secret '$secret_name' already exists"
    else
        echo "  Creating secret '$secret_name'..."
        echo -n "placeholder-value" | gcloud secrets create "$secret_name" --data-file=-
    fi
}

# create required secrets
create_secret "database-url" "MongoDB connection string"
create_secret "gcp-project-id" "GCP Project ID"
create_secret "app-url" "Application URL"
create_secret "resend-api-key" "Resend email service API key"
create_secret "resend-sender" "Resend sender email address"
create_secret "openai-api-key" "OpenAI API key for AI content generation"
create_secret "node_env" "Environment variable for Node.js"

echo ""
echo "Next steps:"
echo "1. Update each secret with your actual values:"
echo "   gcloud secrets versions add database-url --data-file=<(echo -n 'your-actual-database-url')"
echo "   gcloud secrets versions add gcp-project-id --data-file=<(echo -n '$PROJECT_ID')"
echo "   gcloud secrets versions add app-url --data-file=<(echo -n 'https://your-web-app-url.com')"
echo "   gcloud secrets versions add resend-api-key --data-file=<(echo -n 'your-actual-resend-key')"
echo "   gcloud secrets versions add resend-sender --data-file=<(echo -n 'Your Brand <team@yourdomain.com>')"
echo "   gcloud secrets versions add openai-api-key --data-file=<(echo -n 'your-actual-openai-key')"
echo "   gcloud secrets versions add node_env --data-file=<(echo -n 'production')"
echo ""
echo "2. Deploy your application using: ./deploy.sh"
