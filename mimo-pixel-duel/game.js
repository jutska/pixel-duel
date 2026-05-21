// ===== MiMo Pixel Duel - Game Engine =====

// Game State
let gameState = {
    phase: 'idle', // idle, draw, main, battle, end
    turn: 0,
    currentPlayer: 'player', // player or opponent
    player: {
        lp: 4000,
        deck: [],
        hand: [],
        field: { monsters: [null, null, null], spells: [null, null, null] },
        graveyard: [],
        hasNormalSummoned: false,
        hasAttacked: [],
        protectedThisTurn: false,
        skipBattle: false,
        victoriesThisDuel: 0
    },
    opponent: {
        lp: 4000,
        deck: [],
        hand: [],
        field: { monsters: [null, null, null], spells: [null, null, null] },
        graveyard: [],
        hasNormalSummoned: false,
        hasAttacked: [],
        protectedThisTurn: false,
        skipBattle: false,
        victoriesThisDuel: 0
    },
    selectedHandCard: null,
    selectedFieldCard: null,
    battleMode: false,
    attackingMonster: null,
    settings: {
        difficulty: 'normal',
        apiKey: '',
        sfx: true,
        animSpeed: 'normal'
    }
};

// Animation speed mapping
const ANIM_SPEEDS = { fast: 300, normal: 600, slow: 1000 };

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showTitle() { showScreen('title-screen'); }
function showHowToPlay() { showScreen('howtoplay-screen'); }
function showDeckBuilder() { 
    showScreen('deck-screen'); 
    renderDeckBuilder();
}
function showSettings() { showScreen('settings-screen'); }

// ===== SETTINGS =====
function saveSettings() {
    gameState.settings.difficulty = document.getElementById('ai-difficulty').value;
    gameState.settings.apiKey = document.getElementById('mimo-api-key').value;
    gameState.settings.sfx = document.getElementById('sfx-toggle').value === 'on';
    gameState.settings.animSpeed = document.getElementById('anim-speed').value;
}

// ===== DECK BUILDER =====
let playerDeck = [...DEFAULT_DECK];

function renderDeckBuilder() {
    const grid = document.getElementById('deck-grid');
    grid.innerHTML = '';
    CARD_DATABASE.forEach(card => {
        const item = document.createElement('div');
        item.className = `deck-card-item ${playerDeck.includes(card.id) ? 'selected' : ''}`;
        item.innerHTML = `
            <div class="card-emoji">${renderPixelArt(card.pixels, 3)}</div>
            <span class="card-item-name">${card.name}</span>
            <span class="card-item-type type-${card.type}">${card.type.toUpperCase()}</span>
            ${card.type === 'monster' ? `<span class="card-item-stats">ATK:${card.atk}<br>DEF:${card.def}</span>` : `<span class="card-item-stats">${card.desc.substring(0, 30)}...</span>`}
        `;
        item.onclick = () => toggleDeckCard(card.id, item);
        grid.appendChild(item);
    });
    document.getElementById('deck-count').textContent = playerDeck.length;
}

function toggleDeckCard(cardId, element) {
    const idx = playerDeck.indexOf(cardId);
    if (idx > -1) {
        playerDeck.splice(idx, 1);
        element.classList.remove('selected');
    } else if (playerDeck.length < 20) {
        playerDeck.push(cardId);
        element.classList.add('selected');
    }
    document.getElementById('deck-count').textContent = playerDeck.length;
}

function randomDeck() {
    playerDeck = [];
    const shuffled = [...CARD_DATABASE].sort(() => Math.random() - 0.5);
    playerDeck = shuffled.slice(0, 20).map(c => c.id);
    renderDeckBuilder();
}

// ===== DUEL START =====
function startDuel() {
    saveSettings();
    
    // Reset game state
    gameState.turn = 0;
    gameState.currentPlayer = 'player';
    gameState.phase = 'idle';
    gameState.selectedHandCard = null;
    gameState.selectedFieldCard = null;
    gameState.battleMode = false;
    gameState.attackingMonster = null;

    // Setup player
    gameState.player = {
        lp: 4000,
        deck: shuffle([...playerDeck].map(id => getCardById(id))),
        hand: [],
        field: { monsters: [null, null, null], spells: [null, null, null] },
        graveyard: [],
        hasNormalSummoned: false,
        hasAttacked: [],
        protectedThisTurn: false,
        skipBattle: false,
        victoriesThisDuel: 0
    };

    // Setup AI opponent
    const aiDeckIds = AI_DECKS[gameState.settings.difficulty] || AI_DECKS.normal;
    gameState.opponent = {
        lp: 4000,
        deck: shuffle([...aiDeckIds].map(id => getCardById(id))),
        hand: [],
        field: { monsters: [null, null, null], spells: [null, null, null] },
        graveyard: [],
        hasNormalSummoned: false,
        hasAttacked: [],
        protectedThisTurn: false,
        skipBattle: false,
        victoriesThisDuel: 0
    };

    // Draw initial hands (5 cards each)
    for (let i = 0; i < 5; i++) {
        drawCard('player');
        drawCard('opponent');
    }

    showScreen('duel-screen');
    clearLog();
    addLog('⚔️ DUEL START! May the best duelist win!', 'special');
    addLog('🤖 MiMo AI is ready to duel!', 'ai');
    
    // Start first turn
    startPlayerTurn();
}

// ===== TURN MANAGEMENT =====
function startPlayerTurn() {
    gameState.turn++;
    gameState.currentPlayer = 'player';
    gameState.player.hasNormalSummoned = false;
    gameState.player.hasAttacked = [];
    gameState.player.protectedThisTurn = false;
    gameState.battleMode = false;
    gameState.attackingMonster = null;
    gameState.selectedHandCard = null;

    updatePhase('DRAW PHASE');
    document.getElementById('turn-count').textContent = `Turn ${gameState.turn}`;
    
    // Draw phase
    if (gameState.turn > 1) {
        drawCard('player');
    }
    
    setTimeout(() => {
        updatePhase('MAIN PHASE');
        gameState.phase = 'main';
        updateUI();
        updateButtons();
    }, getAnimDelay());
}

