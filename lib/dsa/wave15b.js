// NeetCode All + Top Interview 150 / LeetCode 75 / Grind 75 — wave 15b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave14b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE15B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "binary-tree-vertical-order-traversal",
    title: "Binary Tree Vertical Order Traversal",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 314,
    statement:
      "Given the `root` of a binary tree, return the **vertical order traversal** of its node values. Group nodes by their horizontal column (the root is column 0, a left child is column − 1, a right child is column + 1), output columns left to right, and within a column list nodes top to bottom. Nodes in the same column AND the same row should appear left to right (i.e. in the order a level-by-level scan visits them).",
    examples: [
      { in: "root = [3,9,20,null,null,15,7]", out: "[[9],[3,15],[20],[7]]", note: "column −1 holds 9; column 0 holds 3 then 15; column 1 holds 20; column 2 holds 7" },
      { in: "root = [1,2,3,4,5,6,7]", out: "[[4],[2],[1,5,6],[3],[7]]", note: "the root row puts 5 and 6 in column 0; they share a column and are ordered left to right by the level scan" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "Group nodes by a horizontal COLUMN index where left = −1 and right = +1, output columns left to right, top to bottom → **BFS carrying a column label** for every node, bucketing values into a map column -> list. BFS (not DFS) guarantees the top-to-bottom and same-row left-to-right ordering for free; a min/max column tracker lets you emit columns in order without sorting.",
    figureItOut: [
      "Every node has a natural column: start the root at 0, going left subtracts 1, going right adds 1. So I can label each node with a column number as I traverse. The output groups nodes by that label, leftmost column first. That immediately suggests a map from column -> list of values.",
      "The ordering INSIDE a column is the subtle part: top rows before bottom rows, and ties within a row resolved left to right. A depth-first traversal would visit a deep left node before a shallow right node in the same column, scrambling the row order. A breadth-first scan visits strictly by increasing depth, and within a depth left before right — which is exactly the ordering the problem wants. So BFS is the right engine, not DFS.",
      "I run BFS with a queue of (node, column) pairs. Each dequeue appends node.val to map[column]; enqueuing the left child with column−1 and the right child with column+1. Because BFS processes row by row and left-to-right, each column list naturally accumulates in the required order without any later sorting of values.",
      "Finally I need the columns themselves emitted left to right. I could sort the map keys, but it is cheaper to track the minimum and maximum column seen during BFS, then iterate from min to max reading each bucket. That keeps the whole thing linear apart from the map lookups, and handles negative columns cleanly.",
    ],
    approaches: [
      {
        name: "BFS carrying a column label, bucket into a map, emit min..max (optimal)",
        intuition: "Label the root column 0 and breadth-first expand; append each value to its column bucket; read buckets from the smallest column to the largest.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued once; emitting the buckets touches each value once more.",
        space: "O(n)",
        spaceWhy: "The queue and the column map together hold all n nodes.",
        code: `class Solution {
    public List<List<Integer>> verticalOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Map<Integer, List<Integer>> columns = new HashMap<>();
        Queue<TreeNode> nodes = new LinkedList<>();
        Queue<Integer> cols = new LinkedList<>();
        nodes.offer(root);
        cols.offer(0);
        int minCol = 0, maxCol = 0;

        while (!nodes.isEmpty()) {
            TreeNode node = nodes.poll();
            int col = cols.poll();
            columns.computeIfAbsent(col, k -> new ArrayList<>()).add(node.val);
            minCol = Math.min(minCol, col);
            maxCol = Math.max(maxCol, col);
            if (node.left != null)  { nodes.offer(node.left);  cols.offer(col - 1); }
            if (node.right != null) { nodes.offer(node.right); cols.offer(col + 1); }
        }

        for (int c = minCol; c <= maxCol; c++) result.add(columns.get(c));
        return result;
    }
}`,
        walkthrough: [
          "root=[3,9,20,null,null,15,7]. BFS: (3,0) -> column0 gets 3; enqueue (9,-1),(20,1).",
          "(9,-1) -> column-1 gets 9; (20,1) -> column1 gets 20; enqueue (15,0),(7,2). (15,0) -> column0 gets 15; (7,2) -> column2 gets 7.",
          "min=-1, max=2. Emit columns -1..2: [[9],[3,15],[20],[7]].",
        ],
      },
    ],
    edgeCases: [
      "Empty tree → return an empty list immediately.",
      "Two nodes landing in the same column and row → BFS visits the left one first, so it is listed before the right one.",
      "A deep left subtree pulling columns far negative → the min/max tracker keeps the emit loop correct without sorting.",
    ],
    twists: [
      "**Vertical Order Traversal of a Binary Tree** (LeetCode 987) → same columns, but same-row ties break by VALUE, forcing a sort within each (column,row) cell.",
      "**Binary Tree Level Order Traversal** (LeetCode 102) → group by ROW instead of column; plain BFS without the column label.",
      "**Top view / bottom view of a binary tree** → keep only the first (or last) value seen per column during BFS.",
    ],
    related: ["binary-tree-level-order-traversal", "binary-tree-right-side-view", "binary-tree-zigzag-level-order-traversal"],
  },

  {
    slug: "most-frequent-subtree-sum",
    title: "Most Frequent Subtree Sum",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 508,
    statement:
      "Given the `root` of a binary tree, the **subtree sum** of a node is the sum of all values in the subtree rooted at that node (including the node itself). Return all subtree sums that occur the **most frequently**. If there is a tie, return all of the tied sums in any order.",
    examples: [
      { in: "root = [5,2,-3]", out: "[2,-3,4]", note: "subtree sums are 2, -3, and 5+2+(-3)=4; each occurs once, so all are returned" },
      { in: "root = [5,2,-5]", out: "[2]", note: "subtree sums are 2, -5, and 2; the sum 2 occurs twice, more than any other" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁴", "−10⁵ ≤ Node.val ≤ 10⁵"],
    recognize:
      "Compute a value for every subtree (its total sum) then report the most common → **post-order DFS that returns the subtree sum**, tallying each sum in a hash map as the recursion unwinds. After one pass, scan the map for the maximum frequency and collect every sum achieving it. The post-order return value IS the subtree sum.",
    figureItOut: [
      "A subtree sum needs the sums of both children first, then adds the node value. That dependency — children before parent — is the definition of POST-ORDER traversal. So I write a recursion that returns the sum of the subtree below the current node.",
      "The recursion is short: sum = node.val + dfs(left) + dfs(right), with a null node contributing 0. The trick is that while computing each node's sum I also RECORD it. So I pass a hash map count: each time a node finishes, I do count[sum] += 1. One DFS pass therefore fills the frequency of every distinct subtree sum.",
      "After the pass I have a map from subtree-sum to how many subtrees had that sum. The answer is every sum tied for the highest frequency. So I first find the maximum frequency in the map, then collect all keys whose frequency equals it. Two scans of the map, both linear in the number of distinct sums.",
      "A couple of correctness checks: values can be negative, so sums can be negative and even repeat by coincidence — the hash map keyed by the integer sum handles that fine. And every node contributes exactly one subtree sum (its own), so the total tallied count equals the node count, confirming nothing is double-counted or missed.",
    ],
    approaches: [
      {
        name: "Post-order DFS returning subtree sums, tally in a map (optimal)",
        intuition: "Recurse to get each subtree sum, count every sum in a hash map, then return all sums tied for the top frequency.",
        time: "O(n)",
        timeWhy: "One post-order pass over n nodes, then two linear scans of a map with at most n entries.",
        space: "O(n)",
        spaceWhy: "The frequency map can hold up to n distinct sums, plus the recursion stack up to the tree height.",
        code: `class Solution {
    private Map<Integer, Integer> count = new HashMap<>();
    private int maxFreq = 0;

    public int[] findFrequentTreeSum(TreeNode root) {
        subtreeSum(root);
        List<Integer> answer = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : count.entrySet()) {
            if (e.getValue() == maxFreq) answer.add(e.getKey());
        }
        int[] result = new int[answer.size()];
        for (int i = 0; i < result.length; i++) result[i] = answer.get(i);
        return result;
    }

    int subtreeSum(TreeNode node) {
        if (node == null) return 0;
        int sum = node.val + subtreeSum(node.left) + subtreeSum(node.right);
        int freq = count.merge(sum, 1, Integer::sum);
        maxFreq = Math.max(maxFreq, freq);            // track the running best frequency
        return sum;
    }
}`,
        walkthrough: [
          "root=[5,2,-5]. Post-order: left child 2 has subtree sum 2, count{2:1}. Right child -5 has sum -5, count{2:1,-5:1}.",
          "Root 5: sum = 5 + 2 + (-5) = 2, count{2:2,-5:1}. maxFreq becomes 2.",
          "Scan the map for frequency 2 → only the key 2 qualifies → return [2].",
        ],
      },
    ],
    edgeCases: [
      "Single node → its value is the only subtree sum, frequency 1, returned alone.",
      "All distinct sums → every sum ties at frequency 1 and all are returned.",
      "Negative values producing the same sum by coincidence → the integer-keyed map counts them together correctly.",
    ],
    twists: [
      "**Path Sum III** (LeetCode 437) → count downward paths summing to a target, using a prefix-sum map instead of subtree sums.",
      "**Sum of Distances in Tree** (LeetCode 834) → a two-pass subtree aggregation that also rolls sums upward then re-roots.",
      "**Equal Tree Partition** (LeetCode 663) → use the same subtree sums to check whether one edge split halves the total.",
    ],
    related: ["path-sum-iii", "binary-tree-maximum-path-sum", "find-duplicate-subtrees"],
  },

  {
    slug: "delete-leaves-with-a-given-value",
    title: "Delete Leaves With a Given Value",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1325,
    statement:
      "Given the `root` of a binary tree and an integer `target`, delete all **leaf nodes** whose value equals `target`. After deleting such a leaf, its parent may itself BECOME a leaf with value `target` — if so, it must be deleted too, and so on cascading upward. Return the root of the resulting tree (which may be null).",
    examples: [
      { in: "root = [1,2,3,2,null,2,4], target = 2", out: "[1,null,3,null,4]", note: "the two leaf 2 nodes are removed; their parent (the left 2) then becomes a leaf 2 and is removed too" },
      { in: "root = [1,3,3,3,2], target = 3", out: "[1,3,null,null,2]", note: "the leaf 3 is removed, but the inner 3 with child 2 is not a leaf so it stays" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 3000", "1 ≤ Node.val, target ≤ 10⁴"],
    recognize:
      "Delete matching leaves with cascading removal up toward the root → **post-order DFS that returns the (possibly null) rebuilt subtree**. Process children FIRST so a node sees its already-pruned children, then decide whether it has itself become a deletable leaf. Bottom-up is what makes the cascade automatic in a single pass.",
    figureItOut: [
      "The cascade is the heart of this: deleting a leaf can turn its parent into a leaf, which may also need deleting. If I deleted top-down, after removing a leaf I would have to re-examine the parent — awkward and possibly repeated. If instead I work BOTTOM-UP, by the time I look at a node its children have already been fully pruned, so I can decide its fate in one shot.",
      "Bottom-up means POST-ORDER DFS, and the cleanest formulation has the recursion RETURN the new subtree (a node or null). For a node I first recurse left and right, REASSIGNING node.left = dfs(node.left) and node.right = dfs(node.right). After that, node.left and node.right reflect any deletions below.",
      "Now the local rule: a node should be deleted exactly when, after its children are pruned, it is a leaf (both children null) AND its value equals target. In that case I return null to my parent, signalling I am gone. Otherwise I return the node unchanged. Because the children were pruned before this check, a parent that just lost both children is correctly recognised as a new leaf.",
      "The recursion ripples the cascade upward for free: removing both children of a parent makes the parent a leaf, and if its value is target the SAME post-order check at the parent deletes it too, returning null further up. One traversal handles arbitrarily long chains of cascading deletions. The final return value handles the case where the whole tree collapses to null.",
    ],
    approaches: [
      {
        name: "Post-order DFS reassigning children, prune matching leaves (optimal)",
        intuition: "Prune both children first, then if the node has become a target-valued leaf return null so the deletion cascades upward.",
        time: "O(n)",
        timeWhy: "Each node is visited once in post-order with O(1) work to test the leaf condition.",
        space: "O(h)",
        spaceWhy: "Recursion stack proportional to the tree height h (O(n) for a skewed tree).",
        code: `class Solution {
    public TreeNode removeLeafNodes(TreeNode root, int target) {
        if (root == null) return null;
        root.left = removeLeafNodes(root.left, target);    // prune children first
        root.right = removeLeafNodes(root.right, target);
        if (root.left == null && root.right == null && root.val == target) {
            return null;                                    // now a target leaf: delete it
        }
        return root;
    }
}`,
        walkthrough: [
          "root=[1,2,3,2,null,2,4], target=2. Post-order reaches the leaf 2 under the left 2 → returns null; the left 2 now has both children null.",
          "Back at the left 2: both children null and val == 2 → returns null, so root.left becomes null (the cascade).",
          "The right side: leaf 2 deleted, leaving 3 with child 4 (not a leaf, stays). Root 1 keeps its right child → result [1,null,3,null,4].",
        ],
      },
    ],
    edgeCases: [
      "Entire tree is deletable (e.g. a single leaf equal to target) → the top-level call returns null.",
      "An inner node equal to target but with a surviving child → it is not a leaf, so it stays.",
      "Long cascading chain → the post-order check fires repeatedly up the chain in one pass.",
    ],
    twists: [
      "**Trim a Binary Search Tree** (LeetCode 669) → similar return-the-subtree recursion, but prune by a value RANGE using BST order.",
      "**Binary Tree Pruning** (LeetCode 814) → delete every subtree containing no 1, the same bottom-up prune with a different condition.",
      "**Delete Node in a BST** (LeetCode 450) → single-node deletion with successor splicing rather than cascading leaves.",
    ],
    related: ["delete-node-in-a-bst", "binary-tree-maximum-path-sum", "invert-binary-tree"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "add-two-numbers-ii",
    title: "Add Two Numbers II",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 445,
    statement:
      "You are given two non-empty linked lists representing two non-negative integers. The MOST significant digit comes first (i.e. the number is read in normal forward order), and each node holds a single digit. Add the two numbers and return the sum as a linked list, again most-significant digit first. You may not modify the input lists (no reversing them in place is the intended challenge).",
    examples: [
      { in: "l1 = [7,2,4,3], l2 = [5,6,4]", out: "[7,8,0,7]", note: "7243 + 564 = 7807" },
      { in: "l1 = [2,4,3], l2 = [5,6,4]", out: "[8,0,7]", note: "243 + 564 = 807" },
      { in: "l1 = [0], l2 = [0]", out: "[0]", note: "0 + 0 = 0" },
    ],
    constraints: ["the number of nodes in each list is in [1, 100]", "0 ≤ Node.val ≤ 9", "neither number has leading zeros except the number 0 itself"],
    recognize:
      "Add digit lists where the most significant digit comes FIRST and you cannot reverse → addition naturally proceeds from the LEAST significant digit, so push both lists onto **two stacks**, pop in lockstep adding with carry, and PREPEND each result digit to the output. Stacks give you back-to-front access without mutating the inputs.",
    figureItOut: [
      "Addition works from the LEAST significant digit upward, carrying as you go. But here the least significant digit is at the END of each list, and singly linked lists only let me walk front to back. So I need a way to consume the lists from the back.",
      "The clean trick for back-to-front access without reversing the lists is a STACK. I push all of l1 digits onto stack1 and all of l2 digits onto stack2. Now popping each stack yields digits from least significant to most significant — exactly addition order — and the original lists are untouched.",
      "I add in a loop: while either stack is non-empty or a carry remains, I pop a digit from each (treating an empty stack as 0), sum them with the running carry, take sum % 10 as the new digit and sum / 10 as the next carry. The result digit I produce is also least-significant-first, but the output must be most-significant-first.",
      "So instead of appending, I PREPEND each new digit to the front of the result list: create a node for the digit and point it at the current head, then make it the new head. Building front-ward as I generate least-to-most reverses the order for me, yielding a correctly ordered most-significant-first answer. The final carry, if any, gets prepended last as the leading digit.",
    ],
    approaches: [
      {
        name: "Two stacks, add with carry, prepend result digits (optimal)",
        intuition: "Stack both lists so popping gives least-significant digits first; sum with carry and build the answer by prepending each digit.",
        time: "O(n + m)",
        timeWhy: "One pass to fill the stacks and one pass to drain them while summing.",
        space: "O(n + m)",
        spaceWhy: "Two stacks holding all digits of both lists; the output list is the answer itself.",
        code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Deque<Integer> s1 = new ArrayDeque<>();
        Deque<Integer> s2 = new ArrayDeque<>();
        for (ListNode n = l1; n != null; n = n.next) s1.push(n.val);
        for (ListNode n = l2; n != null; n = n.next) s2.push(n.val);

        ListNode head = null;
        int carry = 0;
        while (!s1.isEmpty() || !s2.isEmpty() || carry != 0) {
            int sum = carry;
            if (!s1.isEmpty()) sum += s1.pop();
            if (!s2.isEmpty()) sum += s2.pop();
            ListNode node = new ListNode(sum % 10);
            node.next = head;          // prepend: builds the list most-significant first
            head = node;
            carry = sum / 10;
        }
        return head;
    }
}`,
        walkthrough: [
          "l1=[7,2,4,3], l2=[5,6,4]. s1 (top first) = 3,4,2,7; s2 = 4,6,5.",
          "Pop 3+4=7 -> digit 7, head=[7]. Pop 4+6=10 -> digit 0 carry1, head=[0,7]. Pop 2+5+1=8 -> digit 8, head=[8,0,7]. Pop 7+0=7 -> digit 7, head=[7,8,0,7].",
          "Both stacks empty, carry 0 -> return [7,8,0,7].",
        ],
      },
    ],
    edgeCases: [
      "A final carry out of the most significant digit → the loop runs once more on carry != 0 and prepends the leading 1.",
      "Lists of different lengths → the empty stack contributes 0 once it is drained.",
      "Both numbers zero → one iteration produces a single [0] node.",
    ],
    twists: [
      "**Add Two Numbers** (LeetCode 2) → digits are stored least-significant first, so you add front to back with no stacks at all.",
      "**Reverse both lists, add, reverse the result** → an alternative if mutating is allowed; the stacks avoid reversing entirely.",
      "**Multiply two numbers as lists** → a harder variant needing per-digit products and shifted accumulation.",
    ],
    related: ["add-two-numbers", "reverse-linked-list", "merge-two-sorted-lists"],
  },

  {
    slug: "next-greater-node-in-linked-list",
    title: "Next Greater Node In Linked List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 1019,
    statement:
      "You are given the `head` of a linked list with `n` nodes. For each node, find the value of the **first node that comes after it whose value is strictly greater**. Return an integer array `answer` of length `n` where `answer[i]` is the next greater value for the i-th node (0-indexed), or 0 if no such later node exists.",
    examples: [
      { in: "head = [2,1,5]", out: "[5,5,0]", note: "after 2 the first greater is 5; after 1 it is 5; after 5 there is none -> 0" },
      { in: "head = [2,7,4,3,5]", out: "[7,0,5,5,0]", note: "after 2 -> 7; after 7 nothing greater -> 0; after 4 -> 5; after 3 -> 5; after 5 -> 0" },
    ],
    constraints: ["the number of nodes is n", "1 ≤ n ≤ 10⁴", "1 ≤ Node.val ≤ 10⁹"],
    recognize:
      "Find the next strictly greater element to the RIGHT for every position → the classic **monotonic decreasing stack** holding INDICES of values still awaiting their next-greater. First materialise the list into an array (or process while building it), then sweep left to right: each new value pops every smaller pending index and is recorded as their answer.",
    figureItOut: [
      "This is the next-greater-element problem, just delivered as a linked list. The defining structure is: scanning left to right, when I meet a value, it might be the answer for several EARLIER values that were waiting for someone bigger. A monotonic stack is the tool that remembers exactly those waiting elements.",
      "Linked lists only allow forward traversal, but the algorithm only needs forward traversal too — provided I can index into the answer array. So first I copy the values into an array (or equivalently push answers as I go), giving me positions 0..n-1 to write results into. With n up to 10^4 this is trivial.",
      "Now the monotonic stack of INDICES, kept so the values they point to are decreasing from bottom to top. I walk i from 0 to n-1. Before placing i, I look at the stack top: while the value at the top index is strictly LESS than the current value vals[i], that earlier element has just found its next greater (which is vals[i]), so I pop it and set answer[that index] = vals[i]. I repeat until the top is not smaller, then push i.",
      "Anything still on the stack at the end never found a greater value to its right, so their answers stay 0 (the array default). Each index is pushed once and popped at most once, so the whole sweep is linear despite the inner while loop. Strictly greater (not >=) matches the problem and means equal values do not resolve each other.",
    ],
    approaches: [
      {
        name: "Values into an array, monotonic decreasing stack of indices (optimal)",
        intuition: "Sweep left to right; each value resolves every smaller pending index on the stack, then waits on the stack for its own next-greater.",
        time: "O(n)",
        timeWhy: "Each index is pushed once and popped once across the whole sweep; copying the list is one more linear pass.",
        space: "O(n)",
        spaceWhy: "The values array, the answer array, and a stack that holds at most n indices.",
        code: `class Solution {
    public int[] nextLargerNodes(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode n = head; n != null; n = n.next) vals.add(n.val);

        int n = vals.size();
        int[] answer = new int[n];                 // defaults to 0 = no greater element
        Deque<Integer> stack = new ArrayDeque<>();  // indices of values still waiting, values decreasing

        for (int i = 0; i < n; i++) {
            int cur = vals.get(i);
            while (!stack.isEmpty() && vals.get(stack.peek()) < cur) {
                answer[stack.pop()] = cur;          // cur is the next greater for that earlier index
            }
            stack.push(i);
        }
        return answer;
    }
}`,
        walkthrough: [
          "head=[2,7,4,3,5] -> vals=[2,7,4,3,5]. i=0 cur=2 stack empty -> push0 [0].",
          "i=1 cur=7: vals[0]=2<7 -> answer[0]=7, pop; push1 [1]. i=2 cur=4: vals[1]=7 not <4 -> push2 [1,2]. i=3 cur=3: vals[2]=4 not <3 -> push3 [1,2,3].",
          "i=4 cur=5: vals[3]=3<5 answer[3]=5 pop; vals[2]=4<5 answer[2]=5 pop; vals[1]=7 not <5 stop; push4. Leftover {1,4} stay 0 -> answer=[7,0,5,5,0].",
        ],
      },
    ],
    edgeCases: [
      "Strictly increasing list → every node resolves the one before it; only the last stays 0.",
      "Strictly decreasing list → nothing pops until the end; all answers remain 0.",
      "Equal adjacent values → strict comparison means an equal value does NOT count as greater, so they do not resolve each other.",
    ],
    twists: [
      "**Daily Temperatures** (LeetCode 739) → same monotonic stack but record the DISTANCE to the next greater rather than its value.",
      "**Next Greater Element II** (LeetCode 503) → a circular array, handled by sweeping the indices twice.",
      "**Process while building** → avoid the values array by pushing nodes directly, trading clarity for one fewer pass.",
    ],
    related: ["daily-temperatures", "reverse-linked-list", "remove-nth-node-from-end-of-list"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "minimum-cost-to-hire-k-workers",
    title: "Minimum Cost to Hire K Workers",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 857,
    statement:
      "There are `n` workers; worker i has a `quality[i]` and a minimum `wage[i]` expectation. You hire exactly `k` workers into a paid group under two rules: (1) every worker in the group is paid in PROPORTION to their quality relative to the others in the group, and (2) every worker is paid at least their minimum wage. Return the **least total amount** needed to form such a group. Answers within 10⁻⁵ of the correct value are accepted.",
    examples: [
      { in: "quality = [10,20,5], wage = [70,50,30], k = 2", out: "105.00000", note: "hire workers 0 and 2 at a ratio of 7 per quality unit: 70 + 35 = 105" },
      { in: "quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3", out: "30.66667", note: "the cheapest valid group of three under the proportional-pay rule" },
    ],
    constraints: ["n == quality.length == wage.length", "1 ≤ k ≤ n ≤ 10⁴", "1 ≤ quality[i], wage[i] ≤ 10⁴"],
    recognize:
      "Pay everyone proportional to quality at a single rate, satisfy each worker's minimum wage, minimize total over a size-k group → fix the **wage-per-quality RATIO** to each worker's wage/quality, sort workers by that ratio ascending, and sweep maintaining a **max-heap of the k smallest qualities**. At each worker the ratio is the group rate; cost = ratio × (sum of k qualities). Sort-by-ratio + size-k heap is the signature.",
    figureItOut: [
      "If everyone in a hired group is paid proportional to their quality at a single rate r (dollars per unit of quality), then worker i is paid r * quality[i]. For that to meet worker i's minimum, we need r * quality[i] >= wage[i], i.e. r >= wage[i] / quality[i]. So each worker imposes a lower bound on the group rate equal to their wage/quality ratio.",
      "Therefore the group rate r must be at least the LARGEST wage/quality ratio among the chosen workers — that worker is exactly paid their minimum, and everyone with a smaller ratio is paid above their minimum. The total cost is r * (sum of qualities in the group). To minimize, I want r small (so favour low-ratio workers) and the quality sum small.",
      "Sort the workers by their ratio ASCENDING. Now sweep: when I consider worker j, if j is in the group then r = ratio[j] is forced to be the maximum ratio of the group (because all earlier workers have ratio <= ratio[j]). The best companions are the k-1 workers with the SMALLEST qualities seen so far, to keep the quality sum down. A size-k MAX-heap of qualities maintains exactly the k smallest: when it overflows, pop the largest quality.",
      "So I keep a running sum of the qualities in the heap. After adding worker j and trimming the heap back to size k, if the heap holds exactly k workers then ratio[j] is the group rate and a candidate total is ratio[j] * qualitySum. I take the minimum candidate over the whole sweep. Using ratio[j] (the current maximum ratio) as the rate is valid because every heap member has ratio <= ratio[j]. This is O(n log n) from the sort plus O(n log k) heap work.",
    ],
    approaches: [
      {
        name: "Sort by wage/quality ratio, size-k max-heap of qualities (optimal)",
        intuition: "The group rate equals the largest ratio in the group, so sort by ratio and, fixing each worker as that maximum, keep the k smallest qualities to minimize the quality sum.",
        time: "O(n log n)",
        timeWhy: "Sorting the n workers dominates; each worker does O(log k) heap work during the sweep.",
        space: "O(n)",
        spaceWhy: "The array of (ratio, quality) pairs and a heap of up to k qualities.",
        code: `class Solution {
    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
        int n = quality.length;
        double[][] workers = new double[n][2];          // {ratio = wage/quality, quality}
        for (int i = 0; i < n; i++) {
            workers[i][0] = (double) wage[i] / quality[i];
            workers[i][1] = quality[i];
        }
        Arrays.sort(workers, (a, b) -> Double.compare(a[0], b[0]));   // by ratio ascending

        PriorityQueue<Double> maxHeap = new PriorityQueue<>(Collections.reverseOrder());  // largest quality on top
        double qualitySum = 0, best = Double.MAX_VALUE;
        for (double[] w : workers) {
            maxHeap.offer(w[1]);
            qualitySum += w[1];
            if (maxHeap.size() > k) qualitySum -= maxHeap.poll();      // drop the largest quality
            if (maxHeap.size() == k) best = Math.min(best, qualitySum * w[0]);  // w[0] is the group rate
        }
        return best;
    }
}`,
        walkthrough: [
          "quality=[10,20,5], wage=[70,50,30], k=2. Ratios: worker0 7.0, worker1 2.5, worker2 6.0. Sorted by ratio: (2.5,20),(6.0,5),(7.0,10).",
          "Add (2.5,20): heap{20} sum20, size1. Add (6.0,5): heap{20,5} sum25, size2 -> candidate 25*6.0 = 150.",
          "Add (7.0,10): heap{20,5,10} sum35, size3>2 -> pop 20, sum15. candidate 15*7.0 = 105. Best = min(150,105) = 105.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → each candidate is simply that worker's own minimum wage; the smallest is returned.",
      "k = n → the rate is the global maximum ratio times the total quality.",
      "Ties in ratio → ordering among equal ratios does not change the minimum, since either may serve as the maximum.",
    ],
    twists: [
      "**Maximum Performance of a Team** (LeetCode 1383) → sort by efficiency descending and keep the k largest speeds in a min-heap (a max instead of a min objective).",
      "**Maximum Subsequence Score** (LeetCode 2542) → the same sort-by-one-factor + size-k heap pattern with a product score.",
      "**IPO** (LeetCode 502) → heap-greedy selection where eligibility expands as capital grows.",
    ],
    related: ["maximum-performance-of-a-team", "maximum-subsequence-score", "ipo"],
  },

  {
    slug: "find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows",
    title: "Find the Kth Smallest Sum of a Matrix With Sorted Rows",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 1439,
    statement:
      "You are given an `m × n` matrix `mat` where every ROW is sorted in non-decreasing order, and an integer `k`. You may choose exactly one element from each row; the sum of the chosen elements forms an array sum. Return the **k-th smallest** array sum among all possible choices.",
    examples: [
      { in: "mat = [[1,3,11],[2,4,6]], k = 5", out: "7", note: "the smallest sums are 3,4,5,6,7,... ; the 5th is 7" },
      { in: "mat = [[1,3,11],[2,4,6]], k = 9", out: "17", note: "the 9th smallest array sum" },
      { in: "mat = [[1,10,10],[1,4,5],[2,3,6]], k = 7", out: "9", note: "combining three sorted rows, the 7th smallest total" },
    ],
    constraints: ["m == mat.length", "n == mat[i].length", "1 ≤ m, n ≤ 40", "1 ≤ mat[i][j] ≤ 5000", "1 ≤ k ≤ min(200, n^m)", "mat[i] is sorted in non-decreasing order"],
    recognize:
      "k-th smallest combined sum picking one per sorted row → fold the rows TWO AT A TIME, each time using a **min-heap (Dijkstra-like) over index pairs** to extract the k smallest pairwise sums, keeping only the best k after each merge. This generalises 'k smallest pairs from two arrays' across all rows while never letting the candidate set explode beyond k.",
    figureItOut: [
      "Enumerating every combination is n^m choices — far too many even at m=40, n=40. But I only need the k smallest sums (k <= 200), so I never need the full set; I need a way to grow the smallest sums incrementally.",
      "Start with the problem for TWO rows: given the k smallest sums achievable from rows processed so far (call it cur, sorted) and a new sorted row, I want the k smallest values of cur[i] + row[j]. This is exactly the classic 'k smallest pairs from two sorted arrays' problem, solved with a min-heap seeded from the smallest combinations and expanding neighbours, popping k times.",
      "So I FOLD: begin with cur = the first row (its smallest k entries). For each subsequent row, merge cur with that row using the heap-of-pairs routine to produce the new k smallest sums, and replace cur with that. After all rows are folded in, cur[k-1] is the answer. Truncating to k after every merge is what keeps the state tiny.",
      "The heap-of-pairs merge: push (cur[0]+row[0], 0, 0) and pop the smallest pair (i, j); each pop yields the next smallest sum and we push its neighbours (i+1, j) and (i, j+1), using a visited set to avoid pushing the same (i,j) twice. Pop until we have collected k sums or run out. Because each row contributes at most k useful entries and we pop k times per merge, the whole thing is about O(m * k log k).",
    ],
    approaches: [
      {
        name: "Fold rows pairwise, k-smallest-pairs min-heap each merge (optimal)",
        intuition: "Keep only the k smallest running sums; merge in each new row with a Dijkstra-style min-heap over (i,j) index pairs, taking the k smallest combined sums.",
        time: "O(m · k log k)",
        timeWhy: "Each of m−1 merges pops k times from a heap of size O(k), each pop costing O(log k).",
        space: "O(k)",
        spaceWhy: "The running list of k smallest sums plus a heap and visited set of size O(k) per merge.",
        code: `class Solution {
    public int kthSmallest(int[][] mat, int k) {
        int[] cur = mat[0].clone();                 // smallest sums so far = first row
        for (int r = 1; r < mat.length; r++) {
            cur = mergeSmallestK(cur, mat[r], k);
        }
        return cur[k - 1];
    }

    // return the k smallest values of a[i] + b[j]
    int[] mergeSmallestK(int[] a, int[] b, int k) {
        PriorityQueue<int[]> heap = new PriorityQueue<>((x, y) -> x[0] - y[0]);   // {sum, i, j}
        Set<Long> seen = new HashSet<>();
        heap.offer(new int[]{ a[0] + b[0], 0, 0 });
        seen.add(0L);

        int limit = Math.min(k, a.length * b.length);
        int[] result = new int[limit];
        for (int t = 0; t < limit; t++) {
            int[] top = heap.poll();
            result[t] = top[0];
            int i = top[1], j = top[2];
            if (i + 1 < a.length) {
                long key = (long)(i + 1) * b.length + j;
                if (seen.add(key)) heap.offer(new int[]{ a[i + 1] + b[j], i + 1, j });
            }
            if (j + 1 < b.length) {
                long key = (long) i * b.length + (j + 1);
                if (seen.add(key)) heap.offer(new int[]{ a[i] + b[j + 1], i, j + 1 });
            }
        }
        return result;
    }
}`,
        walkthrough: [
          "mat=[[1,3,11],[2,4,6]], k=5. cur = first row [1,3,11].",
          "Merge cur with [2,4,6]: pop 1+2=3, push (3+2,4) -> 5 and (1+4) -> 5. Continue popping 4,5,5,7... the 5 smallest are [3,4,5,5,7].",
          "Only two rows, so cur = [3,4,5,5,7]; cur[k-1] = cur[4] = 7.",
        ],
      },
    ],
    edgeCases: [
      "Single row → the answer is mat[0][k-1] directly; the fold loop never runs.",
      "Duplicate sums → the visited set prevents pushing the same (i,j) twice, but equal sums from distinct pairs are all counted.",
      "k smaller than the product of dimensions → limit = min(k, a.length*b.length) keeps the merge bounded.",
    ],
    twists: [
      "**Find K Pairs with Smallest Sums** (LeetCode 373) → the inner two-array merge on its own.",
      "**Kth Smallest Element in a Sorted Matrix** (LeetCode 378) → a single sorted matrix, solvable by binary search on the value.",
      "**Binary search on the sum** → an alternative O(m·n·log(range)) approach counting combinations below a candidate sum.",
    ],
    related: ["find-k-pairs-with-smallest-sums", "kth-smallest-element-in-a-sorted-matrix", "smallest-range-covering-elements-from-k-lists"],
  },

  {
    slug: "minimize-deviation-in-array",
    title: "Minimize Deviation in Array",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 1675,
    statement:
      "You are given an array `nums` of `n` positive integers. You may perform two operations any number of times on any element: if it is EVEN you may halve it, and if it is ODD you may double it. The **deviation** of the array is the difference between its maximum and its minimum element. Return the **minimum deviation** you can achieve.",
    examples: [
      { in: "nums = [1,2,3,4]", out: "1", note: "transform to [2,2,3,4]->[2,2,3,2]? best reachable deviation is 1 (e.g. [2,2,3,4] -> halve 4 -> [2,2,3,2], range becomes 3-2=1)" },
      { in: "nums = [4,1,5,20,3]", out: "3", note: "doubling odds then halving evens converges to a window of width 3" },
      { in: "nums = [2,10,8]", out: "3", note: "[2,10,8] -> [2,5,8] -> [2,5,4] gives range 5-2=3" },
    ],
    constraints: ["n == nums.length", "2 ≤ n ≤ 10⁵", "1 ≤ nums[i] ≤ 10⁹"],
    recognize:
      "Each value can move within a fixed reachable set (odd → its double; even → repeatedly halved) and you want to shrink max − min → first push every number to its MAXIMUM reachable value (double odds once), put them in a **max-heap**, and repeatedly halve the current maximum, tracking the running minimum and the smallest max−min seen. Halving only the max moves it toward the min, which is the right greedy.",
    figureItOut: [
      "Each number has a LIMITED set of reachable values. An odd number x can be doubled (to 2x, then it is even) and an even number can be halved while it stays even. So the reachable values of any element are a chain: an odd number reaches {x, 2x}; an even number reaches {x, x/2, x/4, ...} down to its largest odd divisor. Crucially, doubling an odd more than once is never useful since after one double it can only be halved back.",
      "To use both operations symmetrically, note: doubling odds first lets me normalise everything to a state where the only remaining operation is HALVING (you can always represent each element at its largest reachable value, an even number, and only go down from there). So I first double every odd number; now every element is at its MAXIMUM reachable value, and the only move left is to halve an even element.",
      "With only halving available, the deviation is max − min. Halving the MINIMUM would only make the min smaller and the gap wider — pointless. The productive move is to halve the current MAXIMUM, shrinking it toward the rest. So I keep a max-heap, repeatedly pop the maximum, record the current deviation (maxHeap top − running min), and if that maximum is even, halve it and push it back; if it is odd I cannot reduce it further, so I stop.",
      "The running MINIMUM is tracked separately: each time I push a halved value, it might become the new minimum, so I update min = min(min, halvedValue). The answer is the smallest (currentMax − min) observed across the process. The loop ends when the current maximum is odd (cannot be halved), because then no further reduction of the max is possible. Each element halves O(log(maxValue)) times, so total work is O(n log n · log(maxValue))-ish, dominated by heap operations.",
    ],
    approaches: [
      {
        name: "Double odds to the max, max-heap, repeatedly halve the maximum (optimal)",
        intuition: "Normalise every element to its largest reachable value, then shrink the deviation by halving the current maximum until it turns odd, tracking the minimum throughout.",
        time: "O(n log n · log M)",
        timeWhy: "Each element can be halved O(log M) times where M is the max value, and each heap operation is O(log n).",
        space: "O(n)",
        spaceWhy: "The max-heap holds all n elements.",
        code: `class Solution {
    public int minimumDeviation(int[] nums) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        int min = Integer.MAX_VALUE;
        for (int v : nums) {
            if (v % 2 == 1) v *= 2;            // odds doubled once to reach their maximum
            maxHeap.offer(v);
            min = Math.min(min, v);
        }

        int best = Integer.MAX_VALUE;
        while (true) {
            int max = maxHeap.poll();
            best = Math.min(best, max - min);  // current deviation
            if (max % 2 == 1) break;           // max is odd: cannot halve further, stop
            int halved = max / 2;
            min = Math.min(min, halved);       // halving may produce a new minimum
            maxHeap.offer(halved);
        }
        return best;
    }
}`,
        walkthrough: [
          "nums=[2,10,8]. No odds to double. Heap (max first) = {10,8,2}, min=2.",
          "Pop 10: deviation 10-2=8. Halve -> 5, min stays 2, push. Pop 8: deviation 8-2=6. Halve -> 4, push. Pop 5: deviation 5-2=3. 5 is odd -> stop.",
          "Best deviation seen = min(8,6,3) = 3.",
        ],
      },
    ],
    edgeCases: [
      "All elements equal → deviation 0 immediately (after any needed odd-doubling they stay equal or the first reading is 0).",
      "All odd → each doubles once; afterwards only halving applies and the loop proceeds normally.",
      "Stop condition is the max turning odd → halving an odd is impossible, so no further reduction of the maximum is achievable.",
    ],
    twists: [
      "**Reverse direction (minimize via doubling the min)** → an equivalent formulation halves everything to its minimum and repeatedly doubles the smallest; symmetric reasoning.",
      "**Maximum Subsequence Score** (LeetCode 2542) → unrelated objective but the same habit of fixing one extreme and sweeping with a heap.",
      "**IPO** (LeetCode 502) → heap-greedy where the chosen extreme drives the next state.",
    ],
    related: ["kth-largest-element-in-an-array", "find-median-from-data-stream", "maximum-subsequence-score"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "implement-magic-dictionary",
    title: "Implement Magic Dictionary",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 676,
    statement:
      "Design a data structure `MagicDictionary` with: `buildDict(words)` to initialise it with a list of distinct words, and `search(word)` returning true if you can change **exactly one** character of `word` to a DIFFERENT character so that the result is one of the dictionary words. (Changing zero characters does not count even if the word is already present.)",
    examples: [
      {
        in: 'buildDict(["hello","leetcode"]); search("hhllo")',
        out: "true",
        note: 'change the second h of "hhllo" to e -> "hello", which is in the dictionary (exactly one change)',
      },
      { in: 'buildDict(["hello"]); search("hello")', out: "false", note: "no single change yields a dictionary word; zero changes is not allowed" },
      { in: 'buildDict(["hello"]); search("hell")', out: "false", note: 'different length, so no single-character substitution can match' },
    ],
    constraints: ["1 ≤ words.length ≤ 100", "1 ≤ words[i].length ≤ 100", "words[i] consists of lowercase letters and are distinct", "1 ≤ search word length ≤ 100", "at most 100 calls to search"],
    recognize:
      "Match a query against a dictionary allowing EXACTLY one differing character → store the words in a **trie** and run a DFS over the query that carries a 'mistakes used' counter: at each character try the matching child with 0 mistakes and every other child with 1 mistake, succeeding only at a word-end with exactly one mistake spent. The trie shares prefixes so the branching stays cheap.",
    figureItOut: [
      "The search asks: is there a dictionary word of the SAME length that differs from the query in EXACTLY one position? Same length is required because substitution does not change length. So I am looking for a Hamming-distance-1 match against the dictionary.",
      "A trie is the natural store: insert every word character by character. To answer a query, I walk the trie alongside the query, but I am allowed to deviate at exactly one position. So I carry a counter of how many character changes I have used so far, and I must finish at a word-end node having used exactly one.",
      "The DFS at trie node `node`, query index `i`, and `changesUsed`: if i has reached the end of the query, I succeed only if node marks a complete word AND changesUsed == 1. Otherwise, for each existing child letter c: if c equals query[i] I can recurse with the same changesUsed (a free match); if c differs from query[i] I may recurse only if changesUsed == 0, spending my one allowed change to 1. Any branch returning true wins.",
      "This explores at most a small fan-out at the single position where the change happens and follows the unique matching path elsewhere, so it is efficient. The 'exactly one' rule falls out of requiring changesUsed == 1 at the word-end — a perfect match (zero changes) is rejected, and two or more changes are never allowed because a second deviation is blocked when changesUsed is already 1.",
    ],
    approaches: [
      {
        name: "Trie of dictionary words, DFS query with a single allowed change (optimal)",
        intuition: "Walk the query through the trie; at each step follow the exact child for free or any other child by spending the one permitted change, and accept only at a word-end with exactly one change spent.",
        time: "build O(total word length); search O(L · 26) worst case",
        timeWhy: "Insertion is linear in total characters; a search of length L touches each level with at most a 26-way branch where the single change is spent.",
        space: "O(total word length)",
        spaceWhy: "The trie stores one node per distinct prefix across all dictionary words.",
        code: `class MagicDictionary {
    static class TrieNode {
        TrieNode[] child = new TrieNode[26];
        boolean isWord = false;
    }

    private TrieNode root = new TrieNode();

    public void buildDict(String[] dictionary) {
        for (String w : dictionary) {
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                int idx = c - "a".charAt(0);
                if (cur.child[idx] == null) cur.child[idx] = new TrieNode();
                cur = cur.child[idx];
            }
            cur.isWord = true;
        }
    }

    public boolean search(String word) {
        return dfs(root, word, 0, 0);
    }

    private boolean dfs(TrieNode node, String word, int i, int changes) {
        if (i == word.length()) return node.isWord && changes == 1;   // exactly one change spent
        int want = word.charAt(i) - "a".charAt(0);
        for (int c = 0; c < 26; c++) {
            if (node.child[c] == null) continue;
            if (c == want) {
                if (dfs(node.child[c], word, i + 1, changes)) return true;        // free match
            } else if (changes == 0) {
                if (dfs(node.child[c], word, i + 1, 1)) return true;              // spend the one change
            }
        }
        return false;
    }
}`,
        walkthrough: [
          'buildDict(["hello"]). search("hhllo"): walk h (free), then at index1 the query char is h but dictionary needs e -> spend the one change taking child e, changes becomes 1.',
          "Continue l, l, o as free matches following the unique path; reach the end at a word-end node with changes == 1.",
          "The DFS returns true. For search(\"hello\") every path is a free match ending with changes == 0, so it returns false.",
        ],
      },
    ],
    edgeCases: [
      "Query already in the dictionary → all-free path ends with changes == 0, returns false (zero changes not allowed).",
      "Query length differs from every word → no same-length path exists; returns false.",
      "Multiple words share a long prefix → the trie collapses them, and only the single-change position branches.",
    ],
    twists: [
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → the underlying insert/search without the one-change rule.",
      "**Design Add and Search Words Data Structure** (LeetCode 211) → the wildcard '.' matches any letter, a related branching DFS.",
      "**Allow up to k changes** → generalise the counter to permit changesUsed <= k at the word-end.",
    ],
    related: ["implement-trie-prefix-tree", "design-add-and-search-words-data-structure", "replace-words"],
  },

  {
    slug: "sum-of-prefix-scores-of-strings",
    title: "Sum of Prefix Scores of Strings",
    difficulty: "Hard",
    pattern: "tries",
    leetcode: 2416,
    statement:
      "You are given an array `words`. The **score** of a string `term` is the number of strings in `words` that have `term` as a PREFIX (a string is a prefix of itself). For each `words[i]`, define its **prefix score** as the sum, over every non-empty prefix `p` of `words[i]`, of the score of `p`. Return an array `answer` where `answer[i]` is the prefix score of `words[i]`.",
    examples: [
      {
        in: 'words = ["abc","ab","bc","b"]',
        out: "[5,4,3,2]",
        note: 'for "abc": prefixes "a"(score 2),"ab"(2),"abc"(1) sum to 5; for "ab": "a"(2)+"ab"(2)=4; for "bc": "b"(2)+"bc"(1)=3; for "b": "b"(2)=2',
      },
      { in: 'words = ["abcd"]', out: "[4]", note: 'the four prefixes "a","ab","abc","abcd" each have score 1, summing to 4' },
    ],
    constraints: ["1 ≤ words.length ≤ 1000", "1 ≤ words[i].length ≤ 1000", "words[i] consists of lowercase English letters"],
    recognize:
      "Sum, over each word's prefixes, how many words share that prefix → build a **trie counting how many words pass through every node** (increment a passCount on each node during insertion). Then the prefix score of a word is just the sum of passCounts along its insertion path. Insert all words first, then re-walk each word adding node counts.",
    figureItOut: [
      "The score of a prefix p is how many words start with p. In a trie, every node corresponds to one prefix, and the number of words that start with that prefix is exactly the number of words whose insertion path PASSES THROUGH that node. So if each node records a passCount, the node for prefix p stores score(p) directly.",
      "So step one: insert every word into a trie and, at each node I touch while inserting a word, increment that node's passCount. After all insertions, node.passCount = the number of words sharing the prefix that the node represents. This is a single counting pass over all characters.",
      "Step two: the prefix score of a word is the sum of score(p) over all its non-empty prefixes. Walking the word through the trie visits exactly its prefix nodes in order: the first child is prefix of length 1, the next is length 2, and so on. So I re-walk the word and add up node.passCount at each step — that sum is the answer for that word.",
      "Why this is correct and efficient: the passCount captures the shared-prefix counting that a naive 'for each prefix, scan all words' would recompute repeatedly. Building the trie is O(total characters), and the second walk is again O(total characters), so the whole thing is linear in the input size rather than the quadratic naive approach. Words being possibly duplicated is fine — each insertion bumps the counts, and identical words share the same path.",
    ],
    approaches: [
      {
        name: "Trie with a per-node pass count, sum counts along each word (optimal)",
        intuition: "Each trie node counts the words passing through it; a word's prefix score is the sum of those counts along its path.",
        time: "O(total characters)",
        timeWhy: "One pass to insert and count, one pass to sum the counts along each word; both linear in the total input length.",
        space: "O(total characters)",
        spaceWhy: "The trie stores one node per distinct prefix across all words.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[26];
        int passCount = 0;       // how many words pass through this node
    }

    public int[] sumPrefixScores(String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {                       // insert and count
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                int idx = c - "a".charAt(0);
                if (cur.child[idx] == null) cur.child[idx] = new TrieNode();
                cur = cur.child[idx];
                cur.passCount++;
            }
        }

        int[] answer = new int[words.length];
        for (int i = 0; i < words.length; i++) {        // sum counts along each word
            TrieNode cur = root;
            int score = 0;
            for (char c : words[i].toCharArray()) {
                cur = cur.child[c - "a".charAt(0)];
                score += cur.passCount;
            }
            answer[i] = score;
        }
        return answer;
    }
}`,
        walkthrough: [
          'words=["abc","ab","bc","b"]. After insertion the node for "a" has passCount 2 (abc, ab), "ab" has 2, "abc" has 1, "b" has 2, "bc" has 1.',
          'Score "abc": passCount("a")+passCount("ab")+passCount("abc") = 2+2+1 = 5. Score "ab": 2+2 = 4.',
          'Score "bc": passCount("b")+passCount("bc") = 2+1 = 3. Score "b": 2. answer = [5,4,3,2].',
        ],
      },
    ],
    edgeCases: [
      "A single word → each of its prefix nodes has passCount 1, so the score equals its length.",
      "Duplicate words → each insertion increments the shared path, so the counts (and scores) reflect the multiplicity.",
      "Completely disjoint words → every node has passCount 1 and each word scores its own length.",
    ],
    twists: [
      "**Implement Trie (Prefix Tree)** (LeetCode 208) → the same counting machinery exposed as countWordsStartingWith.",
      "**Map Sum Pairs** (LeetCode 677) → store a value at each word and sum values over a prefix subtree.",
      "**Longest Common Prefix** (LeetCode 14) → a degenerate trie question answerable by walking while passCount stays equal to words.length.",
    ],
    related: ["implement-trie-prefix-tree", "map-sum-pairs", "replace-words"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "find-right-interval",
    title: "Find Right Interval",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 436,
    statement:
      "You are given an array of `intervals` where `intervals[i] = [start_i, end_i]` and all `start_i` are distinct. The **right interval** for interval i is the interval j with the SMALLEST start_j such that start_j ≥ end_i (j may equal i). Return an array of the indices of the right interval for each interval, using −1 where no right interval exists.",
    examples: [
      { in: "intervals = [[1,2]]", out: "[-1]", note: "only one interval; no interval starts at or after its end 2" },
      { in: "intervals = [[3,4],[2,3],[1,2]]", out: "[-1,0,1]", note: "for [2,3] the smallest start >= 3 is interval 0 ([3,4]); for [1,2] it is interval 1 ([2,3])" },
      { in: "intervals = [[1,4],[2,3],[3,4]]", out: "[-1,2,-1]", note: "for [2,3] the smallest start >= 3 is index 2 ([3,4]); the others have nothing at or after their end" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 2·10⁴", "intervals[i].length == 2", "−10⁶ ≤ start_i ≤ end_i ≤ 10⁶", "all start_i are distinct"],
    recognize:
      "For each interval find the one with the smallest start that is ≥ its end → record (start, index) pairs, **sort them by start**, and for each interval **binary-search** for the leftmost start ≥ end_i, returning its original index (or −1). Sorting starts plus binary search is the canonical answer; it decouples the search key (start) from the original output order.",
    figureItOut: [
      "For interval i I need the interval whose start is the smallest value that is still >= end_i. That is a 'leftmost value at least X' query, repeated once per interval. Such queries over a fixed set scream SORTING the candidate values plus BINARY SEARCH.",
      "The candidate values are the START times of all intervals. But the answer must be the ORIGINAL index of the matching interval, not its position after sorting. So I build pairs (start_i, original_index_i) and sort the pairs by start. The starts being distinct means there is never ambiguity about which pair a start belongs to.",
      "Now for each interval i, I binary-search the sorted starts for the smallest start that is >= end_i (a lower-bound search). If such a position exists, the pair there carries the original index of the right interval; if the search runs past the end of the array, no start is large enough and the answer is -1.",
      "Care with the binary search boundary: I want the FIRST start >= end_i, so on start >= end_i I move the high bound down (remembering this as a candidate) and on start < end_i I move the low bound up. The pair stores the original index, so I read that off to fill answer[i]. Sorting is O(n log n) and each of the n queries is O(log n), giving O(n log n) overall.",
    ],
    approaches: [
      {
        name: "Sort (start, index) pairs, binary-search the lower bound of each end (optimal)",
        intuition: "Sort starts with their original indices, then for each interval binary-search the leftmost start at least its end and report that index.",
        time: "O(n log n)",
        timeWhy: "Sorting the n start pairs dominates; each of n intervals does one O(log n) binary search.",
        space: "O(n)",
        spaceWhy: "The array of (start, index) pairs and the answer array.",
        code: `class Solution {
    public int[] findRightInterval(int[][] intervals) {
        int n = intervals.length;
        int[][] starts = new int[n][2];                 // {start, original index}
        for (int i = 0; i < n; i++) {
            starts[i][0] = intervals[i][0];
            starts[i][1] = i;
        }
        Arrays.sort(starts, (a, b) -> a[0] - b[0]);     // by start ascending

        int[] answer = new int[n];
        for (int i = 0; i < n; i++) {
            int end = intervals[i][1];
            int lo = 0, hi = n - 1, foundIndex = -1;
            while (lo <= hi) {                          // leftmost start >= end
                int mid = (lo + hi) >>> 1;
                if (starts[mid][0] >= end) {
                    foundIndex = starts[mid][1];
                    hi = mid - 1;
                } else {
                    lo = mid + 1;
                }
            }
            answer[i] = foundIndex;
        }
        return answer;
    }
}`,
        walkthrough: [
          "intervals=[[3,4],[2,3],[1,2]]. starts sorted by value: (1,2),(2,1),(3,0).",
          "Interval0 [3,4] end=4: no start >= 4 -> -1. Interval1 [2,3] end=3: leftmost start >= 3 is (3,0) -> index 0.",
          "Interval2 [1,2] end=2: leftmost start >= 2 is (2,1) -> index 1. answer = [-1,0,1].",
        ],
      },
    ],
    edgeCases: [
      "An interval whose end exceeds every start → binary search finds nothing, answer is -1.",
      "j may equal i (a single point interval [x,x]) → its own start x satisfies start >= end, so it can be its own right interval.",
      "Distinct starts guarantee the sorted order and index mapping are unambiguous.",
    ],
    twists: [
      "**Use a TreeMap instead of sorting** → put start -> index in a TreeMap and call ceilingEntry(end) for each interval.",
      "**Merge Intervals** (LeetCode 56) → a sort-by-start sweep without per-interval lookups.",
      "**Non-overlapping Intervals** (LeetCode 435) → sort by end and greedily keep compatible intervals.",
    ],
    related: ["merge-intervals", "insert-interval", "non-overlapping-intervals"],
  },

  {
    slug: "set-intersection-size-at-least-two",
    title: "Set Intersection Size At Least Two",
    difficulty: "Hard",
    pattern: "intervals",
    leetcode: 757,
    statement:
      "You are given a list of `intervals` where `intervals[i] = [start_i, end_i]` represents all integers from start_i to end_i inclusive. A `containing set` is a set of integers such that, for EVERY interval, at least TWO integers of the set lie within that interval. Return the **minimum possible size** of such a containing set.",
    examples: [
      { in: "intervals = [[1,3],[3,7],[8,9]]", out: "5", note: "a smallest containing set is {2,3,7,8,9}: [1,3] holds 2,3; [3,7] holds 3,7; [8,9] holds 8,9" },
      { in: "intervals = [[1,3],[1,4],[2,5],[3,5]]", out: "3", note: "the set {2,3,4} touches every interval at least twice" },
      { in: "intervals = [[1,2],[2,3],[2,4],[4,5]]", out: "5", note: "the greedy by-end choice forces five points" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 3000", "intervals[i].length == 2", "0 ≤ start_i < end_i ≤ 10⁸"],
    recognize:
      "Choose the fewest integer points so every interval contains at least TWO of them → **greedy: sort by end ascending (ties by start descending), then place points as FAR RIGHT as possible** while tracking the two largest chosen points. For each interval count how many already lie inside; if fewer than two, add the needed rightmost point(s). Sorting by end and pushing points to the right is the stabbing-greedy signature.",
    figureItOut: [
      "This is a covering problem: each interval must be 'stabbed' by at least two chosen integers. The single-stab version (every interval contains at least one point) is the classic 'minimum arrows / minimum points' greedy: sort intervals by END and place a point at the end of the earliest-finishing uncovered interval, because a point at the rightmost feasible spot covers the most future intervals. I extend that idea to TWO points.",
      "Sort intervals by end ascending; to break ties, put larger START first. Why: when two intervals share an end, the one with the larger start is the tighter (shorter) one, and handling tighter intervals first prevents wasting points. Processing in this order, I greedily place chosen points as FAR RIGHT as possible (near the current interval's end), since right-leaning points are most likely to also fall inside later intervals (which end later).",
      "I keep track of the chosen points, but I only ever need the TWO LARGEST chosen so far to decide an interval: a chosen point smaller than the current interval's start cannot be inside it. So for each interval I check how many of the last two chosen points lie within [start, end]. If both do, the interval is satisfied — do nothing. If exactly one does, I need one more point; I add the rightmost available, which is end (it is inside and as large as possible). If neither does, I need two points; I add end-1 and end (the two rightmost integers inside).",
      "Maintaining 'the two largest chosen points' lets each interval be processed in O(1) after the sort. The far-right placement is what makes the greedy optimal: any point I add at the right edge is at least as reusable for later (later-ending) intervals as a leftward choice would be, so I never use more points than necessary. Total work is the O(n log n) sort plus a linear sweep.",
    ],
    approaches: [
      {
        name: "Sort by end (ties start desc), greedily add rightmost points, track the last two (optimal)",
        intuition: "Process intervals by increasing end; ensure each has two chosen points inside by adding the rightmost integers it still needs, which maximises reuse by later intervals.",
        time: "O(n log n)",
        timeWhy: "Sorting the n intervals dominates; the sweep checks each interval in O(1) using the two most recent points.",
        space: "O(n)",
        spaceWhy: "The sorted interval array; only the two largest chosen points are tracked during the sweep.",
        code: `class Solution {
    public int intersectionSizeTwo(int[][] intervals) {
        Arrays.sort(intervals, (a, b) ->
            a[1] != b[1] ? a[1] - b[1] : b[0] - a[0]);   // by end asc, then start desc

        int count = 0;
        int p1 = -1, p2 = -1;                            // the two largest chosen points
        for (int[] iv : intervals) {
            int start = iv[0], end = iv[1];
            boolean has1 = p1 >= start && p1 <= end;     // is the larger point inside?
            boolean has2 = p2 >= start && p2 <= end;     // is the second-largest inside?
            if (has1 && has2) continue;                  // already two points inside
            if (has1 || has2) {                          // exactly one inside: add the rightmost
                count += 1;
                p2 = p1;
                p1 = end;
            } else {                                     // none inside: add the two rightmost
                count += 2;
                p2 = end - 1;
                p1 = end;
            }
        }
        return count;
    }
}`,
        walkthrough: [
          "intervals=[[1,3],[3,7],[8,9]]. Sorted by end: [1,3],[3,7],[8,9].",
          "[1,3]: no points yet -> add 2 and 3. p1=3,p2=2, count=2. [3,7]: 3 is inside (one point) -> add 7. p2=3,p1=7, count=3.",
          "[8,9]: neither 7 nor 3 inside -> add 8 and 9. p2=8,p1=9, count=5. Answer 5.",
        ],
      },
    ],
    edgeCases: [
      "A single interval → it needs exactly two points (its two rightmost integers), so the answer is 2.",
      "An interval already holding both recent points → it is skipped, contributing nothing.",
      "The tie-break (end asc, start desc) → handles nested intervals sharing an end so the tighter one is satisfied first.",
    ],
    twists: [
      "**Minimum Number of Arrows to Burst Balloons** (LeetCode 452) → the at-least-ONE-point version, a simpler end-sorted greedy.",
      "**At least k points per interval** → generalise by tracking the k most recent chosen points instead of two.",
      "**Non-overlapping Intervals** (LeetCode 435) → another end-sorted greedy, removing the fewest intervals.",
    ],
    related: ["minimum-number-of-arrows-to-burst-balloons", "non-overlapping-intervals", "merge-intervals"],
  },
];
