// 照片墙组件
function createPhotoGallery() {
    // 创建照片墙按钮
    const galleryBtn = document.createElement('div');
    galleryBtn.className = 'gallery-btn';
    galleryBtn.innerHTML = '<span>照片墙</span>';
    document.body.appendChild(galleryBtn);
    
    // 创建照片墙容器
    const galleryContainer = document.createElement('div');
    galleryContainer.className = 'photo-gallery-container';
    galleryContainer.innerHTML = `
        <div class="gallery-header">
            <h3>我们的美好回忆</h3>
            <button class="close-gallery">×</button>
        </div>
        <div class="gallery-content">
            <div class="photo-grid">
                <!-- 默认照片 -->
                <div class="photo-item" data-date="2023-05-10">
                    <img src="image/nan.jpg" alt="照片1">
                    <div class="photo-caption">男生头像</div>
                </div>
                <div class="photo-item" data-date="2023-06-15">
                    <img src="image/nv.jpg" alt="照片2">
                    <div class="photo-caption">女生头像</div>
                </div>
                <div class="photo-item" data-date="2023-07-20">
                    <img src="image/photo1.jpg" alt="照片3">
                    <div class="photo-caption">美好时光</div>
                </div>
                <div class="photo-item" data-date="2023-08-05">
                    <img src="image/photo2.jpg" alt="照片4">
                    <div class="photo-caption">甜蜜瞬间</div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(galleryContainer);
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .gallery-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(255, 107, 107, 0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 90;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .gallery-btn:hover {
            background-color: rgba(255, 107, 107, 1);
            transform: scale(1.05);
        }
        
        .photo-gallery-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 80%;
            max-width: 800px;
            height: 80%;
            background-color: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s ease;
        }
        
        .photo-gallery-container.active {
            opacity: 1;
            pointer-events: all;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .gallery-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .gallery-header h3 {
            color: white;
            margin: 0;
        }
        
        .close-gallery {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }
        
        .gallery-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
        }
        
        .photo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .photo-item {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.5s ease;
            cursor: pointer;
            animation: fadeInUp 0.8s ease forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        
        .photo-item:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 8px 16px rgba(255, 107, 107, 0.4);
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .photo-item:nth-child(1) { animation-delay: 0.1s; }
        .photo-item:nth-child(2) { animation-delay: 0.3s; }
        .photo-item:nth-child(3) { animation-delay: 0.5s; }
        .photo-item:nth-child(4) { animation-delay: 0.7s; }
        
        .photo-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }
        
        .photo-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            font-size: 12px;
            text-align: center;
        }
        
        .gallery-footer {
            padding: 15px 20px;
            border-top: 1px solid rgba(255,255,255,0.1);
            text-align: center;
        }
        
        #add-photo-btn {
            background-color: rgba(255, 107, 107, 0.8);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        #add-photo-btn:hover {
            background-color: rgba(255, 107, 107, 1);
        }
        
        @media (max-width: 767px) {
            .gallery-btn {
                top: 10px;
                right: 10px;
                padding: 5px 10px;
                font-size: 12px;
            }
            
            .photo-gallery-container {
                width: 90%;
                height: 90%;
            }
            
            .photo-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 10px;
            }
            
            .photo-item img {
                height: 100px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加事件监听
    galleryBtn.addEventListener('click', function() {
        galleryContainer.classList.add('active');
    });
    
    const closeBtn = galleryContainer.querySelector('.close-gallery');
    closeBtn.addEventListener('click', function() {
        galleryContainer.classList.remove('active');
    });
    
    // 照片点击放大查看
    const photoItems = galleryContainer.querySelectorAll('.photo-item');
    photoItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.photo-caption').textContent;
            const date = this.getAttribute('data-date');
            
            showEnlargedPhoto(img.src, caption, date);
        });
    });
    
    // 为照片添加动态轮播效果
    let currentIndex = 0;
    
    // 每隔5秒切换一次高亮照片
    setInterval(() => {
        photoItems.forEach(item => item.classList.remove('highlight'));
        photoItems[currentIndex].classList.add('highlight');
        currentIndex = (currentIndex + 1) % photoItems.length;
    }, 5000);
    
    // 添加高亮照片的样式
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
        .photo-item.highlight {
            transform: scale(1.08) translateY(-8px);
            box-shadow: 0 12px 24px rgba(255, 107, 107, 0.6);
            z-index: 2;
        }
    `;
    document.head.appendChild(highlightStyle);
}

// 显示放大的照片
function showEnlargedPhoto(src, caption, date) {
    if (!document.querySelector('.photo-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        
        const enlargedImg = document.createElement('img');
        enlargedImg.src = src;
        enlargedImg.className = 'enlarged-photo';
        
        const infoContainer = document.createElement('div');
        infoContainer.className = 'enlarged-photo-info';
        infoContainer.innerHTML = `
            <div class="enlarged-photo-caption">${caption}</div>
            <div class="enlarged-photo-date">${date}</div>
        `;
        
        overlay.appendChild(enlargedImg);
        overlay.appendChild(infoContainer);
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            enlargedImg.style.transform = 'scale(1)';
        }, 10);
        
        overlay.addEventListener('click', function() {
            this.style.opacity = '0';
            enlargedImg.style.transform = 'scale(0.5)';
            setTimeout(() => {
                document.body.removeChild(this);
            }, 300);
        });
        
        // 添加额外样式
        const style = document.createElement('style');
        style.textContent = `
            .photo-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .enlarged-photo {
                max-width: 80%;
                max-height: 70vh;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
                transform: scale(0.5);
                transition: transform 0.3s ease;
            }
            
            .enlarged-photo-info {
                color: white;
                text-align: center;
                margin-top: 15px;
                background-color: rgba(0, 0, 0, 0.5);
                padding: 10px 20px;
                border-radius: 20px;
                backdrop-filter: blur(5px);
            }
            
            .enlarged-photo-caption {
                font-size: 18px;
                font-weight: bold;
            }
            
            .enlarged-photo-date {
                font-size: 14px;
                color: #ccc;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化照片墙
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(createPhotoGallery, 1500); // 延迟加载，确保其他效果先加载
});