// NeetCode All — wave 8c (dp, graphs, greedy, backtracking, intervals). Java.
export const WAVE8C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "triangle",
    title: "Triangle",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 120,
    statement:
      "Given a `triangle` (a list of rows where row i has i+1 numbers), return the **minimum path sum from top to bottom**. From index `j` in a row you may step only to index `j` or `j+1` in the row below.",
    examples: [
      { in: "triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]", out: "11", note: "2→3→5→1" },
      { in: "triangle = [[-10]]", out: "-10" },
    ],
    constraints: ["1 ≤ triangle.length ≤ 200", "triangle[i].length == i+1", "−10⁴ ≤ triangle[i][j] ≤ 10⁴"],
    recognize:
      "Each cell's best answer depends only on the **two cells reachable below it**. 'Min cost to reach the bottom from here' with overlapping subproblems → **DP**, and because a cell only needs the row below, it collapses to a single 1-D rolling array.",
    figureItOut: [
      "**State**: let `dp[j]` be the minimum path sum from cell `(row, j)` down to the bottom. Anchor it to the bottom so the recurrence flows upward and each cell has exactly the two children it can reach.",
      "**Recurrence**: from `(row, j)` you can step to `(row+1, j)` or `(row+1, j+1)`, so `dp[j] = triangle[row][j] + min(dp[j], dp[j+1])` — you pay the current cell, then take the cheaper child.",
      "**Base case**: the bottom row's best path sum is just the cell itself: `dp[j] = triangle[last][j]`.",
      "**Fill**: start `dp` from the bottom row, then process rows upward (last−1 down to 0). Updating `dp[j]` in place left-to-right is safe because `dp[j]` and `dp[j+1]` are still 'below' values when you read them.",
      "The answer is `dp[0]` — the best path starting at the apex.",
    ],
    approaches: [
      {
        name: "Top-down recursion (baseline)",
        intuition: "From each cell recurse into both children and take the min; without memo it re-explores shared cells exponentially.",
        time: "O(2ⁿ)",
        timeWhy: "Each cell branches into two; the recursion tree doubles every row without caching.",
        space: "O(n)",
        spaceWhy: "Recursion depth equals the number of rows.",
        code: `int minimumTotal(List<List<Integer>> triangle) {
    return go(triangle, 0, 0);
}
int go(List<List<Integer>> t, int row, int j) {
    if (row == t.size()) return 0;
    int down = go(t, row + 1, j);
    int diag = go(t, row + 1, j + 1);
    return t.get(row).get(j) + Math.min(down, diag);
}`,
      },
      {
        name: "Bottom-up rolling 1-D DP (optimal)",
        intuition: "Start from the bottom row and fold each row into the one above, overwriting a single array.",
        time: "O(n²)",
        timeWhy: "There are about n²/2 cells and each is processed once with O(1) work.",
        space: "O(n)",
        spaceWhy: "One array sized to the bottom row; reused for every row above.",
        code: `int minimumTotal(List<List<Integer>> triangle) {
    int n = triangle.size();
    int[] dp = new int[n + 1];                 // dp[j] = best sum from (row, j) downward
    for (int row = n - 1; row >= 0; row--) {
        for (int j = 0; j <= row; j++) {
            dp[j] = triangle.get(row).get(j) + Math.min(dp[j], dp[j + 1]);
        }
    }
    return dp[0];
}`,
        walkthrough: [
          "Bottom row [4,1,8,3] → dp = [4,1,8,3,0].",
          "Row [6,5,7]: dp[0]=6+min(4,1)=7, dp[1]=5+min(1,8)=6, dp[2]=7+min(8,3)=10 → dp=[7,6,10,...].",
          "Row [3,4]: dp[0]=3+min(7,6)=9, dp[1]=4+min(6,10)=10. Row [2]: dp[0]=2+min(9,10)=11 → 11.",
        ],
      },
    ],
    edgeCases: [
      "Single-cell triangle → answer is that cell (handles negatives like −10).",
      "All negative numbers → the min path can be negative; `min` still picks correctly.",
      "Initializing `dp` one slot longer than the bottom row lets `dp[j+1]` read a harmless 0 at the right edge.",
    ],
    twists: [
      "**O(1) extra space** → mutate the triangle rows in place instead of a separate array.",
      "**Maximum path sum** → swap `Math.min` for `Math.max`.",
      "**Count minimum paths** → carry a second array counting how many ways achieve `dp[j]`.",
    ],
    related: ["minimum-falling-path-sum", "minimum-path-sum"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "minimum-falling-path-sum",
    title: "Minimum Falling Path Sum",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 931,
    statement:
      "Given an `n × n` integer matrix, return the **minimum sum of a falling path**. A falling path starts at any cell in the top row and each step moves to the cell directly below, below-left, or below-right.",
    examples: [
      { in: "matrix = [[2,1,3],[6,5,4],[7,8,9]]", out: "13", note: "1→5→7 or 1→4→8" },
      { in: "matrix = [[-19,57],[-40,-5]]", out: "-59" },
    ],
    constraints: ["n == matrix.length == matrix[i].length", "1 ≤ n ≤ 100", "−100 ≤ matrix[i][j] ≤ 100"],
    recognize:
      "Like *Triangle* but on a full grid with **three** downward neighbours and any top cell as a start. 'Min cost to reach a cell from the top' with overlapping subproblems → **grid DP** that reduces to one rolling row.",
    figureItOut: [
      "**State**: `dp[i][j]` = the minimum falling-path sum that **ends** at cell `(i, j)`. Anchoring at the end (top→down) lets the answer be the min over the last row.",
      "**Recurrence**: a path reaching `(i, j)` came from one of three cells above — `(i−1, j−1)`, `(i−1, j)`, `(i−1, j+1)` — so `dp[i][j] = matrix[i][j] + min(those three)`, ignoring out-of-bounds diagonals.",
      "**Base case**: the top row pays only its own value: `dp[0][j] = matrix[0][j]`.",
      "**Fill**: process rows top to bottom; within each row compute every column from the previous row's values. Keep only the previous row (a 1-D array) since row i depends solely on row i−1.",
      "The answer is the **minimum value in the last row** of `dp`.",
    ],
    approaches: [
      {
        name: "Full 2-D table",
        intuition: "Fill an n×n dp grid row by row, each cell taking the min of its three parents.",
        time: "O(n²)",
        timeWhy: "Every one of the n² cells does O(1) work (three comparisons).",
        space: "O(n²)",
        spaceWhy: "Stores the whole dp grid.",
        code: `int minFallingPathSum(int[][] m) {
    int n = m.length;
    int[][] dp = new int[n][n];
    for (int j = 0; j < n; j++) dp[0][j] = m[0][j];
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int best = dp[i - 1][j];
            if (j > 0)     best = Math.min(best, dp[i - 1][j - 1]);
            if (j < n - 1) best = Math.min(best, dp[i - 1][j + 1]);
            dp[i][j] = m[i][j] + best;
        }
    }
    int ans = Integer.MAX_VALUE;
    for (int j = 0; j < n; j++) ans = Math.min(ans, dp[n - 1][j]);
    return ans;
}`,
      },
      {
        name: "Rolling 1-D row (optimal space)",
        intuition: "Keep only the previous row; build the next row from a snapshot of it.",
        time: "O(n²)",
        timeWhy: "Same n² cells, O(1) each.",
        space: "O(n)",
        spaceWhy: "Two single-row arrays of length n.",
        code: `int minFallingPathSum(int[][] m) {
    int n = m.length;
    int[] prev = m[0].clone();
    for (int i = 1; i < n; i++) {
        int[] cur = new int[n];
        for (int j = 0; j < n; j++) {
            int best = prev[j];
            if (j > 0)     best = Math.min(best, prev[j - 1]);
            if (j < n - 1) best = Math.min(best, prev[j + 1]);
            cur[j] = m[i][j] + best;
        }
        prev = cur;
    }
    int ans = Integer.MAX_VALUE;
    for (int v : prev) ans = Math.min(ans, v);
    return ans;
}`,
        walkthrough: [
          "prev = [2,1,3]. Row 1 [6,5,4]: cur[0]=6+min(2,1)=7, cur[1]=5+min(2,1,3)=6, cur[2]=4+min(1,3)=5 → [7,6,5].",
          "Row 2 [7,8,9]: cur[0]=7+min(7,6)=13, cur[1]=8+min(7,6,5)=13, cur[2]=9+min(6,5)=14 → [13,13,14].",
          "Min of last row = 13.",
        ],
      },
    ],
    edgeCases: [
      "1×1 matrix → answer is the single cell.",
      "Negative values → the min path may be negative; comparisons still hold.",
      "Edge columns have only two valid parents — the bounds checks skip the missing diagonal.",
    ],
    twists: [
      "**Maximum falling path** → flip min to max.",
      "**Non-adjacent columns each row** (LeetCode 1289) → must avoid the same column; track the two smallest of the previous row.",
      "**Recover the path** → store a parent pointer per cell and backtrack from the best last-row cell.",
    ],
    related: ["triangle", "minimum-path-sum"],
  },

  {
    slug: "count-square-submatrices-with-all-ones",
    title: "Count Square Submatrices with All Ones",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1277,
    statement:
      "Given an `m × n` binary matrix, return the **total number of square submatrices that contain only 1s** (squares of every size, counted at every position).",
    examples: [
      { in: "matrix = [[0,1,1,1],[1,1,1,1],[0,1,1,1]]", out: "15", note: "10 of size 1, 4 of size 2, 1 of size 3" },
      { in: "matrix = [[1,0,1],[1,1,0],[1,1,0]]", out: "7" },
    ],
    constraints: ["1 ≤ m, n ≤ 300", "matrix[i][j] is 0 or 1"],
    recognize:
      "Same engine as *Maximal Square*: the largest all-ones square ending at a cell depends on its top, left, and top-left neighbours. Here that same `dp` value is **also the count** of squares ending at the cell, so summing it counts everything.",
    figureItOut: [
      "**State**: `dp[i][j]` = the side length of the **largest all-ones square whose bottom-right corner is `(i, j)`**. The key insight: a cell that supports a square of side `k` also supports squares of sides `1..k` all ending there — so `dp[i][j]` equals the **number of squares ending at `(i, j)`**.",
      "**Recurrence**: if `matrix[i][j] == 1`, then `dp[i][j] = 1 + min(dp[i−1][j], dp[i][j−1], dp[i−1][j−1])` — a square here can only be as big as the smallest square the three neighbours support. If the cell is 0, `dp[i][j] = 0`.",
      "**Base case**: the first row and first column copy the matrix value (a 1 there can only anchor a 1×1 square).",
      "**Fill**: sweep rows top-to-bottom, columns left-to-right (neighbours are already computed). Accumulate `total += dp[i][j]` as you go.",
      "The answer is the running `total` of every cell's `dp` value.",
    ],
    approaches: [
      {
        name: "Brute force — expand each square",
        intuition: "For every cell try every square size and verify all cells are 1.",
        time: "O(m·n·min(m,n)²)",
        timeWhy: "For each of m·n corners you test up to min(m,n) sizes, each needing O(size²) checks.",
        space: "O(1)",
        spaceWhy: "Only counters.",
        code: `// Conceptual baseline — far too slow for 300x300.
// for each (i,j): for size in 1..: verify the size x size block is all ones; count if so.`,
      },
      {
        name: "DP (largest-square-ending-here, summed) — optimal",
        intuition: "Each cell's largest-square side equals the count of squares ending there; sum them.",
        time: "O(m·n)",
        timeWhy: "One pass over the grid, O(1) per cell.",
        space: "O(m·n)",
        spaceWhy: "A dp grid; reducible to O(n) with a rolling row.",
        code: `int countSquares(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length, total = 0;
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == 0) {
                dp[i][j] = 0;
            } else if (i == 0 || j == 0) {
                dp[i][j] = 1;
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j],
                              Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
            }
            total += dp[i][j];
        }
    }
    return total;
}`,
        walkthrough: [
          "Row 0 of [[0,1,1,1],[1,1,1,1],[0,1,1,1]]: dp=[0,1,1,1], row sum = 3.",
          "Row 1 [1,1,1,1]: dp=[1, 1+min(1,1,0)=1, 1+min(1,1,1)=2, 1+min(1,2,1)=2] = [1,1,2,2], row sum = 6.",
          "Row 2 [0,1,1,1]: dp=[0, 1, 1+min(2,1,1)=2, 1+min(2,2,2)=3] = [0,1,2,3], row sum = 6. Total = 3+6+6 = 15.",
        ],
      },
    ],
    edgeCases: [
      "All zeros → 0 squares.",
      "All ones → every size contributes; the dp grows toward min(m,n) in the interior.",
      "Single row or column → only 1×1 squares, so the count equals the number of 1s.",
    ],
    twists: [
      "**Maximal Square (LeetCode 221)** → same dp, but take the max side and return its area.",
      "**Count rectangles of all ones** → a harder histogram/monotonic-stack problem, not this dp.",
      "**O(n) space** → keep just the previous row plus the diagonal value.",
    ],
    related: ["maximal-square", "maximal-rectangle"],
  },

  {
    slug: "number-of-dice-rolls-with-target-sum",
    title: "Number of Dice Rolls With Target Sum",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1155,
    statement:
      "You roll `n` dice, each with `k` faces numbered `1..k`. Return the **number of ways** to roll them so the face values sum to `target`, modulo 1e9+7.",
    examples: [
      { in: "n = 1, k = 6, target = 3", out: "1" },
      { in: "n = 2, k = 6, target = 7", out: "6" },
      { in: "n = 30, k = 30, target = 500", out: "222616187", note: "modular result" },
    ],
    constraints: ["1 ≤ n, k ≤ 30", "1 ≤ target ≤ 1000", "answer mod 1e9+7"],
    recognize:
      "'**Count the ways** to reach a sum using a fixed number of bounded choices' is a classic **bounded knapsack count**: state over (dice used, sum so far), each die offering faces 1..k.",
    figureItOut: [
      "**State**: `dp[d][s]` = the number of ways to get sum `s` using exactly `d` dice. Two indices because both how-many-dice and the-sum constrain the answer.",
      "**Recurrence**: the d-th die shows some face `f` in `1..k`, so `dp[d][s] = Σ_{f=1..k} dp[d−1][s−f]` for `s−f ≥ 0` — sum over every face the last die could show.",
      "**Base case**: `dp[0][0] = 1` (zero dice make sum 0 exactly one way); `dp[0][s>0] = 0`.",
      "**Fill**: iterate dice `d = 1..n`, sums `s = 1..target`, and inner faces `f = 1..k`, taking everything mod 1e9+7 to avoid overflow.",
      "The answer is `dp[n][target]`.",
    ],
    approaches: [
      {
        name: "Memoized recursion",
        intuition: "Recurse on (diceLeft, remaining), summing over the current die's k faces; cache by state.",
        time: "O(n·target·k)",
        timeWhy: "n·target distinct states, each looping over k faces.",
        space: "O(n·target)",
        spaceWhy: "Memo table plus recursion depth n.",
        code: `int MOD = 1_000_000_007;
Integer[][] memo;
int numRollsToTarget(int n, int k, int target) {
    memo = new Integer[n + 1][target + 1];
    return go(n, k, target);
}
int go(int dice, int k, int rem) {
    if (dice == 0) return rem == 0 ? 1 : 0;
    if (rem <= 0) return 0;
    if (memo[dice][rem] != null) return memo[dice][rem];
    int ways = 0;
    for (int f = 1; f <= k && f <= rem; f++) {
        ways = (ways + go(dice - 1, k, rem - f)) % MOD;
    }
    return memo[dice][rem] = ways;
}`,
      },
      {
        name: "Bottom-up 2-D DP (optimal)",
        intuition: "Build the table dice by dice, each sum accumulating over the k faces of the new die.",
        time: "O(n·target·k)",
        timeWhy: "Triple loop over dice, target, and faces.",
        space: "O(n·target)",
        spaceWhy: "A 2-D table; reducible to one row since dice d uses only d−1.",
        code: `int numRollsToTarget(int n, int k, int target) {
    int MOD = 1_000_000_007;
    int[][] dp = new int[n + 1][target + 1];
    dp[0][0] = 1;
    for (int d = 1; d <= n; d++) {
        for (int s = 1; s <= target; s++) {
            for (int f = 1; f <= k && f <= s; f++) {
                dp[d][s] = (dp[d][s] + dp[d - 1][s - f]) % MOD;
            }
        }
    }
    return dp[n][target];
}`,
        walkthrough: [
          "n=2, k=6, target=7. dp[1][s]=1 for s=1..6 (one die, one way each).",
          "dp[2][7] = Σ dp[1][7−f] for f=1..6 = dp[1][6]+dp[1][5]+...+dp[1][1] = 6.",
        ],
      },
    ],
    edgeCases: [
      "target < n or target > n·k → 0 ways (impossible to reach).",
      "n = 1 → 1 if 1 ≤ target ≤ k else 0.",
      "Apply the modulo on every addition, not just at the end, to stay within int range.",
    ],
    twists: [
      "**Coin Change II (LeetCode 518)** → unbounded reuse of each coin instead of a fixed count.",
      "**Combination Sum IV (LeetCode 377)** → order matters and the count is unbounded; a 1-D dp suffices.",
      "**Probability instead of count** → divide by kⁿ, or carry doubles.",
    ],
    related: ["coin-change-ii", "combination-sum-iv"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "number-of-enclaves",
    title: "Number of Enclaves",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1020,
    statement:
      "Given a binary grid where `1` is land and `0` is sea, return the number of land cells from which you **cannot** walk off the grid (a land cell is 'trapped' if its 4-connected land region never touches a boundary).",
    examples: [
      { in: "grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]", out: "3", note: "the 1 at (1,0) escapes; the others are enclosed" },
      { in: "grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]", out: "0", note: "all land connects to the edge" },
    ],
    constraints: ["1 ≤ m, n ≤ 500", "grid[i][j] is 0 or 1"],
    recognize:
      "A grid flood-fill problem with a twist: instead of counting islands, you **eliminate everything reachable from the border**. 'Cells that can reach the boundary' → start DFS/BFS *from* the boundary, then count what's left.",
    figureItOut: [
      "Trying to test each land cell 'can it escape?' independently re-floods the same regions repeatedly. Flip it: a region escapes **iff any of its cells sits on the border**.",
      "So first **sink every land cell connected to the border**. Walk the four edges; from each boundary `1`, DFS/BFS and turn all connected land into 0 (sea).",
      "After that pass, the only `1`s remaining are enclaves — land that never touched an edge.",
      "Count the remaining `1`s. That count is the answer.",
    ],
    approaches: [
      {
        name: "Border DFS sink, then count",
        intuition: "Flood-fill land from every boundary cell to 0, then the surviving land is enclosed.",
        time: "O(m·n)",
        timeWhy: "Each cell is visited at most a constant number of times across the border floods and the final count.",
        space: "O(m·n)",
        spaceWhy: "Worst-case recursion/stack depth when the whole grid is one connected region.",
        code: `int numEnclaves(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    for (int i = 0; i < m; i++) {
        sink(grid, i, 0);
        sink(grid, i, n - 1);
    }
    for (int j = 0; j < n; j++) {
        sink(grid, 0, j);
        sink(grid, m - 1, j);
    }
    int count = 0;
    for (int[] row : grid)
        for (int v : row) count += v;
    return count;
}
void sink(int[][] g, int i, int j) {
    if (i < 0 || j < 0 || i >= g.length || j >= g[0].length || g[i][j] == 0) return;
    g[i][j] = 0;
    sink(g, i + 1, j);
    sink(g, i - 1, j);
    sink(g, i, j + 1);
    sink(g, i, j - 1);
}`,
        walkthrough: [
          "Border land at (1,0) sinks itself (no land neighbours connect inward) → grid loses that 1.",
          "Remaining 1s at (2,1),(2,2),(1,2) are interior and survive → count = 3.",
        ],
      },
    ],
    edgeCases: [
      "All land touches the border → 0 enclaves.",
      "No land at all → 0.",
      "Deep recursion on a 500×500 all-land grid can overflow the stack — an explicit stack/BFS queue is safer.",
    ],
    twists: [
      "**Surrounded Regions (LeetCode 130)** → identical border-flood idea, flipping enclosed `O`s to `X`.",
      "**Count the perimeter of enclaves** → after sinking, sum exposed edges of survivors.",
      "**Closed Island (LeetCode 1254)** → count enclosed *regions* instead of cells.",
    ],
    related: ["surrounded-regions", "number-of-islands"],
  },

  {
    slug: "keys-and-rooms",
    title: "Keys and Rooms",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 841,
    statement:
      "There are `n` rooms `0..n−1`; you start in room 0. `rooms[i]` lists the keys found in room i, each unlocking another room. Return `true` if you can **visit every room**.",
    examples: [
      { in: "rooms = [[1],[2],[3],[]]", out: "true", note: "0→1→2→3" },
      { in: "rooms = [[1,3],[3,0,1],[2],[0]]", out: "false", note: "room 2 is unreachable" },
    ],
    constraints: ["n == rooms.length", "2 ≤ n ≤ 1000", "0 ≤ keys ≤ 3000 total"],
    recognize:
      "Rooms are **nodes**, keys are **directed edges**. 'Can I reach every node from node 0?' is a plain **reachability / connected-from-source** traversal (DFS or BFS).",
    figureItOut: [
      "Reframe it: each room is a graph node, and a key in room `i` to room `j` is a directed edge `i → j`. The question becomes 'is every node reachable from node 0?'.",
      "Do a traversal from room 0, collecting keys (edges) and visiting every newly unlocked room exactly once. Use a `visited` set so you never re-process a room.",
      "After the traversal, compare the number of visited rooms to `n`. If you saw all of them, return true.",
      "DFS (recursion or a stack) and BFS (a queue) are equally fine — only reachability matters, not distance.",
    ],
    approaches: [
      {
        name: "DFS from room 0",
        intuition: "Recurse through unlocked rooms, marking visited; success means all n rooms were seen.",
        time: "O(n + E)",
        timeWhy: "Each room is visited once and every key (edge) is examined once.",
        space: "O(n)",
        spaceWhy: "The visited set plus recursion depth up to n.",
        code: `boolean canVisitAllRooms(List<List<Integer>> rooms) {
    boolean[] visited = new boolean[rooms.size()];
    dfs(rooms, 0, visited);
    for (boolean v : visited) if (!v) return false;
    return true;
}
void dfs(List<List<Integer>> rooms, int room, boolean[] visited) {
    if (visited[room]) return;
    visited[room] = true;
    for (int key : rooms.get(room)) dfs(rooms, key, visited);
}`,
      },
      {
        name: "BFS with a queue and a counter",
        intuition: "Spread out from room 0; count distinct rooms entered.",
        time: "O(n + E)",
        timeWhy: "Each room enqueued once, each key inspected once.",
        space: "O(n)",
        spaceWhy: "The queue and visited array.",
        code: `boolean canVisitAllRooms(List<List<Integer>> rooms) {
    boolean[] visited = new boolean[rooms.size()];
    Deque<Integer> queue = new ArrayDeque<>();
    queue.add(0);
    visited[0] = true;
    int seen = 1;
    while (!queue.isEmpty()) {
        int room = queue.poll();
        for (int key : rooms.get(room)) {
            if (!visited[key]) {
                visited[key] = true;
                seen++;
                queue.add(key);
            }
        }
    }
    return seen == rooms.size();
}`,
        walkthrough: [
          "rooms=[[1,3],[3,0,1],[2],[0]]: from 0 reach 1 and 3; from 1 reach 3,0,1 (all seen); from 3 reach 0 (seen).",
          "Room 2 was never unlocked → seen=3 ≠ 4 → false.",
        ],
      },
    ],
    edgeCases: [
      "Room 0 with no keys but n > 1 → false (nothing else reachable).",
      "Self-referencing or duplicate keys → harmless thanks to the visited guard.",
      "A key pointing back to room 0 → ignored once 0 is visited.",
    ],
    twists: [
      "**Report which rooms are unreachable** → return the indices left false in `visited`.",
      "**Minimum keys to open all rooms** → BFS gives reachability, not minimality; needs different modelling.",
      "**Count connected components** → run traversals from every unvisited node (LeetCode 323 style).",
    ],
    related: ["number-of-connected-components-in-an-undirected-graph", "clone-graph"],
  },

  {
    slug: "all-paths-from-source-to-target",
    title: "All Paths From Source to Target",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 797,
    statement:
      "Given a **DAG** of `n` nodes where `graph[i]` lists nodes reachable directly from `i`, return **all paths from node 0 to node n−1** (in any order).",
    examples: [
      { in: "graph = [[1,2],[3],[3],[]]", out: "[[0,1,3],[0,2,3]]" },
      { in: "graph = [[4,3,1],[3,2,4],[3],[4],[]]", out: "[[0,4],[0,3,4],[0,1,3,4],[0,1,2,3,4],[0,1,4]]" },
    ],
    constraints: ["n == graph.length", "2 ≤ n ≤ 15", "the graph is a DAG (acyclic)"],
    recognize:
      "'Enumerate **every** path from source to target' is **DFS backtracking** over a graph — build the path one node at a time, recurse into each neighbour, then undo. Because it's a DAG, no visited set is needed.",
    figureItOut: [
      "You need every path, not just one, so this is enumeration → DFS that extends a partial path and records it whenever it reaches the target.",
      "Maintain a `path` list. Push the current node, and if it equals `n−1`, snapshot the path into the result.",
      "Otherwise recurse into each neighbour `graph[node]`. After exploring, **pop** the current node to backtrack — restoring the path for the sibling branches.",
      "It's a DAG, so a node can be revisited via different paths without looping; you don't need (and must not use) a global visited set, or you'd miss valid paths.",
    ],
    approaches: [
      {
        name: "DFS backtracking",
        intuition: "Grow a path from 0; on reaching n−1 record a copy; undo each choice on the way back.",
        time: "O(2ⁿ · n)",
        timeWhy: "A DAG can have up to ~2^(n−2) source-to-target paths and copying each costs O(n).",
        space: "O(n)",
        spaceWhy: "Recursion depth and the current path length are bounded by n (output not counted).",
        code: `List<List<Integer>> allPathsSourceTarget(int[][] graph) {
    List<List<Integer>> res = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    path.add(0);
    dfs(graph, 0, path, res);
    return res;
}
void dfs(int[][] graph, int node, List<Integer> path, List<List<Integer>> res) {
    if (node == graph.length - 1) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int next : graph[node]) {
        path.add(next);
        dfs(graph, next, path, res);
        path.remove(path.size() - 1);   // backtrack
    }
}`,
        walkthrough: [
          "graph=[[1,2],[3],[3],[]]. path=[0] → into 1 → path=[0,1] → into 3 (target) → record [0,1,3]; pop 3, pop 1.",
          "Back at 0 → into 2 → path=[0,2] → into 3 (target) → record [0,2,3].",
        ],
      },
    ],
    edgeCases: [
      "Source equals target (n could make 0 the last node only if n=1, excluded here) — the base case still snapshots correctly.",
      "A node with no outgoing edges that isn't the target → that branch simply dead-ends and backtracks.",
      "Must record a **copy** of `path`; storing the live list would leave you with mutated/empty lists.",
    ],
    twists: [
      "**Count paths only** → return an int instead of building lists; memoize counts per node for O(n+E).",
      "**Shortest such path** → BFS instead of full enumeration.",
      "**General (cyclic) graph** → you'd need a visited set on the current path to avoid infinite loops.",
    ],
    related: ["course-schedule-ii", "clone-graph"],
  },

  {
    slug: "minimum-genetic-mutation",
    title: "Minimum Genetic Mutation",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 433,
    statement:
      "A gene is an 8-character string over `A,C,G,T`. One mutation changes exactly one character. Given `startGene`, `endGene`, and a `bank` of valid genes, return the **minimum mutations** to turn start into end (only through bank genes), or −1 if impossible.",
    examples: [
      { in: 'start = "AACCGGTT", end = "AACCGGTA", bank = ["AACCGGTA"]', out: "1" },
      { in: 'start = "AACCGGTT", end = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]', out: "2" },
    ],
    constraints: ["gene length is 8", "0 ≤ bank.length ≤ 10", "genes use only A, C, G, T"],
    recognize:
      "Each valid gene is a **node**; two genes are adjacent if they differ in exactly one character. 'Fewest single-character changes' = **shortest path in an unweighted graph** = **BFS**.",
    figureItOut: [
      "Model genes as nodes and connect two if they differ by one character. Each mutation is one edge, so the minimum number of mutations is the shortest path → BFS by levels.",
      "BFS from `startGene`. At each step, generate every one-character mutation (8 positions × 4 letters) and keep only those present in the `bank` and not yet visited.",
      "Track the level (mutation count). The first time you dequeue `endGene`, that level is the answer.",
      "If BFS drains without reaching `endGene`, return −1. Put the bank in a set for O(1) validity checks and use a visited set so you don't cycle.",
    ],
    approaches: [
      {
        name: "BFS over one-char mutations",
        intuition: "Expand level by level, only stepping to bank genes; first arrival at the target is the minimum.",
        time: "O(B · 8 · 4)",
        timeWhy: "Up to B bank genes processed once, each generating 32 candidate mutations checked against a set.",
        space: "O(B)",
        spaceWhy: "The bank set, visited set, and BFS queue.",
        code: `int minMutation(String startGene, String endGene, String[] bank) {
    Set<String> valid = new HashSet<>(Arrays.asList(bank));
    if (!valid.contains(endGene)) return -1;
    char[] choices = {'A', 'C', 'G', 'T'};
    Set<String> visited = new HashSet<>();
    Deque<String> queue = new ArrayDeque<>();
    queue.add(startGene);
    visited.add(startGene);
    int steps = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            String gene = queue.poll();
            if (gene.equals(endGene)) return steps;
            char[] arr = gene.toCharArray();
            for (int i = 0; i < arr.length; i++) {
                char original = arr[i];
                for (char c : choices) {
                    arr[i] = c;
                    String next = new String(arr);
                    if (valid.contains(next) && !visited.contains(next)) {
                        visited.add(next);
                        queue.add(next);
                    }
                }
                arr[i] = original;
            }
        }
        steps++;
    }
    return -1;
}`,
        walkthrough: [
          'start "AACCGGTT", bank has "AACCGGTA","AACCGCTA","AAACGGTA". Level 1: mutate last char to A → "AACCGGTA" (in bank).',
          'Level 2 from "AACCGGTA": change positions to reach "AAACGGTA" (in bank) = end → return 2.',
        ],
      },
    ],
    edgeCases: [
      "endGene not in bank → −1 immediately.",
      "start == end → 0 (returned on the first dequeue).",
      "Empty bank → −1 unless start already equals end.",
    ],
    twists: [
      "**Word Ladder (LeetCode 127)** → the same BFS with a 26-letter alphabet and variable length.",
      "**Return the mutation sequence** → store parent pointers and reconstruct the path.",
      "**Bidirectional BFS** → search from both ends to cut the explored frontier.",
    ],
    related: ["word-ladder", "shortest-path-in-binary-matrix"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "evaluate-division",
    title: "Evaluate Division",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 399,
    statement:
      "Given equations like `a / b = 2.0` and `b / c = 3.0`, answer queries such as `a / c`. Return each query's value, or `-1.0` if it can't be determined from the given equations.",
    examples: [
      { in: 'equations=[["a","b"],["b","c"]], values=[2.0,3.0], queries=[["a","c"],["b","a"],["a","e"]]', out: "[6.0, 0.5, -1.0]" },
      { in: 'equations=[["a","b"]], values=[0.5], queries=[["a","b"],["b","a"],["x","x"]]', out: "[0.5, 2.0, -1.0]", note: "unknown variable x → -1" },
    ],
    constraints: ["1 ≤ equations.length ≤ 20", "values[i] > 0", "1 ≤ queries.length ≤ 20"],
    recognize:
      "Each variable is a **node**; `a/b = k` is a **weighted directed edge** `a →(k) b` and `b →(1/k) a`. A query `x/y` is the **product of edge weights along a path** from x to y → graph traversal (DFS/BFS) multiplying weights.",
    figureItOut: [
      "Build a weighted graph: for `a/b = k`, add edge `a → b` with weight `k` and `b → a` with weight `1/k`. Then `a/c` is just `(a/b)·(b/c)` — the product of weights along any path from a to c.",
      "For each query `(x, y)`: if either variable is unknown, answer −1. If x == y and x is known, answer 1.0.",
      "Otherwise DFS/BFS from x toward y, carrying the **running product** of weights and marking visited nodes to avoid cycles. The product when you reach y is the answer.",
      "If y is unreachable from x, the variables are in disconnected components → −1.",
    ],
    approaches: [
      {
        name: "Build weighted graph + DFS per query",
        intuition: "Each query walks the graph multiplying edge weights until it reaches the target.",
        time: "O(Q · (V + E))",
        timeWhy: "Each of Q queries runs one traversal over up to V nodes and E edges.",
        space: "O(V + E)",
        spaceWhy: "Adjacency map plus the visited set and recursion stack per query.",
        code: `double[] calcEquation(List<List<String>> equations, double[] values,
                      List<List<String>> queries) {
    Map<String, Map<String, Double>> graph = new HashMap<>();
    for (int i = 0; i < equations.size(); i++) {
        String a = equations.get(i).get(0), b = equations.get(i).get(1);
        graph.computeIfAbsent(a, k -> new HashMap<>()).put(b, values[i]);
        graph.computeIfAbsent(b, k -> new HashMap<>()).put(a, 1.0 / values[i]);
    }
    double[] res = new double[queries.size()];
    for (int i = 0; i < queries.size(); i++) {
        String x = queries.get(i).get(0), y = queries.get(i).get(1);
        if (!graph.containsKey(x) || !graph.containsKey(y)) {
            res[i] = -1.0;
        } else {
            res[i] = dfs(graph, x, y, 1.0, new HashSet<>());
        }
    }
    return res;
}
double dfs(Map<String, Map<String, Double>> g, String cur, String target,
           double product, Set<String> visited) {
    if (cur.equals(target)) return product;
    visited.add(cur);
    for (Map.Entry<String, Double> e : g.get(cur).entrySet()) {
        if (!visited.contains(e.getKey())) {
            double r = dfs(g, e.getKey(), target, product * e.getValue(), visited);
            if (r != -1.0) return r;
        }
    }
    return -1.0;
}`,
        walkthrough: [
          "Edges: a→b=2, b→a=0.5, b→c=3, c→b=1/3. Query a/c: a→b (×2) → b→c (×3) = 6.0.",
          "Query b/a: b→a (×0.5) = 0.5. Query a/e: e unknown → −1.0.",
        ],
      },
    ],
    edgeCases: [
      "Query with an unknown variable → −1 (even `x/x` if x never appeared).",
      "`x/x` for a known x → 1.0.",
      "Disconnected components → −1 when no path exists.",
    ],
    twists: [
      "**Many queries** → precompute with Floyd-Warshall, or union-find with relative weights for near-O(1) answers.",
      "**Detect contradictions** → conflicting paths give different products; flag inconsistency.",
      "**Currency conversion** → identical model with exchange rates as weights.",
    ],
    related: ["reconstruct-itinerary", "accounts-merge"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "maximum-units-on-a-truck",
    title: "Maximum Units on a Truck",
    difficulty: "Easy",
    pattern: "greedy",
    leetcode: 1710,
    statement:
      "Each `boxTypes[i] = [count, unitsPerBox]`. A truck holds at most `truckSize` boxes. Return the **maximum total units** you can carry by choosing boxes (you may take a partial box type).",
    examples: [
      { in: "boxTypes=[[1,3],[2,2],[3,1]], truckSize=4", out: "8", note: "1×3 + 2×2 + 1×1 = 8" },
      { in: "boxTypes=[[5,10],[2,5],[4,7],[3,9]], truckSize=10", out: "91" },
    ],
    constraints: ["1 ≤ boxTypes.length ≤ 1000", "1 ≤ count, unitsPerBox ≤ 1000", "1 ≤ truckSize ≤ 10⁶"],
    recognize:
      "Limited capacity (boxes), each item has a value-per-unit-capacity (units per box). 'Maximize value under a count budget where you can split items' is the **fractional-knapsack greedy**: take the densest items first.",
    figureItOut: [
      "Every box occupies exactly one slot, and slots are interchangeable, so a box's 'value density' is simply its `unitsPerBox`. To maximize units, **fill slots with the highest-unit boxes first**.",
      "Sort the box types by `unitsPerBox` descending. The greedy choice is provably optimal here because all boxes cost the same one slot — there's no reason to ever prefer a lower-unit box.",
      "Walk the sorted list, taking as many boxes of the current type as fit. Add `take × unitsPerBox` to the total and subtract `take` from the remaining capacity.",
      "Stop once the truck is full (capacity hits 0) or you run out of box types.",
    ],
    approaches: [
      {
        name: "Sort by units descending, fill greedily",
        intuition: "Highest-unit boxes go on first; take partial counts of the last type that fits.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting the box types; the fill loop is O(n).",
        space: "O(1)",
        spaceWhy: "Sorts in place; only accumulator variables.",
        code: `int maximumUnits(int[][] boxTypes, int truckSize) {
    Arrays.sort(boxTypes, (a, b) -> b[1] - a[1]);   // by unitsPerBox, descending
    int units = 0, remaining = truckSize;
    for (int[] box : boxTypes) {
        if (remaining == 0) break;
        int take = Math.min(box[0], remaining);
        units += take * box[1];
        remaining -= take;
    }
    return units;
}`,
        walkthrough: [
          "Sorted [[1,3],[2,2],[3,1]], truckSize 4. Take 1 box of 3 units → units=3, rem=3.",
          "Take 2 boxes of 2 → units=7, rem=1. Take 1 box of 1 → units=8, rem=0 → 8.",
        ],
      },
    ],
    edgeCases: [
      "truckSize ≥ total boxes → take everything.",
      "A single box type with count larger than truckSize → take only truckSize of them.",
      "Ties in unitsPerBox don't matter — both give the same units.",
    ],
    twists: [
      "**Boxes have varying sizes (weights)** → becomes true fractional knapsack: sort by units/weight ratio.",
      "**Cannot split a box type (all-or-nothing)** → 0/1 knapsack DP instead of greedy.",
      "**Multiple trucks** → partition into bins; harder optimization.",
    ],
    related: ["boats-to-save-people", "two-city-scheduling"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "partition-to-k-equal-sum-subsets",
    title: "Partition to K Equal Sum Subsets",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 698,
    statement:
      "Given an integer array `nums` and an integer `k`, return `true` if `nums` can be split into **k non-empty subsets all with equal sum**.",
    examples: [
      { in: "nums = [4,3,2,3,5,2,1], k = 4", out: "true", note: "(5),(1,4),(2,3),(2,3)" },
      { in: "nums = [1,2,3,4], k = 3", out: "false" },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 16", "1 ≤ nums[i] ≤ 10⁴"],
    recognize:
      "'Split into k groups with a fixed target each' is **constraint-satisfaction backtracking**: try placing each number into some bucket, recurse, and undo on failure. Heavy **pruning** is what makes n ≤ 16 tractable.",
    figureItOut: [
      "First the cheap checks: if `total % k != 0` it's impossible; the per-subset `target = total / k`. If any single element exceeds `target`, it can never fit → false.",
      "Now fill `k` buckets one at a time. Try to complete the **current bucket** to exactly `target` by choosing a subset of the unused numbers, then recurse to fill the next bucket. When all k buckets are completed, return true.",
      "Backtracking: pick an unused number that fits in the current bucket, mark it used, recurse; if that fails, unmark it and try the next number.",
      "Pruning is essential: **sort descending** (big numbers fail fast), skip duplicates at the same level, and if a number exactly fills a bucket but the rest fails, stop trying others at that slot. Starting each bucket's search after the previous index avoids redundant permutations.",
    ],
    approaches: [
      {
        name: "Brute permutation (baseline)",
        intuition: "Try every assignment of numbers to k buckets and check sums.",
        time: "O(kⁿ)",
        timeWhy: "Each of n numbers could go into any of k buckets without pruning.",
        space: "O(n)",
        spaceWhy: "Recursion depth and a bucket-sum array.",
        code: `// Conceptual baseline — assign each index to one of k buckets, verify equal sums.
// Exponential and unpruned; the optimized version below is what to write.`,
      },
      {
        name: "Backtracking with sorting + pruning (optimal)",
        intuition: "Fill one bucket to target at a time over the used[] markers; prune aggressively.",
        time: "O(k · 2ⁿ)",
        timeWhy: "Filling each of k buckets explores subsets of the remaining numbers; pruning keeps it well under the bound.",
        space: "O(n)",
        spaceWhy: "The used array and recursion depth up to n.",
        code: `boolean canPartitionKSubsets(int[] nums, int k) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % k != 0) return false;
    int target = total / k;
    Arrays.sort(nums);
    if (nums[nums.length - 1] > target) return false;
    boolean[] used = new boolean[nums.length];
    return fill(nums, used, k, 0, target, target);
}
boolean fill(int[] nums, boolean[] used, int k, int start, int rem, int target) {
    if (k == 0) return true;                       // all buckets completed
    if (rem == 0) return fill(nums, used, k - 1, 0, target, target);  // bucket done, start next
    for (int i = start; i < nums.length; i++) {
        if (used[i] || nums[i] > rem) continue;
        if (i > start && nums[i] == nums[i - 1] && !used[i - 1]) continue;  // skip duplicates
        used[i] = true;
        if (fill(nums, used, k, i + 1, rem - nums[i], target)) return true;
        used[i] = false;
        if (rem == target) break;                  // if this number can't start a bucket, none can
    }
    return false;
}`,
        walkthrough: [
          "nums=[4,3,2,3,5,2,1], total=20, k=4 → target=5. Sorted [1,2,2,3,3,4,5].",
          "Bucket: take 5 → done; next 1+4 → done; next 2+3 → done; next 2+3 → done; k hits 0 → true.",
        ],
      },
    ],
    edgeCases: [
      "total not divisible by k → false right away.",
      "Any element > target → false.",
      "k == 1 → always true (the whole array is one subset); k == n → true iff all elements are equal.",
    ],
    twists: [
      "**Bitmask DP over subsets** → O(n · 2ⁿ) using a reachable-mask state, avoiding deep recursion.",
      "**Matchsticks to Square (LeetCode 473)** → exactly this with k = 4.",
      "**Minimize the maximum subset sum** with k buckets → an optimization variant, not a yes/no.",
    ],
    related: ["partition-equal-subset-sum", "combination-sum-ii"],
  },

  {
    slug: "beautiful-arrangement",
    title: "Beautiful Arrangement",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 526,
    statement:
      "Count the permutations of `1..n` that are 'beautiful': for every position `i` (1-indexed), either `perm[i]` is divisible by `i`, or `i` is divisible by `perm[i]`.",
    examples: [
      { in: "n = 2", out: "2", note: "[1,2] and [2,1] both qualify" },
      { in: "n = 3", out: "3" },
      { in: "n = 1", out: "1" },
    ],
    constraints: ["1 ≤ n ≤ 15"],
    recognize:
      "'Count permutations satisfying a per-position constraint' is **backtracking**: place a value at each position only if it meets the divisibility rule, recurse, undo. Checking the constraint *before* recursing prunes most of the n! tree.",
    figureItOut: [
      "Build the arrangement position by position (`pos = 1..n`). At each position, try every unused number that satisfies the rule — `num % pos == 0` or `pos % num == 0`. The early check is the whole game: it cuts off huge invalid branches.",
      "Track which numbers are used with a boolean array. For each valid placement, mark it used, recurse to the next position, then unmark (backtrack).",
      "When `pos` exceeds `n`, you've filled a full beautiful arrangement → increment the count. You only need the *count*, so no need to store the actual permutation.",
      "A neat optimization: place values **into positions** (loop over positions for each value) or positions←values either way; iterating positions and trying candidate numbers keeps the divisibility test natural.",
    ],
    approaches: [
      {
        name: "Generate all permutations (baseline)",
        intuition: "Produce every permutation of 1..n and test the rule on each.",
        time: "O(n! · n)",
        timeWhy: "n! permutations, O(n) to validate each.",
        space: "O(n)",
        spaceWhy: "Recursion depth / current permutation.",
        code: `// Conceptual baseline — enumerate all n! permutations, count those satisfying the rule.
// Wasteful: it builds invalid prefixes fully before rejecting them.`,
      },
      {
        name: "Backtracking with early divisibility check (optimal)",
        intuition: "Only ever place a number that already satisfies the rule for its position, so invalid prefixes die immediately.",
        time: "O(k) where k ≪ n!",
        timeWhy: "The divisibility precondition prunes the permutation tree to far fewer than n! nodes.",
        space: "O(n)",
        spaceWhy: "The used[] array and recursion depth n.",
        code: `int count = 0;
int countArrangement(int n) {
    boolean[] used = new boolean[n + 1];
    backtrack(n, 1, used);
    return count;
}
void backtrack(int n, int pos, boolean[] used) {
    if (pos > n) {
        count++;
        return;
    }
    for (int num = 1; num <= n; num++) {
        if (!used[num] && (num % pos == 0 || pos % num == 0)) {
            used[num] = true;
            backtrack(n, pos + 1, used);
            used[num] = false;          // backtrack
        }
    }
}`,
        walkthrough: [
          "n=2, pos=1: num=1 (1%1==0) and num=2 (2%1==0) both valid.",
          "Place 1 at pos1 → pos2 needs num with 2%num or num%2: num=2 works → arrangement [1,2]. Place 2 at pos1 → num=1 at pos2 → [2,1]. Count = 2.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → 1 (the single arrangement [1] trivially satisfies the rule).",
      "Position 1 accepts any number (everything is divisible by 1), so the first level never prunes.",
      "Only count is needed — building the permutation list would waste memory.",
    ],
    twists: [
      "**Return the arrangements themselves** → snapshot the current permutation at the base case.",
      "**Bitmask DP** → state = set of used numbers; `dp[mask]` counts arrangements for `popcount(mask)` positions, O(n · 2ⁿ).",
      "**Place values into positions instead** → symmetric formulation, same pruning.",
    ],
    related: ["permutations", "combinations"],
  },
];
