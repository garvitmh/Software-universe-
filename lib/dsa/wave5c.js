// NeetCode 250 extras — wave 5c (trees, tries, heaps, backtracking). Java.
export const WAVE5C = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "binary-tree-inorder-traversal",
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 94,
    statement:
      "Given the `root` of a binary tree, return the values of its nodes in **inorder** traversal — left subtree, then the node itself, then the right subtree.",
    examples: [
      { in: "root = [1,null,2,3]", out: "[1,3,2]", note: "go right to 2, but 3 is 2's left child so it comes first" },
      { in: "root = []", out: "[]", note: "empty tree" },
      { in: "root = [1]", out: "[1]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "Any 'visit nodes in a specific order' on a binary tree is a **DFS traversal**. Inorder specifically means the rule **left → node → right** — and on a **BST** that rule spits the values out in sorted order, which is why inorder shows up everywhere.",
    figureItOut: [
      "Write down the rule literally: to process a subtree, first fully process its **left** child, then record **this** node's value, then fully process its **right** child. That self-referential definition is begging for recursion.",
      "Recursion is the clean version: recurse left, append the value, recurse right. The base case is a null node — do nothing and return.",
      "Interviewers often ask for the **iterative** version to see if you understand what recursion hides: it hides a **stack**. So simulate it. Walk left as far as you can, pushing every node you pass.",
      "When you can't go left anymore, the top of the stack is the next node in order — pop it, record it, then pivot to its **right** child and repeat the 'walk left' from there.",
      "The invariant: the stack always holds the chain of ancestors whose value hasn't been recorded yet and whose left side is finished.",
    ],
    approaches: [
      {
        name: "Recursive DFS",
        intuition: "Follow the definition: left, node, right.",
        time: "O(n)",
        timeWhy: "Every node is visited exactly once.",
        space: "O(h)",
        spaceWhy: "The recursion stack is as deep as the tree's height h — O(n) for a skewed tree, O(log n) when balanced.",
        code: `List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    dfs(root, res);
    return res;
}

void dfs(TreeNode node, List<Integer> res) {
    if (node == null) return;
    dfs(node.left, res);
    res.add(node.val);
    dfs(node.right, res);
}`,
        walkthrough: [
          "root=1 (right child 2, whose left child is 3). dfs(1): left is null → record 1.",
          "Then dfs(1.right=2): dfs(2.left=3) records 3 → record 2 → 2.right null.",
          "Order recorded: 1, 3, 2.",
        ],
      },
      {
        name: "Iterative with an explicit stack",
        intuition: "Push the whole left spine, pop+record, then jump to the right child and repeat.",
        time: "O(n)",
        timeWhy: "Each node is pushed once and popped once.",
        space: "O(h)",
        spaceWhy: "The stack holds at most one full root-to-leaf path of unrecorded ancestors.",
        code: `List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {       // walk all the way left
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();          // leftmost unrecorded node
        res.add(cur.val);
        cur = cur.right;            // now handle its right subtree
    }
    return res;
}`,
        walkthrough: [
          "cur=1: push 1, go left → null. Pop 1 → record 1. cur = 1.right = 2.",
          "cur=2: push 2, go left to 3, push 3, go left → null. Pop 3 → record 3. cur = 3.right = null.",
          "Stack has 2: pop 2 → record 2. cur = null, stack empty → done. [1,3,2].",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → empty list.",
      "A completely left-skewed tree → recursion depth equals n (watch for stack overflow on huge trees; the iterative version has the same O(n) heap stack but won't blow the call stack).",
      "Single node → just that value.",
    ],
    twists: [
      "**Preorder** (node, left, right) → record before recursing; iteratively push right child then left child.",
      "**Postorder** (left, right, node) → trickier iteratively; one trick is to do a reversed 'node, right, left' and flip the result.",
      "**Morris traversal** → O(1) space by temporarily threading each node to its inorder predecessor.",
      "**Inorder on a BST** → the output is sorted; this is the basis for *kth smallest* and *validate BST*.",
    ],
    related: ["binary-search-tree-iterator", "binary-tree-level-order-traversal", "validate-binary-search-tree"],
  },

  {
    slug: "path-sum",
    title: "Path Sum",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 112,
    statement:
      "Given the `root` of a binary tree and an integer `targetSum`, return `true` if there is a **root-to-leaf** path whose node values add up exactly to `targetSum`. A leaf is a node with no children.",
    examples: [
      { in: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", out: "true", note: "5 → 4 → 11 → 2 = 22" },
      { in: "root = [1,2,3], targetSum = 5", out: "false", note: "paths sum to 3 and 4" },
      { in: "root = [], targetSum = 0", out: "false", note: "no path exists in an empty tree" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 5000", "−1000 ≤ Node.val ≤ 1000", "−1000 ≤ targetSum ≤ 1000"],
    recognize:
      "'Does a **root-to-leaf path** satisfy a property' is a depth-first recursion where you **carry a running value down** the tree and check the condition **at the leaves**. The key subtlety is the definition of 'leaf'.",
    figureItOut: [
      "A path goes from the root straight down to a leaf. As you descend, the remaining amount you still need shrinks by the current node's value. So pass `targetSum − node.val` down to the children.",
      "The decision can only be made at a **leaf** — a node with no left and no right child. There, ask: is the remaining target exactly equal to this leaf's value? If yes, the path works.",
      "So the base reasoning: subtract the current value; if this is a leaf, success means the remainder hit zero. Otherwise recurse into whichever children exist and OR the results — any successful path anywhere is enough.",
      "Watch the trap: don't treat a node with one missing child as a leaf. `[1,2]` (only a left child 2) with target 1 is **false** — the only root-to-leaf path is 1→2 = 3, not just the root.",
      "Empty tree is always false: there are no paths at all, so nothing can sum to the target.",
    ],
    approaches: [
      {
        name: "DFS carrying the remaining sum",
        intuition: "Subtract as you go down; at a leaf, check whether the remainder equals the leaf's value.",
        time: "O(n)",
        timeWhy: "In the worst case every node is visited once.",
        space: "O(h)",
        spaceWhy: "Recursion depth equals the tree height h.",
        code: `boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) {
        return targetSum == root.val;        // leaf: did we land exactly?
    }
    int remaining = targetSum - root.val;
    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}`,
        walkthrough: [
          "target 22, root 5 → remaining 17 to find below. Go left to 4 → remaining 13.",
          "Down to 11 → remaining 2. 11 has children 7 and 2.",
          "Leaf 7: 2 == 7? no. Leaf 2: 2 == 2? yes → bubbles up true.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → false regardless of targetSum (even targetSum 0).",
      "A node with exactly one child is NOT a leaf — you must descend into the existing child only.",
      "Negative values mean the running sum can go up and down — you can't prune early just because you 'overshot'.",
    ],
    twists: [
      "**Path Sum II** (LeetCode 113) → return all such paths; backtrack, appending and removing each node from a running list.",
      "**Path Sum III** (LeetCode 437) → count paths that start and end anywhere (not just root-to-leaf); use a prefix-sum hash map.",
      "**Maximum path sum** (LeetCode 124) → paths can bend through a node; return the best, allowing partial subtrees.",
    ],
    related: ["binary-tree-maximum-path-sum", "maximum-depth-of-binary-tree", "binary-tree-level-order-traversal"],
  },

  {
    slug: "symmetric-tree",
    title: "Symmetric Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 101,
    statement:
      "Given the `root` of a binary tree, return `true` if it is a **mirror of itself** — symmetric around its center.",
    examples: [
      { in: "root = [1,2,2,3,4,4,3]", out: "true", note: "left and right subtrees mirror each other" },
      { in: "root = [1,2,2,null,3,null,3]", out: "false", note: "the 3s sit on the same side, not mirrored" },
      { in: "root = [1]", out: "true" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 1000", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "'Is the tree a mirror of itself' is **not** a single-tree walk — it's comparing **two subtrees against each other** in mirrored order. The shape is the same-tree recursion, but with the two sides flipped: left-vs-right and right-vs-left.",
    figureItOut: [
      "Symmetry is a property of two halves, so reframe it: the **left** subtree must be the mirror image of the **right** subtree. The root's own value doesn't matter for symmetry.",
      "Define a helper that takes two nodes (a, b) and asks 'are these two trees mirror images?'. That's the right abstraction — one node alone can't tell you anything.",
      "Two trees mirror each other when: their roots have equal values, AND a's **left** mirrors b's **right**, AND a's **right** mirrors b's **left**. Notice the crossing — that's what 'mirror' means versus 'identical'.",
      "Base cases: both null → mirror (true). Exactly one null → not mirror (false). Different values → false.",
      "An iterative version uses a queue, enqueuing the pairs to compare two at a time — same logic, no recursion.",
    ],
    approaches: [
      {
        name: "Recursive mirror check",
        intuition: "Compare the left subtree against the right subtree with the children crossed.",
        time: "O(n)",
        timeWhy: "Each pair of mirrored nodes is compared once; n nodes total.",
        space: "O(h)",
        spaceWhy: "Recursion depth equals the tree height.",
        code: `boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    return isMirror(root.left, root.right);
}

boolean isMirror(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    return a.val == b.val
        && isMirror(a.left, b.right)    // outer pair
        && isMirror(a.right, b.left);   // inner pair (crossed)
}`,
        walkthrough: [
          "root 1 → compare left(2) with right(2): equal.",
          "Compare 2L.left(3) with 2R.right(3): equal. Compare 2L.right(4) with 2R.left(4): equal.",
          "All children null beyond → every pair matches → true.",
        ],
      },
      {
        name: "Iterative with a queue of pairs",
        intuition: "Enqueue the pairs to compare; pull two at a time and push their mirrored children.",
        time: "O(n)",
        timeWhy: "Every node enters the queue once.",
        space: "O(n)",
        spaceWhy: "The queue can hold up to a full level of node pairs.",
        code: `boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    Deque<TreeNode> q = new ArrayDeque<>();
    q.offer(root.left);
    q.offer(root.right);
    while (!q.isEmpty()) {
        TreeNode a = q.poll(), b = q.poll();
        if (a == null && b == null) continue;
        if (a == null || b == null || a.val != b.val) return false;
        q.offer(a.left);  q.offer(b.right);   // outer pair
        q.offer(a.right); q.offer(b.left);    // inner pair
    }
    return true;
}`,
      },
    ],
    edgeCases: [
      "Single node → trivially symmetric → true.",
      "Same values but mismatched structure (one side has a child the mirror lacks) → false; the one-null check catches it.",
      "Don't confuse with *same tree* — here the comparison crosses the children, not straight across.",
    ],
    twists: [
      "**Same Tree** (LeetCode 100) → compare left-with-left and right-with-right (no crossing).",
      "**Invert the tree, then compare to the original** → an alternative but wasteful way to test symmetry.",
      "**Count symmetric subtrees** → run the mirror check rooted at each node.",
    ],
    related: ["same-tree", "invert-binary-tree", "subtree-of-another-tree"],
  },

  {
    slug: "binary-search-tree-iterator",
    title: "Binary Search Tree Iterator",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 173,
    statement:
      "Implement an iterator over a BST that returns its values in **ascending order**. `next()` returns the next-smallest value; `hasNext()` says whether one remains. `next()` and `hasNext()` should run in **amortized O(1)** time and the iterator should use **O(h)** memory, where h is the tree height.",
    examples: [
      { in: "init [7,3,15,null,null,9,20]; next, next, hasNext, next, hasNext", out: "3, 7, true, 9, true", note: "inorder is 3,7,9,15,20" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁵", "0 ≤ Node.val ≤ 10⁶", "At most 10⁵ calls to next/hasNext"],
    recognize:
      "Ascending order in a BST = **inorder traversal**. But you can't precompute the whole list — the O(h) memory cap forbids it. The trick is to **pause** an inorder traversal mid-flight, which means doing the iterative-stack inorder one `next()` at a time.",
    figureItOut: [
      "Start from the easy-but-disallowed idea: do a full inorder traversal into an array, then hand out elements. That's O(1) per call but O(n) memory — it violates the O(h) requirement and the 'don't precompute' spirit.",
      "Recall the iterative inorder: push the entire left spine, then pop-and-emit, then move to the right child and push its left spine. The stack at any moment holds exactly the **ancestors not yet emitted** — and that's at most h nodes. There's your O(h).",
      "So freeze that algorithm between emissions. In the constructor, push the left spine from the root. The stack top is now the smallest value, ready for the first `next()`.",
      "`next()`: pop the top (the current smallest), and before returning it, push the left spine of its **right** child — that primes the next-smallest. `hasNext()` is just 'is the stack non-empty'.",
      "Why amortized O(1)? Each node is pushed exactly once and popped exactly once across the whole iteration. Spread over n calls, that's constant per call even though a single `next()` might push a long spine.",
    ],
    approaches: [
      {
        name: "Controlled iterative inorder with a stack",
        intuition: "Keep the stack of pending ancestors (the left spine); each next() pops one and primes the right subtree.",
        time: "O(1) amortized per call",
        timeWhy: "Each of the n nodes is pushed once and popped once over the iterator's lifetime — n pushes/pops spread across n calls.",
        space: "O(h)",
        spaceWhy: "The stack only ever holds one root-to-current path of unemitted ancestors.",
        code: `class BSTIterator {
    private Deque<TreeNode> stack = new ArrayDeque<>();

    public BSTIterator(TreeNode root) {
        pushLeft(root);
    }

    public int next() {
        TreeNode node = stack.pop();   // smallest remaining
        pushLeft(node.right);          // prime the next-smallest
        return node.val;
    }

    public boolean hasNext() {
        return !stack.isEmpty();
    }

    private void pushLeft(TreeNode node) {
        while (node != null) {
            stack.push(node);
            node = node.left;
        }
    }
}`,
        walkthrough: [
          "Tree [7,3,15,null,null,9,20]. Constructor pushes left spine of 7: push 7, push 3 (no left). Stack top = 3.",
          "next() → pop 3, push left spine of 3.right (null) → returns 3. Stack: [7].",
          "next() → pop 7, push left spine of 7.right=15 → push 15, push 9 → returns 7. Stack top = 9.",
          "hasNext() → true. next() → pop 9, push 9.right (null) → returns 9.",
        ],
      },
    ],
    edgeCases: [
      "Single-node tree → one next() returns its value, then hasNext() is false.",
      "Right-skewed tree → each next() pushes nothing extra after the first; left-skewed → constructor pushes the whole spine but that's still ≤ h.",
      "Calling next() when hasNext() is false is undefined by the contract — guard with hasNext() in client code.",
    ],
    twists: [
      "**next() and prev()** (a bidirectional iterator) → maintain two stacks, or fall back to a precomputed array if O(n) memory is allowed.",
      "**Iterate within a range [lo, hi]** → skip the constructor's spine to lo, stop when the value exceeds hi.",
      "**Kth smallest** (LeetCode 230) → just call next() k times.",
    ],
    related: ["binary-tree-inorder-traversal", "kth-smallest-element-in-a-bst", "validate-binary-search-tree"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "replace-words",
    title: "Replace Words",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 648,
    statement:
      "Given a `dictionary` of root words and a `sentence`, replace every word in the sentence with the **shortest root** that is a prefix of it. If no root applies, leave the word unchanged. Return the rewritten sentence.",
    examples: [
      { in: 'dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"', out: '"the cat was rat by the bat"' },
      { in: 'dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"', out: '"a a b c"' },
    ],
    constraints: ["1 ≤ dictionary.length ≤ 1000", "1 ≤ sentence words ≤ 1000", "lowercase letters only"],
    recognize:
      "You have many root words and you repeatedly ask 'does any root form a **prefix** of this word, and which is shortest?'. Repeated prefix queries over a set of strings is the textbook **trie** signal.",
    figureItOut: [
      "Brute force: for each word, test it against every root — for a length-L word and D roots that's O(D·L) per word. Workable but wasteful; the roots share prefixes you keep re-checking.",
      "Reframe what you actually need: while scanning a word left to right, you want to stop at the **first** dictionary root you complete. 'Shortest prefix' = the earliest root encountered as you walk the characters.",
      "A trie stores all roots so shared prefixes share nodes. Insert each root, marking the node where a root **ends**.",
      "Then for each sentence word, walk the trie character by character. The instant you hit a node flagged as a root-end, that's the shortest matching root — emit it and stop. If you fall off the trie (no child) before hitting a root-end, the word has no root → keep it as-is.",
      "Walking is O(L) per word, independent of how many roots exist — that's the trie payoff.",
    ],
    approaches: [
      {
        name: "Trie of roots, shortest-prefix lookup",
        intuition: "Build a trie of roots; for each word, follow it until the first root-end node, or until you run out of trie.",
        time: "O(D·R + W·L)",
        timeWhy: "Building inserts D roots of total length R; querying walks each of the W words up to its length L (capped at the matched root).",
        space: "O(D·R)",
        spaceWhy: "The trie stores at most one node per character across all roots.",
        code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isRoot = false;
}

String replaceWords(List<String> dictionary, String sentence) {
    TrieNode root = new TrieNode();
    for (String word : dictionary) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isRoot = true;
    }

    String[] words = sentence.split(" ");
    StringBuilder out = new StringBuilder();
    for (int w = 0; w < words.length; w++) {
        if (w > 0) out.append(' ');
        out.append(shortestRoot(root, words[w]));
    }
    return out.toString();
}

String shortestRoot(TrieNode root, String word) {
    TrieNode node = root;
    StringBuilder prefix = new StringBuilder();
    for (char c : word.toCharArray()) {
        int i = c - 'a';
        if (node.children[i] == null) return word;   // fell off the trie
        prefix.append(c);
        node = node.children[i];
        if (node.isRoot) return prefix.toString();    // first (shortest) root
    }
    return word;                                      // word itself never reached a root-end
}`,
        walkthrough: [
          'Roots cat/bat/rat inserted. Word "cattle": walk c→a→t, node t is flagged isRoot → return "cat".',
          'Word "was": walk w → no child under root → return "was" unchanged.',
          'Word "rattled": r→a→t hits root-end → return "rat".',
        ],
      },
    ],
    edgeCases: [
      "A word equal to a root exactly → returns the root (itself).",
      "No applicable root → the word is returned unchanged.",
      "Multiple roots are prefixes (e.g. 'a' and 'ab' both prefix 'abc') → the trie naturally returns 'a', the shortest, because you stop at the first root-end.",
    ],
    twists: [
      "**Longest matching root instead of shortest** → don't stop at the first root-end; keep walking and remember the last one seen.",
      "**Roots can be added/removed dynamically** → the trie supports incremental insertion cheaply.",
      "**Case-insensitive / Unicode** → swap the fixed 26-array for a HashMap<Character,TrieNode>.",
    ],
    related: ["implement-trie-prefix-tree", "map-sum-pairs", "design-add-and-search-words-data-structure"],
  },

  {
    slug: "map-sum-pairs",
    title: "Map Sum Pairs",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 677,
    statement:
      "Design a structure with two operations. `insert(key, val)` stores a string key with an integer value (overwriting if the key already exists). `sum(prefix)` returns the **total of the values of all keys that start with** the given prefix.",
    examples: [
      { in: 'insert("apple", 3); sum("ap")', out: "3", note: 'only "apple" starts with "ap"' },
      { in: 'insert("app", 2); sum("ap")', out: "5", note: '"apple"(3) + "app"(2)' },
      { in: 'insert("apple", 1) [overwrite]; sum("ap")', out: "3", note: '"apple" is now 1, plus "app"(2)' },
    ],
    constraints: ["1 ≤ key, prefix length ≤ 50", "lowercase letters", "0 ≤ val ≤ 1000", "at most 50 calls each"],
    recognize:
      "'Sum the values of everything sharing a **prefix**' is a trie problem — but with values attached. The clean version stores a running prefix-sum **on every node along the key's path**, so `sum(prefix)` is a single O(len) walk.",
    figureItOut: [
      "Naive: keep a HashMap of key→value, and for `sum(prefix)` scan every key checking `startsWith`. Simple, but O(number of keys × length) per query.",
      "A trie naturally groups keys by shared prefix. One option: walk to the prefix node, then DFS the whole subtree summing values at key-end nodes. Correct, but the DFS can be large.",
      "Better: push the work to insert time. Store at **each node** the sum of values of all keys passing through it. Then `sum(prefix)` just walks to the prefix node and reads its stored total — O(len).",
      "The catch is **overwrites**: inserting an existing key shouldn't double-count. So track each key's previous value (a side HashMap). On insert, compute the **delta** = newVal − oldVal, and add that delta to every node on the path. A brand-new key has oldVal 0, so delta = newVal.",
      "That delta trick keeps every node's running total correct no matter how many times a key is updated.",
    ],
    approaches: [
      {
        name: "Trie with prefix-sum on each node (delta updates)",
        intuition: "Each node holds the sum through it; insert adds (newVal − oldVal) along the path so overwrites stay correct.",
        time: "O(L) per insert and per sum",
        timeWhy: "Both operations walk one path of length L (the key or prefix length).",
        space: "O(total characters inserted)",
        spaceWhy: "One trie node per distinct character position across all keys.",
        code: `class MapSum {
    private static class Node {
        Node[] children = new Node[26];
        int sum = 0;
    }

    private final Node root = new Node();
    private final Map<String, Integer> vals = new HashMap<>();

    public void insert(String key, int val) {
        int delta = val - vals.getOrDefault(key, 0);  // new contribution
        vals.put(key, val);
        Node node = root;
        for (char c : key.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new Node();
            node = node.children[i];
            node.sum += delta;                         // update every prefix node
        }
    }

    public int sum(String prefix) {
        Node node = root;
        for (char c : prefix.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return 0;    // no key has this prefix
            node = node.children[i];
        }
        return node.sum;
    }
}`,
        walkthrough: [
          'insert("apple",3): delta 3 → nodes a,p,p,l,e each += 3.',
          'insert("app",2): delta 2 → nodes a,p,p each += 2. Now node "ap" sum = 3+2 = 5.',
          'sum("ap"): walk a→p → return 5.',
          'insert("apple",1): delta = 1 − 3 = −2 → path a,p,p,l,e each −= 2. sum("ap") now 5 − 2 = 3.',
        ],
      },
    ],
    edgeCases: [
      "Overwriting a key must not double-count — the delta (newVal − oldVal) handles it.",
      "Prefix not present in any key → walk falls off the trie → return 0.",
      "Prefix equal to a full key still sums all longer keys that extend it.",
    ],
    twists: [
      "**Count keys with a prefix** instead of summing values → store a count per node and += 1 / handle overwrite as no-op.",
      "**Deletion** → insert(key, 0) effectively removes its contribution via a negative delta.",
      "**Sum over a suffix** → build the trie on reversed keys.",
    ],
    related: ["implement-trie-prefix-tree", "replace-words", "design-add-and-search-words-data-structure"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "kth-smallest-element-in-a-sorted-matrix",
    title: "Kth Smallest Element in a Sorted Matrix",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 378,
    statement:
      "Given an `n × n` matrix where each row and each column is sorted ascending, return the **kth smallest** element in the matrix (counting duplicates by their value, in overall sorted order).",
    examples: [
      { in: "matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8", out: "13" },
      { in: "matrix = [[-5]], k = 1", out: "-5" },
    ],
    constraints: ["1 ≤ n ≤ 300", "1 ≤ k ≤ n²", "each row and column sorted ascending"],
    recognize:
      "'kth smallest across several sorted sequences' is the **merge-K-sorted-lists** shape → a **min-heap**. Each row is a sorted list; pop the global minimum k times. (There's also a slick binary-search-on-value answer — worth knowing.)",
    figureItOut: [
      "Brute force: flatten all n² elements into an array, sort, take index k−1. O(n² log n). Correct, ignores the sortedness — we can exploit the rows.",
      "Each row is already sorted. The overall smallest unseen element must be the current front of **some** row. That's exactly the merge-K-lists situation: a min-heap holding one candidate per row, each tagged with where it came from.",
      "Seed the heap with the first element of each row: (value, row, col=0). Pop the smallest; that's the next element in global order. Then push the **next element in that same row** (col+1) as the replacement candidate.",
      "Pop k times; the kth pop is the answer. The heap never holds more than n entries (one per row).",
      "Alternative worth knowing: binary-search on the **value** range [matrix[0][0], matrix[n-1][n-1]]. For a guessed value mid, count how many elements are ≤ mid (walk from bottom-left in O(n)). Adjust the range until the count first reaches k. That's O(n log(range)) and O(1) space.",
    ],
    approaches: [
      {
        name: "Min-heap merging the rows",
        intuition: "Hold one candidate per row in a heap; pop the smallest k times, refilling from the same row.",
        time: "O(k log n)",
        timeWhy: "k pops, each a heap operation on at most n entries.",
        space: "O(n)",
        spaceWhy: "The heap holds at most one entry per row.",
        code: `int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    // heap of {value, row, col}, ordered by value
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int r = 0; r < Math.min(n, k); r++) {
        heap.offer(new int[]{matrix[r][0], r, 0});
    }
    int result = 0;
    for (int i = 0; i < k; i++) {
        int[] top = heap.poll();
        result = top[0];
        int r = top[1], c = top[2];
        if (c + 1 < n) heap.offer(new int[]{matrix[r][c + 1], r, c + 1});
    }
    return result;
}`,
        walkthrough: [
          "Seed heap with row fronts: 1, 10, 12. Pop 1 (push 5). Pop 5 (push 9). Pop 9 (row done).",
          "Pop 10 (push 11). Pop 11 (push 13). Pop 12 (push 13). Pop 13. That's the 8th pop → 13.",
        ],
      },
      {
        name: "Binary search on the value (O(1) space)",
        intuition: "Guess a value; count elements ≤ it in O(n) by walking from the bottom-left; squeeze the range until the count first equals k.",
        time: "O(n log(max − min))",
        timeWhy: "Each binary-search step counts in O(n); the value range halves each step.",
        space: "O(1)",
        spaceWhy: "Only a few integer variables — no heap.",
        code: `int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    int lo = matrix[0][0], hi = matrix[n - 1][n - 1];
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (countLessEqual(matrix, mid) >= k) hi = mid;   // enough ≤ mid → answer ≤ mid
        else lo = mid + 1;
    }
    return lo;
}

int countLessEqual(int[][] matrix, int target) {
    int n = matrix.length, count = 0;
    int r = n - 1, c = 0;                 // start at bottom-left
    while (r >= 0 && c < n) {
        if (matrix[r][c] <= target) { count += r + 1; c++; }  // whole column up to r qualifies
        else r--;
    }
    return count;
}`,
      },
    ],
    edgeCases: [
      "1×1 matrix → the single element regardless of k (k must be 1).",
      "Duplicate values are counted as separate elements by position, so the kth smallest is by value-with-multiplicity.",
      "Seeding only min(n, k) rows in the heap is a small optimization — you never need more rows than k pops.",
    ],
    twists: [
      "**Kth largest** → either negate values, or count elements ≥ mid.",
      "**Find K pairs with smallest sums** (LeetCode 373) → same merge-with-heap idea over two arrays.",
      "**Matrix only row-sorted (not column-sorted)** → the binary-search count must scan each row (O(n log n) per step).",
    ],
    related: ["k-closest-points-to-origin", "kth-largest-element-in-an-array", "find-median-from-data-stream"],
  },

  {
    slug: "reorganize-string",
    title: "Reorganize String",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 767,
    statement:
      "Given a string `s`, rearrange its characters so that **no two adjacent characters are the same**. Return any valid rearrangement, or an empty string if it's impossible.",
    examples: [
      { in: 's = "aab"', out: '"aba"' },
      { in: 's = "aaab"', out: '""', note: "too many a's to separate" },
    ],
    constraints: ["1 ≤ s.length ≤ 500", "lowercase English letters"],
    recognize:
      "'Arrange items so identical ones aren't adjacent' is a **greedy-with-a-max-heap** problem: always place the character you have **most** of next (as long as it isn't the one you just placed). 'Most frequent first' → a max-heap by count.",
    figureItOut: [
      "First, when is it even possible? If some character's count exceeds ⌈n/2⌉, you can't keep them apart — there aren't enough other slots between them. That's the impossibility check.",
      "Greedy intuition: the dangerous character is the most frequent one. So at each step, place the character with the **highest remaining count** — that's the one most at risk of being forced together later.",
      "But you can't place the same character twice in a row. So hold back the character you just used for **one** turn: place the current most-frequent, then make it eligible again only after the next placement.",
      "A max-heap keyed on remaining count gives you 'most frequent available' in O(log 26). Pop the top, append it, decrement; keep the just-used character aside, and push it back on the following iteration once it's no longer adjacent.",
      "If at some point the heap is empty but you still owe a character (the held-back one is the only thing left and still has count), it's impossible — return empty.",
    ],
    approaches: [
      {
        name: "Max-heap by frequency, place-then-hold",
        intuition: "Repeatedly place the most frequent character that isn't the previous one; reintroduce the previous after placing.",
        time: "O(n log k)",
        timeWhy: "n placements, each a heap operation over k ≤ 26 distinct characters.",
        space: "O(k)",
        spaceWhy: "Counts and a heap over the alphabet (constant 26).",
        code: `String reorganizeString(String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;

    // max-heap of {charIndex, remainingCount}, ordered by count desc
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[1] - a[1]);
    for (int i = 0; i < 26; i++) {
        if (count[i] > 0) heap.offer(new int[]{i, count[i]});
    }

    StringBuilder sb = new StringBuilder();
    int[] prev = null;                       // the character held back for one turn
    while (!heap.isEmpty()) {
        int[] cur = heap.poll();
        sb.append((char) ('a' + cur[0]));
        cur[1]--;
        if (prev != null && prev[1] > 0) heap.offer(prev);  // re-enable previous
        prev = cur;                          // hold current back for the next turn
    }
    return sb.length() == s.length() ? sb.toString() : "";
}`,
        walkthrough: [
          '"aab": counts a:2, b:1. Heap top a(2). Place a → "a", a now 1, hold a.',
          'Top b(1). Place b → "ab". Re-enable a(1). Hold b.',
          'Top a(1). Place a → "aba". a now 0. Heap empties. Length matches → "aba".',
        ],
      },
    ],
    edgeCases: [
      "A single character → it's already valid (no adjacency possible).",
      "Most frequent count > ⌈n/2⌉ (e.g. \"aaab\") → impossible → empty string; the length check at the end catches it.",
      "All distinct characters → any order works; the heap just hands them out.",
    ],
    twists: [
      "**Place items at least k apart** (Task Scheduler / LeetCode 358 'Rearrange k distance apart') → hold back the last k used in a queue instead of just one.",
      "**Return whether it's possible only** → just compare maxCount against ⌈n/2⌉ without building the string.",
      "**Counting-based O(n) variant** → place the most frequent char at even indices first, then fill the rest, no heap needed.",
    ],
    related: ["task-scheduler", "top-k-frequent-words", "last-stone-weight"],
  },

  {
    slug: "top-k-frequent-words",
    title: "Top K Frequent Words",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 692,
    statement:
      "Given a list of `words` and an integer `k`, return the **k most frequent** words. Sort the answer by **frequency descending**, and break ties by **lexicographical (alphabetical) order**.",
    examples: [
      { in: 'words = ["i","love","leetcode","i","love","coding"], k = 2', out: '["i","love"]', note: "both appear twice; 'i' < 'love' alphabetically" },
      { in: 'words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4', out: '["the","is","sunny","day"]' },
    ],
    constraints: ["1 ≤ words.length ≤ 500", "1 ≤ word length ≤ 10", "lowercase letters", "1 ≤ k ≤ number of unique words"],
    recognize:
      "'Top K by frequency' is the classic **heap** problem — but the twist is the **two-level ordering**: frequency descending, then alphabetical ascending. The comparator must encode both, and the heap direction interacts with the tie-break, so get the comparator exactly right.",
    figureItOut: [
      "Step one is always the same for frequency problems: count occurrences with a hash map (word → count).",
      "Now you want the k entries with the highest counts, ties broken alphabetically. Sorting all unique words by that combined key and taking the first k is the simplest correct answer — O(m log m) for m unique words.",
      "To do better than full sorting, use a **size-k heap**. Keep a heap of k candidates and evict the 'worst' as better ones arrive — that's O(m log k).",
      "The subtlety: 'worst' must match the final order. The final order is count desc, then word asc. So the heap should be a **min-heap of that order's reverse**: its top is the entry most deserving of eviction — lowest count, and among equal counts the alphabetically **largest** word. Compare counts ascending, and on equal counts compare words **descending**.",
      "After pushing all words and trimming to size k, pop everything out — they come off worst-first, so reverse the popped sequence (or push to the front of a list) to get the required order.",
    ],
    approaches: [
      {
        name: "Size-k min-heap with a two-level comparator",
        intuition: "Keep only k candidates; the heap top is the next to evict — lowest count, alphabetically last on ties.",
        time: "O(m log k)",
        timeWhy: "m unique words, each pushed/popped on a heap capped at size k.",
        space: "O(m)",
        spaceWhy: "The count map holds all m unique words; the heap is O(k).",
        code: `List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> count = new HashMap<>();
    for (String w : words) count.merge(w, 1, Integer::sum);

    // Min-heap: top = lowest frequency; tie → alphabetically LAST word (so it leaves first).
    PriorityQueue<String> heap = new PriorityQueue<>((a, b) -> {
        int fa = count.get(a), fb = count.get(b);
        if (fa != fb) return fa - fb;          // lower frequency first (evicted first)
        return b.compareTo(a);                 // on a tie, larger word first (evicted first)
    });

    for (String w : count.keySet()) {
        heap.offer(w);
        if (heap.size() > k) heap.poll();      // drop the current worst
    }

    LinkedList<String> res = new LinkedList<>();
    while (!heap.isEmpty()) res.addFirst(heap.poll());  // reverse: best ends up first
    return res;
}`,
        walkthrough: [
          'Counts: i:2, love:2, leetcode:1, coding:1. k=2.',
          'Heap fills; once size > 2 it evicts the worst. leetcode and coding (count 1) get dropped first.',
          'Remaining: i and love (both 2). Popping worst-first off a min-heap gives love then i; addFirst reverses → ["i","love"].',
        ],
      },
    ],
    edgeCases: [
      "Ties on frequency must break alphabetically ascending in the output — the comparator's `b.compareTo(a)` (descending) makes the heap evict the alphabetically larger one first, leaving the smaller.",
      "k equals the number of unique words → return all of them, fully ordered.",
      "Words with equal counts AND you forget the tie-break → wrong order; this is the most common bug.",
    ],
    twists: [
      "**Top K Frequent Elements** (LeetCode 347, numbers) → same idea without the alphabetical tie-break; bucket sort by count gives O(n).",
      "**Stream of words** → maintain the heap incrementally as words arrive.",
      "**Sort fully instead of size-k heap** → simpler to reason about when k is close to m.",
    ],
    related: ["kth-largest-element-in-an-array", "reorganize-string", "task-scheduler"],
  },

  {
    slug: "minimum-cost-to-connect-sticks",
    title: "Minimum Cost to Connect Sticks",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1167,
    statement:
      "You have sticks with lengths in `sticks`. Connecting two sticks of lengths x and y costs `x + y` and produces one stick of length `x + y`. Keep connecting until a single stick remains. Return the **minimum total cost**.",
    examples: [
      { in: "sticks = [2,4,3]", out: "14", note: "2+3=5 (cost 5), then 5+4=9 (cost 9) → 14" },
      { in: "sticks = [1,8,3,5]", out: "30" },
      { in: "sticks = [5]", out: "0", note: "already a single stick" },
    ],
    constraints: ["1 ≤ sticks.length ≤ 10⁴", "1 ≤ sticks[i] ≤ 10⁴"],
    recognize:
      "Every connection's cost is the new combined length, and that combined stick gets connected again — so **short sticks should be merged early** to avoid their length being re-added many times. 'Always combine the two smallest next' → a **min-heap** (this is exactly Huffman coding).",
    figureItOut: [
      "Notice a stick's length is paid **every time** it's part of a connection. A stick merged early then carried through many later merges contributes its length over and over. So you want big sticks involved in **few** merges and small sticks merged first.",
      "Greedy claim: at each step, combine the **two smallest** available sticks. The small ones get 'locked in' early and the resulting larger stick participates in fewer future additions. This is precisely how Huffman trees minimize weighted path length.",
      "To always grab the two smallest efficiently, keep all lengths in a **min-heap**. Pop the two smallest, their sum is this step's cost, add it to the total, and push the sum back as a new stick.",
      "Repeat until one stick remains (heap size 1). Each pop/push is O(log n); there are about n−1 merges.",
      "Edge thought: a single stick needs no connections → cost 0. The loop condition `heap.size() > 1` handles that for free.",
    ],
    approaches: [
      {
        name: "Min-heap, always merge the two smallest (Huffman)",
        intuition: "Repeatedly combine the two cheapest sticks; their sum is both the cost and the next stick.",
        time: "O(n log n)",
        timeWhy: "Building the heap is O(n); each of ~n merges does O(log n) heap work.",
        space: "O(n)",
        spaceWhy: "The heap holds all the stick lengths.",
        code: `int connectSticks(int[] sticks) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int s : sticks) heap.offer(s);

    int total = 0;
    while (heap.size() > 1) {
        int a = heap.poll();          // two smallest
        int b = heap.poll();
        int cost = a + b;
        total += cost;
        heap.offer(cost);             // the combined stick re-enters
    }
    return total;
}`,
        walkthrough: [
          "sticks [2,4,3] → heap {2,3,4}. Pop 2,3 → cost 5, total 5, push 5 → {4,5}.",
          "Pop 4,5 → cost 9, total 14, push 9 → {9}. Size 1 → stop. Total 14.",
        ],
      },
    ],
    edgeCases: [
      "Single stick → no merges → cost 0.",
      "All equal lengths → still merge two-at-a-time; the greedy order doesn't change correctness.",
      "Large inputs: the running sums can grow, but they stay within int for the given constraints (use long if lengths or counts were larger).",
    ],
    twists: [
      "**Huffman encoding** (LeetCode-style 'optimal merge') → identical algorithm; the merge tree gives prefix codes.",
      "**Connect into exactly m groups instead of one** → stop when the heap size reaches m.",
      "**Each merge has a fixed surcharge** → add the surcharge to each step's cost; greedy still holds.",
    ],
    related: ["last-stone-weight", "kth-largest-element-in-an-array", "reorganize-string"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "permutations-ii",
    title: "Permutations II",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 47,
    statement:
      "Given a collection `nums` that **may contain duplicates**, return all **unique** permutations in any order.",
    examples: [
      { in: "nums = [1,1,2]", out: "[[1,1,2],[1,2,1],[2,1,1]]" },
      { in: "nums = [1,2,3]", out: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 8", "−10 ≤ nums[i] ≤ 10"],
    recognize:
      "'All permutations' is backtracking — choose an unused element at each position. The duplicate-handling twist is the whole point: **sort first**, then at each position skip a value equal to its predecessor when that predecessor hasn't been used in this branch. That prevents emitting the same permutation twice.",
    figureItOut: [
      "Start from plain Permutations: at each position, try every element not yet used; mark it used, recurse, then unmark (backtrack). That generates all n! orderings.",
      "With duplicates, that overcounts: swapping two identical values gives the 'same' permutation but the algorithm treats them as different choices. You'd emit [1,1,2] twice.",
      "Fix it by deciding a **canonical order** among equal values: among a run of identical numbers, you only ever use them left-to-right. So **sort** nums to bring duplicates together.",
      "Then at each position, when you consider a value, skip it if it equals the previous value AND that previous identical value is **not currently used** in this branch. 'Previous not used' means we're at the same decision level and already tried that value here — using this duplicate would repeat that subtree.",
      "Carefully: `nums[i] == nums[i-1] && !used[i-1]` is the skip condition. If `used[i-1]` were true, the duplicate is being used deeper in the path (legitimate); only when the earlier identical one is free does choosing this one duplicate work.",
    ],
    approaches: [
      {
        name: "Sort + backtrack with a used[] and duplicate skip",
        intuition: "Sort so equals are adjacent; at each level skip a value equal to its predecessor when the predecessor is unused, enforcing left-to-right use of duplicates.",
        time: "O(n · n!)",
        timeWhy: "Up to n! permutations, each costing O(n) to build/copy; duplicate-skipping only prunes.",
        space: "O(n)",
        spaceWhy: "Recursion depth n plus the used[] array and current path (output excluded).",
        code: `List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);                       // bring duplicates together
    List<List<Integer>> res = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>(), res);
    return res;
}

void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == nums.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        // skip a duplicate whose identical predecessor hasn't been used at this level
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
        used[i] = true;
        path.add(nums[i]);
        backtrack(nums, used, path, res);
        path.remove(path.size() - 1);        // undo
        used[i] = false;
    }
}`,
        walkthrough: [
          "Sorted [1,1,2]. Position 0: pick nums[0]=1 (used[0]). Skip nums[1]=1 only if used[0] false — here used[0] is true, so the deeper level CAN use the second 1.",
          "Build 1,1,2. Backtrack. Try position 0 = nums[1]=1? predecessor nums[0] unused → SKIP (prevents duplicate of the first branch).",
          "Position 0 = 2 → then 1,1 → [2,1,1]. Unique set: [1,1,2],[1,2,1],[2,1,1].",
        ],
      },
    ],
    edgeCases: [
      "All identical (e.g. [2,2,2]) → exactly one permutation.",
      "No duplicates → behaves like plain Permutations, full n! output.",
      "Sorting is mandatory — the skip rule relies on equal values being adjacent.",
    ],
    twists: [
      "**Permutations** (LeetCode 46, no duplicates) → drop the sort and the skip condition.",
      "**Subsets II** (LeetCode 90) → the same 'skip duplicate at this level' idea, applied to subset generation.",
      "**Next permutation** → generate just the single next ordering in O(n) instead of all of them.",
    ],
    related: ["permutations", "subsets-ii", "combinations"],
  },

  {
    slug: "combinations",
    title: "Combinations",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 77,
    statement:
      "Given two integers `n` and `k`, return **all combinations** of `k` numbers chosen from the range `[1, n]`. Order within a combination doesn't matter, and each combination must be unique.",
    examples: [
      { in: "n = 4, k = 2", out: "[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]" },
      { in: "n = 1, k = 1", out: "[[1]]" },
    ],
    constraints: ["1 ≤ n ≤ 20", "1 ≤ k ≤ n"],
    recognize:
      "'All combinations / choose k of n' is backtracking. The defining trick versus permutations: combinations are **unordered**, so you only ever pick numbers **larger than the last one chosen** (a moving `start` index). That single rule eliminates duplicates and reordering.",
    figureItOut: [
      "A combination is a set, so {1,2} and {2,1} are the same. To avoid generating both, fix a direction: always add numbers in **increasing** order. Then each set is produced exactly once.",
      "Implement that with a `start` parameter: when you pick a number, the next pick must come from `start..n` where start is one past what you just took. That enforces strictly increasing picks.",
      "Base case: when the current combination has `k` numbers, record a copy and stop. Choose-explore-unchoose around each candidate.",
      "Pruning makes it fast: if there aren't enough numbers left to reach size k, abandon the branch. Specifically, you need `k − path.size()` more numbers, and only `n − i + 1` remain from i — stop iterating when that's too few.",
      "Concretely the loop can run `i` from start while `n - i + 1 >= k - path.size()`; beyond that no valid completion exists.",
    ],
    approaches: [
      {
        name: "Backtracking with a start index (+ pruning)",
        intuition: "Pick numbers in increasing order via a start index; stop a branch when too few numbers remain to fill k slots.",
        time: "O(k · C(n, k))",
        timeWhy: "There are C(n,k) combinations, each costing O(k) to copy into the result.",
        space: "O(k)",
        spaceWhy: "Recursion depth and the current path are both bounded by k (output excluded).",
        code: `List<List<Integer>> combine(int n, int k) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(1, n, k, new ArrayList<>(), res);
    return res;
}

