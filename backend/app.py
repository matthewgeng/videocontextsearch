from flask import Flask, jsonify, request
from flask_cors import CORS
import cv2
import os, shutil
import pandas as pd
# stupid import crap
import math
import sys
sys.path.append(os.path.abspath('./image_captioning'))
sys.path.append(os.path.abspath('./sentence_similarity'))
from image_captioning.main import inference
from sentence_similarity.sensim import inference_sensim
import numpy as np
app = Flask(__name__)
CORS(app)

df = None

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
    global df
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
    get_frames(folder, upload_path, .3)

    # delete saved video
    os.unlink(upload_path)

    inference(3, folder)

    try:
        shutil.rmtree(folder)
        print(f"{folder} successfully removed")
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (folder, e))

    df = pd.read_csv("image_captioning/test/results.csv")
    df = df.sort_values(by=["timestamps"])
    df = df.drop_duplicates(subset=["caption"], keep='first')
    df = df.reset_index()

    return jsonify("Success")


@app.route("/api/search", methods=["POST"])
def search():
    global df
    sentences = df["caption"].to_numpy()
    query = request.get_json()["search"]

    pred = inference_sensim(sentences, query)
    scores = pd.DataFrame({"scores": pred.flatten()})

    new_df = pd.concat([df, scores], axis=1)
    new_df = new_df[new_df["scores"] >= 0.5]
    new_df = new_df[["timestamps", "scores"]]
    final_data = new_df.set_index('timestamps')["scores"].to_dict()
    return jsonify(final_data)

@app.route("/api/ytlink", methods=["POST"])
def ytlink():
    return jsonify("ytlink")

if __name__ == "__main__":
    app.run()