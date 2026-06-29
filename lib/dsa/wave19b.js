// NeetCode All + Top Interview 150 / LeetCode 75 / Grind 75 — wave 19b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave18b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE19B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "maximum-difference-between-node-and-ancestor",
    title: "Maximum Difference Between Node and Ancestor",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1026,
    statement:
      "Given the `root` of a binary tree, find the MAXIMUM value `v` for which there exist DIFFERENT nodes `a` and `b` where `a` is an ANCESTOR of `b` and `v = |a.val - b.val|`. A node `a` is an ancestor of `b` if either `a` is the parent of `b` or `a` is an ancestor of `b`'s parent.",
    examples: [
      { in: "root = [8,3,10,1,6,null,14,null,null,4,7,13]", out: "7", note: "|8 - 1| = 7 is the largest ancestor-descendant difference" },
      { in: "root = [1,null,2,null,0,3]", out: "3", note: "|3 - 0| and |3 - 0|... the path 1->2->0->3 yields max |3 - 0| = 3" },
    ],
    constraints: ["the number of nodes is in [2, 5000]", "0 ≤ Node.val ≤ 10⁵"],
    recognize:
      "Maximum |ancestor - descendant| over every ancestor-descendant pair → as you DFS down each root-to-node path, the extreme difference involving the CURRENT node and ANY ancestor is bounded by the running MIN and MAX seen on the path so far. Carry (min, max) of the ancestors down the recursion and compare each node against them. Path-min/max threaded through DFS is the signature.",
    figureItOut: [
      "An ancestor of a node is any node strictly above it on its root-to-node path. For a fixed node b, the largest |a.val - b.val| over all ancestors a is achieved by the ancestor that is either the SMALLEST or the LARGEST value on the path above b — extremes maximise the absolute difference. So I never need to consider every ancestor individually; I only need the min and max ancestor value on the current path.",
      "That suggests a DFS that carries the minimum and maximum value seen ALONG THE PATH from the root down to (but not necessarily including) the current node. At each node I can compute |node.val - curMin| and |node.val - curMax| — these are the best differences this node can form with anything above it.",
      "But rather than treating the current node specially as 'descendant', it is cleaner to update curMin/curMax to include the current node and just track the SPREAD (max - min) of the whole path. Because for any path, the largest ancestor-descendant difference is exactly (max on path) - (min on path): the deeper of the two extremes is a descendant of the shallower, and on a root-to-leaf chain every node is an ancestor or descendant of every other. So at each leaf the answer contribution is simply curMax - curMin.",
      "So I recurse carrying curMin and curMax updated by the current node's value. At a leaf (or actually at every node, but the extreme is captured at the deepest point) I update a global best with curMax - curMin. Each node is visited once, O(n) time, and the recursion stack is O(h). The key realisation: I do not need pairs at all — threading the running min and max of the path down the tree turns a pair problem into a single subtraction per path.",
    ],
    approaches: [
      {
        name: "DFS threading the path min and max, take the largest spread (optimal)",
        intuition: "The biggest ancestor-descendant difference on any path is (path max) - (path min); carry both down the DFS and update them with each node, recording the spread.",
        time: "O(n)",
        timeWhy: "Each node is visited once with constant work.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h.",
        code: `class Solution {
    private int best = 0;

    public int maxAncestorDiff(TreeNode root) {
        dfs(root, root.val, root.val);   // seed min and max with the root value
        return best;
    }

    private void dfs(TreeNode node, int curMin, int curMax) {
        if (node == null) return;
        curMin = Math.min(curMin, node.val);   // extend the path extremes with this node
        curMax = Math.max(curMax, node.val);
        best = Math.max(best, curMax - curMin); // best spread on the path ending here
        dfs(node.left, curMin, curMax);
        dfs(node.right, curMin, curMax);
    }
}`,
        walkthrough: [
          "root=[8,3,10,1,...]. Path 8->3->1 updates min to 1, max stays 8 -> spread 7 recorded.",
          "Other paths (e.g. 8->10->14) give spread 6, which does not beat 7.",
          "Maximum spread over all paths is 7, returned as the answer.",
        ],
      },
    ],
    edgeCases: [
      "A node deeper than all ancestors with a smaller value → the spread is captured when min drops on its path.",
      "Strictly increasing chain (e.g. [1,null,2,null,3]) → the deepest minus the shallowest gives the answer.",
      "Two nodes only → the single ancestor-descendant pair is the answer.",
    ],
    twists: [
      "**Binary Tree Maximum Path Sum** (LeetCode 124) → carries an aggregate down/up the tree rather than path extremes.",
      "**Diameter of Binary Tree** (LeetCode 543) → another single-DFS global-best pattern over paths.",
      "**Range Sum of BST** (LeetCode 938) → prunes by value bounds rather than tracking path extremes.",
    ],
    related: ["binary-tree-maximum-path-sum", "diameter-of-binary-tree", "range-sum-of-bst"],
  },

  {
    slug: "smallest-string-starting-from-leaf",
    title: "Smallest String Starting From Leaf",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 988,
    statement:
      "You are given the `root` of a binary tree where each node has a value in the range 0 to 25 representing the letters 'a' to 'z'. Return the LEXICOGRAPHICALLY SMALLEST string that starts at a LEAF and ends at the root. As a reminder, a string is lexicographically smaller than another if, at the first differing position, it has a smaller character; a shorter string is smaller if it is a prefix of the longer one.",
    examples: [
      { in: "root = [0,1,2,3,4,3,4]", out: '"dba"', note: "leaf-to-root strings include dba, eba, dca, eca; dba is smallest" },
      { in: "root = [25,1,3,1,3,0,2]", out: '"adz"', note: "the smallest leaf-to-root string is adz" },
    ],
    constraints: ["the number of nodes is in [1, 8500]", "0 ≤ Node.val ≤ 25"],
    recognize:
      "Smallest leaf-to-root string → DFS building each ROOT-to-leaf path string, REVERSE it at each leaf (so it reads leaf-to-root), and keep the lexicographically smallest. The reversal is the crux because the path is naturally collected top-down but compared bottom-up. DFS-collect-then-reverse-and-compare is the signature.",
    figureItOut: [
      "The string runs from a LEAF up to the ROOT, but a DFS naturally builds a path from the ROOT down to a leaf. So as I descend I accumulate characters root-first; when I hit a leaf I have the root-to-leaf string and must REVERSE it to get the leaf-to-root string the problem wants.",
      "I carry a StringBuilder representing the current root-to-leaf prefix. At each node I append its character (char 'a' + node.val). When the node is a leaf (no children), I reverse the accumulated prefix to obtain the leaf-to-root candidate, and compare it against the best-so-far, keeping the smaller.",
      "Crucially I must UNDO the append when backtracking — after recursing into both children I delete the last character so the StringBuilder correctly represents the path for the next branch. This is standard backtracking on a shared buffer to avoid building a fresh string per node.",
      "Why reverse only at leaves and not compare prefixes early? Because lexicographic order of the FINAL leaf-to-root strings depends on the leaf end first, so a partial root-down prefix tells me nothing reliable about the final order — two paths sharing a root-side prefix can flip order once their leaf ends differ. So I must complete each path, reverse, and compare full strings. Each of the n nodes is visited once; building/reversing/comparing a string costs up to O(h) per leaf, giving roughly O(n·h) time and O(h) stack plus buffer. The whole insight is the direction mismatch: collect top-down, compare bottom-up via a reverse.",
    ],
    approaches: [
      {
        name: "DFS accumulating the root-to-leaf prefix, reverse at each leaf, keep the smallest (optimal)",
        intuition: "Build the path string top-down with backtracking; at each leaf reverse it into leaf-to-root order and keep the lexicographically smallest candidate.",
        time: "O(n · h)",
        timeWhy: "Each of the n nodes is visited once; each leaf reverses and compares a string of length up to the height h.",
        space: "O(h)",
        spaceWhy: "The recursion stack and the path buffer are proportional to the height h.",
        code: `class Solution {
    private String best = null;

    public String smallestFromLeaf(TreeNode root) {
        dfs(root, new StringBuilder());
        return best;
    }

    private void dfs(TreeNode node, StringBuilder path) {
        if (node == null) return;
        path.append((char) ('a' + node.val));        // extend the root-to-here prefix
        if (node.left == null && node.right == null) {
            String candidate = path.reverse().toString();  // leaf-to-root order
            path.reverse();                          // restore the buffer
            if (best == null || candidate.compareTo(best) < 0) best = candidate;
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
        path.deleteCharAt(path.length() - 1);        // backtrack this node
    }
}`,
        walkthrough: [
          "root=[0,1,2,3,4,3,4]. Path 0->1->3 builds 'abd'; leaf reverse -> 'dba'. best = 'dba'.",
          "Path 0->1->4 -> 'abe' reversed 'eba'; 'eba' > 'dba' so best unchanged. Right subtree gives 'dca','eca', both > 'dba'.",
          "Smallest leaf-to-root string is 'dba'.",
        ],
      },
    ],
    edgeCases: [
      "Single node → the one-character string is the answer.",
      "Two leaves where one path is a prefix of the other after reversal → the shorter (prefix) string wins lexicographically.",
      "Repeated characters along different paths → only the leaf-end ordering decides, so full strings must be compared.",
    ],
    twists: [
      "**Binary Tree Paths** (LeetCode 257) → enumerate full root-to-leaf paths without lexical comparison.",
      "**Sum Root to Leaf Numbers** (LeetCode 129) → accumulate a numeric value down each path instead of a string.",
      "**Compare on the fly** → prune branches early only works for root-to-leaf order, not leaf-to-root, which forces the full-string comparison here.",
    ],
    related: ["binary-tree-paths", "sum-root-to-leaf-numbers", "path-sum-ii"],
  },

  {
    slug: "find-leaves-of-binary-tree",
    title: "Find Leaves of Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 366,
    statement:
      "Given the `root` of a binary tree, collect the tree's nodes as if doing this repeatedly: collect all the LEAVES of the tree, then REMOVE those leaves, and repeat until the tree is empty. Return a list of lists where the i-th list contains the values removed in the i-th round.",
    examples: [
      { in: "root = [1,2,3,4,5]", out: "[[4,5,3],[2],[1]]", note: "round 1 removes leaves 4,5,3; round 2 removes 2; round 3 removes the root 1" },
      { in: "root = [1]", out: "[[1]]", note: "the single node is itself a leaf, removed in one round" },
    ],
    constraints: ["the number of nodes is in [1, 100]", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "Group nodes by their removal ROUND, which equals the node's HEIGHT (longest distance to a leaf below it) → a single DFS computing each node's height places it in result[height]. The round a node is collected is exactly its height, so no repeated stripping is needed. Height-as-removal-layer DFS is the signature.",
    figureItOut: [
      "Naively I would strip leaves, rebuild, strip again — but that re-traverses the tree many times. The cleaner observation: which ROUND does a node get removed in? A true leaf (no children) is removed in round 0. A node is removed only AFTER all its children are gone, so it is removed one round after its latest-surviving child.",
      "Define height(node) = the length of the longest downward path to a leaf. A leaf has height 0. An internal node has height 1 + max(height of its children). I claim a node is removed in the round equal to its height: leaves (height 0) go first; a node with children of heights h goes in round max(h)+1 because its slowest child leaves in round max(h), and only then does this node become a leaf.",
      "So a single post-order DFS that returns each node's height can BUCKET nodes by height: result[height(node)].add(node.val). I compute the children's heights first, take h = 1 + max(leftHeight, rightHeight), ensure result has a list at index h, and append this node there. Null children contribute height -1 so a leaf gets 1 + max(-1,-1) = 0.",
      "Because nodes are appended in post-order, within each round list the values come out in the natural left-to-right post-order, matching the expected grouping. One DFS visits each node once: O(n) time, O(h) recursion stack plus the output. The whole trick is recognising 'removal round = node height', which collapses the repeated-stripping simulation into one height-computing traversal.",
    ],
    approaches: [
      {
        name: "Single post-order DFS bucketing each node by its height (optimal)",
        intuition: "A node's removal round equals its height (distance to its deepest leaf), so computing height in one DFS lets you drop each node into result[height].",
        time: "O(n)",
        timeWhy: "Each node is visited once to compute its height and append it.",
        space: "O(n)",
        spaceWhy: "The output holds all n values; recursion stack is O(h).",
        code: `class Solution {
    public List<List<Integer>> findLeaves(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        height(root, result);
        return result;
    }

    private int height(TreeNode node, List<List<Integer>> result) {
        if (node == null) return -1;                 // below a leaf
        int h = 1 + Math.max(height(node.left, result), height(node.right, result));
        if (h == result.size()) result.add(new ArrayList<>()); // first node at this height
        result.get(h).add(node.val);                 // bucket by removal round = height
        return h;
    }
}`,
        walkthrough: [
          "root=[1,2,3,4,5]. Leaves 4,5,3 have height 0 -> result[0] = [4,5,3].",
          "Node 2 has children of height 0 -> height 1 -> result[1] = [2]. Node 1 has max child height 1 -> height 2 -> result[2] = [1].",
          "Result is [[4,5,3],[2],[1]].",
        ],
      },
    ],
    edgeCases: [
      "Single node → height 0, returned as [[value]].",
      "A skewed tree (each node one child) → each node has a distinct height, so each round removes exactly one node.",
      "Balanced tree → many leaves removed together in round 0, then their parents, and so on.",
    ],
    twists: [
      "**Maximum Depth of Binary Tree** (LeetCode 104) → the height primitive this reuses, returning a single number.",
      "**Find Leaves repeatedly** → the naive simulation strips and recomputes, which the height insight avoids.",
      "**Diameter of Binary Tree** (LeetCode 543) → another post-order height-combining DFS.",
    ],
    related: ["maximum-depth-of-binary-tree", "diameter-of-binary-tree", "binary-tree-level-order-traversal"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "linked-list-components",
    title: "Linked List Components",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 817,
    statement:
      "You are given the `head` of a linked list containing UNIQUE integer values and an integer array `nums` that is a SUBSET of those values. Return the number of CONNECTED COMPONENTS in `nums`, where two values are connected if they appear CONSECUTIVELY in the linked list.",
    examples: [
      { in: "head = [0,1,2,3], nums = [0,1,3]", out: "2", note: "0 and 1 are consecutive (one component); 3 stands alone (another); total 2" },
      { in: "head = [0,1,2,3,4], nums = [0,3,1,4]", out: "2", note: "0-1 form one run and 3-4 form another, since 2 (not in nums) breaks them apart" },
    ],
    constraints: ["the number of nodes is in [1, 10⁴]", "0 ≤ Node.val < n", "all node values are unique", "1 ≤ nums.length ≤ n", "nums is a subset of the node values"],
    recognize:
      "Count maximal RUNS of in-set values along the list → put `nums` in a hash set and walk the list once, counting a component each time a node IS in the set but its NEXT node is NOT (or is the end). That boundary marks the END of a run. Single-pass run-counting against a set is the signature.",
    figureItOut: [
      "A component is a maximal stretch of consecutive list nodes whose values are all in nums. So the question reduces to: how many such runs are there as I read the list left to right? I should put nums into a HASH SET for O(1) membership tests, then walk the list once.",
      "How do I count runs without double counting? A run is uniquely identified by its LAST node: the node that is in the set but whose successor is NOT in the set (or is null, the end of the list). Every run has exactly one such 'right boundary', so counting those boundaries counts the runs exactly.",
      "So as I traverse, for each node I check: is node.val in the set AND (node.next is null OR node.next.val is NOT in the set)? If yes, this node ends a run, so I increment the component count. Nodes in the middle of a run fail the second clause (their next is also in the set) and are not counted, which is exactly right.",
      "This avoids any union-find or grouping: the structure is a simple line, so connectivity is just adjacency, and runs are detected by their right edges. One pass over n nodes with O(1) set lookups: O(n) time and O(|nums|) space for the set. The clean idea is 'count the right endpoints of in-set runs', which turns component-counting into a local per-node test.",
    ],
    approaches: [
      {
        name: "Hash set of nums, count nodes that end an in-set run (optimal)",
        intuition: "Each component has exactly one right boundary — an in-set node whose next is out-of-set or null — so count those boundaries in a single pass.",
        time: "O(n)",
        timeWhy: "One walk over the list with O(1) set membership checks per node.",
        space: "O(m)",
        spaceWhy: "The hash set stores the m values of nums.",
        code: `class Solution {
    public int numComponents(ListNode head, int[] nums) {
        Set<Integer> inSet = new HashSet<>();
        for (int x : nums) inSet.add(x);

        int components = 0;
        for (ListNode node = head; node != null; node = node.next) {
            // count when this node is in the set but the run ends right after it
            if (inSet.contains(node.val)
                    && (node.next == null || !inSet.contains(node.next.val))) {
                components++;
            }
        }
        return components;
    }
}`,
        walkthrough: [
          "head=[0,1,2,3], nums={0,1,3}. Node 0 in set but next (1) also in set -> not a boundary.",
          "Node 1 in set, next (2) not in set -> boundary, components=1. Node 2 not in set -> skip. Node 3 in set, next null -> boundary, components=2.",
          "Two components returned.",
        ],
      },
    ],
    edgeCases: [
      "All values in nums and consecutive → a single component.",
      "nums values all isolated by out-of-set nodes → each contributes its own component.",
      "Last node in the set → its null next correctly ends a run.",
    ],
    twists: [
      "**Number of Provinces** (LeetCode 547) → general connectivity via union-find rather than line adjacency.",
      "**Middle of the Linked List** (LeetCode 876) → another single-pass list traversal with a local condition.",
      "**Union-find variant** → over-engineering here, but the right tool when the structure is a graph, not a line.",
    ],
    related: ["number-of-provinces", "middle-of-the-linked-list", "merge-nodes-in-between-zeros"],
  },

  {
    slug: "delete-n-nodes-after-m-nodes",
    title: "Delete N Nodes After M Nodes of a Linked List",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 1474,
    statement:
      "You are given the `head` of a linked list and two integers `m` and `n`. Traverse the list and remove nodes by following these rules, starting from the head: KEEP the first `m` nodes, then DELETE the next `n` nodes; repeat this keep-`m`, delete-`n` pattern until the list is exhausted. Return the head of the modified list.",
    examples: [
      { in: "head = [1,2,3,4,5,6,7,8,9,10,11,12,13], m = 2, n = 3", out: "[1,2,6,7,11,12]", note: "keep 1,2 delete 3,4,5; keep 6,7 delete 8,9,10; keep 11,12 delete 13" },
      { in: "head = [1,2,3,4,5,6,7,8,9,10,11], m = 1, n = 3", out: "[1,5,9]", note: "keep 1 delete 2,3,4; keep 5 delete 6,7,8; keep 9 delete 10,11" },
    ],
    constraints: ["the number of nodes is in [1, 10⁴]", "1 ≤ m, n ≤ 1000"],
    recognize:
      "Periodically keep m then skip n nodes in place → walk with a single pointer, advance m − 1 steps to land on the LAST kept node, then advance a separate pointer n steps to find the first survivor after the deleted block and RELINK around it. In-place skip-and-relink with two local pointers is the signature.",
    figureItOut: [
      "The pattern repeats in blocks of size m + n: keep m, delete n, keep m, delete n. I process one block per outer iteration starting from the current position. Within a block I need to do pointer surgery: the last KEPT node must skip past the n deleted nodes and point to whatever comes after them.",
      "I keep a 'current' pointer at the first node of the kept group. To reach the LAST kept node I advance current m − 1 times (it is already on the first kept node). I must stop early if the list ends — the last block may have fewer than m kept nodes, which is fine.",
      "Now from that last kept node I need to find the first node AFTER the n deletions. I use a temporary pointer starting at current.next and advance it n times (stopping at null if the list ends). Whatever it points to after n steps is the first survivor of the next block; I set current.next = temp to splice out the deleted nodes.",
      "Then I move current to that survivor (current = current.next) and repeat the block logic until current is null. There is no dummy head needed because the very first node is always kept (m >= 1). The deleted nodes simply become unreferenced. Each node is visited a constant number of times, so O(total nodes) time and O(1) space. The crux is the two-phase local walk per block: m − 1 steps to the last keeper, then n steps to find the relink target.",
    ],
    approaches: [
      {
        name: "Block-wise walk: stop on the last kept node, skip n, relink (optimal)",
        intuition: "Per block, advance to the last of the m kept nodes, then advance n more to find the first survivor and point the keeper's next at it, skipping the deleted run.",
        time: "O(L)",
        timeWhy: "Each node is examined a constant number of times across the keep and skip walks.",
        space: "O(1)",
        spaceWhy: "Only a couple of pointers; relinking is done in place.",
        code: `class Solution {
    public ListNode deleteNodes(ListNode head, int m, int n) {
        ListNode current = head;
        while (current != null) {
            for (int i = 1; i < m && current != null; i++) {  // land on the last kept node
                current = current.next;
            }
            if (current == null) break;
            ListNode temp = current.next;                     // first of the deleted run
            for (int i = 0; i < n && temp != null; i++) {     // skip n nodes
                temp = temp.next;
            }
            current.next = temp;                              // relink past the deleted run
            current = temp;                                   // continue from the survivor
        }
        return head;
    }
}`,
        walkthrough: [
          "head=[1..13], m=2, n=3. current at 1, advance m-1=1 -> current at 2 (last kept). temp=3, skip 3 -> temp at 6. 2.next=6.",
          "current=6, advance to 7 (last kept). temp=8, skip 3 -> temp at 11. 7.next=11. current=11, advance to 12. temp=13, skip 3 -> null. 12.next=null.",
          "Result: [1,2,6,7,11,12].",
        ],
      },
    ],
    edgeCases: [
      "List shorter than m → all nodes are kept; the loop exits when the walk reaches null.",
      "Fewer than n nodes remaining after the kept group → the skip walk stops at null and the keeper points to null.",
      "m = 1 → only the first node of each block survives.",
    ],
    twists: [
      "**Remove Nth Node From End of List** (LeetCode 19) → single positional deletion rather than a periodic pattern.",
      "**Odd Even Linked List** (LeetCode 328) → another in-place relinking by position parity.",
      "**Dummy-head variant** → unnecessary here since m >= 1 guarantees the head survives.",
    ],
    related: ["remove-nth-node-from-end-of-list", "odd-even-linked-list", "remove-linked-list-elements"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "remove-stones-to-minimize-the-total",
    title: "Remove Stones to Minimize the Total",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1962,
    statement:
      "You are given a 0-indexed integer array `piles`, where `piles[i]` is the number of stones in the i-th pile, and an integer `k`. In one operation you choose any pile and remove FLOOR(piles[i] / 2) stones from it (so the pile becomes ceil(piles[i] / 2)). Apply this operation EXACTLY `k` times (you may apply it to the same pile repeatedly). Return the MINIMUM possible total number of stones remaining after the k operations.",
    examples: [
      { in: "piles = [5,4,9], k = 2", out: "12", note: "halve 9->5 (remove 4), then halve 5->3 (remove 2): piles [5,4,3] total 12" },
      { in: "piles = [4,3,6,7], k = 3", out: "12", note: "greedily halving the largest pile each time minimises the remaining total" },
    ],
    constraints: ["1 ≤ piles.length ≤ 10⁵", "1 ≤ piles[i] ≤ 10⁴", "1 ≤ k ≤ 10⁵"],
    recognize:
      "Each operation removes floor(half) of one pile and you want the minimum total after exactly k operations → greedily ALWAYS halve the CURRENTLY LARGEST pile, since floor(largest/2) is the most stones any single operation can remove. A **max-heap** serves the largest pile; halve it, push the remainder back, repeat k times. Greedy-largest-via-max-heap is the signature.",
    figureItOut: [
      "Each operation removes floor(pile/2) stones from one pile. To minimise what REMAINS after k operations, I want to maximise what is REMOVED in total. The amount removed by operating on a pile of size v is floor(v/2), which is largest when v is largest. So at every step the most beneficial move is to halve the biggest current pile.",
      "Is this greedy optimal? Yes: the operations are independent in the sense that each just reduces one pile, and floor(v/2) is monotonic in v, so the single biggest removal available at any moment comes from the biggest pile. Spending an operation on a smaller pile now never beats spending it on the larger pile, because the larger pile yields a bigger immediate removal and the smaller pile remains for later.",
      "To repeatedly fetch and update the largest pile, I use a MAX-HEAP of pile sizes and the total sum. Each operation: pop the max v, compute the remainder ceil(v/2) = v - floor(v/2) = (v + 1) / 2 in integer math, subtract floor(v/2) from the running total, and push the remainder back. Do this exactly k times.",
      "I seed the heap with all piles and the total in O(n). Each of the k operations is an O(log n) pop and push. So O((n + k) log n) time and O(n) space. Using (v + 1) / 2 for the remainder avoids a separate floor computation. The crux is exactly the same greedy-max-heap structure as 'halve the array sum', just minimising the leftover after a FIXED number of operations rather than counting operations to a target.",
    ],
    approaches: [
      {
        name: "Max-heap: halve the largest pile k times, tracking the running total (optimal)",
        intuition: "floor(v/2) is largest for the largest pile, so always halve the current maximum; a max-heap pops it, you push back the ceil-half and decrement the total.",
        time: "O((n + k) log n)",
        timeWhy: "Heap build is O(n); each of the k operations does an O(log n) pop and push.",
        space: "O(n)",
        spaceWhy: "The max-heap holds all n pile sizes.",
        code: `class Solution {
    public int minStoneSum(int[] piles, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
        long total = 0;
        for (int p : piles) {
            heap.offer(p);
            total += p;
        }
        for (int op = 0; op < k; op++) {
            int largest = heap.poll();
            int remove = largest / 2;        // floor(largest / 2) stones removed
            total -= remove;
            heap.offer(largest - remove);    // pile becomes ceil(largest / 2)
        }
        return (int) total;
    }
}`,
        walkthrough: [
          "piles=[5,4,9], k=2, total=18. Pop 9, remove 4, push 5, total=14. Heap {5,5,4}.",
          "Pop 5, remove 2, push 3, total=12. Heap {5,4,3}.",
          "After 2 operations total remaining is 12.",
        ],
      },
    ],
    edgeCases: [
      "A pile of size 1 → floor(1/2) = 0 removed; halving it does nothing but still consumes an operation.",
      "k larger than needed to shrink piles → extra operations on 1-stone piles remove nothing.",
      "Single pile → all k operations hit it, halving repeatedly toward 1.",
    ],
    twists: [
      "**Minimum Operations to Halve the Array Sum** (LeetCode 2208) → counts operations to reach a target rather than minimising after fixed k.",
      "**Take Gifts From the Richest Pile** (LeetCode 2558) → square-root reduction on the max via a heap.",
      "**Maximal Score After Applying K Operations** (LeetCode 2530) → maximise a sum with a max-heap over k steps.",
    ],
    related: ["minimum-operations-to-halve-the-array-sum", "take-gifts-from-the-richest-pile", "maximal-score-after-applying-k-operations"],
  },

  {
    slug: "minimum-operations-to-exceed-threshold-value-ii",
    title: "Minimum Operations to Exceed Threshold Value II",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 3066,
    statement:
      "You are given a 0-indexed integer array `nums` and an integer `k`. In one operation you REMOVE the two SMALLEST elements `x` and `y` of `nums` (with x ≤ y) and ADD a new element worth `min(x, y) * 2 + max(x, y)` back to the array. Return the MINIMUM number of operations needed so that ALL elements of `nums` are GREATER THAN OR EQUAL TO `k`.",
    examples: [
      { in: "nums = [2,11,10,1,3], k = 10", out: "2", note: "combine 1 and 2 -> 1*2+2=4 giving [4,11,10,3]; combine 3 and 4 -> 3*2+4=10 giving [10,11,10]; all >= 10 in 2 ops" },
      { in: "nums = [1,1,2,4,9], k = 20", out: "4", note: "repeatedly combine the two smallest until everything is at least 20" },
    ],
    constraints: ["2 ≤ nums.length ≤ 2·10⁵", "1 ≤ nums[i] ≤ 10⁹", "1 ≤ k ≤ 10⁹", "the input always allows making every element ≥ k"],
    recognize:
      "Repeatedly combine the two SMALLEST elements until the minimum reaches k → a **min-heap** hands back the two smallest each round, you push their combination back, counting operations until the heap's smallest is ≥ k. Two-smallest-combine via a min-heap is the signature (the Huffman/last-stone family).",
    figureItOut: [
      "Each operation removes the two smallest values and inserts a strictly larger combined value (min*2 + max is bigger than both). The goal is for EVERY element to be ≥ k, which is equivalent to the SMALLEST element being ≥ k. So I only ever need to watch the current minimum and keep combining while it is below k.",
      "Which two elements should I combine? The two SMALLEST — that is dictated by the operation, but it is also the right greedy: the smallest values are exactly the ones violating the threshold, so combining them is what raises the minimum. Combining anything larger would waste an operation without fixing the smallest offender.",
      "A MIN-HEAP gives me the two smallest in O(log n) each. Each round: if the heap's smallest is already ≥ k, I am done. Otherwise pop x (smallest) and y (next smallest), push min(x,y)*2 + max(x,y) = x*2 + y back (since x ≤ y after popping in order), and increment the operation count.",
      "I must use long arithmetic because x*2 + y can exceed int range when values approach 10^9. I stop as soon as the heap's top is ≥ k (or the heap shrinks to one element, which then must be ≥ k by the problem's guarantee). Building the heap is O(n); each operation is O(log n); the number of operations is at most n − 1 since each merge reduces the count by one. Overall O(n log n) time, O(n) space. This is structurally the Last Stone Weight / Huffman merge pattern: a min-heap repeatedly fusing the two smallest.",
    ],
    approaches: [
      {
        name: "Min-heap: fuse the two smallest until the minimum reaches k (optimal)",
        intuition: "All elements are ≥ k exactly when the minimum is; a min-heap repeatedly pops the two smallest, pushes their combination, and counts operations until the top is ≥ k.",
        time: "O(n log n)",
        timeWhy: "Heap build is O(n); each of at most n−1 merges costs O(log n).",
        space: "O(n)",
        spaceWhy: "The min-heap holds up to n elements.",
        code: `class Solution {
    public int minOperations(int[] nums, int k) {
        PriorityQueue<Long> heap = new PriorityQueue<>();
        for (int x : nums) heap.offer((long) x);

        int operations = 0;
        while (heap.peek() < k) {            // smallest still below the threshold
            long x = heap.poll();            // two smallest, x <= y
            long y = heap.poll();
            heap.offer(x * 2 + y);           // min*2 + max combined value
            operations++;
        }
        return operations;
    }
}`,
        walkthrough: [
          "nums=[2,11,10,1,3], k=10. Smallest 1 < 10. Pop 1,2 -> push 1*2+2=4. Heap {3,4,10,11}. ops=1.",
          "Smallest 3 < 10. Pop 3,4 -> push 3*2+4=10. Heap {10,10,11}. ops=2.",
          "Smallest 10 >= 10 -> stop. Answer 2.",
        ],
      },
    ],
    edgeCases: [
      "All elements already ≥ k → zero operations.",
      "Large values near 10⁹ → use long so x*2 + y does not overflow int.",
      "Two elements only → one combine if either is below k, since the problem guarantees feasibility.",
    ],
    twists: [
      "**Last Stone Weight** (LeetCode 1046) → combines the two largest via a max-heap with a difference rule.",
      "**Minimum Cost to Connect Sticks** (LeetCode 1167) → min-heap fusing two smallest, summing the merge costs (Huffman).",
      "**Minimum Operations to Exceed Threshold Value I** → tiny limits permit a simple counting solution instead of a heap.",
    ],
    related: ["last-stone-weight", "minimum-cost-to-connect-sticks", "smallest-number-in-infinite-set"],
  },

  {
    slug: "number-of-orders-in-the-backlog",
    title: "Number of Orders in the Backlog",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1801,
    statement:
      "You are given a 2D array `orders` where `orders[i] = [price_i, amount_i, orderType_i]`, with orderType 0 for a BUY and 1 for a SELL. The backlog holds unfilled buy and sell orders. When a BUY order arrives, it is matched against the CHEAPEST sell whose price is ≤ the buy price, consuming amounts until the buy is exhausted or no such sell remains; leftovers join the buy backlog. A SELL order is matched against the MOST EXPENSIVE buy whose price is ≥ the sell price, similarly. Return the total amount of orders still in the backlog after processing all orders, MODULO 10⁹ + 7.",
    examples: [
      { in: "orders = [[10,5,0],[15,2,1],[25,1,1],[30,4,0]]", out: "6", note: "after matching, 5 buys at 10 and 1 sell at 25 remain; 5 + 1 = 6" },
      { in: "orders = [[7,1000000000,1],[15,3,0],[5,999999995,0],[5,1,1]]", out: "999999984", note: "huge amounts; the leftover total is taken modulo 10^9 + 7" },
    ],
    constraints: ["1 ≤ orders.length ≤ 10⁵", "orders[i].length == 3", "1 ≤ price_i, amount_i ≤ 10⁹", "orderType_i is 0 or 1"],
    recognize:
      "Match incoming buys against the cheapest sells and sells against the priciest buys → keep TWO heaps: a **min-heap of sells** (by price) and a **max-heap of buys** (by price). Each new order repeatedly consumes the heap top while prices are compatible, then any remainder is pushed onto its own heap. Dual price-priority queues with greedy matching is the signature.",
    figureItOut: [
      "There are two backlogs that interact: outstanding BUY orders and outstanding SELL orders. A new buy wants the CHEAPEST compatible sell; a new sell wants the most EXPENSIVE compatible buy. 'Cheapest' and 'most expensive' under repeated extraction scream priority queues — a MIN-heap of sells keyed by price, and a MAX-heap of buys keyed by price.",
      "Process one order at a time. For an incoming BUY [price, amount]: while amount > 0 and the sell heap is non-empty and its cheapest sell price ≤ buy price, match against it. Matching consumes min(amount, sellAmount): reduce both. If the sell is fully consumed, pop it; otherwise update its remaining amount in place (pop and re-push the reduced amount). When no compatible sell remains (heap empty or cheapest sell too expensive), the leftover buy amount joins the BUY max-heap.",
      "An incoming SELL is the mirror image: while amount > 0 and the buy heap is non-empty and its most-expensive buy price ≥ sell price, consume min(amount, buyAmount); pop or update the buy; any leftover sell amount joins the SELL min-heap. The two heaps are symmetric, just with opposite price ordering and opposite compatibility comparisons.",
      "After processing every order, the answer is the sum of all remaining amounts across BOTH heaps, taken modulo 10^9 + 7 because amounts can be huge. Each order causes a bounded number of heap operations amortised — every unit pushed is popped at most once, so total heap work is O(n log n). The two-heap design with greedy top-matching is the whole idea; the modulo and using long for the running total are the implementation details to get right.",
    ],
    approaches: [
      {
        name: "Two price-priority heaps (min-heap sells, max-heap buys) with greedy top-matching (optimal)",
        intuition: "Buys match the cheapest compatible sell and sells the most expensive compatible buy, so maintain a min-heap of sells and a max-heap of buys, consuming heap tops while prices fit and pushing remainders.",
        time: "O(n log n)",
        timeWhy: "Each order entry is pushed and popped at most once across the heaps, each operation O(log n).",
        space: "O(n)",
        spaceWhy: "The two heaps together hold at most n outstanding order entries.",
        code: `class Solution {
    public int getNumberOfBacklogOrders(int[][] orders) {
        // buy heap: most expensive on top; sell heap: cheapest on top
        PriorityQueue<int[]> buys = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));
        PriorityQueue<int[]> sells = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));

        for (int[] order : orders) {
            int price = order[0], amount = order[1], type = order[2];
            if (type == 0) {                                   // incoming BUY
                while (amount > 0 && !sells.isEmpty() && sells.peek()[0] <= price) {
                    int[] sell = sells.poll();
                    int matched = Math.min(amount, sell[1]);
                    amount -= matched;
                    sell[1] -= matched;
                    if (sell[1] > 0) sells.offer(sell);        // partial sell stays
                }
                if (amount > 0) buys.offer(new int[]{ price, amount });
            } else {                                           // incoming SELL
                while (amount > 0 && !buys.isEmpty() && buys.peek()[0] >= price) {
                    int[] buy = buys.poll();
                    int matched = Math.min(amount, buy[1]);
                    amount -= matched;
                    buy[1] -= matched;
                    if (buy[1] > 0) buys.offer(buy);
                }
                if (amount > 0) sells.offer(new int[]{ price, amount });
            }
        }

        long total = 0, MOD = 1000000007L;
        for (int[] b : buys) total += b[1];
        for (int[] s : sells) total += s[1];
        return (int) (total % MOD);
    }
}`,
        walkthrough: [
          "orders=[[10,5,0],[15,2,1],[25,1,1],[30,4,0]]. Buy 10x5: no sells -> buys {(10,5)}. Sell 15x2: best buy 10 < 15, no match -> sells {(15,2)}.",
          "Sell 25x1: best buy 10 < 25 -> sells {(15,2),(25,1)}. Buy 30x4: cheapest sell 15 <= 30 match 2; next 25 <= 30 match 1; amount left 1 -> buys {(10,5),(30,1)}.",
          "Backlog: buys 5 + 1 = 6, sells empty. Total 6.",
        ],
      },
    ],
    edgeCases: [
      "No compatible counterpart → the whole order joins its backlog unchanged.",
      "Order partially fills a heap top → the top's amount is reduced and re-pushed, not removed.",
      "Enormous amounts → accumulate the leftover total in a long and apply the modulo only at the end.",
    ],
    twists: [
      "**Single-Threaded CPU** (LeetCode 1834) → a min-heap of tasks processed in time order, a different two-key priority.",
      "**Seat Reservation Manager** (LeetCode 1845) → a single min-heap reserving and freeing the smallest available id.",
      "**Merge K Sorted Lists** (LeetCode 23) → repeatedly extracting the minimum from competing streams via a heap.",
    ],
    related: ["single-threaded-cpu", "seat-reservation-manager", "merge-k-sorted-lists"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "remove-sub-folders-from-the-filesystem",
    title: "Remove Sub-Folders from the Filesystem",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 1233,
    statement:
      "Given a list of folder paths `folder`, REMOVE all sub-folders and return the remaining folders in any order. A folder `f1` is a sub-folder of `f2` if `f2` is a PREFIX of `f1` along path boundaries — for example `/a/b` is a sub-folder of `/a` but `/a/bc` is NOT a sub-folder of `/a/b`. Each path starts with `/` and consists of lowercase letters.",
    examples: [
      { in: 'folder = ["/a","/a/b","/c/d","/c/d/e","/c/f"]', out: '["/a","/c/d","/c/f"]', note: "/a/b is under /a; /c/d/e is under /c/d; both are removed" },
      { in: 'folder = ["/a","/a/b/c","/a/b/d"]', out: '["/a"]', note: "both deeper paths sit under /a, so only /a survives" },
    ],
    constraints: ["1 ≤ folder.length ≤ 4·10⁴", "2 ≤ folder[i].length ≤ 100", "folder[i] contains only lowercase letters and '/'", "all paths are unique and start with '/'"],
    recognize:
      "Drop any path that has an ancestor path in the set, respecting '/' boundaries → build a **trie keyed by path SEGMENTS** (split on '/'), mark inserted folders as endpoints, then keep a folder only if NO endpoint exists strictly ABOVE it on its segment path. Segment-trie ancestor detection is the signature (sorting is an alternative).",
    figureItOut: [
      "A sub-folder is any path that has one of the kept folders as a PREFIX at a '/' boundary. The boundary subtlety matters: '/a/bc' is not under '/a/b' even though '/a/b' is a string prefix of '/a/bc'. The clean way to respect boundaries is to treat each path as a sequence of SEGMENTS (the parts between slashes) rather than raw characters.",
      "A TRIE over segments captures ancestry exactly: '/a/b' becomes the path a -> b in the trie, '/a' becomes the node a. Then '/a/b' is a sub-folder of '/a' iff, while walking '/a/b's segments down the trie, I pass through a node that was marked as an inserted FOLDER endpoint before reaching the end. So if any proper ancestor segment-node is an endpoint, this folder must be removed.",
      "Plan: insert every folder by splitting on '/' and creating segment nodes, marking the final node with the folder string (or a boolean and the original path). Then for each folder, walk its segments again from the root; if I encounter an endpoint marker at any node BEFORE the last segment, it has an ancestor folder and is a sub-folder, so skip it; otherwise keep it.",
      "Splitting on '/' produces a leading empty segment (paths start with '/'), which I just skip. Each insert and each check is O(L) in the path length, so total O(total path length). Space is the trie of segment nodes. An equally valid approach is to SORT the paths lexicographically and keep a folder only if it does not start with (lastKept + '/') — sorting guarantees a parent appears before its children. The segment-trie is the structural way; sorting is the shortcut. The boundary-aware comparison is the one detail both must get right.",
    ],
    approaches: [
      {
        name: "Segment trie: insert all paths, keep a folder only if no ancestor endpoint exists (optimal)",
        intuition: "Split paths into '/'-segments and build a trie; a folder is a sub-folder exactly when an inserted endpoint lies on a strict ancestor node, so keep only folders with no such ancestor.",
        time: "O(N · L)",
        timeWhy: "Each of the N folders is inserted and checked over its L segments.",
        space: "O(N · L)",
        spaceWhy: "The trie stores a node per distinct segment across all paths.",
        code: `class Solution {
    static class TrieNode {
        Map<String, TrieNode> children = new HashMap<>();
        boolean isFolder = false;
    }

    public List<String> removeSubfolders(String[] folder) {
        TrieNode root = new TrieNode();
        for (String path : folder) {                 // insert every folder as a segment path
            TrieNode cur = root;
            for (String seg : path.split("/")) {
                if (seg.isEmpty()) continue;          // skip the leading empty segment
                cur = cur.children.computeIfAbsent(seg, x -> new TrieNode());
            }
            cur.isFolder = true;
        }

        List<String> result = new ArrayList<>();
        for (String path : folder) {                 // keep a folder with no ancestor endpoint
            TrieNode cur = root;
            boolean hasAncestor = false;
            String[] segs = path.split("/");
            for (int i = 0; i < segs.length; i++) {
                if (segs[i].isEmpty()) continue;
                cur = cur.children.get(segs[i]);
                if (cur.isFolder && i < segs.length - 1) {  // endpoint strictly above
                    hasAncestor = true;
                    break;
                }
            }
            if (!hasAncestor) result.add(path);
        }
        return result;
    }
}`,
        walkthrough: [
          "Insert /a, /a/b, /c/d, /c/d/e, /c/f. Trie marks a, a->b, c->d, c->d->e, c->f as folders.",
          "Check /a/b: walking a (folder, but not last) -> ancestor found -> removed. Check /c/d/e: c->d (folder, not last) -> removed.",
          "/a, /c/d, /c/f have no ancestor endpoint -> kept. Result is [/a, /c/d, /c/f].",
        ],
      },
    ],
    edgeCases: [
      "A path that is a string prefix but not a segment prefix (e.g. /a/bc vs /a/b) → not a sub-folder, kept.",
      "Deeply nested chain → only the topmost folder survives.",
      "Disjoint top-level folders → all are kept.",
    ],
    twists: [
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → a character trie; here the trie keys are whole path segments.",
      "**Longest Common Prefix** (LeetCode 14) → prefix reasoning on strings without segment boundaries.",
      "**Sort-and-scan variant** → sorting paths lets a single linear scan detect sub-folders without a trie.",
    ],
    related: ["implement-trie-prefix-tree", "longest-common-prefix", "design-add-and-search-words-data-structure"],
  },

  {
    slug: "design-in-memory-file-system",
    title: "Design In-Memory File System",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 588,
    statement:
      "Design an in-memory file system supporting these operations. `ls(path)`: if path is a FILE, return a list with just its name; if path is a DIRECTORY, return the names of its files and sub-directories in LEXICOGRAPHIC order. `mkdir(path)`: create a new directory, making any missing intermediate directories. `addContentToFile(filePath, content)`: create the file if absent (with intermediate dirs) and APPEND content to it. `readContentFromFile(filePath)`: return the file's full content.",
    examples: [
      { in: 'ls("/"); mkdir("/a/b/c"); addContentToFile("/a/b/c/d","hello"); ls("/"); readContentFromFile("/a/b/c/d")', out: '[] then ["a"] then "hello"', note: "the trie of path segments grows as directories and files are created" },
      { in: 'addContentToFile("/f","ab"); addContentToFile("/f","cd"); readContentFromFile("/f")', out: '"abcd"', note: "content is appended across calls" },
    ],
    constraints: ["1 ≤ path lengths ≤ 100", "paths are valid absolute paths of lowercase letters and digits separated by '/'", "at most 300 operations", "content is non-empty lowercase letters"],
    recognize:
      "A hierarchical path namespace with create/list/read → model it as a **trie keyed by path SEGMENTS**, where each node is a directory or a file; ls sorts a directory's children, mkdir walks/creates segment nodes, and file nodes carry appended content. Segment-trie filesystem is the signature.",
    figureItOut: [
      "A filesystem IS a tree of named entries, and a path '/a/b/c' is just the sequence of segment names a, b, c. So the natural model is a TRIE keyed by segments: each node has a map from child-name to child-node, a flag or marker distinguishing a FILE from a DIRECTORY, and (for files) a content buffer.",
      "Navigation is shared by every operation: split the path on '/', skip the empty leading segment, and walk down child by child. mkdir walks the segments creating any missing child directory node along the way (computeIfAbsent), ending on a directory node. addContentToFile walks/creates the intermediate directories, then ensures the final segment is a FILE node and APPENDS the content to its buffer.",
      "ls(path) walks to the target node. If it is a FILE, the answer is a single-element list with that file's NAME (the last segment). If it is a DIRECTORY, I collect the keys of its children map and SORT them lexicographically before returning — the sort is required by the spec. readContentFromFile walks to the file node and returns its content buffer as a string.",
      "Each node needs: children map, an isFile flag (or treat presence of content as fileness), and a StringBuilder for content. Splitting and walking is O(L) per call in the path length; ls of a directory with c children costs O(c log c) to sort. With at most 300 operations and short paths this is trivially fast. The whole design is 'a trie whose nodes are directories or files', and every method is a variation on segment-walk-then-act. The only spec details to honour are lexicographic ls ordering, intermediate-directory creation, and content APPEND (not overwrite).",
    ],
    approaches: [
      {
        name: "Segment-keyed trie of directory/file nodes (optimal)",
        intuition: "Each path segment is a trie edge; nodes are directories (children map) or files (content buffer); every operation walks the segments and acts at the target, with ls sorting a directory's child names.",
        time: "O(L + c log c)",
        timeWhy: "Each call walks the path of length L; an ls on a directory sorts its c child names.",
        space: "O(total path content)",
        spaceWhy: "The trie stores a node per distinct segment plus each file's accumulated content.",
        code: `class FileSystem {
    static class Node {
        Map<String, Node> children = new HashMap<>();
        boolean isFile = false;
        StringBuilder content = new StringBuilder();
    }

    private final Node root = new Node();

    public FileSystem() {}

    private Node walk(String path, boolean create) {
        Node cur = root;
        for (String seg : path.split("/")) {
            if (seg.isEmpty()) continue;             // skip the leading empty segment
            if (!cur.children.containsKey(seg)) {
                if (!create) return null;
                cur.children.put(seg, new Node());
            }
            cur = cur.children.get(seg);
        }
        return cur;
    }

    public List<String> ls(String path) {
        Node node = walk(path, false);
        List<String> result = new ArrayList<>();
        if (node.isFile) {
            String[] segs = path.split("/");
            result.add(segs[segs.length - 1]);       // a file lists just its own name
        } else {
            result.addAll(node.children.keySet());
            Collections.sort(result);                // directory children in lexicographic order
        }
        return result;
    }

    public void mkdir(String path) {
        walk(path, true);                            // create all missing directories
    }

    public void addContentToFile(String filePath, String content) {
        Node node = walk(filePath, true);            // create intermediate dirs and the file
        node.isFile = true;
        node.content.append(content);                // append, not overwrite
    }

    public String readContentFromFile(String filePath) {
        return walk(filePath, false).content.toString();
    }
}`,
        walkthrough: [
          "mkdir(/a/b/c) creates nodes a -> b -> c as directories. ls(/) collects root's children -> ['a'].",
          "addContentToFile(/a/b/c/d, 'hello') walks/creates d as a file and appends 'hello'.",
          "readContentFromFile(/a/b/c/d) walks to d and returns 'hello'.",
        ],
      },
    ],
    edgeCases: [
      "ls on the root '/' before anything is created → returns an empty list.",
      "ls on a file path → returns a single-element list with the file's name, not its content.",
      "addContentToFile called twice on the same file → content is appended, producing the concatenation.",
    ],
    twists: [
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → a character trie; this one keys on whole path segments and stores content.",
      "**Remove Sub-Folders from the Filesystem** (LeetCode 1233) → ancestry detection over the same segment-trie shape.",
      "**Design Add and Search Words Data Structure** (LeetCode 211) → a trie supporting wildcard search rather than a namespace.",
    ],
    related: ["implement-trie-prefix-tree", "remove-sub-folders-from-the-filesystem", "design-add-and-search-words-data-structure"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "video-stitching",
    title: "Video Stitching",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 1024,
    statement:
      "You are given a series of video `clips` from a sporting event that lasted `time` seconds, where `clips[i] = [start_i, end_i]` means the i-th clip covers the interval [start_i, end_i]. You may CUT clips into segments and reassemble them. Return the MINIMUM number of clips needed to cover the ENTIRE sporting event [0, time]. If it is impossible to cover [0, time], return −1.",
    examples: [
      { in: "clips = [[0,2],[4,6],[8,10],[1,9],[1,5],[5,9]], time = 10", out: "3", note: "take [0,2], [1,9], [8,10] to cover [0,10] with 3 clips" },
      { in: "clips = [[0,1],[1,2]], time = 5", out: "-1", note: "coverage stops at 2, leaving [2,5] uncovered" },
    ],
    constraints: ["1 ≤ clips.length ≤ 100", "0 ≤ start_i ≤ end_i ≤ 100", "0 ≤ time ≤ 100"],
    recognize:
      "Cover [0, time] with the fewest intervals, where chosen intervals may overlap and be cut → a GREEDY interval-covering sweep: at each step, among all clips starting at or before the current covered end, pick the one reaching FARTHEST, jump there, and count it. Farthest-reach greedy over intervals (the jump-game-as-intervals pattern) is the signature.",
    figureItOut: [
      "I must cover the continuous range [0, time] using as few clips as possible, and clips may overlap (overlap is fine, gaps are not). This is a covering problem: I extend the covered prefix from 0 toward time, always extending as far as possible per clip chosen — a greedy 'reach the farthest' strategy, exactly like Jump Game II but framed as intervals.",
      "To pick efficiently I want, for any current covered position 'curEnd', the clip that STARTS at or before curEnd and ENDS as far right as possible. A neat way is to precompute, for each possible start second s (0..time), the maximum end reachable by any clip starting at s: maxReach[s] = max over clips with start == s of end. Then I sweep positions and track the best reach available within the current window.",
      "The sweep mirrors Jump Game II: I keep curEnd (the end of the segment guaranteed covered with the clips counted so far) and farthest (the farthest I could reach using one more clip that starts within [0, curEnd]). I iterate i from 0 up to time; at each i I update farthest = max(farthest, maxReach[i]). When i reaches curEnd, I must commit one more clip: increment the count and set curEnd = farthest. If at any point farthest is not beyond i (cannot advance), covering is impossible -> return −1.",
      "I stop successfully once curEnd >= time. The bound that 'a clip starting after curEnd cannot help yet' is what makes the greedy correct: within the reachable window I always take the longest forward extension, and that is provably optimal for minimum-count covering. Building maxReach is O(n + time); the sweep is O(time). So O(n + time) time and O(time) space. The realisation that this is Jump Game II in interval clothing — greedily jump to the farthest reachable end — is the whole solution.",
    ],
    approaches: [
      {
        name: "Greedy farthest-reach sweep (Jump Game II as intervals) (optimal)",
        intuition: "Precompute the farthest end reachable from each start second, then sweep extending the covered prefix to the farthest reachable end whenever the current segment runs out, counting one clip each jump.",
        time: "O(n + T)",
        timeWhy: "Building the per-start max-reach is O(n + T); the sweep over [0, T] is O(T).",
        space: "O(T)",
        spaceWhy: "The max-reach array spans the time range T.",
        code: `class Solution {
    public int videoStitching(int[][] clips, int time) {
        int[] maxReach = new int[time + 1];
        for (int[] clip : clips) {
            if (clip[0] <= time) {                       // clips starting beyond time are useless
                maxReach[clip[0]] = Math.max(maxReach[clip[0]], clip[1]);
            }
        }

        int count = 0, curEnd = 0, farthest = 0;
        for (int i = 0; i < time; i++) {
            farthest = Math.max(farthest, maxReach[i]);  // best reach using a clip starting <= i
            if (i == farthest) return -1;                // cannot advance past i -> a gap
            if (i == curEnd) {                           // current segment exhausted, take a clip
                count++;
                curEnd = farthest;
                if (curEnd >= time) return count;        // whole event covered
            }
        }
        return count;                                    // covered exactly up to time
    }
}`,
        walkthrough: [
          "clips include [0,2],[1,9],[8,10], time=10. maxReach[0]=2, maxReach[1]=9, maxReach[8]=10 (among others).",
          "Sweep: at i=0 farthest=2, i==curEnd -> count=1, curEnd=2. By i=1 farthest=9; at i=2==curEnd -> count=2, curEnd=9.",
          "By i=8 farthest=10; at i=9==curEnd -> count=3, curEnd=10 >= 10 -> return 3.",
        ],
      },
    ],
    edgeCases: [
      "No clip starts at 0 → covering [0, time] is impossible, return −1.",
      "time = 0 → already covered, zero clips needed.",
      "A gap in the middle where farthest cannot advance past i → return −1.",
    ],
    twists: [
      "**Jump Game II** (LeetCode 45) → the same farthest-reach greedy on array indices instead of time intervals.",
      "**Minimum Number of Taps to Open to Water a Garden** (LeetCode 1326) → identical covering greedy with taps as intervals.",
      "**DP alternative** → minClips[t] over the timeline works but is slower than the linear greedy.",
    ],
    related: ["jump-game-ii", "minimum-number-of-taps-to-open-to-water-a-garden", "merge-intervals"],
  },

  {
    slug: "count-ways-to-group-overlapping-ranges",
    title: "Count Ways to Group Overlapping Ranges",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 2580,
    statement:
      "You are given a 2D array `ranges` where `ranges[i] = [start_i, end_i]` denotes the inclusive range [start_i, end_i]. You must split ALL the ranges into TWO groups (group 1 and group 2) such that if two ranges OVERLAP they MUST belong to the same group; a range may belong to either group, and a group may be empty. Return the number of ways to split, MODULO 10⁹ + 7.",
    examples: [
      { in: "ranges = [[6,10],[5,15]]", out: "2", note: "the two ranges overlap so must be together; that single block can go to group 1 or group 2 -> 2 ways" },
      { in: "ranges = [[1,3],[10,20],[2,5],[4,8]]", out: "4", note: "merging overlaps yields 2 connected blocks ([1,8] and [10,20]); 2^2 = 4 ways" },
    ],
    constraints: ["1 ≤ ranges.length ≤ 10⁵", "ranges[i].length == 2", "0 ≤ start_i ≤ end_i ≤ 10⁹"],
    recognize:
      "Overlapping ranges must share a group → MERGE overlapping ranges into connected BLOCKS, then each independent block freely chooses group 1 or 2, giving 2^(number of blocks) mod 10⁹+7. Sort-and-merge to count connected components, then a power of two, is the signature.",
    figureItOut: [
      "The constraint 'overlapping ranges must be in the same group' means overlap forces togetherness — and overlap is transitive through chains: if A overlaps B and B overlaps C, then A, B, C must all be in one group even if A and C do not directly overlap. So the ranges partition into CONNECTED BLOCKS where every range transitively connected by overlap belongs to one block.",
      "Each connected block is a single indivisible unit for grouping: the whole block goes to group 1 or the whole block goes to group 2 — two independent choices. Different blocks are independent of each other (no overlap between them by definition), so the total number of ways is 2 raised to the number of blocks.",
      "To count blocks I sort the ranges by start and do the classic MERGE-INTERVALS sweep: keep a current merged end; for each next range, if its start is ≤ the current end (they overlap or touch — and since ranges are inclusive, touching at a point counts as overlap), extend the current end to max(curEnd, range end); otherwise the chain breaks, so I close the current block (increment block count) and start a new one. After the sweep, count the final block too.",
      "Then the answer is 2^blocks mod 10^9 + 7, computed with fast modular exponentiation. Sorting is O(n log n), the merge sweep is O(n), the power is O(log blocks). The two insights are: overlap is a connectivity relation so merging gives independent components, and independent binary choices multiply to a power of two. Modular arithmetic keeps the potentially huge 2^blocks in range.",
    ],
    approaches: [
      {
        name: "Sort, merge overlapping ranges into blocks, return 2^blocks mod 1e9+7 (optimal)",
        intuition: "Overlap forces ranges into shared connected blocks; merging counts those blocks, and each block independently picks one of two groups, so the answer is two to the block count.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the merge sweep and modular power are linear/logarithmic.",
        space: "O(1)",
        spaceWhy: "Sorting in place and a few counters beyond the input.",
        code: `class Solution {
    public int countWays(int[][] ranges) {
        Arrays.sort(ranges, (a, b) -> Integer.compare(a[0], b[0]));
        long MOD = 1000000007L;

        int blocks = 0;
        int curEnd = -1;
        for (int[] r : ranges) {
            if (r[0] > curEnd) blocks++;             // a gap starts a new connected block
            curEnd = Math.max(curEnd, r[1]);         // extend the current merged block
        }

        long result = 1;
        for (int i = 0; i < blocks; i++) {           // 2^blocks via repeated doubling mod MOD
            result = (result * 2) % MOD;
        }
        return (int) result;
    }
}`,
        walkthrough: [
          "ranges=[[1,3],[10,20],[2,5],[4,8]] sorted -> [[1,3],[2,5],[4,8],[10,20]]. [1,3] starts block 1, curEnd=3.",
          "[2,5] start 2 <= 3 -> same block, curEnd=5. [4,8] start 4 <= 5 -> same block, curEnd=8. [10,20] start 10 > 8 -> block 2, curEnd=20.",
          "2 blocks -> 2^2 = 4 ways.",
        ],
      },
    ],
    edgeCases: [
      "A single range → one block, 2^1 = 2 ways.",
      "All ranges overlap into one block → 2 ways regardless of count.",
      "Touching ranges (end == next start) → treated as overlapping for inclusive ranges, so the same block.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → the same sort-and-merge sweep but emitting the merged intervals.",
      "**Number of Provinces** (LeetCode 547) → counting connected components via union-find rather than interval merging.",
      "**Union-find variant** → connect overlapping ranges and count components, an alternative to the sorted sweep.",
    ],
    related: ["merge-intervals", "number-of-provinces", "non-overlapping-intervals"],
  },
];
