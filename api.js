const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Expressアプリケーションのセットアップ
const app = express();
const port = 3000;

// YouTubeライブストリームのURL
const YOUTUBE_URL = 'https://www.youtube.com/live/xRPjKQtRXR8?si=XMz5dJgIRlBzFNSh';  // 最新のURL

// スクリーンショットを保存するディレクトリ
const screenshotDir = './screenshots';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
}

// 画像を保存するファイル名を生成
function generateImageFileName() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // ISO形式のタイムスタンプ
    return path.join(screenshotDir, `iss_image_${timestamp}.jpg`);
}

// 1秒ごとにスクリーンショットをキャプチャ
function captureScreenshot() {
    const outputFile = generateImageFileName();

    // 古い画像を削除
    fs.readdir(screenshotDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(file => {
            const filePath = path.join(screenshotDir, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        });
    });

    // YouTubeのライブストリームURLを直接処理
    const youtubeStreamCommand = `yt-dlp -f best -o - ${YOUTUBE_URL} | ffmpeg -i pipe:0 -vframes 1 -q:v 2 ${output
