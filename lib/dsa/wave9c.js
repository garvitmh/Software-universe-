// NeetCode All — wave 9c (dp-1d, dp-2d, graphs, advanced-graphs, greedy, backtracking). Java.
// Same deep-teaching shape as wave8c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
export const WAVE9C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "partition-array-for-maximum-sum",
    title: "Partition Array for Maximum Sum",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 1043,
    statement:
      "Given an array `arr`, partition it into contiguous subarrays of length **at most `k`**. After partitioning, every element in a subarray becomes the **maximum** of that subarray. Return the **largest sum** of the array after this transformation.",
    examples: [
      { in: "arr = [1,15,7,9,2,5,10], k = 3", out: "84", note: "[15,15,15,9,10,10,10]" },
      { in: "arr = [1,4,1,5,7,3,6,1,9,9,3], k = 4", out: "83" },
      { in: "arr = [1], k = 1", out: "1" },
    ],
    constraints: ["1 ≤ arr.length ≤ 500", "0 ≤ arr[i] ≤ 10⁹", "1 ≤ k ≤ arr.length"],
    recognize:
      "The choice 'where does the last group end?' splits the array into a smaller prefix problem plus one group — overlapping subproblems over a prefix index → **1-D DP**. You only ever decide the length (1..k) of the final block.",
    figureItOut: [
      "**State**: let `dp[i]` be the maximum transformed sum of the **first `i` elements** `arr[0..i-1]`. One index suffices because once the prefix length is fixed, the rest is a self-contained subproblem.",
      "**Recurrence**: the last group ends at index `i-1` and has some length `len` in `1..k`. That group's elements all become its max, contributing `len * max(arr[i-len..i-1])`, and the elements before it are `dp[i-len]`. So `dp[i] = max over len=1..min(k,i) of ( dp[i-len] + len * runningMax )`, where `runningMax` is the largest of the last `len` elements.",
      "**Base case**: `dp[0] = 0` — an empty prefix has sum 0.",
      "**Fill**: sweep `i` from 1 to n. For each `i`, walk `len` from 1 upward (up to k or i), extending a running max over `arr[i-len]`, and keep the best candidate. This is O(n·k).",
      "The answer is `dp[n]` — the best transformed sum over the whole array.",
    ],
    approaches: [
      {
        name: "Memoized recursion from the front",
        intuition: "From index i, try every group length 1..k, recurse on the remainder, cache by i.",
        time: "O(n·k)",
        timeWhy: "n distinct start indices, each trying up to k group lengths.",
        space: "O(n)",
        spaceWhy: "Memo array plus recursion depth up to n.",
        code: `int maxSumAfterPartitioning(int[] arr, int k) {
    Integer[] memo = new Integer[arr.length];
    return go(arr, k, 0, memo);
}
int go(int[] arr, int k, int i, Integer[] memo) {
    if (i == arr.length) return 0;
    if (memo[i] != null) return memo[i];
    int curMax = 0, best = 0;
    for (int len = 1; len <= k && i + len <= arr.length; len++) {
        curMax = Math.max(curMax, arr[i + len - 1]);
        best = Math.max(best, len * curMax + go(arr, k, i + len, memo));
    }
    return memo[i] = best;
}`,
      },
      {
        name: "Bottom-up prefix DP (optimal)",
        intuition: "dp[i] = best transformed sum of the first i elements; the last block has length 1..k.",
        time: "O(n·k)",
        timeWhy: "For each of n prefix lengths we look back up to k elements.",
        space: "O(n)",
        spaceWhy: "A single dp array of length n+1.",
        code: `int maxSumAfterPartitioning(int[] arr, int k) {
    int n = arr.length;
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        int curMax = 0;
        for (int len = 1; len <= k && len <= i; len++) {
            curMax = Math.max(curMax, arr[i - len]);
            dp[i] = Math.max(dp[i], dp[i - len] + len * curMax);
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "arr=[1,15,7,9,2,5,10], k=3. dp[1]=1. dp[2]: len1 -> dp[1]+15=16; len2 -> dp[0]+2*15=30 => dp[2]=30.",
          "dp[3]: len1 dp[2]+7=37; len2 dp[1]+2*15=31; len3 dp[0]+3*15=45 => dp[3]=45.",
          "Continuing, dp[4]=45+9=54, dp[5]=54+9? best is dp[3]+2*9=63 -> dp[5]=63, dp[6]=63+? best dp[5]+5=68 or dp[4]+2*5=64 -> 68, dp[7]: len1 dp[6]+10=78; len2 dp[5]+2*10=83; len3 dp[4]+3*10=84 => dp[7]=84.",
        ],
      },
    ],
    edgeCases: [
      "k == 1 → no grouping changes anything; the answer is the plain sum of arr.",
      "k ≥ n → one group of the whole array → n * max(arr).",
      "Elements up to 10⁹ with length up to 500 → use long internally if you fear overflow, though int is fine here (≤ 5·10¹¹ would overflow int — prefer long for safety).",
    ],
    twists: [
      "**Minimize the transformed sum** → flip max to min (each block becomes its minimum instead).",
      "**Exactly k groups** → add a second dimension counting groups used.",
      "**Block becomes its sum, not its max** → recurrence changes but the prefix-DP skeleton is identical.",
    ],
    related: ["house-robber", "word-break", "paint-house"],
  },

  {
    slug: "paint-house",
    title: "Paint House",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 256,
    statement:
      "There are `n` houses in a row, each painted red, blue, or green, and **no two adjacent houses may share a color**. `costs[i]` gives the cost to paint house `i` red/blue/green. Return the **minimum total cost** to paint all houses.",
    examples: [
      { in: "costs = [[17,2,17],[16,16,5],[14,3,19]]", out: "10", note: "blue, green, blue = 2+5+3" },
      { in: "costs = [[7,6,2]]", out: "2" },
    ],
    constraints: ["costs.length == n", "costs[i].length == 3", "1 ≤ n ≤ 100", "1 ≤ cost ≤ 20"],
    recognize:
      "Each house's best cost depends only on the **previous house's color choice**. A small fixed set of states (3 colors) carried forward house by house → **1-D DP with a constant-width state**.",
    figureItOut: [
      "**State**: `dp[c]` = the minimum cost to paint houses `0..i` such that house `i` is painted color `c` (0=red, 1=blue, 2=green). Three numbers fully describe how the previous house can constrain the next.",
      "**Recurrence**: painting house `i` color `c` forbids the previous house from being `c`, so you add `costs[i][c]` to the cheaper of the other two previous colors: `dp_i[c] = costs[i][c] + min(dp_{i-1}[other1], dp_{i-1}[other2])`.",
      "**Base case**: house 0 has no predecessor, so `dp[c] = costs[0][c]` for each color.",
      "**Fill**: process houses left to right, each time computing the three new color costs from the three previous ones (a rolling triple of values, O(1) space).",
      "The answer is `min(dp[red], dp[blue], dp[green])` after the last house.",
    ],
    approaches: [
      {
        name: "Full 2-D table",
        intuition: "dp[i][c] = min cost to paint up to house i ending in color c; fill row by row.",
        time: "O(n)",
        timeWhy: "n houses × 3 colors, constant work per cell.",
        space: "O(n)",
        spaceWhy: "Stores an n×3 table.",
        code: `int minCost(int[][] costs) {
    int n = costs.length;
    int[][] dp = new int[n][3];
    dp[0] = costs[0].clone();
    for (int i = 1; i < n; i++) {
        dp[i][0] = costs[i][0] + Math.min(dp[i - 1][1], dp[i - 1][2]);
        dp[i][1] = costs[i][1] + Math.min(dp[i - 1][0], dp[i - 1][2]);
        dp[i][2] = costs[i][2] + Math.min(dp[i - 1][0], dp[i - 1][1]);
    }
    return Math.min(dp[n - 1][0], Math.min(dp[n - 1][1], dp[n - 1][2]));
}`,
      },
      {
        name: "Rolling three variables (optimal space)",
        intuition: "Keep only the previous house's three costs and overwrite them each step.",
        time: "O(n)",
        timeWhy: "One pass, constant work per house.",
        space: "O(1)",
        spaceWhy: "Just the three previous-color costs.",
        code: `int minCost(int[][] costs) {
    int r = costs[0][0], b = costs[0][1], g = costs[0][2];
    for (int i = 1; i < costs.length; i++) {
        int nr = costs[i][0] + Math.min(b, g);
        int nb = costs[i][1] + Math.min(r, g);
        int ng = costs[i][2] + Math.min(r, b);
        r = nr; b = nb; g = ng;
    }
    return Math.min(r, Math.min(b, g));
}`,
        walkthrough: [
          "costs=[[17,2,17],[16,16,5],[14,3,19]]. Start r=17,b=2,g=17.",
          "House 1: nr=16+min(2,17)=18, nb=16+min(17,17)=33, ng=5+min(17,2)=7 -> r=18,b=33,g=7.",
          "House 2: nr=14+min(33,7)=21, nb=3+min(18,7)=10, ng=19+min(18,33)=37 -> min(21,10,37)=10.",
        ],
      },
    ],
    edgeCases: [
      "Single house → just min of its three costs.",
      "Ties between colors don't matter — `min` resolves them safely.",
      "All houses identical costs → answer still respects the no-adjacent rule by alternating among the cheap two.",
    ],
    twists: [
      "**Paint House II (LeetCode 265)** → k colors instead of 3; track the smallest and second-smallest previous costs for O(n·k).",
      "**Paint Fence (LeetCode 276)** → count valid colorings rather than minimize cost.",
      "**Recover the coloring** → store which previous color was chosen and backtrack.",
    ],
    related: ["house-robber", "min-cost-climbing-stairs", "partition-array-for-maximum-sum"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "cherry-pickup-ii",
    title: "Cherry Pickup II",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1463,
    statement:
      "Given a `rows × cols` grid where `grid[r][c]` is the number of cherries, **two robots** start at the top corners (robot1 at `(0,0)`, robot2 at `(0,cols-1)`). Each moves down one row at a time to one of the three cells below-left / below / below-right. Cherries in a cell are collected once even if both robots land there. Return the **maximum cherries** both robots collect reaching the bottom row.",
    examples: [
      { in: "grid = [[3,1,1],[2,5,1],[1,5,5],[2,1,1]]", out: "24", note: "robot1 takes 3+2+5+2, robot2 takes 1+1+5+1" },
      { in: "grid = [[1,1],[1,1]]", out: "4" },
    ],
    constraints: ["rows == grid.length", "cols == grid[i].length", "2 ≤ rows, cols ≤ 70", "0 ≤ grid[i][j] ≤ 100"],
    recognize:
      "Two agents moving **in lockstep down the same rows** means the row index is shared — the only free variables are the two column positions. 'Best total over future rows from (col1, col2)' with overlap → **grid DP keyed on (row, col1, col2)**.",
    figureItOut: [
      "**State**: `dp[r][c1][c2]` = the maximum cherries collectable from row `r` to the bottom, given robot1 is in column `c1` and robot2 in column `c2` on row `r`. Both robots advance one row per step, so a single shared `r` indexes both.",
      "**Recurrence**: collect this row's cherries — `grid[r][c1] + grid[r][c2]` (but add `grid[r][c1]` only once if `c1 == c2`). Then each robot independently steps to `c±1` or `c`, giving 9 combinations; take the max child: `dp[r][c1][c2] = pick + max over (dc1,dc2 in {-1,0,1}) dp[r+1][c1+dc1][c2+dc2]`, skipping out-of-bounds columns.",
      "**Base case**: the last row collects only its own cells: `dp[rows-1][c1][c2] = pick`.",
      "**Fill**: process rows from the bottom up so `dp[r+1][...]` is ready when computing row `r`. The answer starts robot1 at column 0 and robot2 at column `cols-1`.",
      "The answer is `dp[0][0][cols-1]`.",
    ],
    approaches: [
      {
        name: "Memoized recursion on (row, c1, c2)",
        intuition: "Recurse down rows trying all 9 move pairs; memoize on the three indices.",
        time: "O(rows · cols² · 9)",
        timeWhy: "rows·cols² states, each evaluating 9 move combinations.",
        space: "O(rows · cols²)",
        spaceWhy: "The memo cube plus recursion depth = rows.",
        code: `Integer[][][] memo;
int cherryPickup(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    memo = new Integer[rows][cols][cols];
    return go(grid, 0, 0, cols - 1);
}
int go(int[][] g, int r, int c1, int c2) {
    int rows = g.length, cols = g[0].length;
    if (c1 < 0 || c1 >= cols || c2 < 0 || c2 >= cols) return Integer.MIN_VALUE;
    if (memo[r][c1][c2] != null) return memo[r][c1][c2];
    int pick = g[r][c1] + (c1 == c2 ? 0 : g[r][c2]);
    if (r == rows - 1) return memo[r][c1][c2] = pick;
    int best = Integer.MIN_VALUE;
    for (int d1 = -1; d1 <= 1; d1++) {
        for (int d2 = -1; d2 <= 1; d2++) {
            int sub = go(g, r + 1, c1 + d1, c2 + d2);
            if (sub != Integer.MIN_VALUE) best = Math.max(best, sub);
        }
    }
    return memo[r][c1][c2] = pick + best;
}`,
      },
      {
        name: "Bottom-up 3-D DP (optimal)",
        intuition: "Fill the dp cube from the last row upward; each cell maxes over 9 children.",
        time: "O(rows · cols² · 9)",
        timeWhy: "Same state count, constant 9-way transition each.",
        space: "O(cols²)",
        spaceWhy: "Only the next row's cols×cols layer is needed (rolling).",
        code: `int cherryPickup(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int[][] next = new int[cols][cols];
    for (int r = rows - 1; r >= 0; r--) {
        int[][] cur = new int[cols][cols];
        for (int c1 = 0; c1 < cols; c1++) {
            for (int c2 = 0; c2 < cols; c2++) {
                int pick = grid[r][c1] + (c1 == c2 ? 0 : grid[r][c2]);
                int best = 0;
                if (r < rows - 1) {
                    best = Integer.MIN_VALUE;
                    for (int d1 = -1; d1 <= 1; d1++) {
                        for (int d2 = -1; d2 <= 1; d2++) {
                            int n1 = c1 + d1, n2 = c2 + d2;
                            if (n1 >= 0 && n1 < cols && n2 >= 0 && n2 < cols) {
                                best = Math.max(best, next[n1][n2]);
                            }
                        }
                    }
                }
                cur[c1][c2] = pick + best;
            }
        }
        next = cur;
    }
    return next[0][cols - 1];
}`,
        walkthrough: [
          "grid=[[3,1,1],[2,5,1],[1,5,5],[2,1,1]]. Last row r=3 base: e.g. dp[3][0][2]=2+1=3.",
          "Row 2 (1,5,5): for c1=0,c2=2 pick=1+5=6, best child over moves into row3 picks dp[3][1][1]=5 -> 6+5=11; the optimal track keeps robots apart.",
          "Walking up, the best start dp[0][0][2] resolves to 24 (robot1 path 3+2+5+2=12, robot2 path 1+1+5+1=8 plus shared-cell handling -> 24).",
        ],
      },
    ],
    edgeCases: [
      "Robots on the same cell → count that cell's cherries only once (the `c1 == c2` guard).",
      "2-column grid → robots can swap sides but never both collect a single cell twice.",
      "All zeros → answer 0; the DP still runs correctly with `pick = 0`.",
    ],
    twists: [
      "**Cherry Pickup I (LeetCode 741)** → one robot goes down then back up; model as two robots both going down (same trick).",
      "**Robots may not cross** → add a `c1 < c2` constraint to prune states.",
      "**Three robots** → state becomes (row, c1, c2, c3) with 27-way transitions.",
    ],
    related: ["minimum-falling-path-sum", "unique-paths", "minimum-path-sum"],
  },

  {
    slug: "out-of-boundary-paths",
    title: "Out of Boundary Paths",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 576,
    statement:
      "A ball starts at `(startRow, startColumn)` on an `m × n` grid. Each move steps to an adjacent cell (up/down/left/right) and you may make **at most `maxMove` moves**. Return the **number of paths** that move the ball **off the grid boundary**, modulo 1e9+7.",
    examples: [
      { in: "m=2, n=2, maxMove=2, startRow=0, startColumn=0", out: "6" },
      { in: "m=1, n=3, maxMove=3, startRow=0, startColumn=1", out: "12" },
    ],
    constraints: ["1 ≤ m, n ≤ 50", "0 ≤ maxMove ≤ 50", "0 ≤ startRow < m", "0 ≤ startColumn < n"],
    recognize:
      "'**Count paths** with a bounded number of steps from a cell' is a DP over (moves left, position): each cell's count depends on its four neighbours with one fewer move. Overlapping subproblems across moves → **layered grid DP**.",
    figureItOut: [
      "**State**: `dp[k][r][c]` = the number of ways to fall off the boundary starting from cell `(r,c)` with exactly `k` moves remaining. Two spatial indices plus the move budget fully determine the future.",
      "**Recurrence**: from `(r,c)` you step to the 4 neighbours using one move. If a step lands **outside** the grid, that's one completed escape path (+1). If it stays inside, add `dp[k-1][nr][nc]`. So `dp[k][r][c] = Σ over 4 dirs ( outside ? 1 : dp[k-1][nr][nc] )`, all mod 1e9+7.",
      "**Base case**: `dp[0][r][c] = 0` for every interior cell — with no moves left you cannot escape.",
      "**Fill**: iterate `k` from 1 to `maxMove`; for each k compute every cell from the `k-1` layer. Only the previous layer is needed, so two m×n grids suffice.",
      "The answer is `dp[maxMove][startRow][startColumn]`.",
    ],
    approaches: [
      {
        name: "Memoized recursion on (moves, r, c)",
        intuition: "Recurse over remaining moves; an out-of-bounds step contributes 1, else recurse with one fewer move.",
        time: "O(maxMove · m · n)",
        timeWhy: "That many states, 4 constant transitions each.",
        space: "O(maxMove · m · n)",
        spaceWhy: "Memo cube plus recursion depth = maxMove.",
        code: `int MOD = 1_000_000_007;
Integer[][][] memo;
int findPaths(int m, int n, int maxMove, int startRow, int startColumn) {
    memo = new Integer[maxMove + 1][m][n];
    return go(m, n, maxMove, startRow, startColumn);
}
int go(int m, int n, int k, int r, int c) {
    if (r < 0 || c < 0 || r >= m || c >= n) return 1;   // escaped
    if (k == 0) return 0;
    if (memo[k][r][c] != null) return memo[k][r][c];
    long ways = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int[] d : dirs) {
        ways = (ways + go(m, n, k - 1, r + d[0], c + d[1])) % MOD;
    }
    return memo[k][r][c] = (int) ways;
}`,
      },
      {
        name: "Bottom-up layered DP (optimal)",
        intuition: "Build counts move by move; each cell sums its four neighbours from the previous layer, edges add escapes.",
        time: "O(maxMove · m · n)",
        timeWhy: "maxMove layers, each touching every cell with 4 transitions.",
        space: "O(m · n)",
        spaceWhy: "Two rolling m×n layers.",
        code: `int findPaths(int m, int n, int maxMove, int startRow, int startColumn) {
    int MOD = 1_000_000_007;
    long[][] dp = new long[m][n];      // 0 moves used: no escapes yet
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    int result = 0;
    for (int step = 1; step <= maxMove; step++) {
        long[][] next = new long[m][n];
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                for (int[] d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr < 0 || nc < 0 || nr >= m || nc >= n) {
                        next[r][c] = (next[r][c] + 1) % MOD;       // escape
                    } else {
                        next[r][c] = (next[r][c] + dp[nr][nc]) % MOD;
                    }
                }
            }
        }
        dp = next;
        result = (int) dp[startRow][startColumn];
    }
    return maxMove == 0 ? 0 : result;
}`,
        walkthrough: [
          "m=2,n=2,maxMove=2,start(0,0). Layer 1: from (0,0) two of four steps leave the grid (up and left) -> dp[0][0]=2 after 1 move; similarly every cell has exactly 2 escapes in 1 move.",
          "Layer 2 at (0,0): up+left escape (+2), down goes to (1,0) which had 2 one-move escapes (+2), right goes to (0,1) (+2) -> 2+2+2=6.",
          "Answer dp[0][0]=6.",
        ],
      },
    ],
    edgeCases: [
      "maxMove == 0 → 0 paths (the ball cannot move).",
      "Take the modulo on every addition — counts blow past int quickly with maxMove up to 50.",
      "1×1 grid → from the only cell all four steps escape, so 1 move gives 4.",
    ],
    twists: [
      "**Exactly maxMove moves** (not 'at most') → only count escapes that happen on the final step; trickier accounting.",
      "**Knight Probability in Chessboard (LeetCode 688)** → same layered DP but tracks probability of staying on the board.",
      "**Count paths that return to start** → change the target condition from out-of-bounds to a specific cell.",
    ],
    related: ["unique-paths", "number-of-dice-rolls-with-target-sum", "coin-change-ii"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "flood-fill",
    title: "Flood Fill",
    difficulty: "Easy",
    pattern: "graphs",
    leetcode: 733,
    statement:
      "Given an `image` grid of pixel colors, a start pixel `(sr, sc)`, and a `color`, perform a **flood fill**: recolor the start pixel and every 4-connected pixel sharing the start's original color, then their same-color neighbours, and so on. Return the modified image.",
    examples: [
      { in: "image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2", out: "[[2,2,2],[2,2,0],[2,0,1]]" },
      { in: "image=[[0,0,0],[0,0,0]], sr=0, sc=0, color=0", out: "[[0,0,0],[0,0,0]]", note: "new color equals old → no change" },
    ],
    constraints: ["1 ≤ m, n ≤ 50", "0 ≤ pixel values, color < 2¹⁶", "0 ≤ sr < m", "0 ≤ sc < n"],
    recognize:
      "Pixels are **nodes**, same-color adjacency are **edges**. 'Recolor the connected region of one color' is a textbook **grid DFS/BFS flood-fill** from the start pixel.",
    figureItOut: [
      "Capture the start pixel's **original color** first. Every pixel you recolor must match this original — once you start overwriting, you'd lose the test if you read the start color live.",
      "Guard the no-op trap: if the new `color` equals the original color, the fill would recolor a pixel to the same value and recurse forever (it never 'changes', so it keeps matching). Return immediately in that case.",
      "DFS/BFS from `(sr,sc)`: recolor the current pixel, then visit the four neighbours that are in-bounds and still hold the original color. Recoloring acts as the visited marker.",
      "When the traversal drains, the whole connected same-color region is recolored. Return the image.",
    ],
    approaches: [
      {
        name: "DFS flood-fill",
        intuition: "Recurse to the 4 neighbours while they match the original color; the recolor doubles as 'visited'.",
        time: "O(m·n)",
        timeWhy: "Each pixel is recolored at most once and inspected a constant number of times.",
        space: "O(m·n)",
        spaceWhy: "Recursion depth in the worst case of one giant region.",
        code: `int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int original = image[sr][sc];
    if (original == color) return image;
    dfs(image, sr, sc, original, color);
    return image;
}
void dfs(int[][] img, int r, int c, int original, int color) {
    if (r < 0 || c < 0 || r >= img.length || c >= img[0].length) return;
    if (img[r][c] != original) return;
    img[r][c] = color;
    dfs(img, r + 1, c, original, color);
    dfs(img, r - 1, c, original, color);
    dfs(img, r, c + 1, original, color);
    dfs(img, r, c - 1, original, color);
}`,
      },
      {
        name: "BFS flood-fill",
        intuition: "Spread outward from the start with a queue, recoloring matching neighbours.",
        time: "O(m·n)",
        timeWhy: "Each pixel enqueued at most once.",
        space: "O(m·n)",
        spaceWhy: "The queue can hold a constant fraction of the grid.",
        code: `int[][] floodFill(int[][] image, int sr, int sc, int color) {
    int original = image[sr][sc];
    if (original == color) return image;
    int m = image.length, n = image[0].length;
    Deque<int[]> queue = new ArrayDeque<>();
    queue.add(new int[]{sr, sc});
    image[sr][sc] = color;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        for (int[] d : dirs) {
            int nr = cell[0] + d[0], nc = cell[1] + d[1];
            if (nr >= 0 && nc >= 0 && nr < m && nc < n && image[nr][nc] == original) {
                image[nr][nc] = color;
                queue.add(new int[]{nr, nc});
            }
        }
    }
    return image;
}`,
        walkthrough: [
          "image=[[1,1,1],[1,1,0],[1,0,1]], start (1,1) original=1, color=2.",
          "Recolor (1,1); spread to (0,1),(1,0); from those reach (0,0),(0,2),(2,0). The lone 0s and the bottom-right 1 are disconnected from the region.",
          "Result [[2,2,2],[2,2,0],[2,0,1]].",
        ],
      },
    ],
    edgeCases: [
      "New color equals original → return unchanged (else infinite recursion).",
      "Start pixel isolated (no same-color neighbour) → only that pixel changes.",
      "Whole grid one color → every pixel recolored.",
    ],
    twists: [
      "**Number of Islands (LeetCode 200)** → count connected regions instead of recoloring one.",
      "**8-directional fill** → add the four diagonal neighbours.",
      "**Bucket fill with tolerance** → match colors within a threshold rather than exact equality.",
    ],
    related: ["number-of-islands", "max-area-of-island", "surrounded-regions"],
  },

  {
    slug: "01-matrix",
    title: "01 Matrix",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 542,
    statement:
      "Given an `m × n` binary matrix `mat`, return a matrix where each cell holds the **distance to the nearest `0`** (4-directional steps). Cells that are 0 have distance 0.",
    examples: [
      { in: "mat=[[0,0,0],[0,1,0],[0,0,0]]", out: "[[0,0,0],[0,1,0],[0,0,0]]" },
      { in: "mat=[[0,0,0],[0,1,0],[1,1,1]]", out: "[[0,0,0],[0,1,0],[1,2,1]]" },
    ],
    constraints: ["1 ≤ m, n ≤ 10⁴", "1 ≤ m·n ≤ 10⁴", "mat[i][j] is 0 or 1", "at least one 0 exists"],
    recognize:
      "Distance to the **nearest of many sources** in an unweighted grid → **multi-source BFS**: seed the queue with *all* the zeros at once and let the wavefront expand, stamping each cell with its layer.",
    figureItOut: [
      "The naive idea — BFS from each `1` to its nearest `0` — repeats work badly. Flip the source: BFS **from the zeros outward**. The first time the wavefront reaches a `1`, that's its nearest zero.",
      "Seed the queue with **every** zero cell (distance 0) and mark all ones as unvisited (e.g. distance −1 or a sentinel).",
      "Run standard BFS level by level. When you pop a cell, push its unvisited neighbours with `distance + 1`. Because all zeros entered at level 0 simultaneously, each cell is reached by its closest zero first.",
      "Marking distance as you enqueue (not when you pop) prevents a cell being queued twice. When the queue empties, every cell holds its minimum distance.",
    ],
    approaches: [
      {
        name: "Multi-source BFS from all zeros",
        intuition: "All zeros start the wavefront together; the first arrival at a 1 is its nearest-zero distance.",
        time: "O(m·n)",
        timeWhy: "Each cell is enqueued and processed exactly once.",
        space: "O(m·n)",
        spaceWhy: "The distance grid and the BFS queue.",
        code: `int[][] updateMatrix(int[][] mat) {
    int m = mat.length, n = mat[0].length;
    int[][] dist = new int[m][n];
    Deque<int[]> queue = new ArrayDeque<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (mat[r][c] == 0) {
                queue.add(new int[]{r, c});
            } else {
                dist[r][c] = -1;        // unvisited marker
            }
        }
    }
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    while (!queue.isEmpty()) {
        int[] cell = queue.poll();
        for (int[] d : dirs) {
            int nr = cell[0] + d[0], nc = cell[1] + d[1];
            if (nr >= 0 && nc >= 0 && nr < m && nc < n && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[cell[0]][cell[1]] + 1;
                queue.add(new int[]{nr, nc});
            }
        }
    }
    return dist;
}`,
        walkthrough: [
          "mat=[[0,0,0],[0,1,0],[1,1,1]]. Seed all zeros at distance 0; ones marked -1.",
          "Wave 1: (1,1) gets 1 from a zero neighbour; (2,0) and (2,2) get 1 from the zeros above? (2,0)'s up is (1,0)=0 -> dist 1; (2,2) up is (1,2)=0 -> dist 1.",
          "Wave 2: (2,1) reached from (1,1)? (1,1) now dist1 -> (2,1)=2. Result [[0,0,0],[0,1,0],[1,2,1]].",
        ],
      },
      {
        name: "Two-pass dynamic programming",
        intuition: "Distance to nearest zero comes from above/left in one pass and below/right in another.",
        time: "O(m·n)",
        timeWhy: "Two linear sweeps over the grid.",
        space: "O(1)",
        spaceWhy: "Updates the distance grid in place (beyond the output).",
        code: `int[][] updateMatrix(int[][] mat) {
    int m = mat.length, n = mat[0].length, BIG = 100000;
    int[][] dist = new int[m][n];
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (mat[r][c] == 0) { dist[r][c] = 0; continue; }
            int best = BIG;
            if (r > 0) best = Math.min(best, dist[r - 1][c] + 1);
            if (c > 0) best = Math.min(best, dist[r][c - 1] + 1);
            dist[r][c] = best;
        }
    }
    for (int r = m - 1; r >= 0; r--) {
        for (int c = n - 1; c >= 0; c--) {
            if (r < m - 1) dist[r][c] = Math.min(dist[r][c], dist[r + 1][c] + 1);
            if (c < n - 1) dist[r][c] = Math.min(dist[r][c], dist[r][c + 1] + 1);
        }
    }
    return dist;
}`,
      },
    ],
    edgeCases: [
      "All zeros → every distance 0.",
      "A single zero in a large field of ones → distances radiate outward as Manhattan distance.",
      "Mark unvisited as −1 (or a big sentinel in the DP version) so you never overwrite a smaller distance.",
    ],
    twists: [
      "**Walls and Gates (LeetCode 286)** → identical multi-source BFS from all gates.",
      "**As Far From Land as Possible (LeetCode 1162)** → BFS from all land cells, return the maximum distance.",
      "**Diagonal moves allowed** → switch to Chebyshev distance with 8 directions.",
    ],
    related: ["walls-and-gates", "rotting-oranges", "shortest-path-in-binary-matrix"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "path-with-maximum-probability",
    title: "Path with Maximum Probability",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1514,
    statement:
      "Given an undirected weighted graph of `n` nodes where edge `i` connects `a,b` with success probability `succProb[i]`, return the **maximum probability** of a path from `start` to `end` (the product of edge probabilities). Return `0` if no path exists.",
    examples: [
      { in: "n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.2], start=0, end=2", out: "0.25000", note: "0→1→2 = 0.5·0.5" },
      { in: "n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.3], start=0, end=2", out: "0.30000", note: "direct edge wins" },
      { in: "n=3, edges=[[0,1]], succProb=[0.5], start=0, end=2", out: "0.00000" },
    ],
    constraints: ["2 ≤ n ≤ 10⁴", "0 ≤ edges.length ≤ 2·10⁴", "0 ≤ succProb[i] ≤ 1"],
    recognize:
      "'**Maximize the product** of edge weights along a path' is Dijkstra's twin: weights in `(0,1]` multiply, so longer paths shrink — a **max-probability Dijkstra** using a max-heap and multiplication instead of a min-heap and addition.",
    figureItOut: [
      "Path cost here is a **product** of probabilities, and every factor is ≤ 1, so extending a path can only *lower* the product — exactly the monotonic structure Dijkstra exploits (additive costs only grow). Swap 'add and minimize' for 'multiply and maximize'.",
      "Keep `prob[node]` = the best probability found so far to reach `node`, initialized to 0 except `prob[start] = 1`. Use a **max-heap** ordered by probability so you always expand the most promising node first.",
      "Pop the node with the current highest probability. For each neighbour, the candidate probability is `prob[cur] · edgeProb`. If that beats the neighbour's recorded best, update it and push the neighbour.",
      "Because probabilities never increase along a path, the first time you pop `end` you have its maximum probability (the Dijkstra optimality argument carries over). If `end` is never reached, the answer stays 0.",
    ],
    approaches: [
      {
        name: "Bellman-Ford style relaxation (baseline)",
        intuition: "Relax all edges up to n−1 times, keeping the best product per node.",
        time: "O(n · E)",
        timeWhy: "Up to n−1 passes, each relaxing every edge.",
        space: "O(n + E)",
        spaceWhy: "The probability array and edge list.",
        code: `// Conceptual baseline: prob[start]=1; repeat n-1 times, for each edge (a,b,p)
