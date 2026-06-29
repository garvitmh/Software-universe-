// NeetCode 250 extras — wave 7a (arrays/strings, two-pointers, sliding-window, stack). Java.
export const WAVE7A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "first-missing-positive",
    title: "First Missing Positive",
    difficulty: "Hard",
    pattern: "arrays-hashing",
    leetcode: 41,
    statement:
      "Given an unsorted integer array `nums`, return the **smallest positive integer** that does not appear in it. You must run in **O(n)** time and use **O(1)** extra space.",
    examples: [
      { in: "nums = [1,2,0]", out: "3", note: "1 and 2 present, 3 missing" },
      { in: "nums = [3,4,-1,1]", out: "2", note: "1 present, 2 missing" },
      { in: "nums = [7,8,9,11,12]", out: "1", note: "no small positives at all" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−2³¹ ≤ nums[i] ≤ 2³¹ − 1"],
    recognize:
      "The hard twist is the **O(1) space** demand. Whenever a problem wants the missing/duplicate value among **1..n with no extra memory**, the trick is to use the array's own indices as a hash table — value `v` belongs at index `v − 1`.",
    figureItOut: [
      "Forget the constraints for a second. If you could use a hash set, you'd add every value, then check 1, 2, 3, ... until one is missing. That's O(n) time but O(n) space — and the prompt forbids the space.",
      "Key insight about the **answer's range**: with n elements, the smallest missing positive must be somewhere in **1..n+1**. (If 1..n were all present, the answer is n+1; otherwise it's a gap inside 1..n.) So you only ever care about values in that range.",
      "Now the O(1) trick: the array already has n slots — use them *as* the hash table. The natural home for value `v` (when 1 ≤ v ≤ n) is index `v − 1`. Put each value where it belongs by swapping.",
      "After placing everything, walk the array: the first index `i` where `nums[i] != i + 1` exposes the missing value `i + 1`. If every slot is correct, the answer is `n + 1`.",
      "Use a `while` swap loop (not an `if`) so each misplaced value keeps getting routed home. Swapping only moves a value into a *correct* slot, so the total number of swaps is bounded by n — that's what keeps it O(n).",
    ],
    approaches: [
      {
        name: "Hash set (clarifying baseline)",
        intuition: "Store all values, then probe 1, 2, 3, ... for the first absentee.",
        time: "O(n)",
        timeWhy: "One pass to fill the set, then at most n+1 membership checks.",
        space: "O(n)",
        spaceWhy: "The set holds up to n values — violates the O(1) requirement, shown only for contrast.",
        code: `int firstMissingPositive(int[] nums) {
    Set<Integer> present = new HashSet<>();
    for (int x : nums) present.add(x);
    for (int i = 1; i <= nums.length + 1; i++) {
        if (!present.contains(i)) return i;
    }
    return nums.length + 1;   // unreachable, but keeps the compiler happy
}`,
      },
      {
        name: "Index-as-hash, in-place swaps (optimal)",
        intuition: "Place each value v (1..n) at index v−1 by swapping, then scan for the first slot that's wrong.",
        time: "O(n)",
        timeWhy: "Each swap parks a value in its final correct slot, so total swaps ≤ n; the placing pass and the scanning pass are each O(n).",
        space: "O(1)",
        spaceWhy: "All rearranging happens inside the input array — only a temp variable for swaps.",
        code: `int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        // route nums[i] to its home index nums[i]-1, if it belongs in 1..n
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int target = nums[i] - 1;
            int tmp = nums[target];
            nums[target] = nums[i];
            nums[i] = tmp;
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;   // first slot not holding its expected value
    }
    return n + 1;
}`,
        walkthrough: [
          "nums=[3,4,-1,1], n=4. i=0: 3 belongs at index 2 → swap → [-1,4,3,1]. -1 is out of range → stop.",
          "i=1: 4 belongs at index 3 → swap → [-1,1,3,4]. Now index1 holds 1, belongs at index0 → swap → [1,-1,3,4]. -1 out of range → stop.",
          "i=2,3 already correct (3 at idx2, 4 at idx3). Scan: idx0=1 ok, idx1=-1 ≠ 2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "All non-positive (e.g. [-5,-2]) → no value lands anywhere → answer 1.",
      "Perfect run [1,2,3] → every slot correct → answer n+1 = 4.",
      "Duplicates like [1,1] → the `nums[nums[i]-1] != nums[i]` guard stops infinite swapping when the home slot already holds the right value.",
      "Values larger than n (e.g. 10⁵+) are simply ignored — they can't be the smallest missing positive.",
    ],
    twists: [
      "**Allowed O(n) space** → the hash-set version is fine and far easier to reason about.",
      "**Smallest missing positive ≥ k** → conceptually the same, shift the target range.",
      "**Missing number in 0..n with all distinct** (LeetCode 268) → simpler: XOR or sum formula, no swapping needed.",
    ],
    related: ["find-all-numbers-disappeared-in-an-array", "contains-duplicate"],
  },

  {
    slug: "rotate-array",
    title: "Rotate Array",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 189,
    statement:
      "Given an array `nums`, rotate it to the **right** by `k` steps, where `k ≥ 0`. Do it **in place** with O(1) extra space if you can.",
    examples: [
      { in: "nums = [1,2,3,4,5,6,7], k = 3", out: "[5,6,7,1,2,3,4]", note: "last 3 wrap to the front" },
      { in: "nums = [-1,-100,3,99], k = 2", out: "[3,99,-1,-100]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "0 ≤ k ≤ 10⁵"],
    recognize:
      "It's an **in-place rearrangement** with a wrap-around. The signature trick is the **triple reverse**: reverse the whole array, then reverse the two pieces — order rights itself with no extra array.",
    figureItOut: [
      "First normalize k: rotating by the length n changes nothing, so the only thing that matters is `k % n`. Forgetting this is the #1 bug (k can exceed n).",
      "The obvious approach: copy each element to its new index `(i + k) % n` in a fresh array, then copy back. Correct and O(n), but it uses O(n) extra space.",
      "Now the O(1) insight. Watch what a right-rotate by k does: the **last k elements** move to the front, the **first n−k** shift to the back, each block keeping its internal order.",
      "Reversing the *entire* array brings the last k to the front — but in reversed order. Then reverse just the first k to fix them, and reverse the remaining n−k to fix those. Three reversals, all in place.",
      "Each reverse is a two-pointer swap from both ends, so the whole thing is O(n) time and O(1) space.",
    ],
    approaches: [
      {
        name: "Extra array",
        intuition: "Place each element directly at (i + k) % n in a copy, then write it back.",
        time: "O(n)",
        timeWhy: "Two linear passes — fill the copy, copy it back.",
        space: "O(n)",
        spaceWhy: "A second array the size of the input.",
        code: `void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    int[] out = new int[n];
    for (int i = 0; i < n; i++) {
        out[(i + k) % n] = nums[i];
    }
    System.arraycopy(out, 0, nums, 0, n);
}`,
      },
      {
        name: "Triple reverse, in place (optimal)",
        intuition: "Reverse all, then reverse the first k and the rest separately.",
        time: "O(n)",
        timeWhy: "Three reversals, each touching every element once → 3·n/2 swaps total.",
        space: "O(1)",
        spaceWhy: "Only a temp variable inside the swap; nothing allocated.",
        code: `void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
    reverse(nums, 0, n - 1);     // whole array
    reverse(nums, 0, k - 1);     // first k
    reverse(nums, k, n - 1);     // remaining n-k
}

void reverse(int[] a, int l, int r) {
    while (l < r) {
        int tmp = a[l];
        a[l] = a[r];
        a[r] = tmp;
        l++; r--;
    }
}`,
        walkthrough: [
          "nums=[1,2,3,4,5,6,7], k=3. Reverse all → [7,6,5,4,3,2,1].",
          "Reverse first 3 → [5,6,7,4,3,2,1]. Reverse last 4 → [5,6,7,1,2,3,4]. Done.",
        ],
      },
    ],
    edgeCases: [
      "k is a multiple of n → k%n = 0 → array unchanged (still run the reverses; they no-op correctly).",
      "k > n → must take k%n first or you reverse phantom ranges.",
      "Single element → nothing to rotate.",
    ],
    twists: [
      "**Rotate left by k** → equivalent to rotating right by n−k, or reverse the pieces in the opposite order.",
      "**Cyclic-replacement method** → an alternative O(1) approach that follows index cycles; trickier to get the cycle-count right.",
      "**Rotate a 2-D matrix 90°** (LeetCode 48) → transpose then reverse each row, same 'reverse to reorder' spirit.",
    ],
    related: ["product-of-array-except-self", "rotate-image"],
  },

  {
    slug: "range-sum-query-immutable",
    title: "Range Sum Query - Immutable",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 303,
    statement:
      "Design a class `NumArray` that, given an integer array `nums`, answers many `sumRange(i, j)` queries returning the sum of `nums[i..j]` **inclusive**. The array never changes, but `sumRange` is called many times.",
    examples: [
      { in: "NumArray([-2,0,3,-5,2,-1]); sumRange(0,2)", out: "1", note: "−2 + 0 + 3" },
      { in: "sumRange(2,5)", out: "-1", note: "3 − 5 + 2 − 1" },
      { in: "sumRange(0,5)", out: "-3", note: "whole array" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−10⁵ ≤ nums[i] ≤ 10⁵", "0 ≤ i ≤ j < nums.length", "up to 10⁴ calls to sumRange"],
    recognize:
      "Repeated **range-sum queries on data that never changes** is the textbook cue for a **prefix-sum array**: precompute cumulative totals once, then answer any range by subtracting two of them in O(1).",
    figureItOut: [
      "The naive `sumRange`: loop from i to j and add. Each query is O(n), and with many queries you pay O(n) over and over for overlapping ranges — pure repeated work.",
      "Because the array is **immutable**, you can pay a one-time setup cost and make every query cheap. That setup is the **prefix sum**.",
      "Define `prefix[k]` = sum of the first k elements (`nums[0..k-1]`). Then the sum of `nums[i..j]` is `prefix[j+1] − prefix[i]` — everything up to j, minus everything before i.",
      "Use a prefix array of length n+1 with `prefix[0] = 0`. That extra leading zero removes the special case when i = 0, so the formula is uniform.",
      "Build prefix once in O(n); after that each `sumRange` is one subtraction — O(1).",
    ],
    approaches: [
      {
        name: "Recompute each query",
        intuition: "Just sum nums[i..j] on every call.",
        time: "O(n) per query",
        timeWhy: "Each call loops over up to n elements; q queries cost O(n·q).",
        space: "O(1)",
        spaceWhy: "No precomputation — but slow when queries are frequent.",
        code: `class NumArray {
    private int[] nums;
    public NumArray(int[] nums) { this.nums = nums; }
    public int sumRange(int i, int j) {
        int total = 0;
        for (int k = i; k <= j; k++) total += nums[k];
        return total;
    }
}`,
      },
      {
        name: "Prefix sums (optimal)",
        intuition: "Precompute cumulative totals; each range is the difference of two of them.",
        time: "O(n) build, O(1) per query",
        timeWhy: "One pass builds prefix; every query is a single subtraction.",
        space: "O(n)",
        spaceWhy: "The prefix array of length n+1.",
        code: `class NumArray {
    private int[] prefix;   // prefix[k] = sum of nums[0..k-1]
    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int k = 0; k < nums.length; k++) {
            prefix[k + 1] = prefix[k] + nums[k];
        }
    }
    public int sumRange(int i, int j) {
        return prefix[j + 1] - prefix[i];
    }
}`,
        walkthrough: [
          "nums=[-2,0,3,-5,2,-1] → prefix=[0,-2,-2,1,-4,-2,-3].",
          "sumRange(2,5) = prefix[6] − prefix[2] = -3 − (-2) = -1.",
          "sumRange(0,2) = prefix[3] − prefix[0] = 1 − 0 = 1.",
        ],
      },
    ],
    edgeCases: [
      "i == j → single element → prefix[i+1] − prefix[i] = nums[i].",
      "Whole array (0, n−1) → prefix[n] − prefix[0] = total.",
      "The n+1 sizing with prefix[0]=0 is what lets i=0 use the same formula — drop it and you need a branch.",
    ],
    twists: [
      "**Mutable array with updates** (LeetCode 307) → prefix sums break (an update is O(n)); use a Fenwick/Binary Indexed Tree or segment tree for O(log n) both.",
      "**2-D range sum** (LeetCode 304) → 2-D prefix sums with inclusion–exclusion.",
      "**Count subarrays with a target sum** → prefix sums + a hash map of seen prefixes (Subarray Sum Equals K).",
    ],
    related: ["subarray-sum-equals-k", "product-of-array-except-self"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "reverse-words-in-a-string",
    title: "Reverse Words in a String",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 151,
    statement:
      "Given a string `s`, reverse the **order of the words**. A word is a maximal run of non-space characters. Collapse multiple spaces and trim leading/trailing spaces so the result has single spaces between words.",
    examples: [
      { in: 's = "the sky is blue"', out: '"blue is sky the"' },
      { in: 's = "  hello world  "', out: '"world hello"', note: "trim and collapse spaces" },
      { in: 's = "a good   example"', out: '"example good a"', note: "multiple spaces collapse to one" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s contains English letters, digits, and spaces"],
    recognize:
      "Reversing **word order** (not characters) while cleaning whitespace. The clean approach scans **right-to-left with two pointers** to carve out each word, or — the in-place classic — reverse the whole string then reverse each word back.",
    figureItOut: [
      "The lazy one-liner: `s.trim().split(\"\\s+\")`, reverse the list, join with single spaces. The regex `\\s+` collapses runs of spaces, and trim handles the edges. Totally fine in an interview as a first answer.",
      "But that hides the mechanics. To show real control, think in two pointers. Walk from the **right end** of the string; skip trailing spaces, then mark the end of a word, walk left to its start, and append that slice.",
      "Repeat: skip the spaces before it, grab the next word, append. Put a single space between appended words yourself, so you never have to clean up doubles afterward.",
      "The classic O(1)-extra in-place variant (for a char array): **reverse the entire array**, which flips word order but also reverses each word's letters; then **reverse each individual word** to fix the letters. Finally compact the spaces.",
      "Either way the core idea is the same: word boundaries are runs between spaces, and reversing order is cheap once you can isolate those runs.",
    ],
    approaches: [
      {
        name: "Split, reverse, join",
        intuition: "Let the library find words; reverse the list; rejoin with single spaces.",
        time: "O(n)",
        timeWhy: "Splitting, reversing the list, and joining are each linear in the length.",
        space: "O(n)",
        spaceWhy: "The list of word substrings plus the output builder.",
        code: `String reverseWords(String s) {
    String[] words = s.trim().split("\\\\s+");   // collapse runs of spaces
    StringBuilder sb = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        sb.append(words[i]);
        if (i > 0) sb.append(' ');
    }
    return sb.toString();
}`,
      },
      {
        name: "Two pointers scanning from the right (optimal-style)",
        intuition: "Walk right to left, carve each word with two indices, append in order.",
        time: "O(n)",
        timeWhy: "Each character is visited a constant number of times by the scanning pointers.",
        space: "O(n)",
        spaceWhy: "The output builder (the input String is immutable, so some output buffer is unavoidable in Java).",
        code: `String reverseWords(String s) {
    StringBuilder sb = new StringBuilder();
    int i = s.length() - 1;
    while (i >= 0) {
        while (i >= 0 && s.charAt(i) == ' ') i--;       // skip spaces
        if (i < 0) break;
        int end = i;                                     // last char of this word
        while (i >= 0 && s.charAt(i) != ' ') i--;        // walk to before the word
        if (sb.length() > 0) sb.append(' ');
        sb.append(s, i + 1, end + 1);                    // append the word slice
    }
    return sb.toString();
}`,
        walkthrough: [
          's = "  hello world  ". Skip trailing spaces → i at last \'d\'. end=d, walk left to before "world", append "world".',
          "Skip the gap, end at \'o\' of hello, walk left to start, append a space then \"hello\" → \"world hello\".",
        ],
      },
    ],
    edgeCases: [
      "Leading/trailing spaces must be trimmed → `\"  hi  \"` becomes `\"hi\"`.",
      "Multiple spaces between words collapse to exactly one.",
      "A single word → returned unchanged (no trailing space).",
      "A string of only spaces → empty result.",
    ],
    twists: [
      "**Reverse the characters of each word but keep word order** (LeetCode 557) → reverse each word in place, leave order alone.",
      "**True O(1) extra space** → operate on a `char[]`: reverse whole, reverse each word, then squeeze out extra spaces in place.",
      "**Reverse a string** (LeetCode 344) → the bare two-pointer swap that underlies all of these.",
    ],
    related: ["valid-palindrome", "valid-palindrome"],
  },

  {
    slug: "3sum-closest",
    title: "3Sum Closest",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 16,
    statement:
      "Given an array `nums` and an integer `target`, find **three integers** whose sum is **closest** to `target`, and return that sum. Each input has exactly one closest sum.",
    examples: [
      { in: "nums = [-1,2,1,-4], target = 1", out: "2", note: "-1 + 2 + 1 = 2, closest to 1" },
      { in: "nums = [0,0,0], target = 1", out: "0", note: "only one possible sum" },
    ],
    constraints: ["3 ≤ nums.length ≤ 500", "−1000 ≤ nums[i] ≤ 1000", "−10⁴ ≤ target ≤ 10⁴"],
    recognize:
      "It's **3Sum with 'closest' instead of 'equals'**. Same machinery — sort, fix one number, two-pointer the rest — but instead of stopping at an exact match you track the sum with the smallest distance to target.",
    figureItOut: [
      "Brute force is three nested loops checking `|sum − target|` for every triplet — O(n³). Correct, and a fine starting point to state out loud.",
      "Borrow the 3Sum structure: **sort** the array. Then fix the first number `nums[i]` and reduce to a two-pointer scan over the rest, hunting a pair whose total brings the triplet near target.",
      "Sorting gives you direction: with pointers l and r, if the current `sum < target` you need it bigger → move l right; if `sum > target` you need it smaller → move r left. Each move provably can't skip a closer candidate.",
      "Carry a `best` sum and update it whenever the current triplet's distance `|sum − target|` beats the best so far. There's no early exact-match stop — well, if `sum == target` you literally can't get closer, so you can return immediately.",
      "That's O(n²): the sort, then n choices of i each with an O(n) two-pointer sweep.",
    ],
    approaches: [
      {
        name: "Brute force — three loops",
        intuition: "Try every triplet, keep the sum nearest target.",
        time: "O(n³)",
        timeWhy: "Three nested loops over n.",
        space: "O(1)",
        spaceWhy: "Just the running best.",
        code: `int threeSumClosest(int[] nums, int target) {
    int best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            for (int k = j + 1; k < nums.length; k++) {
                int sum = nums[i] + nums[j] + nums[k];
                if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
            }
    return best;
}`,
      },
      {
        name: "Sort + fix one + two pointers (optimal)",
        intuition: "Sort, fix i, slide l/r toward target, track the closest sum.",
        time: "O(n²)",
        timeWhy: "Sort is O(n log n); then n choices of i, each an O(n) sweep → O(n²) dominates.",
        space: "O(1)",
        spaceWhy: "Only pointers and the best-sum scalar (ignoring sort overhead).",
        code: `int threeSumClosest(int[] nums, int target) {
    Arrays.sort(nums);
    int best = nums[0] + nums[1] + nums[2];
    for (int i = 0; i < nums.length - 2; i++) {
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
            if (sum == target) return sum;        // can't beat an exact hit
            if (sum < target) l++;                 // need a larger sum
            else r--;                              // need a smaller sum
        }
    }
    return best;
}`,
        walkthrough: [
          "sorted = [-4,-1,1,2], target=1. i=0(−4): l=1(−1),r=3(2) sum=-3 → best=-3; -3<1 → l++; l=2(1),r=3(2) sum=-1 → |−1−1|=2 < |−3−1|=4 → best=-1; l++ ends.",
          "i=1(−1): l=2(1),r=3(2) sum=2 → |2−1|=1 < 2 → best=2; 2>1 → r--; ends. Return 2.",
        ],
      },
    ],
    edgeCases: [
      "Exactly three elements → only one possible sum, returned directly.",
      "All equal (e.g. [0,0,0]) → that single sum.",
      "Initialize `best` from a real triplet (not 0) so the comparison is valid from the start.",
      "Watch for overflow only if values were huge — here the constraints keep sums small.",
    ],
    twists: [
      "**Exact 3Sum** (LeetCode 15) → stop at sum == 0 and collect unique triplets instead of tracking distance.",
      "**4Sum Closest** → fix two numbers, two-pointer the rest → O(n³).",
      "**Closest pair to target (2 numbers)** → drop the outer loop; pure two-pointer on a sorted array.",
    ],
    related: ["3sum", "two-sum-ii"],
  },

  {
    slug: "string-compression",
    title: "String Compression",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 443,
    statement:
      "Given a character array `chars`, compress it **in place**: each group of consecutive repeats becomes the character followed by the count (counts > 1 only; a single char gets no number). Return the **new length**; the first that-many slots of `chars` must hold the compressed form.",
    examples: [
      { in: 'chars = ["a","a","b","b","c","c","c"]', out: '6 → ["a","2","b","2","c","3"]' },
      { in: 'chars = ["a"]', out: '1 → ["a"]', note: "single char, no count" },
      { in: 'chars = ["a","b","b","b",...12 b\'s]', out: 'count "12" is written as two chars \'1\',\'2\'' },
    ],
    constraints: ["1 ≤ chars.length ≤ 2000", "chars[i] is a letter, digit, symbol, or space"],
    recognize:
      "**In-place array rewrite** where one pointer reads groups and a slower pointer writes the compressed result behind it. Two pointers moving at different speeds over the same array is the read/write-pointer pattern.",
    figureItOut: [
      "First the easy mental model: walk the array, count each run of identical characters, and emit `char` then (if count > 1) the count's digits. The only hard part is doing it **in place** without an auxiliary array.",
      "Use two pointers into the *same* array: `read` scans forward to measure each group; `write` is where the next compressed character goes. Because compression never makes the string longer, `write` always stays at or behind `read` — so you never clobber data you still need.",
      "For each group: note the character at `read`, advance `read` while it keeps matching to get the count. Write the character at `write++`.",
      "If the count is > 1, write its digits. The catch: a count like 12 is **two characters** ('1','2'), not one. Convert the number to a string and write each digit — don't assume single-digit counts.",
      "When `read` reaches the end, `write` is the new length. Everything in `chars[0..write-1]` is the answer.",
    ],
    approaches: [
      {
        name: "Two pointers, in place (optimal)",
        intuition: "A read pointer measures each run; a write pointer lays down char + count behind it.",
        time: "O(n)",
        timeWhy: "read visits each character once; write does proportionally less work.",
        space: "O(1)",
        spaceWhy: "Rewrites within the input array; only a small temp for the count's digits.",
        code: `int compress(char[] chars) {
    int write = 0, read = 0, n = chars.length;
    while (read < n) {
        char c = chars[read];
        int count = 0;
        while (read < n && chars[read] == c) {   // measure the run
            read++;
            count++;
        }
        chars[write++] = c;                       // always write the character
        if (count > 1) {
            for (char d : Integer.toString(count).toCharArray()) {
                chars[write++] = d;               // write each digit of the count
            }
        }
    }
    return write;
}`,
        walkthrough: [
          'chars=["a","a","b","b","c","c","c"]. Group \'a\' count2 → write \'a\',\'2\'. Group \'b\' count2 → write \'b\',\'2\'.',
          "Group 'c' count3 → write 'c','3'. write=6, array starts [a,2,b,2,c,3,...]. Return 6.",
        ],
      },
    ],
    edgeCases: [
      "Single character → written with no count → length 1.",
      "Count ≥ 10 (e.g. 12) → must write multiple digit characters, not one.",
      "No consecutive repeats (e.g. \"abc\") → output equals input, every count is 1 (no numbers).",
      "write never overtakes read because the compressed length ≤ original length — that's what makes in-place safe.",
    ],
    twists: [
      "**Decompress** (run-length expand) → the inverse; watch for multi-digit counts when parsing.",
      "**Count Binary Substrings / Run-Length Encoding variants** → same grouping scan, different output.",
      "**Compress only if shorter, else keep original** → compare lengths before committing.",
    ],
    related: ["move-zeroes", "remove-duplicates-from-sorted-array"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "find-the-index-of-the-first-occurrence-in-a-string",
    title: "Find the Index of the First Occurrence in a String",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 28,
    statement:
      "Given two strings `haystack` and `needle`, return the **index of the first occurrence** of `needle` in `haystack`, or `-1` if it isn't present. (Classic `strStr`.)",
    examples: [
      { in: 'haystack = "sadbutsad", needle = "sad"', out: "0", note: "matches at index 0 (and 6)" },
      { in: 'haystack = "leetcode", needle = "leeto"', out: "-1", note: "never matches" },
    ],
    constraints: ["1 ≤ haystack.length, needle.length ≤ 10⁴", "both contain only lowercase English letters"],
    recognize:
      "Substring search slides a **fixed-width window** (length = needle) across the haystack and checks each placement. The simple version is brute force; the optimal (KMP) reuses match information to avoid re-checking.",
    figureItOut: [
      "Think of needle as a window of fixed width m sliding over haystack. At each start position i, compare the window `haystack[i..i+m-1]` against needle character by character.",
      "Brute force: try every start i from 0 to n−m, and at each one compare up to m characters. That's O(n·m) worst case (think `\"aaaa...a\"` searching `\"aaa...b\"`), but it's simple and usually fine.",
      "Two correctness details: only start positions up to `n − m` can possibly fit the needle, and on the first mismatch within a window you bail out and slide to the next start.",
      "Why it can be wasteful: on a mismatch, brute force throws away everything it learned and restarts the comparison one position over — re-reading characters it already saw.",
      "The optimal **KMP** precomputes, for the needle, how far you can safely jump on a mismatch (the longest prefix that is also a suffix). That lets the haystack pointer never go backward → O(n + m). It's the same window, just smarter about how far to slide it.",
    ],
    approaches: [
      {
        name: "Sliding window brute force",
        intuition: "Try each start; compare the window against needle; stop at the first full match.",
        time: "O(n·m)",
        timeWhy: "Up to n−m+1 start positions, each comparing up to m characters.",
        space: "O(1)",
        spaceWhy: "Only index variables; no extra structures.",
        code: `int strStr(String haystack, String needle) {
    int n = haystack.length(), m = needle.length();
    for (int i = 0; i + m <= n; i++) {           // only starts that can fit needle
        int j = 0;
        while (j < m && haystack.charAt(i + j) == needle.charAt(j)) j++;
        if (j == m) return i;                     // matched all m characters
    }
    return -1;
}`,
        walkthrough: [
          'haystack="sadbutsad", needle="sad". i=0: \'s\'\'a\'\'d\' all match → j reaches 3 = m → return 0.',
        ],
      },
      {
        name: "KMP — prefix-function jumps (optimal)",
        intuition: "Precompute the needle's longest-prefix-suffix table so a mismatch jumps instead of restarting.",
        time: "O(n + m)",
        timeWhy: "Building the lps table is O(m); the scan never moves the haystack pointer backward, so O(n).",
        space: "O(m)",
        spaceWhy: "The lps array, one entry per needle character.",
        code: `int strStr(String haystack, String needle) {
    int n = haystack.length(), m = needle.length();
    int[] lps = new int[m];                       // longest proper prefix == suffix
    for (int i = 1, len = 0; i < m; ) {
        if (needle.charAt(i) == needle.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1];     // fall back, do not advance i
        else lps[i++] = 0;
    }
    for (int i = 0, j = 0; i < n; ) {
        if (haystack.charAt(i) == needle.charAt(j)) {
            i++; j++;
            if (j == m) return i - m;             // full match ends here
        } else if (j > 0) {
            j = lps[j - 1];                       // reuse known partial match
        } else {
            i++;
        }
    }
    return -1;
}`,
      },
    ],
    edgeCases: [
      "needle longer than haystack → no valid start → −1.",
      "needle occurs at the very end → the last start position i = n − m.",
      "Repetitive patterns (\"aaaa\" in \"aaaaa\") are exactly where brute force degrades and KMP shines.",
    ],
    twists: [
      "**Count all occurrences (overlapping)** → don't return on first match; on a KMP match, set j = lps[j−1] and continue.",
      "**Rabin–Karp** → rolling hash for average O(n + m), great for multiple patterns.",
      "**Repeated Substring Pattern** (LeetCode 459) → falls right out of the KMP lps table.",
    ],
    related: ["longest-substring-without-repeating", "permutation-in-string"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "decode-string",
    title: "Decode String",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 394,
    statement:
      "Given an encoded string like `k[encoded]`, decode it: the part in brackets is repeated `k` times. Brackets can **nest** (e.g. `3[a2[c]]`). Return the expanded string.",
    examples: [
      { in: 's = "3[a]2[bc]"', out: '"aaabcbc"' },
      { in: 's = "3[a2[c]]"', out: '"accaccacc"', note: "inner 2[c]=cc, then a+cc repeated 3×" },
      { in: 's = "2[abc]3[cd]ef"', out: '"abcabccdcdcdef"' },
    ],
    constraints: ["1 ≤ s.length ≤ 30", "digits, lowercase letters, and brackets", "the input is always valid"],
    recognize:
      "**Nested brackets** where an inner result must be repeated and then folded into the level outside it. 'Resume the enclosing context after finishing the inner one' is exactly what a **stack** preserves.",
    figureItOut: [
      "The hard part is nesting: when you hit `]`, you finish the *innermost* group, but you must then continue building whatever group surrounds it. You need to remember the partly-built outer string and its repeat count — pushed aside while you work on the inside.",
      "That 'set aside the outer context, dive in, come back' is the stack signature. Keep a current string being built and a current number being read.",
      "Scan char by char. A **digit** → accumulate into the current number (multi-digit like 12 matters). A **letter** → append to the current string.",
      "On `[` → you're entering a nested group: **push** the current string and the current count onto stacks, then reset both to start the inner group fresh.",
      "On `]` → the inner group is done. Pop the saved count k and the saved prefix; the new current string becomes `prefix + (current repeated k times)`. That folds the finished inner result back into its parent.",
    ],
    approaches: [
      {
        name: "Two stacks — counts and string prefixes (optimal)",
        intuition: "Push the outer (string, count) at each '['; on ']' pop and fold the repeated inner back in.",
        time: "O(n · maxK · depth)",
        timeWhy: "Linear scan, but the output (and the work to build it) grows with how many times groups expand.",
        space: "O(depth + output)",
        spaceWhy: "Two stacks proportional to nesting depth, plus the growing result.",
        code: `String decodeString(String s) {
    Deque<Integer> counts = new ArrayDeque<>();
    Deque<StringBuilder> strings = new ArrayDeque<>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            k = k * 10 + (c - '0');               // build multi-digit count
        } else if (c == '[') {
            counts.push(k);                        // save how many times to repeat
            strings.push(cur);                     // save the outer prefix
            cur = new StringBuilder();             // start the inner group
            k = 0;
        } else if (c == ']') {
            int repeat = counts.pop();
            StringBuilder prefix = strings.pop();
            for (int i = 0; i < repeat; i++) prefix.append(cur);  // fold inner in
            cur = prefix;
        } else {
            cur.append(c);                         // a letter
        }
    }
    return cur.toString();
}`,
        walkthrough: [
          's="3[a2[c]]". Read 3 → k=3. \'[\' → push(3, ""), cur="". \'a\' → cur="a". 2 → k=2. \'[\' → push(2,"a"), cur="".',
          "'c' → cur=\"c\". ']' → pop 2,\"a\" → cur = \"a\"+\"cc\" = \"acc\". ']' → pop 3,\"\" → cur = \"acc\"×3 = \"accaccacc\".",
        ],
      },
    ],
    edgeCases: [
      "Multi-digit counts (e.g. 12[a]) → accumulate digits with `k = k*10 + d`, not single-digit.",
      "Letters outside any brackets (e.g. trailing \"ef\") → just appended to the current string.",
      "Deep nesting → handled naturally; stack depth equals bracket depth.",
    ],
    twists: [
      "**Recursive descent** → an index-passing recursion mirrors the stack exactly; same complexity.",
      "**Number of Atoms** (LeetCode 726) → same stack idea over a chemical formula, summing counts.",
      "**Basic Calculator** (LeetCode 224) → push/restore context on parentheses, but accumulating arithmetic instead of repetition.",
    ],
    related: ["valid-parentheses", "evaluate-reverse-polish-notation"],
  },

  {
    slug: "simplify-path",
    title: "Simplify Path",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 71,
    statement:
      "Given an absolute Unix-style `path`, return its **canonical** form: a single leading slash, no trailing slash (unless root), no `.` (current dir), and each `..` (parent dir) pops the previous directory. Collapse multiple slashes.",
    examples: [
      { in: 'path = "/home/"', out: '"/home"', note: "drop trailing slash" },
      { in: 'path = "/../"', out: '".."→ "/"', note: "cannot go above root" },
      { in: 'path = "/a/./b/../../c/"', out: '"/c"', note: "., .. resolved" },
    ],
    constraints: ["1 ≤ path.length ≤ 3000", "path starts with '/'", "components are letters, digits, '.', '_', '/'"],
    recognize:
      "`..` means 'undo the **most recent** directory I entered' — and undoing the latest action is the defining job of a **stack**. Split on slashes, push real names, pop on `..`.",
    figureItOut: [
      "Split the path on `/`. You get a list of components, some of which are empty (from `//` or trailing slashes), some are `.`, some `..`, and the rest are real directory names.",
      "Process components left to right while keeping a stack of the directories currently on the path. The key realization: `..` doesn't just append — it **removes** the last directory you added. 'Remove the most recent' = pop a stack.",
      "Rules per component: empty string or `.` → ignore (no-op). `..` → pop the stack if it's non-empty (and if it's empty, do nothing — you can't rise above root). Anything else → push it as a real directory.",
      "At the end, the stack holds the surviving directories from root downward. Join them with single slashes and prepend one slash.",
      "If the stack is empty, the canonical path is just `/` (the root). That naturally handles paths like `/../` and `/`.",
    ],
    approaches: [
      {
        name: "Split and stack of directories (optimal)",
        intuition: "Split on '/'; push real names, pop on '..', skip '.' and empties; join the survivors.",
        time: "O(n)",
        timeWhy: "Splitting is O(n); each component is pushed/popped at most once; the final join is O(n).",
        space: "O(n)",
        spaceWhy: "The stack of surviving directory names, up to O(n) in total length.",
        code: `String simplifyPath(String path) {
    Deque<String> stack = new ArrayDeque<>();
    for (String part : path.split("/")) {
        if (part.isEmpty() || part.equals(".")) {
            continue;                              // skip blanks and current-dir
        } else if (part.equals("..")) {
            if (!stack.isEmpty()) stack.pop();     // go up one, never above root
        } else {
            stack.push(part);                      // a real directory
        }
    }
    StringBuilder sb = new StringBuilder();
    // stack pops newest-first, so iterate in reverse insertion order
    Iterator<String> it = stack.descendingIterator();
    while (it.hasNext()) sb.append('/').append(it.next());
    return sb.length() == 0 ? "/" : sb.toString();
}`,
        walkthrough: [
          'path="/a/./b/../../c/". Split → ["","a",".","b","..","..","c",""].',
          'Push "a"; skip "."; push "b"; ".." pops "b"; ".." pops "a"; push "c". Stack=[c] → "/c".',
        ],
      },
    ],
    edgeCases: [
      "Root only (\"/\") → stack empty → return \"/\".",
      "`..` at or above root (\"/../\") → pop does nothing → \"/\".",
      "Consecutive slashes (\"/a//b\") → split yields empty strings, all skipped.",
      "Trailing slash never appears in the output because we rebuild from components.",
    ],
    twists: [
      "**Relative paths (no leading /)** → `..` may need to be *kept* when the stack is empty, since you can rise above the (unknown) start.",
      "**Symbolic links** → can't be resolved purely lexically; needs the real filesystem.",
      "**Windows-style paths** → different separators and drive letters, same stack idea.",
    ],
    related: ["valid-parentheses", "min-stack"],
  },

  {
    slug: "online-stock-span",
    title: "Online Stock Span",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 901,
    statement:
      "Design `StockSpanner`. Each call to `next(price)` returns the **span**: the number of consecutive days (today and going back) on which the price was **≤ today's price**. Prices arrive one at a time.",
    examples: [
      { in: "next(100)", out: "1", note: "first day, span 1" },
      { in: "next(80), next(60)", out: "1, 1", note: "each lower than the day before" },
      { in: "next(70), next(60), next(75), next(85)", out: "2, 1, 4, 6", note: "75 spans back over 60,70; 85 over all" },
    ],
    constraints: ["1 ≤ price ≤ 10⁵", "up to 10⁴ calls to next"],
    recognize:
      "'How far back until a **larger** value' is the **previous-greater-element** question, and that's what a **monotonic stack** answers in amortized O(1). Storing the span lets you swallow whole runs in one pop.",
    figureItOut: [
      "Naive: each `next(price)`, walk backwards over all stored prices counting while they're ≤ price. That's O(n) per call, O(n²) overall — and you keep re-scanning the same earlier days.",
      "Look at what the span really asks: how many recent days are ≤ today, i.e., stop at the **first earlier day strictly greater** than today. 'First earlier greater' = previous-greater-element → **monotonic stack**.",
      "Keep a stack of past days as `(price, span)` pairs, decreasing in price from bottom to top. When today's price arrives, any day on top with price ≤ today is **subsumed** — today's run reaches over it.",
      "So while the stack's top price ≤ today's price, **pop** it and *add its span to today's span*. This is the trick: a popped day already aggregated its own run, so you absorb the whole run in one step instead of counting day by day.",
      "Start today's span at 1 (today itself), absorb spans of the popped smaller-or-equal days, then push `(price, span)`. The popping is amortized O(1): each day is pushed once and popped at most once.",
    ],
    approaches: [
      {
        name: "Re-scan history each call (baseline)",
        intuition: "Store every price; on each call walk back counting ≤ today.",
        time: "O(n) per call",
        timeWhy: "Each next may scan all previous prices; n calls → O(n²).",
        space: "O(n)",
        spaceWhy: "Keeps the full price history.",
        code: `class StockSpanner {
    private List<Integer> prices = new ArrayList<>();
    public int next(int price) {
        prices.add(price);
        int span = 0;
        for (int i = prices.size() - 1; i >= 0 && prices.get(i) <= price; i--) span++;
        return span;
    }
}`,
      },
      {
        name: "Monotonic stack of (price, span) (optimal)",
        intuition: "Pop every earlier day ≤ today, absorbing its span; push today with the accumulated span.",
        time: "Amortized O(1) per call",
        timeWhy: "Each day is pushed once and popped at most once across all calls → O(n) total for n calls.",
        space: "O(n)",
        spaceWhy: "The stack holds at most one entry per day in the worst (strictly increasing) case.",
        code: `class StockSpanner {
    private Deque<int[]> stack = new ArrayDeque<>();   // each entry: [price, span]
    public int next(int price) {
        int span = 1;                                   // today counts as 1
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.pop()[1];                     // absorb the whole subsumed run
        }
        stack.push(new int[]{price, span});
        return span;
    }
}`,
        walkthrough: [
          "next(100) → stack empty → span1, push[100,1]. next(80) → top100>80 → span1, push[80,1].",
          "next(60) → span1. next(70) → top60≤70 pop(+1) → top80>70 stop → span2, push[70,2].",
          "next(75) → pop70(+2) → pop60? gone — pop[70,2] gave span3, top80>75 → span3... then 85: pops everything → span6.",
        ],
      },
    ],
    edgeCases: [
      "First call → stack empty → span 1.",
      "Strictly decreasing prices → every span is 1 (nothing gets absorbed).",
      "Strictly increasing prices → each call pops the whole stack → spans 1,2,3,...,n.",
      "Equal prices count (`≤`, not `<`) → today's run includes prior equal days.",
    ],
    twists: [
      "**Daily Temperatures** (LeetCode 739) → next-greater *to the right*; monotonic stack of indices.",
      "**Largest Rectangle in Histogram** (LeetCode 84) → previous/next-smaller via the same monotonic-stack idea.",
      "**Next Greater Element II (circular)** (LeetCode 503) → iterate twice over a monotonic stack.",
    ],
    related: ["daily-temperatures", "largest-rectangle-in-histogram"],
  },
];