function endTurn() {
    gameState.phase = 'end';
    gameState.battleMode = false;
    gameState.attackingMonster = null;
    gameState.selectedHandCard = null;
    deselectAll();
    
    // End of turn effects
    processEndOfTurnEffects('player');
    
    updatePhase('END PHASE');
    addLog('--- End of your turn ---');
    
    setTimeout(() => {
        startOpponentTurn();
    }, getAnimDelay());
}

function startOpponentTurn() {
    gameState.currentPlayer = 'opponent';
    gameState.opponent.hasNormalSummoned = false;
    gameState.opponent.hasAttacked = [];
    gameState.opponent.protectedThisTurn = false;
    gameState.battleMode = false;

    updatePhase('OPPONENT TURN');
    addLog('🤖 MiMo AI\'s turn begins!', 'ai');
    
    // AI draw
    drawCard('opponent');
    
    // AI takes actions
    setTimeout(() => aiTurn(), getAnimDelay() * 2);
}

// ===== CARD DRAWING =====
function drawCard(who) {
    const state = gameState[who];
    if (state.deck.length === 0) {
        // Deck out - lose
        if (who === 'player') {
            endDuel(false, 'Deck out!');
        } else {
            endDuel(true, 'Opponent deck out!');
        }
        return;
    }
    
    const card = state.deck.pop();
    state.hand.push(card);
    
    if (who === 'player') {
        addLog(`Drew: ${card.name}`);
    }
    
    updateUI();
}

// ===== HAND INTERACTION =====
function selectHandCard(index) {
    if (gameState.currentPlayer !== 'player' || gameState.phase !== 'main') return;
    if (gameState.battleMode) return;
    
    deselectAll();
    gameState.selectedHandCard = index;
    gameState.selectedFieldCard = null;
    
    const handCards = document.querySelectorAll('.hand-card');
    handCards[index]?.classList.add('selected');
    
    updateButtons();
}

function selectZone(zone) {
    if (gameState.currentPlayer !== 'player') return;
    
    if (gameState.battleMode && gameState.attackingMonster !== null) {
        // Selecting attack target
        const zoneId = zone.id;
        if (zoneId.startsWith('opp-monster')) {
            const idx = parseInt(zoneId.split('-')[2]) - 1;
            if (gameState.opponent.field.monsters[idx]) {
                executeAttack(gameState.attackingMonster, idx);
            }
        }
        return;
    }
    
    if (gameState.phase === 'battle' && zone.id.startsWith('player-monster')) {
        const idx = parseInt(zone.id.split('-')[2]) - 1;
        const monster = gameState.player.field.monsters[idx];
        if (monster && !gameState.player.hasAttacked.includes(idx)) {
            gameState.attackingMonster = idx;
            highlightAttackTargets();
            addLog(`${monster.art} ${monster.name} ready to attack!`);
        }
    }
}

function highlightAttackTargets() {
    // Clear previous highlights
    document.querySelectorAll('.attack-target').forEach(el => el.classList.remove('attack-target'));
    
    // Highlight opponent monsters
    const hasOppMonsters = gameState.opponent.field.monsters.some(m => m !== null);
    
    if (hasOppMonsters) {
        gameState.opponent.field.monsters.forEach((m, i) => {
            if (m) {
                document.getElementById(`opp-monster-${i + 1}`).classList.add('attack-target');
            }
        });
    } else {
        // Can attack directly - highlight divider
        document.querySelector('.field-divider').classList.add('attack-target');
    }
}

// ===== SUMMONING =====
function summonCard() {
    if (gameState.selectedHandCard === null) return;
    
    const card = gameState.player.hand[gameState.selectedHandCard];
    if (!card) return;
    
    if (card.type === 'monster') {
        if (gameState.player.hasNormalSummoned) {
            addLog('Already summoned this turn!', 'damage');
            return;
        }
        
        // Find empty monster zone
        const emptyZone = gameState.player.field.monsters.findIndex(m => m === null);
        if (emptyZone === -1) {
            addLog('No empty monster zones!', 'damage');
            return;
        }
        
        // Level 5+ requires tribute (simplified - just needs a monster on field)
        if (card.level >= 5) {
            const tributeIdx = gameState.player.field.monsters.findIndex(m => m !== null);
            if (tributeIdx === -1) {
                addLog('Need a tribute for high-level monster!', 'damage');
                return;
            }
            // Tribute the monster
            const tributed = gameState.player.field.monsters[tributeIdx];
            gameState.player.graveyard.push(tributed);
            gameState.player.field.monsters[tributeIdx] = null;
            addLog(`Tributed ${tributed.art} ${tributed.name}`, 'special');
        }
        
        // Summon
        gameState.player.field.monsters[emptyZone] = card;
        gameState.player.hand.splice(gameState.selectedHandCard, 1);
        gameState.player.hasNormalSummoned = true;
        gameState.selectedHandCard = null;
        
        addLog(`Summoned ${card.name} (ATK:${card.atk}/DEF:${card.def})!`, 'special');
        
        // Trigger summon effects
        triggerEffect(card, 'player', 'summon');
        
        // Animate
        const zoneEl = document.getElementById(`player-monster-${emptyZone + 1}`);
        animateSummon(zoneEl);
    } else if (card.type === 'spell') {
        // Activate spell immediately
        activateSpell(card, 'player');
        gameState.player.hand.splice(gameState.selectedHandCard, 1);
        gameState.selectedHandCard = null;
    }
    
    deselectAll();
    updateUI();
    updateButtons();
}

function setCard() {
    if (gameState.selectedHandCard === null) return;
    
    const card = gameState.player.hand[gameState.selectedHandCard];
    if (!card) return;
    
    if (card.type === 'trap' || card.type === 'spell') {
        const emptyZone = gameState.player.field.spells.findIndex(s => s === null);
        if (emptyZone === -1) {
            addLog('No empty spell/trap zones!', 'damage');
            return;
        }
        
        card.faceDown = true;
        gameState.player.field.spells[emptyZone] = card;
        gameState.player.hand.splice(gameState.selectedHandCard, 1);
        gameState.selectedHandCard = null;
        addLog(`Set a card face-down.`);
    } else if (card.type === 'monster') {
        if (gameState.player.hasNormalSummoned) {
            addLog('Already summoned this turn!', 'damage');
            return;
        }
        const emptyZone = gameState.player.field.monsters.findIndex(m => m === null);
        if (emptyZone === -1) {
            addLog('No empty monster zones!', 'damage');
            return;
        }
        card.faceDown = true;
        card.defenseMode = true;
        gameState.player.field.monsters[emptyZone] = card;
        gameState.player.hand.splice(gameState.selectedHandCard, 1);
        gameState.player.hasNormalSummoned = true;
        gameState.selectedHandCard = null;
        addLog(`Set a monster in defense mode.`);
    }
    
    deselectAll();
    updateUI();
    updateButtons();
}

