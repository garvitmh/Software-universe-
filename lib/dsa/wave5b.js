// NeetCode 250 extras — wave 5b (stack, binary-search, linked-list). Java.
export const WAVE5B = [
  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "implement-queue-using-stacks",
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 232,
    statement:
      "Implement a FIFO **queue** (`push`, `pop`, `peek`, `empty`) using only standard **stack** operations — push to top, pop from top, peek at top, size, and is-empty.",
    examples: [
      {
        in: "push(1), push(2), peek(), pop(), empty()",
        out: "1, 1, false",
        note: "peek and pop return the oldest element (1), not the newest",
      },
    ],
    constraints: [
      "1 ≤ x ≤ 9",
      "At most 100 calls to push, pop, peek, empty",
      "All pop/peek calls are valid (queue is non-empty)",
    ],
    recognize:
      "A queue is **FIFO** (oldest out first); a stack is **LIFO** (newest out first). Reversing one stack into another flips the order — so **two stacks back-to-back** turn LIFO into FIFO. This is the classic 'simulate one structure with another' puzzle.",
    figureItOut: [
      "A stack gives you the **newest** element; a queue needs the **oldest**. One stack alone hands things back in exactly the wrong order. So you need to *reverse* the order somehow.",
      "Reversing a stack is easy: pop everything off it and push onto a second stack. The bottom of the first becomes the top of the second. Now the oldest element is on top — exactly what the queue wants.",
      "So keep two stacks: an **in** stack (everything you push lands here) and an **out** stack (where you pop/peek from). When `out` is empty and you need an element, dump all of `in` into `out` to reverse it.",
      "The clever part is *when* to transfer. Don't reverse on every operation — only refill `out` when it's empty. Each element gets moved from in→out exactly once over its lifetime, so it's cheap on average.",
    ],
    approaches: [
      {
        name: "Two stacks, amortized transfer (optimal)",
        intuition:
          "Push onto `in`. To pop/peek, if `out` is empty, pour all of `in` into `out` (reversing order); then the top of `out` is the front of the queue.",
        time: "O(1) amortized",
        timeWhy:
          "Each element is pushed to `in` once and moved to `out` at most once, so over n operations the total work is O(n) — O(1) per call averaged, even though a single pop that triggers a transfer is O(n).",
        space: "O(n)",
        spaceWhy: "The two stacks together hold at most all n elements currently in the queue.",
        code: `class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();   // newest on top
    private Deque<Integer> out = new ArrayDeque<>();  // oldest on top

    public void push(int x) {
        in.push(x);
    }

    public int pop() {
        peek();              // make sure out has the front on top
        return out.pop();
    }

    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());  // reverse in -> out
        }
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }
}`,
        walkthrough: [
          "push(1), push(2): in=[2,1] (2 on top), out=[].",
          "peek(): out empty → pour in into out → out=[1,2] (1 on top); return 1.",
          "pop(): out already has front on top → pop returns 1; out=[2].",
          "empty(): in empty but out has 2 → false.",
        ],
      },
    ],
    edgeCases: [
      "Calling peek before any push is excluded by the constraints, but a robust version would guard against an empty `out`.",
      "Interleaving pushes and pops: a push during a partially-drained queue lands on `in`, so it correctly stays *behind* whatever is in `out`.",
      "Never transfer back from `out` to `in` — that would scramble the order.",
    ],
    twists: [
      "**Implement a stack using queues** (LeetCode 225) → the mirror problem; rotate a queue so the newest element sits at the front.",
      "**Make every operation worst-case O(1)** → not possible with this two-stack trick; the transfer is inherently O(n) occasionally (only amortized O(1)).",
      "**Thread-safe queue** → wrap with locks, or use `java.util.concurrent` structures instead of rolling your own.",
    ],
    related: ["implement-stack-using-queues", "valid-parentheses"],
  },

  {
    slug: "implement-stack-using-queues",
    title: "Implement Stack using Queues",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 225,
    statement:
      "Implement a LIFO **stack** (`push`, `pop`, `top`, `empty`) using only standard **queue** operations — push to back, pop from front, peek at front, size, and is-empty.",
    examples: [
      {
        in: "push(1), push(2), top(), pop(), empty()",
        out: "2, 2, false",
        note: "top and pop return the newest element (2)",
      },
    ],
    constraints: [
      "1 ≤ x ≤ 9",
      "At most 100 calls to push, pop, top, empty",
      "All pop/top calls are valid (stack is non-empty)",
    ],
    recognize:
      "A stack is **LIFO** (newest out first); a queue is **FIFO** (oldest out first). To make a queue hand back the *newest* element first, **rotate** it so the just-pushed item moves to the front. 'Simulate one structure with another' again.",
    figureItOut: [
      "A queue pops from the front (oldest). A stack needs the newest. So after you add a new element to the back, you want it to be at the **front** so the next pop returns it.",
      "Trick: when you push x onto the back of the queue, then **rotate** — move every *older* element from front to back, one at a time. After all of them cycle around, x ends up at the front.",
      "Now the queue's natural front-pop returns the newest element, which is exactly stack behavior. `pop` and `top` are just the queue's normal poll/peek.",
      "This makes **push O(n)** (the rotation) and pop/top O(1). You could flip the cost the other way (cheap push, expensive pop); one queue is enough either way.",
    ],
    approaches: [
      {
        name: "Single queue, rotate on push (optimal)",
        intuition:
          "Add x to the back, then move every element before it from front to back so x bubbles to the front. Now front = newest.",
        time: "O(n) push, O(1) pop/top",
        timeWhy:
          "Push rotates all existing elements once → O(n). Pop and top are a single queue operation → O(1).",
        space: "O(n)",
        spaceWhy: "One queue holds all n elements.",
        code: `class MyStack {
    private Queue<Integer> q = new LinkedList<>();

    public void push(int x) {
        q.add(x);                       // x goes to the back
        for (int i = 1; i < q.size(); i++) {
            q.add(q.remove());          // rotate older elements behind x
        }
        // now x sits at the front
    }

    public int pop() {
        return q.remove();              // front = newest
    }

    public int top() {
        return q.peek();
    }

    public boolean empty() {
        return q.isEmpty();
    }
}`,
        walkthrough: [
          "push(1): q=[1]; no rotation needed → front=1.",
          "push(2): q=[1,2], then rotate 1 element → remove 1, add 1 → q=[2,1]; front=2.",
          "top(): peek front → 2. pop(): remove front → 2; q=[1].",
          "empty(): q has 1 → false.",
        ],
      },
    ],
    edgeCases: [
      "First push needs no rotation (size is 1) — the loop runs zero times.",
      "Pushing onto a multi-element stack must rotate *all* prior elements, or the order breaks.",
      "An empty pop/top is excluded by constraints, but production code should guard it.",
    ],
    twists: [
      "**Implement a queue using stacks** (LeetCode 232) → the mirror problem; two stacks turn LIFO into FIFO amortized.",
      "**Cheap push, expensive pop** → leave the queue untouched on push, and on pop rotate all but the last element into a second queue. Same big-O, cost moved.",
      "**Use exactly two queues** → a common interview variant; swap roles each push so the new element lands alone in front.",
    ],
    related: ["implement-queue-using-stacks", "valid-parentheses"],
  },

  {
    slug: "asteroid-collision",
    title: "Asteroid Collision",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 735,
    statement:
      "Given an array `asteroids` where each value's sign is its direction (positive = right, negative = left) and its magnitude is its size, simulate all collisions. Two asteroids collide when a right-mover meets a left-mover; the smaller explodes, or both if equal size. Return the surviving asteroids.",
    examples: [
      { in: "asteroids = [5,10,-5]", out: "[5,10]", note: "-5 hits 10 and explodes; 5 and 10 both move right" },
      { in: "asteroids = [8,-8]", out: "[]", note: "equal sizes destroy each other" },
      { in: "asteroids = [10,2,-5]", out: "[10]", note: "-5 destroys 2, then is destroyed by 10" },
    ],
    constraints: [
      "2 ≤ asteroids.length ≤ 10⁴",
      "−1000 ≤ asteroids[i] ≤ 1000",
      "asteroids[i] ≠ 0",
    ],
    recognize:
      "A collision only ever involves the **most recent surviving right-mover** and the current left-mover. 'Resolve against the nearest unfinished thing on the left' is the **stack** signature — here a stack of survivors.",
    figureItOut: [
      "Picture the asteroids moving on a line. Only a right-mover (positive) immediately followed by a left-mover (negative) can ever collide — same-direction neighbors never catch each other.",
      "When a new left-moving asteroid arrives, it threatens the **most recent right-mover still alive**. That 'most recent' is the top of a stack of survivors — the giveaway for a stack.",
      "Process each asteroid. A right-mover (or a left-mover with no right-mover behind it) just survives → push it. A left-mover must fight: while the stack top is a right-mover smaller than it, that top explodes (pop). If they're equal, both die. If the top is bigger, the incoming one dies.",
      "Be careful with the loop: a single left-mover can chain through several smaller right-movers before settling, so use a `while` to keep popping, and a flag to know whether the incoming asteroid itself survived.",
    ],
    approaches: [
      {
        name: "Stack of survivors (optimal)",
        intuition:
          "Push right-movers. For each left-mover, pop smaller right-movers it destroys; stop (and maybe destroy itself) when it meets an equal/larger one.",
        time: "O(n)",
        timeWhy:
          "Each asteroid is pushed at most once and popped at most once, so total push/pop work is O(n).",
        space: "O(n)",
        spaceWhy: "In the worst case (all moving the same direction) every asteroid survives on the stack.",
        code: `int[] asteroidCollision(int[] asteroids) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (int a : asteroids) {
        boolean alive = true;
        // a is left-moving and there is a right-mover on top to collide with
        while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {
            if (stack.peek() < -a) {
                stack.pop();          // top right-mover is smaller → it explodes, keep fighting
            } else if (stack.peek() == -a) {
                stack.pop();          // equal → both explode
                alive = false;
            } else {
                alive = false;        // top is bigger → incoming explodes
            }
        }
        if (alive) stack.push(a);
    }
    int[] res = new int[stack.size()];
    for (int i = res.length - 1; i >= 0; i--) res[i] = stack.pop();  // stack is reversed
    return res;
}`,
        walkthrough: [
          "[10,2,-5]: push 10, push 2 → stack=[10,2] (2 on top).",
          "-5 arrives (left): top 2 < 5 → pop 2 → stack=[10]; top 10 > 5 → -5 explodes, alive=false.",
          "Result, read from bottom up: [10].",
        ],
      },
    ],
    edgeCases: [
      "Two left-movers in a row → no collision (both move away from each other); both survive.",
      "Equal sizes colliding → both destroyed; the incoming one must be marked dead so it isn't pushed.",
      "A left-mover with an empty stack (no right-mover behind) just survives and is pushed.",
      "Building the result: the stack pops newest-first, so fill the array back-to-front to restore original order.",
    ],
    twists: [
      "**Report which asteroids survived (indices)** → push (value, index) pairs instead of bare values.",
      "**Asteroids of different speeds** → simple stack logic breaks; you'd need event-ordering by collision time.",
      "**Cars/trucks merging on a lane** → many real problems reduce to this same 'incoming destroys smaller recent survivors' shape.",
    ],
    related: ["valid-parentheses", "baseball-game", "daily-temperatures"],
  },

  {
    slug: "baseball-game",
    title: "Baseball Game",
    difficulty: "Easy",
    pattern: "stack",
    leetcode: 682,
    statement:
      "You record points with operations: an integer x records that score; `'+'` records the sum of the previous two scores; `'D'` records double the previous score; `'C'` cancels (removes) the previous score. Given the list of operations, return the **sum** of all scores that remain.",
    examples: [
      {
        in: 'ops = ["5","2","C","D","+"]',
        out: "30",
        note: "5; 2; C removes 2; D doubles 5 → 10; + adds 5+10 → 15. Stack [5,10,15] sums to 30",
      },
      { in: 'ops = ["1","C"]', out: "0", note: "1 is recorded then cancelled" },
    ],
    constraints: [
      "1 ≤ ops.length ≤ 1000",
      "Each op is an integer (may be negative), or one of '+', 'D', 'C'",
      "For '+'/'C'/'D' the operation is always valid (enough prior scores exist)",
    ],
    recognize:
      "Every operation reaches back to the **last one or two recorded scores** — `C` undoes the most recent, `D`/`+` read the most recent. 'Operate on the most recent entries, with undo' is exactly a **stack**.",
    figureItOut: [
      "Each instruction only cares about the *recent* scores: 'C' deletes the last, 'D' reads the last, '+' reads the last two. That recency is the tell for a stack — push valid scores, and the top is always 'the previous score'.",
      "Walk the operations one by one. For a plain integer, push it. For 'C', pop (undo the last record). For 'D', push 2× the current top. For '+', push the sum of the top two (peek both, don't remove them).",
      "The trick with '+': you need the top two values but you must keep them. Pop the top, peek the new top, compute the sum, then push the popped value back plus the sum — or just index into a list. A list-backed stack makes this easiest.",
      "At the end, every value still on the stack counts — sum them all.",
    ],
    approaches: [
      {
        name: "Stack of live scores (optimal)",
        intuition:
          "Replay the operations on a stack: integers push, 'C' pops, 'D' pushes double the top, '+' pushes the sum of the top two. Sum what survives.",
        time: "O(n)",
        timeWhy: "One pass over the operations; each push/pop/peek is O(1).",
        space: "O(n)",
        spaceWhy: "The stack can hold up to n recorded scores.",
        code: `int calPoints(String[] ops) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String op : ops) {
        switch (op) {
            case "C":
                stack.pop();                       // cancel previous
                break;
            case "D":
                stack.push(2 * stack.peek());      // double previous
                break;
            case "+": {
                int top = stack.pop();
                int sum = top + stack.peek();      // sum of previous two
                stack.push(top);                   // restore the one we popped
                stack.push(sum);
                break;
            }
            default:
                stack.push(Integer.parseInt(op));  // a literal score
        }
    }
    int total = 0;
    for (int v : stack) total += v;
    return total;
}`,
        walkthrough: [
          '["5","2","C","D","+"]: push 5 → [5]; push 2 → [5,2].',
          '"C": pop → [5]. "D": push 10 → [5,10]. "+": sum 5+10=15 → [5,10,15].',
          "Total = 5 + 10 + 15 = 30.",
        ],
      },
    ],
    edgeCases: [
      "Negative integer scores are allowed — `Integer.parseInt` handles the minus sign.",
      "'+' must restore the value it popped, or the next operation sees the wrong top.",
      "After a 'C', the stack may be empty before the next valid record — the constraints promise operations are always valid.",
    ],
    twists: [
      "**Support a 'U' undo that reverts the last *operation*** → push enough info (or snapshots) to reverse 'C'/'D'/'+', not just the score.",
      "**Return the running maximum score** → track a max alongside, or a monotonic auxiliary stack.",
      "**Streaming input** → same stack logic works online, one op at a time, no need to see them all up front.",
    ],
    related: ["valid-parentheses", "evaluate-reverse-polish-notation", "asteroid-collision"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 35,
    statement:
      "Given a **sorted** array of distinct integers `nums` and a `target`, return the index of the target if found, otherwise the index where it would be inserted to keep the array sorted. Must run in O(log n).",
    examples: [
      { in: "nums = [1,3,5,6], target = 5", out: "2" },
      { in: "nums = [1,3,5,6], target = 2", out: "1", note: "would slot between 1 and 3" },
      { in: "nums = [1,3,5,6], target = 7", out: "4", note: "goes at the end" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−10⁴ ≤ nums[i], target ≤ 10⁴", "nums sorted ascending, distinct"],
    recognize:
      "Sorted array + O(log n) = **binary search**. The twist over plain search is that 'not found' must return the **insertion point** — which is exactly the **lower bound**: the first index whose value is ≥ target.",
    figureItOut: [
      "The O(log n) requirement on sorted data is the binary-search bell. The only new wrinkle is what to return when the target isn't present.",
      "Reframe the question: you want the **first index where `nums[i] >= target`**. If the target exists, that's its own index. If it doesn't, that's exactly where it slots in to stay sorted. Same answer either way — no special-casing 'found'.",
      "So binary-search for that boundary. Keep [lo, hi]; when `nums[mid] >= target`, the answer might be `mid` or earlier, so move `hi`; when `nums[mid] < target`, the answer is strictly to the right, so `lo = mid + 1`.",
      "When the range collapses, `lo` lands on the first element ≥ target — or on `nums.length` if everything was smaller (target goes at the very end). Return `lo`.",
    ],
    approaches: [
      {
        name: "Lower-bound binary search (optimal)",
        intuition:
          "Find the first index with `nums[i] >= target`; that index is both the found position and the insertion point.",
        time: "O(log n)",
        timeWhy: "The candidate range halves each iteration.",
        space: "O(1)",
        spaceWhy: "Two indices.",
        code: `int searchInsert(int[] nums, int target) {
    int lo = 0, hi = nums.length;        // hi is one past the end on purpose
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] >= target) hi = mid;   // answer is mid or to the left
        else lo = mid + 1;                   // answer is strictly right
    }
    return lo;
}`,
        walkthrough: [
          "nums=[1,3,5,6], target=2: lo=0,hi=4; mid=2(5)≥2 → hi=2; mid=1(3)≥2 → hi=1; mid=0(1)<2 → lo=1; lo==hi=1 → return 1.",
          "target=7: every mid < 7 → lo climbs to 4 (= length) → insert at the end.",
        ],
      },
    ],
    edgeCases: [
      "Target smaller than everything → index 0.",
      "Target larger than everything → index nums.length (note `hi` starts at length, not length−1, so this is reachable).",
      "Single-element array → one comparison decides index 0 or 1.",
    ],
    twists: [
      "**Duplicates allowed** → this lower-bound returns the *first* occurrence; flip the comparison to `>` for the upper bound (first index strictly greater).",
      "**Count elements ≤ target** → it's `upperBound(target)`; combine lower and upper bounds to count a value's occurrences in O(log n).",
      "**2-D sorted matrix** → flatten the index math and binary-search the same way.",
    ],
    related: ["binary-search", "first-bad-version", "find-peak-element"],
  },

  {
    slug: "first-bad-version",
    title: "First Bad Version",
    difficulty: "Easy",
    pattern: "binary-search",
    leetcode: 278,
    statement:
      "Versions 1..n were released in order; once a version is bad, every later one is bad too. Given an API `isBadVersion(v)` returning true/false, find the **first bad version** while calling the API as few times as possible.",
    examples: [
      { in: "n = 5, first bad = 4", out: "4", note: "isBadVersion: 1,2,3 good; 4,5 bad" },
      { in: "n = 1, first bad = 1", out: "1" },
    ],
    constraints: ["1 ≤ first bad ≤ n ≤ 2³¹ − 1", "Minimize calls to isBadVersion"],
    recognize:
      "The versions form a **monotonic** good…good…bad…bad sequence — exactly one flip point. 'Find the boundary where a monotonic predicate flips false→true' is **binary search on a predicate**, even though there's no array of values to look at.",
    figureItOut: [
      "You don't have an array of comparable values — you have a yes/no test `isBadVersion(v)`. The key observation: the answers go good, good, …, good, bad, bad, …, bad. Once bad, always bad. That's **monotonic**.",
      "Monotonic predicate ⇒ binary search on the answer. You're hunting the single point where false flips to true: the first version where `isBadVersion` returns true.",
      "Keep a range [lo, hi] guaranteed to contain the first bad version. Test the middle. If it's bad, the first bad is `mid` or earlier → `hi = mid`. If it's good, the first bad is strictly later → `lo = mid + 1`.",
      "Use `lo + (hi - lo) / 2` for the midpoint — `n` can be near 2³¹, so `(lo + hi)` would overflow `int`. When the range collapses, `lo` is the first bad version.",
    ],
    approaches: [
      {
        name: "Binary search on the boundary (optimal)",
        intuition:
          "Shrink [lo, hi] toward the false→true flip: a bad mid pulls hi down to mid, a good mid pushes lo past mid.",
        time: "O(log n)",
        timeWhy: "Halving the version range each step → about log₂(n) API calls.",
        space: "O(1)",
        spaceWhy: "Two integer bounds.",
        code: `// extends VersionControl, which provides: boolean isBadVersion(int version)
int firstBadVersion(int n) {
    int lo = 1, hi = n;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;    // overflow-safe; n may be ~2^31
        if (isBadVersion(mid)) hi = mid; // first bad is mid or earlier
        else lo = mid + 1;               // first bad is after mid
    }
    return lo;                           // lo == hi == first bad version
}`,
        walkthrough: [
          "n=5, first bad=4: lo=1,hi=5; mid=3 good → lo=4; mid=4 bad → hi=4; lo==hi=4 → return 4.",
          "Only ~log₂(5) ≈ 3 API calls instead of scanning all 5.",
        ],
      },
    ],
    edgeCases: [
      "All versions bad (first bad = 1) → lo never advances → returns 1.",
      "Only the last version bad → lo climbs to n.",
      "`(lo + hi)` overflow is a real bug at this scale — always use `lo + (hi - lo) / 2`.",
    ],
    twists: [
      "**Find the *last good* version** → it's `firstBad − 1`; or search for the true→false equivalent.",
      "**API calls are expensive/rate-limited** → binary search already minimizes calls to O(log n); a galloping/exponential search helps only if the boundary is near the start.",
      "**General predicate boundary** → any 'first x where condition(x) holds' on a monotonic condition uses this same template (Koko, ship-within-D-days).",
    ],
    related: ["binary-search", "search-insert-position", "find-peak-element"],
  },

  {
    slug: "find-peak-element",
    title: "Find Peak Element",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 162,
    statement:
      "A peak element is strictly greater than its neighbors. Given `nums` where `nums[i] != nums[i+1]` and the out-of-bounds neighbors are treated as −∞, return the index of **any** peak. Must run in O(log n).",
    examples: [
      { in: "nums = [1,2,3,1]", out: "2", note: "3 is greater than both neighbors" },
      { in: "nums = [1,2,1,3,5,6,4]", out: "5", note: "index 1 or 5 are both valid peaks" },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 1000",
      "−2³¹ ≤ nums[i] ≤ 2³¹ − 1",
      "nums[i] != nums[i+1] for all valid i",
    ],
    recognize:
      "There's no sorted array, yet O(log n) is demanded — the trick is that the **slope direction** is a monotonic-enough signal. Binary search 'toward the higher neighbor' always corners a peak. It's binary search on a property, not a value.",
    figureItOut: [
      "O(log n) with no sorted array is the puzzle. You can't compare against a target — so what *can* you binary-search on? The **direction of the slope** at the midpoint.",
      "Look at `nums[mid]` versus `nums[mid+1]`. If `nums[mid] < nums[mid+1]`, you're on an **uphill** — there must be a peak somewhere to the right (the array can't rise forever; the right edge is −∞), so search the right half.",
      "If `nums[mid] > nums[mid+1]`, you're on a **downhill** — a peak lies at `mid` or to its left (again, it can't fall forever; the left edge is −∞). Search the left half, keeping `mid` in range.",
      "Each step throws away half the array while guaranteeing a peak still lives in the remaining half. When [lo, hi] collapses to one index, that element is a peak. Compare only `mid` and `mid+1`, never overrun the array.",
    ],
    approaches: [
      {
        name: "Binary search on the slope (optimal)",
        intuition:
          "Move toward the higher neighbor: uphill → go right, downhill → go left. A peak is always trapped in the chosen half.",
        time: "O(log n)",
        timeWhy: "The candidate range halves each iteration.",
        space: "O(1)",
        spaceWhy: "Two indices.",
        code: `int findPeakElement(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < nums[mid + 1]) lo = mid + 1;  // uphill → peak is to the right
        else hi = mid;                                // downhill (or peak) → keep mid, go left
    }
    return lo;                                        // lo == hi points at a peak
}`,
        walkthrough: [
          "nums=[1,2,1,3,5,6,4]: lo=0,hi=6; mid=3(3)<nums[4]=5 → lo=4; mid=5(6)>nums[6]=4 → hi=5; mid=4(5)<6 → lo=5; lo==hi=5 → return 5.",
          "nums[5]=6 is greater than nums[4]=5 and nums[6]=4 → valid peak.",
        ],
      },
    ],
    edgeCases: [
      "Single element → it's a peak by definition (both neighbors are −∞).",
      "Strictly increasing array → the last index is the peak; the search walks right to it.",
      "Strictly decreasing array → index 0 is the peak; the search stays left.",
      "Comparing `nums[mid+1]` is safe because the loop condition `lo < hi` guarantees `mid < hi`, so `mid+1` is in bounds.",
    ],
    twists: [
      "**Return the leftmost / largest peak** → there can be many; this finds *a* peak in O(log n), but 'the global max' requires a full O(n) scan.",
      "**2-D peak (peak in a matrix, LeetCode 1901)** → binary-search columns, scan each midline for its max.",
      "**Equal neighbors allowed** → the strict-inequality guarantee is what makes O(log n) work; with plateaus you may degrade to O(n).",
    ],
    related: ["binary-search", "search-in-rotated-sorted-array", "find-minimum-in-rotated-sorted-array"],
  },

  {
    slug: "search-a-2d-matrix-ii",
    title: "Search a 2D Matrix II",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 240,
    statement:
      "Search a value `target` in an `m × n` matrix where **each row is sorted left-to-right and each column is sorted top-to-bottom** (but rows are NOT globally chained — the start of a row can be smaller than the end of the previous row). Return whether the target exists.",
    examples: [
      {
        in: "matrix = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]], target = 5",
        out: "true",
      },
      { in: "same matrix, target = 20", out: "false" },
    ],
    constraints: [
      "1 ≤ m, n ≤ 300",
      "−10⁹ ≤ matrix[i][j], target ≤ 10⁹",
      "Rows sorted ascending; columns sorted ascending",
    ],
    recognize:
      "Sorted rows AND sorted columns, but not one big sorted run — so plain binary search on a flattened index fails. The unlock is the **top-right (or bottom-left) corner**, where one direction increases and the other decreases: a staircase walk eliminates a row or column each step.",
    figureItOut: [
      "Your first instinct — flatten and binary search — breaks here, because unlike LeetCode 74 the rows aren't chained into one sorted sequence. You need to exploit both sortings at once.",
      "Pick a starting cell that is a **decision point**: the **top-right** corner. It's the largest in its row and the smallest in its column. That asymmetry is the key.",
      "Compare it to the target. If it equals target, done. If the corner is **bigger** than target, the target can't be in this column (everything below is even bigger) → move **left** (drop a column). If the corner is **smaller**, the target can't be in this row (everything to the left is even smaller) → move **down** (drop a row).",
      "Each step deletes an entire row or column, so from an m×n grid you take at most m+n steps. It's a 'staircase' search — not a halving binary search, but the same spirit of cutting the space using order.",
    ],
    approaches: [
      {
        name: "Staircase from the top-right corner (optimal)",
        intuition:
          "Start top-right. Bigger than target → go left (drop the column); smaller → go down (drop the row). Each move eliminates a line.",
        time: "O(m + n)",
        timeWhy: "Each step removes one row or one column; you can do that at most m + n times before running off the grid.",
        space: "O(1)",
        spaceWhy: "Two indices for the current cell.",
        code: `boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;   // start at the top-right corner
    while (row < matrix.length && col >= 0) {
        int val = matrix[row][col];
        if (val == target) return true;
        else if (val > target) col--;          // too big → this whole column is out
        else row++;                            // too small → this whole row is out
    }
    return false;
}`,
        walkthrough: [
          "target=5, start at matrix[0][3]=11: 11>5 → col-- → 7>5 → col-- → 4<5 → row++ (now matrix[1][2]=8).",
          "8>5 → col-- → matrix[1][1]=5 == 5 → return true.",
        ],
      },
    ],
    edgeCases: [
      "Empty matrix or empty first row → guard before reading matrix[0].length (constraints here forbid it, but real code should check).",
      "Target smaller than the top-left or larger than the bottom-right → the walk runs off an edge and returns false.",
      "Single row or single column → degrades gracefully to a one-directional scan.",
    ],
    twists: [
      "**Rows chained into one sorted run (LeetCode 74)** → there a true O(log(m·n)) binary search on the flattened index works; this staircase is for the weaker 'sorted both ways' guarantee.",
      "**Count elements ≤ target** → the staircase also counts how much you eliminate, useful in 'kth smallest in a sorted matrix'.",
      "**Bottom-left start** → equally valid: bigger → up, smaller → right. Top-right and bottom-left are the only two corners that work.",
    ],
    related: ["search-a-2d-matrix", "binary-search", "find-peak-element"],
  },

  {
    slug: "single-element-in-a-sorted-array",
    title: "Single Element in a Sorted Array",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 540,
    statement:
      "In a **sorted** array where every element appears exactly twice except for one element that appears once, find that single element. Must run in O(log n) time and O(1) space.",
    examples: [
      { in: "nums = [1,1,2,3,3,4,4,8,8]", out: "2" },
      { in: "nums = [3,3,7,7,10,11,11]", out: "10" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "0 ≤ nums[i] ≤ 10⁵", "Exactly one element appears once; rest appear twice"],
    recognize:
      "XOR would solve it in O(n), but the O(log n) requirement on a **sorted** array screams binary search. The unlock is a **parity argument** on indices: before the single element the pairs sit on (even, odd) indices; after it the pairing shifts.",
    figureItOut: [
      "The easy answer is XOR every element — duplicates cancel, the loner remains. That's O(n), but the problem demands O(log n). Sorted + O(log n) ⇒ binary search. So what property can you binary-search on?",
      "Think about index parity. **Before** the single element, each pair occupies indices (0,1), (2,3), (4,5), … — the first of each pair sits at an **even** index. **After** the single element, every pair gets shifted by one, so pairs start at **odd** indices.",
      "So at any even index `mid`, check its partner `nums[mid+1]`. If they're equal, the single element is to the **right** (the clean pairing still holds here) → search right. If they differ, the single element is at `mid` or to the **left** → search left.",
      "Force `mid` to be even (`if (mid % 2 == 1) mid--`) so the 'compare with mid+1' logic is always pairing-aligned. The range collapses onto the single element.",
    ],
    approaches: [
      {
        name: "Binary search on pair parity (optimal)",
        intuition:
          "At an even mid, if nums[mid] == nums[mid+1] the loner is to the right; otherwise it's mid or to the left.",
        time: "O(log n)",
        timeWhy: "The candidate range halves each step.",
        space: "O(1)",
        spaceWhy: "Two indices; nothing copied.",
        code: `int singleNonDuplicate(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (mid % 2 == 1) mid--;             // align mid to the even index of a pair
        if (nums[mid] == nums[mid + 1]) lo = mid + 2;  // pair intact → loner is right
        else hi = mid;                                 // pair broken → loner is mid or left
    }
    return nums[lo];
}`,
        walkthrough: [
          "nums=[1,1,2,3,3,4,4,8,8]: lo=0,hi=8; mid=4(even), nums[4]=3,nums[5]=4 differ → hi=4.",
          "mid=2(even), nums[2]=2,nums[3]=3 differ → hi=2; mid=1→0(even), nums[0]=1,nums[1]=1 equal → lo=2; lo==hi=2 → nums[2]=2.",
        ],
      },
    ],
    edgeCases: [
      "Single element array → that element is the answer (loop never runs).",
      "Loner at the very start → comparisons break at index 0 immediately.",
      "Loner at the very end → all left-pairs stay intact, lo climbs to the last index.",
      "Forgetting to align `mid` to an even index inverts the equality test and breaks the search.",
    ],
    twists: [
      "**Array is NOT sorted** → fall back to XOR in O(n); the parity trick needs the sorted structure.",
      "**Every element appears 3 times except one** → bit-counting per position (mod 3) replaces XOR; binary search no longer applies cleanly.",
      "**Find the loner's index, not value** → return `lo` instead of `nums[lo]`.",
    ],
    related: ["binary-search", "search-insert-position", "find-peak-element"],
  },

  // ───────────────────────────── LINKED LIST ─────────────────────────────
  {
    slug: "middle-of-the-linked-list",
    title: "Middle of the Linked List",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 876,
    statement:
      "Given the head of a singly linked list, return the **middle node**. If there are two middle nodes (even length), return the **second** one.",
    examples: [
      { in: "1→2→3→4→5", out: "node 3", note: "odd length → exact middle" },
      { in: "1→2→3→4→5→6", out: "node 4", note: "even length → the second middle" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 100", "1 ≤ Node.val ≤ 100"],
    recognize:
      "You can't index a linked list, and you want the middle in **one pass** without knowing the length first. 'Find the middle of a list in one pass' is the textbook **fast & slow pointer** (tortoise and hare).",
    figureItOut: [
      "The naive way is two passes: walk once to count n, then walk n/2 steps to the middle. Correct, but can you do it in a single pass without storing the length?",
      "Run two pointers from the head: `slow` moves one node per step, `fast` moves two. When `fast` reaches the end, it has traveled twice as far as `slow` — so `slow` is exactly halfway.",
      "The loop condition decides the even-length tie-break. Using `while (fast != null && fast.next != null)`, for even length `fast` falls off the end and `slow` lands on the **second** middle — exactly what's asked.",
      "No length, no extra storage, one traversal. The hare paces out the list while the tortoise marks the midpoint.",
    ],
    approaches: [
      {
        name: "Count then walk (two passes)",
        intuition: "Length n, then step n/2 nodes in.",
        time: "O(n)",
        timeWhy: "Two full traversals → still linear.",
        space: "O(1)",
        spaceWhy: "Just a counter and a pointer.",
        code: `ListNode middleNode(ListNode head) {
    int n = 0;
    for (ListNode p = head; p != null; p = p.next) n++;
    ListNode p = head;
    for (int i = 0; i < n / 2; i++) p = p.next;
    return p;
}`,
      },
      {
        name: "Fast & slow pointers (optimal, one pass)",
        intuition: "slow steps 1, fast steps 2; when fast finishes, slow is the middle.",
        time: "O(n)",
        timeWhy: "Single traversal; fast covers the list while slow covers half.",
        space: "O(1)",
        spaceWhy: "Two pointers.",
        code: `ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;        // +1
        fast = fast.next.next;   // +2
    }
    return slow;                 // lands on the (second) middle
}`,
        walkthrough: [
          "1→2→3→4→5: slow:1→2→3, fast:1→3→5(.next=null stop) → slow=3.",
          "1→2→3→4→5→6: slow:1→2→3→4, fast:1→3→5→null stop → slow=4 (second middle).",
        ],
      },
    ],
    edgeCases: [
      "Single node → fast can't advance → slow stays at head → returns the only node.",
      "Two nodes → returns the second (the chosen even-length tie-break).",
      "To get the *first* middle on even length, loop while `fast.next != null && fast.next.next != null` instead.",
    ],
    twists: [
      "**Detect a cycle (LeetCode 141)** → same fast/slow setup; if they ever meet, there's a loop.",
      "**Palindrome linked list** → use this to find the middle, then reverse the second half and compare.",
      "**Reorder list (LeetCode 143)** → split at the middle, reverse the back half, then weave.",
    ],
    related: ["linked-list-cycle", "palindrome-linked-list", "reorder-list"],
  },

  {
    slug: "palindrome-linked-list",
    title: "Palindrome Linked List",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 234,
    statement:
      "Given the head of a singly linked list, return `true` if the values read the same forwards and backwards. Aim for O(n) time and O(1) extra space.",
    examples: [
      { in: "1→2→2→1", out: "true" },
      { in: "1→2→3→2→1", out: "true" },
      { in: "1→2", out: "false" },
    ],
    constraints: ["1 ≤ number of nodes ≤ 10⁵", "0 ≤ Node.val ≤ 9"],
    recognize:
      "A palindrome compares the front against the back, but a singly linked list can only walk forward. The O(1)-space unlock combines two classic list moves: **fast/slow to find the middle**, then **in-place reverse** the second half so you can walk the halves toward each other.",
    figureItOut: [
      "The easy O(n)-space way: copy all values into an array (or push onto a stack) and check it equals its reverse. Clear, but the problem nudges you toward O(1) extra space.",
      "The hard part is that a singly linked list only goes forward — you can't walk from the back. So *make* a backward-walkable half: reverse the **second half** of the list in place.",
      "Step 1: find the middle with fast/slow pointers. Step 2: reverse the half of the list after the middle (the standard prev/cur/next reversal). Now you have a forward-walkable front half and a forward-walkable reversed back half.",
      "Step 3: walk both halves one node at a time, comparing values. Any mismatch → not a palindrome. If you reach the end of the shorter (second) half cleanly, it's a palindrome. (Optionally restore the list by reversing back.)",
    ],
    approaches: [
      {
        name: "Copy to array, compare with two pointers",
        intuition: "Dump values into a list, then two-pointer from both ends.",
        time: "O(n)",
        timeWhy: "One pass to copy, one pass to compare.",
        space: "O(n)",
        spaceWhy: "Stores every value in an auxiliary array.",
        code: `boolean isPalindrome(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
    int l = 0, r = vals.size() - 1;
    while (l < r) {
        if (!vals.get(l).equals(vals.get(r))) return false;
        l++; r--;
    }
    return true;
}`,
      },
      {
        name: "Find middle, reverse second half (optimal space)",
        intuition:
          "Fast/slow finds the midpoint; reverse the back half in place; walk front and reversed-back toward each other comparing values.",
        time: "O(n)",
        timeWhy: "Find middle O(n) + reverse O(n) + compare O(n) → still linear.",
        space: "O(1)",
        spaceWhy: "All work is pointer rewiring; no auxiliary array.",
        code: `boolean isPalindrome(ListNode head) {
    // 1) find middle (slow ends at start of second half)
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    // 2) reverse the second half
    ListNode prev = null;
    while (slow != null) {
        ListNode next = slow.next;
        slow.next = prev;
        prev = slow;
        slow = next;
    }
    // 3) compare the two halves
    ListNode left = head, right = prev;   // right walks the reversed back half
    while (right != null) {
        if (left.val != right.val) return false;
        left = left.next;
        right = right.next;
    }
    return true;
}`,
        walkthrough: [
          "1→2→2→1: middle slow lands at the 3rd node (2). Reverse back half → 1→2.",
          "Compare: left 1 vs right 1, left 2 vs right 2 → all match → true.",
        ],
      },
    ],
    edgeCases: [
      "Single node → trivially a palindrome → true.",
      "Even vs odd length both work: comparing only while `right != null` ignores the odd middle node automatically.",
      "Mutating the list is a side effect — if the caller still needs the original, reverse the second half back before returning.",
    ],
    twists: [
      "**Don't mutate the input** → reverse the second half, compare, then reverse it again to restore.",
      "**Doubly linked list** → trivial two-pointer from both ends, no reversal needed.",
      "**String palindrome with skips (LeetCode 125)** → same two-pointers-from-the-ends idea on an indexable sequence.",
    ],
    related: ["reverse-linked-list", "middle-of-the-linked-list", "reorder-list"],
  },

  {
    slug: "intersection-of-two-linked-lists",
    title: "Intersection of Two Linked Lists",
    difficulty: "Easy",
    pattern: "linked-list",
    leetcode: 160,
    statement:
      "Given the heads of two singly linked lists `headA` and `headB`, return the node where they **intersect** (the first shared node, by reference), or `null` if they never merge. The lists keep their structure; no cycles.",
    examples: [
      {
        in: "A: 4→1→8→4→5, B: 5→6→1→8→4→5 (sharing the 8→4→5 tail)",
        out: "node 8",
        note: "intersection is by reference, not value",
      },
      { in: "A: 2→6→4, B: 1→5 (no shared nodes)", out: "null" },
    ],
    constraints: [
      "1 ≤ m, n ≤ 3·10⁴ (list lengths)",
      "Lists have no cycles",
      "Intersection is by node identity, not equal values",
    ],
    recognize:
      "Two lists may have **different lengths** but a shared tail — the offset is the whole difficulty. The elegant O(1)-space unlock is the **two-pointer length-equalizer**: switch each pointer to the other list's head at the end so both walk the same total distance.",
    figureItOut: [
      "If the lists had equal length you'd just walk both in lockstep and watch for the same node. The problem is the length mismatch — the shared tail starts at different offsets in each list.",
      "Brute-force fix: measure both lengths, advance the longer list's pointer by the difference so the tails line up, then walk together. That works in O(m+n) and O(1) space.",
      "The slick trick avoids measuring. Walk pointer `a` through list A then continue into list B; walk `b` through list B then into list A. Each pointer travels `lenA + lenB` total, so after at most that many steps they're synchronized.",
      "If the lists intersect, `a` and `b` meet at the intersection node (they've each walked the same combined distance into the shared tail). If they don't, both reach `null` at the same time — and `null == null` ends the loop, returning `null`. Switching to the other head exactly when you hit the end is what cancels the length difference.",
    ],
    approaches: [
      {
        name: "Length difference, then walk together",
        intuition: "Advance the longer list by |lenA − lenB|, then step both until they match.",
        time: "O(m + n)",
        timeWhy: "Two passes to measure lengths, one to walk together.",
        space: "O(1)",
        spaceWhy: "A few pointers and counters.",
        code: `ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    int lenA = length(headA), lenB = length(headB);
    ListNode a = headA, b = headB;
    while (lenA > lenB) { a = a.next; lenA--; }   // drop the head start
    while (lenB > lenA) { b = b.next; lenB--; }
    while (a != b) { a = a.next; b = b.next; }    // walk in lockstep
    return a;                                     // the shared node, or null
}

private int length(ListNode head) {
    int n = 0;
    for (ListNode p = head; p != null; p = p.next) n++;
    return n;
}`,
      },
      {
        name: "Two-pointer head switch (optimal, no length math)",
        intuition:
          "When a pointer hits the end, restart it at the *other* list's head. Both cover lenA+lenB and meet at the intersection (or at null).",
        time: "O(m + n)",
        timeWhy: "Each pointer walks at most lenA + lenB nodes before they align.",
        space: "O(1)",
        spaceWhy: "Two pointers, no counters.",
        code: `ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode a = headA, b = headB;
    while (a != b) {
        a = (a == null) ? headB : a.next;   // switch to the other list at the end
        b = (b == null) ? headA : b.next;
    }
    return a;   // intersection node, or null if they never meet
}`,
        walkthrough: [
          "A: 4→1→[8→4→5], B: 5→6→1→[8→4→5]. lenA=5, lenB=6.",
          "a walks A(5) then B; b walks B(6) then A. After equalizing both reach node 8 simultaneously → return node 8.",
        ],
      },
    ],
    edgeCases: [
      "No intersection → both pointers eventually become null at the same step → loop ends, return null (the head-switch handles this naturally).",
      "Intersection at the very first node of one list → detected on the first alignment.",
      "Equal-value but distinct nodes must NOT match — compare by reference (`a != b`), never by `a.val`.",
    ],
    twists: [
      "**Lists may contain a cycle** → first detect cycles (Floyd), the merge logic changes entirely.",
      "**Find the intersection length (shared tail size)** → once you have the meeting node, walk to the end counting.",
      "**Hash-set approach** → store all of A's node references, then scan B for the first one present — O(n) space, simpler to reason about.",
    ],
    related: ["linked-list-cycle", "middle-of-the-linked-list", "reverse-linked-list"],
  },
];
