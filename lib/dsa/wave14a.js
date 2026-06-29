// NeetCode/Top-150/LeetCode-75 — wave 14a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave13a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE14A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "sum-of-unique-elements",
    title: "Sum of Unique Elements",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1748,
    statement:
      "You are given an integer array `nums`. The **unique** elements are those that appear **exactly once**. Return the **sum** of all the unique elements of `nums`.",
    examples: [
      { in: "nums = [1,2,3,2]", out: "4", explanation: "1 and 3 appear once → 1 + 3 = 4 (2 repeats, excluded)" },
      { in: "nums = [1,1,1,1,1]", out: "0", explanation: "every element repeats → no unique elements" },
      { in: "nums = [1,2,3,4,5]", out: "15", explanation: "all appear once → sum of everything" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "1 ≤ nums[i] ≤ 100"],
    recognize:
      "'Sum the values that appear exactly once' is a textbook **frequency-count then filter**: tally every value, then add up only the values whose count is one.",
    figureItOut: [
      "Whether a value contributes depends only on how many times it appears, not where. So the first move is to count occurrences of each value.",
      "Because the values are bounded (1..100), a fixed 101-slot counts array is enough — no general hash map needed, though a map would also work.",
      "After counting, a value belongs to the answer if and only if its count is exactly one. Counts of zero (never seen) and two-or-more (repeated) are both skipped.",
      "Sum those single-occurrence values. Note you sum the VALUE itself once, not its count, since a unique element contributes its value a single time.",
      "One pass to count and one pass over the small value range to sum → O(n + V) time where V is the value range, O(V) space for the counts.",
    ],
    approaches: [
      {
        name: "Frequency counts then sum the ones (optimal)",
        intuition: "Count each value; add up only the values whose count equals one.",
        time: "O(n + V)",
        timeWhy: "n to count, V (the bounded value range) to sum the singletons.",
        space: "O(V)",
        spaceWhy: "A fixed counts array over the value range.",
        code: `int sumOfUnique(int[] nums) {
    int[] count = new int[101];
    for (int v : nums) count[v]++;
    int sum = 0;
    for (int v = 1; v <= 100; v++) {
        if (count[v] == 1) sum += v;
    }
    return sum;
}`,
        walkthrough: [
          "nums=[1,2,3,2]. Counts: 1->1, 2->2, 3->1.",
          "Sum values with count 1: value 1 (count 1) add 1; value 2 (count 2) skip; value 3 (count 1) add 3.",
          "Sum = 4.",
        ],
      },
    ],
    edgeCases: [
      "Every element repeats → no count equals one → sum 0.",
      "All elements distinct → every count is one → sum of the whole array.",
      "Single-element array → that element appears once → it is the answer.",
    ],
    twists: [
      "**Unique Number of Occurrences** (in the library) → also counts frequencies, but then asks whether the counts themselves are all distinct.",
      "**First Unique Character in a String** (in the library) → the same single-occurrence idea applied to characters, returning a position.",
      "**Sum elements appearing exactly k times** → generalize the filter from count == 1 to count == k.",
    ],
    related: ["unique-number-of-occurrences", "first-unique-character-in-a-string", "single-number"],
  },

  {
    slug: "check-if-array-is-sorted-and-rotated",
    title: "Check if Array Is Sorted and Rotated",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1752,
    statement:
      "Given an array `nums`, return `true` if it was originally sorted in **non-decreasing** order and then **rotated** some number of positions (possibly zero). There may be duplicates. A rotation moves the first `x` elements to the end.",
    examples: [
      { in: "nums = [3,4,5,1,2]", out: "true", explanation: "sorted [1,2,3,4,5] rotated by 3" },
      { in: "nums = [2,1,3,4]", out: "false", explanation: "cannot come from any rotation of a sorted array" },
      { in: "nums = [1,2,3]", out: "true", explanation: "already sorted = rotation by 0" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "1 ≤ nums[i] ≤ 100"],
    recognize:
      "A sorted-then-rotated array is non-decreasing everywhere **except at most one wrap-around drop**; counting the positions where an element exceeds its next (cyclically) and checking that count is ≤ 1 settles it in a single scan.",
    figureItOut: [
      "Picture a sorted array bent into a circle: it increases all the way around with exactly one seam where the largest value meets the smallest. Rotating just chooses where that seam sits in the linear array.",
      "So in the linear view, nums[i] > nums[i+1] (a 'descent') can happen at most ONCE — that single descent is the rotation seam.",
      "Treat the array cyclically: compare each element with the next, and for the last element compare it with the first (the wrap). Count how many times the current value is strictly greater than the value after it.",
      "If that descent count is 0, the array is already sorted (rotation by zero). If it is exactly 1, that lone descent is a valid seam. If it is 2 or more, no single rotation could produce it → false.",
      "One cyclic pass comparing neighbors → O(n) time, O(1) space. Duplicates are handled naturally because only STRICT descents count.",
    ],
    approaches: [
      {
        name: "Count cyclic descents, allow at most one (optimal)",
        intuition: "A sorted-then-rotated array has at most one spot where a value drops to its successor (the wrap included).",
        time: "O(n)",
        timeWhy: "A single pass comparing each element to its cyclic neighbor.",
        space: "O(1)",
        spaceWhy: "Only a descent counter.",
        code: `boolean check(int[] nums) {
    int n = nums.length, drops = 0;
    for (int i = 0; i < n; i++) {
        if (nums[i] > nums[(i + 1) % n]) drops++; // cyclic comparison
    }
    return drops <= 1;
}`,
        walkthrough: [
          "nums=[3,4,5,1,2]. Compare cyclically: 3<4 ok, 4<5 ok, 5>1 drop (drops=1), 1<2 ok, 2>3 (wrap) drop (drops=2).",
          "Wait — recount: 2 vs nums[0]=3 → 2<3, no drop. So drops = 1 (only at 5>1).",
          "drops == 1 ≤ 1 → return true.",
        ],
      },
    ],
    edgeCases: [
      "Already non-decreasing array → zero descents (the wrap from last to first is not a strict drop unless last > first) → true.",
      "Single element → no neighbor comparison triggers a drop → true.",
      "All elements equal → no strict descents anywhere → true.",
    ],
    twists: [
      "**Find Minimum in Rotated Sorted Array** (in the library) → instead of validating, locate the seam (the single descent) via binary search.",
      "**Search in Rotated Sorted Array** (in the library) → search within the same one-seam structure.",
      "**Strictly increasing rotation** → forbid duplicates and require descents counted with ≥ at the equal positions.",
    ],
    related: ["find-minimum-in-rotated-sorted-array", "search-in-rotated-sorted-array", "non-decreasing-array"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "sum-of-square-numbers",
    title: "Sum of Square Numbers",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 633,
    statement:
      "Given a non-negative integer `c`, decide whether there exist non-negative integers `a` and `b` such that `a² + b² = c`. Return `true` if such a pair exists.",
    examples: [
      { in: "c = 5", out: "true", explanation: "1² + 2² = 1 + 4 = 5" },
      { in: "c = 3", out: "false", explanation: "no two squares sum to 3" },
      { in: "c = 4", out: "true", explanation: "0² + 2² = 4" },
    ],
    constraints: ["0 ≤ c ≤ 2³¹ − 1"],
    recognize:
      "Searching for two squares that sum to a target is **Two Sum on a sorted implicit line** of candidates 0..√c: a low pointer `a` and a high pointer `b` converge — too small a sum pushes `a` up, too large pushes `b` down.",
    figureItOut: [
      "Neither a nor b can exceed √c, since either square alone cannot surpass c. So the search space for each is the integers from 0 to floor(√c) — a bounded, naturally sorted range.",
      "This is exactly the sorted Two-Sum shape: pick the smallest candidate as a (left pointer at 0) and the largest as b (right pointer at floor(√c)), and look at a² + b².",
      "If a² + b² equals c, you are done. If the sum is too small, the only way to grow it is to increase the smaller square, so move a up. If too large, shrink by moving b down.",
      "Because each move strictly tightens one side and the pointers never cross back, every promising pair is examined exactly once — no value of a needs to be paired with more than the relevant b.",
      "Use long for a*a + b*b because c can be near 2³¹ and the squared sum can overflow a 32-bit int. The pointers sweep a √c-sized range → O(√c) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Check every a up to root c",
        intuition: "For each a from 0 to √c, test whether c − a² is a perfect square.",
        time: "O(√c)",
        timeWhy: "Iterate a over the √c candidates with an O(1) perfect-square test each.",
        space: "O(1)",
        spaceWhy: "Only loop variables.",
        code: `boolean judgeSquareSum(int c) {
    for (long a = 0; a * a <= c; a++) {
        long rest = c - a * a;
        long b = (long) Math.sqrt(rest);
        if (b * b == rest) return true;
    }
    return false;
}`,
      },
      {
        name: "Converging two pointers over 0..root c (optimal)",
        intuition: "Treat a (low) and b (high) as sorted Two-Sum pointers; grow or shrink the squared sum toward c.",
        time: "O(√c)",
        timeWhy: "The two pointers together traverse the 0..√c range once.",
        space: "O(1)",
        spaceWhy: "Two long pointers and nothing else.",
        code: `boolean judgeSquareSum(int c) {
    long a = 0, b = (long) Math.sqrt(c);
    while (a <= b) {
        long sum = a * a + b * b;
        if (sum == c) return true;
        if (sum < c) a++;   // need a bigger square
        else b--;           // sum too large, shrink b
    }
    return false;
}`,
        walkthrough: [
          "c=5. a=0, b=floor(sqrt 5)=2. sum=0+4=4 <5 → a=1.",
          "a=1, b=2. sum=1+4=5 == 5 → return true.",
          "Pair (1,2) found.",
        ],
      },
    ],
    edgeCases: [
      "c == 0 → 0² + 0² = 0 → true.",
      "c a perfect square → b = √c with a = 0 → true.",
      "Large c near 2³¹ → a*a + b*b overflows int, so compute with long.",
    ],
    twists: [
      "**Two Sum II** (in the library) → the identical converging-pointer mechanic over an explicit sorted array.",
      "**Valid Perfect Square** (in the library) → the inner perfect-square test as its own binary-search problem.",
      "**Count all (a,b) pairs** → instead of stopping at the first hit, advance both pointers on a match and tally.",
    ],
    related: ["two-sum-ii", "valid-perfect-square", "sqrtx"],
  },

  {
    slug: "apply-operations-to-an-array",
    title: "Apply Operations to an Array",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 2460,
    statement:
      "You are given a 0-indexed array `nums` of size `n`. Apply, for `i` from `0` to `n−2`: if `nums[i] == nums[i+1]`, double `nums[i]` and set `nums[i+1] = 0`. After all operations, **shift all zeros to the end** while keeping the non-zero order, and return the result.",
    examples: [
      { in: "nums = [1,2,2,1,1,0]", out: "[1,4,2,0,0,0]", explanation: "merge the two 2s into 4 and the two 1s into 2, then push zeros right" },
      { in: "nums = [0,1]", out: "[1,0]", explanation: "no merges; the zero moves to the end" },
    ],
    constraints: ["2 ≤ nums.length ≤ 2000", "0 ≤ nums[i] ≤ 1000"],
    recognize:
      "Two clean phases: a left-to-right **merge pass** on adjacent equals, then a **slow/fast two-pointer compaction** that streams non-zeros forward and pads zeros — the same write-pointer idea as Move Zeroes.",
    figureItOut: [
      "The operation is strictly defined to run left to right in order, and each step only looks at i and i+1. So a single forward pass performs every merge — doubling nums[i] and zeroing nums[i+1] when they match.",
      "Crucially the operations are applied to the ORIGINAL ordering before any shifting, so do all merges first and only then move zeros. Mixing the two would change which neighbors are equal.",
      "After merging, the array is a mix of values and zeros in place. The zero-shift is the classic Move-Zeroes compaction: a write pointer marks where the next non-zero goes.",
      "Walk the array with a read index; each non-zero value is copied to the write pointer, which then advances. Once reading finishes, every slot from the write pointer onward is filled with zeros.",
      "The merge pass is O(n) and the compaction is O(n) → O(n) time overall, O(1) extra space (everything done in place on the array).",
    ],
    approaches: [
      {
        name: "Merge pass + slow/fast zero compaction (optimal)",
        intuition: "Do all adjacent-equal merges left to right, then stream non-zeros forward with a write pointer and pad zeros.",
        time: "O(n)",
        timeWhy: "One pass to merge, one pass to compact.",
        space: "O(1)",
        spaceWhy: "In-place writes with a single write index.",
        code: `int[] applyOperations(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n - 1; i++) {
        if (nums[i] == nums[i + 1]) {
            nums[i] *= 2;
            nums[i + 1] = 0;
        }
    }
    int write = 0;
    for (int read = 0; read < n; read++) {
        if (nums[read] != 0) {
            nums[write++] = nums[read]; // stream non-zeros forward
        }
    }
    while (write < n) nums[write++] = 0; // pad remaining with zeros
    return nums;
}`,
        walkthrough: [
          "nums=[1,2,2,1,1,0]. Merge pass: i=1 nums[1]==nums[2]=2 → [1,4,0,1,1,0]; i=3 nums[3]==nums[4]=1 → [1,4,0,2,0,0].",
          "Compact non-zeros: write 1,4,2 to front → [1,4,2,...]; pad zeros → [1,4,2,0,0,0].",
          "Return [1,4,2,0,0,0].",
        ],
      },
    ],
    edgeCases: [
      "No adjacent equals → merge pass changes nothing; only zero-shifting runs.",
      "A run of three equal values → only the first adjacent pair merges (operations are pairwise, left to right), the third stays.",
      "Already-present zeros → they get pushed to the end alongside any newly created zeros.",
    ],
    twists: [
      "**Move Zeroes** (in the library) → the compaction phase in isolation.",
      "**Merge from the right** → reversing the operation direction changes which pairs combine.",
      "**Remove Element** (in the library) → the same write-pointer compaction filtering by a predicate instead of zero.",
    ],
    related: ["move-zeroes", "remove-element", "remove-duplicates-from-sorted-array"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "longest-nice-subarray",
    title: "Longest Nice Subarray",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 2401,
    statement:
      "You are given an array `nums` of positive integers. A subarray is **nice** if the bitwise **AND** of every pair of elements in it is 0 — equivalently, no two elements share a set bit. Return the length of the **longest nice subarray**.",
    examples: [
      { in: "nums = [1,3,8,48,10]", out: "3", explanation: "[3,8,48] is nice: 3, 8, 48 share no common set bit" },
      { in: "nums = [3,1,5,11,13]", out: "1", explanation: "no two adjacent-or-wider elements are bit-disjoint, so length 1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁹"],
    recognize:
      "'No two elements in the window share a set bit' is a **variable-size sliding window** whose state is a single integer OR-mask of the window's bits; a clash (new element AND mask != 0) forces shrinking from the left, removing bits via XOR.",
    figureItOut: [
      "'Every pair ANDs to 0' is the same as 'all elements together use disjoint bits'. So the window's entire state collapses to one running OR of all its elements — a bitmask of which bits are currently occupied.",
      "When extending the window with nums[right], it fits only if it shares NO bit with the current mask, i.e. (mask AND nums[right]) == 0. If they share a bit, the window can no longer be nice.",
      "On a clash, shrink from the left: remove nums[left] from the mask. Because the mask is an OR of disjoint values, removing one element's bits is exact — XOR mask with nums[left] clears precisely its bits. Keep shrinking until nums[right] fits.",
      "Once it fits, OR nums[right] into the mask and record the window length. Every right index yields the longest nice window ending there, so the running maximum is the answer.",
      "Each element is added to the mask once and removed at most once, so the pointers move O(n) total with O(1) bit operations → O(n) time, O(1) space (just the mask).",
    ],
    approaches: [
      {
        name: "Sliding window with an OR-mask of bits (optimal)",
        intuition: "Keep the window's bits in one OR-mask; on a shared bit, shrink from the left (XOR out elements) until the new value fits.",
        time: "O(n)",
        timeWhy: "Each element enters and leaves the mask at most once.",
        space: "O(1)",
        spaceWhy: "A single integer mask and pointers.",
        code: `int longestNiceSubarray(int[] nums) {
    int left = 0, mask = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        while ((mask & nums[right]) != 0) {  // shares a bit → shrink
            mask ^= nums[left];              // remove left element's bits
            left++;
        }
        mask |= nums[right];                 // add the new element's bits
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        walkthrough: [
          "nums=[1,3,8,48,10]. right=0 (1): mask=1, best=1. right=1 (3): 1&3=1 clash → remove 1 (mask=0,left=1); mask=3, best=1.",
          "right=2 (8): 3&8=0, mask=11(binary 1011), best=2. right=3 (48): 11&48=0, mask=59, best=3.",
          "right=4 (10): 59&10!=0 → shrink, but window stays ≤3. Best = 3.",
        ],
      },
    ],
    edgeCases: [
      "No two elements bit-disjoint → every window of length 1 is nice → answer 1.",
      "All elements bit-disjoint → the whole array is nice → answer n.",
      "Single element → trivially nice → answer 1.",
    ],
    twists: [
      "**Longest Substring Without Repeating Characters** (in the library) → identical shrink-on-conflict window, with a set of chars instead of an OR-mask.",
      "**Maximum Erasure Value** (in the library) → another distinct-window variant, here distinctness of values rather than bits.",
      "**At most one shared bit allowed** → relax the predicate, turning the mask into a per-bit count.",
    ],
    related: ["longest-substring-without-repeating", "maximum-erasure-value", "single-number"],
  },

  {
    slug: "maximum-sum-of-distinct-subarrays-with-length-k",
    title: "Maximum Sum of Distinct Subarrays With Length K",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 2461,
    statement:
      "You are given an integer array `nums` and an integer `k`. Find the **maximum subarray sum** of all subarrays of length exactly `k` whose elements are **all distinct**. If no such subarray exists, return 0.",
    examples: [
      { in: "nums = [1,5,4,2,9,9,9], k = 3", out: "15", explanation: "[5,4,2] sums to 11, [4,2,9] to 15 (distinct); [2,9,9] not distinct" },
      { in: "nums = [4,4,4], k = 3", out: "0", explanation: "the only length-3 window has duplicates → 0" },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁵"],
    recognize:
      "A **fixed-size sliding window** of width k where each step adds the entering element and drops the leaving one — maintaining both a running sum and a frequency map so 'all distinct' reduces to 'map size == k'.",
    figureItOut: [
      "The window width is FIXED at k, so unlike a variable window you never shrink for length — you slide: every new right index pushes one element in and pops one out the left, keeping width k.",
      "Two pieces of state ride along: a running sum of the window's elements, and a frequency map (or counts array) telling how many of each value sit inside.",
      "When the window has reached width k, 'all distinct' is exactly 'the map has k distinct keys', because k elements with k distinct keys means no repeats. Equivalently, every count in the window is 1.",
      "Slide by one: add nums[right] to the sum and bump its count; once the window exceeds width k, subtract nums[right−k] from the sum and decrement its count (removing the key when it hits zero). After each full-width window, if it is distinct, update the best sum.",
      "Each element is added once and removed once with O(1) map work → O(n) time, O(k) space for the window's frequency map.",
    ],
    approaches: [
      {
        name: "Fixed-size window with sum + frequency map (optimal)",
        intuition: "Slide a width-k window keeping a running sum and counts; whenever the window holds k distinct values, update the max.",
        time: "O(n)",
        timeWhy: "Each element enters and leaves the window exactly once with O(1) map updates.",
        space: "O(k)",
        spaceWhy: "The frequency map never exceeds k distinct keys.",
        code: `long maximumSubarraySum(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    long sum = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        count.merge(nums[right], 1, Integer::sum);
        if (right >= k) {                    // window now wider than k, drop the left
            int leaving = nums[right - k];
            sum -= leaving;
            if (count.merge(leaving, -1, Integer::sum) == 0) count.remove(leaving);
        }
        if (right >= k - 1 && count.size() == k) { // full width and all distinct
            best = Math.max(best, sum);
        }
    }
    return best;
}`,
        walkthrough: [
          "nums=[1,5,4,2,9,9,9], k=3. Window [1,5,4] distinct (size 3) sum 10 → best 10. Slide to [5,4,2] sum 11, distinct → best 11.",
          "[4,2,9] sum 15 distinct → best 15. [2,9,9] count size 2 (not k) → skip. Remaining windows have duplicate 9s.",
          "Return 15.",
        ],
      },
    ],
    edgeCases: [
      "No length-k window is fully distinct → best stays 0.",
      "k == 1 → every single element is trivially distinct → answer is the maximum element.",
      "k == nums.length → only one window; it qualifies only if the whole array is distinct.",
    ],
    twists: [
      "**Maximum Average Subarray I** (in the library) → the same fixed-window sum, without the distinctness requirement.",
      "**Maximum Number of Vowels in a Substring of Given Length** (in the library) → fixed-window counting of a property instead of summing.",
      "**At most one duplicate allowed** → loosen 'size == k' to 'size >= k−1'.",
    ],
    related: ["maximum-average-subarray-i", "maximum-number-of-vowels-in-a-substring-of-given-length", "maximum-erasure-value"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "remove-duplicate-letters",
    title: "Remove Duplicate Letters",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 316,
    statement:
      "Given a string `s`, remove duplicate letters so that every letter appears **exactly once**, and the result is the **smallest in lexicographical order** among all such unique-letter strings. Return that result.",
    examples: [
      { in: 's = "bcabc"', out: '"abc"', explanation: "each letter once and lexicographically smallest" },
      { in: 's = "cbacdcbc"', out: '"acdb"', explanation: "the smallest unique-letter arrangement preserving feasibility" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of lowercase English letters"],
    recognize:
      "Building the lexicographically smallest result while keeping one of each letter is a **monotonic stack with a 'can I drop this later' guard**: pop a larger letter off the top when a smaller one arrives, but only if the popped letter still appears later in the string.",
    figureItOut: [
      "You are choosing, greedily left to right, which letters to keep so the final string is as small as possible while containing each distinct letter exactly once. A stack naturally builds the answer in order.",
      "The greedy rule: when the incoming letter c is SMALLER than the letter on top of the stack, that top letter is making the result bigger than necessary — pop it, so c can sit earlier. This is the monotonic-stack move.",
      "But you may only pop the top letter if it occurs AGAIN later in s; otherwise removing it now means losing it forever and the result would miss a required letter. So track the remaining count of each letter as you advance.",
      "Also skip letters already on the stack — each distinct letter appears once, so if c is already present you ignore this occurrence (after still decrementing its remaining count). An 'in-stack' boolean array tracks membership.",
      "For each character: decrement its remaining count; if already in the stack, skip; otherwise pop while the top is larger AND still available later, then push c and mark it. Each letter is pushed and popped at most once → O(n) time, O(1) space (26-letter arrays + stack).",
    ],
    approaches: [
      {
        name: "Monotonic stack with future-availability guard (optimal)",
        intuition: "Greedily pop a larger top letter when a smaller one arrives, but only if that top letter still appears later; skip letters already kept.",
        time: "O(n)",
        timeWhy: "Each character is pushed and popped at most once; the stack work is amortized linear.",
        space: "O(1)",
        spaceWhy: "Fixed 26-element count and in-stack arrays plus a stack bounded by 26 distinct letters.",
        code: `String removeDuplicateLetters(String s) {
    int[] remaining = new int[26];
    boolean[] inStack = new boolean[26];
    for (int i = 0; i < s.length(); i++) remaining[s.charAt(i) - 'a']++;
    Deque<Character> stack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        remaining[c - 'a']--;            // this occurrence is now used up
        if (inStack[c - 'a']) continue;  // already kept this letter
        while (!stack.isEmpty() && stack.peek() > c
               && remaining[stack.peek() - 'a'] > 0) {
            inStack[stack.pop() - 'a'] = false; // drop a bigger letter we can re-add later
        }
        stack.push(c);
        inStack[c - 'a'] = true;
    }
    StringBuilder sb = new StringBuilder();
    while (!stack.isEmpty()) sb.append(stack.pop());
    return sb.reverse().toString();
}`,
        walkthrough: [
          's="cbacdcbc". Push c (rem c later yes). b<c and c appears later → pop c, push b. a<b and b later → pop b, push a; a<c... push c then d.',
          "Reaching second c: already in stack → skip. d done; b: d>b and d not later? d does not reappear → cannot pop, push b. Final c already in stack → skip.",
          "Stack bottom→top a,c,d,b → result \"acdb\".",
        ],
      },
    ],
    edgeCases: [
      "All distinct letters already → nothing is popped, the string is returned unchanged.",
      "All identical letters → only one copy is kept.",
      "A larger letter that never reappears → it cannot be popped, so it stays in place to remain present.",
    ],
    twists: [
      "**Remove K Digits** (in the library) → the same pop-larger-on-arrival monotonic stack, bounded by a removal budget instead of uniqueness.",
      "**Smallest Subsequence of Distinct Characters** → the identical problem under a different name.",
      "**Largest result instead** → flip the comparison to pop smaller tops for the lexicographically largest unique-letter string.",
    ],
    related: ["remove-k-digits", "daily-temperatures", "online-stock-span"],
  },

  {
    slug: "sum-of-subarray-minimums",
    title: "Sum of Subarray Minimums",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 907,
    statement:
      "Given an array of integers `arr`, return the **sum of the minimum value of every contiguous subarray** of `arr`. Because the answer can be large, return it **modulo 10⁹ + 7**.",
    examples: [
      { in: "arr = [3,1,2,4]", out: "17", explanation: "minimums over all subarrays sum to 17" },
      { in: "arr = [11,81,94,43,3]", out: "444" },
    ],
    constraints: ["1 ≤ arr.length ≤ 3·10⁴", "1 ≤ arr[i] ≤ 3·10⁴"],
    recognize:
      "Summing every subarray's minimum is a **contribution count via a monotonic stack**: for each element, count how many subarrays have IT as the minimum (span between the previous strictly-smaller and next smaller-or-equal element), then weight its value by that count.",
    figureItOut: [
      "Brute force enumerates O(n²) subarrays. The trick is to flip the question: instead of 'what is each subarray's min', ask 'for each element, in how many subarrays is it the minimum'. Then total = sum of value · (its subarray count).",
      "Element arr[i] is the minimum of a subarray exactly when the subarray lies within the stretch where arr[i] is the smallest. Let L = number of consecutive elements to the left that are strictly greater (so arr[i] stays the min), and R = number to the right that are greater-or-equal.",
      "The count of subarrays whose minimum is arr[i] is (L + 1) · (R + 1): you may extend the left boundary into any of L+1 starting positions and the right boundary into any of R+1 ending positions.",
      "The strict-vs-nonstrict split on the two sides is what prevents double counting when equal values appear: ties are attributed to exactly one of the equal elements (here, left uses strictly-greater, right uses greater-or-equal).",
      "A monotonic increasing stack finds, for every index, the previous-less and next-less-or-equal boundaries in linear time. Each element is pushed and popped once → O(n) time, O(n) stack space; accumulate the weighted sum modulo 1e9+7.",
    ],
    approaches: [
      {
        name: "Brute force min over every subarray",
        intuition: "For each start, extend the end, tracking the running minimum and adding it.",
        time: "O(n²)",
        timeWhy: "Two nested loops over all subarray endpoints.",
        space: "O(1)",
        spaceWhy: "Only the running minimum and accumulator.",
        code: `int sumSubarrayMins(int[] arr) {
    long mod = 1_000_000_007L, total = 0;
    for (int i = 0; i < arr.length; i++) {
        int min = arr[i];
        for (int j = i; j < arr.length; j++) {
            min = Math.min(min, arr[j]);
            total = (total + min) % mod;
        }
    }
    return (int) total;
}`,
      },
      {
        name: "Monotonic stack contribution counting (optimal)",
        intuition: "Each element contributes value · (left span) · (right span), the number of subarrays it minimizes; a monotonic stack finds the spans.",
        time: "O(n)",
        timeWhy: "Each index is pushed and popped from the stack once across both boundary scans.",
        space: "O(n)",
        spaceWhy: "Two boundary arrays and a stack sized by n.",
        code: `int sumSubarrayMins(int[] arr) {
    long mod = 1_000_000_007L;
    int n = arr.length;
    int[] left = new int[n];   // count of elements to the left strictly greater
    int[] right = new int[n];  // count of elements to the right greater or equal
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && arr[stack.peek()] > arr[i]) stack.pop();
        left[i] = stack.isEmpty() ? i + 1 : i - stack.peek();
        stack.push(i);
    }
    stack.clear();
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) stack.pop();
        right[i] = stack.isEmpty() ? n - i : stack.peek() - i;
        stack.push(i);
    }
    long total = 0;
    for (int i = 0; i < n; i++) {
        total = (total + (long) arr[i] * left[i] % mod * right[i]) % mod;
    }
    return (int) total;
}`,
        walkthrough: [
          "arr=[3,1,2,4]. For value 1 at index 1: left span = 2 (3 to its left is greater, plus itself), right span = 3 (2 and 4 are greater, plus itself) → 1·2·3 = 6 subarrays minimized by 1.",
          "Value 3: left 1, right 1 → 3. Value 2: left 1, right 2 → 4. Value 4: left 1, right 1 → 4.",
          "Total = 3·1 + 1·6 + 2·2 + 4·1 = 3 + 6 + 4 + 4 = 17.",
        ],
      },
    ],
    edgeCases: [
      "Duplicate values → the strict-left, non-strict-right boundary rule attributes each subarray's min to exactly one element, avoiding double counting.",
      "Strictly increasing array → each element minimizes only the subarrays starting at it.",
      "Large sums → accumulate modulo 1e9+7 using long to prevent overflow.",
    ],
    twists: [
      "**Sum of subarray MAXIMUMS** → flip the stack comparisons; total max sum minus min sum gives subarray range sums.",
      "**Largest Rectangle in Histogram** (in the library) → the same previous/next-smaller boundary technique for areas.",
      "**Daily Temperatures** (in the library) → a monotonic stack finding the next-greater boundary in one direction.",
    ],
    related: ["largest-rectangle-in-histogram", "daily-temperatures", "next-greater-element-ii"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "minimum-number-of-days-to-make-m-bouquets",
    title: "Minimum Number of Days to Make m Bouquets",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1482,
    statement:
      "You are given `bloomDay`, where `bloomDay[i]` is the day flower `i` blooms, plus integers `m` and `k`. Each bouquet needs `k` **adjacent** bloomed flowers. Return the **minimum number of days** to make `m` bouquets, or `-1` if it is impossible.",
    examples: [
      { in: "bloomDay = [1,10,3,10,2], m = 3, k = 1", out: "3", explanation: "by day 3 flowers on days ≤3 are bloomed; 3 single-flower bouquets possible" },
      { in: "bloomDay = [1,10,3,10,2], m = 3, k = 2", out: "-1", explanation: "need 6 flowers but only 5 exist → impossible" },
      { in: "bloomDay = [7,7,7,7,12,7,7], m = 2, k = 3", out: "12", explanation: "by day 12 there are two runs of 3 adjacent bloomed flowers" },
    ],
    constraints: ["1 ≤ bloomDay.length ≤ 10⁵", "1 ≤ bloomDay[i] ≤ 10⁹", "1 ≤ m ≤ 10⁶", "1 ≤ k ≤ bloomDay.length"],
    recognize:
      "'Minimum day such that we can form m bouquets' is **binary search on the answer**: feasibility (can we make m bouquets by day d) is monotonic — more days only adds bloomed flowers — so search the smallest feasible day with a linear greedy check.",
    figureItOut: [
      "First the impossibility gate: making m bouquets of k flowers each needs m·k flowers total. If that exceeds the array length, return −1 immediately (use long to avoid overflow on m·k).",
      "The key monotonicity: if you CAN make m bouquets by day d, you can also make them by any later day, since waiting only blooms more flowers, never un-blooms. So feasibility flips from false to true at one threshold day — perfect for binary search.",
      "Search the day over the range [min bloomDay, max bloomDay]. For a candidate day d, run a greedy linear scan: count consecutive flowers that have bloomed (bloomDay ≤ d); every time the run reaches k, complete a bouquet and reset the run. A flower not yet bloomed breaks the run.",
      "If the greedy scan yields at least m bouquets, day d is feasible — try an earlier day (move the high bound down). Otherwise day d is too early (move the low bound up).",
      "Each feasibility check is O(n); binary search runs O(log(maxDay − minDay)) times → O(n log(maxDay)) time, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Binary search on the day + greedy feasibility (optimal)",
        intuition: "Feasibility is monotonic in the day; binary-search the smallest day where a greedy adjacency scan yields m bouquets.",
        time: "O(n log(maxDay))",
        timeWhy: "An O(n) greedy check inside a binary search over the day range.",
        space: "O(1)",
        spaceWhy: "Only counters and bounds.",
        code: `int minDays(int[] bloomDay, int m, int k) {
    long need = (long) m * k;
    if (need > bloomDay.length) return -1;
    int lo = Integer.MAX_VALUE, hi = 0;
    for (int d : bloomDay) { lo = Math.min(lo, d); hi = Math.max(hi, d); }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canMake(bloomDay, m, k, mid)) hi = mid; // feasible, try earlier
        else lo = mid + 1;                          // too early, go later
    }
    return lo;
}

