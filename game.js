// LUDUS - Game Logic
// Симулятор Ланисты Гладиаторов

================================================================================
1. КОНСТАНТЫ И КОНФИГУРАЦИЯ
================================================================================

const CONFIG = {
    TICKS_PER_DAY: 10,
    DAYS_PER_WEEK: 7,
    MAX_DAYS: 120,
    INITIAL_GOLD: 500,
    INITIAL_PROVISIONS: 50,
    INITIAL_MEDICINE: 10,
    BASE_BARRACKS_CAPACITY: 10,
    MARKET_REFRESH_COST: 25,
    CONTRACTS_REFRESH_COST: 50,
    TOURNAMENT_REGISTRATION_COST: 100,
    TRAINING_COST: 20,
    GUILD_JOIN_COST: 100,
    RAID_COOLDOWN: 3,
    GUILD_CHANGE_COOLDOWN: 30,
};

const WEATHER_TYPES = [
    { name: 'Солнечно', icon: '☀️', effects: {} },
    { name: 'Облачно', icon: '⛅', effects: { agility: 5 } },
    { name: 'Дождь', icon: '🌧️', effects: { heavy: -10, retiarus: 10 } },
    { name: 'Гроза', icon: '⚡', effects: { heavy: -15, light: 10 } },
    { name: 'Жара', icon: '🔥', effects: { heavy_armor: -10, bestiarius: 10 } }
];

const REGIONS = {
    rome: { name: 'Рим', bonuses: { discipline: 5, charisma: 5 } },
    greece: { name: 'Греция', bonuses: { accuracy: 5, agility: 5 } },
    gaul: { name: 'Галлия', bonuses: { strength: 5, endurance: 5 } },
    egypt: { name: 'Египет', bonuses: { intelligence: 5, accuracy: 5 } },
    thrace: { name: 'Фракия', bonuses: { strength: 4, agility: 4 } },
    numidia: { name: 'Нумидия', bonuses: { agility: 6, endurance: 4 } },
    britain: { name: 'Британия', bonuses: { strength: 6, discipline: 3 } },
    germania: { name: 'Германия', bonuses: { strength: 7, endurance: 3 } }
};

const FIGHTING_STYLES = {
    myrmillo: { 
        name: 'Мирмиллон', 
        icon: '🛡️',
        weapon: 'gladius',
        special: 'Удар щитом',
        bonuses: { defense: 10, strength: 5 }
    },
    thraex: { 
        name: 'Фракиец', 
        icon: '⚔️',
        weapon: 'sica',
        special: 'Обманный удар',
        bonuses: { agility: 8, accuracy: 5 }
    },
    retiarius: { 
        name: 'Ретиарий', 
        icon: '🔱',
        weapon: 'trident',
        special: 'Бросок сети',
        bonuses: { agility: 10, speed: 5 }
    },
    secutor: { 
        name: 'Секутор', 
        icon: '🗡️',
        weapon: 'gladius',
        special: 'Преследование',
        bonuses: { strength: 7, endurance: 5 }
    },
    hoplomachus: { 
        name: 'Гопломах', 
        icon: ' spear',
        weapon: 'spear',
        special: 'Бросок копья',
        bonuses: { accuracy: 10, strength: 5 }
    },
    dimachaerus: { 
        name: 'Димахер', 
        icon: '⚔️⚔️',
        weapon: 'dual_swords',
        special: 'Вихрь клинков',
        bonuses: { attack: 15, speed: 5 }
    }
};

const TRAITS = {
    veteran: { name: 'Ветеран', description: '+10% ко всем статам', bonuses: { all: 10 } },
    gambling: { name: 'Азартный', description: 'Рискованный стиль', bonuses: { crit: 15, defense: -5 } },
    coward: { name: 'Трус', description: 'Может спасовать', bonuses: { morale: -10 } },
    berserker: { name: 'Берсерк', description: 'Ярость в бою', bonuses: { attack: 20, defense: -10 } },
    noble: { name: 'Благородный', description: 'Уважение толпы', bonuses: { charisma: 15, fame: 10 } },
    cunning: { name: 'Хитрец', description: 'Тактические преимущества', bonuses: { accuracy: 10, evasion: 10 } },
    quick: { name: 'Быстрый', description: '+скорость атаки', bonuses: { speed: 15 } },
    strong: { name: 'Сильный', description: '+урон', bonuses: { strength: 10 } }
};

const BODY_PARTS = ['head', 'torso', 'left_arm', 'right_arm', 'left_leg', 'right_leg'];

const BUILDINGS = {
    medicus: { 
        name: 'Медикус', 
        icon: '🏥',
        description: 'Лазарет для лечения гладиаторов',
        baseCost: 100,
        maxLevel: 5,
        effects: { healingBonus: 10, naturalRegen: 5 }
    },
    palestra: { 
        name: 'Палестра', 
        icon: '🏋️',
        description: 'Тренировочная площадка',
        baseCost: 150,
        maxLevel: 5,
        effects: { trainingEfficiency: 20 }
    },
    barracks: { 
        name: 'Казармы', 
        icon: '🏠',
        description: 'Жилые помещения для гладиаторов',
        baseCost: 200,
        maxLevel: 5,
        effects: { capacity: 2 }
    },
    armory: { 
        name: 'Оружейная', 
        icon: '🛡️',
        description: 'Склад снаряжения',
        baseCost: 180,
        maxLevel: 5,
        effects: { equipmentAccess: 1 }
    },
    tribune: { 
        name: 'Трибуны', 
        icon: '🎫',
        description: 'Зрительские места',
        baseCost: 250,
        maxLevel: 5,
        effects: { passiveIncome: 10, crowdMood: 5 }
    },
    forge: { 
        name: 'Кузница', 
        icon: '🔨',
        description: 'Мастерская для улучшения снаряжения',
        baseCost: 300,
        maxLevel: 5,
        effects: { craftingDiscount: 10, repairDiscount: 15 }
    }
};

const CONTRACT_TYPES = {
    missio: { name: 'Missio', difficulty: 'low', deathChance: 0, rewardMultiplier: 1 },
    sine missione: { name: 'Sine Missione', difficulty: 'high', deathChance: 30, rewardMultiplier: 2 },
    bestiarii: { name: 'Bestiarii', difficulty: 'medium', deathChance: 15, rewardMultiplier: 1.5 },
    special: { name: 'Special', difficulty: 'extreme', deathChance: 40, rewardMultiplier: 3 }
};

const ANIMALS = [
    { name: 'Лев', strength: 50, icon: '🦁' },
    { name: 'Медведь', strength: 45, icon: '🐻' },
    { name: 'Бык', strength: 40, icon: '🐂' },
    { name: 'Тигр', strength: 55, icon: '🐯' },
    { name: 'Слон', strength: 60, icon: '🐘' }
];

const LEAGUES = [
    { name: 'Бронза', minPoints: 0 },
    { name: 'Серебро', minPoints: 100 },
    { name: 'Золото', minPoints: 300 },
    { name: 'Платина', minPoints: 600 },
    { name: 'Алмаз', minPoints: 1000 }
];

const MOODS = {
    happy: { name: 'Счастливый', class: 'mood-happy', bonus: 15 },
    content: { name: 'Довольный', class: 'mood-content', bonus: 10 },
    neutral: { name: 'Нейтральный', class: 'mood-neutral', bonus: 0 },
    sad: { name: 'Грустный', class: 'mood-sad', penalty: -10 },
    depressed: { name: 'Депрессивный', class: 'mood-depressed', penalty: -20 },
    angry: { name: 'Злой', class: 'mood-angry', penalty: -15 }
};

================================================================================
2. СОСТОЯНИЕ ИГРЫ
================================================================================

let gameState = {
    // Ресурсы
    gold: CONFIG.INITIAL_GOLD,
    favor: 0,
    provisions: CONFIG.INITIAL_PROVISIONS,
    medicine: CONFIG.INITIAL_MEDICINE,
    
    // Время
    day: 1,
    week: 1,
    tick: 0,
    weather: WEATHER_TYPES[0],
    
    // Прогресс
    reputation: 0,
    totalWins: 0,
    totalLosses: 0,
    totalFame: 0,
    
    // Гладиаторы
    gladiators: [],
    gladiatorIdCounter: 0,
    
    // Постройки
    buildings: {
        medicus: { level: 1, exp: 0 },
        palestra: { level: 1, exp: 0 },
        barracks: { level: 1, exp: 0 },
        armory: { level: 1, exp: 0 },
        tribune: { level: 1, exp: 0 },
        forge: { level: 1, exp: 0 }
    },
    
    // Рынок
    marketGladiators: [],
    
    // Контракты
    availableContracts: [],
    activeContracts: [],
    
    // Снаряжение
    equipmentShop: [],
    equipmentInventory: [],
    
    // Турнир
    tournamentRegistered: false,
    tournamentActive: false,
    tournamentBracket: null,
    
    // Рейтинг
    lanistaRanking: [],
    gladiatorRanking: [],
    
    // Гильдия
    guild: null,
    guildJoinDay: 0,
    
    // Лог событий
    eventLog: [],
    
    // Статистика
    stats: {
        contractsCompleted: 0,
        tournamentsWon: 0,
        gladiatorsKilled: 0,
        animalsSlain: 0,
        totalEarnings: 0,
        totalSpent: 0
    },
    
    // Флаги
    gameOver: false,
    gameWon: false,
    paused: false
};

