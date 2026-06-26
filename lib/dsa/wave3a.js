// NeetCode 150 — wave 3a (graphs). Java.
export const WAVE3A = [
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 200,
    statement:
      "Given a 2-D grid of `'1'` (land) and `'0'` (water), return the **number of islands**. An island is land connected **4-directionally** (up/down/left/right) and surrounded by water.",
    examples: [
      {
        in: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        out: "2",
        note: "the top-left blob, plus the lone cell at the bottom-right",
      },
      {
        in: 'grid = [["1","1","1"],["1","1","1"]]',
        out: "1",
        note: "all land is one connected piece",
      },
    ],
    constraints: ["1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
    recognize:
      "A grid where you must count **connected regions** of the same value → **flood fill**. Each unvisited land cell starts a new region; a DFS/BFS from it 'paints' the whole island so you never count it twice. Think of the grid as a graph where each cell connects to its 4 neighbours.",
    figureItOut: [
      "First reframe the grid as a graph: every land cell is a node, and two land cells are connected if they're orthogonally adjacent. 'Number of islands' is then just 'number of **connected components** of land'.",
      "How do you count connected components? Walk the whole grid. Each time you bump into a land cell you **haven't visited yet**, that must be the start of a brand-new island — so add 1 to the count.",
      "But then you must not count the *rest* of that same island again. The fix: from that starting cell, **flood the entire island** — visit every connected land cell and mark it seen. After the flood, the whole island is consumed, and the outer scan won't re-trigger on it.",
      "Marking 'seen' can be a separate visited array, or — cheaper — overwrite each visited land cell to `'0'` in place, so it reads as water and is never revisited.",
      "DFS (recursion / explicit stack) or BFS (queue) both flood correctly; the choice only affects memory shape. The total work is one visit per cell either way.",
    ],
    approaches: [
      {
        name: "DFS flood fill (sink each island)",
        intuition:
          "Scan for an unvisited land cell; that's a new island (+1). DFS out from it, sinking every connected land cell to '0' so it's never counted again.",
        time: "O(m·n)",
        timeWhy:
          "Every cell is looked at a constant number of times — the outer scan touches each once, and each cell is flooded at most once across all DFS calls.",
        space: "O(m·n)",
        spaceWhy:
          "The recursion stack can go as deep as the number of cells in the worst case (a grid that is entirely land snakes into one long DFS chain).",
        code: `int numIslands(char[][] grid) {
    int count = 0;
    for (int r = 0; r < grid.length; r++) {
        for (int c = 0; c < grid[0].length; c++) {
            if (grid[r][c] == '1') {
                count++;          // a fresh, unvisited island
                sink(grid, r, c); // flood it so we never recount
            }
        }
    }
    return count;
}

void sink(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return;
    if (grid[r][c] != '1') return;   // water or already-sunk land
    grid[r][c] = '0';                // mark visited in place
    sink(grid, r + 1, c);
    sink(grid, r - 1, c);
    sink(grid, r, c + 1);
    sink(grid, r, c - 1);
}`,
        walkthrough: [
          "Scan reaches (0,0)='1' → count=1, DFS sinks the whole top-left blob: (0,0),(0,1),(1,0) all become '0'.",
          "Scan continues; everything in that blob now reads '0', so it never re-triggers.",
          "Scan reaches (2,2)='1' → count=2, DFS sinks just that one cell. End of grid → return 2.",
        ],
      },
      {
        name: "BFS flood fill (queue instead of recursion)",
        intuition:
          "Same idea, but flood each island with a queue. Avoids deep recursion — safer for a huge all-land grid.",
        time: "O(m·n)",
        timeWhy: "Each cell is enqueued and dequeued at most once.",
        space: "O(min(m, n))",
        spaceWhy:
          "The BFS frontier (queue) holds at most a diagonal-ish band of the island, bounded by the smaller dimension — gentler than DFS's worst-case stack.",
        code: `int numIslands(char[][] grid) {
    int count = 0, m = grid.length, n = grid[0].length;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] != '1') continue;
            count++;
            Queue<int[]> q = new ArrayDeque<>();
            grid[r][c] = '0';
            q.add(new int[]{r, c});
            while (!q.isEmpty()) {
                int[] cell = q.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
                    if (grid[nr][nc] != '1') continue;
                    grid[nr][nc] = '0';      // mark on enqueue, not dequeue
                    q.add(new int[]{nr, nc});
                }
            }
        }
    }
    return count;
}`,
        walkthrough: [
          "Mark a cell '0' the moment you enqueue it (not when you poll it) — otherwise the same cell gets added by two neighbours and you double-process.",
        ],
      },
    ],
    edgeCases: [
      "Single cell '1' → one island; single cell '0' → zero islands.",
      "Whole grid is land → exactly 1 island (and the deepest DFS — watch stack depth, prefer BFS).",
      "Diagonal-only touching cells are NOT connected (4-directional only) → they count as separate islands.",
    ],
    twists: [
      "**Count the area / largest island** → instead of just +1, have the flood return how many cells it painted (see Max Area of Island).",
      "**Diagonals also connect (8-directional)** → add the 4 diagonal moves to your direction list.",
      "**Don't mutate the input** → keep a separate `boolean[][] visited` instead of overwriting to '0'.",
      "**Streaming / union queries (Number of Islands II)** → use union-find, merging components as land is added one cell at a time.",
    ],
    related: ["max-area-of-island", "surrounded-regions", "number-of-connected-components-in-an-undirected-graph"],
  },

  {
    slug: "max-area-of-island",
    title: "Max Area of Island",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 695,
    statement:
      "Given a 2-D grid of `0` (water) and `1` (land), return the **area of the largest island** (count of connected land cells, 4-directionally). If there is no land, return `0`.",
    examples: [
      {
        in: "grid = [[0,0,1,0],[1,1,1,0],[0,1,0,0]]",
        out: "5",
        note: "the connected blob in the middle has 5 land cells",
      },
      { in: "grid = [[0,0,0],[0,0,0]]", out: "0", note: "no land at all" },
    ],
    constraints: ["1 ≤ m, n ≤ 50", "grid[i][j] is 0 or 1"],
    recognize:
      "Same **flood fill** as Number of Islands, but instead of counting *how many* islands, each flood **measures the size** of its island and you keep the maximum. The moment a grid problem says 'largest connected region', the flood should return a count.",
    figureItOut: [
      "Start from what changes versus counting islands: there, each flood just signalled 'one island exists'. Here you care about its **size**, so the flood must return a number — the count of cells it painted.",
      "An island's area is naturally **1 (this cell) + the areas of the four neighbour floods**. That's a recursive sum: a DFS that returns an int.",
      "A cell off the grid, or water, or already-visited contributes **0** — those are the base cases that stop the recursion and keep you from double-counting.",
      "Mark each land cell visited (sink it to 0) the instant you enter it, *before* recursing into neighbours, so two recursive branches can't both claim the same cell.",
      "Scan every cell; each land cell you haven't sunk yet kicks off a fresh flood whose returned area you compare against the running max.",
    ],
    approaches: [
      {
        name: "DFS returning area",
        intuition:
          "A DFS that returns 1 + the areas of its four neighbours. Each unvisited land cell starts a flood; keep the largest area returned.",
        time: "O(m·n)",
        timeWhy:
          "Every cell is visited at most once across all floods; the outer scan adds one constant-time touch per cell.",
        space: "O(m·n)",
        spaceWhy: "Recursion depth is bounded by the number of land cells in one island (worst case all cells).",
        code: `int maxAreaOfIsland(int[][] grid) {
    int best = 0;
    for (int r = 0; r < grid.length; r++)
        for (int c = 0; c < grid[0].length; c++)
            if (grid[r][c] == 1)
                best = Math.max(best, area(grid, r, c));
    return best;
}

int area(int[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length) return 0;
    if (grid[r][c] == 0) return 0;          // water or already counted
    grid[r][c] = 0;                          // sink before recursing
    return 1
        + area(grid, r + 1, c)
        + area(grid, r - 1, c)
        + area(grid, r, c + 1)
        + area(grid, r, c - 1);
}`,
        walkthrough: [
          "Hit the middle blob's first land cell → flood returns 1 + neighbours. The 5 connected cells each contribute 1 → total 5.",
          "Every other land patch is smaller, so best stays 5 → return 5.",
        ],
      },
    ],
    edgeCases: [
      "No land anywhere → max stays 0.",
      "Single land cell → area 1.",
      "The whole grid is one island → area = m·n (and the deepest recursion — consider an explicit stack/BFS for very large grids).",
    ],
    twists: [
      "**Count islands instead of size** → drop the returned area, just +1 per flood (Number of Islands).",
      "**Sum of all island areas / number of distinct island shapes (LeetCode 694)** → record the relative path of each flood and hash it.",
      "**Allowed to flip one 0 to 1 for the biggest island (LeetCode 827)** → label each island with an id + size, then test every water cell's distinct island neighbours.",
    ],
    related: ["number-of-islands", "surrounded-regions"],
  },

  {
    slug: "clone-graph",
    title: "Clone Graph",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 133,
    statement:
      "Given a reference to a node in a **connected undirected graph**, return a **deep copy** (clone). Each node holds an `int val` and a `List<Node> neighbors`. The clone must be a completely independent graph with the same structure.",
    examples: [
      {
        in: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        out: "[[2,4],[1,3],[2,4],[1,3]]",
        note: "4 nodes in a square; the returned copy mirrors the structure but shares no objects with the input",
      },
      { in: "adjList = [[]]", out: "[[]]", note: "one node, no neighbours" },
      { in: "adjList = []", out: "[]", note: "empty graph → null input → null output" },
    ],
    constraints: ["0 ≤ number of nodes ≤ 100", "1 ≤ Node.val ≤ 100, values are unique", "the graph is connected and undirected (no self-loops, no repeated edges)"],
    recognize:
      "You must traverse a graph **and** build a parallel structure as you go. The signature trap is **cycles** (undirected edges are 2-way) — so this is a graph traversal (DFS/BFS) with a **visited map from original node → its clone** that doubles as your cycle guard.",
    figureItOut: [
      "Cloning a tree would be easy: copy a node, recurse into children, done — no node is reached twice. A general graph breaks that because edges form **cycles**, so a naive recursion would clone the same node endlessly (A→B→A→B…).",
      "So you need to answer one question fast: *'have I already created the clone for this original node?'* That's a **hash map keyed by the original node**, whose value is its clone.",
      "The map does double duty. It's the memo that lets you reuse an existing clone, AND it's your 'visited' set that stops the cycle — the same trick that makes both jobs one data structure.",
      "Algorithm: to clone a node, if it's already in the map return that clone. Otherwise create its clone first, **put it in the map immediately** (before recursing!), then clone each neighbour and wire them into the new node's neighbour list.",
      "Putting the clone in the map *before* recursing is the crux: when a neighbour's recursion loops back to this node, it finds the in-progress clone in the map and links to it instead of cloning again — that's what terminates the cycle.",
    ],
    approaches: [
      {
        name: "DFS with an original→clone map",
        intuition:
          "Recursively clone. Map each original node to its clone; register the clone before recursing so cycles resolve to the existing copy.",
        time: "O(V + E)",
        timeWhy:
          "Each node is cloned once (V), and each undirected edge is walked from both endpoints (2E) while wiring neighbour lists — linear in the graph size.",
        space: "O(V)",
        spaceWhy: "The map holds one entry per node, plus recursion depth up to V.",
        code: `// class Node { int val; List<Node> neighbors; }

Map<Node, Node> clones = new HashMap<>();

Node cloneGraph(Node node) {
    if (node == null) return null;
    if (clones.containsKey(node)) return clones.get(node);  // already cloned → reuse

    Node copy = new Node(node.val);
    clones.put(node, copy);          // register BEFORE recursing — breaks cycles
    for (Node nei : node.neighbors) {
        copy.neighbors.add(cloneGraph(nei));
    }
    return copy;
}`,
        walkthrough: [
          "Clone node 1 → make copy1, map{1→copy1}. Recurse into neighbour 2.",
          "Clone 2 → copy2, map{1→copy1, 2→copy2}. Neighbour 1 is already in the map → reuse copy1 (cycle broken). Then neighbour 3 clones similarly.",
          "Unwinding wires copy1.neighbors=[copy2,copy4], etc. Returned graph shares no nodes with the input.",
        ],
      },
      {
        name: "BFS with a queue + clone map",
        intuition:
          "Create the first clone, then BFS the original graph; for each frontier node, ensure each neighbour's clone exists (create on first sight) and link it.",
        time: "O(V + E)",
        timeWhy: "Every node dequeued once; every edge examined while building neighbour lists.",
        space: "O(V)",
        spaceWhy: "The map and the queue each hold O(V) nodes.",
        code: `Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> clones = new HashMap<>();
    clones.put(node, new Node(node.val));
    Queue<Node> q = new ArrayDeque<>();
    q.add(node);
    while (!q.isEmpty()) {
        Node cur = q.poll();
        for (Node nei : cur.neighbors) {
            if (!clones.containsKey(nei)) {       // first time we see this node
                clones.put(nei, new Node(nei.val));
                q.add(nei);
            }
            clones.get(cur).neighbors.add(clones.get(nei));  // wire the copies
        }
    }
    return clones.get(node);
}`,
          walkthrough: [
            "Seed the map with the start node's clone before the loop so the very first node isn't re-created.",
            "Each neighbour is cloned exactly once (only when missing from the map) and added to the queue, mirroring the DFS guarantee without recursion.",
          ],
      },
    ],
    edgeCases: [
      "`null` input (empty graph) → return `null` — the very first guard.",
      "Single node with an empty neighbour list → clone it; the loop never runs.",
      "Self-loop (a node listing itself) → the map check returns the in-progress clone, so it links to itself correctly.",
      "Registering the clone AFTER the neighbour loop instead of before → infinite recursion on any cycle (the classic bug).",
    ],
    twists: [
      "**Directed graph (not guaranteed connected)** → start a clone/BFS from every unvisited node so disconnected components are all copied.",
      "**Copy a linked list with random pointers (LeetCode 138)** → same original→clone map technique, two passes.",
      "**Serialize then deserialize** → an alternative way to deep-copy by turning the graph into text and rebuilding.",
    ],
    related: ["number-of-islands", "course-schedule"],
  },

  {
    slug: "walls-and-gates",
    title: "Walls and Gates",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 286,
    statement:
      "An m×n grid has three values: `-1` = a wall, `0` = a gate, and `2147483647` (INF) = an empty room. Fill each empty room with the **distance to its nearest gate** (4-directional steps). If a room cannot reach any gate, leave it as INF.",
    examples: [
      {
        in: "grid = [[INF,-1,0,INF],[INF,INF,INF,-1],[INF,-1,INF,-1],[0,-1,INF,INF]]",
        out: "[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]",
        note: "each room now holds the step-count to the closest gate; walls and gates unchanged",
      },
    ],
    constraints: ["1 ≤ m, n ≤ 250", "grid[i][j] is -1, 0, or 2147483647"],
    recognize:
      "'Nearest gate to every room' = shortest distance from **many sources** at once, in an unweighted grid → **multi-source BFS**. Seeding the queue with *all* gates and expanding in lockstep gives every room its closest gate in one sweep — far better than a separate BFS per room.",
    figureItOut: [
      "The brute-force instinct is: from each empty room, BFS outward until you hit a gate. That's a BFS per room — O((m·n)²) — and it re-explores the same cells endlessly.",
      "Flip the direction. Instead of asking each room 'where's my nearest gate?', start **from the gates** and let distance spread outward. A cell first *reached* from some gate is, by BFS's nature, reached by the closest gate.",
      "But there are many gates. If you BFS from each gate separately you'd still overpay and have to take the min. The insight: put **every gate into the queue at once** at distance 0, then BFS. All gates expand simultaneously, ring by ring.",
      "Because BFS processes cells in nondecreasing distance order, the **first** time a room is written, that value is already its true minimum — so you never overwrite it, and 'already visited' is simply 'value is no longer INF'.",
      "Walls (-1) are never enqueued, so they block the spread naturally. Rooms unreachable from any gate are never touched and stay INF — exactly the required behaviour.",
    ],
    approaches: [
      {
        name: "Multi-source BFS from all gates",
        intuition:
          "Enqueue every gate at distance 0. BFS outward; the first time a room is reached, write parent+1. Walls block; never revisit.",
        time: "O(m·n)",
        timeWhy:
          "Each cell is enqueued at most once and we examine its 4 neighbours — linear in the number of cells, regardless of how many gates there are.",
        space: "O(m·n)",
        spaceWhy: "The queue can hold up to all cells in the worst case (a grid full of gates).",
        code: `void wallsAndGates(int[][] rooms) {
    int m = rooms.length, n = rooms[0].length, INF = Integer.MAX_VALUE;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    Queue<int[]> q = new ArrayDeque<>();
    for (int r = 0; r < m; r++)               // seed ALL gates
        for (int c = 0; c < n; c++)
            if (rooms[r][c] == 0) q.add(new int[]{r, c});

    while (!q.isEmpty()) {
        int[] cell = q.poll();
        int r = cell[0], c = cell[1];
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
            if (rooms[nr][nc] != INF) continue;   // wall, gate, or already filled
            rooms[nr][nc] = rooms[r][c] + 1;       // first reach = shortest
            q.add(new int[]{nr, nc});
        }
    }
}`,
        walkthrough: [
          "Both gates start in the queue at distance 0. The wave expands one ring at a time.",
          "A room adjacent to a gate is reached first at distance 1; its neighbours at distance 2; and so on.",
          "`rooms[nr][nc] != INF` is the visited check: any room already filled (or a wall/gate) is skipped, so each cell is written exactly once with its minimum.",
        ],
      },
    ],
    edgeCases: [
      "No gates at all → queue starts empty → every room stays INF.",
      "A room walled off from every gate → never reached → stays INF (correct).",
      "Seeding gates one-at-a-time with separate BFS still works but is far slower — the single shared queue is the whole point.",
    ],
    twists: [
      "**Rotting Oranges (LeetCode 994)** → identical multi-source BFS, but you track the final ring number (the elapsed time) instead of writing per-cell distances.",
      "**01 Matrix (LeetCode 542)** → distance to nearest 0 for every cell — same multi-source BFS seeded with all zeros.",
      "**Weighted edges (costs differ)** → BFS no longer suffices; use Dijkstra with a min-heap.",
    ],
    related: ["rotting-oranges", "number-of-islands"],
  },

  {
    slug: "rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 994,
    statement:
      "In a grid, `0` = empty, `1` = fresh orange, `2` = rotten orange. Each minute, every fresh orange **4-directionally adjacent** to a rotten one becomes rotten. Return the **minimum minutes** until no fresh orange remains, or `-1` if some fresh orange can never rot.",
    examples: [
      { in: "grid = [[2,1,1],[1,1,0],[0,1,1]]", out: "4", note: "rot spreads outward; the last orange turns at minute 4" },
      { in: "grid = [[2,1,1],[0,1,1],[1,0,1]]", out: "-1", note: "the bottom-left fresh orange is isolated → never rots" },
      { in: "grid = [[0,2]]", out: "0", note: "no fresh oranges to begin with → 0 minutes" },
    ],
    constraints: ["1 ≤ m, n ≤ 10", "grid[i][j] is 0, 1, or 2"],
    recognize:
      "Rot spreads outward **one ring per minute** from multiple starting points simultaneously → **multi-source BFS**, where the answer is the number of BFS levels (minutes elapsed). The '-1 if some stay fresh' clause is the giveaway that you must also confirm everything got reached.",
    figureItOut: [
      "Watch the physics: at minute 1, all oranges touching an *initial* rotten one rot together. At minute 2, their neighbours rot. The rot expands in synchronized rings — that's exactly BFS level-by-level, and there are many sources.",
      "So seed the queue with **every initially rotten orange** at once (time 0). Then process the BFS **level by level**: each full level you complete is one minute ticking by.",
      "Count fresh oranges up front. Each time the rot reaches a fresh orange, turn it rotten and decrement that count. This lets you answer the trickiest part cheaply.",
      "When BFS finishes, ask: did every fresh orange rot? If the remaining-fresh count is **> 0**, some orange was unreachable → return **-1**. Otherwise return the number of minutes (BFS levels) that elapsed.",
      "Careful with the minute count: you advance the clock only when there *is* a next level with fresh oranges to rot. Process one batch (one snapshot of the queue) per minute so you don't over- or under-count.",
    ],
    approaches: [
      {
        name: "Level-by-level multi-source BFS",
        intuition:
          "Queue every rotten orange. Each BFS level = one minute; rot all current-frontier neighbours, decrement the fresh count. At the end, leftover fresh → -1.",
        time: "O(m·n)",
        timeWhy:
          "Each cell is enqueued at most once and its 4 neighbours checked — linear in the grid; the initial scan to seed and count is also O(m·n).",
        space: "O(m·n)",
        spaceWhy: "The queue can hold up to all cells (a grid full of rotten oranges).",
        code: `int orangesRotting(int[][] grid) {
    int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    Queue<int[]> q = new ArrayDeque<>();
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 2) q.add(new int[]{r, c}); // every initial source
            else if (grid[r][c] == 1) fresh++;
        }
    if (fresh == 0) return 0;                  // nothing to rot

    while (!q.isEmpty() && fresh > 0) {
        minutes++;                              // a new minute begins
        int size = q.size();                    // freeze this level
        for (int i = 0; i < size; i++) {
            int[] cell = q.poll();
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr < 0 || nc < 0 || nr >= m || nc >= n) continue;
                if (grid[nr][nc] != 1) continue;   // only fresh oranges rot
                grid[nr][nc] = 2;
                fresh--;
                q.add(new int[]{nr, nc});
            }
        }
    }
    return fresh == 0 ? minutes : -1;          // leftover fresh = unreachable
}`,
        walkthrough: [
          "Seed: one rotten at (0,0). fresh counted = 6.",
          "Minute 1: (0,1) and (1,0) rot → fresh 4. Minute 2: their neighbours rot → fresh 2. … Minute 4: the last orange rots → fresh 0.",
          "Queue empties with fresh==0 → return 4. If an orange had been boxed in by 0s, fresh would stay > 0 → return -1.",
        ],
      },
    ],
    edgeCases: [
      "No fresh oranges at the start → 0 minutes (return early, don't accidentally return -1).",
      "No rotten oranges but some fresh → they can never rot → -1.",
      "Incrementing `minutes` outside the `fresh > 0` guard double-counts a trailing empty level — freeze the level size and only tick when work remains.",
    ],
    twists: [
      "**Report which orange rots last / its position** → tag each queued cell with its minute as you go.",
      "**Walls and Gates (LeetCode 286)** → same multi-source BFS, but you write per-cell distances instead of counting global minutes.",
      "**Diagonal spread** → add the 4 diagonal directions.",
      "**8-directional or weighted spread time** → weighted needs Dijkstra rather than plain BFS.",
    ],
    related: ["walls-and-gates", "number-of-islands"],
  },

  {
    slug: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 417,
    statement:
      "An m×n grid of heights borders the **Pacific** (top & left edges) and **Atlantic** (bottom & right edges). Water flows from a cell to a 4-directionally adjacent cell of **equal or lower** height. Return all coordinates from which water can reach **both** oceans.",
    examples: [
      {
        in: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        out: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        note: "the cells from which water can drain to both the Pacific and the Atlantic",
      },
    ],
    constraints: ["1 ≤ m, n ≤ 200", "0 ≤ heights[i][j] ≤ 10^5"],
    recognize:
      "Asking 'which cells can reach a destination' for **every** cell screams 'don't search forward from each cell — search **backward from the destinations**'. Run a flood **from each ocean's border inward**, climbing to equal-or-higher cells; the answer is the **intersection** of the two reachable sets.",
    figureItOut: [
      "Forward brute force: from each cell, DFS downhill and see if you reach each ocean. That's a full flood per cell — O((m·n)²). Painful and hugely repetitive.",
      "Reverse the flow. Water reaches an ocean iff there's a downhill path *to* the border. Equivalently, start **at the ocean border and walk inward to cells that are equal or higher** — that's water flowing *toward* you, traced backwards.",
      "Do that flood once **per ocean**. From all Pacific-border cells, mark everything reachable going uphill-or-flat → the set of cells that can drain to the Pacific. Do the same from the Atlantic border.",
      "The reverse direction is the trick that collapses the cost: each ocean flood is one O(m·n) sweep, instead of a sweep per cell.",
      "A cell drains to **both** oceans exactly when it's in **both** reachable sets. So the answer is the intersection: cells marked by the Pacific flood AND the Atlantic flood.",
    ],
    approaches: [
      {
        name: "Two reverse floods, intersect the results",
        intuition:
          "From each ocean's border, DFS/BFS inward to cells of equal-or-greater height, marking reachable cells. Output cells reachable from both.",
        time: "O(m·n)",
        timeWhy:
          "Each cell is visited at most once per ocean flood (two passes), and each visit checks 4 neighbours → linear in the grid.",
        space: "O(m·n)",
        spaceWhy: "Two boolean reachability grids plus recursion/queue depth up to m·n.",
        code: `List<List<Integer>> pacificAtlantic(int[][] heights) {
    int m = heights.length, n = heights[0].length;
    boolean[][] pac = new boolean[m][n], atl = new boolean[m][n];
    for (int r = 0; r < m; r++) {            // left = Pacific, right = Atlantic
        dfs(heights, pac, r, 0);
        dfs(heights, atl, r, n - 1);
    }
    for (int c = 0; c < n; c++) {            // top = Pacific, bottom = Atlantic
        dfs(heights, pac, 0, c);
        dfs(heights, atl, m - 1, c);
    }
    List<List<Integer>> res = new ArrayList<>();
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (pac[r][c] && atl[r][c]) res.add(Arrays.asList(r, c));
    return res;
}

void dfs(int[][] h, boolean[][] seen, int r, int c) {
    seen[r][c] = true;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int[] d : dirs) {
        int nr = r + d[0], nc = c + d[1];
        if (nr < 0 || nc < 0 || nr >= h.length || nc >= h[0].length) continue;
        if (seen[nr][nc]) continue;
        if (h[nr][nc] < h[r][c]) continue;   // reverse flow: only step UP or flat
        dfs(h, seen, nr, nc);
    }
}`,
        walkthrough: [
          "Pacific flood starts from the whole top row and left column, climbing inward; mark every cell it reaches in `pac`.",
          "Atlantic flood starts from the bottom row and right column; mark `atl`.",
          "Scan once: a cell true in both grids drains to both oceans → add it to the answer.",
        ],
      },
    ],
    edgeCases: [
      "A single row or column → every cell touches both oceans → all cells qualify.",
      "Corner cells sit on both a Pacific edge and (depending) — border cells are seeded directly, so they're always reachable by their own ocean.",
      "The condition is **≥** (equal-or-higher when reversed): forgetting the equality lets flat plateaus block flow incorrectly.",
    ],
    twists: [
      "**Only one ocean** → run a single flood, no intersection.",
      "**Water needs strictly lower (no flat flow)** → change the reverse condition to strictly greater.",
      "**Count reachable cells instead of listing** → tally the intersection rather than collecting coordinates.",
    ],
    related: ["number-of-islands", "surrounded-regions"],
  },

  {
    slug: "surrounded-regions",
    title: "Surrounded Regions",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 130,
    statement:
      "Given an m×n board of `'X'` and `'O'`, **capture** all regions surrounded by `'X'`: flip any `'O'` that is **not connected to a border** to `'X'`. Os connected (4-directionally) to a border O survive.",
    examples: [
      {
        in: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
        out: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',
        note: "the inner Os are surrounded → flipped; the bottom O touches the border → safe",
      },
    ],
    constraints: ["1 ≤ m, n ≤ 200", "board[i][j] is 'X' or 'O'"],
    recognize:
      "'Surrounded' is hard to test directly (you'd have to prove an O has no escape). Flip the question: an O is captured **unless** it connects to the border. So **flood from the borders** to mark the *safe* Os, then everything still-O is surrounded. Border-anchored flood fill.",
    figureItOut: [
      "Testing 'is this region surrounded?' directly is awkward — you'd flood each region and check whether it ever touches an edge, which is fiddly to track per region.",
      "Invert it. The only Os that **survive** are those connected to a border O. Every other O is, by definition, surrounded. So identify the survivors first; the rest get flipped.",
      "Find survivors by **flooding inward from every border O**. Any O reachable from the edge is safe — temporarily mark it (say, 'T') so you remember it.",
      "Now sweep the whole board: every remaining `'O'` was *not* reached from the border → it's surrounded → flip it to `'X'`. Every `'T'` was a survivor → restore it to `'O'`.",
      "This 'mark from the boundary, then act on the unmarked interior' pattern recurs whenever 'enclosed/surrounded' must be distinguished from 'touches the edge'.",
    ],
    approaches: [
      {
        name: "Flood from borders, then flip the interior",
        intuition:
          "DFS from every border O marking reachable Os as safe ('T'). Then any leftover 'O' is surrounded → 'X'; turn each 'T' back to 'O'.",
        time: "O(m·n)",
        timeWhy:
          "The border seeding plus interior flood visits each cell a constant number of times, and the final relabel sweep is one more pass.",
        space: "O(m·n)",
        spaceWhy: "Recursion/stack depth up to the number of cells in one connected O-region.",
        code: `void solve(char[][] board) {
    int m = board.length, n = board[0].length;
    for (int r = 0; r < m; r++) {            // left & right border columns
        mark(board, r, 0);
        mark(board, r, n - 1);
    }
    for (int c = 0; c < n; c++) {            // top & bottom border rows
        mark(board, 0, c);
        mark(board, m - 1, c);
    }
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++) {
            if (board[r][c] == 'O') board[r][c] = 'X';   // surrounded → captured
            else if (board[r][c] == 'T') board[r][c] = 'O'; // survivor → restore
        }
}

void mark(char[][] b, int r, int c) {
    if (r < 0 || c < 0 || r >= b.length || c >= b[0].length) return;
    if (b[r][c] != 'O') return;             // 'X' or already-marked 'T'
    b[r][c] = 'T';                           // safe: connected to the border
    mark(b, r + 1, c);
    mark(b, r - 1, c);
    mark(b, r, c + 1);
    mark(b, r, c - 1);
}`,
        walkthrough: [
          "Border floods mark the bottom-left O (it touches the edge) and its connected Os as 'T'.",
          "The inner cluster of Os is never reached from any border → stays 'O'.",
          "Final sweep: inner 'O' → 'X' (captured); the 'T' survivor → back to 'O'.",
        ],
      },
    ],
    edgeCases: [
      "A board with fewer than 3 rows/cols → every O is on a border → nothing is captured.",
      "All Os → none are surrounded (all touch a border) → board unchanged.",
      "Using a temporary marker ('T') matters: flipping directly during the flood would clobber the very cells you still need to scan.",
    ],
    twists: [
      "**Count captured regions / cells** → tally during the final sweep instead of just flipping.",
      "**Number of Enclaves (LeetCode 1020)** → same border-flood idea; count interior land cells that can't walk off the grid.",
      "**Union-find variant** → union all border Os to a virtual 'escape' node; any O not connected to it is captured.",
    ],
    related: ["number-of-islands", "pacific-atlantic-water-flow", "max-area-of-island"],
  },

  {
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 207,
    statement:
      "There are `numCourses` courses (0..numCourses-1). `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish **all** courses, `false` otherwise.",
    examples: [
      { in: "numCourses = 2, prerequisites = [[1,0]]", out: "true", note: "take 0, then 1" },
      { in: "numCourses = 2, prerequisites = [[1,0],[0,1]]", out: "false", note: "0 needs 1 and 1 needs 0 — a cycle" },
    ],
    constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000", "all pairs are distinct"],
    recognize:
      "'Can I order tasks respecting dependencies?' is a **directed graph** question, and the *only* thing that makes it impossible is a **cycle** (A needs B needs … needs A). So this reduces to **cycle detection in a directed graph** — solvable by DFS coloring or by Kahn's BFS topological sort.",
    figureItOut: [
      "Model it: each course is a node; an edge `b → a` means 'b must come before a'. Finishing all courses means producing a linear order respecting every edge — a **topological ordering**.",
      "When does a valid order fail to exist? Exactly when there's a **cycle**: if A depends on B and B (eventually) depends on A, neither can come first. So the whole question collapses to *'is this directed graph acyclic?'*",
      "**Approach 1 — DFS with 3 colors.** Track each node as unvisited / **in-progress** (on the current recursion path) / done. If a DFS ever steps onto a node already **in-progress**, you've looped back on yourself → cycle → return false. Marking a node 'done' only after its subtree finishes prevents false alarms from mere re-visits.",
      "**Approach 2 — Kahn's algorithm (BFS).** Compute each node's **in-degree** (how many prereqs point at it). Repeatedly take a node with in-degree 0 (no unmet prereqs — safe to take now), remove it, and decrement its neighbours' in-degrees. If you manage to remove **all** nodes, no cycle. If you get stuck with nodes remaining (all have in-degree > 0), those form a cycle.",
      "Both detect the same thing; Kahn's also hands you an actual order for free (the next problem), and avoids deep recursion.",
    ],
    approaches: [
      {
        name: "DFS cycle detection (3-color)",
        intuition:
          "DFS each node; a node currently on the recursion stack ('in-progress') that you reach again means a back-edge → cycle.",
        time: "O(V + E)",
        timeWhy:
          "Build the adjacency list in O(E); each node and edge is explored once across all DFS calls.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list (E) + state array (V) + recursion depth up to V.",
        code: `boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) adj.get(p[1]).add(p[0]); // b -> a

    int[] state = new int[numCourses]; // 0=unvisited, 1=in-progress, 2=done
    for (int i = 0; i < numCourses; i++)
        if (state[i] == 0 && hasCycle(adj, state, i)) return false;
    return true;
}

boolean hasCycle(List<List<Integer>> adj, int[] state, int node) {
    state[node] = 1;                       // mark on the current path
    for (int next : adj.get(node)) {
        if (state[next] == 1) return true; // back-edge → cycle
        if (state[next] == 0 && hasCycle(adj, state, next)) return true;
    }
    state[node] = 2;                       // fully explored, safe
    return false;
}`,
        walkthrough: [
          "Edges [[1,0],[0,1]] → adj: 0→1, 1→0. DFS(0): mark 0 in-progress, go to 1; mark 1 in-progress, go to 0 — but 0 is in-progress → cycle → return false.",
          "For [[1,0]] only: DFS(0)→1 finishes cleanly, no back-edge → true.",
        ],
      },
      {
        name: "Kahn's algorithm (BFS topological sort)",
        intuition:
          "Repeatedly remove a node with no remaining prerequisites (in-degree 0). If you remove all of them, it's acyclic.",
        time: "O(V + E)",
        timeWhy: "Each node is enqueued once; each edge is relaxed once when decrementing in-degrees.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list + in-degree array + queue.",
        code: `boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[numCourses];
    for (int[] p : prerequisites) {        // b -> a
        adj.get(p[1]).add(p[0]);
        indeg[p[0]]++;
    }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++)
        if (indeg[i] == 0) q.add(i);       // no prerequisites → take now

    int taken = 0;
    while (!q.isEmpty()) {
        int course = q.poll();
        taken++;
        for (int next : adj.get(course))
            if (--indeg[next] == 0) q.add(next);
    }
    return taken == numCourses;            // all removed → no cycle
}`,
        walkthrough: [
          "[[1,0]]: indeg[1]=1, indeg[0]=0 → queue starts with 0. Take 0, decrement indeg[1]→0, enqueue 1. Take 1. taken=2=numCourses → true.",
          "[[1,0],[0,1]]: both in-degrees are 1 → queue starts empty → taken=0 ≠ 2 → false (the cycle nodes never reach in-degree 0).",
        ],
      },
    ],
    edgeCases: [
      "No prerequisites at all → every node has in-degree 0 → trivially finishable → true.",
      "A self-loop [a,a] → a depends on itself → cycle → false (handled by both methods).",
      "Disconnected components → fine; the outer loop / initial in-degree-0 seeding covers every node.",
      "DFS must mark 'done' (color 2) so revisiting a *finished* node isn't mistaken for a cycle — only 'in-progress' nodes signal one.",
    ],
    twists: [
      "**Return the actual order (Course Schedule II)** → record nodes as Kahn's removes them.",
      "**Is a given ordering valid?** → check each edge points 'forward' in the order (position[b] < position[a]).",
      "**Longest dependency chain / min semesters (LeetCode 1136)** → Kahn's processed level-by-level; the number of levels is the answer.",
    ],
    related: ["course-schedule-ii", "graph-valid-tree", "clone-graph"],
  },

  {
    slug: "course-schedule-ii",
    title: "Course Schedule II",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 210,
    statement:
      "Same setup as Course Schedule, but return **a valid order** in which to take all `numCourses` courses. If no valid order exists (there's a cycle), return an **empty array**.",
    examples: [
      { in: "numCourses = 2, prerequisites = [[1,0]]", out: "[0,1]", note: "0 before 1" },
      { in: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", out: "[0,1,2,0,3] → e.g. [0,2,1,3]", note: "0 first, 3 last; the middle two can swap" },
      { in: "numCourses = 1, prerequisites = []", out: "[0]", note: "one course, no prereqs" },
    ],
    constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ numCourses·(numCourses-1)", "all pairs are distinct"],
    recognize:
      "Now you don't just need 'is it acyclic?', you need the **topological order** itself. **Kahn's algorithm** is the natural fit: the sequence in which nodes hit in-degree 0 *is* a valid order, and if you can't emit all of them, a cycle exists → return empty.",
    figureItOut: [
      "This is Course Schedule plus a deliverable: not a yes/no, but an actual ordering. A topological sort produces exactly that — an order where every prerequisite comes before the course needing it.",
      "Kahn's algorithm builds the order **as a by-product**. A node with in-degree 0 has no unmet prerequisites, so it's safe to place next. Append it to the result, then 'release' its dependents by decrementing their in-degrees.",
      "Each time a dependent's in-degree drops to 0, all *its* prerequisites are now placed, so it becomes eligible — enqueue it. Keep emitting until the queue drains.",
      "Cycle check falls out for free: if the result ends up with **fewer than numCourses** entries, some nodes never reached in-degree 0 (they're tangled in a cycle), so no valid order exists → return an empty array.",
      "Any node with in-degree 0 is a legal next pick, so multiple valid orders can exist — returning any one of them is accepted.",
    ],
    approaches: [
      {
        name: "Kahn's topological sort (record the order)",
        intuition:
          "Emit in-degree-0 nodes one by one, decrementing neighbours' in-degrees. The emission order is the answer; if you can't emit them all, return empty.",
        time: "O(V + E)",
        timeWhy: "Each node enqueued/dequeued once; each edge relaxed once.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list + in-degree array + queue + the output order.",
        code: `int[] findOrder(int numCourses, int[][] prerequisites) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    int[] indeg = new int[numCourses];
    for (int[] p : prerequisites) {        // p[1] before p[0]
        adj.get(p[1]).add(p[0]);
        indeg[p[0]]++;
    }
    Queue<Integer> q = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++)
        if (indeg[i] == 0) q.add(i);

    int[] order = new int[numCourses];
    int idx = 0;
    while (!q.isEmpty()) {
        int course = q.poll();
        order[idx++] = course;             // safe to take now
        for (int next : adj.get(course))
            if (--indeg[next] == 0) q.add(next);
    }
    return idx == numCourses ? order : new int[]{}; // incomplete → cycle
}`,
        walkthrough: [
          "[[1,0],[2,0],[3,1],[3,2]]: indeg = {0:0, 1:1, 2:1, 3:2}. Queue starts [0].",
          "Take 0 → order [0]; release 1 and 2 (both indeg→0) → queue [1,2]. Take 1 → release toward 3 (indeg 2→1). Take 2 → release 3 (indeg→0). Take 3.",
          "order = [0,1,2,3], idx==4==numCourses → return it. (Order [0,2,1,3] is equally valid.)",
        ],
      },
    ],
    edgeCases: [
      "No prerequisites → any permutation is valid; Kahn's emits 0,1,2,… in order.",
      "A cycle → fewer than numCourses emitted → return empty array (not a partial order).",
      "Single course → return [0].",
      "Using a stack instead of a queue still yields *a* valid topo order — only the specific ordering changes.",
    ],
    twists: [
      "**Just feasibility** → Course Schedule I: return whether you emitted all nodes, not the order.",
      "**Lexicographically smallest order** → swap the queue for a min-heap (priority queue) of eligible nodes.",
      "**Group into parallel semesters (LeetCode 1136)** → process Kahn's queue level-by-level; each level is one semester.",
      "**Alien Dictionary (LeetCode 269)** → derive the edges from word comparisons, then topologically sort the letters.",
    ],
    related: ["course-schedule", "graph-valid-tree", "clone-graph"],
  },

  {
    slug: "number-of-connected-components-in-an-undirected-graph",
    title: "Number of Connected Components in an Undirected Graph",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 323,
    statement:
      "Given `n` nodes labeled `0..n-1` and a list of undirected `edges`, return the **number of connected components** in the graph.",
    examples: [
      { in: "n = 5, edges = [[0,1],[1,2],[3,4]]", out: "2", note: "{0,1,2} and {3,4}" },
      { in: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", out: "1", note: "all in one chain" },
      { in: "n = 4, edges = []", out: "4", note: "no edges → every node is its own component" },
    ],
    constraints: ["1 ≤ n ≤ 2000", "0 ≤ edges.length ≤ 5000", "no self-loops or repeated edges"],
    recognize:
      "Counting **connected components** in a general graph is the classic job of **union-find (DSU)** — or equivalently a DFS/BFS that floods one component per unvisited node. With many union queries, DSU is the cleanest near-O(1)-per-edge tool.",
    figureItOut: [
      "**DFS/BFS view (same as islands).** Walk every node. Each time you find one you haven't visited, it begins a new component (+1); flood out from it to mark its whole component visited so you don't recount it. Count the floods.",
      "**Union-find view.** Start by assuming the worst: `n` separate components, each node alone. Now process each edge — it *connects* two nodes, so if they were in different components, **merging** them reduces the component count by 1.",
      "Maintain a `parent[]` array where each node points toward a representative ('root') of its set. `find(x)` follows parents up to the root; two nodes are in the same component iff they share a root.",
      "For each edge (a, b): find both roots. If the roots differ, they're separate sets → **union** them (point one root at the other) and decrement the count. If the roots already match, the edge is redundant (it forms a cycle) and the count is unchanged.",
      "After processing all edges, the count is the number of components. Two optimizations — **path compression** in find and **union by rank/size** — make each operation nearly O(1) amortized.",
    ],
    approaches: [
      {
        name: "Union-Find (DSU) with path compression",
        intuition:
          "Begin with n components. Each edge that joins two *different* sets merges them and drops the count by 1.",
        time: "O(V + E·α(V))",
        timeWhy:
          "Initializing parents is O(V); each edge does two near-constant find/union operations (α is the inverse-Ackermann function — effectively a small constant).",
        space: "O(V)",
        spaceWhy: "The parent (and rank) arrays, one slot per node.",
        code: `int[] parent, rank;

int countComponents(int n, int[][] edges) {
    parent = new int[n];
    rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i; // each node its own root
    int components = n;
    for (int[] e : edges) {
        if (union(e[0], e[1])) components--;    // a real merge cuts the count
    }
    return components;
}

int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];  // path compression (halving)
        x = parent[x];
    }
    return x;
}

boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;          // already connected → redundant edge
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;                     // attach smaller tree under larger
    if (rank[ra] == rank[rb]) rank[ra]++;
    return true;
}`,
        walkthrough: [
          "n=5 → components=5. Edge (0,1): roots 0,1 differ → union → components 4. Edge (1,2): roots 0,2 differ → union → 3.",
          "Edge (3,4): roots 3,4 differ → union → 2. No edge ties {0,1,2} to {3,4} → final answer 2.",
        ],
      },
      {
        name: "DFS flood (count components)",
        intuition:
          "Build an adjacency list. Each unvisited node launches a DFS that marks its whole component; the number of launches is the component count.",
        time: "O(V + E)",
        timeWhy: "Each node visited once; each edge traversed twice (undirected).",
        space: "O(V + E)",
        spaceWhy: "Adjacency list + visited array + recursion depth up to V.",
        code: `int countComponents(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {              // undirected → add both ways
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    boolean[] seen = new boolean[n];
    int components = 0;
    for (int i = 0; i < n; i++) {
        if (!seen[i]) {
            components++;
            dfs(adj, seen, i);
        }
    }
    return components;
}

void dfs(List<List<Integer>> adj, boolean[] seen, int node) {
    seen[node] = true;
    for (int next : adj.get(node))
        if (!seen[next]) dfs(adj, seen, next);
}`,
        walkthrough: [
          "Node 0 unseen → components=1, DFS floods 0,1,2. Nodes 1,2 now seen → skipped.",
          "Node 3 unseen → components=2, DFS floods 3,4. End → 2.",
        ],
      },
    ],
    edgeCases: [
      "No edges → every node isolated → n components.",
      "A fully connected graph → 1 component.",
      "A redundant edge between already-connected nodes must NOT decrement the count — that's exactly what the `find(a)==find(b)` guard catches.",
      "Isolated nodes with no edges are still counted — DSU starts each as its own set; DFS visits them as singleton components.",
    ],
    twists: [
      "**Detect a cycle** → if an edge connects two nodes already in the same set, it closes a cycle (used in Graph Valid Tree).",
      "**Largest component size** → track set sizes during union instead of just the count.",
      "**Edges arrive over time / connectivity queries** → DSU shines because it answers 'connected?' near-O(1) incrementally.",
      "**Redundant Connection (LeetCode 684)** → return the first edge whose two endpoints are already united.",
    ],
    related: ["graph-valid-tree", "number-of-islands", "course-schedule"],
  },

  {
    slug: "graph-valid-tree",
    title: "Graph Valid Tree",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 261,
    statement:
      "Given `n` nodes labeled `0..n-1` and a list of undirected `edges`, return `true` if the graph forms a **valid tree** — it is fully connected **and** has no cycles.",
    examples: [
      { in: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", out: "true", note: "connected, acyclic — a tree" },
      { in: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", out: "false", note: "edge (1,3) closes a cycle" },
      { in: "n = 4, edges = [[0,1],[2,3]]", out: "false", note: "two pieces — not connected" },
    ],
    constraints: ["1 ≤ n ≤ 2000", "0 ≤ edges.length ≤ 5000", "no self-loops or duplicate edges"],
    recognize:
      "A tree has two simultaneous properties: **connected** + **acyclic**. There's a slick shortcut — a graph on `n` nodes is a tree **iff** it's connected and has **exactly n-1 edges**. **Union-find** checks both at once: every edge must merge two distinct sets (no cycle), and you must end with one component (connected).",
    figureItOut: [
      "Recall the definition: a tree is connected and has no cycles. So you must verify *both* — connectivity alone (could contain a cycle) and acyclicity alone (could be a forest) each fail on their own.",
      "**The edge-count shortcut.** A tree on n nodes has exactly **n-1** edges — no fewer (or it's disconnected) and no more (or it has a cycle). So first guard: if `edges.length != n - 1`, immediately return false. After that guard, you only need to confirm *one* of the two properties; the count forces the other.",
      "**Union-find approach.** Start with n separate sets. Process each edge: if its two endpoints are **already in the same set**, this edge creates a **cycle** → not a tree → false. Otherwise union them.",
      "If every edge merged two distinct sets (no cycle detected) AND you have exactly n-1 edges, then all n nodes ended up in **one** component → connected. That's a valid tree.",
      "Equivalent DFS check: run one DFS from node 0; afterwards it's a tree iff (a) you visited all n nodes (connected) and (b) you never revisited a node via a non-parent edge (acyclic). The union-find version is usually cleaner to reason about.",
    ],
    approaches: [
      {
        name: "Union-Find (cycle + connectivity in one pass)",
        intuition:
          "If any edge joins two nodes already in the same set, there's a cycle → false. End connected when exactly n-1 cycle-free edges merge everything into one set.",
        time: "O(V + E·α(V))",
        timeWhy:
          "Init is O(V); each edge does near-constant find/union (inverse-Ackermann α ≈ constant).",
        space: "O(V)",
        spaceWhy: "Parent and rank arrays of size n.",
        code: `int[] parent, rank;

boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;   // tree must have exactly n-1 edges
    parent = new int[n];
    rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    for (int[] e : edges) {
        if (!union(e[0], e[1])) return false;  // endpoints already joined → cycle
    }
    return true;   // n-1 cycle-free edges on n nodes ⇒ connected & acyclic
}

int find(int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];   // path compression
        x = parent[x];
    }
    return x;
}

boolean union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;          // a cycle-closing edge
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
    return true;
}`,
        walkthrough: [
          "n=5, 4 edges (=n-1, passes the count guard). Union (0,1),(0,2),(0,3),(1,4) all merge distinct sets → no cycle → true.",
          "With edge (1,3) added where 1 and 3 already share a root → union returns false → a cycle → not a tree.",
        ],
      },
      {
        name: "DFS connectivity + acyclicity",
        intuition:
          "After the n-1 edge-count guard, one DFS from node 0 that reaches all n nodes proves connectivity; the edge count already rules out cycles.",
        time: "O(V + E)",
        timeWhy: "Build adjacency in O(E); DFS visits each node and edge once.",
        space: "O(V + E)",
        spaceWhy: "Adjacency list + visited set + recursion stack.",
        code: `boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    boolean[] seen = new boolean[n];
    dfs(adj, seen, 0);
    for (boolean v : seen) if (!v) return false;  // some node unreachable → disconnected
    return true;
}

void dfs(List<List<Integer>> adj, boolean[] seen, int node) {
    seen[node] = true;
    for (int next : adj.get(node))
        if (!seen[next]) dfs(adj, seen, next);
}`,
        walkthrough: [
          "With exactly n-1 edges, a cycle would force a disconnected piece — so if DFS from 0 reaches every node, it must also be acyclic.",
          "If any `seen[i]` is false after the DFS, the graph is in pieces → not a tree.",
        ],
      },
    ],
    edgeCases: [
      "n=1, edges=[] → a single node with 0 = n-1 edges → valid tree → true.",
      "Right edge count but a cycle (so necessarily a disconnected piece elsewhere) → union-find catches the cycle, DFS catches the missing node.",
      "Too many edges (≥ n) → fails the count guard instantly; too few (< n-1) → also fails (can't be connected).",
      "Forgetting the n-1 guard means you must separately verify *both* connectivity and acyclicity — easy to half-check.",
    ],
    twists: [
      "**Count components instead of a tree** → drop the cycle requirement; just count sets (Number of Connected Components).",
      "**Redundant Connection (LeetCode 684)** → the graph is a tree plus one extra edge; return the edge that closes a cycle.",
      "**Directed version (must be a rooted tree / arborescence)** → check exactly one root with in-degree 0 and every other node in-degree 1.",
      "**Minimum Height Trees (LeetCode 310)** → trim leaves layer by layer to find the center(s) of the tree.",
    ],
    related: ["number-of-connected-components-in-an-undirected-graph", "course-schedule", "number-of-islands"],
  },
];
