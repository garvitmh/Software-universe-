// NeetCode All / Top Interview 150 / LeetCode 75 / Grind 75 — wave 18c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave17c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE18C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "largest-divisible-subset",
    title: "Largest Divisible Subset",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 368,
    statement:
      "Given a set of **distinct** positive integers `nums`, return the **largest subset** `answer` such that every pair `(answer[i], answer[j])` in it satisfies either `answer[i] % answer[j] == 0` or `answer[j] % answer[i] == 0`. If there are multiple largest subsets, return **any** of them.",
    examples: [
      { in: "nums=[1,2,3]", out: "[1,2] (or [1,3])", note: "1 divides 2 and 1 divides 3, but 2 and 3 do not divide each other" },
      { in: "nums=[1,2,4,8]", out: "[1,2,4,8]", note: "a full divisibility chain: each divides the next" },
    ],
    constraints: ["1 ≤ nums.length ≤ 1000", "1 ≤ nums[i] ≤ 2 * 10^9", "all integers in nums are distinct"],
    recognize:
      "A subset where every pair is divisibility-comparable is exactly a divisibility CHAIN once sorted → sort ascending, then it is the Longest Increasing Subsequence pattern with the test changed from < to divides, a 1-D DP plus a parent pointer to rebuild.",
    figureItOut: [
      "Key insight: if the numbers are sorted ascending, then in any valid subset every smaller element must divide every larger one. And divisibility is transitive — if a divides b and b divides c then a divides c. So a valid subset, when sorted, is a chain where each element divides the next; checking only adjacent divisibility suffices, which turns this into Longest Increasing Subsequence with divides in place of less-than.",
      "**State**: after sorting, `dp[i]` = the length of the longest divisible chain that ENDS at index i (using nums[i] as its largest element). A companion array `prev[i]` stores the index of the previous element in that best chain so the actual subset can be reconstructed.",
      "**Recurrence**: `dp[i] = 1 + max(dp[j])` over all `j < i` with `nums[i] % nums[j] == 0`; set `prev[i] = j` for the j achieving that max. If no such j exists, the chain is just nums[i] itself.",
      "**Base case**: `dp[i] = 1` for every i (each element alone is a chain of length 1) and `prev[i] = -1` (no predecessor).",
      "**Fill**: sort nums ascending; for i from 0 to n-1 scan all j < i. Track the index with the overall maximum dp value; then walk the `prev` pointers backward from that index to rebuild the subset (reverse it for ascending order).",
    ],
    approaches: [
      {
        name: "Sort + LIS-style divisibility DP with parent pointers (optimal)",
        intuition: "Sorting makes a valid subset a divisibility chain; the longest such chain ending at each element is LIS where the comparison is divisibility, and parent pointers rebuild the winning chain.",
        time: "O(n^2)",
        timeWhy: "Sorting is O(n log n); the double loop over all pairs dominates at O(n^2).",
        space: "O(n)",
        spaceWhy: "The dp and prev arrays plus the rebuilt answer list.",
        code: `List<Integer> largestDivisibleSubset(int[] nums) {
    int n = nums.length;
    Arrays.sort(nums);
    int[] dp = new int[n];
    int[] prev = new int[n];
    Arrays.fill(dp, 1);
    Arrays.fill(prev, -1);
    int bestIdx = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] % nums[j] == 0 && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                prev[i] = j;
            }
        }
        if (dp[i] > dp[bestIdx]) bestIdx = i;
    }
    List<Integer> result = new ArrayList<>();
    for (int k = bestIdx; k != -1; k = prev[k]) {
        result.add(nums[k]);
    }
    Collections.reverse(result);
    return result;
}`,
        walkthrough: [
          "nums=[1,2,4,8] (already sorted). dp=[1,1,1,1], prev=[-1,-1,-1,-1].",
          "i=1 (2): j=0 (1) 2%1==0 dp[0]+1=2>1 -> dp[1]=2, prev[1]=0. bestIdx=1.",
          "i=2 (4): j=0 (1) -> dp=2; j=1 (2) 4%2==0 dp[1]+1=3>2 -> dp[2]=3, prev[2]=1. bestIdx=2.",
          "i=3 (8): j=0 -> 2; j=1 (2) 8%2==0 dp[1]+1=3; j=2 (4) 8%4==0 dp[2]+1=4 -> dp[3]=4, prev[3]=2. bestIdx=3.",
          "Rebuild from 3: 8 -> prev2 -> 4 -> prev1 -> 2 -> prev0 -> 1 -> -1. Reverse -> [1,2,4,8]. Answer [1,2,4,8].",
        ],
      },
    ],
    edgeCases: [
      "Single element → the subset is just that element, length 1.",
      "No two elements divide each other (e.g. distinct primes) → any single element is a valid largest subset of size 1.",
      "1 is present → it divides everything, so it can always start a chain.",
    ],
    twists: [
      "**Return only the length** → skip the prev array and just track the maximum dp value.",
      "**Count of largest subsets** → add a count array alongside dp, mirroring number-of-longest-increasing-subsequence.",
      "**Allow duplicates** → would break the strict chain assumption; the problem guarantees distinct values.",
    ],
    related: ["longest-increasing-subsequence", "number-of-longest-increasing-subsequence", "maximum-product-subarray"],
  },

  {
    slug: "longest-turbulent-subarray",
    title: "Longest Turbulent Subarray",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 978,
    statement:
      "A subarray `arr[i..j]` is **turbulent** if the comparison sign between each pair of adjacent elements **flips** along the subarray — i.e. for every interior index the relation alternates between `<` and `>` (no two consecutive comparisons have the same direction, and no adjacent pair is equal). Given an integer array `arr`, return the **length of the longest turbulent subarray**.",
    examples: [
      { in: "arr=[9,4,2,10,7,8,8,1,9]", out: "5", note: "the subarray [4,2,10,7,8] alternates >,< ,>,< -> length 5" },
      { in: "arr=[4,8,12,16]", out: "2", note: "strictly increasing never alternates; best is any adjacent pair" },
      { in: "arr=[100]", out: "1", note: "a single element is trivially turbulent" },
    ],
    constraints: ["1 ≤ arr.length ≤ 4 * 10^4", "0 ≤ arr[i] ≤ 10^9"],
    recognize:
      "Longest run whose adjacent comparison signs alternate → a 1-D DP tracking two values at each index: the longest turbulent run ending here with the LAST comparison being up, and the one ending here with the last comparison being down.",
    figureItOut: [
      "Walk left to right. At each new element the only thing that matters for extending a turbulent run is the direction of the LAST comparison (was arr[i-1] < arr[i] or arr[i-1] > arr[i]). A run continues if the new comparison direction is the OPPOSITE of the previous one.",
      "**State**: at index i keep two scalars — `up[i]` = length of the longest turbulent subarray ending at i where arr[i-1] < arr[i] (an up-step lands here), and `down[i]` = length ending at i where arr[i-1] > arr[i] (a down-step lands here). Only the previous i-1 values are needed, so two rolling ints suffice.",
      "**Recurrence**: if arr[i] > arr[i-1] then `up = down_prev + 1` (we just made an up-step, so the prior step must have been a down) and `down = 1` (a down-ending run cannot end with an up-step, restart). If arr[i] < arr[i-1] then `down = up_prev + 1` and `up = 1`. If arr[i] == arr[i-1] then both reset to 1 (equal breaks turbulence).",
      "**Base case**: `up = down = 1` at index 0 (a single element is a turbulent run of length 1).",
      "**Fill**: sweep i from 1 to n-1 updating up/down from their previous values, tracking the running maximum of both. The answer is that maximum (at least 1).",
    ],
    approaches: [
      {
        name: "Two-state rolling DP: up-ending vs down-ending runs (optimal)",
        intuition: "A turbulent run is extended only by flipping the comparison direction; track the best run ending in an up-step and the best ending in a down-step, swapping which grows each step.",
        time: "O(n)",
        timeWhy: "One linear pass with O(1) work per element.",
        space: "O(1)",
        spaceWhy: "Two rolling integer states plus a maximum tracker.",
        code: `int maxTurbulenceSize(int[] arr) {
    int n = arr.length;
    int up = 1, down = 1, best = 1;
    for (int i = 1; i < n; i++) {
        if (arr[i] > arr[i - 1]) {
            up = down + 1;     // up-step extends a previously down-ending run
            down = 1;
        } else if (arr[i] < arr[i - 1]) {
            down = up + 1;     // down-step extends a previously up-ending run
            up = 1;
        } else {
            up = 1;            // equal neighbors break turbulence
            down = 1;
        }
        best = Math.max(best, Math.max(up, down));
    }
    return best;
}`,
        walkthrough: [
          "arr=[9,4,2,10,7,8,8,1,9]. Start up=1,down=1,best=1.",
          "i=1 (4<9): down=up+1=2, up=1. best=2. i=2 (2<4): down=up+1=2, up=1. best=2.",
          "i=3 (10>2): up=down+1=3, down=1. best=3. i=4 (7<10): down=up+1=4, up=1. best=4.",
          "i=5 (8>7): up=down+1=5, down=1. best=5. i=6 (8==8): up=1,down=1. i=7 (1<8): down=up+1=2,up=1. i=8 (9>1): up=down+1=3.",
          "Final best=5. Answer 5.",
        ],
      },
    ],
    edgeCases: [
      "Single element → answer 1 (the base case).",
      "All equal elements → every comparison is equal, so the answer is 1.",
      "Strictly monotone array → no alternation, best is 2 (any adjacent pair).",
    ],
    twists: [
      "**Longest run with the same sign (monotone)** → drop the flip and track a single increasing/decreasing run length.",
      "**Allow one equality** → add a state that has spent its single allowed flat step.",
      "**Return the actual subarray** → track the start index when a run resets.",
    ],
    related: ["wiggle-subsequence", "maximum-subarray", "longest-increasing-subsequence"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "minimum-insertion-steps-to-make-a-string-palindrome",
    title: "Minimum Insertion Steps to Make a String Palindrome",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1312,
    statement:
      "Given a string `s`, in one step you may **insert any single character at any position** in `s`. Return the **minimum number of insertions** needed to make `s` a **palindrome** (reads the same forwards and backwards).",
    examples: [
      { in: 's="zzazz"', out: "0", note: "already a palindrome" },
      { in: 's="mbadm"', out: "2", note: 'e.g. "mbdadbm" or "mdbabdm" after two insertions' },
      { in: 's="leetcode"', out: "5", note: 'five insertions, e.g. "leetcodocteel"' },
    ],
    constraints: ["1 ≤ s.length ≤ 500", "s consists of lowercase English letters only"],
    recognize:
      "Fewest insertions to reach a palindrome → the characters you never need to mirror are exactly the Longest Palindromic Subsequence; insertions = n - LPS(s). Solve LPS as a 2-D interval DP over substrings (equivalently LCS of s and reverse(s)).",
    figureItOut: [
      "Every character that already participates in a palindromic subsequence needs no partner inserted; every other character must have a matching copy inserted on the opposite side. So the answer is `n - (length of the Longest Palindromic Subsequence of s)` — and we compute LPS directly with an interval DP.",
      "**State**: `dp[i][j]` = the minimum insertions needed to make the substring `s[i..j]` (inclusive) a palindrome. The two moving indices are the left and right ends of the substring under consideration.",
      "**Recurrence**: if `s[i] == s[j]` the ends already match, so `dp[i][j] = dp[i+1][j-1]` (no extra insertion for these ends). Otherwise we must insert a mirror of one end: `dp[i][j] = 1 + min(dp[i+1][j], dp[i][j-1])` (fix the left character by mirroring it, or the right).",
      "**Base case**: `dp[i][i] = 0` (a single character is already a palindrome) and any empty range contributes 0. These are the i == j and i > j cells.",
      "**Fill**: because dp[i][j] depends on shorter inner ranges (i+1, j-1, etc.), iterate i from n-1 down to 0 and j from i+1 up to n-1 (increasing substring length). The answer is `dp[0][n-1]`.",
    ],
    approaches: [
      {
        name: "Interval DP over substrings (optimal)",
        intuition: "Match the outer characters when equal (free), otherwise pay one insertion to mirror an end and shrink the range; the answer is the cost for the whole string.",
        time: "O(n^2)",
        timeWhy: "Every (i, j) substring pair is filled once with O(1) work.",
        space: "O(n^2)",
        spaceWhy: "A 2-D dp table over all substring endpoints.",
        code: `int minInsertions(String s) {
    int n = s.length();
    int[][] dp = new int[n][n];
    // dp[i][i] = 0 is the default zero-initialization
    for (int i = n - 1; i >= 0; i--) {
        for (int j = i + 1; j < n; j++) {
            if (s.charAt(i) == s.charAt(j)) {
                dp[i][j] = dp[i + 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp[0][n - 1];
}`,
        walkthrough: [
          's="mbadm", n=5. Indices m0 b1 a2 d3 m4. All length-1 ranges dp=0.',
          "Length 2: dp[0][1](m,b) ne -> 1+min(dp[1][1],dp[0][0])=1. dp[1][2](b,a)=1. dp[2][3](a,d)=1. dp[3][4](d,m)=1.",
          "Length 3: dp[0][2](m,a) ne -> 1+min(dp[1][2]=1,dp[0][1]=1)=2. dp[1][3](b,d)=2. dp[2][4](a,m)=2.",
          "Length 4: dp[0][3](m,d) ne -> 1+min(dp[1][3]=2,dp[0][2]=2)=3. dp[1][4](b,m) ne -> 1+min(dp[2][4]=2,dp[1][3]=2)=3.",
          "Length 5: dp[0][4](m,m) eq -> dp[1][3]=2. Answer dp[0][4]=2.",
        ],
      },
    ],
    edgeCases: [
      "Already a palindrome → every outer pair matches, dp[0][n-1] = 0.",
      "Single character → n == 1, dp is 0.",
      "No repeated characters → worst case n-1 insertions (only one character is the eventual center).",
    ],
    twists: [
      "**Minimum DELETIONS to make a palindrome** → identical value, since deletions also equal n - LPS.",
      "**LCS formulation** → minInsertions = n - LCS(s, reverse(s)); same answer via a different 2-D table.",
      "**Space optimization** → roll the interval DP to two rows since each length depends only on the previous.",
    ],
    related: ["longest-palindromic-subsequence", "longest-common-subsequence", "edit-distance"],
  },

  {
    slug: "where-will-the-ball-fall",
    title: "Where Will the Ball Fall",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1706,
    statement:
      "You have a 2-D `grid` of size `m x n` representing a box, and `n` balls dropped — one into each column from the top. Each cell holds a diagonal board: `grid[i][j] == 1` redirects a ball to the **right** (a board spanning top-left to bottom-right), and `grid[i][j] == -1` redirects it to the **left**. A ball gets **stuck** (returns `-1`) if it is redirected into a wall, or if two adjacent boards form a `V` that traps it. Return an array `answer` where `answer[j]` is the **column the ball dropped in column j exits at the bottom**, or `-1` if it gets stuck.",
    examples: [
      { in: "grid=[[1,1,1,-1,-1],[1,1,1,-1,-1],[-1,-1,-1,1,1],[1,1,1,1,-1],[-1,-1,-1,-1,-1]]", out: "[1,-1,-1,-1,-1]", note: "only the first ball makes it through, exiting at column 1" },
      { in: "grid=[[-1]]", out: "[-1]", note: "single cell pushes the ball left into the wall -> stuck" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 100", "grid[i][j] is 1 or -1"],
    recognize:
      "Trace each ball through diagonal boards row by row → a 2-D simulation that is naturally a DP over (row, column): a ball at column c in row i moves to column c + grid[i][c], but only survives if its neighbor board points the same way (no V-trap and no wall).",
    figureItOut: [
      "A board grid[i][c] = 1 sends the ball down-right to column c+1; grid[i][c] = -1 sends it down-left to column c-1. The ball is trapped in two cases: it would leave the box sideways (c+1 == n for a right board, or c-1 < 0 for a left board), or the neighbor board in the SAME row points back toward it forming a V (right board at c but the cell at c+1 is a left board, or vice versa).",
      "**State**: think of `pos(i, c)` = the column a ball occupies when it ENTERS row i, dropped originally so that it is currently at column c at the top of row i. The DP advances row by row: from row i column c we compute the column at the top of row i+1, or mark it stuck (-1).",
      "**Recurrence**: let `d = grid[i][c]` (the move direction +1 or -1) and `next = c + d`. The ball survives row i only if `next` is in [0, n-1] AND `grid[i][next] == d` (the neighbor board agrees, no V). If it survives, its column entering row i+1 is `next`; otherwise the answer for that ball is -1 and it stops.",
      "**Base case**: each ball j starts at row 0 column j. A ball that survives all m rows exits at whatever column it holds after row m-1; that column is the answer.",
      "**Fill**: for each starting column j, iterate rows 0..m-1 applying the recurrence; the per-ball columns are independent, so this is m * n total work. Store the exit column or -1 in answer[j].",
    ],
    approaches: [
      {
        name: "Per-ball row-by-row simulation with V-trap check (optimal)",
        intuition: "Drop each ball and slide it one row at a time; a board moves it left or right, but only if the adjacent board agrees does it pass — otherwise it is trapped.",
        time: "O(m * n)",
        timeWhy: "Each of n balls is traced through at most m rows with O(1) work per row.",
        space: "O(1)",
        spaceWhy: "Beyond the output array, only a current-column variable per ball.",
        code: `int[] findBall(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] answer = new int[n];
    for (int start = 0; start < n; start++) {
        int col = start;
        for (int row = 0; row < m; row++) {
            int dir = grid[row][col];          // +1 = right, -1 = left
            int next = col + dir;
            if (next < 0 || next >= n || grid[row][next] != dir) {
                col = -1;                      // hit a wall or a V-trap
                break;
            }
            col = next;
        }
        answer[start] = col;
    }
    return answer;
}`,
        walkthrough: [
          "Take the single-cell grid=[[-1]], m=1, n=1, start=0.",
          "row=0: dir=grid[0][0]=-1, next=0+(-1)=-1. next<0 -> wall, col=-1, break.",
          "answer[0]=-1. Returns [-1].",
          "For the larger example, ball started in column 0 survives: it steps right each row where the right neighbor also points right, ultimately exiting at column 1, while balls 1..4 each hit a wall or a V and return -1, giving [1,-1,-1,-1,-1].",
        ],
      },
    ],
    edgeCases: [
      "Single column (n = 1) → every ball is pushed into a wall immediately, all answers -1.",
      "A V-trap: a 1 immediately left of a -1 in the same row traps any ball entering either cell.",
      "A board pointing right in the last column, or left in the first column, sends the ball into the wall.",
    ],
    twists: [
      "**Count how many balls escape** → tally the non -1 entries.",
      "**Track the full path of a ball** → record each (row, col) instead of only the exit.",
      "**Memoize exit column by (row, col)** → reuse shared suffix paths if many balls converge.",
    ],
    related: ["unique-paths", "minimum-path-sum", "number-of-islands"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "jump-game-iii",
    title: "Jump Game III",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1306,
    statement:
      "Given an array of non-negative integers `arr` and a starting index `start`, you are initially standing at `arr[start]`. From any index `i` you may jump to `i + arr[i]` or `i - arr[i]` (staying within bounds). Return `true` if you can reach **any** index whose value is `0`, otherwise `false`. Note you cannot jump outside the array at any time.",
    examples: [
      { in: "arr=[4,2,3,0,3,1,2], start=5", out: "true", note: "5 -> 4 (5-1) -> 1 (4-3)... or 5 -> 6 -> 4 -> 1 -> 3 reaches a 0" },
      { in: "arr=[4,2,3,0,3,1,2], start=0", out: "true", note: "0 -> 4 (0+4) -> 1 (4-3) -> 3 (1+2) value 0" },
      { in: "arr=[3,0,2,1,2], start=2", out: "false", note: "from index 2 you oscillate and can never land on the single 0 at index 1" },
    ],
    constraints: ["1 ≤ arr.length ≤ 5 * 10^4", "0 ≤ arr[i] < arr.length", "0 ≤ start < arr.length"],
    recognize:
      "Each index is a node with directed edges to i+arr[i] and i-arr[i]; the question is whether a value-0 node is reachable from start → a plain BFS/DFS graph reachability search with a visited set to avoid cycles.",
    figureItOut: [
      "Model the array as a graph: index i is a node, and it has up to two outgoing edges — to i + arr[i] and to i - arr[i] — whenever those land inside the array. Reaching a zero is just asking whether any index with arr[index] == 0 is reachable from start.",
      "Run BFS (or DFS) from start. Mark indices visited as you dequeue them so you never revisit; revisiting cannot help and would loop forever on cycles.",
      "When you pop an index whose value is 0, return true immediately. Otherwise push its two in-bounds neighbors if they are unvisited.",
      "If the search drains the queue without ever standing on a zero, no zero is reachable, so return false. Each index is enqueued at most once, giving linear time.",
    ],
    approaches: [
      {
        name: "BFS reachability over the jump graph (optimal)",
        intuition: "Indices are nodes with two jump-edges each; a standard visited-guarded BFS from start checks if any zero-valued index is reachable.",
        time: "O(n)",
        timeWhy: "Each index is visited at most once and explores two constant neighbors.",
        space: "O(n)",
        spaceWhy: "The visited array and the BFS queue, each up to n entries.",
        code: `boolean canReach(int[] arr, int start) {
    int n = arr.length;
    boolean[] visited = new boolean[n];
    Deque<Integer> queue = new ArrayDeque<>();
    queue.add(start);
    visited[start] = true;
    while (!queue.isEmpty()) {
        int i = queue.poll();
        if (arr[i] == 0) return true;
        int forward = i + arr[i];
        int backward = i - arr[i];
        if (forward < n && !visited[forward]) {
            visited[forward] = true;
            queue.add(forward);
        }
        if (backward >= 0 && !visited[backward]) {
            visited[backward] = true;
            queue.add(backward);
        }
    }
    return false;
}`,
        walkthrough: [
          "arr=[4,2,3,0,3,1,2], start=0. Queue [0], visited{0}.",
          "Pop 0, arr=4 ne 0. forward 0+4=4 add, backward -4 skip. Queue [4], visited{0,4}.",
          "Pop 4, arr=3. forward 7 out of bounds skip, backward 4-3=1 add. Queue [1], visited{0,4,1}.",
          "Pop 1, arr=2. forward 1+2=3 add, backward -1 skip. Queue [3]. Pop 3, arr[3]=0 -> return true.",
        ],
      },
    ],
    edgeCases: [
      "start already on a zero → return true immediately.",
      "No zero anywhere in arr → always false.",
      "Cycles among nonzero indices → the visited set prevents infinite looping.",
    ],
    twists: [
      "**Minimum number of jumps to a zero** → BFS level count gives the shortest distance.",
      "**Jump Game IV (reach the last index via equal-value teleports)** → add edges between equal values, a richer graph.",
      "**DFS recursion with visited** → equivalent reachability without an explicit queue.",
    ],
    related: ["jump-game", "rotting-oranges", "open-the-lock"],
  },

  {
    slug: "bus-routes",
    title: "Bus Routes",
    difficulty: "Hard",
    pattern: "graphs",
    leetcode: 815,
    statement:
      "You are given `routes` where `routes[i]` is the list of bus stops the i-th bus repeats forever in a loop. You start at bus stop `source` and want to reach bus stop `target`, traveling only by buses. Return the **least number of buses** you must take to get from `source` to `target`, or `-1` if it is impossible. (You may board and ride any bus on its route in either direction along the loop.)",
    examples: [
      { in: "routes=[[1,2,7],[3,6,7]], source=1, target=6", out: "2", note: "take bus 0 from stop 1 to stop 7, then bus 1 from stop 7 to stop 6" },
      { in: "routes=[[7,12],[4,5,15],[6],[15,19],[9,12,13]], source=15, target=12", out: "-1", note: "no chain of shared stops links 15 to 12" },
    ],
    constraints: ["1 ≤ routes.length ≤ 500", "1 ≤ sum(routes[i].length) ≤ 10^5", "all stops within a route are unique", "0 ≤ routes[i][j] < 10^6", "0 ≤ source, target < 10^6"],
    recognize:
      "Fewest BUSES (not stops) connecting source to target → BFS where the nodes are BUSES (routes) and two buses are adjacent if they share a stop; build a stop-to-buses map and BFS over buses, counting bus-boardings as levels.",
    figureItOut: [
      "The cost we minimize is the number of buses taken, so make the BUSES the BFS nodes, not the stops. Two buses are connected if their routes share at least one stop (you can transfer between them there).",
      "Build a map `stopToBuses` from each stop to the list of bus indices serving it. Seed the BFS with every bus that serves `source` (boarding it counts as 1 bus). The BFS distance to a bus = number of buses ridden to be aboard it.",
      "BFS over buses: when processing a bus, look at every stop on its route; if `target` is among them, return the current bus count. Otherwise, for each stop, enqueue every not-yet-ridden bus that also serves that stop (a transfer), incrementing the bus count by one level.",
      "Mark buses visited so each route is expanded once. If source == target the answer is 0 (no bus needed). If the queue empties without reaching a bus that covers target, return -1. Visiting stops once each via a 'used stop' set keeps it linear in total route length.",
    ],
    approaches: [
      {
        name: "BFS over buses connected by shared stops (optimal)",
        intuition: "Treat each bus as a node, link buses that share a stop, and BFS from the buses at the source; the level at which a bus covering the target is found is the minimum number of buses.",
        time: "O(S + B^2 worst) ~ O(total stops)",
        timeWhy: "Each stop is keyed once into the map; each bus is expanded once, scanning its stops and the buses sharing them, bounded by total route length.",
        space: "O(total stops)",
        spaceWhy: "The stop-to-buses map, the visited-bus set, and the BFS queue.",
        code: `int numBusesToDestination(int[][] routes, int source, int target) {
    if (source == target) return 0;
    Map<Integer, List<Integer>> stopToBuses = new HashMap<>();
    for (int bus = 0; bus < routes.length; bus++) {
        for (int stop : routes[bus]) {
            stopToBuses.computeIfAbsent(stop, k -> new ArrayList<>()).add(bus);
        }
    }
    Deque<Integer> queue = new ArrayDeque<>();
    boolean[] usedBus = new boolean[routes.length];
    Set<Integer> usedStop = new HashSet<>();
    for (int bus : stopToBuses.getOrDefault(source, new ArrayList<>())) {
        queue.add(bus);
        usedBus[bus] = true;
    }
    int buses = 1;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            int bus = queue.poll();
            for (int stop : routes[bus]) {
                if (stop == target) return buses;
                if (usedStop.add(stop)) {
                    for (int next : stopToBuses.get(stop)) {
                        if (!usedBus[next]) {
                            usedBus[next] = true;
                            queue.add(next);
                        }
                    }
                }
            }
        }
        buses++;
    }
    return -1;
}`,
        walkthrough: [
          "routes=[[1,2,7],[3,6,7]], source=1, target=6. stopToBuses: 1->[0],2->[0],7->[0,1],3->[1],6->[1].",
          "Seed: buses serving source 1 -> bus 0. Queue [0], usedBus{0}. buses=1.",
          "Level buses=1: pop bus 0, stops 1,2,7. None is target 6. Mark stops; stop 7 links bus 1 (unused) -> enqueue. Queue [1]. buses=2.",
          "Level buses=2: pop bus 1, stops 3,6,7. stop 6 == target -> return buses=2.",
        ],
      },
    ],
    edgeCases: [
      "source == target → 0 buses needed before any BFS.",
      "target unreachable (disconnected bus network) → returns -1.",
      "Buses are the nodes, not stops — using stops as nodes would count transfers wrong.",
    ],
    twists: [
      "**Minimum number of STOPS traveled** → a different graph with stops as nodes weighted by ride length.",
      "**Limited transfers k** → stop expanding once the bus count exceeds k.",
      "**Bidirectional BFS** → search from source-buses and target-buses simultaneously for speed.",
    ],
    related: ["word-ladder", "open-the-lock", "rotting-oranges"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "critical-connections-in-a-network",
    title: "Critical Connections in a Network",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 1192,
    statement:
      "There are `n` servers numbered `0..n-1` connected by undirected `connections` where `connections[i] = [a, b]` is a link between servers a and b. A **critical connection** is an edge that, if removed, would disconnect some servers from others (a **bridge**). Return **all critical connections** in any order.",
    examples: [
      { in: "n=4, connections=[[0,1],[1,2],[2,0],[1,3]]", out: "[[1,3]]", note: "edges 0-1,1-2,2-0 form a cycle (none critical); only 1-3 is a bridge" },
      { in: "n=2, connections=[[0,1]]", out: "[[0,1]]", note: "the lone edge is a bridge" },
    ],
    constraints: ["2 ≤ n ≤ 10^5", "n - 1 ≤ connections.length ≤ 10^5", "0 ≤ a, b ≤ n - 1", "a != b", "no repeated connections", "the graph is connected"],
    recognize:
      "Find all bridges of an undirected graph → **Tarjan's bridge-finding DFS**: assign each node a discovery time and a low-link (earliest reachable ancestor); an edge (u, v) is a bridge when low[v] > disc[u], meaning v cannot reach u or above without that edge.",
    figureItOut: [
      "A bridge is an edge whose removal increases the number of connected components. Tarjan's algorithm finds all bridges in one DFS using two timestamps per node: `disc[u]` = the time u was first discovered, and `low[u]` = the smallest discovery time reachable from u using tree edges plus at most one back edge.",
      "DFS from any node. When you first visit u, set `disc[u] = low[u] = timer++`. For each neighbor v: if v is unvisited, recurse into it (a tree edge), then relax `low[u] = min(low[u], low[v])`. If v is already visited and is not the parent edge you came from, it is a back edge, so relax `low[u] = min(low[u], disc[v]).`",
      "After returning from a child v, test the bridge condition: if `low[v] > disc[u]`, then the only way for the subtree rooted at v to reach u or anything above u is through the edge (u, v) — so that edge is a bridge. Record it.",
      "Guard against using the single parent edge as a back edge (skip the first occurrence of the parent), but allow genuine parallel/back edges. Since the graph is connected, one DFS from node 0 reaches every node; the collected (u, v) pairs are exactly the critical connections.",
    ],
    approaches: [
      {
        name: "Tarjan bridge-finding DFS with disc/low timestamps (optimal)",
        intuition: "Track discovery times and the earliest ancestor each node can climb back to; an edge to a child that cannot reach the current node or higher is a bridge.",
        time: "O(n + E)",
        timeWhy: "A single DFS visits every node and edge a constant number of times.",
        space: "O(n + E)",
        spaceWhy: "Adjacency list, disc/low arrays, and the DFS recursion stack.",
        code: `List<List<Integer>> adj;
int[] disc, low;
int timer;
List<List<Integer>> result;
List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {
    adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (List<Integer> c : connections) {
        adj.get(c.get(0)).add(c.get(1));
        adj.get(c.get(1)).add(c.get(0));
    }
    disc = new int[n];
    low = new int[n];
    Arrays.fill(disc, -1);
    timer = 0;
    result = new ArrayList<>();
    dfs(0, -1);
    return result;
}
void dfs(int u, int parent) {
    disc[u] = low[u] = timer++;
    boolean skippedParent = false;
    for (int v : adj.get(u)) {
        if (v == parent && !skippedParent) {   // skip the single edge back to parent once
            skippedParent = true;
            continue;
        }
        if (disc[v] == -1) {
            dfs(v, u);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > disc[u]) {
                result.add(Arrays.asList(u, v));   // (u, v) is a bridge
            }
        } else {
            low[u] = Math.min(low[u], disc[v]);     // back edge
        }
    }
}`,
        walkthrough: [
          "n=4, edges 0-1,1-2,2-0,1-3. DFS from 0: disc[0]=low[0]=0.",
          "Visit 1: disc[1]=low[1]=1. From 1 visit 2: disc[2]=low[2]=2. 2 sees back edge to 0: low[2]=min(2,disc[0]=0)=0. Return: low[1]=min(1,0)=0. Edge 1-2 bridge? low[2]=0 > disc[1]=1? no.",
          "From 1 visit 3: disc[3]=low[3]=3. 3 has no other edge. Return: low[1]=min(0,3)=0. Edge 1-3 bridge? low[3]=3 > disc[1]=1? yes -> add [1,3].",
          "Return to 0: edge 0-1 bridge? low[1]=0 > disc[0]=0? no. Result [[1,3]].",
        ],
      },
    ],
    edgeCases: [
      "A single edge between two nodes → it is always a bridge.",
      "Any edge inside a cycle → not a bridge, because the cycle provides an alternate path.",
      "The DFS must skip only ONE parent edge so genuine multi-edges (if present) are still treated as back edges.",
    ],
    twists: [
      "**Find articulation points (cut vertices)** → a related Tarjan condition low[v] >= disc[u] with a root special case.",
      "**Iterative DFS** → required when n is large to avoid stack overflow on deep recursion.",
      "**Bridge tree / 2-edge-connected components** → contract non-bridge components after finding bridges.",
    ],
    related: ["number-of-provinces", "redundant-connection", "graph-valid-tree"],
  },

  {
    slug: "smallest-string-with-swaps",
    title: "Smallest String With Swaps",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1202,
    statement:
      "You are given a string `s` and an array `pairs` of index pairs where `pairs[i] = [a, b]` means you may **swap** the characters at indices `a` and `b` of `s` **any number of times**. Return the **lexicographically smallest** string obtainable after applying any sequence of allowed swaps.",
    examples: [
      { in: 's="dcab", pairs=[[0,3],[1,2]]', out: '"bacd"', note: "indices {0,3} can swap (d,b) and {1,2} can swap (c,a); sort each group" },
      { in: 's="dcab", pairs=[[0,3],[1,2],[0,2]]', out: '"abcd"', note: "the pairs connect all four indices into one group, fully sortable" },
      { in: 's="cba", pairs=[[0,1],[1,2]]', out: '"abc"', note: "all indices linked, sort the whole string" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^5", "0 ≤ pairs.length ≤ 10^5", "0 ≤ a, b < s.length", "s consists of lowercase English letters"],
    recognize:
      "Swaps are transitive, so any two indices in the same swap-connected group can be reordered freely → **Union-Find** groups the indices into connected components; within each component sort its characters and place them back in ascending index order.",
    figureItOut: [
      "If indices a and b can swap, and b and c can swap, then via b you can also achieve any arrangement of {a, b, c}. So the indices split into connected components, and within a component the characters can be permuted arbitrarily — meaning each component can be sorted independently.",
      "Use **Union-Find (DSU)** to union the two endpoints of every pair. After processing all pairs, each index has a representative root identifying its component.",
      "For each component, collect both the set of indices it contains and the multiset of characters at those indices. Sort the indices ascending and sort the characters ascending; assign the smallest character to the smallest index in that component, the next smallest to the next index, and so on. This yields the lexicographically smallest arrangement achievable.",
      "Reassemble the answer by placing each component's sorted characters at its sorted indices. Because every component is independently sortable and assigning sorted chars to sorted positions is the lexicographic minimum, the combined result is globally minimal.",
    ],
    approaches: [
      {
        name: "Union-Find components, sort characters within each (optimal)",
        intuition: "Transitive swaps make each connected index-group fully reorderable; group with DSU, then place each group's sorted characters at its sorted indices.",
        time: "O((n + p) alpha + n log n)",
        timeWhy: "DSU operations are near-constant amortized; sorting characters within components totals O(n log n).",
        space: "O(n)",
        spaceWhy: "DSU parent array plus per-component index and character buckets.",
        code: `int[] parent;
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
void union(int a, int b) {
    parent[find(a)] = find(b);
}
String smallestStringWithSwaps(String s, List<List<Integer>> pairs) {
    int n = s.length();
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    for (List<Integer> p : pairs) union(p.get(0), p.get(1));
    Map<Integer, List<Integer>> groups = new HashMap<>();
    for (int i = 0; i < n; i++) {
        groups.computeIfAbsent(find(i), k -> new ArrayList<>()).add(i);
    }
    char[] result = s.toCharArray();
    for (List<Integer> indices : groups.values()) {
        List<Character> chars = new ArrayList<>();
        for (int idx : indices) chars.add(s.charAt(idx));
        Collections.sort(chars);                 // indices already ascending by insertion order
        for (int k = 0; k < indices.size(); k++) {
            result[indices.get(k)] = chars.get(k);
        }
    }
    return new String(result);
}`,
        walkthrough: [
          's="dcab", pairs=[[0,3],[1,2]]. parent init [0,1,2,3].',
          "union(0,3): parent[0]=3. union(1,2): parent[1]=2.",
          "Components: find(0)=3,find(3)=3 -> group{0,3}; find(1)=2,find(2)=2 -> group{1,2}.",
          "Group {0,3}: chars at 0,3 = d,b -> sorted b,d -> result[0]=b, result[3]=d. Group {1,2}: chars c,a -> sorted a,c -> result[1]=a, result[2]=c.",
          'result = b a c d -> "bacd". Answer "bacd".',
        ],
      },
    ],
    edgeCases: [
      "No pairs → no swaps possible, return s unchanged.",
      "All indices in one component → sort the entire string.",
      "An index appears in no pair → it is its own singleton component and stays fixed.",
    ],
    twists: [
      "**DFS/BFS components instead of DSU** → build an adjacency list and flood-fill each group.",
      "**Swaps form a fixed permutation cycle (LeetCode 1284-style)** → cycle decomposition gives reachable arrangements.",
      "**Lexicographically LARGEST** → sort each component descending instead.",
    ],
    related: ["number-of-provinces", "accounts-merge", "redundant-connection"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "n-queens-ii",
    title: "N-Queens II",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 52,
    statement:
      "The **n-queens** puzzle places `n` queens on an `n x n` chessboard so that **no two queens attack each other** (no two share a row, column, or diagonal). Given an integer `n`, return the **number of distinct solutions** to the n-queens puzzle.",
    examples: [
      { in: "n=4", out: "2", note: "exactly two distinct non-attacking placements on a 4x4 board" },
      { in: "n=1", out: "1", note: "one queen on a 1x1 board, trivially valid" },
    ],
    constraints: ["1 ≤ n ≤ 9"],
    recognize:
      "Place exactly one queen per row choosing a safe column → classic **backtracking** row by row, with O(1) attack checks via three boolean sets (used columns, used '/'-diagonals where row+col is constant, used 'backslash'-diagonals where row-col is constant).",
    figureItOut: [
      "Since no two queens can share a row, place exactly one queen in each row, going row 0, 1, 2, ... For each row try every column and keep only the safe ones, then recurse to the next row.",
      "A column c in row r is safe if no earlier queen shares the column, the anti-diagonal, or the main diagonal. Track three sets: `cols` (columns taken), `diag1` keyed by `row + col` (constant along an anti-diagonal '/'), and `diag2` keyed by `row - col` (constant along a main diagonal). A cell is safe iff none of these contain its keys.",
      "Backtracking step: at row r, for each column c that is safe, mark the three keys used, recurse into row r+1, then unmark them (undo) before trying the next column. This explores every consistent partial placement.",
      "**Base/termination**: when r == n, all rows are filled with a valid queen, so increment the solution count by 1 and return. The recursion naturally prunes whole branches the moment a row has no safe column.",
    ],
    approaches: [
      {
        name: "Row-by-row backtracking with column/diagonal sets (optimal)",
        intuition: "One queen per row; try each safe column using constant-time conflict sets, recurse, and undo, counting a solution every time all n rows are placed.",
        time: "O(n!)",
        timeWhy: "Row r has at most n - r safe choices, so the branching factor shrinks like a factorial, heavily pruned by the diagonal checks.",
        space: "O(n)",
        spaceWhy: "Recursion depth n plus three sets of size O(n).",
        code: `int totalNQueens(int n) {
    boolean[] cols = new boolean[n];
    boolean[] diag1 = new boolean[2 * n];   // index row + col
    boolean[] diag2 = new boolean[2 * n];   // index row - col + n
    return place(0, n, cols, diag1, diag2);
}
int place(int row, int n, boolean[] cols, boolean[] diag1, boolean[] diag2) {
    if (row == n) return 1;
    int count = 0;
    for (int col = 0; col < n; col++) {
        int d1 = row + col;
        int d2 = row - col + n;
        if (cols[col] || diag1[d1] || diag2[d2]) continue;
        cols[col] = diag1[d1] = diag2[d2] = true;
        count += place(row + 1, n, cols, diag1, diag2);
        cols[col] = diag1[d1] = diag2[d2] = false;
    }
    return count;
}`,
        walkthrough: [
          "n=4. Row 0 try col 0: mark. Row 1 cols 0,1 blocked (col/diag), col 2 ok, col 3 blocked by diag1(1+3 vs 0+? no) - it places col 2.",
          "Row 2 from (0,0),(1,2): every column conflicts (col0 used, col1 diag, col2 used, col3 diag) -> dead end, backtrack.",
          "Row 1 col 3 from (0,0): leads to row2 col1, row3 col? dead. Row 0 col 0 fully fails. Row 0 col 1 -> yields a full solution (1,3,0,2).",
          "Symmetrically row 0 col 2 yields (2,0,3,1). Total distinct solutions counted = 2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → a single queen, one solution.",
      "n = 2 and n = 3 → zero solutions (the diagonals leave no room).",
      "Diagonal indexing must offset row - col by n to keep array indices non-negative.",
    ],
    twists: [
      "**Return the actual boards (N-Queens I)** → record each column choice and render '.'/'Q' rows.",
      "**Bitmask backtracking** → represent cols/diag1/diag2 as integer bitmasks for a large constant-factor speedup.",
      "**Count solutions up to symmetry** → divide by reflective/rotational symmetry classes.",
    ],
    related: ["n-queens", "permutations", "combinations"],
  },

  {
    slug: "path-with-maximum-gold",
    title: "Path With Maximum Gold",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 1219,
    statement:
      "In a gold mine `grid` of size `m x n`, `grid[i][j]` is the amount of gold in that cell (0 means empty). Starting from **any** cell that has gold, you may walk 4-directionally to adjacent cells collecting their gold, but you **cannot visit a cell with 0 gold** and **cannot visit the same cell twice** on one walk. You may start and stop anywhere. Return the **maximum gold** collectable in one such walk.",
    examples: [
      { in: "grid=[[0,6,0],[5,8,7],[0,9,0]]", out: "24", note: "path 9 -> 8 -> 7 collects 9+8+7 = 24" },
      { in: "grid=[[1,0,7],[2,0,6],[3,4,5],[0,3,0],[9,0,20]]", out: "28", note: "1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 = 28" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 15", "0 ≤ grid[i][j] ≤ 100", "at most 25 cells contain gold"],
    recognize:
      "Longest gold-sum self-avoiding walk over nonzero cells from any start → **backtracking DFS** from every gold cell: temporarily zero the current cell (mark visited), explore the four neighbors, take the best, then restore the cell on the way out.",
    figureItOut: [
      "There is no fixed start or end, and a walk cannot reuse a cell, so this is a self-avoiding path that maximizes the sum of visited gold. With at most 25 gold cells, exhaustive backtracking from each possible start is feasible.",
      "Backtracking DFS from a cell (r, c): if it is out of bounds or holds 0 gold (either truly empty or currently marked visited), it contributes 0. Otherwise take its gold, then recurse into the four neighbors and add the maximum single-neighbor continuation.",
      "Mark-and-restore trick: save the cell value, set `grid[r][c] = 0` to mark it visited (so the recursion will not re-enter it), explore neighbors, then restore the saved value before returning. This avoids a separate visited array while keeping each path self-avoiding.",
      "**Base/termination**: a neighbor that is 0 or off-grid yields 0, ending that branch. Try the DFS starting from every gold-bearing cell and keep the overall maximum; that is the best walk. Branching is 4-way but the at-most-25 gold cells keep the search small.",
    ],
    approaches: [
      {
        name: "Backtracking DFS from every gold cell with mark/restore (optimal)",
        intuition: "From each gold cell, greedily explore all self-avoiding extensions by zeroing the current cell during recursion and restoring it after, taking the best neighbor continuation.",
        time: "O(m * n * 4^k)",
        timeWhy: "Each of the gold cells launches a DFS branching up to 4 ways over a path of at most k <= 25 gold cells.",
        space: "O(k)",
        spaceWhy: "Recursion depth equals the current path length, bounded by the number of gold cells.",
        code: `int getMaximumGold(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int best = 0;
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] != 0) {
                best = Math.max(best, dfs(grid, r, c, m, n));
            }
        }
    }
    return best;
}
int dfs(int[][] grid, int r, int c, int m, int n) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == 0) return 0;
    int gold = grid[r][c];
    grid[r][c] = 0;                       // mark visited
    int down = dfs(grid, r + 1, c, m, n);
    int up = dfs(grid, r - 1, c, m, n);
    int right = dfs(grid, r, c + 1, m, n);
    int left = dfs(grid, r, c - 1, m, n);
    grid[r][c] = gold;                    // restore on the way out
    int bestNeighbor = Math.max(Math.max(down, up), Math.max(right, left));
    return gold + bestNeighbor;
}`,
        walkthrough: [
          "grid=[[0,6,0],[5,8,7],[0,9,0]]. Try DFS from each nonzero cell; consider starting at (2,1)=9.",
          "At (2,1)=9: mark 0. Neighbors (1,1)=8 (others 0). DFS (1,1)=8: mark 0, neighbors (0,1)=6,(1,0)=5,(1,2)=7.",
          "Best continuation from (1,1): (1,2)=7 has no further gold neighbor (8 zeroed) -> 7; (0,1)=6 ->6; (1,0)=5 ->5. So (1,1) returns 8+7=15.",
          "(2,1) returns 9+15=24. Other starts (e.g. 8 first then 9,7) cannot beat 24. Answer 24.",
        ],
      },
    ],
    edgeCases: [
      "All cells 0 → no gold cell to start from, answer 0.",
      "A single gold cell isolated by zeros → answer equals that cell value.",
      "Restoring the cell value after recursion is essential so other start points and branches see the full grid.",
    ],
    twists: [
      "**Allow revisiting cells** → becomes an unbounded walk; the no-revisit rule is what makes it backtracking.",
      "**8-directional movement** → extend the neighbor offsets to all eight directions.",
      "**Must start at a fixed cell** → call DFS only from that one cell.",
    ],
    related: ["number-of-islands", "unique-paths-iii", "subsets"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "advantage-shuffle",
    title: "Advantage Shuffle",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 870,
    statement:
      "You are given two integer arrays `nums1` and `nums2` of the **same length**. The **advantage** of a permutation of `nums1` over `nums2` is the number of indices `i` where the permuted `nums1[i] > nums2[i]`. Return **any** permutation of `nums1` that **maximizes its advantage** over `nums2`.",
    examples: [
      { in: "nums1=[2,7,11,15], nums2=[1,10,4,11]", out: "[2,11,7,15]", note: "2>1, 11>10, 7>4, 15>11 — advantage 4" },
      { in: "nums1=[12,24,8,32], nums2=[13,25,32,11]", out: "[24,32,8,12]", note: "24>13, 32>25, 8<32 (sacrificed), 12>11 — advantage 3" },
    ],
    constraints: ["1 ≤ nums1.length ≤ 10^5", "nums2.length == nums1.length", "0 ≤ nums1[i], nums2[i] ≤ 10^9"],
    recognize:
      "Maximize how many of our cards beat their cards (the 'horse-racing' / Tianji strategy) → **greedy** after sorting: for each opponent value in decreasing order, beat it with the smallest card that still wins, otherwise sacrifice our weakest card against it.",
    figureItOut: [
      "This is the classic Tianji horse-racing greedy: to win the most matchups, never waste a strong card on an opponent you can beat with a weaker one, and never burn a usable card on an opponent you cannot beat — sacrifice your weakest instead.",
      "Sort our cards `nums1` ascending. Consider the opponent values from STRONGEST to weakest. For the current strongest opponent, if our biggest remaining card beats it, assign that card (it would beat nothing stronger anyway); if even our biggest cannot beat it, hand over our SMALLEST remaining card (a guaranteed loss, but it sacrifices the least useful card).",
      "Use two pointers over sorted nums1 — `lo` at the smallest remaining card, `hi` at the largest. Process opponents in descending order (sort their indices by value). If `nums1[hi] > opponentValue`, place nums1[hi] at the opponent original index and move hi down; otherwise place nums1[lo] there and move lo up.",
      "This greedy is optimal: matching each beatable opponent with the minimal sufficient card preserves stronger cards for stronger opponents, and dumping the weakest card on an unbeatable opponent costs nothing we could have used elsewhere. Fill the answer at each opponent original index so the returned permutation aligns with nums2.",
    ],
    approaches: [
      {
        name: "Sort + greedy two-pointer (Tianji horse racing) (optimal)",
        intuition: "Face the toughest opponent first: beat it with your smallest winning card, or throw your weakest card away if you cannot win — preserving strong cards for strong opponents.",
        time: "O(n log n)",
        timeWhy: "Sorting nums1 and ordering nums2 indices by value each cost O(n log n); the assignment pass is linear.",
        space: "O(n)",
        spaceWhy: "The sorted index order of nums2 and the result array.",
        code: `int[] advantageCount(int[] nums1, int[] nums2) {
    int n = nums1.length;
    int[] sorted1 = nums1.clone();
    Arrays.sort(sorted1);
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    // order opponent indices by their value DESCENDING
    Arrays.sort(idx, (a, b) -> nums2[b] - nums2[a]);
    int[] result = new int[n];
    int lo = 0, hi = n - 1;
    for (int k = 0; k < n; k++) {
        int opponentIndex = idx[k];
        int opponentValue = nums2[opponentIndex];
        if (sorted1[hi] > opponentValue) {
            result[opponentIndex] = sorted1[hi];   // beat it with the smallest sufficient (current largest unused)
            hi--;
        } else {
            result[opponentIndex] = sorted1[lo];   // cannot beat: sacrifice the weakest card
            lo++;
        }
    }
    return result;
}`,
        walkthrough: [
          "nums1=[2,7,11,15], nums2=[1,10,4,11]. sorted1=[2,7,11,15]. lo=0,hi=3.",
          "Opponents by value desc: indices 3(11),1(10),2(4),0(1).",
          "Opp idx3 val11: sorted1[3]=15>11 -> result[3]=15, hi=2. Opp idx1 val10: sorted1[2]=11>10 -> result[1]=11, hi=1.",
          "Opp idx2 val4: sorted1[1]=7>4 -> result[2]=7, hi=0. Opp idx0 val1: sorted1[0]=2>1 -> result[0]=2, hi=-1.",
          "result=[2,11,7,15], advantage 4. Answer [2,11,7,15].",
        ],
      },
    ],
    edgeCases: [
      "Our max cannot beat their max → that biggest opponent gets our weakest sacrificed card.",
      "Duplicate values → still correct; ties (equal, not greater) count as losses, so equal does not beat.",
      "Length 1 → either we win (one card > theirs) or we lose, returning our single card.",
    ],
    twists: [
      "**Maximize advantage of >= instead of >** → change the comparison to allow ties as wins.",
      "**Return the maximum advantage count only** → tally the wins instead of the permutation.",
      "**Both players play optimally each round** → a game-theoretic variant beyond a single shuffle.",
    ],
    related: ["boats-to-save-people", "assign-cookies", "two-city-scheduling"],
  },

  {
    slug: "bag-of-tokens",
    title: "Bag of Tokens",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 948,
    statement:
      "You start with `power` and `0` score, holding tokens with values `tokens[i]`. Each token can be played **at most once** in one of two ways: **face-up** — if your current power is at least the token value, lose that much power and gain 1 score; or **face-down** — if your score is at least 1, lose 1 score and gain the token value as power. Return the **maximum score** you can achieve.",
    examples: [
      { in: "tokens=[100], power=50", out: "0", note: "cannot afford the only token face-up, and have no score to play it face-down" },
      { in: "tokens=[200,100], power=150", out: "1", note: "play 100 face-up for 1 score; 200 unaffordable, do not sell back" },
      { in: "tokens=[100,200,300,400], power=200", out: "2", note: "buy 100 (score1), sell 400 back for power, buy 200 then 300 — net score 2" },
    ],
    constraints: ["0 ≤ tokens.length ≤ 1000", "0 ≤ tokens[i], power < 10^4"],
    recognize:
      "Spend power to gain score on CHEAP tokens, and trade score back for power using EXPENSIVE tokens → **greedy** after sorting: a two-pointer that buys the cheapest token face-up when affordable, otherwise sells the most expensive token face-down to fund more buys.",
    figureItOut: [
      "Each token converts between power and score. To gain score you spend power on a token (face-up); to refuel power you spend a score on a token (face-down). To maximize score, buy score as cheaply as possible and, when stuck, sell back the MOST expensive token to get the most power per score spent.",
      "Sort tokens ascending and use two pointers, `left` (cheapest unused) and `right` (most expensive unused). Greedily: if you can afford the cheapest token face-up (power >= tokens[left]), buy it — power -= tokens[left], score += 1, left++ — and update your best score seen.",
      "If you cannot afford the cheapest token but you have score > 0 AND there is more than one token left, sell the most expensive token face-down — power += tokens[right], score -= 1, right-- — to fund cheaper future buys. Only do this when it could still let you buy at least one more token (which is why you need at least two tokens left).",
      "Stop when the pointers cross or you can neither buy nor profitably sell. Because you always buy the cheapest and sell the dearest, every face-down trade maximizes power gained per score spent; track the maximum score across the process (selling temporarily lowers score, so record the best, not the final).",
    ],
    approaches: [
      {
        name: "Sort + greedy two-pointer buy-cheap / sell-expensive (optimal)",
        intuition: "Always gain score from the cheapest token; when you cannot afford it, convert a score into power using the most expensive token to keep buying, tracking the best score reached.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the two-pointer sweep is a single linear pass.",
        space: "O(1)",
        spaceWhy: "Only pointers and a few scalar counters beyond the sort.",
        code: `int bagOfTokensScore(int[] tokens, int power) {
    Arrays.sort(tokens);
    int left = 0, right = tokens.length - 1;
    int score = 0, best = 0;
    while (left <= right) {
        if (power >= tokens[left]) {
            power -= tokens[left];   // play cheapest face-up: gain score
            score++;
            left++;
            best = Math.max(best, score);
        } else if (score > 0 && left < right) {
            power += tokens[right];  // play most expensive face-down: spend score for power
            score--;
            right--;
        } else {
            break;                   // cannot buy and cannot/should not sell
        }
    }
    return best;
}`,
        walkthrough: [
          "tokens=[100,200,300,400], power=200. Sorted same. left=0,right=3,score=0,best=0.",
          "power200>=100: buy, power=100, score=1, left=1, best=1.",
          "power100<200 but score1>0 and left<right: sell tokens[3]=400, power=500, score=0, right=2.",
          "power500>=200: buy, power=300, score=1, left=2, best=1. power300>=300: buy, power=0, score=2, left=3, best=2. left>right stop. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "Cannot afford any token and have no score → score stays 0.",
      "Selling needs at least two tokens left (left < right) so the freed power can fund a different, cheaper buy.",
      "Track the BEST score, not the final, since a face-down sell intentionally drops the current score.",
    ],
    twists: [
      "**Each token playable multiple times** → changes the structure away from a simple two-pointer.",
      "**Face-down gives a fixed power instead of the token value** → adjust the refuel gain.",
      "**Minimize tokens used for a target score** → a different objective over the same operations.",
    ],
    related: ["boats-to-save-people", "assign-cookies", "gas-station"],
  },
];
