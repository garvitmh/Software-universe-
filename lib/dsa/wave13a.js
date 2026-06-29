// NeetCode/Top-150 — wave 13a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave12a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE13A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "ransom-note",
    title: "Ransom Note",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 383,
    statement:
      "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine`. Each letter in `magazine` can be used **at most once**.",
    examples: [
      { in: 'ransomNote = "a", magazine = "b"', out: "false", explanation: "magazine has no 'a'" },
      { in: 'ransomNote = "aa", magazine = "ab"', out: "false", explanation: "only one 'a' available but two needed" },
      { in: 'ransomNote = "aa", magazine = "aab"', out: "true", explanation: "two 'a's available, both used once" },
    ],
    constraints: ["1 ≤ ransomNote.length, magazine.length ≤ 10⁵", "both consist of lowercase English letters"],
    recognize:
      "'Can these letters be assembled from that supply, each used once' is a **letter-supply check**: count how many of each letter the magazine offers, then confirm the note never demands more than the supply of any letter.",
    figureItOut: [
      "The order of letters is irrelevant; only how many of each letter you have versus how many you need. That immediately points to counting, not scanning for substrings.",
      "Count every letter in magazine into a 26-slot tally — this is your supply. Each slot says how many copies of that letter are available.",
      "Now walk the note and, for each required letter, consume one from the supply by decrementing its slot. If a slot would go negative, the magazine ran out of that letter and you must return false.",
      "Decrementing as you go is what enforces the 'at most once' rule: every letter the note uses subtracts exactly one from what remains, so reuse is impossible.",
      "One pass to build the supply and one pass to consume it, each O(1) per character over a fixed alphabet → O(n + m) time, O(1) space (the 26-slot array).",
    ],
    approaches: [
      {
        name: "Count magazine, decrement per note letter (optimal)",
        intuition: "Tally the magazine's letters, then subtract one for each note letter; any shortfall fails.",
        time: "O(n + m)",
        timeWhy: "One pass over the magazine to count and one over the note to consume.",
        space: "O(1)",
        spaceWhy: "A fixed array of 26 counts regardless of input length.",
        code: `boolean canConstruct(String ransomNote, String magazine) {
    int[] supply = new int[26];
    for (int i = 0; i < magazine.length(); i++) {
        supply[magazine.charAt(i) - 'a']++;
    }
    for (int i = 0; i < ransomNote.length(); i++) {
        int idx = ransomNote.charAt(i) - 'a';
        if (--supply[idx] < 0) return false; // ran out of this letter
    }
    return true;
}`,
        walkthrough: [
          'ransomNote="aa", magazine="aab". supply: a=2, b=1.',
          "note[0]='a' → supply a becomes 1 (ok). note[1]='a' → supply a becomes 0 (ok).",
          "No slot went negative → return true.",
        ],
      },
    ],
    edgeCases: [
      "Note longer than magazine → some letter must run short → false (caught by a negative slot).",
      "Note needs a letter the magazine lacks entirely → that slot starts at 0, decrement to -1 → false.",
      "Empty-effect note (single letter present in magazine) → trivially true.",
    ],
    twists: [
      "**Valid Anagram** (in the library) → both strings must use exactly the same letters, so counts must match in both directions.",
      "**Maximum Number of Balloons** (in the library) → same supply idea, but counting how many copies of a fixed word fit.",
      "**Find Words That Can Be Formed by Characters** (in this file) → the supply check applied to many candidate words.",
    ],
    related: ["valid-anagram", "maximum-number-of-balloons", "find-words-that-can-be-formed-by-characters"],
  },

  {
    slug: "find-words-that-can-be-formed-by-characters",
    title: "Find Words That Can Be Formed by Characters",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1160,
    statement:
      "You are given an array of strings `words` and a string `chars`. A string is **good** if it can be formed using the letters in `chars` (each letter used **at most once** per word). Return the **sum of lengths** of all good strings in `words`.",
    examples: [
      { in: 'words = ["cat","bt","hat","tree"], chars = "atach"', out: "6", explanation: '"cat" and "hat" are good; 3 + 3 = 6' },
      { in: 'words = ["hello","world","leetcode"], chars = "welldonehoneyr"', out: "10", explanation: '"hello" and "world" are good; 5 + 5 = 10' },
    ],
    constraints: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length, chars.length ≤ 100", "all strings consist of lowercase English letters"],
    recognize:
      "Each word is an independent **letter-supply check** against the same `chars` budget — count chars once, then for every word verify it never demands more of any letter than chars supplies, summing the lengths that pass.",
    figureItOut: [
      "The shared resource is `chars`, and crucially each word is checked against the FULL chars budget independently — letters are not consumed across words. So count chars once and reuse that tally.",
      "Build a fixed 26-slot supply from chars. For a single word, count its own letters and compare: the word is good only if, for every letter, the word needs no more than the supply has.",
      "If any letter in the word exceeds the supply count, the word fails immediately and contributes nothing.",
      "If the word passes the full comparison, add its length to a running total. Because each word is independent, you re-read the same supply tally for every word without resetting chars.",
      "Counting chars is O(m); each word costs O(len(word)) to tally and O(26) to compare → overall O(m + total length of words) time, O(1) space (fixed 26-slot arrays).",
    ],
    approaches: [
      {
        name: "Reusable char supply, per-word comparison (optimal)",
        intuition: "Count chars once; each word is good if its own letter counts never exceed the supply.",
        time: "O(m + L)",
        timeWhy: "m to count chars, L = total length of all words to tally and compare each.",
        space: "O(1)",
        spaceWhy: "Two fixed 26-slot arrays independent of input size.",
        code: `int countCharacters(String[] words, String chars) {
    int[] supply = new int[26];
    for (int i = 0; i < chars.length(); i++) {
        supply[chars.charAt(i) - 'a']++;
    }
    int total = 0;
    for (String word : words) {
        int[] need = new int[26];
        boolean good = true;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            need[idx]++;
            if (need[idx] > supply[idx]) { good = false; break; }
        }
        if (good) total += word.length();
    }
    return total;
}`,
        walkthrough: [
          'chars="atach" → supply: a=2, t=1, c=1, h=1.',
          '"cat": needs c=1,a=1,t=1, all within supply → good, add 3. "bt": b not in supply → fails.',
          '"hat": h=1,a=1,t=1 all within supply → good, add 3. "tree": needs r/e absent → fails. Total = 6.',
        ],
      },
    ],
    edgeCases: [
      "A word repeating a letter more times than chars provides → fails on the count comparison.",
      "A word using a letter absent from chars → supply slot 0, fails immediately.",
      "No good words → total stays 0.",
    ],
    twists: [
      "**Ransom Note** (in this file) → the same supply check for a single target string, but letters are consumed once.",
      "**Maximum Number of Balloons** (in the library) → counting copies of one fixed word rather than checking many words.",
      "**Letters consumed across words** → if chars were shared, you would decrement the supply and process words greedily instead.",
    ],
    related: ["ransom-note", "valid-anagram", "maximum-number-of-balloons"],
  },

  {
    slug: "find-players-with-zero-or-one-losses",
    title: "Find Players With Zero or One Losses",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 2225,
    statement:
      "You are given `matches` where `matches[i] = [winner, loser]`. Return a list of two lists: the **players with no losses** (sorted ascending) and the **players with exactly one loss** (sorted ascending). Include only players who have played at least one match.",
    examples: [
      { in: "matches = [[1,3],[2,3],[3,6],[5,6],[5,7],[4,5],[4,8],[4,9],[10,4],[10,9]]", out: "[[1,2,10],[4,5,7,8]]", explanation: "1,2,10 never lost; 4,5,7,8 lost exactly once" },
      { in: "matches = [[2,3],[1,3],[5,4],[6,4]]", out: "[[1,2,5,6],[]]", explanation: "1,2,5,6 never lost; nobody has exactly one loss" },
    ],
    constraints: ["1 ≤ matches.length ≤ 10⁵", "matches[i].length == 2", "1 ≤ winner, loser ≤ 10⁵", "each match is unique"],
    recognize:
      "You need a per-player **loss count**, then bucket by that count (0 or 1). A hash map from player → number of losses, with winners recorded at zero, captures everyone; sorting the two buckets gives the ordered answer.",
    figureItOut: [
      "The only attribute that matters per player is how many times they LOST. So the core data structure is a map from player id to a loss count.",
      "A subtlety: a player with zero losses still must appear, but they only show up as winners. So when you see a winner, ensure they exist in the map with a default of 0 losses; when you see a loser, increment their count.",
      "Use getOrDefault so the first time you touch any player they start at 0. Winners get put-if-absent at 0 (never incremented), losers get +1 each appearance.",
      "After processing every match, scan the map: count 0 goes to the zero-loss bucket, count 1 goes to the one-loss bucket, anything more is ignored.",
      "Map building is O(n). The two answer buckets together hold at most all distinct players, and sorting them is O(p log p) where p is the number of players → O(n + p log p) time, O(p) space.",
    ],
    approaches: [
      {
        name: "Loss-count map + bucket and sort (optimal)",
        intuition: "Track losses per player (winners default to 0); collect players with 0 and 1 losses, then sort each list.",
        time: "O(n + p log p)",
        timeWhy: "One pass over n matches, then sorting the p distinct players in the answer buckets.",
        space: "O(p)",
        spaceWhy: "A map and two lists sized by the number of distinct players.",
        code: `List<List<Integer>> findWinners(int[][] matches) {
    Map<Integer, Integer> losses = new HashMap<>();
    for (int[] m : matches) {
        losses.putIfAbsent(m[0], 0);                 // winner seen, 0 losses if new
        losses.put(m[1], losses.getOrDefault(m[1], 0) + 1); // loser +1
    }
    List<Integer> zero = new ArrayList<>();
    List<Integer> one = new ArrayList<>();
    for (Map.Entry<Integer, Integer> e : losses.entrySet()) {
        if (e.getValue() == 0) zero.add(e.getKey());
        else if (e.getValue() == 1) one.add(e.getKey());
    }
    Collections.sort(zero);
    Collections.sort(one);
    List<List<Integer>> result = new ArrayList<>();
    result.add(zero);
    result.add(one);
    return result;
}`,
        walkthrough: [
          "matches=[[2,3],[1,3],[5,4],[6,4]]. After pass: 2->0, 1->0, 5->0, 6->0, 3->2, 4->2.",
          "Zero-loss players: 1,2,5,6. One-loss players: none (3 and 4 each lost twice).",
          "Sort → [[1,2,5,6],[]].",
        ],
      },
    ],
    edgeCases: [
      "A player who only ever wins → stays at 0 losses via putIfAbsent, lands in the first bucket.",
      "A player with two or more losses → excluded from both buckets.",
      "No one with exactly one loss → the second list is empty (still returned).",
    ],
    twists: [
      "**Use a fixed array instead of a map** → since ids are bounded by 10⁵, a counts array plus a seen flag avoids hashing overhead.",
      "**Destination City** (in the library) → another 'who appears only on one side' question solved with sets/maps.",
      "**Report players with k losses** → generalize the bucket condition to an arbitrary k.",
    ],
    related: ["destination-city", "contains-duplicate", "unique-number-of-occurrences"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "3sum-smaller",
    title: "3Sum Smaller",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 259,
    statement:
      "Given an array of `n` integers `nums` and a `target`, find the **number of index triplets** `i < j < k` such that `nums[i] + nums[j] + nums[k] < target`.",
    examples: [
      { in: "nums = [-2,0,1,3], target = 2", out: "2", explanation: "the triplets [-2,0,1] and [-2,0,3] each sum below 2" },
      { in: "nums = [], target = 0", out: "0" },
      { in: "nums = [0], target = 0", out: "0" },
    ],
    constraints: ["0 ≤ n ≤ 3500", "−100 ≤ nums[i] ≤ 100", "−100 ≤ target ≤ 100"],
    recognize:
      "Counting triplets under a sum threshold becomes tractable once **sorted**: fix the smallest element, then run a **converging two-pointer** over the remainder, exploiting that if a pair already sums small enough, every pair shrinking the right pointer also does — counting a whole block at once.",
    figureItOut: [
      "Order of indices does not affect the sum, so sort the array first; this lets you reason about magnitudes monotonically and use two pointers.",
      "Fix the leftmost element of the triplet at index i. Now you need pairs (j, k) with j < k inside nums[i+1..n-1] whose sum is < target − nums[i].",
      "Place left = i+1 and right = n−1. If nums[left] + nums[right] < remaining, then because the array is sorted, EVERY k from left+1 up to right also pairs with left to stay under the bound — that is (right − left) valid pairs at once. So add (right − left) and move left rightward.",
      "If the pair sum is too big, the only way to shrink it is to pull right inward (drop the largest element), so decrement right.",
      "Each fixed i runs a linear two-pointer sweep, so it is O(n) per i and O(n²) overall after the O(n log n) sort. O(1) extra space beyond sorting.",
    ],
    approaches: [
      {
        name: "Brute force three nested loops",
        intuition: "Try every triplet i<j<k and count those summing below target.",
        time: "O(n³)",
        timeWhy: "Three nested loops over all index triplets.",
        space: "O(1)",
        spaceWhy: "Only a counter.",
        code: `int threeSumSmaller(int[] nums, int target) {
    int n = nums.length, count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                if (nums[i] + nums[j] + nums[k] < target) count++;
            }
        }
    }
    return count;
}`,
      },
      {
        name: "Sort + fix one, two-pointer count (optimal)",
        intuition: "Sort, fix the smallest of the triplet, then count valid pairs in a block whenever a pair already fits under the threshold.",
        time: "O(n²)",
        timeWhy: "O(n log n) sort plus an O(n) two-pointer sweep for each of the n fixed elements.",
        space: "O(1)",
        spaceWhy: "Pointers and a counter; sorting is in place.",
        code: `int threeSumSmaller(int[] nums, int target) {
    Arrays.sort(nums);
    int n = nums.length, count = 0;
    for (int i = 0; i < n - 2; i++) {
        int left = i + 1, right = n - 1;
        while (left < right) {
            if (nums[i] + nums[left] + nums[right] < target) {
                count += right - left; // all k in (left, right] also work
                left++;
            } else {
                right--; // sum too big, drop the largest
            }
        }
    }
    return count;
}`,
        walkthrough: [
          "nums sorted = [-2,0,1,3], target=2. i=0 (-2): left=1(0), right=3(3) sum=1<2 → add right-left=2, left=2.",
          "left=2(1), right=3(3) sum=2 not <2 → right=2, loop ends (left==right). i=1 (0): left=2(1),right=3(3) sum=4 not<2 → right--, ends.",
          "Total count = 2.",
        ],
      },
    ],
    edgeCases: [
      "Fewer than three elements → no triplet exists → 0.",
      "All triplets exceed the target → count stays 0.",
      "Negative numbers → handled naturally since sorting orders them and the block-count logic still holds.",
    ],
    twists: [
      "**3Sum** (in the library) → find triplets summing to exactly zero, collecting them rather than counting.",
      "**3Sum Closest** (in the library) → track the closest achievable sum instead of counting under a bound.",
      "**Two Sum II** (in the library) → the inner two-pointer step is exactly the sorted two-sum primitive.",
    ],
    related: ["3sum", "3sum-closest", "two-sum-ii"],
  },

  {
    slug: "sort-array-by-parity-ii",
    title: "Sort Array By Parity II",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 922,
    statement:
      "Given an array `nums`, half the integers are odd and half are even. Rearrange it so that whenever `nums[i]` is **even**, `i` is **even**, and whenever `nums[i]` is **odd**, `i` is **odd**. Return any array satisfying this.",
    examples: [
      { in: "nums = [4,2,5,7]", out: "[4,5,2,7]", explanation: "evens at indices 0,2 and odds at indices 1,3 (any valid arrangement accepted)" },
      { in: "nums = [2,3]", out: "[2,3]", explanation: "already valid" },
    ],
    constraints: ["2 ≤ nums.length ≤ 2·10⁴", "nums.length is even", "half of nums are even, half are odd", "0 ≤ nums[i] ≤ 1000"],
    recognize:
      "Two interleaved slots (even indices want evens, odd indices want odds) is a **two-pointer placement**: one pointer walks even indices seeking a misplaced even slot, another walks odd indices seeking a misplaced odd slot, and a single swap fixes both.",
    figureItOut: [
      "There are two independent streams of positions: even indices 0,2,4,... which must hold even values, and odd indices 1,3,5,... which must hold odd values. Track each with its own pointer.",
      "Advance the even pointer i (over even indices) until it finds a slot whose value is ODD — that value is out of place and belongs at an odd index.",
      "Advance the odd pointer j (over odd indices) until it finds a slot whose value is EVEN — also misplaced, belonging at an even index.",
      "Now i holds an odd value (wrong for an even index) and j holds an even value (wrong for an odd index). A single swap puts both in the correct parity slot simultaneously.",
      "Each pointer only moves forward over its own index stream, so together they cover the array once → O(n) time, O(1) extra space (fully in place).",
    ],
    approaches: [
      {
        name: "Two-pass with extra array",
        intuition: "Place evens at even indices and odds at odd indices using a fresh output array.",
        time: "O(n)",
        timeWhy: "One pass to distribute values into the result.",
        space: "O(n)",
        spaceWhy: "A separate output array of size n.",
        code: `int[] sortArrayByParityII(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    int even = 0, odd = 1;
    for (int v : nums) {
        if (v % 2 == 0) { result[even] = v; even += 2; }
        else { result[odd] = v; odd += 2; }
    }
    return result;
}`,
      },
      {
        name: "In-place two pointers over the two index streams (optimal)",
        intuition: "Find an odd value sitting at an even index and an even value at an odd index, then swap them.",
        time: "O(n)",
        timeWhy: "Each pointer traverses its own half of the indices once.",
        space: "O(1)",
        spaceWhy: "Swaps in place; only two index pointers.",
        code: `int[] sortArrayByParityII(int[] nums) {
    int n = nums.length;
    int i = 0, j = 1; // even-index pointer, odd-index pointer
    while (i < n && j < n) {
        if (nums[i] % 2 == 0) { i += 2; continue; }     // even slot ok
        if (nums[j] % 2 == 1) { j += 2; continue; }     // odd slot ok
        int tmp = nums[i]; nums[i] = nums[j]; nums[j] = tmp; // swap the two misplaced values
        i += 2;
        j += 2;
    }
    return nums;
}`,
        walkthrough: [
          "nums=[4,2,5,7]. i=0 value 4 even → i=2. nums[2]=5 odd at even index → stop advancing i.",
          "j=1 value 2 even at odd index → stop advancing j. Swap nums[2] and nums[1] → [4,5,2,7]. i=4, j=3.",
          "i=4 not < n → loop ends. Result [4,5,2,7] satisfies the parity placement.",
        ],
      },
    ],
    edgeCases: [
      "Already valid arrangement → no swaps occur, array returned unchanged.",
      "Smallest case length 2 (one even, one odd) → at most a single swap.",
      "Many leading correct evens → the even pointer skips them quickly via the += 2 step.",
    ],
    twists: [
      "**Sort Array By Parity** (in the library) → the simpler version with no index-parity constraint, just evens before odds.",
      "**Move Zeroes** (in the library) → another in-place reposition, but order-preserving with a single write pointer.",
      "**Wiggle / interleave variants** → similar two-stream placement when alternating a property by index.",
    ],
    related: ["sort-array-by-parity", "move-zeroes", "sort-colors"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "maximum-erasure-value",
    title: "Maximum Erasure Value",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1695,
    statement:
      "You are given an array of positive integers `nums`. Erase a subarray containing **unique elements** (all distinct). Return the **maximum sum** of such a subarray.",
    examples: [
      { in: "nums = [4,2,4,5,6]", out: "17", explanation: "the subarray [2,4,5,6] has distinct elements summing to 17" },
      { in: "nums = [5,2,1,2,5,2,1,2,5]", out: "8", explanation: "the best distinct window is [5,2,1] or [1,2,5] summing to 8" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁴"],
    recognize:
      "'Longest/best contiguous run with all distinct values' is the classic **variable-size sliding window with a set**: extend the right edge, and when a duplicate appears, shrink from the left until the window is unique again — here tracking the window's running sum to maximize it.",
    figureItOut: [
      "The subarray must be contiguous AND have all-distinct values, which is exactly the 'longest substring without repeats' shape — only now you maximize a SUM rather than a length.",
      "Maintain a window [left..right] that is always duplicate-free. Use a set to know membership and a running sum of the window's elements.",
      "Push right outward one element at a time. If nums[right] is already in the set, you have a duplicate; you must shrink from the left, removing nums[left] from the set and subtracting it from the sum, until the duplicate is gone.",
      "After restoring uniqueness, add nums[right] to the set and to the running sum, then update the best sum seen. Every window the right pointer closes on is the maximal distinct window ending there.",
      "Each element enters the window once (right) and leaves at most once (left), so the pointers move O(n) total; with O(1) set operations → O(n) time, O(n) space for the set.",
    ],
    approaches: [
      {
        name: "Sliding window with a set and running sum (optimal)",
        intuition: "Keep a duplicate-free window; on a clash shrink from the left, always tracking the window sum and its max.",
        time: "O(n)",
        timeWhy: "Each element is added and removed from the window at most once.",
        space: "O(n)",
        spaceWhy: "A set holding the current window's distinct values.",
        code: `int maximumUniqueSubarray(int[] nums) {
    Set<Integer> window = new HashSet<>();
    int left = 0, sum = 0, best = 0;
    for (int right = 0; right < nums.length; right++) {
        while (window.contains(nums[right])) {
            window.remove(nums[left]);
            sum -= nums[left];
            left++;
        }
        window.add(nums[right]);
        sum += nums[right];
        best = Math.max(best, sum);
    }
    return best;
}`,
        walkthrough: [
          "nums=[5,2,1,2,5,2,1,2,5]. Window grows 5,2,1 (sum 8, best 8). right at 2 (value 2) duplicates → shrink removing 5 then 2.",
          "Window becomes [1] then adds 2 (sum 3), then 5 (sum 8) → best stays 8. Subsequent windows never exceed 8.",
          "Return 8.",
        ],
      },
    ],
    edgeCases: [
      "All elements distinct → the window spans the whole array → sum of everything.",
      "All elements equal → every window of size 1 → max single element.",
      "Single element → that element is the answer.",
    ],
    twists: [
      "**Longest Substring Without Repeating Characters** (in the library) → identical window-with-set mechanics, maximizing length instead of sum.",
      "**Subarray Product Less Than K** (in the library) → another shrink-on-violation window with a multiplicative constraint.",
      "**Track frequency instead of a set** → using a count map generalizes to 'at most k duplicates allowed'.",
    ],
    related: ["longest-substring-without-repeating", "subarray-product-less-than-k", "minimum-size-subarray-sum"],
  },

  {
    slug: "frequency-of-the-most-frequent-element",
    title: "Frequency of the Most Frequent Element",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1838,
    statement:
      "You are given an array `nums` and an integer `k`. In one operation you may increment any element by 1, and you may apply at most `k` operations total. Return the **maximum possible frequency** of any single value after performing the operations.",
    examples: [
      { in: "nums = [1,2,4], k = 5", out: "3", explanation: "raise 1→4 (3 ops) and 2→4 (2 ops), total 5; value 4 appears 3 times" },
      { in: "nums = [1,4,8,13], k = 5", out: "2", explanation: "e.g. raise 4→8 using 4 ops; value 8 appears twice" },
      { in: "nums = [3,9,6], k = 2", out: "1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁵", "1 ≤ k ≤ 10⁵"],
    recognize:
      "Since you can only INCREMENT, every element in a target group must be raised to the group's MAXIMUM. Sorting makes the best target the window's right end; the **sliding window** then asks: what is the longest window whose total raising cost (window_max·size − window_sum) stays within k?",
    figureItOut: [
      "Operations only increase values, so to make several elements equal you must raise them all up to the LARGEST in the chosen group — never down. That largest is the target value.",
      "Sort the array. Now any group you would equalize is naturally a contiguous window, and the cheapest target for a window is its rightmost (largest) element, since everything to its left is ≤ it.",
      "The cost to raise every element in window [left..right] up to nums[right] is nums[right]·(windowSize) − (sum of the window): each element needs (nums[right] − itself) increments, and summed that telescopes to target·count minus the window total.",
      "Slide a window: extend right, add nums[right] to a running sum, then while the cost exceeds k, drop nums[left] from the sum and advance left. The window length at each step is a feasible frequency; track the maximum.",
      "Sorting is O(n log n); the window sweep is O(n) with each pointer moving forward once → O(n log n) time, O(1) extra space (use a long for the sum to avoid overflow).",
    ],
    approaches: [
      {
        name: "Sort + sliding window on raising cost (optimal)",
        intuition: "Sort so the window's max is its right end; grow the window while the cost to lift all to that max stays within k.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort; the two-pointer sweep is linear.",
        space: "O(1)",
        spaceWhy: "Only pointers and a running sum (sorting is in place).",
        code: `int maxFrequency(int[] nums, int k) {
    Arrays.sort(nums);
    int left = 0, best = 1;
    long windowSum = 0;
    for (int right = 0; right < nums.length; right++) {
        windowSum += nums[right];
        // cost to raise all in [left,right] up to nums[right]
        while ((long) nums[right] * (right - left + 1) - windowSum > k) {
            windowSum -= nums[left];
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
}`,
        walkthrough: [
          "nums sorted=[1,2,4], k=5. right=0: window [1] cost 0, best 1. right=1: window [1,2], cost 2*2-3=1 ≤5, best 2.",
          "right=2: window [1,2,4], sum=7, cost 4*3-7=5 ≤5 → window length 3, best 3.",
          "Return 3.",
        ],
      },
    ],
    edgeCases: [
      "k too small to merge any two elements → answer is 1.",
      "All elements equal → cost is always 0, window spans everything → frequency n.",
      "Large values → the cost product can overflow int, so accumulate the sum and cost as long.",
    ],
    twists: [
      "**Allow decrements too** → the optimal target becomes the median of the window, a different cost model.",
      "**Minimum Size Subarray Sum** (in the library) → the same grow/shrink window, with a sum-threshold predicate.",
      "**Maximize count for a fixed target value** → drop the sort-driven right-end target and binary-search instead.",
    ],
    related: ["minimum-size-subarray-sum", "longest-repeating-character-replacement", "max-consecutive-ones-iii"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "basic-calculator-ii",
    title: "Basic Calculator II",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 227,
    statement:
      "Given a string `s` representing a valid arithmetic expression with non-negative integers and the operators `+`, `-`, `*`, `/` (and spaces), evaluate it. Integer division **truncates toward zero**. There are no parentheses.",
    examples: [
      { in: 's = "3+2*2"', out: "7", explanation: "2*2=4 then 3+4=7 (multiplication first)" },
      { in: 's = " 3/2 "', out: "1", explanation: "integer division truncates" },
      { in: 's = " 3+5 / 2 "', out: "5", explanation: "5/2=2 then 3+2=5" },
    ],
    constraints: ["1 ≤ s.length ≤ 3·10⁵", "s consists of digits, '+', '-', '*', '/', and spaces", "s is a valid expression", "all intermediate results fit in a 32-bit integer"],
    recognize:
      "Operator precedence without parentheses is the canonical **stack of pending terms**: push additive terms, but when a `*` or `/` follows, immediately fold it into the top of the stack — the final answer is the sum of everything left on the stack.",
    figureItOut: [
      "Without parentheses, the only complication is that * and / bind tighter than + and -. The trick: defer addition/subtraction to the very end, but resolve multiplication/division the moment you can.",
      "Keep a stack of numbers that will ultimately be summed. A leading number (or one after + ) is pushed as is; a number after - is pushed negated, turning subtraction into 'add a negative'.",
      "When the pending operator is * or /, the current number must combine with the PREVIOUS number immediately, because that product/quotient is a single term. Pop the top, apply the operation, and push the result back.",
      "Track the 'previous operator' (initialized to +): as you parse each complete number, act based on that operator, then remember the operator just read for the next number.",
      "Parse digits into a running number, handle the operator transition at each operator or at the end of the string, and finally sum the stack → one O(n) pass, O(n) stack space.",
    ],
    approaches: [
      {
        name: "Stack of signed terms, eager mul/div (optimal)",
        intuition: "Push +/- terms; fold * and / into the stack top as soon as the operand is known; sum the stack at the end.",
        time: "O(n)",
        timeWhy: "One pass over the characters with O(1) work each, plus a final O(n) sum.",
        space: "O(n)",
        spaceWhy: "The stack holds up to O(n) additive terms.",
        code: `int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int num = 0;
    char op = '+'; // operator preceding the current number
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        }
        if ((!Character.isDigit(c) && c != ' ') || i == s.length() - 1) {
            if (op == '+') stack.push(num);
            else if (op == '-') stack.push(-num);
            else if (op == '*') stack.push(stack.pop() * num);
            else stack.push(stack.pop() / num); // truncates toward zero
            op = c;
            num = 0;
        }
    }
    int result = 0;
    while (!stack.isEmpty()) result += stack.pop();
    return result;
}`,
        walkthrough: [
          's="3+5/2". Read 3, at \'+\' push 3, op=\'+\'. Read 5, at \'/\' op was \'+\' so push 5, op=\'/\'.',
          "Read 2 at end, op='/' → pop 5, push 5/2=2. Stack=[3,2].",
          "Sum = 3 + 2 = 5.",
        ],
      },
    ],
    edgeCases: [
      "Trailing/leading spaces and spaces between tokens → skipped, but the last digit must still flush at i == length−1.",
      "Division truncates toward zero (Java integer division already does this for non-negative operands here).",
      "A single number with no operator → pushed once and summed → itself.",
    ],
    twists: [
      "**Evaluate Reverse Polish Notation** (in the library) → operators already postfix, so a single value stack suffices with no precedence handling.",
      "**Basic Calculator (I)** → adds parentheses, requiring a recursive or sign-stack approach.",
      "**Constant-space variant** → replace the stack with a running total and a 'last term' to fold mul/div in place.",
    ],
    related: ["evaluate-reverse-polish-notation", "decode-string", "min-stack"],
  },

  {
    slug: "132-pattern",
    title: "132 Pattern",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 456,
    statement:
      "Given an array of `n` integers `nums`, a **132 pattern** is a subsequence `nums[i], nums[j], nums[k]` with `i < j < k` and `nums[i] < nums[k] < nums[j]`. Return `true` if such a pattern exists.",
    examples: [
      { in: "nums = [1,2,3,4]", out: "false", explanation: "strictly increasing, no value dips back between two earlier ones" },
      { in: "nums = [3,1,4,2]", out: "true", explanation: "the subsequence 1,4,2 satisfies 1 < 2 < 4" },
      { in: "nums = [-1,3,2,0]", out: "true", explanation: "-1,3,2 satisfies -1 < 2 < 3" },
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 2·10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    recognize:
      "Finding the '1<3<2' shape efficiently uses a **monotonic decreasing stack scanned right-to-left**: the stack holds candidate '3' (the large middle) values, and popping smaller elements off it reveals the largest valid '2' (the value that must beat some earlier '1').",
    figureItOut: [
      "Name the roles: '1' is the smallest and earliest, '3' is the largest in the middle, '2' is between them and last. The hard part is the order constraint i<j<k combined with the value constraint 1<2<3.",
      "Scan from the RIGHT. Maintain the best possible '2' seen so far — the largest value that already has a bigger '3' to its right (so it can serve as the middle-low). Call it 'third'. If the current element is less than 'third', it can be the '1' and we are done.",
      "How to maintain 'third'? Use a stack of potential '3' values. For the current nums[i], pop every stack value that is SMALLER than nums[i]; each popped value is a valid '2' (it had nums[i] as a larger '3' to consider), so set 'third' to the last one popped — the largest such '2'.",
      "After popping, push nums[i] as a new candidate '3'. The stack stays decreasing from bottom to top, and 'third' always records the maximum value that is dominated by some element still able to act as '3'.",
      "If at any i we find nums[i] < third, a full 1<2<3 exists. Each element is pushed and popped at most once → O(n) time, O(n) stack space.",
    ],
    approaches: [
      {
        name: "Brute force fix the middle",
        intuition: "For each j, look left for a smaller min ('1') and right for a value between that min and nums[j] ('2').",
        time: "O(n²)",
        timeWhy: "For each j a linear scan to validate the pattern.",
        space: "O(1)",
        spaceWhy: "Only a running minimum and indices.",
        code: `boolean find132pattern(int[] nums) {
    int n = nums.length;
    for (int j = 0; j < n; j++) {
        int min = Integer.MAX_VALUE;
        for (int i = 0; i < j; i++) min = Math.min(min, nums[i]);
        for (int k = j + 1; k < n; k++) {
            if (min < nums[k] && nums[k] < nums[j]) return true;
        }
    }
    return false;
}`,
      },
      {
        name: "Monotonic stack scanned right-to-left (optimal)",
        intuition: "Track the best '2' (third) via a decreasing stack of '3' candidates; succeed when an element falls below 'third'.",
        time: "O(n)",
        timeWhy: "Each element is pushed and popped at most once.",
        space: "O(n)",
        spaceWhy: "The stack of candidate large-middle values.",
        code: `boolean find132pattern(int[] nums) {
    Deque<Integer> stack = new ArrayDeque<>();
    int third = Integer.MIN_VALUE; // best '2' so far
    for (int i = nums.length - 1; i >= 0; i--) {
        if (nums[i] < third) return true;        // found the '1'
        while (!stack.isEmpty() && stack.peek() < nums[i]) {
            third = stack.pop();                 // largest '2' under nums[i]
        }
        stack.push(nums[i]);                     // nums[i] is a candidate '3'
    }
    return false;
}`,
        walkthrough: [
          "nums=[3,1,4,2]. i=3 val 2: third stays MIN, push 2. i=2 val 4: 4>third; pop 2<4 → third=2; push 4.",
          "i=1 val 1: 1 < third(2) → return true (1 is the '1', with 2 as '2' and 4 as '3').",
          "Pattern 1,4,2 confirmed.",
        ],
      },
    ],
    edgeCases: [
      "Fewer than three elements → no pattern → false.",
      "Monotonic increasing array → 'third' never gets set above an earlier element → false.",
      "Duplicates → strict inequalities mean equal values cannot fill two distinct roles.",
    ],
    twists: [
      "**Next Greater Element II** (in the library) → another monotonic-stack scan, finding the next larger value cyclically.",
      "**Daily Temperatures** (in the library) → monotonic stack indexing the next warmer day.",
      "**Find a 123 (strictly increasing triple)** → a simpler two-variable scan without the stack.",
    ],
    related: ["next-greater-element-ii", "daily-temperatures", "largest-rectangle-in-histogram"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "successful-pairs-of-spells-and-potions",
    title: "Successful Pairs of Spells and Potions",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 2300,
    statement:
      "You have arrays `spells` and `potions`, and an integer `success`. A pair `(spell, potion)` is **successful** if `spell * potion ≥ success`. For each spell, return the **number of potions** that form a successful pair with it.",
    examples: [
      { in: "spells = [5,1,3], potions = [1,2,3,4,5], success = 7", out: "[4,0,3]", explanation: "5 pairs with 2,3,4,5; 1 pairs with none; 3 pairs with 3,4,5" },
      { in: "spells = [3,1,2], potions = [8,5,8], success = 16", out: "[2,0,2]" },
    ],
    constraints: ["1 ≤ spells.length, potions.length ≤ 10⁵", "1 ≤ spells[i], potions[i] ≤ 10⁵", "1 ≤ success ≤ 10¹⁰"],
    recognize:
      "For a fixed spell, the condition `potion ≥ success/spell` defines a threshold; counting potions above it on a **sorted potions array** is a single **binary-search lower bound** per spell — turning an O(n·m) scan into O((n+m) log m).",
    figureItOut: [
      "Fix one spell. The pair is successful when potion ≥ success / spell. So for that spell there is a single threshold value, and every potion at or above it counts.",
      "If potions are SORTED ascending, the qualifying potions form a contiguous suffix. The count is m minus the index of the first potion meeting the threshold — a lower-bound search.",
      "Be careful with the threshold: use the integer condition spell * potion ≥ success directly inside the search to dodge floating-point rounding. The predicate 'spell*potion ≥ success' is monotonic in potion (larger potion only helps), so binary search applies.",
      "Use long multiplication because spell and potion are up to 10⁵ each, so their product reaches 10¹⁰ and overflows a 32-bit int.",
      "Sort potions once (O(m log m)); then each of the n spells does an O(log m) boundary search → O((n + m) log m) time, O(m) for the sorted copy (or in place).",
    ],
    approaches: [
      {
        name: "Brute force count per spell",
        intuition: "For each spell, scan all potions and count successful products.",
        time: "O(n · m)",
        timeWhy: "Every spell checks every potion.",
        space: "O(1)",
        spaceWhy: "Just the output array (excluded) and counters.",
        code: `int[] successfulPairs(int[] spells, int[] potions, long success) {
    int[] result = new int[spells.length];
    for (int i = 0; i < spells.length; i++) {
        int count = 0;
        for (int p : potions) {
            if ((long) spells[i] * p >= success) count++;
        }
        result[i] = count;
    }
    return result;
}`,
      },
      {
        name: "Sort potions + binary search per spell (optimal)",
        intuition: "Sort potions; for each spell find the first potion whose product meets success, count the suffix.",
        time: "O((n + m) log m)",
        timeWhy: "One sort of potions plus a log-m boundary search for each of the n spells.",
        space: "O(1)",
        spaceWhy: "Sorting is in place; only index variables (the output array aside).",
        code: `int[] successfulPairs(int[] spells, int[] potions, long success) {
    Arrays.sort(potions);
    int m = potions.length;
    int[] result = new int[spells.length];
    for (int i = 0; i < spells.length; i++) {
        long spell = spells[i];
        int lo = 0, hi = m; // search range [0, m]
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (spell * potions[mid] >= success) hi = mid; // mid qualifies, look left
            else lo = mid + 1;                             // too small, look right
        }
        result[i] = m - lo; // potions[lo..m-1] all qualify
    }
    return result;
}`,
        walkthrough: [
          "potions sorted=[1,2,3,4,5], success=7. spell=5: need potion ≥ 1.4; first index where 5*p≥7 is index 1 (value 2) → count 5-1=4.",
          "spell=1: need 1*p≥7 → first index 6 (none) → lo=5 → count 0. spell=3: 3*p≥7 first at index 2 (value 3) → count 5-2=3.",
          "Result [4,0,3].",
        ],
      },
    ],
    edgeCases: [
      "A spell so small no potion qualifies → lower bound lands at m → count 0.",
      "A spell large enough that all potions qualify → lower bound at 0 → count m.",
      "Large products → use long for spell * potion to avoid 32-bit overflow.",
    ],
    twists: [
      "**Find First and Last Position** (in the library) → the same boundary-search primitive to delimit a value's range.",
      "**Search Insert Position** (in the library) → lower bound returning the insertion index.",
      "**Count pairs with product below a bound** → flip the predicate to count the prefix instead of the suffix.",
    ],
    related: ["find-first-and-last-position-of-element-in-sorted-array", "search-insert-position", "find-target-indices-after-sorting-array"],
  },

  {
    slug: "maximum-value-at-a-given-index-in-a-bounded-array",
    title: "Maximum Value at a Given Index in a Bounded Array",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1802,
    statement:
      "You are given three integers `n`, `index`, and `maxSum`. Construct an array `nums` of length `n` of **positive** integers such that adjacent elements differ by at most 1, the total sum is ≤ `maxSum`, and `nums[index]` is **maximized**. Return that maximum value of `nums[index]`.",
    examples: [
      { in: "n = 4, index = 2, maxSum = 6", out: "2", explanation: "an optimal array is [1,2,2,1] with sum 6 and nums[2] = 2" },
      { in: "n = 6, index = 1, maxSum = 10", out: "3", explanation: "an optimal array is [1,3,2,1,1,2] (or similar) with nums[1] = 3" },
    ],
    constraints: ["1 ≤ n ≤ maxSum ≤ 10⁹", "0 ≤ index < n"],
    recognize:
      "Maximizing a peak under a budget where the minimal-cost shape is forced (values slope down by 1 from the peak, floored at 1) is a **binary search on the answer**: the smallest total sum needed for a given peak is monotonic, so search the largest peak whose required sum fits maxSum.",
    figureItOut: [
      "To maximize nums[index] cheaply, every other element should be as SMALL as possible while obeying the adjacent-difference-≤-1 rule. That means values descend by 1 each step away from the peak until they hit the floor of 1, then stay at 1.",
      "So for a candidate peak value v at the index, the minimal sum is determined: a decreasing ramp v, v−1, v−2, ... on each side, clamped to never drop below 1. Compute the left-side cost and the right-side cost as arithmetic series (handling the clamp).",
      "That minimal required sum is MONOTONIC in v: a taller peak can only cost the same or more. So if peak v fits within maxSum, every smaller peak also fits — the textbook setup for binary search on the value v.",
      "Binary search v in [1, maxSum]. For each v compute the minimal sum (using long to avoid overflow); if it is ≤ maxSum, v is feasible so try larger, otherwise try smaller.",
      "Each feasibility check is O(1) arithmetic (closed-form series), and there are O(log maxSum) candidates → O(log maxSum) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Binary search on the peak value (optimal)",
        intuition: "The minimal sum for a peak is a clamped descending ramp on each side; binary-search the tallest peak whose minimal sum fits maxSum.",
        time: "O(log maxSum)",
        timeWhy: "Binary search over the value range with an O(1) cost check each step.",
        space: "O(1)",
        spaceWhy: "Only arithmetic accumulators.",
        code: `int maxValue(int n, int index, int maxSum) {
    int lo = 1, hi = maxSum, answer = 1;
    while (lo <= hi) {
        int peak = lo + (hi - lo) / 2;
        if (minSum(peak, index, n) <= maxSum) {
            answer = peak;   // feasible, try a taller peak
            lo = peak + 1;
        } else {
            hi = peak - 1;   // too costly, lower the peak
        }
    }
    return answer;
}

// minimal total sum when nums[index] == peak, all elements >= 1
private long minSum(long peak, int index, int n) {
    long left = sideSum(peak, index);            // index elements to the left
    long right = sideSum(peak, n - index - 1);   // elements to the right
    return left + peak + right;                  // peak counted once
}

// sum of a ramp peak-1, peak-2, ... over 'count' positions, floored at 1
private long sideSum(long peak, int count) {
    if (count >= peak) {
        // ramp peak-1 .. 1 then (count - (peak-1)) ones
        long ramp = (peak - 1) * peak / 2;
        long ones = count - (peak - 1);
        return ramp + ones;
    } else {
        // ramp peak-1 .. peak-count, no flooring needed
        long top = peak - 1, bottom = peak - count;
        return (top + bottom) * count / 2;
    }
}`,
        walkthrough: [
          "n=4, index=2, maxSum=6. Try peak=2: left side has 2 positions → values 1,1 (floored) sum 2; right side 1 position → 1; total 2+2+1=5 ≤6 → feasible, try taller.",
          "Try peak=3: left 2 positions ramp 2,1 sum 3; right 1 position value 2; total 3+3+2=8 >6 → infeasible, lower.",
          "Best feasible peak = 2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → the single element can be as large as maxSum.",
      "index at an end → only one side has a ramp; the other side cost is 0.",
      "Large maxSum (up to 10⁹) → series sums can exceed int range, so compute with long.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → binary search on an answer with a monotonic feasibility check.",
      "**Split Array Largest Sum** (in the library) → minimize a maximum under a feasibility predicate, the same search-the-answer pattern.",
      "**Adjacent difference allowed to be larger** → changes the ramp slope, but the binary-search-on-peak scaffold stays.",
    ],
    related: ["koko-eating-bananas", "split-array-largest-sum", "find-the-smallest-divisor-given-a-threshold"],
  },

  {
    slug: "find-target-indices-after-sorting-array",
    title: "Find Target Indices After Sorting Array",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 2089,
    statement:
      "Given an array `nums` and an integer `target`, sort `nums` in non-decreasing order, then return a list of **all indices** `i` where the sorted array has `nums[i] == target` (ascending). If `target` is absent, return an empty list.",
    examples: [
      { in: "nums = [1,2,5,2,3], target = 2", out: "[1,2]", explanation: "sorted = [1,2,2,3,5]; the 2s sit at indices 1 and 2" },
      { in: "nums = [1,2,5,2,3], target = 3", out: "[3]", explanation: "sorted = [1,2,2,3,5]; 3 is at index 3" },
      { in: "nums = [1,2,5,2,3], target = 5", out: "[4]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "1 ≤ nums[i], target ≤ 100"],
    recognize:
      "After sorting, all copies of `target` occupy a contiguous block. Its start is the **lower bound** of target and its end is the **lower bound** of target+1, so two binary searches delimit exactly the index range to emit.",
    figureItOut: [
      "Sorting groups equal values together, so every occurrence of target forms one contiguous run. The whole answer is just that run of indices.",
      "The first index of the run is the lower bound of target: the leftmost position where nums[i] ≥ target. If that position does not actually hold target, target is absent.",
      "The position just past the run is the lower bound of target+1: the leftmost position where nums[i] ≥ target+1. Everything between [lowerBound(target), lowerBound(target+1)) equals target.",
      "So compute start = lowerBound(target) and end = lowerBound(target+1); emit every index from start to end−1. No element-by-element scanning of the whole array needed beyond the sort.",
      "Sorting is O(n log n); two boundary searches are O(log n); emitting the run is O(count) → O(n log n) time overall, O(1) extra space beyond the output.",
    ],
    approaches: [
      {
        name: "Sort + linear collect",
        intuition: "Sort, then walk once collecting every index equal to target.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort; the collect pass is linear.",
        space: "O(1)",
        spaceWhy: "Only the output list (excluded) and an index.",
        code: `List<Integer> targetIndices(int[] nums, int target) {
    Arrays.sort(nums);
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) result.add(i);
    }
    return result;
}`,
      },
      {
        name: "Sort + two lower-bound searches (optimal)",
        intuition: "Find the run start (lower bound of target) and run end (lower bound of target+1); emit that index range.",
        time: "O(n log n)",
        timeWhy: "Sort dominates; the two boundary searches are O(log n).",
        space: "O(1)",
        spaceWhy: "Index variables only (output aside).",
        code: `List<Integer> targetIndices(int[] nums, int target) {
    Arrays.sort(nums);
    int start = lowerBound(nums, target);
    int end = lowerBound(nums, target + 1);
    List<Integer> result = new ArrayList<>();
    for (int i = start; i < end; i++) result.add(i);
    return result;
}

private int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length; // search range [0, n]
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}`,
        walkthrough: [
          "nums=[1,2,5,2,3] sorted=[1,2,2,3,5], target=2. lowerBound(2)=1 (first value ≥2). lowerBound(3)=3 (first value ≥3).",
          "Run is indices [1,3) → 1 and 2.",
          "Return [1,2].",
        ],
      },
    ],
    edgeCases: [
      "target absent → lowerBound(target) == lowerBound(target+1) → empty range → empty list.",
      "target is the smallest/largest value → the run sits at the array's start/end.",
      "All elements equal target → the run spans the whole array.",
    ],
    twists: [
      "**Find First and Last Position** (in the library) → returns just the run's endpoints rather than every index.",
      "**Maximum Count of Positive Integer and Negative Integer** (in the library) → boundary searches over a sorted array to size sign blocks.",
      "**No sort needed (count-based answer)** → since values ≤ 100, count smaller-than-target elements to derive the run start directly.",
    ],
    related: ["find-first-and-last-position-of-element-in-sorted-array", "maximum-count-of-positive-integer-and-negative-integer", "search-insert-position"],
  },
];
