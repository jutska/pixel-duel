// ===== Pixel Duel - Card Database =====
// Fantasy theme: Knights, Wizards, Sorcerers, and more
// True 8x8 pixel art for each card

const PIXEL_PALETTE = {
    '.': 'transparent',
    'K': '#111111',
    'W': '#eeeeee',
    'R': '#ee3333',
    'G': '#33bb33',
    'B': '#4444ff',
    'Y': '#ffcc00',
    'O': '#ff8800',
    'P': '#9933cc',
    'C': '#00ccff',
    'N': '#884422',
    'X': '#888888',
    'M': '#ff66aa',
    'L': '#66ff99',
    'S': '#bbbbbb',
    'D': '#444444'
};

function renderPixelArt(pixels, cellSize) {
    if (!pixels || !Array.isArray(pixels)) return '<div class="pixel-art-fallback">?</div>';
    cellSize = cellSize || 4;
    const cols = pixels[0].length;
    const rows = pixels.length;
    let html = '<div class="pixel-art-grid" style="display:grid;grid-template-columns:repeat(' + cols + ',' + cellSize + 'px);grid-template-rows:repeat(' + rows + ',' + cellSize + 'px);width:' + (cols * cellSize) + 'px;margin:0 auto;">';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const ch = pixels[r][c] || '.';
            const color = PIXEL_PALETTE[ch] || 'transparent';
            if (color === 'transparent') {
                html += '<div></div>';
            } else {
                html += '<div style="background:' + color + '"></div>';
            }
        }
    }
    html += '</div>';
    return html;
}

