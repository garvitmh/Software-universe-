// The DSA Lab — NeetCode-style. Learn by PATTERN, not by memorizing problems:
// recognize the shape → reach the optimal approach → handle every twist.
// Pure data; rendered by app/dsa/*. Add a pattern or problem here and it's live.

export const DSA_PATTERNS = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    tint: "blue",
    idea: "Walk two indices through the data (from the ends, or one chasing the other) so you scan in O(n) instead of checking every pair in O(n²).",
    recognize: [
      "A sorted array + 'find a pair/triplet that sums to X'",
      "Comparing the two ends (palindrome, container, reverse)",
      "In-place work: dedup, partition, move zeroes",
      "Anything where a nested loop is really 'i and j approaching each other'",
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    tint: "teal",
    idea: "Keep a moving window [l..r] over contiguous elements and update a running aggregate as it grows and shrinks — turning an O(n²) subarray scan into O(n).",
    recognize: [
      "'Longest / shortest / max / min subarray or substring with <property>'",
      "The answer is a CONTIGUOUS range",
      "Constraints like 'at most K distinct', 'sum ≤ S', 'no repeats'",
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    tint: "amber",
    idea: "When the search space is sorted (or any monotonic 'feasible(x)' check), halve it every step — O(log n) instead of O(n). The space can be an array, OR the range of possible answers ('binary search on the answer').",
    recognize: [
      "A sorted array + 'find X' or 'find the boundary where the condition flips'",
      "'Minimize/maximize a value such that feasible(value) is monotonic' → search on the answer",
      "Checking one candidate is cheap, but trying all candidates is O(n) or worse",
    ],
  },
  {
    id: "trees",
    name: "Trees · BFS & DFS",
    tint: "purple",
    idea: "Most tree problems are either a depth-first recursion ('handle node, recurse left, recurse right') or a breadth-first, level-by-level sweep with a queue.",
    recognize: [
      "A binary / n-ary tree input",
      "'depth', 'path', 'invert', 'same tree', 'subtree', 'diameter' → DFS recursion",
      "'level order', 'nearest', 'shortest path in an unweighted graph' → BFS with a queue",
    ],
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    tint: "pink",
    idea: "Break a problem into overlapping subproblems, solve each once, and reuse the answers. Name a state, write the recurrence between states, set the base cases — then memoize (top-down) or fill a table (bottom-up).",
    recognize: [
      "'Count the ways' / 'min or max cost to reach' / 'is it achievable'",
      "Choices at each step where the best future depends on the current choice",
      "A brute-force recursion that recomputes the same subproblem again and again",
    ],
  },
];

