#!/bin/bash

PROJECT_ID="newsletter-ai-465602"
REGION="us-south1"

echo "Starting server deployment to GCP project: $PROJECT_ID"

# set project
gcloud config set project $PROJECT_ID

# check required APIs
echo "Checking required APIs..."
APIS=("cloudbuild.googleapis.com" "run.googleapis.com" "pubsub.googleapis.com" "artifactregistry.googleapis.com")
for api in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo "  -> $api is enabled"
    else
        echo "  (X) $api is not enabled. Please run './gcp-setup.sh' first."
        exit 1
    fi
done

# check if service account exists
SERVICE_ACCOUNT="newsletter-service@$PROJECT_ID.iam.gserviceaccount.com"
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT" >/dev/null 2>&1; then
    echo "  -> Service account exists: $SERVICE_ACCOUNT"
else
    echo "  (X) Service account does not exist. Please run './gcp-setup.sh' first."
    exit 1
fi

# check required secrets
echo "Checking required secrets..."
SECRETS=("database-url" "gcp-project-id" "app-url" "resend-api-key" "resend-sender" "openai-api-key" "node_env")
for secret in "${SECRETS[@]}"; do
    if gcloud secrets list --filter="name:$secret" --format="value(name)" | grep -q "$secret"; then
        echo "  -> Secret exists: $secret"
    else
        echo "  (X) Secret missing: $secret. Please run './setup-secrets.sh' first."
        exit 1
    fi
done

echo "All prerequisites are met. Starting server deployment..."

# trigger cloud build
echo "Triggering Cloud Build for the server..."
gcloud builds submit --config cloudbuild.yaml .

echo "Server deployment completed successfully!"

echo "Your services:"
echo "  - Server API: https://newsletter-project-$PROJECT_ID-$REGION.run.app"
echo "  - Web App: Already deployed on Vercel"

echo "Next steps:"
echo "1. Test your API endpoints"
echo "2. Verify the web app can connect to the API"
echo "3. Test the newsletter signup flow"
echo "4. Check Cloud Scheduler jobs for automated newsletters"

echo "To monitor your deployment:"
echo "  - Cloud Build logs: https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
echo "  - Cloud Run services: https://console.cloud.google.com/run?project=$PROJECT_ID"
echo "  - Pub/Sub topics: https://console.cloud.google.com/cloudpubsub/topic/list?project=$PROJECT_ID"
