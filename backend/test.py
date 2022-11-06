import os
import pandas as pd
from google.cloud import videointelligence

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'keys/key.json'
video_client = videointelligence.VideoIntelligenceServiceClient()

features = [videointelligence.enums.Feature.LABEL_DETECTION]

gs_URI = 'gs://ad-analyzer-videos/coca_cola_ad.mp4'
operation = video_client.annotate_video(gs_URI, features=features)
print('\nProcessing video for label annotations:')

result = operation.result(timeout=120)
annotation_results = result.annotation_results

segment_labels = annotation_results[0].segment_label_annotations

for i, segment_label in enumerate(segment_labels):
    print('Video label description: {}'.format(
        segment_label.entity.description))
    for category_entity in segment_label.category_entities:
        print('\tLabel category description: {}'.format(
            category_entity.description))

    # 1e9 = 1,000,000,000 (a billion) second
    for i, segment in enumerate(segment_label.segments):
        start_time = (segment.segment.start_time_offset.seconds +
                      segment.segment.start_time_offset.nanos / 1e9)
        end_time = (segment.segment.end_time_offset.seconds +
                    segment.segment.end_time_offset.nanos / 1e9)
        positions = '{}s to {}s'.format(start_time, end_time)
        confidence = segment.confidence
        print('\tSegment {}: {}'.format(i, positions))
        print('\tConfidence: {}'.format(confidence))
    print('\n')