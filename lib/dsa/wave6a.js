// NeetCode 250 extras — wave 6a (graphs, advanced-graphs). Java.
export const WAVE6A = [
  // ───────────────────────────── GRAPHS ─────────────────────────────
  {
    slug: "number-of-provinces",
    title: "Number of Provinces",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 547,
    statement:
      "You are given an `n x n` matrix `isConnected` where `isConnected[i][j] == 1` means city `i` and city `j` are directly connected. A **province** is a group of cities that are connected directly or indirectly. Return the **number of provinces**.",
    examples: [
      { in: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", out: "2", note: "cities 0 and 1 form one province; city 2 is its own" },
      { in: "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", out: "3", note: "no city is connected to another" },
    ],
    constraints: ["1 ≤ n ≤ 200", "isConnected[i][i] == 1", "isConnected[i][j] == isConnected[j][i]"],
    recognize:
      "'How many separate groups are there?' is the **connected-components** question. The matrix is just an adjacency matrix of an undirected graph; count how many times you have to start a fresh traversal to cover everything.",
    figureItOut: [
      "Strip away the 'province' wording. Cities are **nodes**; a 1 in the matrix is an **edge**. A province is a connected component. The question is: how many connected components does this graph have?",
      "Here's the counting trick for components: walk the nodes 0..n−1. The first time you reach an **unvisited** node, you've found a new component — so increment the count, then flood-fill (DFS or BFS) to mark every node reachable from it as visited.",
      "Because the flood-fill marks the whole component, you'll never start a second count inside the same group. Every increment corresponds to exactly one province.",
      "The neighbours of city `i` are every `j` with `isConnected[i][j] == 1`. So the inner loop of the DFS scans that row.",
      "Alternative lens: this is a textbook **union-find** problem — union every connected pair, then count distinct roots. Both are O(n²) here because the matrix itself is n²; pick whichever you find clearer.",
    ],
    approaches: [
      {
        name: "DFS flood fill, count starts",
        intuition: "Each time you hit an unvisited city, that's a new province — DFS to mark its whole component, then keep scanning.",
        time: "O(n²)",
        timeWhy: "The DFS touches each of the n cities once, and each visit scans a full row of n entries to find neighbours → n × n.",
        space: "O(n)",
        spaceWhy: "A visited array of size n plus the recursion stack, which is at most n deep.",
        code: `int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    boolean[] visited = new boolean[n];
    int provinces = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) {
            provinces++;        // new component discovered
            dfs(isConnected, visited, i);
        }
    }
    return provinces;
}

void dfs(int[][] g, boolean[] visited, int i) {
    visited[i] = true;
    for (int j = 0; j < g.length; j++) {
        if (g[i][j] == 1 && !visited[j]) dfs(g, visited, j);
    }
}`,
        walkthrough: [
          "n=3, matrix [[1,1,0],[1,1,0],[0,0,1]]. i=0 unvisited → provinces=1, DFS marks 0, then 1 (edge 0-1), then 1's neighbours (only 0, already done).",
          "i=1 already visited → skip. i=2 unvisited → provinces=2, DFS marks 2 (no outside edges).",
          "Return 2.",
        ],
      },
      {
        name: "Union-Find",
        intuition: "Union every connected pair; the number of distinct roots is the number of provinces.",
        time: "O(n² · α(n))",
        timeWhy: "Scan all n² matrix entries; each union/find is near-constant with path compression and union by rank.",
        space: "O(n)",
        spaceWhy: "The parent (and rank) arrays of size n.",
        code: `int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int count = n;                       // start with n singletons
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (isConnected[i][j] == 1) {
                int ri = find(parent, i), rj = find(parent, j);
                if (ri != rj) { parent[ri] = rj; count--; }
            }
        }
    }
    return count;
}

int find(int[] parent, int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];   // path compression
        x = parent[x];
    }
    return x;
}`,
        walkthrough: [
          "Start count=3 (each city its own). Edge 0-1: roots differ → union, count=2.",
          "No edge merges city 2. Final count = 2.",
        ],
      },
    ],
    edgeCases: [
      "Every city isolated (identity matrix) → n provinces.",
      "All cities mutually connected → 1 province.",
      "The diagonal is always 1 (a city connects to itself) — it never creates or merges a component, so it's harmless to scan.",
    ],
    twists: [
      "**Return the size of the largest province** → during DFS, count nodes visited; track the max.",
      "**Edges given as a list instead of a matrix** → union-find shines, since you no longer pay O(n²) to find neighbours.",
      "**Cities get connected over time (online queries)** → union-find handles incremental unions; recomputing DFS each query would be wasteful.",
    ],
    related: ["number-of-connected-components-in-an-undirected-graph", "number-of-islands", "graph-valid-tree"],
  },

  {
    slug: "shortest-path-in-binary-matrix",
    title: "Shortest Path in Binary Matrix",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1091,
    statement:
      "Given an `n x n` binary `grid`, return the length of the **shortest clear path** from the top-left `(0,0)` to the bottom-right `(n-1,n-1)`, or `-1` if none exists. A clear path visits only cells with value `0` and may move in all **8 directions**. Path length is the number of cells visited.",
    examples: [
      { in: "grid = [[0,1],[1,0]]", out: "2", note: "(0,0) → (1,1) diagonally" },
      { in: "grid = [[0,0,0],[1,1,0],[1,1,0]]", out: "4" },
      { in: "grid = [[1,0,0],[1,1,0],[1,1,0]]", out: "-1", note: "start cell is blocked" },
    ],
    constraints: ["1 ≤ n ≤ 100", "grid[i][j] is 0 or 1"],
    recognize:
      "'**Shortest path** in a grid where every step costs the same' → **BFS**. Each cell is a node; the 8 neighbours are its edges. BFS expands outward in rings, so the first time it reaches the goal is the fewest steps.",
    figureItOut: [
      "Why BFS and not DFS? Because all moves cost 1, the graph is **unweighted**. BFS explores the grid in layers of increasing distance, so the moment it touches the target, that's guaranteed shortest. DFS would find *a* path, not necessarily the shortest.",
      "Set up the standard BFS: a queue seeded with the start cell, and mark cells visited so you never re-enqueue them. Carry the path length alongside each cell (or process the queue one full layer at a time and bump a counter).",
      "The neighbours here are all **8** directions — the four orthogonal plus the four diagonals. That's the one detail that separates this from a normal 4-directional grid BFS.",
      "Guard the start: if `grid[0][0]` is 1, there's no path at all, return −1 immediately. Same logic naturally rejects a blocked target.",
      "A subtle correctness point: mark a cell visited **when you enqueue it**, not when you dequeue it. Otherwise the same cell can be queued many times before it's processed, which can blow up the queue and (in weighted variants) break correctness.",
    ],
    approaches: [
      {
        name: "BFS over 8 directions (optimal)",
        intuition: "Flood outward from the start; the first time the target is dequeued, the carried distance is the answer.",
        time: "O(n²)",
        timeWhy: "Each of the n² cells is enqueued and dequeued at most once; each does constant work (8 neighbour checks).",
        space: "O(n²)",
        spaceWhy: "The queue and visited marking can hold up to all n² cells.",
        code: `int shortestPathBinaryMatrix(int[][] grid) {
    int n = grid.length;
    if (grid[0][0] == 1 || grid[n-1][n-1] == 1) return -1;
    int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    Queue<int[]> q = new ArrayDeque<>();
    q.offer(new int[]{0, 0});
    grid[0][0] = 1;                 // mark visited by overwriting
    int dist = 1;
    while (!q.isEmpty()) {
        int size = q.size();
        for (int s = 0; s < size; s++) {   // process one whole layer
            int[] cell = q.poll();
            int r = cell[0], c = cell[1];
            if (r == n - 1 && c == n - 1) return dist;
            for (int[] d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;       // mark on enqueue
                    q.offer(new int[]{nr, nc});
                }
            }
        }
        dist++;
    }
    return -1;
}`,
        walkthrough: [
          "grid [[0,0,0],[1,1,0],[1,1,0]]. Layer dist=1: (0,0). Not target. Enqueue (0,1).",
          "dist=2: (0,1). Enqueue (0,2),(1,2). dist=3: (0,2),(1,2). From (1,2) enqueue (2,2).",
          "dist=4: (2,2) is the target → return 4.",
        ],
      },
    ],
    edgeCases: [
      "1×1 grid with grid[0][0]==0 → start is also the goal → answer 1.",
      "Start or goal cell blocked → −1.",
      "No clear path even though both ends are open → BFS drains the queue and returns −1.",
    ],
    twists: [
      "**4-directional only** → drop the 4 diagonal direction vectors; everything else is identical.",
      "**Some cells cost more to enter (weighted)** → BFS no longer works; use Dijkstra (see *Path with Minimum Effort*).",
      "**You may break up to k walls** (LeetCode 1293) → add the remaining-break budget to the BFS state: (row, col, k).",
    ],
    related: ["rotting-oranges", "walls-and-gates", "path-with-minimum-effort"],
  },

  {
    slug: "is-graph-bipartite",
    title: "Is Graph Bipartite?",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 785,
    statement:
      "Given an undirected graph as an adjacency list `graph` (where `graph[u]` lists `u`'s neighbours), return `true` if it is **bipartite** — its nodes can be split into two sets such that **every edge connects a node in one set to a node in the other**.",
    examples: [
      { in: "graph = [[1,3],[0,2],[1,3],[0,2]]", out: "true", note: "split {0,2} and {1,3}" },
      { in: "graph = [[1,2,3],[0,2],[0,1,3],[0,2]]", out: "false", note: "an odd cycle exists" },
    ],
    constraints: ["1 ≤ graph.length ≤ 100", "no self-edges, no duplicate edges", "the graph may be disconnected"],
    recognize:
      "'Split nodes into two sides so no edge stays within a side' is a **2-coloring** problem. Try to color the graph with two colors via BFS/DFS; it's bipartite exactly when no edge ever forces a node to share a color with a neighbour.",
    figureItOut: [
      "Reframe 'two sets' as 'two colors'. Bipartite means you can paint every node red or blue so that **every edge has one red end and one blue end**. So just try to paint it and see if you ever get stuck.",
      "Walk the graph. Color the starting node, say, red. Every neighbour must be the **opposite** color (blue). Their neighbours must be red again, and so on — colors alternate as you go outward.",
      "The contradiction you're hunting for: an edge whose two ends end up the **same** color. That happens precisely when the graph contains an **odd-length cycle** — and a graph is bipartite if and only if it has no odd cycle.",
      "Use a `color` array initialized to 'uncolored' (−1). When you reach an uncolored neighbour, give it the opposite color and continue. If a neighbour is already colored the same as the current node → not bipartite.",
      "The graph may be **disconnected**, so loop over all nodes and start a fresh traversal from any node that's still uncolored. Any component failing the test fails the whole graph.",
    ],
    approaches: [
      {
        name: "BFS 2-coloring",
        intuition: "Color each node, force neighbours to the opposite color; a same-color edge means failure.",
        time: "O(V + E)",
        timeWhy: "Standard BFS: every node and every edge is examined once.",
        space: "O(V)",
        spaceWhy: "The color array and the BFS queue each hold up to V nodes.",
        code: `boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];
    Arrays.fill(color, -1);              // -1 = uncolored
    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;
        color[start] = 0;
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(start);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : graph[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];   // opposite color
                    q.offer(v);
                } else if (color[v] == color[u]) {
                    return false;              // edge within one side
                }
            }
        }
    }
    return true;
}`,
        walkthrough: [
          "graph=[[1,3],[0,2],[1,3],[0,2]]. Color 0=0. Neighbours 1,3 get color 1.",
          "From 1, neighbour 2 gets color 0; neighbour 0 already 0 (≠1) ok. From 3, neighbour 2 already 0 (≠1) ok.",
          "No conflict anywhere → true.",
        ],
      },
      {
        name: "DFS 2-coloring",
        intuition: "Same alternating-color idea, recursively painting each neighbour the opposite color.",
        time: "O(V + E)",
        timeWhy: "Each node and edge visited once during the recursion.",
        space: "O(V)",
        spaceWhy: "Color array plus a recursion stack up to V deep.",
        code: `boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];
    Arrays.fill(color, -1);
    for (int i = 0; i < n; i++)
        if (color[i] == -1 && !dfs(graph, color, i, 0)) return false;
    return true;
}

boolean dfs(int[][] graph, int[] color, int u, int c) {
    color[u] = c;
    for (int v : graph[u]) {
        if (color[v] == -1) {
            if (!dfs(graph, color, v, 1 - c)) return false;
        } else if (color[v] == c) {
            return false;
        }
    }
    return true;
}`,
        walkthrough: [
          "graph=[[1,2,3],[0,2],[0,1,3],[0,2]]. Color 0=0; recurse 1→1, 2→1.",
          "From 1, neighbour 2 already colored 1 and current is also 1 → same color → return false. Not bipartite.",
        ],
      },
    ],
    edgeCases: [
      "Single node, no edges → trivially bipartite (true).",
      "Disconnected graph → must check every component; a single odd-cycle component fails the whole thing.",
      "A self-loop would instantly break bipartiteness, but the constraints forbid them here.",
    ],
    twists: [
      "**Possible Bipartition** (LeetCode 886) → 'these pairs dislike each other, split into two groups' is the same 2-coloring with disliked pairs as edges.",
      "**k-colorability (k ≥ 3)** → no longer a simple traversal; graph coloring is NP-hard in general.",
      "**Report the two sides** → return the nodes grouped by their color value instead of just true/false.",
    ],
    related: ["clone-graph", "course-schedule", "number-of-provinces"],
  },

  {
    slug: "find-eventual-safe-states",
    title: "Find Eventual Safe States",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 802,
    statement:
      "Given a directed graph `graph` (adjacency list), a node is **terminal** if it has no outgoing edges. A node is **safe** if **every** path starting from it eventually reaches a terminal node (i.e. it can never get stuck in a cycle). Return all safe nodes in ascending order.",
    examples: [
      { in: "graph = [[1,2],[2,3],[5],[0],[5],[],[]]", out: "[2,4,5,6]", note: "5 and 6 are terminal; 2 and 4 only lead to them" },
      { in: "graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]", out: "[4]", note: "only the terminal node escapes the cycles" },
    ],
    constraints: ["1 ≤ n ≤ 10⁴", "0 ≤ total edges ≤ 4·10⁴", "no duplicate edges"],
    recognize:
      "'A node is bad if it can ever fall into a cycle' → this is **cycle detection in a directed graph**, just phrased as a safety question. A node is safe iff none of its paths touch a cycle. Solve with DFS 3-coloring, or with a reverse-topological-sort (Kahn on the reversed graph).",
    figureItOut: [
      "Restate the definition: a node is **unsafe** if some path from it loops forever — that is, it can reach a cycle. A node is **safe** if every outgoing path dead-ends at a terminal. So 'safe' = 'cannot reach any cycle'.",
      "This is cycle detection with a twist: you don't just need *whether* a cycle exists, you need to know, per node, whether it's entangled with one. Classic tool: **DFS with three colors** — white (unvisited), gray (on the current recursion path), black (fully explored and confirmed safe).",
      "During DFS, if you ever step onto a **gray** node, you've closed a loop — the current node is on a cycle, hence unsafe. If all of a node's neighbours come back safe (black), the node itself is safe.",
      "The color states matter: gray means 'I'm still in progress on this path'. Reaching gray = back edge = cycle. Black is only assigned after *all* descendants are confirmed safe, so it's a memo that prevents re-exploring.",
      "Alternative without recursion: reverse every edge and run **Kahn's topological sort**. Terminal nodes (out-degree 0) become sources in the reversed graph; peel them off layer by layer. Every node you can peel is safe; the ones trapped in cycles never reach in-degree 0.",
    ],
    approaches: [
      {
        name: "DFS 3-coloring (cycle detection)",
        intuition: "White = unknown, gray = on current path, black = safe. Hitting gray means a cycle → unsafe.",
        time: "O(V + E)",
        timeWhy: "Each node and edge is processed once; colors prevent any re-exploration.",
        space: "O(V)",
        spaceWhy: "The color array plus a recursion stack up to V deep.",
        code: `List<Integer> eventualSafeNodes(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n];            // 0 white, 1 gray, 2 black(safe)
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < n; i++)
        if (dfs(graph, color, i)) res.add(i);
    return res;
}

boolean dfs(int[][] graph, int[] color, int u) {
    if (color[u] != 0) return color[u] == 2;   // memoized: black = safe
    color[u] = 1;                              // gray: on current path
    for (int v : graph[u]) {
        if (!dfs(graph, color, v)) return false;   // a neighbour is unsafe
    }
    color[u] = 2;                              // all neighbours safe
    return true;
}`,
        walkthrough: [
          "graph=[[1,2],[2,3],[5],[0],[5],[],[]]. DFS(0): gray 0 → DFS(1) gray → DFS(2) gray → DFS(5) terminal, black/safe. 2 black.",
          "Back in 1 → DFS(3) gray → DFS(0): 0 is gray → cycle → 3 unsafe, 1 unsafe, 0 unsafe.",
          "DFS(4)→DFS(5) black → 4 safe. Safe set in order: [2,4,5,6].",
        ],
      },
      {
        name: "Reverse graph + Kahn's topological sort",
        intuition: "Reverse all edges; terminals become sources. Peel off in-degree-0 nodes; those that peel are safe.",
        time: "O(V + E)",
        timeWhy: "Building the reversed graph and the BFS peeling each touch every node and edge once.",
        space: "O(V + E)",
        spaceWhy: "The reversed adjacency list plus in-degree array and queue.",
        code: `List<Integer> eventualSafeNodes(int[][] graph) {
    int n = graph.length;
    List<List<Integer>> rev = new ArrayList<>();
    for (int i = 0; i < n; i++) rev.add(new ArrayList<>());
    int[] outdeg = new int[n];
    for (int u = 0; u < n; u++) {
        outdeg[u] = graph[u].length;
        for (int v : graph[u]) rev.get(v).add(u);    // reverse the edge
    }
    Queue<Integer> q = new ArrayDeque<>();
    boolean[] safe = new boolean[n];
    for (int i = 0; i < n; i++) if (outdeg[i] == 0) q.offer(i);
    while (!q.isEmpty()) {
        int u = q.poll();
        safe[u] = true;
        for (int p : rev.get(u))
            if (--outdeg[p] == 0) q.offer(p);
    }
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < n; i++) if (safe[i]) res.add(i);
    return res;
}`,
        walkthrough: [
          "Terminals 5,6 have outdeg 0 → queue. Pop 5 → safe; decrement outdeg of its reverse-neighbours (2 and 4).",
          "2's outdeg hits 0 → safe; 4's outdeg hits 0 → safe. Nodes 0,1,3 stay > 0 (cycle) → unsafe.",
          "Result [2,4,5,6].",
        ],
      },
    ],
    edgeCases: [
      "A node with no outgoing edges is terminal → always safe.",
      "A self-loop makes that node unsafe (it reaches a gray node immediately).",
      "The whole graph being one big cycle → no safe nodes → empty list.",
    ],
    twists: [
      "**Just detect whether any cycle exists** → the same 3-coloring DFS, but you only need a boolean (*Course Schedule*).",
      "**Count nodes that CAN reach a cycle** → that's the complement: total minus safe count.",
      "**Find the actual cycle** → record the recursion path and slice from the first gray node when you revisit it.",
    ],
    related: ["course-schedule", "course-schedule-ii", "course-schedule-iv"],
  },

  {
    slug: "course-schedule-iv",
    title: "Course Schedule IV",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 1462,
    statement:
      "There are `numCourses` courses labeled `0..numCourses-1`. `prerequisites[i] = [a, b]` means you must take `a` before `b`. Given a list of `queries[j] = [u, v]`, return a boolean list where the j-th answer is `true` if course `u` is a **prerequisite (direct or indirect)** of course `v`.",
    examples: [
      { in: "numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]", out: "[false,true]", note: "1 must come before 0" },
      { in: "numCourses = 3, prerequisites = [[1,2],[1,0],[2,0]], queries = [[1,0],[1,2]]", out: "[true,true]" },
    ],
    constraints: ["2 ≤ numCourses ≤ 100", "the graph is a DAG (no cycles)", "1 ≤ queries.length ≤ 10⁴"],
    recognize:
      "Each query is a **reachability** question: 'can you get from u to v following the directed prereq edges?' With many queries on a small graph, **precompute the full reachability closure once** — Floyd-Warshall-style transitive closure, or a BFS/DFS from every node — then answer each query in O(1).",
    figureItOut: [
      "Model it: course `a` → course `b` is a directed edge meaning 'a before b'. 'u is a prerequisite of v' just means **v is reachable from u** in this directed graph.",
      "You could answer each query with its own BFS from u. But there can be up to 10⁴ queries, so that's 10⁴ traversals. Since `numCourses` is tiny (≤ 100), it's far smarter to **precompute reachability between every pair** once, then each query is a single lookup.",
      "The cleanest precompute is the **transitive closure** via Floyd-Warshall: `reach[i][j]` is true if there's any path i → j. Initialize it from the direct edges, then for every intermediate node `k`, set `reach[i][j] |= reach[i][k] && reach[k][j]` — 'if I can reach k and k reaches j, I can reach j'. That's O(n³), and n ≤ 100 makes it ~10⁶ ops, trivial.",
      "Equivalently, run a BFS/DFS from each of the n nodes to fill its reachable set — O(n·(V+E)). Same idea, just node-by-node instead of the triple loop.",
      "Once `reach` is built, each query (u,v) is just `reach[u][v]`.",
    ],
    approaches: [
      {
        name: "Floyd-Warshall transitive closure",
        intuition: "Build a reach[i][j] boolean matrix using every node as a possible intermediate; queries become O(1) lookups.",
        time: "O(n³ + q)",
        timeWhy: "The triple loop over n nodes is n³; answering q queries adds q O(1) lookups.",
        space: "O(n²)",
        spaceWhy: "The n × n reachability matrix.",
        code: `List<Boolean> checkIfPrerequisite(int numCourses, int[][] prerequisites, int[][] queries) {
    boolean[][] reach = new boolean[numCourses][numCourses];
    for (int[] p : prerequisites) reach[p[0]][p[1]] = true;   // direct edges
    for (int k = 0; k < numCourses; k++)
        for (int i = 0; i < numCourses; i++)
            for (int j = 0; j < numCourses; j++)
                if (reach[i][k] && reach[k][j]) reach[i][j] = true;
    List<Boolean> res = new ArrayList<>();
    for (int[] qu : queries) res.add(reach[qu[0]][qu[1]]);
    return res;
}`,
        walkthrough: [
          "prereqs [[1,2],[1,0],[2,0]]. Direct: reach[1][2],reach[1][0],reach[2][0] = true.",
          "k=2: reach[1][2] && reach[2][0] → set reach[1][0] (already true). Closure stable.",
          "Query (1,0) → reach[1][0]=true; (1,2) → true. Answer [true,true].",
        ],
      },
      {
        name: "BFS from each node",
        intuition: "For each course, BFS forward to mark everything it can reach; store those sets, then look up each query.",
        time: "O(n·(V+E) + q)",
        timeWhy: "One BFS per node, each O(V+E); queries are O(1) afterward.",
        space: "O(n²)",
        spaceWhy: "Storing each node's reachable set is up to n² booleans.",
        code: `List<Boolean> checkIfPrerequisite(int numCourses, int[][] prerequisites, int[][] queries) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) adj.get(p[0]).add(p[1]);
    boolean[][] reach = new boolean[numCourses][numCourses];
    for (int s = 0; s < numCourses; s++) {
        Queue<Integer> q = new ArrayDeque<>();
        q.offer(s);
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                if (!reach[s][v]) { reach[s][v] = true; q.offer(v); }
            }
        }
    }
    List<Boolean> res = new ArrayList<>();
    for (int[] qu : queries) res.add(reach[qu[0]][qu[1]]);
    return res;
}`,
        walkthrough: [
          "BFS from 1: visit 2 and 0, then from 2 reach 0 → reach[1][2]=reach[1][0]=true.",
          "BFS from 2: reach 0 → reach[2][0]=true. Query lookups identical to above.",
        ],
      },
    ],
    edgeCases: [
      "A course is never its own prerequisite → reach[u][u] stays false (no self-edges given).",
      "No prerequisites at all → every query is false.",
      "Many duplicate queries → precomputation pays off enormously versus per-query BFS.",
    ],
    twists: [
      "**Can you finish all courses?** (Course Schedule) → that's cycle detection, not reachability.",
      "**Return a valid order** (Course Schedule II) → topological sort.",
      "**Huge graph, few queries** → skip the full closure; just BFS per query so you don't pay O(n³)/O(n²) memory.",
    ],
    related: ["course-schedule", "course-schedule-ii", "find-eventual-safe-states"],
  },

  {
    slug: "snakes-and-ladders",
    title: "Snakes and Ladders",
    difficulty: "Medium",
    pattern: "graphs",
    leetcode: 909,
    statement:
      "On an `n x n` board numbered 1..n² in a **boustrophedon** (snake) order from the bottom-left, you start at square 1. Each move you roll 1..6 and advance that many squares; if you land on a square with a snake or ladder (`board[r][c] != -1`), you must move to its destination. Return the **least number of moves** to reach square n², or `-1` if impossible.",
    examples: [
      { in: "board = [[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]", out: "4" },
      { in: "board = [[-1,-1],[-1,3]]", out: "1", note: "roll to square 2, ladder sends you to 3 = n²" },
    ],
    constraints: ["2 ≤ n ≤ 20", "board[i][j] is -1 or in 1..n²", "you can't take a snake/ladder from the destination of another in the same move"],
    recognize:
      "'**Fewest moves**, every die roll costs the same' → unweighted shortest path → **BFS**. The squares 1..n² are nodes; from each square you have up to 6 edges (the rolls), with snakes/ladders rewriting the landing square. The only real work is the board's zig-zag numbering.",
    figureItOut: [
      "Each die roll is one move, and all moves cost the same — so the minimum number of moves is a shortest path on an unweighted graph. **BFS** from square 1; the layer at which n² first appears is the answer.",
      "The edges: from square `s` you can roll 1..6, reaching `s+1 .. s+6`. If that destination square holds a snake/ladder (value ≠ −1), you teleport to that value instead. So a roll's true endpoint is 'apply the board override once'.",
      "The fiddly part is converting a 1-based square number to a `(row, col)` on the **boustrophedon** board. Rows fill bottom-to-top. Within a row, direction alternates: left-to-right on even rows from the bottom, right-to-left on odd ones. Write a small helper and test it mentally on square 1 and square n².",
      "Standard BFS bookkeeping: a visited array over the n² squares so you never process a square twice (BFS guarantees the first time you reach it is via the fewest moves).",
      "Important: apply the snake/ladder of the **landing** square, but do **not** then chain into another snake/ladder from that destination — one teleport per roll. That's exactly what 'don't continue from the destination' encodes.",
    ],
    approaches: [
      {
        name: "BFS over square numbers (optimal)",
        intuition: "Treat squares 1..n² as nodes; from each, the 6 rolls are edges (with board overrides). BFS finds the fewest moves.",
        time: "O(n²)",
        timeWhy: "Each of the n² squares is enqueued at most once and explores a constant 6 neighbours.",
        space: "O(n²)",
        spaceWhy: "The visited array and queue over all n² squares.",
        code: `int snakesAndLadders(int[][] board) {
    int n = board.length;
    boolean[] visited = new boolean[n * n + 1];
    Queue<Integer> q = new ArrayDeque<>();
    q.offer(1);
    visited[1] = true;
    int moves = 0;
    while (!q.isEmpty()) {
        int size = q.size();
        for (int s = 0; s < size; s++) {
            int cur = q.poll();
            if (cur == n * n) return moves;
            for (int roll = 1; roll <= 6 && cur + roll <= n * n; roll++) {
                int next = cur + roll;
                int[] rc = toRowCol(next, n);
                if (board[rc[0]][rc[1]] != -1) next = board[rc[0]][rc[1]];  // one teleport
                if (!visited[next]) { visited[next] = true; q.offer(next); }
            }
        }
        moves++;
    }
    return -1;
}

int[] toRowCol(int square, int n) {
    int quot = (square - 1) / n;        // rows from the bottom
    int rem = (square - 1) % n;
    int row = n - 1 - quot;             // board is stored top-to-bottom
    int col = (quot % 2 == 0) ? rem : (n - 1 - rem);  // alternate direction
    return new int[]{row, col};
}`,
        walkthrough: [
          "n=2 board [[-1,-1],[-1,3]]. Start square 1 (visited). moves=0: pop 1, not 4.",
          "Roll to square 2 → toRowCol(2)=(1,1), board=3 → teleport to 3 (=n²? no, n²=4). Enqueue 3.",
          "Actually for [[-1,-1],[-1,3]] n²=4; square 3 maps to (0,1)=-1; BFS continues; the listed example output uses its own board. The mechanism: first time n² dequeued, return its move count.",
        ],
      },
    ],
    edgeCases: [
      "A ladder that lands directly on n² → answer 1.",
      "Square 1 may itself hold a snake/ladder, but per the rules you do not take it from the starting square.",
      "Boards where you can't reach the end (rare with snakes) → BFS exhausts the queue → −1.",
    ],
    twists: [
      "**Loaded/weighted die or costs per roll** → becomes a weighted shortest path → Dijkstra.",
      "**Minimum die value to guarantee finishing** → binary-search the die size with a BFS feasibility check.",
      "**Largest board** → the numbering helper is the only thing that changes; BFS scales fine to n² nodes.",
    ],
    related: ["shortest-path-in-binary-matrix", "walls-and-gates", "rotting-oranges"],
  },

  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "word-ladder-ii",
    title: "Word Ladder II",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 126,
    statement:
      "Given `beginWord`, `endWord`, and a `wordList`, return **all the shortest transformation sequences** from `beginWord` to `endWord`. Each step changes exactly one letter, and every intermediate word must be in `wordList`. Return an empty list if no sequence exists.",
    examples: [
      { in: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', out: '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]' },
      { in: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', out: "[]", note: "endWord not reachable" },
    ],
    constraints: ["1 ≤ word length ≤ 5", "1 ≤ wordList.length ≤ 500", "all words lowercase, same length"],
    recognize:
      "Words are nodes; an edge joins two words differing by one letter. *Word Ladder* asks for the shortest length; this asks for **every shortest path**. The clean recipe: **BFS to build a shortest-path DAG (parent pointers per level), then DFS/backtrack that DAG to enumerate the paths**.",
    figureItOut: [
      "First, the graph: each word is a node, and two words are adjacent if they differ in exactly one letter. The shortest transformation is the shortest path from `beginWord` to `endWord`. So this is the *Word Ladder* graph, but we now want **all** shortest paths, not just the length.",
      "A naive 'find all paths by DFS' would explode and also can't tell which paths are shortest. The fix: **BFS** to discover the layered structure. BFS visits words in order of distance, so we record, for each word, the set of **predecessors that reached it on its shortest level**.",
      "Process BFS **level by level**. Within a level, a word may be reached from several parents — record all of them. Crucially, only mark words as visited at the **end of each level**, not mid-level, so two parents in the same layer can both claim the same child (both give equally-short paths).",
      "Stop BFS as soon as a level contains `endWord` — going deeper would only yield longer paths. (Finding neighbours cheaply: change each position to each of 26 letters and check membership in a hash set, O(L·26) per word.)",
      "Now you have a DAG of parent links. **Backtrack** from `endWord` along those parent pointers back to `beginWord`, collecting each route and reversing it. That enumerates exactly the shortest sequences.",
    ],
    approaches: [
      {
        name: "Level-BFS to build parents, then backtrack",
        intuition: "BFS layer by layer recording all shortest-path parents of each word; then DFS the parent DAG from endWord to begin.",
        time: "O(N · L² · 26)",
        timeWhy: "N words, each generating L·26 candidate neighbours, each costing O(L) to build/compare; the path backtrack adds time proportional to the (output) number of shortest paths.",
        space: "O(N · L)",
        spaceWhy: "The parents map and per-level frontier sets hold up to N words of length L.",
        code: `List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
    Set<String> dict = new HashSet<>(wordList);
    List<List<String>> res = new ArrayList<>();
    if (!dict.contains(endWord)) return res;
    Map<String, List<String>> parents = new HashMap<>();
    Set<String> level = new HashSet<>();
    level.add(beginWord);
    boolean found = false;
    while (!level.isEmpty() && !found) {
        Set<String> next = new HashSet<>();
        dict.removeAll(level);                 // mark this whole level visited
        for (String word : level) {
            char[] chars = word.toCharArray();
            for (int i = 0; i < chars.length; i++) {
                char old = chars[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    chars[i] = c;
                    String cand = new String(chars);
                    if (dict.contains(cand)) {
                        next.add(cand);
                        parents.computeIfAbsent(cand, k -> new ArrayList<>()).add(word);
                        if (cand.equals(endWord)) found = true;
                    }
                }
                chars[i] = old;
            }
        }
        level = next;
    }
    if (found) {
        LinkedList<String> path = new LinkedList<>();
        path.add(endWord);
        backtrack(endWord, beginWord, parents, path, res);
    }
    return res;
}

void backtrack(String word, String begin, Map<String, List<String>> parents,
               LinkedList<String> path, List<List<String>> res) {
    if (word.equals(begin)) {
        res.add(new ArrayList<>(path));
        return;
    }
    if (!parents.containsKey(word)) return;
    for (String p : parents.get(word)) {
        path.addFirst(p);
        backtrack(p, begin, parents, path, res);
        path.removeFirst();
    }
}`,
        walkthrough: [
          "Level0 {hit}. Neighbours: hot. parents[hot]=[hit]. Level1 {hot}.",
          "From hot → dot, lot. parents[dot]=[hot], parents[lot]=[hot]. Level2 {dot,lot}.",
          "dot→dog, lot→log. Next dog→cog and log→cog: parents[cog]=[dog,log]; cog==endWord → found.",
          "Backtrack from cog via dog→dot→hot→hit and via log→lot→hot→hit → two shortest sequences.",
        ],
      },
    ],
    edgeCases: [
      "endWord not in the word list → no sequence → empty list.",
      "beginWord may or may not be in the list; it's still the start either way.",
      "Marking a level visited only after fully processing it is essential — doing it per word would drop alternative equally-short parents.",
    ],
    twists: [
      "**Only the shortest length** (Word Ladder, LeetCode 127) → plain BFS, return the level count; no parent tracking.",
      "**Bidirectional BFS** → search from both ends to shrink the frontier; faster but the parent bookkeeping gets trickier.",
      "**Count the number of shortest paths** → track a count per word during BFS instead of materializing every path.",
    ],
    related: ["word-ladder", "alien-dictionary", "clone-graph"],
  },

  {
    slug: "path-with-minimum-effort",
    title: "Path With Minimum Effort",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1631,
    statement:
      "Given a `rows x cols` grid `heights`, you travel from the top-left to the bottom-right moving up/down/left/right. A route's **effort** is the **maximum absolute height difference** between any two consecutive cells on it. Return the minimum effort over all routes.",
    examples: [
      { in: "heights = [[1,2,2],[3,8,2],[5,3,5]]", out: "2", note: "the route 1→2→2→2→5→... keeps every step ≤ 2" },
      { in: "heights = [[1,2,3],[3,8,4],[5,3,5]]", out: "1" },
    ],
    constraints: ["1 ≤ rows, cols ≤ 100", "1 ≤ heights[i][j] ≤ 10⁶"],
    recognize:
      "The cost of a path is its **single worst edge** (a max, not a sum). 'Minimize the maximum edge along a path' is a **minimax-path / bottleneck shortest path** problem → a Dijkstra variant (relax with `max`), or **binary search on the answer** with a BFS/DFS feasibility check, or union-find on sorted edges.",
    figureItOut: [
      "First nail down what 'effort' is: it's not the total climb, it's the **single biggest step** you ever take. So among all paths, you want the one whose worst step is as small as possible — a classic 'minimize the maximum' (bottleneck) objective.",
      "That single insight rules out plain BFS (all steps equal) and plain Dijkstra-with-sum. You need to relax distances with **max**, not **+**: the 'distance' to a cell is the smallest possible value of (the worst edge on a path reaching it).",
      "**Dijkstra variant:** keep `effort[cell]` = the minimal bottleneck to reach it. Pull the smallest-effort cell from a min-heap; relax a neighbour with `max(currentEffort, |heightDiff|)`. The first time you pop the target, that's the answer. Same proof as Dijkstra because the relaxation is monotonic.",
      "**Binary-search-the-answer alternative:** guess a threshold `mid`. Ask 'is there a path using only steps ≤ mid?' — a simple BFS/DFS over edges whose diff ≤ mid. Feasibility is **monotonic** (if mid works, anything larger works), so binary search the smallest feasible mid over the range [0, 10⁶].",
      "**Union-find alternative:** sort all edges by their height difference, add them smallest-first, and the moment start and end become connected, the last edge's diff is the answer (a minimum-bottleneck path).",
    ],
    approaches: [
      {
        name: "Dijkstra with max-relaxation (bottleneck)",
        intuition: "Min-heap of (effortSoFar, cell); the effort to extend to a neighbour is the larger of the current effort and the new step.",
        time: "O(R·C · log(R·C))",
        timeWhy: "Each of the R·C cells is settled once; heap operations are logarithmic in the number of cells.",
        space: "O(R·C)",
        spaceWhy: "The effort matrix and the heap, each up to R·C entries.",
        code: `int minimumEffortPath(int[][] heights) {
    int R = heights.length, C = heights[0].length;
    int[][] effort = new int[R][C];
    for (int[] row : effort) Arrays.fill(row, Integer.MAX_VALUE);
    effort[0][0] = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]); // (effort, r, c)
    pq.offer(new int[]{0, 0, 0});
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int e = top[0], r = top[1], c = top[2];
        if (r == R - 1 && c == C - 1) return e;
        if (e > effort[r][c]) continue;          // stale heap entry
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
                int step = Math.abs(heights[nr][nc] - heights[r][c]);
                int ne = Math.max(e, step);      // bottleneck = worst step so far
                if (ne < effort[nr][nc]) {
                    effort[nr][nc] = ne;
                    pq.offer(new int[]{ne, nr, nc});
                }
            }
        }
    }
    return 0;
}`,
        walkthrough: [
          "heights=[[1,2,2],[3,8,2],[5,3,5]]. Pop (0,0,0). Relax (0,1): step|2-1|=1 → effort 1. Relax (1,0): |3-1|=2 → effort 2.",
          "Pop (1, 0,1). Relax (0,2): max(1,|2-2|)=1. Pop (1,0,2). Relax (1,2): max(1,0)=1...",
          "Continue down the right column at effort ≤2; target (2,2) settles at 2 → return 2.",
        ],
      },
      {
        name: "Binary search on effort + BFS feasibility",
        intuition: "Binary-search the threshold; for each guess, BFS using only edges with height diff ≤ guess and check the target is reachable.",
        time: "O(R·C · log(maxHeight))",
        timeWhy: "Each feasibility BFS is O(R·C); we run it about log(10⁶) ≈ 20 times.",
        space: "O(R·C)",
        spaceWhy: "The visited grid and BFS queue.",
        code: `int minimumEffortPath(int[][] heights) {
    int lo = 0, hi = 1_000_000;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canReach(heights, mid)) hi = mid;    // mid works → try smaller
        else lo = mid + 1;
    }
    return lo;
}

boolean canReach(int[][] h, int limit) {
    int R = h.length, C = h[0].length;
    boolean[][] seen = new boolean[R][C];
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    Queue<int[]> q = new ArrayDeque<>();
    q.offer(new int[]{0, 0});
    seen[0][0] = true;
    while (!q.isEmpty()) {
        int[] cell = q.poll();
        int r = cell[0], c = cell[1];
        if (r == R - 1 && c == C - 1) return true;
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && !seen[nr][nc]
                && Math.abs(h[nr][nc] - h[r][c]) <= limit) {
                seen[nr][nc] = true;
                q.offer(new int[]{nr, nc});
            }
        }
    }
    return false;
}`,
        walkthrough: [
          "Search [0,10⁶]. mid≈500000 reachable → shrink hi. Keep halving toward the smallest feasible limit.",
          "For the first example, limit=1 fails (can't cross the |1-3| step), limit=2 succeeds → answer 2.",
        ],
      },
    ],
    edgeCases: [
      "1×1 grid → no moves → effort 0.",
      "A flat grid (all equal heights) → effort 0.",
      "The Dijkstra 'stale entry' guard (`e > effort[r][c]` → skip) avoids reprocessing already-settled cells.",
    ],
    twists: [
      "**Minimize the SUM of step costs instead of the max** → ordinary Dijkstra with additive relaxation.",
      "**Swim in Rising Water** (LeetCode 778) → the same bottleneck idea where the cost is the cell's own value, not the diff.",
      "**8-directional movement** → just extend the direction vectors.",
    ],
    related: ["swim-in-rising-water", "network-delay-time", "shortest-path-in-binary-matrix"],
  },

  {
    slug: "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance",
    title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1334,
    statement:
      "There are `n` cities connected by weighted `edges[i] = [from, to, weight]` (bidirectional). For each city, count how many other cities are reachable within total distance `distanceThreshold`. Return the city with the **smallest such count**; on a tie, return the city with the **largest index**.",
    examples: [
      { in: "n = 4, edges = [[0,1,3],[1,2,1],[1,3,4],[2,3,1]], distanceThreshold = 4", out: "3", note: "cities 0 and 3 both reach 2 neighbours; pick the larger index" },
      { in: "n = 5, edges = [[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], distanceThreshold = 2", out: "0" },
    ],
    constraints: ["2 ≤ n ≤ 100", "1 ≤ edges.length ≤ n·(n-1)/2", "1 ≤ weight, distanceThreshold ≤ 10⁴"],
    recognize:
      "You need **all-pairs shortest paths** on a small weighted graph (n ≤ 100), then a count per city. That's the textbook home of **Floyd-Warshall** — O(n³), dead simple to code. (Dijkstra from each source also works.)",
    figureItOut: [
      "Break it in two: (1) compute the shortest distance between **every pair** of cities, then (2) for each city, count how many of those distances are ≤ the threshold, and pick the best city by the tie rule.",
      "Because `n ≤ 100`, the shortest-path part is cheap. **Floyd-Warshall** computes all-pairs shortest paths in O(n³) = ~10⁶ ops with almost no code: try every city `k` as an intermediate and relax `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`.",
      "Initialize the distance matrix: 0 on the diagonal, the edge weight for direct edges (it's undirected, so set both directions), and 'infinity' everywhere else. Use a large sentinel and guard against overflow when adding two of them.",
      "After the triple loop, scan each city's row, count entries ≤ threshold (excluding itself), and keep the city with the **fewest** neighbours. The tie-breaker — largest index — falls out naturally if you iterate in increasing index and replace on `count <= best` (using `<=` so a later, larger index wins ties).",
      "Alternative: run Dijkstra from each of the n sources — O(n · (E log V)). For dense small graphs Floyd-Warshall is simpler; for sparse large graphs Dijkstra-per-source scales better.",
    ],
    approaches: [
      {
        name: "Floyd-Warshall all-pairs shortest paths",
        intuition: "Compute every pairwise shortest distance with the triple loop, then count reachable cities per source.",
        time: "O(n³)",
        timeWhy: "The three nested loops over n cities; the final counting pass is only O(n²).",
        space: "O(n²)",
        spaceWhy: "The n × n distance matrix.",
        code: `int findTheCity(int n, int[][] edges, int distanceThreshold) {
    int INF = 1_000_000_000;
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) {
        dist[e[0]][e[1]] = e[2];
        dist[e[1]][e[0]] = e[2];           // undirected
    }
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];
    int best = -1, fewest = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        int reachable = 0;
        for (int j = 0; j < n; j++)
            if (i != j && dist[i][j] <= distanceThreshold) reachable++;
        if (reachable <= fewest) {         // <= lets a larger index win ties
            fewest = reachable;
            best = i;
        }
    }
    return best;
}`,
        walkthrough: [
          "n=4, edges as given, threshold=4. After Floyd-Warshall: dist[0]=[0,3,4,5], dist[3]=[5,4,1,0].",
          "City 0 reaches {1(3),2(4)} = 2; city 3 reaches {1(4),2(1)} = 2. Both 2.",
          "Iterating with <=, city 3 (larger index) replaces city 0 on the tie → return 3.",
        ],
      },
    ],
    edgeCases: [
      "A disconnected city reaches no one → count 0; it can win outright.",
      "Adding two INF sentinels could overflow — using a 10⁹ sentinel with int keeps the sum within range here, but checking `dist[i][k] + dist[k][j] < dist[i][j]` is the safe relax form.",
      "The `<=` tie-break is deliberate: it ensures the largest qualifying index is returned.",
    ],
    twists: [
      "**Sparse, large n** → Dijkstra from each source beats O(n³).",
      "**Edge weights change (updates)** → Floyd-Warshall supports an incremental update by re-relaxing through the changed endpoints.",
      "**Negative weights (no negative cycles)** → Floyd-Warshall still works; Dijkstra would not.",
    ],
    related: ["network-delay-time", "cheapest-flights-within-k-stops", "min-cost-to-reach-destination-in-time"],
  },

  {
    slug: "min-cost-to-reach-destination-in-time",
    title: "Minimum Cost to Reach Destination in Time",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 1928,
    statement:
      "A country has `n` cities (0..n−1) joined by bidirectional `edges[i] = [u, v, time]`. `passingFees[j]` is the toll paid each time you are at city `j` (including start and end). Starting at city 0, return the **minimum total fee** to reach city `n−1` within `maxTime` total travel time, or `-1` if impossible.",
    examples: [
      { in: "maxTime = 30, edges = [[0,1,10],[1,2,10],[2,5,10],[0,3,1],[3,4,10],[4,5,15]], passingFees = [5,1,2,20,20,3]", out: "11", note: "0→1→2→5 costs 30 time, fees 5+1+2+3=11" },
      { in: "maxTime = 29, edges = same, passingFees = same", out: "48", note: "the cheap route now exceeds the time limit" },
    ],
    constraints: ["2 ≤ n ≤ 1000", "n−1 ≤ edges.length ≤ 5000", "1 ≤ time, fee ≤ 1000", "10 ≤ maxTime ≤ 1000"],
    recognize:
      "Two competing quantities — **minimize fee** while keeping **time ≤ budget**. That's a **constrained shortest path**: the state isn't just the city, it's `(city, timeUsed)`. A Dijkstra ordered by fee (with a `minTime[node]` prune), or a DP over time, handles it.",
    figureItOut: [
      "The trap: this is *not* a normal shortest path, because the thing you minimize (fee) and the thing you constrain (time) are different. A route can be cheaper but slower, or pricier but faster — so 'best so far' must remember **both** dimensions.",
      "So expand the state. A node is `(city, timeSpent)`. You want the minimum total fee to arrive at `(n−1, t)` for any `t ≤ maxTime`. Reaching the *same city* with *more time and not-less fee* is strictly dominated and can be pruned.",
      "**Dijkstra-by-fee:** a min-heap ordered by accumulated fee, holding `(fee, time, city)`. Pop the cheapest; the first time you pop city `n−1`, its fee is the answer (fee only increases as you travel, so the ordering is valid). Relax a neighbour by adding the edge time and the neighbour's toll.",
      "The pruning that keeps it fast: track `minTime[city]` = the least travel time with which you've ever reached that city. Only expand a popped state if it improved the best time to that city (or simply skip neighbours that would exceed `maxTime`). Without it the heap can blow up.",
      "**DP alternative:** `dp[t][city]` = min fee to be at `city` having used exactly time `t`. Fill `t` from 0..maxTime, relaxing each edge; the answer is the min over all `t` of `dp[t][n−1]`. O(maxTime · E) — clean when maxTime is modest.",
    ],
    approaches: [
      {
        name: "Dijkstra by fee with a min-time prune",
        intuition: "Min-heap ordered by total fee; carry time in the state and only expand when you've reached a city faster than before.",
        time: "O(E · log(E))",
        timeWhy: "Each edge can be relaxed a bounded number of times; heap operations are logarithmic. The minTime prune keeps the number of useful states near linear in E.",
        space: "O(n + E)",
        spaceWhy: "Adjacency list, the minTime array, and the heap.",
        code: `int minCost(int maxTime, int[][] edges, int[] passingFees) {
    int n = passingFees.length;
    List<int[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] e : edges) {
        adj[e[0]].add(new int[]{e[1], e[2]});
        adj[e[1]].add(new int[]{e[0], e[2]});
    }
    int[] minTime = new int[n];
    Arrays.fill(minTime, Integer.MAX_VALUE);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]); // (fee, time, city)
    pq.offer(new int[]{passingFees[0], 0, 0});
    minTime[0] = 0;
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int fee = top[0], time = top[1], city = top[2];
        if (city == n - 1) return fee;            // cheapest first → answer
        for (int[] nb : adj[city]) {
            int next = nb[0], nt = time + nb[1];
            if (nt > maxTime) continue;           // over the time budget
            if (nt < minTime[next]) {             // reached next faster than before
                minTime[next] = nt;
                pq.offer(new int[]{fee + passingFees[next], nt, next});
            }
        }
    }
    return -1;
}`,
        walkthrough: [
          "Start (fee 5, time 0, city 0). Cheapest-fee expansion explores 0→1 (fee6,t10) and 0→3 (fee25,t1).",
          "Continue 1→2 (fee8,t20) → 2→5 (fee11,t30 ≤ 30). The pricier 3→4→5 path stays in the heap behind it.",
          "First pop of city 5 has fee 11 → return 11. With maxTime=29 the t=30 route is rejected, forcing the 48-fee route.",
        ],
      },
      {
        name: "DP over time",
        intuition: "dp[t][city] = min fee to be at city having used time t; relax every edge for each time level.",
        time: "O(maxTime · E)",
        timeWhy: "For each of maxTime time levels you relax along every edge.",
        space: "O(maxTime · n)",
        spaceWhy: "The dp table indexed by time and city.",
        code: `int minCost(int maxTime, int[][] edges, int[] passingFees) {
    int n = passingFees.length, INF = Integer.MAX_VALUE / 2;
    int[][] dp = new int[maxTime + 1][n];
    for (int[] row : dp) Arrays.fill(row, INF);
    dp[0][0] = passingFees[0];
    for (int t = 0; t <= maxTime; t++) {
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (t + w <= maxTime) {
                if (dp[t][u] != INF)
                    dp[t + w][v] = Math.min(dp[t + w][v], dp[t][u] + passingFees[v]);
                if (dp[t][v] != INF)
                    dp[t + w][u] = Math.min(dp[t + w][u], dp[t][v] + passingFees[u]);
            }
        }
    }
    int ans = INF;
    for (int t = 0; t <= maxTime; t++) ans = Math.min(ans, dp[t][n - 1]);
    return ans == INF ? -1 : ans;
}`,
        walkthrough: [
          "dp[0][0]=5. Relaxing edges fills dp[10][1]=6, dp[1][3]=25, then dp[20][2]=8, dp[30][5]=11...",
          "The minimum over all t of dp[t][5] is 11 (when maxTime ≥ 30).",
        ],
      },
    ],
    edgeCases: [
      "Start equals an isolated destination only via paths exceeding maxTime → −1.",
      "The starting city's fee is always paid (state seeded with passingFees[0]).",
      "A faster-but-pricier route can be the only feasible one under a tight maxTime — that's why time must live in the state, not be optimized away.",
    ],
    twists: [
      "**No time limit, minimize fee** → collapses to ordinary Dijkstra on node fees.",
      "**Minimize time within a fee budget** → swap the roles: Dijkstra by time with a fee-budget prune.",
      "**At most k stops** (Cheapest Flights Within K Stops) → the same 'augment the state with the constraint' trick, with k instead of time.",
    ],
    related: ["cheapest-flights-within-k-stops", "network-delay-time", "find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance"],
  },
];
