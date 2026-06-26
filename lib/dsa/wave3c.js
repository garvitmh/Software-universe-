// NeetCode 150 — wave 3c (1-D dynamic programming). Java.
export const WAVE3C = [
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    pattern: "dp-1d",
    leetcode: 70,
    statement:
      "You're climbing a staircase of `n` steps. Each move you can climb **1 or 2** steps. In how many **distinct ways** can you reach the top?",
    examples: [
      { in: "n = 2", out: "2", note: "1+1, or 2" },
      { in: "n = 3", out: "3", note: "1+1+1, 1+2, 2+1" },
    ],
    constraints: ["1 ≤ n ≤ 45"],
    recognize:
      "'**Count the ways** to reach step n' where each step offers a **choice** (take 1 or take 2). Counting paths built from smaller, overlapping subproblems is the signature of 1-D DP. (It's Fibonacci in disguise.)",
    figureItOut: [
      "Start from the end and ask: *how could my very last move have happened?* To land on step `n`, your previous position was either step `n−1` (then a +1 move) or step `n−2` (then a +2 move). There's no other way to arrive.",
      "So the number of ways to reach `n` is **(ways to reach n−1) + (ways to reach n−2)** — every path to n−1 extends by one +1 step, every path to n−2 extends by one +2 step, and these two sets never overlap. That's the **recurrence**.",
      "Name the **state**: let `dp[i]` = number of distinct ways to reach step `i`. The recurrence is `dp[i] = dp[i-1] + dp[i-2]`. **Base cases**: `dp[0] = 1` (one way to stand at the bottom — do nothing) and `dp[1] = 1` (a single +1 move).",
      "Write the brute-force recursion of that recurrence and you'll see `climb(n-2)` gets recomputed by both `climb(n)` and `climb(n-1)` — the same subproblem solved over and over, exponentially. **Memoize** it (top-down) or **fill a table** bottom-up so each `dp[i]` is computed once.",
      "Optimize the space: `dp[i]` only ever reads the last **two** values. Throw away the array and keep two rolling variables → **O(1) space**.",
    ],
    approaches: [
      {
        name: "Bottom-up table",
        intuition: "Fill dp[0..n] left to right, each cell the sum of the previous two.",
        time: "O(n)",
        timeWhy: "One pass filling n cells, each in O(1).",
        space: "O(n)",
        spaceWhy: "The dp array of size n+1.",
        code: `int climbStairs(int n) {
    if (n <= 2) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
        walkthrough: [
          "n=5: dp[1]=1, dp[2]=2.",
          "dp[3]=2+1=3, dp[4]=3+2=5, dp[5]=5+3=8 → return 8.",
        ],
      },
      {
        name: "Two rolling variables (optimal space)",
        intuition: "Only the last two answers matter, so keep just those two scalars.",
        time: "O(n)",
        timeWhy: "Single pass.",
        space: "O(1)",
        spaceWhy: "Two integers, no array.",
        code: `int climbStairs(int n) {
    int prev = 1, cur = 1;   // ways to reach step 0 and step 1
    for (int i = 2; i <= n; i++) {
        int next = prev + cur;
        prev = cur;
        cur = next;
    }
    return cur;
}`,
        walkthrough: [
          "n=3: start prev=1, cur=1.",
          "i=2: next=2 → prev=1, cur=2. i=3: next=3 → prev=2, cur=3 → return 3.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → 1 way; n = 2 → 2 ways (the base cases).",
      "n up to 45 — the count stays well within `int` range, so no overflow.",
    ],
    twists: [
      "**Steps of 1, 2, or 3** → `dp[i] = dp[i-1] + dp[i-2] + dp[i-3]` (tribonacci).",
      "**Cost on each step, minimize total** → that's *Min Cost Climbing Stairs* (you optimize instead of count).",
      "**Steps from a custom set S** → `dp[i] = sum of dp[i-s]` for each allowed `s` in S (coin-change-style).",
    ],
    related: ["min-cost-climbing-stairs", "house-robber", "coin-change"],
  },

  {
    slug: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    difficulty: "Easy",
    pattern: "dp-1d",
    leetcode: 746,
    statement:
      "Each `cost[i]` is the price of stepping on stair `i`. You may start at index 0 or index 1, and from a stair you climb **1 or 2** steps. Return the **minimum total cost** to reach the top (just past the last stair).",
    examples: [
      { in: "cost = [10,15,20]", out: "15", note: "start at index 1, pay 15, step 2 to the top" },
      { in: "cost = [1,100,1,1,1,100,1,1,100,1]", out: "6", note: "hop over the 100s" },
    ],
    constraints: ["2 ≤ cost.length ≤ 1000", "0 ≤ cost[i] ≤ 999"],
    recognize:
      "'**Minimum cost** to reach the end' with a **choice** at each stair (climb 1 or 2). 'Min/max to reach position i' built from earlier positions is the 1-D DP optimization shape — Climbing Stairs but you minimize instead of count.",
    figureItOut: [
      "The 'top' is the imaginary position `n` (one past the last stair). Ask the same end-first question: *to be standing at position `i`, where did I just come from?* From `i−1` (a +1 climb) or from `i−2` (a +2 climb).",
      "Whichever you came from, you had to **pay that stair's cost** to have stood on it. So the cheapest way to reach `i` is the cheaper of the two arrivals: `min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`. That's the **recurrence**.",
      "Name the **state**: `dp[i]` = minimum cost to *reach* position `i` (the cost of stepping onto i itself is paid later, when you leave it). **Base cases**: `dp[0] = 0` and `dp[1] = 0`, because you may start at either index 0 or 1 for free.",
      "Fill the table from `i = 2` up to `i = n` and the answer is `dp[n]`. Because each `dp[i]` reads only the previous two, **roll two variables** for O(1) space instead of an array.",
    ],
    approaches: [
      {
        name: "Bottom-up table",
        intuition: "dp[i] is the cheaper of arriving from i-1 or i-2, each paying that stair's cost.",
        time: "O(n)",
        timeWhy: "One pass over n+1 positions.",
        space: "O(n)",
        spaceWhy: "The dp array.",
        code: `int minCostClimbingStairs(int[] cost) {
    int n = cost.length;
    int[] dp = new int[n + 1];   // dp[i] = min cost to reach position i
    dp[0] = 0;
    dp[1] = 0;
    for (int i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
    }
    return dp[n];
}`,
        walkthrough: [
          "cost=[10,15,20]: dp[0]=0, dp[1]=0.",
          "dp[2]=min(0+15, 0+10)=10. dp[3]=min(dp[2]+20, dp[1]+15)=min(30,15)=15 → return 15.",
        ],
      },
      {
        name: "Two rolling variables (optimal space)",
        intuition: "Keep only the last two dp values.",
        time: "O(n)",
        timeWhy: "Single pass.",
        space: "O(1)",
        spaceWhy: "Two scalars.",
        code: `int minCostClimbingStairs(int[] cost) {
    int prev = 0, cur = 0;   // dp[i-2], dp[i-1]
    for (int i = 2; i <= cost.length; i++) {
        int next = Math.min(cur + cost[i - 1], prev + cost[i - 2]);
        prev = cur;
        cur = next;
    }
    return cur;
}`,
        walkthrough: [
          "cost=[10,15,20]: prev=0, cur=0.",
          "i=2: next=min(0+15,0+10)=10 → prev=0, cur=10. i=3: next=min(10+20,0+15)=15 → return 15.",
        ],
      },
    ],
    edgeCases: [
      "Two stairs → answer is `min(cost[0], cost[1])` — start on the cheaper one and step straight to the top.",
      "All-equal costs → you still want the path with the fewest paid stairs, so the +2 hops win.",
      "Off-by-one trap: the top is index `n`, not `n−1` — stepping past the last stair costs nothing extra.",
    ],
    twists: [
      "**Return the actual path taken** → store which predecessor won at each i and backtrack from n.",
      "**Climb 1, 2, or 3 steps** → take the min over three predecessors.",
      "**You must land on the last stair (no free top)** → answer becomes `dp[n-1] + cost[n-1]` style; redefine the goal.",
    ],
    related: ["climbing-stairs", "house-robber", "coin-change"],
  },

  {
    slug: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 198,
    statement:
      "Houses in a row hold `nums[i]` money. You can't rob **two adjacent houses** (the alarm trips). Return the **maximum** you can rob.",
    examples: [
      { in: "nums = [1,2,3,1]", out: "4", note: "rob house 0 and 2 → 1+3" },
      { in: "nums = [2,7,9,3,1]", out: "12", note: "rob 0, 2, 4 → 2+9+1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 400"],
    recognize:
      "'**Maximum** total with an **adjacency restriction**' — at each house a binary choice (rob it or skip it) whose best outcome depends on earlier choices. That choice-per-index structure is classic 1-D DP.",
    figureItOut: [
      "Stand at the **last** house `i` and ask the decisive question: *do I rob it or not?* Those two options are the whole problem.",
      "If you **rob** house `i`, you collect `nums[i]` but you couldn't have robbed `i−1`, so the rest of your money is the best you could do up to `i−2`: that's `nums[i] + dp[i-2]`. If you **skip** house `i`, your total is whatever was best up to `i−1`: `dp[i-1]`. Take the bigger.",
      "Name the **state**: `dp[i]` = the most money robbable from houses `0..i`. The **recurrence** is `dp[i] = max(dp[i-1], nums[i] + dp[i-2])`. **Base cases**: `dp[0] = nums[0]` and `dp[1] = max(nums[0], nums[1])`.",
      "The naive recursion recomputes the same `rob(i-2)` from two places → exponential. Fill `dp` bottom-up so each index is solved once.",
      "Optimize: `dp[i]` only needs the previous two answers — keep two rolling scalars (`rob1` = dp[i-2], `rob2` = dp[i-1]) for **O(1) space**.",
    ],
    approaches: [
      {
        name: "Bottom-up table",
        intuition: "dp[i] = best of skipping house i, or robbing it plus dp[i-2].",
        time: "O(n)",
        timeWhy: "One pass over n houses.",
        space: "O(n)",
        spaceWhy: "The dp array.",
        code: `int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
    }
    return dp[n - 1];
}`,
        walkthrough: [
          "nums=[2,7,9,3,1]: dp[0]=2, dp[1]=max(2,7)=7.",
          "dp[2]=max(7, 9+2)=11. dp[3]=max(11, 3+7)=11. dp[4]=max(11, 1+11)=12 → return 12.",
        ],
      },
      {
        name: "Two rolling variables (optimal space)",
        intuition: "Track the best two houses back; no array needed.",
        time: "O(n)",
        timeWhy: "Single pass.",
        space: "O(1)",
        spaceWhy: "Two scalars.",
        code: `int rob(int[] nums) {
    int rob1 = 0, rob2 = 0;   // best up to i-2, best up to i-1
    for (int n : nums) {
        int take = rob1 + n;              // rob this house
        int newRob2 = Math.max(rob2, take); // best including this house's decision
        rob1 = rob2;
        rob2 = newRob2;
    }
    return rob2;
}`,
        walkthrough: [
          "nums=[2,7,9,3,1]: (rob1,rob2) starts (0,0).",
          "2→(0,2); 7→(2,7); 9→ max(7,2+9)=11 →(7,11); 3→ max(11,7+3)=11 →(11,11); 1→ max(11,11+1)=12 → return 12.",
        ],
      },
    ],
    edgeCases: [
      "Single house → rob it (return nums[0]).",
      "Two houses → rob the richer one.",
      "All zeros → 0.",
    ],
    twists: [
      "**Houses in a circle** (first and last are adjacent) → that's *House Robber II*: run the line solver twice.",
      "**Houses arranged in a tree** (LeetCode 337) → DP returns a (rob, skip) pair per node via DFS.",
      "**Reconstruct which houses were robbed** → store the decision at each step and backtrack.",
    ],
    related: ["house-robber-ii", "climbing-stairs", "maximum-product-subarray"],
  },

  {
    slug: "house-robber-ii",
    title: "House Robber II",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 213,
    statement:
      "Same rules as House Robber, but the houses are arranged in a **circle** — the first and last houses are now adjacent. Return the **maximum** you can rob.",
    examples: [
      { in: "nums = [2,3,2]", out: "3", note: "can't rob both ends (0 and 2 are adjacent) → rob house 1" },
      { in: "nums = [1,2,3,1]", out: "4", note: "rob house 0 and 2" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 1000"],
    recognize:
      "It's **House Robber with a wrap-around constraint**. The circle couples the two endpoints, which breaks the clean left-to-right recurrence — the move is to *remove* the coupling by case-splitting, then reuse the linear solver.",
    figureItOut: [
      "The only thing new versus the line version is that house 0 and house `n−1` are now neighbours, so you can't rob **both**. Everything else is identical.",
      "Turn that one coupling into a clean case split: in any valid plan, **either you don't rob the last house, or you don't rob the first house** (you can't have both). Those two cases cover every possibility.",
      "Case A = solve the plain House Robber on houses `0 .. n−2` (last excluded). Case B = solve it on houses `1 .. n−1` (first excluded). Neither range is circular anymore, so the linear `dp[i] = max(dp[i-1], nums[i] + dp[i-2])` recurrence applies directly.",
      "The answer is `max(caseA, caseB)`. Handle the single-house edge first (a 1-element circle has no 'adjacent' partner). Each linear solve is O(1) space, so the whole thing is O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Two linear runs (exclude an endpoint each)",
        intuition: "Break the circle by forbidding either the first or the last house, then reuse the line solver and take the max.",
        time: "O(n)",
        timeWhy: "Two passes over (at most) n houses → still linear.",
        space: "O(1)",
        spaceWhy: "The helper uses two rolling scalars.",
        code: `int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    // Case A: houses [0 .. n-2]; Case B: houses [1 .. n-1]
    return Math.max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
}

