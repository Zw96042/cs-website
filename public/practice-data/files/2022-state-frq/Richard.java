/*
 * UIL Computer Science 2022
 * State Packet Solution
 */

import java.io.*;
import java.util.*;
import java.util.regex.*;

public class Richard2 {
    public static void main(String[] args) throws IOException {
        (new Richard2()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("richard.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 20;

        for (int testId = 1; testId <= T; testId++) {
            String ans = solve(scan);
            System.out.printf("Password #%d: %s%n", testId, ans);
        }
    }

    static final long MAX_PERM_IDX = 2147483647L;

    public String solve(Scanner scan) throws IOException {
        long idx = scan.nextLong();
        char[] bytes = scan.next().toCharArray();
        int n = bytes.length;

        assert 1 <= n && n <= 50;
        assert 1 <= idx && idx <= MAX_PERM_IDX;
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                assert bytes[i] != bytes[j];
            }
        }

        long numPerms = factorial(n);
        assert numPerms == -1 || idx <= numPerms;

        int[] perm = new int[n];
        makePerm(perm, 0, n, idx - 1);

        char[] res = new char[n];
        Arrays.sort(bytes);
        for (int i = 0; i < n; ++i) {
            res[i] = bytes[perm[i]];
        }

        return new String(res);
    }

    /**
     * Compute the k-th permutation, and save it in
     * perm[idx..]. Runs in O(n^2) time.
     */
    public void makePerm(int[] perm, int idx, int n, long k) {
        if (n == 0) {
            return;
        }

        long fac = factorial(n - 1);
        if (fac < 0) {
            // Factorial is too large, treat it as infinite.
            perm[idx] = 0;
            makePerm(perm, idx + 1, n - 1, k);
        } else {
            perm[idx] = (int)(k / fac);
            makePerm(perm, idx + 1, n - 1, k % fac);
        }

        // Shift the values appropriately
        for (int i = idx + 1; i < idx + n; i++) {
            if (perm[i] >= perm[idx]) {
                perm[i] += 1;
            }
        }
    }

    // TODO: Cache? Shouldn't really matter
    // Computes the factorial, but returns -1 if too large.
    public long factorial(long n) {
        final long BOUND = 20;
        if (n >= BOUND) {
            return -1;
        }

        long ans = 1;
        for (int i = 1; i <= n; i++) {
            ans *= i;
        }

        return ans;
    }
}
