import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;

import static java.lang.System.out;


public class Rio {
    static class Entry {
        String time;
        int seconds;
        String field;
        String match;
        String event;
        int order; // preserves original input order for stable sorting

        public Entry(String time, String field, String match, String event, int order) {
            this.time = time;
            this.seconds = toSeconds(time);
            this.field = field;
            this.match = match;
            this.event = event;
            this.order = order;
        }

        private static int toSeconds(String t) {
            String[] parts = t.split(":");
            int h = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            int s = Integer.parseInt(parts[2]);
            return h * 3600 + m * 60 + s;
        }
    }

    public static void main(String[] args) throws IOException {
        Scanner input = new Scanner(new File("rio_judge.dat"));
        PrintWriter out = new PrintWriter(new File("rio_judge.out"));
        int T = Integer.parseInt(input.nextLine().trim());

        for (int tc = 1; tc <= T; tc++) {
            int F = Integer.parseInt(input.nextLine().trim());

            ArrayList<Entry> all = new ArrayList<Entry>();
            int globalOrder = 0;

            for (int i = 0; i < F; i++) {
                String fieldName = input.nextLine().trim();
                int N = Integer.parseInt(input.nextLine().trim());

                for (int j = 0; j < N; j++) {
                    String line = input.nextLine().trim();
                    String[] parts = line.split("\\s+");
                    String time = parts[0];
                    String match = parts[1];
                    String event = parts[2];
                    all.add(new Entry(time, fieldName, match, event, globalOrder++));
                }
            }

            // Stable sort by time, then by original input order
            Collections.sort(all, new Comparator<Entry>() {
                public int compare(Entry a, Entry b) {
                    if (a.seconds != b.seconds) {
                        return a.seconds - b.seconds;
                    }
                    return a.order - b.order;
                }
            });

            out.println("==============");
            for (int i = 0; i < all.size(); i++) {
                Entry e = all.get(i);
                out.println((i + 1) + ". " + e.time + " " + e.field + " " + e.match + " " + e.event);
            }
            out.println();


            // Per match, across all fields, remember whether QUEUED or START has been seen
            HashMap<String, Boolean> seenQueued = new HashMap<String, Boolean>();
            HashMap<String, Boolean> seenStart = new HashMap<String, Boolean>();

            ArrayList<String> invalidMessages = new ArrayList<String>();
            TreeSet<String> replayMatches = new TreeSet<String>();

            for (Entry e : all) {

                if (!seenQueued.containsKey(e.match)) seenQueued.put(e.match, false);
                if (!seenStart.containsKey(e.match)) seenStart.put(e.match, false);

                if (e.event.equals("START")) {
                    if (!seenQueued.get(e.match)) {
                        invalidMessages.add(e.match + " -> START before QUEUED on field " + e.field);
                    }
                    seenStart.put(e.match, true);
                } else if (e.event.equals("POSTED")) {
                    if (!seenStart.get(e.match)) {
                        invalidMessages.add(e.match + " -> POSTED before START on field " + e.field);
                    }
                } else if (e.event.equals("QUEUED")) {
                    seenQueued.put(e.match, true);
                } else if (e.event.equals("REPLAY")) {
                    replayMatches.add(e.match);
                }
            }

            out.println("Invalid Matches:");
            if (invalidMessages.size() == 0) {
                out.println("NONE");
            } else {
                for (String s : invalidMessages) {
                    out.println(s);
                }
            }
            out.println();

            out.println("Replay Matches:");
            if (replayMatches.size() == 0) {
                out.println("NONE");
            } else {
                for (String s : replayMatches) {
                    out.println(s);
                }
            }
            out.println();

            out.println("Time Range: " + all.get(0).time + " to " + all.get(all.size() - 1).time);
            out.println("==============");
            out.println();
        }

        input.close();
        out.close();
    }
}