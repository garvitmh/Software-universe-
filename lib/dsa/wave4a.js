// NeetCode 150 — wave 4a (2-D DP + two graph stragglers). Java.
export const WAVE4A = [
  // ───────────────────────────── 2-D DYNAMIC PROGRAMMING ─────────────────────────────
  {
    slug: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 62,
    statement:
      "A robot sits in the top-left cell of an `m × n` grid and wants to reach the bottom-right cell. It may only move **right** or **down**. Return how many **distinct paths** it can take.",
    examples: [
      { in: "m = 3, n = 7", out: "28" },
      { in: "m = 3, n = 2", out: "3", note: "down-down-right, down-right-down, right-down-down" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "The answer fits in a 32-bit signed integer"],
    recognize:
      "Two indices (row, column) and 'count the paths to a cell built from its neighbours' is the **2-D DP** signature. A grid where each cell's answer depends on the cell above and the cell to its left.",
    figureItOut: [
      "Ask the end-first question: *to be standing on cell `(i, j)`, where did I just come from?* The only moves are right and down, so the previous cell was either **above** it `(i-1, j)` (a down move) or **to its left** `(i, j-1)` (a right move). No other way to arrive.",
      "So the number of paths to `(i, j)` is **paths to (i-1, j) + paths to (i, j-1)** — every path that reached the cell above extends by one down move, every path that reached the cell to the left extends by one right move, and these two families never overlap. That's the **recurrence**.",
      "Name the **2-D state**: `dp[i][j]` = number of distinct paths from the start to cell `(i, j)`. The recurrence is `dp[i][j] = dp[i-1][j] + dp[i][j-1]`. **Base cases**: the entire first row and first column are all `1` — there's exactly one way to walk straight along an edge (all rights, or all downs).",
      "Write that recurrence as a plain recursion and `paths(i-1, j-1)` gets recomputed by both `paths(i-1, j)` and `paths(i, j-1)` — the same subproblems explode exponentially. **Fill a table** bottom-up (or memoize top-down) so each `dp[i][j]` is computed once, row by row.",
      "Optimize the space: row `i` only ever reads row `i-1` and the cell just left of it in the current row. Keep a **single rolling row** and overwrite it left to right → **O(n) space** instead of the full `m × n` grid.",
    ],
    approaches: [
      {
        name: "Bottom-up table",
        intuition: "Seed the first row and column to 1, then fill each cell as above + left.",
        time: "O(m·n)",
        timeWhy: "Every one of the m·n cells is computed once in O(1).",
        space: "O(m·n)",
        spaceWhy: "The full dp grid.",
        code: `int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int i = 0; i < m; i++) dp[i][0] = 1;   // first column: one way down
    for (int j = 0; j < n; j++) dp[0][j] = 1;   // first row: one way right
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}`,
        walkthrough: [
          "m=3, n=2. First column all 1: [1,_],[1,_],[1,_]. First row all 1: [1,1],[1,_],[1,_].",
          "dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2. dp[2][1] = dp[1][1] + dp[2][0] = 2 + 1 = 3.",
          "Answer dp[2][1] = 3.",
        ],
      },
      {
        name: "Rolling row (optimal space)",
        intuition: "Only the previous row matters; reuse one array, adding the value to its left as you sweep right.",
        time: "O(m·n)",
        timeWhy: "Same number of cell updates, just stored in one row.",
        space: "O(n)",
        spaceWhy: "A single array of width n.",
        code: `int uniquePaths(int m, int n) {
    int[] row = new int[n];
    Arrays.fill(row, 1);                 // the top row: all 1
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            row[j] = row[j] + row[j - 1]; // row[j]=above (old), row[j-1]=left (new)
        }
    }
    return row[n - 1];
}`,
        walkthrough: [
          "m=3, n=7 starts row=[1,1,1,1,1,1,1].",
          "After row i=1: [1,2,3,4,5,6,7]. After i=2: [1,3,6,10,15,21,28].",
          "Answer row[6] = 28.",
        ],
      },
    ],
    edgeCases: [
      "A single row or single column (m=1 or n=1) → exactly 1 path (the base cases cover it).",
      "Constraints guarantee the count fits in `int`; for larger grids you'd switch to `long`.",
    ],
    twists: [
      "**Obstacles in some cells** (Unique Paths II, LeetCode 63) → set `dp[i][j] = 0` for any blocked cell so no path passes through it.",
      "**Minimum path sum instead of count** (LeetCode 64) → same grid recurrence but `dp[i][j] = grid[i][j] + min(up, left)`.",
      "**Pure math shortcut** → the answer is the binomial `C(m+n-2, m-1)`: you choose which of the `m+n-2` moves are the downs.",
    ],
    related: ["climbing-stairs", "longest-common-subsequence"],
  },

  {
    slug: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1143,
    statement:
      "Given two strings `text1` and `text2`, return the length of their **longest common subsequence** (characters appearing in the same relative order in both, not necessarily contiguous). Return 0 if there is none.",
    examples: [
      { in: 'text1 = "abcde", text2 = "ace"', out: "3", note: '"ace"' },
      { in: 'text1 = "abc", text2 = "abc"', out: "3", note: 'the whole string' },
      { in: 'text1 = "abc", text2 = "def"', out: "0", note: "no shared characters" },
    ],
    constraints: ["1 ≤ text1.length, text2.length ≤ 1000", "lowercase English letters"],
    recognize:
      "**Two strings compared, build the answer from their prefixes** → the canonical **2-D DP**. `dp[i][j]` is the answer for the first `i` characters of one and first `j` of the other; almost every two-sequence problem (edit distance, LCS, interleaving) lives here.",
    figureItOut: [
      "Brute force enumerates every subsequence of one string and checks if it appears in the other — exponential. The repeated work is comparing the same prefix pairs over and over, which screams DP.",
      "Look at the **last characters** of the two prefixes you're comparing. Two cases. If `text1[i-1] == text2[j-1]`, that matching character is worth taking — it adds 1 on top of the best you could do with both strings one character shorter: `1 + dp[i-1][j-1]`.",
      "If the last characters **differ**, at least one of them can't be in the common subsequence, so you drop one and take the better outcome: `max(dp[i-1][j], dp[i][j-1])` — either ignore text1's last char or ignore text2's last char.",
      "Name the **2-D state**: `dp[i][j]` = length of the LCS of `text1[0..i)` and `text2[0..j)`. The recurrence relates it to `dp[i-1][j-1]` (the match case), `dp[i-1][j]`, and `dp[i][j-1]` (the drop cases). **Base cases**: `dp[0][j] = dp[i][0] = 0` — an empty prefix shares nothing.",
      "**Fill the table** bottom-up, row by row, from `dp[1][1]` to `dp[m][n]`; the answer is the bottom-right cell. Each row only reads the row above and the cell to the left, so you can **roll one row** for O(n) space.",
    ],
    approaches: [
      {
        name: "Bottom-up table",
        intuition: "Match → 1 + diagonal; mismatch → max of up and left.",
        time: "O(m·n)",
        timeWhy: "Each of the m·n cells is filled once in O(1).",
        space: "O(m·n)",
        spaceWhy: "The (m+1)×(n+1) dp grid (the extra row/column holds the empty-prefix base cases).",
        code: `int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];   // dp[0][*] and dp[*][0] start at 0
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = 1 + dp[i - 1][j - 1];          // take the matching char
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]); // drop one side
            }
        }
    }
    return dp[m][n];
}`,
        walkthrough: [
          'text1="ace", text2="abcde". Empty row/column are 0.',
          "Where 'a' meets 'a', 'c' meets 'c', 'e' meets 'e', the diagonal carry adds 1 each time.",
          "The bottom-right cell ends at 3 → LCS length 3 ('ace').",
        ],
      },
      {
        name: "Rolling row (optimal space)",
        intuition: "Keep the previous row; remember the diagonal value before overwriting it.",
        time: "O(m·n)",
        timeWhy: "Same cell count.",
        space: "O(n)",
        spaceWhy: "Two rows of width n+1 (previous and current).",
        code: `int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[] prev = new int[n + 1];
    for (int i = 1; i <= m; i++) {
        int[] cur = new int[n + 1];
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1))
                cur[j] = 1 + prev[j - 1];                // diagonal
            else
                cur[j] = Math.max(prev[j], cur[j - 1]);  // up vs left
        }
        prev = cur;
    }
    return prev[n];
}`,
        walkthrough: [
          'text1="abc", text2="abc". Row for a: [0,1,1,1]. Row for b: [0,1,2,2].',
          "Row for c: [0,1,2,3]. prev[n] = 3 → whole string matches.",
        ],
      },
    ],
    edgeCases: [
      "No shared characters → every cell stays 0 → return 0.",
      "One string is a subsequence of the other → answer is the shorter length.",
      "Off-by-one trap: `dp` has size (m+1)×(n+1); `text1.charAt(i-1)` indexes the real string while `dp[i]` includes the empty prefix at index 0.",
    ],
    twists: [
      "**Reconstruct the subsequence itself** → walk back from `dp[m][n]`: a diagonal +1 step means that character is part of the LCS.",
      "**Longest common substring (contiguous)** → on a mismatch reset `dp[i][j] = 0` instead of taking max, and track the global maximum cell.",
      "**Shortest common supersequence / minimum deletions** → both are simple functions of `m + n − LCS`.",
    ],
    related: ["edit-distance", "distinct-subsequences"],
  },

  {
    slug: "best-time-to-buy-and-sell-stock-with-cooldown",
    title: "Best Time to Buy and Sell Stock with Cooldown",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 309,
    statement:
      "Given `prices` where `prices[i]` is the price on day i, find the **maximum profit** with as many transactions as you like (buy then sell), subject to one rule: after you **sell**, you must **cool down for one day** — you cannot buy on the very next day.",
    examples: [
      { in: "prices = [1,2,3,0,2]", out: "3", note: "buy 1, sell 2, cooldown, buy 0, sell 2 → 1 + 2 = 3" },
      { in: "prices = [1]", out: "0", note: "can't complete a transaction" },
    ],
    constraints: ["1 ≤ prices.length ≤ 5000", "0 ≤ prices[i] ≤ 1000"],
    recognize:
      "Profit problems with a constraint that ties **today's choice to yesterday's action** (the cooldown) are **state-machine DP**. The two indices are (day, holding-state): `dp[i][state]` where state encodes whether you currently hold a share.",
    figureItOut: [
      "Greedy (grab every upswing) breaks here because the cooldown makes a choice today forbid an action tomorrow — local greed can leave you stuck. That coupling across days is the signal for DP with a remembered **state**.",
      "What state do you need beyond the day? Whether you're currently **holding** a share or **not**. But 'not holding' splits further: you might be free to buy, or you might be in the **cooldown** day right after a sale. So three states: **hold**, **sold (cooldown)**, **rest (free to buy)**.",
      "Write the transitions as the recurrence. `hold[i] = max(hold[i-1], rest[i-1] - price[i])` — either you keep holding, or you buy today (only allowed from a rest day). `sold[i] = hold[i-1] + price[i]` — you must have been holding, and you sell. `rest[i] = max(rest[i-1], sold[i-1])` — you stay idle, or you just finished the mandatory cooldown after a sale.",
      "Name the **2-D state**: `dp[i][s]` for `s` in {hold, sold, rest} = the max profit through day `i` ending in state `s`. **Base cases** on day 0: `hold = -prices[0]` (bought it), `sold = 0` (can't have sold yet — effectively −∞/0), `rest = 0`. The answer is `max(sold[n-1], rest[n-1])` — never finish still holding a share.",
      "**Fill day by day.** Each day's three states read only the previous day's three states, so you don't even need the full table — **roll three scalars**, O(1) space (a row-rolling of the (n × 3) grid down to a single column).",
    ],
    approaches: [
      {
        name: "Three-state machine, rolling scalars (optimal)",
        intuition: "Track best profit ending each day in hold / sold / rest; the cooldown is baked into 'buy only from rest'.",
        time: "O(n)",
        timeWhy: "One pass over n days, O(1) transitions each.",
        space: "O(1)",
        spaceWhy: "Three rolling variables instead of an n×3 table.",
        code: `int maxProfit(int[] prices) {
    int hold = Integer.MIN_VALUE; // best profit while currently holding a share
    int sold = 0;                 // best profit on the day we just sold (cooldown next)
    int rest = 0;                 // best profit while idle and free to buy
    for (int price : prices) {
        int prevSold = sold;
        sold = hold + price;                  // sell what we held
        hold = Math.max(hold, rest - price);  // keep holding, or buy from a rest day
        rest = Math.max(rest, prevSold);      // stay resting, or come off cooldown
    }
    return Math.max(sold, rest);              // never end still holding
}`,
        walkthrough: [
          "prices=[1,2,3,0,2]. Day0(1): hold=-1, sold=-inf-ish, rest=0.",
          "Day1(2): sold=1, hold=max(-1, 0-2)=-1, rest=max(0,-inf)=0.",
          "Day2(3): sold=2, hold=max(-1,0-3)=-1, rest=max(0,1)=1.",
          "Day3(0): sold=-1, hold=max(-1,1-0)=1, rest=max(1,2)=2.",
          "Day4(2): sold=1+2=3, hold=max(1,2-2)=1, rest=max(2,-1)=2 → answer max(3,2)=3.",
        ],
      },
    ],
    edgeCases: [
      "Single day or strictly decreasing prices → no profitable transaction → 0.",
      "Day-0 `sold` is logically impossible; initializing `hold = MIN_VALUE` keeps any spurious early sale from beating the real answer.",
      "The classic bug is buying straight after selling — buying only from `rest` (never from `sold`) is what enforces the cooldown.",
    ],
    twists: [
      "**Transaction fee instead of cooldown** (LeetCode 714) → drop the cooldown state; subtract the fee when you sell. Two states suffice.",
      "**At most k transactions** (LeetCode 188) → add a transaction-count dimension: `dp[i][k][holding]`.",
      "**Unlimited transactions, no cooldown** (LeetCode 122) → collapses to greedily summing every positive day-to-day gain.",
    ],
    related: ["best-time-to-buy-sell-stock", "coin-change"],
  },

  {
    slug: "coin-change-ii",
    title: "Coin Change II",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 518,
    statement:
      "Given an integer `amount` and an array of distinct `coins`, return the **number of distinct combinations** of coins that add up to `amount` (unlimited supply of each coin). Order doesn't matter — `[1,2]` and `[2,1]` count as one combination. Return 0 if it can't be made.",
    examples: [
      { in: "amount = 5, coins = [1,2,5]", out: "4", note: "5; 2+2+1; 2+1+1+1; 1+1+1+1+1" },
      { in: "amount = 3, coins = [2]", out: "0", note: "can't make 3 from 2s" },
      { in: "amount = 0, coins = [7]", out: "1", note: "the empty combination" },
    ],
    constraints: ["1 ≤ coins.length ≤ 300", "1 ≤ coins[i] ≤ 5000", "0 ≤ amount ≤ 5000"],
    recognize:
      "**Count combinations** (order-insensitive) under a budget = an **unbounded-knapsack 2-D DP** over (which coins are allowed, amount). The 'combinations not permutations' rule is exactly what the two-dimensional 'coins considered so far' axis enforces.",
    figureItOut: [
      "First, why count is subtle: if you naively do `ways[a] += ways[a - coin]` over all coins for each amount, you count `1+2` and `2+1` separately — **permutations**, not combinations. You must stop order from mattering.",
      "The fix is the second dimension: **introduce coins one at a time** and decide, for each coin, how many of *it* to use before ever touching the next coin. That imposes a fixed coin order, so each multiset is counted exactly once.",
      "For coin `c` and target `a`, two choices: **don't use coin c at all** → `dp[c-1][a]` (the ways using only earlier coins), or **use at least one c** → `dp[c][a - coins[c]]` (still allowed to reuse c, since supply is unlimited). Sum them.",
      "Name the **2-D state**: `dp[c][a]` = number of combinations making amount `a` using only the first `c` coin types. The recurrence is `dp[c][a] = dp[c-1][a] + dp[c][a - coins[c-1]]` — note one term steps to the **previous row** (skip the coin) and the other stays in the **current row** (reuse the coin). **Base case**: `dp[*][0] = 1` (one way to make 0 — pick nothing).",
      "**Fill the table** coin row by coin row. Then collapse it: `dp[c][a]` reads `dp[c-1][a]` (directly above) and `dp[c][a - coin]` (to the left in the same row). **Roll one row** and sweep amounts **ascending** so the reuse term reads the already-updated value → O(amount) space.",
    ],
    approaches: [
      {
        name: "Bottom-up table over (coin, amount)",
        intuition: "For each coin, either skip it (row above) or use one more (same row, amount minus the coin).",
        time: "O(coins · amount)",
        timeWhy: "One cell per (coin type, amount) pair, each O(1).",
        space: "O(coins · amount)",
        spaceWhy: "The full 2-D table.",
        code: `int change(int amount, int[] coins) {
    int n = coins.length;
    int[][] dp = new int[n + 1][amount + 1];
    for (int c = 0; c <= n; c++) dp[c][0] = 1;   // one way to make 0: take nothing
    for (int c = 1; c <= n; c++) {
        for (int a = 1; a <= amount; a++) {
            dp[c][a] = dp[c - 1][a];              // skip coin c entirely
            if (a >= coins[c - 1])
                dp[c][a] += dp[c][a - coins[c - 1]]; // use at least one coin c
        }
    }
    return dp[n][amount];
}`,
        walkthrough: [
          "amount=5, coins=[1,2,5]. After coin 1: every amount has exactly 1 way (all ones).",
          "After coin 2: dp[2][5] = dp[1][5] + dp[2][3] = 1 + 2 = 3.",
          "After coin 5: dp[3][5] = dp[2][5] + dp[3][0] = 3 + 1 = 4 → answer 4.",
        ],
      },
      {
        name: "Rolling 1-D array (optimal space)",
        intuition: "Process coins in the outer loop, amounts ascending in the inner loop, so the order is fixed and reuse is allowed.",
        time: "O(coins · amount)",
        timeWhy: "Same number of updates.",
        space: "O(amount)",
        spaceWhy: "A single dp array of length amount+1.",
        code: `int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins) {                 // coin loop OUTSIDE = combinations
        for (int a = coin; a <= amount; a++) // ascending = unlimited reuse
            dp[a] += dp[a - coin];
    }
    return dp[amount];
}`,
        walkthrough: [
          "dp=[1,0,0,0,0,0]. Coin 1 → [1,1,1,1,1,1]. Coin 2 → [1,1,2,2,3,3].",
          "Coin 5 → dp[5] += dp[0] → 3+1 = 4. Answer dp[5] = 4.",
          "If you swapped the loops (amounts outside, coins inside) you'd count permutations instead — that's the Climbing-Stairs / Combination-Sum-IV variant.",
        ],
      },
    ],
    edgeCases: [
      "amount = 0 → exactly 1 combination (the empty set) — the base case.",
      "Target unreachable (e.g. amount 3, coins [2]) → 0.",
      "Counts can grow large; the LeetCode constraints keep them inside `int`, but a related problem might need `long`.",
    ],
    twists: [
      "**Minimum number of coins** instead of the count → that's *Coin Change* (LeetCode 322): `dp[a] = min(dp[a], dp[a-coin] + 1)`.",
      "**Count permutations / sequences** (Combination Sum IV) → swap the loop nesting: amount outside, coins inside.",
      "**Each coin usable at most once** (0/1 knapsack) → sweep the amount **descending** so a coin isn't reused within one pass.",
    ],
    related: ["coin-change", "target-sum"],
  },

  {
    slug: "target-sum",
    title: "Target Sum",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 494,
    statement:
      "Given an integer array `nums` and an integer `target`, assign a `+` or `−` sign to every number, then concatenate to form an expression. Return the **number of ways** to assign signs so the expression evaluates to `target`.",
    examples: [
      { in: "nums = [1,1,1,1,1], target = 3", out: "5", note: "five sign assignments give 3" },
      { in: "nums = [1], target = 1", out: "1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 20", "0 ≤ nums[i] ≤ 1000", "0 ≤ sum(nums) ≤ 1000", "−1000 ≤ target ≤ 1000"],
    recognize:
      "'**Count the ways** to hit a target by choosing +/− on each item' is a **subset-sum count** in disguise — a 0/1-knapsack 2-D DP over (index, running sum). The classic algebra trick converts it to 'count subsets with a fixed sum'.",
    figureItOut: [
      "Brute force tries all `2^n` sign assignments — fine for n=20 but it begs for structure. Each number contributes either `+num` or `−num`; let `P` be the set you add and `N` the set you subtract.",
      "Do the algebra. `sum(P) − sum(N) = target`, and `sum(P) + sum(N) = total` (the whole array). Add the two equations: `2·sum(P) = target + total`, so `sum(P) = (target + total) / 2`. The problem becomes: **count the subsets whose sum equals that fixed value** — a clean subset-sum count.",
      "If `target + total` is **odd** or `target + total < 0` (i.e. the required subset sum isn't a non-negative integer), the answer is immediately **0** — no assignment can work.",
      "Name the **2-D state**: `dp[i][s]` = number of subsets of the first `i` numbers that sum to exactly `s`. For each number you either **leave it out** → `dp[i-1][s]`, or **put it in** → `dp[i-1][s - nums[i-1]]`. Sum them: `dp[i][s] = dp[i-1][s] + dp[i-1][s - nums[i-1]]`. **Base case**: `dp[0][0] = 1` (one way to make sum 0 from nothing).",
      "**Fill the table** over (index, sum up to the target subset sum). Both terms come from the **previous row**, so you can **roll a 1-D array** — but sweep the sum **descending** (0/1 knapsack: each number used at most once per row) → O(subsetSum) space.",
    ],
    approaches: [
      {
        name: "Reduce to subset-sum count, 2-D table",
        intuition: "Solve sum(P) = (target+total)/2, then count subsets reaching that sum: skip or include each number.",
        time: "O(n · S)",
        timeWhy: "n numbers times S+1 possible sums (S = the required subset sum), one cell each.",
        space: "O(n · S)",
        spaceWhy: "The 2-D table over (index, sum).",
        code: `int findTargetSumWays(int[] nums, int target) {
    int total = 0;
    for (int x : nums) total += x;
    // need sum(P) = (target + total) / 2, a non-negative integer
    if (target > total || target < -total || ((target + total) & 1) == 1) return 0;
    int S = (target + total) / 2;

    int n = nums.length;
    int[][] dp = new int[n + 1][S + 1];
    dp[0][0] = 1;                              // one way to make sum 0 from nothing
    for (int i = 1; i <= n; i++) {
        for (int s = 0; s <= S; s++) {
            dp[i][s] = dp[i - 1][s];           // leave nums[i-1] out
            if (s >= nums[i - 1])
                dp[i][s] += dp[i - 1][s - nums[i - 1]]; // put it in
        }
    }
    return dp[n][S];
}`,
        walkthrough: [
          "nums=[1,1,1,1,1], target=3, total=5 → S=(3+5)/2=4. Count subsets summing to 4.",
          "Choosing 4 of the five 1s to be positive (one stays negative) → C(5,4) = 5 subsets.",
          "dp[5][4] = 5 → answer 5.",
        ],
      },
      {
        name: "Rolling 1-D, descending sweep (optimal space)",
        intuition: "Same recurrence collapsed to one row; iterate sums high→low so each number is counted at most once.",
        time: "O(n · S)",
        timeWhy: "Same update count.",
        space: "O(S)",
        spaceWhy: "One array of length S+1.",
        code: `int findTargetSumWays(int[] nums, int target) {
    int total = 0;
    for (int x : nums) total += x;
    if (target > total || target < -total || ((target + total) & 1) == 1) return 0;
    int S = (target + total) / 2;

    int[] dp = new int[S + 1];
    dp[0] = 1;
    for (int num : nums) {
        for (int s = S; s >= num; s--)   // descending = each number used once
            dp[s] += dp[s - num];
    }
    return dp[S];
}`,
        walkthrough: [
          "S=4. dp=[1,0,0,0,0]. After first 1 (desc): dp[1]+=dp[0] → [1,1,0,0,0].",
          "Each successive 1 lifts the counts; after all five, dp[4] = 5.",
        ],
      },
    ],
    edgeCases: [
      "`target` larger in magnitude than `total` → impossible → 0.",
      "`(target + total)` odd → the subset sum isn't an integer → 0.",
      "Zeros in `nums` each have two sign choices that don't change the value — the count term naturally doubles for every zero, which is correct.",
    ],
    twists: [
      "**Just decide if a subset hits a sum** → swap counting for booleans (`||`) — that's *Partition Equal Subset Sum*.",
      "**Minimize the difference between the two groups** → minimize `|total − 2·sum(P)|` over achievable subset sums.",
      "**Items have a count/weight limit** → a bounded-knapsack variant.",
    ],
    related: ["partition-equal-subset-sum", "coin-change-ii"],
  },

  {
    slug: "interleaving-string",
    title: "Interleaving String",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 97,
    statement:
      "Given strings `s1`, `s2`, and `s3`, return `true` if `s3` is formed by **interleaving** `s1` and `s2` — that is, `s3` can be split into pieces that, taken in order, come alternately (in any pattern) from `s1` and `s2` while preserving each string's internal order.",
    examples: [
      { in: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', out: "true" },
      { in: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"', out: "false" },
      { in: 's1 = "", s2 = "", s3 = ""', out: "true" },
    ],
    constraints: ["0 ≤ s1.length, s2.length ≤ 100", "0 ≤ s3.length ≤ 200", "lowercase English letters"],
    recognize:
      "**Two source strings consumed in order to build a third** → a **2-D DP** over (how much of s1 used, how much of s2 used). Whenever progress is 'a prefix of A and a prefix of B', the state is the pair of prefix lengths.",
    figureItOut: [
      "First, a free check: if `s1.length + s2.length != s3.length`, it's impossible — bail immediately.",
      "Think greedily and watch it fail: at each character of `s3`, it might match the next char of `s1`, the next char of `s2`, or both. When **both** match you can't know which to consume — picking wrong dooms you. That ambiguity (and the overlap when you backtrack) is the cue for DP.",
      "Notice the key invariant: if you've used `i` characters of `s1` and `j` of `s2`, you've necessarily produced exactly `i + j` characters of `s3`. So the **position in s3 is determined by the pair (i, j)** — you only need two indices, not three.",
      "Name the **2-D state**: `dp[i][j]` = can `s3[0 .. i+j)` be formed by interleaving `s1[0..i)` and `s2[0..j)`? The recurrence looks one character back: `dp[i][j]` is true if **(`dp[i-1][j]` and `s1[i-1] == s3[i+j-1]`)** — the last char came from s1 — **or (`dp[i][j-1]` and `s2[j-1] == s3[i+j-1]`)** — it came from s2. **Base case**: `dp[0][0] = true`; the first row/column just check that one string alone is a prefix of s3.",
      "**Fill the table** over (i, j). `dp[i][j]` reads `dp[i-1][j]` (row above) and `dp[i][j-1]` (cell to the left), so a **rolling row** gives O(s2) space.",
    ],
    approaches: [
      {
        name: "Bottom-up table over prefix lengths",
        intuition: "dp[i][j] true if the current s3 char extends a valid interleaving from s1's side or s2's side.",
        time: "O(m·n)",
        timeWhy: "m=|s1|, n=|s2|; one boolean cell per pair, O(1) each.",
        space: "O(m·n)",
        spaceWhy: "The (m+1)×(n+1) boolean grid.",
        code: `boolean isInterleave(String s1, String s2, String s3) {
    int m = s1.length(), n = s2.length();
    if (m + n != s3.length()) return false;
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i > 0 && s1.charAt(i - 1) == s3.charAt(i + j - 1))
                dp[i][j] |= dp[i - 1][j];       // last char taken from s1
            if (j > 0 && s2.charAt(j - 1) == s3.charAt(i + j - 1))
                dp[i][j] |= dp[i][j - 1];       // last char taken from s2
        }
    }
    return dp[m][n];
}`,
        walkthrough: [
          's1="aabcc", s2="dbbca", s3="aadbbcbcac". dp[0][0]=true.',
          "First two chars 'aa' come from s1 → dp[2][0]=true. Then 'd' from s2 → dp[2][1]=true.",
          "Tracing valid extensions reaches dp[5][5]=true → s3 is a valid interleaving.",
        ],
      },
      {
        name: "Rolling row (optimal space)",
        intuition: "Each row depends only on the row above and the cell to its left, so one array of width n+1 suffices.",
        time: "O(m·n)",
        timeWhy: "Same cell count.",
        space: "O(n)",
        spaceWhy: "A single boolean row.",
        code: `boolean isInterleave(String s1, String s2, String s3) {
    int m = s1.length(), n = s2.length();
    if (m + n != s3.length()) return false;
    boolean[] dp = new boolean[n + 1];
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i == 0 && j == 0) { dp[j] = true; continue; }
            boolean fromS1 = i > 0 && s1.charAt(i - 1) == s3.charAt(i + j - 1) && dp[j];
            boolean fromS2 = j > 0 && s2.charAt(j - 1) == s3.charAt(i + j - 1) && dp[j - 1];
            dp[j] = fromS1 || fromS2;   // dp[j] is the old (row above) value here
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "dp before overwrite holds row i-1; dp[j] = 'above', dp[j-1] = 'left' (already updated this row).",
          "Mismatched lengths short-circuit to false before any work.",
        ],
      },
    ],
    edgeCases: [
      "Length mismatch (`m + n != |s3|`) → false, checked first.",
      "All three empty → true (vacuous interleaving).",
      "One source empty → the answer is just whether the other equals s3.",
    ],
    twists: [
      "**Reconstruct the interleaving pattern** → backtrack from `dp[m][n]` recording which side each character came from.",
      "**Three or more source strings** → the state grows a dimension per string (gets expensive fast).",
      "**Greedy looks tempting but is wrong** — the moment both sources offer the same next char, only DP (or memoized recursion) is safe.",
    ],
    related: ["longest-common-subsequence", "edit-distance"],
  },

  {
    slug: "longest-increasing-path-in-a-matrix",
    title: "Longest Increasing Path in a Matrix",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 329,
    statement:
      "Given an `m × n` integer `matrix`, return the length of the **longest strictly increasing path**. From a cell you may move to its four neighbours (up/down/left/right) only when the neighbour's value is **strictly greater**. You may start and end anywhere; diagonal moves and wrap-around are not allowed.",
    examples: [
      { in: "matrix = [[9,9,4],[6,6,8],[2,1,1]]", out: "4", note: "1 → 2 → 6 → 9" },
      { in: "matrix = [[3,4,5],[3,2,6],[2,2,1]]", out: "4", note: "3 → 4 → 5 → 6" },
      { in: "matrix = [[1]]", out: "1" },
    ],
    constraints: ["1 ≤ m, n ≤ 200", "0 ≤ matrix[i][j] ≤ 2³¹ − 1"],
    recognize:
      "A grid where each move must strictly increase means the cells form a **DAG** (edges only point uphill, so no cycles). 'Longest path in a DAG' = **DFS with memoization** — a 2-D DP where `dp[r][c]` caches the longest increasing path starting at that cell.",
    figureItOut: [
      "Plain DFS from every cell, always walking to a strictly larger neighbour, finds the answer but re-explores the same cells exponentially — and you might fear infinite loops. The strict-increase rule rescues you: because every step goes up in value, **you can never revisit a cell** within one path. The graph is a **DAG**, so no visited-set is even needed.",
      "Now spot the overlap: many paths funnel through the same cell, and the longest increasing path *starting* at a given cell is a fixed property of that cell — it doesn't depend on how you arrived. That's a memoizable subproblem.",
      "Name the **2-D state**: `dp[r][c]` = length of the longest strictly increasing path that **starts** at cell `(r, c)`. The recurrence: `dp[r][c] = 1 + max(dp[neighbour])` over the four neighbours whose value is strictly greater (and `1 + 0` if none qualify — the cell alone).",
      "There's no clean left-to-right fill order here (the dependencies follow the values, not the grid layout), so this is the case where **top-down memoized recursion is the natural form**: DFS each cell, cache its result the first time, return the cache on repeat visits.",
      "The overall answer is the **max of `dp[r][c]` over all cells** — try starting from everywhere. Each cell's DFS is computed once and reused, so the whole thing is linear in the number of cells.",
    ],
    approaches: [
      {
        name: "DFS + memoization (top-down DP)",
        intuition: "Cache the longest increasing path from each cell; recurse only into strictly-greater neighbours.",
        time: "O(m·n)",
        timeWhy: "Each cell's longest path is computed once and cached; each has at most 4 edges, so total work is O(4·m·n) = O(m·n).",
        space: "O(m·n)",
        spaceWhy: "The memo table, plus recursion stack up to the longest path length.",
        code: `int longestIncreasingPath(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int[][] memo = new int[m][n];   // 0 = not computed yet
    int best = 0;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            best = Math.max(best, dfs(matrix, r, c, memo));
    return best;
}

private static final int[][] DIRS = {{1,0},{-1,0},{0,1},{0,-1}};

private int dfs(int[][] matrix, int r, int c, int[][] memo) {
    if (memo[r][c] != 0) return memo[r][c];     // already solved
    int m = matrix.length, n = matrix[0].length;
    int longest = 1;                             // the cell by itself
    for (int[] d : DIRS) {
        int nr = r + d[0], nc = c + d[1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n
                && matrix[nr][nc] > matrix[r][c]) {   // strictly greater only
            longest = Math.max(longest, 1 + dfs(matrix, nr, nc, memo));
        }
    }
    memo[r][c] = longest;
    return longest;
}`,
        walkthrough: [
          "matrix=[[9,9,4],[6,6,8],[2,1,1]]. dfs from the '1' at (2,1): up to 6, then 9 → 1→6→9 length 3... but also 1→2→6→9.",
          "dfs('2' at (2,0)) → 2→6→9 = 3, cached. dfs('1') reuses it: 1→2→(cached 3) = 4.",
          "Max over all cells = 4 → answer 4.",
        ],
      },
    ],
    edgeCases: [
      "Single cell → 1.",
      "All equal values → no strict-increase move exists → every path length is 1.",
      "Because every edge strictly increases, the graph is acyclic — no visited-set or cycle handling is required (the common over-engineering trap here).",
    ],
    twists: [
      "**Non-strict (≥) moves allowed** → cycles become possible; you'd need cycle handling or a different model.",
      "**Count how many longest paths exist** → memoize a second value (count) alongside the length.",
      "**Topological-sort / peeling variant** → process cells from smallest value outward (Kahn's-style) instead of DFS — same DAG, bottom-up.",
    ],
    related: ["longest-increasing-subsequence", "course-schedule"],
  },

  {
    slug: "distinct-subsequences",
    title: "Distinct Subsequences",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 115,
    statement:
      "Given two strings `s` and `t`, return the **number of distinct subsequences of `s`** that equal `t`. A subsequence keeps relative order but may delete characters. The answer fits in a 32-bit signed integer.",
    examples: [
      { in: 's = "rabbbit", t = "rabbit"', out: "3", note: "three different ways to pick the b's" },
      { in: 's = "babgbag", t = "bag"', out: "5" },
    ],
    constraints: ["1 ≤ s.length, t.length ≤ 1000", "lowercase English letters"],
    recognize:
      "**Two strings, count the ways one is embedded in the other** → a **2-D DP** over (chars of s used, chars of t matched). 'Count subsequence matches' is a cousin of LCS and edit distance — the same prefix-vs-prefix grid.",
    figureItOut: [
      "Brute force enumerates every subsequence of `s` and checks if it equals `t` — exponential, with massive overlap. Frame it as a per-character decision instead.",
      "Walk through `s` and `t` from their ends. Look at `s[i-1]` and `t[j-1]`. Two cases. If the characters **differ**, the current char of `s` can't be the one matching `t[j-1]`, so you must skip it: `dp[i][j] = dp[i-1][j]`.",
      "If they **match**, you have a real choice: **use** `s[i-1]` to cover `t[j-1]` → `dp[i-1][j-1]` ways for the rest, **or skip** `s[i-1]` and match `t[j-1]` later in `s` → `dp[i-1][j]` ways. Since these are different selections, **add them**: `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]`.",
      "Name the **2-D state**: `dp[i][j]` = number of distinct subsequences of `s[0..i)` that equal `t[0..j)`. **Base cases**: `dp[i][0] = 1` for all i (the empty `t` is matched exactly one way — delete everything), and `dp[0][j] = 0` for j > 0 (a non-empty `t` can't come from an empty `s`).",
      "**Fill the table** row by row. Both recurrence terms come from the **previous row** (`dp[i-1][*]`), so you can **roll a 1-D array** — but sweep `j` **descending** so `dp[j-1]` still holds the previous row's value when you read it → O(|t|) space.",
    ],
    approaches: [
      {
        name: "Bottom-up table over (s-prefix, t-prefix)",
        intuition: "Match → (use this char) + (skip it); mismatch → must skip. Base column is all 1 (empty t).",
        time: "O(m·n)",
        timeWhy: "m=|s|, n=|t|; one cell per pair, O(1) each.",
        space: "O(m·n)",
        spaceWhy: "The (m+1)×(n+1) table.",
        code: `int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = 1;   // empty t: one subsequence (delete all)
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i - 1][j];                       // skip s[i-1]
            if (s.charAt(i - 1) == t.charAt(j - 1))
                dp[i][j] += dp[i - 1][j - 1];              // also use s[i-1] to match
        }
    }
    return dp[m][n];
}`,
        walkthrough: [
          's="rabbbit", t="rabbit". The three b\'s in s give three ways to pick the two b\'s of t.',
          "At each matching 'b', dp adds the diagonal (use it) to the up value (skip it), accumulating the count.",
          "dp[7][6] = 3 → answer 3.",
        ],
      },
      {
        name: "Rolling 1-D, descending sweep (optimal space)",
        intuition: "Collapse to one array; iterate t's index high→low so the diagonal term reads the prior row.",
        time: "O(m·n)",
        timeWhy: "Same update count.",
        space: "O(n)",
        spaceWhy: "One array of length n+1.",
        code: `int numDistinct(String s, String t) {
    int n = t.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;                               // empty t
    for (int i = 0; i < s.length(); i++) {
        char cs = s.charAt(i);
        for (int j = n; j >= 1; j--) {       // descending: dp[j-1] is still last row
            if (cs == t.charAt(j - 1)) dp[j] += dp[j - 1];
        }
    }
    return dp[n];
}`,
        walkthrough: [
          's="babgbag", t="bag". dp starts [1,0,0,0].',
          "Each 'b' lifts dp[1], each 'a' (after a b) lifts dp[2], each 'g' (after b,a) lifts dp[3].",
          "After the full sweep dp[3] = 5.",
        ],
      },
    ],
    edgeCases: [
      "Empty `t` → 1 (delete everything from `s`); the base column encodes this.",
      "`t` longer than `s` → 0 (can't embed a longer string).",
      "Descending `j` in the 1-D version is essential — ascending would let the same `s` character match a `t` character twice in one pass.",
    ],
    twists: [
      "**Allow inserts/deletes/replaces (turn s into t)** → that's *Edit Distance*, a min over three moves instead of a count.",
      "**Longest common subsequence** → max instead of count, with the mismatch branch taking the better of up/left.",
      "**Wildcard `t`** → extend the match test to cover the wildcard characters.",
    ],
    related: ["longest-common-subsequence", "edit-distance"],
  },

  {
    slug: "edit-distance",
    title: "Edit Distance",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 72,
    statement:
      "Given two strings `word1` and `word2`, return the **minimum number of operations** to convert `word1` into `word2`. The allowed operations are **insert a character**, **delete a character**, and **replace a character**.",
    examples: [
      { in: 'word1 = "horse", word2 = "ros"', out: "3", note: "replace h→r, delete r, delete e" },
      { in: 'word1 = "intention", word2 = "execution"', out: "5" },
    ],
    constraints: ["0 ≤ word1.length, word2.length ≤ 500", "lowercase English letters"],
    recognize:
      "**Transform one string into another with per-character edits** is the textbook **2-D DP** (Levenshtein distance). `dp[i][j]` = cost to turn the first `i` chars of word1 into the first `j` chars of word2; the three moves map to the three neighbouring cells.",
    figureItOut: [
      "Compare the **last characters** of the two prefixes. If `word1[i-1] == word2[j-1]`, that character is already aligned — it costs nothing, and the problem shrinks to the smaller prefixes: `dp[i][j] = dp[i-1][j-1]`.",
      "If they **differ**, you must spend one operation, and there are exactly three ways to spend it. **Replace** `word1[i-1]` with `word2[j-1]` → `1 + dp[i-1][j-1]` (both prefixes shrink). **Delete** `word1[i-1]` → `1 + dp[i-1][j]` (word1 shrinks, word2 unchanged). **Insert** `word2[j-1]` → `1 + dp[i][j-1]` (word2's char accounted for, word1 unchanged). Take the **minimum**.",
      "Name the **2-D state**: `dp[i][j]` = minimum edits to turn `word1[0..i)` into `word2[0..j)`. The recurrence relates it to all three neighbours — `dp[i-1][j-1]` (replace/match), `dp[i-1][j]` (delete), `dp[i][j-1]` (insert).",
      "**Base cases** are the empty-prefix rows: `dp[0][j] = j` (turn empty into `word2`'s first j chars = j inserts) and `dp[i][0] = i` (turn i chars into empty = i deletes). These seed the first row and column.",
      "**Fill the table** row by row to `dp[m][n]`. Each cell reads the diagonal, up, and left neighbours — all in the current or previous row — so a **rolling row** (remembering the diagonal before overwriting) gives O(n) space.",
    ],
    approaches: [
      {
        name: "Bottom-up table",
        intuition: "Match → carry the diagonal; mismatch → 1 + min(replace, delete, insert).",
        time: "O(m·n)",
        timeWhy: "Each of the (m+1)×(n+1) cells is O(1).",
        space: "O(m·n)",
        spaceWhy: "The full dp grid.",
        code: `int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;   // delete all of word1's prefix
    for (int j = 0; j <= n; j++) dp[0][j] = j;   // insert all of word2's prefix
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];                 // chars match: free
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],    // replace
                            Math.min(dp[i - 1][j],           // delete
                                     dp[i][j - 1]));         // insert
            }
        }
    }
    return dp[m][n];
}`,
        walkthrough: [
          'word1="horse", word2="ros". First row 0..3, first column 0..5.',
          "h vs r mismatch → replace; the 'os' tail aligns cheaply.",
          "dp[5][3] resolves to 3 → replace h→r, delete r, delete e.",
        ],
      },
      {
        name: "Rolling row (optimal space)",
        intuition: "Keep the previous row; stash the diagonal value in a temp before each overwrite.",
        time: "O(m·n)",
        timeWhy: "Same cell count.",
        space: "O(n)",
        spaceWhy: "One row of width n+1 plus a couple of scalars.",
        code: `int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[] dp = new int[n + 1];
    for (int j = 0; j <= n; j++) dp[j] = j;       // base: empty word1
    for (int i = 1; i <= m; i++) {
        int prevDiag = dp[0];                     // dp[i-1][0]
        dp[0] = i;                                // base: empty word2
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];                     // dp[i-1][j], future diagonal
            if (word1.charAt(i - 1) == word2.charAt(j - 1))
                dp[j] = prevDiag;
            else
                dp[j] = 1 + Math.min(prevDiag, Math.min(dp[j], dp[j - 1]));
            prevDiag = temp;
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "dp holds row i-1; `temp` saves the about-to-be-overwritten cell as the next diagonal.",
          'word1="intention" → word2="execution" resolves to 5 operations.',
        ],
      },
    ],
    edgeCases: [
      "Either string empty → the answer is the other's length (all inserts or all deletes), handled by the base row/column.",
      "Identical strings → 0 edits (the diagonal carries straight through).",
      "Rolling-row version: you must save the diagonal (`prevDiag`) before overwriting `dp[j]`, or you'll read the wrong value.",
    ],
    twists: [
      "**Only insert and delete allowed (no replace)** → the answer is `m + n − 2·LCS(word1, word2)`.",
      "**Different operation costs** → replace `1 +` with the specific cost of each move.",
      "**One-edit-away check** (LeetCode 72-lite / 'is edit distance ≤ 1') → a direct O(n) scan instead of the full table.",
    ],
    related: ["longest-common-subsequence", "distinct-subsequences"],
  },

  {
    slug: "burst-balloons",
    title: "Burst Balloons",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 312,
    statement:
      "You have `n` balloons with values in `nums`. Bursting balloon `i` earns `nums[left] * nums[i] * nums[right]` coins, where `left` and `right` are the **currently adjacent** balloons (treat out-of-range neighbours as value 1). After a burst its neighbours become adjacent. Return the **maximum coins** you can collect by bursting all balloons.",
    examples: [
      { in: "nums = [3,1,5,8]", out: "167", note: "burst order 1,5,3,8 → 3·1·5 + 3·5·8 + 1·3·8 + 1·8·1 = 167" },
      { in: "nums = [1,5]", out: "10", note: "1·5·1 + 1·1·1 = 10" },
    ],
    constraints: ["1 ≤ n ≤ 300", "0 ≤ nums[i] ≤ 100"],
    recognize:
      "The coins from bursting a balloon depend on its **current** neighbours, which change as you go — a classic **interval DP** (a 2-D DP over a range `[i..j]`). The trick is to pick the balloon burst **last** in each interval, which fixes the boundaries.",
    figureItOut: [
      "The naive 'which balloon to burst **first**?' fails: after the first burst, every remaining balloon's neighbours shift, so the subproblems aren't independent — they overlap messily. That moving-neighbour coupling is what makes it hard.",
      "Flip the question. Instead of asking which balloon to burst **first** in a range, ask which one to burst **last**. If balloon `k` is the last to pop in the open interval `(i, j)`, then at the moment it bursts, its neighbours are exactly the fixed boundaries `i` and `j` (everything between them is already gone). Its reward is a clean `nums[i] * nums[k] * nums[j]`.",
      "And because `k` is last, the balloons in `(i, k)` and `(k, j)` were all burst **before** it, completely independently of each other. The boundaries `i` and `j` never disappear during those sub-bursts. That independence is what unlocks the DP.",
      "**Pad** the array with a 1 at each end so every real balloon has a boundary. Name the **2-D state**: `dp[i][j]` = max coins from bursting all balloons strictly between padded indices `i` and `j`. The recurrence picks the last balloon `k` in `(i, j)`: `dp[i][j] = max over k in (i, j) of dp[i][k] + nums[i]*nums[k]*nums[j] + dp[k][j]`. **Base case**: `dp[i][j] = 0` when there's nothing between (`j ≤ i + 1`).",
      "**Fill the table by interval length** — short ranges first so `dp[i][k]` and `dp[k][j]` are ready before `dp[i][j]`. This is a triangular fill (only `i < j`), giving O(n³) total. There's no row-rolling here — the recurrence reaches across the whole interval, so you keep the full 2-D table.",
    ],
    approaches: [
      {
        name: "Interval DP — choose the balloon burst last",
        intuition: "For each interval, try every balloon as the last to pop; its neighbours are then the fixed interval ends.",
        time: "O(n³)",
        timeWhy: "O(n²) intervals, each trying up to n split points k.",
        space: "O(n²)",
        spaceWhy: "The (n+2)×(n+2) dp table over padded indices.",
        code: `int maxCoins(int[] nums) {
    int n = nums.length;
    int[] vals = new int[n + 2];
    vals[0] = 1; vals[n + 1] = 1;                 // virtual boundary balloons
    for (int i = 0; i < n; i++) vals[i + 1] = nums[i];

    int[][] dp = new int[n + 2][n + 2];           // dp[i][j]: open interval (i, j)
    for (int len = 2; len <= n + 1; len++) {      // distance between i and j
        for (int i = 0; i + len <= n + 1; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++) {     // k = balloon burst LAST in (i, j)
                int coins = vals[i] * vals[k] * vals[j] + dp[i][k] + dp[k][j];
                dp[i][j] = Math.max(dp[i][j], coins);
            }
        }
    }
    return dp[0][n + 1];
}`,
        walkthrough: [
          "nums=[3,1,5,8] → vals=[1,3,1,5,8,1]. Length-2 intervals (single balloon) fill first.",
          "Larger intervals combine them; e.g. choosing k as the last balloon multiplies the two padded ends.",
          "dp[0][5] resolves to 167 → answer 167.",
        ],
      },
    ],
    edgeCases: [
      "Single balloon → `1 * nums[0] * 1`.",
      "Balloons of value 0 contribute 0 when they're the multiplied middle, but still must be burst — the DP handles them naturally.",
      "Thinking 'first to burst' instead of 'last to burst' is the trap that makes the subproblems non-independent — always fix the last.",
    ],
    twists: [
      "**Remove boxes** (LeetCode 546) → a harder interval DP needing a third dimension (a run of equal colors).",
      "**Minimum cost to merge stones / matrix-chain multiplication** → same interval-DP skeleton, different combine cost.",
      "**Print the burst order** → store the chosen `k` per interval and reconstruct.",
    ],
    related: ["unique-paths", "longest-common-subsequence"],
  },

  {
    slug: "regular-expression-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 10,
    statement:
      "Given an input string `s` and a pattern `p`, return `true` if `p` matches the **entire** `s`. The pattern supports `.` (matches any single character) and `*` (matches **zero or more** of the **preceding** element).",
    examples: [
      { in: 's = "aa", p = "a"', out: "false", note: "p must match all of s" },
      { in: 's = "aa", p = "a*"', out: "true", note: "a* = zero or more a's" },
      { in: 's = "ab", p = ".*"', out: "true", note: ".* = any sequence" },
    ],
    constraints: ["1 ≤ s.length ≤ 20", "1 ≤ p.length ≤ 30", "p contains only lowercase letters, '.' and '*'", "each '*' has a valid preceding element"],
    recognize:
      "**Match a string against a pattern, prefix by prefix** → a **2-D DP** over (chars of `s` consumed, chars of `p` consumed). The `*` quantifier creates a branch (use it zero times vs one more time), which the grid's neighbouring cells capture.",
    figureItOut: [
      "The hard part is `*`: it doesn't match itself, it modifies the character **before** it, and it can stand for **any** count (0, 1, 2, …). A greedy left-to-right match can't know how many repetitions to commit to — that ambiguity and backtracking is the DP signal.",
      "Name the **2-D state**: `dp[i][j]` = does `p[0..j)` match `s[0..i)`? Work from prefixes. Look at `p[j-1]`, the last pattern char.",
      "If `p[j-1]` is a normal char or `.`: it must consume one char of `s`. So `dp[i][j] = dp[i-1][j-1]` **and** the chars match (`p[j-1] == s[i-1]` or `p[j-1] == '.'`). Simple one-step diagonal.",
      "If `p[j-1]` is `*`: it pairs with `p[j-2]`. Two branches. **Zero occurrences** — drop the `x*` pair entirely: `dp[i][j] = dp[i][j-2]`. **One or more** — only if `p[j-2]` matches `s[i-1]` (or is `.`): consume that char of `s` and keep the `*` available: `dp[i][j] |= dp[i-1][j]`. OR these together. This is the recurrence's heart, reaching to `dp[i][j-2]` (skip) and `dp[i-1][j]` (repeat).",
      "**Base cases**: `dp[0][0] = true` (empty matches empty). The first row `dp[0][j]` handles patterns like `a*b*c*` that can match an empty string — set `dp[0][j] = dp[0][j-2]` when `p[j-1] == '*'`. **Fill the table** row by row to `dp[m][n]`.",
    ],
    approaches: [
      {
        name: "Bottom-up table over (s-prefix, p-prefix)",
        intuition: "Normal char → diagonal + chars match; '*' → drop the pair (j-2) OR repeat (consume one s char, keep the *).",
        time: "O(m·n)",
        timeWhy: "m=|s|, n=|p|; one boolean cell per pair, O(1) work each.",
        space: "O(m·n)",
        spaceWhy: "The (m+1)×(n+1) boolean grid.",
        code: `boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;                              // empty matches empty
    // patterns like a*, a*b* can match the empty string
    for (int j = 1; j <= n; j++)
        if (p.charAt(j - 1) == '*')
            dp[0][j] = dp[0][j - 2];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            char pc = p.charAt(j - 1);
            if (pc == '*') {
                dp[i][j] = dp[i][j - 2];          // zero copies of the preceding element
                char prev = p.charAt(j - 2);
                if (prev == '.' || prev == s.charAt(i - 1))
                    dp[i][j] |= dp[i - 1][j];      // one more copy: consume s[i-1]
            } else if (pc == '.' || pc == s.charAt(i - 1)) {
                dp[i][j] = dp[i - 1][j - 1];        // single char matches
            }
        }
    }
    return dp[m][n];
}`,
        walkthrough: [
          's="aa", p="a*". dp[0][0]=true; dp[0][2]=dp[0][0]=true (a* matches empty).',
          "dp[1][2]: '*' → zero copies dp[1][0]=false, OR repeat (prev 'a' matches 'a') dp[0][2]=true → true.",
          "dp[2][2]: zero copies dp[2][0]=false, OR repeat dp[1][2]=true → true. Answer dp[2][2]=true.",
        ],
      },
    ],
    edgeCases: [
      "Pattern that matches empty (`a*`, `.*`, `a*b*c*`) — the first-row seeding is what lets `dp[0][j]` become true.",
      "`*` always refers to the char two positions back (`p[j-2]`); the constraints guarantee every `*` has a valid preceding element.",
      "Must match the **entire** string — the answer is `dp[m][n]`, not 'a match exists somewhere'.",
    ],
    twists: [
      "**Wildcard matching** (LeetCode 44) where `*` means 'any sequence' and `?` means 'any single char' → simpler recurrence (`*` → `dp[i-1][j] || dp[i][j-1]`).",
      "**Add `+` (one or more)** → `x+` is `x` followed by `x*`; rewrite or add a branch.",
      "**Memoized recursion** → the same recurrence written top-down with a 2-D cache, often easier to reason about than the table seeding.",
    ],
    related: ["edit-distance", "interleaving-string"],
  },

  // ───────────────────────────── GRAPH STRAGGLERS ─────────────────────────────
  {
    slug: "word-ladder",
    title: "Word Ladder",
    difficulty: "Hard",
    pattern: "graphs",
    leetcode: 127,
    statement:
      "Given `beginWord`, `endWord`, and a `wordList`, return the length of the **shortest transformation sequence** from `beginWord` to `endWord`, where each step changes **exactly one letter** and every intermediate word must be in `wordList`. The length counts the words in the sequence (including both ends). Return 0 if no such sequence exists.",
    examples: [
      { in: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', out: "5", note: '"hit"→"hot"→"dot"→"dog"→"cog"' },
      { in: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', out: "0", note: '"cog" not in list → no path' },
    ],
    constraints: ["1 ≤ beginWord.length ≤ 10", "1 ≤ wordList.length ≤ 5000", "all words same length, lowercase letters", "endWord may or may not be in the list"],
    recognize:
      "Words are **nodes**; an edge joins two words differing by exactly one letter. 'Shortest number of steps in an **unweighted** graph' is the textbook signal for **BFS** — it reaches every node in increasing distance order, so the first time you pop `endWord` you've found the shortest ladder.",
    figureItOut: [
      "Reframe it as a graph. Each word is a node; two words are connected when they differ in exactly one position. The shortest transformation sequence is the **shortest path** from `beginWord` to `endWord` in that graph. Unweighted shortest path → **BFS**.",
      "The naive edge test — compare every pair of words — is O(N² · L) and wasteful. Instead, generate neighbours **on demand**: for the current word, try replacing each of its `L` positions with every letter `a..z`, and keep the candidates that exist in the word set. That's O(L · 26) per word, independent of N.",
      "Put `wordList` in a **hash set** for O(1) membership tests. BFS level by level from `beginWord`: the level number *is* the sequence length. Mark words as visited (remove them from the set, or use a seen set) the instant you enqueue them, so you never revisit and never loop.",
      "Each BFS 'level' corresponds to one more word in the ladder. Start the count at 1 (the begin word itself). When you dequeue `endWord`, return the current level. If the queue drains without reaching it, return 0.",
      "Edge guard: if `endWord` isn't in `wordList` at all, there's no valid final step — you can return 0 up front.",
    ],
    approaches: [
      {
        name: "BFS over one-letter-change neighbours (optimal)",
        intuition: "Treat words as graph nodes; BFS level = ladder length; generate neighbours by swapping each position to a..z.",
        time: "O(N · L²)",
        timeWhy: "N words; for each we try L positions × 26 letters and build an L-length string each time → O(N · L · 26 · L) = O(N · L²).",
        space: "O(N · L)",
        spaceWhy: "The word set and BFS queue hold up to N words of length L.",
        code: `int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<>(wordList);
    if (!words.contains(endWord)) return 0;     // no valid final step

    Queue<String> q = new ArrayDeque<>();
    q.offer(beginWord);
    int level = 1;                              // sequence length so far

    while (!q.isEmpty()) {
        int size = q.size();                    // process one whole level
        for (int s = 0; s < size; s++) {
            String word = q.poll();
            if (word.equals(endWord)) return level;
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char original = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    chars[i] = c;
                    String next = new String(chars);
                    if (words.remove(next)) {   // exists & not yet visited
                        q.offer(next);
                    }
                }
                chars[i] = original;            // restore for the next position
            }
        }
        level++;                                // moved one word deeper
    }
    return 0;
}`,
        walkthrough: [
          'begin="hit", end="cog". Level1: hit. Neighbours in set: hot → enqueue. Level2: hot.',
          "hot → dot, lot (hit already gone). Level3: dot,lot → dog,log. Level4: dog,log → cog.",
          "Level5: dequeue cog == endWord → return 5.",
        ],
      },
    ],
    edgeCases: [
      "`endWord` not in `wordList` → 0 (checked before BFS).",
      "`beginWord` equals `endWord` is typically excluded by constraints; if allowed, the first dequeue returns level 1.",
      "Removing a word from the set when enqueuing is what prevents revisits and infinite loops — forgetting it is the classic bug.",
    ],
    twists: [
      "**Return an actual shortest sequence / all shortest sequences** (Word Ladder II, LeetCode 126) → BFS to build a predecessor graph, then DFS to reconstruct paths.",
      "**Bidirectional BFS** → search from both ends and meet in the middle; roughly halves the explored frontier on large inputs.",
      "**Precompute wildcard buckets** (e.g. `h*t`) → group words sharing a pattern so neighbour lookup is O(L) instead of O(L · 26).",
    ],
    related: ["course-schedule", "clone-graph"],
  },

  {
    slug: "reconstruct-itinerary",
    title: "Reconstruct Itinerary",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 332,
    statement:
      "Given a list of airline `tickets` as `[from, to]` pairs, reconstruct the itinerary that uses **all** tickets exactly once, starting from `\"JFK\"`. If several valid itineraries exist, return the one that is **smallest in lexical order** when read as a single list of airports. A valid itinerary using every ticket is guaranteed to exist.",
    examples: [
      { in: 'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]', out: '["JFK","MUC","LHR","SFO","SJC"]' },
      { in: 'tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]', out: '["JFK","ATL","JFK","SFO","ATL","SFO"]', note: "lexical tie-break sends you to ATL first" },
    ],
    constraints: ["1 ≤ tickets.length ≤ 300", "airport codes are 3 uppercase letters", "a valid itinerary that uses every ticket exists"],
    recognize:
      "Airports are **nodes**, tickets are **directed edges**, and you must use **every edge exactly once** — that's an **Eulerian path**. Hierholzer's algorithm builds it; visiting destinations in sorted order yields the lexically smallest valid path.",
    figureItOut: [
      "First name what kind of walk this is. You must traverse every **ticket (edge) exactly once** — that's the definition of an **Eulerian path**, not a node-visiting problem. (Nodes can be revisited; edges can't.) The guarantee that one exists means you don't have to check Eulerian conditions.",
      "Naive backtracking — try tickets in sorted order, undo on dead ends — works but can blow up exponentially when a wrong early choice strands tickets. The right tool is **Hierholzer's algorithm**, which builds an Eulerian path in linear time.",
      "For the lexical tie-break: from each airport, always take the **smallest available destination first**. Store each airport's destinations in a **sorted, consumable structure** (a min-heap, or a sorted list with a pointer) so you always grab the alphabetically smallest unused ticket.",
      "Hierholzer's insight (the counter-intuitive part): do a DFS that greedily consumes the smallest edge out of the current node; when a node has **no edges left**, it's a dead end, so **prepend it to the answer** (push onto a stack). Adding nodes only once they're exhausted, then reversing, naturally splices any side-loops into the right place — and a stranded edge can never be 'left behind'.",
      "Concretely: DFS from `JFK`; recurse into the smallest destination, removing that ticket as you go; after the recursion for a node finishes (all its outgoing tickets used), push the node. Finally **reverse** the stack to get the itinerary in travel order.",
    ],
    approaches: [
      {
        name: "Hierholzer's algorithm (Eulerian path)",
        intuition: "Greedily DFS into the smallest unused destination; record a node only after its tickets are exhausted, then reverse.",
        time: "O(E log E)",
        timeWhy: "E = number of tickets. Each edge is used once; the log factor is sorting/heap-ordering destinations so ties break lexically.",
        space: "O(E)",
        spaceWhy: "The adjacency lists hold all E edges; the recursion stack and result are O(E).",
        code: `List<String> findItinerary(List<List<String>> tickets) {
    // adjacency: airport -> min-heap of destinations (smallest first)
    Map<String, PriorityQueue<String>> adj = new HashMap<>();
    for (List<String> t : tickets) {
        adj.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).offer(t.get(1));
    }

    LinkedList<String> route = new LinkedList<>();
    dfs("JFK", adj, route);
    return route;
}

private void dfs(String airport, Map<String, PriorityQueue<String>> adj, LinkedList<String> route) {
    PriorityQueue<String> dests = adj.get(airport);
    while (dests != null && !dests.isEmpty()) {
        String next = dests.poll();      // smallest unused destination, consumed
        dfs(next, adj, route);
    }
    route.addFirst(airport);             // node exhausted -> prepend (Hierholzer)
}`,
        walkthrough: [
          'tickets give JFK→{ATL,SFO}, ATL→{JFK,SFO}, SFO→{ATL}. Start DFS at JFK.',
          "JFK takes ATL (smaller); ATL takes JFK; JFK takes SFO; SFO takes ATL; ATL takes SFO; SFO exhausted → prepend SFO.",
          "Unwinding prepends ATL,SFO,JFK,ATL,JFK → final route JFK,ATL,JFK,SFO,ATL,SFO.",
        ],
      },
    ],
    edgeCases: [
      "Multiple tickets between the same pair of airports → the min-heap holds duplicates and consumes them one at a time.",
      "A single ticket → itinerary is just `[JFK, destination]`.",
      "Prepending (not appending) and the final reversal are essential — appending in visit order would misplace any cycle that branches off the main path.",
    ],
    twists: [
      "**Eulerian circuit (return to start)** → same Hierholzer; the start and end coincide when every node has equal in/out degree.",
      "**No lexical requirement** → drop the heap; a plain list/stack per node suffices, still O(E).",
      "**Detect when no full itinerary exists** → check Eulerian-path degree conditions first (here it's guaranteed, so skipped).",
    ],
    related: ["course-schedule", "clone-graph"],
  },
];
