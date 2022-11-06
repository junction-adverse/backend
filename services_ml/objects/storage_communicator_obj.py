from google.cloud import storage
import os

class googleCloudStorage:
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name

    def upload_blob(self, local_path, filename):
        print("Uploading video to Google Cloud")
        """Uploads a file to the bucket."""
        # The ID of your GCS bucket
        bucket_name = "ad-analyzer-videos"
        # The ID of your GCS object
        blob_name = "coca_cola_ad_uploaded.mp4"

        storage_client = storage.Client()
        bucket = storage_client.bucket(self.bucket_name)
        blob = bucket.blob(filename)

        blob.upload_from_filename(local_path)

        print(
            f"File {local_path} uploaded to {self.bucket_name}/{filename}"
        )

        return f"gs://{self.bucket_name}/{filename}"