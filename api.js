const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// YouTube URL
const YOUTUBE_URL = 'https://www.youtube.com/live/xRPjKQtRXR8?si=XMz5dJgIRlBzFNSh';
const imagePath = path.join(__dirname, 'iss_image.jpg');

// Expressアプリケーションの作成
const app = express();
const port = 3000;

// 1秒ごとに画像を更新する処理
setInterval(() => {
    fetchImage();
}, 1000);

// 画像取得と更新を行う関数
async function fetchImage() {
    try {
        const output = imagePath;

        // yt-dlpとffmpegを使ってスクリーンショットを撮るコマンド
        const youtubeStreamCommand = `yt-dlp -f best -o - ${YOUTUBE_URL} | ffmpeg -i pipe:0 -vframes 1 -q:v 2 ${output}`;

        // コマンド実行
        exec(youtubeStreamCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }

            console.log('Screenshot updated successfully!');
        });
    } catch (error) {
        console.error('Error fetching or processing the image:', error);
    }
}

// 画像をAPI経由で返すエンドポイント
app.get('/image', (req, res) => {
    // 画像ファイルをレスポンスとして返す
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            res.status(500).send('Error reading image');
            return;
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(data);
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`API Server is running on http://localhost:${port}`);
});
