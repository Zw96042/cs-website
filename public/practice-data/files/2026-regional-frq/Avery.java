import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;

import static java.lang.System.out;

public class Avery {
    public static void main( String[] args ) throws FileNotFoundException {
      //  PrintWriter out = new PrintWriter(new File("avery_judge.out"));

        out.println("          .-----.\n" +
                "         /   _   \\\n" +
                "        |   (0)   |\n" +
                "        |    _    |\n" +
                " _______ \\_______/ _______\n" +
                "|   _   |---------|   _   |\n" +
                "|  |_|  |=========|  |_|  |\n" +
                "|_     _|---------|_     _|\n" +
                "  |   |  /   _   \\  |   |\n" +
                "  |   | |   (_)   | |   |\n" +
                "  |   |  \\_______/  |   |\n" +
                "  |   |   /     \\   |   |\n" +
                "  |   |  |  UIL  |  |   |\n" +
                "  |___|  |_______|  |___|\n" +
                "  |___|  |_______|  |___|\n" +
                "  || ||  | 2026  |  || ||\n" +
                "  || ||  |_______|  || ||\n" +
                " _||_||_ /       \\ _||_||_\n" +
                "|_______|         |_______|");

        out.close();
    }
}