int robLine(int[] nums, int start, int end) {
    int rob1 = 0, rob2 = 0;
    for (int i = start; i <= end; i++) {
        int take = rob1 + nums[i];
        int newRob2 = Math.max(rob2, take);
        rob1 = rob2;
        rob2 = newRob2;
    }
    return rob2;
}`,
        walkthrough: [
          "nums=[2,3,2]: Case A robs [2,3] → max=3. Case B robs [3,2] → max=3.",
          "max(3,3)=3. (Robbing both ends, 2 and 2, is forbidden by the circle.)",
        ],
      },
    ],
    edgeCases: [
      "Single house → no wrap-around partner exists → just rob it.",
      "Two houses → they're adjacent both ways → rob the richer one (both ranges reduce to one house).",
      "Forgetting the n==1 guard makes the ranges [0,-1] and [1,0] empty and returns 0 — wrong.",
    ],
    twists: [
      "**Back to a line** → drop one of the two runs; it's plain House Robber.",
      "**Reconstruct the plan** → run the path-tracking line solver for both cases and report the better one.",
      "**Two non-adjacent forbidden pairs** → generalize the case split, but watch the combinatorial blow-up.",
    ],
    related: ["house-robber", "climbing-stairs"],
  },

  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 5,
    statement:
      "Given a string `s`, return the **longest substring** of `s` that is a palindrome.",
    examples: [
      { in: 's = "babad"', out: '"bab"', note: '"aba" is also valid' },
      { in: 's = "cbbd"', out: '"bb"' },
    ],
    constraints: ["1 ≤ s.length ≤ 1000", "s contains only digits and English letters"],
    recognize:
      "A palindrome is **defined recursively** — `s[l..r]` is one when the ends match **and the inside `s[l+1..r-1]` is also a palindrome**. That self-similar 'depends on a smaller version of itself' is the DP signal; the cleanest realization here is **expand around center**.",
    figureItOut: [
      "Brute force: check all O(n²) substrings, each O(n) to verify → O(n³). The waste is obvious — verifying `s[l..r]` re-walks characters you already examined when verifying the inner substring.",
      "Capture that overlap as a recurrence. `isPal[l][r]` is true exactly when **`s[l] == s[r]` AND `isPal[l+1][r-1]`** — a longer palindrome is just a matching pair wrapped around a shorter palindrome. Base cases: single chars are palindromes, and two equal chars are too.",
      "That gives an O(n²) DP table, but there's a slicker O(1)-space view of the *same* recurrence: every palindrome has a **center** and grows outward symmetrically. So for each of the `2n−1` possible centers (each character, and each gap between two characters), **expand left and right while the characters match**.",
      "Each expansion is the recurrence applied directly — `s[l]==s[r]` lets you step outward to the next pair — without storing the table. Track the longest span seen. The two center types handle odd-length (single-char center) and even-length (gap center) palindromes.",
    ],
    approaches: [
      {
        name: "Expand around center (optimal space)",
        intuition: "Each palindrome has a center; grow outward from all 2n-1 centers while the ends match.",
        time: "O(n²)",
        timeWhy: "2n-1 centers, each expanding up to O(n) — n centers × n growth.",
        space: "O(1)",
        spaceWhy: "Only index bookkeeping; no table.",
        code: `String longestPalindrome(String s) {
    if (s.length() < 2) return s;
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(s, i, i);       // odd-length center
        int len2 = expand(s, i, i + 1);   // even-length center
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;    // left edge from the center
        }
    }
    return s.substring(start, start + maxLen);
}

