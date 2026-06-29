// NeetCode All / Top Interview 150 / LeetCode 75 / Grind 75 — wave 17c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave16c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods. Strings use double quotes
// inside code to avoid apostrophe clashes with the single-quoted JS string literals.
export const WAVE17C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "count-number-of-teams",
    title: "Count Number of Teams",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 1395,
    statement:
      "There are `n` soldiers in a line, each with a distinct `rating` given by `rating[i]`. A **team** is a group of exactly **3** soldiers chosen at indices `i < j < k` whose ratings are either strictly increasing (`rating[i] < rating[j] < rating[k]`) or strictly decreasing (`rating[i] > rating[j] > rating[k]`). Return the **number of teams** that can be formed. Each soldier may belong to multiple teams.",
    examples: [
      { in: "rating=[2,5,3,4,1]", out: "3", note: "increasing triples (2,3,4),(2,5,?)... valid: (2,3,4),(2,5,?) etc; total 3" },
      { in: "rating=[2,1,3]", out: "0", note: "no strictly monotone triple exists" },
      { in: "rating=[1,2,3,4]", out: "4", note: "every increasing triple: C(4,3)=4" },
    ],
    constraints: ["n == rating.length", "3 ≤ n ≤ 1000", "1 ≤ rating[i] ≤ 10^5", "all rating[i] are distinct"],
    recognize:
      "Count monotone triples i<j<k by fixing the MIDDLE soldier and multiplying how many smaller-on-the-left pair with larger-on-the-right (and vice versa) → a 1-D DP that, for each index, accumulates left/right rank counts.",
    figureItOut: [
      "A monotone triple is pinned by its **middle** element j: an increasing team needs one rating smaller than rating[j] strictly to its left and one larger strictly to its right; a decreasing team is the mirror. So the count contributed by j is (smaller-left * larger-right) + (larger-left * smaller-right).",
      "**State**: for each middle index j, four scalar counts — `lessLeft[j]`, `greaterLeft[j]`, `lessRight[j]`, `greaterRight[j]` = how many indices on that side have rating less/greater than rating[j]. These are the 1-D DP quantities computed per j.",
      "**Recurrence**: `lessLeft[j] = #{i < j : rating[i] < rating[j]}` and `greaterLeft[j] = (j) - lessLeft[j]` (j candidates on the left, each either less or greater since values are distinct). Symmetrically `lessRight[j] = #{k > j : rating[k] < rating[j]}` and `greaterRight[j] = (n-1-j) - lessRight[j]`. The teams through j = lessLeft*greaterRight + greaterLeft*lessRight.",
      "**Base case**: the two endpoints can never be the middle, so they contribute 0; counts for them are simply not summed. Each index j independently produces its term.",
      "**Fill**: for each j scan left and right once to tally the four counts (O(n^2) total), accumulate the team term, and sum over all j. The total is the answer; no soldier-uniqueness double counts because each team is counted exactly once at its middle.",
    ],
    approaches: [
      {
        name: "Fix the middle, count left/right ranks (optimal for n<=1000)",
        intuition: "Every valid triple has a unique middle element; for that middle, the team count is the product of compatible counts on each side, summed over both monotone directions.",
        time: "O(n^2)",
        timeWhy: "For each of n middles, an O(n) scan counts smaller/larger neighbors on both sides.",
        space: "O(1)",
        spaceWhy: "Only a handful of running counters; no auxiliary arrays needed.",
        code: `int numTeams(int[] rating) {
    int n = rating.length;
    int total = 0;
    for (int j = 0; j < n; j++) {
        int lessLeft = 0, greaterLeft = 0, lessRight = 0, greaterRight = 0;
        for (int i = 0; i < j; i++) {
            if (rating[i] < rating[j]) lessLeft++;
            else greaterLeft++;
        }
        for (int k = j + 1; k < n; k++) {
            if (rating[k] < rating[j]) lessRight++;
            else greaterRight++;
        }
        // increasing teams: smaller on left, larger on right
        total += lessLeft * greaterRight;
        // decreasing teams: larger on left, smaller on right
        total += greaterLeft * lessRight;
    }
    return total;
}`,
        walkthrough: [
          "rating=[2,5,3,4,1], n=5.",
          "j=0 (2): no left -> 0.",
          "j=1 (5): left{2} lessLeft=1,greaterLeft=0; right{3,4,1} all <5 lessRight=3,greaterRight=0. inc=1*0=0, dec=0*3=0 -> 0.",
          "j=2 (3): left{2,5} lessLeft=1,greaterLeft=1; right{4,1} lessRight=1(the 1),greaterRight=1(the 4). inc=1*1=1, dec=1*1=1 -> +2.",
          "j=3 (4): left{2,5,3} lessLeft=2,greaterLeft=1; right{1} lessRight=1,greaterRight=0. inc=2*0=0, dec=1*1=1 -> +1. j=4 endpoint right empty -> 0. Total 0+0+2+1=3. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "n exactly 3 → at most one team; check both monotone directions.",
      "Ratings are distinct, so every left/right neighbor is strictly less or strictly greater — no equal-case ambiguity.",
      "Strictly monotone requirement means flat or non-monotone triples contribute 0.",
    ],
    twists: [
      "**Teams of size k instead of 3** → generalize to a Fenwick-tree DP counting monotone subsequences of length k.",
      "**O(n log n) via BIT** → replace the O(n) side scans with a Binary Indexed Tree over compressed ratings.",
      "**Count length-3 subsequences that are NOT monotone** → total C(n,3) minus the monotone count.",
    ],
    related: ["longest-increasing-subsequence", "number-of-longest-increasing-subsequence", "best-team-with-no-conflicts"],
  },

  {
    slug: "count-ways-to-build-good-strings",
    title: "Count Ways To Build Good Strings",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 2466,
    statement:
      "You build a string by starting empty and repeatedly appending characters. In one step you may append the character `0` exactly `zero` times, or append the character `1` exactly `one` times. A string is **good** if its length is between `low` and `high` inclusive. Given integers `low`, `high`, `zero`, and `one`, return the number of **distinct good strings** that can be built, **modulo 10^9 + 7**.",
    examples: [
      { in: "low=3, high=3, zero=1, one=1", out: "8", note: "every binary string of length 3: 2^3 = 8" },
      { in: "low=2, high=3, zero=1, one=2", out: "5", note: "lengths 2 and 3 reachable by adding blocks of 1 zero or 2 ones" },
    ],
    constraints: ["1 ≤ low ≤ high ≤ 10^5", "1 ≤ zero, one ≤ low"],
    recognize:
      "Count distinct strings reachable by appending fixed-size blocks, where only the resulting LENGTH matters for the count → a 1-D DP over length, exactly a two-step-size climbing-stairs count, summing lengths in [low, high].",
    figureItOut: [
      "Because each append step adds a fixed number of characters (`zero` of '0' or `one` of '1'), two build sequences produce different strings unless they make the identical sequence of block choices — and each distinct sequence of choices yields a distinct string. So counting strings of a given length equals counting ways to reach that length using steps of size `zero` and `one`.",
      "**State**: `dp[len]` = the number of distinct ways (distinct strings) to build a string of exactly length `len`. The single moving index is the current length.",
      "**Recurrence**: to reach length `len`, the last block was either `zero` characters (from `dp[len - zero]`) or `one` characters (from `dp[len - one]`): `dp[len] = dp[len - zero] + dp[len - one]`, taking each predecessor only when it is non-negative, all modulo 10^9 + 7.",
      "**Base case**: `dp[0] = 1` — the empty string is built in exactly one way (no steps). Lengths below 0 are treated as 0 (unreachable).",
      "**Fill**: iterate `len` from 1 to `high` so both predecessors are ready. The answer is the sum of `dp[len]` for `len` in `[low, high]`, modulo 10^9 + 7.",
    ],
    approaches: [
      {
        name: "Climbing-stairs length DP, sum over [low, high] (optimal)",
        intuition: "Distinct strings correspond one-to-one with distinct block-choice sequences, so counting reduces to counting length-reaching paths with two step sizes.",
        time: "O(high)",
        timeWhy: "A single pass computes dp[0..high]; the final summation is also linear.",
        space: "O(high)",
        spaceWhy: "A dp array indexed by length up to high.",
        code: `int countGoodStrings(int low, int high, int zero, int one) {
    int MOD = 1_000_000_007;
    int[] dp = new int[high + 1];
    dp[0] = 1;                      // empty string: one way
    int total = 0;
    for (int len = 1; len <= high; len++) {
        if (len >= zero) dp[len] = (dp[len] + dp[len - zero]) % MOD;
        if (len >= one)  dp[len] = (dp[len] + dp[len - one]) % MOD;
        if (len >= low)  total = (total + dp[len]) % MOD;
    }
    return total;
}`,
        walkthrough: [
          "low=2, high=3, zero=1, one=2. dp[0]=1.",
          "len=1: dp[1]+=dp[0]=1 (zero step); one=2>1 skip. dp[1]=1. 1<low so not summed.",
          "len=2: dp[2]+=dp[1]=1 (zero); dp[2]+=dp[0]=1 (one) -> dp[2]=2. 2>=low -> total=2.",
          "len=3: dp[3]+=dp[2]=2 (zero); dp[3]+=dp[1]=1 (one) -> dp[3]=3. 3>=low -> total=2+3=5.",
          "Answer total=5.",
        ],
      },
    ],
    edgeCases: [
      "zero == one → dp doubles each reachable multiple, but lengths not divisible by the step stay 0.",
      "Apply the modulo on every accumulation to keep dp values and total within int range.",
      "Empty string (length 0) is never counted because low >= 1, so dp[0] is only a base, never summed.",
    ],
    twists: [
      "**Track actual strings** → impossible to enumerate for large lengths, but the count is still well defined.",
      "**Three block sizes** → add a third predecessor term to the recurrence.",
      "**Exactly length high (not a range)** → return dp[high] alone instead of the range sum.",
    ],
    related: ["climbing-stairs", "n-th-tribonacci-number", "combination-sum-iv"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "knight-probability-in-chessboard",
    title: "Knight Probability in Chessboard",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 688,
    statement:
      "On an `n x n` chessboard, a knight starts at cell `(row, column)` and makes exactly `k` moves. On each move it chooses **uniformly at random** one of the 8 knight moves (even ones that would land off the board). The knight stops moving once it leaves the board. Return the **probability** that the knight remains **on the board** after making exactly `k` moves.",
    examples: [
      { in: "n=3, k=2, row=0, column=0", out: "0.06250", note: "of the surviving move sequences, 2/16 stay on the board across both moves" },
      { in: "n=1, k=0, row=0, column=0", out: "1.00000", note: "no moves means it is certainly still on the board" },
    ],
    constraints: ["1 ≤ n ≤ 25", "0 ≤ k ≤ 100", "0 ≤ row, column ≤ n - 1"],
    recognize:
      "Probability of staying on a grid after k random moves → a 2-D DP over board cells, advanced one move-layer at a time, where each cell's survival probability is the average of its 8 knight neighbors from the previous layer.",
    figureItOut: [
      "Each move keeps the knight on the board with probability 1/8 per legal landing cell. Track, for every cell, the probability the knight is sitting there after a given number of moves; the answer is the total probability mass still on the board after k moves.",
      "**State**: `dp[m][r][c]` = the probability the knight is at cell (r, c) having made `m` moves while never having left the board. We only need two layers (current and next), so a rolling 2-D array suffices.",
      "**Recurrence**: from cell (r, c) the knight moves to each of the 8 knight offsets with probability 1/8. So `next[nr][nc] += dp[r][c] / 8` for every in-board target (nr, nc). Off-board targets simply drop probability mass (the knight has left and stops counting).",
      "**Base case**: `dp[0][row][column] = 1` and all other cells 0 — before any move the knight is certainly at the start.",
      "**Fill**: repeat the move-spreading k times, each producing a fresh `next` layer summed from the 8 sources. After k layers, the answer is the sum of all on-board probabilities, i.e. the total remaining mass.",
    ],
    approaches: [
      {
        name: "Layered probability DP over cells (optimal)",
        intuition: "Spread each cell's probability evenly to its 8 knight neighbors per move; mass that lands off the board is lost. Sum what remains after k moves.",
        time: "O(k * n^2)",
        timeWhy: "Each of k move-layers updates all n^2 cells, each pushing to 8 neighbors (constant).",
        space: "O(n^2)",
        spaceWhy: "Two n x n probability layers (current and next).",
        code: `double knightProbability(int n, int k, int row, int column) {
    int[][] moves = {
        {1, 2}, {2, 1}, {2, -1}, {1, -2},
        {-1, -2}, {-2, -1}, {-2, 1}, {-1, 2}
    };
    double[][] dp = new double[n][n];
    dp[row][column] = 1.0;
    for (int step = 0; step < k; step++) {
        double[][] next = new double[n][n];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (dp[r][c] == 0) continue;
                for (int[] mv : moves) {
                    int nr = r + mv[0], nc = c + mv[1];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                        next[nr][nc] += dp[r][c] / 8.0;
                    }
                }
            }
        }
        dp = next;
    }
    double total = 0.0;
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) total += dp[r][c];
    }
    return total;
}`,
        walkthrough: [
          "n=3, k=2, start (0,0). Layer 0: dp[0][0]=1.",
          "Move 1: from (0,0) the only in-board knight moves are (1,2) and (2,1). next[1][2]=1/8, next[2][1]=1/8. On-board mass after 1 move = 2/8 = 0.25.",
          "Move 2: from (1,2) the in-board knight moves are (0,0) and (2,0) -> 2 of 8 stay; contributes 2*(1/8)/8. From (2,1) the in-board moves are (0,0) and (0,2) -> 2 of 8 stay; contributes 2*(1/8)/8.",
          "Total on-board mass = (1/8)*(2/8) + (1/8)*(2/8) = 2/64 + 2/64 = 4/64 = 0.0625. Answer 0.06250.",
        ],
      },
    ],
    edgeCases: [
      "k = 0 → no moves, the knight is on the board with probability 1.0.",
      "n = 1 with k > 0 → every move leaves the board, probability collapses to 0 after the first move.",
      "Spreading FROM occupied cells (push) avoids recomputing 8 sources per target; pull-style works equally.",
    ],
    twists: [
      "**Probability of being at a SPECIFIC cell** → read that single dp cell instead of summing.",
      "**Expected number of moves before leaving** → a different DP tracking survival per step.",
      "**Memoized recursion dp(r,c,k)** → top-down equivalent caching probability-on-board from a state.",
    ],
    related: ["out-of-boundary-paths", "number-of-ways-to-stay-in-the-same-place-after-some-steps", "number-of-dice-rolls-with-target-sum"],
  },

  {
    slug: "longest-arithmetic-subsequence",
    title: "Longest Arithmetic Subsequence",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 1027,
    statement:
      "Given an array `nums`, return the **length of the longest arithmetic subsequence** of `nums`. A subsequence keeps the original order but may drop elements; it is **arithmetic** if it has at least two elements and the difference between consecutive elements is constant (a single element or empty sequence counts trivially, but the answer asks for the longest, which is at least 1).",
    examples: [
      { in: "nums=[3,6,9,12]", out: "4", note: "the whole array is arithmetic with common difference 3" },
      { in: "nums=[9,4,7,2,10]", out: "3", note: "[4,7,10] has common difference 3" },
      { in: "nums=[20,1,15,3,10,5,8]", out: "4", note: "[20,15,10,5] has common difference -5" },
    ],
    constraints: ["2 ≤ nums.length ≤ 1000", "0 ≤ nums[i] ≤ 500"],
    recognize:
      "Longest subsequence with a constant gap → a 2-D DP keyed by (ending index, common difference): for each pair (j, i) the run ending at i with difference nums[i]-nums[j] extends the best run ending at j with the same difference.",
    figureItOut: [
      "An arithmetic subsequence is determined by where it ends and its common difference. So index the DP by both: which element is last, and what gap it advances by. Since differences range over a small set, store them in a per-index hash map.",
      "**State**: `dp[i]` is a map from a common difference `d` to the length of the longest arithmetic subsequence ending at index i with that difference. `dp[i].get(d)` = longest run finishing at nums[i] stepping by d.",
      "**Recurrence**: for every pair j < i, let `d = nums[i] - nums[j]`. Then a run ending at j with difference d can be extended by i: `dp[i][d] = dp[j][d] + 1`. If j has no run with difference d, the pair itself forms a length-2 run, so `dp[i][d] = max(dp[i][d], 2)`.",
      "**Base case**: every single element is an arithmetic sequence of length 1, and any pair (j, i) seeds a length-2 run; these are captured implicitly when no longer predecessor exists at difference d.",
      "**Fill**: iterate i from 0 to n-1 and for each i scan all earlier j, updating `dp[i]` (O(n^2) pairs, O(1) map ops). The answer is the maximum length stored across all maps (at least 2 for n >= 2, but report the true max).",
    ],
    approaches: [
      {
        name: "Per-index difference-keyed DP map (optimal)",
        intuition: "A run is identified by its end index and its gap; extending the best same-gap run ending earlier gives the longest run ending here.",
        time: "O(n^2)",
        timeWhy: "Every pair (j, i) is examined once with O(1) hash-map work.",
        space: "O(n^2)",
        spaceWhy: "Each index may store up to O(n) distinct differences.",
        code: `int longestArithSeqLength(int[] nums) {
    int n = nums.length;
    List<Map<Integer, Integer>> dp = new ArrayList<>();
    for (int i = 0; i < n; i++) dp.add(new HashMap<>());
    int best = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            int d = nums[i] - nums[j];
            int prev = dp.get(j).getOrDefault(d, 1);  // run ending at j with gap d
            int len = prev + 1;
            dp.get(i).put(d, Math.max(dp.get(i).getOrDefault(d, 0), len));
            best = Math.max(best, len);
        }
    }
    return best;
}`,
        walkthrough: [
          "nums=[9,4,7,2,10].",
          "i=1 (4): j=0 d=4-9=-5 -> dp[1][-5]=2. best=2.",
          "i=2 (7): j=0 d=-2 dp[2][-2]=2; j=1 d=3 dp[2][3]=2. best=2.",
          "i=3 (2): j=0 d=-7=2; j=1 d=-2=2; j=2 d=-5=2. best=2.",
          "i=4 (10): j=0 d=1=2; j=1 d=6=2; j=2 d=3 -> dp[2][3]=2 so 3; j=3 d=8=2. dp[4][3]=3. best=3. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "All elements equal → common difference 0, the whole array is one arithmetic subsequence of length n.",
      "Array length 2 → answer is always 2 (any two elements form an arithmetic pair).",
      "Negative or zero differences are handled identically; the map key carries the sign.",
    ],
    twists: [
      "**Bounded values (0..500)** → a 2-D int array dp[index][diff+offset] replaces the hash maps for speed.",
      "**Longest GEOMETRIC subsequence** → key by ratio instead of difference (careful with division).",
      "**Count of arithmetic subsequences (LeetCode 446)** → accumulate counts instead of max length.",
    ],
    related: ["longest-increasing-subsequence", "arithmetic-slices", "longest-string-chain"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "possible-bipartition",
    title: "Possible Bipartition",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 886,
    statement:
      "There are `n` people labeled `1..n`. Given a list of `dislikes` where `dislikes[i] = [a, b]` means person `a` dislikes person `b` (mutually), split everyone into **two groups** of any size such that **no pair who dislike each other ends up in the same group**. Return `true` if such a split is possible, otherwise `false`.",
    examples: [
      { in: "n=4, dislikes=[[1,2],[1,3],[2,4]]", out: "true", note: "groups {1,4} and {2,3} avoid all dislikes" },
      { in: "n=3, dislikes=[[1,2],[1,3],[2,3]]", out: "false", note: "a triangle of mutual dislikes cannot be 2-colored" },
      { in: "n=5, dislikes=[[1,2],[2,3],[3,4],[4,5],[1,5]]", out: "false", note: "an odd cycle is not bipartite" },
    ],
    constraints: ["1 ≤ n ≤ 2000", "0 ≤ dislikes.length ≤ 10^4", "dislikes[i].length == 2", "1 ≤ a < b ≤ n", "all pairs are distinct"],
    recognize:
      "Split into two conflict-free groups exactly means **2-color the dislike graph** → a bipartiteness check via BFS/DFS coloring; any odd cycle makes it impossible.",
    figureItOut: [
      "Build an undirected graph where each disliked pair is an edge. Splitting into two groups with no internal dislike edge is the same as **2-coloring** the graph so adjacent nodes differ — i.e. the graph must be bipartite.",
      "Color each component with two colors via BFS or DFS: start a node with color 0, give every neighbor the opposite color. If you ever try to give a node a color it already has conflicting with a neighbor, the graph has an odd cycle and bipartition is impossible.",
      "The graph may be disconnected, so iterate over all people 1..n and start a fresh coloring for any uncolored node, since each component is colored independently.",
      "If every component colors without contradiction, return true. A contradiction anywhere returns false. Edges only constrain adjacent nodes, so isolated people are trivially placeable.",
    ],
    approaches: [
      {
        name: "Bipartite 2-coloring via BFS over all components (optimal)",
        intuition: "Two conflict-free groups exist iff the dislike graph is 2-colorable; BFS spreads alternating colors and a same-color edge proves impossibility.",
        time: "O(n + E)",
        timeWhy: "Each node and edge is visited a constant number of times during coloring.",
        space: "O(n + E)",
        spaceWhy: "Adjacency list, a color array, and the BFS queue.",
        code: `boolean possibleBipartition(int n, int[][] dislikes) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());
    for (int[] d : dislikes) {
        adj.get(d[0]).add(d[1]);
        adj.get(d[1]).add(d[0]);
    }
    int[] color = new int[n + 1];   // 0 = uncolored, 1 and 2 = the two groups
    for (int start = 1; start <= n; start++) {
        if (color[start] != 0) continue;
        color[start] = 1;
        Deque<Integer> queue = new ArrayDeque<>();
        queue.add(start);
        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v : adj.get(u)) {
                if (color[v] == 0) {
                    color[v] = (color[u] == 1) ? 2 : 1;
                    queue.add(v);
                } else if (color[v] == color[u]) {
                    return false;     // same group conflict
                }
            }
        }
    }
    return true;
}`,
        walkthrough: [
          "n=3, dislikes=[[1,2],[1,3],[2,3]] (a triangle).",
          "Start 1 color=1. Neighbors 2,3 get color 2; enqueue.",
          "Process 2 (color 2): neighbor 3 already color 2 -> same as u(2)? color[3]=2 == color[2]=2 -> conflict.",
          "Return false (triangle is an odd cycle, not bipartite). Answer false.",
        ],
      },
    ],
    edgeCases: [
      "No dislikes → trivially true; everyone can go in one group.",
      "Disconnected graph → color each component independently; one bad component fails the whole check.",
      "Odd-length cycle anywhere → impossible; even cycles and trees are always bipartite.",
    ],
    twists: [
      "**Is Graph Bipartite? (LeetCode 785)** → the same coloring on a generic adjacency list.",
      "**Union-Find with parity** → maintain enemy/friend relations using a DSU storing relative color.",
      "**Report the actual two groups** → output the color array instead of just a boolean.",
    ],
    related: ["is-graph-bipartite", "course-schedule", "number-of-provinces"],
  },

  {
    slug: "making-a-large-island",
    title: "Making A Large Island",
    difficulty: "Hard",
    pattern: "graphs",
    leetcode: 827,
    statement:
      "You are given an `n x n` binary `grid`. You may change **at most one** `0` into a `1`. After doing so (or doing nothing), return the size of the **largest island** (a 4-directionally connected group of `1`s). If the grid is all `1`s already, the answer is `n*n`.",
    examples: [
      { in: "grid=[[1,0],[0,1]]", out: "3", note: "flipping either 0 connects two size-1 islands into size 3" },
      { in: "grid=[[1,1],[1,0]]", out: "4", note: "flip the single 0 to join everything" },
      { in: "grid=[[1,1],[1,1]]", out: "4", note: "no zero to flip; the whole grid is one island of size 4" },
    ],
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 500", "grid[i][j] is 0 or 1"],
    recognize:
      "Best single 0-to-1 flip joining neighboring islands → first label every island with a unique id and record its size, then for each 0 sum the sizes of the DISTINCT island ids around it plus one.",
    figureItOut: [
      "Naively flipping each 0 and recomputing islands is O(n^4). Instead, label each existing island once: flood-fill every island, assign it an id (starting at 2 to avoid clashing with 0/1), and store `size[id]`.",
      "For each `0` cell, flipping it merges the distinct islands touching its four neighbors. The new island size is 1 (the flipped cell) plus the sum of `size[id]` over the **distinct** neighbor ids — distinctness matters because the same island can border the 0 on two sides and must be counted once.",
      "Sweep all 0-cells, gather the unique neighboring island ids into a small set, sum their sizes plus one, and keep the maximum. This is the best achievable by a single flip.",
      "Handle the all-ones case: if there is no 0 to flip, the answer is simply the largest island already present (which equals n*n when the grid is fully filled). Track the max island size during labeling as a fallback.",
    ],
    approaches: [
      {
        name: "Label islands with ids + sizes, then test each 0 once (optimal)",
        intuition: "Precompute every island's size keyed by a unique id; flipping a 0 stitches together the distinct island ids around it, so its merged size is computed in O(1) per candidate.",
        time: "O(n^2)",
        timeWhy: "Labeling visits each cell once; the 0-scan checks four neighbors per cell, all constant work.",
        space: "O(n^2)",
        spaceWhy: "The id grid and the id-to-size map, plus DFS recursion.",
        code: `int largestIsland(int[][] grid) {
    int n = grid.length;
    Map<Integer, Integer> size = new HashMap<>();
    int id = 2;                       // ids start at 2 (0 and 1 are reserved)
    int best = 0;
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) {
                int s = fill(grid, r, c, id);
                size.put(id, s);
                best = Math.max(best, s);
                id++;
            }
        }
    }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 0) {
                Set<Integer> seen = new HashSet<>();
                int merged = 1;       // the flipped cell itself
                for (int[] d : dirs) {
                    int nr = r + d[0], nc = c + d[1];
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] > 1) {
                        int nid = grid[nr][nc];
                        if (seen.add(nid)) merged += size.get(nid);
                    }
                }
                best = Math.max(best, merged);
            }
        }
    }
    return best;
}
int fill(int[][] grid, int r, int c, int id) {
    int n = grid.length;
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] != 1) return 0;
    grid[r][c] = id;
    return 1 + fill(grid, r + 1, c, id) + fill(grid, r - 1, c, id)
             + fill(grid, r, c + 1, id) + fill(grid, r, c - 1, id);
}`,
        walkthrough: [
          "grid=[[1,0],[0,1]]. Label islands: (0,0) -> id 2 size 1; (1,1) -> id 3 size 1. best so far 1.",
          "0 at (0,1): neighbors (0,0)=id2 and (1,1)=id3 (both >1). distinct {2,3}. merged=1+1+1=3. best=3.",
          "0 at (1,0): neighbors (0,0)=id2 and (1,1)=id3. merged=1+1+1=3. best stays 3.",
          "Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "Grid all 1s → no 0 to flip; the labeling fallback returns n*n.",
      "Grid all 0s → flipping one cell yields an island of size 1.",
      "Counting distinct ids around a 0 prevents double-adding the same island that wraps two neighbor sides.",
    ],
    twists: [
      "**Flip up to k zeros** → much harder; the clean O(1)-per-flip trick no longer applies.",
      "**8-directional connectivity** → extend the neighbor offsets to 8 directions in both fill and the 0-scan.",
      "**Max Area of Island (LeetCode 695)** → just the labeling step without any flip.",
    ],
    related: ["max-area-of-island", "number-of-islands", "flood-fill"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "find-the-safest-path-in-a-grid",
    title: "Find the Safest Path in a Grid",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 2812,
    statement:
      "You are given an `n x n` 0-indexed `grid` where `grid[i][j] == 1` marks a **thief** and `0` is empty. The **safeness factor** of a path from the top-left `(0,0)` to the bottom-right `(n-1,n-1)` (moving 4-directionally) is the **minimum** Manhattan distance from any cell on the path to its nearest thief. Return the **maximum safeness factor** over all valid paths. (If a cell is itself a thief its distance is 0.)",
    examples: [
      { in: "grid=[[1,0,0],[0,0,0],[0,0,1]]", out: "0", note: "both corners are thieves, so any path includes a distance-0 cell" },
      { in: "grid=[[0,0,1],[0,0,0],[0,0,0]]", out: "2", note: "a path can stay distance 2 from the lone thief" },
    ],
    constraints: ["1 ≤ grid.length == n ≤ 400", "grid[i].length == n", "grid[i][j] is 0 or 1", "at least one thief exists"],
    recognize:
      "Maximize the minimum distance-to-threat along a path → a multi-source BFS to compute each cell's distance to the nearest thief, then a **max-min** (bottleneck) search from corner to corner using a max-heap or binary search.",
    figureItOut: [
      "Two stages. First, compute `dist[i][j]` = Manhattan distance from (i, j) to the closest thief. A **multi-source BFS** seeded from every thief cell at distance 0 fills this in O(n^2): each empty cell takes one more than its nearest already-filled neighbor.",
      "Second, find the path from (0,0) to (n-1,n-1) whose **minimum cell-distance is as large as possible** — a widest-path / bottleneck-shortest-path problem. The safeness of a path is the smallest `dist` along it; we maximize that smallest value.",
      "Use a **max-heap Dijkstra variant**: state is (safeness-so-far, cell). Start at (0,0) with safeness `dist[0][0]`; when moving to a neighbor, the new path safeness is `min(current safeness, dist[neighbor])`. Always expand the cell with the largest achievable safeness first, recording the best safeness reached at each cell.",
      "When (n-1, n-1) is popped, its recorded safeness is the answer — the maximum bottleneck. This greedy is correct because, like Dijkstra, once a cell is popped with the best possible safeness no later path can improve it (mins only shrink).",
    ],
    approaches: [
      {
        name: "Multi-source BFS distances + max-heap bottleneck path (optimal)",
        intuition: "Precompute distance-to-nearest-thief everywhere, then greedily extend the safest-so-far path with a max-heap, taking the min of safeness and each new cell distance.",
        time: "O(n^2 log n)",
        timeWhy: "BFS is O(n^2); the bottleneck Dijkstra processes n^2 cells through a heap of size up to n^2.",
        space: "O(n^2)",
        spaceWhy: "The distance grid, the safeness grid, and the priority queue.",
        code: `int maximumSafenessFactor(List<List<Integer>> grid) {
    int n = grid.size();
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, -1);
    Deque<int[]> bfs = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (grid.get(i).get(j) == 1) {
                dist[i][j] = 0;
                bfs.add(new int[]{i, j});
            }
        }
    }
    int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!bfs.isEmpty()) {
        int[] cur = bfs.poll();
        for (int[] d : dirs) {
            int nr = cur[0] + d[0], nc = cur[1] + d[1];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && dist[nr][nc] == -1) {
                dist[nr][nc] = dist[cur[0]][cur[1]] + 1;
                bfs.add(new int[]{nr, nc});
            }
        }
    }
    int[][] safe = new int[n][n];
    for (int[] row : safe) Arrays.fill(row, -1);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[2] - a[2]);
    safe[0][0] = dist[0][0];
    pq.add(new int[]{0, 0, dist[0][0]});
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int r = cur[0], c = cur[1], s = cur[2];
        if (r == n - 1 && c == n - 1) return s;
        if (s < safe[r][c]) continue;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                int ns = Math.min(s, dist[nr][nc]);
                if (ns > safe[nr][nc]) {
                    safe[nr][nc] = ns;
                    pq.add(new int[]{nr, nc, ns});
                }
            }
        }
    }
    return safe[n - 1][n - 1];
}`,
        walkthrough: [
          "grid=[[0,0,1],[0,0,0],[0,0,0]], n=3. Multi-source BFS from the thief at (0,2).",
          "dist: (0,2)=0,(0,1)=1,(1,2)=1,(0,0)=2,(1,1)=2,(2,2)=2,(1,0)=3,(2,1)=3,(2,0)=4. (Manhattan distances to (0,2).)",
          "Start (0,0) safeness=dist=2. Max-heap expands; moving down/right always takes min(2, dist[next]).",
          "A path 0,0->1,0->2,0->2,1->2,2 has dists 2,3,4,3,2 -> min 2. The bottleneck Dijkstra confirms (2,2) reachable with safeness 2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "Start or end cell is a thief → its dist is 0, so every path safeness is 0.",
      "Grid entirely thieves → all distances 0, answer 0.",
      "n = 1 with the only cell a thief → answer 0; with no thief the problem guarantees at least one, so this is moot.",
    ],
    twists: [
      "**Binary search on the answer** → for a guessed safeness s, BFS only through cells with dist >= s and test connectivity.",
      "**8-directional movement** → expand both the BFS and the path-search neighbor sets.",
      "**Swim in Rising Water (LeetCode 778)** → the dual minimize-the-maximum bottleneck problem.",
    ],
    related: ["swim-in-rising-water", "path-with-minimum-effort", "01-matrix"],
  },

  {
    slug: "checking-existence-of-edge-length-limited-paths",
    title: "Checking Existence of Edge Length Limited Paths",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 1697,
    statement:
      "You are given `n` nodes and an undirected weighted graph as `edgeList` where `edgeList[i] = [u, v, dist]` (there may be multiple edges and self/parallel edges). For each query `queries[j] = [p, q, limit]`, you must decide whether there is a path between `p` and `q` using **only edges with weight strictly less than `limit`**. Return a boolean array answering all queries.",
    examples: [
      { in: "n=3, edgeList=[[0,1,2],[1,2,4],[2,0,8],[1,0,16]], queries=[[0,1,2],[0,2,5]]", out: "[false,true]", note: "query0 limit 2 has no edge <2 between 0,1; query1 limit 5 connects 0-1-2 via edges 2 and 4" },
      { in: "n=5, edgeList=[[0,1,10],[1,2,5],[2,3,9],[3,4,13]], queries=[[0,4,14],[1,4,13]]", out: "[true,false]", note: "all four edges <14 connect 0..4; with limit 13 the 13-edge is excluded" },
    ],
    constraints: ["2 ≤ n ≤ 10^5", "1 ≤ edgeList.length ≤ 10^5", "edgeList[i].length == 3", "1 ≤ queries.length ≤ 10^5", "queries[j].length == 3", "0 ≤ u, v, p, q ≤ n-1", "u != v, p != q", "1 ≤ dist, limit ≤ 10^9"],
    recognize:
      "Many connectivity-under-a-weight-threshold queries → **offline Union-Find**: sort edges and queries by weight, then add edges as the limit rises and answer each query against the current DSU connectivity.",
    figureItOut: [
      "A query asks: using only edges lighter than `limit`, are p and q connected? Connectivity is naturally handled by **Union-Find (DSU)** — but the set of usable edges grows as the limit grows.",
      "Process **offline**: sort all edges by weight ascending, and sort the queries by their limit ascending (remembering each query original index so answers land in the right slot).",
      "Sweep queries in increasing-limit order. Before answering a query with limit L, **union all edges whose weight < L** that have not been added yet (a pointer over the sorted edge list advances monotonically). Then the query answer is whether `find(p) == find(q)`.",
      "Because both edges and queries are sorted, the edge pointer only moves forward across the whole run, so each edge is unioned once. Path compression and union by rank keep each operation near O(1) amortized (inverse-Ackermann).",
    ],
    approaches: [
      {
        name: "Offline Union-Find sorted by weight (optimal)",
        intuition: "Sort edges and queries by weight; raise the threshold monotonically, unioning newly-admissible edges, then answer each query from the DSU at that moment.",
        time: "O((E + Q) log(E + Q))",
        timeWhy: "Sorting dominates; the DSU unions/finds are near-constant amortized and each edge is added once.",
        space: "O(n + Q)",
        spaceWhy: "DSU parent/rank arrays plus the answer array and sorted query indices.",
        code: `int[] parent, rank_;
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
void union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rank_[ra] < rank_[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rank_[ra] == rank_[rb]) rank_[ra]++;
}
boolean[] distanceLimitedPathsExist(int n, int[][] edgeList, int[][] queries) {
    parent = new int[n];
    rank_ = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    Arrays.sort(edgeList, (a, b) -> a[2] - b[2]);
    int q = queries.length;
    Integer[] order = new Integer[q];
    for (int i = 0; i < q; i++) order[i] = i;
    Arrays.sort(order, (a, b) -> queries[a][2] - queries[b][2]);
    boolean[] ans = new boolean[q];
    int ei = 0;
    for (int idx : order) {
        int limit = queries[idx][2];
        while (ei < edgeList.length && edgeList[ei][2] < limit) {
            union(edgeList[ei][0], edgeList[ei][1]);
            ei++;
        }
        ans[idx] = find(queries[idx][0]) == find(queries[idx][1]);
    }
    return ans;
}`,
        walkthrough: [
          "n=3, edges sorted by weight: [0,1,2],[1,2,4],[2,0,8],[1,0,16]. queries=[[0,1,2],[0,2,5]].",
          "Sort queries by limit: query0 limit2, then query1 limit5.",
          "query0 limit2: add edges with weight<2 -> none (first edge weight 2 not <2). find(0)==find(1)? no -> false.",
          "query1 limit5: add edges <5 -> [0,1,2] union(0,1), [1,2,4] union(1,2); next edge weight 8 stops. find(0)==find(2)? yes -> true. Answer [false,true].",
        ],
      },
    ],
    edgeCases: [
      "Strictly-less-than limit: an edge whose weight equals the limit is NOT usable (use < not <=).",
      "Parallel edges and self-context: extra edges are harmless; DSU union is idempotent.",
      "A query whose endpoints are already in different components with no light-enough connecting edge → false.",
    ],
    twists: [
      "**Online queries (no presort)** → needs a Kruskal reconstruction tree or persistent DSU for log-time per query.",
      "**Maximum allowed weight <= limit** → change the comparison to <=.",
      "**Min Cost to Connect All Points (LeetCode 1584)** → the MST-building cousin of this DSU sweep.",
    ],
    related: ["min-cost-to-connect-all-points", "number-of-operations-to-make-network-connected", "redundant-connection"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "factor-combinations",
    title: "Factor Combinations",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 254,
    statement:
      "Given an integer `n`, return **all possible combinations of its factors** where each factor is in the range `[2, n)` and the product of the factors equals `n`. Factors within a combination must be in **non-decreasing order**, and `n` itself (a single-element combination of just `n`) is not included. The combinations may be returned in any order.",
    examples: [
      { in: "n=1", out: "[]", note: "1 has no factors in [2, n)" },
      { in: "n=12", out: "[[2,6],[2,2,3],[3,4]]", note: "all factor combinations multiplying to 12, factors >= 2 and < 12" },
      { in: "n=37", out: "[]", note: "prime, no nontrivial factorization" },
    ],
    constraints: ["1 ≤ n ≤ 10^7"],
    recognize:
      "Enumerate every non-decreasing factorization → **backtracking**: at each level pick a factor >= the previous one that divides the remaining product, recurse on the quotient, and record a combination whenever the remaining product is itself a valid trailing factor.",
    figureItOut: [
      "Build each factorization incrementally. Maintain the **remaining product** still to be factored and the **smallest factor allowed next** (to enforce non-decreasing order and avoid duplicate permutations like [2,6] vs [6,2]).",
      "At each step, try every candidate factor `f` from `start` up to `sqrt(remaining)`: if `f` divides `remaining`, then (a) `[..., f, remaining/f]` is a complete valid combination (since remaining/f >= f keeps order), and (b) recurse with the new remaining `remaining/f` and next-start `f` to factor it further.",
      "Only iterating `f` up to `sqrt(remaining)` is enough: any larger factor would be paired with a smaller cofactor already produced earlier, so this both avoids duplicates and bounds the loop.",
      "Stopping at `sqrt(remaining)` plus recording `[...path, remaining]` whenever `remaining >= start` captures the trailing large factor. The empty/prime cases yield no combinations because no factor in range divides into a valid pair. Excluding the single `[n]` combination is automatic since we always split off at least two factors.",
    ],
    approaches: [
      {
        name: "Backtracking with non-decreasing factors up to sqrt (optimal)",
        intuition: "Grow a sorted factor list; at each level peel off a factor >= the last and recurse on the quotient, emitting a combination each time the quotient is a legal trailing factor.",
        time: "O(factorizations * sqrt(n))",
        timeWhy: "Each recursion scans candidate factors up to sqrt(remaining); the count of factorizations is output-bounded.",
        space: "O(log n)",
        spaceWhy: "Recursion depth is bounded by the number of prime factors (at most log2 n); plus the current path.",
        code: `List<List<Integer>> getFactors(int n) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(n, 2, new ArrayList<>(), result);
    return result;
}
void backtrack(int remaining, int start, List<Integer> path, List<List<Integer>> result) {
    for (int f = start; (long) f * f <= remaining; f++) {
        if (remaining % f == 0) {
            path.add(f);
            // f * (remaining/f) is a complete combination, remaining/f >= f
            path.add(remaining / f);
            result.add(new ArrayList<>(path));
            path.remove(path.size() - 1);
            // recurse to factor remaining/f further, factors >= f
            backtrack(remaining / f, f, path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
        walkthrough: [
          "n=12. backtrack(remaining=12, start=2, path=[]).",
          "f=2 divides 12: path=[2], emit [2,6]. Recurse backtrack(6, start=2, path=[2]).",
          "  f=2 divides 6: path=[2,2], emit [2,2,3]. Recurse backtrack(3, start=2): 2*2>3 loop ends, nothing. pop.",
          "f=3 divides 12 (3*3<=12): path=[3], emit [3,4]. Recurse backtrack(4, start=3): 3*3>4 ends. pop. f=4: 4*4=16>12 stop. Result [[2,6],[2,2,3],[3,4]].",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → no factors in [2,1), return empty list.",
      "Prime n → loop finds no divisor up to sqrt(n), return empty list.",
      "The single combination [n] is excluded because every emitted combination has at least two factors.",
    ],
    twists: [
      "**Count factorizations only** → recurse without building the lists, returning a count.",
      "**Factors must be prime** → restrict candidates to primes, yielding the prime factorization tree.",
      "**Distinct factors only** → forbid repeating a factor, changing the recursion start to f+1.",
    ],
    related: ["combination-sum", "combinations", "subsets"],
  },

  {
    slug: "numbers-with-same-consecutive-differences",
    title: "Numbers With Same Consecutive Differences",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 967,
    statement:
      "Given two integers `n` and `k`, return **all non-negative integers of length `n`** such that the absolute difference between every two consecutive digits is exactly `k`. The numbers must **not** contain leading zeros (except that the single number `0` is allowed only when `n == 1`). Return the answers in any order.",
    examples: [
      { in: "n=3, k=7", out: "[181,292,707,818,929]", note: "each consecutive digit pair differs by 7" },
      { in: "n=2, k=1", out: "[10,12,21,23,32,34,43,45,54,56,65,67,76,78,87,89,98]" },
      { in: "n=2, k=0", out: "[11,22,33,44,55,66,77,88,99]", note: "k=0 means repeated digits" },
    ],
    constraints: ["2 ≤ n ≤ 9", "0 ≤ k ≤ 9"],
    recognize:
      "Build digit strings where each next digit is +/- k from the previous → **backtracking** digit by digit, branching to the (at most) two valid next digits, starting from a nonzero first digit.",
    figureItOut: [
      "A number is built digit by digit. The first digit must be 1..9 (no leading zero, since n >= 2). Each subsequent digit is constrained to differ from the previous digit by exactly k, so it is either `prev + k` or `prev - k`.",
      "Backtracking state: the number assembled so far and how many digits remain. From the current last digit, the only candidates are `last + k` and `last - k`, each kept only if it lies in 0..9. When k == 0 these two coincide (one branch), avoiding duplicate numbers.",
      "Recurse: append a valid next digit, decrement the remaining count, and continue. When the length reaches n, the assembled number is complete and is recorded.",
      "**Base/termination**: start the recursion from each first digit 1..9 with n-1 digits left; emit the number when no digits remain. Because branching is bounded (1 or 2 per step) and depth is n <= 9, the search is tiny.",
    ],
    approaches: [
      {
        name: "Digit-by-digit backtracking with +/- k branching (optimal)",
        intuition: "Fix a nonzero first digit, then repeatedly branch to last+k and last-k while they stay in 0..9; collect every completed n-digit number.",
        time: "O(2^n)",
        timeWhy: "At most two branches per digit over n <= 9 digits, so at most a few hundred numbers.",
        space: "O(n)",
        spaceWhy: "Recursion depth equals the number length n; output list aside.",
        code: `List<Integer> numsSameConsecDiff(int n, int k) {
    List<Integer> result = new ArrayList<>();
    for (int first = 1; first <= 9; first++) {
        backtrack(first, n - 1, k, result);
    }
    return result;
}
void backtrack(int current, int remaining, int k, List<Integer> result) {
    if (remaining == 0) {
        result.add(current);
        return;
    }
    int last = current % 10;
    int up = last + k;
    int down = last - k;
    if (up <= 9) {
        backtrack(current * 10 + up, remaining - 1, k, result);
    }
    if (down >= 0 && k != 0) {        // avoid duplicate when k == 0
        backtrack(current * 10 + down, remaining - 1, k, result);
    }
}`,
        walkthrough: [
          "n=3, k=7. Try first digits 1..9.",
          "first=1: last=1, up=8 (<=9) -> 18, down=-6 (<0) skip. From 18: last=8, up=15 skip, down=1 -> 181. remaining 0 -> emit 181.",
          "first=2: 2 -> up=9 -> 29 -> last=9 up=16 skip down=2 -> 292. emit 292.",
          "first=7: 7 -> down=0 -> 70 -> last=0 up=7 -> 707. first=8 -> 818, first=9 -> 929. Result [181,292,707,818,929].",
        ],
      },
    ],
    edgeCases: [
      "k == 0 → every digit equals the first; suppress the duplicate down-branch so each repeated-digit number appears once.",
      "No valid continuation (e.g. first digit too small for a needed down-step) → that branch dies, producing nothing.",
      "n >= 2 guaranteed, so leading zero is always disallowed; the single 0 case for n==1 does not arise here.",
    ],
    twists: [
      "**Allow leading zeros / fixed length strings** → also start the first digit at 0.",
      "**Difference at most k instead of exactly k** → branch to all digits within distance k.",
      "**Return as strings** → build a char buffer instead of integer arithmetic for very large n.",
    ],
    related: ["letter-combinations-of-a-phone-number", "combinations", "restore-ip-addresses"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "minimum-cost-to-move-chips-to-the-same-position",
    title: "Minimum Cost to Move Chips to the Same Position",
    difficulty: "Easy",
    pattern: "greedy",
    leetcode: 1217,
    statement:
      "There are chips at given integer positions; `position[i]` is the position of the i-th chip. You may move any chip by **2** units (left or right) at **cost 0**, or by **1** unit at **cost 1**, as many times as you like. Return the **minimum total cost** to move all chips to the **same** position (any single position).",
    examples: [
      { in: "position=[1,2,3]", out: "1", note: "move the chip at 3 to 1 for free (by 2), then move 2 to 1 for cost 1" },
      { in: "position=[2,2,2,3,3]", out: "2", note: "move the two 3s to 2 (cost 1 each) -> total 2" },
      { in: "position=[1,1000000000]", out: "1", note: "parity differs by 1, so exactly one cost-1 move" },
    ],
    constraints: ["1 ≤ position.length ≤ 100", "1 ≤ position[i] ≤ 10^9"],
    recognize:
      "Moves of 2 are free, moves of 1 cost 1 → only the **parity** of each position matters; a textbook **greedy**: gather all chips onto the cheaper parity class, paying 1 per chip that must flip parity.",
    figureItOut: [
      "Moving a chip by 2 is free, so any chip can reach any **same-parity** position for nothing. Therefore all even-position chips can pile onto a single even spot for free, and all odd-position chips onto a single odd spot for free.",
      "The only nonzero cost is changing a chip parity (an odd-to-even or even-to-odd shift of 1), which costs exactly 1 per such chip regardless of distance (the rest of the distance is covered by free 2-steps).",
      "So count how many chips sit on even positions (`even`) and how many on odd positions (`odd`). To unite everyone, move the smaller group across the parity gap, paying 1 per chip moved: the answer is `min(even, odd)`.",
      "This greedy is optimal: any target position is either even or odd, and all chips of the opposite parity must each pay exactly 1, so choosing the parity with fewer chips minimizes total cost. Distance is irrelevant beyond parity.",
    ],
    approaches: [
      {
        name: "Count parities, move the smaller class (optimal)",
        intuition: "Free 2-moves make distance irrelevant; only parity flips cost, so pay 1 per chip in whichever parity group is smaller.",
        time: "O(n)",
        timeWhy: "A single pass tallies even-position and odd-position chips.",
        space: "O(1)",
        spaceWhy: "Two integer counters.",
        code: `int minCostToMoveChips(int[] position) {
    int even = 0, odd = 0;
    for (int p : position) {
        if (p % 2 == 0) even++;
        else odd++;
    }
    return Math.min(even, odd);
}`,
        walkthrough: [
          "position=[2,2,2,3,3]. even: 2,2,2 -> 3. odd: 3,3 -> 2.",
          "Unite everyone on the even parity: the 2 odd chips each flip parity at cost 1.",
          "min(even, odd) = min(3, 2) = 2.",
          "Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "All chips already same parity → min(even, odd) = 0, no cost.",
      "Single chip → cost 0 (already gathered).",
      "Large coordinates (up to 10^9) are irrelevant; only parity is examined, so no overflow concern.",
    ],
    twists: [
      "**Free move of size m, paid move of size 1** → group by residue mod m and pay for the (m-1) smaller residue classes optimally.",
      "**Different cost for the unit move** → multiply min(even, odd) by that cost.",
      "**Target must be an occupied position** → still parity-driven; the cheaper parity wins.",
    ],
    related: ["assign-cookies", "candy", "minimum-deletions-to-make-string-balanced"],
  },

  {
    slug: "minimum-deletions-to-make-string-balanced",
    title: "Minimum Deletions to Make String Balanced",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1653,
    statement:
      "You are given a string `s` consisting only of the characters `'a'` and `'b'`. You may delete any characters. The string is **balanced** if there is **no pair of indices** `i < j` with `s[i] == 'b'` and `s[j] == 'a'` — equivalently, after deletions all remaining `'a'`s come before all remaining `'b'`s. Return the **minimum number of deletions** to make `s` balanced.",
    examples: [
      { in: 's="aababbab"', out: "2", note: "delete the two out-of-place chars to get aaabbb or aabbbb" },
      { in: 's="bbaaaaabb"', out: "2", note: "delete the two leading b characters" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^5", "s[i] is either 'a' or 'b'"],
    recognize:
      "Make every 'a' precede every 'b' with fewest deletions → a **greedy single pass**: track how many 'b's have been seen; each 'a' that follows a 'b' must either be deleted or all preceding 'b's deleted — keep the cheaper running choice.",
    figureItOut: [
      "A balanced string is `a...ab...b`: some prefix of 'a's then a suffix of 'b's. The cost of a character depends on conflicts: a 'b' before a later 'a' is a violation. We want the minimum deletions resolving all such inversions.",
      "Scan left to right tracking `bCount` = number of 'b's kept so far, and a running `deletions`. When we meet an `'a'` that comes after some `'b'`s, we face a choice: **delete this 'a'** (cost 1) or **delete all the 'b's seen so far** (cost bCount). Greedily take the cheaper: `deletions += min(1, bCount)`, and if we chose to drop the b-block, reset bCount to 0.",
      "Concretely: for each character, if it is 'b' increment bCount; if it is 'a' and bCount > 0, set `deletions = min(deletions + 1, deletions + bCount)` — i.e. add `min(1, bCount)` — and when `bCount < 1` is impossible so the add is `min(1,bCount)`; practically `deletions += 1` if keeping the a is cheaper, else collapse the b-block. The standard form: `if 'a' and bCount>0: deletions = min(deletions+1, ...)`.",
      "Cleanest equivalent: keep `deletions` and `bCount`; on 'b' do bCount++; on 'a' do `deletions = min(deletions + 1, bCount)`. Here `deletions + 1` deletes this a; `bCount` represents deleting all kept b's instead (which also wipes any earlier paid a-deletions implicitly). The final `deletions` is the answer.",
    ],
    approaches: [
      {
        name: "Single-pass greedy: delete this 'a' or the b-block, whichever is cheaper (optimal)",
        intuition: "Each 'a' that trails some 'b's forces a choice; greedily keep the running minimum of deleting the lone 'a' versus deleting all preceding 'b's.",
        time: "O(n)",
        timeWhy: "One linear scan with O(1) work per character.",
        space: "O(1)",
        spaceWhy: "Two integer counters.",
        code: `int minimumDeletions(String s) {
    int deletions = 0;   // running minimum deletions to balance the prefix
    int bCount = 0;      // number of 'b's kept so far
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == 'b') {
            bCount++;
        } else {
            // an 'a' after some 'b's: delete this a (deletions+1) or delete all kept b's (bCount)
            deletions = Math.min(deletions + 1, bCount);
        }
    }
    return deletions;
}`,
        walkthrough: [
          's="aababbab". Start deletions=0, bCount=0.',
          "i=0 a: deletions=min(0+1, 0)=0. i=1 a: min(1,0)=0. i=2 b: bCount=1.",
          "i=3 a: deletions=min(0+1, 1)=1. i=4 b: bCount=2. i=5 b: bCount=3.",
          "i=6 a: deletions=min(1+1, 3)=2. i=7 b: bCount=4. Final deletions=2. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "Already balanced (all a's before all b's) → no 'a' ever trails a 'b', deletions stays 0.",
      "All same character ('aaaa' or 'bbbb') → already balanced, answer 0.",
      "The greedy min keeps the cheaper of dropping a single 'a' versus collapsing the entire kept b-block, never over-counting.",
    ],
    twists: [
      "**Prefix/suffix counting DP** → for each split point, deletions = (b's in prefix) + (a's in suffix); take the minimum split.",
      "**More than two letters with an ordering** → generalizes to longest non-decreasing subsequence by that order.",
      "**Allow swaps instead of deletions** → a different cost model entirely.",
    ],
    related: ["partition-labels", "valid-parenthesis-string", "minimum-add-to-make-parentheses-valid"],
  },
];