================================================================================
3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
================================================================================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateName(region) {
    const names = {
        rome: ['Marcus', 'Lucius', 'Gaius', 'Titus', 'Publius', 'Quintus'],
        greece: ['Alexandros', 'Nikolas', 'Dimitrios', 'Petros', 'Andreas'],
        gaul: ['Brennos', 'Vercingetorix', 'Ambiorix', 'Cativolcus'],
        egypt: ['Ahmed', 'Ramses', 'Osiris', 'Anubis', 'Horus'],
        thrace: ['Spartacus', 'Thracius', 'Burebista', 'Decebalus'],
        numidia: ['Jugurtha', 'Masinissa', 'Syphax', 'Vermina'],
        britain: ['Caratacus', 'Togodumnus', ' Prasutagus', 'Boudica'],
        germania: ['Arminius', 'Segestes', 'Segimer', 'Thusnelda']
    };
    
    const surnames = ['Maximus', 'Magnus', 'Felix', 'Victor', 'Fortis', 'Severus', 'Rufus'];
    
    const firstName = randomChoice(names[region] || names.rome);
    const surname = randomChoice(surnames);
    
    return `${firstName} ${surname}`;
}

function calculateAgeCategory(age) {
    if (age >= 18 && age <= 25) return 'young';
    if (age >= 26 && age <= 32) return 'middle';
    return 'old';
}

function getAgeModifier(category) {
    switch(category) {
        case 'young': return { statMod: 0.9, expMod: 1.2 };
        case 'middle': return { statMod: 1.0, expMod: 1.0 };
        case 'old': return { statMod: 1.1, expMod: 0.9 };
        default: return { statMod: 1.0, expMod: 1.0 };
    }
}

function calculatePrice(gladiator) {
    const baseStats = gladiator.stats.strength + gladiator.stats.agility + 
                     gladiator.stats.accuracy + gladiator.stats.endurance + 
                     gladiator.stats.discipline + gladiator.stats.charisma;
    
    const basePrice = baseStats * 10;
    const ageMod = getAgeModifier(gladiator.ageCategory);
    const styleBonus = Object.keys(FIGHTING_STYLES).length - Object.keys(gladiator.style).length + 1;
    
    return Math.floor(basePrice * ageMod.statMod * styleBonus);
}

function getMoodFromValues(stress, loyalty) {
    const score = loyalty - stress;
    
    if (score > 80) return 'happy';
    if (score > 50) return 'content';
    if (score > 20) return 'neutral';
    if (score > -20) return 'sad';
    if (score > -50) return 'depressed';
    return 'angry';
}

function getLeague(reputation) {
    for (let i = LEAGUES.length - 1; i >= 0; i--) {
        if (reputation >= LEAGUES[i].minPoints) {
            return LEAGUES[i].name;
        }
    }
    return LEAGUES[0].name;
}

function logEvent(message, type = 'neutral') {
    const timestamp = `День ${gameState.day}, Неделя ${gameState.week}`;
    gameState.eventLog.unshift({
        time: timestamp,
        message: message,
        type: type,
        day: gameState.day
    });
    
    // Keep only last 100 events
    if (gameState.eventLog.length > 100) {
        gameState.eventLog.pop();
    }
    
    updateEventLog();
}

================================================================================
4. ГЕНЕРАЦИЯ ГЛАДИАТОРОВ
================================================================================

function generateGladiator(isPlayerPurchase = false) {
    const regionKey = randomChoice(Object.keys(REGIONS));
    const region = REGIONS[regionKey];
    const styleKey = randomChoice(Object.keys(FIGHTING_STYLES));
    const style = FIGHTING_STYLES[styleKey];
    
    const age = randomInt(18, 38);
    const ageCategory = calculateAgeCategory(age);
    const ageMod = getAgeModifier(ageCategory);
    
    // Generate traits (1-2)
    const traitKeys = Object.keys(TRAITS);
    const numTraits = randomInt(1, 2);
    const traits = [];
    for (let i = 0; i < numTraits; i++) {
        const trait = randomChoice(traitKeys);
        if (!traits.includes(trait)) {
            traits.push(trait);
        }
    }
    
    // Base stats (randomized)
    const baseStats = {
        strength: randomInt(30, 60),
        agility: randomInt(30, 60),
        accuracy: randomInt(30, 60),
        endurance: randomInt(30, 60),
        discipline: randomInt(30, 60),
        charisma: randomInt(30, 60)
    };
    
    // Apply region bonuses
    for (const [stat, bonus] of Object.entries(region.bonuses)) {
        if (baseStats[stat] !== undefined) {
            baseStats[stat] += bonus;
        }
    }
    
    // Apply style bonuses
    for (const [stat, bonus] of Object.entries(style.bonuses)) {
        if (baseStats[stat] !== undefined) {
            baseStats[stat] += bonus;
        }
    }
    
    // Apply age modifier
    for (const stat in baseStats) {
        baseStats[stat] = Math.floor(baseStats[stat] * ageMod.statMod);
    }
    
    // Calculate derived stats
    const maxHealth = Math.floor(baseStats.endurance * 2);
    
    // Initialize body parts
    const bodyParts = {};
    BODY_PARTS.forEach(part => {
        bodyParts[part] = 'healthy';
    });
    
    const gladiator = {
        id: ++gameState.gladiatorIdCounter,
        name: generateName(regionKey),
        age: age,
        ageCategory: ageCategory,
        region: regionKey,
        regionName: region.name,
        style: styleKey,
        styleName: style.name,
        styleIcon: style.icon,
        specialMove: style.special,
        stats: baseStats,
        level: 1,
        exp: 0,
        expToNext: 100,
        health: maxHealth,
        maxHealth: maxHealth,
        stress: 0,
        loyalty: 50,
        mood: 'neutral',
        traits: traits,
        bodyParts: bodyParts,
        scars: [],
        trophies: [],
        equipment: {
            weapon: null,
            armor: null,
            helmet: null,
            shield: null,
            accessory: null
        },
        contractValue: 0,
        weeklySalary: 0,
        trainingCount: 0,
        lastTrainedWeek: 0,
        friends: [],
        enemies: [],
        rival: null,
        mentor: null,
        students: [],
        wins: 0,
        losses: 0,
        kills: 0,
        fame: 0,
        isDead: false,
        deathDay: null
    };
    
    // Calculate contract value and salary
    const totalStats = Object.values(gladiator.stats).reduce((a, b) => a + b, 0);
    gladiator.contractValue = Math.floor(totalStats * 5);
    gladiator.weeklySalary = Math.floor(gladiator.contractValue * 0.1);
    
    return gladiator;
}

================================================================================
5. СИСТЕМА ВРЕМЕНИ
================================================================================

let gameInterval = null;

function startGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    
    gameInterval = setInterval(() => {
        if (!gameState.paused && !gameState.gameOver) {
            gameTick();
        }
    }, 1000); // 1 second = 1 tick
}

function gameTick() {
    gameState.tick++;
    
    // Check if day passed
    if (gameState.tick >= CONFIG.TICKS_PER_DAY) {
        gameState.tick = 0;
        newDay();
    }
    
    updateUI();
}

function newDay() {
    gameState.day++;
    
    // Check week change
    if (gameState.day % CONFIG.DAYS_PER_WEEK === 1 && gameState.day > 1) {
        gameState.week++;
        newWeek();
    }
    
    // Update weather
    gameState.weather = randomChoice(WEATHER_TYPES);
    
    // Daily events
    consumeProvisions();
    regenerateHealth();
    updateGladiatorMoods();
    checkTrainingReset();
    
    // Check for random events (10% chance)
    if (Math.random() < 0.1) {
        triggerRandomEvent();
    }
    
    // Check tournament day (every 7th day)
    if (gameState.day % CONFIG.DAYS_PER_WEEK === 0) {
        if (gameState.tournamentRegistered) {
            startTournament();
        }
    }
    
    // Check game over conditions
    checkGameOver();
    
    logEvent(`Наступил день ${gameState.day}. Погода: ${gameState.weather.icon} ${gameState.weather.name}`, 'neutral');
}

function newWeek() {
    logEvent(`=== Неделя ${gameState.week} ===`, 'neutral');
    
    // Pay salaries
    paySalaries();
    
    // Refresh market
    refreshMarket();
    
    // Refresh contracts
    refreshContracts();
    
    // Refresh equipment shop
    refreshEquipmentShop();
    
    // Reset training counts
    gameState.gladiators.forEach(g => {
        if (!g.isDead) {
            g.trainingCount = 0;
        }
    });
    
    // Generate bot lanista actions
    simulateBotLanistas();
}

