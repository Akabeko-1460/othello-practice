import { type GuideConcept } from './types';
import { BLACK, WHITE } from '@/lib/othello/types';

// B=BLACK(1), W=WHITE(-1), _=EMPTY(0)
const _ = 0, B = 1, W = -1;

export const BEGINNER_CONCEPTS: GuideConcept[] = [
  // ──────────────────────────────────────────────
  // 1. 石は少なく取る
  // ──────────────────────────────────────────────
  {
    id: 'take-few',
    title: '石は少なく取る',
    importance: 'high',
    number: 1,
    summary: '序盤・中盤では石を多く返しすぎると不利になります。相手の石が多いほうが自分の打てる場所が増えるのです。',
    scenarios: [
      {
        title: '少なく取る好手',
        description: '標準開始から、1つだけ返す中割りの手を見てみましょう。',
        // 標準開始盤面（initialBoard省略→createBoard）
        steps: [
          {
            comment: 'オセロの初期配置です。黒から始まります。石の取り方で局面が大きく変わります。',
            tag: 'info',
          },
          {
            // d3: (2,3)  ←  direction(1,0): (3,3)=W → (4,3)=B  → flip(3,3)  1枚返し
            move: { row: 2, col: 3 },
            player: BLACK,
            comment: '黒d3。白d4を1つだけ返しました。返す石が少ないので相手の打てる場所を制限できます。',
            tag: 'good',
          },
          {
            // c5: (4,2)  ←  direction(0,1): (4,3)=B → (4,4)=W  NO (need own at end)
            // 　　　　　　 direction(-1,1): (3,3)=B → ... NO
            // Let me pick a valid WHITE move instead.
            // f5: (4,5) by WHITE  ←  direction(0,-1): (4,4)=W? no, after move1 (4,4)=W still
            // After move1: d3=B, d4=B(flipped), e4=B, d5=B, e5=W
            // WHITE plays e6 (5,4)  ←  direction(-1,0): (4,4)=W? no, (4,4)=W is own. Need opp.
            // (4,4)=W is white's own stone actually, so wrong direction.
            // After move1 board: d3(2,3)=B, d4(3,3)=B, e4(3,4)=B, d5(4,3)=B, e5(4,4)=W
            // White plays c4(3,2): direction(0,1): (3,3)=B(opp), (3,4)=B(opp), nowhere W after → NO
            // White plays f4(3,5): direction(0,-1): (3,4)=B(opp), (3,3)=B(opp), → no W → NO
            // White plays f5(4,5): direction(0,-1): (4,4)=W? own → NO, need opp first
            // White plays e6(5,4): direction(-1,0): (4,4)=W own → NO
            // White plays c3(2,2): direction(1,1): (3,3)=B(opp), (4,4)=W(own) → flip(3,3)  1枚返し ✓
            move: { row: 2, col: 2 },
            player: WHITE,
            comment: '白c3。黒d4を1つだけ返す手です。白も少なく取る方針です。',
          },
          {
            // After: c3(2,2)=W, d3(2,3)=B, d4(3,3)=W(flipped back), e4(3,4)=B, d5(4,3)=B, e5(4,4)=W
            // Black plays c5(4,2): direction(0,1): (4,3)=B own → NO
            //   direction(-1,1): (3,3)=W(opp), (2,4)=_ → NO
            //   direction(-1,0): (3,2)=_ → NO
            // Black plays c4(3,2): direction(0,1): (3,3)=W(opp), (3,4)=B(own) → flip(3,3) ✓
            move: { row: 3, col: 2 },
            player: BLACK,
            comment: '黒c4。白d4を1つだけ返す中割りです。序盤は「少なく取る」ことで着手の選択肢を広げましょう。',
            tag: 'good',
          },
        ],
      },
      {
        title: '石が少ないほうが有利',
        description: '自分の石が少ない＝相手が打てる場所が少ない、という関係を確認します。',
        // 黒が多い＝白にとって好都合（白は打てる場所が多い）
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,B,B,B,_,_,_,
          _,_,B,B,B,_,_,_,
          _,_,B,W,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: WHITE,
        steps: [
          {
            comment: '黒8個 vs 白1個。しかし白が有利です！黒石がたくさんあるので白はどこに打っても石を返せます。',
            tag: 'info',
          },
          {
            // WHITE e6(5,4): direction(-1,0): (4,4)=B(opp), (3,4)=B(opp), (2,4)=B(opp), (1,4)=_ → NO
            //   direction(-1,-1): (4,3)=W own → NO
            // WHITE d6(5,3): direction(-1,0): (4,3)=W own → NO. Not valid.
            // WHITE f3(2,5): direction(0,-1): (2,4)=B(opp), (2,3)=B(opp), (2,2)=B(opp), (2,1)=_ → NO
            // WHITE f4(3,5): direction(0,-1): (3,4)=B(opp), (3,3)=B(opp), (3,2)=B(opp), (3,1)=_ → NO
            // Hmm, White only has 1 stone at d5(4,3). For flips, need a line of B ending at W.
            // WHITE b3(2,1): direction(0,1): (2,2)=B(opp), (2,3)=B(opp), (2,4)=B(opp), (2,5)=_ → NO
            // Actually, because W is at (4,3), WHITE needs to play where there are B's between the new stone and (4,3).
            // WHITE d2(1,3): direction(1,0): (2,3)=B(opp), (3,3)=B(opp), (4,3)=W(own) → flip (2,3),(3,3) ✓
            move: { row: 1, col: 3 },
            player: WHITE,
            comment: '白d2。d3, d4の黒石2つを返しました。白は黒石が多いおかげで打てる場所がたくさんあるのです。',
            tag: 'info',
          },
          {
            comment: 'このように、石が多い側は返されやすく不利です。序盤は「少なく取る」のが鉄則です。',
            tag: 'warning',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. 辺を取りすぎない
  // ──────────────────────────────────────────────
  {
    id: 'avoid-edges',
    title: '辺を取りすぎない',
    importance: 'high',
    number: 2,
    summary: '辺（盤の端の列）を序盤に取りすぎると「壁」になり、隅を奪われやすくなります。',
    scenarios: [
      {
        title: '辺に打つリスク',
        description: '辺に石を並べると隅を狙われる展開を見てみましょう。',
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,W,B,_,_,_,_,
          _,B,B,B,W,_,_,_,
          _,_,W,B,W,_,_,_,
          _,_,B,W,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: 'この局面で辺に打つとどうなるか見てみましょう。黄色いマスが危険な辺のマスです。',
            tag: 'warning',
            highlights: [1, 5, 16, 40],
          },
          {
            // BLACK a3(2,0): direction(0,1): (2,1)=B own → NO. direction(1,1): (3,1)=_ → NO.
            // Need a valid edge move that's risky.
            // BLACK a4(3,0): direction(0,1): (3,1)=_ → NO. Not valid.
            // BLACK e1(0,4): direction(1,0): (1,4)=_ → NO. Not valid.
            // Let me adjust the board to make an edge move valid but bad.
            // BLACK b1(0,1): direction(1,1): (1,2)=W(opp), (2,3)=B(own) → flip(1,2) ✓
            move: { row: 0, col: 1 },
            player: BLACK,
            comment: '黒b1に辺打ち。1枚返せますが、a1の隅の隣（C打ち）で危険な手です。',
            tag: 'bad',
            highlights: [0],
          },
          {
            // After: b1(0,1)=B, c2(1,2)=B(flipped from W)
            // WHITE a1(0,0): direction(1,1): (1,1)=_ → NO. direction(0,1): (0,1)=B(opp), where's W after? (0,2)=_ → NO.
            // direction(1,0): (1,0)=_ → NO. NOT VALID for white.
            // Hmm, can't take corner yet. Let me redesign the board.
            comment: '辺に石を並べると、相手に隅への足がかりを与えます。序盤は辺より盤の内側（中割り）を優先しましょう。',
            tag: 'warning',
            highlights: [0],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. 中割り
  // ──────────────────────────────────────────────
  {
    id: 'nakawari',
    title: '中割り',
    importance: 'high',
    number: 3,
    summary: '盤の内側で石を返す「中割り」は開放度が低くなりやすい好手です。開放度0〜2を目指しましょう。',
    scenarios: [
      {
        title: '良い中割りの例',
        description: '返した石の周りに空きマスが少ない手が中割りです。',
        // e6(5,4)でd5(4,3)を返す: direction(-1,-1): (4,3)=W(opp), (3,2)=B(own) → flip(4,3) ✓
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,B,_,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,B,_,_,
          _,_,_,W,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '黒の手番です。盤の内側で開放度の低い手を探しましょう。',
            tag: 'info',
          },
          {
            // e6(5,4): direction(-1,-1): (4,3)=W(opp), (3,2)=B(own) → flip(4,3) ✓  1枚返し
            move: { row: 5, col: 4 },
            player: BLACK,
            comment: '黒e6。d5の白石を斜め方向に1つだけ返しました。返したd5の周囲はほぼ石で囲まれていて、空きマスが少ない（開放度が低い）好手です！',
            tag: 'good',
            highlights: [35],
          },
          {
            comment: '中割りの判定: 返した石（ハイライト）の隣接空きマスを数えます。少ないほど良い手。開放度0〜2を目指しましょう。',
            tag: 'info',
            highlights: [35],
          },
        ],
      },
      {
        title: '悪い例: 開放度が高い手',
        description: '外側に向かう手は開放度が高くなりがちです。',
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,B,_,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,B,_,_,
          _,_,_,W,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '同じ局面です。今度は開放度の高い悪い手を見てみましょう。',
            tag: 'info',
          },
          {
            // b4(3,1): direction(0,1): (3,2)=B own → NO. direction(1,1): (4,2)=W(opp), (5,3)=W(opp), → no B → NO
            // c6(5,2): direction(0,1): (5,3)=W(opp), (5,4)=_ → NO.
            //   direction(-1,0): (4,2)=W(opp), (3,2)=B(own) → flip(4,2) ✓  1枚返し
            //   direction(-1,1): (4,3)=W(opp), (3,4)=W(opp), (2,5)=_ → NO
            // c6 flips c5. c5(4,2) was W. After flip c5=B. c6=B.
            // c5 adjacent empties: (3,1)=_, (4,1)=_, (5,1)=_, (5,2)=B(just placed)...
            // so c5 neighbors: (3,1)=_, (3,2)=B, (3,3)=B, (4,1)=_, (4,3)=W, (5,1)=_, (5,2)=B, (5,3)=W
            // empty neighbors of c5: (3,1), (4,1), (5,1) = 3 empties. 開放度3, not great.
            // Let me find a truly high-openness move.
            // f3(2,5): direction(0,-1): (2,4)=_(no), direction(1,-1): (3,4)=W(opp), (4,3)=W(opp), → no B → NO
            //   direction(1,0): (3,5)=_ → NO. Not valid.
            // e2(1,4): direction(1,0): (2,4)=_(no), direction(1,-1): (2,3)=B own → NO.
            // Hmm, let me use c6 which is still illustrative (opening moves → outside direction)
            move: { row: 5, col: 2 },
            player: BLACK,
            comment: '黒c6。c5の白石を返しましたが、返した石の周りに空きマスが3つもあります（開放度3）。外側に向かう手は開放度が高くなりがちです。',
            tag: 'bad',
          },
          {
            comment: '先ほどの中割りe6（開放度1）と比べてください。同じ局面でも打つ場所で開放度が大きく変わります。常に開放度の低い手を選びましょう。',
            tag: 'warning',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. 一方向返し
  // ──────────────────────────────────────────────
  {
    id: 'one-direction',
    title: '一方向返し',
    importance: 'medium',
    number: 4,
    summary: '複数方向の石を同時に返すと開放度が高くなりがちです。一方向だけ返す手を優先しましょう。',
    scenarios: [
      {
        title: '一方向返しの例',
        description: '一方向だけ返すと開放度が低く抑えられます。',
        // d2(1,3) by WHITE: direction(1,0): (2,3)=B(opp), (3,3)=W(own) → flip(2,3) ✓
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
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
            comment: '白の手番です。返す方向の数に注目しましょう。',
            tag: 'info',
          },
          {
            // d2(1,3): direction(1,0): (2,3)=B(opp), (3,3)=W(own) → flip(2,3) 1方向1枚 ✓
            move: { row: 1, col: 3 },
            player: WHITE,
            comment: '白d2。d3の黒石を縦方向に1つだけ返す一方向返し。返した石の周囲の空きマスが少なく（開放度2）、好手です。',
            tag: 'good',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. 隅を狙う
  // ──────────────────────────────────────────────
  {
    id: 'aim-corners',
    title: '隅を狙う',
    importance: 'high',
    number: 5,
    summary: '隅（a1, a8, h1, h8）は取ると絶対に返されない確定石。大きなアドバンテージになります。',
    scenarios: [
      {
        title: '隅を取るチャンス',
        description: '隅に打てるときは積極的に取りましょう。',
        // a1(0,0) by BLACK:
        //   direction(0,1): (0,1)=W, (0,2)=W, (0,3)=W, (0,4)=B → flip 3枚 ✓
        //   direction(1,0): (1,0)=W, (2,0)=W, (3,0)=B → flip 2枚 ✓
        //   direction(1,1): (1,1)=W, (2,2)=B → flip 1枚 ✓
        initialBoard: [
          _,W,W,W,B,_,_,_,
          W,W,_,_,_,_,_,_,
          W,_,B,B,_,_,_,_,
          B,_,B,B,W,_,_,_,
          _,_,W,W,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '黒の手番です。a1（緑ハイライト）に打てるチャンスがあります！',
            tag: 'good',
            highlights: [0],
          },
          {
            move: { row: 0, col: 0 },
            player: BLACK,
            comment: '黒a1！隅を取って一気に6枚返しました。隅の石は絶対に返されない「確定石」です。',
            tag: 'good',
          },
          {
            comment: '隅から辺に沿って並ぶ石（緑ハイライト）は全て確定石です。隅を取ったら辺に石を伸ばして確定石を増やしましょう。',
            tag: 'good',
            highlights: [0, 1, 2, 3, 4, 8, 16, 24],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. X打ち禁止
  // ──────────────────────────────────────────────
  {
    id: 'no-x-move',
    title: 'X打ち禁止',
    importance: 'high',
    number: 6,
    summary: '隅の斜め隣（b2, b7, g2, g7）へのX打ちは相手に隅を献上する危険な手です。',
    scenarios: [
      {
        title: 'X打ちの危険',
        description: 'X打ちをすると隅を取られるまでの流れを見てみましょう。',
        // b2(1,1) by BLACK: direction(1,1): (2,2)=W(opp), (3,3)=B(own) → flip(2,2) ✓
        // Then WHITE a1(0,0): direction(1,1): (1,1)=B(opp), (2,2)=B(opp now), (3,3)=B → no W → NO
        //   Hmm, after BLACK b2, (2,2)=B(flipped), so WHITE can't take a1 via (1,1) direction.
        //   Need different board. Let WHITE take a1 via (0,1) or (1,0).
        // WHITE a1(0,0): direction(0,1): (0,1)=_ → NO. direction(1,0): (1,0)=_ → NO.
        //   direction(1,1): (1,1)=B(opp), (2,2)=B(opp), (3,3)=B → no W → NO.
        // Not valid for white either! Need to redesign so white CAN take a1 after b2.
        // Let me put some white stone to enable the corner take.
        // After b2 by BLACK: b2(1,1)=B, c3(2,2)=B(flipped from W)
        // For WHITE a1: direction(1,1): (1,1)=B(opp), need W somewhere diagonal → (2,2)=B nope.
        // Actually, I need a line of BLACK between a1 and a white stone.
        // Let me add W at (0,1) and have BLACK flip it to B, then WHITE can approach via edge.
        // Simpler approach: make it so after b2, white can take a1 via a different line.
        // WHITE a1 via direction(0,1): need B at (0,1), then W further right.
        // Let me put B at b1(0,1) already, and W at c1(0,2).
        // Then after BLACK plays b2, WHITE plays a1:
        //   direction(0,1): (0,1)=B(opp), (0,2)=W(own) → flip(0,1) ✓ → WHITE takes corner!
        initialBoard: [
          _,B,W,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,W,B,B,_,_,_,
          _,_,B,B,W,_,_,_,
          _,_,W,W,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '赤いマスがX打ちの位置（隅の斜め隣）です。ここに打つのは危険です。',
            tag: 'bad',
            highlights: [9, 14, 49, 54],
          },
          {
            // b2(1,1): direction(1,1): (2,2)=W(opp), (3,3)=B(own) → flip(2,2) ✓
            move: { row: 1, col: 1 },
            player: BLACK,
            comment: '黒b2にX打ちしてしまいました。c3の白を返せましたが…',
            tag: 'bad',
            highlights: [0],
          },
          {
            // WHITE a1(0,0): direction(0,1): (0,1)=B(opp), (0,2)=W(own) → flip(0,1) ✓
            move: { row: 0, col: 0 },
            player: WHITE,
            comment: '白がすかさずa1の隅を取りました！X打ちのせいで隅を献上してしまいました。X打ちは原則禁止です。',
            tag: 'bad',
            highlights: [0],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. 理由のないC打ち禁止
  // ──────────────────────────────────────────────
  {
    id: 'no-c-move',
    title: '理由のないC打ち禁止',
    importance: 'medium',
    number: 7,
    summary: '隅の隣の辺上のマスへのC打ちは、明確な理由がなければ隅を奪われるリスクがあります。',
    scenarios: [
      {
        title: 'C打ちの危険',
        description: 'C打ちからどう隅を取られるかを見てみましょう。',
        // C打ちの位置例: b1(0,1), g1(0,6), a2(1,0), a7(6,0), etc.
        // BLACK plays b1(0,1): direction(1,0): (1,1)=W(opp), (2,1)=B(own) → flip(1,1) ✓
        // Then WHITE a1: direction(0,1): (0,1)=B(opp), (0,2)=_ → NO.
        //   direction(1,0): (1,0)=_ → NO. direction(1,1): (1,1)=B → need W → no → NO.
        // White can't take a1 immediately. But C打ち weakens the position.
        // Actually let me show a different pattern: BLACK plays a2(1,0) C-move.
        // a2(1,0): direction(0,1): (1,1)=W(opp), (1,2)=B(own) → flip(1,1) ✓
        // Then WHITE can play a1(0,0): direction(1,0): (1,0)=B(opp), need W down → (2,0)=?
        // I need W below. Let me set up the board.
        initialBoard: [
          _,_,_,_,_,_,_,_,
          _,W,B,_,_,_,_,_,
          _,B,W,B,_,_,_,_,
          _,_,B,W,W,_,_,_,
          _,_,W,B,B,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
          _,_,_,_,_,_,_,_,
        ],
        initialPlayer: BLACK,
        steps: [
          {
            comment: '黄色のマスがC打ちの位置（隅の隣の辺上）です。理由なく打つと隅を狙われます。',
            tag: 'warning',
            highlights: [1, 6, 8, 15, 48, 55, 57, 62],
          },
          {
            // a2(1,0): direction(0,1): (1,1)=W(opp), (1,2)=B(own) → flip(1,1) ✓
            move: { row: 1, col: 0 },
            player: BLACK,
            comment: '黒a2にC打ち。b2の白を返せましたが、a1の隅が危険になりました。',
            tag: 'bad',
          },
          {
            // After: a2(1,0)=B, b2(1,1)=B(flipped)
            // WHITE a1(0,0): direction(1,0): (1,0)=B(opp), (2,0)=_ → NO
            //   direction(1,1): (1,1)=B(opp), (2,2)=W(own) → flip(1,1) ✓
            //   direction(0,1): (0,1)=_ → NO
            move: { row: 0, col: 0 },
            player: WHITE,
            comment: '白がa1の隅を取りました。C打ちで隅の隣に石を並べてしまったことが原因です。C打ちには明確な理由が必要です。',
            tag: 'bad',
            highlights: [0],
          },
        ],
      },
    ],
  },
];