// ===== BATTLE PHASE =====
function enterBattlePhase() {
    if (gameState.turn === 1 && gameState.currentPlayer === 'player') {
        addLog('Cannot attack on the first turn!', 'damage');
        return;
    }
    
    if (gameState.player.skipBattle) {
        addLog('Battle Phase skipped by opponent\'s trap!', 'damage');
        gameState.player.skipBattle = false;
        return;
    }
    
    gameState.phase = 'battle';
    gameState.battleMode = true;
    updatePhase('BATTLE PHASE');
    addLog('⚔️ Entering Battle Phase! Select a monster to attack.');
    updateButtons();
    
    // Make player monsters clickable for attack
    gameState.player.field.monsters.forEach((m, i) => {
        if (m && !m.faceDown && !gameState.player.hasAttacked.includes(i)) {
            const zone = document.getElementById(`player-monster-${i + 1}`);
            zone.classList.add('selected');
            zone.onclick = () => {
                deselectAll();
                gameState.attackingMonster = i;
                zone.classList.add('selected');
                highlightAttackTargets();
            };
        }
    });
    
    // Make opponent field clickable
    gameState.opponent.field.monsters.forEach((m, i) => {
        const zone = document.getElementById(`opp-monster-${i + 1}`);
        zone.onclick = () => {
            if (gameState.attackingMonster !== null) {
                if (m) {
                    executeAttack(gameState.attackingMonster, i);
                }
            }
        };
    });
    
    // Direct attack if no opponent monsters
    document.querySelector('.field-divider').onclick = () => {
        if (gameState.attackingMonster !== null && !gameState.opponent.field.monsters.some(m => m !== null)) {
            executeDirectAttack(gameState.attackingMonster);
        }
    };
}

function executeAttack(attackerIdx, targetIdx) {
    const attacker = gameState.player.field.monsters[attackerIdx];
    const target = gameState.opponent.field.monsters[targetIdx];
    
    if (!attacker || !target) return;
    
    // Check for traps
    const trapResult = checkTraps('opponent', 'attack', { attacker, target, attackerIdx, targetIdx });
    if (trapResult === 'negated') {
        gameState.player.hasAttacked.push(attackerIdx);
        resetBattleSelection();
        updateUI();
        return;
    }
    
    // Flip face-down monster
    if (target.faceDown) {
        target.faceDown = false;
        addLog(`Revealed: ${target.art} ${target.name}!`, 'special');
    }
    
    const atkValue = attacker.atk + (attacker.atkBonus || 0);
    const defValue = target.defenseMode ? target.def : target.atk;
    
    addLog(`${attacker.art} ${attacker.name} attacks ${target.art} ${target.name}!`);
    animateAttack(document.getElementById(`player-monster-${attackerIdx + 1}`));
    screenShake();
    
    if (gameState.opponent.protectedThisTurn) {
        addLog('Attack blocked by Magic Barrier!', 'special');
    } else if (atkValue > defValue) {
        const damage = target.defenseMode ? 0 : atkValue - defValue;
        gameState.opponent.field.monsters[targetIdx] = null;
        gameState.opponent.graveyard.push(target);
        
        if (damage > 0) {
            dealDamage('opponent', damage);
            showDamageNumber(damage, 'top');
        }
        addLog(`${target.art} ${target.name} destroyed!${damage > 0 ? ` (-${damage} LP)` : ''}`, 'damage');
        animateDestroy(document.getElementById(`opp-monster-${targetIdx + 1}`));
        gameState.player.victoriesThisDuel++;
    } else if (atkValue === defValue) {
        // Both destroyed
        gameState.player.field.monsters[attackerIdx] = null;
        gameState.opponent.field.monsters[targetIdx] = null;
        gameState.player.graveyard.push(attacker);
        gameState.opponent.graveyard.push(target);
        addLog('Both warriors destroyed!', 'damage');
        animateDestroy(document.getElementById(`player-monster-${attackerIdx + 1}`));
        animateDestroy(document.getElementById(`opp-monster-${targetIdx + 1}`));
    } else {
        // Attacker loses
        const damage = defValue - atkValue;
        if (!target.defenseMode) {
            gameState.player.field.monsters[attackerIdx] = null;
            gameState.player.graveyard.push(attacker);
            dealDamage('player', damage);
            showDamageNumber(damage, 'bottom');
            addLog(`${attacker.art} ${attacker.name} destroyed! (-${damage} LP)`, 'damage');
            animateDestroy(document.getElementById(`player-monster-${attackerIdx + 1}`));
        } else {
            dealDamage('player', damage);
            showDamageNumber(damage, 'bottom');
            addLog(`Bounced off defense! (-${damage} LP)`, 'damage');
        }
    }
    
    gameState.player.hasAttacked.push(attackerIdx);
    resetBattleSelection();
    
    setTimeout(() => {
        if (checkWinCondition()) return;
        updateUI();
    }, getAnimDelay());
}

function executeDirectAttack(attackerIdx) {
    const attacker = gameState.player.field.monsters[attackerIdx];
    if (!attacker) return;
    
    // Check for traps
    const trapResult = checkTraps('opponent', 'directAttack', { attacker, attackerIdx });
    if (trapResult === 'negated') {
        gameState.player.hasAttacked.push(attackerIdx);
        resetBattleSelection();
        updateUI();
        return;
    }
    
    const damage = attacker.atk + (attacker.atkBonus || 0);
    addLog(`${attacker.art} ${attacker.name} attacks directly! (-${damage} LP)`, 'damage');
    dealDamage('opponent', damage);
    
    animateAttack(document.getElementById(`player-monster-${attackerIdx + 1}`));
    showDirectAttackBeam();
    showDamageNumber(damage, 'top');
    screenShake();
    
    gameState.player.hasAttacked.push(attackerIdx);
    resetBattleSelection();
    
    setTimeout(() => {
        if (checkWinCondition()) return;
        updateUI();
    }, getAnimDelay());
}