function consumeProvisions() {
    const livingGladiators = gameState.gladiators.filter(g => !g.isDead).length;
    const consumed = Math.min(livingGladiators, gameState.provisions);
    
    gameState.provisions -= consumed;
    
    if (consumed < livingGladiators) {
        // Not enough provisions
        gameState.gladiators.forEach(g => {
            if (!g.isDead) {
                g.health = Math.max(1, g.health - 5);
                g.stress += 5;
                g.loyalty -= 2;
            }
        });
        logEvent('Нехватка провизии! Гладиаторы голодают.', 'negative');
    }
}

function regenerateHealth() {
    const medicusBonus = gameState.buildings.medicus.level * BUILDINGS.medicus.effects.naturalRegen;
    
    gameState.gladiators.forEach(g => {
        if (!g.isDead && g.health < g.maxHealth) {
            const regen = Math.floor(g.maxHealth * 0.05) + medicusBonus;
            g.health = Math.min(g.maxHealth, g.health + regen);
        }
    });
}

function updateGladiatorMoods() {
    gameState.gladiators.forEach(g => {
        if (!g.isDead) {
            // Natural stress reduction
            g.stress = Math.max(0, g.stress - 1);
            
            // Natural loyalty increase
            if (g.loyalty < 50) {
                g.loyalty += 1;
            }
            
            // Update mood
            g.mood = getMoodFromValues(g.stress, g.loyalty);
        }
    });
}

function checkTrainingReset() {
    // Reset training availability each week
    if (gameState.day % CONFIG.DAYS_PER_WEEK === 1) {
        gameState.gladiators.forEach(g => {
            g.lastTrainedWeek = gameState.week;
        });
    }
}

function paySalaries() {
    let totalSalary = 0;
    
    gameState.gladiators.forEach(g => {
        if (!g.isDead) {
            totalSalary += g.weeklySalary;
        }
    });
    
    if (totalSalary > 0) {
        gameState.gold -= totalSalary;
        gameState.stats.totalSpent += totalSalary;
        logEvent(`Выплачена зарплата: -${totalSalary} 🪙`, 'negative');
        
        // Check bankruptcy
        if (gameState.gold < 0) {
            gameState.gold = 0;
            logEvent('ВНИМАНИЕ: Отрицательный баланс! Риск банкротства.', 'negative');
        }
    }
}

================================================================================
6. РЫНОЧНАЯ СИСТЕМА
================================================================================

function refreshMarket() {
    gameState.marketGladiators = [];
    
    // Number of gladiators depends on reputation
    const count = 3 + Math.floor(gameState.reputation / 50);
    
    for (let i = 0; i < count; i++) {
        const gladiator = generateGladiator(true);
        // Scale with reputation
        const repMultiplier = 1 + (gameState.reputation / 200);
        
        for (const stat in gladiator.stats) {
            gladiator.stats[stat] = Math.floor(gladiator.stats[stat] * repMultiplier);
        }
        
        gladiator.contractValue = calculatePrice(gladiator);
        gameState.marketGladiators.push(gladiator);
    }
    
    logEvent('Рынок рабов обновлён', 'neutral');
    updateMarketUI();
}

function forceRefreshMarket() {
    if (gameState.gold >= CONFIG.MARKET_REFRESH_COST) {
        gameState.gold -= CONFIG.MARKET_REFRESH_COST;
        gameState.stats.totalSpent += CONFIG.MARKET_REFRESH_COST;
        refreshMarket();
        logEvent(`Рынок обновлён принудительно за ${CONFIG.MARKET_REFRESH_COST} 🪙`, 'neutral');
        updateResourcesUI();
    } else {
        logEvent('Недостаточно золота для обновления рынка', 'negative');
    }
}

function buyGladiator(marketIndex) {
    const gladiator = gameState.marketGladiators[marketIndex];
    
    if (!gladiator) {
        logEvent('Гладиатор уже куплен', 'negative');
        return;
    }
    
    // Check capacity
    const capacity = CONFIG.BASE_BARRACKS_CAPACITY + 
                    (gameState.buildings.barracks.level - 1) * BUILDINGS.barracks.effects.capacity;
    
    if (gameState.gladiators.filter(g => !g.isDead).length >= capacity) {
        logEvent('Нет места в казармах! Улучшите казармы.', 'negative');
        return;
    }
    
    // Check gold
    if (gameState.gold < gladiator.contractValue) {
        logEvent('Недостаточно золота!', 'negative');
        return;
    }
    
    // Purchase
    gameState.gold -= gladiator.contractValue;
    gameState.stats.totalSpent += gladiator.contractValue;
    
    // Add to player's gladiators
    gameState.gladiators.push(gladiator);
    
    // Remove from market
    gameState.marketGladiators.splice(marketIndex, 1);
    
    logEvent(`Куплен гладиатор ${gladiator.name} за ${gladiator.contractValue} 🪙`, 'positive');
    
    updateResourcesUI();
    updateGladiatorsUI();
    updateMarketUI();
    updateLudusUI();
}

================================================================================
7. СИСТЕМА КОНТРАКТОВ
================================================================================

function generateContract() {
    const types = Object.keys(CONTRACT_TYPES);
    const typeKey = randomChoice(types);
    const contractType = CONTRACT_TYPES[typeKey];
    
    // Difficulty based on reputation
    const maxStars = Math.min(5, 1 + Math.floor(gameState.reputation / 30));
    const stars = randomInt(1, maxStars);
    
    // Generate enemy
    const enemyCount = randomInt(1, 3);
    const enemyLevel = stars * 10;
    
    let enemyType = 'gladiator';
    let enemyName = '';
    
    if (typeKey === 'bestiarii') {
        const animal = randomChoice(ANIMALS);
        enemyType = 'animal';
        enemyName = animal.name;
    } else if (typeKey === 'special' && stars >= 4) {
        enemyType = 'boss';
        enemyName = `Champion ${generateName('rome')}`;
    } else {
        enemyName = `${generateName(randomChoice(Object.keys(REGIONS)))}`;
    }
    
    // Calculate rewards
    const baseReward = stars * 50;
    const goldReward = Math.floor(baseReward * contractType.rewardMultiplier);
    const favorReward = contractType.difficulty === 'high' ? Math.floor(stars * 2) : 0;
    const fameReward = stars * 5;
    
    // Duration
    const duration = randomInt(1, 3);
    
    return {
        id: Date.now() + Math.random(),
        type: typeKey,
        typeName: contractType.name,
        stars: stars,
        enemyType: enemyType,
        enemyName: enemyName,
        enemyCount: enemyCount,
        enemyLevel: enemyLevel,
        goldReward: goldReward,
        favorReward: favorReward,
        fameReward: fameReward,
        duration: duration,
        daysRemaining: duration,
        status: 'available',
        assignedGladiators: []
    };
}

function refreshContracts() {
    gameState.availableContracts = [];
    
    // Number of contracts depends on reputation
    const count = 2 + Math.floor(gameState.reputation / 40);
    
    for (let i = 0; i < count; i++) {
        gameState.availableContracts.push(generateContract());
    }
    
    logEvent('Доступны новые контракты', 'neutral');
    updateContractsUI();
}

function forceRefreshContracts() {
    if (gameState.gold >= CONFIG.CONTRACTS_REFRESH_COST) {
        gameState.gold -= CONFIG.CONTRACTS_REFRESH_COST;
        gameState.stats.totalSpent += CONFIG.CONTRACTS_REFRESH_COST;
        refreshContracts();
        logEvent(`Контракты обновлены принудительно за ${CONFIG.CONTRACTS_REFRESH_COST} 🪙`, 'neutral');
        updateResourcesUI();
    } else {
        logEvent('Недостаточно золота для обновления контрактов', 'negative');
    }
}

function acceptContract(contractIndex, gladiatorIds) {
    const contract = gameState.availableContracts[contractIndex];
    
    if (!contract) {
        logEvent('Контракт уже принят', 'negative');
        return;
    }
    
    if (gladiatorIds.length === 0) {
        logEvent('Выберите хотя бы одного гладиатора', 'negative');
        return;
    }
    
    // Validate gladiators
    const selectedGladiators = gameState.gladiators.filter(g => 
        gladiatorIds.includes(g.id) && !g.isDead && g.health > 0
    );
    
    if (selectedGladiators.length !== gladiatorIds.length) {
        logEvent('Некоторые гладиаторы недоступны', 'negative');
        return;
    }
    
    // Assign gladiators
    contract.assignedGladiators = gladiatorIds;
    contract.status = 'active';
    
    // Move to active contracts
    gameState.activeContracts.push(contract);
    gameState.availableContracts.splice(contractIndex, 1);
    
    logEvent(`Контракт "${contract.typeName}" принят! Награда: ${contract.goldReward} 🪙`, 'positive');
    
    // Start combat after short delay
    setTimeout(() => {
        executeContract(contract);
    }, 1000);
    
    updateContractsUI();
}

================================================================================
8. БОЕВАЯ СИСТЕМА
================================================================================

