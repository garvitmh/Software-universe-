// NeetCode 250 extras — wave 7c (binary-search, graphs, dp, greedy, math). Java.
export const WAVE7C = [
  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "capacity-to-ship-packages-within-d-days",
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1011,
    statement:
      "A conveyor belt has packages with weights `weights[i]`, shipped in the given order. Each day you load the ship with packages (in order) without exceeding its capacity. Return the **minimum ship capacity** that lets you ship everything within `days` days.",
    examples: [
      { in: "weights = [1,2,3,4,5,6,7,8,9,10], days = 5", out: "15", note: "splits: [1..5][6,7][8][9][10]" },
      { in: "weights = [3,2,2,4,1,4], days = 3", out: "6", note: "[3,2][2,4][1,4]" },
      { in: "weights = [1,2,3,1,1], days = 4", out: "3" },
    ],
    constraints: ["1 ≤ days ≤ weights.length ≤ 5·10⁴", "1 ≤ weights[i] ≤ 500"],
    recognize:
      "You're asked for the **minimum capacity** such that the shipment fits in `days` days. 'Minimize a value where feasible(value) is monotonic' is the **binary-search-on-the-answer** signature: a bigger ship can always do at least as well as a smaller one.",
    figureItOut: [
      "First ask what the answer even ranges over. The capacity must be at least the **heaviest single package** (otherwise it never fits on any day), and at most the **sum of all weights** (one giant day). So the answer lives in [max(weights), sum(weights)].",
      "Now the key insight: is the property monotonic? If a capacity C works (ships in ≤ days days), does C+1 also work? Yes — more room never forces more days. So feasibility flips from false to true exactly once as capacity grows. That monotonic boundary is what binary search finds.",
      "Define a cheap check `feasible(cap)`: greedily pour packages into the current day until the next one would overflow, then start a new day. Count the days; it's feasible if that count ≤ `days`. That's an O(n) scan.",
      "Binary-search the capacity range. When `feasible(mid)` is true, the answer might be even smaller, so search left (`hi = mid`). When false, you need more room, search right (`lo = mid + 1`). Converge on the smallest feasible capacity.",
      "Why greedy is correct for the check: packages must ship in order, so on each day taking as many as fit can never be beaten — leaving room unused only risks needing an extra day later.",
    ],
    approaches: [
      {
        name: "Linear scan of every capacity",
        intuition: "Try capacities from max(weights) upward; return the first that fits in days.",
        time: "O(n · sum)",
        timeWhy: "Up to sum(weights) candidate capacities, each needing an O(n) feasibility scan.",
        space: "O(1)",
        spaceWhy: "Just counters.",
        code: `int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { lo = Math.max(lo, w); hi += w; }
    for (int cap = lo; cap <= hi; cap++) {
        if (feasible(weights, days, cap)) return cap;
    }
    return hi;
}`,
      },
      {
        name: "Binary search on the answer (optimal)",
        intuition: "Binary-search the capacity in [max, sum]; a monotonic greedy day-count tells you which way to go.",
        time: "O(n log(sum))",
        timeWhy: "About log(sum − max) binary-search steps, each running an O(n) feasibility check.",
        space: "O(1)",
        spaceWhy: "Only a few index and counter variables; the check is iterative.",
        code: `int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { lo = Math.max(lo, w); hi += w; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (feasible(weights, days, mid)) hi = mid;   // mid works, try smaller
        else lo = mid + 1;                            // need more room
    }
    return lo;
}

boolean feasible(int[] weights, int days, int cap) {
    int needed = 1, load = 0;
    for (int w : weights) {
        if (load + w > cap) { needed++; load = 0; }   // start a new day
        load += w;
    }
    return needed <= days;
}`,
        walkthrough: [
          "weights=[1..10], days=5 → lo=10 (max), hi=55 (sum).",
          "mid=32 feasible (fits easily) → hi=32; mid=21 feasible → hi=21; mid=15 feasible (5 days exactly) → hi=15.",
          "mid=12 needs 6 days → not feasible → lo=13; range narrows to 15 → answer 15.",
        ],
      },
    ],
    edgeCases: [
      "days == weights.length → every package its own day → answer is max(weights).",
      "days == 1 → one day for everything → answer is sum(weights).",
      "A single package heavier than a naive lower bound — initializing lo to max(weights) guards against an infeasible capacity.",
    ],
    twists: [
      "**Koko eating bananas** (LeetCode 875) → same template: binary-search the eating speed with a monotonic hours check.",
      "**Split array largest sum** (LeetCode 410) → identical problem in disguise; minimize the largest subarray sum over k splits.",
      "**Minimize max distance to gas station** (LeetCode 774) → binary-search on a real-valued answer with a feasibility count.",
    ],
    related: ["split-array-largest-sum", "find-k-closest-elements"],
  },

  {
    slug: "split-array-largest-sum",
    title: "Split Array Largest Sum",
    difficulty: "Hard",
    pattern: "binary-search",
    leetcode: 410,
    statement:
      "Given an array `nums` and an integer `k`, split `nums` into `k` non-empty **contiguous** subarrays so that the **largest subarray sum** is minimized. Return that minimized largest sum.",
    examples: [
      { in: "nums = [7,2,5,10,8], k = 2", out: "18", note: "[7,2,5][10,8] → max(14,18)=18" },
      { in: "nums = [1,2,3,4,5], k = 2", out: "9", note: "[1,2,3][4,5]" },
      { in: "nums = [1,4,4], k = 3", out: "4" },
    ],
    constraints: ["1 ≤ nums.length ≤ 1000", "0 ≤ nums[i] ≤ 10⁶", "1 ≤ k ≤ nums.length"],
    recognize:
      "'**Minimize the maximum** subarray sum over k splits' is the give-away for **binary search on the answer**. The candidate answer is a sum limit; checking whether some split keeps every piece under that limit is a cheap monotonic test.",
    figureItOut: [
      "Reframe the question around the answer itself. Instead of asking 'what is the best split?', ask 'can I split into at most k parts where **no part exceeds X**?' If yes for X, the true answer is ≤ X.",
      "That feasibility is monotonic: if a cap X works, any larger cap also works (bigger pieces allowed → never need more pieces). So as X increases, feasible(X) flips false→true exactly once. Binary search finds that boundary.",
      "Bound the search. The largest sum can never be smaller than the single biggest element (it sits in some part alone at best), and never larger than the total sum (k=1). So search X in [max(nums), sum(nums)].",
      "The check `feasible(cap)`: greedily walk left to right, accumulating into the current part; when adding the next element would exceed `cap`, close the part and start a new one. Count parts — feasible if count ≤ k.",
      "Binary-search: if `feasible(mid)`, the largest sum might be pushed lower, so `hi = mid`; otherwise `lo = mid + 1`. The smallest feasible cap is the minimized largest sum.",
    ],
    approaches: [
      {
        name: "2-D DP over splits",
        intuition: "dp[i][j] = min possible largest sum splitting the first i elements into j parts; try every last cut.",
        time: "O(n² · k)",
        timeWhy: "n×k states, each scanning back up to n positions for the last cut.",
        space: "O(n · k)",
        spaceWhy: "The dp table plus a prefix-sum array.",
        code: `// Correct but heavier. dp[i][j] over prefix sums:
// dp[i][j] = min over t<i of max(dp[t][j-1], sum(t..i)).
// Binary search on the answer is simpler and faster here.`,
      },
      {
        name: "Binary search on the answer (optimal)",
        intuition: "Binary-search the largest-sum cap in [max, sum]; a greedy part-count check guides the halving.",
        time: "O(n log(sum))",
        timeWhy: "log(sum − max) binary-search steps, each an O(n) greedy feasibility scan.",
        space: "O(1)",
        spaceWhy: "Only counters; the feasibility check is a single pass.",
        code: `int splitArray(int[] nums, int k) {
    int lo = 0;
    long hi = 0;
    for (int x : nums) { lo = Math.max(lo, x); hi += x; }
    long left = lo, right = hi;
    while (left < right) {
        long mid = left + (right - left) / 2;
        if (feasible(nums, k, mid)) right = mid;   // cap works, try smaller
        else left = mid + 1;                       // need a bigger cap
    }
    return (int) left;
}

boolean feasible(int[] nums, int k, long cap) {
    int parts = 1;
    long cur = 0;
    for (int x : nums) {
        if (cur + x > cap) { parts++; cur = 0; }   // start a new part
        cur += x;
    }
    return parts <= k;
}`,
        walkthrough: [
          "nums=[7,2,5,10,8], k=2 → lo=10 (max), hi=32 (sum).",
          "mid=21 feasible ([7,2,5,10]=24>21 forces split → [7,2,5][10,8]=2 parts) → right=21.",
          "mid=15 → [7,2,5][10]... [8] = 3 parts > 2 → infeasible → left=16; narrows to 18.",
          "mid=18 feasible ([7,2,5][10,8] max 18, 2 parts) → answer 18.",
        ],
      },
    ],
    edgeCases: [
      "k == 1 → no splitting → answer is the full sum.",
      "k == nums.length → each element alone → answer is max(nums).",
      "Use a `long` for the sum upper bound — 1000 elements up to 10⁶ overflow a naive int sum.",
    ],
    twists: [
      "**Capacity to ship within D days** (LeetCode 1011) → literally the same algorithm with weights and days.",
      "**Koko eating bananas** (LeetCode 875) → binary-search a rate with an hours-feasibility check.",
      "**Maximum, minimized** family generally → whenever 'minimize the max' (or 'maximize the min') has a monotonic feasibility test, reach for this template.",
    ],
    related: ["capacity-to-ship-packages-within-d-days", "find-k-closest-elements"],
  },

  {
    slug: "find-k-closest-elements",
    title: "Find K Closest Elements",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 658,
    statement:
      "Given a **sorted** array `arr`, an integer `k`, and a value `x`, return the `k` elements closest to `x`, sorted ascending. Closer means smaller `|a − x|`; ties prefer the **smaller** value.",
    examples: [
      { in: "arr = [1,2,3,4,5], k = 4, x = 3", out: "[1,2,3,4]" },
      { in: "arr = [1,2,3,4,5], k = 4, x = -1", out: "[1,2,3,4]" },
      { in: "arr = [1,1,2,3,4,5], k = 4, x = -1", out: "[1,1,2,3]" },
    ],
    constraints: ["1 ≤ k ≤ arr.length ≤ 10⁴", "arr is sorted ascending", "−10⁴ ≤ arr[i], x ≤ 10⁴"],
    recognize:
      "The answer is a **contiguous window** of length k in a sorted array (the closest k values must be adjacent). 'Find the best window start in sorted data' → **binary-search the left boundary** in O(log n).",
    figureItOut: [
      "First realize the result is a contiguous slice. In a sorted array, the k closest values to x can't have a gap — anything between two chosen values is at least as close. So you're really choosing **where the window of length k starts**: an index `lo` in [0, n−k].",
      "Brute idea: compute every window's total distance, or sort all elements by distance — O(n log n) or worse. But the sortedness lets you decide the window start directly.",
      "The decision at a candidate start `mid`: compare the element just left of the window, `arr[mid]`, with the element at the window's right end, `arr[mid + k]`. Whichever is farther from x should be excluded.",
      "If `x − arr[mid] > arr[mid + k] - x`, the left edge is farther, so slide the window right: `lo = mid + 1`. Otherwise the right edge is no closer, so keep the left: `hi = mid`. The tie (prefer smaller value) is handled by `>` favoring the left side.",
      "Binary-search `lo` over [0, n−k]. When `lo == hi`, that's the optimal window start; return `arr[lo .. lo+k-1]`.",
    ],
    approaches: [
      {
        name: "Two-pointer trim from both ends",
        intuition: "Start with the whole array; repeatedly drop whichever end is farther from x until k remain.",
        time: "O(n − k)",
        timeWhy: "Each step removes one element until the window is size k.",
        space: "O(1)",
        spaceWhy: "Two pointers (excluding the output).",
        code: `List<Integer> findClosestElements(int[] arr, int k, int x) {
    int l = 0, r = arr.length - 1;
    while (r - l + 1 > k) {
        if (Math.abs(arr[l] - x) > Math.abs(arr[r] - x)) l++;
        else r--;   // ties drop the right (farther-or-equal) end → keeps smaller values
    }
    List<Integer> res = new ArrayList<>();
    for (int i = l; i <= r; i++) res.add(arr[i]);
    return res;
}`,
      },
      {
        name: "Binary search the window start (optimal)",
        intuition: "Search the left boundary lo in [0, n−k] by comparing the element leaving vs the element entering.",
        time: "O(log(n − k) + k)",
        timeWhy: "Binary search finds the start in log steps; building the k-length answer is O(k).",
        space: "O(1)",
        spaceWhy: "Only indices, beyond the output list.",
        code: `List<Integer> findClosestElements(int[] arr, int k, int x) {
    int lo = 0, hi = arr.length - k;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        // left edge arr[mid] vs right neighbor arr[mid+k]
        if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1; // left is farther → shift right
        else hi = mid;                                     // keep left edge
    }
    List<Integer> res = new ArrayList<>();
    for (int i = lo; i < lo + k; i++) res.add(arr[i]);
    return res;
}`,
        walkthrough: [
          "arr=[1,2,3,4,5], k=4, x=3 → lo=0, hi=1.",
          "mid=0: x−arr[0]=2 vs arr[4]−x=2 → not strictly greater → hi=0 (keep left edge at index 0).",
          "lo==hi==0 → window [1,2,3,4]. The right-end 5 (distance 2) is dropped, tie broken toward the smaller value 1.",
        ],
      },
    ],
    edgeCases: [
      "x smaller than every element → the first k elements.",
      "x larger than every element → the last k elements.",
      "Duplicates with ties → the comparison `x - arr[mid] > arr[mid+k] - x` (strict) keeps the smaller-valued left side on a tie.",
    ],
    twists: [
      "**Unsorted input** → a max-heap of size k by distance (the heaps pattern), O(n log k).",
      "**K closest points to origin** (LeetCode 973) → same 'closest k' idea in 2-D, solved with a heap or quickselect.",
      "**Closest single value to x** → plain binary search for the insertion point, then compare the two neighbors.",
    ],
    related: ["capacity-to-ship-packages-within-d-days", "sqrtx"],
  },

  {
    slug: "sqrtx",
    title: "Sqrt(x)",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 69,
    statement:
      "Given a non-negative integer `x`, return the integer square root of `x` — that is, `floor(sqrt(x))`. You may not use any built-in sqrt function.",
    examples: [
      { in: "x = 4", out: "2" },
      { in: "x = 8", out: "2", note: "sqrt(8) ≈ 2.828, floored to 2" },
      { in: "x = 0", out: "0" },
    ],
    constraints: ["0 ≤ x ≤ 2³¹ − 1"],
    recognize:
      "You want the largest integer `r` with `r·r ≤ x`. The predicate `r·r ≤ x` is **monotonic** (true for small r, false past the root), so binary-search the answer range [0, x] for that boundary.",
    figureItOut: [
      "A linear scan from 0 upward, stopping when `r·r > x`, is correct but O(√x). For x near 2³¹ that's ~46000 steps — fine, but we can do far better and it teaches the pattern.",
      "Notice the condition `r·r ≤ x` is monotonic: it holds for 0,1,...,floor(sqrt(x)) and fails for everything larger. So there's a clean boundary, and binary search hunts boundaries.",
      "Search r in [0, x]. At each `mid`, test `mid·mid ≤ x`. If yes, `mid` is a valid candidate but maybe too small, so remember it and search right. If no, search left.",
      "The overflow trap: `mid·mid` can exceed int range. Use `long` for the product (or compare `mid` against `x / mid`). This is the single most common bug here.",
      "When the loop ends, the last `mid` that satisfied `mid·mid ≤ x` is the floor of the square root.",
    ],
    approaches: [
      {
        name: "Linear search",
        intuition: "Count up r until r·r exceeds x; the previous r is the answer.",
        time: "O(√x)",
        timeWhy: "It walks from 0 up to roughly the square root of x.",
        space: "O(1)",
        spaceWhy: "A single counter.",
        code: `int mySqrt(int x) {
    long r = 0;
    while (r * r <= x) r++;
    return (int) (r - 1);
}`,
      },
      {
        name: "Binary search on the answer (optimal)",
        intuition: "Halve the range [0, x], keeping the largest mid whose square stays ≤ x.",
        time: "O(log x)",
        timeWhy: "The range halves each step.",
        space: "O(1)",
        spaceWhy: "Just the bounds and an answer holder.",
        code: `int mySqrt(int x) {
    long lo = 0, hi = x, ans = 0;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid <= x) {     // long product avoids overflow
            ans = mid;            // candidate; maybe a bigger one works
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    return (int) ans;
}`,
        walkthrough: [
          "x=8 → lo=0, hi=8. mid=4: 16>8 → hi=3.",
          "mid=1: 1≤8 → ans=1, lo=2. mid=2: 4≤8 → ans=2, lo=3. mid=3: 9>8 → hi=2.",
          "lo(3)>hi(2) → return ans=2.",
        ],
      },
    ],
    edgeCases: [
      "x = 0 and x = 1 → return x itself (0 and 1 are their own floors).",
      "Perfect squares (4, 9, 16) → exact root; the `≤` keeps the exact value.",
      "Large x near 2³¹ → `mid·mid` overflows int — the `long` cast is mandatory.",
    ],
    twists: [
      "**Real-valued sqrt to precision** → binary-search on doubles, or Newton's method `r = (r + x/r) / 2`.",
      "**Valid perfect square** (LeetCode 367) → same search; return whether mid·mid == x exactly.",
      "**Newton's method** converges quadratically — fewer iterations than binary search for floating point.",
    ],
    related: ["find-k-closest-elements", "capacity-to-ship-packages-within-d-days"],
  },

  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "accounts-merge",
    title: "Accounts Merge",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 721,
    statement:
      "Each account is `[name, email1, email2, ...]`. Two accounts belong to the same person if they share **any** email (names can repeat across people). Merge accounts: return each merged account as `[name, ...sorted unique emails]`.",
    examples: [
      {
        in: 'accounts = [["John","a@x","b@x"],["John","b@x","c@x"],["Mary","m@x"]]',
        out: '[["John","a@x","b@x","c@x"],["Mary","m@x"]]',
        note: "the two Johns share b@x → one person",
      },
    ],
    constraints: ["1 ≤ accounts.length ≤ 1000", "emails are lowercase, account name is first", "shared email ⇒ same person"],
    recognize:
      "'Things that share a link belong to the same group' is a **connectivity** problem. Model emails as nodes, connect emails within one account, and the connected components are the people — solve with **union-find** (or DFS over an email graph).",
    figureItOut: [
      "Strip away the names for a moment. The real question is purely about emails: which emails belong together? Two emails are linked if they appear in the same account, and linkage is transitive (a~b and b~c ⇒ a, b, c are one person).",
      "Transitive grouping with merge operations is exactly what **union-find (disjoint set union)** is built for. Treat each distinct email as an element.",
      "For each account, union its first email with every other email in that account. After processing all accounts, emails in the same set are the same person. Why union to the first? Any spanning choice works — you only need every pair in the account to end up connected, and chaining through the first email achieves that.",
      "You also need to recover the name for each group. Keep a map `email → name` (the account's name) as you go; every email in a component shares the same person, so any one name is right.",
      "Finally, group emails by their set's representative (find-root), sort each group's emails, and prepend the name. Sorting is required by the output spec.",
    ],
    approaches: [
      {
        name: "DFS over an email graph",
        intuition: "Build an adjacency map linking emails within each account, then flood-fill each component.",
        time: "O(N · α + E log E)",
        timeWhy: "Building edges is near-linear; the per-account sort of emails dominates with E the total emails.",
        space: "O(N)",
        spaceWhy: "Adjacency map plus a visited set over all emails.",
        code: `// Build graph: each email -> set of emails it shares an account with.
// Then DFS from each unvisited email to collect its whole component,
// sort, prepend the name. (Shown for contrast with union-find below.)`,
      },
      {
        name: "Union-Find (optimal, idiomatic)",
        intuition: "Union all emails inside each account; group by root; attach the name; sort each group.",
        time: "O(N · α(N) + E log E)",
        timeWhy: "Unions/finds are near-constant (inverse-Ackermann α); the final per-group email sort dominates.",
        space: "O(N)",
        spaceWhy: "Parent map and the email→name map over all distinct emails.",
        code: `Map<String, String> parent = new HashMap<>();

String find(String e) {
    parent.putIfAbsent(e, e);
    while (!parent.get(e).equals(e)) {
        parent.put(e, parent.get(parent.get(e)));   // path compression
        e = parent.get(e);
    }
    return e;
}

void union(String a, String b) { parent.put(find(a), find(b)); }

List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, String> ownerName = new HashMap<>();
    for (List<String> acc : accounts) {
        String name = acc.get(0), first = acc.get(1);
        for (int i = 1; i < acc.size(); i++) {
            String email = acc.get(i);
            ownerName.put(email, name);
            union(first, email);
        }
    }
    Map<String, TreeSet<String>> groups = new HashMap<>();
    for (String email : ownerName.keySet()) {
        String root = find(email);
        groups.computeIfAbsent(root, k -> new TreeSet<>()).add(email);
    }
    List<List<String>> res = new ArrayList<>();
    for (Map.Entry<String, TreeSet<String>> e : groups.entrySet()) {
        List<String> merged = new ArrayList<>();
        merged.add(ownerName.get(e.getKey()));
        merged.addAll(e.getValue());                 // TreeSet keeps them sorted
        res.add(merged);
    }
    return res;
}`,
        walkthrough: [
          "Account1 John[a,b]: union(a,b). Account2 John[b,c]: union(b,c) → a,b,c share a root.",
          "Account3 Mary[m]: m is its own root.",
          "Group by root: {a,b,c} (TreeSet sorts) → [John,a@x,b@x,c@x]; {m} → [Mary,m@x].",
        ],
      },
    ],
    edgeCases: [
      "Two different people with the same name but no shared email → stay separate (don't merge on name).",
      "An account with a single email → its own component unless another account shares that email.",
      "Emails must be deduped and sorted in the output — a TreeSet handles both.",
    ],
    twists: [
      "**Number of provinces** (LeetCode 547) → the same union-find counting connected groups.",
      "**Friend circles / connected components in a graph** → identical DSU template over different nodes.",
      "**Redundant connection** (LeetCode 684) → DSU detecting the edge that closes a cycle.",
    ],
    related: ["shortest-bridge"],
  },

  {
    slug: "shortest-bridge",
    title: "Shortest Bridge",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 934,
    statement:
      "An `n × n` binary grid contains exactly **two** islands (4-directionally connected 1s). Return the minimum number of 0s you must flip to 1 to **connect the two islands** into one.",
    examples: [
      { in: "grid = [[0,1],[1,0]]", out: "1" },
      { in: "grid = [[0,1,0],[0,0,0],[0,0,1]]", out: "2" },
      { in: "grid = [[1,1,1,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,0,1],[1,1,1,1,1]]", out: "1" },
    ],
    constraints: ["2 ≤ n ≤ 100", "exactly two islands", "grid[i][j] is 0 or 1"],
    recognize:
      "'Shortest connection between two regions' = shortest path in an unweighted grid → **BFS**. The twist: start the BFS from an **entire island at once** (multi-source) and expand outward until you touch the other island.",
    figureItOut: [
      "The answer is the smallest number of water cells separating the two islands — a shortest-distance question on an unweighted grid. Shortest distance with uniform step cost screams BFS.",
      "But BFS from a single cell isn't enough: any cell of island A is a valid launch point. So first, **identify all of island A** with a flood fill (DFS or BFS), marking its cells (say as 2) and dropping every one of them into a BFS queue as a multi-source frontier.",
      "Now run BFS outward layer by layer over water. Each layer is one flip. The number of layers crossed before the frontier first reaches a cell of island B is the bridge length.",
      "Why find island A first instead of treating both as sources? You need to expand from exactly one island and detect arrival at the **other**. The first island's cells become the sources; the first time expansion hits a `1` that isn't part of island A, that's island B and the current distance is the answer.",
      "Each BFS step counts as a flip because we're turning a 0 into a 1 to walk across it. The first contact gives the minimum because BFS explores in non-decreasing distance order.",
    ],
    approaches: [
      {
        name: "Flood-fill one island, then multi-source BFS (optimal)",
        intuition: "DFS-mark island A and seed the queue with all its cells; BFS outward; first hit of island B is the distance.",
        time: "O(n²)",
        timeWhy: "Both the flood fill and the BFS visit each of the n² cells a constant number of times.",
        space: "O(n²)",
        spaceWhy: "The BFS queue and visited marking can hold up to all n² cells.",
        code: `int shortestBridge(int[][] grid) {
    int n = grid.length;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    Deque<int[]> queue = new ArrayDeque<>();
    boolean found = false;
    // Step 1: flood-fill the first island, marking it 2 and seeding the queue.
    for (int i = 0; i < n && !found; i++)
        for (int j = 0; j < n && !found; j++)
            if (grid[i][j] == 1) { dfs(grid, i, j, queue, dirs); found = true; }
    // Step 2: multi-source BFS expanding over water.
    int steps = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int s = 0; s < size; s++) {
            int[] cell = queue.poll();
            for (int[] d : dirs) {
                int r = cell[0] + d[0], c = cell[1] + d[1];
                if (r < 0 || c < 0 || r >= n || c >= n) continue;
                if (grid[r][c] == 2) continue;          // already part of island A / visited
                if (grid[r][c] == 1) return steps;       // reached the other island
                grid[r][c] = 2;                          // flip this water cell, mark visited
                queue.offer(new int[]{r, c});
            }
        }
        steps++;
    }
    return -1;
}

void dfs(int[][] grid, int i, int j, Deque<int[]> queue, int[][] dirs) {
    int n = grid.length;
    if (i < 0 || j < 0 || i >= n || j >= n || grid[i][j] != 1) return;
    grid[i][j] = 2;
    queue.offer(new int[]{i, j});
    for (int[] d : dirs) dfs(grid, i + d[0], j + d[1], queue, dirs);
}`,
        walkthrough: [
          "grid=[[0,1,0],[0,0,0],[0,0,1]]: DFS marks the top-right 1 as island A, queue={(0,1)}.",
          "steps=0 layer: neighbors (0,0),(0,2),(1,1) are water → flipped, queued.",
          "steps=1 layer: expand again; (2,2) is the other island's 1 → return steps=2.",
        ],
      },
    ],
    edgeCases: [
      "Islands diagonally adjacent (e.g. [[0,1],[1,0]]) → not 4-connected, need 1 flip.",
      "A large island wrapping a small one → BFS from the outer island still finds the minimum gap.",
      "Marking visited (grid → 2) is essential or the BFS revisits cells and over-counts.",
    ],
    twists: [
      "**Number of islands** (LeetCode 200) → just the flood-fill half of this problem.",
      "**Rotting oranges** (LeetCode 994) → multi-source BFS measuring time to fill, same layered expansion.",
      "**01 Matrix** (LeetCode 542) → multi-source BFS computing distance to the nearest 0 for every cell.",
    ],
    related: ["accounts-merge"],
  },

  // ───────────────────────────── DP (2-D) ─────────────────────────────
  {
    slug: "maximal-rectangle",
    title: "Maximal Rectangle",
    difficulty: "Hard",
    pattern: "dp-2d",
    leetcode: 85,
    statement:
      "Given a `rows × cols` binary matrix of `'0'` and `'1'`, return the **area of the largest rectangle** containing only 1s.",
    examples: [
      {
        in: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
        out: "6",
        note: "the 2×3 block of 1s in the lower middle",
      },
      { in: 'matrix = [["0"]]', out: "0" },
      { in: 'matrix = [["1"]]', out: "1" },
    ],
    constraints: ["1 ≤ rows, cols ≤ 200", "matrix[i][j] is '0' or '1'"],
    recognize:
      "A 2-D 'largest all-1s rectangle' reduces to a **1-D histogram** problem solved row by row. Build a running column-height array as each row becomes the histogram's base, then apply 'largest rectangle in histogram' (a monotonic stack) per row.",
    figureItOut: [
      "The brute force — try every pair of corners — is O((rows·cols)²) or worse. The trick is to find structure that lets each row be solved in linear time.",
      "Reframe each row as the base of a **histogram**. For column j, let `heights[j]` be how many consecutive 1s stack upward ending at the current row. If the cell is 1, `heights[j]` grows by one; if it's 0, it resets to 0 (the column of 1s is broken).",
      "Now the largest all-1s rectangle whose **bottom edge is this row** is exactly the largest rectangle in that histogram. So the overall answer is the max over all rows of 'largest rectangle in histogram(heights)'.",
      "Define the DP state precisely: `heights[r][j]` = number of consecutive 1s in column j ending at row r. Recurrence: `heights[r][j] = matrix[r][j]=='1' ? heights[r-1][j] + 1 : 0`. Base: row 0 is just the row's own 0/1 values. We only need one rolling row, so a 1-D `heights` array suffices.",
      "For each updated histogram, run 'largest rectangle in histogram' with a monotonic increasing stack: when a shorter bar arrives, pop taller bars and, for each, compute area = poppedHeight × width, where width spans from the new index back to the bar now below the popped one. Track the global max.",
    ],
    approaches: [
      {
        name: "Brute force over all rectangles",
        intuition: "Fix a top-left and bottom-right corner; verify all 1s inside.",
        time: "O((rows·cols)²)",
        timeWhy: "Quadratic in the number of cells just to enumerate corner pairs, plus validation.",
        space: "O(1)",
        spaceWhy: "No extra structure (validation reuses the matrix).",
        code: `// Far too slow for 200×200 — enumerate corner pairs, check the block is all 1s.
// Shown only to motivate the histogram reduction below.`,
      },
      {
        name: "Row histograms + monotonic stack (optimal)",
        intuition: "Maintain per-column 1-heights row by row; each row is a histogram; take the max rectangle of each.",
        time: "O(rows · cols)",
        timeWhy: "Each row updates heights in O(cols), and the histogram stack pass is O(cols) (each bar pushed/popped once).",
        space: "O(cols)",
        spaceWhy: "One rolling heights array plus a stack, both sized to the columns.",
        code: `int maximalRectangle(char[][] matrix) {
    if (matrix.length == 0) return 0;
    int cols = matrix[0].length;
    int[] heights = new int[cols];
    int best = 0;
    for (char[] row : matrix) {
        for (int j = 0; j < cols; j++)
            heights[j] = row[j] == '1' ? heights[j] + 1 : 0;   // grow or reset column
        best = Math.max(best, largestInHistogram(heights));
    }
    return best;
}

int largestInHistogram(int[] h) {
    Deque<Integer> stack = new ArrayDeque<>();   // indices of increasing heights
    int best = 0, n = h.length;
    for (int i = 0; i <= n; i++) {
        int cur = i == n ? 0 : h[i];             // sentinel 0 flushes the stack at the end
        while (!stack.isEmpty() && h[stack.peek()] > cur) {
            int height = h[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            best = Math.max(best, height * width);
        }
        stack.push(i);
    }
    return best;
}`,
        walkthrough: [
          "Row0 heights=[1,0,1,0,0] → max rect 1.",
          "Row1 heights=[2,0,2,1,1] → max rect 3 (the 1×3 across cols 2..4).",
          "Row2 heights=[3,1,3,2,2] → histogram max rect 6 (height 2 over the 3-wide span cols 2..4) → answer 6.",
        ],
      },
    ],
    edgeCases: [
      "All 0s → area 0.",
      "A single row → reduces to one histogram pass.",
      "A column resetting to 0 mid-way must zero its height, or rectangles 'jump' across a gap.",
    ],
    twists: [
      "**Largest rectangle in histogram** (LeetCode 84) → the inner subroutine on its own.",
      "**Maximal square** (LeetCode 221) → restricted to squares; a simpler O(rows·cols) DP `dp[i][j]=min(neighbors)+1`.",
      "**Count submatrices with all ones** (LeetCode 1504) → similar height array, counting instead of max area.",
    ],
    related: ["longest-valid-parentheses"],
  },

  // ───────────────────────────── DP (1-D) ─────────────────────────────
  {
    slug: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    pattern: "dp-1d",
    leetcode: 32,
    statement:
      "Given a string of only `'('` and `')'`, return the length of the **longest valid (well-formed) parentheses substring**.",
    examples: [
      { in: 's = "(()"', out: "2", note: '"()"' },
      { in: 's = ")()())"', out: "4", note: '"()()"' },
      { in: 's = ""', out: "0" },
    ],
    constraints: ["0 ≤ s.length ≤ 3·10⁴", "s consists of '(' and ')'"],
    recognize:
      "'Longest valid contiguous substring' over a one-dimensional string, where each position's answer builds on earlier positions, is a **1-D DP**. (A stack of indices also works — the two views are equivalent.)",
    figureItOut: [
      "Validity is about matching: every ')' needs a prior unmatched '('. A valid substring must end in ')', so it's natural to ask, for each index i, 'what's the longest valid substring **ending exactly at i**?'",
      "Name the state: `dp[i]` = length of the longest valid parentheses substring ending at index i. A '(' can never end a valid substring, so `dp[i] = 0` whenever `s[i] == '('`. Base case: `dp[0] = 0` always.",
      "Now the recurrence for `s[i] == ')'`. Two ways a valid run can end here. Case A — the previous char is '(': then `()` closes right here, extending whatever valid run sat before it: `dp[i] = dp[i-2] + 2`.",
      "Case B — the previous char is ')': then there's a valid block `dp[i-1]` just before i. For our ')' to match, look at the character **just before that block**, at index `j = i - dp[i-1] - 1`. If `s[j] == '('`, it pairs with our ')', so `dp[i] = dp[i-1] + 2`, plus we can chain whatever valid run preceded `j`: add `dp[j-1]`.",
      "The answer is the maximum `dp[i]` over all i. Each cell is O(1), so it's a single left-to-right pass. The careful bit is the index arithmetic for the matching '(' — out-of-bounds guards (`i-2 >= 0`, `j >= 0`) prevent off-by-one bugs.",
    ],
    approaches: [
      {
        name: "Stack of indices",
        intuition: "Push a base index −1; push '(' indices; on ')' pop and measure i − top, or reset the base.",
        time: "O(n)",
        timeWhy: "Each index pushed and popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack can hold up to n indices.",
        code: `int longestValidParentheses(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(-1);                       // sentinel base for length math
    int best = 0;
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.isEmpty()) stack.push(i);          // new base after an unmatched ')'
            else best = Math.max(best, i - stack.peek());
        }
    }
    return best;
}`,
      },
      {
        name: "1-D DP ending at i (optimal)",
        intuition: "dp[i] = longest valid run ending at i; close `()` directly or chain through a nested valid block.",
        time: "O(n)",
        timeWhy: "One pass; each dp[i] is computed in O(1).",
        space: "O(n)",
        spaceWhy: "The dp array of length n.",
        code: `int longestValidParentheses(String s) {
    int n = s.length(), best = 0;
    int[] dp = new int[n];
    for (int i = 1; i < n; i++) {
        if (s.charAt(i) == ')') {
            if (s.charAt(i - 1) == '(') {
                dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;        // case A: "...()"
            } else {
                int j = i - dp[i - 1] - 1;                   // char before the inner block
                if (j >= 0 && s.charAt(j) == '(') {
                    dp[i] = dp[i - 1] + 2 + (j >= 1 ? dp[j - 1] : 0); // case B: "...((...))"
                }
            }
            best = Math.max(best, dp[i]);
        }
    }
    return best;
}`,
        walkthrough: [
          's=")()())": dp[1]=0(\'(\'), dp[2]=2 (\'()\' via case A).',
          "dp[3]=0 ('('), dp[4]=dp[3? no]... s[4]=')', prev='(' → dp[4]=dp[2]+2=4.",
          "dp[5]=0 (the trailing ')' has prev ')' but j points to unmatched) → best=4.",
        ],
      },
    ],
    edgeCases: [
      "Empty string → 0.",
      'All "(((" or all ")))" → 0 (nothing matches).',
      "The `dp[i-2]`/`dp[j-1]` chaining is what lets separate valid blocks join into one longer run; dropping it under-counts.",
    ],
    twists: [
      "**Valid parentheses** (LeetCode 20) → just check validity, no length.",
      "**Minimum add to make valid** (LeetCode 921) → count unmatched openers and closers.",
      "**Remove invalid parentheses** (LeetCode 301) → BFS/backtracking over deletions.",
    ],
    related: ["number-of-longest-increasing-subsequence", "maximal-rectangle"],
  },

  {
    slug: "number-of-longest-increasing-subsequence",
    title: "Number of Longest Increasing Subsequence",
    difficulty: "Medium",
    pattern: "dp-1d",
    leetcode: 673,
    statement:
      "Given an integer array `nums`, return the **number of longest strictly increasing subsequences**. The subsequences need not be contiguous.",
    examples: [
      { in: "nums = [1,3,5,4,7]", out: "2", note: "[1,3,4,7] and [1,3,5,7]" },
      { in: "nums = [2,2,2,2,2]", out: "5", note: "each single 2 is a longest (length-1) subsequence" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2000", "−10⁶ ≤ nums[i] ≤ 10⁶"],
    recognize:
      "It extends **Longest Increasing Subsequence** — a classic 1-D DP — but you must track not just the longest length ending at each index, but also **how many** ways achieve it. Two parallel DP arrays: lengths and counts.",
    figureItOut: [
      "Start from plain LIS. The standard O(n²) DP defines `len[i]` = length of the longest strictly increasing subsequence **ending at index i**. Recurrence: for each j < i with `nums[j] < nums[i]`, `len[i] = max(len[i], len[j] + 1)`. Base: every `len[i]` starts at 1 (the element alone).",
      "Now we want counts, not just the max length. Add a second array `cnt[i]` = the number of longest increasing subsequences ending at i. Base: `cnt[i] = 1` (the single-element subsequence).",
      "The crux is updating counts while scanning j < i with `nums[j] < nums[i]`. Two sub-cases. If extending j gives a **strictly longer** subsequence (`len[j] + 1 > len[i]`), we've found a new best length, so adopt it and **inherit** j's count: `len[i] = len[j]+1; cnt[i] = cnt[j]`.",
      "If extending j gives the **same** best length (`len[j] + 1 == len[i]`), then j offers additional ways to reach that length, so **add**: `cnt[i] += cnt[j]`. This accumulation is the whole trick — equal-length predecessors contribute their counts.",
      "Finally, find the overall longest length L = max(len[i]), then sum `cnt[i]` over every i where `len[i] == L`. That total is the number of longest increasing subsequences. State and recurrence fully named; the table is two arrays filled left to right.",
    ],
    approaches: [
      {
        name: "Two parallel DP arrays (optimal for the constraints)",
        intuition: "len[i] = longest LIS ending at i; cnt[i] = how many achieve it. Extend lengths, inherit or add counts.",
        time: "O(n²)",
        timeWhy: "For each i you scan all earlier j — n² pairs (fine for n ≤ 2000).",
        space: "O(n)",
        spaceWhy: "Two arrays of length n.",
        code: `int findNumberOfLIS(int[] nums) {
    int n = nums.length;
    int[] len = new int[n], cnt = new int[n];
    Arrays.fill(len, 1);
    Arrays.fill(cnt, 1);
    int longest = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                if (len[j] + 1 > len[i]) {
                    len[i] = len[j] + 1;       // strictly longer → adopt and inherit count
                    cnt[i] = cnt[j];
                } else if (len[j] + 1 == len[i]) {
                    cnt[i] += cnt[j];          // another way to the same length → add
                }
            }
        }
        longest = Math.max(longest, len[i]);
    }
    int total = 0;
    for (int i = 0; i < n; i++) if (len[i] == longest) total += cnt[i];
    return total;
}`,
        walkthrough: [
          "nums=[1,3,5,4,7]: len=[1,2,3,3,4], cnt=[1,1,1,1,?].",
          "At i=4 (7): j=2(5) gives len 4, cnt inherits 1; j=3(4) also gives len 4 (same) → cnt += cnt[3]=1 → cnt[4]=2.",
          "longest=4, sum cnt where len==4 → cnt[4]=2 → answer 2.",
        ],
      },
    ],
    edgeCases: [
      "All equal (strictly increasing fails) → each element is its own length-1 subsequence → count == n.",
      "Single element → length 1, count 1.",
      "Strictly increasing array → one unique longest subsequence → count 1.",
    ],
    twists: [
      "**Longest increasing subsequence** (LeetCode 300) → just the length; O(n log n) with patience sorting / binary search.",
      "**Count via segment tree / BIT** → speeds the counting variant toward O(n log n) for larger n.",
      "**Russian doll envelopes** (LeetCode 354) → 2-D LIS after sorting on one dimension.",
    ],
    related: ["longest-valid-parentheses", "two-city-scheduling"],
  },

  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "two-city-scheduling",
    title: "Two City Scheduling",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1029,
    statement:
      "There are `2n` people. `costs[i] = [aCost, bCost]` is the cost of flying person i to city A or city B. Send **exactly n people to each city** to minimize the total cost.",
    examples: [
      { in: "costs = [[10,20],[30,200],[400,50],[30,20]]", out: "110", note: "send 0,3 to A and 1,2 to B" },
      { in: "costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]", out: "1859" },
    ],
    constraints: ["2n == costs.length", "1 ≤ n ≤ 100", "1 ≤ aCost, bCost ≤ 1000"],
    recognize:
      "'Split into two equal groups at minimum cost' with a per-item preference is a classic **greedy by relative cost**. Sort by how much cheaper A is than B; the strongest A-preferrers go to A, the rest to B.",
    figureItOut: [
      "A tempting brute force is to try every way to choose which n of the 2n go to A — that's combinatorial, C(2n, n), far too many.",
      "Reframe with a baseline: imagine sending **everyone to city A**, paying `aCost` for each. Then we must move exactly n of them to B instead. Moving person i from A to B changes the bill by `bCost − aCost` (could be negative, i.e. a saving).",
      "To minimize total cost, we want the n moves with the **most negative** (or smallest) `bCost − aCost` — those are the people for whom B is relatively cheapest. So sort everyone by `aCost − bCost` descending (equivalently `bCost − aCost` ascending).",
      "After sorting that way, the first half are the people who prefer A most strongly (largest `aCost − bCost` means A−B is large positive... wait — check the direction): we want the n people whose `bCost − aCost` is smallest to go to B. Sorting by `(a − b)` ascending puts the strongest B-preferrers (most negative b−a) first; cleanest is to sort by `(a − b)` and send the first n to A only if we orient it right — so just compute the delta and pick deliberately.",
      "Concretely: sort by `costs[i][0] - costs[i][1]` (A minus B) ascending. The first n entries have the smallest A−B — meaning A is cheapest relative to B for them — so send those n to **A**; send the remaining n to **B**. Sum the chosen costs. Greedy is optimal because each person's contribution is independent given the equal-split constraint, and we always pick the cheaper relative assignment.",
    ],
    approaches: [
      {
        name: "Sort by relative cost (greedy, optimal)",
        intuition: "Order people by aCost − bCost; the n with the smallest values fly to A, the rest to B.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting the 2n people; the cost sum is linear.",
        space: "O(1)",
        spaceWhy: "Sorts in place (beyond the input); only an accumulator.",
        code: `int twoCitySchedCost(int[][] costs) {
    // A cheaper-relative-to-B first.
    Arrays.sort(costs, (x, y) -> (x[0] - x[1]) - (y[0] - y[1]));
    int n = costs.length / 2, total = 0;
    for (int i = 0; i < costs.length; i++) {
        total += i < n ? costs[i][0] : costs[i][1];  // first n → A, rest → B
    }
    return total;
}`,
        walkthrough: [
          "costs=[[10,20],[30,200],[400,50],[30,20]]: deltas a−b = [−10,−170,350,10].",
          "Sort ascending by delta: [30,200](−170), [10,20](−10), [30,20](10), [400,50](350).",
          "n=2 → first two to A: 30 + 10 = 40; last two to B: 20 + 50 = 70 → total 110.",
        ],
      },
      {
        name: "DP over (person, count sent to A)",
        intuition: "dp[i][a] = min cost assigning first i people with a of them in city A. Correct but heavier.",
        time: "O(n²)",
        timeWhy: "2n people times up to n possible A-counts.",
        space: "O(n)",
        spaceWhy: "A rolling 1-D DP over the A-count.",
        code: `// dp[a] = min cost so far with 'a' people sent to A.
// For each person, choose A (cost a) or B (cost b), respecting the count.
// The greedy sort above proves this DP is unnecessary here.`,
      },
    ],
    edgeCases: [
      "All people cheaper in the same city → the relative sort still forces the n/n split correctly.",
      "Ties in (aCost − bCost) → either ordering is optimal; the split count is what matters.",
      "n == 1 (two people) → one to each city by the cheaper relative assignment.",
    ],
    twists: [
      "**Minimum cost to connect / assign** problems generally → 'pick the cheapest relative option under a cardinality constraint' is a recurring greedy.",
      "**Campus bikes** (LeetCode 1057) → greedy by smallest distance pairing.",
      "**Task assignment with quotas** → same baseline-plus-cheapest-moves reasoning.",
    ],
    related: ["number-of-longest-increasing-subsequence"],
  },
];