function resetBattleSelection() {
    gameState.attackingMonster = null;
    document.querySelectorAll('.attack-target').forEach(el => el.classList.remove('attack-target'));
    document.querySelectorAll('.field-zone.selected').forEach(el => el.classList.remove('selected'));
}

// ===== SPELL ACTIVATION =====
function activateSpell(card, who) {
    const owner = gameState[who];
    const opponent = who === 'player' ? gameState.opponent : gameState.player;
    
    addLog(`${who === 'player' ? '>' : '>'} Activated ${card.name}!`, 'special');
    
    // Check for spell negation trap
    const otherSide = who === 'player' ? 'opponent' : 'player';
    const trapResult = checkTraps(otherSide, 'spell', { card });
    if (trapResult === 'negated') {
        owner.graveyard.push(card);
        return;
    }
    
    switch (card.effect) {
        case 'heal1000':
            healLP(who, 1000);
            break;
        case 'atkBoost500':
            const monster = owner.field.monsters.find(m => m && !m.faceDown);
            if (monster) {
                monster.atkBonus = (monster.atkBonus || 0) + 500;
                addLog(`${monster.art} gained +500 ATK!`, 'special');
            }
            break;
        case 'damage800':
            dealDamage(who === 'player' ? 'opponent' : 'player', 800);
            showDamageNumber(800, who === 'player' ? 'top' : 'bottom');
            break;
        case 'draw2':
            drawCard(who);
            drawCard(who);
            break;
        case 'protect':
            owner.protectedThisTurn = true;
            addLog('Monsters protected this turn!', 'special');
            break;
        case 'overclock':
            const ocMonster = owner.field.monsters.find(m => m && !m.faceDown);
            if (ocMonster) {
                ocMonster.atkBonus = (ocMonster.atkBonus || 0) + ocMonster.atk;
                ocMonster.destroyAtEnd = true;
                addLog(`${ocMonster.art} ATK doubled! Will be destroyed at end of turn.`, 'special');
            }
            break;
        case 'tokenRain':
            const monsterCount = owner.field.monsters.filter(m => m !== null).length;
            if (monsterCount > 0) {
                healLP(who, monsterCount * 500);
            }
            break;
        case 'cleanse':
            owner.field.monsters.forEach(m => {
                if (m) {
                    m.atkBonus = 0;
                    m.destroyAtEnd = false;
                }
            });
            healLP(who, 300);
            break;
        case 'destroyOne':
            const oppMonster = opponent.field.monsters.findIndex(m => m !== null);
            if (oppMonster > -1) {
                const destroyed = opponent.field.monsters[oppMonster];
                opponent.graveyard.push(destroyed);
                opponent.field.monsters[oppMonster] = null;
                addLog(`${destroyed.art} ${destroyed.name} destroyed!`, 'damage');
            }
            break;
        case 'copyAtk':
            const myCopy = owner.field.monsters.find(m => m && !m.faceDown);
            const theirBest = opponent.field.monsters.filter(m => m).sort((a, b) => b.atk - a.atk)[0];
            if (myCopy && theirBest) {
                myCopy.atkBonus = (myCopy.atkBonus || 0) + (theirBest.atk - myCopy.atk);
                addLog(`${myCopy.art} copied ATK of ${theirBest.art}!`, 'special');
            }
            break;
    }
    
    owner.graveyard.push(card);
    updateUI();
}

// ===== TRAP HANDLING =====
function checkTraps(who, trigger, context) {
    const state = gameState[who];
    
    for (let i = 0; i < state.field.spells.length; i++) {
        const trap = state.field.spells[i];
        if (!trap || trap.type !== 'trap' || !trap.faceDown) continue;
        
        let activated = false;
        
        switch (trap.effect) {
            case 'counterAttack':
                if (trigger === 'attack' || trigger === 'directAttack') {
                    trap.faceDown = false;
                    addLog(`${who === 'player' ? '🃏' : '🤖'} Trap activated: ${trap.art} ${trap.name}!`, 'special');
                    dealDamage(who === 'player' ? 'opponent' : 'player', 500);
                    addLog('Attack negated! 500 damage dealt!', 'damage');
                    activated = true;
                    state.field.spells[i] = null;
                    state.graveyard.push(trap);
                    return 'negated';
                }
                break;
            case 'noDamage':
                if (trigger === 'attack' || trigger === 'directAttack') {
                    trap.faceDown = false;
                    addLog(`${who === 'player' ? '🃏' : '🤖'} Trap: ${trap.art} ${trap.name}! No damage this turn!`, 'special');
                    state.protectedThisTurn = true;
                    activated = true;
                    state.field.spells[i] = null;
                    state.graveyard.push(trap);
                }
                break;
            case 'skipBattle':
                if (trigger === 'attack' || trigger === 'directAttack') {
                    trap.faceDown = false;
                    addLog(`${who === 'player' ? '🃏' : '🤖'} Trap: ${trap.art} Lag Spike! Battle Phase skipped!`, 'special');
                    activated = true;
                    state.field.spells[i] = null;
                    state.graveyard.push(trap);
                    return 'negated';
                }
                break;
            case 'negateSpell':
                if (trigger === 'spell') {
                    trap.faceDown = false;
                    addLog(`${who === 'player' ? '🃏' : '🤖'} Trap: ${trap.art} ${trap.name}! Spell negated!`, 'special');
                    drawCard(who);
                    activated = true;
                    state.field.spells[i] = null;
                    state.graveyard.push(trap);
                    return 'negated';
                }
                break;
            case 'weakenSummon':
                if (trigger === 'summon' && context && context.card) {
                    trap.faceDown = false;
                    context.card.atkBonus = (context.card.atkBonus || 0) - 1000;
                    addLog(`${who === 'player' ? '🃏' : '🤖'} Trap: ${trap.art} Memory Leak! ATK -1000!`, 'special');
                    activated = true;
                    state.field.spells[i] = null;
                    state.graveyard.push(trap);
                }
                break;
            case 'emergency':
                if (trigger === 'damage') {
                    const ownerState = gameState[who];
                    if (ownerState.lp <= 1000 && ownerState.lp > 0) {
                        trap.faceDown = false;
                        healLP(who, 1500);
                        addLog(`${who === 'player' ? '🃏' : '🤖'} Trap: ${trap.art} Blue Screen! Emergency +1500 LP!`, 'special');
                        activated = true;
                        state.field.spells[i] = null;
                        state.graveyard.push(trap);
                    }
                }
                break;
        }
    }
    
    return null;
}

