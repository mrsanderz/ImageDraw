// DOM 元素
const imageContainer = document.getElementById('image-container');
const randomImage = document.getElementById('random-image');
const drawButton = document.getElementById('draw-button');
const loadingText = document.getElementById('loading-text');
const imageInfo = document.getElementById('image-info');

// GitHub 儲存庫資訊
const GITHUB_USER = 'mrsanderz';
const GITHUB_REPO = 'ImgRepo';

// 存放所有圖片 URL 的陣列
let imageUrls = [];

// 使用 GitHub API 獲取圖片列表
async function fetchImagesFromRepo() {
    // API URL 指向儲存庫的根目錄內容
    const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`GitHub API 請求失敗: ${response.status}`);
        }
        const data = await response.json();

        // 過濾出圖片檔案 (jpg, jpeg, png, gif)
        imageUrls = data
            .filter(file => /\.(jpe?g|png|gif)$/i.test(file.name))
            .map(file => file.download_url); // 取得可直接使用的圖片 URL

        if (imageUrls.length > 0) {
            console.log(`成功載入 ${imageUrls.length} 張圖片`);
            // 啟用按鈕
            drawButton.disabled = false;
            drawButton.textContent = '抽一張！';
            loadingText.style.display = 'none'; // 隱藏載入文字
        } else {
            loadingText.textContent = '圖庫中沒有找到支援的圖片格式。';
        }

    } catch (error) {
        console.error('獲取圖片列表時發生錯誤:', error);
        loadingText.textContent = '無法載入圖片列表，請檢查主控台錯誤。';
    }
}

// 隨機抽一張圖片並顯示
function drawRandomImage() {
    if (imageUrls.length === 0) {
        alert('沒有可抽取的圖片！');
        return;
    }
    
    // 隱藏上一張圖片，準備顯示下一張
    randomImage.style.display = 'none';
    imageInfo.textContent = '';
    
    // 隨機選一個索引
    const randomIndex = Math.floor(Math.random() * imageUrls.length);
    const selectedImageUrl = imageUrls[randomIndex];
    
    // 取得檔案名稱
    const imageName = selectedImageUrl.split('/').pop();
    
    // 更新圖片來源
    randomImage.src = selectedImageUrl;
    randomImage.alt = imageName;
    
    // 當圖片載入完成後才顯示
    randomImage.onload = () => {
        randomImage.style.display = 'block';
        imageInfo.textContent = `檔名: ${imageName}`;
    };
}

// 監聽按鈕點擊事件
drawButton.addEventListener('click', drawRandomImage);

// 頁面載入時就開始獲取圖片列表
fetchImagesFromRepo();
