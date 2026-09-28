import java.awt.*;
import java.io.File;
import java.util.Random;
import java.util.Scanner;

public class Bosh {
    public static void main(String[] args) throws Throwable {
        new Bosh().run();
    }

    public void run() throws Throwable {
        Scanner kb = new Scanner(new File("bosh.dat"));

        int times = kb.nextInt();

        while(times-->0) {
            int n = kb.nextInt();
            long r = kb.nextLong();

            int[] xPoints = new int[n];
            int[] yPoints = new int[n];
            for (int i = 0; i < n; i++) {
                xPoints[i] = kb.nextInt();
                yPoints[i] = kb.nextInt();
            }

            double exactArea     = shoelaceArea(xPoints, yPoints, n);
            double awtEstimate   = monteCarlo(xPoints, yPoints, n, r);

            System.out.printf("Exact = %.2f%nEstimate = %.2f%nDifference = %.2f%%%n", exactArea, awtEstimate, percentDifference(exactArea, awtEstimate));
            if (times != 0)
                System.out.println();
        }
    }

    static double percentDifference(double a, double b) {
        double difference = Math.abs(a - b);
        double average = (Math.abs(a) + Math.abs(b)) / 2.0;
        return (difference / average) * 100.0;
    }

    // Approximate the area of a polygon.
    static double monteCarlo(int[] xPoints, int[] yPoints, int n, long r) {
        int minX = xPoints[0], maxX = xPoints[0];
        int minY = yPoints[0], maxY = yPoints[0];
        for (int i = 0; i < n; i++) {
            minX = Math.min(minX, xPoints[i]);
            maxX = Math.max(maxX, xPoints[i]);
            minY = Math.min(minY, yPoints[i]);
            maxY = Math.max(maxY, yPoints[i]);
        }

        double boxArea = (double)(maxX - minX) * (maxY - minY);

        Polygon awtPolygon = new Polygon(xPoints, yPoints, n);

        Random rand = new Random(r);
        int hits = 0;
        int totalPoints = 100_000;

        for (int i = 0; i < totalPoints; i++) {
            double px = minX + rand.nextDouble() * (maxX - minX);
            double py = minY + rand.nextDouble() * (maxY - minY);

            boolean inside = awtPolygon.contains(px, py);

            if (inside) hits++;
        }

        return boxArea * ((double) hits / totalPoints);
    }

    // Shoelace formula: exact area of any simple polygon in O(N)
    static double shoelaceArea(int[] xPoints, int[] yPoints, int n) {
        double area = 0;
        for (int i = 0; i < n; i++) {
            int j = (i + 1) % n;
            area += (double) xPoints[i] * yPoints[j];
            area -= (double) xPoints[j] * yPoints[i];
        }
        return Math.abs(area) / 2.0;
    }
}
