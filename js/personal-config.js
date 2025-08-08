// 个人信息配置文件
// 这里集中管理所有的个人信息，方便修改和维护

const PersonalConfig = {
    // 两个人的基本信息
    person1: {
        name: '王标',
        birthday: '2005-07-06',
        avatar: 'image/nan.jpg'
    },
    
    person2: {
        name: '张佩麟', 
        birthday: '2005-8-10',
        avatar: 'image/nv.jpg'
    },
    
    // 重要的纪念日期
    importantDates: {
        // 第一次相遇和确定关系（合并）
        firstMeet: {
            date: '2017-09-01',
            time: '13:14:00',
            title: '我们第一次相遇的坐标',
            description: '那一天，命运让我们相遇，从这一刻开始，我们的故事正式开始'
        }
    },
    
    // 网站配置
    siteConfig: {
        title: '朋友纪念日倒计时',
        backgroundImage: 'image/beijing-1.webp',
        themeColor: '#ff6b6b'
    }
};

// 导出配置对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalConfig;
} else {
    window.PersonalConfig = PersonalConfig;
}