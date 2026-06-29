// NeetCode All — wave 12a (arrays-hashing, two-pointers, sliding-window, stack, binary-search). Java.
// Same deep-teaching shape as wave11a: statement, examples, constraints, recognize,
// figureItOut (genuine from-scratch reasoning), approaches (with walkthrough on the optimal one),
// edgeCases, twists, related. All code is clean compilable Java assuming `import java.util.*;`.
export const WAVE12A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "first-unique-character-in-a-string",
    title: "First Unique Character in a String",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 387,
    statement:
      "Given a string `s`, find the **first non-repeating character** in it and return its index. If it does not exist, return `-1`.",
    examples: [
      { in: 's = "leetcode"', out: "0", explanation: "'l' appears once and is the earliest such character" },
      { in: 's = "loveleetcode"', out: "2", explanation: "'l','o','v','e' repeat; 'v' at index 2 is the first to appear exactly once" },
      { in: 's = "aabb"', out: "-1", explanation: "every character repeats" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s consists of only lowercase English letters"],
    recognize:
      "'Non-repeating' is a frequency question, and 'first' means earliest index. Count every character once (a frequency map / 26-size array), then scan the string in order for the first character whose count is 1.",
    figureItOut: [
      "Uniqueness is about how many times a character appears across the WHOLE string, so you cannot decide it while reading left to right on the first encounter — you must know the total count first.",
      "That forces two passes. Pass one tallies each character's frequency into a map (or a fixed 26-slot array, since the alphabet is lowercase letters only).",
      "Pass two walks the ORIGINAL string left to right — order matters because we want the first such index — and returns the index of the first character whose tally is exactly 1.",
      "Scanning the original string (not the map) in pass two is what gives 'first': map iteration order would not respect positions in s.",
      "Two linear passes over n characters with O(1) counter updates → O(n) time. The counter is bounded by the alphabet size (26), so O(1) extra space.",
    ],
    approaches: [
      {
        name: "Frequency array + ordered scan (optimal)",
        intuition: "Tally all 26 letter counts, then return the index of the first letter in s whose count is 1.",
        time: "O(n)",
        timeWhy: "One pass to count, one pass to find the first count-1 character.",
        space: "O(1)",
        spaceWhy: "A fixed array of 26 counts regardless of input length.",
        code: `int firstUniqChar(String s) {
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
    }
    for (int i = 0; i < s.length(); i++) {
        if (count[s.charAt(i) - 'a'] == 1) return i;
    }
    return -1;
}`,
        walkthrough: [
          's="loveleetcode". Counts: l=2,o=2,v=1,e=4,t=1,c=1,d=1.',
          "Scan: index0 'l' count 2 skip, index1 'o' count 2 skip, index2 'v' count 1 → return 2.",
          "No earlier index qualified, so 2 is the first unique character's index.",
        ],
      },
    ],
    edgeCases: [
      "Every character repeats → the second pass finds nothing → return -1.",
      "All distinct characters → index 0 qualifies immediately.",
      "Single character → it is unique → return 0.",
    ],
    twists: [
      "**Valid Anagram** (in the library) → also a letter-frequency count, compared between two strings instead of scanned for uniqueness.",
      "**First unique character in a stream** (LeetCode 'First Unique Number') → maintain a queue plus counts as characters arrive online.",
      "**Group Anagrams** (in the library) → frequency signatures as map keys rather than a uniqueness test.",
    ],
    related: ["valid-anagram", "group-anagrams"],
  },

  {
    slug: "maximum-number-of-balloons",
    title: "Maximum Number of Balloons",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 1189,
    statement:
      "Given a string `text`, you want to form as many instances of the word `\"balloon\"` as possible using its characters. Each character in `text` can be used **at most once** across all instances. Return the **maximum number** of instances of `\"balloon\"` you can build.",
    examples: [
      { in: 'text = "nlaebolko"', out: "1", explanation: "exactly one 'balloon' can be spelled" },
      { in: 'text = "loonbalxballpoon"', out: "2", explanation: "two 'balloon's fit" },
      { in: 'text = "leetcode"', out: "0", explanation: "missing a,n and enough l,o,b" },
    ],
    constraints: ["1 ≤ text.length ≤ 10⁴", "text consists of lowercase English letters"],
    recognize:
      "Building copies of a fixed word is limited by whichever needed letter is scarcest, AFTER accounting for letters the word uses more than once. Count letters in text, divide each available count by how many that word needs, and take the minimum.",
    figureItOut: [
      "Each copy of 'balloon' needs a fixed recipe of letters: b×1, a×1, l×2, o×2, n×1. The 'l' and 'o' are needed twice per copy — that is the subtle part.",
      "How many copies can a single letter support? For 'b' it is count(b)/1; for 'l' it is count(l)/2 because each copy eats two; for 'o' it is count(o)/2; for 'a' and 'n' it is count/1.",
      "You can only make as many full copies as the SCARCEST resource allows — the bottleneck letter. So the answer is the minimum of those per-letter capacities, using integer division (a partial copy does not count).",
      "Letters not in 'balloon' are irrelevant and ignored. So tally the five relevant counts, divide l and o by 2, then take the min across b, a, (l/2), (o/2), n.",
      "One pass to tally O(n), then a constant amount of arithmetic → O(n) time, O(1) space (a fixed 26-slot or 5-slot counter).",
    ],
    approaches: [
      {
        name: "Letter counts + bottleneck minimum (optimal)",
        intuition: "Count b,a,l,o,n; halve the counts of l and o; the answer is the smallest of these capacities.",
        time: "O(n)",
        timeWhy: "Single pass to count letters, then constant-time min over five values.",
        space: "O(1)",
        spaceWhy: "A fixed-size count array independent of input length.",
        code: `int maxNumberOfBalloons(String text) {
    int[] count = new int[26];
    for (int i = 0; i < text.length(); i++) {
        count[text.charAt(i) - 'a']++;
    }
    int b = count['b' - 'a'];
    int a = count['a' - 'a'];
    int l = count['l' - 'a'] / 2; // each balloon needs two l
    int o = count['o' - 'a'] / 2; // each balloon needs two o
    int n = count['n' - 'a'];
    return Math.min(b, Math.min(a, Math.min(l, Math.min(o, n))));
}`,
        walkthrough: [
          'text="loonbalxballpoon". Relevant counts: b=2, a=2, l=4, o=4, n=2.',
          "Capacities: b/1=2, a/1=2, l/2=2, o/2=2, n/1=2.",
          "Minimum capacity = 2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "A required letter missing entirely → its capacity is 0 → answer 0.",
      "Plenty of every letter except one 'l' short of a pair → l/2 floors down, capping the count.",
      "text contains only irrelevant letters → all five counts 0 → answer 0.",
    ],
    twists: [
      "**Find Words That Can Be Formed by Characters** (LeetCode 1160) → same per-letter capacity idea, summing lengths of buildable words.",
      "**Ransom Note** (LeetCode 383) → can you build the target word at least once from the letters?",
      "**Generalize to any target word** → build the recipe map from the target instead of hardcoding 'balloon'.",
    ],
    related: ["valid-anagram", "first-unique-character-in-a-string"],
  },

  {
    slug: "word-pattern",
    title: "Word Pattern",
    difficulty: "Easy",
    pattern: "arrays-hashing",
    leetcode: 290,
    statement:
      "Given a `pattern` and a string `s`, find if `s` follows the same pattern. Here 'follow' means a **full bijection**: each letter in `pattern` maps to exactly one word in `s` (split by spaces), and each word maps back to exactly one letter.",
    examples: [
      { in: 'pattern = "abba", s = "dog cat cat dog"', out: "true", explanation: "a↔dog, b↔cat consistently" },
      { in: 'pattern = "abba", s = "dog cat cat fish"', out: "false", explanation: "a maps to both dog and fish" },
      { in: 'pattern = "aaaa", s = "dog cat cat dog"', out: "false", explanation: "a would need to map to several words" },
    ],
    constraints: ["1 ≤ pattern.length ≤ 300", "pattern contains only lowercase letters", "1 ≤ s.length ≤ 3000", "s contains lowercase words separated by single spaces"],
    recognize:
      "A consistent one-to-one correspondence between two sequences is a **bijection check** — two hash maps enforcing both directions (letter→word and word→letter), built in a single lockstep pass.",
    figureItOut: [
      "First, the structural prerequisite: the pattern and the list of words must have the same length, or no one-to-one pairing is even possible. Split s on spaces and compare lengths up front.",
      "A bijection means the mapping is consistent in BOTH directions. Tracking only letter→word lets two letters collide onto the same word (e.g. 'ab' / 'dog dog'), so you need word→letter too.",
      "Walk both sequences in lockstep at index i, pairing pattern[i] with word[i]. If the letter was seen before, its recorded word must match the current word; otherwise it is a new binding.",
      "Symmetrically, if the word was seen before, its recorded letter must match the current letter. A clash in either direction breaks the bijection → return false.",
      "Each of the n positions does O(1) map work (string compares aside) → O(n) time, O(n) space for the two maps.",
    ],
    approaches: [
      {
        name: "Two hash maps, both directions (optimal)",
        intuition: "Bind letter→word and word→letter as you walk; any inconsistency in either map fails the bijection.",
        time: "O(n)",
        timeWhy: "One pass over the n tokens with constant-time map operations.",
        space: "O(n)",
        spaceWhy: "Two maps storing up to n distinct bindings.",
        code: `boolean wordPattern(String pattern, String s) {
    String[] words = s.split(" ");
    if (pattern.length() != words.length) return false;
    Map<Character, String> letterToWord = new HashMap<>();
    Map<String, Character> wordToLetter = new HashMap<>();
    for (int i = 0; i < words.length; i++) {
        char c = pattern.charAt(i);
        String w = words[i];
        if (letterToWord.containsKey(c)) {
            if (!letterToWord.get(c).equals(w)) return false;
        } else {
            letterToWord.put(c, w);
        }
        if (wordToLetter.containsKey(w)) {
            if (wordToLetter.get(w) != c) return false;
        } else {
            wordToLetter.put(w, c);
        }
    }
    return true;
}`,
        walkthrough: [
          'pattern="abba", words=[dog,cat,cat,dog]. i=0 bind a->dog, dog->a. i=1 bind b->cat, cat->b.',
          "i=2 c is 'b' already → must equal cat ✓; word cat already → must equal b ✓.",
          "i=3 c is 'a' → must equal dog ✓; word dog → must equal a ✓. All consistent → true.",
        ],
      },
    ],
    edgeCases: [
      "Length mismatch between pattern letters and words → immediate false.",
      "Same word reused under two different letters → caught by the word→letter map.",
      "Single letter and single word → trivially a valid bijection → true.",
    ],
    twists: [
      "**Isomorphic Strings** (in the library) → the same two-direction mapping but between single characters of two strings.",
      "**Word Pattern II** (LeetCode 291) → words are not pre-split; you must backtrack over possible splits.",
      "**One-directional only** → relaxing to a function (not bijection) just drops the word→letter map.",
    ],
    related: ["isomorphic-strings", "group-anagrams"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "reverse-vowels-of-a-string",
    title: "Reverse Vowels of a String",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 345,
    statement:
      "Given a string `s`, reverse only the **vowels** (`a, e, i, o, u`, both lowercase and uppercase) and return the resulting string. All non-vowel characters stay in their original positions.",
    examples: [
      { in: 's = "IceCreaM"', out: '"AceCreIM"', explanation: "vowels I,e,e,a become a,e,e,I in reverse order" },
      { in: 's = "leetcode"', out: '"leotcede"', explanation: "vowels e,e,o,e reversed to e,o,e,e" },
      { in: 's = "hello"', out: '"holle"', explanation: "vowels e,o swap" },
    ],
    constraints: ["1 ≤ s.length ≤ 3·10⁵", "s consists of printable ASCII characters"],
    recognize:
      "Reversing a selected subset in place is the **converging two-pointer** swap: a left pointer seeks the next vowel from the front, a right pointer the next vowel from the back, swap them, and step inward.",
    figureItOut: [
      "Reversing a sequence in place is the classic left/right pointer swap. The twist is that only vowels participate — the consonants are fixed scaffolding the vowels swap around.",
      "So advance the left pointer until it lands on a vowel, and advance the right pointer (moving inward) until it lands on a vowel. Now both point at vowels that must trade places.",
      "Swap those two vowels, then move both pointers one step toward the center and repeat. Non-vowels are simply skipped by the seeking loops, keeping them put.",
      "Stop when the pointers cross. A char array makes the in-place swaps easy since Java strings are immutable; build the result string at the end.",
      "Each pointer moves monotonically toward the middle, so every index is visited at most once → O(n) time, O(n) space only for the mutable char array (O(1) extra logic).",
    ],
    approaches: [
      {
        name: "Converging two pointers, swap vowels (optimal)",
        intuition: "Seek a vowel from each end, swap the pair, and march both pointers inward until they meet.",
        time: "O(n)",
        timeWhy: "The two pointers together traverse the string exactly once.",
        space: "O(n)",
        spaceWhy: "A char array copy to allow in-place swaps (strings are immutable).",
        code: `String reverseVowels(String s) {
    char[] chars = s.toCharArray();
    String vowels = "aeiouAEIOU";
    int left = 0, right = chars.length - 1;
    while (left < right) {
        while (left < right && vowels.indexOf(chars[left]) == -1) left++;
        while (left < right && vowels.indexOf(chars[right]) == -1) right--;
        if (left < right) {
            char tmp = chars[left];
            chars[left] = chars[right];
            chars[right] = tmp;
            left++;
            right--;
        }
    }
    return new String(chars);
}`,
        walkthrough: [
          's="hello". left seeks vowel: index1 e. right seeks vowel: index4 o.',
          "Swap e and o → h o l l e. left=2, right=3.",
          "left seeks vowel from 2: none before crossing right → loop ends. Result \"holle\".",
        ],
      },
    ],
    edgeCases: [
      "No vowels → both seek loops run to the crossing point, nothing swaps, string unchanged.",
      "Single vowel → left and right meet on it, no swap needed.",
      "Mixed case → uppercase vowels are included, so 'A' and 'e' can swap places.",
    ],
    twists: [
      "**Reverse String** (in the library) → swap every character, no vowel filter.",
      "**Reverse only consonants** → flip the membership test.",
      "**Reverse words but keep word order** (Reverse Words in a String, in the library) → a different selective reversal granularity.",
    ],
    related: ["reverse-string", "valid-palindrome"],
  },

  {
    slug: "sort-array-by-parity",
    title: "Sort Array By Parity",
    difficulty: "Easy",
    pattern: "two-pointers",
    leetcode: 905,
    statement:
      "Given an integer array `nums`, move all the **even** integers to the front of the array followed by all the **odd** integers. You may return **any** array that satisfies this condition.",
    examples: [
      { in: "nums = [3,1,2,4]", out: "[2,4,3,1]", explanation: "evens 2,4 first then odds 3,1 (any valid order accepted)" },
      { in: "nums = [0]", out: "[0]" },
      { in: "nums = [1,3,5,2]", out: "[2,1,3,5]", explanation: "even 2 moved to the front" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5000", "0 ≤ nums[i] ≤ 5000"],
    recognize:
      "Partitioning a list into two groups (evens, then odds) with no required internal order is the **two-pointer partition**: a left pointer holding the even boundary and a right pointer scanning from the end, swapping a misplaced even into place.",
    figureItOut: [
      "Order within each group does not matter, so this is a pure partition, not a full sort. That immediately suggests an in-place two-pointer split rather than building a new array.",
      "Keep a left pointer that marks where the next even number should go (everything before it is already even). Keep a right pointer scanning from the back.",
      "If nums[left] is already even, it is in the right region — just advance left. If it is odd, it belongs later, so swap it with nums[right] and pull right inward, bringing a fresh value to inspect at left.",
      "Why swap with right rather than shift everything? Because order is free, a single swap relocates the odd value to the tail region in O(1) — no shuffling needed.",
      "Each step advances left or retreats right, so the pointers cross after at most n iterations → O(n) time, O(1) extra space (fully in place).",
    ],
    approaches: [
      {
        name: "In-place two-pointer partition (optimal)",
        intuition: "Left marks the even boundary; when it hits an odd, swap it toward the shrinking right end.",
        time: "O(n)",
        timeWhy: "Each element is examined once as the pointers converge.",
        space: "O(1)",
        spaceWhy: "Swaps happen inside the array; no auxiliary storage.",
        code: `int[] sortArrayByParity(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        if (nums[left] % 2 == 0) {
            left++; // already even, in place
        } else {
            int tmp = nums[left];
            nums[left] = nums[right];
            nums[right] = tmp; // push the odd toward the tail
            right--;
        }
    }
    return nums;
}`,
        walkthrough: [
          "nums=[3,1,2,4]. left=0 value 3 odd → swap with right(=3) value 4 → [4,1,2,3], right=2.",
          "left=0 value 4 even → left=1. value 1 odd → swap with right(=2) value 2 → [4,2,1,3], right=1.",
          "left=1 not < right=1 → stop. [4,2,1,3]: evens 4,2 then odds 1,3 ✓.",
        ],
      },
    ],
    edgeCases: [
      "All even → left simply walks to the end, no swaps.",
      "All odd → every value swaps toward the tail until pointers cross; array order may change but grouping holds.",
      "Single element → loop never runs, returned as is.",
    ],
    twists: [
      "**Sort Array By Parity II** (LeetCode 922) → evens at even indices, odds at odd indices — a stricter interleave.",
      "**Move Zeroes** (in the library) → a partition that must preserve relative order, needing a stable write pointer.",
      "**Sort Colors** (in the library) → a three-way (Dutch flag) partition generalizing this two-way split.",
    ],
    related: ["move-zeroes", "sort-colors"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "number-of-substrings-containing-all-three-characters",
    title: "Number of Substrings Containing All Three Characters",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1358,
    statement:
      "Given a string `s` consisting only of characters `a`, `b` and `c`, return the **number of substrings** that contain **at least one** occurrence of all three characters `a`, `b`, and `c`.",
    examples: [
      { in: 's = "abcabc"', out: "10", explanation: "10 substrings contain at least one a, one b, and one c" },
      { in: 's = "aaacb"', out: "3", explanation: 'the qualifying substrings are "aaacb", "aacb", "acb"' },
      { in: 's = "abc"', out: "1", explanation: "only the whole string qualifies" },
    ],
    constraints: ["3 ≤ s.length ≤ 5·10⁴", "s consists only of characters a, b and c"],
    recognize:
      "Counting substrings that satisfy a 'contains all required' condition over a moving boundary → a **sliding window** that, once valid, contributes a whole tail of substrings at once. Track the last seen index of each of a, b, c.",
    figureItOut: [
      "Fix the right end of a substring at index r. Among all substrings ending at r, the question is how many also contain at least one a, one b, and one c.",
      "A substring [l..r] contains all three iff its left edge l does not skip past the LAST occurrence of any of the three characters seen up to r. So the most recent positions of a, b, c are exactly what matter.",
      "Let lastA, lastB, lastC be the most recent indices (≤ r) of each character. The substring [l..r] is valid as long as l ≤ min(lastA, lastB, lastC) — any l up to that minimum still includes one of each.",
      "Therefore every right end r where all three have appeared contributes (min(lastA, lastB, lastC) + 1) valid substrings — one for each starting index l from 0 to that minimum.",
      "Update the last-seen index of s[r] at each step and add the contribution; one pass, three tracked positions → O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Brute force expand from each start",
        intuition: "For every start, extend until all three appear, then every longer end also qualifies.",
        time: "O(n)",
        timeWhy: "Each start's window can be extended with a smart early stop, but naive nesting is O(n²); shown as the warm-up idea.",
        space: "O(1)",
        spaceWhy: "A small fixed count of the three characters.",
        code: `int numberOfSubstrings(String s) {
    int n = s.length();
    int[] count = new int[3];
    int result = 0, left = 0;
    for (int right = 0; right < n; right++) {
        count[s.charAt(right) - 'a']++;
        while (count[0] > 0 && count[1] > 0 && count[2] > 0) {
            // every substring starting at <= left and ending >= right is valid
            count[s.charAt(left) - 'a']--;
            left++;
        }
        result += left; // 'left' valid start positions for this right end
    }
    return result;
}`,
      },
      {
        name: "Last-seen index contribution (optimal)",
        intuition: "For each right end, the count of valid substrings is 1 + the smallest last-seen index among a, b, c.",
        time: "O(n)",
        timeWhy: "One pass updating three indices and a running sum.",
        space: "O(1)",
        spaceWhy: "Three integers for the last positions of a, b, c.",
        code: `int numberOfSubstrings(String s) {
    int[] last = {-1, -1, -1}; // last index of a, b, c
    long result = 0;
    for (int r = 0; r < s.length(); r++) {
        last[s.charAt(r) - 'a'] = r;
        int minLast = Math.min(last[0], Math.min(last[1], last[2]));
        result += minLast + 1; // valid starts l = 0..minLast
    }
    return (int) result;
}`,
        walkthrough: [
          's="abc". r=0 last=[0,-1,-1] min=-1 add 0. r=1 last=[0,1,-1] min=-1 add 0.',
          "r=2 last=[0,1,2] min=0 add 0+1=1. result=1.",
          "Only the substring \"abc\" qualifies → 1.",
        ],
      },
    ],
    edgeCases: [
      "Exactly one of each in order ('abc') → only the full string counts → 1.",
      "A character missing entirely → no substring can contain all three → 0.",
      "Long runs of one character before the others appear → those right ends contribute 0 until all three are seen.",
    ],
    twists: [
      "**Minimum Window Substring** (in the library) → find the shortest window covering all required characters instead of counting all of them.",
      "**Subarrays With K Different Integers** (LeetCode 992) → exactly-K via atMost(K) − atMost(K−1).",
      "**Generalize to any required alphabet** → track last-seen per required character and take the min.",
    ],
    related: ["minimum-window-substring", "binary-subarrays-with-sum"],
  },

  {
    slug: "count-number-of-nice-subarrays",
    title: "Count Number of Nice Subarrays",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 1248,
    statement:
      "Given an array of integers `nums` and an integer `k`, a **nice** subarray is a contiguous subarray with exactly `k` odd numbers. Return the **number of nice subarrays**.",
    examples: [
      { in: "nums = [1,1,2,1,1], k = 3", out: "2", explanation: "the subarrays [1,1,2,1] and [1,2,1,1] each have exactly 3 odd numbers" },
      { in: "nums = [2,4,6], k = 1", out: "0", explanation: "no odd numbers at all" },
      { in: "nums = [2,2,2,1,2,2,1,2,2,2], k = 2", out: "16" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5·10⁴", "1 ≤ nums[i] ≤ 10⁵", "1 ≤ k ≤ nums.length"],
    recognize:
      "Replace each number by its parity (odd → 1, even → 0); 'exactly k odds' becomes 'subarray sum exactly k' over a 0/1 array — the **atMost trick**: exactly(k) = atMost(k) − atMost(k−1), each a shrinking window.",
    figureItOut: [
      "The values themselves do not matter — only whether each is odd. Mentally map odd → 1 and even → 0. Now 'exactly k odd numbers' is precisely 'a subarray whose 0/1 sum equals k'.",
      "Counting subarrays with sum EXACTLY k over non-negative entries is awkward directly because trailing zeros (evens) extend a window without changing its odd-count.",
      "Define atMost(x) = number of subarrays with at most x odd numbers. Adding an element can only increase the running odd-count, the monotonic property a sliding window needs to shrink correctly.",
      "Then exactly(k) = atMost(k) − atMost(k−1): subarrays with ≤ k odds minus those with ≤ k−1 odds leaves exactly those with k odds. This cleanly absorbs the even-run ambiguity.",
      "Each atMost(x) is one O(n) window pass that, for each right end, adds (window length) valid subarrays; we call it twice → O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Prefix count of odd-counts (map)",
        intuition: "Track how many prefixes had each odd-count; for each prefix add occurrences of (oddCount − k).",
        time: "O(n)",
        timeWhy: "One pass with O(1) array updates (odd-count is bounded by n).",
        space: "O(n)",
        spaceWhy: "A frequency array over possible odd-counts.",
        code: `int numberOfSubarrays(int[] nums, int k) {
    int n = nums.length;
    int[] freq = new int[n + 1];
    freq[0] = 1; // a prefix with zero odds before the array starts
    int odd = 0, result = 0;
    for (int v : nums) {
        odd += v & 1;            // add 1 if v is odd
        if (odd - k >= 0) result += freq[odd - k];
        freq[odd]++;
    }
    return result;
}`,
      },
      {
        name: "atMost(k) − atMost(k−1) sliding window (optimal)",
        intuition: "Exactly-k odds equals the gap between two at-most-odd-count windows.",
        time: "O(n)",
        timeWhy: "Two linear sliding-window passes.",
        space: "O(1)",
        spaceWhy: "Only window pointers and counters.",
        code: `int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

private int atMost(int[] nums, int k) {
    if (k < 0) return 0;
    int left = 0, odd = 0, count = 0;
    for (int right = 0; right < nums.length; right++) {
        odd += nums[right] & 1;
        while (odd > k) {
            odd -= nums[left] & 1;
            left++;
        }
        count += right - left + 1; // subarrays ending at right with <= k odds
    }
    return count;
}`,
        walkthrough: [
          "nums=[1,1,2,1,1], k=3. atMost(3) counts all subarrays with ≤3 odds = 15 (every subarray, since total odds is 4 but most fit).",
          "atMost(2) counts subarrays with ≤2 odds = 13.",
          "exactly = 15 − 13 = 2.",
        ],
      },
    ],
    edgeCases: [
      "No odd numbers and k ≥ 1 → atMost(k) and atMost(k−1) leave 0 nice subarrays.",
      "All numbers odd → it reduces to counting subarrays of length exactly k.",
      "k equals the total number of odds → only windows spanning all odds (with optional even padding) qualify.",
    ],
    twists: [
      "**Subarray Sum Equals K** (in the library) → the same exactly-sum idea but on general integers, forcing the prefix-sum map.",
      "**Binary Subarrays With Sum** (in the library) → identical atMost structure on a literal 0/1 array.",
      "**Count subarrays with at most k odds** → just atMost(k) alone.",
    ],
    related: ["subarray-sum-equals-k", "binary-subarrays-with-sum"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "remove-outermost-parentheses",
    title: "Remove Outermost Parentheses",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 1021,
    statement:
      "A valid parentheses string `s` is a concatenation of **primitive** valid parentheses strings. Remove the **outermost** pair of parentheses of every primitive in the decomposition of `s`, and return the result.",
    examples: [
      { in: 's = "(()())(())"', out: '"()()()"', explanation: "primitives (()()) and (()) lose their outer pair → ()() and ()" },
      { in: 's = "(()())(())(()(()))"', out: '"()()()()(())"' },
      { in: 's = "()()"', out: '""', explanation: "each primitive () is just its outer pair, removed entirely" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s consists only of '(' and ')'", "s is a valid parentheses string"],
    recognize:
      "Tracking nesting depth to know which parentheses are 'outermost' is the **balance-counter** (degenerate stack) technique: a depth that hits 0 marks a primitive boundary; keep only the characters at depth ≥ 1 (after adjusting for the current bracket).",
    figureItOut: [
      "A primitive starts when the running depth rises from 0 to 1 (that '(' is its outermost open) and ends when the depth falls back to 0 (that ')' is its outermost close). Those two characters are exactly what to drop.",
      "So you do not need to find primitive boundaries separately — a single depth counter reveals them as you scan.",
      "On a '(' : if the depth is already ≥ 1 before incrementing, this '(' is INNER, so keep it; then increment. The depth-0 case is an outermost open → skip it.",
      "On a ')' : decrement first; if the depth is still ≥ 1 after decrementing, this ')' is INNER, so keep it. If it dropped to 0, it was an outermost close → skip it.",
      "Equivalently: keep '(' when depth > 0 before the bump, and keep ')' when depth > 0 after the drop. One pass, a single integer counter (the stack collapsed to its size) → O(n) time, O(n) for the output, O(1) extra.",
    ],
    approaches: [
      {
        name: "Depth counter, keep inner brackets (optimal)",
        intuition: "A balance counter tells you nesting depth; outermost brackets are exactly those at the 0↔1 transitions, so skip them.",
        time: "O(n)",
        timeWhy: "One scan updating a counter and appending kept characters.",
        space: "O(n)",
        spaceWhy: "The output builder; the 'stack' is just an integer depth.",
        code: `String removeOuterParentheses(String s) {
    StringBuilder sb = new StringBuilder();
    int depth = 0;
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(') {
            if (depth > 0) sb.append(c); // inner open, keep it
            depth++;
        } else {
            depth--;
            if (depth > 0) sb.append(c); // inner close, keep it
        }
    }
    return sb.toString();
}`,
        walkthrough: [
          's="(()())(())". i0 \'(\' depth0 → skip, depth1. i1 \'(\' depth1>0 keep, depth2. i2 \')\' depth->1>0 keep.',
          "i3 '(' depth1 keep, depth2. i4 ')' depth->1 keep. i5 ')' depth->0 skip (primitive ends). First primitive yields \"()()\".",
          "Second primitive \"(())\" similarly yields \"()\". Result \"()()()\".",
        ],
      },
    ],
    edgeCases: [
      "All primitives are just '()' → every character is outermost → result is empty.",
      "A single deeply nested primitive like '(((())))' → only the very outer pair is removed.",
      "Many primitives concatenated → each is processed independently as depth returns to 0.",
    ],
    twists: [
      "**Valid Parentheses** (in the library) → uses a stack to check validity rather than strip outer layers.",
      "**Maximum Nesting Depth of the Parentheses** (LeetCode 1614) → report the max depth instead of editing the string.",
      "**Score of Parentheses** (in this file) → also a depth/stack walk, but computing a numeric score.",
    ],
    related: ["valid-parentheses", "score-of-parentheses"],
  },

  {
    slug: "score-of-parentheses",
    title: "Score of Parentheses",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 856,
    statement:
      "Given a balanced parentheses string `s`, compute its **score** by these rules: `\"()\"` has score 1; `AB` has score `A + B` (concatenation adds); and `(A)` has score `2 * A` (wrapping doubles).",
    examples: [
      { in: 's = "()"', out: "1" },
      { in: 's = "(())"', out: "2", explanation: "inner () is 1, wrapped → 2" },
      { in: 's = "()()"', out: "2", explanation: "1 + 1" },
      { in: 's = "(()(()))"', out: "6", explanation: "= 2*(1 + 2*1) = 2*(1+2) = 6" },
    ],
    constraints: ["2 ≤ s.length ≤ 50", "s consists only of '(' and ')'", "s is a balanced parentheses string"],
    recognize:
      "Nested structure with a value bubbling up from inner to outer is the canonical **stack of partial scores**: push a 0 frame on '(', and on ')' fold the inner frame into its parent as max(2·inner, 1).",
    figureItOut: [
      "Each pair of parentheses produces a number, and an enclosing pair doubles whatever its contents scored. That 'fold inner results into the parent' shape is exactly what a stack of accumulators handles.",
      "Maintain a stack where each entry is the running score of the current nesting level. Start with one frame (score 0) representing the top level.",
      "On '(' you enter a deeper level, so push a fresh 0 frame to accumulate that level's score.",
      "On ')' you close a level: pop its accumulated inner score. If the inner score is 0 it was a bare '()' worth 1; otherwise it is 2 × inner. Add that result onto the new top frame (the parent), so values bubble upward.",
      "After processing all characters, the single remaining frame holds the total. Each char is one push/pop/add → O(n) time, O(n) stack depth in the worst (fully nested) case.",
    ],
    approaches: [
      {
        name: "Stack of level scores (optimal)",
        intuition: "Push a 0 on each '('; on ')' collapse the level to max(2·inner, 1) and add it to the parent level.",
        time: "O(n)",
        timeWhy: "One pass with O(1) stack operations per character.",
        space: "O(n)",
        spaceWhy: "Stack depth up to the maximum nesting level.",
        code: `int scoreOfParentheses(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(0); // top-level accumulator
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == '(') {
            stack.push(0); // new inner level
        } else {
            int inner = stack.pop();
            int add = inner == 0 ? 1 : 2 * inner; // () -> 1, (A) -> 2A
            stack.push(stack.pop() + add);        // fold into parent
        }
    }
    return stack.pop();
}`,
        walkthrough: [
          's="(())". stack=[0]. \'(\' push → [0,0]. \'(\' push → [0,0,0].',
          "')' pop inner 0 → add 1; parent 0+1=1 → [0,1]. ')' pop inner 1 → add 2*1=2; parent 0+2=2 → [2].",
          "Final pop = 2.",
        ],
      },
    ],
    edgeCases: [
      "Simplest '()' → push 0, close to score 1, total 1.",
      "Sibling pairs '()()' → each folds 1 into the top level → 1 + 1 = 2.",
      "Deep nesting '(((())))' → repeated doubling of the innermost 1.",
    ],
    twists: [
      "**Depth-multiplier counting variant** → sum 2^(depth−1) over each '()' pair using only a depth counter, O(1) space.",
      "**Remove Outermost Parentheses** (in this file) → same depth/stack walk, editing the string instead of scoring.",
      "**Different fold rule (e.g. (A) → A+1)** → change only the collapse expression; the stack scaffold stays.",
    ],
    related: ["remove-outermost-parentheses", "valid-parentheses"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "find-the-smallest-divisor-given-a-threshold",
    title: "Find the Smallest Divisor Given a Threshold",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 1283,
    statement:
      "Given an array `nums` and an integer `threshold`, choose a positive integer divisor `d`. Divide every element by `d` (rounding **up**) and sum the results. Return the **smallest** `d` such that this sum is ≤ `threshold`.",
    examples: [
      { in: "nums = [1,2,5,9], threshold = 6", out: "5", explanation: "d=5 → 1+1+1+2 = 5 ≤ 6; d=4 → 1+1+2+3 = 7 > 6, so 5 is smallest" },
      { in: "nums = [44,22,33,11,1], threshold = 5", out: "44" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5·10⁴", "1 ≤ nums[i] ≤ 10⁶", "nums.length ≤ threshold ≤ 10⁶"],
    recognize:
      "The summed-quotient function is **monotonic**: a bigger divisor never increases the sum. 'Smallest d achieving sum ≤ threshold' is therefore a **binary search on the answer** — search the divisor range for the leftmost value that satisfies the predicate.",
    figureItOut: [
      "The divisor d is what you are solving for, and the candidate range is clear: at least 1, and at most max(nums) (where every quotient rounds to 1, giving the smallest possible sum equal to nums.length ≤ threshold).",
      "Key monotonic insight: as d increases, each ceil(nums[i]/d) is non-increasing, so the total sum is non-increasing. Once the sum drops to ≤ threshold, it stays ≤ threshold for all larger d.",
      "That monotonic predicate ('sum ≤ threshold') flipping from false to true exactly once is the green light for binary search on the value of d rather than on an index.",
      "Binary search the divisor range [1, max]. For a mid divisor, compute the summed ceilings; if it is ≤ threshold, mid works so try smaller (hi = mid − 1, remember mid); otherwise the divisor is too small (lo = mid + 1).",
      "Computing the sum is O(n) per candidate using ceil(a/b) = (a + b − 1)/b for positive integers, and there are O(log(max)) candidates → O(n log(max)) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Linear scan over divisors",
        intuition: "Try d = 1, 2, 3, ... and return the first whose summed ceilings fit the threshold.",
        time: "O(n · max)",
        timeWhy: "Up to max candidate divisors, each costing an O(n) sum.",
        space: "O(1)",
        spaceWhy: "Only accumulators.",
        code: `int smallestDivisor(int[] nums, int threshold) {
    int max = 0;
    for (int v : nums) max = Math.max(max, v);
    for (int d = 1; d <= max; d++) {
        if (sumCeil(nums, d) <= threshold) return d;
    }
    return max;
}

private int sumCeil(int[] nums, int d) {
    int sum = 0;
    for (int v : nums) sum += (v + d - 1) / d; // ceil division
    return sum;
}`,
      },
      {
        name: "Binary search on the divisor (optimal)",
        intuition: "Binary-search the divisor range for the leftmost d whose summed ceilings are within threshold.",
        time: "O(n log(max))",
        timeWhy: "log(max) divisor candidates, each evaluated with an O(n) sum.",
        space: "O(1)",
        spaceWhy: "Two interval bounds plus accumulators.",
        code: `int smallestDivisor(int[] nums, int threshold) {
    int lo = 1, hi = 0;
    for (int v : nums) hi = Math.max(hi, v);
    int answer = hi;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (sumCeil(nums, mid) <= threshold) {
            answer = mid;   // mid works; try a smaller divisor
            hi = mid - 1;
        } else {
            lo = mid + 1;   // sum too big; need a larger divisor
        }
    }
    return answer;
}

private int sumCeil(int[] nums, int d) {
    int sum = 0;
    for (int v : nums) sum += (v + d - 1) / d; // ceil division
    return sum;
}`,
        walkthrough: [
          "nums=[1,2,5,9], threshold=6. lo=1, hi=9. mid=5 sum=1+1+1+2=5 ≤6 → answer=5, hi=4.",
          "mid=2 sum=1+1+3+5=10 >6 → lo=3. mid=3 sum=1+1+2+3=7 >6 → lo=4. mid=4 sum=1+1+2+3=7 >6 → lo=5.",
          "lo=5>hi=4 stop. answer=5.",
        ],
      },
    ],
    edgeCases: [
      "threshold equals nums.length → only d = max(nums) makes every quotient round to 1.",
      "Single element → smallest d is ceil(nums[0]/threshold).",
      "All elements equal → the sum is n·ceil(value/d); the boundary is found cleanly.",
    ],
    twists: [
      "**Koko Eating Bananas** (in the library) → identical 'binary search on a rate with a ceil-sum predicate' shape.",
      "**Capacity To Ship Packages Within D Days** (in the library) → search the minimal capacity instead of divisor.",
      "**Maximize the divisor under a different aggregate (max instead of sum)** → swap the predicate, keep the search.",
    ],
    related: ["koko-eating-bananas", "capacity-to-ship-packages-within-d-days"],
  },

  {
    slug: "maximum-count-of-positive-integer-and-negative-integer",
    title: "Maximum Count of Positive Integer and Negative Integer",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 2529,
    statement:
      "Given an array `nums` sorted in **non-decreasing** order, return the **maximum** between the count of positive integers and the count of negative integers. (Zeros count as neither.)",
    examples: [
      { in: "nums = [-2,-1,-1,1,2,3]", out: "3", explanation: "3 negatives and 3 positives → max is 3" },
      { in: "nums = [-3,-2,-1,0,0,1,2]", out: "3", explanation: "3 negatives, 2 positives → max is 3" },
      { in: "nums = [5,20,66,1314]", out: "4", explanation: "0 negatives, 4 positives → 4" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2000", "−2000 ≤ nums[i] ≤ 2000", "nums is sorted in non-decreasing order"],
    recognize:
      "Because the array is sorted, the negatives form a left block and the positives a right block, separated by any zeros. Finding those block boundaries on sorted data is **binary search** (lower bound of 0 and upper bound of 0).",
    figureItOut: [
      "Sorted order means everything is grouped: all negatives come first, then zeros, then all positives. So both counts are just the sizes of contiguous prefixes/suffixes — no need to inspect every element.",
      "Negatives are the elements strictly less than 0. The count of negatives is the index of the FIRST element ≥ 0 (its lower bound), because everything before that index is negative.",
      "Positives are the elements strictly greater than 0. The count of positives is n minus the index of the FIRST element > 0 (the upper bound of 0), because everything from that index on is positive.",
      "Both boundaries are leftmost-position searches on a monotone predicate, the textbook binary-search-for-a-boundary. Find firstGE0 and firstGT0, then neg = firstGE0 and pos = n − firstGT0.",
      "Each boundary search is O(log n) and the final comparison is O(1) → O(log n) time, O(1) space. (A linear count is also fine for n ≤ 2000, but the boundaries showcase the binary-search idea.)",
    ],
    approaches: [
      {
        name: "Linear count",
        intuition: "Walk once, tally positives and negatives, return the larger.",
        time: "O(n)",
        timeWhy: "Single pass over the array.",
        space: "O(1)",
        spaceWhy: "Two counters.",
        code: `int maximumCount(int[] nums) {
    int pos = 0, neg = 0;
    for (int v : nums) {
        if (v > 0) pos++;
        else if (v < 0) neg++;
    }
    return Math.max(pos, neg);
}`,
      },
      {
        name: "Two boundary binary searches (optimal)",
        intuition: "Find the first index ≥ 0 (counts negatives) and the first index > 0 (suffix counts positives).",
        time: "O(log n)",
        timeWhy: "Two boundary searches, each halving the range.",
        space: "O(1)",
        spaceWhy: "A few index variables.",
        code: `int maximumCount(int[] nums) {
    int n = nums.length;
    int firstGE0 = lowerBound(nums, 0);  // first index with nums[i] >= 0
    int firstGT0 = lowerBound(nums, 1);  // first index with nums[i] >= 1, i.e. > 0
    int neg = firstGE0;                  // elements before it are < 0
    int pos = n - firstGT0;              // elements from it on are > 0
    return Math.max(neg, pos);
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
          "nums=[-3,-2,-1,0,0,1,2], n=7. lowerBound(0): first index with value ≥0 is 3 → neg=3.",
          "lowerBound(1): first index with value ≥1 is 5 → pos = 7 − 5 = 2.",
          "max(3, 2) = 3.",
        ],
      },
    ],
    edgeCases: [
      "All negatives → firstGE0 == n → neg = n, pos = 0.",
      "All positives → firstGE0 = 0 and firstGT0 = 0 → neg = 0, pos = n.",
      "All zeros → both boundaries land at the same place → neg = 0, pos = 0 → answer 0.",
    ],
    twists: [
      "**Search Insert Position** (in the library) → the same lower-bound boundary search returning the insertion index.",
      "**Find First and Last Position** (in the library) → two boundaries (lower and upper) to delimit a value's range.",
      "**Unsorted input** → the binary-search shortcut is lost; fall back to the linear count.",
    ],
    related: ["search-insert-position", "binary-search"],
  },

  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "maximum-nesting-depth-of-the-parentheses",
    title: "Maximum Nesting Depth of the Parentheses",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 1614,
    statement:
      "Given a **valid parentheses string** `s` (digits and operators may appear, but the parentheses are balanced), return its **maximum nesting depth** — the deepest level of parentheses you must be inside at any point.",
    examples: [
      { in: 's = "(1+(2*3)+((8)/4))+1"', out: "3", explanation: "the digit 8 sits inside three layers of parentheses" },
      { in: 's = "(1)+((2))+(((3)))"', out: "3", explanation: "the deepest nesting is the triple around 3" },
      { in: 's = "()(())((()()))"', out: "3" },
    ],
    constraints: ["1 ≤ s.length ≤ 100", "s consists of digits, '+', '-', '*', '/', '(' and ')'", "s is a valid parentheses string"],
    recognize:
      "Maximum nesting depth is the peak size a matching stack of '(' would ever reach. Since brackets are guaranteed balanced, the stack collapses to a single **depth counter** — increment on '(', decrement on ')', track the maximum.",
    figureItOut: [
      "Nesting depth at any character is simply how many unmatched '(' are currently open — which is exactly the height a stack of open parentheses would have at that moment.",
      "Because the string is guaranteed valid, you never need the stack's contents, only its size. So replace the whole stack with a single integer counter representing current depth.",
      "Scan left to right: each '(' opens a new level (counter + 1), and each ')' closes the most recent one (counter − 1). All non-parenthesis characters leave the depth unchanged.",
      "The answer is the largest value the counter ever reaches, so record a running maximum right after each increment (the peak can only occur on an opening bracket).",
      "One pass, O(1) counter work per character → O(n) time, O(1) space — the degenerate stack made explicit.",
    ],
    approaches: [
      {
        name: "Depth counter, track the peak (optimal)",
        intuition: "A balanced string lets the stack become a single counter; the answer is the highest depth it reaches.",
        time: "O(n)",
        timeWhy: "One scan adjusting and sampling a counter.",
        space: "O(1)",
        spaceWhy: "Two integers: current depth and the maximum seen.",
        code: `int maxDepth(String s) {
    int depth = 0, max = 0;
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(') {
            depth++;
            if (depth > max) max = depth;
        } else if (c == ')') {
            depth--;
        }
    }
    return max;
}`,
        walkthrough: [
          's="(1+(2*3)+((8)/4))+1". \'(\' depth1 max1. \'(\' depth2 max2. \')\' depth1.',
          "Later '((' raises depth to 3 → max3. The 8 sits at depth 3.",
          "Remaining ')' lower depth back to 0; max stays 3 → return 3.",
        ],
      },
    ],
    edgeCases: [
      "No parentheses at all → depth never rises → maximum 0.",
      "Flat siblings like '()()' → depth toggles 0↔1 → maximum 1.",
      "Fully nested '(((...)))' → depth climbs to the nesting count, which is the answer.",
    ],
    twists: [
      "**Score of Parentheses** (in this file) → same depth/stack walk but accumulating a numeric score.",
      "**Remove Outermost Parentheses** (in this file) → uses the depth counter to decide which brackets to drop.",
      "**Maximum Depth of Nested Lists / Arrays** → the same peak-depth counter over a different bracket alphabet.",
    ],
    related: ["score-of-parentheses", "remove-outermost-parentheses"],
  },
];
