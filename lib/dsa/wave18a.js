// NeetCode/Top-150/LeetCode-75/Grind-75 — wave 18a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave17a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE18A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "maximum-product-of-three-numbers",
    title: "Maximum Product of Three Numbers",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 628,
    statement:
      "Given an integer array `nums`, find three numbers whose product is **maximum** and return that maximum product. The array may contain negative numbers.",
    examples: [
      { in: "nums = [1,2,3]", out: "6", explanation: "1 * 2 * 3 = 6" },
      { in: "nums = [1,2,3,4]", out: "24", explanation: "2 * 3 * 4 = 24, the three largest" },
      { in: "nums = [-100,-98,-1,2,3]", out: "29400", explanation: "(-100) * (-98) * 3 = 29400 beats 2 * 3 * (-1)" },
    ],
    constraints: ["3 ≤ nums.length ≤ 10^4", "-1000 ≤ nums[i] ≤ 1000"],
    recognize:
      "Maximising a product of three values with possible negatives is a **track-the-extremes** problem: the answer is always built from a tiny fixed set of candidates (the three largest, or the two smallest paired with the largest), so a single pass tracking the top-three and bottom-two suffices.",
    figureItOut: [
      "If every number were non-negative the answer would obviously be the three LARGEST values. Negatives break that, because a product of two negatives is positive and can be huge in magnitude — so two very negative numbers times a positive may beat the three largest.",
      "Enumerate the only sign patterns that can win for three factors: three positives (use the three largest), or two negatives and one positive (use the two most-negative, i.e. smallest, times the single largest). Any other mix is dominated by one of these two.",
      "So the maximum is simply max(max1 * max2 * max3, min1 * min2 * max1), where max1 >= max2 >= max3 are the three largest and min1 <= min2 are the two smallest. Both candidates reuse max1, the overall largest.",
      "You do not even need to sort. A single pass can track the three largest and two smallest values by updating a handful of variables, which is O(n) time and O(1) space versus O(n log n) for sorting.",
      "Initialise the three maxima to negative infinity and the two minima to positive infinity, then for each value cascade it into the right slot. At the end compare the two candidate products and return the larger.",
    ],
    approaches: [
      {
        name: "Sort and compare two candidate products",
        intuition: "After sorting, the winner is either the top three or the bottom two times the top one.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort.",
        space: "O(1)",
        spaceWhy: "In-place sort, constant extra variables.",
        code: `int maximumProduct(int[] nums) {
    Arrays.sort(nums);
    int n = nums.length;
    int topThree = nums[n - 1] * nums[n - 2] * nums[n - 3];
    int twoLowTopOne = nums[0] * nums[1] * nums[n - 1];
    return Math.max(topThree, twoLowTopOne);
}`,
      },
      {
        name: "Single pass tracking top-3 and bottom-2 (optimal)",
        intuition: "Maintain the three largest and two smallest values on the fly; the answer combines them.",
        time: "O(n)",
        timeWhy: "One pass, constant work per element.",
        space: "O(1)",
        spaceWhy: "Five tracking variables.",
        code: `int maximumProduct(int[] nums) {
    int max1 = Integer.MIN_VALUE, max2 = Integer.MIN_VALUE, max3 = Integer.MIN_VALUE;
    int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE;
    for (int v : nums) {
        if (v > max1) { max3 = max2; max2 = max1; max1 = v; }
        else if (v > max2) { max3 = max2; max2 = v; }
        else if (v > max3) { max3 = v; }
        if (v < min1) { min2 = min1; min1 = v; }
        else if (v < min2) { min2 = v; }
    }
    return Math.max(max1 * max2 * max3, min1 * min2 * max1);
}`,
        walkthrough: [
          "nums=[-100,-98,-1,2,3]. Track maxima: max1=3, max2=2, max3=-1. Track minima: min1=-100, min2=-98.",
          "Candidate A = 3 * 2 * (-1) = -6. Candidate B = (-100) * (-98) * 3 = 29400.",
          "max(-6, 29400) = 29400.",
        ],
      },
    ],
    edgeCases: [
      "All negative numbers → the three largest (closest to zero) give the max, a negative product.",
      "Exactly three elements → only one product exists; both candidates collapse to it.",
      "Mix with zeros → zero may be the best when all non-zero products are negative.",
    ],
    twists: [
      "**Maximum product of any K numbers** → sort and pair signs more carefully, or use a partial selection.",
      "**Maximum Product Subarray** (in the library) → contiguous product with a running max/min DP instead of pick-any.",
      "**Minimum product of three** → mirror the candidates: smallest three, or two largest times the smallest.",
    ],
    related: ["maximum-product-subarray", "sort-colors", "top-k-frequent-elements"],
  },

  {
    slug: "relative-sort-array",
    title: "Relative Sort Array",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1122,
    statement:
      "Given two arrays `arr1` and `arr2` where the elements of `arr2` are **distinct** and every element of `arr2` also appears in `arr1`, sort `arr1` so that its elements follow the **same relative order** as `arr2`. Elements of `arr1` that do not appear in `arr2` should be placed at the end in **ascending** order.",
    examples: [
      { in: "arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]", out: "[2,2,2,1,4,3,3,9,6,7,19]", explanation: "values follow arr2 order; 7 and 19 (absent from arr2) go to the end sorted" },
      { in: "arr1 = [28,6,22,8,44,17], arr2 = [22,28,8,6]", out: "[22,28,8,6,17,44]", explanation: "ranked values first, then 17 and 44 ascending" },
    ],
    constraints: ["1 ≤ arr1.length, arr2.length ≤ 1000", "0 ≤ arr1[i], arr2[i] ≤ 1000", "arr2 elements are distinct and all appear in arr1"],
    recognize:
      "Sorting by a CUSTOM priority defined by another array is a **rank-map + counting-sort** problem: assign each arr2 value a rank via a hash map, then emit values by ascending value while honouring that rank for the prioritised ones and tacking unranked values on at the end.",
    figureItOut: [
      "The order is dictated by arr2, not by natural numeric order. So the first idea is to give each arr2 value a RANK (its index in arr2) and sort arr1 by that rank, with unranked values sorted numerically and pushed last.",
      "A clean comparator-based way: build a map rank[value] = index in arr2. Sort arr1 with a custom comparator — if both values are ranked, compare ranks; if only one is ranked, the ranked one comes first; if neither is ranked, compare numerically.",
      "But the values are tiny (0..1000), which is the cue for a faster COUNTING approach. Tally how many times each value appears in arr1 using a fixed-size count array of length 1001.",
      "Then build the output in two phases. Phase one: walk arr2 in order; for each value v, append it count[v] times and zero out count[v] (these are the prioritised values in arr2 order). Phase two: walk the count array from 0 to 1000 and append any remaining values count[v] times — these are the leftover unranked values, naturally in ascending order.",
      "The counting approach is O(n + m + maxValue) time and O(maxValue) space, beating the O(n log n) comparator sort when the value range is small as here. Both are correct; counting sort exploits the bounded range.",
    ],
    approaches: [
      {
        name: "Rank map + comparator sort",
        intuition: "Map each arr2 value to its index, then sort arr1 by rank with unranked values trailing in numeric order.",
        time: "O(n log n)",
        timeWhy: "The comparator sort of arr1 dominates.",
        space: "O(n + m)",
        spaceWhy: "The rank map plus a boxed copy for comparator sorting.",
        code: `int[] relativeSortArray(int[] arr1, int[] arr2) {
    Map<Integer, Integer> rank = new HashMap<>();
    for (int i = 0; i < arr2.length; i++) rank.put(arr2[i], i);
    Integer[] boxed = new Integer[arr1.length];
    for (int i = 0; i < arr1.length; i++) boxed[i] = arr1[i];
    Arrays.sort(boxed, (a, b) -> {
        int ra = rank.getOrDefault(a, 1001 + a);   // unranked sort after, by value
        int rb = rank.getOrDefault(b, 1001 + b);
        return ra - rb;
    });
    int[] res = new int[arr1.length];
    for (int i = 0; i < res.length; i++) res[i] = boxed[i];
    return res;
}`,
      },
      {
        name: "Counting sort honouring arr2 order (optimal)",
        intuition: "Tally arr1 values, emit them in arr2 order first, then sweep remaining values ascending.",
        time: "O(n + m + V)",
        timeWhy: "Counting and two sweeps over the bounded value range V.",
        space: "O(V)",
        spaceWhy: "A fixed count array over the value range.",
        code: `int[] relativeSortArray(int[] arr1, int[] arr2) {
    int[] count = new int[1001];
    for (int v : arr1) count[v]++;
    int[] res = new int[arr1.length];
    int pos = 0;
    for (int v : arr2) {                 // prioritised values in arr2 order
        while (count[v] > 0) { res[pos++] = v; count[v]--; }
    }
    for (int v = 0; v <= 1000; v++) {    // leftovers ascending
        while (count[v] > 0) { res[pos++] = v; count[v]--; }
    }
    return res;
}`,
        walkthrough: [
          "arr1=[2,3,1,3,2,4,6,7,9,2,19], arr2=[2,1,4,3,9,6]. count: 1->1,2->3,3->2,4->1,6->1,7->1,9->1,19->1.",
          "Phase 1 (arr2 order): emit 2,2,2 then 1 then 4 then 3,3 then 9 then 6 -> [2,2,2,1,4,3,3,9,6].",
          "Phase 2 (ascending leftovers): 7 then 19 -> final [2,2,2,1,4,3,3,9,6,7,19].",
        ],
      },
    ],
    edgeCases: [
      "Every arr1 value appears in arr2 → phase two appends nothing.",
      "Duplicates in arr1 → emitted contiguously count[v] times in the right slot.",
      "Single-element arrays → trivially ordered.",
    ],
    twists: [
      "**Sort by a frequency-then-value key** → custom comparator combining two criteria.",
      "**Custom Sort String** → reorder a string by a priority string, the same rank-map idea.",
      "**Top K Frequent Elements** (in the library) → bucket/counting sort over counts rather than values.",
    ],
    related: ["top-k-frequent-elements", "sort-colors", "valid-anagram"],
  },

  {
    slug: "contains-duplicate-ii",
    title: "Contains Duplicate II",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 219,
    statement:
      "Given an integer array `nums` and an integer `k`, return `true` if there are two **distinct** indices `i` and `j` such that `nums[i] == nums[j]` and `|i - j| <= k`. Otherwise return `false`.",
    examples: [
      { in: "nums = [1,2,3,1], k = 3", out: "true", explanation: "the two 1s are at indices 0 and 3, distance 3 <= 3" },
      { in: "nums = [1,0,1,1], k = 1", out: "true", explanation: "the 1s at indices 2 and 3 are distance 1 apart" },
      { in: "nums = [1,2,3,1,2,3], k = 2", out: "false", explanation: "every repeated value is more than 2 apart" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9", "0 ≤ k ≤ 10^5"],
    recognize:
      "Detecting a repeated value within a bounded index distance is a **hash map of last-seen index** (or a sliding-window hash set of size k): remember where each value was last seen and check the gap, or keep only the most recent k values in a set.",
    figureItOut: [
      "We need two equal values whose indices are at most k apart. The brute force compares every pair within distance k, which is O(n*k) and too slow for large k.",
      "The cleaner idea: as we scan, remember the MOST RECENT index at which each value appeared. When we see a value again at index i and it was last seen at index j, the closest possible duplicate is exactly i - j, so check i - j <= k.",
      "If that gap exceeds k, the value is still useful going forward, so OVERWRITE its stored index with the current i — a later occurrence might fall within k of a future one. Keeping only the latest index is correct because a nearer match always uses the most recent prior occurrence.",
      "An equivalent framing is a sliding window: maintain a set of the values in the last k indices. Before processing index i, if i > k remove nums[i - k - 1] from the set; then if nums[i] is already in the set we found a duplicate within k, otherwise add it.",
      "Both run in O(n) time. The last-seen map uses O(n) space in the worst case (all distinct values); the windowed set uses O(min(n, k)) space, which can be tighter when k is small.",
    ],
    approaches: [
      {
        name: "Hash map of value to last-seen index",
        intuition: "Store each value's most recent index and check the gap on every repeat.",
        time: "O(n)",
        timeWhy: "One pass with O(1) map operations.",
        space: "O(n)",
        spaceWhy: "Up to n distinct values stored.",
        code: `boolean containsNearbyDuplicate(int[] nums, int k) {
    Map<Integer, Integer> lastSeen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        Integer prev = lastSeen.get(nums[i]);
        if (prev != null && i - prev <= k) return true;
        lastSeen.put(nums[i], i);     // keep only the most recent index
    }
    return false;
}`,
      },
      {
        name: "Sliding window hash set of size k (optimal)",
        intuition: "Keep only the last k values in a set; a value already present is a duplicate within k.",
        time: "O(n)",
        timeWhy: "Each index is added and removed from the set at most once.",
        space: "O(min(n, k))",
        spaceWhy: "The set holds at most k recent values.",
        code: `boolean containsNearbyDuplicate(int[] nums, int k) {
    Set<Integer> window = new HashSet<>();
    for (int i = 0; i < nums.length; i++) {
        if (i > k) window.remove(nums[i - k - 1]);   // drop the value that fell out of range
        if (!window.add(nums[i])) return true;       // add fails -> already in the last k
    }
    return false;
}`,
        walkthrough: [
          "nums=[1,2,3,1], k=3. window grows: add 1, add 2, add 3. i never exceeds k=3 yet so nothing is removed.",
          "i=3: i > k is false (3 > 3 is false), so no removal; try add nums[3]=1 -> already present -> return true.",
          "The two 1s are within distance 3, so the answer is true.",
        ],
      },
    ],
    edgeCases: [
      "k = 0 → no two distinct indices can be within distance 0 → always false.",
      "All distinct values → never a duplicate → false.",
      "Adjacent equal values with k >= 1 → true.",
    ],
    twists: [
      "**Contains Duplicate** (in the library) → drop the distance constraint; a plain set suffices.",
      "**Contains Duplicate III** → values within k indices AND within value-difference t, needing buckets or a TreeSet.",
      "**Longest Substring Without Repeating** (in the library) → a sliding window enforcing no repeats at all.",
    ],
    related: ["contains-duplicate", "two-sum", "longest-substring-without-repeating"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "count-pairs-whose-sum-is-less-than-target",
    title: "Count Pairs Whose Sum is Less than Target",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 2824,
    statement:
      "Given a 0-indexed integer array `nums` of length `n` and an integer `target`, return the number of pairs `(i, j)` with `0 <= i < j < n` such that `nums[i] + nums[j] < target`.",
    examples: [
      { in: "nums = [-1,1,2,3,1], target = 2", out: "3", explanation: "the pairs (0,1), (0,2), (0,4) have sums 0, 1, 0 all < 2" },
      { in: "nums = [-6,2,5,-2,-7,-1,3], target = -2", out: "10", explanation: "ten index pairs have a sum below -2" },
    ],
    constraints: ["1 ≤ nums.length == n ≤ 50", "-50 ≤ nums[i], target ≤ 50"],
    recognize:
      "Counting pairs below a sum threshold does not depend on index order (only on values), so SORT and use the **opposite-ends two-pointer counting** trick: when the lightest plus heaviest is below target, every value between them also qualifies, so count a whole block at once.",
    figureItOut: [
      "The pairs are unordered in VALUE — swapping which element is i vs j does not change nums[i] + nums[j]. So we can freely sort the array; sorting cannot change how many value-pairs sum below target, only relabel the indices.",
      "After sorting, use two pointers: lo at the smallest value, hi at the largest. Look at nums[lo] + nums[hi]. If this smallest-plus-largest sum is already < target, then nums[lo] paired with EVERY value from lo+1 up to hi is also < target (those middle values are all <= nums[hi]).",
      "That gives a block count: there are (hi - lo) such pairs in one shot. Add hi - lo to the answer, then advance lo (we are done counting pairs that use this smallest element) and continue.",
      "If instead nums[lo] + nums[hi] >= target, the largest value is too big to pair with the current smallest, so it is too big for anything — decrement hi to drop it. The largest element only ever moves inward.",
      "Each pointer moves monotonically, so the sweep is O(n) after an O(n log n) sort. The block-counting is what makes it linear instead of quadratic: we never enumerate the middle pairs individually.",
    ],
    approaches: [
      {
        name: "Brute force over all pairs",
        intuition: "Try every i < j and test the sum.",
        time: "O(n^2)",
        timeWhy: "Quadratically many pairs checked.",
        space: "O(1)",
        spaceWhy: "Only a counter.",
        code: `int countPairs(List<Integer> nums, int target) {
    int n = nums.size(), count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums.get(i) + nums.get(j) < target) count++;
        }
    }
    return count;
}`,
      },
      {
        name: "Sort + opposite-ends two-pointer block count (optimal)",
        intuition: "When the smallest+largest is below target, all values in between also qualify, so count the whole block.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the pointer sweep is linear.",
        space: "O(1)",
        spaceWhy: "Sorting aside, two indices and a counter.",
        code: `int countPairs(List<Integer> nums, int target) {
    Collections.sort(nums);
    int lo = 0, hi = nums.size() - 1, count = 0;
    while (lo < hi) {
        if (nums.get(lo) + nums.get(hi) < target) {
            count += hi - lo;     // lo pairs with every value up to hi
            lo++;
        } else {
            hi--;                 // largest too big for the current smallest
        }
    }
    return count;
}`,
        walkthrough: [
          "nums=[-1,1,2,3,1], target=2. Sorted [-1,1,1,2,3]. lo=0(-1), hi=4(3): -1+3=2, not < 2 -> hi=3.",
          "lo=0(-1), hi=3(2): -1+2=1 < 2 -> count += hi-lo = 3, lo=1. lo=1(1), hi=3(2): 1+2=3 not < 2 -> hi=2.",
          "lo=1(1), hi=2(1): 1+1=2 not < 2 -> hi=1, lo==hi stop. Total 3.",
        ],
      },
    ],
    edgeCases: [
      "No pair qualifies → count stays 0.",
      "All pairs qualify → count equals n*(n-1)/2.",
      "Single element → no pair → 0.",
    ],
    twists: [
      "**Two Sum Less Than K** (in the library) → find the MAXIMUM qualifying sum instead of counting pairs.",
      "**Number of Subsequences That Satisfy the Given Sum Condition** (in the library) → count subsequences by min+max with the same sorted two-pointer.",
      "**Count pairs with sum <= target across two arrays** → merge-style two pointers over both sorted arrays.",
    ],
    related: ["two-sum-less-than-k", "number-of-subsequences-that-satisfy-the-given-sum-condition", "two-sum-ii"],
  },

  {
    slug: "maximize-distance-to-closest-person",
    title: "Maximize Distance to Closest Person",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 849,
    statement:
      "You are given an array `seats` where `seats[i] == 1` means a person sits there and `seats[i] == 0` means the seat is empty. There is at least one empty seat and at least one person. Alex wants to sit in an empty seat so that the distance to the **nearest** person is **maximized**. Return that maximum possible distance.",
    examples: [
      { in: "seats = [1,0,0,0,1,0,1]", out: "2", explanation: "sitting at index 2 gives nearest-person distance 2" },
      { in: "seats = [1,0,0,0]", out: "3", explanation: "sitting at the last index is distance 3 from the only person" },
      { in: "seats = [0,1]", out: "1", explanation: "the leading empty seat is distance 1 from the person" },
    ],
    constraints: ["2 ≤ seats.length ≤ 2 * 10^4", "seats[i] is 0 or 1", "at least one empty seat and one person exist"],
    recognize:
      "Maximising the nearest-person distance is a **two-pointer gap scan between consecutive occupied seats**: the best interior seat sits at the MIDDLE of the widest empty run (gap/2), while leading or trailing empty runs allow the full edge length.",
    figureItOut: [
      "Alex sits in some empty seat; the value of that seat is the distance to the closest occupied seat. We want the empty seat that maximises this. So really we are scanning runs of empty seats between people.",
      "For an empty run BETWEEN two people whose indices are prev and i, the best spot is the middle, giving a nearest-person distance of (i - prev) / 2. Track the previous occupied index prev and update the best whenever a new person is reached.",
      "Edge runs are special. Empty seats BEFORE the first person let Alex sit at the very start, distance = index of the first person (no person on the left). Empty seats AFTER the last person let Alex sit at the very end, distance = (n - 1) - index of the last person.",
      "So sweep with a pointer prev = -1 (no previous person yet). At each occupied seat i: if prev == -1 the leading gap gives distance i; otherwise the interior gap gives (i - prev) / 2. Update the best and set prev = i. After the loop, handle the trailing run with n - 1 - prev.",
      "It is a single linear pass tracking the previous person's index — a two-pointer (prev, i) gap analysis. O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Two-pass nearest-distance arrays",
        intuition: "Compute distance to the nearest person on the left and on the right, then take the best min over empty seats.",
        time: "O(n)",
        timeWhy: "Two sweeps plus a final scan.",
        space: "O(n)",
        spaceWhy: "Two distance arrays.",
        code: `int maxDistToClosest(int[] seats) {
    int n = seats.length;
    int[] left = new int[n], right = new int[n];
    int dist = n;
    for (int i = 0; i < n; i++) {           // nearest person to the left
        if (seats[i] == 1) dist = 0; else dist++;
        left[i] = dist;
    }
    dist = n;
    for (int i = n - 1; i >= 0; i--) {      // nearest person to the right
        if (seats[i] == 1) dist = 0; else dist++;
        right[i] = dist;
    }
    int best = 0;
    for (int i = 0; i < n; i++) {
        if (seats[i] == 0) best = Math.max(best, Math.min(left[i], right[i]));
    }
    return best;
}`,
      },
      {
        name: "Single-pass gap scan between people (optimal)",
        intuition: "Track the previous occupied index; interior gaps give gap/2, edge gaps give the full edge length.",
        time: "O(n)",
        timeWhy: "One pass tracking the last person's index.",
        space: "O(1)",
        spaceWhy: "Two pointers and a running best.",
        code: `int maxDistToClosest(int[] seats) {
    int n = seats.length;
    int prev = -1, best = 0;
    for (int i = 0; i < n; i++) {
        if (seats[i] == 1) {
            if (prev == -1) {
                best = i;                 // leading empty run: sit at the start
            } else {
                best = Math.max(best, (i - prev) / 2);   // middle of an interior gap
            }
            prev = i;
        }
    }
    best = Math.max(best, n - 1 - prev);  // trailing empty run: sit at the end
    return best;
}`,
        walkthrough: [
          "seats=[1,0,0,0,1,0,1]. i=0 person, prev=-1 -> best=0, prev=0. i=4 person -> gap 4-0=4, 4/2=2 -> best=2, prev=4.",
          "i=6 person -> gap 6-4=2, 2/2=1, best stays 2, prev=6. Loop ends.",
          "Trailing: n-1-prev = 6-6 = 0. Answer max(2,0) = 2.",
        ],
      },
    ],
    edgeCases: [
      "Leading empty run → distance equals the first person's index.",
      "Trailing empty run → distance equals n-1 minus the last person's index.",
      "Single wide interior gap → best is half the gap (rounded down).",
    ],
    twists: [
      "**Shortest Distance to a Character** (in the library) → per-position nearest distance via the same two-sweep idea.",
      "**Exam Room** → repeatedly seating people, maintaining gaps with a heap or ordered set.",
      "**Magnetic Force Between Two Balls** (in the library) → maximise a minimum spacing via binary search instead.",
    ],
    related: ["shortest-distance-to-a-character", "magnetic-force-between-two-balls", "max-consecutive-ones"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
    title: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1438,
    statement:
      "Given an array `nums` and an integer `limit`, return the size of the **longest contiguous subarray** such that the absolute difference between any two elements of that subarray is **less than or equal to** `limit`.",
    examples: [
      { in: "nums = [8,2,4,7], limit = 4", out: "2", explanation: "[2,4] and [4,7] have max diff 2 and 3; longer windows exceed limit 4" },
      { in: "nums = [10,1,2,4,7,2], limit = 5", out: "4", explanation: "[2,4,7,2] has max-min = 7-2 = 5 <= 5" },
      { in: "nums = [4,2,2,2,4,4,2,2], limit = 0", out: "3", explanation: "the longest run of equal values is [2,2,2]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "1 ≤ nums[i] ≤ 10^9", "0 ≤ limit ≤ 10^9"],
    recognize:
      "Tracking max-minus-min inside a growing/shrinking window is a **sliding window with two monotonic deques**: one deque keeps the window maximum, one keeps the minimum, so the window's spread is queryable in O(1) and the window shrinks whenever the spread exceeds the limit.",
    figureItOut: [
      "The condition 'any two elements differ by at most limit' is equivalent to 'max(window) - min(window) <= limit'. So at every moment we just need the current window's maximum and minimum.",
      "This is a variable-size sliding window: extend the right edge greedily, and whenever max - min exceeds limit, shrink from the left until the condition holds again. The answer is the largest valid window width seen.",
      "The challenge is getting max and min of the window FAST as it changes. A naive recompute is O(n) per step -> O(n^2). Instead keep two monotonic deques: a decreasing deque whose front is the window max, and an increasing deque whose front is the window min.",
      "When adding nums[right], pop from the back of the max-deque while it holds smaller values (they can never be the max again), and pop from the back of the min-deque while it holds larger values. Push the new index/value. The fronts now reflect the window extremes.",
      "When the spread max - min exceeds limit, advance left and, if the element leaving was at a deque's front, pop that front. Each index enters and leaves each deque at most once, so the whole scan is O(n) time and O(n) space.",
    ],
    approaches: [
      {
        name: "Sliding window with a TreeMap of counts",
        intuition: "Keep a multiset of the window; query its max and min in log time and shrink on violation.",
        time: "O(n log n)",
        timeWhy: "Each insert/remove on the balanced map is O(log n).",
        space: "O(n)",
        spaceWhy: "The map holds the window's values.",
        code: `int longestSubarray(int[] nums, int limit) {
    TreeMap<Integer, Integer> window = new TreeMap<>();
    int left = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        window.merge(nums[right], 1, Integer::sum);
        while (window.lastKey() - window.firstKey() > limit) {
            int v = nums[left++];
            if (window.merge(v, -1, Integer::sum) == 0) window.remove(v);
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
      },
      {
        name: "Sliding window with two monotonic deques (optimal)",
        intuition: "A max-deque and a min-deque expose the window extremes in O(1); shrink when the spread exceeds limit.",
        time: "O(n)",
        timeWhy: "Each index is pushed and popped from each deque at most once.",
        space: "O(n)",
        spaceWhy: "The two deques hold at most the window's indices.",
        code: `int longestSubarray(int[] nums, int limit) {
    Deque<Integer> maxDq = new ArrayDeque<>();   // decreasing: front is max
    Deque<Integer> minDq = new ArrayDeque<>();   // increasing: front is min
    int left = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        while (!maxDq.isEmpty() && nums[maxDq.peekLast()] <= nums[right]) maxDq.pollLast();
        while (!minDq.isEmpty() && nums[minDq.peekLast()] >= nums[right]) minDq.pollLast();
        maxDq.addLast(right);
        minDq.addLast(right);
        while (nums[maxDq.peekFirst()] - nums[minDq.peekFirst()] > limit) {
            if (maxDq.peekFirst() == left) maxDq.pollFirst();
            if (minDq.peekFirst() == left) minDq.pollFirst();
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        walkthrough: [
          "nums=[10,1,2,4,7,2], limit=5. As right grows, maxDq front gives the window max, minDq front the min.",
          "When the window [10,1] has spread 9 > 5, left advances dropping 10. The window grows to [1,2,4,7] briefly, then [2,4,7,2] with spread 7-2=5 <= 5.",
          "Largest valid width is 4 -> answer 4.",
        ],
      },
    ],
    edgeCases: [
      "limit = 0 → only runs of identical values qualify; answer is the longest equal run.",
      "Entire array within limit → answer is the full length.",
      "Strictly increasing array with small limit → window stays size 1 or 2.",
    ],
    twists: [
      "**Sliding Window Maximum** (in the library) → just the max-deque half of this technique.",
      "**Shortest Subarray with Sum at Least K** → a monotonic deque over prefix sums instead of values.",
      "**Constraint on max - min < limit (strict)** → flip the shrink condition to >= limit.",
    ],
    related: ["sliding-window-maximum", "minimum-size-subarray-sum", "longest-subarray-of-1s-after-deleting-one-element"],
  },

  {
    slug: "count-complete-subarrays-in-an-array",
    title: "Count Complete Subarrays in an Array",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 2799,
    statement:
      "You are given an array `nums` of positive integers. A subarray is **complete** if the number of **distinct** elements in the subarray equals the number of distinct elements in the **whole** array. Return the number of complete subarrays.",
    examples: [
      { in: "nums = [1,3,1,2,2]", out: "4", explanation: "the whole array has 3 distinct values; 4 subarrays contain all 3" },
      { in: "nums = [5,5,5,5]", out: "10", explanation: "only one distinct value, so every one of the 10 subarrays is complete" },
    ],
    constraints: ["1 ≤ nums.length ≤ 1000", "1 ≤ nums[i] ≤ 2000"],
    recognize:
      "Counting subarrays that contain ALL distinct values is the **at-least-k-distinct sliding window** trick: once a window starting at `left` first contains every distinct value at index `right`, every extension to the array's end is also complete — so count `n - right` per left and slide.",
    figureItOut: [
      "First find the target: the number of distinct values in the whole array, call it total. A subarray is complete exactly when it contains all `total` distinct values.",
      "Key monotonicity: if a subarray [left, right] already contains all distinct values, then ANY subarray [left, right'] with right' >= right also contains them — extending the right edge can never lose a value. So for each fixed left, there is a SMALLEST right that first makes the window complete, and every right from there to n-1 gives a complete subarray.",
      "That turns it into a two-pointer count. Fix left, expand right with a frequency map until the window holds all `total` distinct values. The number of complete subarrays starting at this left is n - right (this right plus everything beyond it).",
      "Then advance left by one: remove nums[left] from the window (decrement its count, dropping it from the distinct set if it hits zero). The right pointer never moves backward — it only moves forward across the whole scan — so the total work is linear in n.",
      "Sum n - right over all left positions. Building the distinct count is O(n); the two-pointer sweep is O(n) with O(distinct) space for the frequency map.",
    ],
    approaches: [
      {
        name: "Brute force counting distinct per subarray",
        intuition: "For every start, expand and track distinct values, counting whenever it equals total.",
        time: "O(n^2)",
        timeWhy: "Quadratically many subarrays, each tracked incrementally.",
        space: "O(n)",
        spaceWhy: "A set per starting index.",
        code: `int countCompleteSubarrays(int[] nums) {
    int total = (int) Arrays.stream(nums).distinct().count();
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        Set<Integer> seen = new HashSet<>();
        for (int j = i; j < nums.length; j++) {
            seen.add(nums[j]);
            if (seen.size() == total) count++;
        }
    }
    return count;
}`,
      },
      {
        name: "Sliding window counting tail extensions (optimal)",
        intuition: "For each left, find the first right that completes the window; add n - right and slide left.",
        time: "O(n)",
        timeWhy: "Both pointers only move forward across the array.",
        space: "O(n)",
        spaceWhy: "A frequency map over distinct values in the window.",
        code: `int countCompleteSubarrays(int[] nums) {
    int total = (int) Arrays.stream(nums).distinct().count();
    int n = nums.length;
    Map<Integer, Integer> freq = new HashMap<>();
    long count = 0;
    int right = 0;
    for (int left = 0; left < n; left++) {
        while (right < n && freq.size() < total) {
            freq.merge(nums[right], 1, Integer::sum);
            right++;
        }
        if (freq.size() == total) count += n - right + 1;   // [left, right-1] and all extensions
        int c = freq.merge(nums[left], -1, Integer::sum);
        if (c == 0) freq.remove(nums[left]);
    }
    return (int) count;
}`,
        walkthrough: [
          "nums=[1,3,1,2,2]. total distinct = 3. left=0: expand right to index 3 (window [1,3,1,2]) which has all 3; right=4 after loop.",
          "Complete subarrays starting at left=0: n - right + 1 = 5 - 4 + 1 = 2 (windows ending at index 3 and 4). Remove nums[0]=1.",
          "Continuing for left=1,2 adds the rest; total complete subarrays = 4.",
        ],
      },
    ],
    edgeCases: [
      "All identical elements → total is 1; every subarray is complete, giving n*(n+1)/2.",
      "All distinct elements → only the full array is complete → answer 1.",
      "Single element → answer 1.",
    ],
    twists: [
      "**Subarrays with K Different Integers** (in the library) → count windows with exactly K distinct via atMost(K) - atMost(K-1).",
      "**Number of Substrings Containing All Three Characters** (in the library) → the same tail-extension count for a fixed alphabet.",
      "**Longest Substring Without Repeating** (in the library) → the variable window where distinct == length.",
    ],
    related: ["subarrays-with-k-different-integers", "number-of-substrings-containing-all-three-characters", "longest-substring-without-repeating"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "number-of-visible-people-in-a-queue",
    title: "Number of Visible People in a Queue",
    difficulty: "Hard",
    pattern: "stack",
    leetcode: 1944,
    statement:
      "There are `n` people in a queue numbered `0..n-1` from left to right, with distinct heights given by an array `heights`. A person `i` can SEE person `j` (where `i < j`) if everyone strictly between them is SHORTER than both `heights[i]` and `heights[j]` (that is, min(heights[i], heights[j]) > every height in between). Return an array `answer` where `answer[i]` is the number of people person `i` can see to their right.",
    examples: [
      { in: "heights = [10,6,8,5,11,9]", out: "[3,1,2,1,1,0]", explanation: "person 0 sees 6, 8, 11; person 2 sees 5 and 11; person 4 sees 9" },
      { in: "heights = [5,1,2,3,10]", out: "[4,1,1,1,0]", explanation: "person 0 sees 1, 2, 3, 10 because each new visible person is taller than the previous" },
    ],
    constraints: ["n == heights.length", "1 ≤ n ≤ 10^5", "1 ≤ heights[i] ≤ 10^5", "all heights are distinct"],
    recognize:
      "Counting how many ever-taller people each person sees to the right is a **monotonic decreasing stack scanned right-to-left**: each person sees a run of strictly increasing heights, which is exactly the people popped (all shorter) plus the first taller one that blocks the view.",
    figureItOut: [
      "Person i sees person j to the right only if nobody between them is at least as tall as the shorter of the two. So from i, the people visible to the right are a strictly INCREASING sequence of heights: each visible person must be taller than all previously visible ones, otherwise they would be blocked.",
      "That 'visible run is strictly increasing, and stops at the first person taller than i' is the signature of a monotonic stack. Process people from RIGHT to LEFT, maintaining a stack of heights that is decreasing from bottom to top.",
      "For person i, pop every stacked height that is SHORTER than heights[i] — person i can see each of those (they are progressively taller as we pop, forming the increasing visible run), so each pop counts as one visible person.",
      "After popping the shorter ones, if the stack is still non-empty, the height on top is the first person TALLER than i: person i can see that one too (it blocks everything beyond), so add one more to the count. Then push heights[i] for people further left to consider.",
      "Each height is pushed once and popped once, so the whole scan is O(n) time and O(n) space — the classic next-greater-style monotonic stack, just counting pops plus the blocker.",
    ],
    approaches: [
      {
        name: "Brute force scanning right with a running max",
        intuition: "For each i, scan rightward tracking the tallest seen; count people taller than that running max, stopping at the first taller-than-i.",
        time: "O(n^2)",
        timeWhy: "Each person may scan the rest of the queue.",
        space: "O(1)",
        spaceWhy: "Only counters beyond the output.",
        code: `int[] canSeePersonsCount(int[] heights) {
    int n = heights.length;
    int[] answer = new int[n];
    for (int i = 0; i < n; i++) {
        int maxSeen = 0;
        for (int j = i + 1; j < n; j++) {
            if (heights[j] > maxSeen) {     // taller than everyone between -> visible
                answer[i]++;
                maxSeen = heights[j];
            }
            if (heights[j] > heights[i]) break;   // this person blocks the rest
        }
    }
    return answer;
}`,
      },
      {
        name: "Monotonic decreasing stack, right to left (optimal)",
        intuition: "Pop all shorter people (each visible) then count one blocker if a taller person remains on the stack.",
        time: "O(n)",
        timeWhy: "Each height is pushed and popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack of pending heights.",
        code: `int[] canSeePersonsCount(int[] heights) {
    int n = heights.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();   // decreasing heights, top is shortest
    for (int i = n - 1; i >= 0; i--) {
        int count = 0;
        while (!stack.isEmpty() && stack.peek() < heights[i]) {
            stack.pop();        // a shorter person to the right is visible
            count++;
        }
        if (!stack.isEmpty()) count++;   // the first taller person is also visible
        answer[i] = count;
        stack.push(heights[i]);
    }
    return answer;
}`,
        walkthrough: [
          "heights=[10,6,8,5,11,9]. Scan right to left. i=5 (9): stack empty -> answer[5]=0, push 9.",
          "i=4 (11): pop 9 (count 1), stack empty -> answer[4]=1, push 11. i=3 (5): top 11>5, no pops, blocker -> answer[3]=1, push 5.",
          "i=2 (8): pop 5 (count 1), top 11>8 -> +1 blocker -> answer[2]=2. Continuing yields [3,1,2,1,1,0].",
        ],
      },
    ],
    edgeCases: [
      "Strictly decreasing heights → each person sees exactly one (the immediate next), except the last.",
      "Strictly increasing heights → person 0 sees everyone; later people see one each.",
      "Last person → sees nobody → 0.",
    ],
    twists: [
      "**Daily Temperatures** (in the library) → monotonic stack returning the distance to the next warmer day.",
      "**Next Greater Element II** (in the library) → the same stack finding the next strictly greater value.",
      "**Online Stock Span** (in the library) → a monotonic stack counting a backward run instead.",
    ],
    related: ["daily-temperatures", "next-greater-element-ii", "online-stock-span"],
  },

  {
    slug: "exclusive-time-of-functions",
    title: "Exclusive Time of Functions",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 636,
    statement:
      "On a single-threaded CPU running `n` functions (ids `0..n-1`), you are given `logs` where each entry is `\"id:start:timestamp\"` or `\"id:end:timestamp\"`. A start happens at the BEGINNING of its timestamp and an end at the END of its timestamp. Return an array where `result[i]` is the **exclusive** time of function `i` (time spent in it, not counting nested calls).",
    examples: [
      { in: 'n = 2, logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]', out: "[3,4]", explanation: "fn1 runs units 2..5 (4 units); fn0 runs units 0,1 and 6 (3 units), excluding the nested call" },
      { in: 'n = 1, logs = ["0:start:0","0:end:0"]', out: "[1]", explanation: "fn0 runs for the single unit 0" },
    ],
    constraints: ["1 ≤ n ≤ 100", "1 ≤ logs.length ≤ 500", "0 ≤ function ids < n", "timestamps are non-decreasing and well-formed (balanced start/end)"],
    recognize:
      "Charging nested-call time correctly to a single-threaded call stack is a literal **stack-of-active-functions** simulation: push on start, pop on end, and credit elapsed time to whatever function currently sits on top of the stack.",
    figureItOut: [
      "Single-threaded execution with nested calls is exactly a call stack. When a function starts it is pushed; when it ends it is popped. At any instant the function actually running is the one on TOP of the stack.",
      "Exclusive time means a parent should NOT be charged for time spent inside a child. The stack handles this automatically: while a child is on top, all elapsed time is credited to the child, not the parent underneath.",
      "Track prevTime, the timestamp from which the current top has been running. On a START at time t, first credit the current top with (t - prevTime) units for the interval just before this new call begins, then push the new id and set prevTime = t.",
      "On an END at time t, the function on top ran through the END of t, so credit it (t - prevTime + 1) units (inclusive of timestamp t). Pop it, and set prevTime = t + 1, because the next unit of work belongs to whatever resumes after this function fully finishes at t.",
      "The +1 details encode that a start consumes the beginning of its timestamp while an end consumes through the end of its timestamp. One pass over the logs with a stack -> O(L) time for L logs and O(n) stack depth.",
    ],
    approaches: [
      {
        name: "Stack of active function ids with timestamp bookkeeping (optimal)",
        intuition: "Push on start, pop on end, and always credit elapsed time to the current top of the stack.",
        time: "O(L)",
        timeWhy: "Each log is processed once.",
        space: "O(n)",
        spaceWhy: "The call stack of active functions plus the result array.",
        code: `int[] exclusiveTime(int n, List<String> logs) {
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    int prevTime = 0;
    for (String log : logs) {
        String[] parts = log.split(":");
        int id = Integer.parseInt(parts[0]);
        boolean isStart = parts[1].equals("start");
        int time = Integer.parseInt(parts[2]);
        if (isStart) {
            if (!stack.isEmpty()) {
                result[stack.peek()] += time - prevTime;   // parent ran up to here
            }
            stack.push(id);
            prevTime = time;
        } else {
            result[stack.pop()] += time - prevTime + 1;     // inclusive of this timestamp
            prevTime = time + 1;                            // next unit belongs to the resumer
        }
    }
    return result;
}`,
        walkthrough: [
          'logs=["0:start:0","1:start:2","1:end:5","0:end:6"]. start 0 @0: stack empty, push 0, prev=0.',
          "start 1 @2: credit top 0 with 2-0=2, push 1, prev=2. end 1 @5: credit 1 with 5-2+1=4, pop, prev=6.",
          "end 0 @6: credit 0 with 6-6+1=1, pop. result[0]=2+1=3, result[1]=4 -> [3,4].",
        ],
      },
    ],
    edgeCases: [
      "A function calling itself recursively → multiple stack frames of the same id, each credited its own slice.",
      "Single start/end at the same timestamp → 1 unit charged.",
      "Deeply nested calls → the top always receives the current interval, the rest wait.",
    ],
    twists: [
      "**Logging with overlapping (multi-threaded) calls** → a stack no longer models it; needs interval accounting.",
      "**Total inclusive time** → also credit ancestors, summing nested time into parents.",
      "**Asteroid Collision** (in the library) → another single-pass stack simulation of interacting events.",
    ],
    related: ["asteroid-collision", "simplify-path", "basic-calculator-ii"],
  },

  {
    slug: "reverse-substrings-between-each-pair-of-parentheses",
    title: "Reverse Substrings Between Each Pair of Parentheses",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1190,
    statement:
      "You are given a string `s` consisting of lowercase letters and balanced parentheses. Reverse the substrings inside each pair of matching parentheses, starting from the **innermost** pair, and return the final string with all parentheses removed.",
    examples: [
      { in: 's = "(abcd)"', out: '"dcba"', explanation: "reverse the only pair" },
      { in: 's = "(u(love)i)"', out: '"iloveu"', explanation: "reverse love -> evol, then reverse u evol i -> i love u" },
      { in: 's = "(ed(et(oc))el)"', out: '"leetcode"', explanation: "innermost-first reversals build leetcode" },
    ],
    constraints: ["0 ≤ s.length ≤ 2000", "s consists of lowercase English letters and parentheses", "parentheses are balanced"],
    recognize:
      "Resolving nested parenthesised reversals is a **stack-of-builders** simulation: each `(` opens a new buffer, each `)` reverses the current buffer and merges it into the parent buffer — the innermost-first ordering falls out for free.",
    figureItOut: [
      "Reversals nest: an inner pair is reversed first, then its result participates in the outer reversal. A stack naturally captures this nesting — each open paren begins a fresh layer of text.",
      "Keep a stack of StringBuilders. Start with one builder for the top level. On a normal letter, append it to the CURRENT (top) builder. On a '(', push a new empty builder to start collecting the parenthesised content.",
      "On a ')', the current builder holds exactly the content of the innermost open pair. Reverse it, pop it, and append the reversed text to the builder now on top (its parent). Doing this at every ')' means inner pairs are reversed before outer ones — exactly the innermost-first rule.",
      "Because reversing then appending to the parent composes correctly, the final builder at the bottom of the stack holds the fully resolved string with no parentheses left.",
      "A naive approach reverses substrings in place repeatedly and is O(n^2) in the worst case (deep nesting). The stack-of-builders is O(n) amortised since each character is appended a small number of times — and a smarter O(n) 'wormhole' jump-table variant exists too. O(n) space for the builders.",
    ],
    approaches: [
      {
        name: "Repeated in-place reversal scan",
        intuition: "Find a matching pair, reverse the text between them, delete the parens, repeat.",
        time: "O(n^2)",
        timeWhy: "Each reversal can touch O(n) characters and there can be O(n) pairs.",
        space: "O(n)",
        spaceWhy: "A mutable buffer of the string.",
        code: `String reverseParentheses(String s) {
    StringBuilder sb = new StringBuilder(s);
    int open;
    while ((open = sb.lastIndexOf("(")) >= 0) {
        int close = sb.indexOf(")", open);
        String inner = sb.substring(open + 1, close);
        sb.replace(open, close + 1, new StringBuilder(inner).reverse().toString());
    }
    return sb.toString();
}`,
      },
      {
        name: "Stack of string builders (optimal)",
        intuition: "Open a new buffer per '(' and, on ')', reverse it into the parent buffer.",
        time: "O(n)",
        timeWhy: "Each character is appended a constant number of times amortised.",
        space: "O(n)",
        spaceWhy: "The stack of builders holds the string's characters.",
        code: `String reverseParentheses(String s) {
    Deque<StringBuilder> stack = new ArrayDeque<>();
    stack.push(new StringBuilder());          // top-level buffer
    for (char ch : s.toCharArray()) {
        if (ch == '(') {
            stack.push(new StringBuilder());  // start a nested layer
        } else if (ch == ')') {
            StringBuilder done = stack.pop().reverse();   // reverse innermost
            stack.peek().append(done);                    // merge into parent
        } else {
            stack.peek().append(ch);
        }
    }
    return stack.pop().toString();
}`,
        walkthrough: [
          's="(u(love)i)". Push top buffer. "(" push layer1. append u. "(" push layer2. append love.',
          '")" -> reverse layer2 "love"->"evol", merge into layer1 -> "uevol". append i -> "uevoli".',
          '")" -> reverse layer1 "uevoli"->"iloveu", merge into top. Result "iloveu".',
        ],
      },
    ],
    edgeCases: [
      "No parentheses → string returned unchanged.",
      "Empty parentheses like \"()\" → reverse of empty is empty.",
      "Deeply nested single pairs → repeated reversals compose down to the answer.",
    ],
    twists: [
      "**O(n) wormhole technique** → precompute matching-pair jumps and walk the string with a flipping direction, never building nested buffers.",
      "**Decode String** (in the library) → a similar stack-of-builders but with repeat counts instead of reversals.",
      "**Basic Calculator** → a stack handling nested parentheses for arithmetic rather than text.",
    ],
    related: ["decode-string", "basic-calculator-ii", "valid-parentheses"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "find-minimum-in-rotated-sorted-array-ii",
    title: "Find Minimum in Rotated Sorted Array II",
    difficulty: "Hard",
    pattern: "binary-search",
    leetcode: 154,
    statement:
      "Suppose a sorted array of length `n` (possibly containing **duplicates**) is rotated between 1 and n times. Given the rotated array `nums`, return the **minimum** element. You must minimise the number of operations where possible.",
    examples: [
      { in: "nums = [1,3,5]", out: "1", explanation: "rotated array still has minimum 1" },
      { in: "nums = [2,2,2,0,1]", out: "0", explanation: "the rotation point holds the minimum 0" },
      { in: "nums = [3,3,1,3]", out: "1", explanation: "duplicates around the pivot still resolve to 1" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 5000", "-5000 ≤ nums[i] ≤ 5000", "the array was originally sorted ascending then rotated"],
    recognize:
      "Finding the rotation pivot with possible duplicates is **binary search comparing mid to the right end**, plus a single fallback: when `nums[mid]` equals `nums[hi]` you cannot tell which half holds the minimum, so shrink `hi` by one — the degenerate case that makes worst-case O(n).",
    figureItOut: [
      "A rotated ascending array has its minimum at the rotation point. Without duplicates you can binary-search by comparing the middle element to the RIGHT boundary: if nums[mid] > nums[hi], the pivot (minimum) is to the right of mid; otherwise it is at mid or to the left.",
      "Comparing to the right end (not the left) is the clean version: nums[mid] > nums[hi] means the right half is 'broken' (contains the wrap-around), so move lo = mid + 1. If nums[mid] < nums[hi] the right half is sorted, so the minimum is at mid or left: hi = mid.",
      "Duplicates introduce ambiguity: when nums[mid] == nums[hi], you cannot decide which side holds the minimum (e.g. [3,3,1,3] vs [1,3,3,3]). The safe, information-preserving move is hi = hi - 1: it discards one duplicate of the boundary value without ever discarding the unique minimum, because nums[hi] is duplicated at mid so dropping it is harmless.",
      "That single fallback is what degrades the worst case to O(n): an array like [2,2,2,2,2] forces hi to crawl down one at a time. In the average case it stays O(log n).",
      "Loop while lo < hi; when they meet, nums[lo] is the minimum. O(log n) average, O(n) worst time, O(1) space.",
    ],
    approaches: [
      {
        name: "Linear scan for the minimum",
        intuition: "Just take the minimum of the array directly.",
        time: "O(n)",
        timeWhy: "One pass over all elements.",
        space: "O(1)",
        spaceWhy: "A single running minimum.",
        code: `int findMin(int[] nums) {
    int min = nums[0];
    for (int v : nums) min = Math.min(min, v);
    return min;
}`,
      },
      {
        name: "Binary search vs right end with duplicate fallback (optimal)",
        intuition: "Compare mid to the right boundary; on a tie, drop the boundary by one to break the ambiguity.",
        time: "O(log n) average, O(n) worst",
        timeWhy: "Halving most steps, but the duplicate fallback can linearly shrink in degenerate inputs.",
        space: "O(1)",
        spaceWhy: "Two indices.",
        code: `int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) {
            lo = mid + 1;        // pivot is strictly to the right
        } else if (nums[mid] < nums[hi]) {
            hi = mid;            // mid could be the minimum
        } else {
            hi--;                // tie: safely discard one duplicate of nums[hi]
        }
    }
    return nums[lo];
}`,
        walkthrough: [
          "nums=[2,2,2,0,1]. lo=0,hi=4. mid=2 nums[2]=2, nums[4]=1 -> 2>1 -> lo=3.",
          "lo=3,hi=4. mid=3 nums[3]=0, nums[4]=1 -> 0<1 -> hi=3. lo==hi==3.",
          "Return nums[3] = 0.",
        ],
      },
    ],
    edgeCases: [
      "No rotation (already sorted) → nums[mid] < nums[hi] path drives to index 0.",
      "All equal elements → the duplicate fallback walks hi down; minimum still found.",
      "Single element → loop does not run; return it.",
    ],
    twists: [
      "**Find Minimum in Rotated Sorted Array** (in the library) → the no-duplicates version stays strictly O(log n).",
      "**Search in Rotated Sorted Array** (in the library) → locate a target rather than the minimum, with the same pivot logic.",
      "**Search in Rotated Sorted Array II** → search with duplicates, sharing this tie-breaking fallback.",
    ],
    related: ["find-minimum-in-rotated-sorted-array", "search-in-rotated-sorted-array", "single-element-in-a-sorted-array"],
  },

  {
    slug: "kth-smallest-number-in-multiplication-table",
    title: "Kth Smallest Number in Multiplication Table",
    difficulty: "Hard",
    pattern: "binary-search",
    leetcode: 668,
    statement:
      "Nearly everyone knows the `m x n` multiplication table where the cell at row `i`, column `j` holds `i * j` (1-indexed). Given `m`, `n`, and an integer `k`, return the **k-th smallest** value appearing in the `m x n` multiplication table.",
    examples: [
      { in: "m = 3, n = 3, k = 5", out: "3", explanation: "values sorted: 1,2,2,3,3,4,6,6,9; the 5th is 3" },
      { in: "m = 2, n = 3, k = 6", out: "6", explanation: "values 1,2,2,3,4,6; the 6th (largest) is 6" },
    ],
    constraints: ["1 ≤ m, n ≤ 3 * 10^4", "1 ≤ k ≤ m * n"],
    recognize:
      "Selecting the k-th smallest value from an implicit sorted-by-row table is **binary search on the answer value**: for a candidate x, count table entries <= x in O(m) using floor division per row, and find the smallest x whose count reaches k.",
    figureItOut: [
      "The table has up to 9*10^8 cells, far too many to enumerate. But the VALUES range only over [1, m*n], and we want the k-th smallest value — the textbook cue to binary-search on the value itself rather than on positions.",
      "We need a fast count(x) = how many table entries are <= x. Row i contains i*1, i*2, ..., i*n. The count of entries in row i that are <= x is the number of j with i*j <= x, i.e. floor(x / i), but capped at n because the row only has n columns. So count contribution of row i is min(x / i, n).",
      "Summing min(x / i, n) over i = 1..m gives count(x) in O(m) time. This count is MONOTONIC non-decreasing in x, so 'count(x) >= k' flips from false to true at exactly one threshold — perfect for binary search.",
      "We want the SMALLEST x with count(x) >= k. That smallest qualifying x is itself a table value and is the k-th smallest: there are fewer than k entries strictly below it and at least k at or below it. Binary search x in [1, m*n]: if count(mid) >= k set hi = mid, else lo = mid + 1.",
      "Each count is O(m) (loop over rows, cheaper if you make m the smaller dimension); binary search runs O(log(m*n)) times. Total O(m log(m*n)) time and O(1) space — no table materialised.",
    ],
    approaches: [
      {
        name: "Binary search on value + per-row floor count (optimal)",
        intuition: "Count entries <= x by summing min(x/i, n) over rows; search the smallest x whose count reaches k.",
        time: "O(m log(m*n))",
        timeWhy: "An O(m) count inside a binary search over the value range.",
        space: "O(1)",
        spaceWhy: "Only counters and bounds.",
        code: `int findKthNumber(int m, int n, int k) {
    int lo = 1, hi = m * n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (countAtMost(mid, m, n) >= k) {
            hi = mid;           // enough entries <= mid; answer is mid or smaller
        } else {
            lo = mid + 1;       // too few; need a larger value
        }
    }
    return lo;
}

// how many table cells hold a value <= x
private int countAtMost(int x, int m, int n) {
    int count = 0;
    for (int i = 1; i <= m; i++) {
        count += Math.min(x / i, n);   // row i contributes this many entries <= x
    }
    return count;
}`,
        walkthrough: [
          "m=3, n=3, k=5. Range [1,9]. mid=5: count = min(5,3)+min(2,3)+min(1,3) = 3+2+1 = 6 >= 5 -> hi=5.",
          "mid=3: count = min(3,3)+min(1,3)+min(1,3) = 3+1+1 = 5 >= 5 -> hi=3. mid=2: count = 2+1+0 = 3 < 5 -> lo=3.",
          "lo==hi==3. Answer 3 (matches sorted values 1,2,2,3,3,... fifth is 3).",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → smallest value is always 1 (cell 1*1).",
      "k = m*n → largest value m*n returned.",
      "m = 1 or n = 1 → table is a single row/column; answer is k itself.",
    ],
    twists: [
      "**Kth Smallest Element in a Sorted Matrix** → the same value-binary-search but counting via a staircase walk per row.",
      "**Find K-th Smallest Pair Distance** (in the library) → binary search on a value with a sliding-window count.",
      "**Ugly Number III** → binary search on value with inclusion-exclusion counting of multiples.",
    ],
    related: ["find-k-th-smallest-pair-distance", "split-array-largest-sum", "koko-eating-bananas"],
  },
];
