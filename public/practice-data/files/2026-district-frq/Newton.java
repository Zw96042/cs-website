import java.io.File;
import java.util.Scanner;

public class Newton {
    public static void main(String[] args) throws Throwable {
        new Newton().run();
    }

    public void run() throws Throwable {
        Scanner kb = new Scanner(new File("newton.dat"));

        int N = Integer.parseInt(kb.nextLine().trim());

        while(N-->0) {
            int H = kb.nextInt();

            for(int i = 1; i <= H; i++) {
                for(int k = H - i; k > 0; k--) {
                    System.out.print(" ");
                }
                for(int j = 1; j <= i * 2 - 1; j++) {
                    System.out.print("*");
                }
                System.out.println();
            }
            System.out.println();
        }
    }
}
