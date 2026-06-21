# Google Cloud Platform (GCP) Deployment Guide

This document guides you through deploying the **EcoSphere** application to GCP using **Google Cloud Run**. Because the application is fully containerized using the provided `Dockerfile` and `nginx.conf`, it can run serverless on GCP with auto-scaling (scaling to zero when inactive) for maximum cost efficiency.

---

## Method 1: Continuous Deployment from GitHub (Recommended)

This method connects your GitHub repository to Cloud Run, automatically rebuilding and deploying the application every time you push code.

1. **Upload your code to GitHub**:
   Create a new GitHub repository and push your workspace files (including `Dockerfile` and `nginx.conf`).

2. **Go to Cloud Run**:
   Open the [GCP Cloud Run Console](https://console.cloud.google.com/run).

3. **Create Service**:
   - Click **Create Service**.
   - Select **"Continuously deploy from a repository"**.
   - Click **Set up with Cloud Build**.

4. **Connect Repository**:
   - Choose **GitHub** as the provider.
   - Authenticate and select your repository and branch (e.g., `main`).
   - Click **Next**.

5. **Build Configuration**:
   - Select **Dockerfile** as the Build Type.
   - Source Location: `/Dockerfile` (defaults to root).
   - Click **Save**.

6. **Configure Service Details**:
   - **Service Name**: `ecosphere`
   - **Region**: Choose a **Green Grid Region** to lower the environmental impact of your hosting.
     - *US Central*: `us-central1` (Iowa - high clean energy share)
     - *Europe*: `europe-west6` (Zurich) or `europe-west1` (Belgium)
     - *Asia*: `asia-east1` (Taiwan)
   - **Authentication**: Select **"Allow unauthenticated invocations"** (public web access).
   - **Container Port**: Ensure the port matches `8080` (configured in `nginx.conf`).

7. **Deploy**:
   Click **Create**. Cloud Build will build your container image and push it to Artifact Registry, and Cloud Run will deploy it. In a few minutes, you will receive a public HTTPS URL.

---

## Method 2: Deploy from Local Machine (using gcloud CLI)

If you have the Google Cloud CLI installed, you can build and deploy directly from your local terminal.

1. **Authenticate CLI**:
   ```bash
   gcloud auth login
   ```

2. **Set GCP Project ID**:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Deploy from Source**:
   Run the following command in your workspace directory. This will upload the source files, trigger a container build in Cloud Build, and deploy it to Cloud Run.
   ```bash
   gcloud run deploy ecosphere --source . --region us-central1 --allow-unauthenticated
   ```

4. **Access the Application**:
   Once complete, the command line will print the service URL (e.g., `https://ecosphere-xxxx-uc.a.run.app`).

---

## Green Hosting Optimization

GCP matches 100% of its electricity consumption with renewable energy purchases. However, deploying in regions with cleaner local grids is still highly recommended because it reduces the physical strain on fossil-fuel plants:
* **Iowa (us-central1)** has local wind-capacity grids.
* **Finland (europe-north1)** and **Belgium (europe-west1)** are highly carbon-efficient.
* Select these regions during configuration to make your cloud footprint as low-carbon as possible!
