from pytube import YouTube
import time
import os

class youtubeDowloader:
    def __init__(self, storage_path):
        self.storage_path = storage_path
        self.download_extension = 'mp4'

    def download_video(self, link):
        print(f"Downloading video in {self.storage_path}")

        yt = YouTube(link)
        yt = yt.streams.filter(progressive=True, file_extension=self.download_extension).order_by('resolution').desc().first()

        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)

        video_filename = 'video_' + time.strftime("%Y_%m_%d_%H-%M-%S") + "." + self.download_extension
        yt.download(self.storage_path, video_filename)

        print("Video saved!")

        final_saved_path = os.path.join(self.storage_path, video_filename)

        return [final_saved_path, video_filename]