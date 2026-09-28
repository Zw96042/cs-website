import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Bango {

    static final Map<String, Integer> TIER_SCORE = new HashMap<>();
    static {
        TIER_SCORE.put("Bronze",   1);
        TIER_SCORE.put("Silver",   2);
        TIER_SCORE.put("Gold",     3);
        TIER_SCORE.put("Platinum", 4);
        TIER_SCORE.put("Diamond",  5);
    }

    static class Player {
        // Raw fields
        String username;
        String tier;
        int wins, losses, kills, deaths, assists, headshots;

        // Computed metrics
        int    tierScore;
        double winRate;
        double combatScore;
        double headshotPct;

        Player(String username, String tier,
               int wins, int losses,
               int kills, int deaths,
               int assists, int headshots) {
            this.username  = username;
            this.tier      = tier;
            this.wins      = wins;
            this.losses    = losses;
            this.kills     = kills;
            this.deaths    = deaths;
            this.assists   = assists;
            this.headshots = headshots;

            this.tierScore    = TIER_SCORE.get(tier);
            this.winRate      = (double) wins / (wins + losses);
            this.combatScore  = (kills * 1.0 + assists * 0.5) / Math.max(deaths, 1);
            this.headshotPct  = (double) headshots / Math.max(kills, 1) * 100.0;
        }
    }

    // Comparator: higher tier > higher winRate > higher combatScore > higher HS% > username A-Z
    static final Comparator<Player> RANKING = Comparator
            .comparingInt((Player p) -> -p.tierScore)
            .thenComparingDouble((Player p) -> -p.winRate)
            .thenComparingDouble((Player p) -> -p.combatScore)
            .thenComparingDouble((Player p) -> -p.headshotPct)
            .thenComparing(p -> p.username);

    static final String SEPARATOR = "------------------------------------------------------------------------";

    // Column widths (not counting separators)
    // RANK=6, USERNAME=22, TIER=10, WIN%=8, COMBAT=8, HS%=7
    static String formatRow(String rank, String username, String tier,
                            String winPct, String combat, String hsPct) {
        return String.format("%-6s | %-22s | %-10s | %-8s | %-8s | %-7s",
                rank, username, tier, winPct, combat, hsPct);
    }

    public static void main(String[] args) throws FileNotFoundException {
        Scanner sc = new Scanner(new File("bango.dat"));

        int n = Integer.parseInt(sc.nextLine().trim());
        List<Player> players = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split("\\s+");
            String username  = parts[0];
            String tier      = parts[1];
            int wins         = Integer.parseInt(parts[2]);
            int losses       = Integer.parseInt(parts[3]);
            int kills        = Integer.parseInt(parts[4]);
            int deaths       = Integer.parseInt(parts[5]);
            int assists      = Integer.parseInt(parts[6]);
            int headshots    = Integer.parseInt(parts[7]);
            players.add(new Player(username, tier, wins, losses, kills, deaths, assists, headshots));
        }

        players.sort(RANKING);

        // Print table
        System.out.println(SEPARATOR);
        System.out.println(formatRow("PLACE", "USERNAME", "RANK", "WIN%", "COMBAT", "HS%"));
        System.out.println(SEPARATOR);

        for (int i = 0; i < players.size(); i++) {
            Player p = players.get(i);
            String rank    = "#" + (i + 1);
            String tier    = "[" + p.tier + "]";
            String winPct  = String.format("%.2f", p.winRate * 100);
            String combat  = String.format("%.2f", p.combatScore);
            String hsPct   = String.format("%.2f", p.headshotPct);
            System.out.println(formatRow(rank, p.username, tier, winPct, combat, hsPct));
        }

        System.out.println(SEPARATOR);
        sc.close();
    }
}