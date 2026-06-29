// NeetCode All + Top Interview 150 / LeetCode 75 / Grind 75 — wave 18b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave17b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE18B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "leaf-similar-trees",
    title: "Leaf-Similar Trees",
    difficulty: "Easy",
    pattern: "trees",
    leetcode: 872,
    statement:
      "Consider the sequence of LEAF values of a binary tree read from LEFT to RIGHT — its **leaf value sequence**. Two binary trees are **leaf-similar** if their leaf value sequences are identical. Given the roots `root1` and `root2` of two trees, return true if they are leaf-similar.",
    examples: [
      { in: "root1 = [3,5,1,6,2,9,8,null,null,7,4], root2 = [3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]", out: "true", note: "both trees produce the leaf sequence [6,7,4,9,8]" },
      { in: "root1 = [1,2,3], root2 = [1,3,2]", out: "false", note: "leaf sequences [2,3] and [3,2] differ in order" },
    ],
    constraints: ["the number of nodes in each tree is in [1, 200]", "0 ≤ Node.val ≤ 200"],
    recognize:
      "Compare the left-to-right LEAF sequences of two trees → run a DFS on each that collects leaf values in order, then compare the two lists element by element. A left-to-right DFS (preorder) visits leaves in exactly left-to-right order, so collecting-then-comparing is the move.",
    figureItOut: [
      "The whole question reduces to one derived object per tree: the list of leaf values, in left-to-right order. So I should not try to compare the trees structurally at all — I extract that list from each tree and compare the two lists.",
      "How do I get leaves in LEFT-to-RIGHT order? A DFS that always recurses into the LEFT child before the RIGHT child visits leaves in exactly that order. When I reach a node with no children, it is a leaf, so I append its value to the list; otherwise I recurse left then right.",
      "I build leaf list L1 from tree 1 and leaf list L2 from tree 2 the same way. The trees are leaf-similar iff L1 equals L2 — same length and same values in the same positions. Equal-length-and-elementwise is just List.equals.",
      "Each DFS visits every node once, so building both lists is O(n1 + n2) time, and the lists hold the leaves so it is O(n1 + n2) space plus the recursion stack. A more memory-frugal variant walks both trees with two iterators in lockstep and bails at the first differing leaf, but the collect-then-compare version is the most transparent expression of 'same leaf sequence'.",
    ],
    approaches: [
      {
        name: "DFS each tree collecting leaves left to right, compare the two lists (optimal)",
        intuition: "A left-before-right DFS visits leaves in left-to-right order; collect each tree's leaf values and check the lists are equal.",
        time: "O(n1 + n2)",
        timeWhy: "Each tree is traversed once with constant work per node.",
        space: "O(n1 + n2)",
        spaceWhy: "The two leaf lists plus recursion stacks proportional to the heights.",
        code: `class Solution {
    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        List<Integer> leaves1 = new ArrayList<>();
        List<Integer> leaves2 = new ArrayList<>();
        collectLeaves(root1, leaves1);
        collectLeaves(root2, leaves2);
        return leaves1.equals(leaves2);
    }

    private void collectLeaves(TreeNode node, List<Integer> leaves) {
        if (node == null) return;
        if (node.left == null && node.right == null) {
            leaves.add(node.val);           // a leaf: record its value in visit order
            return;
        }
        collectLeaves(node.left, leaves);   // left before right keeps leaves left-to-right
        collectLeaves(node.right, leaves);
    }
}`,
        walkthrough: [
          "Tree1 leaves collected left to right -> [6,7,4,9,8]. Tree2 leaves collected the same way -> [6,7,4,9,8].",
          "Lists have equal length and equal values position by position.",
          "leaves1.equals(leaves2) is true, so the trees are leaf-similar.",
        ],
      },
    ],
    edgeCases: [
      "A single-node tree → its one node is a leaf, giving a one-element sequence.",
      "Same leaves but different order → lists differ, returns false.",
      "Trees with different numbers of leaves → unequal lengths, returns false immediately.",
    ],
    twists: [
      "**Binary Tree Paths** (LeetCode 257) → collects whole root-to-leaf paths instead of just leaf values.",
      "**Sum of Left Leaves** (LeetCode 404) → another leaf-focused DFS, summing a subset of leaves.",
      "**Two-iterator lockstep** → walk both trees simultaneously and stop at the first differing leaf to save memory.",
    ],
    related: ["binary-tree-paths", "sum-of-left-leaves", "same-tree"],
  },

  {
    slug: "add-one-row-to-tree",
    title: "Add One Row to Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 623,
    statement:
      "Given the `root` of a binary tree and integers `val` and `depth`, add a row of nodes with value `val` at the given `depth`. The root is at depth 1. For every node currently at depth `depth - 1`, create a new node with value `val` as its LEFT child whose left subtree is the node's ORIGINAL left subtree, and another as its RIGHT child whose right subtree is the node's ORIGINAL right subtree. If `depth == 1`, create a brand-new root with value `val` whose left child is the entire original tree. Return the new root.",
    examples: [
      { in: "root = [4,2,6,3,1,5], val = 1, depth = 2", out: "[4,1,1,2,null,null,6,3,1,5]", note: "two new nodes of value 1 become the children of the root, carrying the old subtrees" },
      { in: "root = [4,2,null,3,1], val = 1, depth = 3", out: "[4,2,null,1,1,3,null,null,1]", note: "the new row is inserted between depth 2 and depth 3" },
    ],
    constraints: ["the number of nodes is in [1, 10⁴]", "the depth of the tree is in [1, 10⁴]", "−10⁵ ≤ Node.val ≤ 10⁵", "1 ≤ depth ≤ tree depth + 1"],
    recognize:
      "Insert a whole new row at a fixed depth, splicing each parent's old children beneath the new nodes → DFS (or BFS) down to depth − 1, and at every node on that level create two new nodes that adopt the existing left and right subtrees. The depth==1 special case wraps the old tree under a fresh root. Descend-to-the-level-then-splice is the pattern.",
    figureItOut: [
      "The action happens at exactly one level: the parents at depth − 1 each grow two new children at depth. So my first job is to REACH the nodes at depth − 1, and my second job is, at each of those nodes, to perform the splice.",
      "The splice at a parent p: I make newLeft with value val, point its left at p's ORIGINAL left subtree, and set p.left = newLeft. Symmetrically newRight takes p's original right subtree and becomes p.right. This pushes the old subtrees down one level and inserts the new row above them.",
      "To reach depth − 1 I recurse from the root carrying a current depth. While currentDepth is below depth − 1 I just recurse into both children with depth + 1. When currentDepth equals depth − 1 I do the splice and stop descending (the children below are now the old subtrees, untouched).",
      "The lone special case is depth == 1: there is no depth-0 parent, so I create a new root holding val and hang the entire original tree as its LEFT child, returning the new root. Everything else returns the original root. The traversal visits each node at most once down to the target level, O(n) time and O(h) recursion stack. The key realisation is that 'add a row' is really 'at each parent on one level, insert two nodes that inherit the existing subtrees' — not a rebuild of the tree.",
    ],
    approaches: [
      {
        name: "Recurse to depth − 1 and splice two new nodes carrying the old subtrees (optimal)",
        intuition: "Descend to the parents at depth − 1; at each, insert a val node on the left adopting the old left subtree and one on the right adopting the old right subtree. Handle depth == 1 by wrapping the whole tree under a new root.",
        time: "O(n)",
        timeWhy: "Each node down to the target level is visited once with constant splice work.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h.",
        code: `class Solution {
    public TreeNode addOneRow(TreeNode root, int val, int depth) {
        if (depth == 1) {                       // new root above the entire old tree
            TreeNode newRoot = new TreeNode(val);
            newRoot.left = root;
            return newRoot;
        }
        insert(root, val, depth, 1);
        return root;
    }

    private void insert(TreeNode node, int val, int depth, int cur) {
        if (node == null) return;
        if (cur == depth - 1) {                 // node is a parent on the row above the new row
            TreeNode newLeft = new TreeNode(val);
            TreeNode newRight = new TreeNode(val);
            newLeft.left = node.left;           // adopt the original left subtree
            newRight.right = node.right;        // adopt the original right subtree
            node.left = newLeft;
            node.right = newRight;
            return;                             // do not descend further
        }
        insert(node.left, val, depth, cur + 1);
        insert(node.right, val, depth, cur + 1);
    }
}`,
        walkthrough: [
          "root=[4,2,6,3,1,5], val=1, depth=2. depth != 1, so recurse. At root (cur=1 == depth-1) splice.",
          "newLeft(1) takes root.left (subtree rooted at 2); newRight(1) takes root.right (subtree rooted at 6). root.left=newLeft, root.right=newRight.",
          "Result: root 4 -> children 1,1 -> their preserved subtrees 2.. and 6.. below -> [4,1,1,2,null,null,6,3,1,5].",
        ],
      },
    ],
    edgeCases: [
      "depth == 1 → a new root is created with the whole original tree as its left child.",
      "A parent missing a child (null left or right) → the new node simply adopts a null subtree, which is fine.",
      "depth equal to tree depth + 1 → the new row becomes a fresh set of leaves below the current deepest level.",
    ],
    twists: [
      "**Maximum Depth of Binary Tree** (LeetCode 104) → the depth-tracking primitive this leans on.",
      "**Binary Tree Level Order Traversal** (LeetCode 102) → a BFS reaching depth − 1 is an equally valid way to find the parents.",
      "**Insert into a Binary Search Tree** (LeetCode 701) → insertion by value/ordering rather than at a fixed depth.",
    ],
    related: ["maximum-depth-of-binary-tree", "binary-tree-level-order-traversal", "insert-into-a-binary-search-tree"],
  },

  {
    slug: "maximum-level-sum-of-a-binary-tree",
    title: "Maximum Level Sum of a Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1161,
    statement:
      "Given the `root` of a binary tree, the level of its root is 1, the level of its children is 2, and so on. Return the SMALLEST level `x` such that the sum of all node values at level `x` is MAXIMAL among all levels.",
    examples: [
      { in: "root = [1,7,0,7,-8,null,null]", out: "2", note: "level 1 sum = 1, level 2 sum = 7 + 0 = 7, level 3 sum = 7 + (-8) = -1; level 2 is largest" },
      { in: "root = [989,null,10250,98693,-89388,null,null,null,-32127]", out: "2", note: "level 2 holds the maximal sum" },
    ],
    constraints: ["the number of nodes is in [1, 10⁴]", "−10⁵ ≤ Node.val ≤ 10⁵"],
    recognize:
      "Find the level whose node-sum is largest (ties broken by smallest level) → level-order BFS, summing each level and tracking the best sum with its level number, keeping the first level that achieves the maximum. Per-level aggregation over BFS is the signature.",
    figureItOut: [
      "Every answer is a per-LEVEL quantity (the sum of a level), so I want to process the tree one full level at a time. Level-order BFS does exactly that: I dequeue all nodes currently on a level before touching the next, which lets me total a level in isolation.",
      "I keep a running level counter starting at 1. For each level I add up the values of all its nodes while enqueuing their children for the next level. After finishing a level I have (level number, level sum).",
      "I track the best so far: maxSum and the level that produced it. When a new level's sum is STRICTLY greater than maxSum, I update both. Because I scan levels in increasing order and only update on a strict improvement, ties are automatically resolved in favour of the SMALLEST level — exactly what the problem asks.",
      "Each node is enqueued and dequeued once, so it is O(n) time and O(width) queue space. Sums can be large and negative, so I initialise maxSum to the smallest possible long/int to be safe. The core realisation is that this is a straightforward 'aggregate per level, take the arg-max with a first-wins tie rule' over a level-order walk.",
    ],
    approaches: [
      {
        name: "Level-order BFS summing each level, keep the first level with the maximum sum (optimal)",
        intuition: "Total each level during BFS; update the answer only when a level's sum strictly beats the current best, so the earliest maximal level wins.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued once with O(1) work.",
        space: "O(w)",
        spaceWhy: "The queue holds at most one full level of width w (up to O(n)).",
        code: `class Solution {
    public int maxLevelSum(TreeNode root) {
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int level = 0, bestLevel = 1;
        long maxSum = Long.MIN_VALUE;

        while (!queue.isEmpty()) {
            level++;
            int size = queue.size();
            long sum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                sum += node.val;
                if (node.left != null)  queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            if (sum > maxSum) {            // strict beat: keeps the earliest maximal level
                maxSum = sum;
                bestLevel = level;
            }
        }
        return bestLevel;
    }
}`,
        walkthrough: [
          "root=[1,7,0,7,-8]. Level1 sum = 1 -> maxSum=1, bestLevel=1.",
          "Level2 sum = 7 + 0 = 7 -> 7 > 1 -> maxSum=7, bestLevel=2.",
          "Level3 sum = 7 + (-8) = -1 -> not greater than 7 -> bestLevel stays 2. Return 2.",
        ],
      },
    ],
    edgeCases: [
      "All negative values → the level with the least-negative sum wins; maxSum must start below all possible sums.",
      "Single node → only level 1 exists, answer is 1.",
      "Two levels tie on sum → the smaller level number is returned because updates require a strict increase.",
    ],
    twists: [
      "**Average of Levels in Binary Tree** (LeetCode 637) → average each level instead of summing.",
      "**Binary Tree Level Order Traversal** (LeetCode 102) → emit the level values rather than aggregating.",
      "**Find Bottom Left Tree Value** (LeetCode 513) → another single-pass level-aware selection.",
    ],
    related: ["average-of-levels-in-binary-tree", "binary-tree-level-order-traversal", "find-bottom-left-tree-value"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "linked-list-in-binary-tree",
    title: "Linked List in Binary Tree",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 1367,
    statement:
      "Given the `head` of a singly linked list and the `root` of a binary tree, return true if there is a DOWNWARD path in the tree whose node values, read top to bottom, exactly match the linked list values in order. A downward path starts at some tree node and proceeds to children (always going down, never up); it need not start at the root nor end at a leaf.",
    examples: [
      { in: "head = [4,2,8], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]", out: "true", note: "a downward path 4 -> 2 -> 8 exists in the tree" },
      { in: "head = [1,4,2,6,8], root = [1,4,4,null,2,2,null,1,null,6,8,null,null,null,null,1,3]", out: "false", note: "no downward path spells out the whole list" },
    ],
    constraints: ["the number of nodes in the tree is in [1, 2500]", "the number of nodes in the list is in [1, 100]", "1 ≤ Node.val ≤ 100"],
    recognize:
      "Match a linked-list sequence against some downward tree path → for EACH tree node as a potential start, try to walk the list and the tree downward together; if the prefix breaks, restart from this node's children. A nested DFS — outer over start nodes, inner matching the list downward — is the pattern.",
    figureItOut: [
      "The list is a fixed sequence of values; I am asking whether that exact sequence appears along some top-to-bottom path in the tree. The path can begin at ANY tree node, so I have two jobs: choose a starting tree node, and from a chosen start, verify the list matches downward.",
      "The inner job (does the list match starting HERE?): align the list head with the current tree node. If their values differ, this start fails. If they match, I have consumed one list value; I then need the NEXT list value to match a child — either the left child or the right child. So I recurse: matchFrom succeeds if the remaining list (head.next) matches downward from node.left OR from node.right. The base success case is when the list runs out (head == null) — every list value was matched.",
      "The outer job (try every start): I DFS the whole tree, and at each tree node I attempt the inner match starting there. If any start yields a full match, the answer is true. If the tree node is null I stop; otherwise I check matchFrom(head, node) OR a recursive search in the left subtree OR the right subtree.",
      "Why both an outer and inner recursion? The outer one picks where the path begins; the inner one tests one specific alignment downward. Worst case I attempt a match from every tree node, and each match can walk down the length of the list L, giving O(n · L) time and O(h) stack for the tree height. With L ≤ 100 and n ≤ 2500 that is comfortably fast. The clean mental model is 'substring search, but the text is a tree and matches go downward'.",
    ],
    approaches: [
      {
        name: "DFS every tree node as a start, inner DFS matching the list downward (optimal)",
        intuition: "From each tree node, try to align the list and walk down into either child; succeed when the list is exhausted, restart the attempt at every node via an outer DFS.",
        time: "O(n · L)",
        timeWhy: "Each of the n tree nodes can launch a downward match of length up to L (the list length).",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h.",
        code: `class Solution {
    public boolean isSubPath(ListNode head, TreeNode root) {
        if (root == null) return false;
        // try a match starting here, or search either subtree for a start
        return matchFrom(head, root)
            || isSubPath(head, root.left)
            || isSubPath(head, root.right);
    }

    private boolean matchFrom(ListNode head, TreeNode node) {
        if (head == null) return true;          // whole list matched
        if (node == null) return false;         // ran out of tree before the list ended
        if (node.val != head.val) return false; // mismatch at this position
        return matchFrom(head.next, node.left)  // continue downward into either child
            || matchFrom(head.next, node.right);
    }
}`,
        walkthrough: [
          "head=[4,2,8]. Outer DFS reaches the tree node 4 that has a child 2 with a child 8.",
          "matchFrom: 4==4 -> need next (2) below; child 2==2 -> need next (8) below; child 8==8 -> next is null (list done) -> true.",
          "An OR short-circuits up the recursion, so isSubPath returns true.",
        ],
      },
    ],
    edgeCases: [
      "List longer than any downward path → matchFrom hits a null tree node before the list ends, returns false.",
      "Single-value list → succeeds at the first tree node holding that value.",
      "Repeated values forcing a restart → a partial match that breaks lets the outer DFS retry from a deeper node.",
    ],
    twists: [
      "**Subtree of Another Tree** (LeetCode 572) → match a whole subtree shape rather than a single downward path.",
      "**Path Sum** (LeetCode 112) → a downward path constrained by a target sum instead of an exact value sequence.",
      "**KMP-style speed-up** → preprocess the list to avoid re-matching shared prefixes for very long lists.",
    ],
    related: ["subtree-of-another-tree", "path-sum", "binary-tree-paths"],
  },

  {
    slug: "merge-in-between-linked-lists",
    title: "Merge In Between Linked Lists",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 1669,
    statement:
      "You are given two singly linked lists `list1` (of size n) and `list2`, plus integers `a` and `b`. REMOVE from `list1` the nodes at positions `a` through `b` inclusive (0-indexed), and splice ALL of `list2` into that gap. Return the head of the resulting list.",
    examples: [
      { in: "list1 = [10,1,13,6,9,5], list2 = [1000000,1000001,1000002], a = 3, b = 4", out: "[10,1,13,1000000,1000001,1000002,5]", note: "nodes at indices 3 and 4 (values 6 and 9) are removed and list2 is inserted" },
      { in: "list1 = [0,1,2,3,4,5,6], list2 = [1000000,1000001,1000002,1000003,1000004], a = 2, b = 5", out: "[0,1,1000000,1000001,1000002,1000003,1000004,6]", note: "indices 2..5 removed, list2 spliced in" },
    ],
    constraints: ["3 ≤ list1 length ≤ 10⁴", "1 ≤ a ≤ b < list1 length − 1", "1 ≤ list2 length ≤ 10⁴"],
    recognize:
      "Cut out a contiguous index range of a list and stitch another list into the hole → find the node BEFORE position a (the node at a − 1) and the node AFTER position b, then relink: before.next = list2 head, and list2 tail.next = after. Two boundary pointers plus a walk to list2's tail is the move.",
    figureItOut: [
      "Removing indices a..b and inserting list2 is really a pointer-surgery problem: I need the two ENDS of the surgery. The left boundary is the node just before the removed region, i.e. the node at index a − 1; the right boundary is the node just after the region, i.e. the node at index b + 1. Everything between them gets discarded.",
      "I locate the left boundary by walking a − 1 steps from list1's head. Call it 'before'. To find the right boundary I keep walking from 'before' until I reach index b + 1 — that is b − a + 2 more steps, but the simplest is to advance a separate pointer from before to the node at index b + 1. Call it 'after'.",
      "Now the stitch. list2 will sit in the gap, so before.next must point to list2's head. And list2's TAIL must connect to 'after' so the rest of list1 follows. I therefore walk list2 to its last node and set its next to 'after'. Finally before.next = list2 (head).",
      "The removed nodes between before and after are now unreferenced and simply drop out. Because a >= 1 and b < n − 1, both 'before' and 'after' always exist (no head/tail edge surgery needed). The cost is O(n) to find the boundaries plus O(m) to reach list2's tail, O(n + m) total and O(1) extra space. The whole trick is identifying the two boundary nodes and remembering to connect list2's tail, not just its head.",
    ],
    approaches: [
      {
        name: "Find the node before a and the node after b, then splice list2 between them (optimal)",
        intuition: "Walk to the node at index a − 1 and the node at index b + 1, connect the first to list2's head and list2's tail to the second; the in-between nodes drop out.",
        time: "O(n + m)",
        timeWhy: "One walk over list1 to find boundaries plus a walk over list2 to find its tail.",
        space: "O(1)",
        spaceWhy: "Only a handful of pointers; relinking is done in place.",
        code: `class Solution {
    public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
        ListNode before = list1;
        for (int i = 0; i < a - 1; i++) {       // stop at the node just before index a
            before = before.next;
        }
        ListNode after = before;
        for (int i = a - 1; i <= b; i++) {      // advance to the node just after index b
            after = after.next;
        }
        before.next = list2;                    // attach list2's head into the gap
        ListNode tail = list2;
        while (tail.next != null) {             // find list2's last node
            tail = tail.next;
        }
        tail.next = after;                      // connect list2's tail to the remainder
        return list1;
    }
}`,
        walkthrough: [
          "list1=[10,1,13,6,9,5], a=3, b=4. Walk to index 2 -> before = node 13. Advance to index 5 -> after = node 5.",
          "before.next = list2 head (1000000). Walk list2 to its tail 1000002; set 1000002.next = after (node 5).",
          "Result: 10,1,13,1000000,1000001,1000002,5; nodes 6 and 9 are dropped.",
        ],
      },
    ],
    edgeCases: [
      "a == b → exactly one node is removed and replaced by list2.",
      "list2 of length 1 → its single node is both head and tail of the spliced segment.",
      "a == 1 → 'before' is the head node itself, which still exists because a >= 1.",
    ],
    twists: [
      "**Remove Nth Node From End of List** (LeetCode 19) → boundary-pointer surgery to delete a single node by position-from-end.",
      "**Reverse Linked List II** (LeetCode 92) → operate on an index range a..b but reverse it instead of replacing it.",
      "**Merge Two Sorted Lists** (LeetCode 21) → general interleaving merge rather than a positional splice.",
    ],
    related: ["remove-nth-node-from-end-of-list", "reverse-linked-list-ii", "merge-two-sorted-lists"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "minimum-operations-to-halve-the-array-sum",
    title: "Minimum Operations to Halve the Array Sum",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 2208,
    statement:
      "You are given an array `nums` of positive numbers. In one operation you may pick any number in the array and REDUCE it to HALF its value (the reduced value need not be an integer, and the same element may be chosen repeatedly). Return the MINIMUM number of operations needed so that the array sum is reduced to AT MOST half of its initial sum.",
    examples: [
      { in: "nums = [5,19,8,1]", out: "3", note: "initial sum 33; halving 19, then 19/2... greedily halve the largest each time until the removed amount reaches 16.5" },
      { in: "nums = [3,8,20]", out: "3", note: "initial sum 31; target reduction 15.5, reached after three halvings of the largest available value" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁷"],
    recognize:
      "Each operation halves one element and you want the fewest to remove half the total → greedily ALWAYS halve the CURRENTLY LARGEST element, because halving the biggest value removes the most sum per operation. A **max-heap** delivers the largest value, you halve it, push it back, and count operations until the accumulated reduction reaches half the original sum. Greedy-largest-via-max-heap is the signature.",
    figureItOut: [
      "I want to remove half of the total sum using as few halving operations as possible. Each operation on a value v removes exactly v/2 from the sum (it drops from v to v/2). So the AMOUNT removed by one operation equals half of whatever value I chose.",
      "To remove the most sum per operation, I should always halve the LARGEST current value — halving 100 removes 50, halving 4 removes only 2. Is this greedy choice optimal? Yes: the removals are independent in the sense that I just need the total removed to reach half the sum, and at every step the single biggest available reduction comes from the biggest current element. There is never a reason to halve a smaller element when a larger one is available, because that larger one yields a bigger reduction now and remains available later anyway.",
      "To always grab the largest element fast, I use a MAX-HEAP of the current values. Each step: pop the max v, the reduction is v/2, add that to a running 'removed' total, push v/2 back (the element still exists at half its value, and could be halved again), and increment the operation count.",
      "I stop as soon as 'removed' >= half of the ORIGINAL sum. I compute the original sum once up front, set target = sum / 2, and loop popping-halving-pushing until removed >= target. Building the heap is O(n); each operation is O(log n); the number of operations is modest because each halving on a large value removes a lot, so total is O((n + k) log n) for k operations. Using doubles avoids integer rounding since halves need not be integers. The crux is recognising that 'maximum reduction per operation' = 'halve the current maximum', which is precisely what a max-heap serves up.",
    ],
    approaches: [
      {
        name: "Max-heap: repeatedly halve the largest value, accumulate the reduction until it reaches half the sum (optimal)",
        intuition: "Halving the biggest current value removes the most sum per operation, so a max-heap that you pop, halve, and re-push minimises the operation count.",
        time: "O((n + k) log n)",
        timeWhy: "Heap build is O(n); each of the k operations does an O(log n) pop and push.",
        space: "O(n)",
        spaceWhy: "The max-heap holds all n values.",
        code: `class Solution {
    public int halveArray(int[] nums) {
        PriorityQueue<Double> heap = new PriorityQueue<>(Collections.reverseOrder());
        double sum = 0;
        for (int x : nums) {
            heap.offer((double) x);
            sum += x;
        }
        double target = sum / 2.0;      // we must remove at least this much
        double removed = 0;
        int ops = 0;
        while (removed < target) {
            double largest = heap.poll();
            double half = largest / 2.0;
            removed += half;            // halving removes exactly half of the chosen value
            heap.offer(half);           // the element remains, now at half its value
            ops++;
        }
        return ops;
    }
}`,
        walkthrough: [
          "nums=[5,19,8,1]. sum=33, target=16.5. Heap max=19 -> remove 9.5, push 9.5, ops=1 (removed 9.5).",
          "Max now 9.5 -> remove 4.75, push 4.75, ops=2 (removed 14.25). Max now 8 -> remove 4.0, ops=3 (removed 18.25).",
          "18.25 >= 16.5 -> stop. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "Single element → halve it once if that already removes half the sum (it always does for one element), so the answer is 1.",
      "Very large values → use doubles so repeated halving stays precise enough for the comparison.",
      "All equal values → the heap still hands back a maximum each time; ties do not change the count.",
    ],
    twists: [
      "**Take Gifts From the Richest Pile** (LeetCode 2558) → repeatedly modify and re-push the heap max, but with a square-root reduction.",
      "**Last Stone Weight** (LeetCode 1046) → max-heap pop-two-push-difference loop.",
      "**Maximal Score After Applying K Operations** (LeetCode 2530) → fixed K operations maximising a sum via a max-heap.",
    ],
    related: ["take-gifts-from-the-richest-pile", "last-stone-weight", "maximal-score-after-applying-k-operations"],
  },

  {
    slug: "find-subsequence-of-length-k-with-the-largest-sum",
    title: "Find Subsequence of Length K With the Largest Sum",
    difficulty: "Easy",
    pattern: "heaps",
    leetcode: 2099,
    statement:
      "Given an integer array `nums` and an integer `k`, return ANY subsequence of `nums` of length `k` that has the LARGEST possible sum. A subsequence keeps the original RELATIVE ORDER of the chosen elements. The returned subsequence must preserve that order.",
    examples: [
      { in: "nums = [2,1,3,3], k = 2", out: "[3,3]", note: "the two largest values are both 3; they keep their original order" },
      { in: "nums = [-1,-2,3,4], k = 3", out: "[-1,3,4]", note: "drop the single smallest element (−2), keep the rest in order" },
    ],
    constraints: ["1 ≤ nums.length ≤ 1000", "−10⁵ ≤ nums[i] ≤ 10⁵", "1 ≤ k ≤ nums.length"],
    recognize:
      "Pick the k largest VALUES but emit them in ORIGINAL index order → use a **min-heap of size k over (value, index)** to retain the k largest, then sort the survivors by index and output their values. Top-k-by-value-then-restore-order is the pattern.",
    figureItOut: [
      "There are two separate requirements fighting each other: WHICH elements to keep (the k with the largest values, to maximise the sum) and in WHAT ORDER to print them (original relative order, not sorted by value). I should satisfy them in two stages.",
      "Stage one — select the k largest values. A min-heap of capacity k does this in one pass: I push each element, and whenever the heap exceeds size k I pop its smallest. After the pass the heap holds exactly the k largest values — anything I popped was smaller than k other elements, so it cannot belong to the top k. To restore order later, I must store each element WITH its original INDEX, e.g. as a pair (value, index).",
      "Stage two — restore original order. The k survivors are an unordered bag; the subsequence must follow original positions. So I sort the survivors by their stored INDEX ascending and emit their values in that order. That reproduces the relative order they had in nums.",
      "Why pair value with index and not just value? Because duplicates and the ordering requirement make the index essential — two equal values must still be placed at their real positions, and the min-heap must keep the right physical elements. The pass is O(n log k) for the size-k heap, plus O(k log k) to sort the survivors by index, O(n log k) overall, O(k) space. The clean separation — heap to choose by value, sort to restore by index — is the whole idea.",
    ],
    approaches: [
      {
        name: "Min-heap of size k over (value, index), then sort survivors by index (optimal)",
        intuition: "Keep the k largest values with a size-k min-heap that drops the smallest when it overflows; then order the kept elements by their original index to honour subsequence order.",
        time: "O(n log k)",
        timeWhy: "Each of the n elements does an O(log k) heap push/pop; sorting k survivors is O(k log k).",
        space: "O(k)",
        spaceWhy: "The heap and the survivor list hold at most k elements.",
        code: `class Solution {
    public int[] maxSubsequence(int[] nums, int k) {
        // min-heap keyed by value; entry is {value, index}
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 0; i < nums.length; i++) {
            heap.offer(new int[]{ nums[i], i });
            if (heap.size() > k) heap.poll();      // drop the smallest, keep the top k
        }
        List<int[]> kept = new ArrayList<>(heap); // the k largest, in arbitrary order
        kept.sort((a, b) -> Integer.compare(a[1], b[1])); // restore original index order
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = kept.get(i)[0];
        }
        return result;
    }
}`,
        walkthrough: [
          "nums=[-1,-2,3,4], k=3. Push (-1,0),(-2,1),(3,2); size 3. Push (4,3) -> size 4 -> pop smallest (-2,1).",
          "Heap holds {(-1,0),(3,2),(4,3)}. Sort by index -> [(-1,0),(3,2),(4,3)].",
          "Output values in that order -> [-1,3,4].",
        ],
      },
    ],
    edgeCases: [
      "k equals the array length → the whole array is returned in original order.",
      "Duplicate maximal values → the index stored with each keeps the correct physical elements and order.",
      "All negative values → the k least-negative values are kept, still ordered by index.",
    ],
    twists: [
      "**Kth Largest Element in an Array** (LeetCode 215) → select the kth largest value rather than the top-k subsequence.",
      "**K Closest Points to Origin** (LeetCode 973) → the same size-k heap selection on a distance key.",
      "**Top K Frequent Elements** (LeetCode 347) → top-k by frequency instead of raw value.",
    ],
    related: ["kth-largest-element-in-an-array", "k-closest-points-to-origin", "find-the-kth-largest-integer-in-the-array"],
  },

  {
    slug: "construct-target-array-with-multiple-sums",
    title: "Construct Target Array With Multiple Sums",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 1354,
    statement:
      "You start with an array `arr` of length n that is ALL ONES. In one operation you compute the sum `s` of the current array, pick any index `i`, and SET `arr[i] = s`. Given a `target` array, return true if it is possible to reach `target` from the all-ones array by some sequence of such operations.",
    examples: [
      { in: "target = [9,3,5]", out: "true", note: "reachable: [1,1,1] -> [1,1,3]? working backwards, 9 = sum of others + previous, the chain validates" },
      { in: "target = [1,1,1,2]", out: "false", note: "n = 4 but the largest is only 2, which cannot have been a full-array sum" },
    ],
    constraints: ["n == target.length", "1 ≤ n ≤ 5·10⁴", "1 ≤ target[i] ≤ 10⁹"],
    recognize:
      "Reverse a process where each step replaces one element with the whole array sum → run it BACKWARDS with a **max-heap**: the current maximum MUST be the element that was just written, so replace it with (max − sumOfOthers); repeat until everything is 1, using a modulo to fast-forward when one element dominates. Max-heap reverse-construction is the signature.",
    figureItOut: [
      "Going forward, each move overwrites some index with the CURRENT total sum, which makes that index the new largest element (the sum is at least as big as any single element when all are positive). So working FORWARD branches uncontrollably, but working BACKWARD is deterministic: the largest element in the current array must have been the one most recently written.",
      "So I reverse a step like this: let max be the current maximum and rest = (sum of all other elements). Before that step, the value at max's position was max − rest (because forward, that position became rest + previousValue = sum). If max − rest is at least 1, I replace max with that value and continue; if it drops below 1, reconstruction is impossible.",
      "A max-heap gives me the current maximum each round. I pop max, compute rest = totalSum − max, set the element back to max − rest, push it, and update totalSum. I stop successfully when the maximum becomes 1 (everything is then 1). If at any point max != 1 but rest == 0 (only one element, n == 1 special case) or max − rest < 1, I return false. The n == 1 case is special: it is reachable iff target[0] == 1.",
      "One element can dominate for many rounds (e.g. a huge max with a tiny rest), so subtracting rest once at a time is too slow. Since each backward step subtracts rest from max, I can fast-forward with MODULO: the new value is max % rest (subtract rest as many times as possible at once), provided rest > 0. If max % rest == 0 it would leave 0 which is invalid (unless rest itself is the all-ones state), so guard for that. Each genuine reduction shrinks the max a lot, giving about O(n log(maxVal)) overall with the heap. The deep insight is the irreversibility of the forward step makes the backward step unique, and the modulo turns a long subtraction chain into one operation.",
    ],
    approaches: [
      {
        name: "Reverse with a max-heap, replacing the max by max mod (sum of others) until all ones (optimal)",
        intuition: "The maximum is always the last-written element, so undo it as max − rest, accelerated by max mod rest; succeed when everything is 1.",
        time: "O(n log(maxVal))",
        timeWhy: "Each heap operation is O(log n); the modulo fast-forwards many subtractions, bounding the number of rounds by the values shrinking.",
        space: "O(n)",
        spaceWhy: "The max-heap holds all n elements.",
        code: `class Solution {
    public boolean isPossible(int[] target) {
        if (target.length == 1) return target[0] == 1;   // only reachable if already 1
        PriorityQueue<Long> heap = new PriorityQueue<>(Collections.reverseOrder());
        long total = 0;
        for (int x : target) {
            heap.offer((long) x);
            total += x;
        }
        while (heap.peek() > 1) {
            long max = heap.poll();
            long rest = total - max;                      // sum of all the other elements
            if (rest == 0 || rest >= max) return false;   // cannot have produced this max
            long prev = max % rest;                       // fast-forward the repeated subtraction
            if (prev == 0) return false;                  // would leave a non-positive value
            total = rest + prev;
            heap.offer(prev);
        }
        return true;                                      // every element reduced to 1
    }
}`,
        walkthrough: [
          "target=[9,3,5]. total=17. max=9, rest=8. 9 % 8 = 1 -> push 1, total = 8 + 1 = 9. Heap {5,3,1}.",
          "max=5, rest=4. 5 % 4 = 1 -> push 1, total = 4 + 1 = 5. Heap {3,1,1}. max=3, rest=2. 3 % 2 = 1 -> push 1, total=3. Heap {1,1,1}.",
          "Max is now 1 -> all ones reached -> true.",
        ],
      },
    ],
    edgeCases: [
      "n == 1 → reachable only if the single target value is 1.",
      "rest >= max (the maximum is not strictly the largest contribution) → impossible, return false.",
      "max % rest == 0 → would produce a non-positive element, so reconstruction fails.",
    ],
    twists: [
      "**Last Stone Weight** (LeetCode 1046) → another max-heap pop-modify loop, but combining two elements.",
      "**Minimum Operations to Halve the Array Sum** (LeetCode 2208) → repeatedly transform the max via a heap.",
      "**Forward simulation** → infeasible because each forward step branches over the index choice; the backward view is what makes it tractable.",
    ],
    related: ["last-stone-weight", "minimum-operations-to-halve-the-array-sum", "kth-largest-element-in-an-array"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "maximum-xor-with-an-element-from-array",
    title: "Maximum XOR With an Element From Array",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 1707,
    statement:
      "You are given an array `nums` and a list of `queries` where `queries[j] = [x_j, m_j]`. For each query, find the MAXIMUM value of `x_j XOR nums[i]` over all `nums[i]` that are AT MOST `m_j`. If no element of `nums` is ≤ `m_j`, the answer for that query is −1. Return an array of the answers in query order.",
    examples: [
      { in: "nums = [0,1,2,3,4], queries = [[3,1],[1,3],[5,6]]", out: "[3,3,7]", note: "for [3,1] only {0,1} qualify; 3 XOR 0 = 3 is the max" },
      { in: "nums = [5,2,4,6,6,3], queries = [[12,4],[8,1],[6,3]]", out: "[15,-1,5]", note: "for [8,1] no element is ≤ 1, so −1" },
    ],
    constraints: ["1 ≤ nums.length, queries.length ≤ 10⁵", "0 ≤ nums[i] ≤ 10⁹", "0 ≤ x_j, m_j ≤ 10⁹"],
    recognize:
      "Maximum XOR against a value, but only over elements bounded by m → sort nums and process queries in INCREASING m (OFFLINE), inserting nums into a **binary (bitwise) trie** as they become ≤ m, then for each query greedily walk the trie choosing the opposite bit to maximise XOR. Offline + bitwise-trie with a monotone insertion pointer is the signature.",
    figureItOut: [
      "Strip away the constraint first: 'maximum x XOR nums[i]' over ALL elements is the classic bitwise-trie problem. I store each number as a path of 32 bits from most significant to least in a binary trie. To maximise XOR with x, at each bit I greedily try to go down the OPPOSITE bit of x's current bit (because opposite bits XOR to 1, the most valuable when taken high-to-low); if that child is missing I take the same-bit child.",
      "Now the twist: only elements ≤ m_j are allowed per query. If I had to rebuild a trie per query it would be too slow. The fix is to process queries OFFLINE — answer them in a convenient order rather than the given order. Specifically, if I sort the queries by m ascending and sort nums ascending, then as m grows the SET of allowed elements only GROWS. I can keep a pointer into sorted nums and insert each element into the trie exactly once, the first time some query's m is large enough to include it.",
      "So the algorithm: sort nums; pair each query with its original index and sort queries by m. Walk the sorted queries; for each, advance the nums pointer inserting every nums value ≤ current m into the trie. Then if the trie is non-empty, answer the query by the greedy max-XOR walk; if it is still empty (no element ≤ m), answer −1. Store answers back at the original query indices.",
      "Why does sorting by m make insertion monotone? Because an element allowed for some m is allowed for every larger m, so I never need to remove from the trie — only add. Each number is inserted once (O(32) bits), each query answered with one O(32) walk, plus the sorts: O((n + q) log(n + q) + 32(n + q)). The two ideas working together — a bitwise trie for max-XOR and offline monotone insertion for the ≤ m bound — are the signature of this problem.",
    ],
    approaches: [
      {
        name: "Offline by increasing m, insert qualifying nums into a bitwise trie, greedy max-XOR walk (optimal)",
        intuition: "Sort nums and queries by the bound m so the allowed set only grows; insert each number once and answer each query with the standard opposite-bit greedy walk, or −1 if the trie is empty.",
        time: "O((n + q) (log n + B))",
        timeWhy: "Sorting is O((n+q) log(n+q)); each insert and each query walk is O(B) over the B≈30 bits.",
        space: "O(n · B)",
        spaceWhy: "The bitwise trie stores up to B nodes per inserted number.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[2];
    }

    private static final int BITS = 30;       // 10^9 fits in 30 bits

    public int[] maximizeXor(int[] nums, int[][] queries) {
        Arrays.sort(nums);
        int q = queries.length;
        Integer[] order = new Integer[q];
        for (int i = 0; i < q; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(queries[a][1], queries[b][1])); // by m ascending

        int[] ans = new int[q];
        TrieNode root = new TrieNode();
        int idx = 0;
        boolean anyInserted = false;
        for (int qi : order) {
            int x = queries[qi][0], m = queries[qi][1];
            while (idx < nums.length && nums[idx] <= m) {   // grow the allowed set
                insert(root, nums[idx]);
                anyInserted = true;
                idx++;
            }
            ans[qi] = (idx == 0 && !anyInserted && nothingInserted(root)) ? -1 : queryMax(root, x);
        }
        return ans;
    }

    private boolean nothingInserted(TrieNode root) {
        return root.child[0] == null && root.child[1] == null;
    }

    private void insert(TrieNode root, int num) {
        TrieNode cur = root;
        for (int b = BITS; b >= 0; b--) {
            int bit = (num >> b) & 1;
            if (cur.child[bit] == null) cur.child[bit] = new TrieNode();
            cur = cur.child[bit];
        }
    }

    private int queryMax(TrieNode root, int x) {
        if (root.child[0] == null && root.child[1] == null) return -1; // empty trie
        TrieNode cur = root;
        int result = 0;
        for (int b = BITS; b >= 0; b--) {
            int bit = (x >> b) & 1;
            int want = 1 - bit;                 // prefer the opposite bit for a 1 in the XOR
            if (cur.child[want] != null) {
                result |= (1 << b);
                cur = cur.child[want];
            } else {
                cur = cur.child[bit];
            }
        }
        return result;
    }
}`,
        walkthrough: [
          "nums sorted, queries sorted by m. For [3,1]: insert nums <= 1 -> {0,1}. Greedy XOR of 3 against the trie gives 3 (3 XOR 0).",
          "For [1,3]: insert nums <= 3 -> add 2,3 -> {0,1,2,3}. Max 1 XOR ? = 3 (1 XOR 2). For [5,6]: add 4 -> max 5 XOR 2 = 7.",
          "Answers placed back at original indices -> [3,3,7].",
        ],
      },
    ],
    edgeCases: [
      "A query whose m is below every element → the trie is empty for it, answer is −1.",
      "Duplicate nums values → inserting a duplicate path is harmless; XOR results are unaffected.",
      "x or nums up to 10^9 → 30 bits suffice; using BITS = 30 covers the range.",
    ],
    twists: [
      "**Maximum XOR of Two Numbers in an Array** (LeetCode 421) → the unconstrained version with the same bitwise trie.",
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → the character-trie cousin of this bitwise trie.",
      "**Online with a segment-tree of tries** → if queries cannot be reordered, the offline monotone trick no longer applies.",
    ],
    related: ["maximum-xor-of-two-numbers-in-an-array", "implement-trie-prefix-tree", "count-pairs-with-xor-in-a-range"],
  },

  {
    slug: "maximum-strong-pair-xor-ii",
    title: "Maximum Strong Pair XOR II",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 2935,
    statement:
      "You are given a 0-indexed integer array `nums`. A pair of integers `x` and `y` (the two may be the SAME element index) is a **strong pair** if `|x − y| ≤ min(x, y)`. Return the MAXIMUM `x XOR y` over all strong pairs. Note that you may pick the same element for both x and y.",
    examples: [
      { in: "nums = [1,2,3,4,5]", out: "7", note: "the strong pair (3,4) satisfies |3−4| ≤ 3 and 3 XOR 4 = 7" },
      { in: "nums = [10,100]", out: "0", note: "the only strong pairs are an element with itself; x XOR x = 0" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5·10⁴", "1 ≤ nums[i] ≤ 2^20 − 1"],
    recognize:
      "Maximise XOR over pairs constrained by |x − y| ≤ min(x, y) → sort nums so the condition becomes a SLIDING WINDOW (for the larger value y, x must be ≥ y/2), then maintain a **bitwise trie of the window** with insert AND delete as the window slides, querying the max XOR for each y. Sorted sliding window over a bitwise trie is the signature.",
    figureItOut: [
      "The strong-pair condition |x − y| ≤ min(x, y) is awkward until I assume an order. Suppose x ≤ y. Then min is x and |x − y| = y − x, so the condition is y − x ≤ x, i.e. y ≤ 2x, i.e. x ≥ y/2. So for a fixed larger value y, the valid partners x are those with y/2 ≤ x ≤ y. SORTING nums makes 'x ≤ y' and the y/2 lower bound a contiguous RANGE.",
      "After sorting, I sweep y from left to right over the array (y is nums[right]). The valid partners are the elements in a window [left, right] where nums[left] is the first element that is at least nums[right]/2. As right advances, nums[right] grows, so nums[right]/2 grows, so left only moves FORWARD — a classic two-pointer sliding window.",
      "Within the window I want max(nums[right] XOR nums[i]) over i in the window. That is the bitwise-trie max-XOR query again: store window elements as 30-bit (here 20-bit) paths and greedily choose opposite bits. But unlike the offline version, the window SHRINKS from the left too, so the trie needs DELETE as well as insert. I add a count at each trie node; inserting increments counts along the path, deleting decrements them, and the greedy walk only follows children whose count is still positive.",
      "So: sort; for each right, insert nums[right] into the trie; advance left while nums[left] < nums[right]/2 (i.e. 2*nums[left] < nums[right]) removing nums[left] from the trie; then query the trie for max XOR with nums[right] and update the global answer. Each element is inserted once and removed at most once, each op O(B) bits, the query O(B), plus the sort: O(n log n + n·B). Values up to 2^20 mean B ≈ 20 bits. The realisation that sorting turns the strong-pair test into a forward-only window — which a count-augmented bitwise trie supports with insert/delete — is the whole solution.",
    ],
    approaches: [
      {
        name: "Sort, slide a window of valid partners, query a count-augmented bitwise trie per element (optimal)",
        intuition: "Sorting turns |x−y| ≤ min into x ≥ y/2 for the larger y, making partners a forward-only window; a bitwise trie with per-node counts supports the needed insert/delete and answers max-XOR greedily.",
        time: "O(n (log n + B))",
        timeWhy: "Sorting is O(n log n); each element is inserted and removed once and queried once, each O(B) over the ~20 bits.",
        space: "O(n · B)",
        spaceWhy: "The bitwise trie stores up to B nodes per element currently in the window.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[2];
        int[] count = new int[2];           // how many numbers pass through each child
    }

    private static final int BITS = 20;     // values < 2^20

    public int maximumStrongPairXor(int[] nums) {
        Arrays.sort(nums);
        TrieNode root = new TrieNode();
        int left = 0, best = 0;
        for (int right = 0; right < nums.length; right++) {
            insert(root, nums[right], 1);                 // add the new larger value
            while ((long) 2 * nums[left] < nums[right]) {  // shrink: nums[left] no longer a valid partner
                insert(root, nums[left], -1);
                left++;
            }
            best = Math.max(best, queryMax(root, nums[right]));
        }
        return best;
    }

    private void insert(TrieNode root, int num, int delta) {
        TrieNode cur = root;
        for (int b = BITS; b >= 0; b--) {
            int bit = (num >> b) & 1;
            if (cur.child[bit] == null) cur.child[bit] = new TrieNode();
            cur.count[bit] += delta;        // maintain live counts for deletion support
            cur = cur.child[bit];
        }
    }

    private int queryMax(TrieNode root, int x) {
        TrieNode cur = root;
        int result = 0;
        for (int b = BITS; b >= 0; b--) {
            int bit = (x >> b) & 1;
            int want = 1 - bit;
            if (cur.child[want] != null && cur.count[want] > 0) {  // opposite bit still present
                result |= (1 << b);
                cur = cur.child[want];
            } else {
                cur = cur.child[bit];
            }
        }
        return result;
    }
}`,
        walkthrough: [
          "nums=[1,2,3,4,5]. right at 4: window must satisfy 2*nums[left] >= 4, so left points at 2,3,4 in the trie.",
          "queryMax(4) over {2,3,4}: greedy opposite bits give 3 XOR 4 = 7.",
          "No later pair beats 7, so best = 7.",
        ],
      },
    ],
    edgeCases: [
      "A single element → only the pair (x, x) is valid, XOR is 0.",
      "Picking the same element twice → allowed; it is always in the window, contributing 0.",
      "Widely separated values → the window keeps only nearby (within a factor of two) elements, excluding far-apart pairs.",
    ],
    twists: [
      "**Maximum Strong Pair XOR I** (LeetCode 2932) → tiny limits permit a brute-force O(n²) check instead of the trie.",
      "**Maximum XOR With an Element From Array** (LeetCode 1707) → an offline-by-bound variant of the bitwise-trie max-XOR.",
      "**Maximum XOR of Two Numbers in an Array** (LeetCode 421) → unconstrained max XOR with a plain insert-only bitwise trie.",
    ],
    related: ["maximum-xor-with-an-element-from-array", "maximum-xor-of-two-numbers-in-an-array", "implement-trie-prefix-tree"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "determine-if-two-events-have-conflict",
    title: "Determine if Two Events Have Conflict",
    difficulty: "Easy",
    pattern: "intervals",
    leetcode: 2446,
    statement:
      "You are given two events `event1 = [startTime1, endTime1]` and `event2 = [startTime2, endTime2]`, each a pair of \"HH:MM\" strings on the same day with start ≤ end (inclusive on both ends). Two events CONFLICT if they share any moment in common. Return true if the two events conflict.",
    examples: [
      { in: 'event1 = ["01:15","02:00"], event2 = ["02:00","03:00"]', out: "true", note: "they touch at 02:00, and the ends are inclusive, so they conflict" },
      { in: 'event1 = ["01:00","02:00"], event2 = ["01:20","03:00"]', out: "true", note: "02:00 vs 01:20 overlap in the middle" },
      { in: 'event1 = ["10:00","11:00"], event2 = ["14:00","15:00"]', out: "false", note: "entirely disjoint times" },
    ],
    constraints: ['each event is a pair of valid "HH:MM" strings', "startTime ≤ endTime within each event", "all times are on the same day"],
    recognize:
      "Decide whether two inclusive intervals overlap → the universal overlap test is `start1 ≤ end2 AND start2 ≤ end1`; compare the time strings directly (lexicographic comparison of zero-padded HH:MM equals chronological order). Two-interval overlap predicate is the signature.",
    figureItOut: [
      "Two intervals overlap unless one ends strictly before the other begins. It is easier to characterise NON-overlap: event1 is entirely before event2 (end1 < start2) OR event2 is entirely before event1 (end2 < start1). Anything else is a conflict.",
      "Negating that gives the clean positive test: they conflict iff NOT(end1 < start2 OR end2 < start1), which by De Morgan is end1 >= start2 AND end2 >= start1. Equivalently start1 <= end2 AND start2 <= end1 — the standard inclusive-interval overlap predicate. Because the ends are inclusive, I use >= / <= (touching at a single instant counts as a conflict).",
      "I do not even need to convert HH:MM to minutes. The strings are zero-padded to a fixed width 'HH:MM', so LEXICOGRAPHIC string comparison matches chronological order — '02:00' > '01:15' as strings exactly when it is later in time. So I can compare the raw strings with String.compareTo.",
      "The test is a couple of constant-time comparisons, O(1) time and space. The only subtlety is the inclusivity: shared endpoints (event ending at 02:00 and another starting at 02:00) DO conflict, which the <= / >= comparisons capture. Converting to minutes is an equally valid, perhaps clearer, alternative.",
    ],
    approaches: [
      {
        name: "Inclusive overlap predicate on the time strings: start1 ≤ end2 AND start2 ≤ end1 (optimal)",
        intuition: "Two inclusive intervals overlap exactly when neither ends before the other starts; zero-padded HH:MM strings compare chronologically, so compare them directly.",
        time: "O(1)",
        timeWhy: "A fixed number of constant-length string comparisons.",
        space: "O(1)",
        spaceWhy: "No extra storage beyond the inputs.",
        code: `class Solution {
    public boolean haveConflict(String[] event1, String[] event2) {
        // overlap iff event1 starts no later than event2 ends AND vice versa
        return event1[0].compareTo(event2[1]) <= 0
            && event2[0].compareTo(event1[1]) <= 0;
    }
}`,
        walkthrough: [
          'event1=["01:15","02:00"], event2=["02:00","03:00"]. event1[0] "01:15" <= event2[1] "03:00" -> true.',
          'event2[0] "02:00" <= event1[1] "02:00" -> true (equal counts, ends are inclusive).',
          "Both conditions hold -> they conflict -> true.",
        ],
      },
    ],
    edgeCases: [
      "Events touching at exactly one instant (end == start) → conflict, because endpoints are inclusive.",
      "One event entirely inside the other → conflict, the predicate still holds.",
      "Completely disjoint events → one of the two comparisons fails, returns false.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → repeatedly apply the overlap test while sorting and merging many intervals.",
      "**Meeting Rooms** (LeetCode 252) → check that NO pair among many intervals conflicts.",
      "**Convert to minutes** → parse HH:MM to integer minutes for an arithmetic comparison instead of string order.",
    ],
    related: ["merge-intervals", "meeting-rooms", "interval-list-intersections"],
  },

  {
    slug: "maximum-population-year",
    title: "Maximum Population Year",
    difficulty: "Easy",
    pattern: "intervals",
    leetcode: 1854,
    statement:
      "You are given a 2D array `logs` where `logs[i] = [birth_i, death_i]` indicates the birth and death years of the i-th person. The population in year y is the number of people alive during year y; a person is counted alive for every year in the HALF-OPEN range [birth, death) — i.e. they are alive in their birth year through the year BEFORE their death year. Return the EARLIEST year with the maximum population.",
    examples: [
      { in: "logs = [[1993,1999],[2000,2010]]", out: "1993", note: "years 1993..1998 have population 1, as do 2000..2009; the earliest maximal year is 1993" },
      { in: "logs = [[1950,1961],[1960,1971],[1970,1981]]", out: "1960", note: "1960 is shared by the first two people, giving population 2, the earliest maximum" },
    ],
    constraints: ["1 ≤ logs.length ≤ 100", "1950 ≤ birth_i < death_i ≤ 2050"],
    recognize:
      "Find the year of maximum simultaneous coverage over half-open year intervals in a small fixed range → a **difference array (line sweep)** indexed by year: +1 at each birth, −1 at each death, prefix-sum it, and take the earliest year achieving the running maximum. Difference-array sweep over a bounded timeline is the signature.",
    figureItOut: [
      "Each person contributes +1 to the population for the years [birth, death). I want the single year with the highest total population, earliest one winning. The year range is tiny and fixed (1950..2050), so I can work directly on a per-YEAR array rather than reasoning about overlaps abstractly.",
      "A difference array makes overlapping-coverage counting clean. I keep delta indexed by year. For each person I do delta[birth] += 1 (they start being alive) and delta[death] -= 1 (they stop being alive AT their death year, because the range is half-open [birth, death) — they are NOT counted in the death year). The −1 lands exactly on death, not death + 1, precisely because the interval excludes the death year.",
      "Then I PREFIX-SUM delta across years: the running sum at year y is the population in year y. As I sweep years in increasing order I track the maximum population and the first year that reaches it. Because I scan ascending and only update the best year on a STRICT improvement, ties resolve to the EARLIEST year automatically.",
      "Offsetting years by 1950 keeps the array small (about 101 entries), or I can just index 1950..2050 directly. Laying down marks is O(n), the sweep is O(range) = O(101), so O(n + range) time and O(range) space. The half-open detail (death excluded) is the only place to be careful: the decrement sits ON the death year, unlike the inclusive-interval version where it would sit one past the end.",
    ],
    approaches: [
      {
        name: "Difference array over years (+1 at birth, −1 at death), prefix-sum, take the earliest max year (optimal)",
        intuition: "Mark each person with +1 at birth and -1 at death (death excluded), prefix-sum to get yearly population, and return the first year hitting the maximum.",
        time: "O(n + Y)",
        timeWhy: "Laying marks is O(n); the prefix-sum sweep is O(Y) over the bounded year range.",
        space: "O(Y)",
        spaceWhy: "The difference array spans the fixed 1950..2050 range.",
        code: `class Solution {
    public int maximumPopulation(int[][] logs) {
        int[] delta = new int[2051];          // index by year directly, 1950..2050
        for (int[] log : logs) {
            delta[log[0]] += 1;               // born: population rises this year
            delta[log[1]] -= 1;               // died: drops AT the death year (half-open)
        }
        int population = 0, maxPopulation = 0, bestYear = 1950;
        for (int year = 1950; year <= 2050; year++) {
            population += delta[year];        // running population in this year
            if (population > maxPopulation) { // strict beat keeps the earliest such year
                maxPopulation = population;
                bestYear = year;
            }
        }
        return bestYear;
    }
}`,
        walkthrough: [
          "logs=[[1950,1961],[1960,1971],[1970,1981]]. Marks: +1 at 1950,1960,1970; -1 at 1961,1971,1981.",
          "Sweep: 1950 pop 1 (best 1950), 1960 pop 2 (2 > 1 -> best 1960), 1961 pop 1, 1970 pop 2 (not strictly greater -> best stays 1960).",
          "Earliest year of max population 2 is 1960.",
        ],
      },
    ],
    edgeCases: [
      "Two people sharing one overlap year → that year reaches population 2; the earliest such year wins.",
      "All disjoint lifespans → population is 1 everywhere covered; the earliest birth year is returned.",
      "Death year excluded → a person born in 1993 dying in 1999 is alive 1993..1998, not 1999.",
    ],
    twists: [
      "**Points That Intersect With Cars** (LeetCode 2848) → the inclusive-interval version where the decrement sits at end + 1.",
      "**Car Pooling** (LeetCode 1094) → the same sweep tracking passenger capacity rather than population.",
      "**Number of Flowers in Full Bloom** (LeetCode 2251) → coverage queries answered by sorting boundaries when the range is large.",
    ],
    related: ["points-that-intersect-with-cars", "car-pooling", "number-of-flowers-in-full-bloom"],
  },
];
