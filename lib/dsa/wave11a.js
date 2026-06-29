// NeetCode All — wave 11a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave10a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE11A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "unique-number-of-occurrences",
    title: "Unique Number of Occurrences",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1207,
    statement:
      "Given an array of integers `arr`, return `true` if the **number of occurrences** of each value in the array is **unique** — that is, no two distinct values appear the same number of times.",
    examples: [
      { in: "arr = [1,2,2,1,1,3]", out: "true", explanation: "1 occurs 3×, 2 occurs 2×, 3 occurs 1×; counts {3,2,1} are all distinct" },
      { in: "arr = [1,2]", out: "false", explanation: "both 1 and 2 occur once — the count 1 is shared" },
      { in: "arr = [-3,0,1,-3,1,1,1,-3,10,0]", out: "true", explanation: "counts are 3,3... wait: -3→3, 0→2, 1→4, 10→1 — all distinct" },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000", "−1000 ≤ arr[i] ≤ 1000"],
    recognize:
      "Two layers of counting: first 'how many times does each value occur' (a frequency map), then 'are those counts all different' (uniqueness of the count multiset → put them in a set and compare sizes).",
    figureItOut: [
      "Break the question into two independent steps. Step one is the classic tally: how often does each value appear? That is a value → count hash map built in one pass.",
      "Step two ignores the values entirely and asks only about the COUNTS: are they pairwise distinct? 'All elements distinct' is the textbook job for a hash set.",
      "Collect every count into a set. If two values shared a count, the set would absorb the duplicate and end up smaller than the number of distinct values.",
      "So the test reduces to: size of the set of counts == number of distinct values (== number of map entries). Equal means all counts were unique.",
      "Both the tally pass and the set insertion are linear in the array length → O(n) time, O(n) space for the map and set.",
    ],
    approaches: [
      {
        name: "Frequency map + set of counts (optimal)",
        intuition: "Count occurrences into a map, then push the counts into a set; uniqueness holds iff the set keeps every count.",
        time: "O(n)",
        timeWhy: "One pass to count, one pass over the distinct values to insert counts.",
        space: "O(n)",
        spaceWhy: "A map of value→count and a set of counts.",
        code: `boolean uniqueOccurrences(int[] arr) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int v : arr) {
        count.put(v, count.getOrDefault(v, 0) + 1);
    }
    Set<Integer> seenCounts = new HashSet<>();
    for (int c : count.values()) {
        if (!seenCounts.add(c)) return false; // count already taken by another value
    }
    return true;
}`,
        walkthrough: [
          "arr=[1,2,2,1,1,3]. Counting → {1:3, 2:2, 3:1}.",
          "Insert counts: add 3 ok, add 2 ok, add 1 ok — none rejected.",
          "Every add succeeded → counts are unique → return true.",
        ],
      },
    ],
    edgeCases: [
      "Single element → one count, trivially unique → true.",
      "All elements equal → exactly one count value → unique → true.",
      "Two distinct values each appearing once → both have count 1 → false.",
    ],
    twists: [
      "**Sort Characters By Frequency** (in the library) → also tallies counts, but orders by them instead of testing uniqueness.",
      "**Make counts unique by deletions** (LeetCode 1647) → greedily decrement clashing counts; same frequency-map start.",
      "**Top K Frequent Elements** (in the library) → reuse the frequency map, then select the largest counts.",
    ],
    related: ["sort-characters-by-frequency", "top-k-frequent-elements"],
  },

  {
    slug: "find-the-difference-of-two-arrays",
    title: "Find the Difference of Two Arrays",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 2215,
    statement:
      "Given two integer arrays `nums1` and `nums2`, return a list `answer` of size 2 where `answer[0]` is a list of all **distinct** integers in `nums1` not present in `nums2`, and `answer[1]` is a list of all distinct integers in `nums2` not present in `nums1`.",
    examples: [
      { in: "nums1 = [1,2,3], nums2 = [2,4,6]", out: "[[1,3],[4,6]]", explanation: "1,3 are only in nums1; 4,6 only in nums2" },
      { in: "nums1 = [1,2,3,3], nums2 = [1,1,2,2]", out: "[[3],[]]", explanation: "only 3 is unique to nums1; nothing is unique to nums2" },
    ],
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 1000", "−1000 ≤ nums1[i], nums2[i] ≤ 1000"],
    recognize:
      "'Which elements are in one collection but not the other, deduplicated' is the definition of **set difference**. Two hash sets and two membership scans give both halves directly.",
    figureItOut: [
      "The word 'distinct' is the tell: duplicates inside each array do not matter, only membership does. So first collapse each array into a hash set.",
      "answer[0] is set1 minus set2: every element of set1 that set2 does not contain. answer[1] is the mirror image, set2 minus set1.",
      "Build set1 from nums1 and set2 from nums2. Then iterate set1 and keep elements where set2.contains is false; iterate set2 and keep where set1.contains is false.",
      "Using sets for both the dedup and the membership test keeps every lookup O(1), and iterating a set never repeats a value, satisfying 'distinct' for free.",
      "Building both sets is O(m+n); the two filtering scans are O(m+n) → O(m+n) time and space overall.",
    ],
    approaches: [
      {
        name: "Two hash sets, symmetric difference (optimal)",
        intuition: "Dedup each array into a set, then keep the elements each set has that the other lacks.",
        time: "O(m + n)",
        timeWhy: "Building both sets and the two membership scans are each linear.",
        space: "O(m + n)",
        spaceWhy: "Two sets holding the distinct values of each array.",
        code: `List<List<Integer>> findDifference(int[] nums1, int[] nums2) {
    Set<Integer> set1 = new HashSet<>();
    Set<Integer> set2 = new HashSet<>();
    for (int v : nums1) set1.add(v);
    for (int v : nums2) set2.add(v);
    List<Integer> onlyIn1 = new ArrayList<>();
    List<Integer> onlyIn2 = new ArrayList<>();
    for (int v : set1) {
        if (!set2.contains(v)) onlyIn1.add(v);
    }
    for (int v : set2) {
        if (!set1.contains(v)) onlyIn2.add(v);
    }
    List<List<Integer>> answer = new ArrayList<>();
    answer.add(onlyIn1);
    answer.add(onlyIn2);
    return answer;
}`,
        walkthrough: [
          "nums1=[1,2,3,3], nums2=[1,1,2,2]. set1={1,2,3}, set2={1,2}.",
          "set1 minus set2: 3 only → onlyIn1=[3]. set2 minus set1: 1,2 both in set1 → onlyIn2=[].",
          "Return [[3],[]].",
        ],
      },
    ],
    edgeCases: [
      "Identical sets of values → both result lists empty.",
      "Disjoint arrays → answer[0] is all of set1, answer[1] is all of set2.",
      "Heavy duplicates within an array → collapsed by the set, so they appear at most once.",
    ],
    twists: [
      "**Intersection of Two Arrays** (in the library) → keep the elements both sets share instead of the differences.",
      "**Symmetric difference as one flat list** → concatenate the two halves.",
      "**Counts preserved (multiset difference)** → swap sets for frequency maps and subtract counts.",
    ],
    related: ["intersection-of-two-arrays", "contains-duplicate"],
  },

  {
    slug: "destination-city",
    title: "Destination City",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1436,
    statement:
      "You are given a list `paths` where `paths[i] = [cityAi, cityBi]` means a direct path from `cityAi` to `cityBi`. The paths form a single line with no loops. Return the **destination city** — the city without any outgoing path (it never appears as a starting city).",
    examples: [
      { in: 'paths = [["London","NewYork"],["NewYork","Lima"],["Lima","SaoPaulo"]]', out: '"SaoPaulo"', explanation: "SaoPaulo never starts a path" },
      { in: 'paths = [["B","C"],["D","B"],["C","A"]]', out: '"A"', explanation: "the line is D→B→C→A; A is the end" },
      { in: 'paths = [["A","Z"]]', out: '"Z"' },
    ],
    constraints: ["1 ≤ paths.length ≤ 100", "paths[i].length == 2", "all city names are distinct non-empty strings", "the graph is a line with no cycles"],
    recognize:
      "The destination is the unique city that is a B (end) but never an A (start). 'A member of one collection that is absent from another' → collect all starting cities into a **hash set** and find the one ending city not in it.",
    figureItOut: [
      "Picture the paths as a single chain of cities. Every city except the final one has an outgoing edge, so it shows up as the FIRST element (a start) of some path.",
      "The destination is special precisely because it has no outgoing edge — it is never anyone's starting city, though it is some path's ending city.",
      "So gather every starting city (the A in each pair) into a hash set. That set is exactly 'all cities that have somewhere to go next'.",
      "Then scan the ending cities (the B in each pair). The first ending city NOT in the starts set has no outgoing path — that is the destination.",
      "Building the set is O(n); scanning the ends is O(n) with O(1) lookups → O(n) time, O(n) space.",
    ],
    approaches: [
      {
        name: "Set of starting cities (optimal)",
        intuition: "Collect all starts; the destination is the end city that is not among them.",
        time: "O(n)",
        timeWhy: "One pass to record starts, one pass to test ends, with O(1) set lookups.",
        space: "O(n)",
        spaceWhy: "A set holding every starting city.",
        code: `String destCity(List<List<String>> paths) {
    Set<String> starts = new HashSet<>();
    for (List<String> p : paths) {
        starts.add(p.get(0));
    }
    for (List<String> p : paths) {
        String end = p.get(1);
        if (!starts.contains(end)) return end; // no outgoing path from this city
    }
    return ""; // unreachable given a valid line graph
}`,
        walkthrough: [
          'paths=[["B","C"],["D","B"],["C","A"]]. starts={B,D,C}.',
          'Check ends: C is in starts, B is in starts, A is NOT in starts.',
          'A has no outgoing path → return "A".',
        ],
      },
    ],
    edgeCases: [
      "Single path → its second city is the destination.",
      "Cities given out of chain order → the set approach is order-independent.",
      "Guaranteed exactly one destination by the no-cycle line constraint, so the first non-start end is the answer.",
    ],
    twists: [
      "**Find the start city instead** → collect all ENDS and find the city never appearing as an end.",
      "**Detect if it is actually a valid line** → check in/out degrees, not just one missing start.",
      "**Multiple disconnected lines** → return all cities that are ends but never starts.",
    ],
    related: ["contains-duplicate", "two-sum"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "merge-strings-alternately",
    title: "Merge Strings Alternately",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 1768,
    statement:
      "Given two strings `word1` and `word2`, merge them by adding letters in **alternating order**, starting with `word1`. If one string is longer than the other, append the extra letters onto the end of the merged string. Return the merged string.",
    examples: [
      { in: 'word1 = "abc", word2 = "pqr"', out: '"apbqcr"', explanation: "a,p,b,q,c,r interleaved" },
      { in: 'word1 = "ab", word2 = "pqrs"', out: '"apbqrs"', explanation: 'after "apbq", "rs" remains from word2' },
      { in: 'word1 = "abcd", word2 = "pq"', out: '"apbqcd"', explanation: '"cd" trails from word1' },
    ],
    constraints: ["1 ≤ word1.length, word2.length ≤ 100", "both consist of lowercase English letters"],
    recognize:
      "Walking two sequences in lockstep, taking one element from each in turn, is the **two-pointer** interleave. One index per string, advancing together, then a tail copy for the leftover.",
    figureItOut: [
      "The merge alternates word1[0], word2[0], word1[1], word2[1], ... so you advance through both strings at the same pace — a pointer into each.",
      "Run a single index i while it is in range for BOTH strings: append word1[i], then word2[i]. This handles the common prefix length cleanly.",
      "Once one string runs out, only one has characters left. There is nothing to interleave with, so the rest is appended verbatim.",
      "Append word1 from index i to its end, then word2 from index i to its end. At most one of these loops actually runs, because i already passed the shorter length.",
      "Each character is appended exactly once into a StringBuilder → O(m + n) time, O(m + n) space for the result.",
    ],
    approaches: [
      {
        name: "Two-pointer interleave + tail copy (optimal)",
        intuition: "Advance one shared index taking a char from each string, then append whatever remains of the longer one.",
        time: "O(m + n)",
        timeWhy: "Every character of both strings is appended once.",
        space: "O(m + n)",
        spaceWhy: "The merged string holds all characters.",
        code: `String mergeAlternately(String word1, String word2) {
    StringBuilder sb = new StringBuilder();
    int i = 0;
    while (i < word1.length() && i < word2.length()) {
        sb.append(word1.charAt(i));
        sb.append(word2.charAt(i));
        i++;
    }
    while (i < word1.length()) {
        sb.append(word1.charAt(i));
        i++;
    }
    while (i < word2.length()) {
        sb.append(word2.charAt(i));
        i++;
    }
    return sb.toString();
}`,
        walkthrough: [
          'word1="ab", word2="pqrs". i=0: append a,p. i=1: append b,q. i=2 stops the interleave (word1 exhausted).',
          'First tail loop: i=2 >= word1.length, skipped. Second tail loop: append word2[2]=r, word2[3]=s.',
          'Result "apbqrs".',
        ],
      },
    ],
    edgeCases: [
      "Equal lengths → the interleave consumes everything; both tail loops skip.",
      "One string much longer → the long tail is copied wholesale after the short one is exhausted.",
      "Single-character strings → just two appends.",
    ],
    twists: [
      "**Merge Sorted Array** (in the library) → also a two-pointer merge, but ordered by value rather than alternating.",
      "**Merge more than two strings round-robin** → cycle an index across an array of strings.",
      "**Start with word2 instead** → swap the append order inside the interleave loop.",
    ],
    related: ["merge-sorted-array", "is-subsequence"],
  },

  {
    slug: "rearrange-array-elements-by-sign",
    title: "Rearrange Array Elements by Sign",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 2149,
    statement:
      "You are given a 0-indexed integer array `nums` of even length, with an equal number of positive and negative integers. Rearrange it so that (1) signs **alternate** starting with a positive, and (2) the relative order among the positives, and among the negatives, is **preserved**. Return the rearranged array.",
    examples: [
      { in: "nums = [3,1,-2,-5,2,-4]", out: "[3,-2,1,-5,2,-4]", explanation: "positives 3,1,2 and negatives -2,-5,-4 kept in order, woven +,-,+,-..." },
      { in: "nums = [-1,1]", out: "[1,-1]", explanation: "positive first" },
    ],
    constraints: ["2 ≤ nums.length ≤ 2·10⁵", "nums.length is even", "1 ≤ |nums[i]| ≤ 10⁶", "equal count of positives and negatives"],
    recognize:
      "Two interleaved subsequences (positives at even indices, negatives at odd) that each keep their input order → walk the array with **two write pointers**, one stepping over even slots and one over odd slots, while a single read pointer feeds them.",
    figureItOut: [
      "The output has a rigid skeleton: index 0,2,4,... must be positive and 1,3,5,... must be negative. Since counts are equal, the positives fill exactly the even slots and the negatives the odd slots.",
      "Within the positives, order must be preserved, and likewise within the negatives. So the i-th positive encountered in the input goes to result index 2i, and the i-th negative goes to result index 2i+1.",
      "Maintain two write cursors into a fresh result array: pos starting at 0 (steps by 2) and neg starting at 1 (steps by 2). Read nums left to right.",
      "For each value, if it is positive, place it at result[pos] and advance pos by 2; if negative, place it at result[neg] and advance neg by 2. The single read pass preserves each group's relative order automatically.",
      "One pass over n elements, filling a size-n output → O(n) time, O(n) space (an in-place version is possible but trickier; this is the clean standard).",
    ],
    approaches: [
      {
        name: "Two write pointers into a result array (optimal)",
        intuition: "Positives go to even slots, negatives to odd slots; a single forward read keeps each group's order.",
        time: "O(n)",
        timeWhy: "One pass placing each element into its destined slot.",
        space: "O(n)",
        spaceWhy: "A separate output array of size n.",
        code: `int[] rearrangeArray(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int pos = 0; // next even slot
    int neg = 1; // next odd slot
    for (int v : nums) {
        if (v > 0) {
            result[pos] = v;
            pos += 2;
        } else {
            result[neg] = v;
            neg += 2;
        }
    }
    return result;
}`,
        walkthrough: [
          "nums=[3,1,-2,-5,2,-4]. v=3>0 → result[0]=3,pos=2. v=1>0 → result[2]=1,pos=4. v=-2 → result[1]=-2,neg=3.",
          "v=-5 → result[3]=-5,neg=5. v=2>0 → result[4]=2,pos=6. v=-4 → result[5]=-4,neg=7.",
          "result=[3,-2,1,-5,2,-4].",
        ],
      },
    ],
    edgeCases: [
      "Smallest case [+, −] or [−, +] → positive lands at index 0 regardless of input order.",
      "All positives appear before all negatives in the input → still interleaved correctly by the slot pointers.",
      "Large values near 10⁶ → fit comfortably in int; no overflow since we only move, not add.",
    ],
    twists: [
      "**Sort Colors** (in the library) → also rearranges by category, but in place with a Dutch-flag partition.",
      "**Move Zeroes** (in the library) → a one-category compaction using a single write pointer.",
      "**Unequal positive/negative counts** (LeetCode follow-up) → append the leftovers after the alternating prefix.",
    ],
    related: ["sort-colors", "move-zeroes"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "maximum-points-you-can-obtain-from-cards",
    title: "Maximum Points You Can Obtain from Cards",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1423,
    statement:
      "There are several cards in a row, each with a score in `cardPoints[i]`. In one step you take exactly one card from the **beginning or the end** of the row. You take exactly `k` cards in total. Return the **maximum score** you can obtain.",
    examples: [
      { in: "cardPoints = [1,2,3,4,5,6,1], k = 3", out: "12", explanation: "take the last three 5,6,1 → 12" },
      { in: "cardPoints = [2,2,2], k = 2", out: "4" },
      { in: "cardPoints = [9,7,7,9,7,7,9], k = 7", out: "55", explanation: "take all cards" },
    ],
    constraints: ["1 ≤ cardPoints.length ≤ 10⁵", "1 ≤ cardPoints[i] ≤ 10⁴", "1 ≤ k ≤ cardPoints.length"],
    recognize:
      "Taking k cards from the two ends means LEAVING a contiguous block of n−k cards in the MIDDLE. Maximizing the taken sum = minimizing the leftover middle block sum → a **fixed-size sliding window** of length n−k.",
    figureItOut: [
      "Trying all ways to split k picks between the front and back is k+1 combinations — workable, but there is a sharper reframing.",
      "Whatever k cards you take from the ends, the cards you DON'T take always form one contiguous run in the middle of length n − k. The total of all cards is fixed.",
      "So maximizing your score is the same as minimizing the sum of that untouched middle block. taken = total − (middle block sum).",
      "Finding the minimum sum over every contiguous block of fixed length n − k is a textbook fixed-size sliding window: slide a window of width n − k, track its minimum sum.",
      "If k == n the middle block has length 0 (you take everything), so the answer is the full total. One pass for the total, one sliding pass → O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Brute force front/back split",
        intuition: "Try taking i cards from the front and k−i from the back for every i, keep the best.",
        time: "O(k)",
        timeWhy: "k+1 splits, each computed in O(1) from prefix/suffix sums.",
        space: "O(1)",
        spaceWhy: "Running prefix and suffix sums.",
        code: `int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int frontSum = 0;
    for (int i = 0; i < k; i++) frontSum += cardPoints[i];
    int best = frontSum;
    int backSum = 0;
    for (int i = 1; i <= k; i++) {
        frontSum -= cardPoints[k - i];        // give back one front card
        backSum += cardPoints[n - i];         // take one more back card
        best = Math.max(best, frontSum + backSum);
    }
    return best;
}`,
      },
      {
        name: "Minimize the middle window (optimal)",
        intuition: "Take everything except the cheapest contiguous block of length n−k left in the middle.",
        time: "O(n)",
        timeWhy: "One pass for the total, one fixed-size sliding pass for the minimum middle.",
        space: "O(1)",
        spaceWhy: "A few accumulators.",
        code: `int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int total = 0;
    for (int v : cardPoints) total += v;
    int windowLen = n - k;
    if (windowLen == 0) return total; // take every card
    int windowSum = 0;
    for (int i = 0; i < windowLen; i++) windowSum += cardPoints[i];
    int minWindow = windowSum;
    for (int i = windowLen; i < n; i++) {
        windowSum += cardPoints[i];
        windowSum -= cardPoints[i - windowLen];
        minWindow = Math.min(minWindow, windowSum);
    }
    return total - minWindow;
}`,
        walkthrough: [
          "cardPoints=[1,2,3,4,5,6,1], k=3. total=22, windowLen=4. First window [1,2,3,4] sum=10, minWindow=10.",
          "Slide to [2,3,4,5]=14, [3,4,5,6]=18, [4,5,6,1]=16. minWindow stays 10.",
          "Answer = total 22 − minWindow 10 = 12.",
        ],
      },
    ],
    edgeCases: [
      "k == n → middle window length 0 → answer is the total of all cards.",
      "k == 1 → answer is max(first, last) card.",
      "All cards equal → any selection gives k × value; window minimization still returns the right total.",
    ],
    twists: [
      "**Maximum Average Subarray I** (in the library) → the same fixed-window sum, here used on the complement.",
      "**Take from ends but variable k** → reframe per k as a different fixed window length.",
      "**Cards can be negative** → the complement trick still holds; minimize the middle sum exactly as written.",
    ],
    related: ["maximum-average-subarray-i", "grumpy-bookstore-owner"],
  },

  {
    slug: "binary-subarrays-with-sum",
    title: "Binary Subarrays With Sum",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 930,
    statement:
      "Given a binary array `nums` (only 0s and 1s) and an integer `goal`, return the number of **non-empty subarrays** with a sum equal to `goal`.",
    examples: [
      { in: "nums = [1,0,1,0,1], goal = 2", out: "4", explanation: "the four subarrays summing to 2 are [1,0,1], [1,0,1,0], [0,1,0,1], [1,0,1]" },
      { in: "nums = [0,0,0,0,0], goal = 0", out: "15", explanation: "every subarray of all zeros sums to 0" },
    ],
    constraints: ["1 ≤ nums.length ≤ 3·10⁴", "nums[i] is 0 or 1", "0 ≤ goal ≤ nums.length"],
    recognize:
      "'Count subarrays whose sum is EXACTLY goal' over non-negative values → the **at-most trick**: exactly(goal) = atMost(goal) − atMost(goal−1), and each atMost is a single shrinking sliding window.",
    figureItOut: [
      "Counting subarrays with sum EXACTLY goal is awkward directly, because the all-zero stretches make windows ambiguous (a zero can extend a valid window without changing its sum).",
      "Define atMost(x) = number of subarrays whose sum is ≤ x. Because every value is non-negative, widening a window can only increase its sum, which is exactly the monotonic property a sliding window needs.",
      "Then exactly(goal) = atMost(goal) − atMost(goal − 1): subarrays with sum ≤ goal minus those with sum ≤ goal−1 leaves precisely those with sum == goal. (If goal is 0, atMost(−1) is 0.)",
      "Compute atMost(x) with a window: expand r adding nums[r]; while the window sum exceeds x, shrink from l. For each r, every subarray ending at r and starting anywhere in [l..r] has sum ≤ x, so add (r − l + 1) to the count.",
      "Each atMost call is one O(n) pass and we call it twice → O(n) time, O(1) space. This cleanly absorbs the zero-run ambiguity.",
    ],
    approaches: [
      {
        name: "Prefix-sum count map",
        intuition: "Track how many prefixes had each sum; for each prefix add the count of prefixSum − goal seen earlier.",
        time: "O(n)",
        timeWhy: "One pass with O(1) map updates.",
        space: "O(n)",
        spaceWhy: "A map from prefix-sum value to how often it occurred.",
        code: `int numSubarraysWithSum(int[] nums, int goal) {
    Map<Integer, Integer> count = new HashMap<>();
    count.put(0, 1);
    int prefix = 0, result = 0;
    for (int v : nums) {
        prefix += v;
        result += count.getOrDefault(prefix - goal, 0);
        count.put(prefix, count.getOrDefault(prefix, 0) + 1);
    }
    return result;
}`,
      },
      {
        name: "atMost(goal) − atMost(goal−1) sliding window (optimal)",
        intuition: "Exactly-goal equals the gap between two at-most counts, each a shrinking window over non-negative values.",
        time: "O(n)",
        timeWhy: "Two linear sliding-window passes.",
        space: "O(1)",
        spaceWhy: "Only window pointers and counters.",
        code: `int numSubarraysWithSum(int[] nums, int goal) {
    return atMost(nums, goal) - atMost(nums, goal - 1);
}

private int atMost(int[] nums, int x) {
    if (x < 0) return 0;
    int l = 0, sum = 0, count = 0;
    for (int r = 0; r < nums.length; r++) {
        sum += nums[r];
        while (sum > x) {
            sum -= nums[l];
            l++;
        }
        count += r - l + 1; // all subarrays ending at r with sum <= x
    }
    return count;
}`,
        walkthrough: [
          "nums=[1,0,1,0,1], goal=2. atMost(2): windows accumulate count = 12 (all subarrays summing to 0,1,2).",
          "atMost(1): count = 8 (subarrays summing to 0 or 1).",
          "exactly = 12 − 8 = 4.",
        ],
      },
    ],
    edgeCases: [
      "goal == 0 → atMost(−1)=0, so the answer is atMost(0): the count of all-zero subarrays.",
      "All ones with goal == nums.length → exactly one subarray (the whole array).",
      "No subarray reaches goal → both at-most counts cancel to 0.",
    ],
    twists: [
      "**Subarray Sum Equals K** (in the library) → general integers force the prefix-sum map; the at-most trick needs non-negativity.",
      "**Count subarrays with at most goal ones** → just atMost(goal) by itself.",
      "**Subarrays With K Different Integers** (LeetCode 992) → same exactly = atMost(K) − atMost(K−1) pattern on distinct counts.",
    ],
    related: ["subarray-sum-equals-k", "max-consecutive-ones-iii"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "minimum-remove-to-make-valid-parentheses",
    title: "Minimum Remove to Make Valid Parentheses",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1249,
    statement:
      "Given a string `s` of lowercase letters and the characters `'('` and `')'`, remove the **minimum number** of parentheses (anywhere) so the result is valid, and return any such valid string. A string is valid if every `'('` has a matching `')'` after it and vice versa; letters are unrestricted.",
    examples: [
      { in: 's = "lee(t(c)o)de)"', out: '"lee(t(c)o)de"', explanation: "the trailing unmatched ')' is removed" },
      { in: 's = "a)b(c)d"', out: '"ab(c)d"', explanation: "the leading unmatched ')' is removed" },
      { in: 's = "))(("', out: '""', explanation: "no parenthesis can be matched" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s contains lowercase letters, '(' and ')'"],
    recognize:
      "Matching parentheses and identifying the UNMATCHED ones is the canonical **stack** job: push the index of each '(', pop on a ')'. Whatever a ')' cannot pop, and whatever '(' indices remain on the stack, are exactly the characters to delete.",
    figureItOut: [
      "There are two kinds of offending parentheses: a ')' that has no earlier unmatched '(' to pair with, and a '(' that never gets a later ')'. Both must be removed, and removing only those is minimal.",
      "Use a stack of INDICES of open parens. On '(', push its index. On ')', if the stack is non-empty pop it (a successful match); if empty, this ')' is unmatched — record its index for deletion.",
      "After the scan, any indices still on the stack are '(' that were never closed — also mark them for deletion.",
      "Collect all the to-delete indices in a set. Rebuild the string skipping those positions; everything else (including all letters) is kept, giving a valid string with the fewest removals.",
      "Pushing/popping each char is O(1) and the rebuild is one pass → O(n) time, O(n) space for the stack and the deletion set.",
    ],
    approaches: [
      {
        name: "Index stack, delete the unmatched (optimal)",
        intuition: "Match parens with a stack of open indices; unmatched ')' during the scan and leftover '(' indices are exactly what to remove.",
        time: "O(n)",
        timeWhy: "One scan to find removals, one scan to rebuild.",
        space: "O(n)",
        spaceWhy: "The index stack and the set of positions to drop.",
        code: `String minRemoveToMakeValid(String s) {
    Deque<Integer> openStack = new ArrayDeque<>();
    Set<Integer> toRemove = new HashSet<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(') {
            openStack.push(i);
        } else if (c == ')') {
            if (!openStack.isEmpty()) openStack.pop();
            else toRemove.add(i); // ')' with no open to match
        }
    }
    while (!openStack.isEmpty()) {
        toRemove.add(openStack.pop()); // '(' never closed
    }
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < s.length(); i++) {
        if (!toRemove.contains(i)) sb.append(s.charAt(i));
    }
    return sb.toString();
}`,
        walkthrough: [
          "s=\"a)b(c)d\". i=1 ')' stack empty -> toRemove={1}. i=3 '(' push 3. i=5 ')' pop 3 (matched).",
          "Scan ends; stack empty → no leftover opens. toRemove={1}.",
          'Rebuild skipping index 1 → "ab(c)d".',
        ],
      },
    ],
    edgeCases: [
      "No parentheses at all → nothing removed, string returned unchanged.",
      "Already valid → stack empties fully and no ')' is orphaned → unchanged.",
      "All closing or all opening → every paren is removed, leaving only letters (or empty).",
    ],
    twists: [
      "**Valid Parentheses** (in the library) → only checks validity; here we must also repair it minimally.",
      "**Minimum Add to Make Parentheses Valid** (in the library) → count insertions instead of deletions; same balance logic.",
      "**Remove to make valid with multiple bracket types** → a stack carrying the bracket char, matching by type.",
    ],
    related: ["valid-parentheses", "minimum-add-to-make-parentheses-valid"],
  },

  {
    slug: "validate-stack-sequences",
    title: "Validate Stack Sequences",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 946,
    statement:
      "Given two integer arrays `pushed` and `popped`, each a permutation of distinct values, return `true` if and only if this could be the result of a sequence of push and pop operations on an initially empty stack — i.e. `pushed` is the order of pushes and `popped` is the order of pops.",
    examples: [
      { in: "pushed = [1,2,3,4,5], popped = [4,5,3,2,1]", out: "true", explanation: "push 1,2,3,4; pop 4; push 5; pop 5,3,2,1" },
      { in: "pushed = [1,2,3,4,5], popped = [4,3,5,1,2]", out: "false", explanation: "1 cannot be popped before 2 here" },
    ],
    constraints: ["1 ≤ pushed.length ≤ 1000", "pushed.length == popped.length", "values are distinct and popped is a permutation of pushed"],
    recognize:
      "The problem literally describes stack operations, so **simulate** them with a real stack: push in the given order, and greedily pop whenever the stack top equals the next value we are required to pop.",
    figureItOut: [
      "The cleanest test is to actually run the machine: maintain a stack and push the values from `pushed` one at a time in order.",
      "After each push, check whether the current top matches the next value that `popped` demands. If it does, pop it and advance the pop pointer — keep doing this greedily while the top keeps matching.",
      "This greedy 'pop as soon as you can' is safe: each value must be popped eventually, and if its moment to be popped (it is on top and is next in `popped`) is skipped, it gets buried and can never be popped in the right order.",
      "After pushing everything and popping greedily, the sequence is valid exactly when the stack is empty — meaning every pop in `popped` was satisfiable in order.",
      "Each value is pushed once and popped at most once → O(n) time, O(n) space for the stack.",
    ],
    approaches: [
      {
        name: "Simulate with a stack, greedy pop (optimal)",
        intuition: "Push in order; whenever the top equals the next required pop, pop it. Valid iff the stack ends empty.",
        time: "O(n)",
        timeWhy: "Each element is pushed once and popped at most once.",
        space: "O(n)",
        spaceWhy: "The simulation stack, up to n elements.",
        code: `boolean validateStackSequences(int[] pushed, int[] popped) {
    Deque<Integer> stack = new ArrayDeque<>();
    int j = 0; // index into popped
    for (int x : pushed) {
        stack.push(x);
        while (!stack.isEmpty() && j < popped.length && stack.peek() == popped[j]) {
            stack.pop();
            j++;
        }
    }
    return stack.isEmpty();
}`,
        walkthrough: [
          "pushed=[1,2,3,4,5], popped=[4,5,3,2,1]. Push 1,2,3,4; top 4 == popped[0] → pop, j=1.",
          "Push 5; top 5 == popped[1] → pop, then 3,2,1 each match in turn → pop all, j=5.",
          "Stack empty at the end → true.",
        ],
      },
    ],
    edgeCases: [
      "Single element → push then pop, always valid.",
      "popped equals pushed reversed → valid (push all, then pop all).",
      "popped equals pushed in the same order → valid (push one, pop one, repeat).",
    ],
    twists: [
      "**Build an Array With Stack Operations** (LeetCode 1441) → emit the push/pop ops rather than validating a given pair.",
      "**Asteroid Collision** (in the library) → another simulate-with-a-stack problem where the top decides the action.",
      "**Streaming version** → process pushes/pops online without both full arrays up front.",
    ],
    related: ["asteroid-collision", "min-stack"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "kth-missing-positive-number",
    title: "Kth Missing Positive Number",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 1539,
    statement:
      "Given an array `arr` of positive integers sorted in **strictly increasing** order, and an integer `k`, return the `k`-th positive integer that is **missing** from this array.",
    examples: [
      { in: "arr = [2,3,4,7,11], k = 5", out: "9", explanation: "missing are 1,5,6,8,9,10,... the 5th is 9" },
      { in: "arr = [1,2,3,4], k = 2", out: "6", explanation: "missing start at 5,6,...; the 2nd is 6" },
    ],
    constraints: ["1 ≤ arr.length ≤ 1000", "1 ≤ arr[i] ≤ 1000", "arr is strictly increasing", "1 ≤ k ≤ 1000"],
    recognize:
      "At index i the value arr[i] tells you how many positives are missing up to that point: missing(i) = arr[i] − (i + 1). This count is **monotonic non-decreasing**, so **binary search** finds where it first reaches k.",
    figureItOut: [
      "If nothing were missing, arr[i] would equal i + 1. The gap arr[i] − (i + 1) is exactly how many positive integers are missing at or before index i.",
      "A linear scan works: walk the array counting missing numbers until the count hits k. But the gap is monotonic non-decreasing (each step adds the new gap), which unlocks binary search.",
      "Binary search for the first index where missing(i) = arr[i] − (i + 1) is ≥ k. Call that boundary index `lo` after the search.",
      "Everything before `lo` has fewer than k missing. The k-th missing number lies just after arr[lo−1] in the gap. The formula collapses to lo + k: there are lo present numbers before the boundary, and we want k more positives.",
      "The search runs in O(log n); the final arithmetic is O(1). (A simple O(n) scan is also acceptable for n ≤ 1000 and shown as the warm-up.)",
    ],
    approaches: [
      {
        name: "Linear scan over missing count",
        intuition: "Walk the array; each value reveals how many are missing so far — stop when that reaches k.",
        time: "O(n)",
        timeWhy: "Single pass, possibly a small tail of arithmetic.",
        space: "O(1)",
        spaceWhy: "A running counter.",
        code: `int findKthPositive(int[] arr, int k) {
    int missing = 0, prev = 0;
    for (int v : arr) {
        int gap = v - prev - 1; // missing numbers strictly between prev and v
        if (missing + gap >= k) {
            return prev + (k - missing); // the k-th missing sits in this gap
        }
        missing += gap;
        prev = v;
    }
    return prev + (k - missing); // beyond the last element
}`,
      },
      {
        name: "Binary search on the missing count (optimal)",
        intuition: "missing(i) = arr[i] − (i+1) is monotone; find the first index where it reaches k, then the answer is lo + k.",
        time: "O(log n)",
        timeWhy: "The candidate index range halves each step.",
        space: "O(1)",
        spaceWhy: "Two interval bounds.",
        code: `int findKthPositive(int[] arr, int k) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int missing = arr[mid] - (mid + 1); // missing positives up to index mid
        if (missing < k) lo = mid + 1;       // not enough missing yet, go right
        else hi = mid - 1;                   // mid already has >= k missing, go left
    }
    return lo + k; // lo present numbers precede the answer; want k more positives
}`,
        walkthrough: [
          "arr=[2,3,4,7,11], k=5. mid=2 arr[2]=4 missing=4−3=1<5 → lo=3. mid=4 arr[4]=11 missing=11−5=6≥5 → hi=3.",
          "mid=3 arr[3]=7 missing=7−4=3<5 → lo=4. lo=4>hi=3 stop.",
          "Answer = lo 4 + k 5 = 9.",
        ],
      },
    ],
    edgeCases: [
      "All missing numbers come before the array (arr starts large) → boundary is index 0, answer is k.",
      "k larger than every gap inside the array → answer lies past the last element (lo == length, answer = length + k).",
      "arr already contiguous from 1 → all missing are after the end; answer = n + k.",
    ],
    twists: [
      "**Missing Number** (in the library) → exactly one missing in 0..n; here we want the k-th of unbounded missing.",
      "**Find First and Last Position** (in the library) → another boundary-finding binary search on a monotone predicate.",
      "**k-th missing in an unsorted array** → sort first, or use a hash set if the range is small.",
    ],
    related: ["missing-number", "find-first-and-last-position-of-element-in-sorted-array"],
  },

  {
    slug: "h-index-ii",
    title: "H-Index II",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 275,
    statement:
      "Given an array `citations` sorted in **ascending** order, where `citations[i]` is the number of citations of the i-th paper, return the researcher's **h-index**: the maximum `h` such that at least `h` papers have at least `h` citations each.",
    examples: [
      { in: "citations = [0,1,3,5,6]", out: "3", explanation: "3 papers (3,5,6) have ≥ 3 citations; not 4 papers have ≥ 4" },
      { in: "citations = [1,2,100]", out: "2", explanation: "2 papers have ≥ 2 citations" },
    ],
    constraints: ["n == citations.length", "1 ≤ n ≤ 10⁵", "0 ≤ citations[i] ≤ 1000", "citations is sorted ascending"],
    recognize:
      "Because the array is sorted ascending, the papers from index i to the end (there are n − i of them) all have at least citations[i] citations. The condition citations[mid] ≥ n − mid is **monotonic**, so **binary search** finds the h-index.",
    figureItOut: [
      "Sorted ascending means: at index i, the papers from i to n−1 are the n − i papers with the MOST citations, and each has at least citations[i] citations.",
      "So if citations[i] ≥ n − i, then those n − i papers all clear the bar of n − i citations — giving a candidate h-index of n − i. We want the largest such value, i.e. the smallest i that satisfies it.",
      "Notice the predicate citations[i] ≥ n − i is monotonic: as i increases, citations[i] grows (sorted) while n − i shrinks, so once it becomes true it stays true. That is the green light for binary search.",
      "Binary search for the leftmost index i where citations[i] ≥ n − i. If citations[mid] < n − mid, the h-index must come from a higher index (lo = mid + 1); otherwise mid is a candidate, look left (hi = mid − 1).",
      "After the loop, lo is that leftmost qualifying index, and the h-index is n − lo. If no index qualifies, lo == n and the h-index is 0. The search is O(log n), O(1) space.",
    ],
    approaches: [
      {
        name: "Binary search on citations[i] ≥ n − i (optimal)",
        intuition: "Find the smallest index where the paper's citations cover the count of papers from there to the end; the h-index is n minus that index.",
        time: "O(log n)",
        timeWhy: "Halves the candidate index range each step.",
        space: "O(1)",
        spaceWhy: "Two interval bounds.",
        code: `int hIndex(int[] citations) {
    int n = citations.length;
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (citations[mid] < n - mid) lo = mid + 1; // too few citations here
        else hi = mid - 1;                           // qualifies; try an earlier index
    }
    return n - lo; // n - lo papers each have >= n - lo citations
}`,
        walkthrough: [
          "citations=[0,1,3,5,6], n=5. mid=2 citations[2]=3, n−mid=3, 3<3 false → hi=1.",
          "mid=0 citations[0]=0, n−0=5, 0<5 true → lo=1. mid=1 citations[1]=1, n−1=4, 1<4 true → lo=2.",
          "lo=2>hi=1 stop. h-index = n − lo = 5 − 2 = 3.",
        ],
      },
    ],
    edgeCases: [
      "Every paper has 0 citations → no index qualifies → lo reaches n → h-index 0.",
      "Every paper has very high citations → index 0 qualifies → h-index n.",
      "Single paper with ≥ 1 citation → h-index 1; with 0 citations → h-index 0.",
    ],
    twists: [
      "**H-Index** (LeetCode 274, unsorted) → sort first (or counting-sort), then this same logic applies.",
      "**Search Insert Position** (in the library) → the same leftmost-boundary binary search on a monotone predicate.",
      "**g-index / other bibliometrics** → change the predicate; the monotone-boundary search structure stays.",
    ],
    related: ["search-insert-position", "binary-search"],
  },

  {
    slug: "find-the-distance-value-between-two-arrays",
    title: "Find the Distance Value Between Two Arrays",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 1385,
    statement:
      "Given two integer arrays `arr1` and `arr2` and an integer `d`, return the **distance value** — the number of elements `arr1[i]` such that there is **no** element `arr2[j]` with `|arr1[i] − arr2[j]| ≤ d`.",
    examples: [
      { in: "arr1 = [4,5,8], arr2 = [10,9,1,8], d = 2", out: "2", explanation: "4 and 5 have no arr2 element within 2; 8 fails (|8−8|=0)" },
      { in: "arr1 = [1,4,2,3], arr2 = [-4,-3,6,10,20,30], d = 3", out: "2" },
    ],
    constraints: ["1 ≤ arr1.length, arr2.length ≤ 500", "−1000 ≤ arr1[i], arr2[j] ≤ 1000", "0 ≤ d ≤ 100"],
    recognize:
      "For each arr1[i] you only need to know whether ANY arr2 value falls in the band [arr1[i]−d, arr1[i]+d]. Sort arr2 once and **binary search** for the first value ≥ arr1[i]−d; check if it is also ≤ arr1[i]+d.",
    figureItOut: [
      "An element arr1[i] is 'kept' only if NO arr2 value lands within distance d — i.e. nothing in arr2 falls inside the closed band [arr1[i]−d, arr1[i]+d].",
      "The brute force compares each arr1[i] against every arr2[j] — O(m·n). Fine for n ≤ 500, but sorting arr2 sharpens it and shows the binary-search idea.",
      "Sort arr2. For a given arr1[i], the only arr2 value that could be closest from below/within is the first one ≥ arr1[i]−d. Binary search (lower bound) finds its index.",
      "If that index is in range and the value there is ≤ arr1[i]+d, then some arr2 element is within d → arr1[i] is NOT kept. Otherwise no value falls in the band → count it.",
      "Sorting is O(n log n); each of the m queries is O(log n) → O((m + n) log n) time, O(1) extra space beyond the sort.",
    ],
    approaches: [
      {
        name: "Brute force pairwise check",
        intuition: "For each arr1 element, scan arr2; keep it only if no value is within d.",
        time: "O(m·n)",
        timeWhy: "Every pair may be compared.",
        space: "O(1)",
        spaceWhy: "Only a counter.",
        code: `int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
    int count = 0;
    for (int x : arr1) {
        boolean ok = true;
        for (int y : arr2) {
            if (Math.abs(x - y) <= d) { ok = false; break; }
        }
        if (ok) count++;
    }
    return count;
}`,
      },
      {
        name: "Sort arr2 + lower-bound binary search (optimal)",
        intuition: "For each arr1 value, binary-search the first arr2 value ≥ x−d and test whether it falls within the band.",
        time: "O((m + n) log n)",
        timeWhy: "Sort arr2 once, then one O(log n) search per arr1 element.",
        space: "O(1)",
        spaceWhy: "In-place sort plus a counter (sort may use its own stack).",
        code: `int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
    Arrays.sort(arr2);
    int count = 0;
    for (int x : arr1) {
        int lo = 0, hi = arr2.length - 1, idx = arr2.length;
        int target = x - d; // first arr2 value >= target could be within the band
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (arr2[mid] >= target) { idx = mid; hi = mid - 1; }
            else lo = mid + 1;
        }
        if (idx == arr2.length || arr2[idx] > x + d) count++; // nothing within d
    }
    return count;
}`,
        walkthrough: [
          "arr1=[4,5,8], arr2 sorted=[1,8,9,10], d=2. x=4: target=2, first ≥2 is 8 at idx1; 8 > 4+2=6 → no value within d → count=1.",
          "x=5: target=3, first ≥3 is 8; 8 > 5+2=7 → count=2. x=8: target=6, first ≥6 is 8; 8 ≤ 8+2=10 → within d → not counted.",
          "Distance value = 2.",
        ],
      },
    ],
    edgeCases: [
      "d == 0 → an arr1 value is excluded only if it appears exactly in arr2.",
      "arr1 value smaller than every arr2 value → lower bound is index 0; band test still correct.",
      "arr1 value larger than every arr2 value → idx == length → counted (nothing within d).",
    ],
    twists: [
      "**Find Smallest Letter Greater Than Target** (in the library) → the same lower/upper-bound boundary search on sorted data.",
      "**Count arr1 elements that DO have a close match** → flip the final condition.",
      "**Closest element within a band** → return arr2[idx] or arr2[idx−1], whichever is nearer, instead of a yes/no.",
    ],
    related: ["find-smallest-letter-greater-than-target", "binary-search"],
  },
];
