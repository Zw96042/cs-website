import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Scanner;

import static java.lang.System.out;

public class Dakota {
    public static void main(String[] args) throws IOException {
        Scanner input = new Scanner(new File("dakota.dat"));
       // PrintWriter out = new PrintWriter(new File("dakota.out"));
        int t = input.nextInt();
        final double TAX_RATE = 0.0825;
        String line = "+------------------------------------------+";

        for (int tc = 1; tc <= t; tc++) {
            String customer = input.next();
            int n = input.nextInt();
            double subtotal = 0.0;

            out.println(line);
            out.printf("| Invoice for %-28s |%n", customer);
            out.println(line);
            out.println("| Item         Qty     Price     Subtotal  |");
            out.println(line);

            for (int i = 0; i < n; i++) {
                String item = input.next();
                int qty = input.nextInt();
                double price = input.nextDouble();
                double itemSubtotal = qty * price;
                subtotal += itemSubtotal;

                out.printf("| %-11s %3d %10.2f %11.2f   |%n", item, qty, price, itemSubtotal);
            }

            double tax = subtotal * TAX_RATE;
            double total = subtotal + tax;

            out.println(line);
            out.printf("| Subtotal:%31.2f |%n", subtotal);
            out.printf("| Tax:%36.2f |%n", tax);
            out.printf("| Total:%34.2f |%n", total);
            out.println(line);
        }

        input.close();
      //  out.close();
    }

}
