import java.io.*;
import java.util.*;

public class Krithika {
    static final long MAXA = 1000000000000000000L;
    static final long START_BIT = 1L << 61;

    public static void main(String[] args) throws IOException {
        (new Krithika()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("krithika.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 50;

        for (int testId = 1; testId <= T; testId++) {
            long ans = solve(scan);
            System.out.printf("Case #%d: %d%n", testId, ans);
        }
    }

    public long solve(Scanner scan) throws IOException {
        int n = scan.nextInt();
        int k = scan.nextInt();
        assert 1 <= n && n <= 1000;
        assert 1 <= k && k <= n;

        long[] a = new long[n];
        for (int i = 0; i < n; i++) {
            a[i] = scan.nextLong();

            assert 1 <= a[i] && a[i] <= MAXA;
        }

        assert START_BIT >= MAXA;

        long ans = 0;
        for (long bit = START_BIT; bit > 0; bit >>= 1) {
            int freq = 0;
            ans |= bit;

            for (long x : a) {
                if ((x & ans) == ans) {
                    freq++;
                }
            }

            // Only keep the bit if we have enough
            if (freq < k) {
                ans ^= bit;
            }
        }

        return ans;
    }
}
