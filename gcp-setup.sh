#!/bin/bash

PROJECT_ID="newsletter-ai-465602"
REGION="us-south1"
SERVICE_ACCOUNT="newsletter-service"

echo "Setting up GCP project: $PROJECT_ID"

# set project
gcloud config set project $PROJECT_ID

# enable required APIs
echo "Enabling required APIs..."
APIS=("cloudbuild.googleapis.com" "run.googleapis.com" "pubsub.googleapis.com" "artifactregistry.googleapis.com" "cloudscheduler.googleapis.com" "secretmanager.googleapis.com")
for api in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo "  -> $api is already enabled"
    else
        echo "  Enabling $api..."
        gcloud services enable $api
    fi
done

# create service account
echo "Creating service account..."
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" >/dev/null 2>&1; then
    echo "  -> Service account already exists"
else
    echo "  Creating service account..."
    gcloud iam service-accounts create $SERVICE_ACCOUNT \
      --display-name="Newsletter Service Account" \
      --description="Service account for newsletter system"
fi

# grant permissions
echo "Granting permissions..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/pubsub.publisher"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/pubsub.subscriber"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# create cloud scheduler job
echo "Creating cloud scheduler job..."
if gcloud scheduler jobs list --location=us-central1 --filter="name:newsletter-daily" --format="value(name)" | grep -q "newsletter-daily"; then
    echo "  -> Cloud Scheduler job already exists"
else
    echo "  Creating cloud scheduler job..."
    gcloud scheduler jobs create http newsletter-daily \
      --schedule="0 9 * * *" \
      --uri="https://newsletter-project-$PROJECT_ID-$REGION.run.app/v1/newsletter/schedule" \
      --http-method=POST \
      --headers="Content-Type=application/json" \
      --message-body='{"email":"yasseen2hilal@gmail.com","topic":"technology"}' \
      --location=us-central1
fi

echo "GCP setup completed successfully!"
echo "Service account: $SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com"
echo "Cloud Scheduler job: newsletter-daily"
