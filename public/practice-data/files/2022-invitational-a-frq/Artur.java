import java.io.*;
import java.util.*;

public class Artur {
    public static void main(String[] args) {
        int halfWidth = 20;

        String[] labels = {"0.01%", "0.1%", "1%", "10%", "100%"};
        int p = 0;

        for (int s = halfWidth; s > 0; --s) {
            char filler = s % 4 == 1 ? '-' : ' ';
            for (int i = 1; i < s; ++i) {
                System.out.print(' ');
            }
            System.out.print("/");
            for (int i = s; i < halfWidth; ++i) {
                System.out.print(filler);
            }
            for (int i = s; i < halfWidth; ++i) {
                System.out.print(filler);
            }
            System.out.print("\\");

            if (s % 4 == 3) {
                System.out.print("--->");
                System.out.println(labels[p++]);
            } else {
                System.out.println();
            }
        }
    }
}