// greedy: how many bouquets can we form by day d?
private boolean canMake(int[] bloomDay, int m, int k, int day) {
    int bouquets = 0, run = 0;
    for (int b : bloomDay) {
        if (b <= day) {
            run++;
            if (run == k) { bouquets++; run = 0; }
        } else {
            run = 0; // not bloomed, break the adjacency run
        }
    }
    return bouquets >= m;
}`,
        walkthrough: [
          "bloomDay=[7,7,7,7,12,7,7], m=2, k=3. need=6 ≤ 7 ok. Range [7,12]. Try day 7: bloomed mask 7,7,7,7,X,7,7 → first run of 4 gives 1 bouquet, then run 2 (broken by 12) gives 0 → 1 bouquet < 2 infeasible.",
          "Move up. Try day 12: all bloomed → runs of 7 give floor(7/3)=2 bouquets ≥ 2 → feasible, lower hi to 12. Converge at 12.",
          "Return 12.",
        ],
      },
    ],
    edgeCases: [
      "m·k exceeds the number of flowers → impossible → return −1 (compute m·k as long).",
      "k == 1 → adjacency is trivial; the answer is the m-th smallest bloom day.",
      "All flowers bloom the same day → that day is the answer if feasible at all.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary search on an answer with a monotonic O(n) feasibility check.",
      "**Capacity To Ship Packages Within D Days** (in the library) → minimize a parameter under a greedy feasibility predicate.",
      "**Bouquets need non-adjacent flowers** → the greedy run logic changes, but the binary-search-on-answer scaffold stays.",
    ],
    related: ["koko-eating-bananas", "capacity-to-ship-packages-within-d-days", "split-array-largest-sum"],
  },

  {
    slug: "heaters",
    title: "Heaters",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 475,
    statement:
      "Given positions of `houses` and `heaters` on a horizontal line, find the **minimum radius** of the heaters so that every house is covered. All heaters share the same radius. Return that minimum radius.",
    examples: [
      { in: "houses = [1,2,3], heaters = [2]", out: "1", explanation: "a radius of 1 lets the heater at 2 reach houses 1 and 3" },
      { in: "houses = [1,2,3,4], heaters = [1,4]", out: "1", explanation: "each house is within 1 of a heater" },
      { in: "houses = [1,5], heaters = [2]", out: "3", explanation: "house 5 is distance 3 from the only heater" },
    ],
    constraints: ["1 ≤ houses.length, heaters.length ≤ 3·10⁴", "1 ≤ houses[i], heaters[i] ≤ 10⁹"],
    recognize:
      "Each house only cares about its NEAREST heater; with heaters **sorted**, that nearest distance is a **binary-search nearest-neighbor** query, and the answer is the maximum over all houses of that minimum distance.",
    figureItOut: [
      "A single shared radius must cover every house, so the radius must be at least each house's distance to its closest heater. The minimum sufficient radius is therefore the MAXIMUM, over all houses, of (distance to nearest heater).",
      "For one house, the nearest heater is found fast if heaters are SORTED: binary-search for where the house position would insert, then the nearest heater is either the one just at/after that index or the one just before it.",
      "Compute both candidate distances (to the heater at the insertion point, if any, and to the heater just before it, if any) and take the smaller — that is this house's required radius.",
      "Track the running maximum of these per-house minimums across all houses; that maximum is the smallest radius covering everyone simultaneously.",
      "Sort heaters once (O(h log h)); each of the n houses does an O(log h) search → O((n + h) log h) time, O(1) extra space beyond the sort.",
    ],
    approaches: [
      {
        name: "Sort heaters + nearest-heater binary search per house (optimal)",
        intuition: "For each house find its closest heater via binary search; the answer is the worst (largest) of those nearest distances.",
        time: "O((n + h) log h)",
        timeWhy: "Sort the h heaters, then an O(log h) nearest search for each of n houses.",
        space: "O(1)",
        spaceWhy: "Sorting is in place; only the running maximum and indices.",
        code: `int findRadius(int[] houses, int[] heaters) {
    Arrays.sort(heaters);
    int radius = 0;
    for (int house : houses) {
        int idx = lowerBound(heaters, house); // first heater >= house
        int best = Integer.MAX_VALUE;
        if (idx < heaters.length) best = Math.min(best, heaters[idx] - house);
        if (idx > 0) best = Math.min(best, house - heaters[idx - 1]);
        radius = Math.max(radius, best);
    }
    return radius;
}

