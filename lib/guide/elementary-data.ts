import { type GuideConcept } from './types';
import { BLACK, WHITE } from '@/lib/othello/types';

const _ = 0, B = 1, W = -1;

export const ELEMENTARY_CONCEPTS: GuideConcept[] = [
  // ──────────────────────────────────────────────
  // 1. 開放度理論
  // ──────────────────────────────────────────────
  {
    id: 'openness-theory',
    title: '開放度理論',
    importance: 'high',
    number: 1,
    summary: '開放度とは返す石の周囲の空きマス数の合計。低いほど良い手。数えて比較する習慣をつけましょう。',
    scenarios: [
      {
        title: '開放度の計算',
        description: '開放度を実際に計算して、手を比較してみましょう。',
        // f4(3,5) by BLACK: direction(0,-1): (3,4)=W(opp), (3,3)=B(own) → flip(3,4) ✓ 1枚
        // e4(3,4)の隣接空きを数える: 返した石=e4の周囲の空き
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,B,B,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,_,_,_,
          _,_,_,B,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '黒の手番です。候補手の開放度を比較して最善手を選びましょう。開放度＝返した石の周囲の空きマス数。',
            tag: 'info',
          },
          {
            // f4(3,5): flip e4(3,4). e4隣接: (2,3)=B, (2,4)=B, (2,5)=_, (3,3)=B, (3,5)=B(new), (4,3)=W, (4,4)=B, (4,5)=_
            // 空き: (2,5), (4,5) = 2個. 開放度2!
            move: { row: 3, col: 5 },
            player: BLACK,
            comment: '黒f4。e4の白石を1つ返しました。返したe4の周りの空きマスは2個→開放度2。低くて良い手です！',
            tag: 'good',
            highlights: [28],
          },
          {
            comment: '開放度の計算: 返した石(e4)の8方向の隣を調べ、空きマスの数を数えます。対戦モードの「開放度表示ON」で練習できます。',
            tag: 'info',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. 辺の攻防
  // ──────────────────────────────────────────────
  {
    id: 'edge-battle',
    title: '辺の攻防',
    importance: 'high',
    number: 2,
    summary: '辺の石の並びには「山」「ブロック」「ウイング」があり、それぞれ長所と短所があります。',
    scenarios: [
      {
        title: '山の形と弱点',
        description: '辺の中央に飛び出す「山」の形は隅から崩されやすいです。',
        initialBoard: [
          _,_,B,B,B,_,_,_,
          _,W,B,W,B,_,_,_,
          _,_,W,B,W,_,_,_,
          _,_,B,W,B,_,_,_,
          _,_,W,B,W,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: WHITE,
        steps: [
          {
            comment: '上辺の黒石c1-d1-e1が「山」の形です。辺の中央を取っていますが、隅a1, h1が空いています。',
            tag: 'info',
            highlights: [2, 3, 4],
          },
          {
            comment: '山の弱点: 隅（赤ハイライト）が空いているため、隅を取られると山全体が崩れる危険があります。',
            tag: 'warning',
            highlights: [0, 7],
          },
        ],
      },
      {
        title: 'ブロック（確定石の壁）',
        description: '隅から連続する石は最強の形です。',
        initialBoard: [
          B,B,B,_,_,_,_,_,
          B,W,_,_,_,_,_,_,
          B,_,W,B,_,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: WHITE,
        steps: [
          {
            comment: '黒のa1から伸びるブロック（緑ハイライト）は全て確定石です。隅から連続しているので絶対に返されません！',
            tag: 'good',
            highlights: [0, 1, 2, 8, 16],
          },
          {
            comment: 'ブロックの石はどんな手を打たれても返すことができません。これが隅を取ることの最大の価値です。',
            tag: 'info',
            highlights: [0, 1, 2, 8, 16],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. X打ちの使い方
  // ──────────────────────────────────────────────
  {
    id: 'x-move-usage',
    title: 'X打ちの使い方',
    importance: 'medium',
    number: 3,
    summary: 'X打ちは原則悪手ですが、隅が確定済みの場合は安全に使えます。',
    scenarios: [
      {
        title: 'X打ちが許される場合',
        description: '隅が自分の石なら、X打ちは安全です。',
        // b2(1,1) by BLACK: direction(1,1): (2,2)=W(opp), (3,3)=B(own) → flip(2,2) ✓
        initialBoard: [
          B,B,_,_,_,_,_,_,
          B,_,_,_,_,_,_,_,
          _,_,W,B,_,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: 'a1の隅は黒の確定石です。b2（X打ちの位置）は通常危険ですが、この場合は？',
            tag: 'info',
            highlights: [0, 9],
          },
          {
            move: { row: 1, col: 1 },
            player: BLACK,
            comment: '黒b2。隅a1が確定済みなのでX打ちが安全です。確定石をさらに広げる好手になります。',
            tag: 'good',
            highlights: [0, 1, 8, 9],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. C打ちの使い方
  // ──────────────────────────────────────────────
  {
    id: 'c-move-usage',
    title: 'C打ちの使い方',
    importance: 'medium',
    number: 4,
    summary: '辺の確定石がある場合や戦略的に辺全体を取れる場合、C打ちは有効です。',
    scenarios: [
      {
        title: 'C打ちが有効な場合',
        description: '辺が確定済みならC打ちで確定石を伸ばせます。',
        // e1(0,4) by BLACK: direction(0,-1): (0,3)=B own → NO.
        // Need W between e1 and a BLACK stone. Let me adjust.
        // e1(0,4) by BLACK: direction(1,0): (1,4)=W(opp), (2,4)=B(own) → flip(1,4) ✓
        initialBoard: [
          B,B,B,B,_,_,_,_,
          _,_,W,B,W,_,_,_,
          _,_,W,B,B,_,_,_,
          _,_,B,W,W,_,_,_,
          _,_,W,B,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: 'a1から上辺が黒の確定石です。e1（C打ちの位置）に打つとどうなるでしょう？',
            tag: 'info',
            highlights: [0, 1, 2, 3],
          },
          {
            move: { row: 0, col: 4 },
            player: BLACK,
            comment: '黒e1。確定石ブロックがe1まで伸びました！辺が確定済みならC打ちは安全に確定石を増やす好手です。',
            tag: 'good',
            highlights: [0, 1, 2, 3, 4],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. モビリティ
  // ──────────────────────────────────────────────
  {
    id: 'mobility',
    title: '手数の管理（モビリティ）',
    importance: 'medium',
    number: 5,
    summary: '自分の着手可能数を多く、相手の着手可能数を少なく保つことが勝利のカギです。',
    scenarios: [
      {
        title: '相手の手数を減らす',
        description: 'モビリティを管理して相手を追い詰める方法を見てみましょう。',
        // e3(2,4) by BLACK: direction(0,-1): (2,3)=W(opp), (2,2)=B(own) → flip(2,3) ✓
        //   direction(1,0): (3,4)=W(opp), (4,4)=B(own) → flip(3,4) ✓
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,B,W,_,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,_,_,_,
          _,_,_,B,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '黒の手番です。白の打てる場所を減らす手を選びましょう。',
            tag: 'info',
          },
          {
            move: { row: 2, col: 4 },
            player: BLACK,
            comment: '黒e3。d3とe4の白石を返し、白の石を包み込みました。白の打てる場所が大幅に減りました！',
            tag: 'good',
          },
          {
            comment: 'モビリティのコツ: 中割り＋少なく取ることで、自分のモビリティを増やし相手のモビリティを減らせます。パスに追い込めれば連続手番で大きな有利に！',
            tag: 'info',
          },
        ],
      },
    ],
  },
];
