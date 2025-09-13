const cases = [
    {
        id: 1,
        name: "Классический кейс",
        cost: 100,
        image: "images/classic.webp",
        items: [
            { id: 1, name: "Heart", rarity: "common", value: 50, image: "images/heart.gif" },
            { id: 2, name: "Bear", rarity: "common", value: 30, image: "images/bear.gif" },
            { id: 3, name: "Gift", rarity: "rare", value: 150, image: "images/gift.gif" },
            { id: 4, name: "Cake", rarity: "epic", value: 300, image: "images/cake.gif" },
            { id: 5, name: "Ring", rarity: "legendary", value: 1000, image: "images/ring.gif" }
        ]
    },
    {
        id: 2,
        name: "Премиум кейс",
        cost: 500,
        image: "images/premium.webp",
        items: [
            { id: 6, name: "Cup", rarity: "common", value: 150, image: "images/cup.gif" },
            { id: 7, name: "Key", rarity: "rare", value: 200, image: "images/key.gif" },
            { id: 8, name: "Snoop Dog", rarity: "epic", value: 500, image: "images/snoop.gif" },
            { id: 9, name: "Vintage Cigar", rarity: "legendary", value: 1500, image: "images/cigar.gif" }
        ]
    },
    {
        id: 3,
        name: "Эпический кейс",
        cost: 250,
        image: "images/epiccase.webp",
        items: [
            { id: 10, name: "Wine", rarity: "common", value: 80, image: "images/wine.gif" },
            { id: 11, name: "Diamond", rarity: "rare", value: 120, image: "images/diamond.gif" },
            { id: 12, name: "Ice cream", rarity: "epic", value: 400, image: "images/ice.gif" },
            { id: 13, name: "Snoop Dog", rarity: "legendary", value: 1200, image: "images/snoop.gif" }
        ]
    },
    {
        id: 4,
        name: "Легендарный кейс",
        cost: 1000,
        image: "images/legendcase.webp",
        items: [
            { id: 14, name: "Snoop Dog", rarity: "common", value: 500, image: "images/snoop.gif" },
            { id: 15, name: "Low Rider", rarity: "rare", value: 300, image: "images/low.gif" },
            { id: 16, name: "Westside Sign", rarity: "epic", value: 800, image: "images/sign.gif" },
            { id: 17, name: "Plush Pepe", rarity: "legendary", value: 2000, image: "images/pepe.gif" }
        ]
    },
    {
        id: 5,
        name: "Базовый кейс",
        cost: 50,
        image: "images/basecase.png",
        items: [
            { id: 18, name: "Heart", rarity: "common", value: 20, image: "images/heart.gif" },
            { id: 19, name: "Bear", rarity: "common", value: 15, image: "images/bear.gif" },
            { id: 20, name: "Gift", rarity: "rare", value: 50, image: "images/gift.gif" },
            { id: 21, name: "Cuр", rarity: "epic", value: 200, image: "images/cup.gif" }
        ]
    },
    {
        id: 6,
        name: "VIP кейс",
        cost: 750,
        image: "images/vipcase.webp",
        items: [
            { id: 22, name: "Ring", rarity: "common", value: 200, image: "images/ring.gif" },
            { id: 23, name: "Snoop Dog", rarity: "rare", value: 250, image: "images/snoop.gif" },
            { id: 24, name: "Light Sword", rarity: "epic", value: 600, image: "images/sword.gif" },
            { id: 25, name: "Low Rider", rarity: "legendary", value: 1800, image: "images/low.gif" }
        ]
    },
    {
        id: 7,
        name: "Эксклюзивный кейс",
        cost: 300,
        image: "images/exlusivecase.webp",
        items: [
            { id: 26, name: "1 May", rarity: "common", value: 100, image: "images/may.gif" },
            { id: 27, name: "Medal", rarity: "rare", value: 150, image: "images/medal.gif" },
            { id: 28, name: "Cats in a heart", rarity: "epic", value: 350, image: "images/cats.gif" },
            { id: 29, name: "Brick", rarity: "legendary", value: 1000, image: "images/brick.gif" }
        ]
    }
];

