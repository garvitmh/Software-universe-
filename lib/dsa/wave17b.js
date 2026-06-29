// NeetCode All + Top Interview 150 / LeetCode 75 / Grind 75 — wave 17b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave16b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE17B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "sum-of-left-leaves",
    title: "Sum of Left Leaves",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 404,
    statement:
      "Given the `root` of a binary tree, return the sum of all **left leaves**. A left leaf is a node that is the LEFT child of its parent AND is itself a leaf (it has no children).",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "24", note: "the left leaves are 9 and 15; 9 + 15 = 24" },
      { in: "root = [1]", out: "0", note: "the root is not anyone's left child, so there are no left leaves" },
    ],
    constraints: ["the number of nodes is in [1, 1000]", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "Sum only the leaves that happen to be a LEFT child → DFS where the parent tells each child whether it arrived via the left pointer, and add the value only when a node is both a leaf AND was reached as a left child. Passing an is-left-child flag down the recursion is the whole trick.",
    figureItOut: [
      "A leaf is easy to detect locally: a node with no left and no right child. But being a LEFT leaf depends on the parent — a leaf does not know on its own whether it was reached via its parent left pointer or right pointer. So the qualifying condition lives one level up.",
      "The clean fix is to push that knowledge down: when I recurse, I tell each child HOW it was reached. I carry a boolean isLeft that is true when I descended into a node via its parent left pointer and false via the right pointer. The root itself is reached via neither, so I start it as not-left.",
      "At each node I check: is this node a leaf (no children) AND did I arrive here as a left child? If both, this is a left leaf and I add its value. Otherwise I keep recursing, passing isLeft = true into the left child call and isLeft = false into the right child call.",
      "This visits every node once, doing O(1) work each, so it is O(n) time and O(h) recursion stack. The alternative — checking node.left and asking whether node.left is a leaf from the PARENT — also works, but threading the isLeft flag keeps every node handled by one uniform rule and avoids reaching across pointers.",
    ],
    approaches: [
      {
        name: "DFS passing an is-left-child flag, add leaf values reached as a left child (optimal)",
        intuition: "Tell each child whether it was reached via the left pointer; add a node value only when it is a leaf AND arrived as a left child.",
        time: "O(n)",
        timeWhy: "Each node is visited once with constant work.",
        space: "O(h)",
        spaceWhy: "The recursion stack is proportional to the tree height h.",
        code: `class Solution {
    public int sumOfLeftLeaves(TreeNode root) {
        return dfs(root, false);
    }

    private int dfs(TreeNode node, boolean isLeft) {
        if (node == null) return 0;
        if (node.left == null && node.right == null) {
            return isLeft ? node.val : 0;       // a leaf counts only if reached as a left child
        }
        return dfs(node.left, true) + dfs(node.right, false);
    }
}`,
        walkthrough: [
          "root=[3,9,20,null,null,15,7]. From 3, recurse left into 9 with isLeft=true; 9 is a leaf reached as left -> add 9.",
          "Recurse right into 20 with isLeft=false. From 20, left child 15 (isLeft=true) is a leaf -> add 15; right child 7 (isLeft=false) is a leaf but not left -> 0.",
          "Total 9 + 15 = 24.",
        ],
      },
    ],
    edgeCases: [
      "A single node → it is the root, reached as neither child, so it never counts (answer 0).",
      "A right-only chain → no node is ever a left child, so the sum is 0.",
      "A node that is a left child but has children → it is not a leaf, so it is not counted.",
    ],
    twists: [
      "**Binary Tree Paths** (LeetCode 257) → the same root-to-leaf DFS but recording each full path instead of a left-leaf sum.",
      "**Sum Root to Leaf Numbers** (LeetCode 129) → accumulate a running number down each path and sum at the leaves.",
      "**Iterative stack** → carry the is-left flag alongside each node on an explicit stack to avoid recursion.",
    ],
    related: ["binary-tree-paths", "sum-root-to-leaf-numbers", "path-sum"],
  },

  {
    slug: "even-odd-tree",
    title: "Even Odd Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1609,
    statement:
      "A binary tree is **Even-Odd** if: nodes on EVEN-indexed levels (the root is level 0) hold ODD values that are strictly INCREASING from left to right; nodes on ODD-indexed levels hold EVEN values that are strictly DECREASING from left to right. Given the `root`, return true if the tree is Even-Odd, otherwise false.",
    examples: [
      { in: "root = [1,10,4,3,null,7,9,12,8,6,null,null,2]", out: "true", note: "every level satisfies its parity-and-monotonicity rule" },
      { in: "root = [5,4,2,3,3,7]", out: "false", note: "level 2 has values 3,3,7 which is not strictly increasing" },
      { in: "root = [5,9,1,3,5,7]", out: "false", note: "level 1 values 9 and 1 are odd, but odd levels must hold even values" },
    ],
    constraints: ["the number of nodes is in [1, 10⁵]", "1 ≤ Node.val ≤ 10⁶"],
    recognize:
      "Validate a parity-and-monotonicity rule that depends on the LEVEL → BFS level by level, tracking the level index parity and the previous value on the level, rejecting as soon as a value breaks parity or breaks the required strictly-increasing/decreasing order. Level-order BFS with a per-level previous-value check is the pattern.",
    figureItOut: [
      "The rules are entirely about LEVELS, so I should process the tree one full level at a time. Level-order BFS does exactly that: dequeue all nodes currently on a level before touching the next level, so I always know which level index I am on.",
      "Within a level I must check two things in left-to-right order: the PARITY of each value, and the MONOTONICITY between consecutive values. The parity rule is simple — on even levels every value must be odd, on odd levels every value must be even. I can test value % 2.",
      "For monotonicity I keep the PREVIOUS value seen on the current level, initialised to a sentinel before the level starts. On even levels each new value must be strictly greater than the previous (increasing); on odd levels strictly less (decreasing). The sentinel is the smallest possible value (or Integer.MIN_VALUE) for even levels and the largest (Integer.MAX_VALUE) for odd levels so the first node always passes.",
      "I walk the level left to right; if any value fails its parity check, or fails the strict comparison against the previous value, I return false immediately. If a whole level passes, I flip the level parity and continue. If BFS finishes without a violation, the tree is Even-Odd. Each node is processed once: O(n) time, O(width) queue space. BFS is natural here precisely because the rule compares siblings in the same level in order, which BFS hands me directly.",
    ],
    approaches: [
      {
        name: "Level-order BFS checking parity and strict monotonicity per level (optimal)",
        intuition: "Process each level left to right, enforcing odd-increasing on even levels and even-decreasing on odd levels against the previous value seen.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued once with O(1) checks.",
        space: "O(w)",
        spaceWhy: "The BFS queue holds at most one full level of width w (up to O(n)).",
        code: `class Solution {
    public boolean isEvenOddTree(TreeNode root) {
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean evenLevel = true;                       // root is level 0 (even)

        while (!queue.isEmpty()) {
            int size = queue.size();
            int prev = evenLevel ? Integer.MIN_VALUE : Integer.MAX_VALUE;
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                int v = node.val;
                if (evenLevel) {
                    if (v % 2 == 0 || v <= prev) return false;   // must be odd and increasing
                } else {
                    if (v % 2 != 0 || v >= prev) return false;   // must be even and decreasing
                }
                prev = v;
                if (node.left != null)  queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            evenLevel = !evenLevel;
        }
        return true;
    }
}`,
        walkthrough: [
          "root=[1,10,4,...]. Level0 (even): value 1 is odd and > MIN -> ok.",
          "Level1 (odd): values 10 then 4; both even, 10 > MIN(MAX sentinel) start, 4 < 10 strictly decreasing -> ok.",
          "Continue level by level; if every level satisfies parity and monotonicity, return true.",
        ],
      },
    ],
    edgeCases: [
      "A single node → level 0 needs one odd value; passes if the root is odd.",
      "Equal consecutive values on a level → fails because the order must be STRICTLY monotonic.",
      "A correct parity but wrong direction (e.g. decreasing on an even level) → rejected by the comparison.",
    ],
    twists: [
      "**Binary Tree Level Order Traversal** (LeetCode 102) → the same level BFS but emitting the values instead of validating them.",
      "**Binary Tree Zigzag Level Order Traversal** (LeetCode 103) → alternate left-to-right and right-to-left per level.",
      "**Average of Levels in Binary Tree** (LeetCode 637) → aggregate each level instead of checking a rule.",
    ],
    related: ["binary-tree-level-order-traversal", "binary-tree-zigzag-level-order-traversal", "average-of-levels-in-binary-tree"],
  },

  {
    slug: "cousins-in-binary-tree",
    title: "Cousins in Binary Tree",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 993,
    statement:
      "Given the `root` of a binary tree and two distinct values `x` and `y` (guaranteed to be present), return true if the nodes holding `x` and `y` are **cousins**. Two nodes are cousins if they are on the SAME depth but have DIFFERENT parents.",
    examples: [
      { in: "root = [1,2,3,4], x = 4, y = 3", out: "false", note: "4 is at depth 2 and 3 is at depth 1; different depths, so not cousins" },
      { in: "root = [1,2,3,null,4,null,5], x = 5, y = 4", out: "true", note: "both at depth 2 with different parents (3 and 2)" },
      { in: "root = [1,2,3,null,4], x = 2, y = 3", out: "false", note: "same depth but siblings share parent 1, so not cousins" },
    ],
    constraints: ["the number of nodes is in [2, 100]", "1 ≤ Node.val ≤ 100", "each node has a unique value", "x ≠ y and both exist in the tree"],
    recognize:
      "Decide cousinship from two facts: SAME depth and DIFFERENT parent → one DFS (or BFS) recording each target value's depth and parent, then compare: cousins iff depths are equal AND parents differ. Capturing (depth, parent) for both targets is the entire move.",
    figureItOut: [
      "Cousins means two conditions hold together: the two nodes sit at the same DEPTH, and they do NOT share the same PARENT. So for each of x and y I just need two numbers: its depth, and a way to identify its parent.",
      "A single DFS can capture both. I recurse carrying the current node, its depth, and its parent reference. When I find a node whose value equals x, I record depthX and parentX; likewise for y. Because values are unique, each target is found exactly once.",
      "After the traversal I have (depthX, parentX) and (depthY, parentY). They are cousins precisely when depthX == depthY (same level) and parentX != parentY (different parents). If they shared a parent they would be siblings, not cousins; if depths differ they are not even on the same level.",
      "I pass the parent down as I recurse (the parent of a child is the current node), and depth + 1 for children. The root has a null parent and depth 0, which is fine because the root is never a target alongside another at the same depth with a different parent. The traversal touches each node once: O(n) time, O(h) stack. BFS works identically — find both targets within a level and check they came from different parents.",
    ],
    approaches: [
      {
        name: "One DFS recording each target's depth and parent, then compare (optimal)",
        intuition: "Traverse once capturing depth and parent for x and y; they are cousins when depths match and parents differ.",
        time: "O(n)",
        timeWhy: "A single traversal visits each node once.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to height h; a few scalars hold the captured depth and parent.",
        code: `class Solution {
    private int depthX = -1, depthY = -1;
    private TreeNode parentX = null, parentY = null;

    public boolean isCousins(TreeNode root, int x, int y) {
        dfs(root, null, 0, x, y);
        return depthX == depthY && parentX != parentY;
    }

    private void dfs(TreeNode node, TreeNode parent, int depth, int x, int y) {
        if (node == null) return;
        if (node.val == x) { depthX = depth; parentX = parent; }
        if (node.val == y) { depthY = depth; parentY = parent; }
        dfs(node.left, node, depth + 1, x, y);
        dfs(node.right, node, depth + 1, x, y);
    }
}`,
        walkthrough: [
          "root=[1,2,3,null,4,null,5], x=5, y=4. DFS reaches 4 as right child of 2 at depth 2 -> depthY=2, parentY=node2.",
          "DFS reaches 5 as right child of 3 at depth 2 -> depthX=2, parentX=node3.",
          "Depths equal (2==2) and parents differ (node2 != node3) -> cousins -> true.",
        ],
      },
    ],
    edgeCases: [
      "x and y are siblings (same parent) → depths match but parents are equal, so not cousins.",
      "x and y at different depths → immediately not cousins.",
      "One target is the root → its parent is null and depth 0, which cannot match another node at depth 0.",
    ],
    twists: [
      "**Cousins in Binary Tree II** (LeetCode 2641) → replace each node value with the sum of all its cousins, a heavier level pass.",
      "**Maximum Width of Binary Tree** (LeetCode 662) → another level-aware traversal measuring spans.",
      "**BFS variant** → detect both targets within a level and verify they descend from different parents.",
    ],
    related: ["maximum-width-of-binary-tree", "binary-tree-level-order-traversal", "find-bottom-left-tree-value"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "remove-nodes-from-linked-list",
    title: "Remove Nodes From Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 2487,
    statement:
      "Given the `head` of a singly linked list, remove every node that has a node with a STRICTLY GREATER value somewhere to its RIGHT. Return the head of the modified list. (Equivalently, keep a node only if all values after it are less than or equal to it.)",
    examples: [
      { in: "head = [5,2,13,3,8]", out: "[13,8]", note: "5,2,3 each have a larger value to their right (13 or 8); 13 and 8 survive" },
      { in: "head = [1,1,1,1]", out: "[1,1,1,1]", note: "no node has a strictly greater value to its right, so nothing is removed" },
    ],
    constraints: ["the number of nodes is in [1, 10⁵]", "1 ≤ Node.val ≤ 10⁵"],
    recognize:
      "Keep a node only if nothing larger lies to its right → this is the **non-increasing suffix maximum**: process from the RIGHT keeping only nodes that are >= everything already kept. Reverse the list (or recurse to the tail first), then sweep keeping a running max and dropping smaller nodes. A monotonic non-increasing chain built from the right is the signature.",
    figureItOut: [
      "A node survives iff no node to its right is strictly greater. Said differently, a node survives iff it is greater than or equal to the MAXIMUM of everything to its right. That maximum is easiest to know if I process the list from the RIGHT end toward the head.",
      "So I want to walk right to left, tracking the largest value seen so far on the right. If the current node value is less than that running maximum, some node to its right is bigger, so I DROP it. Otherwise it is at least as large as everything to its right, so I KEEP it and update the running maximum.",
      "A singly linked list only goes forward, so to process right to left I either reverse the list first, sweep keeping the non-increasing chain, and reverse back; or I recurse to the tail and make decisions as the recursion UNWINDS (which visits nodes back to front). Recursion is elegant: recurse on node.next first; when it returns, node.next now points at the head of the already-cleaned suffix. If node.val < node.next.val, this node must be removed, so I return node.next (skipping this node); otherwise I keep this node pointing at the cleaned suffix and return it.",
      "Why does this build the right answer? The cleaned suffix is exactly the surviving nodes to the right in their non-increasing order, so node.next.val is the maximum survivor to the right. Comparing against it decides this node. The recursion is O(n) time and O(n) stack; the iterative reverse-sweep-reverse is O(n) time and O(1) extra space. Both produce a final list whose values are non-increasing from head to tail — that monotonic shape is the giveaway.",
    ],
    approaches: [
      {
        name: "Reverse, sweep keeping a non-increasing chain, reverse back (optimal, O(1) space)",
        intuition: "After reversing, walk forward keeping only nodes at least as large as the running max; this drops any node that had something larger to its right. Reverse again to restore order.",
        time: "O(n)",
        timeWhy: "Two reversals and one linear sweep, each O(n).",
        space: "O(1)",
        spaceWhy: "Only pointers and a running maximum; nodes are relinked in place.",
        code: `class Solution {
    public ListNode removeNodes(ListNode head) {
        head = reverse(head);
        int max = 0;
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (ListNode node = head; node != null; node = node.next) {
            if (node.val >= max) {        // at least as large as everything to its right (already reversed)
                max = node.val;
                tail.next = node;
                tail = node;
            }
        }
        tail.next = null;
        return reverse(dummy.next);
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
}`,
        walkthrough: [
          "head=[5,2,13,3,8]. Reverse -> [8,3,13,2,5]. Sweep with max: keep 8 (max 8), drop 3, keep 13 (max 13), drop 2, drop 5.",
          "Kept chain reversed back -> [13,8].",
          "Final list values are non-increasing, confirming the rule.",
        ],
      },
      {
        name: "Recurse to the tail, drop a node smaller than the cleaned suffix head",
        intuition: "Clean the rest of the list first; if this node is smaller than the head of the cleaned suffix, skip it, otherwise keep it.",
        time: "O(n)",
        timeWhy: "Each node is visited once as the recursion unwinds.",
        space: "O(n)",
        spaceWhy: "Recursion stack depth equal to the list length.",
        code: `class Solution {
    public ListNode removeNodes(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode cleaned = removeNodes(head.next);    // head of the surviving suffix
        if (head.val < cleaned.val) return cleaned;   // something larger is to the right: drop head
        head.next = cleaned;
        return head;
    }
}`,
      },
    ],
    edgeCases: [
      "All equal values → nothing is strictly greater to the right, so all survive.",
      "Strictly increasing list → only the last (largest) node survives.",
      "Single node → returned unchanged.",
    ],
    twists: [
      "**Remove Linked List Elements** (LeetCode 203) → remove by a fixed target value instead of a right-larger rule.",
      "**Next Greater Element via a monotonic stack** → an alternative that pushes survivors and pops smaller ones.",
      "**Reverse Linked List** (LeetCode 206) → the reversal primitive this O(1)-space solution leans on.",
    ],
    related: ["remove-linked-list-elements", "reverse-linked-list", "merge-nodes-in-between-zeros"],
  },

  {
    slug: "double-a-number-represented-as-a-linked-list",
    title: "Double a Number Represented as a Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 2816,
    statement:
      "You are given the `head` of a non-empty singly linked list whose nodes hold the decimal DIGITS of a non-negative integer in BIG-ENDIAN order (the head is the most significant digit, no leading zeros except the number 0 itself). Return the head of a linked list representing DOUBLE that number.",
    examples: [
      { in: "head = [1,8,9]", out: "[3,7,8]", note: "189 doubled is 378" },
      { in: "head = [9,9,9]", out: "[1,9,9,8]", note: "999 doubled is 1998, which needs a new leading digit" },
    ],
    constraints: ["the number of nodes is in [1, 10⁴]", "0 ≤ Node.val ≤ 9", "the number has no leading zeros except when it is 0"],
    recognize:
      "Double a big-endian digit list where carries flow from a less significant digit to a MORE significant one (right to left, toward the head) → exploit that doubling a digit gives a carry of at most 1, and that carry depends only on whether the NEXT digit is >= 5. A single left-to-right pass works: each digit becomes (2*d) % 10 plus 1 if the next digit is >= 5. The look-at-next-digit carry is the trick.",
    figureItOut: [
      "Normally adding numbers carries from least significant to most, which for a big-endian list means right to left — awkward in a singly linked list that only walks forward. But here the operation is specifically DOUBLING, and that has special structure I can exploit.",
      "When I double a single digit d, I get 2*d, a value from 0 to 18. Its own units digit is (2*d) % 10, and it produces a carry of 0 or 1 into the digit to its LEFT (more significant). The carry is 1 exactly when 2*d >= 10, i.e. when d >= 5.",
      "Crucially, the carry INTO position p comes from doubling the digit at position p+1 (the next, less significant digit). So I do not need to process right to left at all: while standing at digit d with the next digit d_next, the final digit here is (2*d + carryFromNext) % 10, where carryFromNext is 1 if d_next >= 5 else 0. That is a single forward pass.",
      "One special case: the head. If the most significant digit is >= 5, doubling it carries OUT into a brand-new leading digit, which must be 1 (the max carry from doubling is 1). The order matters: I must NOT prepend the 1 before sweeping, or I would also double that new node. So I first REMEMBER whether head.val >= 5, then sweep every existing node setting node.val = (2*node.val) % 10 + (node.next != null && node.next.val >= 5 ? 1 : 0), and only AFTER the sweep prepend a 1 node if the top overflowed. That is O(n) time, O(1) extra space, no reversal needed. The whole insight is that doubling makes the carry a pure function of the single next digit.",
    ],
    approaches: [
      {
        name: "Forward pass: each digit becomes (2d)%10 plus carry from the next digit (optimal)",
        intuition: "Doubling carries at most 1, and the carry into a digit depends only on whether the next (less significant) digit is >= 5, so one forward sweep suffices after handling a possible new leading 1.",
        time: "O(n)",
        timeWhy: "A single forward pass over the digits, constant work each.",
        space: "O(1)",
        spaceWhy: "Digits are updated in place; at most one new leading node is allocated.",
        code: `class Solution {
    public ListNode doubleIt(ListNode head) {
        // First sweep the existing digits, then prepend a carry node if the top overflowed.
        boolean topOverflows = head.val >= 5;          // remember before mutating
        for (ListNode node = head; node != null; node = node.next) {
            int doubled = (node.val * 2) % 10;         // this digit's own units after doubling
            if (node.next != null && node.next.val >= 5) {
                doubled += 1;                          // carry in from doubling the next digit
            }
            node.val = doubled;
        }
        if (topOverflows) {                            // doubling the most significant digit carried out
            ListNode newHead = new ListNode(1);
            newHead.next = head;
            head = newHead;
        }
        return head;
    }
}`,
        walkthrough: [
          "head=[9,9,9]. Record topOverflows = (9 >= 5) = true. Sweep digits: last 9 -> (18)%10=8, no next -> 8; middle 9 -> 8 + carry(next 9>=5) -> 9; first 9 -> 8 + carry(next 9>=5) -> 9. List is now [9,9,8].",
          "topOverflows is true, so prepend a leading 1 -> [1,9,9,8].",
          "That is 999 * 2 = 1998.",
        ],
      },
    ],
    edgeCases: [
      "head value 0 (the number 0) → doubling gives 0, single node unchanged.",
      "Most significant digit >= 5 → a new leading 1 node is prepended before the sweep.",
      "All digits 9 → produces a carry chain ending in a new leading 1 (e.g. 999 -> 1998).",
    ],
    twists: [
      "**Add Two Numbers** (LeetCode 2) → general addition of two little-endian digit lists with full carry propagation.",
      "**Plus One** (LeetCode 66) → increment a big-endian digit array, a simpler carry from the right.",
      "**Multiply Strings** (LeetCode 43) → general big-number multiplication where carries are not bounded to 1.",
    ],
    related: ["add-two-numbers", "plus-one", "multiply-strings"],
  },

  {
    slug: "convert-binary-number-in-a-linked-list-to-integer",
    title: "Convert Binary Number in a Linked List to Integer",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 1290,
    statement:
      "Given the `head` of a singly linked list where each node holds a single binary digit (0 or 1), the digits form a binary number with the head as the MOST significant bit. Return the decimal value of that number.",
    examples: [
      { in: "head = [1,0,1]", out: "5", note: "binary 101 equals 5" },
      { in: "head = [0]", out: "0", note: "a single 0 bit is value 0" },
    ],
    constraints: ["the number of nodes is in [1, 30]", "each Node.val is 0 or 1", "the list is not empty"],
    recognize:
      "Read a big-endian bit stream from head to tail into an integer → use **Horner's method**: result = result * 2 + bit for each node, left to right. Because the head is the most significant bit, shifting the accumulator left by one (multiply by 2) and adding the new bit reconstructs the value in one forward pass. Horner shift-and-add is the signature.",
    figureItOut: [
      "The head is the most significant bit, so the value is bit0 * 2^(L-1) + bit1 * 2^(L-2) + ... + bit_{L-1} * 2^0. I do not know the length L until I reach the end, so computing powers directly is awkward in a single forward walk.",
      "Horner's method sidesteps the powers. Think of building the number digit by digit as you would read it aloud: when you append a new least-significant bit, every existing bit shifts up one place. In binary, shifting up one place is multiplying by 2. So the rule is: result = result * 2 + currentBit.",
      "Walking from the head (most significant) to the tail (least significant) and applying that rule reconstructs the value exactly. Start result at 0. For [1,0,1]: result = 0*2+1 = 1, then 1*2+0 = 2, then 2*2+1 = 5. That is the answer.",
      "It is a single forward pass, O(n) time and O(1) extra space, with only addition and a multiply-by-two (equivalently a left shift) per node. There is no need to know the length in advance or to reverse the list — Horner's method naturally accounts for each bit's place value as it goes.",
    ],
    approaches: [
      {
        name: "Horner's method: result = result*2 + bit per node (optimal)",
        intuition: "Each step shifts the accumulator left by one bit and adds the current bit, reconstructing the big-endian binary value in one forward pass.",
        time: "O(n)",
        timeWhy: "One pass over the at-most-30 bits with constant work each.",
        space: "O(1)",
        spaceWhy: "Only a single integer accumulator.",
        code: `class Solution {
    public int getDecimalValue(ListNode head) {
        int result = 0;
        for (ListNode node = head; node != null; node = node.next) {
            result = (result << 1) | node.val;     // shift left and append the next bit
        }
        return result;
    }
}`,
        walkthrough: [
          "head=[1,0,1]. Start result=0. Node 1: result = (0<<1)|1 = 1.",
          "Node 0: result = (1<<1)|0 = 2. Node 1: result = (2<<1)|1 = 5.",
          "Return 5.",
        ],
      },
    ],
    edgeCases: [
      "Single 0 → result stays 0.",
      "Leading 1s only (e.g. [1,1,1]) → 7.",
      "Maximum 30 bits → fits comfortably in a 32-bit int.",
    ],
    twists: [
      "**Add Two Numbers** (LeetCode 2) → arithmetic on digit lists rather than a single value read-off.",
      "**Reverse Linked List** (LeetCode 206) → needed if bits were given least-significant-first instead.",
      "**Plus One** (LeetCode 66) → big-endian increment, the same place-value reasoning on an array.",
    ],
    related: ["add-two-numbers", "reverse-linked-list", "plus-one"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "smallest-number-in-infinite-set",
    title: "Smallest Number in Infinite Set",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 2336,
    statement:
      "Design a `SmallestInfiniteSet` that initially contains all positive integers 1, 2, 3, .... Support: `popSmallest()` — remove and return the smallest integer currently in the set; `addBack(num)` — add `num` back into the set if it is not already present.",
    examples: [
      {
        in: "addBack(2); popSmallest(); popSmallest(); popSmallest(); addBack(1); popSmallest(); popSmallest(); popSmallest()",
        out: "1, 2, 3, 1, 2, 4, 5",
        note: "the set behaves like 1,2,3,... with explicit re-additions taking priority once popped",
      },
    ],
    constraints: ["1 ≤ num ≤ 1000", "at most 1000 calls total to popSmallest and addBack", "addBack only re-adds a number that was previously popped"],
    recognize:
      "An infinite ascending set with pop-smallest and add-back → track a single boundary integer for the untouched tail (everything >= it is still present) plus a **min-heap (and a presence set) for the numbers added back below the boundary**. Pop prefers the heap when it holds something smaller than the boundary. Boundary-plus-min-heap of re-added values is the pattern.",
    figureItOut: [
      "The set starts as all positive integers, which is infinite, so I cannot store them. But notice the structure: everything from some threshold upward is still untouched. I can represent that infinite tail with ONE integer, call it next, meaning every integer >= next is still in the set and nothing below next is, EXCEPT ones explicitly added back.",
      "popSmallest must return the global minimum. The only candidates below next are numbers that were popped earlier and then added back. So I keep those re-added numbers in a MIN-HEAP. The smallest element overall is min(heap top, next).",
      "If the heap is non-empty, its top is smaller than next (because added-back numbers are always < next — you only add back something already popped, and popped numbers are < next), so I pop from the heap. Otherwise I return next and increment next by 1 (consuming the smallest of the untouched tail).",
      "addBack(num) should re-insert num only if it is currently absent. num is absent only if it was already popped, i.e. num < next, and it is not already sitting in the heap. So I keep a HashSet mirroring the heap to dedupe in O(1): if num < next and not in the set, push it to the heap and the set. When I pop from the heap I also remove it from the set. Each operation is O(log n) for the heap; the boundary handles the infinite part in O(1). The dual structure — one counter for the clean tail, a heap+set for the messy re-added low numbers — is what keeps it efficient.",
    ],
    approaches: [
      {
        name: "Boundary counter for the tail plus a min-heap and presence set for re-added numbers (optimal)",
        intuition: "Represent the infinite untouched tail with a single next counter; keep popped-then-re-added numbers in a min-heap with a set to dedupe, popping the heap whenever it holds something below the boundary.",
        time: "O(log n) per op",
        timeWhy: "Heap push and pop are logarithmic; the boundary operations are O(1).",
        space: "O(n)",
        spaceWhy: "The heap and set hold at most the numbers that have been popped and added back.",
        code: `class SmallestInfiniteSet {
    private int next = 1;                          // everything >= next is still present
    private PriorityQueue<Integer> heap = new PriorityQueue<>();
    private Set<Integer> inHeap = new HashSet<>();

    public SmallestInfiniteSet() {}

    public int popSmallest() {
        if (!heap.isEmpty()) {
            int smallest = heap.poll();
            inHeap.remove(smallest);
            return smallest;
        }
        return next++;                             // smallest of the untouched tail
    }

    public void addBack(int num) {
        if (num < next && !inHeap.contains(num)) { // only re-add a previously popped, absent number
            heap.offer(num);
            inHeap.add(num);
        }
    }
}`,
        walkthrough: [
          "Start next=1, empty heap. popSmallest -> heap empty -> return next 1, next=2. popSmallest -> 2, next=3. popSmallest -> 3, next=4.",
          "addBack(1): 1 < next(4) and not in heap -> push 1, heap={1}. addBack(3): 3 < 4 and absent -> push 3, heap={1,3}.",
          "popSmallest -> heap top 1, heap={3}. popSmallest -> heap top 3, heap empty. popSmallest -> heap empty -> return next 4, next=5. Outputs: 1,2,3,1,3,4.",
        ],
      },
    ],
    edgeCases: [
      "addBack a number that is still present (>= next) → ignored, no duplicate.",
      "addBack the same popped number twice → the presence set prevents a duplicate in the heap.",
      "Only popSmallest calls → behaves like a plain ascending counter 1,2,3,....",
    ],
    twists: [
      "**Kth Largest Element in an Array** (LeetCode 215) → the same min-heap selection idea on a static array.",
      "**Seat Reservation Manager** (LeetCode 1845) → reserve/unreserve seats with the identical boundary-plus-heap trick.",
      "**Find K Pairs with Smallest Sums** (LeetCode 373) → a min-heap producing smallest combinations in order.",
    ],
    related: ["kth-largest-element-in-an-array", "seat-reservation-manager", "find-k-pairs-with-smallest-sums"],
  },

  {
    slug: "maximum-average-pass-ratio",
    title: "Maximum Average Pass Ratio",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1792,
    statement:
      "There are `classes`, where `classes[i] = [pass_i, total_i]` means class i has `pass_i` students who will pass out of `total_i` total. You have `extraStudents` brilliant students who each definitely pass; assign every one of them to a class (multiple to the same class allowed) to MAXIMISE the average pass ratio across all classes. Return that maximum average accurate to 1e-5.",
    examples: [
      { in: "classes = [[1,2],[3,5],[2,2]], extraStudents = 2", out: "0.78333", note: "greedily place each extra student where it raises the average most" },
      { in: "classes = [[2,4],[3,9],[4,5],[2,10]], extraStudents = 4", out: "0.53485", note: "each placement is chosen by the largest marginal gain via a max-heap" },
    ],
    constraints: ["1 ≤ classes.length ≤ 10⁵", "classes[i].length == 2", "1 ≤ pass_i ≤ total_i ≤ 10⁵", "1 ≤ extraStudents ≤ 10⁵"],
    recognize:
      "Greedily assign each extra student to wherever it helps most, repeated extraStudents times → keep a **max-heap keyed by the MARGINAL GAIN** of adding one more student to each class, pop the best, apply it, recompute that class's new gain, and push it back. The gain (pass+1)/(total+1) − pass/total drives the heap. Marginal-gain max-heap with reinsertion is the signature.",
    figureItOut: [
      "Each extra student must go somewhere, and I want the maximum average. The average is the sum of per-class ratios divided by a fixed class count, so maximising the average means maximising the SUM of ratios. Adding a student to class i changes its ratio from pass/total to (pass+1)/(total+1); the increase is the MARGINAL GAIN of that placement.",
      "Greedy intuition: at each step, place the next student wherever it produces the largest marginal gain right now. Is greedy safe? Yes — the marginal gain of adding a student to a class is strictly DECREASING as that class gets more students (diminishing returns: each added pass-plus-total moves the ratio less). With diminishing returns, always taking the currently largest gain is optimal; nothing later beats grabbing the biggest available improvement now.",
      "To always grab the biggest gain quickly, I keep a MAX-HEAP keyed by each class's current marginal gain (pass+1)/(total+1) − pass/total. I pop the class with the largest gain, add a student to it (pass++ , total++), recompute its new — smaller — gain, and push it back. Repeat extraStudents times.",
      "After all students are placed, I sum each class's final pass/total and divide by the number of classes. Building the heap is O(c), each of the extraStudents placements is O(log c) for a pop and push, so total is O((c + extraStudents) log c). The key realisation is that the heap must store the marginal GAIN, not the ratio itself, because greedy should chase the biggest improvement, and that gain must be recomputed and reinserted after every placement because it shrinks.",
    ],
    approaches: [
      {
        name: "Max-heap of marginal gains, pop-apply-recompute-push extraStudents times (optimal)",
        intuition: "Always add the next student to the class whose ratio improves most; a max-heap keyed by marginal gain delivers that class, and the gain is recomputed and reinserted after each placement.",
        time: "O((c + e) log c)",
        timeWhy: "Heap build is O(c); each of the e extra students does an O(log c) pop and push.",
        space: "O(c)",
        spaceWhy: "The heap holds one entry per class.",
        code: `class Solution {
    public double maxAverageRatio(int[][] classes, int extraStudents) {
        // max-heap by marginal gain of adding one more student
        PriorityQueue<double[]> heap = new PriorityQueue<>((a, b) -> Double.compare(b[0], a[0]));
        for (int[] c : classes) {
            heap.offer(new double[]{ gain(c[0], c[1]), c[0], c[1] });
        }
        while (extraStudents-- > 0) {
            double[] top = heap.poll();
            double pass = top[1] + 1, total = top[2] + 1;     // place one student here
            heap.offer(new double[]{ gain((int) pass, (int) total), pass, total });
        }
        double sum = 0;
        while (!heap.isEmpty()) {
            double[] c = heap.poll();
            sum += c[1] / c[2];
        }
        return sum / classes.length;
    }

    private double gain(double pass, double total) {
        return (pass + 1) / (total + 1) - pass / total;       // marginal improvement of one more pass
    }
}`,
        walkthrough: [
          "classes=[[1,2],[3,5],[2,2]], e=2. Gains: [1,2]->(2/3-1/2)=0.1667; [3,5]->(4/6-3/5)=0.0667; [2,2]->(3/3-2/2)=0.",
          "Pop [1,2] (gain 0.1667) -> becomes [2,3]; new gain (3/4-2/3)=0.0833 pushed. Next biggest is now [2,3] at 0.0833.",
          "Pop and place second student -> [3,4]. Sum final ratios /3 -> 0.78333.",
        ],
      },
    ],
    edgeCases: [
      "A class already at ratio 1 (pass == total) → its marginal gain is 0, so the heap deprioritises it.",
      "All extra students into one class → handled by repeatedly popping and re-pushing that class as its gain stays largest.",
      "Large inputs → doubles keep enough precision for the 1e-5 tolerance.",
    ],
    twists: [
      "**Take Gifts From the Richest Pile** (LeetCode 2558) → a max-heap repeatedly modifying and reinserting the top element.",
      "**Last Stone Weight** (LeetCode 1046) → max-heap pop two, push the difference, a similar pop-modify-push loop.",
      "**Single greedy without recompute** → wrong here, because the gain shrinks after each placement and must be re-evaluated.",
    ],
    related: ["take-gifts-from-the-richest-pile", "last-stone-weight", "kth-largest-element-in-an-array"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "longest-word-with-all-prefixes",
    title: "Longest Word With All Prefixes",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 1858,
    statement:
      "Given an array of strings `words`, find the LONGEST string in `words` such that EVERY prefix of it (of length 1, 2, ..., up to its full length) is also present in `words`. If multiple such strings have the maximum length, return the lexicographically smallest one. If no such string exists, return the empty string.",
    examples: [
      {
        in: 'words = ["k","ki","kir","kira","kiran"]',
        out: '"kiran"',
        note: "every prefix k, ki, kir, kira, kiran is in the list",
      },
      {
        in: 'words = ["a","banana","app","appl","ap","apply","apple"]',
        out: '"apple"',
        note: '"apple" and "apply" both have all prefixes; "apple" is lexicographically smaller',
      },
    ],
    constraints: ["1 ≤ words.length ≤ 10⁵", "1 ≤ words[i].length ≤ 10⁵", "the total length of all words is ≤ 10⁵", "words[i] consists of lowercase English letters"],
    recognize:
      "Keep only words whose every prefix is also a word → insert all words into a **trie marking each word-end**, then for each word walk its characters and verify EVERY node along the path is a word-end. Pick the longest valid word, breaking ties lexicographically. Trie with a buildable-path (all-prefixes-present) check is the signature.",
    figureItOut: [
      "A word qualifies iff chopping it one character at a time from the end always lands on another word in the list: its length-1 prefix, its length-2 prefix, and so on must all appear. So I need fast membership tests for many prefixes — exactly what a trie gives, since a prefix is just a path from the root.",
      "I insert every word into a trie and mark each terminal node as isWord. Now, for a given candidate word, I walk its characters from the root. Every step lands on a trie node; the candidate is valid iff EVERY node on its path (after consuming each character) is marked isWord. If any intermediate node is not a word-end, some prefix is missing and the candidate fails.",
      "I check this for all words and keep the best valid one. 'Best' means longest; on a length tie, lexicographically smallest. I can compare a candidate against the current best with: longer wins, and on equal length the lexicographically smaller string wins.",
      "Inserting is O(total length). Validating each word walks its characters once, so all validations are O(total length) too. The whole thing is linear in the input size. A neat alternative is a trie DFS that only descends into children that are word-ends, naturally exploring exactly the buildable words; but the per-word path check is the most direct expression of the all-prefixes-present condition.",
    ],
    approaches: [
      {
        name: "Trie marking word-ends; a word is valid iff every node on its path is a word-end (optimal)",
        intuition: "Insert all words, then for each word verify that each character step lands on a word-terminal node; track the longest, lexicographically smallest valid word.",
        time: "O(L)",
        timeWhy: "L is the total length of all words; insertion and per-word validation are each linear in L.",
        space: "O(L)",
        spaceWhy: "The trie stores one node per distinct prefix, bounded by the total length.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[26];
        boolean isWord = false;
    }

    public String longestWord(String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {                       // build the trie
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                int idx = c - "a".charAt(0);
                if (cur.child[idx] == null) cur.child[idx] = new TrieNode();
                cur = cur.child[idx];
            }
            cur.isWord = true;
        }

        String best = "";
        for (String w : words) {
            if (!allPrefixesPresent(root, w)) continue;
            if (w.length() > best.length() ||
                (w.length() == best.length() && w.compareTo(best) < 0)) {
                best = w;                              // longer, or shorter-tie lexicographically smaller
            }
        }
        return best;
    }

    private boolean allPrefixesPresent(TrieNode root, String w) {
        TrieNode cur = root;
        for (char c : w.toCharArray()) {
            cur = cur.child[c - "a".charAt(0)];
            if (cur == null || !cur.isWord) return false;   // a prefix is missing
        }
        return true;
    }
}`,
        walkthrough: [
          'words=["a","banana","app","appl","ap","apply","apple"]. Validate "apple": path a(word),ap(word),app(word),appl(word),apple(word) -> valid, length 5.',
          'Validate "apply": all prefixes present too, length 5 -> tie. Compare lexicographically: "apple" < "apply" so keep "apple".',
          'Validate "banana": prefix "b" is not a word -> rejected. Best remains "apple".',
        ],
      },
    ],
    edgeCases: [
      "No word has all prefixes present → return the empty string.",
      "Two valid words of equal max length → return the lexicographically smaller.",
      "A single-character word that is in the list → trivially valid (its only prefix is itself).",
    ],
    twists: [
      "**Longest Word in Dictionary** (LeetCode 720) → the identical all-prefixes rule under a different problem number.",
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → the underlying insert/search/startsWith operations.",
      "**Replace Words** (LeetCode 648) → use a trie to swap each word for its shortest dictionary root.",
    ],
    related: ["longest-word-in-dictionary", "implement-trie-prefix-tree", "replace-words"],
  },

  {
    slug: "count-prefix-and-suffix-pairs-i",
    title: "Count Prefix and Suffix Pairs I",
    difficulty: "Easy",
    pattern: "tries",
    leetcode: 3042,
    statement:
      "You are given a 0-indexed array `words`. Define `isPrefixAndSuffix(a, b)` to be true when string `a` is BOTH a prefix AND a suffix of string `b`. Return the number of index pairs `(i, j)` with `i < j` such that `isPrefixAndSuffix(words[i], words[j])` is true.",
    examples: [
      {
        in: 'words = ["a","aba","ababa","aa"]',
        out: "4",
        note: '("a","aba"), ("a","ababa"), ("a","aa"), ("aba","ababa") all qualify',
      },
      {
        in: 'words = ["pa","papa","ma","mama"]',
        out: "2",
        note: '("pa","papa") and ("ma","mama")',
      },
    ],
    constraints: ["1 ≤ words.length ≤ 50 (for part I)", "1 ≤ words[i].length ≤ 10", "words[i] consists of lowercase English letters"],
    recognize:
      "Count pairs where the earlier word is simultaneously a prefix and a suffix of the later word → encode each word as a sequence of CHARACTER PAIRS (front char, back char) and insert into a **trie keyed by those pairs**; as you insert a longer word, the count of earlier shorter words that are a prefix-and-suffix is exactly the trie nodes already marked as word-ends along its pair-path. The paired-character trie is the elegant trick (a brute-force startsWith/endsWith check also works at these sizes).",
    figureItOut: [
      "a is a prefix-and-suffix of b means a equals b's first |a| characters AND b's last |a| characters. So for a candidate a of length k, I am simultaneously matching b's characters from the FRONT and from the BACK, position by position, for k positions.",
      "That symmetry suggests encoding each string as a sequence of PAIRS: position 0 pairs (b[0], b[last]), position 1 pairs (b[1], b[last-1]), and so on. A string a is a prefix-and-suffix of b exactly when a's pair sequence is a PREFIX of b's pair sequence — both ends of a line up with both ends of b for a's full length.",
      "Now it is a classic prefix-counting problem on these pair sequences, which a TRIE solves. I process words left to right (preserving i < j). Before inserting word j, I walk its pair sequence down the trie; every node along the way that is marked as a completed earlier word contributes one valid pair (that earlier word is a prefix-and-suffix of word j). I sum those, then mark word j's terminal node and continue.",
      "Building the pair key for a string of length m is O(m); walking/inserting is O(m) too. Across all words that is linear in total length. The paired-character trie captures 'both ends agree' in one structure. Given the tiny constraints of part I, a direct double loop checking b.startsWith(a) and b.endsWith(a) is also perfectly fine and is the simplest correct fallback; the trie is the scalable insight that part II rewards.",
    ],
    approaches: [
      {
        name: "Trie keyed by (front, back) character pairs, count word-ends along each insert path (optimal)",
        intuition: "Encode each word by pairing its i-th and (last-i)-th characters; a is a prefix-and-suffix of b iff a's pair sequence is a prefix of b's, so counting marked nodes along b's pair-path counts qualifying earlier words.",
        time: "O(n · m)",
        timeWhy: "Each of n words walks its O(m) pair sequence once.",
        space: "O(n · m)",
        spaceWhy: "The trie stores up to one node per pair across all words.",
        code: `class Solution {
    static class TrieNode {
        Map<Integer, TrieNode> child = new HashMap<>();
        int count = 0;                                 // how many words end exactly here
    }

    public int countPrefixSuffixPairs(String[] words) {
        TrieNode root = new TrieNode();
        int pairs = 0;
        for (String w : words) {
            TrieNode cur = root;
            int n = w.length();
            for (int i = 0; i < n; i++) {
                int front = w.charAt(i) - "a".charAt(0);
                int back = w.charAt(n - 1 - i) - "a".charAt(0);
                int key = front * 26 + back;            // encode the (front, back) pair
                cur = cur.child.computeIfAbsent(key, x -> new TrieNode());
                pairs += cur.count;                     // earlier words ending here are prefix-and-suffix of w
            }
            cur.count++;                                // register w itself
        }
        return pairs;
    }
}`,
        walkthrough: [
          'words=["a","aba","ababa","aa"]. Insert "a": path key(a,a); mark count 1. Insert "aba": walk key(a,a) -> +1 (matches "a"), then key(b,b); mark.',
          'Insert "ababa": walk key(a,a) -> +1 ("a"), key(b,b) -> +1 ("aba"), key(a,a), key(b,b), key(a,a); mark. Insert "aa": key(a,a) -> +1 ("a"), key(a,a); mark.',
          "Total +1 +1 +1 +1 = 4.",
        ],
      },
    ],
    edgeCases: [
      "A word equal to a strictly earlier identical word → the earlier one is a prefix-and-suffix of the later, counted once per earlier occurrence.",
      "Single-character words → a is a prefix-and-suffix of b iff a's char equals both ends of b (which for length 1 means equal chars).",
      "No qualifying pairs → returns 0.",
    ],
    twists: [
      "**Brute force startsWith and endsWith** → O(n^2 m) double loop, fine for the small part-I limits.",
      "**Count Prefix and Suffix Pairs II** (LeetCode 3045) → larger limits force the pair-trie or hashing approach this one previews.",
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → the core trie operations underneath.",
    ],
    related: ["implement-trie-prefix-tree", "longest-common-suffix-queries", "sum-of-prefix-scores-of-strings"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "points-that-intersect-with-cars",
    title: "Points That Intersect With Cars",
    difficulty: "Easy",
    pattern: "intervals",
    leetcode: 2848,
    statement:
      "You are given a 0-indexed 2D array `nums` where `nums[i] = [start_i, end_i]` means car i is parked on the inclusive integer range from `start_i` to `end_i`. Return the number of distinct integer POINTS on the number line that are covered by AT LEAST one car.",
    examples: [
      { in: "nums = [[3,6],[1,5],[4,7]]", out: "7", note: "the union of [3,6],[1,5],[4,7] covers integers 1..7, which is 7 points" },
      { in: "nums = [[1,3],[5,8]]", out: "7", note: "points 1,2,3 and 5,6,7,8 are covered, 3 + 4 = 7" },
    ],
    constraints: ["1 ≤ nums.length ≤ 100", "nums[i].length == 2", "1 ≤ start_i ≤ end_i ≤ 100", "the coordinates are small (≤ 100)"],
    recognize:
      "Count distinct integer points covered by the UNION of inclusive intervals over a small coordinate range → a **difference array (line sweep)**: +1 at each start, −1 just after each end, prefix-sum it, and count positions with a positive cover. With tiny coordinates a boolean/count array works directly; for larger ranges merge intervals first. Difference-array union counting is the signature.",
    figureItOut: [
      "I want the SIZE of the union of inclusive integer intervals — distinct points covered by at least one car, not double-counting overlaps. The coordinates are bounded by 100, which is tiny, so I can work directly on the number line rather than reasoning abstractly about overlaps.",
      "A difference array makes union counting clean. I keep an array diff over coordinates. For each car [start, end] I do diff[start] += 1 and diff[end + 1] -= 1. After processing all cars, a prefix sum of diff gives, at each coordinate, HOW MANY cars cover it.",
      "Then I scan the prefix-summed array and count every coordinate whose cover is at least 1. That count is exactly the number of distinct covered points, because each point is counted once regardless of how many cars overlap there — I only ask whether the running cover is positive.",
      "Why the end + 1 in the decrement? The interval is INCLUSIVE of end, so the coverage should drop only AFTER end, i.e. at end + 1. Sizing the diff array to max coordinate + 2 keeps that decrement in bounds. The whole thing is O(maxCoord + n): O(n) to lay down the +1/−1 marks and O(maxCoord) to sweep. With larger coordinates I would instead sort and merge intervals and sum their merged lengths, but the difference array is the simplest exact method at these limits.",
    ],
    approaches: [
      {
        name: "Difference array: +1 at start, −1 after end, prefix-sum and count positive points (optimal)",
        intuition: "Mark each interval's coverage with +1 at start and -1 just past the inclusive end, prefix-sum to get per-point cover, then count points covered by at least one car.",
        time: "O(maxCoord + n)",
        timeWhy: "Laying marks is O(n); the prefix-sum sweep is O(maxCoord).",
        space: "O(maxCoord)",
        spaceWhy: "The difference array spans the coordinate range.",
        code: `class Solution {
    public int numberOfPoints(List<List<Integer>> nums) {
        int[] diff = new int[102];                    // coordinates are 1..100
        for (List<Integer> car : nums) {
            diff[car.get(0)] += 1;                    // coverage begins at start
            diff[car.get(1) + 1] -= 1;                // coverage ends after the inclusive end
        }
        int cover = 0, covered = 0;
        for (int x = 1; x <= 100; x++) {
            cover += diff[x];                         // running number of cars over point x
            if (cover > 0) covered++;                 // x is covered by at least one car
        }
        return covered;
    }
}`,
        walkthrough: [
          "nums=[[3,6],[1,5],[4,7]]. Marks: +1 at 3,1,4 and -1 at 7,6,8.",
          "Prefix sweep: cover becomes positive from x=1 (start of [1,5]) through x=7 (end of [4,7]).",
          "Points 1,2,3,4,5,6,7 all have cover > 0 -> 7 covered points.",
        ],
      },
    ],
    edgeCases: [
      "Fully overlapping cars → counted once, the union equals the widest span.",
      "Disjoint cars → the covered count is the sum of their individual lengths.",
      "A single point car [k,k] → contributes exactly one covered point.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → merge first then sum merged lengths when coordinates are large.",
      "**Car Pooling** (LeetCode 1094) → the same difference-array sweep but tracking a capacity rather than coverage.",
      "**Corporate-style range counting** → a Fenwick/segment tree when ranges and queries grow large.",
    ],
    related: ["merge-intervals", "car-pooling", "summary-ranges"],
  },
];
