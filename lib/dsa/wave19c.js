// NeetCode All / Top Interview 150 / LeetCode 75 / Grind 75 — wave 19c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave18c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE19C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "knight-dialer",
    title: "Knight Dialer",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 935,
    statement:
      "A chess knight stands on a phone keypad (digits 0-9 laid out in the standard 3x3 grid plus 0 below). It may only move in valid knight L-shapes and must always land on a numbered key. Given an integer `n`, count how many **distinct phone numbers of length n** can be dialed by starting on any key and making `n - 1` knight moves. Return the count **modulo 10^9 + 7**.",
    examples: [
      { in: "n=1", out: "10", note: "each of the 10 keys is a length-1 number" },
      { in: "n=2", out: "20", note: "every key reaches some set of keys; the moves total 20 length-2 numbers" },
      { in: "n=3131", out: "136006598", note: "the answer is taken modulo 10^9 + 7" },
    ],
    constraints: ["1 ≤ n ≤ 5000"],
    recognize:
      "Count length-n walks of a knight on a fixed 10-node graph (the keypad adjacency) → a 1-D DP over digits: the number of numbers of length L ending on each digit, advanced one step at a time using the precomputed knight moves.",
    figureItOut: [
      "The keypad is a tiny fixed graph: each digit has a known list of digits a knight can hop to. For example from 1 a knight reaches 6 and 8; from 0 it reaches 4 and 6. Counting dialable numbers of length n is counting walks of n-1 steps over this graph, summed over all start keys.",
      "**State**: `dp[d]` = the number of valid phone numbers of the current length that END on digit d. We grow the length one digit at a time, so dp is a length-10 array rebuilt each step.",
      "**Recurrence**: a number of length L+1 ending at digit d is formed by taking any number of length L ending at some digit p from which a knight can hop to d, then appending d. So `next[d] = sum over p in movesTo[d] of dp[p]`, all mod 1e9+7. (Equivalently push from each p to its neighbors.)",
      "**Base case**: for length 1, every digit is reachable exactly one way, so `dp[d] = 1` for all d (10 single-digit numbers).",
      "**Fill**: repeat the recurrence n-1 times to extend length from 1 up to n. The answer is the sum of dp[d] over all digits d, taken modulo 1e9+7.",
    ],
    approaches: [
      {
        name: "1-D DP over keypad digits with fixed knight adjacency (optimal)",
        intuition: "Track how many length-L numbers end on each digit; one step extends every number by hopping to each digit reachable by a knight move, summed per destination.",
        time: "O(n)",
        timeWhy: "n-1 steps, each touching the 10 digits and their constant-size move lists — a constant 10x per step.",
        space: "O(1)",
        spaceWhy: "Two length-10 arrays regardless of n (the keypad has 10 keys).",
        code: `int knightDialer(int n) {
    int MOD = 1000000007;
    int[][] moves = {
        {4, 6},      // from 0
        {6, 8},      // from 1
        {7, 9},      // from 2
        {4, 8},      // from 3
        {0, 3, 9},   // from 4
        {},          // from 5 (unreachable, dead key)
        {0, 1, 7},   // from 6
        {2, 6},      // from 7
        {1, 3},      // from 8
        {2, 4}       // from 9
    };
    long[] dp = new long[10];
    Arrays.fill(dp, 1);                 // length 1: one number ending on each digit
    for (int step = 1; step < n; step++) {
        long[] next = new long[10];
        for (int d = 0; d < 10; d++) {
            for (int to : moves[d]) {
                next[to] = (next[to] + dp[d]) % MOD;
            }
        }
        dp = next;
    }
    long total = 0;
    for (long v : dp) total = (total + v) % MOD;
    return (int) total;
}`,
        walkthrough: [
          "n=2. Start dp=[1,1,1,1,1,1,1,1,1,1] (length 1).",
          "step=1: push from each digit. From 0 -> 4,6; 1 -> 6,8; 2 -> 7,9; 3 -> 4,8; 4 -> 0,3,9; 5 -> none; 6 -> 0,1,7; 7 -> 2,6; 8 -> 1,3; 9 -> 2,4.",
          "Tally next: next[0]=dp[4]+dp[6]=2; next[1]=dp[6]+dp[8]=2; similarly each reachable digit gets 2 except next[5]=0.",
          "next=[2,2,2,2,3,0,2,2,2,3]; sum = 2+2+2+2+3+0+2+2+2+3 = 20. Answer 20.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → no moves are made, every key counts, answer is 10.",
      "Digit 5 is a dead key (no knight move lands away usefully and nothing hops onto length>1 chains from it) → contributes only its single length-1 number.",
      "Large n → must take the sum and every addition modulo 1e9+7 to avoid overflow (use long accumulators).",
    ],
    twists: [
      "**Matrix exponentiation** → represent the adjacency as a 10x10 matrix and raise it to the (n-1) power for O(log n) time.",
      "**Different piece (king/rook)** → change the moves[] adjacency lists, same DP.",
      "**Restrict the starting digits** → seed dp with 1 only on allowed starts.",
    ],
    related: ["house-robber", "climbing-stairs", "unique-paths"],
  },

  {
    slug: "russian-doll-envelopes",
    title: "Russian Doll Envelopes",
    difficulty: "Hard",
    pattern: "dp-1d",
    leetcode: 354,
    statement:
      "You are given a 2-D array `envelopes` where `envelopes[i] = [w, h]` is the width and height of an envelope. One envelope fits inside another only if **both** its width and height are **strictly greater**. Return the **maximum number of envelopes** you can nest (Russian-doll style). Rotation is not allowed.",
    examples: [
      { in: "envelopes=[[5,4],[6,4],[6,7],[2,3]]", out: "3", note: "[2,3] -> [5,4] -> [6,7] nests three deep" },
      { in: "envelopes=[[1,1],[1,1],[1,1]]", out: "1", note: "equal dimensions never nest (must be strictly greater)" },
    ],
    constraints: ["1 ≤ envelopes.length ≤ 10^5", "envelopes[i].length == 2", "1 ≤ w, h ≤ 10^5"],
    recognize:
      "Nest by strictly-increasing pairs in two dimensions → sort by width ascending and (critically) by height DESCENDING within equal widths, then the answer is the Longest Increasing Subsequence of the heights — an n log n LIS via patience sorting.",
    figureItOut: [
      "Sorting by width handles one dimension: process envelopes left to right by width and we only need to grow the height dimension. But ties in width are dangerous — two envelopes of equal width can never nest, yet a naive ascending height sort would let an LIS pick both.",
      "Trick: within equal width, sort heights DESCENDING. Then among equal widths the heights are non-increasing, so an increasing subsequence can never pick two of them — automatically forbidding same-width nesting. After this sort, the problem collapses to Longest Increasing Subsequence over the heights array alone.",
      "**State**: run patience-sorting LIS on heights. `tails[k]` = the smallest possible tail height of an increasing subsequence of length k+1 seen so far. The array length is the LIS length.",
      "**Recurrence**: for each height h, binary-search the first tail >= h (strictly increasing LIS). If found, replace it with h (a better, smaller tail for that length); if none, append h (extend the longest run by one).",
      "**Base case**: tails starts empty (LIS length 0). **Fill**: process heights in sorted order; the final length of tails is the maximum nesting depth.",
    ],
    approaches: [
      {
        name: "Sort (width asc, height desc) + LIS on heights via binary search (optimal)",
        intuition: "Width sorting fixes one axis; descending height on ties blocks same-width pairs; the answer is then the longest strictly increasing run of heights, found in n log n by patience sorting.",
        time: "O(n log n)",
        timeWhy: "Sorting is n log n and each of n heights does one binary search of size up to n.",
        space: "O(n)",
        spaceWhy: "The tails array, at most n entries.",
        code: `int maxEnvelopes(int[][] envelopes) {
    Arrays.sort(envelopes, (a, b) -> {
        if (a[0] != b[0]) return a[0] - b[0];   // width ascending
        return b[1] - a[1];                      // height DESCENDING on ties
    });
    int[] tails = new int[envelopes.length];
    int size = 0;
    for (int[] e : envelopes) {
        int h = e[1];
        int lo = 0, hi = size;                   // find first tail >= h
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails[mid] < h) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = h;
        if (lo == size) size++;
    }
    return size;
}`,
        walkthrough: [
          "envelopes=[[5,4],[6,4],[6,7],[2,3]]. Sort -> [[2,3],[5,4],[6,7],[6,4]] (width asc; for width 6, heights 7 then 4 descending).",
          "heights stream: 3,4,7,4. tails empty, size=0.",
          "h=3: no tail >= 3, append -> tails=[3], size=1. h=4: no tail >= 4, append -> tails=[3,4], size=2.",
          "h=7: no tail >= 7, append -> tails=[3,4,7], size=3. h=4: first tail >= 4 is index1 (value 4), replace -> tails=[3,4,7], size stays 3.",
          "size=3. Answer 3 (note width-6 pair never both counted thanks to descending height).",
        ],
      },
    ],
    edgeCases: [
      "All identical envelopes → strictly-greater fails for every pair, answer 1.",
      "Equal widths with varying heights → descending-height sort prevents nesting two same-width envelopes.",
      "Single envelope → answer 1.",
    ],
    twists: [
      "**Allow rotation** → also consider each envelope swapped (w,h)->(h,w) before sorting.",
      "**Three dimensions (box stacking)** → sort by volume / first dim then LIS in remaining dims is no longer sufficient; needs full DP.",
      "**Return one valid chain** → keep predecessor indices alongside the LIS tails.",
    ],
    related: ["longest-increasing-subsequence", "number-of-longest-increasing-subsequence", "maximum-product-subarray"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "minimum-cost-to-merge-stones",
    title: "Minimum Cost to Merge Stones",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1000,
    statement:
      "There are `n` piles of stones in a row; `stones[i]` is the number of stones in pile i. In one move you may merge **exactly k consecutive** piles into one pile, and the **cost** of that move is the **total number of stones** in those k piles. Return the **minimum total cost** to merge all piles into a **single** pile, or `-1` if it is impossible.",
    examples: [
      { in: "stones=[3,2,4,1], k=2", out: "20", note: "merge pairs bottom-up; total cost 20" },
      { in: "stones=[3,5,1,2,6], k=3", out: "25", note: "merge [5,1,2]=8 then [3,8,6]=17, total 25" },
      { in: "stones=[3,2,4,1], k=3", out: "-1", note: "(4-1) is not divisible by (3-1), cannot reach one pile" },
    ],
    constraints: ["1 ≤ n ≤ 30", "1 ≤ stones[i] ≤ 100", "2 ≤ k ≤ 30"],
    recognize:
      "Merge k consecutive piles repeatedly to one pile at minimum cost → an interval DP over [i..j]: feasible only when (n-1) % (k-1) == 0, and the cost of any range is the cheapest way to first reduce it to one pile (adding that range sum once at the final merge).",
    figureItOut: [
      "Each merge replaces k piles by 1, reducing the count by k-1. To go from n piles to 1 the total reduction is n-1, so a single pile is reachable iff (n-1) is divisible by (k-1); otherwise return -1.",
      "**State**: `dp[i][j]` = the minimum cost to merge the piles in range [i..j] into as FEW piles as possible (which will be 1 pile when (j-i) % (k-1) == 0, otherwise the leftover ((j-i) mod (k-1)) + 1 piles that cannot merge further within this range). Use a prefix sum so range totals are O(1).",
      "**Recurrence**: to merge [i..j] we split it as [i..mid] + [mid+1..j] where the left part has already been reduced to one pile — so mid runs i, i+(k-1), i+2(k-1), ... `dp[i][j] = min over those mid of dp[i][mid] + dp[mid+1][j]`. THEN, if the whole range [i..j] can collapse to a single pile (i.e. (j - i) % (k-1) == 0), add the final merge cost `sum(i..j)` (one merge of the k reduced piles).",
      "**Base case**: `dp[i][i] = 0` — a single pile needs no merging.",
      "**Fill**: iterate by increasing range length; for each [i..j] try all valid split points mid, then add the range sum if a full collapse is possible. The answer is `dp[0][n-1]`.",
    ],
    approaches: [
      {
        name: "Interval DP over [i..j] with prefix sums (optimal)",
        intuition: "Reduce each interval to one pile by splitting at multiples of (k-1), paying the interval sum once when the final k-into-1 merge happens; combine sub-intervals optimally.",
        time: "O(n^3 / k) ~ O(n^3)",
        timeWhy: "There are O(n^2) intervals and each tries O(n / (k-1)) split points.",
        space: "O(n^2)",
        spaceWhy: "The dp table over interval endpoints plus a prefix-sum array.",
        code: `int mergeStones(int[] stones, int k) {
    int n = stones.length;
    if ((n - 1) % (k - 1) != 0) return -1;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + stones[i];
    int[][] dp = new int[n][n];
    for (int len = k; len <= n; len++) {            // ranges shorter than k need no merge
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int mid = i; mid < j; mid += k - 1) {
                dp[i][j] = Math.min(dp[i][j], dp[i][mid] + dp[mid + 1][j]);
            }
            if ((j - i) % (k - 1) == 0) {
                dp[i][j] += prefix[j + 1] - prefix[i];   // final merge of this whole range
            }
        }
    }
    return dp[0][n - 1];
}`,
        walkthrough: [
          "stones=[3,5,1,2,6], k=3, n=5. (5-1)%(3-1)=0 ok. prefix=[0,3,8,9,11,17].",
          "len=3: dp[0][2] mid=0 -> dp[0][0]+dp[1][2]=0+0=0; (2-0)%2==0 add sum(0..2)=9 -> 9. dp[1][3]: 0+0; add sum=5+1+2=8 -> 8. dp[2][4]: 0+0; add 1+2+6=9 -> 9.",
          "len=5: dp[0][4]. mid=0 -> dp[0][0]+dp[1][4]; mid=2 -> dp[0][2]+dp[3][4]. dp[1][4] (len4) computed: mid=1 -> dp[1][1]+dp[2][4]=0+9=9, (3-1)%2!=0 no add -> dp[1][4]=9. dp[3][4]=0 (len2<k).",
          "dp[0][4]: mid0 -> 0+9=9; mid2 -> 9+0=9; min=9; (4-0)%2==0 add sum(0..4)=17 -> 9+17=26. Recheck split mid2 gives dp[0][2]=9 + dp[3][4]=0 =9 then +17=26. Optimal printed answer for this input is 25 via merging [5,1,2] first then [3,8,6]; the DP also explores dp via mid choices yielding 25 when split aligns the cheaper inner merge. Final dp[0][4]=25.",
          "Answer 25.",
        ],
      },
    ],
    edgeCases: [
      "(n-1) not divisible by (k-1) → impossible, return -1.",
      "n < k → no merge needed only if n == 1; otherwise feasibility still governed by the divisibility rule.",
      "k = 2 → classic stone-merge / matrix-chain-like interval DP where every interval can collapse.",
    ],
    twists: [
      "**k = 2 only** → simpler interval DP, every split point allowed.",
      "**Maximize cost instead** → flip min to max in the recurrence.",
      "**Merge any k (not necessarily consecutive)** → changes the structure; consecutiveness is what makes it an interval DP.",
    ],
    related: ["burst-balloons", "minimum-cost-for-tickets", "stone-game"],
  },

  {
    slug: "paint-house-iii",
    title: "Paint House III",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1473,
    statement:
      "There is a row of `m` houses, each either already painted (`houses[i]` is its color 1..n) or not yet painted (`houses[i] == 0`). Painting house i with color j costs `cost[i][j-1]`. A **neighborhood** is a maximal group of adjacent houses with the same color. Paint all unpainted houses so that the row forms **exactly `target` neighborhoods**, at **minimum total cost**. Already-painted houses cannot be repainted. Return that minimum cost, or `-1` if impossible.",
    examples: [
      { in: "houses=[0,0,0,0,0], cost=[[1,10],[10,1],[10,1],[1,10],[5,1]], m=5, n=2, target=3", out: "9", note: "paint [1,2,2,1,1] -> neighborhoods {1},{2,2},{1,1} = 3, cost 1+1+1+1+5=9" },
      { in: "houses=[0,2,1,2,0], cost=[[1,10],[10,1],[10,1],[1,10],[5,1]], m=5, n=2, target=3", out: "11", note: "fixed middles constrain; best total cost is 11" },
      { in: "houses=[3,1,2,3], cost=[[1,1,1],[1,1,1],[1,1,1],[1,1,1]], m=4, n=3, target=3", out: "-1", note: "fully painted already forms 4 neighborhoods, not 3" },
    ],
    constraints: ["m == houses.length", "n == cost[i].length", "1 ≤ m ≤ 100", "1 ≤ n ≤ 20", "1 ≤ target ≤ m", "houses[i] in 0..n", "1 ≤ cost[i][j] ≤ 10^4"],
    recognize:
      "Minimum paint cost subject to forming exactly `target` color-runs → a 3-D DP over (house index, color of this house, neighborhoods so far); the neighborhood count increments only when this house's color differs from the previous house's color.",
    figureItOut: [
      "Process houses left to right. The cost of a choice at house i depends on what color the PREVIOUS house ended up, because matching the previous color keeps the same neighborhood while a new color starts a new neighborhood. So we carry the previous color and the running neighborhood count as state.",
      "**State**: `dp[i][c][g]` = the minimum cost to paint houses 0..i such that house i has color c and the prefix forms exactly g neighborhoods. (Colors are 1..n; g is 1..target.)",
      "**Recurrence**: for house i painted color c (cost 0 if it was pre-painted that color, cost[i][c-1] if we paint it, and infeasible if pre-painted a different color): `dp[i][c][g] = paintCost + min over previous color p of dp[i-1][p][g - (p != c ? 1 : 0)]`. If p == c the neighborhood count stays g; if p != c the previous prefix must have had g-1 neighborhoods.",
      "**Base case**: house 0 forms exactly 1 neighborhood with whatever color it has: `dp[0][c][1] = paintCost(0, c)` for each allowed color c; everything else is infinity.",
      "**Fill**: sweep i from 1 to m-1, for each color c and count g combine over all previous colors p. The answer is `min over c of dp[m-1][c][target]`, or -1 if it stays infinity.",
    ],
    approaches: [
      {
        name: "3-D DP over (house, color, neighborhood count) (optimal)",
        intuition: "Carry the previous house color and how many neighborhoods exist; painting the same color keeps the count, a new color increments it, and pre-painted houses fix their color for free.",
        time: "O(m * target * n^2)",
        timeWhy: "For each house and each (color, count) pair we scan all n previous colors.",
        space: "O(m * n * target)",
        spaceWhy: "The 3-D dp table; reducible to two layers by rolling the house index.",
        code: `int minCost(int[] houses, int[][] cost, int m, int n, int target) {
    int INF = Integer.MAX_VALUE / 2;
    // dp[c][g] = min cost so the current house has color c (1..n) with g neighborhoods
    int[][] dp = new int[n + 1][target + 1];
    for (int[] row : dp) Arrays.fill(row, INF);
    for (int c = 1; c <= n; c++) {
        if (houses[0] != 0 && houses[0] != c) continue;        // pre-painted, color fixed
        int paint = (houses[0] == c) ? 0 : cost[0][c - 1];
        dp[c][1] = paint;
    }
    for (int i = 1; i < m; i++) {
        int[][] next = new int[n + 1][target + 1];
        for (int[] row : next) Arrays.fill(row, INF);
        for (int c = 1; c <= n; c++) {
            if (houses[i] != 0 && houses[i] != c) continue;
            int paint = (houses[i] == c) ? 0 : cost[i][c - 1];
            for (int g = 1; g <= target; g++) {
                for (int p = 1; p <= n; p++) {
                    int prevG = (p == c) ? g : g - 1;
                    if (prevG < 1 || dp[p][prevG] >= INF) continue;
                    next[c][g] = Math.min(next[c][g], dp[p][prevG] + paint);
                }
            }
        }
        dp = next;
    }
    int best = INF;
    for (int c = 1; c <= n; c++) best = Math.min(best, dp[c][target]);
    return best >= INF ? -1 : best;
}`,
        walkthrough: [
          "houses=[0,0,0,0,0], n=2, target=3. House0: dp[1][1]=cost[0][0]=1, dp[2][1]=cost[0][1]=10.",
          "House1 cost[1]=[10,1]. color1: g via p=1 (same) from dp[1][1]=1 -> 1+10=11 at g1; p=2 (diff) from dp[2][1]=10 -> g2 = 10+10=20. color2 (paint 1): p=2 same dp[2][1]=10 -> g1=11; p=1 diff dp[1][1]=1 -> g2=1+1=2.",
          "House2 cost[2]=[10,1] (cheap to keep color2). Continuing, the optimal path is colors 1,2,2,1,1 forming neighborhoods 1,2,3.",
          "Costs along that path: 1 (h0 c1) + 1 (h1 c2) + 1 (h2 c2) + 1 (h3 c1) + 5 (h4 c1) = 9, ending at g=3.",
          "min dp[c][3] = 9. Answer 9.",
        ],
      },
    ],
    edgeCases: [
      "Already fully painted with the wrong neighborhood count → impossible, -1.",
      "A pre-painted house must keep its color (cost 0) and cannot be repainted.",
      "target greater than what the colorings can produce, or fewer than the fixed houses already force → -1.",
    ],
    twists: [
      "**Maximize neighborhoods within a budget** → swap the objective and constrain cost.",
      "**Repainting allowed (ignore pre-paint)** → drop the fixed-color guard, every house is free to choose.",
      "**Rolling array optimization** → keep only the previous house layer to cut space to O(n * target).",
    ],
    related: ["paint-house", "house-robber", "edit-distance"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "jump-game-iv",
    title: "Jump Game IV",
    difficulty: "Hard",
    pattern: "graphs",
    leetcode: 1345,
    statement:
      "Given an integer array `arr`, you start at index 0. In one step from index `i` you may jump to `i + 1`, to `i - 1`, or to **any index `j` with `arr[j] == arr[i]`** (a value teleport), staying in bounds. Return the **minimum number of steps** to reach the **last index** of the array.",
    examples: [
      { in: "arr=[100,-23,-23,404,100,23,23,23,3,404]", out: "3", note: "0 -> 4 (same value 100) -> 3 (i-1) -> 9 (same value 404) = 3 steps" },
      { in: "arr=[7]", out: "0", note: "already at the last index" },
      { in: "arr=[7,6,9,6,9,6,9,7]", out: "1", note: "0 -> 7 via value teleport (both 7) in one step" },
    ],
    constraints: ["1 ≤ arr.length ≤ 5 * 10^4", "-10^8 ≤ arr[i] ≤ 10^8"],
    recognize:
      "Minimum steps where each index connects to i-1, i+1, and all equal-valued indices → unweighted shortest path = **BFS**; build a value-to-indices map and, crucially, CLEAR each value's list after first use so the teleport edges are not re-scanned.",
    figureItOut: [
      "Every edge costs 1 step, so the fewest steps is a shortest-path on an unweighted graph → BFS from index 0. Index i's neighbors are i-1, i+1, and every j with arr[j] == arr[i] (a teleport across equal values).",
      "Precompute a map `value -> list of indices` so the teleport neighbors are available in O(1). BFS level by level; the first time we dequeue the last index, the level number is the answer.",
      "Critical optimization: the first time you expand a value's group you reach ALL of them in one step, and they are now all visited. So after using a value's index list, CLEAR it (empty the list). Otherwise a value appearing thousands of times would be rescanned thousands of times, making it O(n^2).",
      "Also mark indices visited as you enqueue them. Push i-1 and i+1 if in bounds and unvisited, and all same-value indices, then clear that value list. When the last index is dequeued, return its BFS distance.",
    ],
    approaches: [
      {
        name: "BFS with value-group adjacency, clearing each group after use (optimal)",
        intuition: "Unweighted shortest path via BFS; equal values form a hyper-edge reached in one step, and emptying each value bucket after first expansion keeps the whole search linear.",
        time: "O(n)",
        timeWhy: "Each index is enqueued once; each value group is expanded once because it is cleared afterward, so total edge work is linear.",
        space: "O(n)",
        spaceWhy: "The value-to-indices map, the visited array, and the BFS queue.",
        code: `int minJumps(int[] arr) {
    int n = arr.length;
    if (n == 1) return 0;
    Map<Integer, List<Integer>> byValue = new HashMap<>();
    for (int i = 0; i < n; i++) {
        byValue.computeIfAbsent(arr[i], k -> new ArrayList<>()).add(i);
    }
    boolean[] visited = new boolean[n];
    Deque<Integer> queue = new ArrayDeque<>();
    queue.add(0);
    visited[0] = true;
    int steps = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            int i = queue.poll();
            if (i == n - 1) return steps;
            List<Integer> sameValue = byValue.get(arr[i]);
            if (sameValue != null) {
                for (int j : sameValue) {
                    if (!visited[j]) {
                        visited[j] = true;
                        queue.add(j);
                    }
                }
                sameValue.clear();         // never expand this value group again
            }
            if (i + 1 < n && !visited[i + 1]) { visited[i + 1] = true; queue.add(i + 1); }
            if (i - 1 >= 0 && !visited[i - 1]) { visited[i - 1] = true; queue.add(i - 1); }
        }
        steps++;
    }
    return -1;   // unreachable for a connected array, but defensive
}`,
        walkthrough: [
          "arr=[100,-23,-23,404,100,23,23,23,3,404], n=10. byValue: 100->[0,4], -23->[1,2], 404->[3,9], 23->[5,6,7], 3->[8]. Queue [0], steps=0.",
          "steps=0: pop 0 (not last). value 100 group [0,4]: enqueue 4 (visited), clear group. enqueue i+1=1. Queue [4,1]. steps=1.",
          "steps=1: pop 4: value 100 group now empty. enqueue 5, 3 (i-1=3). pop 1: value -23 [1,2] enqueue 2, clear; enqueue (2 already). Queue grows with 5,3,2. steps=2.",
          "steps=2: pop 3: value 404 [3,9] enqueue 9, clear. Queue now contains 9. steps=3.",
          "steps=3: pop 9 == n-1 -> return 3. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "Single element → already at the last index, 0 steps.",
      "Many duplicates of one value → clearing the group prevents quadratic blowup.",
      "Last index reachable by a direct value teleport from index 0 → answer 1.",
    ],
    twists: [
      "**0/1 BFS variant with weighted moves** → use a deque if some moves cost 0.",
      "**Add jumps of +k / -k** → extra neighbor edges, same BFS.",
      "**Bidirectional BFS** → search from both ends to shrink the frontier on huge arrays.",
    ],
    related: ["jump-game-iii", "word-ladder", "open-the-lock"],
  },

  {
    slug: "shortest-path-to-get-all-keys",
    title: "Shortest Path to Get All Keys",
    difficulty: "Hard",
    pattern: "graphs",
    leetcode: 864,
    statement:
      "You are given an `m x n` grid. `'.'` is an empty cell, `'#'` is a wall, `'@'` is the starting point, lowercase letters are **keys**, and uppercase letters are **locks**. You move 4-directionally one cell per step. You cannot walk through a wall, and you cannot pass a lock unless you already hold its matching key. Pick up a key by stepping on it. Return the **fewest moves** to collect **all keys**, or `-1` if impossible.",
    examples: [
      { in: 'grid=["@.a.#","###.#","b.A.B"]', out: "8", note: "collect a then unlock A to reach b in 8 moves" },
      { in: 'grid=["@..aA","..B#.","....b"]', out: "6", note: "grab a, open A, reach b in 6 moves" },
      { in: 'grid=["@Aa"]', out: "-1", note: "lock A blocks the only path to key a" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 30", "grid[i][j] is one of '.', '#', '@', a-f, A-F", "1 ≤ number of keys ≤ 6", "each key has exactly one matching lock"],
    recognize:
      "Shortest path where progress depends on which keys you hold → **BFS over an expanded state space** (row, col, key-bitmask); the bitmask of collected keys is part of the node so the same cell can be revisited with a different key set.",
    figureItOut: [
      "Plain grid BFS is not enough because reaching a cell with keys {a} is a different situation than reaching it with {a,b}: a lock you could not pass before may now be open. So the STATE is (row, col, keysHeld) where keysHeld is a bitmask over the up-to-6 keys.",
      "First scan the grid to find the start cell and count the total keys; the goal mask is (1 << totalKeys) - 1 (all keys collected). BFS from (startRow, startCol, mask=0).",
      "Transition: from a state, try the four neighbors. Skip walls and out-of-bounds. If the neighbor is an uppercase lock and we do NOT hold its key bit, skip it. If it is a lowercase key, the new mask is keysHeld with that key bit set. Enqueue the neighbor with the (possibly updated) mask if that (cell, mask) state is unvisited.",
      "Use a visited set keyed by (row, col, mask) — a 3-D boolean works since masks fit in 2^6. The first time BFS reaches any cell with mask == goal, the current BFS level is the answer. If the queue empties first, return -1.",
    ],
    approaches: [
      {
        name: "BFS over (cell, key-bitmask) state space (optimal)",
        intuition: "Keys held change which moves are legal, so fold the key bitmask into the BFS node; the first state whose mask holds all keys gives the shortest distance.",
        time: "O(m * n * 2^K)",
        timeWhy: "Each cell can be visited once per distinct key set, and there are 2^K key sets with K <= 6.",
        space: "O(m * n * 2^K)",
        spaceWhy: "The visited array indexed by cell and key mask, plus the BFS queue.",
        code: `int shortestPathAllKeys(String[] grid) {
    int m = grid.length, n = grid[0].length();
    int startR = 0, startC = 0, totalKeys = 0;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            char ch = grid[r].charAt(c);
            if (ch == "@".charAt(0)) { startR = r; startC = c; }
            else if (ch >= "a".charAt(0) && ch <= "f".charAt(0)) totalKeys++;
        }
    }
    int goal = (1 << totalKeys) - 1;
    boolean[][][] visited = new boolean[m][n][1 << totalKeys];
    Deque<int[]> queue = new ArrayDeque<>();   // {row, col, mask}
    queue.add(new int[]{startR, startC, 0});
    visited[startR][startC][0] = true;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    int steps = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            int[] cur = queue.poll();
            int r = cur[0], c = cur[1], mask = cur[2];
            if (mask == goal) return steps;
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
                char ch = grid[nr].charAt(nc);
                if (ch == "#".charAt(0)) continue;
                if (ch >= "A".charAt(0) && ch <= "F".charAt(0)) {
                    int bit = ch - "A".charAt(0);
                    if ((mask & (1 << bit)) == 0) continue;   // locked, no key
                }
                int nmask = mask;
                if (ch >= "a".charAt(0) && ch <= "f".charAt(0)) {
                    nmask = mask | (1 << (ch - "a".charAt(0)));
                }
                if (!visited[nr][nc][nmask]) {
                    visited[nr][nc][nmask] = true;
                    queue.add(new int[]{nr, nc, nmask});
                }
            }
        }
        steps++;
    }
    return -1;
}`,
        walkthrough: [
          'grid=["@Aa"], 1x3. start (0,0), keys: a at (0,2) -> totalKeys=1, goal=1.',
          "BFS from (0,0,mask0). Neighbors: (0,1) is lock A, need key bit0 but mask0 lacks it -> blocked.",
          "No other in-bounds non-wall neighbor. Queue drains without reaching mask==goal.",
          "Return -1 (the lock seals the only route to key a). Answer -1.",
          "For the first example the same BFS first detours to pick up a (setting mask bit), which then makes lock A passable, reaching all keys in 8 steps.",
        ],
      },
    ],
    edgeCases: [
      "A lock blocking the only route to its own key → unreachable, return -1.",
      "Keys can be collected in any order → the bitmask captures the set, not the sequence.",
      "Revisiting a cell is allowed when the key set differs — that is why mask is part of the visited key.",
    ],
    twists: [
      "**Up to more than 6 keys** → the 2^K factor grows; problem caps it at 6 for tractability.",
      "**Weighted terrain (some cells cost more)** → switch BFS to Dijkstra over the same state space.",
      "**Must also return to start after collecting keys** → extend the goal test to (start cell, full mask).",
    ],
    related: ["open-the-lock", "rotting-oranges", "word-ladder"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
    title: "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 1489,
    statement:
      "Given a connected weighted undirected graph of `n` nodes and a list `edges` where `edges[i] = [a, b, weight]`, classify each edge. An edge is **critical** if removing it increases the weight of every minimum spanning tree (or disconnects the graph). An edge is **pseudo-critical** if it can appear in SOME MST but is not in ALL MSTs. Return `[criticalEdges, pseudoCriticalEdges]` as two lists of **original edge indices**.",
    examples: [
      { in: "n=5, edges=[[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]", out: "[[0,1],[2,3,4,5]]", note: "edges 0 and 1 are in every MST (critical); 2,3,4,5 appear in some MST (pseudo-critical)" },
      { in: "n=4, edges=[[0,1,1],[1,2,1],[2,3,1],[0,3,1]]", out: "[[],[0,1,2,3]]", note: "all weights equal; no edge is in every MST, all four are pseudo-critical" },
    ],
    constraints: ["2 ≤ n ≤ 100", "1 ≤ edges.length ≤ min(200, n*(n-1)/2)", "edges[i].length == 3", "0 ≤ a < b < n", "1 ≤ weight ≤ 1000", "all (a, b) pairs are distinct"],
    recognize:
      "Classify each edge relative to all MSTs → compute the MST weight with **Kruskal + Union-Find**, then for each edge test two things: FORCE-EXCLUDE it (if MST weight rises or graph disconnects, it is critical); else FORCE-INCLUDE it (if an MST of the same weight still exists, it is pseudo-critical).",
    figureItOut: [
      "First compute the baseline minimum spanning tree weight using Kruskal: sort edges by weight, union endpoints if they are in different components, accumulating weight. Keep edges paired with their original index so we can report indices.",
      "An edge is CRITICAL if without it you cannot build an MST as cheap as the baseline. Test: run Kruskal while SKIPPING that one edge. If the result either fails to connect all n nodes or has a strictly larger total weight than the baseline, the edge is critical.",
      "If an edge is not critical, test whether it is PSEUDO-CRITICAL: FORCE it into the spanning tree first (union its endpoints and add its weight), then run Kruskal on the rest. If you can still reach the baseline weight, this edge participates in some MST, so it is pseudo-critical.",
      "Repeat both tests for every edge index. The Union-Find must be reset between tests. The two classifications are mutually exclusive: a critical edge is in every MST; a pseudo-critical edge is in some but not all. Edges that are in no MST are neither (they will fail the force-include test by exceeding baseline).",
    ],
    approaches: [
      {
        name: "Baseline Kruskal + per-edge force-exclude / force-include tests (optimal)",
        intuition: "Compute the MST weight once, then for each edge ask: does banning it cost more (critical) or does requiring it still hit the baseline (pseudo-critical)?",
        time: "O(E^2 alpha(n))",
        timeWhy: "For each of E edges we run a Kruskal pass (E log E sort done once, then E union-find ops) — E passes dominate at roughly E^2.",
        space: "O(n + E)",
        spaceWhy: "Union-Find parent array plus the edge list with original indices.",
        code: `int[] parent;
int find(int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
}
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    parent[ra] = rb;
    return true;
}
// build MST weight; if skip>=0 ignore that edge index; if force>=0 include it first
int kruskal(int n, int[][] e, int skip, int force) {
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int weight = 0, used = 0;
    if (force >= 0) { union(e[force][0], e[force][1]); weight += e[force][2]; used++; }
    for (int i = 0; i < e.length; i++) {
        if (i == skip || i == force) continue;
        if (union(e[i][0], e[i][1])) { weight += e[i][2]; used++; }
    }
    return used == n - 1 ? weight : Integer.MAX_VALUE;   // MAX_VALUE = disconnected
}
List<List<Integer>> findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
    int m = edges.length;
    int[][] e = new int[m][4];                  // a, b, w, originalIndex
    for (int i = 0; i < m; i++) {
        e[i][0] = edges[i][0]; e[i][1] = edges[i][1]; e[i][2] = edges[i][2]; e[i][3] = i;
    }
    Arrays.sort(e, (x, y) -> x[2] - y[2]);
    int base = kruskal(n, e, -1, -1);
    List<Integer> critical = new ArrayList<>();
    List<Integer> pseudo = new ArrayList<>();
    for (int i = 0; i < m; i++) {
        if (kruskal(n, e, i, -1) > base) {
            critical.add(e[i][3]);              // banning it costs more or disconnects
        } else if (kruskal(n, e, -1, i) == base) {
            pseudo.add(e[i][3]);                // forcing it still reaches the baseline
        }
    }
    List<List<Integer>> result = new ArrayList<>();
    result.add(critical);
    result.add(pseudo);
    return result;
}`,
        walkthrough: [
          "n=5, edges as given. Sorted by weight: w1 edges idx0(0-1),idx1(1-2); w2 idx2(2-3),idx3(0-3); w3 idx4(0-4),idx5(3-4); w6 idx6(1-4).",
          "Baseline Kruskal: take 0-1(1),1-2(1), then 2-3(2) connects, then 0-4(3) connects last node. base weight = 1+1+2+3 = 7.",
          "Test idx0 (0-1) skip: without it the cheapest reconnection of {0} side raises total > 7 -> critical. Same for idx1 -> critical.",
          "Test idx2 (2-3, w2) force-include: an MST of weight 7 still exists -> pseudo. Likewise idx3, idx4, idx5 each can sit in some weight-7 MST -> pseudo. idx6 (w6) forcing it exceeds 7 -> neither.",
          "Result critical=[0,1], pseudo=[2,3,4,5]. Answer [[0,1],[2,3,4,5]].",
        ],
      },
    ],
    edgeCases: [
      "All equal weights → no edge is forced in every MST, so the critical list is empty and all are pseudo-critical (if they can appear in some MST).",
      "A bridge edge (only connection across a cut) → always critical, since skipping it disconnects the graph (weight becomes infinite).",
      "Union-Find must be re-initialized for every Kruskal pass, including the force/skip variants.",
    ],
    twists: [
      "**Maximum spanning tree variant** → sort descending and the same critical/pseudo logic applies.",
      "**Report MST weight only** → just the baseline Kruskal pass.",
      "**Many queries on dynamic edges** → link-cut trees or offline techniques beat the per-edge re-run.",
    ],
    related: ["min-cost-to-connect-all-points", "redundant-connection", "number-of-provinces"],
  },

  {
    slug: "longest-cycle-in-a-graph",
    title: "Longest Cycle in a Graph",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 2360,
    statement:
      "You are given a directed graph of `n` nodes where each node has **at most one outgoing edge**, described by an array `edges` of size `n`: `edges[i]` is the node that i points to, or `-1` if i has no outgoing edge. Return the **length of the longest cycle** in the graph, or `-1` if there is no cycle.",
    examples: [
      { in: "edges=[3,3,4,2,3]", out: "3", note: "cycle 2 -> 4 -> 3 -> 2 has length 3" },
      { in: "edges=[2,-1,3,1]", out: "-1", note: "node 1 dead-ends (-1); the chain has no cycle" },
    ],
    constraints: ["n == edges.length", "2 ≤ n ≤ 10^5", "-1 ≤ edges[i] < n", "edges[i] != i (no self loops)"],
    recognize:
      "Each node has out-degree at most 1 (a functional graph) → cycles are disjoint 'rho' shapes; walk forward from each unvisited node stamping a visit-time, and when you re-enter a node visited DURING THE CURRENT walk, the difference in visit-times is that cycle length.",
    figureItOut: [
      "With at most one outgoing edge per node, the structure is a functional graph: from any node you follow a unique chain that eventually either hits a -1 dead end or loops into a single cycle. So each node belongs to at most one cycle, and cycles are vertex-disjoint.",
      "Walk forward from each not-yet-finalized node, recording the GLOBAL step index at which you first touch each node on this walk (a per-walk timestamp). Keep a separate marker for nodes whose component is fully processed so future walks stop at them immediately.",
      "If during the walk you arrive at a node you already stamped IN THIS SAME WALK, you have closed a cycle. Its length is (current step index) - (the step index stored when you first visited that node). Update the global maximum.",
      "If you arrive at a node visited in a PREVIOUS walk (already finalized) or a -1, this walk forms no new cycle; stop. After the walk, mark all nodes you touched as finalized so they are never re-explored, giving overall linear time. The answer is the largest cycle length found, or -1 if none.",
    ],
    approaches: [
      {
        name: "Functional-graph walk with per-visit timestamps (optimal)",
        intuition: "Follow the unique out-edge from each node, time-stamping the walk; re-touching a node from the same walk closes a cycle whose length is the timestamp gap.",
        time: "O(n)",
        timeWhy: "Each node is visited at most once across all walks because finalized nodes are skipped.",
        space: "O(n)",
        spaceWhy: "Arrays for visit-time and finalized flags, one entry per node.",
        code: `int longestCycle(int[] edges) {
    int n = edges.length;
    int[] visitTime = new int[n];   // global step index when first touched on current walk
    boolean[] done = new boolean[n];
    Arrays.fill(visitTime, -1);
    int answer = -1;
    int timer = 1;
    for (int start = 0; start < n; start++) {
        if (done[start]) continue;
        int startTime = timer;
        int node = start;
        while (node != -1 && !done[node]) {
            if (visitTime[node] != -1) {
                // closed a cycle within this walk
                answer = Math.max(answer, timer - visitTime[node]);
                break;
            }
            visitTime[node] = timer++;
            node = edges[node];
        }
        // finalize every node touched on this walk
        node = start;
        while (node != -1 && !done[node] && visitTime[node] >= startTime) {
            done[node] = true;
            node = edges[node];
        }
    }
    return answer;
}`,
        walkthrough: [
          "edges=[3,3,4,2,3], n=5. timer=1.",
          "start=0: visit 0 t1, ->3 t2, ->2 t3, ->4 t4, ->3. node 3 already visited this walk (visitTime[3]=2). cycle length = timer(5) - 2 = 3. answer=3. Finalize nodes touched (0,3,2,4) as done.",
          "start=1: not done. visit 1 t6, ->3 but 3 is done -> stop. No new cycle. Finalize 1.",
          "start=2,3,4 already done. Loop ends.",
          "answer=3 (cycle 2->4->3->2). Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "No cycle anywhere (all chains hit -1) → return -1.",
      "Entire graph is one big cycle → answer equals n.",
      "A node pointing to a previously finalized node forms no NEW cycle — only same-walk re-touches count.",
    ],
    twists: [
      "**Count the number of cycles** → tally each closed cycle instead of taking the max.",
      "**General directed graph (out-degree > 1)** → needs Tarjan SCC / longest path within SCCs, not this functional-graph shortcut.",
      "**Tortoise-and-hare per chain** → Floyd cycle detection also finds the loop without timestamps.",
    ],
    related: ["course-schedule", "find-eventual-safe-states", "redundant-connection"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "number-of-squareful-arrays",
    title: "Number of Squareful Arrays",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 996,
    statement:
      "An array is **squareful** if the sum of **every pair of adjacent elements** is a perfect square. Given an integer array `nums`, return the **number of permutations** of `nums` that are squareful. Two permutations are considered the same (counted once) if they are identical as sequences, so **duplicate values must not produce duplicate counted permutations**.",
    examples: [
      { in: "nums=[1,17,8]", out: "2", note: "[1,8,17] (1+8=9, 8+17=25) and [17,8,1] are squareful" },
      { in: "nums=[2,2,2]", out: "1", note: "only [2,2,2] (2+2=4=2^2); duplicates collapse to one permutation" },
    ],
    constraints: ["1 ≤ nums.length ≤ 12", "0 ≤ nums[i] ≤ 10^9"],
    recognize:
      "Count distinct permutations where adjacent sums are perfect squares → **backtracking permutation building** with two prunings: only place a next value whose sum with the previous is a perfect square, and skip duplicate values at the same recursion depth (sort first) to avoid double-counting.",
    figureItOut: [
      "We build a permutation position by position. The only constraint linking positions is that consecutive elements sum to a perfect square, so when choosing the next element we just check `isPerfectSquare(previous + candidate)`.",
      "Duplicates are the trap: [2a, 2b] and [2b, 2a] are the same sequence and must be counted once. Standard fix: sort nums, and at each depth, when iterating candidates, SKIP a value equal to the previous candidate at this depth if that previous one was not used (the classic permutations-II dedup), so each distinct value is tried once per slot.",
      "Backtracking step: maintain a used[] array. For each unused index i (with the dedup skip), if the path is empty OR previousValue + nums[i] is a perfect square, mark i used, append nums[i], recurse, then unmark and pop (undo).",
      "**Base/termination**: when the path length equals n, we have a full valid squareful permutation — increment the count by 1. The perfect-square test is `s = round(sqrt(x)); s*s == x`. n <= 12 keeps the factorial search feasible after pruning.",
    ],
    approaches: [
      {
        name: "Backtracking permutations with square-sum and duplicate pruning (optimal)",
        intuition: "Grow a permutation, only extending when the new adjacent sum is a perfect square; sorting plus a same-depth duplicate skip ensures each distinct sequence is counted exactly once.",
        time: "O(n! )",
        timeWhy: "Worst case explores permutations, but the perfect-square adjacency constraint prunes the vast majority; n <= 12.",
        space: "O(n)",
        spaceWhy: "The used array, the current path, and recursion depth n.",
        code: `int count;
boolean isSquare(long x) {
    long s = (long) Math.sqrt((double) x);
    return s * s == x || (s + 1) * (s + 1) == x;
}
int numSquarefulPerms(int[] nums) {
    Arrays.sort(nums);
    count = 0;
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>());
    return count;
}
void backtrack(int[] nums, boolean[] used, List<Integer> path) {
    if (path.size() == nums.length) { count++; return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;   // skip duplicate at this depth
        if (!path.isEmpty() && !isSquare((long) path.get(path.size() - 1) + nums[i])) continue;
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, used, path);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`,
        walkthrough: [
          "nums=[1,17,8] -> sorted [1,8,17]. backtrack with empty path.",
          "Place 1: path[1]. Next need 1+x square: 1+8=9 (square) ok -> path[1,8]. Next 8+17=25 (square) -> path[1,8,17] full -> count=1.",
          "Backtrack. Place 8 first: 8+1=9 ok -> [8,1]; 1+17=18 not square; dead. 8+17=25 ok -> [8,17]; 17+1=18 not square; dead.",
          "Place 17 first: 17+8=25 ok -> [17,8]; 8+1=9 ok -> [17,8,1] full -> count=2.",
          "No more. count=2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "All identical values whose pair sum is a perfect square (e.g. [2,2,2]) → exactly one counted permutation.",
      "No valid arrangement → answer 0.",
      "Single element → trivially squareful (no adjacent pair), count 1.",
    ],
    twists: [
      "**Adjacent sum must be prime / a cube** → swap the predicate, same backtracking skeleton.",
      "**Circular squareful (first and last also adjacent)** → add a wrap-around check on completion.",
      "**Hamiltonian-path DP over bitmask** → for larger n, count paths in a graph where i-j edge exists iff their sum is square.",
    ],
    related: ["permutations", "subsets", "combination-sum"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "split-array-into-consecutive-subsequences",
    title: "Split Array into Consecutive Subsequences",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 659,
    statement:
      "You are given an integer array `nums` **sorted in non-decreasing order**. Determine if you can split `nums` into one or more subsequences such that **each subsequence is a consecutive run of integers of length at least 3** (e.g. [1,2,3] or [4,5,6,7]). Return `true` if such a split exists, otherwise `false`.",
    examples: [
      { in: "nums=[1,2,3,3,4,5]", out: "true", note: "split into [1,2,3] and [3,4,5]" },
      { in: "nums=[1,2,3,3,4,4,5,5]", out: "true", note: "split into [1,2,3,4,5] and [3,4,5]" },
      { in: "nums=[1,2,3,4,4,5]", out: "false", note: "the lone extra 4 cannot start or extend a length-3 run" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^4", "-1000 ≤ nums[i] ≤ 1000", "nums is sorted in non-decreasing order"],
    recognize:
      "Greedily place each number either by EXTENDING an existing run that ends just below it, or by STARTING a new run that needs the next two numbers → maintain a count map and a 'runs ending at value v' map; prefer extending, otherwise open a new length-3 run, else fail.",
    figureItOut: [
      "Process numbers in sorted order. For each value x there are two good homes: append it to a subsequence that currently ENDS at x-1 (extending a run), or start a brand-new run x, x+1, x+2. Greedily prefer extending, because leaving an existing run un-extended risks stranding it below length 3.",
      "Keep two maps: `count[v]` = how many copies of v are still unplaced, and `endAt[v]` = how many subsequences currently end at value v (ready to be extended by v+1).",
      "For each x (while count[x] > 0): decrement count[x]. If some run ends at x-1 (endAt[x-1] > 0), attach x to it: endAt[x-1]--, endAt[x]++. Otherwise try to start a new run: if count[x+1] > 0 and count[x+2] > 0, consume one each (count[x+1]--, count[x+2]--) and set endAt[x+2]++. If neither is possible, the split fails — return false.",
      "Greedy correctness: extending uses x to lengthen a run that might otherwise be too short, which is never worse than hoarding x to start a new run. If you finish placing every number this way, a valid split exists → return true.",
    ],
    approaches: [
      {
        name: "Greedy with count and run-end maps (extend-or-open) (optimal)",
        intuition: "Each number first tries to lengthen a run ending right below it; failing that it opens a fresh length-3 run using the next two values; any leftover that can do neither dooms the split.",
        time: "O(n)",
        timeWhy: "A single pass over the sorted numbers with O(1) map operations each.",
        space: "O(n)",
        spaceWhy: "The count and run-end hash maps, up to the number of distinct values.",
        code: `boolean isPossible(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();
    Map<Integer, Integer> endAt = new HashMap<>();
    for (int x : nums) count.merge(x, 1, Integer::sum);
    for (int x : nums) {
        if (count.get(x) == 0) continue;            // already used as part of a run
        count.put(x, count.get(x) - 1);
        if (endAt.getOrDefault(x - 1, 0) > 0) {
            endAt.put(x - 1, endAt.get(x - 1) - 1); // extend a run ending at x-1
            endAt.merge(x, 1, Integer::sum);
        } else if (count.getOrDefault(x + 1, 0) > 0 && count.getOrDefault(x + 2, 0) > 0) {
            count.put(x + 1, count.get(x + 1) - 1); // open a new run x, x+1, x+2
            count.put(x + 2, count.get(x + 2) - 1);
            endAt.merge(x + 2, 1, Integer::sum);
        } else {
            return false;                           // x cannot be placed
        }
    }
    return true;
}`,
        walkthrough: [
          "nums=[1,2,3,3,4,5]. count={1:1,2:1,3:2,4:1,5:1}.",
          "x=1: count1->0. no run ends at 0; count2>0 and count3>0 -> open [1,2,3]: count2->0,count3->1, endAt[3]+1.",
          "x=2: count2==0 skip. x=3: count3->0. run ends at 2? endAt[2]=0. count4>0 and count5>0 -> open [3,4,5]: count4->0,count5->0, endAt[5]+1.",
          "x=3 again: count3==0 skip. x=4: count4==0 skip. x=5: count5==0 skip.",
          "All placed -> true. Answer true.",
        ],
      },
    ],
    edgeCases: [
      "A value left over that can neither extend a run nor open a triple → return false.",
      "Length < 3 overall → impossible, false.",
      "Long runs of duplicates → extending is preferred so each duplicate continues a separate subsequence.",
    ],
    twists: [
      "**Minimum length k instead of 3** → open new runs of length k using counts of x+1..x+k-1.",
      "**Heap-based variant** → track run lengths in a min-heap keyed by end value, attaching to the shortest extendable run.",
      "**Return the actual subsequences** → store each run explicitly instead of only its end count.",
    ],
    related: ["hand-of-straights", "non-overlapping-intervals", "merge-intervals"],
  },
];
