// NeetCode 150 — wave 2b (heaps / priority queue, backtracking). Java.
export const WAVE2B = [
  // ───────────────────────────── HEAPS · PRIORITY QUEUE ─────────────────────────────
  {
    slug: "kth-largest-element-in-a-stream",
    title: "Kth Largest Element in a Stream",
    difficulty: "Easy",
    pattern: "heaps",
    leetcode: 703,
    statement:
      "Design a class that, given an integer `k` and an initial array, supports `add(val)` which inserts `val` and returns the **kth largest** element seen so far (the kth largest counting duplicates, not the kth distinct).",
    examples: [
      {
        in: "k = 3; init = [4,5,8,2]; add(3), add(5), add(10), add(9), add(4)",
        out: "4, 5, 5, 8, 8",
        note: "after each add, the 3rd largest among everything seen",
      },
    ],
    constraints: ["1 ≤ k ≤ 10⁴", "0 ≤ nums.length ≤ 10⁴", "−10⁴ ≤ each value ≤ 10⁴", "at most 10⁴ calls to add"],
    recognize:
      "You're repeatedly asked for the **kth largest** as data streams in. 'kth largest, maintained over time' is the signal for a **size-k min-heap**: the heap holds the k biggest values, and its smallest (the root) *is* the kth largest.",
    figureItOut: [
      "The naive idea: store everything, and on each `add` sort and read index k from the end. Sorting per call is O(n log n) — and you'd redo it every single time. Way too much repeated work.",
      "Reframe what you actually need: not the whole order, just **one** value — the kth largest. So you only ever need to keep track of the **top k** values; everything smaller than all of them is irrelevant to the answer.",
      "Now, among those top k, which one is the answer? The **smallest of the k largest** is exactly the kth largest. So you want a structure that holds k items and cheaply hands you (and removes) the smallest — that's a **min-heap**.",
      "The invariant: keep the heap at size k. On `add`, push the new value; if the heap now has more than k items, pop the smallest. The root is always the kth largest. Each operation is O(log k).",
      "Why a *min*-heap and not a max-heap? A max-heap gives the largest cheaply, but to find the *kth* largest you'd have to pop k−1 times. The min-heap turns 'kth from the top' into 'top of a heap that only keeps k things'.",
    ],
    approaches: [
      {
        name: "Sort on every add (baseline)",
        intuition: "Keep all values; sort and index from the end each call.",
        time: "O(n log n) per add",
        timeWhy: "Each add re-sorts up to n stored values.",
        space: "O(n)",
        spaceWhy: "You store every value ever added.",
        code: `class KthLargest {
    private List<Integer> all = new ArrayList<>();
    private int k;

    KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) all.add(x);
    }

    int add(int val) {
        all.add(val);
        Collections.sort(all, Collections.reverseOrder());
        return all.get(k - 1);
    }
}`,
      },
      {
        name: "Size-k min-heap (optimal)",
        intuition: "Keep only the k largest in a min-heap; its root is the kth largest.",
        time: "O(log k) per add, O(n log k) to build",
        timeWhy: "Each push/pop on a heap of size ≤ k is O(log k); building from the initial array does this n times.",
        space: "O(k)",
        spaceWhy: "The heap never holds more than k elements.",
        code: `class KthLargest {
    private PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap
    private int k;

    KthLargest(int k, int[] nums) {
        this.k = k;
        for (int x : nums) add(x);
    }

    int add(int val) {
        heap.offer(val);
        if (heap.size() > k) heap.poll();  // drop the smallest, keep the top k
        return heap.peek();                // root = smallest of the k largest = kth largest
    }
}`,
        walkthrough: [
          "k=3, init [4,5,8,2]. Push 4,5,8 → heap{4,5,8}. Push 2 → size 4 → pop 2 → {4,5,8}. peek=4.",
          "add(3): push 3 → size 4 → pop 3 → {4,5,8}. peek=4. add(5): push → {4,5,5,8} → pop 4 → {5,5,8}. peek=5.",
          "add(10): push → {5,5,8,10} → pop 5 → {5,8,10}. peek=5. add(9): pop 5 → {8,9,10}. peek=8. add(4): 4<root, pop it → {8,9,10}. peek=8.",
        ],
      },
    ],
    edgeCases: [
      "Initial array shorter than k → the heap fills up as adds arrive; the problem guarantees there are at least k elements by the time you read the answer.",
      "Duplicates count individually — [5,5] with k=2 has 5 as the 2nd largest. The heap stores duplicates fine.",
      "Negative values — a min-heap of Integer orders them correctly.",
    ],
    twists: [
      "**kth smallest in a stream** → flip to a size-k **max**-heap; its root is the kth smallest.",
      "**Median of a stream** → two heaps (a max-heap of the low half, min-heap of the high half) — see *Find Median from Data Stream*.",
      "**One-shot kth largest of a fixed array** (no streaming) → Quickselect in O(n) average — see *Kth Largest Element in an Array*.",
    ],
    related: ["kth-largest-element-in-an-array", "find-median-from-data-stream", "k-closest-points-to-origin"],
  },

  {
    slug: "last-stone-weight",
    title: "Last Stone Weight",
    difficulty: "Easy",
    pattern: "heaps",
    leetcode: 1046,
    statement:
      "Each turn, smash the **two heaviest** stones together. If they're equal both are destroyed; otherwise the lighter one is destroyed and the heavier becomes `heavy − light`. Return the weight of the last remaining stone, or `0` if none remain.",
    examples: [
      { in: "stones = [2,7,4,1,8,1]", out: "1", note: "smash 8,7→1; then 4,2→2,1; ... last stone is 1" },
      { in: "stones = [1]", out: "1" },
    ],
    constraints: ["1 ≤ stones.length ≤ 30", "1 ≤ stones[i] ≤ 1000"],
    recognize:
      "Every turn you need the **two largest** elements, then you push a new value back in and repeat. 'Repeatedly take the biggest (or two biggest), then insert' is the **max-heap** signal — a priority queue that always surfaces the current maximum.",
    figureItOut: [
      "What does each turn require? The two heaviest stones — right now, after previous smashes changed the multiset. So you need a structure that gives you the current max cheaply, **and** lets you insert the smash result back so it competes in future turns.",
      "A plain sorted array works but is wasteful: re-sorting after each smash is O(n log n) per turn. You don't need full order — just the top one or two repeatedly.",
      "That's exactly a **max-heap**: peek/pop the largest in O(log n), and offer a new value in O(log n). Each turn = pop twice (the two heaviest), and if they differ, push the difference back.",
      "The loop runs until 0 or 1 stones remain. Each smash removes at least one stone, so it terminates. At the end, return the lone stone or 0.",
      "Java's `PriorityQueue` is a *min*-heap by default. To get a max-heap, pass `Collections.reverseOrder()` — a one-line flip of the comparator.",
    ],
    approaches: [
      {
        name: "Max-heap (optimal)",
        intuition: "Pop the two largest each turn; push back their difference until ≤1 stone remains.",
        time: "O(n log n)",
        timeWhy: "Each smash does O(1) pops/pushes of O(log n) each; there are at most n−1 smashes.",
        space: "O(n)",
        spaceWhy: "The heap holds up to n stones.",
        code: `int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
    for (int s : stones) heap.offer(s);
    while (heap.size() > 1) {
        int a = heap.poll();   // heaviest
        int b = heap.poll();   // second heaviest
        if (a != b) heap.offer(a - b);  // survivor goes back in
    }
    return heap.isEmpty() ? 0 : heap.peek();
}`,
        walkthrough: [
          "[2,7,4,1,8,1] → heap top-down {8,7,4,2,1,1}. Pop 8,7 → push 1 → {4,2,1,1,1}.",
          "Pop 4,2 → push 2 → {2,1,1,1}. Pop 2,1 → push 1 → {1,1,1}. Pop 1,1 → equal, nothing pushed → {1}.",
          "Size 1 → return 1.",
        ],
      },
    ],
    edgeCases: [
      "Single stone → no smashes happen → return it directly.",
      "Two equal heaviest → both destroyed, push nothing; the heap can become empty → return 0.",
      "All stones equal and even count → everything cancels → 0.",
    ],
    twists: [
      "**Last Stone Weight II** (LeetCode 1049) → not a heap at all; it's a partition / subset-sum DP minimizing the leftover difference.",
      "**Smash the two *lightest* instead** → just use the default min-heap with no comparator.",
      "**Return the full sequence of smashes** → record each (a, b, a−b) as you pop.",
    ],
    related: ["kth-largest-element-in-an-array", "task-scheduler", "kth-largest-element-in-a-stream"],
  },

  {
    slug: "k-closest-points-to-origin",
    title: "K Closest Points to Origin",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 973,
    statement:
      "Given an array of `points` on the plane and an integer `k`, return the `k` points **closest to the origin** (0, 0), measured by Euclidean distance. The answer may be in any order.",
    examples: [
      { in: "points = [[1,3],[-2,2]], k = 1", out: "[[-2,2]]", note: "√8 < √10" },
      { in: "points = [[3,3],[5,-1],[-2,4]], k = 2", out: "[[3,3],[-2,4]]" },
    ],
    constraints: ["1 ≤ k ≤ points.length ≤ 10⁴", "−10⁴ ≤ xi, yi ≤ 10⁴"],
    recognize:
      "Classic **top-K**: 'the k closest / smallest / nearest' by some score. The size-k heap pattern — keep a heap of exactly k items, and evict whenever a better one arrives — gives O(n log k) without sorting everything.",
    figureItOut: [
      "First simplification: you never need the actual distance. √(x²+y²) is monotonic in x²+y², so compare **squared** distances — no floating-point, no `Math.sqrt`. Smaller x²+y² means closer.",
      "Baseline: compute each point's squared distance, sort all n by it, take the first k. That's O(n log n). Correct, and fine — but it sorts everything when you only want k.",
      "To beat it, keep only the k best seen so far. You want to cheaply find and evict the **worst** of those k when a closer point shows up. 'Evict the worst of the k smallest' → a **max-heap of size k** keyed by distance.",
      "Walk the points: push each into the heap; if it overflows past k, pop the farthest (the max). At the end the heap holds the k closest. This is O(n log k) — better than O(n log n) when k ≪ n.",
      "If you only need it once and want the theoretical best, **Quickselect** partitions the array around the kth-closest in O(n) average — but the heap is simpler and streams naturally.",
    ],
    approaches: [
      {
        name: "Sort by squared distance (baseline)",
        intuition: "Sort all points by x²+y², take the first k.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting all n points.",
        space: "O(log n) to O(n)",
        spaceWhy: "Sorting overhead, plus the k-size result.",
        code: `int[][] kClosest(int[][] points, int k) {
    Arrays.sort(points, (a, b) ->
        (a[0]*a[0] + a[1]*a[1]) - (b[0]*b[0] + b[1]*b[1]));
    return Arrays.copyOfRange(points, 0, k);
}`,
      },
      {
        name: "Size-k max-heap (optimal for k ≪ n)",
        intuition: "Keep the k closest in a max-heap keyed by distance; evict the farthest when it overflows.",
        time: "O(n log k)",
        timeWhy: "Each of n points does a push/pop on a heap of size ≤ k → O(log k) each.",
        space: "O(k)",
        spaceWhy: "The heap holds at most k points.",
        code: `int[][] kClosest(int[][] points, int k) {
    // max-heap: the farthest of the kept points sits on top, ready to be evicted
    PriorityQueue<int[]> heap = new PriorityQueue<>(
        (a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1]));
    for (int[] p : points) {
        heap.offer(p);
        if (heap.size() > k) heap.poll();  // remove the current farthest
    }
    int[][] res = new int[k][2];
    for (int i = 0; i < k; i++) res[i] = heap.poll();
    return res;
}`,
        walkthrough: [
          "points=[[3,3],[5,-1],[-2,4]], k=2. dists: 18, 26, 20.",
          "offer [3,3](18). offer [5,-1](26) → size 2. offer [-2,4](20) → size 3 → pop max (26 → [5,-1]) → heap{[3,3],[ -2,4]}.",
          "Drain → [[3,3],[-2,4]] (closest two).",
        ],
      },
    ],
    edgeCases: [
      "k equals points.length → return all of them (heap never overflows).",
      "Points at the same distance — ties may break either way; the problem allows any valid ordering.",
      "The origin itself (0,0) → distance 0, always among the closest.",
    ],
    twists: [
      "**One-shot, want O(n) average** → Quickselect partition around the kth squared distance, no heap.",
      "**Streaming points** → the size-k max-heap is the natural fit; sorting can't stream.",
      "**Closest to an arbitrary point (px, py)** → subtract before squaring: (x−px)²+(y−py)².",
    ],
    related: ["kth-largest-element-in-an-array", "kth-largest-element-in-a-stream", "task-scheduler"],
  },

  {
    slug: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 215,
    statement:
      "Given an integer array `nums` and an integer `k`, return the **kth largest** element (the kth largest by value, counting duplicates — *not* the kth distinct value).",
    examples: [
      { in: "nums = [3,2,1,5,6,4], k = 2", out: "5", note: "sorted desc: 6,5,... → 2nd is 5" },
      { in: "nums = [3,2,3,1,2,4,5,5,6], k = 4", out: "4" },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "−10⁴ ≤ nums[i] ≤ 10⁴"],
    recognize:
      "A single 'kth largest of a fixed array'. Two tools fit: a **size-k min-heap** (O(n log k), dead simple) or **Quickselect** (O(n) average, the textbook 'select without fully sorting'). Sorting works but does more than asked.",
    figureItOut: [
      "Sorting descending and reading index k−1 is O(n log n) and trivially correct. The question is whether you can avoid sorting the *whole* array when you only need one position.",
      "Heap angle: the kth largest is the smallest of the k biggest values. Keep a **min-heap of size k**; push each number and pop when it exceeds k. The root is the answer — O(n log k), and great when k is small.",
      "Quickselect angle: partitioning (Lomuto/Hoare) around a pivot puts the pivot at its **final sorted position** with everything larger on one side. If that position is exactly the index of the kth largest, you're done — without sorting either side.",
      "So translate 'kth largest' into a 0-based index: the kth largest sits at index `n − k` in ascending order. Partition, see where the pivot landed, and recurse into **only the side** that contains index `n − k`. On average each partition halves the work → O(n) total (n + n/2 + n/4 + …).",
      "Quickselect's catch: a bad pivot can give O(n²) worst case. Randomizing the pivot makes that astronomically unlikely — the standard fix.",
    ],
    approaches: [
      {
        name: "Size-k min-heap",
        intuition: "Keep the k largest in a min-heap; its root is the kth largest.",
        time: "O(n log k)",
        timeWhy: "Each of n elements does an O(log k) push/pop on a heap capped at k.",
        space: "O(k)",
        spaceWhy: "The heap holds at most k elements.",
        code: `int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap
    for (int x : nums) {
        heap.offer(x);
        if (heap.size() > k) heap.poll();  // keep only the k largest
    }
    return heap.peek();
}`,
        walkthrough: [
          "nums=[3,2,1,5,6,4], k=2. offer 3,2 → {2,3}. offer 1 → {1,2,3} → pop 1 → {2,3}.",
          "offer 5 → pop 2 → {3,5}. offer 6 → pop 3 → {5,6}. offer 4 → 4<root 5, pop it → {5,6}. peek=5.",
        ],
      },
      {
        name: "Quickselect (optimal average)",
        intuition: "Partition around a random pivot; recurse only into the side holding index n−k.",
        time: "O(n) average, O(n²) worst",
        timeWhy: "Each partition is O(size); recursing into one half gives n + n/2 + … = O(n). A pathological pivot sequence degrades to O(n²) — randomization avoids it.",
        space: "O(1)",
        spaceWhy: "In-place partitioning; iterative, so no recursion stack.",
        code: `int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;   // kth largest = index target in ascending order
    int lo = 0, hi = nums.length - 1;
    Random rng = new Random();
    while (lo < hi) {
        int p = partition(nums, lo, hi, lo + rng.nextInt(hi - lo + 1));
        if (p == target) break;
        else if (p < target) lo = p + 1;  // answer is to the right
        else hi = p - 1;                  // answer is to the left
    }
    return nums[target];
}

private int partition(int[] a, int lo, int hi, int pivotIdx) {
    int pivot = a[pivotIdx];
    swap(a, pivotIdx, hi);              // park pivot at the end
    int store = lo;
    for (int i = lo; i < hi; i++) {
        if (a[i] < pivot) swap(a, store++, i);
    }
    swap(a, store, hi);                // pivot to its final spot
    return store;
}

private void swap(int[] a, int i, int j) {
    int t = a[i]; a[i] = a[j]; a[j] = t;
}`,
        walkthrough: [
          "nums=[3,2,1,5,6,4], k=2 → target index = 6−2 = 4 (the value that ends up 5th smallest = 2nd largest).",
          "Partition lands pivots until one settles at index 4. The value there is 5 → return 5.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → the maximum; k = n → the minimum.",
      "Duplicates count individually — [2,2,2], k=2 → 2.",
      "Single element with k=1 → that element.",
    ],
    twists: [
      "**Streaming version** (values arrive over time) → the size-k min-heap, kept across adds — see *Kth Largest Element in a Stream*.",
      "**kth *smallest*** → mirror it: min-heap of size k flips to a max-heap, or Quickselect target = k−1.",
      "**Top k frequent elements** → bucket by frequency or a heap keyed by count — see *Top K Frequent Elements*.",
    ],
    related: ["kth-largest-element-in-a-stream", "k-closest-points-to-origin", "top-k-frequent-elements"],
  },

  {
    slug: "task-scheduler",
    title: "Task Scheduler",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 621,
    statement:
      "Given `tasks` (uppercase letters) and an integer `n`, each task takes one unit of time and the **same** task must be separated by at least `n` units of cooldown. The CPU may idle. Return the **minimum total time** to finish all tasks.",
    examples: [
      { in: 'tasks = ["A","A","A","B","B","B"], n = 2', out: "8", note: "A B idle A B idle A B" },
      { in: 'tasks = ["A","A","A","B","B","B"], n = 0', out: "6", note: "no cooldown → just run them" },
      { in: 'tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2', out: "16" },
    ],
    constraints: ["1 ≤ tasks.length ≤ 10⁴", "0 ≤ n ≤ 100", "tasks are uppercase English letters"],
    recognize:
      "At each time slot you want to run the task with the **most remaining copies** (to spread the bottleneck out). 'Always pick the currently-most-frequent available item' is a **max-heap** greedy — with a cooldown queue to delay tasks that are resting.",
    figureItOut: [
      "The bottleneck is the **most frequent** task: it forces gaps. If 'A' appears most, you must space the A's out by n, and you fill the gaps with other tasks (or idle). So intuitively you always want to schedule the task with the highest remaining count next.",
      "Greedy with a max-heap: each tick, pop the available task with the largest remaining count, run one copy. After running it, it must rest for n ticks — so it can't go straight back into the heap; park it in a **cooldown queue** with the time it becomes available again.",
      "Each tick, before picking, release any cooled-down tasks back into the heap. If the heap is empty but tasks are still cooling, the CPU **idles** — but time still advances. Count every tick (work or idle) until everything's done.",
      "There's also a clean **math** shortcut. Let `maxFreq` be the highest count and `maxCount` how many tasks share it. The most-frequent task creates `maxFreq − 1` gaps of size `n+1`, plus a final row for the maxCount top tasks: `(maxFreq − 1) * (n + 1) + maxCount`. The answer is `max(tasks.length, that)` — because if there are enough distinct tasks you never idle, so the floor is just the task count.",
      "Why `max(...)`? The formula assumes idling is needed to honor cooldown. If you have so many different tasks that the gaps fill themselves, no idling happens and the time is simply the number of tasks. The larger of the two is correct.",
    ],
    approaches: [
      {
        name: "Max-heap + cooldown queue (simulation)",
        intuition: "Each tick run the most-frequent available task; send it to a cooldown queue for n ticks.",
        time: "O(T) where T is total time (≈ tasks.length, or larger with idles)",
        timeWhy: "Each tick does O(log 26) heap work — constant since there are ≤ 26 letters; total ticks bound the loop.",
        space: "O(1)",
        spaceWhy: "Heap and queue hold at most 26 distinct task types.",
        code: `int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int f : freq) if (f > 0) heap.offer(f);

    int time = 0;
    Queue<int[]> cooldown = new LinkedList<>();  // {remainingCount, readyTime}
    while (!heap.isEmpty() || !cooldown.isEmpty()) {
        time++;
        if (!heap.isEmpty()) {
            int remaining = heap.poll() - 1;     // run one copy
            if (remaining > 0) cooldown.offer(new int[]{remaining, time + n});
        }
        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {
            heap.offer(cooldown.poll()[0]);       // cooled down → available again
        }
    }
    return time;
}`,
        walkthrough: [
          'tasks=[A,A,A,B,B,B], n=2. freq A=3,B=3 → heap{3,3}.',
          "t1 run A(→2, ready t3); t2 run B(→2, ready t4); t3 idle? heap empty → but A ready t3 re-enters, run A(→1, ready t5)...",
          "Simulation yields A B _ A B _ A B → 8 ticks.",
        ],
      },
      {
        name: "Math formula (optimal, no simulation)",
        intuition: "The most-frequent task fixes the skeleton; fill or pad with idles.",
        time: "O(T)",
        timeWhy: "One pass to count frequencies; the rest is arithmetic.",
        space: "O(1)",
        spaceWhy: "A fixed 26-slot frequency array.",
        code: `int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;
    int maxFreq = 0;
    for (int f : freq) maxFreq = Math.max(maxFreq, f);
    int maxCount = 0;  // how many tasks hit that max frequency
    for (int f : freq) if (f == maxFreq) maxCount++;

    int slots = (maxFreq - 1) * (n + 1) + maxCount;
    return Math.max(tasks.length, slots);
}`,
        walkthrough: [
          "Example 3: A appears 6×, all others once. maxFreq=6, maxCount=1, n=2.",
          "slots = (6−1)*(2+1) + 1 = 5*3 + 1 = 16. tasks.length=12. max(12,16)=16.",
        ],
      },
    ],
    edgeCases: [
      "n = 0 → no cooldown → answer is exactly tasks.length.",
      "All tasks distinct → never idle → answer is tasks.length.",
      "One task type dominating heavily → lots of idle slots; the formula's `slots` term wins.",
    ],
    twists: [
      "**Return the actual schedule** (not just the length) → you need the simulation, recording which task ran each tick.",
      "**Different cooldowns per task** → the formula breaks; fall back to the heap + cooldown-queue simulation.",
      "**CPU never idles (must run *something*)** → a different model; tasks get reordered rather than padded with idle.",
    ],
    related: ["last-stone-weight", "design-twitter", "top-k-frequent-elements"],
  },

  {
    slug: "design-twitter",
    title: "Design Twitter",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 355,
    statement:
      "Design a simplified Twitter: `postTweet(userId, tweetId)`, `getNewsFeed(userId)` returning the **10 most recent** tweet ids from the user and everyone they follow, `follow(followerId, followeeId)`, and `unfollow(followerId, followeeId)`.",
    examples: [
      {
        in: "postTweet(1,5); getNewsFeed(1); follow(1,2); postTweet(2,6); getNewsFeed(1); unfollow(1,2); getNewsFeed(1)",
        out: "[5]; ...; [6,5]; ...; [5]",
        note: "feed = own + followees' tweets, newest first",
      },
    ],
    constraints: ["1 ≤ userId, tweetId ≤ 10⁴", "at most 3·10⁴ calls total", "all tweetIds distinct"],
    recognize:
      "`getNewsFeed` is **merge K sorted lists, take the top 10** — each followee's tweets are newest-first, and you want the globally newest 10. 'Newest across many sorted streams' is a **heap** merge (k-way merge bounded to 10).",
    figureItOut: [
      "Model the data first. Each user has a list of tweets in posting order, and a set of people they follow. A global, ever-increasing **timestamp** on each tweet lets you compare recency across users — newest = largest timestamp.",
      "`getNewsFeed` wants the 10 most recent tweets from the user plus all followees. Each person's own tweet list is already newest-last, so reading it backward gives a **sorted-by-recency stream**. You're merging several such streams and want the top 10.",
      "That's the **merge-K-sorted-lists** shape. Use a **max-heap** keyed by timestamp: seed it with the newest tweet from each relevant user, then repeatedly pop the newest and push that user's *next* older tweet. Stop after 10 pops.",
      "Why a heap rather than concatenate-and-sort? You only need 10 items, and a user may have thousands of tweets — the heap touches at most (followees + 10) tweets instead of all of them.",
      "follow/unfollow just edit a `Set` of followee ids per user. A small but real detail: a user should always see their **own** tweets, so include themselves in the feed sources (and guard against unfollowing yourself).",
    ],
    approaches: [
      {
        name: "Hash maps + max-heap merge (optimal)",
        intuition: "Store per-user tweet lists with global timestamps; merge the newest streams with a max-heap, take 10.",
        time: "O(F + 10 log F) per feed",
        timeWhy: "Seed the heap with F = number of followees (+self); each of the 10 pops does O(log F) work and pushes one successor. postTweet/follow/unfollow are O(1).",
        space: "O(U + T)",
        spaceWhy: "U users' follow sets plus T total tweets stored.",
        code: `class Twitter {
    private int clock = 0;
    private Map<Integer, List<int[]>> tweets = new HashMap<>();   // user -> list of {time, tweetId}
    private Map<Integer, Set<Integer>> following = new HashMap<>(); // user -> followees

    void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>())
              .add(new int[]{clock++, tweetId});
    }

    List<Integer> getNewsFeed(int userId) {
        // max-heap by timestamp; entries are {time, tweetId, userId, index-in-that-user's-list}
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);

        Set<Integer> sources = new HashSet<>(following.getOrDefault(userId, Set.of()));
        sources.add(userId);  // you always see your own tweets

        for (int u : sources) {
            List<int[]> list = tweets.get(u);
            if (list != null && !list.isEmpty()) {
                int last = list.size() - 1;
                heap.offer(new int[]{list.get(last)[0], list.get(last)[1], u, last});
            }
        }

        List<Integer> feed = new ArrayList<>();
        while (!heap.isEmpty() && feed.size() < 10) {
            int[] cur = heap.poll();
            feed.add(cur[1]);
            int u = cur[2], idx = cur[3];
            if (idx > 0) {  // push this user's next-older tweet
                int[] older = tweets.get(u).get(idx - 1);
                heap.offer(new int[]{older[0], older[1], u, idx - 1});
            }
        }
        return feed;
    }

    void follow(int followerId, int followeeId) {
        following.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    void unfollow(int followerId, int followeeId) {
        if (followerId != followeeId)
            following.getOrDefault(followerId, new HashSet<>()).remove(followeeId);
    }
}`,
        walkthrough: [
          "postTweet(1,5) → user1: [{t0,5}]. getNewsFeed(1) → heap seeds {t0,5} → [5].",
          "follow(1,2); postTweet(2,6) → user2: [{t1,6}]. getNewsFeed(1): sources {1,2}; heap{t1→6, t0→5}; pop 6 then 5 → [6,5].",
          "unfollow(1,2); getNewsFeed(1): sources {1}; → [5].",
        ],
      },
    ],
    edgeCases: [
      "A user with no tweets and no followees → empty feed.",
      "Fewer than 10 total tweets → return however many exist.",
      "Following yourself (or unfollowing yourself) — you already see your own tweets; guard the unfollow so you don't drop them.",
    ],
    twists: [
      "**Feed paginated beyond 10** → don't stop at 10; pop more, or keep a cursor.",
      "**Most *liked* instead of most recent** → key the heap by like-count, not timestamp.",
      "**Millions of followees** → precompute/fan-out feeds on write instead of merging on read (real-world architecture).",
    ],
    related: ["task-scheduler", "kth-largest-element-in-a-stream", "find-median-from-data-stream"],
  },

  {
    slug: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 295,
    statement:
      "Design a structure supporting `addNum(num)` to ingest numbers from a stream and `findMedian()` to return the **median** of all numbers so far (the average of the two middle values when the count is even).",
    examples: [
      {
        in: "addNum(1); addNum(2); findMedian(); addNum(3); findMedian()",
        out: "1.5; 2.0",
        note: "median of {1,2} is 1.5; of {1,2,3} is 2",
      },
    ],
    constraints: ["−10⁵ ≤ num ≤ 10⁵", "at most 5·10⁴ calls", "there is at least one element before findMedian"],
    recognize:
      "The median is about the **middle** of a sorted order, maintained as data streams in. Re-sorting per query is too slow. The trick: you don't need the whole order, only the **boundary** between the lower and upper halves — two heaps guarding that boundary.",
    figureItOut: [
      "What is a median, mechanically? Split the sorted values into a **lower half** and an **upper half**. The median is the largest of the lower half, the smallest of the upper half, or the average of those two. So the only values you ever read are the **two right at the boundary**.",
      "That's the insight: you don't need full sorted order — you need cheap access to the **max of the lower half** and the **min of the upper half**. 'Max of a group' → a **max-heap**. 'Min of a group' → a **min-heap**. So keep two heaps, one for each half.",
      "Let `low` be a max-heap holding the smaller half (its root = the lower-middle value) and `high` be a min-heap holding the larger half (its root = the upper-middle value). Maintain two invariants: every element in `low` ≤ every element in `high`, and their sizes differ by at most 1.",
      "On `addNum`: push into `low`, then move `low`'s max over to `high` (this enforces the ordering — the new number bubbles to the right side). Then rebalance sizes: if `high` got bigger than `low`, move `high`'s min back. This keeps `low` either equal to or exactly one larger than `high`.",
      "On `findMedian`: if sizes are equal, the median straddles the boundary → average the two roots. If `low` has one extra (odd total), its root **is** the median. Both heaps are O(log n) to update and O(1) to read — far better than re-sorting.",
    ],
    approaches: [
      {
        name: "Re-sort or insert-in-order (baseline)",
        intuition: "Keep a sorted list; insert each number in place, read the middle.",
        time: "O(n) per add, O(1) per median",
        timeWhy: "Inserting into a sorted array shifts up to n elements each time.",
        space: "O(n)",
        spaceWhy: "Stores every number.",
        code: `class MedianFinder {
    private List<Integer> sorted = new ArrayList<>();

    void addNum(int num) {
        int pos = Collections.binarySearch(sorted, num);
        if (pos < 0) pos = -(pos + 1);   // insertion point
        sorted.add(pos, num);            // O(n) shift
    }

    double findMedian() {
        int n = sorted.size(), mid = n / 2;
        if (n % 2 == 1) return sorted.get(mid);
        return (sorted.get(mid - 1) + sorted.get(mid)) / 2.0;
    }
}`,
      },
      {
        name: "Two heaps (optimal)",
        intuition: "Max-heap for the lower half, min-heap for the upper; the median sits at their boundary.",
        time: "O(log n) per add, O(1) per median",
        timeWhy: "addNum does a constant number of heap pushes/pops, each O(log n); findMedian just reads the two roots.",
        space: "O(n)",
        spaceWhy: "Every number lives in one of the two heaps.",
        code: `class MedianFinder {
    private PriorityQueue<Integer> low =                       // max-heap: smaller half
        new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> high = new PriorityQueue<>(); // min-heap: larger half

    void addNum(int num) {
        low.offer(num);            // tentatively place in the lower half
        high.offer(low.poll());    // push its max to the upper half (keeps low ≤ high)
        if (high.size() > low.size())
            low.offer(high.poll()); // rebalance so low is never smaller than high
    }

    double findMedian() {
        if (low.size() > high.size()) return low.peek();        // odd total
        return (low.peek() + high.peek()) / 2.0;                // even total → average the boundary
    }
}`,
        walkthrough: [
          "add 1: low{1}→move→high{1}, high bigger→move back→low{1}. add 2: low{1,2}→pop max 2 to high{2}; sizes 1,1.",
          "findMedian: equal sizes → (low.peek 1 + high.peek 2)/2 = 1.5.",
          "add 3: low{1,3}→pop 3 to high{2,3}; high bigger→move 2 back→low{1,2},high{3}. findMedian: low bigger → 2.0.",
        ],
      },
    ],
    edgeCases: [
      "Single element → both heaps logic returns it (low holds it, sizes 1 vs 0 → low.peek).",
      "Even count → must average the two middles; integer division is the classic bug — use `/ 2.0`.",
      "Sum of two large ints when averaging can overflow in some languages; in Java promote to double first if values are near the limit.",
    ],
    twists: [
      "**Sliding-window median** (LeetCode 480) → two heaps plus lazy deletion (or two TreeMaps) to evict the element leaving the window.",
      "**All numbers in a small range** (e.g. 0–100, ages) → a counting array / order-statistics on counts beats heaps.",
      "**Streaming kth percentile** instead of the 50th → keep the boundary at the k% split rather than the middle.",
    ],
    related: ["kth-largest-element-in-a-stream", "design-twitter", "kth-largest-element-in-an-array"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 78,
    statement:
      "Given an array `nums` of **distinct** integers, return **all possible subsets** (the power set). The solution set must not contain duplicate subsets; any order is fine.",
    examples: [
      { in: "nums = [1,2,3]", out: "[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]" },
      { in: "nums = [0]", out: "[[],[0]]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10", "−10 ≤ nums[i] ≤ 10", "all elements distinct"],
    recognize:
      "'Generate **all subsets / combinations / arrangements**' is the backtracking flag. Each element is an independent **include-or-exclude** decision, and you want every leaf of that decision tree — the canonical choose / explore / un-choose template.",
    figureItOut: [
      "There are 2ⁿ subsets — for each element you independently decide **in or out**. So the whole solution space is a binary decision tree of depth n: at index i you branch on 'include nums[i]?' vs 'skip it?'. You want to collect what's at every node (every subset along the way).",
      "This is the **backtracking template** in its purest form. Carry a running `path` (the subset built so far) and a `start` index marking which elements are still on the table. At each call, the current `path` is itself a valid subset, so record it.",
      "Then iterate the remaining elements from `start`: **choose** one (add to path), **explore** by recursing with the next start index, then **un-choose** (remove it) to free that slot for the next sibling choice. That add → recurse → remove rhythm is the heartbeat of all backtracking.",
      "Why does `start` (rather than a 'used' set) avoid duplicates? Because you only ever extend a subset with elements *after* the last one you took. That fixes a single canonical order, so {1,2} is generated but {2,1} never is — combinations, not permutations.",
      "Crucial detail: when you record a subset, store a **copy** (`new ArrayList<>(path)`), not the live `path`. The same `path` object keeps mutating as you explore and backtrack — saving a reference would leave you with N identical (and wrong) lists at the end.",
    ],
    approaches: [
      {
        name: "Backtracking (choose / explore / un-choose)",
        intuition: "DFS the include/exclude tree; every node's path is a subset.",
        time: "O(n · 2ⁿ)",
        timeWhy: "There are 2ⁿ subsets, and copying each into the result costs up to O(n).",
        space: "O(n)",
        spaceWhy: "Recursion depth and the path are both ≤ n (output not counted).",
        code: `List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));            // every path is a valid subset — copy it
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                     // choose
        backtrack(nums, i + 1, path, res);     // explore (only elements after i)
        path.remove(path.size() - 1);          // un-choose
    }
}`,
        walkthrough: [
          "nums=[1,2,3]. Record []. i=0 add 1 → record [1]; i=1 add 2 → [1,2]; i=2 add 3 → [1,2,3]; backtrack.",
          "Back to [1], i=2 add 3 → [1,3]. Back to []. i=1 add 2 → [2]; add 3 → [2,3]. i=2 add 3 → [3].",
          "Result: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3].",
        ],
      },
      {
        name: "Iterative / bitmask (alternative)",
        intuition: "Each subset maps to an n-bit mask; bit j set means include nums[j].",
        time: "O(n · 2ⁿ)",
        timeWhy: "2ⁿ masks, each scanned over n bits.",
        space: "O(1)",
        spaceWhy: "Beyond the output, only loop counters.",
        code: `List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> res = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> sub = new ArrayList<>();
        for (int j = 0; j < n; j++) {
            if ((mask & (1 << j)) != 0) sub.add(nums[j]);
        }
        res.add(sub);
    }
    return res;
}`,
      },
    ],
    edgeCases: [
      "Single element → [[], [x]].",
      "The empty subset [] is always part of the answer — record before the loop, not inside it.",
      "n up to 10 → 1024 subsets, well within limits; backtracking won't blow up.",
    ],
    twists: [
      "**Array has duplicates (Subsets II, LeetCode 90)** → sort first, then skip `nums[i] == nums[i-1]` within the same loop level to avoid duplicate subsets.",
      "**Fixed-size k subsets (Combinations, LeetCode 77)** → only record when `path.size() == k`, and prune branches that can't reach k.",
      "**Subsets summing to a target** → add a running sum and prune once it exceeds the target.",
    ],
    related: ["combination-sum", "permutations", "subsets"],
  },

  {
    slug: "combination-sum",
    title: "Combination Sum",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 39,
    statement:
      "Given an array of **distinct** integers `candidates` and a `target`, return all **unique combinations** that sum to `target`. Each number may be used **unlimited** times. Combinations differing only in order count as the same.",
    examples: [
      { in: "candidates = [2,3,6,7], target = 7", out: "[[2,2,3],[7]]" },
      { in: "candidates = [2,3,5], target = 8", out: "[[2,2,2,2],[2,3,3],[3,5]]" },
      { in: "candidates = [2], target = 1", out: "[]", note: "can't reach 1" },
    ],
    constraints: ["1 ≤ candidates.length ≤ 30", "2 ≤ candidates[i] ≤ 40", "1 ≤ target ≤ 40", "all candidates distinct"],
    recognize:
      "'Find all combinations that reach a target' is backtracking with a **running total**. The twist (unlimited reuse) just changes one line — you recurse on the **same** index instead of the next one. The choose / explore / un-choose skeleton is unchanged.",
    figureItOut: [
      "Start from the template: build a `path` of chosen numbers, tracking a `remaining` budget (`target` minus what you've taken). A path is a solution exactly when `remaining == 0`; it's a dead end when `remaining < 0`. Those are your base cases.",
      "Two pruning checks turn the infinite tree finite: stop a branch the moment `remaining < 0` (overshot), and record it when `remaining == 0` (exact hit). Without them this never terminates, since numbers can repeat.",
      "Now the reuse twist. Normally backtracking advances to index `i + 1` to avoid reusing an element. Here a number can be used unlimited times, so after choosing `candidates[i]` you recurse with start still at **`i`** — the same number stays available — but never go *backward* to earlier indices.",
      "That 'never go backward' (start = i, not 0) is what kills duplicates. It pins each combination to **non-decreasing index order**, so [2,2,3] is generated once and [2,3,2] / [3,2,2] never are. Order-as-canonical-form is the standard backtracking de-dup trick.",
      "Then it's just choose / explore / un-choose: add `candidates[i]`, recurse with the smaller remaining and start `i`, then remove it to try the next candidate. Sorting candidates first lets you `break` early once `candidates[i] > remaining`, pruning whole subtrees.",
    ],
    approaches: [
      {
        name: "Backtracking with reuse + remaining budget (optimal)",
        intuition: "DFS choosing candidates ≥ the current index; subtract from the budget; record on exact hit.",
        time: "O(2^target) worst case",
        timeWhy: "The recursion tree's size depends on target relative to the smallest candidate; with small candidates it can branch deeply. Sorting + the `> remaining` break prunes heavily in practice.",
        space: "O(target / min)",
        spaceWhy: "Recursion depth is bounded by how many of the smallest candidate fit in target.",
        code: `List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);   // enables the early break
    List<List<Integer>> res = new ArrayList<>();
    backtrack(candidates, 0, target, new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] cand, int start, int remaining,
                       List<Integer> path, List<List<Integer>> res) {
    if (remaining == 0) {
        res.add(new ArrayList<>(path));   // exact hit — copy the path
        return;
    }
    for (int i = start; i < cand.length; i++) {
        if (cand[i] > remaining) break;   // sorted → every later one also overshoots
        path.add(cand[i]);                // choose
        backtrack(cand, i, remaining - cand[i], path, res);  // explore — i, not i+1 (reuse allowed)
        path.remove(path.size() - 1);     // un-choose
    }
}`,
        walkthrough: [
          "candidates=[2,3,6,7], target=7. Choose 2 (rem 5) → 2 (rem 3) → 2 (rem 1) → 2 overshoots, 3 overshoots → dead; back, take 3 (rem 0) → record [2,2,3].",
          "Back up: from [2] take 3 → rem 2 → 3 overshoots... dead. From [] take 3 → ... no exact. Take 7 (rem 0) → record [7].",
          "Result: [[2,2,3],[7]].",
        ],
      },
    ],
    edgeCases: [
      "Target smaller than every candidate → no combination → empty result.",
      "A candidate equal to target → it forms a length-1 combination on its own.",
      "Without the non-decreasing index rule you'd emit [2,2,3], [2,3,2], [3,2,2] as 'different' — wrong.",
    ],
    twists: [
      "**Each number used at most once (Combination Sum II, LeetCode 40)** → recurse on `i+1`, and skip `cand[i]==cand[i-1]` at the same level to dedupe (input may have duplicates).",
      "**Fixed count k, digits 1–9 (Combination Sum III, LeetCode 216)** → bound the depth to k and the values to 1–9.",
      "**Just count the number of ways (not list them)** → that's 1-D DP (coin change), not backtracking.",
    ],
    related: ["subsets", "permutations", "combination-sum"],
  },

  {
    slug: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 46,
    statement:
      "Given an array `nums` of **distinct** integers, return **all possible permutations** (every ordering). Any order of the result is fine.",
    examples: [
      { in: "nums = [1,2,3]", out: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
      { in: "nums = [0,1]", out: "[[0,1],[1,0]]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 6", "−10 ≤ nums[i] ≤ 10", "all distinct"],
    recognize:
      "'All **orderings / arrangements**' is backtracking where **order matters** — unlike subsets/combinations, [1,2] and [2,1] are different answers. The key difference: you don't use a `start` index; at each position any **unused** element is fair game.",
    figureItOut: [
      "A permutation uses **every** element exactly once, and order matters. So the decision tree has depth n: at each level you pick which unused element goes in the next slot. A full path of length n (all elements placed) is one permutation.",
      "Contrast with subsets/combinations: there you used a `start` index so you only moved *forward*, deliberately avoiding reorderings. Here reorderings are exactly what you want — so drop `start`. At every step, **any element not already in the path** is a valid next choice.",
      "How do you know which elements are still available? Track usage. A `boolean[] used` (or removing from a working list) marks who's placed. At each call, loop over all elements and skip the ones already used.",
      "Same choose / explore / un-choose rhythm: pick an unused element (mark used, push to path), recurse to fill the next slot, then **un-mark and pop** to restore state for the next sibling. Forgetting to un-mark is the classic bug — it leaks state across branches.",
      "Base case: when `path.size() == nums.length`, every slot is filled — record a copy and return. There's no pruning here (every full arrangement is valid), so the tree has exactly n! leaves.",
    ],
    approaches: [
      {
        name: "Backtracking with a used[] array (optimal)",
        intuition: "Fill slots left to right; at each slot try every element not yet used.",
        time: "O(n · n!)",
        timeWhy: "There are n! permutations and copying each finished one costs O(n).",
        space: "O(n)",
        spaceWhy: "Recursion depth, the path, and the used[] array are all O(n) (output excluded).",
        code: `List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
    return res;
}

private void backtrack(int[] nums, boolean[] used,
                       List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));   // a full arrangement — copy it
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;            // skip elements already placed
        used[i] = true; path.add(nums[i]);          // choose
        backtrack(nums, used, path, res);           // explore
        used[i] = false; path.remove(path.size() - 1); // un-choose
    }
}`,
        walkthrough: [
          "nums=[1,2,3]. Place 1 → place 2 → place 3 → [1,2,3]. Backtrack, place 3 then 2 → [1,3,2].",
          "Back to root: place 2 → [2,1,3],[2,3,1]. Place 3 → [3,1,2],[3,2,1].",
          "All 3! = 6 permutations produced.",
        ],
      },
    ],
    edgeCases: [
      "Single element → [[x]].",
      "n=6 → 720 permutations, fine; n grows factorially, so this only works for small n.",
      "Forgetting to reset `used[i] = false` on backtrack corrupts later branches — the most common mistake.",
    ],
    twists: [
      "**Input has duplicates (Permutations II, LeetCode 47)** → sort, then skip `nums[i]==nums[i-1]` when the previous equal one is unused, to avoid duplicate permutations.",
      "**Permutations of length k (partial)** → stop recording at `path.size() == k`.",
      "**Next permutation in place (LeetCode 31)** → not backtracking at all; an O(n) array-rearrangement trick.",
    ],
    related: ["subsets", "combination-sum", "permutations"],
  },

  {
    slug: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 79,
    statement:
      "Given an `m × n` grid of characters and a `word`, return `true` if the word can be spelled by a path of **adjacent** cells (up/down/left/right). Each cell may be used **at most once** per path.",
    examples: [
      {
        in: 'board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = "ABCCED"',
        out: "true",
        note: "A→B→C→C→E→D snakes through adjacent cells",
      },
      { in: 'word = "ABCB"', out: "false", note: "B can't be reused" },
    ],
    constraints: ["1 ≤ m, n ≤ 6 (typical)", "1 ≤ word.length ≤ 15", "board and word are uppercase/lowercase letters"],
    recognize:
      "Backtracking **on a grid**: explore a path cell by cell, and **un-visit** when a branch fails. The tell is 'a path through adjacent cells, no cell reused' — DFS that marks cells on the way in and unmarks on the way out.",
    figureItOut: [
      "The word is spelled along a path, so this is a search over paths: from some starting cell that matches `word[0]`, walk to an adjacent cell matching `word[1]`, and so on. That's DFS — but with a twist: a wrong path must be **undone** so its cells are free for other paths. That undo is what makes it backtracking, not plain DFS.",
      "Frame the recursion by index: `dfs(r, c, k)` asks 'can I match `word[k]` onward starting at cell (r,c)?'. It fails immediately if (r,c) is off-grid or `board[r][c] != word[k]`. It **succeeds** when `k` reaches the last character — the whole word matched.",
      "The 'each cell at most once' rule needs a visited mark. The neat in-place trick: temporarily overwrite `board[r][c]` with a sentinel (like `#`) before recursing — a used cell can't match anything — then **restore the original character** when you backtrack. That restore is the un-choose step; skip it and you corrupt the board for sibling paths.",
      "From a cell, **explore** all four neighbours for `word[k+1]`. If any returns true, propagate true (short-circuit — stop early). If none works, restore the cell and return false so the caller tries a different direction.",
      "The outer driver tries **every** cell as a possible start, since the word could begin anywhere. Worst case that's O(m·n·4^L) — at each of L steps up to 4 directions branch — but matching prunes most branches almost immediately.",
    ],
    approaches: [
      {
        name: "DFS backtracking with in-place marking (optimal)",
        intuition: "From every starting cell, DFS matching the word; mark cells visited and restore on backtrack.",
        time: "O(m · n · 4^L)",
        timeWhy: "Each of m·n start cells launches a DFS that branches into ≤ 4 directions for L = word.length steps. Character mismatches prune the vast majority.",
        space: "O(L)",
        spaceWhy: "Recursion depth equals the word length; marking is in place (no separate visited grid).",
        code: `boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (dfs(board, word, r, c, 0)) return true;
    return false;
}

private boolean dfs(char[][] board, String word, int r, int c, int k) {
    if (k == word.length()) return true;              // matched everything
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length
        || board[r][c] != word.charAt(k)) return false;

    char saved = board[r][c];
    board[r][c] = '#';                                // mark visited (choose)
    boolean found = dfs(board, word, r + 1, c, k + 1)
                 || dfs(board, word, r - 1, c, k + 1)
                 || dfs(board, word, r, c + 1, k + 1)
                 || dfs(board, word, r, c - 1, k + 1);
    board[r][c] = saved;                              // restore (un-choose)
    return found;
}`,
        walkthrough: [
          'word="ABCCED". Start at (0,0)=A, match word[0]. Mark #, go right to (0,1)=B (word[1]).',
          "From B → (0,2)=C (word[2]) → (1,2)=C (word[3]) → (2,2)=E (word[4]) → (2,1)=D (word[5]). k reaches length → true.",
          "Each step restores its cell on the way out had the branch failed; here it succeeds and short-circuits to true.",
        ],
      },
    ],
    edgeCases: [
      "Word longer than the number of cells → can't possibly fit → false (the search exhausts quickly).",
      "Single-cell board and single-char word → matches iff the characters are equal.",
      "Repeated letters in the word that need the same cell twice → the visited mark correctly blocks reuse.",
    ],
    twists: [
      "**Find *many* words in one grid (Word Search II, LeetCode 212)** → build a **Trie** of all words and DFS once, pruning by trie branches instead of restarting per word.",
      "**8-directional (include diagonals)** → add the four diagonal moves to the neighbour list.",
      "**Allow each cell reused** → drop the marking; but then watch for infinite paths (bound by length).",
    ],
    related: ["palindrome-partitioning", "combination-sum", "subsets"],
  },

  {
    slug: "palindrome-partitioning",
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 131,
    statement:
      "Given a string `s`, partition it so that **every** substring of the partition is a palindrome, and return **all** such partitionings.",
    examples: [
      { in: 's = "aab"', out: '[["a","a","b"],["aa","b"]]' },
      { in: 's = "a"', out: '[["a"]]' },
    ],
    constraints: ["1 ≤ s.length ≤ 16", "s contains lowercase English letters"],
    recognize:
      "'All ways to **cut** a string so each piece satisfies a property' is backtracking over **cut positions**. At each step you choose how long the next piece is; the constraint (palindrome) prunes invalid cuts. Choose a prefix, recurse on the rest.",
    figureItOut: [
      "Think of it as choosing **where to cut**. Starting at index `start`, the first piece is some prefix `s[start..end]`. If that prefix is a palindrome, it's a legal first piece — then you recursively partition the **remainder** `s[end+1..]` the same way. The decision at each level is: how far does this piece extend?",
      "So the candidates at index `start` are all prefixes `s[start..i]` for increasing `i`. For each, **test if it's a palindrome**; if yes, **choose** it (add to path), **explore** the rest by recursing from `i+1`, then **un-choose** (remove it) to try a longer prefix.",
      "The palindrome check is the pruning rule — it's what stops this from being 'all partitions'. A non-palindromic prefix is a dead branch you skip immediately, never recursing into it.",
      "Base case: when `start == s.length()`, you've consumed the whole string into palindromic pieces — record a copy of the current partition. (You always reach the end exactly, because each piece is non-empty.)",
      "Optimization worth knowing: the same substring gets palindrome-checked many times across branches. Precompute a boolean DP `isPal[i][j]` once (O(n²)) so each check during the recursion is O(1) — turning repeated O(n) scans into table lookups.",
    ],
    approaches: [
      {
        name: "Backtracking over prefixes (with O(1) palindrome lookup)",
        intuition: "At each start, try every palindromic prefix as the next piece; recurse on the remainder.",
        time: "O(n · 2ⁿ)",
        timeWhy: "There are up to 2^(n−1) ways to cut a length-n string; each completed partition costs O(n) to copy. The palindrome DP makes per-cut checks O(1).",
        space: "O(n²)",
        spaceWhy: "The isPal table is n×n; recursion depth and path are O(n).",
        code: `List<List<String>> partition(String s) {
    int n = s.length();
    boolean[][] isPal = new boolean[n][n];
    // build palindrome table: isPal[i][j] = s[i..j] is a palindrome
    for (int i = n - 1; i >= 0; i--)
        for (int j = i; j < n; j++)
            isPal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || isPal[i + 1][j - 1]);

    List<List<String>> res = new ArrayList<>();
    backtrack(s, 0, isPal, new ArrayList<>(), res);
    return res;
}

private void backtrack(String s, int start, boolean[][] isPal,
                       List<String> path, List<List<String>> res) {
    if (start == s.length()) {
        res.add(new ArrayList<>(path));        // whole string consumed — copy
        return;
    }
    for (int end = start; end < s.length(); end++) {
        if (!isPal[start][end]) continue;      // prune: prefix isn't a palindrome
        path.add(s.substring(start, end + 1)); // choose this piece
        backtrack(s, end + 1, isPal, path, res); // explore the remainder
        path.remove(path.size() - 1);          // un-choose
    }
}`,
        walkthrough: [
          's="aab". start=0: prefix "a" (pal) → recurse from 1.',
          "  start=1: \"a\" (pal) → recurse from 2: \"b\" (pal) → start=3 end → record [a,a,b]. Back: \"ab\" not pal, skip.",
          'Back to start=0: prefix "aa" (pal) → recurse from 2: "b" → record [aa,b]. "aab" not pal, skip. Result: [[a,a,b],[aa,b]].',
        ],
      },
    ],
    edgeCases: [
      "Single character → one partition [[c]] (a single char is always a palindrome).",
      "All identical characters (e.g. \"aaa\") → maximal number of partitions, 2^(n−1) of them.",
      "No multi-char palindromes → only the all-singletons partition is returned.",
    ],
    twists: [
      "**Minimum *number* of cuts (LeetCode 132)** → you don't need every partition; it's a DP minimizing cut count.",
      "**Partition into k palindromes** → add a depth bound and prune partitions that can't reach exactly k pieces.",
      "**Pieces must be palindromes of even length** → tighten the palindrome predicate.",
    ],
    related: ["word-search", "subsets", "combination-sum"],
  },

  {
    slug: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 17,
    statement:
      "Given a string of digits 2–9, return **all letter combinations** the number could spell, using the classic phone keypad mapping (2→abc, 3→def, … 9→wxyz). Return an empty list for empty input.",
    examples: [
      { in: 'digits = "23"', out: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { in: 'digits = ""', out: "[]" },
      { in: 'digits = "2"', out: '["a","b","c"]' },
    ],
    constraints: ["0 ≤ digits.length ≤ 4", "each digit is 2–9"],
    recognize:
      "Each digit contributes one letter from a fixed set, and you want **every combination across positions** — the **Cartesian product** of the per-digit letter groups. 'One choice from each group, all combinations' is backtracking: fix position 0's letter, recurse on the rest.",
    figureItOut: [
      "Picture the choices laid out: digit 1 offers (say) {a,b,c}, digit 2 offers {d,e,f}, and so on. A valid answer picks **exactly one letter from each digit's group**, in order. The full answer set is every such pick — the Cartesian product of the groups.",
      "That maps straight onto backtracking by **position**. `backtrack(index)` decides the letter for `digits[index]`. Loop over that digit's letters; for each, **choose** it (append to the running string), **explore** the next digit via `backtrack(index + 1)`, then **un-choose** (drop the last char).",
      "Base case: when `index == digits.length`, you've placed a letter for every digit — the running string is one complete combination, so record it. The recursion depth equals the number of digits.",
      "Notice there's no pruning here (unlike combination-sum or word-search): every full path is valid, so the tree has exactly ∏(group sizes) leaves — e.g. 3×3 = 9 for \"23\". It's pure enumeration via the choose/explore/un-choose skeleton.",
      "The one edge case to handle up front: empty input. With no digits there are no letters to choose, and the expected answer is an **empty list** (not a list containing the empty string) — so guard and return early.",
    ],
    approaches: [
      {
        name: "Backtracking over digit positions (optimal)",
        intuition: "For each digit, append one of its letters and recurse to the next digit.",
        time: "O(4^d · d)",
        timeWhy: "At most 4 letters per digit over d digits → up to 4^d combinations, each O(d) to build.",
        space: "O(d)",
        spaceWhy: "Recursion depth and the working string are both the number of digits (output excluded).",
        code: `List<String> letterCombinations(String digits) {
    List<String> res = new ArrayList<>();
    if (digits.isEmpty()) return res;          // empty input → empty list
    String[] map = {"", "", "abc", "def", "ghi", "jkl",
                    "mno", "pqrs", "tuv", "wxyz"};   // index = digit
    backtrack(digits, 0, new StringBuilder(), map, res);
    return res;
}

private void backtrack(String digits, int index, StringBuilder path,
                       String[] map, List<String> res) {
    if (index == digits.length()) {
        res.add(path.toString());              // one full combination
        return;
    }
    String letters = map[digits.charAt(index) - '0'];
    for (char ch : letters.toCharArray()) {
        path.append(ch);                       // choose
        backtrack(digits, index + 1, path, map, res); // explore next digit
        path.deleteCharAt(path.length() - 1);  // un-choose
    }
}`,
        walkthrough: [
          'digits="23". index 0 → digit 2 → {a,b,c}. Choose a → index 1 → digit 3 → {d,e,f}.',
          "  Choose d → index 2 == length → record \"ad\". Un-choose d, choose e → \"ae\", then \"af\".",
          'Back to index 0, choose b → "bd","be","bf"; choose c → "cd","ce","cf". 9 combinations total.',
        ],
      },
    ],
    edgeCases: [
      "Empty digits → return [] (an empty list), NOT [\"\"] — the classic gotcha.",
      "A single digit → just that digit's letters.",
      "Digits 7 and 9 have four letters (pqrs, wxyz) — the map handles variable group sizes.",
    ],
    twists: [
      "**Include 0 and 1 (space / no letters)** → extend the map; 1 maps to nothing, 0 to a space, and skip empties.",
      "**Iterative product** → build combinations with a queue, appending each digit's letters to every partial string (BFS-style, no recursion).",
      "**Filter to real dictionary words** → prune with a Trie of valid words as you extend, like Word Search II.",
    ],
    related: ["subsets", "permutations", "combination-sum"],
  },
];