export const DSA_PROBLEMS = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    pattern: "two-pointers",
    statement:
      "Given an array `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Exactly one solution exists; you may not use the same element twice.",
    recognize:
      "You need a **pair** that sums to a target. 'Pair + target' is the trigger: if the array is unsorted and you want O(n), reach for a **hash map**; if it's sorted, **two pointers** gives O(1) extra space.",
    approaches: [
      {
        name: "Brute force",
        idea: "Try every pair (i, j) and check if they sum to target.",
        time: "O(n²)", space: "O(1)",
        code: `def twoSum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`,
      },
      {
        name: "Hash map (optimal, unsorted)",
        idea: "As you scan, remember each value→index. For the current x, the partner you need is target − x; if you've already seen it, you're done — one pass.",
        time: "O(n)", space: "O(n)",
        code: `def twoSum(nums, target):
    seen = {}                  # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i`,
      },
    ],
    twists: [
      "**Array is sorted** → drop the hash map; use two pointers (l, r) moving inward by comparing the sum to target → O(1) space (LeetCode 167).",
      "**Return the values, not indices** → identical logic.",
      "**Count all pairs** summing to target → keep a hash map of value→count and accumulate.",
      "**Three numbers** summing to target (3Sum) → sort, fix one number, then two-pointer the rest. This is the bridge to the next level.",
    ],
    related: ["valid-palindrome"],
  },
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    pattern: "two-pointers",
    statement:
      "Given a string `s`, return true if it reads the same forwards and backwards, considering only alphanumeric characters and ignoring case.",
    recognize:
      "You're **comparing the two ends** of a sequence and meeting in the middle — the canonical two-pointers shape. No extra data structure needed.",
    approaches: [
      {
        name: "Clean then compare (simple)",
        idea: "Strip to lowercase alphanumerics, then check the string equals its reverse.",
        time: "O(n)", space: "O(n)",
        code: `def isPalindrome(s):
    t = [c.lower() for c in s if c.isalnum()]
    return t == t[::-1]`,
      },
      {
        name: "Two pointers (optimal space)",
        idea: "Move l from the left and r from the right, skipping non-alphanumerics, comparing as you go — no extra string built.",
        time: "O(n)", space: "O(1)",
        code: `def isPalindrome(s):
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1; r -= 1
    return True`,
      },
    ],
    twists: [
      "**Allow deleting at most one character** and still be a palindrome → when l/r mismatch, try skipping l OR r and recurse (LeetCode 680).",
      "**Linked list palindrome** → find the middle, reverse the second half, compare.",
      "**Longest palindromic substring** → different pattern entirely: expand around each center.",
    ],
    related: ["two-sum"],
  },
  {
    slug: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    pattern: "sliding-window",
    statement:
      "Given a string `s`, return the length of the longest substring that contains no repeating characters.",
    recognize:
      "'**Longest contiguous** substring with a property (no repeats)' is the textbook sliding-window trigger. Grow the window on the right; when the property breaks, shrink from the left.",
    approaches: [
      {
        name: "Brute force",
        idea: "Check every substring for uniqueness.",
        time: "O(n²) (or O(n³) naively)", space: "O(min(n, charset))",
        code: `def lengthOfLongestSubstring(s):
    best = 0
    for i in range(len(s)):
        seen = set()
        for j in range(i, len(s)):
            if s[j] in seen: break
            seen.add(s[j]); best = max(best, j - i + 1)
    return best`,
      },
      {
        name: "Sliding window (optimal)",
        idea: "Track the last index of each char. When the current char was seen inside the window, jump the left edge just past it. The window is always repeat-free; track its max length.",
        time: "O(n)", space: "O(min(n, charset))",
        code: `def lengthOfLongestSubstring(s):
    last = {}        # char -> last index seen
    l = 0; best = 0
    for r, c in enumerate(s):
        if c in last and last[c] >= l:
            l = last[c] + 1
        last[c] = r
        best = max(best, r - l + 1)
    return best`,
      },
    ],
    twists: [
      "**At most K distinct characters** → same window, shrink while distinct > K (LeetCode 340).",
      "**Longest repeating char replacement** (you may change ≤ K chars) → window valid while (windowLen − countOfMostFrequent) ≤ K (LeetCode 424).",
      "**Minimum window substring** (contains all of T) → sliding window that grows to satisfy, then shrinks to minimize (LeetCode 76).",
    ],
    related: ["two-sum"],
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    pattern: "binary-search",
    statement:
      "Given a **sorted** array `nums` and a `target`, return its index, or −1 if absent. Must run in O(log n).",
    recognize:
      "Sorted input + 'find this value' + an O(log n) requirement screams binary search. The whole game is keeping the invariant that the answer, if present, is always inside [lo, hi].",
    approaches: [
      {
        name: "Binary search",
        idea: "Look at the middle. If it's the target, done. If it's too small, the answer is to the right; otherwise to the left. Halve the range each step.",
        time: "O(log n)", space: "O(1)",
        code: `def search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      },
    ],
    twists: [
      "**Find the first/last position** of a value → binary-search for the boundary (keep moving even after a match).",
      "**Rotated sorted array** → one half is always sorted; decide which half the target is in (LeetCode 33).",
      "**No array — search the answer.** 'Smallest speed/size that works' where feasible(x) is monotonic → binary search the value range (see Koko).",
    ],
    related: ["koko-eating-bananas"],
  },
  {
    slug: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    pattern: "binary-search",
    statement:
      "Koko eats bananas at `k` per hour. With piles `piles` and `h` hours, return the **smallest** `k` such that she finishes all piles within `h` hours.",
    recognize:
      "There's no sorted array — but the answer is a number in a range [1, max(pile)], and 'can she finish at speed k?' is **monotonic** (faster is always ≥ as good). That monotonicity is the signal to binary-search the answer.",
    approaches: [
      {
        name: "Binary search on the answer",
        idea: "feasible(k) = hours needed at speed k ≤ h. It flips from false→true once and stays true, so binary-search the smallest k where it's true.",
        time: "O(n log(max pile))", space: "O(1)",
        code: `import math
def minEatingSpeed(piles, h):
    def hours(k):
        return sum(math.ceil(p / k) for p in piles)
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= h:
            hi = mid          # mid works, try slower
        else:
            lo = mid + 1      # too slow
    return lo`,
      },
    ],
    twists: [
      "**Ship packages within D days** (LeetCode 1011) → identical shape: binary-search the capacity.",
      "**Split array into K subarrays minimizing the largest sum** → binary-search the largest-sum value.",
      "The trick is always: find a monotonic `feasible(x)`, then binary-search x.",
    ],
    related: ["binary-search"],
  },
  {
    slug: "maximum-depth-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    statement:
      "Given the `root` of a binary tree, return its maximum depth (the number of nodes along the longest root-to-leaf path).",
    recognize:
      "A tree + 'depth/height' is the canonical DFS recursion: the depth of a node is 1 + the deeper of its two children. Base case: an empty subtree has depth 0.",
    approaches: [
      {
        name: "DFS recursion",
        idea: "Trust the recursion: ask each child for its depth, take the max, add one for the current node.",
        time: "O(n)", space: "O(h) (recursion stack, h = height)",
        code: `def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      },
    ],
    twists: [
      "**Minimum depth** → careful: a node with only one child isn't a leaf, so take the min of *present* children only.",
      "**Diameter** (longest path between any two nodes) → same recursion, but track left+right depth at each node as a candidate answer.",
      "**Balanced tree check** → return depth AND a balanced-flag from the same recursion.",
    ],
    related: ["level-order-traversal"],
  },
  {
    slug: "level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    pattern: "trees",
    statement:
      "Given the `root` of a binary tree, return its node values grouped **level by level**, top to bottom.",
    recognize:
      "'Level by level' / 'breadth' is the BFS signal. Use a queue and process exactly one level per outer iteration by snapshotting the queue's size.",
    approaches: [
      {
        name: "BFS with a queue",
        idea: "Push the root. Each round, pop exactly the current level's nodes (using the queue length), record their values, and enqueue their children for the next round.",
        time: "O(n)", space: "O(n)",
        code: `from collections import deque
def levelOrder(root):
    res = []
    if not root:
        return res
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res`,
      },
    ],
    twists: [
      "**Right-side view** → take the last node of each level.",
      "**Zigzag order** → reverse alternate levels.",
      "**Shortest path in an unweighted graph** → the same BFS, on a graph with a visited set.",
    ],
    related: ["maximum-depth-binary-tree"],
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    pattern: "dynamic-programming",
    statement:
      "You can climb 1 or 2 steps at a time. In how many distinct ways can you reach the top of `n` stairs?",
    recognize:
      "'Count the ways to reach n' where each step depends on earlier ones → DP. The state is 'ways to reach step i', and ways(i) = ways(i−1) + ways(i−2) (your last move was a 1 or a 2). It's Fibonacci in disguise.",
    approaches: [
      {
        name: "Bottom-up (O(1) space)",
        idea: "Carry only the last two answers forward; no table needed.",
        time: "O(n)", space: "O(1)",
        code: `def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2          # ways to reach step 1 and step 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      },
    ],
    twists: [
      "**You can climb 1, 2, or 3 steps** → ways(i) = ways(i−1)+ways(i−2)+ways(i−3).",
      "**Min cost climbing stairs** (each step has a cost) → dp[i] = cost[i] + min(dp[i−1], dp[i−2]).",
      "**House Robber** is the same skeleton: dp[i] = max(dp[i−1], dp[i−2] + nums[i]).",
    ],
    related: ["coin-change"],
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    pattern: "dynamic-programming",
    statement:
      "Given coin denominations `coins` and an `amount`, return the **fewest** coins needed to make that amount, or −1 if it's impossible. Unlimited coins of each kind.",
    recognize:
      "'Min coins to reach amount' is a classic 'min cost to reach a target' DP. State = fewest coins for value `a`; recurrence = 1 + min over coins of dp[a − coin]. Bottom-up fills 0…amount.",
    approaches: [
      {
        name: "Bottom-up table",
        idea: "dp[a] = fewest coins to make a. Start dp[0]=0, everything else 'infinity'; for each amount, try each coin that fits.",
        time: "O(amount × #coins)", space: "O(amount)",
        code: `def coinChange(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1`,
      },
    ],
    twists: [
      "**Count the number of ways** to make the amount (not the minimum) → flip the loops (coins outer) and sum instead of min (LeetCode 518).",
      "**Each coin usable once** → that's 0/1 knapsack; iterate the amount downward.",
      "**Largest amount you CAN'T make** with given coins → the Chicken McNugget / Frobenius problem.",
    ],
    related: ["climbing-stairs"],
  },
];

export function problemsByPattern(patternId) {
  return DSA_PROBLEMS.filter((p) => p.pattern === patternId);
}
export const DSA_STATS = {
  patterns: DSA_PATTERNS.length,
  problems: DSA_PROBLEMS.length,
};
