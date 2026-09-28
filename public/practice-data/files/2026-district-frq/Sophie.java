import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.StringTokenizer;

public class Sophie {
    public static void main(String[] args) throws IOException {
        new Sophie().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("sophie.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    private class UnionFind<T> {
        private HashMap<T, Integer> objectToIndex;
        private T[] objects;
        private int[] p;

        public UnionFind(int size, T[] initialObjects) {
            objectToIndex = new HashMap<T, Integer>(size);
            for (int i = 0; i < size; i++) {
                objectToIndex.put(initialObjects[i], i);
            }
            objects = initialObjects;
            p = new int[size];
            Arrays.fill(p, -1);
        }

        public T find(T object) {
            int index = objectToIndex.get(object);
            return objects[find(index)];
        }

        private int find(int x) {
            if (p[x] < 0) {
                return x;
            }
            int px = find(p[x]);
            p[x] = px;
            return px;
        }

        public void union(T x, T y) {
            int indexX = objectToIndex.get(x);
            int indexY = objectToIndex.get(y);
            union(indexX, indexY);
        }

        private int union(int x, int y) {
            int px = find(x);
            int py = find(y);
            if (px == py) {
                return -1;
            }
            if (p[py] < p[px]) {
                int save = py;
                py = px;
                px = save;
            }
            p[px] += p[py];
            p[py] = px;
            return px;
        }
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        while (T-- > 0) {
            StringTokenizer st = new StringTokenizer(file.readLine());
            int P = Integer.parseInt(st.nextToken());
            int V = Integer.parseInt(st.nextToken());
            int E = Integer.parseInt(st.nextToken());
            int Q = Integer.parseInt(st.nextToken());

            String colors = file.readLine();
            String[] cities = file.readLine().split(" ");
            st = new StringTokenizer(colors);
            HashMap<String, UnionFind<String>> graph = new HashMap<String, UnionFind<String>>();
            for (int i = 0; i < P; i++) {
                String color = st.nextToken();
                UnionFind<String> uf = new UnionFind<String>(V, cities);
                graph.put(color, uf);
            }

            for (int i = 0; i < E; i++) {
                String[] parts = file.readLine().split(" ");
                graph.get(parts[2]).union(parts[0], parts[1]);
            }

            for (int i = 0; i < Q; i++) {
                String[] parts = file.readLine().split(" ");
                out.println(graph.get(parts[2]).find(parts[0]).equals(graph.get(parts[2]).find(parts[1]))
                        ? "Route Completed"
                        : "Route Not Completed");
            }
        }
    }
}
