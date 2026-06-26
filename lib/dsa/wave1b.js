// NeetCode 150 — wave 1b (stack, binary search). Java.
export const WAVE1B = [
  // ───────────────────────────── STACK ─────────────────────────────
  {
    slug: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 155,
    statement:
      "Design a stack that supports `push`, `pop`, `top`, and **`getMin`** — retrieving the minimum element — each in **O(1)** time.",
    examples: [
      {
        in: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
        out: "-3, then 0, then -2",
        note: "getMin returns -3; after pop, top is 0 and min is back to -2",
      },
    ],
    constraints: [
      "−2³¹ ≤ val ≤ 2³¹ − 1",
      "pop, top, getMin are only called on a non-empty stack",
      "At most 3·10⁴ calls total",
    ],
    recognize:
      "It's a normal stack with one extra demand: **the minimum, in O(1)**. The trick to any 'O(1) running min/max' is to *remember the answer alongside the data* instead of recomputing it — store the min at each level as you go.",
    figureItOut: [
      "A plain stack gives push/pop/top in O(1) already. The only hard part is `getMin` in O(1). The naive idea — scan the whole stack on every getMin — is O(n). So the real question is: how do I know the min **without looking**?",
      "Think about what the min depends on. The current minimum is decided entirely by which elements are *currently on the stack*. When you pop, the min might change back to what it was before that element was pushed. That 'before' is the clue: the answer is tied to stack history.",
      "Key realization: the minimum at any moment is a function of the stack's current height. So **store the min-so-far at each level**. When you push x, also record `min(x, currentMin)`. That value is the minimum of everything at or below this point.",
      "Now pop is trivial: removing the top also removes its recorded min, which automatically restores the previous min. `getMin` just reads the min recorded at the top — O(1).",
      "Two ways to store it: a parallel min-stack, or pack `(value, minSoFar)` into one stack of pairs. Either way the insight is the same — carry the answer, don't recompute it.",
    ],
    approaches: [
      {
        name: "Recompute min by scanning (baseline)",
        intuition: "Keep one stack; on getMin, walk every element to find the smallest.",
        time: "O(n) per getMin",
        timeWhy: "push/pop/top are O(1), but getMin scans all n elements every call — violates the requirement.",
        space: "O(n)",
        spaceWhy: "Just the one stack of values.",
        code: `// Conceptual baseline — getMin is O(n), shown for contrast.
// push/pop/top use a single Deque; getMin loops over it to find the smallest.`,
      },
      {
        name: "Parallel min-stack (optimal)",
        intuition: "A second stack mirrors the first, holding the minimum-so-far at each level.",
        time: "O(1) for every operation",
        timeWhy: "Each call does a constant number of pushes/pops/reads — no scanning.",
        space: "O(n)",
        spaceWhy: "The mins stack grows alongside the values stack, so up to 2n entries.",
        code: `class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> mins = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        int curMin = mins.isEmpty() ? val : Math.min(val, mins.peek());
        mins.push(curMin);          // min of everything at or below this level
    }

    public void pop() {
        stack.pop();
        mins.pop();                 // discarding the top restores the previous min
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return mins.peek();         // O(1): the min was precomputed on push
    }
}`,
        walkthrough: [
          "push(-2): stack=[-2], mins=[-2]. push(0): mins pushes min(0,-2)=-2 → mins=[-2,-2].",
          "push(-3): mins pushes min(-3,-2)=-3 → mins=[-2,-2,-3]. getMin()→-3.",
          "pop(): both pop → mins=[-2,-2]. top()→0. getMin()→-2 (restored automatically).",
        ],
      },
    ],
    edgeCases: [
      "Duplicate minimums (e.g. push the same min twice) — recording the min per level handles this; popping one copy still leaves the min correct.",
      "Values at the int boundary (±2³¹) — `Math.min` on ints is fine; avoid any sum-based tricks that could overflow.",
      "Single element — getMin equals top.",
    ],
    twists: [
      "**O(1) extra space variant** → instead of a second stack, store the encoded difference `2*val − min` and recover the previous min on pop (clever, but easy to get wrong).",
      "**Max stack** → identical idea with `Math.max`.",
      "**Min queue (getMin over a FIFO)** → harder; use two stacks or a monotonic deque.",
    ],
    related: ["valid-parentheses", "daily-temperatures"],
  },

  {
    slug: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 150,
    statement:
      "Evaluate an arithmetic expression in **Reverse Polish Notation** (postfix). `tokens` is an array of numbers and the operators `+`, `-`, `*`, `/`. Division truncates toward zero. Return the integer result.",
    examples: [
      { in: 'tokens = ["2","1","+","3","*"]', out: "9", note: "(2 + 1) * 3" },
      { in: 'tokens = ["4","13","5","/","+"]', out: "6", note: "4 + (13 / 5) = 4 + 2" },
    ],
    constraints: [
      "1 ≤ tokens.length ≤ 10⁴",
      "Each token is an operator or an integer in [−200, 200]",
      "The expression is always valid; division never by zero",
    ],
    recognize:
      "Postfix notation means **an operator applies to the two most recent values**. 'Most recent' + 'consume then produce' is the signature of a **stack**: push numbers, and on an operator, pop the top two, combine, push the result.",
    figureItOut: [
      "What does RPN actually mean? `3 4 +` means 'take 3 and 4, add them'. The operator always comes *after* its operands and acts on the two values right before it. So as you read left to right, you accumulate values until an operator tells you to combine the latest two.",
      "'The latest two values' is the giveaway: that's LIFO, a stack. Numbers get pushed. When you meet an operator, the two operands it needs are exactly the top two items on the stack.",
      "So: pop `b` (the second operand, pushed last), pop `a` (the first operand), compute `a op b` — order matters for `-` and `/` — then push the result back. The result becomes an operand for whatever comes next.",
      "When the tokens run out, exactly one value remains on the stack: the answer. There's no need to parse precedence or parentheses — postfix already encodes all of that in its order.",
    ],
    approaches: [
      {
        name: "Stack of operands (optimal)",
        intuition: "Push numbers; each operator pops two, combines them (minding operand order), and pushes the result.",
        time: "O(n)",
        timeWhy: "One pass over the tokens; each token causes O(1) stack work.",
        space: "O(n)",
        spaceWhy: "In the worst case (a long run of numbers before any operator) the stack holds about n values.",
        code: `int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String t : tokens) {
        switch (t) {
            case "+": case "-": case "*": case "/":
                int b = stack.pop();          // second operand (pushed last)
                int a = stack.pop();          // first operand
                stack.push(apply(a, b, t));
                break;
            default:
                stack.push(Integer.parseInt(t));
        }
    }
    return stack.pop();
}

int apply(int a, int b, String op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        default:  return a / b;               // truncates toward zero in Java
    }
}`,
        walkthrough: [
          'tokens = ["4","13","5","/","+"]: push 4, push 13, push 5 → stack [4,13,5].',
          '"/": pop b=5, a=13 → 13/5=2 → push 2 → stack [4,2].',
          '"+": pop b=2, a=4 → 6 → push 6 → stack [6]. End → return 6.',
        ],
      },
    ],
    edgeCases: [
      "Operand order: for `-` and `/`, the first popped value is the right operand. Swapping them is the classic bug.",
      "Negative numbers as tokens (e.g. \"-4\") — `Integer.parseInt` handles the minus sign, but the operator check must not misread it as subtraction.",
      "Java integer division already truncates toward zero, matching the spec; in other languages you may need to fix the rounding direction.",
    ],
    twists: [
      "**Infix expression with parentheses** (Basic Calculator, LeetCode 224/227) → use a stack but handle precedence, or convert to postfix first (shunting-yard).",
      "**Prefix (Polish) notation** → scan right to left with the same stack idea.",
      "**Return as a double / support more operators** → widen the value type and extend `apply`.",
    ],
    related: ["min-stack", "valid-parentheses"],
  },

  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 22,
    statement:
      "Given `n` pairs of parentheses, return **all combinations of well-formed parentheses** — every string that uses exactly `n` `(` and `n` `)` and stays balanced.",
    examples: [
      { in: "n = 3", out: '["((()))","(()())","(())()","()(())","()()()"]' },
      { in: "n = 1", out: '["()"]' },
    ],
    constraints: ["1 ≤ n ≤ 8"],
    recognize:
      "You're **enumerating every valid arrangement** subject to a balance rule. 'Generate all valid X' → build the string one character at a time and **backtrack** when a choice can't stay valid. The validity rule is the same one a stack checks, so we track it with a running counter.",
    figureItOut: [
      "Brute force: generate all 2^(2n) strings of `(` and `)`, then keep the balanced ones (validate each with a stack). Correct, but most strings are garbage — for n=8 that's 65536 strings, the vast majority invalid. We're generating then filtering; better to *never generate the bad ones*.",
      "Build the string character by character instead. At each step you choose to add `(` or `)`. The question becomes: when is each choice **still legal** so far?",
      "Two rules keep a prefix extendable to a valid string: (1) you can add `(` as long as you haven't used all n opens yet; (2) you can add `)` only if there's an unmatched `(` to close — i.e. close count is strictly less than open count.",
      "So track two counters: `open` used and `close` used. Recurse: if `open < n` try adding `(`; if `close < open` try adding `)`. When the string reaches length 2n, it's a complete valid combination — record it.",
      "This is backtracking: choose a bracket, recurse, then implicitly un-choose as the recursion returns. The `close < open` invariant is exactly the stack-balance condition, enforced *as you build* rather than checked afterward.",
    ],
    approaches: [
      {
        name: "Generate all, filter the valid ones (baseline)",
        intuition: "Produce every 2^(2n) string, validate each with a stack/counter, keep the balanced ones.",
        time: "O(2^(2n) · n)",
        timeWhy: "2^(2n) candidate strings, each O(n) to validate — wildly wasteful since most are invalid.",
        space: "O(n)",
        spaceWhy: "Recursion depth / validation stack of size 2n (excluding the output).",
        code: `// Conceptual baseline — enumerate every ( / ) string of length 2n,
// validate each with the Valid-Parentheses stack, keep the balanced ones.
// Correct but exponentially wasteful; shown only for contrast.`,
      },
      {
        name: "Backtracking with open/close counts (optimal)",
        intuition: "Build only valid prefixes: add `(` while opens remain, add `)` only while it stays balanced.",
        time: "O(4ⁿ / √n)",
        timeWhy: "The number of valid strings is the n-th Catalan number (~4ⁿ/(n√n)); we do O(n) work per string built, and we never explore invalid branches.",
        space: "O(n)",
        spaceWhy: "Recursion depth is at most 2n; the running StringBuilder is length 2n (output not counted).",
        code: `List<String> generateParenthesis(int n) {
    List<String> res = new ArrayList<>();
    backtrack(res, new StringBuilder(), 0, 0, n);
    return res;
}

void backtrack(List<String> res, StringBuilder cur, int open, int close, int n) {
    if (cur.length() == 2 * n) {            // a complete, balanced string
        res.add(cur.toString());
        return;
    }
    if (open < n) {                          // can still open
        cur.append('(');
        backtrack(res, cur, open + 1, close, n);
        cur.deleteCharAt(cur.length() - 1);  // un-choose
    }
    if (close < open) {                      // can close only if something is open
        cur.append(')');
        backtrack(res, cur, open, close + 1, n);
        cur.deleteCharAt(cur.length() - 1);  // un-choose
    }
}`,
        walkthrough: [
          "n=2: start \"\" (0,0). Add ( → \"(\" (1,0). Add ( → \"((\" (2,0). Now open==n, only close allowed.",
          "Close twice → \"(())\" length 4 → record. Back up to \"(\" (1,0), add ) → \"()\" (1,1).",
          "From \"()\", add ( → \"()(\" then ) → \"()()\" → record. Result: [\"(())\", \"()()\"].",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → exactly [\"()\"]; the counters allow only that one path.",
      "Adding `)` when `close == open` is forbidden — that guard is what prevents strings like \")(\".",
      "Remember to un-choose (delete the last char) after each branch, or the StringBuilder leaks characters into sibling branches.",
    ],
    twists: [
      "**Count combinations only** → the answer is the n-th Catalan number; no need to build the strings.",
      "**Different bracket types / multiple kinds** → track a stack of opened types instead of a single counter.",
      "**Remove invalid parentheses** (LeetCode 301) → BFS/DFS over deletions to reach validity.",
    ],
    related: ["valid-parentheses", "min-stack"],
  },

  {
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 739,
    statement:
      "Given `temperatures`, return an array `answer` where `answer[i]` is the **number of days you have to wait** after day i for a warmer temperature. If there is no future warmer day, `answer[i] = 0`.",
    examples: [
      { in: "temperatures = [73,74,75,71,69,72,76,73]", out: "[1,1,4,2,1,1,0,0]" },
      { in: "temperatures = [30,40,50,60]", out: "[1,1,1,0]" },
      { in: "temperatures = [30,60,90]", out: "[1,1,0]" },
    ],
    constraints: ["1 ≤ temperatures.length ≤ 10⁵", "30 ≤ temperatures[i] ≤ 100"],
    recognize:
      "'For each element, find the **next greater** one to the right' is the textbook **monotonic stack**. The moment you see 'next warmer / next greater / next smaller', think of a stack that holds the elements still waiting for their answer.",
    figureItOut: [
      "Brute force: for each day i, scan forward until you find a warmer day. O(n²). Correct — now find the waste. Lots of days re-scan the same cold stretch over and over.",
      "Reframe it: every day is 'waiting' for the next warmer day. Once a warmer day appears, it resolves *all* the recent days that were colder than it. That 'resolve the recent unresolved ones' is a stack signal.",
      "Keep a stack of **indices of days still waiting** for a warmer day. Crucially, keep it so temperatures are **decreasing down the stack** (a monotonic stack): each day on it is colder than the one below.",
      "When a new day comes in warmer than the day on top of the stack, that top day's wait is over — pop it and record `currentIndex − poppedIndex` as its answer. Keep popping while the new day beats the top. Then push the new day; it now waits.",
      "Each index is pushed once and popped at most once → O(n) total, even though it looks nested. Any index never popped had no warmer future day, so it keeps its default answer of 0.",
    ],
    approaches: [
      {
        name: "Brute force — scan forward per day",
        intuition: "For each day, look ahead until a warmer day appears.",
        time: "O(n²)",
        timeWhy: "Each day may scan up to n later days; long flat/decreasing runs make it quadratic.",
        space: "O(1)",
        spaceWhy: "Only the output array (no auxiliary structure).",
        code: `int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[j] > t[i]) { ans[i] = j - i; break; }
        }
    }
    return ans;
}`,
      },
      {
        name: "Monotonic decreasing stack (optimal)",
        intuition: "Stack the indices of days awaiting a warmer day; a warmer day pops and resolves them.",
        time: "O(n)",
        timeWhy: "Each index is pushed once and popped at most once → at most 2n stack operations overall.",
        space: "O(n)",
        spaceWhy: "The stack can hold up to n indices (a strictly decreasing temperature sequence).",
        code: `int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] ans = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();   // indices, temps decreasing down the stack
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && t[i] > t[stack.peek()]) {
            int prev = stack.pop();
            ans[prev] = i - prev;                 // i is the next warmer day for prev
        }
        stack.push(i);
    }
    return ans;                                   // unpopped indices stay 0
}`,
        walkthrough: [
          "t=[73,74,75,71,69,72,76,73]. i=0 push. i=1 (74>73) pop 0→ans[0]=1; push 1.",
          "i=2 (75>74) pop 1→ans[1]=1; push 2. i=3,4 colder → push. i=5 (72>69,72>71) pop 4→ans[4]=1, pop 3→ans[3]=2; push 5.",
          "i=6 (76) pops 5,2 → ans[5]=1, ans[2]=4; push 6. i=7 (73) push. 6 and 7 never popped → ans=0. Result [1,1,4,2,1,1,0,0].",
        ],
      },
    ],
    edgeCases: [
      "Strictly decreasing temperatures → nothing is ever warmer later → all zeros, and the stack just grows.",
      "Equal temperatures don't count as 'warmer' — the strict `>` matters; using `>=` would be wrong.",
      "Single day → [0].",
    ],
    twists: [
      "**Next Greater Element I/II** (LeetCode 496/503) → same monotonic stack; II wraps around with a circular scan.",
      "**Want the warmer temperature's value, not the distance** → store the value instead of `i − prev`.",
      "**Previous warmer day** → scan right-to-left, or keep a stack of past days.",
    ],
    related: ["car-fleet", "largest-rectangle-in-histogram"],
  },

  {
    slug: "car-fleet",
    title: "Car Fleet",
    difficulty: "Medium",
    pattern: "stack",
    leetcode: 853,
    statement:
      "`n` cars head to a `target` mile marker. Car i starts at `position[i]` with `speed[i]`. A faster car catching a slower one ahead **cannot pass** — it joins that car's **fleet** and they travel together at the slower speed. Return the number of fleets that arrive at the target.",
    examples: [
      {
        in: "target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]",
        out: "3",
        note: "fleets: [10,8] meet, [0] alone catches none ahead in time, [5,3] meet",
      },
      { in: "target = 10, position = [3], speed = [3]", out: "1" },
    ],
    constraints: [
      "1 ≤ n ≤ 10⁵",
      "0 < target ≤ 10⁶",
      "0 ≤ position[i] < target, all positions unique",
      "0 < speed[i] ≤ 10⁶",
    ],
    recognize:
      "Cars that can't pass either merge into the car ahead or stay separate. Processing them **from closest-to-target backward** and asking 'does this car catch the one ahead?' is a **monotonic stack** of arrival times — each new car either joins the fleet on top or starts a new one.",
    figureItOut: [
      "The key physical insight: a car can never pass the one in front of it. So order doesn't change — the car nearest the target is always the front of its fleet. Compare cars by **how long they'd take to reach the target if unobstructed**: `time = (target − position) / speed`.",
      "Process cars sorted by position, **nearest the target first** (largest position first). The frontmost car defines a fleet with some arrival time.",
      "For the next car behind it: if its free-running time is **≤** the time of the fleet ahead, it would catch up before the target, so it gets stuck behind and joins that fleet (its real arrival time becomes the fleet's, the slower one). If its time is **greater**, it's slower and can never catch up — it forms a **new** fleet.",
      "Track the arrival time of the current lead fleet. Each car either merges (time ≤ lead) or starts a new fleet (time > lead) and becomes the new lead. The count of 'new fleet' events is the answer.",
      "This is a stack pattern: the stack holds fleet arrival times that are strictly increasing as you go backward. A car whose time doesn't exceed the top merges (no push); otherwise it pushes a new fleet. You don't even need the explicit stack — just compare against the running lead time.",
    ],
    approaches: [
      {
        name: "Sort by position, sweep from the front (optimal)",
        intuition: "Sort cars nearest-target first; a car merges if it would reach the target no later than the fleet ahead, else it starts a new fleet.",
        time: "O(n log n)",
        timeWhy: "Dominated by sorting the cars by position; the sweep that follows is a single O(n) pass.",
        space: "O(n)",
        spaceWhy: "An array of (position, time) pairs to sort (the conceptual fleet stack is at most n deep).",
        code: `int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    double[][] cars = new double[n][2];          // [position, time-to-target]
    for (int i = 0; i < n; i++) {
        cars[i][0] = position[i];
        cars[i][1] = (double)(target - position[i]) / speed[i];
    }
    Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0])); // nearest target first

    int fleets = 0;
    double leadTime = 0.0;                        // arrival time of the current front fleet
    for (double[] car : cars) {
        if (car[1] > leadTime) {                  // slower: can't catch up → new fleet
            fleets++;
            leadTime = car[1];
        }
        // else car[1] <= leadTime: catches the fleet ahead → merges, no new fleet
    }
    return fleets;
}`,
        walkthrough: [
          "target=12, sort by position desc: 10(t=1), 8(t=1), 5(t=7), 3(t=3), 0(t=12).",
          "10: t=1>0 → fleet 1, lead=1. 8: t=1 ≤ 1 → merges (catches car at 10).",
          "5: t=7>1 → fleet 2, lead=7. 3: t=3 ≤ 7 → merges. 0: t=12>7 → fleet 3. Answer 3.",
        ],
      },
    ],
    edgeCases: [
      "Use `≤` (not `<`) when merging: a car arriving at the exact same time as the fleet ahead is considered to have joined it.",
      "One car → always 1 fleet.",
      "Use floating point (or compare cross-multiplied integers) for the time ratio; integer division would lose the fractional catch-up.",
      "Positions are unique, so no two cars start at the same spot — no tie-breaking needed there.",
    ],
    twists: [
      "**Cars going in both directions / toward each other** → split by direction and handle collisions separately.",
      "**Return the fleet each car belongs to** → keep the explicit stack and tag cars with their lead index.",
      "**Car Fleet II (when does each car collide?)** (LeetCode 1776) → a monotonic stack computing pairwise catch-up times.",
    ],
    related: ["daily-temperatures", "largest-rectangle-in-histogram"],
  },

  {
    slug: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    pattern: "stack",
    leetcode: 84,
    statement:
      "Given `heights` representing the bar heights of a histogram (each bar width 1), return the **area of the largest rectangle** that fits entirely within the histogram.",
    examples: [
      { in: "heights = [2,1,5,6,2,3]", out: "10", note: "bars 5 and 6 over width 2" },
      { in: "heights = [2,4]", out: "4", note: "the bar of height 4, width 1" },
    ],
    constraints: ["1 ≤ heights.length ≤ 10⁵", "0 ≤ heights[i] ≤ 10⁴"],
    recognize:
      "For each bar, the biggest rectangle *using that bar's full height* stretches left and right until it hits a shorter bar. 'How far left/right until something smaller' is the **next-smaller-element** problem → a **monotonic stack** computes all those boundaries in one pass.",
    figureItOut: [
      "Fix one idea first: the optimal rectangle's height equals the height of some bar (the shortest bar it spans). So for each bar, ask: *if this bar is the limiting (shortest) one, how wide can the rectangle be?* The answer is `height[i] × width`, and we take the max over all bars.",
      "How wide? The rectangle of height `h = heights[i]` extends left until it meets a bar shorter than `h`, and right until it meets a bar shorter than `h`. So I need, for each bar, the **nearest shorter bar on each side**.",
      "Brute force computes those boundaries by scanning out from each bar — O(n²). The redundancy: as you move along, the 'nearest shorter to the left' relationships can be maintained incrementally. That's a monotonic stack.",
      "Keep a stack of bar indices with **increasing heights**. When a new bar is shorter than the bar on top, that top bar can't extend any further right — the new bar is its right boundary. Pop it and compute its area: its height times the width between the new bar and the bar now below it on the stack (its left boundary).",
      "Keep popping while the top is taller than the new bar, then push the new bar. Append a sentinel height of 0 at the end so every remaining bar gets flushed and measured. Each index is pushed and popped once → O(n).",
    ],
    approaches: [
      {
        name: "Brute force — expand around each bar",
        intuition: "For each bar, walk left and right while bars are at least as tall, then area = height × width.",
        time: "O(n²)",
        timeWhy: "Each bar may scan most of the array to find its left/right shorter boundaries.",
        space: "O(1)",
        spaceWhy: "Only a running max and a few indices.",
        code: `int largestRectangleArea(int[] heights) {
    int n = heights.length, best = 0;
    for (int i = 0; i < n; i++) {
        int l = i, r = i;
        while (l - 1 >= 0 && heights[l - 1] >= heights[i]) l--;
        while (r + 1 < n && heights[r + 1] >= heights[i]) r++;
        best = Math.max(best, heights[i] * (r - l + 1));
    }
    return best;
}`,
      },
      {
        name: "Monotonic increasing stack (optimal)",
        intuition: "Push bars of increasing height; when a shorter bar arrives, pop taller bars and measure each one's maximal rectangle.",
        time: "O(n)",
        timeWhy: "Each index is pushed once and popped once; the trailing sentinel flushes the rest — at most 2n stack ops.",
        space: "O(n)",
        spaceWhy: "The stack can hold up to n indices when heights are strictly increasing.",
        code: `int largestRectangleArea(int[] heights) {
    int n = heights.length, best = 0;
    Deque<Integer> stack = new ArrayDeque<>();   // indices, heights increasing down the stack
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];       // sentinel 0 flushes everything at the end
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int leftBoundary = stack.isEmpty() ? -1 : stack.peek();
            int width = i - leftBoundary - 1;    // between the new shorter bar and the prior shorter bar
            best = Math.max(best, height * width);
        }
        stack.push(i);
    }
    return best;
}`,
        walkthrough: [
          "heights=[2,1,5,6,2,3]. i=0 push. i=1 (1<2): pop 0 (h=2), left=-1, width=1 → area 2; push 1.",
          "i=2(5),i=3(6) increasing → push. i=4 (2<6): pop 3 (h=6) width=4-2-1=1→6; pop 2 (h=5) width=4-1-1=2→10; push 4.",
          "i=5(3) push. i=6 sentinel 0: pop 5(h=3) width=1→3; pop 4(h=2) width=6-1-1=4→8; pop 1(h=1) width=6→6. Max = 10.",
        ],
      },
    ],
    edgeCases: [
      "Strictly increasing heights → nothing pops until the sentinel, which then flushes and measures everything.",
      "A zero-height bar acts as a hard divider — rectangles can't cross it.",
      "The sentinel `0` at index n is what guarantees every bar still on the stack gets measured; forgetting it leaves tall trailing bars unmeasured.",
    ],
    twists: [
      "**Maximal rectangle in a 0/1 matrix** (LeetCode 85) → build a histogram per row (heights of consecutive 1s) and run this on each row.",
      "**Largest square** → a different DP, but the histogram framing also adapts.",
      "**Trapping rain water** (LeetCode 42) → related two-pointer / stack reasoning about boundaries.",
    ],
    related: ["daily-temperatures", "car-fleet"],
  },

  // ───────────────────────────── BINARY SEARCH ─────────────────────────────
  {
    slug: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 74,
    statement:
      "Given an `m × n` matrix where each row is sorted ascending and **the first integer of each row is greater than the last integer of the previous row**, return `true` if `target` is present. Must run in O(log(m·n)).",
    examples: [
      {
        in: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        out: "true",
      },
      {
        in: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
        out: "false",
      },
    ],
    constraints: ["1 ≤ m, n ≤ 100", "−10⁴ ≤ matrix[i][j], target ≤ 10⁴"],
    recognize:
      "The 'first of each row > last of the previous' rule means the whole matrix is **one sorted list, just folded into rows**. Sorted + find a value in O(log(m·n)) → **binary search**, treating the grid as a flat array of length m·n.",
    figureItOut: [
      "Read the special property carefully: rows are sorted *and* each row starts above where the previous ended. So if you read the matrix row by row, left to right, you get one fully sorted sequence of all m·n numbers. That's the unlock.",
      "If it's secretly a sorted array of length m·n, you can binary-search it in O(log(m·n)). The only puzzle is mapping a flat index back to a (row, col) cell.",
      "A flat index `mid` (0-based, from 0 to m·n−1) maps to `row = mid / n` and `col = mid % n`, where n is the number of columns. That's just division and remainder.",
      "So run a standard binary search over [0, m·n − 1]: compute `mid`, translate to (row, col), compare `matrix[row][col]` to target, and move `lo`/`hi` as usual. No need to physically flatten anything.",
      "(An alternative is a two-step search — binary-search the rows to find the right row, then binary-search within it. Same O(log(m·n)) total, but the single flat search is cleaner.)",
    ],
    approaches: [
      {
        name: "Two binary searches (find row, then column)",
        intuition: "First locate the row whose range could contain target, then binary-search that row.",
        time: "O(log m + log n)",
        timeWhy: "One binary search over m rows, then one over n columns — which equals O(log(m·n)).",
        space: "O(1)",
        spaceWhy: "Only index variables.",
        code: `boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int top = 0, bot = m - 1;
    while (top <= bot) {                          // find the candidate row
        int mid = top + (bot - top) / 2;
        if (target < matrix[mid][0]) bot = mid - 1;
        else if (target > matrix[mid][n - 1]) top = mid + 1;
        else { top = mid; break; }                // target's range is in this row
    }
    if (top > bot) return false;
    int row = top, lo = 0, hi = n - 1;
    while (lo <= hi) {                             // binary search within the row
        int mid = lo + (hi - lo) / 2;
        if (matrix[row][mid] == target) return true;
        else if (matrix[row][mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
      },
      {
        name: "Treat the grid as one flat sorted array (optimal)",
        intuition: "Binary-search indices 0..m·n−1; map each mid to (mid/n, mid%n).",
        time: "O(log(m·n))",
        timeWhy: "A single binary search over m·n virtual positions.",
        space: "O(1)",
        spaceWhy: "Just `lo`, `hi`, `mid` — nothing is flattened in memory.",
        code: `boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        int val = matrix[mid / n][mid % n];       // flat index -> (row, col)
        if (val == target) return true;
        else if (val < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}`,
        walkthrough: [
          "3x4 matrix, target=3. lo=0, hi=11. mid=5 → (1,1)=11 > 3 → hi=4.",
          "mid=2 → (0,2)=5 > 3 → hi=1. mid=0 → (0,0)=1 < 3 → lo=1.",
          "mid=1 → (0,1)=3 == 3 → return true.",
        ],
      },
    ],
    edgeCases: [
      "Target smaller than matrix[0][0] or larger than the last cell → search exits → false.",
      "Single row or single column degenerates to ordinary binary search.",
      "`mid / n` and `mid % n` use the column count n, not the row count — mixing them up is the classic bug.",
    ],
    twists: [
      "**Rows sorted but NOT globally chained** (LeetCode 240) → the flat-array trick breaks; instead start at the top-right corner and step down/left in O(m + n).",
      "**Count elements ≤ target** → binary-search for the upper bound instead of an exact match.",
      "**Return the (row, col) position** → keep `mid / n` and `mid % n` when you find it.",
    ],
    related: ["binary-search", "find-minimum-in-rotated-sorted-array"],
  },

  {
    slug: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 875,
    statement:
      "Koko has `piles` of bananas and `h` hours before the guards return. Each hour she picks a pile and eats up to `k` bananas from it (if the pile has fewer, she finishes it and stops for that hour). Return the **minimum integer `k`** so she eats all the bananas within `h` hours.",
    examples: [
      { in: "piles = [3,6,7,11], h = 8", out: "4" },
      { in: "piles = [30,11,23,4,20], h = 5", out: "30" },
      { in: "piles = [30,11,23,4,20], h = 6", out: "23" },
    ],
    constraints: ["1 ≤ piles.length ≤ 10⁴", "piles.length ≤ h ≤ 10⁹", "1 ≤ piles[i] ≤ 10⁹"],
    recognize:
      "You're asked for the **minimum value of `k` such that a condition holds** — and the condition is **monotonic**: if speed `k` works, any faster speed also works. That monotonic feasibility is the trigger for **binary search on the answer**, not on the array.",
    figureItOut: [
      "First nail the cost function: at speed `k`, a pile of size `p` takes `ceil(p / k)` hours (she can't finish a pile faster than that, and partial hours still count as a whole hour). Total time is the sum of `ceil(p/k)` over all piles.",
      "Now the monotonic insight: as `k` increases, the total hours can only **decrease or stay the same** — eating faster never takes longer. So 'does speed k finish within h hours?' is a monotonic yes/no: false for small k, true for all k from some threshold onward. We want that exact threshold — the smallest feasible k.",
      "That shape — a monotonic feasible(k) and we want the boundary where it flips false→true — is exactly **binary search on the answer**. We don't search the array; we search the *range of possible speeds*.",
      "What's the range? The slowest sensible speed is `k = 1`. The fastest she'd ever need is `k = max(piles)` — at that speed every pile takes exactly one hour, which is the minimum possible number of hours. So binary-search k in [1, max(piles)].",
      "For each candidate `mid`, compute the hours needed. If `hours ≤ h`, this speed works, but maybe a slower one also works — search left (`hi = mid`). If `hours > h`, too slow — search right (`lo = mid + 1`). Converge to the smallest feasible k.",
    ],
    approaches: [
      {
        name: "Try every speed from 1 upward (baseline)",
        intuition: "Increase k by 1 until the total hours fit within h.",
        time: "O(max(piles) · n)",
        timeWhy: "Up to max(piles) candidate speeds, each costing O(n) to total the hours — far too slow for 10⁹.",
        space: "O(1)",
        spaceWhy: "Only counters.",
        code: `// Conceptual baseline — for k = 1, 2, 3, ... return the first k whose
// total hours (sum of ceil(p/k)) is <= h. Correct but O(max(piles) * n).`,
      },
      {
        name: "Binary search on the eating speed (optimal)",
        intuition: "Feasibility is monotonic in k, so binary-search the smallest k in [1, max(piles)] that finishes in time.",
        time: "O(n · log(max(piles)))",
        timeWhy: "About log(max(piles)) binary-search steps, each an O(n) pass to total the hours.",
        space: "O(1)",
        spaceWhy: "Just the search bounds and an hours accumulator.",
        code: `int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);    // fastest speed ever needed
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (hoursNeeded(piles, mid) <= h) hi = mid;   // feasible → try slower
        else lo = mid + 1;                            // too slow → go faster
    }
    return lo;                                         // smallest feasible speed
}

long hoursNeeded(int[] piles, int k) {
    long hours = 0;
    for (int p : piles) hours += (p + k - 1) / k;      // ceil(p / k) without floats
    return hours;
}`,
        walkthrough: [
          "piles=[3,6,7,11], h=8. lo=1, hi=11. mid=6 → hours=1+1+2+2=6 ≤ 8 → hi=6.",
          "mid=3 → hours=1+2+3+4=10 > 8 → lo=4. mid=5 → hours=1+2+2+3=8 ≤ 8 → hi=5.",
          "mid=4 → hours=1+2+2+3=8 ≤ 8 → hi=4. lo==hi=4 → answer 4.",
        ],
      },
    ],
    edgeCases: [
      "`h == piles.length` → she must finish each pile in exactly one hour → answer is `max(piles)`.",
      "Compute `ceil(p/k)` as `(p + k − 1) / k` to avoid floating point; accumulate hours in a `long` since piles can be 10⁹ and there can be 10⁴ of them.",
      "Use the `lo < hi`, `hi = mid` style (lower-bound search) so you land on the smallest feasible k rather than overshooting.",
    ],
    twists: [
      "**Ship packages within D days** (LeetCode 1011) → identical pattern; search the ship capacity, feasibility checks days needed.",
      "**Minimize the largest split sum** (LeetCode 410) → binary-search the max allowed subarray sum.",
      "**Smallest divisor given a threshold** (LeetCode 1283) → same 'search the answer' with a `ceil`-sum feasibility check.",
    ],
    related: ["binary-search", "search-in-rotated-sorted-array"],
  },

  {
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 153,
    statement:
      "A sorted array of **distinct** integers has been rotated between 1 and n times. Return its **minimum element**. Must run in O(log n).",
    examples: [
      { in: "nums = [3,4,5,1,2]", out: "1", note: "original [1,2,3,4,5] rotated" },
      { in: "nums = [4,5,6,7,0,1,2]", out: "0" },
      { in: "nums = [11,13,15,17]", out: "11", note: "rotated back to sorted" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5000", "all integers are distinct", "the array is a rotation of a sorted array"],
    recognize:
      "A rotated sorted array still has a **monotonic structure you can exploit**: it's two sorted runs, and the minimum sits exactly at the 'cliff' where the second run begins. 'Find a boundary in O(log n)' → **binary search**, comparing `mid` against the right end to decide which half holds the drop.",
    figureItOut: [
      "Picture the rotated array: it climbs, then drops once, then climbs again — like [4,5,6,7,0,1,2]. The minimum is the single point right after the drop. The array is split into a left sorted run (all large) and a right sorted run (all small).",
      "O(n) is just scanning for the min, but O(log n) means we must **discard half each step**. The question: looking at the middle element, can I tell which half contains the minimum?",
      "Compare `nums[mid]` to `nums[hi]` (the rightmost element). If `nums[mid] > nums[hi]`, then `mid` is still in the high left run — the drop (and the minimum) is **to the right** of mid, so `lo = mid + 1`. (mid itself can't be the min, since something smaller is to its right.)",
      "If `nums[mid] <= nums[hi]`, then from mid to hi is properly sorted, so the minimum is at mid or to its **left** — `hi = mid`. We keep mid as a candidate, so we don't do `mid − 1`.",
      "Loop while `lo < hi`; the range shrinks until `lo == hi`, which is the minimum. Comparing against `nums[hi]` (not `nums[lo]`) is what makes this clean — the right end reliably tells you which side the cliff is on.",
    ],
    approaches: [
      {
        name: "Linear scan for the minimum (baseline)",
        intuition: "Just look at every element and keep the smallest.",
        time: "O(n)",
        timeWhy: "One pass over all elements — ignores the sorted structure, fails the O(log n) requirement.",
        space: "O(1)",
        spaceWhy: "A single running minimum.",
        code: `int findMin(int[] nums) {
    int min = nums[0];
    for (int x : nums) min = Math.min(min, x);
    return min;
}`,
      },
      {
        name: "Binary search for the rotation point (optimal)",
        intuition: "Compare mid to the right end to decide which half holds the drop; converge on the minimum.",
        time: "O(log n)",
        timeWhy: "Each step discards half the remaining range.",
        space: "O(1)",
        spaceWhy: "Just the two bounds and a midpoint.",
        code: `int findMin(int[] nums) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;   // min is strictly right of mid
        else hi = mid;                            // min is mid or to its left
    }
    return nums[lo];                              // lo == hi: the minimum
}`,
        walkthrough: [
          "nums=[4,5,6,7,0,1,2]. lo=0, hi=6. mid=3 (7) > nums[6]=2 → lo=4.",
          "mid=5 (1) < nums[6]=2 → hi=5. mid=4 (0) < nums[5]=1 → hi=4.",
          "lo==hi==4 → nums[4]=0. Answer 0.",
        ],
      },
    ],
    edgeCases: [
      "Already-sorted (rotated n times) → `nums[mid] <= nums[hi]` always → hi marches down to index 0 → returns nums[0], correct.",
      "Single element → lo==hi from the start → returns it.",
      "Compare to `nums[hi]`, not `nums[lo]`: comparing to the left end is ambiguous when the whole left half is sorted.",
      "Use `hi = mid` (not `mid − 1`) so you never skip past the actual minimum.",
    ],
    twists: [
      "**Duplicates allowed** (LeetCode 154) → when `nums[mid] == nums[hi]` you can't tell which side, so shrink with `hi--`; worst case degrades to O(n).",
      "**Also return the rotation count** → that's the index `lo` of the minimum.",
      "**Search for a target in this array** → first find the pivot, or fold it into one search (see *Search in Rotated Sorted Array*).",
    ],
    related: ["search-in-rotated-sorted-array", "binary-search"],
  },

  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 33,
    statement:
      "Given a rotated sorted array `nums` of **distinct** integers and a `target`, return the index of `target`, or `-1` if absent. Must run in O(log n).",
    examples: [
      { in: "nums = [4,5,6,7,0,1,2], target = 0", out: "4" },
      { in: "nums = [4,5,6,7,0,1,2], target = 3", out: "-1" },
      { in: "nums = [1], target = 0", out: "-1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 5000", "all values distinct", "the array is a rotation of an ascending array"],
    recognize:
      "Rotated array + find a value in O(log n). Even though the whole array isn't sorted, **at any split at least one half is fully sorted** — and within a sorted half you can decide in O(1) whether the target lives there. That 'identify the sorted half, then narrow' is the rotated-binary-search move.",
    figureItOut: [
      "The array is two sorted runs with one drop. A plain binary search breaks because `nums[mid] < target` no longer reliably means 'go right'. So we need an extra observation to keep halving.",
      "Key observation: pick any `mid`. Look at the left part [lo..mid] and right part [mid..hi]. **At least one of them is fully sorted** — the drop can only be on one side. You can detect which by comparing endpoints.",
      "If `nums[lo] <= nums[mid]`, the **left half is sorted**. Then you can check cheaply: is `target` within [nums[lo], nums[mid])? If yes, search left (`hi = mid − 1`); otherwise the answer, if any, is on the right (`lo = mid + 1`).",
      "Otherwise the **right half is sorted**. Check: is `target` within (nums[mid], nums[hi]]? If yes, search right; otherwise search left. Either way you've discarded half.",
      "So each step: find `mid`, decide which half is sorted, use that half's known range to test whether `target` falls inside it, and recurse into the correct half. Standard `nums[mid] == target` returns the index; loop exit means not found → −1.",
    ],
    approaches: [
      {
        name: "Find pivot, then binary-search the right segment",
        intuition: "Locate the minimum (rotation point), then binary-search whichever sorted segment could hold target.",
        time: "O(log n)",
        timeWhy: "One binary search to find the pivot, then one over a sorted segment — two log-n searches.",
        space: "O(1)",
        spaceWhy: "Only indices.",
        code: `int search(int[] nums, int target) {
    int n = nums.length, lo = 0, hi = n - 1;
    while (lo < hi) {                              // find pivot = index of minimum
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    int pivot = lo;
    // choose the segment whose range contains target, then plain binary search it
    lo = (target <= nums[n - 1]) ? pivot : 0;
    hi = (target <= nums[n - 1]) ? n - 1 : pivot - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}`,
      },
      {
        name: "One pass — sorted-half check (optimal)",
        intuition: "Each step, identify the sorted half and test whether target lies in its known range.",
        time: "O(log n)",
        timeWhy: "A single binary search; constant work per step to pick the half.",
        space: "O(1)",
        spaceWhy: "Just the bounds and a midpoint.",
        code: `int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {              // left half is sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {                                  // right half is sorted
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}`,
        walkthrough: [
          "nums=[4,5,6,7,0,1,2], target=0. lo=0,hi=6,mid=3(7). nums[0]=4<=7 → left sorted. Is 4<=0<7? No → lo=4.",
          "lo=4,hi=6,mid=5(1). nums[4]=0<=1 → left sorted. Is 0<=0<1? Yes → hi=4.",
          "lo=4,hi=4,mid=4(0)==target → return 4.",
        ],
      },
    ],
    edgeCases: [
      "Use `nums[lo] <= nums[mid]` (inclusive) so a two-element window like [3,1] correctly classifies the sorted half.",
      "Target not present → loop exits with lo > hi → return −1.",
      "Single element → one comparison.",
      "The range checks must use the right strictness (`<` vs `<=`) at the boundaries, or you can step into the wrong half.",
    ],
    twists: [
      "**Duplicates allowed** (LeetCode 81) → when `nums[lo] == nums[mid] == nums[hi]` you can't tell the sorted half; shrink both ends by one. Worst case O(n).",
      "**Return true/false instead of index** → same logic, just report presence.",
      "**Find the rotation count first** → reuse *Find Minimum in Rotated Sorted Array*, then a plain search.",
    ],
    related: ["find-minimum-in-rotated-sorted-array", "binary-search"],
  },

  {
    slug: "time-based-key-value-store",
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    pattern: "binary-search",
    leetcode: 981,
    statement:
      "Design a store with `set(key, value, timestamp)` and `get(key, timestamp)`. `get` returns the value that was set for `key` at the **largest timestamp ≤ the queried timestamp**; if none exists, return `\"\"`. Timestamps for each key are strictly increasing across `set` calls.",
    examples: [
      {
        in: 'set("foo","bar",1); get("foo",1); get("foo",3); set("foo","bar2",4); get("foo",4); get("foo",5)',
        out: '"bar", "bar", "bar2", "bar2"',
        note: "get picks the latest value at or before the query time",
      },
    ],
    constraints: [
      "1 ≤ key.length, value.length ≤ 100",
      "1 ≤ timestamp ≤ 10⁷",
      "At most 2·10⁵ calls to set and get combined",
    ],
    recognize:
      "Per key you store (timestamp, value) entries that arrive in **increasing timestamp order**, and each `get` asks for the **largest timestamp ≤ query** — a 'floor' lookup in a sorted list. Sorted + find-the-boundary = **binary search** (an upper-bound / floor search).",
    figureItOut: [
      "Separate the two keys (the map key and the timestamp). Group entries by the string `key`: each key owns its own timeline of (timestamp, value) pairs. So the store is a `Map<String, List<(timestamp, value)>>`.",
      "Because the problem guarantees timestamps are strictly increasing for each key, every key's list is **already sorted by timestamp** — no sorting needed, just append on `set`.",
      "Now `get(key, t)` is: in that sorted list, find the entry with the **largest timestamp that is ≤ t**. Scanning the list is O(number of sets) per get — too slow with 2·10⁵ calls. But the list is sorted, so binary-search it.",
      "This is a 'floor' / upper-bound search: find the rightmost timestamp not exceeding `t`. Standard pattern — keep a candidate index, move `lo` right when `timestamps[mid] <= t` (record mid as a possible answer and look for something larger but still ≤ t), move `hi` left when it's too big.",
      "If every stored timestamp is greater than `t` (the query predates all sets for that key), there's no valid entry → return `\"\"`. Otherwise return the value at the best index found.",
    ],
    approaches: [
      {
        name: "Linear scan of the timeline (baseline)",
        intuition: "On get, walk the key's list backward for the first timestamp ≤ query.",
        time: "O(1) set, O(m) get",
        timeWhy: "m = number of sets for that key; scanning each get is too slow at scale.",
        space: "O(total sets)",
        spaceWhy: "Every (timestamp, value) pair is stored once.",
        code: `// Conceptual baseline — store a List per key; on get, iterate from the end
// and return the first entry whose timestamp <= the query. O(m) per get.`,
      },
      {
        name: "Sorted lists + binary search the timestamp (optimal)",
        intuition: "Append in timestamp order (already sorted); on get, binary-search for the floor of the query.",
        time: "O(1) set, O(log m) get",
        timeWhy: "set just appends; get binary-searches the m-entry sorted timeline for that key.",
        space: "O(total sets)",
        spaceWhy: "One stored entry per set call across all keys.",
        code: `class TimeMap {
    private Map<String, List<int[]>> store = new HashMap<>();   // key -> [timestamp, valueId]
    private List<String> values = new ArrayList<>();            // valueId -> value string

    public void set(String key, String value, int timestamp) {
        store.computeIfAbsent(key, k -> new ArrayList<>())
             .add(new int[]{timestamp, values.size()});
        values.add(value);                                      // timestamps arrive sorted
    }

    public String get(String key, int timestamp) {
        List<int[]> list = store.get(key);
        if (list == null) return "";
        int lo = 0, hi = list.size() - 1, ansId = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (list.get(mid)[0] <= timestamp) {                // candidate; try for a later one still <= t
                ansId = list.get(mid)[1];
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return ansId == -1 ? "" : values.get(ansId);
    }
}`,
        walkthrough: [
          'set("foo","bar",1): store["foo"]=[[1,0]], values=["bar"]. get("foo",1): mid ts=1<=1 → ansId=0, lo>hi → "bar".',
          'get("foo",3): only entry ts=1<=3 → "bar". set("foo","bar2",4): store["foo"]=[[1,0],[4,1]], values=["bar","bar2"].',
          'get("foo",4): binary search finds ts=4<=4 → "bar2". get("foo",5): largest ts ≤ 5 is 4 → "bar2".',
        ],
      },
    ],
    edgeCases: [
      "Query timestamp earlier than every set for that key → no floor exists → return \"\".",
      "Key never set at all → return \"\" (guard the null list).",
      "Exact timestamp match should return that entry — the `<= timestamp` comparison (inclusive) handles it.",
      "If timestamps were NOT guaranteed increasing, you'd need to keep each list sorted (insert in order or sort on read).",
    ],
    twists: [
      "**Range query (all values in [t1, t2])** → two binary searches for the lower and upper bounds.",
      "**Most recent value strictly before t** → flip the comparison to `<` instead of `<=`.",
      "**Use a TreeMap per key** → `floorEntry(timestamp)` does the floor search for you in O(log m) without manual binary search.",
    ],
    related: ["binary-search", "search-a-2d-matrix"],
  },

  {
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    pattern: "binary-search",
    leetcode: 4,
    statement:
      "Given two sorted arrays `nums1` and `nums2` of sizes m and n, return the **median** of the combined sorted array. Must run in O(log(m + n)).",
    examples: [
      { in: "nums1 = [1,3], nums2 = [2]", out: "2.0", note: "merged [1,2,3], median 2" },
      { in: "nums1 = [1,2], nums2 = [3,4]", out: "2.5", note: "merged [1,2,3,4], median (2+3)/2" },
    ],
    constraints: ["0 ≤ m, n ≤ 1000", "1 ≤ m + n", "−10⁶ ≤ nums[i] ≤ 10⁶"],
    recognize:
      "Two sorted arrays + an O(log) requirement is the signal that you can't merge (that's O(m+n)). The median is defined by a **partition** that splits the combined array into a left half and a right half of fixed sizes — and you can **binary-search where to cut** the smaller array. This is 'binary search on a partition'.",
    figureItOut: [
      "The merge approach (combine both, take the middle) is O(m + n) — easy, but the problem demands O(log(m+n)), so we can't materialize the merge. We need to find the median without building the combined array.",
      "Reframe the median as a **partition**. Imagine cutting the combined sorted array exactly in half: the **left half** holds the smaller (m+n+1)/2 elements, the right half the rest. The median is determined entirely by the largest element on the left and the smallest on the right — we never need the full order.",
      "Now make the cut without merging. Choose a cut position `i` in nums1 (i elements go left) and the matching cut `j` in nums2 so that `i + j = (m+n+1)/2`. Once you fix i, j is forced. So there's really just **one knob: where to cut nums1** — and that's a 1-D search.",
      "A cut is **valid** when everything on the left is ≤ everything on the right. With four boundary values — `L1 = nums1[i-1]`, `R1 = nums1[i]`, `L2 = nums2[j-1]`, `R2 = nums2[j]` — validity means `L1 <= R2` and `L2 <= R1` (each array's left part fits under the other's right part).",
      "This validity is **monotonic** in i: if i is too small, `L2 > R1` (push i right); if too big, `L1 > R2` (push i left). So **binary-search i** over [0, m]. Always cut the **smaller** array to keep the search range tiny (and j in range). When the cut is valid, the median is `max(L1, L2)` for an odd total, or `(max(L1,L2) + min(R1,R2)) / 2` for an even total.",
    ],
    approaches: [
      {
        name: "Merge and take the middle (baseline)",
        intuition: "Merge the two sorted arrays, then read off the median.",
        time: "O(m + n)",
        timeWhy: "A standard merge touches every element — correct but fails the O(log) requirement.",
        space: "O(m + n)",
        spaceWhy: "Builds the merged array (can be reduced to O(1) by counting to the middle).",
        code: `// Conceptual baseline — two-pointer merge of nums1 and nums2 into one sorted
// array, then return its middle element (or average of the two middles).
// Correct but O(m + n); shown for contrast with the partition search.`,
      },
      {
        name: "Binary search the partition (optimal)",
        intuition: "Cut the smaller array at i, force j so the left half has the right size, and binary-search i until the cut is valid.",
        time: "O(log(min(m, n)))",
        timeWhy: "We binary-search the cut position over the SMALLER array; each step is O(1).",
        space: "O(1)",
        spaceWhy: "Only the cut indices and four boundary values — nothing is merged.",
        code: `double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1); // search the smaller
    int m = nums1.length, n = nums2.length;
    int total = m + n, half = (total + 1) / 2;
    int lo = 0, hi = m;
    while (lo <= hi) {
        int i = lo + (hi - lo) / 2;            // cut in nums1
        int j = half - i;                      // forced cut in nums2
        int L1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
        int R1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
        int L2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
        int R2 = (j == n) ? Integer.MAX_VALUE : nums2[j];
        if (L1 <= R2 && L2 <= R1) {            // valid partition
            if (total % 2 == 1) return Math.max(L1, L2);
            return (Math.max(L1, L2) + Math.min(R1, R2)) / 2.0;
        } else if (L1 > R2) {
            hi = i - 1;                        // cut nums1 further left
        } else {
            lo = i + 1;                        // cut nums1 further right
        }
    }
    return 0.0;                                // unreachable for valid input
}`,
        walkthrough: [
          "nums1=[1,2], nums2=[3,4]. m=2,n=2,total=4,half=2. lo=0,hi=2, i=1,j=1.",
          "L1=nums1[0]=1, R1=nums1[1]=2, L2=nums2[0]=3, R2=nums2[1]=4. Check 1<=4 and 3<=2? 3<=2 false → L2>R1 → lo=2.",
          "i=2,j=0. L1=nums1[1]=2, R1=+inf, L2=-inf, R2=nums2[0]=3. 2<=3 and -inf<=+inf → valid. Even → (max(2,-inf)+min(+inf,3))/2 = (2+3)/2 = 2.5.",
        ],
      },
    ],
    edgeCases: [
      "One array empty → the median is just the median of the other; the ±infinity sentinels make the partition logic handle it without special cases.",
      "Always recurse to search the smaller array so j = half − i never falls out of nums2's bounds.",
      "Sentinels `Integer.MIN_VALUE` / `MAX_VALUE` stand in for 'nothing past the edge', so cuts at i=0 or i=m need no separate branch.",
      "Odd vs even total: odd → `max(L1, L2)`; even → average of `max(L1,L2)` and `min(R1,R2)`.",
    ],
    twists: [
      "**Kth smallest of two sorted arrays** → the same partition idea generalizes (or a log-time 'discard k/2' recursion).",
      "**Median of a data stream** (LeetCode 295) → totally different tool: two heaps, not binary search.",
      "**More than two sorted arrays** → the clean partition trick no longer applies; merge with a heap instead.",
    ],
    related: ["binary-search", "find-minimum-in-rotated-sorted-array"],
  },
];
