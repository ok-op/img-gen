from flask import Flask, request, render_template, send_from_directory, jsonify
import os
import yt_dlp
import threading
import time

# Set environment variables directly in the code
os.environ['FLASK_ENV'] = 'production'
os.environ['FLASK_APP'] = 'bot.py'
os.environ['FLASK_RUN_HOST'] = '0.0.0.0'
os.environ['FLASK_RUN_PORT'] = '3000'


app = Flask(__name__)

# ডাউনলোড ফোল্ডার তৈরি করা
download_folder = 'downloads'
if not os.path.exists(download_folder):
    os.makedirs(download_folder)

# ডাউনলোড ফোল্ডার তৈরি করা
download_folder = 'downloads'
if not os.path.exists(download_folder):
    os.makedirs(download_folder)

# ভিডিও ডাউনলোড করার ফাংশন
def download_video(url, custom_name="downloaded_video"):
    try:
        # কুকি ফাইলের সঠিক পাথ
        cookie_file = os.path.join(os.path.dirname(__file__), 'templates', 'cookies.txt')

        # yt-dlp কনফিগারেশন
        ydl_opts = {
            'format': 'bestvideo[ext=mp4][vcodec=avc1]+bestaudio/best',  # AVC ফরম্যাট এবং avc1 কোডেক
            'outtmpl': os.path.join(download_folder, f'{custom_name}.%(ext)s'),
            'cookiefile': cookie_file,  # কুকি ফাইলের পাথ যুক্ত করুন
        }

        # ইউটিউব URL ফাংশনের আর্গুমেন্ট থেকে নেয়া
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

    except Exception as e:
        print(f"Error downloading video: {e}")

# মেটাডেটা সংগ্রহ করা
def get_metadata(url):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,  # মেটাডেটা ছাড়া শুধুমাত্র ভিডিও তথ্য নেয়
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        return info_dict

# ফাইল ডিলিট করার ফাংশন (১০ মিনিট পর)
def delete_file(filepath):
    """Delete a file after 10 minutes"""
    time.sleep(600)  # 600 সেকেন্ড = 10 মিনিট
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"File {filepath} deleted after 10 minutes.")
    except Exception as e:
        print(f"Error deleting file {filepath}: {e}")

# হোম পেজ রেন্ডার করা
@app.route('/')
def index():
    return render_template('index.html')

# ডাউনলোড রুট
@app.route('/download', methods=['GET'])
def download():
    url = request.args.get('url')
    custom_name = request.args.get('name', 'downloaded_video')  # ইউজার যদি কাস্টম নাম দেয়

    if not url:
        return "URL is required", 400

    try:
        # ভিডিও ডাউনলোড
        download_video(url, custom_name)

        # মেটাডেটা সংগ্রহ
        metadata = get_metadata(url)
        
        # কাস্টম নামের সাথে মেটাডেটা পাঠানো
        download_url = f'/downloads/{custom_name}.mp4'

        # ফাইল ডিলিট করার জন্য থ্রেড চালানো (১০ মিনিট পর ডিলিট হবে)
        filepath = os.path.join(download_folder, f"{custom_name}.mp4")
        delete_thread = threading.Thread(target=delete_file, args=(filepath,))
        delete_thread.start()

        # হোম পেজে ডাউনলোড লিঙ্ক দেখানো
        return render_template('index.html', download_url=download_url)

    except Exception as e:
        return str(e), 500

# ডাউনলোড ফাইল সার্ভিং
@app.route('/downloads/<filename>')
def download_file(filename):
    return send_from_directory(
        download_folder,
        filename,
        as_attachment=True  # এটি নিশ্চিত করবে যে ফাইলটি ব্রাউজারের মধ্যে ডাউনলোড হবে
    )

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify(status='OK'), 200
    
if __name__ == '__main__':
    app.run(host=os.getenv('FLASK_RUN_HOST', '0.0.0.0'), port=int(os.getenv('FLASK_RUN_PORT', 3000)))
