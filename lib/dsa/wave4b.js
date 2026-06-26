// NeetCode 150 — wave 4b (greedy, intervals). Java.

export const WAVE4B = [
  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 53,
    statement:
      "Given an integer array `nums`, find the **contiguous subarray** with the largest sum and return that sum. The subarray must contain at least one element.",
    examples: [
      { in: "nums = [-2,1,-3,4,-1,2,1,-5,4]", out: "6", note: "subarray [4,-1,2,1]" },
      { in: "nums = [1]", out: "1" },
      { in: "nums = [5,4,-1,7,8]", out: "23", note: "the whole array" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−10⁴ ≤ nums[i] ≤ 10⁴"],
    recognize:
      "'Largest sum of a **contiguous** subarray' with a single linear pass is **Kadane's algorithm** — a greedy: at each element decide whether to extend the running subarray or start fresh.",
    figureItOut: [
      "Brute force: try every start i and every end j, sum the slice. O(n²) (or O(n³) if you re-sum each time). Correct — now find the waste.",
      "Walk left to right and ask one local question at each index: *should the best subarray ending **here** keep the part before me, or start over at me?* That's the whole decision.",
      "The greedy insight: a **negative** running prefix can only hurt whatever comes after it. If the sum of everything before `nums[i]` is negative, dropping it and starting fresh at `nums[i]` is never worse. So `cur = max(nums[i], cur + nums[i])`.",
      "Why is this local choice globally optimal? Every subarray has some end index. By computing the best subarray *ending at each index* (and never carrying a harmful negative prefix), the overall answer is just the **max over all those ends** — and we track that in one running maximum.",
      "Keep `cur` (best ending here) and `best` (best seen anywhere). One pass, O(1) memory.",
    ],
    approaches: [
      {
        name: "Brute force — every subarray",
        intuition: "Try all start/end pairs and sum each.",
        time: "O(n²)",
        timeWhy: "n choices for the start times up to n for the end, summing incrementally.",
        space: "O(1)",
        spaceWhy: "Just a running max and a running sum.",
        code: `int maxSubArray(int[] nums) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            best = Math.max(best, sum);
        }
    }
    return best;
}`,
      },
      {
        name: "Kadane's algorithm (optimal)",
        intuition: "Track the best subarray ending at the current index; drop any negative prefix by restarting.",
        time: "O(n)",
        timeWhy: "Single pass; each element triggers one max and one add.",
        space: "O(1)",
        spaceWhy: "Two scalars — the running sum and the best.",
        code: `int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);  // extend, or start fresh at i
        best = Math.max(best, cur);
    }
    return best;
}`,
        walkthrough: [
          "[-2,1,-3,4,-1,2,1,-5,4]: cur=-2,best=-2; at 1 cur=max(1,-1)=1,best=1; at -3 cur=-2,best=1; at 4 cur=max(4,2)=4,best=4.",
          "at -1 cur=3; at 2 cur=5,best=5; at 1 cur=6,best=6; at -5 cur=1; at 4 cur=5,best stays 6 → 6.",
        ],
      },
    ],
    edgeCases: [
      "All negatives (e.g. [-3,-1,-2]) → answer is the single largest element (−1); seeding `best` with `nums[0]` (not 0) handles this.",
      "Single element → return it directly.",
      "Starting `best` at 0 is the classic bug — it wrongly returns 0 when every number is negative.",
    ],
    twists: [
      "**Return the indices** of the subarray → record where `cur` restarts and where `best` updates.",
      "**Maximum product subarray** (LeetCode 152) → track both max and min running products (a negative can flip them).",
      "**Circular maximum subarray** (LeetCode 918) → answer is max(normal Kadane, total − minSubarray).",
      "**Maximum sum of size ≥ k** → combine a sliding window with the running prefix idea.",
    ],
    related: ["best-time-to-buy-sell-stock", "jump-game"],
  },

  {
    slug: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 55,
    statement:
      "Given an array `nums` where `nums[i]` is the **maximum jump length** from index i, return `true` if you can reach the last index starting from index 0.",
    examples: [
      { in: "nums = [2,3,1,1,4]", out: "true", note: "0→1→4, or 0→2→3→4" },
      { in: "nums = [3,2,1,0,4]", out: "false", note: "always land on index 3, stuck" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 10⁵"],
    recognize:
      "'**Can you reach** the end given jump ranges' is a reachability greedy: track the **farthest** index reachable so far and check you never fall short.",
    figureItOut: [
      "Brute force is a DFS/DP: from each index try every jump length and recurse — exponential, or O(n²) memoized. Correct, but a single number captures everything we need.",
      "Reframe it: as you walk left to right, what's the **farthest index you could possibly have reached** by now? Call it `farthest`.",
      "The greedy: at index i, if `i > farthest`, then *no* sequence of jumps could have landed you on i — there's a gap you can't cross, so return false. Otherwise update `farthest = max(farthest, i + nums[i])`.",
      "Why is tracking only the maximum reach correct? Because if you can reach index i, you can reach **every** index up to `farthest` (jumps let you stop short). So the reachable set is always a prefix [0..farthest] — one number fully describes it.",
      "If `farthest` ever reaches the last index, you're done — true.",
    ],
    approaches: [
      {
        name: "Top-down DP / DFS with memo",
        intuition: "From each index, can any reachable next index reach the end? Cache results.",
        time: "O(n²)",
        timeWhy: "n indices, each trying up to n jump lengths.",
        space: "O(n)",
        spaceWhy: "Memo array plus recursion stack.",
        code: `boolean canJump(int[] nums) {
    Boolean[] memo = new Boolean[nums.length];
    return dfs(nums, 0, memo);
}
boolean dfs(int[] nums, int i, Boolean[] memo) {
    if (i >= nums.length - 1) return true;
    if (memo[i] != null) return memo[i];
    int reach = Math.min(nums.length - 1, i + nums[i]);
    for (int next = i + 1; next <= reach; next++) {
        if (dfs(nums, next, memo)) return memo[i] = true;
    }
    return memo[i] = false;
}`,
      },
      {
        name: "Greedy farthest-reach (optimal)",
        intuition: "Sweep left to right keeping the farthest reachable index; fail the moment an index is past it.",
        time: "O(n)",
        timeWhy: "Single pass; one max per element.",
        space: "O(1)",
        spaceWhy: "One integer.",
        code: `boolean canJump(int[] nums) {
    int farthest = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > farthest) return false;           // gap we can't cross
        farthest = Math.max(farthest, i + nums[i]);
        if (farthest >= nums.length - 1) return true;
    }
    return true;
}`,
        walkthrough: [
          "[3,2,1,0,4]: i=0 farthest=3; i=1 farthest=max(3,3)=3; i=2 farthest=max(3,3)=3; i=3 farthest=max(3,3)=3.",
          "i=4 needs farthest≥4, but i=4>farthest=3 → return false.",
        ],
      },
    ],
    edgeCases: [
      "Single element → already at the end → true.",
      "A 0 that isn't the last index isn't automatically fatal — only fatal if nothing earlier can jump over it.",
      "Leading zeros at index 0 with length>1 → `farthest` stays 0, next index fails → false.",
    ],
    twists: [
      "**Minimum number of jumps** (LeetCode 45) → the next problem; track the current jump's boundary.",
      "**Jump backward as well** → becomes BFS/DFS reachability, not a simple forward greedy.",
      "**Return whether you can reach a specific target index** → stop the sweep at that index.",
    ],
    related: ["jump-game-ii", "maximum-subarray"],
  },

  {
    slug: "jump-game-ii",
    title: "Jump Game II",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 45,
    statement:
      "Given an array `nums` where `nums[i]` is the maximum jump length from i (and it's guaranteed you can reach the last index), return the **minimum number of jumps** to reach the last index.",
    examples: [
      { in: "nums = [2,3,1,1,4]", out: "2", note: "0→1 (jump 1), 1→4 (jump 2)" },
      { in: "nums = [2,3,0,1,4]", out: "2" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "0 ≤ nums[i] ≤ 1000", "the last index is always reachable"],
    recognize:
      "'**Minimum** jumps to the end' is a greedy BFS over ranges: treat all indices reachable with `j` jumps as one 'level', and jump only when you must.",
    figureItOut: [
      "Think of it as BFS by levels. Level 0 is index 0. Level 1 is everything reachable in one jump. Level 2 is everything reachable from level 1, and so on. The answer is the level number that first contains the last index.",
      "You don't need a real queue. As you sweep, keep the **current level's boundary** (`curEnd`) — the farthest index reachable with the jumps you've already counted.",
      "While scanning indices within the current level, track `farthest` = the farthest you could reach by jumping from *any* index in this level.",
      "The greedy: when you **hit** `curEnd` (you've used up the current level), you're forced to take one more jump — increment the count and extend the boundary to `farthest`. Delaying the jump until the boundary is reached guarantees you've considered the best possible landing for that jump.",
      "Why optimal? Each level covers a maximal contiguous prefix of indices for that jump count. Since each level is as wide as possible, you never use more jumps than necessary.",
    ],
    approaches: [
      {
        name: "BFS by levels (explicit)",
        intuition: "Expand reachable indices level by level until the last index appears.",
        time: "O(n)",
        timeWhy: "Each index is processed once across the levels.",
        space: "O(n)",
        spaceWhy: "A visited-boundary marker; conceptually a queue of frontier indices.",
        code: `int jump(int[] nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == curEnd) {       // end of the current level/jump
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`,
      },
      {
        name: "Greedy range expansion (optimal)",
        intuition: "Count a jump only when forced — when you reach the boundary of the indices the last jump made reachable.",
        time: "O(n)",
        timeWhy: "One pass, constant work per index.",
        space: "O(1)",
        spaceWhy: "Three integers.",
        code: `int jump(int[] nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
            if (curEnd >= nums.length - 1) break;
        }
    }
    return jumps;
}`,
        walkthrough: [
          "[2,3,1,1,4]: i=0 farthest=2, i==curEnd(0) → jumps=1, curEnd=2.",
          "i=1 farthest=max(2,4)=4; i=2 farthest=max(4,3)=4, i==curEnd(2) → jumps=2, curEnd=4≥last → 2.",
        ],
      },
    ],
    edgeCases: [
      "Single element → already there → 0 jumps; the loop runs to `length-1`, so it never executes → returns 0.",
      "Loop stops at `length-1`, not `length` — landing exactly on the last index shouldn't trigger an extra jump.",
      "Large jump values that overshoot the end are fine; `curEnd` just clamps the answer when it passes the last index.",
    ],
    twists: [
      "**Reachability only** (LeetCode 55) → the previous problem; just need farthest, no jump count.",
      "**Minimum jumps with a cost per index** → falls back to Dijkstra / DP, the greedy breaks.",
      "**Reconstruct the actual jump path** → remember which index gave each `farthest`.",
    ],
    related: ["jump-game", "maximum-subarray"],
  },

  {
    slug: "gas-station",
    title: "Gas Station",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 134,
    statement:
      "There are `n` gas stations in a circle. `gas[i]` is the fuel at station i, and `cost[i]` is the fuel needed to travel from i to i+1. Starting with an empty tank, return the **starting station index** that lets you complete the full circuit once, or `-1` if impossible. The answer is guaranteed unique if it exists.",
    examples: [
      { in: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", out: "3", note: "start at station 3" },
      { in: "gas = [2,3,4], cost = [3,4,3]", out: "-1" },
    ],
    constraints: ["n == gas.length == cost.length", "1 ≤ n ≤ 10⁵", "0 ≤ gas[i], cost[i] ≤ 10⁴"],
    recognize:
      "A circular feasibility problem where the total surplus decides solvability and a single forward sweep finds the start — a classic greedy with two key facts to prove.",
    figureItOut: [
      "Brute force: try each station as the start and simulate the whole loop. O(n²). Correct — but two observations collapse it to one pass.",
      "**Fact 1 (solvability):** if `sum(gas) < sum(cost)`, no start can finish — you simply don't have enough fuel overall. If `sum(gas) ≥ sum(cost)`, a valid start is guaranteed to exist.",
      "**Fact 2 (which start):** sweep from 0 keeping a running tank `total`. If `total` ever goes negative at station i, then **no station from the current candidate start through i can be the answer** — every one of them ran dry at or before i. So the next possible start is `i + 1`, and you reset the tank to 0.",
      "Why can you skip all those starts? If starting at `s` you go negative first at i, then any start between s and i had even less accumulated fuel reaching i (it started later, missing earlier surplus), so it fails too. That's what makes jumping to `i+1` safe and greedy-optimal.",
      "Track a separate `tank` (resets) and `total` (never resets, for the solvability check). If `total ≥ 0` at the end, the last candidate start is the unique answer.",
    ],
    approaches: [
      {
        name: "Brute force — simulate each start",
        intuition: "Try every starting station, simulate the loop, return the first that survives.",
        time: "O(n²)",
        timeWhy: "n possible starts, each simulating up to n steps.",
        space: "O(1)",
        spaceWhy: "Just running counters.",
        code: `int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length;
    for (int start = 0; start < n; start++) {
        int tank = 0; boolean ok = true;
        for (int k = 0; k < n; k++) {
            int i = (start + k) % n;
            tank += gas[i] - cost[i];
            if (tank < 0) { ok = false; break; }
        }
        if (ok) return start;
    }
    return -1;
}`,
      },
      {
        name: "Single greedy pass (optimal)",
        intuition: "Total surplus decides feasibility; reset the candidate start whenever the running tank dips below zero.",
        time: "O(n)",
        timeWhy: "One pass over the stations.",
        space: "O(1)",
        spaceWhy: "Three integers.",
        code: `int canCompleteCircuit(int[] gas, int[] cost) {
    int total = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int diff = gas[i] - cost[i];
        total += diff;
        tank += diff;
        if (tank < 0) {        // can't reach i+1 from current start
            start = i + 1;     // next candidate
            tank = 0;
        }
    }
    return total >= 0 ? start : -1;
}`,
        walkthrough: [
          "gas=[1,2,3,4,5], cost=[3,4,5,1,2], diffs=[-2,-2,-2,3,3]. i0 tank=-2<0 → start=1,tank=0.",
          "i1 tank=-2<0 → start=2,tank=0; i2 tank=-2<0 → start=3,tank=0; i3 tank=3; i4 tank=6. total=0≥0 → start=3.",
        ],
      },
    ],
    edgeCases: [
      "`sum(gas) == sum(cost)` exactly → a unique start exists (total ≥ 0).",
      "Single station with `gas[0] ≥ cost[0]` → return 0; otherwise −1.",
      "If you reset `start` past the last index, the total check still correctly returns −1 when infeasible.",
    ],
    twists: [
      "**Return all valid starts** (when uniqueness isn't guaranteed) → after finding feasibility, the greedy start is the lone canonical one, but verifying others needs the surplus structure.",
      "**Minimum extra fuel to make it feasible** → it's `−min(running prefix surplus)`.",
      "**Bidirectional travel** → no longer a simple forward greedy.",
    ],
    related: ["jump-game", "maximum-subarray"],
  },

  {
    slug: "hand-of-straights",
    title: "Hand of Straights",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 846,
    statement:
      "Given an integer array `hand` and a group size `groupSize`, return `true` if the cards can be rearranged into groups of exactly `groupSize` **consecutive** cards each.",
    examples: [
      { in: "hand = [1,2,3,6,2,3,4,7,8], groupSize = 3", out: "true", note: "[1,2,3],[2,3,4],[6,7,8]" },
      { in: "hand = [1,2,3,4,5], groupSize = 4", out: "false", note: "5 cards can't split into groups of 4" },
    ],
    constraints: ["1 ≤ hand.length ≤ 10⁴", "0 ≤ hand[i] ≤ 10⁹", "1 ≤ groupSize ≤ hand.length"],
    recognize:
      "Partition into consecutive runs of fixed length → greedy: the **smallest remaining card** must start a run, which forces the rest of that run.",
    figureItOut: [
      "First, a cheap necessary check: if `hand.length % groupSize != 0`, the cards can't divide evenly → false immediately.",
      "Now the greedy seed: consider the **smallest** card still in hand. It can only be the **first** card of its group (nothing smaller exists to sit before it). So its group is forced to be `min, min+1, ..., min+groupSize-1`.",
      "If any of those consecutive cards is missing, it's impossible — that smallest card can never be placed → false.",
      "Why is committing to the smallest card always safe? Because it has no other option. Whatever solution exists must put the smallest card at the start of some run of consecutive cards; that run is uniquely determined. So we lose nothing by building it now.",
      "Use a frequency map (a TreeMap to always reach the current minimum, or a count map + sorted keys). Repeatedly take the minimum present, decrement the whole run by 1 each; if any count goes short, fail.",
    ],
    approaches: [
      {
        name: "Sorted counts, build from the minimum (optimal)",
        intuition: "Always start the next group at the smallest available card; that run is forced.",
        time: "O(n log n)",
        timeWhy: "Sorting / TreeMap ordering dominates; each card is consumed once.",
        space: "O(n)",
        spaceWhy: "The frequency map of distinct card values.",
        code: `boolean isNStraightHand(int[] hand, int groupSize) {
    if (hand.length % groupSize != 0) return false;
    TreeMap<Integer, Integer> count = new TreeMap<>();
    for (int c : hand) count.merge(c, 1, Integer::sum);
    while (!count.isEmpty()) {
        int start = count.firstKey();            // smallest remaining card
        for (int card = start; card < start + groupSize; card++) {
            Integer have = count.get(card);
            if (have == null) return false;      // missing card in the run
            if (have == 1) count.remove(card);
            else count.put(card, have - 1);
        }
    }
    return true;
}`,
        walkthrough: [
          "hand=[1,2,3,6,2,3,4,7,8], size 3. counts {1:1,2:2,3:2,4:1,6:1,7:1,8:1}. start=1 → consume 1,2,3.",
          "start=2 → consume 2,3,4. start=6 → consume 6,7,8. map empty → true.",
        ],
      },
    ],
    edgeCases: [
      "`hand.length` not divisible by `groupSize` → false (the fast guard).",
      "`groupSize == 1` → always true (every single card is its own valid group).",
      "Duplicate values are fine — the counts let one value start multiple groups across iterations.",
    ],
    twists: [
      "**Divide Array in Sets of K Consecutive Numbers** (LeetCode 1296) → identical problem, different name.",
      "**Allow runs of any length ≥ groupSize** → harder; greedy-from-minimum still helps but you must decide run lengths.",
      "**Cards must be consecutive but can wrap around** → breaks the simple min-seed argument.",
    ],
    related: ["partition-labels", "merge-intervals"],
  },

  {
    slug: "merge-triplets-to-form-target-triplet",
    title: "Merge Triplets to Form Target Triplet",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 1899,
    statement:
      "Given a list of `triplets` and a `target` triplet, you may repeatedly pick two triplets and replace one with their element-wise **maximum**. Return `true` if some sequence of such merges can produce exactly `target`.",
    examples: [
      { in: "triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]", out: "true", note: "merge [1,8,4]? no — use [2,5,3] and [1,7,5]" },
      { in: "triplets = [[3,4,5],[4,5,6]], target = [3,2,5]", out: "false", note: "no way to lower a value" },
    ],
    constraints: ["1 ≤ triplets.length ≤ 10⁵", "triplets[i].length == target.length == 3", "1 ≤ values ≤ 1000"],
    recognize:
      "Merging takes element-wise max, so values only **rise**. A greedy filter: a triplet is usable only if it never exceeds the target, and you must cover each target coordinate.",
    figureItOut: [
      "The merge takes the element-wise maximum, so any value you keep can only **grow or stay** — you can never reduce a coordinate. That single fact drives everything.",
      "**Disqualify the dangerous triplets:** if a triplet has *any* coordinate larger than the target's, merging it in would push that coordinate above the target forever. So ignore every triplet where `a > target[0]` or `b > target[1]` or `c > target[2]`.",
      "Among the **safe** triplets (all coords ≤ target), you want to know: can their element-wise max hit the target exactly? You need each target coordinate to be matched by *some* safe triplet that already equals it there.",
      "So track three booleans: does some safe triplet have `a == target[0]`? `b == target[1]`? `c == target[2]`? If all three are achieved (possibly by different triplets), merging those safe triplets gives exactly the target.",
      "Why greedy / why is checking each coordinate independently enough? Because merges combine coordinates independently (max is per-position), and safe triplets never overshoot — so collecting one exact match per coordinate, then max-merging them all, lands precisely on target.",
    ],
    approaches: [
      {
        name: "Greedy coordinate-coverage filter (optimal)",
        intuition: "Keep only triplets that never exceed the target; check each target coordinate is hit exactly by some kept triplet.",
        time: "O(n)",
        timeWhy: "One pass over the triplets, constant work each.",
        space: "O(1)",
        spaceWhy: "Three booleans.",
        code: `boolean mergeTriplets(int[][] triplets, int[] target) {
    boolean a = false, b = false, c = false;
    for (int[] t : triplets) {
        if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue; // unsafe
        if (t[0] == target[0]) a = true;
        if (t[1] == target[1]) b = true;
        if (t[2] == target[2]) c = true;
    }
    return a && b && c;
}`,
        walkthrough: [
          "target=[2,7,5]. [2,5,3] safe → a=true (matches 2). [1,8,4] has 8>7 → skip.",
          "[1,7,5] safe → b=true (7), c=true (5). a&&b&&c → true.",
        ],
      },
    ],
    edgeCases: [
      "A single triplet equal to the target → true (no merge even needed).",
      "A triplet matching a coordinate but with another coordinate over target is unsafe and contributes nothing.",
      "If no safe triplet hits a given coordinate exactly → that coordinate can never reach target → false.",
    ],
    twists: [
      "**Tuples of length k** instead of 3 → same idea with k booleans / a k-length 'achieved' array.",
      "**Minimize the number of merges** → harder; you'd need to pick a small covering set of safe triplets.",
      "**Merge uses min instead of max** → flip the logic: keep triplets never *below* target, match exact coordinates.",
    ],
    related: ["partition-labels", "maximum-subarray"],
  },

  {
    slug: "partition-labels",
    title: "Partition Labels",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 763,
    statement:
      "Given a string `s`, partition it into as **many parts as possible** so that each letter appears in **at most one part**. Return a list of the part sizes.",
    examples: [
      { in: 's = "ababcbacadefegdehijhklij"', out: "[9,7,8]", note: '"ababcbaca","defegde","hijhklij"' },
      { in: 's = "eccbbbbdec"', out: "[10]", note: "one big part" },
    ],
    constraints: ["1 ≤ s.length ≤ 500", "lowercase English letters"],
    recognize:
      "'Each letter in one part' + 'as many parts as possible' → greedy: precompute each letter's **last index**, then close a part the moment you reach the furthest last-index seen so far.",
    figureItOut: [
      "For a part to be valid, every letter inside it must have **all** its occurrences inside it — i.e. the part must extend at least to the last position of every letter it contains.",
      "So first, record the **last index** of each of the 26 letters in one pass.",
      "Now sweep with a window. As you include `s[i]`, the part must stretch at least to `last[s[i]]`. Keep the running maximum `end` of these last-indices for the letters seen since the part started.",
      "The greedy cut: when the sweep index `i` **equals** `end`, every letter in the current part is fully contained — you can't extend any letter's reach further, so close the part **right here**. Closing as early as possible (the first time `i == end`) maximizes the number of parts.",
      "Why is the earliest valid cut optimal? Any later cut would merge two independent parts into one, reducing the count. Cutting at the first moment the part is self-contained is greedily best.",
    ],
    approaches: [
      {
        name: "Last-index sweep (optimal)",
        intuition: "Precompute each letter's last position; extend the part to cover them and cut when the index meets the running end.",
        time: "O(n)",
        timeWhy: "One pass to record last indices, one pass to partition.",
        space: "O(1)",
        spaceWhy: "A fixed 26-element array of last indices.",
        code: `List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
    List<Integer> res = new ArrayList<>();
    int start = 0, end = 0;
    for (int i = 0; i < s.length(); i++) {
        end = Math.max(end, last[s.charAt(i) - 'a']);  // furthest reach so far
        if (i == end) {                                // part is self-contained
            res.add(i - start + 1);
            start = i + 1;
        }
    }
    return res;
}`,
        walkthrough: [
          '"ababcbacadefegde...": last[a]=8,last[b]=5,last[c]=7. Sweep: end grows to 8 across a,b,c.',
          "At i=8 (i==end) → part size 9 ([0..8]). Reset start=9 and continue for the next parts.",
        ],
      },
    ],
    edgeCases: [
      "All distinct letters → each character is its own part (every part size 1).",
      "All the same letter → one part spanning the whole string.",
      "A letter whose first and last occurrence are far apart forces a long part regardless of what's between.",
    ],
    twists: [
      "**Return the actual substrings** → slice `s.substring(start, i+1)` instead of the size.",
      "**Minimum parts** (instead of maximum) → trivially 1 (the whole string); the interesting version is the maximum.",
      "**Partition so each part has ≤ K distinct letters** → switch to a sliding-window count, not the last-index trick.",
    ],
    related: ["merge-intervals", "hand-of-straights"],
  },

  {
    slug: "valid-parenthesis-string",
    title: "Valid Parenthesis String",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 678,
    statement:
      "Given a string `s` containing `(`, `)` and `*`, return `true` if it can be a **valid** parenthesis string. A `*` may be treated as `(`, as `)`, or as an empty string.",
    examples: [
      { in: 's = "(*)"', out: "true", note: "* = empty, gives ()" },
      { in: 's = "(*))"', out: "true", note: "* = ( gives (()) " },
      { in: 's = "((*)"', out: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s consists of `(`, `)`, `*`"],
    recognize:
      "Wildcards make a single counter ambiguous, so track a **range** of possible open-paren counts — a greedy that carries `[low, high]` instead of one value.",
    figureItOut: [
      "Without `*`, you'd keep one counter: +1 for `(`, −1 for `)`, fail if it goes negative, and require it to end at 0. The `*` breaks that because it could be any of three things.",
      "Instead of committing, track the **range** of possible open counts: `low` (treat every `*` as `)` or empty — the fewest opens still pending) and `high` (treat every `*` as `(` — the most opens possible).",
      "On `(`: both `low` and `high` go up. On `)`: both go down. On `*`: `low` goes down (it might close), `high` goes up (it might open) — the uncertainty widens the band.",
      "The greedy guards: if `high < 0`, you've seen more `)` than any interpretation can match → fail immediately. And clamp `low` at 0 — a negative `low` would mean over-closing, but a `*` could have been empty instead, so the true minimum pending opens is never below 0.",
      "Why does tracking just the endpoints work? Every count between `low` and `high` is achievable (each step changes by ±1, so the reachable set stays a contiguous interval). At the end, validity is possible iff `0` is in that range — i.e. `low == 0`.",
    ],
    approaches: [
      {
        name: "Greedy low/high open-count range (optimal)",
        intuition: "Carry the min and max possible number of unmatched '(' as you scan; succeed if 0 is reachable at the end.",
        time: "O(n)",
        timeWhy: "Single pass, constant work per character.",
        space: "O(1)",
        spaceWhy: "Two integers.",
        code: `boolean checkValidString(String s) {
    int low = 0, high = 0;          // range of possible open-paren counts
    for (char c : s.toCharArray()) {
        if (c == '(') { low++; high++; }
        else if (c == ')') { low--; high--; }
        else { low--; high++; }     // '*' could close, do nothing, or open
        if (high < 0) return false; // too many ')' under every interpretation
        if (low < 0) low = 0;       // '*' as empty keeps minimum opens at 0
    }
    return low == 0;
}`,
        walkthrough: [
          '"(*))": ( → low1,high1; * → low0,high2; ) → low-1→clamp0,high1; ) → low-1→clamp0,high0.',
          "high never went negative; low==0 at the end → true.",
        ],
      },
    ],
    edgeCases: [
      "All stars (e.g. \"***\") → every `*` can be empty → true.",
      "More `)` than possible opens at any prefix → `high < 0` → false (e.g. \")\").",
      "Clamping `low` at 0 is essential — without it, an early `*`-as-`)` would wrongly poison the count.",
    ],
    twists: [
      "**No `*`** → collapses to the plain Valid Parentheses counter.",
      "**Stack-based two-stack solution** → push indices of `(` and `*` separately, match at the end — same answer, different lens.",
      "**Wildcards that can be any bracket type** (`()[]{}`) → the range trick breaks; you need a richer state.",
    ],
    related: ["valid-parentheses", "maximum-subarray"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "insert-interval",
    title: "Insert Interval",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 57,
    statement:
      "Given a list of **non-overlapping, sorted** intervals and a `newInterval`, insert it and merge any overlaps. Return the resulting sorted, non-overlapping list.",
    examples: [
      { in: "intervals = [[1,3],[6,9]], newInterval = [2,5]", out: "[[1,5],[6,9]]" },
      { in: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", out: "[[1,2],[3,10],[12,16]]" },
    ],
    constraints: ["0 ≤ intervals.length ≤ 10⁴", "intervals is sorted by start and non-overlapping"],
    recognize:
      "The input is **already sorted and merged**, so you don't sort — just sweep once in three phases: before, overlapping (merge), and after the new interval.",
    figureItOut: [
      "The list is already sorted and non-overlapping, so the new interval slots into exactly one contiguous stretch. That lets you walk once and split the work into three clean phases.",
      "**Phase 1 — before:** copy every interval that ends *before* `newInterval` starts (`interval[1] < newInterval[0]`). These can't overlap, so they pass through untouched.",
      "**Phase 2 — overlap & merge:** while an interval starts *at or before* `newInterval` ends (`interval[0] <= newInterval[1]`), it overlaps. Absorb it by widening the new interval: `start = min(...)`, `end = max(...)`. After the loop, push the merged new interval once.",
      "**Phase 3 — after:** copy the rest unchanged — they all start after the merged interval ends.",
      "Why no sorting? Sorting is the expensive part of most interval problems, but here the precondition hands it to you. Recognizing that drops it from O(n log n) to O(n).",
    ],
    approaches: [
      {
        name: "Three-phase linear sweep (optimal)",
        intuition: "Pass through the before-intervals, merge all overlappers into the new one, then pass through the after-intervals.",
        time: "O(n)",
        timeWhy: "Single pass; each interval is examined once.",
        space: "O(n)",
        spaceWhy: "The output list (no extra working structure).",
        code: `int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> res = new ArrayList<>();
    int i = 0, n = intervals.length;
    // Phase 1: intervals strictly before newInterval
    while (i < n && intervals[i][1] < newInterval[0]) res.add(intervals[i++]);
    // Phase 2: merge all overlapping intervals into newInterval
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.add(newInterval);
    // Phase 3: the rest
    while (i < n) res.add(intervals[i++]);
    return res.toArray(new int[res.size()][]);
}`,
        walkthrough: [
          "intervals=[[1,2],[3,5],[6,7],[8,10],[12,16]], new=[4,8]. Phase1: [1,2] ends 2<4 → keep.",
          "Phase2: [3,5],[6,7],[8,10] overlap → merge into [3,10]. Phase3: [12,16] → result [[1,2],[3,10],[12,16]].",
        ],
      },
    ],
    edgeCases: [
      "Empty input list → result is just `[newInterval]`.",
      "New interval entirely before everything → it goes first; entirely after → it goes last.",
      "New interval that swallows all existing ones → phase 2 merges them all into one.",
    ],
    twists: [
      "**Multiple inserts** → easier to concatenate, sort once, and run Merge Intervals.",
      "**Intervals not pre-sorted** → you must sort first → O(n log n) (that's the Merge Intervals problem).",
      "**Return the count of merged intervals removed** → tally during phase 2.",
    ],
    related: ["merge-intervals", "non-overlapping-intervals"],
  },

  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 56,
    statement:
      "Given an array of `intervals` where `intervals[i] = [start, end]`, **merge all overlapping** intervals and return the non-overlapping intervals that cover all the input ranges.",
    examples: [
      { in: "intervals = [[1,3],[2,6],[8,10],[15,18]]", out: "[[1,6],[8,10],[15,18]]", note: "[1,3]&[2,6] overlap" },
      { in: "intervals = [[1,4],[4,5]]", out: "[[1,5]]", note: "touching counts as overlap" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "intervals[i] = [startᵢ, endᵢ]", "0 ≤ startᵢ ≤ endᵢ ≤ 10⁴"],
    recognize:
      "The archetypal interval problem: **sort by start**, then sweep once, extending the current interval whenever the next one overlaps. Almost every interval problem starts here.",
    figureItOut: [
      "Two intervals overlap if one starts before the other ends. Checking all pairs is O(n²) and the merging order gets tangled. The fix is to impose an order first.",
      "**Sort by start.** Now any interval that overlaps the current one must come *next* in the sorted order — overlaps are always with the immediately preceding merged interval, never something far away.",
      "Sweep keeping the **last merged interval** `cur`. For each next interval: if `next.start <= cur.end`, they overlap (or touch) → extend `cur.end = max(cur.end, next.end)`. Otherwise there's a gap → push `cur` and start a new one at `next`.",
      "Why does sorting make the local check sufficient? Because after sorting, if the next interval doesn't overlap the current merged block, it can't overlap any earlier one either (they all ended even sooner). So comparing only against the running block is correct.",
      "Use `<=` not `<` if touching endpoints (like [1,4] and [4,5]) should merge — read the problem's definition of overlap.",
    ],
    approaches: [
      {
        name: "Sort then sweep (optimal)",
        intuition: "Sort by start; walk once, extending the current block on overlap and emitting it on a gap.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the merge sweep itself is O(n).",
        space: "O(n)",
        spaceWhy: "The output list (sorting may also use O(n)/O(log n)).",
        code: `int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    List<int[]> res = new ArrayList<>();
    int[] cur = intervals[0];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= cur[1]) {                 // overlap or touch
            cur[1] = Math.max(cur[1], intervals[i][1]);  // extend
        } else {
            res.add(cur);
            cur = intervals[i];
        }
    }
    res.add(cur);
    return res.toArray(new int[res.size()][]);
}`,
        walkthrough: [
          "sorted=[[1,3],[2,6],[8,10],[15,18]]. cur=[1,3]; [2,6] start 2≤3 → extend cur=[1,6].",
          "[8,10] start 8>6 → push [1,6], cur=[8,10]; [15,18] start 15>10 → push, cur=[15,18]; flush → [[1,6],[8,10],[15,18]].",
        ],
      },
    ],
    edgeCases: [
      "Single interval → returned as-is.",
      "Fully nested interval (e.g. [1,10] then [2,3]) → `max` on the end keeps the outer 10, not 3.",
      "Touching intervals ([1,4],[4,5]) merge under `<=`; with strict `<` they'd stay separate.",
    ],
    twists: [
      "**Insert into an already-merged list** → skip the sort, do a three-phase sweep (Insert Interval).",
      "**Total length covered** → sum `(end − start)` over the merged result.",
      "**Count overlaps / max concurrency** → switch to a sweep-line of start/end events (Meeting Rooms II).",
    ],
    related: ["insert-interval", "non-overlapping-intervals"],
  },

  {
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 435,
    statement:
      "Given intervals, return the **minimum number you must remove** so that the rest are non-overlapping.",
    examples: [
      { in: "intervals = [[1,2],[2,3],[3,4],[1,3]]", out: "1", note: "remove [1,3]" },
      { in: "intervals = [[1,2],[1,2],[1,2]]", out: "2", note: "keep one, remove two" },
      { in: "intervals = [[1,2],[2,3]]", out: "0", note: "touching, no overlap" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁵", "intervals[i] = [startᵢ, endᵢ]"],
    recognize:
      "'Minimum removals to make non-overlapping' = the classic **activity-selection** greedy in disguise: **sort by end**, keep as many as possible, remove the rest.",
    figureItOut: [
      "Removing the fewest is the same as **keeping the most** non-overlapping intervals. So the problem flips to: what's the largest set of mutually non-overlapping intervals? Answer = total − kept.",
      "This is activity selection. The greedy rule: **sort by end time**, then always keep the interval that **ends earliest** among those that don't conflict — because finishing earliest leaves the most room for whatever comes next.",
      "Sweep keeping `prevEnd`. For each interval (in end-sorted order): if its start is `>= prevEnd`, it doesn't overlap the last kept one → keep it, update `prevEnd`. Otherwise it overlaps → it must be removed (count it).",
      "Why keep the earliest-ending one on a conflict? Among two overlapping intervals, the one ending later can only block more future intervals. Dropping it (keeping the earlier-ending one) is never worse — that's the exchange argument that proves the greedy optimal.",
      "Use `>=` so touching intervals ([1,2],[2,3]) are treated as non-overlapping.",
    ],
    approaches: [
      {
        name: "Sort by end, greedy keep (optimal)",
        intuition: "Sort by end; keep each interval that starts at/after the last kept end, remove the rest.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the sweep is O(n).",
        space: "O(1)",
        spaceWhy: "Ignoring the sort, just a counter and the last end.",
        code: `int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));  // by end
    int removed = 0, prevEnd = Integer.MIN_VALUE;
    for (int[] it : intervals) {
        if (it[0] >= prevEnd) {     // no overlap — keep it
            prevEnd = it[1];
        } else {
            removed++;              // overlaps the kept one — remove it
        }
    }
    return removed;
}`,
        walkthrough: [
          "sorted by end: [[1,2],[1,3],[2,3],[3,4]]. prevEnd=-∞ → keep [1,2], prevEnd=2.",
          "[1,3] start 1<2 → remove (removed=1). [2,3] start 2≥2 → keep, prevEnd=3. [3,4] start 3≥3 → keep → removed=1.",
        ],
      },
    ],
    edgeCases: [
      "Already non-overlapping → 0 removals.",
      "All identical intervals → remove all but one.",
      "Sorting by **start** instead of end breaks the greedy on nested intervals — sort by end.",
    ],
    twists: [
      "**Maximum number of intervals you can keep** → just `n − removed`.",
      "**Weighted intervals (maximize kept value)** → greedy fails; needs DP + binary search (weighted interval scheduling).",
      "**Minimum arrows to burst balloons** (LeetCode 452) → the mirror image: count the kept groups instead of removals.",
    ],
    related: ["merge-intervals", "insert-interval"],
  },

  {
    slug: "meeting-rooms",
    title: "Meeting Rooms",
    difficulty: "Easy",
    pattern: "intervals",
    leetcode: 252,
    statement:
      "Given an array of meeting time `intervals` `[start, end]`, return `true` if a person could attend **all** meetings (no two overlap).",
    examples: [
      { in: "intervals = [[0,30],[5,10],[15,20]]", out: "false", note: "[0,30] overlaps the others" },
      { in: "intervals = [[7,10],[2,4]]", out: "true" },
    ],
    constraints: ["0 ≤ intervals.length ≤ 10⁴", "intervals[i] = [startᵢ, endᵢ]", "startᵢ < endᵢ"],
    recognize:
      "'Can one person attend all?' = 'are there **any** overlaps?'. Sort by start; if any meeting starts before the previous ends, they collide.",
    figureItOut: [
      "Attending all meetings is possible iff **no two overlap**. So the whole question reduces to: does any overlap exist?",
      "Checking all pairs is O(n²). Sorting fixes the order: **sort by start time**, and then overlaps can only happen between *adjacent* meetings in that order.",
      "Sweep once: for each meeting after the first, if its start is **before** the previous meeting's end (`cur.start < prev.end`), there's a clash → return false.",
      "Why only adjacent comparisons? After sorting by start, if meeting i+1 doesn't overlap meeting i, it starts at or after i's end — and since later meetings start even later, no earlier meeting can reach it either. So adjacent checks cover everything.",
      "Make it through the sweep with no clash → true.",
    ],
    approaches: [
      {
        name: "Sort by start, check neighbours (optimal)",
        intuition: "After sorting, any overlap is between consecutive meetings.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the adjacency check is O(n).",
        space: "O(1)",
        spaceWhy: "Ignoring the sort, only the previous end is tracked.",
        code: `boolean canAttendMeetings(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i - 1][1]) return false;  // overlap
    }
    return true;
}`,
        walkthrough: [
          "sorted=[[0,30],[5,10],[15,20]]. i=1: start 5 < prev end 30 → overlap → false.",
          "(For [[2,4],[7,10]]: start 7 ≥ prev end 4 → no overlap → true.)",
        ],
      },
    ],
    edgeCases: [
      "Empty or single meeting → no overlap possible → true.",
      "Back-to-back meetings ([1,5],[5,8]) → `<` treats touching as fine → true.",
      "Sorting is required — unsorted, an early-but-long meeting can be missed by neighbour checks.",
    ],
    twists: [
      "**Minimum rooms needed** (LeetCode 253) → the next problem; count maximum concurrent meetings.",
      "**Maximum meetings attendable** → activity selection (sort by end, greedy).",
      "**Return the conflicting pair** → record the indices when the overlap is found.",
    ],
    related: ["meeting-rooms-ii", "merge-intervals"],
  },

  {
    slug: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 253,
    statement:
      "Given meeting time `intervals` `[start, end]`, return the **minimum number of conference rooms** required to hold all meetings.",
    examples: [
      { in: "intervals = [[0,30],[5,10],[15,20]]", out: "2", note: "[0,30] runs alongside the others" },
      { in: "intervals = [[7,10],[2,4]]", out: "1" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "0 ≤ startᵢ < endᵢ ≤ 10⁶"],
    recognize:
      "'Minimum rooms' = the **maximum number of meetings happening at the same time**. Either a min-heap of end times, or a sweep-line of separated start/end events.",
    figureItOut: [
      "Each room holds one meeting at a time, so the number of rooms you ever need at once equals the **maximum overlap** — the most meetings simultaneously in progress. The answer is that peak.",
      "**Heap idea:** sort meetings by start. Keep a **min-heap of end times** of meetings currently using a room. For each new meeting, if the earliest-ending ongoing meeting has already finished (`heap.peek() <= start`), reuse that room (pop). Then push the new meeting's end. The heap size is the rooms in use; the answer is its maximum size.",
      "Why the *earliest* ending? Because that's the first room to free up — checking the soonest-to-finish meeting tells you whether *any* room is available, which is exactly the greedy reuse decision.",
      "**Sweep-line alternative:** split every meeting into a `+1` event at its start and a `−1` event at its end, sort all events by time (ties: process ends before starts so touching meetings share a room), then sweep accumulating a running count. The max running count is the answer.",
      "Both compute the same peak concurrency; the heap mirrors 'rooms in use', the sweep-line counts overlaps directly.",
    ],
    approaches: [
      {
        name: "Min-heap of end times (optimal)",
        intuition: "Process meetings by start; reuse a room whose meeting already ended, else open a new one. Peak heap size = rooms.",
        time: "O(n log n)",
        timeWhy: "Sorting plus n heap operations, each O(log n).",
        space: "O(n)",
        spaceWhy: "The heap can hold all meetings if they all overlap.",
        code: `int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by start
    PriorityQueue<Integer> ends = new PriorityQueue<>();             // min-heap of end times
    int rooms = 0;
    for (int[] m : intervals) {
        if (!ends.isEmpty() && ends.peek() <= m[0]) ends.poll();     // a room freed up
        ends.add(m[1]);
        rooms = Math.max(rooms, ends.size());
    }
    return rooms;
}`,
        walkthrough: [
          "sorted=[[0,30],[5,10],[15,20]]. [0,30]: heap{30}, rooms=1. [5,10]: peek 30>5 → no reuse, heap{10,30}, rooms=2.",
          "[15,20]: peek 10≤15 → reuse (poll 10), heap{20,30}, rooms stays 2 → 2.",
        ],
      },
      {
        name: "Sweep-line of start/end events",
        intuition: "Sort all start (+1) and end (−1) events; the maximum running sum is the peak concurrency.",
        time: "O(n log n)",
        timeWhy: "Sorting the 2n events dominates; the sweep is O(n).",
        space: "O(n)",
        spaceWhy: "Separate sorted arrays of starts and ends.",
        code: `int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
    Arrays.sort(starts); Arrays.sort(ends);
    int rooms = 0, max = 0, s = 0, e = 0;
    while (s < n) {
        if (starts[s] < ends[e]) { rooms++; s++; max = Math.max(max, rooms); }
        else { rooms--; e++; }       // a meeting ended — free a room
    }
    return max;
}`,
      },
    ],
    edgeCases: [
      "Single meeting → 1 room.",
      "Back-to-back meetings ([1,5],[5,9]) → `<` / `<=` lets the room be reused → 1 room.",
      "All meetings overlapping → rooms equals the number of meetings.",
    ],
    twists: [
      "**Just need 'can one person attend all?'** (LeetCode 252) → the simpler problem: rooms ≤ 1.",
      "**Which meeting gets which room** → store room ids in the heap, not just end times.",
      "**Maximum CPUs / servers for tasks** → the same peak-concurrency pattern with different framing.",
    ],
    related: ["meeting-rooms", "minimum-interval-to-include-each-query"],
  },

  {
    slug: "minimum-interval-to-include-each-query",
    title: "Minimum Interval to Include Each Query",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 1851,
    statement:
      "Given `intervals` `[left, right]` and an array of `queries`, for each query `q` return the **size of the smallest interval** `[left, right]` such that `left <= q <= right` (size = `right − left + 1`), or `-1` if no interval contains it.",
    examples: [
      { in: "intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]", out: "[3,3,1,4]" },
      { in: "intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]", out: "[2,-1,4,5]" },
    ],
    constraints: ["1 ≤ intervals.length, queries.length ≤ 10⁵", "1 ≤ leftᵢ ≤ rightᵢ ≤ 10⁷"],
    recognize:
      "Many queries against many intervals, asking for the **smallest covering interval** per query → **offline**: sort queries, sort intervals by left, and use a **min-heap keyed by interval size**.",
    figureItOut: [
      "Brute force is O(queries × intervals): for each query, scan every interval. With 10⁵ of each that's 10¹⁰ — far too slow. We need to share work across queries.",
      "**Process queries offline, smallest first.** Sort the queries ascending (remembering their original positions so you can place answers back). As the query value grows, more intervals become 'available' (their `left <= q`).",
      "**Sort intervals by left.** Maintain a pointer that **adds** every interval whose `left <= q` into a **min-heap keyed by interval size**. Once added, an interval stays a candidate as long as it still covers q.",
      "**Lazily evict the dead ones:** before answering query q, pop from the heap any interval whose `right < q` (it ends before the query, so it no longer covers it). The heap's top is then the **smallest** interval that both started early enough and hasn't ended → that's the answer (or −1 if the heap is empty).",
      "Why does sorting queries make this work? Because q only increases, an interval that becomes available stays available until it expires, and an expired interval never matters for any *larger* query either — so each interval is pushed and popped at most once. That's the trick that turns O(n·m) into O((n+m) log n).",
    ],
    approaches: [
      {
        name: "Brute force — scan intervals per query",
        intuition: "For each query, check every interval and keep the smallest that covers it.",
        time: "O(q × n)",
        timeWhy: "Every query examines every interval.",
        space: "O(q)",
        spaceWhy: "The answer array.",
        code: `int[] minInterval(int[][] intervals, int[] queries) {
    int[] ans = new int[queries.length];
    for (int k = 0; k < queries.length; k++) {
        int q = queries[k], best = -1;
        for (int[] it : intervals) {
            if (it[0] <= q && q <= it[1]) {
                int size = it[1] - it[0] + 1;
                if (best == -1 || size < best) best = size;
            }
        }
        ans[k] = best;
    }
    return ans;
}`,
      },
      {
        name: "Offline sort + size min-heap (optimal)",
        intuition: "Sort queries; add intervals as they become reachable, evict expired ones, and read the smallest live interval off a heap.",
        time: "O((n + q) log(n + q))",
        timeWhy: "Sorting both arrays plus each interval pushed/popped once with O(log n) heap ops.",
        space: "O(n + q)",
        spaceWhy: "The heap, sorted query indices, and the answer array.",
        code: `int[] minInterval(int[][] intervals, int[] queries) {
    int n = intervals.length, q = queries.length;
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by left
    Integer[] order = new Integer[q];
    for (int i = 0; i < q; i++) order[i] = i;
    Arrays.sort(order, (a, b) -> Integer.compare(queries[a], queries[b]));  // queries ascending
    // heap entries: {size, right}, ordered by size
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
    int[] ans = new int[q];
    int idx = 0;
    for (int qi : order) {
        int val = queries[qi];
        while (idx < n && intervals[idx][0] <= val) {           // add now-available intervals
            heap.add(new int[]{intervals[idx][1] - intervals[idx][0] + 1, intervals[idx][1]});
            idx++;
        }
        while (!heap.isEmpty() && heap.peek()[1] < val) heap.poll(); // evict expired
        ans[qi] = heap.isEmpty() ? -1 : heap.peek()[0];
    }
    return ans;
}`,
        walkthrough: [
          "intervals sorted by left=[[1,4],[2,4],[3,6],[4,4]], queries sorted=[2,3,4,5].",
          "q=2: add [1,4](size4),[2,4](size3); none expired → smallest size 3. q=3: add [3,6](size4); top still size3 → 3.",
          "q=4: add [4,4](size1); none expired before 4 → smallest 1. q=5: evict [1,4],[2,4],[4,4] (right<5); left [3,6] → 4.",
        ],
      },
    ],
    edgeCases: [
      "A query covered by no interval → −1.",
      "Two intervals of equal size covering a query → either size is correct (they're equal).",
      "Restoring answers to original query positions via the index array is essential — the queries were reordered.",
    ],
    twists: [
      "**Return the actual interval**, not just its size → store the interval in the heap entry too.",
      "**Online queries (can't sort)** → needs a heavier structure like a segment tree or interval tree.",
      "**Largest covering interval instead of smallest** → flip the heap to a max-heap by size.",
    ],
    related: ["meeting-rooms-ii", "merge-intervals"],
  },
];
