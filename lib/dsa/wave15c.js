// NeetCode All / Top Interview 150 / LeetCode 75 / Grind 75 — wave 15c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave14c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE15C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "paint-fence",
    title: "Paint Fence",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 276,
    statement:
      "You are painting a fence of `n` posts with `k` colors. Posts are painted one at a time, and **no three consecutive posts** may share the same color (at most two adjacent posts can be the same). Return the number of ways to paint all the posts.",
    examples: [
      { in: "n=3, k=2", out: "6" },
      { in: "n=1, k=1", out: "1" },
      { in: "n=7, k=2", out: "42" },
    ],
    constraints: ["1 ≤ n ≤ 50", "1 ≤ k ≤ 10^5", "the answer fits in a signed 32-bit integer"],
    recognize:
      "Counting colorings where each post depends only on whether the previous one matched the post before it → a 1-D DP that splits each post's count into a same-as-previous part and a different-from-previous part.",
    figureItOut: [
      "**State**: split the ways to paint up to post i into two buckets. `same[i]` = number of ways where post i has the **same** color as post i-1; `diff[i]` = number of ways where post i has a **different** color from post i-1. This split is exactly what the no-three-in-a-row rule needs.",
      "**Recurrence**: to make post i the same as i-1, post i-1 must have been different from i-2 (otherwise three in a row), so `same[i] = diff[i-1]`. To make post i different from i-1, you pick any of the other k-1 colors regardless of how i-1 came about, so `diff[i] = (same[i-1] + diff[i-1]) * (k-1)`.",
      "**Base case**: post 1 (the first post): `same[1] = 0` (no previous post to match) and `diff[1] = k` (any of k colors counts as the starting choice). The total for one post is k.",
      "**Fill**: sweep i from 2 to n, computing `same[i]` and `diff[i]` from the previous post's two values. Only the previous pair is needed, so two rolling scalars replace the arrays (O(1) space).",
      "The answer is `same[n] + diff[n]`, the total over both buckets at the last post.",
    ],
    approaches: [
      {
        name: "Two-bucket rolling DP (same vs different) (optimal)",
        intuition: "Track how many colorings end with a matching pair versus a fresh color; a match can only follow a non-match, and a fresh color has k-1 choices.",
        time: "O(n)",
        timeWhy: "A single pass over the n posts updating two scalars.",
        space: "O(1)",
        spaceWhy: "Two rolling counters for same and diff; no array needed.",
        code: `int numWays(int n, int k) {
    if (n == 0) return 0;
    if (n == 1) return k;
    long same = 0;          // ways where post i matches post i-1
    long diff = k;          // ways where post 1 is freely colored
    for (int i = 2; i <= n; i++) {
        long newSame = diff;                 // a match must follow a non-match
        long newDiff = (same + diff) * (k - 1);
        same = newSame;
        diff = newDiff;
    }
    return (int) (same + diff);
}`,
        walkthrough: [
          "n=3, k=2. Post 1: same=0, diff=2 (total 2).",
          "Post 2: newSame=diff=2, newDiff=(0+2)*(2-1)=2. Now same=2, diff=2 (total 4).",
          "Post 3: newSame=diff=2, newDiff=(2+2)*(2-1)=4. Now same=2, diff=4.",
          "Answer same+diff = 2+4 = 6.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → no adjacency constraint applies, so the answer is exactly k.",
      "k == 1 with n >= 3 → impossible to avoid three in a row (diff becomes 0), so the answer is 0 for n >= 3 and 1 for n <= 2.",
      "Use long during multiplication since (same+diff)*(k-1) can transiently exceed int before the final result fits.",
    ],
    twists: [
      "**No two adjacent posts may match** → drop the same bucket entirely; the count becomes k*(k-1)^(n-1).",
      "**At most m consecutive same colors** → generalize the same bucket into a run-length dimension.",
      "**Return the colorings themselves** → switch from counting to backtracking enumeration.",
    ],
    related: ["climbing-stairs", "house-robber", "decode-ways"],
  },

  {
    slug: "2-keys-keyboard",
    title: "2 Keys Keyboard",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 650,
    statement:
      "You start with a single character `A` on a notepad. You may perform two operations: **Copy All** (copy the entire current content — only the whole thing) and **Paste** (append what was last copied). Given a target count `n`, return the **minimum number of operations** to make the notepad contain exactly `n` copies of `A`.",
    examples: [
      { in: "n=3", out: "3", note: "Copy All, Paste, Paste → AAA" },
      { in: "n=1", out: "0", note: "already A" },
      { in: "n=6", out: "5", note: "Copy,Paste,Paste (AAA) then Copy,Paste (AAAAAA)" },
    ],
    constraints: ["1 ≤ n ≤ 1000"],
    recognize:
      "Reaching n by repeatedly copying the whole content then pasting is built from divisor-sized blocks → a 1-D DP over counts where each reachable count is formed by replicating a divisor, which is exactly prime-factor summation.",
    figureItOut: [
      "**State**: `dp[i]` = the minimum number of operations to reach exactly `i` characters on the notepad. Every count is reached by Copy-All-then-Paste cycles, so the count grows by whole multiples of its current value.",
      "**Recurrence**: to reach `i`, you last had some divisor `j` of `i` (with `j < i`), did one Copy All, and pasted `(i / j) - 1` times — that is `i/j` total operations to go from `j` to `i`. So `dp[i] = min over divisors j of i of (dp[j] + i / j)`. The smallest such cost comes from the prime factors of i.",
      "**Base case**: `dp[1] = 0` — a single A needs no operations. `dp[i]` for i > 1 starts at infinity before relaxation.",
      "**Fill**: for each i from 2 to n, scan candidate divisors j from 1 up; whenever `i % j == 0`, relax `dp[i]` with `dp[j] + i / j` and also consider the complementary divisor. Equivalently, peel off the smallest prime factor repeatedly and sum the prime factors.",
      "The answer is `dp[n]`. Because the optimal decomposition is the sum of n's prime factors, the DP and the prime-sum approach agree.",
    ],
    approaches: [
      {
        name: "Divisor DP over counts (baseline)",
        intuition: "The cheapest way to reach i is to reach a divisor j first, then copy once and paste to multiply up to i.",
        time: "O(n * sqrt(n))",
        timeWhy: "For each of n counts, finding divisors costs about sqrt(n).",
        space: "O(n)",
        spaceWhy: "The dp array of size n+1.",
        code: `int minStepsDP(int n) {
    int[] dp = new int[n + 1];
    for (int i = 2; i <= n; i++) {
        dp[i] = Integer.MAX_VALUE;
        for (int j = 1; j * j <= i; j++) {
            if (i % j == 0) {
                // reach j then multiply up to i: j -> i costs i/j ops
                dp[i] = Math.min(dp[i], dp[j] + i / j);
                int other = i / j;
                dp[i] = Math.min(dp[i], dp[other] + j);
            }
        }
    }
    return dp[n];
}`,
      },
      {
        name: "Prime-factor sum (optimal)",
        intuition: "Each Copy-All-then-paste block multiplies the count by a factor, and the minimum total operations equals the sum of n's prime factors.",
        time: "O(sqrt(n))",
        timeWhy: "Trial division to extract prime factors up to sqrt(n).",
        space: "O(1)",
        spaceWhy: "Only a running sum and the remaining value.",
        code: `int minSteps(int n) {
    int ops = 0;
    int d = 2;
    while (n > 1) {
        while (n % d == 0) {   // peel off every occurrence of prime d
            ops += d;
            n /= d;
        }
        d++;
    }
    return ops;
}`,
        walkthrough: [
          "n=6. ops=0, d=2.",
          "6 % 2 == 0: ops += 2 -> ops=2, n=3. 3 % 2 != 0, advance d to 3.",
          "3 % 3 == 0: ops += 3 -> ops=5, n=1. Loop ends.",
          "Answer 5 (matches Copy,Paste,Paste then Copy,Paste).",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → already done, 0 operations (the loop never runs).",
      "n prime → the only decomposition is one Copy plus (n-1) Pastes, giving exactly n operations.",
      "Powers of a prime (e.g. n=8=2*2*2) sum the same prime repeatedly: 2+2+2 = 6 operations.",
    ],
    twists: [
      "**4 Keys Keyboard (LeetCode 651)** → adds Select/Copy/Paste buffers, turning it into a richer DP over the longest paste run.",
      "**Allow copying a substring** → the whole-content restriction is lifted and the structure changes completely.",
      "**Minimize pastes only (copies free)** → reduces to the number of distinct multiplication steps.",
    ],
    related: ["perfect-squares", "integer-break", "coin-change"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "delete-operation-for-two-strings",
    title: "Delete Operation for Two Strings",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 583,
    statement:
      "Given two strings `word1` and `word2`, return the **minimum number of deletion steps** required to make the two strings equal. In one step you may delete exactly one character from either string.",
    examples: [
      { in: 'word1="sea", word2="eat"', out: "2", note: "delete s from sea and t from eat to get ea" },
      { in: 'word1="leetcode", word2="etco"', out: "4" },
      { in: 'word1="a", word2="a"', out: "0" },
    ],
    constraints: ["1 ≤ word1.length, word2.length ≤ 500", "both strings consist of lowercase English letters"],
    recognize:
      "Making two strings equal by deletions only preserves their **longest common subsequence**; everything else must be deleted → a classic 2-D LCS DP, with the answer derived from the LCS length.",
    figureItOut: [
      "**State**: `dp[i][j]` = the minimum number of deletions to make the first `i` characters of word1 and the first `j` characters of word2 equal. The characters that survive form a common subsequence, so minimizing deletions is the same as maximizing what is kept.",
      "**Recurrence**: if `word1[i-1] == word2[j-1]`, that matched character can be kept, so `dp[i][j] = dp[i-1][j-1]`. Otherwise at least one of the two current characters must be deleted, so `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1])`.",
      "**Base case**: `dp[i][0] = i` (delete all i characters of word1 to match an empty word2) and `dp[0][j] = j` (delete all j characters of word2). An empty-vs-empty cell `dp[0][0] = 0`.",
      "**Fill**: sweep i from 1..m and j from 1..n, filling row by row; each cell reads the diagonal, top, and left neighbors. Since each row depends only on the row above, a single rolling 1-D array of length n+1 suffices for O(n) space.",
      "The answer is `dp[m][n]`. Equivalently, `m + n - 2 * LCS(word1, word2)` — both strings keep their common subsequence and delete the rest.",
    ],
    approaches: [
      {
        name: "Edit-distance-style deletion DP (optimal)",
        intuition: "Match keeps a character for free; a mismatch forces deleting one side, so each cell is the diagonal on a match or one plus the cheaper neighbor on a mismatch.",
        time: "O(m * n)",
        timeWhy: "Each of the m*n table cells is computed in constant time.",
        space: "O(n)",
        spaceWhy: "Only the previous row is needed, so one rolling array of length n+1.",
        code: `int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[] dp = new int[n + 1];
    for (int j = 0; j <= n; j++) dp[j] = j;   // delete all of word2 prefix
    for (int i = 1; i <= m; i++) {
        int prevDiag = dp[0];   // dp[i-1][0]
        dp[0] = i;              // delete all i chars of word1 prefix
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];   // dp[i-1][j] before overwrite
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[j] = prevDiag;
            } else {
                dp[j] = 1 + Math.min(dp[j], dp[j - 1]);
            }
            prevDiag = temp;
        }
    }
    return dp[n];
}`,
        walkthrough: [
          'word1="sea", word2="eat". Init dp = [0,1,2,3] (for prefixes of "eat").',
          'i=1 (s): dp[0]=1. j=1 e: s!=e -> 1+min(dp[1]=1, dp[0]=1)=2. j=2 a: s!=a -> 1+min(2,2)=3. j=3 t: 1+min(3,3)=4. row -> [1,2,3,4].',
          'i=2 (e): dp[0]=2. j=1 e: e==e -> prevDiag (old dp[1]=1)=1. j=2 a: 1+min(3,1)=2. j=3 t: 1+min(4,2)=3. row -> [2,1,2,3].',
          'i=3 (a): dp[0]=3. j=1 e: a!=e -> 1+min(1,3)=2. j=2 a: a==a -> prevDiag (old dp[1]=1)=1. j=3 t: 1+min(3,1)=2. dp[n]=dp[3]=2. Answer 2.',
        ],
      },
    ],
    edgeCases: [
      "One string empty → answer is the length of the other (delete it entirely).",
      "Identical strings → 0 deletions, since LCS equals both full strings.",
      "No common characters at all → m + n deletions (delete both strings down to empty).",
    ],
    twists: [
      "**Edit Distance (LeetCode 72)** → allow insert and replace, not just delete; adds a replace transition.",
      "**Minimum ASCII Delete Sum (LeetCode 712)** → weight deletions by character code instead of counting them.",
      "**Return the kept subsequence** → reconstruct the LCS by walking the table backward.",
    ],
    related: ["longest-common-subsequence", "edit-distance", "distinct-subsequences"],
  },

  {
    slug: "uncrossed-lines",
    title: "Uncrossed Lines",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1035,
    statement:
      "You are given two integer arrays `nums1` and `nums2` written in two rows. You may draw connecting lines: a line joins `nums1[i]` and `nums2[j]` only if `nums1[i] == nums2[j]`, and no two connecting lines may **cross** (a later line cannot connect to an earlier index once an earlier line used a later index). Return the **maximum number of connecting lines** you can draw.",
    examples: [
      { in: "nums1=[1,4,2], nums2=[1,2,4]", out: "2", note: "connect the 1s and the 4s; connecting 4s and 2s would cross" },
      { in: "nums1=[2,5,1,2,5], nums2=[10,5,2,1,5,2]", out: "3" },
      { in: "nums1=[1,3,7,1,7,5], nums2=[1,9,2,5,1]", out: "2" },
    ],
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 500", "1 ≤ nums1[i], nums2[j] ≤ 2000"],
    recognize:
      "Non-crossing equal-value connections between two ordered sequences are exactly a **longest common subsequence** in disguise → a standard 2-D LCS DP over the two arrays.",
    figureItOut: [
      "**State**: `dp[i][j]` = the maximum number of non-crossing lines using the first `i` elements of nums1 and the first `j` elements of nums2. Non-crossing forces matched indices to be increasing in both arrays, which is precisely the LCS condition.",
      "**Recurrence**: if `nums1[i-1] == nums2[j-1]`, you may draw a line connecting them and add it to the best from the strictly smaller prefixes: `dp[i][j] = dp[i-1][j-1] + 1`. Otherwise skip one side and take the better: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.",
      "**Base case**: `dp[i][0] = 0` and `dp[0][j] = 0` — with an empty prefix on either side no line can be drawn.",
      "**Fill**: sweep i from 1..m and j from 1..n, computing each cell from its diagonal, top, and left neighbors. Each row depends only on the previous row, so a rolling 1-D array of length n+1 gives O(n) space.",
      "The answer is `dp[m][n]`, the length of the longest common subsequence of the two arrays.",
    ],
    approaches: [
      {
        name: "LCS tabulation over the two arrays (optimal)",
        intuition: "A non-crossing set of equal-value lines is an increasing matching, i.e. a common subsequence; maximize it with the LCS recurrence.",
        time: "O(m * n)",
        timeWhy: "Each of the m*n cells is filled in constant time.",
        space: "O(n)",
        spaceWhy: "Only the previous row is retained via one rolling array.",
        code: `int maxUncrossedLines(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[] dp = new int[n + 1];
    for (int i = 1; i <= m; i++) {
        int prevDiag = 0;        // dp[i-1][0]
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];    // dp[i-1][j] before overwrite
            if (nums1[i - 1] == nums2[j - 1]) {
                dp[j] = prevDiag + 1;
            } else {
                dp[j] = Math.max(dp[j], dp[j - 1]);
            }
            prevDiag = temp;
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "nums1=[1,4,2], nums2=[1,2,4]. dp starts [0,0,0,0].",
          "i=1 (1): j=1 (1) equal -> dp[1]=prevDiag(0)+1=1; j=2 (2) 1!=2 -> max(dp[2]=0,dp[1]=1)=1; j=3 (4) 1!=4 -> max(0,1)=1. row -> [0,1,1,1].",
          "i=2 (4): j=1 (1) 4!=1 -> max(1,0)=1; j=2 (2) 4!=2 -> max(1,1)=1; j=3 (4) equal -> prevDiag (old dp[2]=1)+1=2. row -> [0,1,1,2].",
          "i=3 (2): j=1 (1) 2!=1 ->1; j=2 (2) equal -> prevDiag (old dp[1]=1)+1=2; j=3 (4) 2!=4 -> max(2,2)=2. dp[n]=2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "No common values → 0 lines.",
      "Repeated values force ordering: a line cannot reuse an index, so duplicates still obey the increasing-index rule.",
      "One array of length 1 → at most 1 line, drawn iff that value appears in the other array.",
    ],
    twists: [
      "**Longest Common Subsequence (LeetCode 1143)** → the identical DP on character strings.",
      "**Maximize total connected VALUE instead of count** → add the matched value rather than 1 on a match.",
      "**Allow lines to cross** → the constraint vanishes and it becomes a simple frequency-intersection count.",
    ],
    related: ["longest-common-subsequence", "edit-distance", "maximum-length-of-repeated-subarray"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "nearest-exit-from-entrance-in-maze",
    title: "Nearest Exit from Entrance in Maze",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1926,
    statement:
      "You are given an `m x n` `maze` of empty cells `.` and walls `+`, and an `entrance = [r, c]` (an empty cell). An **exit** is any empty cell on the border of the maze **other than** the entrance itself. From any cell you may move one step up, down, left, or right into an empty cell. Return the number of steps in the **shortest path** from the entrance to the nearest exit, or `-1` if no exit is reachable.",
    examples: [
      { in: 'maze=[["+","+",".","+"],[".",".",".","+"],["+","+","+","."]], entrance=[1,2]', out: "1", note: "step left or up to a border exit" },
      { in: 'maze=[["+","+","+"],[".",".","."],["+","+","+"]], entrance=[1,0]', out: "2", note: "walk right to the (1,2) border exit" },
      { in: 'maze=[[".","+"]], entrance=[0,0]', out: "-1", note: "the only other border cell is a wall" },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "maze[i][j] is . or +", "entrance.length == 2", "the entrance is an empty cell on or off the border"],
    recognize:
      "Shortest number of steps in an unweighted grid to reach any of several targets (the border exits) → multi-target **BFS** from the entrance, returning the first layer that lands on a border exit.",
    figureItOut: [
      "Each empty cell is a graph node; an edge connects orthogonally adjacent empty cells. Since every move costs one step, the shortest path is found by **breadth-first search**, which explores cells in increasing distance order.",
      "Start BFS at the entrance with distance 0 and mark it visited (turn it into a wall or use a visited grid) so you do not return to it. Expand level by level: each dequeued cell enqueues its unvisited empty neighbors at distance + 1.",
      "An exit is any visited empty **border** cell that is not the entrance. As soon as BFS reaches a cell on row 0, row m-1, col 0, or col n-1 (and it is not the start), that distance is the answer because BFS guarantees the first time you touch an exit is via a shortest path.",
      "Mark cells visited the moment you enqueue them (not when you dequeue) so no cell is queued twice. If the queue empties without ever reaching a border exit, return -1.",
    ],
    approaches: [
      {
        name: "Multi-target BFS, stop at first border exit (optimal)",
        intuition: "Flood outward from the entrance one ring at a time; the first border cell you touch is the nearest exit by construction.",
        time: "O(m * n)",
        timeWhy: "Each cell is enqueued and processed at most once; four neighbor checks per cell.",
        space: "O(m * n)",
        spaceWhy: "The BFS queue and the in-place visited marking (or a visited grid).",
        code: `int nearestExit(char[][] maze, int[] entrance) {
    int m = maze.length, n = maze[0].length;
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    Deque<int[]> queue = new ArrayDeque<>();
    queue.add(new int[]{entrance[0], entrance[1], 0});
    maze[entrance[0]][entrance[1]] = '+';   // mark start visited
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int r = cur[0], c = cur[1], dist = cur[2];
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
            if (maze[nr][nc] != '.') continue;
            // an empty border cell (not the entrance) is an exit
            if (nr == 0 || nr == m - 1 || nc == 0 || nc == n - 1) {
                return dist + 1;
            }
            maze[nr][nc] = '+';     // mark visited on enqueue
            queue.add(new int[]{nr, nc, dist + 1});
        }
    }
    return -1;
}`,
        walkthrough: [
          'maze=[["+","+","+"],[".",".","."],["+","+","+"]], entrance=[1,0]. Mark (1,0) as wall. Queue {(1,0,0)}.',
          "Pop (1,0,0). Neighbors: up (0,0)=+ skip; down (2,0)=+ skip; right (1,1)=. interior, mark and enqueue (1,1,1); left out of bounds.",
          "Pop (1,1,1). Right (1,2)=. is a border cell (col n-1) -> return dist+1 = 2.",
          "Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "The entrance itself is on the border but does NOT count as an exit; only OTHER border cells do.",
      "Entrance fully enclosed by walls → queue drains with no exit → -1.",
      "A 1x1 or single-row maze where the only other border cell is a wall → -1 (example 3).",
    ],
    twists: [
      "**Count the number of distinct exits reachable** → do not stop at the first; continue BFS and tally border cells.",
      "**Weighted cells (some cost more to enter)** → switch BFS to Dijkstra.",
      "**Diagonal moves allowed** → add the four diagonal directions to the neighbor set.",
    ],
    related: ["shortest-path-in-binary-matrix", "rotting-oranges", "walls-and-gates"],
  },

  {
    slug: "number-of-distinct-islands",
    title: "Number of Distinct Islands",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 694,
    statement:
      "Given an `m x n` binary `grid` where `1` is land and `0` is water, an **island** is a maximal group of `1`s connected 4-directionally. Two islands are the **same** if one can be translated (slid, not rotated or reflected) to overlap the other exactly. Return the number of **distinct** island shapes.",
    examples: [
      { in: "grid=[[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]", out: "1", note: "the two 2x2 islands have the same shape" },
      { in: "grid=[[1,1,0,1,1],[1,0,0,0,0],[0,0,0,0,1],[1,1,0,1,1]]", out: "3" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 50", "grid[i][j] is 0 or 1"],
    recognize:
      "Count connected components but **deduplicate by shape** under translation → flood-fill each island while recording a translation-invariant signature (the cell offsets from the island's anchor), then count distinct signatures.",
    figureItOut: [
      "Each island is a connected component found by DFS/BFS flood fill. To compare shapes under translation, anchor every island at the cell where the traversal started and record each visited cell as an **offset** `(r - r0, c - c0)` from that anchor.",
      "Two islands are translations of each other exactly when their sets of offsets are identical. So a canonical signature is the sorted list (or the path string) of these relative coordinates; store each signature in a HashSet.",
      "Sweep the grid; when you hit an unvisited land cell, launch a DFS that visits the whole island (marking cells visited so each is counted once), building its offset signature. Add the finished signature to the set.",
      "A robust signature is the DFS **direction path** (record D/U/R/L plus a backtrack marker), which captures shape order deterministically and avoids ambiguity from unordered offset sets. The answer is the size of the signature set.",
    ],
    approaches: [
      {
        name: "Flood fill with translation-invariant path signature (optimal)",
        intuition: "Walk each island, record the directions taken (including backtracks) as a shape fingerprint, and count how many distinct fingerprints appear.",
        time: "O(m * n)",
        timeWhy: "Each cell is visited once during flood fill; signature building is proportional to island size.",
        space: "O(m * n)",
        spaceWhy: "The visited marking, the recursion stack, and the set of shape signatures.",
        code: `int numDistinctIslands(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    Set<String> shapes = new HashSet<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) {
                StringBuilder path = new StringBuilder();
                dfs(grid, r, c, path, "S");   // S = start marker
                shapes.add(path.toString());
            }
        }
    }
    return shapes.size();
}
void dfs(int[][] grid, int r, int c, StringBuilder path, String dir) {
    int m = grid.length, n = grid[0].length;
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == 0) return;
    grid[r][c] = 0;            // mark visited
    path.append(dir);
    dfs(grid, r + 1, c, path, "D");
    dfs(grid, r - 1, c, path, "U");
    dfs(grid, r, c + 1, path, "R");
    dfs(grid, r, c - 1, path, "L");
    path.append("B");          // backtrack marker disambiguates shapes
}`,
        walkthrough: [
          "grid has two 2x2 blocks. Sweep finds the first land cell at (0,0); DFS records path: S then D (down to (1,0)) ... R back up etc., producing one signature string like SDBRDBBB.",
          "All four cells of the first island get marked 0 during the DFS so they are not recounted.",
          "Sweep reaches the second 2x2 block at (2,3); its DFS starts at the analogous anchor and produces the SAME path string because the shape is identical.",
          "Both signatures are equal, so the set has size 1. Answer 1.",
        ],
      },
    ],
    edgeCases: [
      "The backtrack marker (B) is essential: without it, an L-shape and its mirror can collide into the same string.",
      "Single-cell islands all share the signature SB, so any number of them counts as one distinct shape.",
      "Reflections and rotations are NOT considered the same here (only translation), unlike the harder variant.",
    ],
    twists: [
      "**Distinct Islands II (LeetCode 711)** → also treat rotations and reflections as identical; canonicalize over all 8 transforms.",
      "**Number of Islands (LeetCode 200)** → just count components without deduplicating shapes.",
      "**Largest island after flipping one 0** → component sizing plus boundary merging.",
    ],
    related: ["number-of-islands", "max-area-of-island", "count-sub-islands"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "number-of-restricted-paths-from-first-to-last-node",
    title: "Number of Restricted Paths From First to Last Node",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1786,
    statement:
      "An undirected weighted connected graph has `n` nodes `1..n` and `edges[i] = [u, v, w]` (an edge of weight `w`). Let `distanceToLastNode(x)` be the shortest distance from node `x` to node `n`. A path `z0 -> z1 -> ... -> zk` is **restricted** if `distanceToLastNode(z0) > distanceToLastNode(z1) > ... > distanceToLastNode(zk)` (strictly decreasing). Return the number of restricted paths from node `1` to node `n`, **modulo 10^9 + 7**.",
    examples: [
      { in: "n=5, edges=[[1,2,3],[1,3,3],[2,3,1],[1,4,2],[5,2,2],[3,5,1],[5,4,10]]", out: "3" },
      { in: "n=7, edges=[[1,3,1],[4,1,2],[7,3,4],[2,5,3],[5,6,1],[6,7,2],[7,5,3],[2,6,4]]", out: "1", note: "the single restricted path is 1 -> 3 -> 7" },
    ],
    constraints: ["1 ≤ n ≤ 2*10^4", "n-1 ≤ edges.length ≤ 4*10^4", "edges[i].length == 3", "1 ≤ u, v ≤ n and u != v", "1 ≤ w ≤ 10^5", "the graph is connected with no self-loops", "return the count modulo 10^9 + 7"],
    recognize:
      "Counting strictly-decreasing-distance paths to a target combines a single **Dijkstra** from node n with a **DAG path count** (memoized DFS) over edges that point toward shorter distance-to-n.",
    figureItOut: [
      "First run **Dijkstra from node n** to get `dist[x]` = shortest distance from every node x to node n. The restriction `dist[z0] > dist[z1] > ...` means every step of a restricted path moves to a strictly smaller dist value, so the allowed edges form a DAG oriented from larger to smaller dist.",
      "Count paths in that DAG with a memoized DFS: `ways(x)` = number of restricted paths from x to n. From x you may go to any neighbor y with `dist[y] < dist[x]`, and `ways(x) = sum over such y of ways(y)`, all modulo 10^9 + 7.",
      "Base case `ways(n) = 1` (the trivial path ending at the target). Memoize `ways(x)` so each node is expanded once; the strict inequality guarantees no cycles, so the recursion terminates.",
      "The answer is `ways(1)`. Equivalently, process nodes in increasing dist order and accumulate counts, which is a topological evaluation of the same DAG. Use long arithmetic and reduce mod 10^9 + 7 on every addition.",
    ],
    approaches: [
      {
        name: "Dijkstra from n, then memoized DAG path count (optimal)",
        intuition: "Shortest distances to n orient the edges into a DAG; counting restricted paths is then a memoized sum over strictly-closer neighbors.",
        time: "O(E log V)",
        timeWhy: "Dijkstra dominates; the path-count DFS visits each node and edge once.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list, the dist and memo arrays, and the priority queue.",
        code: `int MOD = 1_000_000_007;
List<int[]>[] adj;
long[] dist;
Integer[] memo;
int countRestrictedPaths(int n, int[][] edges) {
    adj = new List[n + 1];
    for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
    for (int[] e : edges) {
        adj[e[0]].add(new int[]{e[1], e[2]});
        adj[e[1]].add(new int[]{e[0], e[2]});
    }
    dist = new long[n + 1];
    Arrays.fill(dist, Long.MAX_VALUE);
    dist[n] = 0;
    PriorityQueue<long[]> pq = new PriorityQueue<>((a, b) -> Long.compare(a[1], b[1]));
    pq.add(new long[]{n, 0});
    while (!pq.isEmpty()) {
        long[] cur = pq.poll();
        int u = (int) cur[0];
        long d = cur[1];
        if (d > dist[u]) continue;
        for (int[] e : adj[u]) {
            long nd = d + e[1];
            if (nd < dist[e[0]]) {
                dist[e[0]] = nd;
                pq.add(new long[]{e[0], nd});
            }
        }
    }
    memo = new Integer[n + 1];
    return dfs(1, n);
}
int dfs(int x, int n) {
    if (x == n) return 1;
    if (memo[x] != null) return memo[x];
    long total = 0;
    for (int[] e : adj[x]) {
        if (dist[e[0]] < dist[x]) {
            total = (total + dfs(e[0], n)) % MOD;
        }
    }
    memo[x] = (int) total;
    return memo[x];
}`,
        walkthrough: [
          "n=7, edges as given. Dijkstra from 7 yields dist[7]=0, dist[6]=2, dist[5]=3, dist[3]=4, dist[1]=5 (via 1-3-7 weights 1+4), and others larger.",
          "dfs(1): neighbors are 3 (dist 4 < 5) and 4 (dist larger, skip). So ways(1)=ways(3).",
          "dfs(3): neighbors with smaller dist: 7 (dist 0 < 4). ways(3)=ways(7)=1. (Node 1 has larger dist, skipped.)",
          "ways(1)=ways(3)=1. Answer 1 (the path 1 -> 3 -> 7).",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → node 1 is node n; ways(n)=1.",
      "Counts can overflow int, so accumulate in long and reduce mod 10^9 + 7 on each add.",
      "Distances must be long because edge weights up to 10^5 over many edges can exceed int range.",
    ],
    twists: [
      "**Strictly increasing instead of decreasing** → run Dijkstra from node 1 and reverse the inequality.",
      "**Count shortest restricted paths only** → combine with shortest-path counting from LeetCode 1976.",
      "**Longest restricted path length** → replace the sum with a max-plus-one DAG DP.",
    ],
    related: ["number-of-ways-to-arrive-at-destination", "network-delay-time", "cheapest-flights-within-k-stops"],
  },

  {
    slug: "find-closest-node-to-given-two-nodes",
    title: "Find Closest Node to Given Two Nodes",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 2359,
    statement:
      "You are given a **directed** graph of `n` nodes `0..n-1` where each node has **at most one** outgoing edge, given as `edges` with `edges[i]` the node that `i` points to (or `-1` if none). Given two start nodes `node1` and `node2`, find a node reachable from **both** such that the **maximum** of (distance from node1, distance from node2) to it is minimized. Return that node's index, or `-1` if no node is reachable from both. If several nodes tie, return the **smallest** index.",
    examples: [
      { in: "edges=[2,2,3,-1], node1=0, node2=1", out: "2", note: "node 2 is reachable from both with max distance 1" },
      { in: "edges=[1,2,-1], node1=0, node2=2", out: "2", note: "from 2 distance 0, from 0 distance 2; max is 2 and it is the only common node" },
    ],
    constraints: ["n == edges.length", "2 ≤ n ≤ 10^5", "-1 ≤ edges[i] < n", "edges[i] != i (no self-loops)", "0 ≤ node1, node2 < n"],
    recognize:
      "Each node has out-degree at most 1, so following edges from a start traces a single chain (a 'rho' that may end or loop) → two linear walks recording distances, then a sweep minimizing the max of the two distances.",
    figureItOut: [
      "Because every node points to at most one successor, walking forward from a start node visits a deterministic sequence until it hits -1 or revisits a node (a cycle). Record `dist1[x]` = steps from node1 to x for every x reachable from node1, marking unreached nodes with -1.",
      "Do the same independent walk from node2 to build `dist2[x]`. Both walks are linear because each visits every node at most once (stop when you would revisit, to avoid looping forever on a cycle).",
      "A node x is a valid meeting point iff `dist1[x] != -1 && dist2[x] != -1` (reachable from both). Its cost is `max(dist1[x], dist2[x])` — the worse of the two arrival times, since both travelers must arrive.",
      "Sweep all nodes 0..n-1, track the minimum cost and the smallest index achieving it (iterate in increasing index so the first node hitting a new best wins ties). Return that index, or -1 if no node is reachable from both.",
    ],
    approaches: [
      {
        name: "Two linear chain walks + min-of-max sweep (optimal)",
        intuition: "Out-degree one means each start traces one path; record both distance arrays, then pick the common node minimizing the larger distance.",
        time: "O(n)",
        timeWhy: "Two walks each visit at most n nodes, and a single final sweep over n nodes.",
        space: "O(n)",
        spaceWhy: "Two distance arrays of size n.",
        code: `int closestMeetingNode(int[] edges, int node1, int node2) {
    int n = edges.length;
    int[] dist1 = distances(edges, node1);
    int[] dist2 = distances(edges, node2);
    int best = -1, bestCost = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        if (dist1[i] != -1 && dist2[i] != -1) {
            int cost = Math.max(dist1[i], dist2[i]);
            if (cost < bestCost) {
                bestCost = cost;
                best = i;
            }
        }
    }
    return best;
}
int[] distances(int[] edges, int start) {
    int n = edges.length;
    int[] dist = new int[n];
    Arrays.fill(dist, -1);
    int cur = start, d = 0;
    while (cur != -1 && dist[cur] == -1) {
        dist[cur] = d;
        d++;
        cur = edges[cur];
    }
    return dist;
}`,
        walkthrough: [
          "edges=[2,2,3,-1], node1=0, node2=1. Walk from 0: dist1[0]=0, edges[0]=2 -> dist1[2]=1, edges[2]=3 -> dist1[3]=2, edges[3]=-1 stop. dist1=[0,-1,1,2].",
          "Walk from 1: dist2[1]=0, edges[1]=2 -> dist2[2]=1, edges[2]=3 -> dist2[3]=2, stop. dist2=[-1,0,1,2].",
          "Common nodes (both != -1): node 2 cost max(1,1)=1; node 3 cost max(2,2)=2.",
          "Minimum cost 1 at the smallest such index, node 2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "A cycle in the chain → the dist[cur]==-1 guard stops the walk on revisit, preventing infinite loops.",
      "No node reachable from both → return -1.",
      "Ties on cost are broken by smallest index because the sweep uses strict < and scans indices ascending.",
    ],
    twists: [
      "**Minimize the SUM of distances instead of the max** → change max to addition in the cost.",
      "**General out-degree (multiple outgoing edges)** → the single-chain trick fails; use BFS from each start.",
      "**Detect the cycle length** → useful for functional-graph problems like finding the longest cycle (LeetCode 2360).",
    ],
    related: ["find-eventual-safe-states", "find-if-path-exists-in-graph", "network-delay-time"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "find-unique-binary-string",
    title: "Find Unique Binary String",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 1980,
    statement:
      "Given an array `nums` of `n` **unique** binary strings each of length `n`, return any binary string of length `n` that does **not** appear in `nums`. There is always at least one such string.",
    examples: [
      { in: 'nums=["01","10"]', out: '"11"', note: 'any of "00" or "11" works' },
      { in: 'nums=["00","01"]', out: '"11"', note: '"10" or "11" also valid' },
      { in: 'nums=["111","011","001"]', out: '"101"', note: "any missing length-3 string" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 16", "nums[i].length == n", "each nums[i] is a binary string", "all strings in nums are unique"],
    recognize:
      "Construct a length-n binary string avoiding a forbidden set → either exhaustive **backtracking** over all 2^n candidates with early pruning, or the O(n) diagonal (Cantor) trick. Both are canonical here.",
    figureItOut: [
      "There are 2^n possible binary strings of length n, but only n are present in `nums`, so a missing one is guaranteed. The brute-force frame is a backtracking enumeration: build the candidate bit by bit and, when it is complete, check membership against a HashSet of nums.",
      "Backtracking choice tree: at each position append 0, recurse, undo, then append 1, recurse. When the string reaches length n, test it against the set; return it immediately if absent. Pruning: if you maintain the set of nums, you can stop as soon as a complete string is not in the set.",
      "The slick O(n) alternative is **Cantor diagonalization**: build the answer so its i-th bit DIFFERS from the i-th bit of `nums[i]`. Then the answer cannot equal `nums[i]` for any i (it disagrees at position i), so it is guaranteed missing.",
      "For the diagonal method: for each index i, take `nums[i].charAt(i)`; if it is 0 append 1 else append 0. The result differs from every listed string at its own index. Either approach returns a valid answer; the diagonal one is the optimal pick.",
    ],
    approaches: [
      {
        name: "Backtracking enumeration with set membership (baseline)",
        intuition: "Generate candidate strings bit by bit and return the first complete one not present in nums.",
        time: "O(2^n * n)",
        timeWhy: "Up to 2^n candidates, each of length n to build and hash.",
        space: "O(n * 2^n) worst",
        spaceWhy: "The HashSet of nums plus recursion depth n; in the worst case many candidates are tried.",
        code: `String findDifferentBinaryString(String[] nums) {
    Set<String> seen = new HashSet<>(Arrays.asList(nums));
    int n = nums.length;
    return backtrack(new StringBuilder(), n, seen);
}
String backtrack(StringBuilder sb, int n, Set<String> seen) {
    if (sb.length() == n) {
        String s = sb.toString();
        return seen.contains(s) ? null : s;
    }
    for (char bit = '0'; bit <= '1'; bit++) {
        sb.append(bit);
        String res = backtrack(sb, n, seen);
        if (res != null) return res;
        sb.deleteCharAt(sb.length() - 1);   // backtrack
    }
    return null;
}`,
      },
      {
        name: "Cantor diagonalization (optimal)",
        intuition: "Flip the i-th bit of the i-th string so the result disagrees with every input string at its own index, guaranteeing it is absent.",
        time: "O(n)",
        timeWhy: "One pass picking a single differing bit per index.",
        space: "O(n)",
        spaceWhy: "The output character buffer of length n.",
        code: `String findDifferentBinaryString(String[] nums) {
    int n = nums.length;
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) {
        // differ from nums[i] at position i
        sb.append(nums[i].charAt(i) == '0' ? '1' : '0');
    }
    return sb.toString();
}`,
        walkthrough: [
          'nums=["111","011","001"]. n=3.',
          "i=0: nums[0].charAt(0)='1' -> append '0'.",
          "i=1: nums[1].charAt(1)='1' -> append '0'.",
          "i=2: nums[2].charAt(2)='1' -> append '0'. Result \"000\".",
          'Check: "000" differs from "111" at 0, from "011" at 1, from "001" at 2, so it is missing. Answer "000" (any missing string is accepted).',
        ],
      },
    ],
    edgeCases: [
      "n == 1 → only two strings exist; one of nums is given, so the answer is the other bit.",
      "Diagonalization always succeeds because the result disagrees with nums[i] at index i for every i.",
      "Multiple valid answers exist; the judge accepts any string of length n not in nums.",
    ],
    twists: [
      "**Return the lexicographically smallest missing string** → the diagonal trick may not give it; enumerate in order instead.",
      "**Strings longer than n (more candidates)** → diagonalization still works only when count <= length; otherwise enumerate.",
      "**Find a missing number instead of string (e.g. Missing Number)** → bit/sum tricks replace the construction.",
    ],
    related: ["subsets", "letter-case-permutation", "permutations"],
  },

  {
    slug: "binary-watch",
    title: "Binary Watch",
    difficulty: "Easy",
    pattern: "backtracking",
    leetcode: 401,
    statement:
      "A binary watch has 4 LEDs for the hour (0-11) and 6 LEDs for the minutes (0-59), each LED representing a bit. Given an integer `turnedOn` (the number of LEDs that are lit), return **all possible times** the watch could show, as strings. Hours have no leading zero; minutes are always two digits (e.g. `\"1:08\"`). Return the times in any order.",
    examples: [
      { in: "turnedOn=1", out: '["0:01","0:02","0:04","0:08","0:16","0:32","1:00","2:00","4:00","8:00"]' },
      { in: "turnedOn=9", out: "[]", note: "no valid time has 9 lit LEDs within hour<12 and minute<60" },
    ],
    constraints: ["0 ≤ turnedOn ≤ 10"],
    recognize:
      "Enumerate every (hour, minute) and keep those whose total set-bit count equals `turnedOn` → a small **backtracking / enumeration** over the bounded clock space with a popcount check.",
    figureItOut: [
      "The full state space is tiny: 12 hours times 60 minutes = 720 combinations. The constraint is that the number of 1-bits in the hour plus the number of 1-bits in the minute equals `turnedOn`. So you can backtrack/enumerate over all valid times and filter by popcount.",
      "Cleanest enumeration: loop `h` from 0 to 11 and `m` from 0 to 59; if `Integer.bitCount(h) + Integer.bitCount(m) == turnedOn`, format the time and collect it. This is exhaustive search with a single feasibility test per leaf.",
      "Formatting: the hour prints with no leading zero; the minute prints as two digits, so pad a single-digit minute with a leading 0 (e.g. minute 8 becomes \"08\").",
      "The backtracking view: choose which of the 10 LED positions are on (a combination of `turnedOn` bits), decode the 4 hour bits and 6 minute bits, and keep the decoding only if hour < 12 and minute < 60. Both views produce the same set; the popcount loop is the simplest correct implementation.",
    ],
    approaches: [
      {
        name: "Enumerate all times, filter by popcount (optimal)",
        intuition: "Only 720 times exist; keep each one whose combined hour-and-minute bit count matches the number of lit LEDs.",
        time: "O(12 * 60)",
        timeWhy: "A constant 720 iterations, each doing O(1) bit counting and formatting.",
        space: "O(1) excluding output",
        spaceWhy: "Only the result list grows; no auxiliary structures.",
        code: `List<String> readBinaryWatch(int turnedOn) {
    List<String> result = new ArrayList<>();
    for (int h = 0; h < 12; h++) {
        for (int m = 0; m < 60; m++) {
            if (Integer.bitCount(h) + Integer.bitCount(m) == turnedOn) {
                String minute = m < 10 ? "0" + m : "" + m;
                result.add(h + ":" + minute);
            }
        }
    }
    return result;
}`,
        walkthrough: [
          "turnedOn=1. Need exactly one lit LED across hour and minute bits.",
          "h=0 (0 bits): minutes with exactly 1 bit are 1,2,4,8,16,32 -> 0:01,0:02,0:04,0:08,0:16,0:32.",
          "h with exactly 1 bit (1,2,4,8) and m=0 (0 bits): 1:00,2:00,4:00,8:00.",
          'All other (h,m) have bit total != 1. Collected list matches the expected 10 times.',
        ],
      },
    ],
    edgeCases: [
      "turnedOn == 0 → only 0:00 (all LEDs off).",
      "turnedOn >= 9 → impossible since max bits is bitCount(11)=3 plus bitCount(59)... actually max valid total is below 9, so the result is empty for 9 and 10.",
      "Minute formatting must zero-pad single digits so the output is always two-digit minutes.",
    ],
    twists: [
      "**Pure combinatorial generation** → choose turnedOn of the 10 LED positions via backtracking, then validate hour<12 and minute<60.",
      "**24-hour clock** → widen the hour range to 0-23 (needs 5 hour LEDs).",
      "**Count valid times instead of listing** → replace collection with a counter.",
    ],
    related: ["letter-combinations-of-a-phone-number", "subsets", "combinations"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "monotone-increasing-digits",
    title: "Monotone Increasing Digits",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 738,
    statement:
      "An integer has **monotone increasing digits** if each digit is less than or equal to the digit to its right. Given an integer `n`, return the **largest** number that is less than or equal to `n` and has monotone increasing digits.",
    examples: [
      { in: "n=10", out: "9" },
      { in: "n=1234", out: "1234", note: "already monotone increasing" },
      { in: "n=332", out: "299" },
    ],
    constraints: ["0 ≤ n ≤ 10^9"],
    recognize:
      "Find the largest monotone-increasing number not exceeding n → a **greedy** scan over the digits: at the first descent, drop the offending digit by one and flood everything to its right with 9s to stay maximal.",
    figureItOut: [
      "Work on the decimal digits. Scan left to right looking for the first place where a digit is **greater** than the one after it (a descent), e.g. in 332 the '3' at index 1 is greater than the '2' at index 2. That violation must be fixed by lowering a digit somewhere at or before it.",
      "Greedy fix: at the earliest descent, decrement the digit just before the drop by 1, and set every digit after that position to 9. The 9-flooding keeps the result as large as possible while guaranteeing monotonicity from that point on.",
      "But decrementing can create a NEW earlier descent (e.g. 332 -> after fixing index 1 you get 329, but the leading part may need to back up). The robust technique: find the leftmost index `marker` from which everything must become 9, by scanning right to left and moving the marker left whenever `digits[i-1] > digits[i]`.",
      "Concretely: scan i from the last digit down to 1; whenever `digits[i-1] > digits[i]`, decrement `digits[i-1]` and set `marker = i`. After the scan, set all digits from `marker` to the end to 9. The greedy is optimal because lowering the highest necessary place by one and maximizing the suffix yields the largest valid number.",
    ],
    approaches: [
      {
        name: "Right-to-left marker scan, then flood 9s (optimal)",
        intuition: "Walk from the right; each time a digit exceeds its successor, borrow one from it and remember to nine-fill everything after, propagating the borrow leftward.",
        time: "O(d)",
        timeWhy: "A constant number of passes over the d <= 10 digits of n.",
        space: "O(d)",
        spaceWhy: "A char array of the digits of n.",
        code: `int monotoneIncreasingDigits(int n) {
    char[] digits = Integer.toString(n).toCharArray();
    int marker = digits.length;   // from here on, flood with 9s
    for (int i = digits.length - 1; i > 0; i--) {
        if (digits[i - 1] > digits[i]) {
            digits[i - 1]--;       // borrow one from the higher place
            marker = i;            // everything from i onward becomes 9
        }
    }
    for (int i = marker; i < digits.length; i++) {
        digits[i] = '9';
    }
    return Integer.parseInt(new String(digits));
}`,
        walkthrough: [
          "n=332. digits=['3','3','2'], marker=3.",
          "i=2: digits[1]='3' > digits[2]='2' -> digits[1]-- = '2', marker=2. digits now ['3','2','2'].",
          "i=1: digits[0]='3' > digits[1]='2' -> digits[0]-- = '2', marker=1. digits now ['2','2','2'].",
          "Flood from marker=1: digits become ['2','9','9'] = 299. Answer 299.",
        ],
      },
    ],
    edgeCases: [
      "n already monotone (e.g. 1234) → no descent found, marker stays at length, nothing changes.",
      "Leading borrow can produce a leading zero conceptually (e.g. n=10 -> 09), but parseInt yields 9 correctly.",
      "Single-digit n (0-9) → already monotone, returned unchanged.",
    ],
    twists: [
      "**Largest STRICTLY increasing digits** → the comparison and 9-flood change since equal adjacent digits become illegal.",
      "**Smallest number >= n with monotone digits** → mirror the greedy upward instead of downward.",
      "**Monotone non-increasing variant** → reverse the inequality and flood with 0s.",
    ],
    related: ["remove-k-digits", "non-decreasing-array", "candy"],
  },

  {
    slug: "dota2-senate",
    title: "Dota2 Senate",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 649,
    statement:
      "In the Dota2 senate, each senator belongs to the Radiant `R` party or the Dire `D` party, given in order as a string `senate`. In each round, every senator in order may exercise one right: **ban** the voting right of one senator from the other party (that senator is out for the rest of the game), or, if a senator with rights is reached and all remaining active senators are from the same party, that party **declares victory**. Senators act in the original order, looping round after round, skipping anyone already banned. Return `\"Radiant\"` or `\"Dire\"` — the party that wins.",
    examples: [
      { in: 'senate="RD"', out: '"Radiant"', note: "the first R bans the D, so only R remains" },
      { in: 'senate="RDD"', out: '"Dire"', note: "R bans one D, the surviving D bans R, leaving only D" },
    ],
    constraints: ["1 ≤ senate.length ≤ 10^4", "senate consists only of the characters R and D", "at least one senator of each party initially (otherwise the present party wins)"],
    recognize:
      "Each active senator greedily bans the **next** opposing senator who would otherwise act → simulate with two queues of indices; whichever party still has a senator that can act first each round survives.",
    figureItOut: [
      "The optimal move for any senator is to ban the **soonest-acting** opponent — the opponent whose turn comes next — because that opponent is the immediate threat. So the order of who acts matters, and we process senators by their original index, looping.",
      "Model with two FIFO queues holding the indices of active Radiant senators and active Dire senators. The senator with the smaller front index acts first and bans the other party's front senator.",
      "When index `r` (Radiant front) is smaller than `d` (Dire front), Radiant acts first and bans that Dire senator (pop the Dire queue). The acting Radiant senator survives this round and will act again next round, so re-enqueue it with index `r + n` (its turn in the following round).",
      "Symmetrically, if `d < r`, Dire bans the Radiant front and re-enqueues itself at `d + n`. Repeat until one queue is empty: that empty party has no senators left, so the other party wins. The +n trick preserves relative round order across loops.",
    ],
    approaches: [
      {
        name: "Two index queues, ban-the-next-opponent simulation (optimal)",
        intuition: "Whoever acts earliest bans the opponent who would act soonest, then rejoins the queue one round later; the party that runs out of senators loses.",
        time: "O(n)",
        timeWhy: "Each senator is enqueued at most a bounded number of times; total ban operations is O(n).",
        space: "O(n)",
        spaceWhy: "Two queues holding at most n senator indices combined.",
        code: `String predictPartyVictory(String senate) {
    int n = senate.length();
    Deque<Integer> radiant = new ArrayDeque<>();
    Deque<Integer> dire = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        if (senate.charAt(i) == 'R') radiant.add(i);
        else dire.add(i);
    }
    while (!radiant.isEmpty() && !dire.isEmpty()) {
        int r = radiant.poll();
        int d = dire.poll();
        if (r < d) {
            radiant.add(r + n);   // R acts first, bans this D, returns next round
        } else {
            dire.add(d + n);      // D acts first, bans this R, returns next round
        }
    }
    return radiant.isEmpty() ? "Dire" : "Radiant";
}`,
        walkthrough: [
          'senate="RDD", n=3. radiant=[0], dire=[1,2].',
          "Round: r=0, d=1. r<d -> R bans D at index1, R re-enqueued at 0+3=3. radiant=[3], dire=[2].",
          "Next: r=3, d=2. d<r -> D bans R, D re-enqueued at 2+3=5. radiant=[], dire=[5].",
          "radiant empty -> return Dire. Answer Dire.",
        ],
      },
    ],
    edgeCases: [
      "All senators from one party → that party trivially wins (the other queue starts empty).",
      "The +n re-enqueue keeps the surviving senator after every still-waiting senator of the current round, correctly modeling the round-by-round loop.",
      "Long alternating strings still terminate because every round removes exactly one senator.",
    ],
    twists: [
      "**Three or more parties** → the two-queue model generalizes to a priority structure over party fronts.",
      "**A senator may ban any opponent (not just the next)** → optimal play still bans the soonest threat, so the queue model holds.",
      "**Count rounds until victory** → tag each enqueue with a round number and track the maximum.",
    ],
    related: ["jump-game", "gas-station", "remove-k-digits"],
  },
];
