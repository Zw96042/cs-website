import java.io.*;
import java.util.*;

public class Eui {
    public static void main(String[] args) throws IOException {
        Scanner scan = new Scanner(new File("eui_student.dat"));
        int T = scan.nextInt();
        assert 1 <= T && T <= 50;

        for (int caseNum = 1; caseNum <= T; caseNum++) {
            int n = scan.nextInt();

            Map<String, List<Range>> months = new HashMap<>();
            for (int i = 0; i < n; i++) {
                String month = scan.next();
                int start = scan.nextInt();
                scan.next(); // read -
                int end = scan.nextInt();

                assert 1 <= start && start <= end;
                assert start <= end && end <= 28;

                if (!months.containsKey(month)) {
                    months.put(month, new ArrayList<>());
                }

                months.get(month).add(new Range(start, end));
            }

            int minAns = 0;
            int maxAns = 0;

            for (List<Range> ranges : months.values()) {
                Collections.sort(ranges);
                minAns += solveMin(ranges);
                maxAns += solveMax(ranges);
            }

            System.out.printf("Case #%d: %d %d\n", caseNum, minAns, maxAns);
        }
    }

    public static int solveMin(List<Range> ranges) {
        int ans = 0;
        int last = -1;
        for (Range range : ranges) {
            if (!range.contains(last)) {
                last = range.end;
                ++ans;
            }
        }

        return ans;
    }

    public static int solveMax(List<Range> ranges) {
        int ans = 0;
        int last = -1;
        for (Range range : ranges) {
            int next = Math.max(range.start, last + 1);
            if (next <= range.end) {
                ++ans;
                last = next;
            }
        }

        return ans;
    }

    public static class Range implements Comparable<Range> {
        int start;
        int end;

        public Range(int start, int end) {
            this.start = start;
            this.end = end;
        }

        public boolean contains(int x) {
            return start <= x && x <= end;
        }

        public int compareTo(Range other) {
            if (start == other.start) {
                return Integer.compare(end, other.end);
            } else {
                return Integer.compare(start, other.start);
            }
        }
    }
}
