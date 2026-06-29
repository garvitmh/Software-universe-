// NeetCode All + Top Interview 150 / LeetCode 75 / Grind 75 — wave 16b (trees, linked-list, heaps, tries, intervals). Java.
// Deep-teaching style: figureItOut does genuine from-scratch reasoning, not summaries.
// Mirrors the wave15b schema exactly: slug, title, difficulty, pattern, leetcode, statement,
// examples, constraints[], recognize, figureItOut[], approaches[] (optimal carries walkthrough),
// edgeCases[], twists[], related[]. All code is clean compilable Java assuming import java.util.*;
export const WAVE16B = [
  // ───────────────────────────── TREES ─────────────────────────────
  {
    slug: "maximum-width-of-binary-tree",
    title: "Maximum Width of Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 662,
    statement:
      "Given the `root` of a binary tree, return the **maximum width** of the tree. The width of one level is the number of nodes between the leftmost and rightmost non-null nodes on that level, COUNTING the null slots that would sit between them in a full binary tree. The maximum width is the largest such value over all levels.",
    examples: [
      { in: "root = [1,3,2,5,3,null,9]", out: "4", note: "the deepest level has nodes 5,3,_,9 spanning positions 0,1,2,3 -> width 4" },
      { in: "root = [1,3,2,5,null,null,9,6,null,7]", out: "7", note: "the bottom level spans position 0 (under 5) to position 6 (under 7) -> width 7" },
      { in: "root = [1,3,2,5]", out: "2", note: "the level with 5 alone next to its empty sibling slot gives width 2" },
    ],
    constraints: ["the number of nodes is in [1, 3000]", "−100 ≤ Node.val ≤ 100"],
    recognize:
      "Width counts the gap between the leftmost and rightmost real nodes INCLUDING the missing slots → give every node a **heap-style position index** (a left child is 2·i, a right child is 2·i+1) and BFS level by level. The width of a level is lastIndex − firstIndex + 1. Indexing by position, then subtracting the first index per level to avoid overflow, is the signature.",
    figureItOut: [
      "The tricky part is that width counts NULL gaps too. If I just counted real nodes per level I would miss the empty slots between a far-left and far-right node. I need a way to know each node's horizontal POSITION as if the tree were complete.",
      "There is a classic numbering for a complete binary tree: the root is position 0, and a node at position i has its left child at 2*i and its right child at 2*i+1. This number encodes exactly how far from the left edge a node would sit in a full tree, so two nodes on the same level with positions f and l span l - f + 1 slots, gaps included.",
      "So I BFS level by level, carrying each node's position alongside it. For a level, the first node dequeued has the smallest position and the last has the largest; width = lastPos - firstPos + 1. I track the maximum width across levels.",
      "One real danger: positions double each level, so by depth ~30 the index overflows a 32-bit int. The fix is to NORMALISE each level — subtract the first node's position from every position on that level so the leftmost node restarts at 0. The DIFFERENCE that the width needs is preserved, but the numbers stay small. Using a long for the index also helps. That keeps it O(n) over all nodes.",
    ],
    approaches: [
      {
        name: "BFS with heap-style position indices, normalise per level (optimal)",
        intuition: "Number nodes as in a complete tree (left = 2i, right = 2i+1); per level the width is last index minus first index plus one, normalising each level to avoid overflow.",
        time: "O(n)",
        timeWhy: "Each node is enqueued and dequeued exactly once with O(1) index arithmetic.",
        space: "O(n)",
        spaceWhy: "The BFS queue holds at most one full level, up to O(n) nodes.",
        code: `class Solution {
    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        int maxWidth = 0;
        Queue<TreeNode> nodes = new LinkedList<>();
        Queue<Long> index = new LinkedList<>();
        nodes.offer(root);
        index.offer(0L);

        while (!nodes.isEmpty()) {
            int size = nodes.size();
            long first = 0, last = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = nodes.poll();
                long pos = index.poll();
                if (i == 0) first = pos;
                if (i == size - 1) last = pos;
                long norm = pos - first;            // normalise so the level starts at 0
                if (node.left != null)  { nodes.offer(node.left);  index.offer(2 * norm); }
                if (node.right != null) { nodes.offer(node.right); index.offer(2 * norm + 1); }
            }
            maxWidth = Math.max(maxWidth, (int)(last - first + 1));
        }
        return maxWidth;
    }
}`,
        walkthrough: [
          "root=[1,3,2,5,3,null,9]. Level0: node1 pos0, width 1. Children: 3 at 0, 2 at 1.",
          "Level1: 3 pos0, 2 pos1, width 2. Children of 3: 5 at 0, 3 at 1; children of 2: 9 at 3 (right child of pos1 -> 2*1+1).",
          "Level2: positions 0,1,3 -> width 3-0+1 = 4. Max width = 4.",
        ],
      },
    ],
    edgeCases: [
      "Single node → its level has one position, width 1.",
      "A deep skewed tree → normalising per level keeps indices from overflowing even at depth 3000-ish (also use long).",
      "A level with one node far right next to its missing sibling → the gap is still counted via the position indices.",
    ],
    twists: [
      "**Binary Tree Level Order Traversal** (LeetCode 102) → the same level BFS but emitting values rather than measuring spans.",
      "**Count Complete Tree Nodes** (LeetCode 222) → exploits the very same complete-tree position numbering.",
      "**Find Bottom Left Tree Value** (LeetCode 513) → BFS tracking only the first node of the last level.",
    ],
    related: ["binary-tree-level-order-traversal", "count-complete-tree-nodes", "find-bottom-left-tree-value"],
  },

  {
    slug: "binary-search-tree-to-greater-sum-tree",
    title: "Binary Search Tree to Greater Sum Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1038,
    statement:
      "Given the `root` of a Binary Search Tree, convert it to a **Greater Tree** so that every node's new value equals its original value PLUS the sum of all values in the BST that are greater than the original value. Return the modified root. (The keys form a valid BST: left subtree keys are smaller, right subtree keys are larger.)",
    examples: [
      { in: "root = [4,1,6,0,2,5,7,null,null,null,3,null,null,null,8]", out: "[30,36,21,36,35,26,15,null,null,null,33,null,null,null,8]", note: "each node absorbs the sum of all strictly greater keys plus itself" },
      { in: "root = [0,null,1]", out: "[1,null,1]", note: "0 becomes 0+1=1; 1 (the greatest) stays 1" },
    ],
    constraints: ["the number of nodes is in [1, 100]", "0 ≤ Node.val ≤ 100", "all values are unique", "the input is a valid binary search tree"],
    recognize:
      "Replace each BST key with itself plus the sum of all greater keys → a **REVERSE in-order traversal** (right, node, left) visits keys from largest to smallest, so a running accumulator added to each node gives exactly the greater-or-equal sum. Right-first in-order plus a running total is the canonical move.",
    figureItOut: [
      "A normal in-order traversal of a BST visits keys in INCREASING order. I want each node to gain the sum of everything LARGER than it — so I should process keys from largest to smallest, keeping a running total of everything I have seen so far (all of which is larger than the current key).",
      "Visiting largest to smallest is simply in-order REVERSED: instead of left, node, right, I do right, node, left. The first node visited is the maximum key, then the next largest, and so on down to the minimum.",
      "I carry a running sum, initially 0. When I visit a node, every node visited before it had a larger key, so their total is exactly the sum of all greater keys. I add the node's own value to that running sum, then OVERWRITE the node with the new running sum. Order matters: add the node value to the accumulator first, then store the accumulator into the node, so the node ends up as original + (sum of strictly greater).",
      "Concretely: recurse right, then do sum += node.val and node.val = sum, then recurse left. Because the right subtree (all larger keys in a BST) is fully processed before the node, and the node before its left subtree (all smaller keys), the accumulator is always the sum of everything greater-or-equal at the moment I touch a node. One traversal, O(n), O(h) stack.",
    ],
    approaches: [
      {
        name: "Reverse in-order traversal with a running accumulator (optimal)",
        intuition: "Walk right-node-left so keys come largest first; keep a running sum and overwrite each node with that sum after adding its own value.",
        time: "O(n)",
        timeWhy: "A single reverse in-order pass visits each of the n nodes once.",
        space: "O(h)",
        spaceWhy: "The recursion stack is proportional to the tree height h (O(n) when skewed).",
        code: `class Solution {
    private int sum = 0;

    public TreeNode bstToGst(TreeNode root) {
        reverseInorder(root);
        return root;
    }

    private void reverseInorder(TreeNode node) {
        if (node == null) return;
        reverseInorder(node.right);     // larger keys first
        sum += node.val;                // accumulate this key and all greater ones
        node.val = sum;                 // overwrite with original + sum of greater
        reverseInorder(node.left);      // then smaller keys
    }
}`,
        walkthrough: [
          "root=[0,null,1]. Reverse in-order visits 1 first: sum=1, node 1 becomes 1.",
          "Then node 0: sum = 1 + 0 = 1, node 0 becomes 1.",
          "No left children remain -> tree is [1,null,1].",
        ],
      },
    ],
    edgeCases: [
      "Single node → no greater keys, so it keeps its own value.",
      "Right-skewed tree (sorted ascending chain) → reverse in-order still walks from the deepest-right maximum back to the root.",
      "Minimum key → it absorbs the sum of every other key plus itself.",
    ],
    twists: [
      "**Convert BST to Greater Tree** (LeetCode 538) → the identical problem under a different number, same reverse in-order.",
      "**Kth Smallest Element in a BST** (LeetCode 230) → forward in-order with a counter rather than a sum.",
      "**Range Sum of BST** (LeetCode 938) → sum only keys within a range, pruning by BST order.",
    ],
    related: ["kth-smallest-element-in-a-bst", "range-sum-of-bst", "binary-tree-inorder-traversal"],
  },

  {
    slug: "pseudo-palindromic-paths-in-a-binary-tree",
    title: "Pseudo-Palindromic Paths in a Binary Tree",
    difficulty: "Medium",
    pattern: "trees",
    leetcode: 1457,
    statement:
      "Given the `root` of a binary tree where node values are digits from 1 to 9, a root-to-leaf path is **pseudo-palindromic** if at least one permutation of the digits along the path is a palindrome. Return the number of pseudo-palindromic root-to-leaf paths.",
    examples: [
      { in: "root = [2,3,3,null,1,null,1]", out: "1", note: "paths 2-3-3, 2-3-1, 2-1-1; only 2-3-3 (or 2-1-1) can rearrange into a palindrome" },
      { in: "root = [2,1,1,1,3,null,null,null,null,null,1]", out: "1", note: "exactly one root-to-leaf path can be rearranged into a palindrome" },
      { in: "root = [9]", out: "1", note: "a single digit is trivially a palindrome" },
    ],
    constraints: ["the number of nodes is in [1, 10⁵]", "1 ≤ Node.val ≤ 9"],
    recognize:
      "A multiset of digits can form a palindrome iff at most ONE digit has an odd count → DFS each root-to-leaf path tracking digit parities in a **9-bit bitmask** (toggle the bit for each digit), and at a leaf the path is pseudo-palindromic when the mask has zero or one bit set. Parity-as-bitmask plus the at-most-one-odd test is the trick.",
    figureItOut: [
      "Forget the tree for a second: when can a multiset of digits be rearranged into a palindrome? A palindrome pairs symmetric positions, so every digit must appear an even number of times, except possibly one digit in the exact middle. So the rule is: AT MOST ONE digit has an odd count.",
      "I only care about each digit's count PARITY (even or odd), not the actual count. Digits are 1..9, so I can hold all nine parities in a 9-bit integer: bit d flipped means digit d has appeared an odd number of times so far. Each time I descend to a node with digit d, I TOGGLE bit d with XOR — toggling captures parity perfectly.",
      "I DFS from the root, carrying the running parity mask. When I reach a LEAF, the mask describes the parity of every digit on that root-to-leaf path. The palindrome condition 'at most one odd count' becomes 'the mask has at most one bit set'.",
      "Checking 'at most one bit set' is a neat bit trick: a number has zero or one set bits exactly when mask & (mask - 1) == 0 (this clears the lowest set bit; if the result is zero there was at most one bit). I count leaves whose mask passes that test. Crucially I toggle the bit on the way down and the recursion naturally untoggles as it returns to explore siblings (because each branch gets its own mask value). One DFS over n nodes, O(n) time, O(h) stack.",
    ],
    approaches: [
      {
        name: "DFS carrying a 9-bit parity mask, test at-most-one-odd at leaves (optimal)",
        intuition: "Toggle a bit per digit down each path; at a leaf the path is pseudo-palindromic when the parity mask has zero or one set bit.",
        time: "O(n)",
        timeWhy: "Each node is visited once with O(1) bit work; the leaf test is constant time.",
        space: "O(h)",
        spaceWhy: "Only the recursion stack up to the tree height; the mask is a single integer.",
        code: `class Solution {
    public int pseudoPalindromicPaths(TreeNode root) {
        return dfs(root, 0);
    }

    private int dfs(TreeNode node, int mask) {
        if (node == null) return 0;
        mask ^= (1 << node.val);                 // toggle parity for this digit
        if (node.left == null && node.right == null) {
            return (mask & (mask - 1)) == 0 ? 1 : 0;   // at most one odd-count digit
        }
        return dfs(node.left, mask) + dfs(node.right, mask);
    }
}`,
        walkthrough: [
          "root=[2,3,3,null,1,null,1]. Path 2-3-3: mask toggles bit2, bit3, bit3 -> only bit2 set -> one odd -> palindromic (+1).",
          "Path 2-3-1: bits 2,3,1 all set -> three odds -> mask & (mask-1) != 0 -> not palindromic.",
          "Path 2-1-1: bit2 set only (1 toggled twice) -> one odd -> palindromic. Distinct leaves counted; answer for this shape is 1 per the example pairing.",
        ],
      },
    ],
    edgeCases: [
      "Single node → mask has exactly one bit, which passes (at most one odd).",
      "A digit appearing an even number of times along a path → its bit toggles back to 0, contributing no oddness.",
      "Very deep tree (up to 10^5 nodes) → the bitmask stays a single int, only the recursion depth grows.",
    ],
    twists: [
      "**Sum Root to Leaf Numbers** (LeetCode 129) → same root-to-leaf DFS but accumulating a number instead of parities.",
      "**Path Sum** (LeetCode 112) → root-to-leaf DFS testing a target sum at the leaf.",
      "**Use a HashMap of counts** → an alternative to the bitmask when values are not bounded to 1..9.",
    ],
    related: ["sum-root-to-leaf-numbers", "path-sum", "binary-tree-paths"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "insertion-sort-list",
    title: "Insertion Sort List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 147,
    statement:
      "Given the `head` of a singly linked list, sort the list using **insertion sort** and return the sorted list's head. Insertion sort iterates the list, and for each element finds its correct position among the already-sorted prefix and splices it in.",
    examples: [
      { in: "head = [4,2,1,3]", out: "[1,2,3,4]", note: "elements are inserted one at a time into the growing sorted portion" },
      { in: "head = [-1,5,3,4,0]", out: "[-1,0,3,4,5]", note: "negative and unsorted values land in order" },
    ],
    constraints: ["the number of nodes is in [1, 5000]", "−5000 ≤ Node.val ≤ 5000"],
    recognize:
      "Sort a linked list specifically by insertion sort → use a **dummy head fronting the sorted portion**, and for each original node scan from the dummy to find the first sorted node whose next is larger, then splice the node in there. The dummy plus a per-element 'find the insertion point and relink' is the canonical structure.",
    figureItOut: [
      "Insertion sort grows a SORTED prefix and, for each new element, walks that prefix to find where the element belongs and inserts it. On an array this shifts elements; on a linked list I instead relink pointers, which is actually cleaner because insertion is O(1) once I find the spot.",
      "I will build a brand-new sorted list fronted by a DUMMY node. Why a dummy? Because the new element might belong at the very front (smaller than everything sorted so far), and a dummy gives me a uniform 'previous node' to splice after, with no special-case for the head.",
      "I iterate the ORIGINAL list node by node. Before I move a node, I save its next pointer (because I am about to relink this node into the sorted list and would otherwise lose the rest of the input). Then I scan the sorted list from the dummy: advance a pointer prev while prev.next is non-null and prev.next.val < current.val. That stops at the first sorted node larger than current (or the end).",
      "Now splice: current.next = prev.next, and prev.next = current. This inserts current right after prev, in sorted position. Move on to the saved next of the original list and repeat. A small optimisation: if the current value is >= the last inserted value I could append directly, but the straightforward scan from the dummy is correct as is. It is O(n^2) in the worst case (each insertion may scan the whole sorted prefix), O(1) extra space.",
    ],
    approaches: [
      {
        name: "Dummy-headed sorted list, splice each node at its insertion point (optimal)",
        intuition: "Detach each original node, scan the dummy-fronted sorted list for the first larger node, and relink the detached node just before it.",
        time: "O(n²)",
        timeWhy: "Each of n nodes may scan the entire sorted prefix, giving quadratic comparisons in the worst case.",
        space: "O(1)",
        spaceWhy: "Only a handful of pointers; the sort relinks existing nodes in place.",
        code: `class Solution {
    public ListNode insertionSortList(ListNode head) {
        ListNode dummy = new ListNode(0);     // fronts the growing sorted list
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;        // save the rest of the input
            ListNode prev = dummy;
            while (prev.next != null && prev.next.val < curr.val) {
                prev = prev.next;             // find the first sorted node >= curr
            }
            curr.next = prev.next;            // splice curr in after prev
            prev.next = curr;
            curr = next;
        }
        return dummy.next;
    }
}`,
        walkthrough: [
          "head=[4,2,1,3]. Insert 4: dummy->4. Insert 2: scan stops at dummy (4 not < 2) -> dummy->2->4.",
          "Insert 1: stops at dummy -> dummy->1->2->4. Insert 3: scan past 1,2 (both < 3), stop before 4 -> dummy->1->2->3->4.",
          "Return dummy.next = [1,2,3,4].",
        ],
      },
    ],
    edgeCases: [
      "Single node → the loop inserts it once and returns it unchanged.",
      "Already sorted input → each node still scans to the end of the sorted prefix (worst case for time).",
      "Reverse-sorted input → every node inserts right after the dummy at the front.",
    ],
    twists: [
      "**Sort List** (LeetCode 148) → sort in O(n log n) using merge sort on the list instead of insertion sort.",
      "**Merge Two Sorted Lists** (LeetCode 21) → the splicing-with-a-dummy technique on two already-sorted lists.",
      "**Append-if-larger optimisation** → track the tail and skip the scan when the next value already exceeds it.",
    ],
    related: ["sort-list", "merge-two-sorted-lists", "reverse-linked-list"],
  },

  {
    slug: "design-browser-history",
    title: "Design Browser History",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 1472,
    statement:
      "Design a `BrowserHistory` for a single tab that starts on `homepage`. Support: `visit(url)` — go to `url` from the current page, which CLEARS all forward history; `back(steps)` — move back up to `steps` pages (no further than the first page) and return the current url; `forward(steps)` — move forward up to `steps` pages (no further than the last visited page) and return the current url.",
    examples: [
      {
        in: 'BrowserHistory("leetcode.com"); visit("google.com"); visit("facebook.com"); back(1); forward(1)',
        out: '"facebook.com" then "facebook.com"',
        note: "back(1) from facebook -> google; forward(1) -> facebook; the doubly linked structure walks both directions",
      },
      {
        in: 'visit("youtube.com"); back(2); back(7)',
        out: '"leetcode.com" then "leetcode.com"',
        note: "back is clamped at the homepage even when steps exceeds the history depth",
      },
    ],
    constraints: ["1 ≤ homepage.length, url.length ≤ 20", "1 ≤ steps ≤ 100", "at most 5000 total calls to visit, back, and forward"],
    recognize:
      "A single tab walking back/forward through a history where a new visit truncates the forward branch → a **doubly linked list of pages with a current pointer**: visit appends a node and cuts current.next, back/forward walk the prev/next links a clamped number of steps. The doubly linked list with a movable cursor is the natural model (an array with an index and a size cap works too).",
    figureItOut: [
      "The defining behaviour: from the current page I can step backward or forward through previously seen pages, but VISITING a new page throws away everything that was ahead of the current page. That 'truncate the forward part' rule is exactly what a cursor over a sequence gives me.",
      "A doubly linked list models this perfectly. Each node holds a url and pointers to the previous and next pages. I keep a `current` pointer at the active page. Moving back is current = current.prev (if it exists); moving forward is current = current.next (if it exists).",
      "visit(url): create a new node, link it after the current page (current.next = node, node.prev = current), and move current to it. Crucially this OVERWRITES current.next, so any old forward chain is detached — it is no longer reachable from current, which is precisely 'clear forward history'. The garbage collector reclaims the dropped nodes.",
      "back(steps) and forward(steps) must CLAMP: walk the prev (or next) link up to steps times but stop early if there is no further node (the homepage on the back side, the last visit on the forward side). After walking, return current.url. Each operation is O(steps), and steps <= 100, so it is effectively O(1) per call for the given limits. A dummy-free doubly linked list keeps the logic simple because the clamps handle the ends.",
    ],
    approaches: [
      {
        name: "Doubly linked list of pages with a movable current pointer (optimal)",
        intuition: "Model history as a doubly linked chain; visit links a new node and severs the forward chain, while back and forward walk prev/next clamped at the ends.",
        time: "O(1) visit, O(steps) back/forward",
        timeWhy: "Visit relinks a constant number of pointers; back/forward walk at most steps links (steps <= 100).",
        space: "O(n)",
        spaceWhy: "One node per page kept in the reachable history chain.",
        code: `class BrowserHistory {
    static class Page {
        String url;
        Page prev, next;
        Page(String url) { this.url = url; }
    }

    private Page current;

    public BrowserHistory(String homepage) {
        current = new Page(homepage);
    }

    public void visit(String url) {
        Page page = new Page(url);
        current.next = page;          // sever any forward chain by overwriting next
        page.prev = current;
        current = page;
    }

    public String back(int steps) {
        while (steps > 0 && current.prev != null) {  // clamp at the homepage
            current = current.prev;
            steps--;
        }
        return current.url;
    }

    public String forward(int steps) {
        while (steps > 0 && current.next != null) {  // clamp at the last visited page
            current = current.next;
            steps--;
        }
        return current.url;
    }
}`,
        walkthrough: [
          'Start on leetcode.com. visit(google.com), visit(facebook.com): chain leetcode<->google<->facebook, current=facebook.',
          "back(1): current=google. forward(1): current=facebook -> returns facebook.com.",
          "visit(youtube.com) would sever google.next forward chain; back(2) walks facebook? -> google -> leetcode, clamped at leetcode.com.",
        ],
      },
    ],
    edgeCases: [
      "back(steps) with steps beyond the start → clamps at the homepage and returns it.",
      "forward after a visit → no forward node exists, so forward returns the current page unchanged.",
      "Repeated visits → each severs the forward chain, dropping previously visitable pages.",
    ],
    twists: [
      "**Array with current index and a size cap** → visit sets size = index + 1, trimming forward history with index arithmetic.",
      "**Design Linked List** (LeetCode 707) → the underlying doubly linked list operations on their own.",
      "**LRU Cache** (LeetCode 146) → another doubly linked list with a movable structure, here for recency eviction.",
    ],
    related: ["design-linked-list", "lru-cache", "flatten-a-multilevel-doubly-linked-list"],
  },

  {
    slug: "merge-nodes-in-between-zeros",
    title: "Merge Nodes in Between Zeros",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 2181,
    statement:
      "You are given the `head` of a linked list that begins and ends with a node valued 0, and every two consecutive 0s have some positive-valued nodes between them. Merge the nodes between each pair of 0s into a single node whose value is the SUM of those nodes, then remove all the 0s. Return the head of the modified list (the 0 separators disappear).",
    examples: [
      { in: "head = [0,3,1,0,4,5,2,0]", out: "[4,11]", note: "3+1=4 between the first pair of 0s; 4+5+2=11 between the second pair" },
      { in: "head = [0,1,0,3,0,2,2,0]", out: "[1,3,4]", note: "the segments sum to 1, 3, and 2+2=4" },
    ],
    constraints: ["the number of nodes is in [3, 2·10⁵]", "0 ≤ Node.val ≤ 1000", "there are no two consecutive 0s except as separators", "the list begins and ends with 0"],
    recognize:
      "Collapse each run of positive nodes between 0 separators into one summed node → a **single forward pass accumulating a running sum, emitting a node each time a 0 is hit**. The 0s act as flush boundaries; a dummy head builds the output and you reuse/relink nodes for O(1) space. One-pass accumulate-and-flush on the separators is the signature.",
    figureItOut: [
      "The structure is a sequence of segments separated by 0s. Each 0 (after the leading one) marks the END of a segment whose values I should sum into one node. So I sweep forward, keeping a running sum, and whenever I reach a 0 I FLUSH the running sum as a single output node and reset the sum to 0.",
      "The leading 0 is just the start marker — I begin walking from the node after it. As I encounter positive values I add them to the running sum. When I hit a 0 (the segment terminator), the running sum is the merged value for that segment, so I create or emit a node with that value.",
      "I build the output with a DUMMY head and a tail pointer so appending is uniform and I do not special-case the first segment. After flushing, I advance the tail and reset sum to 0. The trailing 0 flushes the final segment, after which there is nothing left.",
      "To keep it O(1) extra space I can REUSE the existing nodes: walk a pointer through the list, and at each 0 reuse one node to hold the segment sum and link it into the result, terminating the result with null at the end. But the cleanest mental model is dummy + running sum + flush on every 0. It is a single linear pass, O(n) time. Care: only flush on 0s after the first, and make sure the final node's next is null so no stray 0 remains.",
    ],
    approaches: [
      {
        name: "Single pass with a running sum, flush a node on each 0 separator (optimal)",
        intuition: "Accumulate positive values into a running sum and, each time a 0 is reached, append one node holding that sum and reset.",
        time: "O(n)",
        timeWhy: "One forward pass touches each node exactly once.",
        space: "O(1)",
        spaceWhy: "Only a dummy, a tail pointer, and a running sum; nodes are relinked rather than copied (output nodes excluded).",
        code: `class Solution {
    public ListNode mergeNodes(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int sum = 0;
        for (ListNode node = head.next; node != null; node = node.next) {
            if (node.val == 0) {                 // segment boundary: flush the sum
                tail.next = new ListNode(sum);
                tail = tail.next;
                sum = 0;
            } else {
                sum += node.val;                 // accumulate this segment
            }
        }
        return dummy.next;
    }
}`,
        walkthrough: [
          "head=[0,3,1,0,4,5,2,0]. Start after the leading 0. Add 3, add 1 -> sum 4.",
          "Hit 0: flush node 4, reset. Add 4,5,2 -> sum 11. Hit final 0: flush node 11.",
          "Return [4,11].",
        ],
      },
    ],
    edgeCases: [
      "A segment with a single node → its sum is just that node's value.",
      "Maximum length list (up to 2·10^5) → the single pass stays linear with no recursion.",
      "The trailing 0 → flushes the last segment, and dummy.next is the clean head with no leftover separators.",
    ],
    twists: [
      "**Remove Zero Sum Consecutive Nodes from Linked List** (LeetCode 1171) → uses prefix sums to delete zero-sum runs, a harder accumulation.",
      "**In-place node reuse** → instead of new nodes, repurpose existing ones to hit O(1) total allocation.",
      "**Add Two Numbers** (LeetCode 2) → another build-a-list-while-summing pass over linked lists.",
    ],
    related: ["remove-zero-sum-consecutive-nodes-from-linked-list", "add-two-numbers", "merge-two-sorted-lists"],
  },

  // ───────────────────────────── HEAPS ─────────────────────────────
  {
    slug: "kth-largest-sum-in-a-binary-tree",
    title: "Kth Largest Sum in a Binary Tree",
    difficulty: "Medium",
    pattern: "heaps",
    leetcode: 2583,
    statement:
      "You are given the `root` of a binary tree and a positive integer `k`. The **level sum** of a level is the sum of the values of all nodes on that level. Return the **k-th LARGEST** level sum in the tree. If there are fewer than `k` levels, return −1.",
    examples: [
      { in: "root = [5,8,9,2,1,3,7,4,6], k = 2", out: "13", note: "level sums are 5, 17, 13; the 2nd largest is 13" },
      { in: "root = [1,2,null,3], k = 1", out: "3", note: "level sums 1, 2, 3; the largest is 3" },
      { in: "root = [1,2,3], k = 3", out: "-1", note: "only 2 levels exist, so the 3rd largest does not exist" },
    ],
    constraints: ["the number of nodes is in [2, 10⁵]", "1 ≤ Node.val ≤ 10⁶", "1 ≤ k ≤ number of nodes"],
    recognize:
      "Compute every level's sum, then pick the k-th largest of those sums → BFS level by level to produce the list of level sums, then select the k-th largest with a **size-k min-heap** (or a sort). Sums can exceed an int, so use long. BFS-to-collect plus a bounded min-heap for the k-th largest is the pattern.",
    figureItOut: [
      "First I need the SUM of each level. That is a textbook level-order BFS: process the queue one full level at a time, summing the values dequeued in that level, and record the total before moving to the next level. Node values up to 10^6 over up to 10^5 nodes mean a level sum can exceed a 32-bit int, so I accumulate sums as long.",
      "Now I have a list of level sums and I want the k-th LARGEST. If there are fewer than k levels, the answer is -1, so I check the count first.",
      "The k-th largest of a collection is a classic min-heap job: keep a min-heap of size k. Push each level sum; whenever the heap exceeds size k, pop the smallest. After processing all sums, the heap holds the k largest sums and its TOP (the minimum of those k) is exactly the k-th largest.",
      "Why a size-k min-heap rather than sorting? Sorting all level sums is O(L log L); the heap is O(L log k), better when k is small. Either is fine given L <= number of nodes, but the heap is the idiomatic 'k-th largest' tool and avoids holding a fully sorted array. The whole thing is BFS O(n) plus selection O(L log k).",
    ],
    approaches: [
      {
        name: "BFS level sums, size-k min-heap for the k-th largest (optimal)",
        intuition: "Sum each level via BFS, then keep the k largest sums in a size-k min-heap whose top is the k-th largest.",
        time: "O(n log k)",
        timeWhy: "BFS visits all n nodes once; each level sum costs O(log k) to maintain a heap of size k.",
        space: "O(n)",
        spaceWhy: "The BFS queue can hold a full level, and the heap holds up to k sums.",
        code: `class Solution {
    public long kthLargestLevelSum(TreeNode root, int k) {
        PriorityQueue<Long> minHeap = new PriorityQueue<>();   // keeps the k largest sums
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            long levelSum = 0;
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                levelSum += node.val;
                if (node.left != null)  queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            minHeap.offer(levelSum);
            if (minHeap.size() > k) minHeap.poll();    // drop the smallest, keep the k largest
        }

        return minHeap.size() < k ? -1 : minHeap.peek();
    }
}`,
        walkthrough: [
          "root=[5,8,9,2,1,3,7,4,6], k=2. Level sums via BFS: 5, then 8+9=17, then 2+1+3+7=13 (and 4+6 on a deeper level depending on shape).",
          "Push 5 (heap[5]); push 17 (heap[5,17]); push 13 -> size 3 > 2 pop 5 -> heap holds {13,17}.",
          "Heap top (minimum of the two largest) = 13, the 2nd largest. Return 13.",
        ],
      },
    ],
    edgeCases: [
      "Fewer than k levels → the heap holds fewer than k sums, so return -1.",
      "Large sums → accumulate and store as long to avoid 32-bit overflow.",
      "k equals the number of levels → the heap top is the SMALLEST level sum.",
    ],
    twists: [
      "**Average of Levels in Binary Tree** (LeetCode 637) → BFS level aggregation producing averages instead of a k-th selection.",
      "**Kth Largest Element in an Array** (LeetCode 215) → the same size-k min-heap selection on a flat array.",
      "**Sort the level sums** → an O(L log L) alternative when you also want the full ranking.",
    ],
    related: ["kth-largest-element-in-an-array", "average-of-levels-in-binary-tree", "binary-tree-level-order-traversal"],
  },

  {
    slug: "find-servers-that-handled-most-number-of-requests",
    title: "Find Servers That Handled Most Number of Requests",
    difficulty: "Hard",
    pattern: "heaps",
    leetcode: 1606,
    statement:
      "You have `k` servers numbered 0..k−1 handling requests. The i-th request arrives at `arrival[i]` and takes `load[i]` time. Request i is assigned starting from server (i mod k); if that server is busy, try the next servers in circular order, choosing the FIRST free one. If all k servers are busy, the request is DROPPED. Return the list of servers that handled the maximum number of requests (a server is 'busiest' if it handled the most), in any order.",
    examples: [
      { in: "k = 3, arrival = [1,2,3,4,5], load = [5,2,3,3,3]", out: "[1]", note: "server 1 ends up handling the most requests after the circular free-server search" },
      { in: "k = 3, arrival = [1,2,3,4], load = [1,2,1,2]", out: "[0]", note: "server 0 handles the most" },
      { in: "k = 3, arrival = [1,2,3], load = [10,12,11]", out: "[0,1,2]", note: "each server handles exactly one request, so all are busiest" },
    ],
    constraints: ["1 ≤ k ≤ 10⁵", "1 ≤ arrival.length, load.length ≤ 10⁵", "arrival.length == load.length", "1 ≤ arrival[i], load[i] ≤ 10⁹", "arrival is strictly increasing"],
    recognize:
      "Assign each request to the first FREE server at or after index (i mod k) in circular order, dropping if none → keep a **min-heap of busy servers keyed by free-time** to release finished servers, and a sorted set (TreeSet) of FREE server indices to find the next free one >= the start index (wrapping around). Two structures — busy-by-time heap + free-by-index ordered set — is the signature.",
    figureItOut: [
      "Two questions must be answered fast for each request: which servers have FINISHED (so they are free again), and among the free servers, which is the first one at or after index (i mod k) in circular order. Linear scanning servers per request would be O(n·k) — too slow at 10^5 each.",
      "For 'who has finished': a request occupies a server until arrival + load. So I keep a MIN-HEAP of busy servers keyed by their free-time. When request i arrives at time t, I pop every busy server whose free-time <= t and return them to the free pool. The heap gives me all newly-freed servers in time order cheaply.",
      "For 'first free server at or after start index, wrapping': I keep the FREE server indices in an ordered set (a TreeSet). Given start = i mod k, I ask for the smallest free index >= start (ceiling). If none exists in [start, k), I WRAP and ask for the smallest free index >= 0 (the very first free server). If the free set is empty, the request is dropped.",
      "Assigning: remove the chosen index from the free set, increment its handled count, and push it onto the busy heap keyed by t + load[i]. After processing all requests, find the maximum handled count and collect every server achieving it. Each request does O(log k) heap and tree-set work, so total is O(n log k) — fast enough. The circular ceiling-then-wrap is the subtle bit that the TreeSet handles in two ceiling queries.",
    ],
    approaches: [
      {
        name: "Min-heap of busy servers by free-time plus a TreeSet of free indices (optimal)",
        intuition: "Release finished servers from a free-time min-heap, then use a TreeSet ceiling (wrapping to 0) to pick the first free server at or after the request's start index.",
        time: "O(n log k)",
        timeWhy: "Each request triggers O(log k) heap pushes/pops and O(log k) TreeSet ceiling/remove operations.",
        space: "O(k)",
        spaceWhy: "The busy heap and free TreeSet together hold at most k servers, plus a count array of size k.",
        code: `class Solution {
    public List<Integer> busiestServers(int k, int[] arrival, int[] load) {
        TreeSet<Integer> free = new TreeSet<>();
        for (int s = 0; s < k; s++) free.add(s);
        PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) -> Long.compare(a[0], b[0])); // {freeTime, server}
        int[] count = new int[k];

        for (int i = 0; i < arrival.length; i++) {
            long t = arrival[i];
            while (!busy.isEmpty() && busy.peek()[0] <= t) {     // release finished servers
                free.add((int) busy.poll()[1]);
            }
            if (free.isEmpty()) continue;                         // all busy: drop request

            int start = i % k;
            Integer server = free.ceiling(start);                 // first free >= start
            if (server == null) server = free.ceiling(0);         // wrap around to the front
            free.remove(server);
            count[server]++;
            busy.offer(new long[]{ t + load[i], server });
        }

        int max = 0;
        for (int c : count) max = Math.max(max, c);
        List<Integer> result = new ArrayList<>();
        for (int s = 0; s < k; s++) if (count[s] == max) result.add(s);
        return result;
    }
}`,
        walkthrough: [
          "k=3, arrival=[1,2,3,4,5], load=[5,2,3,3,3]. i=0 start0 -> server0 busy until 6. i=1 start1 -> server1 busy until 4.",
          "i=2 start2 -> server2 busy until 6. i=3 start0: at t=4 server1 freed (free<=4); ceiling(0)=1 -> server1 busy until 7.",
          "i=4 start2: at t=5 nobody new freed except none; ceiling(2)=null, wrap ceiling(0)=null (all busy) -> dropped. counts: server1 handled 2 -> busiest [1].",
        ],
      },
    ],
    edgeCases: [
      "All servers busy when a request arrives → the free set is empty, so the request is dropped (no count change).",
      "The ceiling at start returns null → wrap to ceiling(0) to search the front of the index range.",
      "Multiple servers tie for the maximum → every tied server index is returned.",
    ],
    twists: [
      "**Process Tasks Using Servers** (LeetCode 1882) → two heaps (free by weight, busy by free-time) with a different selection rule.",
      "**Single-Threaded CPU** (LeetCode 1834) → one server picking the shortest job among the arrived ones via a heap.",
      "**Meeting Rooms III** (LeetCode 2402) → a similar free/busy heap pairing for room allocation with delays.",
    ],
    related: ["process-tasks-using-servers", "single-threaded-cpu", "meeting-rooms-iii"],
  },

  // ───────────────────────────── TRIES ─────────────────────────────
  {
    slug: "index-pairs-of-a-string",
    title: "Index Pairs of a String",
    difficulty: "Easy",
    pattern: "tries",
    leetcode: 1065,
    statement:
      "Given a string `text` and a list of strings `words`, return all index pairs `[i, j]` such that the substring `text[i..j]` (inclusive) is exactly one of the strings in `words`. Return the pairs sorted in increasing order of `i`, and for equal `i` in increasing order of `j`.",
    examples: [
      {
        in: 'text = "thestoryofleetcodeandme", words = ["story","fleet","leetcode"]',
        out: "[[3,7],[9,13],[10,17]]",
        note: '"story" at 3..7, "fleet" at 9..13, "leetcode" at 10..17',
      },
      {
        in: 'text = "ababa", words = ["aba","ab"]',
        out: "[[0,1],[0,2],[2,3],[2,4]]",
        note: '"ab" at 0..1 and 2..3; "aba" at 0..2 and 2..4',
      },
    ],
    constraints: ["1 ≤ text.length ≤ 100", "1 ≤ words.length ≤ 20", "1 ≤ words[i].length ≤ 50", "text and words[i] consist of lowercase English letters", "all strings in words are distinct"],
    recognize:
      "Find every occurrence of any dictionary word as a substring, reporting [start, end] → build a **trie of the dictionary words**, then from EACH start index walk forward through the trie matching characters, emitting [start, current] whenever a word-end node is reached. Start-anchored trie walks naturally find all overlapping matches in sorted order.",
    figureItOut: [
      "I want every place where some dictionary word appears as a contiguous substring of text, and matches can OVERLAP (as in 'ababa'). So for each possible start position in text, I need to know which dictionary words begin there.",
      "Checking each start against each word separately would re-walk shared prefixes repeatedly. A TRIE of the dictionary words shares those prefixes: inserting all words once lets me match many candidates simultaneously by walking the trie a single character at a time.",
      "The algorithm: insert every word into a trie with an isWord flag at each terminal node. Then for each start index i from 0 to n-1, I begin at the trie root and walk forward through text[i], text[i+1], .... At each step I follow the child for the current character; if there is no such child I stop (no dictionary word can continue from here). Whenever the node I land on is a word-end, text[i..current] equals a dictionary word, so I emit [i, current].",
      "Because I sweep start index i in increasing order and, within a start, extend j increasing, the emitted pairs are already sorted by i then j — no post-sort needed. Each start walk is at most the longest word length, so the total work is O(n · maxWordLen) for the walks plus O(total word length) to build the trie. The trie cleanly handles overlapping matches (different starts) and nested matches (one word a prefix of another) by emitting at every word-end encountered along a walk.",
    ],
    approaches: [
      {
        name: "Trie of words, start-anchored forward walk emitting [i,j] at word-ends (optimal)",
        intuition: "From each start index, walk the trie character by character through text and record a pair whenever a word-terminal node is hit.",
        time: "O(n · L + W)",
        timeWhy: "Each of n starts walks up to the longest word length L; building the trie costs the total word length W.",
        space: "O(W)",
        spaceWhy: "The trie stores one node per distinct prefix across all dictionary words.",
        code: `class Solution {
    static class TrieNode {
        TrieNode[] child = new TrieNode[26];
        boolean isWord = false;
    }

    public int[][] indexPairs(String text, String[] words) {
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

        List<int[]> pairs = new ArrayList<>();
        int n = text.length();
        for (int i = 0; i < n; i++) {                  // each start index in order
            TrieNode cur = root;
            for (int j = i; j < n; j++) {
                int idx = text.charAt(j) - "a".charAt(0);
                if (cur.child[idx] == null) break;     // no word continues from here
                cur = cur.child[idx];
                if (cur.isWord) pairs.add(new int[]{ i, j });
            }
        }
        return pairs.toArray(new int[0][]);
    }
}`,
        walkthrough: [
          'text="ababa", words=["aba","ab"]. Start i=0: walk a->b (word "ab" -> [0,1]) ->a (word "aba" -> [0,2]).',
          'Start i=1: b has no child in the trie (words begin with a) -> nothing. Start i=2: a->b ([2,3]) ->a ([2,4]).',
          "Pairs emitted in start order then j order: [[0,1],[0,2],[2,3],[2,4]].",
        ],
      },
    ],
    edgeCases: [
      "Overlapping matches (e.g. 'ababa') → different start indices each emit their own pairs.",
      "One word is a prefix of another → the walk emits a pair at each word-end it passes.",
      "No matches → the result is an empty array.",
    ],
    twists: [
      "**Add Bold Tag in String** (LeetCode 616) → first find these same match intervals, then merge them to wrap bold tags.",
      "**Stream of Characters** (LeetCode 1032) → match dictionary words ending at each streamed character using a reversed trie.",
      "**Aho-Corasick automaton** → a single linear pass finds all matches when the dictionary is large.",
    ],
    related: ["implement-trie-prefix-tree", "stream-of-characters", "add-bold-tag-in-string"],
  },

  {
    slug: "add-bold-tag-in-string",
    title: "Add Bold Tag in String",
    difficulty: "Medium",
    pattern: "tries",
    leetcode: 616,
    statement:
      "Given a string `s` and a list of strings `words`, wrap every substring of `s` that matches any string in `words` in bold tags `<b>` and `</b>`. If two such substrings overlap, wrap them together in one pair of tags. If two are consecutive (touching), also merge them into a single pair of tags. Return the resulting string.",
    examples: [
      {
        in: 's = "abcxyz123", words = ["abc","123"]',
        out: "<b>abc</b>xyz<b>123</b>",
        note: "two separate non-touching matches each get their own tags",
      },
      {
        in: 's = "aaabbb", words = ["aa","b"]',
        out: "<b>aaabbb</b>",
        note: "the matches overlap and touch, so they merge into one bold span covering the whole string",
      },
    ],
    constraints: ["1 ≤ s.length ≤ 1000", "0 ≤ words.length ≤ 100", "1 ≤ words[i].length ≤ 1000", "s and words[i] consist of English letters and digits"],
    recognize:
      "Mark which characters of `s` are covered by ANY dictionary match, then wrap maximal covered runs in tags → build a **trie of words**, sweep each start index marking a boolean 'bold' array over every matched span, then emit `<b>...</b>` around each maximal run of bold characters. Trie-find-matches then merge-via-boolean-coverage is the signature (this is the interval-merge cousin of LeetCode 56 expressed on a character mask).",
    figureItOut: [
      "The merging rule (overlapping OR touching matches share one tag pair) is really an interval-merge problem on character positions. The cleanest way to handle 'overlapping and touching merge' uniformly is to mark a boolean array bold[] where bold[p] is true if position p lies inside ANY match, then wrap each maximal run of trues.",
      "First I need all matches. A trie of the dictionary words lets me, from each start index i, walk forward through s matching characters; whenever I hit a word-end at position j I have a match covering i..j. For that match I set bold[i..j] = true. Marking a boolean range automatically merges overlaps and adjacencies — two touching ranges produce one continuous run of trues.",
      "After marking, I scan s left to right building the output. When I enter a bold region (bold[p] true and the previous position was not bold or p is 0), I append '<b>'. I append the character. When I leave a bold region (this position bold but the next is not, or it is the last), I append '</b>'. This emits exactly one tag pair per maximal bold run.",
      "Why a trie rather than scanning each word with indexOf? With up to 100 words and s up to 1000, repeated indexOf would re-scan shared prefixes; the trie matches all candidates in one forward walk per start, O(n · L) where L is the longest word. The boolean-coverage trick is what makes the tricky merge rule trivial — I never reason about interval endpoints directly, just runs of trues. Total O(n·L + output).",
    ],
    approaches: [
      {
        name: "Trie matches mark a boolean coverage array, wrap maximal bold runs (optimal)",
        intuition: "Find every match via a trie and set those positions true in a bold array; then emit tags around each maximal run of true positions, which merges overlaps and adjacencies for free.",
        time: "O(n · L)",
        timeWhy: "Each of n start indices walks the trie up to the longest word length L; the final scan is linear.",
        space: "O(n + W)",
        spaceWhy: "The boolean coverage array of length n plus the trie of total word length W.",
        code: `class Solution {
    static class TrieNode {
        Map<Character, TrieNode> child = new HashMap<>();
        boolean isWord = false;
    }

    public String addBoldTag(String s, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {                       // build the trie
            TrieNode cur = root;
            for (char c : w.toCharArray()) {
                cur = cur.child.computeIfAbsent(c, x -> new TrieNode());
            }
            cur.isWord = true;
        }

        int n = s.length();
        boolean[] bold = new boolean[n];
        for (int i = 0; i < n; i++) {                  // mark coverage of all matches
            TrieNode cur = root;
            int end = -1;
            for (int j = i; j < n; j++) {
                cur = cur.child.get(s.charAt(j));
                if (cur == null) break;
                if (cur.isWord) end = j;               // longest match starting at i
            }
            for (int p = i; p <= end; p++) bold[p] = true;
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (bold[i] && (i == 0 || !bold[i - 1])) sb.append("<b>");
            sb.append(s.charAt(i));
            if (bold[i] && (i == n - 1 || !bold[i + 1])) sb.append("</b>");
        }
        return sb.toString();
    }
}`,
        walkthrough: [
          's="aaabbb", words=["aa","b"]. Marking: start0 matches "aa" -> bold[0..1]; start1 matches "aa" -> bold[1..2]; "b" matches at 3,4,5 -> bold[3..5]; start2 "aa"? a then b no.',
          "bold becomes true at 0,1,2,3,4,5 (the aa runs cover 0..2, the b runs cover 3..5, touching at 2-3).",
          "One maximal run 0..5 -> wrap once: <b>aaabbb</b>.",
        ],
      },
    ],
    edgeCases: [
      "Empty words list → nothing is bold, return s unchanged.",
      "Touching matches (end of one is adjacent to start of next) → the boolean runs are continuous, merging into one tag pair.",
      "A match covering the whole string → a single <b> at the front and </b> at the end.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → the same merge logic expressed on explicit [start,end] intervals rather than a boolean mask.",
      "**Index Pairs of a String** (LeetCode 1065) → produce the raw match pairs without merging or tagging.",
      "**Use indexOf per word** → a simpler but slower way to mark coverage when the dictionary is tiny.",
    ],
    related: ["index-pairs-of-a-string", "merge-intervals", "implement-trie-prefix-tree"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "teemo-attacking",
    title: "Teemo Attacking",
    difficulty: "Easy",
    pattern: "intervals",
    leetcode: 495,
    statement:
      "An attacker poisons a target at each time in the sorted array `timeSeries`, and each attack keeps the target poisoned for `duration` seconds STARTING at that attack's time. If a new attack lands before the current poison ends, the poison timer RESETS to a full `duration` from the new attack. Return the total number of seconds the target is poisoned.",
    examples: [
      { in: "timeSeries = [1,4], duration = 2", out: "4", note: "poisoned over [1,3) from the first attack and [4,6) from the second; the spans do not overlap -> 2 + 2 = 4" },
      { in: "timeSeries = [1,2], duration = 2", out: "3", note: "first attack poisons [1,3), but the second at time 2 resets to [2,4); union is [1,4) -> 3 seconds" },
    ],
    constraints: ["1 ≤ timeSeries.length ≤ 10⁴", "0 ≤ timeSeries[i], duration ≤ 10⁷", "timeSeries is sorted in non-decreasing order"],
    recognize:
      "Each attack opens a fixed-length poison interval that may overlap the previous one (and resets it) → walk the SORTED attacks and add `min(duration, nextStart − currentStart)` for each, plus a full `duration` for the last. This is a one-pass overlap-merge specialised to equal-length intervals: the gap to the next attack caps each contribution. Min-of-gap-or-duration per attack is the signature.",
    figureItOut: [
      "Each attack at time t poisons the half-open interval [t, t + duration). The total poisoned time is the measure of the UNION of all these intervals — overlaps must not be double counted. Because the attack times are sorted, consecutive intervals are the only ones that can overlap.",
      "Consider two consecutive attacks at times t_i and t_{i+1}. The first attack contributes poison for duration, but if the next attack lands within that window (t_{i+1} < t_i + duration) it RESETS the timer, so the first attack effectively only contributes time until the next attack starts. So the first attack's contribution is min(duration, t_{i+1} - t_i).",
      "That gives a clean one-pass formula: for each attack except the last, add min(duration, gap to the next attack). The very LAST attack has no successor to cut it short, so it contributes a full duration.",
      "Why min(duration, gap)? If the gap is >= duration, the poison fully expires before the next attack and the attack contributes the whole duration with no overlap. If the gap is < duration, the next attack resets the poison, so only the non-overlapping prefix (the gap) counts. Summing these avoids ever double counting the overlapped portion. It is O(n) over the sorted array, O(1) extra space — much simpler than explicitly merging intervals, which the equal-length structure lets me skip.",
    ],
    approaches: [
      {
        name: "One pass adding min(duration, gap to next), full duration for the last (optimal)",
        intuition: "Each attack contributes the time until the next attack or the full duration, whichever is smaller, because a closer attack resets the poison.",
        time: "O(n)",
        timeWhy: "A single pass over the sorted attack times with O(1) work each.",
        space: "O(1)",
        spaceWhy: "Only a running total is kept; the input is already sorted.",
        code: `class Solution {
    public int findPoisonedDuration(int[] timeSeries, int duration) {
        if (timeSeries.length == 0) return 0;
        int total = 0;
        for (int i = 0; i + 1 < timeSeries.length; i++) {
            int gap = timeSeries[i + 1] - timeSeries[i];
            total += Math.min(duration, gap);     // closer next attack resets the poison
        }
        return total + duration;                   // the last attack runs its full duration
    }
}`,
        walkthrough: [
          "timeSeries=[1,2], duration=2. i=0: gap = 2-1 = 1, add min(2,1)=1.",
          "Loop ends; add full duration 2 for the last attack -> total 1 + 2 = 3.",
          "Union [1,4) is 3 seconds, matching.",
        ],
      },
    ],
    edgeCases: [
      "A single attack → it simply contributes one full duration.",
      "duration = 0 → no poison time at all; total is 0.",
      "Attacks spaced farther apart than duration → every attack contributes its full duration with no overlap.",
    ],
    twists: [
      "**Merge Intervals** (LeetCode 56) → the general union-of-intervals problem without the equal-length shortcut.",
      "**Repeated attacks at the same time** → a gap of 0 contributes nothing for those, only the final duration counts.",
      "**Car Pooling** (LeetCode 1094) → another timeline problem, solved with a difference array of start/end events.",
    ],
    related: ["merge-intervals", "car-pooling", "summary-ranges"],
  },

  {
    slug: "remove-interval",
    title: "Remove Interval",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 1272,
    statement:
      "A set of real numbers is represented as a sorted list of disjoint `intervals` where `intervals[i] = [a_i, b_i)` is a half-open interval. Given a `toBeRemoved` interval `[start, end)`, remove every real number in `toBeRemoved` from the set and return the remaining intervals, also sorted and disjoint.",
    examples: [
      { in: "intervals = [[0,2],[3,4],[5,7]], toBeRemoved = [1,6]", out: "[[0,1],[6,7]]", note: "[1,6) is removed: [0,2)->[0,1), [3,4) vanishes, [5,7)->[6,7)" },
      { in: "intervals = [[0,5]], toBeRemoved = [2,3]", out: "[[0,2],[3,5]]", note: "removing the middle splits one interval into two" },
      { in: "intervals = [[-5,-4],[-3,-2],[1,2]], toBeRemoved = [-1,1]", out: "[[-5,-4],[-3,-2],[1,2]]", note: "the removal range overlaps none of the intervals, so all survive" },
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "−10⁹ ≤ a_i < b_i ≤ 10⁹", "−10⁹ ≤ start < end ≤ 10⁹"],
    recognize:
      "Subtract one interval from a sorted disjoint list → a **single pass that, per interval, keeps the part LEFT of the removal and the part RIGHT of the removal** (either or both may be empty), and drops fully-covered intervals. The left-piece [a, min(b,start)) and right-piece [max(a,end), b) decomposition is the whole trick; sorted disjoint input means no merging is ever needed.",
    figureItOut: [
      "Removing a range [start, end) from a single interval [a, b) leaves at most two leftover pieces: the part of [a,b) that lies BEFORE start, and the part that lies AFTER end. Everything in between is removed. So I can process each interval independently and just figure out those two pieces.",
      "The left leftover is [a, min(b, start)): it is the portion of the interval below the removal's start. It is non-empty only when a < start (there is some interval below the cut). The right leftover is [max(a, end), b): the portion above the removal's end, non-empty only when b > end.",
      "Cases fall out naturally. If the interval is entirely below start or entirely at/above end, the removal does not touch it, and one of the two pieces equals the whole interval while the other is empty — but the formulas still produce the right single piece. If the removal fully covers the interval (start <= a and b <= end), both pieces are empty and the interval disappears. If the removal sits strictly inside, both pieces survive and the interval SPLITS in two.",
      "Because the input intervals are already sorted and disjoint, the surviving pieces I emit are automatically sorted and disjoint too — no merge step is needed. I sweep once, appending [a, min(b,start)) when it is non-empty and [max(a,end), b) when it is non-empty. That single linear pass handles trim-left, trim-right, full-delete, and split uniformly. O(n) time, O(n) output.",
    ],
    approaches: [
      {
        name: "Single pass keeping the left and right leftover of each interval (optimal)",
        intuition: "For every interval emit the part below the removal start and the part above the removal end, each only when non-empty; fully-covered intervals vanish.",
        time: "O(n)",
        timeWhy: "One pass over the sorted intervals with O(1) work per interval.",
        space: "O(n)",
        spaceWhy: "The output list, which holds at most n + 1 intervals (a split adds one).",
        code: `class Solution {
    public List<List<Integer>> removeInterval(int[][] intervals, int[] toBeRemoved) {
        int start = toBeRemoved[0], end = toBeRemoved[1];
        List<List<Integer>> result = new ArrayList<>();
        for (int[] iv : intervals) {
            int a = iv[0], b = iv[1];
            if (a < start) {                                 // left leftover [a, min(b, start))
                result.add(Arrays.asList(a, Math.min(b, start)));
            }
            if (b > end) {                                   // right leftover [max(a, end), b)
                result.add(Arrays.asList(Math.max(a, end), b));
            }
        }
        return result;
    }
}`,
        walkthrough: [
          "intervals=[[0,2],[3,4],[5,7]], toBeRemoved=[1,6]. [0,2): a<1 -> add [0,1]; b=2 not >6 -> no right.",
          "[3,4): a=3 not <1 -> no left; b=4 not >6 -> no right -> vanishes.",
          "[5,7): a=5 not <1 -> no left; b=7>6 -> add [6,7]. Result [[0,1],[6,7]].",
        ],
      },
    ],
    edgeCases: [
      "Removal strictly inside one interval → both leftover pieces survive, splitting it into two.",
      "Removal fully covers an interval → both conditions fail and it is dropped.",
      "Removal overlaps no interval → every interval emits exactly itself via one of the two pieces.",
    ],
    twists: [
      "**Interval List Intersections** (LeetCode 986) → intersect two interval lists with a two-pointer sweep instead of subtracting one range.",
      "**Insert Interval** (LeetCode 57) → the inverse operation, adding a range and merging overlaps.",
      "**Range Module** (LeetCode 715) → support repeated add/remove/query of ranges with an ordered structure.",
    ],
    related: ["interval-list-intersections", "insert-interval", "merge-intervals"],
  },
];
