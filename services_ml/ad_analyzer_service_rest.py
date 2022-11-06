import os
from flask import Flask, request
from objects.youtube_processor_obj import youtubeDowloader
from objects.storage_communicator_obj import googleCloudStorage
from objects.video_analyzer_obj import adVideoAnalyzer

app = Flask(__name__)


def listen():
    app.run(host='0.0.0.0', port=1337)

@app.route('/youtubeinput/', methods=['GET', 'POST'])
def take_youtube_request():
    arguments_dictionary = request.args.to_dict()
    try:
        service_runner_class = serviceListener(arguments_dictionary["link"])
        return service_runner_class.run_processing_flow()
    except:
        return "Error 31337"


class serviceListener:
    def __init__(self, link):
        self.youtube_link = link

    def run_processing_flow(self):
        self.setup_util_variables()
        self.setup_helper_objects()
        self.download_youtube_video()
        self.upload_to_google_bucket()
        return self.evaluate_google_ai_video()

    def setup_util_variables(self):
        self._main_file_dir = os.path.normpath(os.path.dirname(__file__))
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.join(self._main_file_dir, 'keys/key.json')
        self._path_to_store_downloads = os.path.join(self._main_file_dir, "video_samples")
        self.cloud_bucket_name = "ad-analyzer-videos"

    def setup_helper_objects(self):
        self.youtube_processor = youtubeDowloader(self._path_to_store_downloads)
        self.google_storage_communicator = googleCloudStorage(self.cloud_bucket_name)
        self.google_ai_analytics_processor = adVideoAnalyzer()

    def download_youtube_video(self):
        try:
            [self.video_full_local_path, self.filename] = self.youtube_processor.download_video(self.youtube_link)
        except:
            print("Error while downloading video")

    def upload_to_google_bucket(self):
        self.google_bucket_video_ul = self.google_storage_communicator.upload_blob(self.video_full_local_path, self.filename)

    def evaluate_google_ai_video(self):
        return self.google_ai_analytics_processor.detect_logo_gcs(self.google_bucket_video_ul)


if __name__ == '__main__':
    listen()