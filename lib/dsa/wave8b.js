// NeetCode All — wave 8b (trees, linked-list, binary-search, heaps, tries). Java.
export const WAVE8B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "binary-tree-postorder-traversal",
    title: "Binary Tree Postorder Traversal",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 145,
    statement:
      "Given the `root` of a binary tree, return the **postorder** traversal of its nodes' values — for each node, visit its **left** subtree, then its **right** subtree, then the **node itself**.",
    examples: [
      { in: "root = [1,null,2,3]", out: "[3,2,1]", note: "left, right, then root" },
      { in: "root = []", out: "[]", note: "empty tree" },
      { in: "root = [1]", out: "[1]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "It's a **fixed visit order on a binary tree** — the textbook DFS. Postorder = `left, right, node`. The only question is whether to write it as recursion (trivial) or as an explicit stack (the interview twist).",
    figureItOut: [
      "First nail the definition. **Postorder** processes a node *after* both of its children. So you fully finish the left subtree, then the right subtree, and only then record the current node's value. Children before parents.",
      "Recursion writes itself: recurse left, recurse right, then add `node.val`. The call stack does the bookkeeping for you. That's the answer you'd reach for first.",
      "The classic follow-up is *do it iteratively*. Postorder is the awkward one because you must delay a node until its right child is done — naive 'pop and visit' doesn't work.",
      "A clean trick: produce the **reverse** of postorder, which is `node, right, left` — a mirror of preorder. Push, and on each pop record the value, then push left then right (so right pops first). Reverse the result at the end and you have true postorder.",
    ],
    approaches: [
      {
        name: "Recursive DFS",
        intuition: "Recurse left, recurse right, then record the node — exactly the definition.",
        time: "O(n)",
        timeWhy: "Each of the n nodes is visited exactly once.",
        space: "O(h)",
        spaceWhy: "The recursion stack is as deep as the tree height h (O(n) for a skewed tree, O(log n) if balanced).",
        code: `List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    dfs(root, res);
    return res;
}

void dfs(TreeNode node, List<Integer> res) {
    if (node == null) return;
    dfs(node.left, res);
    dfs(node.right, res);
    res.add(node.val);          // node comes last
}`,
        walkthrough: [
          "root=1, right child 2, 2's left child 3. dfs(1): left null; dfs(2): left dfs(3) adds 3; 2's right null; add 2; back at 1 add 1.",
          "Result builds as [3, 2, 1].",
        ],
      },
      {
        name: "Iterative with a stack (reverse-preorder trick)",
        intuition: "Build node→right→left with one stack, then reverse it to get left→right→node.",
        time: "O(n)",
        timeWhy: "Each node is pushed and popped once; the final reverse is O(n).",
        space: "O(n)",
        spaceWhy: "The stack and the output list each hold up to n nodes.",
        code: `List<Integer> postorderTraversal(TreeNode root) {
    LinkedList<Integer> res = new LinkedList<>();
    if (root == null) return res;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        res.addFirst(node.val);          // prepend → reverses node,right,left into left,right,node
        if (node.left != null) stack.push(node.left);
        if (node.right != null) stack.push(node.right);
    }
    return res;
}`,
      },
    ],
    edgeCases: [
      "Empty tree → empty list.",
      "A single node → just [val].",
      "A completely skewed tree (a straight line) → recursion depth equals n; mention the iterative version if stack overflow is a concern.",
    ],
    twists: [
      "**Preorder** (LeetCode 144) → `node, left, right`; iteratively push right then left so left pops first.",
      "**Inorder** (LeetCode 94) → `left, node, right`; iterate by walking left, pushing, then turning right after a pop.",
      "**True iterative postorder without the reverse** → track a `lastVisited` node so you only pop a parent once its right child is done.",
    ],
    related: ["binary-tree-inorder-traversal", "invert-binary-tree"],
  },

  {
    slug: "convert-sorted-array-to-binary-search-tree",
    title: "Convert Sorted Array to Binary Search Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 108,
    statement:
      "Given an integer array `nums` sorted in **ascending** order, build a **height-balanced** binary search tree from it (any valid one is accepted).",
    examples: [
      { in: "nums = [-10,-3,0,5,9]", out: "[0,-3,9,-10,null,5]", note: "one valid balanced BST" },
      { in: "nums = [1,3]", out: "[3,1]", note: "or [1,null,3]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "nums is sorted strictly ascending"],
    recognize:
      "Sorted input + 'build a **balanced** BST' is a **divide-and-conquer on a sorted array**. The middle element is the root; balance comes for free when you always split in the middle — the same midpoint idea as binary search.",
    figureItOut: [
      "Recall two facts. A **BST** needs everything in the left subtree smaller than the root and everything on the right larger. **Balanced** means the two subtree heights never differ by more than one.",
      "The array is already sorted, so any element you pick as a node automatically has all smaller values to its left and all larger to its right. The BST ordering is handed to you.",
      "Now the balance requirement. If you pick the **middle** element as the root, the left half and right half have (nearly) equal sizes → equal-depth subtrees. That's exactly what keeps it balanced.",
      "So it's recursive: middle of the range is the root, recurse on the left half for the left child, recurse on the right half for the right child. Same partitioning intuition as binary search, but you build a node at each midpoint instead of discarding a half.",
    ],
    approaches: [
      {
        name: "Recursive: middle as root (optimal)",
        intuition: "Pick the midpoint of each subrange as the node; recurse on the two halves.",
        time: "O(n)",
        timeWhy: "Each array element becomes exactly one node, created once.",
        space: "O(log n)",
        spaceWhy: "Recursion depth is the tree height, which is log n because we always split evenly (ignoring the O(n) output tree itself).",
        code: `TreeNode sortedArrayToBST(int[] nums) {
    return build(nums, 0, nums.length - 1);
}

TreeNode build(int[] nums, int lo, int hi) {
    if (lo > hi) return null;
    int mid = lo + (hi - lo) / 2;        // overflow-safe midpoint
    TreeNode root = new TreeNode(nums[mid]);
    root.left = build(nums, lo, mid - 1);
    root.right = build(nums, mid + 1, hi);
    return root;
}`,
        walkthrough: [
          "nums=[-10,-3,0,5,9], lo=0 hi=4 → mid=2 (0) is root.",
          "Left build [0..1]: mid=0 (-10) root, right child -3. Right build [3..4]: mid=3 (5) root, right child 9.",
          "Result is balanced: 0 at top, depths differ by at most one.",
        ],
      },
    ],
    edgeCases: [
      "Single element → a one-node tree.",
      "Even-length range → either of the two middles works; `lo + (hi-lo)/2` consistently takes the lower one.",
      "Always recurse with index bounds, not by copying subarrays, or you turn O(n) space into O(n log n).",
    ],
    twists: [
      "**Convert a sorted linked list to a BST** (LeetCode 109) → no random access; use fast/slow to find the middle, or an inorder-simulation in O(n).",
      "**Return any balanced BST, count them** → Catalan-number counting problem.",
      "**Keep it balanced under inserts/deletes** → you've now arrived at AVL / red-black trees.",
    ],
    related: ["validate-binary-search-tree", "binary-search"],
  },

  {
    slug: "path-sum-ii",
    title: "Path Sum II",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 113,
    statement:
      "Given the `root` of a binary tree and a `targetSum`, return **all root-to-leaf paths** where the sum of the node values along the path equals `targetSum`. A leaf is a node with no children.",
    examples: [
      { in: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", out: "[[5,4,11,2],[5,8,4,5]]" },
      { in: "root = [1,2,3], targetSum = 5", out: "[]", note: "no root-to-leaf path sums to 5" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 5000", "−1000 ≤ Node.val, targetSum ≤ 1000"],
    recognize:
      "'**All root-to-leaf paths** satisfying a condition' is **DFS + backtracking on a tree**. You build the current path as you descend, record it when you hit a qualifying leaf, then **undo** the last step as you return.",
    figureItOut: [
      "A single yes/no 'does any path sum to target' (Path Sum I) only needs a boolean DFS. Here you must collect *every* qualifying path and the actual node values, so you have to carry the path itself down the tree.",
      "Walk down with a running list `path` and a remaining `target`. At each node, append its value and subtract it from the remaining target.",
      "The success condition is precise: you've reached a **leaf** (both children null) **and** the remaining target hit exactly the leaf's value (i.e. remaining == 0 after subtracting). Only then snapshot a *copy* of the path into the answer.",
      "Crucial backtracking step: after exploring a node's children, **remove that node from `path`** before returning, so a sibling branch doesn't inherit it. Choose → explore → un-choose.",
    ],
    approaches: [
      {
        name: "DFS with backtracking (optimal)",
        intuition: "Carry the path and remaining sum down; record a copy at a matching leaf; pop on the way back up.",
        time: "O(n²)",
        timeWhy: "DFS visits each of n nodes once, but copying a qualifying path costs up to O(n), and there can be O(n) such paths in the worst case (a balanced tree where many leaves match).",
        space: "O(n)",
        spaceWhy: "The recursion stack and the single `path` list are both bounded by the tree height / n (the output is counted separately).",
        code: `List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> res = new ArrayList<>();
    dfs(root, targetSum, new ArrayList<>(), res);
    return res;
}

void dfs(TreeNode node, int target, List<Integer> path, List<List<Integer>> res) {
    if (node == null) return;
    path.add(node.val);
    target -= node.val;
    if (node.left == null && node.right == null && target == 0) {
        res.add(new ArrayList<>(path));   // snapshot a COPY, not the live list
    } else {
        dfs(node.left, target, path, res);
        dfs(node.right, target, path, res);
    }
    path.remove(path.size() - 1);         // backtrack: undo this node
}`,
        walkthrough: [
          "target 22. Go 5→4→11→7: sum 27, leaf, target≠0 → reject; backtrack to 11.",
          "5→4→11→2: sum 22, leaf, target 0 → add [5,4,11,2]; backtrack all the way up.",
          "5→8→4→5: sum 22, leaf → add [5,8,4,5]. Final: both paths.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → empty result regardless of target.",
      "Negative node values mean you cannot prune early on 'target already exceeded' — a later negative could still bring the sum back.",
      "A sum that matches at an internal node but not at a leaf does NOT count — the path must end at a leaf.",
    ],
    twists: [
      "**Path Sum I** (LeetCode 112) → just a boolean; return true the moment any leaf matches.",
      "**Path Sum III** (LeetCode 437) → paths need not start at root or end at a leaf; use a prefix-sum hash map.",
      "**Sum Root to Leaf Numbers** (LeetCode 129) → concatenate digits down each path instead of summing.",
    ],
    related: ["path-sum", "binary-tree-maximum-path-sum"],
  },

  {
    slug: "house-robber-iii",
    title: "House Robber III",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 337,
    statement:
      "Houses are arranged as a **binary tree**; `root.val` is the money in each house. The police trigger if you rob **two directly-connected** houses (a parent and its child). Return the maximum money you can rob without alerting the police.",
    examples: [
      { in: "root = [3,2,3,null,3,null,1]", out: "7", note: "rob 3 + 3 + 1 = 7 (the root and the two grandchildren)" },
      { in: "root = [3,4,5,1,3,null,1]", out: "9", note: "rob 4 + 5 = 9 (skip the root)" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "0 ≤ Node.val ≤ 10⁴"],
    recognize:
      "It's the **House Robber DP rerun on a tree** instead of a line. The 'can't take two adjacent' constraint screams DP; the tree shape means the recurrence is **DFS returning two values per node**: best-if-robbed and best-if-skipped.",
    figureItOut: [
      "Recall linear House Robber: at each house you either rob it (and skip the neighbour) or skip it. The tree version has the same dilemma, but 'adjacent' now means parent↔child.",
      "Try the naive recursion: for each node, either rob it (then you must skip its children but can take its grandchildren) or skip it (children are then free to rob). Taking the max works — but it recomputes grandchildren repeatedly. Exponential.",
      "The fix is to have each DFS call return **two numbers**: the best total for this subtree **if we rob this node**, and the best **if we don't**. No node is recomputed.",
      "The recurrence falls out: if you rob the node, you add its value plus each child's *not-robbed* value. If you skip it, each child contributes the *max* of its two options (free to choose). The answer at the root is the max of its two returned numbers.",
    ],
    approaches: [
      {
        name: "Naive recursion (exponential)",
        intuition: "At each node take max(rob this + grandchildren, skip this + children).",
        time: "O(2ⁿ)-ish",
        timeWhy: "Grandchild subtrees get recomputed by both the rob and skip branches, exploding the work.",
        space: "O(h)",
        spaceWhy: "Recursion depth only — but the time blowup makes this impractical.",
        code: `// Conceptual baseline — recomputes overlapping subtrees, too slow.
// int rob(node): return max(
//   node.val + rob(node.left.left) + ... grandchildren,   // rob this house
//   rob(node.left) + rob(node.right));                     // skip this house
`,
      },
      {
        name: "DFS returning {rob, skip} per node (optimal)",
        intuition: "Each node reports two totals; combine children's pairs in one pass.",
        time: "O(n)",
        timeWhy: "Each node is visited exactly once and does O(1) work to combine its children's pairs.",
        space: "O(h)",
        spaceWhy: "Only the recursion stack, depth = tree height h.",
        code: `int rob(TreeNode root) {
    int[] best = dfs(root);
    return Math.max(best[0], best[1]);
}

// returns {maxIfNodeRobbed, maxIfNodeSkipped}
int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] left = dfs(node.left);
    int[] right = dfs(node.right);
    int robbed  = node.val + left[1] + right[1];                 // children must be skipped
    int skipped = Math.max(left[0], left[1]) + Math.max(right[0], right[1]); // children free
    return new int[]{robbed, skipped};
}`,
        walkthrough: [
          "Tree [3,2,3,null,3,null,1]: leaves 3 and 1 each return {val, 0}.",
          "Node 2 has child-leaf 3: rob 2 = 2+0=2, skip = max(3,0)=3 → {2,3}. Node 3(right) similarly → {3+0, max(1,0)} = {3,1}.",
          "Root 3: robbed = 3 + skip(2-branch=3? no — left[1]=3) wait use skipped children: 3 + left[1](3) + right[1](1) = 7; skipped = max(2,3)+max(3,1)=3+3=6 → max(7,6)=7.",
        ],
      },
    ],
    edgeCases: [
      "Single node → rob it; answer is its value.",
      "All values zero → 0 regardless of structure.",
      "Returning a pair (not a single number) is what kills the recomputation — a single-int DFS forces you to re-descend for grandchildren.",
    ],
    twists: [
      "**House Robber I** (LeetCode 198) → the linear version; dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
      "**House Robber II** (LeetCode 213) → houses in a circle; run the linear DP twice (exclude first, exclude last).",
      "**Maximum independent set on a general tree** → this is exactly that problem in disguise.",
    ],
    related: ["binary-tree-maximum-path-sum", "diameter-of-binary-tree"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "odd-even-linked-list",
    title: "Odd Even Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 328,
    statement:
      "Given a singly linked list, group all nodes at **odd positions** together followed by the nodes at **even positions** (positions counted from 1 by node index, not by value). Do it in **O(1)** extra space and **O(n)** time, keeping the relative order within each group.",
    examples: [
      { in: "head = [1,2,3,4,5]", out: "[1,3,5,2,4]", note: "odd-index nodes 1,3,5 then even-index 2,4" },
      { in: "head = [2,1,3,5,6,4,7]", out: "[2,3,6,7,1,5,4]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 10⁴", "−10⁶ ≤ Node.val ≤ 10⁶"],
    recognize:
      "It's **in-place pointer rewiring** with no extra structure allowed — classic linked-list surgery. Maintain **two sublists** (odd-index and even-index) being built simultaneously, then stitch the even list onto the tail of the odd list.",
    figureItOut: [
      "Note 'position' means the node's **index** in the list (1st, 2nd, 3rd…), not whether its value is odd. The 1st, 3rd, 5th… nodes form the odd group; the 2nd, 4th… form the even group.",
      "The lazy solution copies values into two lists and rebuilds — but that's O(n) extra space, which is banned. We must relink existing nodes.",
      "Keep two 'tails' that grow as you walk: `odd` ends the odd sublist, `even` ends the even sublist. Remember the **head of the even list** (`evenHead`) because you'll attach it after the odd list at the end.",
      "Walk forward: `odd.next` should skip over the even node to the next odd node (`even.next`); `even.next` should skip to the following even node (`odd.next` after odd moved). Advance both. When you run out, point the odd tail at `evenHead`.",
    ],
    approaches: [
      {
        name: "Two interleaved pointers (optimal)",
        intuition: "Build the odd chain and even chain in one pass by hopping over alternate nodes, then join them.",
        time: "O(n)",
        timeWhy: "One pass; each node is rewired exactly once.",
        space: "O(1)",
        spaceWhy: "Only a handful of pointers — no copying, no auxiliary list.",
        code: `ListNode oddEvenList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode odd = head;
    ListNode even = head.next;
    ListNode evenHead = even;             // remember where the even list starts
    while (even != null && even.next != null) {
        odd.next = even.next;             // odd hops over the even node
        odd = odd.next;
        even.next = odd.next;             // even hops over the new odd node
        even = even.next;
    }
    odd.next = evenHead;                  // stitch even list after odd list
    return head;
}`,
        walkthrough: [
          "[1,2,3,4,5]: odd=1, even=2, evenHead=2. odd.next=3 → odd=3; even.next=4 → even=4.",
          "odd.next=5 → odd=5; even.next=null → even=null, loop ends.",
          "odd(5).next = evenHead(2) → list is 1→3→5→2→4.",
        ],
      },
    ],
    edgeCases: [
      "Empty list or a single node → return as-is (the early guard).",
      "Two nodes → already grouped (odd=[1], even=[2]).",
      "Forgetting `odd.next = evenHead` leaves the even nodes dangling and breaks the list.",
    ],
    twists: [
      "**Group by value parity instead of index** → same two-list idea, but the partition test reads `node.val`.",
      "**Partition List** (LeetCode 86) → split around a pivot value rather than index parity.",
      "**Reorder List** (LeetCode 143) → split in half, reverse the second half, then interleave.",
    ],
    related: ["partition-list", "reorder-list"],
  },

  {
    slug: "sort-list",
    title: "Sort List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 148,
    statement:
      "Given the `head` of a linked list, sort it in **ascending** order and return the sorted list. Aim for **O(n log n)** time and (ideally) **O(1)** extra space beyond recursion.",
    examples: [
      { in: "head = [4,2,1,3]", out: "[1,2,3,4]" },
      { in: "head = [-1,5,3,4,0]", out: "[-1,0,3,4,5]" },
      { in: "head = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 5·10⁴", "−10⁵ ≤ Node.val ≤ 10⁵"],
    recognize:
      "'Sort a linked list in **O(n log n)**' → **merge sort**. Merge sort is the natural fit because linked lists split and merge with pure pointer moves (no random access, unlike quicksort/heapsort which want array indexing).",
    figureItOut: [
      "Why merge sort and not the others? Quicksort and heapsort lean on O(1) random access to indices — linked lists don't offer that. Merge sort only needs to *split a list in half* and *merge two sorted lists*, both of which are clean pointer operations.",
      "**Split**: find the middle with the fast/slow pointer trick (fast moves two steps per one of slow). Cut the list there into two halves.",
      "**Recurse**: sort each half. The recursion bottoms out at lists of length 0 or 1, which are already sorted.",
      "**Merge**: combine two sorted halves with a dummy head, repeatedly attaching the smaller front node — exactly the 'merge two sorted lists' subroutine. The split-sort-merge structure gives O(n log n).",
    ],
    approaches: [
      {
        name: "Top-down merge sort (optimal time)",
        intuition: "Split at the middle, recursively sort both halves, merge the two sorted halves.",
        time: "O(n log n)",
        timeWhy: "log n levels of recursion (each halves the list); each level does O(n) total work splitting and merging.",
        space: "O(log n)",
        spaceWhy: "The recursion stack is log n deep. (A bottom-up iterative version reaches true O(1) extra space.)",
        code: `ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;

    // 1) split: find the middle, cut into two halves
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    ListNode mid = slow.next;
    slow.next = null;                     // terminate the first half

    // 2) recurse on each half
    ListNode left = sortList(head);
    ListNode right = sortList(mid);

    // 3) merge two sorted lists
    return merge(left, right);
}

ListNode merge(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else                { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;      // attach the remaining tail
    return dummy.next;
}`,
        walkthrough: [
          "[4,2,1,3]: split → [4,2] and [1,3]. fast starts at head.next so slow stops correctly.",
          "[4,2] → [4],[2] → merge [2,4]. [1,3] → [1],[3] → merge [1,3].",
          "Merge [2,4] and [1,3]: 1,2,3,4 → final [1,2,3,4].",
        ],
      },
    ],
    edgeCases: [
      "Empty list or single node → already sorted, return as-is.",
      "Starting `fast = head.next` (not `head`) makes `slow` land on the end of the *first* half so the cut splits evenly and avoids infinite recursion on length-2 lists.",
      "Duplicate values — using `a.val <= b.val` keeps the sort stable.",
    ],
    twists: [
      "**True O(1) space** → bottom-up merge sort: merge runs of size 1, 2, 4… iteratively, no recursion stack.",
      "**Merge K sorted lists** (LeetCode 23) → repeatedly merge pairs, or use a min-heap of heads.",
      "**Insertion Sort List** (LeetCode 147) → O(n²) but in-place; fine for nearly-sorted input.",
    ],
    related: ["merge-two-sorted-lists", "merge-k-sorted-lists"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "find-first-and-last-position-of-element-in-sorted-array",
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 34,
    statement:
      "Given a sorted array `nums` and a `target`, return the **starting and ending index** of `target`. If it's not present, return `[-1, -1]`. Must run in **O(log n)**.",
    examples: [
      { in: "nums = [5,7,7,8,8,10], target = 8", out: "[3,4]" },
      { in: "nums = [5,7,7,8,8,10], target = 6", out: "[-1,-1]", note: "not present" },
      { in: "nums = [], target = 0", out: "[-1,-1]" },
    ],
    constraints: ["0 ≤ nums.length ≤ 10⁵", "nums sorted ascending", "−10⁹ ≤ nums[i], target ≤ 10⁹"],
    recognize:
      "Sorted array + 'first/last occurrence' + the explicit **O(log n)** demand = **binary search for a boundary**. Plain binary search finds *some* index; here you run it twice, biased to find the **leftmost** and the **rightmost** match.",
    figureItOut: [
      "A single binary search returns an arbitrary matching index when there are duplicates — it might land in the middle of the run of 8s. You need the edges of that run.",
      "The reframe: instead of 'find target', search for **boundaries**. The first position is the leftmost index where `nums[i] >= target`; the last position is one before the leftmost index where `nums[i] > target`.",
      "So write a helper `lowerBound(x)` = first index with value `>= x`. Call it with `target` to get the left edge. Call it with `target + 1` to find where values first exceed target — the right edge is that index minus one.",
      "The trick that makes it a *boundary* search: on a match, don't return — keep shrinking toward the side you want. For the leftmost, when `nums[mid] >= x`, move `hi` left but remember `mid` as a candidate.",
    ],
    approaches: [
      {
        name: "Two lower-bound binary searches (optimal)",
        intuition: "Find first index ≥ target and first index ≥ target+1; derive both ends.",
        time: "O(log n)",
        timeWhy: "Two independent binary searches, each O(log n) → still O(log n).",
        space: "O(1)",
        spaceWhy: "Only index variables; iterative.",
        code: `int[] searchRange(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
    int last = lowerBound(nums, target + 1) - 1;     // one before where target+1 would start
    return new int[]{first, last};
}

// smallest index i with nums[i] >= x  (returns nums.length if none)
int lowerBound(int[] nums, int x) {
    int lo = 0, hi = nums.length;                    // hi is exclusive here
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < x) lo = mid + 1;             // mid too small → go right
        else hi = mid;                               // mid is a candidate → keep it, shrink right side
    }
    return lo;
}`,
        walkthrough: [
          "nums=[5,7,7,8,8,10], target=8. lowerBound(8): converges to index 3 (first 8).",
          "Guard: nums[3]==8, good. lowerBound(9): first value ≥9 is 10 at index 5 → last = 5−1 = 4.",
          "Return [3,4].",
        ],
      },
    ],
    edgeCases: [
      "Empty array → `lowerBound` returns 0, the guard `first == nums.length` catches it → [-1,-1].",
      "Target larger than everything → `lowerBound` returns nums.length → guard → [-1,-1].",
      "All elements equal to target → first 0, last n−1.",
      "Using a half-open `[lo, hi)` with `hi = nums.length` is what lets lowerBound cleanly return 'past the end'.",
    ],
    twists: [
      "**Count occurrences of target** → `last - first + 1` once you have both ends.",
      "**Search Insert Position** (LeetCode 35) → that's just `lowerBound(target)`.",
      "**Number of elements smaller than each query** → batch lower-bound queries.",
    ],
    related: ["binary-search", "search-insert-position"],
  },

  {
    slug: "peak-index-in-a-mountain-array",
    title: "Peak Index in a Mountain Array",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 852,
    statement:
      "An array `arr` is a **mountain**: it strictly increases to a single peak, then strictly decreases. Return the index of the peak. Must run in **O(log n)**.",
    examples: [
      { in: "arr = [0,1,0]", out: "1" },
      { in: "arr = [0,2,1,0]", out: "1" },
      { in: "arr = [0,10,5,2]", out: "1" },
    ],
    constraints: ["3 ≤ arr.length ≤ 10⁵", "arr is a valid mountain (one strict up-then-down peak)"],
    recognize:
      "The data isn't sorted, but the comparison `arr[mid] < arr[mid+1]` is **monotonic** across the array — true on the rising side, false on the falling side, flipping exactly once at the peak. A monotonic predicate is the green light for **binary search on the answer**.",
    figureItOut: [
      "You can't search for a *value* — there's no target. But there's still structure: before the peak each element is smaller than its right neighbour; after the peak it's larger. The predicate 'am I still going uphill?' flips exactly once.",
      "A monotonic true→false predicate is precisely what binary search exploits, even without a sorted order. The peak is the boundary where uphill stops.",
      "Compare `arr[mid]` with `arr[mid+1]`. If `arr[mid] < arr[mid+1]`, you're on the **rising** slope — the peak is to the **right**, so `lo = mid + 1`. Otherwise you're at or past the peak — the peak is `mid` or to its **left**, so `hi = mid`.",
      "Keep a half-open `[lo, hi]` collapsing to a single index. When `lo == hi`, that's the peak — no equality case to special-case because a strict mountain has no plateaus.",
    ],
    approaches: [
      {
        name: "Linear scan (baseline)",
        intuition: "Walk until an element is bigger than its right neighbour.",
        time: "O(n)",
        timeWhy: "May scan up to the peak near the end.",
        space: "O(1)",
        spaceWhy: "One index.",
        code: `int peakIndexInMountainArray(int[] arr) {
    int i = 0;
    while (arr[i] < arr[i + 1]) i++;
    return i;
}`,
      },
      {
        name: "Binary search on the slope (optimal)",
        intuition: "Move toward the uphill direction; the boundary where uphill ends is the peak.",
        time: "O(log n)",
        timeWhy: "Each comparison halves the candidate range.",
        space: "O(1)",
        spaceWhy: "Two indices.",
        code: `int peakIndexInMountainArray(int[] arr) {
    int lo = 0, hi = arr.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] < arr[mid + 1]) lo = mid + 1;   // still climbing → peak is right
        else hi = mid;                               // at/after peak → peak is here or left
    }
    return lo;                                       // lo == hi == peak
}`,
        walkthrough: [
          "arr=[0,10,5,2]: lo=0 hi=3, mid=1 → arr[1]=10 > arr[2]=5 → hi=1.",
          "lo=0 hi=1, mid=0 → arr[0]=0 < arr[1]=10 → lo=1.",
          "lo==hi==1 → return 1.",
        ],
      },
    ],
    edgeCases: [
      "Peak at the second or second-to-last index (smallest valid mountains like [0,1,0]).",
      "Because the mountain is strict, `arr[mid] == arr[mid+1]` never happens — no plateau handling needed.",
      "Comparing `arr[mid]` with `arr[mid+1]` is safe since `mid < hi` guarantees `mid+1` is in range.",
    ],
    twists: [
      "**Find Peak Element** (LeetCode 162) → not a guaranteed mountain; any local peak counts, same neighbour-comparison binary search.",
      "**Find in Mountain Array** (LeetCode 1095) → first find the peak, then binary search each slope separately.",
      "**Generalized monotonic predicate** → 'first index where condition flips' is the reusable template.",
    ],
    related: ["find-peak-element", "binary-search"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "sliding-window-median",
    title: "Sliding Window Median",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 480,
    statement:
      "Given an array `nums` and a window size `k`, return the **median** of each window as it slides one step at a time from left to right. The median of an even-sized window is the average of its two middle values.",
    examples: [
      { in: "nums = [1,3,-1,-3,5,3,6,7], k = 3", out: "[1,-1,-1,3,5,6]" },
      { in: "nums = [1,2,3,4], k = 2", out: "[1.5,2.5,3.5]" },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵", "−2³¹ ≤ nums[i] ≤ 2³¹ − 1"],
    recognize:
      "A **running median** is the two-heap pattern (max-heap of the lower half, min-heap of the upper half). The sliding twist adds **removal** of the element leaving the window — solved with **lazy deletion** (defer removing until the stale element bubbles to a heap top).",
    figureItOut: [
      "Recall *Find Median from a Data Stream*: keep a **max-heap** for the smaller half and a **min-heap** for the larger half, balanced so their sizes differ by at most one. The median is then the top of the larger heap (odd k) or the average of both tops (even k).",
      "The new difficulty is the window: each step you **add** one element and **remove** the one that fell off the left. Heaps support add and peek cheaply, but arbitrary removal is O(n) — too slow if done literally.",
      "The standard escape is **lazy deletion**: keep a hash map of values 'scheduled for removal'. You don't physically remove from the middle of a heap. Instead, whenever the element at a heap's *top* is marked stale, pop it then (it's reached the top anyway).",
      "After each add/remove you re-balance the two heaps by size, then read the median off the top(s). Track a balance counter so the lazy-deleted elements don't corrupt the size comparison.",
      "Note the `int` overflow trap: average two middle ints as `((long)a + b) / 2.0` so values near Integer.MAX_VALUE don't wrap.",
    ],
    approaches: [
      {
        name: "Sort each window (baseline)",
        intuition: "Re-sort the k-element window every step and read the middle.",
        time: "O(n·k log k)",
        timeWhy: "n windows, each sorted in O(k log k).",
        space: "O(k)",
        spaceWhy: "A copy of the window.",
        code: `// Conceptual baseline — too slow for n,k up to 1e5.
// For each window: copy k elements, Arrays.sort, take middle (or average of two middles).
`,
      },
      {
        name: "Two heaps with lazy deletion (optimal)",
        intuition: "Max-heap (lower half) + min-heap (upper half); defer removals via a map and purge lazily at the tops.",
        time: "O(n log k)",
        timeWhy: "Each element is inserted and (lazily) removed once; heap operations are O(log k).",
        space: "O(k)",
        spaceWhy: "The two heaps plus the to-remove map hold O(k) live + stale entries.",
        code: `double[] medianSlidingWindow(int[] nums, int k) {
    // max-heap = lower half, min-heap = upper half
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> hi = new PriorityQueue<>();
    Map<Integer, Integer> toRemove = new HashMap<>();
    double[] res = new double[nums.length - k + 1];
    int balance = 0;                       // lo.size - hi.size, ignoring stale entries

    for (int i = 0; i < nums.length; i++) {
        // add nums[i]
        if (lo.isEmpty() || nums[i] <= lo.peek()) { lo.offer(nums[i]); balance++; }
        else { hi.offer(nums[i]); balance--; }

        // remove the element leaving the window
        if (i >= k) {
            int out = nums[i - k];
            toRemove.merge(out, 1, Integer::sum);
            if (out <= lo.peek()) balance--; else balance++;
        }

        // rebalance sizes
        if (balance > 0) { hi.offer(lo.poll()); balance -= 2; }
        else if (balance < 0) { lo.offer(hi.poll()); balance += 2; }

        // purge stale tops
        while (!lo.isEmpty() && toRemove.getOrDefault(lo.peek(), 0) > 0) {
            toRemove.merge(lo.peek(), -1, Integer::sum); lo.poll();
        }
        while (!hi.isEmpty() && toRemove.getOrDefault(hi.peek(), 0) > 0) {
            toRemove.merge(hi.peek(), -1, Integer::sum); hi.poll();
        }

        if (i >= k - 1) {
            res[i - k + 1] = (k % 2 == 1)
                ? (double) lo.peek()
                : ((long) lo.peek() + hi.peek()) / 2.0;   // long avoids overflow
        }
    }
    return res;
}`,
        walkthrough: [
          "nums=[1,3,-1,-3,5,3,6,7], k=3. First window {1,3,-1}: lo={1,-1}, hi={3} → median lo.peek()=1.",
          "Slide: add -3 (schedule remove 1), purge stale 1 from lo → window {3,-1,-3}, median -1.",
          "Continue → [1,-1,-1,3,5,6].",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → every window's median is the element itself.",
      "Even k → average the two middle values; the `(long)` cast prevents overflow near Integer.MAX_VALUE.",
      "Lazy deletion means heap `.size()` can include stale entries — always track balance via a counter, not the raw sizes.",
    ],
    twists: [
      "**Find Median from a Data Stream** (LeetCode 295) → the no-removal version; pure two-heap balancing.",
      "**Sliding Window Maximum** (LeetCode 239) → a monotonic deque, not heaps, gives O(n).",
      "**Order-statistic / indexed tree** → an alternative using a balanced BST or a Fenwick tree on values.",
    ],
    related: ["find-median-from-data-stream", "kth-largest-element-in-a-stream"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "stream-of-characters",
    title: "Stream of Characters",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 1032,
    statement:
      "Design `StreamChecker`: initialized with a list of `words`. As characters arrive one at a time via `query(letter)`, return `true` if **any** word from the list is a **suffix** of the stream of characters queried so far.",
    examples: [
      {
        in: 'words = ["cd","f","kl"]; query("a")→false, query("b")→false, query("c")→false, query("d")→true ("cd"), query("e")→false, query("f")→true ("f")',
        out: "false,false,false,true,false,true",
      },
    ],
    constraints: ["1 ≤ words.length ≤ 2000", "1 ≤ words[i].length ≤ 200", "≤ 4·10⁴ query calls"],
    recognize:
      "We're matching **suffixes** of a growing stream against a dictionary. Suffix matching = match characters from the **end backward**, so build a **trie of the reversed words** and walk it against the recent stream read in reverse.",
    figureItOut: [
      "A word is a suffix of the stream if its characters match the **last few** characters typed, in order. The newest character is the *last* letter of any matching word, the one before is the second-to-last, and so on.",
      "Tries normally match prefixes (front to back). But here the natural fixed point is the *end* of the stream. Flip the problem: **reverse every dictionary word** and store it in a trie. Then a suffix match becomes a prefix match on the reversed stream.",
      "Keep the queried characters in a list (or just the last L, where L is the longest word). On each `query`, walk backward from the newest character, descending the reversed-word trie. If you ever hit a node marked `isWord`, some reversed word matched → a real word is a suffix → return true.",
      "You only ever need to look back as far as the longest word length, so you can cap the remembered history at L characters to keep memory bounded.",
    ],
    approaches: [
      {
        name: "Trie of reversed words + backward walk (optimal)",
        intuition: "Store words reversed in a trie; on each query, walk the stream backward through the trie until a word-end or a dead branch.",
        time: "O(L) per query",
        timeWhy: "Each query walks back at most L characters (L = longest word length) through the trie; build is O(total characters).",
        space: "O(total characters)",
        spaceWhy: "The trie stores every character of every word once (shared prefixes are merged); the history list holds at most L characters.",
        code: `class StreamChecker {
    static class Node {
        Node[] next = new Node[26];
        boolean isWord;
    }

    private final Node root = new Node();
    private final StringBuilder stream = new StringBuilder();
    private int maxLen = 0;

    public StreamChecker(String[] words) {
        for (String w : words) {
            maxLen = Math.max(maxLen, w.length());
            Node cur = root;
            for (int i = w.length() - 1; i >= 0; i--) {   // insert REVERSED
                int c = w.charAt(i) - 'a';
                if (cur.next[c] == null) cur.next[c] = new Node();
                cur = cur.next[c];
            }
            cur.isWord = true;
        }
    }

    public boolean query(char letter) {
        stream.append(letter);
        // only the last maxLen characters can matter
        if (stream.length() > maxLen) stream.deleteCharAt(0);
        Node cur = root;
        for (int i = stream.length() - 1; i >= 0; i--) {  // walk the stream BACKWARD
            int c = stream.charAt(i) - 'a';
            if (cur.next[c] == null) return false;        // no reversed word continues
            cur = cur.next[c];
            if (cur.isWord) return true;                  // a word matched as a suffix
        }
        return false;
    }
}`,
        walkthrough: [
          'words ["cd","f","kl"] reversed → "dc","f","lk" inserted into the trie.',
          'query "a","b","c": walking back from each finds no reversed-word path → false.',
          'query "d": stream "...cd"; backward is d,c → matches reversed "dc", node isWord → true.',
        ],
      },
    ],
    edgeCases: [
      "A single-character word (e.g. \"f\") → matches the moment that character arrives.",
      "Overlapping words sharing suffixes → the reversed trie merges their shared (reversed-prefix) nodes automatically.",
      "Capping history at maxLen is what keeps the stream from growing unbounded across 40k queries.",
    ],
    twists: [
      "**Prefix matching instead** → store words forward and check the stream as it grows (standard trie).",
      "**Aho-Corasick automaton** → if you also need *all* matches, not just suffix existence, build failure links for O(1) amortized per character.",
      "**Word Break** (LeetCode 139) → segment a whole string into dictionary words; a trie speeds the DP transitions.",
    ],
    related: ["implement-trie-prefix-tree", "design-add-and-search-words-data-structure"],
  },
];