int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
        l--;
        r++;
    }
    return r - l - 1;   // characters strictly inside the last good [l+1, r-1]
}`,
        walkthrough: [
          's="babad": center i=1 (\'a\') expands b·a·b → length 3 ("bab"), start=0.',
          "No later center beats length 3 → return \"bab\".",
        ],
      },
      {
        name: "Bottom-up DP table",
        intuition: "isPal[l][r] true when ends match and the inside is a palindrome; fill by increasing length.",
        time: "O(n²)",
        timeWhy: "Every (l, r) pair filled once.",
        space: "O(n²)",
        spaceWhy: "The boolean table.",
        code: `String longestPalindrome(String s) {
    int n = s.length();
    boolean[][] isPal = new boolean[n][n];
    int start = 0, maxLen = 1;
    for (int i = 0; i < n; i++) isPal[i][i] = true;   // single chars
    for (int len = 2; len <= n; len++) {
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;
            if (s.charAt(l) == s.charAt(r) && (len == 2 || isPal[l + 1][r - 1])) {
                isPal[l][r] = true;
                if (len > maxLen) { maxLen = len; start = l; }
            }
        }
    }
    return s.substring(start, start + maxLen);
}`,
        walkthrough: [
          's="cbbd": len-2 finds "bb" (isPal[1][2]) → maxLen=2, start=1.',
          "No length-3+ palindrome → return \"bb\".",
        ],
      },
    ],
    edgeCases: [
      "Single character → it's its own answer (length 1).",
      "No palindrome longer than 1 (e.g. \"abc\") → return any single character.",
      "Whole string is a palindrome → it's returned intact.",
      "Even vs odd centers: missing the `expand(i, i+1)` case loses all even-length palindromes like \"bb\".",
    ],
    twists: [
      "**Count all palindromic substrings** instead of the longest → that's *Palindromic Substrings* (count each successful expansion).",
      "**Longest palindromic subsequence** (not contiguous) → a different 2-D DP, `dp[l][r]`.",
      "**Manacher's algorithm** → solves this in true O(n) by reusing mirror information.",
    ],
    related: ["palindromic-substrings", "longest-increasing-subsequence"],
  },

  {
    slug: "palindromic-substrings",
    title: "Palindromic Substrings",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 647,
    statement:
      "Given a string `s`, return the **number of palindromic substrings** in it. Substrings at different positions count separately even if identical.",
    examples: [
      { in: 's = "abc"', out: "3", note: '"a","b","c"' },
      { in: 's = "aaa"', out: "6", note: '"a"×3, "aa"×2, "aaa"×1' },
    ],
    constraints: ["1 ≤ s.length ≤ 1000", "s is lowercase English letters"],
    recognize:
      "Same palindrome recurrence as the longest-substring problem, but you **count** every valid substring instead of tracking the longest. 'Count things defined by a self-similar property' → DP / expand-around-center.",
    figureItOut: [
      "A substring `s[l..r]` is a palindrome iff `s[l] == s[r]` and the inside `s[l+1..r-1]` is too — the very same recurrence as Longest Palindromic Substring. The only change is the objective: **count**, not maximize.",
      "Brute force counts all O(n²) substrings and verifies each in O(n) → O(n³), re-walking shared interiors. Capture the overlap with `isPal[l][r]` and you have an O(n²) table; add 1 to a counter for every cell that comes out true.",
      "The cleaner O(1)-space realization is again **expand around center**: every palindrome is generated by exactly one center, so if you expand from all `2n−1` centers, **each successful step outward is one distinct palindromic substring** — increment a counter on every match.",
      "Run both center types (single-char for odd lengths, the gap between two chars for even lengths). Total increments across all centers is the answer; no table needed.",
    ],
    approaches: [
      {
        name: "Expand around center (optimal space)",
        intuition: "Every palindrome has one center; each outward step from a center is one more palindromic substring.",
        time: "O(n²)",
        timeWhy: "2n-1 centers, each expanding up to O(n).",
        space: "O(1)",
        spaceWhy: "Only a counter and indices.",
        code: `int countSubstrings(String s) {
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        count += expand(s, i, i);       // odd-length palindromes
        count += expand(s, i, i + 1);   // even-length palindromes
    }
    return count;
}

