import java.io.*;
import java.util.*;
import java.util.regex.*;

public class Ricardo {
    public static void main(String[] args) throws IOException {
        (new Ricardo()).run();
    }

    public void run() throws IOException {
        Scanner scan = new Scanner(new File("ricardo.dat"));
        int T = scan.nextInt();

        assert 1 <= T && T <= 50;

        for (int testId = 1; testId <= T; testId++) {
            long ans = solve(scan);
            System.out.printf("Case #%d: %d%n", testId, ans);
        }
    }

    public long solve(Scanner scan) throws IOException {
        String workout = scan.next();

        assert Pattern.matches("^[a-z,|()]{1,200}$", workout);
        assert workout.indexOf("()") == -1;

        Parser parser = new Parser(workout);

        long ans = parser.count();
        assert parser.idx == workout.length();

        return ans;
    }

    private class Parser {
        String s;
        int idx;

        Parser(String s) {
            this.s = s;
            this.idx = 0;
        }

        public long count() {
            if (idx == s.length()) {
                return 1;
            }

            if (s.charAt(idx) == '(') {
                boolean foundOr = false;
                boolean foundAnd = false;

                idx++;
                long res = count();
                while (s.charAt(idx) != ')') {
                    if (s.charAt(idx) == '|') {
                        foundOr = true;
                        idx++;
                        long sub = count();
                        res += sub;
                    } else if (s.charAt(idx) == ',') {
                        foundAnd = true;
                        idx++;
                        long sub = count();
                        res *= sub;
                    } else {
                        System.out.printf("Found unexpected char at index %d%n", idx);
                        assert false;
                    }
                }
                idx++;

                assert !(foundOr && foundAnd);

                return res;
            } else {
                int start = idx;
                while (idx < s.length() && 'a' <= s.charAt(idx) && s.charAt(idx) <= 'z') {
                    idx++;
                }

                return 1;
            }
        }
    }
}