// ===== EFFECTS =====
function triggerEffect(card, who, trigger) {
    if (!card.effect) return;
    
    const owner = gameState[who];
    const otherWho = who === 'player' ? 'opponent' : 'player';
    
    // Check opponent traps on summon
    if (trigger === 'summon') {
        checkTraps(otherWho, 'summon', { card });
    }
    
    switch (card.effect) {
        case 'draw1':
            if (trigger === 'summon') {
                drawCard(who);
                addLog(`${card.name} effect: Draw 1 card!`, 'special');
            }
            break;
        case 'burn300':
            if (trigger === 'summon') {
                dealDamage(otherWho, 300);
                addLog(`${card.name} effect: 300 burn damage!`, 'damage');
            }
            break;
        case 'heal500':
            if (trigger === 'summon') {
                healLP(who, 500);
                addLog(`${card.name} effect: +500 LP!`, 'heal');
            }
            break;
        case 'packBonus':
            const allyCount = owner.field.monsters.filter(m => m !== null).length;
            if (allyCount > 1) {
                card.atkBonus = (card.atkBonus || 0) + (allyCount - 1) * 200;
                addLog(`${card.name} Pack bonus: +${(allyCount - 1) * 200} ATK!`, 'special');
            }
            break;
        case 'quantum':
            if (trigger === 'summon') {
                const boost = Math.random() > 0.5 ? 500 : -300;
                card.atkBonus = (card.atkBonus || 0) + boost;
                card.atk += boost;
                addLog(`${card.name} Quantum shift: ${boost > 0 ? '+' : ''}${boost} ATK!`, boost > 0 ? 'special' : 'damage');
            }
            break;
        case 'victoryBonus':
            card.atkBonus = (card.atkBonus || 0) + owner.victoriesThisDuel * 200;
            if (owner.victoriesThisDuel > 0) {
                addLog(`${card.name} Victory bonus: +${owner.victoriesThisDuel * 200} ATK!`, 'special');
            }
            break;
    }
}

function processEndOfTurnEffects(who) {
    const state = gameState[who];
    state.field.monsters.forEach((m, i) => {
        if (m && m.destroyAtEnd) {
            state.graveyard.push(m);
            state.field.monsters[i] = null;
            addLog(`${m.art} ${m.name} destroyed by Overclock!`, 'damage');
        }
    });
    // Reset ATK bonuses from spells at end of turn
    state.field.monsters.forEach(m => {
        if (m) {
            m.atkBonus = 0;
        }
    });
}

// ===== AI OPPONENT =====
function aiTurn() {
    const ai = gameState.opponent;
    const player = gameState.player;
    
    // AI Main Phase
    updatePhase('AI - MAIN');
    
    let actions = [];
    
    // 1. Try to summon a monster
    const monsterInHand = ai.hand.filter(c => c.type === 'monster').sort((a, b) => b.atk - a.atk);
    const emptyMonsterZone = ai.field.monsters.findIndex(m => m === null);
    
    if (monsterInHand.length > 0 && emptyMonsterZone > -1 && !ai.hasNormalSummoned) {
        let cardToSummon = monsterInHand[0];
        
        // Tribute summon logic
        if (cardToSummon.level >= 5) {
            const tributeIdx = ai.field.monsters.findIndex(m => m !== null);
            if (tributeIdx > -1) {
                const tributed = ai.field.monsters[tributeIdx];
                ai.graveyard.push(tributed);
                ai.field.monsters[tributeIdx] = null;
                addLog(`🤖 Tributed ${tributed.art} ${tributed.name}`, 'ai');
            } else {
                // Can't tribute, pick a lower level monster
                cardToSummon = monsterInHand.find(c => c.level <= 4) || null;
            }
        }
        
        if (cardToSummon) {
            const zone = ai.field.monsters.findIndex(m => m === null);
            if (zone > -1) {
                ai.field.monsters[zone] = cardToSummon;
                ai.hand.splice(ai.hand.indexOf(cardToSummon), 1);
                ai.hasNormalSummoned = true;
                addLog(`🤖 Summoned ${cardToSummon.art} ${cardToSummon.name} (ATK:${cardToSummon.atk})`, 'ai');
                triggerEffect(cardToSummon, 'opponent', 'summon');
                
                const zoneEl = document.getElementById(`opp-monster-${zone + 1}`);
                animateSummon(zoneEl);
            }
        }
    }
    
    // 2. Use spells
    const spellsInHand = ai.hand.filter(c => c.type === 'spell');
    if (spellsInHand.length > 0) {
        const spell = aiChooseSpell(spellsInHand);
        if (spell) {
            activateSpell(spell, 'opponent');
            ai.hand.splice(ai.hand.indexOf(spell), 1);
        }
    }
    
    // 3. Set traps
    const trapsInHand = ai.hand.filter(c => c.type === 'trap');
    if (trapsInHand.length > 0) {
        const emptySpellZone = ai.field.spells.findIndex(s => s === null);
        if (emptySpellZone > -1) {
            const trap = trapsInHand[0];
            trap.faceDown = true;
            ai.field.spells[emptySpellZone] = trap;
            ai.hand.splice(ai.hand.indexOf(trap), 1);
            addLog(`🤖 Set a card face-down.`, 'ai');
        }
    }
    
    updateUI();
    
    // AI Battle Phase
    setTimeout(() => {
        if (gameState.turn <= 1) {
            aiEndTurn();
            return;
        }
        
        if (ai.skipBattle) {
            ai.skipBattle = false;
            addLog('🤖 Battle Phase skipped!', 'ai');
            aiEndTurn();
            return;
        }
        
        updatePhase('AI - BATTLE');
        aiBattle();
    }, getAnimDelay() * 1.5);
}