function executeContract(contract) {
    const playerGladiators = gameState.gladiators.filter(g => 
        contract.assignedGladiators.includes(g.id)
    );
    
    // Generate enemies
    const enemies = [];
    for (let i = 0; i < contract.enemyCount; i++) {
        if (contract.enemyType === 'animal') {
            const animal = randomChoice(ANIMALS);
            enemies.push({
                name: animal.name,
                icon: animal.icon,
                health: contract.enemyLevel * 3,
                maxHealth: contract.enemyLevel * 3,
                strength: contract.enemyLevel,
                agility: contract.enemyLevel * 0.8,
                isAnimal: true
            });
        } else if (contract.enemyType === 'boss') {
            enemies.push({
                name: contract.enemyName,
                icon: '👑',
                health: contract.enemyLevel * 5,
                maxHealth: contract.enemyLevel * 5,
                strength: contract.enemyLevel * 1.5,
                agility: contract.enemyLevel,
                isBoss: true
            });
        } else {
            enemies.push({
                name: contract.enemyName,
                icon: '⚔️',
                health: contract.enemyLevel * 2,
                maxHealth: contract.enemyLevel * 2,
                strength: contract.enemyLevel,
                agility: contract.enemyLevel * 0.9,
                isGladiator: true
            });
        }
    }
    
    // Show combat modal
    showCombatModal(playerGladiators, enemies, contract);
}

function resolveCombat(playerGladiators, enemies, contract) {
    const combatLog = [];
    let playerWon = true;
    
    // Simplified combat resolution
    playerGladiators.forEach(g => {
        const moodBonus = MOODS[g.mood]?.bonus || 0;
        const totalPower = (
            g.stats.strength + 
            g.stats.agility + 
            g.stats.accuracy +
            moodBonus
        ) * (g.health / g.maxHealth);
        
        enemies.forEach(enemy => {
            const enemyPower = enemy.strength + enemy.agility;
            
            if (totalPower > enemyPower * 0.8) {
                // Player wins this matchup
                g.wins++;
                g.fame += contract.fameReward / playerGladiators.length;
                
                // Gain experience
                const expGain = Math.floor(contract.enemyLevel * 10 * getAgeModifier(g.ageCategory).expMod);
                gainExperience(g, expGain);
                
                combatLog.push({
                    type: 'victory',
                    message: `${g.name} победил ${enemy.name}!`,
                    class: 'positive'
                });
            } else {
                // Enemy wins
                g.losses++;
                g.health = Math.max(1, g.health - Math.floor(g.maxHealth * 0.3));
                g.stress += 10;
                
                // Chance of injury
                if (Math.random() < 0.3) {
                    const injuredPart = randomChoice(BODY_PARTS);
                    g.bodyParts[injuredPart] = 'injured';
                    combatLog.push({
                        type: 'injury',
                        message: `${g.name} ранен в ${injuredPart}!`,
                        class: 'negative'
                    });
                }
                
                // Chance of death (based on contract type)
                const deathChance = CONTRACT_TYPES[contract.type].deathChance / 100;
                if (g.health <= 0 || Math.random() < deathChance) {
                    g.isDead = true;
                    g.deathDay = gameState.day;
                    gameState.stats.gladiatorsKilled++;
                    combatLog.push({
                        type: 'death',
                        message: `${g.name} погиб в бою...`,
                        class: 'negative'
                    });
                    playerWon = false;
                } else {
                    playerWon = false;
                }
                
                combatLog.push({
                    type: 'defeat',
                    message: `${g.name} проиграл ${enemy.name}`,
                    class: 'negative'
                });
            }
        });
    });
    
    // Process results
    if (playerWon) {
        // Victory rewards
        gameState.gold += contract.goldReward;
        gameState.stats.totalEarnings += contract.goldReward;
        
        if (contract.favorReward > 0) {
            gameState.favor += contract.favorReward;
        }
        
        gameState.totalFame += contract.fameReward;
        gameState.reputation += Math.floor(contract.fameReward / 2);
        gameState.totalWins++;
        gameState.stats.contractsCompleted++;
        
        if (contract.enemyType === 'animal') {
            gameState.stats.animalsSlain += contract.enemyCount;
        }
        
        logEvent(`Контракт выполнен! Получено: ${contract.goldReward} 🪙`, 'positive');
    } else {
        gameState.totalLosses++;
        logEvent('Контракт провален...', 'negative');
    }
    
    // Remove contract from active
    const index = gameState.activeContracts.indexOf(contract);
    if (index > -1) {
        gameState.activeContracts.splice(index, 1);
    }
    
    // Update UI
    updateResourcesUI();
    updateGladiatorsUI();
    updateContractsUI();
    updateLudusUI();
    
    return { playerWon, combatLog };
}

function gainExperience(gladiator, exp) {
    gladiator.exp += exp;
    
    while (gladiator.exp >= gladiator.expToNext) {
        gladiator.exp -= gladiator.expToNext;
        gladiator.level++;
        gladiator.expToNext = Math.floor(gladiator.expToNext * 1.5);
        
        // Stat increases
        for (const stat in gladiator.stats) {
            gladiator.stats[stat] += 5;
        }
        
        gladiator.maxHealth = Math.floor(gladiator.stats.endurance * 2);
        gladiator.health = gladiator.maxHealth;
        
        logEvent(`${gladiator.name} получил уровень ${gladiator.level}!`, 'positive');
    }
}

================================================================================
9. СИСТЕМА ТРЕНИРОВОК
================================================================================

function trainGladiator(gladiatorId, statToTrain) {
    const gladiator = gameState.gladiators.find(g => g.id === gladiatorId);
    
    if (!gladiator || gladiator.isDead) {
        logEvent('Гладиатор недоступен', 'negative');
        return false;
    }
    
    // Check if already trained this week
    if (gladiator.trainingCount >= 1) {
        logEvent('Гладиатор уже тренировался на этой неделе', 'negative');
        return false;
    }
    
    // Check gold
    if (gameState.gold < CONFIG.TRAINING_COST) {
        logEvent('Недостаточно золота для тренировки', 'negative');
        return false;
    }
    
    // Check Palaestra level bonus
    const palestraBonus = gameState.buildings.palestra.level * BUILDINGS.palestra.effects.trainingEfficiency;
    
    // Train
    gameState.gold -= CONFIG.TRAINING_COST;
    gameState.stats.totalSpent += CONFIG.TRAINING_COST;
    
    const improvement = randomInt(1, 3) + Math.floor(palestraBonus / 10);
    gladiator.stats[statToTrain] += improvement;
    gladiator.trainingCount++;
    
    // Recalculate max health if endurance increased
    if (statToTrain === 'endurance') {
        gladiator.maxHealth = Math.floor(gladiator.stats.endurance * 2);
    }
    
    logEvent(`${gladiator.name} улучшил ${statToTrain} на +${improvement}`, 'positive');
    
    updateResourcesUI();
    updateGladiatorsUI();
    
    return true;
}

function healGladiator(gladiatorId) {
    const gladiator = gameState.gladiators.find(g => g.id === gladiatorId);
    
    if (!gladiator || gladiator.isDead) {
        logEvent('Гладиатор недоступен', 'negative');
        return false;
    }
    
    if (gladiator.health >= gladiator.maxHealth) {
        logEvent('Гладиатор полностью здоров', 'neutral');
        return false;
    }
    
    // Check medicine
    if (gameState.medicine < 1) {
        logEvent('Недостаточно медицины', 'negative');
        return false;
    }
    
    const medicusBonus = gameState.buildings.medicus.level * BUILDINGS.medicus.effects.healingBonus;
    const healAmount = Math.floor(gladiator.maxHealth * 0.5) + medicusBonus;
    
    gameState.medicine--;
    gladiator.health = Math.min(gladiator.maxHealth, gladiator.health + healAmount);
    
    // Heal injuries
    for (const part in gladiator.bodyParts) {
        if (gladiator.bodyParts[part] === 'injured') {
            if (Math.random() < 0.5) {
                gladiator.bodyParts[part] = 'healthy';
            }
        }
    }
    
    logEvent(`${gladiator.name} вылечен на ${healAmount} HP`, 'positive');
    
    updateResourcesUI();
    updateGladiatorsUI();
    
    return true;
}

================================================================================
10. СИСТЕМА ПОСТРОЕК
================================================================================

function upgradeBuilding(buildingKey) {
    const building = gameState.buildings[buildingKey];
    const buildingData = BUILDINGS[buildingKey];
    
    if (!building || !buildingData) {
        logEvent('Постройка не найдена', 'negative');
        return false;
    }
    
    if (building.level >= buildingData.maxLevel) {
        logEvent('Постройка максимального уровня', 'neutral');
        return false;
    }
    
    const cost = building.level * 100;
    
    if (gameState.gold < cost) {
        logEvent('Недостаточно золота', 'negative');
        return false;
    }
    
    gameState.gold -= cost;
    gameState.stats.totalSpent += cost;
    building.level++;
    
    logEvent(`${buildingData.name} улучшен до уровня ${building.level}`, 'positive');
    
    updateResourcesUI();
    updateBuildingsUI();
    updateLudusUI();
    
    return true;
}

