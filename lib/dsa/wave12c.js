// NeetCode All / Top Interview — wave 12c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave11c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE12C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "n-th-tribonacci-number",
    title: "N-th Tribonacci Number",
    difficulty: "Easy",
    pattern: "dp-1d",
    leetcode: 1137,
    statement:
      "The **Tribonacci** sequence is defined by `T(0)=0`, `T(1)=1`, `T(2)=1`, and `T(n+3) = T(n) + T(n+1) + T(n+2)` for `n ≥ 0`. Given an integer `n`, return `T(n)`.",
    examples: [
      { in: "n=4", out: "4", note: "T: 0,1,1,2,4 -> T(4)=4" },
      { in: "n=25", out: "1389537" },
      { in: "n=0", out: "0" },
    ],
    constraints: ["0 ≤ n ≤ 37", "the answer fits in a 32-bit signed integer for the given range"],
    recognize:
      "Each term is a fixed linear combination of the **previous three** terms → a textbook 1-D DP where the state is the running window of the last three values, collapsible to O(1) space.",
    figureItOut: [
      "**State**: `T(i)` = the i-th Tribonacci number. The recurrence reaches back exactly three steps, so you never need more than the last three values at any moment.",
      "**Recurrence**: `T(i) = T(i-1) + T(i-2) + T(i-3)` for `i ≥ 3`. This is the literal definition rewritten with `i = n+3`.",
      "**Base case**: `T(0) = 0`, `T(1) = 1`, `T(2) = 1`. Return these directly when `n ≤ 2`.",
      "**Fill**: sweep `i` from 3 to `n`, each step computing the new value as the sum of the three held values, then slide the window forward (drop the oldest, append the new). Only three scalars are ever needed.",
      "The answer is the last value produced once `i` reaches `n`.",
    ],
    approaches: [
      {
        name: "Rolling three-value window (optimal)",
        intuition: "Hold the last three Tribonacci numbers; each step sums them into the next and slides the window.",
        time: "O(n)",
        timeWhy: "One pass from 3 to n, constant work per step.",
        space: "O(1)",
        spaceWhy: "Three scalar variables, no array.",
        code: `int tribonacci(int n) {
    if (n == 0) return 0;
    if (n <= 2) return 1;
    int a = 0, b = 1, c = 1;   // T(0), T(1), T(2)
    for (int i = 3; i <= n; i++) {
        int next = a + b + c;
        a = b;
        b = c;
        c = next;
    }
    return c;
}`,
        walkthrough: [
          "n=4. Start a=0,b=1,c=1 (T0,T1,T2).",
          "i=3: next=0+1+1=2; slide -> a=1,b=1,c=2 (now c=T3=2).",
          "i=4: next=1+1+2=4; slide -> a=1,b=2,c=4 (now c=T4=4).",
          "Loop ends at i=4. Return c=4.",
        ],
      },
    ],
    edgeCases: [
      "n == 0 → 0 (the only term that is not 1 among the first three).",
      "n == 1 or n == 2 → 1.",
      "Values grow fast but stay within int for n ≤ 37; use long if extending the range.",
    ],
    twists: [
      "**Climbing Stairs / Fibonacci** → the same rolling-window idea with a two-term recurrence.",
      "**Huge n with modulo** → keep values mod M to avoid overflow; the recurrence is unchanged.",
      "**Matrix exponentiation** → computes T(n) in O(log n) via a 3×3 transition matrix.",
    ],
    related: ["climbing-stairs", "min-cost-climbing-stairs", "house-robber"],
  },

  {
    slug: "domino-and-tromino-tiling",
    title: "Domino and Tromino Tiling",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 790,
    statement:
      "You have two tile shapes: a `2 x 1` **domino** and an L-shaped **tromino** (three cells). Both may be rotated. Count the number of ways to **completely tile** a `2 x n` board. Because the answer can be large, return it **modulo 10^9 + 7**.",
    examples: [
      { in: "n=3", out: "5" },
      { in: "n=1", out: "1" },
      { in: "n=4", out: "11" },
    ],
    constraints: ["1 ≤ n ≤ 1000", "return the count modulo 10^9 + 7"],
    recognize:
      "Tiling a `2 x n` board column by column, where the right edge can be flush or jagged → a 1-D DP over the column index with a clean closed recurrence (`f(n) = 2*f(n-1) + f(n-3)`), derivable by tracking the boundary shape.",
    figureItOut: [
      "**State**: let `f(k)` = the number of ways to **fully tile** a `2 x k` board with a flat right edge. The board fills left to right; once a column is complete, what remains is a smaller identical subproblem, so a single index `k` describes the state.",
      "**Recurrence**: derive `f(k) = 2*f(k-1) + f(k-3)`. Reasoning: a fully-tiled `2 x k` board ends either with a vertical domino (leaving `f(k-1)`), or with a configuration that the careful boundary analysis collapses into 2 ways tied to `f(k-1)` plus a tromino-driven contribution tied to `f(k-3)`. The standard, verified compact form is `f(k) = 2*f(k-1) + f(k-3)`.",
      "**Base case**: `f(0) = 1` (empty board, one way: tile nothing), `f(1) = 1` (single vertical domino), `f(2) = 2` (two verticals or two horizontals).",
      "**Fill**: sweep `k` from 3 to `n`, computing `f(k) = (2*f(k-1) + f(k-3)) mod M`. Keep all values in a small array (or three rolling scalars).",
      "The answer is `f(n) mod (10^9 + 7)`.",
    ],
    approaches: [
      {
        name: "1-D DP with the f(k)=2f(k-1)+f(k-3) recurrence (optimal)",
        intuition: "Count tilings of a 2 x k board with a flat edge; the compact recurrence folds in dominoes and tromino pairs.",
        time: "O(n)",
        timeWhy: "One pass computing each f(k) in constant time.",
        space: "O(n)",
        spaceWhy: "A dp array of length n+1 (reducible to O(1) with three rolling values).",
        code: `int numTilings(int n) {
    int MOD = 1_000_000_007;
    if (n == 1) return 1;
    if (n == 2) return 2;
    long[] f = new long[n + 1];
    f[0] = 1;
    f[1] = 1;
    f[2] = 2;
    for (int k = 3; k <= n; k++) {
        f[k] = (2 * f[k - 1] + f[k - 3]) % MOD;
    }
    return (int) f[n];
}`,
        walkthrough: [
          "n=4. Base f[0]=1, f[1]=1, f[2]=2.",
          "k=3: f[3] = 2*f[2] + f[0] = 2*2 + 1 = 5.",
          "k=4: f[4] = 2*f[3] + f[1] = 2*5 + 1 = 11.",
          "Return f[4] = 11.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → 1 (one vertical domino).",
      "n == 2 → 2 (two verticals or two horizontals).",
      "Use long for the intermediate 2*f[k-1] before taking the modulo to avoid overflow.",
    ],
    twists: [
      "**Two-state DP** → track both flat-edge and jagged-edge counts (full[k], partial[k]) for a derivation that needs no memorized recurrence.",
      "**Dominoes only (no tromino)** → reduces to Fibonacci: f(k)=f(k-1)+f(k-2).",
      "**Board height 3 or more** → the state must encode the full boundary profile (a bitmask), making it a broken-profile DP.",
    ],
    related: ["climbing-stairs", "decode-ways", "n-th-tribonacci-number"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "last-stone-weight-ii",
    title: "Last Stone Weight II",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1049,
    statement:
      "You have stones with positive integer weights in `stones`. Each turn you smash two stones `x` and `y` (`x ≤ y`): if `x == y` both are destroyed, otherwise the stone of weight `y - x` remains. Continue until at most one stone is left. Return the **smallest possible weight** of that last stone (0 if none remain).",
    examples: [
      { in: "stones=[2,7,4,1,8,1]", out: "1" },
      { in: "stones=[31,26,33,21,40]", out: "5" },
      { in: "stones=[1,2]", out: "1" },
    ],
    constraints: ["1 ≤ stones.length ≤ 30", "1 ≤ stones[i] ≤ 100"],
    recognize:
      "Each smash assigns every stone a `+` or `-` sign, so the final stone equals `|sum(+) - sum(-)|`. Minimizing that means splitting the stones into two groups with sums as equal as possible → a **subset-sum / 0-1 knapsack** DP over achievable subset sums.",
    figureItOut: [
      "Reframe: the whole process is equivalent to partitioning the stones into two piles P and N; the surviving weight is `|sum(P) - sum(N)|`. With `total = sum(all)`, if pile P sums to `s` then the result is `total - 2s`. To minimize the absolute difference, make `s` as close to `total/2` as possible (without exceeding it).",
      "**State**: `dp[i][s]` = whether some subset of the first `i` stones can sum to exactly `s`. This is the classic 0-1 knapsack reachability over sums from 0 to `total/2`.",
      "**Recurrence**: `dp[i][s] = dp[i-1][s] OR dp[i-1][s - stones[i-1]]` (skip the i-th stone, or include it if it fits). Compressed to one row, iterate `s` downward so each stone is used at most once.",
      "**Base case**: `dp[0] = true` (sum 0 is always reachable with the empty subset); all other sums start false.",
      "**Fill**: process each stone, updating reachable sums up to `total/2`. After processing, scan `s` from `total/2` down to 0 for the largest reachable `s`; the answer is `total - 2*s`.",
    ],
    approaches: [
      {
        name: "Subset-sum knapsack toward total/2 (optimal)",
        intuition: "Signs split stones into two piles; minimize |diff| by finding the achievable subset sum closest to half the total.",
        time: "O(n · S)",
        timeWhy: "n stones times sums up to S = total/2 (total ≤ 30·100 = 3000).",
        space: "O(S)",
        spaceWhy: "A boolean reachable-sums array of size total/2 + 1.",
        code: `int lastStoneWeightII(int[] stones) {
    int total = 0;
    for (int s : stones) total += s;
    int half = total / 2;
    boolean[] dp = new boolean[half + 1];
    dp[0] = true;
    for (int stone : stones) {
        for (int s = half; s >= stone; s--) {
            if (dp[s - stone]) dp[s] = true;
        }
    }
    for (int s = half; s >= 0; s--) {
        if (dp[s]) return total - 2 * s;
    }
    return total;
}`,
        walkthrough: [
          "stones=[1,2]. total=3, half=1. dp=[true,false].",
          "stone=1: s=1 -> dp[0] true so dp[1]=true. dp=[true,true].",
          "stone=2: half=1 < 2, inner loop does nothing.",
          "Scan from s=1: dp[1]=true -> answer = total - 2*s = 3 - 2 = 1.",
        ],
      },
    ],
    edgeCases: [
      "Single stone → it survives; answer is that stone weight.",
      "Two equal stones → both destroyed, answer 0.",
      "Perfectly partitionable total (even split exists) → answer 0.",
    ],
    twists: [
      "**Partition Equal Subset Sum (LeetCode 416)** → ask only whether a sum of total/2 is reachable (answer 0 here).",
      "**Target Sum (LeetCode 494)** → count sign assignments hitting a target instead of minimizing the difference.",
      "**Reconstruct the two piles** → track parent choices to recover which stones go in each group.",
    ],
    related: ["partition-equal-subset-sum", "target-sum", "coin-change"],
  },

  {
    slug: "maximum-number-of-points-with-cost",
    title: "Maximum Number of Points with Cost",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1937,
    statement:
      "Given an `m x n` integer matrix `points`, you pick **exactly one cell per row** to maximize your score. Picking `points[r][c]` adds that value, but moving from a chosen column `c` in row `r` to a chosen column `c2` in row `r+1` **subtracts** the penalty `abs(c - c2)`. Return the **maximum total score**.",
    examples: [
      { in: "points=[[1,2,3],[1,5,1],[3,1,1]]", out: "9", note: "pick columns 2,1,0: 3+5+3 - |2-1| - |1-0| = 11 - 2 = 9" },
      { in: "points=[[1,5],[2,3],[4,2]]", out: "11" },
    ],
    constraints: ["m == points.length", "n == points[r].length", "1 ≤ m, n ≤ 10^5", "1 ≤ m·n ≤ 10^5", "0 ≤ points[r][c] ≤ 10^5"],
    recognize:
      "Row-by-row choice where each row's value depends on the previous row's chosen column via an absolute-difference penalty → a 2-D grid DP whose naive O(m·n²) transition is collapsed to O(m·n) with a **left-to-right / right-to-left running max**.",
    figureItOut: [
      "**State**: `dp[r][c]` = the maximum score achievable for rows `0..r` when the cell chosen **in row r** is column `c`. One value per cell; the previous row is summarized entirely by its dp row.",
      "**Recurrence**: `dp[r][c] = points[r][c] + max over c2 of ( dp[r-1][c2] - abs(c - c2) )`. Splitting the absolute value: for `c2 ≤ c` the term is `dp[r-1][c2] + c2 - c`, and for `c2 ≥ c` it is `dp[r-1][c2] - c2 + c`. So a left-to-right prefix max of `dp[r-1][c2] + c2` and a right-to-left suffix max of `dp[r-1][c2] - c2` give each `dp[r][c]` in O(1).",
      "**Base case**: `dp[0][c] = points[0][c]` for every column (first row has no penalty above it).",
      "**Fill**: for each subsequent row, build `left[c] = max(left[c-1], prev[c] + c)` and `right[c] = max(right[c+1], prev[c] - c)`, then set `dp[r][c] = points[r][c] + max(left[c] - c, right[c] + c)`.",
      "The answer is the maximum over the final row `dp[m-1]`.",
    ],
    approaches: [
      {
        name: "Row DP with prefix/suffix running maxima (optimal)",
        intuition: "Split the |c - c2| penalty into two monotone scans so each cell uses an O(1) best-previous-column lookup.",
        time: "O(m · n)",
        timeWhy: "Each row does two linear passes (left and right running maxima) plus one combine pass.",
        space: "O(n)",
        spaceWhy: "Only the previous row and two helper arrays of length n.",
        code: `long maxPoints(int[][] points) {
    int m = points.length, n = points[0].length;
    long[] prev = new long[n];
    for (int c = 0; c < n; c++) prev[c] = points[0][c];
    for (int r = 1; r < m; r++) {
        long[] left = new long[n];
        long[] right = new long[n];
        left[0] = prev[0] + 0;
        for (int c = 1; c < n; c++) {
            left[c] = Math.max(left[c - 1], prev[c] + c);
        }
        right[n - 1] = prev[n - 1] - (n - 1);
        for (int c = n - 2; c >= 0; c--) {
            right[c] = Math.max(right[c + 1], prev[c] - c);
        }
        long[] cur = new long[n];
        for (int c = 0; c < n; c++) {
            long best = Math.max(left[c] - c, right[c] + c);
            cur[c] = points[r][c] + best;
        }
        prev = cur;
    }
    long ans = Long.MIN_VALUE;
    for (long v : prev) ans = Math.max(ans, v);
    return ans;
}`,
        walkthrough: [
          "points=[[1,2,3],[1,5,1],[3,1,1]]. prev (row0) = [1,2,3].",
          "Row1: left = [1+0, max(1,2+1), max(3,3+2)] = [1,3,5]. right = from end: [.. ] right[2]=3-2=1, right[1]=max(1,2-1)=1, right[0]=max(1,1-0)=1 -> [1,1,1].",
          "Row1 cur[c]=points+max(left[c]-c, right[c]+c): c0=1+max(1-0,1+0)=1+1=2; c1=5+max(3-1,1+1)=5+2=7; c2=1+max(5-2,1+2)=1+3=4. cur=[2,7,4]. prev=[2,7,4].",
          "Row2: left=[2, max(2,7+1)=8, max(8,4+2)=8]=[2,8,8]. right: right[2]=4-2=2, right[1]=max(2,7-1)=6, right[0]=max(6,2-0)=6 -> [6,6,2]. cur: c0=3+max(2-0,6+0)=3+6=9; c1=1+max(8-1,6+1)=1+7=8; c2=1+max(8-2,2+2)=1+6=7. cur=[9,8,7]. Max = 9.",
        ],
      },
    ],
    edgeCases: [
      "Single row → answer is the max value in that row (no penalty).",
      "Single column → forced column each row; answer is the column sum (penalties all zero).",
      "Use long: m·n up to 1e5 cells each up to 1e5 can sum beyond int range.",
    ],
    twists: [
      "**Naive O(m·n²)** transition (try every previous column) is correct but too slow at 1e5 cells.",
      "**Squared penalty (c - c2)²** → the prefix-max trick breaks; needs a convex-hull / divide-and-conquer optimization.",
      "**Minimum Falling Path Sum (LeetCode 931)** → similar row DP but movement is restricted to adjacent columns, no global penalty.",
    ],
    related: ["minimum-path-sum", "dungeon-game", "unique-paths-ii"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "time-needed-to-inform-all-employees",
    title: "Time Needed to Inform All Employees",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1376,
    statement:
      "A company has `n` employees with a single `headID`. `manager[i]` is the direct manager of employee `i` (`manager[headID] = -1`). To pass news, a manager spends `informTime[i]` minutes to inform all their direct subordinates simultaneously, who then inform theirs, and so on. Return the **number of minutes** needed until **all** employees are informed.",
    examples: [
      { in: "n=1, headID=0, manager=[-1], informTime=[0]", out: "0" },
      { in: "n=6, headID=2, manager=[2,2,-1,2,2,2], informTime=[0,0,1,0,0,0]", out: "1", note: "head informs all 5 directly in 1 minute" },
    ],
    constraints: ["1 ≤ n ≤ 10^5", "0 ≤ headID < n", "manager.length == n", "informTime.length == n", "manager[headID] == -1", "informTime[i] == 0 iff employee i has no subordinates"],
    recognize:
      "The management structure is a **tree** (each node has one parent, rooted at the head). 'Longest time for news to reach a leaf' is the **maximum root-to-leaf accumulated delay** → a DFS/BFS down the tree summing inform times.",
    figureItOut: [
      "Build the tree as an adjacency list of subordinates: for each employee `i` (except the head), add `i` to `children[manager[i]]`. The head is the root.",
      "News travels downward; a subordinate is informed `informTime[manager]` minutes after its manager learned the news. The total time to inform everyone is the **longest accumulated path** from the head down to any leaf.",
      "DFS from the head carrying the time-so-far. At each node, the time its children become informed is `timeSoFar + informTime[node]`; recurse into each child with that value. A leaf contributes its accumulated arrival time.",
      "Return the maximum accumulated time over all leaves. (BFS with a per-node arrival time works equally well; the tree shape guarantees no revisits.)",
    ],
    approaches: [
      {
        name: "DFS accumulating inform time down the tree (optimal)",
        intuition: "Build the subordinate tree, DFS from the head adding informTime at each level, and take the deepest accumulated delay.",
        time: "O(n)",
        timeWhy: "Each employee is visited once; building children is one pass over manager.",
        space: "O(n)",
        spaceWhy: "Adjacency lists plus the recursion stack (up to the tree height).",
        code: `int numOfMinutes(int n, int headID, int[] manager, int[] informTime) {
    List<List<Integer>> children = new ArrayList<>();
    for (int i = 0; i < n; i++) children.add(new ArrayList<>());
    for (int i = 0; i < n; i++) {
        if (manager[i] != -1) children.get(manager[i]).add(i);
    }
    return dfs(headID, children, informTime);
}
int dfs(int node, List<List<Integer>> children, int[] informTime) {
    int maxChild = 0;
    for (int sub : children.get(node)) {
        maxChild = Math.max(maxChild, dfs(sub, children, informTime));
    }
    return informTime[node] + maxChild;
}`,
        walkthrough: [
          "n=6, head=2, manager=[2,2,-1,2,2,2], informTime=[0,0,1,0,0,0]. children[2]=[0,1,3,4,5], others empty.",
          "dfs(2): for each child dfs returns informTime[child]+0 = 0 (all leaves). maxChild = 0.",
          "Return informTime[2] + 0 = 1 + 0 = 1.",
          "Answer 1: the head spends 1 minute informing all direct reports, who are leaves.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → only the head, no one to inform, answer 0.",
      "A pure chain (each manager has one subordinate) → answer is the sum of all inform times along the chain.",
      "Leaves have informTime 0 and contribute only their accumulated arrival time.",
    ],
    twists: [
      "**Iterative DFS/BFS** → avoid recursion-depth limits on a degenerate chain of 1e5 nodes.",
      "**Multiple roots (a forest)** → run the DFS from each root and take the overall max.",
      "**Per-edge custom delays** → store the delay on the child instead of using the manager's uniform informTime.",
    ],
    related: ["rotting-oranges", "diameter-of-binary-tree", "binary-tree-maximum-path-sum"],
  },

  {
    slug: "reorder-routes-to-make-all-paths-lead-to-the-city-zero",
    title: "Reorder Routes to Make All Paths Lead to the City Zero",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1466,
    statement:
      "There are `n` cities `0..n-1` connected by `n-1` **directed** roads forming a tree (ignoring direction, it is connected and acyclic). `connections[i] = [a, b]` is a road from `a` to `b`. Return the **minimum number of roads that must be reversed** so that every city can reach city `0`.",
    examples: [
      { in: "n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]]", out: "3" },
      { in: "n=5, connections=[[1,0],[1,2],[3,2],[3,4]]", out: "2" },
      { in: "n=3, connections=[[1,0],[2,0]]", out: "0" },
    ],
    constraints: ["2 ≤ n ≤ 5·10^4", "connections.length == n - 1", "connections[i].length == 2", "0 ≤ a, b ≤ n - 1", "a != b"],
    recognize:
      "Underlying structure is an undirected tree; we want every node to reach the root 0. Traverse outward from 0 and **count edges pointing the wrong way** (away from 0) → a single DFS/BFS over the tree tracking each edge's original direction.",
    figureItOut: [
      "For every node to reach city 0, every edge on the unique path from a node to 0 must point **toward** 0. So root the tree at 0 and ask: along each tree edge, does its original direction point toward the root (good) or away (must be reversed)?",
      "Build the tree with both directions, but tag each adjacency entry with whether it is an **original forward edge**. Concretely, for road `a -> b`, add `b` to `adj[a]` marked 'original' and add `a` to `adj[b]` marked 'reverse'.",
      "DFS/BFS outward from city 0. When you traverse from a visited node `u` to an unvisited child `v`, you are moving *away* from the root. If the edge you used was an **original** `u -> v`, that road currently points away from 0 and must be reversed → add 1 to the count. If it was a reverse entry (the real road is `v -> u`, pointing toward 0), it is already correct → add 0.",
      "Sum the reversals over the whole traversal. Mark nodes visited so each tree edge is examined once.",
    ],
    approaches: [
      {
        name: "DFS from 0, count edges pointing outward (optimal)",
        intuition: "Build a bidirectional tree tagging original directions; every original edge crossed while moving away from 0 must be reversed.",
        time: "O(n)",
        timeWhy: "A tree with n-1 edges; each node and edge visited once.",
        space: "O(n)",
        spaceWhy: "Adjacency lists, a visited array, and the traversal stack.",
        code: `int minReorder(int n, int[][] connections) {
    List<int[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] c : connections) {
        adj[c[0]].add(new int[]{c[1], 1});  // original direction: needs reversal if traversed outward
        adj[c[1]].add(new int[]{c[0], 0});  // reverse edge: already points toward source
    }
    boolean[] visited = new boolean[n];
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(0);
    visited[0] = true;
    int count = 0;
    while (!stack.isEmpty()) {
        int u = stack.pop();
        for (int[] edge : adj[u]) {
            int v = edge[0], isOriginal = edge[1];
            if (!visited[v]) {
                visited[v] = true;
                count += isOriginal;
                stack.push(v);
            }
        }
    }
    return count;
}`,
        walkthrough: [
          "n=6, connections=[[0,1],[1,3],[2,3],[4,0],[4,5]]. From 0, adj[0] has (1,original) and (0 is target of 4->0 so adj[0] also has (4,reverse)).",
          "DFS from 0: go to 1 via original edge 0->1 (points away from 0) -> count=1. From 1 go to 3 via original 1->3 -> count=2.",
          "From 3 go to 2 via reverse of 2->3 (real road 2->3 points toward 3 then 0) -> count unchanged. Reach 4 via reverse of 4->0 (4->0 already points toward 0) -> +0. From 4 reach 5 via original 4->5 -> count=3.",
          "Total reversals = 3.",
        ],
      },
    ],
    edgeCases: [
      "All roads already point toward 0 → 0 reversals.",
      "n == 2 → one road; reverse it iff it points away from 0.",
      "Mark the root visited before traversing so you never count an edge back into 0.",
    ],
    twists: [
      "**Count nodes that can already reach 0 without reversal** → flip the accounting.",
      "**Make every city reachable FROM 0 instead** → reverse the good/bad labelling.",
      "**Graph is not a tree (has cycles)** → the unique-path argument fails; needs a different model.",
    ],
    related: ["number-of-islands", "course-schedule", "clone-graph"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "minimum-time-to-collect-all-apples-in-a-tree",
    title: "Minimum Time to Collect All Apples in a Tree",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1443,
    statement:
      "An undirected tree has `n` vertices `0..n-1` given by `edges`. `hasApple[i]` is true if vertex `i` has an apple. Starting and ending at vertex `0`, walking an edge costs 1 second in each direction. Return the **minimum seconds** to collect **all** apples and return to vertex 0.",
    examples: [
      { in: "n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,true,false,true,true,false]", out: "8" },
      { in: "n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,true,false,false,true,false]", out: "6" },
      { in: "n=7, edges=[[0,1],[0,2],[1,4],[1,5],[2,3],[2,6]], hasApple=[false,false,false,false,false,false,false]", out: "0" },
    ],
    constraints: ["1 ≤ n ≤ 10^5", "edges.length == n - 1", "edges[i].length == 2", "0 ≤ a < b ≤ n - 1", "hasApple.length == n"],
    recognize:
      "On a tree, the round trip to collect a subtree's apples uses each **needed edge exactly twice** (down and back). 'Sum the cost of edges that lead to an apple' → a DFS that returns whether a subtree contains any apple and accumulates 2 per kept edge.",
    figureItOut: [
      "Root the tree at vertex 0 and DFS. The key fact: an edge between a parent and child is worth visiting **iff** the child's subtree contains at least one apple (directly on the child or somewhere below it). Each such edge is walked down and back up → costs 2 seconds.",
      "Define the DFS to return the total seconds needed within a subtree. For a node `u`, recurse into each child `v` (skip the parent to avoid going back up). Let `childCost` be the seconds returned for `v`'s subtree.",
      "If `v`'s subtree needs any travel (`childCost > 0`) **or** `v` itself has an apple, then the edge `u-v` is required: add `childCost + 2` to `u`'s total. Otherwise that child contributes 0 (no apple anywhere below, skip the edge).",
      "Start the DFS at vertex 0 with no parent. The returned value is the answer. If there are no apples at all, every child contributes 0 and the result is 0.",
    ],
    approaches: [
      {
        name: "DFS summing 2 per apple-bearing edge (optimal)",
        intuition: "Each edge into an apple-containing subtree is traversed twice; DFS adds childCost + 2 whenever the child subtree holds an apple.",
        time: "O(n)",
        timeWhy: "Each vertex and edge of the tree is visited once.",
        space: "O(n)",
        spaceWhy: "Adjacency lists plus the recursion stack.",
        code: `int minTime(int n, int[][] edges, List<Boolean> hasApple) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    return dfs(0, -1, adj, hasApple);
}
int dfs(int node, int parent, List<List<Integer>> adj, List<Boolean> hasApple) {
    int total = 0;
    for (int child : adj.get(node)) {
        if (child == parent) continue;
        int childCost = dfs(child, node, adj, hasApple);
        if (childCost > 0 || hasApple.get(child)) {
            total += childCost + 2;
        }
    }
    return total;
}`,
        walkthrough: [
          "n=7, edges as given, hasApple at 2,4,5. Root at 0.",
          "Subtree of 1: child 4 has apple -> edge 1-4 costs 2; child 5 has apple -> edge 1-5 costs 2; dfs(1)=4. Edge 0-1 needed (childCost 4>0) -> contributes 4+2=6.",
          "Subtree of 2: child 3 no apple, returns 0 and no apple -> skip; child 6 no apple -> skip; dfs(2)=0. But vertex 2 has an apple, so edge 0-2 needed -> contributes 0+2=2.",
          "dfs(0) = 6 + 2 = 8. Answer 8.",
        ],
      },
    ],
    edgeCases: [
      "No apples anywhere → 0 (you never leave vertex 0).",
      "Apple only at vertex 0 → 0 (already there, no edges to cross).",
      "A deep chain with one apple at the bottom → cost is 2 × depth.",
    ],
    twists: [
      "**Apple at the root counts for nothing** — only edges contribute; the root needs no travel to collect its own apple.",
      "**Do not need to return to 0** → subtract the single longest downward apple path once (save one direction).",
      "**Iterative DFS** → necessary for n = 1e5 to avoid stack overflow on a degenerate chain.",
    ],
    related: ["diameter-of-binary-tree", "graph-valid-tree", "binary-tree-maximum-path-sum"],
  },

  {
    slug: "parallel-courses",
    title: "Parallel Courses",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1136,
    statement:
      "There are `n` courses labeled `1..n` with prerequisite pairs `relations[i] = [prevCourse, nextCourse]` (a directed edge `prev -> next`). In one **semester** you may take **any number** of courses whose prerequisites are all already satisfied. Return the **minimum number of semesters** to finish all courses, or `-1` if it is impossible (a cycle exists).",
    examples: [
      { in: "n=3, relations=[[1,3],[2,3]]", out: "2", note: "semester 1: courses 1,2; semester 2: course 3" },
      { in: "n=3, relations=[[1,2],[2,3],[3,1]]", out: "-1", note: "cycle" },
    ],
    constraints: ["1 ≤ n ≤ 5000", "1 ≤ relations.length ≤ 5000", "relations[i].length == 2", "1 ≤ prevCourse, nextCourse ≤ n", "prevCourse != nextCourse", "no duplicate relations"],
    recognize:
      "Minimum number of dependency 'waves' to clear all nodes of a DAG → **Kahn's topological sort by levels (BFS)**: each BFS layer is one semester, and detecting leftover nodes after the sort reveals a cycle (return -1).",
    figureItOut: [
      "Model courses as a directed graph with an edge `prev -> next`. Compute each course's **in-degree** (number of unmet prerequisites).",
      "Topological BFS in **levels**: a semester takes *all* courses currently with in-degree 0 simultaneously. Start the queue with every in-degree-0 course — that is semester 1.",
      "Process one full level at a time: take the whole current queue as a semester, decrement the in-degree of each of their successors, and enqueue any successor that drops to in-degree 0 (it becomes available next semester). Increment the semester counter once per processed level.",
      "Count how many courses you actually finished. If it equals `n`, return the number of levels (semesters). If fewer (some nodes never reach in-degree 0), a cycle blocks them → return -1.",
    ],
    approaches: [
      {
        name: "Kahn's level-by-level topological BFS (optimal)",
        intuition: "Each BFS layer of zero-in-degree courses is one semester; if a cycle leaves courses unprocessed, return -1.",
        time: "O(n + E)",
        timeWhy: "Each course and prerequisite edge is processed once.",
        space: "O(n + E)",
        spaceWhy: "Adjacency lists, an in-degree array, and the BFS queue.",
        code: `int minimumSemesters(int n, int[][] relations) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[n + 1];
    for (int[] r : relations) {
        adj.get(r[0]).add(r[1]);
        indeg[r[1]]++;
    }
    Deque<Integer> queue = new ArrayDeque<>();
    for (int c = 1; c <= n; c++) {
        if (indeg[c] == 0) queue.add(c);
    }
    int semesters = 0, studied = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        semesters++;
        for (int s = 0; s < size; s++) {
            int course = queue.poll();
            studied++;
            for (int next : adj.get(course)) {
                if (--indeg[next] == 0) queue.add(next);
            }
        }
    }
    return studied == n ? semesters : -1;
}`,
        walkthrough: [
          "n=3, relations=[[1,3],[2,3]]. indeg: 1=0, 2=0, 3=2. Queue starts with {1,2}.",
          "Semester 1: process level {1,2} (size 2), studied=2. Decrement indeg[3] twice -> indeg[3]=0 -> enqueue 3.",
          "Semester 2: process level {3} (size 1), studied=3. No successors.",
          "studied=3 == n -> return semesters = 2.",
        ],
      },
    ],
    edgeCases: [
      "No relations → all courses available semester 1; answer 1 (for n ≥ 1).",
      "A cycle → some courses keep in-degree > 0; studied < n → return -1.",
      "n == 1 with no prerequisites → 1 semester.",
    ],
    twists: [
      "**Parallel Courses II (LeetCode 1494)** → a semester cap of k courses turns this into a bitmask DP, much harder.",
      "**Course Schedule II (LeetCode 210)** → same topological sort but output an order, not a level count.",
      "**Longest dependency chain** → the answer here equals the number of nodes on the longest path in the DAG.",
    ],
    related: ["course-schedule", "course-schedule-ii", "alien-dictionary"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "letter-case-permutation",
    title: "Letter Case Permutation",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 784,
    statement:
      "Given a string `s`, you may transform each **letter** to lowercase or uppercase (digits are left unchanged). Return a list of **all** strings obtainable this way, in any order.",
    examples: [
      { in: "s=\"a1b2\"", out: "[\"a1b2\",\"a1B2\",\"A1b2\",\"A1B2\"]" },
      { in: "s=\"3z4\"", out: "[\"3z4\",\"3Z4\"]" },
      { in: "s=\"12345\"", out: "[\"12345\"]" },
    ],
    constraints: ["1 ≤ s.length ≤ 12", "s consists of lowercase/uppercase English letters and digits"],
    recognize:
      "Each letter independently doubles the result set (lower vs upper) while digits offer no choice → **backtracking that fixes one character per recursion depth**, branching twice on letters and once on digits.",
    figureItOut: [
      "Walk the string position by position. At each position you either have one option (a digit, copied as-is) or two options (a letter, in lowercase or uppercase). The full answer is the product of these per-position choices.",
      "Backtracking by **index**: recursion depth equals the position currently being decided. Maintain a char buffer of the string being built.",
      "At a digit, place it unchanged and recurse to the next index (a single branch). At a letter, branch twice: place its lowercase form and recurse, then place its uppercase form and recurse. Undo is implicit because each branch overwrites the same buffer slot.",
      "When the index reaches the string length, the buffer is a complete permutation — record a copy. Collect all of them.",
    ],
    approaches: [
      {
        name: "Backtracking branching per letter (optimal)",
        intuition: "One recursion level per character; letters branch into lower and upper, digits pass through, emit at the end.",
        time: "O(2^L · n)",
        timeWhy: "L letters give up to 2^L results, each length n to materialize.",
        space: "O(n)",
        spaceWhy: "Recursion depth and the working buffer, both bounded by the string length (output not counted).",
        code: `List<String> letterCasePermutation(String s) {
    List<String> result = new ArrayList<>();
    backtrack(s.toCharArray(), 0, result);
    return result;
}
void backtrack(char[] chars, int i, List<String> result) {
    if (i == chars.length) {
        result.add(new String(chars));
        return;
    }
    if (Character.isLetter(chars[i])) {
        chars[i] = Character.toLowerCase(chars[i]);
        backtrack(chars, i + 1, result);
        chars[i] = Character.toUpperCase(chars[i]);
        backtrack(chars, i + 1, result);
    } else {
        backtrack(chars, i + 1, result);
    }
}`,
        walkthrough: [
          "s=\"a1b2\". i=0 letter a -> lowercase branch.",
          "i=1 digit 1 (pass). i=2 letter b -> lower then upper. i=3 digit 2 (pass). Emit a1b2, then a1B2.",
          "Back at i=0, uppercase branch A: similarly emits A1b2, A1B2.",
          "Result: [a1b2, a1B2, A1b2, A1B2].",
        ],
      },
    ],
    edgeCases: [
      "No letters (all digits) → exactly one output: the original string.",
      "Single letter → two outputs (lower and upper).",
      "Characters that are already a given case still branch into both cases.",
    ],
    twists: [
      "**Iterative product build** → start with the empty string and double the list at each letter.",
      "**Subsets (LeetCode 78)** → the same per-element binary-choice tree, expressed over inclusion.",
      "**Restrict to toggling only k letters** → add a budget to the recursion state.",
    ],
    related: ["subsets", "letter-tile-possibilities", "combination-sum"],
  },

  {
    slug: "word-break-ii",
    title: "Word Break II",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 140,
    statement:
      "Given a string `s` and a dictionary `wordDict`, add spaces in `s` to construct **every** sentence where each word is a valid dictionary word. Return all such sentences in any order. The same dictionary word may be reused any number of times.",
    examples: [
      { in: "s=\"catsanddog\", wordDict=[\"cat\",\"cats\",\"and\",\"sand\",\"dog\"]", out: "[\"cats and dog\",\"cat sand dog\"]" },
      { in: "s=\"pineapplepenapple\", wordDict=[\"apple\",\"pen\",\"applepen\",\"pine\",\"pineapple\"]", out: "[\"pine apple pen apple\",\"pineapple pen apple\",\"pine applepen apple\"]" },
      { in: "s=\"catsandog\", wordDict=[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", out: "[]" },
    ],
    constraints: ["1 ≤ s.length ≤ 20", "1 ≤ wordDict.length ≤ 1000", "1 ≤ wordDict[i].length ≤ 10", "all dictionary words are unique"],
    recognize:
      "'List every way to segment a string into dictionary words' is **backtracking over split points**, where memoizing the set of sentences for each suffix start avoids re-solving overlapping subproblems.",
    figureItOut: [
      "At each starting index, try every prefix that is a dictionary word; for each valid prefix, recursively segment the remaining suffix, then prepend the prefix (with a space) to each sentence the suffix produces.",
      "Backtracking: the recursion is keyed on a start index `i`. It returns the list of all sentences that segment `s[i..]`. For each dictionary word matching at `i`, recurse on `i + word.length` and combine.",
      "Base case: when `i` equals the string length, return a list containing one empty sentence (representing 'nothing left to segment'); the caller turns that into a complete sentence.",
      "Memoize on `i`: many suffixes are reached through different prefixes, so cache each start index's list of sentences to avoid exponential recomputation (a single dictionary lookup set makes prefix checks O(1) on length).",
    ],
    approaches: [
      {
        name: "Memoized backtracking over start indices (optimal)",
        intuition: "For each suffix start, build sentences by matching dictionary prefixes and prepending to the recursively-built suffix sentences; cache per start index.",
        time: "O(n^2 · 2^n) worst case",
        timeWhy: "The number of valid segmentations can be exponential; memoization makes each distinct suffix solved once, but assembling all sentences is inherently output-bound.",
        space: "O(n · 2^n)",
        spaceWhy: "The memo stores, per start index, all sentence strings for that suffix.",
        code: `List<String> wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    Map<Integer, List<String>> memo = new HashMap<>();
    return backtrack(s, 0, dict, memo);
}
List<String> backtrack(String s, int start, Set<String> dict, Map<Integer, List<String>> memo) {
    if (memo.containsKey(start)) return memo.get(start);
    List<String> res = new ArrayList<>();
    if (start == s.length()) {
        res.add("");
        return res;
    }
    for (int end = start + 1; end <= s.length(); end++) {
        String word = s.substring(start, end);
        if (dict.contains(word)) {
            List<String> rest = backtrack(s, end, dict, memo);
            for (String tail : rest) {
                res.add(tail.isEmpty() ? word : word + " " + tail);
            }
        }
    }
    memo.put(start, res);
    return res;
}`,
        walkthrough: [
          "s=\"catsanddog\", dict={cat,cats,and,sand,dog}. backtrack(0).",
          "Prefix \"cat\" matches -> backtrack(3) on \"sanddog\": \"sand\"+backtrack(7); backtrack(7) on \"dog\" gives [dog]. So backtrack(3) yields [sand dog].",
          "Prefix \"cats\" matches -> backtrack(4) on \"anddog\": \"and\"+backtrack(7)=[and dog]. So backtrack(4) yields [and dog].",
          "Combine at start 0: cat + (sand dog) = \"cat sand dog\"; cats + (and dog) = \"cats and dog\". Result: [cats and dog, cat sand dog].",
        ],
      },
    ],
    edgeCases: [
      "No valid segmentation → return an empty list.",
      "The whole string is itself a dictionary word → one sentence with no spaces.",
      "Overlapping prefixes (cat vs cats) → both branches explored and combined.",
    ],
    twists: [
      "**Word Break (LeetCode 139)** → only decide IF a segmentation exists; a boolean DP, far cheaper.",
      "**Prune impossible suffixes first** → run the boolean Word Break to skip starts that can never reach the end.",
      "**Return only the count of segmentations** → a 1-D DP summing ways, no sentence assembly.",
    ],
    related: ["word-break", "palindrome-partitioning", "combination-sum"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "maximize-sum-of-array-after-k-negations",
    title: "Maximize Sum of Array After K Negations",
    difficulty: "Easy",
    pattern: "greedy",
    leetcode: 1005,
    statement:
      "Given an integer array `nums` and an integer `k`, you must perform **exactly `k`** operations; each operation picks an index `i` and replaces `nums[i]` with `-nums[i]` (you may pick the same index multiple times). Return the **largest possible sum** of the array after exactly `k` negations.",
    examples: [
      { in: "nums=[4,2,3], k=1", out: "5", note: "negate 2 -> [4,-2,3] sum 5" },
      { in: "nums=[3,-1,0,2], k=3", out: "6", note: "flip -1 then flip 0 twice (or any zero) -> sum 6" },
      { in: "nums=[2,-3,-1,5,-4], k=2", out: "13", note: "flip -4 and -3 -> [2,3,-1,5,4] sum 13" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^4", "-100 ≤ nums[i] ≤ 100", "1 ≤ k ≤ 10^4"],
    recognize:
      "Flipping the most-negative numbers first buys the biggest gain; once no negatives remain, leftover flips should land on the smallest absolute value → a **greedy** that sorts (or heaps) and flips negatives, then spends any remaining flips on the minimum-magnitude element.",
    figureItOut: [
      "Greedy priority: each flip of a negative number `x` increases the sum by `2|x|`, so spend flips on the **most negative** numbers first — they give the largest improvement.",
      "Sort ascending and walk left to right: while you still have flips (`k > 0`) and the current element is negative, negate it (turning it positive) and decrement `k`. This converts the biggest negatives into positives.",
      "After this pass, either flips are exhausted, or every element is now non-negative. If flips remain, they come in pairs that cancel (flip a number twice = no change). So an **even** remaining `k` changes nothing; an **odd** remaining `k` forces one net flip, which should hit the element with the **smallest absolute value** to lose the least.",
      "Compute the sum, then if `k` is still odd, subtract `2 * (minimum absolute value in the array)`. Return the result.",
    ],
    approaches: [
      {
        name: "Sort, flip negatives, dump leftover parity on the min (optimal)",
        intuition: "Flip the largest-magnitude negatives first; any leftover odd flip costs the least when applied to the smallest absolute value.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting; the flip pass and sum are linear.",
        space: "O(1)",
        spaceWhy: "In-place flips and a running sum (ignoring the sort's overhead).",
        code: `int largestSumAfterKNegations(int[] nums, int k) {
    Arrays.sort(nums);
    for (int i = 0; i < nums.length && k > 0 && nums[i] < 0; i++) {
        nums[i] = -nums[i];
        k--;
    }
    int sum = 0, minAbs = Integer.MAX_VALUE;
    for (int v : nums) {
        sum += v;
        minAbs = Math.min(minAbs, Math.abs(v));
    }
    if (k % 2 == 1) {
        sum -= 2 * minAbs;
    }
    return sum;
}`,
        walkthrough: [
          "nums=[2,-3,-1,5,-4], k=2. Sort -> [-4,-3,-1,2,5].",
          "Flip -4 -> 4 (k=1), flip -3 -> 3 (k=0). Array: [4,3,-1,2,5].",
          "sum = 4+3-1+2+5 = 13. minAbs = 1. k is 0 (even) so no extra subtraction.",
          "Answer 13.",
        ],
      },
    ],
    edgeCases: [
      "More flips than negatives → flip all negatives, then leftover parity decides a single min-magnitude flip.",
      "A zero present → flipping zero costs nothing, so an odd leftover k can be absorbed for free (minAbs = 0).",
      "All positive and k even → sum unchanged; k odd → subtract 2 × smallest element.",
    ],
    twists: [
      "**Heap variant** → repeatedly negate the current minimum k times; simpler to reason about but O(k log n).",
      "**At most k flips (not exactly)** → never waste a flip; stop once no negative remains.",
      "**Flip a contiguous range** → a completely different (prefix/sliding) problem, not this element-wise greedy.",
    ],
    related: ["maximum-units-on-a-truck", "gas-station", "partition-labels"],
  },

  {
    slug: "queue-reconstruction-by-height",
    title: "Queue Reconstruction by Height",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 406,
    statement:
      "People stand in a queue, each described by `people[i] = [h, k]`: `h` is their height and `k` is the number of people **in front of them** who have a height **greater than or equal to** `h`. Reconstruct and return the queue (the array of `[h, k]` in correct order) consistent with every person's `k`.",
    examples: [
      { in: "people=[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]", out: "[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]" },
      { in: "people=[[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]", out: "[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]" },
    ],
    constraints: ["1 ≤ people.length ≤ 2000", "0 ≤ h ≤ 10^6", "0 ≤ k < people.length"],
    recognize:
      "A person's `k` only counts people **at least as tall**, so shorter people are invisible to taller ones. Insert **tallest-first**, and a person's `k` is exactly the index to insert them at → a **greedy** sort plus index insertion.",
    figureItOut: [
      "Key observation: a person's `k` counts only people of height `≥ h`. So if you place the **tallest people first**, every already-placed person is at least as tall, and inserting someone shorter later never changes the count for those already placed.",
      "Sort people by height **descending**; break ties by `k` **ascending** (so among equal heights, the one expecting fewer in front is placed earlier, landing at a smaller index correctly).",
      "Greedily insert each person into a result list at **index `k`**. Because everyone already in the list is taller-or-equal, putting this person at position `k` makes exactly `k` taller-or-equal people sit in front of them — precisely their requirement.",
      "After processing all people, the list satisfies every `[h, k]`. Convert to an array and return.",
    ],
    approaches: [
      {
        name: "Sort tallest-first, insert at index k (optimal)",
        intuition: "Place tall people first so each later insertion at index k yields exactly k taller-or-equal people ahead.",
        time: "O(n²)",
        timeWhy: "n insertions into an array list, each shifting up to O(n) elements.",
        space: "O(n)",
        spaceWhy: "The reconstructed list of n people.",
        code: `int[][] reconstructQueue(int[][] people) {
    Arrays.sort(people, (a, b) -> {
        if (a[0] != b[0]) return b[0] - a[0];   // taller first
        return a[1] - b[1];                      // smaller k first among equal heights
    });
    List<int[]> queue = new ArrayList<>();
    for (int[] p : people) {
        queue.add(p[1], p);                      // insert at index k
    }
    return queue.toArray(new int[0][]);
}`,
        walkthrough: [
          "people=[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]. Sort desc by h, asc by k -> [[7,0],[7,1],[6,1],[5,0],[5,2],[4,4]].",
          "Insert [7,0] at 0 -> [[7,0]]. Insert [7,1] at 1 -> [[7,0],[7,1]]. Insert [6,1] at 1 -> [[7,0],[6,1],[7,1]].",
          "Insert [5,0] at 0 -> [[5,0],[7,0],[6,1],[7,1]]. Insert [5,2] at 2 -> [[5,0],[7,0],[5,2],[6,1],[7,1]]. Insert [4,4] at 4 -> [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]].",
          "Final queue matches the expected output.",
        ],
      },
    ],
    edgeCases: [
      "Single person → returned as-is.",
      "All same height → sorting by k ascending then inserting at k places them in k order directly.",
      "Tie-break must be k ascending; descending k would misplace equal-height people.",
    ],
    twists: [
      "**Strictly greater (k counts only taller)** → flip the tie-break so equal heights do not count each other.",
      "**Faster reconstruction** → a balanced BST / BIT can do the index insertions in O(n log n).",
      "**Validate a given queue** → a different problem: scan and check each person's k against those ahead.",
    ],
    related: ["merge-triplets-to-form-target-triplet", "two-city-scheduling", "task-scheduler"],
  },
];
