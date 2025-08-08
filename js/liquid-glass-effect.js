// 液态玻璃效果实现 - 基于liquid-glass2.js改进
document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // === 工具函数 ===
  function pointToLineDistance(x, y, x1, y1, x2, y2) {
    // 线段向量
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    // 处理长度为0的线段
    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    // 计算距离
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 液态玻璃效果类
  class LiquidGlassEffect {
    constructor(element, options = {}) {
      this.element = element;
      this.options = Object.assign({
        maxDistanceFromEdge: 60,
        borderGlowOpacity: 0.8,
        lightIntensity: 0.3,
        borderWidth: 2
      }, options);
      
      this.init();
    }

    init() {
      // 添加必要的CSS类
      this.element.classList.add('glass-effect');
      
      // 保存原始样式
      this.originalStyle = {
        backgroundColor: window.getComputedStyle(this.element).backgroundColor,
        boxShadow: window.getComputedStyle(this.element).boxShadow
      };
      
      // 设置基础样式
      this.element.style.position = 'relative';
      this.element.style.overflow = 'hidden';
      this.element.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      this.element.style.backdropFilter = 'blur(15px) saturate(1.8)';
      this.element.style.WebkitBackdropFilter = 'blur(15px) saturate(1.8)';
      this.element.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
      // 移除边框，让高光效果在最外侧
      // this.element.style.border = `${this.options.borderWidth}px solid rgba(255, 255, 255, 0.2)`;
      
      // 添加CSS变量
      this.element.style.setProperty('--light-x', '50%');
      this.element.style.setProperty('--light-y', '50%');
      this.element.style.setProperty('--border-glow', '0');
      this.element.style.setProperty('--glow-position', '50%');
      
      // 创建边框高光元素
      this.createBorderGlows();
      
      // 添加内部高光
      this.addInnerLight();
      
      // 绑定事件
      this.bindEvents();
      
      // 设置静态效果
      this.setStaticEffect();
    }

    createBorderGlows() {
      // 创建玻璃边缘折射效果容器
      this.glassEdgeContainer = document.createElement('div');
      this.glassEdgeContainer.className = 'glass-edge-container';
      this.glassEdgeContainer.style.position = 'absolute';
      this.glassEdgeContainer.style.top = '0';
      this.glassEdgeContainer.style.left = '0';
      this.glassEdgeContainer.style.width = '100%';
      this.glassEdgeContainer.style.height = '100%';
      this.glassEdgeContainer.style.pointerEvents = 'none';
      this.glassEdgeContainer.style.borderRadius = 'inherit';
      this.glassEdgeContainer.style.overflow = 'hidden';
      
      // 创建100分区的边缘高光系统
      this.createSegmentedEdgeGlow();
      
      // 创建浮动阴影 - 更真实的投影效果
      this.floatingShadow = document.createElement('div');
      this.floatingShadow.className = 'floating-shadow';
      this.floatingShadow.style.position = 'absolute';
      this.floatingShadow.style.top = '100%';
      this.floatingShadow.style.left = '3%';
      this.floatingShadow.style.width = '94%';
      this.floatingShadow.style.height = '12px';
      this.floatingShadow.style.background = `
        radial-gradient(ellipse, 
          rgba(0, 0, 0, 0.15) 0%, 
          rgba(0, 0, 0, 0.12) 20%, 
          rgba(0, 0, 0, 0.08) 40%, 
          rgba(0, 0, 0, 0.04) 60%, 
          rgba(0, 0, 0, 0.02) 80%, 
          transparent 100%
        )
      `;
      this.floatingShadow.style.borderRadius = '50%';
      this.floatingShadow.style.opacity = '0';
      this.floatingShadow.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      this.floatingShadow.style.transform = 'translateY(2px) scaleY(0.8)';
      this.floatingShadow.style.filter = 'blur(2px)';
      
      this.element.appendChild(this.glassEdgeContainer);
      this.element.appendChild(this.floatingShadow);
      
      // 保存引用以便后续操作
      this.borderGlowContainer = this.glassEdgeContainer;
    }
    
    createSegmentedEdgeGlow() {
      const segmentCount = 100;
      const edgeWidth = 4;
      
      // 计算光源位置（最左上角为主光源）
      const lightSourceX = 0.0; // 0%位置（最左边）
      const lightSourceY = 0.0; // 0%位置（最上边）
      
      // 创建顶部边缘分区
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 计算距离光源的距离来确定亮度
        const distanceFromLight = Math.abs(progress - lightSourceX);
        const brightness = Math.max(0, 1 - distanceFromLight * 3); // 距离越近越亮
        
        // 平滑的亮度衰减曲线
        const smoothBrightness = Math.pow(brightness, 0.8) * 0.7;
        
        segment.style.position = 'absolute';
        segment.style.top = '0';
        segment.style.left = `${progress * 100}%`;
        segment.style.width = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.height = `${edgeWidth}px`;
        segment.style.background = `linear-gradient(180deg, 
          rgba(255, 255, 255, ${smoothBrightness}) 0%, 
          rgba(255, 255, 255, ${smoothBrightness * 0.6}) 40%, 
          rgba(255, 255, 255, ${smoothBrightness * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 创建左边缘分区
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 计算距离光源的距离来确定亮度
        const distanceFromLight = Math.abs(progress - lightSourceY);
        const brightness = Math.max(0, 1 - distanceFromLight * 3);
        
        // 平滑的亮度衰减曲线
        const smoothBrightness = Math.pow(brightness, 0.8) * 0.6;
        
        segment.style.position = 'absolute';
        segment.style.top = `${progress * 100}%`;
        segment.style.left = '0';
        segment.style.width = `${edgeWidth}px`;
        segment.style.height = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.background = `linear-gradient(90deg, 
          rgba(255, 255, 255, ${smoothBrightness}) 0%, 
          rgba(255, 255, 255, ${smoothBrightness * 0.6}) 40%, 
          rgba(255, 255, 255, ${smoothBrightness * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 创建右边缘分区（取消暗边效果，改为轻微高光）
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 右边缘改为轻微的高光效果，而不是阴影
        const lightIntensity = 0.02 + (1 - progress) * 0.01;
        
        segment.style.position = 'absolute';
        segment.style.top = `${progress * 100}%`;
        segment.style.right = '0';
        segment.style.width = `${edgeWidth - 1}px`;
        segment.style.height = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.background = `linear-gradient(270deg, 
          rgba(255, 255, 255, ${lightIntensity}) 0%, 
          rgba(255, 255, 255, ${lightIntensity * 0.6}) 40%, 
          rgba(255, 255, 255, ${lightIntensity * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 创建底部边缘分区（改为轻微高光效果）
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 底部改为轻微高光，中间稍亮，两边较暗
        const centerDistance = Math.abs(progress - 0.5) * 2;
        const lightIntensity = 0.015 * (1 - centerDistance * 0.3);
        
        segment.style.position = 'absolute';
        segment.style.bottom = '0';
        segment.style.left = `${progress * 100}%`;
        segment.style.width = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.height = `${edgeWidth - 1}px`;
        segment.style.background = `linear-gradient(0deg, 
          rgba(255, 255, 255, ${lightIntensity}) 0%, 
          rgba(255, 255, 255, ${lightIntensity * 0.6}) 40%, 
          rgba(255, 255, 255, ${lightIntensity * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 添加内部边框
      const innerBorder = document.createElement('div');
      innerBorder.style.position = 'absolute';
      innerBorder.style.top = '1px';
      innerBorder.style.left = '1px';
      innerBorder.style.width = 'calc(100% - 2px)';
      innerBorder.style.height = 'calc(100% - 2px)';
      innerBorder.style.borderRadius = 'inherit';
      innerBorder.style.border = '1px solid rgba(255, 255, 255, 0.1)';
      innerBorder.style.pointerEvents = 'none';
      
      this.glassEdgeContainer.appendChild(innerBorder);
    }

    addInnerLight() {
      // 添加多层次内部高光效果
      const innerGlow = document.createElement('div');
      innerGlow.style.position = 'absolute';
      innerGlow.style.top = '0';
      innerGlow.style.left = '0';
      innerGlow.style.width = '100%';
      innerGlow.style.height = '100%';
      innerGlow.style.background = `
        radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
        linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%)
      `;
      innerGlow.style.pointerEvents = 'none';
      innerGlow.style.borderRadius = 'inherit';
      
      this.element.appendChild(innerGlow);
    }

    bindEvents() {
      // 添加鼠标和触摸事件支持
      this.element.addEventListener('mousedown', (e) => this.handlePressStart(e));
      this.element.addEventListener('mouseup', (e) => this.handlePressEnd(e));
      this.element.addEventListener('mouseleave', (e) => this.handlePressEnd(e));
      this.element.addEventListener('touchstart', (e) => this.handlePressStart(e));
      this.element.addEventListener('touchend', (e) => this.handlePressEnd(e));
      this.element.addEventListener('touchcancel', (e) => this.handlePressEnd(e));
      this.element.addEventListener('click', (e) => this.handleClick(e));
      
      // 长按相关变量
      this.pressTimer = null;
      this.isPressed = false;
      this.isLongPressed = false;
    }
    
    handlePressStart(e) {
      e.preventDefault();
      
      this.isPressed = true;
      this.isLongPressed = false;
      
      // 立即应用短按效果
      this.element.classList.add('liquid-glass-pressed');
      
      // 设置长按定时器
      this.pressTimer = setTimeout(() => {
        if (this.isPressed) {
          this.isLongPressed = true;
          this.element.classList.remove('liquid-glass-pressed');
          this.element.classList.add('liquid-glass-long-pressed');
        }
      }, 200); // 200ms后进入长按状态
    }
    
    handlePressEnd(e) {
      if (!this.isPressed) return;
      
      this.isPressed = false;
      
      // 清除长按定时器
      if (this.pressTimer) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
      }
      
      // 移除所有按压效果
      this.element.classList.remove('liquid-glass-pressed');
      this.element.classList.remove('liquid-glass-long-pressed');
      
      this.isLongPressed = false;
    }
    
    handleClick(e) {
      // 只有在非长按情况下才触发波纹效果
      if (this.isLongPressed) return;
      
      e.preventDefault();
      
      const rect = this.element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // 创建波纹效果
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.left = `${x}%`;
      ripple.style.top = `${y}%`;
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 30%, transparent 70%)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '1000';
      ripple.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      this.element.appendChild(ripple);
      
      // 触发动画
      requestAnimationFrame(() => {
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.opacity = '0';
      });
      
      // 清理波纹元素
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }
    
    createClickAnimation(event) {
      // 保留原有方法以兼容性
      this.handleClick(event);
    }

    // 移除鼠标移动处理函数，保持静态效果
     setStaticEffect() {
       // 设置静态的边框高光效果
       this.borderGlowContainer.style.opacity = '1';
       this.floatingShadow.style.opacity = '0.6';
       this.floatingShadow.style.transform = 'translateY(4px)';
     }
  }

  // 红色液态玻璃效果类（专门为照片墙按钮设计）
  class RedLiquidGlassEffect extends LiquidGlassEffect {
    constructor(element, options = {}) {
      super(element, Object.assign({
        maxDistanceFromEdge: 60,
        borderGlowOpacity: 0.8,
        lightIntensity: 0.3,
        borderWidth: 2
      }, options));
    }
    
    init() {
       // 添加必要的CSS类
       this.element.classList.add('glass-effect');
       
       // 保持原有样式，只添加液态玻璃效果，不改变位置和大小
       this.element.style.position = this.element.style.position || 'fixed';
       this.element.style.overflow = 'hidden';
       this.element.style.backgroundColor = 'rgba(255, 200, 200, 0.08)';
       this.element.style.backdropFilter = 'blur(15px) saturate(1.8)';
       this.element.style.WebkitBackdropFilter = 'blur(15px) saturate(1.8)';
       this.element.style.boxShadow = '0 8px 32px rgba(255, 107, 107, 0.4), 0 2px 16px rgba(255, 107, 107, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
       // 移除边框，让高光效果在最外侧
       // this.element.style.border = `${this.options.borderWidth}px solid rgba(255, 255, 255, 0.2)`;
       
       // 添加CSS变量
       this.element.style.setProperty('--light-x', '50%');
       this.element.style.setProperty('--light-y', '50%');
       this.element.style.setProperty('--border-glow', '0');
       this.element.style.setProperty('--glow-position', '50%');
       
       // 创建真实玻璃折射边缘高光
       this.createRealisticGlassEdges();
       
       // 添加红色内部高光
       this.addRedInnerLight();
       
       // 绑定事件
       this.bindEvents();
       
       // 设置静态效果
       this.setStaticEffect();
     }
    
    createRealisticGlassEdges() {
      // 创建玻璃边缘折射效果容器
      this.glassEdgeContainer = document.createElement('div');
      this.glassEdgeContainer.className = 'glass-edge-container';
      this.glassEdgeContainer.style.position = 'absolute';
      this.glassEdgeContainer.style.top = '0';
      this.glassEdgeContainer.style.left = '0';
      this.glassEdgeContainer.style.width = '100%';
      this.glassEdgeContainer.style.height = '100%';
      this.glassEdgeContainer.style.pointerEvents = 'none';
      this.glassEdgeContainer.style.borderRadius = 'inherit';
      this.glassEdgeContainer.style.overflow = 'hidden';
      
      // 创建红色主题的100分区边缘高光系统
      this.createRedSegmentedEdgeGlow();
      
      // 创建红色浮动阴影 - 更真实的投影效果
      this.floatingShadow = document.createElement('div');
      this.floatingShadow.className = 'floating-shadow';
      this.floatingShadow.style.position = 'absolute';
      this.floatingShadow.style.top = '100%';
      this.floatingShadow.style.left = '2%';
      this.floatingShadow.style.width = '96%';
      this.floatingShadow.style.height = '10px';
      this.floatingShadow.style.background = `
        radial-gradient(ellipse, 
          rgba(255, 107, 107, 0.18) 0%, 
          rgba(255, 107, 107, 0.14) 20%, 
          rgba(255, 107, 107, 0.1) 40%, 
          rgba(255, 107, 107, 0.06) 60%, 
          rgba(255, 107, 107, 0.03) 80%, 
          transparent 100%
        )
      `;
      this.floatingShadow.style.borderRadius = '50%';
      this.floatingShadow.style.opacity = '0';
      this.floatingShadow.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      this.floatingShadow.style.transform = 'translateY(1px) scaleY(0.7)';
      this.floatingShadow.style.filter = 'blur(1.5px)';
      
      this.element.appendChild(this.glassEdgeContainer);
      this.element.appendChild(this.floatingShadow);
      
      // 保存引用以便后续操作
      this.borderGlowContainer = this.glassEdgeContainer;
    }
    
    createRedSegmentedEdgeGlow() {
      const segmentCount = 100;
      const edgeWidth = 4;
      
      // 计算光源位置（最左上角为主光源）
      const lightSourceX = 0.0; // 0%位置（最左边）
      const lightSourceY = 0.0; // 0%位置（最上边）
      
      // 创建顶部边缘分区 - 红色主题
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 计算距离光源的距离来确定亮度
        const distanceFromLight = Math.abs(progress - lightSourceX);
        const brightness = Math.max(0, 1 - distanceFromLight * 3);
        
        // 平滑的亮度衰减曲线，红色主题稍微增强
        const smoothBrightness = Math.pow(brightness, 0.8) * 0.8;
        const redTint = smoothBrightness * 0.3;
        
        segment.style.position = 'absolute';
        segment.style.top = '0';
        segment.style.left = `${progress * 100}%`;
        segment.style.width = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.height = `${edgeWidth}px`;
        segment.style.background = `linear-gradient(180deg, 
          rgba(255, ${255 - redTint * 55}, ${255 - redTint * 55}, ${smoothBrightness}) 0%, 
          rgba(255, ${255 - redTint * 55}, ${255 - redTint * 55}, ${smoothBrightness * 0.6}) 40%, 
          rgba(255, ${255 - redTint * 55}, ${255 - redTint * 55}, ${smoothBrightness * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 创建左边缘分区 - 红色主题
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 计算距离光源的距离来确定亮度
        const distanceFromLight = Math.abs(progress - lightSourceY);
        const brightness = Math.max(0, 1 - distanceFromLight * 3);
        
        // 平滑的亮度衰减曲线，红色主题
        const smoothBrightness = Math.pow(brightness, 0.8) * 0.7;
        const redTint = smoothBrightness * 0.25;
        
        segment.style.position = 'absolute';
        segment.style.top = `${progress * 100}%`;
        segment.style.left = '0';
        segment.style.width = `${edgeWidth}px`;
        segment.style.height = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.background = `linear-gradient(90deg, 
          rgba(255, ${255 - redTint * 55}, ${255 - redTint * 55}, ${smoothBrightness}) 0%, 
          rgba(255, ${255 - redTint * 55}, ${255 - redTint * 55}, ${smoothBrightness * 0.6}) 40%, 
          rgba(255, ${255 - redTint * 55}, ${255 - redTint * 55}, ${smoothBrightness * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 创建右边缘分区（取消暗边效果，改为轻微高光）- 红色主题
      for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        const progress = i / (segmentCount - 1);
        
        // 右边缘改为轻微的高光效果，而不是阴影
        const lightIntensity = 0.02 + (1 - progress) * 0.01;
        
        segment.style.position = 'absolute';
        segment.style.top = `${progress * 100}%`;
        segment.style.right = '0';
        segment.style.width = `${edgeWidth - 1}px`;
        segment.style.height = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
        segment.style.background = `linear-gradient(270deg, 
          rgba(255, 255, 255, ${lightIntensity}) 0%, 
          rgba(255, 255, 255, ${lightIntensity * 0.6}) 40%, 
          rgba(255, 255, 255, ${lightIntensity * 0.2}) 70%, 
          transparent 100%
        )`;
        segment.style.filter = 'blur(1px)';
        
        this.glassEdgeContainer.appendChild(segment);
      }
      
      // 创建底部边缘分区（改为轻微高光效果）- 红色主题
       for (let i = 0; i < segmentCount; i++) {
         const segment = document.createElement('div');
         const progress = i / (segmentCount - 1);
         
         // 底部改为轻微高光，中间稍亮，两边较暗
         const centerDistance = Math.abs(progress - 0.5) * 2;
         const lightIntensity = 0.015 * (1 - centerDistance * 0.3);
         
         segment.style.position = 'absolute';
         segment.style.bottom = '0';
         segment.style.left = `${progress * 100}%`;
         segment.style.width = `${100 / segmentCount + 0.01}%`; // 增加0.01%重叠
         segment.style.height = `${edgeWidth - 1}px`;
         segment.style.background = `linear-gradient(0deg, 
           rgba(255, 255, 255, ${lightIntensity}) 0%, 
           rgba(255, 255, 255, ${lightIntensity * 0.6}) 40%, 
           rgba(255, 255, 255, ${lightIntensity * 0.2}) 70%, 
           transparent 100%
         )`;
         segment.style.filter = 'blur(1px)';
         
         this.glassEdgeContainer.appendChild(segment);
       }
      
      // 添加内部边框 - 红色主题
      const innerBorder = document.createElement('div');
      innerBorder.style.position = 'absolute';
      innerBorder.style.top = '1px';
      innerBorder.style.left = '1px';
      innerBorder.style.width = 'calc(100% - 2px)';
      innerBorder.style.height = 'calc(100% - 2px)';
      innerBorder.style.borderRadius = 'inherit';
      innerBorder.style.border = '1px solid rgba(255, 220, 220, 0.12)';
      innerBorder.style.pointerEvents = 'none';
      
      this.glassEdgeContainer.appendChild(innerBorder);
    }
    
    addRedInnerLight() {
      // 添加红色主题的多层次内部高光效果
      const innerGlow = document.createElement('div');
      innerGlow.style.position = 'absolute';
      innerGlow.style.top = '0';
      innerGlow.style.left = '0';
      innerGlow.style.width = '100%';
      innerGlow.style.height = '100%';
      innerGlow.style.background = `
        radial-gradient(ellipse at 20% 20%, rgba(255, 200, 200, 0.18) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(255, 150, 150, 0.10) 0%, transparent 40%),
        linear-gradient(135deg, rgba(255, 220, 220, 0.12) 0%, transparent 30%)
      `;
      innerGlow.style.pointerEvents = 'none';
      innerGlow.style.borderRadius = 'inherit';
      
      this.element.appendChild(innerGlow);
    }
    
    bindEvents() {
      // 添加鼠标和触摸事件支持
      this.element.addEventListener('mousedown', (e) => this.handlePressStart(e));
      this.element.addEventListener('mouseup', (e) => this.handlePressEnd(e));
      this.element.addEventListener('mouseleave', (e) => this.handlePressEnd(e));
      this.element.addEventListener('touchstart', (e) => this.handlePressStart(e));
      this.element.addEventListener('touchend', (e) => this.handlePressEnd(e));
      this.element.addEventListener('touchcancel', (e) => this.handlePressEnd(e));
      this.element.addEventListener('click', (e) => this.handleClick(e));
      
      // 长按相关变量
      this.pressTimer = null;
      this.isPressed = false;
      this.isLongPressed = false;
    }
    
    handlePressStart(e) {
      e.preventDefault();
      
      this.isPressed = true;
      this.isLongPressed = false;
      
      // 立即应用短按效果
      this.element.classList.add('liquid-glass-pressed');
      
      // 设置长按定时器
      this.pressTimer = setTimeout(() => {
        if (this.isPressed) {
          this.isLongPressed = true;
          this.element.classList.remove('liquid-glass-pressed');
          this.element.classList.add('liquid-glass-long-pressed');
        }
      }, 200); // 200ms后进入长按状态
    }
    
    handlePressEnd(e) {
      if (!this.isPressed) return;
      
      this.isPressed = false;
      
      // 清除长按定时器
      if (this.pressTimer) {
        clearTimeout(this.pressTimer);
        this.pressTimer = null;
      }
      
      // 移除所有按压效果
      this.element.classList.remove('liquid-glass-pressed');
      this.element.classList.remove('liquid-glass-long-pressed');
      
      this.isLongPressed = false;
    }
    
    handleClick(e) {
      // 只有在非长按情况下才触发波纹效果
      if (this.isLongPressed) return;
      
      e.preventDefault();
      
      const rect = this.element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // 创建红色主题的波纹效果
      const ripple = document.createElement('div');
      ripple.style.position = 'absolute';
      ripple.style.left = `${x}%`;
      ripple.style.top = `${y}%`;
      ripple.style.width = '0';
      ripple.style.height = '0';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'radial-gradient(circle, rgba(255, 200, 200, 0.7) 0%, rgba(255, 150, 150, 0.4) 30%, transparent 70%)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '1000';
      ripple.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      this.element.appendChild(ripple);
      
      // 触发动画
      requestAnimationFrame(() => {
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.opacity = '0';
      });
      
      // 清理波纹元素
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    }
    
    createRedClickAnimation(event) {
      // 保留原有方法以兼容性
      this.handleClick(event);
    }
  }

  // 应用液态玻璃效果到指定元素
  function applyLiquidGlassEffect() {
    // 1. 中间的个人信息区域
    const middleBlurkg = document.querySelector('.middle.Blurkg');
    if (middleBlurkg) {
      new LiquidGlassEffect(middleBlurkg, {
        maxDistanceFromEdge: 160, // 增大到原来的两倍
        borderGlowOpacity: 1.0, // 增大亮度
        lightIntensity: 0.4
      });
    }
    
    // 2. 两个名字标签
    const shadowBlurs = document.querySelectorAll('.shadow-blur');
    shadowBlurs.forEach(element => {
      new LiquidGlassEffect(element, {
        maxDistanceFromEdge: 80, // 增大到原来的两倍
        borderGlowOpacity: 0.9, // 增大亮度
        lightIntensity: 0.25,
        borderWidth: 2
      });
    });
    
    // 3. 前两个时间卡片
    const timeCards = document.querySelectorAll('.time_card');
    if (timeCards.length >= 2) {
      new LiquidGlassEffect(timeCards[0], {
        maxDistanceFromEdge: 120, // 增大到原来的两倍
        borderGlowOpacity: 0.9, // 增大亮度
        lightIntensity: 0.35
      });
      
      new LiquidGlassEffect(timeCards[1], {
        maxDistanceFromEdge: 120, // 增大到原来的两倍
        borderGlowOpacity: 0.9, // 增大亮度
        lightIntensity: 0.35
      });
    }
    
    // 4. 照片墙按钮（红色液态玻璃效果）
    // 延迟应用，确保照片墙按钮已经创建
    setTimeout(() => {
      const galleryBtn = document.querySelector('.gallery-btn');
      if (galleryBtn) {
        new RedLiquidGlassEffect(galleryBtn, {
          maxDistanceFromEdge: 60,
          borderGlowOpacity: 0.8,
          lightIntensity: 0.4,
          borderWidth: 2
        });
      }
    }, 2000); // 延迟2秒，确保照片墙按钮已创建
  }

  // 页面加载完成后应用效果
  window.addEventListener('load', applyLiquidGlassEffect);
})();