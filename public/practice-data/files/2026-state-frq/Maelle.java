import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Serializable;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;

public class Maelle {
    public static void main(String[] args) throws IOException {
        new Maelle().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("maelle.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        for (int t = 0; t < T; t++) {
            String byteStream = file.readLine();
            Object o = null;
            try {
                o = Serializer.unmarshall(byteStream);
            } catch (ClassNotFoundException e) {
                out.println("Come on problem setter, get your classes straight!");
                continue;
            }

            Graph graph = null;
            if (o instanceof Graph) {
                graph = Graph.class.cast(o);
            } else {
                out.println("Come on problem setter, get your classes straight!");
                continue;
            }
            out.println(graph.toString());
        }
    }
}

class Serializer {
    public static String marshall(Serializable o) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(baos);
        oos.writeObject(o);
        String encodedData = Base64.getEncoder().encodeToString(baos.toByteArray());
        baos.close();
        oos.close();
        return encodedData;
    }

    public static Object unmarshall(String s) throws ClassNotFoundException, IOException {
        byte[] data = Base64.getDecoder().decode(s);
        ByteArrayInputStream bais = new ByteArrayInputStream(data);
        ObjectInputStream ois = new ObjectInputStream(bais);
        Object o = ois.readObject();
        bais.close();
        ois.close();
        return o;
    }
}

enum Directedness {
    Undirected, Directed;
}

enum Cyclicity {
    Cyclic, Acyclic;
}

enum Connectedness {
    Connected, Disconnected, Weakly_Connected, Strongly_Connected, Unilaterally_Connected;
}

class Graph implements Serializable {
    public static final long serialVersionUID = 1L;

    private HashMap<Integer, HashSet<Integer>> g;
    private int n, m;

    public Graph(HashMap<Integer, HashSet<Integer>> g, int n, int m) {
        this.g = g;
        this.n = n;
        this.m = m;
    }

    protected Directedness directedness;
    protected Cyclicity cyclicity;
    protected Connectedness connectedness;

    public Connectedness getConnectedness() {
        boolean connected = undirectedBFS(this.g);
        if (directedness == Directedness.Undirected) {
            // Graph is either connected or disconnected
            if (connected) {
                this.connectedness = Connectedness.Connected;
                return Connectedness.Connected;
            } else {
                this.connectedness = Connectedness.Disconnected;
                return Connectedness.Disconnected;
            }
        } else {
            // Graph is either weakly, strongly, unilaterally connected or disconnected
            this.connectedness = classifyConnectedness();
            if (this.connectedness != Connectedness.Disconnected) {
                return this.connectedness;
            }

            // Check for weakly connected graph
            HashMap<Integer, HashSet<Integer>> undirected = new HashMap<Integer, HashSet<Integer>>();
            for (int u = 0; u < n; u++) {
                undirected.put(u, new HashSet<Integer>());
            }
            for (int u = 0; u < n; u++) {
                HashSet<Integer> e = g.get(u);
                for (int v : e) {
                    undirected.get(u).add(v);
                    undirected.get(v).add(u);
                }
            }
            if (undirectedBFS(undirected)) {
                this.connectedness = Connectedness.Weakly_Connected;
                return Connectedness.Weakly_Connected;
            }
            return Connectedness.Disconnected;
        }
    }

    private boolean undirectedBFS(HashMap<Integer, HashSet<Integer>> graph) {
        boolean[] visited = new boolean[n];
        int count = 0;

        Queue<Integer> toVisit = new LinkedList<Integer>();
        toVisit.add(0);
        visited[0] = true;
        count++;
        while (!toVisit.isEmpty()) {
            int u = toVisit.poll();
            for (int v : graph.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    count++;
                    toVisit.add(v);
                }
            }
        }
        return count == n;
    }

    private Connectedness classifyConnectedness() {
        int[] index = new int[n];
        int[] low = new int[n];
        boolean[] onStack = new boolean[n];
        LinkedList<Integer> stack = new LinkedList<Integer>();
        int[] currentIndex = { 0 };
        int[] sccId = new int[n];
        int[] sccCount = { 0 };

        for (int i = 0; i < n; i++) {
            index[i] = -1;
        }
        for (int u = 0; u < n; u++) {
            if (index[u] == -1) {
                tarjanDFS(u, index, low, onStack, stack, currentIndex, sccId, sccCount);
            }
        }
        int comps = sccCount[0];

        // If there's only one SCC, it's strongly connected
        if (comps == 1) {
            return Connectedness.Strongly_Connected;
        }

        // Step 2: Build condensed DAG in-degree and out-degree counts
        int[] indeg = new int[comps];
        int[] outdeg = new int[comps];
        for (int u = 0; u < n; u++) {
            for (int v : g.get(u)) {
                if (sccId[u] != sccId[v]) {
                    outdeg[sccId[u]]++;
                    indeg[sccId[v]]++;
                }
            }
        }

        // Step 3: Count number of source and sink SCCs
        int sources = 0, sinks = 0;
        for (int i = 0; i < comps; i++) {
            if (indeg[i] == 0) {
                sources++;
            }
            if (outdeg[i] == 0) {
                sinks++;
            }
        }

        // Step 4: unilateral connectivity condition
        // Must have no more than 1 source and no more than 1 sink
        if (sources <= 1 && sinks <= 1) {
            return Connectedness.Unilaterally_Connected;
        }
        return Connectedness.Disconnected;
    }

    private void tarjanDFS(int u, int[] index, int[] low, boolean[] onStack, LinkedList<Integer> stack,
            int[] currentIndex, int[] sccId, int[] sccCount) {

        index[u] = low[u] = currentIndex[0]++;
        stack.push(u);
        onStack[u] = true;

        for (int v : g.get(u)) {
            if (index[v] == -1) {
                tarjanDFS(v, index, low, onStack, stack, currentIndex, sccId, sccCount);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], index[v]);
            }
        }

        // If u is root of SCC
        if (low[u] == index[u]) {
            while (true) {
                int v = stack.pop();
                onStack[v] = false;
                sccId[v] = sccCount[0];
                if (v == u) {
                    break;
                }
            }
            sccCount[0]++;
        }
    }

    @Override
    public String toString() {
        getConnectedness();

        if (directedness == Directedness.Undirected && connectedness == Connectedness.Connected
                && cyclicity == Cyclicity.Acyclic) {
            return String.format("Tree (%s, %s, %s Graph)", directedness, connectedness, cyclicity);
        }

        StringBuilder sb = new StringBuilder();
        sb.append(directedness.toString()).append(", ");
        sb.append(connectedness.toString().replaceAll("_", " ")).append(", ");
        sb.append(cyclicity.toString()).append(" Graph");
        return sb.toString();
    }
}