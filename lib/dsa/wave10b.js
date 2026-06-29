// NeetCode All — wave 10b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
export const WAVE10B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "construct-binary-search-tree-from-preorder-traversal",
    title: "Construct Binary Search Tree from Preorder Traversal",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1008,
    statement:
      "Given an array `preorder` of integers — the **preorder traversal** of a binary search tree of distinct values — reconstruct the BST and return its root. Recall that BST = left subtree values < node < right subtree values, and preorder visits root, then left, then right.",
    examples: [
      { in: "preorder = [8,5,1,7,10,12]", out: "[8,5,10,1,7,null,12]" },
      { in: "preorder = [1,3]", out: "[1,null,3]" },
    ],
    constraints: ["1 ≤ preorder.length ≤ 100", "1 ≤ preorder[i] ≤ 1000", "all values are distinct", "the input is a valid BST preorder"],
    recognize:
      "Preorder gives the root first, and the **BST ordering** tells you exactly where each later value belongs. The standard trick is to walk the array left to right while carrying an **upper bound** for the current subtree — a value larger than the bound cannot belong here and bubbles up to a parent's right side.",
    figureItOut: [
      "Preorder lists the root before any of its children, so preorder[0] is always the overall root. Everything after it splits into a block that belongs to the left subtree followed by a block that belongs to the right subtree.",
      "Where does that split fall? Because it is a BST, the left subtree holds only values smaller than the root and the right subtree holds only values larger. So scanning forward from index 1, the run of values smaller than the root is the left block; the first value larger than the root begins the right block.",
      "Doing that scan-and-split recursively works but rescans repeatedly. A cleaner idea: process values in preorder order with a single moving index, and give each recursive call an **upper bound** — the largest value allowed in the subtree it is building.",
      "At each step, if the next value is below the bound, it becomes a node here; recurse left with the new node's value as the bound, then recurse right with the inherited bound. If the next value exceeds the bound, this subtree is finished and the value belongs to some ancestor's right side — return null and let the value be reconsidered higher up. One linear pass builds the whole tree.",
    ],
    approaches: [
      {
        name: "Recursive split by scanning for the boundary (baseline)",
        intuition: "Root is preorder[0]; find where values stop being smaller than it; that index splits left and right blocks; recurse.",
        time: "O(n²)",
        timeWhy: "Each recursive call scans its block to find the split point; in a skewed tree that is O(n) work at O(n) levels.",
        space: "O(n)",
        spaceWhy: "Recursion depth up to n in the worst case.",
        code: `TreeNode bstFromPreorder(int[] preorder) {
    return build(preorder, 0, preorder.length - 1);
}

TreeNode build(int[] pre, int lo, int hi) {
    if (lo > hi) return null;
    TreeNode root = new TreeNode(pre[lo]);
    int split = lo + 1;
    while (split <= hi && pre[split] < pre[lo]) split++;   // left block ends here
    root.left  = build(pre, lo + 1, split - 1);
    root.right = build(pre, split, hi);
    return root;
}`,
      },
      {
        name: "Single pass with an upper bound (optimal)",
        intuition: "Walk preorder once with a moving index; each call carries the max value allowed in its subtree.",
        time: "O(n)",
        timeWhy: "The index only ever moves forward, so each value is consumed exactly once across all recursive calls.",
        space: "O(n)",
        spaceWhy: "Recursion stack up to the tree height, O(n) for a skewed tree.",
        code: `class Solution {
    private int idx = 0;

    public TreeNode bstFromPreorder(int[] preorder) {
        return build(preorder, Integer.MAX_VALUE);
    }

    private TreeNode build(int[] pre, int bound) {
        if (idx == pre.length || pre[idx] > bound) return null;
        TreeNode root = new TreeNode(pre[idx++]);
        root.left  = build(pre, root.val);     // left subtree: values below this node
        root.right = build(pre, bound);        // right subtree: still under inherited bound
        return root;
    }
}`,
        walkthrough: [
          "preorder=[8,5,1,7,10,12]. build(MAX): node 8, idx=1. Left build(8): node 5, idx=2.",
          "Left build(5): node 1, idx=3. Its left build(1): pre[3]=7>1 → null. Its right build(5): 7>5 → null. Back to 5's right build(8): node 7, idx=4. 7's children: 10>7 → null both. Back to 8's right build(MAX): node 10, idx=5; right build(MAX): node 12.",
          "Result root 8 with left 5(1,7) and right 10(null,12).",
        ],
      },
    ],
    edgeCases: [
      "Single element → a one-node tree.",
      "Strictly increasing preorder (e.g. [1,2,3]) → a right-skewed tree; the bound never blocks, every node hangs off the right.",
      "Strictly decreasing preorder → a left-skewed tree; each value is smaller than its parent so it goes left.",
    ],
    twists: [
      "**Convert Sorted Array to BST** (LeetCode 108) → the input is sorted (inorder) instead of preorder; pick the middle as root for balance.",
      "**Construct BT from Preorder and Inorder** (LeetCode 105) → a general binary tree needs both orders, not just one, because BST ordering is unavailable.",
      "**Verify Preorder Sequence of a BST** (LeetCode 255) → only check validity using a stack, without building the tree.",
    ],
    related: ["convert-sorted-array-to-binary-search-tree", "construct-binary-tree-from-preorder-and-inorder-traversal", "validate-binary-search-tree"],
  },

  {
    slug: "insert-into-a-binary-search-tree",
    title: "Insert into a Binary Search Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 701,
    statement:
      "Given the `root` of a binary search tree and a value `val` not already present, insert `val` into the BST and return the root. Any valid BST that still contains all original values plus the new one is accepted (you do not need to rebalance).",
    examples: [
      { in: "root = [4,2,7,1,3], val = 5", out: "[4,2,7,1,3,5]", note: "5 becomes the left child of 7" },
      { in: "root = [], val = 5", out: "[5]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10⁴", "−10⁸ ≤ Node.val, val ≤ 10⁸", "all values are unique", "val is not already in the tree"],
    recognize:
      "BST search is a sequence of left/right turns driven by comparisons. Insertion is just **search until you fall off the tree** — the null spot you would have visited next is exactly where the new leaf belongs, so no restructuring is needed.",
    figureItOut: [
      "Think about how you would *look up* val in a BST: at each node, go left if val is smaller, right if larger, stopping when you find it. Since val is guaranteed absent, that search will eventually want to step into a null child.",
      "That null child is the answer. The position where the search runs off the tree is precisely where val belongs to keep the BST property — every node above it is already on the correct side of val.",
      "So walk down comparing val to each node. When the child you want to descend into is null, hang a new node there as that child. Nothing else in the tree needs to move; you are only adding a leaf.",
      "Two clean ways to code it: iteratively keep a parent pointer and attach to the empty slot, or recursively return the (possibly new) subtree so the parent re-links it. The recursive version reads as 'if the current node is null, this is the spot — return a fresh node; otherwise recurse into the correct side and reattach.'",
    ],
    approaches: [
      {
        name: "Iterative descent to the empty slot (optimal)",
        intuition: "Search down with a parent pointer; attach a new leaf where the search would go null.",
        time: "O(h)",
        timeWhy: "One comparison per level; h is the tree height (O(log n) balanced, O(n) skewed).",
        space: "O(1)",
        spaceWhy: "Only a couple of pointers, no recursion.",
        code: `TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    TreeNode cur = root;
    while (true) {
        if (val < cur.val) {
            if (cur.left == null) { cur.left = new TreeNode(val); return root; }
            cur = cur.left;
        } else {
            if (cur.right == null) { cur.right = new TreeNode(val); return root; }
            cur = cur.right;
        }
    }
}`,
        walkthrough: [
          "root=[4,2,7,1,3], val=5. cur=4: 5>4 → go right. cur=7: 5<7 → left is null.",
          "Attach new node 5 as 7.left.",
          "Return root 4; tree now [4,2,7,1,3,5] with 5 under 7.",
        ],
      },
      {
        name: "Recursive insert (clean equivalent)",
        intuition: "Recurse into the correct side; a null node means the insertion point — return a fresh node.",
        time: "O(h)",
        timeWhy: "One recursive step per level of the tree.",
        space: "O(h)",
        spaceWhy: "Recursion stack as deep as the tree height.",
        code: `TreeNode insertIntoBST(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left  = insertIntoBST(root.left, val);
    else                root.right = insertIntoBST(root.right, val);
    return root;
}`,
      },
    ],
    edgeCases: [
      "Empty tree → the new value becomes the root.",
      "Inserted value smaller/larger than everything → it becomes the leftmost/rightmost leaf.",
      "Because val is guaranteed not present, there is no equal-value case to disambiguate.",
    ],
    twists: [
      "**Delete Node in a BST** (LeetCode 450) → the harder inverse; removing a node with two children requires splicing in its successor.",
      "**Search in a BST** (LeetCode 700) → the same descent but you stop and return when you match instead of inserting.",
      "**Insert keeping balance** → a real database uses an AVL or red-black tree and rotates after insertion to keep height O(log n).",
    ],
    related: ["delete-node-in-a-bst", "validate-binary-search-tree", "kth-smallest-element-in-a-bst"],
  },

  {
    slug: "range-sum-of-bst",
    title: "Range Sum of BST",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 938,
    statement:
      "Given the `root` of a binary search tree and two integers `low` and `high`, return the **sum of values** of all nodes with a value in the inclusive range `[low, high]`.",
    examples: [
      { in: "root = [10,5,15,3,7,null,18], low = 7, high = 15", out: "32", note: "7 + 10 + 15 = 32" },
      { in: "root = [10,5,15,3,7,13,18,1,null,6], low = 6, high = 10", out: "23", note: "6 + 7 + 10 = 23" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 2·10⁴", "1 ≤ Node.val ≤ 10⁵", "1 ≤ low ≤ high ≤ 10⁵", "all values are unique"],
    recognize:
      "A plain DFS sums everything in range, but the **BST ordering lets you prune** whole subtrees: if a node's value is below `low`, its entire left subtree is even smaller and can be skipped; if above `high`, the right subtree is skipped. Range-bounded BST traversal is the signature.",
    figureItOut: [
      "Without using the BST property you would visit every node, check if it falls in [low, high], and add it if so. Correct, but it ignores the ordering that makes a BST useful.",
      "Use the ordering to avoid pointless work. At a node with value v: if v < low, then everything in its left subtree is strictly less than v, hence also below low — none of it can be in range, so skip the left subtree entirely and only go right.",
      "Symmetrically, if v > high, the whole right subtree is above high and useless, so go only left. When low ≤ v ≤ high, v itself counts toward the sum and you must explore *both* sides because both can contain in-range values.",
      "So the recursion is: null → contribute 0; v < low → only recurse right; v > high → only recurse left; otherwise add v and recurse both ways. The pruning turns this into roughly the cost of two root-to-leaf descents in a balanced tree.",
    ],
    approaches: [
      {
        name: "Full DFS, filter in range (baseline)",
        intuition: "Visit every node, add it if it lies in [low, high].",
        time: "O(n)",
        timeWhy: "Every node is examined regardless of the range.",
        space: "O(h)",
        spaceWhy: "Recursion stack equal to the tree height.",
        code: `int rangeSumBST(TreeNode root, int low, int high) {
    if (root == null) return 0;
    int sum = (root.val >= low && root.val <= high) ? root.val : 0;
    return sum + rangeSumBST(root.left, low, high)
               + rangeSumBST(root.right, low, high);
}`,
      },
      {
        name: "Pruned BST traversal (optimal)",
        intuition: "Skip the left subtree when the node is below low, the right when above high.",
        time: "O(n) worst, much less in practice",
        timeWhy: "Pruning skips whole subtrees; in a balanced tree only the boundary paths are fully explored.",
        space: "O(h)",
        spaceWhy: "Recursion stack bounded by the tree height.",
        code: `int rangeSumBST(TreeNode root, int low, int high) {
    if (root == null) return 0;
    if (root.val < low)  return rangeSumBST(root.right, low, high);  // left subtree all too small
    if (root.val > high) return rangeSumBST(root.left, low, high);   // right subtree all too big
    return root.val
         + rangeSumBST(root.left, low, high)
         + rangeSumBST(root.right, low, high);
}`,
        walkthrough: [
          "root=10, low=7, high=15. 10 in range → add 10, recurse both.",
          "Left 5 < 7 → recurse only its right child 7. 7 in range → add 7 (its children pruned or null).",
          "Right 15 in range → add 15; its right child 18 > 15 → recurse left (null) → 0. Total 10+7+15 = 32.",
        ],
      },
    ],
    edgeCases: [
      "No node in range → returns 0.",
      "low == high → sums only the single matching node if present.",
      "The whole tree inside the range → behaves like a full sum, pruning never triggers.",
    ],
    twists: [
      "**Kth Smallest Element in a BST** (LeetCode 230) → also exploits BST order, via an inorder walk that stops early.",
      "**Count nodes in range** → identical pruning but increment a counter instead of summing.",
      "**Range sum on a generic (non-BST) tree** → no ordering to prune with, so a full traversal is unavoidable.",
    ],
    related: ["kth-smallest-element-in-a-bst", "validate-binary-search-tree", "binary-tree-inorder-traversal"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "remove-linked-list-elements",
    title: "Remove Linked List Elements",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 203,
    statement:
      "Given the `head` of a linked list and an integer `val`, delete **all** nodes whose value equals `val` and return the new head.",
    examples: [
      { in: "head = [1,2,6,3,4,5,6], val = 6", out: "[1,2,3,4,5]" },
      { in: "head = [7,7,7,7], val = 7", out: "[]", note: "every node removed → empty list" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10⁴", "1 ≤ Node.val ≤ 50", "0 ≤ val ≤ 50"],
    recognize:
      "Deleting nodes by value from a singly linked list is the canonical **dummy-head** problem. Because the head itself might be deleted (and possibly several leading nodes), a sentinel node before the head removes every special case and lets one uniform loop do the unlinking.",
    figureItOut: [
      "To delete a node from a singly linked list you must rewire its *predecessor* to skip over it: prev.next = node.next. So you always walk with a pointer to the node *before* the one you are inspecting.",
      "The annoyance is the head: it has no predecessor, yet it might be the very value you need to delete — and so might the next several nodes (7,7,7,7). Handling 'is it the head?' separately gets messy.",
      "Fix it with a **dummy node** whose next points at the real head. Now even the original head has a predecessor (the dummy), so deletion is uniform everywhere. At the end, return dummy.next — which correctly reflects a possibly-changed head, even an empty list.",
      "Walk a `prev` pointer from the dummy. If prev.next holds the target value, splice it out with prev.next = prev.next.next and do NOT advance prev (the new next might also match). Otherwise advance prev. Stop when prev.next is null.",
    ],
    approaches: [
      {
        name: "Dummy head + single pass (optimal)",
        intuition: "Put a sentinel before head so the head is deletable uniformly; unlink matching nodes in one walk.",
        time: "O(n)",
        timeWhy: "Each node is examined once.",
        space: "O(1)",
        spaceWhy: "Only the dummy and a walking pointer; the list is rewired in place.",
        code: `ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    while (prev.next != null) {
        if (prev.next.val == val) {
            prev.next = prev.next.next;   // skip the matching node, stay on prev
        } else {
            prev = prev.next;             // keep this node, advance
        }
    }
    return dummy.next;
}`,
        walkthrough: [
          "head=[1,2,6,3,4,5,6], val=6. dummy→1→2→6→... prev=dummy.",
          "prev.next 1,2 kept (advance). prev=2, prev.next=6 matches → unlink → 2→3; prev stays 2.",
          "Continue; trailing 6 matches and is unlinked. Return dummy.next = [1,2,3,4,5].",
        ],
      },
    ],
    edgeCases: [
      "Empty list → dummy.next is null, return null.",
      "All nodes match → every node is unlinked, return null (the dummy makes this trivial).",
      "Consecutive matches (7,7,7,7) → do NOT advance prev on a match, or you skip the next equal node.",
    ],
    twists: [
      "**Remove Duplicates from Sorted List** (LeetCode 83) → remove repeats rather than a specific value; relies on sortedness.",
      "**Remove Nth Node From End** (LeetCode 19) → delete by position; uses a two-pointer gap plus the same dummy trick.",
      "**Delete Node in a Linked List** (LeetCode 237) → you are given only the node to delete; copy the next node's value and skip it.",
    ],
    related: ["remove-duplicates-from-sorted-list", "remove-nth-node-from-end-of-list", "middle-of-the-linked-list"],
  },

  {
    slug: "linked-list-cycle-ii",
    title: "Linked List Cycle II",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 142,
    statement:
      "Given the `head` of a linked list, return the node where the **cycle begins**. If there is no cycle, return null. Do not modify the list. Aim for **O(1)** extra space.",
    examples: [
      { in: "head = [3,2,0,-4], tail connects to index 1", out: "node with value 2", note: "cycle starts at index 1" },
      { in: "head = [1,2], tail connects to index 0", out: "node with value 1" },
      { in: "head = [1], no cycle", out: "null" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10⁴", "−10⁵ ≤ Node.val ≤ 10⁵", "pos is −1 (no cycle) or a valid index"],
    recognize:
      "Detecting a cycle is **Floyd's tortoise and hare**. Finding *where* it starts adds the classic second phase: after the fast/slow pointers meet inside the loop, resetting one pointer to the head and advancing both one step at a time lands them exactly on the cycle's entry node.",
    figureItOut: [
      "First just detect the cycle: a slow pointer moving one step and a fast pointer moving two steps. If there is a loop, fast laps slow and they meet inside it; if fast falls off the end (hits null), there is no cycle.",
      "Now the entry. Let the distance from head to the cycle start be F, and let the meeting point be K steps into the cycle (cycle length C). When they meet, slow has travelled F+K and fast has travelled F+K+(some whole number of loops) = 2·(F+K). Subtracting gives that the extra distance fast covered is a multiple of C, which forces F ≡ (C−K) mod C.",
      "Read that equation concretely: the number of steps from the head to the entry (F) equals the number of steps from the meeting point onward to the entry (C−K), modulo full loops. So a pointer starting at head and a pointer starting at the meeting point, each moving one step at a time, will arrive at the entry simultaneously.",
      "So phase two: reset one pointer to head, keep the other at the meeting point, advance both by one. The node where they coincide is the cycle's start. If phase one found no meeting (fast hit null), return null.",
    ],
    approaches: [
      {
        name: "Hash set of visited nodes (baseline)",
        intuition: "Walk the list adding each node to a set; the first node already present is the cycle entry.",
        time: "O(n)",
        timeWhy: "Each node is visited once with O(1) set operations.",
        space: "O(n)",
        spaceWhy: "The set can hold every node.",
        code: `ListNode detectCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    for (ListNode cur = head; cur != null; cur = cur.next) {
        if (!seen.add(cur)) return cur;   // first repeat = cycle start
    }
    return null;
}`,
      },
      {
        name: "Floyd's two-phase pointer (optimal, O(1) space)",
        intuition: "Detect with fast/slow, then walk one pointer from head and one from the meeting point to find the entry.",
        time: "O(n)",
        timeWhy: "Both phases are linear traversals of the list.",
        space: "O(1)",
        spaceWhy: "Only two pointers, no auxiliary structure.",
        code: `ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {                 // cycle detected
            ListNode p = head;
            while (p != slow) {             // phase two: find the entry
                p = p.next;
                slow = slow.next;
            }
            return p;
        }
    }
    return null;                            // fast hit the end: no cycle
}`,
        walkthrough: [
          "head=[3,2,0,-4], tail→index1. Phase one: slow/fast advance until they meet inside the loop.",
          "Phase two: p starts at head (3), slow stays at the meeting node; both step one at a time.",
          "They coincide at the node with value 2 (index 1) — the cycle's start.",
        ],
      },
    ],
    edgeCases: [
      "No cycle → fast reaches null, return null.",
      "Cycle starting at the head (whole list is a loop) → F = 0, so phase two coincides immediately at head.",
      "Single node pointing to itself → slow and fast meet at it; phase two returns it as the entry.",
    ],
    twists: [
      "**Linked List Cycle** (LeetCode 141) → only ask whether a cycle exists; stop after phase one.",
      "**Find the Duplicate Number** (LeetCode 287) → maps an array to an implicit linked list and uses this exact entry-finding to locate the duplicate.",
      "**Cycle length** → after the meeting, keep one pointer fixed and count steps until the other returns to it.",
    ],
    related: ["linked-list-cycle", "find-the-duplicate-number", "middle-of-the-linked-list"],
  },

  {
    slug: "design-linked-list",
    title: "Design Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 707,
    statement:
      "Implement a singly (or doubly) linked list supporting: `get(index)` returns the value at index or −1 if invalid; `addAtHead(val)`; `addAtTail(val)`; `addAtIndex(index, val)` inserts before the index (append if index == length, ignore if index > length); `deleteAtIndex(index)` removes the node if the index is valid. Indices are 0-based.",
    examples: [
      { in: "addAtHead(1); addAtTail(3); addAtIndex(1,2); get(1); deleteAtIndex(1); get(1)", out: "[null,null,null,2,null,3]", note: "list 1->2->3, then delete index 1 → 1->3, get(1)=3" },
      { in: "addAtIndex(0,10); get(0)", out: "[null,10]" },
    ],
    constraints: ["0 ≤ index, val ≤ 1000", "at most 2000 calls across all methods"],
    recognize:
      "A pure **data-structure implementation** problem. A **dummy head** plus a maintained **size** counter makes every operation a clean 'walk to the predecessor, splice' — head, tail, and middle insertions/deletions all collapse into one code path.",
    figureItOut: [
      "Each operation boils down to two primitives: walk to a given index, and splice a node in or out at that point. Insertion and deletion both need the node *before* the target so you can rewire its next pointer.",
      "A dummy head before the real first node removes the 'inserting/deleting at position 0' special case — the dummy is always a valid predecessor for index 0, just as it is for any other index. Track a `size` field so you can validate indices and know where the tail is.",
      "To reach the predecessor of index i, start at the dummy and step i times. That predecessor's next is the node currently at index i. To insert before i, point the new node at predecessor.next and set predecessor.next to the new node, then size++. To delete at i, set predecessor.next = predecessor.next.next, then size--.",
      "Express the rest in terms of addAtIndex: addAtHead is addAtIndex(0, val); addAtTail is addAtIndex(size, val). Guard the edges — get and delete return/ignore when index is out of range, and addAtIndex appends when index == size but ignores index > size.",
    ],
    approaches: [
      {
        name: "Singly linked with dummy head and size counter (optimal)",
        intuition: "One predecessor-walk primitive; express head/tail ops via addAtIndex; keep a size for bounds and tail.",
        time: "O(index) per op",
        timeWhy: "get/add/delete walk up to `index` nodes; O(1) only for head operations.",
        space: "O(n)",
        spaceWhy: "One node stored per element, plus the constant dummy.",
        code: `class MyLinkedList {
    private static class Node {
        int val;
        Node next;
        Node(int v) { val = v; }
    }

    private final Node dummy = new Node(0);
    private int size = 0;

    public int get(int index) {
        if (index < 0 || index >= size) return -1;
        Node cur = dummy.next;
        for (int i = 0; i < index; i++) cur = cur.next;
        return cur.val;
    }

    public void addAtHead(int val) { addAtIndex(0, val); }

    public void addAtTail(int val) { addAtIndex(size, val); }

    public void addAtIndex(int index, int val) {
        if (index > size) return;          // index > length: ignore
        if (index < 0) index = 0;
        Node prev = dummy;
        for (int i = 0; i < index; i++) prev = prev.next;
        Node node = new Node(val);
        node.next = prev.next;
        prev.next = node;
        size++;
    }

    public void deleteAtIndex(int index) {
        if (index < 0 || index >= size) return;
        Node prev = dummy;
        for (int i = 0; i < index; i++) prev = prev.next;
        prev.next = prev.next.next;
        size--;
    }
}`,
        walkthrough: [
          "addAtHead(1): addAtIndex(0,1) → dummy→1, size=1. addAtTail(3): addAtIndex(1,3) → dummy→1→3, size=2.",
          "addAtIndex(1,2): prev walks to node 1, splice 2 → 1→2→3, size=3. get(1) walks one step → 2.",
          "deleteAtIndex(1): prev=node1, prev.next=prev.next.next → 1→3, size=2. get(1) → 3.",
        ],
      },
    ],
    edgeCases: [
      "get/delete with index out of [0, size) → return −1 / do nothing.",
      "addAtIndex with index == size appends at the tail; index > size is silently ignored.",
      "Deleting the only node leaves dummy.next == null and size 0; subsequent gets return −1.",
    ],
    twists: [
      "**Doubly linked version** → add a prev pointer and a tail sentinel so you can walk from whichever end is closer, halving average traversal.",
      "**LRU Cache** (LeetCode 146) → builds a doubly linked list plus a hash map for O(1) move-to-front.",
      "**Flatten a Multilevel Doubly Linked List** (LeetCode 430) → splicing child lists into the main chain.",
    ],
    related: ["lru-cache", "reverse-linked-list", "middle-of-the-linked-list"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "sort-characters-by-frequency",
    title: "Sort Characters By Frequency",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 451,
    statement:
      "Given a string `s`, sort its characters in **decreasing order of frequency** and return the resulting string. Characters with the same frequency may be in any order; each character must appear as many times as it does in `s`.",
    examples: [
      { in: 's = "tree"', out: '"eert"', note: "e appears twice, r and t once each; 'eetr' also valid" },
      { in: 's = "cccaaa"', out: '"aaaccc"', note: "both appear 3 times; order between them is free" },
    ],
    constraints: ["1 ≤ s.length ≤ 5·10⁵", "s consists of upper/lowercase English letters and digits"],
    recognize:
      "Count each character, then output characters most-frequent first. 'Repeatedly take the highest-count item' is a **max-heap** of (char, count) pairs — though because counts are bounded by the string length, a bucket sort by frequency is an even faster O(n) alternative.",
    figureItOut: [
      "Two phases are unavoidable: first tally how often each character occurs, then emit them ordered by that tally. The tally is a simple frequency map over the characters.",
      "For the ordering, you need to pull characters out from highest count to lowest. A **max-heap keyed by count** does exactly that: push every (char, count) entry, then pop the largest repeatedly, appending that character `count` times.",
      "Building the answer: each time you pop the top (char, count) from the heap, append the character count times to a StringBuilder. Since the heap yields decreasing counts, the result is automatically frequency-sorted.",
      "Notice the counts are at most s.length and at least 1, so you can skip the heap entirely with **bucket sort**: make an array of buckets indexed by frequency, drop each character into bucket[count], then walk buckets from high index to low. That is O(n) instead of O(k log k), useful when many distinct characters exist.",
    ],
    approaches: [
      {
        name: "Count + max-heap by frequency (optimal-ish, idiomatic)",
        intuition: "Tally counts, push (char,count) into a max-heap, pop largest and repeat each character count times.",
        time: "O(n + k log k)",
        timeWhy: "Counting is O(n); the heap holds k distinct characters with O(log k) per push/pop.",
        space: "O(k)",
        spaceWhy: "The frequency map and heap hold up to k distinct characters.",
        code: `String frequencySort(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);

    PriorityQueue<Map.Entry<Character, Integer>> heap =
        new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());
    heap.addAll(freq.entrySet());

    StringBuilder sb = new StringBuilder();
    while (!heap.isEmpty()) {
        Map.Entry<Character, Integer> e = heap.poll();
        for (int i = 0; i < e.getValue(); i++) sb.append(e.getKey());
    }
    return sb.toString();
}`,
        walkthrough: [
          's=\"tree\". Counts: t1, r1, e2. Heap orders by count desc → e(2) on top.',
          "Pop e(2): append \"ee\". Pop t(1) and r(1) in some order: append \"t\",\"r\".",
          "Result \"eetr\" (or \"eert\") — e's first because count 2 > 1.",
        ],
      },
      {
        name: "Bucket sort by frequency (optimal, O(n))",
        intuition: "Counts are bounded by n; place chars in buckets indexed by count and read buckets high to low.",
        time: "O(n)",
        timeWhy: "Counting, bucketing, and the high-to-low scan are all linear in n.",
        space: "O(n)",
        spaceWhy: "The bucket array has n+1 slots plus the frequency map.",
        code: `String frequencySort(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);

    List<Character>[] buckets = new List[s.length() + 1];
    for (Map.Entry<Character, Integer> e : freq.entrySet()) {
        int f = e.getValue();
        if (buckets[f] == null) buckets[f] = new ArrayList<>();
        buckets[f].add(e.getKey());
    }

    StringBuilder sb = new StringBuilder();
    for (int f = s.length(); f >= 1; f--) {
        if (buckets[f] == null) continue;
        for (char c : buckets[f]) {
            for (int i = 0; i < f; i++) sb.append(c);
        }
    }
    return sb.toString();
}`,
      },
    ],
    edgeCases: [
      "All distinct characters → every count is 1; any order is acceptable.",
      "Single repeated character → returns the whole string unchanged.",
      "Uppercase, lowercase, and digits are distinct keys ('A' != 'a'); the map handles them separately.",
    ],
    twists: [
      "**Top K Frequent Elements** (LeetCode 347) → only the K most frequent, not a full reorder; bucket sort shines again.",
      "**Reorganize String** (LeetCode 767) → frequency-driven but you must avoid placing equal characters adjacently, using a max-heap greedily.",
      "**Stable order among ties** → if ties must keep input order, attach the first-seen index and break ties on it.",
    ],
    related: ["top-k-frequent-words", "reorganize-string", "task-scheduler"],
  },

  {
    slug: "maximum-number-of-events-that-can-be-attended",
    title: "Maximum Number of Events That Can Be Attended",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1353,
    statement:
      "You are given `events` where `events[i] = [startDay_i, endDay_i]`. You can attend an event on any day `d` with `startDay_i ≤ d ≤ endDay_i`, but only **one event per day**, and each event counts once. Return the **maximum number of events** you can attend.",
    examples: [
      { in: "events = [[1,2],[2,3],[3,4]]", out: "3", note: "attend day 1, 2, 3 → one event each" },
      { in: "events = [[1,2],[2,3],[3,4],[1,2]]", out: "4" },
    ],
    constraints: ["1 ≤ events.length ≤ 10⁵", "1 ≤ startDay ≤ endDay ≤ 10⁵"],
    recognize:
      "A greedy scheduling problem with a deadline flavour: sweep **day by day**, and on each day attend the **available event that ends soonest** (most urgent). 'Available now, pick the one expiring first' is a **min-heap keyed by end day**, fed as events become available.",
    figureItOut: [
      "You move forward through days, one event per day. The tension is choice: on a given day several events may be open, but picking the wrong one can waste an event that was about to expire. So you need a rule for which open event to attend today.",
      "Greedy insight: among events available today, always attend the one with the **earliest end day**. Events that end later are more flexible and can be attended on a future day, whereas an event ending today must be taken now or lost. This earliest-deadline-first choice is provably optimal.",
      "To know which events are 'available today', sort events by start day and use a pointer to admit every event whose start ≤ today into a pool. The pool must surrender the smallest end day instantly — that is a **min-heap keyed by end day**.",
      "Sweep day from 1 upward: admit newly-started events into the heap; discard heap-top events whose end day is already in the past (you can never attend them now); if the heap is non-empty, attend its top (pop it, count++). Continue until you have processed all events and the heap is empty. Bound the day loop by the maximum end day.",
    ],
    approaches: [
      {
        name: "Sort by start + min-heap of end days, day-by-day sweep (optimal)",
        intuition: "Each day admit started events, drop expired ones, attend the soonest-ending available event.",
        time: "O(n log n)",
        timeWhy: "Sorting is O(n log n); each event enters and leaves the heap once at O(log n); the day sweep is bounded by the max day plus heap work.",
        space: "O(n)",
        spaceWhy: "The heap holds up to n end days.",
        code: `int maxEvents(int[][] events) {
    Arrays.sort(events, (a, b) -> Integer.compare(a[0], b[0]));
    PriorityQueue<Integer> endHeap = new PriorityQueue<>();   // min-heap of end days

    int i = 0, n = events.length, attended = 0, day = 0;
    while (i < n || !endHeap.isEmpty()) {
        if (endHeap.isEmpty()) {
            day = events[i][0];                  // jump to the next event's start
        } else {
            day++;                               // advance one day
        }
        while (i < n && events[i][0] <= day) {   // admit all events started by 'day'
            endHeap.offer(events[i][1]);
            i++;
        }
        while (!endHeap.isEmpty() && endHeap.peek() < day) {
            endHeap.poll();                      // drop events that already expired
        }
        if (!endHeap.isEmpty()) {
            endHeap.poll();                      // attend the soonest-ending event
            attended++;
        }
    }
    return attended;
}`,
        walkthrough: [
          "events=[[1,2],[2,3],[3,4],[1,2]] sorted by start. day jumps to 1, admit [1,2],[1,2] (ends 2,2).",
          "Attend end 2 (count 1). day=2: admit [2,3] (end 3); heap {2,3}; attend end 2 (count 2). day=3: admit [3,4]; heap {3,4}; attend 3 (count 3).",
          "day=4: heap {4}; attend 4 (count 4). All four events attended → 4.",
        ],
      },
    ],
    edgeCases: [
      "Single-day events all on the same day → only one can be attended.",
      "Drop expired heap entries (end < day) before attending, or you might 'attend' an already-passed event.",
      "Events with disjoint ranges → the day pointer jumps forward when the heap empties, skipping idle days.",
    ],
    twists: [
      "**Maximum events with values (LeetCode 1751)** → each event has a value and you can attend at most k; becomes a DP, not a pure greedy.",
      "**Course Schedule III** (LeetCode 630) → deadline-based greedy with a max-heap that swaps out the longest course when over budget.",
      "**Single-Threaded CPU** (LeetCode 1834) → same admit-into-heap pattern, but pick by processing time rather than deadline.",
    ],
    related: ["single-threaded-cpu", "task-scheduler", "ipo"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "search-suggestions-system",
    title: "Search Suggestions System",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 1268,
    statement:
      "Given an array `products` and a `searchWord`, after each character typed of `searchWord` return up to **3** product names that share the typed prefix, in **lexicographic order**. Return a list of lists — one suggestion list per typed prefix.",
    examples: [
      {
        in: 'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"',
        out: '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]',
      },
      { in: 'products = ["havana"], searchWord = "havana"', out: '[["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]' },
    ],
    constraints: ["1 ≤ products.length ≤ 1000", "1 ≤ products[i].length, searchWord.length ≤ 1000", "lowercase English letters"],
    recognize:
      "Repeated **prefix queries** that return the lexicographically smallest matches is a **trie** problem: store products in a trie and, at each node along the typed prefix, keep (or DFS to) the three smallest words beneath it. Sorting + binary search is a simpler alternative that also exploits lexicographic order.",
    figureItOut: [
      "After each typed character you have a growing prefix and must return the (up to three) lexicographically smallest products starting with it. The same prefix grows one letter at a time, so the candidate set only shrinks as you type.",
      "A **trie** stores all products by shared prefix, so walking down the trie following the typed characters lands you at the node representing the current prefix. Everything in that node's subtree shares the prefix; the three smallest are the answer for that step.",
      "If at some character the trie has no matching child, the prefix matches nothing, and every subsequent (longer) prefix also matches nothing — emit empty lists for the rest. Otherwise, collect the three smallest words under the current node via a DFS that explores children in a→z order and stops once it has three.",
      "An even simpler route uses lexicographic order directly: sort products, then for each prefix binary-search the first product ≥ prefix and take up to three consecutive products that still start with the prefix. Both exploit the same ordering; the trie is the 'prefix tree' canonical form.",
    ],
    approaches: [
      {
        name: "Sort + binary search per prefix (clean baseline)",
        intuition: "Sort products; for each prefix find its insertion point and take up to 3 matching neighbours.",
        time: "O(m log m · L + q · (log m + 3L))",
        timeWhy: "Sorting m products of length L; each of q prefixes does a binary search plus a constant prefix check.",
        space: "O(1)",
        spaceWhy: "Aside from the output and the sort, no extra structure.",
        code: `List<List<String>> suggestedProducts(String[] products, String searchWord) {
    Arrays.sort(products);
    List<List<String>> res = new ArrayList<>();
    String prefix = "";
    for (char ch : searchWord.toCharArray()) {
        prefix += ch;
        // binary search for the first product >= prefix
        int lo = 0, hi = products.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (products[mid].compareTo(prefix) < 0) lo = mid + 1;
            else hi = mid;
        }
        List<String> three = new ArrayList<>();
        for (int i = lo; i < products.length && three.size() < 3; i++) {
            if (products[i].startsWith(prefix)) three.add(products[i]);
            else break;
        }
        res.add(three);
    }
    return res;
}`,
      },
      {
        name: "Trie storing the 3 smallest words per node (optimal, idiomatic)",
        intuition: "Insert products (sorted), caching up to 3 smallest words at each node; walk the prefix and read the cache.",
        time: "O(m L + n)",
        timeWhy: "Insert all products into the trie (total characters m·L); each typed character is one node step.",
        space: "O(m L)",
        spaceWhy: "The trie stores every character, plus up to 3 cached words per node.",
        code: `class Solution {
    static class Node {
        Node[] next = new Node[26];
        List<String> top3 = new ArrayList<>();   // up to 3 smallest words under here
    }

    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);                   // insert in lexicographic order
        Node root = new Node();
        for (String p : products) insert(root, p);

        List<List<String>> res = new ArrayList<>();
        Node cur = root;
        boolean dead = false;
        for (char ch : searchWord.toCharArray()) {
            int c = ch - 'a';
            if (dead || cur.next[c] == null) {
                dead = true;
                res.add(new ArrayList<>());
            } else {
                cur = cur.next[c];
                res.add(cur.top3);
            }
        }
        return res;
    }

    private void insert(Node root, String word) {
        Node cur = root;
        for (char ch : word.toCharArray()) {
            int c = ch - 'a';
            if (cur.next[c] == null) cur.next[c] = new Node();
            cur = cur.next[c];
            if (cur.top3.size() < 3) cur.top3.add(word);   // sorted insertion keeps them smallest
        }
    }
}`,
        walkthrough: [
          'Sort products. Inserting in order, each node caches the first 3 words that pass through it.',
          'Type "m","mo": node caches ["mobile","moneypot","monitor"] (smallest three under that prefix).',
          'Type "mou": node under "mou" cached ["mouse","mousepad"]; remaining keystrokes refine to the same two.',
        ],
      },
    ],
    edgeCases: [
      "Fewer than 3 matches → return all that match (possibly 1 or 2).",
      "A prefix matching nothing → that and all longer prefixes return empty lists.",
      "Caching during a sorted insertion keeps each node's three words lexicographically smallest automatically.",
    ],
    twists: [
      "**Top-K instead of top-3** → cache K words per node, or DFS the subtree for the K smallest.",
      "**Implement Trie** (LeetCode 208) → the bare prefix tree this builds on.",
      "**Fuzzy/typo-tolerant suggestions** → the trie alone is insufficient; you add edit-distance search over it.",
    ],
    related: ["implement-trie-prefix-tree", "replace-words", "design-add-and-search-words-data-structure"],
  },

  {
    slug: "concatenated-words",
    title: "Concatenated Words",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 472,
    statement:
      "Given an array `words` of distinct strings, return all **concatenated words** — words that are formed by concatenating **at least two** shorter words from the same array (each used any number of times).",
    examples: [
      {
        in: 'words = ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]',
        out: '["catsdogcats","dogcatsdog","ratcatdogcat"]',
      },
      { in: 'words = ["cat","dog","catdog"]', out: '["catdog"]' },
    ],
    constraints: ["1 ≤ words.length ≤ 10⁴", "1 ≤ words[i].length ≤ 30", "0 ≤ Σ words[i].length ≤ 10⁵", "lowercase English letters, all distinct"],
    recognize:
      "'Can this word be split into dictionary words?' is **Word Break** plus the extra rule of **at least two** pieces. Backing the dictionary with a **trie** lets you, from any start index, walk forward and branch a split at every word-end node — DFS over the trie + memo on start index.",
    figureItOut: [
      "Strip away 'at least two': the core question is whether a word can be cut into pieces that are all in the dictionary — that is exactly **Word Break**. The 'at least two' rule just means a word does not count as a concatenation of only itself.",
      "Insert every word into a **trie**. To test a word, start at index 0 and walk the trie following the word's characters. Whenever you reach a node marked as a complete word, you have found a valid first piece ending here — recurse from the next index to break the remainder.",
      "Add a counter of pieces (or a 'started' flag). A split is valid only if the whole word is consumed AND it took at least two pieces, so reaching the end at a word-end node counts only when you have already used one earlier cut.",
      "Two efficiency points. First, **memoize** by start index so overlapping subproblems are not recomputed — the same suffix is asked about many times. Second, exclude a word from being its own sole piece by requiring the split to use a different word at least once, i.e. count pieces and demand count ≥ 2. The DFS over the trie with memo gives roughly O(word length²) per word.",
    ],
    approaches: [
      {
        name: "Trie of all words + DFS split with memo (optimal)",
        intuition: "From each start index, follow the trie; at every word-end, recurse on the rest; require ≥ 2 pieces.",
        time: "O(N · L²)",
        timeWhy: "N words, each of length up to L; for each word the memoized DFS does O(L) work at O(L) start positions.",
        space: "O(M)",
        spaceWhy: "The trie stores all M total characters; the memo is per-word O(L).",
        code: `class Solution {
    static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private final Node root = new Node();

    public List<String> findAllConcatenatedWordsInADict(String[] words) {
        for (String w : words) {
            if (w.isEmpty()) continue;
            insert(w);
        }
        List<String> res = new ArrayList<>();
        for (String w : words) {
            if (w.isEmpty()) continue;
            if (canSplit(w, 0, 0, new Boolean[w.length()])) res.add(w);
        }
        return res;
    }

    private void insert(String w) {
        Node cur = root;
        for (char ch : w.toCharArray()) {
            int c = ch - 'a';
            if (cur.next[c] == null) cur.next[c] = new Node();
            cur = cur.next[c];
        }
        cur.isWord = true;
    }

    // can the suffix starting at 'start' be broken, given 'pieces' already taken?
    private boolean canSplit(String w, int start, int pieces, Boolean[] memo) {
        if (start == w.length()) return pieces >= 2;     // consumed all, need >= 2 parts
        if (start > 0 && memo[start] != null) return memo[start];
        Node cur = root;
        boolean ok = false;
        for (int i = start; i < w.length(); i++) {
            int c = w.charAt(i) - 'a';
            if (cur.next[c] == null) break;              // no word with this prefix
            cur = cur.next[c];
            if (cur.isWord && canSplit(w, i + 1, pieces + 1, memo)) {
                ok = true;
                break;
            }
        }
        if (start > 0) memo[start] = ok;
        return ok;
    }
}`,
        walkthrough: [
          'Insert all words into the trie. Test "catsdogcats": from index 0 walk trie, "cat" is a word → recurse at 3; also "cats" is a word → recurse at 4.',
          'From 4: "dog" is a word → recurse at 7; pieces now 2. From 7: "cats" is a word → recurse at 11 = end, pieces 3 ≥ 2 → true.',
          'So "catsdogcats" splits into cats+dog+cats → it is a concatenated word.',
        ],
      },
    ],
    edgeCases: [
      "Empty strings in the input must be skipped — an empty word is not a valid piece and would otherwise loop.",
      "A word equal to a single dictionary word is NOT concatenated (pieces would be 1); the ≥ 2 check excludes it.",
      "Repeated pieces are allowed (cats+dog+cats), since each component just needs to exist in the dictionary.",
    ],
    twists: [
      "**Word Break** (LeetCode 139) → just decide if a single word splits, no 'at least two' rule.",
      "**Word Break II** (LeetCode 140) → return every possible sentence, not just yes/no.",
      "**Sort by length and grow a dictionary** → insert words shortest-first so each test only uses strictly shorter words, an alternative to the pieces counter.",
    ],
    related: ["implement-trie-prefix-tree", "word-search-ii", "replace-words"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "remove-covered-intervals",
    title: "Remove Covered Intervals",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 1288,
    statement:
      "Given a list of `intervals` where `intervals[i] = [l_i, r_i]`, remove every interval that is **covered** by another (interval [a,b] covers [c,d] when a ≤ c and d ≤ b). Return the number of remaining intervals after removals.",
    examples: [
      { in: "intervals = [[1,4],[3,6],[2,8]]", out: "2", note: "[3,6] is covered by [2,8]; [1,4] and [2,8] remain" },
      { in: "intervals = [[1,4],[2,3]]", out: "1", note: "[2,3] is covered by [1,4]" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 1000", "intervals[i].length == 2", "0 ≤ l_i < r_i ≤ 10⁵", "all intervals are distinct"],
    recognize:
      "A coverage question over intervals → **sort then sweep**. Sort by start ascending and, on ties, by end **descending**, so the widest interval at each start comes first. Then a single pass tracks the largest right-end seen; any interval ending within it is covered.",
    figureItOut: [
      "Interval [c,d] is covered by [a,b] when a ≤ c and d ≤ b — it sits entirely inside the other. After sorting by start ascending, every later interval has start ≥ the current one's start, so the 'a ≤ c' half is automatic for any earlier interval.",
      "That means once intervals are sorted by start, an interval is covered iff its end is ≤ the maximum end seen among earlier intervals. So sweep left to right tracking the running maximum right-end.",
      "The tie subtlety: two intervals with the same start, like [2,8] and [2,5] — [2,5] is covered by [2,8], but if [2,5] came first it would wrongly set the max end to 5 and then [2,8] looks 'new'. Fix by breaking start ties with end **descending**, so the wider interval is processed first.",
      "Now the sweep: keep prevEnd = the largest end so far. For each interval in sorted order, if its end > prevEnd it extends beyond everything seen → it is NOT covered, count it and update prevEnd. If its end ≤ prevEnd it is covered → skip. Return the count.",
    ],
    approaches: [
      {
        name: "Sort by (start asc, end desc) + sweep max end (optimal)",
        intuition: "After the sort, an interval survives only if its end exceeds the largest end seen so far.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the sweep is a single linear pass.",
        space: "O(1)",
        spaceWhy: "Only the running max end and a counter (in-place sort).",
        code: `int removeCoveredIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) ->
        a[0] != b[0] ? Integer.compare(a[0], b[0])   // start ascending
                     : Integer.compare(b[1], a[1])); // tie: end descending

    int count = 0, prevEnd = 0;
    for (int[] iv : intervals) {
        if (iv[1] > prevEnd) {       // extends beyond all seen → not covered
            count++;
            prevEnd = iv[1];
        }
        // else: end <= prevEnd → fully covered, skip
    }
    return count;
}`,
        walkthrough: [
          "intervals=[[1,4],[3,6],[2,8]]. Sort → [[1,4],[2,8],[3,6]].",
          "[1,4]: 4>0 → count=1, prevEnd=4. [2,8]: 8>4 → count=2, prevEnd=8.",
          "[3,6]: 6 ≤ 8 → covered, skip. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "Equal starts like [2,8] and [2,5] → end-descending sort puts [2,8] first so [2,5] is correctly seen as covered.",
      "Nested chains [1,10],[2,9],[3,8] → only the outermost survives → count 1.",
      "Disjoint intervals → none cover another → all survive.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → unions overlaps rather than discarding covered ones.",
      "**Non-overlapping Intervals** (LeetCode 435) → remove the fewest to make the rest disjoint; an end-sorted greedy.",
      "**Count of nested intervals** → instead of removing, report how many each interval covers, often with a sort + Fenwick tree.",
    ],
    related: ["merge-intervals", "non-overlapping-intervals", "interval-list-intersections"],
  },

  {
    slug: "data-stream-as-disjoint-intervals",
    title: "Data Stream as Disjoint Intervals",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 352,
    statement:
      "Design a structure `SummaryRanges` that ingests a stream of non-negative integers and summarizes them as a list of **disjoint intervals**. Implement `addNum(value)` to add an integer to the stream, and `getIntervals()` to return the current summary as a sorted list of disjoint intervals `[start, end]`.",
    examples: [
      {
        in: "addNum(1); getIntervals(); addNum(3); getIntervals(); addNum(7); getIntervals(); addNum(2); getIntervals(); addNum(6); getIntervals()",
        out: "[[1,1]] → [[1,1],[3,3]] → [[1,1],[3,3],[7,7]] → [[1,3],[7,7]] → [[1,3],[6,7]]",
        note: "adding 2 merges 1 and 3 into [1,3]",
      },
    ],
    constraints: ["0 ≤ value ≤ 10⁴", "at most 3·10⁴ calls to addNum and getIntervals", "follow-up: many merges expected"],
    recognize:
      "You maintain a set of disjoint intervals keyed by start and must, on each insert, find the neighbours of the new value and possibly **merge** with the one before and/or after. A **TreeMap** (balanced BST) keyed by interval start gives O(log n) floor/ceiling lookups for exactly those neighbours.",
    figureItOut: [
      "Keep the summary as disjoint intervals sorted by start. When a new value v arrives, it can do one of: sit alone as [v,v]; extend an existing interval on its left or right; bridge two intervals into one; or fall inside an interval already covering it (no change).",
      "To decide, you need the interval just **at or before** v and the one just **after** v. A **TreeMap** keyed by interval start answers both in O(log n): floorKey(v) gives the candidate on the left, ceilingKey(v) the candidate on the right.",
      "Check the left neighbour [ls, le] from floorKey: if le ≥ v, v is already covered — do nothing. If le == v − 1, v extends it on the right, so the merged interval will start at ls. Check the right neighbour [rs, re] from ceilingKey: if rs == v + 1, v joins it on the left, contributing end re.",
      "Combine the cases: compute the merged interval's start (ls if it abuts on the left, else v) and end (re if it abuts on the right, else v), remove any neighbour intervals you absorbed, and insert the single merged interval keyed by its start. getIntervals just reads the TreeMap values in key order.",
    ],
    approaches: [
      {
        name: "TreeMap keyed by interval start, merge neighbours (optimal)",
        intuition: "Use floor/ceiling to find adjacent intervals; merge with whichever abuts v, then insert the combined interval.",
        time: "O(log n) per addNum, O(n) per getIntervals",
        timeWhy: "TreeMap floor/ceiling/put/remove are O(log n); listing all intervals is linear in their count.",
        space: "O(n)",
        spaceWhy: "Up to n disjoint intervals stored in the map.",
        code: `class SummaryRanges {
    private final TreeMap<Integer, int[]> tree = new TreeMap<>();  // start -> [start, end]

    public void addNum(int value) {
        if (tree.containsKey(value)) return;
        Integer lo = tree.floorKey(value);     // interval at or before value
        Integer hi = tree.ceilingKey(value);   // interval at or after value

        // already covered by the left interval?
        if (lo != null && tree.get(lo)[1] >= value) return;

        int start = value, end = value;
        // merge with left neighbour if it ends right before value
        if (lo != null && tree.get(lo)[1] == value - 1) {
            start = lo;
        }
        // merge with right neighbour if it starts right after value
        if (hi != null && hi == value + 1) {
            end = tree.get(hi)[1];
            tree.remove(hi);
        }
        tree.put(start, new int[]{ start, end });
    }

    public int[][] getIntervals() {
        return tree.values().toArray(new int[tree.size()][]);
    }
}`,
        walkthrough: [
          "add 1 → {1:[1,1]}. add 3 → {1:[1,1],3:[3,3]}. add 7 → adds [7,7].",
          "add 2: floor=1 ([1,1] ends 1 == 2−1) → start=1; ceiling=3 (==2+1) → end=3, remove key 3; put {1:[1,3]}.",
          "add 6: floor=3? no, floor=1 ([1,3] ends 3 < 5, not covering); ceiling=7 (==6+1) → end=7, remove 7; put {6:[6,7]}. Result [[1,3],[6,7]].",
        ],
      },
    ],
    edgeCases: [
      "Adding a value already inside an existing interval → no change (the floor-interval-covers check returns early).",
      "Adding a value that bridges two intervals (the gap is exactly one) → both neighbours merge into a single interval.",
      "Duplicate addNum of the same value → idempotent; the containsKey / coverage checks prevent corruption.",
    ],
    twists: [
      "**Summary Ranges** (LeetCode 228) → the static, one-shot version on a finished sorted array — no streaming structure needed.",
      "**My Calendar I** (LeetCode 729) → a TreeMap of intervals where you instead reject overlaps rather than merge.",
      "**Range Module** (LeetCode 715) → add, query, and *remove* ranges, a more general TreeMap-of-intervals design.",
    ],
    related: ["my-calendar-i", "merge-intervals", "insert-interval"],
  },
];