let balance = 1000;
let starBalance = 0;
let inventory = [];
let selectedCase = null;
let isSpinning = false;
let multiplier = 1;
let lastBonusTime = 0;
let autoClickInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupParticleBackground();
    setupClicker();
    setupSpinButton();
});

function initializeGame() {
    updateBalance();
    updateStarBalance();
    renderCaseSelection();
    setupNavigation();
    setupDepositOptions();
    setupModal();
    updateMultiplier();
}

function updateBalance() {
    document.getElementById('coin-balance').textContent = balance;
}

function updateStarBalance() {
    document.getElementById('star-balance').textContent = starBalance;
    document.getElementById('clicker-star-count').textContent = starBalance;
}

function updateMultiplier() {
    document.getElementById('multiplier').textContent = multiplier + 'x';
}

function renderCaseSelection() {
    const caseGrid = document.getElementById('case-grid');
    caseGrid.innerHTML = '';
    cases.forEach(caseItem => {
        const caseCard = document.createElement('div');
        caseCard.classList.add('case-card');
        caseCard.innerHTML = `
            <img src="${caseItem.image}" alt="${caseItem.name}" onerror="this.src='images/fallback_case.png'">
            <h3>${caseItem.name}</h3>
            <p>Стоимость: ${caseItem.cost} монет</p>
        `;
        caseCard.addEventListener('click', () => selectCase(caseItem));
        caseGrid.appendChild(caseCard);
    });
}

function selectCase(caseItem) {
    selectedCase = caseItem;
    document.getElementById('selected-case-name').textContent = caseItem.name;
    document.getElementById('spin-cost').textContent = caseItem.cost;
    document.getElementById('roulette-nav').disabled = false;
    showWindow('roulette-window');
    renderRoulette(caseItem);
}

