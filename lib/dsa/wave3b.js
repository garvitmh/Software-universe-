// NeetCode 150 — wave 3b (advanced graphs, backtracking remainder). Java.
export const WAVE3B = [
  // ───────────────────────────── ADVANCED GRAPHS ─────────────────────────────
  {
    slug: "redundant-connection",
    title: "Redundant Connection",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 684,
    statement:
      "You start with a tree of `n` nodes (labelled `1..n`) — that's `n − 1` edges and no cycle. One extra edge was added, given as `edges[i] = [a, b]`. Return the **edge that can be removed** so the result is again a tree. If several qualify, return the one that appears **last** in the input.",
    examples: [
      { in: "edges = [[1,2],[1,3],[2,3]]", out: "[2,3]", note: "1-2-3 forms a cycle; the last edge that closes it is [2,3]" },
      { in: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", out: "[1,4]", note: "1-2-3-4-1 is the cycle; [1,4] is the last edge inside it" },
    ],
    constraints: ["n == edges.length", "3 ≤ n ≤ 1000", "No repeated edges, no self-loops"],
    recognize:
      "A tree plus one edge has **exactly one cycle**. You're adding edges one at a time and asking 'does this edge connect two nodes that were *already* connected?' — that's the textbook **union-find** question. The first edge that joins two nodes already in the same group is the redundant one.",
    figureItOut: [
      "First, what makes the extra edge special? A tree on n nodes has n−1 edges and is fully connected with no cycle. Add one more edge between two nodes and you create **exactly one cycle**. The redundant edge is any edge on that cycle — and the problem wants the **last** such edge in input order.",
      "Brute force: for each edge, remove it, then check if the remaining n−1 edges still form a tree (connected + acyclic) via DFS. That's O(n) per edge × n edges = O(n²). Correct, but it re-explores the whole graph repeatedly.",
      "Reframe it as a *streaming* question. Process edges left to right, growing connected groups as you go. When you try to add edge (a, b), ask: **are a and b already in the same group?** If yes, this edge closes a cycle — it's redundant. If no, the edge legitimately merges two groups.",
      "'Which group is x in, and merge two groups' with near-O(1) cost each is exactly **union-find (disjoint set union)**. `find(x)` returns x's group representative; `union(a, b)` merges. With path compression + union by rank, each op is effectively O(α(n)) ≈ O(1).",
      "Because we scan in input order and return the first edge whose endpoints are already united, we automatically return the **last** redundant edge of the unique cycle — there's only one cycle, so the first 'already connected' we hit is the answer.",
    ],
    approaches: [
      {
        name: "Union-Find (optimal)",
        intuition: "Add edges one by one. The first edge whose two endpoints are already in the same set is the redundant one.",
        time: "O(n·α(n)) ≈ O(n)",
        timeWhy: "Each of the n edges does two finds and one union; with path compression + union by rank each is near-constant (inverse-Ackermann α).",
        space: "O(n)",
        spaceWhy: "Parent and rank arrays of size n+1.",
        code: `int[] findRedundantConnection(int[][] edges) {
    int n = edges.length;
    int[] parent = new int[n + 1];
    int[] rank = new int[n + 1];
    for (int i = 1; i <= n; i++) parent[i] = i;   // each node is its own group

    for (int[] e : edges) {
        if (!union(parent, rank, e[0], e[1])) return e;  // already connected → cycle
    }
    return new int[]{};
}

int find(int[] parent, int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];   // path compression (halving)
        x = parent[x];
    }
    return x;
}

// returns false if a and b were already in the same set (so this edge is redundant)
boolean union(int[] parent, int[] rank, int a, int b) {
    int ra = find(parent, a), rb = find(parent, b);
    if (ra == rb) return false;
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }  // attach smaller under larger
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
    return true;
}`,
        walkthrough: [
          "edges=[[1,2],[1,3],[2,3]]. parent=[_,1,2,3].",
          "union(1,2): roots 1,2 differ → merge, parent[2]=1.",
          "union(1,3): roots 1,3 differ → merge, parent[3]=1.",
          "union(2,3): find(2)=1, find(3)=1 → same set → return [2,3].",
        ],
      },
    ],
    edgeCases: [
      "The cycle can involve any subset of nodes — union-find doesn't care about the cycle's shape, only connectivity.",
      "Nodes are 1-indexed, so size the parent array as n+1 and skip index 0.",
      "There is always exactly one redundant edge (guaranteed by the problem), so the loop always finds an answer.",
    ],
    twists: [
      "**Redundant Connection II** (LeetCode 685, directed) → harder: a node can also gain two parents, so you check for the in-degree-2 case separately, then fall back to union-find.",
      "**Count connected components / number of provinces** → same union-find, but count distinct roots at the end instead of detecting a cycle.",
      "**Detect *any* cycle in an undirected graph** → union all edges; the first union that fails proves a cycle exists.",
    ],
    related: ["min-cost-to-connect-all-points", "number-of-islands"],
  },

  {
    slug: "network-delay-time",
    title: "Network Delay Time",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 743,
    statement:
      "A network of `n` nodes (`1..n`). `times[i] = [u, v, w]` means a signal from `u` reaches `v` after `w` time. A signal starts at node `k`. Return the time for **all** nodes to receive it, or `-1` if some node is unreachable.",
    examples: [
      { in: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", out: "2", note: "2→1 takes 1; 2→3→4 takes 2; the slowest is 2" },
      { in: "times = [[1,2,1]], n = 2, k = 1", out: "1" },
      { in: "times = [[1,2,1]], n = 2, k = 2", out: "-1", note: "node 1 never gets the signal" },
    ],
    constraints: ["1 ≤ k ≤ n ≤ 100", "1 ≤ times.length ≤ 6000", "0 ≤ w ≤ 100 (non-negative)"],
    recognize:
      "'Time for all nodes to receive the signal' = the **maximum shortest-path distance** from `k` to every node. Shortest paths from a single source with **non-negative** edge weights → **Dijkstra** (a min-heap of (dist, node)).",
    figureItOut: [
      "Rephrase the goal. A node receives the signal as soon as the *fastest* route reaches it — that's its **shortest path** from k. Everyone has the signal once the **last** node receives it, so the answer is `max` over all nodes of their shortest distance from k. If any node is unreachable, return −1.",
      "So this is single-source shortest path. The weights are non-negative (w ≥ 0), which is the precise condition that makes **Dijkstra** valid. Dijkstra's greedy step — 'the closest unfinalized node already has its final distance' — relies on no edge being able to *lower* a path later, which negative edges would violate.",
      "Mechanics: keep a `dist[]` array (∞ initially, 0 for k) and a min-heap ordered by distance. Pop the closest node; for each neighbor, if going through this node is cheaper, relax `dist[neighbor]` and push it.",
      "Why a heap? It hands you the next-closest unfinalized node in O(log n). Once you pop a node, its distance is final (greedy invariant), so you can skip any stale heap entry whose stored distance is worse than the recorded `dist[]`.",
      "Build an adjacency list from `times` first so each node's outgoing edges are O(1) to find. At the end, the answer is `max(dist)`; if any entry is still ∞, some node never got the signal → −1.",
    ],
    approaches: [
      {
        name: "Dijkstra with a min-heap (optimal)",
        intuition: "Greedily finalize the closest node each step, relaxing its neighbors. The answer is the largest finalized distance.",
        time: "O(E log V)",
        timeWhy: "Each edge can push one heap entry; every push/pop is O(log V). E edges dominate, so O(E log V).",
        space: "O(V + E)",
        spaceWhy: "Adjacency list (E), plus the dist array and heap (up to V/E entries).",
        code: `int networkDelayTime(int[][] times, int n, int k) {
    // adjacency list: node -> list of [neighbor, weight]
    List<int[]>[] adj = new List[n + 1];
    for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
    for (int[] t : times) adj[t[0]].add(new int[]{t[1], t[2]});

    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;

    // min-heap of [distanceSoFar, node]
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, k});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d = cur[0], node = cur[1];
        if (d > dist[node]) continue;          // stale entry, already finalized better
        for (int[] nb : adj[node]) {
            int next = nb[0], w = nb[1];
            if (d + w < dist[next]) {           // relaxation
                dist[next] = d + w;
                pq.offer(new int[]{dist[next], next});
            }
        }
    }

    int ans = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == Integer.MAX_VALUE) return -1;   // unreachable node
        ans = Math.max(ans, dist[i]);
    }
    return ans;
}`,
        walkthrough: [
          "k=2, n=4. dist=[_,∞,0,∞,∞]. heap=[(0,2)].",
          "pop (0,2): relax 1→dist1=1, 3→dist3=1. heap=[(1,1),(1,3)].",
          "pop (1,1): no outgoing edges. pop (1,3): relax 4→dist4=2.",
          "pop (2,4): done. dist=[_,1,0,1,2] → max = 2.",
        ],
      },
    ],
    edgeCases: [
      "A node with no incoming path stays ∞ → return −1.",
      "Self-loops or zero-weight edges are harmless; the `d > dist[node]` skip keeps stale duplicates cheap.",
      "Starting node k always has dist 0; if n == 1 the answer is 0.",
    ],
    twists: [
      "**Negative edge weights** → Dijkstra breaks; use Bellman-Ford (O(V·E)) which tolerates negatives (see Cheapest Flights).",
      "**Path of *fewest hops*, weights irrelevant** → plain BFS instead of a heap.",
      "**Path of *maximum* reliability/product** (LeetCode 1514) → a max-heap Dijkstra multiplying probabilities.",
    ],
    related: ["cheapest-flights-within-k-stops", "swim-in-rising-water"],
  },

  {
    slug: "cheapest-flights-within-k-stops",
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 787,
    statement:
      "Given `n` cities and `flights[i] = [from, to, price]`, find the **cheapest price** from `src` to `dst` using **at most `k` stops** (so at most `k + 1` flights). Return `-1` if no such route exists.",
    examples: [
      { in: "n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1", out: "700", note: "0→1→3 costs 700 (one stop); the cheaper 0→1→2→3=400 uses two stops — not allowed" },
      { in: "n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1", out: "200", note: "0→1→2 (one stop) beats the direct 0→2" },
      { in: "n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=0", out: "500", note: "with zero stops only the direct flight qualifies" },
    ],
    constraints: ["1 ≤ n ≤ 100", "0 ≤ flights.length ≤ n·(n−1)", "0 ≤ src, dst, k < n", "1 ≤ price ≤ 10⁴"],
    recognize:
      "Cheapest path with a **hard cap on the number of edges** (k+1 hops). Plain Dijkstra optimizes total cost but can't honor an edge-count limit. **Bellman-Ford**, which relaxes all edges in *rounds*, naturally bounds the hop count: run exactly `k + 1` rounds and each round adds at most one more hop.",
    figureItOut: [
      "The twist is the **stop limit**. A pure shortest-path algorithm (Dijkstra) would happily take a 3-hop route if it's cheaper — but here a cheaper route with too many stops is *invalid*. The cost and the hop-count must be tracked together.",
      "Key insight about Bellman-Ford: each 'relaxation round' over all edges lets a path grow by **at most one edge**. After round 1, `dist` holds the best 1-flight costs; after round 2, the best ≤2-flight costs; and so on. So running exactly **k + 1 rounds** gives the cheapest route using at most k+1 flights = at most k stops. That's the perfect fit for the constraint.",
      "There's a subtle bug to avoid: within a single round, if you read and write the *same* array, an edge relaxed earlier in the round could feed another edge later in the same round — letting two hops sneak in per round. Fix it by relaxing from a **snapshot** (`prev`) of last round's distances into a fresh `cur`.",
      "Compare with the alternatives. Dijkstra can't enforce the hop cap without augmenting the state to (cost, node, stopsUsed) — which works but is fiddlier. BFS level-by-level also works (each level = one more stop). Bellman-Ford is the cleanest expression of 'bounded number of edges'.",
      "Initialize `dist[src] = 0`, everything else ∞. After k+1 rounds, `dist[dst]` is the answer (or −1 if still ∞).",
    ],
    approaches: [
      {
        name: "Bellman-Ford, k+1 rounds (optimal & clean)",
        intuition: "Relax all edges k+1 times from a snapshot. Round r captures the best cost using ≤ r flights.",
        time: "O(k · E)",
        timeWhy: "k+1 rounds, each scanning all E edges once.",
        space: "O(n)",
        spaceWhy: "Two distance arrays of size n (prev + cur).",
        code: `int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    // k stops => at most k+1 flights => k+1 relaxation rounds
    for (int round = 0; round <= k; round++) {
        int[] prev = dist.clone();           // snapshot: only paths from the PREVIOUS round
        for (int[] f : flights) {
            int from = f[0], to = f[1], price = f[2];
            if (prev[from] == Integer.MAX_VALUE) continue;   // unreachable so far
            if (prev[from] + price < dist[to]) {
                dist[to] = prev[from] + price;
            }
        }
    }
    return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
}`,
        walkthrough: [
          "n=4, src=0, dst=3, k=1 → 2 rounds. dist=[0,∞,∞,∞].",
          "Round 0 (≤1 flight) from prev=[0,∞,∞,∞]: 0→1=100. dist=[0,100,∞,∞].",
          "Round 1 (≤2 flights) from prev=[0,100,∞,∞]: 1→2=200, 1→3=700. dist=[0,100,200,700].",
          "dist[3] = 700 (the 0→1→2→3=400 route needs round 2, beyond k+1).",
        ],
      },
      {
        name: "Dijkstra with stop count in the state",
        intuition: "Min-heap of (cost, node, stopsRemaining); only push a neighbor while stops remain.",
        time: "O(E·k log(E·k))",
        timeWhy: "Each (node, stops) state can be queued; the heap holds up to E·k entries.",
        space: "O(E·k)",
        spaceWhy: "Heap entries across all stop counts.",
        code: `int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    List<int[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] f : flights) adj[f[0]].add(new int[]{f[1], f[2]});

    // [cost, node, stopsLeft]; pop cheapest first
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src, k + 1});      // k+1 flights allowed

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int cost = cur[0], node = cur[1], stops = cur[2];
        if (node == dst) return cost;        // first pop of dst is cheapest valid route
        if (stops == 0) continue;
        for (int[] nb : adj[node]) {
            pq.offer(new int[]{cost + nb[1], nb[0], stops - 1});
        }
    }
    return -1;
}`,
        walkthrough: [
          "Pop (0,0,2). Push (100,1,1).",
          "Pop (100,1,1). Push (200,2,0) and (700,3,0).",
          "Pop (200,2,0): stops=0 → can't expand. Pop (700,3,0): node==dst → return 700.",
        ],
      },
    ],
    edgeCases: [
      "k = 0 → only direct flights are valid (one relaxation round).",
      "src == dst → cost 0 (dist[src] starts at 0).",
      "The snapshot (`prev`) is essential — relaxing in place would let one round add multiple hops and undercount stops.",
    ],
    twists: [
      "**No stop limit at all** → drop the rounds bound; it becomes ordinary Dijkstra.",
      "**Detect a negative cycle** → run a full n-th Bellman-Ford round; any further relaxation means a negative cycle exists.",
      "**Maximize reliability within k stops** → same round structure, multiply probabilities and keep the max instead of the min.",
    ],
    related: ["network-delay-time", "swim-in-rising-water"],
  },

  {
    slug: "min-cost-to-connect-all-points",
    title: "Min Cost to Connect All Points",
    difficulty: "Medium",
    pattern: "advanced-graphs",
    leetcode: 1584,
    statement:
      "Given `points[i] = [xi, yi]` on a plane, connect all points so any point reaches any other. The cost of connecting two points is their **Manhattan distance** `|xi − xj| + |yi − yj|`. Return the **minimum total cost**.",
    examples: [
      { in: "points = [[0,0],[2,2],[3,10],[5,2],[7,0]]", out: "20" },
      { in: "points = [[3,12],[-2,5],[-4,1]]", out: "18" },
    ],
    constraints: ["1 ≤ points.length ≤ 1000", "−10⁶ ≤ xi, yi ≤ 10⁶", "All points are distinct"],
    recognize:
      "'Connect everything at minimum total edge cost, no cycles needed' is the literal definition of a **Minimum Spanning Tree (MST)**. The graph is implicitly complete (every pair of points is an edge weighted by Manhattan distance), so **Prim** (grow a tree from one node, always adding the cheapest edge to a new node) fits the dense graph perfectly.",
    figureItOut: [
      "What are we actually building? A connected structure over all n points with minimum total cost. We never benefit from a cycle — a cycle has a redundant edge we could drop and still stay connected, lowering cost. So the optimal answer is a **tree** spanning all points: a **minimum spanning tree**.",
      "The graph here is **complete and implicit**: any two points can be connected, and the weight is their Manhattan distance. With n ≤ 1000 there are up to ~500k edges — a dense graph.",
      "Two classic MST algorithms. **Kruskal** sorts all E edges and adds them cheapest-first, skipping any that would form a cycle (union-find). That's O(E log E) — fine, but here E ≈ n² so sorting 500k edges is heavier. **Prim** grows the tree one node at a time, always pulling the cheapest edge that reaches a *new* node. For dense graphs, Prim is the natural choice.",
      "Prim mechanics: keep `minDist[v]` = cheapest known edge connecting v to the current tree. Repeatedly pick the unvisited node with the smallest `minDist`, add it (and its cost) to the tree, then relax: for every other unvisited node, update its `minDist` if this newly-added node offers a cheaper connection. Repeat until all n nodes are in.",
      "An array-scan Prim (pick the min by scanning) is O(n²) — perfect for a dense complete graph and avoids heap overhead. A heap-based Prim is O(E log V), better for sparse graphs. Here O(n²) is the right call.",
    ],
    approaches: [
      {
        name: "Prim's MST, O(n²) array scan (optimal for dense)",
        intuition: "Start the tree at point 0. Each step, pull in the unvisited point closest to the tree, add its edge cost, and relax everyone else's distance to the tree.",
        time: "O(n²)",
        timeWhy: "n iterations; each scans all n nodes to find the closest and to relax. No heap needed because the graph is complete.",
        space: "O(n)",
        spaceWhy: "minDist[] and visited[] arrays of size n.",
        code: `int minCostConnectPoints(int[][] points) {
    int n = points.length;
    int[] minDist = new int[n];          // cheapest edge from node i to the growing tree
    boolean[] inTree = new boolean[n];
    Arrays.fill(minDist, Integer.MAX_VALUE);
    minDist[0] = 0;                      // start the tree at point 0
    int total = 0;

    for (int iter = 0; iter < n; iter++) {
        // pick the unvisited node closest to the tree
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!inTree[v] && (u == -1 || minDist[v] < minDist[u])) u = v;
        }
        inTree[u] = true;
        total += minDist[u];

        // relax: every other node may now have a cheaper edge to the tree via u
        for (int v = 0; v < n; v++) {
            if (!inTree[v]) {
                int d = Math.abs(points[u][0] - points[v][0])
                      + Math.abs(points[u][1] - points[v][1]);
                if (d < minDist[v]) minDist[v] = d;
            }
        }
    }
    return total;
}`,
        walkthrough: [
          "points=[[0,0],[2,2],[3,10],[5,2],[7,0]]. minDist=[0,∞,∞,∞,∞].",
          "Pick 0 (cost 0). Relax distances from 0: minDist=[0,4,13,7,7].",
          "Pick node 1 (cost 4, total 4). Relax via 1 → distances to 2,3,4 may drop.",
          "Continue picking the closest each time; the chosen edge costs sum to 20.",
        ],
      },
      {
        name: "Kruskal's MST with union-find",
        intuition: "Generate all pair edges, sort cheapest-first, add an edge only if it joins two different components.",
        time: "O(n² log n)",
        timeWhy: "Building ~n²/2 edges and sorting them dominates; union-find ops are near-constant.",
        space: "O(n²)",
        spaceWhy: "Holds every pairwise edge before sorting.",
        code: `int minCostConnectPoints(int[][] points) {
    int n = points.length;
    List<int[]> edges = new ArrayList<>();   // [weight, i, j]
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            int w = Math.abs(points[i][0] - points[j][0])
                  + Math.abs(points[i][1] - points[j][1]);
            edges.add(new int[]{w, i, j});
        }
    edges.sort((a, b) -> a[0] - b[0]);

    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;

    int total = 0, used = 0;
    for (int[] e : edges) {
        int ra = find(parent, e[1]), rb = find(parent, e[2]);
        if (ra != rb) {                  // joins two components → keep this edge
            parent[ra] = rb;
            total += e[0];
            if (++used == n - 1) break;  // a tree on n nodes needs n-1 edges
        }
    }
    return total;
}

int find(int[] parent, int x) {
    while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
}`,
        walkthrough: [
          "Build all pairwise edges, sort ascending by Manhattan distance.",
          "Add cheapest edges in turn, skipping any whose endpoints already share a root.",
          "Stop once n−1 edges are accepted — the tree spans every point.",
        ],
      },
    ],
    edgeCases: [
      "Single point → no edges, total cost 0.",
      "All points collinear or coincident in distance — MST still well-defined; ties are broken arbitrarily without affecting the minimum total.",
      "Prim's O(n²) scan is preferred here because the graph is complete (≈n² edges); a heap would just add overhead.",
    ],
    twists: [
      "**Euclidean instead of Manhattan distance** → same MST logic, just change the weight formula (watch for floating-point ties).",
      "**Some points already connected for free** → seed those nodes into the tree (minDist 0) or pre-union them in Kruskal.",
      "**Maximum spanning tree** → sort descending in Kruskal, or pick the *farthest* node in Prim.",
    ],
    related: ["redundant-connection", "network-delay-time"],
  },

  {
    slug: "swim-in-rising-water",
    title: "Swim in Rising Water",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 778,
    statement:
      "An `n × n` grid where `grid[r][c]` is the elevation at that cell. At time `t`, water depth is `t` everywhere. You can swim from a cell to a 4-directionally adjacent cell only when **both** cells' elevations are ≤ `t` (swimming is instant). Starting at `(0,0)`, return the **least time** `t` to reach `(n−1, n−1)`.",
    examples: [
      { in: "grid = [[0,2],[1,3]]", out: "3", note: "must wait until t=3 so cell (1,1)=3 is submerged; then 0→1→3 is swimmable" },
      { in: "grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]", out: "16" },
    ],
    constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 50", "0 ≤ grid[i][j] < n²", "Each value is unique"],
    recognize:
      "You want the path from start to end that **minimizes the maximum cell elevation along it** (a 'minimax path' / bottleneck-shortest-path). A **Dijkstra-style** greedy with a min-heap works if you redefine 'distance' as the **maximum elevation seen so far** rather than a sum. (Binary-search-on-the-answer + BFS also solves it.)",
    figureItOut: [
      "Reframe the rule. To traverse a path, the water must be at least as high as the **highest** cell on that path — because every cell on the route must be submerged. The time to finish using a given path is therefore the **maximum elevation along it**. We want the path whose maximum is as **small** as possible.",
      "So this isn't 'shortest sum of weights' — it's 'minimize the bottleneck (the largest single value) on the path.' That's a **minimax path** problem.",
      "Adapt Dijkstra. Normally `dist[node]` = cheapest total cost to reach it, and you relax with `dist[u] + w`. Here, redefine `cost[cell]` = the smallest possible 'maximum elevation' to reach that cell, and relax with `max(cost[u], grid[neighbor])` instead of a sum. The greedy invariant still holds: once you pop a cell from the min-heap, its bottleneck cost is final, because using a higher-cost cell later can never lower an already-found maximum.",
      "Mechanics: min-heap ordered by the running maximum. Push `(grid[0][0], 0, 0)`. Pop the cell with the smallest running max; when it's the destination, that running max is the answer. For each neighbor, the cost to reach it via the current cell is `max(currentMax, grid[neighbor])`; if that beats its recorded best, push it.",
      "Alternative lens — **binary search on t**: for a candidate t, can you BFS/DFS from start to end using only cells ≤ t? `canReach(t)` is monotonic (more water never disconnects you), so binary-search the smallest feasible t in [0, n²−1]. O(n² log n²). The Dijkstra version is cleaner and a touch faster.",
    ],
    approaches: [
      {
        name: "Dijkstra on the bottleneck (min-heap, optimal)",
        intuition: "Treat a path's 'cost' as the highest elevation on it. Greedily expand the cell with the smallest running maximum until you reach the corner.",
        time: "O(n² log n)",
        timeWhy: "Each of the n² cells is finalized once; every heap push/pop is O(log n²) = O(log n).",
        space: "O(n²)",
        spaceWhy: "The visited grid and the heap can hold all n² cells.",
        code: `int swimInWater(int[][] grid) {
    int n = grid.length;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    boolean[][] visited = new boolean[n][n];

    // min-heap of [runningMaxElevation, row, col]
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{grid[0][0], 0, 0});

    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int t = cur[0], r = cur[1], c = cur[2];
        if (visited[r][c]) continue;          // already finalized with a smaller bottleneck
        if (r == n - 1 && c == n - 1) return t;  // reached the corner → answer
        visited[r][c] = true;

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0 || nc < 0 || nr >= n || nc >= n || visited[nr][nc]) continue;
            // cost to reach the neighbor = max of this path's bottleneck and its own height
            pq.offer(new int[]{Math.max(t, grid[nr][nc]), nr, nc});
        }
    }
    return -1;  // unreachable (won't happen on a valid grid)
}`,
        walkthrough: [
          "grid=[[0,2],[1,3]]. heap=[(0,0,0)].",
          "Pop (0,0,0). Push (max(0,2)=2,0,1) and (max(0,1)=1,1,0).",
          "Pop (1,1,0). Push (max(1,3)=3,1,1). Pop (2,0,1). Push (max(2,3)=3,1,1).",
          "Pop (3,1,1): it's the corner → return 3.",
        ],
      },
      {
        name: "Binary search on time + BFS feasibility",
        intuition: "Binary-search the smallest t for which a path using only cells ≤ t connects the corners.",
        time: "O(n² log n²)",
        timeWhy: "log(n²) feasibility checks, each a full O(n²) BFS over the grid.",
        space: "O(n²)",
        spaceWhy: "Visited grid plus the BFS queue.",
        code: `int swimInWater(int[][] grid) {
    int n = grid.length;
    int lo = grid[0][0], hi = n * n - 1;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canReach(grid, mid)) hi = mid;   // feasible → try smaller
        else lo = mid + 1;
    }
    return lo;
}

boolean canReach(int[][] grid, int t) {
    int n = grid.length;
    if (grid[0][0] > t) return false;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    boolean[][] seen = new boolean[n][n];
    Deque<int[]> q = new ArrayDeque<>();
    q.offer(new int[]{0, 0});
    seen[0][0] = true;
    while (!q.isEmpty()) {
        int[] cell = q.poll();
        if (cell[0] == n - 1 && cell[1] == n - 1) return true;
        for (int[] d : dirs) {
            int nr = cell[0] + d[0], nc = cell[1] + d[1];
            if (nr >= 0 && nc >= 0 && nr < n && nc < n
                    && !seen[nr][nc] && grid[nr][nc] <= t) {
                seen[nr][nc] = true;
                q.offer(new int[]{nr, nc});
            }
        }
    }
    return false;
}`,
        walkthrough: [
          "Search t in [0, n²−1]. canReach(t) is monotonic: once a t works, every larger t works.",
          "Each check floods from (0,0) through cells ≤ t and asks if the corner is reachable.",
          "Converges on the smallest feasible t.",
        ],
      },
    ],
    edgeCases: [
      "The answer is at least max(grid[0][0], grid[n-1][n-1]) — both endpoints must be submerged.",
      "n = 1 → answer is grid[0][0] (you're already at the destination).",
      "The `visited` skip in the heap version matters: a cell may be pushed several times with different running maxima; only its first (smallest) pop counts.",
    ],
    twists: [
      "**Path That Minimizes the Maximum effort** (LeetCode 1631) → identical minimax-Dijkstra, but the edge cost is `abs(height difference)` between adjacent cells.",
      "**Diagonal moves allowed (8 directions)** → extend the `dirs` array; the algorithm is unchanged.",
      "**Maximize the minimum elevation on the path** → flip to a max-heap and relax with `min(...)`.",
    ],
    related: ["network-delay-time", "cheapest-flights-within-k-stops"],
  },

  {
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    difficulty: "Hard",
    pattern: "advanced-graphs",
    leetcode: 269,
    statement:
      "You're given a list of `words` sorted lexicographically by the rules of an **unknown alphabet**. Derive a valid ordering of that alphabet's letters and return it as a string. If no valid order exists, return `\"\"`. Multiple valid orders may exist — return any.",
    examples: [
      { in: 'words = ["wrt","wrf","er","ett","rftt"]', out: '"wertf"', note: "w<e (from wrt vs er), r<t (wrt vs wrf via r/f), e<r, t<f" },
      { in: 'words = ["z","x"]', out: '"zx"', note: "z comes before x" },
      { in: 'words = ["z","x","z"]', out: '""', note: 'contradiction: z<x and x<z → no valid order' },
    ],
    constraints: ["1 ≤ words.length ≤ 100", "1 ≤ words[i].length ≤ 100", "lowercase English letters"],
    recognize:
      "Each pair of adjacent words reveals **one ordering constraint** between two letters (a 'must come before' relation). 'Find an ordering consistent with a set of precedence constraints' is **topological sort** over a directed graph; an impossible order means the graph has a **cycle**.",
    figureItOut: [
      "Where does the ordering information even come from? The word list is sorted. So for any two **adjacent** words, the **first position where they differ** tells you that the earlier word's letter comes before the later word's letter in the alien alphabet. Example: `wrt` before `wrf` → at index 2, `t` comes before `f`.",
      "Each such 'a before b' is a **directed edge** a → b. Collect all of them across adjacent word pairs. Letters that never appear in any constraint still belong in the output — include every letter you've seen as a node.",
      "Now you need an ordering of all letters that respects every 'before' edge. That's exactly a **topological sort** of the directed graph. Two standard methods: **Kahn's BFS** (repeatedly emit a node with in-degree 0) or DFS post-order. Kahn's also detects cycles for free.",
      "Cycle = contradiction = no valid alphabet. If after Kahn's BFS you haven't emitted **all** the letters, some were stuck in a cycle (their in-degree never hit 0) → return `\"\"`.",
      "One nasty edge case from the sorting rule itself: if word A is a **prefix** of word B but A comes **after** B (e.g. `[\"abc\", \"ab\"]`), that's an invalid dictionary — a longer word can't precede its own prefix. Detect this when you reach the end of the shorter word without finding a differing character, and return `\"\"`.",
    ],
    approaches: [
      {
        name: "Build precedence graph + Kahn's topological sort (optimal)",
        intuition: "Each adjacent word pair yields one edge a→b. Repeatedly output letters with no remaining prerequisites; a leftover means a cycle.",
        time: "O(C)",
        timeWhy: "C = total characters across all words. Building edges scans every character once; the topo sort touches each node and edge once (at most 26 nodes, 26² edges).",
        space: "O(1) (bounded by the 26-letter alphabet)",
        spaceWhy: "Adjacency map and in-degree over at most 26 letters and 26² edges — constant.",
        code: `String alienOrder(String[] words) {
    // 1. nodes: every letter that appears
    Map<Character, Set<Character>> adj = new HashMap<>();
    Map<Character, Integer> indeg = new HashMap<>();
    for (String w : words)
        for (char c : w.toCharArray()) {
            adj.putIfAbsent(c, new HashSet<>());
            indeg.putIfAbsent(c, 0);
        }

    // 2. edges: compare each adjacent pair at their first differing char
    for (int i = 0; i + 1 < words.length; i++) {
        String a = words[i], b = words[i + 1];
        int len = Math.min(a.length(), b.length());
        // invalid: longer word before its own prefix, e.g. "abc" then "ab"
        if (a.length() > b.length() && a.startsWith(b)) return "";
        for (int j = 0; j < len; j++) {
            char x = a.charAt(j), y = b.charAt(j);
            if (x != y) {
                if (!adj.get(x).contains(y)) {   // avoid double-counting in-degree
                    adj.get(x).add(y);
                    indeg.put(y, indeg.get(y) + 1);
                }
                break;                            // only the FIRST difference matters
            }
        }
    }

    // 3. Kahn's BFS: emit letters with in-degree 0
    Deque<Character> q = new ArrayDeque<>();
    for (char c : indeg.keySet()) if (indeg.get(c) == 0) q.offer(c);

    StringBuilder sb = new StringBuilder();
    while (!q.isEmpty()) {
        char c = q.poll();
        sb.append(c);
        for (char next : adj.get(c)) {
            indeg.put(next, indeg.get(next) - 1);
            if (indeg.get(next) == 0) q.offer(next);
        }
    }

    // 4. if not every letter was emitted, a cycle existed → no valid order
    return sb.length() == indeg.size() ? sb.toString() : "";
}`,
        walkthrough: [
          'words=["wrt","wrf","er","ett","rftt"]. Letters: w,r,t,f,e.',
          "Adjacent pairs give edges: wrt/wrf → t<f; wrf/er → w<e; er/ett → r<t; ett/rftt → e<r.",
          "in-degrees: w0, e1, r1, t1, f1. Start queue: [w].",
          "Emit w → e becomes 0 → emit e → r→0 → emit r → t→0 → emit t → f→0 → emit f. Result 'wertf'.",
        ],
      },
    ],
    edgeCases: [
      'Single word or all-identical words → no edges; return the letters in any order (e.g. their natural appearance order).',
      'Prefix-violation `["abc","ab"]` → return `""` (a longer word can\'t precede its prefix).',
      "Cycle (`[\"z\",\"x\",\"z\"]`) → in-degrees never all reach 0 → output shorter than the alphabet → return `\"\"`.",
      "Letters appearing only inside words (never in a differing position) must still be emitted — that's why every seen letter is added as a node.",
    ],
    twists: [
      "**DFS topological sort instead** → recurse, append to the order in post-order, and use a 3-color visited state to detect back-edges (cycles).",
      "**Return *all* valid orderings** → backtracking over every in-degree-0 choice at each step.",
      "**Lexicographically smallest valid order** (tie-break) → replace Kahn's queue with a min-heap of available letters (LeetCode 'smallest topo order').",
    ],
    related: ["course-schedule", "redundant-connection"],
  },

  // ───────────────────────────── BACKTRACKING ─────────────────────────────
  {
    slug: "subsets-ii",
    title: "Subsets II",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 90,
    statement:
      "Given an integer array `nums` that **may contain duplicates**, return **all possible subsets** (the power set). The solution set must not contain duplicate subsets; the subsets may be returned in any order.",
    examples: [
      { in: "nums = [1,2,2]", out: "[[],[1],[1,2],[1,2,2],[2],[2,2]]" },
      { in: "nums = [0]", out: "[[],[0]]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10", "−10 ≤ nums[i] ≤ 10"],
    recognize:
      "'All subsets' is the classic **backtracking** power-set enumeration (at each element, include it or not). The new wrinkle is **duplicates** — so the trick is **sort first**, then at each recursion depth **skip an element equal to its previous sibling**, which kills duplicate subsets without a hash set.",
    figureItOut: [
      "Without duplicates, the power set is the canonical backtracking tree: at each index you make a binary choice — take this element or skip it — and record the current subset at every node. 2ⁿ subsets.",
      "Duplicates break that directly. `[1,2,2]` would produce two different `[1,2]`s (one from each 2) and two `[2]`s — the same subset emitted twice. We need to dedupe.",
      "The clean fix: **sort the array** so equal values sit next to each other. Now the duplicates are all adjacent, and we can reason locally about them.",
      "The rule: **at a given recursion depth (same `start`), don't start a branch with a value equal to the one you just tried.** Concretely, in the loop `for (i = start; i < n; i++)`, skip when `i > start && nums[i] == nums[i-1]`. This means: the *first* of a run of equal values is allowed to begin a branch; later equal copies in the same loop are skipped — but you can still *continue* deeper into them (because going deeper uses a larger `start`).",
      "Why does the `i > start` guard (not `i > 0`) matter? It only skips a duplicate that's a **sibling at the same level**. The same value at a *deeper* level (chosen consecutively, like both 2s in `[2,2]`) is fine and must be kept — that's a different subset, not a duplicate.",
    ],
    approaches: [
      {
        name: "Sort + backtrack, skip equal siblings (optimal)",
        intuition: "Sort so equals are adjacent. Build subsets by choosing a next element ≥ start; within one loop, skip a value identical to the previous choice to avoid duplicate subsets.",
        time: "O(n · 2ⁿ)",
        timeWhy: "Up to 2ⁿ subsets; copying each into the result costs O(n).",
        space: "O(n)",
        spaceWhy: "Recursion depth and the current path are O(n) (excluding the output).",
        code: `List<List<Integer>> subsetsWithDup(int[] nums) {
    Arrays.sort(nums);                       // bring duplicates next to each other
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}

void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));          // every node is a valid subset
    for (int i = start; i < nums.length; i++) {
        if (i > start && nums[i] == nums[i - 1]) continue;  // skip duplicate sibling
        path.add(nums[i]);
        backtrack(nums, i + 1, path, res);   // recurse with start = i+1
        path.remove(path.size() - 1);        // un-choose (backtrack)
    }
}`,
        walkthrough: [
          "nums sorted = [1,2,2]. Add [] (root).",
          "i=0 take 1 → path[1], add [1]; deeper i=1 take 2 → [1,2]; deeper i=2 take 2 → [1,2,2].",
          "Back at depth with start=1: i=1 take 2 → [2]; deeper i=2 take 2 → [2,2].",
          "Back at start=1, i=2: i>start && nums[2]==nums[1] → skip (prevents a second [2]). Result has no duplicates.",
        ],
      },
    ],
    edgeCases: [
      "No duplicates → the skip never triggers; behaves like plain Subsets.",
      "All identical (e.g. [2,2,2]) → produces exactly [], [2], [2,2], [2,2,2].",
      "The empty subset is always included (added at the root before the loop).",
      "Sorting is mandatory — the skip rule relies on equal values being adjacent.",
    ],
    twists: [
      "**No duplicates** (LeetCode 78, Subsets) → drop the sort and the skip line.",
      "**Permutations with duplicates** (LeetCode 47) → same sort-then-skip idea, but track a `used[]` array and skip `nums[i]==nums[i-1] && !used[i-1]`.",
      "**Subsets summing to a target** → add a running sum and prune branches that overshoot.",
    ],
    related: ["subsets", "combination-sum-ii"],
  },

  {
    slug: "combination-sum-ii",
    title: "Combination Sum II",
    difficulty: "Medium",
    pattern: "backtracking",
    leetcode: 40,
    statement:
      "Given a collection of **candidate numbers** `candidates` (which may contain duplicates) and a `target`, find all **unique combinations** where the chosen numbers sum to `target`. **Each number may be used at most once.** The solution set must not contain duplicate combinations.",
    examples: [
      { in: "candidates = [10,1,2,7,6,1,5], target = 8", out: "[[1,1,6],[1,2,5],[1,7],[2,6]]" },
      { in: "candidates = [2,5,2,1,2], target = 5", out: "[[1,2,2],[5]]" },
    ],
    constraints: ["1 ≤ candidates.length ≤ 100", "1 ≤ candidates[i] ≤ 50", "1 ≤ target ≤ 30"],
    recognize:
      "'All combinations summing to a target, each element used once, no duplicate combinations' = **backtracking** with a moving `start` index (use-once) plus the **sort + skip-equal-siblings** dedup trick — the same duplicate-handling as Subsets II, now with a running sum and pruning.",
    figureItOut: [
      "Backtracking shape first: build a combination by choosing candidates left to right, each time advancing `start` to `i+1` so no element is reused. When the running sum hits `target`, record the combination; if it exceeds `target`, abandon this branch.",
      "Two dedup problems collide here. (a) **Use-once**: advance `start` past the chosen index so the *same position* can't be picked twice — that's the `i + 1` in the recursive call. (b) **No duplicate combinations** from duplicate *values* (the array has repeated numbers): this is the Subsets II problem again.",
      "So **sort the candidates** to make equal values adjacent, then apply the same rule: in the loop `for (i = start; ...)`, **skip when `i > start && candidates[i] == candidates[i-1]`** — the first of a run of equal values may begin a branch, later equal siblings at the same depth are skipped (they'd produce a combination identical to the first's).",
      "Add a **pruning** optimization: because the array is sorted ascending, once `candidates[i] > remaining` you can `break` the whole loop — every later candidate is at least as large and also overshoots. This trims huge swaths of the search tree.",
      "Track `remaining = target − sum` instead of carrying the sum; when `remaining == 0` you've found a valid combination, when `remaining < 0` you've overshot.",
    ],
    approaches: [
      {
        name: "Sort + backtrack, use-once, skip equal siblings, prune (optimal)",
        intuition: "Sort. Pick candidates left to right with start=i+1 (use-once); skip a value equal to the previous sibling (dedup); break early when the candidate already exceeds the remaining target.",
        time: "O(2ⁿ · n)",
        timeWhy: "Up to 2ⁿ subsets explored in the worst case; copying a found combination costs O(n). Sorting is O(n log n), dominated.",
        space: "O(n)",
        spaceWhy: "Recursion depth and the current path are bounded by n (excluding the output).",
        code: `List<List<Integer>> combinationSum2(int[] candidates, int target) {
    Arrays.sort(candidates);                 // duplicates adjacent + enables pruning
    List<List<Integer>> res = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), res);
    return res;
}

void backtrack(int[] cand, int remaining, int start,
               List<Integer> path, List<List<Integer>> res) {
    if (remaining == 0) {
        res.add(new ArrayList<>(path));      // exact hit → record this combination
        return;
    }
    for (int i = start; i < cand.length; i++) {
        if (i > start && cand[i] == cand[i - 1]) continue;  // skip duplicate sibling
        if (cand[i] > remaining) break;       // sorted → all later are bigger too, prune
        path.add(cand[i]);
        backtrack(cand, remaining - cand[i], i + 1, path, res);  // i+1 → use each once
        path.remove(path.size() - 1);         // un-choose
    }
}`,
        walkthrough: [
          "sorted = [1,1,2,5,6,7,10], target 8.",
          "Take 1(idx0) → rem 7; take 1(idx1) → rem 6; take 6 → rem 0 → record [1,1,6].",
          "Back up: from idx0's 1, take 2 → rem 5; take 5 → [1,2,5]; or take 7 → [1,7].",
          "At top level i=1 (second 1): i>start && cand[1]==cand[0] → skip, preventing duplicate combos. Later: take 2 → [2,6]. Result has 4 unique combinations.",
        ],
      },
    ],
    edgeCases: [
      "No combination sums to target → empty result list.",
      "Duplicates in candidates are the whole point — without sort+skip you'd emit the same combination multiple times.",
      "A candidate larger than target is pruned immediately by the `break`.",
      "Each index is used at most once thanks to `start = i + 1` (contrast Combination Sum I, which reuses with `start = i`).",
    ],
    twists: [
      "**Reuse allowed, no duplicate candidates** (LeetCode 39, Combination Sum) → recurse with `start = i` (not i+1) and drop the skip line.",
      "**Count combinations only** → return an int counter instead of building the lists.",
      "**Fixed combination length k** (Combination Sum III) → add a depth/size check alongside the sum.",
    ],
    related: ["combination-sum", "subsets-ii"],
  },

  {
    slug: "n-queens",
    title: "N-Queens",
    difficulty: "Hard",
    pattern: "backtracking",
    leetcode: 51,
    statement:
      "Place `n` queens on an `n × n` chessboard so that **no two attack each other** (no two share a row, column, or diagonal). Return **all distinct solutions**, each as a board where `'Q'` marks a queen and `'.'` an empty square.",
    examples: [
      { in: "n = 4", out: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', note: "the two distinct 4-queens placements" },
      { in: "n = 1", out: '[["Q"]]' },
    ],
    constraints: ["1 ≤ n ≤ 9"],
    recognize:
      "'Place items one per row under attack constraints, enumerate all valid arrangements' is the textbook **backtracking** problem: place a queen row by row, and for each column check it's safe against already-placed queens; the key is **O(1) conflict checks** using sets for columns and the two diagonal families.",
    figureItOut: [
      "Observe a structural fact that shrinks the search: since no two queens can share a **row**, each row has **exactly one** queen. So instead of choosing among n² squares, we go **row by row**, choosing just the *column* for that row — n choices per row, n rows.",
      "At each row, try every column; a column is valid if it doesn't conflict with any queen already placed in earlier rows. Place it, recurse to the next row, then remove it and try the next column. That's backtracking — choose, explore, un-choose.",
      "The naive safety check rescans all placed queens — O(n) per check. We can make it **O(1)** by precomputing what makes two queens attack diagonally. For a queen at (row, col): all squares on its **'/' diagonal** share the same `row + col`; all squares on its **'\\\\' diagonal** share the same `row − col`.",
      "So keep three sets while recursing: occupied **columns**, occupied **`row + col`** anti-diagonals, and occupied **`row − col`** main-diagonals. A square (r, c) is safe iff none of `cols`, `(r+c)`, `(r−c)` are already taken. Each check and update is O(1).",
      "When you successfully place a queen in **every** row (recursion reaches row == n), you've built a full valid board — snapshot it into the results. The diagonal-set idea is the heart of doing this efficiently.",
    ],
    approaches: [
      {
        name: "Backtrack row by row with column + diagonal sets (optimal)",
        intuition: "One queen per row. Track used columns and both diagonal families in sets for O(1) safety checks; on reaching the last row, record the board.",
        time: "O(n!)",
        timeWhy: "Row 0 has n column choices, row 1 has ≤ n−1 (one column blocked), etc. → roughly n! leaves; building each solved board costs O(n²).",
        space: "O(n)",
        spaceWhy: "Recursion depth n plus three sets each holding ≤ n entries (the board grid is output).",
        code: `List<List<String>> solveNQueens(int n) {
    List<List<String>> res = new ArrayList<>();
    int[] queens = new int[n];               // queens[r] = column of the queen in row r
    Set<Integer> cols = new HashSet<>();
    Set<Integer> diag1 = new HashSet<>();    // r + c  (anti-diagonal '/')
    Set<Integer> diag2 = new HashSet<>();    // r - c  (main diagonal '\\\\')
    backtrack(0, n, queens, cols, diag1, diag2, res);
    return res;
}

void backtrack(int row, int n, int[] queens,
               Set<Integer> cols, Set<Integer> diag1, Set<Integer> diag2,
               List<List<String>> res) {
    if (row == n) {                          // all rows filled → a valid board
        res.add(build(queens, n));
        return;
    }
    for (int col = 0; col < n; col++) {
        if (cols.contains(col) || diag1.contains(row + col) || diag2.contains(row - col))
            continue;                        // this square is attacked → skip
        // choose
        queens[row] = col;
        cols.add(col); diag1.add(row + col); diag2.add(row - col);
        // explore the next row
        backtrack(row + 1, n, queens, cols, diag1, diag2, res);
        // un-choose (backtrack)
        cols.remove(col); diag1.remove(row + col); diag2.remove(row - col);
    }
}

List<String> build(int[] queens, int n) {
    List<String> board = new ArrayList<>();
    for (int r = 0; r < n; r++) {
        char[] line = new char[n];
        Arrays.fill(line, '.');
        line[queens[r]] = 'Q';
        board.add(new String(line));
    }
    return board;
}`,
        walkthrough: [
          "n=4. Row 0: place at col 1 (cols{1}, diag1{1}, diag2{-1}).",
          "Row 1: cols 0,1,2 blocked by column/diagonal; col 3 is safe → place (queens=[1,3,..]).",
          "Row 2: only col 0 is safe → place. Row 3: only col 2 is safe → place → row==4 → record `.Q.. / ...Q / Q... / ..Q.`.",
          "Backtrack and explore other column choices to find the second solution `..Q. / Q... / ...Q / .Q..`.",
        ],
      },
    ],
    edgeCases: [
      "n = 1 → a single solution `[[\"Q\"]]`.",
      "n = 2 and n = 3 → no valid placement → empty result.",
      "Diagonals must use **both** families: `r + c` ('/') and `r − c` ('\\\\'). Forgetting one lets diagonal attacks slip through.",
    ],
    twists: [
      "**Count solutions only** (LeetCode 52, N-Queens II) → return an int counter; skip building boards. A bitmask version (three integer masks instead of sets) is the fastest.",
      "**Bitmask optimization** → represent cols/diags as bits of three ints; `available = ~(cols | diag1 | diag2)` and iterate set bits — much faster than HashSets.",
      "**Sudoku Solver / general constraint placement** → same place-recurse-remove skeleton with different validity rules.",
    ],
    related: ["combination-sum-ii", "subsets-ii"],
  },
];
