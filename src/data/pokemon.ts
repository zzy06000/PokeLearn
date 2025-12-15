import { PokemonSpecies } from '../types/game';

// Helper to construct image URL
const getImg = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const getRandomEncounterId = (): string => {
  const keys = Object.keys(POKEMON_DATABASE);
  // Simple random for now
  return keys[Math.floor(Math.random() * keys.length)];
};

export const POKEMON_DATABASE: Record<string, PokemonSpecies> = {
  // Starters & Evos
  'bulbasaur': { id: 'bulbasaur', pokedexId: 1, name: 'Bulbasaur', cnName: '妙蛙种子', type: 'grass', baseImage: getImg(1), evolutionLevel: 10, evolvesTo: 'ivysaur', maxHp: 45, description: "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon." },
  'ivysaur': { id: 'ivysaur', pokedexId: 2, name: 'Ivysaur', cnName: '妙蛙草', type: 'grass', baseImage: getImg(2), evolutionLevel: 30, evolvesTo: 'venusaur', maxHp: 60, description: "When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs." },
  'venusaur': { id: 'venusaur', pokedexId: 3, name: 'Venusaur', cnName: '妙蛙花', type: 'grass', baseImage: getImg(3), maxHp: 80, description: "The plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight." },

  'charmander': { id: 'charmander', pokedexId: 4, name: 'Charmander', cnName: '小火龙', type: 'fire', baseImage: getImg(4), evolutionLevel: 10, evolvesTo: 'charmeleon', maxHp: 39, description: "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail." },
  'charmeleon': { id: 'charmeleon', pokedexId: 5, name: 'Charmeleon', cnName: '火恐龙', type: 'fire', baseImage: getImg(5), evolutionLevel: 30, evolvesTo: 'charizard', maxHp: 58, description: "When it swings its burning tail, it elevates the temperature to unbearably high levels." },
  'charizard': { id: 'charizard', pokedexId: 6, name: 'Charizard', cnName: '喷火龙', type: 'fire', baseImage: getImg(6), maxHp: 78, description: "Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally." },

  'squirtle': { id: 'squirtle', pokedexId: 7, name: 'Squirtle', cnName: '杰尼龟', type: 'water', baseImage: getImg(7), evolutionLevel: 10, evolvesTo: 'wartortle', maxHp: 44, description: "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth." },
  'wartortle': { id: 'wartortle', pokedexId: 8, name: 'Wartortle', cnName: '卡咪龟', type: 'water', baseImage: getImg(8), evolutionLevel: 30, evolvesTo: 'blastoise', maxHp: 59, description: "Often hides in water to stalk unwary prey. For swimming fast, it moves its ears to maintain balance." },
  'blastoise': { id: 'blastoise', pokedexId: 9, name: 'Blastoise', cnName: '水箭龟', type: 'water', baseImage: getImg(9), maxHp: 79, description: "A brutal Pokémon with pressurized water jets on its shell. They are used for high speed tackles." },

  // Bugs & Birds
  'caterpie': { id: 'caterpie', pokedexId: 10, name: 'Caterpie', cnName: '绿毛虫', type: 'bug', baseImage: getImg(10), evolutionLevel: 10, evolvesTo: 'metapod', maxHp: 45, description: "Its short feet are tipped with suction pads that enable it to tirelessly climb slopes and walls." },
  'metapod': { id: 'metapod', pokedexId: 11, name: 'Metapod', cnName: '铁甲蛹', type: 'bug', baseImage: getImg(11), evolutionLevel: 30, evolvesTo: 'butterfree', maxHp: 50, description: "This Pokémon is vulnerable to attack while its shell is soft, exposing its weak and tender body." },
  'butterfree': { id: 'butterfree', pokedexId: 12, name: 'Butterfree', cnName: '巴大蝶', type: 'bug', baseImage: getImg(12), maxHp: 60, description: "In battle, it flaps its wings at high speed to release highly toxic dust into the air." },

  'pidgey': { id: 'pidgey', pokedexId: 16, name: 'Pidgey', cnName: '波波', type: 'flying', baseImage: getImg(16), evolutionLevel: 10, evolvesTo: 'pidgeotto', maxHp: 40, description: "A common sight in forests and woods. It flaps its wings at ground level to kick up blinding sand." },
  'pidgeotto': { id: 'pidgeotto', pokedexId: 17, name: 'Pidgeotto', cnName: '比比鸟', type: 'flying', baseImage: getImg(17), maxHp: 60, description: "Very protective of its sprawling territorial area, this Pokémon will fiercely peck at any intruder." },

  // Pikachu Line
  'pikachu': { id: 'pikachu', pokedexId: 25, name: 'Pikachu', cnName: '皮卡丘', type: 'electric', baseImage: getImg(25), evolutionLevel: 10, evolvesTo: 'raichu', maxHp: 35, description: "When several of these Pokémon gather, their electricity could build and cause lightning storms." },
  'raichu': { id: 'raichu', pokedexId: 26, name: 'Raichu', cnName: '雷丘', type: 'electric', baseImage: getImg(26), maxHp: 60, description: "Its long tail serves as a ground to protect itself from its own high voltage power." },

  // Others
  'jigglypuff': { id: 'jigglypuff', pokedexId: 39, name: 'Jigglypuff', cnName: '胖丁', type: 'normal', baseImage: getImg(39), maxHp: 115, description: "When its huge eyes waver, it sings a mysteriously soothing melody that lulls its enemies to sleep." },
  'meowth': { id: 'meowth', pokedexId: 52, name: 'Meowth', cnName: '喵喵', type: 'normal', baseImage: getImg(52), maxHp: 40, description: "Adores circular objects. Wanders the streets on a nightly basis to look for dropped loose change." },
  'psyduck': { id: 'psyduck', pokedexId: 54, name: 'Psyduck', cnName: '可达鸭', type: 'water', baseImage: getImg(54), maxHp: 50, description: "While lulling its enemies with its vacant look, this wily Pokémon will use psychokinetic powers." },
  'machop': { id: 'machop', pokedexId: 66, name: 'Machop', cnName: '腕力', type: 'fighting', baseImage: getImg(66), maxHp: 70, description: "Loves to build its muscles. It trains in all styles of martial arts to become even stronger." },
  'geodude': { id: 'geodude', pokedexId: 74, name: 'Geodude', cnName: '小拳石', type: 'rock', baseImage: getImg(74), maxHp: 40, description: "Found in fields and mountains. Mistaking them for boulders, people often step or trip on them." },
  'gengar': { id: 'gengar', pokedexId: 94, name: 'Gengar', cnName: '耿鬼', type: 'ghost', baseImage: getImg(94), maxHp: 60, description: "Under a full moon, this Pokémon likes to mimic the shadows of people and laugh at their fright." },
  'onix': { id: 'onix', pokedexId: 95, name: 'Onix', cnName: '大岩蛇', type: 'rock', baseImage: getImg(95), maxHp: 35, description: "As it grows, the stone portions of its body harden to become similar to a diamond, but colored black." },

  // Legends
  'mewtwo': { id: 'mewtwo', pokedexId: 150, name: 'Mewtwo', cnName: '超梦', type: 'psychic', baseImage: getImg(150), maxHp: 106, description: "It was created by a scientist after years of horrific gene splicing and DNA engineering experiments." },
  'mew': { id: 'mew', pokedexId: 151, name: 'Mew', cnName: '梦幻', type: 'psychic', baseImage: getImg(151), maxHp: 100, description: "So rare that it is still said to be a mirage by many experts. Only a few people have seen it worldwide." },
};
