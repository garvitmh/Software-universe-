export const DEPLOYMENT_SCHEMA = {
  timelineStages: [
    { id: "git", label: "Git Push", desc: "Developer pushes code changes to production branch." },
    { id: "ci", label: "CI Pipeline", desc: "Running test suites and security scanning audits." },
    { id: "build", label: "Docker Build", desc: "Compiling image layer manifests and binaries." },
    { id: "registry", label: "Registry Push", desc: "Storing tagged docker image in secure container registry." },
    { id: "deploy", label: "Rolling Release", desc: "Instructing scheduler to perform incremental updates." },
    { id: "health", label: "Health Probes", desc: "Checking readiness state before exposing to traffic." }
  ],
  
  k8sAnalogies: [
    {
      title: "Pod",
      subtitle: "The Worker (Chef)",
      desc: "The smallest deployable unit. A single chef preparing meals. If they pass out (crash), the manager replaces them.",
      emoji: "🧑‍🍳"
    },
    {
      title: "Deployment",
      subtitle: "The Manager (Head Chef)",
      desc: "Declares how many replicas are needed. The manager who ensures there are always exactly 4 chefs working at all times.",
      emoji: "📋"
    },
    {
      title: "Service",
      subtitle: "The Hostess (Receptionist)",
      desc: "The single static entry point. Directs incoming hungry customers to whichever chefs are free and ready to cook.",
      emoji: "💁‍♀️"
    },
    {
      title: "Ingress",
      subtitle: "The Front Gate",
      desc: "Handles routing traffic from the outside street into specific receptionists based on the requested URL domain path.",
      emoji: "🚧"
    },
    {
      title: "Node",
      subtitle: "The Machine (Kitchen Table)",
      desc: "The physical server. The workspace counter where the chefs (pods) are stationed to perform their work.",
      emoji: "🥩"
    },
    {
      title: "Cluster",
      subtitle: "The Restaurant Branch",
      desc: "The complete setup. An entire operating restaurant containing tables, chefs, hostesses, and gates working in unison.",
      emoji: "🏪"
    }
  ],

  algorithms: [
    { id: "round-robin", name: "Round Robin", desc: "Distributes requests sequentially across the container list. Equal distribution." },
    { id: "least-conn", name: "Least Connections", desc: "Routes requests to the container handling the fewest active connections. Handles load spikes best." },
    { id: "weighted", name: "Weighted Distribution", desc: "Routes traffic based on assigned container capacities (e.g. 2x requests to container #1)." },
    { id: "sticky", name: "Sticky Sessions", desc: "Binds a user's session to a specific container via cookies. Ensures state preservation." }
  ]
};
