#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}(CHECK) Checking GCP Setup for Newsletter System${NC}"
echo "=================================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}(X) gcloud CLI is not installed${NC}"
    echo "Please install gcloud CLI first: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}(X) Not authenticated with gcloud${NC}"
    echo "Please run: gcloud auth login"
    exit 1
fi

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$CURRENT_PROJECT" ]; then
    echo -e "${RED}(X) No project is set${NC}"
    echo "Please set a project: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}(OK) Using project: ${CURRENT_PROJECT}${NC}"

# Check required APIs
echo -e "\n${BLUE}(API) Checking required APIs...${NC}"
REQUIRED_APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "pubsub.googleapis.com"
    "artifactregistry.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo -e "  ${GREEN}(OK) $api is enabled${NC}"
    else
        echo -e "  ${RED}(X) $api is not enabled${NC}"
        echo "    Enable with: gcloud services enable $api"
    fi
done

# Check service account
echo -e "\n${BLUE}(USER) Checking service account...${NC}"
SERVICE_ACCOUNT="newsletter-service@$CURRENT_PROJECT.iam.gserviceaccount.com"

if gcloud iam service-accounts describe "$SERVICE_ACCOUNT" &>/dev/null; then
    echo -e "  ${GREEN}(OK) Service account exists: $SERVICE_ACCOUNT${NC}"
else
    echo -e "  ${RED}(X) Service account does not exist: $SERVICE_ACCOUNT${NC}"
    echo "    Create with: gcloud iam service-accounts create newsletter-service --display-name='Newsletter Service'"
fi

# Check required secrets
echo -e "\n${BLUE}(KEY) Checking required secrets...${NC}"
REQUIRED_SECRETS=(
    "database-url"
    "gcp-project-id"
    "app-url"
    "resend-api-key"
    "resend-sender"
    "openai-api-key"
    "node_env"
)

for secret in "${REQUIRED_SECRETS[@]}"; do
    if gcloud secrets describe "$secret" &>/dev/null; then
        echo -e "  ${GREEN}(OK) Secret exists: $secret${NC}"
    else
        echo -e "  ${RED}(X) Secret does not exist: $secret${NC}"
        echo "    Create with: gcloud secrets create $secret --data-file=-"
    fi
done

# Check Cloud Run service
echo -e "\n${BLUE}(RUN) Checking Cloud Run service...${NC}"
SERVICE_NAME="newsletter-project"
REGION="us-south1"

if gcloud run services describe "$SERVICE_NAME" --region="$REGION" &>/dev/null; then
    echo -e "  ${GREEN}(OK) Cloud Run service exists: $SERVICE_NAME${NC}"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")
    echo -e "  ${BLUE}   Service URL: $SERVICE_URL${NC}"
else
    echo -e "  ${YELLOW}(!) Cloud Run service does not exist: $SERVICE_NAME${NC}"
    echo "    This is normal for first-time setup"
fi

# Check Cloud Scheduler job
echo -e "\n${BLUE}(TIME) Checking Cloud Scheduler job...${NC}"
JOB_NAME="newsletter-daily"

if gcloud scheduler jobs describe "$JOB_NAME" --location="us-central1" &>/dev/null; then
    echo -e "  ${GREEN}(OK) Scheduler job exists: $JOB_NAME${NC}"
    
    # Check job status
    JOB_STATUS=$(gcloud scheduler jobs describe "$JOB_NAME" --location="us-central1" --format="value(state)")
    echo -e "  ${BLUE}   Job status: $JOB_STATUS${NC}"
else
    echo -e "  ${YELLOW}(!) Scheduler job does not exist: $JOB_NAME${NC}"
    echo "    This is normal for first-time setup"
fi

# Check Pub/Sub topics
echo -e "\n${BLUE}(MSG) Checking Pub/Sub topics...${NC}"
TOPICS=(
    "newsletter-daily-production"
    "newsletter-signup-production"
)

for topic in "${TOPICS[@]}"; do
    if gcloud pubsub topics describe "$topic" &>/dev/null; then
        echo -e "  ${GREEN}(OK) Topic exists: $topic${NC}"
    else
        echo -e "  ${YELLOW}(!) Topic does not exist: $topic${NC}"
        echo "    This is normal - topics are created automatically"
    fi
done

echo -e "\n${BLUE}==================================================${NC}"
echo -e "${GREEN}(DONE) GCP Setup Check Complete!${NC}"

# Summary
echo -e "\n${BLUE}(INFO) Summary:${NC}"
echo "If you see any (X) errors above, please fix them before proceeding."
echo "If you see (!) warnings, these are usually fine for first-time setup."
echo "If everything shows (OK), you're ready to deploy!"

echo -e "\n${BLUE}(NEXT) Next steps:${NC}"
echo "1. Fix any errors shown above"
echo "2. Run: ./deploy.sh"
echo "3. Test your newsletter system"

