// NeetCode 250 extras — wave 7b (trees, linked-list, heaps, backtracking). Java.
export const WAVE7B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "count-complete-tree-nodes",
    title: "Count Complete Tree Nodes",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 222,
    statement:
      "Given the root of a **complete** binary tree, return the number of nodes. A complete tree has every level full except possibly the last, which is filled left to right. Do better than visiting every node.",
    examples: [
      { in: "root = [1,2,3,4,5,6]", out: "6" },
      { in: "root = []", out: "0" },
      { in: "root = [1]", out: "1" },
    ],
    constraints: ["0 ≤ nodes ≤ 5·10⁴", "the tree is guaranteed complete"],
    recognize:
      "The naive answer is 'just walk the tree' — O(n). But the word **complete** is a gift: it promises structure you can exploit to get O(log²n). Whenever a problem hands you a structural guarantee, ask what shortcut it unlocks.",
    figureItOut: [
      "The obvious solution counts every node with a DFS: `1 + count(left) + count(right)`. That's O(n) and ignores the 'complete' hint entirely — correct but wasteful.",
      "What does 'complete' buy you? A **perfect** tree (every level full) of height h has exactly `2^h − 1` nodes — a formula, no traversal needed. So if a subtree is perfect, you count it in O(1).",
      "How do you check if a subtree is perfect cheaply? Walk only the **leftmost** path to get the left height, and only the **rightmost** path to get the right height. If they're equal, the subtree is perfect → use the formula.",
      "If the two heights differ, the last level is partly filled. Recurse into left and right children and add 1 for the current node. The key: at each node you either finish in O(1) (perfect) or recurse one level deeper — and only one of the two children can be 'imperfect'.",
      "That gives O(log n) levels, each doing an O(log n) height-walk → **O(log²n)**.",
    ],
    approaches: [
      {
        name: "Naive full traversal",
        intuition: "Count every node with a simple recursion. Ignores the completeness guarantee.",
        time: "O(n)",
        timeWhy: "Visits each of the n nodes exactly once.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h (log n for a complete tree).",
        code: `int countNodes(TreeNode root) {
    if (root == null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}`,
      },
      {
        name: "Exploit completeness — height check + formula (optimal)",
        intuition: "If left-spine height equals right-spine height the subtree is perfect (2^h − 1); otherwise recurse.",
        time: "O(log²n)",
        timeWhy: "O(log n) recursion levels, each measuring two spines of length O(log n).",
        space: "O(log n)",
        spaceWhy: "Recursion depth equals the tree height, which is log n for a complete tree.",
        code: `int countNodes(TreeNode root) {
    if (root == null) return 0;
    int left = leftHeight(root), right = rightHeight(root);
    if (left == right) return (1 << left) - 1;      // perfect subtree: 2^h - 1
    return 1 + countNodes(root.left) + countNodes(root.right);
}

int leftHeight(TreeNode node) {
    int h = 0;
    while (node != null) { h++; node = node.left; }
    return h;
}

int rightHeight(TreeNode node) {
    int h = 0;
    while (node != null) { h++; node = node.right; }
    return h;
}`,
        walkthrough: [
          "Tree [1,2,3,4,5,6]: at root, leftHeight = 3 (1→2→4), rightHeight = 2 (1→3) → not perfect → recurse.",
          "Left child 2: leftHeight 2, rightHeight 2 → perfect → (1<<2)-1 = 3 nodes.",
          "Right child 3: leftHeight 2 (3→6), rightHeight 1 → not perfect → recurse → child 6 is a leaf (1) → 1 + 1 + 0 = 2.",
          "Total = 1 (root) + 3 + 2 = 6.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → 0.",
      "Single node → leftHeight == rightHeight == 1 → (1<<1)-1 = 1.",
      "A perfect tree → resolved at the root in O(log n) with the formula, never recursing.",
    ],
    twists: [
      "**Tree is NOT complete** → the formula is invalid; fall back to the O(n) traversal.",
      "**Find the kth node in level order** → the same spine-height idea lets you navigate down the last level by bits.",
      "**Index a heap-array tree** → completeness is exactly why binary heaps live in arrays with children at 2i+1, 2i+2.",
    ],
    related: ["maximum-depth-of-binary-tree", "binary-tree-level-order-traversal"],
  },

  {
    slug: "delete-node-in-a-bst",
    title: "Delete Node in a BST",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 450,
    statement:
      "Given the root of a **binary search tree** and a `key`, delete the node with that value and return the new root. The tree must remain a valid BST.",
    examples: [
      { in: "root = [5,3,6,2,4,null,7], key = 3", out: "[5,4,6,2,null,null,7]", note: "one valid answer" },
      { in: "root = [5,3,6,2,4,null,7], key = 0", out: "[5,3,6,2,4,null,7]", note: "key absent → unchanged" },
    ],
    constraints: ["0 ≤ nodes ≤ 10⁴", "−10⁵ ≤ Node.val, key ≤ 10⁵", "all values unique"],
    recognize:
      "**BST + modify structure** means: use the ordering to *find* the node in O(h), then handle the deletion by cases. The hard part isn't searching — it's the three structural cases once you've found the node.",
    figureItOut: [
      "First, finding the node is just BST search: if `key < node.val` go left, if greater go right, else this is the node. That part is easy — the deletion is where it gets interesting.",
      "Once you're at the target, there are three cases. **No children**: just remove it (return null up to the parent).",
      "**One child**: splice it out by returning that single child to the parent — the child takes its place and the BST property is preserved.",
      "**Two children** is the tricky one: you can't just remove the node, something must take its spot. The replacement must be larger than everything on the left and smaller than everything on the right — that's the **in-order successor** (smallest value in the right subtree) or the in-order predecessor (largest in the left).",
      "So: find the successor (go right once, then left as far as possible), copy its value into the current node, then **recursively delete the successor** from the right subtree. It's a leaf or one-child node, so that recursive delete is easy.",
    ],
    approaches: [
      {
        name: "Recursive search + three deletion cases (optimal)",
        intuition: "Recurse to the node using BST order; handle leaf / one-child / two-child by replacing with the in-order successor.",
        time: "O(h)",
        timeWhy: "One root-to-node path to find it, plus one more downward path to the successor — both bounded by the height h.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the height (log n if balanced, n if degenerate).",
        code: `TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        // found the node to delete
        if (root.left == null) return root.right;   // 0 or 1 child
        if (root.right == null) return root.left;    // 1 child
        // two children: replace with in-order successor
        TreeNode succ = root.right;
        while (succ.left != null) succ = succ.left;
        root.val = succ.val;
        root.right = deleteNode(root.right, succ.val);
    }
    return root;
}`,
        walkthrough: [
          "Delete key 3 from [5,3,6,2,4,...]: 3 < 5 → go left, reach node 3.",
          "Node 3 has two children (2 and 4). Successor = leftmost of right subtree = 4.",
          "Copy 4 into the node, then delete 4 from the right subtree (it's a leaf) → node now holds 4 with left child 2.",
          "Result tree: [5,4,6,2,null,null,7].",
        ],
      },
    ],
    edgeCases: [
      "Key not present → the recursion bottoms out at null and the tree is returned unchanged.",
      "Deleting the root with two children → handled identically; the returned root is the same node with a swapped value.",
      "Single-node tree where that node is the key → returns null (empty tree).",
    ],
    twists: [
      "**Use the predecessor instead** (largest in left subtree) → equally valid, sometimes used to keep the tree balanced-ish.",
      "**Self-balancing BST (AVL / red-black)** → after deletion, rotate to restore balance, keeping O(log n) guaranteed.",
      "**Insert into a BST** (LeetCode 701) → the mirror operation: recurse to a null spot and hang the new node there.",
    ],
    related: ["validate-binary-search-tree", "kth-smallest-element-in-a-bst"],
  },

  {
    slug: "flatten-binary-tree-to-linked-list",
    title: "Flatten Binary Tree to Linked List",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 114,
    statement:
      "Given the root of a binary tree, flatten it **in place** into a 'linked list': each node's `right` points to the next node in **pre-order**, and every `left` becomes null.",
    examples: [
      { in: "root = [1,2,5,3,4,null,6]", out: "[1,null,2,null,3,null,4,null,5,null,6]" },
      { in: "root = []", out: "[]" },
    ],
    constraints: ["0 ≤ nodes ≤ 2000", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "The target order is **pre-order** (node, left, right), and you must rewire pointers in place. Two angles work: a reversed pre-order traversal that prepends, or a clever pointer-rethreading that achieves O(1) space.",
    figureItOut: [
      "The desired list is just pre-order: 1, 2, 3, 4, 5, 6. The simplest correct approach: collect nodes in pre-order into a list, then relink each to the next. O(n) time and O(n) space — fine as a baseline.",
      "Can we avoid the extra list? Notice that flattening builds the list from the **front**, which is awkward. But if you traverse in **reversed pre-order** (right, left, node), you can build it from the **back** — keep a `prev` pointer to the head-so-far and prepend the current node.",
      "Reversed pre-order means visiting right subtree first, then left, then the node itself. At each node set `node.right = prev`, `node.left = null`, then `prev = node`. The list grows backward into correct forward order.",
      "There's also a beautiful O(1)-space iterative trick: for each node with a left child, find the **rightmost node of the left subtree** (its in-order predecessor), graft the current right subtree onto it, move the whole left subtree to the right, and continue. No recursion, no stack.",
    ],
    approaches: [
      {
        name: "Reversed pre-order with a prev pointer",
        intuition: "Visit right, then left, then node; prepend each node to a growing list via prev.",
        time: "O(n)",
        timeWhy: "Each node is visited once.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to height.",
        code: `TreeNode prev = null;

void flatten(TreeNode root) {
    if (root == null) return;
    flatten(root.right);
    flatten(root.left);
    root.right = prev;   // prepend current node to the list built so far
    root.left = null;
    prev = root;
}`,
        walkthrough: [
          "Tree [1,2,5,3,4,null,6]. Reversed pre-order visits 6, 5, 4, 3, 2, 1.",
          "prev starts null. Visit 6: 6.right=null, prev=6. Visit 5: 5.right=6, prev=5. Visit 4: 4.right=5, prev=4.",
          "Visit 3: 3.right=4, prev=3. Visit 2: 2.right=3, prev=2. Visit 1: 1.right=2, left cleared.",
          "Final chain: 1→2→3→4→5→6, all lefts null.",
        ],
      },
      {
        name: "Morris-style in-place rethreading (O(1) space)",
        intuition: "For each node, splice the right subtree below the left subtree's rightmost node, then shift left to right.",
        time: "O(n)",
        timeWhy: "Each edge is traversed a constant number of times.",
        space: "O(1)",
        spaceWhy: "No recursion or stack — only a few pointers.",
        code: `void flatten(TreeNode root) {
    TreeNode cur = root;
    while (cur != null) {
        if (cur.left != null) {
            TreeNode rightmost = cur.left;
            while (rightmost.right != null) rightmost = rightmost.right;
            rightmost.right = cur.right;   // graft current right subtree below
            cur.right = cur.left;           // move left subtree to the right
            cur.left = null;
        }
        cur = cur.right;
    }
}`,
        walkthrough: [
          "At node 1: left subtree rooted at 2, its rightmost node is 4. Set 4.right = 5 (the old right subtree).",
          "Set 1.right = 2, 1.left = null. Move cur to 2.",
          "At node 2: left child 3, rightmost is 3. 3.right = 4 (current right). 2.right = 3, 2.left = null.",
          "Continue down; the tree linearizes into 1→2→3→4→5→6 with no extra memory.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → nothing to do.",
      "Single node → already a one-element list.",
      "A node with only a right child → left is already null; the loop just moves on.",
    ],
    twists: [
      "**Flatten to a doubly linked list in-order** (BST → sorted DLL, LeetCode 426) → in-order traversal threading prev/next both ways.",
      "**Flatten by post-order or level-order** → swap which traversal you reverse / prepend.",
      "**Re-build the tree from the flattened list** → the inverse, requires extra structure info.",
    ],
    related: ["binary-tree-inorder-traversal", "construct-binary-tree-from-preorder-and-inorder-traversal"],
  },

  {
    slug: "binary-tree-zigzag-level-order-traversal",
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 103,
    statement:
      "Given the root of a binary tree, return its node values in **zigzag level order**: left-to-right on the first level, right-to-left on the next, alternating each level down.",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "[[3],[20,9],[15,7]]" },
      { in: "root = []", out: "[]" },
    ],
    constraints: ["0 ≤ nodes ≤ 2000", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "It's plain **BFS level-order** with one twist: alternate the direction you record each level. The traversal order stays the same — only how you *store* each level flips.",
    figureItOut: [
      "Strip away the zigzag and this is the standard level-order BFS: a queue, and at each step you process exactly the nodes currently in the queue (one full level), enqueueing their children.",
      "Now add the twist. Don't change *how you traverse* — always enqueue left child then right child as usual. Only change *how you record* the level's values.",
      "Keep a boolean `leftToRight` that flips every level. When it's true, append values normally; when false, reverse the level (or insert at the front of a deque).",
      "Using a `Deque` to build each level avoids an explicit reverse: push to the back on left-to-right levels, push to the front on right-to-left levels. Either way it's O(width) per level.",
    ],
    approaches: [
      {
        name: "BFS with a direction flag (optimal)",
        intuition: "Standard level BFS; build each level's list front-or-back depending on a toggled flag.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued exactly once.",
        space: "O(n)",
        spaceWhy: "The queue and output hold up to the tree's widest level / all nodes.",
        code: `List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean leftToRight = true;
    while (!queue.isEmpty()) {
        int size = queue.size();
        Deque<Integer> level = new LinkedList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (leftToRight) level.addLast(node.val);
            else level.addFirst(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        res.add(new ArrayList<>(level));
        leftToRight = !leftToRight;
    }
    return res;
}`,
        walkthrough: [
          "Level 0: queue [3], leftToRight=true → [3]. Enqueue 9, 20.",
          "Level 1: size 2, leftToRight=false → poll 9 addFirst → [9], poll 20 addFirst → [20,9]. Enqueue 15, 7.",
          "Level 2: leftToRight=true → poll 15 addLast, poll 7 addLast → [15,7].",
          "Result: [[3],[20,9],[15,7]].",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → empty list.",
      "Single node → [[root.val]].",
      "A skewed tree → each level has one node; zigzag has no visible effect but the flag still toggles harmlessly.",
    ],
    twists: [
      "**Plain level order** (LeetCode 102) → drop the flag, always append.",
      "**Bottom-up level order** (LeetCode 107) → collect normally, reverse the outer list at the end.",
      "**Average / max per level** → same BFS skeleton, aggregate instead of collecting.",
    ],
    related: ["binary-tree-level-order-traversal", "binary-tree-right-side-view"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "swap-nodes-in-pairs",
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 24,
    statement:
      "Given a linked list, swap every two adjacent nodes and return the head. You must swap the **nodes themselves** (rewire pointers), not just their values.",
    examples: [
      { in: "head = [1,2,3,4]", out: "[2,1,4,3]" },
      { in: "head = []", out: "[]" },
      { in: "head = [1]", out: "[1]" },
    ],
    constraints: ["0 ≤ nodes ≤ 100", "0 ≤ Node.val ≤ 100"],
    recognize:
      "**Rewiring adjacent nodes in pairs** is classic pointer choreography. A **dummy head** removes the special-case for swapping the very first pair, and you advance two nodes at a time.",
    figureItOut: [
      "The 'cheat' is to swap values instead of nodes — but the problem forbids that, so you must actually relink pointers. That's the real exercise.",
      "Picture one pair: `prev -> a -> b -> rest`. After the swap you want `prev -> b -> a -> rest`. Three pointers move: prev.next becomes b, b.next becomes a, a.next becomes rest.",
      "Order matters so you don't lose `rest`: capture `b = a.next` and `rest = b.next` first, then rewire.",
      "The first pair has no real `prev`. A **dummy** node before the head gives you a uniform `prev` for every pair — no separate case for the head.",
      "After swapping a pair, the node now in the second position (`a`) becomes the new `prev`, and you jump forward two nodes to the next pair.",
    ],
    approaches: [
      {
        name: "Iterative with a dummy head (optimal)",
        intuition: "Use a dummy prev; for each pair capture the two nodes and the tail, then relink.",
        time: "O(n)",
        timeWhy: "Each node is touched a constant number of times in one pass.",
        space: "O(1)",
        spaceWhy: "Only a handful of pointers, no extra structures.",
        code: `ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    while (prev.next != null && prev.next.next != null) {
        ListNode a = prev.next;
        ListNode b = a.next;
        // rewire: prev -> b -> a -> (rest)
        a.next = b.next;
        b.next = a;
        prev.next = b;
        // advance to the next pair
        prev = a;
    }
    return dummy.next;
}`,
        walkthrough: [
          "[1,2,3,4], dummy→1. prev=dummy: a=1, b=2. 1.next=3, 2.next=1, dummy.next=2 → 2→1→3→4. prev=1.",
          "prev=1: a=3, b=4. 3.next=null, 4.next=3, 1.next=4 → 2→1→4→3. prev=3.",
          "prev.next.next is null → stop. Return dummy.next = 2 → [2,1,4,3].",
        ],
      },
      {
        name: "Recursive",
        intuition: "Swap the first two, then recurse on the rest and attach it.",
        time: "O(n)",
        timeWhy: "One recursive call per pair.",
        space: "O(n)",
        spaceWhy: "Recursion stack of depth n/2.",
        code: `ListNode swapPairs(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode b = head.next;
    head.next = swapPairs(b.next);   // attach the swapped remainder
    b.next = head;
    return b;                         // b is the new front of this pair
}`,
      },
    ],
    edgeCases: [
      "Empty list or single node → returned unchanged (the while/if guards handle it).",
      "Odd number of nodes → the final lone node stays in place.",
      "The dummy head is what makes swapping the first pair require no special code.",
    ],
    twists: [
      "**Reverse in groups of k** (LeetCode 25) → the general case; reverse each k-block, leaving a leftover tail untouched.",
      "**Swap kth from start with kth from end** (LeetCode 1721) → two-pass or fast/slow to find both, swap values or nodes.",
      "**Swap by value not position** → find both nodes first, then rewire four pointers carefully.",
    ],
    related: ["reverse-linked-list", "reverse-nodes-in-k-group"],
  },

  {
    slug: "rotate-list",
    title: "Rotate List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 61,
    statement:
      "Given the head of a linked list, rotate it to the **right** by `k` places. Each rotation moves the last node to the front.",
    examples: [
      { in: "head = [1,2,3,4,5], k = 2", out: "[4,5,1,2,3]" },
      { in: "head = [0,1,2], k = 4", out: "[2,0,1]", note: "k > length" },
    ],
    constraints: ["0 ≤ nodes ≤ 500", "0 ≤ k ≤ 2·10⁹"],
    recognize:
      "Rotating a list by k is really 'find the new break point and re-thread'. Two insights: **k mod length** (rotating by the length is a no-op), and connecting the tail to the head to form a ring makes the cut trivial.",
    figureItOut: [
      "Rotating right by k means the last k nodes move to the front. But k can be huge — much bigger than the list. Rotating by the full length brings you back to start, so the real shift is **k mod n**.",
      "To get n, walk to the end once, counting nodes. While you're there, grab the tail node — you'll need it.",
      "Now the elegant move: connect the **tail to the head**, forming a circular list. A rotation is now just choosing where to break the ring.",
      "After the join, walk forward `n − (k mod n)` steps from the old head: that node becomes the new tail. The node right after it is the new head. Break the link there.",
      "Edge guard: if `k mod n == 0`, the list is unchanged — you can return early (or the math still works, breaking back at the original tail).",
    ],
    approaches: [
      {
        name: "Form a ring, then cut (optimal)",
        intuition: "Count length and find the tail, close the loop, then break it n − k%n nodes in.",
        time: "O(n)",
        timeWhy: "One pass to measure, a partial pass to find the cut — both linear.",
        space: "O(1)",
        spaceWhy: "Only pointers and a counter; nothing allocated.",
        code: `ListNode rotateRight(ListNode head, int k) {
    if (head == null || head.next == null || k == 0) return head;
    // 1. measure length and locate the tail
    int n = 1;
    ListNode tail = head;
    while (tail.next != null) { tail = tail.next; n++; }
    // 2. effective rotation
    k = k % n;
    if (k == 0) return head;
    // 3. close into a ring
    tail.next = head;
    // 4. new tail is (n - k) steps from head; new head is the node after it
    ListNode newTail = head;
    for (int i = 0; i < n - k - 1; i++) newTail = newTail.next;
    ListNode newHead = newTail.next;
    newTail.next = null;
    return newHead;
}`,
        walkthrough: [
          "[1,2,3,4,5], k=2. Length n=5, tail=5. k%5 = 2.",
          "Close ring: 5.next = 1. Steps to new tail = n − k − 1 = 2 → from 1: 1→2→3, newTail = 3.",
          "newHead = 3.next = 4. Cut: 3.next = null → list is 4→5→1→2→3.",
        ],
      },
    ],
    edgeCases: [
      "Empty or single-node list → return unchanged.",
      "k a multiple of n → no rotation (the k % n == 0 guard).",
      "k far larger than n (e.g. 2·10⁹) → k % n keeps it bounded; never iterate k times directly.",
    ],
    twists: [
      "**Rotate left by k** → equivalent to rotating right by n − k.",
      "**Rotate an array** (LeetCode 189) → reverse-three-parts trick instead of re-threading.",
      "**Rotate by k repeatedly / queries** → precompute, or use a circular buffer with a moving start index.",
    ],
    related: ["middle-of-the-linked-list", "reverse-linked-list"],
  },

  {
    slug: "partition-list",
    title: "Partition List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 86,
    statement:
      "Given the head of a linked list and a value `x`, partition it so that all nodes **less than x** come before all nodes **≥ x**, preserving the original relative order within each group.",
    examples: [
      { in: "head = [1,4,3,2,5,2], x = 3", out: "[1,2,2,4,3,5]" },
      { in: "head = [2,1], x = 2", out: "[1,2]" },
    ],
    constraints: ["0 ≤ nodes ≤ 200", "−100 ≤ Node.val, x ≤ 100"],
    recognize:
      "'Split into two groups keeping order, then join' → build **two separate lists** with dummy heads (a 'less' list and a 'greater-or-equal' list) and splice them. Two dummies is the cleanest pattern for any stable two-way partition of a linked list.",
    figureItOut: [
      "You can't easily move nodes around in place while preserving order — so think of it as **sorting into two buckets**.",
      "Make two new lists: one collects nodes with value `< x`, the other collects nodes with value `≥ x`. Walking the original once and appending to the right bucket preserves relative order automatically.",
      "Use a **dummy head** for each bucket and a running tail pointer. Appending is then uniform: `tail.next = node; tail = node`.",
      "After the single pass, connect the tail of the 'less' list to the head of the 'greater' list. Crucial detail: terminate the 'greater' list with `null`, or you'll create a cycle (its last node might still point into the original list).",
      "Return the 'less' dummy's next — that's the new head.",
    ],
    approaches: [
      {
        name: "Two dummy lists, then splice (optimal)",
        intuition: "Append each node to a 'less' or 'greater-equal' list; join less-tail to greater-head; null-terminate.",
        time: "O(n)",
        timeWhy: "Single pass appending each node once.",
        space: "O(1)",
        spaceWhy: "Reuses the existing nodes; only dummy/tail pointers are new.",
        code: `ListNode partition(ListNode head, int x) {
    ListNode lessDummy = new ListNode(0), greaterDummy = new ListNode(0);
    ListNode less = lessDummy, greater = greaterDummy;
    while (head != null) {
        if (head.val < x) {
            less.next = head;
            less = less.next;
        } else {
            greater.next = head;
            greater = greater.next;
        }
        head = head.next;
    }
    greater.next = null;             // terminate to avoid a cycle
    less.next = greaterDummy.next;   // join the two lists
    return lessDummy.next;
}`,
        walkthrough: [
          "[1,4,3,2,5,2], x=3. less collects 1, 2, 2 → 1→2→2. greater collects 4, 3, 5 → 4→3→5.",
          "Terminate greater with null. Join: less tail (2) .next = greater head (4).",
          "Result: 1→2→2→4→3→5.",
        ],
      },
    ],
    edgeCases: [
      "Empty list → both dummies stay empty; returns null.",
      "All nodes < x (or all ≥ x) → one list empty, the other is the whole list; the join still works.",
      "Forgetting `greater.next = null` → the last node may still point back into the list, creating a cycle.",
    ],
    twists: [
      "**Dutch-flag three-way partition** (< x, == x, > x) → three buckets, same dummy-list idea.",
      "**Partition an array around a pivot** (quicksort step) → in-place two-pointer Lomuto/Hoare partition.",
      "**Stable sort the whole list** (LeetCode 148) → merge sort on the linked list.",
    ],
    related: ["reorder-list", "merge-two-sorted-lists"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "ipo",
    title: "IPO",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 502,
    statement:
      "You can do at most `k` projects to maximize capital before an IPO. Project i needs `capital[i]` to start and yields `profits[i]` (added to your capital). Starting with `w` capital, return the maximum final capital. You can't do a project you can't afford.",
    examples: [
      { in: "k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]", out: "4", note: "do project 0 (→1), then project 2 (→4)" },
      { in: "k = 3, w = 0, profits = [1,2,3], capital = [0,1,2]", out: "6" },
    ],
    constraints: ["1 ≤ k ≤ 10⁵", "0 ≤ w ≤ 10⁹", "1 ≤ n ≤ 10⁵", "0 ≤ profits[i], capital[i] ≤ 10⁹"],
    recognize:
      "At each of k steps you want the **best affordable** project right now → a **greedy** decision powered by **two heaps**: sort/min-heap by capital to learn what just became affordable, max-heap by profit to grab the best of those.",
    figureItOut: [
      "Greedy claim: at every step, among all projects you can currently afford, pick the one with the **highest profit**. More capital now only ever unlocks more projects later, so taking the biggest profit available is never wrong.",
      "Why two structures? You need 'which projects are affordable given current w' (depends on capital) AND 'of those, the max profit'. Those are two different orderings.",
      "Sort projects by required capital (or use a min-heap keyed on capital). As w grows, more projects cross the affordability threshold — pour every newly-affordable project into a **max-heap keyed on profit**.",
      "Each of the k rounds: move all projects with `capital ≤ w` from the sorted source into the profit max-heap, then pop the single best profit, add it to w. If the profit heap is empty, no affordable project remains → stop early.",
      "Each project enters the profit heap at most once, so the total heap work is O(n log n) regardless of k.",
    ],
    approaches: [
      {
        name: "Brute force — rescan every round",
        intuition: "Each round, linearly scan all projects for the best affordable one.",
        time: "O(k·n)",
        timeWhy: "k rounds, each a full O(n) scan for the max affordable profit.",
        space: "O(n)",
        spaceWhy: "A used/done marker per project.",
        code: `// Conceptual baseline — too slow when k and n are both 1e5.
// repeat k times: scan all projects, pick max profit with capital <= w, mark done, w += profit.`,
      },
      {
        name: "Sort by capital + profit max-heap (optimal)",
        intuition: "Unlock affordable projects into a max-heap by profit; each round grab the top.",
        time: "O(n log n)",
        timeWhy: "Sorting is n log n; each project is pushed/popped from the profit heap once (log n each).",
        space: "O(n)",
        spaceWhy: "The arrays and the profit heap hold up to n projects.",
        code: `int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;
    int[][] projects = new int[n][2];
    for (int i = 0; i < n; i++) {
        projects[i][0] = capital[i];
        projects[i][1] = profits[i];
    }
    Arrays.sort(projects, (a, b) -> a[0] - b[0]);   // by capital ascending
    PriorityQueue<Integer> maxProfit = new PriorityQueue<>(Collections.reverseOrder());
    int idx = 0;
    for (int round = 0; round < k; round++) {
        while (idx < n && projects[idx][0] <= w) {   // unlock all affordable
            maxProfit.offer(projects[idx][1]);
            idx++;
        }
        if (maxProfit.isEmpty()) break;               // nothing affordable
        w += maxProfit.poll();                        // take the best profit
    }
    return w;
}`,
        walkthrough: [
          "k=2, w=0, profits=[1,2,3], capital=[0,1,1]. Sorted by capital: [(0,1),(1,2),(1,3)].",
          "Round 1: affordable with w=0 → (0,1). Heap={1}. Pop 1 → w=1.",
          "Round 2: now affordable (1,2) and (1,3) unlock. Heap={3,2}. Pop 3 → w=4.",
          "Return 4.",
        ],
      },
    ],
    edgeCases: [
      "No project affordable at the start (all capital > w) → loop breaks immediately, return w.",
      "k larger than the number of doable projects → the early break stops once the heap empties.",
      "Profits/capital up to 1e9 with k up to 1e5 → w can grow large but fits in int per constraints; use long if summing many big profits.",
    ],
    twists: [
      "**Limited reusable budget (can't add profit back)** → drop the 'w += profit' growth; it becomes a fixed-budget selection.",
      "**Each project also costs time** → add a second constraint; greedy may no longer hold, leans toward DP.",
      "**Maximize count of projects instead of capital** → still a heap, but prioritize by cost.",
    ],
    related: ["kth-largest-element-in-an-array", "task-scheduler"],
  },

  {
    slug: "find-k-pairs-with-smallest-sums",
    title: "Find K Pairs with Smallest Sums",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 373,
    statement:
      "Given two sorted ascending arrays `nums1` and `nums2` and an integer `k`, return the `k` pairs `(u, v)` with `u` from `nums1` and `v` from `nums2` that have the **smallest sums**.",
    examples: [
      { in: "nums1 = [1,7,11], nums2 = [2,4,6], k = 3", out: "[[1,2],[1,4],[1,6]]" },
      { in: "nums1 = [1,1,2], nums2 = [1,2,3], k = 2", out: "[[1,1],[1,1]]" },
    ],
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 10⁵", "both sorted ascending", "1 ≤ k ≤ 10⁴"],
    recognize:
      "There are up to n·m pairs but you only want the **k smallest** — and the inputs are sorted. That's the 'merge K sorted streams' / 'k smallest from a grid' shape: a **min-heap** that only ever expands the frontier of the next-best candidates.",
    figureItOut: [
      "Generating all n·m pair sums and sorting is O(n·m log) — far too much when arrays are 1e5. You want only k, so avoid materializing all pairs.",
      "Key structure: because both arrays are sorted, the pair `(i, j)` has sum no larger than `(i+1, j)` or `(i, j+1)`. So the smallest sum is always `(0, 0)`, and the next candidates are its 'neighbors'.",
      "Think of it as Dijkstra-style frontier expansion: start a **min-heap** with the most promising pairs, pop the smallest, and push the pairs reachable from it.",
      "A clean seeding: push `(nums1[i] + nums2[0], i, 0)` for the first up-to-k values of i — every result pair must use *some* nums1[i] paired with a nums2 index that starts at 0. When you pop `(i, j)`, the only new candidate to push is `(i, j+1)` (advancing in nums2).",
      "Pop k times; each pop yields one answer pair and pushes at most one new candidate, keeping the heap small (O(k) or O(min(k, n))).",
    ],
    approaches: [
      {
        name: "Brute force — all pairs, sort",
        intuition: "Compute every sum, sort, take the first k.",
        time: "O(n·m log(n·m))",
        timeWhy: "n·m pairs generated and sorted.",
        space: "O(n·m)",
        spaceWhy: "Stores every pair.",
        code: `// Conceptual baseline — infeasible when n, m are 1e5.
// for i in nums1: for j in nums2: collect (sum, i, j); sort; take first k.`,
      },
      {
        name: "Min-heap frontier expansion (optimal)",
        intuition: "Seed with (nums1[i], nums2[0]); each pop emits a pair and pushes its nums2-neighbor.",
        time: "O(k log k)",
        timeWhy: "At most k pops, each with a push; the heap never exceeds O(min(k,n)) entries.",
        space: "O(min(k, n))",
        spaceWhy: "The heap holds at most one candidate per seeded nums1 index.",
        code: `List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    List<List<Integer>> res = new ArrayList<>();
    if (nums1.length == 0 || nums2.length == 0) return res;
    // heap entry: [sum, i, j]
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int i = 0; i < Math.min(nums1.length, k); i++) {
        heap.offer(new int[]{nums1[i] + nums2[0], i, 0});
    }
    while (k > 0 && !heap.isEmpty()) {
        int[] top = heap.poll();
        int i = top[1], j = top[2];
        res.add(Arrays.asList(nums1[i], nums2[j]));
        k--;
        if (j + 1 < nums2.length) {
            heap.offer(new int[]{nums1[i] + nums2[j + 1], i, j + 1});
        }
    }
    return res;
}`,
        walkthrough: [
          "nums1=[1,7,11], nums2=[2,4,6], k=3. Seed: (1+2,0,0)=3, (7+2,1,0)=9, (11+2,2,0)=13.",
          "Pop 3 → pair (1,2). Push (1+4,0,1)=5. Heap: 5,9,13.",
          "Pop 5 → pair (1,4). Push (1+6,0,2)=7. Heap: 7,9,13.",
          "Pop 7 → pair (1,6). k now 0 → stop. Result [[1,2],[1,4],[1,6]].",
        ],
      },
    ],
    edgeCases: [
      "Either array empty → no pairs → empty list.",
      "k larger than n·m → simply returns all pairs (the heap empties first).",
      "Duplicate values → handled naturally; equal sums are fine in a min-heap.",
    ],
    twists: [
      "**Kth smallest sum (just the value)** → same heap, return the kth popped sum instead of collecting pairs.",
      "**Kth smallest in a sorted matrix** (LeetCode 378) → identical frontier idea, or binary search on the value.",
      "**Merge K sorted lists** (LeetCode 23) → the same min-heap-of-heads technique.",
    ],
    related: ["kth-smallest-element-in-a-sorted-matrix", "merge-k-sorted-lists"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "restore-ip-addresses",
    title: "Restore IP Addresses",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 93,
    statement:
      "Given a string `s` of digits, return **all** valid IP addresses formed by inserting three dots. Each of the 4 parts must be 0–255, with **no leading zeros** (except the single digit '0'). Don't reorder or remove digits.",
    examples: [
      { in: 's = "25525511135"', out: '["255.255.11.135","255.255.111.35"]' },
      { in: 's = "0000"', out: '["0.0.0.0"]' },
      { in: 's = "101023"', out: '["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]' },
    ],
    constraints: ["1 ≤ s.length ≤ 20", "s consists of digits only"],
    recognize:
      "'Return **all** ways to split a string into valid segments' → **backtracking**: at each of the 4 segment positions, try taking 1, 2, or 3 characters; prune the moment a segment is invalid. Choose, recurse, un-choose.",
    figureItOut: [
      "An IP has exactly 4 parts. So you're choosing 3 cut points in the string. Brute force tries all cut placements — but with backtracking you build it segment by segment and prune invalid branches early.",
      "At each step you're deciding the next segment. A segment is 1, 2, or 3 digits, so try all three lengths from the current position.",
      "Validate each candidate segment immediately: length 2–3 can't start with '0' (no leading zeros), and the numeric value must be ≤ 255. If it fails, abandon that branch — don't recurse.",
      "Track how many segments you've placed. When you've placed 4 segments AND consumed the entire string, you have a valid address — record it. If you've used 4 segments but characters remain (or run out of characters early), it's a dead end.",
      "After recursing on a choice, **un-choose** (backtrack) by dropping the segment you appended, so the next length can be tried. With s ≤ 20 and at most 3·3·3 = 27 splits to check, this is tiny.",
    ],
    approaches: [
      {
        name: "Backtracking over segment lengths (optimal)",
        intuition: "Place 4 segments; at each, try lengths 1–3, validating range and leading zeros; succeed only when 4 parts exactly consume s.",
        time: "O(1)",
        timeWhy: "At most 3 choices per segment over 4 segments → ≤ 3⁴ = 81 combinations regardless of input (length capped at 20).",
        space: "O(1)",
        spaceWhy: "Recursion depth is at most 4; the path holds 4 segments.",
        code: `List<String> restoreIpAddresses(String s) {
    List<String> res = new ArrayList<>();
    backtrack(s, 0, 0, new ArrayList<>(), res);
    return res;
}

void backtrack(String s, int start, int parts, List<String> path, List<String> res) {
    if (parts == 4) {
        if (start == s.length()) res.add(String.join(".", path));
        return;
    }
    for (int len = 1; len <= 3 && start + len <= s.length(); len++) {
        String seg = s.substring(start, start + len);
        if (!isValid(seg)) continue;
        path.add(seg);
        backtrack(s, start + len, parts + 1, path, res);
        path.remove(path.size() - 1);   // un-choose
    }
}

boolean isValid(String seg) {
    if (seg.length() > 1 && seg.charAt(0) == '0') return false;   // leading zero
    return Integer.parseInt(seg) <= 255;
}`,
        walkthrough: [
          's = \"25525511135\". First segment tries \"2\", \"25\", \"255\" — all valid; explore each branch.',
          "Down the \"255\" branch: next \"255\" valid, then \"11\", then \"135\" — 4 parts consuming all 11 chars → \"255.255.11.135\".",
          "Sibling branch \"255\".\"255\".\"111\".\"35\" → \"255.255.111.35\". Other length choices fail the range/length checks and prune.",
          "Result: [\"255.255.11.135\", \"255.255.111.35\"].",
        ],
      },
    ],
    edgeCases: [
      "Length < 4 or > 12 → no valid IP possible; the recursion simply finds nothing.",
      'Leading zeros: "0.0.0.0" is valid but "00" or "01" as a segment is not.',
      "Segment value 256+ (e.g. \"256\") → rejected by the ≤ 255 check.",
    ],
    twists: [
      "**Restore IPv6** → 8 groups of hex; analogous backtracking with different validation.",
      "**Count valid splits only** → return an int, increment instead of collecting strings.",
      "**Word break / palindrome partitioning** (LeetCode 139 / 131) → same 'split a string into valid pieces' backtracking skeleton.",
    ],
    related: ["palindrome-partitioning", "combination-sum"],
  },
];
