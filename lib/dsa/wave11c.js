// NeetCode All — wave 11c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave10c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods.
export const WAVE11C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "maximum-alternating-subsequence-sum",
    title: "Maximum Alternating Subsequence Sum",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 1911,
    statement:
      "The **alternating sum** of a subsequence is the sum of elements at even indices (within the subsequence) minus the sum at odd indices — the first chosen element is added, the second subtracted, the third added, and so on. Given `nums`, delete any elements (keeping order) to form a subsequence and return the **maximum possible alternating sum**.",
    examples: [
      { in: "nums=[4,2,5,3]", out: "7", note: "subsequence [4,2,5] gives 4-2+5=7" },
      { in: "nums=[5,6,7,8]", out: "8", note: "just [8]" },
      { in: "nums=[6,2,1,2,4,5]", out: "10", note: "[6,1,5] gives 6-1+5=10" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁵"],
    recognize:
      "At each element you decide keep-or-skip, and a kept element's sign depends only on whether the chosen subsequence so far has even or odd length → carry that **parity as a tiny state** and you get a two-track 1-D DP.",
    figureItOut: [
      "**State**: walking left to right, the only thing that matters about the past is the *parity of the subsequence length chosen so far*, because that fixes whether the next kept element is added or subtracted. So keep two running bests: `even` = best alternating sum when the chosen subsequence has even length (the next pick would be ADDED), and `odd` = best when it has odd length (the next pick would be SUBTRACTED).",
      "**Recurrence**: for each `x = nums[i]`, you may extend. Picking `x` onto an even-length subsequence makes it odd and adds `x`: `newOdd = max(odd, even + x)`. Picking `x` onto an odd-length subsequence makes it even and subtracts `x`: `newEven = max(even, odd - x)`. Update both simultaneously from the old values.",
      "**Base case**: before seeing any element, `even = 0` (empty subsequence, even length, sum 0) and `odd = -infinity` (no odd-length subsequence exists yet, so it must never be chosen).",
      "**Fill**: sweep `i` from 0 to n-1, updating `(even, odd)` each step in O(1) using the *previous* pair (compute both news from olds before assigning).",
      "The answer is `max(even, odd)` at the end: the optimal subsequence may end on an added element (odd length, value in `odd`) or, after a final subtraction, in `even`; taking the max of the two tracks covers both.",
    ],
    approaches: [
      {
        name: "Two-track parity DP (optimal)",
        intuition: "Track best sums for even- and odd-length subsequences; each element extends one track into the other, adding or subtracting itself.",
        time: "O(n)",
        timeWhy: "One pass, constant work per element.",
        space: "O(1)",
        spaceWhy: "Two scalar running bests.",
        code: `long maxAlternatingSum(int[] nums) {
    long even = 0;                 // best sum, chosen subsequence has even length
    long odd = Long.MIN_VALUE / 4; // best sum, chosen subsequence has odd length
    for (int x : nums) {
        long newOdd = Math.max(odd, even + x);  // add x, length becomes odd
        long newEven = Math.max(even, odd - x); // subtract x, length becomes even
        odd = newOdd;
        even = newEven;
    }
    return Math.max(even, odd);
}`,
        walkthrough: [
          "nums=[4,2,5,3]. Start even=0, odd=-inf.",
          "x=4: newOdd=max(-inf,0+4)=4; newEven=max(0,-inf-4)=0. -> odd=4, even=0.",
          "x=2: newOdd=max(4,0+2)=4; newEven=max(0,4-2)=2. -> odd=4, even=2.",
          "x=5: newOdd=max(4,2+5)=7; newEven=max(2,4-5)=2. -> odd=7, even=2.",
          "x=3: newOdd=max(7,2+3)=7; newEven=max(2,7-3)=4. -> odd=7, even=4. Answer = max(even,odd) = max(4,7) = 7, the subsequence [4,2,5].",
        ],
      },
    ],
    edgeCases: [
      "Single element → answer is that element (pick it, add it).",
      "Strictly increasing → keep only the last element (any earlier add would be cancelled by a smaller-net subtraction pattern); answer is max element when increasing.",
      "Return max(even, odd) to be safe: the optimal subsequence may end on an added element (odd length).",
    ],
    twists: [
      "**Fix the subsequence length k** → add k to the state (dp[i][k][parity]).",
      "**House Robber (LeetCode 198)** → same 'keep-or-skip with carried state' shape, different recurrence.",
      "**Maximize plain alternating signs over the whole array (no deletion)** → a simple linear scan, no DP.",
    ],
    related: ["house-robber", "maximum-subarray", "wiggle-subsequence"],
  },

  {
    slug: "filling-bookcase-shelves",
    title: "Filling Bookcase Shelves",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 1105,
    statement:
      "You place `books` on a shelf **in order** (you cannot reorder them). Each `books[i] = [thickness, height]`. Shelves have a fixed width `shelfWidth`; books on one shelf must fit within it (sum of thicknesses ≤ `shelfWidth`), and a shelf's height is the **tallest** book on it. After placing a contiguous group on a shelf, the next group starts a new shelf below. Return the **minimum total height** of the bookcase.",
    examples: [
      { in: "books=[[1,1],[2,3],[2,3],[1,1],[1,1],[1,1],[1,2]], shelfWidth=4", out: "6" },
      { in: "books=[[1,3],[2,4],[3,2]], shelfWidth=6", out: "4", note: "all on one shelf, height=max(3,4,2)=4" },
    ],
    constraints: ["1 ≤ books.length ≤ 1000", "1 ≤ thickness ≤ shelfWidth ≤ 1000", "1 ≤ height ≤ 1000"],
    recognize:
      "Books go in fixed order and each shelf is a **contiguous run**, so the question is 'where do the shelf breaks fall'. The min height to place the first `i` books depends only on shorter prefixes → **1-D DP over the prefix length**, trying every last-shelf grouping.",
    figureItOut: [
      "**State**: `dp[i]` = the minimum total bookcase height to place the **first `i` books** (a prefix). Order is fixed, so a prefix fully describes the subproblem.",
      "**Recurrence**: the last shelf holds some contiguous suffix of the prefix — books `j..i` for some `j ≤ i`. As long as their thicknesses fit in `shelfWidth`, that shelf adds `max height among books j..i`, on top of `dp[j-1]`. So `dp[i] = min over valid j of ( dp[j-1] + maxHeight(j..i) )`. Extend the last shelf leftward, accumulating width and running max height.",
      "**Base case**: `dp[0] = 0` — placing zero books needs zero height.",
      "**Fill**: for each `i` from 1 to n, walk `j` from `i` down to 1, adding `books[j-1]` thickness until it would overflow `shelfWidth`; track the running max height of that growing last shelf and relax `dp[i]`.",
      "The answer is `dp[n]`.",
    ],
    approaches: [
      {
        name: "Prefix DP trying every last-shelf split (optimal)",
        intuition: "dp[i] = best for first i books; the last shelf is a contiguous suffix that fits the width — try all such suffixes.",
        time: "O(n²)",
        timeWhy: "For each prefix end i, the inner loop walks back over candidate shelf starts.",
        space: "O(n)",
        spaceWhy: "A dp array over prefix lengths.",
        code: `int minHeightShelves(int[][] books, int shelfWidth) {
    int n = books.length;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        dp[i] = Integer.MAX_VALUE;
        int width = 0, height = 0;
        for (int j = i; j >= 1; j--) {
            width += books[j - 1][0];
            if (width > shelfWidth) break;
            height = Math.max(height, books[j - 1][1]);
            dp[i] = Math.min(dp[i], dp[j - 1] + height);
        }
    }
    return dp[n];
}`,
        walkthrough: [
          "books=[[1,3],[2,4],[3,2]], shelfWidth=6. dp[0]=0.",
          "dp[1]: last shelf={book0} width1 h3 -> dp[0]+3=3. dp[1]=3.",
          "dp[2]: {book1} w2 h4 -> dp[1]+4=7; {book0,book1} w3 h4 -> dp[0]+4=4. dp[2]=4.",
          "dp[3]: {book2} w3 h2 -> dp[2]+2=6; {book1,book2} w5 h4 -> dp[1]+4=7; {book0,book1,book2} w6 h4 -> dp[0]+4=4. dp[3]=4. Answer 4.",
        ],
      },
    ],
    edgeCases: [
      "Single book → its own height.",
      "All books fit on one shelf → answer is the max height of all books.",
      "A book with thickness == shelfWidth → it must occupy a shelf alone.",
    ],
    twists: [
      "**Books reorderable** → becomes a much harder bin-packing-style optimization, not this clean prefix DP.",
      "**Limit number of shelves to k** → add a shelf-count dimension: dp[i][k].",
      "**Partition Array for Maximum Sum (LeetCode 1043)** → the same 'last contiguous group' prefix DP with a different group cost.",
    ],
    related: ["partition-array-for-maximum-sum", "word-break", "minimum-cost-for-tickets"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "cherry-pickup",
    title: "Cherry Pickup",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 741,
    statement:
      "On an `n × n` grid, `grid[r][c]` is `1` (a cherry), `0` (empty), or `-1` (a thorn you cannot pass). Start at `(0,0)`, walk right/down to `(n-1,n-1)` collecting cherries, then walk left/up back to `(0,0)`. You may collect each cherry only once (picking it sets the cell to 0). Return the **maximum cherries** collectible; if no valid round trip exists, return 0.",
    examples: [
      { in: "grid=[[0,1,-1],[1,0,-1],[1,1,1]]", out: "5" },
      { in: "grid=[[1,1,-1],[1,-1,1],[-1,1,1]]", out: "0", note: "no thorn-free round trip" },
    ],
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 50", "grid[i][j] is -1, 0, or 1", "grid[0][0] and grid[n-1][n-1] are not -1"],
    recognize:
      "A down trip and a return trip is equivalent to **two people walking simultaneously from (0,0) to (n-1,n-1)**, both moving right/down. Two synchronized walkers on a grid → DP keyed on both positions, collapsed by the shared step count → **2-D-ish grid DP (3 free coordinates)**.",
    figureItOut: [
      "**Reframe**: a path down then back is the same total cherry count as two paths both going from top-left to bottom-right (reverse the return leg). So simulate **two walkers** moving together, step by step, each taking right/down.",
      "**State**: after `t` total steps, walker 1 is at `(r1, t - r1)` and walker 2 at `(r2, t - r2)` — the column is forced by the step count, so the state is `(t, r1, r2)`, three coordinates instead of four. Let `dp[r1][r2]` for the current step `t` = max cherries collected by both walkers reaching those rows.",
      "**Recurrence**: each walker came from 'above' or 'from the left', so 4 predecessor combinations: `(r1-1,r2-1),(r1-1,r2),(r1,r2-1),(r1,r2)`. Take the best valid predecessor, add `grid[r1][c1]`, and add `grid[r2][c2]` **only if the two walkers are on different cells** (else count that cell once). If either cell is a thorn (-1), the state is invalid.",
      "**Base case**: `dp` at `t=0` is `grid[0][0]` at `(0,0,0)`; all other states start as 'unreachable' (negative infinity).",
      "**Fill**: iterate `t` from 1 to `2(n-1)`; for each `(r1, r2)` with valid columns `c1=t-r1, c2=t-r2`, combine the 4 predecessors. The answer is `dp[n-1][n-1]` after the last step, clamped to 0 if it stayed unreachable.",
    ],
    approaches: [
      {
        name: "Two-walker grid DP (optimal)",
        intuition: "Both walkers move from (0,0) to (n-1,n-1) in lockstep; step count fixes columns, so the state is (step, row1, row2); add the shared cell once.",
        time: "O(n³)",
        timeWhy: "2n steps times n×n row pairs, constant work each.",
        space: "O(n²)",
        spaceWhy: "Two row×row layers (current and previous step).",
        code: `int cherryPickup(int[][] grid) {
    int n = grid.length;
    int NEG = Integer.MIN_VALUE / 4;
    int[][] dp = new int[n][n];
    for (int[] row : dp) Arrays.fill(row, NEG);
    dp[0][0] = grid[0][0];
    for (int t = 1; t <= 2 * (n - 1); t++) {
        int[][] next = new int[n][n];
        for (int[] row : next) Arrays.fill(row, NEG);
        for (int r1 = 0; r1 < n; r1++) {
            int c1 = t - r1;
            if (c1 < 0 || c1 >= n || grid[r1][c1] == -1) continue;
            for (int r2 = 0; r2 < n; r2++) {
                int c2 = t - r2;
                if (c2 < 0 || c2 >= n || grid[r2][c2] == -1) continue;
                int best = NEG;
                for (int d1 = -1; d1 <= 0; d1++) {
                    for (int d2 = -1; d2 <= 0; d2++) {
                        int pr1 = r1 + d1, pr2 = r2 + d2;
                        if (pr1 >= 0 && pr2 >= 0) best = Math.max(best, dp[pr1][pr2]);
                    }
                }
                if (best == NEG) continue;
                int gain = grid[r1][c1];
                if (r1 != r2) gain += grid[r2][c2];
                next[r1][r2] = best + gain;
            }
        }
        dp = next;
    }
    return Math.max(0, dp[n - 1][n - 1]);
}`,
        walkthrough: [
          "grid=[[0,1,-1],[1,0,-1],[1,1,1]], n=3. dp[0][0]=grid[0][0]=0 at t=0.",
          "Walkers march together; one effectively takes the high road (right then down through (0,1)=1) and the other the low road (down through (1,0)=1,(2,0)=1).",
          "By the final step both reach (2,2). The two disjoint paths collect cherries at (0,1),(1,0),(2,0),(2,1),(2,2) = 5 total (shared cells counted once).",
          "dp[2][2] after t=4 equals 5. Answer 5.",
        ],
      },
    ],
    edgeCases: [
      "No thorn-free round trip → some required state stays unreachable → return 0.",
      "n == 1 → answer is grid[0][0] (0 or 1).",
      "When both walkers sit on the same cell, count its cherry once (the r1 != r2 guard).",
    ],
    twists: [
      "**Cherry Pickup II (LeetCode 1463)** → two robots from the two top corners; same two-walker idea, no return leg.",
      "**Greedy two passes** is WRONG → the best down-path and best return-path interact, so they must be optimized jointly.",
      "**Allow k trips** → a much larger state; the 2-walker collapse no longer suffices.",
    ],
    related: ["cherry-pickup-ii", "minimum-path-sum", "unique-paths-ii"],
  },

  {
    slug: "minimum-cost-to-cut-a-stick",
    title: "Minimum Cost to Cut a Stick",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 1547,
    statement:
      "A wooden stick of length `n` (positions `0..n`) must be cut at every position in `cuts`. You may perform the cuts in **any order**; the cost of one cut equals the **current length of the stick piece being cut**. After a cut, the piece splits into two and subsequent cuts apply to the relevant smaller piece. Return the **minimum total cost** of all cuts.",
    examples: [
      { in: "n=7, cuts=[1,3,4,5]", out: "16" },
      { in: "n=9, cuts=[5,6,1,4,2]", out: "22" },
    ],
    constraints: ["2 ≤ n ≤ 10⁶", "1 ≤ cuts.length ≤ 100", "1 ≤ cuts[i] ≤ n-1", "all cuts are distinct"],
    recognize:
      "Order of cuts changes total cost, and a cut splits a piece into two independent subpieces between two boundary cuts → classic **interval / range DP** on the sorted cut positions: state keyed on the two boundary indices.",
    figureItOut: [
      "Sort the cut positions and pad with the stick ends: `points = [0] + sorted(cuts) + [n]`. Every piece during the process is exactly a span between two of these boundary points.",
      "**State**: `dp[i][j]` = the minimum cost to make **all cuts strictly between** boundary points `points[i]` and `points[j]` (on the piece spanning `points[i]..points[j]`). The two boundary indices fully describe a subproblem.",
      "**Recurrence**: the *first* cut you make on the piece `points[i..j]` is some interior point `points[k]` (`i < k < j`); it costs the whole piece length `points[j] - points[i]`, then leaves two independent pieces. `dp[i][j] = (points[j] - points[i]) + min over i<k<j of ( dp[i][k] + dp[k][j] )`.",
      "**Base case**: `dp[i][j] = 0` when there is **no** interior cut point (`j == i+1`) — nothing to cut, no cost.",
      "**Fill**: iterate by increasing span (gap `j - i` from 2 upward) so both subpieces `dp[i][k]` and `dp[k][j]` are already computed. The answer is `dp[0][m-1]` where `m = points.length`.",
    ],
    approaches: [
      {
        name: "Range DP over boundary points (optimal)",
        intuition: "Add 0 and n as boundaries; dp[i][j] = cost to cut the piece between points i and j; try every first cut k, paying the piece length plus the two halves.",
        time: "O(m³)",
        timeWhy: "m = cuts+2 boundary points; m² intervals each trying up to m split points.",
        space: "O(m²)",
        spaceWhy: "The boundary-pair table.",
        code: `int minCost(int n, int[] cuts) {
    int c = cuts.length;
    int[] points = new int[c + 2];
    points[0] = 0;
    points[c + 1] = n;
    for (int i = 0; i < c; i++) points[i + 1] = cuts[i];
    Arrays.sort(points);
    int m = points.length;
    int[][] dp = new int[m][m];
    for (int len = 2; len < m; len++) {
        for (int i = 0; i + len < m; i++) {
            int j = i + len;
            int best = Integer.MAX_VALUE;
            for (int k = i + 1; k < j; k++) {
                best = Math.min(best, dp[i][k] + dp[k][j]);
            }
            dp[i][j] = best + (points[j] - points[i]);
        }
    }
    return dp[0][m - 1];
}`,
        walkthrough: [
          "n=7, cuts=[1,3,4,5]. points=[0,1,3,4,5,7], m=6. Spans of len 2 (adjacent) cost 0 (no interior cut).",
          "len3 e.g. dp[0][2] (span 0..3, one interior cut at 1): cost (3-0)+dp[0][1]+dp[1][2]=3. dp[3][5] (4..7, interior 5): (7-4)+0+0=3.",
          "Larger spans combine: e.g. dp[2][5] (3..7, interiors 4,5) = min over first cut: (7-3)+best two halves = 4 + min(dp[2][3]+dp[3][5], dp[2][4]+dp[4][5]) = 4 + min(0+3, 3+0) = 7.",
          "Top: dp[0][5] (0..7, all cuts) = (7-0)+min over first cut of the two halves = 7 + 9 = 16. Answer 16.",
        ],
      },
    ],
    edgeCases: [
      "A single cut → cost is exactly n (one cut on the full stick).",
      "Cuts already sorted or not → sorting the padded points handles any input order.",
      "Adjacent boundary points (no interior cut) → dp = 0, the recursion base.",
    ],
    twists: [
      "**Burst Balloons (LeetCode 312)** → the same interval DP where you pick the LAST action instead of the first.",
      "**Memoized recursion** → top-down on (i,j) is an equivalent, sometimes clearer, implementation.",
      "**Cuts must follow a given order** → no longer free to reorder; the range-DP optimization disappears.",
    ],
    related: ["burst-balloons", "stone-game", "minimum-cost-for-tickets"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "find-if-path-exists-in-graph",
    title: "Find if Path Exists in Graph",
    difficulty: "Easy",
    pattern: "graphs",
    leetcode: 1971,
    statement:
      "You have an **undirected** graph of `n` nodes labeled `0..n-1`, described by an `edges` list of bidirectional connections. Given a `source` and a `destination`, return `true` if there exists a path from `source` to `destination`, else `false`.",
    examples: [
      { in: "n=3, edges=[[0,1],[1,2],[2,0]], source=0, destination=2", out: "true" },
      { in: "n=6, edges=[[0,1],[0,2],[3,5],[5,4],[4,3]], source=0, destination=5", out: "false", note: "two separate components" },
    ],
    constraints: ["1 ≤ n ≤ 2·10⁵", "0 ≤ edges.length ≤ 2·10⁵", "edges[i].length == 2", "no self-loops, no duplicate edges"],
    recognize:
      "'Are two nodes in the same connected component of an undirected graph' → the textbook **reachability** question: build adjacency, then DFS/BFS from the source (or use union-find), and check whether the destination is reached.",
    figureItOut: [
      "Build an adjacency list from the edge list: for each `[a,b]`, add `b` to `a`'s neighbours and `a` to `b`'s (undirected → both directions).",
      "Reachability = a traversal from `source` that marks every node it can touch. Run BFS or DFS, marking visited nodes so you never revisit (which also prevents infinite loops on cycles).",
      "If during the traversal you ever reach `destination`, return true immediately. If the traversal completes without touching it, the two nodes are in different components → false.",
      "Edge shortcut: if `source == destination`, the path of length 0 exists → true.",
    ],
    approaches: [
      {
        name: "BFS reachability",
        intuition: "Build adjacency, BFS from source marking visited; success the moment destination is dequeued/seen.",
        time: "O(V + E)",
        timeWhy: "Each node and edge is examined a constant number of times.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list plus the visited array and queue.",
        code: `boolean validPath(int n, int[][] edges, int source, int destination) {
    if (source == destination) return true;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    boolean[] visited = new boolean[n];
    Deque<Integer> queue = new ArrayDeque<>();
    queue.add(source);
    visited[source] = true;
    while (!queue.isEmpty()) {
        int cur = queue.poll();
        for (int nb : adj.get(cur)) {
            if (nb == destination) return true;
            if (!visited[nb]) {
                visited[nb] = true;
                queue.add(nb);
            }
        }
    }
    return false;
}`,
        walkthrough: [
          "n=6, edges include 0-1,0-2 and 3-5,5-4,4-3. source=0, destination=5.",
          "BFS from 0 visits 1 and 2, then their neighbours (none new). Queue drains having seen only {0,1,2}.",
          "5 is in the other component {3,4,5}, never reached. Return false.",
        ],
      },
      {
        name: "Union-Find (alternative)",
        intuition: "Union every edge, then check whether source and destination share a root.",
        time: "O(V + E α(V))",
        timeWhy: "Near-linear: each edge does an almost-constant union.",
        space: "O(V)",
        spaceWhy: "The parent array.",
        code: `int[] parent;
boolean validPath(int n, int[][] edges, int source, int destination) {
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    for (int[] e : edges) union(e[0], e[1]);
    return find(source) == find(destination);
}
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
void union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) parent[ra] = rb;
}`,
      },
    ],
    edgeCases: [
      "source == destination → true (even with no edges).",
      "No edges and source != destination → false.",
      "Disconnected components → only nodes in the source's component are reachable.",
    ],
    twists: [
      "**Number of Connected Components (LeetCode 323)** → count components instead of one reachability query.",
      "**Many source/destination queries** → union-find precomputes components so each query is O(1).",
      "**Directed graph** → reachability is one-way; build a directed adjacency and DFS only along out-edges.",
    ],
    related: ["number-of-connected-components-in-an-undirected-graph", "graph-valid-tree", "clone-graph"],
  },

  {
    slug: "count-sub-islands",
    title: "Count Sub Islands",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1905,
    statement:
      "Given two `m × n` binary grids `grid1` and `grid2` (1 = land, 0 = water; islands are 4-directionally connected land), an island in `grid2` is a **sub-island** if **every** cell of that island is also land in `grid1`. Return the **number of sub-islands** in `grid2`.",
    examples: [
      { in: "grid1=[[1,1,1,0,0],[0,1,1,1,1],[0,0,0,0,0],[1,0,0,0,0],[1,1,0,1,1]], grid2=[[1,1,1,0,0],[0,0,1,1,1],[0,1,0,0,0],[1,0,1,1,0],[0,1,0,1,0]]", out: "3" },
      { in: "grid1=[[1,0,1,0,1],[1,1,1,1,1],[0,0,0,0,0],[1,1,1,1,1],[1,0,1,0,1]], grid2=[[0,0,0,0,0],[1,1,1,1,1],[0,1,0,1,0],[0,1,0,1,0],[1,0,0,0,1]]", out: "2" },
    ],
    constraints: ["m == grid1.length == grid2.length", "n == grid1[i].length == grid2[i].length", "1 ≤ m, n ≤ 500", "cells are 0 or 1"],
    recognize:
      "Standard **island flood-fill** (connected components in a grid) with one twist: while flooding a grid2 island, verify each of its cells is land in grid1. 'Connected land regions, with a per-region property' → DFS/BFS over the grid.",
    figureItOut: [
      "Iterate every cell of `grid2`. When you find an unvisited land cell, it's the seed of a new island — flood-fill (DFS/BFS) the whole connected island, marking cells visited so each island is counted once.",
      "During the flood, check the **sub-island condition**: a grid2 island qualifies only if **every** cell is also land in `grid1`. Use a flag that starts true and turns false the moment any island cell has `grid1[r][c] == 0`.",
      "Crucial: do NOT short-circuit the flood when the flag goes false — you must keep flooding to mark the *entire* island visited (otherwise its remaining cells re-seed a duplicate count). Just remember the failure.",
      "After fully flooding the island, if the flag stayed true, increment the sub-island count. Sum over all islands.",
    ],
    approaches: [
      {
        name: "Flood-fill each grid2 island, check containment (optimal)",
        intuition: "DFS each grid2 island fully; it counts only if no cell falls on water in grid1.",
        time: "O(m·n)",
        timeWhy: "Each cell is visited once across all flood-fills.",
        space: "O(m·n)",
        spaceWhy: "Visited grid plus the DFS stack/recursion in the worst case.",
        code: `int countSubIslands(int[][] grid1, int[][] grid2) {
    int m = grid2.length, n = grid2[0].length;
    boolean[][] visited = new boolean[m][n];
    int count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid2[r][c] == 1 && !visited[r][c]) {
                boolean isSub = true;
                Deque<int[]> stack = new ArrayDeque<>();
                stack.push(new int[]{r, c});
                visited[r][c] = true;
                while (!stack.isEmpty()) {
                    int[] cell = stack.pop();
                    int cr = cell[0], cc = cell[1];
                    if (grid1[cr][cc] == 0) isSub = false;
                    for (int[] d : dirs) {
                        int nr = cr + d[0], nc = cc + d[1];
                        if (nr >= 0 && nc >= 0 && nr < m && nc < n
                                && grid2[nr][nc] == 1 && !visited[nr][nc]) {
                            visited[nr][nc] = true;
                            stack.push(new int[]{nr, nc});
                        }
                    }
                }
                if (isSub) count++;
            }
        }
    }
    return count;
}`,
        walkthrough: [
          "Scan grid2. The first land cell seeds island A; flood it fully, checking each cell against grid1.",
          "If every cell of island A is land in grid1, isSub stays true -> count it. If any cell sits on grid1 water, isSub flips false (but flooding continues to mark the whole island).",
          "Repeating over all grid2 islands in the first example yields 3 sub-islands.",
        ],
      },
    ],
    edgeCases: [
      "An island touching even one grid1-water cell is NOT a sub-island.",
      "Single-cell islands count if that cell is land in both grids.",
      "All water in grid2 → 0 sub-islands.",
    ],
    twists: [
      "**Number of Islands (LeetCode 200)** → drop the grid1 check, just count grid2 components.",
      "**Count islands of grid2 fully OUTSIDE grid1 land** → flip the condition.",
      "**Union-Find variant** → union grid2 land cells, then verify each component's containment.",
    ],
    related: ["number-of-islands", "max-area-of-island", "surrounded-regions"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "number-of-operations-to-make-network-connected",
    title: "Number of Operations to Make Network Connected",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1319,
    statement:
      "There are `n` computers labeled `0..n-1` connected by ethernet cables, given as `connections[i] = [a, b]`. You may **unplug** any existing cable and **replug** it between any two computers. Return the **minimum number of such moves** to make every computer connected (one network), or `-1` if it's impossible.",
    examples: [
      { in: "n=4, connections=[[0,1],[0,2],[1,2]]", out: "1", note: "move the redundant cable to connect computer 3" },
      { in: "n=6, connections=[[0,1],[0,2],[0,3],[1,2],[1,3]]", out: "2" },
      { in: "n=6, connections=[[0,1],[0,2],[0,3],[1,2]]", out: "-1", note: "only 4 cables, need at least 5" },
    ],
    constraints: ["1 ≤ n ≤ 10⁵", "1 ≤ connections.length ≤ min(n·(n-1)/2, 10⁵)", "no duplicate connections, no self-connections"],
    recognize:
      "Connecting `n` nodes into one network needs at least `n-1` cables. Counting **connected components** and the **redundant (cycle-forming) cables** is exactly what **union-find** gives you: you need `components - 1` moves, feasible iff you have enough spare cables.",
    figureItOut: [
      "First feasibility: to link `n` computers you need at least `n-1` cables total. If `connections.length < n-1`, no amount of moving helps → return -1.",
      "Use **union-find** over the n computers. Process each cable: if it joins two already-connected computers, it's **redundant** (it forms a cycle, so it can be freed and moved); otherwise it merges two components.",
      "After processing, let `components` be the number of disjoint groups. To merge `components` groups into one you need exactly `components - 1` extra cables — and you have at least that many redundant cables available whenever `connections.length >= n-1` (a counting fact: total cables = used merges + redundant, used merges = n - components).",
      "So the answer is `components - 1`. (You never actually need to track redundant cables separately once the n-1 feasibility check passes.)",
    ],
    approaches: [
      {
        name: "Union-Find component count (optimal)",
        intuition: "If fewer than n-1 cables, impossible; otherwise union all cables, count components, and answer components-1.",
        time: "O(n + E α(n))",
        timeWhy: "Near-linear union-find over nodes and cables.",
        space: "O(n)",
        spaceWhy: "The parent array.",
        code: `int[] parent;
int components;
int makeConnected(int n, int[][] connections) {
    if (connections.length < n - 1) return -1;
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    components = n;
    for (int[] c : connections) union(c[0], c[1]);
    return components - 1;
}
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
void union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra != rb) {
        parent[ra] = rb;
        components--;
    }
}`,
        walkthrough: [
          "n=4, connections=[[0,1],[0,2],[1,2]]. Start components=4.",
          "Cable 0-1: merge -> components=3. Cable 0-2: merge (2 joins {0,1}) -> components=2. Cable 1-2: 1 and 2 already together -> redundant, components stays 2.",
          "cables=3 >= n-1=3, feasible. Answer = components-1 = 2-1 = 1 (move the redundant cable to node 3).",
        ],
      },
    ],
    edgeCases: [
      "connections.length < n-1 → -1 immediately (not enough cable).",
      "Already fully connected (components == 1) → 0 moves.",
      "n == 1 → already connected, 0 moves (and 0 cables needed).",
    ],
    twists: [
      "**Graph Valid Tree (LeetCode 261)** → exactly n-1 edges AND one component means a tree.",
      "**Report which cables are redundant** → record edges whose union returns 'already connected'.",
      "**Weighted moves** → if relocating a cable has a cost, it becomes an optimization rather than a count.",
    ],
    related: ["number-of-connected-components-in-an-undirected-graph", "graph-valid-tree", "redundant-connection"],
  },

  {
    slug: "minimum-number-of-vertices-to-reach-all-nodes",
    title: "Minimum Number of Vertices to Reach All Nodes",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1557,
    statement:
      "Given a **directed acyclic graph** of `n` nodes labeled `0..n-1` and an `edges` list where `edges[i] = [from, to]`, find the **smallest set of vertices** from which all nodes are reachable. It is guaranteed a unique minimal solution exists; return it in any order.",
    examples: [
      { in: "n=6, edges=[[0,1],[0,2],[2,5],[3,4],[4,2]]", out: "[0,3]", note: "0 and 3 have no incoming edges" },
      { in: "n=5, edges=[[0,1],[2,1],[3,1],[1,4],[2,4]]", out: "[0,2,3]" },
    ],
    constraints: ["2 ≤ n ≤ 10⁵", "1 ≤ edges.length ≤ min(10⁵, n·(n-1)/2)", "the graph is a DAG", "no duplicate edges"],
    recognize:
      "In a DAG, a node with **no incoming edge can never be reached** from anywhere else, so it MUST be in the set; and every node with an incoming edge is reachable from some such root. So the answer is exactly the set of **zero-in-degree nodes** — a one-pass in-degree count, no traversal needed.",
    figureItOut: [
      "Key insight: a node with **in-degree 0** has no edge pointing to it, so no other node can reach it. Therefore it can only be covered by including it directly → every zero-in-degree node is mandatory.",
      "Conversely, any node with in-degree ≥ 1 has a predecessor; following predecessors backward in a DAG always terminates at some zero-in-degree node (no cycles), so it is already reachable from that root. Hence non-roots are never needed.",
      "So compute the **in-degree** of every node: scan all edges and mark `seen[to] = true` for each destination. No BFS/DFS, no adjacency list required.",
      "The answer is every node `v` with `seen[v] == false` (in-degree zero). Collect and return them.",
    ],
    approaches: [
      {
        name: "Collect zero-in-degree nodes (optimal)",
        intuition: "Mark every node that appears as a destination; the unmarked ones are exactly the unreachable-from-elsewhere roots.",
        time: "O(n + E)",
        timeWhy: "One pass over edges to mark destinations, one pass over nodes to collect roots.",
        space: "O(n)",
        spaceWhy: "A boolean array of which nodes have an incoming edge.",
        code: `List<Integer> findSmallestSetOfVertices(int n, List<List<Integer>> edges) {
    boolean[] hasIncoming = new boolean[n];
    for (List<Integer> e : edges) {
        hasIncoming[e.get(1)] = true;
    }
    List<Integer> res = new ArrayList<>();
    for (int v = 0; v < n; v++) {
        if (!hasIncoming[v]) res.add(v);
    }
    return res;
}`,
        walkthrough: [
          "n=6, edges=[[0,1],[0,2],[2,5],[3,4],[4,2]]. Destinations seen: 1,2,5,4,2 -> hasIncoming = {1,2,4,5}.",
          "Scan nodes 0..5: node 0 has no incoming -> root. Node 3 has no incoming -> root. Nodes 1,2,4,5 all have incoming.",
          "Answer = [0,3]: from 0 reach 1,2,5; from 3 reach 4 then 2.",
        ],
      },
    ],
    edgeCases: [
      "A node with no edges at all → in-degree 0 → it must be in the set (it covers only itself).",
      "Edges may be given as a list of lists; index destination correctly.",
      "Because it's a DAG, there are no cycles to worry about — every chain terminates at a root.",
    ],
    twists: [
      "**Why not BFS from candidates?** → unnecessary; the in-degree argument is provably minimal and O(n+E).",
      "**Graph has cycles (not a DAG)** → this fails; you'd need strongly-connected-component condensation first.",
      "**Course Schedule II (LeetCode 210)** → also uses in-degrees, but to produce a topological order.",
    ],
    related: ["course-schedule-ii", "find-eventual-safe-states", "all-paths-from-source-to-target"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "letter-tile-possibilities",
    title: "Letter Tile Possibilities",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 1079,
    statement:
      "You have `n` tiles, each printed with one uppercase letter in the string `tiles`. Return the number of **distinct non-empty sequences** you can form using the tiles (using each tile at most once; sequences of different lengths or orders count as different, but identical sequences are counted once even if formed from different physical tiles).",
    examples: [
      { in: "tiles=\"AAB\"", out: "8", note: "A,B,AA,AB,BA,AAB,ABA,BAA" },
      { in: "tiles=\"AAABBC\"", out: "188" },
      { in: "tiles=\"V\"", out: "1" },
    ],
    constraints: ["1 ≤ tiles.length ≤ 7", "tiles consists of uppercase English letters"],
    recognize:
      "'Count distinct sequences (order matters) from a multiset of letters' is **backtracking over a letter-frequency table**: at each position pick any letter that still has count > 0, recurse, and undo. Using counts per letter (not per physical tile) naturally avoids counting duplicate sequences.",
    figureItOut: [
      "Order matters (AB ≠ BA) but duplicate letters must not create duplicate sequences. The trick: work from a **count array of the 26 letters** instead of the raw tile positions. Choosing 'an A' is one choice regardless of which physical A it is.",
      "Backtracking: at the current step, loop over the 26 letters; for each letter with `count > 0`, you can place it here. That placement itself is one new sequence (every non-empty prefix counts), so increment the total by 1.",
      "Then **recurse**: decrement that letter's count, count all sequences that extend the current one by more letters, and **restore** the count afterward (undo the choice) before trying the next letter.",
      "Base case is implicit: when a letter's count hits 0 it's simply skipped; the recursion naturally stops when no letter is available. Sum the +1 per placement across the whole tree to get the count of all distinct non-empty sequences.",
    ],
    approaches: [
      {
        name: "Backtracking over a 26-letter count array (optimal)",
        intuition: "At each step try each available letter once (a distinct choice), count it as a sequence, recurse deeper, then restore the count.",
        time: "O(n · n!)",
        timeWhy: "Bounded by the number of arrangements of up to n tiles; n ≤ 7 keeps it tiny.",
        space: "O(n)",
        spaceWhy: "Recursion depth at most n plus the fixed 26-size count array.",
        code: `int numTilePossibilities(String tiles) {
    int[] count = new int[26];
    for (char ch : tiles.toCharArray()) count[ch - 'A']++;
    return backtrack(count);
}
int backtrack(int[] count) {
    int total = 0;
    for (int i = 0; i < 26; i++) {
        if (count[i] == 0) continue;
        total++;                 // place this letter: one new distinct sequence
        count[i]--;
        total += backtrack(count);
        count[i]++;              // undo
    }
    return total;
}`,
        walkthrough: [
          "tiles=AAB -> count: A=2, B=1.",
          "Top level: place A (+1, count A=1) then recurse; place B (+1) then recurse. So sequences starting with each available letter are counted.",
          "Under 'A': can place A again (AA, +1) or B (AB, +1); under 'AA' place B (AAB); under 'AB' place A (ABA); similarly the B-first branch yields B, BA, BAA.",
          "Distinct sequences: A,B,AA,AB,BA,AAB,ABA,BAA = 8. Total returned = 8.",
        ],
      },
    ],
    edgeCases: [
      "Single tile → 1 sequence.",
      "All identical letters (e.g. 'AAA') → only n distinct sequences (lengths 1..n).",
      "Using counts (not tile indices) is what prevents double-counting identical sequences.",
    ],
    twists: [
      "**Count only length-n sequences (use every tile)** → count distinct permutations = n! / product(freq!).",
      "**Return the sequences themselves** → build a StringBuilder along the recursion and collect into a set.",
      "**Permutations II (LeetCode 47)** → the same duplicate-avoidance idea, listing fixed-length permutations.",
    ],
    related: ["permutations-ii", "subsets-ii", "combination-sum-ii"],
  },

  {
    slug: "happy-strings-kth",
    title: "The k-th Lexicographical String of All Happy Strings of Length n",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 1415,
    statement:
      "A **happy string** uses only letters `'a'`, `'b'`, `'c'` and never repeats the same letter consecutively. Given `n` and `k`, consider all happy strings of length `n` listed in **lexicographic order**; return the `k`-th string (1-indexed), or the empty string if fewer than `k` exist.",
    examples: [
      { in: "n=1, k=3", out: "\"c\"", note: "happy strings of length 1: a,b,c" },
      { in: "n=1, k=4", out: "\"\"", note: "only 3 exist" },
      { in: "n=3, k=9", out: "\"cab\"" },
    ],
    constraints: ["1 ≤ n ≤ 10", "1 ≤ k ≤ 100"],
    recognize:
      "'Generate all valid strings in lexicographic order and pick the k-th' is **backtracking with ordered choices**: try letters a<b<c at each position, skip the one equal to the previous letter, and stop the moment the k-th complete string is built.",
    figureItOut: [
      "Generate happy strings in lexicographic order by always trying letters in the order a, b, c at each position. Because we branch in alphabetical order, complete strings come out sorted automatically.",
      "Constraint: never place a letter equal to the previous one. So at each position, among {a,b,c} skip whichever equals the last placed character.",
      "Backtracking: build the string character by character. When the length reaches `n`, that's one complete happy string — increment a counter; if the counter hits `k`, record this string as the answer and stop exploring.",
      "Prune early: once the answer is found, short-circuit all further recursion. If the whole search finishes without reaching the k-th string, fewer than k exist → return the empty string. (Total count is 3·2^(n-1); you can also check `k` against it up front.)",
    ],
    approaches: [
      {
        name: "Ordered backtracking, stop at the k-th (optimal)",
        intuition: "DFS trying a,b,c in order (skipping the previous letter); the k-th completed string in that order is the answer.",
        time: "O(k · n)",
        timeWhy: "At most k complete strings are built before stopping, each of length n.",
        space: "O(n)",
        spaceWhy: "Recursion depth and the current-string buffer, both bounded by n.",
        code: `String result;
int seen;
String getHappyString(int n, int k) {
    result = "";
    seen = 0;
    backtrack(n, k, new StringBuilder());
    return result;
}
void backtrack(int n, int k, StringBuilder sb) {
    if (!result.isEmpty()) return;          // already found the k-th
    if (sb.length() == n) {
        seen++;
        if (seen == k) result = sb.toString();
        return;
    }
    char prev = sb.length() == 0 ? ' ' : sb.charAt(sb.length() - 1);
    for (char ch = 'a'; ch <= 'c'; ch++) {
        if (ch == prev) continue;           // no consecutive repeat
        sb.append(ch);
        backtrack(n, k, sb);
        sb.deleteCharAt(sb.length() - 1);
        if (!result.isEmpty()) return;
    }
}`,
        walkthrough: [
          "n=3, k=9. Strings appear in order: aba,abc,aca,acb,bab,bac,bca,bcb,cab,...",
          "Count them as they complete: aba(1),abc(2),aca(3),acb(4),bab(5),bac(6),bca(7),bcb(8),cab(9).",
          "seen reaches 9 at 'cab' -> result='cab', recursion short-circuits. Answer 'cab'.",
        ],
      },
    ],
    edgeCases: [
      "k exceeds the total count 3·2^(n-1) → return the empty string.",
      "n == 1 → the three strings a,b,c; k in 1..3 picks one, k≥4 returns empty.",
      "Short-circuiting after finding the answer avoids generating the rest.",
    ],
    twists: [
      "**Counting/math shortcut** → without enumerating, choose each character by dividing k among the 2 valid branches per position (O(n)).",
      "**More letters or different adjacency rules** → adjust the per-position allowed set.",
      "**Return all happy strings** → drop the k stop and collect every completed string.",
    ],
    related: ["letter-combinations-of-a-phone-number", "generate-parentheses", "combinations"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "eliminate-maximum-number-of-monsters",
    title: "Eliminate Maximum Number of Monsters",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1921,
    statement:
      "Monsters approach your city. Monster `i` starts at distance `dist[i]` and moves toward you at speed `speed[i]` (units/minute), so it arrives in `dist[i]/speed[i]` minutes. Your weapon fires **once per minute** (eliminating one monster), but it needs to **recharge** so you cannot fire at minute 0 — your first shot is at minute 0, then you can fire at the start of each minute. A monster that reaches you (arrival time ≤ your current minute) before you eliminate it ends the game. Return the **maximum number of monsters** you can eliminate.",
    examples: [
      { in: "dist=[1,3,4], speed=[1,1,1]", out: "3", note: "arrivals [1,3,4]; eliminate one each minute 0,1,2" },
      { in: "dist=[1,1,2,3], speed=[1,1,1,1]", out: "1", note: "two monsters arrive at minute 1, you can only have shot one by then" },
      { in: "dist=[3,2,4], speed=[5,3,2]", out: "1" },
    ],
    constraints: ["n == dist.length == speed.length", "1 ≤ n ≤ 10⁵", "1 ≤ dist[i], speed[i] ≤ 10⁵"],
    recognize:
      "Each shot happens at an integer minute, and a monster is lost if it arrives at-or-before the minute you'd shoot it → **greedy by earliest arrival time**: sort arrivals ascending and shoot the soonest-arriving monster each minute; the first time a monster's arrival ≤ its slot, you stop.",
    figureItOut: [
      "Compute each monster's **arrival time** `arrival[i] = dist[i] / speed[i]` (use a real division, or compare with cross-multiplication to avoid floating error). The danger is purely about *when* each monster reaches you.",
      "Greedy choice: at minute `m` (0,1,2,...) you fire once and should eliminate the monster with the **earliest arrival** still alive — letting the soonest threat live is what gets you killed, so always shoot the nearest deadline first. Sort arrivals ascending.",
      "Process the sorted arrivals: the monster at sorted index `m` is the one you'd shoot at minute `m`. If its arrival time is **≤ m**, it has already reached you by the time your shot at minute `m` happens → game over; you've eliminated `m` monsters so far.",
      "If you get through all `n` arrivals without any `arrival ≤ its index`, you eliminate all `n`. The answer is the first failing index, or `n` if none fails.",
    ],
    approaches: [
      {
        name: "Sort arrival times, shoot earliest first (optimal)",
        intuition: "Sort arrival times; the m-th (0-indexed) monster is shot at minute m and is lost only if it arrives at-or-before minute m.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting the arrival times.",
        space: "O(n)",
        spaceWhy: "The arrival-time array.",
        code: `int eliminateMaximum(int[] dist, int[] speed) {
    int n = dist.length;
    double[] arrival = new double[n];
    for (int i = 0; i < n; i++) {
        arrival[i] = (double) dist[i] / speed[i];
    }
    Arrays.sort(arrival);
    for (int m = 0; m < n; m++) {
        if (arrival[m] <= m) {
            return m;          // this monster reaches you before/at your shot
        }
    }
    return n;
}`,
        walkthrough: [
          "dist=[1,1,2,3], speed=[1,1,1,1]. arrival=[1.0,1.0,2.0,3.0] (already sorted).",
          "m=0: arrival[0]=1.0 > 0 -> safe, eliminate the first monster at minute 0.",
          "m=1: arrival[1]=1.0 <= 1 -> the second monster reaches you exactly at minute 1, before your minute-1 shot lands -> game over. Return m=1.",
          "Answer 1.",
        ],
      },
    ],
    edgeCases: [
      "All monsters arrive far in the future → eliminate all n.",
      "Two monsters share the same arrival time t → only one can be shot before minute t; the other is lost at that index.",
      "Comparison arrival <= m (not < m): a monster arriving exactly at minute m reaches you as your shot fires and counts as too late.",
    ],
    twists: [
      "**Avoid floating point** → compare dist[i] * 1 vs speed[i] * m via integer cross-multiplication: lost iff dist[i] <= speed[i]*m.",
      "**Fire multiple shots per minute** → divide the index by the shots-per-minute rate.",
      "**Assign weapon recharge delays** → shifts the minute each shot is available; same greedy on deadlines.",
    ],
    related: ["minimum-number-of-arrows-to-burst-balloons", "maximum-units-on-a-truck", "task-scheduler"],
  },

  {
    slug: "minimum-deletions-to-make-character-frequencies-unique",
    title: "Minimum Deletions to Make Character Frequencies Unique",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1647,
    statement:
      "A string is **good** if no two distinct characters have the same frequency (number of occurrences). Given a string `s`, return the **minimum number of character deletions** needed to make it good.",
    examples: [
      { in: "s=\"aab\"", out: "0", note: "frequencies a:2, b:1 already distinct" },
      { in: "s=\"aaabbbcc\"", out: "2", note: "a:3,b:3,c:2 -> delete one b (3->2) then one c or b to break ties: result 2" },
      { in: "s=\"ceabaacb\"", out: "2" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s consists of lowercase English letters"],
    recognize:
      "'Make all frequencies distinct with the fewest removals' → **greedy**: count frequencies, then process them from largest to smallest, and whenever a frequency clashes with an already-used one, delete characters (decrement) until it hits a free, smaller value (or zero), summing the deletions.",
    figureItOut: [
      "Count the frequency of each of the 26 letters. The goal is to make this multiset of counts have **all distinct values** (zeros are allowed and don't clash — a fully-deleted character no longer exists).",
      "Greedy: keep a set of frequencies already 'taken'. Process the frequencies in **descending order** (largest first) so big counts grab the high slots and you push smaller clashes downward cheaply.",
      "For each frequency `f`: while `f > 0` **and** `f` is already taken, delete one occurrence (`f--`, add 1 to the deletion count). Once `f` is 0 or lands on an unused value, mark `f` taken (if > 0) and move on. Reducing means deleting that many characters.",
      "Sum all decrements across letters — that total is the minimum deletions. Descending order is what makes it minimal: a larger count never needs to drop below a smaller one's final slot.",
    ],
    approaches: [
      {
        name: "Greedy: push clashing frequencies down (optimal)",
        intuition: "Count letters; for each frequency, keep decrementing (deleting) while it collides with a used frequency, until it's unique or zero.",
        time: "O(n + A²)",
        timeWhy: "Counting is O(n); each of A=26 frequencies decrements at most O(A) times before hitting a free slot.",
        space: "O(A)",
        spaceWhy: "The 26 counts plus a set of used frequencies.",
        code: `int minDeletions(String s) {
    int[] freq = new int[26];
    for (char ch : s.toCharArray()) freq[ch - 'a']++;
    Set<Integer> used = new HashSet<>();
    int deletions = 0;
    for (int f : freq) {
        int cur = f;
        while (cur > 0 && used.contains(cur)) {
            cur--;          // delete one character to lower this frequency
            deletions++;
        }
        if (cur > 0) used.add(cur);
    }
    return deletions;
}`,
        walkthrough: [
          "s=aaabbbcc -> freq: a=3, b=3, c=2 (others 0).",
          "Process a=3: not used -> take 3. used={3}.",
          "Process b=3: 3 is used -> decrement to 2 (deletions=1); 2 not used -> take 2. used={3,2}.",
          "Process c=2: 2 is used -> decrement to 1 (deletions=2); 1 not used -> take 1. used={3,2,1}. Total deletions=2.",
        ],
      },
    ],
    edgeCases: [
      "Already all-distinct frequencies → 0 deletions.",
      "A frequency forced down to 0 → that character is fully removed; 0 never clashes.",
      "Many letters sharing a count → they cascade down to distinct slots, paying deletions each.",
    ],
    twists: [
      "**Order doesn't strictly need sorting** with a used-set, but descending processing keeps it provably minimal and avoids re-bumping.",
      "**Return which characters to delete** → track each decrement against the letter it came from.",
      "**Make frequencies form a specific pattern (e.g. all equal)** → a different objective, not this greedy.",
    ],
    related: ["sort-characters-by-frequency", "task-scheduler", "reorganize-string"],
  },
];
