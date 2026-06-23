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
];

export function problemsByPattern(patternId) {
  return DSA_PROBLEMS.filter((p) => p.pattern === patternId);
}
export const DSA_STATS = {
  patterns: DSA_PATTERNS.length,
  problems: DSA_PROBLEMS.length,
};
