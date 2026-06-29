// The DSA Lab — NeetCode-style, taught for depth in JAVA.
//
// The skill is not memorizing problems — it's (1) recognizing which of ~18
// shapes a new problem is, and (2) being able to *derive* the optimal approach
// from scratch. So every problem teaches the THINKING ("figure it out"), then
// brute-force → optimal with the complexity reasoning, a trace, and edge cases.
//
// Pure data, rendered by app/dsa/*. Inline markup: `code` and **bold**.

import { WAVE1A } from "./dsa/wave1a";
import { WAVE1B } from "./dsa/wave1b";
import { WAVE1C } from "./dsa/wave1c";
import { WAVE2A } from "./dsa/wave2a";
import { WAVE2B } from "./dsa/wave2b";
import { WAVE2C } from "./dsa/wave2c";
import { WAVE3A } from "./dsa/wave3a";
import { WAVE3B } from "./dsa/wave3b";
import { WAVE3C } from "./dsa/wave3c";
import { WAVE4A } from "./dsa/wave4a";
import { WAVE4B } from "./dsa/wave4b";
import { WAVE4C } from "./dsa/wave4c";
import { WAVE5A } from "./dsa/wave5a";
import { WAVE5B } from "./dsa/wave5b";
import { WAVE5C } from "./dsa/wave5c";
import { WAVE6A } from "./dsa/wave6a";
import { WAVE6B } from "./dsa/wave6b";
import { WAVE6C } from "./dsa/wave6c";
import { WAVE7A } from "./dsa/wave7a";
import { WAVE7B } from "./dsa/wave7b";
import { WAVE7C } from "./dsa/wave7c";
import { WAVE8A } from "./dsa/wave8a";
import { WAVE8B } from "./dsa/wave8b";
import { WAVE8C } from "./dsa/wave8c";