================================================================================
11. ТУРНИРНАЯ СИСТЕМА
================================================================================

function registerForTournament() {
    if (gameState.tournamentRegistered) {
        logEvent('Вы уже зарегистрированы на турнир', 'neutral');
        return;
    }
    
    if (gameState.gold < CONFIG.TOURNAMENT_REGISTRATION_COST) {
        logEvent('Недостаточно золота для регистрации', 'negative');
        return;
    }
    
    if (gameState.gladiators.filter(g => !g.isDead && g.health > 0).length === 0) {
        logEvent('Нет доступных гладиаторов для турнира', 'negative');
        return;
    }
    
    gameState.gold -= CONFIG.TOURNAMENT_REGISTRATION_COST;
    gameState.stats.totalSpent += CONFIG.TOURNAMENT_REGISTRATION_COST;
    gameState.tournamentRegistered = true;
    
    logEvent('Вы зарегистрированы на турнир!', 'positive');
    updateResourcesUI();
    updateTournamentUI();
}

function startTournament() {
    gameState.tournamentActive = true;
    gameState.tournamentRegistered = false;
    
    // Generate 8 participants (player + 7 bots)
    const participants = [];
    
    // Player
    const playerBest = getBestAvailableGladiator();
    if (playerBest) {
        participants.push({
            name: `Вы (${playerBest.name})`,
            gladiator: playerBest,
            isPlayer: true,
            power: calculateGladiatorPower(playerBest)
        });
    }
    
    // Bots
    const botNames = ['Lanista Marcus', 'Lanista Lucius', 'Lanista Gaius', 
                      'Lanista Titus', 'Lanista Brutus', 'Lanista Nero', 'Lanista Augustus'];
    
    for (let i = 0; i < 7; i++) {
        const botGladiator = generateGladiator();
        // Scale bot gladiators
        const scale = 1 + (gameState.reputation / 100);
        for (const stat in botGladiator.stats) {
            botGladiator.stats[stat] = Math.floor(botGladiator.stats[stat] * scale);
        }
        
        participants.push({
            name: botNames[i],
            gladiator: botGladiator,
            isPlayer: false,
            power: calculateGladiatorPower(botGladiator) * randomFloat(0.8, 1.2)
        });
    }
    
    // Create bracket
    shuffleArray(participants);
    
    const bracket = {
        round1: [
            { p1: participants[0], p2: participants[1], winner: null },
            { p1: participants[2], p2: participants[3], winner: null },
            { p1: participants[4], p2: participants[5], winner: null },
            { p1: participants[6], p2: participants[7], winner: null }
        ],
        semifinals: [],
        final: null,
        champion: null
    };
    
    gameState.tournamentBracket = bracket;
    
    logEvent('Турнир начался!', 'positive');
    showTournamentModal(bracket);
}

function calculateGladiatorPower(gladiator) {
    const moodBonus = MOODS[gladiator.mood]?.bonus || 0;
    return (
        gladiator.stats.strength * 1.5 +
        gladiator.stats.agility * 1.2 +
        gladiator.stats.accuracy * 1.3 +
        gladiator.stats.endurance * 1.1 +
        gladiator.stats.discipline * 1.0 +
        gladiator.stats.charisma * 0.8 +
        moodBonus
    ) * (gladiator.health / gladiator.maxHealth);
}

