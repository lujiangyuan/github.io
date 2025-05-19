// 汉字练习数据
const characterData = [
    { character: '张', pinyin: 'zhāng' },
    { character: '熙', pinyin: 'xī' },
    { character: '晨', pinyin: 'chén' },
    { character: '爱', pinyin: 'ài' },
    { character: '家', pinyin: 'jiā' },
    { character: '好', pinyin: 'hǎo' }
];

// 拼音数据
const pinyinData = {
    shengmu: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'],
    yunmu: ['a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 'üe', 'er', 'an', 'en', 'in', 'un', 'ün', 'ang', 'eng', 'ing', 'ong']
};

// 初始化所有画布
function initializeCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // 设置画笔样式
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 触摸设备支持
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', () => isDrawing = false);

    // 鼠标支持
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    function handleStart(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPosition(e);
        [lastX, lastY] = [pos.x, pos.y];
    }

    function handleMove(e) {
        e.preventDefault();
        if (!isDrawing) return;
        
        const pos = getPosition(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        [lastX, lastY] = [pos.x, pos.y];
    }

    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        return { x, y };
    }

    return ctx;
}

// 初始化所有画布
document.querySelectorAll('canvas').forEach(canvas => {
    const ctx = initializeCanvas(canvas);
    const clearBtn = document.getElementById(canvas.id.replace('Canvas', 'Btn'));
    clearBtn.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

// 添加新字按钮功能
const nextBtn = document.getElementById('nextBtn');
if (nextBtn) {
    let currentIndex = 0;
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 3) % characterData.length;
        updateCharacters(currentIndex);
    });
}

function updateCharacters(startIndex) {
    const boxes = document.querySelectorAll('.character-box');
    boxes.forEach((box, i) => {
        const dataIndex = (startIndex + i) % characterData.length;
        const data = characterData[dataIndex];
        box.querySelector('.pinyin').textContent = data.pinyin;
        box.querySelector('.character').textContent = data.character;
        const canvas = box.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

// 初始化第一组字
updateCharacters(0);

// 初始化标签切换
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // 切换标签样式
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 切换内容区域
        const targetId = tab.dataset.tab === 'writing' ? 'writingArea' : 'pinyinArea';
        document.getElementById('writingArea').style.display = 
            targetId === 'writingArea' ? 'flex' : 'none';
        document.getElementById('pinyinArea').style.display = 
            targetId === 'pinyinArea' ? 'block' : 'none';
    });
});

// 标签页切换功能
const tabs = document.querySelectorAll('.tab');
const writingArea = document.getElementById('writingArea');
const pinyinArea = document.getElementById('pinyinArea');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 移除所有标签的active类
        tabs.forEach(t => t.classList.remove('active'));
        // 给当前点击的标签添加active类
        tab.classList.add('active');
        
        // 切换显示区域
        if (tab.dataset.tab === 'writing') {
            writingArea.style.display = 'block';
            pinyinArea.style.display = 'none';
        } else if (tab.dataset.tab === 'pinyin') {
            writingArea.style.display = 'none';
            pinyinArea.style.display = 'block';
        }
    });
});

// 初始化声母和韵母网格
function initializePinyinGrids() {
    const shengmuGrid = document.getElementById('shengmuGrid');
    const yunmuGrid = document.getElementById('yunmuGrid');

    // 清空现有内容
    shengmuGrid.innerHTML = '';
    yunmuGrid.innerHTML = '';

    // 添加声母
    pinyinData.shengmu.forEach(sm => {
        const div = document.createElement('div');
        div.className = 'pinyin-item';
        div.textContent = sm;
        div.addEventListener('click', () => playPinyinAudio(sm));
        shengmuGrid.appendChild(div);
    });

    // 添加韵母
    pinyinData.yunmu.forEach(ym => {
        const div = document.createElement('div');
        div.className = 'pinyin-item';
        div.textContent = ym;
        div.addEventListener('click', () => playPinyinAudio(ym));
        yunmuGrid.appendChild(div);
    });
}

// 播放拼音音频（这里可以集成实际的音频播放功能）
function playPinyinAudio(pinyin) {
    console.log(`播放拼音：${pinyin}`);
    // TODO: 集成实际的音频播放功能
}

// 初始化拼音练习区域
initializePinyinGrids();