export const DSA_PATTERNS = [
  {
    id: "arrays-hashing",
    name: "Arrays & Hashing",
    tint: "blue",
    idea: "A hash set/map turns 'have I seen this?' and 'where is this?' from an O(n) scan into an O(1) lookup. Trading O(n) memory for O(n) time is the most common first move in all of interviewing.",
    recognize: [
      "'Has a duplicate', 'count of each', 'group by something' → hash map/set",
      "'Find the complement / the pair / the match' in one pass → remember what you've seen",
      "You're about to write a nested loop just to look something up → hash it instead",
    ],
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    tint: "teal",
    idea: "Walk two indices through the data — from the two ends, or one chasing the other — so you scan in O(n) instead of checking every pair in O(n²). Almost always wants the data sorted first.",
    recognize: [
      "A sorted array + 'find a pair/triplet that sums to X'",
      "Comparing the two ends (palindrome, container with most water, reverse)",
      "In-place work: dedup, partition, move zeroes",
      "A nested loop that's really 'i and j approaching each other'",
    ],
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    tint: "amber",
    idea: "Keep a moving window [l..r] over contiguous elements and update a running aggregate as it grows and shrinks — turning an O(n²) subarray scan into O(n). Each element enters and leaves the window once.",
    recognize: [
      "'Longest / shortest / max / min subarray or substring with <property>'",
      "The answer is a CONTIGUOUS range",
      "Constraints like 'at most K distinct', 'sum ≤ S', 'no repeats'",
    ],
  },
  {
    id: "stack",
    name: "Stack",
    tint: "purple",
    idea: "A stack remembers the most recent unfinished thing. Reach for it when the answer depends on the nearest previous element — matching brackets, the next greater element, evaluating nested structure.",
    recognize: [
      "'Valid / balanced parentheses', nested structure → push opens, pop on close",
      "'Next greater / warmer / smaller element' → a monotonic stack",
      "Evaluate an expression, undo, or backtrack the most recent action",
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    tint: "blue",
    idea: "When the search space is sorted — or any monotonic feasible(x) check — halve it every step: O(log n) instead of O(n). The space can be an array, OR the range of possible answers ('binary search on the answer').",
    recognize: [
      "A sorted array + 'find X' or 'find the boundary where the condition flips'",
      "'Minimize/maximize a value such that feasible(value) is monotonic' → search on the answer",
      "Checking one candidate is cheap, but trying all is O(n) or worse",
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    tint: "teal",
    idea: "Linked-list problems are pointer choreography. Two tricks cover most of them: a fast/slow pointer (find the middle, detect a cycle) and careful in-place reversal with three pointers (prev, cur, next).",
    recognize: [
      "'Find the middle', 'detect a cycle', 'kth from the end' → fast & slow pointers",
      "'Reverse the list (or part of it)' → in-place reversal with prev/cur/next",
      "Merging or reordering nodes → a dummy head node simplifies the edge cases",
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
      "'level order', 'right side view', 'shortest path in an unweighted graph' → BFS with a queue",
    ],
  },
  {
    id: "tries",
    name: "Tries",
    tint: "amber",
    idea: "A trie (prefix tree) stores strings by character so that shared prefixes share nodes. Lookups and prefix queries cost O(length), independent of how many words you've stored.",
    recognize: [
      "'Insert/search words', 'starts-with prefix', autocomplete → trie",
      "Many strings sharing prefixes, repeated prefix queries",
      "Word-search / dictionary problems on a grid",
    ],
  },
  {
    id: "heaps",
    name: "Heaps · Priority Queue",
    tint: "pink",
    idea: "A heap always hands you the smallest (or largest) element in O(log n). Reach for it whenever you need the 'top K', a running median, or to always process the next-best item.",
    recognize: [
      "'Top K' / 'K largest/smallest' / 'K closest' → a size-K heap",
      "'Merge K sorted things' / 'next smallest across lists' → a min-heap",
      "'Always take the best available next' (scheduling) → a priority queue",
    ],
  },
  {
    id: "backtracking",
    name: "Backtracking",
    tint: "blue",
    idea: "Build a candidate one choice at a time; when a choice can't lead to a solution, undo it and try the next. It's DFS over the tree of decisions — choose, explore, un-choose.",
    recognize: [
      "'All subsets / permutations / combinations' → enumerate choices",
      "'Find every path / arrangement that satisfies <constraint>'",
      "Sudoku, N-Queens, word search — place, recurse, remove",
    ],
  },
  {
    id: "graphs",
    name: "Graphs",
    tint: "teal",
    idea: "Model entities as nodes and relationships as edges, then explore with BFS (shortest path / levels) or DFS (connectivity / cycles). A 2D grid is just a graph where each cell connects to its neighbours.",
    recognize: [
      "'Connected components', 'islands', 'regions' on a grid → DFS/BFS flood fill",
      "'Can you finish / valid order' with dependencies → topological sort (cycle detection)",
      "'Shortest path in an unweighted graph' → BFS",
    ],
  },
  {
    id: "advanced-graphs",
    name: "Advanced Graphs",
    tint: "purple",
    idea: "When edges have weights or you need global structure: Dijkstra (shortest path with non-negative weights), union-find (grouping/connectivity), and minimum spanning trees (Prim/Kruskal).",
    recognize: [
      "Weighted shortest path → Dijkstra (a min-heap of (dist, node))",
      "'Are these connected / how many groups' with many union queries → union-find",
      "'Cheapest way to connect everything' → minimum spanning tree",
    ],
  },
  {
    id: "dp-1d",
    name: "1-D Dynamic Programming",
    tint: "amber",
    idea: "Break a problem into overlapping subproblems indexed by one variable, solve each once, reuse. Name the state dp[i], write the recurrence from earlier states, set base cases — then fill a table.",
    recognize: [
      "'Count the ways' / 'min or max cost to reach step i' / 'is it achievable'",
      "A choice at each index where the best future depends on the current choice",
      "A brute-force recursion that recomputes the same dp[i] again and again",
    ],
  },
  {
    id: "dp-2d",
    name: "2-D Dynamic Programming",
    tint: "pink",
    idea: "The state needs two indices — usually two sequences, or a sequence plus a budget. dp[i][j] is the answer for the first i of one thing and first j of another; the recurrence relates it to its neighbours in the grid.",
    recognize: [
      "Two strings/arrays compared → edit distance, LCS, regex matching",
      "'Choose items under a capacity' → 0/1 knapsack-style dp[i][capacity]",
      "Grid paths with constraints",
    ],
  },
  {
    id: "greedy",
    name: "Greedy",
    tint: "blue",
    idea: "Make the locally best choice at each step and never look back — when a proof (or strong intuition) says local optima compose into the global optimum. Often pairs with sorting.",
    recognize: [
      "'Maximum / minimum number of ...' where an obvious local rule seems to work",
      "Interval scheduling, jump games, assigning resources",
      "Sorting first makes the greedy choice obvious",
    ],
  },
  {
    id: "intervals",
    name: "Intervals",
    tint: "teal",
    idea: "Sort by start (or end), then sweep once, merging or comparing neighbours. Almost every interval problem is 'sort, then walk and combine'.",
    recognize: [
      "'Merge overlapping intervals', 'insert an interval', 'do they overlap'",
      "'Minimum rooms / arrows / removals' → sort by end, greedy",
      "Anything with [start, end] ranges",
    ],
  },
  {
    id: "math-geometry",
    name: "Math & Geometry",
    tint: "purple",
    idea: "Problems solved by a numeric insight or coordinate manipulation rather than a data structure — rotating a matrix in place, spiral traversal, digit math, detecting overflow.",
    recognize: [
      "Rotate / transpose / spiral a matrix",
      "Digit manipulation, GCD, primes, powers",
      "'Do it in O(1) space' on a grid by encoding state cleverly",
    ],
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    tint: "amber",
    idea: "Use the binary representation directly: XOR cancels pairs, AND masks bits, shifting moves them. Turns some counting and set problems into a few O(1) operations.",
    recognize: [
      "'Single number', 'find the missing/duplicate' → XOR cancels pairs",
      "'Count set bits', 'is it a power of two' → bit tricks",
      "Represent a small set of items as the bits of one integer",
    ],
  },
];

const BASE_PROBLEMS = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 217,
    statement:
      "Given an integer array `nums`, return `true` if any value appears **at least twice**, and `false` if every element is distinct.",
    examples: [
      { in: "nums = [1,2,3,1]", out: "true", note: "1 appears twice" },
      { in: "nums = [1,2,3,4]", out: "false", note: "all distinct" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    recognize:
      "The question is purely **'have I seen this value before?'**. The moment a problem is about seen-before / counts / membership, a **hash set** should be the first thing you reach for.",
    figureItOut: [
      "Start with the dumbest thing that works: for every element, look at every later element and check for a match. That's two nested loops — **O(n²)**. It's correct, so now ask: *what makes it slow?*",
      "The inner loop is just answering one question: *'is this value somewhere else in the array?'* You're re-scanning the whole array to answer it. That's the waste.",
      "Key realization: you don't need to *search* for a value if you **remember** the ones you've already passed. A **hash set** answers 'have I seen x?' in O(1).",
      "So walk once, left to right. Before storing each value, check the set: if it's already there, you've found a duplicate. If you finish the walk, everything was unique.",
    ],
    approaches: [
      {
        name: "Brute force — check every pair",
        intuition: "Compare each element with every element after it. Correct, but quadratic.",
        time: "O(n²)",
        timeWhy: "For each of n elements you scan up to n others — n × n comparisons.",
        space: "O(1)",
        spaceWhy: "No extra storage beyond a couple of indices.",
        code: `boolean containsDuplicate(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}`,
      },
      {
        name: "Hash set (optimal)",
        intuition: "Remember every value you've seen. A repeat is a value already in the set.",
        time: "O(n)",
        timeWhy: "One pass; each add and contains on a HashSet is O(1) on average.",
        space: "O(n)",
        spaceWhy: "In the worst case (all distinct) the set holds all n values.",
        code: `boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return true;   // add returns false if x was already present
    }
    return false;
}`,
        walkthrough: [
          "nums = [1,2,3,1]. seen = {} → add 1 → {1} → add 2 → {1,2} → add 3 → {1,2,3}.",
          "Next is 1: `seen.add(1)` returns false (already there) → return true.",
        ],
      },
    ],
    edgeCases: [
      "Single element → no duplicate possible → false.",
      "Negative numbers and the full int range — a HashSet of Integer handles them fine.",
    ],
    twists: [
      "**Return the duplicated value** (or all of them) → use the same set, just record the value when `add` fails.",
      "**Allow duplicates only within distance k** (LeetCode 219) → keep a sliding window set of the last k elements.",
      "**O(1) extra space, values in 1..n** → you can XOR or index-mark instead of a set (see *Find the Duplicate Number*).",
    ],
    related: ["two-sum", "valid-anagram"],
  },

  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1,
    statement:
      "Given an array `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`. Exactly one solution exists; you may not use the same element twice.",
    examples: [
      { in: "nums = [2,7,11,15], target = 9", out: "[0,1]", note: "2 + 7 = 9" },
      { in: "nums = [3,2,4], target = 6", out: "[1,2]", note: "2 + 4 = 6" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "Exactly one valid answer exists"],
    recognize:
      "You need a **pair that sums to a target**. 'Pair + target' is the trigger. If the array is unsorted and you want O(n), reach for a **hash map** (value → index); if it were sorted, two pointers would do it in O(1) space.",
    figureItOut: [
      "Brute force: try every pair (i, j) and check `nums[i] + nums[j] == target`. O(n²). Correct — now find the waste.",
      "For a fixed `nums[i]`, the inner loop is hunting for one specific number: **`target − nums[i]`** (the 'complement'). You're scanning to find a known value — that's a lookup, not a search.",
      "So remember every value you've passed, mapped to **where** you saw it (you must return indices). Then for each new x, just ask: *have I already seen `target − x`?*",
      "Check before you insert, so you never pair an element with itself. The first time the complement is already in the map, you're done — one pass.",
    ],
    approaches: [
      {
        name: "Brute force — every pair",
        intuition: "Test all i < j pairs.",
        time: "O(n²)",
        timeWhy: "n choices for i times up to n for j.",
        space: "O(1)",
        spaceWhy: "Just indices.",
        code: `int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) return new int[]{i, j};
        }
    }
    return new int[]{};
}`,
      },
      {
        name: "Hash map in one pass (optimal)",
        intuition: "Map each value to its index as you go; the partner you need is `target − x`.",
        time: "O(n)",
        timeWhy: "One pass; each map get/put is O(1) average.",
        space: "O(n)",
        spaceWhy: "The map may hold up to n entries.",
        code: `int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();   // value -> index
    for (int i = 0; i < nums.length; i++) {
        int need = target - nums[i];
        if (seen.containsKey(need)) return new int[]{seen.get(need), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}`,
        walkthrough: [
          "target = 9. i=0, x=2, need=7 → not seen → put {2:0}.",
          "i=1, x=7, need=2 → seen has 2 at index 0 → return [0,1].",
        ],
      },
    ],
    edgeCases: [
      "Duplicate values (e.g. [3,3], target 6) — storing index works because you check the complement before inserting the current one.",
      "Negative numbers and a negative target — arithmetic is identical.",
    ],
    twists: [
      "**Array is sorted** → drop the map; two pointers from both ends, O(1) space (LeetCode 167).",
      "**Count all pairs** summing to target → keep value→count and accumulate.",
      "**Three numbers summing to target (3Sum)** → sort, fix one, two-pointer the rest. The natural next problem.",
    ],
    related: ["valid-anagram", "3sum"],
  },

  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 242,
    statement:
      "Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s` — the same characters with the same counts, just reordered.",
    examples: [
      { in: 's = "anagram", t = "nagaram"', out: "true" },
      { in: 's = "rat", t = "car"', out: "false" },
    ],
    constraints: ["1 ≤ s.length, t.length ≤ 5·10⁴", "lowercase English letters"],
    recognize:
      "Anagram = **same multiset of characters**. Whenever a problem is about 'same counts of each thing', a **frequency count** (a hash map, or a fixed array for a small alphabet) is the tool.",
    figureItOut: [
      "What does 'anagram' actually mean? Same letters, same number of each. So if you **tally how many of each letter** each string has and the tallies match, they're anagrams.",
      "First sanity check: different lengths can never be anagrams — bail out early.",
      "You could sort both strings and compare — simple, O(n log n). But sorting is overkill: you don't need order, only counts.",
      "For lowercase English (26 letters), a 26-slot int array is faster and lighter than a hash map. Add for `s`, subtract for `t`; if every slot ends at 0, the counts matched.",
    ],
    approaches: [
      {
        name: "Sort both, compare",
        intuition: "Anagrams become identical once sorted.",
        time: "O(n log n)",
        timeWhy: "Dominated by the two sorts.",
        space: "O(n)",
        spaceWhy: "Char arrays to sort.",
        code: `boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    char[] a = s.toCharArray(), b = t.toCharArray();
    Arrays.sort(a); Arrays.sort(b);
    return Arrays.equals(a, b);
}`,
      },
      {
        name: "Count letters (optimal)",
        intuition: "One pass adding for s and subtracting for t; all counts must return to zero.",
        time: "O(n)",
        timeWhy: "One pass over each string; the 26-slot check is constant.",
        space: "O(1)",
        spaceWhy: "A fixed 26-element array regardless of input size.",
        code: `boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}`,
        walkthrough: [
          "s='rat', t='car'. After counting: r:0, a:0, t:+1 (from s), c:−1 (from t).",
          "A non-zero slot (t and c) → not an anagram → false.",
        ],
      },
    ],
    edgeCases: [
      "Unequal lengths → immediately false (the cheap guard).",
      "**Unicode / full alphabet** → the 26-array trick breaks; use a `HashMap<Character,Integer>` instead.",
    ],
    twists: [
      "**Group anagrams together** (LeetCode 49) → use the sorted string (or the count signature) as a hash-map key.",
      "**Unicode input** → switch the fixed array for a hash map.",
    ],
    related: ["contains-duplicate", "two-sum"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 125,
    statement:
      "Given a string `s`, return `true` if it reads the same forwards and backwards, considering **only alphanumeric characters** and ignoring case.",
    examples: [
      { in: 's = "A man, a plan, a canal: Panama"', out: "true" },
      { in: 's = "race a car"', out: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 2·10⁵"],
    recognize:
      "You're **comparing the two ends** of a sequence and meeting in the middle — the canonical two-pointers shape. No extra data structure needed.",
    figureItOut: [
      "A palindrome means position 0 matches the last position, 1 matches second-last, and so on inward. That's literally two pointers walking toward each other.",
      "The simple version: strip the string down to lowercase alphanumerics, then check it equals its reverse. Clear, but it builds a whole new string — O(n) extra space.",
      "To avoid the extra string, do the comparison in place: a pointer `l` from the left, `r` from the right.",
      "The only wrinkle is the 'ignore non-alphanumeric' rule: when `l` or `r` lands on punctuation/space, just skip it (advance the pointer) without comparing.",
    ],
    approaches: [
      {
        name: "Clean then compare",
        intuition: "Filter to alphanumerics lowercase, compare with the reverse.",
        time: "O(n)",
        timeWhy: "One filter pass plus a reverse-compare pass.",
        space: "O(n)",
        spaceWhy: "Builds a cleaned copy of the string.",
        code: `boolean isPalindrome(String s) {
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));
    }
    String a = sb.toString();
    return a.equals(sb.reverse().toString());
}`,
      },
      {
        name: "Two pointers, in place (optimal space)",
        intuition: "Walk l from the left and r from the right, skipping non-alphanumerics, comparing as you go.",
        time: "O(n)",
        timeWhy: "Each character is visited at most once by l or r.",
        space: "O(1)",
        spaceWhy: "Only two index variables; nothing is copied.",
        code: `boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
        while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
        if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
        l++; r--;
    }
    return true;
}`,
        walkthrough: [
          '"race a car": l→r, r→r match... l reaches \'e\', r reaches \'c\' after skipping spaces.',
          "'e' != 'c' → return false.",
        ],
      },
    ],
    edgeCases: [
      "Empty string or all punctuation → vacuously a palindrome → true.",
      "Mixed case must be normalized — forgetting `toLowerCase` is the classic bug.",
    ],
    twists: [
      "**Allow deleting at most one character** (LeetCode 680) → on a mismatch, try skipping the left OR the right and recheck.",
      "**Linked-list palindrome** → find the middle (fast/slow), reverse the second half, compare.",
    ],
    related: ["3sum"],
  },

  {
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 15,
    statement:
      "Given an array `nums`, return **all unique triplets** `[a, b, c]` such that `a + b + c == 0`. The solution set must not contain duplicate triplets.",
    examples: [
      { in: "nums = [-1,0,1,2,-1,-4]", out: "[[-1,-1,2],[-1,0,1]]" },
      { in: "nums = [0,1,1]", out: "[]", note: "no triplet sums to 0" },
    ],
    constraints: ["3 ≤ nums.length ≤ 3000", "−10⁵ ≤ nums[i] ≤ 10⁵"],
    recognize:
      "It's **Two Sum, one level up**. Fix one number, and the rest becomes 'find a pair summing to −that' in a sorted array → **two pointers**. Sorting also makes de-duplication trivial.",
    figureItOut: [
      "Brute force is three nested loops — O(n³) — plus a headache to remove duplicate triplets. Correct, but we can do much better.",
      "Reduce to a known problem: if you **fix** the first number `nums[i]`, you now need two others summing to `−nums[i]`. That's exactly Two Sum.",
      "If you **sort** the array first, that inner Two Sum can use **two pointers** (l, r) instead of a hash map — O(n) per fixed i, O(1) space, and the result comes out ordered.",
      "Duplicates are the trap. Because it's sorted, skip over equal values: skip a repeated `nums[i]`, and after finding a triplet skip repeated l and r values. That guarantees uniqueness without a set.",
      "One more speedup: once `nums[i] > 0`, the smallest possible sum is already positive, so you can stop early.",
    ],
    approaches: [
      {
        name: "Brute force — three loops",
        intuition: "Try every triplet, dedupe with a set.",
        time: "O(n³)",
        timeWhy: "Three nested loops over n.",
        space: "O(m)",
        spaceWhy: "A set to hold found triplets.",
        code: `// Conceptual baseline — too slow for the constraints, shown for contrast.
// for i: for j>i: for k>j: if sum==0 add sorted triple to a Set.`,
      },
      {
        name: "Sort + fix one + two pointers (optimal)",
        intuition: "Sort. For each i, two-pointer the remainder for a pair summing to −nums[i]; skip duplicates.",
        time: "O(n²)",
        timeWhy: "Sorting is O(n log n); then for each of n choices of i, the two-pointer sweep is O(n) → O(n²) dominates.",
        space: "O(1)",
        spaceWhy: "Ignoring the output list and sort's overhead, only pointers.",
        code: `List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (nums[i] > 0) break;                       // smallest is positive → done
        if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicate first numbers
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) l++;
            else if (sum > 0) r--;
            else {
                res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                l++; r--;
                while (l < r && nums[l] == nums[l - 1]) l++;   // skip duplicate l
                while (l < r && nums[r] == nums[r + 1]) r--;   // skip duplicate r
            }
        }
    }
    return res;
}`,
        walkthrough: [
          "sorted = [-4,-1,-1,0,1,2]. i=0 (−4): need pair=4, two-pointer finds none.",
          "i=1 (−1): l=2(−1), r=5(2) → sum 0 → add [-1,-1,2]; move in, skip dupes.",
          "continue l=3(0), r=4(1) → sum 0 → add [-1,0,1]. i=2 is a duplicate −1 → skip.",
        ],
      },
    ],
    edgeCases: [
      "Fewer than 3 elements → empty result.",
      "All zeros [0,0,0] → exactly one triplet [0,0,0]; the dup-skips prevent repeats.",
      "Duplicate-skipping is mandatory or you'll emit the same triplet many times.",
    ],
    twists: [
      "**3Sum Closest** → track the closest sum to target instead of exactly 0.",
      "**4Sum** → fix two numbers, two-pointer the rest → O(n³).",
      "**3Sum Smaller (count triplets < target)** → on each l/r, all l..r-1 with the right pointer count at once.",
    ],
    related: ["two-sum", "valid-palindrome"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 121,
    statement:
      "Given `prices` where `prices[i]` is the price on day i, return the **maximum profit** from buying on one day and selling on a later day. If no profit is possible, return 0.",
    examples: [
      { in: "prices = [7,1,5,3,6,4]", out: "5", note: "buy at 1, sell at 6" },
      { in: "prices = [7,6,4,3,1]", out: "0", note: "only decreases" },
    ],
    constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
    recognize:
      "You're sliding forward in time, holding the **best buy point so far** (the window's left edge) and testing each day as a sell. 'Best so-far + scan once' is the sliding-window / running-minimum shape.",
    figureItOut: [
      "Brute force: try every (buy day i, sell day j>i) and take the max of `prices[j] − prices[i]`. O(n²). Correct — what's redundant?",
      "On any given sell day j, the only buy day worth using is the **cheapest day before j**. You don't need to re-scan all earlier days — you just need the minimum seen so far.",
      "So sweep left to right keeping one number: `minPrice` so far. On each day, the best profit ending today is `price − minPrice`; keep the max of those.",
      "Update `minPrice` as you go. One pass, O(1) memory.",
    ],
    approaches: [
      {
        name: "Brute force — every buy/sell pair",
        intuition: "Check all i<j.",
        time: "O(n²)",
        timeWhy: "Every pair of days.",
        space: "O(1)",
        spaceWhy: "Just a running max.",
        code: `int maxProfit(int[] prices) {
    int best = 0;
    for (int i = 0; i < prices.length; i++)
        for (int j = i + 1; j < prices.length; j++)
            best = Math.max(best, prices[j] - prices[i]);
    return best;
}`,
      },
      {
        name: "Track the minimum so far (optimal)",
        intuition: "Keep the cheapest buy seen; each day's best sale is today minus that.",
        time: "O(n)",
        timeWhy: "Single pass.",
        space: "O(1)",
        spaceWhy: "Two scalars.",
        code: `int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE, best = 0;
    for (int p : prices) {
        if (p < minPrice) minPrice = p;          // best buy point so far
        else best = Math.max(best, p - minPrice); // best sale ending today
    }
    return best;
}`,
        walkthrough: [
          "[7,1,5,3,6,4]: min=7→best0; p1<7 min=1; p5 best=4; p3 best=4; p6 best=5; p4 best=5 → 5.",
        ],
      },
    ],
    edgeCases: [
      "Monotonically decreasing prices → no profit → 0 (never sell at a loss).",
      "Single day → 0 (you can't buy and sell on the same transaction).",
    ],
    twists: [
      "**Unlimited transactions** (LeetCode 122) → greedily add every positive day-to-day gain.",
      "**At most k transactions** (LeetCode 188) → 2-D DP over (transaction, day).",
      "**With a cooldown / fee** → a small state machine DP.",
    ],
    related: ["longest-substring-without-repeating"],
  },

  {
    slug: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 3,
    statement:
      "Given a string `s`, return the length of the **longest substring** with no repeating characters.",
    examples: [
      { in: 's = "abcabcbb"', out: "3", note: '"abc"' },
      { in: 's = "bbbbb"', out: "1", note: '"b"' },
      { in: 's = "pwwkew"', out: "3", note: '"wke"' },
    ],
    constraints: ["0 ≤ s.length ≤ 5·10⁴"],
    recognize:
      "'**Longest contiguous** substring with a property (no repeats)' is the textbook **sliding window**: grow the right edge greedily, and when the property breaks, shrink the left edge until it holds again.",
    figureItOut: [
      "Brute force: check every substring for uniqueness — O(n²) substrings, O(n) to check each → O(n³). Way too slow, and most of that work repeats.",
      "Notice the answer is a **contiguous window**. So maintain a window [l..r] that always has no repeats, and try to make it as wide as possible.",
      "Extend `r` one character at a time. If the new character isn't in the window, great — the window grew. If it **is** a repeat, the window is no longer valid: move `l` forward (dropping characters) until the repeat is gone.",
      "Track which characters are currently in the window (a set, or better, a map of char→last index so you can jump `l` directly). The answer is the largest `r − l + 1` seen.",
    ],
    approaches: [
      {
        name: "Sliding window with a set",
        intuition: "Grow r; on a duplicate, shrink l from the left until the duplicate leaves.",
        time: "O(n)",
        timeWhy: "Each character is added once and removed at most once → 2n moves total.",
        space: "O(min(n, alphabet))",
        spaceWhy: "The set holds at most one of each distinct character in the window.",
        code: `int lengthOfLongestSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int l = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        while (window.contains(s.charAt(r))) {
            window.remove(s.charAt(l));   // shrink from the left
            l++;
        }
        window.add(s.charAt(r));
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
        walkthrough: [
          '"pwwkew": r=p,w window {p,w}; r=w dup → drop p,w → window{}; add w; r=k,e grow {w,k,e}=3; r=w dup shrink; best=3.',
        ],
      },
      {
        name: "Window with last-seen index (fewer moves)",
        intuition: "Remember each character's last index so l can jump past the duplicate instead of stepping.",
        time: "O(n)",
        timeWhy: "Single pass; l only ever moves right.",
        space: "O(min(n, alphabet))",
        spaceWhy: "The map holds the last index of each character.",
        code: `int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int l = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        if (last.containsKey(c) && last.get(c) >= l) l = last.get(c) + 1;
        last.put(c, r);
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
      },
    ],
    edgeCases: [
      "Empty string → 0.",
      "All identical characters → 1.",
      "The `last.get(c) >= l` guard matters: an old occurrence *outside* the current window must not drag l backward.",
    ],
    twists: [
      "**At most K distinct characters** (LeetCode 340) → same window, shrink when distinct count exceeds K.",
      "**Longest repeating character replacement** (LeetCode 424) → window valid while (length − maxFreq) ≤ k.",
      "**Minimum window substring** (LeetCode 76) → grow to cover a target multiset, then shrink to minimal.",
    ],
    related: ["best-time-to-buy-sell-stock"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 20,
    statement:
      "Given a string of just `()[]{}`, return `true` if every bracket is **closed by the matching type in the correct order**.",
    examples: [
      { in: 's = "()[]{}"', out: "true" },
      { in: 's = "(]"', out: "false" },
      { in: 's = "([)]"', out: "false", note: "wrong order" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴"],
    recognize:
      "Nested structure where each closer must match the **most recent** unclosed opener → that 'most recent unfinished thing' is exactly what a **stack** tracks.",
    figureItOut: [
      "Think about what makes a sequence valid: when you hit a closing bracket, it must match the **last opener you haven't closed yet**. 'The last one' is the giveaway for a stack (LIFO).",
      "So scan left to right. Every time you see an opener, **push** it — it's now the pending bracket to match.",
      "When you see a closer, the top of the stack must be its matching opener. If it is, **pop** (that pair is resolved). If it isn't — wrong type, or the stack is empty — it's invalid.",
      "At the end, a valid string has closed everything: the stack must be **empty**. Leftover openers mean unmatched.",
    ],
    approaches: [
      {
        name: "Stack of openers (optimal)",
        intuition: "Push openers; each closer must pop its exact match; finish with an empty stack.",
        time: "O(n)",
        timeWhy: "One pass; each character is pushed/popped at most once.",
        space: "O(n)",
        spaceWhy: "Worst case all openers (e.g. \"((((\") sit on the stack.",
        code: `boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> match = Map.of(')', '(', ']', '[', '}', '{');
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.pop() != match.get(c)) return false;
        }
    }
    return stack.isEmpty();
}`,
        walkthrough: [
          '"([)]": push ( , push [ ; \')\' wants \'(\' but top is \'[\' → mismatch → false.',
        ],
      },
    ],
    edgeCases: [
      "Closer with an empty stack (e.g. \")\") → false (nothing to match).",
      "Leftover openers at the end (e.g. \"(\") → false (stack not empty).",
      "Odd length can never be valid — an optional early bail-out.",
    ],
    twists: [
      "**Longest valid parentheses** (LeetCode 32) → stack of indices, or DP.",
      "**Minimum removals to make valid** (LeetCode 1249) → count unmatched on the fly.",
      "**Generate all valid combinations** (LeetCode 22) → backtracking with open/close counts.",
    ],
    related: ["binary-search"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 704,
    statement:
      "Given a **sorted** array `nums` and a `target`, return its index, or `-1` if it's not present. Must run in O(log n).",
    examples: [
      { in: "nums = [-1,0,3,5,9,12], target = 9", out: "4" },
      { in: "nums = [-1,0,3,5,9,12], target = 2", out: "-1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "nums is sorted ascending, all distinct"],
    recognize:
      "**Sorted array + find a value (or a boundary)** in O(log n) is the literal definition of binary search. More broadly, any monotonic `feasible(x)` check lets you binary-search the answer.",
    figureItOut: [
      "Linear scan is O(n). The constraint says O(log n) — that's the signal to **halve the search space each step**, which sorted data lets you do.",
      "Keep a range [lo, hi] that must contain the answer if it exists. Look at the middle. Three cases: the middle equals target (done); the middle is too small (answer is to the right → `lo = mid + 1`); too big (answer is to the left → `hi = mid - 1`).",
      "Two correctness details that cause most bugs: use `lo + (hi - lo) / 2` for `mid` (avoids integer overflow), and pick a loop condition + updates that always shrink the range so it can't loop forever.",
      "With `while (lo <= hi)` and moving past `mid` each time, the range strictly shrinks; exit means not found → return −1.",
    ],
    approaches: [
      {
        name: "Iterative binary search (optimal)",
        intuition: "Shrink [lo, hi] toward the target by comparing the middle each step.",
        time: "O(log n)",
        timeWhy: "The range halves every iteration → about log₂(n) steps.",
        space: "O(1)",
        spaceWhy: "Iterative — just three indices (a recursive version would use O(log n) stack).",
        code: `int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;     // overflow-safe midpoint
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
        walkthrough: [
          "target 9 in [-1,0,3,5,9,12]: mid=2(3)<9 → lo=3; mid=4(9)==9 → return 4.",
        ],
      },
    ],
    edgeCases: [
      "Target smaller/larger than everything → loop exits, return −1.",
      "Single element → one check.",
      "`(lo+hi)/2` can overflow for huge indices — `lo + (hi-lo)/2` is the safe habit.",
    ],
    twists: [
      "**Find first/last occurrence** (with duplicates) → keep searching one side after a match (lower/upper bound).",
      "**Search in a rotated sorted array** (LeetCode 33) → decide which half is sorted, then narrow.",
      "**Binary search on the answer** (Koko eating bananas, ship within D days) → search the value range with a monotonic feasibility test.",
    ],
    related: ["valid-parentheses"],
  },
];

// NeetCode-150 build-out: problem batches live in lib/dsa/*.js and are merged
// here as they're authored. The `typeof` guards mean an unimported wave simply
// contributes nothing — and they keep the build scripts' import-stripping vm
// path safe (typeof on an undeclared name returns "undefined" without throwing).
export const DSA_PROBLEMS = [
  ...BASE_PROBLEMS,
  ...(typeof WAVE1A !== "undefined" ? WAVE1A : []),
  ...(typeof WAVE1B !== "undefined" ? WAVE1B : []),
  ...(typeof WAVE1C !== "undefined" ? WAVE1C : []),
  ...(typeof WAVE2A !== "undefined" ? WAVE2A : []),
  ...(typeof WAVE2B !== "undefined" ? WAVE2B : []),
  ...(typeof WAVE2C !== "undefined" ? WAVE2C : []),
  ...(typeof WAVE3A !== "undefined" ? WAVE3A : []),
  ...(typeof WAVE3B !== "undefined" ? WAVE3B : []),
  ...(typeof WAVE3C !== "undefined" ? WAVE3C : []),
  ...(typeof WAVE4A !== "undefined" ? WAVE4A : []),
  ...(typeof WAVE4B !== "undefined" ? WAVE4B : []),
  ...(typeof WAVE4C !== "undefined" ? WAVE4C : []),
  ...(typeof WAVE5A !== "undefined" ? WAVE5A : []),
  ...(typeof WAVE5B !== "undefined" ? WAVE5B : []),
  ...(typeof WAVE5C !== "undefined" ? WAVE5C : []),
  ...(typeof WAVE6A !== "undefined" ? WAVE6A : []),
  ...(typeof WAVE6B !== "undefined" ? WAVE6B : []),
  ...(typeof WAVE6C !== "undefined" ? WAVE6C : []),
  ...(typeof WAVE7A !== "undefined" ? WAVE7A : []),
  ...(typeof WAVE7B !== "undefined" ? WAVE7B : []),
  ...(typeof WAVE7C !== "undefined" ? WAVE7C : []),
  ...(typeof WAVE8A !== "undefined" ? WAVE8A : []),
  ...(typeof WAVE8B !== "undefined" ? WAVE8B : []),
  ...(typeof WAVE8C !== "undefined" ? WAVE8C : []),
];

export function problemsByPattern(patternId) {
  return DSA_PROBLEMS.filter((p) => p.pattern === patternId);
}

export const DSA_STATS = {
  patterns: DSA_PATTERNS.length,
  problems: DSA_PROBLEMS.length,
  // The roadmap target — the canonical NeetCode 150, then on toward 250.
  target: 150,
};
