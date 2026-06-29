// NeetCode/Top-150/LeetCode-75 — wave 15a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave14a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE15A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "number-of-good-pairs",
    title: "Number of Good Pairs",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1512,
    statement:
      "Given an array of integers `nums`, return the number of **good pairs**. A pair `(i, j)` is good if `nums[i] == nums[j]` and `i < j`.",
    examples: [
      { in: "nums = [1,2,3,1,1,3]", out: "4", explanation: "good pairs: (0,3),(0,4),(3,4) for value 1 and (2,5) for value 3" },
      { in: "nums = [1,1,1,1]", out: "6", explanation: "every one of the C(4,2)=6 pairs of equal values counts" },
      { in: "nums = [1,2,3]", out: "0", explanation: "no two equal values, so no good pairs" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "1 ≤ nums[i] ≤ 100"],
    recognize:
      "Counting index pairs of equal value is a **frequency-count then combinatorics** problem: for each value seen f times, it forms C(f,2) good pairs, so tally counts and sum the pair-counts.",
    figureItOut: [
      "A good pair depends only on the VALUE matching, not the positions beyond i<j. So group the array by value: all the indices that hold the same value form one group, and every two of them make a good pair.",
      "If a value occurs f times, the number of unordered pairs you can pick from those f positions is the combination C(f,2) = f*(f-1)/2. That is the closed-form count of good pairs for that value.",
      "So the total is the sum of f*(f-1)/2 over every distinct value. Counting the frequencies is one pass with a hash map (or a 101-slot array since values are bounded).",
      "There is an even slicker single-pass variant: as you scan, before inserting the current value, every earlier occurrence of it pairs with the current index. So add the running count of this value, then increment it.",
      "Either way it is O(n) time to count, and O(V) or O(distinct) space for the counts. The combinatorics avoids the naive O(n^2) double loop over all pairs.",
    ],
    approaches: [
      {
        name: "Brute force over all pairs",
        intuition: "Check every (i,j) with i<j and count the equal ones.",
        time: "O(n^2)",
        timeWhy: "Two nested loops over all pairs of indices.",
        space: "O(1)",
        spaceWhy: "Only a counter.",
        code: `int numIdenticalPairs(int[] nums) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] == nums[j]) count++;
        }
    }
    return count;
}`,
      },
      {
        name: "Count frequencies, add running count per value (optimal)",
        intuition: "For each value, the count of pairs is C(f,2); accumulate by adding the prior count of each value as you scan.",
        time: "O(n)",
        timeWhy: "A single pass updating a counts map.",
        space: "O(n)",
        spaceWhy: "A map (or fixed array) of value frequencies.",
        code: `int numIdenticalPairs(int[] nums) {
    Map<Integer, Integer> count = new HashMap<>();
    int pairs = 0;
    for (int v : nums) {
        int seen = count.getOrDefault(v, 0); // earlier occurrences of v
        pairs += seen;                       // each pairs with this index
        count.put(v, seen + 1);
    }
    return pairs;
}`,
        walkthrough: [
          "nums=[1,2,3,1,1,3]. Scan: 1 (seen 0, pairs 0, count1=1); 2 (0); 3 (0, count3=1); 1 (seen 1, pairs 1, count1=2).",
          "Next 1 (seen 2, pairs 1+2=3, count1=3); 3 (seen 1, pairs 3+1=4, count3=2).",
          "Total good pairs = 4.",
        ],
      },
    ],
    edgeCases: [
      "All distinct values → every running count is zero when added → answer 0.",
      "All identical values → value occurs n times → C(n,2) pairs.",
      "Single element → no pair can form → 0.",
    ],
    twists: [
      "**Count Good Meals** → the same frequency map but pairing values that sum to a power of two instead of being equal.",
      "**Subarray Sum Equals K** (in the library) → a prefix-count map that pairs prefixes differing by k.",
      "**Number of pairs with a given difference** → store seen values and look up v+d and v-d.",
    ],
    related: ["two-sum", "subarray-sum-equals-k", "single-number"],
  },

  {
    slug: "count-the-number-of-consistent-strings",
    title: "Count the Number of Consistent Strings",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 2042,
    statement:
      "You are given a string `allowed` of distinct characters and an array of strings `words`. A string is **consistent** if every character in it appears in `allowed`. Return the number of consistent strings in `words`.",
    examples: [
      { in: 'allowed = "ab", words = ["ad","bd","aaab","baa","badab"]', out: "2", explanation: '"aaab" and "baa" use only a and b' },
      { in: 'allowed = "abc", words = ["a","b","c","ab","ac","bc","abc"]', out: "7", explanation: "every word uses only a, b, c" },
      { in: 'allowed = "cad", words = ["cc","acd","b","ba","bac","bad","ac","d"]', out: "4", explanation: '"cc","acd","ac","d" are consistent' },
    ],
    constraints: ["1 ≤ words.length ≤ 10^4", "1 ≤ allowed.length ≤ 26", "1 ≤ words[i].length ≤ 10", "allowed has distinct lowercase letters"],
    recognize:
      "'Every character must come from an allowed set' is a **membership-set scan**: build a boolean set of allowed letters once, then for each word check no character falls outside it.",
    figureItOut: [
      "The allowed characters are a fixed set, and order or repetition inside a word does not matter — only whether each letter belongs to that set. So the first move is to turn allowed into a fast lookup structure.",
      "Because there are only 26 lowercase letters, a boolean[26] (or a bitmask) is the cleanest set: mark allowed[i]-'a' true. Lookups are then O(1) with no hashing overhead.",
      "A word is consistent exactly when ALL its characters are marked allowed. So scan the word and the moment you hit a disallowed character you can stop early and reject it.",
      "Count the words that survive the scan. There is no interaction between words, so it is just a filter-and-count over the list.",
      "Total characters across all words is bounded, so the work is O(total characters) time and O(1) space (the 26-slot set). The early-exit on a bad char is a constant-factor win, not an asymptotic one.",
    ],
    approaches: [
      {
        name: "Boolean allowed-set membership scan (optimal)",
        intuition: "Mark allowed letters in a 26-slot set, then count words whose every character is marked.",
        time: "O(n + L)",
        timeWhy: "n is allowed length to build the set, L is total length of all words to scan.",
        space: "O(1)",
        spaceWhy: "A fixed 26-element boolean array.",
        code: `int countConsistentStrings(String allowed, String[] words) {
    boolean[] ok = new boolean[26];
    for (int i = 0; i < allowed.length(); i++) ok[allowed.charAt(i) - 'a'] = true;
    int consistent = 0;
    for (String w : words) {
        boolean good = true;
        for (int i = 0; i < w.length(); i++) {
            if (!ok[w.charAt(i) - 'a']) { good = false; break; }
        }
        if (good) consistent++;
    }
    return consistent;
}`,
        walkthrough: [
          'allowed="ab" → ok[a]=ok[b]=true. words=["ad","bd","aaab","baa","badab"].',
          '"ad": d not allowed → reject. "bd": d not allowed → reject. "aaab": all a/b → accept. "baa": all b/a → accept. "badab": d not allowed → reject.',
          "Consistent count = 2.",
        ],
      },
    ],
    edgeCases: [
      "allowed contains all 26 letters → every word is consistent → answer equals words.length.",
      "A word with a single disallowed character anywhere → rejected even if every other character is allowed.",
      "Empty-feeling but length-1 words → handled the same; a single allowed letter counts.",
    ],
    twists: [
      "**Jewels and Stones** → same membership set, but counting matching CHARACTERS rather than whole-string validity.",
      "**Ransom Note** (in the library) → membership plus counts, since each allowed letter can be used a limited number of times.",
      "**Bitmask the allowed set** → represent allowed as one int and test a word with a single AND per character.",
    ],
    related: ["ransom-note", "word-pattern", "isomorphic-strings"],
  },

  {
    slug: "intersection-of-two-arrays-ii",
    title: "Intersection of Two Arrays II",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 350,
    statement:
      "Given two integer arrays `nums1` and `nums2`, return their **intersection**. Each element in the result must appear as many times as it shows in **both** arrays, and you may return the result in any order.",
    examples: [
      { in: "nums1 = [1,2,2,1], nums2 = [2,2]", out: "[2,2]", explanation: "2 appears twice in each, so it appears twice in the result" },
      { in: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", out: "[4,9]", explanation: "4 and 9 are common; each appears min(count1,count2) times" },
    ],
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 1000", "0 ≤ nums1[i], nums2[i] ≤ 1000"],
    recognize:
      "An intersection that respects multiplicity is a **frequency-map then decrement** problem: count one array, then walk the other emitting a value while its remaining count is positive.",
    figureItOut: [
      "Unlike a set intersection, multiplicity matters: a value common to both should appear min(count in nums1, count in nums2) times. So plain sets lose information — you need COUNTS.",
      "Count the occurrences of each value in the smaller array into a hash map (counting the smaller one keeps the map smaller). The map now says how many of each value remain available to match.",
      "Walk the other array. For each value, if its remaining count in the map is positive, that value is a genuine shared occurrence: emit it and decrement the count so it cannot be matched again than it appears.",
      "This naturally produces min(c1, c2) copies: you can only emit a value as many times as the map allowed, and you only emit when the second array actually presents it.",
      "Counting is O(n), the matching walk is O(m), so O(n+m) time and O(min(n,m)) space for the map. If both arrays were sorted, a two-pointer merge would give O(1) extra space instead.",
    ],
    approaches: [
      {
        name: "Sort both then two-pointer merge",
        intuition: "Sort both arrays and advance two pointers, emitting equal values.",
        time: "O(n log n + m log m)",
        timeWhy: "Sorting dominates; the merge is linear.",
        space: "O(1)",
        spaceWhy: "Beyond the output, only two indices (sorting in place).",
        code: `int[] intersect(int[] nums1, int[] nums2) {
    Arrays.sort(nums1);
    Arrays.sort(nums2);
    List<Integer> out = new ArrayList<>();
    int i = 0, j = 0;
    while (i < nums1.length && j < nums2.length) {
        if (nums1[i] < nums2[j]) i++;
        else if (nums1[i] > nums2[j]) j++;
        else { out.add(nums1[i]); i++; j++; }
    }
    int[] res = new int[out.size()];
    for (int k = 0; k < res.length; k++) res[k] = out.get(k);
    return res;
}`,
      },
      {
        name: "Frequency map of the smaller array, then decrement (optimal)",
        intuition: "Count one array; for each value in the other, emit it while the count is positive and decrement.",
        time: "O(n + m)",
        timeWhy: "One pass to count, one pass to match.",
        space: "O(min(n, m))",
        spaceWhy: "A map over the distinct values of the smaller array.",
        code: `int[] intersect(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) return intersect(nums2, nums1);
    Map<Integer, Integer> count = new HashMap<>();
    for (int v : nums1) count.merge(v, 1, Integer::sum);
    List<Integer> out = new ArrayList<>();
    for (int v : nums2) {
        int remaining = count.getOrDefault(v, 0);
        if (remaining > 0) {
            out.add(v);
            count.put(v, remaining - 1); // consume one matched occurrence
        }
    }
    int[] res = new int[out.size()];
    for (int k = 0; k < res.length; k++) res[k] = out.get(k);
    return res;
}`,
        walkthrough: [
          "nums1=[1,2,2,1], nums2=[2,2]. nums1 is not larger, so count it: {1:2, 2:2}.",
          "Walk nums2: first 2 → remaining 2>0, emit 2, count 2→1. Second 2 → remaining 1>0, emit 2, count 2→0.",
          "Result [2,2].",
        ],
      },
    ],
    edgeCases: [
      "No common values → empty result.",
      "A value common but with different counts → it appears min(count1, count2) times.",
      "Duplicates within one array but absent in the other → contribute nothing.",
    ],
    twists: [
      "**Intersection of Two Arrays** (in the library) → the set version where each common value appears exactly once.",
      "**nums2 is a huge stream on disk** → counting the small array and scanning the stream once is the memory-friendly choice.",
      "**Both already sorted** → the two-pointer merge avoids the hash map entirely for O(1) extra space.",
    ],
    related: ["intersection-of-two-arrays", "two-sum", "single-number"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "reverse-only-letters",
    title: "Reverse Only Letters",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 917,
    statement:
      "Given a string `s`, reverse the string but keep all **non-letter** characters in their original positions, returning the result. Only English letters are moved.",
    examples: [
      { in: 's = "ab-cd"', out: '"dc-ba"', explanation: "letters a,b,c,d reverse to d,c,b,a; the dash stays put" },
      { in: 's = "a-bC-dEf-ghIj"', out: '"j-Ih-gfE-dCba"', explanation: "letters reverse around the fixed dashes" },
      { in: 's = "Test1ng-Leet=code-Q!"', out: '"Qedo1ct-eeLg=ntse-T!"', explanation: "digits and symbols stay in place" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s has ASCII characters in the range [33, 122]", "s has no backslash or double quote"],
    recognize:
      "Reversing only some characters while pinning the rest is the **converging two-pointer swap** pattern: a left and right pointer skip non-letters and swap the letters they land on, meeting in the middle.",
    figureItOut: [
      "Non-letter characters never move, so think of the letters as a separate sequence laid over fixed slots. Reversing that letter sequence means the first letter swaps with the last, second with second-last, and so on.",
      "Two pointers, one from each end, drive this. But each pointer must SKIP any non-letter so it only ever points at a letter — the non-letters are inert anchors.",
      "When both pointers sit on letters and left is still left of right, swap those two letters. That is one matched pair of the reversal, placed correctly in the final order.",
      "After a swap, move both pointers inward and repeat the skip-then-swap. When the pointers cross, every letter pair has been placed and the non-letters were never touched.",
      "Each character is visited at most once by each pointer, so it is O(n) time. Working on a mutable char array gives O(n) output with O(1) extra working space.",
    ],
    approaches: [
      {
        name: "Converging two pointers skipping non-letters (optimal)",
        intuition: "Left and right pointers skip non-letters and swap the letters they meet, moving inward until they cross.",
        time: "O(n)",
        timeWhy: "Each pointer scans the string once.",
        space: "O(n)",
        spaceWhy: "A mutable char array of the string (O(1) beyond the required output).",
        code: `String reverseOnlyLetters(String s) {
    char[] a = s.toCharArray();
    int left = 0, right = a.length - 1;
    while (left < right) {
        if (!Character.isLetter(a[left])) { left++; continue; }
        if (!Character.isLetter(a[right])) { right--; continue; }
        char tmp = a[left];      // both are letters, swap them
        a[left] = a[right];
        a[right] = tmp;
        left++;
        right--;
    }
    return new String(a);
}`,
        walkthrough: [
          's="ab-cd". left=0 (a), right=4 (d): both letters → swap → "db-ca", left=1,right=3.',
          'left=1 (b), right=3 (c): swap → "dc-ba", left=2,right=2. Pointer at index 2 is "-"; left not < right after.',
          'Result "dc-ba".',
        ],
      },
    ],
    edgeCases: [
      "String with no letters → nothing swaps, returned unchanged.",
      "String with only letters → a full reversal.",
      "A non-letter exactly in the middle → both pointers skip past it and meet/cross without swapping it.",
    ],
    twists: [
      "**Reverse String** (in the library) → the same swap with no skipping, since every character moves.",
      "**Reverse Vowels of a String** (in the library) → identical pattern but the 'movable' set is vowels instead of letters.",
      "**Reverse words while keeping spaces fixed** → group by word boundaries rather than single characters.",
    ],
    related: ["reverse-string", "valid-palindrome", "two-sum-ii"],
  },

  {
    slug: "number-of-subsequences-that-satisfy-the-given-sum-condition",
    title: "Number of Subsequences That Satisfy the Given Sum Condition",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 1498,
    statement:
      "You are given an array `nums` and an integer `target`. Return the number of non-empty **subsequences** of `nums` such that the sum of the **minimum** and **maximum** element in the subsequence is `<= target`. Because the answer can be large, return it **modulo 10^9 + 7**.",
    examples: [
      { in: "nums = [3,5,6,7], target = 9", out: "4", explanation: "valid subsequences: [3],[3,5],[3,5,6],[3,6] (min+max ≤ 9)" },
      { in: "nums = [3,3,6,8], target = 10", out: "6", explanation: "the two 3s create extra valid subsequences" },
      { in: "nums = [2,3,3,4,6,7], target = 12", out: "61", explanation: "many subsequences qualify; counted with powers of two" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "1 ≤ nums[i] ≤ 10^6", "1 ≤ target ≤ 10^6"],
    recognize:
      "Only the min and max of a subsequence matter, and a subsequence's order is irrelevant — that means **sort, then a converging two-pointer count**, where a valid (min,max) pair contributes a power-of-two number of subsequences.",
    figureItOut: [
      "The condition only involves the minimum and maximum element, never the middle ones. Since picking elements ignores order, SORT the array first — then for a chosen pair of boundary values, every element between them can be freely included or not.",
      "After sorting, fix the smallest element of a subsequence at index left. The subsequence is valid iff its maximum, the largest element it contains, satisfies nums[left] + max <= target. The biggest allowable max is at the largest right with nums[left] + nums[right] <= target.",
      "For that left and the largest valid right, ALL elements strictly between left and right can be included or excluded independently while left stays the min and the max never exceeds nums[right]. That is 2^(right-left) subsequences (the boundaries are forced/free in a way that collapses to this count, with left always present).",
      "Use two converging pointers: if nums[left] + nums[right] <= target, every subsequence anchored at left with max up to nums[right] is valid → add 2^(right-left), then advance left to consider the next smallest anchor. Otherwise nums[right] is too big with this left, so decrement right.",
      "Precompute powers of two modulo 1e9+7 to make each addition O(1). Sorting is O(n log n), the two-pointer sweep is O(n) → O(n log n) time, O(n) space for the power table.",
    ],
    approaches: [
      {
        name: "Sort + converging two pointers with power-of-two counts (optimal)",
        intuition: "Sort; for each smallest element, count subsequences whose max keeps the sum within target as 2^(gap), moving pointers inward.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the two-pointer sweep is linear.",
        space: "O(n)",
        spaceWhy: "A precomputed table of powers of two modulo the prime.",
        code: `int numSubseq(int[] nums, int target) {
    int mod = 1_000_000_007;
    int n = nums.length;
    Arrays.sort(nums);
    int[] pow = new int[n];
    pow[0] = 1;
    for (int i = 1; i < n; i++) pow[i] = pow[i - 1] * 2 % mod;
    int left = 0, right = n - 1;
    long count = 0;
    while (left <= right) {
        if (nums[left] + nums[right] <= target) {
            count = (count + pow[right - left]) % mod; // 2^(gap) subsequences
            left++;                                    // next smallest anchor
        } else {
            right--;                                   // max too large, shrink
        }
    }
    return (int) count;
}`,
        walkthrough: [
          "nums sorted=[3,5,6,7], target=9. left=0(3), right=3(7): 3+7=10>9 → right=2.",
          "left=0(3), right=2(6): 3+6=9<=9 → add 2^(2-0)=4, left=1. left=1(5),right=2(6): 5+6=11>9 → right=1. left=1(5),right=1(5): 5+5=10>9 → right=0. left>right stop.",
          "Count = 4.",
        ],
      },
    ],
    edgeCases: [
      "No valid pair (smallest two elements already exceed target) → answer 0.",
      "All pairs valid (largest two sum within target) → every non-empty subsequence counts, totaling 2^n - 1.",
      "Duplicates → handled automatically because sorting and the power-of-two count treat equal values as distinct positions.",
    ],
    twists: [
      "**Two Sum II** (in the library) → the same sorted converging pointers, but searching for an exact pair sum.",
      "**Boats to Save People** (in the library) → sort then pair the lightest with the heaviest under a weight limit.",
      "**Count pairs with sum < target** → the simpler counting variant without the power-of-two subsequence blowup.",
    ],
    related: ["two-sum-ii", "boats-to-save-people", "3sum-smaller"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "subarrays-with-k-different-integers",
    title: "Subarrays with K Different Integers",
    difficulty: "Hard",
    pattern: "sliding-window",
    leetcode: 992,
    statement:
      "Given an integer array `nums` and an integer `k`, return the number of **good** subarrays of `nums`. A good subarray has **exactly** `k` distinct integers.",
    examples: [
      { in: "nums = [1,2,1,2,3], k = 2", out: "7", explanation: "subarrays with exactly 2 distinct: [1,2],[2,1],[1,2],[2,3],[1,2,1],[2,1,2],[1,2,1,2]" },
      { in: "nums = [1,2,1,3,4], k = 3", out: "3", explanation: "[1,2,1,3],[2,1,3],[1,3,4]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2·10^4", "1 ≤ nums[i], k ≤ nums.length"],
    recognize:
      "'Exactly k distinct' is the classic **atMost(k) − atMost(k−1)** sliding-window trick: counting subarrays with at most k distinct is a clean variable window, and subtracting the at-most-(k−1) count isolates exactly k.",
    figureItOut: [
      "Counting subarrays with EXACTLY k distinct directly is awkward — a window with too-many distinct must shrink, but you cannot tell when you have exactly k versus fewer in a single pass. So reframe it.",
      "Define atMost(k) = number of subarrays with AT MOST k distinct integers. That IS a clean sliding window: grow the right end, and whenever the distinct count exceeds k, shrink from the left until it is back within k.",
      "The key counting insight for atMost: when the window [left, right] is valid (at most k distinct), every subarray ENDING at right and starting anywhere in [left, right] is also valid. That adds (right - left + 1) subarrays for this right.",
      "Then exactly-k equals atMost(k) − atMost(k−1): every subarray counted in atMost(k) has at most k distinct, and subtracting those with at most k−1 leaves precisely those with exactly k.",
      "Each atMost call is one O(n) window pass (each element enters and leaves once) with a frequency map of size up to k. Two calls → O(n) time, O(k) space.",
    ],
    approaches: [
      {
        name: "atMost(k) minus atMost(k-1) via sliding window (optimal)",
        intuition: "Count subarrays with at most k distinct using a shrinking window, then subtract the at-most-(k-1) count to leave exactly k.",
        time: "O(n)",
        timeWhy: "Two linear window passes; each element enters and leaves each window once.",
        space: "O(k)",
        spaceWhy: "A frequency map bounded by the distinct-count limit.",
        code: `int subarraysWithKDistinct(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

// number of subarrays with at most k distinct integers
private int atMost(int[] nums, int k) {
    if (k < 0) return 0;
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, total = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() > k) {                 // too many distinct, shrink
            int leaving = nums[left++];
            if (count.merge(leaving, -1, Integer::sum) == 0) count.remove(leaving);
        }
        total += right - left + 1;                 // subarrays ending at right
    }
    return total;
}`,
        walkthrough: [
          "nums=[1,2,1,2,3], k=2. atMost(2): windows give totals 1+2+3+4+3=13 valid subarrays.",
          "atMost(1): each maximal single-value run contributes; total = 1+1+1+1+1+? = 6.",
          "Exactly 2 = 13 - 6 = 7.",
        ],
      },
    ],
    edgeCases: [
      "k larger than the number of distinct values in the array → no subarray has exactly k distinct → 0.",
      "k == 1 → counts subarrays that are runs of a single repeated value.",
      "All elements equal with k == 1 → every subarray qualifies → n*(n+1)/2.",
    ],
    twists: [
      "**Longest Substring with At Most K Distinct Characters** → uses the same atMost window but returns a length, not a count.",
      "**Binary Subarrays With Sum** (in the library) → the same atMost(sum) − atMost(sum−1) reframing on prefix sums.",
      "**Count Number of Nice Subarrays** (in the library) → exactly-k odd numbers solved by the identical at-most trick.",
    ],
    related: ["count-number-of-nice-subarrays", "binary-subarrays-with-sum", "longest-substring-without-repeating"],
  },

  {
    slug: "k-radius-subarray-averages",
    title: "K Radius Subarray Averages",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 2090,
    statement:
      "You are given an array `nums` and an integer `k`. Build an array `avgs` where `avgs[i]` is the average of the subarray centered at `i` with radius `k` (the `2k+1` elements from `i−k` to `i+k`), using integer division. If fewer than `2k+1` elements fit (the window goes out of bounds), `avgs[i] = -1`.",
    examples: [
      { in: "nums = [7,4,3,9,1,8,5,2,6], k = 3", out: "[-1,-1,-1,5,4,4,-1,-1,-1]", explanation: "only indices 3..5 have a full radius-3 window" },
      { in: "nums = [100000], k = 0", out: "[100000]", explanation: "radius 0 means the element itself" },
      { in: "nums = [8], k = 100000", out: "[-1]", explanation: "window cannot fit" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "0 ≤ nums[i], k ≤ 10^5"],
    recognize:
      "Averaging a **fixed-width** window (width 2k+1) at every center is a textbook **fixed-size sliding window** sum: maintain a running sum that adds the entering element and drops the leaving one as the window slides.",
    figureItOut: [
      "Every valid answer averages the SAME number of elements, 2k+1 — a fixed window width. So this is not a variable window; it slides one step at a time keeping its width constant.",
      "Recomputing each window's sum from scratch is O(n*k). Instead keep a running sum: when the window moves right by one, ADD the new rightmost element and SUBTRACT the one that just fell off the left. That makes each step O(1).",
      "An index i has a full window only if i-k >= 0 and i+k <= n-1, i.e. k <= i <= n-1-k. For all other indices the window overflows the array, so avgs[i] = -1. Initialize the whole answer to -1 and only fill the valid center range.",
      "Use a long for the running sum: with up to 2k+1 ~ 2*10^5 elements each up to 10^5, the sum can exceed a 32-bit int. The average is integer division of that long sum by (2k+1).",
      "Build the first valid window's sum once, then slide: at each center compute sum/(2k+1), then add the next entering element and drop the leaving one. O(n) time, O(1) extra space beyond the output.",
    ],
    approaches: [
      {
        name: "Fixed-size window running sum (optimal)",
        intuition: "Keep a running sum of the 2k+1 window; slide by adding the entering element and subtracting the leaving one, dividing for each valid center.",
        time: "O(n)",
        timeWhy: "Each element enters and leaves the running sum once.",
        space: "O(1)",
        spaceWhy: "Only the running sum, beyond the required output array.",
        code: `int[] getAverages(int[] nums, int k) {
    int n = nums.length;
    int[] avgs = new int[n];
    Arrays.fill(avgs, -1);
    int width = 2 * k + 1;
    if (width > n) return avgs;
    long sum = 0;
    for (int i = 0; i < width; i++) sum += nums[i]; // first full window
    for (int center = k; center + k < n; center++) {
        avgs[center] = (int) (sum / width);
        int leaving = center - k;        // element about to fall off the left
        int entering = center + k + 1;   // next element to bring in
        if (entering < n) {
            sum += nums[entering];
            sum -= nums[leaving];
        }
    }
    return avgs;
}`,
        walkthrough: [
          "nums=[7,4,3,9,1,8,5,2,6], k=3. width=7. First window indices 0..6 sum=7+4+3+9+1+8+5=37. center=3: 37/7=5.",
          "Slide: add nums[7]=2, drop nums[0]=7 → sum=32. center=4: 32/7=4. Slide: add nums[8]=6, drop nums[1]=4 → sum=34. center=5: 34/7=4.",
          "Result [-1,-1,-1,5,4,4,-1,-1,-1].",
        ],
      },
    ],
    edgeCases: [
      "Window width 2k+1 exceeds n → every index is -1.",
      "k == 0 → window is the single element, avgs equals nums.",
      "Large values where 2k+1 elements overflow int → accumulate the sum in a long.",
    ],
    twists: [
      "**Maximum Average Subarray I** (in the library) → fixed window sum, but tracking the maximum average instead of every center.",
      "**Sliding Window Maximum** (in the library) → a fixed window reporting the max rather than the average.",
      "**Prefix-sum array** → an alternative O(n) build allowing O(1) arbitrary-range averages.",
    ],
    related: ["maximum-average-subarray-i", "sliding-window-maximum", "maximum-sum-of-distinct-subarrays-with-length-k"],
  },

  {
    slug: "minimum-difference-between-highest-and-lowest-of-k-scores",
    title: "Minimum Difference Between Highest and Lowest of K Scores",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 1984,
    statement:
      "You are given an array `nums` where `nums[i]` is the score of the i-th student, and an integer `k`. Pick any `k` students so that the **difference between the highest and lowest** of the chosen `k` scores is **minimized**. Return that minimum difference.",
    examples: [
      { in: "nums = [90], k = 1", out: "0", explanation: "one student → difference is 0" },
      { in: "nums = [9,4,1,7], k = 2", out: "2", explanation: "picking 9 and 7 gives the smallest gap, 2" },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 1000", "0 ≤ nums[i] ≤ 10^5"],
    recognize:
      "Minimizing the spread of any chosen k values means the best group is **k CONSECUTIVE values once sorted** — so sort, then slide a fixed window of width k and take the smallest last-minus-first gap.",
    figureItOut: [
      "The difference only depends on the chosen group's max and min. To make max − min small, the k chosen scores should be as close together as possible — and 'close together' is most visible after SORTING.",
      "Once sorted, any optimal group of k must be k CONSECUTIVE entries. Why: if your chosen k values had a gap (skipped some value lying between your min and max), swapping an extreme for that skipped middle value never increases the spread. So consecutive runs dominate.",
      "In a sorted array, a run of k consecutive values from index i to i+k−1 has spread nums[i+k−1] − nums[i] — the last minus the first, since sorting makes those the max and min of the run.",
      "So slide a fixed window of width k across the sorted array and take the minimum of nums[i+k−1] − nums[i] over all starting positions i. That is the answer.",
      "Sorting is O(n log n); the slide is O(n). k == 1 is a special clean case: a single student always has spread 0. Time O(n log n), space O(1) beyond the sort.",
    ],
    approaches: [
      {
        name: "Sort then slide a fixed window of width k (optimal)",
        intuition: "After sorting, the tightest k values are consecutive; scan all length-k windows for the smallest last-minus-first gap.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the window scan is linear.",
        space: "O(1)",
        spaceWhy: "Sorting in place; only a running minimum.",
        code: `int minimumDifference(int[] nums, int k) {
    if (k == 1) return 0;
    Arrays.sort(nums);
    int best = Integer.MAX_VALUE;
    for (int i = 0; i + k - 1 < nums.length; i++) {
        int diff = nums[i + k - 1] - nums[i]; // max minus min of this run
        best = Math.min(best, diff);
    }
    return best;
}`,
        walkthrough: [
          "nums=[9,4,1,7], k=2. Sort → [1,4,7,9]. Windows of width 2: [1,4] diff 3, [4,7] diff 3, [7,9] diff 2.",
          "Minimum diff = 2 (choosing 7 and 9).",
          "Return 2.",
        ],
      },
    ],
    edgeCases: [
      "k == 1 → a single chosen score has zero spread → answer 0.",
      "k == nums.length → only one window, the answer is max − min of the whole array.",
      "Duplicate scores → a window of equal values gives spread 0, the global minimum.",
    ],
    twists: [
      "**Maximum Sum of Distinct Subarrays With Length K** (in the library) → a fixed-width window after a different setup, summing instead of measuring spread.",
      "**Minimize the maximum of k − m gap** → variants change what is minimized over the consecutive run.",
      "**Partition Array Into Two Arrays to Minimize Sum Difference** → a harder relative requiring meet-in-the-middle rather than a simple slide.",
    ],
    related: ["maximum-sum-of-distinct-subarrays-with-length-k", "maximum-average-subarray-i", "two-sum"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "minimum-string-length-after-removing-substrings",
    title: "Minimum String Length After Removing Substrings",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 2696,
    statement:
      'You are given a string `s` of uppercase letters. You may repeatedly remove any occurrence of the substring "AB" or "CD". Each removal may create new "AB" or "CD" pairs, which you may also remove. Return the **minimum possible length** of `s` after performing such removals.',
    examples: [
      { in: 's = "ABFCACDB"', out: "2", explanation: 'remove AB, then CD, then the new AB; left with "FC"' },
      { in: 's = "ACBBD"', out: "5", explanation: "no AB or CD present, nothing removable" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s consists of uppercase English letters"],
    recognize:
      "Repeatedly cancelling an adjacent pair where each removal can expose a NEW adjacent pair is the signature of a **stack**: push characters, and pop when the top plus the incoming character form a removable pair.",
    figureItOut: [
      'Removing "AB" or "CD" can make the characters that were on either side become adjacent, possibly forming a new removable pair. That cascading adjacency is exactly what a stack models: the stack top is the character immediately to the left of the one you are about to place.',
      'Process the string left to right. Before pushing the current character c, look at the stack top t. If t and c form a removable pair — t==A and c==B, or t==C and c==D — then they cancel: pop t and do NOT push c.',
      "Popping t exposes whatever was beneath it as the new top, which now sits adjacent to the next character — so the next comparison naturally handles cascades without any rescanning.",
      "If the top and c do not form a removable pair (or the stack is empty), push c. The stack always holds the irreducible string built so far.",
      "After processing every character, the stack size IS the minimum length, since you have greedily removed every pair the moment it could form. Each character is pushed and popped at most once → O(n) time, O(n) stack space.",
    ],
    approaches: [
      {
        name: "Stack cancelling removable pairs (optimal)",
        intuition: "Push characters; when the top and the incoming character form AB or CD, pop instead of pushing, letting cascades resolve naturally.",
        time: "O(n)",
        timeWhy: "Each character is pushed and popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack of surviving characters.",
        code: `int minLength(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (!stack.isEmpty()
                && ((stack.peek() == 'A' && c == 'B')
                 || (stack.peek() == 'C' && c == 'D'))) {
            stack.pop();           // cancel the removable pair
        } else {
            stack.push(c);
        }
    }
    return stack.size();
}`,
        walkthrough: [
          's="ABFCACDB". A push [A]; B cancels A → []; F push [F]; C push [F,C]; A push [F,C,A]; C push [F,C,A,C]; D cancels C → [F,C,A]; B cancels A → [F,C].',
          "Stack holds F,C → size 2.",
          "Minimum length = 2.",
        ],
      },
    ],
    edgeCases: [
      "No removable pair anywhere → the stack equals the whole string → length unchanged.",
      "Entire string cancels (e.g. interleaved pairs) → stack empties → length 0.",
      "A removal exposing a new pair beneath → handled because popping re-exposes the prior top.",
    ],
    twists: [
      "**Remove All Adjacent Duplicates In String** (in the library) → the same cancel-on-top stack, removing equal adjacent letters.",
      "**Make The String Great** (in the library) → cancel adjacent letters that differ only in case.",
      "**Removable pairs given as a set** → generalize the two hardcoded pairs to a lookup table.",
    ],
    related: ["remove-all-adjacent-duplicates-in-string", "make-the-string-great", "asteroid-collision"],
  },

  {
    slug: "final-prices-with-a-special-discount-in-a-shop",
    title: "Final Prices With a Special Discount in a Shop",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 1475,
    statement:
      "You are given an array `prices` where `prices[i]` is the price of the i-th item. There is a special discount: if you buy item `i`, you receive a discount equal to `prices[j]` where `j` is the **smallest index** with `j > i` and `prices[j] <= prices[i]`; if no such `j` exists there is no discount. Return an array where each element is the final price after discount.",
    examples: [
      { in: "prices = [8,4,6,2,3]", out: "[4,2,4,2,3]", explanation: "8 is discounted by 4, 4 by 2, 6 by 2... wait the next ≤ value: 8→4, 4→2, 6→2? next ≤6 is 2, so 6→4; 2 and 3 no later ≤ value" },
      { in: "prices = [1,2,3,4,5]", out: "[1,2,3,4,5]", explanation: "prices only increase, so no item finds a later cheaper-or-equal one" },
      { in: "prices = [10,1,1,6]", out: "[9,0,1,6]", explanation: "10 discounted by 1, first 1 discounted by the next 1" },
    ],
    constraints: ["1 ≤ prices.length ≤ 500", "1 ≤ prices[i] ≤ 1000"],
    recognize:
      "'For each item, the next element to its right that is <= it' is a **monotonic stack** finding the next-smaller-or-equal element in one pass — the discount is that element's value.",
    figureItOut: [
      "For each item i you need the FIRST later item that is less than or equal to prices[i]. That 'next element to the right satisfying a comparison' is the canonical next-smaller-element query, which a monotonic stack answers in linear time.",
      "Keep a stack of INDICES whose discount is still unknown, kept so their prices are non-increasing from bottom to top. When a new price arrives, it might be the discount for the items waiting on the stack.",
      "On reaching index j: while the stack is non-empty and the price at the top index is >= prices[j], this prices[j] is exactly that top item's next-smaller-or-equal value. Pop it and set its final price to prices[top] − prices[j].",
      "After resolving everyone it can, push j onto the stack to wait for ITS own future discount. Items still on the stack at the end never found a qualifying later item, so their final price is unchanged.",
      "Each index is pushed and popped at most once → O(n) time, O(n) stack space. The >= comparison (not strict) honors the 'prices[j] <= prices[i]' tie rule, letting an equal later price serve as the discount.",
    ],
    approaches: [
      {
        name: "Brute force look-ahead",
        intuition: "For each i scan forward for the first price <= prices[i].",
        time: "O(n^2)",
        timeWhy: "Each item may scan the whole remaining array.",
        space: "O(1)",
        spaceWhy: "Output aside, only loop variables.",
        code: `int[] finalPrices(int[] prices) {
    int n = prices.length;
    int[] res = prices.clone();
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (prices[j] <= prices[i]) { res[i] = prices[i] - prices[j]; break; }
        }
    }
    return res;
}`,
      },
      {
        name: "Monotonic stack for next-smaller-or-equal (optimal)",
        intuition: "Keep indices waiting for a discount on a non-increasing stack; the current price discounts every waiting item it is <= to.",
        time: "O(n)",
        timeWhy: "Each index is pushed and popped at most once.",
        space: "O(n)",
        spaceWhy: "A stack of pending indices.",
        code: `int[] finalPrices(int[] prices) {
    int n = prices.length;
    int[] res = prices.clone();
    Deque<Integer> stack = new ArrayDeque<>();
    for (int j = 0; j < n; j++) {
        while (!stack.isEmpty() && prices[stack.peek()] >= prices[j]) {
            int i = stack.pop();              // j is i's next <= price
            res[i] = prices[i] - prices[j];
        }
        stack.push(j);
    }
    return res;
}`,
        walkthrough: [
          "prices=[10,1,1,6]. j=0 push [0]. j=1: prices[0]=10>=1 → pop 0, res[0]=10-1=9; push [1].",
          "j=2: prices[1]=1>=1 → pop 1, res[1]=1-1=0; push [2]. j=3: prices[2]=1>=6? no → push [2,3]. End: indices 2,3 unresolved keep their prices.",
          "Result [9,0,1,6].",
        ],
      },
    ],
    edgeCases: [
      "Strictly increasing prices → no item finds a later <= price → output equals input.",
      "Equal adjacent prices → the >= comparison lets an equal later price act as the discount (zero final price).",
      "Last item → never has a later element → unchanged.",
    ],
    twists: [
      "**Daily Temperatures** (in the library) → next-GREATER element returning the index distance instead of a value.",
      "**Next Greater Element I** (in the library) → the mirrored monotonic-stack query for the next larger value.",
      "**Online Stock Span** (in the library) → a monotonic stack accumulating a span as elements stream in.",
    ],
    related: ["daily-temperatures", "next-greater-element-i", "online-stock-span"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "special-array-with-x-elements-greater-than-or-equal-x",
    title: "Special Array With X Elements Greater Than or Equal X",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 1608,
    statement:
      "An array `nums` is **special** if there exists a number `x` such that **exactly** `x` numbers in `nums` are **greater than or equal to** `x`. Return that `x` (it is unique if it exists), or `-1` if no such `x` exists.",
    examples: [
      { in: "nums = [3,5]", out: "2", explanation: "exactly 2 numbers (3 and 5) are ≥ 2" },
      { in: "nums = [0,0]", out: "-1", explanation: "no x works: 0 numbers are ≥ any positive x, etc." },
      { in: "nums = [0,4,3,0,4]", out: "3", explanation: "exactly 3 numbers (4,3,4) are ≥ 3" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "0 ≤ nums[i] ≤ 1000"],
    recognize:
      "Define f(x) = count of elements >= x; f is **non-increasing** in x, so the equation f(x) = x has a monotone structure searchable by **binary search** (or, after sorting, located directly).",
    figureItOut: [
      "Let f(x) = how many elements are >= x. As x grows, fewer elements clear the bar, so f(x) is NON-INCREASING. Meanwhile the line y = x is strictly increasing. Two monotone curves crossing means at most one integer x can satisfy f(x) = x — that is why the answer is unique.",
      "x cannot exceed n (there are only n elements, so at most n can be >= x). So the candidate x lies in [0, n]. You could just test every x in that range with an O(n) count each: O(n^2), fine for small n but improvable.",
      "Sort nums ascending. Then 'count of elements >= x' is n minus the first index whose value is >= x — a position found by binary search. So f(x) becomes an O(log n) query.",
      "Better still after sorting: for each index i, the number of elements from i to the end is n − i, and those are the n − i largest. If a value at the boundary makes nums[i] >= (n − i) while the element just before is smaller (or i is 0), then x = n − i is special. This is a single sorted scan.",
      "Either route is O(n log n) with the sort (or O(n^2) brute). Watch the boundary: x must be strictly greater than the value just below the cutoff so that exactly n − i elements (not more) are >= x.",
    ],
    approaches: [
      {
        name: "Try every candidate x in [0, n]",
        intuition: "For each x from 0 to n, count elements >= x and check it equals x.",
        time: "O(n^2)",
        timeWhy: "n+1 candidates, each counted in O(n).",
        space: "O(1)",
        spaceWhy: "Only counters.",
        code: `int specialArray(int[] nums) {
    int n = nums.length;
    for (int x = 0; x <= n; x++) {
        int count = 0;
        for (int v : nums) if (v >= x) count++;
        if (count == x) return x;
    }
    return -1;
}`,
      },
      {
        name: "Sort then binary search the count for each x (optimal)",
        intuition: "f(x)=count of elements >= x is non-increasing; sort and binary-search the boundary, scanning x for f(x)==x.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; each of the n+1 counts is an O(log n) binary search.",
        space: "O(1)",
        spaceWhy: "Sorting in place; only counters.",
        code: `int specialArray(int[] nums) {
    Arrays.sort(nums);
    int n = nums.length;
    for (int x = 0; x <= n; x++) {
        int idx = lowerBound(nums, x);   // first index with nums[idx] >= x
        int countAtLeastX = n - idx;
        if (countAtLeastX == x) return x;
    }
    return -1;
}

// first index i with a[i] >= target, or a.length if none
private int lowerBound(int[] a, int target) {
    int lo = 0, hi = a.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
        walkthrough: [
          "nums=[0,4,3,0,4] → sort [0,0,3,4,4], n=5. x=3: lowerBound(3)=2 (first value >=3 is index 2), count = 5-2 = 3 == x → return 3.",
          "Earlier x values: x=0 count 5 (no), x=1 count 3 (no), x=2 count 3 (no), x=3 count 3 (yes).",
          "Return 3.",
        ],
      },
    ],
    edgeCases: [
      "All zeros → no positive x has that many elements >= it, and x=0 needs 0 elements >= 0 which is false (all n are >= 0) → -1.",
      "x can equal n only if every element is >= n.",
      "Unique answer guaranteed by the monotone crossing, so the first match can be returned.",
    ],
    twists: [
      "**H-Index II** (in the library) → the same 'x papers with >= x citations' threshold on a sorted array via binary search.",
      "**Count elements >= x as a frequency-bucket histogram** → an O(n) counting-sort alternative since values are bounded.",
      "**Strictly greater than x variant** → flip >= to > and the boundary search adjusts accordingly.",
    ],
    related: ["h-index-ii", "binary-search", "search-insert-position"],
  },

  {
    slug: "cutting-ribbons",
    title: "Cutting Ribbons",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1891,
    statement:
      "You are given an array `ribbons` where `ribbons[i]` is the length of the i-th ribbon, and an integer `k`. You may cut each ribbon into any number of pieces of **positive integer** lengths (or leave it whole), but you cannot join ribbons. You want `k` pieces that are **all the same length**. Return the **maximum** such length, or `0` if you cannot make `k` pieces.",
    examples: [
      { in: "ribbons = [9,7,5], k = 3", out: "5", explanation: "cut to length 5: 9→one piece of 5, 7→one piece of 5, 5→one piece of 5 = 3 pieces" },
      { in: "ribbons = [7,5,9], k = 4", out: "4", explanation: "length 4: 7→1, 5→1, 9→2 = 4 pieces" },
      { in: "ribbons = [5,7,9], k = 22", out: "0", explanation: "even length 1 gives only 21 pieces; impossible" },
    ],
    constraints: ["1 ≤ ribbons.length ≤ 10^5", "1 ≤ ribbons[i] ≤ 10^5", "1 ≤ k ≤ 10^9"],
    recognize:
      "'Maximum piece length yielding at least k pieces' is **binary search on the answer**: the number of pieces a length produces is monotonically non-increasing as the length grows, so search the largest length still giving >= k pieces.",
    figureItOut: [
      "Fix a candidate piece length L. A ribbon of length r yields floor(r / L) pieces of length L (the remainder is waste). Summing floor(ribbons[i] / L) over all ribbons gives the total pieces achievable at length L.",
      "That total is MONOTONIC: as L increases, each floor(r / L) can only stay the same or drop, so the total piece count is non-increasing in L. Therefore feasibility ('can we get >= k pieces') flips from true to false at one threshold length — perfect for binary search.",
      "The answer L lies in [1, max(ribbons)]: a piece longer than the longest ribbon yields nothing. So binary-search L over that range, computing the piece count for each candidate.",
      "If a candidate L gives >= k pieces, it is feasible — record it and try a LARGER L (we want the maximum). If it gives fewer than k, L is too long, so search smaller. When the range collapses, the best recorded feasible length is the answer; if none was feasible (even L=1 falls short), return 0.",
      "Each feasibility check sums floor over n ribbons in O(n); binary search runs O(log(maxLen)) times → O(n log(maxLen)) time, O(1) space. Use long for the piece-count sum since k can be up to 10^9.",
    ],
    approaches: [
      {
        name: "Binary search on the piece length + count feasibility (optimal)",
        intuition: "Piece count is non-increasing in the length; binary-search the largest length producing at least k pieces.",
        time: "O(n log(maxLen))",
        timeWhy: "An O(n) piece-count sum inside a binary search over the length range.",
        space: "O(1)",
        spaceWhy: "Only counters and bounds.",
        code: `int maxLength(int[] ribbons, int k) {
    int hi = 0;
    for (int r : ribbons) hi = Math.max(hi, r);
    int lo = 1, answer = 0;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (pieces(ribbons, mid) >= k) {
            answer = mid;     // feasible, try a longer length
            lo = mid + 1;
        } else {
            hi = mid - 1;     // too long, shorten
        }
    }
    return answer;
}

// total pieces of length L obtainable from all ribbons
private long pieces(int[] ribbons, int L) {
    long total = 0;
    for (int r : ribbons) total += r / L;
    return total;
}`,
        walkthrough: [
          "ribbons=[9,7,5], k=3. Range [1,9]. mid=5: 9/5+7/5+5/5 = 1+1+1 = 3 >= 3 → feasible, answer=5, lo=6.",
          "mid=7: 9/7+7/7+5/7 = 1+1+0 = 2 < 3 → too long, hi=6. mid=6: 1+1+0 = 2 < 3 → hi=5. lo>hi stop.",
          "Answer = 5.",
        ],
      },
    ],
    edgeCases: [
      "Even length 1 yields fewer than k pieces (sum of ribbons < k) → return 0.",
      "k == total length sum → the answer is 1 (every unit becomes a piece).",
      "Piece-count sum can exceed int when k is near 10^9 → accumulate in a long.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary search on a rate with a monotonic O(n) feasibility sum.",
      "**Minimum Number of Days to Make m Bouquets** (in the library) → the same search-the-answer scaffold with a greedy check.",
      "**Maximize minimum piece while minimizing waste** → adds a secondary objective beyond the piece count.",
    ],
    related: ["koko-eating-bananas", "minimum-number-of-days-to-make-m-bouquets", "binary-search"],
  },
];