void backtrack(int start, int n, int k, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == k) {
        res.add(new ArrayList<>(path));
        return;
    }
    int need = k - path.size();
    // prune: only iterate while enough numbers remain to complete a combination
    for (int i = start; i <= n - need + 1; i++) {
        path.add(i);
        backtrack(i + 1, n, k, path, res);   // next picks strictly greater
        path.remove(path.size() - 1);        // undo
    }
}`,
        walkthrough: [
          "n=4, k=2. start=1: pick 1 → recurse start=2 → pick 2 → [1,2]; pick 3 → [1,3]; pick 4 → [1,4].",
          "Back to start=1, pick 2 → recurse start=3 → [2,3],[2,4]. Pick 3 → [3,4].",
          "Pick 4 at top level pruned (n − need + 1 = 3, so i stops at 3). Result has all 6.",
        ],
      },
    ],
    edgeCases: [
      "k = n → exactly one combination (all numbers).",
      "k = 1 → n singletons.",
      "The pruning bound `n - need + 1` is what keeps large n/k fast; without it you waste branches that can't complete.",
    ],
    twists: [
      "**Combination Sum** (LeetCode 39) → pick numbers summing to a target, reuse allowed → recurse with the same start index.",
      "**Combination Sum III** (LeetCode 216) → combinations of k numbers from 1..9 that sum to n; add a running-sum check.",
      "**Subsets** (LeetCode 78) → record the path at every node, not only at size k.",
    ],
    related: ["combination-sum", "subsets", "permutations-ii"],
  },
];
