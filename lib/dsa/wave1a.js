// NeetCode 150 — wave 1a (arrays & hashing, two pointers, sliding window). Java.
export const WAVE1A = [
  // ───────────────────────────── ARRAYS & HASHING ─────────────────────────────
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 49,
    statement:
      "Given an array of strings `strs`, **group together** the strings that are anagrams of each other. Return the groups in any order.",
    examples: [
      { in: 'strs = ["eat","tea","tan","ate","nat","bat"]', out: '[["eat","tea","ate"],["tan","nat"],["bat"]]', note: "anagrams share the same letters" },
      { in: 'strs = [""]', out: '[[""]]' },
      { in: 'strs = ["a"]', out: '[["a"]]' },
    ],
    constraints: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100", "lowercase English letters"],
    recognize:
      "You're **bucketing items by a shared property** (being anagrams). 'Group by X' is the signal for a **hash map** whose key *is* that property. The whole problem reduces to: what single key do all anagrams share?",
    figureItOut: [
      "Brute force: compare every string with every other to test if they're anagrams, then union them. That's O(n²) comparisons, each costing O(k) — slow and awkward to bookkeep. The real question is: *what makes two strings the same group?*",
      "Two strings are anagrams iff they have the **same letters in the same counts**. So if you can compute a **canonical key** that's identical for all anagrams and different for non-anagrams, grouping becomes a single hash-map pass.",
      "Easiest canonical key: **sort the string**. \"eat\", \"tea\", \"ate\" all sort to \"aet\". Use that as the map key; append each original string to its bucket. O(n · k log k).",
      "Can we drop the sort? Since the alphabet is 26 lowercase letters, a faster key is the **count signature** — a 26-length count array turned into a string like \"#1#0#0...#1\". Building it is O(k), so the whole thing is O(n · k).",
      "Either key works; pick the count signature when k is large (avoids the log k), the sort key when you want the simplest code.",
    ],
    approaches: [
      {
        name: "Sorted string as the key",
        intuition: "Anagrams collapse to the same string once sorted — use that as the bucket key.",
        time: "O(n · k log k)",
        timeWhy: "n strings, each of length up to k sorted in k log k time.",
        space: "O(n · k)",
        spaceWhy: "The map stores every string once across all buckets.",
        code: `List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
        char[] chars = s.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}`,
        walkthrough: [
          '"eat" → key "aet"; "tea" → "aet"; "tan" → "ant"; "ate" → "aet"; "nat" → "ant"; "bat" → "abt".',
          'Buckets: "aet"=[eat,tea,ate], "ant"=[tan,nat], "abt"=[bat].',
        ],
      },
      {
        name: "Count signature as the key (optimal)",
        intuition: "Build a 26-letter count array per string and use it as the key — no sorting.",
        time: "O(n · k)",
        timeWhy: "Each string is scanned once to build a constant-size (26) count; no per-string log factor.",
        space: "O(n · k)",
        spaceWhy: "Same storage of all strings, plus a fixed 26-slot count reused per string.",
        code: `List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
        int[] count = new int[26];
        for (char c : s.toCharArray()) count[c - 'a']++;
        StringBuilder key = new StringBuilder();
        for (int n : count) key.append('#').append(n);
        groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}`,
        walkthrough: [
          '"eat" → counts a:1,e:1,t:1 → key "#1#0#0#0#1...#1..."; "tea" builds the identical key.',
          'The "#" separators stop "#1#11" colliding with "#11#1".',
        ],
      },
    ],
    edgeCases: [
      "Empty string \"\" → its key is the all-zero signature; it groups with other empty strings.",
      "A single string → one group with one element.",
      "Without separators in the count key, counts like 1 and 11 can run together and collide — keep the '#'.",
    ],
    twists: [
      "**Uppercase / Unicode input** → the 26-array trick breaks; sort the string or use a `HashMap<Character,Integer>` signature.",
      "**Group by a different equivalence** (e.g. same digits) → swap only the key function; the bucketing stays.",
      "**Return only the largest group** → keep a running max while inserting.",
    ],
    related: ["valid-anagram", "top-k-frequent-elements"],
  },

  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 347,
    statement:
      "Given an integer array `nums` and an integer `k`, return the **k most frequent** elements. You may return the answer in any order.",
    examples: [
      { in: "nums = [1,1,1,2,2,3], k = 2", out: "[1,2]", note: "1 appears 3×, 2 appears 2×" },
      { in: "nums = [1], k = 1", out: "[1]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "k is in [1, number of distinct elements]", "the answer is unique"],
    recognize:
      "'**Most frequent**' = count first (hash map), then select the top k. The 'top k' phrase usually means a **heap** (O(n log k)), but a count bounded by n unlocks an O(n) **bucket sort** by frequency.",
    figureItOut: [
      "Step one is unavoidable: you need the frequency of each value, so tally them in a hash map — O(n).",
      "Now you have (value, freq) pairs and want the k biggest by freq. The naive choice: **sort** all distinct values by frequency and take the top k → O(n log n). Works, but sorting is more than we need.",
      "If you only need the *top* k, a **min-heap of size k** keeps the k largest seen: push each pair, and whenever the heap exceeds k, pop the smallest. O(n log k) — better when k is small.",
      "Can we hit O(n)? Key insight: a frequency can be **at most n** (an element can't appear more than n times). So make **buckets indexed by frequency** — bucket[f] holds all values that occur f times.",
      "Walk the buckets from highest frequency down, collecting values until you have k. Since there are only n+1 buckets and n total values, this is O(n) time and space — no comparison sort at all.",
    ],
    approaches: [
      {
        name: "Count + min-heap of size k",
        intuition: "Tally counts, then keep only the k most frequent in a size-k min-heap.",
        time: "O(n log k)",
        timeWhy: "n pushes/pops on a heap capped at size k, each O(log k).",
        space: "O(n + k)",
        spaceWhy: "The count map holds up to n entries; the heap holds k.",
        code: `int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int n : nums) count.merge(n, 1, Integer::sum);
    PriorityQueue<int[]> heap =
        new PriorityQueue<>((a, b) -> a[1] - b[1]);   // min-heap by frequency
    for (Map.Entry<Integer, Integer> e : count.entrySet()) {
        heap.offer(new int[]{e.getKey(), e.getValue()});
        if (heap.size() > k) heap.poll();             // drop the least frequent
    }
    int[] res = new int[k];
    for (int i = 0; i < k; i++) res[i] = heap.poll()[0];
    return res;
}`,
        walkthrough: [
          "counts {1:3, 2:2, 3:1}, k=2. Push 1(3); push 2(2); push 3(1) → size 3 > 2 → pop smallest (3).",
          "Heap holds {2(2), 1(3)} → answer [2,1] (order not required).",
        ],
      },
      {
        name: "Bucket sort by frequency (optimal)",
        intuition: "Frequency can't exceed n, so index buckets by frequency and sweep from the top.",
        time: "O(n)",
        timeWhy: "Counting is O(n); filling and scanning n+1 buckets is O(n) — no log factor.",
        space: "O(n)",
        spaceWhy: "The count map plus an array of n+1 buckets.",
        code: `int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int n : nums) count.merge(n, 1, Integer::sum);
    List<Integer>[] buckets = new List[nums.length + 1];
    for (Map.Entry<Integer, Integer> e : count.entrySet()) {
        int f = e.getValue();
        if (buckets[f] == null) buckets[f] = new ArrayList<>();
        buckets[f].add(e.getKey());
    }
    int[] res = new int[k];
    int idx = 0;
    for (int f = buckets.length - 1; f >= 0 && idx < k; f--) {
        if (buckets[f] == null) continue;
        for (int val : buckets[f]) {
            res[idx++] = val;
            if (idx == k) break;
        }
    }
    return res;
}`,
        walkthrough: [
          "counts {1:3, 2:2, 3:1}. buckets[3]=[1], buckets[2]=[2], buckets[1]=[3].",
          "Sweep f=6..0: f=3 take 1; f=2 take 2; now idx==k=2 → return [1,2].",
        ],
      },
    ],
    edgeCases: [
      "k equals the number of distinct elements → return all of them.",
      "All elements identical → one value occupies the highest bucket.",
      "Bucket index 0 is unused (no value has frequency 0); allocating n+1 buckets keeps indices aligned with the actual frequency.",
    ],
    twists: [
      "**Top K frequent words** (LeetCode 692) → ties broken alphabetically → a heap with a custom comparator fits better than buckets.",
      "**Streaming / can't fit all counts** → a size-k heap is the standard online answer.",
      "**Kth most frequent only** → same count, then quickselect on frequencies in O(n) average.",
    ],
    related: ["group-anagrams", "valid-anagram"],
  },

  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 238,
    statement:
      "Given an integer array `nums`, return an array `answer` where `answer[i]` is the **product of all elements except `nums[i]`**. You must solve it **without using division** and in O(n) time.",
    examples: [
      { in: "nums = [1,2,3,4]", out: "[24,12,8,6]", note: "24=2·3·4, 12=1·3·4, ..." },
      { in: "nums = [-1,1,0,-3,3]", out: "[0,0,9,0,0]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁵", "−30 ≤ nums[i] ≤ 30", "the answer fits in a 32-bit integer", "no division allowed"],
    recognize:
      "Each output cell needs 'everything **except me**' — that splits cleanly into the product of everything to my **left** times everything to my **right**. 'Combine a left-running and right-running aggregate' is the **prefix/suffix** pattern.",
    figureItOut: [
      "Obvious idea: total product divided by nums[i]. But **division is banned** (and it dies on zeros anyway). So think structurally instead.",
      "The product of all elements except index i is exactly **(product of everything left of i) × (product of everything right of i)**. Those two pieces never include nums[i] itself.",
      "Compute a **prefix product** array: prefix[i] = product of nums[0..i-1]. Then a **suffix product** array: suffix[i] = product of nums[i+1..n-1]. The answer is prefix[i] × suffix[i]. That's O(n) time but O(n) extra space for two arrays.",
      "Now fold the space away. Use the output array itself for the prefix pass: answer[i] = prefix so far. Then sweep **right to left** with a single running suffix variable, multiplying it in. That gives O(1) extra space (the output array doesn't count).",
      "Watch the boundaries: the leftmost cell has an empty left product (= 1) and the rightmost has an empty right product (= 1).",
    ],
    approaches: [
      {
        name: "Prefix and suffix arrays",
        intuition: "Precompute products to the left and to the right of each index, then multiply.",
        time: "O(n)",
        timeWhy: "Three linear passes (prefix, suffix, combine).",
        space: "O(n)",
        spaceWhy: "Two auxiliary arrays of length n.",
        code: `int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] prefix = new int[n], suffix = new int[n], answer = new int[n];
    prefix[0] = 1;
    for (int i = 1; i < n; i++) prefix[i] = prefix[i - 1] * nums[i - 1];
    suffix[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--) suffix[i] = suffix[i + 1] * nums[i + 1];
    for (int i = 0; i < n; i++) answer[i] = prefix[i] * suffix[i];
    return answer;
}`,
        walkthrough: [
          "nums=[1,2,3,4]. prefix=[1,1,2,6]; suffix=[24,12,4,1].",
          "answer = [1·24, 1·12, 2·4, 6·1] = [24,12,8,6].",
        ],
      },
      {
        name: "Two passes, O(1) extra space (optimal)",
        intuition: "Store the prefix product in the output, then multiply in a running suffix on a backward pass.",
        time: "O(n)",
        timeWhy: "Two linear passes.",
        space: "O(1)",
        spaceWhy: "Only one running variable beyond the required output array.",
        code: `int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    answer[0] = 1;
    for (int i = 1; i < n; i++) answer[i] = answer[i - 1] * nums[i - 1];  // prefix
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= suffix;        // combine left product with right product
        suffix *= nums[i];          // extend the running right product
    }
    return answer;
}`,
        walkthrough: [
          "Forward: answer=[1,1,2,6] (prefix products).",
          "Backward: i=3 ans=6·1=6, suffix=4; i=2 ans=2·4=8, suffix=12; i=1 ans=1·12=12, suffix=24; i=0 ans=1·24=24 → [24,12,8,6].",
        ],
      },
    ],
    edgeCases: [
      "**One zero** in the array → only that index is non-zero (product of the others); every other cell is 0.",
      "**Two or more zeros** → every output cell is 0.",
      "Negative numbers just flip signs — the prefix/suffix logic is unchanged.",
      "The output array is not counted as extra space by the convention this problem uses.",
    ],
    twists: [
      "**Division allowed and no zeros** → answer[i] = total / nums[i] in one pass.",
      "**Sum except self** → same prefix/suffix idea with addition (or total − nums[i]).",
      "**2-D 'product of matrix except this cell'** → prefix products by row and column.",
    ],
    related: ["two-sum", "top-k-frequent-elements"],
  },

  {
    slug: "valid-sudoku",
    title: "Valid Sudoku",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 36,
    statement:
      "Given a 9×9 Sudoku board (partially filled, empty cells are `'.'`), determine if it is **valid**: each digit 1–9 appears at most once per **row**, per **column**, and per **3×3 sub-box**. You only validate the filled cells — the board need not be solvable.",
    examples: [
      { in: "a board with no row/col/box repeats among filled cells", out: "true" },
      { in: "a board where two 8s share the top-left 3×3 box", out: "false" },
    ],
    constraints: ["board is 9×9", "each cell is a digit 1–9 or '.'"],
    recognize:
      "It's three simultaneous **duplicate checks** (row, column, box) over a fixed grid. 'Has this already appeared in its group?' is a **hash set** per group — the only trick is naming each group with a key.",
    figureItOut: [
      "Validity has three independent rules: no repeat in a row, none in a column, none in a 3×3 box. Each rule is just *duplicate detection within a group* — and duplicate detection is a **hash set**.",
      "So track a set per row, a set per column, and a set per box. As you scan each filled cell, check all three sets; if the digit is already in any of them, the board is invalid.",
      "The only puzzle is identifying which **box** a cell belongs to. There are 9 boxes in a 3×3 grid of boxes; cell (r, c) lives in box `(r / 3) * 3 + (c / 3)` — integer division collapses each 3-row/3-column band into one index.",
      "One pass over all 81 cells, doing O(1) set work each, validates everything. Skip '.' cells — they're empty, not values.",
      "Because the board is fixed at 9×9, the whole thing is technically O(1), but the *shape* is exactly the same pattern that scales to an N×N board.",
    ],
    approaches: [
      {
        name: "One pass with per-group hash sets (optimal)",
        intuition: "Keep a set for each row, column, and box; a digit repeating in its group fails.",
        time: "O(1)",
        timeWhy: "Fixed 81 cells with O(1) work each — constant for the 9×9 board (O(N²) in general).",
        space: "O(1)",
        spaceWhy: "27 sets holding at most 9 digits each — a fixed bound.",
        code: `boolean isValidSudoku(char[][] board) {
    Set<Character>[] rows = new HashSet[9];
    Set<Character>[] cols = new HashSet[9];
    Set<Character>[] boxes = new HashSet[9];
    for (int i = 0; i < 9; i++) {
        rows[i] = new HashSet<>();
        cols[i] = new HashSet<>();
        boxes[i] = new HashSet<>();
    }
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char d = board[r][c];
            if (d == '.') continue;
            int b = (r / 3) * 3 + (c / 3);
            if (!rows[r].add(d) || !cols[c].add(d) || !boxes[b].add(d)) {
                return false;     // add returns false if d was already present
            }
        }
    }
    return true;
}`,
        walkthrough: [
          "Scan cell (0,0)=5: add to rows[0], cols[0], boxes[0] — all fresh.",
          "If later (0,4)=5 in the same row, rows[0].add('5') returns false → invalid.",
          "Box index for (4,7): (4/3)*3 + (7/3) = 1*3 + 2 = 5.",
        ],
      },
    ],
    edgeCases: [
      "Empty cells '.' are skipped — they never count as duplicates.",
      "A digit may legally repeat across *different* groups (same digit in two different rows is fine); the per-group sets handle that.",
      "Box index math is the classic bug — verify `(r/3)*3 + (c/3)` maps each cell to 0–8.",
    ],
    twists: [
      "**Solve the Sudoku** (LeetCode 37) → backtracking that places a digit only when these same three checks pass.",
      "**Single combined key set** → encode each constraint as a string like \"r3=5\", \"c7=5\", \"b2=5\" in one HashSet.",
      "**Bitmask instead of sets** → 9-bit int per row/col/box; setting an already-set bit means a duplicate.",
    ],
    related: ["contains-duplicate", "group-anagrams"],
  },

  {
    slug: "encode-and-decode-strings",
    title: "Encode and Decode Strings",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 271,
    statement:
      "Design an algorithm to **encode** a list of strings into a single string, and **decode** that single string back into the original list. The strings may contain any characters, including your delimiter — so the encoding must be unambiguous.",
    examples: [
      { in: 'encode(["neet","code","love","you"])', out: '"4#neet4#code4#love3#you"' },
      { in: 'decode("4#neet4#code4#love3#you")', out: '["neet","code","love","you"]' },
    ],
    constraints: ["0 ≤ strs.length", "strings may contain any characters (including '#' and digits)"],
    recognize:
      "A serialization / **framing** problem: pack many strings into one without ambiguity. The trap is picking a separator that can appear in the data. The fix is **length-prefixing** — store each string's length so you never have to guess where it ends.",
    figureItOut: [
      "First instinct: join with a separator like ',' or '#'. But the strings can **contain** that separator, so splitting on it is ambiguous — you can't tell a real '#' from a delimiter.",
      "You could try escaping the delimiter, but escaping gets fiddly. The clean idea: instead of marking *where a string ends*, declare **how long it is** up front.",
      "Encode each string as **length + '#' + string**. On decode, read digits until '#' to get the length L, then take exactly the next L characters verbatim — no matter what they contain. That '#' only ever terminates the *number*, which is always pure digits, so there's never ambiguity.",
      "Decoding is a pointer walk: read the length, jump past '#', slice L chars, advance the pointer to the next chunk, repeat until the string is consumed.",
      "This handles empty strings (length 0 → \"0#\"), strings full of '#', everything — because the content is copied by count, never parsed.",
    ],
    approaches: [
      {
        name: "Length-prefix framing (optimal)",
        intuition: "Prefix each string with its length and a '#'; decode by reading the length, then copying exactly that many characters.",
        time: "O(N)",
        timeWhy: "N is the total number of characters; encode and decode each touch every character once.",
        space: "O(N)",
        spaceWhy: "The encoded string and the rebuilt list are both O(N).",
        code: `String encode(List<String> strs) {
    StringBuilder sb = new StringBuilder();
    for (String s : strs) {
        sb.append(s.length()).append('#').append(s);
    }
    return sb.toString();
}

List<String> decode(String s) {
    List<String> res = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
        int j = i;
        while (s.charAt(j) != '#') j++;       // read the length digits
        int len = Integer.parseInt(s.substring(i, j));
        String word = s.substring(j + 1, j + 1 + len);  // copy exactly len chars
        res.add(word);
        i = j + 1 + len;                      // jump to the next chunk
    }
    return res;
}`,
        walkthrough: [
          'encode(["neet","code"]) → "4#neet" + "4#code" = "4#neet4#code".',
          'decode: i=0, j stops at the \'#\' after "4", len=4, word="neet", i jumps to 6; then len=4, word="code".',
          'A string like "a#b" encodes as "3#a#b" — decode reads len=3 then copies "a#b" wholesale, no confusion.',
        ],
      },
    ],
    edgeCases: [
      "Empty list → encodes to \"\" → decodes to an empty list.",
      "Empty string in the list → encodes as \"0#\" → decodes to \"\".",
      "Strings containing '#' or digits → handled, because content is copied by length, never split on a delimiter.",
    ],
    twists: [
      "**Non-ASCII / arbitrary bytes** → use the byte length, or a fixed-width length header, so multibyte characters don't miscount.",
      "**Escape-based encoding** → double the delimiter ('#' → '##') and split carefully; correct but more error-prone than length-prefixing.",
      "**Serialize a tree** (LeetCode 297) → same framing idea applied to nodes and null markers.",
    ],
    related: ["group-anagrams", "valid-anagram"],
  },

  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    pattern: "arrays-hashing",
    leetcode: 128,
    statement:
      "Given an unsorted array `nums`, return the length of the **longest run of consecutive integers** (e.g. 3,4,5,6). You must run in **O(n)** time.",
    examples: [
      { in: "nums = [100,4,200,1,3,2]", out: "4", note: "the run 1,2,3,4" },
      { in: "nums = [0,3,7,2,5,8,4,6,0,1]", out: "9", note: "0..8" },
    ],
    constraints: ["0 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹", "O(n) time required"],
    recognize:
      "'Consecutive' screams *sort*, but the **O(n)** requirement forbids it (sorting is n log n). That tension is the clue: dump everything into a **hash set** for O(1) membership, then be clever about where you start counting.",
    figureItOut: [
      "The easy answer is to sort and scan for the longest increasing-by-1 run. That's O(n log n) — but the problem demands O(n), so sorting is off the table.",
      "Put all numbers in a **hash set** so you can ask 'does x+1 exist?' in O(1). Now you could, for each number, walk upward x, x+1, x+2... counting. But that re-walks the same run from every member — O(n²) in the worst case.",
      "The fix is to only **start counting from the beginning of a run**. A number x is a run-start iff **x − 1 is NOT in the set** (nothing precedes it). If x − 1 *is* present, x is in the middle of some run and we'll count it when we start from that run's true beginning.",
      "From each genuine start, walk x, x+1, x+2... while each is in the set, counting the length. Track the max.",
      "Why is this O(n)? Each number is visited by the inner walk **at most once total** — only as part of the single run whose start triggered it. The 'is x−1 present?' guard is what guarantees no run is counted twice.",
    ],
    approaches: [
      {
        name: "Sort then scan",
        intuition: "Sort, then count consecutive runs in one pass.",
        time: "O(n log n)",
        timeWhy: "Dominated by the sort; the scan is linear.",
        space: "O(1)",
        spaceWhy: "Sorts in place (ignoring sort's own overhead).",
        code: `int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    Arrays.sort(nums);
    int best = 1, cur = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) continue;          // skip duplicates
        if (nums[i] == nums[i - 1] + 1) cur++;          // extends the run
        else cur = 1;                                   // run broke, restart
        best = Math.max(best, cur);
    }
    return best;
}`,
        walkthrough: [
          "sorted [1,2,3,4,100,200]: run 1→2→3→4 makes cur=4; then 100 restarts cur=1; best stays 4.",
        ],
      },
      {
        name: "Hash set, count only from run starts (optimal)",
        intuition: "Store all numbers; start a count only where x−1 is absent, then walk upward.",
        time: "O(n)",
        timeWhy: "Each number is the inner-walk subject at most once, because counting only begins at run starts.",
        space: "O(n)",
        spaceWhy: "The set holds all n numbers.",
        code: `int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int best = 0;
    for (int n : set) {
        if (set.contains(n - 1)) continue;   // not a run start, skip
        int length = 1;
        int cur = n;
        while (set.contains(cur + 1)) {       // walk the run upward
            cur++;
            length++;
        }
        best = Math.max(best, length);
    }
    return best;
}`,
        walkthrough: [
          "set={100,4,200,1,3,2}. n=1: 0 absent → start; walk 1,2,3,4 → length 4.",
          "n=2,3,4: each has a predecessor in the set → skipped. n=100: 99 absent → length 1. best=4.",
        ],
      },
    ],
    edgeCases: [
      "Empty array → 0.",
      "Duplicates (e.g. two 0s) → the set dedupes them; they don't inflate the length.",
      "Forgetting the 'x−1 absent' guard turns the hash approach back into O(n²).",
    ],
    twists: [
      "**Return the actual sequence** → record the start and length of the best run.",
      "**Longest consecutive run in a binary tree path** → DFS tracking the current streak.",
      "**Allow gaps of at most 1** → a different problem; sort and use a sliding window.",
    ],
    related: ["contains-duplicate", "two-sum"],
  },

  // ───────────────────────────── TWO POINTERS ─────────────────────────────
  {
    slug: "two-sum-ii",
    title: "Two Sum II — Input Array Is Sorted",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 167,
    statement:
      "Given a **1-indexed sorted** array `numbers` and a `target`, return the indices `[i, j]` (1-based, i < j) of the two numbers that add up to `target`. Exactly one solution exists, and you must use **O(1) extra space**.",
    examples: [
      { in: "numbers = [2,7,11,15], target = 9", out: "[1,2]", note: "2 + 7 = 9" },
      { in: "numbers = [2,3,4], target = 6", out: "[1,3]", note: "2 + 4 = 6" },
    ],
    constraints: ["2 ≤ numbers.length ≤ 3·10⁴", "numbers is sorted ascending", "exactly one solution", "O(1) extra space"],
    recognize:
      "Two Sum, but the array is **sorted** and you're forbidden the O(n) hash map (O(1) space). Sorted + 'find a pair summing to target' is the canonical **two-pointers-from-both-ends** setup.",
    figureItOut: [
      "This is Two Sum, so a hash map would work — but the constraint says **O(1) extra space**, which a map violates. The array being **sorted** is the hint that something cheaper exists.",
      "Put one pointer `l` at the smallest element and one `r` at the largest. Their sum is the current candidate. Now reason about how to move them to get closer to the target.",
      "If `numbers[l] + numbers[r]` is **too big**, the only way to shrink the sum is to lower the larger value: move `r` left. If it's **too small**, raise the smaller value: move `l` right. If it equals the target, you're done.",
      "Each move discards exactly one number that can no longer be part of any solution (a sorted-array guarantee), so the pointers march toward each other and never miss the answer.",
      "That's O(n) time, O(1) space — one pass inward, no extra structure.",
    ],
    approaches: [
      {
        name: "Two pointers from both ends (optimal)",
        intuition: "Move the ends inward: too-big sum lowers the right pointer, too-small raises the left.",
        time: "O(n)",
        timeWhy: "The pointers only move toward each other — at most n total steps.",
        space: "O(1)",
        spaceWhy: "Two index variables; no hash map needed thanks to the sorted order.",
        code: `int[] twoSum(int[] numbers, int target) {
    int l = 0, r = numbers.length - 1;
    while (l < r) {
        int sum = numbers[l] + numbers[r];
        if (sum == target) return new int[]{l + 1, r + 1};  // 1-indexed
        else if (sum < target) l++;   // need a bigger sum
        else r--;                     // need a smaller sum
    }
    return new int[]{};   // problem guarantees a solution
}`,
        walkthrough: [
          "[2,7,11,15], target 9: l=0(2), r=3(15) → 17 > 9 → r=2.",
          "l=0(2), r=2(11) → 13 > 9 → r=1. l=0(2), r=1(7) → 9 → return [1,2].",
        ],
      },
    ],
    edgeCases: [
      "Negative numbers and a negative target — the comparison logic is identical.",
      "Remember the **1-based** indices: return l+1 and r+1.",
      "Exactly two elements that sum to target → l and r meet immediately.",
    ],
    twists: [
      "**Unsorted input** → you can't sort (it loses indices); use the hash-map Two Sum instead.",
      "**Count all pairs summing to target** → after a hit, move both pointers and skip duplicates (like 3Sum).",
      "**3Sum / 4Sum** → fix one (or two) elements, then this exact two-pointer sweep on the rest.",
    ],
    related: ["two-sum", "3sum"],
  },

  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    pattern: "two-pointers",
    leetcode: 11,
    statement:
      "Given an array `height` where `height[i]` is the height of a vertical line at position i, find two lines that, with the x-axis, form a container holding the **most water**. Return that maximum area.",
    examples: [
      { in: "height = [1,8,6,2,5,4,8,3,7]", out: "49", note: "lines at index 1 and 8: min(8,7)·7" },
      { in: "height = [1,1]", out: "1" },
    ],
    constraints: ["2 ≤ height.length ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    recognize:
      "You're maximizing something defined by the **two ends of a span** (area = width × shorter wall). Comparing/optimizing over the two ends, shrinking inward, is the **two-pointers** shape. The insight is *which* pointer to move.",
    figureItOut: [
      "Brute force: try every pair (i, j), area = (j − i) × min(height[i], height[j]), keep the max. O(n²). Correct — now find the structure that lets us skip pairs.",
      "Start with the **widest** container: pointers at both ends. Its width is maximal; the only thing limiting its area is the **shorter** of the two walls.",
      "Here's the key move: to have any hope of a bigger area, you must increase the limiting height — and the limiting wall is the **shorter** one. Moving the **taller** pointer can only keep or worsen the bottleneck (width shrinks, height capped by the same short wall). So always move the **shorter** wall inward.",
      "Why is this safe? The shorter wall, paired with *any* line to its inside, can never beat its current pairing (width is now smaller and it's still the cap). So discarding it loses no better solution — we can drop it and move on.",
      "Each step moves one pointer inward and re-checks the area, so it's a single O(n) sweep from the widest container toward the middle.",
    ],
    approaches: [
      {
        name: "Brute force — every pair",
        intuition: "Compute the area for all i<j and keep the max.",
        time: "O(n²)",
        timeWhy: "Every pair of lines is considered.",
        space: "O(1)",
        spaceWhy: "Just a running maximum.",
        code: `int maxArea(int[] height) {
    int best = 0;
    for (int i = 0; i < height.length; i++)
        for (int j = i + 1; j < height.length; j++)
            best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
    return best;
}`,
      },
      {
        name: "Two pointers, move the shorter wall (optimal)",
        intuition: "Start at the widest span; each step move the shorter wall inward, since only that can raise the bottleneck.",
        time: "O(n)",
        timeWhy: "The two pointers move toward each other — at most n total steps.",
        space: "O(1)",
        spaceWhy: "Two indices and a running max.",
        code: `int maxArea(int[] height) {
    int l = 0, r = height.length - 1, best = 0;
    while (l < r) {
        int area = (r - l) * Math.min(height[l], height[r]);
        best = Math.max(best, area);
        if (height[l] < height[r]) l++;   // move the shorter wall
        else r--;
    }
    return best;
}`,
        walkthrough: [
          "[1,8,6,2,5,4,8,3,7]: l=0(1), r=8(7) → area 8·1=8; height[l] shorter → l=1.",
          "l=1(8), r=8(7) → area 7·7=49; move r (shorter). Sweeps inward, best stays 49.",
        ],
      },
    ],
    edgeCases: [
      "Exactly two lines → that single pair is the answer.",
      "Zero-height lines hold no water but still set the width.",
      "When the two walls are equal, moving either is fine — the discarded one can't beat its current best.",
    ],
    twists: [
      "**Trapping Rain Water** (LeetCode 42) → looks similar but sums water *between* all bars, not one container — different bookkeeping.",
      "**Most water with a width penalty** → fold the cost into the area function; the move-the-shorter argument may change.",
      "**Return the indices** → track l and r when you update the best area.",
    ],
    related: ["trapping-rain-water", "two-sum-ii"],
  },

  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    pattern: "two-pointers",
    leetcode: 42,
    statement:
      "Given `height`, an array of non-negative bar heights each of width 1, compute how much **water** is trapped between the bars after raining.",
    examples: [
      { in: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", out: "6" },
      { in: "height = [4,2,0,3,2,5]", out: "9" },
    ],
    constraints: ["0 ≤ height.length ≤ 2·10⁴", "0 ≤ height[i] ≤ 10⁵"],
    recognize:
      "Water above each bar depends on the **tallest wall to its left and right**. 'Each cell's answer is governed by a max-from-the-left and a max-from-the-right' is a **prefix/suffix max** problem, which a clever **two-pointer** pass collapses to O(1) space.",
    figureItOut: [
      "Think per-column. The water sitting on top of bar i is bounded by the **tallest bar to its left** and the **tallest to its right**: water[i] = min(maxLeft[i], maxRight[i]) − height[i] (never negative). The shorter of the two walls is what limits the level.",
      "Brute force: for each i, scan left for its max and right for its max → O(n²). The waste is obvious — those maxima are recomputed from scratch every time.",
      "Precompute them: a left-to-right pass fills maxLeft[i] (tallest bar at or before i), a right-to-left pass fills maxRight[i]. Then one pass sums min(maxLeft[i], maxRight[i]) − height[i]. That's O(n) time but O(n) extra space for the two arrays.",
      "To reach O(1) space, use two pointers `l` and `r` with running `leftMax` and `rightMax`. Key insight: if `leftMax < rightMax`, then for the left pointer the binding wall is `leftMax` (the right side is guaranteed taller), so you can safely settle water at `l` using `leftMax` alone — and advance `l`. Symmetrically when `rightMax ≤ leftMax`, settle at `r`.",
      "Each step finalizes exactly one column's water using whichever side's max is provably the limiter, so a single inward sweep computes the total in O(n) time, O(1) space.",
    ],
    approaches: [
      {
        name: "Prefix-max and suffix-max arrays",
        intuition: "Precompute the tallest wall to each side, then sum the trapped water per column.",
        time: "O(n)",
        timeWhy: "Three linear passes.",
        space: "O(n)",
        spaceWhy: "Two arrays of length n for the left and right maxima.",
        code: `int trap(int[] height) {
    int n = height.length;
    if (n == 0) return 0;
    int[] maxLeft = new int[n], maxRight = new int[n];
    maxLeft[0] = height[0];
    for (int i = 1; i < n; i++) maxLeft[i] = Math.max(maxLeft[i - 1], height[i]);
    maxRight[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--) maxRight[i] = Math.max(maxRight[i + 1], height[i]);
    int water = 0;
    for (int i = 0; i < n; i++) {
        water += Math.min(maxLeft[i], maxRight[i]) - height[i];
    }
    return water;
}`,
        walkthrough: [
          "[4,2,0,3,2,5]: maxLeft=[4,4,4,4,4,5]; maxRight=[5,5,5,5,5,5].",
          "Per column min−height: 0,2,4,1,2,0 → sum = 9.",
        ],
      },
      {
        name: "Two pointers with running maxima (optimal space)",
        intuition: "Walk inward; whichever side has the smaller running max is the binding wall, so settle that column's water and advance.",
        time: "O(n)",
        timeWhy: "Each column is finalized exactly once as a pointer passes it.",
        space: "O(1)",
        spaceWhy: "Two pointers and two running-max scalars — no arrays.",
        code: `int trap(int[] height) {
    int l = 0, r = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            leftMax = Math.max(leftMax, height[l]);
            water += leftMax - height[l];   // left side is the limiter
            l++;
        } else {
            rightMax = Math.max(rightMax, height[r]);
            water += rightMax - height[r];  // right side is the limiter
            r--;
        }
    }
    return water;
}`,
        walkthrough: [
          "[4,2,0,3,2,5]: height[l]=4 vs height[r]=5 → 4<5 → leftMax=4, water+=0, l=1.",
          "height[1]=2<5 → leftMax stays 4, water+=2; height[2]=0<5 → water+=4; height[3]=3<5 → water+=1; height[4]=2<5 → water+=2 → total 9.",
        ],
      },
    ],
    edgeCases: [
      "Empty or single bar → 0 water.",
      "Monotonic heights (only increasing or only decreasing) → no water trapped.",
      "A 'min(left,right) − height' that goes negative means that bar overflows — guarded because the binding max is always ≥ height.",
    ],
    twists: [
      "**Trapping Rain Water II** (2-D grid, LeetCode 407) → a min-heap flood-fill from the borders inward.",
      "**Return the water profile per column** → keep the per-column values instead of just the sum.",
      "**Monotonic stack solution** → fill water layer by layer between a bar and the previous taller bar.",
    ],
    related: ["container-with-most-water", "product-of-array-except-self"],
  },

  // ───────────────────────────── SLIDING WINDOW ─────────────────────────────
  {
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 424,
    statement:
      "Given a string `s` (uppercase English) and an integer `k`, you may replace **at most k characters** with any uppercase letter. Return the length of the **longest substring of a single repeated letter** you can produce.",
    examples: [
      { in: 's = "ABAB", k = 2', out: "4", note: "replace the two A's or two B's" },
      { in: 's = "AABABBA", k = 1', out: "4", note: '"AABA" → "AAAA" or "ABBB"' },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "0 ≤ k ≤ s.length", "uppercase English letters"],
    recognize:
      "'**Longest contiguous** substring achievable under a budget (≤ k changes)' is a **sliding window**. A window is valid while the characters you'd have to replace fit in k; expand greedily, shrink when it overflows.",
    figureItOut: [
      "The answer is a contiguous substring, so a window [l..r] is the right frame. Inside a window, to make it all one letter, you keep the most common letter and **replace the rest**. The number of replacements needed is `(window length) − (count of the most frequent letter)`.",
      "A window is **valid** when that replacement count is ≤ k: `(r − l + 1) − maxFreq ≤ k`. So track the frequency of each letter in the window and the highest frequency `maxFreq`.",
      "Grow `r` one step at a time, updating counts. If the window becomes invalid (replacements needed exceed k), slide `l` forward to shrink it back to validity, decrementing the count of the character leaving.",
      "Subtle optimization: you never need to *decrease* `maxFreq` when shrinking. The answer only cares about the largest valid window ever seen; a stale, slightly-too-high `maxFreq` can only make the window grow, and the recorded best is still correct. So the window width never shrinks below the best — it just slides.",
      "The answer is the maximum window length reached. One pass, O(n), with a 26-slot count array.",
    ],
    approaches: [
      {
        name: "Sliding window on replacement budget (optimal)",
        intuition: "Keep a window valid while (length − most-frequent-count) ≤ k; track the widest such window.",
        time: "O(n)",
        timeWhy: "Each character enters and leaves the window once; the maxFreq scan over 26 letters is constant.",
        space: "O(1)",
        spaceWhy: "A fixed 26-element frequency array.",
        code: `int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int l = 0, maxFreq = 0, best = 0;
    for (int r = 0; r < s.length(); r++) {
        count[s.charAt(r) - 'A']++;
        maxFreq = Math.max(maxFreq, count[s.charAt(r) - 'A']);
        while ((r - l + 1) - maxFreq > k) {     // too many replacements needed
            count[s.charAt(l) - 'A']--;
            l++;
        }
        best = Math.max(best, r - l + 1);
    }
    return best;
}`,
        walkthrough: [
          's="AABABBA", k=1. Window grows; at "AABA" length 4, maxFreq(A)=3, replacements=4−3=1 ≤ 1 → valid, best=4.',
          'Extending to "AABAB" needs 5−3=2 > 1 → slide l until valid again; best stays 4.',
        ],
      },
    ],
    edgeCases: [
      "k = 0 → no replacements; the answer is the longest run of a single identical letter.",
      "k ≥ s.length − 1 → you can convert everything; the answer is the whole length.",
      "Single character → 1.",
    ],
    twists: [
      "**Longest substring with at most k distinct characters** (LeetCode 340) → window valid while distinct ≤ k.",
      "**Max consecutive ones III** (LeetCode 1004) → binary version: flip at most k zeros to ones.",
      "**Recompute maxFreq honestly on shrink** → correct but slower; the shortcut works because we only track the max width.",
    ],
    related: ["longest-substring-without-repeating", "permutation-in-string"],
  },

  {
    slug: "permutation-in-string",
    title: "Permutation in String",
    difficulty: "Medium",
    pattern: "sliding-window",
    leetcode: 567,
    statement:
      "Given two strings `s1` and `s2`, return `true` if `s2` contains a **permutation of `s1`** as a substring — i.e. some contiguous window of `s2` is an anagram of `s1`.",
    examples: [
      { in: 's1 = "ab", s2 = "eidbaooo"', out: "true", note: '"ba" is a permutation of "ab"' },
      { in: 's1 = "ab", s2 = "eidboaoo"', out: "false" },
    ],
    constraints: ["1 ≤ s1.length, s2.length ≤ 10⁴", "lowercase English letters"],
    recognize:
      "A permutation of `s1` is just a substring of `s2` with the **same letter counts** as `s1`. 'Fixed-length contiguous window matching a target multiset' is a **fixed-size sliding window** over a frequency count.",
    figureItOut: [
      "A permutation of `s1` has the exact same character counts as `s1`, in any order. So you're hunting for a window in `s2`, of length exactly `s1.length`, whose letter counts equal `s1`'s.",
      "Brute force: for every starting index in `s2`, take the next `s1.length` characters and check if their counts match `s1`'s — O(n · m) work plus a 26-compare each time.",
      "Slide instead of recomputing. Build the target count for `s1`. Maintain a window count for the current `s1.length`-wide slice of `s2`. As the window moves right by one, **add the entering character and remove the leaving character** — O(1) per step instead of recounting.",
      "After each move, you need to know if the two count arrays are equal. Re-comparing all 26 each step is fine (O(26)), but you can do better: keep a `matches` counter of how many of the 26 letters currently have equal counts, and update only the (at most two) letters that changed each slide.",
      "When `matches == 26`, the window is a permutation → return true. One linear pass.",
    ],
    approaches: [
      {
        name: "Fixed window, compare counts each step",
        intuition: "Slide a window of length s1.length, maintaining its counts, and compare to s1's counts.",
        time: "O(n · 26)",
        timeWhy: "n window positions, each comparing two 26-length count arrays.",
        space: "O(1)",
        spaceWhy: "Two fixed 26-element arrays.",
        code: `boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    int[] need = new int[26], window = new int[26];
    for (char c : s1.toCharArray()) need[c - 'a']++;
    for (int r = 0; r < s2.length(); r++) {
        window[s2.charAt(r) - 'a']++;
        if (r >= s1.length()) window[s2.charAt(r - s1.length()) - 'a']--;  // drop leaving char
        if (Arrays.equals(need, window)) return true;
    }
    return false;
}`,
        walkthrough: [
          's1="ab" need={a:1,b:1}. Window slides over "eidbaooo".',
          'At window "ba" (indices 3..4): window={a:1,b:1} equals need → true.',
        ],
      },
      {
        name: "Sliding window with a matches counter (optimal)",
        intuition: "Track how many of the 26 letters already match; update only the changed letters per slide.",
        time: "O(n)",
        timeWhy: "Each step does O(1) updates and checks matches==26 instead of an O(26) compare.",
        space: "O(1)",
        spaceWhy: "Two fixed 26-element arrays and a scalar counter.",
        code: `boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    int[] need = new int[26], window = new int[26];
    for (int i = 0; i < s1.length(); i++) {
        need[s1.charAt(i) - 'a']++;
        window[s2.charAt(i) - 'a']++;
    }
    int matches = 0;
    for (int i = 0; i < 26; i++) if (need[i] == window[i]) matches++;
    int l = 0;
    for (int r = s1.length(); r < s2.length(); r++) {
        if (matches == 26) return true;
        int in = s2.charAt(r) - 'a';
        window[in]++;
        if (window[in] == need[in]) matches++;
        else if (window[in] == need[in] + 1) matches--;
        int out = s2.charAt(l) - 'a';
        window[out]--;
        if (window[out] == need[out]) matches++;
        else if (window[out] == need[out] - 1) matches--;
        l++;
    }
    return matches == 26;
}`,
        walkthrough: [
          'Each slide touches one entering and one leaving letter; matches goes up when a letter hits its target, down when it leaves it.',
          'matches == 26 means every letter count agrees → a permutation window.',
        ],
      },
    ],
    edgeCases: [
      "s1 longer than s2 → impossible → false immediately.",
      "Equal-length strings → check the single full-length window.",
      "Repeated letters in s1 (e.g. \"aab\") → counts (not just presence) must match, which the frequency arrays handle.",
    ],
    twists: [
      "**Find all anagram start indices** (LeetCode 438) → same window, but collect every position where it matches instead of returning early.",
      "**Larger alphabet / Unicode** → replace the 26-arrays with hash maps.",
      "**Permutation with at most k mismatches** → relax the equality check to a tolerance.",
    ],
    related: ["valid-anagram", "minimum-window-substring"],
  },

  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    pattern: "sliding-window",
    leetcode: 76,
    statement:
      "Given strings `s` and `t`, return the **shortest substring of `s`** that contains **every character of `t`** (including duplicates). If no such window exists, return `\"\"`.",
    examples: [
      { in: 's = "ADOBECODEBANC", t = "ABC"', out: '"BANC"', note: "the smallest window covering A, B, C" },
      { in: 's = "a", t = "a"', out: '"a"' },
      { in: 's = "a", t = "aa"', out: '""', note: "only one a available" },
    ],
    constraints: ["1 ≤ s.length, t.length ≤ 10⁵", "the answer is unique if it exists"],
    recognize:
      "'**Shortest** contiguous window that **covers a required multiset**' is the variable-size **sliding window**: grow the right edge until the window is valid (covers t), then shrink the left edge to make it minimal, repeatedly.",
    figureItOut: [
      "You need a window that contains all of `t`'s characters with the right counts. The answer is contiguous, so it's a sliding window — but unlike fixed-size windows, this one grows and shrinks to find the *minimum* length.",
      "Record what you `need`: a count of each character in `t`, plus `required` = the number of distinct characters you must satisfy.",
      "Grow `r`, adding characters. Track `formed` = how many distinct required characters are currently met at their full count. When `formed == required`, the window is **valid** (it covers `t`).",
      "Once valid, **shrink from the left** as far as you can while staying valid — each contraction might give a shorter answer. Record the window whenever it's both valid and smaller than the best so far. Stop shrinking the moment removing the left character would break coverage, then resume growing `r`.",
      "Each character is added once and removed once, so despite the nested shrink loop it's O(n + m) overall. Track the best (start, length) and slice it out at the end.",
    ],
    approaches: [
      {
        name: "Grow-then-shrink sliding window (optimal)",
        intuition: "Expand the right edge until the window covers t, then contract the left edge to minimize it; repeat.",
        time: "O(n + m)",
        timeWhy: "n = |s|, m = |t|. Building need is O(m); each character of s enters and leaves the window at most once.",
        space: "O(k)",
        spaceWhy: "k distinct characters in t held in the count maps (O(1) for a fixed alphabet).",
        code: `String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
    int required = need.size();
    Map<Character, Integer> window = new HashMap<>();
    int formed = 0, l = 0;
    int bestLen = Integer.MAX_VALUE, bestStart = 0;
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        window.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
            formed++;
        }
        while (formed == required) {                 // window is valid → try to shrink
            if (r - l + 1 < bestLen) {
                bestLen = r - l + 1;
                bestStart = l;
            }
            char left = s.charAt(l);
            window.merge(left, -1, Integer::sum);
            if (need.containsKey(left) && window.get(left) < need.get(left)) {
                formed--;                            // shrinking broke coverage
            }
            l++;
        }
    }
    return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestStart, bestStart + bestLen);
}`,
        walkthrough: [
          's="ADOBECODEBANC", t="ABC". Grow to "ADOBEC" → covers A,B,C → valid; shrink left to "DOBEC"? loses A → stop; best="ADOBEC" (6).',
          'Keep going: later window "CODEBA" then shrink, eventually "BANC" (4) is found valid and smaller → answer "BANC".',
        ],
      },
    ],
    edgeCases: [
      "t longer than s, or a character of t absent from s → no valid window → return \"\".",
      "Duplicate characters in t (e.g. t=\"aa\") → counts matter; the window must hold two a's.",
      "The window must reach `formed == required` exactly — comparing counts (not just presence) handles duplicates correctly.",
    ],
    twists: [
      "**Minimum window subsequence** (LeetCode 727) → t must appear in order, not just as a multiset → different DP/two-pointer approach.",
      "**Smallest window containing all distinct chars of s itself** → set t to the distinct characters of s.",
      "**Fixed 26/128 array instead of maps** → faster for a known small alphabet.",
    ],
    related: ["permutation-in-string", "longest-substring-without-repeating"],
  },

  {
    slug: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    pattern: "sliding-window",
    leetcode: 239,
    statement:
      "Given an array `nums` and a window size `k`, the window slides from left to right one position at a time. Return an array of the **maximum** in each window position.",
    examples: [
      { in: "nums = [1,3,-1,-3,5,3,6,7], k = 3", out: "[3,3,5,5,6,7]", note: "max of each size-3 window" },
      { in: "nums = [1], k = 1", out: "[1]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ k ≤ nums.length"],
    recognize:
      "'**Max (or min) of every sliding window**' is the signature of a **monotonic deque**: a double-ended queue that keeps candidates in decreasing order so the front is always the current window's maximum.",
    figureItOut: [
      "Brute force: for each of the n−k+1 windows, scan all k elements for the max → O(n·k). Correct, but it re-scans hugely overlapping windows. The waste is recomputing the max from scratch.",
      "A max-heap helps (O(n log n)): push elements with indices, and pop from the top any whose index has fallen out of the window. Better, but we can hit O(n).",
      "Key idea: within the window, a smaller element that comes **before** a larger element can **never** be the max again — the larger one will dominate every window they share. So such smaller elements are useless and can be discarded.",
      "Keep a **deque of indices** whose values are in **decreasing** order. When a new element arrives: pop from the **back** every index whose value is ≤ the new value (they're now dominated), then push the new index. Pop from the **front** any index that has slid out of the window (index ≤ r − k).",
      "The **front** of the deque is always the index of the current window's maximum. Each index is pushed and popped at most once → O(n) total, O(k) space.",
    ],
    approaches: [
      {
        name: "Max-heap of (value, index)",
        intuition: "Keep a max-heap; lazily discard the top whenever its index has left the window.",
        time: "O(n log n)",
        timeWhy: "Each element is pushed once; the heap can hold up to n entries, each operation O(log n).",
        space: "O(n)",
        spaceWhy: "The heap may grow to n before stale entries are popped.",
        code: `int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n - k + 1];
    PriorityQueue<int[]> heap =
        new PriorityQueue<>((a, b) -> b[0] - a[0]);   // max-heap by value
    for (int r = 0; r < n; r++) {
        heap.offer(new int[]{nums[r], r});
        if (r >= k - 1) {
            while (heap.peek()[1] <= r - k) heap.poll();   // drop out-of-window maxes
            res[r - k + 1] = heap.peek()[0];
        }
    }
    return res;
}`,
        walkthrough: [
          "[1,3,-1,-3,5,3,6,7], k=3: at r=2 heap top is 3 (in window) → res[0]=3.",
          "When the max's index falls behind r−k, it's popped before being read.",
        ],
      },
      {
        name: "Monotonic deque of indices (optimal)",
        intuition: "Maintain indices with decreasing values; the front is always the window max.",
        time: "O(n)",
        timeWhy: "Each index is added and removed from the deque at most once.",
        space: "O(k)",
        spaceWhy: "The deque holds at most k indices (one window's worth of candidates).",
        code: `int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n - k + 1];
    Deque<Integer> dq = new ArrayDeque<>();   // indices, values decreasing front→back
    for (int r = 0; r < n; r++) {
        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[r]) {
            dq.pollLast();                    // pop dominated smaller values
        }
        dq.offerLast(r);
        if (dq.peekFirst() <= r - k) dq.pollFirst();   // drop the index that left the window
        if (r >= k - 1) res[r - k + 1] = nums[dq.peekFirst()];
    }
    return res;
}`,
        walkthrough: [
          "[1,3,-1,-3,5,3,6,7], k=3. r=0 dq=[0]; r=1 val3≥1 pop 0, dq=[1]; r=2 dq=[1,2] → front=1 → res[0]=nums[1]=3.",
          "r=3 dq=[1,2,3] front idx1 ≤ 3−3=0? no → res[1]=3; r=4 val5 pops all → dq=[4] → res[2]=5; continues to 5,6,7.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → every element is its own window max → the array is returned unchanged.",
      "k = nums.length → a single window; the answer is the global max.",
      "All elements equal → the deque holds one and the front is read each time.",
      "Front-eviction must compare **indices** (≤ r − k), not values.",
    ],
    twists: [
      "**Sliding window minimum** → flip the comparison: keep values increasing in the deque.",
      "**Sum of every window's max** → accumulate instead of recording each max.",
      "**Shortest subarray with sum ≥ K** (LeetCode 862) → a monotonic deque on prefix sums, same machinery.",
    ],
    related: ["longest-substring-without-repeating", "minimum-window-substring"],
  },
];