function aiChooseSpell(spells) {
    const ai = gameState.opponent;
    const player = gameState.player;
    const difficulty = gameState.settings.difficulty;
    
    // Easy: random
    if (difficulty === 'easy') {
        return Math.random() > 0.5 ? spells[0] : null;
    }
    
    // Normal/Hard: smart choices
    for (const spell of spells) {
        switch (spell.effect) {
            case 'heal1000':
                if (ai.lp <= 2500) return spell;
                break;
            case 'damage800':
                if (player.lp <= 1500) return spell;
                if (difficulty === 'hard') return spell;
                break;
            case 'atkBoost500':
                if (ai.field.monsters.some(m => m !== null)) return spell;
                break;
            case 'draw2':
                if (ai.hand.length <= 2) return spell;
                break;
            case 'destroyOne':
                if (player.field.monsters.some(m => m && m.atk >= 2000)) return spell;
                break;
            case 'protect':
                if (player.field.monsters.some(m => m && m.atk >= 2000)) return spell;
                break;
            case 'overclock':
                if (difficulty === 'hard' && ai.field.monsters.some(m => m)) return spell;
                break;
        }
    }
    
    return difficulty === 'hard' && spells.length > 0 ? spells[0] : null;
}

function aiBattle() {
    const ai = gameState.opponent;
    const player = gameState.player;
    
    let attackQueue = [];
    
    ai.field.monsters.forEach((monster, idx) => {
        if (!monster || monster.faceDown) return;
        
        const atkValue = monster.atk + (monster.atkBonus || 0);
        
        // Find best target
        const playerMonsters = player.field.monsters
            .map((m, i) => ({ monster: m, index: i }))
            .filter(x => x.monster !== null);
        
        if (playerMonsters.length === 0) {
            // Direct attack
            attackQueue.push({ type: 'direct', attackerIdx: idx, monster });
        } else {
            // Find weakest monster we can beat
            const beatable = playerMonsters
                .filter(x => {
                    const defValue = x.monster.defenseMode ? x.monster.def : x.monster.atk;
                    return atkValue > defValue;
                })
                .sort((a, b) => {
                    const aVal = a.monster.defenseMode ? a.monster.def : a.monster.atk;
                    const bVal = b.monster.defenseMode ? b.monster.def : b.monster.atk;
                    return bVal - aVal; // Attack strongest we can beat
                });
            
            if (beatable.length > 0) {
                attackQueue.push({ type: 'battle', attackerIdx: idx, targetIdx: beatable[0].index, monster });
            } else if (gameState.settings.difficulty === 'hard') {
                // Hard AI: attack even if risky sometimes
                if (Math.random() > 0.7) {
                    attackQueue.push({ type: 'battle', attackerIdx: idx, targetIdx: playerMonsters[0].index, monster });
                }
            }
        }
    });
    
    // Execute attacks sequentially with delays
    executeAIAttacks(attackQueue, 0);
}

function executeAIAttacks(queue, index) {
    if (index >= queue.length) {
        aiEndTurn();
        return;
    }
    
    const attack = queue[index];
    const ai = gameState.opponent;
    const player = gameState.player;
    
    if (attack.type === 'direct') {
        // Check player traps
        const trapResult = checkTraps('player', 'directAttack', { attacker: attack.monster, attackerIdx: attack.attackerIdx });
        if (trapResult === 'negated') {
            updateUI();
            setTimeout(() => executeAIAttacks(queue, index + 1), getAnimDelay());
            return;
        }
        
        const damage = attack.monster.atk + (attack.monster.atkBonus || 0);
        addLog(`🤖 ${attack.monster.art} ${attack.monster.name} attacks directly! (-${damage} LP)`, 'ai');
        dealDamage('player', damage);
        showDamageNumber(damage, 'bottom');
        screenShake();
    } else {
        const target = player.field.monsters[attack.targetIdx];
        if (!target) {
            setTimeout(() => executeAIAttacks(queue, index + 1), getAnimDelay());
            return;
        }
        
        // Check player traps
        const trapResult = checkTraps('player', 'attack', { attacker: attack.monster, target, attackerIdx: attack.attackerIdx, targetIdx: attack.targetIdx });
        if (trapResult === 'negated') {
            updateUI();
            setTimeout(() => executeAIAttacks(queue, index + 1), getAnimDelay());
            return;
        }
        
        if (target.faceDown) {
            target.faceDown = false;
            addLog(`Revealed: ${target.art} ${target.name}!`, 'special');
        }
        
        const atkValue = attack.monster.atk + (attack.monster.atkBonus || 0);
        const defValue = target.defenseMode ? target.def : target.atk;
        
        addLog(`🤖 ${attack.monster.art} attacks ${target.art} ${target.name}!`, 'ai');
        animateAttack(document.getElementById(`opp-monster-${attack.attackerIdx + 1}`));
        
        if (player.protectedThisTurn) {
            addLog('Attack blocked by Firewall!', 'special');
        } else if (atkValue > defValue) {
            const damage = target.defenseMode ? 0 : atkValue - defValue;
            player.field.monsters[attack.targetIdx] = null;
            player.graveyard.push(target);
            
            if (damage > 0) {
                dealDamage('player', damage);
                showDamageNumber(damage, 'bottom');
            }
            addLog(`${target.art} destroyed!${damage > 0 ? ` (-${damage} LP)` : ''}`, 'damage');
            animateDestroy(document.getElementById(`player-monster-${attack.targetIdx + 1}`));
            ai.victoriesThisDuel++;
        } else if (atkValue === defValue) {
            ai.field.monsters[attack.attackerIdx] = null;
            player.field.monsters[attack.targetIdx] = null;
            ai.graveyard.push(attack.monster);
            player.graveyard.push(target);
            addLog('Both destroyed!', 'damage');
        } else {
            const damage = defValue - atkValue;
            if (!target.defenseMode) {
                ai.field.monsters[attack.attackerIdx] = null;
                ai.graveyard.push(attack.monster);
                dealDamage('opponent', damage);
            } else {
                dealDamage('opponent', damage);
            }
        }
    }
    
    updateUI();
    
    setTimeout(() => {
        if (checkWinCondition()) return;
        executeAIAttacks(queue, index + 1);
    }, getAnimDelay());
}

function aiEndTurn() {
    processEndOfTurnEffects('opponent');
    addLog('🤖 End of AI turn.', 'ai');
    updatePhase('YOUR TURN');
    
    setTimeout(() => {
        startPlayerTurn();
    }, getAnimDelay());
}

// ===== DAMAGE & HEALING =====
function dealDamage(who, amount) {
    gameState[who].lp = Math.max(0, gameState[who].lp - amount);
    
    // Check emergency traps
    checkTraps(who, 'damage', {});
    
    updateLPDisplay();
    
    if (who === 'player') {
        showDamageNumber(amount, 'bottom');
    } else {
        showDamageNumber(amount, 'top');
    }
}

