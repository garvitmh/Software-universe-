// NeetCode 150 — wave 1c (linked list). Java.
export const WAVE1C = [
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 206,
    statement:
      "Given the `head` of a singly linked list, reverse the list and return the new head.",
    examples: [
      { in: "head = [1,2,3,4,5]", out: "[5,4,3,2,1]" },
      { in: "head = [1,2]", out: "[2,1]" },
      { in: "head = []", out: "[]", note: "empty list stays empty" },
    ],
    constraints: ["0 ≤ list length ≤ 5000", "−5000 ≤ Node.val ≤ 5000"],
    recognize:
      "'**Reverse the list in place**' is the signature in-place-reversal problem. The whole trick is flipping each `next` pointer to point backwards, which needs three pointers: **prev**, **cur**, and a saved **next**.",
    figureItOut: [
      "What does reversing actually require? Node 1 currently points to node 2; afterwards node 2 must point to node 1. So for every node, you need to make its `next` point to the node that came **before** it.",
      "The danger: the moment you overwrite `cur.next` to point backwards, you've lost your only link to the rest of the list. So before you flip a pointer, you must **save** the next node.",
      "That gives the three-pointer dance: remember `next = cur.next`, flip `cur.next = prev`, then slide everyone forward — `prev = cur`, `cur = next`. Repeat until `cur` falls off the end.",
      "What does `prev` start as? The original head's new `next` should be `null` (it becomes the tail), so start `prev = null`. When the loop ends, `prev` is sitting on the last node you processed — the **new head**.",
      "A recursive view exists too: reverse everything after `head`, then make `head.next.next = head` and `head.next = null`. Same flip, expressed as recursion — but it costs O(n) call-stack space.",
    ],
    approaches: [
      {
        name: "Iterative three-pointer flip (optimal)",
        intuition:
          "Walk the list once, flipping each node's next to point at the node behind it. prev trails cur; a saved next keeps the rest reachable.",
        time: "O(n)",
        timeWhy: "Each node is visited and re-pointed exactly once.",
        space: "O(1)",
        spaceWhy: "Only three pointer variables, no matter how long the list is.",
        code: `ListNode reverseList(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;   // save before we lose it
        cur.next = prev;            // flip the pointer backwards
        prev = cur;                 // slide prev forward
        cur = next;                 // slide cur forward
    }
    return prev;                    // prev is the new head
}`,
        walkthrough: [
          "1->2->3, prev=null cur=1: save next=2, 1.next=null, prev=1, cur=2.",
          "cur=2: save next=3, 2.next=1, prev=2, cur=3.",
          "cur=3: save next=null, 3.next=2, prev=3, cur=null → loop ends, return 3 (3->2->1).",
        ],
      },
      {
        name: "Recursive reversal",
        intuition:
          "Reverse the tail, then hook the current node onto the end of that reversed tail.",
        time: "O(n)",
        timeWhy: "One recursive call per node.",
        space: "O(n)",
        spaceWhy: "The recursion stack goes n frames deep before it unwinds.",
        code: `ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseList(head.next);
    head.next.next = head;   // the node after head now points back to head
    head.next = null;        // head becomes the new tail
    return newHead;
}`,
        walkthrough: [
          "1->2->3: recurse to 3 (base case, newHead=3).",
          "Unwinding at 2: 2.next.next = 2 means 3->2; 2.next=null. Now 3->2.",
          "Unwinding at 1: 1.next.next = 1 means 2->1; 1.next=null. Final 3->2->1.",
        ],
      },
    ],
    edgeCases: [
      "Empty list (`head == null`) → return null; the loop body never runs.",
      "Single node → prev becomes that node, its next is already null → returns itself.",
      "Forgetting to save `next` before flipping is the classic bug — you orphan the rest of the list.",
    ],
    twists: [
      "**Reverse only a sublist [m, n]** (LeetCode 92) → walk to position m, reverse that stretch, splice it back with a dummy head.",
      "**Reverse in groups of k** (LeetCode 25) → reverse each k-block, leaving any short final block as-is.",
      "**Palindrome linked list** → reverse the second half and compare it against the first.",
    ],
    related: ["reorder-list", "reverse-nodes-in-k-group", "merge-two-sorted-lists"],
  },

  {
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 21,
    statement:
      "Given the heads of two **sorted** linked lists `list1` and `list2`, splice them into one sorted list and return its head. Reuse the existing nodes (no new node creation needed).",
    examples: [
      { in: "list1 = [1,2,4], list2 = [1,3,4]", out: "[1,1,2,3,4,4]" },
      { in: "list1 = [], list2 = []", out: "[]" },
      { in: "list1 = [], list2 = [0]", out: "[0]" },
    ],
    constraints: ["0 ≤ each list length ≤ 50", "−100 ≤ Node.val ≤ 100", "both lists are sorted ascending"],
    recognize:
      "Merging two already-sorted sequences node by node is the **merge step of merge sort**. Whenever you build a new list by repeatedly picking and appending, a **dummy head** node removes all the 'is this the first node?' special-casing.",
    figureItOut: [
      "Both lists are sorted, so at every moment the next-smallest node overall is the smaller of the two current heads. Compare the two fronts, take the smaller, advance that list — repeat.",
      "The awkward part is the very first append: you don't have a list to attach to yet, so you'd need an `if (result == null) ...` special case every time. That clutter is exactly what a **dummy head** removes.",
      "Create a throwaway `dummy` node and keep a `tail` pointer that always points at the last node of the merged list. Append by setting `tail.next = smaller`, then move `tail` forward. No first-node special case.",
      "When one list runs out, the other is already sorted — just attach the whole remainder in one move (`tail.next = whatever is left`). No need to keep comparing.",
      "Return `dummy.next` — the real head — and let the dummy be garbage-collected.",
    ],
    approaches: [
      {
        name: "Dummy head + tail pointer (optimal)",
        intuition:
          "Keep a tail at the end of the merged list. Each step, append the smaller of the two current heads; attach the leftover tail at the end.",
        time: "O(n + m)",
        timeWhy: "Each node from both lists is looked at and appended exactly once.",
        space: "O(1)",
        spaceWhy: "Nodes are re-linked in place; only a dummy and a tail pointer are allocated.",
        code: `ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (list1 != null && list2 != null) {
        if (list1.val <= list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    tail.next = (list1 != null) ? list1 : list2;   // attach the remainder
    return dummy.next;
}`,
        walkthrough: [
          "list1=1->2->4, list2=1->3->4. 1<=1 take list1's 1; tail=1.",
          "Compare 2 vs 1 → take 2nd list's 1; then 2 vs 3 → take 2; 4 vs 3 → take 3.",
          "4 vs 4 → take list1's 4; list1 now empty → attach list2's remaining 4. Result 1->1->2->3->4->4.",
        ],
      },
    ],
    edgeCases: [
      "Either list empty → the loop is skipped and the non-empty list is attached whole.",
      "Both empty → dummy.next is null → returns null.",
      "Equal values → using `<=` keeps the merge stable (ties take from list1 first).",
    ],
    twists: [
      "**Merge k sorted lists** (LeetCode 23) → a min-heap of the k heads, or pairwise merging.",
      "**Merge two sorted arrays in place** (LeetCode 88) → fill from the back so you never overwrite unread values.",
      "**Add two numbers as lists** → same dummy-head pattern, but you sum digits and carry instead of comparing.",
    ],
    related: ["merge-k-sorted-lists", "add-two-numbers", "reverse-linked-list"],
  },

  {
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 141,
    statement:
      "Given the `head` of a linked list, return `true` if the list contains a **cycle** (some node's `next` points back to an earlier node), and `false` otherwise.",
    examples: [
      { in: "head = [3,2,0,-4], tail connects to index 1", out: "true" },
      { in: "head = [1,2], tail connects to index 0", out: "true" },
      { in: "head = [1], no cycle", out: "false" },
    ],
    constraints: ["0 ≤ list length ≤ 10⁴", "−10⁵ ≤ Node.val ≤ 10⁵"],
    recognize:
      "'**Is there a loop?**' on a linked list is the textbook **fast & slow pointer** (Floyd's tortoise and hare). Two runners at different speeds either both fall off the end (no loop) or collide inside the loop.",
    figureItOut: [
      "The obvious approach: walk the list and record every node you've seen in a hash set. If you reach a node already in the set, it's a cycle. That works but costs O(n) memory.",
      "Can we do it without extra memory? Imagine two runners on a track. If the track is a straight line, the faster runner reaches the end first and the chase is over. If the track is a **loop**, the faster runner laps the field and eventually catches the slower one.",
      "So move one pointer one step at a time (`slow`) and another two steps at a time (`fast`). If there's no cycle, `fast` hits `null` and you return false.",
      "If there **is** a cycle, both pointers get trapped in the loop. Because `fast` gains one node on `slow` every step, the gap shrinks by one each time, so `fast` is guaranteed to land exactly on `slow` — they meet. Meeting means a cycle exists.",
      "Why exactly meet and not jump past? Once both are in the loop, the distance between them decreases by 1 per step (fast moves 2, slow moves 1). A gap that decreases by 1 must hit 0 — it can't skip over.",
    ],
    approaches: [
      {
        name: "Hash set of visited nodes",
        intuition:
          "Remember every node you've seen; revisiting one means a cycle.",
        time: "O(n)",
        timeWhy: "Each node is visited once before either repeating or ending.",
        space: "O(n)",
        spaceWhy: "The set may hold every node in the list.",
        code: `boolean hasCycle(ListNode head) {
    Set<ListNode> seen = new HashSet<>();
    while (head != null) {
        if (!seen.add(head)) return true;   // add fails if already present
        head = head.next;
    }
    return false;
}`,
      },
      {
        name: "Floyd's fast & slow pointers (optimal)",
        intuition:
          "A slow runner (1 step) and a fast runner (2 steps). They collide if and only if the list loops.",
        time: "O(n)",
        timeWhy: "Fast reaches the end in n/2 steps if no cycle; if there is one, they meet within a full loop's length.",
        space: "O(1)",
        spaceWhy: "Just two pointers, no extra structure.",
        code: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;        // one step
        fast = fast.next.next;   // two steps
        if (slow == fast) return true;
    }
    return false;
}`,
        walkthrough: [
          "3->2->0->-4 with -4 linking back to 2. slow=2,fast=0; slow=0,fast=2 (looped); slow=-4,fast=-4 → meet → true.",
          "No cycle: fast walks off the end (fast or fast.next becomes null) → false.",
        ],
      },
    ],
    edgeCases: [
      "Empty list or single node with no self-loop → fast/null guard returns false immediately.",
      "Single node pointing to itself → slow and fast meet at it → true.",
      "Checking `fast != null && fast.next != null` (in that order) avoids a null-pointer crash when stepping twice.",
    ],
    twists: [
      "**Return the node where the cycle begins** (LeetCode 142) → after they meet, reset one pointer to head and advance both one step; they meet at the cycle's entrance.",
      "**Find the cycle length** → after they meet, keep one fixed and count steps until the other returns.",
      "**Find the duplicate number** (LeetCode 287) → treat the array as a linked list of indices and run the very same Floyd's algorithm.",
    ],
    related: ["find-the-duplicate-number", "reorder-list", "remove-nth-node-from-end-of-list"],
  },

  {
    slug: "reorder-list",
    title: "Reorder List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 143,
    statement:
      "Given the head of a list `L0 → L1 → … → Ln−1 → Ln`, reorder it in place to `L0 → Ln → L1 → Ln−1 → L2 → Ln−2 → …`. You may not change node values — only the links.",
    examples: [
      { in: "head = [1,2,3,4]", out: "[1,4,2,3]" },
      { in: "head = [1,2,3,4,5]", out: "[1,5,2,4,3]" },
    ],
    constraints: ["1 ≤ list length ≤ 5·10⁴", "1 ≤ Node.val ≤ 1000"],
    recognize:
      "The target weaves the **front** of the list with the **reversed back**. That decomposes into three classic sub-routines: **find the middle** (fast/slow), **reverse the second half**, and **merge two lists by alternating**.",
    figureItOut: [
      "Look at the output [1,5,2,4,3]: it's the first half (1,2,3) interleaved with the second half taken backwards (5,4). 'Backwards second half' screams *reverse it*.",
      "Without modifying values and with O(1) space, you can't index into the list cheaply — so don't try to grab 'the last node' repeatedly (that's O(n) each time, O(n²) total). Instead, build the reversed back half once.",
      "Step 1 — **split**: find the middle with a fast/slow pointer. When fast reaches the end, slow sits at the midpoint, dividing the list into a front half and a back half.",
      "Step 2 — **reverse** the back half in place (the three-pointer flip from Reverse Linked List). Now you have two lists: the front, and the reversed back.",
      "Step 3 — **weave**: alternate nodes from the two lists — one from the front, one from the reversed back — relinking as you go. Carefully save each `.next` before overwriting it, just like a merge.",
    ],
    approaches: [
      {
        name: "Middle + reverse + weave (optimal)",
        intuition:
          "Cut the list in half, reverse the back half, then zip the two halves together alternately.",
        time: "O(n)",
        timeWhy: "Finding the middle, reversing, and weaving are each a single linear pass.",
        space: "O(1)",
        spaceWhy: "Everything is done by re-pointing existing nodes; only a handful of pointers are used.",
        code: `void reorderList(ListNode head) {
    if (head == null || head.next == null) return;

    // 1) find the middle (slow ends at the midpoint)
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // 2) reverse the second half, starting after slow
    ListNode prev = null, cur = slow.next;
    slow.next = null;            // cut the first half off
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }

    // 3) weave the two halves together
    ListNode first = head, second = prev;
    while (second != null) {
        ListNode t1 = first.next, t2 = second.next;
        first.next = second;
        second.next = t1;
        first = t1;
        second = t2;
    }
}`,
        walkthrough: [
          "[1,2,3,4,5]: middle search leaves slow at 3; cut → front 1->2->3, back 4->5.",
          "Reverse back → 5->4. Now front=1->2->3, second=5->4.",
          "Weave: 1->5->2->4->3. (first walks 1,2,3; second walks 5,4 until null.)",
        ],
      },
    ],
    edgeCases: [
      "One or two nodes → already in the target order; the early return handles length 1 and the weave is a no-op for length 2.",
      "Odd length → the front half keeps the extra middle node (cut after slow), so the weave ends cleanly.",
      "Forgetting `slow.next = null` leaves a link from the first half into the second, creating a cycle.",
    ],
    twists: [
      "**Only need the second half reversed comparison (palindrome)** → reuse find-middle + reverse, then compare instead of weave.",
      "**Reorder by k-grouping instead of front/back** → reverse-nodes-in-k-group handles the grouped variant.",
      "**Rotate the list by k** → a different relink: find the new tail, wrap the list, cut.",
    ],
    related: ["reverse-linked-list", "linked-list-cycle", "merge-two-sorted-lists"],
  },

  {
    slug: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 19,
    statement:
      "Given the `head` of a list, remove the **nth node from the end** and return the head. Try to do it in **one pass**.",
    examples: [
      { in: "head = [1,2,3,4,5], n = 2", out: "[1,2,3,5]", note: "remove the 4" },
      { in: "head = [1], n = 1", out: "[]" },
      { in: "head = [1,2], n = 1", out: "[1]" },
    ],
    constraints: ["1 ≤ list length ≤ 30", "1 ≤ n ≤ list length"],
    recognize:
      "'**nth from the end**' on a singly linked list (no length given) is the **two-pointer gap** trick: open a gap of n between two pointers, then move both until the front falls off — the back pointer lands right where you need it.",
    figureItOut: [
      "The catch with 'from the end' is that a singly linked list only goes forward — you can't count backwards. The easy fix is two passes: count the length L, then walk to node L−n. But the problem nudges you toward **one pass**.",
      "One-pass idea: keep two pointers exactly **n nodes apart**. Advance a `fast` pointer n steps ahead first. Then move `fast` and `slow` together until `fast` reaches the end. At that point `slow` is exactly n nodes from the end.",
      "But you need the node **before** the one you delete, so its `next` can skip over it. To remove the node n-from-end, stop `slow` one position earlier — at the (n+1)-from-end node.",
      "The head itself might be the node to delete (n equals the length). A **dummy head** in front of the real head makes that case ordinary: start `slow` at the dummy, and deleting the first real node is no different from any other.",
      "Concretely: dummy → head, move `fast` n+1 steps from the dummy, then advance both until `fast` is null; now `slow.next` is the victim, so set `slow.next = slow.next.next`.",
    ],
    approaches: [
      {
        name: "Two pointers with an n-gap + dummy (optimal)",
        intuition:
          "Give fast an n-node head start; when fast hits the end, slow sits just before the target. The dummy makes deleting the head uniform.",
        time: "O(n)",
        timeWhy: "A single linear pass; fast traverses the list once.",
        space: "O(1)",
        spaceWhy: "Two pointers and one dummy node.",
        code: `ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;

    // open a gap of n+1 so slow lands just BEFORE the target
    for (int i = 0; i <= n; i++) fast = fast.next;

    while (fast != null) {       // move together until fast falls off
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;  // skip over the nth-from-end node
    return dummy.next;
}`,
        walkthrough: [
          "[1,2,3,4,5], n=2. dummy->1->2->3->4->5. Move fast 3 steps → fast at 3.",
          "Advance both until fast null: fast 4,5,null; slow dummy->1->2->3 ends at 3.",
          "slow.next (=4) skipped → 3.next = 5. Result 1->2->3->5.",
        ],
      },
    ],
    edgeCases: [
      "Removing the head (n equals the length) → the dummy lets `slow` stop at the dummy and skip the real head.",
      "Single node, n=1 → dummy.next becomes null → returns empty list.",
      "The `<= n` loop bound (n+1 steps) is what makes slow stop *before* the target, not on it.",
    ],
    twists: [
      "**Two passes allowed** → first count the length L, then walk L−n steps and unlink.",
      "**Remove all nodes with a given value** (LeetCode 203) → dummy head, walk and skip matches.",
      "**Find the nth-from-end without removing** → same gap trick, just read slow's value.",
    ],
    related: ["linked-list-cycle", "reverse-linked-list", "reorder-list"],
  },

  {
    slug: "copy-list-with-random-pointer",
    title: "Copy List With Random Pointer",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 138,
    statement:
      "Each node has a `next` pointer and a `random` pointer that may point to any node in the list or to `null`. Return a **deep copy**: a brand-new list whose nodes mirror the structure but share no node objects with the original.",
    examples: [
      { in: "head = [[7,null],[13,0],[11,4],[10,2],[1,0]]", out: "a deep copy with identical val + random topology" },
      { in: "head = []", out: "[]" },
    ],
    constraints: ["0 ≤ list length ≤ 1000", "−10⁴ ≤ Node.val ≤ 10⁴", "random points to a list node or null"],
    recognize:
      "Cloning a graph-like structure where pointers can target **any** node is a **mapping problem**: you need 'given an original node, what's its copy?' The clean answer is a hash map `original → clone`; the slick answer interleaves clones with originals to do it in O(1) space.",
    figureItOut: [
      "The hard part is `random`: when you copy node A and its random points to node X, the *clone* of X might not exist yet. You can't set the random pointer until you know where every clone lives.",
      "That's a lookup: 'for this original node, which is its clone?' Build a **HashMap from original node → cloned node**. First pass: create a bare clone for every original and record the mapping. Second pass: for each original, set `clone.next = map.get(orig.next)` and `clone.random = map.get(orig.random)`.",
      "`map.get(null)` returning null is exactly what you want for the end of the list and for null randoms — no special casing needed.",
      "To drop the O(n) map, there's a trick: **interleave** each clone right after its original (A → A' → B → B' → …). Now a clone is always `orig.next`, so `orig.random.next` *is* the clone of the random target — set `A'.random = A.random.next` with no map.",
      "Finally, unweave the two lists to separate the copy from the original, restoring both `next` chains.",
    ],
    approaches: [
      {
        name: "Hash map: original → clone",
        intuition:
          "Clone every node first (recording the mapping), then wire next and random pointers using the map.",
        time: "O(n)",
        timeWhy: "Two linear passes, each map operation O(1) average.",
        space: "O(n)",
        spaceWhy: "The map stores one entry per node.",
        code: `Node copyRandomList(Node head) {
    Map<Node, Node> map = new HashMap<>();
    Node cur = head;
    while (cur != null) {                 // pass 1: create bare clones
        map.put(cur, new Node(cur.val));
        cur = cur.next;
    }
    cur = head;
    while (cur != null) {                 // pass 2: wire pointers
        map.get(cur).next = map.get(cur.next);
        map.get(cur).random = map.get(cur.random);
        cur = cur.next;
    }
    return map.get(head);
}`,
        walkthrough: [
          "Pass 1 maps every original node to a fresh node with the same val.",
          "Pass 2: clone(A).next = map[A.next], clone(A).random = map[A.random]. map.get(null)=null handles ends.",
          "Return map[head] — the clone of the first node.",
        ],
      },
      {
        name: "Interleave clones, O(1) space",
        intuition:
          "Insert each clone right after its original so a node's clone is always its next. Then random copies trivially, and you unweave at the end.",
        time: "O(n)",
        timeWhy: "Three linear passes: interleave, set randoms, unweave.",
        space: "O(1)",
        spaceWhy: "No map — the interleaving itself encodes the original→clone mapping.",
        code: `Node copyRandomList(Node head) {
    if (head == null) return null;

    // 1) place each clone right after its original: A -> A' -> B -> B' ...
    Node cur = head;
    while (cur != null) {
        Node clone = new Node(cur.val);
        clone.next = cur.next;
        cur.next = clone;
        cur = clone.next;
    }

    // 2) set clone randoms: clone is orig.next, so orig.random.next is clone-of-random
    cur = head;
    while (cur != null) {
        if (cur.random != null) cur.next.random = cur.random.next;
        cur = cur.next.next;
    }

    // 3) unweave the interleaved list back into two
    cur = head;
    Node copyHead = head.next;
    while (cur != null) {
        Node clone = cur.next;
        cur.next = clone.next;
        clone.next = (clone.next != null) ? clone.next.next : null;
        cur = cur.next;
    }
    return copyHead;
}`,
        walkthrough: [
          "Interleave: A->A'->B->B'->C->C'.",
          "Randoms: if A.random=C then A'.random = A.random.next = C'. Pure pointer hops, no map.",
          "Unweave: restore A->B->C and A'->B'->C'; return A'.",
        ],
      },
    ],
    edgeCases: [
      "Empty list → return null (the O(1) version guards this up front).",
      "A node whose random is null → `map.get(null)` (or the explicit null check) leaves the clone's random null.",
      "A random pointing to itself or to the head → handled naturally; the mapping doesn't care about direction.",
    ],
    twists: [
      "**Clone a general graph** (LeetCode 133) → same original→clone map, but explore with BFS/DFS over arbitrary neighbours.",
      "**Deep-copy a tree with parent + child pointers** → map every node, then rewire all pointer fields.",
      "**Serialize then deserialize** → an alternative deep copy via an intermediate encoding.",
    ],
    related: ["linked-list-cycle", "merge-two-sorted-lists"],
  },

  {
    slug: "add-two-numbers",
    title: "Add Two Numbers",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 2,
    statement:
      "Two non-negative integers are stored as linked lists with digits in **reverse order** (ones digit first), one digit per node. Add them and return the sum as a linked list in the same reverse-order format.",
    examples: [
      { in: "l1 = [2,4,3], l2 = [5,6,4]", out: "[7,0,8]", note: "342 + 465 = 807" },
      { in: "l1 = [0], l2 = [0]", out: "[0]" },
      { in: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]", out: "[8,9,9,9,0,0,0,1]", note: "carry ripples to a new digit" },
    ],
    constraints: ["1 ≤ each list length ≤ 100", "0 ≤ Node.val ≤ 9", "no leading zeros except the number 0 itself"],
    recognize:
      "Reverse-order digits + add per node = **grade-school addition with carry**, walked over two lists at once. A **dummy head** collects the result digits; a running **carry** crosses node boundaries.",
    figureItOut: [
      "Why reverse order? Because addition starts from the **ones digit** and carries leftward. With ones-first lists, you process both heads together — the alignment is already done for you.",
      "At each step add the two current digits plus any carry from the previous step. The new digit is `sum % 10`; the new carry is `sum / 10` (either 0 or 1).",
      "The two lists may differ in length. Treat a missing node as a 0 digit so you can keep going until **both** lists are exhausted.",
      "There's one more subtlety: after the last pair, the carry might still be 1 (e.g. 5 + 5 = 10). So the loop must also continue while `carry != 0`, appending that final digit.",
      "Build the answer with a **dummy head** and a `tail` you append to, so the first digit needs no special case. Return `dummy.next`.",
    ],
    approaches: [
      {
        name: "Single pass with carry + dummy head (optimal)",
        intuition:
          "Walk both lists together; at each node sum the digits and the carry, emit one result digit, carry the rest. Don't forget the trailing carry.",
        time: "O(max(n, m))",
        timeWhy: "One pass over the longer list; each node does O(1) arithmetic.",
        space: "O(max(n, m))",
        spaceWhy: "The result list has one node per output digit (plus possibly one for a final carry).",
        code: `ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
        int sum = carry;
        if (l1 != null) { sum += l1.val; l1 = l1.next; }
        if (l2 != null) { sum += l2.val; l2 = l2.next; }
        carry = sum / 10;
        tail.next = new ListNode(sum % 10);
        tail = tail.next;
    }
    return dummy.next;
}`,
        walkthrough: [
          "l1=2->4->3 (342), l2=5->6->4 (465). 2+5=7 carry0; 4+6=10 → digit0 carry1; 3+4+1=8 carry0.",
          "Both lists empty and carry 0 → stop. Result 7->0->8 (807).",
          "9999999 + 9999: the extra carry past both lists adds the final 1 node.",
        ],
      },
    ],
    edgeCases: [
      "Different lengths → the null-guards treat the shorter list's missing nodes as 0.",
      "Final carry (e.g. 5+5) → the `carry != 0` loop condition appends the leftover digit.",
      "Both inputs [0] → produces a single [0] node.",
    ],
    twists: [
      "**Digits stored in forward order** (LeetCode 445) → reverse both lists first, or use two stacks to add from the back.",
      "**Add k numbers** → carry can exceed 1; the same `% 10` / `/ 10` logic still works.",
      "**Multiply two list-numbers** → grade-school multiplication, accumulating partial products.",
    ],
    related: ["merge-two-sorted-lists", "reverse-linked-list"],
  },

  {
    slug: "find-the-duplicate-number",
    title: "Find the Duplicate Number",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 287,
    statement:
      "Given an array `nums` of `n + 1` integers where each value is in the range `[1, n]`, exactly one value is repeated (possibly more than once). Find that repeated value **without modifying the array** and using **O(1) extra space**.",
    examples: [
      { in: "nums = [1,3,4,2,2]", out: "2" },
      { in: "nums = [3,1,3,4,2]", out: "3" },
      { in: "nums = [3,3,3,3,3]", out: "3" },
    ],
    constraints: ["1 ≤ n ≤ 10⁵", "nums.length == n + 1", "every value in [1, n]", "read-only array, O(1) extra space"],
    recognize:
      "Values in `[1, n]` that index back into the array means you can treat `i → nums[i]` as **next pointers** — turning the array into a linked list with a cycle. The duplicate is the cycle's entrance, found by **Floyd's fast & slow**.",
    figureItOut: [
      "First see why a cycle must exist. Read each index as a node and `nums[i]` as 'where node i points'. Because every value is in `[1, n]`, following the pointers from index 0 keeps you inside valid indices — you can wander forever, so the path must eventually **loop**.",
      "Now why does the loop's entrance equal the duplicate? Two different indices both holding the same value point to the **same** next node — that's two arrows into one node, which is exactly what forms a cycle entrance. The repeated value is that shared target.",
      "So this is *Linked List Cycle II* in disguise. Phase 1: run `slow = nums[slow]` and `fast = nums[nums[fast]]` until they meet somewhere inside the cycle.",
      "Phase 2 (the entrance finder): reset one pointer to the start (index 0) and advance **both** one step at a time. The math of Floyd's algorithm guarantees they meet exactly at the cycle's entrance — and that node's index is the duplicate value.",
      "This reads the array but never writes it (O(1) space), unlike the marking trick that flips signs. The hash-set approach is simpler but costs O(n) memory; binary-search-on-count (Pigeonhole) is the other read-only option at O(n log n).",
    ],
    approaches: [
      {
        name: "Floyd's cycle detection on index pointers (optimal)",
        intuition:
          "Treat nums as a linked list (i → nums[i]). Find the meeting point with fast/slow, then walk from the start to the cycle entrance — the duplicate.",
        time: "O(n)",
        timeWhy: "Both phases are linear walks over the implicit list.",
        space: "O(1)",
        spaceWhy: "Just two integer pointers; the array is never modified.",
        code: `int findDuplicate(int[] nums) {
    // phase 1: find an intersection point inside the cycle
    int slow = nums[0], fast = nums[nums[0]];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    // phase 2: find the entrance of the cycle = the duplicate
    slow = 0;
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
        walkthrough: [
          "nums=[1,3,4,2,2]. Pointers: 0->1->3->2->4->2->4... a cycle 2->4->2.",
          "Phase 1 walks slow x1 / fast x2 until they meet inside that loop.",
          "Phase 2: reset slow to index 0, step both by one; they meet at index 2 → value 2 is the duplicate.",
        ],
      },
      {
        name: "Hash set (simple, uses memory)",
        intuition: "Remember seen values; the first repeat is the answer.",
        time: "O(n)",
        timeWhy: "One pass, O(1) set operations.",
        space: "O(n)",
        spaceWhy: "The set can hold up to n distinct values — violates the O(1) constraint but is the easiest to reason about.",
        code: `int findDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (!seen.add(x)) return x;
    }
    return -1;   // problem guarantees a duplicate exists
}`,
      },
    ],
    edgeCases: [
      "All elements identical (e.g. [3,3,3,3,3]) → still one repeated value; Floyd's handles it.",
      "The duplicate appears more than twice → still exactly one distinct repeated value, so the answer is unique.",
      "Index 0 is never the cycle entrance because no value is 0 (values are in [1, n]), so starting Floyd's from nums[0] is safe.",
    ],
    twists: [
      "**Array is modifiable** → mark visited by negating `nums[abs(x)]`; a value already negative is the duplicate (O(1) space, O(n) time).",
      "**Find all duplicates** (LeetCode 442) → the index-marking trick, collecting every value whose slot is already negative.",
      "**Binary search on the count** → count how many values are ≤ mid; if it exceeds mid, the duplicate is in the lower half (read-only, O(n log n)).",
    ],
    related: ["linked-list-cycle", "contains-duplicate", "binary-search"],
  },

  {
    slug: "lru-cache",
    title: "LRU Cache",
    difficulty: "Medium",
    pattern: "linked-list",
    leetcode: 146,
    statement:
      "Design a cache with a fixed `capacity` supporting `get(key)` and `put(key, value)`, both in **O(1)**. When the cache is full, a `put` of a new key evicts the **least recently used** entry. Reading or writing a key marks it as most recently used.",
    examples: [
      {
        in: "capacity 2; put(1,1); put(2,2); get(1)→1; put(3,3) evicts 2; get(2)→-1; put(4,4) evicts 1; get(1)→-1; get(3)→3; get(4)→4",
        out: "1, -1, -1, 3, 4",
        note: "every access reorders recency",
      },
    ],
    constraints: ["1 ≤ capacity ≤ 3000", "0 ≤ key, value ≤ 10⁵", "up to 2·10⁵ calls to get/put", "get and put must be O(1)"],
    recognize:
      "'**O(1) get/put + evict the least-recently-used**' is the canonical **HashMap + doubly linked list** design. The map gives O(1) lookup by key; the doubly linked list gives O(1) reordering and eviction by recency.",
    figureItOut: [
      "Two requirements pull in different directions: O(1) lookup by key wants a **hash map**, but tracking 'least recently used' wants an **ordering** you can update cheaply. Neither structure alone does both.",
      "Why a list for ordering? Keep entries in recency order — most-recently-used at one end, least at the other. On every access you move that entry to the MRU end, and eviction always removes from the LRU end.",
      "Why *doubly* linked, and why nodes instead of an array? To move a node to the front in O(1) you must splice it out from the middle, which needs its **previous** neighbour — that's the `prev` pointer a singly linked list lacks. An array would cost O(n) to shift on every touch.",
      "Tie the two together: the hash map maps `key → the node` in the list. `get` looks up the node (O(1)), then moves it to the front (O(1) splice). `put` updates or inserts a node at the front; if over capacity, unlink the tail's previous node and erase its key from the map.",
      "Use two **sentinel** nodes, a fake `head` and `tail`, so insert and remove never have to null-check the ends. The real entries always live strictly between them.",
    ],
    approaches: [
      {
        name: "HashMap + doubly linked list (optimal)",
        intuition:
          "Map keys to list nodes for O(1) lookup; keep nodes ordered by recency in a doubly linked list so move-to-front and evict-tail are O(1).",
        time: "O(1)",
        timeWhy: "Map get/put is O(1) average; list splice (remove + insert-at-front) is O(1) because we hold direct node references.",
        space: "O(capacity)",
        spaceWhy: "One map entry and one list node per cached key, bounded by capacity.",
        code: `class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0);   // sentinel: MRU side
    private final Node tail = new Node(0, 0);    // sentinel: LRU side

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    private void remove(Node n) {            // unlink a node
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }

    private void insertFront(Node n) {       // place right after head (MRU)
        n.next = head.next;
        n.prev = head;
        head.next.prev = n;
        head.next = n;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node n = map.get(key);
        remove(n);
        insertFront(n);                      // touched → most recent
        return n.val;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node n = map.get(key);
            n.val = value;
            remove(n);
            insertFront(n);
            return;
        }
        if (map.size() == capacity) {        // evict the LRU node
            Node lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
        Node n = new Node(key, value);
        map.put(key, n);
        insertFront(n);
    }
}`,
        walkthrough: [
          "capacity 2. put(1,1),put(2,2): list head<->2<->1<->tail, map{1,2}.",
          "get(1)→1: move 1 to front → head<->1<->2<->tail.",
          "put(3,3): full → evict tail.prev (=2), remove key 2; insert 3 at front → head<->3<->1<->tail. get(2)→-1.",
        ],
      },
    ],
    edgeCases: [
      "`get` on a missing key → return -1 without touching the list.",
      "`put` of an existing key → update value and promote to front; do NOT evict (size unchanged).",
      "Capacity 1 → every new key evicts the previous one; sentinels keep the splice logic uniform.",
      "Sentinel head/tail nodes mean insert/remove never dereference null at the boundaries.",
    ],
    twists: [
      "**LFU cache** (LeetCode 460) → evict the least-*frequently* used; keep frequency buckets, each a doubly linked list.",
      "**Java shortcut** → `LinkedHashMap` with `accessOrder = true` and an overridden `removeEldestEntry` gives an LRU in a few lines.",
      "**TTL / time-based expiry** → store timestamps and lazily evict on access.",
    ],
    related: ["reverse-linked-list", "merge-two-sorted-lists"],
  },

  {
    slug: "merge-k-sorted-lists",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    pattern: "linked-list",
    leetcode: 23,
    statement:
      "Given an array of `k` linked lists, each sorted ascending, merge them all into one sorted linked list and return its head.",
    examples: [
      { in: "lists = [[1,4,5],[1,3,4],[2,6]]", out: "[1,1,2,3,4,4,5,6]" },
      { in: "lists = []", out: "[]" },
      { in: "lists = [[]]", out: "[]" },
    ],
    constraints: ["0 ≤ k ≤ 10⁴", "0 ≤ each list length ≤ 500", "−10⁴ ≤ Node.val ≤ 10⁴", "total nodes ≤ 10⁴ across all lists (typical)"],
    recognize:
      "'**Merge k sorted things**' is the signature **min-heap** problem: a heap of the k current heads always hands you the global smallest in O(log k). Alternatively, **divide and conquer** by pairwise-merging halves.",
    figureItOut: [
      "Start from what you know: merging *two* sorted lists is O(n). The naive extension — merge list 1 with 2, then with 3, and so on — keeps re-walking the growing accumulator, costing O(k·N) total. Wasteful.",
      "The repeated question each step is: 'across the k current front nodes, which is smallest?' Scanning all k heads every time is O(k) per node → O(k·N). A **min-heap** answers that same question in O(log k).",
      "So push the head of each list into a min-heap ordered by value. Pop the smallest, append it to the result, and push that node's `next` (if any) back into the heap. The heap never holds more than k nodes.",
      "Each of the N nodes is pushed and popped once, each heap op O(log k) → O(N log k). A dummy head collects the output, just like merging two lists.",
      "A second route avoids the heap: **divide and conquer**. Pair up the k lists and merge each pair (k/2 merges), then pair up the results, and so on — log k rounds, each touching all N nodes → also O(N log k), with O(1) extra space beyond recursion.",
    ],
    approaches: [
      {
        name: "Min-heap of the k current heads (optimal)",
        intuition:
          "Keep the smallest available node always reachable in O(log k). Pop it, append it, and push its successor.",
        time: "O(N log k)",
        timeWhy: "N total nodes, each pushed and popped once; each heap operation costs O(log k) since the heap holds at most k nodes.",
        space: "O(k)",
        spaceWhy: "The heap stores at most one node per list at a time.",
        code: `ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> heap =
        new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode node : lists) {
        if (node != null) heap.offer(node);
    }
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;
    while (!heap.isEmpty()) {
        ListNode smallest = heap.poll();
        tail.next = smallest;
        tail = tail.next;
        if (smallest.next != null) heap.offer(smallest.next);
    }
    return dummy.next;
}`,
        walkthrough: [
          "lists heads 1,1,2 go into the heap. Poll 1 (from list A), push its next 4.",
          "Heap now {1(B),2,4}. Poll 1(B), push 3. Continue popping the smallest each time.",
          "Output grows 1,1,2,3,4,4,5,6 as the heap drains.",
        ],
      },
      {
        name: "Divide and conquer (pairwise merge)",
        intuition:
          "Merge lists in pairs, halving the count each round, until one list remains.",
        time: "O(N log k)",
        timeWhy: "log k merge rounds; each round merges every node once → O(N) per round.",
        space: "O(log k)",
        spaceWhy: "Recursion depth is log k; no heap allocated.",
        code: `ListNode mergeKLists(ListNode[] lists) {
    if (lists.length == 0) return null;
    return merge(lists, 0, lists.length - 1);
}

