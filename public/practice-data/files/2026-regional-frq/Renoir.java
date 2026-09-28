import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.StringTokenizer;

public class Renoir {
    public static void main(String[] args) throws IOException {
        new Renoir().run();
    }

    private void run() throws IOException {
        BufferedReader file = new BufferedReader(new FileReader("renoir.dat"));
        PrintWriter out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));

        solve(file, out);

        file.close();
        out.close();
    }

    public void solve(BufferedReader file, PrintWriter out) throws IOException {
        int T = Integer.parseInt(file.readLine());
        while (T-- > 0) {
            StringTokenizer st = new StringTokenizer(file.readLine());
            int x = Integer.parseInt(st.nextToken());
            int y = Integer.parseInt(st.nextToken());
            int z = Integer.parseInt(st.nextToken());

            // Determine which number evenly divides the lcm of the other two
            int lcmXY = lcm(x, y);
            int lcmXZ = lcm(x, z);
            int lcmYZ = lcm(y, z);
            if (lcmXY % z == 0) {
                out.println(lcmXZ + lcmYZ - x - y - z);
            } else if (lcmXZ % y == 0) {
                out.println(lcmXY + lcmYZ - x - y - z);
            } else if (lcmYZ % x == 0) {
                out.println(lcmXY + lcmXZ - x - y - z);
            } else {
                System.exit(1);
            }
        }
    }

    private int lcm(int a, int b) {
        return (a / gcd(a, b)) * b;
    }

    private int gcd(int a, int b) {
        if (b == 0) {
            return a;
        }
        return gcd(b, a % b);
    }
}