function getBestAvailableGladiator() {
    const available = gameState.gladiators.filter(g => !g.isDead && g.health > 0);
    if (available.length === 0) return null;
    
    return available.reduce((best, current) => {
        return calculateGladiatorPower(current) > calculateGladiatorPower(best) ? current : best;
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resolveTournamentRound(roundMatches, nextRound) {
    roundMatches.forEach(match => {
        if (match.winner) return;
        
        // Determine winner
        const p1Power = match.p1.power * randomFloat(0.8, 1.2);
        const p2Power = match.p2.power * randomFloat(0.8, 1.2);
        
        const winner = p1Power >= p2Power ? match.p1 : match.p2;
        const loser = p1Power >= p2Power ? match.p2 : match.p1;
        
        match.winner = winner;
        
        // Update gladiator stats
        if (winner.isPlayer) {
            winner.gladiator.wins++;
            winner.gladiator.fame += 10;
            gainExperience(winner.gladiator, 50);
        }
        if (loser.isPlayer) {
            loser.gladiator.losses++;
            loser.gladiator.stress += 15;
            loser.gladiator.health = Math.max(1, Math.floor(loser.gladiator.health * 0.5));
        }
    });
    
    // Prepare next round
    if (nextRound) {
        for (let i = 0; i < roundMatches.length; i += 2) {
            if (roundMatches[i].winner && roundMatches[i+1].winner) {
                nextRound.push({
                    p1: roundMatches[i].winner,
                    p2: roundMatches[i+1].winner,
                    winner: null
                });
            }
        }
    }
}

function completeTournament() {
    const bracket = gameState.tournamentBracket;
    
    // Find champion
    if (bracket.final && bracket.final.winner) {
        bracket.champion = bracket.final.winner;
        
        if (bracket.champion.isPlayer) {
            // Player won!
            const prizeGold = 500;
            const prizeFame = 50;
            
            gameState.gold += prizeGold;
            gameState.totalFame += prizeFame;
            gameState.reputation += 25;
            gameState.stats.tournamentsWon++;
            
            logEvent(`🏆 ПОБЕДА В ТУРНИРЕ! Приз: ${prizeGold} 🪙, +${prizeFame} славы`, 'positive');
            
            // Award title to gladiator
            const gladiator = bracket.champion.gladiator;
            if (!gladiator.traits.includes('veteran')) {
                gladiator.traits.push('champion');
            }
        } else {
            logEvent(`Турнир выиграл ${bracket.champion.name}`, 'neutral');
        }
    }
    
    gameState.tournamentActive = false;
    gameState.tournamentBracket = null;
    
    updateResourcesUI();
    updateGladiatorsUI();
    updateTournamentUI();
}

================================================================================
12. СИСТЕМА РЕЙТИНГА
================================================================================

function updateRankings() {
    // Lanista ranking
    const lanistas = [
        { name: 'Вы', fame: gameState.totalFame, reputation: gameState.reputation }
    ];
    
    // Generate bot lanistas
    for (let i = 0; i < 18; i++) {
        const botReputation = gameState.reputation + randomInt(-50, 50);
        lanistas.push({
            name: `Lanista ${generateName('rome').split(' ')[0]}`,
            fame: botReputation * 2 + randomInt(-100, 100),
            reputation: botReputation
        });
    }
    
    // Sort by fame
    lanistas.sort((a, b) => b.fame - a.fame);
    gameState.lanistaRanking = lanistas;
    
    // Gladiator ranking
    const allGladiators = [...gameState.gladiators];
    
    // Add some bot gladiators
    for (let i = 0; i < 20; i++) {
        const botGlad = generateGladiator();
        botGlad.fame = randomInt(0, gameState.totalFame + 100);
        botGlad.wins = randomInt(0, 50);
        allGladiators.push(botGlad);
    }
    
    // Sort by fame and wins
    allGladiators.sort((a, b) => (b.fame + b.wins * 2) - (a.fame + a.wins * 2));
    gameState.gladiatorRanking = allGladiators.slice(0, 20);
    
    updateRankingsUI();
}

================================================================================
13. СЛУЧАЙНЫЕ СОБЫТИЯ
================================================================================

const RANDOM_EVENTS = [
    {
        name: 'Эпидемия',
        description: 'В лудусе началась эпидемия!',
        choices: [
            { 
                text: 'Купить лекарства (-50 🪙)', 
                effect: () => { 
                    if (gameState.gold >= 50) {
                        gameState.gold -= 50;
                        gameState.gladiators.forEach(g => {
                            if (!g.isDead) g.health = Math.min(g.maxHealth, g.health + 20);
                        });
                        logEvent('Лекарства куплены, гладиаторы лечатся', 'positive');
                    }
                }
            },
            { 
                text: 'Ничего не делать', 
                effect: () => { 
                    gameState.gladiators.forEach(g => {
                        if (!g.isDead && Math.random() < 0.3) {
                            g.health = Math.max(1, g.health - 30);
                        }
                    });
                    logEvent('Эпидемия нанесла урон гладиаторам', 'negative');
                }
            }
        ]
    },
    {
        name: 'Щедрый спонсор',
        description: 'Богатый патриций хочет поддержать ваш лудус',
        choices: [
            { 
                text: 'Принять дар (+100 🪙)', 
                effect: () => { 
                    gameState.gold += 100;
                    logEvent('Получено пожертвование: 100 🪙', 'positive');
                }
            },
            { 
                text: 'Отклонить из гордости', 
                effect: () => { 
                    gameState.reputation += 5;
                    logEvent('Ваша гордость оценена, репутация выросла', 'neutral');
                }
            }
        ]
    },
    {
        name: 'Находка на арене',
        description: 'После боя вы нашли ценный предмет',
        choices: [
            { 
                text: 'Забрать себе', 
                effect: () => { 
                    gameState.favor += 5;
                    logEvent('Вы нашли редкий артефакт! +5 благосклонности', 'positive');
                }
            },
            { 
                text: 'Подарить толпе', 
                effect: () => { 
                    gameState.totalFame += 20;
                    logEvent('Толпа в восторге! +20 славы', 'positive');
                }
            }
        ]
    },
    {
        name: 'Бунт в казармах',
        description: 'Гладиаторы недовольны условиями',
        choices: [
            { 
                text: 'Усмирить силой', 
                effect: () => { 
                    gameState.gladiators.forEach(g => {
                        if (!g.isDead) g.loyalty -= 10;
                    });
                    logEvent('Лояльность гладиаторов упала', 'negative');
                }
            },
            { 
                text: 'Улучшить условия (-30 🪙)', 
                effect: () => { 
                    if (gameState.gold >= 30) {
                        gameState.gold -= 30;
                        gameState.gladiators.forEach(g => {
                            if (!g.isDead) g.loyalty += 15;
                        });
                        logEvent('Лояльность гладиаторов выросла', 'positive');
                    }
                }
            }
        ]
    }
];

function triggerRandomEvent() {
    const event = randomChoice(RANDOM_EVENTS);
    showEventModal(event);
}

================================================================================
14. ПРОВЕРКА УСЛОВИЙ ПОБЕДЫ/ПОРАЖЕНИЯ
================================================================================

function checkGameOver() {
    // Bankruptcy
    if (gameState.gold <= 0 && gameState.gladiators.filter(g => !g.isDead).length > 0) {
        const salary = gameState.gladiators.filter(g => !g.isDead)
            .reduce((sum, g) => sum + g.weeklySalary, 0);
        
        if (salary > 0 && gameState.day % CONFIG.DAYS_PER_WEEK === 0) {
            gameState.gameOver = true;
            logEvent('💀 БАНКРОТСТВО! Игра окончена.', 'negative');
            showGameOverScreen(false);
            return;
        }
    }
    
    // All gladiators dead
    const livingGladiators = gameState.gladiators.filter(g => !g.isDead);
    if (livingGladiators.length === 0 && gameState.gladiators.length > 0) {
        gameState.gameOver = true;
        logEvent('💀 Все гладиаторы погибли! Игра окончена.', 'negative');
        showGameOverScreen(false);
        return;
    }
    
    // Time limit
    if (gameState.day >= CONFIG.MAX_DAYS) {
        gameState.gameOver = true;
        
        // Check if player is #1 in ranking
        updateRankings();
        const playerRank = gameState.lanistaRanking.findIndex(l => l.name === 'Вы') + 1;
        
        if (playerRank === 1) {
            gameState.gameWon = true;
            logEvent('🏆 ПОБЕДА! Вы лучший ланиста Рима!', 'positive');
            showGameOverScreen(true);
        } else {
            logEvent(`Игра окончена. Ваша позиция: ${playerRank}`, 'neutral');
            showGameOverScreen(false, playerRank);
        }
    }
}

================================================================================
15. UI ФУНКЦИИ
================================================================================

function updateUI() {
    updateResourcesUI();
    updateTimeUI();
}

function updateResourcesUI() {
    document.getElementById('gold-display').querySelector('.resource-value').textContent = gameState.gold;
    document.getElementById('favor-display').querySelector('.resource-value').textContent = gameState.favor;
    document.getElementById('provisions-display').querySelector('.resource-value').textContent = gameState.provisions;
    document.getElementById('medicine-display').querySelector('.resource-value').textContent = gameState.medicine;
    document.getElementById('reputation-value').textContent = gameState.reputation;
    document.getElementById('league-display').textContent = getLeague(gameState.reputation);
}

function updateTimeUI() {
    document.getElementById('day-display').textContent = `День ${gameState.day}`;
    document.getElementById('week-display').textContent = `Неделя ${gameState.week}`;
    document.getElementById('weather-display').textContent = `${gameState.weather.icon} ${gameState.weather.name}`;
}

function updateLudusUI() {
    const capacity = CONFIG.BASE_BARRACKS_CAPACITY + 
                    (gameState.buildings.barracks.level - 1) * BUILDINGS.barracks.effects.capacity;
    const count = gameState.gladiators.filter(g => !g.isDead).length;
    
    document.getElementById('gladiator-count').textContent = count;
    document.getElementById('gladiator-capacity').textContent = capacity;
    document.getElementById('total-fame').textContent = Math.floor(gameState.totalFame);
    document.getElementById('total-wins').textContent = gameState.totalWins;
    document.getElementById('total-losses').textContent = gameState.totalLosses;
}

function updateGladiatorsUI() {
    const container = document.getElementById('gladiators-list');
    container.innerHTML = '';
    
    gameState.gladiators.forEach(g => {
        if (g.isDead) return; // Skip dead gladiators in main view
        
        const card = document.createElement('div');
        card.className = 'card';
        
        const healthPercent = (g.health / g.maxHealth) * 100;
        let healthClass = 'good';
        if (healthPercent < 50) healthClass = 'medium';
        if (healthPercent < 25) healthClass = '';
        
        const moodData = MOODS[g.mood];
        
        card.innerHTML = `
            <h3>${g.styleIcon} ${g.name}</h3>
            <p>Уровень ${g.level} | ${g.age} лет | ${g.regionName}</p>
            <p>Стиль: ${g.styleName}</p>
            
            <div class="health-bar">
                <div class="health-fill ${healthClass}" style="width: ${healthPercent}%">
                    ${g.health}/${g.maxHealth}
                </div>
            </div>
            
            <div class="stat-row">
                <span class="stat-label">Настроение:</span>
                <span class="mood-indicator ${moodData.class}">${moodData.name}</span>
            </div>
            
            <div class="stat-row">
                <span class="stat-label">⚔️ Сила:</span>
                <span class="stat-value">${g.stats.strength}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🏃 Ловкость:</span>
                <span class="stat-value">${g.stats.agility}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🎯 Точность:</span>
                <span class="stat-value">${g.stats.accuracy}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">💪 Выносливость:</span>
                <span class="stat-value">${g.stats.endurance}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🛡️ Дисциплина:</span>
                <span class="stat-value">${g.stats.discipline}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">👑 Харизма:</span>
                <span class="stat-value">${g.stats.charisma}</span>
            </div>
            
            <div style="margin-top: 10px;">
                <button class="action-btn" onclick="showGladiatorDetails(${g.id})">Подробнее</button>
                <button class="action-btn" onclick="trainGladiator(${g.id}, 'strength')">Тренировать силу</button>
                <button class="action-btn" onclick="healGladiator(${g.id})">Лечить</button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function updateMarketUI() {
    const container = document.getElementById('market-list');
    container.innerHTML = '';
    
    gameState.marketGladiators.forEach((g, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <h3>${g.styleIcon} ${g.name}</h3>
            <p>Уровень ${g.level} | ${g.age} лет | ${g.regionName}</p>
            <p>Стиль: ${g.styleName}</p>
            
            <div class="stat-row">
                <span class="stat-label">⚔️ Сила:</span>
                <span class="stat-value">${g.stats.strength}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">🏃 Ловкость:</span>
                <span class="stat-value">${g.stats.agility}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">💪 Выносливость:</span>
                <span class="stat-value">${g.stats.endurance}</span>
            </div>
            
            <p style="margin-top: 10px; color: #ffd700;">Цена: ${g.contractValue} 🪙</p>
            <p>Зарплата: ${g.weeklySalary} 🪙/нед</p>
            
            <button class="action-btn" onclick="buyGladiator(${index})">Купить</button>
        `;
        
        container.appendChild(card);
    });
}

function updateContractsUI() {
    const container = document.getElementById('contracts-list');
    container.innerHTML = '';
    
    gameState.availableContracts.forEach((c, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let stars = '';
        for (let i = 0; i < c.stars; i++) {
            stars += '⭐';
        }
        
        card.innerHTML = `
            <h3>${c.typeName}</h3>
            <p>Сложность: ${stars}</p>
            <p>Враг: ${c.enemyName} x${c.enemyCount}</p>
            <p>Уровень врага: ${c.enemyLevel}</p>
            <p>Награда: ${c.goldReward} 🪙 ${c.favorReward > 0 ? '| ' + c.favorReward + ' 👑' : ''}</p>
            <p>Слава: +${c.fameReward}</p>
            
            <button class="action-btn" onclick="selectGladiatorsForContract(${index})">Принять</button>
        `;
        
        container.appendChild(card);
    });
}

function updateBuildingsUI() {
    const container = document.getElementById('buildings-list');
    container.innerHTML = '';
    
    for (const [key, data] of Object.entries(BUILDINGS)) {
        const building = gameState.buildings[key];
        const cost = building.level * 100;
        
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <h3>${data.icon} ${data.name}</h3>
            <p>${data.description}</p>
            <p>Уровень: ${building.level} / ${data.maxLevel}</p>
            
            ${building.level < data.maxLevel ? `
                <button class="action-btn" onclick="upgradeBuilding('${key}')" ${gameState.gold < cost ? 'disabled' : ''}>
                    Улучшить (${cost} 🪙)
                </button>
            ` : '<p style="color: #22c55e;">Максимальный уровень</p>'}
        `;
        
        container.appendChild(card);
    }
}

function updateEventLog() {
    const container = document.getElementById('event-log');
    container.innerHTML = '';
    
    gameState.eventLog.slice(0, 50).forEach(entry => {
        const div = document.createElement('div');
        div.className = `log-entry ${entry.type}`;
        div.innerHTML = `<span class="log-time">[${entry.time}]</span> ${entry.message}`;
        container.appendChild(div);
    });
}

function updateRankingsUI() {
    const lanistaContainer = document.getElementById('lanista-ranking');
    const gladiatorContainer = document.getElementById('gladiator-ranking');
    
    // Lanista ranking
    lanistaContainer.innerHTML = '<div class="cards-grid"></div>';
    gameState.lanistaRanking.slice(0, 10).forEach((l, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>#${index + 1} ${l.name}</h3>
            <p>Слава: ${Math.floor(l.fame)}</p>
            <p>Репутация: ${l.reputation}</p>
        `;
        lanistaContainer.querySelector('.cards-grid').appendChild(div);
    });
    
    // Gladiator ranking
    gladiatorContainer.innerHTML = '<div class="cards-grid"></div>';
    gameState.gladiatorRanking.slice(0, 10).forEach((g, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <h3>#${index + 1} ${g.name}</h3>
            <p>Слава: ${Math.floor(g.fame)}</p>
            <p>Побед: ${g.wins}</p>
        `;
        gladiatorContainer.querySelector('.cards-grid').appendChild(div);
    });
}

function updateTournamentUI() {
    const container = document.getElementById('tournament-bracket');
    
    if (gameState.tournamentBracket) {
        // Show bracket
        container.innerHTML = '<h3>Турнирная сетка</h3>';
        // Simplified bracket display
        gameState.tournamentBracket.round1.forEach((match, i) => {
            container.innerHTML += `
                <div class="card">
                    <p>${match.p1.name} vs ${match.p2.name}</p>
                    ${match.winner ? `<p style="color: #22c55e;">Победитель: ${match.winner.name}</p>` : ''}
                </div>
            `;
        });
    } else {
        const daysUntilSunday = CONFIG.DAYS_PER_WEEK - (gameState.day % CONFIG.DAYS_PER_WEEK);
        document.getElementById('next-tournament-day').textContent = 
            `Через ${daysUntilSunday} дн. (Воскресенье)`;
    }
}

================================================================================
16. МОДАЛЬНЫЕ ОКНА
================================================================================

function showModal(content) {
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = content;
    overlay.classList.remove('hidden');
    
    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    };
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

function showGladiatorDetails(gladiatorId) {
    const g = gameState.gladiators.find(gl => gl.id === gladiatorId);
    if (!g) return;
    
    let bodyPartsHTML = '';
    for (const [part, status] of Object.entries(g.bodyParts)) {
        bodyPartsHTML += `<span class="body-part ${status}">${part}</span>`;
    }
    
    let traitsHTML = g.traits.map(t => TRAITS[t]?.name || t).join(', ');
    
    const content = `
        <span class="modal-close" onclick="closeModal()">×</span>
        <h2>${g.styleIcon} ${g.name}</h2>
        
        <div class="stat-row"><span class="stat-label">Возраст:</span><span>${g.age} лет (${g.ageCategory})</span></div>
        <div class="stat-row"><span class="stat-label">Происхождение:</span><span>${g.regionName}</span></div>
        <div class="stat-row"><span class="stat-label">Стиль боя:</span><span>${g.styleName}</span></div>
        <div class="stat-row"><span class="stat-label">Спецприём:</span><span>${g.specialMove}</span></div>
        <div class="stat-row"><span class="stat-label">Уровень:</span><span>${g.level} (${g.exp}/${g.expToNext} XP)</span></div>
        
        <h3 style="margin-top: 15px;">Характеристики</h3>
        <div class="stat-row"><span class="stat-label">⚔️ Сила:</span><span class="stat-value">${g.stats.strength}</span></div>
        <div class="stat-row"><span class="stat-label">🏃 Ловкость:</span><span class="stat-value">${g.stats.agility}</span></div>
        <div class="stat-row"><span class="stat-label">🎯 Точность:</span><span class="stat-value">${g.stats.accuracy}</span></div>
        <div class="stat-row"><span class="stat-label">💪 Выносливость:</span><span class="stat-value">${g.stats.endurance}</span></div>
        <div class="stat-row"><span class="stat-label">🛡️ Дисциплина:</span><span class="stat-value">${g.stats.discipline}</span></div>
        <div class="stat-row"><span class="stat-label">👑 Харизма:</span><span class="stat-value">${g.stats.charisma}</span></div>
        
        <h3 style="margin-top: 15px;">Состояние</h3>
        <div class="stat-row"><span class="stat-label">Здоровье:</span><span>${g.health}/${g.maxHealth}</span></div>
        <div class="stat-row"><span class="stat-label">Стресс:</span><span>${g.stress}</span></div>
        <div class="stat-row"><span class="stat-label">Лояльность:</span><span>${g.loyalty}</span></div>
        
        <h3 style="margin-top: 15px;">Части тела</h3>
        <div>${bodyPartsHTML}</div>
        
        <h3 style="margin-top: 15px;">Черты характера</h3>
        <p>${traitsHTML}</p>
        
        <h3 style="margin-top: 15px;">Статистика</h3>
        <div class="stat-row"><span class="stat-label">Побед:</span><span>${g.wins}</span></div>
        <div class="stat-row"><span class="stat-label">Поражений:</span><span>${g.losses}</span></div>
        <div class="stat-row"><span class="stat-label">Убийств:</span><span>${g.kills}</span></div>
        <div class="stat-row"><span class="stat-label">Слава:</span><span>${Math.floor(g.fame)}</span></div>
    `;
    
    showModal(content);
}

function selectGladiatorsForContract(contractIndex) {
    const contract = gameState.availableContracts[contractIndex];
    if (!contract) return;
    
    let content = `
        <span class="modal-close" onclick="closeModal()">×</span>
        <h2>Выберите гладиаторов для: ${contract.typeName}</h2>
        <p>Враг: ${contract.enemyName} x${contract.enemyCount} (Уровень ${contract.enemyLevel})</p>
        <p>Награда: ${contract.goldReward} 🪙</p>
        
        <div style="margin: 20px 0;">
    `;
    
    gameState.gladiators.filter(g => !g.isDead && g.health > 0).forEach(g => {
        content += `
            <label style="display: block; padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.05); border-radius: 5px; cursor: pointer;">
                <input type="checkbox" name="gladiator_select" value="${g.id}" style="margin-right: 10px;">
                ${g.name} (HP: ${g.health}/${g.maxHealth}, Уровень: ${g.level})
            </label>
        `;
    });
    
    content += `
        </div>
        <button class="action-btn" onclick="confirmContractSelection(${contractIndex})">В бой!</button>
    `;
    
    showModal(content);
}

function confirmContractSelection(contractIndex) {
    const checkboxes = document.querySelectorAll('input[name="gladiator_select"]:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    closeModal();
    acceptContract(contractIndex, selectedIds);
}

function showCombatModal(playerGladiators, enemies, contract) {
    let content = `
        <span class="modal-close" onclick="closeModal()">×</span>
        <h2>⚔️ БОЙ ⚔️</h2>
        <p>${contract.typeName} - ${contract.enemyName}</p>
        
        <div class="arena-container">
    `;
    
    // Player gladiators
    playerGladiators.forEach((g, i) => {
        content += `
            <div class="fighter player" style="bottom: ${50 + i * 60}px;">
                <span class="fighter-sprite">🗡️</span>
                <div class="fighter-info">
                    <strong>${g.name}</strong><br>
                    HP: ${g.health}/${g.maxHealth}
                </div>
            </div>
        `;
    });
    
    // Enemies
    enemies.forEach((e, i) => {
        content += `
            <div class="fighter enemy" style="bottom: ${50 + i * 60}px;">
                <span class="fighter-sprite">${e.icon}</span>
                <div class="fighter-info">
                    <strong>${e.name}</strong><br>
                    HP: ${e.health}/${e.maxHealth}
                </div>
            </div>
        `;
    });
    
    content += `
        </div>
        <div class="combat-log" id="combat-log"></div>
    `;
    
    showModal(content);
    
    // Resolve combat after short delay
    setTimeout(() => {
        const result = resolveCombat(playerGladiators, enemies, contract);
        
        const logDiv = document.getElementById('combat-log');
        result.combatLog.forEach(entry => {
            logDiv.innerHTML += `<div class="combat-action ${entry.class || ''}">${entry.message}</div>`;
        });
        
        // Auto-close after combat
        setTimeout(() => {
            if (result.playerWon) {
                logDiv.innerHTML += '<div style="color: #22c55e; font-weight: bold; margin-top: 10px;">ПОБЕДА!</div>';
            } else {
                logDiv.innerHTML += '<div style="color: #ef4444; font-weight: bold; margin-top: 10px;">ПОРАЖЕНИЕ...</div>';
            }
        }, 500);
    }, 1000);
}

function showTournamentModal(bracket) {
    let content = `
        <span class="modal-close" onclick="closeModal()">×</span>
        <h2>🏆 Турнир Ланист 🏆</h2>
        <h3>Четвертьфинал</h3>
    `;
    
    bracket.round1.forEach((match, i) => {
        content += `
            <div class="card" style="margin: 10px 0;">
                <p>${match.p1.name} vs ${match.p2.name}</p>
            </div>
        `;
    });
    
    showModal(content);
    
    // Simulate tournament
    setTimeout(() => {
        resolveTournamentRound(bracket.round1, bracket.semifinals);
        
        setTimeout(() => {
            resolveTournamentRound(bracket.semifinals, [{}]);
            
            setTimeout(() => {
                bracket.final = {
                    p1: bracket.semifinals[0]?.winner,
                    p2: bracket.semifinals[1]?.winner,
                    winner: null
                };
                
                setTimeout(() => {
                    const p1Power = bracket.final.p1.power * randomFloat(0.8, 1.2);
                    const p2Power = bracket.final.p2.power * randomFloat(0.8, 1.2);
                    bracket.final.winner = p1Power >= p2Power ? bracket.final.p1 : bracket.final.p2;
                    
                    completeTournament();
                    closeModal();
                }, 1500);
            }, 1500);
        }, 1500);
    }, 1000);
}

function showEventModal(event) {
    let content = `
        <span class="modal-close" onclick="closeModal()">×</span>
        <h2>📜 ${event.name}</h2>
        <p>${event.description}</p>
        
        <div style="margin-top: 20px;">
    `;
    
    event.choices.forEach((choice, index) => {
        content += `
            <button class="action-btn" style="display: block; width: 100%; margin: 10px 0;" 
                    onclick="resolveEvent(${gameState.eventLog.length - 1}, ${index})">
                ${choice.text}
            </button>
        `;
    });
    
    content += '</div>';
    
    // Store current event for resolution
    gameState.currentEvent = event;
    
    showModal(content);
}

function resolveEvent(logIndex, choiceIndex) {
    if (gameState.currentEvent) {
        gameState.currentEvent.choices[choiceIndex].effect();
        gameState.currentEvent = null;
    }
    closeModal();
}

function showGameOverScreen(won, rank = null) {
    let content = `
        <h2>${won ? '🏆 ПОБЕДА! 🏆' : '💀 ИГРА ОКОНЧЕНА 💀'}</h2>
    `;
    
    if (won) {
        content += '<p style="color: #ffd700; font-size: 1.2em;">Вы стали лучшим ланистой Рима!</p>';
    } else if (rank) {
        content += `<p>Ваша финальная позиция: #${rank}</p>`;
    }
    
    content += `
        <h3>Статистика игры:</h3>
        <p>Дней прожито: ${gameState.day}</p>
        <p>Побед: ${gameState.totalWins}</p>
        <p>Поражений: ${gameState.totalLosses}</p>
        <p>Контрактов выполнено: ${gameState.stats.contractsCompleted}</p>
        <p>Турниров выиграно: ${gameState.stats.tournamentsWon}</p>
        <p>Гладиаторов погибло: ${gameState.stats.gladiatorsKilled}</p>
        <p>Заработано: ${gameState.stats.totalEarnings} 🪙</p>
        <p>Потрачено: ${gameState.stats.totalSpent} 🪙</p>
        
        <button class="action-btn" onclick="location.reload()" style="margin-top: 20px;">Начать заново</button>
    `;
    
    showModal(content);
}

================================================================================
17. НАЧАЛЬНЫЕ ДАННЫЕ И ИНИЦИАЛИЗАЦИЯ
================================================================================

// Add starting gladiator
function addStartingGladiator() {
    const starter = generateGladiator();
    starter.name = "Spartacus Primus";
    starter.stats.strength += 10;
    starter.stats.discipline += 10;
    starter.maxHealth = Math.floor(starter.stats.endurance * 2);
    starter.health = starter.maxHealth;
    starter.contractValue = Math.floor((Object.values(starter.stats).reduce((a, b) => a + b, 0)) * 5);
    starter.weeklySalary = Math.floor(starter.contractValue * 0.1);
    
    gameState.gladiators.push(starter);
    logEvent(`Гладиатор ${starter.name} присоединился к вашему лудусу!`, 'positive');
}

// Initialize equipment shop
function refreshEquipmentShop() {
    const weapons = [
        { name: 'Гладиус', type: 'weapon', damage: 10, speed: 5, rarity: 'common', cost: 50 },
        { name: 'Сика', type: 'weapon', damage: 12, speed: 4, rarity: 'uncommon', cost: 80 },
        { name: 'Трезубец', type: 'weapon', damage: 15, speed: 3, rarity: 'rare', cost: 120 },
        { name: 'Копьё', type: 'weapon', damage: 18, speed: 2, rarity: 'rare', cost: 150 },
        { name: 'Двойные мечи', type: 'weapon', damage: 20, speed: 6, rarity: 'legendary', cost: 250 }
    ];
    
    const armors = [
        { name: 'Лёгкая броня', type: 'armor', defense: 5, speedPenalty: 0, rarity: 'common', cost: 40 },
        { name: 'Средняя броня', type: 'armor', defense: 10, speedPenalty: -1, rarity: 'uncommon', cost: 70 },
        { name: 'Тяжёлая броня', type: 'armor', defense: 15, speedPenalty: -2, rarity: 'rare', cost: 120 },
        { name: 'Чешуйчатая броня', type: 'armor', defense: 20, speedPenalty: -1, rarity: 'legendary', cost: 200 }
    ];
    
    gameState.equipmentShop = [];
    
    // Add random items
    const itemCount = 3 + gameState.buildings.armory.level;
    for (let i = 0; i < itemCount; i++) {
        if (Math.random() > 0.5) {
            const item = { ...randomChoice(weapons), id: Date.now() + i };
            gameState.equipmentShop.push(item);
        } else {
            const item = { ...randomChoice(armors), id: Date.now() + i };
            gameState.equipmentShop.push(item);
        }
    }
}

// Simulate bot lanistas
function simulateBotLanistas() {
    // Bots get random gold and reputation changes
    // This is simplified - in full version would track individual bots
    logEvent('Другие ланисты активно действуют на арене...', 'neutral');
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            // Add active to clicked
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(`tab-${tabId}`).classList.add('active');
            
            // Update specific UI when tab is opened
            if (tabId === 'gladiators') updateGladiatorsUI();
            if (tabId === 'market') updateMarketUI();
            if (tabId === 'contracts') updateContractsUI();
            if (tabId === 'buildings') updateBuildingsUI();
            if (tabId === 'rankings') updateRankings();
            if (tabId === 'tournament') updateTournamentUI();
        });
    });
}

