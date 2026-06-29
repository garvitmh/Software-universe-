// NeetCode All — wave 9b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
export const WAVE9B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "sum-root-to-leaf-numbers",
    title: "Sum Root to Leaf Numbers",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 129,
    statement:
      "Each root-to-leaf path in a binary tree spells out a number by concatenating the digit at each node (each node holds a single digit 0–9). Return the **total sum** of all the root-to-leaf numbers. A leaf is a node with no children.",
    examples: [
      { in: "root = [1,2,3]", out: "25", note: "paths 1→2 = 12 and 1→3 = 13; 12 + 13 = 25" },
      { in: "root = [4,9,0,5,1]", out: "1026", note: "495 + 491 + 40 = 1026" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 1000", "0 ≤ Node.val ≤ 9", "tree depth ≤ 10"],
    recognize:
      "It's a **DFS that carries an accumulator down each path** — a Path Sum variant where instead of adding values you build a base-10 number. The key insight is that descending one level means the running number shifts left by a digit: newNumber = oldNumber * 10 + node.val.",
    figureItOut: [
      "Start with what a 'root-to-leaf number' actually is. As you walk from the root down to a leaf, each node contributes one digit. The root is the most significant digit, the leaf is the least significant. So the path 4→9→5 is the number 495.",
      "How do you build that number while descending? When you move from a partial number like 49 to the next node 5, the 49 must shift one place to the left and the new digit slots into the ones place: 49 * 10 + 5 = 495. That multiply-by-ten-then-add is the whole trick.",
      "So pass the running value into the recursion. At each node compute cur = cur * 10 + node.val. When you reach a leaf (no children), cur is one complete number — return it so it bubbles up into the sum.",
      "For an internal node, the answer is just the sum of what the left subtree contributes plus what the right subtree contributes, each carrying the same cur forward. A null child contributes 0. Summing across all paths falls out naturally from returning and adding.",
    ],
    approaches: [
      {
        name: "DFS carrying the running number (optimal)",
        intuition: "Pass the accumulated number down; at a leaf it is one full number; sum the contributions of both subtrees.",
        time: "O(n)",
        timeWhy: "Each of the n nodes is visited exactly once and does O(1) work.",
        space: "O(h)",
        spaceWhy: "The recursion stack is as deep as the tree height h (O(n) worst case for a skewed tree, O(log n) if balanced).",
        code: `int sumNumbers(TreeNode root) {
    return dfs(root, 0);
}

int dfs(TreeNode node, int cur) {
    if (node == null) return 0;
    cur = cur * 10 + node.val;             // shift left one digit, add this node
    if (node.left == null && node.right == null) {
        return cur;                        // leaf: cur is a complete number
    }
    return dfs(node.left, cur) + dfs(node.right, cur);
}`,
        walkthrough: [
          "root=[1,2,3]. dfs(1,0): cur=1, not a leaf → dfs(2,1) + dfs(3,1).",
          "dfs(2,1): cur=12, leaf → returns 12. dfs(3,1): cur=13, leaf → returns 13.",
          "Total 12 + 13 = 25.",
        ],
      },
    ],
    edgeCases: [
      "Single node → the number is just that node's value.",
      "A null child must contribute 0, not a spurious number — the early `node == null` guard handles it.",
      "Depth is capped at 10 so the concatenated number always fits in an int; for deeper trees you would need a long or string accumulation.",
    ],
    twists: [
      "**Path Sum II** (LeetCode 113) → collect the actual paths instead of summing numbers; needs backtracking on a path list.",
      "**Binary tree with binary digits** → same shift trick but multiply by 2 instead of 10.",
      "**Sum of paths that need not end at a leaf** → switch to a prefix-style accumulation and count every prefix.",
    ],
    related: ["path-sum", "path-sum-ii", "binary-tree-paths"],
  },

  {
    slug: "binary-tree-paths",
    title: "Binary Tree Paths",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 257,
    statement:
      "Given the `root` of a binary tree, return **all root-to-leaf paths** in any order. Each path is a string of node values joined by `->`. A leaf is a node with no children.",
    examples: [
      { in: "root = [1,2,3,null,5]", out: '["1->2->5","1->3"]' },
      { in: "root = [1]", out: '["1"]' },
    ],
    constraints: ["1 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "'Enumerate every root-to-leaf path' is **DFS + backtracking on a tree**. You build the current path as you descend and emit a finished string each time you land on a leaf, undoing the last step as you return.",
    figureItOut: [
      "The output is one string per leaf, listing the nodes from root down to that leaf. So you need to remember the chain of nodes you walked to reach each leaf — the path so far.",
      "Carry that chain down the recursion. The cleanest way is to pass the partial string (e.g. \"1->2\") and append \"->\" + node.val as you go deeper. Strings are immutable in Java, so each call naturally gets its own copy — no manual undo needed.",
      "The terminating condition is reaching a leaf: both children null. At that moment the partial string is a complete root-to-leaf path, so add it to the answer list.",
      "If you instead use a shared mutable list of node values (to avoid string copies), you must explicitly **backtrack** — remove the node you added before returning, so a sibling branch does not inherit it. The immutable-string version trades that bookkeeping for a little extra allocation.",
    ],
    approaches: [
      {
        name: "DFS building the path string (optimal, clean)",
        intuition: "Carry the path-so-far string down; emit it at each leaf.",
        time: "O(n²) worst case",
        timeWhy: "Each of n nodes is visited once, but appending to and copying the path string costs up to O(n) per node in a skewed tree.",
        space: "O(n²) for the output, O(h) recursion",
        spaceWhy: "The output strings total up to O(n·h) characters; the recursion stack is O(h).",
        code: `List<String> binaryTreePaths(TreeNode root) {
    List<String> res = new ArrayList<>();
    if (root != null) dfs(root, "", res);
    return res;
}

void dfs(TreeNode node, String path, List<String> res) {
    path = path.isEmpty() ? String.valueOf(node.val)
                          : path + "->" + node.val;
    if (node.left == null && node.right == null) {
        res.add(path);                     // leaf: path is complete
        return;
    }
    if (node.left != null)  dfs(node.left, path, res);
    if (node.right != null) dfs(node.right, path, res);
}`,
        walkthrough: [
          "root=[1,2,3,null,5]. dfs(1,\"\"): path=\"1\", not leaf.",
          "dfs(2,\"1\"): path=\"1->2\", has right child 5 → dfs(5,\"1->2\"): path=\"1->2->5\", leaf → add.",
          "dfs(3,\"1\"): path=\"1->3\", leaf → add. Result [\"1->2->5\",\"1->3\"].",
        ],
      },
    ],
    edgeCases: [
      "Single node → one path containing just that value, no arrows.",
      "Negative values are fine — they are formatted into the string like any other.",
      "An internal node with exactly one child is NOT a leaf; only emit when both children are null.",
    ],
    twists: [
      "**Sum Root to Leaf Numbers** (LeetCode 129) → sum the numeric value of each path instead of listing it.",
      "**Path Sum II** (LeetCode 113) → only keep paths whose values sum to a target.",
      "**Smallest string starting at a leaf** (LeetCode 988) → build the string upward and compare lexicographically.",
    ],
    related: ["path-sum", "sum-root-to-leaf-numbers", "path-sum-ii"],
  },

  {
    slug: "populating-next-right-pointers-in-each-node",
    title: "Populating Next Right Pointers in Each Node",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 116,
    statement:
      "Given a **perfect** binary tree (every parent has two children and all leaves are on the same level), populate each node's `next` pointer to point to the node immediately to its **right** on the same level. The rightmost node of each level points to null. Aim for **O(1)** extra space.",
    examples: [
      { in: "root = [1,2,3,4,5,6,7]", out: "[1,#,2,3,#,4,5,6,7,#]", note: "# marks the end of each level; 4→5→6→7 are linked" },
      { in: "root = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 2¹² − 1", "the tree is perfect", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "A level-by-level wiring task on a tree. BFS solves it in O(n) extra space, but the 'O(1) space' demand plus the **perfect-tree guarantee** is the hint: use the `next` pointers you have **already built on the current level** as a free linked list to traverse and wire the level below.",
    figureItOut: [
      "The obvious approach is BFS: process level by level with a queue, linking each node to the next in the queue. That works and is O(n) time, but the queue holds a whole level — up to n/2 nodes — so it is O(n) space, violating the follow-up.",
      "Now use the structure. Because the tree is perfect, once a level is fully linked via `next`, you can walk that level left-to-right for free, with no queue. The current level becomes a ready-made linked list pointing the way.",
      "From a parent on the current level, its two children sit directly below: `parent.left.next = parent.right`. And the gap between two parents is bridged by `parent.right.next = parent.next.left` — the left child of the parent's right neighbour. Those two rules wire the entire next level.",
      "So the loop is: keep a pointer to the leftmost node of the current level. Walk that level using `next`, wiring children as you go. Then drop down to `leftmost.left` and repeat until you reach the leaves. No extra structure — just pointers.",
    ],
    approaches: [
      {
        name: "BFS level order (baseline, O(n) space)",
        intuition: "Process each level with a queue; link consecutive nodes.",
        time: "O(n)",
        timeWhy: "Each node enqueued and dequeued once.",
        space: "O(n)",
        spaceWhy: "The queue holds an entire level, up to n/2 nodes.",
        code: `Node connect(Node root) {
    if (root == null) return null;
    Queue<Node> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        Node prev = null;
        for (int i = 0; i < size; i++) {
            Node cur = q.poll();
            if (prev != null) prev.next = cur;
            prev = cur;
            if (cur.left != null)  q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
        }
    }
    return root;
}`,
      },
      {
        name: "Use existing next pointers (optimal, O(1) space)",
        intuition: "Treat the already-linked current level as a list; wire the level below from it.",
        time: "O(n)",
        timeWhy: "Every node is touched once while wiring the level beneath it.",
        space: "O(1)",
        spaceWhy: "Only a couple of pointers; no queue. (Output next pointers are not counted as extra space.)",
        code: `Node connect(Node root) {
    if (root == null) return null;
    Node leftmost = root;
    while (leftmost.left != null) {           // perfect tree: left exists until leaves
        Node head = leftmost;
        while (head != null) {
            head.left.next = head.right;      // link the two children of this parent
            if (head.next != null) {
                head.right.next = head.next.left;  // bridge to the next parent's children
            }
            head = head.next;                 // walk current level via existing next links
        }
        leftmost = leftmost.left;             // drop to the next level
    }
    return root;
}`,
        walkthrough: [
          "Tree [1,2,3,4,5,6,7]. Level 1: just 1, leftmost=1.",
          "Wire level 2: 2.next=3 (1.left.next=1.right). Drop to leftmost=2.",
          "Wire level 3 from 2→3: 4.next=5, 5.next=6 (via 2.next.left), 6.next=7. leftmost=4 has no left → stop.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → return null.",
      "A single node → its next stays null (no right neighbour).",
      "The bridge `head.right.next = head.next.left` only fires when `head.next` exists; the rightmost parent's right child correctly stays null.",
    ],
    twists: [
      "**Populating Next Right Pointers II** (LeetCode 117) → the tree is NOT perfect; children may be missing, so you scan for the next available child with a dummy-head pointer per level.",
      "**Level order traversal** (LeetCode 102) → if you only need the values per level, plain BFS is simpler.",
      "**Right side view** (LeetCode 199) → after wiring, the rightmost node of each level is the one whose next is null.",
    ],
    related: ["binary-tree-level-order-traversal", "binary-tree-right-side-view"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "remove-duplicates-from-sorted-list",
    title: "Remove Duplicates from Sorted List",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 83,
    statement:
      "Given the `head` of a **sorted** linked list, delete all duplicates so that each value appears only **once**, and return the sorted list still in order.",
    examples: [
      { in: "head = [1,1,2]", out: "[1,2]" },
      { in: "head = [1,1,2,3,3]", out: "[1,2,3]" },
      { in: "head = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 300", "−100 ≤ Node.val ≤ 100", "the list is sorted ascending"],
    recognize:
      "Because the list is **sorted**, any duplicates are **adjacent**. That turns dedup into a single forward pass comparing each node with its immediate next — no hash set, just pointer skipping.",
    figureItOut: [
      "First exploit the sortedness. In a sorted list, equal values can only sit next to each other — once the value changes it never comes back. So you never need to look beyond the current node's neighbour to detect a duplicate.",
      "Walk a single pointer `cur` along the list. At each step compare `cur.val` with `cur.next.val`.",
      "If they are equal, `cur.next` is a duplicate of `cur`. Splice it out by setting `cur.next = cur.next.next`, and crucially do NOT advance `cur` yet — there might be a run of duplicates (1,1,1), so you must keep checking the new neighbour.",
      "If they differ, the current value is finalized; advance `cur` to move on. Stop when `cur` or `cur.next` is null. Because we only ever keep the first occurrence, the result keeps each value exactly once.",
    ],
    approaches: [
      {
        name: "Single pass, skip equal neighbours (optimal)",
        intuition: "Compare each node to its next; unlink the next when equal, else advance.",
        time: "O(n)",
        timeWhy: "Each node is examined at most twice (once as cur, once as the neighbour being skipped).",
        space: "O(1)",
        spaceWhy: "Only the single walking pointer; the list is rewired in place.",
        code: `ListNode deleteDuplicates(ListNode head) {
    ListNode cur = head;
    while (cur != null && cur.next != null) {
        if (cur.next.val == cur.val) {
            cur.next = cur.next.next;     // skip the duplicate, stay on cur
        } else {
            cur = cur.next;               // value changed, move forward
        }
    }
    return head;
}`,
        walkthrough: [
          "[1,1,2,3,3]. cur=1, next=1 equal → cur.next=2; list 1→2→3→3, cur still 1.",
          "cur=1, next=2 differ → cur=2. cur=2, next=3 differ → cur=3.",
          "cur=3, next=3 equal → cur.next=null; cur=3, next=null → stop. Result [1,2,3].",
        ],
      },
    ],
    edgeCases: [
      "Empty list or single node → nothing to remove, return as-is.",
      "All values identical → collapses to a single node.",
      "Do NOT advance cur on a match, or a run like 1,1,1 leaves a stray duplicate behind.",
    ],
    twists: [
      "**Remove Duplicates from Sorted List II** (LeetCode 82) → delete ALL nodes that have any duplicate (keep only values appearing once); needs a dummy head and skipping whole runs.",
      "**Unsorted input** → duplicates are no longer adjacent; use a HashSet of seen values.",
      "**Remove Duplicates from Sorted Array** (LeetCode 26) → the array analogue with a two-pointer write index.",
    ],
    related: ["remove-duplicates-from-sorted-array", "middle-of-the-linked-list"],
  },

  {
    slug: "split-linked-list-in-parts",
    title: "Split Linked List in Parts",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 725,
    statement:
      "Given the `head` of a linked list and an integer `k`, split the list into `k` consecutive parts. The parts should be as **equal in size** as possible: no two parts differ in length by more than one, and earlier parts are never smaller than later ones. Some parts may be **empty**. Return an array of the `k` part heads.",
    examples: [
      { in: "head = [1,2,3], k = 5", out: "[[1],[2],[3],[],[]]", note: "more parts than nodes → trailing empties" },
      { in: "head = [1,2,3,4,5,6,7,8,9,10], k = 3", out: "[[1,2,3,4],[5,6,7],[8,9,10]]", note: "first part gets the extra node" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 1000", "0 ≤ Node.val ≤ 1000", "1 ≤ k ≤ 50"],
    recognize:
      "It's an **arithmetic-then-surgery** linked-list problem. First do the division: figure out how long each part is (base size plus a leftover spread one-per-part across the front). Then walk the list once, **cutting** after each part's last node.",
    figureItOut: [
      "Forget pointers for a moment and just do the counting. If the list has n nodes and you want k parts, each part should be about n/k nodes. The remainder r = n % k nodes are left over.",
      "How to distribute the remainder fairly? The rule says earlier parts are never smaller and differ by at most one — so hand exactly one extra node to each of the first r parts. So part i has size (n/k) + 1 if i < r, else n/k.",
      "If k > n, then n/k is 0 and only the first n parts get a single node (r = n); the rest are empty lists (null heads). That handles the 'some parts may be empty' case automatically.",
      "Now the surgery. Walk the list with a pointer. For each part, remember its head, advance (partSize − 1) steps to its last node, then **cut**: save `last.next`, set `last.next = null`, and continue from the saved node for the next part. One pass after the length count.",
    ],
    approaches: [
      {
        name: "Count length, then cut into parts (optimal)",
        intuition: "Compute base size and remainder, then walk once severing each part's tail.",
        time: "O(n + k)",
        timeWhy: "One pass to count (O(n)), one pass to cut (O(n)), and O(k) to fill the result array.",
        space: "O(k)",
        spaceWhy: "The output array of k heads; no other auxiliary structure (output not counted, the array of references is O(k)).",
        code: `ListNode[] splitListToParts(ListNode head, int k) {
    int n = 0;
    for (ListNode p = head; p != null; p = p.next) n++;

    int base = n / k;            // every part gets at least this many
    int rem  = n % k;            // first rem parts get one extra

    ListNode[] res = new ListNode[k];
    ListNode cur = head;
    for (int i = 0; i < k; i++) {
        res[i] = cur;
        int size = base + (i < rem ? 1 : 0);
        for (int j = 0; j < size - 1; j++) {
            cur = cur.next;      // walk to this part's last node
        }
        if (cur != null) {
            ListNode next = cur.next;
            cur.next = null;     // cut here
            cur = next;
        }
    }
    return res;
}`,
        walkthrough: [
          "[1..10], k=3. n=10, base=3, rem=1 → sizes 4,3,3.",
          "Part 0: head 1, walk 3 steps to 4, cut → [1,2,3,4]; cur=5.",
          "Part 1: head 5, walk to 7, cut → [5,6,7]; cur=8. Part 2: head 8 → [8,9,10]; cur=null.",
        ],
      },
    ],
    edgeCases: [
      "k > n → first n parts have one node each, remaining parts are null.",
      "Empty list → an array of k nulls.",
      "When `cur` becomes null mid-loop (k > n), the `if (cur != null)` guard prevents a null-pointer dereference and leaves later slots null.",
    ],
    twists: [
      "**Split an array into k equal parts** → same arithmetic, but slice by index instead of cutting pointers.",
      "**Reverse Nodes in k-Group** (LeetCode 25) → also chunks by size but reverses each chunk in place.",
      "**Balance by value, not count** → partition so each part's value-sum is close; that becomes a harder DP/greedy problem.",
    ],
    related: ["reverse-nodes-in-k-group", "middle-of-the-linked-list"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "single-threaded-cpu",
    title: "Single-Threaded CPU",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1834,
    statement:
      "You have `tasks` where `tasks[i] = [enqueueTime_i, processingTime_i]`. A single-threaded CPU processes them: when idle, it picks the **available** task with the smallest processing time (ties broken by smallest index). If none are available it waits for the next enqueue time. Return the order in which task indices are processed.",
    examples: [
      { in: "tasks = [[1,2],[2,4],[3,2],[4,1]]", out: "[0,2,3,1]" },
      { in: "tasks = [[7,10],[7,12],[7,5],[7,4],[7,2]]", out: "[4,3,2,0,1]", note: "all enqueue at 7; pick by processing time then index" },
    ],
    constraints: ["1 ≤ tasks.length ≤ 10⁵", "1 ≤ enqueueTime, processingTime ≤ 10⁹"],
    recognize:
      "A scheduling simulation where at each decision point you must grab the **minimum** among the currently-available tasks by (processingTime, index). 'Repeatedly extract the min from a changing set' is the **min-heap** signature, with tasks sorted by enqueue time to know when each becomes available.",
    figureItOut: [
      "Picture the CPU as a clock. At any moment some tasks have already 'arrived' (enqueueTime ≤ now) and are waiting; the CPU should run the cheapest of those, breaking ties by index. The catch is the set of waiting tasks keeps growing as time advances.",
      "To know which tasks have arrived by a given time, sort the tasks by enqueueTime first. Keep an index pointer that admits tasks into a 'ready' pool as the clock reaches their enqueue time.",
      "The ready pool needs fast 'give me the smallest (processingTime, index)'. That is exactly a **min-heap** ordered by processingTime then original index. Pop to choose, push as new tasks become available.",
      "Run the clock: if the heap is empty but tasks remain, jump the clock forward to the next task's enqueue time (the CPU idles). Otherwise pop the best task, advance the clock by its processingTime, record its index, and admit any tasks that arrived during that run. Repeat until all are scheduled. Remember to sort by enqueue but carry the **original index** since the answer wants original indices.",
    ],
    approaches: [
      {
        name: "Sort by enqueue + min-heap by (processingTime, index) (optimal)",
        intuition: "Admit arrived tasks into a heap; always run the cheapest; idle-jump when the heap is empty.",
        time: "O(n log n)",
        timeWhy: "Sorting is O(n log n); each task is pushed and popped from the heap once, each O(log n).",
        space: "O(n)",
        spaceWhy: "The heap and the sorted index array each hold up to n entries.",
        code: `int[] getOrder(int[][] tasks) {
    int n = tasks.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> Integer.compare(tasks[a][0], tasks[b][0]));

    // heap entries: [processingTime, originalIndex]
    PriorityQueue<int[]> ready = new PriorityQueue<>(
        (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0])
                               : Integer.compare(a[1], b[1]));

    int[] res = new int[n];
    long time = 0;
    int i = 0, out = 0;
    while (out < n) {
        // admit every task that has arrived by 'time'
        while (i < n && tasks[idx[i]][0] <= time) {
            ready.offer(new int[]{ tasks[idx[i]][1], idx[i] });
            i++;
        }
        if (ready.isEmpty()) {
            time = tasks[idx[i]][0];       // CPU idles until next arrival
            continue;
        }
        int[] cur = ready.poll();
        time += cur[0];                    // run it to completion
        res[out++] = cur[1];
    }
    return res;
}`,
        walkthrough: [
          "tasks=[[1,2],[2,4],[3,2],[4,1]]. time=0, none arrived → jump to 1, admit task0 (2,0).",
          "Run task0: time=3; meanwhile admit task1(4,1),task2(2,2). Heap min is (2,2) → run task2: time=5; admit task3(1,3).",
          "Heap {(4,1),(1,3)} min (1,3) → task3, time=6; then task1. Order [0,2,3,1].",
        ],
      },
    ],
    edgeCases: [
      "All tasks enqueue at the same time → the heap orders them purely by processingTime then index.",
      "A gap where the CPU finishes everything available before the next task arrives → must idle-jump the clock.",
      "Use `long` for the clock: enqueue and processing times up to 10⁹ across 10⁵ tasks overflow an int.",
    ],
    twists: [
      "**Multiple CPUs** → keep a heap of free cores too, and a min-heap of finish times.",
      "**Preemptive scheduling (shortest remaining time)** → tasks can be interrupted; you re-insert remaining time into the heap at each arrival.",
      "**IPO** (LeetCode 502) → another 'unlock by a threshold, then pick the best with a heap' pattern.",
    ],
    related: ["ipo", "task-scheduler", "find-k-pairs-with-smallest-sums"],
  },

  {
    slug: "maximum-performance-of-a-team",
    title: "Maximum Performance of a Team",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1383,
    statement:
      "You have `n` engineers with arrays `speed` and `efficiency`. Choose at most `k` engineers to form a team. The team's **performance** is (sum of their speeds) × (minimum efficiency among them). Return the maximum performance, modulo 10⁹ + 7.",
    examples: [
      { in: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 2", out: "60", note: "engineers 2 and 5: (10+5)×4 = 60" },
      { in: "n = 6, speed = [2,10,3,1,5,8], efficiency = [5,4,3,9,7,2], k = 3", out: "68" },
    ],
    constraints: ["1 ≤ k ≤ n ≤ 10⁵", "1 ≤ speed[i] ≤ 10⁵", "1 ≤ efficiency[i] ≤ 10⁸"],
    recognize:
      "Performance couples a **sum** (speeds) with a **min** (efficiency) — two objectives fighting each other. The trick: fix the minimum by sorting engineers by efficiency **descending**, so whoever you have seen so far has efficiency ≥ the current one. Then maximize the speed sum under a size-k cap with a **min-heap** that evicts the slowest.",
    figureItOut: [
      "The product has two moving pieces: total speed (you want it big) and minimum efficiency (you want it big too). They conflict — adding more engineers raises the speed sum but can drag the minimum efficiency down. You cannot greedily optimize both at once.",
      "Pin down the harder piece. Suppose engineer e is the one with the **minimum** efficiency on the team. Then every other team member must have efficiency ≥ e's. So sort engineers by efficiency descending and process them one by one: when you process engineer e, everyone already seen has efficiency ≥ e's, so e is a valid 'team minimum'.",
      "Given e fixes the minimum efficiency, the only remaining goal is to maximize the speed sum using e plus up to k−1 of the previously-seen engineers — and you want the fastest ones.",
      "Maintain a running speed sum and a **min-heap of speeds** capped at size k. When adding a new engineer would exceed k, pop the smallest speed (subtract it from the sum) so you always keep the k fastest seen so far. At each step compute candidate = sum × currentEfficiency and track the max. Apply the modulus only at the very end on the best value.",
    ],
    approaches: [
      {
        name: "Sort by efficiency desc + min-heap of speeds (optimal)",
        intuition: "Each engineer in turn is the min efficiency; keep the k fastest speeds seen so far via a min-heap.",
        time: "O(n log n)",
        timeWhy: "Sorting is O(n log n); each engineer enters and possibly leaves the heap once, O(log k) each.",
        space: "O(n)",
        spaceWhy: "The sorted array of pairs and the heap (up to k entries).",
        code: `int maxPerformance(int n, int[] speed, int[] efficiency, int k) {
    final int MOD = 1_000_000_007;
    int[][] eng = new int[n][2];
    for (int i = 0; i < n; i++) {
        eng[i][0] = efficiency[i];
        eng[i][1] = speed[i];
    }
    // sort by efficiency descending
    Arrays.sort(eng, (a, b) -> Integer.compare(b[0], a[0]));

    PriorityQueue<Integer> minSpeed = new PriorityQueue<>();  // min-heap of speeds
    long speedSum = 0, best = 0;
    for (int[] e : eng) {
        minSpeed.offer(e[1]);
        speedSum += e[1];
        if (minSpeed.size() > k) {
            speedSum -= minSpeed.poll();    // drop the slowest to stay within k
        }
        best = Math.max(best, speedSum * e[0]);   // e[0] is the current min efficiency
    }
    return (int) (best % MOD);
}`,
        walkthrough: [
          "k=2. Sorted by eff desc: (9,1),(7,5),(5,2),(4,10),(3,3),(2,8).",
          "(9,1): sum1×9=9. (7,5): sum6×7=42. (5,2): heap{1,5,2}>2 drop 1→sum7×5=35.",
          "(4,10): heap drop 2→sum=5+10=15×4=60 ← best. Remaining can't beat 60 → answer 60.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → the answer is the max over each engineer of speed × efficiency individually.",
      "Apply the modulus only once at the end; taking it mid-computation would break the max comparison (a smaller raw value could have a larger residue).",
      "Use `long` for speedSum × efficiency: 10⁵ engineers × 10⁵ speed × 10⁸ efficiency overflows int massively.",
    ],
    twists: [
      "**Exactly k (not at most k)** → only start recording the answer once the heap has reached size k.",
      "**Maximize sum × max instead of × min** → sort ascending by the multiplier instead.",
      "**IPO** (LeetCode 502) → same family: a heap maintains the best candidates under a changing constraint.",
    ],
    related: ["ipo", "kth-largest-element-in-an-array", "k-closest-points-to-origin"],
  },

  {
    slug: "smallest-range-covering-elements-from-k-lists",
    title: "Smallest Range Covering Elements from K Lists",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 632,
    statement:
      "You have `k` lists of integers, each sorted in non-decreasing order. Find the **smallest range** `[a, b]` such that it contains **at least one number from each** of the k lists. A range `[a,b]` is smaller than `[c,d]` if `b − a < d − c`, or if the widths tie and `a < c`.",
    examples: [
      { in: "nums = [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]", out: "[20,24]", note: "24 from list0, 20 from list1, 22 from list2 all fit" },
      { in: "nums = [[1,2,3],[1,2,3],[1,2,3]]", out: "[1,1]" },
    ],
    constraints: ["1 ≤ k ≤ 3500", "1 ≤ list length ≤ 50", "−10⁵ ≤ nums[i][j] ≤ 10⁵", "each list is sorted"],
    recognize:
      "You need a window that touches all k lists at once — like a k-way merge. Keep **one current element from each list** in a **min-heap**; the range is [heap-min, max-seen]. Advance only the list holding the minimum (a k-way-merge step) to shrink from the left, tracking the best range.",
    figureItOut: [
      "A valid range must include at least one value per list. The tightest such range, at any moment, is determined by picking one element from each list: the range spans from the smallest of those picks to the largest. So consider a 'frontier' of one chosen index per list.",
      "Start the frontier at the first (smallest) element of every list. The current range is [min of frontier, max of frontier] and it already covers all k lists. Record it.",
      "To possibly shrink the range, you must raise the minimum (the max is the bottleneck on the other side, but you can only move pointers forward in sorted lists). So advance the pointer of the list that currently holds the **minimum** — that is the only move that can reduce the width without losing coverage.",
      "Finding the min quickly across k lists is a **min-heap** keyed by value, storing which list and index it came from. Pop the min, push the next element from that same list (updating the running max), recompute the range. Stop when any list is exhausted — you can no longer cover that list. This is structurally a k-way merge that watches the spread between heap-min and running-max.",
    ],
    approaches: [
      {
        name: "Min-heap k-way merge tracking the max (optimal)",
        intuition: "Heap holds the current frontier element of each list; range is [min, runningMax]; advance the list with the min.",
        time: "O(N log k)",
        timeWhy: "N = total elements across all lists; each element enters and leaves the heap once, O(log k) per operation.",
        space: "O(k)",
        spaceWhy: "The heap holds exactly one element per list at a time.",
        code: `int[] smallestRange(List<List<Integer>> nums) {
    int k = nums.size();
    // heap entry: [value, listIndex, elementIndex]
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
    int curMax = Integer.MIN_VALUE;
    for (int i = 0; i < k; i++) {
        int v = nums.get(i).get(0);
        heap.offer(new int[]{ v, i, 0 });
        curMax = Math.max(curMax, v);
    }

    int bestLo = 0, bestHi = 0, bestWidth = Integer.MAX_VALUE;
    while (true) {
        int[] top = heap.poll();
        int curMin = top[0];
        if (curMax - curMin < bestWidth) {       // strictly smaller width wins
            bestWidth = curMax - curMin;
            bestLo = curMin;
            bestHi = curMax;
        }
        int li = top[1], ei = top[2];
        if (ei + 1 == nums.get(li).size()) break; // this list is exhausted → stop
        int nextV = nums.get(li).get(ei + 1);
        curMax = Math.max(curMax, nextV);
        heap.offer(new int[]{ nextV, li, ei + 1 });
    }
    return new int[]{ bestLo, bestHi };
}`,
        walkthrough: [
          "Lists as given. Frontier first elems {4,0,5}: min0,max5 → range[0,5] width5.",
          "Advance list1 (held 0)→9: max9, frontier{4,9,5} min4 → [4,9] worse. Keep advancing the min each step.",
          "Eventually frontier {24,20,22}: min20,max24 → width4 = [20,24], the best before list1 exhausts.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → the smallest range is [x,x] for any single element; the first element works.",
      "Lists of different lengths → the loop stops the instant the shortest-to-exhaust list runs out, since you can no longer cover it.",
      "Tie-breaking: only replace the best when the new width is strictly smaller, so among equal widths the earliest (smaller a) survives.",
    ],
    twists: [
      "**Merge K Sorted Lists** (LeetCode 23) → the same heap k-way merge, but you emit the merged sequence instead of tracking a spread.",
      "**Find K Pairs with Smallest Sums** (LeetCode 373) → a heap frontier over two lists.",
      "**Shortest range with sliding window** → flatten all values with list-id tags, sort, and use a window that must contain all k ids.",
    ],
    related: ["merge-k-sorted-lists", "find-k-pairs-with-smallest-sums", "kth-smallest-element-in-a-sorted-matrix"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "longest-word-in-dictionary",
    title: "Longest Word in Dictionary",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 720,
    statement:
      "Given an array of strings `words`, return the **longest word** that can be built **one character at a time** by other words in `words` — meaning every prefix of it (of length 1, 2, … up to its full length) must also be present in `words`. If multiple qualify, return the **lexicographically smallest**. If none, return the empty string.",
    examples: [
      { in: 'words = ["w","wo","wor","worl","world"]', out: '"world"', note: "every prefix exists" },
      { in: 'words = ["a","banana","app","appl","ap","apply","apple"]', out: '"apple"', note: "apple buildable; ties with apply, apple is smaller" },
    ],
    constraints: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length ≤ 30", "lowercase English letters"],
    recognize:
      "'Every prefix must also be a word' is the **trie** condition stated out loud. Insert all words into a trie marking word-ends, then DFS only down paths where **every node along the way is itself a complete word** — the deepest such path (lexicographically smallest on ties) is the answer.",
    figureItOut: [
      "Reframe the requirement. A word qualifies only if you can grow it letter by letter and land on a real word at every step. That means each of its prefixes — \"a\", \"ap\", \"app\", \"appl\", \"apple\" — must appear in the dictionary.",
      "A trie stores exactly that prefix structure: walking from the root spells out prefixes, and a flag marks which nodes complete a real word. So the qualifying words are exactly those reachable by a path where **every node on the path is flagged as a word-end**.",
      "Build the trie, then DFS from the root. Only descend into a child if that child node is marked `isWord` — the moment a prefix is missing from the dictionary, that branch is dead and you stop.",
      "Track the longest valid word found. For the lexicographic tie-break, simply explore children in alphabetical order (a→z) and only replace the best when you find a **strictly longer** one; the first word of a given length you reach going a→z is the smallest. Return that best word at the end.",
    ],
    approaches: [
      {
        name: "Hash set of prefixes (baseline)",
        intuition: "Sort words; keep a set of buildable words; a word is buildable if its prefix of length−1 is buildable.",
        time: "O(Σ word length · 30)",
        timeWhy: "Sorting plus, for each word, a set lookup of its parent prefix.",
        space: "O(Σ word length)",
        spaceWhy: "The set of buildable words.",
        code: `String longestWord(String[] words) {
    Arrays.sort(words);                    // shorter/lexicographically smaller first
    Set<String> built = new HashSet<>();
    String best = "";
    for (String w : words) {
        if (w.length() == 1 || built.contains(w.substring(0, w.length() - 1))) {
            built.add(w);
            if (w.length() > best.length()) best = w;   // sorted order keeps ties smallest
        }
    }
    return best;
}`,
      },
      {
        name: "Trie + DFS down all-word paths (optimal, idiomatic)",
        intuition: "Insert all words; DFS descending only through nodes that are themselves words; keep the deepest, smallest.",
        time: "O(Σ word length)",
        timeWhy: "Inserting all words is linear in total characters; the DFS visits each trie node once.",
        space: "O(Σ word length)",
        spaceWhy: "The trie holds every character of every word (shared prefixes merged).",
        code: `class Solution {
    static class Node {
        Node[] next = new Node[26];
        boolean isWord;
        String word;            // the full word ending here, if any
    }

    private String best = "";

    public String longestWord(String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node cur = root;
            for (char ch : w.toCharArray()) {
                int c = ch - 'a';
                if (cur.next[c] == null) cur.next[c] = new Node();
                cur = cur.next[c];
            }
            cur.isWord = true;
            cur.word = w;
        }
        dfs(root);
        return best;
    }

    private void dfs(Node node) {
        for (int c = 0; c < 26; c++) {     // a..z order → smallest on ties
            Node child = node.next[c];
            if (child != null && child.isWord) {
                if (child.word.length() > best.length()) best = child.word;
                dfs(child);                // continue only through word-end nodes
            }
        }
    }
}`,
        walkthrough: [
          'Insert ["a","ap","app","appl","apple","apply","banana"]. Root.',
          "DFS a→z: 'a' isWord → descend; 'ap','app','appl' all words → descend to 'apple' (len5) and 'apply' (len5).",
          "'apple' reached before 'apply' (e<y) → best stays 'apple'. 'b' path: 'b' not a word → branch dead.",
        ],
      },
    ],
    edgeCases: [
      "No single-letter word present → nothing can be built one char at a time → return \"\".",
      "Lexicographic tie-break: exploring children a→z and only replacing on strictly-longer guarantees the smallest among equal-length winners.",
      "A word whose middle prefix is missing (e.g. \"apple\" with no \"app\") is disqualified even though its endpoints exist.",
    ],
    twists: [
      "**Replace Words** (LeetCode 648) → use a trie of roots to shorten words to their shortest root.",
      "**Implement Trie** (LeetCode 208) → the underlying data structure on its own.",
      "**Longest word made of other words (concatenation)** → different: a word built by joining multiple shorter words, solved with DFS/DP over the trie.",
    ],
    related: ["implement-trie-prefix-tree", "replace-words", "design-add-and-search-words-data-structure"],
  },

  {
    slug: "maximum-xor-of-two-numbers-in-an-array",
    title: "Maximum XOR of Two Numbers in an Array",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 421,
    statement:
      "Given an integer array `nums`, return the maximum value of `nums[i] XOR nums[j]` over all pairs `i ≠ j`.",
    examples: [
      { in: "nums = [3,10,5,25,2,8]", out: "28", note: "5 XOR 25 = 28" },
      { in: "nums = [14,70,53,83,49,91,36,80,92,51,66,70]", out: "127" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2·10⁵", "0 ≤ nums[i] ≤ 2³¹ − 1"],
    recognize:
      "The brute force is O(n²) pairwise XOR. To beat it, treat each number as a **31-bit binary string** and store them in a **bit-trie**. XOR is maximized by choosing, at each bit, the **opposite** bit when possible — a greedy walk down the trie gives the best partner for each number in O(31).",
    figureItOut: [
      "XOR gives a 1 in a bit position exactly when the two numbers differ there. To make the XOR as large as possible, you want a 1 in the **highest** bit possible, then the next highest, and so on — greedy from the most significant bit down.",
      "So for a fixed number x, the ideal partner has the **opposite** bit of x at every position, starting from the top. The question becomes: among all numbers seen, is there one that takes the opposite turn at this bit? That is a prefix question over binary representations.",
      "Store every number's bits (from bit 30 down to 0) as a path in a **binary trie** — each node has two children, 0 and 1. To find the best partner for x, walk the trie: at each bit of x, try to go to the **opposite** child (forcing a 1 in the result); if that child does not exist, take the same child (forced 0 there).",
      "Insert all numbers into the trie, then for each number do the greedy opposite-bit descent to compute its best XOR partner, tracking the global maximum. Each insert and each query is 31 steps, so total O(31n) — linear, beating O(n²).",
    ],
    approaches: [
      {
        name: "Brute force all pairs (baseline)",
        intuition: "XOR every pair, keep the max.",
        time: "O(n²)",
        timeWhy: "Every unordered pair is compared.",
        space: "O(1)",
        spaceWhy: "Just a running maximum.",
        code: `int findMaximumXOR(int[] nums) {
    int best = 0;
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            best = Math.max(best, nums[i] ^ nums[j]);
        }
    }
    return best;
}`,
      },
      {
        name: "Binary trie + greedy opposite-bit walk (optimal)",
        intuition: "Store numbers bit-by-bit; for each number, walk choosing the opposite bit when available to maximize XOR.",
        time: "O(31n)",
        timeWhy: "Each of n numbers is inserted (31 bits) and queried (31 bits) once.",
        space: "O(31n)",
        spaceWhy: "The trie has up to 31 nodes per number in the worst case.",
        code: `class Solution {
    static class Node {
        Node[] next = new Node[2];
    }

    private static final int BITS = 30;   // 2^31 - 1 fits in bits 30..0

    public int findMaximumXOR(int[] nums) {
        Node root = new Node();
        for (int num : nums) insert(root, num);

        int best = 0;
        for (int num : nums) best = Math.max(best, query(root, num));
        return best;
    }

    private void insert(Node root, int num) {
        Node cur = root;
        for (int b = BITS; b >= 0; b--) {
            int bit = (num >> b) & 1;
            if (cur.next[bit] == null) cur.next[bit] = new Node();
            cur = cur.next[bit];
        }
    }

    private int query(Node root, int num) {
        Node cur = root;
        int xor = 0;
        for (int b = BITS; b >= 0; b--) {
            int bit = (num >> b) & 1;
            int want = 1 - bit;                  // prefer the opposite bit
            if (cur.next[want] != null) {
                xor |= (1 << b);                 // this bit contributes a 1
                cur = cur.next[want];
            } else {
                cur = cur.next[bit];             // forced same bit, 0 here
            }
        }
        return xor;
    }
}`,
        walkthrough: [
          "Insert all of [3,10,5,25,2,8] as 31-bit paths.",
          "Query 5 (00101): greedily seek opposite bits; the trie offers 25 (11001) as the best opposite partner.",
          "5 XOR 25 = 11100b = 28, the global max.",
        ],
      },
    ],
    edgeCases: [
      "Single element → no valid pair; the loop never finds one, max stays 0 (problem guarantees n ≥ 2 for a meaningful answer, else 0).",
      "Duplicates → x XOR x = 0; harmless, the greedy still finds a better cross pair if one exists.",
      "Using 31 bits (bit 30 down) covers values up to 2³¹ − 1; values are non-negative so the sign bit is unused.",
    ],
    twists: [
      "**Maximum XOR with an element from array** (LeetCode 1707) → queries with an upper bound on the partner; sort + offline trie insertion.",
      "**Count pairs with XOR in a range** → augment trie nodes with subtree counts.",
      "**Single Number** (LeetCode 136) → a gentler XOR property: pairs cancel to 0.",
    ],
    related: ["implement-trie-prefix-tree", "single-number"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "interval-list-intersections",
    title: "Interval List Intersections",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 986,
    statement:
      "Given two lists of **closed** intervals `firstList` and `secondList`, each already sorted and pairwise-disjoint within its own list, return the **intersection** of the two lists — every interval that lies in both. The result is also a sorted list of disjoint intervals.",
    examples: [
      {
        in: "firstList = [[0,2],[5,10],[13,23],[24,25]], secondList = [[1,5],[8,12],[15,24],[25,26]]",
        out: "[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]",
      },
      { in: "firstList = [[1,3],[5,9]], secondList = []", out: "[]", note: "one list empty → no intersection" },
    ],
    constraints: ["0 ≤ list length ≤ 1000", "each list sorted, intervals within a list are disjoint", "0 ≤ start ≤ end ≤ 10⁹"],
    recognize:
      "Both lists are already **sorted and disjoint** — that screams **two-pointer merge**. Compare the front interval of each list, compute their overlap, then advance the pointer whose interval **ends first** (it can't possibly intersect any later interval of the other list).",
    figureItOut: [
      "Two intervals [a1,b1] and [a2,b2] overlap exactly on [max(a1,a2), min(b1,b2)]. If that low end is ≤ the high end, the overlap is a real interval; otherwise they don't touch.",
      "Since both lists are sorted, you don't need to compare every pair. Keep a pointer into each list and only ever compare the two current front intervals — like merging two sorted sequences.",
      "After computing (or skipping) the overlap of the two fronts, which pointer should advance? The interval that **ends earlier** is done — it cannot overlap anything further along in the other list, because everything ahead starts later. So advance the pointer of the smaller end.",
      "Repeat until either list is exhausted. Each step computes at most one intersection and advances one pointer, so it's a single linear pass over both lists combined.",
    ],
    approaches: [
      {
        name: "Two-pointer merge (optimal)",
        intuition: "Compare fronts, emit their overlap if any, advance the interval that ends first.",
        time: "O(m + n)",
        timeWhy: "Each interval from either list is visited at most once; one pointer always advances per step.",
        space: "O(1)",
        spaceWhy: "Only the two pointers (the output list is not counted as extra working space).",
        code: `int[][] intervalIntersection(int[][] firstList, int[][] secondList) {
    List<int[]> res = new ArrayList<>();
    int i = 0, j = 0;
    while (i < firstList.length && j < secondList.length) {
        int lo = Math.max(firstList[i][0], secondList[j][0]);
        int hi = Math.min(firstList[i][1], secondList[j][1]);
        if (lo <= hi) {
            res.add(new int[]{ lo, hi });        // real overlap
        }
        // advance whichever interval ends first
        if (firstList[i][1] < secondList[j][1]) i++;
        else j++;
    }
    return res.toArray(new int[res.size()][]);
}`,
        walkthrough: [
          "first[0]=[0,2], second[0]=[1,5]: overlap [1,2]. first ends 2<5 → i++.",
          "first[1]=[5,10] vs [1,5]: overlap [5,5]. second ends 5<10 → j++. [5,10] vs [8,12]: [8,10]; first ends 10<12 → i++.",
          "Continue → [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]].",
        ],
      },
    ],
    edgeCases: [
      "Either list empty → no intersections, return empty.",
      "Touching endpoints like [5,10] and [1,5] still intersect at the single point [5,5] because intervals are closed.",
      "Advancing the interval that ends first is essential — advancing the wrong one can skip a valid overlap.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → union (combine overlaps) within one list, not intersection across two.",
      "**Union of two interval lists** → similar two-pointer scan but you merge rather than intersect.",
      "**Employee Free Time** (LeetCode 759) → flatten all intervals, find the gaps between merged busy times.",
    ],
    related: ["merge-intervals", "insert-interval", "employee-free-time"],
  },

  {
    slug: "employee-free-time",
    title: "Employee Free Time",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 759,
    statement:
      "Each employee has a list of non-overlapping, sorted busy intervals. Given a list of all employees' schedules, return the list of **finite, common free-time** intervals for **all** employees, sorted. A free interval has positive length, and the infinite time before the first and after the last busy interval is excluded.",
    examples: [
      { in: "schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]]", out: "[[3,4]]", note: "everyone free only between 3 and 4" },
      { in: "schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]", out: "[[5,6],[7,9]]" },
    ],
    constraints: ["1 ≤ total intervals ≤ 5·10⁴", "0 ≤ start < end ≤ 10⁸", "each employee's intervals are sorted and disjoint"],
    recognize:
      "Common free time = the **gaps** left after you **merge every employee's busy intervals into one combined busy timeline**. So this is a classic **merge-intervals** problem: pool all intervals, sort by start, merge overlaps, and the spaces between merged blocks are the free intervals.",
    figureItOut: [
      "'Free for everyone' means a moment when **no** employee is busy. So if you imagine all the busy intervals from all employees drawn on one number line, the free times are precisely the gaps where the line is empty.",
      "The employee boundaries don't actually matter for finding gaps — a moment is busy if *anyone* is busy. So pool every interval from every employee into one big list, ignoring who owns each.",
      "Now sort all intervals by start time and **merge overlapping ones** (the standard merge-intervals routine): keep the current merged block, extend it when the next interval overlaps, otherwise close it and start a new one. This collapses the union of busy time into disjoint blocks.",
      "Between two consecutive merged busy blocks there is a gap exactly when the previous block's end is **strictly less than** the next block's start — that gap [prevEnd, nextStart] is a common free interval. Emit all such gaps. The unbounded time before the first and after the last block is excluded by construction.",
    ],
    approaches: [
      {
        name: "Heap-based k-way scan (alternative)",
        intuition: "Push the first interval of each employee into a min-heap by start; pop in order, tracking the furthest end; a gap opens when the next start exceeds it.",
        time: "O(N log k)",
        timeWhy: "N total intervals, each pushed/popped once from a heap of size k (number of employees).",
        space: "O(k)",
        spaceWhy: "The heap holds one interval per employee at a time.",
        code: `// Conceptual alternative: min-heap of [start, end, employee, index].
// Pop intervals in start order; keep 'prevEnd'. When the next popped
// start > prevEnd, [prevEnd, nextStart] is a free interval. Push the
// employee's following interval after each pop. Same gaps, k-way style.
`,
      },
      {
        name: "Pool, sort, merge, take gaps (optimal & simplest)",
        intuition: "Flatten all intervals, sort by start, merge overlaps, then collect the spaces between merged blocks.",
        time: "O(N log N)",
        timeWhy: "Sorting all N intervals dominates; the merge and gap scan are linear.",
        space: "O(N)",
        spaceWhy: "The flattened list of all intervals.",
        code: `// Assumes each schedule[i] is an int[][] of {start, end} intervals.
List<int[]> employeeFreeTime(int[][][] schedule) {
    List<int[]> all = new ArrayList<>();
    for (int[][] emp : schedule) {
        for (int[] iv : emp) all.add(iv);
    }
    all.sort((a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> free = new ArrayList<>();
    int prevEnd = all.get(0)[1];
    for (int i = 1; i < all.size(); i++) {
        int[] cur = all.get(i);
        if (cur[0] > prevEnd) {
            free.add(new int[]{ prevEnd, cur[0] });   // gap = common free time
            prevEnd = cur[1];
        } else {
            prevEnd = Math.max(prevEnd, cur[1]);      // overlap → extend busy block
        }
    }
    return free;
}`,
        walkthrough: [
          "schedule=[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]. Pool & sort: [1,3],[2,4],[2,5],[6,7],[9,12].",
          "Merge: [1,3]∪[2,4]∪[2,5] → busy [1,5], prevEnd=5. Next [6,7]: 6>5 → free [5,6]; prevEnd=7.",
          "Next [9,12]: 9>7 → free [7,9]; prevEnd=12. Result [[5,6],[7,9]].",
        ],
      },
    ],
    edgeCases: [
      "Fully overlapping schedules → no gaps, return empty.",
      "Use strict `>` for a gap: touching blocks like [1,5] and [5,8] leave no positive-length free time.",
      "The infinite free time before the first busy block and after the last is intentionally excluded — only finite interior gaps count.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → the merge step on its own.",
      "**Interval List Intersections** (LeetCode 986) → intersection of two lists rather than gaps across many.",
      "**Meeting Rooms II** (LeetCode 253) → the dual: count maximum simultaneous overlap instead of finding gaps.",
    ],
    related: ["merge-intervals", "interval-list-intersections", "meeting-rooms-ii"],
  },
];
