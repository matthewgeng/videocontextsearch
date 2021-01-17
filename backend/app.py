from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import os, shutil
import pandas as pd
# stupid import crap
import math
import sys
sys.path.append(os.path.abspath('./image_captioning'))

from image_captioning.main import inference

app = Flask(__name__)
CORS(app)

def get_frames(save_path, video, process_percent):
    vid = cv2.VideoCapture(video)
    num_frame = 0
    # fps = vid.get(cv2.CAP_PROP_FPS)
    timestamps = []
    total_frames = int(vid.get(cv2.CAP_PROP_FRAME_COUNT))
    # print(f"total_frames= {total_frames}")

    num_frames_to_process = math.ceil(process_percent*total_frames)
    diff_until_next_frame = math.ceil(total_frames/num_frames_to_process)
    while vid.isOpened():
        frame_exists, frame = vid.read()
        if not frame_exists:
            break
        elif frame_exists and num_frame % diff_until_next_frame == 0:
            # time = fps * num_frame
            time = vid.get(cv2.CAP_PROP_POS_MSEC)
            timestamps.append(time)
            cv2.imwrite(os.path.join(save_path, f"{time}.jpg"), frame)
        num_frame+=1
    print(f"Finished splitting frames: {num_frames_to_process} frames saved, interval = every {diff_until_next_frame} frames ({process_percent*100}%)")
    vid.release()

@app.route("/api/video", methods=["POST"])
def video():
    uploaded_file = request.files['file']
    filename = uploaded_file.filename
    image_caption_path = os.path.join(os.path.join("image_captioning", "test"), "uploaded")

    # folder = os.path.join("uploaded", filename)
    folder = os.path.join(image_caption_path, filename)
    upload_path = os.path.join(folder,filename)

    if not os.path.exists(folder):
        os.mkdir(folder)
    if not os.path.exists(upload_path):
        print(f"File {filename} saved at {upload_path}")
        uploaded_file.save(upload_path)
    get_frames(folder, upload_path, .1)

    # delete saved video
    os.unlink(upload_path)

    inference(3, folder)

    # try:
    #     shutil.rmtree(folder)
    #     print(f"{folder} successfully removed")
    # except Exception as e:
    #     print('Failed to delete %s. Reason: %s' % (folder, e))

    df = pd.read_csv("image_captioning/test/results.csv")


    return jsonify("video")

@app.route("/api/ytlink", methods=["POST"])
def ytlink():
    return jsonify("ytlink")

if __name__ == "__main__":
    app.run()