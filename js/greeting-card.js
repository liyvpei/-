// 祝福卡片功能
function initGreetingCard() {
    // 创建祝福卡片按钮
    const greetingBtn = document.createElement('div');
    greetingBtn.className = 'greeting-btn';
    greetingBtn.innerHTML = '<span>祝福卡片</span>';
    document.body.appendChild(greetingBtn);
    
    // 创建祝福卡片容器
    const greetingContainer = document.createElement('div');
    greetingContainer.className = 'greeting-container';
    greetingContainer.innerHTML = `
        <div class="greeting-header">
            <h3>创建你的祝福卡片</h3>
            <button class="close-greeting">×</button>
        </div>
        <div class="greeting-content">
            <div class="greeting-form">
                <div class="form-group">
                    <label for="greeting-text">祝福语</label>
                    <textarea id="greeting-text" placeholder="写下你的祝福..." maxlength="100"></textarea>
                </div>
                <div class="form-group">
                    <label>卡片背景</label>
                    <div class="background-options">
                        <div class="bg-option" data-bg="#ff6b6b" style="background-color: #ff6b6b;"></div>
                        <div class="bg-option" data-bg="#48dbfb" style="background-color: #48dbfb;"></div>
                        <div class="bg-option" data-bg="#1dd1a1" style="background-color: #1dd1a1;"></div>
                        <div class="bg-option" data-bg="#f368e0" style="background-color: #f368e0;"></div>
                    </div>
                </div>
                <div class="form-group">
                    <label>卡片样式</label>
                    <div class="style-options">
                        <div class="style-option" data-style="hearts">❤️</div>
                        <div class="style-option" data-style="stars">⭐</div>
                        <div class="style-option" data-style="flowers">🌸</div>
                        <div class="style-option" data-style="balloons">🎈</div>
                    </div>
                </div>
                <button id="create-card-btn">创建卡片</button>
            </div>
            <div class="greeting-preview">
                <div class="preview-title">预览</div>
                <div class="card-preview" id="card-preview">
                    <div class="card-content">
                        <div class="card-text">写下你的祝福...</div>
                        <div class="card-decoration"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(greetingContainer);
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .greeting-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: rgba(255, 107, 107, 0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            z-index: 90;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        .greeting-btn:hover {
            background-color: rgba(255, 107, 107, 1);
            transform: scale(1.05);
        }
        
        .greeting-container {
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
            color: white;
        }
        
        .greeting-container.active {
            opacity: 1;
            pointer-events: all;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .greeting-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .greeting-header h3 {
            margin: 0;
        }
        
        .close-greeting {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }
        
        .greeting-content {
            flex: 1;
            display: flex;
            padding: 20px;
            overflow: auto;
        }
        
        .greeting-form {
            flex: 1;
            padding-right: 20px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        #greeting-text {
            width: 100%;
            height: 100px;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid rgba(255,255,255,0.2);
            background-color: rgba(255,255,255,0.1);
            color: white;
            resize: none;
        }
        
        .background-options, .style-options {
            display: flex;
            gap: 10px;
        }
        
        .bg-option {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.3s ease;
            border: 2px solid transparent;
        }
        
        .bg-option.selected {
            border-color: white;
            transform: scale(1.1);
        }
        
        .style-option {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(255,255,255,0.1);
            border-radius: 50%;
            cursor: pointer;
            transition: transform 0.3s ease;
            border: 2px solid transparent;
        }
        
        .style-option.selected {
            border-color: white;
            transform: scale(1.1);
        }
        
        #create-card-btn {
            background-color: rgba(255, 107, 107, 0.8);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 100%;
            margin-top: 10px;
        }
        
        #create-card-btn:hover {
            background-color: rgba(255, 107, 107, 1);
        }
        
        .greeting-preview {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .preview-title {
            margin-bottom: 10px;
            font-weight: bold;
        }
        
        .card-preview {
            width: 100%;
            height: 300px;
            background-color: #ff6b6b;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .card-content {
            padding: 20px;
            text-align: center;
            z-index: 2;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .card-text {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            color: white;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }
        
        .card-decoration {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
        }
        
        .shared-card-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .shared-card-container {
            width: 80%;
            max-width: 500px;
            background-color: rgba(0,0,0,0.5);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
        }
        
        .shared-card {
            width: 100%;
            height: 300px;
            border-radius: 10px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .shared-card-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        
        .shared-card-actions button {
            background-color: rgba(255, 107, 107, 0.8);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .shared-card-actions button:hover {
            background-color: rgba(255, 107, 107, 1);
        }
        
        @media (max-width: 767px) {
            .greeting-btn {
                top: 10px;
                left: 10px;
                padding: 5px 10px;
                font-size: 12px;
            }
            
            .greeting-container {
                width: 95%;
                height: 90%;
            }
            
            .greeting-content {
                flex-direction: column;
            }
            
            .greeting-form {
                padding-right: 0;
                margin-bottom: 20px;
            }
            
            .card-preview {
                height: 200px;
            }
            
            .shared-card {
                height: 200px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加事件监听
    greetingBtn.addEventListener('click', function() {
        greetingContainer.classList.add('active');
    });
    
    const closeBtn = greetingContainer.querySelector('.close-greeting');
    closeBtn.addEventListener('click', function() {
        greetingContainer.classList.remove('active');
    });
    
    // 背景选择
    const bgOptions = greetingContainer.querySelectorAll('.bg-option');
    bgOptions.forEach(option => {
        option.addEventListener('click', function() {
            bgOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const bg = this.getAttribute('data-bg');
            document.getElementById('card-preview').style.backgroundColor = bg;
        });
    });
    
    // 默认选中第一个背景
    bgOptions[0].classList.add('selected');
    
    // 样式选择
    const styleOptions = greetingContainer.querySelectorAll('.style-option');
    let selectedStyle = '';
    
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            selectedStyle = this.getAttribute('data-style');
            updateCardDecoration(selectedStyle);
        });
    });
    
    // 文本输入更新预览
    const greetingText = document.getElementById('greeting-text');
    greetingText.addEventListener('input', function() {
        document.querySelector('.card-text').textContent = this.value || '写下你的祝福...';
    });
    
    // 更新卡片装饰
    function updateCardDecoration(style) {
        const decoration = document.querySelector('.card-decoration');
        decoration.innerHTML = '';
        
        if (!style) return;
        
        const elements = [];
        const count = 20;
        
        let symbol = '❤️';
        if (style === 'stars') symbol = '⭐';
        if (style === 'flowers') symbol = '🌸';
        if (style === 'balloons') symbol = '🎈';
        
        for (let i = 0; i < count; i++) {
            const element = document.createElement('div');
            element.className = 'decoration-element';
            element.textContent = symbol;
            element.style.position = 'absolute';
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.opacity = '0.7';
            element.style.fontSize = `${Math.random() * 20 + 10}px`;
            element.style.transform = `rotate(${Math.random() * 360}deg)`;
            element.style.pointerEvents = 'none';
            
            decoration.appendChild(element);
            elements.push(element);
        }
        
        // 添加动画
        elements.forEach(el => {
            const duration = 3 + Math.random() * 4;
            const delay = Math.random() * 2;
            
            el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        });
        
        // 添加动画关键帧
        if (!document.getElementById('decoration-keyframes')) {
            const keyframes = document.createElement('style');
            keyframes.id = 'decoration-keyframes';
            keyframes.textContent = `
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 20}deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
            `;
            document.head.appendChild(keyframes);
        }
    }
    
    // 创建卡片按钮
    const createCardBtn = document.getElementById('create-card-btn');
    createCardBtn.addEventListener('click', function() {
        const text = greetingText.value || '写下你的祝福...';
        const bgColor = document.querySelector('.bg-option.selected').getAttribute('data-bg');
        const style = selectedStyle;
        
        if (!text.trim()) {
            alert('请输入祝福语!');
            return;
        }
        
        showSharedCard(text, bgColor, style);
        greetingContainer.classList.remove('active');
    });
}

// 显示分享的卡片
function showSharedCard(text, bgColor, style) {
    const overlay = document.createElement('div');
    overlay.className = 'shared-card-overlay';
    
    overlay.innerHTML = `
        <div class="shared-card-container">
            <div class="shared-card" style="background-color: ${bgColor};">
                <div class="card-content">
                    <div class="card-text">${text}</div>
                    <div class="card-decoration" data-style="${style}"></div>
                </div>
            </div>
            <div class="shared-card-actions">
                <button id="close-shared-card">关闭</button>
                <button id="save-shared-card">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
        
        // 更新装饰
        updateSharedCardDecoration(style);
    }, 10);
    
    // 关闭按钮
    const closeBtn = document.getElementById('close-shared-card');
    closeBtn.addEventListener('click', function() {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });
    
    // 保存按钮 - 使用html2canvas库将卡片保存为图片
    const saveBtn = document.getElementById('save-shared-card');
    saveBtn.addEventListener('click', function() {
        if (typeof html2canvas !== 'undefined') {
            const card = document.querySelector('.shared-card');
            html2canvas(card).then(canvas => {
                const link = document.createElement('a');
                link.download = '祝福卡片.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            // 如果没有加载html2canvas库，加载后再保存
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = function() {
                const card = document.querySelector('.shared-card');
                html2canvas(card).then(canvas => {
                    const link = document.createElement('a');
                    link.download = '祝福卡片.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            };
            document.head.appendChild(script);
        }
    });
}

// 更新分享卡片的装饰
function updateSharedCardDecoration(style) {
    const decoration = document.querySelector('.shared-card .card-decoration');
    if (!decoration) return;
    
    decoration.innerHTML = '';
    
    if (!style) return;
    
    const elements = [];
    const count = 20;
    
    let symbol = '❤️';
    if (style === 'stars') symbol = '⭐';
    if (style === 'flowers') symbol = '🌸';
    if (style === 'balloons') symbol = '🎈';
    
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        element.className = 'decoration-element';
        element.textContent = symbol;
        element.style.position = 'absolute';
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.opacity = '0.7';
        element.style.fontSize = `${Math.random() * 20 + 10}px`;
        element.style.transform = `rotate(${Math.random() * 360}deg)`;
        element.style.pointerEvents = 'none';
        
        decoration.appendChild(element);
        elements.push(element);
    }
    
    // 添加动画
    elements.forEach(el => {
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        
        el.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// 页面加载完成后初始化祝福卡片功能
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(initGreetingCard, 2000); // 延迟加载，确保其他效果先加载
});