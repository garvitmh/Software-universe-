// NeetCode 150 — wave 2a (trees, part 1). Java.
export const WAVE2A = [
  {
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 226,
    statement:
      "Given the `root` of a binary tree, **invert** it — swap the left and right child of every node — and return the new root.",
    examples: [
      { in: "root = [4,2,7,1,3,6,9]", out: "[4,7,2,9,6,3,1]", note: "every left/right pair is mirrored" },
      { in: "root = [2,1,3]", out: "[2,3,1]" },
      { in: "root = []", out: "[]", note: "empty tree stays empty" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "You have to touch **every node** and do the same local operation (swap its two children) at each one. 'Same job at each node, order doesn't matter' is the simplest possible **DFS recursion**: solve a node, recurse into both children.",
    figureItOut: [
      "Picture inverting by hand: the whole tree mirrors left-to-right. But mirroring the whole tree is just **swapping the two children at every single node** — once you swap children everywhere, the structure is mirrored. So the global task is a pile of identical local tasks.",
      "Define the job for one node: swap its `left` and `right`, then make sure each child's subtree is also inverted. That second part — 'invert the subtree' — is **the same function again**. That self-similarity is the signal to recurse.",
      "Base case: an empty node (`null`) has nothing to swap, so just return. Everything bottoms out there, which guarantees the recursion ends.",
      "Order is free here: you can swap first then recurse, or recurse then swap — both produce the same mirrored tree, because each swap only touches one node's two pointers. (Contrast with problems where pre- vs post-order matters.)",
      "If you'd rather not recurse, the same 'visit every node and swap its children' works with an explicit **queue or stack** — that's the iterative BFS/DFS version, useful when the tree is deep enough to blow the call stack.",
    ],
    approaches: [
      {
        name: "Recursive DFS (optimal, cleanest)",
        intuition: "At each node swap its two children, then invert each child's subtree the same way.",
        time: "O(n)",
        timeWhy: "Every node is visited exactly once and does O(1) work (one swap).",
        space: "O(h)",
        spaceWhy: "The recursion stack is as deep as the tree height h — O(log n) if balanced, O(n) in the worst case (a degenerate 'linked-list' tree).",
        code: `TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode tmp = root.left;
    root.left = root.right;
    root.right = tmp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
}`,
        walkthrough: [
          "root=4: swap children → left=7, right=2. Recurse into 7, then 2.",
          "At 7: swap its children (was 6,9) → left=9, right=6. At 2: swap (was 1,3) → left=3, right=1.",
          "Leaves 9,6,3,1 have no children — swap does nothing. Tree is now fully mirrored.",
        ],
      },
      {
        name: "Iterative BFS with a queue",
        intuition: "Push the root, then for each popped node swap its children and enqueue both — no call stack needed.",
        time: "O(n)",
        timeWhy: "Each node enters and leaves the queue once, doing O(1) work.",
        space: "O(n)",
        spaceWhy: "The queue can hold up to a full level — the widest level is ~n/2 nodes in a complete tree.",
        code: `TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        TreeNode tmp = node.left;
        node.left = node.right;
        node.right = tmp;
        if (node.left != null) q.add(node.left);
        if (node.right != null) q.add(node.right);
    }
    return root;
}`,
      },
    ],
    edgeCases: [
      "Empty tree (`root == null`) → return null; the base case handles it.",
      "Single node → swapping two null children is a no-op; returns the same node.",
      "A very deep, skewed tree → recursion risks a stack overflow; prefer the iterative version there.",
    ],
    twists: [
      "**Check if a tree is symmetric** (LeetCode 101) → don't invert; instead compare the left subtree against a mirror of the right subtree.",
      "**Invert only down to depth k** → pass a depth counter and stop swapping once you pass k.",
      "**N-ary tree** → reverse the children *list* at each node instead of swapping two pointers.",
    ],
    related: ["maximum-depth-of-binary-tree", "same-tree"],
  },

  {
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 104,
    statement:
      "Given the `root` of a binary tree, return its **maximum depth** — the number of nodes along the longest path from the root down to a leaf.",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "3", note: "3 → 20 → 15 (or 7)" },
      { in: "root = [1,null,2]", out: "2" },
      { in: "root = []", out: "0" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10⁴", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "You need an aggregate that **bubbles up** from the leaves — the depth of a node depends on the depths of its children. 'Combine results from both subtrees' is post-order **DFS**. (If you'd rather count levels top-down, a **BFS** level sweep also gives the answer.)",
    figureItOut: [
      "Ask: what is the depth of one node in terms of its children? A node's deepest path goes *through whichever child subtree is taller*, plus the node itself. So `depth(node) = 1 + max(depth(left), depth(right))`. That recurrence is the whole problem.",
      "Because the answer for a node is built from the answers for its children, you must finish the children first — that's **post-order**: recurse down, then combine on the way back up.",
      "Base case anchors it: an empty subtree has depth 0. A leaf then computes `1 + max(0, 0) = 1`, which is exactly right.",
      "There's no brute force to beat here — you genuinely have to look at every node once, so O(n) is optimal. The only real choice is *how* you traverse: DFS (one path at a time) or BFS (level by level, counting levels).",
      "BFS reframes 'max depth' as 'how many levels are there?'. Process the tree one full level at a time and increment a counter per level — the counter ends at the depth. Useful when you also need per-level info.",
    ],
    approaches: [
      {
        name: "Recursive DFS (optimal)",
        intuition: "Depth of a node = 1 + the deeper of its two child subtrees.",
        time: "O(n)",
        timeWhy: "Each node is visited once and does O(1) work (a max and an add).",
        space: "O(h)",
        spaceWhy: "Recursion stack equals the tree height h — O(log n) balanced, O(n) for a skewed tree.",
        code: `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        walkthrough: [
          "[3,9,20,null,null,15,7]: depth(9)=1, depth(15)=1, depth(7)=1.",
          "depth(20)=1+max(1,1)=2. depth(3)=1+max(depth(9)=1, depth(20)=2)=3 → answer 3.",
        ],
      },
      {
        name: "Iterative BFS — count levels",
        intuition: "Process the tree one full level at a time; the number of levels is the depth.",
        time: "O(n)",
        timeWhy: "Every node is enqueued and dequeued exactly once.",
        space: "O(n)",
        spaceWhy: "The queue holds at most one level — up to ~n/2 nodes in a complete tree's last level.",
        code: `int maxDepth(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    int depth = 0;
    while (!q.isEmpty()) {
        int levelSize = q.size();          // freeze this level's count
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = q.poll();
            if (node.left != null) q.add(node.left);
            if (node.right != null) q.add(node.right);
        }
        depth++;                            // finished one whole level
    }
    return depth;
}`,
      },
    ],
    edgeCases: [
      "Empty tree → 0 (the base case).",
      "Single node → 1.",
      "A completely skewed tree (every node has one child) → depth equals the node count n; DFS recursion is n deep, so watch the stack.",
    ],
    twists: [
      "**Minimum depth** (LeetCode 111) → the shallowest *leaf*; careful — a node with one child isn't a leaf, so you can't just take min of both sides blindly.",
      "**Balanced check** (LeetCode 110) → compute depth and verify |left − right| ≤ 1 at every node in the same pass.",
      "**Maximum width** of a level → BFS, tracking positional indices per level instead of a plain count.",
    ],
    related: ["balanced-binary-tree", "diameter-of-binary-tree", "binary-tree-level-order-traversal"],
  },

  {
    slug: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 543,
    statement:
      "Given the `root` of a binary tree, return its **diameter** — the length (in edges) of the longest path between any two nodes. The path may or may not pass through the root.",
    examples: [
      { in: "root = [1,2,3,4,5]", out: "3", note: "path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3), 3 edges" },
      { in: "root = [1,2]", out: "1" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "The answer is a longest *path*, and any path has a single highest node where it 'bends'. At each node ask 'how long a path bends here?' — that's a **DFS** that returns a height but secretly tracks a global best. The depth-aggregate-with-a-side-effect is the tell.",
    figureItOut: [
      "First insight: every path through the tree has exactly one **topmost node** (its peak). The longest path through a given node goes down its left side as far as possible, up through the node, and down its right side as far as possible. So the path length *bending at a node* = height(left) + height(right) (in edges).",
      "The overall diameter is then the **maximum of that quantity over all nodes** — because the true longest path peaks at *some* node, and we try every node as the peak.",
      "Naive approach: for each node, compute left height and right height separately. But height itself is an O(n) walk, and you'd do it at every node → O(n²). That's the waste to eliminate.",
      "Key trick: you can compute a node's height **and** update the best-diameter-so-far in the *same* post-order pass. The recursion returns the height (for the parent to use), and as a side effect it does `best = max(best, leftH + rightH)`. One traversal, O(n).",
      "So the function returns height, but the answer lives in a shared variable updated at every node. Returning one thing while accumulating another is the pattern worth internalizing — it recurs in 'balanced tree', 'max path sum', and more.",
    ],
    approaches: [
      {
        name: "Naive — height recomputed per node",
        intuition: "At each node, separately measure left and right height and combine. Correct but redundant.",
        time: "O(n²)",
        timeWhy: "For each of n nodes you run an O(n) height computation; worst case (skewed tree) that's quadratic.",
        space: "O(h)",
        spaceWhy: "Recursion stack for the height calls.",
        code: `// Conceptual baseline — too slow, shown for contrast.
// int diameter(node) = height(left) + height(right);
// answer = max of diameter(node) over all nodes,
// but height() itself re-walks each subtree → O(n^2).`,
      },
      {
        name: "Single post-order DFS, height + global best (optimal)",
        intuition: "Each call returns its subtree height; while there, update a shared 'best' with leftH + rightH.",
        time: "O(n)",
        timeWhy: "One post-order pass; each node computes its height in O(1) from its children's heights.",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h; the 'best' holder is O(1).",
        code: `int best;

int diameterOfBinaryTree(TreeNode root) {
    best = 0;
    height(root);
    return best;
}

int height(TreeNode node) {
    if (node == null) return 0;            // empty subtree: height 0 (edges)
    int leftH = height(node.left);
    int rightH = height(node.right);
    best = Math.max(best, leftH + rightH); // longest path bending at this node
    return 1 + Math.max(leftH, rightH);    // height to hand up to the parent
}`,
        walkthrough: [
          "[1,2,3,4,5]: leaves 4,5,3 return height 0.",
          "At 2: leftH=1 (node 4), rightH=1 (node 5) → best=max(0, 1+1)=2; returns height 2.",
          "At 1: leftH=2 (node 2), rightH=1 (node 3) → best=max(2, 2+1)=3; returns 3. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "Single node → diameter 0 (no edges between two distinct nodes).",
      "The longest path need NOT pass through the root — that's why you must try every node as the peak, not just the root.",
      "Returning height in edges vs nodes is a classic off-by-one; with edges, an empty subtree is height 0 and a leaf is height 1 when handed up (`1 + max(0,0)`).",
    ],
    twists: [
      "**Binary Tree Maximum Path Sum** (LeetCode 124) → same shape, but accumulate node *values* and clamp negative subtree contributions to 0.",
      "**Longest Univalue Path** (LeetCode 687) → only extend a side when the child's value equals the node's value.",
      "**Diameter as node count** instead of edges → add 1 to the final answer (or track maxNodes = leftH + rightH + 1).",
    ],
    related: ["maximum-depth-of-binary-tree", "balanced-binary-tree"],
  },

  {
    slug: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 110,
    statement:
      "Given the `root` of a binary tree, return `true` if it is **height-balanced** — for every node, the heights of its two subtrees differ by **at most 1**.",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "true" },
      { in: "root = [1,2,2,3,3,null,null,4,4]", out: "false", note: "the left side is too deep relative to the right" },
      { in: "root = []", out: "true", note: "empty tree is balanced" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 5000", "−10⁴ ≤ Node.val ≤ 10⁴"],
    recognize:
      "It's the **diameter pattern again**: a DFS that returns a height but checks a condition (|left − right| ≤ 1) at every node along the way. Whenever 'balanced / height differs by k / longest path' shows up, think 'return height, decide on the way up'.",
    figureItOut: [
      "Balanced means a property holds at **every** node: |height(left) − height(right)| ≤ 1. So you can't just check the root — you must verify the condition at all nodes.",
      "Naive: write a `height()` helper and an `isBalanced()` that, for each node, computes left and right height and compares. But `height()` re-walks the subtree, and you call it at every node → O(n²). Same waste as the diameter problem.",
      "Fix it the same way: do **one post-order pass** that returns the height of each subtree, and *while returning*, check the balance condition. If a subtree is already unbalanced, propagate a sentinel (like −1) upward so the whole thing short-circuits to 'unbalanced'.",
      "Why −1 works: real heights are ≥ 0, so −1 is an impossible height that means 'a violation happened below'. The moment any child returns −1, this node returns −1 too, and it races straight to the root.",
      "So one function does double duty: it computes height for the parent's benefit, and it encodes 'is this subtree balanced?' inside the return value. Returning −1 instead of a separate boolean is what collapses two passes into one.",
    ],
    approaches: [
      {
        name: "Naive — check height at every node",
        intuition: "For each node, compute both subtree heights and compare. Correct but recomputes heights.",
        time: "O(n²)",
        timeWhy: "An O(n) height call repeated at each of n nodes; a skewed tree makes it quadratic.",
        space: "O(h)",
        spaceWhy: "Recursion stack.",
        code: `// Conceptual baseline — too slow, shown for contrast.
// boolean isBalanced(node):
//   if node == null: true
//   if abs(height(left) - height(right)) > 1: false
//   return isBalanced(left) && isBalanced(right)
// height() re-walks each subtree → O(n^2).`,
      },
      {
        name: "Post-order DFS returning height or −1 (optimal)",
        intuition: "Each call returns its height, or −1 if any subtree below is already unbalanced — short-circuiting upward.",
        time: "O(n)",
        timeWhy: "Single post-order pass; O(1) work per node.",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h.",
        code: `boolean isBalanced(TreeNode root) {
    return height(root) != -1;
}

int height(TreeNode node) {
    if (node == null) return 0;
    int leftH = height(node.left);
    if (leftH == -1) return -1;                 // already unbalanced below-left
    int rightH = height(node.right);
    if (rightH == -1) return -1;                // already unbalanced below-right
    if (Math.abs(leftH - rightH) > 1) return -1; // unbalanced at this node
    return 1 + Math.max(leftH, rightH);          // normal height
}`,
        walkthrough: [
          "[3,9,20,null,null,15,7]: leaves 9,15,7 return height 1.",
          "At 20: |1−1|=0 ≤ 1 → returns 2. At 3: leftH=1 (node 9), rightH=2 (node 20), |1−2|=1 ≤ 1 → returns 3, not −1.",
          "Top-level height ≠ −1 → balanced → true.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → balanced (true).",
      "Single node → balanced (both subtree heights are 0).",
      "A long single-child chain → unbalanced as soon as one node has a height-0 side and a tall side differing by > 1.",
    ],
    twists: [
      "**Return the first unbalanced node** instead of a boolean → capture the node when the −1 condition first fires.",
      "**Balanced by node count** (size-balanced) → return subtree sizes and compare counts instead of heights.",
      "**Allow a difference of at most k** → replace the `> 1` test with `> k`.",
    ],
    related: ["maximum-depth-of-binary-tree", "diameter-of-binary-tree"],
  },

  {
    slug: "same-tree",
    title: "Same Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 100,
    statement:
      "Given the roots of two binary trees `p` and `q`, return `true` if they are **structurally identical** and every corresponding node has the **same value**.",
    examples: [
      { in: "p = [1,2,3], q = [1,2,3]", out: "true" },
      { in: "p = [1,2], q = [1,null,2]", out: "false", note: "same values, different shape" },
      { in: "p = [1,2,1], q = [1,1,2]", out: "false", note: "same shape, different values" },
    ],
    constraints: ["0 ≤ nodes in each tree ≤ 100", "−10⁴ ≤ Node.val ≤ 10⁴"],
    recognize:
      "You're comparing **two trees in lockstep**, node-for-node. 'Walk both trees together and check each pair' is a twin **DFS** — recurse on (p.left, q.left) and (p.right, q.right) simultaneously.",
    figureItOut: [
      "Define 'same' for a single pair of nodes, then let recursion handle the rest. Two trees rooted at p and q are the same iff: p and q are both null (trivially same), OR both non-null with equal values AND their left subtrees match AND their right subtrees match.",
      "The base cases carry the real logic. If exactly one of p, q is null, the shapes differ → false. If both are null, there's nothing more to check on this branch → true.",
      "When both exist, first compare the current values; if they differ, you can stop immediately (no need to look deeper). If they're equal, the answer reduces to 'are the left subtrees the same?' and 'are the right subtrees the same?' — the same function on smaller inputs.",
      "There's no faster-than-O(n) option: in the worst case (the trees ARE identical) you must inspect every node to be sure. The interesting part is purely *how cleanly* the base cases capture 'one null, one not'.",
      "Short-circuiting with `&&` gives early exit for free — the first mismatch stops the whole comparison without exploring the rest.",
    ],
    approaches: [
      {
        name: "Parallel DFS (optimal)",
        intuition: "Compare p and q node-by-node, recursing into matching subtrees; bail on the first difference.",
        time: "O(n)",
        timeWhy: "Each pair of corresponding nodes is compared once; n = size of the smaller tree before a mismatch, ≤ size of either tree.",
        space: "O(h)",
        spaceWhy: "Recursion stack equal to the height of the trees.",
        code: `boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;     // both empty: same
    if (p == null || q == null) return false;    // one empty: differ in shape
    if (p.val != q.val) return false;            // values differ
    return isSameTree(p.left, q.left)
        && isSameTree(p.right, q.right);
}`,
        walkthrough: [
          "p=[1,2], q=[1,null,2]: roots match (1==1). Compare left: p.left=2, q.left=null → one null, one not → false.",
          "The && short-circuits, so the right subtrees are never even examined.",
        ],
      },
      {
        name: "Iterative with a stack of pairs",
        intuition: "Push (p, q) pairs onto a stack; pop, compare, and push child pairs — avoids deep recursion.",
        time: "O(n)",
        timeWhy: "Each node pair is pushed and popped once.",
        space: "O(h)",
        spaceWhy: "The stack holds at most one root-to-leaf path of pairs.",
        code: `boolean isSameTree(TreeNode p, TreeNode q) {
    Deque<TreeNode[]> stack = new ArrayDeque<>();
    stack.push(new TreeNode[]{p, q});
    while (!stack.isEmpty()) {
        TreeNode[] pair = stack.pop();
        TreeNode a = pair[0], b = pair[1];
        if (a == null && b == null) continue;
        if (a == null || b == null || a.val != b.val) return false;
        stack.push(new TreeNode[]{a.left, b.left});
        stack.push(new TreeNode[]{a.right, b.right});
    }
    return true;
}`,
      },
    ],
    edgeCases: [
      "Both trees empty → true.",
      "One empty, one not → false (caught by the 'one null' base case).",
      "Identical structure but a single differing value deep down → false; the recursion finds it.",
    ],
    twists: [
      "**Symmetric tree** (LeetCode 101) → compare left subtree against the *mirror* of the right: recurse (left.left, right.right) and (left.right, right.left).",
      "**Subtree of another tree** (LeetCode 572) → use this exact `isSameTree` as the inner check at every node of the big tree.",
      "**Tolerant compare** (values within ε, or ignore values) → relax the `p.val != q.val` test.",
    ],
    related: ["subtree-of-another-tree", "invert-binary-tree"],
  },

  {
    slug: "subtree-of-another-tree",
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 572,
    statement:
      "Given the roots of two trees `root` and `subRoot`, return `true` if `subRoot` appears as a **subtree** of `root` — i.e. some node in `root` and all its descendants form a tree identical to `subRoot`.",
    examples: [
      { in: "root = [3,4,5,1,2], subRoot = [4,1,2]", out: "true" },
      { in: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]", out: "false", note: "the candidate has an extra child, so it's not identical" },
    ],
    constraints: ["1 ≤ nodes in root ≤ 2000", "1 ≤ nodes in subRoot ≤ 1000"],
    recognize:
      "It's **Same Tree wrapped in a search**. You don't know *where* the match might be, so visit every node of the big tree as a candidate root and run an identical-tree check there. 'Try every node + a sub-check' = DFS over nodes, calling a second DFS.",
    figureItOut: [
      "Reframe: 'is subRoot a subtree of root?' = 'is there **some** node in root where the tree hanging off that node is identical to subRoot?'. You already know how to test 'identical' — that's Same Tree.",
      "So the plan is two layers: an **outer** DFS that walks every node of root (each is a possible matching point), and at each node an **inner** check `isSameTree(node, subRoot)`.",
      "The outer walk's logic: this node matches, OR the subtree exists in the left child, OR it exists in the right child. Short-circuit with `||` so you stop at the first hit.",
      "Cost: the outer walk touches all m nodes of root; each inner Same Tree check is up to O(n) where n is subRoot's size. So worst case O(m·n). That's accepted for these constraints, but worth naming.",
      "Two subtle correctness points the base cases must handle: an empty subRoot is trivially a subtree (true), and you should require a *full* identical match — a partial overlap where the candidate has extra children does NOT count (that's exactly the second example).",
    ],
    approaches: [
      {
        name: "DFS over root + Same Tree check (standard)",
        intuition: "At every node of root, test whether the subtree there is identical to subRoot.",
        time: "O(m·n)",
        timeWhy: "m nodes in root, and at each one the identical-tree check costs up to O(n) for subRoot's n nodes.",
        space: "O(h)",
        spaceWhy: "Recursion depth = height of root (plus subRoot's height during a check).",
        code: `boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (subRoot == null) return true;          // empty tree is everywhere
    if (root == null) return false;            // ran out of host tree
    if (isSameTree(root, subRoot)) return true;
    return isSubtree(root.left, subRoot)
        || isSubtree(root.right, subRoot);
}

boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    if (p.val != q.val) return false;
    return isSameTree(p.left, q.left)
        && isSameTree(p.right, q.right);
}`,
        walkthrough: [
          "root=[3,4,5,1,2], subRoot=[4,1,2]. At node 3: not identical (values differ). Recurse left to node 4.",
          "At node 4: isSameTree(4-subtree, subRoot) → values 4==4, children 1==1, 2==2, all match → true.",
          "The || bubbles true straight back up to the top → answer true.",
        ],
      },
      {
        name: "Serialize + substring (linear, advanced)",
        intuition: "Serialize both trees with null markers; subRoot is a subtree iff its serialization is a substring of root's. With KMP this is O(m + n).",
        time: "O(m + n)",
        timeWhy: "Serialization is O(m) and O(n); a linear string-matcher (KMP/Z) finds the substring in O(m + n).",
        space: "O(m + n)",
        spaceWhy: "The two serialized strings.",
        code: `boolean isSubtree(TreeNode root, TreeNode subRoot) {
    return serialize(root).contains(serialize(subRoot));
}

// Markers matter: a leading '^' before each value and explicit '#'
// for null prevent false matches like 1 inside 12.
String serialize(TreeNode node) {
    if (node == null) return "#";
    return "^" + node.val + " " + serialize(node.left) + " " + serialize(node.right);
}`,
        walkthrough: [
          "serialize(subRoot) = \"^4 ^1 # # ^2 # #\".",
          "If that exact string appears inside serialize(root), subRoot is a subtree. The '^' and '#' markers stop partial-number and partial-shape false positives.",
        ],
      },
    ],
    edgeCases: [
      "subRoot is null → conventionally true (empty tree is a subtree of anything).",
      "subRoot bigger than root → no match possible; the recursion runs out of host nodes and returns false.",
      "Matching values but a candidate with EXTRA descendants → not identical → not a subtree (the strict Same Tree check is what enforces this).",
    ],
    twists: [
      "**Count how many times subRoot occurs** → don't short-circuit; tally every node where isSameTree is true.",
      "**Subtree match ignoring values (shape only)** → drop the value check inside Same Tree.",
      "**Large inputs where O(m·n) is too slow** → use the serialize + KMP approach for O(m + n).",
    ],
    related: ["same-tree", "invert-binary-tree"],
  },

  {
    slug: "lowest-common-ancestor-of-a-binary-search-tree",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 235,
    statement:
      "Given a **binary search tree** and two nodes `p` and `q` in it, return their **lowest common ancestor** — the deepest node that has both `p` and `q` as descendants (a node is a descendant of itself).",
    examples: [
      { in: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", out: "6", note: "6 splits toward 2 and 8" },
      { in: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", out: "2", note: "an ancestor can be one of the nodes itself" },
    ],
    constraints: ["2 ≤ number of nodes ≤ 10⁵", "all node values are unique", "p and q exist in the BST"],
    recognize:
      "It's a BST, so values are **ordered** — that's the whole trick. The LCA is the first node where `p` and `q` fall on **different sides** (or one equals the node). 'Use BST ordering to pick a direction' is a single guided walk down, not a full search.",
    figureItOut: [
      "In a general binary tree, finding the LCA means searching both subtrees (no shortcuts). But here it's a **BST**, where every node's left subtree is smaller and right subtree is larger. That ordering lets you *decide a direction* at each step instead of exploring everything.",
      "Stand at a node and compare it to p and q. If **both** p and q are larger, both live in the right subtree — the LCA must be further right, so go right. If **both** are smaller, go left.",
      "The moment p and q straddle the current node (one ≤ node ≤ other), you've found the **split point**: this is the deepest node from which they diverge — exactly the LCA. (This also covers the case where the node equals p or q: it's then the ancestor of the other.)",
      "Because you only ever move down one path, this is O(h) — the tree height — not O(n). No extra structure needed; you don't even need recursion.",
      "Contrast with the general-tree LCA (LeetCode 236), which can't use ordering and must DFS both sides. Recognizing 'BST → ordered → just walk toward the split' is the lesson.",
    ],
    approaches: [
      {
        name: "Iterative walk using BST order (optimal)",
        intuition: "Move right while both targets are bigger, left while both are smaller; stop at the split.",
        time: "O(h)",
        timeWhy: "You descend one node per step; h is the height — O(log n) if balanced, O(n) worst case.",
        space: "O(1)",
        spaceWhy: "Just a moving pointer; nothing is stored.",
        code: `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode node = root;
    while (node != null) {
        if (p.val > node.val && q.val > node.val) {
            node = node.right;          // both larger → go right
        } else if (p.val < node.val && q.val < node.val) {
            node = node.left;           // both smaller → go left
        } else {
            return node;                // split point (or node == p/q) → LCA
        }
    }
    return null;                        // unreachable when p, q are present
}`,
        walkthrough: [
          "p=2, q=8 from root 6: 2<6 and 8>6 → they straddle 6 → return 6 immediately.",
          "p=2, q=4 from root 6: both < 6 → go left to node 2. Now 2 == p (node.val), so it's a split (2 ≤ 2 ≤ 4) → return 2.",
        ],
      },
      {
        name: "Recursive version (same idea)",
        intuition: "Identical direction logic expressed as recursion.",
        time: "O(h)",
        timeWhy: "One recursive call per level of descent.",
        space: "O(h)",
        spaceWhy: "Recursion stack of depth h (the iterative version avoids this).",
        code: `TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (p.val > root.val && q.val > root.val)
        return lowestCommonAncestor(root.right, p, q);
    if (p.val < root.val && q.val < root.val)
        return lowestCommonAncestor(root.left, p, q);
    return root;                        // split point or a match
}`,
      },
    ],
    edgeCases: [
      "One node is an ancestor of the other (e.g. p is q's parent) → the ancestor is the LCA; the straddle test returns it because node == p.",
      "p and q on opposite sides of the root → the root itself is the LCA.",
      "Unbalanced BST (a near-list) → still correct, but h ≈ n, so the walk is O(n).",
    ],
    twists: [
      "**LCA in a general binary tree** (LeetCode 236) → no ordering; DFS and return the node where the two targets surface in different subtrees.",
      "**LCA with parent pointers** → walk both nodes up to the root and find the first shared ancestor (like list-intersection).",
      "**Distance between p and q** → find the LCA, then sum the depths of p and q below it.",
    ],
    related: ["binary-search", "validate-binary-search-tree"],
  },

  {
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 102,
    statement:
      "Given the `root` of a binary tree, return its **level-order traversal** — a list of levels, where each level is the list of node values from left to right.",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "[[3],[9,20],[15,7]]" },
      { in: "root = [1]", out: "[[1]]" },
      { in: "root = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 2000", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "The output is grouped **by level**, and you process nodes nearest-the-root first → that's a textbook **BFS** with a queue. The one trick that makes the grouping work is freezing the queue's size at the start of each level.",
    figureItOut: [
      "The output shape dictates the traversal: you need one inner list per depth, top to bottom, left to right. DFS naturally goes depth-first (down one path), which is the wrong order for *grouping by level*. BFS goes breadth-first — level by level — which matches exactly.",
      "Standard BFS uses a queue, but a plain queue mixes levels together. The fix: at the start of each iteration, **record how many nodes are currently in the queue** — that count is exactly one level's worth, since you only ever added the previous level's children.",
      "Pop exactly that many nodes into the current level's list, and as you pop each, enqueue its children (which become the *next* level). When the count is exhausted, that level is complete — push it to the result and repeat.",
      "This 'snapshot the size, then drain that many' move is the single most reusable BFS pattern: it cleanly separates one level from the next without any depth bookkeeping.",
      "There's also a DFS way: recurse carrying the current depth, and append each value into `result[depth]` (creating the sublist the first time you reach a new depth). It visits nodes in a different order but lands them in the right buckets.",
    ],
    approaches: [
      {
        name: "BFS with per-level size snapshot (optimal)",
        intuition: "Process the queue one level at a time by freezing its size before draining that many nodes.",
        time: "O(n)",
        timeWhy: "Every node is enqueued and dequeued exactly once.",
        space: "O(n)",
        spaceWhy: "The queue holds at most one full level (~n/2 nodes) plus the output list.",
        code: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        int levelSize = q.size();              // freeze this level's count
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.add(node.left);
            if (node.right != null) q.add(node.right);
        }
        res.add(level);
    }
    return res;
}`,
        walkthrough: [
          "[3,9,20,null,null,15,7]: queue=[3]. size=1 → level [3]; enqueue 9,20.",
          "size=2 → drain 9,20 → level [9,20]; enqueue 15,7. size=2 → level [15,7]. Result [[3],[9,20],[15,7]].",
        ],
      },
      {
        name: "DFS carrying depth",
        intuition: "Recurse with the current depth; append each value into the sublist for that depth.",
        time: "O(n)",
        timeWhy: "Each node is visited once.",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h (plus the output).",
        code: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(root, 0, res);
    return res;
}

void dfs(TreeNode node, int depth, List<List<Integer>> res) {
    if (node == null) return;
    if (depth == res.size()) res.add(new ArrayList<>()); // first node at this depth
    res.get(depth).add(node.val);
    dfs(node.left, depth + 1, res);
    dfs(node.right, depth + 1, res);
}`,
      },
    ],
    edgeCases: [
      "Empty tree → empty list `[]`.",
      "Skewed tree → each level has exactly one node → list of singletons.",
      "Forgetting to freeze `levelSize` before the loop mixes the next level into the current one — the classic bug.",
    ],
    twists: [
      "**Zig-zag / spiral order** (LeetCode 103) → reverse every other level before adding it.",
      "**Bottom-up level order** (LeetCode 107) → build the same lists, then reverse the outer result.",
      "**Right side view** (LeetCode 199) → keep only the last node of each level.",
      "**Average of each level** (LeetCode 637) → sum each level and divide by its size.",
    ],
    related: ["binary-tree-right-side-view", "maximum-depth-of-binary-tree"],
  },

  {
    slug: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 199,
    statement:
      "Given the `root` of a binary tree, imagine standing on its right side. Return the values of the nodes you can see, **ordered top to bottom** — one node per level.",
    examples: [
      { in: "root = [1,2,3,null,5,null,4]", out: "[1,3,4]", note: "rightmost of each level: 1, then 3, then 4" },
      { in: "root = [1,null,3]", out: "[1,3]" },
      { in: "root = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "'One value per level' is a dead giveaway for a **level-by-level BFS** — you just keep the *last* node of each level. (Or a DFS that visits right-first and records the first node it sees at each new depth.)",
    figureItOut: [
      "What you actually see from the right is the **rightmost node of each level** — not the whole right edge. That distinction matters: in example 1, level 2's visible node is 4, which sits under the left child 2, not the right child 3. So it's strictly 'last node per level', whatever branch it's on.",
      "That immediately suggests a level-order **BFS**: process each level fully, and the *last* node you pop in that level is the one visible from the right. Snapshot the level size (same trick as level-order), and when `i == levelSize − 1`, record that value.",
      "There's a slick DFS alternative: traverse **right child before left**, carrying depth. The very first node you reach at each new depth is, by construction, the rightmost one — so record a value only when `depth == result.size()`.",
      "Why right-first DFS works: going right first means at any depth the first arrival is the furthest-right node reachable; later (left-side) arrivals at that same depth are ignored because the depth already has an entry.",
      "Both are O(n). BFS is the most natural fit because the problem is literally phrased per-level; the DFS version is a nice demonstration that traversal *order* can encode 'rightmost'.",
    ],
    approaches: [
      {
        name: "BFS, take the last of each level (optimal, intuitive)",
        intuition: "Level-order traverse; the final node popped on each level is the one seen from the right.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued once.",
        space: "O(n)",
        spaceWhy: "The queue holds at most one level (~n/2 nodes).",
        code: `List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        int levelSize = q.size();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = q.poll();
            if (i == levelSize - 1) res.add(node.val);  // last node on this level
            if (node.left != null) q.add(node.left);
            if (node.right != null) q.add(node.right);
        }
    }
    return res;
}`,
        walkthrough: [
          "[1,2,3,null,5,null,4]: level [1] → see 1. Level [2,3] → last is 3 → see 3.",
          "Level [5,4] (5 under 2, 4 under 3) → last is 4 → see 4. Result [1,3,4].",
        ],
      },
      {
        name: "DFS right-first, first-seen per depth",
        intuition: "Visit right subtree before left; the first node reached at each depth is the rightmost.",
        time: "O(n)",
        timeWhy: "Each node is visited once.",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h.",
        code: `List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    dfs(root, 0, res);
    return res;
}

void dfs(TreeNode node, int depth, List<Integer> res) {
    if (node == null) return;
    if (depth == res.size()) res.add(node.val);  // first arrival at this depth
    dfs(node.right, depth + 1, res);             // right BEFORE left
    dfs(node.left, depth + 1, res);
}`,
      },
    ],
    edgeCases: [
      "Empty tree → empty list.",
      "A left-only tree → you still see one node per level (the only node there), e.g. [1,2,null,3] → [1,2,3].",
      "The visible node can come from a left branch (example 1's 4) — so 'just follow right children' is wrong.",
    ],
    twists: [
      "**Left side view** → BFS keep the *first* of each level, or DFS left-first.",
      "**Largest value in each row** (LeetCode 515) → same BFS but track the max per level instead of the last.",
      "**Boundary of a tree** (LeetCode 545) → combines left boundary, leaves, and right boundary.",
    ],
    related: ["binary-tree-level-order-traversal", "maximum-depth-of-binary-tree"],
  },

  {
    slug: "count-good-nodes-in-binary-tree",
    title: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1448,
    statement:
      "A node X is **good** if no node on the path from the root down to X has a value greater than X. Given the `root`, return the number of good nodes.",
    examples: [
      { in: "root = [3,1,4,3,null,1,5]", out: "4", note: "good: root 3, the deeper 3, 4, and 5" },
      { in: "root = [3,3,null,4,2]", out: "3", note: "root 3, the child 3, and 4" },
      { in: "root = [1]", out: "1", note: "the root is always good" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁵", "−10⁴ ≤ Node.val ≤ 10⁴"],
    recognize:
      "'Good' depends on the **maximum value seen on the path from the root** to the node. That's a **DFS that threads state downward** — carry the running max as a parameter, decide at each node, recurse. State-flowing-down (vs bubbling-up) is the tell.",
    figureItOut: [
      "Decode 'good': a node X is good when it's ≥ everything above it on its root-to-X path. Equivalently, X ≥ the **maximum value among its ancestors (and itself)**. So the only fact you need at each node is the largest value seen so far on the way down.",
      "That means information flows **downward**: as you descend from parent to child, you pass along `maxSoFar`. This is the mirror image of depth/diameter, where answers bubbled *up* — here a parameter is threaded *down*.",
      "At each node: it's good if `node.val >= maxSoFar`. Then update the running max to `max(maxSoFar, node.val)` and pass that updated value into both children. The root starts with `maxSoFar = root.val` (or −∞), so it's always counted good.",
      "Count by either returning a sum from the recursion (good-here ? 1 : 0, plus the two children's sums) or incrementing a shared counter. Both visit every node once → O(n), which is optimal since 'good' can only be decided after seeing the path.",
      "The mental model worth keeping: 'downward state' (running max, running sum, current depth, path so far) is just as common as 'upward aggregation' — recognizing which direction the needed information flows tells you whether to use a parameter or a return value.",
    ],
    approaches: [
      {
        name: "DFS threading the path-max downward (optimal)",
        intuition: "Carry the largest value seen from the root; a node is good if it's at least that, then recurse with the updated max.",
        time: "O(n)",
        timeWhy: "Each node is visited once and does O(1) work (a compare and a max).",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h — O(log n) balanced, O(n) skewed.",
        code: `int goodNodes(TreeNode root) {
    return dfs(root, Integer.MIN_VALUE);
}

int dfs(TreeNode node, int maxSoFar) {
    if (node == null) return 0;
    int good = node.val >= maxSoFar ? 1 : 0;       // good if ≥ best ancestor
    int newMax = Math.max(maxSoFar, node.val);     // updated max for children
    return good + dfs(node.left, newMax) + dfs(node.right, newMax);
}`,
        walkthrough: [
          "[3,1,4,3,null,1,5], start max=−∞. Root 3 ≥ −∞ → good (count 1), pass max=3.",
          "Left 1: 1 < 3 → not good. Its child 3: 3 ≥ 3 → good. Right 4: 4 ≥ 3 → good, pass max=4.",
          "Under 4: child 1 < 4 not good; child 5 ≥ 4 → good. Total good = 3(root) + 3(deep) + 4 + 5 = 4.",
        ],
      },
    ],
    edgeCases: [
      "Single node → 1 (the root is always good).",
      "All equal values → every node is good (each is ≥ the max, since `>=` is inclusive).",
      "Strictly decreasing down a path → only the root is good on that path; using `>` instead of `>=` would wrongly drop equal-value nodes.",
    ],
    twists: [
      "**Count nodes ≥ a fixed threshold on their path** → carry the threshold instead of comparing to the running max.",
      "**Find the actual good nodes (not just the count)** → collect node references where the condition holds.",
      "**Track the running minimum instead** ('bad nodes', or visible from below) → thread a min downward instead of a max.",
    ],
    related: ["maximum-depth-of-binary-tree", "validate-binary-search-tree"],
  },

  {
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 98,
    statement:
      "Given the `root` of a binary tree, return `true` if it is a valid **binary search tree** — every node's value is strictly greater than all values in its left subtree and strictly less than all values in its right subtree.",
    examples: [
      { in: "root = [2,1,3]", out: "true" },
      { in: "root = [5,1,4,null,null,3,6]", out: "false", note: "4 is in the right subtree of 5 but 3 (under 4) is < 5 — the bound is violated" },
      { in: "root = [5,4,6,null,null,3,7]", out: "false", note: "3 sits in 5's right subtree but is < 5" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "−2³¹ ≤ Node.val ≤ 2³¹ − 1"],
    recognize:
      "The validity of a node depends on a **range it must fall inside**, determined by all its ancestors — not just its parent. 'Carry a (low, high) window down the tree' is the bounds-DFS. Alternatively, an **in-order** traversal of a valid BST is strictly increasing.",
    figureItOut: [
      "The classic trap: people check only `node.left.val < node.val < node.right.val` locally. That's wrong — example 2 shows a node (3) that's fine relative to its parent (4) but violates a *grandparent* bound (it must also be > 5 to sit in 5's right subtree). So validity is a **whole-ancestry** constraint, not a parent-only one.",
      "Reframe each node as living inside an open interval `(low, high)` it must satisfy. The root is unconstrained: `(−∞, +∞)`. When you go **left**, the value becomes the new upper bound (everything left must be smaller). When you go **right**, it becomes the new lower bound.",
      "So thread `(low, high)` **downward**: at each node check `low < node.val < high`; if it fails, the tree is invalid. Then recurse left with `(low, node.val)` and right with `(node.val, high)`. One pass, O(n).",
      "Watch the bounds type: with values up to the full int range, using `int` for ±∞ breaks. Use `Long` (or pass the parent node and compare) so `Integer.MIN_VALUE`/`MAX_VALUE` nodes don't cause false negatives.",
      "Second angle worth knowing: an **in-order traversal** of a BST yields values in strictly increasing order. So you can in-order walk and verify each value is greater than the previous one — a clean alternative that needs only the last-seen value instead of a bounds pair.",
    ],
    approaches: [
      {
        name: "DFS with (low, high) bounds (optimal, recommended)",
        intuition: "Each node must fall inside an interval; going left tightens the upper bound, going right tightens the lower bound.",
        time: "O(n)",
        timeWhy: "Each node is checked once with O(1) comparisons.",
        space: "O(h)",
        spaceWhy: "Recursion stack of height h.",
        code: `boolean isValidBST(TreeNode root) {
    return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

boolean valid(TreeNode node, long low, long high) {
    if (node == null) return true;                  // empty subtree is valid
    if (node.val <= low || node.val >= high) return false;
    return valid(node.left, low, node.val)          // left: new upper bound
        && valid(node.right, node.val, high);       // right: new lower bound
}`,
        walkthrough: [
          "[5,1,4,null,null,3,6]: root 5 in (−∞,+∞) ok. Left 1 in (−∞,5) ok. Right subtree root 4 in (5,+∞)?",
          "4 ≥ high is false, but 4 <= low (low=5) → 4 ≤ 5 → fails the lower bound → return false. Correctly invalid.",
        ],
      },
      {
        name: "In-order traversal must be increasing",
        intuition: "In-order visits a BST in sorted order, so each value must exceed the previous one.",
        time: "O(n)",
        timeWhy: "One in-order pass touching every node once.",
        space: "O(h)",
        spaceWhy: "Recursion stack; `prev` holder is O(1).",
        code: `Long prev = null;

boolean isValidBST(TreeNode root) {
    prev = null;
    return inorder(root);
}

boolean inorder(TreeNode node) {
    if (node == null) return true;
    if (!inorder(node.left)) return false;          // left subtree first
    if (prev != null && node.val <= prev) return false; // must strictly increase
    prev = (long) node.val;
    return inorder(node.right);                      // then right subtree
}`,
        walkthrough: [
          "[2,1,3] in-order yields 1, 2, 3 — strictly increasing → valid.",
          "A bad tree like [5,4,6,...3...] would emit 3 after 5 in-order → 3 ≤ 5 → return false.",
        ],
      },
    ],
    edgeCases: [
      "Single node → valid.",
      "Equal values are NOT allowed (the BST here is strict) — use `<=`/`>=` in the bound checks, not `<`/`>`.",
      "Node values at `Integer.MIN_VALUE`/`MAX_VALUE` → `int` sentinels break; use `long` bounds (or compare against parent nodes) to avoid false negatives.",
    ],
    twists: [
      "**Recover a BST with two swapped nodes** (LeetCode 99) → in-order to find the two out-of-order values, then swap them back.",
      "**Largest valid BST subtree** (LeetCode 333) → post-order returning (isBST, min, max, size) for each subtree.",
      "**kth smallest in a BST** (LeetCode 230) → in-order and stop at the kth visited node.",
    ],
    related: ["lowest-common-ancestor-of-a-binary-search-tree", "binary-search"],
  },
];
