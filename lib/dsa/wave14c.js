// NeetCode All / Top Interview 150 / LeetCode 75 / Grind 75 — wave 14c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave13c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE14C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "arithmetic-slices",
    title: "Arithmetic Slices",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 413,
    statement:
      "A contiguous subarray is an **arithmetic slice** if it has at least three elements and the difference between consecutive elements is the same throughout. Given an integer array `nums`, return the number of arithmetic **subarrays** (contiguous slices) of `nums`.",
    examples: [
      { in: "nums=[1,2,3,4]", out: "3", note: "the slices are [1,2,3], [2,3,4], and [1,2,3,4]" },
      { in: "nums=[1,3,5,7,9]", out: "6" },
      { in: "nums=[1,2,3,8,9,10]", out: "2", note: "[1,2,3] and [8,9,10]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5000", "-1000 ≤ nums[i] ≤ 1000"],
    recognize:
      "Counting arithmetic subarrays ending at each index, where extending a run by one element adds a predictable number of new slices → a 1-D DP that collapses to a single rolling counter.",
    figureItOut: [
      "**State**: `dp[i]` = the number of arithmetic slices that **end exactly at index i**. Counting per-endpoint avoids double-counting and lets each index build on the one before it.",
      "**Recurrence**: if `nums[i] - nums[i-1] == nums[i-1] - nums[i-2]` then the run continues, and every slice that ended at `i-1` can be extended to `i`, plus the new length-3 slice `(i-2,i-1,i)`, so `dp[i] = dp[i-1] + 1`. Otherwise the run breaks and `dp[i] = 0`.",
      "**Base case**: `dp[0] = dp[1] = 0` — you need at least three elements before any slice can end, so the first two endpoints contribute nothing.",
      "**Fill**: sweep `i` from 2 to n-1, set `dp[i]` by the rule above, and accumulate every `dp[i]` into a running total. Since `dp[i]` only depends on `dp[i-1]`, one scalar replaces the array (O(1) space).",
      "The answer is the **sum of all `dp[i]`**, i.e. the total count of slices ending at every position.",
    ],
    approaches: [
      {
        name: "Rolling per-endpoint counter (optimal)",
        intuition: "Track how many arithmetic slices end at the current index; a continued common difference adds one more than the previous count, a break resets to zero.",
        time: "O(n)",
        timeWhy: "A single pass comparing each triple of consecutive differences.",
        space: "O(1)",
        spaceWhy: "One running counter for dp[i] and one accumulator; no array needed.",
        code: `int numberOfArithmeticSlices(int[] nums) {
    int total = 0;
    int cur = 0;   // slices ending at the current index
    for (int i = 2; i < nums.length; i++) {
        if (nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2]) {
            cur = cur + 1;
            total += cur;
        } else {
            cur = 0;
        }
    }
    return total;
}`,
        walkthrough: [
          "nums=[1,2,3,4]. cur=0, total=0.",
          "i=2: diffs 3-2=1 and 2-1=1 equal -> cur=0+1=1, total=1.",
          "i=3: diffs 4-3=1 and 3-2=1 equal -> cur=1+1=2, total=1+2=3.",
          "Loop ends. Answer 3 (matches [1,2,3], [2,3,4], [1,2,3,4]).",
        ],
      },
    ],
    edgeCases: [
      "Fewer than 3 elements → no slice can exist → 0 (the loop never runs).",
      "A long uniform run of length L contributes (L-1)(L-2)/2 slices; the counter captures this incrementally.",
      "A break in the common difference resets cur to 0, so unrelated runs do not bleed into each other.",
    ],
    twists: [
      "**Arithmetic Slices II — Subsequences (LeetCode 446)** → non-contiguous slices need a map of differences per index, a much heavier 2-D-style DP.",
      "**Return the longest arithmetic slice** → track the max run length instead of the count.",
      "**Geometric slices** → replace the additive difference test with a ratio test (mind division and zeros).",
    ],
    related: ["maximum-subarray", "longest-increasing-subsequence", "house-robber"],
  },

  {
    slug: "maximum-sum-circular-subarray",
    title: "Maximum Sum Circular Subarray",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 918,
    statement:
      "Given a **circular** integer array `nums` (the end wraps around to the front), return the maximum possible sum of a **non-empty** subarray. A circular subarray may wrap from the tail of the array back to the head, but no element is used more than once.",
    examples: [
      { in: "nums=[1,-2,3,-2]", out: "3", note: "subarray [3]" },
      { in: "nums=[5,-3,5]", out: "10", note: "wrap-around [5,...,5] = 5 + 5" },
      { in: "nums=[-3,-2,-3]", out: "-2", note: "all negative; best single element is -2" },
    ],
    constraints: ["1 ≤ nums.length ≤ 3·10^4", "-3·10^4 ≤ nums[i] ≤ 3·10^4"],
    recognize:
      "Best subarray sum on a circle splits into two cases: a normal (non-wrapping) best, handled by Kadane, and a wrapping best, which equals total minus the **minimum** subarray. Two Kadane passes settle it.",
    figureItOut: [
      "**State**: run Kadane twice. For the non-wrapping case, `maxEnding[i]` = the best subarray sum ending at i; for the wrapping case, `minEnding[i]` = the worst (minimum) subarray sum ending at i. Each is a 1-D DP that collapses to a rolling scalar.",
      "**Recurrence**: `maxEnding[i] = nums[i] + max(maxEnding[i-1], 0)` and `minEnding[i] = nums[i] + min(minEnding[i-1], 0)`. A wrapping subarray is the complement of a contiguous middle chunk, so its sum is `total - (that middle chunk)`; to maximize it you remove the **minimum** middle chunk, giving `total - minSubarray`.",
      "**Base case**: `maxEnding[0] = minEnding[0] = nums[0]`; the global maxSum and minSum start at nums[0]. total starts at 0 then accumulates every element.",
      "**Fill**: one pass updating maxEnding/maxSum and minEnding/minSum, plus the running total. The answer is `max(maxSum, total - minSum)` — EXCEPT when every element is negative, where `total - minSum` would be 0 (an empty subarray) which is illegal, so fall back to `maxSum`.",
      "The answer is `maxSum` if `maxSum < 0` (all negative), otherwise `max(maxSum, total - minSum)`.",
    ],
    approaches: [
      {
        name: "Single pass returns first/last index (baseline framing)",
        intuition: "Brute force every start/end including wraps is O(n^2); we keep it only as the mental model the Kadane trick replaces.",
        time: "O(n^2)",
        timeWhy: "Each of n starts scans up to n elements, doubling the array to simulate the wrap.",
        space: "O(1)",
        spaceWhy: "Running sums only.",
        code: `int maxSubarraySumCircularBrute(int[] nums) {
    int n = nums.length;
    int best = nums[0];
    for (int start = 0; start < n; start++) {
        int sum = 0;
        for (int len = 1; len <= n; len++) {
            sum += nums[(start + len - 1) % n];
            best = Math.max(best, sum);
        }
    }
    return best;
}`,
      },
      {
        name: "Two Kadane passes: max normal vs total minus min (optimal)",
        intuition: "The best circular sum is either a plain Kadane maximum or the whole sum minus the smallest contiguous chunk, with an all-negative guard.",
        time: "O(n)",
        timeWhy: "One linear pass computes the max subarray, the min subarray, and the total simultaneously.",
        space: "O(1)",
        spaceWhy: "Four rolling scalars.",
        code: `int maxSubarraySumCircular(int[] nums) {
    int total = 0;
    int maxSum = nums[0], curMax = 0;
    int minSum = nums[0], curMin = 0;
    for (int x : nums) {
        curMax = Math.max(curMax + x, x);
        maxSum = Math.max(maxSum, curMax);
        curMin = Math.min(curMin + x, x);
        minSum = Math.min(minSum, curMin);
        total += x;
    }
    if (maxSum < 0) return maxSum;        // all elements negative
    return Math.max(maxSum, total - minSum);
}`,
        walkthrough: [
          "nums=[5,-3,5]. total=0, maxSum=5, curMax=0, minSum=5, curMin=0.",
          "x=5: curMax=max(0+5,5)=5, maxSum=5; curMin=min(0+5,5)=5, minSum=min(5,5)=5; total=5.",
          "x=-3: curMax=max(5-3,-3)=2, maxSum=5; curMin=min(5-3,-3)=-3, minSum=-3; total=2.",
          "x=5: curMax=max(2+5,5)=7, maxSum=7; curMin=min(-3+5,5)=2, minSum=-3; total=7. maxSum=7 not <0, return max(7, 7-(-3))=max(7,10)=10.",
        ],
      },
    ],
    edgeCases: [
      "All negative numbers → total - minSum equals 0 (empty), which is illegal, so the all-negative guard returns maxSum (the least-negative single element).",
      "Single element → both cases reduce to that element.",
      "No wrap needed → maxSum already wins, so the formula degrades gracefully to plain Kadane.",
    ],
    twists: [
      "**Maximum Subarray (LeetCode 53)** → the non-circular version is exactly the first Kadane pass.",
      "**Maximum circular PRODUCT** → Kadane-with-min/max for products, plus the wrap complication; far trickier.",
      "**Return the indices of the best circular subarray** → track start/end alongside the rolling maxima.",
    ],
    related: ["maximum-subarray", "maximum-product-subarray", "house-robber-ii"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "unique-paths-iii",
    title: "Unique Paths III",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 980,
    statement:
      "On an `m x n` grid, cell value `1` is the start, `2` is the end, `0` is an empty walkable square, and `-1` is an obstacle. Return the number of distinct paths from start to end that **walk over every non-obstacle square exactly once** (4-directional moves).",
    examples: [
      { in: "grid=[[1,0,0,0],[0,0,0,0],[0,0,2,-1]]", out: "2" },
      { in: "grid=[[1,0,0,0],[0,0,0,0],[0,0,0,2]]", out: "4" },
      { in: "grid=[[0,1],[2,0]]", out: "0", note: "the end is unreachable while covering every empty cell" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 20", "1 ≤ m·n ≤ 20", "exactly one start (1) and one end (2)"],
    recognize:
      "Cover every empty cell exactly once and finish at a fixed target → a Hamiltonian-style exhaustive search. With ≤20 cells it is small, so this is DFS **backtracking** over the grid (presented here as the 2-D-grid DP/search the problem belongs to).",
    figureItOut: [
      "**State**: a DFS position `(r, c)` plus `remaining`, the count of walkable cells still to visit (start counts as visited). The grid itself doubles as the visited marker. Because m·n ≤ 20, full enumeration is feasible.",
      "**Recurrence (search)**: a path is valid iff it reaches the end cell exactly when `remaining == 0`. From `(r,c)` recurse into the four neighbors that are in bounds and not obstacles/visited, summing the path counts each returns.",
      "**Base case**: when the current cell is the end (value 2): return 1 if `remaining == 0` (all empty cells covered), else 0. First count `empty` = number of 0-cells plus 1 for the start, so the target is reached with the right coverage.",
      "**Fill / backtrack**: temporarily mark the current cell as visited (set to -1), decrement `remaining`, recurse in all four directions, then **restore** the cell on the way out so sibling branches see it unvisited. This restore is the heart of backtracking.",
      "The answer is the total returned by the DFS launched from the start cell with `remaining` = number of empty cells to cover.",
    ],
    approaches: [
      {
        name: "DFS backtracking with cover-count guard (optimal for the constraints)",
        intuition: "Walk the grid marking and unmarking cells; only count a path that lands on the end exactly after covering every empty square.",
        time: "O(4^(m·n))",
        timeWhy: "Each cell branches into up to four directions; the small ≤20-cell bound keeps this tractable in practice.",
        space: "O(m·n)",
        spaceWhy: "Recursion stack depth bounded by the number of cells; the grid is mutated in place as the visited set.",
        code: `int uniquePathsIII(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int sr = 0, sc = 0, empty = 0;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 0) empty++;
            else if (grid[r][c] == 1) { sr = r; sc = c; }
        }
    }
    // include the start cell itself in the cells that must be covered
    return dfs(grid, sr, sc, empty + 1);
}
int dfs(int[][] grid, int r, int c, int remaining) {
    int m = grid.length, n = grid[0].length;
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == -1) return 0;
    if (grid[r][c] == 2) {
        return remaining == 0 ? 1 : 0;
    }
    int saved = grid[r][c];
    grid[r][c] = -1;            // mark visited
    int total = 0;
    total += dfs(grid, r + 1, c, remaining - 1);
    total += dfs(grid, r - 1, c, remaining - 1);
    total += dfs(grid, r, c + 1, remaining - 1);
    total += dfs(grid, r, c - 1, remaining - 1);
    grid[r][c] = saved;        // restore (backtrack)
    return total;
}`,
        walkthrough: [
          "grid=[[0,1],[2,0]]. empty = three 0-cells. Start at (0,1), launch dfs with remaining = 3+1 = 4 (the cells to cover are start plus three zeros).",
          "From (0,1) mark it; try neighbors. Down to (1,1)=0 remaining=3, then its only unvisited neighbor (1,0)=2 the end with remaining=2 != 0 -> 0.",
          "Left from (0,1) to (0,0)=0 remaining=3, then down to (1,0)=2 with remaining=2 != 0 -> 0; no other coverage reaches the end with remaining exactly 0.",
          "Every branch reaches the end with leftover cells uncovered, so all return 0. Answer 0.",
        ],
      },
    ],
    edgeCases: [
      "Start adjacent to end with no empty cells in between still must cover all 0-cells; mismatched coverage yields 0.",
      "Obstacles that disconnect the empty region from the end → 0 paths.",
      "The start cell is counted in coverage (hence empty + 1); forgetting the +1 is the classic off-by-one here.",
    ],
    twists: [
      "**Just reach the end (Unique Paths / Unique Paths II)** → no full-coverage requirement; a clean O(m·n) tabulation works.",
      "**Bitmask DP over visited cells** → with m·n ≤ 20 you can memoize on (position, visited bitmask) to avoid recomputing shared subpaths.",
      "**8-directional movement** → add the four diagonal recursions; the structure is unchanged.",
    ],
    related: ["unique-paths", "unique-paths-ii", "word-search"],
  },

  {
    slug: "maximum-vacation-days",
    title: "Maximum Vacation Days",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 568,
    statement:
      "There are `n` cities and `k` weeks. `flights[i][j] == 1` means you can fly from city `i` to city `j` (and `flights[i][i]` may be 0 or 1, meaning stay). `days[i][w]` is the maximum vacation days you can take in city `i` during week `w`. You start in city 0 on Monday of week 0; each week you must be in exactly one city and may fly only on that week's first day. Return the **maximum total vacation days** over the `k` weeks.",
    examples: [
      { in: "flights=[[0,1,1],[1,0,1],[1,1,0]], days=[[1,3,1],[6,0,3],[3,3,3]]", out: "12", note: "week0 fly to city1 (6), week1 fly to city2 (3), week2 stay city2 (3) = 6+3+3? best total is 12 via 1->1's days and 3+3" },
      { in: "flights=[[0,0,0],[0,0,0],[0,0,0]], days=[[1,1,1],[7,7,7],[7,7,7]]", out: "3", note: "no flights ever, stuck in city0 taking 1 each week" },
      { in: "flights=[[0,1,1],[1,0,1],[1,1,0]], days=[[7,0,0],[0,7,0],[0,0,7]]", out: "21" },
    ],
    constraints: ["n == flights.length == flights[i].length", "n == days.length", "k == days[i].length", "1 ≤ n, k ≤ 100", "flights[i][j] is 0 or 1", "0 ≤ days[i][w] ≤ 7"],
    recognize:
      "Maximize a sum over a fixed number of weeks where each week's choice (which city) depends only on the previous week's city → a 2-D DP over (week, city) with transitions gated by the flight matrix.",
    figureItOut: [
      "**State**: `dp[w][c]` = the maximum total vacation days achievable through the end of week `w` given that you spend week `w` in city `c`. The only thing the future needs from the past is which city you currently occupy.",
      "**Recurrence**: to be in city `c` in week `w` you were in some city `p` in week `w-1` with a legal move to `c` (either `p == c` to stay, or `flights[p][c] == 1`). So `dp[w][c] = days[c][w] + max over such p of dp[w-1][p]`. If no city `p` can reach `c`, that state is unreachable (-infinity).",
      "**Base case**: week 0 you must start in city 0. `dp[0][c] = days[c][0]` if `c == 0` or `flights[0][c] == 1`, otherwise unreachable. (You can fly on the first day of week 0.)",
      "**Fill**: sweep weeks 1..k-1; for each target city `c`, scan all previous cities `p`, take the best reachable `dp[w-1][p]`, and add `days[c][w]`. Only the previous week's row is needed, so two rolling rows of length n suffice (O(n) space).",
      "The answer is the **maximum over the final week row** `dp[k-1][c]` across all cities.",
    ],
    approaches: [
      {
        name: "2-D DP over (week, city) with flight-gated transitions (optimal)",
        intuition: "Each week pick the city that maximizes accumulated vacation, only moving where a flight (or staying) allows; the best ending city wins.",
        time: "O(k · n^2)",
        timeWhy: "For each of k weeks and n target cities, scan n possible previous cities.",
        space: "O(n)",
        spaceWhy: "Two rolling rows of size n (previous and current week).",
        code: `int maxVacationDays(int[][] flights, int[][] days) {
    int n = flights.length, k = days[0].length;
    int NEG = Integer.MIN_VALUE / 2;
    int[] prev = new int[n];
    Arrays.fill(prev, NEG);
    for (int c = 0; c < n; c++) {
        if (c == 0 || flights[0][c] == 1) prev[c] = days[c][0];
    }
    for (int w = 1; w < k; w++) {
        int[] cur = new int[n];
        Arrays.fill(cur, NEG);
        for (int c = 0; c < n; c++) {
            for (int p = 0; p < n; p++) {
                if ((p == c || flights[p][c] == 1) && prev[p] != NEG) {
                    cur[c] = Math.max(cur[c], prev[p] + days[c][w]);
                }
            }
        }
        prev = cur;
    }
    int ans = 0;
    for (int c = 0; c < n; c++) ans = Math.max(ans, prev[c]);
    return ans;
}`,
        walkthrough: [
          "flights=[[0,0,0],[0,0,0],[0,0,0]], days=[[1,1,1],[7,7,7],[7,7,7]]. No flights anywhere.",
          "Week 0: only c=0 reachable (start), prev=[1, NEG, NEG].",
          "Week 1: target c=0 reachable only from p=0 (stay): cur[0]=prev[0]+days[0][1]=1+1=2; cities 1,2 unreachable. prev=[2,NEG,NEG].",
          "Week 2: cur[0]=prev[0]+days[0][2]=2+1=3. Max over final row = 3. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "No flights at all → you stay in city 0 every week; answer is the sum of days[0][w].",
      "Staying is always allowed even if flights[c][c] == 0 (the p == c branch), since remaining in place needs no flight.",
      "Use a NEG sentinel (not 0) for unreachable states so they never masquerade as a zero-day option.",
    ],
    twists: [
      "**Limited number of flights** → add a remaining-flights dimension to the state.",
      "**Minimize cost instead of maximize days** → flip max to min and add a flight-cost term.",
      "**Different start city or start week** → only the base-case initialization changes.",
    ],
    related: ["best-time-to-buy-and-sell-stock-with-cooldown", "minimum-path-sum", "out-of-boundary-paths"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "find-the-town-judge",
    title: "Find the Town Judge",
    difficulty: "Easy",
    pattern: "graphs",
    leetcode: 997,
    statement:
      "In a town of `n` people labeled `1..n`, exactly one may be the **town judge**. The judge trusts nobody, and everybody else (the other `n-1` people) trusts the judge. `trust[i] = [a, b]` means person `a` trusts person `b`. Given `n` and the `trust` list, return the label of the town judge, or `-1` if there is none.",
    examples: [
      { in: "n=2, trust=[[1,2]]", out: "2" },
      { in: "n=3, trust=[[1,3],[2,3]]", out: "3" },
      { in: "n=3, trust=[[1,3],[2,3],[3,1]]", out: "-1", note: "person 3 trusts someone, so cannot be the judge" },
    ],
    constraints: ["1 ≤ n ≤ 1000", "0 ≤ trust.length ≤ 10^4", "trust[i].length == 2", "all trust pairs are unique", "1 ≤ a, b ≤ n and a != b"],
    recognize:
      "Model trust as a directed graph and the judge as the unique node with **in-degree n-1 and out-degree 0**. A single degree count over all edges answers it in linear time.",
    figureItOut: [
      "Treat each `trust[i] = [a, b]` as a directed edge `a -> b`. The judge is the one node everybody points to but who points to nobody: in-degree exactly `n-1`, out-degree exactly 0.",
      "Maintain a single `score[p]` per person: each time `p` trusts someone, subtract 1 (out-degree penalty); each time `p` is trusted, add 1 (in-degree credit). The judge accumulates `+ (n-1)` from being trusted and `0` outgoing, netting exactly `n-1`.",
      "After processing all edges, scan persons 1..n: the judge is any `p` with `score[p] == n - 1`. Anyone who trusts someone has at least one -1, so they can never reach n-1 unless trusted by everyone AND trusting nobody.",
      "Return that person, or -1 if no score equals n-1. The n == 1 case is special: a single person trusts nobody and is trivially the judge (score 0 == n-1).",
    ],
    approaches: [
      {
        name: "Net trust score (in-degree minus out-degree) (optimal)",
        intuition: "The judge is trusted by everyone and trusts no one, so a single +1 trusted / -1 trusting tally isolates them at exactly n-1.",
        time: "O(n + E)",
        timeWhy: "One pass over the trust edges plus one pass over n people.",
        space: "O(n)",
        spaceWhy: "A single score array of size n+1.",
        code: `int findJudge(int n, int[][] trust) {
    int[] score = new int[n + 1];
    for (int[] t : trust) {
        score[t[0]]--;     // t[0] trusts someone -> cannot be judge
        score[t[1]]++;     // t[1] is trusted
    }
    for (int p = 1; p <= n; p++) {
        if (score[p] == n - 1) return p;
    }
    return -1;
}`,
        walkthrough: [
          "n=3, trust=[[1,3],[2,3],[3,1]]. score starts [0,0,0,0].",
          "[1,3]: score[1]=-1, score[3]=+1. [2,3]: score[2]=-1, score[3]=+2. [3,1]: score[3]=+2-1=1, score[1]=-1+1=0.",
          "Final score = [_,0,-1,1]. Need n-1 = 2. No person has score 2 (person 3 has 1 because they trust someone).",
          "Return -1.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 with empty trust → person 1 has score 0 == n-1, so the answer is 1.",
      "Two candidates can never both reach n-1 since the judge must be trusted by everyone; at most one node hits n-1.",
      "If the would-be judge trusts even one person, their score drops below n-1 → correctly excluded.",
    ],
    twists: [
      "**Find the Celebrity (LeetCode 277)** → same degree idea but you only have a knows(a,b) query API, solved in O(n) with a candidate-elimination pass.",
      "**Multiple judges allowed** → return all nodes with the judge degree profile.",
      "**Weighted trust** → degree counting generalizes but the threshold condition changes.",
    ],
    related: ["find-if-path-exists-in-graph", "number-of-provinces", "course-schedule"],
  },

  {
    slug: "the-maze",
    title: "The Maze",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 490,
    statement:
      "A ball is in a `maze` of empty spaces (`0`) and walls (`1`). The ball can roll up, down, left, or right, but it **keeps rolling until it hits a wall**, only then choosing a new direction. Given the maze, the ball's `start = [r, c]`, and a `destination = [r, c]`, return whether the ball can stop **exactly** at the destination.",
    examples: [
      { in: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], dest=[4,4]", out: "true" },
      { in: "maze=[[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]], start=[0,4], dest=[3,2]", out: "false", note: "the ball cannot stop at [3,2]; it rolls past" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "maze[i][j] is 0 or 1", "start and destination are empty spaces", "the borders are all walls or the ball stops at the edge", "start != destination"],
    recognize:
      "The graph nodes are the **stopping positions**, not individual cells: from each stop the ball rolls in a direction until blocked, producing a neighbor stop. Reachability over those stops → a BFS/DFS where each edge is a full roll.",
    figureItOut: [
      "Reframe the grid: a 'move' is not one cell but a complete roll in one of four directions until a wall (or the maze boundary) stops the ball. So the true graph nodes are the cells where the ball can come to rest.",
      "From a stopping cell, for each of the four directions, simulate rolling: step repeatedly while the next cell is in bounds and empty; the last empty cell before a wall is the resulting stop. That stop is a graph neighbor.",
      "Run BFS (or DFS) from `start` over these stopping cells, marking visited stops so the ball does not loop. Each dequeued stop expands into up to four rolled neighbors.",
      "Return true the moment a rolled stop equals `destination`; if BFS exhausts all reachable stops without landing exactly on it, return false. Stopping exactly matters: rolling **through** the destination without stopping there does not count.",
    ],
    approaches: [
      {
        name: "BFS over stopping positions (roll-until-wall edges) (optimal)",
        intuition: "Treat each rest position as a node and each full roll-until-blocked as an edge; standard BFS reachability then answers whether the ball can stop at the destination.",
        time: "O(m · n · max(m, n))",
        timeWhy: "Each of the O(m·n) cells may be visited and each roll can traverse up to max(m,n) cells.",
        space: "O(m · n)",
        spaceWhy: "A visited grid plus the BFS queue.",
        code: `boolean hasPath(int[][] maze, int[] start, int[] destination) {
    int m = maze.length, n = maze[0].length;
    boolean[][] visited = new boolean[m][n];
    int[][] dirs = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
    Deque<int[]> queue = new ArrayDeque<>();
    queue.add(start);
    visited[start[0]][start[1]] = true;
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        if (cur[0] == destination[0] && cur[1] == destination[1]) return true;
        for (int[] d : dirs) {
            int r = cur[0], c = cur[1];
            // roll until the next cell is a wall or out of bounds
            while (r + d[0] >= 0 && r + d[0] < m && c + d[1] >= 0 && c + d[1] < n
                   && maze[r + d[0]][c + d[1]] == 0) {
                r += d[0];
                c += d[1];
            }
            if (!visited[r][c]) {
                visited[r][c] = true;
                queue.add(new int[]{r, c});
            }
        }
    }
    return false;
}`,
        walkthrough: [
          "Tiny maze=[[0,0,0],[1,1,0],[0,0,0]], start=[0,0], dest=[2,0]. Mark (0,0).",
          "From (0,0): roll right stops at (0,2) (wall? boundary at col 2). roll down stops at (0,0) (wall at row1col0) -> no move. Enqueue (0,2).",
          "From (0,2): roll down stops at (2,2) (boundary). Enqueue (2,2). From (2,2): roll left stops at (2,0) (boundary).",
          "(2,0) equals destination on dequeue -> return true.",
        ],
      },
    ],
    edgeCases: [
      "A roll that hits a wall immediately produces the same cell (no move); the visited check prevents enqueuing it again.",
      "The ball rolling THROUGH the destination but unable to stop there returns false (example 2).",
      "start already equals destination is excluded by constraints, but the dequeue check would handle it as true if allowed.",
    ],
    twists: [
      "**The Maze II (LeetCode 505)** → return the shortest roll distance; switch BFS to Dijkstra weighted by roll length.",
      "**The Maze III** → add a hole and lexicographically smallest instructions; Dijkstra over (distance, path string).",
      "**Allow stopping mid-roll** → the problem collapses to ordinary grid BFS.",
    ],
    related: ["shortest-path-in-binary-matrix", "walls-and-gates", "number-of-islands"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "redundant-connection-ii",
    title: "Redundant Connection II",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 685,
    statement:
      "A rooted tree on `n` nodes (labeled `1..n`) has had exactly one **extra directed edge** added, leaving `n` directed `edges`. The result is a directed graph where one node may now have two parents, or a cycle may have formed. Return the **one edge** that can be removed so the remaining edges form a valid rooted tree (each node except the root has exactly one parent, no cycle). If several answers exist, return the one appearing **last** in the input.",
    examples: [
      { in: "edges=[[1,2],[1,3],[2,3]]", out: "[2,3]", note: "node 3 has two parents (1 and 2); removing the later [2,3] fixes it" },
      { in: "edges=[[1,2],[2,3],[3,4],[4,1],[1,5]]", out: "[4,1]", note: "a cycle exists; removing [4,1] restores the tree" },
    ],
    constraints: ["n == edges.length", "3 ≤ n ≤ 1000", "edges[i].length == 2", "1 ≤ edges[i][j] ≤ n", "the input is one extra edge added to a rooted tree"],
    recognize:
      "A rooted tree has exactly one parent per non-root node. Adding an edge creates either a **two-parent node**, a **cycle**, or both. Casework on these via **Union-Find** identifies which single edge to drop.",
    figureItOut: [
      "Two defects are possible. Defect A: some node ends up with **two incoming edges** (two parents). Defect B: the edges form a **directed cycle**. The extra edge causes A, B, or both at once.",
      "First scan for a node with two parents. If found, record the two candidate edges `cand1` (earlier) and `cand2` (later) pointing to it, and **temporarily disable** `cand2` in the edge list (mark it).",
      "Run **Union-Find** over the (possibly modified) edges. If unioning never reports a cycle: if there was no two-parent node, there is no extra edge to special-case (cannot happen given the guarantee); if there WAS a two-parent node, the removed `cand2` was indeed the culprit -> return `cand2`.",
      "If a cycle IS detected during union: when there was **no** two-parent node, the edge that closed the cycle is the answer. When there **was** a two-parent node, disabling `cand2` did not break the cycle, so the real culprit is the other candidate `cand1` -> return `cand1`. (Find uses path compression; union by linking roots.)",
    ],
    approaches: [
      {
        name: "Two-parent detection + Union-Find cycle casework (optimal)",
        intuition: "Identify a double-parented node first, tentatively drop its later edge, then use Union-Find to decide whether the cycle (if any) blames that edge or the earlier one.",
        time: "O(n · α)",
        timeWhy: "A constant number of near-constant Union-Find operations per edge.",
        space: "O(n)",
        spaceWhy: "Parent array for Union-Find plus an incoming-parent array.",
        code: `int[] findRedundantDirectedConnection(int[][] edges) {
    int n = edges.length;
    int[] parentOf = new int[n + 1];   // the parent recorded for each node, 0 = none yet
    int cand1 = -1, cand2 = -1;        // indices into edges
    for (int i = 0; i < n; i++) {
        int v = edges[i][1];
        if (parentOf[v] != 0) {
            cand1 = parentOf[v] - 1;   // earlier edge index (stored as index+1)
            cand2 = i;                 // later edge index
        } else {
            parentOf[v] = i + 1;
        }
    }
    int[] uf = new int[n + 1];
    for (int i = 1; i <= n; i++) uf[i] = i;
    for (int i = 0; i < n; i++) {
        if (i == cand2) continue;      // tentatively skip the later double-parent edge
        int a = edges[i][0], b = edges[i][1];
        int ra = find(uf, a), rb = find(uf, b);
        if (ra == rb) {                // cycle formed
            if (cand1 == -1) return edges[i];          // no two-parent node: this edge closes the cycle
            return edges[cand1];                       // two-parent node: blame the earlier candidate
        }
        uf[rb] = ra;
    }
    return edges[cand2];               // no cycle without cand2: cand2 was the extra edge
}
int find(int[] uf, int x) {
    while (uf[x] != x) {
        uf[x] = uf[uf[x]];
        x = uf[x];
    }
    return x;
}`,
        walkthrough: [
          "edges=[[1,2],[1,3],[2,3]]. Scan parents: node2 parent=edge0; node3 parent=edge1; then edge2 also points to 3 -> two parents: cand1=1, cand2=2.",
          "Union skipping cand2 (edge index 2). Process edge0 [1,2]: union 1,2. Process edge1 [1,3]: union 1,3. No cycle detected.",
          "Loop finishes with no cycle. There was a two-parent node, so the skipped cand2 was indeed redundant.",
          "Return edges[cand2] = edges[2] = [2,3].",
        ],
      },
    ],
    edgeCases: [
      "Pure cycle, no two-parent node (cand2 == -1) → return the edge that closes the cycle during union.",
      "Two-parent node AND a cycle → skipping the later edge fails to break the cycle, so blame the earlier candidate cand1.",
      "Two-parent node with no cycle → the later candidate cand2 is the extra edge.",
    ],
    twists: [
      "**Redundant Connection (LeetCode 684)** → the undirected version has no two-parent case; plain Union-Find returns the cycle-closing edge.",
      "**Multiple extra edges** → the clean casework breaks down; needs a more general repair search.",
      "**Report the new root after removal** → track which node has in-degree 0 once the edge is dropped.",
    ],
    related: ["redundant-connection", "graph-valid-tree", "course-schedule-ii"],
  },

  {
    slug: "number-of-ways-to-arrive-at-destination",
    title: "Number of Ways to Arrive at Destination",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1976,
    statement:
      "You are in a city of `n` intersections `0..n-1` connected by bidirectional `roads`, where `roads[i] = [u, v, time]` is a road between `u` and `v` taking `time` minutes. Starting at intersection 0, return the **number of shortest-time paths** to intersection `n-1`, **modulo 10^9 + 7**.",
    examples: [
      { in: "n=7, roads=[[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],[2,5,1],[0,4,5],[4,6,2]]", out: "4", note: "the shortest time 0 -> 6 is 7, reachable by 4 distinct shortest paths" },
      { in: "n=2, roads=[[1,0,10]]", out: "1", note: "the single road is the only shortest path" },
    ],
    constraints: ["1 ≤ n ≤ 200", "0 ≤ roads.length ≤ n·(n-1)/2", "roads[i].length == 3", "1 ≤ time ≤ 10^9", "no two roads connect the same pair", "the graph is connected", "return the count modulo 10^9 + 7"],
    recognize:
      "Count the number of shortest paths in a **weighted** graph with non-negative weights → **Dijkstra augmented with a path-count array**, accumulating counts along edges that lie on a shortest path.",
    figureItOut: [
      "Standard Dijkstra computes the minimum time `dist[v]` to each node. To also count shortest paths, carry a parallel `ways[v]` = number of distinct shortest paths from source to `v`, all modulo 10^9 + 7.",
      "Relaxation rule while popping the closest node `u` and scanning an edge `u -> v` with weight `w`: if `dist[u] + w < dist[v]`, you found a strictly shorter path, so set `dist[v] = dist[u] + w` and **copy** `ways[v] = ways[u]`. If `dist[u] + w == dist[v]`, you found an equally short alternate route, so **add** `ways[v] = (ways[v] + ways[u]) % MOD`.",
      "Initialize `dist[0] = 0`, `ways[0] = 1` (one trivial path to the source), all other `dist = infinity`, `ways = 0`. Use a min-priority-queue keyed by current distance, and skip stale entries whose stored distance exceeds `dist[u]`.",
      "Times can be up to 10^9 and the graph up to 200 nodes, so path totals fit in `long` for distances (sum can exceed int) and `ways` is kept mod 10^9 + 7. The answer is `ways[n-1]`.",
    ],
    approaches: [
      {
        name: "Dijkstra with shortest-path counting (optimal)",
        intuition: "Run Dijkstra for the shortest time, and alongside it accumulate path counts: a strictly shorter relaxation resets the count, an equal-distance relaxation adds to it.",
        time: "O(E log V)",
        timeWhy: "Each edge triggers at most one priority-queue push; the heap holds O(E) entries.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list, the dist and ways arrays, and the priority queue.",
        code: `int countPaths(int n, int[][] roads) {
    long MOD = 1_000_000_007L;
    List<long[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] r : roads) {
        adj[r[0]].add(new long[]{r[1], r[2]});
        adj[r[1]].add(new long[]{r[0], r[2]});
    }
    long[] dist = new long[n];
    long[] ways = new long[n];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[0] = 0;
    ways[0] = 1;
    PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[1], b[1]));
    pq.add(new long[]{0, 0});   // node, distance
    while (!pq.isEmpty()) {
        long[] cur = pq.poll();
        int u = (int) cur[0];
        long d = cur[1];
        if (d > dist[u]) continue;   // stale
        for (long[] e : adj[u]) {
            int v = (int) e[0];
            long nd = d + e[1];
            if (nd < dist[v]) {
                dist[v] = nd;
                ways[v] = ways[u];
                pq.add(new long[]{v, nd});
            } else if (nd == dist[v]) {
                ways[v] = (ways[v] + ways[u]) % MOD;
            }
        }
    }
    return (int) ways[n - 1];
}`,
        walkthrough: [
          "n=2, roads=[[1,0,10]]. adj: 0<->1 weight 10. dist=[0, INF], ways=[1,0]. pq={(0,0)}.",
          "Pop (0,0). Edge 0->1 nd=0+10=10 < INF: dist[1]=10, ways[1]=ways[0]=1, push (1,10).",
          "Pop (1,10). Edge 1->0 nd=20 > dist[0]=0, no update.",
          "ways[n-1]=ways[1]=1. Answer 1.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → already at destination; ways[0] = 1.",
      "Counts can overflow int well before distances do, so accumulate ways modulo 10^9 + 7 every addition.",
      "Distances must be long since a path can sum many edges of weight up to 10^9.",
    ],
    twists: [
      "**Count shortest paths in an UNWEIGHTED graph** → replace Dijkstra with BFS, applying the same copy/add counting on each layer.",
      "**Return the number of shortest paths through a specific node** → multiply counts from source-to-node by node-to-destination.",
      "**Second shortest path count** → track the two smallest distances per node (as in LeetCode 2045).",
    ],
    related: ["network-delay-time", "cheapest-flights-within-k-stops", "path-with-minimum-effort"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "split-array-into-fibonacci-sequence",
    title: "Split Array Into Fibonacci Sequence",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 842,
    statement:
      "Given a string `num` of digits, split it into a **Fibonacci-like** sequence: a list of at least 3 non-negative integers `f[0], f[1], ..., f[k-1]` where `f[i] + f[i+1] == f[i+2]` for all valid `i`, each value fits in a **signed 32-bit integer** (at most 2^31 - 1), and no number has a leading zero (except the single digit 0). Return any valid split as a list, or an empty list if none exists.",
    examples: [
      { in: 'num="1101111"', out: "[11,0,11,11]", note: "11 + 0 = 11, 0 + 11 = 11" },
      { in: 'num="112358130"', out: "[]", note: "no valid Fibonacci split exists" },
      { in: 'num="0123"', out: "[]", note: "the only candidates start with a leading-zero number" },
    ],
    constraints: ["1 ≤ num.length ≤ 200", "num consists only of digits 0-9", "each returned value must be ≤ 2^31 - 1"],
    recognize:
      "Once the first two numbers are chosen, every later number is forced as their running sum, so this is **backtracking over the first two prefixes** plus a deterministic chain check — with extra pruning for leading zeros and 32-bit overflow.",
    figureItOut: [
      "The defining freedom is the **first two numbers**; from `f[0]` and `f[1]` the rest of the sequence is forced (`f[2] = f[0] + f[1]`, and so on). So the search branches only on where the first and second numbers end.",
      "Backtrack: try the first number as `num[0..i)` and the second as `num[i..j)`. Reject any piece with a **leading zero** (length > 1 starting with 0) and any piece whose value exceeds `Integer.MAX_VALUE` (2^31 - 1).",
      "From a chosen pair, **recursively extend**: the next number must equal the sum of the last two; check that `num` continues with the decimal form of that sum at the current position. If it matches, append it and recurse; if it overshoots the 32-bit cap or fails to match, prune that branch and backtrack (remove the last appended value).",
      "**Success**: the entire string is consumed AND the list has at least 3 numbers. Build the list incrementally (add a value before recursing, remove it after) so the same list object is reused across branches. Return the first complete sequence found, or an empty list if the search is exhausted.",
    ],
    approaches: [
      {
        name: "Backtracking over first two numbers, forced chain (optimal)",
        intuition: "Fix the first two numbers by trying prefix pairs; the Fibonacci rule then determines every remaining number, so the rest is a deterministic match-or-prune.",
        time: "O(n^2 · n)",
        timeWhy: "O(n^2) choices for the first two split points, each extended by a forced linear chain of matches.",
        space: "O(n)",
        spaceWhy: "Recursion depth and the result list, both bounded by the number of pieces.",
        code: `List<Integer> splitIntoFibonacci(String num) {
    List<Integer> result = new ArrayList<>();
    backtrack(num, 0, result);
    return result;
}
boolean backtrack(String num, int start, List<Integer> seq) {
    if (start == num.length()) {
        return seq.size() >= 3;
    }
    long val = 0;
    for (int end = start; end < num.length(); end++) {
        // leading zero: a multi-digit piece may not start with 0
        if (end > start && num.charAt(start) == '0') break;
        val = val * 10 + (num.charAt(end) - '0');
        if (val > Integer.MAX_VALUE) break;   // exceeds the 32-bit cap
        int size = seq.size();
        if (size >= 2) {
            long expected = (long) seq.get(size - 1) + seq.get(size - 2);
            if (val < expected) continue;     // too small, extend the piece
            if (val > expected) break;         // too big, no longer piece will match
        }
        seq.add((int) val);
        if (backtrack(num, end + 1, seq)) return true;
        seq.remove(seq.size() - 1);            // backtrack
    }
    return false;
}`,
        walkthrough: [
          'num="1101111". Pick f[0]="1" (val 1). Pick f[1]="1" (next, val 1). Now expected f[2]=1+1=2.',
          'Scan from index 2: "0"=0 < 2 continue, "01" rejected (leading zero) -> branch fails; backtrack second number.',
          'Pick f[1]="11" (index 1..3, val 11). expected f[2]=1+11=12; scan "0"=0<12, "01" leading-zero break -> fails. Backtrack.',
          'Eventually f[0]="11", f[1]="0": expected 11, next "11"=11 matches -> [11,0,11]; expected 0+11=11, next "11"=11 matches -> [11,0,11,11]; string consumed, size 4>=3 -> return [11,0,11,11].',
        ],
      },
    ],
    edgeCases: [
      "Leading zeros: a multi-digit piece starting with 0 is rejected, but a single 0 is a legal value (as in [11,0,11,11]).",
      "Overflow: any piece exceeding 2^31 - 1 prunes the branch; accumulate in long to detect it safely.",
      "Strings too short to form 3 numbers (length < 3) → empty list.",
    ],
    twists: [
      "**Additive Number (LeetCode 306)** → the boolean-only variant; same forced-chain idea without the 32-bit cap or list construction.",
      "**Allow values beyond 32-bit** → use BigInteger or long throughout and drop the cap check.",
      "**Count all valid splits** → do not early-return on success; tally completed sequences instead.",
    ],
    related: ["additive-number", "restore-ip-addresses", "word-break-ii"],
  },

  {
    slug: "flip-game-ii",
    title: "Flip Game II",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 294,
    statement:
      "You are given a string `currentState` of `+` and `-`. Two players take turns; on a turn a player must flip **two consecutive** `++` into `--`. A player who cannot move loses. Return whether the player who moves **first** can guarantee a win with optimal play.",
    examples: [
      { in: 'currentState="++++"', out: "true", note: "first player flips the middle ++ to make +--+, leaving no winning reply for the opponent" },
      { in: 'currentState="+"', out: "false", note: "no ++ to flip, first player cannot move and loses" },
      { in: 'currentState="++"', out: "true", note: "flip the only ++ to --; opponent cannot move" },
    ],
    constraints: ["1 ≤ currentState.length ≤ 60", "currentState consists only of + and -"],
    recognize:
      "A two-player make-the-last-move game where you ask if a winning move exists → **minimax backtracking**: the current player wins iff some move leaves the opponent in a losing position. Memoize states to prune repeats.",
    figureItOut: [
      "Game-theory framing: the mover **wins** if there exists at least one legal flip after which the opponent **cannot** win from the resulting position. This is the classic minimax recurrence over game states.",
      "Enumerate every position `i` where `s[i] == s[i+1] == +`. For each, flip those two to `--`, then recursively ask whether the opponent can win from the new string. If any such move makes the opponent lose, the current player wins.",
      "**Backtrack**: build the flipped string (or flip in a mutable char array and restore after the recursive call) so sibling moves start from the original state. If no flip leads to an opponent loss, the current player loses.",
      "**Memoize** on the string state with a HashMap to avoid recomputing the same position reached via different move orders — the search tree has heavy overlap. The answer is the recursion result for `currentState`.",
    ],
    approaches: [
      {
        name: "Plain minimax backtracking (baseline)",
        intuition: "Try every ++ flip; you win if any flip leaves the opponent unable to win, recursing without memo.",
        time: "O(n!!)",
        timeWhy: "Without memoization the move tree branches on every available ++ pair, roughly a double-factorial blowup.",
        space: "O(n)",
        spaceWhy: "Recursion depth bounded by the number of flips (about n/2).",
        code: `boolean canWin(String s) {
    char[] arr = s.toCharArray();
    for (int i = 0; i + 1 < arr.length; i++) {
        if (arr[i] == '+' && arr[i + 1] == '+') {
            arr[i] = '-';
            arr[i + 1] = '-';
            boolean opponentWins = canWin(new String(arr));
            arr[i] = '+';
            arr[i + 1] = '+';
            if (!opponentWins) return true;
        }
    }
    return false;
}`,
      },
      {
        name: "Minimax backtracking with memoization (optimal)",
        intuition: "Same win condition, but cache each visited state so positions reached by different move orders are solved once.",
        time: "O(2^n) worst case, far less in practice",
        timeWhy: "Each distinct string state is solved once and cached; overlap among move orders is collapsed by the memo.",
        space: "O(number of distinct states)",
        spaceWhy: "The memo map of string state to win/lose, plus recursion stack.",
        code: `boolean canWin(String currentState) {
    return solve(currentState, new HashMap<>());
}
boolean solve(String s, Map<String, Boolean> memo) {
    if (memo.containsKey(s)) return memo.get(s);
    char[] arr = s.toCharArray();
    for (int i = 0; i + 1 < arr.length; i++) {
        if (arr[i] == '+' && arr[i + 1] == '+') {
            arr[i] = '-';
            arr[i + 1] = '-';
            boolean opponentWins = solve(new String(arr), memo);
            arr[i] = '+';
            arr[i + 1] = '+';
            if (!opponentWins) {
                memo.put(s, true);
                return true;
            }
        }
    }
    memo.put(s, false);
    return false;
}`,
        walkthrough: [
          'currentState="++". solve("++"): i=0 has ++, flip to "--", recurse solve("--").',
          'solve("--"): no ++ anywhere -> returns false (the opponent cannot move).',
          'Back in solve("++"): opponentWins == false, so the first player wins -> memo["++"]=true, return true.',
          'Answer true.',
        ],
      },
    ],
    edgeCases: [
      'No ++ at all (e.g. "+", "+-+") → first player cannot move → false.',
      'A single "++" → first player flips and wins → true.',
      "Memoization is essential: many move orders reach identical states, so the unmemoized version times out on long inputs.",
    ],
    twists: [
      "**Flip Game (LeetCode 293)** → just list all states reachable in one move; no game tree.",
      "**Sprague-Grundy / Nim values** → compute Grundy numbers of maximal + segments for an O(n^2)-ish exact theory solution.",
      "**Flip three consecutive** → change the move pattern; the minimax framework is identical.",
    ],
    related: ["word-break-ii", "subsets", "combination-sum"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "minimum-number-of-taps-to-open-to-water-a-garden",
    title: "Minimum Number of Taps to Open to Water a Garden",
    difficulty: "Hard",
    pattern: "greedy",
    leetcode: 1326,
    statement:
      "A one-dimensional garden spans the x-axis from `0` to `n`. There are `n+1` taps at positions `0, 1, ..., n`. `ranges[i]` means tap `i`, when opened, waters the closed interval `[i - ranges[i], i + ranges[i]]`. Return the **minimum number of taps** to open so the whole `[0, n]` is watered, or `-1` if it is impossible.",
    examples: [
      { in: "n=5, ranges=[3,4,1,1,0,0]", out: "1", note: "tap 1 waters [-3,5] which covers [0,5]" },
      { in: "n=3, ranges=[0,0,0,0]", out: "-1", note: "no tap reaches beyond its own point; gaps remain" },
      { in: "n=7, ranges=[1,2,1,0,2,1,0,1]", out: "3" },
    ],
    constraints: ["1 ≤ n ≤ 10^4", "ranges.length == n + 1", "0 ≤ ranges[i] ≤ 100"],
    recognize:
      "Cover the interval [0, n] with the fewest sub-intervals → the classic **greedy interval-covering / jump-game** problem: convert each tap to the farthest reach from each start, then sweep choosing the farthest reach so far.",
    figureItOut: [
      "Convert each tap into an interval and then into a **maxReach array**: `maxReach[left]` = the farthest right edge reachable from position `left`, where `left = max(0, i - ranges[i])` and the edge is `i + ranges[i]`. This reframes the taps as a jump-game on positions 0..n.",
      "Sweep left to right exactly like Jump Game II. Keep `curEnd` (the boundary of the coverage committed so far) and `farthest` (the best reach seen while inside the current segment). At each position `i`, update `farthest = max(farthest, maxReach[i])`.",
      "When the sweep index `i` reaches `curEnd`, you must open another tap to extend coverage: increment the tap count and set `curEnd = farthest`. If at that moment `farthest` has not advanced past `i` (i.e. `farthest <= i` while `curEnd < n`), there is an uncoverable gap → return -1.",
      "Stop once `curEnd >= n`. The accumulated tap count is the minimum. The greedy is optimal because always extending to the farthest reachable edge minimizes how many intervals are needed to cross [0, n].",
    ],
    approaches: [
      {
        name: "Reduce to Jump Game II via max-reach sweep (optimal)",
        intuition: "Treat each tap as the farthest right edge reachable from its left end, then greedily jump to the farthest reach within the current segment, counting jumps.",
        time: "O(n)",
        timeWhy: "One pass to build maxReach and one greedy sweep over positions 0..n.",
        space: "O(n)",
        spaceWhy: "The maxReach array of size n+1.",
        code: `int minTaps(int n, int[] ranges) {
    int[] maxReach = new int[n + 1];
    for (int i = 0; i <= n; i++) {
        int left = Math.max(0, i - ranges[i]);
        int right = Math.min(n, i + ranges[i]);
        maxReach[left] = Math.max(maxReach[left], right);
    }
    int taps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i <= n; i++) {
        if (i > farthest) return -1;     // gap: cannot reach position i
        farthest = Math.max(farthest, maxReach[i]);
        if (i == curEnd && curEnd < n) {
            taps++;
            curEnd = farthest;
            if (curEnd <= i) return -1;  // no progress possible
        }
    }
    return curEnd >= n ? taps : -1;
}`,
        walkthrough: [
          "n=5, ranges=[3,4,1,1,0,0]. Build maxReach: tap0 left=0 right=3; tap1 left=max(0,-3)=0 right=min(5,5)=5 -> maxReach[0]=max(3,5)=5; tap2 left=1 right=3; tap3 left=2 right=4; taps 4,5 reach themselves. maxReach=[5,3,4,4,4,5].",
          "Sweep: i=0, farthest=max(0,5)=5. i==curEnd(0) and curEnd<5 -> taps=1, curEnd=5.",
          "i=1..5: farthest stays 5, i never exceeds farthest; curEnd already 5 (== n), no more taps opened.",
          "curEnd=5 >= n=5 -> return taps=1.",
        ],
      },
    ],
    edgeCases: [
      "A tap with range 0 waters only its own point; a row of zero-range taps leaves gaps → -1 (example 2).",
      "Position 0 must be covered by some tap whose interval includes 0; if maxReach[0] stays 0 and n > 0, the first jump fails → -1.",
      "Clamp intervals to [0, n] so taps reaching outside the garden do not distort the sweep.",
    ],
    twists: [
      "**Video Stitching (LeetCode 1024)** → identical greedy with explicit [start,end) clips instead of taps.",
      "**DP formulation** → dp[i] = min taps to water [0,i]; O(n·R) and slower but also correct.",
      "**Weighted taps (each has a cost)** → greedy by farthest reach no longer optimal; needs a shortest-path / DP over costs.",
    ],
    related: ["jump-game-ii", "jump-game", "gas-station"],
  },

  {
    slug: "furthest-building-you-can-reach",
    title: "Furthest Building You Can Reach",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1642,
    statement:
      "You are given an integer array `heights` of building heights, plus `bricks` and `ladders`. You start at building 0 and move to the next building each step. If the next building is shorter or equal, you move free. If it is taller, you must spend either `(nextHeight - currentHeight)` **bricks** or **one ladder** to climb the difference. Return the **furthest building index** (0-based) you can reach using the bricks and ladders **optimally**.",
    examples: [
      { in: "heights=[4,2,7,6,9,14,12], bricks=5, ladders=1", out: "4", note: "use bricks for small climbs and the ladder for the big jump to reach index 4" },
      { in: "heights=[4,12,2,7,3,18,20,3,19], bricks=10, ladders=2", out: "7" },
      { in: "heights=[14,3,19,3], bricks=17, ladders=0", out: "3" },
    ],
    constraints: ["1 ≤ heights.length ≤ 10^5", "1 ≤ heights[i] ≤ 10^6", "0 ≤ bricks ≤ 10^9", "0 ≤ ladders ≤ heights.length"],
    recognize:
      "Ladders are scarce and should cover the **largest** climbs; bricks pay for the rest. Always reserving ladders for the biggest gaps seen so far → a **greedy with a min-heap** of the largest climbs assigned to ladders.",
    figureItOut: [
      "Only positive climbs (`heights[i+1] - heights[i] > 0`) cost anything. The scarce, powerful resource is the ladder: one ladder erases any single climb regardless of size, so ladders should go to the **biggest** climbs.",
      "Walk forward. Tentatively spend a **ladder** on every climb by pushing the climb size into a **min-heap** of size at most `ladders`. When the heap exceeds `ladders` entries, the smallest climb in it is the best one to demote to bricks, so pop it and pay it with bricks.",
      "Subtract that demoted (smallest-so-far) climb from `bricks`. If `bricks` goes negative, you can no longer afford to advance, so you are stuck at the current building → return its index.",
      "If you complete the whole array, return `heights.length - 1`. The min-heap guarantees the `ladders` largest climbs encountered are exactly the ones still covered by ladders, which is the brick-minimizing assignment.",
    ],
    approaches: [
      {
        name: "Min-heap reserving ladders for the largest climbs (optimal)",
        intuition: "Provisionally use a ladder on each climb; keep only the largest climbs on ladders and pay the rest with bricks, stopping when bricks run out.",
        time: "O(n log L)",
        timeWhy: "Each climb is pushed once into a heap of size at most ladders L, with log-L heap operations.",
        space: "O(L)",
        spaceWhy: "The min-heap holds at most ladders climb sizes.",
        code: `int furthestBuilding(int[] heights, int bricks, int ladders) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();   // min-heap of climb sizes on ladders
    for (int i = 0; i < heights.length - 1; i++) {
        int diff = heights[i + 1] - heights[i];
        if (diff <= 0) continue;          // descent or flat is free
        heap.add(diff);
        if (heap.size() > ladders) {
            bricks -= heap.poll();        // demote the smallest climb to bricks
        }
        if (bricks < 0) return i;         // cannot afford this move; stuck at i
    }
    return heights.length - 1;
}`,
        walkthrough: [
          "heights=[4,2,7,6,9,14,12], bricks=5, ladders=1. i=0: 2-4=-2 free. i=1: 7-2=5>0, heap=[5], size 1 == ladders, no demotion.",
          "i=2: 6-7=-1 free. i=3: 9-6=3>0, heap=[3,5], size 2 > 1, pop smallest 3 -> bricks=5-3=2. bricks>=0.",
          "i=4: 14-9=5>0, heap=[5,5], size 2 > 1, pop smallest 5 -> bricks=2-5=-3. bricks<0 -> return i=4.",
          "Answer 4 (furthest reachable index).",
        ],
      },
    ],
    edgeCases: [
      "All descents/flats → never spend anything, reach the last index.",
      "ladders == 0 → the heap stays empty-capacity, so every climb is immediately paid with bricks.",
      "bricks large enough to cover everything not on ladders → reach the final building.",
    ],
    twists: [
      "**Minimize ladders for a fixed brick budget** → swap the roles in the heap (largest-cost-first with bricks).",
      "**Each ladder spans k buildings** → the resource model changes; greedy heap no longer directly applies.",
      "**Binary search on the answer** → check feasibility of reaching index m by greedily assigning the m largest climbs to ladders.",
    ],
    related: ["ipo", "minimum-number-of-refueling-stops", "boats-to-save-people"],
  },
];
