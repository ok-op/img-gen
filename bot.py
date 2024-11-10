from flask import Flask, request, render_template, send_from_directory, jsonify
import os
import yt_dlp

app = Flask(__name__)

# ডাউনলোড ফোল্ডার তৈরি করা
download_folder = 'downloads'
if not os.path.exists(download_folder):
    os.makedirs(download_folder)

# ভিডিও ডাউনলোড করার ফাংশন
def download_video(url, custom_name="downloaded_video"):
    # yt-dlp কনফিগারেশন
    ydl_opts = {
    'format': 'bestvideo+bestaudio/best',
    'outtmpl': os.path.join(download_folder, f'{custom_name}.%(ext)s'),
    'cookiefile': 'cookies.txt',  # কুকি ফাইলের পথ
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# মেটাডেটা সংগ্রহ করা
def get_metadata(url):
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,  # মেটাডেটা ছাড়া শুধুমাত্র ভিডিও তথ্য নেয়
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=False)
        return info_dict

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

        # হোম পেজে ডাউনলোড লিঙ্ক দেখানো
        return render_template('index.html', download_url=download_url)

    except Exception as e:
        return str(e), 500

# ডাউনলোড ফাইল সার্ভিং
@app.route('/downloads/<filename>')
def download_file(filename):
    return send_from_directory(download_folder, filename)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