int expand(String s, int l, int r) {
    int count = 0;
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
        count++;   // s[l..r] is a palindrome
        l--;
        r++;
    }
    return count;
}`,
        walkthrough: [
          's="aaa": center 0 odd → "a" (1). center 1 odd → "a","aaa" (2). center 2 odd → "a" (1).',
          'even centers (0,1) → "aa" (1); (1,2) → "aa" (1). Total 1+2+1+1+1 = 6.',
        ],
      },
      {
        name: "Bottom-up DP table",
        intuition: "Fill isPal[l][r] by increasing length; count every true cell.",
        time: "O(n²)",
        timeWhy: "Each (l, r) pair once.",
        space: "O(n²)",
        spaceWhy: "The boolean table.",
        code: `int countSubstrings(String s) {
    int n = s.length(), count = 0;
    boolean[][] isPal = new boolean[n][n];
    for (int len = 1; len <= n; len++) {
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;
            if (s.charAt(l) == s.charAt(r) && (len <= 2 || isPal[l + 1][r - 1])) {
                isPal[l][r] = true;
                count++;
            }
        }
    }
    return count;
}`,
        walkthrough: [
          's="abc": len-1 → 3 true cells (a,b,c). len-2 and len-3 → none match.',
          "count = 3.",
        ],
      },
    ],
    edgeCases: [
      "Every string has at least `n` palindromes (each single character).",
      "All-identical string of length n → n(n+1)/2 palindromes (every substring qualifies).",
      "Don't forget even-length centers or you undercount.",
    ],
    twists: [
      "**Return the longest one** instead of the count → that's *Longest Palindromic Substring*.",
      "**Count distinct palindromic substrings** → much harder; needs a palindromic tree (Eertree) or suffix structures.",
      "**Manacher's algorithm** → counts in O(n) total.",
    ],
    related: ["longest-palindromic-substring"],
  },

  {
    slug: "decode-ways",
    title: "Decode Ways",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 91,
    statement:
      "A message of digits was encoded with `A→1, B→2, …, Z→26`. Given the digit string `s`, return the **number of ways to decode it**.",
    examples: [
      { in: 's = "12"', out: "2", note: '"AB" (1,2) or "L" (12)' },
      { in: 's = "226"', out: "3", note: '"BBF","BZ","VF"' },
      { in: 's = "06"', out: "0", note: "leading zero can't start a code" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s contains only digits"],
    recognize:
      "'**Count the ways** to split/decode a sequence' where each position offers a **choice** (consume 1 digit or 2). Counting decompositions of a string built from overlapping prefixes → 1-D DP, very Climbing-Stairs-like but with validity rules.",
    figureItOut: [
      "Decode from the front. At any position you face a **choice**: read **one** digit as a letter (valid if it's 1–9, i.e. not '0'), or read the **two** digits starting here as a letter (valid only if that number is 10–26).",
      "So the number of ways to decode the suffix starting at `i` is **(ways from i+1 if the 1-digit code is valid) + (ways from i+2 if the 2-digit code is valid)**. That's the recurrence, and it's exactly the structure of Climbing Stairs — except each branch only counts when its code is legal.",
      "Name the **state**: `dp[i]` = number of ways to decode the suffix `s[i..]`. **Base case**: `dp[n] = 1` (an empty suffix has exactly one decoding — the empty message). Then fill **right to left**.",
      "Encode the validity rules carefully: a leading '0' kills the 1-digit option (`'0'` maps to no letter), and the 2-digit option only fires when `10 ≤ s[i..i+1] ≤ 26`. The naive recursion recomputes `dp[i+2]` from two callers → memoize or tabulate. Since `dp[i]` reads only `dp[i+1]` and `dp[i+2]`, **roll two variables** for O(1) space.",
    ],
    approaches: [
      {
        name: "Bottom-up table (right to left)",
        intuition: "dp[i] sums the valid 1-digit and 2-digit continuations.",
        time: "O(n)",
        timeWhy: "One pass; each cell does O(1) validity checks.",
        space: "O(n)",
        spaceWhy: "The dp array.",
        code: `int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[n] = 1;                                   // empty suffix: one way
    for (int i = n - 1; i >= 0; i--) {
        if (s.charAt(i) == '0') {
            dp[i] = 0;                           // can't start a code with 0
        } else {
            dp[i] = dp[i + 1];                   // take one digit
            if (i + 1 < n) {
                int two = (s.charAt(i) - '0') * 10 + (s.charAt(i + 1) - '0');
                if (two <= 26) dp[i] += dp[i + 2];   // take two digits, if 10..26
            }
        }
    }
    return dp[0];
}`,
        walkthrough: [
          's="226": dp[3]=1. i=2 (\'6\'): dp[2]=dp[3]=1.',
          "i=1 ('2','6'=26≤26): dp[1]=dp[2]+dp[3]=1+1=2. i=0 ('2','2'=22≤26): dp[0]=dp[1]+dp[2]=2+1=3 → 3.",
        ],
      },
      {
        name: "Two rolling variables (optimal space)",
        intuition: "Only dp[i+1] and dp[i+2] are ever read.",
        time: "O(n)",
        timeWhy: "Single pass.",
        space: "O(1)",
        spaceWhy: "Two scalars.",
        code: `int numDecodings(String s) {
    int n = s.length();
    int ahead2 = 1;            // dp[i+2]
    int ahead1 = 0;            // dp[i+1]
    for (int i = n - 1; i >= 0; i--) {
        int cur = 0;
        if (s.charAt(i) != '0') {
            cur = ahead1;
            if (i + 1 < n) {
                int two = (s.charAt(i) - '0') * 10 + (s.charAt(i + 1) - '0');
                if (two <= 26) cur += ahead2;
            }
        }
        ahead2 = ahead1;
        ahead1 = cur;
    }
    return ahead1;
}`,
        walkthrough: [
          's="12": start ahead2=1, ahead1=0.',
          "i=1 ('2'): cur=ahead1=0... wait i+1==n so just cur=0? No — at i=1, ahead1 was the empty-suffix 1. cur=1 → roll. i=0 ('1','2'=12): cur=1+1=2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "Leading '0' (e.g. \"0\", \"06\") → 0 ways; '0' alone decodes to nothing.",
      "A '0' that isn't preceded by '1' or '2' (e.g. \"30\") → 0 ways (no valid 2-digit code ends it).",
      "Single non-zero digit → exactly 1 way.",
      "'27'..'99' as a pair is invalid (> 26) — only the 1-digit split counts there.",
    ],
    twists: [
      "**The string may contain '*' (any digit 1–9)** (LeetCode 639) → branch over the possibilities each '*' represents.",
      "**Decode with codes up to a different cap** → change the `<= 26` bound.",
      "**Count length of all decodings / list them** → switch the recurrence from counting to building.",
    ],
    related: ["climbing-stairs", "word-break", "coin-change"],
  },

  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 322,
    statement:
      "Given coin denominations `coins` and an `amount`, return the **fewest coins** that sum to `amount`, or `-1` if it's impossible. You have an unlimited supply of each coin.",
    examples: [
      { in: "coins = [1,2,5], amount = 11", out: "3", note: "5+5+1" },
      { in: "coins = [2], amount = 3", out: "-1", note: "odd target, only even coin" },
      { in: "coins = [1], amount = 0", out: "0" },
    ],
    constraints: ["1 ≤ coins.length ≤ 12", "1 ≤ coins[i] ≤ 2³¹−1", "0 ≤ amount ≤ 10⁴"],
    recognize:
      "'**Minimum** count to reach a target' from reusable pieces — the unbounded-knapsack flavour of 1-D DP. Greedy (always take the biggest coin) is tempting but **wrong** for arbitrary denominations, which is exactly the signal that you need DP over the amounts.",
    figureItOut: [
      "Why not greedy? coins=[1,3,4], amount=6: greedy takes 4 then 1+1 = 3 coins, but 3+3 = 2 coins is better. Local 'biggest coin' choices don't compose into the global minimum, so you must consider all options — DP.",
      "Think about the **last coin** used to make `amount`. If that coin is `c`, then the rest of the pile makes `amount − c` with the fewest coins — a smaller version of the same problem. You don't know which `c` is best, so **try them all and take the minimum**.",
      "Name the **state**: `dp[a]` = the fewest coins to make amount `a`. **Recurrence**: `dp[a] = 1 + min over coins c of dp[a - c]` (only for `c ≤ a`). **Base case**: `dp[0] = 0` (zero coins make amount 0).",
      "Initialize every other `dp[a]` to a sentinel 'infinity' (`amount + 1` works, since you can never need more than `amount` coins) so unreachable amounts stay unreachable. Fill `dp` from 1 up to `amount`. The answer is `dp[amount]`, or `-1` if it's still the sentinel — meaning no combination works.",
    ],
    approaches: [
      {
        name: "Bottom-up table over amounts",
        intuition: "Best coins for amount a is 1 plus the best for (a - c), minimized over every coin c.",
        time: "O(amount × coins)",
        timeWhy: "For each of `amount` subproblems you try every coin.",
        space: "O(amount)",
        spaceWhy: "The dp array indexed by amount.",
        code: `int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);   // sentinel: impossibly many coins
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a) {
                dp[a] = Math.min(dp[a], dp[a - c] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
        walkthrough: [
          "coins=[1,2,5], amount=11. dp[1]=1, dp[2]=1, dp[5]=1...",
          "dp[6]=min(dp[5],dp[4],dp[1])+1=2. dp[11]=min(dp[10],dp[9],dp[6])+1=min(2,3,2)+1=3 → 3 (5+5+1).",
        ],
      },
    ],
    edgeCases: [
      "amount = 0 → 0 coins.",
      "Target unreachable (e.g. coins=[2], amount=3) → return -1 via the sentinel check.",
      "Large coins bigger than amount are simply skipped by the `c <= a` guard.",
      "Use `amount + 1` (not Integer.MAX_VALUE) as the sentinel so `dp[a-c] + 1` can't overflow.",
    ],
    twists: [
      "**Count the number of ways** to make the amount (LeetCode 518) → loop coins on the outside; you're summing, not minimizing.",
      "**Each coin usable at most once** → 0/1 knapsack: iterate amounts in reverse so each coin is counted once.",
      "**Return the actual coins** → store which coin won at each amount and backtrack.",
    ],
    related: ["climbing-stairs", "word-break", "partition-equal-subset-sum"],
  },

  {
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 152,
    statement:
      "Given an integer array `nums`, return the **largest product** of any **contiguous** non-empty subarray.",
    examples: [
      { in: "nums = [2,3,-2,4]", out: "6", note: "[2,3]" },
      { in: "nums = [-2,0,-1]", out: "0", note: "best subarray is [0]" },
      { in: "nums = [-2,3,-4]", out: "24", note: "the whole array: -2·3·-4" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2·10⁴", "−10 ≤ nums[i] ≤ 10"],
    recognize:
      "'**Best contiguous subarray**' running-aggregate DP (Kadane-style), but with a twist: **multiplication + negatives** mean a small (very negative) running value can flip to the maximum. The choice each step is 'extend or restart', tracked as a rolling state.",
    figureItOut: [
      "Start from the Max-Subarray-Sum idea: a running 'best product ending here' that you extend or restart at each index. But products misbehave where sums don't — multiplying by a **negative flips sign**, so today's *worst* (most negative) product can become tomorrow's *best* after one more negative.",
      "Key realization: to know the best product ending at `i`, tracking only the max-so-far isn't enough — you also need the **min** (most negative) product ending at `i`, because a future negative number turns that minimum into a large positive.",
      "Name the **state** as a pair: `maxEnd[i]` and `minEnd[i]` = the largest and smallest products of a subarray ending exactly at `i`. **Recurrence**: among `{nums[i], maxEnd[i-1]*nums[i], minEnd[i-1]*nums[i]}`, the max is `maxEnd[i]` and the min is `minEnd[i]`. The lone `nums[i]` covers 'restart here'.",
      "A zero resets both to `nums[i]` (it is 0), correctly breaking the subarray. The global answer is the best `maxEnd` over all i. Each state needs only the previous pair → **two rolling scalars, O(1) space**. (Compute the candidates *before* overwriting, since both updates read the old values.)",
    ],
    approaches: [
      {
        name: "Track running max AND min (optimal)",
        intuition: "Carry both the best and worst product ending here, because a negative can swap them.",
        time: "O(n)",
        timeWhy: "Single pass, O(1) work per element.",
        space: "O(1)",
        spaceWhy: "Two rolling scalars plus the answer.",
        code: `int maxProduct(int[] nums) {
    int maxEnd = nums[0], minEnd = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int x = nums[i];
        int a = maxEnd * x, b = minEnd * x;
        maxEnd = Math.max(x, Math.max(a, b));   // best product ending at i
        minEnd = Math.min(x, Math.min(a, b));   // worst product ending at i
        best = Math.max(best, maxEnd);
    }
    return best;
}`,
        walkthrough: [
          "nums=[-2,3,-4]: start max=min=best=-2.",
          "i=1 x=3: a=-6,b=-6 → max=3, min=-6, best=3. i=2 x=-4: a=-12,b=24 → max=24, min=-12, best=24 → 24.",
        ],
      },
    ],
    edgeCases: [
      "A single negative number → that number is the answer (subarray must be non-empty).",
      "Zeros split the array — both running products reset, since multiplying through 0 is never optimal alone.",
      "All negatives with even count → whole array; with odd count → drop one end.",
      "Must seed `best` with `nums[0]`, not 0 — an all-negative array would otherwise return a wrong 0.",
    ],
    twists: [
      "**Maximum subarray SUM** (LeetCode 53) → plain Kadane; no min needed (no sign flips).",
      "**Return the subarray itself** → track start/end indices alongside the running products.",
      "**Maximum product of a subsequence (non-contiguous)** → a different argument (just multiply positives, pair negatives).",
    ],
    related: ["house-robber", "longest-increasing-subsequence"],
  },

  {
    slug: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 139,
    statement:
      "Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be **segmented into a space-separated sequence** of one or more dictionary words. Words may be reused.",
    examples: [
      { in: 's = "leetcode", wordDict = ["leet","code"]', out: "true", note: '"leet code"' },
      { in: 's = "applepenapple", wordDict = ["apple","pen"]', out: "true", note: "reuse \"apple\"" },
      { in: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', out: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000", "all strings lowercase English"],
    recognize:
      "'**Can the sequence be split** so every piece is valid?' — a feasibility (boolean) DP over prefixes. Each cut point is a choice, and the same suffix gets re-asked from many cut points → overlapping subproblems → 1-D DP.",
    figureItOut: [
      "Brute force: try every place to cut the first word; if that prefix is a dictionary word, recurse on the rest. The problem is the **rest** — a given suffix gets re-solved from many different cut paths (e.g. via 'cat'+'s…' and 'cats'+'…'), so the naive recursion is exponential.",
      "That repeated re-solving of the same suffix is the overlapping-subproblem signal. Make the state the **position**: `dp[i]` = can `s[0..i-1]` (the first `i` characters) be fully segmented?",
      "**Recurrence**: `dp[i]` is true if there exists a split point `j < i` where `dp[j]` is true **and** the chunk `s[j..i-1]` is a dictionary word. In words: a prefix is segmentable if some earlier segmentable prefix is followed by one dictionary word reaching `i`.",
      "**Base case**: `dp[0] = true` (the empty prefix is trivially segmentable). Put the dictionary in a `HashSet` for O(1) lookups, fill `dp[1..n]`, and return `dp[n]`. Once `dp[i]` is set true you can stop scanning `j` for that `i`.",
    ],
    approaches: [
      {
        name: "Bottom-up feasibility DP",
        intuition: "A prefix ending at i is reachable if some earlier reachable prefix is followed by a dictionary word ending at i.",
        time: "O(n² × L)",
        timeWhy: "For each i, scan all j < i (n²), and each substring check costs up to its length L.",
        space: "O(n + dictionary)",
        spaceWhy: "The dp array plus the word set.",
        code: `boolean wordBreak(String s, List<String> wordDict) {
    Set<String> words = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;                              // empty prefix is segmentable
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && words.contains(s.substring(j, i))) {
                dp[i] = true;
                break;                         // one valid split is enough
            }
        }
    }
    return dp[n];
}`,
        walkthrough: [
          's="leetcode", dict={leet,code}: dp[0]=true. dp[4]=dp[0] && "leet"∈dict → true.',
          'dp[8]: j=4 gives dp[4] && "code"∈dict → true → return true.',
        ],
      },
    ],
    edgeCases: [
      "A word that is a prefix of another (e.g. dict has \"a\" and \"aa\") — checking all split points j handles it.",
      "Overlapping ways to cut (\"catsand…\") — feasibility only needs ONE valid segmentation.",
      "Empty-ish dictionaries or no match → dp[n] stays false.",
      "`catsandog` returns false: \"cat\"/\"cats\" lead somewhere, but nothing covers the final \"og\".",
    ],
    twists: [
      "**Return all the sentences** (LeetCode 140) → DP/DFS that builds segmentations, with memoization to avoid the exponential blow-up.",
      "**Minimum number of words** in the segmentation → swap the boolean for a count and minimize.",
      "**Bound the inner scan by max word length** → only check `j` within `maxLen` of `i` to speed it up.",
    ],
    related: ["decode-ways", "coin-change", "longest-increasing-subsequence"],
  },

  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 300,
    statement:
      "Given an integer array `nums`, return the length of the **longest strictly increasing subsequence** (elements in order, not necessarily contiguous).",
    examples: [
      { in: "nums = [10,9,2,5,3,7,101,18]", out: "4", note: "[2,3,7,101] or [2,3,7,18]" },
      { in: "nums = [0,1,0,3,2,3]", out: "4", note: "[0,1,2,3]" },
      { in: "nums = [7,7,7,7]", out: "1", note: "strictly increasing → length 1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2500", "−10⁴ ≤ nums[i] ≤ 10⁴"],
    recognize:
      "'**Longest subsequence** with an ordering property' — a per-index DP where the answer at `i` depends on every earlier compatible index. Subsequence (not subarray) + 'longest/increasing' is the canonical LIS shape.",
    figureItOut: [
      "Brute force enumerates all 2ⁿ subsequences — hopeless. Anchor the subsequence by its **last** element: define `dp[i]` = the length of the longest increasing subsequence that **ends exactly at index `i`**. Anchoring the end is what makes the subproblems combine.",
      "**Recurrence**: to end at `i`, the previous element of the subsequence is some earlier `j < i` with `nums[j] < nums[i]`. Extending that subsequence by `nums[i]` gives `dp[j] + 1`. Take the best such `j`: `dp[i] = 1 + max(dp[j])` over all valid `j` (and `dp[i] = 1` if none exists — `i` alone).",
      "**Base case**: every `dp[i]` starts at 1 (the single element `nums[i]`). Fill `dp` left to right; the answer is the **max over the whole `dp` array**, since the LIS can end at any index, not just the last.",
      "That's O(n²). There's an O(n log n) upgrade: maintain a `tails` list where `tails[k]` is the smallest possible tail of an increasing subsequence of length `k+1`. For each number, **binary-search** the first tail ≥ it and overwrite it (or append if it's larger than all). The list length is the LIS length — patience-sorting in disguise.",
    ],
    approaches: [
      {
        name: "O(n²) DP — longest chain ending at i",
        intuition: "dp[i] extends the best compatible earlier subsequence by one.",
        time: "O(n²)",
        timeWhy: "For each i you scan all earlier j.",
        space: "O(n)",
        spaceWhy: "The dp array.",
        code: `int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);             // each element alone is length 1
    int best = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
        walkthrough: [
          "nums=[10,9,2,5,3,7,...]: dp[2]=1(2), dp[3]=2(2,5), dp[4]=2(2,3).",
          "dp[5]=3(2,3,7), then 101→4, 18→4 → best 4.",
        ],
      },
      {
        name: "Patience sorting with binary search (optimal time)",
        intuition: "Keep the smallest tail for each subsequence length; binary-search where each number fits.",
        time: "O(n log n)",
        timeWhy: "n elements, each a binary search over the tails list.",
        space: "O(n)",
        spaceWhy: "The tails list (at most n long).",
        code: `int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int x : nums) {
        int lo = 0, hi = tails.size();
        while (lo < hi) {                       // first index with tails[idx] >= x
            int mid = lo + (hi - lo) / 2;
            if (tails.get(mid) < x) lo = mid + 1;
            else hi = mid;
        }
        if (lo == tails.size()) tails.add(x);   // x extends the longest chain
        else tails.set(lo, x);                  // x is a smaller tail for that length
    }
    return tails.size();
}`,
        walkthrough: [
          "nums=[10,9,2,5,3,7]: tails→[10]→[9]→[2]→[2,5]→[2,3]→[2,3,7].",
          "Length 3. (tails isn't the actual LIS, but its length is correct.)",
        ],
      },
    ],
    edgeCases: [
      "All equal elements → length 1 (strictly increasing forbids repeats).",
      "Strictly decreasing array → length 1.",
      "Already sorted ascending → length n.",
      "'Strictly' vs 'non-decreasing' changes the comparison to `<=` and the binary search to upper-bound.",
    ],
    twists: [
      "**Count the number of LIS** (LeetCode 673) → carry a count array alongside the length DP.",
      "**Longest non-decreasing subsequence** → allow equals; binary-search the upper bound.",
      "**Russian-doll envelopes / 2-D LIS** (LeetCode 354) → sort one dimension, LIS on the other.",
    ],
    related: ["maximum-product-subarray", "longest-palindromic-substring"],
  },

  {
    slug: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 416,
    statement:
      "Given an array of positive integers `nums`, return `true` if it can be split into **two subsets with equal sum**.",
    examples: [
      { in: "nums = [1,5,11,5]", out: "true", note: "[1,5,5] and [11]" },
      { in: "nums = [1,2,3,5]", out: "false", note: "total 11 is odd → impossible" },
    ],
    constraints: ["1 ≤ nums.length ≤ 200", "1 ≤ nums[i] ≤ 100"],
    recognize:
      "'**Can a subset hit an exact target?**' is the **subset-sum / 0-1 knapsack** problem in disguise. Each element is a take-it-or-leave-it choice toward a fixed target — a boolean DP over achievable sums.",
    figureItOut: [
      "Reframe the goal. Two equal halves means each half sums to `total / 2`. So first: if `total` is **odd**, it's instantly impossible. Otherwise the question collapses to: *is there a subset that sums to exactly `target = total / 2`?* (the other subset is then automatically the rest, with the same sum).",
      "That's **subset-sum**, a 0-1 knapsack feasibility problem. Per element you make a binary choice — include it in the subset or not — and ask whether some sequence of choices reaches `target`. Different choice paths re-ask 'can I make sum s?' → overlapping subproblems → DP.",
      "Name the **state**: `dp[s]` = can we form sum `s` from the elements considered so far? **Base case**: `dp[0] = true` (the empty subset makes 0). Processing a number `n` updates: `dp[s]` becomes true if it was already true, or if `dp[s - n]` was true (we add `n` to a subset that made `s − n`).",
      "Critical detail for **0-1** (each item used at most once): iterate `s` **downward** from `target` to `n`. Going downward means each number's contribution is applied to values from the *previous* round, so no element is double-counted. The answer is `dp[target]`. This is the 1-D space-optimized knapsack.",
    ],
    approaches: [
      {
        name: "1-D subset-sum DP (downward sweep)",
        intuition: "Track which sums are reachable; each number unlocks new sums, applied high-to-low so it's used once.",
        time: "O(n × target)",
        timeWhy: "For each of n numbers, sweep the `target`-sized boolean array.",
        space: "O(target)",
        spaceWhy: "A single boolean array indexed by sum.",
        code: `boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;          // odd total can't split evenly
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;                              // empty subset makes 0
    for (int n : nums) {
        for (int s = target; s >= n; s--) {    // downward → each number used once
            if (dp[s - n]) dp[s] = true;
        }
    }
    return dp[target];
}`,
        walkthrough: [
          "nums=[1,5,11,5], total=22, target=11. dp[0]=true.",
          "After 1: {0,1}. After 5: {0,1,5,6}. After 11: adds 11. After 5: dp[11] via dp[6] → true.",
        ],
      },
    ],
    edgeCases: [
      "Odd total → immediately false (the cheap guard).",
      "Single element → false (one number can't split into two non-empty equal halves unless... it can't, since values are positive).",
      "A number larger than `target` can never be in the half-subset — the `s >= n` bound skips it.",
      "Iterating `s` **upward** instead of downward would let one element be reused (turning it into unbounded knapsack) — a classic bug.",
    ],
    twists: [
      "**Target Sum** (LeetCode 494, assign +/−) → reduces to counting subsets with a given sum.",
      "**Partition into k equal subsets** (LeetCode 698) → backtracking / bitmask DP, much harder.",
      "**Minimize the difference between the two subset sums** (LeetCode 1049 'Last Stone Weight II') → find the achievable sum closest to total/2.",
    ],
    related: ["coin-change", "house-robber"],
  },
];
