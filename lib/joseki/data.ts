import { type JosekiFamily } from './types';

// Standard opening: f5 d6 c3 d3 c4 ... (coordinates as row, col 0-indexed)
// Othello notation: a-h columns (0-7), 1-8 rows (0-7)
// f5 = row 4, col 5

export const JOSEKI_FAMILIES: JosekiFamily[] = [
  {
    id: 'usagi',
    name: 'Rabbit (Rose)',
    japaneseName: 'うさぎ（ローズ系）',
    description: '最も一般的な定石ファミリー。f5 d6 c3 から始まる展開で、バランスの良い序盤を目指します。',
    sequences: [
      {
        name: 'ローズオープニング',
        description: '基本的なうさぎ定石。中割りを重視した安定展開。',
        moves: [
          { row: 4, col: 5, comment: 'f5: 黒の初手。右中央へ。' },
          { row: 5, col: 3, comment: 'd6: 白の応手。縦取りの基本形。' },
          { row: 2, col: 2, comment: 'c3: 黒は斜め取り。うさぎ定石の始まり。' },
          { row: 2, col: 3, comment: 'd3: 白は中割り。開放度の低い好手。' },
          { row: 2, col: 4, comment: 'e3: 黒は横に展開。' },
          { row: 5, col: 5, comment: 'f6: 白は右下へ。バランスを取る。' },
          { row: 5, col: 4, comment: 'e6: 黒は中央下を確保。' },
          { row: 4, col: 2, comment: 'c5: 白は左方向へ展開。安定した進行。' },
        ],
      },
      {
        name: 'FJT定石',
        description: 'うさぎから派生する攻撃的な展開。',
        moves: [
          { row: 4, col: 5, comment: 'f5: 黒の初手。' },
          { row: 5, col: 3, comment: 'd6: 白の縦取り。' },
          { row: 2, col: 2, comment: 'c3: うさぎの形。' },
          { row: 2, col: 3, comment: 'd3: 白の中割り。' },
          { row: 2, col: 4, comment: 'e3: 黒の展開。' },
          { row: 5, col: 5, comment: 'f6: 白は右下へ。' },
          { row: 5, col: 4, comment: 'e6: 黒は下辺を取る。' },
          { row: 5, col: 2, comment: 'c6: 白は左下へ。攻撃的な手。' },
          { row: 3, col: 5, comment: 'f4: 黒は右側を固める。' },
          { row: 6, col: 5, comment: 'f7: 白は下方向へ。辺に近づく展開。' },
        ],
      },
    ],
  },
  {
    id: 'tora',
    name: 'Tiger',
    japaneseName: 'とら',
    description: 'f5 d6 c4 から始まる定石。攻撃的な展開が多く、上級者に人気です。',
    sequences: [
      {
        name: '虎定石基本形',
        description: '攻撃的でスピーディーな展開。',
        moves: [
          { row: 4, col: 5, comment: 'f5: 黒の初手。' },
          { row: 5, col: 3, comment: 'd6: 白の縦取り。' },
          { row: 3, col: 2, comment: 'c4: 黒は横取り。とら定石の始まり。' },
          { row: 2, col: 2, comment: 'c3: 白は上方向へ。' },
          { row: 2, col: 5, comment: 'f3: 黒は右上へ。攻撃的。' },
          { row: 2, col: 4, comment: 'e3: 白は中割り。' },
          { row: 2, col: 3, comment: 'd3: 黒は上辺を確保。' },
          { row: 1, col: 2, comment: 'c2: 白は辺に近づく。注意が必要。' },
        ],
      },
    ],
  },
  {
    id: 'ushi',
    name: 'Bull',
    japaneseName: 'うし',
    description: 'f5 f6 から始まる定石。縦取りからの展開で、中盤の主導権を握りやすい。',
    sequences: [
      {
        name: '牛定石基本形',
        description: '縦取りからの展開。中盤でリードを握る。',
        moves: [
          { row: 4, col: 5, comment: 'f5: 黒の初手。' },
          { row: 5, col: 5, comment: 'f6: 白は縦取り。うし定石の始まり。' },
          { row: 4, col: 6, comment: 'g5: 黒は右へ展開。' },
          { row: 5, col: 4, comment: 'e6: 白は中央下へ。' },
          { row: 5, col: 6, comment: 'g6: 黒は右下を取る。' },
          { row: 3, col: 5, comment: 'f4: 白は上方向へ。バランス展開。' },
          { row: 6, col: 5, comment: 'f7: 黒は下辺に向かう。' },
          { row: 3, col: 6, comment: 'g4: 白は右上へ。' },
        ],
      },
    ],
  },
  {
    id: 'neko',
    name: 'Cat / Mouse',
    japaneseName: 'ねこ / ねずみ',
    description: 'f5 f4 から始まる定石。斜め取りからの展開で、複雑な中盤になりやすい。',
    sequences: [
      {
        name: '猫定石基本形',
        description: '斜め取りからの複雑な展開。',
        moves: [
          { row: 4, col: 5, comment: 'f5: 黒の初手。' },
          { row: 3, col: 5, comment: 'f4: 白は斜め取り。ねこ定石の始まり。' },
          { row: 2, col: 5, comment: 'f3: 黒は上方向へ。' },
          { row: 2, col: 4, comment: 'e3: 白は中割り。' },
          { row: 2, col: 3, comment: 'd3: 黒は左へ展開。' },
          { row: 5, col: 5, comment: 'f6: 白は下方向へ。' },
          { row: 5, col: 4, comment: 'e6: 黒は中央下を取る。' },
          { row: 1, col: 4, comment: 'e2: 白は上辺に近づく。注意深い展開。' },
        ],
      },
    ],
  },
];
