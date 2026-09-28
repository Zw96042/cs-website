import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

import static java.lang.System.out;


public class Micah {
    public static void main(String[] args) throws IOException {
        Scanner input = new Scanner(new File("micah_student.dat"));
        PrintWriter out = new PrintWriter(new File("micah_student.out"));
        int t = input.nextInt();

        for (int tc = 1; tc <= t; tc++) {
            int n = input.nextInt();
            int x = 0, y = 0;
            int minX = 0, maxX = 0, minY = 0, maxY = 0;
            int total = 0;
            int north = 0, south = 0, east = 0, west = 0;

            out.println("#########################");


            for (int i = 1; i <= n; i++) {
                String dir = input.next();
                int dist = input.nextInt();
                total += dist;

                if (dir.equals("N")) {
                    y += dist;
                    north++;
                } else if (dir.equals("S")) {
                    y -= dist;
                    south++;
                } else if (dir.equals("E")) {
                    x += dist;
                    east++;
                } else if (dir.equals("W")) {
                    x -= dist;
                    west++;
                }

                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);

                out.println("Leg " + i + " -> (" + x + "," + y + ")");
            }

            out.println();
            out.println("Final location : (" + x + "," + y + ")");
            out.println("Distance       : " + total);
            out.println("Bounds         : x = [" + minX + "," + maxX + "], y = [" + minY + "," + maxY + "]");
            out.println("Commands       : N=" + north + " S=" + south + " E=" + east + " W=" + west);
            out.println("#########################");
            out.println();
        }
        out.close();
        input.close();
    }
}