function renderRoulette(caseItem) {
    const rouletteItems = document.getElementById('roulette-items');
    const rouletteTrack = document.getElementById('roulette-track');
    rouletteItems.innerHTML = '';
    // Увеличиваем количество повторов для более длинной рулетки (15 раз)
    const repeatedItems = Array(15).fill(null).reduce((acc) => acc.concat(caseItem.items), []);
    const winIndexInCase = Math.floor(Math.random() * caseItem.items.length);
    const winItem = caseItem.items[winIndexInCase];
    const centerIndex = Math.floor(repeatedItems.length / 2);
    repeatedItems[centerIndex] = winItem;
    repeatedItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('roulette-item');
        itemElement.dataset.itemId = item.id;
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <span>${item.name}</span>
        `;
        rouletteItems.appendChild(itemElement);
    });
    const totalWidth = repeatedItems.length * 180; // Увеличен размер элемента
    rouletteTrack.style.width = `${totalWidth}px`;
    const containerWidth = document.querySelector('.roulette-outer-frame').offsetWidth;
    const centerOffset = -(centerIndex * 180) + (containerWidth / 2 - 90);
    rouletteItems.style.transform = `translateX(${centerOffset}px)`;
}

function spinRoulette(caseItem, winItem, winIndex) {
    if (isSpinning || balance < caseItem.cost || !caseItem || !caseItem.items.length) return;
    balance -= caseItem.cost;
    updateBalance();
    isSpinning = true;
    document.getElementById('spin-button').disabled = true;

    const spinSound = document.getElementById('spin-sound');
    spinSound.play().catch(() => {});

    const rouletteItems = document.getElementById('roulette-items');
    const roulette = document.getElementById('roulette');
    const itemWidth = 180;
    const spinBlocks = Math.floor(Math.random() * 15) + 25; // Более длинная и контролируемая прокрутка
    const offset = Math.floor(Math.random() * 100);
    const containerWidth = document.querySelector('.roulette-outer-frame').offsetWidth;
    const initialOffset = parseFloat(rouletteItems.style.transform.replace(/translateX\((.*)px\)/, '$1')) || (containerWidth / 2 - 90);
    const spinDistance = (winIndex + spinBlocks) * itemWidth + offset;
    const targetOffset = initialOffset - spinDistance;

    roulette.classList.add('spinning');
    rouletteItems.style.transition = 'transform 7s cubic-bezier(0.4, 0, 0.2, 1)'; // Плавная и реалистичная анимация
    rouletteItems.style.transform = `translateX(${targetOffset}px)`;

    setTimeout(() => {
        isSpinning = false;
        document.getElementById('spin-button').disabled = false;
        const winSound = document.getElementById('win-sound');
        winSound.play().catch(() => {});
        addToInventory(winItem);
        showWinModal(winItem);
        roulette.classList.remove('spinning');
        rouletteItems.style.transition = 'transform 1.5s ease-out';
        const centerOffset = -(winIndex * itemWidth) + (containerWidth / 2 - 90);
        rouletteItems.style.transform = `translateX(${centerOffset}px)`;
        const winItemElement = Array.from(rouletteItems.children)[winIndex % caseItem.items.length];
        if (winItemElement) {
            winItemElement.classList.add('winning');
            setTimeout(() => winItemElement.classList.remove('winning'), 4000);
        }
        renderRoulette(caseItem);
    }, 7500); // Соответствие длительности анимации
}

function getRandomItem(items) {
    if (!items || !items.length) return null;
    const totalValue = items.reduce((sum, item) => sum + (1000 / item.value), 0);
    let random = Math.random() * totalValue;
    for (const item of items) {
        random -= (1000 / item.value);
        if (random <= 0) return item;
    }
    return items[items.length - 1];
}

function addToInventory(item) {
    if (item) {
        inventory.push(item);
        renderInventory();
    }
}

function renderInventory() {
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = '';
    inventory.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('inventory-item');
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <span>${item.name}</span>
            <p>Цена продажи: ${Math.floor(item.value / 2)} монет</p>
            <button class="sell-button pulse" data-index="${index}">Продать</button>
        `;
        inventoryGrid.appendChild(itemElement);
    });
    document.querySelectorAll('.sell-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.dataset.index);
            showSellConfirmModal(index);
        });
    });
}

function showSellConfirmModal(index) {
    const item = inventory[index];
    const modal = document.getElementById('sell-confirm-modal');
    if (item && modal) {
        document.getElementById('sell-item').textContent = item.name;
        document.getElementById('sell-price').textContent = Math.floor(item.value / 2);
        modal.classList.remove('hidden');

        document.getElementById('confirm-sell').onclick = () => {
            balance += Math.floor(item.value / 2);
            inventory.splice(index, 1);
            updateBalance();
            renderInventory();
            modal.classList.add('hidden');
        };

        document.getElementById('cancel-sell').onclick = () => {
            modal.classList.add('hidden');
        };
    }
}

function setupNavigation() {
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', () => {
            const windowId = button.dataset.window;
            if (windowId !== 'roulette-window' || !button.disabled) {
                showWindow(windowId);
            }
        });
    });
}

function showWindow(windowId) {
    document.querySelectorAll('.window').forEach(window => {
        window.classList.add('hidden');
    });
    const targetWindow = document.getElementById(windowId);
    if (targetWindow) targetWindow.classList.remove('hidden');
}

function setupDepositOptions() {
    document.querySelectorAll('.deposit-option').forEach(button => {
        button.addEventListener('click', () => {
            const coins = parseInt(button.dataset.coins);
            const price = button.textContent.split(' - ')[1];
            showDepositConfirmModal(coins, price);
        });
    });
}

function showDepositConfirmModal(coins, price) {
    const modal = document.getElementById('deposit-confirm-modal');
    if (modal) {
        document.getElementById('deposit-amount').textContent = coins;
        document.getElementById('deposit-price').textContent = price;
        modal.classList.remove('hidden');

        document.getElementById('confirm-deposit').onclick = () => {
            balance += coins;
            updateBalance();
            modal.classList.add('hidden');
            showWindow('case-selection-window');
        };

        document.getElementById('cancel-deposit').onclick = () => {
            modal.classList.add('hidden');
        };
    }
}

