

import os
from tinytag import TinyTag
import json

song_data = {
    "total_duration": 0,
    "songs": []
}

cwd = os.getcwd()
songs = os.path.join(cwd, "songs")
print(songs)
for filename in os.listdir(songs):
    song_path = os.path.join(songs, filename)
    file = TinyTag.get(song_path)
    song_data["songs"].append ({
        "filename": filename,
        "title": file.title if file.album else "Untitled",
        "album": file.album if file.album else "Unreleased",
        "artist": file.artist,
        "duration": file.duration
    })
    
    # Add the song duration to the total duration
    song_data["total_duration"] += file.duration

with open("song_data.json", "w") as f:
    json.dump(song_data, f, indent=4)
