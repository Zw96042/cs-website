import java.util.*;
import java.io.*;
import static java.lang.System.out;

public class Rumi {
    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(new File("rumi.dat"));
//        PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("rumi_student.out")));
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();


        double startX = 3.0, startY = 4.0, startZ = 0.0;
        double currentX = startX, currentY = startY, currentZ = startZ;
        double totalDistance = 0;

        for (int i = 0; i < n; i++) {
            double nextX = sc.nextDouble();
            double nextY = sc.nextDouble();
            double nextZ = sc.nextDouble();

            totalDistance += calculateDist(currentX, currentY, currentZ, nextX, nextY, nextZ);


            currentX = nextX;
            currentY = nextY;
            currentZ = nextZ;
        }

        // Return to start (3, 4, 0)
        totalDistance += calculateDist(currentX, currentY, currentZ, startX, startY, startZ);

        out.printf("Total Distance: %.2f units\n", totalDistance);
//        out.close();
    }

    public static double calculateDist(double x1, double y1, double z1, double x2, double y2, double z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    }
}