function healLP(who, amount) {
    gameState[who].lp = Math.min(4000, gameState[who].lp + amount);
    addLog(`${who === 'player' ? '💚' : '🤖'} +${amount} LP!`, 'heal');
    updateLPDisplay();
    showDamageNumber(`+${amount}`, who === 'player' ? 'bottom' : 'top', true);
}

// ===== WIN CONDITION =====
function checkWinCondition() {
    if (gameState.player.lp <= 0) {
        endDuel(false, 'Life Points reduced to 0');
        return true;
    }
    if (gameState.opponent.lp <= 0) {
        endDuel(true, 'Opponent Life Points reduced to 0');
        return true;
    }
    return false;
}

function endDuel(playerWon, reason) {
    const resultTitle = document.getElementById('result-title');
    const resultStats = document.getElementById('result-stats');
    
    if (playerWon) {
        resultTitle.textContent = '🏆 VICTORY!';
        resultTitle.className = 'result-title win';
    } else {
        resultTitle.textContent = '💀 DEFEAT';
        resultTitle.className = 'result-title lose';
    }
    
    resultStats.innerHTML = `
        <p>Reason: ${reason}</p>
        <p>Your LP: ${gameState.player.lp} | AI LP: ${gameState.opponent.lp}</p>
        <p>Turns played: ${gameState.turn}</p>
        <p>Cards destroyed: ${gameState.opponent.graveyard.filter(c => c.type === 'monster').length}</p>
        <p style="color: var(--pixel-gold); margin-top: 8px;">AI Difficulty: ${gameState.settings.difficulty.toUpperCase()}</p>
    `;
    
    setTimeout(() => showScreen('result-screen'), 1000);
}

// ===== UI UPDATES =====
function updateUI() {
    renderHand();
    renderField();
    updateLPDisplay();
    updateDeckCounts();
}

function renderHand() {
    const handEl = document.getElementById('player-hand');
    handEl.innerHTML = '';
    
    gameState.player.hand.forEach((card, i) => {
        const cardEl = document.createElement('div');
        cardEl.className = `hand-card ${card.type}-card ${gameState.selectedHandCard === i ? 'selected' : ''}`;
        cardEl.onclick = () => selectHandCard(i);
        cardEl.oncontextmenu = (e) => { e.preventDefault(); showCardModal(card); };
        
        let statsHtml = '';
        if (card.type === 'monster') {
            statsHtml = `<div class="card-stats"><span class="atk">⚔${card.atk}</span><span class="def">🛡${card.def}</span></div>`;
        }
        
        cardEl.innerHTML = `
            <div class="card-type-badge">${card.type.toUpperCase()}</div>
            <div class="card-art">${renderPixelArt(card.pixels, 4)}</div>
            <div class="card-name">${card.name}</div>
            ${statsHtml}
        `;
        
        handEl.appendChild(cardEl);
    });
}

function renderField() {
    // Player monsters
    for (let i = 0; i < 3; i++) {
        const zone = document.getElementById(`player-monster-${i + 1}`);
        const monster = gameState.player.field.monsters[i];
        renderFieldCard(zone, monster);
    }
    
    // Player spells/traps
    for (let i = 0; i < 3; i++) {
        const zone = document.getElementById(`player-spell-${i + 1}`);
        const spell = gameState.player.field.spells[i];
        renderFieldCard(zone, spell);
    }
    
    // Opponent monsters
    for (let i = 0; i < 3; i++) {
        const zone = document.getElementById(`opp-monster-${i + 1}`);
        const monster = gameState.opponent.field.monsters[i];
        renderFieldCard(zone, monster, true);
    }
    
    // Opponent spells/traps
    for (let i = 0; i < 3; i++) {
        const zone = document.getElementById(`opp-spell-${i + 1}`);
        const spell = gameState.opponent.field.spells[i];
        renderFieldCard(zone, spell, true);
    }
}

function renderFieldCard(zone, card, isOpponent = false) {
    if (!card) {
        zone.innerHTML = '';
        zone.classList.remove('has-card');
        return;
    }
    
    zone.classList.add('has-card');
    
    if (card.faceDown) {
        zone.innerHTML = `<div class="field-card face-down ${card.defenseMode ? 'defense-mode' : ''}">
            <div class="card-art"><div class="pixel-art-fallback">?</div></div>
        </div>`;
        return;
    }
    
    const effectiveAtk = card.type === 'monster' ? (card.atk + (card.atkBonus || 0)) : 0;
    
    zone.innerHTML = `<div class="field-card ${card.type}-card ${card.defenseMode ? 'defense-mode' : ''}">
        <div class="card-art">${renderPixelArt(card.pixels, 5)}</div>
        <div class="card-name">${card.name}</div>
        ${card.type === 'monster' ? `<div class="card-stats"><span class="card-atk">ATK:${effectiveAtk}</span> <span class="card-def">DEF:${card.def}</span></div>` : ''}
    </div>`;
}

function updateLPDisplay() {
    const playerLP = gameState.player.lp;
    const oppLP = gameState.opponent.lp;
    
    document.getElementById('player-lp').textContent = playerLP;
    document.getElementById('opponent-lp').textContent = oppLP;
    document.getElementById('player-lp-bar').style.width = `${(playerLP / 4000) * 100}%`;
    document.getElementById('opponent-lp-bar').style.width = `${(oppLP / 4000) * 100}%`;
}

function updateDeckCounts() {
    document.getElementById('player-deck-count').textContent = gameState.player.deck.length;
    document.getElementById('opponent-deck-count').textContent = gameState.opponent.deck.length;
}

function updatePhase(phase) {
    document.getElementById('phase-display').textContent = phase;
}