// update prob[b]=max(prob[b], prob[a]*p) and prob[a]=max(prob[a], prob[b]*p).
// Correct but slower than the heap-based Dijkstra below.`,
      },
      {
        name: "Max-probability Dijkstra (optimal)",
        intuition: "A max-heap expands the highest-probability node first; multiply along edges.",
        time: "O(E log n)",
        timeWhy: "Each edge can trigger a heap push; heap operations cost log n.",
        space: "O(n + E)",
        spaceWhy: "Adjacency list, probability array, and the heap.",
        code: `double maxProbability(int n, int[][] edges, double[] succProb, int start, int end) {
    List<double[]>[] graph = new List[n];
    for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
    for (int i = 0; i < edges.length; i++) {
        int a = edges[i][0], b = edges[i][1];
        graph[a].add(new double[]{b, succProb[i]});
        graph[b].add(new double[]{a, succProb[i]});
    }
    double[] prob = new double[n];
    prob[start] = 1.0;
    PriorityQueue<double[]> heap = new PriorityQueue<>((x, y) -> Double.compare(y[1], x[1]));
    heap.add(new double[]{start, 1.0});
    while (!heap.isEmpty()) {
        double[] top = heap.poll();
        int node = (int) top[0];
        double p = top[1];
        if (node == end) return p;
        if (p < prob[node]) continue;             // stale entry
        for (double[] nb : graph[node]) {
            int next = (int) nb[0];
            double np = p * nb[1];
            if (np > prob[next]) {
                prob[next] = np;
                heap.add(new double[]{next, np});
            }
        }
    }
    return 0.0;
}`,
        walkthrough: [
          "n=3, edges 0-1=0.5, 1-2=0.5, 0-2=0.2, start 0 end 2. prob[0]=1, heap pops 0.",
          "Relax: prob[1]=0.5, prob[2]=0.2. Heap pops node1 (0.5): relax 1-2 -> 0.5*0.5=0.25 > 0.2 so prob[2]=0.25.",
          "Heap next pops node2 with 0.25 == prob[2] and node2==end -> return 0.25.",
        ],
      },
    ],
    edgeCases: [
      "No path from start to end → return 0.",
      "An edge with probability 0 → never improves any path; effectively ignored.",
      "Direct edge may beat a longer multi-hop path (second example) — the heap naturally prefers it.",
    ],
    twists: [
      "**Minimize a sum of weights instead** → ordinary Dijkstra with a min-heap and addition.",
      "**Work in log-space** → take −log of each probability and run a standard shortest-path to avoid floating-point underflow on long paths.",
      "**Count maximum-probability paths** → carry a count alongside the best probability.",
    ],
    related: ["network-delay-time", "cheapest-flights-within-k-stops", "path-with-minimum-effort"],
  },

  {
    slug: "connecting-cities-with-minimum-cost",
    title: "Connecting Cities With Minimum Cost",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1135,
    statement:
      "There are `n` cities labeled `1..n`. `connections[i] = [a, b, cost]` is a bidirectional road of the given cost. Return the **minimum total cost** to connect all cities so every pair is reachable, or `-1` if it's impossible.",
    examples: [
      { in: "n=3, connections=[[1,2,5],[1,3,6],[2,3,1]]", out: "6", note: "use edges (2,3,1) and (1,2,5)" },
      { in: "n=4, connections=[[1,2,3],[3,4,4]]", out: "-1", note: "two components can't be joined" },
    ],
    constraints: ["1 ≤ n ≤ 10⁴", "1 ≤ connections.length ≤ 10⁴", "1 ≤ cost ≤ 10⁵"],
    recognize:
      "'Connect every node at minimum total edge cost' is the textbook **Minimum Spanning Tree**. Kruskal (sort edges + union-find) or Prim both apply; impossibility = the graph is disconnected after the MST.",
    figureItOut: [
      "A spanning structure connecting all `n` cities with the least cost and no redundant edges is exactly a **Minimum Spanning Tree**. An MST on n nodes has exactly `n-1` edges.",
      "Kruskal's greedy: sort all roads by cost ascending, then add each road only if its two cities are **not already connected** (checked with union-find). Adding an edge inside one component would create a cycle and waste cost.",
      "Maintain a Disjoint Set Union. For each sorted edge, if `find(a) != find(b)`, union them and add the cost; otherwise skip. Stop early once you've added `n-1` edges.",
      "If after processing all edges fewer than `n-1` were added, some cities remain in separate components → return −1. Otherwise return the accumulated cost.",
    ],
    approaches: [
      {
        name: "Kruskal's MST with union-find (optimal)",
        intuition: "Greedily take the cheapest edge that joins two disconnected components.",
        time: "O(E log E)",
        timeWhy: "Dominated by sorting the edges; union-find ops are near-constant (inverse Ackermann).",
        space: "O(n)",
        spaceWhy: "The DSU parent/rank arrays.",
        code: `int[] parent, rank_;
int minimumCost(int n, int[][] connections) {
    parent = new int[n + 1];
    rank_ = new int[n + 1];
    for (int i = 1; i <= n; i++) parent[i] = i;
    Arrays.sort(connections, (a, b) -> a[2] - b[2]);
    int total = 0, used = 0;
    for (int[] e : connections) {
        if (union(e[0], e[1])) {
            total += e[2];
            used++;
            if (used == n - 1) break;
        }
    }
    return used == n - 1 ? total : -1;
}
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];   // path compression
        x = parent[x];
    }
    return x;
}
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;          // already connected
    if (rank_[ra] < rank_[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rank_[ra] == rank_[rb]) rank_[ra]++;
    return true;
}`,
        walkthrough: [
          "n=3, edges sorted by cost: (2,3,1),(1,2,5),(1,3,6).",
          "Take (2,3,1): union -> total=1, used=1. Take (1,2,5): 1 and 2 in different sets -> total=6, used=2 == n-1, stop.",
          "Skip (1,3,6) entirely. Answer 6.",
        ],
      },
      {
        name: "Prim's MST with a min-heap",
        intuition: "Grow the tree from any city, always adding the cheapest edge to an unseen city.",
        time: "O(E log V)",
        timeWhy: "Each edge can be pushed once; heap pops cost log V.",
        space: "O(n + E)",
        spaceWhy: "Adjacency list, visited set, and the heap.",
        code: `int minimumCost(int n, int[][] connections) {
    List<int[]>[] graph = new List[n + 1];
    for (int i = 1; i <= n; i++) graph[i] = new ArrayList<>();
    for (int[] e : connections) {
        graph[e[0]].add(new int[]{e[1], e[2]});
        graph[e[1]].add(new int[]{e[0], e[2]});
    }
    boolean[] seen = new boolean[n + 1];
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    heap.add(new int[]{1, 0});
    int total = 0, count = 0;
    while (!heap.isEmpty() && count < n) {
        int[] top = heap.poll();
        int city = top[0], cost = top[1];
        if (seen[city]) continue;
        seen[city] = true;
        total += cost;
        count++;
        for (int[] nb : graph[city]) {
            if (!seen[nb[0]]) heap.add(new int[]{nb[0], nb[1]});
        }
    }
    return count == n ? total : -1;
}`,
      },
    ],
    edgeCases: [
      "n == 1 → already connected, cost 0 (no edges needed).",
      "Graph disconnected → fewer than n−1 edges usable → −1.",
      "Parallel edges between the same pair → union-find skips the redundant (more expensive) one automatically.",
    ],
    twists: [
      "**Min Cost to Connect All Points (LeetCode 1584)** → same MST but edges are implied by Manhattan distances between points.",
      "**Maximum spanning tree** → sort edges descending.",
      "**Critical/pseudo-critical edges (LeetCode 1489)** → analyze which edges must or may appear in some MST.",
    ],
    related: ["min-cost-to-connect-all-points", "graph-valid-tree", "redundant-connection"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "assign-cookies",
    title: "Assign Cookies",
    difficulty: "Easy",
    pattern: "greedy",
    leetcode: 455,
    statement:
      "Each child `i` has a greed factor `g[i]` (the minimum cookie size that satisfies them) and each cookie `j` has size `s[j]`. A cookie satisfies a child if `s[j] >= g[i]`, and each cookie serves at most one child. Return the **maximum number of content children**.",
    examples: [
      { in: "g=[1,2,3], s=[1,1]", out: "1", note: "only the child with greed 1 can be satisfied" },
      { in: "g=[1,2], s=[1,2,3]", out: "2" },
    ],
    constraints: ["1 ≤ g.length ≤ 3·10⁴", "0 ≤ s.length ≤ 3·10⁴", "1 ≤ g[i], s[j] ≤ 2³¹−1"],
    recognize:
      "Match limited resources (cookies) to demands (children) to maximize satisfied demands → **sort-then-greedy two-pointer**: give the smallest sufficient cookie to the least greedy child so big cookies stay available for greedier kids.",
    figureItOut: [
      "To satisfy the most children, you never want to 'waste' a big cookie on a child a small one could have satisfied. So sort both greed factors and cookie sizes ascending.",
      "Walk both with two pointers. For the **least greedy unsatisfied child**, hand them the **smallest cookie that fits**. If the current cookie is too small, it can't satisfy anyone greedier either — discard it and advance the cookie pointer.",
      "When a cookie satisfies the current child, advance both pointers (that child is content, that cookie is used) and increment the count.",
      "Stop when either list is exhausted. The greedy exchange argument guarantees this maximizes satisfied children: swapping in the smallest sufficient cookie never reduces future options.",
    ],
    approaches: [
      {
        name: "Sort both, two-pointer greedy (optimal)",
        intuition: "Smallest cookie to least greedy child it can satisfy; skip cookies too small for the current child.",
        time: "O(n log n + m log m)",
        timeWhy: "Dominated by sorting the two arrays; the merge walk is linear.",
        space: "O(1)",
        spaceWhy: "Sorts in place; only two pointers and a counter.",
        code: `int findContentChildren(int[] g, int[] s) {
    Arrays.sort(g);
    Arrays.sort(s);
    int child = 0, cookie = 0;
    while (child < g.length && cookie < s.length) {
        if (s[cookie] >= g[child]) {
            child++;            // this child is satisfied
        }
        cookie++;               // cookie consumed or too small either way
    }
    return child;
}`,
        walkthrough: [
          "g=[1,2,3] sorted, s=[1,1] sorted. cookie0=1 >= g0=1 -> satisfy child0, child=1, cookie=1.",
          "cookie1=1 < g1=2 -> discard, cookie=2 (out of cookies).",
          "Satisfied children = 1.",
        ],
      },
    ],
    edgeCases: [
      "No cookies → 0 satisfied.",
      "All cookies smaller than the least greedy child → 0.",
      "More cookies than children → leftover cookies are simply unused once every child is content.",
    ],
    twists: [
      "**Each child can take multiple cookies summing to their greed** → becomes a different allocation problem.",
      "**Minimize wasted cookie size** → still greedy but track leftover sizes.",
      "**Maximize total satisfied greed instead of count** → changes the objective and the matching.",
    ],
    related: ["boats-to-save-people", "maximum-units-on-a-truck", "two-city-scheduling"],
  },

  {
    slug: "minimum-number-of-refueling-stops",
    title: "Minimum Number of Refueling Stops",
    difficulty: "Hard",
    pattern: "greedy",
    leetcode: 871,
    statement:
      "A car starts with `startFuel` units and must reach a target `target` miles away (1 mile costs 1 unit). `stations[i] = [position, fuel]` is a gas station at `position` miles offering `fuel` units. Return the **minimum number of refueling stops** to reach the target, or `-1` if impossible.",
    examples: [
      { in: "target=100, startFuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]", out: "2", note: "fill at mile 10 and mile 60" },
      { in: "target=1, startFuel=1, stations=[]", out: "0" },
      { in: "target=100, startFuel=1, stations=[[10,100]]", out: "-1", note: "can't even reach the first station" },
    ],
    constraints: ["1 ≤ target, startFuel ≤ 10⁹", "0 ≤ stations.length ≤ 500", "stations sorted by position"],
    recognize:
      "'Fewest refuels to reach a distance, choosing which passed stations to use' is a **greedy max-heap** problem: defer the decision — drive as far as possible, and when you run dry, retroactively 'use' the **largest fuel** among stations you've already passed.",
    figureItOut: [
      "You don't have to decide at each station whether to stop — you can decide **later**. Drive forward; every station you pass goes into a 'fuel I could have taken' pool (a max-heap).",
      "Whenever your current range can't reach the next station (or the target), you must refuel. Greedily pop the **largest available fuel** from the heap and add it — the biggest tank extends your reach the most per stop, minimizing the number of stops.",
      "If you need to refuel but the heap is empty, you're stranded before the next point → return −1.",
      "Process points in order (each station's position, then the target). Each time you cross a point you can reach, push its fuel; each time you can't, pop the max until you can or fail. Count the pops.",
    ],
    approaches: [
      {
        name: "Greedy max-heap of passed stations (optimal)",
        intuition: "Bank every passed station's fuel; when out of range, retroactively take the biggest tank.",
        time: "O(n log n)",
        timeWhy: "Each station pushed and popped at most once from the heap.",
        space: "O(n)",
        spaceWhy: "The max-heap can hold all stations.",
        code: `int minRefuelStops(int target, int startFuel, int[][] stations) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    int fuel = startFuel, stops = 0, i = 0, n = stations.length;
    while (fuel < target) {
        // bank every station now within reach
        while (i < n && stations[i][0] <= fuel) {
            heap.add(stations[i][1]);
            i++;
        }
        if (heap.isEmpty()) return -1;     // can't extend range
        fuel += heap.poll();               // use the biggest passed tank
        stops++;
    }
    return stops;
}`,
        walkthrough: [
          "target=100, startFuel=10. fuel=10 < 100. Bank stations at pos<=10: [10,60] -> heap{60}.",
          "Pop 60 -> fuel=70, stops=1. Bank pos<=70: [20,30],[30,30],[60,40] -> heap{40,30,30}. Pop 40 -> fuel=110, stops=2.",
          "fuel=110 >= 100 -> return 2.",
        ],
      },
      {
        name: "DP over stops (alternative)",
        intuition: "dp[t] = farthest distance reachable using t refuels; relax each station into it.",
        time: "O(n²)",
        timeWhy: "For each station, update all stop-counts from high to low.",
        space: "O(n)",
        spaceWhy: "The dp array sized to the station count.",
        code: `int minRefuelStops(int target, int startFuel, int[][] stations) {
    int n = stations.length;
    long[] dp = new long[n + 1];          // dp[t] = farthest distance with t stops
    dp[0] = startFuel;
    for (int i = 0; i < n; i++) {
        for (int t = i; t >= 0; t--) {
            if (dp[t] >= stations[i][0]) {
                dp[t + 1] = Math.max(dp[t + 1], dp[t] + stations[i][1]);
            }
        }
    }
    for (int t = 0; t <= n; t++) {
        if (dp[t] >= target) return t;
    }
    return -1;
}`,
      },
    ],
    edgeCases: [
      "startFuel ≥ target → 0 stops.",
      "Can't reach the first station → −1 (heap empty when out of range).",
      "Distances up to 10⁹ with up to 500 stations → cumulative fuel fits in long; using int sums can overflow in the DP version.",
    ],
    twists: [
      "**Each station usable multiple times** → no longer a simple heap; positions would repeat.",
      "**Minimize total fuel bought instead of stops** → different objective, not max-heap greedy.",
      "**Jump Game II analogy** → 'fewest jumps to reach the end' is the same defer-and-extend idea on an array.",
    ],
    related: ["jump-game-ii", "ipo", "task-scheduler"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "combination-sum-iii",
    title: "Combination Sum III",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 216,
    statement:
      "Find all combinations of **`k` distinct numbers from `1..9`** that sum to `n`. Each number is used at most once and each combination must be unique. Return the list of all valid combinations.",
    examples: [
      { in: "k=3, n=7", out: "[[1,2,4]]" },
      { in: "k=3, n=9", out: "[[1,2,6],[1,3,5],[2,3,4]]" },
      { in: "k=4, n=1", out: "[]", note: "impossible" },
    ],
    constraints: ["2 ≤ k ≤ 9", "1 ≤ n ≤ 60"],
    recognize:
      "'Choose a fixed-size subset of a small fixed universe summing to a target, no reuse, no duplicates' is classic **subset backtracking** with a moving start index — pick increasing numbers so each combination is generated exactly once.",
    figureItOut: [
      "Build combinations by choosing numbers in **strictly increasing order** from `1..9`. Passing a `start` index that always moves forward guarantees you never reuse a digit and never produce the same set in a different order.",
      "Track two running quantities: how many numbers are still needed (`k` remaining) and how much sum is still needed (`remaining`). The base success case is `k == 0 && remaining == 0` → record a copy of the path.",
      "At each level, try each candidate `num` from `start` to 9, append it, recurse with `k-1` and `remaining-num` and `start = num+1`, then pop it (backtrack).",
      "Prune hard: if `num > remaining` you can stop the loop (numbers only grow); and you can bound the loop's upper end so enough numbers remain to fill `k` slots. These cuts shrink the tiny search tree further.",
    ],
    approaches: [
      {
        name: "Backtracking with increasing start index (optimal)",
        intuition: "Pick increasing digits; recurse decrementing count and target; record when both hit zero.",
        time: "O(C(9,k) · k)",
        timeWhy: "At most C(9,k) combinations explored, each costing O(k) to copy.",
        space: "O(k)",
        spaceWhy: "Recursion depth and the current path are bounded by k (output excluded).",
        code: `List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(k, n, 1, new ArrayList<>(), res);
    return res;
}
void backtrack(int k, int remaining, int start, List<Integer> path, List<List<Integer>> res) {
    if (k == 0 && remaining == 0) {
        res.add(new ArrayList<>(path));
        return;
    }
    if (k == 0 || remaining <= 0) return;
    for (int num = start; num <= 9; num++) {
        if (num > remaining) break;          // larger numbers only overshoot
        path.add(num);
        backtrack(k - 1, remaining - num, num + 1, path, res);
        path.remove(path.size() - 1);        // backtrack
    }
}`,
        walkthrough: [
          "k=3, n=9. Start path []. Pick 1 -> need 2 more summing to 8 from {2..9}.",
          "From 1: pick 2 -> need 1 from {3..} summing 6 -> pick 6 gives [1,2,6]; pick 3 -> need 5 -> [1,3,5].",
          "Back up, pick 2 first -> [2,3,4]. Result [[1,2,6],[1,3,5],[2,3,4]].",
        ],
      },
    ],
    edgeCases: [
      "n larger than 9+8+...+(10−k) → no combination can reach it → empty list.",
      "n smaller than 1+2+...+k → impossible → empty list.",
      "Recording a **copy** of `path` is essential; the live list keeps mutating.",
    ],
    twists: [
      "**Combination Sum (LeetCode 39)** → numbers reusable and no fixed count; recurse with `start = num`.",
      "**Combination Sum II (LeetCode 40)** → duplicates in the candidate array; skip equal siblings.",
      "**Count only** → return an int and prune without building lists.",
    ],
    related: ["combination-sum", "combination-sum-ii", "combinations"],
  },

  {
    slug: "sudoku-solver",
    title: "Sudoku Solver",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 37,
    statement:
      "Given a partially filled `9 × 9` Sudoku board (empty cells are `.`), **fill every empty cell** so each row, each column, and each of the nine 3×3 boxes contains the digits `1..9` exactly once. A unique solution is guaranteed; modify the board in place.",
    examples: [
      { in: "a valid partial board", out: "the same board with all empties filled per Sudoku rules" },
      { in: "board[0] = \"53..7....\" ...", out: "board[0] = \"534678912\" ..." },
    ],
    constraints: ["board is 9×9", "cells contain '1'..'9' or '.'", "the given board is valid and has exactly one solution"],
    recognize:
      "'Fill cells under row/column/box constraints, undoing on conflict' is **constraint-satisfaction backtracking**: try a digit, recurse, and revert if it leads to a dead end. Fast validity checks make the exponential search practical.",
    figureItOut: [
      "Scan for the next empty cell. For it, try each digit `1..9` that doesn't already appear in its row, its column, or its 3×3 box. Place a valid digit, then recurse to fill the rest.",
      "If the recursion succeeds (board completely filled), propagate success up. If no digit works at this cell, **undo** the placement (reset to `.`) and backtrack — an earlier choice was wrong.",
      "The validity test is the core: for candidate digit `d` at `(r,c)`, check row `r`, column `c`, and the box anchored at `(r/3*3, c/3*3)` contain no `d`.",
      "When the scan finds no empty cell, every cell is filled consistently → the board is solved; return true to stop. Solving in place means the board is mutated directly.",
    ],
    approaches: [
      {
        name: "Backtracking with per-placement validity check",
        intuition: "Fill the first empty cell with any non-conflicting digit; recurse; revert on failure.",
        time: "O(9^(empties))",
        timeWhy: "Each empty cell branches up to 9 ways; constraints prune the real tree far below this bound.",
        space: "O(empties)",
        spaceWhy: "Recursion depth equals the number of empty cells.",
        code: `void solveSudoku(char[][] board) {
    solve(board);
}
boolean solve(char[][] board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] == '.') {
                for (char d = '1'; d <= '9'; d++) {
                    if (isValid(board, r, c, d)) {
                        board[r][c] = d;
                        if (solve(board)) return true;
                        board[r][c] = '.';     // backtrack
                    }
                }
                return false;                  // no digit fits here
            }
        }
    }
    return true;                               // no empty cell left
}
boolean isValid(char[][] board, int r, int c, char d) {
    int br = (r / 3) * 3, bc = (c / 3) * 3;
    for (int i = 0; i < 9; i++) {
        if (board[r][i] == d) return false;
        if (board[i][c] == d) return false;
        if (board[br + i / 3][bc + i % 3] == d) return false;
    }
    return true;
}`,
        walkthrough: [
          "Find the first '.', say (0,2). Try '1': valid? check row 0, col 2, top-left box -> place if no clash.",
          "Recurse to the next empty cell. If some later cell has no legal digit, unwind: reset cells back to '.' and try the next digit at the earlier cell.",
          "When the scan finds no '.', every constraint holds -> return true and the filled board stands.",
        ],
      },
    ],
    edgeCases: [
      "Board already nearly full → the search finishes almost immediately.",
      "Resetting a cell to '.' on failure is mandatory; forgetting it corrupts the board for sibling branches.",
      "A unique solution is guaranteed, so the first complete fill is the answer — return true to stop searching.",
    ],
    twists: [
      "**Track candidates with bitmasks** → keep a row/col/box bitmask of used digits for O(1) validity instead of scanning 27 cells.",
      "**Most-constrained-cell heuristic** → fill the empty cell with the fewest candidates first to prune harder.",
      "**Validate a board (LeetCode 36)** → just check consistency without solving.",
    ],
    related: ["word-search", "n-queens", "valid-sudoku"],
  },
];
