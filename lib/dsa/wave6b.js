// NeetCode 250 extras — wave 6b (1-D and 2-D DP). Java.
export const WAVE6B = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "combination-sum-iv",
    title: "Combination Sum IV",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 377,
    statement:
      "Given an array of **distinct** integers `nums` and a `target`, return the number of combinations that add up to `target`. **Order matters** — `(1,2)` and `(2,1)` count as different combinations. Each number may be used unlimited times.",
    examples: [
      { in: "nums = [1,2,3], target = 4", out: "7", note: "(1,1,1,1),(1,1,2),(1,2,1),(2,1,1),(2,2),(1,3),(3,1)" },
      { in: "nums = [9], target = 3", out: "0", note: "9 alone can never reach 3" },
    ],
    constraints: ["1 ≤ nums.length ≤ 200", "1 ≤ nums[i] ≤ 1000", "all nums distinct", "1 ≤ target ≤ 1000"],
    recognize:
      "'**Count the number of ordered ways** to reach a total, unlimited reuse' is a 1-D counting DP. The phrase *order matters* is the key tell — it makes this **permutations**, not the usual coin-change *combinations*, which flips the loop order.",
    figureItOut: [
      "Brute force: branch on every first number, recurse on the smaller remaining target, repeat. That re-solves the same remaining target over and over — overlapping subproblems → DP.",
      "**State:** `dp[t]` = the number of ordered ways to sum exactly to `t` using numbers from `nums`.",
      "**Recurrence:** to make `t`, the *last* number added was some `n` in `nums` (any of them, since order matters). Whatever came before it sums to `t − n`. So `dp[t] = Σ dp[t − n]` over every `n ≤ t`.",
      "**Base case:** `dp[0] = 1` — exactly one way to make 0 (add nothing, the empty sequence). Everything builds on this seed.",
      "**Table fill:** loop `t` from 1 up to `target` (the outer loop is the total, the inner loop is the numbers). Because the total is outer, each `n` gets a chance to be the last pick at every `t` — that is what counts orderings rather than sets.",
    ],
    approaches: [
      {
        name: "Top-down memoized recursion",
        intuition: "Count ways to fill `remaining`; cache each remaining so it's solved once.",
        time: "O(target × n)",
        timeWhy: "There are `target` distinct subproblems, each loops over n numbers once.",
        space: "O(target)",
        spaceWhy: "The memo array plus recursion depth up to target.",
        code: `int combinationSum4(int[] nums, int target) {
    Integer[] memo = new Integer[target + 1];
    return count(nums, target, memo);
}

int count(int[] nums, int remaining, Integer[] memo) {
    if (remaining == 0) return 1;
    if (memo[remaining] != null) return memo[remaining];
    int ways = 0;
    for (int n : nums) {
        if (n <= remaining) ways += count(nums, remaining - n, memo);
    }
    return memo[remaining] = ways;
}`,
      },
      {
        name: "Bottom-up table (optimal)",
        intuition: "Fill dp[0..target]; dp[t] sums dp[t−n] for every usable n. Total is the outer loop so orderings are counted.",
        time: "O(target × n)",
        timeWhy: "Outer loop runs `target` times, inner over n numbers.",
        space: "O(target)",
        spaceWhy: "A single dp array of size target+1.",
        code: `int combinationSum4(int[] nums, int target) {
    int[] dp = new int[target + 1];
    dp[0] = 1;                       // one way to make 0: pick nothing
    for (int t = 1; t <= target; t++) {
        for (int n : nums) {
            if (n <= t) dp[t] += dp[t - n];
        }
    }
    return dp[target];
}`,
        walkthrough: [
          "nums=[1,2,3], target=4. dp[0]=1.",
          "dp[1]=dp[0]=1. dp[2]=dp[1]+dp[0]=2. dp[3]=dp[2]+dp[1]+dp[0]=4.",
          "dp[4]=dp[3]+dp[2]+dp[1]=4+2+1=7 → answer 7.",
        ],
      },
    ],
    edgeCases: [
      "No `n` divides into the target's reach → dp[target] stays 0.",
      "Large intermediate counts can overflow `int` (the problem guarantees the answer fits, but a naive variant may need `long`).",
      "`dp[0] = 1` is mandatory — forget it and every count collapses to 0.",
    ],
    twists: [
      "**Order does NOT matter** (classic Coin Change II, 518) → swap the loops: numbers outer, total inner, so each number is considered once.",
      "**Allow negative numbers** → infinite sequences become possible; the problem must add a length cap to stay finite.",
      "**Return the combinations themselves** → DP only counts; enumerating them needs backtracking.",
    ],
    related: ["coin-change", "coin-change-ii", "climbing-stairs"],
  },

  {
    slug: "perfect-squares",
    title: "Perfect Squares",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 279,
    statement:
      "Given an integer `n`, return the **least number of perfect-square numbers** (`1, 4, 9, 16, …`) that sum to `n`.",
    examples: [
      { in: "n = 12", out: "3", note: "12 = 4 + 4 + 4" },
      { in: "n = 13", out: "2", note: "13 = 4 + 9" },
    ],
    constraints: ["1 ≤ n ≤ 10⁴"],
    recognize:
      "'**Fewest items** (perfect squares) that sum to a target, unlimited reuse' is unbounded-knapsack / coin-change with coins = the square numbers. Minimizing count over a single total → 1-D DP indexed by the remaining total.",
    figureItOut: [
      "Think of the squares ≤ n as 'coins': 1,4,9,16,…. The question becomes coin change — fewest coins to make `n`. That reframing is the whole insight.",
      "**State:** `dp[i]` = the minimum number of perfect squares that sum exactly to `i`.",
      "**Recurrence:** the last square used is some `s = j*j ≤ i`. Removing it leaves `i − s`, already solved optimally. So `dp[i] = 1 + min over j of dp[i − j*j]`.",
      "**Base case:** `dp[0] = 0` (zero squares make 0). Initialize the rest to a large sentinel so `min` works.",
      "**Table fill:** for each `i` from 1 to n, try every square `j*j ≤ i` and take the cheapest. `dp[n]` is the answer; the answer always exists because `1` is a square, so worst case is n ones.",
    ],
    approaches: [
      {
        name: "Brute-force recursion",
        intuition: "Try subtracting each square, recurse, take the min depth. Exponential without caching.",
        time: "O(exponential)",
        timeWhy: "The same remaining value is recomputed across many branches.",
        space: "O(n)",
        spaceWhy: "Recursion depth up to n (all ones).",
        code: `// Conceptual baseline — too slow, shown for contrast.
// least(i) = 0 if i==0, else 1 + min over j*j<=i of least(i - j*j).`,
      },
      {
        name: "Bottom-up DP (optimal)",
        intuition: "dp[i] = 1 + cheapest dp[i − square]. Fill from 0 up to n.",
        time: "O(n·√n)",
        timeWhy: "For each of n totals, the inner loop tries ~√n squares.",
        space: "O(n)",
        spaceWhy: "One dp array of size n+1.",
        code: `int numSquares(int n) {
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;                                   // zero squares sum to 0
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j * j <= i; j++) {
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "n=12. dp[0]=0. dp[1]=1, dp[2]=2, dp[3]=3, dp[4]=1 (4).",
          "dp[8]=2 (4+4). dp[12]=min(dp[11]+1, dp[8]+1, dp[3]+1)=min(…, 3, 4)=3.",
          "Answer 3 → 4+4+4.",
        ],
      },
    ],
    edgeCases: [
      "`n` is itself a perfect square → answer 1.",
      "`dp[0] = 0` seeds everything; without it the min never resolves.",
      "By Lagrange's four-square theorem the answer is always 1–4, but the DP discovers that on its own.",
    ],
    twists: [
      "**Use a fixed coin set instead of squares** → that's exactly Coin Change (322).",
      "**Count the ways instead of the minimum** → switch min to a sum, like Coin Change II.",
      "**BFS view** → each square is an edge; the answer is the shortest path from n to 0 — same complexity, different lens.",
    ],
    related: ["coin-change", "integer-break", "combination-sum-iv"],
  },

  {
    slug: "integer-break",
    title: "Integer Break",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 343,
    statement:
      "Given an integer `n`, break it into the sum of **at least two** positive integers and maximize the **product** of those integers. Return that maximum product.",
    examples: [
      { in: "n = 2", out: "1", note: "2 = 1 + 1" },
      { in: "n = 10", out: "36", note: "10 = 3 + 3 + 4" },
    ],
    constraints: ["2 ≤ n ≤ 58"],
    recognize:
      "'Split a number to **maximize a product**' has optimal substructure: the best break of `n` reuses the best break of a smaller piece. One integer parameter → 1-D DP indexed by the number being split.",
    figureItOut: [
      "Brute force: try every first piece `i`, then optimally break the rest. The 'optimally break the rest' part repeats for the same values → overlapping subproblems → DP.",
      "**State:** `dp[i]` = the maximum product obtainable by breaking `i` into **two or more** positive parts.",
      "**Recurrence:** pick a first part `j` (1 ≤ j < i). The remainder `i − j` can either be left whole (factor `i − j`) or itself broken (factor `dp[i − j]`). So `dp[i] = max over j of (j × max(i − j, dp[i − j]))`. The `max(i−j, dp[i−j])` handles 'don't always break further'.",
      "**Base case:** `dp[1] = 1` (a single 1 contributes a factor of 1). The required 'at least two parts' is enforced because the outer split always takes at least one `j` plus a remainder.",
      "**Table fill:** compute `dp[2], dp[3], …, dp[n]` in order; each uses only smaller indices. `dp[n]` is the answer.",
    ],
    approaches: [
      {
        name: "Top-down with memo",
        intuition: "Recursively best-break i; cache each i.",
        time: "O(n²)",
        timeWhy: "n subproblems, each scans up to n split points.",
        space: "O(n)",
        spaceWhy: "Memo plus recursion depth.",
        code: `int integerBreak(int n) {
    Integer[] memo = new Integer[n + 1];
    return best(n, memo, true);
}

// mustSplit=true for the top call (need >= 2 parts); false lets us keep i whole.
int best(int i, Integer[] memo, boolean mustSplit) {
    if (i == 1) return 1;
    if (!mustSplit && memo[i] != null) return memo[i];
    int product = mustSplit ? 0 : i;            // option: keep i whole (only when allowed)
    for (int j = 1; j < i; j++) {
        product = Math.max(product, j * best(i - j, memo, false));
    }
    if (!mustSplit) memo[i] = product;
    return product;
}`,
      },
      {
        name: "Bottom-up DP (optimal)",
        intuition: "dp[i] is the best product of two-or-more parts; each split reuses smaller dp values.",
        time: "O(n²)",
        timeWhy: "For each i up to n, scan j from 1 to i−1.",
        space: "O(n)",
        spaceWhy: "A single dp array of size n+1.",
        code: `int integerBreak(int n) {
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        for (int j = 1; j < i; j++) {
            // remainder i-j: either keep it whole (i-j) or break it (dp[i-j])
            dp[i] = Math.max(dp[i], j * Math.max(i - j, dp[i - j]));
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "n=10. dp[1]=1, dp[2]=1, dp[3]=2, dp[4]=4, dp[5]=6, dp[6]=9, dp[7]=12, dp[8]=18, dp[9]=27.",
          "dp[10] = max over j of j·max(10−j, dp[10−j]). Best at j=3: 3·max(7, dp[7]=12)=3·12=36.",
          "Answer 36 → 3+3+4.",
        ],
      },
    ],
    edgeCases: [
      "`n = 2` → must split into 1+1 → product 1, even though 2 itself is larger.",
      "`max(i−j, dp[i−j])` is essential: for small remainders keeping them whole beats breaking.",
      "Small n (2,3) are the cases where 'must split' actually loses value vs. the number itself.",
    ],
    twists: [
      "**Greedy/math shortcut** → break into as many 3s as possible (using 2s only for the remainder) — provable optimum, O(1) per the same answer.",
      "**Maximize the sum of squares of parts instead** → different objective, but the same dp skeleton.",
      "**Fixed number of parts k** → add a second dimension dp[i][k].",
    ],
    related: ["perfect-squares", "house-robber", "maximum-product-subarray"],
  },

  {
    slug: "longest-palindromic-subsequence",
    title: "Longest Palindromic Subsequence",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 516,
    statement:
      "Given a string `s`, return the length of its **longest palindromic subsequence** — characters kept in order but not necessarily contiguous, reading the same forwards and backwards.",
    examples: [
      { in: 's = "bbbab"', out: "4", note: '"bbbb"' },
      { in: 's = "cbbd"', out: "2", note: '"bb"' },
    ],
    constraints: ["1 ≤ s.length ≤ 1000", "lowercase English letters"],
    recognize:
      "A palindrome works **from both ends inward**, so the natural state is a range `[i..j]`. That's an interval DP — and the classic trick is that the longest palindromic *subsequence* of `s` equals the **LCS of `s` and its reverse**.",
    figureItOut: [
      "**State:** `dp[i][j]` = the length of the longest palindromic subsequence within the substring `s[i..j]` (inclusive).",
      "**Recurrence:** look at the two ends. If `s[i] == s[j]`, both belong to a palindrome wrapping the best of the inside: `dp[i][j] = 2 + dp[i+1][j-1]`. If they differ, drop one end: `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`.",
      "**Base cases:** a single character is a palindrome of length 1, so `dp[i][i] = 1`. Empty ranges (`i > j`) are 0.",
      "**Table fill:** because `dp[i][j]` depends on smaller ranges (`i+1`, `j-1`), iterate `i` from the end downward and `j` from `i+1` upward — so the inner cells are ready. `dp[0][n-1]` is the answer.",
      "Filed under 1-D DP because it's the **single-string** sibling of LCS: it reduces to `LCS(s, reverse(s))`, which is the canonical 1-D-roll DP.",
    ],
    approaches: [
      {
        name: "LCS of s and its reverse",
        intuition: "A palindromic subsequence reads the same forward and backward — exactly the common subsequence of s and reverse(s).",
        time: "O(n²)",
        timeWhy: "Standard LCS over two length-n strings.",
        space: "O(n)",
        spaceWhy: "Two rolling rows of the LCS table.",
        code: `int longestPalindromeSubseq(String s) {
    String r = new StringBuilder(s).reverse().toString();
    int n = s.length();
    int[] prev = new int[n + 1], cur = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == r.charAt(j - 1)) cur[j] = prev[j - 1] + 1;
            else cur[j] = Math.max(prev[j], cur[j - 1]);
        }
        int[] t = prev; prev = cur; cur = t;
    }
    return prev[n];
}`,
      },
      {
        name: "Interval DP on [i..j] (optimal, direct)",
        intuition: "Match the two ends: equal → wrap +2 around the inside; else drop a worse end.",
        time: "O(n²)",
        timeWhy: "There are ~n²/2 ranges, each filled in O(1).",
        space: "O(n²)",
        spaceWhy: "The full range table (can be rolled to O(n)).",
        code: `int longestPalindromeSubseq(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    for (int i = n - 1; i >= 0; i--) {
        dp[i][i] = 1;                                  // single char
        for (int j = i + 1; j < n; j++) {
            if (s.charAt(i) == s.charAt(j))
                dp[i][j] = 2 + dp[i + 1][j - 1];
            else
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
        }
    }
    return dp[0][n - 1];
}`,
        walkthrough: [
          's="bbbab". dp[i][i]=1 for all. Ends b==b grow: dp[0][1]=2, dp[1][2]=2.',
          'dp[0][4]: s[0]=b, s[4]=b match → 2 + dp[1][3]. dp[1][3] resolves to "bbb"=3.',
          "dp[0][4] = 2 + 3 − overlap handled by indices → final 4 (\"bbbb\").",
        ],
      },
    ],
    edgeCases: [
      "Single character → 1.",
      "No repeated characters at all → answer 1 (any single char).",
      "The `dp[i+1][j-1]` term can reference an empty range when j = i+1; default 0 makes the +2 correct.",
    ],
    twists: [
      "**Longest palindromic SUBSTRING** (contiguous) → different DP (expand-around-center or boolean isPal[i][j]); a subsequence is not a substring.",
      "**Minimum insertions to make a palindrome** (1312) → answer is `n − LPS(s)`.",
      "**Count palindromic subsequences** → switch the recurrence from max-length to a count (and watch double-counting).",
    ],
    related: ["longest-common-subsequence", "longest-palindromic-substring", "palindromic-substrings"],
  },

  {
    slug: "delete-and-earn",
    title: "Delete and Earn",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 740,
    statement:
      "Given `nums`, repeatedly pick any `nums[i]`, earn `nums[i]` points, then **delete every element equal to `nums[i] − 1` and `nums[i] + 1`**. Return the maximum points you can earn.",
    examples: [
      { in: "nums = [3,4,2]", out: "6", note: "take 4 (delete 3s), then take 2 → 4+2" },
      { in: "nums = [2,2,3,3,3,4]", out: "9", note: "take all the 3s → 9 (deletes 2s and 4s)" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2·10⁴", "1 ≤ nums[i] ≤ 10⁴"],
    recognize:
      "Taking a value forbids its **adjacent values** — that's House Robber in disguise. Bucket by value: `points[v]` = v × count(v). Now picking value `v` forbids `v−1` and `v+1`, exactly 'can't rob adjacent houses' over the value line.",
    figureItOut: [
      "First reframe. Since taking one copy of `v` deletes all `v−1` and `v+1` anyway, you might as well take **all copies of `v` at once**. So collapse the array into earnings per value: `points[v] = v × (how many times v appears)`.",
      "Now the rule is: if you take `points[v]`, you can't take `points[v−1]` or `points[v+1]`. Over the sorted value axis, that's *no two adjacent values* — the **House Robber** problem.",
      "**State:** walk values `v` from 1 to maxVal. `dp[v]` = the most points earnable considering values up to `v`.",
      "**Recurrence:** either skip `v` (keep `dp[v−1]`) or take it (`points[v] + dp[v−2]`, since `v−1` is now forbidden): `dp[v] = max(dp[v−1], points[v] + dp[v−2])`.",
      "**Base cases:** `dp[0] = 0`, `dp[1] = points[1]`. **Table fill:** sweep upward; `dp[maxVal]` is the answer. You only need the last two values, so it collapses to two scalars.",
    ],
    approaches: [
      {
        name: "Bucket then House Robber (optimal)",
        intuition: "Convert to points-per-value, then it's exactly 'rob non-adjacent values'.",
        time: "O(n + maxVal)",
        timeWhy: "One pass to bucket the n elements, one sweep over the value range.",
        space: "O(maxVal)",
        spaceWhy: "The points array sized to the largest value (the rob sweep itself is O(1)).",
        code: `int deleteAndEarn(int[] nums) {
    int maxVal = 0;
    for (int x : nums) maxVal = Math.max(maxVal, x);
    long[] points = new long[maxVal + 1];
    for (int x : nums) points[x] += x;            // total earnings for value x

    long take = 0, skip = 0;                       // dp[v-1] = max(take,skip)
    for (int v = 1; v <= maxVal; v++) {
        long curTake = skip + points[v];           // take v: forbids v-1
        long curSkip = Math.max(take, skip);       // skip v: best of v-1
        take = curTake;
        skip = curSkip;
    }
    return (int) Math.max(take, skip);
}`,
        walkthrough: [
          "nums=[2,2,3,3,3,4]. points: index→[0,0,4,9,4] (value2→4, value3→9, value4→4).",
          "v=1: take=0, skip=0. v=2: take=skip+4=4, skip=0. v=3: take=skip+9=0+9=9, skip=max(4,0)=4.",
          "v=4: take=skip+4=4+4=8, skip=max(9,4)=9. Answer max(8,9)=9 → take all the 3s.",
        ],
      },
    ],
    edgeCases: [
      "Single element → just earn it.",
      "All values equal (e.g. [3,3,3]) → no neighbors to delete, take them all → sum.",
      "Sparse values with gaps → the gap values have points 0, so the rob sweep naturally skips them.",
    ],
    twists: [
      "**Standard House Robber** (198) is the same recurrence on an array index instead of a value axis.",
      "**Circular constraint** (House Robber II, 213) → run the linear rob twice excluding one end.",
      "**Delete v also removes v−2/v+2** → the forbidden window widens; the rob recurrence must reach further back.",
    ],
    related: ["house-robber", "house-robber-ii", "maximum-product-subarray"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "unique-paths-ii",
    title: "Unique Paths II",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 63,
    statement:
      "A robot starts at the top-left of an `m × n` grid and may move only **right or down**, aiming for the bottom-right. Some cells contain an **obstacle** (`1`); the robot cannot enter them. Return the number of distinct paths.",
    examples: [
      { in: "grid = [[0,0,0],[0,1,0],[0,0,0]]", out: "2" },
      { in: "grid = [[0,1],[0,0]]", out: "1" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "grid[i][j] is 0 or 1"],
    recognize:
      "Grid paths with only right/down moves → 2-D DP where each cell's count is the sum of the cell above and the cell to the left. The obstacle twist: a blocked cell simply contributes **0 paths** instead of summing.",
    figureItOut: [
      "**State:** `dp[i][j]` = the number of distinct obstacle-free paths from the start to cell `(i, j)`.",
      "**Recurrence:** you can only arrive at `(i, j)` from above or from the left, so `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. **If `(i, j)` is an obstacle, `dp[i][j] = 0`** — no path can pass through it.",
      "**Base cases:** the start `dp[0][0] = 1` (if it isn't itself an obstacle, else 0). The first row/column are reachable only straight along, and any obstacle there cuts off everything after it (handled automatically because a 0 propagates).",
      "**Table fill:** sweep row by row, left to right, so `dp[i-1][j]` and `dp[i][j-1]` are already known. `dp[m-1][n-1]` is the answer.",
      "Because each row depends only on the previous, you can roll the table down to a single 1-D array of length n.",
    ],
    approaches: [
      {
        name: "Full 2-D table",
        intuition: "Each free cell sums the paths from above and left; obstacles are 0.",
        time: "O(m·n)",
        timeWhy: "Fill every cell once in O(1).",
        space: "O(m·n)",
        spaceWhy: "The full dp grid.",
        code: `int uniquePathsWithObstacles(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 1) { dp[i][j] = 0; continue; }  // obstacle
            if (i == 0 && j == 0) { dp[i][j] = 1; continue; } // start
            int up = i > 0 ? dp[i - 1][j] : 0;
            int left = j > 0 ? dp[i][j - 1] : 0;
            dp[i][j] = up + left;
        }
    }
    return dp[m - 1][n - 1];
}`,
      },
      {
        name: "Rolling 1-D array (optimal space)",
        intuition: "Only the previous row matters; reuse one row in place.",
        time: "O(m·n)",
        timeWhy: "Same cell count, just one row of storage.",
        space: "O(n)",
        spaceWhy: "A single row reused across all m rows.",
        code: `int uniquePathsWithObstacles(int[][] grid) {
    int n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = grid[0][0] == 1 ? 0 : 1;
    for (int[] row : grid) {
        for (int j = 0; j < n; j++) {
            if (row[j] == 1) dp[j] = 0;                 // blocked → 0
            else if (j > 0) dp[j] += dp[j - 1];          // up (old dp[j]) + left
        }
    }
    return dp[n - 1];
}`,
        walkthrough: [
          "grid=[[0,0,0],[0,1,0],[0,0,0]]. Row0 dp=[1,1,1].",
          "Row1: dp[0]=1, dp[1] blocked→0, dp[2]=0+1=1 → dp=[1,0,1].",
          "Row2: dp[0]=1, dp[1]=0+1=1, dp[2]=1+1=2 → answer 2.",
        ],
      },
    ],
    edgeCases: [
      "Start or destination is an obstacle → 0 paths.",
      "An obstacle in the first row/column zeroes everything beyond it on that line.",
      "1×1 free grid → 1 path (you're already there).",
    ],
    twists: [
      "**No obstacles** (Unique Paths, 62) → pure combinatorics C(m+n−2, m−1), no DP needed.",
      "**Minimize a cost instead of counting** → sum becomes min (Minimum Path Sum).",
      "**Add diagonal moves or a step budget** → extend the recurrence / add a dimension.",
    ],
    related: ["unique-paths", "minimum-path-sum", "maximal-square"],
  },

  {
    slug: "minimum-path-sum",
    title: "Minimum Path Sum",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 64,
    statement:
      "Given an `m × n` grid of non-negative numbers, find a path from the top-left to the bottom-right that **minimizes the sum** of the numbers along it. You may move only **right or down**. Return that minimum sum.",
    examples: [
      { in: "grid = [[1,3,1],[1,5,1],[4,2,1]]", out: "7", note: "1→3→1→1→1" },
      { in: "grid = [[1,2,3],[4,5,6]]", out: "12", note: "1→2→3→6" },
    ],
    constraints: ["1 ≤ m, n ≤ 200", "0 ≤ grid[i][j] ≤ 200"],
    recognize:
      "Right/down grid traversal optimizing a cost → 2-D DP. It's the *minimize* cousin of Unique Paths: instead of **summing** the two predecessors' path counts, you **add the current cell** to the cheaper predecessor.",
    figureItOut: [
      "**State:** `dp[i][j]` = the minimum sum of any right/down path from the start to cell `(i, j)`.",
      "**Recurrence:** you reach `(i, j)` from above or from the left, so take the cheaper of those and add the current cell: `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`.",
      "**Base cases:** `dp[0][0] = grid[0][0]`. The first row can only be reached by moving right, so it's a running prefix sum; likewise the first column moving down. (Treat off-grid predecessors as +∞ so `min` ignores them.)",
      "**Table fill:** sweep row by row, left to right — both predecessors are already computed. `dp[m-1][n-1]` is the answer.",
      "Each row needs only the row above, so it rolls to a single 1-D array of length n.",
    ],
    approaches: [
      {
        name: "In-place / 2-D DP",
        intuition: "Each cell holds the cheapest sum to reach it: its value plus the smaller predecessor.",
        time: "O(m·n)",
        timeWhy: "Each cell computed once in O(1).",
        space: "O(1)",
        spaceWhy: "Overwrites the grid in place (or O(m·n) with a separate table).",
        code: `int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) continue;          // start: keep its own value
            int up = i > 0 ? grid[i - 1][j] : Integer.MAX_VALUE;
            int left = j > 0 ? grid[i][j - 1] : Integer.MAX_VALUE;
            grid[i][j] += Math.min(up, left);
        }
    }
    return grid[m - 1][n - 1];
}`,
        walkthrough: [
          "grid=[[1,3,1],[1,5,1],[4,2,1]]. Row0 prefix: [1,4,5].",
          "Row1: [1+1=2, 5+min(4,2)=7, 1+min(5,7)=6]. Row2: [4+2=6, 2+min(7,6)=8, 1+min(6,8)=7].",
          "Bottom-right = 7 → path 1→1→5? no: 1→3→1→1→1 sums to 7. Answer 7.",
        ],
      },
      {
        name: "Rolling 1-D array",
        intuition: "Keep just the previous row's costs.",
        time: "O(m·n)",
        timeWhy: "Same work, one row of memory.",
        space: "O(n)",
        spaceWhy: "A single length-n array.",
        code: `int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[j] = dp[j - 1] + grid[0][j]; // first row
    for (int i = 1; i < m; i++) {
        dp[0] += grid[i][0];                                    // first column
        for (int j = 1; j < n; j++)
            dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);    // up vs left
    }
    return dp[n - 1];
}`,
      },
    ],
    edgeCases: [
      "Single row or single column → only one possible path (a prefix sum).",
      "1×1 grid → just that cell's value.",
      "Off-grid predecessors must read as +∞ so the first row/column don't wrongly borrow.",
    ],
    twists: [
      "**Count paths instead of minimizing** → that's Unique Paths (sum, not min).",
      "**Maximize the sum** → flip `min` to `max`.",
      "**Allow all four directions / weights with negatives** → no longer a clean DAG DP; needs Dijkstra (Path With Minimum Effort) or Bellman-Ford.",
    ],
    related: ["unique-paths", "unique-paths-ii", "dungeon-game"],
  },

  {
    slug: "maximal-square",
    title: "Maximal Square",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 221,
    statement:
      "Given an `m × n` binary matrix of `0`s and `1`s, find the **largest square containing only 1s** and return its **area**.",
    examples: [
      { in: "matrix = [[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]", out: "4", note: "a 2×2 square" },
      { in: "matrix = [[0,1],[1,0]]", out: "1" },
    ],
    constraints: ["1 ≤ m, n ≤ 300", "matrix[i][j] is '0' or '1'"],
    recognize:
      "'Largest all-1s **square**' is a 2-D DP where each cell stores the side of the biggest square whose **bottom-right corner** sits there. The cell can only extend a square as far as its three neighbours (top, left, top-left) jointly allow.",
    figureItOut: [
      "**State:** `dp[i][j]` = the side length of the largest all-1s square whose **bottom-right corner** is cell `(i, j)`.",
      "**Recurrence (the clever part):** if `matrix[i][j] == 1`, a square ending here is bounded by the worst of its three predecessors — the squares ending at the top, the left, and the top-left diagonal. Any one of them being small caps you. So `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`. If the cell is 0, `dp[i][j] = 0`.",
      "Why the min? To grow a `k×k` square ending here, you need `(k−1)×(k−1)` squares completed above, to the left, and diagonally; the smallest of the three is the binding constraint.",
      "**Base cases:** the first row and first column can hold at most a 1×1 square, so `dp[i][j] = matrix[i][j]` there.",
      "**Table fill:** sweep top-left to bottom-right; track the max side seen. The answer is `maxSide²` (area, not side).",
    ],
    approaches: [
      {
        name: "2-D DP on the corner",
        intuition: "Each 1-cell's square side is 1 + the smallest of its three completed neighbours.",
        time: "O(m·n)",
        timeWhy: "Each cell computed once in O(1).",
        space: "O(m·n)",
        spaceWhy: "The dp grid (rollable to O(n)).",
        code: `int maximalSquare(char[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int[][] dp = new int[m][n];
    int best = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == '1') {
                if (i == 0 || j == 0) dp[i][j] = 1;          // edge: only 1x1
                else dp[i][j] = 1 + Math.min(dp[i - 1][j],
                                    Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
                best = Math.max(best, dp[i][j]);
            }
        }
    }
    return best * best;                                       // area
}`,
        walkthrough: [
          "In the sample, dp builds up to a 2 at the cell where a 2×2 block of 1s closes (rows 1–2, cols 2–3).",
          "min(neighbours)=1 there, so dp=1+1=2; best=2.",
          "Area = 2² = 4.",
        ],
      },
      {
        name: "Rolling 1-D with a diagonal carry",
        intuition: "Keep one row; remember the overwritten top-left value in a temp.",
        time: "O(m·n)",
        timeWhy: "Same traversal.",
        space: "O(n)",
        spaceWhy: "One row plus a single 'prev diagonal' scalar.",
        code: `int maximalSquare(char[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int[] dp = new int[n + 1];
    int best = 0, prev = 0;                       // prev = dp[i-1][j-1]
    for (int i = 1; i <= m; i++) {
        prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];                     // save before overwrite
            if (matrix[i - 1][j - 1] == '1') {
                dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j - 1]));
                best = Math.max(best, dp[j]);
            } else dp[j] = 0;
            prev = temp;
        }
    }
    return best * best;
}`,
      },
    ],
    edgeCases: [
      "All 0s → answer 0.",
      "All 1s → the largest square is min(m, n), area min(m,n)².",
      "Return the AREA (side²), not the side — a common off-by-square mistake.",
    ],
    twists: [
      "**Count all square submatrices of 1s** (1277) → instead of the max, sum every dp[i][j] (each is also the count of squares ending there).",
      "**Maximal RECTANGLE of 1s** (85) → squares don't generalize; use the histogram / largest-rectangle-in-histogram approach.",
      "**Largest square of a given color/value** → same DP with an equality test instead of '1'.",
    ],
    related: ["unique-paths-ii", "minimum-path-sum", "dungeon-game"],
  },

  {
    slug: "ones-and-zeroes",
    title: "Ones and Zeroes",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 474,
    statement:
      "Given an array of binary `strs` and two budgets `m` (zeros) and `n` (ones), return the size of the **largest subset** of `strs` such that the total zeros used is ≤ `m` and total ones used is ≤ `n`.",
    examples: [
      { in: 'strs = ["10","0001","111001","1","0"], m = 5, n = 3', out: "4", note: '{"10","0001","1","0"}' },
      { in: 'strs = ["10","0","1"], m = 1, n = 1', out: "2", note: '{"0","1"}' },
    ],
    constraints: ["1 ≤ strs.length ≤ 600", "1 ≤ m, n ≤ 100", "each string is binary"],
    recognize:
      "Each string costs (zeros, ones) and is either taken or skipped → a **0/1 knapsack**, but with **two capacities** instead of one. Two budgets means the DP state is 2-D: `dp[zeros][ones]`, processed item by item.",
    figureItOut: [
      "Each string is a single item you either include or not — that's the 0/1 knapsack signature. The novelty: it consumes **two** resources at once, zeros and ones, each with its own cap.",
      "**State:** `dp[z][o]` = the maximum number of strings you can pick using at most `z` zeros and `o` ones (after considering the items processed so far).",
      "**Recurrence (per string with c0 zeros, c1 ones):** skip it → `dp[z][o]` unchanged; take it (when it fits) → `1 + dp[z − c0][o − c1]`. Keep the max: `dp[z][o] = max(dp[z][o], 1 + dp[z − c0][o − c1])`.",
      "**Base case:** `dp` all zeros before any item (picking nothing uses nothing). **0/1 trick:** iterate the two capacities **downward** so each string is counted at most once (a forward sweep would let a string be reused, turning it into unbounded knapsack).",
      "**Table fill:** outer loop over strings; inner loops `z` from `m` down to `c0`, `o` from `n` down to `c1`. The answer is `dp[m][n]`.",
    ],
    approaches: [
      {
        name: "2-D 0/1 knapsack (optimal)",
        intuition: "Treat zeros and ones as two capacities; for each string, update the table backward so it's used once.",
        time: "O(L·m·n)",
        timeWhy: "For each of L strings, update the full m×n capacity table.",
        space: "O(m·n)",
        spaceWhy: "The two-capacity table, rolled across items.",
        code: `int findMaxForm(String[] strs, int m, int n) {
    int[][] dp = new int[m + 1][n + 1];              // dp[zeros][ones]
    for (String s : strs) {
        int c0 = 0, c1 = 0;
        for (char ch : s.toCharArray()) { if (ch == '0') c0++; else c1++; }
        // iterate downward so this string is used at most once (0/1)
        for (int z = m; z >= c0; z--) {
            for (int o = n; o >= c1; o--) {
                dp[z][o] = Math.max(dp[z][o], 1 + dp[z - c0][o - c1]);
            }
        }
    }
    return dp[m][n];
}`,
        walkthrough: [
          'strs=["10","0001","111001","1","0"], m=5,n=3. Each string\'s (zeros,ones): 10→(1,1), 0001→(3,1), 111001→(2,4), 1→(0,1), 0→(1,0).',
          '"111001" needs 4 ones > n=3, so it can never be taken.',
          "Best subset uses 5 zeros / 3 ones across {10, 0001, 1, 0} → dp[5][3] = 4.",
        ],
      },
    ],
    edgeCases: [
      "A string with more ones than `n` (or more zeros than `m`) can never be picked — the downward loop simply never reaches it.",
      "Backward iteration is mandatory; a forward sweep silently allows reusing a string.",
      "Empty budgets (m=0,n=0) → only zero-cost strings (impossible here) count → 0.",
    ],
    twists: [
      "**One capacity instead of two** → classic 0/1 knapsack / Partition Equal Subset Sum.",
      "**Unbounded reuse of each string** → iterate the capacities upward instead of downward.",
      "**Maximize total value rather than count** → replace `1 +` with the item's value.",
    ],
    related: ["partition-equal-subset-sum", "target-sum", "coin-change-ii"],
  },

  {
    slug: "dungeon-game",
    title: "Dungeon Game",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 174,
    statement:
      "A knight starts at the top-left of an `m × n` dungeon and must rescue the princess at the bottom-right, moving only **right or down**. Each cell adds (positive) or drains (negative) health; if health ever drops to **0 or below**, the knight dies. Return the **minimum starting health** (≥ 1) needed to survive the journey.",
    examples: [
      { in: "dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]", out: "7", note: "start with 7 HP and survive every cell" },
      { in: "dungeon = [[0]]", out: "1" },
    ],
    constraints: ["1 ≤ m, n ≤ 200", "−1000 ≤ dungeon[i][j] ≤ 1000"],
    recognize:
      "The constraint is on a **running minimum** (health must stay > 0 the whole way), and the requirement at a cell depends on what's still *ahead*, not behind. That forward-dependence flips the DP: fill it **backward** from the princess, with `dp[i][j]` = the minimum HP needed *entering* that cell.",
    figureItOut: [
      "Why not a normal forward DP? Because maximizing health-so-far doesn't tell you if you'll survive later — a rich early path can still die in a brutal later cell. The binding requirement points forward, so we reason backward.",
      "**State:** `dp[i][j]` = the **minimum health needed at the moment you enter cell `(i, j)`** to be able to reach the end alive.",
      "**Recurrence:** from `(i, j)` you'll step to the cheaper of right/down — needing `min(dp[i+1][j], dp[i][j+1])` upon arrival there. So before adding this cell you need `need = min(next) − dungeon[i][j]`. But health must stay ≥ 1, so `dp[i][j] = max(1, need)`.",
      "**Base cases:** at the princess cell, you need `max(1, 1 − dungeon[m-1][n-1])`. Cells past the grid are treated as +∞ so the `min` ignores them.",
      "**Table fill:** start at the bottom-right and sweep **up and left** so `dp[i+1][j]` and `dp[i][j+1]` are ready. `dp[0][0]` is the minimum starting health.",
    ],
    approaches: [
      {
        name: "Backward 2-D DP (optimal)",
        intuition: "Compute the minimum HP needed entering each cell, working back from the princess; clamp to ≥ 1 because the knight must never hit 0.",
        time: "O(m·n)",
        timeWhy: "Each cell computed once in O(1).",
        space: "O(m·n)",
        spaceWhy: "The dp grid (rollable to O(n)).",
        code: `int calculateMinimumHP(int[][] dungeon) {
    int m = dungeon.length, n = dungeon[0].length;
    int[][] dp = new int[m + 1][n + 1];
    // sentinel: everything off-grid needs +infinity health (unreachable goal)
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[m][n - 1] = dp[m - 1][n] = 1;             // just past the princess: need 1 HP
    for (int i = m - 1; i >= 0; i--) {
        for (int j = n - 1; j >= 0; j--) {
            int need = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
            dp[i][j] = Math.max(1, need);          // health must stay >= 1
        }
    }
    return dp[0][0];
}`,
        walkthrough: [
          "dungeon=[[-2,-3,3],[-5,-10,1],[10,30,-5]]. Princess cell −5: need max(1, 1−(−5))=6.",
          "Working back, the binding path is the top row then down the right; entering (0,0) requires 7 HP.",
          "Answer 7.",
        ],
      },
    ],
    edgeCases: [
      "A forward 'max health' DP is wrong — survival depends on future cells, so the DP must run backward.",
      "Very positive cells still clamp to a minimum need of 1 (`max(1, …)`) — you can't enter with 0 health.",
      "Single cell → max(1, 1 − dungeon[0][0]).",
    ],
    twists: [
      "**Minimum/Maximum path sum** (64) → those depend only on the past, so they fill forward; this one is backward precisely because of the survival floor.",
      "**Collect maximum gold while surviving** → a two-objective DP, much harder.",
      "**Allow up/left moves too** → it stops being a DAG; you'd need shortest-path with a survival constraint.",
    ],
    related: ["minimum-path-sum", "unique-paths-ii", "maximal-square"],
  },
];
