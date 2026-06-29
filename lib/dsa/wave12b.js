// NeetCode All + Top Interview — wave 12b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
export const WAVE12B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "minimum-absolute-difference-in-bst",
    title: "Minimum Absolute Difference in BST",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 530,
    statement:
      "Given the `root` of a Binary Search Tree, return the **minimum absolute difference** between the values of any two different nodes in the tree.",
    examples: [
      { in: "root = [4,2,6,1,3]", out: "1", note: "the closest pair is 3 and 4 (or 1 and 2, or 2 and 3), difference 1" },
      { in: "root = [1,0,48,null,null,12,49]", out: "1", note: "0 and 1 differ by 1, the smallest gap" },
    ],
    constraints: ["2 ≤ number of nodes ≤ 10⁴", "0 ≤ Node.val ≤ 10⁵"],
    recognize:
      "The phrase 'smallest difference between any two values in a BST' should immediately trigger **inorder traversal**: a BST visited inorder yields its values in **sorted order**, and in a sorted sequence the closest pair is always two ADJACENT elements. So the answer is the minimum gap between consecutive inorder values.",
    figureItOut: [
      "Brute force would compare every pair of node values, which is O(n squared). But the closest two values in any set, once sorted, must be adjacent — no non-adjacent pair can be closer than the tightest neighboring pair. So I only need to look at consecutive values in sorted order.",
      "How do I get the BST values in sorted order without an explicit sort? That is exactly what an inorder traversal does: visit left subtree, then the node, then right subtree. The BST invariant (left < node < right) guarantees this emits values ascending.",
      "So the plan is: traverse inorder, and as I visit each node compare it to the PREVIOUS node I visited. The difference between the current value and the previous value is one adjacent gap; track the minimum of these gaps.",
      "I need to remember the previously visited value across recursive calls. Keep a `prev` field (a node or an Integer) that updates to the current node right after I use it. Initialize the answer to a large value, and the first node has no predecessor so just record it as prev without computing a gap.",
    ],
    approaches: [
      {
        name: "Brute force all pairs (baseline)",
        intuition: "Collect all values, then compare every pair for the smallest difference.",
        time: "O(n²)",
        timeWhy: "Comparing all pairs of n values.",
        space: "O(n)",
        spaceWhy: "Storing every value in a list.",
        code: `class Solution {
    public int getMinimumDifference(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        collect(root, vals);
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < vals.size(); i++)
            for (int j = i + 1; j < vals.size(); j++)
                best = Math.min(best, Math.abs(vals.get(i) - vals.get(j)));
        return best;
    }

    void collect(TreeNode node, List<Integer> vals) {
        if (node == null) return;
        vals.add(node.val);
        collect(node.left, vals);
        collect(node.right, vals);
    }
}`,
      },
      {
        name: "Inorder traversal comparing adjacent values (optimal)",
        intuition: "Inorder yields sorted values; the answer is the smallest gap between consecutive ones.",
        time: "O(n)",
        timeWhy: "Each node is visited exactly once during inorder traversal.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to tree height h (O(n) for a skewed tree).",
        code: `class Solution {
    private Integer prev = null;
    private int best = Integer.MAX_VALUE;

    public int getMinimumDifference(TreeNode root) {
        inorder(root);
        return best;
    }

    void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        if (prev != null) best = Math.min(best, node.val - prev);  // adjacent gap
        prev = node.val;                                           // become the predecessor
        inorder(node.right);
    }
}`,
        walkthrough: [
          "root=[4,2,6,1,3]. Inorder order of values: 1, 2, 3, 4, 6.",
          "Gaps between consecutive values: 2-1=1, 3-2=1, 4-3=1, 6-4=2.",
          "Minimum gap is 1, so the answer is 1.",
        ],
      },
    ],
    edgeCases: [
      "Exactly two nodes → only one gap exists; it is the answer.",
      "Duplicate-free guarantee from BST values means gaps are positive; the smallest could still be tiny.",
      "Skewed tree (a sorted chain) → inorder still walks values ascending; recursion depth is O(n).",
    ],
    twists: [
      "**Minimum Distance Between BST Nodes** (LeetCode 783) → identical problem, different name.",
      "**Find Mode in Binary Search Tree** (LeetCode 501) → same inorder-with-prev technique to detect runs of equal values.",
      "**Unsorted input** → without the BST/sorted structure you would sort first (O(n log n)) then scan adjacent pairs.",
    ],
    related: ["find-mode-in-binary-search-tree", "kth-smallest-element-in-a-bst", "validate-binary-search-tree"],
  },

  {
    slug: "find-mode-in-binary-search-tree",
    title: "Find Mode in Binary Search Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 501,
    statement:
      "Given the `root` of a BST that **may contain duplicate values**, return all the **mode(s)** (the most frequently occurring value(s)). If the tree has more than one mode, return them in any order. A BST here allows `node.left.val <= node.val` and `node.val <= node.right.val`.",
    examples: [
      { in: "root = [1,null,2,2]", out: "[2]", note: "2 appears twice, 1 once, so the mode is 2" },
      { in: "root = [0]", out: "[0]" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "−10⁵ ≤ Node.val ≤ 10⁵", "follow-up: can you do it without extra space (ignoring the recursion stack)?"],
    recognize:
      "Duplicates allowed plus BST plus 'most frequent value' → **inorder traversal groups equal values together** because inorder is sorted. So equal values form consecutive runs; count each run's length and keep the value(s) whose run is longest. No hash map needed.",
    figureItOut: [
      "A hash-map count of every value would work but uses O(n) extra space. The follow-up asks for no extra space, which is a hint that the BST structure already does the grouping for me.",
      "Inorder traversal of a BST emits values in sorted (non-decreasing) order. That means all copies of the same value appear CONSECUTIVELY — a duplicate value cannot be split apart by a different value. So I can count frequencies by tracking runs of equal adjacent values.",
      "Keep a running `count` of how many times the current value has appeared in a row and the `maxCount` seen so far. When the current node equals the previous value, increment count; otherwise reset count to 1. Compare count to maxCount each step.",
      "To collect ALL modes in a single pass: when count exceeds maxCount, clear the result list and start it fresh with this value; when count equals maxCount, append this value as a tie. This two-rule update naturally keeps exactly the value(s) at the maximum frequency.",
    ],
    approaches: [
      {
        name: "Inorder with run counting, two passes (clean)",
        intuition: "Inorder groups equal values; first pass finds maxCount, second pass collects all values hitting it.",
        time: "O(n)",
        timeWhy: "Two inorder traversals, each visiting every node once.",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h; no frequency map.",
        code: `class Solution {
    private int prev, count = 0, maxCount = 0;
    private boolean hasPrev = false;
    private List<Integer> modes = new ArrayList<>();
    private boolean collecting = false;

    public int[] findMode(TreeNode root) {
        inorder(root);                 // pass 1: compute maxCount
        collecting = true;
        count = 0; hasPrev = false;
        inorder(root);                 // pass 2: gather values reaching maxCount
        int[] ans = new int[modes.size()];
        for (int i = 0; i < ans.length; i++) ans[i] = modes.get(i);
        return ans;
    }

    void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        if (hasPrev && node.val == prev) count++;
        else count = 1;
        prev = node.val; hasPrev = true;
        if (collecting) {
            if (count == maxCount) modes.add(node.val);
        } else {
            maxCount = Math.max(maxCount, count);
        }
        inorder(node.right);
    }
}`,
      },
      {
        name: "Single-pass inorder collecting modes on the fly (optimal)",
        intuition: "Track run count; reset the mode list when a longer run appears, append on ties.",
        time: "O(n)",
        timeWhy: "One inorder traversal; each node processed once.",
        space: "O(h)",
        spaceWhy: "Recursion stack only; the result list holds just the modes.",
        code: `class Solution {
    private int prev, count = 0, maxCount = 0;
    private boolean hasPrev = false;
    private List<Integer> modes = new ArrayList<>();

    public int[] findMode(TreeNode root) {
        inorder(root);
        int[] ans = new int[modes.size()];
        for (int i = 0; i < ans.length; i++) ans[i] = modes.get(i);
        return ans;
    }

    void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        if (hasPrev && node.val == prev) count++;
        else count = 1;
        if (count > maxCount) {        // strictly longer run: new sole mode
            maxCount = count;
            modes.clear();
            modes.add(node.val);
        } else if (count == maxCount) {// tie: another mode
            modes.add(node.val);
        }
        prev = node.val; hasPrev = true;
        inorder(node.right);
    }
}`,
        walkthrough: [
          "root=[1,null,2,2]. Inorder values: 1, 2, 2.",
          "Visit 1: count=1 > maxCount 0 → maxCount=1, modes=[1]. Visit 2: differs, count=1 == maxCount → modes=[1,2].",
          "Visit 2 again: equals prev, count=2 > maxCount 1 → maxCount=2, modes cleared then =[2]. Answer [2].",
        ],
      },
    ],
    edgeCases: [
      "All values distinct → every value has count 1; all values are modes (every value ties at frequency 1).",
      "Single node → that value is the only mode.",
      "Many duplicates of two different values tying → both are returned.",
    ],
    twists: [
      "**Minimum Absolute Difference in BST** (LeetCode 530) → same inorder-with-prev idea, comparing adjacent gaps instead of counting runs.",
      "**Without the no-extra-space constraint** → a HashMap<Integer,Integer> count then a max scan is simpler but O(n) space.",
      "**Morris traversal** → achieves true O(1) extra space by threading temporary links instead of recursion.",
    ],
    related: ["minimum-absolute-difference-in-bst", "kth-smallest-element-in-a-bst", "binary-tree-inorder-traversal"],
  },

  {
    slug: "average-of-levels-in-binary-tree",
    title: "Average of Levels in Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 637,
    statement:
      "Given the `root` of a binary tree, return the **average value of the nodes on each level**, as an array from the top level down. Answers within 10⁻⁵ of the actual value are accepted.",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "[3.00000,14.50000,11.00000]", note: "levels are [3], [9,20] avg 14.5, [15,7] avg 11" },
      { in: "root = [3,9,20,15,7]", out: "[3.00000,14.50000,11.00000]" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "−2³¹ ≤ Node.val ≤ 2³¹ − 1"],
    recognize:
      "'One number per level, top to bottom' is the hallmark of **BFS level-order traversal**: process the tree level by level with a queue, summing each level's values and dividing by its node count. The queue's current size tells you exactly how many nodes are on the level.",
    figureItOut: [
      "I need one average per depth level, so I must process the tree level by level rather than node by node. Breadth-first search with a queue does exactly that: it visits all nodes at depth d before any node at depth d+1.",
      "The standard trick: at the start of each loop iteration, the queue holds precisely the nodes of the current level. Record `size = queue.size()` BEFORE dequeuing, then dequeue exactly that many nodes — those are this level's nodes — while enqueuing their children for the next level.",
      "While draining the level, accumulate the sum of values and divide by `size` at the end to get the average. Use a `long` (or double) for the sum because node values can be near the int limit and a level could have many of them, risking int overflow.",
      "Append each level's average to the result list. Because BFS naturally goes top-down, the averages come out in the required top-to-bottom order with no reversing needed.",
    ],
    approaches: [
      {
        name: "BFS level-order with per-level averaging (optimal)",
        intuition: "Drain each level using the queue's size, sum its values, divide by the count.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued exactly once.",
        space: "O(w)",
        spaceWhy: "The queue holds at most one full level (up to ~n/2 nodes) at a time.",
        code: `List<Double> averageOfLevels(TreeNode root) {
    List<Double> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();          // nodes on this level
        long sum = 0;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            sum += node.val;              // long avoids int overflow
            if (node.left  != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        res.add((double) sum / size);     // level average
    }
    return res;
}`,
        walkthrough: [
          "root=[3,9,20,null,null,15,7]. Level 0: [3], sum 3, avg 3.0; enqueue 9,20.",
          "Level 1: [9,20], sum 29, avg 14.5; enqueue 15,7.",
          "Level 2: [15,7], sum 22, avg 11.0. Result [3.0, 14.5, 11.0].",
        ],
      },
    ],
    edgeCases: [
      "Single node → one level whose average is the node value itself.",
      "Values near Integer.MAX_VALUE → summing in a long prevents overflow before the division.",
      "Skewed tree → each level has one node; every average equals that node's value.",
    ],
    twists: [
      "**Binary Tree Level Order Traversal** (LeetCode 102) → keep the full list per level instead of reducing to an average.",
      "**Maximum Level Sum of a Binary Tree** (LeetCode 1161) → track the level with the largest sum rather than the average.",
      "**DFS alternative** → recurse with a depth index, accumulating sum and count per depth in arrays, then average at the end.",
    ],
    related: ["binary-tree-level-order-traversal", "binary-tree-level-order-traversal-ii", "binary-tree-right-side-view"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "remove-duplicates-from-sorted-list-ii",
    title: "Remove Duplicates from Sorted List II",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 82,
    statement:
      "Given the `head` of a **sorted** linked list, delete **all** nodes that have duplicate numbers, leaving only nodes that appear exactly once in the original list. Return the linked list, still sorted.",
    examples: [
      { in: "head = [1,2,3,3,4,4,5]", out: "[1,2,5]", note: "3 and 4 each appear twice, so both are removed entirely" },
      { in: "head = [1,1,1,2,3]", out: "[2,3]", note: "all three 1s are removed" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 300", "−100 ≤ Node.val ≤ 100", "the list is sorted in ascending order"],
    recognize:
      "Delete EVERY copy of any value that repeats (not just the extras) → because the list is sorted, equal values are **adjacent runs**. Use a **dummy head** so even the first node can be dropped, and a `prev` pointer that only advances over values confirmed to be unique.",
    figureItOut: [
      "This differs from the classic 'remove duplicates' which keeps one copy. Here, if a value appears more than once, ALL its copies must go. Since the list is sorted, every group of equal values sits together as a contiguous run, so I can detect a run by checking node.val == node.next.val.",
      "The tricky part: deleting the FIRST node is possible (e.g. [1,1,1,2,3] → [2,3]). When the head itself might be removed, the standard fix is a dummy node placed before head, so I always have a stable predecessor to rewire from.",
      "Walk with a `prev` pointer (starting at dummy) and a `cur` pointer scanning forward. When cur starts a run of duplicates, skip the whole run: advance cur until cur.val differs from the run's value, then set prev.next = cur to splice out the entire run. Crucially, prev does NOT move here because the run is gone.",
      "When cur is a singleton (cur.val != cur.next.val, or cur.next is null), it survives: advance prev = cur. Either way move cur = cur.next. At the end return dummy.next, which correctly reflects a possibly-changed head.",
    ],
    approaches: [
      {
        name: "Dummy head with skip-the-run pointer (optimal)",
        intuition: "Use a dummy so the head can be dropped; when cur begins a duplicate run, skip the whole run and link prev past it.",
        time: "O(n)",
        timeWhy: "Each node is examined once in a single forward pass.",
        space: "O(1)",
        spaceWhy: "Only a few pointers; the list is rewired in place.",
        code: `ListNode deleteDuplicates(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    ListNode cur = head;
    while (cur != null) {
        // detect a run of equal values
        if (cur.next != null && cur.val == cur.next.val) {
            int dup = cur.val;
            while (cur != null && cur.val == dup) cur = cur.next;  // skip the whole run
            prev.next = cur;     // splice out every copy; prev stays put
        } else {
            prev = cur;          // unique node survives; advance prev
            cur = cur.next;
        }
    }
    return dummy.next;
}`,
        walkthrough: [
          "head=[1,2,3,3,4,4,5], dummy→1. cur=1 singleton → prev=1, cur=2. cur=2 singleton → prev=2, cur=3.",
          "cur=3, 3==3 → skip both 3s, cur=4, prev(2).next=4. cur=4, 4==4 → skip both 4s, cur=5, prev(2).next=5.",
          "cur=5 singleton → prev=5, cur=null. Return dummy.next = [1,2,5].",
        ],
      },
    ],
    edgeCases: [
      "Empty list → return null (dummy.next is null).",
      "Entire list is one repeated value like [1,1,1] → everything removed, return null.",
      "Duplicates at the head → the dummy lets prev.next bypass them so the head changes correctly.",
    ],
    twists: [
      "**Remove Duplicates from Sorted List** (LeetCode 83) → keep ONE copy of each value; no dummy needed since the head always survives.",
      "**Remove Linked List Elements** (LeetCode 203) → delete by a target value rather than by duplication.",
      "**Unsorted list** → equal values are no longer adjacent; you would first count occurrences with a hash map.",
    ],
    related: ["remove-duplicates-from-sorted-list", "remove-linked-list-elements", "partition-list"],
  },

  {
    slug: "swapping-nodes-in-a-linked-list",
    title: "Swapping Nodes in a Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 1721,
    statement:
      "You are given the `head` of a linked list and an integer `k`. **Swap the values** of the k-th node from the beginning and the k-th node from the end (1-indexed), and return the head.",
    examples: [
      { in: "head = [1,2,3,4,5], k = 2", out: "[1,4,3,2,5]", note: "2nd from start is 2, 2nd from end is 4; swap their values" },
      { in: "head = [7,9,6,6,7,8,3,0,9,5], k = 5", out: "[7,9,6,6,8,7,3,0,9,5]" },
    ],
    constraints: ["number of nodes is n", "1 ≤ k ≤ n ≤ 10⁵", "0 ≤ Node.val ≤ 100"],
    recognize:
      "Find the k-th node from the front AND the k-th from the end in a singly linked list. The k-th from the end is the classic **two-pointer gap** trick: advance a lead pointer k steps, then move both pointers together until the lead falls off — the trailing pointer lands on the k-th-from-end node. One pass, no length needed.",
    figureItOut: [
      "I need two specific nodes. The k-th from the front is easy: walk k-1 steps from head. The k-th from the end is the interesting one — in a singly linked list I cannot walk backward, and I want to avoid a separate pass just to measure the length.",
      "The two-pointer gap technique solves k-th-from-end in one pass. Send a lead pointer ahead by exactly k nodes. Now the lead is k nodes in front of head. If I advance lead and a trailing pointer (starting at head) together until lead reaches the end (null), the trailing pointer will have stopped exactly k nodes from the end.",
      "Why does that hold? When lead is k ahead and then both move the same number of steps until lead hits null, the trailing pointer is always k behind lead — and being k behind the end position is precisely the k-th node from the end.",
      "Conveniently, while sending lead forward k steps I pass through the k-th node from the front (it is the node lead points at after k-1 advances). So I can capture the front node during that same initial walk, then run the synchronized walk for the end node. Finally just swap the two nodes' VALUES — no pointer rewiring required.",
    ],
    approaches: [
      {
        name: "Single-pass two-pointer gap, swap values (optimal)",
        intuition: "Advance a lead pointer k steps (capturing the k-th front node), then move lead and a trailing pointer together until lead ends; trailing is the k-th from end.",
        time: "O(n)",
        timeWhy: "A single forward pass over the list.",
        space: "O(1)",
        spaceWhy: "Only a handful of pointers.",
        code: `ListNode swapNodes(ListNode head, int k) {
    ListNode front = head;
    for (int i = 1; i < k; i++) front = front.next;   // k-th node from the start

    ListNode lead = front;        // lead is currently k-1 ahead; push it to the end
    ListNode end = head;          // will become k-th from the end
    while (lead.next != null) {
        lead = lead.next;
        end  = end.next;          // stays k-1 behind lead
    }

    int tmp = front.val;          // swap the two node values
    front.val = end.val;
    end.val = tmp;
    return head;
}`,
        walkthrough: [
          "head=[1,2,3,4,5], k=2. Walk front k-1=1 step → front=node(2).",
          "lead starts at node(2); end starts at node(1). Move both until lead.next null: lead 2→3→4→5, end 1→2→3→4. end=node(4).",
          "Swap front.val(2) and end.val(4) → list [1,4,3,2,5].",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → swap the first and last node values.",
      "The two target nodes are the same node (e.g. odd-length list, k = middle) → swapping a value with itself is harmless.",
      "Two-node list with k = 1 or 2 → front and end are the two endpoints; values swap correctly.",
    ],
    twists: [
      "**Remove Nth Node From End of List** (LeetCode 19) → the same gap trick, but to delete the node rather than read its value.",
      "**Swap Nodes in Pairs** (LeetCode 24) → swap actual node links rather than just values.",
      "**Swap the nodes, not the values** → requires rewiring four neighbor pointers and careful handling when the nodes are adjacent.",
    ],
    related: ["remove-nth-node-from-end-of-list", "swap-nodes-in-pairs", "middle-of-the-linked-list"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "the-k-weakest-rows-in-a-matrix",
    title: "The K Weakest Rows in a Matrix",
    difficulty: "Easy",
    pattern: "heaps",
    leetcode: 1337,
    statement:
      "Given a binary `mat` of m rows and n columns where each row's 1s (soldiers) come before its 0s (civilians), return the indices of the `k` **weakest** rows, ordered from weakest to strongest. Row i is weaker than row j if it has fewer soldiers, or an equal number of soldiers but a smaller index.",
    examples: [
      {
        in: "mat = [[1,1,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,1,0,0,0]], k = 3",
        out: "[2,0,3]",
        note: "soldier counts are [2,4,1,2]; weakest three by (count,index) are row 2 (1), row 0 (2), row 3 (2)",
      },
      { in: "mat = [[1,0,0,0],[1,1,1,1],[1,0,0,0],[1,0,0,0]], k = 2", out: "[0,2]" },
    ],
    constraints: ["m == mat.length, n == mat[i].length", "2 ≤ n, m ≤ 100", "1 ≤ k ≤ m", "each row's 1s precede its 0s"],
    recognize:
      "Select the k smallest by a compound key (soldier count, then index) → a **heap** of size k. Use a **max-heap** keyed on (count, index) holding only the k weakest seen so far: push each row, and once the heap exceeds k pop the strongest, leaving the k weakest. Sort those k at the end for weak-to-strong order.",
    figureItOut: [
      "The strength of a row is its number of 1s. Because each row's 1s come before its 0s, I can count soldiers with a binary search for the first 0, but a simple linear count is also fine for these small bounds.",
      "I want the k weakest rows by the key (soldierCount, rowIndex), smaller is weaker. 'Pick the k smallest by a key' is the textbook job for a fixed-size **max-heap**: keep at most k elements, and whenever a (k+1)-th arrives, evict the current largest (strongest), so the heap always retains the k weakest seen so far.",
      "Encode each row as a pair [count, index]. The heap comparator must order 'strongest' on top: larger count is stronger, and on equal counts a larger index is stronger. So the max-heap pops the row with the biggest (count, index) when it overflows.",
      "After processing all rows the heap holds exactly the k weakest, but in heap order, not sorted. Drain it and sort the k pairs ascending by (count, index) — equivalently, pop all and reverse — to emit indices weakest first.",
    ],
    approaches: [
      {
        name: "Fixed-size max-heap of (count, index) (optimal)",
        intuition: "Keep the k weakest in a max-heap keyed by (count,index); evict the strongest when size exceeds k; sort the survivors.",
        time: "O(m·(n + log k) + k log k)",
        timeWhy: "Counting soldiers per row is O(n) (or O(log n) with binary search); each of m rows does O(log k) heap work; the final sort is O(k log k).",
        space: "O(k)",
        spaceWhy: "The heap holds at most k rows.",
        code: `int[] kWeakestRows(int[][] mat, int k) {
    // max-heap: strongest on top -> larger count, or equal count & larger index
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) ->
        a[0] != b[0] ? b[0] - a[0] : b[1] - a[1]);

    for (int i = 0; i < mat.length; i++) {
        int count = 0;
        for (int v : mat[i]) count += v;     // soldiers in row i
        heap.offer(new int[]{ count, i });
        if (heap.size() > k) heap.poll();     // drop the strongest, keep k weakest
    }

    int[] res = new int[k];
    for (int i = k - 1; i >= 0; i--) res[i] = heap.poll()[1];  // pop strongest-first -> fill from back
    return res;
}`,
        walkthrough: [
          "Counts: row0=2, row1=4, row2=1, row3=2. k=3. Push [2,0],[4,1]; push [1,2] (size 3).",
          "Push [2,3] → size 4 > 3, pop strongest [4,1]. Heap holds [2,0],[1,2],[2,3].",
          "Pop strongest-first: [2,3]→res[2]=3, [2,0]→res[1]=0, [1,2]→res[0]=2. Result [2,0,3].",
        ],
      },
    ],
    edgeCases: [
      "All rows have the same soldier count → ties break by index, so the lowest indices are weakest.",
      "k equals m → return every row index sorted weak-to-strong.",
      "A fully-1 row → it is the strongest possible and only survives if k is large.",
    ],
    twists: [
      "**Binary search the soldier count** → since 1s precede 0s, find the first 0 in O(log n) instead of counting linearly.",
      "**Kth Largest Element in an Array** (LeetCode 215) → same fixed-size-heap selection idea on raw values.",
      "**K Closest Points to Origin** (LeetCode 973) → the k smallest by distance, an identical max-heap-of-size-k pattern.",
    ],
    related: ["kth-largest-element-in-an-array", "k-closest-points-to-origin", "top-k-frequent-elements"],
  },

  {
    slug: "take-gifts-from-the-richest-pile",
    title: "Take Gifts From the Richest Pile",
    difficulty: "Easy",
    pattern: "heaps",
    leetcode: 2558,
    statement:
      "You are given an integer array `gifts` of pile sizes and an integer `k`. Repeat `k` times: choose the pile with the **maximum** number of gifts, then leave only the **floor of its square root** behind (the rest vanish). Return the total number of gifts remaining across all piles after k turns.",
    examples: [
      {
        in: "gifts = [25,64,9,4,100], k = 4",
        out: "29",
        note: "take from 100→10, 64→8, 25→5, then max is 10→3; piles become [5,8,3,4,3], sum 29... see walkthrough",
      },
      { in: "gifts = [1,1,1,1], k = 4", out: "4", note: "sqrt of 1 is 1, so nothing ever shrinks; sum stays 4" },
    ],
    constraints: ["1 ≤ gifts.length ≤ 10³", "1 ≤ gifts[i] ≤ 10⁹", "1 ≤ k ≤ 10³"],
    recognize:
      "Each turn you must grab the CURRENT maximum, replace it, and repeat — 'repeatedly extract the max and reinsert a changed value' is exactly a **max-heap**. Pop the largest, push floor(sqrt) back, do it k times, then sum what is left in the heap.",
    figureItOut: [
      "Every turn I need the pile that is currently the largest, then I shrink it and the relative order may change. Re-scanning the whole array for the max each turn is O(n) per turn; a heap gives me the max in O(log n) and lets me reinsert the shrunken value efficiently.",
      "A **max-heap** (priority queue ordered largest-first) is the natural fit: its top is always the current maximum. Each turn: poll the top, compute floor(sqrt(top)), and offer that value back in. After k such turns the heap contains the final pile sizes.",
      "Watch the magnitude: gift counts go up to 10⁹, which fits in int, but be careful with sqrt — compute (long) Math.sqrt(value) or use Math.floor and cast, ensuring you take the floor (e.g. sqrt of 64 is exactly 8, sqrt of 100 is 10). Summing up to 1000 piles of up to 10⁹ needs a long accumulator to avoid overflow.",
      "After k turns, drain the heap (or iterate it) and add up the remaining values into a long. That total is the answer. If a pile is 1, its sqrt-floor is 1, so it never shrinks — the loop still runs but those turns are no-ops in effect.",
    ],
    approaches: [
      {
        name: "Max-heap, pop-shrink-push k times (optimal)",
        intuition: "Keep piles in a max-heap; each turn replace the top with floor(sqrt(top)); sum what remains.",
        time: "O(n + k log n)",
        timeWhy: "Heapifying n piles is O(n); each of k turns does an O(log n) pop and push.",
        space: "O(n)",
        spaceWhy: "The heap stores all n piles.",
        code: `long pickGifts(int[] gifts, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int g : gifts) heap.offer(g);

    for (int turn = 0; turn < k; turn++) {
        int top = heap.poll();                 // current richest pile
        heap.offer((int) Math.sqrt(top));      // leave floor(sqrt) behind
    }

    long total = 0;
    while (!heap.isEmpty()) total += heap.poll();   // sum the survivors
    return total;
}`,
        walkthrough: [
          "gifts=[25,64,9,4,100], k=4. Turn 1: max 100 → push 10. Turn 2: max 64 → push 8.",
          "Turn 3: max 25 → push 5. Turn 4: max is now 10 → push 3. Heap holds {9,4,8,5,3}.",
          "Sum 9+4+8+5+3 = 29.",
        ],
      },
    ],
    edgeCases: [
      "All piles equal to 1 → sqrt of 1 is 1, so the sum never changes regardless of k.",
      "Large values up to 10⁹ → use a long for the final sum to avoid int overflow.",
      "k larger than needed → extra turns keep shrinking the (now small) max, but the loop is fixed at k iterations.",
    ],
    twists: [
      "**Last Stone Weight** (LeetCode 1046) → repeatedly pop the two largest and push their difference, another pop-modify-push heap loop.",
      "**Maximal Score After Applying K Operations** (LeetCode 2530) → pop the max, add it to a score, push ceil(max/3).",
      "**Minimum after k turns** → a symmetric problem would use a min-heap instead.",
    ],
    related: ["last-stone-weight", "maximal-score-after-applying-k-operations", "kth-largest-element-in-an-array"],
  },

  {
    slug: "maximal-score-after-applying-k-operations",
    title: "Maximal Score After Applying K Operations",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 2530,
    statement:
      "You start with `score = 0` and an integer array `nums`. Apply exactly `k` operations: each operation picks an index i, adds `nums[i]` to the score, then replaces `nums[i]` with `ceil(nums[i] / 3)`. Return the **maximum possible score** after k operations.",
    examples: [
      {
        in: "nums = [10,10,10,10,10], k = 5",
        out: "50",
        note: "take each 10 once: 5 × 10 = 50",
      },
      {
        in: "nums = [1,10,3,3,3], k = 3",
        out: "17",
        note: "take 10 (→4), take 4 (→2), take 3 (→1): 10+4+3 = 17",
      },
    ],
    constraints: ["1 ≤ nums.length, k ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁹"],
    recognize:
      "To maximize a sum over k greedy picks, you always want the **largest available value each step** — and that value changes after you reduce it, so you must reinsert. 'Always take the current max, then push back a modified value' is a textbook **max-heap** loop.",
    figureItOut: [
      "I want the biggest total over k picks. A greedy exchange argument says: at every single operation, taking the current maximum is optimal, because any value I take now is at least as large as it will ever be again (dividing by 3 only shrinks it), so deferring a large value never helps.",
      "But after I take the maximum and replace it with ceil(value/3), the set of available values changes and a different element may now be largest. So I need a structure that always gives me the current maximum and lets me reinsert the reduced value — a **max-heap**.",
      "Each operation: poll the top (the largest), add it to the score, then push ceil(top/3) back. Integer ceiling of top/3 is (top + 2) / 3 in integer arithmetic. Repeat exactly k times.",
      "Magnitude care: nums[i] up to 10⁹ and k up to 10⁵ means the score can reach ~10¹⁴, far beyond int range, so accumulate the score in a long. Each value still fits in int, but the running sum must be long.",
    ],
    approaches: [
      {
        name: "Greedy with a max-heap (optimal)",
        intuition: "Each step take the heap's max into the score, then push back ceil(max/3).",
        time: "O(n + k log n)",
        timeWhy: "Building the heap is O(n); each of k operations does an O(log n) pop and push.",
        space: "O(n)",
        spaceWhy: "The heap holds all n values.",
        code: `long maxKelements(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int v : nums) heap.offer(v);

    long score = 0;
    for (int op = 0; op < k; op++) {
        int top = heap.poll();          // current maximum
        score += top;                   // add to score (long avoids overflow)
        heap.offer((top + 2) / 3);      // ceil(top/3) pushed back
    }
    return score;
}`,
        walkthrough: [
          "nums=[1,10,3,3,3], k=3. Op1: max 10 → score 10, push ceil(10/3)=4. Heap {1,4,3,3,3}.",
          "Op2: max 4 → score 14, push ceil(4/3)=2. Heap {1,2,3,3,3}.",
          "Op3: max 3 → score 17, push ceil(3/3)=1. Final score 17.",
        ],
      },
    ],
    edgeCases: [
      "Value of 1 → ceil(1/3) = 1, so it stays 1; taking it repeatedly adds 1 each time.",
      "k exceeds the count of distinct large values → after big values shrink, you keep taking the (now smaller) current max.",
      "Score can exceed int range (~10¹⁴) → the long accumulator is essential.",
    ],
    twists: [
      "**Take Gifts From the Richest Pile** (LeetCode 2558) → same pop-modify-push loop but minimizing remaining sum with sqrt instead.",
      "**IPO** (LeetCode 502) → greedy max-heap selection of the most profitable affordable project.",
      "**Minimize instead** → a min-heap variant would target the smallest total or smallest residual.",
    ],
    related: ["take-gifts-from-the-richest-pile", "last-stone-weight", "ipo"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "camelcase-matching",
    title: "Camelcase Matching",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 1023,
    statement:
      "Given an array of `queries` and a string `pattern`, return a boolean array where the i-th entry is true if `queries[i]` **matches** `pattern`. A query matches if you can insert lowercase letters into the pattern (anywhere, any number, including none) to make it equal the query. Uppercase letters in the query must be matched exactly and in order.",
    examples: [
      {
        in: 'queries = ["FooBar","FooBarTest","FootBall","FrameBuffer","ForceFeedBack"], pattern = "FB"',
        out: "[true,false,true,true,false]",
        note: '"FooBar" = F + "oo" + B + "ar"; "FooBarTest" has an extra uppercase T not in the pattern → false',
      },
    ],
    constraints: ["1 ≤ queries.length ≤ 100", "1 ≤ queries[i].length, pattern.length ≤ 100", "queries[i] and pattern consist of upper and lowercase English letters"],
    recognize:
      "Match many queries against one pattern where you may only insert lowercase letters → a **subsequence-with-constraints** check, naturally organized as a **trie** of the pattern (or a direct two-pointer scan). The pattern is a subsequence of the query AND every uppercase letter in the query must come from the pattern.",
    figureItOut: [
      "What does 'insert lowercase letters into the pattern to get the query' really mean? The pattern must appear inside the query as a subsequence (same characters in the same order), and the only EXTRA characters allowed in the query are lowercase. If the query has an uppercase letter that the pattern does not account for, it can never have been inserted, so it fails.",
      "So matching is a two-condition subsequence walk. Use a pointer j into the pattern and scan the query character by character with pointer i. When query[i] equals pattern[j], they line up — advance both. When they differ, query[i] is an inserted character and MUST be lowercase; if it is uppercase, return false.",
      "After scanning the whole query, the match succeeds only if I consumed the ENTIRE pattern (j reached pattern.length). Leftover uppercase letters in the pattern that the query never provided mean failure.",
      "The trie framing builds one trie from the pattern (a single path, since the pattern is one string), then walks each query down it: matching characters descend the trie, lowercase non-matches are skipped in place, and an uppercase non-match (no edge to follow) rejects. A query matches if it ends at the trie's terminal node. With one pattern the trie is just a path, so the two-pointer scan is the same logic without the node overhead.",
    ],
    approaches: [
      {
        name: "Two-pointer subsequence with uppercase guard (optimal, trie-equivalent)",
        intuition: "Walk the query; matched chars consume the pattern; extra chars must be lowercase; the full pattern must be consumed.",
        time: "O(Σ |query|)",
        timeWhy: "Each query is scanned once, character by character.",
        space: "O(1)",
        spaceWhy: "Two index pointers per query beyond the output array.",
        code: `class Solution {
    public List<Boolean> camelMatch(String[] queries, String pattern) {
        List<Boolean> res = new ArrayList<>();
        for (String q : queries) res.add(matches(q, pattern));
        return res;
    }

    boolean matches(String q, String p) {
        int j = 0;                       // pointer into pattern
        for (int i = 0; i < q.length(); i++) {
            char c = q.charAt(i);
            if (j < p.length() && c == p.charAt(j)) {
                j++;                     // consume a pattern character
            } else if (Character.isUpperCase(c)) {
                return false;            // an uppercase letter not in the pattern
            }
            // else: a lowercase insertion, just skip it
        }
        return j == p.length();          // entire pattern must be matched
    }
}`,
        walkthrough: [
          'pattern="FB". query="FooBar": F matches F (j=1), o,o lowercase skip, B matches B (j=2), a,r lowercase skip. j==2==len → true.',
          'query="FooBarTest": ... matches through B (j=2), then T is uppercase and not in pattern → false.',
          'query="ForceFeedBack": F matches (j=1), then F (uppercase) at index 5 is not B → false.',
        ],
      },
    ],
    edgeCases: [
      "Query equals the pattern exactly → matches with zero insertions.",
      "Pattern longer than the query, or an uppercase in the pattern the query lacks → j never reaches the end → false.",
      "Query has trailing lowercase letters after the pattern is consumed → still true (they are valid insertions).",
    ],
    twists: [
      "**Is Subsequence** (LeetCode 392) → the plain subsequence check without the uppercase-insertion restriction.",
      "**Implement Trie** (LeetCode 208) → the trie machinery this generalizes to when there are many patterns.",
      "**Multiple patterns** → build a real trie of all patterns and walk each query down it once.",
    ],
    related: ["is-subsequence", "implement-trie-prefix-tree", "longest-word-in-dictionary"],
  },

  {
    slug: "design-search-autocomplete-system",
    title: "Design Search Autocomplete System",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 642,
    statement:
      "Design an autocomplete for a search engine. Initialize with `sentences` and their historical `times` (counts). Implement `input(char c)`: if `c` is `'#'`, the current query is finished — save it (incrementing its count) and reset. Otherwise append `c` to the current query and return the **top 3** historical sentences that start with the current query as a prefix, ranked by **highest count**, breaking ties by **smaller ASCII order**. Return fewer than 3 if not enough match.",
    examples: [
      {
        in: 'init(["i love you","island","iroman","i love leetcode"],[5,3,2,2]); input("i")',
        out: '["i love you","island","i love leetcode"]',
        note: 'prefix "i": counts you=5, island=3, leetcode=2; top 3 by count then ASCII',
      },
      {
        in: 'then input(" ")',
        out: '["i love you","i love leetcode"]',
        note: 'prefix "i " matches only the two "i love..." sentences',
      },
    ],
    constraints: ["1 ≤ sentences.length = times.length ≤ 100", "1 ≤ sentence length ≤ 100", "queries consist of lowercase letters, spaces, and '#'", "at most 5000 calls to input"],
    recognize:
      "Prefix-driven suggestions ranked by frequency → a **trie** keyed on sentence characters (letters and space) where each terminal node stores the sentence's count. Walk the trie to the current-query node, gather all sentences in that subtree, and pick the top 3 by (count desc, ASCII asc).",
    figureItOut: [
      "The core query is 'given a prefix, find all stored sentences starting with it', which is precisely what a **trie** answers: descend one node per prefix character, and everything in the subtree below shares that prefix. So I build a trie over the sentences, using nodes for each character including the space.",
      "Ranking: among the matching sentences I want the top 3 by highest count, ties broken by smaller ASCII (lexicographically smaller string). So each terminal trie node should store the sentence text and its count. To get the top 3 I can collect all subtree matches and sort, or maintain a small selection — with only ≤100 sentences, collecting and sorting is simple and fast.",
      "State across calls: keep a `curPath` accumulating the characters typed since the last '#', and a pointer `curNode` into the trie tracking where that prefix currently sits. On each letter I append to curPath and advance curNode (or mark that the prefix has gone off the trie, in which case no suggestions can match).",
      "On '#': the sentence in curPath is complete — insert it into the trie (creating nodes as needed) and increment its count, then reset curPath to empty and curNode back to root, returning an empty list. On a normal char: append, move curNode down; if curNode is null there are no matches, else DFS its subtree collecting (count, sentence) pairs, sort by count desc then sentence asc, and return the first 3.",
    ],
    approaches: [
      {
        name: "Trie with counts, subtree gather + top-3 select (optimal)",
        intuition: "A trie keyed on chars stores sentence counts at terminals; walk to the prefix node, collect its subtree, return the top 3 by (count desc, ASCII asc).",
        time: "O(P + M log M) per input",
        timeWhy: "P advances down the prefix; M is the number of matching sentences gathered and sorted (bounded by the dataset size).",
        space: "O(Σ sentence length)",
        spaceWhy: "The trie stores every character of every stored sentence.",
        code: `class AutocompleteSystem {
    static class Node {
        Map<Character, Node> next = new HashMap<>();
        String sentence = null;   // non-null at a terminal node
        int count = 0;
    }

    private final Node root = new Node();
    private final StringBuilder curPath = new StringBuilder();
    private Node curNode = root;
    private boolean offTrie = false;

    public AutocompleteSystem(String[] sentences, int[] times) {
        for (int i = 0; i < sentences.length; i++) insert(sentences[i], times[i]);
    }

    private void insert(String s, int times) {
        Node cur = root;
        for (char ch : s.toCharArray()) {
            cur.next.putIfAbsent(ch, new Node());
            cur = cur.next.get(ch);
        }
        cur.sentence = s;
        cur.count += times;
    }

    public List<String> input(char c) {
        if (c == '#') {
            insert(curPath.toString(), 1);   // save finished query
            curPath.setLength(0);
            curNode = root;
            offTrie = false;
            return new ArrayList<>();
        }
        curPath.append(c);
        if (!offTrie && curNode != null && curNode.next.containsKey(c)) {
            curNode = curNode.next.get(c);
        } else {
            offTrie = true;                  // prefix no longer in the trie
            return new ArrayList<>();
        }
        List<Node> matches = new ArrayList<>();
        gather(curNode, matches);
        matches.sort((a, b) -> a.count != b.count ? b.count - a.count
                                                  : a.sentence.compareTo(b.sentence));
        List<String> res = new ArrayList<>();
        for (int i = 0; i < Math.min(3, matches.size()); i++) res.add(matches.get(i).sentence);
        return res;
    }

    private void gather(Node node, List<Node> out) {
        if (node == null) return;
        if (node.sentence != null) out.add(node);
        for (Node child : node.next.values()) gather(child, out);
    }
}`,
        walkthrough: [
          'init stores "i love you"(5), "island"(3), "iroman"(2), "i love leetcode"(2). input("i"): curNode at node "i"; subtree matches all four.',
          'Sort by count desc then ASCII: you(5), island(3), then leetcode(2) vs iroman(2) → "i love leetcode" < "iroman". Top 3 = ["i love you","island","i love leetcode"].',
          'input(" "): prefix "i " matches only the two "i love..." sentences → ["i love you","i love leetcode"].',
        ],
      },
    ],
    edgeCases: [
      "Prefix matches nothing (off the trie) → return an empty list, and stay off-trie until the next '#'.",
      "Finishing a query with '#' that was never seen → it is inserted with count 1 and can be suggested later.",
      "Fewer than 3 matches → return all of them.",
    ],
    twists: [
      "**Search Suggestions System** (LeetCode 1268) → similar prefix suggestions but ranked lexicographically, not by frequency, and the dictionary is fixed.",
      "**Replace Words** (LeetCode 648) → trie of roots for shortest-prefix replacement.",
      "**Maintain top-k per node** → store a small sorted list of top sentences at each trie node to answer in O(1) instead of gathering the subtree.",
    ],
    related: ["search-suggestions-system", "implement-trie-prefix-tree", "replace-words"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "divide-intervals-into-minimum-groups",
    title: "Divide Intervals Into Minimum Number of Groups",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 2406,
    statement:
      "Given `intervals` where `intervals[i] = [left_i, right_i]` (inclusive), divide them into the **minimum number of groups** so that no two intervals in the same group **intersect**. Return that minimum number of groups.",
    examples: [
      {
        in: "intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]",
        out: "3",
        note: "at time 5 the intervals [5,10],[1,5],[1,10] all overlap → at least 3 groups needed",
      },
      { in: "intervals = [[1,3],[5,6],[8,10],[11,13]]", out: "1", note: "none overlap, all fit in one group" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁵", "intervals[i].length == 2", "1 ≤ left_i ≤ right_i ≤ 10⁶"],
    recognize:
      "Minimum groups so no two in a group overlap equals the **maximum number of intervals overlapping at any single point** — the chromatic-number argument. Solve it like **Meeting Rooms II**: a min-heap of group end times (reuse a group when its earliest end has passed), or a sweep-line of +1/−1 events tracking the peak.",
    figureItOut: [
      "Two intervals can share a group only if they do not intersect. So the number of groups must be at least the maximum count of intervals that are all alive at the same moment — if k intervals overlap at some point, each needs its own group, forcing at least k groups.",
      "Is that lower bound also achievable? Yes: this is the interval-graph coloring fact that the minimum number of groups equals the maximum point-overlap (the clique number equals the chromatic number for interval graphs). So the whole problem reduces to 'what is the largest number of intervals covering any single point?'",
      "One clean way mirrors Meeting Rooms II: sort intervals by start, keep a **min-heap of the end times** of currently-open groups. For each interval, if the smallest end time in the heap is before this interval's start (no overlap), pop it and reuse that group; then push this interval's end. The heap size at the end is the answer — it grows only when a new overlap forces a new group.",
      "An even simpler equivalent is a sweep line over a difference array: +1 at each left endpoint, −1 just after each right endpoint, then take the maximum running prefix sum. Because right is inclusive, the −1 belongs at right+1. With coordinates up to 10⁶, a size-(10⁶+2) array works, or sort the start/end events.",
    ],
    approaches: [
      {
        name: "Min-heap of group end times (Meeting-Rooms-II style, optimal)",
        intuition: "Sort by start; reuse a group whose earliest end is before this start, else open a new one; the heap size is the answer.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; each interval does O(log n) heap work.",
        space: "O(n)",
        spaceWhy: "The heap can hold up to n group end times.",
        code: `int minGroups(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));   // by start
    PriorityQueue<Integer> ends = new PriorityQueue<>();             // min-heap of end times
    for (int[] iv : intervals) {
        if (!ends.isEmpty() && ends.peek() < iv[0]) {
            ends.poll();             // earliest group has closed; reuse it
        }
        ends.offer(iv[1]);           // assign this interval to a group
    }
    return ends.size();              // number of groups = peak concurrency
}`,
        walkthrough: [
          "Sorted: [1,5],[1,10],[2,3],[5,10],[6,8]. [1,5]→heap{5}. [1,10]: 5<1? no → heap{5,10}. [2,3]: 5<2? no → {3,5,10}.",
          "[5,10]: min 3 < 5 → reuse, pop 3, push 10 → {5,10,10}. [6,8]: min 5 < 6 → reuse, pop 5, push 8 → {8,10,10}.",
          "Heap size 3 → answer 3.",
        ],
      },
      {
        name: "Sweep line / difference array of overlaps (equivalent)",
        intuition: "Add +1 at each start and −1 just after each end; the maximum running sum is the peak overlap.",
        time: "O(n log n)",
        timeWhy: "Sorting the 2n start/end events, then a linear scan.",
        space: "O(n)",
        spaceWhy: "Arrays of start and end coordinates.",
        code: `int minGroups(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
    Arrays.sort(starts);
    Arrays.sort(ends);
    int groups = 0, maxGroups = 0, j = 0;
    for (int i = 0; i < n; i++) {
        // close every group whose end is before this start (inclusive ends)
        while (j < n && ends[j] < starts[i]) { groups--; j++; }
        groups++;                       // this interval opens
        maxGroups = Math.max(maxGroups, groups);
    }
    return maxGroups;
}`,
      },
    ],
    edgeCases: [
      "No overlaps → every group reused; answer 1.",
      "All intervals share a common point → answer equals the number of intervals.",
      "Inclusive endpoints → intervals [1,5] and [5,10] DO intersect at 5, so the comparison uses strict 'end < start' (not ≤).",
    ],
    twists: [
      "**Meeting Rooms II** (LeetCode 253) → identical 'minimum concurrent resources' problem with half-open meeting times.",
      "**My Calendar III** (LeetCode 732) → maintain the running maximum overlap as bookings arrive online.",
      "**Half-open intervals** → if ends were exclusive, [1,5) and [5,10) would not overlap and the comparison flips to '≤'.",
    ],
    related: ["meeting-rooms-ii", "my-calendar-iii", "car-pooling"],
  },

  {
    slug: "my-calendar-iii",
    title: "My Calendar III",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 732,
    statement:
      "Implement `MyCalendarThree` with `book(startTime, endTime)` for half-open events `[startTime, endTime)`. After each booking, return the largest integer `k` such that some moment in time is covered by **k** events simultaneously (the maximum k-booking across all events booked so far).",
    examples: [
      {
        in: "book(10,20)→1; book(50,60)→1; book(10,40)→2; book(5,15)→3; book(5,10)→3; book(25,55)→3",
        out: "[1,1,2,3,3,3]",
        note: "after book(5,15) the moment t=10..15 is covered by [10,20],[10,40],[5,15] → 3 events",
      },
    ],
    constraints: ["0 ≤ startTime < endTime ≤ 10⁹", "at most 400 calls to book"],
    recognize:
      "Track the maximum simultaneous overlap as events stream in → a **sweep-line difference map** keyed on time: +1 at each start, −1 at each end. After each booking, sweep the sorted keys accumulating a running count and report the peak. A TreeMap keeps the time keys sorted automatically.",
    figureItOut: [
      "The k-booking at a moment t is just how many events cover t. The maximum over all t is the peak overlap. As events keep arriving, I must recompute (or maintain) this peak after every booking, so I need a structure that tracks coverage by time.",
      "The classic technique is a **difference map**: for an event [start, end), record +1 at start and −1 at end. If I then sweep the times in sorted order and keep a running sum of these deltas, the running sum at any point IS the number of events currently covering that point. The largest running sum is the peak overlap.",
      "Because events arrive online, store the deltas in a TreeMap<Integer,Integer> (time → net change), which keeps the keys sorted. Each book adds +1 to map[start] and −1 to map[end]. Then walk the map's values in time order, accumulate the running sum, and track its maximum.",
      "Half-open semantics make the endpoints clean: an event ending at end stops covering exactly at end, and the −1 at end cancels its +1 before any event starting at end is counted, so touching events (one ends where another starts) never falsely overlap. With ≤400 bookings, re-sweeping the whole map (O(n)) per booking is plenty fast.",
    ],
    approaches: [
      {
        name: "TreeMap difference map, re-sweep for the peak (optimal for the bounds)",
        intuition: "+1 at start, −1 at end in a sorted map; after each booking, sweep deltas accumulating the running count and return its max.",
        time: "O(n) per book, O(n²) total",
        timeWhy: "Each booking updates two map entries then sweeps up to n entries; n is the number of bookings so far.",
        space: "O(n)",
        spaceWhy: "The map holds up to two time keys per booking.",
        code: `class MyCalendarThree {
    private final TreeMap<Integer, Integer> delta = new TreeMap<>();

    public int book(int startTime, int endTime) {
        delta.merge(startTime, 1, Integer::sum);    // event begins
        delta.merge(endTime, -1, Integer::sum);     // event ends
        int running = 0, max = 0;
        for (int change : delta.values()) {         // sweep in time order
            running += change;
            max = Math.max(max, running);
        }
        return max;
    }
}`,
        walkthrough: [
          "book(10,20): delta{10:+1,20:-1}. Sweep: running 1 then 0 → max 1.",
          "book(10,40): delta{10:+2,20:-1,40:-1}. Sweep: 2, 1, 0 → max 2.",
          "book(5,15): delta{5:+1,10:+2,15:-1,20:-1,40:-1}. Sweep: 1,3,2,1,0 → max 3.",
        ],
      },
    ],
    edgeCases: [
      "Touching events like [10,20) and [20,30) → half-open, so the −1 at 20 cancels before the +1 at 20 is counted; they do not overlap.",
      "All events identical → the peak equals the number of bookings.",
      "A single booking → peak is always 1.",
    ],
    twists: [
      "**My Calendar I** (LeetCode 729) → reject any double booking; a TreeMap of intervals with floor/ceiling checks.",
      "**My Calendar II** (LeetCode 731) → allow double but reject triple; track booked and double-booked regions.",
      "**Segment tree with lazy propagation** → an O(log n)-per-book alternative when there are many more bookings.",
    ],
    related: ["my-calendar-i", "my-calendar-ii", "divide-intervals-into-minimum-groups"],
  },
];
