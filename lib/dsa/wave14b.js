// NeetCode All + Top Interview 150 / LeetCode 75 / Grind 75 — wave 14b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave13b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE14B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "all-nodes-distance-k-in-binary-tree",
    title: "All Nodes Distance K in Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 863,
    statement:
      "Given the `root` of a binary tree, a `target` node, and an integer `k`, return the values of all nodes that are exactly distance `k` from the target. Distance counts edges, and it may go UP toward ancestors as well as DOWN into descendants. The answer may be returned in any order.",
    examples: [
      { in: "root = [3,5,1,6,2,0,8,null,null,7,4], target = 5, k = 2", out: "[7,4,1]", note: "nodes 7 and 4 are two edges down from 5; node 1 is two edges up-and-over (5 -> 3 -> 1)" },
      { in: "root = [1], target = 1, k = 3", out: "[]", note: "no node is three edges away in a single-node tree" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 500", "0 ≤ Node.val ≤ 500", "all Node.val are unique", "target is one of the nodes in the tree", "0 ≤ k ≤ 1000"],
    recognize:
      "Distance is measured in EDGES and may travel up through ancestors as well as down → convert the tree into an **undirected graph** (each node linked to its children AND its parent) and run a plain **BFS from the target**; every node reached at BFS layer k is an answer. The parent links are what let distance flow upward.",
    figureItOut: [
      "In a tree, going DOWN from a node is easy — recurse and count depth. But the target can also reach nodes by going UP to a parent and then down a different branch (5 -> 3 -> 1 is distance 2). A child has no pointer to its parent, so the upward direction is invisible to a normal traversal. That missing edge is the whole difficulty.",
      "If I add the missing upward edges, the tree becomes an UNDIRECTED graph where every node connects to its left child, right child, and parent. In that graph 'distance k from target' is just 'all nodes exactly k edges away', which is the textbook job for breadth-first search expanding one layer at a time.",
      "So first I walk the tree once and build a map node -> parent, recording each node's parent as I go. That single pass gives me the upward links without mutating the node structure.",
      "Then I BFS outward from the target. Each node has up to three neighbours: left child, right child, and parent. I track visited nodes (a node could otherwise be revisited via its parent then back down) and stop after exactly k layers; the queue contents at that moment are all the nodes at distance k. Edge counting matches BFS layers one-for-one, so layer k = distance k.",
    ],
    approaches: [
      {
        name: "Map child to parent, then BFS k layers from target (optimal)",
        intuition: "Record every node's parent so edges become bidirectional, then breadth-first expand from the target and read off the k-th layer.",
        time: "O(n)",
        timeWhy: "One pass to record parents and one BFS, each visiting every node at most once.",
        space: "O(n)",
        spaceWhy: "The parent map, the visited set, and the BFS queue each hold up to n nodes.",
        code: `class Solution {
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        recordParents(root, null, parent);

        Queue<TreeNode> queue = new LinkedList<>();
        Set<TreeNode> visited = new HashSet<>();
        queue.offer(target);
        visited.add(target);

        int dist = 0;
        while (!queue.isEmpty()) {
            if (dist == k) {                       // current layer is exactly distance k
                List<Integer> res = new ArrayList<>();
                for (TreeNode node : queue) res.add(node.val);
                return res;
            }
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                TreeNode[] neighbours = { node.left, node.right, parent.get(node) };
                for (TreeNode nb : neighbours) {
                    if (nb != null && visited.add(nb)) queue.offer(nb);   // add returns false if already seen
                }
            }
            dist++;
        }
        return new ArrayList<>();                   // k is larger than the tree radius
    }

    void recordParents(TreeNode node, TreeNode par, Map<TreeNode, TreeNode> parent) {
        if (node == null) return;
        parent.put(node, par);
        recordParents(node.left, node, parent);
        recordParents(node.right, node, parent);
    }
}`,
        walkthrough: [
          "root=[3,5,1,6,2,0,8,null,null,7,4], target=5, k=2. Parents recorded: 5->3, 6->5, 2->5, 1->3, etc.",
          "BFS layer0 {5}. Layer1: neighbours of 5 are children 6,2 and parent 3 → {6,2,3}. Layer2: from 6,2 children 7,4; from 3 the other child 1 → {7,4,1}.",
          "dist reaches 2 → return the layer {7,4,1}.",
        ],
      },
    ],
    edgeCases: [
      "k = 0 → the target itself is the only node at distance 0; the loop returns it immediately.",
      "k exceeds the tree radius → BFS empties the queue before reaching layer k; return an empty list.",
      "target is the root → it simply has no parent entry (mapped to null) and BFS still works downward only.",
    ],
    twists: [
      "**Amount of Time for Binary Tree to Be Infected** (LeetCode 2385) → the same parent-map + BFS, but return the LAST layer reached (total time) instead of one specific layer.",
      "**Closest leaf in a binary tree** → BFS from the target until the first leaf is dequeued.",
      "**Build adjacency list explicitly** → instead of a parent map, materialise a full Map<node, List<neighbours>> and run a generic graph BFS.",
    ],
    related: ["binary-tree-level-order-traversal", "lowest-common-ancestor-of-a-binary-tree", "subtree-of-another-tree"],
  },

  {
    slug: "find-duplicate-subtrees",
    title: "Find Duplicate Subtrees",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 652,
    statement:
      "Given the `root` of a binary tree, return a list of the roots of all **duplicate subtrees** — subtrees that have the same structure AND the same node values as another subtree somewhere in the tree. For each group of duplicates, return the root of any ONE of them.",
    examples: [
      { in: "root = [1,2,3,4,null,2,4,null,null,4]", out: "[[2,4],[4]]", note: "the subtree rooted at value 2 with a left child 4 appears twice, and the leaf 4 appears multiple times" },
      { in: "root = [2,1,1]", out: "[[1]]", note: "the leaf 1 occurs twice, so one copy is reported" },
    ],
    constraints: ["number of nodes is n", "1 ≤ n ≤ 10⁴", "−200 ≤ Node.val ≤ 200"],
    recognize:
      "Detect subtrees that repeat anywhere in the tree → **serialize each subtree into a canonical string** during a post-order DFS and count how many times each serialization appears in a hash map. A subtree is a duplicate the moment its serialization is seen the SECOND time; report it exactly once then.",
    figureItOut: [
      "Two subtrees are identical when their shape and all their values match. The cleanest way to give every subtree a comparable IDENTITY is to serialize it into a string that uniquely encodes both shape and values — then two subtrees are equal exactly when their strings are equal. So the problem becomes counting repeated strings.",
      "To build a subtree's serialization I need my children's serializations first, so I use POST-ORDER DFS: compute the left string, the right string, then combine them as something like 'val,leftString,rightString'. Crucially I must include explicit markers for null children (e.g. '#') so that, say, a node with only a left child cannot be confused with one having only a right child.",
      "As each node finishes, I have its full serialization. I store these in a hash map serialization -> count. When a serialization's count goes from 1 to 2, this is the first time I have learned it is a duplicate, so I add the current node to the result list. I add only on the transition to 2 so each duplicate group is reported exactly once, never thrice for a triple.",
      "Why post-order and not, say, comparing every pair of subtrees: there are O(n) subtrees and naively comparing all pairs is O(n^2) comparisons each costing O(n) — far too slow at n=10^4. Serializing once per node and hashing reduces it to a single O(n) pass (treating string handling as roughly linear in subtree size). The null markers and a consistent delimiter are the details that make the encoding collision-free.",
    ],
    approaches: [
      {
        name: "Post-order serialization counted in a hash map (optimal)",
        intuition: "Encode each subtree as a unique string built from its children's strings; the second time a string appears, its root is a duplicate.",
        time: "O(n²) worst case",
        timeWhy: "Each of n nodes builds a serialization whose length can be O(n) for a skewed tree, and hashing/comparing those strings costs proportional to their length.",
        space: "O(n²)",
        spaceWhy: "The map can hold up to n serializations, each up to O(n) characters long.",
        code: `class Solution {
    public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
        Map<String, Integer> seen = new HashMap<>();
        List<TreeNode> result = new ArrayList<>();
        serialize(root, seen, result);
        return result;
    }

    String serialize(TreeNode node, Map<String, Integer> seen, List<TreeNode> result) {
        if (node == null) return "#";                          // explicit null marker
        String left = serialize(node.left, seen, result);
        String right = serialize(node.right, seen, result);
        String key = node.val + "," + left + "," + right;      // canonical id for this subtree
        int count = seen.merge(key, 1, Integer::sum);
        if (count == 2) result.add(node);                      // first time we know it repeats
        return key;
    }
}`,
        walkthrough: [
          "root=[1,2,3,4,null,2,4,null,null,4]. Leaves 4 serialize to \"4,#,#\". The first leaf 4 sets count 1; a later leaf 4 makes count 2 → add that node.",
          "The subtree rooted at value 2 with left child 4 serializes to \"2,4,#,#,#\". It occurs under node 2 on the left and under node 3 on the right; the second occurrence sets count 2 → add it.",
          "Result holds one node for the duplicated \"4,#,#\" and one for \"2,4,#,#,#\" → [[4],[2,4]].",
        ],
      },
    ],
    edgeCases: [
      "A subtree appears three or more times → adding only when count hits exactly 2 reports it just once.",
      "Single node tree → no duplicates, empty result.",
      "Mirror-image subtrees with swapped children → they serialize differently and are NOT counted as duplicates, which is correct (structure must match exactly).",
    ],
    twists: [
      "**Subtree of Another Tree** (LeetCode 572) → serialize both trees and check substring/equality instead of counting repeats.",
      "**Serialize and Deserialize Binary Tree** (LeetCode 297) → the same canonical encoding, used to reconstruct rather than compare.",
      "**Use integer ids instead of strings** → map each distinct serialization to an int to keep keys O(1)-sized and the whole pass O(n).",
    ],
    related: ["subtree-of-another-tree", "serialize-and-deserialize-binary-tree", "same-tree"],
  },

  {
    slug: "binary-tree-cameras",
    title: "Binary Tree Cameras",
    difficulty: "Hard",
    pattern: "trees",
    leetcode: 968,
    statement:
      "You are given the `root` of a binary tree. A camera placed on a node can monitor its **parent, itself, and its immediate children**. Return the minimum number of cameras needed so that every node in the tree is monitored.",
    examples: [
      { in: "root = [0,0,null,0,0]", out: "1", note: "one camera on the middle node covers its parent and both children — the whole tree" },
      { in: "root = [0,0,null,0,null,0,null,null,0]", out: "2", note: "a long chain needs cameras spaced so coverage overlaps with no gaps" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 1000", "Node.val == 0"],
    recognize:
      "Minimum cameras covering a tree where a camera sees parent/self/children → **greedy post-order DFS with three states** per node: NOT covered, COVERED but no camera, HAS a camera. Place cameras as LOW as possible — at parents of uncovered leaves — and let coverage bubble up. Bottom-up is what makes the greedy optimal.",
    figureItOut: [
      "Every node must be watched, and a camera is expensive, so I want as FEW as possible. The key economic insight: a camera on a LEAF is wasteful — it only covers the leaf and its parent. A camera on the leaf's PARENT covers the parent, the leaf, the sibling, AND the grandparent. So cameras should sit one level above the leaves, never on the leaves themselves. That hints at a bottom-up greedy.",
      "Bottom-up means post-order DFS: decide a node's situation only after seeing both children's situations. I give each node one of three states it reports upward: 0 = I am NOT covered (need someone above to cover me), 1 = I am covered but have NO camera, 2 = I HAVE a camera (so I cover my parent too).",
      "The combining rule at a node, given its children's states: if EITHER child is uncovered (state 0), I MUST place a camera here to cover it — return 2 and increment the count. If either child HAS a camera (state 2), then I am already covered by that child — return 1. Otherwise both children are merely covered (state 1) but neither watches me, so I am uncovered — return 0 and push the responsibility to my parent.",
      "Base case and the root: treat a null child as state 1 (covered, no camera) so a real leaf is computed as uncovered (state 0) and forces a camera at its parent — exactly the greedy I wanted. One special case at the very top: after the DFS, if the ROOT comes back as state 0 (uncovered, with no parent to cover it), I must add one final camera for the root.",
    ],
    approaches: [
      {
        name: "Greedy post-order DFS with three states (optimal)",
        intuition: "Push coverage up from the leaves; place a camera exactly when a child reports it is uncovered, and patch the root if it ends up uncovered.",
        time: "O(n)",
        timeWhy: "Each node is visited once in post-order with O(1) work to combine its children's states.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h (O(n) for a skewed tree).",
        code: `class Solution {
    // states: 0 = uncovered, 1 = covered without camera, 2 = has a camera
    private int cameras = 0;

    public int minCameraCover(TreeNode root) {
        if (dfs(root) == 0) cameras++;   // root left uncovered: it has no parent, so cover it
        return cameras;
    }

    int dfs(TreeNode node) {
        if (node == null) return 1;       // null counts as covered, so a real leaf becomes uncovered
        int left = dfs(node.left);
        int right = dfs(node.right);
        if (left == 0 || right == 0) {    // a child is uncovered -> must place a camera here
            cameras++;
            return 2;
        }
        if (left == 2 || right == 2) return 1;   // a child has a camera -> I am covered
        return 0;                                 // both children merely covered -> I am uncovered
    }
}`,
        walkthrough: [
          "root=[0,0,null,0,0]: leaves return 0 (uncovered). Their parent (the middle node) sees a 0 from a child → places a camera, returns 2.",
          "That state 2 propagates: the root sees a child with state 2 → root is covered, returns 1.",
          "Root state is 1 (not 0), so no extra camera. Total cameras = 1.",
        ],
      },
    ],
    edgeCases: [
      "Single node → its DFS returns 0 (uncovered, both null children are state 1), the root patch adds 1 camera.",
      "A node whose two children are leaves → the node gets the camera, covering both leaves and itself and its parent.",
      "Skewed chain → cameras land on every node two levels up from a leaf, spaced to overlap with no gaps.",
    ],
    twists: [
      "**House Robber III** (LeetCode 337) → a different tree DP also returning two states per node (rob / skip), maximizing instead of minimizing.",
      "**Dominating set on a tree** → this is exactly the minimum dominating set problem on a tree, solvable greedily as here.",
      "**Camera also covers grandchildren** → a richer state machine if the coverage radius grows.",
    ],
    related: ["house-robber-iii", "binary-tree-maximum-path-sum", "lowest-common-ancestor-of-a-binary-tree"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "maximum-twin-sum-of-a-linked-list",
    title: "Maximum Twin Sum of a Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 2130,
    statement:
      "In a linked list of EVEN length `n`, the node at position `i` (0-indexed) is the twin of the node at position `n − 1 − i` for `0 <= i < n/2`. The twin sum is the sum of a node and its twin. Return the **maximum twin sum** over all twin pairs.",
    examples: [
      { in: "head = [5,4,2,1]", out: "6", note: "twins are (5,1) and (4,2); sums 6 and 6; max is 6" },
      { in: "head = [4,2,2,3]", out: "7", note: "twins (4,3)=7 and (2,2)=4; max is 7" },
      { in: "head = [1,100000]", out: "100001", note: "the single twin pair" },
    ],
    constraints: ["the number of nodes is in the range [2, 10⁵]", "n is even", "1 ≤ Node.val ≤ 10⁵"],
    recognize:
      "Pair the first half with the reversed second half of a list → the classic **find-middle (slow/fast) then reverse the second half** combo, after which you walk the two halves in lockstep summing aligned nodes. Doing it in O(1) space without an array is the whole point.",
    figureItOut: [
      "The naive way: copy every value into an array, then pair index i with index n-1-i and take the max sum. That is O(n) time but O(n) extra space. The interesting version asks for O(1) extra space, which forces me to think structurally about the list.",
      "Node i is twinned with node n-1-i. If I could line up the FIRST half going forward with the SECOND half going backward, twin pairs would sit next to each other and I could sum them in one walk. 'Second half going backward' is exactly a reversed second half.",
      "So the plan has three classic pieces. First, find the middle with the slow/fast pointer trick: fast moves two steps for every one of slow, so when fast reaches the end, slow is at the start of the second half. Second, reverse the second half in place (standard prev/cur pointer reversal). Third, walk one pointer from the head and another from the reversed-second-half head simultaneously, adding aligned values and tracking the maximum.",
      "Because the length is even, the two halves are equal size, so the second walk terminates cleanly when the reversed half is exhausted. Each aligned pair I encounter is exactly a twin pair (front node i with back node n-1-i), so the running maximum of their sums is the answer — all in O(1) extra space.",
    ],
    approaches: [
      {
        name: "Array of values, pair i with n-1-i (baseline)",
        intuition: "Dump values into a list, then sum symmetric index pairs and take the maximum.",
        time: "O(n)",
        timeWhy: "One pass to copy, one pass over n/2 pairs.",
        space: "O(n)",
        spaceWhy: "An array holding every node value.",
        code: `class Solution {
    public int pairSum(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode node = head; node != null; node = node.next) vals.add(node.val);
        int max = 0;
        int n = vals.size();
        for (int i = 0; i < n / 2; i++) {
            max = Math.max(max, vals.get(i) + vals.get(n - 1 - i));
        }
        return max;
    }
}`,
      },
      {
        name: "Find middle, reverse second half, walk in lockstep (optimal)",
        intuition: "Slow/fast finds the midpoint; reverse the back half so twins align; sum the two halves node by node.",
        time: "O(n)",
        timeWhy: "Finding the middle, reversing half, and the final paired walk are each linear.",
        space: "O(1)",
        spaceWhy: "Only a handful of pointers; the reversal is done in place.",
        code: `class Solution {
    public int pairSum(ListNode head) {
        // 1) find the start of the second half
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        // 2) reverse the second half (starting at slow)
        ListNode prev = null, cur = slow;
        while (cur != null) {
            ListNode tmp = cur.next;
            cur.next = prev;
            prev = cur;
            cur = tmp;
        }
        // 3) walk first half and reversed second half together
        int max = 0;
        ListNode front = head, back = prev;
        while (back != null) {
            max = Math.max(max, front.val + back.val);
            front = front.next;
            back = back.next;
        }
        return max;
    }
}`,
        walkthrough: [
          "head=[5,4,2,1]. Slow/fast: slow ends at node(2), the start of the second half.",
          "Reverse from node(2): the second half [2,1] becomes [1,2], prev points at node(1).",
          "Walk front=5 with back=1 → sum 6; front=4 with back=2 → sum 6. Max = 6.",
        ],
      },
    ],
    edgeCases: [
      "Exactly two nodes → one twin pair; the slow/fast loop puts slow at the second node, reversed half is that lone node.",
      "All equal values → every twin sum is identical; the max equals twice a value.",
      "The in-place reversal leaves the original list rewired → fine here since only the answer is needed, but note it if the list must be preserved.",
    ],
    twists: [
      "**Palindrome Linked List** (LeetCode 234) → same find-middle-then-reverse, but compare aligned values instead of summing.",
      "**Reorder List** (LeetCode 143) → find middle, reverse second half, then INTERLEAVE the two halves.",
      "**Odd length variant** → handle the unpaired middle node separately when n is odd.",
    ],
    related: ["palindrome-linked-list", "reorder-list", "middle-of-the-linked-list"],
  },

  {
    slug: "delete-the-middle-node-of-a-linked-list",
    title: "Delete the Middle Node of a Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 2095,
    statement:
      "Given the `head` of a linked list, delete the **middle node** and return the head of the modified list. The middle node of a list of length `n` is the node at 0-indexed position `floor(n / 2)`. If the list has one node, deleting the middle leaves an empty list.",
    examples: [
      { in: "head = [1,3,4,7,1,2,6]", out: "[1,3,4,1,2,6]", note: "n = 7, middle index floor(7/2) = 3, which is the node with value 7; remove it" },
      { in: "head = [1,2,3,4]", out: "[1,2,4]", note: "n = 4, middle index 2 is the node with value 3" },
      { in: "head = [2,1]", out: "[2]", note: "n = 2, middle index 1 is the node with value 1" },
    ],
    constraints: ["the number of nodes is in the range [1, 10⁵]", "1 ≤ Node.val ≤ 10⁵"],
    recognize:
      "Delete the middle node in one pass → the **slow/fast pointer** trick, but advance slow's PREDECESSOR so you end holding the node just BEFORE the middle, then splice it out with `prev.next = prev.next.next`. A dummy head and a one-step offset on fast handle the floor(n/2) indexing cleanly.",
    figureItOut: [
      "Deleting the middle requires two things: knowing WHERE the middle is, and having a handle on the node just BEFORE it so I can splice it out. The slow/fast pointer technique finds the middle in a single pass — but to delete cleanly I need the predecessor of the middle, not the middle itself.",
      "Standard slow/fast: fast moves two steps per one step of slow, so when fast finishes, slow sits at the middle. To land slow one node EARLIER (the predecessor), I give fast a head start of one step, or equivalently track a 'prev' pointer trailing slow. Either way I want prev pointing at the node right before the middle.",
      "A dummy node before the head makes the splice uniform even when the middle is the head's neighbour or the list is tiny. Start prev at the dummy, slow at head, fast at head. Advance fast by two and slow (with prev following) by one until fast runs off the end; then prev is just before the middle.",
      "Now delete: prev.next = prev.next.next, which unlinks the middle node. Return dummy.next. The single-node case is the one to double-check: n=1 gives middle index 0 (the head), and the pointers must end with prev at the dummy so dummy.next becomes null — an empty list, as required.",
    ],
    approaches: [
      {
        name: "Slow/fast pointers tracking the predecessor, splice it out (optimal)",
        intuition: "Run fast at double speed while a trailing pointer stops one node before the middle, then unlink the middle.",
        time: "O(n)",
        timeWhy: "A single pass: fast traverses the list once while slow covers half.",
        space: "O(1)",
        spaceWhy: "Only a few pointers; the splice is done in place.",
        code: `class Solution {
    public ListNode deleteMiddle(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prev = dummy, slow = head, fast = head;
        while (fast != null && fast.next != null) {
            prev = slow;             // trails one behind slow
            slow = slow.next;
            fast = fast.next.next;   // double speed
        }
        prev.next = prev.next.next;  // unlink the middle node (slow)
        return dummy.next;
    }
}`,
        walkthrough: [
          "head=[1,3,4,7,1,2,6], dummy->1. Iterations move slow 1->3->4->7 (index 3) while prev trails to node(4) and fast reaches the end.",
          "prev is node(4); prev.next = prev.next.next unlinks node(7).",
          "Return dummy.next = [1,3,4,1,2,6].",
        ],
      },
    ],
    edgeCases: [
      "Single node → the while loop never runs; prev stays at dummy, dummy.next = dummy.next.next = null → empty list.",
      "Two nodes → middle index 1; prev ends at the head, removing the second node.",
      "Even vs odd length → floor(n/2) is handled identically because the loop condition fast != null && fast.next != null lands slow at the right place for both.",
    ],
    twists: [
      "**Remove Nth Node From End of List** (LeetCode 19) → a gap of n between two pointers instead of a half-speed pointer.",
      "**Middle of the Linked List** (LeetCode 876) → just return the middle node without deleting it.",
      "**Delete without the head reference** → if given only the node to delete, copy the next node's value over it and skip the next node.",
    ],
    related: ["middle-of-the-linked-list", "remove-nth-node-from-end-of-list", "reverse-linked-list"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "process-tasks-using-servers",
    title: "Process Tasks Using Servers",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1882,
    statement:
      "You are given `servers` (server i has weight `servers[i]`) and `tasks` (task j needs `tasks[j]` seconds). Tasks are assigned in order j = 0, 1, 2, .... At second j the j-th task becomes available; it is assigned to a FREE server with the smallest weight, ties broken by smallest index. If no server is free at second j, the task waits and goes to the next server to free up (again smallest weight, then index). A server returns to the free pool when its task finishes. Return an array `ans` where `ans[j]` is the index of the server that ran task j.",
    examples: [
      {
        in: "servers = [3,3,2], tasks = [1,2,3,2,1,2]",
        out: "[2,2,0,2,1,2]",
        note: "server 2 (weight 2) is cheapest and keeps getting reused as it frees; ties between weight-3 servers 0 and 1 break by index",
      },
      { in: "servers = [5,1,4,3,2], tasks = [2,1,2,4,5,2,1]", out: "[1,4,1,4,1,3,2]" },
    ],
    constraints: ["servers.length == n", "tasks.length == m", "1 ≤ n, m ≤ 2·10⁵", "1 ≤ servers[i], tasks[j] ≤ 2·10⁶"],
    recognize:
      "Assign tasks over time to the cheapest free server, queueing when all are busy → **two min-heaps**: a FREE heap keyed by (weight, index) and a BUSY heap keyed by (freeTime, weight, index). Advance a clock, release servers whose freeTime has passed back to free, and pull the cheapest free server — or fast-forward time to the next free-up if none are available.",
    figureItOut: [
      "Two questions repeat: which free server is cheapest right now, and when none are free, which busy server frees up first. Both are 'minimum of a changing set' queries, so I reach for heaps — one for free servers, one for busy servers.",
      "The FREE heap is ordered by (weight, index): its top is the cheapest available server, ties by index, exactly the assignment rule. The BUSY heap is ordered by (freeTime, weight, index): its top is the server that returns soonest, and the secondary keys preserve the cheap-then-index tie-break for the moment it re-enters the free pool.",
      "I keep a clock 'time'. For task j, the earliest it can be considered is second j, so time = max(time, j). Then I drain from the busy heap every server whose freeTime <= time back into the free heap. If the free heap is now non-empty, assign task j to its top, compute its finish time = time + tasks[j], and push it onto the busy heap.",
      "The subtle part is when NO server is free at second j: the task must wait. Rather than ticking one second at a time (too slow for 2*10^5 tasks), I JUMP the clock to the freeTime of the soonest busy server, release everything freed by that instant, and only then assign. Setting time = max(j, soonestFreeTime) and re-draining handles both 'task arrives and servers are free' and 'task waits for a server' with the same code.",
    ],
    approaches: [
      {
        name: "Free heap (weight,index) + busy heap (freeTime,weight,index), advance the clock (optimal)",
        intuition: "Release servers freed by the current time into a cheapest-first free heap; if none are free, jump time to the next free-up; assign each task to the free heap's top.",
        time: "O((n + m) log n)",
        timeWhy: "Each server enters and leaves the heaps O(m) times total; each heap op is O(log n) and there are O(n + m) of them.",
        space: "O(n)",
        spaceWhy: "The two heaps together hold at most n servers, plus the answer array of size m.",
        code: `class Solution {
    public int[] assignTasks(int[] servers, int[] tasks) {
        int n = servers.length, m = tasks.length;
        // free: {weight, index}, cheapest then lowest index
        PriorityQueue<int[]> free = new PriorityQueue<>((a, b) ->
            a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        // busy: {freeTime, weight, index}, soonest free first, then weight, then index
        PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) ->
            a[0] != b[0] ? Long.compare(a[0], b[0]) :
            a[1] != b[1] ? Long.compare(a[1], b[1]) : Long.compare(a[2], b[2]));

        for (int i = 0; i < n; i++) free.offer(new int[]{ servers[i], i });

        int[] ans = new int[m];
        long time = 0;
        for (int j = 0; j < m; j++) {
            time = Math.max(time, j);                          // task j is available at second j
            while (!busy.isEmpty() && busy.peek()[0] <= time) {  // release everything freed by now
                long[] s = busy.poll();
                free.offer(new int[]{ (int) s[1], (int) s[2] });
            }
            if (free.isEmpty()) {                              // none free: jump to the next free-up
                time = busy.peek()[0];
                while (!busy.isEmpty() && busy.peek()[0] <= time) {
                    long[] s = busy.poll();
                    free.offer(new int[]{ (int) s[1], (int) s[2] });
                }
            }
            int[] server = free.poll();                        // cheapest free server
            ans[j] = server[1];
            busy.offer(new long[]{ time + tasks[j], server[0], server[1] });
        }
        return ans;
    }
}`,
        walkthrough: [
          "servers=[3,3,2], tasks=[1,2,3,2,1,2]. free={(2,2),(3,0),(3,1)}. j=0 time0: assign server2 (weight2), busy{(1,2,2)}. ans[0]=2.",
          "j=1 time1: release server2 (freeTime1<=1) → free. server2 still cheapest → assign again, busy{(3,2,2)}. ans[1]=2. j=2 time2: nothing freed (3>2), free has servers 0,1 → cheapest is index0. ans[2]=0.",
          "Continuing the rule yields ans = [2,2,0,2,1,2].",
        ],
      },
    ],
    edgeCases: [
      "All servers busy when a task arrives → time jumps to the soonest free-up, so the task is delayed but still assigned correctly.",
      "More servers than tasks → no waiting ever happens; cheapest-then-index ordering decides everything.",
      "Large finish times → freeTime is stored as long since time + task can grow with many sequential delays.",
    ],
    twists: [
      "**Single-Threaded CPU** (LeetCode 1834) → one server, a heap of ready tasks ordered by processing time; advance time to the next available task when idle.",
      "**Meeting Rooms III** (LeetCode 2402) → the same free/busy two-heap simulation choosing the lowest-numbered room.",
      "**Seat Reservation Manager** (LeetCode 1845) → a single min-heap of free slots, reserve/unreserve.",
    ],
    related: ["single-threaded-cpu", "meeting-rooms-iii", "seat-reservation-manager"],
  },

  {
    slug: "the-number-of-the-smallest-unoccupied-chair",
    title: "The Number of the Smallest Unoccupied Chair",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 1942,
    statement:
      "There are infinitely many chairs numbered 0, 1, 2, .... Given `times` where `times[i] = [arrival_i, leaving_i]` for friend i (all arrival times distinct), each arriving friend sits in the **smallest-numbered unoccupied** chair; a chair frees the instant its occupant leaves, and a chair freed at time t is available to a friend arriving at exactly time t. Return the chair number that the friend numbered `targetFriend` will sit in.",
    examples: [
      {
        in: "times = [[1,4],[2,3],[4,6]], targetFriend = 1",
        out: "1",
        note: "friend0 arrives at 1 -> chair0; friend1 arrives at 2 -> chair1; friend1 sits in chair 1",
      },
      {
        in: "times = [[3,10],[1,5],[2,6]], targetFriend = 0",
        out: "2",
        note: "friend1 arrives first -> chair0, friend2 -> chair1, friend0 arrives at 3 -> chair2",
      },
    ],
    constraints: ["n == times.length", "2 ≤ n ≤ 10⁴", "times[i].length == 2", "1 ≤ arrival_i < leaving_i ≤ 10⁵", "all arrival_i are distinct"],
    recognize:
      "Assign the smallest free chair as friends arrive and leave over time → **two heaps**: a min-heap of FREE chair numbers and a min-heap of OCCUPIED chairs keyed by (leaveTime, chairNumber). Process friends in ARRIVAL order, free chairs whose occupant has left by the arrival time, then hand out the smallest free chair (lazily numbering new chairs as needed).",
    figureItOut: [
      "Two repeated queries again: the smallest free chair number, and which occupied chair frees soonest. Both scream min-heap. So one heap holds available chair numbers (smallest on top), and another holds occupied chairs keyed by when they free up.",
      "Friends do NOT arrive in input order, so I must SORT events by arrival time first. But I also need to know which sorted friend is the target, so I sort indices (or pairs of [arrival, originalIndex]) and remember which one is targetFriend.",
      "Processing in arrival order: before seating an arriving friend at time a, I move every occupied chair whose leaveTime <= a back into the free heap (a chair freed exactly at time a is reusable now). Then the smallest free chair is the free heap's top. If the free heap is empty I introduce a brand-new chair with the next unused number — this lazy numbering avoids pre-allocating infinitely many chairs.",
      "I seat the friend in that chair, push (leaveTime, chair) onto the occupied heap, and if this friend IS the target I immediately return the chair number. The smallest-free guarantee comes from the free heap always surrendering its minimum, plus the new-chair counter only growing when no smaller chair is available. Distinct arrivals mean no tie-breaking needed among simultaneous arrivals.",
    ],
    approaches: [
      {
        name: "Sort by arrival; free-chairs min-heap + occupied min-heap by leave time (optimal)",
        intuition: "Process arrivals in order, release chairs whose occupants have left, then give out the smallest free chair (or a new one).",
        time: "O(n log n)",
        timeWhy: "Sorting arrivals is O(n log n); each friend does O(log n) heap operations.",
        space: "O(n)",
        spaceWhy: "The two heaps together hold at most n chairs.",
        code: `class Solution {
    public int smallestChair(int[][] times, int targetFriend) {
        int n = times.length;
        Integer[] order = new Integer[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> times[a][0] - times[b][0]);   // by arrival time

        PriorityQueue<Integer> freeChairs = new PriorityQueue<>();  // smallest chair number first
        // occupied: {leaveTime, chairNumber}, soonest to free first
        PriorityQueue<int[]> occupied = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        int nextNewChair = 0;

        for (int idx : order) {
            int arrival = times[idx][0], leaving = times[idx][1];
            while (!occupied.isEmpty() && occupied.peek()[0] <= arrival) {   // free up departed chairs
                freeChairs.offer(occupied.poll()[1]);
            }
            int chair = freeChairs.isEmpty() ? nextNewChair++ : freeChairs.poll();
            if (idx == targetFriend) return chair;
            occupied.offer(new int[]{ leaving, chair });
        }
        return -1;   // unreachable: targetFriend is always seated
    }
}`,
        walkthrough: [
          "times=[[3,10],[1,5],[2,6]], target=0. Arrival order: friend1(1), friend2(2), friend0(3).",
          "friend1 at 1 → chair0, occupied{(5,0)}. friend2 at 2 → no chair freed (5>2), chair1, occupied{(5,0),(6,1)}.",
          "friend0 at 3 → none freed, chair2. idx == target → return 2.",
        ],
      },
    ],
    edgeCases: [
      "Chair freed exactly at an arrival time → the <= comparison frees it in time for that arrival.",
      "Target arrives first → seated in chair 0 immediately.",
      "All friends overlap → no chair is ever freed before everyone is seated, so chairs are handed out 0,1,2,... in arrival order.",
    ],
    twists: [
      "**Seat Reservation Manager** (LeetCode 1845) → a single min-heap of free seats with explicit reserve/unreserve calls.",
      "**Meeting Rooms III** (LeetCode 2402) → same free/busy heaps but tally how many meetings each room held.",
      "**Process Tasks Using Servers** (LeetCode 1882) → the analogous two-heap assignment with a weight tie-break.",
    ],
    related: ["seat-reservation-manager", "meeting-rooms-iii", "process-tasks-using-servers"],
  },

  {
    slug: "maximum-subsequence-score",
    title: "Maximum Subsequence Score",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 2542,
    statement:
      "You are given arrays `nums1` and `nums2` of equal length `n` and an integer `k`. Choose a subsequence of `k` indices. The score is (the SUM of the chosen nums1 values) × (the MINIMUM of the chosen nums2 values). Return the **maximum possible score**.",
    examples: [
      {
        in: "nums1 = [1,3,3,2], nums2 = [2,1,3,4], k = 3",
        out: "12",
        note: "pick indices 0,2,3: nums1 sum = 1+3+2 = 6, nums2 min = min(2,3,4) = 2, score 6*2 = 12",
      },
      { in: "nums1 = [4,2,3,1,1], nums2 = [7,5,10,9,6], k = 1", out: "30", note: "pick index 2: 3 * 10 = 30" },
    ],
    constraints: ["n == nums1.length == nums2.length", "1 ≤ n ≤ 10⁵", "0 ≤ nums1[i], nums2[j] ≤ 10⁵", "1 ≤ k ≤ n"],
    recognize:
      "Maximize (sum of one array) × (min of another) over a size-k pick → **sort the pairs by the MIN-factor descending, then sweep with a size-k min-heap of the SUM-factor**. Fixing each element as the smallest nums2 value, the best partners are the k−1 largest nums1 values seen so far; a min-heap of size k maintains exactly that running set.",
    figureItOut: [
      "The score multiplies a SUM (over nums1) by a MIN (over nums2). The min is the troublemaker: whichever chosen index has the smallest nums2 dictates the multiplier, and I do not know in advance which one that will be. So I FIX it: suppose index i is the one contributing the minimum nums2. Then every other chosen index must have nums2 >= nums2[i], and I want their nums1 values as large as possible.",
      "That fixing trick becomes clean if I SORT all pairs (nums1[i], nums2[i]) by nums2 DESCENDING. Then as I sweep left to right, the current element always has the SMALLEST nums2 among everything seen so far — so it can legitimately be the minimum-factor for a group drawn from the prefix processed up to here.",
      "For a fixed minimum-factor (the current element's nums2), I want the k largest nums1 values among the current element and the ones already seen. A size-k MIN-heap of nums1 values does this: I keep a running sum of what is in the heap; when the heap exceeds size k I pop the smallest nums1 (removing it from the sum), so the heap always holds the k largest nums1 so far.",
      "Once the heap holds exactly k elements, the current element's nums2 is the minimum of those k (because of the descending sort), so a candidate score is runningSum * currentNums2. I take the maximum candidate over the whole sweep. Use a long for the running sum and the score, since 10^5 values times k can overflow int. Each element is pushed once and popped at most once → O(n log k) after the sort.",
    ],
    approaches: [
      {
        name: "Sort by nums2 descending, size-k min-heap of nums1 with running sum (optimal)",
        intuition: "Fix each element as the minimum nums2; the best companions are the k−1 largest nums1 before it, maintained by a size-k min-heap.",
        time: "O(n log n)",
        timeWhy: "Sorting the n pairs dominates; each element does O(log k) heap work during the sweep.",
        space: "O(n)",
        spaceWhy: "The sorted pair array plus a heap of up to k elements.",
        code: `class Solution {
    public long maxScore(int[] nums1, int[] nums2, int k) {
        int n = nums1.length;
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) { pairs[i][0] = nums1[i]; pairs[i][1] = nums2[i]; }
        Arrays.sort(pairs, (a, b) -> b[1] - a[1]);     // by nums2 descending

        PriorityQueue<Integer> minHeap = new PriorityQueue<>();   // smallest nums1 on top
        long sum = 0, best = 0;
        for (int[] p : pairs) {
            minHeap.offer(p[0]);
            sum += p[0];
            if (minHeap.size() > k) sum -= minHeap.poll();         // drop the smallest nums1
            if (minHeap.size() == k) best = Math.max(best, sum * (long) p[1]);  // p[1] is the current min
        }
        return best;
    }
}`,
        walkthrough: [
          "nums1=[1,3,3,2], nums2=[2,1,3,4], k=3. Sorted by nums2 desc: (2,4),(3,3),(1,2),(3,1).",
          "Add (2,4): heap{2} sum2. Add (3,3): heap{2,3} sum5. Add (1,2): heap{2,3,1} sum6, size==3 → candidate 6*2=12.",
          "Add (3,1): heap size 4 → pop smallest 1, sum becomes 2+3+3=8, candidate 8*1=8. Best = 12.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → the heap holds one element; the score is each element's own nums1 × nums2, maximized.",
      "k = n → all elements chosen; the min nums2 is the global minimum and the sum is the total of nums1.",
      "Zeros present → a zero nums1 contributes nothing to the sum; a zero nums2 minimum forces that candidate score to 0.",
    ],
    twists: [
      "**IPO** (LeetCode 502) → a heap-greedy where availability changes as capital grows.",
      "**Find K Pairs with Smallest Sums** (LeetCode 373) → a heap over pairs of two arrays, minimizing instead of this max-product structure.",
      "**Maximum Performance of a Team** (LeetCode 1383) → the exact same sort-by-min-factor + size-k heap, with speed and efficiency.",
    ],
    related: ["ipo", "find-k-pairs-with-smallest-sums", "kth-largest-element-in-an-array"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "extra-characters-in-a-string",
    title: "Extra Characters in a String",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 2707,
    statement:
      "You are given a string `s` and a `dictionary` of words. Break `s` into one or more NON-OVERLAPPING substrings such that each substring is present in the dictionary. Some characters may be left over (not part of any chosen substring). Return the **minimum number of leftover (extra) characters**.",
    examples: [
      { in: 's = "leetscode", dictionary = ["leet","code","leetcode"]', out: "1", note: 'split as "leet" then "code" covering indices 0-3 and 5-8, leaving index 4 ("s") as the single extra' },
      { in: 's = "sayhelloworld", dictionary = ["hello","world"]', out: "3", note: 'the first three characters "say" are extra; "hello" and "world" cover the rest' },
    ],
    constraints: ["1 ≤ s.length ≤ 50", "1 ≤ dictionary.length ≤ 50", "1 ≤ dictionary[i].length ≤ 50", "dictionary[i] and s consist of only lowercase English letters", "dictionary words are distinct"],
    recognize:
      "Minimize leftover characters when tiling a string with dictionary words → **DP over suffixes** where dp[i] = minimum extras for s[i:], combined with a **trie of the dictionary** to enumerate, from position i, every dictionary word that matches in a single character walk. The trie turns 'which words start here?' into one descent instead of many comparisons.",
    figureItOut: [
      "At each position i in s I face a choice: either character s[i] is an EXTRA (cost 1, move to i+1), or some dictionary word starts at i and I jump past it (cost 0 for those characters). I want the minimum total extras, and the answer for position i depends only on positions after it — a classic suffix DP.",
      "Define dp[i] = minimum extra characters needed to cover the suffix s[i:]. The base case dp[n] = 0 (empty suffix, nothing extra). For position i, one option is treat s[i] as extra: 1 + dp[i+1]. The other option is, for every dictionary word w that exactly matches s starting at i, take 0 + dp[i + w.length()]. dp[i] is the minimum over all these.",
      "The recurring subproblem is 'which dictionary words match s starting exactly at index i?'. Checking each word with a substring compare is fine for these tiny limits, but the trie-flavoured way is to build a TRIE of the dictionary words and, from index i, walk the trie following s.charAt(i), s.charAt(i+1), ... ; whenever I pass through a node marked as a word end, I have found a matching word ending at that position and can relax dp[i] using dp[that position + 1].",
      "So I compute dp from i = n down to 0. At each i, start at the trie root and advance through s while the child exists; at every word-end node encountered, dp[i] = min(dp[i], dp[j+1]) where j is the current index. Also always allow dp[i] = min(dp[i], 1 + dp[i+1]) for skipping s[i] as extra. The trie walk finds ALL matching words in one left-to-right scan from i, sharing common prefixes, which is the efficiency the trie buys.",
    ],
    approaches: [
      {
        name: "Suffix DP with a HashSet of words (baseline)",
        intuition: "dp[i] = min extras for s[i:]; either skip s[i] as extra or match any dictionary word starting at i.",
        time: "O(n² · L)",
        timeWhy: "For each of n positions, try all O(n) end positions, each substring/lookup costing up to O(L).",
        space: "O(n + total word length)",
        spaceWhy: "The dp array plus the word set.",
        code: `class Solution {
    public int minExtraChar(String s, String[] dictionary) {
        Set<String> words = new HashSet<>(Arrays.asList(dictionary));
        int n = s.length();
        int[] dp = new int[n + 1];                  // dp[i] = min extras for s[i:]
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = 1 + dp[i + 1];                   // s[i] is extra
            for (int j = i + 1; j <= n; j++) {
                if (words.contains(s.substring(i, j))) {
                    dp[i] = Math.min(dp[i], dp[j]);  // word s[i:j] consumed for free
                }
            }
        }
        return dp[0];
    }
}`,
      },
      {
        name: "Suffix DP driven by a trie of dictionary words (optimal)",
        intuition: "Build a trie of the words; from each position walk the trie once over s and relax dp at every word-end node reached.",
        time: "O(n² + total word length)",
        timeWhy: "Building the trie is linear in total word length; from each of n positions the trie walk advances at most n characters, giving O(n²) overall.",
        space: "O(total word length)",
        spaceWhy: "The trie stores one node per distinct prefix character across all words, plus the dp array.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[26];
        boolean isWord = false;
    }

    public int minExtraChar(String s, String[] dictionary) {
        TrieNode root = new TrieNode();
        for (String w : dictionary) {                 // build the dictionary trie
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                int idx = c - "a".charAt(0);
                if (cur.child[idx] == null) cur.child[idx] = new TrieNode();
                cur = cur.child[idx];
            }
            cur.isWord = true;
        }

        int n = s.length();
        int[] dp = new int[n + 1];                    // dp[i] = min extras for s[i:]
        for (int i = n - 1; i >= 0; i--) {
            dp[i] = 1 + dp[i + 1];                     // treat s[i] as extra
            TrieNode cur = root;
            for (int j = i; j < n; j++) {             // walk the trie along s from i
                int idx = s.charAt(j) - "a".charAt(0);
                if (cur.child[idx] == null) break;     // no dictionary word continues this way
                cur = cur.child[idx];
                if (cur.isWord) dp[i] = Math.min(dp[i], dp[j + 1]);   // word s[i..j] matched
            }
        }
        return dp[0];
    }
}`,
        walkthrough: [
          's="leetscode", dict trie has "leet","code","leetcode". Compute dp right to left; dp[9]=0.',
          'At i=5 the trie walk spells c-o-d-e reaching a word-end at j=8 → dp[5] = dp[9] = 0. At i=0 the walk spells l-e-e-t (word-end at j=3) → dp[0] = min(dp[0], dp[4]).',
          'dp[4] (the "s") cannot start any word, so dp[4] = 1 + dp[5] = 1. Thus dp[0] = 1 → one extra character.',
        ],
      },
    ],
    edgeCases: [
      "No dictionary word matches anywhere → every character is extra; the answer is s.length().",
      "The whole string is a single dictionary word → zero extras.",
      "Overlapping candidate words from the same position → the trie walk relaxes dp at each word-end, so the best split wins.",
    ],
    twists: [
      "**Word Break** (LeetCode 139) → ask only whether a clean split with ZERO extras exists (boolean).",
      "**Word Break II** (LeetCode 140) → enumerate all sentences that fully tile s with dictionary words.",
      "**Concatenated Words** (LeetCode 472) → find words themselves formed by concatenating other dictionary words.",
    ],
    related: ["word-break", "word-break-ii", "concatenated-words"],
  },

  {
    slug: "longest-common-suffix-queries",
    title: "Longest Common Suffix Queries",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 3093,
    statement:
      "You are given arrays of strings `wordsContainer` and `wordsQuery`. For each query string, find the string in `wordsContainer` that shares the **longest common suffix** with it. If several share the longest common suffix, pick the SHORTEST such container string; if still tied, pick the one with the SMALLEST index in `wordsContainer`. Return an array `ans` where `ans[i]` is the index of the chosen container string for `wordsQuery[i]`.",
    examples: [
      {
        in: 'wordsContainer = ["abcd","bcd","xbcd"], wordsQuery = ["cd","bcd","xyz"]',
        out: "[1,1,1]",
        note: 'all three containers end in "cd"/"bcd"; "bcd" (index 1) is shortest, so it wins the longest-suffix and tie rules for every query',
      },
      {
        in: 'wordsContainer = ["abcdefgh","poiuygh","ghghgh"], wordsQuery = ["gh","acbfgh","acbfegh"]',
        out: "[2,0,2]",
        note: 'longest shared suffixes resolve to indices 2, 0, and 2 respectively',
      },
    ],
    constraints: ["1 ≤ wordsContainer.length, wordsQuery.length ≤ 10⁴", "1 ≤ sum of wordsContainer[i].length ≤ 5·10⁵", "1 ≤ sum of wordsQuery[i].length ≤ 5·10⁵", "strings consist of lowercase English letters"],
    recognize:
      "Longest common SUFFIX matching against a set of strings → build a **trie of the container words inserted REVERSED** (so suffixes become prefixes), and at every trie node remember the BEST container index (shortest length, then smallest index) of all words passing through it. Each query, also reversed, walks down as far as it can and reads the best index off the deepest node reached.",
    figureItOut: [
      "A common SUFFIX is a common ending. Tries naturally compare from the FRONT (prefixes), not the back. The standard trick to turn a suffix problem into a prefix problem is to REVERSE the strings: the longest common suffix of two strings equals the longest common PREFIX of their reverses. So I will insert every container word reversed and query with reversed query strings.",
      "I build a trie from the reversed container words. As I insert each word, every node it passes through represents a particular suffix (in reverse). At each such node I want to record which container word is BEST for that suffix — best meaning shortest length, breaking ties by smallest original index, since those are the tie rules.",
      "So each trie node stores a 'bestIndex' and the length/index it corresponds to. When inserting word w (reversed) with index i, at every node along its path I compare w against the node's current best and keep whichever is shorter (or smaller index on a tie). I also seed the ROOT with the best overall word, because a query that shares NO suffix still must return the globally shortest/smallest-index container (matching at the empty suffix).",
      "To answer a query, reverse it and walk down the trie following its characters as far as children exist. The DEEPEST node reached corresponds to the longest matching common suffix; its stored bestIndex is the answer. If the walk cannot even take the first step, I stop at the root, whose bestIndex is the global best — exactly the no-shared-suffix case. Because best info is precomputed at every node during insertion, each query is just a walk of its own length.",
    ],
    approaches: [
      {
        name: "Trie of reversed container words with best-index per node (optimal)",
        intuition: "Reverse everything so suffixes become prefixes; store the shortest (then smallest-index) container word at each trie node; each query reads the best index off its deepest reachable node.",
        time: "O(C + Q)",
        timeWhy: "C is the total length of container words (building/annotating the trie) and Q the total query length (each query walks its own characters once).",
        space: "O(C)",
        spaceWhy: "The trie holds one node per distinct reversed-prefix across all container words.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[26];
        int bestIndex;
        int bestLen;
    }

    public int[] stringIndices(String[] wordsContainer, String[] wordsQuery) {
        TrieNode root = new TrieNode();
        root.bestLen = Integer.MAX_VALUE;

        for (int i = 0; i < wordsContainer.length; i++) {
            String w = wordsContainer[i];
            int len = w.length();
            // root represents the empty suffix: keep the globally shortest / smallest-index word
            if (len < root.bestLen) { root.bestLen = len; root.bestIndex = i; }
            TrieNode cur = root;
            for (int p = len - 1; p >= 0; p--) {           // walk the word in reverse
                int idx = w.charAt(p) - "a".charAt(0);
                if (cur.child[idx] == null) {
                    cur.child[idx] = new TrieNode();
                    cur.child[idx].bestLen = Integer.MAX_VALUE;
                }
                cur = cur.child[idx];
                if (len < cur.bestLen) { cur.bestLen = len; cur.bestIndex = i; }  // shorter wins; first index breaks ties
            }
        }

        int[] ans = new int[wordsQuery.length];
        for (int q = 0; q < wordsQuery.length; q++) {
            String query = wordsQuery[q];
            TrieNode cur = root;
            for (int p = query.length() - 1; p >= 0; p--) {   // walk the query in reverse
                int idx = query.charAt(p) - "a".charAt(0);
                if (cur.child[idx] == null) break;             // no longer suffix matches
                cur = cur.child[idx];
            }
            ans[q] = cur.bestIndex;                            // deepest reachable node holds the best index
        }
        return ans;
    }
}`,
        walkthrough: [
          'wordsContainer=["abcd","bcd","xbcd"]. Reversed insertions share the path d-c-b. At those nodes "bcd" (len 3, index 1) beats "abcd" and "xbcd" (len 4).',
          'Query "cd" reversed walks d-c, reaching a node whose bestIndex is 1. Query "bcd" reversed walks d-c-b, still bestIndex 1.',
          'Query "xyz" reversed cannot match any first character, stays at root; root.bestIndex is 1 (shortest container) → answer 1. Results [1,1,1].',
        ],
      },
    ],
    edgeCases: [
      "Query shares no suffix with any container → the walk stays at the root and returns the globally shortest / smallest-index container.",
      "Ties on suffix length → the per-node best keeps the shortest word, then the smallest index, exactly per the rules.",
      "Reversing is essential → a forward (prefix) trie would answer the wrong question.",
    ],
    twists: [
      "**Longest common PREFIX queries** → insert and query the strings forward instead of reversed.",
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → the underlying insert/search machinery used here.",
      "**Replace Words** (LeetCode 648) → a prefix-trie that swaps each word for its shortest dictionary root.",
    ],
    related: ["implement-trie-prefix-tree", "replace-words", "maximum-xor-of-two-numbers-in-an-array"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "maximum-profit-in-job-scheduling",
    title: "Maximum Profit in Job Scheduling",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 1235,
    statement:
      "You have `n` jobs, where job i runs over the half-open interval [startTime[i], endTime[i]) and pays profit[i]. You may take any subset of jobs as long as **no two chosen jobs overlap in time** (a job ending exactly when another starts is allowed). Return the **maximum profit** achievable.",
    examples: [
      {
        in: "startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]",
        out: "120",
        note: "take job 0 ([1,3) profit 50) and job 3 ([3,6) profit 70); they do not overlap; total 120",
      },
      { in: "startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60]", out: "150" },
      { in: "startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4]", out: "6", note: "the three jobs all overlap at time 1, so take the single best, profit 6" },
    ],
    constraints: ["1 ≤ startTime.length == endTime.length == profit.length ≤ 5·10⁴", "1 ≤ startTime[i] < endTime[i] ≤ 10⁹", "1 ≤ profit[i] ≤ 10⁴"],
    recognize:
      "Pick non-overlapping intervals to MAXIMIZE total weight (profit) → weighted interval scheduling: **sort jobs by end time**, then DP where dp[i] = max profit using the first i jobs; for each job, binary-search the latest earlier job that ends at or before this job's start and take max(skip it, take it + dp[that job]). The end-time sort plus binary search is the signature.",
    figureItOut: [
      "Greedy 'always take the next job that fits' works for maximizing the COUNT of non-overlapping intervals, but here jobs have different PROFITS, so a short high-paying job can beat several cheap ones. Greedy by end time fails; this needs dynamic programming — weighted interval scheduling.",
      "Sort jobs by END time. Processing in that order means that when I consider job i, every job that could come BEFORE it (end at or before job i's start) has already been processed, so its best-profit value is known. Define dp[i] = the maximum profit considering the first i jobs (in end-time order).",
      "For each job i I have a binary choice. SKIP it: dp[i] = dp[i-1]. TAKE it: I earn profit[i] plus the best profit from jobs that finish at or before job i's start time — call that index p, the latest job whose end <= job i's start. So take-value = profit[i] + dp[p]. dp[i] = max(skip, take).",
      "Finding p is the key sub-step: among jobs sorted by end time, I want the last one whose end <= the current job's start. Because ends are sorted, that is a BINARY SEARCH over end times — exactly the interval-scheduling flavour. Half-open intervals mean a job ending at time t does not conflict with one starting at t, so the comparison is end <= start (not strict). Times reach 10^9 so I binary-search on values directly rather than indexing an array of times.",
    ],
    approaches: [
      {
        name: "Sort by end time, DP with binary search for the last compatible job (optimal)",
        intuition: "After sorting by end, each job either is skipped or taken atop the best profit from jobs finishing by its start, located via binary search.",
        time: "O(n log n)",
        timeWhy: "Sorting is O(n log n); each of n jobs does one O(log n) binary search.",
        space: "O(n)",
        spaceWhy: "The sorted job array and the dp array of size n+1.",
        code: `class Solution {
    public int jobScheduling(int[] startTime, int[] endTime, int[] profit) {
        int n = startTime.length;
        int[][] jobs = new int[n][3];                  // {start, end, profit}
        for (int i = 0; i < n; i++) {
            jobs[i][0] = startTime[i];
            jobs[i][1] = endTime[i];
            jobs[i][2] = profit[i];
        }
        Arrays.sort(jobs, (a, b) -> a[1] - b[1]);      // by end time ascending

        int[] ends = new int[n];
        for (int i = 0; i < n; i++) ends[i] = jobs[i][1];

        int[] dp = new int[n + 1];                     // dp[i] = best profit using jobs[0..i-1]
        for (int i = 0; i < n; i++) {
            int p = lastCompatible(ends, jobs[i][0], i);   // latest job (among 0..i-1) ending <= this start
            int take = jobs[i][2] + dp[p + 1];
            dp[i + 1] = Math.max(dp[i], take);
        }
        return dp[n];
    }

    // largest index j < i with ends[j] <= start; -1 if none
    int lastCompatible(int[] ends, int start, int i) {
        int lo = 0, hi = i - 1, res = -1;
        while (lo <= hi) {
            int mid = (lo + hi) >>> 1;
            if (ends[mid] <= start) { res = mid; lo = mid + 1; } else hi = mid - 1;
        }
        return res;
    }
}`,
        walkthrough: [
          "jobs sorted by end: [1,3,50],[2,4,10],[3,5,40],[3,6,70]. ends=[3,4,5,6]. dp[0]=0.",
          "Job [1,3,50]: no earlier job (p=-1) → take 50; dp[1]=50. Job [2,4,10]: p=-1 → max(50, 10)=50; dp[2]=50.",
          "Job [3,5,40]: last end<=3 is job0 (p=0) → take 40+dp[1]=90; dp[3]=90. Job [3,6,70]: p=0 → take 70+dp[1]=120; dp[4]=max(90,120)=120. Answer 120.",
        ],
      },
    ],
    edgeCases: [
      "All jobs overlap at one instant → no two can be combined; the answer is the single highest profit.",
      "A job ends exactly when another starts → half-open intervals make them compatible (end <= start).",
      "One job only → take it; dp returns its profit.",
    ],
    twists: [
      "**Non-overlapping Intervals** (LeetCode 435) → the unweighted cousin, solved greedily by removing fewest intervals.",
      "**Maximum Number of Events That Can Be Attended** (LeetCode 1353) → attend one unit per day with a heap, maximizing count.",
      "**Merge Intervals** (LeetCode 56) → the basic end-sorted interval sweep without profits.",
    ],
    related: ["non-overlapping-intervals", "merge-intervals", "minimum-number-of-arrows-to-burst-balloons"],
  },
];
