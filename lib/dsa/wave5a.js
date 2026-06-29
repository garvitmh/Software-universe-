// NeetCode 250 extras — wave 5a (arrays-hashing, two-pointers, sliding-window). Java.
export const WAVE5A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "majority-element",
    title: "Majority Element",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 169,
    statement:
      "Given an array `nums` of size n, return the **majority element** — the value that appears **more than ⌊n/2⌋ times**. You may assume the majority element always exists.",
    examples: [
      { in: "nums = [3,2,3]", out: "3", note: "3 appears twice in 3 elements" },
      { in: "nums = [2,2,1,1,1,2,2]", out: "2", note: "2 appears 4 of 7 times" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 5·10⁴", "−10⁹ ≤ nums[i] ≤ 10⁹", "the majority element always exists"],
    recognize:
      "'Appears **more than half** the time' is the trigger. The naive move is a frequency count (hash map), but the 'strictly more than n/2' guarantee unlocks something better: **Boyer–Moore voting**, which gets the answer in O(1) space.",
    figureItOut: [
      "Dumbest correct idea: count how many times each value appears with a hash map, then return whichever count exceeds n/2. O(n) time, O(n) space. Works — now ask what the 'more than half' guarantee buys us.",
      "If one value occupies more than half the array, then if you **pair up and cancel** every two different values, the majority can never be fully cancelled — there are simply too many of it. The survivor must be the majority.",
      "Turn that into a running tally: keep a `candidate` and a `count`. When count hits 0, adopt the current element as the new candidate. If the next element equals the candidate, count++; otherwise count−− (a cancellation).",
      "Because the majority outnumbers everything else combined, it's the value left standing when the dust settles. One pass, two variables — O(1) space.",
      "If the guarantee were dropped (it might NOT exist), you'd add a second pass to verify the candidate actually exceeds n/2.",
    ],
    approaches: [
      {
        name: "Hash-map frequency count",
        intuition: "Tally every value; return the one whose count passes n/2.",
        time: "O(n)",
        timeWhy: "One pass to count, plus a scan of the map.",
        space: "O(n)",
        spaceWhy: "The map can hold up to n distinct keys.",
        code: `int majorityElement(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();
    int half = nums.length / 2;
    for (int x : nums) {
        int c = count.merge(x, 1, Integer::sum);
        if (c > half) return x;
    }
    return -1;   // unreachable given the guarantee
}`,
      },
      {
        name: "Boyer–Moore voting (optimal)",
        intuition: "Cancel pairs of different values; the majority can't be cancelled away.",
        time: "O(n)",
        timeWhy: "Single pass updating two scalars.",
        space: "O(1)",
        spaceWhy: "Just a candidate and a counter — no extra storage.",
        code: `int majorityElement(int[] nums) {
    int candidate = 0, count = 0;
    for (int x : nums) {
        if (count == 0) candidate = x;        // adopt a new candidate
        count += (x == candidate) ? 1 : -1;   // vote for, or cancel
    }
    return candidate;
}`,
        walkthrough: [
          "[2,2,1,1,1,2,2]: x=2 count0→cand=2 count1; x=2 count2; x=1 count1; x=1 count0; x=1 count0→cand=1 count1; x=2 count0; x=2 count0→cand=2 count1.",
          "Final candidate = 2, which is indeed the majority.",
        ],
      },
    ],
    edgeCases: [
      "Single element → it is trivially the majority.",
      "All elements equal → count only ever grows; candidate is correct.",
      "Without the existence guarantee, the voting result is just a candidate — verify with a second count pass.",
    ],
    twists: [
      "**Majority Element II — values appearing more than ⌊n/3⌋ times** (LeetCode 229) → there can be at most two; run Boyer–Moore with two candidates and two counters, then verify.",
      "**No existence guarantee** → add a confirmation pass that re-counts the candidate.",
      "**Streaming data** → Boyer–Moore is online: it never needs to revisit elements.",
    ],
    related: ["contains-duplicate", "top-k-frequent-elements"],
  },

  {
    slug: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 560,
    statement:
      "Given an integer array `nums` and an integer `k`, return the **total number of contiguous subarrays** whose elements sum to exactly `k`.",
    examples: [
      { in: "nums = [1,1,1], k = 2", out: "2", note: "the two adjacent [1,1] pairs" },
      { in: "nums = [1,2,3], k = 3", out: "2", note: "[1,2] and [3]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2·10⁴", "−1000 ≤ nums[i] ≤ 1000", "−10⁷ ≤ k ≤ 10⁷"],
    recognize:
      "Count of subarrays with a target sum, where values can be **negative** — so a sliding window won't work (the sum isn't monotonic). The trick is a running **prefix sum** plus a **hash map** of prefix-sum frequencies. 'Subarray sum + negatives' ⇒ prefix sums in a map.",
    figureItOut: [
      "Brute force: for every start i, extend a running sum to every end j, and count whenever it equals k. O(n²). Correct — find the redundancy.",
      "Define `prefix[j]` = sum of `nums[0..j]`. The sum of the subarray (i..j] equals `prefix[j] − prefix[i]`. So a subarray ending at j sums to k exactly when some earlier prefix equals `prefix[j] − k`.",
      "Reframed: as you sweep and maintain the running prefix sum, the number of valid subarrays ending here is **how many times the value (prefix − k) has occurred before**. That's a lookup, not a scan.",
      "Keep a hash map of `prefixSum → how many times it has appeared`. Seed it with `{0: 1}` (the empty prefix) so a subarray starting at index 0 is counted. For each element: add to the running sum, add `map.get(sum − k)` to the answer, then record the current sum.",
      "Negatives are exactly why a window fails but prefix sums don't — prefix sums never assume the sum only grows as the window widens.",
    ],
    approaches: [
      {
        name: "Brute force — every subarray",
        intuition: "Try all (start, end) pairs and sum each.",
        time: "O(n²)",
        timeWhy: "n starts, each extended up to n ends with a running sum.",
        space: "O(1)",
        spaceWhy: "Just a running sum and a counter.",
        code: `int subarraySum(int[] nums, int k) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum == k) count++;
        }
    }
    return count;
}`,
      },
      {
        name: "Prefix sum + hash map (optimal)",
        intuition: "Count earlier prefixes equal to (current prefix − k); each marks a subarray ending here.",
        time: "O(n)",
        timeWhy: "One pass; each map get/put is O(1) average.",
        space: "O(n)",
        spaceWhy: "The map can hold up to n distinct prefix sums.",
        code: `int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1);                 // empty prefix, so subarrays from index 0 count
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += seen.getOrDefault(sum - k, 0);   // prefixes that complete a target subarray
        seen.merge(sum, 1, Integer::sum);
    }
    return count;
}`,
        walkthrough: [
          "nums=[1,2,3], k=3. seen={0:1}. x=1 sum1, need 1−3=−2 (0) → count0; seen{0:1,1:1}.",
          "x=2 sum3, need 0 → seen has it once → count1; seen{0:1,1:1,3:1}.",
          "x=3 sum6, need 3 → seen has it once → count2; final answer 2 ([1,2] and [3]).",
        ],
      },
    ],
    edgeCases: [
      "Negative numbers and k ≤ 0 — handled naturally; this is exactly why a window fails here.",
      "The `{0:1}` seed is essential, or subarrays that start at index 0 are missed.",
      "The same prefix sum can recur (e.g. after a +1 then −1) — storing counts, not just presence, is required.",
    ],
    twists: [
      "**Longest subarray summing to k** (LeetCode 325) → store the **first index** of each prefix sum and track max length instead of a count.",
      "**Contiguous array — equal 0s and 1s** (LeetCode 525) → map 0 to −1, then it's 'longest subarray summing to 0'.",
      "**Subarray divisible by k** (LeetCode 974) → key the map on `sum mod k` instead of the raw sum.",
    ],
    related: ["product-of-array-except-self", "two-sum"],
  },

  {
    slug: "concatenation-of-array",
    title: "Concatenation of Array",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1929,
    statement:
      "Given an integer array `nums` of length n, return an array `ans` of length **2n** where `ans = nums + nums` — that is, `ans[i] == nums[i]` and `ans[i + n] == nums[i]` for every i.",
    examples: [
      { in: "nums = [1,2,1]", out: "[1,2,1,1,2,1]" },
      { in: "nums = [1,3,2,1]", out: "[1,3,2,1,1,3,2,1]" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 1000", "1 ≤ nums[i] ≤ 1000"],
    recognize:
      "Pure array-construction warmup: just lay the input down twice. No data structure or cleverness — the only thing to get right is the **index arithmetic** that maps a destination slot back to its source.",
    figureItOut: [
      "Read the spec literally: the result has 2n slots, the first n are `nums`, the next n are `nums` again. So you're copying the array end-to-end with itself.",
      "Decide how to place each value. The cleanest mental model is a single loop over the source: element i goes to position `i` and to position `i + n`.",
      "Allocate the answer up front at size `2 * nums.length` — you know the exact size, so there's no reason to grow it dynamically.",
      "That's one pass writing two slots each → O(n) time. The output array itself is the only space, which is unavoidable since you must return 2n values.",
    ],
    approaches: [
      {
        name: "Single pass, write both halves",
        intuition: "For each source index i, place its value at i and at i + n.",
        time: "O(n)",
        timeWhy: "One loop over n elements doing constant work each.",
        space: "O(n)",
        spaceWhy: "The 2n output array; required by the problem, no other extra space.",
        code: `int[] getConcatenation(int[] nums) {
    int n = nums.length;
    int[] ans = new int[2 * n];
    for (int i = 0; i < n; i++) {
        ans[i] = nums[i];
        ans[i + n] = nums[i];
    }
    return ans;
}`,
        walkthrough: [
          "nums=[1,2,1], n=3, ans=[_,_,_,_,_,_].",
          "i=0 → ans[0]=1, ans[3]=1; i=1 → ans[1]=2, ans[4]=2; i=2 → ans[2]=1, ans[5]=1.",
          "ans = [1,2,1,1,2,1].",
        ],
      },
    ],
    edgeCases: [
      "Single element [x] → [x, x].",
      "Off-by-one in the `i + n` index is the only real trap — it must be the offset, not `i + 1`.",
      "Allocate `2 * n`, not `n`, or you'll overflow the destination.",
    ],
    twists: [
      "**Concatenate k times** → loop the inner placement k times (or write `ans[i + j*n]`).",
      "**In a language without sized arrays** → `System.arraycopy(nums, 0, ans, n, n)` after copying the first half is a tidy alternative.",
      "**Cyclic / rotated views** → many problems simulate `nums + nums` implicitly using `i % n` instead of materializing it.",
    ],
    related: ["product-of-array-except-self", "pascals-triangle"],
  },

  {
    slug: "pascals-triangle",
    title: "Pascal's Triangle",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 118,
    statement:
      "Given an integer `numRows`, return the first `numRows` rows of **Pascal's triangle**. Each number is the sum of the two numbers directly above it; the edges are always 1.",
    examples: [
      { in: "numRows = 5", out: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]" },
      { in: "numRows = 1", out: "[[1]]" },
    ],
    constraints: ["1 ≤ numRows ≤ 30"],
    recognize:
      "A **build-from-previous-state** construction: each row is derived entirely from the row above it. The recognition is 'row i depends only on row i−1' → build iteratively, reusing the last row you made.",
    figureItOut: [
      "Look at the structure: row r has r+1 entries. The first and last are always 1. Every interior entry at column c equals `prev[c-1] + prev[c]` — the two values diagonally above it.",
      "You could compute each entry with the binomial-coefficient formula C(r, c), but that invites overflow and redundant factorial work. The additive definition is simpler and exact.",
      "So build the triangle one row at a time. Keep the row you just produced; to make the next row, start with a 1, fill the middle from adjacent pairs of the previous row, then end with a 1.",
      "Each new row reads only from the immediately previous row — classic iterative DP where the 'table' is just the triangle you're assembling.",
      "Total work is the number of entries: 1 + 2 + ... + numRows ≈ numRows² / 2, so O(numRows²).",
    ],
    approaches: [
      {
        name: "Build each row from the previous (optimal)",
        intuition: "Edges are 1; interior entry = sum of the two values above it in the prior row.",
        time: "O(numRows²)",
        timeWhy: "You fill every cell of a triangle with ~numRows²/2 cells.",
        space: "O(numRows²)",
        spaceWhy: "The output holds every cell; only the previous row is needed as working state.",
        code: `List<List<Integer>> generate(int numRows) {
    List<List<Integer>> triangle = new ArrayList<>();
    for (int r = 0; r < numRows; r++) {
        List<Integer> row = new ArrayList<>();
        for (int c = 0; c <= r; c++) {
            if (c == 0 || c == r) {
                row.add(1);                       // the edges
            } else {
                List<Integer> prev = triangle.get(r - 1);
                row.add(prev.get(c - 1) + prev.get(c));  // two above
            }
        }
        triangle.add(row);
    }
    return triangle;
}`,
        walkthrough: [
          "r=0 → [1]; r=1 → edges only → [1,1].",
          "r=2 → 1, then prev[0]+prev[1]=1+1=2, then 1 → [1,2,1].",
          "r=3 → 1, 1+2=3, 2+1=3, 1 → [1,3,3,1].",
        ],
      },
    ],
    edgeCases: [
      "numRows = 1 → just [[1]].",
      "The first row has no previous row — the edge case `c == 0 || c == r` covers it before any lookup.",
      "Values stay small (numRows ≤ 30), so int never overflows here.",
    ],
    twists: [
      "**Pascal's Triangle II — return only row k** (LeetCode 119) → keep a single array and update it right-to-left in place for O(k) space.",
      "**Compute one entry C(r, c)** → use the multiplicative formula iteratively to avoid big factorials.",
      "**Triangle of sums modulo p** → take each addition mod p as you go.",
    ],
    related: ["concatenation-of-array"],
  },

  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 14,
    statement:
      "Write a function to find the **longest common prefix** string amongst an array of strings `strs`. If there is no common prefix, return the empty string `\"\"`.",
    examples: [
      { in: 'strs = ["flower","flow","flight"]', out: '"fl"' },
      { in: 'strs = ["dog","racecar","car"]', out: '""', note: "no common prefix" },
    ],
    constraints: ["1 ≤ strs.length ≤ 200", "0 ≤ strs[i].length ≤ 200", "lowercase English letters"],
    recognize:
      "You're comparing many strings **character by character at the same position**, stopping at the first disagreement. There's no fancy structure — the skill is choosing a comparison order that bails out as early as possible.",
    figureItOut: [
      "What is a common prefix? A string that every input starts with. So at position 0, every string must share the same character; at position 1, the same; and so on — until one string runs out or one character disagrees.",
      "Vertical scanning falls right out of that: walk column by column. Take the character at position c from the first string, then check every other string has the same character at c. The first mismatch (or end-of-string) is where the common prefix ends.",
      "This is efficient because it **stops at the first column that breaks** — you never read past the answer's length in any string.",
      "An alternate framing: the common prefix of the whole array is the running common prefix folded across the strings (`prefix = lcp(prefix, strs[i])`), shrinking the candidate as you go. Same O(S) total characters either way.",
      "Total work is bounded by the sum of characters you actually compare — at most the prefix length times the number of strings.",
    ],
    approaches: [
      {
        name: "Vertical scanning (optimal)",
        intuition: "Compare the same column across all strings; stop at the first mismatch or shortest end.",
        time: "O(S)",
        timeWhy: "S = total characters compared; bounded by (prefix length × number of strings).",
        space: "O(1)",
        spaceWhy: "Only indices; the answer is a substring of the first string.",
        code: `String longestCommonPrefix(String[] strs) {
    if (strs.length == 0) return "";
    for (int c = 0; c < strs[0].length(); c++) {
        char ch = strs[0].charAt(c);
        for (int i = 1; i < strs.length; i++) {
            if (c == strs[i].length() || strs[i].charAt(c) != ch) {
                return strs[0].substring(0, c);   // prefix ends here
            }
        }
    }
    return strs[0];   // the whole first string is a prefix of all
}`,
        walkthrough: [
          'strs=["flower","flow","flight"]. c=0 \'f\' in all; c=1 \'l\' in all.',
          'c=2: strs[0]=\'o\', but strs[2]("flight")=\'i\' → mismatch → return strs[0].substring(0,2) = "fl".',
        ],
      },
      {
        name: "Fold the prefix across strings",
        intuition: "Start with the first string as the candidate prefix; trim it against each next string.",
        time: "O(S)",
        timeWhy: "Each shrink compares at most the current prefix length; total bounded by S.",
        space: "O(1)",
        spaceWhy: "A single shrinking prefix reference.",
        code: `String longestCommonPrefix(String[] strs) {
    String prefix = strs[0];
    for (int i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(prefix) != 0) {       // not a prefix of strs[i]
            prefix = prefix.substring(0, prefix.length() - 1);
            if (prefix.isEmpty()) return "";
        }
    }
    return prefix;
}`,
      },
    ],
    edgeCases: [
      "Single string → the whole string is the prefix.",
      "An empty string present → the common prefix is immediately \"\".",
      "One string is a prefix of the others (e.g. \"flow\" vs \"flower\") → the `c == strs[i].length()` check stops cleanly.",
    ],
    twists: [
      "**Many prefix queries over a fixed word set** → build a **trie**; the LCP is the path until it branches.",
      "**Binary search on prefix length** → check whether a prefix of length m is shared, narrowing m — O(S log m).",
      "**Longest common *suffix*** → reverse every string and reuse the same routine.",
    ],
    related: ["group-anagrams", "valid-anagram"],
  },

  {
    slug: "find-all-numbers-disappeared-in-an-array",
    title: "Find All Numbers Disappeared in an Array",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 448,
    statement:
      "Given an array `nums` of n integers where each `nums[i]` is in the range `[1, n]`, return all the integers in `[1, n]` that **do not appear** in `nums`.",
    examples: [
      { in: "nums = [4,3,2,7,8,2,3,1]", out: "[5,6]", note: "n=8; 5 and 6 are missing" },
      { in: "nums = [1,1]", out: "[2]" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 10⁵", "1 ≤ nums[i] ≤ n"],
    recognize:
      "The values are confined to `[1, n]` — the **same range as the indices**. That 'values fit the index space' fact is the cue you can use the array itself as a hash table and reach **O(1) extra space** via index-marking.",
    figureItOut: [
      "Easy version: drop every value into a hash set, then check 1..n and collect whatever's absent. O(n) time, O(n) space. Correct — but the constraints hint we can do better on space.",
      "Key observation: values are in `[1, n]`, exactly the index range. So a value v can mark 'I exist' at slot `v − 1`. We can store the 'seen' flags **inside nums itself** instead of a separate set.",
      "Marking trick: for each value v, go to index `|v| − 1` and **negate** the number there (use abs because it may already be marked). A negative at index i means 'the value i+1 was seen'.",
      "After one marking pass, scan again: any index i still holding a **positive** number was never visited → the value `i + 1` never appeared → it's missing.",
      "Use `abs(v)` when reading v during marking, since earlier marks may have flipped its sign. This gives O(n) time and O(1) extra space (the output list aside).",
    ],
    approaches: [
      {
        name: "Hash set of present values",
        intuition: "Record everything seen, then report which of 1..n is absent.",
        time: "O(n)",
        timeWhy: "One pass to fill the set, one pass over 1..n.",
        space: "O(n)",
        spaceWhy: "The set can hold up to n values.",
        code: `List<Integer> findDisappearedNumbers(int[] nums) {
    Set<Integer> present = new HashSet<>();
    for (int x : nums) present.add(x);
    List<Integer> res = new ArrayList<>();
    for (int v = 1; v <= nums.length; v++) {
        if (!present.contains(v)) res.add(v);
    }
    return res;
}`,
      },
      {
        name: "Index-marking in place (optimal space)",
        intuition: "Negate the slot each value points to; positive slots reveal the missing values.",
        time: "O(n)",
        timeWhy: "Two passes over the array, constant work each element.",
        space: "O(1)",
        spaceWhy: "Marks live inside nums; only the output list is extra (and it's required).",
        code: `List<Integer> findDisappearedNumbers(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;       // slot this value points to
        if (nums[idx] > 0) nums[idx] = -nums[idx];   // mark seen
    }
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) res.add(i + 1);       // never marked → value i+1 missing
    }
    return res;
}`,
        walkthrough: [
          "nums=[4,3,2,7,8,2,3,1]. Marking: value 4→idx3 negate; 3→idx2; 2→idx1; 7→idx6; 8→idx7; 2→idx1 already negative (abs)...; 3→idx2; 1→idx0.",
          "After marking, indices 4 and 5 stay positive → missing values are 5 and 6.",
        ],
      },
    ],
    edgeCases: [
      "All numbers present (a permutation of 1..n) → empty result.",
      "Duplicates point repeatedly to the same slot — using `abs` and only negating positives keeps marks correct.",
      "If mutating the input is not allowed, fall back to the hash-set version.",
    ],
    twists: [
      "**Find the single duplicate (values 1..n)** (LeetCode 287) → use Floyd's cycle detection, or the same index-marking to spot an already-negative slot.",
      "**Find all duplicates** (LeetCode 442) → the value whose slot is *already* negative is a duplicate.",
      "**Find the missing number with 0..n** (LeetCode 268) → XOR all indices and values, or sum-difference.",
    ],
    related: ["contains-duplicate", "majority-element"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 283,
    statement:
      "Given an integer array `nums`, move all `0`s to the **end** while keeping the relative order of the non-zero elements. Do it **in place** without making a copy.",
    examples: [
      { in: "nums = [0,1,0,3,12]", out: "[1,3,12,0,0]" },
      { in: "nums = [0]", out: "[0]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−2³¹ ≤ nums[i] ≤ 2³¹ − 1"],
    recognize:
      "In-place partitioning that preserves order → a **slow/fast two-pointer** pattern. One pointer marks where the next non-zero belongs; the other scans ahead finding them. 'Compact in place, keep order' is the signature.",
    figureItOut: [
      "Easy mental model: collect the non-zeros, then pad with zeros. But 'in place, no copy' rules out a second array — so do it with pointers inside `nums`.",
      "Use a `write` pointer that always points at the next slot where a non-zero should land (it starts at 0). Use a `read` pointer scanning the whole array.",
      "Whenever `read` finds a non-zero, copy it to `write` and advance `write`. Non-zeros land left-to-right, so their relative order is preserved automatically.",
      "After the scan, everything from `write` to the end must become 0 — fill those slots. (Or, slicker: **swap** the non-zero into `write` as you go, which both places non-zeros and pushes zeros rightward in one pass, no fill needed.)",
      "Each element is touched once → O(n) time, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Write non-zeros, then zero-fill",
        intuition: "Compact non-zeros to the front with a write pointer; pad the rest with zeros.",
        time: "O(n)",
        timeWhy: "One compaction pass plus one fill pass — both linear.",
        space: "O(1)",
        spaceWhy: "Two index pointers; the array is modified in place.",
        code: `void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) nums[write++] = nums[read];
    }
    while (write < nums.length) nums[write++] = 0;   // pad zeros
}`,
      },
      {
        name: "Swap as you go (single pass)",
        intuition: "When read finds a non-zero, swap it into the write slot — zeros bubble right.",
        time: "O(n)",
        timeWhy: "One pass; each element swapped at most once.",
        space: "O(1)",
        spaceWhy: "In-place swaps, just two pointers.",
        code: `void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            int tmp = nums[write];
            nums[write] = nums[read];
            nums[read] = tmp;
            write++;
        }
    }
}`,
        walkthrough: [
          "[0,1,0,3,12]: read0=0 skip; read1=1 swap with write0 → [1,0,0,3,12] write=1.",
          "read2=0 skip; read3=3 swap with write1 → [1,3,0,0,12] write=2; read4=12 swap with write2 → [1,3,12,0,0].",
        ],
      },
    ],
    edgeCases: [
      "No zeros → swaps are with themselves; order unchanged.",
      "All zeros → write never advances; array stays all zeros.",
      "Single element → nothing to move.",
    ],
    twists: [
      "**Move all a specific value to the end** → same pattern, compare against that value instead of 0.",
      "**Remove Element in place** (LeetCode 27) → identical write-pointer compaction, return the new length.",
      "**Stable partition by a predicate** → generalize 'is non-zero' to any keep-condition.",
    ],
    related: ["remove-duplicates-from-sorted-array", "sort-colors"],
  },

  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 26,
    statement:
      "Given a **sorted** array `nums`, remove the duplicates **in place** so each unique value appears once, keeping their order. Return `k`, the number of unique elements; the first `k` slots of `nums` must hold them.",
    examples: [
      { in: "nums = [1,1,2]", out: "2", note: "nums becomes [1,2,_]" },
      { in: "nums = [0,0,1,1,1,2,2,3,3,4]", out: "5", note: "nums becomes [0,1,2,3,4,...]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 3·10⁴", "−100 ≤ nums[i] ≤ 100", "nums is sorted ascending"],
    recognize:
      "In-place dedup on **sorted** data → the slow/fast two-pointer compaction. Because it's sorted, duplicates are **adjacent**, so a new unique is simply 'different from the last one I kept'. 'Sorted + remove dups in place' is the tell.",
    figureItOut: [
      "Because the array is sorted, every run of equal values is **contiguous**. So a value is a fresh unique exactly when it differs from the value immediately before it.",
      "Keep a `write` pointer at the position of the last unique value kept (start at index 0 — the first element is always unique). Scan with `read` from index 1.",
      "When `nums[read]` differs from `nums[write]`, it's a new unique: advance `write` and copy it there. When it equals `nums[write]`, it's a duplicate — skip it.",
      "At the end, `write` is the index of the last unique, so the count of uniques is `write + 1`. The first that-many slots hold the deduped values; the rest are leftover junk we're allowed to ignore.",
      "One pass, O(n) time, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Slow/fast two pointers (optimal)",
        intuition: "Keep a write pointer at the last unique; copy forward only when read sees a new value.",
        time: "O(n)",
        timeWhy: "Single scan; each element compared once.",
        space: "O(1)",
        spaceWhy: "Two indices; the array is edited in place.",
        code: `int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 0;                       // last unique kept
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[write]) {
            write++;
            nums[write] = nums[read];    // place the new unique
        }
    }
    return write + 1;                    // count = index of last unique + 1
}`,
        walkthrough: [
          "[0,0,1,1,1,2,2,3,3,4]: write=0(0). read=1 (0==0) skip... read=2 (1≠0) write1 nums[1]=1.",
          "read=5 (2≠1) write2 nums[2]=2; ... ends write=4 → return 5; front = [0,1,2,3,4].",
        ],
      },
    ],
    edgeCases: [
      "Empty array → return 0 (the guard).",
      "All identical → write never advances → return 1.",
      "Already all unique → every element copies onto itself → return n.",
    ],
    twists: [
      "**Allow each value at most twice** (LeetCode 80) → compare against `nums[write - 1]` instead, permitting one repeat.",
      "**Remove a specific value** (LeetCode 27) → same compaction but the keep-test is `!= val`.",
      "**Unsorted input** → sort first (O(n log n)) or use a hash set if order needn't be preserved in place.",
    ],
    related: ["move-zeroes", "two-sum-ii"],
  },

  {
    slug: "is-subsequence",
    title: "Is Subsequence",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 392,
    statement:
      "Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t` — i.e. `s` can be formed by deleting some (possibly zero) characters of `t` **without reordering** the rest.",
    examples: [
      { in: 's = "abc", t = "ahbgdc"', out: "true" },
      { in: 's = "axc", t = "ahbgdc"', out: "false" },
    ],
    constraints: ["0 ≤ s.length ≤ 100", "0 ≤ t.length ≤ 10⁴", "lowercase English letters"],
    recognize:
      "Matching one sequence inside another **in order** → two pointers, one per string, both moving forward (never backward). 'Subsequence / in-order match' is the cue, distinct from substring (which is contiguous).",
    figureItOut: [
      "Subsequence means: can I find every character of `s`, in order, somewhere in `t`? The characters needn't be adjacent in `t`, just in the same left-to-right order.",
      "Greedy insight: to match `s`, always grab the **earliest** matching character in `t`. Pairing each `s` character with its first available occurrence never hurts — leaving more of `t` for later characters can only help.",
      "Two pointers: `i` over `s`, `j` over `t`. Walk `j` through `t`; whenever `t[j]` equals `s[i]`, that character of `s` is matched, so advance `i`. Always advance `j`.",
      "If `i` reaches the end of `s`, every character matched in order → true. If `j` exhausts `t` first, some character of `s` couldn't be placed → false.",
      "Each pointer moves forward only → O(|t|) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Two pointers, greedy match (optimal)",
        intuition: "Scan t; each time it matches the current char of s, advance s. s exhausted ⇒ true.",
        time: "O(|t|)",
        timeWhy: "j sweeps t once; i only advances on matches.",
        space: "O(1)",
        spaceWhy: "Two index variables.",
        code: `boolean isSubsequence(String s, String t) {
    int i = 0, j = 0;
    while (i < s.length() && j < t.length()) {
        if (s.charAt(i) == t.charAt(j)) i++;   // matched this char of s
        j++;                                    // always advance through t
    }
    return i == s.length();                     // all of s matched
}`,
        walkthrough: [
          's="abc", t="ahbgdc". match \'a\'(i→1); \'h\' no; \'b\'(i→2); \'g\',\'d\' no; \'c\'(i→3).',
          "i reached s.length() → true.",
        ],
      },
    ],
    edgeCases: [
      "Empty s → vacuously a subsequence of anything → true.",
      "s longer than t → can never match all of s → false.",
      "Repeated characters in s (e.g. \"aa\") need two distinct positions in t.",
    ],
    twists: [
      "**Many s queries against one fixed t** → precompute, for each position in t and each letter, the next occurrence — then each query is O(|s|) without rescanning t.",
      "**Longest subsequence common to both** → that's LCS, a 2-D DP (different problem entirely).",
      "**Number of distinct subsequences of t equal to s** (LeetCode 115) → DP counting, not a single greedy pass.",
    ],
    related: ["valid-palindrome", "remove-duplicates-from-sorted-array"],
  },

  {
    slug: "sort-colors",
    title: "Sort Colors",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 75,
    statement:
      "Given an array `nums` with values `0`, `1`, and `2` (representing red, white, blue), sort them **in place** so all 0s come first, then 1s, then 2s. Solve it in **one pass** with O(1) extra space (no library sort, no counting-then-rewriting).",
    examples: [
      { in: "nums = [2,0,2,1,1,0]", out: "[0,0,1,1,2,2]" },
      { in: "nums = [2,0,1]", out: "[0,1,2]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 300", "nums[i] is 0, 1, or 2"],
    recognize:
      "Partition into **three** groups in one in-place pass — the **Dutch National Flag** problem. Three pointers (low, mid, high) carve the array into <pivot / ==pivot / >pivot regions. 'Sort 0/1/2 in one pass' is the canonical trigger.",
    figureItOut: [
      "The lazy version is counting sort: tally how many 0s, 1s, 2s, then overwrite the array. That's two passes; the challenge asks for one pass, so we need to place each value correctly the first time we look at it.",
      "Maintain three regions with three pointers: `low` is the boundary where the next 0 goes, `high` is the boundary where the next 2 goes, and `mid` is the current element under inspection. Everything left of `low` is 0; everything right of `high` is 2; between `low` and `mid` is settled 1s.",
      "Inspect `nums[mid]`. If it's **0**, swap it down to `low`, advance both `low` and `mid` (the swapped-in value is already processed). If it's **1**, it's in place — just advance `mid`.",
      "If it's **2**, swap it up to `high` and shrink `high`, but do **not** advance `mid` — the value swapped in from `high` is unexamined and must be inspected next.",
      "Continue while `mid <= high`. Three pointers, one pass, O(1) space — each element is placed into its final region exactly once.",
    ],
    approaches: [
      {
        name: "Counting sort (two pass)",
        intuition: "Count 0s/1s/2s, then rewrite the array in order.",
        time: "O(n)",
        timeWhy: "One counting pass plus one writing pass.",
        space: "O(1)",
        spaceWhy: "Three counters; rewrite is in place — but it scans twice.",
        code: `void sortColors(int[] nums) {
    int[] count = new int[3];
    for (int x : nums) count[x]++;
    int i = 0;
    for (int v = 0; v < 3; v++)
        while (count[v]-- > 0) nums[i++] = v;
}`,
      },
      {
        name: "Dutch National Flag — one pass (optimal)",
        intuition: "low/mid/high pointers partition into <1 / ==1 / >1 as mid scans once.",
        time: "O(n)",
        timeWhy: "mid (or high) advances every step; each element handled once.",
        space: "O(1)",
        spaceWhy: "Three index pointers, swaps in place.",
        code: `void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low++, mid++);     // send 0 to the front
        } else if (nums[mid] == 1) {
            mid++;                        // 1 is already in place
        } else {
            swap(nums, mid, high--);      // send 2 to the back; re-check mid
        }
    }
}

void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}`,
        walkthrough: [
          "[2,0,2,1,1,0]: mid=2 swap with high(0) → [0,0,2,1,1,2] high=4 (mid stays).",
          "mid=0 swap low → [0,0,2,1,1,2] low1 mid1; mid=0 swap low → low2 mid2; mid=2 swap high(1) → [0,0,1,1,2,2] high3; mid=1,1 advance; done.",
        ],
      },
    ],
    edgeCases: [
      "All one color → pointers sweep without meaningful swaps.",
      "Not advancing `mid` after a 2-swap is the classic bug — the incoming value is unexamined.",
      "Single element → loop runs once and stops.",
    ],
    twists: [
      "**Only two colors (0/1)** → it collapses to a single low/high partition, like quicksort's Lomuto step.",
      "**k colors / general partition** → counting sort, or repeated three-way partition.",
      "**Quicksort with many duplicate keys** → three-way partitioning (this exact idea) avoids the O(n²) blowup.",
    ],
    related: ["move-zeroes", "3sum"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 209,
    statement:
      "Given an array of **positive** integers `nums` and a positive integer `target`, return the **minimal length** of a contiguous subarray whose sum is **≥ target**. If no such subarray exists, return 0.",
    examples: [
      { in: "target = 7, nums = [2,3,1,2,4,3]", out: "2", note: "[4,3] has sum 7" },
      { in: "target = 4, nums = [1,4,4]", out: "1", note: "[4]" },
      { in: "target = 11, nums = [1,1,1,1,1,1,1,1]", out: "0", note: "total < target" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁴", "1 ≤ target ≤ 10⁹"],
    recognize:
      "'**Shortest** contiguous subarray with sum ≥ target', all values **positive** → a **variable-size sliding window**. Positivity is what makes it valid: growing the window only increases the sum, so shrinking is safe and monotonic. 'Shortest range with a sum threshold' is the cue.",
    figureItOut: [
      "Brute force: try every start, extend until the sum reaches target, record the length. O(n²). Correct — and the wasted work is re-summing overlapping ranges.",
      "Because all numbers are positive, the running sum **grows as the window widens and shrinks as it narrows** — monotonic. That's exactly the property a sliding window needs.",
      "Grow the right edge, adding `nums[r]` to a running sum. The moment the sum is **≥ target**, you have a valid window — but maybe not the shortest.",
      "So while it's still valid, **shrink from the left**: subtract `nums[l]`, advance `l`, and record the length each time you're at the boundary of validity. This finds the smallest valid window ending at each r.",
      "Every index enters the window once (via r) and leaves once (via l) → O(n) total, O(1) space. If no window ever reaches target, return 0.",
    ],
    approaches: [
      {
        name: "Brute force — every start",
        intuition: "From each start, extend until the sum hits target; track the min length.",
        time: "O(n²)",
        timeWhy: "n starts, each extended up to n.",
        space: "O(1)",
        spaceWhy: "A running sum and a best length.",
        code: `int minSubArrayLen(int target, int[] nums) {
    int best = Integer.MAX_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum >= target) { best = Math.min(best, j - i + 1); break; }
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
      },
      {
        name: "Variable sliding window (optimal)",
        intuition: "Grow right to reach target, then shrink left as far as it stays valid.",
        time: "O(n)",
        timeWhy: "Each index is added once and removed once → 2n moves.",
        space: "O(1)",
        spaceWhy: "Two pointers, a running sum, a best length.",
        code: `int minSubArrayLen(int target, int[] nums) {
    int l = 0, sum = 0, best = Integer.MAX_VALUE;
    for (int r = 0; r < nums.length; r++) {
        sum += nums[r];
        while (sum >= target) {                  // window valid → try to shrink
            best = Math.min(best, r - l + 1);
            sum -= nums[l];
            l++;
        }
    }
    return best == Integer.MAX_VALUE ? 0 : best;
}`,
        walkthrough: [
          "target=7, [2,3,1,2,4,3]: grow to [2,3,1,2] sum8≥7 → record 4, shrink to [3,1,2] sum6.",
          "add 4 → [3,1,2,4] sum10 → record then shrink to [2,4] sum6; add 3 → [2,4,3] sum9 → record, shrink to [4,3] sum7 → record length 2 (best).",
        ],
      },
    ],
    edgeCases: [
      "Total sum < target → no valid window → return 0.",
      "A single element ≥ target → answer is 1.",
      "Positivity is essential — with negatives, shrinking could wrongly discard a needed element (use prefix sums + a deque instead).",
    ],
    twists: [
      "**Negatives allowed** → the window breaks; use prefix sums with a monotonic deque (LeetCode 862).",
      "**Shortest subarray with sum exactly k** → prefix sums + hash map (sliding window no longer applies).",
      "**Longest subarray with sum ≤ target** → same window, flip which side you shrink and what you track.",
    ],
    related: ["maximum-average-subarray-i", "subarray-sum-equals-k"],
  },

  {
    slug: "maximum-average-subarray-i",
    title: "Maximum Average Subarray I",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 643,
    statement:
      "Given an array `nums` and an integer `k`, find the contiguous subarray of length **exactly k** with the **maximum average**, and return that average.",
    examples: [
      { in: "nums = [1,12,-5,-6,50,3], k = 4", out: "12.75000", note: "(12−5−6+50)/4 = 12.75" },
      { in: "nums = [5], k = 1", out: "5.00000" },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "−10⁴ ≤ nums[i] ≤ 10⁴"],
    recognize:
      "A **fixed-size** window of length k where you want the best aggregate → the simplest sliding window: slide the window one step and update the sum by **adding the new element and dropping the old one**. Max average == max sum for fixed k.",
    figureItOut: [
      "Maximizing the average of a length-k window is the same as maximizing its **sum** — the denominator k is constant, so divide only at the end.",
      "Brute force recomputes each window's sum from scratch: O(n·k). The waste is obvious — consecutive windows overlap in k−1 elements.",
      "Compute the first window's sum directly (the first k elements). Then to slide right by one, just **subtract the element leaving** the window and **add the element entering** — O(1) per step.",
      "Track the maximum sum across all windows as you slide. At the end, divide the best sum by k for the average.",
      "One pass after the initial sum → O(n) time, O(1) space. Use a double (or long) for the sum to avoid precision/overflow issues.",
    ],
    approaches: [
      {
        name: "Fixed-size sliding window (optimal)",
        intuition: "Seed the first window's sum, then add-new / drop-old as it slides; track the max.",
        time: "O(n)",
        timeWhy: "One pass; each slide is constant work.",
        space: "O(1)",
        spaceWhy: "A running sum and a best sum.",
        code: `double findMaxAverage(int[] nums, int k) {
    double sum = 0;
    for (int i = 0; i < k; i++) sum += nums[i];   // first window
    double best = sum;
    for (int r = k; r < nums.length; r++) {
        sum += nums[r] - nums[r - k];             // add entering, drop leaving
        best = Math.max(best, sum);
    }
    return best / k;
}`,
        walkthrough: [
          "nums=[1,12,-5,-6,50,3], k=4. First window sum = 1+12−5−6 = 2; best=2.",
          "r=4: sum += 50 − 1 = 51 → best=51; r=5: sum += 3 − 12 = 42. best=51 → 51/4 = 12.75.",
        ],
      },
    ],
    edgeCases: [
      "k == nums.length → only one window; its average is the answer.",
      "All negatives → the max average is the 'least negative' window (best is initialized to the first window, not 0).",
      "Use floating point only at the final division to keep the running sum exact.",
    ],
    twists: [
      "**Max sum of a fixed-size window** → the same loop, just return `best` instead of `best / k`.",
      "**Average ≥ threshold of length ≥ k** (LeetCode 644) → harder; binary search on the average plus a prefix-sum feasibility check.",
      "**Variable length with a constraint** → switch to a grow/shrink window.",
    ],
    related: ["minimum-size-subarray-sum", "max-consecutive-ones-iii"],
  },

  {
    slug: "max-consecutive-ones-iii",
    title: "Max Consecutive Ones III",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1004,
    statement:
      "Given a binary array `nums` and an integer `k`, return the length of the **longest contiguous subarray of 1s** you can get if you are allowed to **flip at most k zeros** to 1.",
    examples: [
      { in: "nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2", out: "6", note: "flip the two middle 0s → six 1s" },
      { in: "nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3", out: "10" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "nums[i] is 0 or 1", "0 ≤ k ≤ nums.length"],
    recognize:
      "'**Longest** contiguous window valid under a budget' (here: at most k zeros inside) → a **variable-size sliding window** whose validity is 'zeros-in-window ≤ k'. The classic reframing: you don't actually flip — you just allow up to k zeros in the window.",
    figureItOut: [
      "Don't think about flipping at all. Flipping k zeros to 1 inside a window just means: a window is 'all 1s after flips' iff it contains **at most k zeros**. So the question becomes 'longest window with ≤ k zeros'.",
      "That's a textbook longest-window-with-a-constraint problem. Grow the right edge, counting how many zeros are currently inside.",
      "While the window holds **more than k zeros**, it's invalid: shrink from the left, and each time the element leaving is a 0, decrement the zero count — until you're back to ≤ k zeros.",
      "After each adjustment the window is valid, so record its length. The largest length seen is the answer.",
      "Each index enters once via r and leaves at most once via l → O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Variable window: at most k zeros (optimal)",
        intuition: "Grow right; when zeros exceed k, shrink left until valid; track the widest window.",
        time: "O(n)",
        timeWhy: "Each index is added once and removed at most once.",
        space: "O(1)",
        spaceWhy: "Two pointers and a zero counter.",
        code: `int longestOnes(int[] nums, int k) {
    int l = 0, zeros = 0, best = 0;
    for (int r = 0; r < nums.length; r++) {
        if (nums[r] == 0) zeros++;
        while (zeros > k) {                  // too many zeros → shrink
            if (nums[l] == 0) zeros--;
            l++;
        }
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
        walkthrough: [
          "[1,1,1,0,0,0,1,1,1,1,0], k=2. Window grows; at the third 0 zeros=3>2 → shrink left past the first 0 → zeros=2.",
          "Continues; the widest valid window covers [0,0,1,1,1,1] (two flipped zeros) → length 6.",
        ],
      },
    ],
    edgeCases: [
      "k = 0 → it reduces to the longest run of existing 1s (no shrinking allowed past any zero).",
      "k ≥ number of zeros → the whole array qualifies → answer is nums.length.",
      "All ones → no zeros ever counted → answer is the full length.",
    ],
    twists: [
      "**Max Consecutive Ones (no flips)** (LeetCode 485) → k = 0 special case; just track current run length.",
      "**Longest subarray of a single value after k changes** → generalize 'count zeros' to 'count elements ≠ the target value'.",
      "**Longest repeating character replacement** (LeetCode 424) → same window idea: window valid while (length − maxFreq) ≤ k.",
    ],
    related: ["minimum-size-subarray-sum", "maximum-average-subarray-i"],
  },
];