// Setup quick action buttons
function setupQuickActions() {
    document.getElementById('btn-refresh-market')?.addEventListener('click', forceRefreshMarket);
    document.getElementById('btn-refresh-contracts')?.addEventListener('click', forceRefreshContracts);
    document.getElementById('btn-register-tournament')?.addEventListener('click', registerForTournament);
    
    document.getElementById('btn-train-all')?.addEventListener('click', () => {
        let trained = 0;
        gameState.gladiators.forEach(g => {
            if (!g.isDead && g.trainingCount < 1) {
                if (trainGladiator(g.id, 'strength')) {
                    trained++;
                }
            }
        });
        if (trained === 0) {
            logEvent('Нет гладиаторов для тренировки или не хватает золота', 'neutral');
        }
    });
    
    document.getElementById('btn-heal-all')?.addEventListener('click', () => {
        let healed = 0;
        gameState.gladiators.forEach(g => {
            if (!g.isDead && g.health < g.maxHealth) {
                if (healGladiator(g.id)) {
                    healed++;
                }
            }
        });
        if (healed === 0) {
            logEvent('Нет раненых гладиаторов или не хватает медицины', 'neutral');
        }
    });
}

// Initialize game
function initGame() {
    console.log('Initializing LUDUS...');
    
    // Add starting resources
    addStartingGladiator();
    
    // Initial market
    refreshMarket();
    
    // Initial contracts
    refreshContracts();
    
    // Initial equipment shop
    refreshEquipmentShop();
    
    // Setup UI
    setupNavigation();
    setupQuickActions();
    
    // Update all UI
    updateResourcesUI();
    updateTimeUI();
    updateLudusUI();
    updateEventLog();
    updateGladiatorsUI();
    
    // Log start
    logEvent('Добро пожаловать в LUDUS! Вы стали ланистой.', 'positive');
    logEvent('У вас есть один гладиатор и 500 золотых.', 'neutral');
    
    // Start game loop
    startGameLoop();
    
    console.log('Game started!');
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', initGame);