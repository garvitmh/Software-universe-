// NeetCode All — wave 11b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
export const WAVE11B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "binary-tree-preorder-traversal",
    title: "Binary Tree Preorder Traversal",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 144,
    statement:
      "Given the `root` of a binary tree, return the **preorder traversal** of its nodes' values. Preorder visits the **root first**, then the entire left subtree, then the entire right subtree.",
    examples: [
      { in: "root = [1,null,2,3]", out: "[1,2,3]", note: "root 1, no left child, right subtree 2 with left child 3" },
      { in: "root = []", out: "[]" },
      { in: "root = [1]", out: "[1]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100", "follow-up: solve it iteratively"],
    recognize:
      "A foundational **DFS ordering** problem. Recursion writes itself (visit, recurse left, recurse right), so the real lesson is the **explicit-stack** iterative form: push the root, and on each pop emit the node then push its right child before its left so left comes off the stack first.",
    figureItOut: [
      "Preorder is defined recursively: output the node's value, then do a preorder of the left subtree, then a preorder of the right subtree. So the recursive solution is a direct transcription of that definition — emit val, recurse left, recurse right.",
      "The interesting part is doing it without recursion, simulating the call stack yourself with an explicit stack of nodes. You want to process the root before its children, which is what a stack (last-in-first-out) lets you control by the push order.",
      "Push the root. Then loop: pop a node, emit its value (root first — that is the 'pre' in preorder), and push its children so that the LEFT child is processed next. Because a stack reverses order, you must push the RIGHT child first and the LEFT child second, so left sits on top and pops first.",
      "Why push right-then-left and not left-then-right? Whatever you push last pops first. Preorder needs the left subtree fully handled before the right, so left must be on top — hence push right first. Skip null children. When the stack empties, every node has been emitted in preorder.",
    ],
    approaches: [
      {
        name: "Recursive DFS (baseline)",
        intuition: "Transcribe the definition directly: emit value, recurse left, recurse right.",
        time: "O(n)",
        timeWhy: "Each node is visited exactly once.",
        space: "O(h)",
        spaceWhy: "Recursion stack as deep as the tree height h (O(n) for a skewed tree).",
        code: `List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    dfs(root, out);
    return out;
}

void dfs(TreeNode node, List<Integer> out) {
    if (node == null) return;
    out.add(node.val);      // root first
    dfs(node.left, out);    // then left subtree
    dfs(node.right, out);   // then right subtree
}`,
      },
      {
        name: "Iterative with an explicit stack (optimal, no recursion)",
        intuition: "Push root; pop and emit; push right then left so left pops next.",
        time: "O(n)",
        timeWhy: "Each node is pushed and popped exactly once.",
        space: "O(h)",
        spaceWhy: "The stack holds at most one root-to-leaf path's worth of pending right children.",
        code: `List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> out = new ArrayList<>();
    if (root == null) return out;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        out.add(node.val);                       // emit root first
        if (node.right != null) stack.push(node.right);  // push right first
        if (node.left  != null) stack.push(node.left);   // so left pops next
    }
    return out;
}`,
        walkthrough: [
          "root=[1,null,2,3]. Push 1. Pop 1 → emit 1. 1 has no left; push right 2. Stack: [2].",
          "Pop 2 → emit 2. Push 2's right (null, skip) then left 3. Stack: [3].",
          "Pop 3 → emit 3. No children. Stack empty. Result [1,2,3].",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → return an empty list.",
      "Right-skewed tree → the stack never holds more than one node at a time.",
      "Left-skewed tree → each pop pushes one left child; the stack stays shallow but every node is still emitted in order.",
    ],
    twists: [
      "**Binary Tree Inorder Traversal** (LeetCode 94) → emit the node between its subtrees; the iterative version walks left first using the stack.",
      "**Binary Tree Postorder Traversal** (LeetCode 145) → emit the node last; a neat trick is a modified preorder (root,right,left) reversed.",
      "**Morris traversal** → traverse in O(1) extra space by threading temporary links instead of using a stack.",
    ],
    related: ["binary-tree-inorder-traversal", "binary-tree-postorder-traversal", "binary-tree-level-order-traversal"],
  },

  {
    slug: "closest-binary-search-tree-value",
    title: "Closest Binary Search Tree Value",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 270,
    statement:
      "Given the `root` of a binary search tree and a target value `target` (a double), return the value in the BST that is **closest** to `target`. If several values are equally close, return the **smallest** such value.",
    examples: [
      { in: "root = [4,2,5,1,3], target = 3.714286", out: "4", note: "4 is the nearest node value to 3.714286" },
      { in: "root = [1], target = 4.428571", out: "1" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "0 ≤ Node.val ≤ 10⁹", "−10⁹ ≤ target ≤ 10⁹"],
    recognize:
      "You are searching a BST for the nearest value — a **guided descent**. The BST ordering tells you which way to go: at each node, move toward target (left if target is smaller, right if larger), tracking the closest value seen, since the path itself contains the best candidate.",
    figureItOut: [
      "A naive scan would compare target against every node and keep the closest. Correct, but it throws away the BST ordering, which is exactly what lets you avoid most of the tree.",
      "Use the ordering as a guide. At the current node, compare its value to the best-so-far and update if it is nearer to target. Then decide which way to descend: if target < node.val the only possibly-closer values are in the left subtree; if target > node.val they are in the right subtree.",
      "Why is the descent path enough? Stepping toward target at every node means each move strictly narrows the gap on that side. The value closest to target must lie on this root-to-leaf search path, so you never need to explore the side you turned away from.",
      "Handle the tie rule: 'equally close → smaller value'. When a candidate's distance equals the current best distance, prefer the numerically smaller value. Walk down until you fall off the tree (null), then return the best value collected.",
    ],
    approaches: [
      {
        name: "Guided descent tracking the closest (optimal)",
        intuition: "Walk toward target; update the closest value, break ties toward the smaller value.",
        time: "O(h)",
        timeWhy: "One comparison per level; h is the tree height (O(log n) balanced, O(n) skewed).",
        space: "O(1)",
        spaceWhy: "Only a couple of variables; no recursion or auxiliary structure.",
        code: `int closestValue(TreeNode root, double target) {
    int closest = root.val;
    TreeNode cur = root;
    while (cur != null) {
        double curDiff  = Math.abs(cur.val - target);
        double bestDiff = Math.abs(closest - target);
        if (curDiff < bestDiff || (curDiff == bestDiff && cur.val < closest)) {
            closest = cur.val;             // nearer, or equal but smaller
        }
        if (target < cur.val) cur = cur.left;   // closer values are to the left
        else                  cur = cur.right;  // closer values are to the right
    }
    return closest;
}`,
        walkthrough: [
          "root=[4,2,5,1,3], target=3.714286. cur=4: diff 0.286 → closest=4. target<4 → go left.",
          "cur=2: diff 1.714 > 0.286 → keep 4. target>2 → go right. cur=3: diff 0.714 > 0.286 → keep 4. target>3 → go right (null).",
          "Fell off the tree. Return closest = 4.",
        ],
      },
    ],
    edgeCases: [
      "Single-node tree → that node is trivially the closest.",
      "Tie between two equally-close values → return the smaller one (the explicit tie check enforces this).",
      "Target far outside the value range → the descent walks straight to the min or max leaf, which is the closest.",
    ],
    twists: [
      "**Closest BST Value II** (LeetCode 272) → return the k closest values; combine inorder traversal with a sliding window or two stacks.",
      "**Search in a BST** (LeetCode 700) → the same descent but you stop on an exact match instead of tracking nearest.",
      "**Unsorted array** → without BST ordering you must scan every element, an unavoidable O(n).",
    ],
    related: ["kth-smallest-element-in-a-bst", "validate-binary-search-tree", "range-sum-of-bst"],
  },

  {
    slug: "binary-tree-level-order-traversal-ii",
    title: "Binary Tree Level Order Traversal II",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 107,
    statement:
      "Given the `root` of a binary tree, return the **bottom-up level order traversal** of its nodes' values: the list of levels ordered from the leaf level up to the root level, each level read left to right.",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "[[15,7],[9,20],[3]]" },
      { in: "root = [1]", out: "[[1]]" },
      { in: "root = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 2000", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "This is ordinary **BFS level-order traversal** with one final twist: produce the levels **bottom-up**. The natural way is to do a normal top-down BFS and then reverse, or insert each level at the front of the result list.",
    figureItOut: [
      "Level-order means grouping nodes by depth, read left to right. That is breadth-first search: a queue that processes the tree one full level at a time, where the queue's current size tells you how many nodes are on the level you are about to drain.",
      "Run the standard BFS: while the queue is non-empty, record its current size, then dequeue exactly that many nodes, collect their values into one level list, and enqueue their children for the next round. That yields levels top-down (root level first).",
      "The only new requirement is bottom-up order — leaf level first, root level last. You already produced the levels top-down, so the cleanest fix is to reverse the list of levels at the very end (or equivalently push each completed level onto the front of the result).",
      "Inserting at the front of an ArrayList is O(n) per insert, so reversing once at the end, or using a LinkedList's addFirst, keeps it efficient. Within each level the natural left-to-right enqueue order is preserved, which is what the problem wants.",
    ],
    approaches: [
      {
        name: "BFS top-down then reverse (optimal)",
        intuition: "Standard queue BFS to build levels top-down; reverse the level list at the end.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued once; the final reverse is O(number of levels).",
        space: "O(n)",
        spaceWhy: "The queue can hold up to a full level (~n/2 nodes) and the output stores every value.",
        code: `List<List<Integer>> levelOrderBottom(TreeNode root) {
    List<List<Integer>> levels = new ArrayList<>();
    if (root == null) return levels;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();             // nodes on this level
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left  != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        levels.add(level);
    }
    Collections.reverse(levels);             // top-down -> bottom-up
    return levels;
}`,
        walkthrough: [
          "root=[3,9,20,null,null,15,7]. BFS level 0: [3], enqueue 9,20. Level 1: [9,20], enqueue 15,7.",
          "Level 2: [15,7]. Top-down result [[3],[9,20],[15,7]].",
          "Reverse → [[15,7],[9,20],[3]].",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → return an empty list (no levels).",
      "Single node → one level [[root.val]]; reversing a one-element list is a no-op.",
      "Skewed tree (every node has one child) → each level has exactly one node; the result is each value in its own list, bottom-up.",
    ],
    twists: [
      "**Binary Tree Level Order Traversal** (LeetCode 102) → the top-down version; just skip the final reverse.",
      "**Binary Tree Zigzag Level Order Traversal** (LeetCode 103) → alternate left-to-right and right-to-left per level.",
      "**Average of Levels** (LeetCode 637) → same BFS, but reduce each level to its mean instead of listing values.",
    ],
    related: ["binary-tree-level-order-traversal", "binary-tree-zigzag-level-order-traversal", "binary-tree-right-side-view"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "delete-node-in-a-linked-list",
    title: "Delete Node in a Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 237,
    statement:
      "You are given direct access only to a `node` in a singly linked list (not the head), and that node is **not the tail**. Delete the given node from the list. You are not given the head, so you cannot reach the node's predecessor.",
    examples: [
      { in: "head = [4,5,1,9], node = the node with value 5", out: "[4,1,9]" },
      { in: "head = [4,5,1,9], node = the node with value 1", out: "[4,5,9]" },
    ],
    constraints: ["number of nodes is in [2, 1000]", "−1000 ≤ Node.val ≤ 1000", "all values are unique", "node is not the tail and is guaranteed to be in the list"],
    recognize:
      "The classic trick question: you cannot rewire a predecessor you cannot reach. The insight is to **delete the node's effect, not the node object** — copy the next node's value into this node, then splice out the next node instead.",
    figureItOut: [
      "Normally you delete a node by pointing its predecessor's next past it. But here you are handed only the node itself, with no way to find what comes before it in a singly linked list — so the usual approach is impossible.",
      "Reframe the goal: you do not have to remove this exact node object, you only have to make the LIST look as if the node's value is gone. That reframing is the whole puzzle.",
      "So make this node impersonate its successor. Copy node.next.val into node.val, so the value you wanted to delete is overwritten by the next value. Now there are two nodes holding that next value, in a row.",
      "Fix the duplication by unlinking the real next node: node.next = node.next.next. The list now reads with the original node's value removed and every later value shifted up by one position. This works precisely because node is guaranteed not to be the tail (the successor always exists).",
    ],
    approaches: [
      {
        name: "Copy successor value, then skip the successor (optimal)",
        intuition: "Overwrite this node with the next node's value, then unlink the next node.",
        time: "O(1)",
        timeWhy: "Two assignments, no traversal.",
        space: "O(1)",
        spaceWhy: "No extra storage.",
        code: `void deleteNode(ListNode node) {
    node.val  = node.next.val;     // become the successor's value
    node.next = node.next.next;    // unlink the now-duplicate successor
}`,
        walkthrough: [
          "list=[4,5,1,9], node points at the 5. Copy node.next.val (1) into node → list logically [4,1,1,9].",
          "node.next = node.next.next → skip the original 1 node.",
          "List is now [4,1,9]; the value 5 is gone.",
        ],
      },
    ],
    edgeCases: [
      "Node is the second-to-last → its successor is the tail; copying the tail's value and unlinking it leaves a valid list ending at this node.",
      "Cannot be applied to the tail → there is no successor to copy from; the constraints forbid this case.",
      "Because all values are unique, overwriting does not accidentally create an ambiguous duplicate beyond the transient one we immediately remove.",
    ],
    twists: [
      "**Remove Nth Node From End** (LeetCode 19) → you DO have the head, so use a two-pointer gap and rewire the predecessor normally.",
      "**Remove Linked List Elements** (LeetCode 203) → delete by value with a dummy head and predecessor walk.",
      "**Doubly linked list** → with a prev pointer you could delete this node directly without the copy trick.",
    ],
    related: ["remove-nth-node-from-end-of-list", "remove-linked-list-elements", "middle-of-the-linked-list"],
  },

  {
    slug: "flatten-a-multilevel-doubly-linked-list",
    title: "Flatten a Multilevel Doubly Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 430,
    statement:
      "You are given a **doubly linked list** where, in addition to `next` and `prev`, each node has a `child` pointer that may point to a separate doubly linked list (which itself may have children). **Flatten** the structure into a single-level doubly linked list: whenever a node has a child, splice the child list in right after that node and before its original next, recursively. Set all `child` pointers to null in the result.",
    examples: [
      {
        in: "head = [1,2,3,4,5,6] with 3.child = [7,8,9,10] and 8.child = [11,12]",
        out: "[1,2,3,7,8,11,12,9,10,4,5,6]",
        note: "each child list is inserted right after its parent, depth-first",
      },
      { in: "head = [1,2] with 1.child = [3]", out: "[1,3,2]" },
      { in: "head = []", out: "[]" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 1000", "1 ≤ Node.val ≤ 10⁵", "every child list is itself a valid multilevel doubly linked list"],
    recognize:
      "A child list must be inserted exactly where its parent sits, recursively — that is **depth-first splicing**. Walk the top level; when you meet a node with a child, splice the (recursively flattened) child list between the node and its next, fixing both `next`/`prev` and the `child` pointer.",
    figureItOut: [
      "The output is depth-first: at each node, if it has a child you must dive fully into that child branch (and its sub-children) before continuing to the node's original next. That 'go deep, then resume' shape is exactly recursion or an explicit stack.",
      "Consider one node `cur` with a child. You want: cur → (entire flattened child list) → cur's old next. So you need three rewires: connect cur to the child's head, find the child list's TAIL, and connect that tail back to cur's old next.",
      "Because the list is doubly linked, every `next` you set must have a matching `prev` set the other way: child.prev = cur, and oldNext.prev = childTail. Finally clear cur.child = null so the result is single-level.",
      "An elegant iterative version uses a stack: walk with `cur`; when cur.child exists, push cur.next (to resume later), then link cur to cur.child, null the child, and continue. When you reach the end of a branch (cur.next == null) and the stack is non-empty, pop and link it on, repairing prev pointers as you go.",
    ],
    approaches: [
      {
        name: "Iterative depth-first splice with a stack (optimal)",
        intuition: "Walk forward; on a child, stash the current next on a stack and dive into the child; on reaching a branch end, pop and reattach.",
        time: "O(n)",
        timeWhy: "Each node is visited once across the whole structure.",
        space: "O(d)",
        spaceWhy: "The stack holds at most the nesting depth d of resume-points (O(n) worst case for deeply nested children).",
        code: `Node flatten(Node head) {
    if (head == null) return head;
    Deque<Node> stack = new ArrayDeque<>();
    Node cur = head;
    while (cur != null) {
        if (cur.child != null) {
            if (cur.next != null) stack.push(cur.next);  // resume here later
            cur.next = cur.child;        // splice child in
            cur.next.prev = cur;
            cur.child = null;            // clear child pointer
        }
        if (cur.next == null && !stack.isEmpty()) {
            Node resume = stack.pop();   // branch ended: reattach saved tail
            cur.next = resume;
            resume.prev = cur;
        }
        cur = cur.next;
    }
    return head;
}`,
        walkthrough: [
          "head 1→2→3(child 7→8→9→10)→4..., 8 has child 11→12. cur reaches 3: push 4, link 3→7, clear child.",
          "Continue 7→8: push 9, link 8→11, clear child. 11→12: 12.next null, stack top 9 → link 12→9. 9→10: 10.next null, pop 4 → link 10→4.",
          "Result 1→2→3→7→8→11→12→9→10→4→5→6, all child pointers null.",
        ],
      },
      {
        name: "Recursive flatten returning the tail (clean equivalent)",
        intuition: "Recursively flatten a child list, return its tail, and stitch it between the node and its old next.",
        time: "O(n)",
        timeWhy: "Each node is processed once.",
        space: "O(d)",
        spaceWhy: "Recursion depth equals the child-nesting depth.",
        code: `Node flatten(Node head) {
    flattenGetTail(head);
    return head;
}

// flattens the list starting at node, returns its last node
Node flattenGetTail(Node node) {
    Node cur = node, tail = node;
    while (cur != null) {
        Node next = cur.next;
        if (cur.child != null) {
            Node childTail = flattenGetTail(cur.child);
            cur.next = cur.child;
            cur.child.prev = cur;
            cur.child = null;
            childTail.next = next;
            if (next != null) next.prev = childTail;
            tail = childTail;
        } else {
            tail = cur;
        }
        cur = next;
    }
    return tail;
}`,
      },
    ],
    edgeCases: [
      "Empty list → return null unchanged.",
      "A child at the tail node → the flattened child simply extends the list; there is no old next to reattach.",
      "Deeply nested single-child chains → the stack/recursion depth grows with the nesting; each level is spliced before resuming the parent.",
    ],
    twists: [
      "**Design Linked List** (LeetCode 707) → builds the doubly/singly linked primitives this problem manipulates.",
      "**Copy List with Random Pointer** (LeetCode 138) → another pointer-rewiring problem, cloning instead of flattening.",
      "**Flatten a binary tree to a linked list** (LeetCode 114) → the same depth-first splice idea, on a tree instead of a child-list.",
    ],
    related: ["design-linked-list", "copy-list-with-random-pointer", "flatten-binary-tree-to-linked-list"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "seat-reservation-manager",
    title: "Seat Reservation Manager",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1845,
    statement:
      "Design a `SeatManager` that manages reservation of `n` seats numbered 1 to n, all initially unreserved. Implement `reserve()` which reserves and returns the **smallest-numbered** unreserved seat, and `unreserve(seatNumber)` which frees a previously reserved seat.",
    examples: [
      {
        in: "SeatManager(5); reserve()→1; reserve()→2; unreserve(2); reserve()→2; reserve()→3; reserve()→4; reserve()→5; unreserve(5)",
        out: "[null,1,2,null,2,3,4,5,null]",
        note: "reserve always returns the smallest free seat; unreserve(2) makes 2 available again",
      },
    ],
    constraints: ["1 ≤ n ≤ 10⁵", "1 ≤ seatNumber ≤ n", "at most 10⁵ calls combined", "every reserve() has at least one free seat; unreserve is only called on a reserved seat"],
    recognize:
      "You must repeatedly hand out the **smallest available** number and accept freed numbers back — that is exactly a **min-heap**. A pointer-plus-heap optimization avoids pre-loading all n seats: a counter tracks the contiguous never-touched seats and the heap only stores freed ones.",
    figureItOut: [
      "reserve() must always give the smallest unreserved seat, and unreserve() can return any seat to the pool. 'Always extract the minimum, support insertion of arbitrary values' is the textbook signature of a **min-heap** (priority queue).",
      "The simplest version: push 1..n into a min-heap up front. reserve() pops the minimum; unreserve(seat) pushes it back. Both are O(log n). Correct, but pre-loading 10⁵ seats wastes time and space when few are reserved.",
      "Optimization: notice seats are handed out in increasing order from a contiguous frontier. Keep an integer `next` = the smallest seat never yet reserved, and a min-heap holding only seats that were reserved then freed (so they are below `next`).",
      "reserve(): if the heap has a freed seat smaller than `next`, pop it; otherwise hand out `next` and increment it. unreserve(seat): push seat onto the heap (it is now reclaimable). The heap stays small — it only ever holds freed seats — and both operations remain O(log n).",
    ],
    approaches: [
      {
        name: "Min-heap pre-loaded with all seats (baseline)",
        intuition: "Push 1..n into a min-heap; reserve pops the min, unreserve pushes the seat back.",
        time: "O(n) init, O(log n) per op",
        timeWhy: "Building the heap of n seats is O(n); each reserve/unreserve is a heap pop/push.",
        space: "O(n)",
        spaceWhy: "The heap stores all n seat numbers from the start.",
        code: `class SeatManager {
    private final PriorityQueue<Integer> heap = new PriorityQueue<>();

    public SeatManager(int n) {
        for (int s = 1; s <= n; s++) heap.offer(s);
    }

    public int reserve() {
        return heap.poll();          // smallest free seat
    }

    public void unreserve(int seatNumber) {
        heap.offer(seatNumber);      // seat is free again
    }
}`,
      },
      {
        name: "Frontier counter + min-heap of freed seats (optimal)",
        intuition: "Track the next never-used seat with a counter; the heap only holds reclaimed seats.",
        time: "O(1) init, O(log n) per op",
        timeWhy: "No pre-loading; each op touches the small heap (only freed seats) or bumps the counter.",
        space: "O(n) worst",
        spaceWhy: "The heap holds at most the number of currently-freed seats, far fewer than n in practice.",
        code: `class SeatManager {
    private int next = 1;                                  // smallest never-reserved seat
    private final PriorityQueue<Integer> freed = new PriorityQueue<>();

    public SeatManager(int n) { }

    public int reserve() {
        if (!freed.isEmpty() && freed.peek() < next) {
            return freed.poll();     // reuse a freed seat below the frontier
        }
        return next++;               // otherwise take the next fresh seat
    }

    public void unreserve(int seatNumber) {
        freed.offer(seatNumber);     // return it to the reclaimable pool
    }
}`,
        walkthrough: [
          "n=5. reserve→ heap empty → next=1, return 1, next=2. reserve→ return 2, next=3.",
          "unreserve(2) → freed={2}. reserve→ freed.peek()=2 < next=3 → return 2. reserve→ freed empty → return 3, next=4.",
          "reserve→4, reserve→5. unreserve(5) → freed={5}; the next reserve would return 5.",
        ],
      },
    ],
    edgeCases: [
      "Reserve right after unreserve → the freed seat (smaller than the frontier) is returned before any fresh seat.",
      "All seats reserved then one freed → the heap holds exactly that one seat and reserve returns it.",
      "n = 1 → single seat; reserve returns 1, unreserve(1) makes it available again.",
    ],
    twists: [
      "**Kth Largest Element in a Stream** (LeetCode 703) → a min-heap of fixed size k instead of smallest-available numbers.",
      "**Smallest Number in Infinite Set** (LeetCode 2336) → essentially this problem with an unbounded seat range.",
      "**Design Phone Directory** (LeetCode 379) → same get-smallest-free / release pattern, often done with a queue or bitset.",
    ],
    related: ["kth-largest-element-in-a-stream", "last-stone-weight", "minimum-cost-to-connect-sticks"],
  },

  {
    slug: "relative-ranks",
    title: "Relative Ranks",
    difficulty: "Easy",
    pattern: "heaps",
    leetcode: 506,
    statement:
      "You are given a `score` array where `score[i]` is the (distinct) score of the i-th athlete. Higher score means a better rank. Return an array `answer` where `answer[i]` is the i-th athlete's rank: the top three scores get `\"Gold Medal\"`, `\"Silver Medal\"`, `\"Bronze Medal\"`, and every other athlete gets their placement number as a string (\"4\", \"5\", ...).",
    examples: [
      { in: "score = [5,4,3,2,1]", out: '["Gold Medal","Silver Medal","Bronze Medal","4","5"]' },
      { in: "score = [10,3,8,9,4]", out: '["Gold Medal","5","Bronze Medal","Silver Medal","4"]' },
    ],
    constraints: ["1 ≤ score.length ≤ 10⁴", "0 ≤ score[i] ≤ 10⁶", "all scores are distinct"],
    recognize:
      "You need athletes processed from highest score to lowest while remembering their original positions. 'Repeatedly take the maximum' is a **max-heap** of (score, index) pairs; popping in order yields ranks 1, 2, 3, ... which you write back to each original index.",
    figureItOut: [
      "Rank depends on order: the largest score is rank 1, the next is rank 2, and so on. But the answer must be written back at each athlete's ORIGINAL index, so you cannot just sort and lose track of where each score came from.",
      "Pair each score with its original index. Then you need to visit pairs from highest score to lowest, assigning rank 1, 2, 3, ... in that order. 'Give me the maximum repeatedly' is a **max-heap** keyed by score.",
      "Push every (score, index) into a max-heap. Pop them one at a time; the first pop is rank 1, the second rank 2, etc. For ranks 1–3 write the medal strings; for rank ≥ 4 write the number as a string — always into answer[index] using the stored original index.",
      "A simpler equivalent skips the heap: build an index array, sort it by descending score, then the position in that sorted order IS the rank. The heap is the canonical 'streaming maximum' framing; sorting is the same idea materialized at once, both O(n log n).",
    ],
    approaches: [
      {
        name: "Max-heap of (score, index) (idiomatic)",
        intuition: "Push all (score,index) pairs; pop largest-first, assigning ranks 1,2,3,... back to original indices.",
        time: "O(n log n)",
        timeWhy: "n pushes and n pops on the heap, each O(log n).",
        space: "O(n)",
        spaceWhy: "The heap holds all n pairs plus the output array.",
        code: `String[] findRelativeRanks(int[] score) {
    int n = score.length;
    // max-heap by score; store [score, originalIndex]
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
    for (int i = 0; i < n; i++) heap.offer(new int[]{ score[i], i });

    String[] answer = new String[n];
    int rank = 1;
    while (!heap.isEmpty()) {
        int idx = heap.poll()[1];
        if (rank == 1)      answer[idx] = "Gold Medal";
        else if (rank == 2) answer[idx] = "Silver Medal";
        else if (rank == 3) answer[idx] = "Bronze Medal";
        else                answer[idx] = Integer.toString(rank);
        rank++;
    }
    return answer;
}`,
        walkthrough: [
          "score=[10,3,8,9,4]. Heap pops 10(idx0)→rank1 Gold, 9(idx3)→rank2 Silver, 8(idx2)→rank3 Bronze.",
          "Then 4(idx4)→rank4 \"4\", 3(idx1)→rank5 \"5\".",
          "answer=[\"Gold Medal\",\"5\",\"Bronze Medal\",\"Silver Medal\",\"4\"].",
        ],
      },
      {
        name: "Sort indices by descending score (optimal-equivalent)",
        intuition: "Sort an index array by score descending; position in that order is the rank.",
        time: "O(n log n)",
        timeWhy: "Sorting the index array dominates; the write-back pass is linear.",
        space: "O(n)",
        spaceWhy: "The index array and output array.",
        code: `String[] findRelativeRanks(int[] score) {
    int n = score.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a, b) -> score[b] - score[a]);   // descending score

    String[] answer = new String[n];
    for (int rank = 1; rank <= n; rank++) {
        int i = idx[rank - 1];
        if (rank == 1)      answer[i] = "Gold Medal";
        else if (rank == 2) answer[i] = "Silver Medal";
        else if (rank == 3) answer[i] = "Bronze Medal";
        else                answer[i] = Integer.toString(rank);
    }
    return answer;
}`,
      },
    ],
    edgeCases: [
      "Fewer than 3 athletes → only the available medals are assigned (e.g. one athlete gets just \"Gold Medal\").",
      "Scores given in arbitrary order → the original-index bookkeeping places each rank correctly.",
      "Largest possible scores → values fit comfortably in int; the comparator subtraction stays within range for the given bounds.",
    ],
    twists: [
      "**Kth Largest Element in an Array** (LeetCode 215) → only the k-th order statistic, not full ranking; a size-k heap or quickselect.",
      "**Top K Frequent Elements** (LeetCode 347) → rank by frequency rather than raw value.",
      "**Ties allowed** → if scores could tie, you would need a tie-breaking rule and equal ranks, changing the placement numbering.",
    ],
    related: ["kth-largest-element-in-an-array", "top-k-frequent-elements", "last-stone-weight"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "short-encoding-of-words",
    title: "Short Encoding of Words",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 820,
    statement:
      "A valid encoding of an array `words` is a string `s` and a list of indices `indices` such that each word equals `s.substring(indices[i], s.indexOf('#', indices[i]))`, where `#` separates encoded words. Return the **length of the shortest** such reference string `s`. In effect, a word need not be stored separately if it is a **suffix** of another word (then it shares that word's tail plus the `#`).",
    examples: [
      { in: 'words = ["time","me","bell"]', out: "10", note: 'encoding "time#bell#": "me" is a suffix of "time", so it is free' },
      { in: 'words = ["t"]', out: "2", note: '"t#" has length 2' },
    ],
    constraints: ["1 ≤ words.length ≤ 2000", "1 ≤ words[i].length ≤ 7", "lowercase English letters"],
    recognize:
      "A word is redundant exactly when it is a **suffix** of another word. Suffixes become prefixes if you **reverse** every word — so insert reversed words into a **trie** and only the words that end at a leaf (no further extension) cost real space.",
    figureItOut: [
      "When can two words share storage? If 'me' is a suffix of 'time', then 'time#' already contains 'me#' at its tail, so 'me' costs nothing extra. So the real question is: which words are suffixes of some other word?",
      "Suffix-matching is awkward, but a trie naturally indexes **prefixes**. Convert suffixes to prefixes by **reversing** each word: 'time' → 'emit', 'me' → 'em'. Now 'me' is a suffix of 'time' exactly when 'em' is a prefix of 'emit'.",
      "Insert every reversed word into a trie. A reversed word that is a prefix of another reversed word ends at an internal node (it has children); a word that is NOT a suffix of anything ends at a node with no children — a leaf.",
      "Each surviving word (one whose reversed form ends at a leaf) contributes its length + 1 (for the `#`). Words ending at internal nodes are absorbed into a longer word and cost nothing. Sum (wordLength + 1) over all trie leaves. Deduplicate words first since identical words collapse to one.",
    ],
    approaches: [
      {
        name: "Trie of reversed words, sum over leaves (optimal)",
        intuition: "Reverse each word and insert; only words ending at a childless node (leaf) cost length+1.",
        time: "O(Σ len)",
        timeWhy: "Insert every character of every word once; a final leaf scan is proportional to the trie size.",
        space: "O(Σ len)",
        spaceWhy: "The trie stores all characters of all (reversed) words.",
        code: `class Solution {
    static class Node {
        Map<Character, Node> next = new HashMap<>();
    }

    public int minimumLengthEncoding(String[] words) {
        Node root = new Node();
        Set<String> unique = new HashSet<>(Arrays.asList(words));  // dedupe
        Map<Node, Integer> depth = new HashMap<>();                // leaf node -> word length

        for (String w : unique) {
            Node cur = root;
            for (int i = w.length() - 1; i >= 0; i--) {            // insert reversed
                char c = w.charAt(i);
                cur.next.putIfAbsent(c, new Node());
                cur = cur.next.get(c);
            }
            depth.put(cur, w.length());                           // node where this word ends
        }

        int total = 0;
        for (Map.Entry<Node, Integer> e : depth.entrySet()) {
            if (e.getKey().next.isEmpty()) {                      // leaf: not a suffix of anything
                total += e.getValue() + 1;                        // +1 for the '#'
            }
        }
        return total;
    }
}`,
        walkthrough: [
          'words=["time","me","bell"]. Reversed inserts: "emit", "em", "lleb".',
          '"em" ends at an internal node of "emit" (it has child t) → absorbed, contributes 0. "emit" ends at a leaf → 4+1=5. "lleb" ends at a leaf → 4+1=5.',
          "Total 5 + 5 = 10.",
        ],
      },
    ],
    edgeCases: [
      "Duplicate words → deduplicate first, or they would be counted twice.",
      "One word that is a suffix of two different words → still absorbed once; only its endpoint being internal matters.",
      "No word is a suffix of another → every word contributes length+1; the answer is Σ(len)+count.",
    ],
    twists: [
      "**Implement Trie** (LeetCode 208) → the underlying prefix tree without the reverse/leaf trick.",
      "**Replace Words** (LeetCode 648) → trie of roots, find the shortest prefix-root of each word.",
      "**Longest common suffix queries** → reverse-into-trie generalizes to answering shared-suffix questions.",
    ],
    related: ["implement-trie-prefix-tree", "replace-words", "longest-common-prefix"],
  },

  {
    slug: "prefix-and-suffix-search",
    title: "Prefix and Suffix Search",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 745,
    statement:
      "Design a `WordFilter` initialized with an array of `words`. Implement `f(prefix, suffix)` that returns the **largest index** of a word that has both the given `prefix` and the given `suffix`. If no such word exists, return −1. Later-inserted words (higher index) win ties.",
    examples: [
      {
        in: 'WordFilter(["apple"]); f("a","e")',
        out: "0",
        note: '"apple" starts with "a" and ends with "e", index 0',
      },
      {
        in: 'WordFilter(["cat","car","card"]); f("c","r")',
        out: "1",
        note: '"car" (index 1) matches prefix "c" and suffix "r"; "cat" ends in t, "card" in d',
      },
    ],
    constraints: ["1 ≤ words.length ≤ 10⁴", "1 ≤ words[i].length, prefix.length, suffix.length ≤ 7", "at most 10⁴ calls to f", "lowercase English letters"],
    recognize:
      "Combine a prefix and a suffix constraint in one trie by indexing every **suffix#word** combination: store keys like `suffix + '#' + word` so a query `suffix + '#' + prefix` becomes a single prefix lookup. Insert in index order so the latest index naturally wins.",
    figureItOut: [
      "A trie answers prefix queries beautifully, but here you have BOTH a prefix and a suffix to satisfy at once. The trick is to fold the suffix condition into a prefix condition so one trie handles both.",
      "Build a combined key for each word: for every suffix of the word, store the string suffix + '#' + word. For example 'apple' yields 'e#apple', 'le#apple', ..., 'apple#apple', and '#apple'. Each such key begins with one of the word's suffixes, then a separator, then the full word.",
      "Now a query f(prefix, suffix) becomes the single search key suffix + '#' + prefix. Any stored key beginning with that combined prefix corresponds to a word that both ends with `suffix` (the part before #) and starts with `prefix` (the part after #). So it collapses two constraints into one trie prefix lookup.",
      "Store at each trie node the largest word index that passes through it, inserting words in increasing index order so later indices overwrite earlier ones. f walks the combined key down the trie and returns the stored index at the end node, or −1 if the path breaks. The 7-char cap keeps the suffix-expansion (≤ 8 suffixes per word) cheap.",
    ],
    approaches: [
      {
        name: "Trie of suffix#word keys, store max index (optimal)",
        intuition: "Index every suffix+'#'+word; query with suffix+'#'+prefix as a single prefix search; nodes remember the largest index.",
        time: "O(Σ L²) build, O(L) per query",
        timeWhy: "Each word of length L spawns L+1 keys of length ~2L to insert; each query walks one combined key.",
        space: "O(Σ L²)",
        spaceWhy: "The trie stores all suffix#word keys, quadratic in word length but bounded by the 7-char cap.",
        code: `class WordFilter {
    static class Node {
        Node[] next = new Node[27];   // 26 letters + '#'
        int index = -1;               // largest word index passing through here
    }

    private final Node root = new Node();

    public WordFilter(String[] words) {
        for (int w = 0; w < words.length; w++) {
            String word = words[w];
            int len = word.length();
            // insert suffix + '#' + word for every suffix
            for (int s = 0; s <= len; s++) {
                String key = word.substring(s) + "#" + word;
                insert(key, w);
            }
        }
    }

    private void insert(String key, int idx) {
        Node cur = root;
        for (char ch : key.toCharArray()) {
            int c = (ch == '#') ? 26 : ch - 'a';
            if (cur.next[c] == null) cur.next[c] = new Node();
            cur = cur.next[c];
            cur.index = idx;          // later words overwrite -> largest index wins
        }
    }

    public int f(String prefix, String suffix) {
        String key = suffix + "#" + prefix;
        Node cur = root;
        for (char ch : key.toCharArray()) {
            int c = (ch == '#') ? 26 : ch - 'a';
            if (cur.next[c] == null) return -1;
            cur = cur.next[c];
        }
        return cur.index;
    }
}`,
        walkthrough: [
          'words=["cat","car","card"]. "car" (idx1) stores keys like "r#car","ar#car","car#car","#car"; "card" (idx2) stores "d#card", etc.',
          'f("c","r") → key "r#c". Walk: r then # then c exists only along "r#car..." (and any other word ending r, starting c).',
          'The node after "r#c" carries index 1 ("car"); "card" ends in d so it never created an "r#..." key. Return 1.',
        ],
      },
    ],
    edgeCases: [
      "No word matches both constraints → the walk hits a missing child and returns −1.",
      "Duplicate words at different indices → inserting in order makes the later (larger) index overwrite, satisfying the tie rule.",
      "Empty-string prefix or suffix is not in the constraints here, but the '#' separator still disambiguates where suffix ends and prefix begins.",
    ],
    twists: [
      "**Search Suggestions System** (LeetCode 1268) → prefix-only queries returning the smallest matches.",
      "**Implement Trie** (LeetCode 208) → the base prefix tree this builds on.",
      "**Two tries (prefix trie + reversed suffix trie)** → an alternative that intersects index sets instead of merging keys.",
    ],
    related: ["implement-trie-prefix-tree", "search-suggestions-system", "design-add-and-search-words-data-structure"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "summary-ranges",
    title: "Summary Ranges",
    difficulty: "Easy",
    pattern: "intervals",
    leetcode: 228,
    statement:
      "Given a **sorted** array `nums` of unique integers, return the smallest sorted list of ranges that **exactly covers all the numbers**. Each consecutive run of integers a, a+1, ..., b becomes the string `\"a->b\"`, or just `\"a\"` if the run is a single number.",
    examples: [
      { in: "nums = [0,1,2,4,5,7]", out: '["0->2","4->5","7"]' },
      { in: "nums = [0,2,3,4,6,8,9]", out: '["0","2->4","6","8->9"]' },
      { in: "nums = []", out: "[]" },
    ],
    constraints: ["0 ≤ nums.length ≤ 20", "−2³¹ ≤ nums[i] ≤ 2³¹ − 1", "all values are unique and sorted ascending"],
    recognize:
      "A single linear **sweep** that groups consecutive integers. Because the array is sorted with unique values, a run breaks exactly where the next number is not previous + 1 — track each run's start and close it off when the gap appears.",
    figureItOut: [
      "The array is already sorted with no duplicates, so consecutive integers (differing by exactly 1) sit next to each other. A 'range' is just such a maximal run, and runs end precisely where the step from one element to the next is bigger than 1.",
      "Sweep once with a remembered `start` = the first number of the current run. Walk forward; as long as nums[i+1] == nums[i] + 1 the run continues. The moment that fails (or you reach the end), the current run is [start, nums[i]] and you emit it.",
      "Format each finished run: if start == end it is a single number, output \"start\"; otherwise output \"start->end\". Then begin a new run with the next number as the new start.",
      "Edge handling: an empty array yields an empty list. Use long or compare carefully because values can be at the int limits — but since you only check nums[i+1] - nums[i] == 1 by comparing nums[i] + 1, guard against overflow by comparing nums[i+1] == nums[i] + 1 with the addition done as needed, or simply check (long) nums[i] + 1.",
    ],
    approaches: [
      {
        name: "Single linear sweep tracking run starts (optimal)",
        intuition: "Remember each run's start; close and emit the run when the next value is not previous + 1.",
        time: "O(n)",
        timeWhy: "One pass over the sorted array.",
        space: "O(1)",
        spaceWhy: "Only a start pointer beyond the output list.",
        code: `List<String> summaryRanges(int[] nums) {
    List<String> res = new ArrayList<>();
    int n = nums.length, i = 0;
    while (i < n) {
        int start = nums[i];
        // extend the run while the next value is exactly one larger
        while (i + 1 < n && (long) nums[i] + 1 == nums[i + 1]) i++;
        int end = nums[i];
        if (start == end) res.add(Integer.toString(start));
        else              res.add(start + "->" + end);
        i++;                       // move to the next run
    }
    return res;
}`,
        walkthrough: [
          "nums=[0,1,2,4,5,7]. start=0, extend through 1,2 (consecutive) → end=2 → \"0->2\". i jumps to 4.",
          "start=4, extend through 5 → end=5 → \"4->5\". i jumps to 7.",
          "start=7, no next → end=7 → \"7\". Result [\"0->2\",\"4->5\",\"7\"].",
        ],
      },
    ],
    edgeCases: [
      "Empty array → return an empty list.",
      "Single element → one range that is just that number with no arrow.",
      "Values at INT_MIN/INT_MAX → use (long) when checking consecutiveness to avoid overflow in nums[i] + 1.",
    ],
    twists: [
      "**Data Stream as Disjoint Intervals** (LeetCode 352) → the streaming version where numbers arrive over time and runs merge dynamically.",
      "**Missing Ranges** (LeetCode 163) → emit the GAPS between numbers within a given lower/upper bound instead of the runs.",
      "**Merge Intervals** (LeetCode 56) → general intervals (not unit integers) that may overlap and need merging.",
    ],
    related: ["data-stream-as-disjoint-intervals", "merge-intervals", "insert-interval"],
  },

  {
    slug: "my-calendar-ii",
    title: "My Calendar II",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 731,
    statement:
      "Implement `MyCalendarTwo` supporting `book(start, end)` for half-open events `[start, end)`. A booking succeeds (returns true) unless it would cause a **triple booking** — three events all overlapping at some moment. Reject (return false) and do not add the event if it would create a triple overlap; otherwise add it and return true. Double bookings are allowed.",
    examples: [
      {
        in: "book(10,20)→true; book(50,60)→true; book(10,40)→true; book(5,15)→false; book(5,10)→true; book(25,55)→true",
        out: "[true,true,true,false,true,true]",
        note: "book(5,15) would triple-book [10,15) (overlaps 10-20 and 10-40), so it is rejected",
      },
    ],
    constraints: ["0 ≤ start < end ≤ 10⁹", "at most 1000 calls to book"],
    recognize:
      "Allow double but forbid triple overlap → maintain **two interval lists**: all booked events, and the regions already double-booked. A new event is rejected if it intersects any double-booked region; otherwise its overlaps with existing events become new double-booked regions.",
    figureItOut: [
      "A triple booking happens when a new event overlaps a region that is ALREADY covered by two events. So if you keep track of the regions currently covered twice (the double-booked overlaps), a new event is illegal exactly when it intersects one of those regions.",
      "Maintain two lists. `bookings` holds every accepted event. `overlaps` holds the intervals where two events already coincide. When a new event [s,e) arrives, first check it against `overlaps`: if it intersects any double-booked interval, accepting it would make that spot triple-booked, so return false.",
      "If it passes that check, accept it — but first compute its overlaps with each existing booking and add those intersection intervals to `overlaps`. The intersection of [s,e) and a booking [bs,be) is [max(s,bs), min(e,be)); it is real only when max(s,bs) < min(e,be).",
      "Then append [s,e) to `bookings` and return true. Order matters: compute the new double-booked regions from the OLD bookings before adding the new event, and only after confirming no triple. With ≤ 1000 calls, the O(n) scan per booking (n events so far) is fine.",
    ],
    approaches: [
      {
        name: "Two lists: bookings + double-booked overlaps (optimal for the bounds)",
        intuition: "Reject if the new event hits a double-booked region; else record its overlaps with existing events and add it.",
        time: "O(n) per book, O(n²) total",
        timeWhy: "Each booking scans the current overlaps and bookings lists, each up to n long.",
        space: "O(n)",
        spaceWhy: "Both lists grow with the number of bookings and their pairwise overlaps.",
        code: `class MyCalendarTwo {
    private final List<int[]> bookings = new ArrayList<>();
    private final List<int[]> overlaps = new ArrayList<>();

    public boolean book(int start, int end) {
        // would this create a triple booking?
        for (int[] o : overlaps) {
            if (start < o[1] && o[0] < end) return false;   // intersects a double-booked region
        }
        // record new double-booked regions from existing bookings
        for (int[] b : bookings) {
            int s = Math.max(start, b[0]);
            int e = Math.min(end, b[1]);
            if (s < e) overlaps.add(new int[]{ s, e });      // real overlap
        }
        bookings.add(new int[]{ start, end });
        return true;
    }
}`,
        walkthrough: [
          "book(10,20)→true. book(50,60)→true. book(10,40): overlaps with [10,20) → add [10,20) to overlaps; accept.",
          "book(5,15): checks overlaps, [5,15) intersects double-booked [10,20) → return false (would triple-book).",
          "book(5,10): no overlap with [10,20)/[10,40) at a doubled spot → accept; book(25,55): overlaps [10,40) at [25,40) → add; accept.",
        ],
      },
    ],
    edgeCases: [
      "Events touching at an endpoint like [10,20) and [20,30) → half-open, so they do NOT overlap (20 is excluded).",
      "Two events allowed to overlap (double booking) → only a third overlapping event at the same instant is rejected.",
      "Rejected booking must not mutate state → return false before appending to bookings or overlaps.",
    ],
    twists: [
      "**My Calendar I** (LeetCode 729) → forbid any double booking; a single TreeMap of intervals suffices.",
      "**My Calendar III** (LeetCode 732) → report the maximum overlap (k-booking) count; use a sweep-line / difference map.",
      "**Difference array / TreeMap of deltas** → +1 at start, −1 at end, and reject when any running prefix would reach 3.",
    ],
    related: ["my-calendar-i", "merge-intervals", "car-pooling"],
  },

  {
    slug: "the-skyline-problem",
    title: "The Skyline Problem",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 218,
    statement:
      "Given `buildings` where `buildings[i] = [left_i, right_i, height_i]` (each a rectangle on the ground from x=left to x=right of the given height), return the **skyline** as a list of **key points** `[x, height]` sorted by x. A key point is the left endpoint of a horizontal segment of the outline; the last point has height 0. Merge adjacent segments of equal height so no two consecutive points share a height.",
    examples: [
      {
        in: "buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]",
        out: "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]",
      },
      { in: "buildings = [[0,2,3],[2,5,3]]", out: "[[0,3],[5,0]]", note: "equal-height adjacent buildings merge into one segment" },
    ],
    constraints: ["1 ≤ buildings.length ≤ 10⁴", "0 ≤ left < right ≤ 2³¹ − 1", "1 ≤ height ≤ 2³¹ − 1", "buildings are sorted by left ascending"],
    recognize:
      "A **sweep line** over x where the outline is governed by the **tallest building currently active**. 'Maximum height among the buildings open at this x' calls for a **max-heap** (or a multiset) of active heights; emit a key point whenever that running maximum changes.",
    figureItOut: [
      "The skyline height at any x is simply the tallest building covering that x. So imagine sweeping a vertical line left to right: at each x the visible top is the maximum height among all buildings whose interval contains x. The outline only changes when this running maximum changes.",
      "The maximum can only change at building edges — when a building starts (a new height becomes active) or ends (a height stops being active). So create events: at left_i a 'start' of height h, at right_i an 'end' of height h. Process events in x order.",
      "You need 'the max of the currently-active heights' to update as buildings start and end — that is a **max-heap** of active heights (with lazy removal of ended ones, or a TreeMap multiset). After processing all events at a given x, compare the new current max to the previous max; if it changed, that x with the new max is a key point.",
      "Ordering subtleties at equal x: process start events before end events, and among starts process taller first, among ends shorter first — so simultaneous edges resolve to the correct single outline height. Lazy deletion (mark ended heights and pop them off the heap only when they reach the top) keeps each event O(log n). Emit [x, newMax] whenever newMax differs from the previous emitted height; the final end drops the height to 0.",
    ],
    approaches: [
      {
        name: "Sweep line with a max-heap of active heights (optimal)",
        intuition: "Turn each building into start/end events sorted by x; keep a max-heap of active heights; emit a point when the top changes.",
        time: "O(n log n)",
        timeWhy: "Sorting 2n events is O(n log n); each event does O(log n) heap work with lazy removal.",
        space: "O(n)",
        spaceWhy: "The event list and the heap each hold O(n) entries.",
        code: `List<List<Integer>> getSkyline(int[][] buildings) {
    // events: [x, height]; start uses negative height to sort tall-first, end uses positive
    List<int[]> events = new ArrayList<>();
    for (int[] b : buildings) {
        events.add(new int[]{ b[0], -b[2] });   // start
        events.add(new int[]{ b[1],  b[2] });   // end
    }
    events.sort((a, c) -> a[0] != c[0] ? Integer.compare(a[0], c[0])
                                       : Integer.compare(a[1], c[1]));

    List<List<Integer>> res = new ArrayList<>();
    // max-heap of active heights with lazy removal
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    Map<Integer, Integer> toRemove = new HashMap<>();
    heap.offer(0);                 // ground level
    int prevMax = 0;

    for (int[] e : events) {
        int x = e[0], h = e[1];
        if (h < 0) {
            heap.offer(-h);        // building starts: add its height
        } else {
            toRemove.merge(h, 1, Integer::sum);  // building ends: mark for removal
        }
        // lazily drop ended heights from the top
        while (!heap.isEmpty() && toRemove.getOrDefault(heap.peek(), 0) > 0) {
            int top = heap.poll();
            toRemove.merge(top, -1, Integer::sum);
        }
        int curMax = heap.peek();
        if (curMax != prevMax) {
            res.add(Arrays.asList(x, curMax));   // outline height changed here
            prevMax = curMax;
        }
    }
    return res;
}`,
        walkthrough: [
          "buildings include [2,9,10] and [3,7,15]. Events sorted by x. At x=2 start h=10 → heap max 10 ≠ 0 → emit [2,10].",
          "At x=3 start h=15 → max 15 → emit [3,15]. At x=7 end h=15 → remove 15, max drops to 12 (from [5,12,12]) → emit [7,12].",
          "Continuing yields [12,0],[15,10],[20,8],[24,0], matching the expected skyline.",
        ],
      },
    ],
    edgeCases: [
      "Adjacent equal-height buildings → the running max never changes across the boundary, so no spurious key point is emitted (segments merge).",
      "Building ending exactly where another starts at the same height → ordering rules prevent a redundant point; the height stays constant.",
      "The heap always retains a ground level of 0 so the final end event drops the outline to height 0.",
    ],
    twists: [
      "**Falling Squares** (LeetCode 699) → squares stack on top of each other; track max height over ranges with a segment tree.",
      "**My Calendar III** (LeetCode 732) → maximum overlap count via a sweep line, the count analogue of this height sweep.",
      "**Divide and conquer** → an alternative O(n log n) that merges two half-skylines like merge sort, no heap needed.",
    ],
    related: ["merge-intervals", "my-calendar-i", "car-pooling"],
  },
];
