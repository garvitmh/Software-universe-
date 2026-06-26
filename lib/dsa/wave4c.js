// NeetCode 150 — wave 4c (math & geometry, bit manipulation). Java.
export const WAVE4C = [
  // ───────────────────────────── MATH & GEOMETRY ─────────────────────────────
  {
    slug: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 48,
    statement:
      "You are given an `n × n` 2-D matrix representing an image. Rotate it **90° clockwise, in place** — you must modify the input matrix directly and may not allocate another 2-D matrix.",
    examples: [
      { in: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", out: "[[7,4,1],[8,5,2],[9,6,3]]" },
      { in: "matrix = [[1,2],[3,4]]", out: "[[3,1],[4,2]]" },
    ],
    constraints: ["n == matrix.length == matrix[0].length", "1 ≤ n ≤ 20", "−1000 ≤ matrix[i][j] ≤ 1000"],
    recognize:
      "A square matrix that must be **rotated in place** (O(1) extra space). The trick isn't an algorithm to discover — it's a **geometric identity**: a rotation can be decomposed into a transpose plus a reflection.",
    figureItOut: [
      "First write down where each element *goes*. Under a 90° clockwise turn, the value at `(row, col)` lands at `(col, n−1−row)`. The top row becomes the right column, the left column becomes the top row. If you had a spare matrix you'd just copy by that formula — but that's O(n²) extra space, which is banned.",
      "To do it in place, look for a rotation built from two simpler in-place moves. Try **transpose** (mirror across the main diagonal: swap `(i,j)` with `(j,i)`). After transposing `[[1,2,3],[4,5,6],[7,8,9]]` you get `[[1,4,7],[2,5,8],[3,6,9]]`. Compare to the target `[[7,4,1],[8,5,2],[9,6,3]]`: each **row is reversed**. ",
      "So the recipe is: **transpose, then reverse each row**. Transpose only touches pairs `(i,j)`/`(j,i)`, and reversing a row is two-pointer swaps — both are in place.",
      "Why does that compose to a rotation? Transpose maps `(i,j)→(j,i)`; reversing row `j` then maps column `i` to `n−1−i`, giving `(j, n−1−i)` — exactly the clockwise destination. Two reflections (across the diagonal, then across the vertical axis) make one rotation.",
      "Mind the **diagonal** when transposing: only swap the upper triangle (`j` from `i+1`), or you'll swap every pair twice and undo it.",
    ],
    approaches: [
      {
        name: "Copy into a fresh matrix (baseline, not allowed)",
        intuition: "Place each element at its rotated destination in a new matrix — clear, but uses O(n²) extra space.",
        time: "O(n²)",
        timeWhy: "Every cell is read and written once.",
        space: "O(n²)",
        spaceWhy: "A whole second matrix — which the problem forbids.",
        code: `int[][] rotateCopy(int[][] m) {
    int n = m.length;
    int[][] out = new int[n][n];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            out[j][n - 1 - i] = m[i][j];   // (i,j) goes to (j, n-1-i)
    return out;
}`,
      },
      {
        name: "Transpose, then reverse each row (optimal, in place)",
        intuition: "Mirror across the main diagonal, then mirror each row left-to-right. Two reflections = one rotation.",
        time: "O(n²)",
        timeWhy: "The transpose touches each upper-triangle pair once, and reversing all rows touches each cell once → both are proportional to the n² cells.",
        space: "O(1)",
        spaceWhy: "Everything is done with in-place swaps; no second matrix.",
        code: `void rotate(int[][] matrix) {
    int n = matrix.length;
    // 1) transpose: swap across the main diagonal (upper triangle only)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int tmp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = tmp;
        }
    }
    // 2) reverse each row
    for (int i = 0; i < n; i++) {
        int l = 0, r = n - 1;
        while (l < r) {
            int tmp = matrix[i][l];
            matrix[i][l] = matrix[i][r];
            matrix[i][r] = tmp;
            l++; r--;
        }
    }
}`,
        walkthrough: [
          "[[1,2,3],[4,5,6],[7,8,9]] transpose → [[1,4,7],[2,5,8],[3,6,9]].",
          "Reverse each row → [[7,4,1],[8,5,2],[9,6,3]] — the 90° clockwise result.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → a single cell; transpose and reverse are both no-ops.",
      "Transposing the whole matrix (not just the upper triangle) swaps every pair twice and leaves it unchanged — the `j = i + 1` start is essential.",
      "Even vs odd n both work; the diagonal cells stay fixed under transpose, as they should.",
    ],
    twists: [
      "**Rotate 90° counter-clockwise** → transpose, then reverse each **column** (or reverse rows first, then transpose).",
      "**Rotate 180°** → reverse every row and reverse the order of the rows (two reflections through the center).",
      "**Layer-by-layer 4-way swap** → rotate the four corresponding cells of each concentric ring in one shot; same O(1) space, no transpose.",
    ],
    related: ["spiral-matrix", "set-matrix-zeroes"],
  },

  {
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 54,
    statement:
      "Given an `m × n` matrix, return **all its elements in spiral order** — start at the top-left, go right across the top row, down the right column, left along the bottom, up the left column, and inward.",
    examples: [
      { in: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", out: "[1,2,3,6,9,8,7,4,5]" },
      { in: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", out: "[1,2,3,4,8,12,11,10,9,5,6,7]" },
    ],
    constraints: ["m == matrix.length", "n == matrix[0].length", "1 ≤ m, n ≤ 10", "−100 ≤ matrix[i][j] ≤ 100"],
    recognize:
      "A **traversal-order** problem on a grid — no real computation, just visiting cells in a prescribed path. The clean way is to **track the four shrinking boundaries** (top, bottom, left, right) and peel the matrix like an onion.",
    figureItOut: [
      "The spiral is four repeating moves: across the **top** row left→right, down the **right** column, across the **bottom** row right→left, up the **left** column. Then the outer ring is done and you repeat on the smaller inner rectangle.",
      "Model the 'current rectangle' with four bounds: `top`, `bottom`, `left`, `right`. Walking the top row uses row `top` from `left` to `right`; after it, that row is consumed, so do `top++`. Symmetrically the other three sides shrink their bound.",
      "Loop while `top ≤ bottom` and `left ≤ right`. Each of the four passes peels off one side and tightens one bound, so the rectangle strictly shrinks — the loop must terminate.",
      "The subtle bug is a **single leftover row or column**. After doing the top row and right column, you might re-walk the same line going back. Guard the bottom pass with `if (top ≤ bottom)` and the left pass with `if (left ≤ right)` *after* incrementing, so a 1×k or k×1 remainder isn't double-counted.",
    ],
    approaches: [
      {
        name: "Four shrinking boundaries (optimal)",
        intuition: "Peel the outer ring with four directed passes, then tighten the bounds and repeat on the inner rectangle.",
        time: "O(m·n)",
        timeWhy: "Every cell is appended to the output exactly once.",
        space: "O(1)",
        spaceWhy: "Only the four bound variables (the output list isn't counted as working space).",
        code: `List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) res.add(matrix[top][c]);   // top row →
        top++;
        for (int r = top; r <= bottom; r++) res.add(matrix[r][right]); // right col ↓
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) res.add(matrix[bottom][c]); // bottom row ←
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) res.add(matrix[r][left]);   // left col ↑
            left++;
        }
    }
    return res;
}`,
        walkthrough: [
          "3×3: top row → 1,2,3 (top=1). right col → 6,9 (right=1).",
          "bottom row (top≤bottom) → 8,7 (bottom=1). left col (left≤right) → 4 (left=1).",
          "Now top=1,bottom=1,left=1,right=1: top row → 5. Bounds cross → stop. Output [1,2,3,6,9,8,7,4,5].",
        ],
      },
    ],
    edgeCases: [
      "Single row `[[1,2,3]]` → just the top pass; the bottom/left guards prevent re-walking it.",
      "Single column `[[1],[2],[3]]` → top cell then right column; guards stop a double-walk.",
      "1×1 → the lone element, then bounds cross immediately.",
    ],
    twists: [
      "**Spiral Matrix II** (LeetCode 59) → *fill* an n×n matrix with 1..n² in spiral order — same boundary walk, write instead of read.",
      "**Spiral starting from the center, outward** → reverse the direction order and grow the bounds.",
      "**Diagonal traversal** (LeetCode 498) → different path rule; walk along anti-diagonals flipping direction.",
    ],
    related: ["rotate-image", "set-matrix-zeroes"],
  },

  {
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 73,
    statement:
      "Given an `m × n` matrix, if an element is `0`, set its **entire row and column** to `0`. Do it **in place** — ideally with O(1) extra space.",
    examples: [
      { in: "matrix = [[1,1,1],[1,0,1],[1,1,1]]", out: "[[1,0,1],[0,0,0],[1,0,1]]" },
      { in: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", out: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]" },
    ],
    constraints: ["m == matrix.length", "n == matrix[0].length", "1 ≤ m, n ≤ 200", "−2³¹ ≤ matrix[i][j] ≤ 2³¹ − 1"],
    recognize:
      "An **in-place grid mutation** where the trap is order: zeroing as you scan corrupts cells you haven't read yet. The insight is that you only need to remember **which rows and which columns** must be zeroed — and you can store those flags *inside the matrix itself*.",
    figureItOut: [
      "The naive bug: if you zero a row the moment you see a 0, those new zeros are indistinguishable from original zeros, so the rest of the scan zeroes everything. You must **first find all zeros, then apply**.",
      "So you need two sets: 'rows to zero' and 'columns to zero'. With O(m+n) extra space, two boolean arrays solve it — scan once to fill the sets, scan again to zero any cell whose row or column is flagged.",
      "To reach O(1) space, notice you already have spare storage: the matrix's **own first row and first column** can act as the flag arrays. `matrix[i][0]` marks 'row i needs zeroing', `matrix[0][j]` marks 'column j needs zeroing'.",
      "But the first row and first column overlap at `matrix[0][0]`, which can't mean two things. So use one **separate** boolean for the first column (`firstColZero`) and let `matrix[0][0]` stand only for the first row. Track the first row/column's own fate before you overwrite their cells.",
      "The order that makes it correct: (1) record whether row 0 and col 0 originally contain a zero; (2) for the inner cells, push each zero's flag onto the border markers; (3) zero the inner cells based on the markers; (4) finally zero row 0 / col 0 if their saved flags say so. Do the borders **last** so their markers survive step 3.",
    ],
    approaches: [
      {
        name: "Two marker arrays (clear, O(m+n) space)",
        intuition: "Record which rows and columns contain a zero, then blank them in a second pass.",
        time: "O(m·n)",
        timeWhy: "Two full passes over the grid.",
        space: "O(m + n)",
        spaceWhy: "One boolean per row and per column.",
        code: `void setZeroesSimple(int[][] m) {
    int R = m.length, C = m[0].length;
    boolean[] row = new boolean[R], col = new boolean[C];
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (m[i][j] == 0) { row[i] = true; col[j] = true; }
    for (int i = 0; i < R; i++)
        for (int j = 0; j < C; j++)
            if (row[i] || col[j]) m[i][j] = 0;
}`,
      },
      {
        name: "First row/column as markers (optimal, O(1) space)",
        intuition: "Use the matrix's own border to store the zero flags; one extra boolean disambiguates the shared corner.",
        time: "O(m·n)",
        timeWhy: "A constant number of passes over the grid.",
        space: "O(1)",
        spaceWhy: "Only `firstColZero` plus reused border cells — no arrays that grow with input.",
        code: `void setZeroes(int[][] matrix) {
    int R = matrix.length, C = matrix[0].length;
    boolean firstColZero = false;

    for (int i = 0; i < R; i++) {
        if (matrix[i][0] == 0) firstColZero = true;       // col 0's own fate
        for (int j = 1; j < C; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;   // mark row i
                matrix[0][j] = 0;   // mark col j
            }
        }
    }
    // apply markers to the inner cells (skip the border for now)
    for (int i = 1; i < R; i++) {
        for (int j = 1; j < C; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
        }
    }
    // handle the first row using its corner marker
    if (matrix[0][0] == 0) {
        for (int j = 0; j < C; j++) matrix[0][j] = 0;
    }
    // handle the first column using the saved boolean
    if (firstColZero) {
        for (int i = 0; i < R; i++) matrix[i][0] = 0;
    }
}`,
        walkthrough: [
          "[[1,1,1],[1,0,1],[1,1,1]]: the inner 0 at (1,1) sets matrix[1][0]=0 (row 1) and matrix[0][1]=0 (col 1).",
          "Apply to inner cells: row 1 flagged → (1,1),(1,2) zeroed; col 1 flagged → (2,1) zeroed.",
          "matrix[0][0] stayed 1 → first row untouched; firstColZero false → first column untouched. Result [[1,0,1],[0,0,0],[1,0,1]].",
        ],
      },
    ],
    edgeCases: [
      "A zero in the first row or first column — handled by `matrix[0][0]` and `firstColZero`, which is exactly why they're tracked separately.",
      "All zeros → whole matrix becomes zero (it already is).",
      "No zeros → markers stay clear → nothing changes.",
    ],
    twists: [
      "**Use a sentinel value instead of order tricks** → only works if some value can't appear in the matrix; the border-marker method needs no such assumption.",
      "**Set row/column to a given value v (not 0)** → identical, but markers must use a flag distinct from v, so fall back to the boolean-arrays version or a separate marker structure.",
      "**Count how many cells become zero** → after marking, sum flagged rows and columns with inclusion-exclusion instead of mutating.",
    ],
    related: ["rotate-image", "spiral-matrix"],
  },

  {
    slug: "happy-number",
    title: "Happy Number",
    difficulty: "Easy",
    pattern: "math-geometry",
    leetcode: 202,
    statement:
      "A number is **happy** if repeatedly replacing it with the sum of the squares of its digits eventually reaches `1`. If the process loops endlessly without reaching 1, the number is not happy. Return `true` if `n` is happy.",
    examples: [
      { in: "n = 19", out: "true", note: "1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²+0²+0²=1" },
      { in: "n = 2", out: "false", note: "falls into a cycle that never hits 1" },
    ],
    constraints: ["1 ≤ n ≤ 2³¹ − 1"],
    recognize:
      "Repeatedly applying a function (digit-square-sum) produces a **sequence** that either reaches 1 or **cycles**. 'Detect whether iteration falls into a cycle' is exactly the **fast/slow pointer** (Floyd) idea — the same one used for linked-list cycles.",
    figureItOut: [
      "Define one step: `f(n)` = sum of the squares of n's digits. Happy means iterating `f` reaches 1. The danger is non-happy numbers, where `f` iterates forever — you need to know it's looping rather than slowly approaching 1.",
      "Why must it either reach 1 or cycle (never run off to infinity)? For any number with d digits, `f(n) ≤ 81·d`, which is far smaller than n once n is large — so the sequence is bounded. A bounded infinite sequence over integers must eventually **repeat a value**, i.e. enter a cycle.",
      "First solution: remember every value seen in a **hash set**. If you ever revisit a value, you're in a cycle → not happy. If you hit 1, happy. This is O(1)-ish in value-space but uses a set.",
      "To drop the set, treat the iteration as a linked list where `next(x) = f(x)` and use **Floyd's tortoise and hare**: advance `slow` by one step and `fast` by two. If there's a cycle they meet; if `fast` reaches 1, it's happy. O(1) extra space.",
    ],
    approaches: [
      {
        name: "Hash set of seen values",
        intuition: "Iterate f; if a value repeats you're cycling, if you hit 1 you're happy.",
        time: "O(log n)",
        timeWhy: "The value collapses quickly to a small bounded range (≤ 243 for the next step after the first), so only a handful of iterations occur; each digit-sum is O(log n) in n's digits.",
        space: "O(log n)",
        spaceWhy: "The set stores the (few, bounded) values visited.",
        code: `boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1 && !seen.contains(n)) {
        seen.add(n);
        n = next(n);
    }
    return n == 1;
}

int next(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}`,
      },
      {
        name: "Floyd's cycle detection (optimal space)",
        intuition: "Slow takes one step, fast takes two; they meet inside a cycle, or fast reaches 1.",
        time: "O(log n)",
        timeWhy: "Same bounded number of steps as the set version; constant factor higher.",
        space: "O(1)",
        spaceWhy: "Two integers — no set.",
        code: `boolean isHappy(int n) {
    int slow = n, fast = next(n);
    while (fast != 1 && slow != fast) {
        slow = next(slow);
        fast = next(next(fast));
    }
    return fast == 1;
}

int next(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}`,
        walkthrough: [
          "n=19: slow=19, fast=f(19)=82.",
          "step: slow=82, fast=f(f(82))=f(68)=100; step: slow=f(82)=68, fast=f(f(100))=f(1)=1.",
          "fast==1 → loop ends → return true.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → already happy → true.",
      "n = 7 → 49 → 97 → 130 → 10 → 1 → happy (a less obvious true).",
      "Numbers like 2, 3, 4 fall into the cycle 4→16→37→58→89→145→42→20→4 → not happy.",
    ],
    twists: [
      "**Sum of cubes / kth powers instead of squares** → same framework, swap the `next` function; cycle-detection logic is unchanged.",
      "**Return the loop length for unhappy numbers** → keep going after the meet point and count steps to return.",
      "**Count happy numbers in [1, N]** → memoize results so shared tails aren't recomputed.",
    ],
    related: ["plus-one", "linked-list-cycle"],
  },

  {
    slug: "plus-one",
    title: "Plus One",
    difficulty: "Easy",
    pattern: "math-geometry",
    leetcode: 66,
    statement:
      "Given a non-empty array `digits` representing a non-negative integer (most-significant digit first, no leading zeros), add **one** to the number and return the resulting digit array.",
    examples: [
      { in: "digits = [1,2,3]", out: "[1,2,4]", note: "123 + 1 = 124" },
      { in: "digits = [9,9,9]", out: "[1,0,0,0]", note: "carry ripples all the way" },
    ],
    constraints: ["1 ≤ digits.length ≤ 100", "0 ≤ digits[i] ≤ 9", "no leading zeros (except the number 0 itself)"],
    recognize:
      "**Grade-school addition** on a digit array. The only real subtlety is the **carry**, which can ripple and even grow the array by one digit (all nines). No data structure — just digit math from the least-significant end.",
    figureItOut: [
      "You can't convert to an integer — the array can be 100 digits long, far beyond `long`. So do the addition **digit by digit**, exactly like by hand, starting at the **rightmost** digit.",
      "Adding one only matters at the last digit. If that digit is less than 9, increment it and you're done — return immediately. No carry, no further work.",
      "If the last digit is 9, it becomes 0 and a **carry of 1** moves left. Keep walking left: every 9 turns to 0 and passes the carry on; the first digit below 9 absorbs the +1 and you stop.",
      "The only case where you fall off the left end is **all nines** (`[9,9,9] → [0,0,0]` with a carry out). Then the number grew a digit: prepend a leading 1, giving `[1,0,0,0]`. A fresh array of length n+1 with a 1 in front (and zeros elsewhere) handles this cleanly.",
    ],
    approaches: [
      {
        name: "Walk from the right, handle carry (optimal)",
        intuition: "Increment the last digit; on a 9 set it to 0 and carry left; if every digit was 9, prepend a 1.",
        time: "O(n)",
        timeWhy: "At most one pass right-to-left over the digits.",
        space: "O(1)",
        spaceWhy: "In place; the only allocation is the n+1 array in the rare all-nines case.",
        code: `int[] plusOne(int[] digits) {
    for (int i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            digits[i]++;        // no carry — done
            return digits;
        }
        digits[i] = 0;          // 9 + 1 = 10 → 0, carry the 1 left
    }
    // fell off the left end: all nines → grow by one digit
    int[] res = new int[digits.length + 1];
    res[0] = 1;                 // rest default to 0
    return res;
}`,
        walkthrough: [
          "[1,2,3]: i=2, digit 3<9 → becomes 4 → return [1,2,4].",
          "[9,9,9]: i=2→0, i=1→0, i=0→0, loop ends → new array [1,0,0,0].",
        ],
      },
    ],
    edgeCases: [
      "`[0]` → `[1]` (adding one to zero).",
      "`[9]` → `[1,0]` (single digit overflowing).",
      "Very long arrays (100 digits) where converting to a number would overflow — array math sidesteps it entirely.",
    ],
    twists: [
      "**Add an arbitrary k, not just 1** → keep a running carry initialized from k and propagate while carry > 0.",
      "**Add two digit arrays** → standard schoolbook addition, align at the right ends with a carry.",
      "**Digits stored least-significant-first** → walk left-to-right instead; the carry logic is identical.",
    ],
    related: ["happy-number", "multiply-strings"],
  },

  {
    slug: "pow-x-n",
    title: "Pow(x, n)",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 50,
    statement:
      "Implement `pow(x, n)`, which computes `x` raised to the power `n` (n can be negative).",
    examples: [
      { in: "x = 2.0, n = 10", out: "1024.0" },
      { in: "x = 2.0, n = -2", out: "0.25", note: "2^-2 = 1 / 2² = 0.25" },
      { in: "x = 2.1, n = 3", out: "9.261000" },
    ],
    constraints: ["−100.0 < x < 100.0", "−2³¹ ≤ n ≤ 2³¹ − 1", "either x ≠ 0 or n > 0", "result fits in a double"],
    recognize:
      "Computing a power where the naive `n` multiplications is O(n) and `n` can be ~2 billion. The signal is **exponentiation by squaring** — exploit `x^n = (x^2)^(n/2)` to halve the exponent each step → O(log n).",
    figureItOut: [
      "Naive: multiply x by itself n times → O(n). With n up to 2³¹ that's two billion multiplications — too slow. We need to grow the exponent we cover much faster.",
      "Key identity: `x^n = (x·x)^(n/2)` when n is even. Squaring the base lets one multiplication double the exponent's reach. When n is odd, peel off one factor: `x^n = x · (x²)^((n−1)/2)`.",
      "So at each step: if the current exponent's lowest bit is 1, fold the current base into the answer; then square the base and shift the exponent right by one. This is binary exponentiation — you visit each bit of n once → O(log n).",
      "Handle the **negative exponent**: `x^(−n) = 1 / x^n`. Compute the positive power then invert. Careful with `n = −2³¹`: negating it overflows `int`, so widen to `long` before taking the absolute value.",
    ],
    approaches: [
      {
        name: "Naive repeated multiplication (baseline)",
        intuition: "Multiply x into the result |n| times — correct but linear.",
        time: "O(n)",
        timeWhy: "One multiplication per unit of the exponent.",
        space: "O(1)",
        spaceWhy: "A single running product.",
        code: `double myPowSlow(double x, int n) {
    long N = n;
    if (N < 0) { x = 1 / x; N = -N; }
    double res = 1.0;
    for (long i = 0; i < N; i++) res *= x;   // too slow for huge N
    return res;
}`,
      },
      {
        name: "Binary exponentiation / fast power (optimal)",
        intuition: "Square the base and halve the exponent; multiply into the answer whenever the current bit is set.",
        time: "O(log n)",
        timeWhy: "Each iteration shifts the exponent right by one bit, so about log₂|n| iterations.",
        space: "O(1)",
        spaceWhy: "Iterative — a couple of scalars (the recursive form would use O(log n) stack).",
        code: `double myPow(double x, int n) {
    long N = n;               // widen so -2^31 negates safely
    if (N < 0) { x = 1 / x; N = -N; }
    double res = 1.0;
    while (N > 0) {
        if ((N & 1) == 1) res *= x;   // current bit set → fold in this power of x
        x *= x;                       // square the base
        N >>= 1;                      // move to the next bit
    }
    return res;
}`,
        walkthrough: [
          "x=2, n=10 (binary 1010). N=10: bit0=0 skip, x=4, N=5.",
          "N=5 bit0=1 → res=4; x=16, N=2. N=2 bit0=0; x=256, N=1.",
          "N=1 bit0=1 → res=4·256=1024; x squared, N=0 → stop → 1024.",
        ],
      },
    ],
    edgeCases: [
      "n = 0 → result 1 for any x (including x = 0 by the problem's convention that n > 0 when x = 0).",
      "n = −2³¹ → widening to `long` before negating avoids the int-overflow trap.",
      "Negative x with odd vs even n → the sign follows naturally from the multiplications.",
    ],
    twists: [
      "**Modular exponentiation** (`x^n mod m`, LeetCode 372) → same squaring loop, take `mod m` after every multiply.",
      "**Matrix power** (e.g. fast Fibonacci) → replace scalar multiply with matrix multiply; the log-n structure is identical.",
      "**Recursive divide-and-conquer form** → `half = pow(x, n/2); return n even ? half·half : half·half·x` — same complexity, O(log n) stack.",
    ],
    related: ["multiply-strings", "sum-of-two-integers"],
  },

  {
    slug: "multiply-strings",
    title: "Multiply Strings",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 43,
    statement:
      "Given two non-negative integers `num1` and `num2` represented as **strings**, return their product, also as a string. You must not use any built-in big-integer library or convert the inputs directly to an integer type.",
    examples: [
      { in: 'num1 = "2", num2 = "3"', out: '"6"' },
      { in: 'num1 = "123", num2 = "456"', out: '"56088"' },
    ],
    constraints: ["1 ≤ num1.length, num2.length ≤ 200", "both contain only digits", "no leading zeros except '0' itself"],
    recognize:
      "The numbers are up to 200 digits — far past `long`. This forces **schoolbook (grade-school) multiplication** done digit by digit. The elegant trick is knowing exactly **which output position** each digit-pair product lands in.",
    figureItOut: [
      "You can't parse to a number (200 digits overflows everything). So multiply the way you learned on paper: each digit of one number times each digit of the other, placed at the right column, with carries.",
      "The placement insight: if `num1[i]` and `num2[j]` are at positions i and j from the **left**, their product contributes to output positions `i + j` (the carry/high digit) and `i + j + 1` (the low digit). Work that out on `123 × 456` and it lines up — this index rule is the whole problem.",
      "Allocate a result array of length `m + n` (the product of an m-digit and n-digit number has at most m + n digits). Accumulate every `num1[i] * num2[j]` into `res[i + j + 1]`, then sweep once to push carries leftward.",
      "Finally turn the array into a string: skip any **leading zeros** (e.g. the top cell may be 0), and remember the special case where the entire product is 0 → return \"0\" rather than an empty string.",
    ],
    approaches: [
      {
        name: "Schoolbook multiplication with position indexing (optimal)",
        intuition: "Each digit pair (i, j) contributes to result slots i+j and i+j+1; accumulate, then carry and stringify.",
        time: "O(m·n)",
        timeWhy: "Every pair of digits from the two numbers is multiplied once.",
        space: "O(m + n)",
        spaceWhy: "The result buffer holds at most m + n digits.",
        code: `String multiply(String num1, String num2) {
    if (num1.equals("0") || num2.equals("0")) return "0";
    int m = num1.length(), n = num2.length();
    int[] res = new int[m + n];

    for (int i = m - 1; i >= 0; i--) {
        int d1 = num1.charAt(i) - '0';
        for (int j = n - 1; j >= 0; j--) {
            int d2 = num2.charAt(j) - '0';
            int sum = d1 * d2 + res[i + j + 1];   // add into the low slot
            res[i + j + 1] = sum % 10;            // keep this digit
            res[i + j] += sum / 10;               // carry into the high slot
        }
    }

    StringBuilder sb = new StringBuilder();
    for (int d : res) {
        if (!(sb.length() == 0 && d == 0)) sb.append(d);   // skip leading zeros
    }
    return sb.length() == 0 ? "0" : sb.toString();
}`,
        walkthrough: [
          '"123" × "456": e.g. i=2 (3) × j=2 (6) = 18 → res[5]=8, res[4]+=1.',
          "Every digit pair accumulates into res[i+j+1] with carry to res[i+j].",
          "After carrying, res = [0,5,6,0,8,8] → strip leading 0 → \"56088\".",
        ],
      },
    ],
    edgeCases: [
      "Either input is \"0\" → product is \"0\" (the early guard avoids a string of leading zeros).",
      "The high slot `res[0]` may stay 0 (when the product has m+n−1 digits) — the leading-zero skip handles it.",
      "Maximum-length 200-digit inputs — array math never overflows since each slot stays a single digit after carrying.",
    ],
    twists: [
      "**Add two number-strings** → same digit alignment with a single carry, O(m + n).",
      "**Different base (e.g. binary or hex strings)** → replace 10 with the base in the `% base` / `/ base` carry math.",
      "**Karatsuba multiplication** → for very large inputs, split each number and recombine with 3 (not 4) sub-multiplications → ~O(n^1.585).",
    ],
    related: ["plus-one", "pow-x-n"],
  },

  {
    slug: "detect-squares",
    title: "Detect Squares",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 2013,
    statement:
      "Design a data structure that accepts a stream of points and counts **axis-aligned squares**. Implement `add(point)` to record a point (duplicates allowed) and `count(point)` to return how many ways you can pick three already-added points that, with the query point, form a square with sides parallel to the axes.",
    examples: [
      {
        in: "add([3,10]), add([11,2]), add([3,2]); count([11,10])",
        out: "1",
        note: "the four corners (3,10),(11,2),(3,2),(11,10) form one axis-aligned square",
      },
      { in: "count([14,8])", out: "0", note: "no matching corners recorded" },
    ],
    constraints: ["points have 0 ≤ x, y ≤ 1000", "at most 5000 add/count calls", "a point may be added multiple times"],
    recognize:
      "A **streaming geometry counter**. For an axis-aligned square the query point and a chosen **diagonal** point fix everything: the side length and the other two corners are determined. So fix one diagonal partner and **multiply the counts** of the two remaining corners — a hash-map counting problem.",
    figureItOut: [
      "An axis-aligned square is rigid: pick the query corner `(qx, qy)` and a diagonal corner `(px, py)`. For them to be diagonal, the square must be a true square, so `|px − qx| == |py − qy|` and they must differ in both coordinates (`px ≠ qx`).",
      "Once the diagonal is fixed, the **other two corners are forced**: `(px, qy)` and `(qx, py)`. There is no freedom left — the side length equals `|px − qx|`.",
      "So `count(query)` = for every recorded point `p` that could be the diagonal partner, multiply the number of times `(px, qy)` was added by the number of times `(qx, py)` was added. Each combination of duplicates is a distinct square, so it's a product of frequencies.",
      "To find candidate diagonals quickly, store points grouped by x-coordinate, *and* keep a frequency map of exact points. On `count`, iterate the points sharing the query's column (same `qx`)? No — iterate points sharing the query's **x is the same** gives vertical neighbours; instead iterate candidates with the same y as the query is also fine. The clean version: for each added point `p`, treat it as the corner directly **above/below or beside** — most implementations iterate points in the same column as the query and derive the diagonal. A simple, correct choice: iterate all distinct points; for each with `px != qx` and `|px−qx| == |py−qy|`, add `freq(px,qy) * freq(qx,py)`.",
      "Use a `Map<Long, Integer>` keyed by an encoded `(x,y)` for O(1) frequency lookups, and a `Map<Integer, List<int[]>>` from x-column to its points so you only scan plausible diagonals, keeping `count` near O(number of points in that column).",
    ],
    approaches: [
      {
        name: "Frequency map + column index (optimal for the constraints)",
        intuition: "Index points by column; for a query, scan its column for diagonal partners and multiply the two remaining corners' counts.",
        time: "O(1) add, O(k) count",
        timeWhy: "`add` is a couple of map updates; `count` scans the k points sharing the query's column and does O(1) lookups for each.",
        space: "O(n)",
        spaceWhy: "Stores every added point in the frequency map and column index.",
        code: `class DetectSquares {
    private Map<Long, Integer> freq = new HashMap<>();        // encoded point -> count
    private Map<Integer, List<int[]>> byCol = new HashMap<>(); // x -> list of points

    private long key(int x, int y) { return (long) x * 2000 + y; }

    public void add(int[] point) {
        int x = point[0], y = point[1];
        freq.merge(key(x, y), 1, Integer::sum);
        byCol.computeIfAbsent(x, k -> new ArrayList<>()).add(point);
    }

    public int count(int[] point) {
        int qx = point[0], qy = point[1];
        int total = 0;
        List<int[]> col = byCol.getOrDefault(qx, Collections.emptyList());
        for (int[] p : col) {
            int py = p[1];
            if (py == qy) continue;                 // need a different row → real diagonal
            int side = Math.abs(py - qy);
            // the two far corners sit 'side' away horizontally, on both sides
            total += freq.getOrDefault(key(qx + side, qy), 0)
                   * freq.getOrDefault(key(qx + side, py), 0);
            total += freq.getOrDefault(key(qx - side, qy), 0)
                   * freq.getOrDefault(key(qx - side, py), 0);
        }
        return total;
    }
}`,
        walkthrough: [
          "add (3,10),(11,2),(3,2). count (11,10): scan column x=11 → point (11,2), side=|2−10|=8.",
          "Right side x=19: freq(19,10)·freq(19,2)=0. Left side x=3: freq(3,10)=1, freq(3,2)=1 → 1·1=1.",
          "total = 1 → one square.",
        ],
      },
    ],
    edgeCases: [
      "Degenerate 'square' of side 0 — skipped by the `py == qy` guard (the diagonal point must differ in y).",
      "Duplicate points — counts multiply, so repeated corners create multiple squares, exactly as required.",
      "Query point itself need not have been added; only the other three corners must exist.",
    ],
    twists: [
      "**Count rectangles, not just squares** → drop the equal-side constraint; pick any diagonal corner and multiply the two remaining corners' counts.",
      "**Tilted (non-axis-aligned) squares** → use vector rotation: from one edge vector, rotate 90° to find the other two corners.",
      "**Support removal** (`remove(point)`) → decrement the frequency map and lazily skip zero-count entries.",
    ],
    related: ["spiral-matrix", "happy-number"],
  },

  // ───────────────────────────── BIT MANIPULATION ─────────────────────────────
  {
    slug: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 136,
    statement:
      "Given a non-empty array `nums` in which **every element appears twice except for one**, find that single element. You must do it with O(1) extra space and linear time.",
    examples: [
      { in: "nums = [2,2,1]", out: "1" },
      { in: "nums = [4,1,2,1,2]", out: "4" },
    ],
    constraints: ["1 ≤ nums.length < 3·10⁴", "every element appears twice except one that appears once", "−3·10⁴ ≤ nums[i] ≤ 3·10⁴"],
    recognize:
      "'Everything appears in **pairs** except one.' The phrase *pairs cancel* is the XOR signal: `x ^ x == 0`. XORing the whole array makes every duplicate vanish and leaves the loner. O(1) space, O(n) time.",
    figureItOut: [
      "A hash map of counts works (O(n) space), and so does sorting (O(n log n)). But the problem demands **O(1) space** — so neither is the intended answer. We need a property that lets pairs erase themselves.",
      "Recall three facts about XOR (`^`): `x ^ x = 0` (a value cancels itself), `x ^ 0 = x` (zero is the identity), and it's **commutative and associative** (order doesn't matter).",
      "Now XOR every number in the array together. Each value that appears twice contributes `x ^ x = 0`. All those zeros vanish. The only survivor is the element that appeared once.",
      "So the answer is simply the running XOR of the whole array — one pass, a single accumulator, no extra memory.",
    ],
    approaches: [
      {
        name: "XOR everything (optimal)",
        intuition: "Fold the array with XOR; paired values cancel to 0, leaving the unique one.",
        time: "O(n)",
        timeWhy: "A single pass, one XOR per element.",
        space: "O(1)",
        spaceWhy: "Just one integer accumulator.",
        code: `int singleNumber(int[] nums) {
    int x = 0;
    for (int v : nums) x ^= v;   // pairs cancel, the loner remains
    return x;
}`,
        walkthrough: [
          "[4,1,2,1,2]: 0^4=4, 4^1=5, 5^2=7, 7^1=6, 6^2=4.",
          "The 1s and 2s cancelled; result 4.",
        ],
      },
    ],
    edgeCases: [
      "Single element `[5]` → XOR with 0 → 5.",
      "Negative numbers — XOR works directly on the two's-complement bit pattern.",
      "The duplicates can be interleaved in any order; XOR's commutativity makes order irrelevant.",
    ],
    twists: [
      "**Every element appears thrice except one** (LeetCode 137) → XOR can't cancel triples; count each bit mod 3, or use two accumulators (`ones`, `twos`).",
      "**Exactly two unique elements, the rest in pairs** (LeetCode 260) → XOR everything to get `a ^ b`, then split by a set bit that differs.",
      "**Find the missing number 0..n** → that's the next problem; XOR indices with values.",
    ],
    related: ["missing-number", "number-of-1-bits"],
  },

  {
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 191,
    statement:
      "Write a function that takes an unsigned integer and returns the number of `1` bits it has (its **Hamming weight** — the population count).",
    examples: [
      { in: "n = 11 (binary 1011)", out: "3" },
      { in: "n = 128 (binary 10000000)", out: "1" },
      { in: "n = 4294967293 (binary 111...01)", out: "31" },
    ],
    constraints: ["the input is a 32-bit integer"],
    recognize:
      "Counting set bits. The naive way checks all 32 bits; the slick way uses the identity **`n & (n − 1)` clears the lowest set bit**, so you loop exactly once per 1-bit. Classic bit-trick territory.",
    figureItOut: [
      "Baseline: examine each of the 32 bit positions. Check the lowest bit with `n & 1`, add it to a count, then shift `n` right by one. Always 32 iterations regardless of how many bits are set. Correct, and fine — but there's a sharper move.",
      "Observe what subtracting 1 does: it flips the **lowest set bit** to 0 and turns all the zeros below it into ones. For example `1100 − 1 = 1011`.",
      "Now AND the original with that: `n & (n − 1)` keeps only the bits they share, which **removes exactly the lowest set bit** and leaves everything above it untouched. `1100 & 1011 = 1000`.",
      "So each `n = n & (n − 1)` deletes one set bit. Loop until `n` is 0, counting the steps — the number of iterations equals the number of 1 bits. This runs in O(set bits), often far fewer than 32.",
    ],
    approaches: [
      {
        name: "Check each bit",
        intuition: "Look at the lowest bit, shift right, repeat for all 32 positions.",
        time: "O(32) = O(1)",
        timeWhy: "Fixed 32 iterations for a 32-bit integer.",
        space: "O(1)",
        spaceWhy: "A single counter.",
        code: `int hammingWeight(int n) {
    int count = 0;
    for (int i = 0; i < 32; i++) {
        count += (n >> i) & 1;   // is bit i set?
    }
    return count;
}`,
      },
      {
        name: "Brian Kernighan: clear the lowest set bit (optimal)",
        intuition: "`n & (n−1)` removes the lowest 1; loop until n is 0, counting removals.",
        time: "O(k)",
        timeWhy: "k = number of set bits; one iteration per 1-bit (≤ 32).",
        space: "O(1)",
        spaceWhy: "Just a counter.",
        code: `int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);   // drop the lowest set bit
        count++;
    }
    return count;
}`,
        walkthrough: [
          "n = 11 (1011): n&(n-1) = 1011 & 1010 = 1010 (count 1).",
          "1010 & 1001 = 1000 (count 2); 1000 & 0111 = 0000 (count 3) → n is 0 → return 3.",
        ],
      },
    ],
    edgeCases: [
      "n = 0 → no set bits → 0 (the while loop never runs).",
      "All bits set (0xFFFFFFFF) → 32 iterations → 32.",
      "In Java, `int` is signed; using `n != 0` (not `n > 0`) and unsigned shift `>>>` where needed keeps negatives correct — Kernighan's loop is sign-agnostic.",
    ],
    twists: [
      "**Hamming distance between a and b** (LeetCode 461) → count the set bits of `a ^ b`.",
      "**Count bits for every number 0..n** → that's the next problem (*Counting Bits*), solved with DP.",
      "**Built-in** → `Integer.bitCount(n)` does this in hardware, but interviewers want the trick.",
    ],
    related: ["counting-bits", "single-number"],
  },

  {
    slug: "counting-bits",
    title: "Counting Bits",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 338,
    statement:
      "Given an integer `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in the binary representation of `i`, for every `i` from 0 to n.",
    examples: [
      { in: "n = 2", out: "[0,1,1]", note: "0→0, 1→1, 2(10)→1" },
      { in: "n = 5", out: "[0,1,1,2,1,2]", note: "counts for 0..5" },
    ],
    constraints: ["0 ≤ n ≤ 10⁵"],
    recognize:
      "Population count for **every** number up to n. Calling a per-number popcount is O(n log n); the better idea is **DP that reuses an earlier answer** — each number's bit count is one already-computed smaller count plus a known bit.",
    figureItOut: [
      "Easy baseline: for each i, run Brian Kernighan's popcount → O(n · bits) ≈ O(n log n). It works, but we're recomputing structure we could inherit from smaller numbers.",
      "Relate `i` to a smaller, already-solved value. Drop `i`'s **lowest** bit with `i >> 1` (integer divide by 2): that's a number we computed earlier. The only bit you removed by halving is the **lowest** one, `i & 1`.",
      "So `bits[i] = bits[i >> 1] + (i & 1)`. Reading 1011: `1011 >> 1 = 101` (which has 2 ones), plus the lost low bit `1` → 3. Every count is built in O(1) from a previous one.",
      "Fill the array left to right starting `bits[0] = 0`. Since `i >> 1 < i`, the value you need is always already computed. Total work is O(n).",
    ],
    approaches: [
      {
        name: "Popcount each number (baseline)",
        intuition: "Independently count bits of every i with Kernighan.",
        time: "O(n log n)",
        timeWhy: "Each of n numbers costs up to log i bit-clears.",
        space: "O(1)",
        spaceWhy: "Beyond the required output array, just a counter.",
        code: `int[] countBitsSlow(int n) {
    int[] ans = new int[n + 1];
    for (int i = 0; i <= n; i++) {
        int x = i, c = 0;
        while (x != 0) { x &= (x - 1); c++; }
        ans[i] = c;
    }
    return ans;
}`,
      },
      {
        name: "DP reusing i >> 1 (optimal)",
        intuition: "Each count is the count of i with its lowest bit removed, plus that lowest bit.",
        time: "O(n)",
        timeWhy: "One O(1) transition per number.",
        space: "O(1)",
        spaceWhy: "Only the output array; each entry is filled from an earlier one.",
        code: `int[] countBits(int n) {
    int[] ans = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        ans[i] = ans[i >> 1] + (i & 1);   // half's count, plus the dropped low bit
    }
    return ans;   // ans[0] = 0 by default
}`,
        walkthrough: [
          "n=5: ans[0]=0. ans[1]=ans[0]+1=1. ans[2]=ans[1]+0=1. ans[3]=ans[1]+1=2.",
          "ans[4]=ans[2]+0=1. ans[5]=ans[2]+1=2 → [0,1,1,2,1,2].",
        ],
      },
    ],
    edgeCases: [
      "n = 0 → `[0]` (loop body never runs).",
      "Powers of two (e.g. 4 = 100) → count 1, correctly `ans[4] = ans[2] + 0`.",
      "An alternative recurrence `ans[i] = ans[i & (i-1)] + 1` (lowest set bit cleared) also gives O(n).",
    ],
    twists: [
      "**Recurrence on the highest bit** → `ans[i] = ans[i − highestPow2 ≤ i] + 1`, tracking the largest power of two seen.",
      "**Sum of all bit counts 0..n** → accumulate, or derive a closed form per bit position.",
      "**Parity (odd/even number of bits)** → `ans[i] = ans[i >> 1] ^ (i & 1)` if you only need the XOR of bits.",
    ],
    related: ["number-of-1-bits", "single-number"],
  },

  {
    slug: "reverse-bits",
    title: "Reverse Bits",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 190,
    statement:
      "Reverse the bits of a given 32-bit **unsigned** integer. The least-significant bit becomes the most-significant, and so on.",
    examples: [
      {
        in: "n = 0000...00000010100101000001111010011100 (43261596)",
        out: "0011100101111000001010010100000000... (964176192)",
        note: "the 32-bit pattern read backwards",
      },
      { in: "n = 11111111111111111111111111111101 (4294967293)", out: "10111111111111111111111111111111 (3221225471)" },
    ],
    constraints: ["the input is a 32-bit integer"],
    recognize:
      "Bit-level mirroring of a fixed-width integer. The mechanical approach: **peel the lowest bit, append it to the high end of the result**, repeat 32 times. It's the bit analogue of reversing a number digit by digit.",
    figureItOut: [
      "You need bit position `i` of the input to end up at position `31 − i` of the output. The simplest construction builds the result one bit at a time.",
      "Reading the input from its **lowest** bit and writing the output from its **lowest** bit too: take `n`'s current low bit (`n & 1`), and before placing it, **shift the result left by one** to make room at the bottom — pushing earlier bits up.",
      "Concretely each step: `result = (result << 1) | (n & 1)`, then `n >>= 1` (use the **unsigned** shift `>>>` in Java so the sign bit doesn't smear in). After 32 steps, the first bit you read (input's LSB) has been shifted left 31 times — it sits at the top, exactly the reverse.",
      "Always do **exactly 32 iterations**, even past leading zeros, because the width is fixed at 32 and those high zeros are meaningful positions in the reversed value.",
    ],
    approaches: [
      {
        name: "Peel and append, 32 times (optimal)",
        intuition: "Pull the low bit of n, shift the result left, drop the bit in — repeat for all 32 positions.",
        time: "O(32) = O(1)",
        timeWhy: "Fixed 32 iterations.",
        space: "O(1)",
        spaceWhy: "A single result accumulator.",
        code: `int reverseBits(int n) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);   // append n's low bit to result's low end
        n >>>= 1;                            // unsigned shift to the next input bit
    }
    return result;
}`,
        walkthrough: [
          "Take a 4-bit toy: n = 1011. Start result=0.",
          "bit1 → result=1, n=101; bit1 → result=11, n=10; bit0 → result=110, n=1; bit1 → result=1101.",
          "1011 reversed is 1101 — each low bit was carried up by the left shifts.",
        ],
      },
    ],
    edgeCases: [
      "n = 0 → reversed is 0.",
      "Use `>>>` (unsigned) not `>>`: with signed `>>`, a negative `n` keeps shifting in 1s and never terminates the bit supply correctly.",
      "Leading zeros matter — the loop must run all 32 times to place them at the low end.",
    ],
    twists: [
      "**Called many times (follow-up)** → cache results in byte-sized chunks: reverse the 4 bytes via a 256-entry lookup table and reassemble.",
      "**Divide-and-conquer swap** → swap 16/16, then 8/8, 4/4, 2/2, 1/1 with masks → O(log 32) operations, no loop.",
      "**Reverse only the low k bits** → run k iterations and OR back the untouched high bits.",
    ],
    related: ["number-of-1-bits", "reverse-integer"],
  },

  {
    slug: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 268,
    statement:
      "Given an array `nums` containing `n` distinct numbers drawn from the range `[0, n]`, return the **one number missing** from the range. Aim for O(n) time and O(1) extra space.",
    examples: [
      { in: "nums = [3,0,1]", out: "2", note: "range is 0..3; 2 is absent" },
      { in: "nums = [0,1]", out: "2", note: "range is 0..2" },
      { in: "nums = [9,6,4,2,3,5,7,0,1]", out: "8" },
    ],
    constraints: ["n == nums.length", "0 ≤ nums[i] ≤ n", "all numbers are distinct"],
    recognize:
      "You have `n` of the `n+1` numbers in `0..n`; one is gone. Two classic O(1)-space tools: **XOR** (pair every index with every value, the unmatched one survives) or the **Gauss sum** (expected total minus actual total).",
    figureItOut: [
      "A boolean 'seen' array finds it in O(n) but uses O(n) space. We want O(1) space, so we need an aggregate that isolates the missing value.",
      "Sum idea: the numbers `0 + 1 + ... + n` total `n(n+1)/2` (Gauss). Subtract the actual array sum and what's left is precisely the absent number. Watch for overflow on large n — widen to `long` or subtract incrementally.",
      "XOR idea (no overflow at all): XOR together **all the indices 0..n** and **all the values** in the array. Every number that is present appears once as an index and once as a value → it cancels (`x ^ x = 0`). The missing number appears only as an index, so it survives.",
      "Concretely, seed the accumulator with `n` (the one index that has no array slot), then for each i do `acc ^= i ^ nums[i]`. The leftover is the missing number — one pass, one integer.",
    ],
    approaches: [
      {
        name: "Gauss sum",
        intuition: "Expected total of 0..n minus the actual total is the missing number.",
        time: "O(n)",
        timeWhy: "One pass to sum.",
        space: "O(1)",
        spaceWhy: "A running sum.",
        code: `int missingNumber(int[] nums) {
    int n = nums.length;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int v : nums) actual += v;
    return expected - actual;
}`,
      },
      {
        name: "XOR indices with values (optimal, overflow-proof)",
        intuition: "Each present number cancels (once as index, once as value); the missing one is left.",
        time: "O(n)",
        timeWhy: "Single pass of XORs.",
        space: "O(1)",
        spaceWhy: "One accumulator.",
        code: `int missingNumber(int[] nums) {
    int n = nums.length;
    int acc = n;                       // index n has no array element
    for (int i = 0; i < n; i++) {
        acc ^= i ^ nums[i];            // pair each index with its value
    }
    return acc;
}`,
        walkthrough: [
          "[3,0,1], n=3. acc=3. i=0: acc ^= 0^3 = 3^3 = 0. i=1: acc ^= 1^0 = 0^1 = 1.",
          "i=2: acc ^= 2^1 = 1^3 = 2 → return 2.",
        ],
      },
    ],
    edgeCases: [
      "Missing number is 0 (e.g. `[1]`) → XOR/sum both yield 0.",
      "Missing number is n (e.g. `[0,1]`, n=2) → handled because the accumulator is seeded with n.",
      "Large n → the sum method can overflow `int`; XOR never can.",
    ],
    twists: [
      "**Find the duplicate instead of the missing** (range 1..n with one repeat) → XOR or Floyd's cycle on indices.",
      "**Two numbers missing** → XOR gives `a ^ b`; split on a differing bit like *Single Number III*.",
      "**Numbers from 1..n** → seed the XOR/sum with the 1..n range instead of 0..n.",
    ],
    related: ["single-number", "find-the-duplicate-number"],
  },

  {
    slug: "sum-of-two-integers",
    title: "Sum of Two Integers",
    difficulty: "Medium",
    pattern: "bit-manipulation",
    leetcode: 371,
    statement:
      "Given two integers `a` and `b`, return their sum **without using the `+` or `−` operators**.",
    examples: [
      { in: "a = 1, b = 2", out: "3" },
      { in: "a = 2, b = 3", out: "5" },
      { in: "a = -2, b = 3", out: "1" },
    ],
    constraints: ["−1000 ≤ a, b ≤ 1000"],
    recognize:
      "Addition is banned, so you must **rebuild it from bit logic**. The decomposition: XOR is addition without carry, AND-then-shift is the carry, and you fold the carry back in until none remains. This is a half-adder loop.",
    figureItOut: [
      "Think about adding two bits the way hardware does. Bitwise **XOR** gives the sum **ignoring carries**: 0+0=0, 1+0=1, 1+1=0 (with a carry it drops). So `a ^ b` is the partial sum.",
      "Where do carries happen? Exactly where **both** bits are 1 — that's `a & b`. A carry must be added one position to the **left**, so it's `(a & b) << 1`.",
      "Now the problem reduces to: add the carry-free sum and the carry — but that's another addition. So **loop**: set `a = a ^ b` (sum so far) and `b = (a & b) << 1` (carry to apply), and repeat until the carry `b` becomes 0. When there's no carry left, `a` holds the full sum.",
      "Negative numbers and subtraction fall out automatically because Java integers are two's complement — the same XOR/carry loop adds negatives correctly. Compute `(a & b) << 1` **before** overwriting `a`, or capture the carry in a temp first.",
    ],
    approaches: [
      {
        name: "XOR sum + carry loop (optimal)",
        intuition: "XOR adds without carry; (a & b) << 1 is the carry; repeat until the carry is gone.",
        time: "O(1)",
        timeWhy: "At most ~32 iterations (one per bit width) before the carry clears.",
        space: "O(1)",
        spaceWhy: "A constant number of integer variables.",
        code: `int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;   // where both bits are 1, carry moves left
        a = a ^ b;                  // sum without the carry
        b = carry;                  // fold the carry back in next round
    }
    return a;
}`,
        walkthrough: [
          "a=2 (010), b=3 (011): carry=(010&011)<<1=010<<1=100; a=010^011=001; b=100.",
          "carry=(001&100)<<1=0; a=001^100=101; b=0 → loop ends → 101 = 5.",
        ],
      },
    ],
    edgeCases: [
      "b = 0 → the loop never runs, returns a unchanged.",
      "Negative operands (e.g. −2 + 3) → two's-complement bit patterns make the same loop work, ending at 1.",
      "a = b = 0 → returns 0 immediately.",
    ],
    twists: [
      "**Subtraction without `−`** → add the negation: `a + (~b + 1)`, where `~b + 1` is two's-complement negate (itself buildable from the same adder).",
      "**Multiply without `*`** → shift-and-add: for each set bit of one operand, add the other shifted left, using this `getSum`.",
      "**Add two binary strings** (LeetCode 67) → same XOR/carry idea done character by character.",
    ],
    related: ["pow-x-n", "reverse-integer"],
  },

  {
    slug: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Medium",
    pattern: "bit-manipulation",
    leetcode: 7,
    statement:
      "Given a signed 32-bit integer `x`, return `x` with its **digits reversed**. If reversing causes the value to fall outside the signed 32-bit range `[−2³¹, 2³¹ − 1]`, return `0`.",
    examples: [
      { in: "x = 123", out: "321" },
      { in: "x = -123", out: "-321" },
      { in: "x = 120", out: "21", note: "trailing zero disappears" },
    ],
    constraints: ["−2³¹ ≤ x ≤ 2³¹ − 1"],
    recognize:
      "Digit-reversal of an integer — pure **digit math** (`% 10` to peel, `* 10 + d` to build). The whole difficulty is **detecting 32-bit overflow before it happens**, since you can't use a 64-bit type in the strict version.",
    figureItOut: [
      "Reversing digits is mechanical: repeatedly take the last digit with `x % 10`, append it to a running result with `result = result * 10 + digit`, and drop it from x with `x /= 10`. In Java `%` and `/` keep the sign, so negatives reverse correctly without special-casing.",
      "The real trap is **overflow**: `321` fits, but reversing `1534236469` would exceed `2³¹ − 1`. If you're allowed a `long`, build in `long` and just check the final value against the 32-bit bounds.",
      "For the strict 'no 64-bit type' version, check **before** each `result = result * 10 + digit`. The product will overflow the positive bound if `result > Integer.MAX_VALUE / 10`, or it equals that and the next digit pushes past the last allowed digit. The symmetric check guards the negative bound.",
      "When an overflow check trips, return 0 immediately. Trailing zeros need no special handling — `120` peels 0, then 2, then 1, building 021 = 21 naturally.",
    ],
    approaches: [
      {
        name: "Build in a wider type, then range-check (simple)",
        intuition: "Accumulate the reversed value in a long; if it leaves the 32-bit range, return 0.",
        time: "O(d)",
        timeWhy: "d = number of digits (≤ 10).",
        space: "O(1)",
        spaceWhy: "A couple of scalars.",
        code: `int reverseSimple(int x) {
    long rev = 0;
    while (x != 0) {
        rev = rev * 10 + x % 10;   // % keeps sign in Java
        x /= 10;
    }
    if (rev < Integer.MIN_VALUE || rev > Integer.MAX_VALUE) return 0;
    return (int) rev;
}`,
      },
      {
        name: "Pure 32-bit with pre-multiply overflow checks (optimal/strict)",
        intuition: "Before each multiply-add, verify it won't exceed the signed 32-bit bounds; bail to 0 if it would.",
        time: "O(d)",
        timeWhy: "One step per digit.",
        space: "O(1)",
        spaceWhy: "Only the running result and current digit.",
        code: `int reverse(int x) {
    int result = 0;
    while (x != 0) {
        int digit = x % 10;   // -9..9, sign preserved
        x /= 10;
        // would result * 10 + digit overflow the positive bound?
        if (result > Integer.MAX_VALUE / 10 ||
            (result == Integer.MAX_VALUE / 10 && digit > 7)) return 0;
        // would it underflow the negative bound?
        if (result < Integer.MIN_VALUE / 10 ||
            (result == Integer.MIN_VALUE / 10 && digit < -8)) return 0;
        result = result * 10 + digit;
    }
    return result;
}`,
        walkthrough: [
          "x=-123: digit=-3, x=-12, result=-3; digit=-2, x=-1, result=-32; digit=-1, x=0, result=-321.",
          "No bound tripped → return -321.",
        ],
      },
    ],
    edgeCases: [
      "Trailing zeros (120 → 21) — leading zeros in the reverse just vanish.",
      "`x = Integer.MIN_VALUE` (−2³¹) — its reverse overflows → return 0; the pre-check catches it.",
      "Single digit or 0 → returns itself.",
    ],
    twists: [
      "**Palindrome Number** (LeetCode 9) → reverse and compare to the original, reusing this digit loop.",
      "**Reverse within an arbitrary base** → swap 10 for the base in `% / *`.",
      "**String to Integer (atoi)** → parsing/overflow cousin; same pre-multiply overflow guards.",
    ],
    related: ["sum-of-two-integers", "reverse-bits"],
  },
];