private ListNode merge(ListNode[] lists, int lo, int hi) {
    if (lo == hi) return lists[lo];
    int mid = lo + (hi - lo) / 2;
    ListNode left = merge(lists, lo, mid);
    ListNode right = merge(lists, mid + 1, hi);
    return mergeTwo(left, right);
}

private ListNode mergeTwo(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
        walkthrough: [
          "4 lists → merge (L0,L1) and (L2,L3) → 2 lists.",
          "Merge those two → 1 list. Two rounds = log₂(4).",
          "Each round walks every node once, so total work is O(N log k).",
        ],
      },
    ],
    edgeCases: [
      "Empty input array (k = 0) → return null.",
      "Array containing empty lists (nulls) → skip them when seeding the heap.",
      "Using `a.val - b.val` as the comparator is fine here because values fit comfortably in int (no overflow within the constraints).",
    ],
    twists: [
      "**Merge k sorted arrays** → same heap idea, but store (value, listIndex, elemIndex) tuples.",
      "**Smallest range covering all k lists** (LeetCode 632) → heap of one element per list, track the current min/max.",
      "**Just two lists** → fall back to the plain merge-two-sorted-lists routine.",
    ],
    related: ["merge-two-sorted-lists", "reverse-nodes-in-k-group"],
  },

  {
    slug: "reverse-nodes-in-k-group",
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    pattern: "linked-list",
    leetcode: 25,
    statement:
      "Given the `head` of a list, reverse the nodes **k at a time** and return the modified list. If the number of nodes is not a multiple of k, leave the **last leftover group** as-is. You may not change node values, only the links.",
    examples: [
      { in: "head = [1,2,3,4,5], k = 2", out: "[2,1,4,3,5]", note: "last node alone is left as-is" },
      { in: "head = [1,2,3,4,5], k = 3", out: "[3,2,1,4,5]" },
      { in: "head = [1,2,3,4,5], k = 1", out: "[1,2,3,4,5]", note: "k=1 is a no-op" },
    ],
    constraints: ["1 ≤ k ≤ list length ≤ 5000", "0 ≤ Node.val ≤ 1000"],
    recognize:
      "This is **in-place reversal**, gated by a counting condition. Each chunk is a Reverse-Linked-List, but you must first **check a full group of k exists**, then **stitch** the reversed chunk back into the chain — a job for a **dummy head** and a `groupPrev` pointer.",
    figureItOut: [
      "Each group is just Reverse Linked List on a stretch of k nodes. The two new difficulties are: (1) only reverse if a *complete* group of k remains, and (2) reconnect each reversed chunk to the one before and after it.",
      "Before reversing a group, walk k nodes ahead to confirm the group is full. If you can't find a k-th node, you've hit the leftover tail — stop and leave it untouched.",
      "Track the node **before** the current group (`groupPrev`). After reversing the k nodes, `groupPrev.next` should point to the new first node of the group (the old last), and the old first node — now the group's tail — should link to the node that follows the group.",
      "Do the reversal the usual three-pointer way, but bound it: reverse exactly k nodes, with the chunk's tail initially pointing to the node just past the group (`kth.next`) so the stitch is automatic.",
      "A **dummy head** in front lets `groupPrev` start somewhere valid even for the very first group, and gives a stable node to return `dummy.next` from. After each group, advance `groupPrev` to the chunk's new tail (the original group's first node).",
    ],
    approaches: [
      {
        name: "Group-check + bounded reversal + stitch (optimal)",
        intuition:
          "For each group: verify k nodes exist, reverse exactly those k, then reconnect to the surrounding list. A dummy head anchors the first group.",
        time: "O(n)",
        timeWhy: "Each node is part of one group-length check and one reversal — visited a constant number of times.",
        space: "O(1)",
        spaceWhy: "Iterative pointer manipulation; no recursion or extra structures.",
        code: `ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode groupPrev = dummy;

    while (true) {
        // find the k-th node from groupPrev; stop if fewer than k remain
        ListNode kth = groupPrev;
        for (int i = 0; i < k && kth != null; i++) kth = kth.next;
        if (kth == null) break;

        ListNode groupNext = kth.next;      // first node AFTER this group
        // reverse the group: prev starts as groupNext so the tail links forward
        ListNode prev = groupNext, cur = groupPrev.next;
        while (cur != groupNext) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }

        // stitch: groupPrev.next was the old first node = new tail
        ListNode newTail = groupPrev.next;
        groupPrev.next = kth;               // kth is the new head of the group
        groupPrev = newTail;                // advance to the next group's prev
    }
    return dummy.next;
}`,
        walkthrough: [
          "[1,2,3,4,5], k=3. groupPrev=dummy; kth walks to 3; groupNext=4.",
          "Reverse 1,2,3 with prev starting at 4 → 3->2->1->4. groupPrev.next set to 3; newTail=1.",
          "Next group from groupPrev=1: kth can't find 3 more nodes (only 4,5) → break. Result 3->2->1->4->5.",
        ],
      },
      {
        name: "Recursive per group",
        intuition:
          "Reverse the first k nodes if they exist, then recurse on the rest and attach it.",
        time: "O(n)",
        timeWhy: "Each node is reversed once across all recursive calls.",
        space: "O(n / k)",
        spaceWhy: "One recursion frame per group on the call stack.",
        code: `ListNode reverseKGroup(ListNode head, int k) {
    ListNode node = head;
    for (int i = 0; i < k; i++) {              // is a full group available?
        if (node == null) return head;         // fewer than k → leave as-is
        node = node.next;
    }
    // reverse the first k nodes
    ListNode prev = reverseKGroup(node, k);    // recurse on the remainder first
    ListNode cur = head;
    for (int i = 0; i < k; i++) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;                               // new head of this group
}`,
        walkthrough: [
          "k=2 on [1,2,3,4,5]: confirm 1,2 exist; recurse on 3->4->5.",
          "That returns 4->3->5; reverse 1,2 with prev=that → 2->1->4->3->5.",
          "The final lone 5 has no full group, so it is returned unchanged.",
        ],
      },
    ],
    edgeCases: [
      "k = 1 → every group is a single node, so the list is unchanged.",
      "List length not a multiple of k → the final short group is left in original order (the k-check breaks out).",
      "k equals the full length → the whole list reverses exactly once.",
    ],
    twists: [
      "**Reverse only if the group is complete (default), or also reverse the tail** → drop the k-availability check to reverse a partial final group too.",
      "**Reverse a sublist between positions m and n** (LeetCode 92) → reverse a single bounded stretch rather than repeating groups.",
      "**Swap nodes in pairs** (LeetCode 24) → this exact problem with k fixed at 2.",
    ],
    related: ["reverse-linked-list", "reorder-list", "merge-k-sorted-lists"],
  },
];
