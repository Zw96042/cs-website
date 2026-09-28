import java.io.File;
import java.util.ArrayList;
import java.util.Random;
import java.util.Scanner;

public class Bingo {
    int [][] granniesCard = new int[5][5];
    int grannyWins = 0;

    public static void main(String[] args) throws Throwable {
        new Bingo().run();
    }

    public void run() throws Throwable {
        Scanner kb = new Scanner(new File("bingo.dat"));

        for(int x = 0; x < 5; x++) {
            for(int y = 0; y < 5; y++) {
                granniesCard[x][y] = kb.nextInt();
            }
        }

        int times = kb.nextInt();

        while(times-->0) {
            int cards = kb.nextInt(); long seed = kb.nextLong();
            Random r = new Random(seed);
            grannyWins = 0;

            ArrayList<int[][]> bingoCards = new ArrayList<>();
            for(int x = 0; x < cards; x++) {
                int [][] card = new int[5][5];
                for(int i = 0; i < 5; i++) {
                    for (int j = 0; j < 5; j++) {
                        card[i][j] = kb.nextInt();
                    }
                }
                bingoCards.add(card);
            }
            bingoCards.addFirst(granniesCard);

            for(int x = 0; x < 1000; x++) {
                ArrayList<int[][]> gameCards = new ArrayList<>();
                for(int[][] card : bingoCards) {
                    int[][] copy = new int[5][5];
                    for(int i = 0; i < 5; i++)
                        copy[i] = card[i].clone();
                    gameCards.add(copy);
                }
                simulateGame(gameCards, r);
            }

            System.out.printf("%.1f%% Win Rate.%n", grannyWins / 10.0);
        }
    }
    private void simulateGame(ArrayList<int[][]> cards, Random r) {
        boolean done = false;

        while(!done) {
            int number = r.nextInt(1, 76);
            for(int [][] arr : cards) {
                for(int i = 0; i < 5; i++) {
                    for(int j = 0; j < 5; j++) {
                        if (arr[i][j] == number) {
                            arr[i][j] = 0;
                        }
                    }
                }
            }
            done = checkWin(cards);
        }
    }
    private boolean checkWin(ArrayList<int[][]> cards) {
        for(int x = 0; x < cards.size(); x++) {
            int [][] card = cards.get(x);
            // check rows
            for(int i = 0; i< 5; i++) {
                boolean win = true;
                for(int j = 0; j < 5; j++) {
                    if (card[i][j] != 0) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    if (x == 0)
                        grannyWins++;
                    return true;
                }
            }
            // check columns
            for(int j = 0; j< 5; j++) {
                boolean win = true;
                for(int i = 0; i < 5; i++) {
                    if (card[i][j] != 0) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    if (x == 0)
                        grannyWins++;
                    return true;
                }
            }
            if (card[0][0] == card[1][1] && card[1][1] == card[2][2] && card[2][2] == card[3][3] && card[3][3] == card[4][4]) {
                if(x == 0)
                    grannyWins++;
                return true;
            }
            if (card[0][4] == card[1][3] && card[1][3] == card[2][2] && card[2][2] == card[3][1] && card[3][1] == card[4][0]) {
                if(x == 0)
                    grannyWins++;
                return true;
            }
        }
        return false;
    }
}
