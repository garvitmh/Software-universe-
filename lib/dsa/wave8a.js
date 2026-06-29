// NeetCode All — wave 8a (arrays-hashing, two-pointers, sliding-window, stack). Java.
export const WAVE8A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "contiguous-array",
    title: "Contiguous Array",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 525,
    statement:
      "Given a binary array `nums` (only 0s and 1s), return the length of the **longest contiguous subarray** with an **equal number of 0s and 1s**.",
    examples: [
      { in: "nums = [0,1]", out: "2", note: "the whole array has one 0 and one 1" },
      { in: "nums = [0,1,0]", out: "2", note: '"[0,1]" or "[1,0]"' },
      { in: "nums = [0,1,1,1,1,1,0,0,0]", out: "6", note: "three 1s balance three 0s" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "nums[i] is 0 or 1"],
    recognize:
      "'Longest subarray with **equal counts**' is the classic **prefix-sum + hash map** trick. Turn 0 into −1 so 'equal 0s and 1s' becomes 'sum is 0', then a repeated running sum marks a zero-sum stretch between two positions.",
    figureItOut: [
      "Brute force: for every start i, walk forward tracking (count of 1s − count of 0s); whenever it hits 0 the subarray is balanced. That's O(n²). Correct — now find the redundancy.",
      "Rewrite the problem so counting is one number. Treat every 0 as **−1** and every 1 as **+1**. Now 'equal 0s and 1s' is exactly 'the slice sums to 0'.",
      "Take the **running prefix sum**. A slice (i..j] sums to zero precisely when the prefix sum at j equals the prefix sum at i. So two positions with the **same prefix sum** sandwich a balanced subarray.",
      "So remember the **earliest index** at which each prefix-sum value first appeared. When you see that value again at index r, the balanced length is `r − firstIndex`. Keep the maximum.",
      "Seed the map with sum 0 at index −1, so a balanced prefix that starts at the very beginning is measured correctly.",
    ],
    approaches: [
      {
        name: "Brute force — every subarray",
        intuition: "Try every start, extend, and track the running balance.",
        time: "O(n²)",
        timeWhy: "n starts, each extending up to n elements.",
        space: "O(1)",
        spaceWhy: "Just a running counter.",
        code: `int findMaxLength(int[] nums) {
    int best = 0;
    for (int i = 0; i < nums.length; i++) {
        int balance = 0;
        for (int j = i; j < nums.length; j++) {
            balance += (nums[j] == 1) ? 1 : -1;
            if (balance == 0) best = Math.max(best, j - i + 1);
        }
    }
    return best;
}`,
      },
      {
        name: "Prefix sum + first-seen index (optimal)",
        intuition: "Map each running sum to the first index it appeared; a repeat means the slice between them is balanced.",
        time: "O(n)",
        timeWhy: "One pass; each map get/put is O(1) average.",
        space: "O(n)",
        spaceWhy: "The map can hold up to n distinct prefix-sum values.",
        code: `int findMaxLength(int[] nums) {
    Map<Integer, Integer> firstIndex = new HashMap<>();
    firstIndex.put(0, -1);                 // empty prefix has sum 0 at index -1
    int sum = 0, best = 0;
    for (int i = 0; i < nums.length; i++) {
        sum += (nums[i] == 1) ? 1 : -1;
        if (firstIndex.containsKey(sum)) {
            best = Math.max(best, i - firstIndex.get(sum));
        } else {
            firstIndex.put(sum, i);        // only the EARLIEST index matters
        }
    }
    return best;
}`,
        walkthrough: [
          "nums=[0,1,0] → as ±1: [-1,+1,-1]. map={0:-1}.",
          "i=0 sum=-1 new → put {-1:0}. i=1 sum=0 seen at -1 → best=1-(-1)=2.",
          "i=2 sum=-1 seen at 0 → best=max(2, 2-0)=2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "All same value (e.g. [1,1,1]) → never balanced → 0.",
      "Storing only the FIRST index of each sum is essential — a later index would shrink the answer.",
      "The seed `{0:-1}` is what lets a balanced prefix starting at index 0 count.",
    ],
    twists: [
      "**Subarray sum equals k** (LeetCode 560) → same prefix-sum-in-a-map idea, but count occurrences instead of tracking first index.",
      "**Longest subarray with equal 0s, 1s and 2s** → key the map on the pair of differences (d01, d12).",
      "**Maximum size subarray summing to k** (LeetCode 325) → identical structure with real values instead of ±1.",
    ],
    related: ["subarray-sum-equals-k", "two-sum"],
  },

  {
    slug: "4sum-ii",
    title: "4Sum II",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 454,
    statement:
      "Given four integer arrays `a`, `b`, `c`, `d` all of length n, count the number of tuples `(i, j, k, l)` such that `a[i] + b[j] + c[k] + d[l] == 0`.",
    examples: [
      {
        in: "a=[1,2], b=[-2,-1], c=[-1,2], d=[0,2]",
        out: "2",
        note: "(0,0,0,1): 1+(-2)+(-1)+2=0 and (1,1,0,0): 2+(-1)+(-1)+0=0",
      },
      { in: "a=[0], b=[0], c=[0], d=[0]", out: "1" },
    ],
    constraints: ["n == a.length == b.length == c.length == d.length", "1 ≤ n ≤ 200", "−2²⁸ ≤ values ≤ 2²⁸"],
    recognize:
      "Four separate arrays and 'count tuples summing to 0' → **split in half and hash**. Precompute every pairwise sum of two arrays into a frequency map, then for each pair from the other two look up the negation. This is the meet-in-the-middle move.",
    figureItOut: [
      "Brute force tries every combination across the four arrays — n⁴. With n=200 that's 1.6 billion; too slow. Find a split.",
      "Split the four arrays into two halves: {a, b} and {c, d}. Any valid tuple is one pair-sum from the first half plus one pair-sum from the second half, totalling 0.",
      "Precompute every sum `a[i] + b[j]` and store **how many times** each sum value occurs in a hash map. That's n² sums.",
      "Now walk every pair `c[k] + d[l]`. The partner you need is `−(c[k] + d[l])`. Look it up in the map and add its count — each stored occurrence is one valid tuple.",
      "Two halves of n² work each → O(n²) total, a huge drop from n⁴.",
    ],
    approaches: [
      {
        name: "Brute force — four nested loops",
        intuition: "Try every (i,j,k,l).",
        time: "O(n⁴)",
        timeWhy: "Four independent loops of length n.",
        space: "O(1)",
        spaceWhy: "Just a counter.",
        code: `// Conceptual baseline — too slow for n up to 200.
// for i: for j: for k: for l: if a[i]+b[j]+c[k]+d[l]==0 count++;`,
      },
      {
        name: "Hash the pair-sums of two halves (optimal)",
        intuition: "Count all a+b sums in a map; for each c+d look up its negation.",
        time: "O(n²)",
        timeWhy: "n² to build the map of a+b sums, n² to probe with c+d sums.",
        space: "O(n²)",
        spaceWhy: "The map can hold up to n² distinct pair sums.",
        code: `int fourSumCount(int[] a, int[] b, int[] c, int[] d) {
    Map<Integer, Integer> ab = new HashMap<>();
    for (int x : a)
        for (int y : b)
            ab.merge(x + y, 1, Integer::sum);   // count of each a+b sum
    int count = 0;
    for (int x : c)
        for (int y : d)
            count += ab.getOrDefault(-(x + y), 0);
    return count;
}`,
        walkthrough: [
          "a=[1,2], b=[-2,-1] → ab sums: 1-2=-1, 1-1=0, 2-2=0, 2-1=1 → map={-1:1, 0:2, 1:1}.",
          "c=[-1,2], d=[0,2]: c+d sums -1,1,2,4. need negations 1,-1,-2,-4.",
          "sum -1 → need 1 → map has 1 → +1. sum 1 → need -1 → map has 1 → +1. total 2.",
        ],
      },
    ],
    edgeCases: [
      "All zeros → exactly one tuple counted (the empty-looking 0+0+0+0).",
      "Use `merge`/`getOrDefault` so missing keys default to 0 rather than throwing.",
      "Sums can exceed int? Each value ≤ 2²⁸, four of them ≤ 2³⁰ — fits in int, but be alert with wider inputs (use long).",
    ],
    twists: [
      "**Six arrays** → split 3-and-3, hash one triple-sum side.",
      "**Return the tuples, not the count** → store lists of index-pairs instead of counts (memory heavy).",
      "**Classic 4Sum on one array** (LeetCode 18) → different problem: sort + fix two + two pointers (see the 4Sum card).",
    ],
    related: ["two-sum", "subarray-sum-equals-k"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "squares-of-a-sorted-array",
    title: "Squares of a Sorted Array",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 977,
    statement:
      "Given an integer array `nums` **sorted in non-decreasing order**, return an array of the **squares of each number, also sorted** in non-decreasing order.",
    examples: [
      { in: "nums = [-4,-1,0,3,10]", out: "[0,1,9,16,100]" },
      { in: "nums = [-7,-3,2,3,11]", out: "[4,9,9,49,121]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−10⁴ ≤ nums[i] ≤ 10⁴", "nums is sorted non-decreasing"],
    recognize:
      "The input is **sorted** but squaring breaks the order — large magnitudes sit at **both ends** (very negative on the left, very positive on the right). Comparing the two ends → **two pointers**. Build the output from largest to smallest.",
    figureItOut: [
      "The lazy answer: square everything, then sort → O(n log n). It works, but it throws away the fact that the input was already sorted.",
      "Why is the sort needed at all? Because squaring a negative makes it positive, so the biggest squares come from the **most negative** (far left) and **most positive** (far right) values. The smallest squares are in the middle.",
      "That two-ends structure screams two pointers: `l` at the start, `r` at the end. Whichever has the larger **absolute value** produces the larger square.",
      "Fill the result **back to front** (largest square first), placing the bigger of `nums[l]²` and `nums[r]²` and moving that pointer inward. One pass, output already sorted.",
    ],
    approaches: [
      {
        name: "Square then sort",
        intuition: "Square each element, then sort the results.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort.",
        space: "O(n)",
        spaceWhy: "An output array (plus sort overhead).",
        code: `int[] sortedSquares(int[] nums) {
    int[] res = new int[nums.length];
    for (int i = 0; i < nums.length; i++) res[i] = nums[i] * nums[i];
    Arrays.sort(res);
    return res;
}`,
      },
      {
        name: "Two pointers, fill back to front (optimal)",
        intuition: "The largest square is at one of the two ends; place it last and move that pointer in.",
        time: "O(n)",
        timeWhy: "Each element is consumed once as l rises or r falls.",
        space: "O(n)",
        spaceWhy: "The output array (no extra sorting structures).",
        code: `int[] sortedSquares(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    int l = 0, r = n - 1, pos = n - 1;
    while (l <= r) {
        int leftSq = nums[l] * nums[l];
        int rightSq = nums[r] * nums[r];
        if (leftSq > rightSq) {
            res[pos--] = leftSq;
            l++;
        } else {
            res[pos--] = rightSq;
            r--;
        }
    }
    return res;
}`,
        walkthrough: [
          "nums=[-4,-1,0,3,10]. l=-4(16), r=10(100) → 100 bigger → res[4]=100, r--.",
          "l=-4(16), r=3(9) → 16 bigger → res[3]=16, l++. l=-1(1), r=3(9) → 9 → res[2]=9, r--.",
          "l=-1(1), r=0(0) → 1 → res[1]=1, l++. l=0,r=0 → 0 → res[0]=0 → [0,1,9,16,100].",
        ],
      },
    ],
    edgeCases: [
      "All negatives (e.g. [-5,-3,-1]) → l pointer wins every comparison; output reverses their squares.",
      "All non-negatives → r pointer wins every time; squares are already sorted.",
      "Single element → just its square.",
    ],
    twists: [
      "**Merge two sorted arrays** → same back-to-front two-pointer fill (LeetCode 88).",
      "**Cubes of a sorted array** → cubing preserves sign order, so no two-pointer trick is needed.",
      "**Return only the k smallest squares** → still find the middle via two pointers, then take k from there.",
    ],
    related: ["3sum", "move-zeroes"],
  },

  {
    slug: "valid-palindrome-ii",
    title: "Valid Palindrome II",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 680,
    statement:
      "Given a string `s`, return `true` if it can be made a palindrome by **deleting at most one character**.",
    examples: [
      { in: 's = "aba"', out: "true", note: "already a palindrome, delete nothing" },
      { in: 's = "abca"', out: "true", note: 'delete "c" (or "b") → "aba"' },
      { in: 's = "abc"', out: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "lowercase English letters"],
    recognize:
      "It's the **two-pointer palindrome check** with one allowed repair. Walk both ends inward; on the **first** mismatch, you get one chance — try skipping the left char OR the right char and verify the rest.",
    figureItOut: [
      "Start from the plain palindrome check: `l` from the left, `r` from the right, compare and move inward. While characters match, keep going.",
      "The interesting moment is the **first mismatch** at (l, r). Your one deletion must fix it — and the only useful deletions are removing `s[l]` or removing `s[r]` (deleting anything else leaves this pair still mismatched).",
      "So branch: check whether the substring `s[l+1 .. r]` is a palindrome (that's deleting the left char), OR `s[l .. r-1]` is a palindrome (deleting the right char). If either is, the answer is true.",
      "Each branch is a simple two-pointer palindrome check with no more deletions allowed. You only ever branch once, so the whole thing is still O(n).",
    ],
    approaches: [
      {
        name: "Two pointers with one allowed skip (optimal)",
        intuition: "Match inward; at the first mismatch, try deleting the left char or the right char and verify the remainder.",
        time: "O(n)",
        timeWhy: "One inward sweep, plus at most one extra linear palindrome check on a subrange.",
        space: "O(1)",
        spaceWhy: "Only index variables; no copies of the string.",
        code: `boolean validPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l) != s.charAt(r)) {
            // one deletion allowed: skip left OR skip right
            return isPalindrome(s, l + 1, r) || isPalindrome(s, l, r - 1);
        }
        l++; r--;
    }
    return true;
}

boolean isPalindrome(String s, int l, int r) {
    while (l < r) {
        if (s.charAt(l) != s.charAt(r)) return false;
        l++; r--;
    }
    return true;
}`,
        walkthrough: [
          '"abca": l=a,r=a match → l=b,r=c mismatch.',
          'Try skip left → check "ca" (l+1..r): c!=a → false. Try skip right → check "ab" (l..r-1): a!=b → false?',
          'Recompute: skip right means range [l..r-1] = "bc" → b!=c false; skip left [l+1..r]="bc"? Actually for "abca" l=1,r=2: skip left→[2,2]="c" true → return true.',
        ],
      },
    ],
    edgeCases: [
      "Already a palindrome → no mismatch ever, return true (zero deletions used).",
      "Single char or empty → trivially true.",
      "Two mismatches that can't both be fixed → both branches fail → false.",
    ],
    twists: [
      "**Delete at most k characters** → this no longer reduces to two branches; use 2-D DP on (i, j) (longest palindromic subsequence).",
      "**Return WHICH index to delete** → record l or r when the satisfied branch is found.",
      "**Ignore non-alphanumerics / case** → add the same skipping/normalizing as Valid Palindrome I.",
    ],
    related: ["valid-palindrome", "3sum"],
  },

  {
    slug: "4sum",
    title: "4Sum",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 18,
    statement:
      "Given an array `nums` and a `target`, return **all unique quadruplets** `[a, b, c, d]` such that `a + b + c + d == target`. The solution set must not contain duplicate quadruplets.",
    examples: [
      { in: "nums = [1,0,-1,0,-2,2], target = 0", out: "[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]" },
      { in: "nums = [2,2,2,2,2], target = 8", out: "[[2,2,2,2]]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 200", "−10⁹ ≤ nums[i], target ≤ 10⁹"],
    recognize:
      "It's **3Sum with one more fixed number**. Sort, fix two indices with nested loops, then **two-pointer** the remaining pair for the leftover target. Sorting also makes duplicate-skipping at every level easy.",
    figureItOut: [
      "Brute force is four nested loops — O(n⁴) — plus a dedup headache. Generalize the 3Sum idea instead.",
      "Sort the array. Fix the first number with an outer loop `i`, fix the second with `j > i`. Now you only need **two more numbers** that sum to `target − nums[i] − nums[j]` — exactly the two-pointer sweep from 3Sum.",
      "That gives O(n²) pairs of (i, j), each with an O(n) two-pointer sweep → O(n³). Sorting is the cheap O(n log n) prerequisite.",
      "Duplicates are the trap, now at four levels. Skip a repeated `nums[i]`; skip a repeated `nums[j]` (only when `j > i + 1`); and after recording a quad, skip repeated l and r values.",
      "Use a **long** accumulator for the sum: four values up to 10⁹ can overflow a 32-bit int. This is the most-missed detail in 4Sum.",
    ],
    approaches: [
      {
        name: "Brute force — four loops",
        intuition: "Try every quadruplet, dedupe with a set.",
        time: "O(n⁴)",
        timeWhy: "Four nested loops over n.",
        space: "O(m)",
        spaceWhy: "A set of found quadruplets.",
        code: `// Conceptual baseline — too slow; shown for contrast.
// for i: for j>i: for k>j: for l>k: if sum==target add sorted quad to a Set.`,
      },
      {
        name: "Sort + fix two + two pointers (optimal)",
        intuition: "Sort. Nested loops fix the first two; two-pointer the rest for the remaining target; skip duplicates at each level.",
        time: "O(n³)",
        timeWhy: "Sorting is O(n log n); then O(n²) (i, j) pairs each with an O(n) two-pointer sweep → O(n³).",
        space: "O(1)",
        spaceWhy: "Ignoring the output and sort overhead, only pointers.",
        code: `List<List<Integer>> fourSum(int[] nums, int target) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;
    for (int i = 0; i < n - 3; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;       // skip dup first
        for (int j = i + 1; j < n - 2; j++) {
            if (j > i + 1 && nums[j] == nums[j - 1]) continue; // skip dup second
            int l = j + 1, r = n - 1;
            while (l < r) {
                long sum = (long) nums[i] + nums[j] + nums[l] + nums[r];
                if (sum < target) l++;
                else if (sum > target) r--;
                else {
                    res.add(Arrays.asList(nums[i], nums[j], nums[l], nums[r]));
                    l++; r--;
                    while (l < r && nums[l] == nums[l - 1]) l++; // skip dup l
                    while (l < r && nums[r] == nums[r + 1]) r--; // skip dup r
                }
            }
        }
    }
    return res;
}`,
        walkthrough: [
          "sorted=[-2,-1,0,0,1,2], target 0. i=-2, j=-1 → need 3 from pair; l=0,r=2 → -2-1+0+2=-1<0 l++; -2-1+0+2 ... finds [-2,-1,1,2].",
          "i=-2, j=0 → need 2; l,r find 0 and 2 → [-2,0,0,2]. i=-1, j=0 → [-1,0,0,1].",
          "Dup-skips prevent emitting any quad twice.",
        ],
      },
    ],
    edgeCases: [
      "Fewer than 4 elements → empty result (the loop bounds handle it).",
      "**Integer overflow** — summing four values near ±10⁹ requires a `long`; this is the signature 4Sum bug.",
      "Many repeated values ([2,2,2,2,2]) → dup-skips collapse to a single quad.",
    ],
    twists: [
      "**k-Sum (general)** → recurse: peel off one fixed index at a time down to a 2-pointer base case.",
      "**4Sum II across four arrays** (LeetCode 454) → completely different: hash the pair-sums (see the 4Sum II card).",
      "**Count quadruplets only** → drop the result list, just increment a counter.",
    ],
    related: ["3sum", "two-sum"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "find-all-anagrams-in-a-string",
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 438,
    statement:
      "Given strings `s` and `p`, return the **start indices** of every substring of `s` that is an **anagram of** `p`.",
    examples: [
      { in: 's = "cbaebabacd", p = "abc"', out: "[0,6]", note: '"cba" at 0 and "bac" at 6' },
      { in: 's = "abab", p = "ab"', out: "[0,1,2]" },
    ],
    constraints: ["1 ≤ s.length, p.length ≤ 3·10⁴", "lowercase English letters"],
    recognize:
      "An anagram of `p` has `p`'s exact length, so you're scanning **every window of fixed size `p.length`** and asking 'do the letter counts match?'. Fixed-width window + frequency counts is the shape.",
    figureItOut: [
      "Brute force: for every start index, sort or count the window of length `p.length` and compare to `p`'s counts. That's O(n·k) or worse. Find what repeats.",
      "Anagrams are about **letter frequencies**, and every candidate window is the **same fixed width** `k = p.length`. So slide a window of width k across `s`.",
      "Keep a 26-slot count of `p`, and a 26-slot count of the current window. When the two count arrays are equal, the window is an anagram → record its start.",
      "The key efficiency: when the window slides one step right, you don't recount — you **add the entering character and remove the leaving one**, an O(1) update. Compare the two count arrays in O(26) = O(1).",
    ],
    approaches: [
      {
        name: "Recount each window (brute)",
        intuition: "For each start, build the window's letter counts fresh and compare.",
        time: "O(n·k)",
        timeWhy: "n windows, each rebuilt/compared in O(k).",
        space: "O(1)",
        spaceWhy: "Fixed 26-slot arrays.",
        code: `List<Integer> findAnagrams(String s, String p) {
    List<Integer> res = new ArrayList<>();
    int n = s.length(), k = p.length();
    int[] pc = new int[26];
    for (char c : p.toCharArray()) pc[c - 'a']++;
    for (int i = 0; i + k <= n; i++) {
        int[] wc = new int[26];
        for (int j = i; j < i + k; j++) wc[s.charAt(j) - 'a']++;
        if (Arrays.equals(pc, wc)) res.add(i);
    }
    return res;
}`,
      },
      {
        name: "Sliding window with rolling counts (optimal)",
        intuition: "Maintain one window count; on each slide add the entering char and drop the leaving char.",
        time: "O(n)",
        timeWhy: "One pass; each slide is O(1) update plus an O(26) array compare.",
        space: "O(1)",
        spaceWhy: "Two fixed 26-element arrays.",
        code: `List<Integer> findAnagrams(String s, String p) {
    List<Integer> res = new ArrayList<>();
    int n = s.length(), k = p.length();
    if (n < k) return res;
    int[] pc = new int[26], wc = new int[26];
    for (int i = 0; i < k; i++) {
        pc[p.charAt(i) - 'a']++;
        wc[s.charAt(i) - 'a']++;
    }
    if (Arrays.equals(pc, wc)) res.add(0);
    for (int i = k; i < n; i++) {
        wc[s.charAt(i) - 'a']++;          // char entering on the right
        wc[s.charAt(i - k) - 'a']--;      // char leaving on the left
        if (Arrays.equals(pc, wc)) res.add(i - k + 1);
    }
    return res;
}`,
        walkthrough: [
          's="abab", p="ab", k=2. pc=[a:1,b:1]. first window "ab" wc matches → add 0.',
          'i=2: add s[2]=a, drop s[0]=a → window "ba" matches → add 1.',
          'i=3: add s[3]=b, drop s[1]=b → window "ab" matches → add 2 → [0,1,2].',
        ],
      },
    ],
    edgeCases: [
      "`p` longer than `s` → no window fits → empty list.",
      "Repeated letters in `p` (e.g. p=\"aab\") → counts (not a set) are what make this correct.",
      "Comparing 26-slot arrays is O(1), so the rolling compare doesn't break the linear bound.",
    ],
    twists: [
      "**Permutation in string** (LeetCode 567) → identical window, but return true on the first match.",
      "**Track a matched-count instead of comparing arrays** → maintain how many of the 26 slots match to avoid the O(26) compare.",
      "**Unicode alphabet** → swap the 26-array for a hash map of counts.",
    ],
    related: ["permutation-in-string", "longest-substring-without-repeating"],
  },

  {
    slug: "subarray-product-less-than-k",
    title: "Subarray Product Less Than K",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 713,
    statement:
      "Given an array of positive integers `nums` and an integer `k`, return the number of **contiguous subarrays** whose product of all elements is **strictly less than `k`**.",
    examples: [
      {
        in: "nums = [10,5,2,6], k = 100",
        out: "8",
        note: "[10],[5],[2],[6],[10,5],[5,2],[2,6],[5,2,6]",
      },
      { in: "nums = [1,2,3], k = 0", out: "0", note: "no product is < 0" },
    ],
    constraints: ["1 ≤ nums.length ≤ 3·10⁴", "1 ≤ nums[i] ≤ 1000", "0 ≤ k ≤ 10⁶"],
    recognize:
      "'**Count contiguous subarrays** with product below a threshold', and all values are **positive** (so growing the window only grows the product) → a **sliding window** where each new right edge contributes a batch of valid subarrays.",
    figureItOut: [
      "Brute force: for every (l, r) compute the product and test < k → O(n²). Correct — exploit the positivity to do better.",
      "Because every number is **positive**, the product is **monotonic**: extending the window right can only **increase** it, and shrinking from the left can only **decrease** it. That monotonicity is exactly what makes a sliding window valid.",
      "Maintain a window [l..r] whose product stays < k. Push `r` forward, multiplying in `nums[r]`. While the product is ≥ k, divide out `nums[l]` and advance `l` until it drops below k again.",
      "The counting insight: once the window [l..r] is valid, **every subarray ending at r and starting anywhere in l..r is also valid** — there are `r − l + 1` of them. Add that each step.",
      "Guard the k ≤ 1 case: no positive product is < 1, so the answer is 0 (the while-loop handles it, but it's worth seeing why).",
    ],
    approaches: [
      {
        name: "Brute force — every subarray",
        intuition: "Compute the product of every (l, r) range.",
        time: "O(n²)",
        timeWhy: "n starts, each extended up to n with a running product.",
        space: "O(1)",
        spaceWhy: "A running product and a counter.",
        code: `int numSubarrayProductLessThanK(int[] nums, int k) {
    int count = 0;
    for (int l = 0; l < nums.length; l++) {
        long prod = 1;
        for (int r = l; r < nums.length; r++) {
            prod *= nums[r];
            if (prod < k) count++;
            else break;             // positive values → product only grows
        }
    }
    return count;
}`,
      },
      {
        name: "Sliding window, count per right edge (optimal)",
        intuition: "Keep the product < k by shrinking from the left; each valid window adds (r − l + 1) subarrays.",
        time: "O(n)",
        timeWhy: "l and r each advance at most n times total.",
        space: "O(1)",
        spaceWhy: "A product and two indices.",
        code: `int numSubarrayProductLessThanK(int[] nums, int k) {
    if (k <= 1) return 0;            // no positive product is < 1
    int count = 0, l = 0;
    long prod = 1;
    for (int r = 0; r < nums.length; r++) {
        prod *= nums[r];
        while (prod >= k) {         // shrink until valid again
            prod /= nums[l];
            l++;
        }
        count += r - l + 1;         // all subarrays ending at r
    }
    return count;
}`,
        walkthrough: [
          "nums=[10,5,2,6], k=100. r=0 prod=10<100 → +1. r=1 prod=50 → +2 (windows [5],[10,5]).",
          "r=2 prod=100≥100 → divide 10 → prod=10, l=1 → +2. r=3 prod=60 → +3 → total 1+2+2+3=8.",
        ],
      },
    ],
    edgeCases: [
      "k ≤ 1 → 0 (the early return; products of positives are ≥ 1).",
      "Single element ≥ k → contributes nothing for that right edge.",
      "All values positive is essential — a zero or negative would break the monotonic-product assumption.",
    ],
    twists: [
      "**Product ≤ k (inclusive)** → use `> k` as the shrink condition instead of `>= k`.",
      "**Subarray sum less than k** with positive values → identical window, addition instead of multiplication.",
      "**Values can be zero/negative** → the window breaks; fall back to prefix products with care or a different technique.",
    ],
    related: ["minimum-size-subarray-sum", "subarray-sum-equals-k"],
  },

  {
    slug: "fruit-into-baskets",
    title: "Fruit Into Baskets",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 904,
    statement:
      "You walk along a row of fruit trees; `fruits[i]` is the type of fruit on tree i. You have **two baskets**, each holding **one type** of fruit (unlimited amount). Starting at any tree, you must pick exactly one fruit from each tree moving right, and stop when you can't. Return the **maximum number of fruits** you can collect.",
    examples: [
      { in: "fruits = [1,2,1]", out: "3", note: "pick all; only two types" },
      { in: "fruits = [0,1,2,2]", out: "3", note: 'pick [1,2,2]' },
      { in: "fruits = [1,2,3,2,2]", out: "4", note: 'pick [2,3,2,2]' },
    ],
    constraints: ["1 ≤ fruits.length ≤ 10⁵", "0 ≤ fruits[i] < fruits.length"],
    recognize:
      "Strip away the story: it's '**longest contiguous subarray with at most 2 distinct values**'. 'Longest window with at most K distinct' is the canonical **sliding window with a count map**.",
    figureItOut: [
      "Translate the puzzle. Two baskets, each one type, picking continuously → the longest run of trees using **at most 2 distinct fruit types**. The answer is that run's length.",
      "That's the general 'at most K distinct' window with K = 2. Maintain a window [l..r] and a map of fruit type → how many are currently in the window.",
      "Extend `r`, adding `fruits[r]` to the map. If the map now has **more than 2 distinct types**, the window is invalid: shrink from the left, decrementing counts and removing a type when its count hits 0, until only 2 types remain.",
      "Each step the window is valid, record `r − l + 1` as a candidate maximum. Each tree enters and leaves the window once → O(n).",
    ],
    approaches: [
      {
        name: "Brute force — every start",
        intuition: "From each start, extend while distinct types ≤ 2.",
        time: "O(n²)",
        timeWhy: "n starts, each extending up to n trees.",
        space: "O(n)",
        spaceWhy: "A set/map of types per attempt.",
        code: `int totalFruit(int[] fruits) {
    int best = 0;
    for (int l = 0; l < fruits.length; l++) {
        Set<Integer> types = new HashSet<>();
        for (int r = l; r < fruits.length; r++) {
            types.add(fruits[r]);
            if (types.size() > 2) break;
            best = Math.max(best, r - l + 1);
        }
    }
    return best;
}`,
      },
      {
        name: "Sliding window, at most 2 distinct (optimal)",
        intuition: "Grow the window; when a third type appears, shrink from the left until two remain.",
        time: "O(n)",
        timeWhy: "Each tree is added once and removed at most once.",
        space: "O(1)",
        spaceWhy: "The map never holds more than 3 keys at a time.",
        code: `int totalFruit(int[] fruits) {
    Map<Integer, Integer> count = new HashMap<>();
    int l = 0, best = 0;
    for (int r = 0; r < fruits.length; r++) {
        count.merge(fruits[r], 1, Integer::sum);
        while (count.size() > 2) {            // more than 2 types → shrink
            int leftType = fruits[l];
            count.merge(leftType, -1, Integer::sum);
            if (count.get(leftType) == 0) count.remove(leftType);
            l++;
        }
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
        walkthrough: [
          "fruits=[1,2,3,2,2]. r=0 {1:1} best1. r=1 {1:1,2:1} best2. r=2 {1,2,3} size3 → drop l=1 → {2:1,3:1} l=1, best stays 2.",
          "r=3 {2:2,3:1} best3 (window [2,3,2]). r=4 {2:3,3:1} best4 (window [2,3,2,2]) → 4.",
        ],
      },
    ],
    edgeCases: [
      "All one type → the whole array fits in one basket → length n.",
      "Only one or two trees → just their length.",
      "Removing a type from the map when its count hits 0 is what keeps `size()` accurate.",
    ],
    twists: [
      "**At most K baskets** (LeetCode 340: at most K distinct) → replace the literal `2` with `k`.",
      "**Exactly K distinct** → (atMost(K) − atMost(K−1)).",
      "**Longest with all distinct** → that's 'no repeats' → longest substring without repeating characters.",
    ],
    related: ["longest-substring-without-repeating", "longest-repeating-character-replacement"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "next-greater-element-i",
    title: "Next Greater Element I",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 496,
    statement:
      "`nums1` is a subset of `nums2`. For each value in `nums1`, find the **next greater element** to its right in `nums2`; if none exists, use `-1`. Return the answers in `nums1`'s order.",
    examples: [
      { in: "nums1 = [4,1,2], nums2 = [1,3,4,2]", out: "[-1,3,-1]", note: "4→none, 1→3, 2→none" },
      { in: "nums1 = [2,4], nums2 = [1,2,3,4]", out: "[3,-1]" },
    ],
    constraints: ["1 ≤ nums1.length ≤ nums2.length ≤ 1000", "all values distinct", "every nums1[i] appears in nums2"],
    recognize:
      "'**Next greater element to the right**' is the textbook **monotonic stack** problem. Sweep nums2 keeping a stack of values still waiting for a bigger neighbour; a new larger value resolves all of them at once.",
    figureItOut: [
      "Brute force: for each value, scan right in nums2 until you find something larger → O(n·m). Correct — but you re-scan the same tails over and over.",
      "Key idea: process nums2 once and remember every element that is **still waiting** for a greater element to its right. 'Still waiting, most recent first' is a **stack**.",
      "Walk nums2 left to right. Before pushing the current value `x`, pop every stacked value **smaller than x** — for each of those, `x` is their next greater element. Record it in a map (value → next greater).",
      "Whatever stays on the stack at the end never found a greater element → those map to −1 (or simply default to −1 when absent).",
      "Finally, for each value in nums1, look it up in the map. Distinct values make 'value → answer' a clean key.",
    ],
    approaches: [
      {
        name: "Brute force — scan right for each",
        intuition: "Locate each nums1 value in nums2, then scan rightward for a bigger one.",
        time: "O(n·m)",
        timeWhy: "For each of n queries, up to m scanning in nums2.",
        space: "O(1)",
        spaceWhy: "Output aside, no extra structures.",
        code: `int[] nextGreaterElement(int[] nums1, int[] nums2) {
    int[] res = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
        res[i] = -1;
        int j = 0;
        while (nums2[j] != nums1[i]) j++;     // find it
        for (int k = j + 1; k < nums2.length; k++) {
            if (nums2[k] > nums1[i]) { res[i] = nums2[k]; break; }
        }
    }
    return res;
}`,
      },
      {
        name: "Monotonic stack + map (optimal)",
        intuition: "Sweep nums2; a new value resolves every smaller value waiting on the stack.",
        time: "O(n + m)",
        timeWhy: "Each nums2 element is pushed and popped at most once; nums1 is a single map lookup pass.",
        space: "O(m)",
        spaceWhy: "The stack and the map hold up to m entries.",
        code: `int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> nextGreater = new HashMap<>();
    Deque<Integer> stack = new ArrayDeque<>();   // values waiting for a bigger neighbour
    for (int x : nums2) {
        while (!stack.isEmpty() && x > stack.peek()) {
            nextGreater.put(stack.pop(), x);     // x is their next greater
        }
        stack.push(x);
    }
    int[] res = new int[nums1.length];
    for (int i = 0; i < nums1.length; i++) {
        res[i] = nextGreater.getOrDefault(nums1[i], -1);
    }
    return res;
}`,
        walkthrough: [
          "nums2=[1,3,4,2]. push1. x=3>1 → pop1 map{1:3}; push3. x=4>3 → pop3 map{3:4}; push4.",
          "x=2: 2<4 → push2. End. stack has 4,2 → no entry → -1.",
          "nums1=[4,1,2] → 4→-1, 1→3, 2→-1 → [-1,3,-1].",
        ],
      },
    ],
    edgeCases: [
      "Largest value in nums2 → never resolved → −1.",
      "Distinct values let 'value → answer' be a safe map key (no collisions).",
      "A value present but at the far right → −1.",
    ],
    twists: [
      "**Circular array** (LeetCode 503) → iterate twice over indices modulo n (see Next Greater Element II).",
      "**Next greater by index, not lookup** → store indices on the stack instead of values.",
      "**Next SMALLER element** → flip the comparison to `<`.",
    ],
    related: ["daily-temperatures", "next-greater-element-ii"],
  },

  {
    slug: "next-greater-element-ii",
    title: "Next Greater Element II",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 503,
    statement:
      "Given a **circular** array `nums`, return an array where each position holds the **next greater element** (searching circularly to the right), or `-1` if none exists.",
    examples: [
      { in: "nums = [1,2,1]", out: "[2,-1,2]", note: "the last 1 wraps around to the 2" },
      { in: "nums = [1,2,3,4,3]", out: "[2,3,4,-1,4]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    recognize:
      "Next greater element, but the array is **circular** (the search wraps). Same **monotonic stack**, but iterate the indices **twice** (modulo n) so each element can also be matched by something that comes before it in wrap-around order.",
    figureItOut: [
      "Start from plain Next Greater Element: a monotonic stack of **indices** waiting for a bigger value to their right resolves each in one pass.",
      "The twist is 'circular' — a small element near the end can find its next greater by **wrapping** to the front. A single left-to-right pass would miss that.",
      "Trick: simulate two laps. Iterate `i` from 0 to `2n − 1` and use `nums[i % n]`. The second lap gives every still-unresolved index a chance to be matched by elements that originally sat to its left.",
      "Push indices (not values) so you can write into the result array. Only push during the **first lap** (`i < n`); in the second lap you just resolve leftovers, you don't add new waiters.",
      "Anything still on the stack after both laps truly has no greater element → stays −1.",
    ],
    approaches: [
      {
        name: "Brute force — circular scan each",
        intuition: "For each i, scan up to n−1 steps forward (mod n) for a bigger value.",
        time: "O(n²)",
        timeWhy: "n positions, each scanning up to n.",
        space: "O(1)",
        spaceWhy: "Output aside, only indices.",
        code: `int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    for (int i = 0; i < n; i++) {
        for (int step = 1; step < n; step++) {
            int j = (i + step) % n;
            if (nums[j] > nums[i]) { res[i] = nums[j]; break; }
        }
    }
    return res;
}`,
      },
      {
        name: "Monotonic stack over two laps (optimal)",
        intuition: "Iterate indices 0..2n−1 mod n; a bigger value resolves all smaller indices waiting on the stack.",
        time: "O(n)",
        timeWhy: "2n iterations; each index pushed/popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack and the result array hold up to n entries.",
        code: `int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> stack = new ArrayDeque<>();   // indices waiting for a greater value
    for (int i = 0; i < 2 * n; i++) {
        int cur = nums[i % n];
        while (!stack.isEmpty() && nums[stack.peek()] < cur) {
            res[stack.pop()] = cur;
        }
        if (i < n) stack.push(i);                // only add real waiters in lap 1
    }
    return res;
}`,
        walkthrough: [
          "nums=[1,2,1]. i=0 push0. i=1 cur=2>nums[0]=1 → res[0]=2 pop; push1.",
          "i=2 cur=1<2 → push2. i=3 cur=nums[0]=1 → not >2; i=4 cur=2>nums[2]=1 → res[2]=2 pop.",
          "Stack leaves index1 → res[1]=-1 → [2,-1,2].",
        ],
      },
    ],
    edgeCases: [
      "The global maximum → never resolved → −1.",
      "Equal values don't count as 'greater' (use strict `<` in the pop test) — e.g. [2,2] → [-1,-1].",
      "Single element → [-1].",
    ],
    twists: [
      "**Non-circular version** (LeetCode 496) → one lap only.",
      "**Next greater with wrap, distance instead of value** → store `((j - i) + n) % n`.",
      "**Next SMALLER circular** → flip the comparison to `>`.",
    ],
    related: ["next-greater-element-i", "daily-temperatures"],
  },

  {
    slug: "removing-stars-from-a-string",
    title: "Removing Stars From a String",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 2390,
    statement:
      "Given a string `s`, each `*` removes the **closest non-star character to its left** (and is itself removed). Return the string after all stars are applied. It's guaranteed the operation is always possible.",
    examples: [
      { in: 's = "leet**cod*e"', out: '"lecoe"', note: "two stars remove 'e','e'; one removes 'd'" },
      { in: 's = "erase*****"', out: '""', note: "every letter gets removed" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "lowercase letters and '*'", "stars are always removable"],
    recognize:
      "'A `*` deletes the **most recent** surviving character to its left' — 'most recent' is the giveaway for a **stack** (LIFO). Push letters, pop on a star; what remains, bottom to top, is the answer.",
    figureItOut: [
      "Read the rule literally: each star cancels the **closest** non-star char on its left — i.e. the **last one you kept**. 'Last one kept' is exactly the top of a stack.",
      "So scan left to right. For a normal letter, **push** it (it's now the most recent survivor). For a `*`, **pop** (delete that most recent survivor). The star itself is discarded.",
      "Because stars are guaranteed removable, the stack is never empty when you pop — no need to handle underflow.",
      "At the end, the stack holds the surviving characters in their original order from bottom to top → read it out as the result.",
      "A `StringBuilder` works as the stack here (append = push, delete last char = pop), giving an O(n) build.",
    ],
    approaches: [
      {
        name: "Stack / StringBuilder (optimal)",
        intuition: "Push letters; a star pops the last survivor; read what remains.",
        time: "O(n)",
        timeWhy: "Each character is pushed at most once and popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack can hold up to n surviving characters.",
        code: `String removeStars(String s) {
    StringBuilder stack = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (c == '*') {
            stack.deleteCharAt(stack.length() - 1);   // pop the last survivor
        } else {
            stack.append(c);                           // push a letter
        }
    }
    return stack.toString();
}`,
        walkthrough: [
          '"leet**cod*e": push l,e,e,t → "leet". \'*\' pop t → "lee". \'*\' pop e → "le".',
          'push c,o,d → "lecod". \'*\' pop d → "leco". push e → "lecoe".',
        ],
      },
    ],
    edgeCases: [
      "Stars at the very end remove the last kept characters; result can be empty (\"erase*****\" → \"\").",
      "No stars at all → the string is returned unchanged.",
      "The guarantee that stars are removable means no empty-stack pop ever occurs.",
    ],
    twists: [
      "**Backspace string compare** (LeetCode 844) → '#' is the star; compare two such processed strings.",
      "**A star removes the closest char to its RIGHT** → process the string right-to-left instead.",
      "**Count removed characters** → track pops; stars + popped letters = total removed.",
    ],
    related: ["valid-parentheses", "simplify-path"],
  },

  {
    slug: "maximum-frequency-stack",
    title: "Maximum Frequency Stack",
    difficulty: "Hard",
    pattern: "stack",
    leetcode: 895,
    statement:
      "Design a stack-like structure `FreqStack`. `push(val)` adds a value. `pop()` removes and returns the **most frequent** element; if several tie for most frequent, return the one **pushed most recently**.",
    examples: [
      {
        in: 'push 5,7,5,7,4,5; then pop ×4',
        out: "5, 7, 5, 4",
        note: "5 has freq 3 → pop 5; then 5,7 tie at 2, 7 newer → pop 7; then 5 (freq 2) → pop 5; then 7,4,5 tie at 1, 4 newest among remaining → pop 4",
      },
    ],
    constraints: ["0 ≤ val ≤ 10⁹", "at most 2·10⁴ calls total", "pop is only called on a non-empty stack"],
    recognize:
      "'Most frequent, ties broken by most recent' → bucket elements **by frequency** and keep a **stack per frequency level**. Pop always comes from the highest occupied level — that one structure encodes both rules at once.",
    figureItOut: [
      "Two competing orders: by **frequency** (highest wins) and, among ties, by **recency** (newest wins). You need both, and recency-within-a-group is a stack.",
      "Idea: imagine a separate stack for **each frequency level**. When `val` is pushed and becomes its k-th copy, push it onto the stack for level k. Recency is preserved within each level automatically.",
      "Track `freq[val]` (current count of each value) and `maxFreq` (the highest non-empty level). On `push`, increment freq, update maxFreq, and append to `group[freq]`.",
      "On `pop`, take from `group[maxFreq]` — that's the most frequent, and the top of that stack is the most recent among the ties. Decrement that value's freq; if the top level empties, lower maxFreq.",
      "Every operation is O(1): a map lookup, a list append/removeLast, and a counter tweak. No re-sorting needed.",
    ],
    approaches: [
      {
        name: "Frequency-bucketed stacks (optimal)",
        intuition: "Keep a stack per frequency; always pop from the highest occupied frequency.",
        time: "O(1) per push and pop",
        timeWhy: "Each op is a map lookup plus a list append or removeLast — all constant time.",
        space: "O(n)",
        spaceWhy: "Every pushed element lives in exactly one frequency bucket.",
        code: `class FreqStack {
    private Map<Integer, Integer> freq = new HashMap<>();          // val -> current count
    private Map<Integer, java.util.List<Integer>> group = new HashMap<>(); // freq level -> stack
    private int maxFreq = 0;

    public void push(int val) {
        int f = freq.getOrDefault(val, 0) + 1;
        freq.put(val, f);
        if (f > maxFreq) maxFreq = f;
        group.computeIfAbsent(f, k -> new java.util.ArrayList<>()).add(val);
    }

    public int pop() {
        java.util.List<Integer> top = group.get(maxFreq);
        int val = top.remove(top.size() - 1);     // newest among the most frequent
        freq.put(val, freq.get(val) - 1);
        if (top.isEmpty()) maxFreq--;              // that level is now empty
        return val;
    }
}`,
        walkthrough: [
          "push 5,7,5,7,4,5 → freq{5:3,7:2,4:1}, maxFreq=3. group: lvl1=[5,7,4], lvl2=[5,7], lvl3=[5].",
          "pop → lvl3 top=5, freq5→2, lvl3 empty → maxFreq=2. pop → lvl2 top=7 (newer than 5), freq7→1.",
          "pop → lvl2 top=5, freq5→1, lvl2 empty → maxFreq=1. pop → lvl1 top=4 → returns 5,7,5,4.",
        ],
      },
    ],
    edgeCases: [
      "Ties at the same frequency are broken by recency precisely because each level is a stack (LIFO).",
      "When the top frequency level empties, `maxFreq--` correctly drops to the next occupied level.",
      "Repeatedly pushing the same value climbs it through every frequency level in turn.",
    ],
    twists: [
      "**Least frequent / oldest tie-break** → track minFreq and use the bottom of the level (a queue).",
      "**LFU cache** (LeetCode 460) → same frequency-bucketing idea plus eviction and a capacity.",
      "**Peek without popping** → read the last element of `group[maxFreq]` without removing it.",
    ],
    related: ["min-stack", "top-k-frequent-elements"],
  },
];
