// NeetCode 150 — wave 2c (trees part 2, tries). Java.
export const WAVE2C = [
  // ───────────────────────────── TREES (part 2) ─────────────────────────────
  {
    slug: "kth-smallest-element-in-a-bst",
    title: "Kth Smallest Element in a BST",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 230,
    statement:
      "Given the `root` of a **binary search tree** and an integer `k`, return the `k`-th smallest value (1-indexed) among all the node values.",
    examples: [
      { in: "root = [3,1,4,null,2], k = 1", out: "1", note: "smallest value" },
      { in: "root = [5,3,6,2,4,null,null,1], k = 3", out: "3" },
    ],
    constraints: ["1 ≤ k ≤ n ≤ 10⁴", "0 ≤ Node.val ≤ 10⁴", "the tree is a valid BST"],
    recognize:
      "It's a **BST** and you want things in **sorted order**. The defining property of a BST is that an **in-order traversal** (left, node, right) visits the values **ascending**. 'k-th smallest in a BST' is in-order traversal + stop at the k-th node.",
    figureItOut: [
      "The naive idea: collect *all* values into a list, sort it, return `list[k-1]`. That works but throws away the gift the BST is handing you — the values are already structured by order. Sorting is O(n log n) you don't need.",
      "Recall the one fact that makes a BST special: for any node, everything in its **left** subtree is smaller, everything in its **right** subtree is larger. So if you visit left-subtree first, then the node, then right-subtree, you produce values in **increasing** order. That's in-order traversal.",
      "So you don't need a full sort — you need the in-order sequence, and you only need to walk it until you've emitted **k** values. The k-th one emitted is the answer; stop there.",
      "To stop early cleanly, do the in-order walk **iteratively with a stack** (push all left children, pop = visit, then go right). Each pop is the next-smallest value; decrement k, and when k hits 0 you're standing on the answer.",
      "Bonus instinct for the follow-up: if the tree changes a lot, an explicit count per subtree lets you descend directly to the k-th node in O(height) instead of O(k) — but for a one-shot query, the in-order stack is the clean answer.",
    ],
    approaches: [
      {
        name: "In-order into a list, index it",
        intuition: "In-order traversal yields a sorted list; the k-th smallest is element k−1.",
        time: "O(n)",
        timeWhy: "You visit every node once to build the full in-order list, even though you only needed the first k.",
        space: "O(n)",
        spaceWhy: "The list holds all n values, plus O(h) recursion stack.",
        code: `int kthSmallest(TreeNode root, int k) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    return vals.get(k - 1);
}

void inorder(TreeNode node, List<Integer> vals) {
    if (node == null) return;
    inorder(node.left, vals);
    vals.add(node.val);
    inorder(node.right, vals);
}`,
        walkthrough: [
          "Tree [5,3,6,2,4,1], k=3. In-order produces [1,2,3,4,5,6].",
          "Return vals.get(2) = 3.",
        ],
      },
      {
        name: "Iterative in-order, stop at k (optimal)",
        intuition: "Walk the in-order sequence with a stack; the k-th popped node is the answer — quit immediately.",
        time: "O(h + k)",
        timeWhy: "You push the leftmost spine (O(h)) and then pop exactly k nodes, descending right as needed. You never touch nodes beyond the k-th.",
        space: "O(h)",
        spaceWhy: "The stack holds at most one path from root to a leaf — the tree height. O(log n) if balanced, O(n) if degenerate.",
        code: `int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode cur = root;
    while (cur != null || !stack.isEmpty()) {
        while (cur != null) {       // walk left, stacking ancestors
            stack.push(cur);
            cur = cur.left;
        }
        cur = stack.pop();          // next-smallest value
        if (--k == 0) return cur.val;
        cur = cur.right;            // then explore its right subtree
    }
    return -1;                      // unreachable given 1 ≤ k ≤ n
}`,
        walkthrough: [
          "Tree [5,3,6,2,4,1], k=3. Push 5,3,2,1 (all lefts). Pop 1 → k=2. 1 has no right.",
          "Pop 2 → k=1. 2's right is null. Pop 3 → k=0 → return 3.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → the leftmost node (smallest); k = n → the rightmost (largest).",
      "A degenerate left-leaning tree makes the stack hold all n nodes — still correct, just O(n) height.",
      "Duplicate values aren't allowed in a standard BST here; values are treated as distinct positions in the order.",
    ],
    twists: [
      "**Tree is modified often (insert/delete) and you query k repeatedly** → store a subtree-size count in each node, then descend: if left-size ≥ k go left, if left-size+1 == k take this node, else go right with k reduced — O(height) per query.",
      "**k-th *largest*** → do the mirror in-order (right, node, left), or compute n and ask for the (n−k+1)-th smallest.",
      "**Find the value closest to a target** → in-order is overkill; binary-search down the BST instead.",
    ],
    related: ["binary-search", "validate-binary-search-tree"],
  },

  {
    slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 105,
    statement:
      "Given two integer arrays `preorder` and `inorder` — the preorder and inorder traversals of the **same** binary tree, with **all values distinct** — reconstruct and return the tree.",
    examples: [
      { in: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", out: "[3,9,20,null,null,15,7]" },
      { in: "preorder = [-1], inorder = [-1]", out: "[-1]" },
    ],
    constraints: ["1 ≤ preorder.length ≤ 3000", "inorder is a permutation of preorder", "all values are unique"],
    recognize:
      "You're rebuilding a tree from two traversal orders. The unlock is what each order **tells you**: **preorder** gives you the **root first**; **inorder** tells you, given a root, **which values fall left vs. right** of it. Combine them recursively.",
    figureItOut: [
      "Start by asking what each traversal guarantees. Preorder is *root → left → right*, so the **very first element of preorder is the root** of the whole tree. That's a free, certain fact.",
      "Now you know the root's value. Look it up in **inorder**, which is *left → root → right*. Everything to its **left** in the inorder array is the left subtree; everything to its **right** is the right subtree. The root splits inorder into two groups.",
      "Counting those groups gives you the **sizes** of the left and right subtrees. That size is the bridge back to preorder: right after the root, preorder lists the **entire left subtree** (that many elements), then the **entire right subtree**. So you can carve preorder into the same two groups.",
      "Now it's the same problem on smaller pieces — recurse: build the left subtree from the left slices of both arrays, the right subtree from the right slices. Base case: an empty slice → null.",
      "The naive version re-scans inorder to find each root (O(n) per node → O(n²)). Speed it up by pre-building a **value → inorder-index** hash map so each root lookup is O(1). Track the current inorder window with `[lo, hi]` and consume preorder left-to-right with a single moving pointer.",
    ],
    approaches: [
      {
        name: "Recursive split, linear root search",
        intuition: "First preorder element is the root; find it in inorder to split into left/right; recurse on the slices.",
        time: "O(n²)",
        timeWhy: "For each of n nodes you scan inorder (up to O(n)) to locate the root and slice. Worst case (a skewed tree) compounds to O(n²).",
        space: "O(n²)",
        spaceWhy: "Copying sub-array slices at each level allocates new arrays — quadratic in the worst case, plus O(h) recursion.",
        code: `TreeNode buildTree(int[] preorder, int[] inorder) {
    if (preorder.length == 0) return null;
    int rootVal = preorder[0];
    TreeNode root = new TreeNode(rootVal);
    int mid = 0;
    while (inorder[mid] != rootVal) mid++;        // find root in inorder
    // left subtree = first 'mid' values; right subtree = the rest
    int[] preLeft  = Arrays.copyOfRange(preorder, 1, mid + 1);
    int[] preRight = Arrays.copyOfRange(preorder, mid + 1, preorder.length);
    int[] inLeft   = Arrays.copyOfRange(inorder, 0, mid);
    int[] inRight  = Arrays.copyOfRange(inorder, mid + 1, inorder.length);
    root.left  = buildTree(preLeft, inLeft);
    root.right = buildTree(preRight, inRight);
    return root;
}`,
        walkthrough: [
          "pre=[3,9,20,15,7], in=[9,3,15,20,7]. Root=3, found at index 1 of inorder.",
          "Left: pre=[9], in=[9] → leaf 9. Right: pre=[20,15,7], in=[15,20,7] → root 20, then leaves 15 and 7.",
        ],
      },
      {
        name: "Hash map + moving preorder pointer (optimal)",
        intuition: "Pre-index inorder positions for O(1) root location; consume preorder with one global pointer; pass index windows instead of copying.",
        time: "O(n)",
        timeWhy: "Each node is created exactly once, and each root lookup is an O(1) hash hit. No per-node scanning.",
        space: "O(n)",
        spaceWhy: "The value→index map holds n entries; recursion adds O(h). No array copying.",
        code: `int preIdx = 0;
Map<Integer, Integer> inPos = new HashMap<>();

TreeNode buildTree(int[] preorder, int[] inorder) {
    for (int i = 0; i < inorder.length; i++) inPos.put(inorder[i], i);
    return build(preorder, 0, inorder.length - 1);
}

TreeNode build(int[] preorder, int lo, int hi) {
    if (lo > hi) return null;                 // empty inorder window → no node
    int rootVal = preorder[preIdx++];         // next root in preorder
    TreeNode root = new TreeNode(rootVal);
    int mid = inPos.get(rootVal);             // its split point in inorder
    root.left  = build(preorder, lo, mid - 1);
    root.right = build(preorder, mid + 1, hi);
    return root;
}`,
        walkthrough: [
          "preIdx=0 → root 3, mid=1 (inorder). Build left with window [0,0], right with [2,4].",
          "Left: preIdx=1 → 9, window [0,0] empty children → leaf. Right: preIdx=2 → 20, mid=3, build 15 ([2,2]) then 7 ([4,4]).",
          "Because preorder is consumed left-to-right, the pointer is always pointing at the correct next root.",
        ],
      },
    ],
    edgeCases: [
      "Single node → preorder and inorder are both length 1 → one leaf.",
      "A completely left- (or right-) skewed tree → the recursion is n deep; correctness holds, recursion depth is O(n).",
      "Order matters: you must build the LEFT subtree before the RIGHT, because the shared preorder pointer hands out left-subtree roots first.",
    ],
    twists: [
      "**From inorder + postorder** (LeetCode 106) → postorder ends with the root, so consume postorder from the **back** and build the RIGHT subtree first.",
      "**From preorder + postorder** (LeetCode 889) → the tree isn't unique unless every node has 0 or 2 children; you pick the left-subtree size from postorder.",
      "**Values not distinct** → the inorder lookup is ambiguous; the standard reconstruction no longer has a unique answer.",
    ],
    related: ["binary-tree-maximum-path-sum", "serialize-and-deserialize-binary-tree"],
  },

  {
    slug: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    pattern: "trees",
    leetcode: 124,
    statement:
      "A **path** is any sequence of nodes connected by parent-child edges; each node appears at most once and the path need **not** pass through the root. Return the **maximum sum** of node values along any path. Values may be negative.",
    examples: [
      { in: "root = [1,2,3]", out: "6", note: "path 2 → 1 → 3" },
      { in: "root = [-10,9,20,null,null,15,7]", out: "42", note: "path 15 → 20 → 7" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 3·10⁴", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "It's a tree DFS, but with a twist: the best **answer** at a node looks different from the value you can **return** to a parent. Whenever 'the thing I report upward' and 'the thing I record as the answer' differ, the pattern is **DFS that returns one quantity but updates a global with another**.",
    figureItOut: [
      "Picture the best path and ask where its **highest point** is. Every path has a single topmost node — the point where it 'turns'. At that turning node the path can dip down into the **left** child and down into the **right** child: it forms a ∧ shape (left-arm + node + right-arm).",
      "So if you knew, for any node, the **best downward path that starts at that node and goes straight down** (no turning) — call it the node's 'gain' — you could compute the best ∧ through that node as `node.val + leftGain + rightGain`. The overall answer is the maximum such ∧ over **all** nodes.",
      "Here's the crux that trips people up: the ∧ value (`left + node + right`) is a great **answer candidate**, but you can **not return it to the parent** — a parent can only attach to ONE of your arms, because a path can't fork. So a node must return only `node.val + max(leftGain, rightGain)` — the best **straight-down** path.",
      "That split is the whole insight: **return the best straight-down path to your parent, but on the way update a global `best` with the through-node split** `node.val + leftGain + rightGain`. Two different numbers from one visit.",
      "Negatives are the last subtlety. If a child's gain is negative, attaching it only hurts — so clamp each child's gain with `Math.max(0, childGain)`, meaning 'or just don't extend into that child'. The node itself must always be included in its own gain (a path of one node is allowed).",
      "Initialize `best` to negative infinity, not 0 — an all-negative tree's answer is the single least-negative node, and 0 would wrongly win.",
    ],
    approaches: [
      {
        name: "DFS returning a gain, global tracks the split (optimal)",
        intuition: "Each call returns the best straight-down path through that node; it also offers node.val + leftGain + rightGain to a global maximum.",
        time: "O(n)",
        timeWhy: "Each node is visited exactly once; the work per node is O(1).",
        space: "O(h)",
        spaceWhy: "Only the recursion stack — the tree height. O(log n) balanced, O(n) skewed.",
        code: `int best = Integer.MIN_VALUE;

int maxPathSum(TreeNode root) {
    gain(root);
    return best;
}

// returns the max path sum that goes straight DOWN from 'node'
int gain(TreeNode node) {
    if (node == null) return 0;
    int left  = Math.max(0, gain(node.left));    // drop a negative arm
    int right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right);  // ∧ split through node — an ANSWER, not a return value
    return node.val + Math.max(left, right);          // extend only ONE arm upward
}`,
        walkthrough: [
          "Tree [-10,9,20,null,null,15,7]. gain(9)=9, gain(15)=15, gain(7)=7.",
          "At 20: left=15, right=7 → split = 20+15+7 = 42 → best=42. Returns 20+max(15,7)=35 upward.",
          "At −10: left=9, right=35 → split = −10+9+35 = 34 (< 42). Returns −10+35=25. Final best = 42.",
        ],
      },
    ],
    edgeCases: [
      "A single node → the answer is its own value (which may be negative).",
      "All-negative tree → answer is the largest single value; `best` must start at −∞, and the `max(0, …)` clamp ensures no negative arm is forced in.",
      "A long negative chain with one positive leaf → the clamp prunes the chain so only the positive node survives.",
    ],
    twists: [
      "**Return the actual path, not just the sum** → record parent/arm choices and reconstruct from the node where `best` was set.",
      "**Diameter of the tree (longest path in edges)** (LeetCode 543) → same shape, but gain = 1 + max(leftDepth, rightDepth) and best = leftDepth + rightDepth.",
      "**Maximum path between two leaves only** → require both arms to reach a leaf; only update best when both children exist.",
      "**Path must go through the root** → drop the global; just return root.val + left + right directly.",
    ],
    related: ["construct-binary-tree-from-preorder-and-inorder-traversal", "serialize-and-deserialize-binary-tree"],
  },

  {
    slug: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    pattern: "trees",
    leetcode: 297,
    statement:
      "Design an algorithm to **serialize** a binary tree to a string and **deserialize** that string back into the identical tree. Values may repeat and may be negative; the tree shape must be preserved exactly.",
    examples: [
      { in: "root = [1,2,3,null,null,4,5]", out: '"1,2,3,#,#,4,5"', note: "any reversible encoding is acceptable" },
      { in: "root = []", out: '"#"', note: "empty tree" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10⁴", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "You must turn a tree into a flat string and back **losslessly**. The key obstacle: a plain list of values loses the **shape**. The fix is to record nulls explicitly so the structure is fully encoded — then a single traversal order can rebuild it deterministically.",
    figureItOut: [
      "First, see *why this is hard*: from just `[1,2,3]` in preorder you can't tell whether 2 and 3 are children of 1, or a left-chain, etc. The missing information is **where the empty children are**. So whatever you record, you must record the **null gaps** too.",
      "Pick one traversal and commit to it for both directions. **Preorder** (root, left, right) is the easiest: you write the root first, so when reading back you can create the root first, then its left subtree, then its right.",
      "Serialize by DFS: emit the node's value, then recurse left, then right; when you hit a null child, emit a sentinel like `#`. Separate tokens with a comma so multi-digit and negative values stay intact.",
      "Deserialize by consuming those tokens **in the same order**. Keep a moving pointer (a queue of tokens). The next token tells you: if it's `#`, this child is null (return); otherwise create a node and recursively build its left then its right. Because preorder writes root-before-children, the reader always has the parent before it needs the children.",
      "The reason this round-trips perfectly: serialization and deserialization walk the tree in **identical order**, and every node — real or null — contributes exactly one token. Same order in, same order out → the shape is reconstructed exactly.",
    ],
    approaches: [
      {
        name: "Preorder DFS with null markers (optimal)",
        intuition: "Write value or '#' per slot in preorder; read the tokens back in the same order, creating a node per non-'#'.",
        time: "O(n)",
        timeWhy: "Both directions visit every real node once and every null slot once — O(n) tokens total.",
        space: "O(n)",
        spaceWhy: "The output string holds O(n) tokens; deserialization holds the token queue plus O(h) recursion.",
        code: `// Serialize: preorder, '#' for nulls, comma-separated.
String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    build(root, sb);
    return sb.toString();
}

void build(TreeNode node, StringBuilder sb) {
    if (node == null) { sb.append("#,"); return; }
    sb.append(node.val).append(",");
    build(node.left, sb);
    build(node.right, sb);
}

// Deserialize: consume the same tokens in order.
TreeNode deserialize(String data) {
    Queue<String> tokens = new LinkedList<>(Arrays.asList(data.split(",")));
    return parse(tokens);
}

TreeNode parse(Queue<String> tokens) {
    String t = tokens.poll();
    if (t.equals("#")) return null;
    TreeNode node = new TreeNode(Integer.parseInt(t));
    node.left  = parse(tokens);     // preorder: left subtree next
    node.right = parse(tokens);     // then right subtree
    return node;
}`,
        walkthrough: [
          "Tree [1,2,3,null,null,4,5] serializes (preorder) to \"1,2,#,#,3,4,#,#,5,#,#,\".",
          "Deserialize: poll 1 → node 1. Its left: poll 2 → node 2, whose children poll '#','#' → both null.",
          "Back at 1, right: poll 3 → node 3, left polls 4 (with two '#' children), right polls 5 (with two '#'). Tree rebuilt identically.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → serializes to just \"#\" (or \"#,\"); deserialize sees '#' first and returns null.",
      "Negative values → fine, because tokens are comma-delimited; splitting on the comma keeps the minus sign attached.",
      "Duplicate values → no problem; the shape comes from the null markers and traversal order, not from value uniqueness.",
      "A trailing comma from the StringBuilder is harmless — split discards the empty trailing fields, or you can trim it.",
    ],
    twists: [
      "**BFS / level-order encoding** (the LeetCode bracket form) → use a queue, emit children level by level, mark nulls; rebuild by reading the level stream.",
      "**Serialize a BST more compactly** (LeetCode 449) → you can omit null markers: preorder alone reconstructs a BST using value bounds.",
      "**Serialize an N-ary tree** (LeetCode 428) → also record each node's child count (or a closing marker) so you know when its children end.",
    ],
    related: ["construct-binary-tree-from-preorder-and-inorder-traversal", "binary-tree-maximum-path-sum"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 208,
    statement:
      "Implement a **trie** with `insert(word)`, `search(word)` (exact word present?), and `startsWith(prefix)` (any stored word begins with this prefix?).",
    examples: [
      { in: 'insert("apple"); search("apple")', out: "true" },
      { in: 'search("app")', out: "false", note: '"app" was never inserted as a full word' },
      { in: 'startsWith("app")', out: "true", note: '"apple" begins with "app"' },
    ],
    constraints: ["1 ≤ word.length ≤ 2000", "lowercase English letters", "up to 3·10⁴ calls"],
    recognize:
      "You're storing **many words** and asking 'is this exact word here?' and 'does any word start with this prefix?', repeatedly. A hash set answers exact-word but **not prefixes** cheaply. When **shared prefixes** and **prefix queries** appear together, the data structure is a **trie**.",
    figureItOut: [
      "Think about what a prefix query needs. With a `HashSet<String>`, `startsWith(\"app\")` would force you to scan every stored word — O(total characters) per query. The waste is that words sharing a prefix (apple, apply, application) repeat that prefix over and over.",
      "Flip the storage around: store words **character by character along a path**, so all words sharing a prefix share the same initial nodes. 'app' is one path of 3 nodes; 'apple' just extends it by 2 more. Now walking a prefix is just following that path.",
      "Design the node. Each **TrieNode** needs two things: links to its children (one slot per possible next letter — a 26-length array for lowercase, or a map), and a boolean **isEnd** marking 'a complete word finishes here'. The root is an empty node representing the empty prefix.",
      "**insert**: start at root; for each character, if the child link is missing, create a node; step into it. After the last character, set that node's `isEnd = true`.",
      "**search vs. startsWith** differ in exactly one line. Both walk the path character by character, returning false the moment a link is missing. The difference: `search` additionally requires the final node's `isEnd` to be true (a real word, not just a prefix); `startsWith` only needs the path to exist. Factor the shared walk into a helper that returns the final node (or null).",
    ],
    approaches: [
      {
        name: "TrieNode with a 26-way children array (optimal)",
        intuition: "Each node holds 26 child links and an isEnd flag; every operation just walks the path for that string.",
        time: "O(L) per operation",
        timeWhy: "Insert/search/startsWith each follow one link per character of the L-length string — independent of how many words are stored.",
        space: "O(total characters inserted)",
        spaceWhy: "In the worst case (no shared prefixes) each character of each word allocates a node with a 26-slot array.",
        code: `class Trie {
    // Each node: 26 children (a..z) and a flag for 'a word ends here'.
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    private final TrieNode root = new TrieNode();

    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEnd = true;                 // mark the end of a complete word
    }

    boolean search(String word) {
        TrieNode node = walk(word);
        return node != null && node.isEnd; // must be a full word, not just a prefix
    }

    boolean startsWith(String prefix) {
        return walk(prefix) != null;       // the path existing is enough
    }

    // Follow the path for s; return the final node, or null if any link is missing.
    private TrieNode walk(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return null;
            node = node.children[i];
        }
        return node;
    }
}`,
        walkthrough: [
          "insert(\"apple\"): create a→p→p→l→e path from root; mark 'e' node isEnd=true.",
          "search(\"app\"): walk a→p→p succeeds, but that 'p' node has isEnd=false → return false.",
          "startsWith(\"app\"): walk a→p→p succeeds → node not null → return true.",
        ],
      },
    ],
    edgeCases: [
      "Searching a word longer than anything stored → a link goes missing mid-walk → false.",
      "A word that is a prefix of another (insert 'apple', then search 'app') → 'app' is false until 'app' itself is inserted and its node's isEnd is set.",
      "Inserting the same word twice → idempotent; isEnd is simply set true again.",
      "Empty string (if allowed) → root itself; set/read root.isEnd.",
    ],
    twists: [
      "**Wildcards in search ('.' matches any letter)** → search must branch over all 26 children at a '.' → see *Design Add and Search Words*.",
      "**Store counts (how many words pass through / end here)** → add an int counter per node to support delete and frequency queries.",
      "**Unicode / large alphabet** → swap the fixed array for a `HashMap<Character, TrieNode>` to avoid 26 wasted slots per node.",
      "**Autocomplete (top words for a prefix)** → walk to the prefix node, then DFS the subtree collecting words.",
    ],
    related: ["design-add-and-search-words-data-structure", "word-search-ii"],
  },

  {
    slug: "design-add-and-search-words-data-structure",
    title: "Design Add and Search Words Data Structure",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 211,
    statement:
      "Design a structure with `addWord(word)` and `search(word)`. In `search`, a `.` is a **wildcard** that matches **any single letter**; return true if any stored word matches.",
    examples: [
      { in: 'addWord("bad"); search("bad")', out: "true" },
      { in: 'search(".ad")', out: "true", note: '"." matches the b in "bad"' },
      { in: 'search("b..")', out: "true", note: 'two wildcards match "ad"' },
    ],
    constraints: ["1 ≤ word.length ≤ 25", "addWord words are lowercase a–z", "search words are a–z or '.'", "up to 10⁴ calls"],
    recognize:
      "It's a trie problem with one new wrinkle: a query can contain a **wildcard** that matches any letter. The moment exact path-walking has to **branch over multiple children** at a position, the search turns from a loop into a **DFS / recursion** over the trie.",
    figureItOut: [
      "Storage is the standard trie: `addWord` is exactly trie `insert` — walk character by character, creating nodes, mark `isEnd` at the end. Nothing new there.",
      "The change is entirely in `search`. For a normal letter at position `i`, there's only **one** child that can match — follow it (or fail if it's missing), then continue at `i+1`. That's the deterministic walk you already know.",
      "For a `.` you don't know which letter it should be, so it could match **any existing child**. You can't just follow one link — you must **try them all** and succeed if *any* branch leads to a full match. 'Try all children, succeed if any works' is recursion with branching — a DFS.",
      "So write `search` as a recursive helper `dfs(word, index, node)`: if the current character is a normal letter, recurse into that one child; if it's '.', loop over **all non-null children** and recurse into each, returning true on the first success.",
      "Base case: when `index` reaches the end of the word, the match is valid only if the current node's `isEnd` is true — i.e. you landed exactly on a stored word, not merely on a prefix. A `.` never matches 'no letter', so a missing child or running off the path is a dead end (false).",
    ],
    approaches: [
      {
        name: "Trie + DFS that branches on '.' (optimal)",
        intuition: "addWord is plain trie insert; search recurses, following one child for a letter and all children for a wildcard.",
        time: "addWord O(L); search O(L) typical, O(26^d · L) worst",
        timeWhy: "A search with no dots follows one path (O(L)). Each '.' can fan out to all 26 children, so with d dots the branching can reach 26^d in the worst case.",
        space: "O(total characters)",
        spaceWhy: "The trie stores every inserted character; search recursion adds O(L) stack depth.",
        code: `class WordDictionary {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    private final TrieNode root = new TrieNode();

    void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEnd = true;
    }

    boolean search(String word) {
        return dfs(word, 0, root);
    }

    private boolean dfs(String word, int idx, TrieNode node) {
        if (node == null) return false;
        if (idx == word.length()) return node.isEnd;   // matched every char → must be a full word
        char c = word.charAt(idx);
        if (c == '.') {                                // wildcard: try every existing child
            for (TrieNode child : node.children) {
                if (dfs(word, idx + 1, child)) return true;
            }
            return false;
        }
        return dfs(word, idx + 1, node.children[c - 'a']);  // normal letter: one child
    }
}`,
        walkthrough: [
          "addWord(\"bad\"), addWord(\"dad\"). search(\".ad\"): at idx 0 the char is '.', so try all children of root.",
          "Branch into 'b': dfs(\"ad\" rest) walks a→d, lands on isEnd → returns true → whole search returns true.",
          "search(\"b..\"): follow 'b', then '.' tries children of that node (only 'a'), then '.' tries children of 'a' (only 'd'), lands on isEnd → true.",
        ],
      },
    ],
    edgeCases: [
      "All-wildcard query like \"...\" → matches any stored word of that exact length; fails if no word has that length.",
      "A '.' at a node with no children → the for-loop finds nothing → that branch returns false.",
      "Searching a word longer than any stored path → recursion hits a null child → false.",
      "A query that matches a prefix but not a full word → reaches the end with isEnd=false → false.",
    ],
    twists: [
      "**'*' matches zero or more characters** → much harder; the recursion must also try *staying* at the same node while advancing the pattern (regex-style matching).",
      "**Bound the wildcard blow-up** → if words are short and few, the 26^d worst case is fine; otherwise group words by length to prune quickly.",
      "**Count matches instead of existence** → don't early-return on the first success; sum the matches across branches.",
    ],
    related: ["implement-trie-prefix-tree", "word-search-ii"],
  },

  {
    slug: "word-search-ii",
    title: "Word Search II",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 212,
    statement:
      "Given an `m × n` board of letters and a list of `words`, return **all words** from the list that can be formed by a path of **adjacent** (up/down/left/right) cells, where each cell is used **at most once** per word.",
    examples: [
      {
        in: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
        out: '["eat","oath"]',
      },
      { in: 'board = [["a","b"],["c","d"]], words = ["abcb"]', out: "[]", note: "a cell can't be reused" },
    ],
    constraints: ["1 ≤ m, n ≤ 12", "1 ≤ words.length ≤ 3·10⁴", "1 ≤ word.length ≤ 10", "lowercase letters"],
    recognize:
      "It's grid **backtracking** (DFS from each cell), but searching for **many words at once**. Running a separate DFS per word re-walks shared prefixes endlessly. When you're matching **a whole dictionary against a grid**, build a **trie of the words** and DFS the grid against the trie — all prefixes are searched simultaneously.",
    figureItOut: [
      "The single-word version is *Word Search I*: from each cell, DFS to its neighbours, matching the word character by character, marking visited cells so you don't reuse them, and unmarking on the way back (backtracking).",
      "Naively, you'd repeat that whole DFS for every word — but many words share prefixes ('oath', 'oat', 'oar' all start 'oa'). Re-walking 'oa' once per word is the waste. Worse, with up to 3·10⁴ words, per-word DFS is hopeless.",
      "Flip it: instead of asking 'can I find word W?', put **all words into a trie** and ask, from each starting cell, 'what words can this grid path spell?'. As you DFS a path on the board, you walk **down the trie in lockstep**. One grid traversal checks every word with that prefix at once.",
      "Mechanically: for each board cell, start at the trie root. At a cell with letter `c`, look at `node.children[c]`. If it's null, this path can't spell any stored word — **prune** immediately (this pruning is the whole win). If non-null, step into that trie node; if that node marks the end of a word, **record it**. Then recurse into the four neighbours, marking the cell visited; restore it afterward (backtrack).",
      "Two refinements that matter in practice: (1) store the **full word** on the trie's end node so you can add it directly to the results without rebuilding the string; (2) **de-duplicate** results (a word might be reachable two ways) — set the end node's word to null after collecting it, which also prunes future repeats.",
    ],
    approaches: [
      {
        name: "Per-word DFS (baseline)",
        intuition: "Run Word-Search-I independently for each word.",
        time: "O(W · m · n · 4^L)",
        timeWhy: "For each of W words you launch a DFS from every cell, branching 4 ways up to length L. Shared prefixes are re-explored for every word.",
        space: "O(L)",
        spaceWhy: "Just the recursion stack per search.",
        code: `// Conceptual baseline — correct but far too slow for 3·10^4 words.
// for (String w : words) if (existsOnBoard(board, w)) res.add(w);
// existsOnBoard = the standard Word Search I backtracking DFS.`,
      },
      {
        name: "Trie of words + one grid DFS (optimal)",
        intuition: "Build a trie of all words; DFS the grid while descending the trie, pruning the instant a prefix has no trie child, collecting words at end-nodes.",
        time: "O(m · n · 4^L) plus O(total word chars) to build",
        timeWhy: "One grid traversal handles all words simultaneously; the trie prunes any path whose prefix isn't a stored word's prefix, so branching collapses fast in practice.",
        space: "O(total word characters)",
        spaceWhy: "The trie stores every character across all words; recursion adds O(L) depth.",
        code: `class TrieNode {
    TrieNode[] children = new TrieNode[26];
    String word = null;        // non-null only at the end of a stored word
}

List<String> findWords(char[][] board, String[] words) {
    TrieNode root = buildTrie(words);
    List<String> res = new ArrayList<>();
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            dfs(board, r, c, root, res);
    return res;
}

TrieNode buildTrie(String[] words) {
    TrieNode root = new TrieNode();
    for (String w : words) {
        TrieNode node = root;
        for (char ch : w.toCharArray()) {
            int i = ch - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.word = w;          // stash the whole word at its end node
    }
    return root;
}

void dfs(char[][] board, int r, int c, TrieNode node, List<String> res) {
    if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return;
    char ch = board[r][c];
    if (ch == '#') return;                 // already on the current path
    TrieNode next = node.children[ch - 'a'];
    if (next == null) return;              // no stored word has this prefix → prune

    if (next.word != null) {               // an end node → found a word
        res.add(next.word);
        next.word = null;                  // de-dupe: don't add it again
    }

    board[r][c] = '#';                     // mark visited
    dfs(board, r + 1, c, next, res);
    dfs(board, r - 1, c, next, res);
    dfs(board, r, c + 1, next, res);
    dfs(board, r, c - 1, next, res);
    board[r][c] = ch;                      // backtrack: restore the cell
}`,
        walkthrough: [
          "Words ['oath','eat'] → trie has paths o→a→t→h (end 'oath') and e→a→t (end 'eat').",
          "Start DFS at cell 'o' (0,0): trie child 'o' exists → step in. Neighbour 'a' (0,1): child exists → step in. Down to 't','h' → 'h' node has word='oath' → add it, null it out.",
          "Start DFS at 'e' (1,0): walk e→a→t against the trie, end node word='eat' → add. Any cell whose letter has no trie child (e.g. starting at 'k') is pruned instantly.",
        ],
      },
    ],
    edgeCases: [
      "A word longer than the number of cells, or using a letter not on the board → its trie path is never fully walked → never added.",
      "The same word reachable by two distinct paths → nulling `word` after the first hit prevents duplicates in the result.",
      "Single-cell board → only length-1 words matching that letter are found.",
      "Marking with '#' and restoring is mandatory — forgetting to restore corrupts the board for later starting cells.",
    ],
    twists: [
      "**Prune dead trie branches as you go** → after a leaf is consumed, you can remove childless end-nodes so later DFS skips them even faster.",
      "**Diagonal moves allowed (8 directions)** → add the four diagonal neighbours to the recursion.",
      "**Return paths / coordinates, not just words** → carry the path list through the DFS and snapshot it at end-nodes.",
      "**Single word only** → drop the trie; it degenerates back to Word Search I backtracking.",
    ],
    related: ["implement-trie-prefix-tree", "design-add-and-search-words-data-structure"],
  },
];
