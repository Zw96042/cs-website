/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.*;
import java.util.*;
import java.util.regex.*;

public class Urvashi {
    static final long MAXW = 1000000000;
    public static void main(String[] args) throws IOException {
        (new Urvashi()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("urvashi.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 25;

        for (int testId = 1; testId <= T; testId++) {
            long ans = solve(scan);
            System.out.printf("Case #%d: ", testId);
            if (ans < 0) {
                System.out.println("IMPOSSIBLE");
            } else {
                System.out.println(ans);
            }
        }
    }

    public long solve(Scanner scan) throws IOException {
        int m = scan.nextInt();
        int k = scan.nextInt();
        String s = scan.next();
        String t = scan.next();
        assert 1 <= m && m <= 2000;

        assert Pattern.matches("^[a-z]{1,15}$", s);
        assert Pattern.matches("^[a-z]{1,15}$", t);

        List<List<Edge>> graph = new ArrayList<>();
        Map<String, Integer> lookup = new HashMap<>();
        for (int i = 0; i < m; i++) {
            String u = scan.next();
            String v = scan.next();
            long w = scan.nextLong();

            assert Pattern.matches("^[a-z]{1,15}$", u);
            assert Pattern.matches("^[a-z]{1,15}$", v);
            assert 1 <= w && w <= MAXW;

            addEdge(graph, lookup, u, v, w);
        }

        if (s.equals(t)) {
            return 0;
        }

        int n = lookup.size();
        if (!lookup.containsKey(s) || !lookup.containsKey(t)) {
            return -1;
        }

        int source = lookup.get(s);
        PriorityQueue<Edge> pq = new PriorityQueue<>();
        pq.add(new Edge(source, 0L));

        long[] dist = new long[n * (k + 1)];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[source] = 0L;

        while (!pq.isEmpty()) {
            Edge cur = pq.poll();
            int node = cur.dest;
            long curCost = cur.cost;

            if (curCost != dist[node]) {
                continue;
            }

            int u = node % n;
            int layer = node / n;
            for (Edge e : graph.get(u)) {
                int v = n * layer + e.dest;
                long newCost = curCost + getCost(layer, e.cost);

                if (newCost < dist[v]) {
                    dist[v] = newCost;
                    pq.add(new Edge(v, newCost));
                }
            }

            if (layer + 1 <= k) {
                int v = n * (layer + 1) + u;
                if (curCost < dist[v]) {
                    dist[v] = curCost;
                    pq.add(new Edge(v, curCost));
                }
            }
        }

        int dest = lookup.get(t);
        long ans = Long.MAX_VALUE;
        for (int layer = 0; layer <= k; ++layer) {
            ans = Math.min(ans, dist[n * layer + dest]);
        }

        if (ans == Long.MAX_VALUE) {
            return -1;
        } else {
            return ans;
        }
    }

    private static void addEdge(List<List<Edge>> graph, Map<String, Integer> lookup, String u, String v, long w) {
        if (!lookup.containsKey(u)) {
            lookup.put(u, lookup.size());
        }
        if (!lookup.containsKey(v)) {
            lookup.put(v, lookup.size());
        }

        int uId = lookup.get(u);
        int vId = lookup.get(v);

        while (graph.size() <= Math.max(uId, vId)) {
            graph.add(new ArrayList<>());
        }

        graph.get(uId).add(new Edge(vId, w));
        graph.get(vId).add(new Edge(uId, w));
    }

    private static long getCost(int layer, long w) {
        if (layer == 0) {
            return w;
        } else if (layer % 2 == 1) {
            return reverseLong(w);
        } else {
            while (w > 0 && w % 10 == 0) {
                w /= 10;
            }

            return w;
        }
    }

    private static long reverseLong(long u) {
        long ans = 0;
        while (u > 0) {
            ans = 10 * ans + (u % 10);
            u /= 10;
        }

        return ans;
    }

    private static class Edge implements Comparable<Edge> {
        public int dest;
        public long cost;

        Edge(int dest, long cost) {
            this.dest = dest;
            this.cost = cost;
        }

        @Override
        public int compareTo(Edge other) {
            return Long.compare(cost, other.cost);
        }
    }
}
