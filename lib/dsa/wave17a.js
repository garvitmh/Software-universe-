// NeetCode/Top-150/LeetCode-75/Grind-75 — wave 17a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave16a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE17A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "find-all-duplicates-in-an-array",
    title: "Find All Duplicates in an Array",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 442,
    statement:
      "Given an integer array `nums` of length `n` where every value is in the range `[1, n]` and each value appears **once or twice**, return an array of all the values that appear **twice**. You must solve it without extra space for a set and in linear time (the input array may be modified).",
    examples: [
      { in: "nums = [4,3,2,7,8,2,3,1]", out: "[2,3]", explanation: "2 and 3 each appear twice; the rest appear once" },
      { in: "nums = [1,1,2]", out: "[1]", explanation: "only 1 is repeated" },
      { in: "nums = [1]", out: "[]", explanation: "no value appears twice" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 10^5", "1 ≤ nums[i] ≤ n", "each element appears once or twice"],
    recognize:
      "Values living exactly in `[1, n]` inside an array of length `n` is the **index-as-hash** signal: use each value to point at a slot and flip that slot's sign to mark 'seen', so the array itself becomes the frequency table with O(1) extra space.",
    figureItOut: [
      "The values are bounded to [1, n] and the array also has length n. That is not a coincidence — it means a value v can be used to address slot v-1 of the SAME array, turning the array into its own hash table without an external set.",
      "Walk the array. For the current value v (take its absolute value, since we will be flipping signs), look at slot index v-1. If that slot is already negative, then some earlier element already pointed here, so v has been seen before — it is a duplicate.",
      "If the slot at v-1 is still positive, this is the first time we land on it, so mark it: negate nums[v-1]. The SIGN of slot j now encodes whether the value j+1 has been seen yet, while the magnitude still preserves the original value (we always take abs before using it).",
      "Always read the magnitude, never the raw signed value, when computing the index — otherwise a previously negated slot would give the wrong address. The negation is purely a one-bit 'seen' flag layered on top of the data.",
      "One pass marks and detects in O(n) time; the only extra space is the output list itself, so O(1) auxiliary space. Restoring signs afterward is optional unless the caller needs the array intact.",
    ],
    approaches: [
      {
        name: "Hash set of seen values",
        intuition: "Track seen values in a set; the second time you meet a value, record it.",
        time: "O(n)",
        timeWhy: "One pass with O(1) set operations.",
        space: "O(n)",
        spaceWhy: "The set can hold up to n distinct values.",
        code: `List<Integer> findDuplicates(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    List<Integer> res = new ArrayList<>();
    for (int v : nums) {
        if (!seen.add(v)) res.add(v);   // add returns false if already present
    }
    return res;
}`,
      },
      {
        name: "Index-as-hash with sign flipping (optimal)",
        intuition: "Use each value to index a slot and negate it; meeting an already-negative slot means the value repeated.",
        time: "O(n)",
        timeWhy: "A single pass; each element is visited once.",
        space: "O(1)",
        spaceWhy: "Only the output list; the input array doubles as the seen-marker store.",
        code: `List<Integer> findDuplicates(int[] nums) {
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        int v = Math.abs(nums[i]);     // raw value, ignoring any sign flag
        int idx = v - 1;               // slot this value addresses
        if (nums[idx] < 0) {
            res.add(v);                // slot already marked -> seen before
        } else {
            nums[idx] = -nums[idx];    // mark this value as seen
        }
    }
    return res;
}`,
        walkthrough: [
          "nums=[4,3,2,7,8,2,3,1]. v=4 -> slot 3 positive, negate. v=3 -> slot 2, negate. v=2 -> slot 1, negate. v=7 -> slot 6, negate. v=8 -> slot 7, negate.",
          "v=2 again (read abs) -> slot 1 already negative -> add 2. v=3 again -> slot 2 already negative -> add 3. v=1 -> slot 0 positive, negate.",
          "Duplicates collected: [2,3].",
        ],
      },
    ],
    edgeCases: [
      "No duplicates → empty result; every slot is negated exactly once.",
      "Single element → loop marks one slot, returns empty.",
      "All values distinct covering 1..n → no slot is ever revisited.",
    ],
    twists: [
      "**Find All Numbers Disappeared in an Array** (in the library) → same sign-flip trick; the unmarked slots are the MISSING values.",
      "**First Missing Positive** (in the library) → index-as-hash with in-place placement instead of sign flags.",
      "**Set Mismatch** (in the library) → find both the duplicated and the missing value at once.",
    ],
    related: ["find-all-numbers-disappeared-in-an-array", "first-missing-positive", "set-mismatch"],
  },

  {
    slug: "minimum-number-of-operations-to-make-array-empty",
    title: "Minimum Number of Operations to Make Array Empty",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 2870,
    statement:
      "You are given an array `nums` of positive integers. In one operation you may remove **two** elements of equal value, or **three** elements of equal value. Return the **minimum** number of operations to empty the array, or `-1` if it is impossible.",
    examples: [
      { in: "nums = [2,3,3,2,2,4,2,3,4]", out: "4", explanation: "remove the three 2s elsewhere... group counts: 2 appears 4 times, 3 appears 3 times, 4 appears 2 times -> 2 + 1 + 1 = 4" },
      { in: "nums = [2,1,2,2,3,3]", out: "-1", explanation: "the value 1 appears only once and cannot be removed in groups of 2 or 3" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10^5", "1 ≤ nums[i] ≤ 10^6"],
    recognize:
      "Removing equal values in groups of 2 or 3 means each distinct value is solved INDEPENDENTLY by its count — a **count-then-arithmetic** problem: tally frequencies with a hash map, then convert each count to a minimal number of 2s and 3s.",
    figureItOut: [
      "Operations only ever remove elements of the SAME value, so different values never interact. That means the problem decomposes: for each distinct value, given how many copies c it has, find the fewest groups of size 2 or 3 that sum to c. Add those across all values.",
      "First detect impossibility: a count of exactly 1 can never be cleared (no group of 2 or 3 fits a single element), so the whole answer is -1. Every count of 2 or more can be cleared.",
      "For a clearable count c, we want to use as many 3s as possible because 3 removes more per operation than 2. So the natural guess is ceil(c / 3) operations.",
      "Check the leftover: c mod 3 is 0 (perfect 3s), 1, or 2. If it is 0, use c/3 threes. If it is 2, use c/3 threes plus one 2 -> c/3 + 1, which equals ceil(c/3). If it is 1, we cannot end on a lone 1, so convert one triple into two pairs: (c/3 - 1) threes + two 2s = c/3 + 1, which is also ceil(c/3) (as long as c >= 4, guaranteed when c mod 3 == 1 and c > 1).",
      "So for every count c >= 2 the answer contribution is exactly ceil(c / 3) = (c + 2) / 3 in integer math. Sum these; return -1 if any count is 1. Counting is O(n) and the per-value arithmetic is O(distinct) -> O(n) time, O(distinct) space.",
    ],
    approaches: [
      {
        name: "Count frequencies, then ceil(count/3) per value (optimal)",
        intuition: "Each value is independent; the fewest 2s and 3s summing to a count c is ceil(c/3), and a count of 1 is impossible.",
        time: "O(n)",
        timeWhy: "One pass to count, one pass over distinct values.",
        space: "O(n)",
        spaceWhy: "A frequency map over distinct values.",
        code: `int minOperations(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int v : nums) freq.merge(v, 1, Integer::sum);
    int ops = 0;
    for (int c : freq.values()) {
        if (c == 1) return -1;          // a lone element can never be removed
        ops += (c + 2) / 3;             // ceil(c / 3): max threes, fill with a two
    }
    return ops;
}`,
        walkthrough: [
          "nums=[2,3,3,2,2,4,2,3,4]. Counts: 2 -> 4, 3 -> 3, 4 -> 2.",
          "value 2 count 4: (4+2)/3 = 2 ops. value 3 count 3: (3+2)/3 = 1 op. value 4 count 2: (2+2)/3 = 1 op.",
          "Total 2 + 1 + 1 = 4.",
        ],
      },
    ],
    edgeCases: [
      "Any value appearing exactly once → return -1 immediately.",
      "All counts divisible by 3 → answer is the sum of count/3.",
      "A count of 2 → one operation (a single pair).",
    ],
    twists: [
      "**Group sizes of only 2** → answer is sum of count/2, impossible on any odd count.",
      "**Arbitrary allowed group sizes** → becomes a coin-change-style DP per count instead of closed-form arithmetic.",
      "**Unique Number of Occurrences** (in the library) → also frequency-map driven but asks whether the counts themselves are distinct.",
    ],
    related: ["unique-number-of-occurrences", "top-k-frequent-elements", "rank-transform-of-an-array"],
  },

  {
    slug: "continuous-subarray-sum",
    title: "Continuous Subarray Sum",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 523,
    statement:
      "Given an integer array `nums` and an integer `k`, return `true` if `nums` has a **contiguous subarray of length at least 2** whose elements sum to a multiple of `k` (that is, the sum equals `n * k` for some integer `n`, where `0 * k = 0` counts).",
    examples: [
      { in: "nums = [23,2,4,6,7], k = 6", out: "true", explanation: "[2,4] sums to 6, a multiple of 6" },
      { in: "nums = [23,2,6,4,7], k = 6", out: "true", explanation: "the whole array sums to 42 = 7 * 6" },
      { in: "nums = [23,2,6,4,7], k = 13", out: "false", explanation: "no length-2+ subarray sums to a multiple of 13" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "0 ≤ nums[i] ≤ 10^9", "0 ≤ sum(nums[i]) ≤ 2^31 - 1", "1 ≤ k ≤ 2^31 - 1"],
    recognize:
      "A subarray sum divisible by `k` is the **prefix-sum remainder** trick: two prefix sums sharing the same remainder mod k bound a subarray whose sum is a multiple of k — so store first-seen remainders in a hash map.",
    figureItOut: [
      "The sum of the subarray from index i+1 to j is prefix[j] - prefix[i]. We want that difference to be a multiple of k, i.e. (prefix[j] - prefix[i]) mod k == 0, which happens exactly when prefix[j] and prefix[i] leave the SAME remainder modulo k.",
      "So instead of tracking full prefix sums, track their REMAINDERS mod k. If two prefix positions ever share a remainder, the chunk between them sums to a multiple of k. This converts an O(n^2) subarray scan into a single pass with a hash map.",
      "Map each remainder to the EARLIEST index where it appeared. When the current running remainder has been seen before at index p, the subarray from p+1 to the current index has a multiple-of-k sum. We store the earliest index so we can check the length condition.",
      "The length-at-least-2 rule needs care: the subarray spans (currentIndex - p) elements, so require currentIndex - p >= 2 before returning true. Storing the EARLIEST index for each remainder maximises this gap, giving the best chance to satisfy the length rule.",
      "Seed the map with remainder 0 at index -1 so that a prefix that is itself a multiple of k (from the very start) is detected with the correct length. One pass, O(n) time and O(min(n, k)) space for the remainder map.",
    ],
    approaches: [
      {
        name: "Brute-force every subarray",
        intuition: "Try all start/end pairs of length >= 2 and test divisibility.",
        time: "O(n^2)",
        timeWhy: "Quadratically many subarrays, each summed incrementally.",
        space: "O(1)",
        spaceWhy: "Only running sums.",
        code: `boolean checkSubarraySum(int[] nums, int k) {
    for (int i = 0; i < nums.length; i++) {
        long sum = nums[i];
        for (int j = i + 1; j < nums.length; j++) {
            sum += nums[j];
            if (sum % k == 0) return true;   // length is at least 2 here
        }
    }
    return false;
}`,
      },
      {
        name: "First-seen prefix-sum remainder map (optimal)",
        intuition: "Track running remainder mod k; a repeated remainder at least two indices apart bounds a valid subarray.",
        time: "O(n)",
        timeWhy: "A single pass with O(1) map operations.",
        space: "O(min(n, k))",
        spaceWhy: "At most k distinct remainders are stored.",
        code: `boolean checkSubarraySum(int[] nums, int k) {
    Map<Integer, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0, -1);            // remainder 0 before any element
    int running = 0;
    for (int i = 0; i < nums.length; i++) {
        running = (running + nums[i]) % k;
        if (firstIndex.containsKey(running)) {
            if (i - firstIndex.get(running) >= 2) return true;
        } else {
            firstIndex.put(running, i);   // store earliest occurrence only
        }
    }
    return false;
}`,
        walkthrough: [
          "nums=[23,2,4,6,7], k=6. Map starts {0:-1}. i=0: running=23%6=5, new -> {0:-1,5:0}. i=1: running=(5+2)%6=1, new -> add 1:1.",
          "i=2: running=(1+4)%6=5, seen at index 0 -> 2-0=2 >= 2 -> true.",
          "Subarray indices 1..2 = [2,4] sums to 6, a multiple of 6.",
        ],
      },
    ],
    edgeCases: [
      "A zero followed by another zero → sum 0 is a multiple of every k → true.",
      "Subarray of length exactly 2 with sum a multiple of k → satisfies the minimum-length rule.",
      "Whole array is a multiple of k → detected via the seeded remainder 0 at index -1.",
    ],
    twists: [
      "**Subarray Sum Equals K** (in the library) → store COUNTS of exact prefix sums instead of first-seen remainders.",
      "**Contiguous Array** (in the library) → map +1/-1 prefix sums to find equal 0s and 1s — same prefix-state idea.",
      "**Subarray Sums Divisible by K** → count ALL such subarrays by storing remainder frequencies.",
    ],
    related: ["subarray-sum-equals-k", "contiguous-array", "find-pivot-index"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "shortest-distance-to-a-character",
    title: "Shortest Distance to a Character",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 821,
    statement:
      "Given a string `s` and a character `c` that occurs in `s`, return an integer array `answer` of the same length where `answer[i]` is the distance from index `i` to the **nearest** occurrence of `c` in `s` (using absolute index distance).",
    examples: [
      { in: 's = "loveleetcode", c = "e"', out: "[3,2,1,0,1,0,0,1,2,2,1,0]", explanation: "each position reports its distance to the closest e" },
      { in: 's = "aaab", c = "b"', out: "[3,2,1,0]", explanation: "distances to the single b at the end" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^4", "s[i] and c are lowercase English letters", "c occurs at least once in s"],
    recognize:
      "Nearest-occurrence distance on a line is a **two-pass sweep**: one left-to-right pass tracks the closest c on the left, one right-to-left pass tracks the closest c on the right, and the answer is the minimum of the two pointers.",
    figureItOut: [
      "The nearest c to position i is EITHER the closest c at or to the left of i, OR the closest c at or to the right of i. Those two candidates are independent, and the true answer is whichever is nearer.",
      "Sweep left to right keeping the index of the most recent c seen so far (start it at -infinity / a far value). At each i, the left distance is i - lastLeft. This pass alone solves every position that has a c somewhere to its left.",
      "Sweep right to left keeping the index of the most recent c seen from the right. At each i, the right distance is lastRight - i. This covers every position with a c to its right.",
      "Combine the two passes: answer[i] = min(leftDistance[i], rightDistance[i]). A position sitting exactly on a c gets distance 0 from whichever pass first touches it, which correctly dominates the min.",
      "Two linear sweeps and one min-merge -> O(n) time. You can fold the merge into the second pass to use only the output array as extra storage -> O(1) auxiliary space beyond the result.",
    ],
    approaches: [
      {
        name: "Two directional sweeps with min-merge (optimal)",
        intuition: "Left pass records distance to the nearest c on the left; right pass overwrites with the smaller distance to the nearest c on the right.",
        time: "O(n)",
        timeWhy: "Two passes over the string.",
        space: "O(1)",
        spaceWhy: "Output array aside, only the last-seen index pointers.",
        code: `int[] shortestToChar(String s, char c) {
    int n = s.length();
    int[] answer = new int[n];
    int prev = -n;                       // far away, so initial distances are large
    for (int i = 0; i < n; i++) {        // left-to-right: nearest c on the left
        if (s.charAt(i) == c) prev = i;
        answer[i] = i - prev;
    }
    prev = 2 * n;                        // far to the right
    for (int i = n - 1; i >= 0; i--) {   // right-to-left: take the smaller distance
        if (s.charAt(i) == c) prev = i;
        answer[i] = Math.min(answer[i], prev - i);
    }
    return answer;
}`,
        walkthrough: [
          's="loveleetcode", c=e. Left pass: positions before the first e get large values; once an e at index 3 is seen, answer[3]=0, answer[4]=1, etc.',
          "Right pass from the end: each position takes min(existing, distance to next e on the right). For index 0, the nearest e is at index 3 -> 3.",
          "Final answer [3,2,1,0,1,0,0,1,2,2,1,0].",
        ],
      },
    ],
    edgeCases: [
      "c occurs only once → every distance measures to that single index.",
      "c at both ends → interior positions take the nearer end.",
      "Consecutive c characters → those positions are 0 and neighbours are 1.",
    ],
    twists: [
      "**Nearest of multiple target characters** → run the two passes per target, or track the nearest of any target in one combined pass.",
      "**01 Matrix** → the 2D analogue, solved with a multi-source BFS instead of line sweeps.",
      "**Nearest distance with wrap-around** → treat the string as circular by extending the sweeps across a doubled range.",
    ],
    related: ["di-string-match", "max-consecutive-ones", "is-subsequence"],
  },

  {
    slug: "di-string-match",
    title: "DI String Match",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 942,
    statement:
      'A permutation `perm` of `0..n` can be encoded as a string `s` of length `n` where `s[i] == "I"` means `perm[i] < perm[i+1]` (an increase) and `s[i] == "D"` means `perm[i] > perm[i+1]` (a decrease). Given such a string `s`, reconstruct ANY valid permutation of the integers `0..n` matching it.',
    examples: [
      { in: 's = "IDID"', out: "[0,4,1,3,2]", explanation: "I:0<4, D:4>1, I:1<3, D:3>2 — a valid permutation of 0..4" },
      { in: 's = "III"', out: "[0,1,2,3]", explanation: "all increases" },
      { in: 's = "DDI"', out: "[3,2,0,1]", explanation: "two decreases then an increase" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^5", 's[i] is either "I" or "D"'],
    recognize:
      "Building a permutation from increase/decrease commands is a **two-pointer greedy** over the value range: keep a `low` and a `high` pointer into `0..n`; emit `low` (and bump it) on an I, emit `high` (and drop it) on a D.",
    figureItOut: [
      "We have the integers 0..n to place, and each character only tells us whether the NEXT value must be larger or smaller than the current one. The actual magnitudes are free as long as the up/down pattern holds and we use each integer exactly once.",
      "Maintain two pointers into the unused range: low starting at 0 and high starting at n. These are the smallest and largest values not yet placed. The trick is that satisfying an I is always easy if we place the smallest remaining value, and a D is always easy if we place the largest remaining value.",
      "For each character s[i]: if it is I (we need the next value to be greater), output low and increment low — because low is the smallest remaining, ANY later value we place is guaranteed to be larger. If it is D (next must be smaller), output high and decrement high — high is the largest remaining, so anything later is smaller.",
      "After processing all n characters, exactly one value remains and low == high. Append it as the final element; it has no successor so no constraint can be violated.",
      "Each character pushes one of the two pointers inward by one, and they meet after n steps. So it is O(n) time and O(1) extra space beyond the output array — a clean shrinking two-pointer over the value domain.",
    ],
    approaches: [
      {
        name: "Low/high two-pointer greedy assignment (optimal)",
        intuition: "Emit the smallest unused value on an I and the largest on a D; either choice trivially satisfies the next comparison.",
        time: "O(n)",
        timeWhy: "Each character advances one pointer once.",
        space: "O(1)",
        spaceWhy: "Output array aside, just two integer pointers.",
        code: `int[] diStringMatch(String s) {
    int n = s.length();
    int low = 0, high = n;
    int[] res = new int[n + 1];
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == 'I') {
            res[i] = low;          // smallest remaining -> next is larger
            low++;
        } else {
            res[i] = high;         // largest remaining -> next is smaller
            high--;
        }
    }
    res[n] = low;                  // low == high here; place the last value
    return res;
}`,
        walkthrough: [
          's="IDID", n=4. low=0, high=4. i=0 I -> res[0]=0, low=1. i=1 D -> res[1]=4, high=3.',
          "i=2 I -> res[2]=1, low=2. i=3 D -> res[3]=3, high=2. Loop ends; low==high==2.",
          "res[4]=2 -> [0,4,1,3,2], which satisfies I,D,I,D.",
        ],
      },
    ],
    edgeCases: [
      "All I → returns 0,1,2,...,n in increasing order.",
      "All D → returns n,n-1,...,0 in decreasing order.",
      "Single character → a two-element permutation, e.g. I -> [0,1].",
    ],
    twists: [
      "**Count valid permutations for the pattern** → a DP counting problem rather than constructing one witness.",
      "**Lexicographically smallest valid permutation** → a stack-based reversal of each maximal D-run.",
      "**Reconstruct a sequence with strict bounds** → similar greedy but values constrained to a custom range.",
    ],
    related: ["shortest-distance-to-a-character", "minimum-common-value", "sort-array-by-parity"],
  },

  {
    slug: "minimum-common-value",
    title: "Minimum Common Value",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 2540,
    statement:
      "Given two integer arrays `nums1` and `nums2`, both sorted in **non-decreasing** order, return the **minimum** integer common to both arrays. If there is no common integer, return `-1`.",
    examples: [
      { in: "nums1 = [1,2,3], nums2 = [2,4]", out: "2", explanation: "the only common value is 2" },
      { in: "nums1 = [1,2,3,6], nums2 = [2,3,4,5]", out: "2", explanation: "common values are 2 and 3; the smallest is 2" },
      { in: "nums1 = [1,2], nums2 = [3,4]", out: "-1", explanation: "no common value" },
    ],
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 10^5", "1 ≤ nums1[i], nums2[j] ≤ 10^9", "both arrays are sorted in non-decreasing order"],
    recognize:
      "Finding the smallest shared value of two SORTED arrays is the classic **merge-style two-pointer** scan: advance the pointer at the smaller value; when both values match, that match (encountered earliest) is the minimum common value.",
    figureItOut: [
      "Both arrays are sorted, so the first value they have in common — scanning from the front — is automatically the SMALLEST common value. There is no need to find all matches; the first one wins.",
      "Use a pointer i in nums1 and j in nums2. Compare nums1[i] and nums2[j]. If they are equal, we have found a common value, and because we scanned from the smallest end first, it is the minimum common value.",
      "If nums1[i] < nums2[j], then nums1[i] is too small to ever match anything from nums2[j] onward (nums2 only grows), so advance i. Symmetrically, if nums2[j] is smaller, advance j. This is the merge step of merge-sort, only we stop at the first tie.",
      "Because each comparison advances exactly one pointer, and a pointer only moves forward, neither can overshoot a possible match: we always keep the smaller side moving up toward the larger side until they meet or one array is exhausted.",
      "If either pointer runs off the end without a tie, there is no common value -> return -1. Each pointer traverses its array at most once -> O(m + n) time and O(1) space. (A binary-search-each-element variant is O(m log n) and worse for similarly sized arrays.)",
    ],
    approaches: [
      {
        name: "Hash set of one array",
        intuition: "Put one array in a set, scan the other in order, return the first value present in the set.",
        time: "O(m + n)",
        timeWhy: "Build the set then one scan, but it ignores the sortedness.",
        space: "O(n)",
        spaceWhy: "A set of one array's values.",
        code: `int getCommon(int[] nums1, int[] nums2) {
    Set<Integer> set = new HashSet<>();
    for (int v : nums2) set.add(v);
    for (int v : nums1) {              // nums1 is sorted, so first hit is smallest
        if (set.contains(v)) return v;
    }
    return -1;
}`,
      },
      {
        name: "Merge-style two-pointer scan (optimal)",
        intuition: "Walk both sorted arrays, advancing the smaller side; the first equal pair is the minimum common value.",
        time: "O(m + n)",
        timeWhy: "Each pointer advances at most through its whole array once.",
        space: "O(1)",
        spaceWhy: "Two indices, no auxiliary structure.",
        code: `int getCommon(int[] nums1, int[] nums2) {
    int i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] == nums2[j]) {
            return nums1[i];           // first match is the smallest common value
        } else if (nums1[i] < nums2[j]) {
            i++;                       // nums1[i] too small to ever match
        } else {
            j++;                       // nums2[j] too small to ever match
        }
    }
    return -1;
}`,
        walkthrough: [
          "nums1=[1,2,3,6], nums2=[2,3,4,5]. i=0,j=0: 1<2 -> i=1. i=1,j=0: 2==2 -> return 2.",
          "We stop at the first equality, which is guaranteed to be the smallest common value because both arrays are scanned from their smallest ends.",
          "Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "No common value → a pointer reaches the end → return -1.",
      "Match at the very first elements → returned immediately.",
      "Duplicates within an array → harmless; the scan still finds the first shared value.",
    ],
    twists: [
      "**Intersection of Two Arrays** (in the library) → collect ALL shared distinct values rather than just the minimum.",
      "**Intersection of Two Arrays II** (in the library) → keep multiplicities of the shared values.",
      "**Smallest common across k sorted arrays** → a min-heap over k pointers generalises the two-pointer merge.",
    ],
    related: ["intersection-of-two-arrays", "intersection-of-two-arrays-ii", "merge-sorted-array"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "repeated-dna-sequences",
    title: "Repeated DNA Sequences",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 187,
    statement:
      'A DNA sequence is a string over the characters "A", "C", "G", "T". Given a string `s`, return all the **10-letter-long** substrings that occur **more than once** in `s`. You may return the answer in any order.',
    examples: [
      { in: 's = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"', out: '["AAAAACCCCC","CCCCCAAAAA"]', explanation: "these two length-10 windows each appear twice" },
      { in: 's = "AAAAAAAAAAAAA"', out: '["AAAAAAAAAA"]', explanation: "the all-A window of length 10 repeats" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^5", 's[i] is one of "A", "C", "G", "T"'],
    recognize:
      "Finding repeated FIXED-length substrings is a **fixed-size sliding window over a hash set**: slide a length-10 window across the string and record which window strings have already been seen.",
    figureItOut: [
      "We only ever care about substrings of EXACTLY length 10. That is a fixed-size window: as the window slides one character right, it loses its leftmost character and gains a new one on the right. There are at most n-9 such windows.",
      "A substring is part of the answer when it appears more than once. So as we slide, we hash each length-10 window and ask 'have I seen this exact string before?'. The first time we see a window we just remember it; the SECOND time we see it we add it to the result.",
      "Use two sets: seen (every window encountered) and added (windows already placed in the answer, to avoid duplicates when a window appears three or more times). On each window, if it is in seen and not yet in added, add it; otherwise mark it in seen.",
      "The simplest correct version extracts the length-10 substring at each position via substring(i, i+10). That is O(10) per window for the hashing, totalling O(10n) = O(n) with a constant factor of 10 — perfectly fine for n up to 1e5.",
      "An optimisation encodes each base in 2 bits (A,C,G,T -> 0..3), so a 10-letter window fits in a 20-bit integer, and the window rolls in O(1) by shifting and masking. That gives O(n) time with O(1)-sized keys; for this constraint the plain substring approach is already O(n) time and O(n) space for the sets.",
    ],
    approaches: [
      {
        name: "Sliding window of substrings into two sets",
        intuition: "Slide a length-10 window; the second time a window string appears, record it.",
        time: "O(n)",
        timeWhy: "n-9 windows, each hashed in constant (10-char) time.",
        space: "O(n)",
        spaceWhy: "Sets of length-10 window strings.",
        code: `List<String> findRepeatedDnaSequences(String s) {
    List<String> res = new ArrayList<>();
    if (s.length() < 10) return res;
    Set<String> seen = new HashSet<>();
    Set<String> added = new HashSet<>();
    for (int i = 0; i + 10 <= s.length(); i++) {
        String window = s.substring(i, i + 10);
        if (!seen.add(window)) {       // add returns false -> seen before
            if (added.add(window)) res.add(window);   // add once to the result
        }
    }
    return res;
}`,
      },
      {
        name: "Rolling 2-bit hash window (optimal)",
        intuition: "Encode each base in 2 bits so a length-10 window is a 20-bit int that rolls in O(1) as it slides.",
        time: "O(n)",
        timeWhy: "Each slide updates the encoded window in constant time.",
        space: "O(n)",
        spaceWhy: "Sets of integer-encoded windows (smaller constant than strings).",
        code: `List<String> findRepeatedDnaSequences(String s) {
    List<String> res = new ArrayList<>();
    int n = s.length();
    if (n < 10) return res;
    int[] map = new int[128];
    map['A'] = 0; map['C'] = 1; map['G'] = 2; map['T'] = 3;
    int hash = 0, mask = (1 << 20) - 1;     // keep 20 bits = 10 bases * 2 bits
    Set<Integer> seen = new HashSet<>();
    Set<Integer> added = new HashSet<>();
    for (int i = 0; i < n; i++) {
        hash = ((hash << 2) | map[s.charAt(i)]) & mask;   // roll in the new base
        if (i >= 9) {                       // first full window ends at index 9
            if (!seen.add(hash)) {
                if (added.add(hash)) res.add(s.substring(i - 9, i + 1));
            }
        }
    }
    return res;
}`,
        walkthrough: [
          's="AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT". The first window ending at index 9 is "AAAAACCCCC"; its 20-bit hash is added to seen.',
          'As the window slides, "AAAAACCCCC" recurs later and "CCCCCAAAAA" recurs; on each second appearance the substring is appended exactly once via the added guard.',
          'Result ["AAAAACCCCC","CCCCCAAAAA"].',
        ],
      },
    ],
    edgeCases: [
      "Length under 10 → no window exists → empty result.",
      "A window repeated three or more times → added only once thanks to the added set.",
      "All identical characters → the single repeating window is reported once.",
    ],
    twists: [
      "**Find All Anagrams in a String** (in the library) → fixed window but matching by character counts, not exact strings.",
      "**Longest repeated substring (any length)** → suffix automaton / binary search on length plus hashing.",
      "**Rabin-Karp substring search** → the same rolling-hash idea applied to pattern matching.",
    ],
    related: ["find-all-anagrams-in-a-string", "permutation-in-string", "find-the-index-of-the-first-occurrence-in-a-string"],
  },

  {
    slug: "substrings-of-size-three-with-distinct-characters",
    title: "Substrings of Size Three With Distinct Characters",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 1876,
    statement:
      "A string is **good** if there are no repeated characters. Given a string `s`, return the number of **good substrings of length exactly three** in `s`. Note that substrings overlapping at different positions are counted separately even if their characters are equal.",
    examples: [
      { in: 's = "xyzzaz"', out: "1", explanation: 'the length-3 substrings are xyz, yzz, zza, zaz; only xyz has all distinct characters' },
      { in: 's = "aababcabc"', out: "4", explanation: "abc appears at several positions as a good window; count them" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s consists of lowercase English letters"],
    recognize:
      "Counting length-3 windows whose characters are all distinct is the simplest **fixed-size sliding window**: check every consecutive triple and count those with three different characters.",
    figureItOut: [
      "The window size is fixed at 3, and 'good' just means the three characters are pairwise different. So we never need a growing/shrinking window — we slide a width-3 window and apply a constant-time distinctness test.",
      "For each starting index i from 0 to n-3, look at s[i], s[i+1], s[i+2]. They are all distinct exactly when no two of them are equal: s[i] != s[i+1], s[i+1] != s[i+2], and s[i] != s[i+2].",
      "That three-way comparison is O(1) per window. There are n-2 windows, so a straight scan counting the windows that pass the test is O(n) overall — no auxiliary frequency structure is even needed for a window this small.",
      "Be careful to count POSITIONS, not distinct strings: two windows at different start indices both count even if they spell the same three letters. So we simply add one per passing window.",
      "Guard the case n < 3 (no length-3 window exists -> answer 0). Total O(n) time, O(1) space. A general sliding window with a frequency map also works but is overkill for window size 3.",
    ],
    approaches: [
      {
        name: "Fixed width-3 window with a three-way distinctness test (optimal)",
        intuition: "Slide a triple across the string and count windows whose three characters are pairwise different.",
        time: "O(n)",
        timeWhy: "n-2 windows, each tested in constant time.",
        space: "O(1)",
        spaceWhy: "Only a counter and index.",
        code: `int countGoodSubstrings(String s) {
    int count = 0;
    for (int i = 0; i + 3 <= s.length(); i++) {
        char a = s.charAt(i), b = s.charAt(i + 1), c = s.charAt(i + 2);
        if (a != b && b != c && a != c) count++;   // all three distinct
    }
    return count;
}`,
        walkthrough: [
          's="xyzzaz". Windows: i=0 "xyz" (x,y,z distinct -> count 1), i=1 "yzz" (z==z -> no), i=2 "zza" (z==z -> no).',
          'i=3 "zaz" (z==z at ends -> no). No more windows.',
          "Total good substrings = 1.",
        ],
      },
    ],
    edgeCases: [
      "Length under 3 → no window → answer 0.",
      "All identical characters → every window fails → answer 0.",
      "Repeated good pattern like ababab → overlapping windows counted at each position.",
    ],
    twists: [
      "**Distinct characters in windows of size k** → generalise with a sliding frequency map and a distinct-count check.",
      "**Longest substring with all distinct characters** → the variable-size window 'Longest Substring Without Repeating' (in the library).",
      "**Maximum Number of Vowels in a Substring of Given Length** (in the library) → fixed window tracking a different per-window property.",
    ],
    related: ["longest-substring-without-repeating", "maximum-number-of-vowels-in-a-substring-of-given-length", "find-all-anagrams-in-a-string"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "minimum-number-of-swaps-to-make-the-string-balanced",
    title: "Minimum Number of Swaps to Make the String Balanced",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1963,
    statement:
      'You are given a string `s` of even length consisting only of the characters `[` and `]`, with an equal number of each. In one swap you may pick any two indices and exchange their characters. Return the **minimum** number of swaps needed to make `s` a **balanced** bracket string.',
    examples: [
      { in: 's = "][]["', out: "1", explanation: "swap index 0 and 3 to get [[]] ... or [][] — one swap suffices" },
      { in: 's = "]]][[["', out: "2", explanation: "two swaps fix the three mismatched closers" },
      { in: 's = "[]"', out: "0", explanation: "already balanced" },
    ],
    constraints: ["n == s.length", "2 ≤ n ≤ 10^6", "n is even", "s[i] is either [ or ]", "equal numbers of [ and ]"],
    recognize:
      "Counting how broken a bracket string is uses the **stack-as-counter** idea: walk left to right matching `]` against open `[`; the count of UNMATCHED closers left over (a stack that only ever holds open brackets) determines the swaps.",
    figureItOut: [
      "Process the string left to right while conceptually maintaining a stack of unmatched open brackets. A [ pushes; a ] pops a matching [ if one is available. Anything that cannot be matched is part of the imbalance.",
      "Because we never actually need the bracket identities, the 'stack' collapses to a single counter open = number of currently unmatched [ characters. On a [ we increment open; on a ] we decrement open if open > 0 (a match), otherwise this ] is unmatched.",
      "Track the maximum number of unmatched ] characters that pile up at any point — call it the deficit. Each swap can fix the situation dramatically: swapping a far-right [ into a leading unmatched ] position repairs TWO unmatched closers at once.",
      "So the answer is the number of swaps to clear the worst-case unmatched closers. If u is the count of unmatched ] (equivalently the leftover open count by symmetry since the string has equal brackets), the minimum swaps is ceil(u / 2) = (u + 1) / 2.",
      "Concretely: scan, maintain a balance that increments on [ and decrements on ]; whenever balance goes negative you have an unmatched ], so increment an unmatched counter and reset balance to 0. The answer is (unmatched + 1) / 2. One pass, O(n) time, O(1) space — the stack is fully amortised into the balance counter.",
    ],
    approaches: [
      {
        name: "Balance counter tracking unmatched closers (optimal)",
        intuition: "A running balance dips negative on each unmatched ]; the count of those, halved up, is the swaps needed since one swap fixes two.",
        time: "O(n)",
        timeWhy: "A single pass over the string.",
        space: "O(1)",
        spaceWhy: "Two integer counters; the stack is amortised away.",
        code: `int minSwaps(String s) {
    int balance = 0;       // open '[' minus matched, never below 0 here
    int unmatched = 0;     // count of ']' with no '[' to match
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '[') {
            balance++;
        } else {
            if (balance > 0) {
                balance--;          // this ']' matches an earlier '['
            } else {
                unmatched++;        // an unmatched closer
            }
        }
    }
    return (unmatched + 1) / 2;     // each swap repairs two unmatched closers
}`,
        walkthrough: [
          's="]]][[[". i=0 ] balance 0 -> unmatched 1. i=1 ] -> unmatched 2. i=2 ] -> unmatched 3.',
          "i=3 [ balance 1. i=4 [ balance 2. i=5 [ balance 3. (these opens have no closers after them — they pair with the swaps).",
          "unmatched = 3 -> (3+1)/2 = 2 swaps.",
        ],
      },
    ],
    edgeCases: [
      "Already balanced → balance never goes negative → 0 swaps.",
      "Fully reversed like ]] then [[ → unmatched accumulates, halved up gives the answer.",
      "A single inversion ][ → one unmatched closer → (1+1)/2 = 1 swap.",
    ],
    twists: [
      "**Minimum Add to Make Parentheses Valid** (in the library) → count INSERTIONS rather than swaps, so no halving.",
      "**Minimum Remove to Make Valid Parentheses** (in the library) → delete offending brackets using a real index stack.",
      "**Valid Parentheses** (in the library) → the base stack-matching check this counter is derived from.",
    ],
    related: ["minimum-add-to-make-parentheses-valid", "minimum-remove-to-make-valid-parentheses", "valid-parentheses"],
  },

  {
    slug: "flatten-nested-list-iterator",
    title: "Flatten Nested List Iterator",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 341,
    statement:
      "You are given a nested list of integers; each element is either an integer or a list whose elements are also integers or lists. Implement an iterator `NestedIterator` exposing `next()` (returns the next integer in flattened left-to-right order) and `hasNext()` (returns whether any integer remains). Assume a `NestedInteger` type with `isInteger()`, `getInteger()`, and `getList()`.",
    examples: [
      { in: "nestedList = [[1,1],2,[1,1]]", out: "[1,1,2,1,1]", explanation: "depth-first left-to-right flattening" },
      { in: "nestedList = [1,[4,[6]]]", out: "[1,4,6]", explanation: "descend into nested lists as they are reached" },
    ],
    constraints: ["1 ≤ total integers ≤ 10^5", "nesting depth and values fit in 32-bit signed integers"],
    recognize:
      "Lazily walking a tree of lists left-to-right is a textbook **stack-based iterator**: push the top-level items reversed, and on each access pop and either yield an integer or expand a sublist (again reversed) back onto the stack.",
    figureItOut: [
      "A nested list is really a tree: integers are leaves, sublists are internal nodes. Flattening left-to-right is a depth-first traversal. An iterator must do this LAZILY — only enough work per next() call — so recursion that flattens everything up front is discouraged for large inputs.",
      "A stack mirrors the call stack of that DFS explicitly. Push the top-level NestedInteger items onto a stack, but in REVERSE order so that the leftmost item ends up on top and is processed first.",
      "The core operation is 'make sure the top of the stack is an integer'. While the top is a LIST, pop it and push its children back in reverse order. When the top becomes an integer, the iterator is positioned at the next value.",
      "hasNext() runs that 'expand until the top is an integer' loop and returns whether anything remains; next() assumes hasNext() readied an integer on top, then pops and returns it. Doing the expansion inside hasNext() keeps next() simple and ensures laziness — sublists are only opened when actually reached.",
      "Each NestedInteger is pushed and popped at most once across the whole iteration, so the total work is O(total nodes) amortised, and the stack holds at most O(total nodes) in the worst case (a deeply right-leaning structure). That is the standard space/time profile for this iterator.",
    ],
    approaches: [
      {
        name: "Eager full flatten into a list",
        intuition: "Recursively collect every integer up front, then iterate the flat list.",
        time: "O(N)",
        timeWhy: "Visit every node once during the initial flatten.",
        space: "O(N)",
        spaceWhy: "Stores all integers, defeating the laziness goal.",
        code: `public class NestedIterator implements Iterator<Integer> {
    private final List<Integer> flat = new ArrayList<>();
    private int pos = 0;

    public NestedIterator(List<NestedInteger> nestedList) {
        flatten(nestedList);
    }
    private void flatten(List<NestedInteger> list) {
        for (NestedInteger ni : list) {
            if (ni.isInteger()) flat.add(ni.getInteger());
            else flatten(ni.getList());
        }
    }
    public Integer next() { return flat.get(pos++); }
    public boolean hasNext() { return pos < flat.size(); }
}`,
      },
      {
        name: "Lazy stack of NestedIntegers (optimal)",
        intuition: "Keep a stack with the leftmost item on top; expand lists on demand until an integer surfaces.",
        time: "O(N) amortised",
        timeWhy: "Each node is pushed and popped once across the full traversal.",
        space: "O(N)",
        spaceWhy: "The stack can hold up to all unvisited nodes.",
        code: `public class NestedIterator implements Iterator<Integer> {
    private final Deque<NestedInteger> stack = new ArrayDeque<>();

    public NestedIterator(List<NestedInteger> nestedList) {
        pushReversed(nestedList);
    }
    private void pushReversed(List<NestedInteger> list) {
        for (int i = list.size() - 1; i >= 0; i--) stack.push(list.get(i));
    }
    public boolean hasNext() {
        while (!stack.isEmpty() && !stack.peek().isInteger()) {
            NestedInteger top = stack.pop();    // top is a list: expand it
            pushReversed(top.getList());
        }
        return !stack.isEmpty();
    }
    public Integer next() {
        return stack.pop().getInteger();        // hasNext() guarantees integer on top
    }
}`,
        walkthrough: [
          "nestedList=[[1,1],2,[1,1]]. Push reversed: stack top is [1,1], then 2, then [1,1].",
          "hasNext(): top is a list [1,1] -> pop, push reversed -> top becomes integer 1. next() returns 1. Again top is 1 -> next() returns 1.",
          "Now top is integer 2 -> next() returns 2. Then the trailing [1,1] expands lazily -> next() returns 1, 1. Flattened [1,1,2,1,1].",
        ],
      },
    ],
    edgeCases: [
      "Empty sublists like [[]] → expansion pushes nothing; hasNext() correctly reports no integers.",
      "Deeply nested single value like [[[[5]]]] → repeated expansion surfaces 5.",
      "Calling next() without a prior hasNext() → relies on the caller respecting the contract; the loop in hasNext() is what positions the integer.",
    ],
    twists: [
      "**Peeking Iterator** → wrap this to support a peek() that returns the next value without advancing.",
      "**Flatten a 2D vector** → the same lazy-stack pattern for a fixed two-level structure.",
      "**Binary Search Tree Iterator** → an analogous lazy stack-based in-order iterator over a tree.",
    ],
    related: ["min-stack", "implement-queue-using-stacks", "decode-string"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "find-k-th-smallest-pair-distance",
    title: "Find K-th Smallest Pair Distance",
    difficulty: "Hard",
    pattern: "binary-search",
    leetcode: 719,
    statement:
      "Given an integer array `nums` and an integer `k`, the distance of a pair `(a, b)` is `|a - b|`. Considering all `n*(n-1)/2` pairs, return the **k-th smallest** pair distance (1-indexed).",
    examples: [
      { in: "nums = [1,3,1], k = 1", out: "0", explanation: "pair distances are |1-3|=2, |1-1|=0, |3-1|=2; the smallest is 0" },
      { in: "nums = [1,1,1], k = 2", out: "0", explanation: "all three pair distances are 0" },
      { in: "nums = [1,6,1], k = 3", out: "5", explanation: "distances 5,0,5 sorted are 0,5,5; the 3rd is 5" },
    ],
    constraints: ["n == nums.length", "2 ≤ n ≤ 10^4", "0 ≤ nums[i] ≤ 10^6", "1 ≤ k ≤ n*(n-1)/2"],
    recognize:
      "Asking for the k-th smallest VALUE among quadratically many distances is **binary search on the answer** combined with a sliding-window counter: for a candidate distance d, count pairs with distance <= d in O(n), and search for the smallest d whose count reaches k.",
    figureItOut: [
      "There are O(n^2) pair distances, far too many to materialise for n up to 1e4. But we are only asked for the k-th smallest VALUE, and the candidate distances lie in the integer range [0, max(nums) - min(nums)]. That bounded value range is the cue to binary-search on the answer itself.",
      "Sort nums first. After sorting, for a candidate distance d we can COUNT how many pairs have distance <= d efficiently: for each right index j, the valid left partners are those within d, i.e. indices i where nums[j] - nums[i] <= d. As j moves right, the leftmost valid i only moves right too — a sliding window giving an O(n) count.",
      "Define count(d) = number of pairs with distance <= d. This is MONOTONIC non-decreasing in d (allowing a larger distance can only include more pairs). So 'count(d) >= k' flips from false to true at exactly one threshold d — the classic binary-search-on-monotone-predicate setup.",
      "We want the SMALLEST d such that count(d) >= k, because that smallest qualifying value IS the k-th smallest distance: there are fewer than k pairs strictly below it, and at least k at or below it. Binary search d in [0, maxGap]: if count(mid) >= k, the answer is mid or smaller (hi = mid); else lo = mid + 1.",
      "Sorting is O(n log n); each count is O(n); binary search runs O(log(maxGap)) times. Total O(n log n + n log(maxGap)) time, O(1) extra space beyond the sort. The sliding-window count is the crucial piece that makes the feasibility test linear.",
    ],
    approaches: [
      {
        name: "Sort all pair distances",
        intuition: "Generate every pair distance, sort, and index the k-th.",
        time: "O(n^2 log n)",
        timeWhy: "n^2 distances generated and sorted.",
        space: "O(n^2)",
        spaceWhy: "Stores all pair distances.",
        code: `int smallestDistancePair(int[] nums, int k) {
    List<Integer> dists = new ArrayList<>();
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            dists.add(Math.abs(nums[i] - nums[j]));
    Collections.sort(dists);
    return dists.get(k - 1);
}`,
      },
      {
        name: "Binary search on distance + sliding-window count (optimal)",
        intuition: "Count pairs with distance <= d in O(n) on the sorted array; binary-search the smallest d whose count reaches k.",
        time: "O(n log n + n log(maxGap))",
        timeWhy: "Sort once, then O(n) counting inside a binary search over the value range.",
        space: "O(1)",
        spaceWhy: "Sorting aside, only counters and bounds.",
        code: `int smallestDistancePair(int[] nums, int k) {
    Arrays.sort(nums);
    int n = nums.length;
    int lo = 0, hi = nums[n - 1] - nums[0];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (countPairsAtMost(nums, mid) >= k) {
            hi = mid;                  // enough pairs; the answer is mid or smaller
        } else {
            lo = mid + 1;              // too few pairs; need a larger distance
        }
    }
    return lo;
}

// pairs with distance <= d, via a sliding window over the sorted array
private int countPairsAtMost(int[] nums, int d) {
    int count = 0, left = 0;
    for (int right = 0; right < nums.length; right++) {
        while (nums[right] - nums[left] > d) left++;   // shrink until within d
        count += right - left;                         // all i in [left, right) qualify
    }
    return count;
}`,
        walkthrough: [
          "nums=[1,6,1], k=3. Sorted [1,1,6]. maxGap=5, search d in [0,5].",
          "mid=2: count pairs with distance <= 2 -> (1,1) qualifies, 6 too far -> count 1 < 3 -> lo=3. mid=4: still only the (1,1) pair within 4 -> count 1 < 3 -> lo=5.",
          "lo==hi==5: count(5) includes all three pairs (>=3). Answer 5.",
        ],
      },
    ],
    edgeCases: [
      "Duplicate values → distance 0 pairs; if k is within their count the answer is 0.",
      "k equals the total number of pairs → returns the maximum gap.",
      "All elements equal → every distance is 0, so the answer is 0 for any valid k.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary search on the answer with a monotone feasibility count.",
      "**Kth Smallest Element in a Sorted Matrix** → binary search on value with a count-less-than-equal helper.",
      "**Median of Two Sorted Arrays** (in the library) → an order-statistic by binary search on the partition rather than the value.",
    ],
    related: ["koko-eating-bananas", "split-array-largest-sum", "median-of-two-sorted-arrays"],
  },

  {
    slug: "maximum-candies-allocated-to-k-children",
    title: "Maximum Candies Allocated to K Children",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 2226,
    statement:
      "You are given an array `candies` where `candies[i]` is the number of candies in the i-th pile, and an integer `k`. You may split any pile into smaller sub-piles (you cannot merge piles), and each of the `k` children must receive the **same** number of candies from a single sub-pile (leftovers may be discarded). Return the **maximum** number of candies each child can get, or `0` if it is impossible.",
    examples: [
      { in: "candies = [5,8,6], k = 3", out: "5", explanation: "give each child 5: from 5 -> 1 sub-pile, from 8 -> 1, from 6 -> 1; 3 sub-piles for 3 children" },
      { in: "candies = [2,5], k = 11", out: "0", explanation: "only 7 candies total cannot serve 11 children even with one each" },
    ],
    constraints: ["1 ≤ candies.length ≤ 10^5", "1 ≤ candies[i] ≤ 10^7", "1 ≤ k ≤ 10^12"],
    recognize:
      "Maximising an equal per-child amount under a 'serve at least k children' rule is **binary search on the answer**: the number of children servable at a candidate size is monotonic, so search the largest size that still serves k.",
    figureItOut: [
      "If we GUESS that each child gets exactly x candies, then a pile of size p can serve floor(p / x) children (each served child takes a fresh sub-pile of size x; the remainder is discarded). The total children servable at size x is the sum of floor(candies[i] / x) over all piles.",
      "That servable count is MONOTONIC non-increasing in x: bigger per-child portions mean fewer children can be served. So 'servable(x) >= k' is true for small x and becomes false past some threshold — a monotone predicate, perfect for binary search on x.",
      "We want the LARGEST x with servable(x) >= k. Search x in [1, max(candies)] (giving more than the biggest pile to one child is pointless since a sub-pile cannot exceed its pile). For each candidate mid, sum the floor divisions; if it serves at least k children, mid is feasible and we try larger; otherwise go smaller.",
      "Watch the impossibility case: if the TOTAL candies is less than k, even one candy each is impossible, so the answer is 0. The binary search naturally returns 0 if no x >= 1 is feasible, but use a 64-bit accumulator for the count because k can be up to 1e12 and the sum of floors can be large.",
      "Each feasibility check is O(n) floor divisions; binary search runs O(log(maxCandy)) times -> O(n log(maxCandy)) time, O(1) space. Using long for the servable count avoids overflow given the large k and pile sizes.",
    ],
    approaches: [
      {
        name: "Binary search on the per-child amount + count children (optimal)",
        intuition: "Children servable at size x is non-increasing; binary-search the largest x that still serves at least k.",
        time: "O(n log(maxCandy))",
        timeWhy: "An O(n) count inside a binary search over candidate amounts.",
        space: "O(1)",
        spaceWhy: "Only counters and search bounds.",
        code: `int maximumCandies(int[] candies, long k) {
    int hi = 0;
    for (int c : candies) hi = Math.max(hi, c);
    int lo = 1, answer = 0;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;        // candidate candies per child
        if (childrenServed(candies, mid) >= k) {
            answer = mid;                    // feasible, try a larger amount
            lo = mid + 1;
        } else {
            hi = mid - 1;                    // too large, serve fewer per child
        }
    }
    return answer;
}

// how many children can each get exactly 'size' candies
private long childrenServed(int[] candies, int size) {
    long total = 0;
    for (int c : candies) total += c / size;
    return total;
}`,
        walkthrough: [
          "candies=[5,8,6], k=3. Range [1,8]. mid=4: 5/4+8/4+6/4 = 1+2+1 = 4 >= 3 -> feasible, answer=4, lo=5.",
          "mid=6: 5/6+8/6+6/6 = 0+1+1 = 2 < 3 -> too large, hi=5. mid=5: 1+1+1 = 3 >= 3 -> feasible, answer=5, lo=6. lo>hi stop.",
          "Answer = 5.",
        ],
      },
    ],
    edgeCases: [
      "Total candies < k → no amount works → answer 0.",
      "k = 1 → answer is the largest pile (one child takes a whole pile).",
      "All piles equal and divisible → answer is pileSize when count of piles times the quotient covers k.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary search minimising a rate with a monotone hours count.",
      "**Minimum Limit of Balls in a Bag** (in the library) → binary search on a cap minimising the maximum, the mirror objective.",
      "**Magnetic Force Between Two Balls** (in the library) → binary search MAXIMISING a minimum spacing with a greedy feasibility check.",
    ],
    related: ["koko-eating-bananas", "minimum-limit-of-balls-in-a-bag", "magnetic-force-between-two-balls"],
  },
];