const CARD_DATABASE = [
    // ===== MONSTER CARDS - KNIGHTS & WARRIORS =====
    {
        id: 1,
        name: "Dragon Knight",
        type: "monster",
        atk: 2500,
        def: 2000,
        level: 7,
        pixels: [
            "..RR..R.",
            ".RRRRR..",
            "RRYRY...",
            ".RRRR...",
            "..RRRR..",
            "...RR...",
            "..RR.RR.",
            ".RR...R."
        ],
        desc: "A legendary knight who rides a dragon into battle. His flaming lance pierces all defenses.",
        effect: null
    },
    {
        id: 2,
        name: "Silver Paladin",
        type: "monster",
        atk: 1800,
        def: 1200,
        level: 4,
        pixels: [
            "..SS....",
            ".SWWS...",
            "..SS....",
            ".SSSS...",
            "SSSYYW..",
            "..SS....",
            ".SS.SS..",
            ".S...S.."
        ],
        desc: "A holy warrior in shining silver armor. Strikes evil with divine fury.",
        effect: null
    },
    {
        id: 3,
        name: "Arcane Wizard",
        type: "monster",
        atk: 1500,
        def: 1500,
        level: 4,
        pixels: [
            "...P....",
            "..PPP...",
            ".P.P.P..",
            "..PP....",
            ".PPPP...",
            "..PP....",
            ".PP.PP..",
            ".P...P.."
        ],
        desc: "Master of arcane arts. Draws power from ancient spellbooks.",
        effect: "draw1"
    },
    {
        id: 4,
        name: "Iron Golem",
        type: "monster",
        atk: 2000,
        def: 2200,
        level: 5,
        pixels: [
            ".XXXX...",
            "XXXXXX..",
            "XWXXWX..",
            "XXXXXX..",
            ".XXXX...",
            ".XXXX...",
            "XX..XX..",
            "XX..XX.."
        ],
        desc: "A massive golem forged by dwarven blacksmiths. Nearly indestructible.",
        effect: null
    },
    {
        id: 5,
        name: "Shadow Assassin",
        type: "monster",
        atk: 1600,
        def: 800,
        level: 3,
        pixels: [
            "..DD....",
            ".DKKD...",
            "..KK....",
            ".KKKK...",
            "KKDDKK..",
            "..KK....",
            ".KK.KK..",
            ".K...K.."
        ],
        desc: "Moves unseen in the darkness. Strikes before the enemy can react.",
        effect: "directAtk"
    },
    {
        id: 6,
        name: "Phoenix Sorceress",
        type: "monster",
        atk: 2200,
        def: 1600,
        level: 6,
        pixels: [
            "..OR....",
            ".OOR....",
            "..OO....",
            ".OOOO...",
            "OORROO..",
            "..OO....",
            ".OO.OO..",
            ".O...O.."
        ],
        desc: "A sorceress reborn from fire. Her flames consume all who oppose her.",
        effect: "revive"
    },
    {
        id: 7,
        name: "Apprentice Mage",
        type: "monster",
        atk: 500,
        def: 500,
        level: 1,
        pixels: [
            "..BB....",
            ".BWWB...",
            "..BB....",
            ".BBBB...",
            "..BB.Y..",
            "..BB....",
            ".BB.BB..",
            "........"
        ],
        desc: "A young mage still learning the craft. Weak but full of potential.",
        effect: "multiply"
    },
    {
        id: 8,
        name: "Fire Sorcerer",
        type: "monster",
        atk: 1400,
        def: 1000,
        level: 3,
        pixels: [
            "..OO....",
            ".OWWO...",
            "..OO....",
            ".OOOO...",
            "RROORR..",
            "..OO....",
            ".OO.OO..",
            ".O...O.."
        ],
        desc: "Wields destructive fire magic. Burns enemies with every spell cast.",
        effect: "burn300"
    },
    {
        id: 9,
        name: "Ancient King",
        type: "monster",
        atk: 2800,
        def: 2400,
        level: 8,
        pixels: [
            ".Y.Y.Y..",
            "YYYYYY..",
            "..WW....",
            ".YYYY...",
            "YYYYYY..",
            "..YY....",
            ".YY.YY..",
            ".Y...Y.."
        ],
        desc: "The undying king of a forgotten realm. Requires tribute to summon.",
        effect: null
    },
    {
        id: 10,
        name: "Wolf Rider",
        type: "monster",
        atk: 1700,
        def: 1000,
        level: 4,
        pixels: [
            "..NN....",
            ".NNN....",
            "XXXXXX..",
            "XWXXWX..",
            "XXXXXXX.",
            "..XXXX..",
            ".XX.XX..",
            ".X...X.."
        ],
        desc: "A barbarian who rides into battle on a giant wolf. Pack tactics.",
        effect: "packBonus"
    },
    {
        id: 11,
        name: "Dark Lancer",
        type: "monster",
        atk: 1900,
        def: 1100,
        level: 4,
        pixels: [
            "..XX.S..",
            ".XWWXS..",
            "..XX.S..",
            ".XXXS...",
            "NNNNN...",
            ".NNNN...",
            "NN..NN..",
            "N....N.."
        ],
        desc: "A mounted knight wielding a cursed lance. Charges with deadly precision.",
        effect: null
    },
    {
        id: 12,
        name: "Shield Guardian",
        type: "monster",
        atk: 1200,
        def: 2000,
        level: 4,
        pixels: [
            "..XX....",
            ".XWWX...",
            "..XX....",
            "BBBXX...",
            "BWBBXX..",
            "BBB.XX..",
            ".XX.XX..",
            ".X...X.."
        ],
        desc: "An enchanted guardian that protects allies with an unbreakable shield.",
        effect: "shield"
    },
    {
        id: 13,
        name: "Healing Priestess",
        type: "monster",
        atk: 800,
        def: 600,
        level: 2,
        pixels: [
            "..GG....",
            ".GWWG...",
            "..GG....",
            ".GGGG...",
            "GLGGGL..",
            "..GG....",
            ".GG.GG..",
            ".G...G.."
        ],
        desc: "An elven priestess who heals wounds with holy light magic.",
        effect: "heal500"
    },
    {
        id: 14,
        name: "Death Knight",
        type: "monster",
        atk: 2100,
        def: 900,
        level: 5,
        pixels: [
            "..WW....",
            ".WKKW...",
            "..WW....",
            ".KKKK...",
            "KKWWKK..",
            "..KK....",
            ".KK.KK..",
            ".K...K.."
        ],
        desc: "A fallen paladin raised from death. Harvests souls on the battlefield.",
        effect: "destroy"
    },
    {
        id: 15,
        name: "Mystic Enchantress",
        type: "monster",
        atk: 1300,
        def: 1300,
        level: 3,
        pixels: [
            "..PP....",
            ".PWWP...",
            "..PP....",
            ".PPPP...",
            "PMPPMP..",
            "..PP....",
            ".PP.PP..",
            ".P...P.."
        ],
        desc: "A mysterious enchantress who bends reality. Unpredictable power.",
        effect: "quantum"
    },
    {
        id: 16,
        name: "War Champion",
        type: "monster",
        atk: 2000,
        def: 1500,
        level: 5,
        pixels: [
            "..YY....",
            ".YWWY...",
            "..NN....",
            ".NNNN...",
            "NNYNNN..",
            "..NN....",
            ".NN.NN..",
            ".N...N.."
        ],
        desc: "The undefeated arena champion. Grows stronger with each victory.",
        effect: "victoryBonus"
    },
    {
        id: 17,
        name: "Dwarf Defender",
        type: "monster",
        atk: 900,
        def: 1400,
        level: 2,
        pixels: [
            "........",
            "..NN....",
            ".NWWN...",
            "..NN....",
            "NNNNNN..",
            ".NNNN...",
            ".NN.NN..",
            ".N...N.."
        ],
        desc: "A stout dwarf with impenetrable armor. Excellent in defense.",
        effect: null
    },
    {
        id: 18,
        name: "Elven Archer",
        type: "monster",
        atk: 1600,
        def: 700,
        level: 3,
        pixels: [
            "..GG....",
            ".GWWG...",
            "..GG..N.",
            ".GGGG.N.",
            ".GG.G.N.",
            "..GG..N.",
            ".GG.GG..",
            ".G...G.."
        ],
        desc: "An elf with perfect aim. Arrows pierce through any armor.",
        effect: "pierce"
    },

    // ===== SPELL CARDS =====
    {
        id: 19,
        name: "Holy Heal",
        type: "spell",
        pixels: [
            "...GG...",
            "...GG...",
            ".GGGGGG.",
            ".GGGGGG.",
            "...GG...",
            "...GG...",
            "...GG...",
            "........"
        ],
        desc: "A divine prayer restores 1000 Life Points to the caster.",
        effect: "heal1000"
    },
    {
        id: 20,
        name: "Enchant Weapon",
        type: "spell",
        pixels: [
            "....Y...",
            "...YSY..",
            "....S...",
            "....S...",
            "....S...",
            "...SSS..",
            "..SSSSS.",
            "...SSS.."
        ],
        desc: "Enchants a warrior's weapon, boosting ATK by 500 this turn.",
        effect: "atkBoost500"
    },
    {
        id: 21,
        name: "Meteor Strike",
        type: "spell",
        pixels: [
            "......R.",
            ".....RR.",
            "....ORR.",
            "...OORR.",
            "..OOO.R.",
            ".OOO....",
            "OOO.....",
            ".O......"
        ],
        desc: "Calls a meteor from the heavens dealing 800 damage directly.",
        effect: "damage800"
    },
    {
        id: 22,
        name: "Mirror Spell",
        type: "spell",
        pixels: [
            ".YYYY...",
            "Y.CC.Y..",
            "Y.CC.Y..",
            "Y.CC.Y..",
            "Y.CC.Y..",
            "Y.CC.Y..",
            ".YYYY...",
            "........"
        ],
        desc: "Copies the power of an enemy warrior to your own.",
        effect: "copyAtk"
    },
    {
        id: 23,
        name: "Ancient Scroll",
        type: "spell",
        pixels: [
            ".NNNNN..",
            "NYYYYN..",
            ".YNKYN..",
            ".YNKYN..",
            ".YNKYN..",
            ".YNKYN..",
            "NYYYYN..",
            ".NNNNN.."
        ],
        desc: "Read an ancient scroll to draw 2 cards. Knowledge is power.",
        effect: "draw2"
    },
    {
        id: 24,
        name: "Magic Barrier",
        type: "spell",
        pixels: [
            "BBBBBB..",
            "B.BB.B..",
            "BBBBBB..",
            "B.BB.B..",
            "BBBBBB..",
            "B.BB.B..",
            "BBBBBB..",
            "........"
        ],
        desc: "Creates a magic barrier. Your warriors cannot be destroyed this turn.",
        effect: "protect"
    },
    {
        id: 25,
        name: "Berserker Rage",
        type: "spell",
        pixels: [
            ".RRRR...",
            "R.RR.R..",
            "RRKRKR..",
            "RRRRRR..",
            "R.RR.R..",
            "RR..RR..",
            ".RRRR...",
            "........"
        ],
        desc: "Double a warrior's ATK this turn, but they perish at end of turn.",
        effect: "overclock"
    },
    {
        id: 26,
        name: "Blessing Rain",
        type: "spell",
        pixels: [
            ".C..C.C.",
            "..C..C..",
            "C..C..C.",
            "..C..C..",
            ".C..C.C.",
            "..C..C..",
            "C..C..C.",
            "........"
        ],
        desc: "Heavenly rain blesses your army. Gain 500 LP per warrior on field.",
        effect: "tokenRain"
    },
    {
        id: 27,
        name: "Purify",
        type: "spell",
        pixels: [
            "...Y....",
            "...Y....",
            "..YYY...",
            "YYYYYYY.",
            "..YYY...",
            "...Y....",
            "...Y....",
            "........"
        ],
        desc: "Remove all curses from your warriors and restore 300 LP.",
        effect: "cleanse"
    },
    {
        id: 28,
        name: "Lightning Bolt",
        type: "spell",
        pixels: [
            "....YY..",
            "...YY...",
            "..YY....",
            ".YYYY...",
            "...YY...",
            "..YY....",
            ".YY.....",
            "YY......"
        ],
        desc: "A devastating bolt of lightning destroys one enemy on the field.",
        effect: "destroyOne"
    },

    // ===== TRAP CARDS =====
    {
        id: 29,
        name: "Counter Strike",
        type: "trap",
        pixels: [
            "R....R..",
            ".R..R...",
            "..RR....",
            ".RRRR...",
            "..RR....",
            ".R..R...",
            "R....R..",
            "........"
        ],
        desc: "When attacked: negate the attack and deal 500 counter damage.",
        effect: "counterAttack"
    },
    {
        id: 30,
        name: "Resurrection",
        type: "trap",
        pixels: [
            "..YY....",
            ".YWWY...",
            "..YY....",
            ".YYYY...",
            "..YY....",
            ".Y..Y...",
            "Y....Y..",
            "........"
        ],
        desc: "When a warrior falls: resurrect them in defense position.",
        effect: "backup"
    },
    {
        id: 31,
        name: "Frozen Trap",
        type: "trap",
        pixels: [
            "...C....",
            "..CCC...",
            ".CCCCC..",
            "CCCCCCC.",
            ".CCCCC..",
            "..CCC...",
            "...C....",
            "........"
        ],
        desc: "Freezes the enemy! Skip opponent's next Battle Phase.",
        effect: "skipBattle"
    },
    {
        id: 32,
        name: "Divine Shield",
        type: "trap",
        pixels: [
            ".YYYY...",
            "YYYYYY..",
            "YYWWYY..",
            "YYWWYY..",
            "YYYYYY..",
            ".YYYY...",
            "..YY....",
            "........"
        ],
        desc: "A divine shield absorbs all battle damage this turn.",
        effect: "noDamage"
    },
    {
        id: 33,
        name: "Curse of Weakness",
        type: "trap",
        pixels: [
            ".PPPP...",
            "PP...P..",
            "P.PP....",
            "P.P.P...",
            "...P.P..",
            "....PP.P",
            ".P...PP.",
            "..PPPP.."
        ],
        desc: "When enemy summons: curse them, reducing ATK by 1000.",
        effect: "weakenSummon"
    },
    {
        id: 34,
        name: "Deflection Ward",
        type: "trap",
        pixels: [
            ".....R..",
            "....R...",
            "...R....",
            "..R.....",
            "...R....",
            "....R.B.",
            ".....BB.",
            "......B."
        ],
        desc: "When attacked: redirect the attack to another enemy warrior.",
        effect: "redirect"
    },
    {
        id: 35,
        name: "Last Stand",
        type: "trap",
        pixels: [
            "X.X.X.X.",
            "XXXXXXXX",
            ".XXXXXX.",
            ".XWWWXX.",
            ".XXXXXX.",
            ".XXXXXX.",
            "XXXXXXXX",
            "........"
        ],
        desc: "When LP drops below 1000: the castle's last defense activates! +1500 LP.",
        effect: "emergency"
    },
    {
        id: 36,
        name: "Spell Breaker",
        type: "trap",
        pixels: [
            "...PP...",
            "..PP....",
            "..P.....",
            "........",
            "........",
            ".....P..",
            "....PP..",
            "...P...."
        ],
        desc: "When opponent casts a spell: negate it and draw 1 card.",
        effect: "negateSpell"
    },

    // ===== MORE FANTASY WARRIORS =====
    {
        id: 37,
        name: "Vampire Lord",
        type: "monster",
        atk: 1100,
        def: 900,
        level: 3,
        pixels: [
            "..KK....",
            ".KWWK...",
            "..WW....",
            ".KKKK...",
            "RKKKRK..",
            "..KK....",
            ".KK.KK..",
            ".K...K.."
        ],
        desc: "An undead nobleman who drains life force from his enemies.",
        effect: null
    },
    {
        id: 38,
        name: "Flame Knight",
        type: "monster",
        atk: 1800,
        def: 600,
        level: 4,
        pixels: [
            "..RR....",
            ".RWWR...",
            "..RR....",
            ".RRRR...",
            "RRORRRR.",
            "..RR....",
            ".RR.RR..",
            ".R...R.."
        ],
        desc: "A knight whose armor burns with eternal flames. Scorches all in his path.",
        effect: "burn300"
    },
    {
        id: 39,
        name: "Unicorn Mage",
        type: "monster",
        atk: 2300,
        def: 1700,
        level: 6,
        pixels: [
            "...W....",
            "..WW....",
            ".WWWW...",
            "WCWCWW..",
            ".WWWWW..",
            "..WWWW..",
            "...WW...",
            "........"
        ],
        desc: "A majestic wizard who rides a unicorn and channels lightning magic.",
        effect: null
    },
    {
        id: 40,
        name: "Sea Warrior",
        type: "monster",
        atk: 1900,
        def: 800,
        level: 4,
        pixels: [
            "..BB..Y.",
            ".BWWB.Y.",
            "..BB..Y.",
            ".BBBB.Y.",
            ".BBBYYY.",
            "..BB....",
            ".BB.BB..",
            ".B...B.."
        ],
        desc: "A merfolk warrior wielding a trident. Attacks from the deep.",
        effect: "pierce"
    },
    {
        id: 41,
        name: "Goblin Thief",
        type: "monster",
        atk: 1200,
        def: 1200,
        level: 3,
        pixels: [
            "..GG....",
            ".GWWG...",
            "..GG....",
            "..GG....",
            "..GGNY..",
            "..GG....",
            ".G..G...",
            "........"
        ],
        desc: "A cunning goblin who steals secrets and treasures from foes.",
        effect: "draw1"
    },
    {
        id: 42,
        name: "Ice Wizard",
        type: "monster",
        atk: 1500,
        def: 1800,
        level: 4,
        pixels: [
            "...C....",
            "..CCC...",
            ".C.C.C..",
            "..CC....",
            ".CCCC...",
            "..CC....",
            ".CC.CC..",
            ".C...C.."
        ],
        desc: "A wizard who commands blizzards. Freezes enemies solid.",
        effect: "shield"
    },
    {
        id: 43,
        name: "Crystal Golem",
        type: "monster",
        atk: 800,
        def: 2100,
        level: 4,
        pixels: [
            ".CCCC...",
            "CCCCCC..",
            "CWCCWC..",
            "CCCCCC..",
            ".CCCC...",
            ".CCCC...",
            "CC..CC..",
            "CC..CC.."
        ],
        desc: "A golem made of pure crystal. Nearly indestructible defense.",
        effect: null
    },
    {
        id: 44,
        name: "Forest Druid",
        type: "monster",
        atk: 1400,
        def: 1600,
        level: 4,
        pixels: [
            ".LLLL...",
            "..GG....",
            ".GWWG...",
            "..GG....",
            ".GGGG...",
            "..GG....",
            ".GG.GG..",
            ".G...G.."
        ],
        desc: "A druid who channels nature's healing power to restore allies.",
        effect: "heal500"
    },
    {
        id: 45,
        name: "Demon General",
        type: "monster",
        atk: 2000,
        def: 1000,
        level: 5,
        pixels: [
            ".R..R...",
            "..RR....",
            ".RWWR...",
            "..RR....",
            ".RRRR...",
            "..RR....",
            ".RR.RR..",
            ".R...R.."
        ],
        desc: "A fearsome demon commander. Deals burning damage on arrival.",
        effect: "burn300"
    },
    {
        id: 46,
        name: "Ancient Tortoise",
        type: "monster",
        atk: 600,
        def: 2500,
        level: 5,
        pixels: [
            "........",
            ".GGGG...",
            "GGGGGG..",
            "GNGGNG..",
            "GGGGGG..",
            ".GGGG...",
            "G....G..",
            "........"
        ],
        desc: "A thousand-year-old tortoise with an impenetrable shell.",
        effect: "shield"
    },
    {
        id: 47,
        name: "Dark Sorcerer",
        type: "monster",
        atk: 1700,
        def: 1300,
        level: 4,
        pixels: [
            "...P....",
            "..PPP...",
            ".PKPKP..",
            "..PP....",
            ".PPPP...",
            "..PP....",
            ".PP.PP..",
            ".P...P.."
        ],
        desc: "A sorcerer who wields forbidden dark magic. Steals enemy knowledge.",
        effect: "draw1"
    },
    {
        id: 48,
        name: "Inferno Dragon",
        type: "monster",
        atk: 2600,
        def: 2100,
        level: 7,
        pixels: [
            ".RR..RR.",
            ".RRRRR..",
            "RRYRY...",
            ".RRRR...",
            "RRRRRRR.",
            "..RRR...",
            ".RR.RR..",
            "RR...RR."
        ],
        desc: "The most powerful dragon. Its flames melt even diamond armor.",
        effect: null
    },
    {
        id: 49,
        name: "Fairy Healer",
        type: "monster",
        atk: 700,
        def: 500,
        level: 2,
        pixels: [
            "..M.M...",
            ".MWWM...",
            "..MW....",
            ".MMMM...",
            "M..M..M.",
            "..MM....",
            ".M..M...",
            "........"
        ],
        desc: "A tiny fairy that heals wounds with magical sparkle dust.",
        effect: "multiply"
    },
    {
        id: 50,
        name: "Thunder Knight",
        type: "monster",
        atk: 2100,
        def: 1400,
        level: 5,
        pixels: [
            "..YY....",
            ".YWWY...",
            "..YY....",
            ".YYYY...",
            "YYCYYY..",
            "..YY....",
            ".YY.YY..",
            ".Y...Y.."
        ],
        desc: "A knight who commands storms. His thunder sword pierces all.",
        effect: "pierce"
    },
    {
        id: 51,
        name: "Demon King",
        type: "monster",
        atk: 2700,
        def: 2300,
        level: 8,
        pixels: [
            "RR..RR..",
            ".RRRR...",
            "RKWWKR..",
            ".RRRR...",
            "RRRRRR..",
            ".RRRR...",
            "RR..RR..",
            "R....R.."
        ],
        desc: "The supreme ruler of the demon realm. Devours all in his path.",
        effect: "destroy"
    },
    {
        id: 52,
        name: "Royal Guard",
        type: "monster",
        atk: 1000,
        def: 1100,
        level: 2,
        pixels: [
            "..RR....",
            ".RSWR...",
            "..SS....",
            ".SSSS...",
            "SSSSSS..",
            "..SS....",
            ".SS.SS..",
            ".S...S.."
        ],
        desc: "A loyal guard of the royal castle. Fights with honor.",
        effect: null
    }
];

// Default deck (20 cards)
const DEFAULT_DECK = [1, 2, 3, 5, 10, 14, 38, 40, 44, 47, 19, 20, 21, 23, 28, 29, 32, 37, 45, 50];

// AI deck options based on difficulty
const AI_DECKS = {
    easy: [2, 7, 7, 8, 11, 13, 15, 17, 17, 19, 19, 20, 21, 27, 29, 30, 31, 32, 33, 34],
    normal: [1, 2, 4, 5, 6, 8, 10, 11, 14, 16, 19, 20, 21, 23, 24, 28, 29, 31, 33, 35],
    hard: [1, 4, 6, 9, 9, 10, 14, 16, 18, 18, 20, 22, 23, 24, 25, 28, 29, 31, 35, 36]
};

function getCardById(id) {
    return { ...CARD_DATABASE.find(c => c.id === id) };
}
