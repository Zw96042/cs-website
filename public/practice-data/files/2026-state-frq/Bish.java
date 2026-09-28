import java.io.File;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Scanner;

public class Bish {
    public static void main(String[] args) throws Throwable {
        new Bish().run();
    }

    public void run() throws Throwable {
        Scanner kb = new Scanner(new File("bish.dat"));

        long N = Integer.parseInt(kb.nextLine().trim());

        while (N-- > 0) {
            int r = kb.nextInt(), c = kb.nextInt();

            long[][] mat = new long[r][c];

            for (int x = 0; x < r; x++) {
                for (int y = 0; y < c; y++) {
                    mat[x][y] = kb.nextInt();
                }
            }
            int startx = kb.nextInt(), starty = kb.nextInt(), endx = kb.nextInt(), endy = kb.nextInt();
            System.out.println(bfs(startx, starty, endx, endy, mat));
        }
    }

    public long bfs(int sx, int sy, int ex, int ey, long[][] mat) {
        int R = mat.length, C = mat[0].length;
        boolean[][] visited = new boolean[R][C];

        // priority queue entries: {cost, x, y}
        PriorityQueue<long[]> pq = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        pq.add(new long[]{mat[sx][sy], sx, sy});

        int[] dx = {1, -1, 0, 0};
        int[] dy = {0, 0, 1, -1};

        while (!pq.isEmpty()) {
            long[] cur = pq.poll();
            long cost = cur[0];
            int x = (int) cur[1], y = (int) cur[2];

            if (visited[x][y]) continue;
            visited[x][y] = true;

            if (x == ex && y == ey) return cost;

            for (int d = 0; d < 4; d++) {
                int nx = x + dx[d], ny = y + dy[d];
                if (nx >= 0 && nx < R && ny >= 0 && ny < C && !visited[nx][ny]) {
                    pq.add(new long[]{Math.max(cost, mat[nx][ny]), nx, ny});
                }
            }
        }
        return -1;
    }
}