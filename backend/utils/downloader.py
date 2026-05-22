import yt_dlp
import os
from static_ffmpeg import add_paths
add_paths()

def download_youtube_audio(url, output_path):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': output_path.replace('.mp3', ''),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        actual_path = f"{output_path.replace('.mp3', '')}.mp3"
        if os.path.exists(actual_path) and actual_path != output_path:
             os.rename(actual_path, output_path)

        return info
