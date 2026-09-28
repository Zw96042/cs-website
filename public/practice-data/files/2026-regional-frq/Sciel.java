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

public class Sciel {
    public static void main(String[] args) throws IOException {
        new Sciel().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("sciel.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        while (T-- > 0) {
            String byteStream = file.readLine();
            Object o = null;
            try {
                o = Serializer.unmarshall(byteStream);
            } catch (Exception e) {
                System.out.println("Come on problem setter, get your classes straight!");
                return;
            }

            Testcase tc = null;
            if (o instanceof Testcase) {
                tc = Testcase.class.cast(o);
            } else {
                System.out.println("Come on problem setter, get your classes straight!");
                return;
            }

            out.println(tc.solve());
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

class Route implements Serializable {
    private static final long serialVersionUID = 1L;

    protected String city1, city2;

    @Override
    public String toString() {
        return String.format("(%s, %s)", city1, city2);
    }
}

enum Color {
    RED, GREEN, BLUE, YELLOW, PINK
}

class EdgeCost implements Serializable {
    private static final long serialVersionUID = 1L;

    protected Color color;
    protected int weight;

    @Override
    public String toString() {
        return String.format("%d %s", weight, color.name());
    }
}

class Board implements Serializable {
    private static final long serialVersionUID = 1L;

    protected HashMap<String, HashMap<String, EdgeCost>> graph;

    @Override
    public String toString() {
        return graph.toString();
    }
}

class Hand implements Serializable {
    private static final long serialVersionUID = 1L;

    protected HashMap<Color, Integer> cards;

    @Override
    public String toString() {
        return cards.toString();
    }
}

class Testcase implements Serializable {
    private static final long serialVersionUID = 1L;

    protected Board board;
    protected Hand hand;
    protected Route route;

    public String solve() {
        // BFS on state space (city, remaining_hand)
        Queue<State> queue = new LinkedList<State>();
        HashSet<String> visited = new HashSet<String>();

        queue.offer(new State(route.city1, hand.cards));
        visited.add(new State(route.city1, hand.cards).getStateKey());

        while (!queue.isEmpty()) {
            State current = queue.poll();

            // Check if we reached destination
            if (current.city.equals(route.city2)) {
                return "Tomorrow comes";
            }

            // Try all edges from current city
            for (String neighbor : board.graph.get(current.city).keySet()) {
                EdgeCost edge = board.graph.get(current.city).get(neighbor);

                // Check if we have enough cards of this color
                int available = current.hand.getOrDefault(edge.color, 0);
                if (available >= edge.weight) {
                    // Create new hand state with cards spent
                    HashMap<Color, Integer> newHand = new HashMap<Color, Integer>(current.hand);
                    newHand.put(edge.color, available - edge.weight);

                    // Add to queue if not visited
                    State newState = new State(neighbor, newHand);
                    String stateKey = newState.getStateKey();
                    if (!visited.contains(stateKey)) {
                        visited.add(stateKey);
                        queue.offer(newState);
                    }
                }
            }
        }

        return "When one falls, we continue";
    }

    private class State {
        private String city;
        private HashMap<Color, Integer> hand;

        public State(String city, HashMap<Color, Integer> hand) {
            this.city = city;
            this.hand = hand;
        }

        private String getStateKey() {
            return String.format("%s|%s", city, hand.toString());
        }
    }

    @Override
    public String toString() {
        return String.format("Board: %s\nRoute: %s\nHand: %s\nPossible: %b", board.toString(), route.toString(),
                hand.toString(), solve().equals("Tomorrow comes"));
    }
}
