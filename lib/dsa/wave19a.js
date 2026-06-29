// NeetCode/Top-150/LeetCode-75/Grind-75 — wave 19a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave18a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE19A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "majority-element-ii",
    title: "Majority Element II",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 229,
    statement:
      "Given an integer array `nums` of size `n`, return all elements that appear **more than** `n/3` times. The answer may be in any order. Try to design an algorithm that runs in linear time and uses constant extra space.",
    examples: [
      { in: "nums = [3,2,3]", out: "[3]", explanation: "3 appears twice; n/3 is 1, and 2 > 1, so 3 qualifies" },
      { in: "nums = [1]", out: "[1]", explanation: "the single element appears once, more than 1/3" },
      { in: "nums = [1,2]", out: "[1,2]", explanation: "each appears once; n/3 = 0, so both exceed it" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5 * 10^4", "-10^9 ≤ nums[i] ≤ 10^9"],
    recognize:
      "Finding everything above an n/k frequency threshold in O(1) space is the **Boyer-Moore voting generalization**: there can be at most k-1 such elements, so maintain k-1 candidate-count pairs, then verify them in a second pass.",
    figureItOut: [
      "First a counting argument: how many distinct values can each appear MORE than n/3 times? If three different values all exceeded n/3, their combined count would exceed n, which is impossible. So there are at most TWO answers — never three.",
      "A hash map of counts solves it in O(n) time but O(n) space. The interesting target is O(1) space, which points to the Boyer-Moore majority vote, generalized from one candidate (for > n/2) to two candidates (for > n/3).",
      "Keep two candidate slots with two counters. For each value: if it matches an existing candidate, bump that counter; else if some counter is zero, adopt the value into that empty slot with count 1; else decrement BOTH counters (this value cancels one vote from each of the two leaders).",
      "The cancellation works because any value appearing more than n/3 times survives all the cancellations — it has too many votes to be fully cancelled by the rest. But the voting does NOT guarantee the survivors truly exceed n/3 (e.g. an array with no majority leaves stale candidates), so a second pass must recount the two finalists and keep only those genuinely above n/3.",
      "Be careful that the two candidate slots hold DISTINCT values: always check the match-existing-candidate branch before the empty-slot branch, otherwise the same value could occupy both slots. Two linear passes, O(1) extra space.",
    ],
    approaches: [
      {
        name: "Hash map of counts",
        intuition: "Tally every value, then collect those whose count exceeds n/3.",
        time: "O(n)",
        timeWhy: "One pass to count, one pass over the map.",
        space: "O(n)",
        spaceWhy: "Up to n distinct keys in the map.",
        code: `List<Integer> majorityElement(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int v : nums) count.merge(v, 1, Integer::sum);
    List<Integer> res = new ArrayList<>();
    int threshold = nums.length / 3;
    for (Map.Entry<Integer, Integer> e : count.entrySet()) {
        if (e.getValue() > threshold) res.add(e.getKey());
    }
    return res;
}`,
      },
      {
        name: "Boyer-Moore two-candidate voting (optimal)",
        intuition: "Track two candidates with two counters; cancel a vote from each when a third distinct value appears, then verify.",
        time: "O(n)",
        timeWhy: "Two linear passes, constant work per element.",
        space: "O(1)",
        spaceWhy: "Two candidate values and two counters.",
        code: `List<Integer> majorityElement(int[] nums) {
    int cand1 = 0, cand2 = 1, cnt1 = 0, cnt2 = 0;   // cand1 != cand2 initially
    for (int v : nums) {
        if (v == cand1) cnt1++;
        else if (v == cand2) cnt2++;
        else if (cnt1 == 0) { cand1 = v; cnt1 = 1; }
        else if (cnt2 == 0) { cand2 = v; cnt2 = 1; }
        else { cnt1--; cnt2--; }                    // a third value cancels one of each
    }
    cnt1 = 0; cnt2 = 0;
    for (int v : nums) {                            // recount the two finalists
        if (v == cand1) cnt1++;
        else if (v == cand2) cnt2++;
    }
    List<Integer> res = new ArrayList<>();
    int n = nums.length;
    if (cnt1 > n / 3) res.add(cand1);
    if (cnt2 > n / 3) res.add(cand2);
    return res;
}`,
        walkthrough: [
          "nums=[3,2,3]. v=3: cnt1==0 so cand1=3,cnt1=1. v=2: cnt2==0 so cand2=2,cnt2=1. v=3: matches cand1 -> cnt1=2.",
          "Candidates cand1=3, cand2=2. Recount: 3 appears 2 times, 2 appears 1 time. n/3 = 1.",
          "cnt1=2 > 1 -> add 3. cnt2=1 not > 1 -> skip 2. Answer [3].",
        ],
      },
    ],
    edgeCases: [
      "No element exceeds n/3 → verification pass drops both candidates → empty list.",
      "Tiny arrays (n < 3) → n/3 is 0, so every present value qualifies.",
      "Two genuine majorities → both candidates survive and are returned.",
    ],
    twists: [
      "**Majority Element** (in the library) → the > n/2 case with a single candidate, no verification needed since one is guaranteed.",
      "**Elements appearing more than n/k times** → keep k-1 candidate slots with the same cancellation rule.",
      "**Verify why a second pass is required** → voting finds the only POSSIBLE survivors but not whether they truly cross the threshold.",
    ],
    related: ["majority-element", "top-k-frequent-elements", "contains-duplicate"],
  },

  {
    slug: "find-lucky-integer-in-an-array",
    title: "Find Lucky Integer in an Array",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1394,
    statement:
      "Given an array of integers `arr`, a **lucky integer** is an integer whose value equals its **frequency** in the array. Return the **largest** lucky integer. If there is no lucky integer, return `-1`.",
    examples: [
      { in: "arr = [2,2,3,4]", out: "2", explanation: "2 appears exactly twice, so it is lucky; no larger value is lucky" },
      { in: "arr = [1,2,2,3,3,3]", out: "3", explanation: "1 appears once, 2 twice, 3 thrice — all lucky; the largest is 3" },
      { in: "arr = [2,2,2,3,3]", out: "-1", explanation: "2 appears 3 times and 3 appears 2 times — neither matches its count" },
    ],
    constraints: ["1 ≤ arr.length ≤ 500", "1 ≤ arr[i] ≤ 500"],
    recognize:
      "Matching a value against its own frequency is a **count-then-scan** problem: build a frequency table, then look for keys where value equals count, keeping the largest — and the tiny bounded range invites a fixed-size count array.",
    figureItOut: [
      "The definition ties a value to how many times it occurs, so the first move is obviously to COUNT occurrences. A hash map from value to count, or — since values are 1..500 — a fixed count array of size 501.",
      "After counting, a value v is lucky exactly when count[v] == v. Scan the distinct values and collect those that satisfy this.",
      "We want the LARGEST lucky integer, so either track a running maximum during the scan, or iterate the bounded value range from high to low and return the first lucky value found.",
      "Iterating the count array downward from 500 to 1 is clean: the first index v with count[v] == v is the answer, and you return immediately. If the loop finishes with no match, return -1.",
      "Both the map and the count-array versions are O(n) time. The count array is O(maxValue) space but with a tiny constant, and it gives an effortless largest-first scan over the bounded range.",
    ],
    approaches: [
      {
        name: "Hash map of counts with a running max",
        intuition: "Count occurrences, then keep the largest value whose count equals itself.",
        time: "O(n)",
        timeWhy: "One pass to count, one pass over distinct keys.",
        space: "O(n)",
        spaceWhy: "The frequency map.",
        code: `int findLucky(int[] arr) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int v : arr) count.merge(v, 1, Integer::sum);
    int best = -1;
    for (Map.Entry<Integer, Integer> e : count.entrySet()) {
        if (e.getKey().equals(e.getValue())) best = Math.max(best, e.getKey());
    }
    return best;
}`,
      },
      {
        name: "Fixed count array scanned high to low (optimal)",
        intuition: "Tally into a small array, then walk values from large to small and return the first that equals its count.",
        time: "O(n + V)",
        timeWhy: "One counting pass plus a sweep of the bounded value range V.",
        space: "O(V)",
        spaceWhy: "A fixed array over the value range.",
        code: `int findLucky(int[] arr) {
    int[] count = new int[501];
    for (int v : arr) count[v]++;
    for (int v = 500; v >= 1; v--) {
        if (count[v] == v) return v;     // first match scanning down is the largest
    }
    return -1;
}`,
        walkthrough: [
          "arr=[1,2,2,3,3,3]. count: count[1]=1, count[2]=2, count[3]=3.",
          "Scan v=500..1. First match downward: v=3 has count[3]==3 -> return 3.",
          "If we had reached the bottom with no count[v]==v, we would return -1.",
        ],
      },
    ],
    edgeCases: [
      "No lucky integer → return -1.",
      "Multiple lucky integers → return the largest.",
      "A 1 appearing exactly once → lucky, but loses to any larger lucky value.",
    ],
    twists: [
      "**Smallest lucky integer** → scan the range from low to high instead.",
      "**Unique Number of Occurrences** (in the library) → check whether all frequencies are distinct, the same count-then-inspect idea.",
      "**First Unique Character** → frequency table then a positional scan for count == 1.",
    ],
    related: ["unique-number-of-occurrences", "top-k-frequent-elements", "single-number"],
  },

  {
    slug: "distribute-candies",
    title: "Distribute Candies",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 575,
    statement:
      "Alice has `candyType` candies, where `candyType[i]` is the type of the i-th candy. The doctor advises Alice to eat only `n / 2` of them (`n` is the array length, always even). Return the **maximum number of different types** of candies she can eat if she eats exactly `n / 2` candies.",
    examples: [
      { in: "candyType = [1,1,2,2,3,3]", out: "3", explanation: "she eats 3 candies; 3 distinct types exist, so she can have all 3" },
      { in: "candyType = [1,1,2,3]", out: "2", explanation: "she eats 2 candies; even though 3 types exist, she can taste at most 2" },
      { in: "candyType = [6,6,6,6]", out: "1", explanation: "only one type exists, so the maximum variety is 1" },
    ],
    constraints: ["n == candyType.length", "2 ≤ n ≤ 10^4", "n is even", "-10^5 ≤ candyType[i] ≤ 10^5"],
    recognize:
      "Maximising variety under a fixed eating quota is a **count-distinct + min cap** insight: the variety is limited by both how many distinct types exist and how many candies she may eat (n/2), so the answer is the smaller of the two.",
    figureItOut: [
      "She must eat exactly n/2 candies, and we want the most DISTINCT types among them. To maximise variety she should pick a new type every time she can, never wasting an eat on a repeat.",
      "Two ceilings constrain the variety. First, she literally cannot taste more types than EXIST in the bag — call that d, the number of distinct values. Second, she only gets n/2 eats, so she can taste at most n/2 different types no matter how many exist.",
      "So the answer is min(d, n/2). If there are fewer distinct types than n/2, she eats all of them (and fills the rest with repeats). If there are more types than n/2, she is limited by the quota.",
      "Computing d is just counting distinct values: drop them into a hash set and read its size. The eat quota is n/2 = candyType.length / 2.",
      "Return Math.min(set.size(), candyType.length / 2). One pass to build the set: O(n) time, O(n) space — or O(maxValue) space with a boolean presence array over the bounded value range.",
    ],
    approaches: [
      {
        name: "Hash set of distinct types capped by the quota (optimal)",
        intuition: "Count distinct types, then take the smaller of that count and n/2.",
        time: "O(n)",
        timeWhy: "One pass inserting into a set.",
        space: "O(n)",
        spaceWhy: "The set of distinct types.",
        code: `int distributeCandies(int[] candyType) {
    Set<Integer> types = new HashSet<>();
    for (int t : candyType) types.add(t);
    return Math.min(types.size(), candyType.length / 2);
}`,
        walkthrough: [
          "candyType=[1,1,2,3]. Distinct set = {1,2,3}, size 3. Quota = 4 / 2 = 2.",
          "min(3, 2) = 2. She can taste only 2 different types within her 2 eats.",
          "For [1,1,2,2,3,3]: distinct = 3, quota = 3, min(3,3) = 3.",
        ],
      },
    ],
    edgeCases: [
      "All candies the same type → distinct count is 1, answer 1.",
      "Every candy a distinct type → distinct = n, capped to n/2.",
      "Negative type ids → handled fine by a hash set.",
    ],
    twists: [
      "**Eat at most n/2 (not exactly)** → answer is identical, since min(d, n/2) is still the cap.",
      "**Maximize types given a different quota q** → min(d, q).",
      "**Count distinct with a bounded value range** → swap the set for a boolean presence array.",
    ],
    related: ["unique-number-of-occurrences", "contains-duplicate", "intersection-of-two-arrays"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "duplicate-zeros",
    title: "Duplicate Zeros",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 1089,
    statement:
      "Given a fixed-length integer array `arr`, **duplicate** each occurrence of zero, shifting the remaining elements to the right. Elements beyond the original length are dropped. Do the modification **in place** and do not return anything.",
    examples: [
      { in: "arr = [1,0,2,3,0,4,5,0]", out: "[1,0,0,2,3,0,0,4]", explanation: "each 0 is doubled and everything shifts right, trailing elements fall off" },
      { in: "arr = [1,2,3]", out: "[1,2,3]", explanation: "no zeros, so the array is unchanged" },
      { in: "arr = [0,0,0]", out: "[0,0,0]", explanation: "duplicating zeros just produces zeros within the same length" },
    ],
    constraints: ["1 ≤ arr.length ≤ 10^4", "0 ≤ arr[i] ≤ 9"],
    recognize:
      "Doing an in-place expand-with-truncation without overwriting unread data is a **two-pointer write-from-the-back** technique: first count how far the data reaches, then copy from the end so each element is placed only after it has been read.",
    figureItOut: [
      "If you write left to right, duplicating a zero pushes later elements rightward and you clobber values you have not processed yet. Using a separate output array is easy but the problem demands IN PLACE.",
      "The trick for in-place shifting that grows data is to write from the BACK. If we know the final resting position of each element, we can copy from the rightmost source to the rightmost destination, and since destination indices are always at or ahead of source indices, we never overwrite an unread value.",
      "First pass: figure out how many elements of the original array actually survive into the final array. Walk a read pointer counting 'slots used': a non-zero consumes one slot, a zero consumes two (itself plus its duplicate). Stop when the used count reaches the array length n; the read pointer now sits at the last source index that fits.",
      "Watch the boundary: if the last surviving element is a zero that only HALF fits (its duplicate would spill past the end), write a single 0 at the final position and step both pointers back before the main copy loop.",
      "Second pass: walk read pointer i down from that last source index and a write pointer j down from n-1. Copy arr[i] to arr[j]; if arr[i] is zero, write another 0 at the next j too. Both pointers move backward monotonically — O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Build into an auxiliary array",
        intuition: "Emit each element, emitting an extra 0 after each zero, stopping at length n, then copy back.",
        time: "O(n)",
        timeWhy: "One pass to build, one to copy back.",
        space: "O(n)",
        spaceWhy: "A second array of length n.",
        code: `void duplicateZeros(int[] arr) {
    int n = arr.length;
    int[] out = new int[n];
    int j = 0;
    for (int i = 0; i < n && j < n; i++) {
        out[j++] = arr[i];
        if (arr[i] == 0 && j < n) out[j++] = 0;
    }
    System.arraycopy(out, 0, arr, 0, n);
}`,
      },
      {
        name: "Two pointers writing from the back (optimal)",
        intuition: "Count how far the data reaches, then copy from the end so writes never clobber unread reads.",
        time: "O(n)",
        timeWhy: "A counting pass and a single backward copy pass.",
        space: "O(1)",
        spaceWhy: "Only index variables; the array is rewritten in place.",
        code: `void duplicateZeros(int[] arr) {
    int n = arr.length;
    int used = 0, i = 0;
    while (used < n) {                 // advance i, counting slots each element occupies
        used += (arr[i] == 0) ? 2 : 1;
        if (used >= n) break;
        i++;
    }
    int j = n - 1;
    if (used == n + 1) {               // last zero only half fits
        arr[j--] = 0;
        i--;
    }
    while (i >= 0) {                    // copy from the back
        arr[j--] = arr[i];
        if (arr[i] == 0) arr[j--] = 0;  // place the duplicate zero
        i--;
    }
}`,
        walkthrough: [
          "arr=[1,0,2,3,0,4,5,0], n=8. Counting: 1(used1),0(used3),2(used4),3(used5),0(used7),4(used8) -> used>=n break at i=5.",
          "used==8 (not n+1), so no half-zero fix. j=7. Copy from i=5 down: arr[7]=arr[5]=4.",
          "i=4 is 0: arr[6]=0, arr[5]=0 (duplicate). Continuing rightward-to-left yields [1,0,0,2,3,0,0,4].",
        ],
      },
    ],
    edgeCases: [
      "No zeros → array unchanged.",
      "Trailing zero whose duplicate would overflow → write a single 0 at the last slot.",
      "All zeros → result is all zeros of the same length.",
    ],
    twists: [
      "**Move Zeroes** (in the library) → shift zeros to the end instead of duplicating them.",
      "**Merge Sorted Array** (in the library) → another back-to-front in-place write to avoid clobbering.",
      "**Duplicate a different sentinel value** → generalize the count-2 rule to any chosen value.",
    ],
    related: ["move-zeroes", "merge-sorted-array", "remove-element"],
  },

  {
    slug: "remove-duplicates-from-sorted-array-ii",
    title: "Remove Duplicates from Sorted Array II",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 80,
    statement:
      "Given a sorted integer array `nums`, remove duplicates **in place** so that each unique element appears **at most twice**, keeping the relative order. Return the new length `k`; the first `k` elements of `nums` must hold the result and the rest may be anything.",
    examples: [
      { in: "nums = [1,1,1,2,2,3]", out: "5, nums = [1,1,2,2,3,...]", explanation: "the third 1 is dropped; everything else appears at most twice" },
      { in: "nums = [0,0,1,1,1,1,2,3,3]", out: "7, nums = [0,0,1,1,2,3,3,...]", explanation: "the two extra 1s beyond a pair are removed" },
    ],
    constraints: ["1 ≤ nums.length ≤ 3 * 10^4", "-10^4 ≤ nums[i] ≤ 10^4", "nums is sorted in non-decreasing order"],
    recognize:
      "Compacting a sorted array while allowing K copies is a **slow/fast two-pointer with a look-back-K check**: keep a write pointer, and write the current value only if it differs from the element K positions before the write head.",
    figureItOut: [
      "Because the array is sorted, equal values are contiguous. We want to keep at most two of each, so we build the result in place using a WRITE pointer that marks how many elements we have committed.",
      "The elegant test: when considering nums[i], we should keep it if it would not create a THIRD copy. The element two positions back in the output (at write - 2) is the second copy already kept; if nums[i] equals that, keeping it would make a third, so skip it. Otherwise write it.",
      "So initialize write = 2 (the first two elements are always allowed to stay, since at most two copies is fine). For each i from 2 to n-1: if nums[i] != nums[write - 2], copy nums[i] to nums[write] and increment write.",
      "This generalizes beautifully: to allow at most K copies, compare against nums[write - K] and start write at K. The 'look back K' check encodes 'is this about to be the (K+1)-th copy'.",
      "The read pointer i scans forward once and the write pointer only advances, so it is O(n) time and O(1) space. Sortedness is what makes the simple look-back valid.",
    ],
    approaches: [
      {
        name: "Count occurrences with a hash map then rebuild",
        intuition: "Tally each value, then write each value min(count, 2) times.",
        time: "O(n)",
        timeWhy: "One counting pass and one rebuild pass.",
        space: "O(n)",
        spaceWhy: "The count map (unnecessary given sortedness, but simple).",
        code: `int removeDuplicates(int[] nums) {
    LinkedHashMap<Integer, Integer> count = new LinkedHashMap<>();
    for (int v : nums) count.merge(v, 1, Integer::sum);
    int write = 0;
    for (Map.Entry<Integer, Integer> e : count.entrySet()) {
        int copies = Math.min(e.getValue(), 2);
        for (int c = 0; c < copies; c++) nums[write++] = e.getKey();
    }
    return write;
}`,
      },
      {
        name: "Two pointers with a look-back-2 check (optimal)",
        intuition: "Write nums[i] only when it differs from the element two slots back in the output.",
        time: "O(n)",
        timeWhy: "Single forward scan with O(1) work per element.",
        space: "O(1)",
        spaceWhy: "Only the write index, modifying in place.",
        code: `int removeDuplicates(int[] nums) {
    int n = nums.length;
    if (n <= 2) return n;
    int write = 2;                       // first two always kept
    for (int i = 2; i < n; i++) {
        if (nums[i] != nums[write - 2]) {  // keeping it would not make a 3rd copy
            nums[write++] = nums[i];
        }
    }
    return write;
}`,
        walkthrough: [
          "nums=[1,1,1,2,2,3]. write=2. i=2 nums[2]=1, nums[write-2]=nums[0]=1 -> equal, skip (would be a 3rd 1).",
          "i=3 nums[3]=2 != nums[1]=1 -> write nums[2]=2, write=3. i=4 nums[4]=2 != nums[1]=1 -> write nums[3]=2, write=4.",
          "i=5 nums[5]=3 != nums[2]=2 -> write nums[4]=3, write=5. Result length 5 -> [1,1,2,2,3].",
        ],
      },
    ],
    edgeCases: [
      "Length ≤ 2 → nothing to remove, return n.",
      "All identical values → only the first two survive.",
      "Already at most two of each → array unchanged, write reaches n.",
    ],
    twists: [
      "**Remove Duplicates from Sorted Array** (in the library) → the at-most-once version with a look-back of 1.",
      "**At most K copies** → start write at K and compare against nums[write - K].",
      "**Unsorted input** → sortedness is essential here; otherwise count first or sort.",
    ],
    related: ["remove-duplicates-from-sorted-array", "move-zeroes", "remove-element"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "number-of-zero-filled-subarrays",
    title: "Number of Zero-Filled Subarrays",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 2348,
    statement:
      "Given an integer array `nums`, return the number of **subarrays filled entirely with `0`**. A subarray is a contiguous non-empty sequence of elements.",
    examples: [
      { in: "nums = [1,3,0,0,2,0,0,4]", out: "6", explanation: "the run of two 0s gives 3 subarrays and the second run of two 0s gives 3, total 6" },
      { in: "nums = [0,0,0,2,0,0]", out: "9", explanation: "the run of three 0s gives 6 subarrays and the run of two 0s gives 3" },
      { in: "nums = [2,10,2019]", out: "0", explanation: "no zeros, so no zero-filled subarrays" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9"],
    recognize:
      "Counting all-zero contiguous subarrays is a **run-length window with the new-element contribution trick**: as a window of consecutive zeros grows by one, it adds exactly (current run length) new subarrays ending at that position, so accumulate the running zero-streak.",
    figureItOut: [
      "Zero-filled subarrays live entirely inside maximal RUNS of consecutive zeros — a subarray cannot straddle a non-zero. So the total is the sum over each zero-run of how many subarrays that run contains.",
      "A run of length L contains L*(L+1)/2 subarrays (choose any start and any end within it). So one approach: find each maximal zero-run length and add L*(L+1)/2.",
      "An even slicker single-pass framing: track a running streak of consecutive zeros ending at the current index. When nums[i] is 0, the streak grows by 1, and the number of NEW zero-filled subarrays ENDING exactly at i equals the streak length (the subarrays [i], [i-1..i], ..., spanning the whole current streak).",
      "So maintain streak: on a zero increment it and add streak to the answer; on a non-zero reset streak to 0. Each position contributes the count of zero-subarrays ending there, and summing those over all positions counts every zero-filled subarray exactly once (by its right endpoint).",
      "Use a long accumulator — with n up to 1e5 a single run of all zeros yields about 5e9 subarrays, which overflows a 32-bit int. One pass, O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Sum L*(L+1)/2 over maximal zero runs",
        intuition: "Find each run of consecutive zeros and add its subarray count.",
        time: "O(n)",
        timeWhy: "A single pass identifying run lengths.",
        space: "O(1)",
        spaceWhy: "Only counters.",
        code: `long zeroFilledSubarray(int[] nums) {
    long total = 0;
    int i = 0, n = nums.length;
    while (i < n) {
        if (nums[i] != 0) { i++; continue; }
        long len = 0;
        while (i < n && nums[i] == 0) { len++; i++; }   // measure the run
        total += len * (len + 1) / 2;
    }
    return total;
}`,
      },
      {
        name: "Running zero-streak contribution (optimal)",
        intuition: "Each zero extends the streak and adds that many new subarrays ending here.",
        time: "O(n)",
        timeWhy: "One pass, constant work per element.",
        space: "O(1)",
        spaceWhy: "A streak counter and a total.",
        code: `long zeroFilledSubarray(int[] nums) {
    long total = 0, streak = 0;
    for (int v : nums) {
        if (v == 0) {
            streak++;          // current run length ending here
            total += streak;   // that many new zero-filled subarrays end at this index
        } else {
            streak = 0;        // run broken
        }
    }
    return total;
}`,
        walkthrough: [
          "nums=[1,3,0,0,2,0,0,4]. v=1,3 -> streak 0. v=0 -> streak 1, total 1. v=0 -> streak 2, total 3.",
          "v=2 -> streak 0. v=0 -> streak 1, total 4. v=0 -> streak 2, total 6. v=4 -> streak 0.",
          "Final total 6 (each run of two zeros contributed 1+2 = 3).",
        ],
      },
    ],
    edgeCases: [
      "No zeros → answer 0.",
      "Entire array zeros → n*(n+1)/2, requires a 64-bit accumulator.",
      "Single zero → contributes exactly 1.",
    ],
    twists: [
      "**Count subarrays with all elements equal to a target** → reset the streak on any value other than the target.",
      "**Number of Substrings of a single repeated character** → the same run-length contribution over a string.",
      "**Count subarrays where all elements satisfy a predicate** → grow the streak while the predicate holds.",
    ],
    related: ["subarray-product-less-than-k", "contiguous-array", "max-consecutive-ones"],
  },

  {
    slug: "maximum-number-of-occurrences-of-a-substring",
    title: "Maximum Number of Occurrences of a Substring",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1297,
    statement:
      "Given a string `s`, return the **maximum number of occurrences** of any substring under these rules: the number of **unique characters** in the substring must be `<= maxLetters`, and the substring length must be between `minSize` and `maxSize` inclusive.",
    examples: [
      { in: 's = "aababcaab", maxLetters = 2, minSize = 3, maxSize = 4', out: "2", explanation: "the substring \"aab\" has 2 unique letters and length 3, and occurs twice" },
      { in: 's = "aaaa", maxLetters = 1, minSize = 3, maxSize = 3', out: "2", explanation: "\"aaa\" has 1 unique letter and occurs twice" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^5", "1 ≤ maxLetters ≤ 26", "1 ≤ minSize ≤ maxSize ≤ min(26, s.length)", "s consists of only lowercase English letters"],
    recognize:
      "The key reduction is that a longer valid substring always contains a length-`minSize` valid substring at least as frequent, so this collapses to a **fixed-size sliding window of exactly minSize** counting occurrences in a hash map.",
    figureItOut: [
      "The tempting reading is to try all lengths from minSize to maxSize, but there is a crucial observation: if some substring of length L (minSize <= L <= maxSize) occurs f times and is valid, then its length-minSize PREFIX occurs at least f times too (every occurrence of the longer one contains the prefix) and has no more unique letters, so it is also valid.",
      "Therefore the most frequent valid substring can always be taken to have the SMALLEST allowed length, minSize. maxSize becomes irrelevant — we never need windows longer than minSize.",
      "That reduces the problem to: slide a fixed window of exactly minSize across s, and for each window with at most maxLetters distinct characters, count it in a hash map keyed by the substring. The answer is the largest count.",
      "Maintain the window with a character-frequency array of size 26 and a running 'distinct' counter, adding the entering char and removing the leaving char in O(1). Only when distinct <= maxLetters do we record the window substring.",
      "Each fixed-size window is O(minSize) to materialize as a map key (or O(1) with rolling hashing), so the scan is about O(n * minSize) worst case, O(n) substrings stored. Realizing the minSize-only reduction is the whole insight.",
    ],
    approaches: [
      {
        name: "Try every length and count valid substrings",
        intuition: "For each allowed length and start, check uniqueness and tally occurrences.",
        time: "O(n * (maxSize - minSize + 1) * maxSize)",
        timeWhy: "Every start, every allowed length, each substring re-scanned.",
        space: "O(n * maxSize)",
        spaceWhy: "Distinct substrings of varied lengths in the map.",
        code: `int maxFreq(String s, int maxLetters, int minSize, int maxSize) {
    Map<String, Integer> freq = new HashMap<>();
    int best = 0;
    for (int len = minSize; len <= maxSize; len++) {
        for (int i = 0; i + len <= s.length(); i++) {
            String sub = s.substring(i, i + len);
            Set<Character> uniq = new HashSet<>();
            for (char c : sub.toCharArray()) uniq.add(c);
            if (uniq.size() <= maxLetters) {
                best = Math.max(best, freq.merge(sub, 1, Integer::sum));
            }
        }
    }
    return best;
}`,
      },
      {
        name: "Fixed-size minSize window only (optimal)",
        intuition: "Only length-minSize substrings matter; slide one window and count occurrences.",
        time: "O(n * minSize)",
        timeWhy: "One pass; each window builds a substring key of length minSize.",
        space: "O(n)",
        spaceWhy: "The map of length-minSize substrings and a 26-slot frequency array.",
        code: `int maxFreq(String s, int maxLetters, int minSize, int maxSize) {
    Map<String, Integer> freq = new HashMap<>();
    int[] charCount = new int[26];
    int distinct = 0, best = 0, n = s.length();
    for (int i = 0; i < n; i++) {
        if (charCount[s.charAt(i) - 'a']++ == 0) distinct++;   // char enters window
        if (i >= minSize) {
            int leave = s.charAt(i - minSize) - 'a';
            if (--charCount[leave] == 0) distinct--;            // char leaves window
        }
        if (i >= minSize - 1 && distinct <= maxLetters) {
            String sub = s.substring(i - minSize + 1, i + 1);
            best = Math.max(best, freq.merge(sub, 1, Integer::sum));
        }
    }
    return best;
}`,
        walkthrough: [
          's="aababcaab", maxLetters=2, minSize=3. Slide a window of length 3. Windows: aab(distinct2,ok), aba(2,ok), bab(2,ok), abc(3,>2 skip)...',
          'The substring "aab" appears at index 0 and again at index 6 -> count 2, which is the max among valid windows.',
          "Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "No window satisfies maxLetters → answer 0.",
      "minSize == maxSize → only one length anyway, same as the reduction.",
      "Whole string one character → every minSize window identical, count n - minSize + 1.",
    ],
    twists: [
      "**Replace the map key with a rolling hash** → reduces the per-window cost to O(1) for true O(n).",
      "**Subarrays with K Different Integers** (in the library) → variable window enforcing the distinct bound differently.",
      "**Most frequent substring of an exact length** → drop the unique-letter and maxSize constraints, keep the fixed window.",
    ],
    related: ["subarrays-with-k-different-integers", "permutation-in-string", "longest-substring-without-repeating"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "find-the-most-competitive-subsequence",
    title: "Find the Most Competitive Subsequence",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1673,
    statement:
      "Given an integer array `nums` and a positive integer `k`, return the **most competitive** subsequence of `nums` of size `k`. A subsequence `a` is more competitive than `b` (both size k) if at the first index where they differ, `a` has the **smaller** number.",
    examples: [
      { in: "nums = [3,5,2,6], k = 2", out: "[2,6]", explanation: "among size-2 subsequences, [2,6] is lexicographically smallest" },
      { in: "nums = [2,4,3,3,5,4,9,6], k = 4", out: "[2,3,3,4]", explanation: "greedily picking the smallest leading values yields [2,3,3,4]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "0 ≤ nums[i] ≤ 10^9", "1 ≤ k ≤ nums.length"],
    recognize:
      "Building the lexicographically smallest length-k subsequence is a **monotonic increasing stack with a removal budget**: greedily pop a larger trailing element whenever a smaller one arrives and enough elements remain to still fill k slots.",
    figureItOut: [
      "Most competitive means lexicographically smallest, so we want small values as early as possible. Greedy intuition: when scanning, if a new value is smaller than the last value we have tentatively chosen, we would rather drop that earlier larger value and use the smaller one — provided we still have enough elements left to reach length k.",
      "That 'pop the last chosen if a smaller candidate appears, as long as feasibility holds' is the monotonic-stack pattern. Maintain a stack that we keep as small-as-possible from the front.",
      "Feasibility check: we may pop only if the elements remaining (including the current one) are enough to refill the stack to size k. Concretely, while the stack is non-empty, the top exceeds nums[i], and (stack.size() - 1 + (n - i)) >= k, pop the top.",
      "After the pop loop, push nums[i] only if the stack has fewer than k elements (once it is full at k we never grow it further; any extra is discarded). This keeps the stack a valid prefix of the answer at all times.",
      "Each element is pushed and popped at most once, so it is O(n) time and O(k) space — the same accounting as Remove K Digits, just framed as choosing k elements instead of deleting k.",
    ],
    approaches: [
      {
        name: "Greedy segment selection",
        intuition: "Pick each of the k positions as the minimum in the allowable window, advancing past it.",
        time: "O(n * k)",
        timeWhy: "For each of k picks, scan a window for the minimum.",
        space: "O(k)",
        spaceWhy: "The result array.",
        code: `int[] mostCompetitive(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[k];
    int start = 0;
    for (int picked = 0; picked < k; picked++) {
        int end = n - (k - picked);          // last index still leaving enough room
        int minIdx = start;
        for (int j = start + 1; j <= end; j++) {
            if (nums[j] < nums[minIdx]) minIdx = j;
        }
        res[picked] = nums[minIdx];
        start = minIdx + 1;
    }
    return res;
}`,
      },
      {
        name: "Monotonic stack with a removal budget (optimal)",
        intuition: "Pop a larger last-chosen value when a smaller one arrives, if enough elements remain to still fill k.",
        time: "O(n)",
        timeWhy: "Each element pushed and popped at most once.",
        space: "O(k)",
        spaceWhy: "The stack holds at most k elements.",
        code: `int[] mostCompetitive(int[] nums, int k) {
    int n = nums.length;
    int[] stack = new int[k];
    int size = 0;
    for (int i = 0; i < n; i++) {
        // pop while top is bigger and we can still refill to size k
        while (size > 0 && stack[size - 1] > nums[i] && size - 1 + (n - i) >= k) {
            size--;
        }
        if (size < k) stack[size++] = nums[i];   // only keep up to k
    }
    return stack;
}`,
        walkthrough: [
          "nums=[2,4,3,3,5,4,9,6], k=4, n=8. i=0 push 2 [2]. i=1 push 4 [2,4]. i=2: top 4>3 and 1+(8-2)=7>=4 -> pop 4; push 3 [2,3].",
          "i=3 push 3 [2,3,3]. i=4 push 5 [2,3,3,5] (size 4). i=5: top 5>4 and 3+(8-5)=6>=4 -> pop 5; push 4 [2,3,3,4].",
          "i=6 (9) and i=7 (6): stack already size 4 and no beneficial pop -> unchanged. Result [2,3,3,4].",
        ],
      },
    ],
    edgeCases: [
      "k equals n → the whole array is the only subsequence.",
      "Strictly increasing array → the first k elements.",
      "Strictly decreasing array → the last k elements (everything gets popped down).",
    ],
    twists: [
      "**Remove K Digits** (in the library) → delete exactly k digits to minimize a number, the dual framing.",
      "**Smallest Subsequence of Distinct Characters** → monotonic stack with a uniqueness constraint and last-occurrence feasibility.",
      "**Most competitive but lexicographically LARGEST** → flip the comparison to pop smaller tops.",
    ],
    related: ["remove-k-digits", "next-greater-element-ii", "daily-temperatures"],
  },

  {
    slug: "remove-all-occurrences-of-a-substring",
    title: "Remove All Occurrences of a Substring",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1910,
    statement:
      "Given two strings `s` and `part`, repeatedly remove the **leftmost** occurrence of `part` from `s` until `part` no longer appears, then return the resulting string. Each removal may create a new occurrence by joining the surrounding text.",
    examples: [
      { in: 's = "daabcbaabcbc", part = "abc"', out: '"dab"', explanation: "remove abc repeatedly: daabcbaabcbc -> dabaabcbc -> dababc -> dab" },
      { in: 's = "axxxxyyyyb", part = "xy"', out: '"ab"', explanation: "the xy pair forms in the middle and unwinds outward to ab" },
    ],
    constraints: ["1 ≤ s.length ≤ 1000", "1 ≤ part.length ≤ 1000", "s and part consist of lowercase English letters"],
    recognize:
      "Repeated leftmost removals where deletions can expose new matches is a **character stack with tail-matching**: push characters one at a time, and whenever the stack tail equals `part`, pop those characters — exactly modelling cascading removals in one pass.",
    figureItOut: [
      "Naively scanning for part, deleting it, and rescanning from the start is O(n^2 / m) or worse because each deletion restarts the search and shifts the string. The deletions also cascade — removing one occurrence can glue neighbours into a new occurrence.",
      "The cascade-on-deletion behaviour is the signature of a stack. Build the result one character at a time on a stack (a StringBuilder acts as one). After pushing each character, check whether the END of the current result matches part; if so, remove those last part.length characters.",
      "Why the tail check suffices: an occurrence of part can only become COMPLETE when its last character is appended. At that moment the matching characters are exactly the most recent ones on the stack, so deleting the tail removes precisely the leftmost-still-pending match. Any new match formed by joining the surroundings will be detected when its own final character is later examined — or immediately, since the next tail check sees the rejoined text.",
      "Matching the tail is cheap: after each append, compare the last part.length characters of the builder with part; on a match, delete that suffix. Each character is appended once and deleted at most once.",
      "Total work is O(n * m) in the worst case (each tail comparison costs m), with O(n) space for the builder. This single forward pass replaces all the repeated rescans.",
    ],
    approaches: [
      {
        name: "Repeated indexOf-and-delete",
        intuition: "Find the first occurrence, cut it out, repeat until none remain.",
        time: "O(n^2 / m * m) worst",
        timeWhy: "Each delete shifts the string and the search may restart many times.",
        space: "O(n)",
        spaceWhy: "A mutable string buffer.",
        code: `String removeOccurrences(String s, String part) {
    StringBuilder sb = new StringBuilder(s);
    int idx;
    while ((idx = sb.indexOf(part)) != -1) {
        sb.delete(idx, idx + part.length());
    }
    return sb.toString();
}`,
      },
      {
        name: "Character stack with tail matching (optimal)",
        intuition: "Push characters; whenever the stack tail equals part, pop that tail.",
        time: "O(n * m)",
        timeWhy: "Each char appended once; each tail comparison costs m.",
        space: "O(n)",
        spaceWhy: "The builder acting as the stack.",
        code: `String removeOccurrences(String s, String part) {
    StringBuilder stack = new StringBuilder();
    int m = part.length();
    for (int i = 0; i < s.length(); i++) {
        stack.append(s.charAt(i));
        if (stack.length() >= m &&
            stack.substring(stack.length() - m).equals(part)) {
            stack.delete(stack.length() - m, stack.length());   // pop the matched tail
        }
    }
    return stack.toString();
}`,
        walkthrough: [
          's="daabcbaabcbc", part="abc". Push d,a,a,b,c -> tail "abc" matches -> delete -> "daa". Continue pushing b,a,a,b,c.',
          'After appends the tail becomes "abc" again -> delete; rejoining keeps exposing matches as later chars arrive.',
          'All abc occurrences (including ones formed by joining) collapse, leaving "dab".',
        ],
      },
    ],
    edgeCases: [
      "part not present at all → s returned unchanged.",
      "Deletion creates a new match → the next tail check catches it immediately.",
      "Entire string removed → result is empty.",
    ],
    twists: [
      "**Remove All Adjacent Duplicates In String** (in the library) → the special case where part is two equal characters.",
      "**Use a rolling hash for the tail check** → O(n) total instead of O(n*m).",
      "**Remove only non-overlapping leftmost occurrences once** → a single linear scan without the cascade.",
    ],
    related: ["remove-all-adjacent-duplicates-in-string", "valid-parentheses", "backspace-string-compare"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "count-the-number-of-fair-pairs",
    title: "Count the Number of Fair Pairs",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 2563,
    statement:
      "Given a 0-indexed integer array `nums` of size `n` and two integers `lower` and `upper`, return the number of **fair pairs** `(i, j)` with `0 <= i < j < n` and `lower <= nums[i] + nums[j] <= upper`.",
    examples: [
      { in: "nums = [0,1,7,4,4,5], lower = 3, upper = 6", out: "6", explanation: "six index pairs have a sum within [3,6]" },
      { in: "nums = [1,7,9,2,5], lower = 11, upper = 11", out: "1", explanation: "only the pair summing to exactly 11 qualifies" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "-10^9 ≤ nums[i] ≤ 10^9", "-10^9 ≤ lower ≤ upper ≤ 10^9"],
    recognize:
      "Counting pairs whose sum falls in a range reduces to **sort + binary search per element**: pairs in [lower, upper] equal (pairs with sum <= upper) minus (pairs with sum <= lower-1), and a sorted array lets you binary-search the partner bound for each element.",
    figureItOut: [
      "Pair sums depend only on values, not index order, so we may SORT nums freely — sorting cannot change how many value-pairs land in [lower, upper].",
      "A range count is two prefix counts: count(sum <= upper) - count(sum <= lower - 1). Each is a 'count pairs with sum at most X' query, which is easier than a two-sided range directly.",
      "For 'count pairs with sum <= X' on a sorted array: fix the left index i, then nums[i] + nums[j] <= X means nums[j] <= X - nums[i]. Among the elements to the RIGHT of i, binary-search the largest j with nums[j] <= X - nums[i]; the number of valid partners is how many indices in (i, bound] qualify.",
      "Using upper-bound style binary search (first index whose value exceeds the threshold) gives the count of qualifying partners directly. Summing over all i counts every fair pair once because we always pair i with strictly-later indices.",
      "Sorting is O(n log n); the count helper does an O(log n) search per element for O(n log n). Use a long for the answer since up to ~5e9 pairs are possible. This binary-search-per-element framing is the canonical pattern; a sorted two-pointer is an equally valid O(n log n) alternative.",
    ],
    approaches: [
      {
        name: "Brute force over all pairs",
        intuition: "Check every i < j against the range.",
        time: "O(n^2)",
        timeWhy: "Quadratically many pairs tested.",
        space: "O(1)",
        spaceWhy: "Only a counter.",
        code: `long countFairPairs(int[] nums, int lower, int upper) {
    long count = 0;
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            long sum = (long) nums[i] + nums[j];
            if (sum >= lower && sum <= upper) count++;
        }
    }
    return count;
}`,
      },
      {
        name: "Sort + binary search per element (optimal)",
        intuition: "Count pairs with sum <= upper minus pairs with sum <= lower-1, each via per-element binary search.",
        time: "O(n log n)",
        timeWhy: "Sorting plus an O(log n) search for each of n elements.",
        space: "O(1)",
        spaceWhy: "Sorting in place; only counters otherwise.",
        code: `long countFairPairs(int[] nums, int lower, int upper) {
    Arrays.sort(nums);
    return countAtMost(nums, upper) - countAtMost(nums, (long) lower - 1);
}

// number of pairs i < j with nums[i] + nums[j] <= limit
private long countAtMost(int[] nums, long limit) {
    long count = 0;
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        if ((long) nums[lo] + nums[hi] <= limit) {
            count += hi - lo;     // nums[lo] pairs with everything up to hi
            lo++;
        } else {
            hi--;
        }
    }
    return count;
}`,
        walkthrough: [
          "nums=[0,1,7,4,4,5], lower=3, upper=6. Sorted [0,1,4,4,5,7]. countAtMost(6) counts pairs summing <= 6.",
          "countAtMost(6) = 9, countAtMost(2) (lower-1) = 3 (pairs like 0+1=1, 0+... <= 2).",
          "9 - 3 = 6 fair pairs.",
        ],
      },
    ],
    edgeCases: [
      "No pair in range → 0.",
      "All pairs in range → n*(n-1)/2; needs a 64-bit count.",
      "lower == upper → counts only exact-sum pairs.",
    ],
    twists: [
      "**Count Pairs Whose Sum is Less than Target** (in the library) → a single at-most count, no subtraction.",
      "**Count of Range Sum** → range counts over prefix sums with a BIT or merge sort.",
      "**Per-element binary search variant** → replace the two-pointer countAtMost with an explicit upperBound search.",
    ],
    related: ["count-pairs-whose-sum-is-less-than-target", "two-sum-ii", "two-sum-less-than-k"],
  },

  {
    slug: "random-pick-with-weight",
    title: "Random Pick with Weight",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 528,
    statement:
      "You are given a 0-indexed array `w` of positive integers, where `w[i]` is the weight of index `i`. Implement `pickIndex()` which returns an index at random with probability proportional to its weight, i.e. index `i` is returned with probability `w[i] / sum(w)`.",
    examples: [
      { in: "w = [1], then pickIndex()", out: "0", explanation: "only one index, always returned" },
      { in: "w = [1,3], then pickIndex() repeatedly", out: "0 about 25%, 1 about 75%", explanation: "probabilities 1/4 and 3/4 match the weights" },
    ],
    constraints: ["1 ≤ w.length ≤ 10^4", "1 ≤ w[i] ≤ 10^5", "pickIndex is called at most 10^4 times"],
    recognize:
      "Sampling by weight maps to **prefix sums + binary search**: lay the weights end to end as cumulative intervals, draw a uniform target in the total range, and binary-search the first prefix sum that covers it.",
    figureItOut: [
      "Picking index i with probability proportional to w[i] is like throwing a dart at a number line where each index owns a segment whose LENGTH equals its weight. The dart lands in index i's segment with exactly the right probability.",
      "Build cumulative prefix sums: prefix[i] = w[0] + ... + w[i]. Index i then owns the half-open interval (prefix[i-1], prefix[i]]. The total length is prefix[last] = sum of all weights.",
      "To sample, draw a uniform integer target in [1, total] (or a real in (0, total]). The chosen index is the one whose interval contains target — i.e. the SMALLEST i with prefix[i] >= target. That is a classic lower-bound binary search over the sorted prefix array.",
      "Prefix sums are non-decreasing (weights are positive), so binary search applies. Searching for the first prefix >= target gives O(log n) per pick, after O(n) preprocessing to build the prefix array.",
      "Watch overflow: with up to 1e4 weights of 1e5 each, the total reaches 1e9, fine for int, but be deliberate. Drawing target as 1 + random.nextInt(total) keeps it in [1, total]. Construction O(n), each pick O(log n), O(n) space.",
    ],
    approaches: [
      {
        name: "Prefix sums + lower-bound binary search (optimal)",
        intuition: "Cumulative weights form intervals; draw a uniform point and binary-search which interval it lands in.",
        time: "O(n) build, O(log n) per pick",
        timeWhy: "Prefix sums built once; each query is a binary search.",
        space: "O(n)",
        spaceWhy: "The prefix-sum array.",
        code: `class Solution {
    private int[] prefix;
    private int total;
    private Random rng = new Random();

    public Solution(int[] w) {
        prefix = new int[w.length];
        int sum = 0;
        for (int i = 0; i < w.length; i++) {
            sum += w[i];
            prefix[i] = sum;       // cumulative weight up to index i
        }
        total = sum;
    }

    public int pickIndex() {
        int target = 1 + rng.nextInt(total);   // uniform in [1, total]
        int lo = 0, hi = prefix.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (prefix[mid] < target) {
                lo = mid + 1;       // target lands further right
            } else {
                hi = mid;           // first prefix >= target is here or left
            }
        }
        return lo;
    }
}`,
        walkthrough: [
          "w=[1,3]. prefix=[1,4], total=4. Index 0 owns (0,1], index 1 owns (1,4].",
          "target uniform in [1,4]. target=1 -> first prefix>=1 is index 0. target in {2,3,4} -> first prefix>=target is index 1.",
          "So index 0 chosen 1/4 of the time, index 1 chosen 3/4 — matching the weights.",
        ],
      },
    ],
    edgeCases: [
      "Single weight → always returns index 0.",
      "Equal weights → uniform distribution over indices.",
      "Large total near int limits → draw target carefully to avoid overflow.",
    ],
    twists: [
      "**Continuous weights (doubles)** → prefix sums of doubles and draw a uniform real in (0, total].",
      "**Updatable weights** → a Fenwick/BIT supports O(log n) updates and weighted sampling.",
      "**Alias method** → O(1) per pick after O(n) setup, trading binary search for a precomputed table.",
    ],
    related: ["search-insert-position", "binary-search", "find-first-and-last-position-of-element-in-sorted-array"],
  },

  {
    slug: "minimum-time-to-complete-trips",
    title: "Minimum Time to Complete Trips",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 2187,
    statement:
      "You are given an array `time` where `time[i]` is the time (in units) for bus `i` to complete one trip, and an integer `totalTrips`. All buses run simultaneously and independently and may make multiple trips. Return the **minimum time** required for all buses together to complete at least `totalTrips` trips.",
    examples: [
      { in: "time = [1,2,3], totalTrips = 5", out: "3", explanation: "by time 3, bus 1 does 3 trips, bus 2 does 1, bus 3 does 1 — total 5" },
      { in: "time = [2], totalTrips = 1", out: "2", explanation: "the single bus completes its first trip at time 2" },
    ],
    constraints: ["1 ≤ time.length ≤ 10^5", "1 ≤ time[i] ≤ 10^7", "1 ≤ totalTrips ≤ 10^7"],
    recognize:
      "Finding the least time meeting a trip quota is **binary search on the answer (time)**: total trips completed by time `t` is a monotonic non-decreasing function (sum of floor(t / time[i])), so search the smallest `t` whose total reaches `totalTrips`.",
    figureItOut: [
      "We are minimizing a time value subject to 'enough trips happen by then'. As the allotted time t grows, the number of completed trips only ever increases — a monotonic predicate, which is the hallmark of binary search on the answer.",
      "Define trips(t) = total trips finished by time t. Bus i completes one trip every time[i] units, so by time t it has finished floor(t / time[i]) trips. Summing over all buses gives trips(t) = sum of t / time[i].",
      "trips(t) is non-decreasing in t, and 'trips(t) >= totalTrips' flips from false to true at exactly one threshold. We want the SMALLEST such t. Binary search t in a range whose upper bound is guaranteed feasible.",
      "A safe upper bound: the fastest bus alone (min time) doing all trips takes minTime * totalTrips, so any t at least that big is enough. Lower bound is 1. Inside the search, if trips(mid) >= totalTrips set hi = mid, else lo = mid + 1.",
      "Each trips(mid) evaluation is O(n); the search runs O(log(minTime * totalTrips)) iterations. Use long for both the candidate t and the running trip sum, since minTime * totalTrips can reach 1e7 * 1e7 = 1e14, far beyond int. O(n log(range)) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Binary search on time with a feasibility count (optimal)",
        intuition: "Count trips finished by a candidate time via floor division; search the smallest time that meets the quota.",
        time: "O(n log(minTime * totalTrips))",
        timeWhy: "An O(n) trip count inside a logarithmic search over the time range.",
        space: "O(1)",
        spaceWhy: "Only counters and bounds.",
        code: `long minimumTime(int[] time, int totalTrips) {
    long minTime = Long.MAX_VALUE;
    for (int t : time) minTime = Math.min(minTime, t);
    long lo = 1, hi = minTime * totalTrips;   // hi is always feasible
    while (lo < hi) {
        long mid = lo + (hi - lo) / 2;
        if (tripsBy(time, mid) >= totalTrips) {
            hi = mid;          // enough trips by mid; try earlier
        } else {
            lo = mid + 1;      // not enough; need more time
        }
    }
    return lo;
}

// total trips all buses finish by time t
private long tripsBy(int[] time, long t) {
    long trips = 0;
    for (int x : time) trips += t / x;
    return trips;
}`,
        walkthrough: [
          "time=[1,2,3], totalTrips=5. minTime=1, hi=1*5=5, lo=1. mid=3: trips = 3/1 + 3/2 + 3/3 = 3+1+1 = 5 >= 5 -> hi=3.",
          "mid=2: trips = 2+1+0 = 3 < 5 -> lo=3. lo==hi==3.",
          "Answer 3 (by time 3 the buses complete exactly 5 trips).",
        ],
      },
    ],
    edgeCases: [
      "Single bus → answer is time[0] * totalTrips.",
      "totalTrips = 1 → answer is the minimum bus time (fastest first trip).",
      "Large products → use long for time, the trip sum, and the upper bound.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary-search a rate with a floor-division feasibility count.",
      "**Minimum Number of Days to Make m Bouquets** → binary search on days with a contiguous-run feasibility check.",
      "**Maximize the trips by a deadline instead** → flip to find trips(t) for a fixed t, no search needed.",
    ],
    related: ["koko-eating-bananas", "split-array-largest-sum", "capacity-to-ship-packages-within-d-days"],
  },
];
