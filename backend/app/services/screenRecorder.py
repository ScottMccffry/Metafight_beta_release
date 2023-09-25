import os
import signal
import subprocess
import time
PID_FILE = "/tmp/streaming_process.pid"


def start_streaming(stream_key, screen_size='800x600', offset='10,20'):
    command = [
        'ffmpeg',
        '-f', 'avfoundation', 
        '-i', '1:1',
        '-vcodec', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'veryfast',
        '-maxrate', '3000k',
        '-bufsize', '6000k',
        '-threads', '0',
        '-f', 'flv',
        f'rtmp://live.twitch.tv/app/{stream_key}'
    ]

  # Create pid file or overwrite if already exists
    try:
        with open(PID_FILE, 'w') as pid_file:
            pid_file.write(str(process.pid))
    except Exception as e:
        print(f"Error writing to PID file: {e}")

    # Read pid from file
    try:
        with open(PID_FILE, 'r') as pid_file:
            pid = int(pid_file.read())
    except ValueError:
        print(f"PID file is empty or contains non-integer value.")
    except Exception as e:
        print(f"Error reading from PID file: {e}")

    # Start the subprocess
    process = subprocess.Popen(command)

    # Store the PID in a file
    with open('streaming.pid', 'w') as pid_file:
        pid_file.write(str(process.pid))
        
    return process


