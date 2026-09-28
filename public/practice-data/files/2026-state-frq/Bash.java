import java.io.File;
import java.util.*;

public class Bash {
    public static void main(String[] args) throws Throwable {
        new Bash().run();
    }

    public void run() throws Throwable {
        Scanner kb = new Scanner(new File("bash.dat"));

        int games = kb.nextInt();
        long seed = kb.nextLong();

        Random r = new Random(seed);

        double totalXWins = 0;
        double totalOWins = 0;
        double totalTies = 0;

        for(int times = 0; times < games; times++) {
            Random rand = new Random(r.nextLong());

            UltimateTicTacToe game = new UltimateTicTacToe();

            while(!game.isGameOver()) {
                int spot = game.getPlacementSpot(rand);
                game.placeChar(spot);
            }
            char winner = game.getWinner(game.bigBoard);
            if (winner == 'O') {
                System.out.println("O wins!");
                totalOWins++;
            } else if(winner == 'X') {
                System.out.println("X wins!");
                totalXWins++;
            } else {
                System.out.println("Tie");
                totalTies++;
            }
            game.printGameState();
            System.out.println("-".repeat(12));
        }
        System.out.printf("X: %.2f%%%nO: %.2f%%%nTie: %.2f%%%n", totalXWins / games * 100, totalOWins / games * 100, totalTies / games * 100);
    }
}
class UltimateTicTacToe {
    HashMap<Integer, char [][]> games;
    char [][] bigBoard;
    int currentBoard;
    int currentPlayer;
    char [] placements = new char[] {'X', 'O'};

    public UltimateTicTacToe() {
        games = new HashMap<>();
        for(int x = 1; x <= 9; x++) {
            games.put(x, newBoard());
        }
        bigBoard = newBoard();
        currentBoard = 5;
        currentPlayer = 0;
    }
    public int getPlacementSpot(Random r) {
        int largest = 0;
        char [][] board = games.get(currentBoard);
        for(int x = 0; x < 3; x++) {
            for(int y = 0; y < 3; y++) {
                if (board[x][y] == '.')
                    largest++;
            }
        }
        return r.nextInt(1, largest + 1);
    }
    public void placeChar(int spot) {
        char [][] board = games.get(currentBoard);
        int s = 1;
        for(int x = 0; x < 3; x++) {
            for(int y = 0; y < 3; y++) {
                if (board[x][y] != '.')
                    continue;
                if (spot == s) {
                    board[x][y] = placements[currentPlayer];
                    currentPlayer = (currentPlayer + 1) % 2;
                    char winner = getWinner(board);
                    if (winner != '.') {
                        int i = (currentBoard - 1) / 3;
                        int j = (currentBoard - 1) % 3;
                        bigBoard[i][j] = winner;
                    }
                    int nextSpot = x * 3 + y + 1;
                    if (isFinished(games.get(nextSpot))) {
                        currentBoard = getNextAvailableBoard();
                    } else {
                        currentBoard = nextSpot;
                    }
                    return;
                }
                s++;
            }
        }
    }
    public boolean isGameOver() {
        // Someone won
        if (getWinner(bigBoard) != '.')
            return true;
        // Game is tied
        if (currentBoard == -1)
            return true;
        // Game is still going
        return false;
    }
    public char getWinner(char[][] board) {
        HashSet<String> list = new HashSet<>();
        for(int x = 0; x < 3; x++) {
            StringBuilder row = new StringBuilder();
            StringBuilder col = new StringBuilder();
            for(int y = 0; y < 3; y++) {
                row.append(board[x][y]);
                col.append(board[y][x]);
            }
            list.add(row.toString());
            list.add(col.toString());
        }
        list.add(""+board[0][0] + board[1][1] + board[2][2]);
        list.add(""+board[0][2] + board[1][1] + board[2][0]);
        if (list.contains("XXX"))
            return 'X';
        if (list.contains("OOO"))
            return 'O';
        return '.';
    }
    private int getNextAvailableBoard() {
        for(int x = 1; x <= 9; x++) {
            if (!isFinished(games.get(x)))
                return x;
        }
        return -1;
    }
    // returns true if there is a winner or the board has no empty spots.
    private boolean isFinished(char[][] board) {
        if (getWinner(board) != '.')
            return true;
        for(char [] c : board)
            for(char ch : c)
                if (ch == '.')
                    return false;
        return true;
    }
    private char[][] newBoard() {
        return new char[][] {{'.','.','.'}, {'.','.','.'}, {'.','.','.'}};
    }
    public void printGameState() {
        char [][] big = new char[11][11];
        for(char [] c : big)
            Arrays.fill(c, ' ');

        for (int n = 1; n <= 9; n++) {
            int startRow = ((n - 1) / 3) * 4;
            int startCol = ((n - 1) % 3) * 4;
            char winner = bigBoard[(n - 1) / 3][(n - 1) % 3];

            if (winner == 'X') {
                char[][] bigX = {
                        {'\\', ' ', '/'},
                        {' ', 'X', ' '},
                        {'/', ' ', '\\'}
                };
                for (int x = 0; x < 3; x++)
                    for (int y = 0; y < 3; y++)
                        big[startRow + x][startCol + y] = bigX[x][y];
            } else if (winner == 'O') {
                char[][] bigO = {
                        {'/', '-', '\\'},
                        {'|', ' ', '|'},
                        {'\\', '-', '/'}
                };
                for (int x = 0; x < 3; x++)
                    for (int y = 0; y < 3; y++)
                        big[startRow + x][startCol + y] = bigO[x][y];
            } else {
                char[][] small = games.get(n);
                for (int x = 0; x < 3; x++)
                    for (int y = 0; y < 3; y++)
                        big[startRow + x][startCol + y] = small[x][y];
            }
        }
        for(char [] c : big)
            System.out.println(c);
    }
}