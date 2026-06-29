// NeetCode All — wave 10c (dp-1d, dp-2d, graphs, advanced-graphs, backtracking, greedy). Java.
// Same deep-teaching shape as wave9c: every problem reasons from scratch in figureItOut,
// and DP problems name state/recurrence/base/fill explicitly with a hand-traced walkthrough.
// All `code` is clean compilable Java assuming `import java.util.*;` — no backticks, no template
// placeholders, no backslashes; self-contained Solution-style methods.
export const WAVE10C = [
  // ───────────────────────────── 1-D DP ─────────────────────────────
  {
    slug: "minimum-cost-for-tickets",
    title: "Minimum Cost For Tickets",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 983,
    statement:
      "You planned travel on certain `days` of the year (a sorted array of day numbers in `1..365`). Tickets sell as a **1-day pass** (`costs[0]`), a **7-day pass** (`costs[1]`), or a **30-day pass** (`costs[2]`); a pass bought on day `d` covers all travel in the window `[d, d+duration-1]`. Return the **minimum money** needed to cover every travel day.",
    examples: [
      { in: "days=[1,4,6,7,8,20], costs=[2,7,15]", out: "11", note: "7-day pass on day 1, 1-day passes for 8 and 20? best is 7-day on day 1 (covers 1..7) + 1-day on day 8 + ... actually 11" },
      { in: "days=[1,2,3,4,5,6,7,8,9,10,30,31], costs=[2,7,15]", out: "17", note: "30-day pass covers 1..30, then a 1-day for 31" },
    ],
    constraints: ["1 ≤ days.length ≤ 365", "1 ≤ days[i] ≤ 365", "days is strictly increasing", "costs.length == 3"],
    recognize:
      "'Cheapest way to cover a timeline where each purchase covers a forward window' is a DP over the day index: the cost to cover everything up to day `d` depends on cheaper sub-timelines ending at `d-1`, `d-7`, `d-30` → **1-D DP keyed on day (or travel-day index)**.",
    figureItOut: [
      "**State**: let `dp[d]` be the minimum cost to cover all *required travel* on days `1..d`. The calendar day is the natural index because every pass is defined by the calendar window it covers.",
      "**Recurrence**: on a day with no travel, nothing new is needed, so `dp[d] = dp[d-1]`. On a travel day you must have *some* pass active that covers day `d`; the cheapest covering pass started no earlier than `d-duration+1`, so `dp[d] = min( dp[d-1] + costs1, dp[max(0,d-7)] + costs7, dp[max(0,d-30)] + costs30 )`.",
      "**Base case**: `dp[0] = 0` — covering an empty prefix of the year costs nothing.",
      "**Fill**: sweep `d` from 1 to the last travel day. Keep a boolean set of travel days so you can tell travel days from free days in O(1). Each step is O(1) work.",
      "The answer is `dp[lastDay]` where `lastDay` is the maximum value in `days`.",
    ],
    approaches: [
      {
        name: "Memoized recursion over travel-day index",
        intuition: "From travel day index i, try a 1/7/30-day pass and skip to the first travel day past the window; cache by i.",
        time: "O(n)",
        timeWhy: "n travel-day indices, each trying 3 pass choices with a forward skip.",
        space: "O(n)",
        spaceWhy: "Memo array plus recursion depth bounded by n.",
        code: `int mincostTickets(int[] days, int[] costs) {
    Integer[] memo = new Integer[days.length];
    return go(days, costs, 0, memo);
}
int go(int[] days, int[] costs, int i, Integer[] memo) {
    if (i >= days.length) return 0;
    if (memo[i] != null) return memo[i];
    int[] durations = {1, 7, 30};
    int best = Integer.MAX_VALUE;
    for (int k = 0; k < 3; k++) {
        int j = i;
        int covered = days[i] + durations[k] - 1;
        while (j < days.length && days[j] <= covered) j++;
        best = Math.min(best, costs[k] + go(days, costs, j, memo));
    }
    return memo[i] = best;
}`,
      },
      {
        name: "Bottom-up calendar DP (optimal)",
        intuition: "dp[d] = cheapest cover of days 1..d; free days inherit dp[d-1], travel days take the cheapest of the three passes looking back.",
        time: "O(maxDay)",
        timeWhy: "One pass over calendar days up to the last travel day, constant work each.",
        space: "O(maxDay)",
        spaceWhy: "A dp array sized to the last travel day.",
        code: `int mincostTickets(int[] days, int[] costs) {
    int last = days[days.length - 1];
    boolean[] travel = new boolean[last + 1];
    for (int d : days) travel[d] = true;
    int[] dp = new int[last + 1];
    for (int d = 1; d <= last; d++) {
        if (!travel[d]) {
            dp[d] = dp[d - 1];
            continue;
        }
        int one = dp[d - 1] + costs[0];
        int seven = dp[Math.max(0, d - 7)] + costs[1];
        int thirty = dp[Math.max(0, d - 30)] + costs[2];
        dp[d] = Math.min(one, Math.min(seven, thirty));
    }
    return dp[last];
}`,
        walkthrough: [
          "days=[1,4,6,7,8,20], costs=[2,7,15]. Travel days marked; dp[0]=0.",
          "dp[1]: travel. one=0+2=2, seven=dp[0]+7=7, thirty=dp[0]+15=15 -> dp[1]=2. dp[2]=dp[3]=2 (free).",
          "dp[4]: travel. one=dp[3]+2=4, seven=dp[0]+7=7 -> dp[4]=4. dp[5]=4. dp[6]: one=dp[5]+2=6, seven=dp[0]+7=7 -> dp[6]=6.",
          "dp[7]: one=dp[6]+2=8, seven=dp[0]+7=7 -> dp[7]=7. dp[8]: one=dp[7]+2=9, seven=dp[1]+7=9 -> dp[8]=9. dp[9..19]=9 (free).",
          "dp[20]: one=dp[19]+2=11, seven=dp[13]+7=16, thirty=dp[0]+15=15 -> dp[20]=11. Answer 11.",
        ],
      },
    ],
    edgeCases: [
      "A single travel day → answer is min(costs) (cheapest single pass that covers it).",
      "Clustered travel within 7 days → a single 7-day pass often beats several 1-day passes.",
      "Travel days far apart → 1-day passes can be cheaper than a 7- or 30-day pass that mostly covers free days.",
    ],
    twists: [
      "**Variable durations / more pass types** → add more lookback terms to the min, one per pass.",
      "**Index by travel-day instead of calendar** → O(n) with a forward scan, ignoring the 365 bound (useful if days span a huge range).",
      "**Passes have day-specific prices** → costs become arrays indexed by day; the skeleton is unchanged.",
    ],
    related: ["coin-change", "house-robber", "climbing-stairs"],
  },

  {
    slug: "longest-string-chain",
    title: "Longest String Chain",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 1048,
    statement:
      "Given a list of `words`, word `a` is a **predecessor** of word `b` if inserting **exactly one letter** into `a` (anywhere) makes `b`. A **word chain** is a sequence where each word is a predecessor of the next. Return the **length of the longest possible word chain**.",
    examples: [
      { in: "words=[\"a\",\"b\",\"ba\",\"bca\",\"bda\",\"bdca\"]", out: "4", note: "a -> ba -> bda -> bdca" },
      { in: "words=[\"xbc\",\"pcxbcf\",\"xb\",\"cxbc\",\"pcxbc\"]", out: "5" },
      { in: "words=[\"abcd\",\"dbqca\"]", out: "1", note: "no valid predecessor pair" },
    ],
    constraints: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length ≤ 16", "words[i] consists of lowercase English letters"],
    recognize:
      "Chains only grow by length (+1 letter each step), so sort by length and ask 'best chain ending at this word'. That value depends on its one-letter-shorter predecessors → **1-D DP keyed on the word**, memoized in a map.",
    figureItOut: [
      "**State**: `dp[w]` = the length of the longest chain that **ends at word `w`**. The word itself indexes the state; a hash map from word to its best chain length holds the table.",
      "**Recurrence**: a predecessor of `w` is `w` with exactly one character deleted (length `len(w)-1`). For each of the `len(w)` single-deletion candidates `p`, if `p` is in the word set, `w` can extend `p`'s chain: `dp[w] = 1 + max over valid p of dp[p]` (and at least `1` for a chain of just `w`).",
      "**Base case**: a word with no present predecessor has `dp[w] = 1` (the chain is the word alone).",
      "**Fill**: sort words by **increasing length** so every predecessor (shorter by one) is computed before `w`. Process in that order, generating the `len(w)` deletion candidates and looking each up.",
      "The answer is `max(dp[w])` over all words.",
    ],
    approaches: [
      {
        name: "Sort by length + map DP (optimal)",
        intuition: "Process short words first; for each word, try deleting each character and chain onto the best predecessor found.",
        time: "O(n · L²)",
        timeWhy: "n words, each forming L deletion candidates of length L; building each candidate string costs O(L).",
        space: "O(n · L)",
        spaceWhy: "The dp map storing every word and its best chain.",
        code: `int longestStrChain(String[] words) {
    Arrays.sort(words, (a, b) -> a.length() - b.length());
    Map<String, Integer> dp = new HashMap<>();
    int best = 0;
    for (String w : words) {
        int cur = 1;
        for (int i = 0; i < w.length(); i++) {
            String prev = w.substring(0, i) + w.substring(i + 1);
            if (dp.containsKey(prev)) {
                cur = Math.max(cur, dp.get(prev) + 1);
            }
        }
        dp.put(w, cur);
        best = Math.max(best, cur);
    }
    return best;
}`,
        walkthrough: [
          "words sorted by length: a,b (len1), ba (len2), bca,bda (len3), bdca (len4).",
          "dp[a]=1, dp[b]=1. ba: delete -> a (dp1) or b (dp1) -> dp[ba]=2.",
          "bca: deletions ca,ba,bc; only ba present (dp2) -> dp[bca]=3. bda: deletions da,ba,bd; ba present -> dp[bda]=3.",
          "bdca: deletions dca,bca,bda,bdc; bca(3) and bda(3) present -> dp[bdca]=4. Answer 4.",
        ],
      },
    ],
    edgeCases: [
      "Single word → chain length 1.",
      "No two words differ by exactly one insertion → answer 1 (every word stands alone).",
      "Duplicate words → the map naturally dedupes; a word can't be its own predecessor (lengths must differ by 1).",
    ],
    twists: [
      "**Allow changing a letter too** → predecessors include same-length one-edit neighbours; the chain definition changes.",
      "**Reconstruct the actual chain** → store the chosen predecessor per word and walk back from the best.",
      "**Longest Increasing Subsequence (LeetCode 300)** → the same 'best ending here' DP, ordered by value instead of length.",
    ],
    related: ["longest-increasing-subsequence", "number-of-longest-increasing-subsequence", "word-break"],
  },

  // ───────────────────────────── 2-D DP ─────────────────────────────
  {
    slug: "maximum-length-of-repeated-subarray",
    title: "Maximum Length of Repeated Subarray",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 718,
    statement:
      "Given two integer arrays `nums1` and `nums2`, return the **maximum length of a subarray** that appears in **both** arrays. A subarray is a contiguous slice.",
    examples: [
      { in: "nums1=[1,2,3,2,1], nums2=[3,2,1,4,7]", out: "3", note: "[3,2,1]" },
      { in: "nums1=[0,0,0,0,0], nums2=[0,0,0,0,0]", out: "5" },
    ],
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 1000", "0 ≤ nums1[i], nums2[i] ≤ 100"],
    recognize:
      "Common **contiguous** slice of two sequences → the suffix-matching DP cousin of Longest Common Subsequence. Because the match must be contiguous, the state is 'longest common run that ENDS at these two positions' → **2-D grid DP keyed on (i, j)**.",
    figureItOut: [
      "**State**: `dp[i][j]` = the length of the longest common subarray that **ends exactly at** `nums1[i-1]` and `nums2[j-1]`. The contiguity requirement is why we anchor at the *end* of each prefix rather than counting subsequences.",
      "**Recurrence**: if `nums1[i-1] == nums2[j-1]`, the run can extend the previous diagonal: `dp[i][j] = dp[i-1][j-1] + 1`. If they differ, no common run can end here, so `dp[i][j] = 0` (unlike LCS, which would carry a max from neighbours).",
      "**Base case**: `dp[0][j] = dp[i][0] = 0` — an empty prefix shares no ending run.",
      "**Fill**: sweep `i` over nums1 and `j` over nums2 (1-based). Track a global `best` as you go because the answer is the **maximum cell**, not the corner cell (a common run can end anywhere).",
      "The answer is `max over all (i,j) of dp[i][j]`.",
    ],
    approaches: [
      {
        name: "Full 2-D table",
        intuition: "dp[i][j] = common run ending at these indices; +1 on a diagonal match, reset to 0 on mismatch; track the max.",
        time: "O(m·n)",
        timeWhy: "Every (i,j) cell is filled with constant work.",
        space: "O(m·n)",
        spaceWhy: "An (m+1)×(n+1) table.",
        code: `int findLength(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[][] dp = new int[m + 1][n + 1];
    int best = 0;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (nums1[i - 1] == nums2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                best = Math.max(best, dp[i][j]);
            }
        }
    }
    return best;
}`,
      },
      {
        name: "Rolling 1-D array (optimal space)",
        intuition: "Each row only needs the previous row's diagonal; sweep j from high to low to reuse one array.",
        time: "O(m·n)",
        timeWhy: "Same cell count, constant work each.",
        space: "O(n)",
        spaceWhy: "A single array of length n+1, updated right-to-left so dp[j-1] still holds the old diagonal.",
        code: `int findLength(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[] dp = new int[n + 1];
    int best = 0;
    for (int i = 1; i <= m; i++) {
        for (int j = n; j >= 1; j--) {
            if (nums1[i - 1] == nums2[j - 1]) {
                dp[j] = dp[j - 1] + 1;
                best = Math.max(best, dp[j]);
            } else {
                dp[j] = 0;
            }
        }
    }
    return best;
}`,
        walkthrough: [
          "nums1=[1,2,3,2,1], nums2=[3,2,1,4,7]. Only diagonal matches grow.",
          "At nums1[2]=3 vs nums2[0]=3: dp=1. Next nums1[3]=2 vs nums2[1]=2: extends diagonal -> dp=2.",
          "Then nums1[4]=1 vs nums2[2]=1: extends -> dp=3. No longer run exists. best=3.",
        ],
      },
    ],
    edgeCases: [
      "No common element → answer 0.",
      "One array fully contained in the other → answer is the shorter length.",
      "All elements equal → answer is min(m, n).",
    ],
    twists: [
      "**Longest Common Subsequence (LeetCode 1143)** → drop the contiguity: on mismatch take max(dp[i-1][j], dp[i][j-1]) instead of 0.",
      "**Recover the actual subarray** → remember the (i,j) where the max occurred and slice back that many elements.",
      "**Binary search + rolling hash** → an O((m+n) log(min)) alternative that searches the answer length.",
    ],
    related: ["longest-common-subsequence", "edit-distance", "longest-increasing-subsequence"],
  },

  {
    slug: "stone-game",
    title: "Stone Game",
    difficulty: "Medium",
    pattern: "dp-2d",
    leetcode: 877,
    statement:
      "Alice and Bob play with `piles` of stones arranged in a row (an even number of piles, odd total so no ties). Players alternate, and on each turn a player takes the **whole pile at either end** of the row. Alice goes first; both play optimally to maximize their own stones. Return `true` if **Alice wins**.",
    examples: [
      { in: "piles=[5,3,4,5]", out: "true", note: "Alice can force a win" },
      { in: "piles=[3,7,2,3]", out: "true" },
    ],
    constraints: ["2 ≤ piles.length ≤ 500", "piles.length is even", "1 ≤ piles[i] ≤ 500", "sum(piles) is odd"],
    recognize:
      "Two players alternately take from either end, optimizing a zero-sum score → **interval / range DP**: the value of a subrange `[i..j]` to the player about to move depends on the two smaller subranges after taking an end. State keyed on the two endpoints → **2-D DP on (i, j)**.",
    figureItOut: [
      "**State**: `dp[i][j]` = the **maximum net score advantage** (current player's stones minus the opponent's) that the player to move can guarantee on the subarray `piles[i..j]`. Net advantage turns a two-player optimization into a single value.",
      "**Recurrence**: the mover takes a pile from one end, gains it, and then *faces* the opponent on the remaining range — so the opponent's advantage subtracts. `dp[i][j] = max( piles[i] - dp[i+1][j], piles[j] - dp[i][j-1] )`: take the left end and subtract the best the opponent does on `[i+1..j]`, or take the right end likewise.",
      "**Base case**: `dp[i][i] = piles[i]` — one pile left, the mover simply takes it (net advantage = that pile).",
      "**Fill**: iterate by increasing range length `len` from 2 to n; for each starting `i`, set `j = i+len-1` and combine the two shorter ranges (already computed). This is O(n²).",
      "The answer is `dp[0][n-1] > 0` — Alice (the first mover over the whole row) ends ahead.",
    ],
    approaches: [
      {
        name: "Math shortcut",
        intuition: "With an even pile count and no ties, Alice can always claim all odd-indexed or all even-indexed piles, one of which has the larger sum — so Alice always wins.",
        time: "O(1)",
        timeWhy: "No computation needed beyond returning true.",
        space: "O(1)",
        spaceWhy: "No data structures.",
        code: `boolean stoneGame(int[] piles) {
    return true;   // first player can always force a win under these constraints
}`,
      },
      {
        name: "Range DP on net advantage (optimal, general)",
        intuition: "dp[i][j] = best score difference the mover can force on [i..j]; take an end and subtract the opponent's best on the rest.",
        time: "O(n²)",
        timeWhy: "n²/2 subranges, each combining two precomputed shorter ranges.",
        space: "O(n²)",
        spaceWhy: "The (n×n) advantage table (reducible to O(n) with a rolling diagonal).",
        code: `boolean stoneGame(int[] piles) {
    int n = piles.length;
    int[][] dp = new int[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = piles[i];
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            int takeLeft = piles[i] - dp[i + 1][j];
            int takeRight = piles[j] - dp[i][j - 1];
            dp[i][j] = Math.max(takeLeft, takeRight);
        }
    }
    return dp[0][n - 1] > 0;
}`,
        walkthrough: [
          "piles=[5,3,4,5]. Length-1: dp[0][0]=5, dp[1][1]=3, dp[2][2]=4, dp[3][3]=5.",
          "Length-2: dp[0][1]=max(5-3, 3-5)=2; dp[1][2]=max(3-4,4-3)=1; dp[2][3]=max(4-5,5-4)=1.",
          "Length-3: dp[0][2]=max(5-dp[1][2], 4-dp[0][1])=max(5-1,4-2)=4; dp[1][3]=max(3-dp[2][3],5-dp[1][2])=max(3-1,5-1)=4.",
          "Length-4: dp[0][3]=max(5-dp[1][3], 5-dp[0][2])=max(5-4,5-4)=1 > 0 -> Alice wins, return true.",
        ],
      },
    ],
    edgeCases: [
      "Two piles → the mover takes the larger end and wins; dp gives the larger minus smaller > 0.",
      "Constraints (even count, odd sum) guarantee the first player always wins, but the DP is the real, general solution.",
      "Use the DP, not the trick, if the problem variant relaxes the even-count / no-tie guarantees.",
    ],
    twists: [
      "**Stone Game II / III** → different take rules (take 1..2M piles, or 1..3 from the front) change the recurrence but keep range/prefix DP.",
      "**Return the winning margin** → return `dp[0][n-1]` itself instead of a boolean.",
      "**Predict the Winner (LeetCode 486)** → identical net-advantage DP without the even/odd guarantees.",
    ],
    related: ["burst-balloons", "longest-palindromic-subsequence", "minimum-path-sum"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "open-the-lock",
    title: "Open the Lock",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 752,
    statement:
      "A lock has 4 circular wheels, each showing a digit `0..9`; it starts at `\"0000\"`. One move turns one wheel one slot (e.g. `9 -> 0` or `0 -> 9`). Given a list of `deadends` (states you must never reach) and a `target`, return the **minimum number of moves** to reach the target, or `-1` if impossible.",
    examples: [
      { in: "deadends=[\"0201\",\"0101\",\"0102\",\"1212\",\"2002\"], target=\"0202\"", out: "6" },
      { in: "deadends=[\"8888\"], target=\"0009\"", out: "1" },
      { in: "deadends=[\"0000\"], target=\"8888\"", out: "-1", note: "the start itself is a deadend" },
    ],
    constraints: ["1 ≤ deadends.length ≤ 500", "deadends[i].length == 4", "target.length == 4", "target not in deadends"],
    recognize:
      "Each 4-digit combination is a **node**; turning one wheel by one is an **edge** to a neighbour (8 neighbours per state). 'Fewest moves between two states in an unweighted graph' → **breadth-first search** from the start, treating deadends as blocked nodes.",
    figureItOut: [
      "Model states as the 10000 strings `\"0000\"`..`\"9999\"`. From any state, each of the 4 wheels can turn up or down, giving exactly 8 neighbour states. The graph is unweighted (every move costs 1), so BFS layers give shortest distance.",
      "Guard the deadends: if the start `\"0000\"` is itself a deadend, return −1 immediately. Otherwise treat deadends as a blocked/visited set so BFS never expands through them.",
      "BFS from `\"0000\"`: process level by level, tracking the move count. For each popped state, generate its 8 neighbours; the first time you generate `target`, the current depth + 1 is the answer.",
      "Use a visited set so each state is enqueued once. If the queue drains without hitting `target`, it's unreachable → −1.",
    ],
    approaches: [
      {
        name: "Plain BFS over lock states",
        intuition: "BFS from 0000; each state has 8 neighbours (each wheel +/-1, wrapping); skip deadends and visited.",
        time: "O(10000 · 8)",
        timeWhy: "At most 10000 states, each generating 8 neighbours of constant length.",
        space: "O(10000)",
        spaceWhy: "Visited set and BFS queue over the state space.",
        code: `int openLock(String[] deadends, String target) {
    Set<String> dead = new HashSet<>(Arrays.asList(deadends));
    if (dead.contains("0000")) return -1;
    if (target.equals("0000")) return 0;
    Set<String> visited = new HashSet<>();
    Deque<String> queue = new ArrayDeque<>();
    queue.add("0000");
    visited.add("0000");
    int moves = 0;
    while (!queue.isEmpty()) {
        moves++;
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            String cur = queue.poll();
            for (int i = 0; i < 4; i++) {
                for (int delta = -1; delta <= 1; delta += 2) {
                    char[] arr = cur.toCharArray();
                    int d = (arr[i] - '0' + delta + 10) % 10;
                    arr[i] = (char) ('0' + d);
                    String next = new String(arr);
                    if (next.equals(target)) return moves;
                    if (!dead.contains(next) && !visited.contains(next)) {
                        visited.add(next);
                        queue.add(next);
                    }
                }
            }
        }
    }
    return -1;
}`,
        walkthrough: [
          "target=0202, deadends block 0201,0101,0102,1212,2002. Start 0000 not dead.",
          "Layer 1 reaches 1000,9000,0100,0900,0010,0090,0001,0009. None is target; 0101/0102 etc are blocked when generated later.",
          "BFS expands the open frontier; the shortest unblocked route to 0202 has length 6, so the first time 0202 is generated is at moves=6.",
        ],
      },
      {
        name: "Bidirectional BFS (optimization)",
        intuition: "Search forward from 0000 and backward from target simultaneously; stop when the frontiers meet, roughly halving the explored states.",
        time: "O(10000 · 8)",
        timeWhy: "Same worst case but the meeting-in-the-middle prunes the explored set in practice.",
        space: "O(10000)",
        spaceWhy: "Two frontier sets plus a visited set.",
        code: `int openLock(String[] deadends, String target) {
    Set<String> dead = new HashSet<>(Arrays.asList(deadends));
    if (dead.contains("0000")) return -1;
    Set<String> begin = new HashSet<>(), end = new HashSet<>(), visited = new HashSet<>();
    begin.add("0000");
    end.add(target);
    int moves = 0;
    while (!begin.isEmpty() && !end.isEmpty()) {
        if (begin.size() > end.size()) { Set<String> t = begin; begin = end; end = t; }
        Set<String> next = new HashSet<>();
        for (String cur : begin) {
            if (dead.contains(cur)) continue;
            if (end.contains(cur)) return moves;
            visited.add(cur);
            for (int i = 0; i < 4; i++) {
                for (int delta = -1; delta <= 1; delta += 2) {
                    char[] arr = cur.toCharArray();
                    int d = (arr[i] - '0' + delta + 10) % 10;
                    arr[i] = (char) ('0' + d);
                    String nb = new String(arr);
                    if (!visited.contains(nb) && !dead.contains(nb)) next.add(nb);
                }
            }
        }
        begin = next;
        moves++;
    }
    return -1;
}`,
      },
    ],
    edgeCases: [
      "Start 0000 is a deadend → return −1 before any search.",
      "target equals 0000 → 0 moves.",
      "Deadends wall off the target entirely → BFS drains and returns −1.",
    ],
    twists: [
      "**More wheels or a different alphabet** → only the neighbour-generation changes; BFS is unchanged.",
      "**Weighted moves** (turning costs vary) → switch from BFS to Dijkstra.",
      "**Word Ladder (LeetCode 127)** → the same shortest-transformation BFS over strings differing by one position.",
    ],
    related: ["word-ladder", "shortest-path-in-binary-matrix", "minimum-genetic-mutation"],
  },

  {
    slug: "as-far-from-land-as-possible",
    title: "As Far from Land as Possible",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1162,
    statement:
      "Given an `n × n` grid of `0` (water) and `1` (land), find the **water cell** whose distance to the **nearest land** is **maximized**, using Manhattan distance (4-directional steps). Return that maximum distance, or `-1` if the grid is all land or all water.",
    examples: [
      { in: "grid=[[1,0,1],[0,0,0],[1,0,1]]", out: "2", note: "the center (1,1) is distance 2 from any land" },
      { in: "grid=[[1,0,0],[0,0,0],[0,0,0]]", out: "4", note: "the far corner is 4 steps from the single land cell" },
    ],
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 100", "grid[i][j] is 0 or 1"],
    recognize:
      "'Largest distance from any water cell to its nearest of many land cells' is the **multi-source BFS** trick: seed the queue with *all* land cells at once, expand the wavefront over water, and the last layer reached is the maximum distance.",
    figureItOut: [
      "Doing a separate BFS from each water cell is wasteful. Invert it: BFS **outward from all land simultaneously**. A water cell's distance to the nearest land equals the BFS layer at which the land wavefront first reaches it.",
      "Seed the queue with **every** land cell (distance 0) and mark them visited. If there are no land cells or no water cells, return −1 (nothing to measure).",
      "Run level-by-level BFS. Each time the wavefront steps to an unvisited water cell, that cell's distance is the current layer count. The last (deepest) layer processed is the answer because the farthest water cell is reached last.",
      "Track the maximum distance as you expand (or simply count completed layers minus one). When the queue empties, every water cell has been reached by its nearest land first.",
    ],
    approaches: [
      {
        name: "Multi-source BFS from all land",
        intuition: "All land cells start the wave together; each new water layer is one farther; the deepest layer is the answer.",
        time: "O(n²)",
        timeWhy: "Each of the n² cells is enqueued and processed once.",
        space: "O(n²)",
        spaceWhy: "The BFS queue and visited marking over the grid.",
        code: `int maxDistance(int[][] grid) {
    int n = grid.length;
    Deque<int[]> queue = new ArrayDeque<>();
    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1) queue.add(new int[]{r, c});
        }
    }
    if (queue.isEmpty() || queue.size() == n * n) return -1;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    int dist = -1;
    while (!queue.isEmpty()) {
        dist++;
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr >= 0 && nc >= 0 && nr < n && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;          // mark visited in place
                    queue.add(new int[]{nr, nc});
                }
            }
        }
    }
    return dist;
}`,
        walkthrough: [
          "grid=[[1,0,1],[0,0,0],[1,0,1]]. Seed the four corner land cells at distance 0.",
          "Layer 1 (dist becomes 1): the edge-midpoint waters (0,1),(1,0),(1,2),(2,1) are filled from adjacent land.",
          "Layer 2 (dist becomes 2): the center (1,1) is reached from those. Queue then drains. Answer = 2.",
        ],
      },
    ],
    edgeCases: [
      "All land or all water → return −1 (the BFS seed check handles both).",
      "A single land cell in a corner → distance grows to the opposite corner (2(n−1) at most).",
      "Marking visited water as land in place avoids a separate visited array (acceptable if mutation is allowed).",
    ],
    twists: [
      "**01 Matrix (LeetCode 542)** → return each cell's nearest-zero distance instead of just the max.",
      "**Rotting Oranges (LeetCode 994)** → multi-source BFS where you return the time for the wave to cover everything (or −1).",
      "**8-directional distance** → add the diagonal moves (Chebyshev metric).",
    ],
    related: ["01-matrix", "rotting-oranges", "walls-and-gates"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "optimize-water-distribution-in-a-village",
    title: "Optimize Water Distribution in a Village",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 1168,
    statement:
      "A village has `n` houses. You can supply water to a house either by building a **well** in it (`wells[i]` cost for house `i`) or by laying a **pipe** between two houses (`pipes[j] = [a, b, cost]`, bidirectional). Return the **minimum total cost** to provide water to every house.",
    examples: [
      { in: "n=3, wells=[1,2,2], pipes=[[1,2,1],[2,3,1]]", out: "3", note: "well at house 1 (cost1), pipes 1-2 and 2-3 (cost1 each)" },
      { in: "n=2, wells=[1,1], pipes=[[1,2,1]]", out: "2", note: "two wells, or one well + pipe — both cost 2" },
    ],
    constraints: ["1 ≤ n ≤ 10⁴", "wells.length == n", "0 ≤ pipes.length ≤ 10⁴", "1 ≤ costs ≤ 10⁵"],
    recognize:
      "'Connect everything at minimum cost, where each node may also be served directly' becomes a pure **Minimum Spanning Tree** once you add a **virtual source node 0** with an edge of cost `wells[i]` to each house. Building a well = connecting that house to node 0. Then run Kruskal.",
    figureItOut: [
      "The clever modeling: introduce a **virtual node 0** representing an infinite water source. A well at house `i` is exactly a pipe from node 0 to house `i` with cost `wells[i]`. Now 'every house has water' means 'every house is connected to node 0'.",
      "Combine all edges into one list: the `n` virtual well-edges `(0, i, wells[i-1])` plus every pipe `(a, b, cost)`. The cheapest way to connect the `n+1` nodes (houses 1..n plus source 0) into one component is a **Minimum Spanning Tree**.",
      "Run **Kruskal**: sort all edges ascending by cost, then add each edge only if it joins two currently-disconnected components (union-find). An edge inside one component would form a cycle and waste money.",
      "The MST on `n+1` nodes uses exactly `n` edges. Sum those edge costs — that is the minimum total to water every house. Because node 0 plus a well-edge always lets any single house be served, the graph is always connectable (answer always exists).",
    ],
    approaches: [
      {
        name: "Virtual-source MST via Kruskal (optimal)",
        intuition: "Add a source node 0 with well-edges, merge with pipes, sort all edges, and greedily union the cheapest cycle-free ones.",
        time: "O(E log E)",
        timeWhy: "Sorting the n + pipes edges dominates; union-find ops are near-constant.",
        space: "O(n + E)",
        spaceWhy: "The combined edge list and the DSU arrays.",
        code: `int[] parent;
int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
    List<int[]> edges = new ArrayList<>();
    for (int i = 0; i < n; i++) {
        edges.add(new int[]{0, i + 1, wells[i]});   // well = pipe from virtual node 0
    }
    for (int[] p : pipes) {
        edges.add(new int[]{p[0], p[1], p[2]});
    }
    edges.sort((a, b) -> a[2] - b[2]);
    parent = new int[n + 1];
    for (int i = 0; i <= n; i++) parent[i] = i;
    int total = 0, used = 0;
    for (int[] e : edges) {
        if (union(e[0], e[1])) {
            total += e[2];
            used++;
            if (used == n) break;       // n edges connect n+1 nodes
        }
    }
    return total;
}
int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    parent[ra] = rb;
    return true;
}`,
        walkthrough: [
          "n=3, wells=[1,2,2], pipes=[[1,2,1],[2,3,1]]. Well-edges: (0,1,1),(0,2,2),(0,3,2). Pipe-edges: (1,2,1),(2,3,1).",
          "Sort by cost: (0,1,1),(1,2,1),(2,3,1),(0,2,2),(0,3,2).",
          "Take (0,1,1): union -> total=1, used=1. Take (1,2,1): 1 and 2 differ -> total=2, used=2. Take (2,3,1): total=3, used=3 == n, stop.",
          "All four nodes (0,1,2,3) connected. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "No pipes → every house needs its own well; answer is sum(wells).",
      "n == 1 → just build the single well; answer wells[0].",
      "A pipe cheaper than both endpoints' wells → MST may prefer one well plus pipes over many wells.",
    ],
    twists: [
      "**Min Cost to Connect All Points (LeetCode 1584)** → MST where edge costs are Manhattan distances; no virtual node needed.",
      "**Prim instead of Kruskal** → grow from node 0 with a min-heap; same MST cost.",
      "**Wells are free but limited in number** → becomes a constrained MST / different model.",
    ],
    related: ["min-cost-to-connect-all-points", "connecting-cities-with-minimum-cost", "redundant-connection"],
  },

  {
    slug: "number-of-good-paths",
    title: "Number of Good Paths",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 2421,
    statement:
      "Given a tree of `n` nodes (edges connect them) where node `i` has value `vals[i]`, a **good path** is a simple path whose two endpoints have **equal value** and where **no node on the path exceeds** that value. A single node counts as a good path. Return the **number of distinct good paths** (a path and its reverse are the same).",
    examples: [
      { in: "vals=[1,3,2,1,3], edges=[[0,1],[0,2],[2,3],[2,4]]", out: "6", note: "5 single-node paths + path 0..? equal-value pair" },
      { in: "vals=[1,1,2,2,3], edges=[[0,1],[1,2],[2,3],[2,4]]", out: "7" },
    ],
    constraints: ["1 ≤ n ≤ 3·10⁴", "0 ≤ vals[i] ≤ 10⁵", "edges.length == n-1", "the graph is a tree"],
    recognize:
      "'Count paths whose endpoints are the max value on the path' on a tree → process nodes in **increasing value order** and merge with **union-find**: only join through nodes already added (value ≤ current), so when two components meet at a value, every same-value pair across them forms a good path.",
    figureItOut: [
      "A good path's endpoints share a value `v` and `v` is the maximum on the path. So if you only ever connect through nodes with value ≤ `v`, then any two value-`v` nodes that become connected form a good path.",
      "Sort nodes by value ascending. Process values group by group. Use **union-find** where you only union along an edge once **both** endpoints have value ≤ the current value being processed (i.e. both already activated).",
      "When processing all nodes of value `v`: activate them, union them with already-activated neighbours. After the unions, for each component count how many activated value-`v` nodes it now holds, say `k`. Those `k` nodes can pair with each other (and themselves), contributing `k*(k+1)/2` good paths.",
      "Sum over all components and all values. Single nodes are covered by the `+k` (the `k` self-paths) in the `k*(k+1)/2` formula. The final total is the number of good paths.",
    ],
    approaches: [
      {
        name: "Sort by value + union-find component counting (optimal)",
        intuition: "Add nodes in increasing value; merge through already-added neighbours; each value's component pairings are k*(k+1)/2.",
        time: "O(n log n)",
        timeWhy: "Sorting nodes dominates; union-find work is near-linear with path compression.",
        space: "O(n)",
        spaceWhy: "Adjacency list, DSU arrays, and a per-root count map.",
        code: `int[] parent;
int numberOfGoodPaths(int[] vals, int[][] edges) {
    int n = vals.length;
    List<Integer>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] e : edges) {
        adj[e[0]].add(e[1]);
        adj[e[1]].add(e[0]);
    }
    parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    boolean[] active = new boolean[n];
    Integer[] order = new Integer[n];
    for (int i = 0; i < n; i++) order[i] = i;
    Arrays.sort(order, (a, b) -> vals[a] - vals[b]);
    int good = 0;
    int i = 0;
    while (i < n) {
        int j = i;
        int v = vals[order[i]];
        while (j < n && vals[order[j]] == v) j++;   // nodes with this value: order[i..j-1]
        for (int k = i; k < j; k++) {
            int node = order[k];
            active[node] = true;
            for (int nb : adj[node]) {
                if (active[nb]) union(node, nb);
            }
        }
        Map<Integer, Integer> countByRoot = new HashMap<>();
        for (int k = i; k < j; k++) {
            int root = find(order[k]);
            countByRoot.merge(root, 1, Integer::sum);
        }
        for (int c : countByRoot.values()) {
            good += c * (c + 1) / 2;
        }
        i = j;
    }
    return good;
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
        walkthrough: [
          "vals=[1,3,2,1,3], edges 0-1,0-2,2-3,2-4. Sorted node order by value: value1 -> {0,3}, value2 -> {2}, value3 -> {1,4}.",
          "Value 1: activate 0 and 3. Neither has an active neighbour (3's neighbour 2 inactive; 0's neighbours 1,2 inactive). Two singleton components, each k=1 -> 1*2/2 + 1*2/2 = 2 good paths (the two single nodes).",
          "Value 2: activate 2. Its active neighbours are 0 and 3 -> union, forming component {0,2,3}. Only one value-2 node here, k=1 -> +1 (single node 2). Running total 3.",
          "Value 3: activate 1 and 4. Node1's active neighbour 0 -> union into the big component. Node4's active neighbour 2 -> union into the same component. Both value-3 nodes land in one component, k=2 -> 2*3/2 = 3 good paths (1, 4, and the pair 1..4). Total 3+3=6.",
        ],
      },
    ],
    edgeCases: [
      "Single node → 1 good path (itself).",
      "All values distinct → only the n single-node paths → answer n.",
      "All values equal → the whole tree connects at one value; the one component of size n gives n*(n+1)/2.",
    ],
    twists: [
      "**Count paths where endpoints are the MINIMUM** → process in decreasing value order instead.",
      "**Report the longest good path** → carry component diameters, a heavier bookkeeping.",
      "**On a general graph (cycles)** → still works because union-find ignores how many edges connect a component.",
    ],
    related: ["redundant-connection", "number-of-connected-components-in-an-undirected-graph", "min-cost-to-connect-all-points"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "expression-add-operators",
    title: "Expression Add Operators",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 282,
    statement:
      "Given a string `num` of digits and an integer `target`, insert the binary operators `+`, `-`, `*` (or nothing) between the digits so the resulting arithmetic expression evaluates to `target`. Return **all** such expressions. Operands may not have leading zeros (except the literal `0`).",
    examples: [
      { in: "num=\"123\", target=6", out: "[\"1+2+3\",\"1*2*3\"]" },
      { in: "num=\"232\", target=8", out: "[\"2*3+2\",\"2+3*2\"]" },
      { in: "num=\"105\", target=5", out: "[\"1*0+5\",\"10-5\"]" },
    ],
    constraints: ["1 ≤ num.length ≤ 10", "num consists of digits only", "−2³¹ ≤ target ≤ 2³¹−1"],
    recognize:
      "'Try every way to split the digits and place +, −, ×' is exhaustive **backtracking**. The wrinkle is multiplication binding tighter than +/−, so you carry the **previous operand** to 'undo' it and re-apply with the new factor.",
    figureItOut: [
      "At each position you decide where the next operand ends (consume 1..k digits) and which operator precedes it. That's a branching choice over positions → backtracking that builds the expression string and a running value together.",
      "Multiplication is the trap: `2+3*2` is not `(2+3)*2`. To handle precedence without parsing, carry the **last operand actually added** (`prev`). For `+operand`, the value becomes `value+operand` and the new `prev` is `+operand`. For `-operand`, value `value-operand`, prev `-operand`. For `*operand`, you must reverse the last addition: `value - prev + prev*operand`, and the new prev is `prev*operand`.",
      "Forbid leading zeros: if the chosen operand starts with `0` and has length > 1, stop extending that branch (only the single digit `0` is allowed).",
      "Base case: when you've consumed all digits, if the running `value == target`, record the built expression string. The very first operand has no operator in front of it (seed value and prev with it). Use `long` for the running value to avoid overflow.",
    ],
    approaches: [
      {
        name: "Backtracking carrying value and previous operand (optimal)",
        intuition: "Pick the next operand length, branch on +,-,*; for * undo the last operand and re-multiply; record when all digits used and value == target.",
        time: "O(4^n)",
        timeWhy: "At each of ~n gaps you choose an operator (or extend the operand): roughly 4 branches per position.",
        space: "O(n)",
        spaceWhy: "Recursion depth and the expression buffer are bounded by the digit count (output excluded).",
        code: `List<String> addOperators(String num, int target) {
    List<String> res = new ArrayList<>();
    if (num == null || num.isEmpty()) return res;
    backtrack(num, target, 0, 0L, 0L, new StringBuilder(), res);
    return res;
}
void backtrack(String num, int target, int idx, long value, long prev,
               StringBuilder expr, List<String> res) {
    if (idx == num.length()) {
        if (value == target) res.add(expr.toString());
        return;
    }
    for (int end = idx; end < num.length(); end++) {
        if (end > idx && num.charAt(idx) == '0') break;   // no leading zeros
        String part = num.substring(idx, end + 1);
        long cur = Long.parseLong(part);
        int len = expr.length();
        if (idx == 0) {
            expr.append(part);
            backtrack(num, target, end + 1, cur, cur, expr, res);
            expr.setLength(len);
        } else {
            expr.append('+').append(part);
            backtrack(num, target, end + 1, value + cur, cur, expr, res);
            expr.setLength(len);

            expr.append('-').append(part);
            backtrack(num, target, end + 1, value - cur, -cur, expr, res);
            expr.setLength(len);

            expr.append('*').append(part);
            backtrack(num, target, end + 1, value - prev + prev * cur, prev * cur, expr, res);
            expr.setLength(len);
        }
    }
}`,
        walkthrough: [
          "num=232, target=8. First operand options: 2, 23, 232. Take 2 -> value=2, prev=2.",
          "Branch 2 + ...: with operand 3: value=5,prev=3. Then *2: value = 5 - 3 + 3*2 = 8 -> matches -> record 2+3*2.",
          "Branch 2 * 3 ...: value = 2 - 2 + 2*3 = 6, prev=6. Then +2: value=8 -> record 2*3+2.",
          "Other splits (23, 232, leading combos) don't reach 8. Result [2*3+2, 2+3*2] (order may vary).",
        ],
      },
    ],
    edgeCases: [
      "Leading-zero operands like '05' are forbidden — break the loop once a multi-digit operand starts with '0'.",
      "Use long for the running value: concatenated operands and products can exceed int range.",
      "num='0', target=0 → the single expression '0'.",
    ],
    twists: [
      "**Add division too** → handle integer/float division and divide-by-zero carefully.",
      "**Count expressions instead of listing** → return an int and skip building strings.",
      "**Allow parentheses** → far larger search; the prev-operand trick no longer suffices.",
    ],
    related: ["combination-sum", "restore-ip-addresses", "partition-to-k-equal-sum-subsets"],
  },

  {
    slug: "matchsticks-to-square",
    title: "Matchsticks to Square",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 473,
    statement:
      "Given an array `matchsticks` where `matchsticks[i]` is a stick length, determine whether you can use **every** stick (each exactly once, unbroken) to form the **four equal sides of a square**. Return `true` or `false`.",
    examples: [
      { in: "matchsticks=[1,1,2,2,2]", out: "true", note: "sides of length 2: {2},{2},{2},{1,1}" },
      { in: "matchsticks=[3,3,3,3,4]", out: "false" },
    ],
    constraints: ["1 ≤ matchsticks.length ≤ 15", "1 ≤ matchsticks[i] ≤ 10⁸"],
    recognize:
      "'Partition all items into 4 groups with equal sums' is **backtracking with pruning** (a special case of k-equal-sum subsets, k=4). Place each stick into one of four side-buckets, backtrack on overflow, and prune hard with early checks and sorting.",
    figureItOut: [
      "First the cheap impossibility checks: the total length must be divisible by 4 (each side is `total/4`), and no single stick may exceed that side length. Either failing → false immediately.",
      "Keep four bucket sums (the four sides). Try to place each stick, one at a time, into some bucket without exceeding the side length; recurse to place the next stick; if a placement leads to a dead end, remove the stick (backtrack) and try another bucket.",
      "Prune aggressively: **sort sticks descending** so big sticks are placed first and conflicts surface early. If a bucket already equals the side length, skip placing more there. Crucially, if placing the stick leaves a bucket at the same sum as a bucket you already tried for this stick, skip it (symmetric buckets are interchangeable — avoids redundant branches).",
      "Base case: when all sticks are placed and you never overflowed a bucket, all four buckets must equal the side length (the sums are forced), so return true. If every placement of some stick fails, return false.",
    ],
    approaches: [
      {
        name: "Backtracking into 4 buckets with pruning (optimal)",
        intuition: "Sort descending; place each stick into a side that still has room; skip duplicate-sum buckets; succeed when all placed.",
        time: "O(4^n)",
        timeWhy: "Each of n sticks chooses one of 4 buckets; sorting and duplicate-bucket skips prune the tree massively.",
        space: "O(n)",
        spaceWhy: "Recursion depth n plus the four bucket sums.",
        code: `boolean makesquare(int[] matchsticks) {
    int total = 0;
    for (int m : matchsticks) total += m;
    if (matchsticks.length < 4 || total % 4 != 0) return false;
    int side = total / 4;
    Integer[] sticks = new Integer[matchsticks.length];
    for (int i = 0; i < matchsticks.length; i++) sticks[i] = matchsticks[i];
    Arrays.sort(sticks, Collections.reverseOrder());
    if (sticks[0] > side) return false;
    return place(sticks, 0, new int[4], side);
}
boolean place(Integer[] sticks, int idx, int[] sides, int side) {
    if (idx == sticks.length) {
        return sides[0] == side && sides[1] == side && sides[2] == side;
    }
    for (int b = 0; b < 4; b++) {
        if (sides[b] + sticks[idx] > side) continue;
        // skip buckets with an identical current sum (symmetry pruning)
        boolean dup = false;
        for (int k = 0; k < b; k++) {
            if (sides[k] == sides[b]) { dup = true; break; }
        }
        if (dup) continue;
        sides[b] += sticks[idx];
        if (place(sticks, idx + 1, sides, side)) return true;
        sides[b] -= sticks[idx];
    }
    return false;
}`,
        walkthrough: [
          "matchsticks=[1,1,2,2,2]. total=8, side=2. Sorted desc: [2,2,2,1,1]. Max 2 <= 2 ok.",
          "Place 2 in bucket0 -> [2,0,0,0]. Place 2 in bucket1 (bucket0 full, and bucket1 first empty) -> [2,2,0,0]. Place 2 in bucket2 -> [2,2,2,0].",
          "Place 1 in bucket3 -> [2,2,2,1]. Place last 1 in bucket3 -> [2,2,2,2]. All sticks placed, three checked sides ==2 (fourth forced) -> true.",
        ],
      },
    ],
    edgeCases: [
      "Fewer than 4 sticks → can't form 4 sides → false.",
      "Total not divisible by 4, or a stick longer than total/4 → false up front.",
      "Checking only sides[0..2] at the base is enough: the total forces the fourth side to equal `side` too.",
    ],
    twists: [
      "**Partition to K Equal Sum Subsets (LeetCode 698)** → identical idea with k buckets instead of 4.",
      "**Bitmask DP** → for up to 15 sticks, `dp[mask]` over used-stick subsets is a polynomial-state alternative.",
      "**Form a rectangle (two pairs of equal sides)** → relax to two target sums rather than one.",
    ],
    related: ["partition-to-k-equal-sum-subsets", "partition-equal-subset-sum", "combination-sum"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "wiggle-subsequence",
    title: "Wiggle Subsequence",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 376,
    statement:
      "A **wiggle sequence** is one whose successive differences strictly alternate between positive and negative (a sequence of length ≤ 1 is trivially wiggle; two unequal elements is a wiggle of length 2). Given `nums`, return the length of the **longest wiggle subsequence** (delete elements, keep order).",
    examples: [
      { in: "nums=[1,7,4,9,2,5]", out: "6", note: "the whole array already wiggles" },
      { in: "nums=[1,17,5,10,13,15,10,5,16,8]", out: "7" },
      { in: "nums=[1,2,3,4,5,6,7,8,9]", out: "2", note: "monotonic: only one direction change is possible" },
    ],
    constraints: ["1 ≤ nums.length ≤ 1000", "0 ≤ nums[i] ≤ 1000"],
    recognize:
      "You only care about **direction changes**: every time the trend flips from rising to falling (or back), you can extend the wiggle by one. Counting flips in a single pass is a **greedy** O(n) sweep — no DP table needed.",
    figureItOut: [
      "A longest wiggle subsequence corresponds exactly to the number of times the **monotonic direction changes** plus one. Flat stretches (equal neighbours) don't change direction and don't help, so they're skipped.",
      "Track the sign of the last meaningful difference. Walk the array once; whenever the current difference is positive **and** the last counted move was not 'up', count an up-turn; symmetrically for a down-turn. Equal consecutive values are ignored.",
      "Greedy correctness: at each genuine peak or valley you should keep the extreme element, because extending the run further in the same direction never adds a wiggle but a turn always does. Counting turns is optimal.",
      "Start the count at 1 (a single element is a wiggle of length 1). Each direction flip adds 1. The final count is the answer.",
    ],
    approaches: [
      {
        name: "Greedy direction-change counting (optimal)",
        intuition: "Count each strict change of slope sign; equal neighbours contribute nothing.",
        time: "O(n)",
        timeWhy: "One pass comparing each pair of neighbours.",
        space: "O(1)",
        spaceWhy: "Two running counters (or one running sign) and a length.",
        code: `int wiggleMaxLength(int[] nums) {
    if (nums.length < 2) return nums.length;
    int up = 1, down = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) {
            up = down + 1;          // a rise extends a sequence that last fell
        } else if (nums[i] < nums[i - 1]) {
            down = up + 1;          // a fall extends a sequence that last rose
        }
        // equal: neither changes
    }
    return Math.max(up, down);
}`,
        walkthrough: [
          "nums=[1,17,5,10,13,15,10,5,16,8]. up=down=1.",
          "1->17 rise: up=down+1=2. 17->5 fall: down=up+1=3. 5->10 rise: up=down+1=4. 10->13 rise: up stays 4 (still rising). 13->15 rise: up stays 4.",
          "15->10 fall: down=up+1=5. 10->5 fall: down stays 5. 5->16 rise: up=down+1=6. 16->8 fall: down=up+1=7.",
          "max(up,down)=max(6,7)=7.",
        ],
      },
    ],
    edgeCases: [
      "Length 0 or 1 → return the length itself (trivially wiggle).",
      "All equal elements → answer 1 (no direction ever changes).",
      "Strictly monotonic → answer 2 (one initial direction, no flips).",
    ],
    twists: [
      "**O(n) DP form** → keep `up`/`down` as 'longest wiggle ending here going up/down'; equivalent to the greedy above.",
      "**Require differences of at least k** → only count a turn when the magnitude crosses a threshold.",
      "**Longest Increasing Subsequence (LeetCode 300)** → different objective (one direction), needs O(n log n).",
    ],
    related: ["longest-increasing-subsequence", "maximum-subarray", "jump-game"],
  },

  {
    slug: "maximum-length-of-pair-chain",
    title: "Maximum Length of Pair Chain",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 646,
    statement:
      "You're given `pairs` where `pairs[i] = [left, right]` with `left < right`. A pair `(a,b)` can **follow** `(c,d)` in a chain if `b < c`. Choose pairs (in any order) to form the **longest chain**. Return the maximum chain length.",
    examples: [
      { in: "pairs=[[1,2],[2,3],[3,4]]", out: "2", note: "[1,2] -> [3,4]" },
      { in: "pairs=[[1,2],[7,8],[4,5]]", out: "3" },
    ],
    constraints: ["1 ≤ pairs.length ≤ 1000", "−1000 ≤ left < right ≤ 1000", "pairs may be in any order"],
    recognize:
      "'Pick the most non-overlapping intervals where each must start after the previous ends' is the **activity-selection greedy**: sort by **end value** and always take the next pair whose start clears the last chosen end.",
    figureItOut: [
      "This is the classic interval-scheduling problem in disguise: a chain is a set of pairs where each one's left exceeds the previous one's right — i.e. non-overlapping intervals ordered left to right.",
      "Greedy choice: **sort the pairs by their right endpoint ascending**. Always extend the chain with the pair that ends earliest among those that can still follow, because finishing earlier leaves the most room for future pairs.",
      "Sweep through the sorted pairs keeping `curEnd` = the right endpoint of the last pair added (start it at −infinity). For each pair, if its left `>` `curEnd`, add it to the chain (count++) and update `curEnd` to its right.",
      "The exchange argument: any optimal chain can be transformed to start with the earliest-ending pair without getting shorter, so the greedy never loses. The final count is the longest chain length.",
    ],
    approaches: [
      {
        name: "Sort by end + greedy selection (optimal)",
        intuition: "Sort by right endpoint; take each pair whose left clears the last chosen right.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort; the selection sweep is linear.",
        space: "O(1)",
        spaceWhy: "Sorts in place; only a running end value and a counter.",
        code: `int findLongestChain(int[][] pairs) {
    Arrays.sort(pairs, (a, b) -> a[1] - b[1]);
    int count = 0;
    int curEnd = Integer.MIN_VALUE;
    for (int[] p : pairs) {
        if (p[0] > curEnd) {
            count++;
            curEnd = p[1];
        }
    }
    return count;
}`,
        walkthrough: [
          "pairs=[[1,2],[7,8],[4,5]]. Sort by right: [1,2],[4,5],[7,8]. curEnd=-inf, count=0.",
          "[1,2]: 1 > -inf -> take, count=1, curEnd=2. [4,5]: 4 > 2 -> take, count=2, curEnd=5.",
          "[7,8]: 7 > 5 -> take, count=3, curEnd=8. Answer 3.",
        ],
      },
      {
        name: "DP by sorting on left (alternative)",
        intuition: "Sort by left; dp[i] = longest chain ending at pair i; relax from every earlier pair that fits.",
        time: "O(n²)",
        timeWhy: "Each pair compares against all earlier pairs.",
        space: "O(n)",
        spaceWhy: "A dp array over the pairs.",
        code: `int findLongestChain(int[][] pairs) {
    Arrays.sort(pairs, (a, b) -> a[0] - b[0]);
    int n = pairs.length, best = 0;
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++) {
            if (pairs[j][1] < pairs[i][0]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        best = Math.max(best, dp[i]);
    }
    return best;
}`,
      },
    ],
    edgeCases: [
      "Single pair → chain length 1.",
      "All pairs overlap (e.g. nested) → answer 1.",
      "Strict inequality `b < c` matters: pairs that merely touch (b == c) cannot chain.",
    ],
    twists: [
      "**Non-overlapping Intervals (LeetCode 435)** → minimize removals = n − (longest chain), same greedy.",
      "**Minimum Arrows to Burst Balloons (LeetCode 452)** → count groups by end-coordinate sweeping.",
      "**Allow touching pairs (b <= c)** → change the comparison to `>=`.",
    ],
    related: ["non-overlapping-intervals", "minimum-number-of-arrows-to-burst-balloons", "longest-increasing-subsequence"],
  },
];
