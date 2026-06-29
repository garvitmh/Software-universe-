// NeetCode All / Top Interview 150 / LeetCode 75 / Grind 75 — wave 16c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave15c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE16C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "solving-questions-with-brainpower",
    title: "Solving Questions With Brainpower",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 2140,
    statement:
      "You are given a 0-indexed array `questions` where `questions[i] = [points_i, brainpower_i]`. Processing the questions in order, for each one you may **solve** it (gain `points_i` but then skip the next `brainpower_i` questions) or **skip** it (move to the next, gaining nothing). Return the **maximum points** you can earn.",
    examples: [
      { in: "questions=[[3,2],[4,3],[4,4],[2,5]]", out: "5", note: "solve q0 (+3, skip 2), then solve q3 (+2) = 5" },
      { in: "questions=[[1,1],[2,2],[3,3],[4,4],[5,5]]", out: "7", note: "skip to q1 (+2, skip 2) then solve q4 (+5) = 7" },
    ],
    constraints: ["1 ≤ questions.length ≤ 10^5", "questions[i].length == 2", "1 ≤ points_i, brainpower_i ≤ 10^5"],
    recognize:
      "Each question offers a take-or-leave choice where taking it jumps you forward by a known amount → a 1-D DP scanned from the right, where solving a question links to a far-ahead future state.",
    figureItOut: [
      "**State**: `dp[i]` = the maximum points obtainable considering only questions from index `i` to the end. Because solving question i forces a jump to a specific later index, indexing the state by the current question and reasoning about the remaining suffix is natural.",
      "**Recurrence**: at question i you either skip it (`dp[i+1]`) or solve it for `points_i` plus whatever is reachable after skipping `brainpower_i` questions, i.e. from index `i + brainpower_i + 1`. So `dp[i] = max(dp[i+1], points_i + dp[min(n, i + brainpower_i + 1)])`.",
      "**Base case**: `dp[n] = 0` — past the last question there are no points left to earn. Indices that jump beyond the array clamp to n and read 0.",
      "**Fill**: iterate i from n-1 down to 0 so that both `dp[i+1]` and the far-ahead `dp[i + brainpower_i + 1]` are already computed. A single dp array of length n+1 holds the answer.",
      "The answer is `dp[0]`, the best achievable starting from the first question. Use long to accumulate since up to 10^5 questions each worth 10^5 points can exceed int range.",
    ],
    approaches: [
      {
        name: "Right-to-left suffix DP (optimal)",
        intuition: "Solving a question teleports you to a fixed later index, so evaluate suffixes from the end where every future state you might jump to is already known.",
        time: "O(n)",
        timeWhy: "A single backward pass; each question does O(1) work with a clamped index lookup.",
        space: "O(n)",
        spaceWhy: "A dp array of length n+1.",
        code: `long mostPoints(int[][] questions) {
    int n = questions.length;
    long[] dp = new long[n + 1];   // dp[n] = 0 by default
    for (int i = n - 1; i >= 0; i--) {
        long solve = questions[i][0];
        int next = i + questions[i][1] + 1;
        if (next < n) solve += dp[next];
        long skip = dp[i + 1];
        dp[i] = Math.max(solve, skip);
    }
    return dp[0];
}`,
        walkthrough: [
          "questions=[[3,2],[4,3],[4,4],[2,5]], n=4. dp[4]=0.",
          "i=3 [2,5]: next=3+5+1=9>=4, solve=2; skip=dp[4]=0; dp[3]=max(2,0)=2.",
          "i=2 [4,4]: next=2+4+1=7>=4, solve=4; skip=dp[3]=2; dp[2]=max(4,2)=4.",
          "i=1 [4,3]: next=1+3+1=5>=4, solve=4; skip=dp[2]=4; dp[1]=max(4,4)=4.",
          "i=0 [3,2]: next=0+2+1=3<4, solve=3+dp[3]=3+2=5; skip=dp[1]=4; dp[0]=max(5,4)=5. Answer 5.",
        ],
      },
    ],
    edgeCases: [
      "A single question → solve it; dp[0] = points_0.",
      "brainpower so large that next jumps past the array → solving earns only that question's points (no future contribution).",
      "Points and counts up to 10^5 over 10^5 questions overflow int; accumulate in long.",
    ],
    twists: [
      "**Forward DP instead** → push each solved question's contribution forward, but the suffix formulation is cleaner.",
      "**Skipping costs points** → subtract a penalty in the skip branch.",
      "**Limited number of solves** → add a second dimension counting solves used.",
    ],
    related: ["house-robber", "delete-and-earn", "jump-game-ii"],
  },

  {
    slug: "best-team-with-no-conflicts",
    title: "Best Team With No Conflicts",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 1626,
    statement:
      "You are forming a basketball team from `n` players given by parallel arrays `scores` and `ages`. There is a **conflict** if a younger player has a strictly higher score than an older player. Choose any subset of players with no conflict to **maximize the total score**. Two players of the same age never conflict regardless of score. Return the maximum achievable total score.",
    examples: [
      { in: "scores=[1,3,5,10,15], ages=[1,2,3,4,5]", out: "34", note: "no conflicts at all; take everyone" },
      { in: "scores=[4,5,6,5], ages=[2,1,2,1]", out: "16", note: "pick the 5(age1),6(age2),5(age1) -> sorted ok = 16" },
      { in: "scores=[1,2,3,5], ages=[8,9,10,1]", out: "6", note: "the score-5 age-1 player conflicts with older lower scorers" },
    ],
    constraints: ["1 ≤ scores.length, ages.length ≤ 1000", "scores.length == ages.length", "1 ≤ scores[i] ≤ 10^6", "1 ≤ ages[i] ≤ 1000"],
    recognize:
      "A conflict-free team, once players are sorted by (age, score), is a subsequence with non-decreasing score → a maximum-sum increasing-subsequence DP, the weighted cousin of Longest Increasing Subsequence.",
    figureItOut: [
      "First sort players by age ascending, breaking ties by score ascending. After this sort, scanning left to right means age never decreases, so a chosen team is conflict-free exactly when its scores are **non-decreasing** in this order (a younger-but-higher score would have appeared earlier with a lower score, violating order).",
      "**State**: `dp[i]` = the maximum total score of a valid team whose **last (highest-position) chosen player is i** in sorted order. This mirrors the classic Longest Increasing Subsequence DP but accumulates score instead of length.",
      "**Recurrence**: `dp[i] = scores[i] + max(dp[j])` over all earlier j with `scores[j] <= scores[i]` (so adding i keeps scores non-decreasing). If no such j exists, `dp[i] = scores[i]`.",
      "**Base case**: every player alone forms a valid team, so `dp[i]` starts at `scores[i]` before any extension is considered.",
      "**Fill**: sort first; then for each i in 0..n-1, look back at all j < i and relax `dp[i]` whenever `scores[j] <= scores[i]`. The answer is the maximum over all `dp[i]`.",
    ],
    approaches: [
      {
        name: "Sort by (age, score) then weighted LIS DP (optimal)",
        intuition: "Sorting collapses the conflict rule into a non-decreasing-score requirement, turning the problem into max-sum increasing subsequence.",
        time: "O(n^2)",
        timeWhy: "After the O(n log n) sort, the DP compares every pair (i, j).",
        space: "O(n)",
        spaceWhy: "The dp array plus the sorted player list.",
        code: `int bestTeamScore(int[] scores, int[] ages) {
    int n = scores.length;
    int[][] players = new int[n][2];
    for (int i = 0; i < n; i++) {
        players[i][0] = ages[i];
        players[i][1] = scores[i];
    }
    Arrays.sort(players, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    int[] dp = new int[n];
    int best = 0;
    for (int i = 0; i < n; i++) {
        dp[i] = players[i][1];   // team of just player i
        for (int j = 0; j < i; j++) {
            if (players[j][1] <= players[i][1]) {
                dp[i] = Math.max(dp[i], dp[j] + players[i][1]);
            }
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
        walkthrough: [
          "scores=[4,5,6,5], ages=[2,1,2,1]. Sorted by (age,score): (1,5),(1,5),(2,4),(2,6).",
          "i=0 (1,5): dp=5. best=5.",
          "i=1 (1,5): j=0 score5<=5 -> dp=5+5=10. best=10.",
          "i=2 (2,4): j with score<=4: none (5,5>4) -> dp=4. best=10.",
          "i=3 (2,6): j=0 5<=6 -> 5+6=11; j=1 5<=6 -> 10+6=16; j=2 4<=6 -> 4+6=10. dp=16. best=16. Answer 16.",
        ],
      },
    ],
    edgeCases: [
      "All players same age → no conflicts ever, so the answer is the sum of all scores.",
      "Already sorted with non-decreasing scores → take everyone, answer is the total sum.",
      "Tie-break on equal age by score ascending matters so equal-age players chain correctly without false conflicts.",
    ],
    twists: [
      "**Maximize team SIZE instead of score** → revert to plain Longest Increasing Subsequence length.",
      "**Strict conflict on equal age too** → require strictly increasing scores, changing <= to <.",
      "**O(n log n) via a Fenwick tree** → replace the inner max scan with a BIT keyed on score.",
    ],
    related: ["longest-increasing-subsequence", "number-of-longest-increasing-subsequence", "wiggle-subsequence"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "form-target-string-from-dictionary",
    title: "Number of Ways to Form a Target String Given a Dictionary",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1639,
    statement:
      "You are given a list of equal-length strings `words` and a `target`. You form `target` left to right by repeatedly picking a character: to place `target[i]` you choose some column `k` in the dictionary and use `words[w][k]` for some word `w` where `words[w][k] == target[i]`. The columns you use must be **strictly increasing** (each next chosen character comes from a later column than the previous), and once you use column `k` you can never reuse any column `<= k`. Return the number of ways to form `target` **modulo 10^9 + 7**.",
    examples: [
      { in: 'words=["acca","bbbb","caca"], target="aba"', out: "6" },
      { in: 'words=["abba","baab"], target="bab"', out: "4" },
    ],
    constraints: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length ≤ 1000", "all words have the same length", "1 ≤ target.length ≤ 1000", "lowercase English letters", "return the count modulo 10^9 + 7"],
    recognize:
      "Building target character by character while consuming dictionary columns left to right, with a per-column letter-frequency lookup → a 2-D DP over (target index, column index) using precomputed column counts.",
    figureItOut: [
      "Precompute `count[k][c]` = how many words have letter c in column k. Because all words share length L, each column offers a multiset of letters you can draw target characters from, and a column can be used at most once across the whole construction.",
      "**State**: `dp[i][k]` = the number of ways to form the suffix `target[i..]` using only columns `k..L-1`. The two moving indices are the target position i and the current earliest usable column k.",
      "**Recurrence**: at (i, k) you either **skip** column k (`dp[i][k+1]`) or **use** column k to place `target[i]`, which is possible in `count[k][target[i]]` ways and then advances both indices: `count[k][target[i]] * dp[i+1][k+1]`. Sum both branches modulo 10^9 + 7.",
      "**Base case**: `dp[m][k] = 1` for all k (target fully formed — one empty way). `dp[i][L] = 0` for i < m (ran out of columns but target unfinished — no way).",
      "**Fill**: iterate i from m-1 down to 0 and k from L-1 down to 0 so `dp[i][k+1]` and `dp[i+1][k+1]` are ready. The answer is `dp[0][0]`. A rolling 1-D array over columns reduces space to O(L).",
    ],
    approaches: [
      {
        name: "Column-frequency precompute + 2-D suffix DP (optimal)",
        intuition: "Each column contributes count[k][c] identical ways to place a needed letter; the DP chooses which strictly increasing columns supply each target character.",
        time: "O(L * m + L * 26)",
        timeWhy: "Counting columns is O(L * words) once; the DP fills L*m cells in O(1) each.",
        space: "O(L)",
        spaceWhy: "One rolling array over the m+1 target states, indexed while sweeping columns.",
        code: `int numWays(String[] words, String target) {
    int MOD = 1_000_000_007;
    int L = words[0].length(), m = target.length();
    long[][] count = new long[L][26];
    for (String w : words) {
        for (int k = 0; k < L; k++) {
            count[k][w.charAt(k) - 'a']++;
        }
    }
    // dp[i] = ways to form target[i..] with remaining columns
    long[] dp = new long[m + 1];
    dp[m] = 1;                       // empty suffix: one way
    for (int k = L - 1; k >= 0; k--) {
        for (int i = 0; i < m; i++) {
            // use column k for target[i], adding to the skip value already in dp[i]
            long use = count[k][target.charAt(i) - 'a'] * dp[i + 1] % MOD;
            dp[i] = (dp[i] + use) % MOD;
        }
    }
    return (int) dp[0];
}`,
        walkthrough: [
          'words=["abba","baab"], target="bab", L=4, m=3.',
          "count per column (letters a,b): col0 a:1,b:1; col1 b:1,a:1; col2 b:1,a:1; col3 a:1,b:1.",
          "Init dp=[0,0,0,1] for target indices b,a,b and the empty suffix.",
          "Sweep k=3..0 adding count[k][target[i]]*dp[i+1]; after k=0 the accumulated dp[0] totals 4.",
          "Answer dp[0] = 4 (matches enumerated column choices b<a<b).",
        ],
      },
    ],
    edgeCases: [
      "target longer than L (number of columns) → impossible, answer 0 (you cannot pick L+ strictly increasing columns).",
      "Counts multiply, so reduce mod 10^9 + 7 on every multiply-and-add to avoid overflow even in long.",
      "A target letter absent from a column contributes 0 for the use branch at that column, leaving only the skip path.",
    ],
    twists: [
      "**Columns reusable** → drop the strictly-increasing rule; the DP collapses to a product of per-letter availabilities.",
      "**Distinct words only count once per column** → adjust the count table semantics.",
      "**Return one actual formation** → reconstruct by following the chosen branches backward.",
    ],
    related: ["distinct-subsequences", "longest-common-subsequence", "interleaving-string"],
  },

  {
    slug: "tallest-billboard",
    title: "Tallest Billboard",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 956,
    statement:
      "You are installing a billboard supported by two steel rods of **equal height**. You have a collection of `rods`; each rod may be welded onto the left support, the right support, or left unused. Return the **largest possible height** of the billboard (the common height of the two equal supports), or `0` if the two supports cannot be made equal with a positive height.",
    examples: [
      { in: "rods=[1,2,3,6]", out: "6", note: "left = {1,2,3} = 6, right = {6} = 6" },
      { in: "rods=[1,2,3,4,5,6]", out: "10", note: "left = {2,3,5} = 10, right = {4,6} = 10" },
      { in: "rods=[1,2]", out: "0", note: "cannot balance the two sides" },
    ],
    constraints: ["1 ≤ rods.length ≤ 20", "1 ≤ rods[i] ≤ 1000", "the sum of all rods ≤ 5000"],
    recognize:
      "Split rods into two equal-sum groups while maximizing that sum → a subset-difference DP keyed by the difference between the two supports, the classic balanced-partition pattern.",
    figureItOut: [
      "The two supports are two disjoint subsets of rods with equal sum; we want that equal sum as large as possible. Tracking both subset sums is wasteful — what matters is their **difference**, and for each difference the best is the **taller side's height**.",
      "**State**: `dp[d]` = the maximum height of the **taller** support when the two supports currently differ by exactly `d` (`d = left - right >= 0`). The pair (difference d, taller height) captures everything needed to extend.",
      "**Recurrence**: for each rod r, from a state with difference d and taller height h you may (a) skip r, (b) add r to the taller side -> new diff d+r, taller height h+r, or (c) add r to the shorter side -> the gap shrinks by r. If r <= d the taller stays taller (new diff d-r, height unchanged h); if r > d the shorter overtakes (new diff r-d, taller height h - d + r). Relax the destination with the max height.",
      "**Base case** and **fill**: `dp[0] = 0` (zero rods used, both supports height 0 and equal) while all other differences start unreachable (negative infinity); then process rods one at a time, each rod building a new dp map from the old so no rod is used twice. Differences range 0..sum, so an array of size sum+1 suffices.",
      "The answer is `dp[0]` after all rods: the largest taller-height when the two supports are equal (difference 0).",
    ],
    approaches: [
      {
        name: "Subset-difference DP keyed by gap (optimal)",
        intuition: "Only the gap between the two supports and the taller height matter; for each rod, update where that gap could move and keep the maximum height per gap.",
        time: "O(n * S)",
        timeWhy: "For each of n rods, sweep all reachable differences up to the total sum S.",
        space: "O(S)",
        spaceWhy: "A dp array indexed by difference 0..S (S = sum of rods <= 5000).",
        code: `int tallestBillboard(int[] rods) {
    int sum = 0;
    for (int r : rods) sum += r;
    int[] dp = new int[sum + 1];
    Arrays.fill(dp, Integer.MIN_VALUE);
    dp[0] = 0;                       // diff 0, both supports height 0
    for (int r : rods) {
        int[] cur = dp.clone();      // states without using r
        for (int d = 0; d + r <= sum; d++) {
            if (dp[d] < 0) continue; // unreachable difference
            // add r to the taller side: diff grows by r, taller height +r
            cur[d + r] = Math.max(cur[d + r], dp[d] + r);
            // add r to the shorter side
            int newDiff = Math.abs(d - r);
            int taller = dp[d] + Math.max(0, r - d);
            cur[newDiff] = Math.max(cur[newDiff], taller);
        }
        dp = cur;
    }
    return dp[0];
}`,
        walkthrough: [
          "rods=[1,2,3,6], sum=12. dp[0]=0.",
          "After rod 1: dp[1]=1 (taller side has the 1), dp[0]=0.",
          "After rod 2: reachable diffs include dp[1]=2 (1 on one side, 2 on other -> gap 1 taller 2), dp[3]=3, dp[0]=0...",
          "After rod 3: a state with diff 0 height 3 appears ({1,2} vs {3}).",
          "After rod 6: from diff 0 height 3, adding 6 to shorter side keeps... ultimately {1,2,3} vs {6} gives diff 0 height 6. dp[0]=6. Answer 6.",
        ],
      },
    ],
    edgeCases: [
      "No balanced split possible (e.g. rods=[1,2]) → dp[0] stays 0, the correct answer.",
      "Odd total sum can still yield a positive answer if a balanced subset exists ignoring leftover rods.",
      "Initialize non-zero differences to a sentinel (MIN_VALUE) so unreachable states are never mistaken for height 0.",
    ],
    twists: [
      "**Partition Equal Subset Sum (LeetCode 416)** → boolean version asking only whether an equal split of the whole set exists.",
      "**Last Stone Weight II (LeetCode 1049)** → minimize the difference instead of maximizing the equal height.",
      "**Three supports** → track a pair of differences, a much larger state space.",
    ],
    related: ["partition-equal-subset-sum", "last-stone-weight-ii", "target-sum"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "number-of-closed-islands",
    title: "Number of Closed Islands",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1254,
    statement:
      "Given an `m x n` `grid` of `0`s (land) and `1`s (water), an **island** is a maximal 4-directionally connected group of land cells. A **closed island** is an island whose every land cell is **completely surrounded by water** — that is, no land cell of it touches the border of the grid. Return the number of closed islands.",
    examples: [
      { in: "grid=[[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]]", out: "2" },
      { in: "grid=[[0,0,1,0,0],[0,1,0,1,0],[0,1,1,1,0]]", out: "1" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "grid[i][j] is 0 or 1", "0 is land and 1 is water"],
    recognize:
      "Count land components that do NOT touch the border → flood-fill each land component while tracking whether it reaches an edge, or first eliminate all border-connected land, then count remaining components.",
    figureItOut: [
      "Each land component is a connected group found by DFS/BFS over 0-cells. A closed island is one whose flood fill never steps onto the grid boundary; any island touching row 0, row m-1, col 0, or col n-1 is open and must not be counted.",
      "Cleanest approach: first flood-fill every land cell reachable from the border and convert it to water. After this, every remaining land component is guaranteed interior, so a plain component count gives the answer.",
      "Sink the border-connected land: for each border cell that is land, run a DFS turning all connected land into water (1). This removes all open islands in one sweep.",
      "Then sweep the interior; each time you find a leftover land cell, increment the count and flood-fill it to water so it is counted once. The total is the number of closed islands.",
    ],
    approaches: [
      {
        name: "Sink border land, then count interior components (optimal)",
        intuition: "Drown every island that touches the edge first; whatever land remains is fully enclosed, so a simple component count finishes it.",
        time: "O(m * n)",
        timeWhy: "Border sinking and the interior sweep each visit every cell a constant number of times.",
        space: "O(m * n)",
        spaceWhy: "Recursion stack for DFS in the worst case (a single large island).",
        code: `int closedIsland(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    // sink all land connected to the border
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if ((i == 0 || i == m - 1 || j == 0 || j == n - 1) && grid[i][j] == 0) {
                fill(grid, i, j);
            }
        }
    }
    int count = 0;
    for (int i = 1; i < m - 1; i++) {
        for (int j = 1; j < n - 1; j++) {
            if (grid[i][j] == 0) {
                count++;
                fill(grid, i, j);
            }
        }
    }
    return count;
}
void fill(int[][] grid, int r, int c) {
    int m = grid.length, n = grid[0].length;
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != 0) return;
    grid[r][c] = 1;            // sink to water
    fill(grid, r + 1, c);
    fill(grid, r - 1, c);
    fill(grid, r, c + 1);
    fill(grid, r, c - 1);
}`,
        walkthrough: [
          "Example 2 grid: the land along the outer ring touches the border. Border sinking drowns all of it.",
          "After sinking, only the enclosed land block in the middle (the cells around (1,1)..(2,3) interior that did not touch the edge) remains.",
          "Interior sweep finds one leftover land cell, increments count to 1, and floods it away.",
          "No further land remains. Answer 1.",
        ],
      },
    ],
    edgeCases: [
      "A grid smaller than 3x3 has no interior cells, so there can be no closed island → 0.",
      "An island that touches the border at even a single cell is open and excluded.",
      "Multiple separate interior islands are each counted once because each is flooded after counting.",
    ],
    twists: [
      "**Number of Enclaves (LeetCode 1020)** → count interior land CELLS rather than islands.",
      "**Surrounded Regions (LeetCode 130)** → flip enclosed regions instead of counting them.",
      "**Count Sub Islands (LeetCode 1905)** → compare against a second reference grid.",
    ],
    related: ["number-of-islands", "number-of-enclaves", "surrounded-regions"],
  },

  {
    slug: "detonate-the-maximum-bombs",
    title: "Detonate the Maximum Bombs",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 2101,
    statement:
      "Each bomb is given as `bombs[i] = [x, y, r]`: a position `(x, y)` and a blast radius `r`. Detonating a bomb triggers any bomb whose **center lies within** the detonated bomb's radius, and that chain continues. Note this reachability is **directed** (bomb A may reach B without B reaching A). Return the maximum number of bombs that can be detonated by manually triggering exactly **one** bomb.",
    examples: [
      { in: "bombs=[[2,1,3],[6,1,4]]", out: "2", note: "detonating bomb 1 reaches bomb 0 too" },
      { in: "bombs=[[1,1,5],[10,10,5]]", out: "1", note: "neither reaches the other" },
      { in: "bombs=[[1,1,100],[2,2,1],[3,3,1],[4,4,1],[5,5,1]]", out: "5", note: "bomb 0 reaches everything directly" },
    ],
    constraints: ["1 ≤ bombs.length ≤ 100", "bombs[i].length == 3", "1 ≤ x_i, y_i, r_i ≤ 10^5"],
    recognize:
      "Bomb i triggers bomb j when j's center is inside i's radius → build a DIRECTED reachability graph, then from each bomb run DFS/BFS and take the largest reachable set.",
    figureItOut: [
      "Model each bomb as a node. Add a directed edge i -> j when bomb j's center falls within bomb i's blast, i.e. `dist(i, j) <= r_i`. The relation is asymmetric because radii differ, so the graph is directed.",
      "Compare squared distances to avoid floating-point error: edge i -> j exists iff `(xi-xj)^2 + (yi-yj)^2 <= ri^2`. Coordinates up to 10^5 make squares up to 10^10, so use long arithmetic.",
      "Detonating one bomb sets off everything reachable from it along directed edges. So from each starting node, count the size of its reachable set via DFS/BFS over the directed adjacency.",
      "With only up to 100 bombs, running a full traversal from every node (O(V * (V + E)) = O(V^3) in the worst case) is cheap. The answer is the maximum reachable-set size over all starting bombs.",
    ],
    approaches: [
      {
        name: "Directed reachability graph + DFS from every bomb (optimal)",
        intuition: "Edges encode who-triggers-whom; the best single trigger is the node whose directed reach covers the most bombs.",
        time: "O(n^3)",
        timeWhy: "Building edges is O(n^2); a DFS from each of n nodes costs O(n + E) = O(n^2), totaling O(n^3) for n <= 100.",
        space: "O(n^2)",
        spaceWhy: "The adjacency list can hold up to n^2 directed edges plus a visited array.",
        code: `int maximumDetonation(int[][] bombs) {
    int n = bombs.length;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) continue;
            long dx = bombs[i][0] - bombs[j][0];
            long dy = bombs[i][1] - bombs[j][1];
            long r = bombs[i][2];
            if (dx * dx + dy * dy <= r * r) {
                adj.get(i).add(j);   // i can detonate j
            }
        }
    }
    int best = 0;
    for (int i = 0; i < n; i++) {
        boolean[] visited = new boolean[n];
        best = Math.max(best, dfs(i, adj, visited));
    }
    return best;
}
int dfs(int u, List<List<Integer>> adj, boolean[] visited) {
    visited[u] = true;
    int count = 1;
    for (int v : adj.get(u)) {
        if (!visited[v]) count += dfs(v, adj, visited);
    }
    return count;
}`,
        walkthrough: [
          "bombs=[[2,1,3],[6,1,4]]. Edge 0->1? dist^2=(2-6)^2+0=16, r0^2=9, 16>9 no. Edge 1->0? dist^2=16, r1^2=16, 16<=16 yes.",
          "DFS from 0: visits only 0 (no outgoing edge). count=1.",
          "DFS from 1: visits 1, then edge 1->0 visits 0. count=2.",
          "best = max(1, 2) = 2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "Reachability is directed: include the edge i->j only when j is inside i's radius, never assume symmetry.",
      "Use long for squared distances; (10^5)^2 = 10^10 overflows int.",
      "A single bomb (n=1) trivially detonates itself → answer 1.",
    ],
    twists: [
      "**Undirected if radii equal** → the graph becomes symmetric and connected-component sizing suffices.",
      "**Detonate up to k bombs manually** → choose k start nodes maximizing union of reach (set cover, NP-hard in general).",
      "**Strict inside (dist < r)** → change <= to < in the edge test.",
    ],
    related: ["find-if-path-exists-in-graph", "number-of-provinces", "clone-graph"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "the-maze-ii",
    title: "The Maze II",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 505,
    statement:
      "A ball is in a `maze` of empty spaces (`0`) and walls (`1`). The ball can roll up, down, left, or right, but it does **not stop** until it hits a wall; only then can it pick a new direction. Given `start` and `destination` (both empty cells), return the **shortest distance** (number of empty cells the ball travels, not counting the start) for the ball to stop at the destination, or `-1` if it cannot stop there.",
    examples: [
      { in: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], destination=[4,4]", out: "12" },
      { in: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], destination=[3,2]", out: "-1", note: "the ball cannot STOP at (3,2)" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "maze[i][j] is 0 or 1", "start and destination are empty cells", "the borders are all walls or the ball stops at edges", "start != destination"],
    recognize:
      "Edges have variable cost because rolling to the next wall covers several cells → weighted shortest path on stopping-points, solved with **Dijkstra** over the cells where the ball can rest.",
    figureItOut: [
      "The graph nodes are the cells where the ball can **stop** (right before a wall or the maze edge). An edge connects two stop-cells if the ball can roll from one to the other in a single straight slide, and its weight is the number of cells traversed in that slide. Because weights differ, plain BFS is insufficient — use Dijkstra.",
      "From a stop-cell, for each of the four directions, roll until the next cell would be a wall or out of bounds; the cell where it halts is a neighbor, and the distance added is how many steps it rolled.",
      "Maintain `dist[r][c]` = the shortest rolling distance from start to stopping at (r, c). Use a min-priority queue ordered by accumulated distance; pop the closest stop-cell, relax each rolled neighbor, and push improved distances.",
      "When you pop the destination cell (or finish the queue), `dist[destination]` holds the answer. If it remains infinity, the ball can never **stop** at the destination, so return -1. Standard Dijkstra correctness applies since all roll-distances are non-negative.",
    ],
    approaches: [
      {
        name: "Dijkstra over stopping cells with roll-length edges (optimal)",
        intuition: "Each straight slide is a weighted edge to the wall-stop cell; Dijkstra finds the least-total-distance way to come to rest on the destination.",
        time: "O(m * n * log(m * n) * 4)",
        timeWhy: "Each cell can be relaxed via the priority queue; each pop explores four directional rolls of length up to max(m, n).",
        space: "O(m * n)",
        spaceWhy: "The dist matrix and the priority queue of stop-cells.",
        code: `int shortestDistance(int[][] maze, int[] start, int[] destination) {
    int m = maze.length, n = maze[0].length;
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[2] - b[2]);
    dist[start[0]][start[1]] = 0;
    pq.add(new int[]{start[0], start[1], 0});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[0], c = cur[1], d = cur[2];
        if (d > dist[r][c]) continue;
        for (int[] dir : dirs) {
            int nr = r, nc = c, steps = 0;
            // roll until hitting a wall or edge
            while (nr + dir[0] >= 0 && nr + dir[0] < m && nc + dir[1] >= 0 && nc + dir[1] < n
                   && maze[nr + dir[0]][nc + dir[1]] == 0) {
                nr += dir[0];
                nc += dir[1];
                steps++;
            }
            if (d + steps < dist[nr][nc]) {
                dist[nr][nc] = d + steps;
                pq.add(new int[]{nr, nc, d + steps});
            }
        }
    }
    int ans = dist[destination[0]][destination[1]];
    return ans == Integer.MAX_VALUE ? -1 : ans;
}`,
        walkthrough: [
          "start=[0,4], destination=[4,4]. dist[0][4]=0; push (0,4,0).",
          "Pop (0,4,0). Rolling down stops at (1,4) after 1 step (wall pattern); rolling left stops at (0,3)... relax neighbors with their roll lengths.",
          "Dijkstra keeps expanding the cheapest stop-cell; one optimal route rolls down, left, down, right accumulating 12 cells.",
          "When (4,4) is settled, dist[4][4]=12. Answer 12.",
        ],
      },
    ],
    edgeCases: [
      "The ball must STOP at the destination; merely rolling through it does not count (example 2 returns -1).",
      "A direction where the ball cannot move at all (immediate wall) yields steps=0 and no useful edge.",
      "Disconnected destination → dist stays MAX_VALUE → return -1.",
    ],
    twists: [
      "**The Maze (LeetCode 490)** → only ask whether the destination is reachable; BFS over stop-cells suffices.",
      "**The Maze III (LeetCode 499)** → add a hole and tie-break shortest paths lexicographically by direction string.",
      "**Count distinct shortest paths** → augment Dijkstra with path counting.",
    ],
    related: ["the-maze", "network-delay-time", "swim-in-rising-water"],
  },

  {
    slug: "second-minimum-time-to-reach-destination",
    title: "Second Minimum Time to Reach Destination",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 2045,
    statement:
      "A city has `n` intersections `1..n` connected by bidirectional `edges`; every edge takes `time` minutes to traverse. All intersections share a traffic signal that is **green** for `change` minutes then **red** for `change` minutes, repeating. You may wait at an intersection, but you can only **leave** when the signal is green; if you arrive while it is red you wait until it turns green. Starting at intersection 1 at time 0 (signal just turned green), return the **second minimum** time (a strictly larger value than the minimum) to reach intersection `n`.",
    examples: [
      { in: "n=5, edges=[[1,2],[1,3],[1,4],[3,4],[4,5]], time=3, change=5", out: "13" },
      { in: "n=2, edges=[[1,2]], time=3, change=2", out: "11", note: "min is 3; second min adds a detour back and forth" },
    ],
    constraints: ["2 ≤ n ≤ 10^4", "n-1 ≤ edges.length ≤ min(2*10^4, n*(n-1)/2)", "edges[i].length == 2", "1 ≤ u, v ≤ n", "u != v", "no duplicate edges", "the graph is connected", "1 ≤ time, change ≤ 10^3"],
    recognize:
      "Every edge costs the same time, so the second-smallest number of edges to the target dominates → a **modified BFS** tracking the best and second-best edge-count to each node, with signal waiting applied per hop.",
    figureItOut: [
      "Since all edges have equal traversal time, the time to reach a node is a function of the **number of edges** along the path (plus signal waiting). So we want the second-smallest distinct edge-count path length to node n; BFS explores by increasing edge count naturally.",
      "Track two arrays: `dist1[v]` = fewest edges to reach v, and `dist2[v]` = the second-fewest edge count that is **strictly greater** than dist1[v]. A BFS layer-by-layer fills dist1 first; a slightly longer alternative fills dist2.",
      "Relaxation rule when arriving at neighbor v with edge count d = dist[u] + 1: if d < dist1[v], set dist1[v] = d and enqueue; else if d > dist1[v] && d < dist2[v], set dist2[v] = d and enqueue. Each node is enqueued at most twice (once per array).",
      "Convert the second-minimum edge count `dist2[n]` into real time by simulating the signal: at each step, if the current arrival time lands in a red window (`(t / change) % 2 == 1`), wait until the next green by rounding up to `(t/change + 1) * change`; then add `time`. The answer is the simulated time after `dist2[n]` edges.",
    ],
    approaches: [
      {
        name: "BFS for first & second shortest edge-count, then signal-time simulation (optimal)",
        intuition: "Equal edge weights make path length a function of edge count, so a two-level BFS finds the second-smallest hop count; the traffic signal converts hops into real minutes.",
        time: "O(V + E)",
        timeWhy: "Each node is enqueued at most twice and each edge relaxed a constant number of times.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list plus the two distance arrays and the BFS queue.",
        code: `int secondMinimum(int n, int[][] edges, int time, int change) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    int[] dist1 = new int[n + 1];
    int[] dist2 = new int[n + 1];
    Arrays.fill(dist1, Integer.MAX_VALUE);
    Arrays.fill(dist2, Integer.MAX_VALUE);
    Deque<int[]> queue = new ArrayDeque<>();   // {node, edgeCount}
    queue.add(new int[]{1, 0});
    dist1[1] = 0;
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int u = cur[0], d = cur[1];
        for (int v : adj.get(u)) {
            int nd = d + 1;
            if (nd < dist1[v]) {
                dist1[v] = nd;
                queue.add(new int[]{v, nd});
            } else if (nd > dist1[v] && nd < dist2[v]) {
                dist2[v] = nd;
                queue.add(new int[]{v, nd});
            }
        }
    }
    // simulate the signal for dist2[n] edges
    int t = 0;
    for (int i = 0; i < dist2[n]; i++) {
        if ((t / change) % 2 == 1) {           // red light: wait for green
            t = (t / change + 1) * change;
        }
        t += time;
    }
    return t;
}`,
        walkthrough: [
          "n=2, edges=[[1,2]], time=3, change=2. BFS: dist1[2]=1. The second path bounces 1->2->1->2, so dist2[2]=3 edges.",
          "Simulate 3 edges. Edge 1: t=0, green ((0/2)%2=0), t=0+3=3.",
          "Edge 2: t=3, (3/2)%2=(1)%2=1 red -> wait to (1+1)*2=4, then t=4+3=7.",
          "Edge 3: t=7, (7/2)%2=(3)%2=1 red -> wait to (3+1)*2=8, then t=8+3=11. Answer 11.",
        ],
      },
    ],
    edgeCases: [
      "The second minimum must be STRICTLY greater than the minimum, so the relaxation uses nd > dist1[v] && nd < dist2[v].",
      "Because the graph is connected and you may always backtrack along an edge, a second-shortest path of edge count dist1[n]+2 (or +1 if parity allows) always exists.",
      "Signal waiting only applies when LEAVING a node during a red window; arriving at the destination does not require waiting.",
    ],
    twists: [
      "**k-th minimum time** → maintain k distance levels per node instead of two.",
      "**Weighted edges** → switch the BFS to Dijkstra tracking best and second-best distances.",
      "**Strict vs non-strict second minimum** → toggle whether equal edge counts count as a second path.",
    ],
    related: ["network-delay-time", "cheapest-flights-within-k-stops", "number-of-ways-to-arrive-at-destination"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "maximum-length-of-concatenated-string-with-unique-characters",
    title: "Maximum Length of a Concatenated String with Unique Characters",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 1239,
    statement:
      "You are given an array `arr` of strings. A string `s` is formed by concatenating some **subsequence** of `arr` (in any chosen subset, original order does not matter for the count) such that `s` has **no repeated characters**. Return the maximum possible length of such a concatenation. A word containing a duplicate letter within itself can never be used.",
    examples: [
      { in: 'arr=["un","iq","ue"]', out: "4", note: 'possible concatenations: "" , "un", "iq", "ue", "uniq", "ique" -> max length 4' },
      { in: 'arr=["cha","r","act","ers"]', out: "6", note: '"chaers" or "acters" use 6 unique letters' },
      { in: 'arr=["abcdefghijklmnopqrstuvwxyz"]', out: "26" },
    ],
    constraints: ["1 ≤ arr.length ≤ 16", "1 ≤ arr[i].length ≤ 26", "arr[i] consists of lowercase English letters"],
    recognize:
      "Choose a subset of words whose combined letters stay all-distinct, maximizing total length → classic include/exclude **backtracking**, made fast by representing each word as a 26-bit mask and testing overlap with AND.",
    figureItOut: [
      "Each word is usable only if it has no internal duplicate letters; encode such a word as a 26-bit `mask` where bit c is set if letter c is present, and store its bit-count as the length. Words with internal duplicates are discarded up front.",
      "The decision is a subset choice over the (filtered) words: at each word, either **skip** it or **take** it if its mask does not overlap the letters used so far. Two masks overlap exactly when `(used & wordMask) != 0`.",
      "Backtracking recursion: `solve(i, used)` considers word i. The take branch is allowed only when there is no overlap; it recurses with `used | wordMask` and adds that word's letter count. The skip branch recurses with `used` unchanged. Track the maximum total bits used.",
      "When i reaches the end, the candidate is a valid all-unique concatenation, so its length is `Integer.bitCount(used)`. Return the maximum over the whole choice tree. With at most 16 words this 2^16 search is fast, and masks make each overlap test O(1).",
    ],
    approaches: [
      {
        name: "Include/exclude backtracking over bitmask words (optimal)",
        intuition: "Treat each duplicate-free word as a letter bitmask; explore the subset tree, only adding a word when its letters do not clash with those already used.",
        time: "O(2^n)",
        timeWhy: "Each of the n <= 16 words is included or excluded; overlap checks are O(1) via bit masks.",
        space: "O(n)",
        spaceWhy: "Recursion depth up to n plus the precomputed mask array.",
        code: `int maxLength(List<String> arr) {
    List<Integer> masks = new ArrayList<>();
    for (String s : arr) {
        int mask = 0;
        boolean ok = true;
        for (char ch : s.toCharArray()) {
            int bit = 1 << (ch - 'a');
            if ((mask & bit) != 0) { ok = false; break; }  // internal duplicate
            mask |= bit;
        }
        if (ok) masks.add(mask);
    }
    return backtrack(masks, 0, 0);
}
int backtrack(List<Integer> masks, int i, int used) {
    if (i == masks.size()) return Integer.bitCount(used);
    int skip = backtrack(masks, i + 1, used);
    int take = 0;
    if ((used & masks.get(i)) == 0) {   // no overlapping letters
        take = backtrack(masks, i + 1, used | masks.get(i));
    }
    return Math.max(skip, take);
}`,
        walkthrough: [
          'arr=["un","iq","ue"]. Masks: un -> bits u,n; iq -> bits i,q; ue -> bits u,e. None has internal dup.',
          "Take un (used=u,n). Next iq: no overlap -> take (used=u,n,i,q) length 4. ue overlaps u -> skip. -> 4.",
          "Skip un, take iq, take ue -> i,q,u,e length 4.",
          "Best over the tree is 4. Answer 4.",
        ],
      },
    ],
    edgeCases: [
      "A word with an internal duplicate (e.g. \"aa\") is filtered out and can never be part of any concatenation.",
      "The empty concatenation has length 0, which is the floor of the answer.",
      "All words sharing a common letter → only one of them can ever be used together with letters from others that avoid the clash.",
    ],
    twists: [
      "**DP over reachable masks** → iterate a set of achievable used-masks instead of recursion, same complexity.",
      "**Maximize number of WORDS used instead of letters** → count words taken rather than bits set.",
      "**Allow up to one repeated letter** → relax the overlap test, complicating the state.",
    ],
    related: ["subsets", "partition-to-k-equal-sum-subsets", "combination-sum"],
  },

  {
    slug: "optimal-account-balancing",
    title: "Optimal Account Balancing",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 465,
    statement:
      "You are given a list of `transactions` where `transactions[i] = [from, to, amount]` means person `from` paid person `to` the given `amount`. Return the **minimum number of transactions** required to settle all debts, so that everyone's net balance becomes zero.",
    examples: [
      { in: "transactions=[[0,1,10],[2,0,5]]", out: "2", note: "person 0 owes 5 net; settle with two transfers" },
      { in: "transactions=[[0,1,10],[1,0,1],[1,2,5],[2,0,5]]", out: "1", note: "all balances collapse so a single transfer settles" },
    ],
    constraints: ["1 ≤ transactions.length ≤ 8", "transactions[i].length == 3", "0 ≤ from, to < 12", "from != to", "1 ≤ amount ≤ 100"],
    recognize:
      "Settle nonzero net balances with the fewest transfers → reduce to a list of net debts/credits, then **backtrack**: for each debtor, try settling it against every later balance, minimizing the transaction count.",
    figureItOut: [
      "Names do not matter for the count; only each person's **net balance** does. Sum each person's incoming minus outgoing into a balance map, then keep only the nonzero balances into an array `bal`. The sum of `bal` is always 0 (money is conserved).",
      "Settling means making every balance 0 with as few transfers as possible. A greedy pairing is not optimal in general, so we **backtrack**: starting from the first nonzero balance, transfer its entire amount onto some other balance of opposite sign, recursing on the smaller subproblem.",
      "Recursion `settle(start)`: skip leading zero balances by advancing start. For the balance `bal[start]`, try every later index j with `bal[j]` of opposite sign; tentatively do `bal[j] += bal[start]` (one transaction), recurse from start+1, then undo. Take the minimum transaction count over all choices.",
      "**Base case**: when start reaches the end, all balances are settled and 0 further transactions are needed (return 0). Each successful pairing costs 1 plus the cost of settling the rest. The minimum over the whole search tree is the answer. With at most 12 distinct people and tiny input, the exponential search is fast.",
    ],
    approaches: [
      {
        name: "Net-balance reduction + debt-settling backtracking (optimal)",
        intuition: "Collapse transactions into net balances, then recursively settle the first nonzero balance against every compatible later balance, minimizing transfers.",
        time: "O(n!)",
        timeWhy: "Worst case tries all orderings of settling the (at most 12) nonzero balances; bounded small input keeps it fast.",
        space: "O(n)",
        spaceWhy: "The balance array (size <= 12) and the recursion depth.",
        code: `int minTransfers(int[][] transactions) {
    Map<Integer, Integer> net = new HashMap<>();
    for (int[] t : transactions) {
        net.put(t[0], net.getOrDefault(t[0], 0) - t[2]);
        net.put(t[1], net.getOrDefault(t[1], 0) + t[2]);
    }
    List<Integer> debts = new ArrayList<>();
    for (int v : net.values()) {
        if (v != 0) debts.add(v);
    }
    int[] bal = new int[debts.size()];
    for (int i = 0; i < bal.length; i++) bal[i] = debts.get(i);
    return settle(bal, 0);
}
int settle(int[] bal, int start) {
    while (start < bal.length && bal[start] == 0) start++;
    if (start == bal.length) return 0;
    int best = Integer.MAX_VALUE;
    for (int j = start + 1; j < bal.length; j++) {
        // only pair opposite signs
        if (bal[j] * bal[start] < 0) {
            bal[j] += bal[start];
            best = Math.min(best, 1 + settle(bal, start + 1));
            bal[j] -= bal[start];      // backtrack
        }
    }
    return best;
}`,
        walkthrough: [
          "transactions=[[0,1,10],[2,0,5]]. net: 0 -> -10+5 = -5, 1 -> +10, 2 -> -5.",
          "Nonzero balances bal = [-5, +10, -5] (order may vary).",
          "settle(0): bal[0]=-5; pair with bal[1]=+10 (opposite sign): bal[1]+=-5 -> 5, cost 1 + settle(1).",
          "settle(1): bal[1]=5; pair with bal[2]=-5: bal[2]+=5 -> 0, cost 1 + settle(2)=0. So this branch costs 2.",
          "Minimum total = 2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "People with net balance 0 are dropped entirely; they need no transfers.",
      "If all transactions already cancel out, the debt list is empty and the answer is 0.",
      "Only opposite-sign balances are paired (bal[j]*bal[start] < 0); same-sign pairings cannot settle anything.",
    ],
    twists: [
      "**Subset-sum pruning** → group balances that sum to zero into independent clusters to settle separately, speeding the search.",
      "**Allow a clearing house (one hub pays everyone)** → the lower bound becomes (number of nonzero balances) - 1.",
      "**Weighted by transfer fees** → minimize total fee instead of transaction count.",
    ],
    related: ["partition-to-k-equal-sum-subsets", "combination-sum", "accounts-merge"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "minimum-rounds-to-complete-all-tasks",
    title: "Minimum Rounds to Complete All Tasks",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 2244,
    statement:
      "You are given an array `tasks` where `tasks[i]` is the difficulty level of the i-th task. In each round you may complete either **2** tasks or **3** tasks, but all tasks completed in a single round must share the **same** difficulty level. Return the **minimum number of rounds** needed to complete every task, or `-1` if it is impossible.",
    examples: [
      { in: "tasks=[2,2,3,3,2,4,4,4,4,4]", out: "4", note: "three 2s (1 round), two 3s (1 round), five 4s = 3+2 (2 rounds) -> 4" },
      { in: "tasks=[2,3,3]", out: "-1", note: "a single 2 cannot be completed (needs at least 2 of a kind)" },
    ],
    constraints: ["1 ≤ tasks.length ≤ 10^5", "1 ≤ tasks[i] ≤ 10^9"],
    recognize:
      "Group equal-difficulty tasks and clear each group in chunks of 3 (preferring 3) and 2 → a per-frequency **greedy**: a count of 1 is impossible; otherwise use as many 3s as possible and finish with 2s.",
    figureItOut: [
      "Tasks only combine within the same difficulty, so first tally the frequency of each distinct difficulty. Each difficulty group is solved independently, and the total is the sum of rounds across groups.",
      "For a group of size `c`, you want the fewest rounds using chunks of size 3 and 2. Greedily prefer chunks of 3 since they clear more per round. The only impossible group is `c == 1` (you cannot do a round of size 1), which makes the whole answer -1.",
      "Closed form per group: if `c % 3 == 0`, you need `c / 3` rounds (all triples). Otherwise `c / 3 + 1` rounds — the remainder (1 or 2) is absorbed by converting one triple into a pair plus a pair, or adding a single pair. This equals `ceil(c / 3)` and is provably minimal.",
      "Sum these per-group round counts. The greedy is optimal because using a 2 instead of a 3 only when forced (remainder 1 or 2) never wastes a round, and no arrangement beats ceil(c/3).",
    ],
    approaches: [
      {
        name: "Frequency tally + per-group ceil(count/3) greedy (optimal)",
        intuition: "Clear each difficulty group with as many triples as possible; a leftover of 1 or 2 costs exactly one more round, and a lone task is unsolvable.",
        time: "O(n)",
        timeWhy: "One pass to count frequencies and one pass over the distinct difficulties.",
        space: "O(n)",
        spaceWhy: "A hash map of difficulty frequencies.",
        code: `int minimumRounds(int[] tasks) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int t : tasks) {
        freq.put(t, freq.getOrDefault(t, 0) + 1);
    }
    int rounds = 0;
    for (int c : freq.values()) {
        if (c == 1) return -1;           // a single task cannot be done
        rounds += (c + 2) / 3;           // ceil(c / 3)
    }
    return rounds;
}`,
        walkthrough: [
          "tasks=[2,2,3,3,2,4,4,4,4,4]. freq: {2:3, 3:2, 4:5}.",
          "c=3 (difficulty 2): (3+2)/3 = 1 round.",
          "c=2 (difficulty 3): (2+2)/3 = 1 round.",
          "c=5 (difficulty 4): (5+2)/3 = 2 rounds (a 3 and a 2). Total 1+1+2 = 4. Answer 4.",
        ],
      },
    ],
    edgeCases: [
      "Any difficulty appearing exactly once → return -1 immediately, since no round of size 1 exists.",
      "A group size of 2 → exactly one round (a single pair).",
      "Large frequencies are fine; ceil(c/3) via (c+2)/3 avoids floating point.",
    ],
    twists: [
      "**Allowed chunk sizes change (e.g. only 2 or 4)** → the per-group formula changes; some remainders become impossible.",
      "**Minimize tasks left undone within k rounds** → flips into a budgeted optimization.",
      "**Return the round assignment, not just the count** → emit the actual groupings.",
    ],
    related: ["assign-cookies", "minimum-deletions-to-make-character-frequencies-unique", "hand-of-straights"],
  },

  {
    slug: "maximum-ice-cream-bars",
    title: "Maximum Ice Cream Bars",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1833,
    statement:
      "A shop sells ice cream bars at prices given by `costs`, where `costs[i]` is the price of the i-th bar. A boy has `coins` coins. He wants to buy **as many bars as possible** (each bar at most once, order irrelevant). Return the **maximum number of bars** he can buy with his coins.",
    examples: [
      { in: "costs=[1,3,2,4,1], coins=7", out: "4", note: "buy the bars priced 1,1,2,3 = 7 -> 4 bars" },
      { in: "costs=[10,6,8,7,7,8], coins=5", out: "0", note: "every bar costs more than 5" },
      { in: "costs=[1,6,3,1,2,5], coins=20", out: "6", note: "afford all six" },
    ],
    constraints: ["1 ≤ costs.length ≤ 10^5", "1 ≤ costs[i] ≤ 10^5", "1 ≤ coins ≤ 10^8"],
    recognize:
      "Maximize the count of items bought under a budget → a textbook **greedy**: sort prices ascending and buy the cheapest bars until the next one is unaffordable.",
    figureItOut: [
      "To maximize the **number** of bars (not value), always spend on the cheapest available bar first — a more expensive bar can never let you buy more total bars than a cheaper one for the same money. So sort the costs ascending.",
      "Sweep the sorted prices, subtracting each price from the remaining coins while you can still afford it and incrementing a counter. The moment a bar exceeds the remaining coins, you can stop: every subsequent bar is at least as expensive and equally unaffordable.",
      "This exchange argument proves optimality: in any optimal purchase set, replacing its most expensive bar with an unbought cheaper one never decreases the count and never exceeds the budget, so the cheapest-first set is optimal.",
      "Because prices are bounded by 10^5, a counting-sort variant can sort in O(maxCost + n) if needed, but a comparison sort is plenty for 10^5 items. Use a long running total or compare against remaining coins to avoid overflow with coins up to 10^8.",
    ],
    approaches: [
      {
        name: "Sort ascending and buy cheapest first (optimal)",
        intuition: "Spending on the lowest prices first stretches the budget across the most bars; stop at the first one you cannot afford.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting the costs; the buying sweep is linear.",
        space: "O(1) or O(n)",
        spaceWhy: "In-place sort uses no extra space beyond the array (or O(n) for counting sort).",
        code: `int maxIceCream(int[] costs, int coins) {
    Arrays.sort(costs);
    int count = 0;
    for (int price : costs) {
        if (coins >= price) {
            coins -= price;
            count++;
        } else {
            break;       // all remaining bars are at least this expensive
        }
    }
    return count;
}`,
        walkthrough: [
          "costs=[1,3,2,4,1], coins=7. Sort -> [1,1,2,3,4].",
          "Buy 1: coins=6, count=1. Buy 1: coins=5, count=2. Buy 2: coins=3, count=3.",
          "Buy 3: coins=0, count=4. Next is 4 > 0 -> stop.",
          "Answer 4.",
        ],
      },
    ],
    edgeCases: [
      "All bars cost more than coins → buy 0 (example 2).",
      "Coins large enough for everything → buy all n bars.",
      "Breaking early at the first unaffordable bar is safe because the array is sorted ascending.",
    ],
    twists: [
      "**Maximize total VALUE under a budget with item weights** → becomes a 0/1 knapsack, not greedy.",
      "**Counting sort by price** → O(n + maxCost) when prices are small, beating the comparison sort.",
      "**Bars have quantities** → repeat purchasing of the same price until the supply runs out.",
    ],
    related: ["assign-cookies", "boats-to-save-people", "minimum-number-of-refueling-stops"],
  },
];
