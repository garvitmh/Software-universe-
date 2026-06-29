// NeetCode 250 extras — wave 6c (greedy, intervals, math-geometry, bit). Java.
export const WAVE6C = [
  // ───────────────────────────── GREEDY ─────────────────────────────
  {
    slug: "boats-to-save-people",
    title: "Boats to Save People",
    difficulty: "Medium",
    pattern: "greedy",
    leetcode: 881,
    statement:
      "Each person has a weight `people[i]`. Each boat carries **at most two people** and has a weight limit `limit`. Return the **minimum number of boats** to carry everyone.",
    examples: [
      { in: "people = [1,2], limit = 3", out: "1", note: "1 + 2 = 3 fits in one boat" },
      { in: "people = [3,2,2,1], limit = 3", out: "3", note: "(1,2), (2), (3)" },
      { in: "people = [3,5,3,4], limit = 5", out: "4", note: "everyone goes alone" },
    ],
    constraints: ["1 ≤ people.length ≤ 5·10⁴", "1 ≤ people[i] ≤ limit ≤ 3·10⁴"],
    recognize:
      "'**Minimum number of** boats, at most two per boat' is a pairing problem. Sort, then ask at each step: who's the obvious partner? 'Sort first, then greedily pair the extremes' is the trigger.",
    figureItOut: [
      "A boat holds at most two people, so this is about **pairing**. The heaviest person is the constraint — they take the most room, so figure out who (if anyone) can ride with them.",
      "Sort the weights. Now think about the **heaviest** person, at the right end. The only person worth pairing them with is the **lightest** one, at the left end — anyone heavier than the lightest is even harder to fit, so save those for their own boats.",
      "So check: does `lightest + heaviest ≤ limit`? If yes, they share a boat — advance both pointers. If no, the heaviest goes alone — advance only the right pointer. Either way the heaviest is now handled.",
      "Why is the lightest the right partner and not someone in the middle? If the lightest can't fit with the heaviest, nobody can, so the heaviest is alone. If the lightest *can* fit, pairing them is never worse than leaving them — pairing two people uses one boat for two, the best possible ratio.",
      "Each step removes at least one person and counts exactly one boat, so two pointers sweeping inward gives the answer in O(n).",
    ],
    approaches: [
      {
        name: "Sort + two pointers (optimal)",
        intuition:
          "Sort weights. Pair the lightest with the heaviest when they fit; otherwise the heaviest rides alone. Each boat counted once.",
        time: "O(n log n)",
        timeWhy: "The sort dominates; the two-pointer sweep is a single O(n) pass.",
        space: "O(1)",
        spaceWhy: "Sorting in place plus two index variables (ignoring sort's internal overhead).",
        code: `int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int l = 0, r = people.length - 1, boats = 0;
    while (l <= r) {
        if (people[l] + people[r] <= limit) l++;  // lightest rides with heaviest
        r--;                                       // heaviest always leaves now
        boats++;
    }
    return boats;
}`,
        walkthrough: [
          "people=[3,2,2,1], limit=3 → sorted [1,2,2,3]. l=0(1), r=3(3): 1+3=4>3 → 3 alone, r=2, boats=1.",
          "l=0(1), r=2(2): 1+2=3≤3 → pair, l=1, r=1, boats=2.",
          "l=1, r=1(2): 2+2=4>3 → 2 alone, r=0, boats=3. l>r → stop → 3.",
        ],
      },
    ],
    edgeCases: [
      "One person → exactly one boat.",
      "When `l == r` (one person left), `people[l] + people[r]` is that person doubled — but since per constraints `people[i] ≤ limit`, the `l++` only fires when it would genuinely fit a second; the lone person still consumes one boat via `r--`.",
      "Everyone at the weight limit → each gets their own boat.",
    ],
    twists: [
      "**Boat holds up to three people** → greedy two-pointer no longer suffices cleanly; the pairing argument breaks and it becomes harder.",
      "**Minimize total boat weight instead of count** → a different objective; the lightest+heaviest rule no longer applies.",
      "**Each person has a value, maximize value carried** → turns into a knapsack-style optimization, not greedy.",
    ],
    related: ["two-sum", "candy"],
  },

  {
    slug: "candy",
    title: "Candy",
    difficulty: "Hard",
    pattern: "greedy",
    leetcode: 135,
    statement:
      "`n` children stand in a line with ratings `ratings[i]`. Each child must get **at least one** candy, and a child with a **higher rating than an immediate neighbor** must get more candies than that neighbor. Return the **minimum** total candies.",
    examples: [
      { in: "ratings = [1,0,2]", out: "5", note: "candies [2,1,2]" },
      { in: "ratings = [1,2,2]", out: "4", note: "candies [1,2,1] — equal ratings have no constraint" },
    ],
    constraints: ["1 ≤ ratings.length ≤ 2·10⁴", "0 ≤ ratings[i] ≤ 2·10⁵"],
    recognize:
      "Each child is constrained by **both neighbors** independently. The trick is to satisfy the left-neighbor rule and the right-neighbor rule in **two separate sweeps**, then combine. 'A local rule from each direction' is the greedy signal.",
    figureItOut: [
      "Every child needs at least 1 candy, and the only constraints are *relative to immediate neighbors*. The hard part: a child is squeezed by the person on the left **and** the person on the right at the same time.",
      "Try to handle one direction at a time. **Left-to-right:** if `ratings[i] > ratings[i-1]`, child i must get more than child i−1, so set `candy[i] = candy[i-1] + 1`. This satisfies every *rising-from-the-left* slope.",
      "But that pass ignores the right neighbor. **Right-to-left:** if `ratings[i] > ratings[i+1]`, child i must beat child i+1, so child i needs at least `candy[i+1] + 1`.",
      "Combine: each child must satisfy *both* rules at once, so take the **max** of the two requirements. The max of the two minimums is the smallest value that satisfies both — that's why it's optimal, not just correct.",
      "Equal ratings impose no constraint (the rule is strictly 'higher'), so a flat or descending step lets the count reset toward 1. Sum the final array.",
    ],
    approaches: [
      {
        name: "Brute force — repeat until stable",
        intuition:
          "Start everyone at 1, then keep sweeping, bumping any child that violates a neighbor rule, until a full pass makes no change.",
        time: "O(n²)",
        timeWhy: "Each sweep is O(n) and you may need up to O(n) sweeps before the array stabilizes.",
        space: "O(n)",
        spaceWhy: "The candy array.",
        code: `// Conceptual baseline — correct but slow.
// candy = all 1s; loop: changed=false; for each i, if a neighbor rule is
// violated bump candy[i] and set changed=true; repeat while changed.`,
      },
      {
        name: "Two sweeps, take the max (optimal)",
        intuition:
          "Left-to-right fixes rising slopes from the left; right-to-left fixes them from the right; each child takes the larger demand.",
        time: "O(n)",
        timeWhy: "Two linear passes plus a sum — three O(n) walks.",
        space: "O(n)",
        spaceWhy: "One candy array of length n.",
        code: `int candy(int[] ratings) {
    int n = ratings.length;
    int[] candy = new int[n];
    Arrays.fill(candy, 1);                       // everyone gets at least one
    for (int i = 1; i < n; i++) {                // left to right
        if (ratings[i] > ratings[i - 1]) candy[i] = candy[i - 1] + 1;
    }
    for (int i = n - 2; i >= 0; i--) {           // right to left
        if (ratings[i] > ratings[i + 1]) candy[i] = Math.max(candy[i], candy[i + 1] + 1);
    }
    int total = 0;
    for (int c : candy) total += c;
    return total;
}`,
        walkthrough: [
          "ratings=[1,0,2]. fill → [1,1,1].",
          "L→R: i=1 (0>1? no); i=2 (2>0? yes) candy[2]=candy[1]+1=2 → [1,1,2].",
          "R→L: i=1 (0>2? no); i=0 (1>0? yes) candy[0]=max(1, candy[1]+1=2)=2 → [2,1,2].",
          "Sum = 2+1+2 = 5.",
        ],
      },
    ],
    edgeCases: [
      "Single child → 1.",
      "All equal ratings → everyone gets exactly 1 (no constraint fires).",
      "Strictly increasing → [1,2,3,...]; strictly decreasing → [...,3,2,1]; the two sweeps each catch one direction.",
    ],
    twists: [
      "**O(1) extra space** → walk once counting up-slopes and down-slopes, adding the longer run plus a peak adjustment — slicker but trickier to get right.",
      "**Neighbors include diagonal / 2-D grid** → topological ordering by rating instead of two linear sweeps.",
      "**Equal ratings must also get equal candy** → adds a same-value constraint the strict-greater rule doesn't handle.",
    ],
    related: ["boats-to-save-people", "gas-station"],
  },

  {
    slug: "lemonade-change",
    title: "Lemonade Change",
    difficulty: "Easy",
    pattern: "greedy",
    leetcode: 860,
    statement:
      "Each lemonade costs **$5**. Customers pay with a `$5`, `$10`, or `$20` bill (given in order by `bills`). You start with no change. Return `true` if you can give every customer correct change.",
    examples: [
      { in: "bills = [5,5,5,10,20]", out: "true" },
      { in: "bills = [5,5,10,10,20]", out: "false", note: "can't make $15 change for the last $20" },
    ],
    constraints: ["1 ≤ bills.length ≤ 10⁵", "bills[i] is 5, 10, or 20"],
    recognize:
      "You make change on the fly and must decide *which* bills to hand back. When a choice has an obviously-better option (hoard the flexible bill), it's **greedy** — no DP needed.",
    figureItOut: [
      "Track only how many `$5` and `$10` bills you're holding — those are your change-making tools. (`$20` bills are useless as change here, so don't bother counting them.)",
      "A `$5` payment needs no change — just take it.",
      "A `$10` payment needs `$5` back — so you must have a five. If not, you fail.",
      "A `$20` needs `$15` back, and there are two ways: a `$10 + $5`, or three `$5`s. Here's the greedy choice: **prefer giving the $10 + $5**. A `$5` is more flexible (it's the only thing that makes change for a `$10`), so hoard fives and spend the ten first whenever you can.",
      "If you can't form `$15` either way, return false. This local rule is optimal because spending fives unnecessarily can only hurt future `$10` customers — never help.",
    ],
    approaches: [
      {
        name: "Greedy — hoard the flexible bills",
        intuition:
          "Count fives and tens. For a $20, give a ten+five if possible (spend the less-flexible ten first), else three fives.",
        time: "O(n)",
        timeWhy: "One pass over the bills; each step is O(1).",
        space: "O(1)",
        spaceWhy: "Two counters.",
        code: `boolean lemonadeChange(int[] bills) {
    int fives = 0, tens = 0;
    for (int b : bills) {
        if (b == 5) {
            fives++;
        } else if (b == 10) {
            if (fives == 0) return false;        // need a $5 back
            fives--; tens++;
        } else {                                  // b == 20, need $15 back
            if (tens > 0 && fives > 0) {          // prefer $10 + $5
                tens--; fives--;
            } else if (fives >= 3) {              // fall back to three $5s
                fives -= 3;
            } else {
                return false;
            }
        }
    }
    return true;
}`,
        walkthrough: [
          "bills=[5,5,10,10,20]. 5→fives=1; 5→fives=2; 10→fives=1,tens=1; 10→fives=0,tens=2.",
          "20: tens>0 but fives==0 → can't do 10+5; fives>=3? no → return false.",
        ],
      },
    ],
    edgeCases: [
      "First customer pays $10 or $20 → instant false (no change yet).",
      "All $5 bills → always true.",
      "The greedy choice matters: giving three fives for a $20 when a ten was available would waste fives and could fail a later $10.",
    ],
    twists: [
      "**Other denominations / prices** → with arbitrary coins the simple two-counter greedy breaks; it becomes a coin-change feasibility problem.",
      "**Minimize bills handed back** → still greedy, prefer larger denominations first.",
      "**Allow restocking change between customers** → changes the constraint entirely.",
    ],
    related: ["candy", "gas-station"],
  },

  // ───────────────────────────── INTERVALS ─────────────────────────────
  {
    slug: "minimum-number-of-arrows-to-burst-balloons",
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 452,
    statement:
      "Balloons are intervals `points[i] = [start, end]` on a number line. An arrow shot at `x` bursts every balloon whose interval contains `x`. Return the **minimum number of arrows** to burst them all.",
    examples: [
      { in: "points = [[10,16],[2,8],[1,6],[7,12]]", out: "2", note: "one arrow at x=6, one at x=11" },
      { in: "points = [[1,2],[3,4],[5,6],[7,8]]", out: "4", note: "no two overlap → one arrow each" },
    ],
    constraints: ["1 ≤ points.length ≤ 10⁵", "points[i].length == 2", "−2³¹ ≤ start ≤ end ≤ 2³¹−1"],
    recognize:
      "'**Minimum arrows / removals / rooms** over intervals' → sort by **end** and greedily extend. The classic interval-scheduling shape: one arrow handles a whole batch of overlapping balloons.",
    figureItOut: [
      "One arrow can pop every balloon it passes through, so you want each arrow to hit as many overlapping balloons as possible — minimize how many arrows you spend.",
      "Sort the balloons by their **end** coordinate. Why end and not start? Because once you commit to an arrow, you want to place it as far right as possible while still hitting the current balloon — and the earliest end is the rightmost point guaranteed to be inside it.",
      "Walk through the sorted balloons. Shoot the first arrow at the **end of the first balloon**. Any later balloon whose `start ≤ thatArrow` is also pierced — skip it, it's already popped.",
      "The moment you reach a balloon whose `start > thatArrow`, the current arrow can't reach it — you need a **new** arrow, placed at this balloon's end. Repeat.",
      "Why is 'pin the arrow at the earliest end' optimal? It's the greediest reach: any balloon that overlaps this one near its end is covered for free, and balloons that don't overlap genuinely need their own arrow. Sorting by end makes that argument airtight.",
    ],
    approaches: [
      {
        name: "Sort by end + greedy (optimal)",
        intuition:
          "Sort by end. Place an arrow at each balloon's end and reuse it for every following balloon that still overlaps; start a new arrow when one doesn't.",
        time: "O(n log n)",
        timeWhy: "Sorting dominates; the sweep is a single O(n) pass.",
        space: "O(1)",
        spaceWhy: "A few variables (ignoring the sort's overhead).",
        code: `int findMinArrowShots(int[][] points) {
    if (points.length == 0) return 0;
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));  // by end, overflow-safe
    int arrows = 1;
    long arrowAt = points[0][1];                                 // long avoids 2^31 overflow
    for (int[] p : points) {
        if (p[0] > arrowAt) {                                    // current arrow can't reach
            arrows++;
            arrowAt = p[1];                                      // new arrow at this end
        }
    }
    return arrows;
}`,
        walkthrough: [
          "points sorted by end → [[1,6],[2,8],[7,12],[10,16]]. arrows=1, arrowAt=6.",
          "[1,6]: 1>6? no. [2,8]: 2>6? no. [7,12]: 7>6? yes → arrows=2, arrowAt=12.",
          "[10,16]: 10>12? no → covered. Total = 2.",
        ],
      },
    ],
    edgeCases: [
      "Single balloon → 1 arrow.",
      "No overlaps at all → one arrow per balloon.",
      "Coordinates near ±2³¹ — use `Integer.compare` in the comparator and a `long` for `arrowAt` so `a[1] - b[1]` and the end value don't overflow.",
      "Touching endpoints like [1,2] and [2,3] count as overlapping (`start ≤ arrowAt` uses `>` for the break).",
    ],
    twists: [
      "**Non-overlapping intervals** (LeetCode 435, count removals) → same sort-by-end greedy, count the ones you'd drop.",
      "**Endpoints are exclusive** ([1,2) doesn't touch [2,3)) → flip the comparison to `p[0] >= arrowAt`.",
      "**Weighted balloons / maximize value with k arrows** → no longer greedy; becomes DP or scheduling.",
    ],
    related: ["non-overlapping-intervals", "merge-intervals"],
  },

  {
    slug: "car-pooling",
    title: "Car Pooling",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 1094,
    statement:
      "A car has `capacity` empty seats. `trips[i] = [numPassengers, from, to]` means picking up `numPassengers` at location `from` and dropping them at `to` (the car only drives east, increasing location). Return `true` if all trips fit without ever exceeding capacity.",
    examples: [
      { in: "trips = [[2,1,5],[3,3,7]], capacity = 4", out: "false", note: "at location 3, 2+3=5 > 4" },
      { in: "trips = [[2,1,5],[3,3,7]], capacity = 5", out: "true" },
    ],
    constraints: ["1 ≤ trips.length ≤ 1000", "1 ≤ numPassengers ≤ 100", "0 ≤ from < to ≤ 1000", "1 ≤ capacity ≤ 10⁵"],
    recognize:
      "Each trip is an interval [from, to) that **adds load** while active. 'Running total of overlapping intervals vs a limit' → a **sweep line** / difference array. Same engine as Meeting Rooms II.",
    figureItOut: [
      "Each trip occupies the car between `from` and `to`. The question is really: at any single point along the road, does the total number of passengers on board ever exceed `capacity`?",
      "Think of it as events on the number line: at `from`, `+numPassengers` board; at `to`, `−numPassengers` leave. If you process every location in order and keep a running total, that total is exactly the load at that point.",
      "A clean way: a **difference array** indexed by location. Do `diff[from] += p` and `diff[to] -= p`. Then a prefix sum over locations replays boardings and drop-offs in order.",
      "Crucial ordering detail: a passenger dropped at location `to` frees the seat *before* anyone boards at that same location. Putting the `−p` at index `to` (not `to+1`) and summing left-to-right handles this automatically — the drop is applied at `to` together with any boarding there.",
      "If the running total ever exceeds `capacity`, return false. Locations are capped at 1000, so a fixed 1001-slot array makes this O(n + maxLocation).",
    ],
    approaches: [
      {
        name: "Sort events / sweep line",
        intuition:
          "Turn each trip into a +p board event and a −p drop event, sort by location (drops before boards at a tie), and track a running total.",
        time: "O(n log n)",
        timeWhy: "Sorting the 2n events dominates.",
        space: "O(n)",
        spaceWhy: "The event list of size 2n.",
        code: `boolean carPooling(int[][] trips, int capacity) {
    // event = {location, delta}; sort by location, drop-offs (negative) first on ties
    List<int[]> events = new ArrayList<>();
    for (int[] t : trips) {
        events.add(new int[]{t[1], t[0]});    // board: +passengers
        events.add(new int[]{t[2], -t[0]});   // drop:  -passengers
    }
    events.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    int load = 0;
    for (int[] e : events) {
        load += e[1];
        if (load > capacity) return false;
    }
    return true;
}`,
      },
      {
        name: "Difference array over locations (optimal)",
        intuition:
          "Locations are ≤ 1000. Mark +p at from and −p at to, then prefix-sum; the running sum is the load at each location.",
        time: "O(n + L)",
        timeWhy: "n to fill the diff array, L (≤1001) to prefix-sum and check.",
        space: "O(L)",
        spaceWhy: "A fixed array sized to the max location.",
        code: `boolean carPooling(int[][] trips, int capacity) {
    int[] diff = new int[1001];          // locations are bounded by 1000
    for (int[] t : trips) {
        diff[t[1]] += t[0];              // board at 'from'
        diff[t[2]] -= t[0];              // drop at 'to' (seat freed here)
    }
    int load = 0;
    for (int d : diff) {
        load += d;
        if (load > capacity) return false;
    }
    return true;
}`,
        walkthrough: [
          "trips=[[2,1,5],[3,3,7]], cap=4. diff[1]+=2, diff[5]-=2, diff[3]+=3, diff[7]-=3.",
          "prefix: loc1 load=2; loc3 load=2+3=5 → 5>4 → return false.",
        ],
      },
    ],
    edgeCases: [
      "A trip ending exactly where another begins (`to == from`) → the seat is freed at that location before the new boarding (the −p at index `to` is summed together with the +p).",
      "A single trip with passengers > capacity → false immediately.",
      "Capacity huge / few passengers → trivially true.",
    ],
    twists: [
      "**Locations unbounded / very large** → drop the fixed array; use the sort-events sweep line instead.",
      "**Return the maximum load at any point** → same sweep, track the max instead of comparing to capacity.",
      "**Car can also drive west / 2-D** → the linear sweep no longer applies.",
    ],
    related: ["meeting-rooms-ii", "minimum-number-of-arrows-to-burst-balloons"],
  },

  {
    slug: "my-calendar-i",
    title: "My Calendar I",
    difficulty: "Medium",
    pattern: "intervals",
    leetcode: 729,
    statement:
      "Implement `MyCalendar`. `book(start, end)` reserves the half-open interval `[start, end)`. Return `true` and store it if it **doesn't overlap** any existing booking; otherwise return `false` and store nothing. A double-booking is two events sharing any positive-length time.",
    examples: [
      { in: "book(10,20)", out: "true" },
      { in: "book(15,25)", out: "false", note: "overlaps [10,20)" },
      { in: "book(20,30)", out: "true", note: "touches at 20 but [10,20) is half-open → no overlap" },
    ],
    constraints: ["0 ≤ start < end ≤ 10⁹", "Up to 1000 calls to book"],
    recognize:
      "Insert an interval only if it **overlaps nothing** stored so far. The core is the overlap test (`start < other.end && other.start < end`); a sorted structure (TreeMap) makes each query O(log n).",
    figureItOut: [
      "The whole problem reduces to one question per booking: does `[start, end)` overlap **any** interval already on the calendar? If not, keep it; if so, reject it.",
      "First nail the overlap test for two half-open intervals `[s1,e1)` and `[s2,e2)`. They overlap exactly when `s1 < e2 && s2 < e1`. The half-open part matters: `[10,20)` and `[20,30)` *touch* at 20 but don't overlap, and `s2 < e1` (20 < 20) is correctly false.",
      "Simplest version: store every booking in a list and, on each new booking, scan all existing ones for an overlap. O(n) per booking, O(n²) overall — fine for 1000 calls.",
      "To do better, keep bookings **sorted by start** in a `TreeMap<start, end>`. The only intervals that could overlap `[start,end)` are the one starting **just before** `start` and the one starting **just after** — its `floorKey` and `ceilingKey` neighbors.",
      "Check those two neighbors with the overlap test. If neither collides, insert. Each `book` is then O(log n) via the balanced tree.",
    ],
    approaches: [
      {
        name: "Brute force — scan all bookings",
        intuition: "Keep a list; on each book, test the new interval against every stored one.",
        time: "O(n) per book, O(n²) total",
        timeWhy: "Each of n bookings compares against up to n existing intervals.",
        space: "O(n)",
        spaceWhy: "The list of all accepted intervals.",
        code: `class MyCalendar {
    private List<int[]> books = new ArrayList<>();

    public boolean book(int start, int end) {
        for (int[] b : books) {
            if (start < b[1] && b[0] < end) return false;  // overlap
        }
        books.add(new int[]{start, end});
        return true;
    }
}`,
      },
      {
        name: "TreeMap of start → end (optimal)",
        intuition:
          "Keep intervals sorted by start; only the nearest neighbor below and above can overlap, found in O(log n).",
        time: "O(log n) per book",
        timeWhy: "floorKey/ceilingKey and put are each O(log n) on a balanced tree.",
        space: "O(n)",
        spaceWhy: "The tree holds all n accepted intervals.",
        code: `class MyCalendar {
    private TreeMap<Integer, Integer> cal = new TreeMap<>();  // start -> end

    public boolean book(int start, int end) {
        Integer prev = cal.floorKey(start);    // nearest booking starting <= start
        Integer next = cal.ceilingKey(start);  // nearest booking starting >= start
        if (prev != null && cal.get(prev) > start) return false;  // prev ends after our start
        if (next != null && next < end) return false;             // next starts before our end
        cal.put(start, end);
        return true;
    }
}`,
        walkthrough: [
          "book(10,20): empty → put {10:20} → true.",
          "book(15,25): floorKey(15)=10, cal.get(10)=20 > 15 → overlap → false.",
          "book(20,30): floorKey(20)=10, 20>20? no; ceilingKey(20)=null → put {20:30} → true.",
        ],
      },
    ],
    edgeCases: [
      "Touching at an endpoint ([10,20) then [20,30)) → allowed; the strict `>` and `<` comparisons make it pass.",
      "Identical interval booked twice → second overlaps fully → false.",
      "A new interval fully containing or fully inside an existing one → both caught by the neighbor checks.",
    ],
    twists: [
      "**My Calendar II** (LeetCode 731) → allow double-booking but reject triple → track overlaps separately.",
      "**My Calendar III** (LeetCode 732) → report the max k-booking at any time → a sweep-line count.",
      "**Return the conflicting interval** → return the neighbor that failed the test instead of just false.",
    ],
    related: ["merge-intervals", "insert-interval"],
  },

  // ───────────────────────────── MATH & GEOMETRY ─────────────────────────────
  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "Easy",
    pattern: "math-geometry",
    leetcode: 13,
    statement:
      "Convert a Roman numeral string to an integer. Symbols are `I=1, V=5, X=10, L=50, C=100, D=500, M=1000`. Usually larger-to-smaller and added, but six **subtractive** pairs exist (IV=4, IX=9, XL=40, XC=90, CD=400, CM=900).",
    examples: [
      { in: 's = "III"', out: "3" },
      { in: 's = "LVIII"', out: "58", note: "L=50, V=5, III=3" },
      { in: 's = "MCMXCIV"', out: "1994", note: "M=1000, CM=900, XC=90, IV=4" },
    ],
    constraints: ["1 ≤ s.length ≤ 15", "s is a valid Roman numeral in [1, 3999]"],
    recognize:
      "A digit-by-digit conversion driven by one local rule. 'Map symbols to values, then add — except when a smaller value sits before a larger one' → the subtract-on-smaller-before-larger trick.",
    figureItOut: [
      "Map each symbol to its value. The default behavior is just to **add** them all up — `III` = 1+1+1 = 3, `LVIII` = 50+5+1+1+1 = 58.",
      "The only complication is subtraction, and there's a clean way to detect it: a symbol is being *subtracted* exactly when a **smaller value appears immediately before a larger one**. In `IV`, the I (1) sits before V (5), so that I counts as −1.",
      "So scan left to right. For each symbol, compare its value to the **next** symbol's value. If `value(current) < value(next)`, subtract it; otherwise add it.",
      "The last symbol has no 'next', so it's always added. This single pass handles all six subtractive pairs without special-casing them — the smaller-before-larger rule covers IV, IX, XL, XC, CD, CM uniformly.",
      "No need to validate; the input is guaranteed well-formed.",
    ],
    approaches: [
      {
        name: "Single pass — subtract if smaller precedes larger (optimal)",
        intuition:
          "Add each symbol's value, unless it's smaller than the symbol right after it — then subtract it.",
        time: "O(n)",
        timeWhy: "One pass over the string; each lookup is O(1).",
        space: "O(1)",
        spaceWhy: "A fixed 7-entry value map.",
        code: `int romanToInt(String s) {
    Map<Character, Integer> val = Map.of(
        'I', 1, 'V', 5, 'X', 10, 'L', 50, 'C', 100, 'D', 500, 'M', 1000);
    int total = 0;
    for (int i = 0; i < s.length(); i++) {
        int cur = val.get(s.charAt(i));
        if (i + 1 < s.length() && cur < val.get(s.charAt(i + 1))) {
            total -= cur;     // smaller before larger → subtractive
        } else {
            total += cur;
        }
    }
    return total;
}`,
        walkthrough: [
          'MCMXCIV: M(1000)≥C → +1000. C(100)<M → −100. M(1000)≥X → +1000. X(10)<C → −10. C(100)≥I → +100. I(1)<V → −1. V(5) last → +5.',
          "1000 − 100 + 1000 − 10 + 100 − 1 + 5 = 1994.",
        ],
      },
    ],
    edgeCases: [
      "Single symbol → its own value.",
      "Pure additive numerals (MMXX = 2020) → no subtraction ever fires.",
      "Consecutive subtractives (MCMXCIV) → each handled independently by the look-ahead.",
    ],
    twists: [
      "**Integer to Roman** (LeetCode 12) → greedily subtract the largest value (including the six subtractive pairs) repeatedly.",
      "**Validate a Roman numeral** → add rules (no four-in-a-row, only legal subtractive pairs).",
      "**Different numeral systems** → generalize the symbol→value table.",
    ],
    related: ["palindrome-number", "excel-sheet-column-number"],
  },

  {
    slug: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    pattern: "math-geometry",
    leetcode: 9,
    statement:
      "Given an integer `x`, return `true` if it reads the same backward as forward. Try to do it **without converting to a string**.",
    examples: [
      { in: "x = 121", out: "true" },
      { in: "x = -121", out: "false", note: "reads 121- backward" },
      { in: "x = 10", out: "false", note: "reads 01 backward" },
    ],
    constraints: ["−2³¹ ≤ x ≤ 2³¹ − 1"],
    recognize:
      "Digit manipulation with an overflow trap. 'Reverse the number (or half of it) with `% 10` and `* 10` and compare' is the math-geometry digit pattern.",
    figureItOut: [
      "First, the easy disqualifiers: any **negative** number fails (the minus sign isn't mirrored), and any number ending in 0 (except 0 itself) fails (a leading 0 can't mirror a trailing one).",
      "The string approach is trivial — reverse the string, compare — but the challenge is to avoid strings. So reverse the number arithmetically: peel digits off the end with `x % 10`, build the reverse with `rev = rev * 10 + digit`.",
      "But reversing the **whole** number can overflow a 32-bit int (e.g. a near-2³¹ palindrome's reverse might exceed the range). The fix: only reverse the **second half** of the digits and compare it to the first half.",
      "Build `rev` by pulling digits off the right while shrinking `x`. Stop when `rev ≥ x` — at that point you've consumed half the digits. Now `x` holds the front half and `rev` holds the reversed back half.",
      "For even digit counts, they match when `x == rev`. For odd counts, the middle digit sits alone in `rev`, so also accept `x == rev / 10` (drop that middle digit). This never overflows because `rev` only ever holds half the digits.",
    ],
    approaches: [
      {
        name: "Reverse half the digits (optimal, no overflow)",
        intuition:
          "Reject negatives and trailing zeros, then reverse only the back half and compare to the front half.",
        time: "O(d)",
        timeWhy: "d = number of digits ≈ log₁₀(x); the loop runs through half of them.",
        space: "O(1)",
        spaceWhy: "Two integer variables.",
        code: `boolean isPalindrome(int x) {
    if (x < 0 || (x % 10 == 0 && x != 0)) return false;  // negatives, trailing zero
    int rev = 0;
    while (x > rev) {
        rev = rev * 10 + x % 10;   // append last digit of x to rev
        x /= 10;                   // drop that digit from x
    }
    // even length: x == rev;  odd length: drop middle digit with rev / 10
    return x == rev || x == rev / 10;
}`,
        walkthrough: [
          "x=121: rev=0, x>rev → rev=1, x=12. 12>1 → rev=12, x=1. 1>12? no → stop.",
          "x=1, rev=12. x==rev? no. x==rev/10=1? yes (the middle digit 2 was dropped) → true.",
        ],
      },
    ],
    edgeCases: [
      "Negative numbers → always false.",
      "0 → true (and the trailing-zero guard explicitly excludes 0).",
      "Multiples of 10 like 10, 100 → false.",
      "Single digit → true (loop body runs once, ends matching).",
    ],
    twists: [
      "**Allowed to use strings** → convert and two-pointer compare, or reverse and equals.",
      "**Reverse Integer** (LeetCode 7) → the related problem where you must actually return the reversed value and detect 32-bit overflow.",
      "**Palindrome in another base** → reverse using that base instead of 10.",
    ],
    related: ["roman-to-integer", "reverse-integer"],
  },

  {
    slug: "count-primes",
    title: "Count Primes",
    difficulty: "Medium",
    pattern: "math-geometry",
    leetcode: 204,
    statement:
      "Given an integer `n`, return the number of prime numbers **strictly less than** `n`.",
    examples: [
      { in: "n = 10", out: "4", note: "2, 3, 5, 7" },
      { in: "n = 0", out: "0" },
      { in: "n = 1", out: "0" },
    ],
    constraints: ["0 ≤ n ≤ 5·10⁶"],
    recognize:
      "Counting primes up to a bound is the textbook **Sieve of Eratosthenes** — instead of testing each number, cross off the multiples of each prime. A number-theory sieve, not a data structure.",
    figureItOut: [
      "The naive way: for each number from 2 to n−1, test if it's prime by trial division up to its square root. Counting them is O(n·√n) — too slow at n = 5·10⁶.",
      "Flip the perspective. Instead of asking 'is x prime?' for each x, **eliminate** composites: every composite is a multiple of some prime, so cross off all multiples of 2, then 3, then 5, ... Whatever survives is prime. That's the **Sieve of Eratosthenes**.",
      "Keep a boolean array `isComposite[0..n-1]`. Start at p = 2. If p isn't yet marked composite, it's prime — mark all its multiples (`2p, 3p, ...`) as composite.",
      "Two optimizations make it fast. You only need to sieve `p` up to `√n`: any composite below n has a factor ≤ √n, so larger primes leave nothing new to cross off. And start crossing off from `p*p`, because smaller multiples (`2p, 3p, ...`) were already marked by smaller primes.",
      "Finally count the unmarked numbers from 2 to n−1. Total work is O(n log log n) — effectively linear.",
    ],
    approaches: [
      {
        name: "Trial division per number",
        intuition: "Test each candidate for primality by dividing up to its square root.",
        time: "O(n√n)",
        timeWhy: "n candidates, each tested by ~√n divisions.",
        space: "O(1)",
        spaceWhy: "Just counters — no array.",
        code: `// Conceptual baseline — correct but too slow for n up to 5e6.
// count = 0; for x in 2..n-1: prime = true;
//   for d in 2..sqrt(x): if x % d == 0 { prime = false; break; }
//   if prime count++;  return count.`,
      },
      {
        name: "Sieve of Eratosthenes (optimal)",
        intuition:
          "Cross off multiples of each prime starting at p*p; sieve only up to √n; count survivors.",
        time: "O(n log log n)",
        timeWhy: "Each prime p crosses off ~n/p numbers; the harmonic-over-primes sum is n log log n.",
        space: "O(n)",
        spaceWhy: "A boolean array of size n.",
        code: `int countPrimes(int n) {
    if (n < 3) return 0;                     // no primes below 2
    boolean[] composite = new boolean[n];    // composite[i] == true means i is not prime
    int count = 0;
    for (int p = 2; (long) p * p < n; p++) {
        if (!composite[p]) {
            for (int m = p * p; m < n; m += p) composite[m] = true;  // cross off multiples
        }
    }
    for (int i = 2; i < n; i++) {
        if (!composite[i]) count++;
    }
    return count;
}`,
        walkthrough: [
          "n=10. composite all false. p=2 (2*2=4<10): mark 4,6,8. p=3 (9<10): mark 9. p=4: 16≥10 stop sieving.",
          "Survivors in 2..9: 2,3,5,7 → count = 4.",
        ],
      },
    ],
    edgeCases: [
      "n = 0, 1, 2 → 0 (no prime is strictly less than 2).",
      "The `(long) p * p` guard prevents `p*p` overflowing int near the upper bound.",
      "Crossing off from `p*p` (not `2p`) avoids redundant marking but never misses a composite.",
    ],
    twists: [
      "**Return the primes themselves**, not just the count → collect the survivors.",
      "**Memory-tight n** → a segmented sieve processes ranges in blocks to cut space.",
      "**Smallest prime factor of every number** → store the prime that first marks each index instead of a boolean.",
    ],
    related: ["happy-number", "palindrome-number"],
  },

  {
    slug: "excel-sheet-column-number",
    title: "Excel Sheet Column Number",
    difficulty: "Easy",
    pattern: "math-geometry",
    leetcode: 171,
    statement:
      "Given an Excel column title (`A`, `B`, ..., `Z`, `AA`, `AB`, ...), return its corresponding column number. `A → 1`, `Z → 26`, `AA → 27`.",
    examples: [
      { in: 'columnTitle = "A"', out: "1" },
      { in: 'columnTitle = "AB"', out: "28", note: "26·1 + 2" },
      { in: 'columnTitle = "ZY"', out: "701", note: "26·26 + 25" },
    ],
    constraints: ["1 ≤ columnTitle.length ≤ 7", "columnTitle is uppercase A–Z", "result is in [1, 2³¹ − 1]"],
    recognize:
      "It's **base-26 with no zero** (digits run 1..26, not 0..25). 'Convert a positional string to a number' → Horner's method: `result = result * base + digit`.",
    figureItOut: [
      "This is just **positional notation**, like reading a decimal number — except the base is 26 and each letter is a digit. `A`=1, `B`=2, ..., `Z`=26.",
      "The one twist: it's **bijective base-26**, meaning there's no zero digit — the digits are 1..26, not 0..25. That's why `Z` is 26 and the next column `AA` is 27, not a carry to `10`. Conveniently, the standard left-to-right accumulation still works exactly.",
      "Process the string left to right (most significant letter first). Maintain `result`, and for each letter do `result = result * 26 + value(letter)`, where `value = letter - 'A' + 1`.",
      "This is **Horner's method**: each step multiplies the running total by the base (shifting everything one place up) and adds the new least-significant digit. Same as reading '123' as ((1·10+2)·10+3).",
      "After the last letter, `result` holds the column number. Lengths are ≤ 7 so it fits comfortably in an int.",
    ],
    approaches: [
      {
        name: "Horner's method — base-26 accumulation (optimal)",
        intuition:
          "Read letters left to right; each step multiplies the total by 26 and adds the letter's 1-based value.",
        time: "O(n)",
        timeWhy: "One pass over the n letters.",
        space: "O(1)",
        spaceWhy: "A single accumulator.",
        code: `int titleToNumber(String columnTitle) {
    int result = 0;
    for (int i = 0; i < columnTitle.length(); i++) {
        int digit = columnTitle.charAt(i) - 'A' + 1;   // A=1 ... Z=26
        result = result * 26 + digit;                  // shift up a place, add this digit
    }
    return result;
}`,
        walkthrough: [
          "ZY: result=0. Z → 26: result=0*26+26=26. Y → 25: result=26*26+25=676+25=701.",
          "AB: result=0. A → 1: result=1. B → 2: result=1*26+2=28.",
        ],
      },
    ],
    edgeCases: [
      "Single letter → its 1-based value (A=1, Z=26).",
      "All Z's (ZZ = 702) → the bijective base means no carry surprises.",
      "Max length 7 stays within int range per the constraints.",
    ],
    twists: [
      "**Column number to title** (LeetCode 168) → the inverse; subtract 1 before each `% 26` to handle the missing zero.",
      "**General bijective base-k** → replace 26 with k and the A-offset accordingly.",
      "**Lowercase or mixed alphabet** → adjust the digit mapping.",
    ],
    related: ["roman-to-integer", "plus-one"],
  },

  // ───────────────────────────── BIT MANIPULATION ─────────────────────────────
  {
    slug: "add-binary",
    title: "Add Binary",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 67,
    statement:
      "Given two binary strings `a` and `b`, return their sum as a binary string.",
    examples: [
      { in: 'a = "11", b = "1"', out: '"100"' },
      { in: 'a = "1010", b = "1011"', out: '"10101"' },
    ],
    constraints: ["1 ≤ a.length, b.length ≤ 10⁴", "consist of only '0' and '1'", "no leading zeros except \"0\" itself"],
    recognize:
      "Add two numbers digit by digit with a **carry** — grade-school addition, base 2. The strings can be 10⁴ long, so you can't parse to a number; you add character columns from the right.",
    figureItOut: [
      "The strings are up to 10⁴ bits — far beyond what a `long` (64 bits) or even `int` holds — so you **can't** convert to a number and add. You must add column by column, exactly like adding decimal numbers by hand, but in base 2.",
      "Start at the **rightmost** bit of each string and walk leftward. At each column, sum the two bits plus the incoming `carry`.",
      "In base 2, that column sum is 0, 1, 2, or 3. The bit you write is `sum % 2`; the carry into the next column is `sum / 2`. (Sum 2 → write 0 carry 1; sum 3 → write 1 carry 1.)",
      "Handle different lengths by treating a missing bit as 0 — keep going while *either* index is valid, or there's still a carry to place.",
      "You build the result right-to-left, so either prepend each bit or append and **reverse** at the end. A leftover carry after both strings are exhausted becomes the leading 1.",
    ],
    approaches: [
      {
        name: "Column addition with carry (optimal)",
        intuition:
          "Two indices from the right; add bits plus carry each step, write sum%2, carry sum/2; reverse at the end.",
        time: "O(max(m, n))",
        timeWhy: "One pass over the longer string's length.",
        space: "O(max(m, n))",
        spaceWhy: "The result string, one bit per column.",
        code: `String addBinary(String a, String b) {
    StringBuilder sb = new StringBuilder();
    int i = a.length() - 1, j = b.length() - 1, carry = 0;
    while (i >= 0 || j >= 0 || carry > 0) {
        int sum = carry;
        if (i >= 0) sum += a.charAt(i--) - '0';
        if (j >= 0) sum += b.charAt(j--) - '0';
        sb.append(sum % 2);     // bit written this column
        carry = sum / 2;        // carry into the next column
    }
    return sb.reverse().toString();
}`,
        walkthrough: [
          'a="1010", b="1011". col0: 0+1+0=1 write1 carry0. col1: 1+1=2 write0 carry1. col2: 0+0+1=1 write1 carry0. col3: 1+1=2 write0 carry1.',
          "no bits left, carry1 → write1. Built '10101' (after reverse) → \"10101\".",
        ],
      },
    ],
    edgeCases: [
      'Both "0" → "0".',
      "Very different lengths → the shorter is padded with implicit 0s via the `i >= 0` / `j >= 0` guards.",
      "Final carry past the most significant bit (e.g. \"1\" + \"1\" = \"10\") → the `carry > 0` loop condition emits it.",
    ],
    twists: [
      "**Add two numbers as linked lists** (LeetCode 2 / 445) → same carry logic, traversing nodes.",
      "**Add strings in base 10** (LeetCode 415) → identical structure with `% 10` and `/ 10`.",
      "**Multiply binary strings** → repeated shift-and-add, building on this.",
    ],
    related: ["plus-one", "sum-of-two-integers"],
  },

  {
    slug: "power-of-two",
    title: "Power of Two",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 231,
    statement:
      "Given an integer `n`, return `true` if it is a power of two — i.e. `n == 2^x` for some non-negative integer `x`.",
    examples: [
      { in: "n = 1", out: "true", note: "2^0" },
      { in: "n = 16", out: "true", note: "2^4" },
      { in: "n = 3", out: "false" },
    ],
    constraints: ["−2³¹ ≤ n ≤ 2³¹ − 1"],
    recognize:
      "A power of two has **exactly one set bit** in binary. 'Is there exactly one 1 bit?' is the classic `n & (n-1) == 0` trick — clearing the lowest set bit.",
    figureItOut: [
      "Write powers of two in binary: 1 = `0001`, 2 = `0010`, 4 = `0100`, 8 = `1000`. The pattern jumps out — each is **exactly one set bit**. So the question becomes: does `n` have precisely one 1 bit?",
      "The obvious approach: count the set bits and check it's exactly one. Correct, O(number of bits). But there's a slicker O(1) trick.",
      "Consider `n - 1`. Subtracting 1 from a number flips its lowest set bit to 0 and turns all the zeros below it into ones. For `8 = 1000`, `n-1 = 0111`. Notice they share **no** bits.",
      "So `n & (n - 1)` clears the lowest set bit. If `n` had exactly one set bit, clearing it gives **0**. If it had more, some higher bit survives and the result is non-zero.",
      "Two guards: `n` must be **positive** (zero and negatives aren't powers of two; in two's complement the sign bit would fool the trick). With `n > 0 && (n & (n - 1)) == 0`, you're done in O(1).",
    ],
    approaches: [
      {
        name: "Count set bits",
        intuition: "A power of two has exactly one 1 bit, so its population count is 1.",
        time: "O(1)",
        timeWhy: "At most 32 bit checks for a fixed-width int.",
        space: "O(1)",
        spaceWhy: "No extra storage.",
        code: `boolean isPowerOfTwo(int n) {
    return n > 0 && Integer.bitCount(n) == 1;
}`,
      },
      {
        name: "Clear the lowest set bit (optimal trick)",
        intuition:
          "n & (n-1) erases the lowest set bit; for a power of two that empties the whole number to 0.",
        time: "O(1)",
        timeWhy: "A single subtraction and AND.",
        space: "O(1)",
        spaceWhy: "No extra storage.",
        code: `boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
        walkthrough: [
          "n=16 (10000): n-1=15 (01111). 10000 & 01111 = 00000 == 0, and 16>0 → true.",
          "n=3 (011): n-1=2 (010). 011 & 010 = 010 != 0 → false.",
        ],
      },
    ],
    edgeCases: [
      "n = 0 → false (no set bits; the `n > 0` guard catches it).",
      "Negative n → false; without the `n > 0` guard, e.g. `Integer.MIN_VALUE` would slip through the AND trick.",
      "n = 1 → true (2^0; `1 & 0 == 0`).",
    ],
    twists: [
      "**Power of four** (LeetCode 342) → one set bit AND that bit in an even position (mask `0x55555555`).",
      "**Power of three** (LeetCode 326) → no bit trick; check divisibility against the largest power-of-three that fits.",
      "**Is n a power of any k** → repeated division by k.",
    ],
    related: ["number-of-1-bits", "single-number"],
  },

  {
    slug: "bitwise-and-of-numbers-range",
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    pattern: "bit-manipulation",
    leetcode: 201,
    statement:
      "Given two integers `left` and `right`, return the bitwise AND of **all** numbers in the inclusive range `[left, right]`.",
    examples: [
      { in: "left = 5, right = 7", out: "4", note: "5 & 6 & 7 = 4" },
      { in: "left = 0, right = 0", out: "0" },
      { in: "left = 1, right = 2147483647", out: "0" },
    ],
    constraints: ["0 ≤ left ≤ right ≤ 2³¹ − 1"],
    recognize:
      "ANDing a whole range — the answer is the **common binary prefix** of `left` and `right`. 'Which high bits stay 1 across the range?' → shift both right until they agree.",
    figureItOut: [
      "ANDing many numbers only keeps a bit set if it's 1 in **every** number of the range. Looping `left..right` and ANDing works but can be billions of iterations — far too slow.",
      "Think about any bit position. Within a range `[left, right]`, the **low** bits flip 0/1 repeatedly as you count up, so somewhere in the range that bit is 0 — meaning it ANDs away to 0. Only the **high bits that never change** across the range can survive.",
      "The bits that never change are exactly the **common binary prefix** of `left` and `right`. Everything to the right of where `left` and `right` first differ gets zeroed.",
      "So strip off the differing low bits. Repeatedly shift **both** `left` and `right` right by one until they're equal — at that point you've found the shared prefix. Count the shifts.",
      "Then shift that common value back left by the number of shifts, refilling the cleared low bits with zeros. That's the answer.",
    ],
    approaches: [
      {
        name: "Shift to the common prefix (optimal)",
        intuition:
          "Shift left and right right-ward until equal — that common value is the surviving prefix — then shift it back.",
        time: "O(log max)",
        timeWhy: "At most 32 shifts (one per differing bit) for a 32-bit int.",
        space: "O(1)",
        spaceWhy: "A shift counter.",
        code: `int rangeBitwiseAnd(int left, int right) {
    int shift = 0;
    while (left < right) {     // strip differing low bits
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;      // refill the cleared low bits with 0
}`,
        walkthrough: [
          "left=5 (101), right=7 (111). 101!=111 → shift1: 10,11. 10!=11 → shift2: 1,1. equal.",
          "common=1 (binary 1), shift=2 → 1 << 2 = 100 = 4.",
        ],
      },
      {
        name: "Brent-Kung style — clear lowest bit of right (alternative)",
        intuition:
          "Repeatedly drop right's lowest set bit until right ≤ left; the result equals left & right.",
        time: "O(log max)",
        timeWhy: "Each step removes one set bit from right.",
        space: "O(1)",
        spaceWhy: "No extra storage.",
        code: `int rangeBitwiseAnd(int left, int right) {
    while (left < right) {
        right &= (right - 1);   // clear the lowest set bit of right
    }
    return right & left;
}`,
      },
    ],
    edgeCases: [
      "left == right → the AND of a single number is itself (loop never runs).",
      "Range spanning a power of two (e.g. [1, 2³¹−1]) → high bits all differ → result 0.",
      "left = 0 → AND with 0 anywhere in the range forces 0.",
    ],
    twists: [
      "**Bitwise OR of the range** → the OR fills every bit that ever turns on; a different prefix argument.",
      "**XOR of the range** (related to LeetCode 1486) → use the prefix-XOR formula `f(right) ^ f(left-1)`.",
      "**Range AND of a huge range mod something** → still the prefix, no modular subtlety.",
    ],
    related: ["number-of-1-bits", "power-of-two"],
  },

  {
    slug: "number-complement",
    title: "Number Complement",
    difficulty: "Easy",
    pattern: "bit-manipulation",
    leetcode: 476,
    statement:
      "The complement of an integer flips every bit in its binary representation. Given a positive integer `num`, return its complement — flipping only the bits **within its own bit-length** (no leading zeros).",
    examples: [
      { in: "num = 5", out: "2", note: "101 → 010 = 2" },
      { in: "num = 1", out: "0", note: "1 → 0" },
    ],
    constraints: ["1 ≤ num ≤ 2³¹ − 1"],
    recognize:
      "Flip only the bits up to the highest set bit, not the whole 32-bit word. The trick is building a **mask of all 1s the width of num**, then XORing — XOR with 1 flips a bit.",
    figureItOut: [
      "The naive `~num` flips **all 32 bits**, including the leading zeros — so `~5` isn't 2, it's a big negative number. We only want to flip bits within num's *own* width (101 → 010), leaving the leading zeros alone.",
      "XOR is the bit-flipper: `bit ^ 1` flips a bit, `bit ^ 0` leaves it. So if we XOR `num` with a mask that's **1 exactly where num has bits and 0 above**, we flip only the bits we care about.",
      "So the task reduces to building that mask: a run of 1s the same width as num. For `5 = 101` (3 bits) the mask is `111`.",
      "One clean way: find num's bit-length `len` (the position of its highest set bit), then `mask = (1 << len) - 1`. `1 << 3 = 1000`, minus 1 = `0111`. (Use a `long`/careful shift so widths near 31 don't overflow.)",
      "Answer is `num ^ mask`. For 5: `101 ^ 111 = 010 = 2`.",
    ],
    approaches: [
      {
        name: "Build a full-width mask, XOR (optimal)",
        intuition:
          "Make a mask of all 1s as wide as num, then XOR — XOR with 1 flips each in-range bit, the leading zeros stay zero.",
        time: "O(1)",
        timeWhy: "Constant number of bit operations for a fixed-width int.",
        space: "O(1)",
        spaceWhy: "A couple of scalars.",
        code: `int findComplement(int num) {
    int len = Integer.toBinaryString(num).length();  // bit-length of num
    int mask = (int) ((1L << len) - 1);              // 'len' ones, e.g. 101 -> 111
    return num ^ mask;
}`,
        walkthrough: [
          "num=5 → binary \"101\", len=3. mask = (1<<3)-1 = 8-1 = 7 = 111.",
          "5 ^ 7 = 101 ^ 111 = 010 = 2.",
        ],
      },
      {
        name: "Grow the mask bit by bit (no string)",
        intuition:
          "Start mask=0 and keep OR-ing in 1s and shifting while it's still narrower than num, then XOR.",
        time: "O(log num)",
        timeWhy: "One step per bit of num.",
        space: "O(1)",
        spaceWhy: "A mask variable.",
        code: `int findComplement(int num) {
    int mask = 0;
    int t = num;
    while (t > 0) {
        mask = (mask << 1) | 1;   // append a 1 to the mask for each bit of num
        t >>= 1;
    }
    return num ^ mask;
}`,
      },
    ],
    edgeCases: [
      "num = 1 → mask 1 → 1 ^ 1 = 0.",
      "All bits set within width (e.g. 7 = 111) → mask 111 → complement 0.",
      "Large num near 2³¹−1 → use `1L << len` (a long) so the shift doesn't overflow a 32-bit int.",
    ],
    twists: [
      "**Complement of Base 10 Integer** (LeetCode 1009) → identical logic, same mask-and-XOR.",
      "**Flip including leading zeros to 32 bits** → just return `~num` (the standard complement).",
      "**Toggle a specific bit** → XOR with `1 << k` instead of a full mask.",
    ],
    related: ["single-number", "number-of-1-bits"],
  },
];
