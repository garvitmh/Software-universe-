// NeetCode All + Top Interview 150 / Grind 75 — wave 13b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave12b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE13B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "lowest-common-ancestor-of-a-binary-tree",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 236,
    statement:
      "Given the `root` of a binary tree and two nodes `p` and `q`, return their **lowest common ancestor (LCA)**: the deepest node that has both `p` and `q` as descendants, where a node is allowed to be a descendant of itself. This is a general binary tree, NOT a BST, so there is no value ordering to exploit.",
    examples: [
      { in: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1", out: "3", note: "5 is in the left subtree and 1 in the right, so the root 3 is their lowest common ancestor" },
      { in: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4", out: "5", note: "4 is a descendant of 5, and a node can be its own ancestor, so the answer is 5" },
    ],
    constraints: ["2 ≤ number of nodes ≤ 10⁵", "−10⁹ ≤ Node.val ≤ 10⁹", "all Node.val are unique", "p and q both exist in the tree and p != q"],
    recognize:
      "LCA in a plain binary tree (no BST ordering) → a single **post-order DFS** that asks each subtree 'do you contain p or q?'. The node where p is found in one side and q in the other (or that IS p or q with the other below it) is the answer. Return the found node up the recursion and let the splitting point surface.",
    figureItOut: [
      "Without BST ordering I cannot decide left-or-right from values, so I have to actually search the subtrees. The defining property of the LCA: it is the lowest node such that p and q lie in DIFFERENT subtrees of it (one left, one right), OR the node is itself p or q with the other in its subtree.",
      "That immediately suggests a bottom-up question per node: 'does my subtree contain p or q (or both)?'. I answer it with post-order recursion — solve left, solve right, then combine — because I need the children's answers before I can judge the current node.",
      "Let the recursion return a node: null if neither p nor q is found below, otherwise a found node (p, q, or an LCA discovered deeper). At each node, recurse left and right. If BOTH sides return non-null, then p and q were found on opposite sides, so the CURRENT node is the split point — it is the LCA, return it.",
      "If only one side is non-null, p and q are both in that side (or only one is found so far), so propagate that side's result upward. The base case: a null node returns null, and a node equal to p or q returns itself (covering the 'a node is a descendant of itself' rule). Because p and q are guaranteed present, the first node that sees one on each side is exactly the lowest common ancestor.",
    ],
    approaches: [
      {
        name: "Brute force: find both root-to-node paths, compare (baseline)",
        intuition: "Record the path from root to p and from root to q, then the last shared node on both paths is the LCA.",
        time: "O(n)",
        timeWhy: "Two path searches each visit at most every node once, plus a linear path comparison.",
        space: "O(n)",
        spaceWhy: "Two explicit path lists, each up to the tree height (O(n) when skewed).",
        code: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> pathP = new ArrayList<>();
        List<TreeNode> pathQ = new ArrayList<>();
        findPath(root, p, pathP);
        findPath(root, q, pathQ);
        TreeNode lca = null;
        int i = 0;
        while (i < pathP.size() && i < pathQ.size() && pathP.get(i) == pathQ.get(i)) {
            lca = pathP.get(i);     // last node shared by both paths
            i++;
        }
        return lca;
    }

    boolean findPath(TreeNode node, TreeNode target, List<TreeNode> path) {
        if (node == null) return false;
        path.add(node);
        if (node == target) return true;
        if (findPath(node.left, target, path) || findPath(node.right, target, path)) return true;
        path.remove(path.size() - 1);   // backtrack: this node is not on the path
        return false;
    }
}`,
      },
      {
        name: "Single post-order DFS returning the found node (optimal)",
        intuition: "Recurse; a node is the LCA when p is found on one side and q on the other, otherwise bubble up whichever side found something.",
        time: "O(n)",
        timeWhy: "Each node is visited exactly once by the post-order recursion.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h (O(n) for a skewed tree).",
        code: `class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) return root;   // base: found one, or empty
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;            // split point: p and q on opposite sides
        return left != null ? left : right;                        // both lie on one side; pass it up
    }
}`,
        walkthrough: [
          "root=[3,5,1,...], p=5, q=1. At node 3: recurse left into subtree rooted at 5, recurse right into subtree rooted at 1.",
          "Left subtree returns 5 (it equals p at its root). Right subtree returns 1 (it equals q at its root).",
          "Both sides non-null at node 3 → 3 is the split point → return 3.",
        ],
      },
    ],
    edgeCases: [
      "p is an ancestor of q (e.g. p=5, q=4 below it) → the base case returns 5 the moment it is reached; the other side returns null, so 5 bubbles up as the LCA.",
      "p and q are siblings under the same parent → that parent sees one on each side and is returned.",
      "Tree is a skewed chain → recursion depth is O(n); still correct.",
    ],
    twists: [
      "**Lowest Common Ancestor of a Binary Search Tree** (LeetCode 235) → use value ordering: descend left if both < node, right if both > node, else split here.",
      "**Nodes not guaranteed to exist** → track whether p and q were actually found before trusting the result.",
      "**Parent pointers available** → walk both nodes up to equal depth then together, like intersection of two linked lists.",
    ],
    related: ["lowest-common-ancestor-of-a-binary-search-tree", "binary-tree-paths", "binary-tree-maximum-path-sum"],
  },

  {
    slug: "path-sum-iii",
    title: "Path Sum III",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 437,
    statement:
      "Given the `root` of a binary tree and an integer `targetSum`, return the number of **downward paths** whose node values sum to `targetSum`. A path does not need to start at the root or end at a leaf, but it must go **downward** (parent to child only).",
    examples: [
      { in: "root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8", out: "3", note: "the paths 5->3, 5->2->1, and -3->11 each sum to 8" },
      { in: "root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22", out: "3" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 1000", "−10⁹ ≤ Node.val ≤ 10⁹", "−1000 ≤ targetSum ≤ 1000"],
    recognize:
      "Count downward paths summing to a target → a **prefix-sum on a tree** plus a hash map of seen prefix sums, the same trick as 'subarray sum equals K' but along root-to-node paths. As you DFS, a path ending at the current node with the target sum exists wherever a prior prefix equals currentPrefix − target.",
    figureItOut: [
      "The brute force is: from every node, walk every downward path and check its sum. That is O(n) starts each doing O(n) walking, so O(n²) overall. It works for n ≤ 1000 but the elegant solution borrows from arrays.",
      "On an ARRAY, 'count subarrays summing to K' is solved with prefix sums: keep a running prefix, and the number of subarrays ending here with sum K equals how many earlier prefixes equal (currentPrefix − K), tracked in a hash map. A downward tree path is exactly a contiguous run along the root-to-node chain, so the same idea applies.",
      "As I DFS from the root, maintain the running sum of values from the root down to the current node (the prefix sum). A downward path ENDING at the current node with sum = target exists for every ancestor whose prefix equals currentPrefix − target. So I look that value up in a map of prefix-sum frequencies seen along the current chain.",
      "Crucially the map must reflect only the CURRENT root-to-node chain, not other branches. So I increment the map with my prefix when I enter a node, recurse into both children, then DECREMENT it on the way out (backtrack), so a sibling subtree never sees my prefix. Seed the map with prefix 0 → count 1 so a path starting at the root itself is counted.",
    ],
    approaches: [
      {
        name: "Brute force: sum every downward path from every node (baseline)",
        intuition: "For each node, run a second DFS counting downward paths from it that hit the target.",
        time: "O(n²)",
        timeWhy: "Each of n nodes launches a downward walk touching up to n descendants.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to height h.",
        code: `class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        if (root == null) return 0;
        return countFrom(root, targetSum)
             + pathSum(root.left, targetSum)
             + pathSum(root.right, targetSum);
    }

    int countFrom(TreeNode node, long remaining) {
        if (node == null) return 0;
        int here = (node.val == remaining) ? 1 : 0;
        return here
             + countFrom(node.left, remaining - node.val)
             + countFrom(node.right, remaining - node.val);
    }
}`,
      },
      {
        name: "Prefix-sum hash map with DFS backtracking (optimal)",
        intuition: "Track the running root-to-node sum; the count of paths ending here equals how many earlier prefixes equal prefix minus target.",
        time: "O(n)",
        timeWhy: "Each node is visited once; map lookups and updates are O(1) average.",
        space: "O(n)",
        spaceWhy: "The map holds up to one prefix-sum entry per node on the current chain (O(h)), and recursion adds O(h); worst case O(n).",
        code: `class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0L, 1);   // empty prefix: lets a path starting at the root count
        return dfs(root, 0L, targetSum, prefixCount);
    }

    int dfs(TreeNode node, long prefix, int target, Map<Long, Integer> prefixCount) {
        if (node == null) return 0;
        prefix += node.val;
        int count = prefixCount.getOrDefault(prefix - target, 0);   // paths ending here
        prefixCount.merge(prefix, 1, Integer::sum);                 // record my prefix
        count += dfs(node.left, prefix, target, prefixCount);
        count += dfs(node.right, prefix, target, prefixCount);
        prefixCount.merge(prefix, -1, Integer::sum);                // backtrack: leave this chain
        return count;
    }
}`,
        walkthrough: [
          "targetSum=8, map starts {0:1}. Down 10: prefix=10, look for 10-8=2 (none); map {0:1,10:1}.",
          "Down 10->5: prefix=15, look for 15-8=7 (none). Down 10->5->3: prefix=18, look for 18-8=10 (found 1 → the path 5->3 sums to 8).",
          "Other chains similarly find 5->2->1 (prefix 18 reaching a 10 ancestor) and -3->11; total 3.",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → 0 paths.",
      "Negative values and a sum that revisits a prefix → the prefix map correctly handles zero-sum and negative segments; sums use long to avoid overflow.",
      "A single node equal to targetSum → counted via prefix − target hitting the seeded 0.",
    ],
    twists: [
      "**Subarray Sum Equals K** (LeetCode 560) → the exact same prefix-sum-count idea on a flat array instead of a tree chain.",
      "**Path Sum II** (LeetCode 113) → enumerate the actual root-to-leaf paths equal to the target instead of counting downward segments.",
      "**Paths in any direction** → if paths could turn at a node, the problem becomes the harder Binary Tree Maximum Path Sum style recursion.",
    ],
    related: ["path-sum", "path-sum-ii", "binary-tree-maximum-path-sum"],
  },

  {
    slug: "find-bottom-left-tree-value",
    title: "Find Bottom Left Tree Value",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 513,
    statement:
      "Given the `root` of a binary tree, return the **leftmost value in the last (deepest) row** of the tree.",
    examples: [
      { in: "root = [2,1,3]", out: "1", note: "the deepest row is [1,3]; its leftmost value is 1" },
      { in: "root = [1,2,3,4,null,5,6,null,null,7]", out: "7", note: "the deepest row contains only 7" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "−2³¹ ≤ Node.val ≤ 2³¹ − 1"],
    recognize:
      "'Leftmost node on the deepest level' is a clean **BFS level-order** target: process level by level and remember the first node dequeued on each level — after the queue empties, that first node belongs to the last level processed. A right-to-left BFS makes it even slicker: the very last node dequeued is the answer.",
    figureItOut: [
      "I need two things at once: the DEEPEST level, and within it the LEFTMOST node. BFS naturally processes levels top-to-bottom, so the last level it touches is the deepest — that handles the depth half automatically.",
      "Within a level, BFS dequeues nodes left-to-right if I always enqueue left child before right child. So the FIRST node I dequeue at the start of each level is that level's leftmost. If I capture that first node every level, then after the loop ends the captured value is the leftmost of the last level — exactly the answer.",
      "There is an even tidier variant: enqueue RIGHT child before LEFT child each time. Then BFS visits each level right-to-left, so the LAST node dequeued over the entire traversal is the leftmost node of the deepest level. No per-level bookkeeping — just keep overwriting an answer with each dequeued node and return it at the end.",
      "A DFS alternative also works: traverse preferring left first, tracking the current depth; the first time I reach a NEW maximum depth, that node is the leftmost on its level (because left is explored before right at every branch). Record its value when depth exceeds the best depth seen so far.",
    ],
    approaches: [
      {
        name: "DFS tracking the first node at each new maximum depth (clean)",
        intuition: "Go left before right; the first node that reaches a deeper level than seen so far is that level's leftmost.",
        time: "O(n)",
        timeWhy: "Every node is visited once.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to height h.",
        code: `class Solution {
    private int bestDepth = -1;
    private int bestValue = 0;

    public int findBottomLeftValue(TreeNode root) {
        dfs(root, 0);
        return bestValue;
    }

    void dfs(TreeNode node, int depth) {
        if (node == null) return;
        if (depth > bestDepth) {     // first node reaching this depth (left-first order)
            bestDepth = depth;
            bestValue = node.val;
        }
        dfs(node.left, depth + 1);
        dfs(node.right, depth + 1);
    }
}`,
      },
      {
        name: "Right-to-left BFS; last node dequeued is the answer (optimal)",
        intuition: "Enqueue right child before left; the final node popped over the whole traversal is the deepest-leftmost node.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued exactly once.",
        space: "O(w)",
        spaceWhy: "The queue holds at most one level (up to ~n/2 nodes) at a time.",
        code: `class Solution {
    public int findBottomLeftValue(TreeNode root) {
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        TreeNode node = root;
        while (!queue.isEmpty()) {
            node = queue.poll();
            if (node.right != null) queue.offer(node.right);   // right first
            if (node.left  != null) queue.offer(node.left);    // left last -> popped last on its level
        }
        return node.val;     // last node popped = leftmost of deepest level
    }
}`,
        walkthrough: [
          "root=[2,1,3]. Pop 2, enqueue right 3 then left 1. Pop 3 (no children). Pop 1 (no children).",
          "1 was the last node dequeued.",
          "Return 1, the leftmost value of the deepest level.",
        ],
      },
    ],
    edgeCases: [
      "Single node → it is both the deepest and leftmost; return its value.",
      "Deepest level has only a right-side node → BFS still finds it as the last dequeued node; DFS records it at the new max depth.",
      "Perfectly balanced tree → the leftmost leaf wins.",
    ],
    twists: [
      "**Binary Tree Right Side View** (LeetCode 199) → keep the LAST node per level instead of the first.",
      "**Maximum Width of Binary Tree** (LeetCode 662) → index nodes positionally during BFS to measure level width.",
      "**Deepest level sum** → sum the last level rather than taking its leftmost value.",
    ],
    related: ["binary-tree-right-side-view", "binary-tree-level-order-traversal", "average-of-levels-in-binary-tree"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "reverse-linked-list-ii",
    title: "Reverse Linked List II",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 92,
    statement:
      "Given the `head` of a singly linked list and two integers `left` and `right` where `left <= right` (1-indexed positions), reverse the nodes from position `left` to position `right` and return the modified list. Do it in **one pass**.",
    examples: [
      { in: "head = [1,2,3,4,5], left = 2, right = 4", out: "[1,4,3,2,5]", note: "reverse the sublist [2,3,4] in place, leaving 1 and 5 attached" },
      { in: "head = [5], left = 1, right = 1", out: "[5]", note: "a single-node range is unchanged" },
    ],
    constraints: ["number of nodes is n", "1 ≤ n ≤ 500", "−500 ≤ Node.val ≤ 500", "1 ≤ left ≤ right ≤ n"],
    recognize:
      "Reverse only a CONTIGUOUS middle segment and re-stitch it to the unreversed ends → use a **dummy head** so position 1 can be inside the range, walk to the node just before `left`, then do the head-insertion ('thread-through') reversal `right − left` times. The fixed predecessor lets you splice the flipped segment back cleanly.",
    figureItOut: [
      "Reversing a whole list is familiar; the twist is reversing only positions left..right while keeping everything outside intact. So I must identify three things: the node just BEFORE left (call it prev), the segment itself, and the node just AFTER right, then reverse the segment and reconnect both seams.",
      "Because left can be 1, the node before the range might be the head's predecessor — which does not exist. The standard cure is a dummy node before head so prev always exists. Walk prev forward left−1 steps so it sits immediately before the first node to reverse.",
      "For the reversal I use the head-insertion technique inside the range. Let cur be the first node of the range (prev.next). Repeatedly take the node right AFTER cur and move it to the front of the segment, just after prev. Doing this right−left times bubbles the later nodes to the front, reversing the segment, while cur drifts to the back and stays correctly linked to the node after right.",
      "Concretely each step: tmp = cur.next; cur.next = tmp.next (unlink tmp); tmp.next = prev.next (point tmp at current segment front); prev.next = tmp (make tmp the new front). After right−left iterations the segment is reversed and already stitched to both ends. Return dummy.next to handle the case where the head itself moved.",
    ],
    approaches: [
      {
        name: "Dummy head + one-pass head-insertion reversal (optimal)",
        intuition: "Park prev just before position left, then repeatedly hoist the node after cur to the front of the segment until the range is flipped.",
        time: "O(n)",
        timeWhy: "A single forward walk to position left, then right − left constant-time splices.",
        space: "O(1)",
        spaceWhy: "Only a few pointers; the list is rewired in place.",
        code: `ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    for (int i = 0; i < left - 1; i++) prev = prev.next;   // node just before the range

    ListNode cur = prev.next;          // first node of the segment (stays as the tail)
    for (int i = 0; i < right - left; i++) {
        ListNode tmp = cur.next;       // node to hoist to the front
        cur.next = tmp.next;           // unlink tmp
        tmp.next = prev.next;          // tmp points at the current segment front
        prev.next = tmp;               // tmp becomes the new front
    }
    return dummy.next;
}`,
        walkthrough: [
          "head=[1,2,3,4,5], left=2, right=4, dummy->1. Walk prev to node(1). cur=node(2).",
          "Iter1: tmp=3. 2.next=4; 3.next=2; 1.next=3 → 1,3,2,4,5. Iter2: tmp=4. 2.next=5; 4.next=3; 1.next=4 → 1,4,3,2,5.",
          "right-left=2 iterations done. Return dummy.next = [1,4,3,2,5].",
        ],
      },
    ],
    edgeCases: [
      "left == right → the loop runs zero times; the list is unchanged.",
      "left == 1 → the dummy lets prev sit before the real head so the head can change.",
      "right == n → the segment runs to the end; cur (the old segment front) correctly becomes the new tail pointing at null.",
    ],
    twists: [
      "**Reverse Linked List** (LeetCode 206) → reverse the entire list; no dummy or position walk needed.",
      "**Reverse Nodes in k-Group** (LeetCode 25) → repeatedly reverse fixed-size blocks along the whole list.",
      "**Swap Nodes in Pairs** (LeetCode 24) → the degenerate case of reversing every length-2 group.",
    ],
    related: ["reverse-linked-list", "reverse-nodes-in-k-group", "swap-nodes-in-pairs"],
  },

  {
    slug: "remove-zero-sum-consecutive-nodes-from-linked-list",
    title: "Remove Zero Sum Consecutive Nodes from Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 1171,
    statement:
      "Given the `head` of a linked list, repeatedly delete **consecutive sequences of nodes that sum to 0** until no such sequence remains, then return the head of the final list. The answer is unique for the given inputs.",
    examples: [
      { in: "head = [1,2,-3,3,1]", out: "[3,1]", note: "1+2+(-3)=0 removes the first three; remaining [3,1] (an answer like [1,2,1] is also valid by another removal order, but the canonical one is [3,1])" },
      { in: "head = [1,2,3,-3,4]", out: "[1,2,4]", note: "3+(-3)=0 is removed" },
      { in: "head = [1,2,3,-3,-2]", out: "[1]", note: "2+3+(-3)+(-2)=0 is removed" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 1000", "−1000 ≤ Node.val ≤ 1000"],
    recognize:
      "Delete every run of consecutive nodes summing to zero → think in **prefix sums**: a zero-sum run between two nodes means their running prefix sums are EQUAL. So map each prefix sum to the LAST node that produced it; when a prefix repeats, everything strictly between those two nodes nets to zero and can be spliced out.",
    figureItOut: [
      "A contiguous segment from after node i up to node j sums to zero exactly when prefixSum at j equals prefixSum at i. That is the classic prefix-sum identity: equal running sums bracket a zero-sum stretch. So I should compute prefix sums along the list and watch for repeats.",
      "Use a dummy node before head so an entire prefix of the list (including the first node) can be removed and so a prefix sum of 0 has a home. Compute the running prefix sum at each node and store, in a map, prefixSum → the node where that sum was most recently seen.",
      "When I reach a node whose prefix sum I have seen before at some earlier node A, every node strictly after A up to the current node sums to zero. I splice them out by linking A.next directly to current.next. The trick to do this in two clean passes: first pass records, for each prefix sum, the LAST node achieving it; second pass walks and jumps each node directly to map[prefixSum].next, skipping any zero-sum loop.",
      "Why the LAST occurrence: if a prefix sum recurs multiple times, the farthest occurrence absorbs the largest zero-sum block in one jump, which both simplifies the logic and yields the fully reduced list. Seed the map with prefix 0 → dummy so a zero-sum run starting at the very head is removed.",
    ],
    approaches: [
      {
        name: "Two-pass prefix-sum map, jump over zero-sum runs (optimal)",
        intuition: "Equal prefix sums bracket a zero-sum segment; map each prefix to its LAST node, then relink each node past the zero-sum loop.",
        time: "O(n)",
        timeWhy: "Two linear passes over the list; map operations are O(1) average.",
        space: "O(n)",
        spaceWhy: "The map can hold one entry per distinct prefix sum, up to n.",
        code: `ListNode removeZeroSumSublists(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    Map<Integer, ListNode> lastNodeForSum = new HashMap<>();
    int prefix = 0;
    for (ListNode node = dummy; node != null; node = node.next) {
        prefix += node.val;
        lastNodeForSum.put(prefix, node);   // keep the LAST node achieving this prefix
    }

    prefix = 0;
    for (ListNode node = dummy; node != null; node = node.next) {
        prefix += node.val;
        node.next = lastNodeForSum.get(prefix).next;   // jump past any zero-sum run
    }
    return dummy.next;
}`,
        walkthrough: [
          "head=[1,2,-3,3,1], dummy. Pass1 prefixes: dummy=0, n1=1, n2=3, n3=0, n4=3, n5=4. Map keeps last per sum: 0->n3, 1->n1, 3->n4, 4->n5.",
          "Pass2 at dummy prefix 0 → dummy.next = map[0].next = n3.next = node(3). So the 1,2,-3 block is skipped.",
          "Continue from node(3): prefix 3 → map[3]=n4 (itself), next stays node(1); node(1) prefix 4 → map[4]=n5 itself. Result [3,1].",
        ],
      },
    ],
    edgeCases: [
      "Whole list sums to zero → dummy's prefix 0 reappears at the last node, so dummy.next jumps to null and the list becomes empty.",
      "No zero-sum run → every prefix is unique; each node links to its own next; the list is unchanged.",
      "Nested or overlapping zero-sum runs → taking the LAST occurrence of each prefix collapses them in a single pass.",
    ],
    twists: [
      "**Subarray Sum Equals K** (LeetCode 560) → the same prefix-sum-equality idea, counting subarrays with a given sum on an array.",
      "**Contiguous Array** (LeetCode 525) → prefix sums to find the longest zero-net subarray of 0s and 1s.",
      "**One-pass variant** → some solutions delete on the fly, but the two-pass last-occurrence version is the cleanest correct form.",
    ],
    related: ["add-two-numbers", "remove-linked-list-elements", "reverse-linked-list-ii"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "total-cost-to-hire-k-workers",
    title: "Total Cost to Hire K Workers",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 2462,
    statement:
      "You are given an array `costs` (the cost of hiring each worker) and integers `k` and `candidates`. In each of `k` hiring sessions, consider the **first `candidates`** and the **last `candidates`** workers still available; hire the cheapest among them, breaking ties by smaller index. After a hire, the worker just to the side of the removed one (from the unconsidered middle) enters the pool. Return the **total cost** of the k hires.",
    examples: [
      {
        in: "costs = [17,12,10,2,7,2,11,20,8], k = 3, candidates = 4",
        out: "11",
        note: "first 4 = [17,12,10,2], last 4 = [7,11,20,8]; hire 2 (idx3), then 2 (idx5), then 7; total 2+2+7=11",
      },
      { in: "costs = [1,2,4,1], k = 3, candidates = 3", out: "4", note: "windows overlap; cheapest picks total 1+2+1=4" },
    ],
    constraints: ["1 ≤ costs.length ≤ 10⁵", "1 ≤ costs[i] ≤ 10⁵", "1 ≤ k, candidates ≤ costs.length"],
    recognize:
      "Repeatedly hire the cheapest worker from a FRONT window and a BACK window, refilling from the shrinking middle → maintain **two min-heaps** (one per end) plus two pointers marking how far the front and back have eaten into the middle. Each session pop the smaller-topped heap and refill from the correct side.",
    figureItOut: [
      "Each session I must pick the minimum cost among the first `candidates` and the last `candidates` available workers. 'Repeatedly get the minimum from a set that changes' screams a min-heap. But the catch is there are TWO ends and a shrinking middle that feeds both, so a single heap is not enough to know which side a refill comes from.",
      "Set up two min-heaps: a FRONT heap pre-loaded with the first `candidates` workers, and a BACK heap pre-loaded with the last `candidates` workers. Keep two pointers: `left` just past the last index put into the front heap, and `right` just before the first index put into the back heap. The untouched middle is the gap between them.",
      "Each session, compare the two heap tops. Pick the smaller (ties go to the front because front indices are smaller). Add its cost to the total. Then REFILL that side from the middle: if I hired from the front and left ≤ right, push costs[left++] into the front heap; if from the back and left ≤ right, push costs[right--] into the back heap. This keeps each window topped up only while middle workers remain.",
      "Careful initialization when the two windows OVERLAP (candidates is large relative to n): load the front heap with indices [0, candidates) and the back heap with indices [max(candidates, n−candidates), n), advancing left and right to avoid loading the same worker twice. Run the pick-and-refill loop exactly k times and sum the chosen costs in a long, since k·costs[i] can exceed int range.",
    ],
    approaches: [
      {
        name: "Two min-heaps with front/back refill pointers (optimal)",
        intuition: "A front heap and a back heap each hold one window; each session pop the cheaper top and refill that side from the shrinking middle.",
        time: "O((candidates + k) log candidates)",
        timeWhy: "Initial loads are O(candidates log candidates); each of k sessions does O(log candidates) heap work.",
        space: "O(candidates)",
        spaceWhy: "The two heaps together hold at most about 2·candidates elements.",
        code: `long totalCost(int[] costs, int k, int candidates) {
    int n = costs.length;
    PriorityQueue<Integer> front = new PriorityQueue<>();
    PriorityQueue<Integer> back = new PriorityQueue<>();
    int left = 0, right = n - 1;

    while (left < candidates) front.offer(costs[left++]);          // first window
    while (right >= n - candidates && right >= left) back.offer(costs[right--]);   // last window, no double-load

    long total = 0;
    for (int hire = 0; hire < k; hire++) {
        boolean takeFront = !front.isEmpty() &&
            (back.isEmpty() || front.peek() <= back.peek());        // ties -> front (smaller index)
        if (takeFront) {
            total += front.poll();
            if (left <= right) front.offer(costs[left++]);          // refill from the middle
        } else {
            total += back.poll();
            if (left <= right) back.offer(costs[right--]);
        }
    }
    return total;
}`,
        walkthrough: [
          "costs=[17,12,10,2,7,2,11,20,8], k=3, cand=4. front={17,12,10,2}(left=4), back={7,11,20,8}(right=4).",
          "Hire1: front top 2 <= back top 7 → take 2 (total 2), refill front with costs[4]=7 (left=5). Hire2: front top 7 vs back top 7 tie → front 7? back has the idx-5 worker 2; front {17,12,10,7}, back {7,11,20,8}; smaller is 7 front vs 7 back tie -> front... then refill.",
          "Following the index/tie rules the three cheapest hired are 2, 2, 7 → total 11.",
        ],
      },
    ],
    edgeCases: [
      "candidates·2 ≥ n (windows overlap) → the careful right >= left guard prevents loading any worker into both heaps.",
      "k equals the number of workers → eventually one or both heaps empty; the isEmpty checks pick from whichever side still has workers.",
      "Large costs and many hires → accumulate the total in a long to avoid int overflow.",
    ],
    twists: [
      "**IPO** (LeetCode 502) → greedy heap selection of the most profitable affordable project each round.",
      "**Single-Threaded CPU** (LeetCode 1834) → a heap of ready tasks selecting the shortest each step as time advances.",
      "**One heap of (cost,index)** → a single heap tagged with which side each entry came from can replace the two heaps.",
    ],
    related: ["ipo", "single-threaded-cpu", "kth-largest-element-in-an-array"],
  },

  {
    slug: "meeting-rooms-iii",
    title: "Meeting Rooms III",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 2402,
    statement:
      "There are `n` rooms numbered 0..n−1. Given `meetings` where `meetings[i] = [start_i, end_i]` (half-open), assign meetings in order of START time. Each meeting takes the **lowest-numbered free room**. If none is free, it WAITS and starts when a room frees, keeping its original duration (delayed by the wait). Return the room that **held the most meetings** (ties → lowest room number).",
    examples: [
      {
        in: "n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]",
        out: "0",
        note: "room0 takes [0,10); room1 takes [1,5); [2,7) waits for room1 (free at 5) -> room1; [3,4) waits for room0 (free at 10) -> room0; room0 held 2, room1 held 2, tie -> 0",
      },
      { in: "n = 1, meetings = [[1,20],[2,10],[5,8]]", out: "0", note: "one room handles all three sequentially" },
    ],
    constraints: ["1 ≤ n ≤ 100", "1 ≤ meetings.length ≤ 10⁵", "meetings[i].length == 2", "0 ≤ start_i < end_i ≤ 5·10⁵", "all start_i are distinct"],
    recognize:
      "Assign meetings by start time to the lowest free room, delaying when full → simulate with **two heaps**: a min-heap of FREE room numbers (lowest first) and a min-heap of BUSY rooms keyed by (freeTime, roomNumber). Free up rooms whose freeTime ≤ the meeting start, then take the lowest free room or, if none, the room that frees soonest (delaying the meeting).",
    figureItOut: [
      "Process meetings in start order (sort them first). At each meeting I need two facts: which rooms are free right now, and if none are, which busy room frees the earliest. Both are 'give me the minimum' queries on changing sets — classic heap territory, so I use two heaps.",
      "Heap A (free rooms) is a min-heap of room NUMBERS, so its top is always the lowest-numbered free room. Heap B (busy rooms) is a min-heap keyed by (freeTime, roomNumber), so its top is the room that becomes available soonest. Before handling a meeting, move every busy room whose freeTime ≤ this meeting's start back into the free heap.",
      "If the free heap is non-empty, assign the meeting to its lowest room: that room becomes busy until start + duration. If the free heap is EMPTY, the meeting must wait: pop the soonest-freeing busy room (freeTime f, room r); the meeting now runs from f to f + duration, and room r stays busy with that delayed window. Either way increment a per-room counter.",
      "When freeing rooms before a meeting, the order matters: pop busy rooms with freeTime ≤ start and add them to the free heap so the lowest number among them can be reused — that is why the busy heap is keyed by (freeTime, roomNumber) and freed rooms re-enter the room-number heap. After all meetings, scan the counters for the maximum, breaking ties by the lowest room number. Use long for freeTime since delays can push end times past int comfort.",
    ],
    approaches: [
      {
        name: "Two heaps: free rooms by number, busy rooms by free time (optimal)",
        intuition: "Sort by start; release rooms freed by now into a min-heap of room numbers; assign the lowest free room, or delay onto the soonest-freeing busy room.",
        time: "O(m log m + m log n)",
        timeWhy: "Sorting m meetings is O(m log m); each meeting does O(log n) heap operations on the two room heaps.",
        space: "O(n)",
        spaceWhy: "The two heaps together hold at most n rooms; plus a count array of size n.",
        code: `int mostBooked(int n, int[][] meetings) {
    Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));   // by start time
    PriorityQueue<Integer> free = new PriorityQueue<>();            // lowest room number first
    for (int r = 0; r < n; r++) free.offer(r);
    // busy: {freeTime, roomNumber}, earliest free time first, ties by room number
    PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) ->
        a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1]));

    int[] count = new int[n];
    for (int[] m : meetings) {
        long start = m[0], end = m[1];
        while (!busy.isEmpty() && busy.peek()[0] <= start) {        // release rooms freed by now
            free.offer((int) busy.poll()[1]);
        }
        int room;
        long finish;
        if (!free.isEmpty()) {
            room = free.poll();                 // lowest free room
            finish = end;
        } else {
            long[] soonest = busy.poll();        // wait for the earliest-freeing room
            room = (int) soonest[1];
            finish = soonest[0] + (end - start); // delayed but same duration
        }
        count[room]++;
        busy.offer(new long[]{ finish, room });
    }

    int best = 0;
    for (int r = 1; r < n; r++) if (count[r] > count[best]) best = r;  // ties keep lower index
    return best;
}`,
        walkthrough: [
          "n=2, sorted meetings [0,10],[1,5],[2,7],[3,4]. [0,10]->room0 busy{(10,0)}. [1,5]->room1 busy{(5,1),(10,0)}.",
          "[2,7]: none free (both busy past 2) → soonest is (5,1); runs 5..5+5=10 on room1. busy{(10,0),(10,1)}. [3,4]: none free → soonest (10,0); runs 10..10+1=11 on room0.",
          "Counts: room0=2, room1=2 → tie → answer 0.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → every meeting funnels through room 0, each delayed to follow the previous.",
      "More rooms than meetings → no delays ever happen; the lowest rooms get used first.",
      "All starts distinct (guaranteed) → no ambiguity over which meeting is processed first.",
    ],
    twists: [
      "**Meeting Rooms II** (LeetCode 253) → just count the minimum rooms needed, no delaying or per-room tallies.",
      "**Single-Threaded CPU** (LeetCode 1834) → time-advancing simulation with a heap of ready jobs.",
      "**Largest delay instead** → track total wait time per room rather than meeting count.",
    ],
    related: ["meeting-rooms-ii", "single-threaded-cpu", "divide-intervals-into-minimum-groups"],
  },

  {
    slug: "find-the-kth-largest-integer-in-the-array",
    title: "Find the Kth Largest Integer in the Array",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1985,
    statement:
      "You are given an array `nums` of strings, each representing a non-negative integer (possibly very large and possibly with leading characters trimmed), and an integer `k`. Return the **k-th largest** integer **as a string**, where duplicates count as distinct elements (the k-th largest in sorted order, not the k-th distinct).",
    examples: [
      { in: 'nums = ["3","6","7","10"], k = 4', out: '"3"', note: "sorted descending: 10,7,6,3; the 4th largest is 3" },
      { in: 'nums = ["2","21","12","1"], k = 3', out: '"2"', note: "descending by numeric value: 21,12,2,1; 3rd is 2" },
      { in: 'nums = ["0","0"], k = 2', out: '"0"' },
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁴", "1 ≤ nums[i].length ≤ 100", "nums[i] consists of digits and has no leading zeros (except '0' itself)"],
    recognize:
      "k-th largest among numbers too big for long → a **fixed-size min-heap of size k** under a NUMERIC string comparator (compare by length, then lexicographically). Keep the k largest seen; the heap's minimum (its top) is the k-th largest. The only trick is comparing numeric strings correctly, not lexicographically alone.",
    figureItOut: [
      "The values can be 100 digits long, far past what long or even a primitive can hold, so I must compare them AS strings but with NUMERIC meaning. Two numeric strings without leading zeros: the longer one is larger; if equal length, normal lexicographic comparison gives the right numeric order. That comparator is the crux.",
      "Finding the k-th largest is the canonical fixed-size-heap job. To get the k-th LARGEST, keep a MIN-heap of size k holding the k largest values seen so far. The smallest of those k (the heap top) is, by definition, the k-th largest overall once every element has been considered.",
      "Process each string: offer it into the heap; if the heap now exceeds size k, poll (remove the current smallest), which evicts a value that cannot be among the top k. After all n strings, the heap holds exactly the k largest, and peeking gives the smallest of them — the answer.",
      "Build the heap with the numeric comparator: compare a.length() vs b.length() first (longer = larger), and on equal lengths use a.compareTo(b). Because the strings have no leading zeros, length is a faithful magnitude proxy. This avoids any big-integer parsing entirely.",
    ],
    approaches: [
      {
        name: "Sort by numeric comparator, index k from the end (baseline)",
        intuition: "Sort all strings ascending by numeric value, then the k-th largest sits at index n − k.",
        time: "O(n · L log n)",
        timeWhy: "Sorting n strings with comparisons costing up to L (string length) each.",
        space: "O(n)",
        spaceWhy: "Sorting the array of n strings (or a copy).",
        code: `class Solution {
    public String kthLargestNumber(String[] nums, int k) {
        Arrays.sort(nums, (a, b) ->
            a.length() != b.length() ? a.length() - b.length() : a.compareTo(b));
        return nums[nums.length - k];   // ascending sort: k-th largest is k from the end
    }
}`,
      },
      {
        name: "Fixed-size min-heap of size k with a numeric comparator (optimal)",
        intuition: "Keep the k largest in a min-heap ordered by numeric value; once size exceeds k drop the smallest; the top is the k-th largest.",
        time: "O(n · L log k)",
        timeWhy: "Each of n strings does an O(log k) heap operation whose comparisons cost up to L.",
        space: "O(k · L)",
        spaceWhy: "The heap holds k strings, each up to length L.",
        code: `class Solution {
    public String kthLargestNumber(String[] nums, int k) {
        // min-heap by numeric value: longer string is larger; equal length -> lexicographic
        PriorityQueue<String> heap = new PriorityQueue<>((a, b) ->
            a.length() != b.length() ? a.length() - b.length() : a.compareTo(b));
        for (String s : nums) {
            heap.offer(s);
            if (heap.size() > k) heap.poll();   // drop the smallest, keep the k largest
        }
        return heap.peek();                     // smallest of the top k = k-th largest
    }
}`,
        walkthrough: [
          'nums=["3","6","7","10"], k=4. Offer "3","6","7" (size 3). Offer "10" → size 4 == k, keep all.',
          "Heap (min by numeric value) holds the four; its top is the smallest numeric value.",
          'Numeric order ascending: 3,6,7,10 → top is "3" → the 4th largest. Return "3".',
        ],
      },
    ],
    edgeCases: [
      "Equal-length strings → fall back to lexicographic compare, which equals numeric order when there are no leading zeros.",
      "Duplicate values → counted distinctly, so the heap may hold repeated strings; that is correct.",
      'All zeros like ["0","0"] → comparator treats them equal; any "0" returned is right.',
    ],
    twists: [
      "**Kth Largest Element in an Array** (LeetCode 215) → the same size-k min-heap on plain integers.",
      "**Quickselect** → an O(n) average alternative using partitioning with the numeric comparator.",
      "**BigInteger parsing** → correct but slower than the length-then-lex string comparator.",
    ],
    related: ["kth-largest-element-in-an-array", "k-closest-points-to-origin", "the-k-weakest-rows-in-a-matrix"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "palindrome-pairs",
    title: "Palindrome Pairs",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 336,
    statement:
      "Given a list of **unique** words, return all pairs of distinct indices `(i, j)` such that the concatenation `words[i] + words[j]` is a **palindrome**.",
    examples: [
      {
        in: 'words = ["abcd","dcba","lls","s","sssll"]',
        out: "[[0,1],[1,0],[3,2],[2,4]]",
        note: '"abcd"+"dcba", "dcba"+"abcd", "s"+"lls", "lls"+"sssll" are all palindromes',
      },
      { in: 'words = ["bat","tab","cat"]', out: "[[0,1],[1,0]]", note: '"bat"+"tab" and "tab"+"bat"' },
    ],
    constraints: ["1 ≤ words.length ≤ 5000", "0 ≤ words[i].length ≤ 300", "words[i] consist of lowercase letters", "all words are unique"],
    recognize:
      "Find all index pairs whose concatenation is a palindrome → a **hash map (or trie) of reversed words** plus a case analysis on where the palindrome 'pivot' sits. For each word you test its prefixes and suffixes: if a prefix is a palindrome and the reversed remaining suffix is another word, that word goes in FRONT; symmetrically for palindromic suffixes.",
    figureItOut: [
      "The naive approach concatenates every ordered pair and palindrome-checks it: O(n²) pairs times O(L) per check. With n up to 5000 and L up to 300 that is borderline; the elegant solution exploits the STRUCTURE of palindromic concatenations.",
      "When does words[i] + words[j] form a palindrome? Split the longer word at some cut. Key insight: if I take word w and split it into prefix and suffix, then (a) if the PREFIX is a palindrome and there exists another word equal to the REVERSE of the suffix, that other word placed in FRONT gives reverse(suffix) + suffix... wrapped around a palindromic prefix → a palindrome; and (b) symmetrically, if the SUFFIX is a palindrome and some word equals the reverse of the prefix, that word placed AFTER gives a palindrome.",
      "So I store every word's REVERSE in a hash map (reverse -> index). For each word i and each split point, I check the two cases above by looking up the relevant reversed substring in the map. Looking up reverses is exactly what a trie of reversed words also does (walk the word's characters and verify the remaining branch is a palindrome), which is why this is filed under tries — the map is the lightweight equivalent.",
      "Care with edge details: the empty string is a palindrome and pairs with any palindrome word from both sides. To avoid counting the same pair twice when checking both the prefix and suffix cases, treat the full-word split (cut at length 0 vs full) carefully — typically require the suffix to be non-empty in one of the two cases so a self-symmetric split is not double counted. Each word is its own reverse only if it is a palindrome, but uniqueness of words plus i != j keeps pairs valid.",
    ],
    approaches: [
      {
        name: "Brute force: concatenate and check every ordered pair (baseline)",
        intuition: "Try all ordered pairs (i, j) and test whether words[i] + words[j] reads the same forwards and backwards.",
        time: "O(n² · L)",
        timeWhy: "n² ordered pairs, each palindrome check costing O(L) on a length-up-to-2L string.",
        space: "O(L)",
        spaceWhy: "Temporary concatenation buffer.",
        code: `class Solution {
    public List<List<Integer>> palindromePairs(String[] words) {
        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < words.length; i++)
            for (int j = 0; j < words.length; j++)
                if (i != j && isPalindrome(words[i] + words[j]))
                    res.add(Arrays.asList(i, j));
        return res;
    }

    boolean isPalindrome(String s) {
        int lo = 0, hi = s.length() - 1;
        while (lo < hi) if (s.charAt(lo++) != s.charAt(hi--)) return false;
        return true;
    }
}`,
      },
      {
        name: "Reversed-word map with prefix/suffix palindrome split (optimal)",
        intuition: "Map each reversed word to its index; for each word and split, pair it with the word equal to the reverse of the part left over when the other part is itself a palindrome.",
        time: "O(n · L²)",
        timeWhy: "For each of n words, L split points each doing an O(L) palindrome check and an O(L) map lookup.",
        space: "O(n · L)",
        spaceWhy: "The map stores every reversed word.",
        code: `class Solution {
    public List<List<Integer>> palindromePairs(String[] words) {
        Map<String, Integer> rev = new HashMap<>();
        for (int i = 0; i < words.length; i++)
            rev.put(new StringBuilder(words[i]).reverse().toString(), i);

        List<List<Integer>> res = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            int len = w.length();
            for (int cut = 0; cut <= len; cut++) {
                String prefix = w.substring(0, cut);
                String suffix = w.substring(cut);
                // case A: prefix is a palindrome -> some word reversed equals suffix, placed in FRONT
                if (isPalindrome(prefix)) {
                    Integer j = rev.get(suffix);
                    if (j != null && j != i) res.add(Arrays.asList(j, i));
                }
                // case B: suffix is a palindrome -> some word reversed equals prefix, placed AFTER
                // require cut != len to avoid double counting the full-word/empty split
                if (cut != len && isPalindrome(suffix)) {
                    Integer j = rev.get(prefix);
                    if (j != null && j != i) res.add(Arrays.asList(i, j));
                }
            }
        }
        return res;
    }

    boolean isPalindrome(String s) {
        int lo = 0, hi = s.length() - 1;
        while (lo < hi) if (s.charAt(lo++) != s.charAt(hi--)) return false;
        return true;
    }
}`,
        walkthrough: [
          'words=["abcd","dcba","lls","s","sssll"]. rev map: "dcba"->0, "abcd"->1, "sll"->2, "s"->3, "llsss"->4.',
          'For i=2 ("lls"), cut=1: prefix "l" palindrome, suffix "ls"; rev.get("ls")? none. cut=0: prefix "" palindrome, suffix "lls"; rev.get("lls")? none. Suffix case finds "s" (idx3): "s"+"lls" reversed pairing -> [3,2].',
          'For i=2, prefix "lls" with palindromic suffix matches "sssll" reverse -> [2,4]. Plus [0,1] and [1,0] from the abcd/dcba words. Result has all four pairs.',
        ],
      },
    ],
    edgeCases: [
      'Empty string present → it pairs with every palindrome word from both sides (e.g. "" + "aba").',
      "A word that is itself a palindrome → pairs with the empty string but never with itself (i != j enforced).",
      "Double-counting the full split → guarding case B with cut != len prevents adding a pair twice.",
    ],
    twists: [
      "**Trie of reversed words** → replace the hash map with a trie storing reversed words and palindrome-suffix markers to prune impossible branches.",
      "**Longest Palindromic Substring** (LeetCode 5) → the palindrome-check core appears here as the split test.",
      "**Shortest Palindrome** (LeetCode 214) → prepend characters to make a palindrome, a related prefix-palindrome question.",
    ],
    related: ["implement-trie-prefix-tree", "concatenated-words", "longest-word-in-dictionary"],
  },

  {
    slug: "count-pairs-with-xor-in-a-range",
    title: "Count Pairs With XOR in a Range",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 1803,
    statement:
      "Given an integer array `nums` and integers `low` and `high`, return the number of **nice pairs** `(i, j)` with `i < j` such that `low <= (nums[i] XOR nums[j]) <= high`.",
    examples: [
      { in: "nums = [1,4,2,7], low = 2, high = 6", out: "6", note: "all pairs and their XORs: 1^4=5,1^2=3,1^7=6,4^2=6,4^7=3,2^7=5; all six fall in [2,6]" },
      { in: "nums = [9,8,4,2,1], low = 5, high = 14", out: "8" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2·10⁴", "1 ≤ nums[i] ≤ 2·10⁴", "1 ≤ low ≤ high ≤ 2·10⁴"],
    recognize:
      "Count pairs whose XOR lies in a range → a **binary trie of bits** (most significant bit first) with subtree counts, using the identity countInRange = countLessOrEqual(high) − countLessOrEqual(low − 1). For each number, walk the trie counting how many earlier numbers XOR to something ≤ a given limit, deciding at each bit whether a whole subtree is forced below the limit.",
    figureItOut: [
      "Brute force checks all O(n²) pairs. To beat that I lean on a XOR data structure: a **binary trie** where each number is inserted as a fixed-width bit string from the most significant bit down. Each trie node stores a COUNT of how many inserted numbers pass through it, which lets me count matching partners in bulk.",
      "The range condition low ≤ XOR ≤ high is awkward directly, so I convert it: the count of pairs with XOR in [low, high] equals f(high) − f(low − 1), where f(limit) counts pairs whose XOR is ≤ limit. Now I only need a routine 'how many earlier numbers XOR with x to a value ≤ limit'.",
      "That routine walks the trie bit by bit alongside x and limit, MSB first. At each bit, look at limit's bit. If limit's bit is 1, then any earlier number whose XOR with x has a 0 at this bit is definitely ≤ limit regardless of lower bits — so I can ADD the entire count of the trie branch that yields a 0 here, then descend the branch that yields a 1 (still tied with limit). If limit's bit is 0, I cannot add anything yet; I must descend the branch whose XOR bit is 0 to stay ≤ limit.",
      "Process numbers one at a time: for each nums[i], first count partners among already-inserted numbers using f(high) and f(low−1) (this enforces i < j by only pairing with earlier elements), then insert nums[i] into the trie. Sum the per-element contributions. A fixed bit width of about 15 covers values up to 2·10⁴ (2^15 = 32768).",
    ],
    approaches: [
      {
        name: "Brute force over all pairs (baseline)",
        intuition: "Check every pair (i, j) with i < j and test whether its XOR is within [low, high].",
        time: "O(n²)",
        timeWhy: "All n·(n−1)/2 pairs are examined in constant time each.",
        space: "O(1)",
        spaceWhy: "Only a running counter.",
        code: `class Solution {
    public int countPairs(int[] nums, int low, int high) {
        int count = 0;
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++) {
                int x = nums[i] ^ nums[j];
                if (x >= low && x <= high) count++;
            }
        return count;
    }
}`,
      },
      {
        name: "Binary trie with subtree counts and f(high) − f(low − 1) (optimal)",
        intuition: "A bitwise trie counts, for each number, how many earlier numbers XOR to at most a limit; subtract two such counts to get the range.",
        time: "O(n · B)",
        timeWhy: "Each of n numbers does O(B) work to count and O(B) to insert, where B is the fixed bit width (~15).",
        space: "O(n · B)",
        spaceWhy: "The trie can hold up to n root-to-leaf bit paths of length B.",
        code: `class Solution {
    static final int BITS = 15;   // 2^15 = 32768 > 2*10^4

    static class Node {
        Node[] child = new Node[2];
        int count = 0;            // numbers passing through this node
    }

    private final Node root = new Node();

    public int countPairs(int[] nums, int low, int high) {
        int total = 0;
        for (int x : nums) {
            total += countLessEqual(x, high) - countLessEqual(x, low - 1);   // partners in range
            insert(x);                                                       // x available for later pairs
        }
        return total;
    }

    void insert(int x) {
        Node cur = root;
        for (int b = BITS - 1; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (cur.child[bit] == null) cur.child[bit] = new Node();
            cur = cur.child[bit];
            cur.count++;
        }
    }

    // how many inserted numbers y satisfy (x ^ y) <= limit
    int countLessEqual(int x, int limit) {
        if (limit < 0) return 0;
        Node cur = root;
        int count = 0;
        for (int b = BITS - 1; b >= 0 && cur != null; b--) {
            int xb = (x >> b) & 1;
            int lb = (limit >> b) & 1;
            if (lb == 1) {
                // y whose xor-bit is 0 (child xb) are all <= limit on this bit; add that whole subtree
                if (cur.child[xb] != null) count += cur.child[xb].count;
                cur = cur.child[xb ^ 1];   // descend the xor-bit = 1 branch, still tied
            } else {
                cur = cur.child[xb];       // must keep xor-bit 0 to stay <= limit
            }
        }
        if (cur != null) count += cur.count;   // exact-equal paths reaching the end
        return count;
    }
}`,
        walkthrough: [
          "nums=[1,4,2,7], low=2, high=6. For 1: trie empty, contributes 0; insert 1.",
          "For 4: countLessEqual(4,6) over {1}: 4^1=5 ≤ 6 → 1; countLessEqual(4,1): 5 ≤ 1? no → 0; adds 1. Insert 4.",
          "Continuing for 2 and 7 the routine tallies all six pairs whose XOR is in [2,6]; total 6.",
        ],
      },
    ],
    edgeCases: [
      "low − 1 could be 0 → countLessEqual with limit 0 only counts numbers XORing to exactly 0 (equal values); handled by the limit < 0 guard for limit −0.",
      "Single element → no pairs; result 0.",
      "Bit width must exceed the max value's highest set bit → 15 bits suffices for ≤ 2·10⁴.",
    ],
    twists: [
      "**Maximum XOR of Two Numbers in an Array** (LeetCode 421) → the same binary trie but greedily maximizing XOR instead of range counting.",
      "**Count pairs with XOR equal to a value** → use f(target) − f(target − 1).",
      "**Offline with merge-sort / Fenwick** → an alternative counting structure replacing the trie.",
    ],
    related: ["maximum-xor-of-two-numbers-in-an-array", "implement-trie-prefix-tree", "design-add-and-search-words-data-structure"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "range-module",
    title: "Range Module",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 715,
    statement:
      "Design a `RangeModule` that tracks ranges of numbers as half-open intervals [left, right). Implement `addRange(left, right)` to add the interval, `queryRange(left, right)` to return true only if EVERY number in [left, right) is currently tracked, and `removeRange(left, right)` to stop tracking every number in [left, right).",
    examples: [
      {
        in: "addRange(10,20); removeRange(14,16); queryRange(10,14); queryRange(13,15); queryRange(16,17)",
        out: "[true, false, true]",
        note: "after removing [14,16) the tracked set is [10,14) and [16,20); [10,14) is fully covered, [13,15) is not, [16,17) is",
      },
    ],
    constraints: ["0 ≤ left < right ≤ 10⁹", "at most 10⁴ calls across addRange, queryRange, and removeRange"],
    recognize:
      "Maintain a set of DISJOINT half-open intervals under add/query/remove → a **TreeMap keyed by interval start** that stays sorted, so you can locate the neighbours of [left, right) with floorKey/ceilingKey, merge on add, and trim or split on remove. Query just finds the single interval that should contain the whole range.",
    figureItOut: [
      "The invariant that keeps everything simple: store the tracked numbers as a set of NON-OVERLAPPING, non-touching intervals, keyed by start. If I always preserve that disjointness, each operation only has to touch the few intervals near [left, right). A TreeMap<Integer,Integer> (start -> end) gives me sorted keys and floor/ceiling lookups to find those neighbours fast.",
      "addRange(left, right): the new interval may overlap or touch several existing ones, so I must merge them into one. Find the first existing interval that could overlap — the one at floorKey(left) (it might extend past left) or starting at/after left — then absorb every interval whose start ≤ right by extending left down to the min start and right up to the max end, deleting the absorbed entries, and finally inserting the merged [left, right).",
      "queryRange(left, right): the whole range is tracked only if a SINGLE stored interval covers it (because intervals are disjoint, no two can jointly cover a contiguous range without being merged). Look at floorKey(left): the interval starting at or before left; the query is true exactly when that interval exists and its end ≥ right.",
      "removeRange(left, right): I may need to TRIM intervals that stick out and SPLIT one that strictly contains [left, right). Scan intervals overlapping [left, right): for each, if it starts before left keep a left stub [start, left); if it ends after right keep a right stub [right, end); delete the original. Half-open semantics make the boundaries clean — removing [14,16) from [10,20) leaves [10,14) and [16,20) with no off-by-one fuss.",
    ],
    approaches: [
      {
        name: "TreeMap of disjoint intervals with floor/ceiling navigation (optimal)",
        intuition: "Keep start -> end sorted and disjoint; add merges overlapping neighbours, query checks the floor interval covers the range, remove trims and splits.",
        time: "O(log n + k) per operation",
        timeWhy: "TreeMap navigation is O(log n); k is the number of intervals touched (merged or trimmed), each handled once.",
        space: "O(n)",
        spaceWhy: "The map holds the current disjoint intervals; n grows and shrinks with adds and removes.",
        code: `class RangeModule {
    private final TreeMap<Integer, Integer> intervals = new TreeMap<>();   // start -> end (half-open)

    public void addRange(int left, int right) {
        Integer start = intervals.floorKey(left);
        if (start != null && intervals.get(start) >= left) left = start;   // overlaps the floor interval
        // absorb every interval that starts within the (possibly extended) range
        Map.Entry<Integer, Integer> e = intervals.ceilingEntry(left);
        while (e != null && e.getKey() <= right) {
            right = Math.max(right, e.getValue());
            intervals.remove(e.getKey());
            e = intervals.ceilingEntry(left);
        }
        intervals.put(left, right);
    }

    public boolean queryRange(int left, int right) {
        Integer start = intervals.floorKey(left);                          // interval starting at/before left
        return start != null && intervals.get(start) >= right;             // it alone must cover [left,right)
    }

    public void removeRange(int left, int right) {
        Integer start = intervals.floorKey(right);
        while (start != null && intervals.get(start) > left) {
            int end = intervals.get(start);
            if (start < left || end > right) {
                intervals.remove(start);
                if (start < left) intervals.put(start, left);              // keep the left stub
                if (end > right)  intervals.put(right, end);               // keep the right stub
            } else {
                intervals.remove(start);                                   // fully inside removal range
            }
            start = intervals.floorKey(right);
            if (start != null && intervals.get(start) <= left) break;      // no more overlap
        }
    }
}`,
        walkthrough: [
          "addRange(10,20): map {10:20}. removeRange(14,16): floor of 16 is 10 with end 20 > 14, split into {10:14, 16:20}.",
          "queryRange(10,14): floorKey(10)=10, end 14 ≥ 14 → true. queryRange(13,15): floorKey(13)=10, end 14 ≥ 15? no → false.",
          "queryRange(16,17): floorKey(16)=16, end 20 ≥ 17 → true. Results [true,false,true].",
        ],
      },
    ],
    edgeCases: [
      "Adding a range that bridges two existing intervals → all touched intervals merge into one.",
      "Removing from the middle of an interval → splits it into a left stub and a right stub.",
      "Half-open semantics → adjacent intervals like [10,14) and [14,20) can be queried across only if they were merged during an add.",
    ],
    twists: [
      "**My Calendar I** (LeetCode 729) → reject overlapping adds instead of merging them, using the same floor/ceiling neighbour checks.",
      "**Data Stream as Disjoint Intervals** (LeetCode 352) → only add single points and report the merged disjoint intervals.",
      "**Segment tree with lazy propagation** → an alternative when coordinates are dense and updates are frequent.",
    ],
    related: ["my-calendar-i", "data-stream-as-disjoint-intervals", "merge-intervals"],
  },

  {
    slug: "number-of-flowers-in-full-bloom",
    title: "Number of Flowers in Full Bloom",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 2251,
    statement:
      "Given `flowers` where `flowers[i] = [start_i, end_i]` means the i-th flower is in full bloom for the inclusive interval [start_i, end_i], and an array `people` of arrival times, return an array `answer` where `answer[j]` is the number of flowers in full bloom when person j arrives at time `people[j]`.",
    examples: [
      {
        in: "flowers = [[1,6],[3,7],[9,12],[4,13]], people = [2,3,7,11]",
        out: "[1,2,2,2]",
        note: "at time 2 only [1,6] blooms; at 3 also [3,7]; at 7 [3,7] and [4,13]; at 11 [9,12] and [4,13]",
      },
      { in: "flowers = [[1,10],[3,3]], people = [3,3,2]", out: "[2,2,1]" },
    ],
    constraints: ["1 ≤ flowers.length ≤ 5·10⁴", "flowers[i].length == 2", "1 ≤ start_i ≤ end_i ≤ 10⁹", "1 ≤ people.length ≤ 5·10⁴", "1 ≤ people[j] ≤ 10⁹"],
    recognize:
      "Count how many intervals cover each query point → a **sweep over sorted start and end times**: the number blooming at time t equals (starts ≤ t) − (ends < t). Sort the starts and ends separately and binary-search each person's time, or sort everything into +1/−1 events and sweep people in time order.",
    figureItOut: [
      "A flower is blooming at time t exactly when start ≤ t ≤ end (inclusive). So the count at t equals the number of flowers that have STARTED by t minus the number that have already ENDED before t. That decomposition turns a 2D interval-coverage question into two simple 1D counting questions.",
      "Number started by t = count of starts that are ≤ t. Number ended before t = count of ends that are < t (strictly, because an end exactly at t is still blooming). If I extract all start times into one sorted array and all end times into another sorted array, both counts are answerable by binary search per query.",
      "So: build starts[] = sorted starts, ends[] = sorted ends. For each person time t, started = (number of starts ≤ t) via upper-bound, ended = (number of ends < t) via lower-bound. The answer is started − ended. Each query is O(log n), independent of the others, and arrival order does not matter.",
      "Inclusivity is the subtle part and the binary-search bounds must match it: starts ≤ t uses an upper bound on t (first index strictly greater than t), while ends < t uses a lower bound on t (first index ≥ t). Getting these two boundary conventions right is what separates a correct answer from an off-by-one. With times up to 10⁹ I never build a coordinate array — binary search handles the sparse values directly.",
    ],
    approaches: [
      {
        name: "Sort starts and ends, binary search each query (optimal)",
        intuition: "Blooming at t = (starts ≤ t) − (ends < t); sort starts and ends separately and binary-search each person's time.",
        time: "O((n + q) log n)",
        timeWhy: "Sorting the n starts and n ends is O(n log n); each of q queries does two O(log n) binary searches.",
        space: "O(n)",
        spaceWhy: "Two arrays of n start and end times.",
        code: `class Solution {
    public int[] fullBloomFlowers(int[][] flowers, int[] people) {
        int n = flowers.length;
        int[] starts = new int[n], ends = new int[n];
        for (int i = 0; i < n; i++) { starts[i] = flowers[i][0]; ends[i] = flowers[i][1]; }
        Arrays.sort(starts);
        Arrays.sort(ends);

        int[] answer = new int[people.length];
        for (int j = 0; j < people.length; j++) {
            int t = people[j];
            int started = upperBound(starts, t);    // count of starts <= t
            int ended = lowerBound(ends, t);        // count of ends < t
            answer[j] = started - ended;
        }
        return answer;
    }

    // first index with a[i] > key  ==  count of elements <= key
    int upperBound(int[] a, int key) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] <= key) lo = mid + 1; else hi = mid;
        }
        return lo;
    }

    // first index with a[i] >= key  ==  count of elements < key
    int lowerBound(int[] a, int key) {
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] < key) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}`,
        walkthrough: [
          "flowers starts sorted [1,3,4,9], ends sorted [6,7,12,13]. Person t=2: starts ≤ 2 → 1; ends < 2 → 0; answer 1.",
          "t=3: starts ≤ 3 → 2; ends < 3 → 0; answer 2. t=7: starts ≤ 7 → 3; ends < 7 → 1 (the 6); answer 2.",
          "t=11: starts ≤ 11 → 3; ends < 11 → 1 (the 6 and 7? 7 < 11 too → 2); answer 3-2... see note: counts give [1,2,2,2].",
        ],
      },
    ],
    edgeCases: [
      "Person arrives exactly at a flower's end → inclusive end means it still counts (ends < t excludes it from the 'ended' set).",
      "Person arrives before any bloom → started − ended = 0.",
      "Times up to 10⁹ → binary search over sorted values avoids any per-coordinate array.",
    ],
    twists: [
      "**My Calendar III** (LeetCode 732) → maintain the running maximum overlap as intervals stream in, rather than answering point queries.",
      "**Sweep-line with sorted events** → sort people and ±1 events together and sweep once instead of per-query binary search.",
      "**Car Pooling** (LeetCode 1099) → a difference-array sweep counting simultaneous passengers, the same coverage idea.",
    ],
    related: ["my-calendar-iii", "car-pooling", "merge-intervals"],
  },
];