function updateButtons() {
    const btnSummon = document.getElementById('btn-summon');
    const btnSet = document.getElementById('btn-set');
    const btnAttack = document.getElementById('btn-attack');
    const btnEnd = document.getElementById('btn-end');
    
    const selectedCard = gameState.selectedHandCard !== null ? gameState.player.hand[gameState.selectedHandCard] : null;
    
    btnSummon.disabled = !(
        gameState.phase === 'main' &&
        selectedCard &&
        (selectedCard.type === 'monster' || selectedCard.type === 'spell') &&
        (selectedCard.type !== 'monster' || !gameState.player.hasNormalSummoned)
    );
    
    btnSet.disabled = !(
        gameState.phase === 'main' &&
        selectedCard &&
        (selectedCard.type === 'trap' || selectedCard.type === 'spell' || 
         (selectedCard.type === 'monster' && !gameState.player.hasNormalSummoned))
    );
    
    btnAttack.disabled = !(
        gameState.phase === 'main' &&
        !gameState.battleMode &&
        gameState.player.field.monsters.some(m => m && !m.faceDown) &&
        gameState.turn > 1
    );
    
    btnEnd.disabled = gameState.currentPlayer !== 'player';
}

function deselectAll() {
    gameState.selectedHandCard = null;
    document.querySelectorAll('.hand-card.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.field-zone.selected').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.attack-target').forEach(el => el.classList.remove('attack-target'));
}

// ===== CARD MODAL =====
function showCardModal(card) {
    const modal = document.getElementById('card-modal');
    const modalCard = document.getElementById('modal-card');
    const modalInfo = document.getElementById('modal-info');
    
    modalCard.className = `modal-card ${card.type}-card`;
    modalCard.innerHTML = `
        <div class="card-art">${renderPixelArt(card.pixels, 8)}</div>
        <div class="card-name">${card.name}</div>
        ${card.type === 'monster' ? `<div class="card-stats" style="color: var(--pixel-white)">ATK: ${card.atk} | DEF: ${card.def} | LV: ${card.level}</div>` : ''}
    `;
    
    modalInfo.innerHTML = `
        <p style="color: ${card.type === 'monster' ? 'var(--pixel-orange)' : card.type === 'spell' ? 'var(--pixel-green)' : '#cc66ff'}">[${card.type.toUpperCase()}]</p>
        <p>${card.desc}</p>
        ${card.effect ? `<p class="card-effect">✨ Has special effect</p>` : ''}
    `;
    
    modal.classList.add('active');
}

function closeCardModal() {
    document.getElementById('card-modal').classList.remove('active');
}

// ===== ANIMATIONS =====
function animateSummon(element) {
    if (!element) return;
    element.classList.add('summon-anim');
    playSound('summon');
    
    // Add spark effect
    const spark = document.createElement('div');
    spark.className = 'spark-effect';
    element.style.position = 'relative';
    element.appendChild(spark);
    
    setTimeout(() => {
        element.classList.remove('summon-anim');
        spark.remove();
    }, 700);
}

function animateAttack(element) {
    if (!element) return;
    element.classList.add('attack-anim');
    playSound('attack');
    
    setTimeout(() => element.classList.remove('attack-anim'), 600);
}

function animateDestroy(element) {
    if (!element) return;
    const card = element.querySelector('.field-card');
    if (card) {
        card.classList.add('destroy-anim');
        playSound('damage');
        
        // Add slash effect
        const slash = document.createElement('div');
        slash.className = 'slash-effect';
        element.style.position = 'relative';
        element.appendChild(slash);
        
        // Add explosion particles
        createExplosionParticles(element);
        
        // Impact flash
        const flash = document.createElement('div');
        flash.className = 'impact-flash';
        document.body.appendChild(flash);
        
        setTimeout(() => {
            card.classList.remove('destroy-anim');
            slash.remove();
            flash.remove();
        }, 700);
    }
}

function createExplosionParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const colors = ['#ff3366', '#ffdd00', '#ff8800', '#00d4ff', '#ffffff'];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        const angle = (Math.PI * 2 / 12) * i;
        const distance = 30 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 6px ${particle.style.background}`;
        particle.style.position = 'fixed';
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }
}

function showDamageNumber(amount, position, isHeal = false) {
    const overlay = document.getElementById('damage-overlay');
    const num = document.createElement('div');
    num.className = `damage-number ${isHeal ? 'heal' : ''}`;
    num.textContent = isHeal ? amount : `-${amount}`;
    num.style.left = `${40 + Math.random() * 20}%`;
    num.style.top = position === 'top' ? '20%' : '60%';
    overlay.appendChild(num);
    setTimeout(() => num.remove(), 1500);
}

function screenShake() {
    const duelScreen = document.getElementById('duel-screen');
    duelScreen.classList.add('screen-shake');
    setTimeout(() => duelScreen.classList.remove('screen-shake'), 300);
}

function showDirectAttackBeam() {
    const beam = document.createElement('div');
    beam.className = 'direct-attack-beam';
    document.body.appendChild(beam);
    setTimeout(() => beam.remove(), 600);
}

// ===== BATTLE LOG =====
function addLog(message, type = '') {
    const log = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    // Keep log manageable
    while (log.children.length > 50) {
        log.removeChild(log.firstChild);
    }
}

function clearLog() {
    document.getElementById('battle-log').innerHTML = '';
}

// ===== UTILITIES =====
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getAnimDelay() {
    return ANIM_SPEEDS[gameState.settings.animSpeed] || 600;
}

// ===== MIMO API INTEGRATION =====
async function callMiMoAPI(prompt) {
    const apiKey = gameState.settings.apiKey;
    if (!apiKey) return null;
    
    try {
        const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'mimo-v2.5',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an AI opponent in a pixel card battle game similar to Yu-Gi-Oh. You make strategic decisions about which cards to play and which monsters to attack. Respond with JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.choices[0].message.content;
        }
    } catch (e) {
        console.log('MiMo API not available, using local AI');
    }
    
    return null;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCardModal();
        if (gameState.battleMode) {
            gameState.battleMode = false;
            gameState.phase = 'main';
            resetBattleSelection();
            updatePhase('MAIN PHASE');
            updateButtons();
        }
    }
    if (e.key === 'Enter' && gameState.currentPlayer === 'player') {
        if (gameState.phase === 'main' || gameState.phase === 'battle') {
            endTurn();
        }
    }
});

// ===== SOUND EFFECTS (Web Audio) =====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (!gameState.settings.sfx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    switch (type) {
        case 'attack':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
            break;
        case 'summon':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
            break;
        case 'damage':
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
            break;
    }
}

// Initialize
console.log('🎮 MiMo Pixel Duel loaded! Powered by Xiaomi MiMo AI.');
console.log('🔗 Join the 100T Token Creator Program: https://100t.xiaomimimo.com/');
