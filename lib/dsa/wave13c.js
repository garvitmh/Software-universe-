// NeetCode All / Top Interview 150 / LeetCode 75 — wave 13c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave12c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE13C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "fibonacci-number",
    title: "Fibonacci Number",
    difficulty: "Easy",
    pattern: "dp-1d",
    leetcode: 509,
    statement:
      "The **Fibonacci numbers** form a sequence where `F(0) = 0`, `F(1) = 1`, and `F(n) = F(n-1) + F(n-2)` for `n > 1`. Given `n`, return `F(n)`.",
    examples: [
      { in: "n=2", out: "1", note: "F(2) = F(1) + F(0) = 1 + 0 = 1" },
      { in: "n=3", out: "2", note: "F(3) = F(2) + F(1) = 1 + 1 = 2" },
      { in: "n=4", out: "3", note: "F(4) = F(3) + F(2) = 2 + 1 = 3" },
    ],
    constraints: ["0 ≤ n ≤ 30", "the answer fits in a 32-bit signed integer for this range"],
    recognize:
      "Each term is the sum of the **previous two** terms → the canonical 1-D DP whose state collapses to two rolling scalars, giving O(n) time and O(1) space.",
    figureItOut: [
      "**State**: `F(i)` = the i-th Fibonacci number. The recurrence reaches back exactly two steps, so at any moment you only need the previous two values, never the whole history.",
      "**Recurrence**: `F(i) = F(i-1) + F(i-2)` for `i ≥ 2`. This is the literal definition.",
      "**Base case**: `F(0) = 0`, `F(1) = 1`. Return these directly when `n ≤ 1`.",
      "**Fill**: sweep `i` from 2 to `n`, each step setting the new value to the sum of the two held values, then slide the window forward (the old previous becomes the older one, the new value becomes the previous).",
      "The answer is the latest value once `i` reaches `n`.",
    ],
    approaches: [
      {
        name: "Naive recursion (baseline)",
        intuition: "Translate the recurrence directly into two recursive calls; exposes the exponential blowup of recomputing overlapping subproblems.",
        time: "O(2^n)",
        timeWhy: "Each call spawns two more, and the same F(k) is recomputed across many branches of the call tree.",
        space: "O(n)",
        spaceWhy: "Recursion stack depth up to n.",
        code: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
      },
      {
        name: "Rolling two-value window (optimal)",
        intuition: "Hold the last two Fibonacci numbers; each step sums them into the next and slides the window forward.",
        time: "O(n)",
        timeWhy: "One pass from 2 to n, constant work per step.",
        space: "O(1)",
        spaceWhy: "Two scalar variables, no array.",
        code: `int fib(int n) {
    if (n <= 1) return n;
    int prev = 0, cur = 1;   // F(0), F(1)
    for (int i = 2; i <= n; i++) {
        int next = prev + cur;
        prev = cur;
        cur = next;
    }
    return cur;
}`,
        walkthrough: [
          "n=4. Start prev=0 (F0), cur=1 (F1).",
          "i=2: next=0+1=1; slide -> prev=1, cur=1 (cur=F2=1).",
          "i=3: next=1+1=2; slide -> prev=1, cur=2 (cur=F3=2).",
          "i=4: next=1+2=3; slide -> prev=2, cur=3 (cur=F4=3). Loop ends, return cur=3.",
        ],
      },
    ],
    edgeCases: [
      "n == 0 → 0; n == 1 → 1 (handled by the base case before the loop).",
      "Values stay within int for n ≤ 30; use long if extending the range.",
      "Negative n is out of the constraint range, so no special handling is required.",
    ],
    twists: [
      "**Climbing Stairs** → identical two-term recurrence with bases F(0)=1, F(1)=1 (counting paths, not sequence values).",
      "**Huge n with modulo** → keep values mod M; the recurrence is unchanged.",
      "**Matrix exponentiation** → computes F(n) in O(log n) via the 2×2 transition matrix [[1,1],[1,0]].",
    ],
    related: ["climbing-stairs", "n-th-tribonacci-number", "min-cost-climbing-stairs"],
  },

  {
    slug: "count-vowels-permutation",
    title: "Count Vowels Permutation",
    difficulty: "Hard",
    pattern: "dp-1d",
    leetcode: 1220,
    statement:
      "Count the number of strings of length `n` using only the vowels `a, e, i, o, u`, subject to these rules: an `a` may be followed only by `e`; an `e` only by `a` or `i`; an `i` by any vowel except `i`; an `o` only by `i` or `u`; a `u` only by `a`. Return the count **modulo 10^9 + 7**.",
    examples: [
      { in: "n=1", out: "5", note: "the five single vowels" },
      { in: "n=2", out: "10", note: "ae, ea, ei, ia, ie, io, iu, oi, ou, ua" },
      { in: "n=5", out: "68" },
    ],
    constraints: ["1 ≤ n ≤ 2·10^4", "return the count modulo 10^9 + 7"],
    recognize:
      "Counting length-`n` strings where the next letter depends only on the **current** letter → a 1-D DP over string length with five per-vowel states, each transition fixed by the adjacency rules.",
    figureItOut: [
      "**State**: `dp[len][v]` = the number of valid strings of length `len` that **end** in vowel `v` (v in {a,e,i,o,u}). The next letter depends only on the last one, so the ending vowel fully summarizes a string for extension purposes.",
      "**Recurrence**: invert the follow rules into who may **precede** each vowel. A string ending in `a` was extended from one ending in `e`, `i`, or `u`; `e` from `a` or `i`; `i` from `e` or `o`; `o` from `i`; `u` from `i` or `o`. So `dp[len][a] = dp[len-1][e] + dp[len-1][i] + dp[len-1][u]`, and similarly for the rest, all taken mod 10^9 + 7.",
      "**Base case**: `dp[1][v] = 1` for every vowel `v` (each single vowel is one valid string of length 1).",
      "**Fill**: sweep `len` from 2 to `n`, computing the five new counts from the previous length's five counts. Only the previous row is needed, so five rolling scalars suffice.",
      "The answer is the **sum** of `dp[n][v]` over all five vowels, mod 10^9 + 7.",
    ],
    approaches: [
      {
        name: "Five-state rolling 1-D DP (optimal)",
        intuition: "Track counts of strings ending in each vowel; each step recombines them using the inverted adjacency rules.",
        time: "O(n)",
        timeWhy: "One pass over lengths, constant work (five additions) per length.",
        space: "O(1)",
        spaceWhy: "Five long scalars for the current/previous length; no length-indexed array needed.",
        code: `int countVowelPermutation(int n) {
    long MOD = 1_000_000_007L;
    long a = 1, e = 1, i = 1, o = 1, u = 1;   // dp[1][*]
    for (int len = 2; len <= n; len++) {
        long na = (e + i + u) % MOD;
        long ne = (a + i) % MOD;
        long ni = (e + o) % MOD;
        long no = i % MOD;
        long nu = (i + o) % MOD;
        a = na; e = ne; i = ni; o = no; u = nu;
    }
    return (int) ((a + e + i + o + u) % MOD);
}`,
        walkthrough: [
          "n=2. Start a=e=i=o=u=1 (length 1).",
          "len=2: na=e+i+u=3, ne=a+i=2, ni=e+o=2, no=i=1, nu=i+o=2.",
          "Update: a=3, e=2, i=2, o=1, u=2.",
          "Sum = 3+2+2+1+2 = 10. Return 10.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → 5 (the loop never runs; sum of the five base values).",
      "Large n (up to 2·10^4) → counts overflow int quickly, so accumulate in long and apply the modulo each step.",
      "The vowel `i` is the most permissive (precedes four vowels), so its count grows fastest.",
    ],
    twists: [
      "**Matrix exponentiation** → the five-state transition is a 5×5 matrix; raising it to the n-1 power gives O(log n).",
      "**Different adjacency rules** → only the five recurrence lines change; the framework is identical.",
      "**Count strings avoiding a forbidden pair** → another fixed-transition DP over the alphabet.",
    ],
    related: ["climbing-stairs", "decode-ways", "n-th-tribonacci-number"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "minimum-falling-path-sum-ii",
    title: "Minimum Falling Path Sum II",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1289,
    statement:
      "Given an `n x n` integer matrix `grid`, a **falling path with non-zero shifts** picks exactly one element from each row such that **no two chosen elements in adjacent rows are in the same column**. Return the **minimum sum** of such a falling path.",
    examples: [
      { in: "grid=[[1,2,3],[4,5,6],[7,8,9]]", out: "13", note: "1 -> 5 -> 7 = 13 (columns 0,1,0 all differ between adjacent rows)" },
      { in: "grid=[[7]]", out: "7" },
    ],
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 200", "-99 ≤ grid[i][j] ≤ 99"],
    recognize:
      "Pick one cell per row, forbidding the same column in adjacent rows → a row-by-row 2-D DP whose naive O(n³) transition collapses to O(n²) by precomputing each row's **two smallest** incoming values.",
    figureItOut: [
      "**State**: `dp[r][c]` = the minimum path sum ending at cell `(r, c)` while respecting the no-same-column rule between adjacent rows. The previous row is summarized entirely by its dp row.",
      "**Recurrence**: `dp[r][c] = grid[r][c] + min over c2 != c of dp[r-1][c2]`. Naively that min is O(n) per cell. Key trick: the best previous value for column `c` is the row's **minimum** unless that minimum sits in column `c`, in which case use the row's **second minimum**. Precomputing the smallest and second-smallest of `dp[r-1]` makes each transition O(1).",
      "**Base case**: `dp[0][c] = grid[0][c]` for every column (the first row has no row above it).",
      "**Fill**: for each row from 1 to n-1, find the previous row's minimum value (and its column) and its second minimum; then `dp[r][c] = grid[r][c] + (min1 if c != argmin else min2)`.",
      "The answer is the minimum over the final row `dp[n-1]`.",
    ],
    approaches: [
      {
        name: "Naive per-cell min over previous row",
        intuition: "Directly evaluate the recurrence by scanning all previous columns except the same one; correct but cubic.",
        time: "O(n^3)",
        timeWhy: "For each of n^2 cells, scanning the previous row costs O(n).",
        space: "O(n)",
        spaceWhy: "Keep only the previous row plus the current row.",
        code: `int minFallingPathSum(int[][] grid) {
    int n = grid.length;
    int[] prev = grid[0].clone();
    for (int r = 1; r < n; r++) {
        int[] cur = new int[n];
        for (int c = 0; c < n; c++) {
            int best = Integer.MAX_VALUE;
            for (int c2 = 0; c2 < n; c2++) {
                if (c2 != c) best = Math.min(best, prev[c2]);
            }
            cur[c] = grid[r][c] + best;
        }
        prev = cur;
    }
    int ans = Integer.MAX_VALUE;
    for (int v : prev) ans = Math.min(ans, v);
    return ans;
}`,
      },
      {
        name: "Track previous row two smallest (optimal)",
        intuition: "For every column the best incoming value is the row minimum, unless that minimum is the same column, where the second minimum applies.",
        time: "O(n^2)",
        timeWhy: "Each row computes its two smallest in O(n), then fills n cells in O(1) each.",
        space: "O(n)",
        spaceWhy: "Only the previous row of dp values is retained.",
        code: `int minFallingPathSum(int[][] grid) {
    int n = grid.length;
    int[] prev = grid[0].clone();
    for (int r = 1; r < n; r++) {
        int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE, idx1 = -1;
        for (int c = 0; c < n; c++) {
            if (prev[c] < min1) {
                min2 = min1;
                min1 = prev[c];
                idx1 = c;
            } else if (prev[c] < min2) {
                min2 = prev[c];
            }
        }
        int[] cur = new int[n];
        for (int c = 0; c < n; c++) {
            int best = (c == idx1) ? min2 : min1;
            cur[c] = grid[r][c] + best;
        }
        prev = cur;
    }
    int ans = Integer.MAX_VALUE;
    for (int v : prev) ans = Math.min(ans, v);
    return ans;
}`,
        walkthrough: [
          "grid=[[1,2,3],[4,5,6],[7,8,9]]. prev (row0) = [1,2,3].",
          "Row1: of prev=[1,2,3], min1=1 at idx1=0, min2=2. cur[0]=4+min2=4+2=6 (same col as min1); cur[1]=5+1=6; cur[2]=6+1=7. prev=[6,6,7].",
          "Row2: of prev=[6,6,7], min1=6 at idx1=0, min2=6. cur[0]=7+min2=7+6=13; cur[1]=8+6=14; cur[2]=9+6=15. prev=[13,14,15].",
          "Min of final row = 13. Answer 13.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → only one cell per the single row; the answer is grid[0][0] (no adjacency constraint).",
      "Ties for the row minimum → idx1 records one of them; the other equal value becomes min2, so columns matching idx1 still get the correct best.",
      "Negative values are allowed, so initialize the running answer with a sentinel like Integer.MAX_VALUE, not 0.",
    ],
    twists: [
      "**Minimum Falling Path Sum (LeetCode 931)** → movement restricted to the same or adjacent column; a simpler 3-neighbor row DP.",
      "**Maximize instead of minimize** → track the two largest previous values symmetrically.",
      "**Forbid the same column across a window of k rows** → the state must remember more history, breaking the two-smallest shortcut.",
    ],
    related: ["minimum-falling-path-sum", "minimum-path-sum", "triangle"],
  },

  {
    slug: "number-of-ways-to-stay-in-the-same-place-after-some-steps",
    title: "Number of Ways to Stay in the Same Place After Some Steps",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1269,
    statement:
      "A pointer starts at index 0 of an array of length `arrLen`. In each step you may move it **left**, **right**, or **stay** in place, but it must never leave the array (index stays in `[0, arrLen-1]`). Given `steps` and `arrLen`, return the number of ways to be back at index 0 after exactly `steps` steps, **modulo 10^9 + 7**.",
    examples: [
      { in: "steps=3, arrLen=2", out: "4", note: "stay,stay,stay / right,left,stay / right,stay,left / stay,right,left" },
      { in: "steps=2, arrLen=4", out: "2", note: "stay,stay / right,left" },
      { in: "steps=4, arrLen=2", out: "8" },
    ],
    constraints: ["1 ≤ steps ≤ 500", "1 ≤ arrLen ≤ 10^6", "return the count modulo 10^9 + 7"],
    recognize:
      "Counting walks of fixed length that return to the origin without leaving bounds → a 2-D DP over (steps remaining, current index), with the crucial pruning that the index can never exceed `steps/2` (you must walk back).",
    figureItOut: [
      "**State**: `dp[s][p]` = the number of ways to be at index `p` after `s` steps (starting from index 0 at step 0). Index and step count together determine the remaining possibilities.",
      "**Recurrence**: each step the pointer arrives at `p` from `p` (stayed), `p-1` (moved right), or `p+1` (moved left), so `dp[s][p] = dp[s-1][p] + dp[s-1][p-1] + dp[s-1][p+1]`, with the neighbor terms dropped when out of bounds, all mod 10^9 + 7.",
      "**Base case**: `dp[0][0] = 1` (before any step you are at index 0), and `dp[0][p] = 0` for p > 0.",
      "**Fill / pruning**: to return to 0 within `steps` steps you can never go farther right than `steps/2` (each unit right needs a matching left). So cap the reachable width at `maxPos = min(arrLen - 1, steps / 2)`, making the DP O(steps · maxPos) rather than O(steps · arrLen) — essential because arrLen can be 10^6.",
      "The answer is `dp[steps][0]` mod 10^9 + 7.",
    ],
    approaches: [
      {
        name: "2-D DP over (step, index) with width pruning (optimal)",
        intuition: "Count arrangements per index per step; since you must return to 0, indices beyond steps/2 are unreachable and pruned away.",
        time: "O(steps · min(arrLen, steps/2))",
        timeWhy: "Each of the steps rows fills only the reachable prefix of width about steps/2.",
        space: "O(min(arrLen, steps/2))",
        spaceWhy: "Two rolling rows of width maxPos+1; the prior step row is enough.",
        code: `int numWays(int steps, int arrLen) {
    int MOD = 1_000_000_007;
    int maxPos = Math.min(arrLen - 1, steps / 2);
    long[] dp = new long[maxPos + 1];
    dp[0] = 1;
    for (int s = 1; s <= steps; s++) {
        long[] next = new long[maxPos + 1];
        for (int p = 0; p <= maxPos; p++) {
            long ways = dp[p];
            if (p > 0) ways += dp[p - 1];
            if (p < maxPos) ways += dp[p + 1];
            next[p] = ways % MOD;
        }
        dp = next;
    }
    return (int) dp[0];
}`,
        walkthrough: [
          "steps=2, arrLen=4. maxPos = min(3, 1) = 1. dp=[1,0] (step 0).",
          "s=1: next[0]=dp[0]+dp[1]=1+0=1; next[1]=dp[1]+dp[0]=0+1=1. dp=[1,1].",
          "s=2: next[0]=dp[0]+dp[1]=1+1=2; next[1]=dp[1]+dp[0]=1+1=2. dp=[2,2].",
          "Answer dp[0] = 2.",
        ],
      },
    ],
    edgeCases: [
      "arrLen == 1 → the pointer can only stay; exactly one way regardless of steps.",
      "Odd steps with arrLen large → you can still return to 0 (use a stay step to fix parity); the DP handles it naturally.",
      "Huge arrLen (10^6) but small steps → pruning to steps/2 keeps the table tiny; never allocate width arrLen.",
    ],
    twists: [
      "**Return to a target index t instead of 0** → same DP, read dp[steps][t]; pruning width must cover t.",
      "**Only left/right (no stay)** → a parity constraint appears: returning to 0 requires an even number of steps.",
      "**Count ending anywhere** → sum the final row instead of reading a single index.",
    ],
    related: ["unique-paths", "out-of-boundary-paths", "climbing-stairs"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "shortest-path-with-alternating-colors",
    title: "Shortest Path with Alternating Colors",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1129,
    statement:
      "A directed graph has `n` nodes `0..n-1`. Edges come in two colors: `redEdges[i] = [a, b]` is a red edge `a -> b`, and `blueEdges[i] = [a, b]` is a blue edge. Return an array `answer` of length `n` where `answer[x]` is the length of the **shortest path** from node 0 to node `x` such that edge colors **strictly alternate** along the path, or `-1` if no such path exists.",
    examples: [
      { in: "n=3, redEdges=[[0,1],[1,2]], blueEdges=[]", out: "[0,1,-1]", note: "0->1 is red (len 1); 1->2 is also red so cannot follow the red into 1, node 2 unreachable" },
      { in: "n=3, redEdges=[[0,1]], blueEdges=[[2,1]]", out: "[0,1,-1]" },
      { in: "n=3, redEdges=[[0,1],[0,2]], blueEdges=[[1,0]]", out: "[0,1,1]" },
    ],
    constraints: ["1 ≤ n ≤ 100", "0 ≤ redEdges.length, blueEdges.length ≤ 400", "edges may include self-loops and parallel edges"],
    recognize:
      "Shortest path with an extra constraint (last edge color) means the **state is (node, last color)**, not just node. Unweighted shortest path over that doubled state space → a **BFS** where each layer is one more edge.",
    figureItOut: [
      "The alternating rule means the cost of being at a node depends on the **color of the edge you arrived on**. So expand each node into two states: (node, arrived-red) and (node, arrived-blue). This doubling is what makes a plain BFS correct.",
      "Build two adjacency lists, one per color. From state (u, lastColor) you may only take an edge of the **opposite** color, landing in (v, oppositeColor).",
      "BFS from node 0 in **both** start states (it can begin a path with either color, and distance 0 to itself). Because all edges count as length 1, the first time BFS reaches any (node, color) state is its shortest distance in that state.",
      "`answer[x]` is the **minimum** over its two states (reached via red vs via blue), or -1 if neither state was ever visited. Node 0 is distance 0.",
    ],
    approaches: [
      {
        name: "BFS over (node, last-color) state (optimal)",
        intuition: "Double each node by the color of its incoming edge; BFS layers give shortest alternating-path lengths.",
        time: "O(n + E)",
        timeWhy: "Each of the 2n states and each colored edge is processed at most once.",
        space: "O(n + E)",
        spaceWhy: "Two adjacency lists, a 2-by-n distance table, and the BFS queue.",
        code: `int[] shortestAlternatingPaths(int n, int[][] redEdges, int[][] blueEdges) {
    List<List<Integer>> red = new ArrayList<>();
    List<List<Integer>> blue = new ArrayList<>();
    for (int i = 0; i < n; i++) { red.add(new ArrayList<>()); blue.add(new ArrayList<>()); }
    for (int[] e : redEdges) red.get(e[0]).add(e[1]);
    for (int[] e : blueEdges) blue.get(e[0]).add(e[1]);
    int[][] dist = new int[2][n];   // dist[0]=arrived via red, dist[1]=arrived via blue
    for (int[] row : dist) Arrays.fill(row, -1);
    dist[0][0] = 0;
    dist[1][0] = 0;
    Deque<int[]> queue = new ArrayDeque<>();
    queue.add(new int[]{0, 0});   // node 0, last color red
    queue.add(new int[]{0, 1});   // node 0, last color blue
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int node = cur[0], color = cur[1];
        List<List<Integer>> nextEdges = (color == 0) ? blue : red;
        int nextColor = 1 - color;
        for (int v : nextEdges.get(node)) {
            if (dist[nextColor][v] == -1) {
                dist[nextColor][v] = dist[color][node] + 1;
                queue.add(new int[]{v, nextColor});
            }
        }
    }
    int[] answer = new int[n];
    for (int x = 0; x < n; x++) {
        int r = dist[0][x], b = dist[1][x];
        if (r == -1) answer[x] = b;
        else if (b == -1) answer[x] = r;
        else answer[x] = Math.min(r, b);
    }
    return answer;
}`,
        walkthrough: [
          "n=3, redEdges=[[0,1],[0,2]], blueEdges=[[1,0]]. red:0->{1,2}; blue:1->{0}.",
          "Seed queue with (0,red) and (0,blue), dist[*][0]=0. answer[0]=0.",
          "From (0,red) take blue edges of 0 (none). From (0,blue) take red edges of 0 -> reach 1 and 2 as arrived-red, dist[0][1]=1, dist[0][2]=1.",
          "From (1,red) take blue edges of 1 -> 0 arrived-blue (already 0). Node 2 has no outgoing. Final: answer=[0,1,1].",
        ],
      },
    ],
    edgeCases: [
      "answer[0] is always 0 (the start, zero-length path).",
      "Self-loops and parallel edges are allowed; the visited check on (node, color) prevents reprocessing.",
      "A node reachable only by a non-alternating sequence stays -1.",
    ],
    twists: [
      "**More than two colors** → expand the state to (node, lastColor) over k colors; BFS still works.",
      "**Must end on a specific color** → read only that color row of dist for each node.",
      "**Weighted edges** → BFS no longer suffices; switch to Dijkstra over the (node, color) state.",
    ],
    related: ["course-schedule", "clone-graph", "word-ladder"],
  },

  {
    slug: "minimum-height-trees",
    title: "Minimum Height Trees",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 310,
    statement:
      "A tree of `n` nodes labeled `0..n-1` is given by `n-1` undirected `edges`. Choosing any node as the root yields a rooted tree of some height. Return the list of **all** root labels that minimize the tree height (the **Minimum Height Trees** roots). The answer has at most two nodes.",
    examples: [
      { in: "n=4, edges=[[1,0],[1,2],[1,3]]", out: "[1]", note: "rooting at the center node 1 gives height 1" },
      { in: "n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]", out: "[3,4]" },
      { in: "n=1, edges=[]", out: "[0]" },
    ],
    constraints: ["1 ≤ n ≤ 2·10^4", "edges.length == n - 1", "the input is guaranteed to be a tree", "no duplicate edges"],
    recognize:
      "The roots minimizing height are the **center(s)** of the tree, which lie at the middle of its longest path. Peeling leaves layer by layer until 1 or 2 nodes remain finds them → a **topological-style BFS** trimming degree-1 nodes.",
    figureItOut: [
      "The best roots sit at the **middle of the tree's longest path (its diameter)**. A path of length L has exactly one middle node if L is even and two if L is odd — which is why the answer is always 1 or 2 nodes.",
      "Find the center by **peeling leaves**: a leaf (degree 1) is always at the very end of some longest path, so it can never be a center. Remove all current leaves simultaneously, which exposes a new layer of leaves one level inward.",
      "Maintain a degree count for every node and a queue of current leaves. Repeatedly remove the whole current leaf layer, decrement neighbors degrees, and enqueue any neighbor that drops to degree 1, while tracking how many nodes remain.",
      "Stop when `remaining ≤ 2`; the nodes left in the queue / not yet removed are the centers. Handle n == 1 (the single node is the answer) and n == 2 (both nodes) as direct cases.",
    ],
    approaches: [
      {
        name: "Iterative leaf-trimming BFS toward the center (optimal)",
        intuition: "Centers are the last survivors when you repeatedly strip off all leaves; at most two remain.",
        time: "O(n)",
        timeWhy: "Each node and each of the n-1 edges is touched a constant number of times during trimming.",
        space: "O(n)",
        spaceWhy: "Adjacency sets, a degree array, and the leaf queue.",
        code: `List<Integer> findMinHeightTrees(int n, int[][] edges) {
    if (n == 1) return Collections.singletonList(0);
    if (n == 2) return Arrays.asList(0, 1);
    List<Set<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new HashSet<>());
    int[] degree = new int[n];
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
        degree[e[0]]++;
        degree[e[1]]++;
    }
    Deque<Integer> leaves = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (degree[i] == 1) leaves.add(i);
    int remaining = n;
    while (remaining > 2) {
        int size = leaves.size();
        remaining -= size;
        for (int s = 0; s < size; s++) {
            int leaf = leaves.poll();
            for (int nb : adj.get(leaf)) {
                if (--degree[nb] == 1) leaves.add(nb);
            }
        }
    }
    return new ArrayList<>(leaves);
}`,
        walkthrough: [
          "n=6, edges=[[3,0],[3,1],[3,2],[3,4],[5,4]]. degrees: 0,1,2,5 = 1; 4 = 2; 3 = 4. Initial leaves = {0,1,2,5}.",
          "remaining=6 > 2. Peel layer {0,1,2,5} (size 4), remaining=2. Decrement their neighbors: node 3 drops 4->1, node 4 drops 2->1; enqueue 3 and 4.",
          "remaining = 2, stop the loop.",
          "Leaves queue now holds {3,4} -> answer [3,4].",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → [0] (single node, height 0).",
      "n == 2 → [0,1] (both are centers of a 2-node path).",
      "A star graph → the single hub is the only MHT root.",
    ],
    twists: [
      "**Tree diameter** → the trimming depth (number of peel rounds) relates directly to the radius/diameter.",
      "**Weighted edges** → leaf-trimming no longer applies; compute the diameter with two DFS passes and find midpoints.",
      "**Return the minimum height too** → count peel rounds; the height equals that count.",
    ],
    related: ["graph-valid-tree", "number-of-connected-components-in-an-undirected-graph", "course-schedule"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "minimum-cost-to-make-at-least-one-valid-path-in-a-grid",
    title: "Minimum Cost to Make at Least One Valid Path in a Grid",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 1368,
    statement:
      "Each cell of an `m x n` `grid` holds a sign 1 (right), 2 (left), 3 (down), or 4 (up) pointing to the next cell you would step into for free. Following signs may form cycles or dead-ends. You may **change the sign of a cell at cost 1** (each cell at most once). Starting at the top-left `(0,0)`, return the **minimum total cost** to make a valid path that reaches the bottom-right `(m-1, n-1)`.",
    examples: [
      { in: "grid=[[1,1,1,1],[2,2,2,2],[1,1,1,1],[2,2,2,2]]", out: "3", note: "follow row 0 right to the end (free), pay 1 to go down, follow row 1 left (free), pay 1 to go down, etc." },
      { in: "grid=[[1,1,3],[3,2,2],[1,1,4]]", out: "0", note: "the signs already lead 0,0 to the bottom-right" },
      { in: "grid=[[1,2],[4,3]]", out: "1" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 100", "1 ≤ grid[i][j] ≤ 4"],
    recognize:
      "Edges cost 0 (follow the sign) or 1 (change the sign) → a shortest path on a graph with only weights 0 and 1. That is the textbook case for **0-1 BFS** with a deque, or Dijkstra.",
    figureItOut: [
      "Model each cell as a node. From a cell there are up to four outgoing edges (to its four neighbors). The edge to the neighbor the sign already points to costs **0**; the other three cost **1** (you would change the sign).",
      "This is single-source shortest path with edge weights in {0, 1}. **0-1 BFS** is ideal: use a double-ended queue, push 0-cost moves to the **front** (process before any 1-cost move at the same frontier) and 1-cost moves to the **back**.",
      "Maintain a `dist` grid initialized to infinity, `dist[0][0] = 0`. Pop the front cell; if its stored distance is stale (greater than dist), skip it. For each of the four directions, compute the move cost (0 if it matches the cell sign, else 1) and relax the neighbor; push front for cost 0, back for cost 1.",
      "When `(m-1, n-1)` is popped (or after the deque empties) `dist[m-1][n-1]` is the answer. 0-1 BFS guarantees each cell is finalized at its minimum cost because the deque keeps the frontier sorted by distance.",
    ],
    approaches: [
      {
        name: "0-1 BFS with a deque (optimal)",
        intuition: "Following the sign is free, changing it costs 1; a deque keeps free moves ahead of paid ones so the frontier stays distance-sorted.",
        time: "O(m · n)",
        timeWhy: "Each cell is finalized once; each of its four edges is relaxed a constant number of times.",
        space: "O(m · n)",
        spaceWhy: "The distance grid and the deque, both bounded by the number of cells.",
        code: `int minCost(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};   // sign 1=right,2=left,3=down,4=up
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    dist[0][0] = 0;
    Deque<int[]> dq = new ArrayDeque<>();
    dq.addFirst(new int[]{0, 0, 0});   // row, col, cost
    while (!dq.isEmpty()) {
        int[] cur = dq.pollFirst();
        int r = cur[0], c = cur[1], cost = cur[2];
        if (cost > dist[r][c]) continue;
        for (int d = 0; d < 4; d++) {
            int nr = r + dirs[d][0], nc = c + dirs[d][1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            int moveCost = (grid[r][c] == d + 1) ? 0 : 1;   // sign value d+1 matches direction d
            int nd = cost + moveCost;
            if (nd < dist[nr][nc]) {
                dist[nr][nc] = nd;
                if (moveCost == 0) dq.addFirst(new int[]{nr, nc, nd});
                else dq.addLast(new int[]{nr, nc, nd});
            }
        }
    }
    return dist[m - 1][n - 1];
}`,
        walkthrough: [
          "grid=[[1,2],[4,3]]. dirs indexed so d=0 right (sign1), d=1 left (sign2), d=2 down (sign3), d=3 up (sign4). dist[0][0]=0.",
          "Pop (0,0,0). grid[0][0]=1 -> right (to (0,1)) costs 0: dist[0][1]=0, addFirst. Down to (1,0) costs 1: dist[1][0]=1, addLast.",
          "Pop (0,1,0). grid[0][1]=2 -> left is free back to (0,0) (already 0). Down to (1,1) costs 1: dist[1][1]=1, addLast.",
          "Pop (1,0,1) and (1,1,1) refine nothing smaller. Answer dist[1][1] = 1.",
        ],
      },
    ],
    edgeCases: [
      "1x1 grid → start equals target, cost 0.",
      "Signs already forming a full valid path → cost 0 (example 2).",
      "Worst case every step needs a change → cost up to (m-1)+(n-1); 0-1 BFS still finds the minimum.",
    ],
    twists: [
      "**Dijkstra** → also solves it; 0-1 BFS is the specialized, faster version for {0,1} weights.",
      "**Each cell changeable multiple times at cost 1 each** → same model since a shortest path never revisits a cell beneficially.",
      "**Diagonal moves allowed** → add directions and corresponding sign semantics; the 0-1 structure persists.",
    ],
    related: ["swim-in-rising-water", "path-with-minimum-effort", "network-delay-time"],
  },

  {
    slug: "regions-cut-by-slashes",
    title: "Regions Cut By Slashes",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 959,
    statement:
      "An `n x n` `grid` is described by strings of the characters `/`, `\\\\`, and space. Each character divides its 1x1 cell into regions. Return the **total number of regions** the slashes carve the whole grid into.",
    examples: [
      { in: 'grid=[" /","/ "]', out: "2" },
      { in: 'grid=[" /","  "]', out: "1" },
      { in: 'grid=["/\\\\\\\\","\\\\\\\\/"]', out: "5", note: "the two backslash/slash cells split into five regions" },
    ],
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 30", "each grid[i][j] is one of /, backslash, or a space"],
    recognize:
      "Counting connected regions formed by diagonal cuts → split each cell into **4 triangular sub-cells** (top/right/bottom/left) and merge them with **Union-Find**; the number of regions is the count of disjoint sets at the end.",
    figureItOut: [
      "Each 1x1 cell is cut into four triangles: index them 0=top, 1=right, 2=bottom, 3=left. A slash or backslash decides which of these four triangles are joined within the cell, and absence of a slash joins all four.",
      "Build a Union-Find over `4 * n * n` triangles. **Within a cell** at (r,c) with base index `4*(r*n + c)`: a space unions all four (0,1,2,3); a `/` unions top+left (0,3) and right+bottom (1,2); a backslash unions top+right (0,1) and left+bottom (2,3).",
      "**Across cells** the shared border must merge triangles regardless of slashes: the bottom triangle (2) of (r,c) unions with the top triangle (0) of (r+1,c); the right triangle (1) of (r,c) unions with the left triangle (3) of (r,c+1).",
      "After all unions, the number of **distinct roots** among the 4*n*n triangles is the number of regions. (Equivalently, regions = total triangles minus the number of successful unions.)",
    ],
    approaches: [
      {
        name: "Split into 4 triangles + Union-Find (optimal)",
        intuition: "Turn diagonal cuts into connectivity by quartering each cell; slashes decide intra-cell merges, shared borders decide inter-cell merges, and regions are the leftover components.",
        time: "O(n^2 · α)",
        timeWhy: "A constant number of near-constant-time union/find operations per cell over n^2 cells.",
        space: "O(n^2)",
        spaceWhy: "The Union-Find parent array of size 4*n*n.",
        code: `int regionsBySlashes(String[] grid) {
    int n = grid.length;
    int[] parent = new int[4 * n * n];
    for (int i = 0; i < parent.length; i++) parent[i] = i;
    int count = 4 * n * n;
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            int base = 4 * (r * n + c);
            char ch = grid[r].charAt(c);
            char back = (char) 92;   // the backslash character, written without a literal escape
            // intra-cell unions
            if (ch == '/') {
                count -= union(parent, base + 0, base + 3);
                count -= union(parent, base + 1, base + 2);
            } else if (ch == back) {
                count -= union(parent, base + 0, base + 1);
                count -= union(parent, base + 2, base + 3);
            } else {
                count -= union(parent, base + 0, base + 1);
                count -= union(parent, base + 1, base + 2);
                count -= union(parent, base + 2, base + 3);
            }
            // inter-cell unions (bottom-to-top with below, right-to-left with right)
            if (r + 1 < n) {
                int below = 4 * ((r + 1) * n + c);
                count -= union(parent, base + 2, below + 0);
            }
            if (c + 1 < n) {
                int right = 4 * (r * n + (c + 1));
                count -= union(parent, base + 1, right + 3);
            }
        }
    }
    return count;
}
int find(int[] parent, int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
int union(int[] parent, int a, int b) {
    int ra = find(parent, a), rb = find(parent, b);
    if (ra == rb) return 0;
    parent[ra] = rb;
    return 1;
}`,
        walkthrough: [
          'grid=[" /","/ "]. n=2, start count = 4*4 = 16 triangles.',
          "Cell (0,0)= space: union all four -> 3 merges, count 16->13. Cell (0,1)= /: union 0-3 and 1-2 -> 2 merges, count 13->11.",
          "Inter-cell from (0,0): below (1,0) bottom-to-top union, and right (0,1) right-to-left union -> 2 merges, count 11->9. Cell (1,0)= /: 2 merges -> 7. Cell (1,1)= space: 3 merges -> 4. Remaining inter-cell unions from row-1/col-1 borders merge across, netting 2 more merges -> count 2.",
          "Final disjoint components = 2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "All spaces → the whole grid is one region.",
      "n == 1 with a single slash → splits the one cell into 2 regions.",
      "Backslash appears in the input as a single backslash character; in Java source it is written as an escaped pair.",
    ],
    twists: [
      "**Scale-up to a 3x3 pixel grid + flood fill** → an alternative model: expand each cell to a 3x3 block, mark the diagonal, then count zero-components with DFS.",
      "**Count region areas, not just the number** → track component sizes in the Union-Find.",
      "**Curved cuts or more cut types** → refine each cell into more sub-cells before unioning.",
    ],
    related: ["number-of-islands", "number-of-provinces", "graph-valid-tree"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "additive-number",
    title: "Additive Number",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 306,
    statement:
      "A string of digits is an **additive number** if its digits can be split into a sequence of at least three numbers where every number (from the third on) equals the **sum of the two preceding** numbers. Numbers may not have leading zeros (except the single digit 0). Given a digit string `num`, return whether it is an additive number.",
    examples: [
      { in: 'num="112358"', out: "true", note: "1, 1, 2, 3, 5, 8 — each is the sum of the prior two" },
      { in: 'num="199100199"', out: "true", note: "1, 99, 100, 199 — 1+99=100, 99+100=199" },
      { in: 'num="1023"', out: "false", note: "no split satisfies the additive rule without an illegal leading zero" },
    ],
    constraints: ["1 ≤ num.length ≤ 35", "num consists only of digits 0-9"],
    recognize:
      "The whole sequence is fixed once you choose the **first two numbers**; everything after is forced. So enumerate every split of the first two numbers and **backtrack/verify** the forced chain → bounded brute force over two prefixes plus a deterministic check.",
    figureItOut: [
      "Crucial observation: as soon as the first two numbers are chosen, the third must be their sum, the fourth the sum of the second and third, and so on. The entire sequence is **determined**. So the only freedom is where the first and second numbers end.",
      "Enumerate the first number as `num[0..i)` and the second as `num[i..j)` for all valid split points. Reject any candidate with a **leading zero** (length > 1 starting with 0).",
      "From a chosen (first, second) pair, **recursively/iteratively verify**: compute `sum = first + second`, check that the remaining string starts with the decimal form of `sum`; if so, advance (second becomes first, sum becomes second) and continue until the string is fully consumed.",
      "If any starting pair leads to a complete valid consumption of the string (with at least three numbers total), return true. If all pairs fail, return false. Use `long` (or BigInteger for the 35-digit upper bound) to hold the running sums safely.",
    ],
    approaches: [
      {
        name: "Enumerate first two numbers, verify the forced chain (optimal)",
        intuition: "Only the first two numbers are free; try every prefix pair and let the additive rule deterministically validate the rest.",
        time: "O(n^3)",
        timeWhy: "O(n^2) choices for the first two split points, each verified by a linear scan over the remaining string.",
        space: "O(n)",
        spaceWhy: "Recursion depth / substring work bounded by the string length (ignoring the implicit big-number strings).",
        code: `boolean isAdditiveNumber(String num) {
    int n = num.length();
    for (int i = 1; i <= n / 2; i++) {
        if (num.charAt(0) == '0' && i > 1) break;   // leading zero in first number
        for (int j = i + 1; n - j >= Math.max(i, j - i); j++) {
            if (num.charAt(i) == '0' && j - i > 1) break;   // leading zero in second
            long first = Long.parseLong(num.substring(0, i));
            long second = Long.parseLong(num.substring(i, j));
            if (check(num, first, second, j)) return true;
        }
    }
    return false;
}
boolean check(String num, long first, long second, int start) {
    if (start == num.length()) return true;
    long sum = first + second;
    String sumStr = Long.toString(sum);
    if (!num.startsWith(sumStr, start)) return false;
    return check(num, second, sum, start + sumStr.length());
}`,
        walkthrough: [
          'num="112358". Try first="1" (i=1), second="1" (j=2).',
          "check from index 2: sum=1+1=2, num starts with \"2\" at index 2 -> advance to index 3 with first=1, second=2.",
          "index 3: sum=1+2=3, matches \"3\" -> index 4 with first=2,second=3. index 4: sum=5 matches \"5\" -> index 5. index 5: sum=3+5=8 matches \"8\" -> index 6.",
          "index 6 == length -> return true.",
        ],
      },
    ],
    edgeCases: [
      'Leading zeros: "1023" fails because any split forces an illegal zero-led number or a sum mismatch.',
      'A number like "000" is true (0, 0, 0) since single-digit 0 is allowed.',
      "Strings shorter than 3 digits can never form three numbers → false.",
    ],
    twists: [
      "**Return the actual sequence** → record the split points along the successful branch.",
      "**Splitting a string into the Fibonacci sequence (LeetCode 842)** → same idea but numbers must fit in a 32-bit int and you return the list.",
      "**Allow leading zeros** → drop the zero checks; the search space grows but the verification is unchanged.",
    ],
    related: ["splitting-a-string-into-descending-consecutive-values", "restore-ip-addresses", "word-break-ii"],
  },

  {
    slug: "splitting-a-string-into-descending-consecutive-values",
    title: "Splitting a String Into Descending Consecutive Values",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 1849,
    statement:
      "Given a string `s` of digits, decide whether it can be split into a sequence of **two or more** non-empty substrings whose numeric values are **strictly descending** and where each adjacent pair differs by exactly **1** (each value is exactly one less than the previous). Leading zeros are allowed when interpreting a substring as a number. Return true or false.",
    examples: [
      { in: 's="1234"', out: "false", note: "no split gives values each exactly 1 less than the previous" },
      { in: 's="050043"', out: "true", note: "5, 04, 3 -> values 5, 4, 3 (leading zeros allowed)" },
      { in: 's="9080701"', out: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 20", "s consists of only digits 0-9"],
    recognize:
      "Once the **first** number is fixed, every later number is forced to be exactly one less, so this is **backtracking over the length of the first piece**, then a deterministic descend-by-one verification of the rest.",
    figureItOut: [
      "The defining freedom is the **first number**: choose its length, parse its value, and from then on every subsequent piece must equal `previous - 1`. So the search branches only on where the first substring ends.",
      "Backtracking: try each prefix `s[0..i)` as the first value. For each choice, recursively check whether the remaining suffix can be split so that the next value is exactly `value - 1`, then `value - 2`, and so on.",
      "Recursive verification on (start index, expected value): scan forward forming numbers; a piece matches if `s[start..end)` parsed as a (possibly zero-padded) number equals the expected value. If it matches, recurse from `end` with `expected - 1`. Because values can be up to 10^20 worst case, parse with `long` (length ≤ 20 keeps individual pieces within long when expected stays small after the first).",
      "**Base / success**: if you consume the entire string AND used at least two pieces, return true. Prune: a piece longer than the remaining string, or whose value cannot match the expected (e.g. expected is negative), fails that branch.",
    ],
    approaches: [
      {
        name: "Backtracking on first piece, then descend-by-one (optimal)",
        intuition: "Fix the first number by trying each prefix; the rest is forced to decrease by exactly one, so verification is deterministic.",
        time: "O(n^2)",
        timeWhy: "n choices for the first piece, each followed by a linear forced scan (substring/parse work folded in).",
        space: "O(n)",
        spaceWhy: "Recursion depth bounded by the number of pieces (at most n).",
        code: `boolean splitString(String s) {
    int n = s.length();
    for (int i = 1; i < n; i++) {   // first piece is s[0..i), must leave at least one more piece
        long first = Long.parseLong(s.substring(0, i));
        if (backtrack(s, i, first)) return true;
    }
    return false;
}
boolean backtrack(String s, int start, long prev) {
    if (start == s.length()) return true;   // consumed everything after at least one earlier piece
    long expected = prev - 1;
    if (expected < 0) return false;
    for (int end = start + 1; end <= s.length(); end++) {
        long val = Long.parseLong(s.substring(start, end));
        if (val == expected) {
            if (backtrack(s, end, val)) return true;
        }
        if (val > expected) break;   // longer substrings only grow, no point continuing
    }
    return false;
}`,
        walkthrough: [
          's="050043". Try first piece s[0..1)="0" -> first=0; backtrack needs next = -1, impossible.',
          'Try first piece s[0..2)="05"=5 -> backtrack from index 2 expecting 4. Scan: "0"=0 no, "00"=0 no, "004"=4 yes at end=5 -> recurse from 5 expecting 3.',
          'From index 5 expecting 3: "3"=3 matches at end=6 -> recurse from 6.',
          "index 6 == length -> return true. Overall answer true (5,04,3).",
        ],
      },
    ],
    edgeCases: [
      'A single character (n == 1) → cannot split into two pieces → false.',
      'Leading zeros are allowed: "10009998" can use "100","099","98"? values must be 100,99,98 — the parser ignores leading zeros so "099"=99 works.',
      "Values can exceed int for long prefixes; parse pieces as long, and stop early when a candidate value overshoots the expected.",
    ],
    twists: [
      "**Ascending by one** → mirror the logic with expected = prev + 1.",
      "**Arbitrary fixed step d** → expected = prev - d; the search structure is unchanged.",
      "**Additive Number (LeetCode 306)** → instead of a fixed step, each value is the sum of the two before it.",
    ],
    related: ["additive-number", "restore-ip-addresses", "word-break-ii"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "non-decreasing-array",
    title: "Non-decreasing Array",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 665,
    statement:
      "Given an integer array `nums`, determine whether you can make it **non-decreasing** by modifying **at most one** element (changing it to any value). An array is non-decreasing if `nums[i] ≤ nums[i+1]` for every adjacent pair.",
    examples: [
      { in: "nums=[4,2,3]", out: "true", note: "change 4 to 1 (or 2) -> [1,2,3]" },
      { in: "nums=[4,2,1]", out: "false", note: "two separate fixes are needed" },
      { in: "nums=[3,4,2,3]", out: "false" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^4", "-10^5 ≤ nums[i] ≤ 10^5"],
    recognize:
      "At most one fix is allowed, so the moment you see a second descent it is impossible. The only subtlety is **how** to fix the first descent — lower the earlier element or raise the later one — which a single greedy decision resolves.",
    figureItOut: [
      "Scan adjacent pairs. Count how many times `nums[i] > nums[i+1]` (a **descent**). If that happens more than once, one modification can never fix both → return false.",
      "When the first (and only allowed) descent is found at index `i`, you must decide which element to change. Greedily prefer to **lower `nums[i]` down to `nums[i+1]`** because that keeps the later values as small as possible, preserving future non-decreasing room.",
      "The exception: if lowering `nums[i]` would break the pair behind it — i.e. `i > 0` and `nums[i-1] > nums[i+1]` — then you cannot bring `nums[i]` down that far without violating `nums[i-1] ≤ nums[i]`. In that case **raise `nums[i+1]` up to `nums[i]`** instead.",
      "Apply the chosen fix in place and continue scanning; if the whole array is traversed with at most one descent fixed, return true. (You can also just count descents and apply the fix logic to ensure the single change actually works.)",
    ],
    approaches: [
      {
        name: "Single greedy pass fixing the first descent (optimal)",
        intuition: "One descent is fixable; on hitting it, lower the earlier value when the element two-back permits, otherwise raise the later value, and a second descent means failure.",
        time: "O(n)",
        timeWhy: "One linear pass over adjacent pairs.",
        space: "O(1)",
        spaceWhy: "A descent counter and in-place edits only.",
        code: `boolean checkPossibility(int[] nums) {
    int count = 0;
    for (int i = 0; i + 1 < nums.length; i++) {
        if (nums[i] > nums[i + 1]) {
            count++;
            if (count > 1) return false;
            if (i == 0 || nums[i - 1] <= nums[i + 1]) {
                nums[i] = nums[i + 1];          // lower the earlier element
            } else {
                nums[i + 1] = nums[i];          // raise the later element
            }
        }
    }
    return true;
}`,
        walkthrough: [
          "nums=[3,4,2,3]. i=0: 3<=4 ok. i=1: 4>2 descent, count=1. i-1=3, nums[i+1]=2, 3<=2 false -> raise: nums[2]=4 -> array [3,4,4,3].",
          "i=2: 4>3 descent, count=2 -> return false.",
          "So [3,4,2,3] is not fixable with one change.",
          "Contrast [4,2,3]: i=0 descent, i==0 so lower nums[0]=2 -> [2,2,3]; rest ok, count stays 1 -> true.",
        ],
      },
    ],
    edgeCases: [
      "Length 1 or 2 → always true (zero or one pair, fixable trivially).",
      "Already non-decreasing → zero descents → true.",
      "Two descents anywhere → false (e.g. [4,2,1]).",
    ],
    twists: [
      "**At most k modifications** → counting descents alone is insufficient; needs a more careful DP/greedy.",
      "**Make strictly increasing** → change the comparison to >= and fix toward strict order (watch equal neighbors).",
      "**Minimum number of changes to sort** → a different, harder optimization than the at-most-one feasibility check.",
    ],
    related: ["jump-game", "maximum-subarray", "wiggle-subsequence"],
  },

  {
    slug: "remove-k-digits",
    title: "Remove K Digits",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 402,
    statement:
      "Given a non-negative integer represented as a string `num` and an integer `k`, remove exactly `k` digits so that the **remaining number is the smallest possible**. Return that smallest number as a string (without leading zeros; return `\"0\"` if the result is empty).",
    examples: [
      { in: 'num="1432219", k=3', out: '"1219"', note: "remove 4, 3, and one 2 to get 1219" },
      { in: 'num="10200", k=1', out: '"200"', note: "remove the 1, leading zero of 0200 stripped" },
      { in: 'num="10", k=2', out: '"0"', note: "remove both digits, empty result becomes 0" },
    ],
    constraints: ["1 ≤ k ≤ num.length ≤ 10^5", "num consists of only digits", "num has no leading zeros except num itself may be \"0\""],
    recognize:
      "To minimize the number, you want each higher-place digit as small as possible, so a digit should be removed whenever a **larger digit precedes a smaller one** → a **monotonic increasing stack** that greedily pops bigger digits while removals remain.",
    figureItOut: [
      "Place value dominates: a digit in a more significant position weighs far more, so the result is smallest when its leftmost digits are as small as possible. That means: whenever a digit is **greater than the digit to its right**, removing the greater one shrinks a high place value — a clear win.",
      "Maintain a stack (the digits kept so far, left to right). For each incoming digit, while you still have removals left (`k > 0`) and the **top of the stack is greater than the current digit**, pop the top (that is one removal). Then push the current digit.",
      "After the scan, if removals remain (`k > 0`), the kept digits are already non-decreasing, so the largest contributions are at the end → **remove from the back** (pop the last `k`).",
      "Finally build the string from the stack, **strip leading zeros**, and if nothing is left return \"0\". This greedy is optimal because every pop removes the most significant possible excess at the moment it is detected.",
    ],
    approaches: [
      {
        name: "Monotonic increasing stack (optimal)",
        intuition: "Keep digits non-decreasing left to right by popping any larger digit that precedes a smaller one, spending removals where they cut the highest place value.",
        time: "O(n)",
        timeWhy: "Each digit is pushed and popped at most once across the whole scan.",
        space: "O(n)",
        spaceWhy: "The stack of kept digits, up to the input length.",
        code: `String removeKdigits(String num, int k) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char d : num.toCharArray()) {
        while (k > 0 && !stack.isEmpty() && stack.peekLast() > d) {
            stack.pollLast();
            k--;
        }
        stack.addLast(d);
    }
    while (k > 0) {        // still need to remove: drop from the back (digits are non-decreasing)
        stack.pollLast();
        k--;
    }
    StringBuilder sb = new StringBuilder();
    boolean leadingZero = true;
    for (char d : stack) {
        if (leadingZero && d == '0') continue;
        leadingZero = false;
        sb.append(d);
    }
    return sb.length() == 0 ? "0" : sb.toString();
}`,
        walkthrough: [
          'num="1432219", k=3. Push 1. Next 4: 1<4 push -> [1,4].',
          "Next 3: top 4>3, pop 4 (k=2); top 1<3 push -> [1,3]. Next 2: top 3>2 pop (k=1); top 1<2 push -> [1,2]. Next 2: top 2 not > 2, push -> [1,2,2].",
          "Next 1: top 2>1 pop (k=0); push 1 -> [1,2,1]. Next 9: k=0 so just push -> [1,2,1,9].",
          'k is 0, no back removal. No leading zeros. Result "1219".',
        ],
      },
    ],
    edgeCases: [
      'k == num.length → remove everything → "0".',
      'Leading zeros after removal (e.g. "10200", k=1 -> "0200") must be stripped to "200".',
      "Already non-decreasing digits (e.g. \"12345\", k=2) → no pops during the scan, remove the last k from the back.",
    ],
    twists: [
      "**Remove digits to make the LARGEST number** → flip the comparison to pop smaller digits (a monotonic decreasing stack).",
      "**Create Maximum Number (LeetCode 321)** → merge two arrays after picking best subsequences using this same stack idea.",
      "**Keep exactly m digits instead of removing k** → set k = n - m and run the identical algorithm.",
    ],
    related: ["maximum-subarray", "jump-game-ii", "gas-station"],
  },
];
