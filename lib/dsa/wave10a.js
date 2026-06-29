// NeetCode All — wave 10a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave9a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE10A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "set-mismatch",
    title: "Set Mismatch",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 645,
    statement:
      "You have a set that should contain the numbers `1..n`, but one number got **duplicated** (replacing another), so one number is now **missing**. Given the corrupted array `nums`, return an array `[duplicate, missing]`.",
    examples: [
      { in: "nums = [1,2,2,4]", out: "[2,3]", explanation: "2 appears twice; 3 is gone" },
      { in: "nums = [1,1]", out: "[1,2]", explanation: "1 is duplicated, 2 is missing" },
      { in: "nums = [3,2,2]", out: "[2,1]", explanation: "2 duplicated, 1 missing" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "1 ≤ nums[i] ≤ n", "exactly one number is duplicated and one missing"],
    recognize:
      "The values are supposed to be exactly `1..n`. 'Which value appears twice, which not at all' over a known dense range → **frequency counting**, and since the range matches the indices you can count in place for O(1) space.",
    figureItOut: [
      "First note the structure: a perfect array would hold each of 1..n exactly once. The corruption swaps one value's single copy for a second copy of another value — so one value has count 2 and one has count 0.",
      "The blunt approach is a frequency array of size n+1. Tally each value; the slot with count 2 is the duplicate, the slot with count 0 is the missing number. One pass to count, one pass to read off the two answers.",
      "To push toward O(1) extra space, exploit that values ARE indices in disguise. Walk the array; for each value v, look at the slot at index |v|-1 and negate it as a 'visited' mark. If that slot is already negative, you reached it twice → v is the duplicate.",
      "After marking, the one slot still positive was never visited — its index+1 is the missing number. The sign bit becomes a free per-index visited flag, so no separate count array is needed.",
      "Both passes are linear and the in-place sign trick uses only the input array → O(n) time, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Frequency array",
        intuition: "Count every value into a size-(n+1) array; the count-2 slot and count-0 slot are the answers.",
        time: "O(n)",
        timeWhy: "One pass to count, one short pass to read results.",
        space: "O(n)",
        spaceWhy: "An auxiliary count array of size n+1.",
        code: `int[] findErrorNums(int[] nums) {
    int n = nums.length;
    int[] count = new int[n + 1];
    for (int v : nums) count[v]++;
    int dup = -1, missing = -1;
    for (int v = 1; v <= n; v++) {
        if (count[v] == 2) dup = v;
        else if (count[v] == 0) missing = v;
    }
    return new int[]{dup, missing};
}`,
      },
      {
        name: "In-place sign marking (optimal)",
        intuition: "Use each value to negate the slot it points at; a slot already negative reveals the duplicate, a still-positive slot reveals the missing.",
        time: "O(n)",
        timeWhy: "Two linear passes over the array.",
        space: "O(1)",
        spaceWhy: "Only the input is mutated; no extra structure (signs restorable if needed).",
        code: `int[] findErrorNums(int[] nums) {
    int dup = -1;
    for (int x : nums) {
        int idx = Math.abs(x) - 1;
        if (nums[idx] < 0) dup = Math.abs(x);
        else nums[idx] = -nums[idx];
    }
    int missing = -1;
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) { missing = i + 1; break; }
    }
    return new int[]{dup, missing};
}`,
        walkthrough: [
          "nums=[1,2,2,4]. x=1 → idx0, mark nums[0] negative. x=2 → idx1, mark negative. x=2 → idx1 already negative → dup=2.",
          "x=4 → idx3, mark negative. Now nums signs: [-,-,+,-] → index2 is positive.",
          "missing = 2+1 = 3 → return [2,3].",
        ],
      },
    ],
    edgeCases: [
      "The duplicate also being value 1 (nums=[1,1]) → marking idx0 twice catches it, missing=2.",
      "Duplicate at the end of the range → still found by the repeated-negation check.",
      "If the caller needs the array unmodified, re-negate the slots afterward to restore originals.",
    ],
    twists: [
      "**Find All Numbers Disappeared in an Array** (in the library) → same sign-marking trick, collect every still-positive index.",
      "**Find the Duplicate Number** (LeetCode 287) → range 1..n with one repeat; Floyd's cycle detection finds it without mutation.",
      "**Sum/square-sum equations** → set up x - y = sum(nums) - sum(1..n) and x² - y² similarly, then solve algebraically.",
    ],
    related: ["find-all-numbers-disappeared-in-an-array", "missing-number"],
  },

  {
    slug: "find-pivot-index",
    title: "Find Pivot Index",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 724,
    statement:
      "Given an integer array `nums`, return the leftmost **pivot index** — the index where the sum of all numbers strictly to its left equals the sum of all numbers strictly to its right. If no such index exists, return `-1`.",
    examples: [
      { in: "nums = [1,7,3,6,5,6]", out: "3", explanation: "left of index 3 is 1+7+3=11; right is 5+6=11" },
      { in: "nums = [1,2,3]", out: "-1", explanation: "no index balances both sides" },
      { in: "nums = [2,1,-1]", out: "0", explanation: "left sum is 0 (empty); right is 1+(-1)=0" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−1000 ≤ nums[i] ≤ 1000"],
    recognize:
      "At each index you need 'sum to the left' versus 'sum to the right'. The total is fixed, so right = total − left − nums[i]. 'Compare a running prefix sum against the remaining suffix' → a **prefix-sum sweep** in one pass.",
    figureItOut: [
      "The naive read is: for each index, add up everything left and everything right and compare — that recomputes overlapping sums, giving O(n²).",
      "Notice the right sum is not independent: total = leftSum + nums[i] + rightSum. So rightSum = total − leftSum − nums[i]. Compute total once, then you only need the running left sum.",
      "Sweep left to right keeping leftSum (sum of elements strictly before i). At index i, if leftSum equals total − leftSum − nums[i], it is a pivot.",
      "Return immediately on the first match to honor 'leftmost'. After testing index i, add nums[i] to leftSum before moving on.",
      "One pass for the total, one pass to test each index → O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Prefix sum sweep (optimal)",
        intuition: "Keep a running left sum; the right sum is total minus left minus the current element.",
        time: "O(n)",
        timeWhy: "One pass for the total, one pass to scan indices.",
        space: "O(1)",
        spaceWhy: "Two integer accumulators.",
        code: `int pivotIndex(int[] nums) {
    int total = 0;
    for (int v : nums) total += v;
    int leftSum = 0;
    for (int i = 0; i < nums.length; i++) {
        int rightSum = total - leftSum - nums[i];
        if (leftSum == rightSum) return i;
        leftSum += nums[i];
    }
    return -1;
}`,
        walkthrough: [
          "nums=[1,7,3,6,5,6], total=28. i=0 left0 right27 no, left=1. i=1 left1 right20 no, left=8.",
          "i=2 left8 right17 no, left=11. i=3 left11 right=28-11-6=11 → match.",
          "Return 3.",
        ],
      },
    ],
    edgeCases: [
      "Pivot at index 0 → left sum is 0 (empty left side); valid if the rest sums to 0.",
      "Pivot at the last index → right sum is 0 (empty right side).",
      "Single element → index 0 always works since both sides are empty (sum 0).",
    ],
    twists: [
      "**Range Sum Query - Immutable** (in the library) → precompute prefix sums to answer many left/right queries fast.",
      "**Return all pivot indices** → drop the early return and collect every match.",
      "**Pivot by equal counts instead of sums** → same sweep, compare counts rather than sums.",
    ],
    related: ["range-sum-query-immutable", "product-of-array-except-self"],
  },

  {
    slug: "isomorphic-strings",
    title: "Isomorphic Strings",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 205,
    statement:
      "Given two strings `s` and `t`, return `true` if they are **isomorphic**. Two strings are isomorphic if the characters of `s` can be replaced to get `t`, with a **consistent one-to-one mapping**: each character maps to exactly one character, and no two characters map to the same one. Order is preserved.",
    examples: [
      { in: 's = "egg", t = "add"', out: "true", explanation: "e→a, g→d (consistent)" },
      { in: 's = "foo", t = "bar"', out: "false", explanation: "o would have to map to both a and r" },
      { in: 's = "badc", t = "baba"', out: "false", explanation: "d and c both map to a — not one-to-one" },
    ],
    constraints: ["1 ≤ s.length ≤ 5·10⁴", "t.length == s.length", "any valid ASCII characters"],
    recognize:
      "A consistent character substitution that is also reversible → a **bijection** between the two alphabets. 'Each char maps to one char AND no two chars share a target' means you must track the mapping in **both directions** with hash maps (or 256-slot arrays).",
    figureItOut: [
      "The first instinct — map s[i] to t[i] as you scan — catches the forward direction, but it misses the trap in 'foo'/'bar' versus 'badc'/'baba'. You need consistency in BOTH directions.",
      "Walk the strings together. Maintain mapST: what each s-char must become, and mapTS: what each t-char must come from. The second map enforces 'no two s-chars collapse onto the same t-char'.",
      "At position i, if s[i] already has a forward mapping, it must equal t[i] — otherwise the substitution is inconsistent, return false. Likewise if t[i] already has a reverse mapping, it must equal s[i].",
      "If neither has been seen, record both directions: mapST[s[i]]=t[i] and mapTS[t[i]]=s[i].",
      "Since characters are ASCII, two fixed 256-slot arrays replace the hash maps for O(1) lookups and O(1) total extra space. One pass → O(n).",
    ],
    approaches: [
      {
        name: "Single forward map (buggy temptation)",
        intuition: "Map each s-char to its t-char; reject on a forward conflict only.",
        time: "O(n)",
        timeWhy: "One pass, but it is INCORRECT — it accepts non-injective maps like 'ab'→'aa'.",
        space: "O(1)",
        spaceWhy: "A single fixed-size map; shown only to expose why one direction is not enough.",
        code: `boolean isIsomorphicWrong(String s, String t) {
    Map<Character, Character> mapST = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        char a = s.charAt(i), b = t.charAt(i);
        if (mapST.containsKey(a)) {
            if (mapST.get(a) != b) return false;
        } else {
            mapST.put(a, b); // misses the case where b is already a target of another char
        }
    }
    return true;
}`,
      },
      {
        name: "Two-direction mapping (optimal)",
        intuition: "Enforce s→t and t→s consistency at every position so the mapping stays a bijection.",
        time: "O(n)",
        timeWhy: "Single pass with O(1) array lookups.",
        space: "O(1)",
        spaceWhy: "Two fixed 256-slot arrays regardless of input length.",
        code: `boolean isIsomorphic(String s, String t) {
    int[] mapST = new int[256];
    int[] mapTS = new int[256];
    Arrays.fill(mapST, -1);
    Arrays.fill(mapTS, -1);
    for (int i = 0; i < s.length(); i++) {
        char a = s.charAt(i), b = t.charAt(i);
        if (mapST[a] == -1 && mapTS[b] == -1) {
            mapST[a] = b;
            mapTS[b] = a;
        } else if (mapST[a] != b || mapTS[b] != a) {
            return false;
        }
    }
    return true;
}`,
        walkthrough: [
          's=\"badc\", t=\"baba\". i=0 b→b set. i=1 a→a set. i=2 d unseen but t-char b already maps from b, not d → mapTS[b]!=d.',
          "That mismatch returns false — d and c cannot both target characters already taken.",
          "For 'egg'/'add': e→a, g→d set once, then g→d rechecked consistently → true.",
        ],
      },
    ],
    edgeCases: [
      "A char mapping to itself (b→b) is fine as long as it stays consistent both ways.",
      "Equal strings → trivially isomorphic (identity bijection).",
      "Different lengths are excluded by the constraints, but a length guard makes the code robust.",
    ],
    twists: [
      "**Word Pattern** (LeetCode 290) → the same bijection check, but between a pattern's letters and whole words.",
      "**Group isomorphic strings** → canonicalize each string to a normalized pattern, then group by that key.",
      "**Case-insensitive or unicode** → widen the arrays to maps keyed by code point.",
    ],
    related: ["valid-anagram", "group-anagrams"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "remove-element",
    title: "Remove Element",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 27,
    statement:
      "Given an integer array `nums` and a value `val`, remove **all occurrences** of `val` in place and return the new length `k`. The first `k` elements of `nums` must hold the kept values (order does not matter); the rest can be anything.",
    examples: [
      { in: "nums = [3,2,2,3], val = 3", out: "2", explanation: "nums becomes [2,2,...]; k=2" },
      { in: "nums = [0,1,2,2,3,0,4,2], val = 2", out: "5", explanation: "kept values: 0,1,3,0,4 in any order" },
    ],
    constraints: ["0 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 50", "0 ≤ val ≤ 100"],
    recognize:
      "'Compact the array in place, keeping only the values that pass a test' → a **slow/fast two-pointer** (read/write) scheme. The write pointer marks the front region of survivors.",
    figureItOut: [
      "Removing elements by shifting the tail on each deletion is O(n²). Instead, separate reading from writing: one pointer reads every element, another writes only the survivors to the front.",
      "Keep a write index `k` starting at 0. Scan with a read index over the whole array. Whenever nums[read] is NOT val, it survives — copy it to nums[k] and advance k.",
      "Values equal to val are simply skipped by the writer, so they get overwritten by later survivors. The first k slots end up holding exactly the kept values.",
      "When 'order does not matter' you can do even less work: swap the unwanted element with the current last element and shrink the boundary — useful when val is rare, since survivors aren't moved.",
      "Either way each element is examined once → O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Slow/fast write pointer (optimal)",
        intuition: "Read every element; copy survivors to a compacting write index k.",
        time: "O(n)",
        timeWhy: "Single pass; each element read once and written at most once.",
        space: "O(1)",
        spaceWhy: "Just the write index.",
        code: `int removeElement(int[] nums, int val) {
    int k = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != val) {
            nums[k] = nums[read];
            k++;
        }
    }
    return k;
}`,
        walkthrough: [
          "nums=[3,2,2,3], val=3. read=0 (3)==val skip. read=1 (2) → nums[0]=2, k=1.",
          "read=2 (2) → nums[1]=2, k=2. read=3 (3)==val skip.",
          "Return k=2; front is [2,2].",
        ],
      },
      {
        name: "Swap with the end (fewer writes)",
        intuition: "When a match is found, swap it with the last unprocessed element and shrink the size.",
        time: "O(n)",
        timeWhy: "Each element is considered once; good when matches are rare.",
        space: "O(1)",
        spaceWhy: "Two indices only.",
        code: `int removeElement(int[] nums, int val) {
    int i = 0, n = nums.length;
    while (i < n) {
        if (nums[i] == val) {
            nums[i] = nums[n - 1];
            n--; // drop the last slot; do NOT advance i (re-check the swapped-in value)
        } else {
            i++;
        }
    }
    return n;
}`,
      },
    ],
    edgeCases: [
      "Empty array → k = 0.",
      "No element equals val → every element copied to itself, k = length.",
      "All elements equal val → k = 0, nothing written.",
    ],
    twists: [
      "**Remove Duplicates from Sorted Array** (in the library) → same write-pointer idea, condition is 'differs from the last kept'.",
      "**Move Zeroes** (in the library) → compact non-zeros forward, then fill the tail with zeros.",
      "**Stable removal preserving order** → use the slow/fast version (the swap version reorders).",
    ],
    related: ["remove-duplicates-from-sorted-array", "move-zeroes"],
  },

  {
    slug: "two-sum-less-than-k",
    title: "Two Sum Less Than K",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 1099,
    statement:
      "Given an array `nums` of integers and an integer `k`, find two distinct indices `i < j` so that `nums[i] + nums[j] < k` and the sum is **as large as possible**. Return that maximum sum, or `-1` if no such pair exists.",
    examples: [
      { in: "nums = [34,23,1,24,75,33,54,8], k = 60", out: "58", explanation: "34 + 24 = 58 < 60, the largest such sum" },
      { in: "nums = [10,20,30], k = 15", out: "-1", explanation: "even 10+20=30 exceeds 15" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "1 ≤ nums[i] ≤ 1000", "1 ≤ k ≤ 2000"],
    recognize:
      "'Largest pair sum still under a threshold' over an array you may reorder → **sort then converge two pointers**. Sorting makes the sum monotonic as the ends move, so one inward sweep finds the best pair.",
    figureItOut: [
      "Brute force checks all O(n²) pairs and keeps the best sum below k. Fine for n=100, but the structure invites something cleaner.",
      "Sort the array. Place l at the start and r at the end. The sum nums[l]+nums[r] is the largest possible for the current l; if it is already ≥ k it is too big, so shrink it by moving r left.",
      "If nums[l]+nums[r] < k, it is a valid candidate — record it if it beats the best so far. Since this is the largest valid sum reachable with this l, advance l rightward to try a bigger small-end.",
      "Each pointer moves inward monotonically, so every step either tightens (r--) or grows (l++) the sum deterministically without missing the optimum — a standard converging two-pointer over sorted data.",
      "Sorting is O(n log n); the sweep is O(n). The answer is the maximum recorded valid sum, or -1 if none was below k.",
    ],
    approaches: [
      {
        name: "Brute force all pairs",
        intuition: "Check every pair, keep the largest sum under k.",
        time: "O(n²)",
        timeWhy: "Every unordered pair is examined.",
        space: "O(1)",
        spaceWhy: "Only the running best.",
        code: `int twoSumLessThanK(int[] nums, int k) {
    int best = -1;
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            int sum = nums[i] + nums[j];
            if (sum < k) best = Math.max(best, sum);
        }
    }
    return best;
}`,
      },
      {
        name: "Sort + converging two pointers (optimal)",
        intuition: "Sort, then move l up on a valid sum and r down on a too-big sum.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort; the two-pointer sweep is linear.",
        space: "O(1)",
        spaceWhy: "Two indices (sort may use its own stack).",
        code: `int twoSumLessThanK(int[] nums, int k) {
    Arrays.sort(nums);
    int l = 0, r = nums.length - 1, best = -1;
    while (l < r) {
        int sum = nums[l] + nums[r];
        if (sum < k) {
            best = Math.max(best, sum);
            l++;                 // this is the biggest sum for this l; try a larger small end
        } else {
            r--;                 // too big; shrink the large end
        }
    }
    return best;
}`,
        walkthrough: [
          "sorted=[1,8,23,24,33,34,54,75], k=60. l=0(1) r=7(75) sum76≥60 r--.",
          "...converge: l reaches 34(idx5), r at 24(idx3) before crossing; along the way 34+24=58<60 → best=58.",
          "No valid sum exceeds 58 → return 58.",
        ],
      },
    ],
    edgeCases: [
      "No pair under k → best stays -1.",
      "Fewer than two elements → loop never runs, returns -1.",
      "Multiple equal values → distinct indices still allowed; the sort handles them naturally.",
    ],
    twists: [
      "**Two Sum II** (in the library) → exact target instead of 'less than'; the same converging pointers nail the equality.",
      "**Count pairs with sum < k** → on a valid sum add (r - l) to the count (all pairs between l and r work), then l++.",
      "**Largest sum ≤ k (inclusive)** → flip the comparison to `<= k`.",
    ],
    related: ["two-sum-ii", "two-sum"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "maximum-number-of-vowels-in-a-substring-of-given-length",
    title: "Maximum Number of Vowels in a Substring of Given Length",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1456,
    statement:
      "Given a string `s` and an integer `k`, return the **maximum number of vowels** (a, e, i, o, u) in any substring of `s` with length exactly `k`.",
    examples: [
      { in: 's = "abciiidef", k = 3', out: "3", explanation: '"iii" has 3 vowels' },
      { in: 's = "aeiou", k = 2', out: "2", explanation: "any length-2 window is all vowels" },
      { in: 's = "leetcode", k = 3', out: "2", explanation: '"eet" has 2 vowels' },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "1 ≤ k ≤ s.length"],
    recognize:
      "A **fixed-size window** of length k sliding across the string, asking for the best count of a property inside → maintain a running vowel count and update it in O(1) as the window advances by one.",
    figureItOut: [
      "Recounting vowels in each of the n−k+1 windows from scratch is O(n·k). The windows overlap heavily, so recomputation is wasteful.",
      "Fix the window size at k. As the window slides one step right, exactly one character enters (the new right edge) and one leaves (the old left edge). The count only changes by those two characters.",
      "Build the first window's vowel count directly over the first k characters. That is the initial best.",
      "Then slide from index k to the end: if s[i] is a vowel, count++; if the character leaving, s[i-k], is a vowel, count--. After each slide, update the best.",
      "Each character enters and leaves the window once → O(n) total, O(1) extra space. Early-exit if the count ever hits k (a window can hold no more vowels than its length).",
    ],
    approaches: [
      {
        name: "Fixed-size sliding window (optimal)",
        intuition: "Count vowels in the first window, then add the entering char and remove the leaving char as it slides.",
        time: "O(n)",
        timeWhy: "Each character is added once and removed once.",
        space: "O(1)",
        spaceWhy: "A running count and the best so far.",
        code: `int maxVowels(String s, int k) {
    int count = 0;
    for (int i = 0; i < k; i++) {
        if (isVowel(s.charAt(i))) count++;
    }
    int best = count;
    for (int i = k; i < s.length(); i++) {
        if (isVowel(s.charAt(i))) count++;
        if (isVowel(s.charAt(i - k))) count--;
        best = Math.max(best, count);
        if (best == k) return k; // cannot beat a full window
    }
    return best;
}

private boolean isVowel(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}`,
        walkthrough: [
          's=\"abciiidef\", k=3. First window \"abc\" → 1 vowel, best=1.',
          "Slide: add c-index chars... window \"iii\" reaches count=3, best=3, equals k → early return 3.",
          "Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "k == s.length → one window; count all vowels.",
      "No vowels anywhere → best stays 0.",
      "All vowels → best equals k (the early exit fires on the first full window).",
    ],
    twists: [
      "**Maximum Average Subarray I** (in the library) → identical fixed window, summing values instead of counting vowels.",
      "**Longest substring with at most k vowels** → variable-size window bounding the vowel count.",
      "**Count windows with exactly k vowels** → keep the slide but tally windows hitting the target.",
    ],
    related: ["maximum-average-subarray-i", "find-all-anagrams-in-a-string"],
  },

  {
    slug: "get-equal-substrings-within-budget",
    title: "Get Equal Substrings Within Budget",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1208,
    statement:
      "You are given strings `s` and `t` of equal length. Changing s[i] to t[i] costs `|s[i] − t[i]|` (ASCII difference). Given a total budget `maxCost`, return the length of the **longest substring** of `s` you can convert to the matching substring of `t` without exceeding the budget.",
    examples: [
      { in: 's = "abcd", t = "bcdf", maxCost = 3', out: "3", explanation: "converting any 3 chars costs 1 each = 3 ≤ 3" },
      { in: 's = "abcd", t = "cdef", maxCost = 3', out: "1", explanation: "each conversion costs 2; only one fits in budget 3" },
      { in: 's = "abcd", t = "acde", maxCost = 0', out: "1", explanation: "only the already-equal position 0 costs 0" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "t.length == s.length", "0 ≤ maxCost ≤ 10⁶"],
    recognize:
      "Convert the problem to a cost array `cost[i] = |s[i]−t[i]|`. Then it is 'longest subarray whose **sum ≤ maxCost**' → a **variable-size sliding window** that shrinks whenever the running cost exceeds the budget.",
    figureItOut: [
      "First reduce the two strings to a single array of per-index costs: cost[i] = |s[i] − t[i]|. Now the strings are irrelevant — it is purely an array question.",
      "The goal becomes the longest contiguous run of costs whose sum stays within maxCost. Sums of non-negative numbers grow as the window widens, which is exactly the monotonic structure a sliding window needs.",
      "Expand a window by moving the right edge and adding cost[r] to a running total. While the total exceeds maxCost, shrink from the left, subtracting cost[l] and advancing l until the window is affordable again.",
      "After each expansion the window [l..r] is the longest affordable window ending at r; record its length (r − l + 1) against the best.",
      "Each index enters and leaves the window at most once → O(n) time, O(1) extra space (compute costs on the fly).",
    ],
    approaches: [
      {
        name: "Variable-size sliding window (optimal)",
        intuition: "Grow the window adding conversion cost; shrink from the left whenever the running cost exceeds the budget.",
        time: "O(n)",
        timeWhy: "Left and right pointers each advance at most n times.",
        space: "O(1)",
        spaceWhy: "A running cost, two pointers, and the best length.",
        code: `int equalSubstring(String s, String t, int maxCost) {
    int l = 0, cost = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        cost += Math.abs(s.charAt(r) - t.charAt(r));
        while (cost > maxCost) {
            cost -= Math.abs(s.charAt(l) - t.charAt(l));
            l++;
        }
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
        walkthrough: [
          's=\"abcd\", t=\"cdef\", maxCost=3. costs all = 2. r=0 cost2 best1. r=1 cost4>3 shrink: subtract2 l=1 cost2; best=max(1,1)=1.',
          "r=2 cost4>3 shrink l=2 cost2 best1. r=3 same pattern → best stays 1.",
          "Return 1.",
        ],
      },
    ],
    edgeCases: [
      "maxCost == 0 → only runs of already-equal characters qualify; longest such run.",
      "Whole string affordable → answer is the full length.",
      "A single character costing more than maxCost → window shrinks to empty there, but other positions may still give length 1.",
    ],
    twists: [
      "**Minimum Size Subarray Sum** (in the library) → same window machinery, optimizing for the shortest window meeting a sum target.",
      "**Longest Subarray of 1's After Deleting One Element** (in the library) → window bounding a count instead of a cost sum.",
      "**Budget that varies per position** → still a sum-bounded window, just a different cost array.",
    ],
    related: ["minimum-size-subarray-sum", "longest-subarray-of-1s-after-deleting-one-element"],
  },

  {
    slug: "grumpy-bookstore-owner",
    title: "Grumpy Bookstore Owner",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1052,
    statement:
      "A bookstore owner has `customers[i]` customers in minute `i`. `grumpy[i]` is 1 if the owner is grumpy that minute (those customers leave unsatisfied) and 0 otherwise (they are satisfied). The owner may use a secret technique to stay **not grumpy for `minutes` consecutive minutes** exactly once. Return the maximum number of satisfied customers.",
    examples: [
      { in: "customers = [1,0,1,2,1,1,7,5], grumpy = [0,1,0,1,0,1,0,1], minutes = 3", out: "16", explanation: "calming minutes 5-7 saves the otherwise-lost 1+7+5" },
      { in: "customers = [1], grumpy = [0], minutes = 1", out: "1" },
    ],
    constraints: ["1 ≤ minutes ≤ customers.length ≤ 2·10⁴", "0 ≤ customers[i] ≤ 1000", "grumpy[i] is 0 or 1"],
    recognize:
      "Customers in non-grumpy minutes are always satisfied (a fixed base). The technique recovers the grumpy-minute customers inside ONE window of length `minutes` → maximize that **recoverable sum over a fixed-size sliding window**, add to the base.",
    figureItOut: [
      "Split the satisfied count into two parts. Part one is guaranteed: every minute where grumpy[i]==0 contributes customers[i] no matter what — sum those into a base.",
      "Part two is the bonus. Applying the technique over a window converts the grumpy minutes inside it to satisfied, recovering exactly the customers that were being lost there: the sum of customers[i] where grumpy[i]==1 within the window.",
      "So the answer is base + (the maximum recoverable sum over any window of length `minutes`). The recoverable value of a minute is customers[i] if grumpy, else 0 (non-grumpy already counted in the base).",
      "Slide a fixed window of length `minutes` over this recoverable array, keeping a running window sum: add the entering minute's recoverable value, subtract the leaving one. Track the maximum window sum.",
      "One pass for the base, one sliding pass for the bonus → O(n) time, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Base + fixed-window max bonus (optimal)",
        intuition: "Always-satisfied customers form a base; slide a window to find the best block of grumpy minutes to rescue.",
        time: "O(n)",
        timeWhy: "Two linear passes (base, then the sliding window).",
        space: "O(1)",
        spaceWhy: "A handful of accumulators.",
        code: `int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
    int base = 0;
    for (int i = 0; i < customers.length; i++) {
        if (grumpy[i] == 0) base += customers[i];
    }
    int windowBonus = 0;
    for (int i = 0; i < minutes; i++) {
        if (grumpy[i] == 1) windowBonus += customers[i];
    }
    int bestBonus = windowBonus;
    for (int i = minutes; i < customers.length; i++) {
        if (grumpy[i] == 1) windowBonus += customers[i];
        if (grumpy[i - minutes] == 1) windowBonus -= customers[i - minutes];
        bestBonus = Math.max(bestBonus, windowBonus);
    }
    return base + bestBonus;
}`,
        walkthrough: [
          "base = sum of non-grumpy minutes = 1+1+1+7 = 10. First window minutes 0-2 grumpy sum = 0(grumpy at idx1, cust0).",
          "Slide; window over minutes 5-7 captures grumpy customers 1(idx5)+5(idx7)=6 → bestBonus=6.",
          "Answer = base 10 + bestBonus 6 = 16.",
        ],
      },
    ],
    edgeCases: [
      "Owner never grumpy → bonus 0, answer is everyone (the base equals total customers).",
      "minutes == n → the single window is the whole array; recover every grumpy minute.",
      "All minutes grumpy → base 0; the best window of length `minutes` carries the whole answer.",
    ],
    twists: [
      "**Maximum Average Subarray I** (in the library) → the same fixed-window sum, divided by length.",
      "**Use the technique on up to k separate windows** → becomes a DP, not a single sliding window.",
      "**Variable technique length** → take the max over windows of several allowed sizes.",
    ],
    related: ["maximum-average-subarray-i", "best-time-to-buy-sell-stock"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "make-the-string-great",
    title: "Make The String Great",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 1544,
    statement:
      "A string is **good** if it has no two adjacent characters that are the same letter in opposite cases (e.g. 'a' next to 'A'). Given `s`, repeatedly remove such adjacent bad pairs until the string is good, and return the result.",
    examples: [
      { in: 's = "leEeetcode"', out: '"leetcode"', explanation: '"eE" cancels → "leetcode"' },
      { in: 's = "abBAcC"', out: '""', explanation: 'bB cancels → "aAcC"; aA cancels → "cC"; cC cancels → ""' },
      { in: 's = "s"', out: '"s"' },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s contains only upper and lower case English letters"],
    recognize:
      "'Cancel the current character against the **most recently kept** one when they are the same letter in opposite case' → a **stack**. Each char either annihilates the top or gets pushed; chained cancellations resolve automatically.",
    figureItOut: [
      "A bad pair is two adjacent chars that are the same letter differing only by case — meaning their ASCII codes differ by exactly 32 (the lower/upper case gap).",
      "Repeatedly rescanning for bad pairs is O(n²), and removals can create NEW adjacencies between previously separated characters. We want a single pass that handles cascades.",
      "The comparison for the current char is always against the character just before it in the result so far — the LAST kept char, i.e. the top of a stack.",
      "Scan left to right. If the stack is non-empty and its top forms a bad pair with the current char (same letter, opposite case → |top − c| == 32), pop the top (both vanish). Otherwise push the current char.",
      "Popping re-exposes the previous kept char, so a freshly created bad adjacency is checked on the very next iteration — no rescanning. A StringBuilder serves as the stack; read it out at the end.",
    ],
    approaches: [
      {
        name: "Stack / StringBuilder (optimal)",
        intuition: "Push each char unless it forms a bad pair with the top, in which case pop instead.",
        time: "O(n)",
        timeWhy: "Each char is pushed once and popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack can hold up to n surviving characters.",
        code: `String makeGood(String s) {
    StringBuilder stack = new StringBuilder();
    for (char c : s.toCharArray()) {
        int len = stack.length();
        if (len > 0 && Math.abs(stack.charAt(len - 1) - c) == 32) {
            stack.deleteCharAt(len - 1); // same letter, opposite case → cancel
        } else {
            stack.append(c);
        }
    }
    return stack.toString();
}`,
        walkthrough: [
          's=\"abBAcC\". a → \"a\". b → \"ab\". B: |b-B|==32 → pop b → \"a\".',
          'A: |a-A|==32 → pop a → \"\". c → \"c\". C: |c-C|==32 → pop → \"\".',
          'Result \"\" (empty).',
        ],
      },
    ],
    edgeCases: [
      "Single character → no pair possible, returned unchanged.",
      "Same letter same case adjacent (e.g. 'aa') is NOT a bad pair — only opposite cases cancel.",
      "Entire string cancels → empty result, like 'abBAcC'.",
    ],
    twists: [
      "**Remove All Adjacent Duplicates In String** (in the library) → cancel on equality instead of opposite case; same stack.",
      "**Removing Stars From a String** (LeetCode 2390) → '*' pops unconditionally; identical machinery.",
      "**Different 'bad pair' rule** → swap the comparison; the cancel-against-the-top pattern is unchanged.",
    ],
    related: ["remove-all-adjacent-duplicates-in-string", "removing-stars-from-a-string"],
  },

  {
    slug: "crawler-log-folder",
    title: "Crawler Log Folder",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 1598,
    statement:
      "You start at the main folder. A log is a list of operations: `'../'` moves to the parent folder (no-op at the main folder), `'./'` stays in place, and `'x/'` moves into a child folder `x`. After performing all operations, return the **minimum number of `'../'` operations** needed to return to the main folder — i.e. your final depth.",
    examples: [
      { in: 'logs = ["d1/","d2/","../","d21/","./"]', out: "2", explanation: "depth: 1,2,1,2,2 → end at depth 2" },
      { in: 'logs = ["d1/","d2/","./","d3/","../","d31/"]', out: "3", explanation: "ends at depth 3" },
      { in: 'logs = ["d1/","../","../","../"]', out: "0", explanation: "cannot go above the main folder" },
    ],
    constraints: ["1 ≤ logs.length ≤ 10³", "operations are valid folder navigation strings"],
    recognize:
      "Navigating a folder tree with parent/child/stay moves is the canonical **stack** model — but you only ever need the **depth** (stack size), not the folder names, so the stack collapses into a single counter.",
    figureItOut: [
      "Think of the folder path as a stack: entering a child pushes a folder, '../' pops one, './' does nothing. The answer is the stack's height at the end, since that many '../' would empty it.",
      "Now notice you never read the folder NAMES on the stack — popping doesn't care which folder you leave. So the entire stack reduces to its size: an integer depth counter.",
      "Scan the logs. On 'x/' (a real folder name), depth++. On '../', go to the parent → depth-- but never below 0 (can't rise above the main folder). On './', do nothing.",
      "Distinguish the three cases by string compare: equal to '../', equal to './', else a child move.",
      "The final depth IS the minimum number of '../' needed to get home. One pass → O(n), O(1) space.",
    ],
    approaches: [
      {
        name: "Depth counter (collapsed stack, optimal)",
        intuition: "Treat depth as the stack height; child pushes, '../' pops (floored at 0), './' is a no-op.",
        time: "O(n)",
        timeWhy: "Single pass over the logs.",
        space: "O(1)",
        spaceWhy: "One integer counter instead of a real stack.",
        code: `int minOperations(String[] logs) {
    int depth = 0;
    for (String op : logs) {
        if (op.equals("../")) {
            if (depth > 0) depth--;   // go to parent, but not above main
        } else if (op.equals("./")) {
            // stay in place — no change
        } else {
            depth++;                  // enter a child folder
        }
    }
    return depth;
}`,
        walkthrough: [
          'logs=["d1/","d2/","../","d21/","./"]. d1/ depth1. d2/ depth2. ../ depth1.',
          "d21/ depth2. ./ depth2 (no change).",
          "Final depth 2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "'../' at the main folder (depth 0) → stays 0, no underflow.",
      "All './' operations → depth never changes, returns 0.",
      "More '../' than child moves → depth floors at 0, never negative.",
    ],
    twists: [
      "**Simplify Path** (in the library) → same stack idea but you must rebuild the canonical path string, so names matter and a real stack is needed.",
      "**Track the deepest folder reached** → keep a max of depth across the scan.",
      "**Disallow leaving main (error on bad '../')** → flag instead of flooring at 0.",
    ],
    related: ["simplify-path", "valid-parentheses"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "guess-number-higher-or-lower",
    title: "Guess Number Higher or Lower",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 374,
    statement:
      "I picked a number from `1` to `n`. You call `guess(num)`, which returns `-1` if your guess is too high, `1` if too low, and `0` if correct. Return the picked number using as few guesses as possible.",
    examples: [
      { in: "n = 10, pick = 6", out: "6", explanation: "guess narrows 1..10 down to 6" },
      { in: "n = 1, pick = 1", out: "1" },
      { in: "n = 2, pick = 1", out: "1" },
    ],
    constraints: ["1 ≤ n ≤ 2³¹ − 1", "1 ≤ pick ≤ n", "guess() returns -1, 1, or 0"],
    recognize:
      "A monotone oracle telling you 'too high / too low / correct' over a sorted range `1..n` is the textbook **binary search**: each guess halves the candidate interval.",
    figureItOut: [
      "Guessing one by one is O(n) calls. But guess() does more than equality — it tells you the DIRECTION of the error, which means the search space is ordered.",
      "Because higher guesses are always 'too high' past the pick and lower guesses 'too low' below it, the predicate is monotonic — the green light for binary search.",
      "Keep a candidate interval [lo, hi] = [1, n]. Guess the midpoint. If guess(mid)==0 you found it. If it returns -1 (mid too high), the pick is below → hi = mid − 1. If 1 (too low), lo = mid + 1.",
      "Compute mid as lo + (hi − lo) / 2 to avoid integer overflow when n is near 2^31 — lo + hi could overflow int.",
      "Each guess discards half the interval, so it terminates in O(log n) calls; the loop is guaranteed to hit the pick since it lies inside [lo, hi].",
    ],
    approaches: [
      {
        name: "Binary search on the answer (optimal)",
        intuition: "Halve the [lo, hi] interval each guess, steered by the oracle's direction.",
        time: "O(log n)",
        timeWhy: "The candidate range halves every guess.",
        space: "O(1)",
        spaceWhy: "Two interval bounds.",
        code: `int guessNumber(int n) {
    int lo = 1, hi = n;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int res = guess(mid);
        if (res == 0) return mid;
        else if (res < 0) hi = mid - 1; // mid too high
        else lo = mid + 1;              // mid too low
    }
    return -1; // unreachable; the pick is always in range
}

// Provided by the platform:
// int guess(int num) { ... returns -1, 1, or 0 ... }`,
        walkthrough: [
          "n=10, pick=6. lo=1,hi=10,mid=5 → guess(5)=1 (too low) → lo=6.",
          "mid=8 → guess(8)=-1 (too high) → hi=7. mid=6 → guess(6)=0 → return 6.",
          "Three guesses for n=10.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → mid=1 found immediately.",
      "Pick at an extreme (1 or n) → still converges; the interval shrinks to that end.",
      "Overflow: lo + (hi − lo)/2 avoids the lo+hi overflow when n is near Integer.MAX_VALUE.",
    ],
    twists: [
      "**Binary Search** (in the library) → identical halving, comparing against array values instead of an oracle.",
      "**First Bad Version** (in the library) → a monotone boolean oracle; find the boundary instead of an exact hit.",
      "**Guess with a cost / minimize worst-case money** → becomes an interval DP, not plain binary search.",
    ],
    related: ["binary-search", "first-bad-version"],
  },

  {
    slug: "find-smallest-letter-greater-than-target",
    title: "Find Smallest Letter Greater Than Target",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 744,
    statement:
      "Given a sorted array of characters `letters` and a target character `target`, return the **smallest character that is strictly greater than `target`**. The letters **wrap around**: if no character is greater than target, return the first character of `letters`.",
    examples: [
      { in: 'letters = ["c","f","j"], target = "a"', out: '"c"', explanation: "c is the smallest letter > a" },
      { in: 'letters = ["c","f","j"], target = "c"', out: '"f"', explanation: "strictly greater, so skip c" },
      { in: 'letters = ["x","x","y","y"], target = "z"', out: '"x"', explanation: "none > z → wrap to first" },
    ],
    constraints: ["2 ≤ letters.length ≤ 10⁴", "letters[i] is a lowercase English letter", "letters is sorted in non-decreasing order"],
    recognize:
      "A sorted array and 'the smallest element strictly greater than target' → this is the **upper bound** binary search: find the first position whose value exceeds target, with a wrap-around fallback.",
    figureItOut: [
      "The array is sorted, so a linear scan for the first letter > target works in O(n) — but sortedness invites O(log n) binary search.",
      "Reframe it as: find the leftmost index whose letter is STRICTLY greater than target. That index, if it exists, holds the answer. This is the classic 'upper bound' boundary search.",
      "Binary-search a window [lo, hi]. At mid, if letters[mid] <= target the answer must be to the right (lo = mid + 1); if letters[mid] > target, mid is a candidate but maybe not the smallest, so look left (hi = mid − 1) while remembering lo converges to the boundary.",
      "When the loop ends, lo is the count of letters <= target, i.e. the index of the first letter > target. If lo equals the array length, every letter was <= target → wrap around and return letters[0].",
      "Otherwise return letters[lo]. The search is O(log n); the wrap is a single modulo or length check.",
    ],
    approaches: [
      {
        name: "Linear scan",
        intuition: "Walk left to right; return the first letter strictly greater than target, else the first letter.",
        time: "O(n)",
        timeWhy: "May scan the whole array.",
        space: "O(1)",
        spaceWhy: "No extra storage.",
        code: `char nextGreatestLetter(char[] letters, char target) {
    for (char c : letters) {
        if (c > target) return c;
    }
    return letters[0]; // wrap around
}`,
      },
      {
        name: "Upper-bound binary search (optimal)",
        intuition: "Find the first index whose letter exceeds target; wrap to index 0 if none does.",
        time: "O(log n)",
        timeWhy: "The candidate range halves each step.",
        space: "O(1)",
        spaceWhy: "Two interval bounds.",
        code: `char nextGreatestLetter(char[] letters, char target) {
    int lo = 0, hi = letters.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (letters[mid] <= target) lo = mid + 1; // answer is to the right
        else hi = mid - 1;                          // mid is a candidate; look left
    }
    return letters[lo % letters.length]; // wrap if lo == length
}`,
        walkthrough: [
          'letters=[c,f,j], target=c. lo=0,hi=2,mid=1 (f) > c → hi=0. mid=0 (c) <= c → lo=1.',
          "lo=1 > hi=0 → stop. lo=1, 1 % 3 = 1 → letters[1] = f.",
          "Return f.",
        ],
      },
    ],
    edgeCases: [
      "Target >= the last letter → lo reaches length → wrap to letters[0].",
      "Duplicates equal to target (e.g. target c with [c,c,f]) → '<= target' skips all of them, landing on the next strictly greater letter.",
      "Target smaller than every letter → lo stays 0, returns the first letter.",
    ],
    twists: [
      "**Search Insert Position** (in the library) → same boundary search but '>=' (lower bound) and no wrap.",
      "**Largest letter strictly less than target** → mirror the comparison (lower bound minus one).",
      "**Count letters <= target** → the lo value the search converges to is exactly that count.",
    ],
    related: ["search-insert-position", "binary-search"],
  },
];