private int lowerBound(int[] a, int target) {
    int lo = 0, hi = a.length; // search range [0, length]
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
        walkthrough: [
          "houses=[1,5], heaters sorted=[2]. House 1: lowerBound(1)=0; heater[0]-1=1; no heater before → best 1.",
          "House 5: lowerBound(5)=1 (past end); only heater before, 5-heater[0]=5-2=3 → best 3.",
          "Max(1,3) = 3 → return 3.",
        ],
      },
    ],
    edgeCases: [
      "A house exactly at a heater → distance 0, contributes nothing to the max.",
      "House before all heaters → only the first heater (insertion index) matters; no left neighbor.",
      "House after all heaters → insertion index past the end; only the last heater (idx−1) matters.",
    ],
    twists: [
      "**Find K Closest Elements** (in the library) → the same sorted nearest-neighbor search, returning a window rather than one distance.",
      "**Binary search on the radius** → an alternative: search the answer and greedily verify coverage, the search-the-answer pattern.",
      "**Per-heater independent radii** → drop the shared-radius constraint and each house simply picks any covering heater.",
    ],
    related: ["find-k-closest-elements", "find-first-and-last-position-of-element-in-sorted-array", "search-insert-position"],
  },

  {
    slug: "magnetic-force-between-two-balls",
    title: "Magnetic Force Between Two Balls",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1552,
    statement:
      "You are given `position` of `n` baskets on a line and an integer `m` balls. The magnetic force between two balls is the distance between their baskets. Distribute the `m` balls into baskets so that the **minimum** magnetic force between any two balls is **as large as possible**, and return that maximized minimum force.",
    examples: [
      { in: "position = [1,2,3,4,7], m = 3", out: "3", explanation: "place balls at 1, 4, 7; the minimum gap is 3" },
      { in: "position = [5,4,3,2,1,1000000000], m = 2", out: "999999999", explanation: "place the two balls at the extremes" },
    ],
    constraints: ["n == position.length", "2 ≤ n ≤ 10⁵", "1 ≤ position[i] ≤ 10⁹", "all positions are distinct", "2 ≤ m ≤ position.length"],
    recognize:
      "'Maximize the minimum gap' is **binary search on the answer**: feasibility (can we place m balls each at least gap apart) is monotonic — a smaller required gap is only easier — so search the largest gap a greedy left-to-right placement can satisfy.",
    figureItOut: [
      "We control where the balls go; the score is the smallest pairwise distance. Maximizing that smallest distance is a max-min objective, the signature of binary search on the answer value.",
      "Sort the positions so 'distance' becomes the gap along the sorted line. Now the question for a candidate minimum gap g is purely yes/no: can we place all m balls so consecutive balls are at least g apart?",
      "Feasibility is monotonic in g: if a gap g works, any smaller gap also works (it is a looser requirement), and if g fails, every larger gap fails too. So feasibility flips once — binary-search g over [1, maxPos − minPos].",
      "The greedy check for a given g: place the first ball at the smallest position, then walk rightward placing a ball at the first basket at least g beyond the last placed ball. Count how many balls fit; if at least m, g is feasible.",
      "Greedy placement is O(n); binary search runs O(log(range)) iterations → O(n log(maxPos)) time after the O(n log n) sort, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Sort + binary search on the gap with greedy placement (optimal)",
        intuition: "Binary-search the largest minimum gap; for each candidate, greedily place balls left to right and check at least m fit.",
        time: "O(n log n + n log(maxPos))",
        timeWhy: "Sorting dominates setup; each of O(log(range)) feasibility checks is an O(n) greedy scan.",
        space: "O(1)",
        spaceWhy: "Sorting is in place; only counters and bounds.",
        code: `int maxDistance(int[] position, int m) {
    Arrays.sort(position);
    int n = position.length;
    int lo = 1, hi = position[n - 1] - position[0], answer = 0;
    while (lo <= hi) {
        int gap = lo + (hi - lo) / 2;
        if (canPlace(position, m, gap)) {
            answer = gap;    // feasible, try a larger gap
            lo = gap + 1;
        } else {
            hi = gap - 1;    // too large, shrink the gap
        }
    }
    return answer;
}

// greedy: can we place m balls each at least gap apart?
private boolean canPlace(int[] position, int m, int gap) {
    int placed = 1, last = position[0];
    for (int i = 1; i < position.length; i++) {
        if (position[i] - last >= gap) {
            placed++;
            last = position[i];
            if (placed == m) return true;
        }
    }
    return placed >= m;
}`,
        walkthrough: [
          "position sorted=[1,2,3,4,7], m=3. Range [1,6]. Try gap=3: place at 1, next >=4 is 4, next >=7 is 7 → 3 balls placed → feasible, raise lo.",
          "Try gap=4: place at 1, next >=5 is 7 → only 2 balls → infeasible, lower hi. Try gap=... converges with answer 3.",
          "Return 3.",
        ],
      },
    ],
    edgeCases: [
      "m == 2 → the best is simply the full span maxPos − minPos (balls at the two ends).",
      "m == n → every basket gets a ball; the answer is the smallest adjacent gap in the sorted positions.",
      "Large positions up to 10⁹ → the gap range fits in int, but the span subtraction stays within range since positions are positive.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → the same binary-search-on-answer with a monotonic greedy feasibility check.",
      "**Split Array Largest Sum** (in the library) → a min-max objective searched the same way, minimizing a maximum.",
      "**Minimum Number of Days to Make m Bouquets** (in this file) → another greedy-feasibility binary search on a parameter.",
    ],
    related: ["koko-eating-bananas", "split-array-largest-sum", "minimum-number-of-days-to-make-m-bouquets"],
  },
];
