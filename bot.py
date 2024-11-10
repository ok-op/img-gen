from flask import Flask, request, render_template, send_file, jsonify
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
        'format': 'best',
        'outtmpl': os.path.join(download_folder, f'{custom_name}.%(ext)s'),
        'cookiefile': 'cookies.txt',  # কুকি ফাইলের পথ
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    # ফাইল পাথ রিটার্ন করা
    return os.path.join(download_folder, f'{custom_name}.mp4')

# ডাউনলোড রুট
@app.route('/download', methods=['GET'])
def download():
    url = request.args.get('url')
    custom_name = request.args.get('name', 'downloaded_video')  # ইউজার যদি কাস্টম নাম দেয়

    if not url:
        return "URL is required", 400

    try:
        # ভিডিও ডাউনলোড এবং ফাইল পাথ সংগ্রহ
        file_path = download_video(url, custom_name)

        # ফাইলটি ডাউনলোড হিসেবে রিটার্ন করা
        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
