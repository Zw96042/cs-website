import java.io.File;
import java.util.*;

public class Bongo {
    static Map<String, Integer> spamWordCounts = new HashMap<>();
    static Map<String, Integer> hamWordCounts = new HashMap<>();
    static Set<String> vocabulary = new HashSet<>();

    static int spamEmails = 0;
    static int hamEmails = 0;

    static int spamTotalWords = 0;
    static int hamTotalWords = 0;

    public static void main(String[] args) throws Throwable {
        new Bongo().run();
    }

    public void run() throws Throwable {
        Scanner sc = new Scanner(new File("bongo.dat"));

        int N = sc.nextInt();
        int M = sc.nextInt();
        sc.nextLine();

        // Read training emails
        for (int i = 0; i < N; i++) {
            String line = sc.nextLine();
            String[] parts = line.split(" ", 2);

            String label = parts[0];
            String[] words = parts[1].split(" ");

            if (label.equals("spam")) {
                spamEmails++;
                for (String word : words) {
                    vocabulary.add(word);
                    spamWordCounts.put(word, spamWordCounts.getOrDefault(word, 0) + 1);
                    spamTotalWords++;
                }
            } else {
                hamEmails++;
                for (String word : words) {
                    vocabulary.add(word);
                    hamWordCounts.put(word, hamWordCounts.getOrDefault(word, 0) + 1);
                    hamTotalWords++;
                }
            }
        }

        // Classify test emails
        for (int i = 0; i < M; i++) {
            String email = sc.nextLine();
            String result = classify(email);
            System.out.println(result);
        }

        sc.close();
    }
    static String classify(String email) {
        String[] words = email.split(" ");

        int totalEmails = spamEmails + hamEmails;

        double logSpam = Math.log((double) spamEmails / totalEmails);
        double logHam = Math.log((double) hamEmails / totalEmails);

        int vocabSize = vocabulary.size();

        for (String word : words) {

            int spamCount = spamWordCounts.getOrDefault(word, 0);
            int hamCount = hamWordCounts.getOrDefault(word, 0);

            double spamProb = (double) (spamCount + 1) / (spamTotalWords + vocabSize);
            double hamProb = (double) (hamCount + 1) / (hamTotalWords + vocabSize);

            logSpam += Math.log(spamProb);
            logHam += Math.log(hamProb);
        }

        if (logSpam > logHam) {
            return "spam";
        } else {
            return "ham";
        }
    }
}
