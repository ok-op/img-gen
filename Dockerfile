# Step 1: Node.js ইমেজ থেকে বেজ ইমেজ তৈরি
FROM node:18

# Step 2: অ্যাপ্লিকেশনের জন্য কাজের ডিরেক্টরি সেট করা
WORKDIR /app

# Step 3: package.json এবং package-lock.json কপি করে ডিপেনডেন্সি ইনস্টল করা
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Step 4: অ্যাপ্লিকেশনের বাকি কোড কপি করা
COPY . .

# Step 5: yt-dlp বাইনারি ডাউনলোড করা এবং ffmpeg ইনস্টল করা (প্যাকেজ ব্যবহারের জন্য প্রয়োজনীয়)
RUN apt-get update && apt-get install -y ffmpeg

# Step 6: অ্যাপটি যে পোর্টে চলবে তা এক্সপোজ করা
EXPOSE 3000

# Step 7: অ্যাপ্লিকেশন চালু করা
CMD ["node", "index.js"]