function showWinModal(item) {
    const modal = document.getElementById('win-modal');
    if (modal && item) {
        document.getElementById('win-item').textContent = item.name;
        const preview = document.getElementById('win-item-preview');
        preview.innerHTML = `<img src="${item.image}" alt="${item.name}" style="width: 120px; height: 120px;" loading="lazy">`;
        modal.classList.remove('hidden');
    }
}

function setupModal() {
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            const winModal = document.getElementById('win-modal');
            if (winModal) winModal.classList.add('hidden');
        });
    }
}

function setupClicker() {
    const clickerObject = document.getElementById('clicker-object');
    const clickSound = document.getElementById('click-sound');
    const convertButton = document.getElementById('convert-button');
    const dailyBonusButton = document.getElementById('daily-bonus');

    if (clickerObject) {
        const handleClick = () => {
            const starsEarned = 1 * multiplier;
            starBalance += starsEarned;
            updateStarBalance();
            clickerObject.classList.add('clicked');
            if (clickSound) clickSound.play().catch(() => {});
            setTimeout(() => clickerObject.classList.remove('clicked'), 300);

            createClickParticles(clickerObject.getBoundingClientRect());
        };

        clickerObject.addEventListener('click', handleClick);
        clickerObject.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleClick();
        });
    }

    if (convertButton) {
        convertButton.addEventListener('click', () => {
            if (starBalance >= 100) {
                const coins = Math.floor(starBalance / 100) * 1000;
                starBalance -= Math.floor(starBalance / 100) * 100;
                balance += coins;
                updateBalance();
                updateStarBalance();
            }
        });
    }

    if (dailyBonusButton) {
        dailyBonusButton.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastBonusTime > 86400000) {
                const bonusStars = 50 * multiplier;
                starBalance += bonusStars;
                updateStarBalance();
                lastBonusTime = now;
                dailyBonusButton.textContent = 'Бонус получен!';
                setTimeout(() => dailyBonusButton.textContent = 'Ежедневный бонус', 2000);
            } else {
                dailyBonusButton.textContent = 'Бонус доступен через...';
            }
        });
    }

    if (multiplier > 1) {
        autoClickInterval = setInterval(() => {
            const autoStars = 0.5 * multiplier;
            starBalance += autoStars;
            updateStarBalance();
        }, 5000);
    }
}

function createClickParticles(rect) {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const particles = [];

    for (let i = 0; i < 10; i++) {
        particles.push({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 6 - 3,
            speedY: Math.random() * 6 - 3,
            color: Math.random() > 0.5 ? '#ffd700' : '#ff1a1a',
            life: 100
        });
    }

    function animateClickParticles() {
        particles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life -= 2;
            particle.size -= 0.1;

            if (particle.life <= 0 || particle.size <= 0) {
                particles.splice(index, 1);
                return;
            }

            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });

        if (particles.length > 0) {
            requestAnimationFrame(animateClickParticles);
        }
    }

    animateClickParticles();
}

function setupParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 150;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 6 + 2;
            this.speedX = Math.random() * 2.5 - 1.25;
            this.speedY = Math.random() * 2.5 - 1.25;
            this.color = Math.random() > 0.7 ? '#ffd700' : Math.random() > 0.4 ? '#ff1a1a' : '#4d0000';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.015;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.size <= 0.2) {
                particles.splice(index, 1);
                particles.push(new Particle());
            }
        });
        requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    initParticles();
    animateParticles();
}

function setupSpinButton() {
    const spinButton = document.getElementById('spin-button');
    if (spinButton) {
        spinButton.addEventListener('click', () => {
            if (!selectedCase || isSpinning) return;
            const winItem = getRandomItem(selectedCase.items);
            if (!winItem) return;
            const winIndex = selectedCase.items.findIndex(item => item.id === winItem.id);
            spinRoulette(selectedCase, winItem, winIndex);
        });
    }
}