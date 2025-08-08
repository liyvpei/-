// 粒子背景效果
function initParticles() {
    const particlesConfig = {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ff6b6b"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ff6b6b",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    };

    // 检查是否已加载particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', particlesConfig);
    } else {
        console.error('particles.js 未加载');
    }
}

// 照片悬浮动画
function initFloatingPhotos() {
    const avatars = document.querySelectorAll('.avatarArea');
    
    avatars.forEach(avatar => {
        // 添加悬浮效果
        avatar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        avatar.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        // 添加点击效果 - 放大照片
        avatar.addEventListener('click', function() {
            const img = this.querySelector('.aiv_touxiang');
            if (!document.querySelector('.photo-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'photo-overlay';
                
                const enlargedImg = document.createElement('img');
                enlargedImg.src = img.src;
                enlargedImg.className = 'enlarged-photo';
                
                overlay.appendChild(enlargedImg);
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
            }
        });
    });
}

// 音乐播放器功能已移除

// 心形特效增强
function enhanceHeartEffect() {
    const loveIcon = document.querySelector('.love-icon img');
    if (loveIcon) {
        // 增强心跳动画
        loveIcon.style.animation = 'heartbeat 1.2s ease-in-out infinite';
        
        // 添加点击效果 - 爆炸的小心形
        loveIcon.addEventListener('click', function(e) {
            for (let i = 0; i < 15; i++) {
                createHeart(e.clientX, e.clientY);
            }
        });
    }
}

// 创建小心形并添加动画
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'mini-heart';
    heart.innerHTML = '❤';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.color = getRandomColor();
    heart.style.transform = 'scale(' + (Math.random() * 0.6 + 0.5) + ')';
    
    document.body.appendChild(heart);
    
    // 随机角度和距离
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;
    
    // 应用动画
    setTimeout(() => {
        heart.style.left = destX + 'px';
        heart.style.top = destY + 'px';
        heart.style.opacity = '0';
    }, 10);
    
    // 移除元素
    setTimeout(() => {
        document.body.removeChild(heart);
    }, 1000);
}

// 获取随机颜色
function getRandomColor() {
    const colors = ['#ff6b6b', '#ff8e8e', '#ff4757', '#ff6b81', '#ff4d4d'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 添加打字机效果
function initTypewriterEffect() {
    const textElement = document.querySelector('.baiyi-text');
    if (textElement) {
        const originalText = textElement.textContent;
        textElement.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < originalText.length) {
                textElement.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
}

// 页面加载完成后初始化所有效果
window.addEventListener('DOMContentLoaded', function() {
    // 添加粒子背景容器
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-js';
    particlesContainer.className = 'particles-container';
    document.body.insertBefore(particlesContainer, document.body.firstChild);
    
    // 加载particles.js库
    const particlesScript = document.createElement('script');
    particlesScript.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    particlesScript.onload = function() {
        initParticles();
    };
    document.head.appendChild(particlesScript);
    
    // 初始化其他效果
    setTimeout(() => {
        initFloatingPhotos();
        enhanceHeartEffect();
        initTypewriterEffect();
    }, 1000);
});