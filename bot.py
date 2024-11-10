from flask import Flask, request, render_template, send_from_directory, redirect, url_for
import os
import yt_dlp

app = Flask(__name__)

# ডাউনলোড ফোল্ডার তৈরি করা
download_folder = 'downloads'
if not os.path.exists(download_folder):
    os.makedirs(download_folder)

# ভিডিও ডাউনলোড করার ফাংশন
def download_video(url, custom_name="downloaded_video"):
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'outtmpl': os.path.join(download_folder, f'{custom_name}.%(ext)s'),
        'cookiefile': 'cookies.txt',
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

# হোম পেজ রেন্ডার করা
@app.route('/download', methods=['GET'])
def download():
    url = request.args.get('url')
    custom_name = request.args.get('name', 'downloaded_video') 

    if not url:
        return "URL is required", 400

    try:
        # ভিডিও ডাউনলোড করা
        download_video(url, custom_name)

        # ডাউনলোড ফাইল রিডিরেক্ট লিংক
        return redirect(url_for('download_file', filename=f"{custom_name}.mp4"))

    except Exception as e:
        return str(e), 500

# ডাউনলোড ফাইল সার্ভিং
@app.route('/downloads/<filename>')
def download_file(filename):
    return send_from_directory(download_folder, filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, port=3000)
