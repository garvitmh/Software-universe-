// NeetCode/Top-150/LeetCode-75/Grind-75 — wave 16a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave15a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE16A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "rank-transform-of-an-array",
    title: "Rank Transform of an Array",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1331,
    statement:
      "Replace each element of the array `arr` with its **rank**. The rank is the position of the element when the distinct values are sorted ascending: the smallest distinct value has rank 1, the next distinct value rank 2, and so on. Equal values get the same rank. Return the array of ranks in the original order.",
    examples: [
      { in: "arr = [40,10,20,30]", out: "[4,1,2,3]", explanation: "sorted distinct values 10,20,30,40 get ranks 1,2,3,4" },
      { in: "arr = [100,100,100]", out: "[1,1,1]", explanation: "only one distinct value, so every element has rank 1" },
      { in: "arr = [37,12,28,9,100,56,80,5,12]", out: "[5,3,4,2,8,6,7,1,3]", explanation: "the two 12s share rank 3" },
    ],
    constraints: ["0 ≤ arr.length ≤ 10^5", "-10^9 ≤ arr[i] ≤ 10^9"],
    recognize:
      "Mapping each value to its position among the sorted distinct values is a **sort-then-hash** problem: sort a copy to learn the rank of each distinct value, store value to rank in a map, then rewrite the original array via lookups.",
    figureItOut: [
      "A rank only depends on how many DISTINCT values are smaller than a given value, not on the original positions. So the rank of a value is fixed once you know the sorted order of the distinct values.",
      "Make a sorted copy of the array. Walking it in ascending order, the first time you meet a new value you assign it the next rank (starting at 1); repeats of a value you have already seen keep that same rank. This is exactly a value to rank dictionary.",
      "Build that dictionary in one pass over the sorted copy: keep a running rank counter, and only increment it when the current value differs from the previous one. Store each value to its current rank in a hash map.",
      "Now the original array order is irrelevant to the ranks themselves — so do a final pass over the UNSORTED original and replace each element with its mapped rank. The output preserves the original positions.",
      "Sorting the copy is O(n log n); building the map and rewriting are each O(n). So O(n log n) time and O(n) space for the copy plus the map. The empty-array case returns an empty array with no work.",
    ],
    approaches: [
      {
        name: "Sort a copy, map value to rank, rewrite (optimal)",
        intuition: "Sort a copy to discover ranks, store each distinct value to its rank in a map, then translate the original array.",
        time: "O(n log n)",
        timeWhy: "Sorting the copy dominates; the two passes are linear.",
        space: "O(n)",
        spaceWhy: "A sorted copy plus a value-to-rank map.",
        code: `int[] arrayRankTransform(int[] arr) {
    int n = arr.length;
    int[] sorted = arr.clone();
    Arrays.sort(sorted);
    Map<Integer, Integer> rank = new HashMap<>();
    int next = 1;
    for (int v : sorted) {
        if (!rank.containsKey(v)) {      // first time we see this distinct value
            rank.put(v, next);
            next++;
        }
    }
    int[] res = new int[n];
    for (int i = 0; i < n; i++) res[i] = rank.get(arr[i]);
    return res;
}`,
        walkthrough: [
          "arr=[40,10,20,30]. Sorted copy [10,20,30,40]. Assign ranks: 10 to 1, 20 to 2, 30 to 3, 40 to 4.",
          "Rewrite original [40,10,20,30] via the map: 40 to 4, 10 to 1, 20 to 2, 30 to 3.",
          "Result [4,1,2,3].",
        ],
      },
    ],
    edgeCases: [
      "Empty array → return an empty array.",
      "All equal values → one distinct value → every position becomes rank 1.",
      "Negative values → sorting handles ordering; the map keys are the raw values.",
    ],
    twists: [
      "**Relative Ranks** → the same sort-to-rank idea but labelling the top three with medal strings.",
      "**Coordinate compression in graph/DP problems** → ranks compress a sparse value range into 1..k for array indexing.",
      "**Streaming values** → without all data up front you would need an order-statistics tree instead of a one-shot sort.",
    ],
    related: ["top-k-frequent-elements", "contains-duplicate", "group-anagrams"],
  },

  {
    slug: "find-common-characters",
    title: "Find Common Characters",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1002,
    statement:
      "Given a string array `words`, return all characters that appear in **every** string, including duplicates. If a character appears `k` times in every word (at least), include it `k` times in the result. You may return the answer in any order.",
    examples: [
      { in: 'words = ["bella","label","roller"]', out: '["e","l","l"]', explanation: "every word has at least one e and two l characters" },
      { in: 'words = ["cool","lock","cook"]', out: '["c","o"]', explanation: "c appears once and o at least once in all three" },
    ],
    constraints: ["1 ≤ words.length ≤ 100", "1 ≤ words[i].length ≤ 100", "words[i] consists of lowercase English letters"],
    recognize:
      "'Characters common to every word, counting multiplicity' is a **per-letter minimum frequency** problem: count each word, then for every letter take the minimum count across all words.",
    figureItOut: [
      "A character belongs in the answer as many times as it appears in the WORD THAT HAS THE FEWEST of it. If one word has only one l, then no matter how many l characters the others have, only one l is common to all.",
      "So for each of the 26 lowercase letters, the answer count is the MINIMUM of that letter's frequency across all words. That immediately suggests counting each word into a 26-slot frequency array.",
      "Maintain a running 'minimum frequency' array, initialised from the first word's counts. For each subsequent word, count its letters and take, slot by slot, the minimum of the running array and this word's counts.",
      "After processing every word, the running array holds, for each letter, how many copies survive in all words. Emit that letter that many times into the output list.",
      "Each word is counted in O(length) and the min-merge is O(26) per word. Total is O(total characters) time and O(1) space (fixed 26-slot arrays).",
    ],
    approaches: [
      {
        name: "Per-letter minimum frequency across all words (optimal)",
        intuition: "Count each word into a 26-slot array and keep the slot-wise minimum; the surviving counts are the common characters.",
        time: "O(L)",
        timeWhy: "L is the total length of all words; each character is counted once and the 26-slot merges are constant.",
        space: "O(1)",
        spaceWhy: "Fixed 26-element frequency arrays, independent of input size.",
        code: `List<String> commonChars(String[] words) {
    int[] min = new int[26];
    Arrays.fill(min, Integer.MAX_VALUE);
    for (String w : words) {
        int[] count = new int[26];
        for (int i = 0; i < w.length(); i++) count[w.charAt(i) - 'a']++;
        for (int c = 0; c < 26; c++) min[c] = Math.min(min[c], count[c]);
    }
    List<String> res = new ArrayList<>();
    for (int c = 0; c < 26; c++) {
        for (int t = 0; t < min[c]; t++) res.add(String.valueOf((char) ('a' + c)));
    }
    return res;
}`,
        walkthrough: [
          'words=["bella","label","roller"]. "bella": b1 e1 l2 a1. min becomes that. "label": l2 a1 b1 e1 → min stays l2 e1 a1 b1.',
          '"roller": r2 o1 l1 e1 → take minimums: l min(2,1)=1, e min(1,1)=1, b min(1,0)=0, a min(1,0)=0. So surviving: e1, l1... recompute l across all: bella 2, label 2, roller 1 → min 1. e: 1,1,1 → 1.',
          'Actually l appears twice in bella and label but once in roller → min 1; rechecking expected output [e,l,l] means roller has two l? r-o-l-l-e-r has two l → l min is 2. Emit e once, l twice → ["e","l","l"].',
        ],
      },
    ],
    edgeCases: [
      "A single word → every character of it (with its multiplicity) is common.",
      "No character shared by all → empty result.",
      "A letter present in all but with differing counts → contributes the minimum count.",
    ],
    twists: [
      "**Intersection of Two Arrays II** (in the library) → the same minimum-count idea over two integer arrays instead of many strings.",
      "**Uncommon characters** → flip the logic to letters appearing in some but not all words.",
      "**Bitmask presence (ignoring multiplicity)** → AND together a 26-bit mask per word if duplicates do not matter.",
    ],
    related: ["intersection-of-two-arrays-ii", "valid-anagram", "ransom-note"],
  },

  {
    slug: "how-many-numbers-are-smaller-than-the-current-number",
    title: "How Many Numbers Are Smaller Than the Current Number",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1365,
    statement:
      "Given an array `nums`, for each `nums[i]` count how many other numbers in the array are **strictly smaller** than it. That is, for each `i` count the valid `j` with `j != i` and `nums[j] < nums[i]`. Return the answer as an array in the same order.",
    examples: [
      { in: "nums = [8,1,2,2,3]", out: "[4,0,1,1,3]", explanation: "for 8 there are 4 smaller; for 1 there are 0; for each 2 there is 1 (the value 1)" },
      { in: "nums = [6,5,4,8]", out: "[2,1,0,3]", explanation: "counts of strictly smaller values" },
      { in: "nums = [7,7,7,7]", out: "[0,0,0,0]", explanation: "no value is strictly smaller than another equal value" },
    ],
    constraints: ["2 ≤ nums.length ≤ 500", "0 ≤ nums[i] ≤ 100"],
    recognize:
      "'How many values are smaller than each element' over a bounded value range is a **counting-sort prefix-sum** problem: tally how many of each value exist, then a prefix sum tells you how many are strictly below any value in O(1).",
    figureItOut: [
      "The naive answer compares every pair: for each i scan all j and count smaller ones, which is O(n^2). The structure to exploit is that the count for a value v is just 'how many elements are < v' — a question that does not depend on positions, only on values.",
      "Values are bounded in [0, 100], so build a frequency histogram: count[v] = how many elements equal v. This is a single O(n) pass.",
      "Now 'how many elements are strictly smaller than v' equals count[0] + count[1] + ... + count[v-1] — a PREFIX SUM of the histogram up to v-1. Precompute prefix[v] = number of elements with value < v across the 101 buckets in O(101).",
      "With that prefix table, the answer for nums[i] is simply prefix[nums[i]] — an O(1) lookup. Equal values share the same answer automatically, and j != i is respected because strictly-smaller excludes equal values (including the element itself).",
      "Histogram build is O(n), prefix build is O(maxValue), answer pass is O(n) → O(n + maxValue) time, O(maxValue) space. This beats sorting because the value range is small and fixed.",
    ],
    approaches: [
      {
        name: "Brute-force pair comparison",
        intuition: "For each element, scan the whole array and count strictly-smaller values.",
        time: "O(n^2)",
        timeWhy: "Every element compares against every other.",
        space: "O(1)",
        spaceWhy: "Output aside, only counters.",
        code: `int[] smallerNumbersThanCurrent(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        int c = 0;
        for (int j = 0; j < n; j++) {
            if (nums[j] < nums[i]) c++;
        }
        res[i] = c;
    }
    return res;
}`,
      },
      {
        name: "Counting sort + prefix sum of the histogram (optimal)",
        intuition: "Histogram the bounded values, prefix-sum it so prefix[v] is the count of values below v, then look each element up.",
        time: "O(n + V)",
        timeWhy: "One pass to histogram, O(V) to prefix-sum the 101 buckets, one pass to answer.",
        space: "O(V)",
        spaceWhy: "A fixed-size count/prefix array over the value range.",
        code: `int[] smallerNumbersThanCurrent(int[] nums) {
    int[] count = new int[101];          // values are in [0,100]
    for (int v : nums) count[v]++;
    int[] prefix = new int[101];         // prefix[v] = how many values are < v
    int running = 0;
    for (int v = 0; v < 101; v++) {
        prefix[v] = running;
        running += count[v];
    }
    int[] res = new int[nums.length];
    for (int i = 0; i < nums.length; i++) res[i] = prefix[nums[i]];
    return res;
}`,
        walkthrough: [
          "nums=[8,1,2,2,3]. Histogram: count[1]=1, count[2]=2, count[3]=1, count[8]=1.",
          "Prefix (values < v): prefix[1]=0, prefix[2]=1, prefix[3]=1+2=3? recompute: prefix[2]=count[0..1]=1, prefix[3]=count[0..2]=1+2=3, prefix[8]=count[0..7]=1+2+1=4.",
          "Answers: 8 to prefix[8]=4, 1 to 0, 2 to 1, 2 to 1, 3 to 3 → [4,0,1,1,3].",
        ],
      },
    ],
    edgeCases: [
      "All equal values → every answer is 0 (nothing strictly smaller).",
      "Strictly increasing array → answers are 0,1,2,...,n-1.",
      "Minimum value present multiple times → all those positions get 0.",
    ],
    twists: [
      "**Count of Smaller Numbers After Self** → the harder ordered version needing a BIT/merge sort, not a global histogram.",
      "**Rank Transform of an Array** (in this set) → ranks distinct values rather than counting strictly-smaller occurrences.",
      "**Unbounded values** → replace the histogram with sort-and-binary-search for O(n log n).",
    ],
    related: ["rank-transform-of-an-array", "contains-duplicate", "top-k-frequent-elements"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "long-pressed-name",
    title: "Long Pressed Name",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 925,
    statement:
      "Your friend typed their `name` into a keyboard, but some keys may have been **long pressed**, repeating a character one or more extra times. Given `name` and the actually `typed` string, return `true` if `typed` could be the result of long-pressing the characters of `name` (each character either typed once or repeated), and `false` otherwise.",
    examples: [
      { in: 'name = "alex", typed = "aaleex"', out: "true", explanation: "the a and the e were long pressed" },
      { in: 'name = "saeed", typed = "ssaaedd"', out: "false", explanation: "e in name is not repeated enough in typed (only one e but name needs two)" },
      { in: 'name = "leelee", typed = "lleeelee"', out: "true", explanation: "characters match group by group with extra repeats allowed" },
    ],
    constraints: ["1 ≤ name.length, typed.length ≤ 1000", "name and typed consist of lowercase English letters"],
    recognize:
      "Matching two strings where the second may have extra repeats of the same character is a **two-pointer group-walk**: advance through `name`, and for each character consume one-or-more identical characters in `typed`.",
    figureItOut: [
      "Long-pressing only ever ADDS extra copies of a character that was genuinely typed — it never inserts a new character or reorders. So if you walk both strings left to right, each character of name must line up with one or more equal characters in typed, in order.",
      "Use a pointer i in name and j in typed. When name[i] == typed[j], that character matches; advance both. The 'extra repeats' show up as typed having more of the current character than name does.",
      "So when typed[j] equals the character we JUST matched (name[i-1]) but does not match the current name[i], that is a long-press repeat: advance only j, consuming the extra copy. If typed[j] is neither the current name character nor a valid repeat of the previous one, it is an impostor → return false.",
      "An easier framing: for each maximal RUN of one character, name needs a run length and typed must have an equal-or-greater run length of the SAME character. If the characters differ or typed has fewer, fail.",
      "At the end, name must be fully consumed (every character matched) and typed fully consumed (no leftover impostor characters). Each pointer advances monotonically → O(n + m) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Run-by-run two-pointer match (optimal)",
        intuition: "For each character run in name, require typed to start with the same character and have an equal-or-longer run; advance both past the runs.",
        time: "O(n + m)",
        timeWhy: "Each pointer advances through its string exactly once.",
        space: "O(1)",
        spaceWhy: "Only two indices.",
        code: `boolean isLongPressedName(String name, String typed) {
    int i = 0, j = 0;
    int n = name.length(), m = typed.length();
    while (i < n) {
        if (j >= m || name.charAt(i) != typed.charAt(j)) return false;
        char c = name.charAt(i);
        int ni = i, nj = j;
        while (ni < n && name.charAt(ni) == c) ni++;   // run length in name
        while (nj < m && typed.charAt(nj) == c) nj++;   // run length in typed
        if (nj - j < ni - i) return false;              // typed has too few copies
        i = ni;
        j = nj;
    }
    return j == m;   // no leftover impostor characters in typed
}`,
        walkthrough: [
          'name="alex", typed="aaleex". Run a: name 1, typed 2 (2>=1 ok), i=1 j=2. Run l: name 1, typed 1, i=2 j=3.',
          'Run e: name 1, typed 2, i=3 j=5. Run x: name 1, typed 1, i=4 j=6. i==n.',
          "j==m (6==6) → true.",
        ],
      },
    ],
    edgeCases: [
      "typed shorter than name in some run → false (cannot remove characters).",
      "typed has a character not in name at that position → false (impostor).",
      "Leftover characters in typed after name is consumed → false (j != m).",
    ],
    twists: [
      "**Is Subsequence** (in the library) → also a two-pointer walk, but allows SKIPPING characters in the longer string, not just repeating.",
      "**Backspace String Compare** (in the library) → two-pointer comparison where one string can DELETE characters.",
      "**Count the long presses** → instead of yes/no, report how many extra repeats were inserted.",
    ],
    related: ["is-subsequence", "backspace-string-compare", "valid-palindrome"],
  },

  {
    slug: "max-consecutive-ones",
    title: "Max Consecutive Ones",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 485,
    statement:
      "Given a binary array `nums`, return the maximum number of **consecutive** 1s in the array.",
    examples: [
      { in: "nums = [1,1,0,1,1,1]", out: "3", explanation: "the trailing run 1,1,1 is the longest" },
      { in: "nums = [1,0,1,1,0,1]", out: "2", explanation: "the longest run of 1s has length 2" },
      { in: "nums = [0,0,0]", out: "0", explanation: "no 1s at all" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "nums[i] is either 0 or 1"],
    recognize:
      "Longest run of a value is a **running-counter sweep** (a degenerate two-pointer/window): grow a current-run length on each 1, reset it on a 0, and track the best length seen.",
    figureItOut: [
      "A 'consecutive run of 1s' is broken only by a 0. So as you scan, you are inside some current run, and the only event that matters is hitting a 0, which ends the run.",
      "Keep a current counter of how many 1s in a row you have just seen. On a 1, increment it. On a 0, the run is over, so reset the counter to 0.",
      "After every increment, the current counter is a candidate for the answer — so update a running maximum with it. The maximum captures the best run even after later runs reset the counter.",
      "You can think of this as a window whose left edge jumps to just after the last 0: the window of 1s has length equal to the current counter. The 'two pointers' collapse into one counter because the window only ever contains 1s.",
      "Single pass, O(n) time, O(1) space. The all-zeros case keeps the maximum at 0, and a trailing run of 1s is captured because the maximum updates on the last increment before the array ends.",
    ],
    approaches: [
      {
        name: "Running-run counter with a max (optimal)",
        intuition: "Count consecutive 1s, reset on each 0, and keep the largest run length seen.",
        time: "O(n)",
        timeWhy: "A single pass over the array.",
        space: "O(1)",
        spaceWhy: "Two integer counters.",
        code: `int findMaxConsecutiveOnes(int[] nums) {
    int best = 0, run = 0;
    for (int v : nums) {
        if (v == 1) {
            run++;                  // extend the current run of ones
            best = Math.max(best, run);
        } else {
            run = 0;                // a zero breaks the run
        }
    }
    return best;
}`,
        walkthrough: [
          "nums=[1,1,0,1,1,1]. run: 1 (best 1), 2 (best 2), reset 0, 1 (best 2), 2 (best 2), 3 (best 3).",
          "The trailing run reaches 3, updating best.",
          "Return 3.",
        ],
      },
    ],
    edgeCases: [
      "All ones → the run equals the whole array length.",
      "All zeros → run never grows → 0.",
      "Trailing run of ones → captured because the max updates on the final increment.",
    ],
    twists: [
      "**Max Consecutive Ones III** (in the library) → allow flipping up to k zeros; needs a real shrinking sliding window.",
      "**Longest run of any value** → track the current value and reset when it changes.",
      "**Count the number of runs** → increment a separate counter each time a new run starts.",
    ],
    related: ["max-consecutive-ones-iii", "minimum-size-subarray-sum", "longest-substring-without-repeating"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "minimum-recolors-to-get-k-consecutive-black-blocks",
    title: "Minimum Recolors to Get K Consecutive Black Blocks",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 2379,
    statement:
      'You are given a string `blocks` of characters `W` (white) and `B` (black), and an integer `k`. In one operation you may recolor a white block black. Return the **minimum** number of operations needed so that there is at least one run of `k` **consecutive** black blocks.',
    examples: [
      { in: 'blocks = "WBBWWBBWBW", k = 7', out: "3", explanation: "recolor the 3 white blocks inside some length-7 window so all 7 are black" },
      { in: 'blocks = "WBWBBBW", k = 2', out: "0", explanation: "a run of 2 black blocks (BB) already exists" },
    ],
    constraints: ["1 ≤ blocks.length ≤ 100", "1 ≤ k ≤ blocks.length", "blocks[i] is W or B"],
    recognize:
      "'Fewest recolors for k consecutive blacks' is a **fixed-size sliding window** minimising the white count: every length-k window costs exactly its number of W blocks to make all-black, so find the window with the fewest whites.",
    figureItOut: [
      "To get k consecutive black blocks, you must choose WHICH k-length stretch becomes the all-black run. Within a chosen window of width k, the only blocks you need to recolor are the white ones — the blacks are already correct.",
      "So the cost of turning a particular length-k window all-black equals the NUMBER OF W characters inside it. Minimising operations means minimising the white count over all length-k windows.",
      "The windows all have the same width k, so this is a fixed-size sliding window. Count whites in the first window, then slide: when the window moves right by one, add 1 if the entering block is W and subtract 1 if the leaving block was W.",
      "Track the minimum white-count seen across all window positions. That minimum is the fewest recolors needed, because picking that window and recoloring just its whites yields k consecutive blacks.",
      "Computing the first window is O(k), and the slide visits each block once for O(n) total. So O(n) time and O(1) space — the running white count is the only state.",
    ],
    approaches: [
      {
        name: "Fixed-size window counting whites (optimal)",
        intuition: "The cost of an all-black length-k window is its white count; slide the window and keep the minimum white count.",
        time: "O(n)",
        timeWhy: "Build the first window in O(k), then each later block enters and leaves once.",
        space: "O(1)",
        spaceWhy: "Only the running and best white counts.",
        code: `int minimumRecolors(String blocks, int k) {
    int whites = 0;
    for (int i = 0; i < k; i++) if (blocks.charAt(i) == 'W') whites++;
    int best = whites;
    for (int i = k; i < blocks.length(); i++) {
        if (blocks.charAt(i) == 'W') whites++;          // entering block
        if (blocks.charAt(i - k) == 'W') whites--;      // leaving block
        best = Math.min(best, whites);
    }
    return best;
}`,
        walkthrough: [
          'blocks="WBBWWBBWBW", k=7. First window [0..6]="WBBWWBB" has 3 whites → best 3.',
          'Slide to [1..7]="BBWWBBW": enter blocks[7]=W (+1=4), leave blocks[0]=W (-1=3) → best 3. Slide to [2..8]="BWWBBWB": enter B, leave B → whites 3 → best 3. Slide to [3..9]: enter W(+1), leave B → 4.',
          "Minimum whites across windows = 3 → return 3.",
        ],
      },
    ],
    edgeCases: [
      "A run of k blacks already exists → some window has 0 whites → answer 0.",
      "k equals the string length → only one window; answer is the total white count.",
      "All white blocks → every window costs k → answer k.",
    ],
    twists: [
      "**K Radius Subarray Averages** (in the library) → fixed window maintaining a running sum instead of a white count.",
      "**Maximum Average Subarray I** (in the library) → fixed window maximising a sum.",
      "**Recolor to get k consecutive of EITHER color** → take the min over both white-cost and black-cost per window.",
    ],
    related: ["k-radius-subarray-averages", "maximum-average-subarray-i", "max-consecutive-ones-iii"],
  },

  {
    slug: "defuse-the-bomb",
    title: "Defuse the Bomb",
    difficulty: "Easy",
    pattern: "sliding-window",
    leetcode: 1652,
    statement:
      "You have a circular array `code` of length `n` and an integer `k`. Replace every number with a new value: if `k > 0`, replace `code[i]` with the sum of the **next** `k` numbers (circularly); if `k < 0`, replace it with the sum of the **previous** `|k|` numbers; if `k == 0`, replace it with `0`. Return the resulting array. All indices wrap around the circle.",
    examples: [
      { in: "code = [5,7,1,4], k = 3", out: "[12,10,16,13]", explanation: "for index 0: 7+1+4=12; circular sums of the next 3" },
      { in: "code = [1,2,3,4], k = 0", out: "[0,0,0,0]", explanation: "k=0 zeroes everything" },
      { in: "code = [2,4,9,3], k = -2", out: "[12,5,6,13]", explanation: "for index 0: previous two are 3 and 9 → 12" },
    ],
    constraints: ["n == code.length", "1 ≤ n ≤ 100", "1 ≤ code[i] ≤ 100", "-(n-1) ≤ k ≤ n-1"],
    recognize:
      "Summing a **fixed window of |k| neighbours** around every position on a circular array is a sliding-window sum with modular indexing: maintain one window sum and slide it as the center advances.",
    figureItOut: [
      "Each output entry is the sum of exactly |k| consecutive elements — the next k for positive k, the previous |k| for negative k — read circularly. That is a FIXED-WIDTH window of size |k|; only WHERE it sits relative to index i changes.",
      "Handle k==0 up front: every answer is 0. Otherwise pick the window's starting offset. For k>0 the window for index i covers indices i+1 .. i+k. For k<0 it covers i-|k| .. i-1. Use modulo n to wrap negative or overflowing indices back into range.",
      "A naive double loop sums |k| elements for each of n indices → O(n*|k|). To use a true sliding window, compute the first index's window sum directly, then as i advances by one the window also shifts by one: ADD the new element entering the window and SUBTRACT the one leaving.",
      "The tricky part is mapping 'entering' and 'leaving' positions modulo n as the center moves. With careful modular arithmetic the per-step update is O(1), giving O(n) overall — though for n ≤ 100 the direct O(n*|k|) sum is perfectly fine and clearer.",
      "Modular indexing in Java needs care with negatives: ((x % n) + n) % n keeps the index in [0, n-1]. Time O(n*|k|) for the direct version (or O(n) sliding), O(1) extra space beyond the output.",
    ],
    approaches: [
      {
        name: "Direct circular window sum",
        intuition: "For each index, sum the |k| neighbours on the correct side using modular indexing.",
        time: "O(n*|k|)",
        timeWhy: "Each of n outputs sums |k| elements.",
        space: "O(1)",
        spaceWhy: "Output aside, only accumulators.",
        code: `int[] decrypt(int[] code, int k) {
    int n = code.length;
    int[] res = new int[n];
    if (k == 0) return res;                  // all zeros
    for (int i = 0; i < n; i++) {
        int sum = 0;
        if (k > 0) {
            for (int t = 1; t <= k; t++) sum += code[(i + t) % n];
        } else {
            for (int t = 1; t <= -k; t++) sum += code[((i - t) % n + n) % n];
        }
        res[i] = sum;
    }
    return res;
}`,
      },
      {
        name: "Sliding window of width |k| around the circle (optimal)",
        intuition: "Compute index 0's window sum, then slide: add the entering neighbour and drop the leaving one as the center advances.",
        time: "O(n)",
        timeWhy: "One O(|k|) setup then O(1) per index as the window slides.",
        space: "O(1)",
        spaceWhy: "A single running sum beyond the output.",
        code: `int[] decrypt(int[] code, int k) {
    int n = code.length;
    int[] res = new int[n];
    if (k == 0) return res;
    int size = Math.abs(k);
    // window for index 0: indices [start0, start0+size-1] read circularly
    int start = (k > 0) ? 1 : n - size;       // first window's leftmost offset from 0
    int sum = 0;
    for (int t = 0; t < size; t++) sum += code[(start + t) % n];
    res[0] = sum;
    for (int i = 1; i < n; i++) {
        // window shifts right by one as the center moves from i-1 to i
        int leaving = code[(start + i - 1) % n];          // old leftmost leaves
        int entering = code[(start + i - 1 + size) % n];  // new rightmost enters
        sum += entering - leaving;
        res[i] = sum;
    }
    return res;
}`,
        walkthrough: [
          "code=[5,7,1,4], k=3. size=3, start=1. Window for 0: indices 1,2,3 → 7+1+4=12. res[0]=12.",
          "i=1: leaving code[1]=7, entering code[(1+0+3)%4]=code[0]=5 → sum 12-7+5=10. res[1]=10. i=2: leaving code[2]=1, entering code[1]=7 → 10-1+7=16. i=3: leaving code[3]=4, entering code[2]=1 → 16-4+1=13.",
          "Result [12,10,16,13].",
        ],
      },
    ],
    edgeCases: [
      "k == 0 → return an all-zeros array immediately.",
      "Window wraps past the array end → modular indexing folds it back to the front.",
      "Negative k → the window sits on the previous |k| elements with wrap-around.",
    ],
    twists: [
      "**K Radius Subarray Averages** (in the library) → fixed window but non-circular and averaging instead of summing.",
      "**Circular subarray maximum sum** → circularity with an optimisation objective rather than a fixed offset.",
      "**Prefix sums on a doubled array** → an alternative way to answer any circular range sum in O(1).",
    ],
    related: ["k-radius-subarray-averages", "maximum-average-subarray-i", "minimum-recolors-to-get-k-consecutive-black-blocks"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "remove-all-adjacent-duplicates-in-string-ii",
    title: "Remove All Adjacent Duplicates in String II",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1209,
    statement:
      "You are given a string `s` and an integer `k`. Repeatedly remove any `k` **adjacent and equal** characters from `s`. Keep doing this — removals may make new groups of k equal characters adjacent — until no more removals are possible, then return the final string. The answer is unique.",
    examples: [
      { in: 's = "abcd", k = 2', out: '"abcd"', explanation: "no run of 2 equal adjacent characters" },
      { in: 's = "deeedbbcccbdaa", k = 3', out: '"aa"', explanation: 'remove eee, then bbb? becomes "ddbccccbdaa"... cascading removals leave "aa"' },
      { in: 's = "pbbcggttciiippooaais", k = 2', out: '"ps"', explanation: "all the doubled letters cancel in cascade" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^5", "2 ≤ k ≤ 10^4", "s consists of lowercase English letters"],
    recognize:
      "Cancelling k-in-a-row where a removal can expose a NEW run is the **stack-with-counts** pattern: push (character, run-length); when a run reaches k, pop it, and merging with the new top is handled automatically.",
    figureItOut: [
      "Removing k equal adjacent characters can make the characters on either side of the removed run become adjacent, possibly forming a new run of k. That cascade is the tell-tale sign of a stack — the stack top is the character group immediately to the left of where you are.",
      "Rather than store individual characters, store PAIRS of (character, current consecutive count). When the incoming character equals the stack top's character, increment that top's count instead of pushing a new entry.",
      "Whenever a top's count reaches exactly k, that whole group is removed: pop it. After popping, the next character you process compares against the NEW top — which may be the same character as a group beneath, so its count keeps growing and can itself hit k. That is the cascade, handled with no rescanning.",
      "If the incoming character differs from the top's character, push a fresh (character, 1) entry. The stack always represents the irreducible string compressed as runs.",
      "At the end, expand the stack: each (character, count) contributes that many copies. Each character is processed once with O(1) stack work → O(n) time, O(n) space. Using counts (not k separate pushes) is what keeps it efficient when k is large.",
    ],
    approaches: [
      {
        name: "Stack of (character, count) collapsing runs of k (optimal)",
        intuition: "Track run counts on a stack; increment the top when the character repeats, pop when a count reaches k, then expand the survivors.",
        time: "O(n)",
        timeWhy: "Each character causes O(1) stack work and is emitted at most once.",
        space: "O(n)",
        spaceWhy: "The stack of run entries plus the output builder.",
        code: `String removeDuplicates(String s, int k) {
    Deque<int[]> stack = new ArrayDeque<>(); // each entry: {charCode, count}
    for (int i = 0; i < s.length(); i++) {
        int c = s.charAt(i);
        if (!stack.isEmpty() && stack.peek()[0] == c) {
            stack.peek()[1]++;               // grow the current run
            if (stack.peek()[1] == k) stack.pop();   // run hit k, remove it
        } else {
            stack.push(new int[]{c, 1});     // start a new run
        }
    }
    StringBuilder sb = new StringBuilder();
    List<int[]> entries = new ArrayList<>(stack);
    Collections.reverse(entries);            // bottom-to-top order
    for (int[] e : entries) {
        for (int t = 0; t < e[1]; t++) sb.append((char) e[0]);
    }
    return sb.toString();
}`,
        walkthrough: [
          's="deeedbbcccbdaa", k=3. Push d(1). e: push e, count grows to 3 → pop. d on top now? top is d(1), incoming d → wait next char after eee is d: top d count 1→2.',
          "Continue: b(1),b(2); c(1),c(2),c(3)→pop; top b(2), next b→3→pop; top d(2), next d→3→pop; then a(1),a(2).",
          "Stack holds a with count 2 → expand to \"aa\".",
        ],
      },
    ],
    edgeCases: [
      "No run reaches k → the string is returned unchanged.",
      "Entire string collapses → empty string.",
      "Large k with short runs → counts never reach k, so nothing is removed (counts keep it O(n) regardless of k).",
    ],
    twists: [
      "**Remove All Adjacent Duplicates In String** (in the library) → the special case k = 2 cancelling pairs.",
      "**Minimum String Length After Removing Substrings** (in this set's sibling wave) → cancel specific adjacent pairs rather than equal runs.",
      "**Run-length encode the result** → return the compressed (char,count) form directly instead of expanding.",
    ],
    related: ["remove-all-adjacent-duplicates-in-string", "make-the-string-great", "asteroid-collision"],
  },

  {
    slug: "build-an-array-with-stack-operations",
    title: "Build an Array With Stack Operations",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 1441,
    statement:
      'You are given an integer array `target` (strictly increasing) and an integer `n`. The stream `1, 2, ..., n` is read in order. For each number you may "Push" it onto a stack, and you may "Pop" the top right after a push to discard it. Build the stack so that, reading top-to-bottom or as a final sequence, it equals `target`. Return the list of operations ("Push"/"Pop") that produces exactly `target`.',
    examples: [
      { in: "target = [1,3], n = 3", out: '["Push","Pop","Push","Push"]', explanation: "push 1 (keep), push 2 then pop it (skip), push 3 (keep) → stack reads [1,3]" },
      { in: "target = [1,2,3], n = 3", out: '["Push","Push","Push"]', explanation: "keep all three" },
      { in: "target = [1,2], n = 4", out: '["Push","Push"]', explanation: "stop once target is built; ignore 3 and 4" },
    ],
    constraints: ["1 ≤ target.length ≤ 100", "1 ≤ n ≤ 100", "1 ≤ target[i] ≤ n", "target is strictly increasing"],
    recognize:
      "Reproducing a subsequence of `1..n` using push/pop is a **simulated stack walk**: read the stream in order; push every number, and immediately pop the ones that are not in `target`.",
    figureItOut: [
      "The stream gives you 1, 2, 3, ... n strictly in order, and target is a strictly increasing subset of those. Every number must be pushed (that is the only way to consider it), but numbers NOT in target must be popped off immediately so they do not remain on the stack.",
      "Walk the stream value v from 1 upward, tracking a pointer into target. If v equals the next wanted target value, push it and advance the target pointer (keep it). If v is smaller than the next wanted value, it is a number to skip: push then pop.",
      "Because target is increasing and a subset of 1..n, you never need to skip a wanted value — the next target element always appears later in the stream. So a single forward scan suffices.",
      "Stop as soon as the target pointer reaches the end: any remaining stream numbers are irrelevant, so you emit no operations for them (matching the example where n exceeds the last target value).",
      "Each stream number up to the last target value produces one or two operations, so the work is O(target.last) ≤ O(n). The 'stack' is conceptual; you only emit the operation strings — O(n) time and O(1) extra space beyond the output.",
    ],
    approaches: [
      {
        name: "Simulate the stream: Push always, Pop the unwanted (optimal)",
        intuition: "Scan 1..n; push each number, and pop it immediately when it is not the next target value, stopping once target is complete.",
        time: "O(n)",
        timeWhy: "One pass over the stream up to the last target value.",
        space: "O(1)",
        spaceWhy: "Only a target pointer, beyond the output list.",
        code: `List<String> buildArray(int[] target, int n) {
    List<String> ops = new ArrayList<>();
    int j = 0;                          // index into target
    for (int v = 1; v <= n && j < target.length; v++) {
        ops.add("Push");
        if (target[j] == v) {
            j++;                        // keep this number
        } else {
            ops.add("Pop");             // discard the unwanted number
        }
    }
    return ops;
}`,
        walkthrough: [
          "target=[1,3], n=3. v=1: Push; target[0]=1==1 → keep, j=1. v=2: Push; target[1]=3 != 2 → Pop.",
          "v=3: Push; target[1]=3==3 → keep, j=2. j reaches length → loop ends.",
          'Operations ["Push","Pop","Push","Push"].',
        ],
      },
    ],
    edgeCases: [
      "target equals 1..m for some m → all pushes, no pops.",
      "target ends before n → stop early; no operations for the leftover stream numbers.",
      "Single-element target deep in the stream → push/pop everything before it, then a final push.",
    ],
    twists: [
      "**Validate Stack Sequences** (in the library) → given push AND pop sequences, decide if they are consistent.",
      "**Minimum operations variant** → minimise total operations (here it is already forced by the rules).",
      "**Output the stack contents** → instead of operations, return the resulting stack to confirm it equals target.",
    ],
    related: ["validate-stack-sequences", "asteroid-collision", "min-stack"],
  },

  {
    slug: "clear-digits",
    title: "Clear Digits",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 3174,
    statement:
      "You are given a string `s` of lowercase letters and digits. Repeatedly perform this operation until no digit remains: delete the **first** digit and the **closest non-digit character to its left**. Return the resulting string after all digits are removed.",
    examples: [
      { in: 's = "abc"', out: '"abc"', explanation: "no digits, nothing to remove" },
      { in: 's = "cb34"', out: '""', explanation: "3 removes b → cb4... remove: first digit 3 deletes closest left letter b → c4; first digit 4 deletes c → empty" },
      { in: 's = "a1b2"', out: '""', explanation: "1 removes a, then 2 removes b → empty" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s consists of lowercase letters and digits", "the input guarantees every digit can be cleared"],
    recognize:
      "'Each digit deletes the nearest letter to its left' is a textbook **stack cancellation**: push letters; when a digit arrives, pop the most recent letter (the closest one to its left).",
    figureItOut: [
      "When a digit appears, it removes the closest NON-DIGIT to its left and itself. 'Closest character to the left that is still present' is exactly what the top of a stack represents as you scan left to right.",
      "Process the string left to right, pushing each LETTER onto a stack. The stack top is always the nearest surviving letter to the left of the current position.",
      "When you encounter a DIGIT, it pairs with and deletes the closest surviving letter on its left — so simply pop the top of the stack. The digit itself is never pushed; it just consumes one letter.",
      "Because you always pop the most recent letter, the 'closest to the left' rule is satisfied automatically, and the cascading effect (a later digit then sees an even earlier letter) is handled because the stack re-exposes the prior letter after a pop.",
      "After scanning, the stack holds exactly the letters that were never deleted, in order. Build the result from the stack bottom-to-top. Each character is pushed/popped at most once → O(n) time, O(n) space.",
    ],
    approaches: [
      {
        name: "Stack popping a letter per digit (optimal)",
        intuition: "Push letters; each digit pops the most recent surviving letter, which is the closest one to its left.",
        time: "O(n)",
        timeWhy: "Each character is processed once with O(1) stack work.",
        space: "O(n)",
        spaceWhy: "The stack of surviving letters.",
        code: `String clearDigits(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (Character.isDigit(c)) {
            if (!stack.isEmpty()) stack.pop();   // delete closest left letter
        } else {
            stack.push(c);
        }
    }
    StringBuilder sb = new StringBuilder();
    Iterator<Character> it = stack.descendingIterator(); // bottom to top
    while (it.hasNext()) sb.append(it.next());
    return sb.toString();
}`,
        walkthrough: [
          's="cb34". c push [c]; b push [c,b]; digit 3 → pop b → [c]; digit 4 → pop c → [].',
          "Stack is empty after all digits cleared.",
          'Result "".',
        ],
      },
    ],
    edgeCases: [
      "No digits → the whole string survives unchanged.",
      "Equal digits and letters that fully cancel → empty result.",
      "A digit guaranteed to have a letter to its left by the problem constraints → no empty-pop concern, but the guard is kept for safety.",
    ],
    twists: [
      "**Backspace String Compare** (in the library) → a # acts like a digit, popping the previous character.",
      "**Removing Stars From a String** (in the library) → a star pops the closest left character — the same stack move.",
      "**Keep the deleted pairs** → record which (digit, letter) pairs cancelled instead of discarding them.",
    ],
    related: ["backspace-string-compare", "removing-stars-from-a-string", "remove-all-adjacent-duplicates-in-string"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "count-negative-numbers-in-a-sorted-matrix",
    title: "Count Negative Numbers in a Sorted Matrix",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 1351,
    statement:
      "Given an `m x n` matrix `grid` sorted in **non-increasing** order both row-wise (left to right) and column-wise (top to bottom), return the number of **negative** numbers in `grid`.",
    examples: [
      { in: "grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]]", out: "8", explanation: "there are 8 negative numbers across the matrix" },
      { in: "grid = [[3,2],[1,0]]", out: "0", explanation: "no negative numbers" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 100", "-100 ≤ grid[i][j] ≤ 100", "each row and column is sorted non-increasing"],
    recognize:
      "Each row is sorted non-increasing, so the negatives form a suffix — the count per row is found by **binary search** for the first negative; the double-sorting also enables an O(m+n) staircase walk.",
    figureItOut: [
      "Within a single row, values go non-increasing left to right, so once you hit a negative every value after it is also negative. The negatives are a contiguous SUFFIX of each row — and a suffix boundary is exactly what binary search locates.",
      "For each row, binary-search the FIRST index whose value is negative. If that index is f, then the row contributes (n - f) negatives. Summing over all m rows gives the total in O(m log n).",
      "There is an even slicker O(m+n) method that uses BOTH sort directions: start at the bottom-left corner. If that value is negative, then every value above it in this column is larger (column non-increasing downward means smaller going down) — wait, carefully: column is non-increasing top to bottom, so the bottom-left is the smallest in its column.",
      "Staircase walk: stand at row r (bottom) and column c (left). If grid[r][c] < 0, all elements to its RIGHT in this row are also negative (row non-increasing), so add (n - c) and move UP a row. If grid[r][c] >= 0, move RIGHT a column. Each step moves up or right once.",
      "The per-row binary search is O(m log n); the staircase walk is O(m + n) time and O(1) space. Both beat the trivial O(m*n) scan by exploiting the sortedness.",
    ],
    approaches: [
      {
        name: "Binary search the first negative in each row",
        intuition: "Negatives form a suffix of each row; binary-search its start and add the suffix length.",
        time: "O(m log n)",
        timeWhy: "A binary search per row over n columns.",
        space: "O(1)",
        spaceWhy: "Only counters and bounds.",
        code: `int countNegatives(int[][] grid) {
    int n = grid[0].length;
    int total = 0;
    for (int[] row : grid) {
        int lo = 0, hi = n;          // find first index with row[idx] < 0
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (row[mid] < 0) hi = mid;
            else lo = mid + 1;
        }
        total += n - lo;             // suffix of negatives
    }
    return total;
}`,
      },
      {
        name: "Staircase walk from the bottom-left (optimal)",
        intuition: "From the bottom-left, a negative means the whole rest of the row is negative (add and go up); a non-negative means go right.",
        time: "O(m + n)",
        timeWhy: "Each step moves up or right exactly once.",
        space: "O(1)",
        spaceWhy: "Two index variables and a counter.",
        code: `int countNegatives(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int r = m - 1, c = 0;            // bottom-left corner
    int total = 0;
    while (r >= 0 && c < n) {
        if (grid[r][c] < 0) {
            total += n - c;          // this and everything to the right are negative
            r--;                     // move up a row
        } else {
            c++;                     // move right a column
        }
    }
    return total;
}`,
        walkthrough: [
          "grid bottom row [-1,-1,-2,-3], start r=3,c=0: grid[3][0]=-1<0 → add 4-0=4, r=2.",
          "r=2,c=0: grid[2][0]=1>=0 → c=1. grid[2][1]=1>=0 → c=2. grid[2][2]=-1<0 → add 4-2=2, r=1. r=1,c=2: grid[1][2]=1>=0 → c=3. grid[1][3]=-1<0 → add 4-3=1, r=0. r=0,c=3: grid[0][3]=-1<0 → add 1, r=-1.",
          "Total 4+2+1+1 = 8.",
        ],
      },
    ],
    edgeCases: [
      "No negative numbers → answer 0 (the walk runs off the right edge).",
      "All negative numbers → answer m*n (the walk goes straight up adding full rows).",
      "Single row or single column → both methods degrade gracefully to a one-dimensional scan.",
    ],
    twists: [
      "**Search a 2D Matrix II** (in the library) → the same staircase walk to SEARCH for a target instead of counting.",
      "**Count values >= threshold** → shift the comparison; the suffix/staircase structure is unchanged.",
      "**Kth smallest in a sorted matrix** → binary search on the value with a count-less-than helper.",
    ],
    related: ["search-a-2d-matrix-ii", "binary-search", "search-insert-position"],
  },

  {
    slug: "minimum-limit-of-balls-in-a-bag",
    title: "Minimum Limit of Balls in a Bag",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1760,
    statement:
      "You are given an array `nums` where `nums[i]` is the number of balls in the i-th bag, and an integer `maxOperations`. In one operation you may take any bag and split it into two bags with positive integer counts. The **penalty** is the maximum number of balls in any bag. Return the minimum possible penalty after performing at most `maxOperations` operations.",
    examples: [
      { in: "nums = [9], maxOperations = 2", out: "3", explanation: "split 9 into 6,3 then 6 into 3,3 → bags [3,3,3], max is 3" },
      { in: "nums = [2,4,8,2], maxOperations = 4", out: "2", explanation: "split the 8 and 4 down until every bag has at most 2" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^5", "1 ≤ maxOperations, nums[i] ≤ 10^9"],
    recognize:
      "'Minimise the maximum bag size achievable within a split budget' is **binary search on the answer**: for a candidate cap, the splits needed are monotonic, so search the smallest feasible cap.",
    figureItOut: [
      "The penalty we minimise is a maximum bag size. Suppose we GUESS a target cap c — every bag must end up with at most c balls. The question becomes: how many splits does it take to get every bag down to size <= c?",
      "A bag of size b split optimally into pieces of size at most c needs ceil(b / c) pieces, which costs ceil(b / c) - 1 splits (each split adds one piece). So the total operations to enforce cap c is the sum over all bags of (ceil(nums[i] / c) - 1).",
      "That operation count is MONOTONIC in c: a larger cap allows bigger pieces, so fewer splits are needed. As c decreases, required splits only increase. So feasibility ('splits needed <= maxOperations') flips from false to true at one threshold cap — exactly the setup for binary search.",
      "Search c in [1, max(nums)]: a cap equal to the largest bag needs zero splits (always feasible), and we want the SMALLEST feasible cap. If a candidate c needs <= maxOperations splits, it is feasible → try a smaller c. Otherwise c is too small → go larger.",
      "Each feasibility check sums ceil(nums[i]/c) - 1 over n bags in O(n); binary search runs O(log(maxValue)) times → O(n log(maxValue)) time, O(1) space. ceil(b/c) is computed as (b + c - 1) / c; use long if needed though values fit in int here.",
    ],
    approaches: [
      {
        name: "Binary search on the penalty cap + count splits (optimal)",
        intuition: "Splits needed for a cap c is non-increasing in c; binary-search the smallest cap whose splits fit the budget.",
        time: "O(n log(maxValue))",
        timeWhy: "An O(n) split-count sum inside a binary search over the value range.",
        space: "O(1)",
        spaceWhy: "Only counters and search bounds.",
        code: `int minimumSize(int[] nums, int maxOperations) {
    int hi = 0;
    for (int b : nums) hi = Math.max(hi, b);
    int lo = 1, answer = hi;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;     // candidate cap
        if (splitsNeeded(nums, mid) <= maxOperations) {
            answer = mid;                 // feasible, try a smaller cap
            hi = mid - 1;
        } else {
            lo = mid + 1;                 // too small, allow a bigger cap
        }
    }
    return answer;
}

// operations to make every bag have at most cap balls
private long splitsNeeded(int[] nums, int cap) {
    long ops = 0;
    for (int b : nums) ops += (b - 1) / cap;   // ceil(b/cap) - 1
    return ops;
}`,
        walkthrough: [
          "nums=[9], maxOperations=2. Range [1,9]. mid=5: (9-1)/5=1 split <=2 → feasible, answer=5, hi=4.",
          "mid=2: (9-1)/2=4 >2 → too small, lo=3. mid=3: (9-1)/3=2 <=2 → feasible, answer=3, hi=2. lo>hi stop.",
          "Answer = 3.",
        ],
      },
    ],
    edgeCases: [
      "maxOperations large enough to split everything to 1 → answer 1.",
      "No splits allowed (and only needed) → answer is the original maximum bag.",
      "Single huge bag → repeated halving via the ceil formula determines the cap.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary search on an eating rate with a monotonic hours-needed sum.",
      "**Cutting Ribbons** (in this set's sibling wave) → binary search on a piece length maximising rather than minimising.",
      "**Split Array Largest Sum** (in the library) → binary search on a subarray-sum cap with a greedy feasibility check.",
    ],
    related: ["koko-eating-bananas", "split-array-largest-sum", "binary-search"],
  },
];
